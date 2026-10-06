# Integração de Camadas - RHFP Legado

**Última atualização:** Outubro 1, 2026  
**Versão:** 1.0  
**Foco:** Comunicação entre camadas, padrões de integração e orquestração

---

## 📑 ÍNDICE

1. [Princípios Gerais](#princípios-gerais)
2. [Controller ↔ Business](#controller--business)
3. [Business ↔ Repository](#business--repository)
4. [Repository ↔ Entity Framework](#repository--entity-framework)
5. [Transformação de Dados](#transformação-de-dados)
6. [Tratamento de Exceções](#tratamento-de-exceções)
7. [Padrões de Comunicação](#padrões-de-comunicação)
8. [Exemplo Completo: Consulta de Atos](#exemplo-completo-consulta-de-atos)

---

## PRINCÍPIOS GERAIS

### P1: Unidirecionalidade
Camadas superiores conhecem camadas inferiores; o inverso é proibido.

```
┌─────────────────────────────────────┐
│  Camada A (superior)                │
│  └─ conhece Camada B                │
└──────────────┬──────────────────────┘
               │
┌──────────────┴──────────────────────┐
│  Camada B (inferior)                │
│  └─ NÃO conhece Camada A            │
└─────────────────────────────────────┘
```

**Exemplo:**
- Controller conhece Business ✅
- Business NÃO conhece Controller ❌

### P2: Contrato via Interface
Repositories expõem contratos (interfaces) para desacoplamento.

```csharp
// Repository expõe interface
public interface IRepository<T> where T : class
{
    T Get(int id);
    IEnumerable<T> GetAll();
    // ...
}

// Business depende de interface, não implementação
public class MyBusiness
{
    public MyBusiness(IRepository<MyEntity> repo) { /* DI */ }
}
```

### P3: Transformação em Camada de Business
DTOs são criados na Business, não no Controller.

```
Repository → Entity[]
    ↓
Business → (mapeia) → DTO[]
    ↓
Controller → (retorna) → JSON
```

### P4: Validações Múltiplas
Cada camada valida sua responsabilidade:
- **Controller:** Formato/tipo de requisição
- **Business:** Regras de negócio
- **Repository:** Schema/constraints
- **EF:** Tipos de banco

---

## CONTROLLER ↔ BUSINESS

### Responsabilidades do Controller

```csharp
[HttpPost]
public ActionResult GetAtosEventos()
{
    try {
        // 1. RECEBER: jQuery POST → C# dynamic filtros
        dynamic filtros = /* JSON.Parse() */;

        // 2. VALIDAR FORMATO: Tipos de campo
        if (filtros.cpf == null) 
            return Json(new { success = false, message = "CPF obrigatório" });

        // 3. INSTANCIAR: Business
        var business = new rhfp_legado_atos_e_eventosBusiness();

        // 4. CHAMAR: Método de negócio
        var resultado = business.ObterPorCPF((string)filtros.cpf);

        // 5. RETORNAR: JSON estruturado
        return Json(new { success = true, data = resultado });
    }
    catch (BusinessValidationException ex) {
        // Exceção esperada → mensagem amigável
        return Json(new { success = false, message = ex.Message });
    }
    catch (Exception ex) {
        // Exceção inesperada → log + mensagem genérica
        Debug.WriteLine(ex.ToString());
        return Json(new { success = false, message = "Erro ao processar" });
    }
}
```

**Checklist Controller:**
- ✅ Verifica autenticação (GSIController)
- ✅ Valida tipos de entrada
- ✅ Instancia Business
- ✅ Retorna JSON com `{ success, message, data }`
- ✅ Trata exceções com mensagens amigáveis

### Padrão de Resposta

```json
// Sucesso
{
  "success": true,
  "message": "Dados obtidos com sucesso",
  "data": [ /* lista de DTOs */ ]
}

// Erro de Regra (esperado)
{
  "success": false,
  "message": "CPF não possui atos registrados",
  "data": null
}

// Erro de Sistema (inesperado)
{
  "success": false,
  "message": "Erro ao processar solicitação",
  "data": null
}
```

---

## BUSINESS ↔ REPOSITORY

### Responsabilidades da Business

```csharp
public class rhfp_legado_atos_e_eventosBusiness
{
    public List<AtosEventosDTO> ObterPorCPF(string cpf)
    {
        // 1. VALIDAR: Regra de negócio
        if (string.IsNullOrWhiteSpace(cpf))
            throw new BusinessValidationException("CPF obrigatório");

        string cpfLimpo = Regex.Replace(cpf, @"\D", "");
        if (cpfLimpo.Length != 11)
            throw new BusinessValidationException("CPF deve ter 11 dígitos");

        // 2. INSTANCIAR: Repository
        var repo = new rhfp_legado_atos_e_eventosRepository();

        // 3. CHAMAR: Consulta de dados
        var entities = repo.BuscaPorCPF(cpfLimpo);

        // 4. VALIDAR: Resultado não deve ser nulo
        if (entities == null) 
            entities = new List<rhfp_legado_atos_eventos>();

        // 5. TRANSFORMAR: Entity → DTO (mapeamento)
        var dtos = entities.Select(e => new AtosEventosDTO {
            ate_id = e.ate_id,
            ate_cod_texto = e.ate_cod_texto ?? "",
            ate_atos_eventos = e.ate_atos_eventos ?? "",
            ate_desc_tp_ato = e.ate_desc_tp_ato ?? "",
            ate_dt_ato = e.ate_dt_ato?.ToString("yyyyMMdd") ?? "",
            // ... mapear todos os campos
        }).ToList();

        // 6. AGREGAR/CALCULAR: Se necessário (ex: saldos)
        // var dtoComTotal = dtos.Sum(x => x.valor);

        // 7. RETORNAR: DTO pronto para apresentação
        return dtos;
    }
}
```

**Checklist Business:**
- ✅ Valida entrada conforme regra
- ✅ Trata null/vazio
- ✅ Instancia Repository
- ✅ Mapeia Entity → DTO
- ✅ Aplica transformações (datas, máscaras)
- ✅ Calcula agregações se necessário
- ✅ Lança `BusinessValidationException` para erros esperados

### Padrão de DTO

```csharp
// Simples - apenas dados
public class AtosEventosDTO
{
    public int ate_id { get; set; }
    public string ate_cod_texto { get; set; }
    public string ate_atos_eventos { get; set; }
    public string ate_dt_ato { get; set; }  // Já convertido em string
    // ... 20+ campos
}

// Complexo - com agregações
public class FinanceiroDTO
{
    public string competencia { get; set; }  // yyyyMM
    public decimal creditos { get; set; }
    public decimal debitos { get; set; }
    public decimal saldo { get; set; }  // Calculado na Business
}
```

---

## REPOSITORY ↔ ENTITY FRAMEWORK

### Responsabilidades do Repository

```csharp
public class rhfp_legado_atos_e_eventosRepository
{
    // Método tipado
    public IEnumerable<rhfp_legado_atos_eventos> BuscaPorCPF(string cpf)
    {
        // 1. CRIAR: Contexto Entity Framework
        using (RhfpContext context = new RhfpContext()) {
            
            // 2. COMPOSIÇÃO: LINQ query
            var query = context.rhfp_legado_atos_eventos
                .Where(a => a.rpf_pessoa_cpf == cpf)          // Filtrar por CPF (FK)
                .OrderByDescending(a => a.ate_dt_ato);        // Ordenar por data

            // 3. EXECUTAR: ToList() força execução no banco
            var resultado = query.ToList();

            // 4. RETORNAR: Entidades mapeadas
            return resultado;
        }
    }
}
```

**Checklist Repository:**
- ✅ Usa DbContext com `using` statement
- ✅ Composição LINQ com Where/OrderBy/Select
- ✅ ToList() para executar (não retorna IQueryable naked)
- ✅ Retorna Entity, não DTO
- ✅ Trata exceções de banco (opcionalmente)
- ✅ Sem lógica de negócio (apenas queries)

### Padrão Genérico

```csharp
public interface IRepository<T> where T : class
{
    T Get(int id);
    IEnumerable<T> GetAll();
    IQueryable<T> Query();  // Lazy evaluation
    void Add(T entity);
    void Update(T entity);
    void Delete(T entity);
    void SaveChanges();
}

public class BaseRepository<T> : IRepository<T> where T : class
{
    protected RhfpContext context;
    
    public BaseRepository(RhfpContext context)
    {
        this.context = context;
    }
    
    public virtual T Get(int id)
    {
        return context.Set<T>().Find(id);
    }
    
    // ... implementar interface
}
```

### LINQ Queries Comuns

```csharp
// SELECT simples
context.Tabela.Where(t => t.id == 1).FirstOrDefault();

// SELECT com filtro
context.Tabela
    .Where(t => t.status == "A")
    .OrderByDescending(t => t.data)
    .ToList();

// SELECT com include (JOIN)
context.Pessoa
    .Include(p => p.Matriculas)  // Eager load FK
    .Where(p => p.cpf == cpf)
    .FirstOrDefault();

// SELECT agregado
context.Financeiro
    .GroupBy(f => f.rf_dt_competencia)
    .Select(g => new {
        competencia = g.Key,
        total = g.Sum(x => x.rf_valor)
    })
    .ToList();
```

---

## ENTITY FRAMEWORK

### Responsabilidades do DbContext

```csharp
public class RhfpContext : DbContext
{
    // 1. CONFIGURAR: Connection String
    public RhfpContext()
        : base("name=RhfpConnection")
    {
    }

    // 2. MAPEAR: DbSets (tabelas)
    public DbSet<rhfp_legado_atos_eventos> rhfp_legado_atos_eventos { get; set; }
    public DbSet<rhfp_financeiro> rhfp_financeiro { get; set; }
    public DbSet<rhfp_dados_pessoais> rhfp_dados_pessoais { get; set; }
    // ...

    // 3. CONFIGURAR: Mapeamento customizado (se necessário)
    protected override void OnModelCreating(DbModelBuilder modelBuilder)
    {
        // Fluent API (alternativo a Data Annotations)
        modelBuilder.Entity<rhfp_legado_atos_eventos>()
            .HasKey(e => e.ate_id);

        base.OnModelCreating(modelBuilder);
    }
}
```

### Mapeamento de Entidades

```csharp
[Table("rhfp_legado_atos_eventos")]
public class rhfp_legado_atos_eventos
{
    [Key]
    [Column("ate_id")]
    public int ate_id { get; set; }

    [Column("ate_cod_texto")]
    public string ate_cod_texto { get; set; }

    [Column("ate_atos_eventos")]
    public string ate_atos_eventos { get; set; }

    [Column("ate_dt_ato")]
    public DateTime? ate_dt_ato { get; set; }  // Nullable para datas opcionais

    // Relacionamento (FK)
    [Column("rpf_pessoa_cpf")]
    public string rpf_pessoa_cpf { get; set; }

    // Propriedade de Navegação
    [ForeignKey("rpf_pessoa_cpf")]
    public virtual rhfp_dados_pessoais Pessoa { get; set; }
}
```

---

## TRANSFORMAÇÃO DE DADOS

### Conversões Comuns

```csharp
// Data: Oracle YYYYMMDD → Apresentação DD/MM/YYYY
string atoDataOracle = "20260915";  // Entity
DateTime data = DateTime.ParseExact(atoDataOracle, "yyyyMMdd", null);
string apresentacao = data.ToString("dd/MM/yyyy");  // DTO → "15/09/2026"

// CPF: Sem máscara no BD → Com máscara no DTO
string cpfBd = "12345678910";       // Entity
string cpfMascarado = Regex.Replace(cpfBd, @"(.{3})(.{3})(.{3})(.{2})", 
    "$1.$2.$3-$4");                 // "123.456.789-10" para apresentação

// Moeda: Sem decimais → Com decimais
decimal valorBd = 1000000m;         // Entity (em centavos)
decimal valorBrl = valorBd / 100;   // DTO: 10000.00

// Enum: Código → Descrição
public enum TipoMovimento { Credito = 'C', Debito = 'D' }
char tipo = 'C';  // Entity
string descricao = tipo == 'C' ? "Crédito" : "Débito";  // DTO
```

### Padrão de Mapeamento

```csharp
// Manual (controle total)
var dto = new AtosEventosDTO {
    ate_id = entity.ate_id,
    ate_cod_texto = entity.ate_cod_texto ?? "",
    ate_dt_ato = entity.ate_dt_ato?.ToString("yyyyMMdd") ?? "",
};

// Com AutoMapper (reduz boilerplate)
var config = new MapperConfiguration(cfg => {
    cfg.CreateMap<rhfp_legado_atos_eventos, AtosEventosDTO>()
        .ForMember(d => d.ate_dt_ato, 
            opt => opt.MapFrom(s => s.ate_dt_ato.Value.ToString("yyyyMMdd")));
});
var mapper = config.CreateMapper();
var dtos = mapper.Map<List<AtosEventosDTO>>(entities);
```

---

## TRATAMENTO DE EXCEÇÕES

### Hierarquia de Exceções

```csharp
// 1. Exceção de Negócio (Esperada)
public class BusinessValidationException : Exception
{
    public BusinessValidationException(string message) : base(message) { }
}

// 2. Exceção do EF (Banco)
try {
    context.SaveChanges();
}
catch (DbUpdateException ex) {
    throw new BusinessValidationException("Dados duplicados ou relacionamento quebrado");
}

// 3. Exceção genérica (Inesperada)
catch (Exception ex) {
    Debug.WriteLine(ex.ToString());  // Log interno
    throw;  // Propagar para Controller
}
```

### Fluxo de Propagação

```
┌─────────────────────────────────┐
│ Repository.BuscaPorCPF()        │
│   └─ DBException → log          │
│       └─ throw BusinessValidator│
└────────────────┬────────────────┘
                 │
┌────────────────┴────────────────┐
│ Business.ObterPorCPF()          │
│   └─ catch BusinessValidator    │
│       └─ throw novamente        │
└────────────────┬────────────────┘
                 │
┌────────────────┴────────────────┐
│ Controller.GetAtosEventos()     │
│   └─ catch BusinessValidator    │
│       └─ Json { success: false} │
└─────────────────────────────────┘
         ↓ HTTP 200
    Navegador (alert)
```

---

## PADRÕES DE COMUNICAÇÃO

### Padrão Request-Response

```
REQUEST (JSON)                      RESPONSE (JSON)
┌─────────────────────────┐         ┌──────────────────────────┐
│ cpf: "123.456.789-10"   │   POST  │ success: true            │
│ dtInicio: "01/01/2026"  │────────→│ message: "Ok"            │
│ dtFinal: "30/09/2026"   │         │ data: [{...}, {...}]     │
└─────────────────────────┘         └──────────────────────────┘

║  SERVIDOR
║
║  PAS.1: Deserializar JSON → dynamic filtros
║  PAS.2: Validar tipos e formatos
║  PAS.3: Chamar Business.Metodo(filtros)
║  PAS.4: Serializar resposta → JSON
```

### Padrão Síncrono (Bloqueia até resposta)

```javascript
// Cliente
fetch('/AtosEventos/GetAtos', {
    method: 'POST',
    body: JSON.stringify({ cpf: '...' })
})
.then(r => r.json())
.then(data => {
    if (data.success) {
        // Renderiza dados
    }
});

// Servidor (Express-like pseudo-código)
app.post('/AtosEventos/GetAtos', (req, res) => {
    const business = new Business();
    const dados = business.ObterPorCPF(req.body.cpf);
    res.json({ success: true, data: dados });
});
```

### Padrão de Paginação (Futuro)

```csharp
public PagedResult<AtosEventosDTO> ObterPorCPF(string cpf, int page = 1, int pageSize = 10)
{
    var entities = repo.BuscaPorCPF(cpf);
    
    var pagedDtos = entities
        .Skip((page - 1) * pageSize)
        .Take(pageSize)
        .ToList();
    
    return new PagedResult<AtosEventosDTO> {
        TotalCount = entities.Count(),
        PageSize = pageSize,
        PageNumber = page,
        Items = pagedDtos
    };
}
```

---

## EXEMPLO COMPLETO: CONSULTA DE ATOS

### Requisição Completa

```
┌───────────────────────────────────────────────────────────┐
│ 1. NAVEGADOR (JavaScript)                                 │
│    ┌─────────────────────────────────────────────────────┐│
│    │ $('#btnConsultar').click(function() {               ││
│    │     fetch('/AtosEventos/GetAtos', {                 ││
│    │         method: 'POST',                             ││
│    │         body: JSON.stringify({                      ││
│    │             cpf: $('#txtCPF').val()                 ││
│    │         })                                          ││
│    │     })                                              ││
│    │     .then(r => r.json())                            ││
│    │     .then(data => minhaTabela.carregar(data.data))  ││
│    │ });                                                 ││
│    └─────────────────────────────────────────────────────┘│
└───────────────────┬─────────────────────────────────────────┘
                    │ POST /AtosEventos/GetAtos
                    │ { cpf: "123.456.789-10" }
                    ↓
┌───────────────────────────────────────────────────────────┐
│ 2. CONTROLLER (C#)                                        │
│    ┌─────────────────────────────────────────────────────┐│
│    │ [HttpPost]                                          ││
│    │ public ActionResult GetAtos()                       ││
│    │ {                                                   ││
│    │     dynamic filtros = Request.InputStream;          ││
│    │                                                     ││
│    │     var business = new                              ││
│    │         rhfp_legado_atos_e_eventosBusiness();       ││
│    │                                                     ││
│    │     var resultado =                                 ││
│    │         business.ObterPorCPF(filtros.cpf);          ││
│    │                                                     ││
│    │     return Json(new {                               ││
│    │         success = true,                             ││
│    │         data = resultado                            ││
│    │     });                                             ││
│    │ }                                                   ││
│    └─────────────────────────────────────────────────────┘│
└───────────────────┬─────────────────────────────────────────┘
                    │ Valida + Instancia Business
                    ↓
┌───────────────────────────────────────────────────────────┐
│ 3. BUSINESS (C#)                                          │
│    ┌─────────────────────────────────────────────────────┐│
│    │ public List<AtosEventosDTO> ObterPorCPF(string cpf) ││
│    │ {                                                   ││
│    │     // Validar                                      ││
│    │     if (!ValidarCPF(cpf))                           ││
│    │         throw new                                   ││
│    │             BusinessValidationException(...);       ││
│    │                                                     ││
│    │     // Instanciar Repository                        ││
│    │     var repo =                                      ││
│    │         new rhfp_legado_atos_e_eventosRepository(); ││
│    │                                                     ││
│    │     // Buscar Entities                              ││
│    │     var entities = repo.BuscaPorCPF(cpf);           ││
│    │                                                     ││
│    │     // Mapear Entity → DTO                          ││
│    │     var dtos = entities                             ││
│    │         .Select(e => new AtosEventosDTO { ... })    ││
│    │         .ToList();                                  ││
│    │                                                     ││
│    │     return dtos;                                    ││
│    │ }                                                   ││
│    └─────────────────────────────────────────────────────┘│
└───────────────────┬─────────────────────────────────────────┘
                    │ Aplicar regras + Mapear
                    ↓
┌───────────────────────────────────────────────────────────┐
│ 4. REPOSITORY (C#)                                        │
│    ┌─────────────────────────────────────────────────────┐│
│    │ public IEnumerable<rhfp_legado_atos_eventos>        ││
│    │ BuscaPorCPF(string cpf)                             ││
│    │ {                                                   ││
│    │     using (RhfpContext context =                    ││
│    │         new RhfpContext()) {                        ││
│    │                                                     ││
│    │         return context.rhfp_legado_atos_eventos     ││
│    │             .Where(a => a.rpf_pessoa_cpf == cpf)    ││
│    │             .OrderByDescending(a => a.ate_dt_ato)   ││
│    │             .ToList();                              ││
│    │     }                                               ││
│    │ }                                                   ││
│    └─────────────────────────────────────────────────────┘│
└───────────────────┬─────────────────────────────────────────┘
                    │ Executar LINQ no banco
                    ↓
┌───────────────────────────────────────────────────────────┐
│ 5. ENTITY FRAMEWORK + ORACLE                              │
│    ┌─────────────────────────────────────────────────────┐│
│    │ SELECT ate_id, ate_cod_texto, ate_atos_eventos,  ││
│    │        ate_desc_tp_ato, ate_dt_ato, ...            ││
│    │ FROM rhfp_legado_atos_eventos                       ││
│    │ WHERE rpf_pessoa_cpf = :cpf                         ││
│    │ ORDER BY ate_dt_ato DESC                            ││
│    └─────────────────────────────────────────────────────┘│
└───────────────────┬─────────────────────────────────────────┘
                    │ Retorna Entity[]
                    ↓
┌───────────────────────────────────────────────────────────┐
│ 6. RESPONSE JSON (Cliente)                                │
│    ┌─────────────────────────────────────────────────────┐│
│    │ {                                                   ││
│    │   "success": true,                                  ││
│    │   "data": [                                         ││
│    │     {                                               ││
│    │       "ate_id": 1,                                  ││
│    │       "ate_cod_texto": "001",                       ││
│    │       "ate_atos_eventos": "Nomeação",               ││
│    │       "ate_dt_ato": "20260915"                      ││
│    │     },                                              ││
│    │     { ... }                                         ││
│    │   ]                                                 ││
│    │ }                                                   ││
│    └─────────────────────────────────────────────────────┘│
└───────────────────┬─────────────────────────────────────────┘
                    │ jQuery deserializa
                    ↓
┌───────────────────────────────────────────────────────────┐
│ 7. RENDERIZAÇÃO (DOM)                                     │
│    ┌─────────────────────────────────────────────────────┐│
│    │ data.forEach(item => {                              ││
│    │     table.row.add([                                 ││
│    │         item.ate_cod_texto,                         ││
│    │         item.ate_atos_eventos,                      ││
│    │         formatarData(item.ate_dt_ato),              ││
│    │     ]);                                             ││
│    │ });                                                 ││
│    │ table.draw();                                       ││
│    │                                                     ││
│    │ <!-- DataTable renderiza -->                        ││
│    │ │ Código │ Descrição │ Data      │                 ││
│    │ ├────────┼───────────┼───────────┤                 ││
│    │ │ 001    │ Nomeação  │ 15/09/26  │                 ││
│    │ │ 002    │ Promoção  │ 20/08/26  │                 ││
│    │ └────────┴───────────┴───────────┘                 ││
│    └─────────────────────────────────────────────────────┘│
└───────────────────────────────────────────────────────────┘
```

---

## 🔗 REFERÊNCIAS CRUZADAS

- **Regras de Negócio:** [RegrasDeNegocio.md](./RegrasDeNegocio.md)
- **Fluxos de Dados:** [FluxosDados.md](./FluxosDados.md)
- **Arquitetura:** [Arquitetura.md](./Arquitetura.md)
- **Análise Completa:** [../../ANALISE-ARQUITEURA-RHFP-LEGADO.md](../../ANALISE-ARQUITEURA-RHFP-LEGADO.md)

---

**Versão:** 1.0  
**Status:** Publicado  
**Diagramas:** ASCII  
