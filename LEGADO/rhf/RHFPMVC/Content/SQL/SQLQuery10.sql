SELECT  
      usr.[usr_num_usuario]
    , usr.[usr_nome]
    , usr.[usr_cpf]
    , usr.[usr_email]
    , usr.[usr_situacao]
    , ure.[eve_num_evento] 
    , ure.[que_num_questionario]
    , ure.[qst_num_questao]
    , ure.[qsr_num_resposta]
  FROM  [pms_eventos_homologacao].[dbo].[eve_usuarios] usr
  INNER JOIN [pms_eventos_homologacao].[dbo].[eve_usuarios_respostas] ure ON( usr.[usr_num_usuario] = ure.[usr_num_usuario] )
  WHERE usr.usr_situacao = 'A' AND  ure.[ure_situacao] = 'A'
  AND  usr.[usr_cpf] = ''
 
 
