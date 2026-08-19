use pms_rhfp_desenvolvimento
IF OBJECT_ID('dbo.rhfp_financeiro')	IS NOT NULL BEGIN DROP TABLE rhfp_financeiro END
SELECT
	 rhfp_DADOS_FINANCEIROS.[ala-fi-MATRICULA]
	, rhfp_DADOS_FINANCEIROS.[tipo-cargo-fi]
	, rhfp_DADOS_PESSOAIS.[ALA-DP-NOME-SERVIDOR]
	, rhfp_DADOS_PESSOAIS.[ALA-DP-CPF-SERVIDOR]
	, rhfp_DADOS_FINANCEIROS.[COMPETENCIA-FI]
	, rhfp_DADOS_FINANCEIROS.[cod-rubrica-fi]
	, rhfp_rubricas.pr_Rubrica
	, rhfp_DADOS_FINANCEIROS.[data-inicio-fi]
	, rhfp_DADOS_FINANCEIROS.[ala-fi-valor]
	, rhfp_DADOS_FINANCEIROS.[ala-fi-perc-pont-dia-hora]
	, rhfp_DADOS_FINANCEIROS.[ala-fi-QTDE-URV]
INTO rhfp_financeiro
FROM rhfp_DADOS_PESSOAIS 
RIGHT JOIN (rhfp_DADOS_FINANCEIROS 
LEFT JOIN rhfp_rubricas ON rhfp_DADOS_FINANCEIROS.[COD-RUBRICA-FI] = rhfp_rubricas.pr_cod) 
ON rhfp_DADOS_PESSOAIS.[ALA-DP-MATRICULA] = rhfp_DADOS_FINANCEIROS.[ala-fi-MATRICULA]

ORDER BY 
	rhfp_DADOS_FINANCEIROS.[ala-fi-MATRICULA],
	rhfp_DADOS_FINANCEIROS.[tipo-cargo-fi],
	rhfp_DADOS_FINANCEIROS.[COMPETENCIA-FI],
	rhfp_DADOS_FINANCEIROS.[cod-rubrica-fi]

SELECT top 10 
	  [ala-fi-MATRICULA]
	, [tipo-cargo-fi]
	, [ALA-DP-NOME-SERVIDOR]
	, [ALA-DP-CPF-SERVIDOR]
	, [COMPETENCIA-FI]
	, [cod-rubrica-fi]
	, [pr_Rubrica]
	, [data-inicio-fi]
	, [ala-fi-valor]
	, [ala-fi-perc-pont-dia-hora]
	, [ala-fi-QTDE-URV] 
FROM [pms_rhfp_desenvolvimento].[dbo].[rhfp_financeiro]
ORDER BY 
	[ala-fi-MATRICULA],
	[tipo-cargo-fi],
	[COMPETENCIA-FI],
	[cod-rubrica-fi]




	/*
		, CASE WHEN [COD-RUBRICA-FI] > 0     AND [COD-RUBRICA-FI] < 100  THEN [ALA-FI-VALOR] ELSE 0 END  AS [PROVENTO]
	, CASE WHEN [COD-RUBRICA-FI] >= 100  AND [COD-RUBRICA-FI] <= 400 THEN [ALA-FI-VALOR] ELSE 0 END  AS [DESCONTO]
	, SUM( CASE WHEN [COD-RUBRICA-FI] > 0     AND [COD-RUBRICA-FI] < 100  THEN [ALA-FI-VALOR] ELSE 0 END ) OVER(
        PARTITION BY [ALA-FI-MATRICULA], [COMPETENCIA-FI], [TIPO-CARGO-FI] 
    ) AS [TOTAL_PROVENTO]
    , SUM( CASE WHEN [COD-RUBRICA-FI] >= 100  AND [COD-RUBRICA-FI] <= 400 THEN [ALA-FI-VALOR] ELSE 0 END ) OVER(
        PARTITION BY [ALA-FI-MATRICULA], [COMPETENCIA-FI], [TIPO-CARGO-FI] 
    ) AS [TOTAL_DESCONTO]
 */