DECLARE @VALENDO AS DECIMAL(10,2) = 10      -- VALENDO DE 0 A 10 -- NOTA
DECLARE @PONTO_MAXIMO AS DECIMAL(10,2) = 10 -- PONTOS MÁXIMOS CONSIDERANDO A QUANTIDADE DE QUESTÕES
;WITH
TOTAL_DE_NOTAS AS (
    SELECT  [usr_num_usuario]
          , [eve_num_evento]
          , [que_num_questionario]
          , [ure_nota_minima]
          , [ure_nota_resultado]
          , [ure_dt_resultado]
          , [ure_situacao]
          , ( SUM([ure_nota_resultado])     OVER (PARTITION BY [eve_num_evento]) ) AS [TOTAL]
          , ( COUNT([ure_nota_resultado])   OVER (PARTITION BY [eve_num_evento]) ) AS [QTDE]
      FROM [pms_eventos_homologacao].[dbo].[eve_usuarios_resultados]
      GROUP BY 
            [usr_num_usuario]
          , [eve_num_evento]
          , [que_num_questionario]
          , [ure_nota_minima]
          , [ure_nota_resultado]
          , [ure_dt_resultado]
          , [ure_situacao]
)
SELECT [usr_num_usuario]
      ,[eve_num_evento]
      ,[que_num_questionario]
      ,[ure_nota_minima]
      ,[ure_nota_resultado]
      ,[ure_dt_resultado]
      ,[ure_situacao]
      , [TOTAL]
      , [QTDE]
      , CONVERT(DECIMAL(10,2),((([TOTAL] / [QTDE] ) * @VALENDO) / @PONTO_MAXIMO)) AS [MEDIA_GERAL]
FROM TOTAL_DE_NOTAS 