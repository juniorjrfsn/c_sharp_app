# Fluxos de Dados - RHFP Legado

**Última atualização:** Outubro 1, 2026  
**Versão:** 1.0  
**Foco:** Rastreamento de informação entre camadas e componentes

---

## 📑 ÍNDICE

1. [Fluxo Geral de Requisição](#fluxo-geral-de-requisição)
2. [Fluxo de Consulta - Atos e Eventos](#fluxo-de-consulta---atos-e-eventos)
3. [Fluxo de Consulta - Dados Financeiros](#fluxo-de-consulta---dados-financeiros)
4. [Fluxo de Consulta - Dados Pessoais e Funcionais](#fluxo-de-consulta---dados-pessoais-e-funcionais)
5. [Fluxo de Geração de Relatório PDF](#fluxo-de-geração-de-relatório-pdf)
6. [Fluxo de Autenticação](#fluxo-de-autenticação)
7. [Transformação de Dados Entre Camadas](#transformação-de-dados-entre-camadas)
8. [Fluxo de Tratamento de Erros](#fluxo-de-tratamento-de-erros)

---

## FLUXO GERAL DE REQUISIÇÃO

```
┌─────────────────────────────────────────────────────────────┐
│                      NAVEGADOR (Cliente)                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  HTML/CSS/JS + jQuery + DataTables + Bootstrap      │   │
│  │  └─ Eventos: click, change, submit → AJAX           │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP POST/GET + JSON
                         ↓
┌─────────────────────────────────────────────────────────────┐
│              RHFPMVC - Controllers Layer                     │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ [GSIController]                                       │   │
│  │  ├─ OnActionExecuting: Verifica autenticação        │   │
│  │  ├─ OnActionExecuted: Registra auditoria             │   │
│  │  └─ User context (Session["USUARIOLOGADO"])          │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │ [AtosEventosController | FinanceiroController ...]   │   │
│  │  ├─ Index(): Retorna view                            │   │
│  │  ├─ GetData(): AJAX endpoint                         │   │
│  │  └─ ExportPDF(): Gera PDF                            │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │ Instancia Business + DTO
                         ↓
┌─────────────────────────────────────────────────────────────┐
│          RHFP.Business - Business Logic Layer               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ [rhfp_legado_atos_e_eventosBusiness]                 │   │
│  │  ├─ ObterPorCPF(string cpf): List<DTO>              │   │
│  │  ├─ ValidarFiltros(filtros): bool                    │   │
│  │  └─ Aplica regras de negócio                         │   │
│  │                                                       │   │
│  │ [rhfp_legado_financeiroBusiness]                     │   │
│  │  ├─ ObterMovimentos(cpf, dtInicio, dtFim): List<DTO>│   │
│  │  ├─ CalcularSaldos(): decimal                        │   │
│  │  └─ Agrupa por competência/rubrica                   │   │
│  │                                                       │   │
│  │ [Outras Business Classes]                            │   │
│  │  └─ Padrão similar para cada domínio                 │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │ Instancia Repository
                         ↓
┌─────────────────────────────────────────────────────────────┐
│      RHFP.Repository - Data Access Layer (DAL)              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ [IRepository<T>] - Interface genérica                │   │
│  │  ├─ Get(id): T                                        │   │
│  │  ├─ GetAll(): IEnumerable<T>                         │   │
│  │  └─ Query(): IQueryable<T>                           │   │
│  │                                                       │   │
│  │ [rhfp_legado_atos_e_eventosRepository]               │   │
│  │  ├─ BuscaPorCPF(cpf): IEnumerable<Entity>           │   │
│  │  └─ Consultas LINQ específicas                       │   │
│  │                                                       │   │
│  │ [rhfp_legado_FinanceirosRepository]                  │   │
│  │  ├─ BuscaPorPeriodo(cpf, dtIni, dtFim)              │   │
│  │  └─ Agrupa e totaliza no banco                       │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │ Query LINQ to Entities
                         ↓
┌─────────────────────────────────────────────────────────────┐
│      RHFP.ModelData - Entity Framework & Mapping            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ [RhfpContext] - Entity Framework DbContext           │   │
│  │  ├─ DbSet<rhfp_legado_atos_eventos>                 │   │
│  │  ├─ DbSet<rhfp_financeiro>                           │   │
│  │  └─ Connection String → Oracle                       │   │
│  │                                                       │   │
│  │ [Entity Classes]                                      │   │
│  │  ├─ data annotations [Table], [Column], [Key]        │   │
│  │  └─ Propriedades com mesmo nome que colunas BD       │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │ SQL Nativo (ORM Translation)
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                    BANCO ORACLE (Persistência)               │
│  ├─ rhfp_legado_atos_eventos                               │
│  ├─ rhfp_financeiro                                         │
│  ├─ rhfp_dados_pessoais                                     │
│  ├─ rhfp_dados_funcionais                                   │
│  └─ [50+ tabelas] com relacionamentos                       │
└────────────────────────┬────────────────────────────────────┘
                         │ Retorna resultados
                         ↓
┌─────────────────────────────────────────────────────────────┐
│        RETORNO (Reverse Flow - Mesmo Caminho)               │
│                                                              │
│  1. Entity[] → Repository                                   │
│  2. Repository → Business (mapeia para DTO)                 │
│  3. Business → Controller (retorna DTO)                     │
│  4. Controller → View/JSON (serializa)                      │
│  5. JSON → Navegador (deserializa em JavaScript)            │
│  6. JavaScript → DOM (renderiza tabelas, gráficos)          │
└─────────────────────────────────────────────────────────────┘
```

---

## FLUXO DE CONSULTA - ATOS E EVENTOS

### Passo 1: Requisição do Cliente
```javascript
// Content/controls/js/script-page/relatorios-ato-eventos.js

fetch('AtosEventos/GetAtos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        cpf: '123.456.789-10',
        dtInicio: '01/01/2026',
        dtFinal: '30/09/2026'
    })
})
.then(r => r.json())
.then(data => {
    if (data.success) {
        processarDados(data.data);  // data = Array<AtosEventosDTO>
    }
});
```

### Passo 2: Controller recebe requisição
```csharp
// Controllers/AtosEventosController.cs

[HttpPost]
public ActionResult GetAtos(dynamic filtros)
{
    try {
        // 1. Valida entrada
        string cpf = filtros.cpf;
        if (!ValidarCPF(cpf)) {
            return Json(new { success = false, message = "CPF inválido" });
        }

        // 2. Instancia Business
        var business = new rhfp_legado_atos_e_eventosBusiness();

        // 3. Chama método
        var resultado = business.ObterAtosPorCPF(cpf);

        // 4. Retorna DTO
        return Json(new { 
            success = true, 
            data = resultado  // List<AtosEventosDTO>
        });
    }
    catch (Exception ex) {
        return Json(new { success = false, message = ex.Message });
    }
}
```

### Passo 3: Business orquestra a consulta
```csharp
// RHFP.Business/Business/rhfp_legado_atos_e_eventosBusiness.cs

public List<AtosEventosDTO> ObterAtosPorCPF(string cpf)
{
    // 1. Valida CPF
    if (string.IsNullOrWhiteSpace(cpf)) 
        throw new BusinessValidationException("CPF obrigatório");

    // 2. Remove máscara
    string cpfLimpo = Regex.Replace(cpf, @"\D", "");

    // 3. Instancia Repository
    var repo = new rhfp_legado_atos_e_eventosRepository();

    // 4. Busca dados
    var entities = repo.BuscaPorCPF(cpfLimpo);

    // 5. Mapeia Entity → DTO (aplica transformações)
    var dtos = entities.Select(e => new AtosEventosDTO {
        ate_id = e.ate_id,
        ate_cod_texto = e.ate_cod_texto,
        ate_atos_eventos = e.ate_atos_eventos,
        ate_desc_tp_ato = e.ate_desc_tp_ato,
        ate_dt_ato = e.ate_dt_ato?.ToString("yyyyMMdd") ?? "",
        // ... outros campos
    }).ToList();

    return dtos;
}
```

### Passo 4: Repository consulta banco
```csharp
// RHFP.Repository/Repository/Implementations/
// rhfp_legado_atos_e_eventosRepository.cs

public IEnumerable<rhfp_legado_atos_eventos> BuscaPorCPF(string cpf)
{
    using (RhfpContext context = new RhfpContext()) {
        
        // Query LINQ
        var query = context.rhfp_legado_atos_eventos
            .Where(ate => ate.rpf_pessoa_cpf == cpf)  // FK para pessoa
            .OrderByDescending(ate => ate.ate_dt_ato)
            .ToList();  // Executa SELECT no Oracle

        return query;
    }
}
```

### Passo 5: Entity Framework traduz para SQL
```sql
-- Gerado pelo EF6 (tradução de LINQ)
SELECT ate_id, ate_cod_texto, ate_atos_eventos, ate_desc_tp_ato,
       ate_dt_ato, ate_dt_validade, ate_dt_final, ate_prazo,
       ate_num_diario_oficial, ate_dt_diario_oficial,
       ate_original_simbolo, ate_original_cargo,
       -- ... outros campos
FROM rhfp_legado_atos_eventos
WHERE rpf_pessoa_cpf = :cpf
ORDER BY ate_dt_ato DESC
```

### Passo 6: Retorno de dados até o cliente
```
┌────────────────────────────────────────────┐
│ Oracle (Entity) → EF (mapeia)              │
│    ↓                                        │
│ Repository (IEnumerable)                   │
│    ↓                                        │
│ Business (mapeia Entity → DTO)             │
│    ↓                                        │
│ Controller (serializa DTO)                 │
│    ↓                                        │
│ JSON: { success: true, data: [...] }       │
│    ↓                                        │
│ JavaScript (deserializa)                   │
│    ↓                                        │
│ DOM (renderiza tabela/cards)               │
└────────────────────────────────────────────┘
```

### Passo 7: JavaScript renderiza dados
```javascript
function processarDados(dados) {
    // dados = [ { ate_id: 1, ate_cod_texto: "001", ... }, ...]
    
    // 1. Inicializa DataTable
    var table = $('#tableAtoEventos').DataTable();
    
    // 2. Limpa dados antigos
    table.clear();
    
    // 3. Adiciona novo dados
    dados.forEach(item => {
        table.row.add([
            item.ate_cod_texto,
            item.ate_atos_eventos,
            formatarData(item.ate_dt_ato),
            item.ate_desc_tp_ato,
            // ... colunas
        ]);
    });
    
    // 4. Redesenha tabela
    table.draw();
    
    // 5. Renderiza relatório (se aplicável)
    if (document.getElementById('template-ato-eventos-registro')) {
        gerarHTML(dados);  // Clona template, preenche dados
    }
}
```

---

## FLUXO DE CONSULTA - DADOS FINANCEIROS

### Fase 1: Entrada de Filtros
```json
{
    "cpf": "123.456.789-10",
    "dtInicio": "01/01/2026",
    "dtFinal": "30/09/2026",
    "agrupamento": "competencia"  // ou 'rubrica'
}
```

### Fase 2: Validação e Transformação
```csharp
public decimal[] CalcularSaldoPorPeriodo(string cpf, 
    DateTime dtInicio, DateTime dtFinal)
{
    // 1. Valida intervalo
    if (dtInicio > dtFinal)
        throw new BusinessValidationException("Data inicial > final");
    
    if ((dtFinal - dtInicio).TotalDays > 730)  // 2 anos
        throw new BusinessValidationException("Período máximo 24 meses");

    // 2. Gerencia períodos
    var repo = new rhfp_legado_FinanceirosRepository();
    
    // 3. Busca movimentos
    var movimentos = repo.BuscaPorPeriodo(cpf, dtInicio, dtFinal);

    // 4. Agrupa por competência
    var porCompetencia = movimentos
        .GroupBy(m => m.rf_dt_competencia?.ToString("yyyyMM"))
        .Select(g => new {
            competencia = g.Key,
            creditos = g.Where(m => m.rf_tipo_movimento == "C")
                       .Sum(m => m.rf_valor),
            debitos = g.Where(m => m.rf_tipo_movimento == "D")
                      .Sum(m => m.rf_valor),
            saldo = (decimal)0  // Calc depois
        })
        .ToList();

    // 5. Calcula saldos acumulados
    decimal saldoAcumulado = 0;
    foreach (var comp in porCompetencia) {
        saldoAcumulado += comp.creditos - comp.debitos;
        comp.saldo = saldoAcumulado;
    }

    return porCompetencia;
}
```

### Fase 3: Apresentação em Relatório
```
┌─────────────────────────────────────────────────┐
│  RELATÓRIO FINANCEIRO - CPF: 123.456.789-10     │
├─────────────────────────────────────────────────┤
│ Período: 01/01/2026 a 30/09/2026               │
├──────────┬─────────────┬────────┬────────┬──────┤
│ Mês/Ano  │   Crédito   │ Débito │ Saldo  │      │
├──────────┼─────────────┼────────┼────────┼──────┤
│ Jan/2026 │ 5.000,00    │ 50,00  │5000,00│ saldo│
│ Fev/2026 │ 5.100,00    │ 60,00  │10040,00│    │
│ ...      │ ...         │ ...    │ ...    │      │
├──────────┼─────────────┼────────┼────────┼──────┤
│ TOTAL    │ 45.500,00   │ 450,00 │45050,00│       │
└──────────┴─────────────┴────────┴────────┴──────┘
```

---

## FLUXO DE CONSULTA - DADOS PESSOAIS E FUNCIONAIS

### Integração Pessoa ↔ Matrícula

```
┌─────────────────────────────────────┐
│  Pessoa (CPF = PK)                  │
│  └─ Identificação única              │
│  └─ Dados: Nome, Nascimento, Contato│
│     │                                 │
│     └─→ FK: dp_cpf                   │
│                                       │
└─────────────────────────────────────┘
            ↓ Relacionamento 1:N
┌─────────────────────────────────────┐
│  Matrícula Funcional (FK dp_cpf)    │
│  └─ df_matricula (PK composta)       │
│  └─ Dados: Cargo, Função, Setor     │
│  └─ Período: Admissão → Exoneração   │
└─────────────────────────────────────┘
            ↓ Relacionamento 1:N
┌─────────────────────────────────────┐
│  Atos e Eventos (FK dp_cpf+df_mat)  │
│  └─ Histórico de mudanças           │
│  └─ Cargos acumulados, comissões    │
└─────────────────────────────────────┘
```

### Fluxo de Consulta Pessoa + Últimas Matrículas
```csharp
public class PessoaComMatriculasDTO
{
    public string dp_cpf { get; set; }
    public string dp_nome { get; set; }
    public DateTime dp_dt_filiacao { get; set; }
    public DateTime? dp_dt_desligamento { get; set; }
    
    // Doenças funcionais
    public List<MatriculaDTO> Matriculas { get; set; }
}

// Query:
var pessoas = dbContext.rhfp_legado_dados_pessoais
    .Where(p => p.dp_cpf == cpf)
    .Include(p => p.Matriculas)  // Eager load
    .FirstOrDefault();
```

---

## FLUXO DE GERAÇÃO DE RELATÓRIO PDF

```
┌──────────────────────────────────────────────────────────┐
│  1. Usuário clica "Gerar PDF"                            │
└──────────────────────┬───────────────────────────────────┘
                       │ JavaScript
                       ↓
┌──────────────────────────────────────────────────────────┐
│  2. AJAX POST: /Relatorios/GerarPDF                      │
│     Body: { cpf, dtInicio, dtFinal, ... }               │
└──────────────────────┬───────────────────────────────────┘
                       │ HTTP POST
                       ↓
┌──────────────────────────────────────────────────────────┐
│  3. RelatoriosController.GerarPDF()                      │
│     - Valida filtros                                     │
│     - Instancia RelHtmlPDF_AtosEventos                   │
│     - Passa dados                                        │
└──────────────────────┬───────────────────────────────────┘
                       │
                       ↓
┌──────────────────────────────────────────────────────────┐
│  4. RelHtmlPDF_AtosEventos.GerarHTML()                   │
│     - Busca template: Content/html/template-*.html       │
│     - Preenche campos: {{ nome }}, {{ cpf }}, etc.       │
│     - Renderiza tabelas com dados                        │
│     - Retorna string HTML completo                       │
└──────────────────────┬───────────────────────────────────┘
                       │
                       ↓
┌──────────────────────────────────────────────────────────┐
│  5. Controller envia HTML → NReco.PdfGenerator            │
│     - Configura A4, Retrato, Margens                     │
│     - Seta encoding UTF-8                                │
│     - Adiciona cabeçalho e rodapé                        │
└──────────────────────┬───────────────────────────────────┘
                       │
                       ↓
┌──────────────────────────────────────────────────────────┐
│  6. NReco invoca: App_Data/wkhtmltopdf.exe               │
│     - Renderiza HTML com browser engine (WebKit)         │
│     - Aplica CSS, imagens, fontes                        │
│     - Gera PDF                                           │
└──────────────────────┬───────────────────────────────────┘
                       │
                       ↓
┌──────────────────────────────────────────────────────────┐
│  7. Controller retorna PDF ao cliente                    │
│     Content-Type: application/pdf                        │
│     Content-Disposition: attachment; filename="..."      │
└──────────────────────┬───────────────────────────────────┘
                       │ HTTP Download
                       ↓
┌──────────────────────────────────────────────────────────┐
│  8. Navegador recebe PDF                                 │
│     - Abre em plugin PDF ou prompt download              │
└──────────────────────────────────────────────────────────┘
```

### Classes Envolvidas
```csharp
// Controllers/RelatoriosController.cs
public FileContentResult GerarPdfAtosEventos(dynamic filtros)
{
    var htmlGen = new RelHtmlPDF_AtosEventos();
    string htmlContent = htmlGen.GerarHTML(filtros);
    
    var converter = new HtmlToImage
    {
        ConvertHtmlString(htmlContent, "output.pdf");
    };
    
    return File(pdfBytes, "application/pdf", "atos-eventos.pdf");
}
```

---

## FLUXO DE AUTENTICAÇÃO

```
┌────────────────────────────────────┐
│  Tela de Login                     │
│  Username: xxxxx                   │
│  Password: *****                   │
│  [Autenticar]                      │
└────────────────┬───────────────────┘
                 │ Submete formulário
                 ↓
┌────────────────────────────────────────────┐
│  LoginController.Autenticar(user, pass)    │
│  1. Valida entrada (não-vazio)             │
│  2. Chama GSIClient (integração)           │
│  3. GSI valida credenciais (LDAP/BD)       │
└────────────────┬───────────────────────────┘
                 │
          ┌──────┴──────┐
          │             │
    Válido│             │Inválido
          ↓             ↓
    ┌──────────┐   ┌──────────────────┐
    │Sucesso!  │   │Erro: Credenciais │
    └────┬─────┘   │inválidas         │
         │        └────┬─────────────┘
         │             │ Redireciona para Login
         ↓             └─→ Mostra mensagem erro
    Session["USUARIOLOGADO"] = usuarioObject
         │
         ↓
    Redireciona para /Home/Index
         │
         ↓
    Controllers verificam Session
    (OnActionExecuting do GSIController)
```

---

## TRANSFORMAÇÃO DE DADOS ENTRE CAMADAS

### Entity ↔ DTO

```csharp
// Camada: Repository → Business

// Entity (do ORM)
rhfp_legado_atos_eventos entity = new rhfp_legado_atos_eventos {
    ate_id = 1,
    ate_cod_texto = "001",
    ate_atos_eventos = "Nomeação",
    ate_dt_ato = DateTime.Parse("20260101"),
    ate_original_cargo = "Analista",
};

// DTO (transporte)
AtosEventosDTO dto = new AtosEventosDTO {
    ate_id = entity.ate_id,
    ate_cod_texto = entity.ate_cod_texto,
    ate_atos_eventos = entity.ate_atos_eventos,
    ate_dt_ato = entity.ate_dt_ato?.ToString("yyyyMMdd") ?? "",  // Conversão
    ate_original_cargo = entity.ate_original_cargo ?? "",         // Null safety
};
```

### Padrão de Mapeamento Automático
```csharp
// Mapeia lista de Entities → DTOs
var dtos = entities.Select(entity => new AtosEventosDTO {
    ate_id = entity.ate_id,
    // ... outros campos
    ate_original_cargo = entity.ate_original_cargo ?? ""
}).ToList();

// Retorna para Business/Controller
return dtos;
```

---

## FLUXO DE TRATAMENTO DE ERROS

```
┌─────────────────────────────────────┐
│  Requisição em Controller           │
└────────────────┬────────────────────┘
                 │ try
                 ↓
          ┌──────────────────┐
          │ Executa lógica   │
          └────────┬─────────┘
                   │
            ┌──────┴───────┐
       Sucesso│             │Exceção
             ↓             ↓
        ┌─────────┐   ┌────────────────────┐
        │Return   │   │catch (Exception ex)│
        │Json ok  │   └────────┬───────────┘
        └─────────┘            │
                               ├─ Log erro (stack)
                               │
                               ├─ Trata por tipo:
                               │  - BusinessValidationException
                               │  - DbUpdateException
        ┌──────────────────────┤  - IOException
        │                      │  - Genérica
        ↓                      │
    Return Json({             │
        success: false,        │
        message: "msgFriendly" │
    })                         │
        ↑                      │
        └──────────────────────┘
                │
                ↓ HTTP 200 com { success: false }
    Navegador exibe alert("msgFriendly")
```

### Arquitetura de Exceções
```csharp
// BusinessValidationException - Regra de Negócio
if (string.IsNullOrWhiteSpace(cpf))
    throw new BusinessValidationException("CPF é obrigatório");

// Capturada no Controller
catch (BusinessValidationException ex)
{
    return Json(new { 
        success = false, 
        message = ex.Message  // "CPF é obrigatório"
    });
}

// Exceção genérica - Bug/Sistema
catch (Exception ex)
{
    // Log stack completo
    Debug.WriteLine(ex.ToString());
    
    return Json(new { 
        success = false, 
        message = "Erro ao processar solicitação"  // Genérica
    });
}
```

---

## 📝 RESUMO DE FLUXOS

| Fluxo | Entrada | Saída | Componentes-Chave |
|-------|---------|-------|-------------------|
| **Consulta Atos** | CPF + Período | List<AtosDTO> | Controller → Business → Repository → Entity |
| **Relatório Financeiro** | CPF + Datas | PDF em HTML | Controller → RelHtmlPDF → NReco → wkhtmltopdf |
| **Integração Pessoa-Matt** | CPF | PessoaDTO + MatrículasDTO[] | Multiple Queries JOIN |
| **Autenticação** | Username + Pass | JWT/Session | LoginController → GSI Framework → LDAP |
| **Tratamento Erro** | Exception | JSON com msg | try-catch → Controller → Cliente |

---

## 🔗 REFERÊNCIAS CRUZADAS

- **Regras de Negócio:** [RegrasDeNegocio.md](./RegrasDeNegocio.md)
- **Arquitetura:** [Arquitetura.md](./Arquitetura.md)
- **Relatórios:** [Relatórios.md](./Relatórios.md)
- **Análise Completa:** [../../ANALISE-ARQUITEURA-RHFP-LEGADO.md](../../ANALISE-ARQUITEURA-RHFP-LEGADO.md)

---

**Versão:** 1.0  
**Status:** Publicado  
**Diagramas:** ASCII  
