# Módulos do Sistema - RHFP Legado

**Última atualização:** Outubro 1, 2026  
**Versão:** 2.0 (Expandido com fluxos e integrações)

---

## 📑 ÍNDICE
1. [Módulos Disponíveis](#módulos-disponíveis)
2. [Fluxos por Módulo](#fluxos-por-módulo)
3. [Componentes Compartilhados](#componentes-compartilhados)
4. [Adição de Novo Módulo](#adição-de-novo-módulo)
5. [Integrações e Dependências](#integrações-e-dependências)

---

## MÓDULOS DISPONÍVEIS

As rotas seguem o padrão `/Controlador/Ação`. Controllers funcionais herdam de `GSIController` (com autenticação).

| Módulo | Rota | Controller | Status | Dados Principais |
| --- | --- | --- | --- | --- |
| **🏠 Início** | `/Home/Index` | HomeController | Público ✓ | Páginas institucionais |
| **👤 Dados Pessoais** | `/DadosPessoais/*` | DadosPessoaisController | Protegido 🔒 | Pessoa, CPF, Contato |
| **💼 Dados Funcionais** | `/DadosFuncionais/*` | DadosFuncionaisController | Protegido 🔒 | Matrícula, Cargo, Setor |
| **📋 Atos e Eventos** | `/AtosEventos/*` | AtosEventosController | Protegido 🔒 | Atos legais, eventos funcionais |
| **💰 Financeiro** | `/Financeiro/*` | FinanceiroController | Protegido 🔒 | Movimentações, rubricas, saldos |
| **📊 Relatórios** | `/Relatorios/*` | RelatoriosController | Semi-Público ⚠️ | Geração de PDF/HTML |
| **⚙️ Gerência** | `/Gerencia/*` | GerenciaController | Protegido 🔒 | Parâmetros, instituições, usuários |
| **📈 Estatística** | `/Estatistica/*` | EstatisticaController | Protegido 🔒 | Análises, indicadores |
| **🎯 Gestão** | `/Gestao/*` | GestaoController | Protegido 🔒 | Questionários, eventos, associações |
| **📧 Envio Relatório** | `/Envioemailrelpont/*` | EmakenHandler | Protegido 🔒 | Envio de relatórios por e-mail |
| **🔐 Autenticação** | `/Login/*` | LoginController | Público ✓ | Credenciais, sessão |

---

## FLUXOS POR MÓDULO

### 🏠 Módulo: Início (Home)

**Responsabilidades:**
- Tela de boas-vindas
- Acesso rápido aos módulos (público)
- Informações institucionais
- Logout

**Arquivos:**
```
Controllers/
└── HomeController.cs
Views/
├── Home/Index.cshtml
└── Shared/_Layout.cshtml
```

**Fluxo:**
```
Usuário não autenticado
    ↓
GET /Home/Index
    ├─ Retorna view pública
    └─ Links para Login
    
Usuário autenticado
    ↓
GET /Home/Index
    ├─ Exibe dashboard (painel)
    └─ Links para módulos protegidos
```

**Regras:**
- Sem autenticação obrigatória
- Sem filtro de permissão
- Renderiza diferente conforme autenticação

---

### 👤 Módulo: Dados Pessoais

**Responsabilidades:**
- Consultar dados pessoais de segurados
- Filiação, desligamento, contato
- Geração de relatório PDF

**Arquivos:**
```
Controllers/
├── DadosPessoaisController.cs
└── RelHtmlPDF_DadosPessoais.cs
Views/
├── DadosPessoais/Index.cshtml
├── DadosPessoais/Relatorio.cshtml
└── DadosPessoais/AtoEventos.cshtml
Business/
└── rhfp_legado_dados_pessoaisBusiness.cs
Repository/
└── rhfp_legado_dados_pessoaisRepository.cs
```

**Fluxo de Consulta:**
```
Usuário autentico clica em "Dados Pessoais"
    ↓ GET /DadosPessoais/Index
GSIController valida autenticação + permissão
    ↓ Sucesso
Apresenta formulário com filtros
    └─ CPF ou Matrícula
    └─ Período de validade (opcional)
    ├─ Submitir → AJAX POST
    ↓
[DadosPessoaisController.ObterDados()]
    ├─ Valida entrada
    ├─ Instancia Business
    └─ business.ObterPorCPF(cpf)
    ↓
[rhfp_legado_dados_pessoaisBusiness]
    ├─ Valida CPF
    ├─ Instancia Repository
    └─ repository.BuscaPorCPF(cpf)
    ↓
[rhfp_legado_dados_pessoaisRepository]
    └─ LINQ: WHERE cpf = :cpf
    ↓
[Oracle Database]
    └─ SELECT * FROM rhfp_dados_pessoais
    ↓
JSON Response: { success: true, data: [...] }
    ↓
Tabela renderizada no navegador
```

**Dados Principais:**
- `dp_cpf` - CPF (PK)
- `dp_nome` - Nome completo
- `dp_dt_nascimento` - Data nascimento
- `dp_sexo` - Masculino/Feminino
- `dp_dt_filiacao` - Entrada no sistema
- `dp_dt_desligamento` - Saída do sistema (opcional)
- `dp_status` - Ativo/Inativo
- `dp_email`, `dp_telefone` - Contatos

**Relatório PDF:**
- Ação: `/DadosPessoais/GerarPDF`
- Gerador: `RelHtmlPDF_DadosPessoais`
- Template: `Content/html/template-dados-pessoais.html`
- Convertido com: `NReco.PdfGenerator` + `wkhtmltopdf`

---

### 💼 Módulo: Dados Funcionais

**Responsabilidades:**
- Consultar histórico de vínculo funcional
- Matrículas, cargos, funções, setores
- Geração de relatório PDF

**Arquivos:**
```
Controllers/
├── DadosFuncionaisController.cs
└── RelHtmlPDF_DadosFuncionais.cs
Business/
└── rhfp_legado_dados_funcionaisBusiness.cs
Repository/
└── rhfp_legado_dados_funcionaisRepository.cs
```

**Dados Principais:**
- `df_matricula` - Identificador do vínculo (PK composta)
- `df_cpf_pessoa` - FK para Pessoa
- `df_cargo` - Cargo funcional
- `df_funcao` - Função atual
- `df_quadro` - Quadro administrativo
- `df_dt_admissao` - Data de admissão
- `df_dt_exoneracao` - Data de saída (opcional)
- `df_setor` - Departamento/Setor
- `df_supervisor_matr` - FK para superior hierárquico

**Regras:**
- Uma pessoa (CPF) pode ter múltiplas matrículas (histórico)
- Última matrícula ativa é a principal
- Matrículas anteriores aparecem como histórico

---

### 📋 Módulo: Atos e Eventos

**Responsabilidades:**
- Consultar atos legais e eventos funcionais
- Histórico de mudanças de cargo, alvenaria
- Geração de relatório PDF com 11 itens estruturados

**Arquivos:**
```
Controllers/
├── AtosEventosController.cs
└── RelHtmlPDF_AtosEventos.cs
Views/
├── AtosEventos/Index.cshtml
├── AtosEventos/Relatorio.cshtml
└── AtosEventos/AtoEventos.cshtml (detalhe)
Business/
└── rhfp_legado_atos_e_eventosBusiness.cs
Repository/
└── rhfp_legado_atos_e_eventosRepository.cs
Scripts/
└── Content/controls/js/script-page/relatorios-ato-eventos.js
```

**Dados Principais:**
- `ate_id` - Identificador único
- `ate_cod_texto` - Código do ato (ex: "001")
- `ate_atos_eventos` - Nome/descrição
- `ate_desc_tp_ato` - Tipo (Ato/Evento)
- `ate_dt_ato` - Data do ato (YYYYMMDD)
- `ate_dt_validade` - Início de validade
- `ate_dt_final` - Fim de validade (opcional)
- `ate_prazo` - Prazo em dias
- `ate_*_cargo` - Múltiplos cargos (Original, Acumulado, Comissão, FG)
- `ate_historico` - Histórico textual
- `ate_*_legal` - Referências legais

**Suporte ATA Relatório (11 Itens):**
```
1. Código e Nome do Ato
2. Tipo de Ato + Data do Ato
3. Validade (Data Inicial, Final, Prazo)
4. Diário Oficial + Data
5. Cargo Original (condicional)
6. Cargo Acumulado (condicional)
7. Cargo em Comissão (condicional)
8. Cargo Função Gratificada (condicional)
9. Instrumento Legal (condicional)
10. Histórico (condicional)
11. Artigos + Inciso Legal (condicional)
```

**Validação JavaScript:**
- Só mostra item se tiver dados
- Formata datas YYYYMMDD → DD/MM/YYYY
- Applica máscaras (CPF: ***.***.***.-)
- Template clonado e preenchido dinamicamente

---

### 💰 Módulo: Financeiro

**Responsabilidades:**
- Consultar movimentações financeiras
- Cálculo de saldos e totalizações
- Agrupamento por competência ou rubrica
- Geração de relatório PDF

**Arquivos:**
```
Controllers/
├── FinanceiroController.cs
└── RelHtmlPDF_Financeiro.cs
Business/
├── rhfp_financeiroBusiness.cs
└── rhfp_legado_financeiroBusiness.cs
Repository/
└── rhfp_legado_FinanceirosRepository.cs
Scripts/
└── Content/controls/js/script-page/relatorios-financeiro.js
```

**Dados Principais:**
- `rf_id` - Identificador
- `rf_ano` - Ano fiscal (YYYY)
- `rf_numero` - Número sequencial
- `rf_dt_competencia` - Mês de referência (YYYYMM)
- `rf_tipo_movimento` - Débito (D) ou Crédito (C)
- `rf_rubrica` - Código da rubrica
- `rf_descricao` - Descrição da movimentação
- `rf_valor` - Valor em R$ (decimal)
- `rf_situacao` - Ativo/Inativo

**Fluxo de Cálculo de Saldos:**
```
Usuário filtra: CPF + Data Inicial + Data Final
    ↓
Business: Busca movimentos no período
    ↓
Agrupa por competência (mês/ano):
│   Jan/2026:
│   ├─ Crédito: 5.000,00
│   ├─ Débito: 50,00
│   └─ Saldo: 4.950,00
│
└─ Fev/2026:
    ├─ Crédito: 5.100,00
    ├─ Débito: 60,00
    └─ Saldo acumulado: 9.990,00
    ↓
Relatório tabular com subtotais
```

**Relatório PDF:**
- Orientação: Paisagem (A4)
- Colunas: Data, Rubrica, Descrição, Débito, Crédito, Saldo
- Subtotais por competência
- Total geral (∑ Créditos - ∑ Débitos)

---

### 📊 Módulo: Relatórios

**Responsabilidades:**
- Ponto de acesso único para geração de PDF
- Dispatcher para RelHtmlPDF_* específicos
- Sem autenticação (público com filtros)

**Arquivos:**
```
Controllers/
└── RelatoriosController.cs
Views/
└── Relatorios/Index.cshtml
Produtos:
├── RelHtmlPDF_AtosEventos.cs
├── RelHtmlPDF_DadosPessoais.cs
├── RelHtmlPDF_DadosFuncionais.cs
└── RelHtmlPDF_Financeiro.cs
```

**Ações Principais:**
- `GET /Relatorios/Index` - Página de seleção
- `POST /Relatorios/GerarPDF` - Gera PDF conforme tipo
- `POST /Relatorios/GerarHTML` - Retorna HTML para visualização

**Fluxo Geração PDF:**
```
GET /Relatorios/Index
    └─ Formulário de seleção (tipo, CPF, datas)
    ↓
POST /Relatorios/GerarPDF
    ├─ Valida filtros
    ├─ Determina tipo (AtosEventos, Financeiro, etc)
    ├─ Instancia RelHtmlPDF_* correspondente
    └─ Chama gerador.GerarHTML()
    ↓
RelHtmlPDF_*:
    ├─ Busca Business.ObterDados()
    ├─ Carrega template HTML
    ├─ Interpola dados (nome, CPF, tabelas)
    └─ Retorna HTML
    ↓
NReco.PdfGenerator:
    ├─ Invoca wkhtmltopdf.exe
    ├─ Renderiza com WebKit
    ├─ Adiciona cabeçalho/rodapé
    └─ Retorna byte[]
    ↓
HTTP Response (Content-Type: application/pdf)
    └─ Navegador abre/baixa
```

---

### ⚙️ Módulo: Gerência (Administração)

**Responsabilidades:**
- Configurações de sistema (parâmetros)
- Cadastro de instituições
- Gestão de usuários
- Definição de evento vigente

**Acesso:** Protegido (GSIController)

**Semi-Implementado:** Funcionalidades básicas presentes, mas podem precisar expansão.

---

### 📈 Módulo: Estatística

**Responsabilidades:**
- Consultas analíticas
- Indicadores e agregações
- Gráficos/dashboards (se implementado)

**Acesso:** Protegido (GSIController)

---

### 🎯 Módulo: Gestão

**Responsabilidades:**
- Administração de questionários
- Criação de eventos
- Associação questionário ↔ evento

**Acesso:** Protegido (GSIController)

---

### 📧 Módulo: Envio de Relatório

**Responsabilidades:**
- Geração automática de relatórios
- Envio por e-mail via `MailKit`
- Agendamento (se implementado)

**Tecnologias:**
- SMTP (configurado em Web.config)
- MailKit + MimeKit
- Serviço: `AGEPREV.EmailService`

---

## COMPONENTES COMPARTILHADOS

### Business Genéricas

| Classe | Responsabilidade |
|--------|------------------|
| `CarregaLayoutBusiness` | Carrega templates HTML de `Content/html/` |
| `UniversalBusiness` | Operações genéricas (conversões, validações) |
| `UtilitariosHelper` | Helpers estáticos (formatação, cálculos) |

### DTOs Compartilhados

| DTO | Usado por |
|-----|-----------|
| `AtosEventosDTO` | módulo Atos/Eventos |
| `FinanceiroDTO` | módulo Financeiro |
| `DadosPessoaisDTO` | módulo Dados Pessoais |
| `DadosFuncionaisDTO` | módulo Dados Funcionais |

### Filtros e Middlewares

- **GSIController** - Autenticação e autorização
- **HandleErrorAttribute** - Tratamento global de exceções

### Recursos Estáticos

```
Content/
├── html/
│   ├── LayoutPrincipal.html (template relatório)
│   ├── RelatorioPageHeader.html
│   ├── RelatorioPageContent.html
│   └── RelatorioPageResumo.html
├── css/
│   └── (Bootstrap, FontAwesome, styles.css)
├── js/
│   └── (jQuery, DataTables, validation.js)
└── controls/script-page/
    ├── relatorios-ato-eventos.js
    ├── relatorios-financeiro.js
    └── (outros scripts específicos)
```

---

## ADIÇÃO DE NOVO MÓDULO

### Passo 1: Criar Controller

```csharp
// Controllers/MeuModuloController.cs
public class MeuModuloController : GSIController
{
    private readonly meuModuloBusiness _business;

    public MeuModuloController()
    {
        _business = new meuModuloBusiness();
    }

    [HttpGet]
    public ActionResult Index()
    {
        return View();  // Views/MeuModulo/Index.cshtml
    }

    [HttpPost]
    public ActionResult ObterDados(dynamic filtros)
    {
        try {
            var dados = _business.Obter(filtros);
            return Json(new { success = true, data = dados });
        }
        catch (BusinessValidationException ex) {
            return Json(new { success = false, message = ex.Message });
        }
    }
}
```

### Passo 2: Criar Business

```csharp
// RHFP.Business/Business/meuModuloBusiness.cs
public class meuModuloBusiness
{
    public List<MeuModuloDTO> Obter(dynamic filtros)
    {
        // Validações
        // Instancia Repository
        // Mapeia Entity → DTO
        // Retorna
    }
}
```

### Passo 3: Criar Repository (se necessário)

```csharp
// RHFP.Repository/Repository/Implementations/meuModuloRepository.cs
public class meuModuloRepository
{
    public IEnumerable<MinhaEntidade> BuscaPor(...) { }
}
```

### Passo 4: Criar View e Script

```html
<!-- Views/MeuModulo/Index.cshtml -->
@{
    ViewBag.Title = "Meu Módulo";
}

<div id="meuModulo">
    <form id="formFiltros">
        <input type="text" id="txtFiltro" />
        <button type="button" id="btnConsultar">Consultar</button>
    </form>
    <table id="tabela"></table>
</div>

<script src="~/Content/controls/js/script-page/meuModulo.js"></script>
```

```javascript
// Content/controls/js/script-page/meuModulo.js
$(function() {
    $('#btnConsultar').click(function() {
        fetch('/MeuModulo/ObterDados', {
            method: 'POST',
            body: JSON.stringify({
                filtro: $('#txtFiltro').val()
            })
        })
        .then(r => r.json())
        .then(data => {
            if (data.success) {
                renderizarTabela(data.data);
            }
        });
    });
});
```

### Passo 5: Registrar Rota (se necessário)

Em `Global.asax.cs`, registrar rota padrão:
```csharp
routes.MapRoute(
    name: "MeuModulo",
    url: "{controller}/{action}/{id}",
    defaults: new { controller = "MeuModulo", action = "Index", id = UrlParameter.Optional }
);
```

### Passo 6: Documentação

- Atualizar este arquivo (`Módulos.md`) com novo módulo
- Se tiver PDF, atualizar `Relatórios.md`
- Criar documento específico `MeuModulo.md` se complexo

---

## INTEGRAÇÕES E DEPENDÊNCIAS

### Frameworks Externos

| Framework | Versão | Uso |
|-----------|--------|-----|
| ASP.NET MVC | 5.2.9 | Controllers e Views |
| Entity Framework | 6.5.2 | ORM para Oracle |
| jQuery | 3.7.0 | AJAX, DOM manipulation |
| Bootstrap | 5.2.3 | Responsivo, componentes |
| DataTables | 1.x | Tabelas interativas |
| NReco.PdfGenerator | 1.2.1 | Conversão HTML → PDF |

### Serviços Externos

| Serviço | Tecnologia | Config |
|---------|-----------|--------|
| Autenticação | GSI LDAPort/AD | Framework GSI |
| Email | SMTP | Web.config |
| Banco de Dados | Oracle | RhfpContext |

### Dependências Transversas

```
MeuModulo (novo)
    ├─ MeuModuloDTO
    ├─ meuModuloBusiness
    │   └─ meuModuloRepository
    │       └─ RhfpContext
    └─ (Web, Views)
```

---

## 🔗 REFERÊNCIAS CRUZADAS

- **Regras de Negócio:** [RegrasDeNegocio.md](./RegrasDeNegocio.md)
- **Fluxos de Dados:** [FluxosDados.md](./FluxosDados.md)
- **Arquitetura:** [Arquitetura.md](./Arquitetura.md)
- **Integração:** [IntegracaoDeCamadas.md](./IntegracaoDeCamadas.md)
- **Relatórios:** [Relatórios.md](./Relatórios.md)
- **Análise Completa:** [../../ANALISE-ARQUITEURA-RHFP-LEGADO.md](../../ANALISE-ARQUITEURA-RHFP-LEGADO.md)

---

**Versão:** 2.0  
**Status:** Publicado  
**Próxima revisão:** Mensalmente
