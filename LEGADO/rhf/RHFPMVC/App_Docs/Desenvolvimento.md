# Desenvolvimento - RHFP Legado

**Última atualização:** Outubro 1, 2026  
**Versão:** 2.0 (Expandido com padrões e troubleshooting)

---

## 📑 ÍNDICE

1. [Pré-requisitos e Setup](#pré-requisitos-e-setup)
2. [Abrir e Compilar](#abrir-e-compilar)
3. [Estrutura de Código](#estrutura-de-código)
4. [Padrões de Desenvolvimento](#padrões-de-desenvolvimento)
5. [Boas Práticas](#boas-práticas)
6. [Validação Antes de Entregar](#validação-antes-de-entregar)
7. [Troubleshooting](#troubleshooting)
8. [Testing e Debugging](#testing-e-debugging)

---

## PRÉ-REQUISITOS E SETUP

### Requisitos Mínimos

- ✅ **Visual Studio 2019+** (Community, Professional ou Enterprise)
- ✅ **.NET Framework 4.8** Developer Pack
- ✅ **NuGet Package Manager** (integrado no VS)
- ✅ **Oracle Client 12c+** ou Oracle Instant Client
- ✅ **Git** para versionamento
- ✅ **Acesso autorizado** a credenciais (BD, LDAP, Email)

### Instalação de Dependências

```bash
# Framework SGI (interno)
# Copie DLLs para Backup/bin ou configure NuGet feed corporativo

# Pacotes NuGet (automático)
Visual Studio → Tools → NuGet Package Manager → Package Manager Console
PM> Update-Package  # Restaura packages.config
```

### Criar Arquivo de Configuração Local

**Arquivo:** `Web.local.config` (não commitar!)

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <connectionStrings>
    <add name="RhfpConnection" 
         connectionString="Data Source=SEU_ORACLE_HOST;User Id=SEU_USER;Password=SEU_PASS;" 
         providerName="Oracle.ManagedDataAccess.Client" />
  </connectionStrings>
  <appSettings>
    <add key="EmailSMTPHost" value="seu_smtp.com" />
    <add key="EmailSMTPPort" value="587" />
    <add key="EmailSMTPUser" value="seu_usuario" />
    <add key="EmailSMTPPassword" value="sua_senha" />
  </appSettings>
</configuration>
```

---

## ABRIR E COMPILAR

### Passo 1: Abrir Solução

```
Visual Studio → File → Open Project/Solution
→ Selecione RHFP/RHFP.sln
```

### Passo 2: Restaurar Pacotes NuGet

```
Solution Explorer → Right-click na solução
→ "Restore NuGet Packages"
(ou) Tools → NuGet Package Manager → Manage Packages for Solution
```

### Passo 3: Verificar Referências

**Em cada projeto**, verifique que não há referências quebradas:

- ✅ RHFPMVC → RHFP.Business, RHFP.DTO
- ✅ RHFP.Business → RHFP.Repository, RHFP.DTO, RHFP.ModelData
- ✅ RHFP.Repository → RHFP.ModelData, RHFP.DTO
- ✅ RHFP.ModelData → (nenhuma dependência interna)
- ✅ RHFP.DTO → (nenhuma dependência interna)

### Passo 4: Configurar Projeto de Inicialização

```
Solution Explorer → Right-click em RHFPMVC
→ "Set as StartUp Project"
```

### Passo 5: Compilar Solução

```
Build → Build Solution (Ctrl+Shift+B)
```

**Resultado esperado:**
```
========== Build: 5 succeeded or up-to-date, 0 failed, 0 skipped ==========
```

**Erros comuns:**

| Erro | Solução |
|------|---------|
| "Oracle.ManagedDataAccess not found" | `Install-Package Oracle.ManagedDataAccess` |
| ".NET Framework 4.8 not installed" | Download .NET Framework 4.8 Developer Pack |
| "Build failed with exit code 1" | Clean solution, rebuild, limpar obj/bin |
| "DLL conflict" | NuGet Package Manager Console: `Update-Package -Reinstall` |

### Passo 6: Executar em Debug

```
Debug → Start Debugging (F5)
  ↓
Navegador abre http://localhost:PORTA/
```

---

## ESTRUTURA DE CÓDIGO

### Arquitetura em Camadas

```
┌─ RHFPMVC (Controllers, Views, Scripts) ─────┐
│                                             │
├─ RHFP.Business (Regras, Orquestração) ─────┤
│                                             │
├─ RHFP.Repository (Acesso a Dados) ─────────┤
│                                             │
├─ RHFP.ModelData (Entity Framework) ────────┤
│                                             │
├─ RHFP.DTO (Types de Transporte) ──────────┤
│                                             │
└─────────────────────────────────────────────┘
     ↓ (dependências unidirecionais)
   Oracle Database
```

**Princípio:** Camadas superiores conhecem inferiores; o inverso é proibido.

### Convenção de Naming

| Item | Padrão | Exemplo |
|------|--------|---------|
| Namespaces | PascalCase | `RHFP.Business` |
| Classes | PascalCase | `AtosEventosController` |
| Métodos | PascalCase | `ObterPorCPF()` |
| Propriedades | snake_case (BD) | `ate_cod_texto` |
| Variáveis | camelCase | `cpfLimpo` |
| Constantes | UPPER_CASE | `TIMEOUT_MINUTOS` |

---

## PADRÕES DE DESENVOLVIMENTO

### 1️⃣ Controller

**Responsabilidades:**
1. Receber requisição (GET/POST)
2. Validar formato/tipo
3. Instanciar Business
4. Retornar JSON com estrutura padrão

```csharp
[HttpPost]
public ActionResult Obter()
{
    try {
        // 1. Receber
        dynamic filtros = /* JSON */;

        // 2. Validar
        if (string.IsNullOrWhiteSpace(filtros.cpf))
            return Json(new { success = false, message = "CPF obrigatório" });

        // 3. Executar
        var business = new meuModuloBusiness();
        var resultado = business.Obter(filtros.cpf);

        // 4. Retornar
        return Json(new { success = true, data = resultado });
    }
    catch (BusinessValidationException ex) {
        // Exceção esperada (regra violada)
        return Json(new { success = false, message = ex.Message });
    }
    catch (Exception ex) {
        // Exceção inesperada (bug)
        Debug.WriteLine($"[ERROR] {ex.ToString()}");
        return Json(new { success = false, message = "Erro ao processar" });
    }
}
```

### 2️⃣ Business

**Responsabilidades:**
1. Validar entrada (reglas de negócio)
2. Instanciar Repository
3. Mapear Entity → DTO
4. Retornar DTO

```csharp
public class meuModuloBusiness
{
    public List<MeuModuloDTO> Obter(string cpf)
    {
        // 1. VALIDAR
        if (string.IsNullOrWhiteSpace(cpf))
            throw new BusinessValidationException("CPF obrigatório");

        if (Regex.Replace(cpf, @"\D", "").Length != 11)
            throw new BusinessValidationException("CPF deve ter 11 dígitos");

        // 2. INSTANCIAR
        var repo = new meuModuloRepository();

        // 3. BUSCAR
        var entities = repo.BuscaPor(cpf);
        if (entities == null) entities = new List<MinhaEntidade>();

        // 4. MAPEAR
        var dtos = entities.Select(e => new MeuModuloDTO {
            id = e.id,
            nome = e.nome ?? "",
            data = e.data_criacao?.ToString("dd/MM/yyyy") ?? ""
        }).ToList();

        // 5. RETORNAR
        return dtos;
    }
}
```

### 3️⃣ Repository

**Responsabilidades:**
1. Compor LINQ queries
2. Executar no banco (ToList/FirstOrDefault)
3. Retornar Entities (nunca DTOs!)

```csharp
public class meuModuloRepository
{
    public IEnumerable<MinhaEntidade> BuscaPor(string filtro)
    {
        using (RhfpContext context = new RhfpContext()) {
            return context.MinhaEntidade
                .Where(e => e.nome.Contains(filtro))
                .OrderByDescending(e => e.data_criacao)
                .ToList();  // Força execução
        }
    }
}
```

### 4️⃣ DTO

**Responsabilidades:**
- Apenas dados (sem lógica)
- Tipos convertidos/simples

```csharp
public class MeuModuloDTO
{
    public int id { get; set; }
    public string nome { get; set; }
    public string data { get; set; }  // Já formatado
    
    // ❌ Sem métodos, sem validação
    // ❌ Sem referências a Entity
}
```

---

## BOAS PRÁTICAS

### 1. Null Safety

```csharp
// ❌ ERRADO
string nome = entity.nome;
int len = nome.Length;  // NullReferenceException possível

//✅ CERTO
string nome = entity.nome ?? "";
int len = nome.Length;  // Seguro
```

### 2. Validação em Cascata

```csharp
// Nível 1: Controller (tipo/formato)
if (!DateTime.TryParse(dataStr, out var data))
    return Json(new { success = false, message = "Data inválida" });

// Nível 2: Business (regra)
if (data > DateTime.Now)
    throw new BusinessValidationException("Data não pode ser futura");

// Nível 3: EF (schema)
// Entity Framework valida constraints
```

### 3. Evitar N+1 Queries

```csharp
// ❌ ERRADO (N+1 queries)
var pessoas = context.Pessoa.ToList();
foreach (var p in pessoas) {
    var matriculas = context.Matricula.Where(m => m.cpf == p.cpf).ToList();
}

// ✅ CERTO (1 query)
var pessoas = context.Pessoa
    .Include(p => p.Matriculas)
    .ToList();
```

### 4. Magic Numbers →Constantes

```csharp
// ❌ ERRADO
if (tentativas > 3) lockAccount();

// ✅ CERTO
const int MAX_TENTATIVAS_LOGIN = 3;
if (tentativas > MAX_TENTATIVAS_LOGIN) lockAccount();
```

### 5. Logging de Erros

```csharp
catch (Exception ex) {
    Debug.WriteLine($"[ERROR] {DateTime.Now}: {ex.ToString()}");
    throw;  // Propagar para camada superior
}
```

### 6. Formatação de Datas

```csharp
// BD: YYYYMMDD (string no Oracle)
string dataOracleStr = "20260915";
DateTime data = DateTime.ParseExact(dataOracleStr, "yyyyMMdd", null);

// DTO: DD/MM/YYYY
string dataDTO = data.ToString("dd/MM/yyyy");  // "15/09/2026"
```

### 7. Máscaras de CPF

```csharp
// Sem máscara (BD)
string cpfBd = "12345678910";

// Com máscara (DTO/exibição)
string cpfMascarado = Regex.Replace(cpfBd,
    @"(\d{3})(\d{3})(\d{3})(\d{2})",
    "$1.$2.$3-$4");  // "123.456.789-10"
```

---

## VALIDAÇÃO ANTES DE ENTREGAR

### Checklist Funcional

- [ ] **Compilação:**
  - ✅ Solução compila sem erros
  - ✅ Warnings minimizados
  - ✅ Sem unused references

- [ ] **Funcionalidade:**
  - ✅ Caso de sucesso funciona (dados válidos)
  - ✅ Validação funciona (entrada inválida → mensagem amigável)
  - ✅ Exceção é tratada (erro → mensagem genérica)
  - ✅ Sem dados sensatos na exibição (CPF, senhas, tokens)

- [ ] **Performance:**
  - ✅ Resposta rápida (<2seg em casos normais)
  - ✅ PDF gerado em tempo aceitável (~5seg)
  - ✅ Sem N+1 queries visíveis

- [ ] **Segurança:**
  - ✅ Autenticação requerida (se GSIController)
  - ✅ Permissão validada (se necessário)
  - ✅ Sem exp injection (validar/escapar entrada)
  - ✅ Connection string não commitada

- [ ] **UI/PDF:**
  - ✅ Filtros com dados retornam resultados
  - ✅ Filtros vazios mostram mensagem apropriada
  - ✅ PDF abre sem erros
  - ✅ Acentuação preservada no PDF
  - ✅ Quebras de página corretas
  - ✅ Cabeçalho e rodapé presentes

- [ ] **Documentação:**
  - [ ] Code comments em lógica complexa
  - [ ] Atualizado App_Docs/Módulos.md (se novo módulo)
  - [ ] Atualizado App_Docs/Relatórios.md (se novo PDF)

### Teste de Regressão

```
1. Logar com usuário de teste
2. Verificar Dashboard carrega OK
3. Acessar módulos antigos (Financeiro, Atos, etc)
4. Gerar relatório antigo em PDF
5. Verificar sem erros na console (F12)
```

---

## TROUBLESHOOTING

### "Object reference not set to an instance of an object"

**Causa:** Null reference sem verificação.

```csharp
// Debug
var item = context.Item.Find(id);
Debug.Assert(item != null, "Item não encontrado!");

return item.Nome.Trim();  // Agora seguro
```

### "DbUpdateException: Foreign key constraint failed"

**Causa:** FK referencia dado inexistente.

```csharp
// Solução
var pessoa = context.Pessoa.Find(cpf);
if (pessoa == null)
    throw new BusinessValidationException("CPF não cadastrado");

// Depois adicionar relação
var matricula = new Matricula { cpf_pessoa = cpf, ... };
```

### "The connection was not closed..."

**Causa:** DbContext não descartado.

```csharp
// ❌ ERRADO
RhfpContext ctx = new RhfpContext();
var dados = ctx.Pessoa.ToList();
// ctx.Dispose() não chamado

// ✅ CERTO
using (RhfpContext ctx = new RhfpContext()) {
    var dados = ctx.Pessoa.ToList();
}  // Dispose automático
```

### "Template de PDF não renderiza"

**Causas:**
1. Encoding: `<meta charset="utf-8" />`
2. CSS: Usar paths absolutos (`~/Content/`)
3. wkhtmltopdf: Verificar existência do executável

```csharp
// Verificar
bool existe = File.Exists(Server.MapPath("~/App_Data/wkhtmltopdf/wkhtmltopdf.exe"));
```

### "Oracle ORA-01012: not logged in"

**Causa:** Connection string inválida ou BD inacessível.

```xml
<!-- Verificar Web.config -->
<add name="RhfpConnection" 
     connectionString="Data Source=HOST:PORT/SID;User Id=USER;Password=PASS;" />
```

---

## TESTING E DEBUGGING

### Debug com Breakpoints

```csharp
// Visual Studio
// 1. Clique na margem esquerda (linha que quer pausar)
// 2. F5 para iniciar debug
// 3. Quando atingir, abre janela de contexto (locals, watch, etc)
// 4. F10 próxima linha, F11 entrar função, F5 continuar
```

### Verificar Queries SQL Geradas

```csharp
// Em RhfpContext.OnModelCreating
context.Database.Log = s => Debug.WriteLine(s);

// Depois, qualquer query printa SQL no Debug Output
var pessoas = context.Pessoa.Where(p => p.status == "A").ToList();
// [Debug Output]:
// SELECT [p].[dp_id], [p].[dp_cpf], ...
// FROM [rhfp_dados_pessoais] AS [p]
// WHERE [p].[dp_status] N'A'
```

### Console do Navegador (F12)

```javascript
// Network tab: Ver requisições XHR
// Console: Ver erros JavaScript
// Application: Ver cookies/localStorage

// Exemplo erro
fetch('/AtosEventos/GetAtos', { method: 'POST', ... })
    .catch(err => console.error("ERRO:", err));
```

### Testes Manuais Estruturados

| Cenário | Input | Resultado Esperado |
|---------|-------|-------------------|
| Sucesso | CPF válido + período OK | Tabela preenchida |
| Validação | CPF inválido | Mensagem: "CPF inválido" |
| Vazio | CPF inexistente | "Nenhum ato encontrado" |
| Erro | BD desconectada | "Erro ao processar" |

---

## Dependências Relevantes

As versões são especificadas em `packages.config`:

- ✅ ASP.NET MVC 5.2.9
- ✅ Entity Framework 6.5.2
- ✅ NReco.PdfGenerator 1.2.1
- ✅ jQuery 3.7.0
- ✅ Bootstrap 5.2.3
- ✅ DataTables, Select2, InputMask
- ✅ MailKit 4.17.0 (Email)
- ✅ Oracle.ManagedDataAccess 23.26.300

---

## 🔗 REFERÊNCIAS

- **Arquitetura:** [Arquitetura.md](./Arquitetura.md)
- **Regras de Negócio:** [RegrasDeNegocio.md](./RegrasDeNegocio.md)
- **Fluxos:** [FluxosDados.md](./FluxosDados.md)
- **Integração:** [IntegracaoDeCamadas.md](./IntegracaoDeCamadas.md)
- **Segurança:** [Operacao-e-Seguranca.md](./Operacao-e-Seguranca.md)

---

**Versão:** 2.0  
**Status:** Publicado  
**Autor:** RHFP Development Team  
**Data:** Outubro 1, 2026
