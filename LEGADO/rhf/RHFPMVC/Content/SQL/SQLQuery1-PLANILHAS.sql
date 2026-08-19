USE [pms_sigprecat_des]

SELECT TOP (1000) [mov_ano]
      ,[mov_numero]
      ,[plc_sequencial]
      ,[plc_imagem]
      ,[plc_dt_inclusao]
      ,[plc_dt_cancelamento]
      ,[plc_cd_usuario_gsi_cancelamento]
      ,[plc_situacao]
      ,[plc_tp_planilha]
  FROM [pms_sigprecat_des].[dbo].[pct_item_movimento_planilha_calculo]

  WHERE [mov_ano] = 2024 AND [mov_numero] = 1 AND [plc_tp_planilha] IN('S','P')

  AND [plc_situacao] = 'A'

  -- DELETE FROM [pms_sigprecat_des].[dbo].[pct_item_movimento_planilha_calculo] WHERE [mov_ano] = 2024 AND [mov_numero] = 1 AND [plc_tp_planilha] IN('S','P')


  SELECT TOP (1000) [mov_ano]
      ,[mov_numero]
      ,[plc_sequencial]
      ,[plc_imagem]
      ,[plc_dt_inclusao]
      ,[plc_dt_cancelamento]
      ,[plc_cd_usuario_gsi_cancelamento]
      ,[plc_situacao]
      ,[plc_tp_planilha]
  FROM [pms_sigprecat_des].[dbo].[pct_item_movimento_planilha_calculo]

  WHERE [mov_ano] = 2024 AND [mov_numero] = 3 AND [plc_tp_planilha] IN('S','P')

  AND [plc_situacao] = 'A'


 -- DELETE FROM [pms_sigprecat_des].[dbo].[pct_item_movimento_planilha_calculo] WHERE [mov_ano] = 2024 AND [mov_numero] = 3 AND [plc_tp_planilha] IN('S','P')
