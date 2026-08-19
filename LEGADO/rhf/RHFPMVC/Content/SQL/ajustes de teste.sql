SELECT TOP (1000) [mov_ano]
      ,[mov_numero]
      ,[plc_sequencial]
      ,[plc_imagem]
      ,[plc_dt_inclusao]
      ,[plc_dt_cancelamento]
      ,[plc_cd_usuario_gsi_cancelamento]
      ,[plc_situacao]
  FROM [pms_sigprecat_hom].[dbo].[pct_item_movimento_planilha_calculo]
  WHERE  [mov_ano] = 2025 AND [mov_numero] IN(17, 43, 50) -- 43, 50
  order by [plc_dt_inclusao] DESC

  DELETE FROM [pms_sigprecat_hom].[dbo].[pct_item_movimento_planilha_calculo] WHERE  [mov_ano] = 2025 AND [mov_numero] IN(17, 43, 50) AND [plc_sequencial] >= 2

  UPDATE [pms_sigprecat_hom].[dbo].[pct_item_movimento_planilha_calculo] SET [plc_situacao] = 'A', [plc_dt_cancelamento] = NULL, [plc_cd_usuario_gsi_cancelamento] = NULL  
  WHERE  [mov_ano] = 2025 AND [mov_numero] IN(17, 43, 50) AND [plc_sequencial] = 1