-- =============================================
-- Consulta equivalente ao método GetFinanceiro
-- =============================================
DECLARE @matricula      INT           = 0;      -- 0 = não filtrar
DECLARE @cpf            VARCHAR(20)   = '';    -- já normalizado (sem máscara)
DECLARE @nome           VARCHAR(200)  = NULL;
DECLARE @competencia    VARCHAR(10)   = NULL;    -- ex: '202401'
DECLARE @cod_rubrica    INT           = 0;       -- 0 = não filtrar
DECLARE @dtIni          VARCHAR(10)   = NULL;    -- já normalizada
DECLARE @dtFim          VARCHAR(10)   = NULL;    -- já normalizada

-- Flags de presença de filtro (equivalente ao temX do C#)
DECLARE @temMatricula   BIT = CASE WHEN @matricula > 0 THEN 1 ELSE 0 END;
DECLARE @temCpf         BIT = CASE WHEN NULLIF(LTRIM(RTRIM(@cpf)), '') IS NOT NULL THEN 1 ELSE 0 END;
DECLARE @temNome        BIT = CASE WHEN NULLIF(LTRIM(RTRIM(@nome)), '') IS NOT NULL THEN 1 ELSE 0 END;
DECLARE @temCompetencia BIT = CASE WHEN NULLIF(LTRIM(RTRIM(@competencia)), '') IS NOT NULL THEN 1 ELSE 0 END;
DECLARE @temDtIni       BIT = CASE WHEN NULLIF(LTRIM(RTRIM(@dtIni)), '') IS NOT NULL THEN 1 ELSE 0 END;
DECLARE @temDtFim       BIT = CASE WHEN NULLIF(LTRIM(RTRIM(@dtFim)), '') IS NOT NULL THEN 1 ELSE 0 END;

-- Se nenhum filtro foi informado, retorna vazio (equivalente ao "return new List<>()")
IF (@temMatricula = 0 AND @temCpf = 0 AND @temNome = 0
    AND @temCompetencia = 0 AND @temDtIni = 0 AND @temDtFim = 0)
BEGIN
    SELECT TOP 0
        CAST(NULL AS INT)          AS ala_fi_MATRICULA,
        CAST(NULL AS VARCHAR(50))  AS tipo_cargo_fi,
        CAST(NULL AS VARCHAR(200)) AS ALA_DP_NOME_SERVIDOR,
        CAST(NULL AS VARCHAR(20))  AS ALA_DP_CPF_SERVIDOR,
        CAST(NULL AS VARCHAR(10))  AS COMPETENCIA_FI,
        CAST(NULL AS INT)          AS cod_rubrica_fi,
        CAST(NULL AS VARCHAR(200)) AS pr_Rubrica,
        CAST(NULL AS DATETIME)     AS data_inicio_fi,
        CAST(NULL AS DECIMAL(18,2)) AS ala_fi_valor,
        CAST(NULL AS DECIMAL(18,2)) AS ala_fi_perc_pont_dia_hora,
        CAST(NULL AS DECIMAL(18,2)) AS ala_fi_QTDE_URV,
        CAST(NULL AS DECIMAL(18,2)) AS PROVENTO,
        CAST(NULL AS DECIMAL(18,2)) AS DESCONTO,
        CAST(NULL AS DECIMAL(18,2)) AS TOTAL_PROVENTO,
        CAST(NULL AS DECIMAL(18,2)) AS TOTAL_DESCONTO,
        CAST(NULL AS DECIMAL(18,2)) AS LIQUIDO;
    RETURN;
END

;WITH Base AS
(
    SELECT
        r.[ala-fi-MATRICULA],
        r.[tipo-cargo-fi],
        r.[ALA-DP-NOME-SERVIDOR],
        r.[ALA-DP-CPF-SERVIDOR],
        r.[COMPETENCIA-FI],
        r.[cod-rubrica-fi],
        r.pr_Rubrica,
        r.[data-inicio-fi],
        ISNULL(r.[ala-fi-valor], 0)                     AS [ala-fi-valor],
        ISNULL(r.[ala-fi-perc-pont-dia-hora], 0)        AS [ala-fi-perc-pont-dia-hora],
        ISNULL(r.[ala-fi-QTDE-URV], 0)                  AS [ala-fi-QTDE-URV]
    FROM rhfp_financeiro r
    WHERE (@temMatricula = 0 OR r.[ala-fi-MATRICULA] = @matricula)
      AND (@temCpf = 0 OR r.[ALA-DP-CPF-SERVIDOR] = @cpf)
      AND (@temNome = 0 OR (r.[ALA-DP-NOME-SERVIDOR] IS NOT NULL AND r.[ALA-DP-NOME-SERVIDOR] LIKE '%' + @nome + '%'))
      AND (@temCompetencia = 0 OR r.[COMPETENCIA-FI] = @competencia)
      AND (@temDtIni = 0 OR (r.[COMPETENCIA-FI] IS NOT NULL AND r.[COMPETENCIA-FI] >= @dtIni))
      AND (@temDtFim = 0 OR (r.[COMPETENCIA-FI] IS NOT NULL AND r.[COMPETENCIA-FI] <= @dtFim))
      AND (@cod_rubrica <= 0 OR r.[cod-rubrica-fi] = @cod_rubrica)
),
Calculado AS
(
    SELECT
        b.*,
        CASE WHEN b.[cod-rubrica-fi] > 0   AND b.[cod-rubrica-fi] < 100  THEN b.[ala-fi-valor] ELSE 0 END AS PROVENTO,
        CASE WHEN b.[cod-rubrica-fi] >= 100 AND b.[cod-rubrica-fi] <= 400 THEN b.[ala-fi-valor] ELSE 0 END AS DESCONTO
    FROM Base b
),
ComTotais AS
(
    SELECT
        c.*,
        SUM(c.PROVENTO) OVER (PARTITION BY c.[ala-fi-MATRICULA], c.[COMPETENCIA-FI], c.[tipo-cargo-fi]) AS TOTAL_PROVENTO,
        SUM(c.DESCONTO) OVER (PARTITION BY c.[ala-fi-MATRICULA], c.[COMPETENCIA-FI], c.[tipo-cargo-fi]) AS TOTAL_DESCONTO
    FROM Calculado c
)
SELECT
    [ala-fi-MATRICULA],
    [tipo-cargo-fi],
    [ALA-DP-NOME-SERVIDOR],
    [ALA-DP-CPF-SERVIDOR],
    [COMPETENCIA-FI],
    [cod-rubrica-fi],
    pr_Rubrica,
    [data-inicio-fi],
    [ala-fi-valor],
    [ala-fi-perc-pont-dia-hora],
    [ala-fi-QTDE-URV],
    PROVENTO,
    DESCONTO,
    TOTAL_PROVENTO,
    TOTAL_DESCONTO,
    TOTAL_PROVENTO - TOTAL_DESCONTO AS LIQUIDO
FROM ComTotais
ORDER BY
    [ala-fi-MATRICULA],
    [COMPETENCIA-FI],
    [tipo-cargo-fi];