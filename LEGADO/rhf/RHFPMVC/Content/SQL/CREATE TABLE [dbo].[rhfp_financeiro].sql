 

CREATE TABLE [dbo].[rhfp_financeiro](
	[fin_id] [int] IDENTITY(1,1) NOT NULL,
	[ala-fi-MATRICULA] [int] NOT NULL,
	[tipo-cargo-fi] [int] NOT NULL,
	[ALA-DP-NOME-SERVIDOR] [varchar](70) NULL,
	[ALA-DP-CPF-SERVIDOR] [varchar](11) NULL,
	[COMPETENCIA-FI] [char](6) NOT NULL,
	[cod-rubrica-fi] [int] NOT NULL,
	[pr_Rubrica] [nvarchar](150) NULL,
	[data-inicio-fi] [char](8) NULL,
	[ala-fi-valor] [decimal](12, 2) NULL,
	[ala-fi-perc-pont-dia-hora] [decimal](8, 2) NULL,
	[ala-fi-QTDE-URV] [decimal](12, 2) NULL,
 CONSTRAINT [PK_rhfp_financeiro] PRIMARY KEY CLUSTERED 
(
	[fin_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
 
