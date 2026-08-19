;WITH PontosPorUsuario AS ( 
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

    ,eve.[eve_num_evento]
    ,eve.[eve_nome]
    --,eve.[eve_descricao]
    --,eve.[eve_local]
    --,eve.[eve_municipio]
    --,eve.[eve_dt_inicio]
    --,eve.[eve_dt_fim]
    --,eve.[eve_dt_inclusao]
    --,eve.[eve_situacao]
    ,que.[que_num_questionario]
    ,que.[que_contexto]
    --,que.[que_publico_alvo]
    --,que.[que_nota_mínima]
    --,que.[que_dt_inclusao]
    --,que.[que_situacao]
    ,qstQUIZ.[qst_num_questao]
    ,qstQUIZ.[qst_enunciado]
    --,qst.[qst_situacao]

    --,qsr.[qst_num_questao]
    ,qsrQUIZ.[qsr_num_resposta]
    ,qsrQUIZ.[qsr_enunciado]
    ,qsrQUIZ.[qsr_e_correta]
    --,qsr.[qsr_situacao]
  
    --, ure.[usr_num_usuario]
    --, ure.[eve_num_evento]
    --, ure.[que_num_questionario]
    --, ure.[qst_num_questao]
    --, ure.[qsr_num_resposta]
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
  FROM 
  [pms_eventos_homologacao].[dbo].[eve_usuarios] usr
  INNER JOIN [pms_eventos_homologacao].[dbo].[eve_usuarios_respostas] ure ON( usr.[usr_num_usuario] = ure.[usr_num_usuario] )
  INNER JOIN [pms_eventos_homologacao].[dbo].[eve_questoes_respostas] qsr ON( ure.[qst_num_questao] = qsr.[qst_num_questao] AND  ure.[qsr_num_resposta] = qsr.[qsr_num_resposta])
  INNER JOIN [pms_eventos_homologacao].[dbo].[eve_questoes] qst ON( qsr.[qst_num_questao] = qst.[qst_num_questao] ) 
  INNER JOIN [pms_eventos_homologacao].[dbo].[eve_questionarios_questoes_respostas] eqqr ON(qst.[qst_num_questao] = eqqr.[qst_num_questao] )
  INNER JOIN [pms_eventos_homologacao].[dbo].[eve_questionarios] que ON(eqqr.[eve_num_evento] = que.[eve_num_evento] AND eqqr.[que_num_questionario] = que.[que_num_questionario])
  INNER JOIN [pms_eventos_homologacao].[dbo].[eve_eventos] eve ON(que.[eve_num_evento] = eve.[eve_num_evento]) 
  LEFT JOIN [pms_eventos_homologacao].[dbo].[eve_questionarios_questoes_respostas] eqqrQUIZ ON( 
    eve.[eve_num_evento] = eqqrQUIZ.[eve_num_evento]
    AND eqqr.[que_num_questionario] = eqqrQUIZ.[que_num_questionario] 
    AND qst.[qst_num_questao] = eqqrQUIZ.[qst_num_questao]
  ) 
 LEFT JOIN [pms_eventos_homologacao].[dbo].[eve_questoes] qstQUIZ ON( eqqrQUIZ.[qst_num_questao] = qstQUIZ.[qst_num_questao] ) 
 LEFT JOIN [pms_eventos_homologacao].[dbo].[eve_questoes_respostas] qsrQUIZ ON( qstQUIZ.[qst_num_questao] = qsrQUIZ.[qst_num_questao] )
  WHERE ure.[usr_num_usuario] = 4 -- AND qstQUIZ.[qst_num_questao] = 1
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
    , COUNT(ppu.[qsr_num_resposta]) OVER(PARTITION BY ppu.[eve_num_evento],ppu.[que_num_questionario], ppu.[qst_num_questao] ) AS [PONTO_ALVO_Q]
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
    , SUM(ppu.[PONTO]) OVER(PARTITION BY ppu.[eve_num_evento],ppu.[que_num_questionario], ppu.[qst_num_questao] ) AS [PONTO_MARCADO_Q]
 FROM PontosAlvos ppu
 ) 
 SELECT   
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
 FROM PontosMarcadosQ ppu