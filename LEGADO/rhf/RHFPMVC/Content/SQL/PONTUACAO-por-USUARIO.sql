;WITH 
PontoQ AS (SELECT 
	        que.eve_num_evento
	        , eqqr.[que_num_questionario]
	        , eq.[qst_num_questao]
	        , COUNT(eqr.[qsr_num_resposta]) AS [PONTO_POR_Q]
	        , COUNT(eq.[qst_num_questao]) OVER(
                PARTITION BY eqqr.[eve_num_evento] 
            ) AS [PONTO_ALVO_Q]
        FROM [pms_eventos_desenvolvimento].[dbo].[eve_questoes] eq
        INNER JOIN [pms_eventos_desenvolvimento].[dbo].[eve_questoes_respostas] eqr ON ( eq.[qst_num_questao] = eqr.[qst_num_questao])
        INNER JOIN [pms_eventos_desenvolvimento].[dbo].[eve_questionarios_questoes_respostas] eqqr ON(eqr.[qst_num_questao] = eqqr.[qst_num_questao] )
        INNER JOIN [pms_eventos_desenvolvimento].[dbo].[eve_questionarios] que ON(eqqr.[que_num_questionario] = que.[que_num_questionario])
        WHERE que.eve_num_evento = 1 AND eqqr.[que_num_questionario] = 1
        GROUP BY 	
        que.eve_num_evento
        , eqqr.[que_num_questionario]
        , eq.[qst_num_questao]
        , eqqr.[eve_num_evento]
) 
,PontosPorUsuario AS ( 
SELECT 
    ure.[ure_situacao]
    ,usr.[usr_num_usuario]
    ,usr.[usr_nome]
    ,usr.[usr_cpf]
    ,usr.[usr_email]
    ,usr.[usr_telefone]
    ,usr.[usr_instituicao]
    ,usr.[usr_municipio]
    ,usr.[usr_situacao]

    , eve.[eve_num_evento]
    ,eve.[eve_nome]
 
    ,que.[que_num_questionario]
    ,que.[que_contexto]
 
    ,qstQUIZ.[qst_num_questao]
    ,qstQUIZ.[qst_enunciado]
 
    ,qsrQUIZ.[qsr_num_resposta]
    ,qsrQUIZ.[qsr_enunciado]
    ,qsrQUIZ.[qsr_e_correta]
 
    , CASE WHEN qsr.[qsr_num_resposta] = qsrQUIZ.[qsr_num_resposta] THEN 1 ELSE 0 END AS [qsr_num_resposta_usuario]
    , CASE 
        WHEN  
               ( ure.[qst_num_questao] = eqqrQUIZ.[qst_num_questao] AND  eqqrQUIZ.[qst_num_questao] = qstQUIZ.[qst_num_questao] 
                AND ure.qsr_num_resposta = qsrQUIZ.qsr_num_resposta
                AND qsrQUIZ.qsr_e_correta = 'S')
                OR
                ( (qsr.[qsr_num_resposta] IS NULL OR qsr.[qsr_num_resposta] != qsrQUIZ.[qsr_num_resposta])
                AND qsrQUIZ.qsr_e_correta = 'N')
            THEN 1 
        ELSE 0
    END AS [PONTO]
    -- FIX: COUNT DISTINCT para não contar linha duplicada de mapeamento
    -- questionario/questao/resposta como se fosse uma questão a mais
    , ( SELECT COUNT(DISTINCT cnt.[qst_num_questao])
        FROM  [pms_eventos_desenvolvimento].[dbo].[eve_questionarios_questoes_respostas] cnt
        WHERE cnt.[eve_num_evento] = eqqrQUIZ.[eve_num_evento] AND cnt.[que_num_questionario]  = eqqrQUIZ.[que_num_questionario]
    ) AS [QTDE_Q]
  FROM 
    [pms_eventos_desenvolvimento].[dbo].[eve_usuarios] usr
  INNER JOIN [pms_eventos_desenvolvimento].[dbo].[eve_usuarios_respostas] ure ON( usr.[usr_num_usuario] = ure.[usr_num_usuario] )
  INNER JOIN [pms_eventos_desenvolvimento].[dbo].[eve_questoes_respostas] qsr ON( ure.[qst_num_questao] = qsr.[qst_num_questao] AND  ure.[qsr_num_resposta] = qsr.[qsr_num_resposta])
  INNER JOIN [pms_eventos_desenvolvimento].[dbo].[eve_questoes] qst ON( qsr.[qst_num_questao] = qst.[qst_num_questao] ) 
  INNER JOIN [pms_eventos_desenvolvimento].[dbo].[eve_questionarios_questoes_respostas] eqqr ON(qst.[qst_num_questao] = eqqr.[qst_num_questao] )
  INNER JOIN [pms_eventos_desenvolvimento].[dbo].[eve_questionarios] que ON(eqqr.[eve_num_evento] = que.[eve_num_evento] AND eqqr.[que_num_questionario] = que.[que_num_questionario])
  INNER JOIN [pms_eventos_desenvolvimento].[dbo].[eve_eventos] eve ON(que.[eve_num_evento] = eve.[eve_num_evento]) 
  INNER JOIN [pms_eventos_desenvolvimento].[dbo].[eve_questionarios_questoes_respostas] eqqrQUIZ ON( 
    eve.[eve_num_evento] = eqqrQUIZ.[eve_num_evento]
    AND eqqr.[que_num_questionario] = eqqrQUIZ.[que_num_questionario] 
    AND qst.[qst_num_questao] = eqqrQUIZ.[qst_num_questao]
  ) 
 LEFT JOIN [pms_eventos_desenvolvimento].[dbo].[eve_questoes] qstQUIZ ON( eqqrQUIZ.[qst_num_questao] = qstQUIZ.[qst_num_questao] ) 
 LEFT JOIN [pms_eventos_desenvolvimento].[dbo].[eve_questoes_respostas] qsrQUIZ ON( qstQUIZ.[qst_num_questao] = qsrQUIZ.[qst_num_questao] )
 WHERE usr.usr_situacao = 'A' AND eve.[eve_num_evento] = 1 AND eqqr.[que_num_questionario] = 1
 AND usr.[usr_num_usuario] = 1
  
)

