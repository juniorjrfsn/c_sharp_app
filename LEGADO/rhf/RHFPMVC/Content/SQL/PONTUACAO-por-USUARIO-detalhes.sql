;WITH 
USUARIO_Q AS ( -- ligação de usuários com questões respondidas às questões e respostas do questionário
SELECT 
	eve.eve_num_evento
	, que.[que_num_questionario] 
	, usr.usr_num_usuario
	, eqqrQUIZ.[qst_num_questao]
	, qsr.[qsr_num_resposta]
	,MIN(qsr.[qsr_num_resposta]) OVER ( 
		PARTITION BY eve.eve_num_evento, que.[que_num_questionario], eqqrQUIZ.[qst_num_questao] 
	) AS qsr_num_resposta_MIN
FROM 
[pms_eventos_desenvolvimento].[dbo].eve_eventos eve
INNER JOIN [pms_eventos_desenvolvimento].[dbo].[eve_questionarios] que ON(eve.eve_num_evento = que.eve_num_evento)
INNER JOIN [pms_eventos_desenvolvimento].[dbo].[eve_usuarios_respostas] ure ON(
	eve.eve_num_evento = que.eve_num_evento AND ure.[que_num_questionario] = que.[que_num_questionario]
)
INNER JOIN [pms_eventos_desenvolvimento].[dbo].[eve_usuarios] usr ON(ure.usr_num_usuario = usr.usr_num_usuario)
INNER JOIN [pms_eventos_desenvolvimento].[dbo].[eve_questionarios_questoes_respostas] eqqrQUIZ ON(
    eve.[eve_num_evento] = eqqrQUIZ.[eve_num_evento]
    AND ure.[que_num_questionario] = eqqrQUIZ.[que_num_questionario]
)
INNER JOIN [pms_eventos_desenvolvimento].[dbo].[eve_questoes_respostas] qsr ON( ure.[qst_num_questao] = qsr.[qst_num_questao])
WHERE eve.eve_num_evento = 2 AND que.[que_num_questionario] = 1  -- AND usr.usr_num_usuario = 4
-- AND usr.usr_cpf = 'CPF DO USUÁRIO'
AND usr.usr_num_usuario IN(
	SELECT ure.usr_num_usuario FROM [pms_eventos_desenvolvimento].[dbo].[eve_usuarios_respostas] ure WHERE 
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
		, uq.qsr_num_resposta_MIN
	FROM USUARIO_Q uq
	LEFT JOIN [pms_eventos_desenvolvimento].[dbo].[eve_usuarios_respostas] ure ON(
		uq.eve_num_evento = ure.eve_num_evento 
		AND uq.[que_num_questionario] = ure.[que_num_questionario]
		AND uq.usr_num_usuario = ure.usr_num_usuario
		AND uq.qst_num_questao = ure.qst_num_questao 
		AND uq.[qsr_num_resposta] = ure.[qsr_num_resposta] 
	)
	LEFT JOIN [pms_eventos_desenvolvimento].[dbo].[eve_questoes_respostas] qsr ON( 
		uq.[qst_num_questao] = qsr.[qst_num_questao]
		AND uq.[qsr_num_resposta] = qsr.[qsr_num_resposta]
	)
)
,RESP_PONTO AS (
	SELECT -- pontua cada resposta baseado no campo qsr_e_correta
		rm.eve_num_evento	
		, rm.que_num_questionario
		, rm.usr_num_usuario
		, rm.qst_num_questao
		, rm.qsr_num_resposta
		, rm.qsr_num_resposta_MIN
		, rm.qsr_e_correta
		, rm.qsr_num_resposta_USUARIO
		, CASE 
			WHEN 
				(rm.qsr_num_resposta_USUARIO IS NOT NULL AND rm.qsr_num_resposta = rm.qsr_num_resposta_USUARIO  AND  rm.qsr_e_correta = 'S' )
				OR
				(rm.qsr_num_resposta_USUARIO IS NULL AND  rm.qsr_e_correta = 'N' )
			THEN 1 ELSE 0
		END AS [PONTO_RESP]
		, rm.[PONTO_ALVO_Q]
		, COUNT(uq.qst_num_questao) AS [QTDE_Q]
	FROM RESP_MARCADO rm
	LEFT JOIN USUARIO_Q uq ON(
		rm.eve_num_evento = uq.eve_num_evento AND rm.que_num_questionario = uq.que_num_questionario  
		AND rm.usr_num_usuario = uq.usr_num_usuario AND rm.usr_num_usuario = uq.usr_num_usuario  AND rm.qsr_num_resposta_MIN = uq.qsr_num_resposta
	)
	GROUP BY 
	rm.eve_num_evento
	, rm.que_num_questionario
	, rm.usr_num_usuario
	, rm.qst_num_questao
	, rm.qsr_num_resposta
	, rm.qsr_num_resposta_MIN
	, rm.qsr_e_correta
	, rm.qsr_num_resposta_USUARIO
	, rm.[PONTO_ALVO_Q] 
) 
,PONTO_ALVO AS ( -- determina o valor [PONTO_Q] por questão que o usuário adquiriu somando o PONTO_RESP
SELECT 
		eve_num_evento,
		que_num_questionario,
		usr_num_usuario,
		qst_num_questao,
		qsr_num_resposta
		, qsr_num_resposta_MIN
		, qsr_e_correta
		, qsr_num_resposta_USUARIO 
		, SUM(PONTO_RESP) OVER(
			PARTITION BY eve_num_evento, que_num_questionario, qst_num_questao, usr_num_usuario 
		) AS [PONTO_Q],
		PONTO_RESP,
		PONTO_ALVO_Q,
		[QTDE_Q]
	FROM RESP_PONTO
)
,PONTO_Q AS ( -- pontua cada questão respondida pelo usuário e conta quantdas questões possui o questionário
	 SELECT  
		pa.eve_num_evento
		, pa.que_num_questionario
		, pa.usr_num_usuario
		, pa.qst_num_questao
		, pa.qsr_num_resposta
		, pa.qsr_num_resposta_MIN
		, pa.qsr_e_correta
		, pa.qsr_num_resposta_USUARIO
		, pa.[PONTO_Q]
		, pa.PONTO_ALVO_Q
		, pa.[QTDE_Q]
		, CASE WHEN [PONTO_Q] = PONTO_ALVO_Q THEN 1 ELSE 0 END AS [NOTA_Q]
	FROM PONTO_ALVO pa
	GROUP BY pa.eve_num_evento
		, pa.que_num_questionario
		, pa.usr_num_usuario
		, pa.qst_num_questao
		, pa.qsr_num_resposta
		, pa.qsr_num_resposta_MIN
		, pa.qsr_e_correta
		, pa.qsr_num_resposta_USUARIO
		, pa.[PONTO_Q]
		, pa.PONTO_ALVO_Q
		, pa.[QTDE_Q]
)
,NOTA_POR_USUARIO AS ( -- soma as notas de cada usuário
	SELECT
	pq.eve_num_evento
	, pq.que_num_questionario
	, pq.usr_num_usuario
	, pq.qst_num_questao
	, pq.qsr_num_resposta
	, pq.qsr_num_resposta_MIN
	, pq.qsr_e_correta
	, pq.qsr_num_resposta_USUARIO
	, pq.PONTO_Q
	, pq.PONTO_ALVO_Q
	, pq.[QTDE_Q]
	, pq.NOTA_Q
	, SUM(CASE WHEN pq.qsr_num_resposta = pq.qsr_num_resposta_MIN THEN NOTA_Q ELSE 0 END) OVER ( 
		PARTITION BY pq.eve_num_evento, pq.que_num_questionario, pq.usr_num_usuario 
	) AS [NOTA]
	FROM PONTO_Q pq
	
) 
SELECT -- faz a pontuação baseada em notas de 0 a 10 baseando na NOTA e QTDE_Q
	npu.eve_num_evento
	, eve.eve_nome
	, eve.eve_situacao
	, npu.que_num_questionario
	, que.que_contexto
	, que.que_situacao
	, npu.qst_num_questao
	, eq.qst_enunciado			-- Questão
	, npu.qsr_num_resposta
	, eqr.qsr_enunciado
	, eqr.qsr_e_correta
	, npu.qsr_num_resposta_USUARIO
	, npu.PONTO_Q
	, npu.PONTO_ALVO_Q
	, npu.[QTDE_Q]
	, npu.NOTA_Q
	, npu.[QTDE_Q]
	, npu.NOTA
	, ((10.0 *npu.NOTA) / npu.[QTDE_Q]  ) AS [pontuacao]
	, npu.usr_num_usuario
	, usr.usr_cpf
	, usr.usr_nome
	, usr.usr_email
	, usr.usr_situacao
	, usr.usr_telefone
	, usr.usr_instituicao
	, usr.usr_municipio
FROM NOTA_POR_USUARIO npu 
LEFT JOIN [pms_eventos_desenvolvimento].[dbo].[eve_eventos] eve				ON(npu.eve_num_evento	= eve.eve_num_evento	)
LEFT JOIN [pms_eventos_desenvolvimento].[dbo].[eve_questionarios] que		ON(eve.eve_num_evento	= que.eve_num_evento	)
LEFT JOIN [pms_eventos_desenvolvimento].[dbo].[eve_questoes] eq				ON(npu.qst_num_questao  = eq.qst_num_questao )
LEFT JOIN [pms_eventos_desenvolvimento].[dbo].[eve_questoes_respostas] eqr	ON(npu.qst_num_questao  = eqr.qst_num_questao AND npu.qsr_num_resposta  = eqr.qsr_num_resposta)
LEFT JOIN [pms_eventos_desenvolvimento].[dbo].[eve_usuarios] usr			ON(npu.usr_num_usuario	= usr.usr_num_usuario	)
ORDER BY usr.usr_nome ASC, npu.eve_num_evento ASC, npu.que_num_questionario ASC, npu.qst_num_questao ASC, npu.qsr_num_resposta ASC