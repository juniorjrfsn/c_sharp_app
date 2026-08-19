SELECT TOP (1000) [mov_ano]
      ,[mov_numero]
      ,[plc_sequencial]
      ,[plc_imagem]
      ,[plc_dt_inclusao]
      ,[plc_dt_cancelamento]
      ,[plc_cd_usuario_gsi_cancelamento]
      ,[sit_codigo]
  FROM [pms_sigprecat_des].[dbo].[pct_item_movimento_planilha_calculo]

/*
	DELETE  FROM [pms_sigprecat_des].[dbo].[pct_item_movimento_planilha_calculo] WHERE [mov_numero] > 0

	DELETE FROM [pms_sigprecat_des].[dbo].[pct_item_movimento_planilha_calculo] WHERE [mov_numero]  = 1 
	DELETE FROM [pms_sigprecat_des].[dbo].[pct_item_movimento_eventos] WHERE [mov_numero]  = 1
	DELETE FROM [pms_sigprecat_des].[dbo].[pct_item_movimento] WHERE [mov_numero]  = 1
*/