, PontosAlvos AS (SELECT   
    ppu.[ure_situacao]
    ,ppu.[usr_num_usuario]
    ,ppu.[usr_nome]
    ,ppu.[usr_cpf]
    ,ppu.[usr_email]
    ,ppu.[usr_telefone]
    ,ppu.[usr_instituicao]
    ,ppu.[usr_municipio]
    ,ppu.[usr_situacao]
    ,ppu.[eve_num_evento]
    ,ppu.[eve_nome]
    ,ppu.[que_num_questionario]
    ,ppu.[que_contexto]
    ,ppu.[qst_num_questao]
    ,ppu.[qst_enunciado]
    ,ppu.[qsr_num_resposta]
    ,ppu.[qsr_enunciado]
    ,ppu.[qsr_e_correta]
    ,ppu.[qsr_num_resposta_usuario]
    ,ppu.[PONTO]
    , COUNT(ppu.[qsr_num_resposta]) OVER(
        PARTITION BY ppu.[eve_num_evento],ppu.[que_num_questionario], ppu.[qst_num_questao], ppu.[usr_cpf]
    ) AS [PONTO_ALVO_Q]
    ,ppu.[QTDE_Q]
 FROM PontosPorUsuario ppu
 ) 
 
 , PontosMarcadosQ AS (SELECT   
    ppu.[ure_situacao]
    ,ppu.[usr_num_usuario]
    ,ppu.[usr_nome]
    ,ppu.[usr_cpf]
    ,ppu.[usr_email]
    ,ppu.[usr_telefone]
    ,ppu.[usr_instituicao]
    ,ppu.[usr_municipio]
    ,ppu.[usr_situacao]
    ,ppu.[eve_num_evento]
    ,ppu.[eve_nome]
    ,ppu.[que_num_questionario]
    ,ppu.[que_contexto]
    ,ppu.[qst_num_questao]
    ,ppu.[qst_enunciado]
    ,ppu.[qsr_num_resposta]
    ,ppu.[qsr_enunciado]
    ,ppu.[qsr_e_correta]
    ,ppu.[qsr_num_resposta_usuario]
    ,ppu.[PONTO]
    ,ppu.[PONTO_ALVO_Q] 
    , SUM(ppu.[PONTO]) OVER(
        PARTITION BY ppu.[eve_num_evento],ppu.[que_num_questionario], ppu.[qst_num_questao], ppu.[usr_cpf] 
    ) AS [PONTO_MARCADO_Q]
    ,ppu.[QTDE_Q]
 FROM PontosAlvos ppu
 ) 
 , PontuacaoPorQuestao AS ( SELECT   
    ppu.[ure_situacao]
    ,ppu.[usr_num_usuario]
    ,ppu.[usr_nome]
    ,ppu.[usr_cpf]
    ,ppu.[usr_email]
    ,ppu.[usr_telefone]
    ,ppu.[usr_instituicao]
    ,ppu.[usr_municipio]
    ,ppu.[usr_situacao]
    ,ppu.[eve_num_evento]
    ,ppu.[eve_nome]
    ,ppu.[que_num_questionario]
    ,ppu.[que_contexto]
    ,ppu.[qst_num_questao]
    ,ppu.[qst_enunciado]
    ,ppu.[qsr_num_resposta]
    ,ppu.[qsr_enunciado]
    ,ppu.[qsr_e_correta]
    ,ppu.[qsr_num_resposta_usuario]
    ,ppu.[PONTO]
    ,ppu.[PONTO_ALVO_Q] 
    , ppu.[PONTO_MARCADO_Q]
    , CASE WHEN ppu.[PONTO_ALVO_Q] = ppu.[PONTO_MARCADO_Q] THEN 1 ELSE 0 END AS [PONTUACAO_QUESTAO]
    ,ppu.[QTDE_Q]
 FROM PontosMarcadosQ ppu
 )
 , Pontuacao1 AS ( SELECT   
    ppu.[usr_nome]
    ,ppu.[usr_cpf]
    ,ppu.[usr_email]
    ,ppu.[usr_telefone]
    ,ppu.[usr_instituicao]
    ,ppu.[usr_municipio]
    ,ppu.[usr_situacao]
    ,ppu.[eve_num_evento]
    ,ppu.[eve_nome]
    ,ppu.[que_num_questionario]
    ,ppu.[que_contexto]
    ,ppu.[qst_num_questao]
    , ppu.[PONTO_ALVO_Q] 
    , ppu.[PONTO_MARCADO_Q]
    , ppu.[PONTUACAO_QUESTAO]
    ,ppu.[QTDE_Q]
 FROM PontuacaoPorQuestao ppu
 GROUP BY    
     ppu.[usr_nome]
    ,ppu.[usr_cpf]
    ,ppu.[usr_email]
    ,ppu.[usr_telefone]
    ,ppu.[usr_instituicao]
    ,ppu.[usr_municipio]
    ,ppu.[usr_situacao]
    ,ppu.[eve_num_evento]
    ,ppu.[eve_nome]
    ,ppu.[que_num_questionario]
    ,ppu.[que_contexto]
    ,ppu.[qst_num_questao]
    , ppu.[PONTO_ALVO_Q] 
    , ppu.[PONTO_MARCADO_Q]
    , ppu.[PONTUACAO_QUESTAO]
    , ppu.[QTDE_Q]
), 
Pontuacao2 AS (
    SELECT
        ppu.[usr_nome]
        ,ppu.[usr_cpf]
        ,ppu.[usr_email]
        ,ppu.[usr_telefone]
        ,ppu.[usr_instituicao]
        ,ppu.[usr_municipio]
        ,ppu.[usr_situacao]
        ,ppu.[eve_num_evento]
        ,ppu.[eve_nome]
        ,ppu.[que_num_questionario]
        ,ppu.[que_contexto]
        , SUM(ppu.[PONTUACAO_QUESTAO]) AS [PONTUACAO_QUESTAO]
        , ppu.[QTDE_Q]
    FROM Pontuacao1 ppu
    GROUP BY  
        ppu.[usr_nome]
        ,ppu.[usr_cpf]
        ,ppu.[usr_email]
        ,ppu.[usr_telefone]
        ,ppu.[usr_instituicao]
        ,ppu.[usr_municipio]
        ,ppu.[usr_situacao]
        ,ppu.[eve_num_evento]
        ,ppu.[eve_nome]
        ,ppu.[que_num_questionario]
        ,ppu.[que_contexto]
        , ppu.[QTDE_Q]
)
SELECT
    ppu.[usr_nome]
    ,ppu.[usr_cpf]
    ,ppu.[usr_email]
    ,ppu.[usr_telefone]
    ,ppu.[usr_instituicao]
    ,ppu.[usr_municipio]
    ,ppu.[usr_situacao]
    ,ppu.[eve_num_evento]
    ,ppu.[eve_nome]
    ,ppu.[que_num_questionario]
    ,ppu.[que_contexto]
    , ppu.[PONTUACAO_QUESTAO]
    -- FIX: divisão decimal, evita truncamento e divisão por zero
    , CAST((10.0 * ppu.[PONTUACAO_QUESTAO]) / NULLIF(ppu.[QTDE_Q], 0) AS DECIMAL(5,2)) AS [nota]
    , ppu.[QTDE_Q]
FROM Pontuacao2 ppu
GROUP BY 
    ppu.[usr_nome]
    ,ppu.[usr_cpf]
    ,ppu.[usr_email]
    ,ppu.[usr_telefone]
    ,ppu.[usr_instituicao]
    ,ppu.[usr_municipio]
    ,ppu.[usr_situacao]
    ,ppu.[eve_num_evento]
    ,ppu.[eve_nome]
    ,ppu.[que_num_questionario]
    ,ppu.[que_contexto]
    ,ppu.[PONTUACAO_QUESTAO]
    ,ppu.[QTDE_Q]
ORDER BY ppu.[usr_nome] ASC