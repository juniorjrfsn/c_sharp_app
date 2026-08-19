USE [pms_rhfp_desenvolvimento]
GO

INSERT INTO [dbo].[rhfp_dadospessoais]
           ([ALA-DP-MATRICULA]
           ,[ALA-DP-NOME-SERVIDOR]
           ,[ALA-DP-CPF-SERVIDOR]
           ,[DATA-NASC]
           ,[ALA-DP-DATA-ADMISSAO]
           ,[ALA-DP-STATUS]
           ,[Status]
           ,[ALA-DP-NOME-PAI]
           ,[ALA-DP-NOME-MAE])
SELECT   [ALA-DP-MATRICULA]
      ,[ALA-DP-NOME-SERVIDOR]
      ,[ALA-DP-CPF-SERVIDOR]
      ,[DATA-NASC]
      ,[ALA-DP-DATA-ADMISSAO]
      ,[ALA-DP-STATUS]
      ,[Status]
      ,[ALA-DP-NOME-PAI]
      ,[ALA-DP-NOME-MAE]
  FROM [pms_rhfp_desenvolvimento].[dbo].[rhfp_dadospessoais_]
GO

