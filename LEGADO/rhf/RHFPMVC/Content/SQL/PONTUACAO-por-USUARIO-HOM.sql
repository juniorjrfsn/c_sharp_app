;WITH 
USUARIO_Q AS ( -- ligação de usuários com questões respondidas às questões e respostas do questionário
SELECT 
	eve.eve_num_evento
	, que.[que_num_questionario] 
	, usr.usr_num_usuario
	, eqqrQUIZ.[qst_num_questao]
	, qsr.[qsr_num_resposta]
FROM 
[pms_eventos_homologacao].[dbo].eve_eventos eve
INNER JOIN [pms_eventos_homologacao].[dbo].[eve_questionarios] que ON(eve.eve_num_evento = que.eve_num_evento)
INNER JOIN [pms_eventos_homologacao].[dbo].[eve_usuarios_respostas] ure ON(
	eve.eve_num_evento = que.eve_num_evento AND ure.[que_num_questionario] = que.[que_num_questionario]
)
INNER JOIN [pms_eventos_homologacao].[dbo].[eve_usuarios] usr ON(ure.usr_num_usuario = usr.usr_num_usuario)
INNER JOIN [pms_eventos_homologacao].[dbo].[eve_questionarios_questoes_respostas] eqqrQUIZ ON(
    eve.[eve_num_evento] = eqqrQUIZ.[eve_num_evento]
    AND ure.[que_num_questionario] = eqqrQUIZ.[que_num_questionario]
)
INNER JOIN [pms_eventos_homologacao].[dbo].[eve_questoes_respostas] qsr ON( ure.[qst_num_questao] = qsr.[qst_num_questao])
WHERE eve.eve_num_evento = 1 AND que.[que_num_questionario] = 1  -- AND usr.usr_num_usuario = 4
AND usr.usr_num_usuario IN(
	SELECT ure.usr_num_usuario FROM [pms_eventos_homologacao].[dbo].[eve_usuarios_respostas] ure WHERE 
	eve.eve_num_evento = ure.eve_num_evento AND  que.[que_num_questionario] = ure.[que_num_questionario]
) 
GROUP BY
	eve.eve_num_evento
	, que.[que_num_questionario] 
	, usr.usr_num_usuario
	, eqqrQUIZ.[qst_num_questao]
	, qsr.[qsr_num_resposta]
)
,RESP_MARCADO AS ( SELECT  -- correlaciona as respostas marcadas com às do questionário
		uq.eve_num_evento,
		uq.que_num_questionario,
		uq.usr_num_usuario,
		uq.qst_num_questao,
		uq.qsr_num_resposta
		 , CASE WHEN qsr.[qsr_e_correta] IS NOT NULL THEN qsr.[qsr_e_correta] ELSE 'N' END AS [qsr_e_correta]
		 , ure.[qsr_num_resposta] AS [qsr_num_resposta_USUARIO]
		, COUNT(uq.qsr_num_resposta) OVER(
            PARTITION BY uq.eve_num_evento, uq.que_num_questionario, uq.qst_num_questao, uq.usr_num_usuario 
        ) AS [PONTO_ALVO_Q]
	
	FROM USUARIO_Q uq
	LEFT JOIN [pms_eventos_homologacao].[dbo].[eve_usuarios_respostas] ure ON(
		uq.eve_num_evento = ure.eve_num_evento 
		AND uq.[que_num_questionario] = ure.[que_num_questionario]
		AND uq.usr_num_usuario = ure.usr_num_usuario
		AND uq.qst_num_questao = ure.qst_num_questao 
		AND uq.[qsr_num_resposta] = ure.[qsr_num_resposta] 
	)
	LEFT JOIN [pms_eventos_homologacao].[dbo].[eve_questoes_respostas] qsr ON( 
		uq.[qst_num_questao] = qsr.[qst_num_questao]
		AND uq.[qsr_num_resposta] = qsr.[qsr_num_resposta]
	)
)
,RESP_PONTO AS (SELECT -- pontua cada resposta baseado no campo qsr_e_correta
	eve_num_evento,	
	que_num_questionario,
	usr_num_usuario,
	qst_num_questao,
	qsr_num_resposta,
	qsr_e_correta,
	qsr_num_resposta_USUARIO
	, CASE 
		WHEN 
			(qsr_num_resposta_USUARIO IS NOT NULL AND qsr_num_resposta = qsr_num_resposta_USUARIO  AND  qsr_e_correta = 'S' )
			OR
			(qsr_num_resposta_USUARIO IS NULL   AND  qsr_e_correta = 'N' )
		THEN 1 ELSE 0
	END AS [PONTO_RESP]
	, [PONTO_ALVO_Q] 
FROM RESP_MARCADO
) 
 ,PONTO_ALVO AS ( -- determina o valor [PONTO_Q] por questão que o usuário adquiriu somando o PONTO_RESP
SELECT 
		eve_num_evento,
		que_num_questionario,
		usr_num_usuario,
		qst_num_questao,
		qsr_num_resposta,
		qsr_e_correta,
		qsr_num_resposta_USUARIO
		, SUM(PONTO_RESP) OVER(
				PARTITION BY eve_num_evento,  que_num_questionario, qst_num_questao, usr_num_usuario 
		) AS [PONTO_Q],
		PONTO_RESP,
		PONTO_ALVO_Q 
	FROM RESP_PONTO
 )
