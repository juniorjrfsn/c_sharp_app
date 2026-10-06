# Arquitetura - RHFP Legado

**Última atualização:** Outubro 1, 2026  
**Versão:** 2.0 (Expandida com fluxos e regras)  
**Foco:** Arquitetura em camadas, fluxos de dados e integração

---

## 📑 ÍNDICE
1. [Visão Geral](#visão-geral)
2. [Arquitetura em Camadas](#arquitetura-em-camadas)
3. [Estrutura de Projetos](#estrutura-de-projetos)
4. [Fluxos Internos](#fluxos-internos)
5. [Segurança e Autenticação](#segurança-e-autenticação)
6. [Tratamento de Dados](#tratamento-de-dados)
7. [Padrões de Design](#padrões-de-design)

---

## VISÃO GERAL

O RHFP Legado é uma aplicação web **ASP.NET MVC 5** sobre **.NET Framework 4.8**. A solução está em `RHFP/RHFP.sln` e é composta por cinco projetos interconectados seguindo o padrão de **Arquitetura em Camadas**.

### Estrutura de Camadas
```
┌─────────────────────────────────────────────┐
│  CAMADA DE APRESENTAÇÃO (RHFPMVC)           │
│  ├─ Controllers (14+ classes)               │
│  ├─ Views (Razor .cshtml)                   │
│  └─ Scripts (jQuery, Bootstrap, DataTables) │
├─────────────────────────────────────────────┤
│  CAMADA DE NEGÓCIO (RHFP.Business)          │
│  ├─ Business Classes (14+ implementações)   │
│  ├─ DTOs (Types de transporte)              │
│  └─ Validações de Regras                    │
├─────────────────────────────────────────────┤
│  CAMADA DE ACESSO (RHFP.Repository)         │
│  ├─ Interfaces de Contrato (IRepository<T>)│
│  ├─ Implementações (Repositories)           │
│  └─ Queries LINQ                            │
├─────────────────────────────────────────────┤
│  CAMADA DE DADOS (RHFP.ModelData)           │
│  ├─ DbContext (Entity Framework 6)          │
│  ├─ Entidades Mapeadas                      │
│  └─ Connection Strings (Oracle)             │
├─────────────────────────────────────────────┤
│  DADOS EXTERNOS                              │
│  ├─ Banco Oracle (Tabelas + Views)          │
│  ├─ LDAP/AD (Autenticação GSI)              │
│  └─ Email Service (MailKit)                 │
└─────────────────────────────────────────────┘
```

| Projeto | Responsabilidade principal | Dependências |
| --- | --- | --- |
| `RHFPMVC` | Controllers, views Razor, scripts, autenticação de sessão e geração de relatórios HTML/PDF. | Business, DTO, Framework SGI |
| `RHFP.Business` | Orquestração de regras de negócio, composição de queries e transformação de dados. | Repository, DTO, ModelData |
| `RHFP.Repository` | Abstrações (interfaces) e implementações de repositórios para acesso a dados. | ModelData, DTO |
| `RHFP.ModelData` | Contexto de Entity Framework, mapeamento de entidades Oracle e helper de conexão. | (Nenhuma - base) |
| `RHFP.DTO` | Data Transfer Objects - tipos para transporte de dados entre camadas. | (Nenhuma - tipos) |

---

## ARQUITETURA EM CAMADAS

### 1️⃣ Camada de Apresentação (RHFPMVC)

**Localização:** `Controllers/`, `Views/`, `Content/`

**Responsabilidades:**
- Receber requisições HTTP (GET/POST)
- Validar entrada do usuário
- Invocar Business Layer
- Retornar respostas (View ou JSON)
- Gerenciar sessão e cookies
- Gerar relatórios HTML/PDF

**Controllers Principais:**

| Controller | Ações | Módulo |
|-----------|-------|--------|
| **AtosEventosController** | Index, Relatorio, AtoEventos | Atos e Eventos |
| **FinanceiroController** | Index, Relatorio, Financeiro | Financeiro |
| **DadosPessoaisController** | Index, Relatorio, AtoEventos | Dados Pessoais |
| **DadosFuncionaisController** | Index, Relatorio | Dados Funcionais |
| **LoginController** | Autenticar, Logout | Autenticação |
| **RelatoriosController** | Index, GerarPDF* | Relatórios |
| **GerenciaController** | ParâmetrosAdmin, Instituições | Gerência |

**Base de Herança:**
- Controllers funcionais → `GSIController` (com autenticação)
- Controllers públicos → `Controller` (ASP.NET padrão)

**Padrão de Resposta AJAX:**
```json
{
  "success": true|false,
  "message": "descrição de erro ou sucesso",
  "data": { /* resultado */ }
}
```

### 2️⃣ Camada de Negócio (RHFP.Business)

**Localização:** `RHFP.Business/Business/`

**Responsabilidades:**
- Aplicar regras de negócio
- Validar dados conforme domínio
- Orquestar chamadas a Repository
- Transformar Entities em DTOs
- Calcular valores, agregações
- Composição de queries complexas

**Classes Principais:**

| Classe | Responsabilidade |
|--------|------------------|
| `rhfp_legado_atos_e_eventosBusiness` | Atos e eventos, histórico de mudanças |
| `rhfp_legado_financeiroBusiness` | Movimentações financeiras, saldos |
| `rhfp_legado_dados_pessoaisBusiness` | Dados pessoais, contato, filiação |
| `rhfp_legado_dados_funcionaisBusiness` | Matrículas, cargos, setores |
| `rhfp_financeiroBusiness` | Outro módulo financeiro (referência) |
| `CarregaLayoutBusiness` | Carregamento de templates HTML |
| `UniversalBusiness` | Operações genéricas/utilitárias |

**Padrão Típico:**
```csharp
public List<AtosEventosDTO> ObterPorCPF(string cpf)
{
    // 1. Valida entrada
    if (ValidarCPF(cpf) == false)
        throw new BusinessValidationException("CPF inválido");
    
    // 2. Instancia Repository
    var repo = new rhfp_legado_atos_e_eventosRepository();
    
    // 3. Busca Entities
    var entities = repo.BuscaPorCPF(cpf);
    
    // 4. Mapeia Entity → DTO (transforma dados)
    var dtos = entities.Select(e => new AtosEventosDTO {
        ate_id = e.ate_id,
        ate_cod_texto = e.ate_cod_texto,
        // ... conversões de tipos e formatos
    }).ToList();
    
    return dtos;
}
```

### 3️⃣ Camada de Acesso a Dados (RHFP.Repository)

**Localização:** `RHFP.Repository/Repository/`

**Responsabilidades:**
- Definir contrato de acesso (Interfaces)
- Implementar consultas LINQ
- Gerenciar DbContext
- Retornar Entities

**Padrão Repository Genérico:**
```csharp
public interface IRepository<T> where T : class
{
    T Get(int id);
    IEnumerable<T> GetAll();
    IQueryable<T> Query();
    void Add(T entity);
    void Update(T entity);
    void Delete(T entity);
}
```

**Implementações Específicas:**

| Repositório | Entidade | Queries Principais |
|------------|----------|-------------------|
| `rhfp_legado_atos_e_eventosRepository` | `rhfp_legado_atos_eventos` | BuscaPorCPF, BuscaPorPeriodo |
| `rhfp_legado_FinanceirosRepository` | `rhfp_financeiro` | BuscaPorPeriodo, BuscaPorRubrica |
| `rhfp_legado_dados_pessoaisRepository` | `rhfp_dados_pessoais` | BuscaPorCPF, BuscaPorMatricula |

**Query Típica (LINQ to Entities):**
```csharp
public IEnumerable<rhfp_legado_atos_eventos> BuscaPorCPF(string cpf)
{
    using (RhfpContext context = new RhfpContext()) {
        return context.rhfp_legado_atos_eventos
            .Where(a => a.rpf_pessoa_cpf == cpf)
            .OrderByDescending(a => a.ate_dt_ato)
            .ToList();
    }
}
```

### 4️⃣ Camada de Dados (RHFP.ModelData)

**Localização:** `RHFP.ModelData/Database/`

**Responsabilidades:**
- Mapear entidades com tabelas Oracle
- Gerenciar DbContext e conexões
- Definir relacionamentos

**DbContext:**
- Classe: `RhfpContext`
- Base: `DbContext` (Entity Framework 6)
- DbSets principais:
  - `DbSet<rhfp_legado_atos_eventos>`
  - `DbSet<rhfp_financeiro>`
  - `DbSet<rhfp_dados_pessoais>`
  - `DbSet<rhfp_dados_funcionais>`

**Mapeamento de Entidades:**
```csharp
[Table("rhfp_legado_atos_eventos")]
public class rhfp_legado_atos_eventos
{
    [Key]
    public int ate_id { get; set; }
    
    [Column("ate_cod_texto")]
    public string ate_cod_texto { get; set; }
    
    // ... outras propriedades mapeadas
}
```

### 5️⃣ Camada de Transfer (RHFP.DTO)

**Localização:** `RHFP.DTO/DTOS/`

**Responsabilidades:**
- Definir tipos para transferência entre camadas
- Evitar exposição de Entities
- Simplificar contratos

**DTOs Principais:**

| DTO | Campos-chave | Origem |
|-----|--------------|--------|
| `AtosEventosDTO` | ate_id, ate_cod_texto, ate_atos_eventos, ate_dt_ato | Entity atosEventos |
| `FinanceiroDTO` | rf_id, rf_ano, rf_numero, rf_valor | Entity financeiro |
| `DadosPessoaisDTO` | dp_cpf, dp_nome, dp_dt_nascimento | Entity pessoais |

---

## ESTRUTURA DE PROJETOS

```
RHFP.sln
├── RHFPMVC/
│   ├── Controllers/
│   │   ├── AtosEventosController.cs
│   │   ├── FinanceiroController.cs
│   │   ├── DadosPessoaisController.cs
│   │   ├── RelatoriosController.cs
│   │   ├── LoginController.cs
│   │   └── ...
│   │
│   ├── Views/
│   │   ├── AtosEventos/
│   │   │   ├── Index.cshtml
│   │   │   ├── Relatorio.cshtml
│   │   │   └── AtoEventos.cshtml
│   │   ├── Shared/
│   │   │   └── _Layout.cshtml
│   │   └── ...
│   │
│   ├── Content/
│   │   ├── controls/js/script-page/
│   │   │   ├── relatorios-ato-eventos.js
│   │   │   ├── relatorios-financeiro.js
│   │   │   └── ...
│   │   └── html/
│   │       ├── LayoutPrincipal.html (template de relatório)
│   │       └── ...
│   │
│   ├── App_Data/
│   │   ├── wkhtmltopdf/  (Geração PDF)
│   │   └── ...
│   │
│   └── App_Docs/  (Esta pasta!)
│       ├── Arquitetura.md
│       ├── RegrasDeNegocio.md (NOVO)
│       ├── FluxosDados.md (NOVO)
│       └── ...
│
├── RHFP.Business/
│   └── Business/
│       ├── rhfp_legado_atos_e_eventosBusiness.cs
│       ├── rhfp_legado_financeiroBusiness.cs
│       ├── rhfp_legado_dados_pessoaisBusiness.cs
│       └── ...
│
├── RHFP.Repository/
│   ├── Repository/
│   │   ├── Interfaces/
│   │   │   ├── IRepository.cs (genérica)
│   │   │   └── ...
│   │   └── Implementations/
│   │       ├── rhfp_legado_atos_e_eventosRepository.cs
│   │       ├── rhfp_legado_FinanceirosRepository.cs
│   │       └── ...
│
├── RHFP.ModelData/
│   └── Database/
│       ├── Entity/
│       │   ├── rhfp_legado_atos_eventos.cs
│       │   ├── rhfp_financeiro.cs
│       │   └── ...
│       └── RhfpContext.cs
│
└── RHFP.DTO/
    └── DTOS/
        ├── AtosEventosDTO.cs
        ├── FinanceiroDTO.cs
        ├── DadosPessoaisDTO.cs
        └── ...
```

---

## FLUXOS INTERNOS

### Fluxo de Consulta - Exemplo Atos e Eventos

```
┌─ Navegador (jQuery AJAX)
│
├─→ POST /AtosEventos/GetAtos
│   { cpf: "123.456.789-10", dtInicio: "2026-01-01", dtFinal: "2026-12-31" }
│
├─→ [AtosEventosController.GetAtos()]
│   ├─ Valida GSIController (autenticação + permissão)
│   ├─ Valida entrada (CPF format)
│   ├─ Instancia rhfp_legado_atos_e_eventosBusiness
│   └─ Chama business.ObterPorCPF(cpf)
│
├─→ [rhfp_legado_atos_e_eventosBusiness.ObterPorCPF()]
│   ├─ Validação de regra (BusinessValidationException se inválido)
│   ├─ Instancia rhfp_legado_atos_e_eventosRepository
│   ├─ Chama repository.BuscaPorCPF(cpf)
│   └─ Mapeia Entity[] → AtosEventosDTO[]
│
├─→ [rhfp_legado_atos_e_eventosRepository.BuscaPorCPF()]
│   ├─ Cria RhfpContext
│   ├─ LINQ query no DbSet
│   └─ Retorna IEnumerable<Entity>
│
├─→ [RhfpContext / Entity Framework]
│   ├─ Traduz LINQ → SQL
│   └─ Executa SELECT no Oracle
│
├─← JSON Response: { success: true, data: [{...}, {...}] }
│
└─→ Navegador (JavaScript renderiza em DataTable)
```

### Fluxo de Geração de PDF

```
┌─ Usuário clica "Gerar PDF"
│
├─→ POST /Relatorios/GerarPDF
│   { cpf, dtInicio, dtFinal }
│
├─→ [RelatoriosController.GerarPDF()]
│   ├─ Valida filtros
│   ├─ Instancia RelHtmlPDF_AtosEventos
│   ├─ Chama gerador.GerarHTML(dados)
│   └─ Instancia NReco.PdfGenerator
│
├─→ [RelHtmlPDF_AtosEventos.GerarHTML()]
│   ├─ Busca template HTML em Content/
│   ├─ Insere dados (nome, CPF, atos, datas)
│   └─ Retorna string HTML formatado
│
├─→ [NReco.PdfGenerator]
│   ├─ Chama App_Data/wkhtmltopdf.exe
│   ├─ Renderiza HTML com WebKit browser engine
│   └─ Retorna byte[] de PDF
│
├─← FileContentResult + headers
│   Content-Type: application/pdf
│   Content-Disposition: attachment
│
└─→ Navegador (abre/baixa PDF)
```

---

## SEGURANÇA E AUTENTICAÇÃO

### 1. Autenticação (Verificação de Identidade)

**Mecanismo:** Framework GSI (integração corporativa)
- Suporta LDAP/AD (produção)
- Suporta login automático (desenvolvimento)

**Fluxo:**
```
Tela Login
    ↓
LoginController.Autenticar(username, password)
    ├─ Valida entrada não-vazia
    ├─ Consulta GSICl ient (integração)
    └─ Se OK: Session["USUARIOLOGADO"] = usuário
        └─ Redireciona para /Home
       Se NOK: Mostra erro
```

### 2. Autorização (Verificação de Permissões)

**Camadas:**
- **Nível 1:** GSIController.OnActionExecuting()
  - Verifica Session["USUARIOLOGADO"] existência
  - Verifica permissao de rota via GSI
- **Nível 2:** Controllers específicos (lógica de negócio)
  - Valida que dados pertencem ao usuário autenticado

**Resultado de Falha:**
- 401 Unauthorized (sem autenticação)
- 403 Forbidden (sem permissão)

### 3. Proteção de Dados

**Guideline:**
- CPF/RG: Mascarar em exibição pública (***., --)
- Senhas: Nunca armazenar em session (usar Hash)
- Tokens: Usar HTTPS sempre que possível
- CORS: Não ativar para domínios públicos

---

## TRATAMENTO DE DADOS

###  Transformação Entity ↔ DTO

```csharp
// Entity (do ORM) → DTO (transfer)
AtosEventosDTO dto = new AtosEventosDTO {
    ate_id = entity.ate_id,
    ate_cod_texto = entity.ate_cod_texto,
    ate_dt_ato = entity.ate_dt_ato?.ToString("yyyyMMdd") ?? "",  // Conversão
    ate_original_cargo = entity.ate_original_cargo ?? ""          // Null safety
};
```

**Razões:**
1. Desacoplamento entre camadas
2. Segurança (não expõe relações de banco)
3. Controle de formato (datas, moedas)
4. Performance (subset de campos)

### Validação em Camadas

```
┌─────────────────────────────────────┐
│ Controller (Validação de Requisição)│
│ - Tipos de campo (string, int)       │
│ - Campos obrigatórios                │
└─────────────────┬───────────────────┘
                  │
┌─────────────────┴───────────────────┐
│ Business (Validação de Regra)       │
│ - CPF válido (dígitos verificadores)│
│ - Datas no intervalo permitido      │
│ - Pessoa existe no sistema          │
└─────────────────┬───────────────────┘
                  │
┌─────────────────┴───────────────────┐
│ Repository/EF (Validação de Schema) │
│ - Constraint de banco (unique, FK)  │
│ - Tipos compatíveis                 │
│ - Required fields                   │
└─────────────────────────────────────┘
```

---

## PADRÕES DE DESIGN

### 1. Repository Pattern
Abstraem acesso a dados via interfaces.
```csharp
var repo = new rhfp_legado_atos_e_eventosRepository();
var entities = repo.BuscaPorCPF(cpf);
```

### 2. DTO Pattern
Transferência de dados entre camadas.
```csharp
public class AtosEventosDTO { /* campos públicos */ }
```

### 3. Business Logic Pattern
Orquestração de regras em classe dedicada.
```csharp
var business = new rhfp_legado_atos_e_eventosBusiness();
var resultado = business.ObterPorCPF(cpf);
```

### 4. SessionAttribute Pattern (GSIController)
Gerenciamento centralizado de autenticação.

---

## 🔗 REFERÊNCIAS CRUZADAS

- **Regras de Negócio:** [RegrasDeNegocio.md](./RegrasDeNegocio.md)
- **Fluxos de Dados:** [FluxosDados.md](./FluxosDados.md)
- **Relatórios:** [Relatórios.md](./Relatórios.md)
- **Módulos:** [Módulos.md](./Módulos.md)
- **Análise Completa:** [../../ANALISE-ARQUITEURA-RHFP-LEGADO.md](../../ANALISE-ARQUITEURA-RHFP-LEGADO.md)

---

**Versão:** 2.0  
**Status:** Publicado  
**Próxima revisão:** Trimestral
