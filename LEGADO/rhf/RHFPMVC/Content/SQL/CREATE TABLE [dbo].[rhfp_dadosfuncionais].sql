 
CREATE TABLE [dbo].[rhfp_dadosfuncionais](
	[dfunc_id] [int] IDENTITY(1,1) NOT NULL,
	[ALA-DP-MATRICULA] [int] NULL,
	[ALA-DP-NOME-SERVIDOR] [varchar](70) NULL,
	[ALA-DP-CPF-SERVIDOR] [varchar](11) NULL,
	[ALA-FU-TIPO-CARGO] [int] NULL,
	[ALA-FU-VALIDADE-INICIAL] [char](8) NULL,
	[COD-SIMBOLO] [int] NULL,
	[cs_simbolo] [varchar](12) NULL,
	[cs_cargo] [varchar](79) NULL,
	[PROVIMENTO] [int] NULL,
	[pr_provimento] [varchar](30) NULL,
	[ALA-FU-SITUACAO-FUNCIONAL] [int] NULL,
	[sf_situacao_funcional] [varchar](150) NULL,
	[ORGAO-SUPERIOR] [int] NULL,
	[os_orgao] [varchar](100) NULL,
	[UNIDADE-ORCAM] [int] NULL,
	[os_unidade_ordamentaria] [varchar](100) NULL,
	[MUNICIPIO] [int] NULL,
	[mc_municipio] [varchar](100) NULL,
	[REPARTICAO] [int] NULL,
	[sf_reparticao] [varchar](150) NULL
 CONSTRAINT [PK_rhfp_dadosfuncionais] PRIMARY KEY CLUSTERED 
(
	[dfunc_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]