,PONTO_Q AS ( -- pontua cada questão respondida pelo usuário e conta quantdas questões possui o questionário
SELECT  
	pa.eve_num_evento,
	pa.que_num_questionario,
	pa.usr_num_usuario,
	pa.qst_num_questao,
	pa.[PONTO_Q],
	pa.PONTO_ALVO_Q,
	COUNT(pa.qst_num_questao) OVER(
            PARTITION BY pa.eve_num_evento, pa.que_num_questionario,pa.usr_num_usuario
    ) AS [QTDE_Q]
	, CASE WHEN [PONTO_Q] = PONTO_ALVO_Q THEN 1 ELSE 0 END AS [NOTA_Q]
FROM PONTO_ALVO pa
GROUP BY pa.eve_num_evento,
	pa.que_num_questionario,
	pa.usr_num_usuario,
	pa.qst_num_questao,
	pa.[PONTO_Q],
	pa.PONTO_ALVO_Q 
)
,NOTA_POR_USUARIO AS ( -- soma as notas de cada usuário
	SELECT
	eve_num_evento,
	que_num_questionario,
	usr_num_usuario,
	qst_num_questao,
	PONTO_Q,
	PONTO_ALVO_Q,
	[QTDE_Q],
	NOTA_Q
	, SUM(NOTA_Q) OVER( PARTITION BY eve_num_evento, que_num_questionario, usr_num_usuario ) AS [NOTA]
	FROM PONTO_Q
) 
SELECT -- faz a pontuação baseada em notas de 0 a 10 baseando na NOTA e QTDE_Q
	npu.eve_num_evento,
	eve.eve_nome,
	eve.eve_situacao,
	npu.que_num_questionario,
	que.que_contexto,
	que.que_situacao,
	npu.usr_num_usuario,
	usr.usr_cpf,
	usr.usr_nome,
	usr.usr_email,
	usr.usr_situacao,
	usr.usr_telefone,
	usr.usr_instituicao,
	usr.usr_municipio,
	npu.[QTDE_Q],
	npu.NOTA,
	((10.0 *npu.NOTA) / npu.[QTDE_Q]  ) AS [pontuacao]
FROM NOTA_POR_USUARIO npu 
LEFT JOIN [pms_eventos_homologacao].[dbo].[eve_eventos] eve ON(npu.eve_num_evento = eve.eve_num_evento)
LEFT JOIN [pms_eventos_homologacao].[dbo].[eve_questionarios] que ON(eve.eve_num_evento = que.eve_num_evento)
LEFT JOIN [pms_eventos_homologacao].[dbo].[eve_usuarios] usr ON(npu.usr_num_usuario = usr.usr_num_usuario)
GROUP BY 
	npu.eve_num_evento,
	eve.eve_nome,
	eve.eve_situacao,
	npu.que_num_questionario,
	que.que_contexto,
	que.que_situacao,
	npu.usr_num_usuario,
	usr.usr_cpf,
	usr.usr_nome,
	usr.usr_email,
	usr.usr_situacao,
	usr.usr_telefone,
	usr.usr_instituicao,
	usr.usr_municipio,
	npu.[QTDE_Q],
	npu.NOTA 
ORDER BY usr.usr_nome ASC