# Regras de Negócio - RHFP Legado

**Última atualização:** Outubro 1, 2026  
**Versão:** 1.0  
**Aplicação:** RHFP Legado - Sistema de Gestão de Previdência Complementar

---

## 📑 ÍNDICE

1. [Regras Gerais do Sistema](#regras-gerais-do-sistema)
2. [Autenticação e Autorização](#autenticação-e-autorização)
3. [Atos e Eventos](#atos-e-eventos)
4. [Dados Financeiros](#dados-financeiros)
5. [Dados Pessoais](#dados-pessoais)
6. [Dados Funcionais](#dados-funcionais)
7. [Relatórios](#relatórios)
8. [Validações Globais](#validações-globais)
9. [Tratamento de Erros](#tratamento-de-erros)

---

## REGRAS GERAIS DO SISTEMA

### RN-001: Sessão de Usuário
- **Descrição:** Cada requisição valida a presença de usuário na sessão
- **Implementação:** `GSIController.OnActionExecuting()`
- **Timeout:** 90 minutos de inatividade
- **Exceção:** Controllers `HomeController` e `RelatoriosController` (público)
- **Fluxo:**
  ```
  Requisição HTTP
      ↓
  [GSIController]
      ↓ Verifica Session["USUARIOLOGADO"]
      ├─ ✓ Existe → Continua (Action)
      └─ ✗ Não existe → Redireciona para Login
  ```

### RN-002: Permissões por Rota
- **Descrição:** O framework GSI valida permissões do usuário para a rota solicitada
- **Implementação:** Framework SGI (não nativo do projeto)
- **Validação:** Ocorre em `OnActionExecuting()` do `GSIController`
- **Erro:** Usuário sem permissão recebe `HttpStatusCode.Unauthorized`

### RN-003: Padrão de Resposta AJAX
- **Descrição:** Todas as respostas JSON seguem padrão estruturado
- **Formato Esperado:**
  ```json
  {
    "success": true|false,
    "message": "descrição",
    "data": { /* objeto de retorno */ }
  }
  ```
- **Controllers:** Utilizados por scripts JavaScript nas views

### RN-004: Encoding e Codificação
- **Padrão:** UTF-8 obrigatório
- **Aplicação:** Views, relatórios, exportações
- **Crítico:** Acentuação e caracteres especiais devem ser preservados
- **PDFs:** NReco.PdfGenerator mantém encoding dos HTMl gerados

---

## AUTENTICAÇÃO E AUTORIZAÇÃO

### RN-AUTH-001: Fluxo de Login
```
Usuário → Tela Login
    ↓
  HTML POST: /Login/Autenticar
    ↓
  [LoginController.Autenticar()]
    ├─ Valida credenciais no framework GSI
    ├─ Se OK: Cria Session["USUARIOLOGADO"]
    └─ Redireciona para Home
```

### RN-AUTH-002: Logout
- **Ação:** `LoginController.Logout()`
- **Comportamento:** Remove `Session["USUARIOLOGADO"]`
- **Redirecionamento:** Página de login

### RN-AUTH-003: Autorização por Permissão
- **Responsável:** Framework GSI (verificação em `OnActionExecuting`)
- **Escopo:** Rotas protegidas herdam de `GSIController`
- **Resposta Negada:** HTTP 401 Unauthorized
- **Não Aplicável:** 
  - `/Home/Index` - Pública
  - `/Relatorios/*` - Pública com filtros
  - `/Login/*` - Pública

---

## ATOS E EVENTOS

### Entidades Relacionadas
```
┌─────────────────────────────────────────┐
│  rhfp_legado_atos_eventos               │
├─────────────────────────────────────────┤
│  ate_id                (PK)             │
│  ate_cod_texto         (Código Ato)     │
│  ate_atos_eventos      (Nome/Descrição) │
│  ate_desc_tp_ato       (Tipo: Ato/Evnt) │
│  ate_dt_ato            (Data do Ato)    │
│  ate_dt_validade       (Início Validade)│
│  ate_dt_final          (Fim Validade)   │
│  ate_prazo             (Dias corridos)  │
│  ate_num_diario_oficial (Nº Diário)     │
│  ate_dt_diario_oficial (Data Diário)    │
│  ate_original_*        (Cargo Original) │
│  ate_acumulado_*       (Cargo Acum.)   │
│  ate_comissao_*        (Cargo Comissão) │
│  ate_*_funcao_gratif*  (FG)             │
│  ate_*_legal           (Artigos Legais) │
│  ate_historico         (Histórico)      │
└─────────────────────────────────────────┘
```

### RN-ATE-001: Consulta de Atos por Pessoa
- **Input:** CPF ou Matrícula
- **Processo:** 
  1. Valida formato de CPF/Matrícula
  2. Busca pessoa no banco
  3. Retorna atos/eventos vinculados
- **Componentes:**
  - Business: `rhfp_legado_atos_e_eventosBusiness`
  - Repository: `rhfp_legado_atos_e_eventosRepository`
  - DTO: `rhfp_legado_atos_e_eventosDTO` ou `AtosEventosDTO`

### RN-ATE-002: Validação de Validade de Ato
- **Regra:** Ato vigente é aquele dentro do período `ate_dt_validade` ≤ hoje ≤ `ate_dt_final`
- **Caso Especial:** Se `ate_dt_final` nulo → sem data final (vigente indefinidamente)
- **Prazo:** Campo `ate_prazo` armazena duração em dias corridos (informativo)

### RN-ATE-003: Tipos de Cargo (Campos Condicionais)
Cada ato pode ter múltiplos cargos associados, exibidos conforme tipo:

| Tipo | Campos | Descrição |
|------|--------|-----------|
| Original | `ate_original_simbolo`, `ate_original_cargo` | Cargo base do vínculo |
| Acumulado | `ate_acumulado_simbolo`, `ate_acumulado_cargo` | Segundo cargo (acúmulo permitido) |
| Comissão | `ate_comissao_simbolo`, `ate_comissao_cargo` | Cargo de comissão/confiança |
| Gratificada | `ate_simbolo_funcao_gratificada`, `ate_cargo_funcao_gratificada` | Função gratificada |

**Exibição:** No relatório, item só é mostrado se tiver dados (não nulo/vazio).

### RN-ATE-004: Artigos Legais
- **Campo:** `ate_instrumento_legal`, `ate_artigo_legal`, `ate_inciso_legalL`
- **Uso:** Referência legal do ato/evento
- **Vínculo:** Um ato pode ter 1 a N artigos legais associados
- **Validação:** Não há validação de existência do artigo no sistema

### RN-ATE-005: Histórico
- **Campo:** `ate_historico`
- **Propriedade:** Texto livre descrevendo mudanças/contexto histórico
- **Exibição:** Sempre que preenchido (validar não-vazio no relatório)

### RN-ATE-006: Formatação de Datas em Relatórios
- **Padrão BD:** YYYYMMDD (ex: 20260901)
- **Padrão Exibição:** DD/MM/YYYY (ex: 01/09/2026)
- **Conversão:** JavaScript `formatarData()` ou Backend `ToLocalizedDate()`
- **Datas Inválidas:** "1899-12-30" ou "1900-01-01" devem ser omitidas na exibição

---

## DADOS FINANCEIROS

### Entidades Relacionadas
```
┌─────────────────────────────────────────┐
│  rhfp_financeiro                        │
├─────────────────────────────────────────┤
│  rf_id                 (PK)             │
│  rf_ano                (Ano fiscal)     │
│  rf_numero             (Sequencial)     │
│  rf_dt_competencia     (Mês ref.)      │
│  rf_tipo_movimento     (Débito/Crédito) │
│  rf_rubrica            (Código rubrica) │
│  rf_descricao          (Descrição)      │
│  rf_valor              (Valor em R$)    │
│  rf_situacao           (Ativo/Inativo)  │
└─────────────────────────────────────────┘
```

### RN-FIN-001: Consulta de Movimento por Período
- **Input:** CPF/Matrícula + Data inicial + Data final
- **Processamento:**
  1. Valida formato de datas (DD/MM/YYYY)
  2. Converte para YYYYMMDD para consulta
  3. Busca movimentos no período
  4. Agrupa por competência (ano/mês)
- **Componentes:**
  - Business: `rhfp_legado_financeiroBusiness` ou `rhfp_financeiroBusiness`
  - Repository: `rhfp_legado_dados_FinanceirosRepository`
  - DTO: `rhfp_financeiroDTO` ou `FinanceiroDTO`

### RN-FIN-002: Saldo e Totalizações
- **Cálculo de Saldo:** ∑(Créditos) - ∑(Débitos)
- **Agrupamento:** Por competência (mês/ano) ou por rubrica
- **Relatório:** Apresenta subtotais por rubrica e total geral

### RN-FIN-003: Tipos de Movimento
- **Débito:** Retirada de valor (pensão, desconto)
- **Crédito:** Depósito de valor (contribuição, prêmio)
- **Situação:** Campo `rf_situacao` define se valor é ativo na contabilidade

### RN-FIN-004: Rubricas Padrão
- **Manutenção:** Realizada via `/Gerencia/Rubricas` (ou equivalente)
- **Estrutura:** Código + Descrição + Tipo (débito/crédito)
- **Validação:** Rubrica consultada deve estar ativa

### RN-FIN-005: Períodos e Competências
- **Formato:** YYYYMM (ex: 202609 = Setembro/2026)
- **Extremos:**
  - Data mais antiga: 1990-01-01 (padrão histórico)
  - Data mais recente: data atual
- **Filtros Populares:**
  - Últimos 12 meses
  - Ano fiscal atual
  - Período customizado

---

## DADOS PESSOAIS

### Entidades Relacionadas
```
┌──────────────────────────────────────────┐
│  rhfp_legado_dados_pessoais              │
├──────────────────────────────────────────┤
│  dp_id                 (PK)              │
│  dp_cpf                (CPF - natural)   │
│  dp_nome               (Nome completo)   │
│  dp_dt_nascimento      (Data nasc.)     │
│  dp_sexo               (M/F)             │
│  dp_dt_filiacao        (Entrada sist.)   │
│  dp_dt_desligamento    (Saída sist.)    │
│  dp_status             (Ativo/Inativo)   │
│  dp_endereco_*         (Endereço)        │
│  dp_telefone_*         (Telefones)       │
│  dp_email              (E-mail)          │
│  dp_rg                 (RG - opcional)   │
│  dp_orgao_expedidor    (UF RG)           │
└──────────────────────────────────────────┘
```

### RN-PES-001: Identificação Única
- **Chave Principal:** CPF
- **Validação:** Deve ser numérico, 11 dígitos
- **Máscara:** `###.###.###-##` (apenas apresentação)
- **Duplicação:** Sistema não permite dois registros com mesmo CPF

### RN-PES-002: Vigência de Vínculo
- **Ativo:** `dp_status` = 'A' E data ≥ `dp_dt_filiacao` E data ≤ `dp_dt_desligamento` (se preenchido)
- **Inativo:** Desligado, aposentado ou excluído
- **Impacto:** Vinculações inativas ainda aparecem em pesquisas históricas

### RN-PES-003: Dados de Contato
- **Email:** Campo único por pessoa (ou nulo)
- **Telefone:** Pode haver múltiplos registros (residencial, celular, comercial)
- **Atualização:** Realizada via `/DadosPessoais/Editar` ou API

### RN-PES-004: Filiação e Desligamento
- **Filiação:** Data de entrada no sistema complementar
- **Desligamento:** Data de saída (aposentadoria, falecimento, cancelamento)
- **Validação:** `dp_dt_desligamento` ≥ `dp_dt_filiacao` (se ambas preenchidas)

---

## DADOS FUNCIONAIS

### Entidades Relacionadas
```
┌──────────────────────────────────────────┐
│  rhfp_legado_dados_funcionais            │
├──────────────────────────────────────────┤
│  df_id                 (PK)              │
│  df_cpf_pessoa         (FK)              │
│  df_matricula          (Matrícula única) │
│  df_cargo              (Cargo funcional) │
│  df_funcao             (Função atual)    │
│  df_quadro             (Quadro admin.)   │
│  df_situacao           (Ativo/Inativo)   │
│  df_dt_admissao        (Data ingresso)   │
│  df_dt_exoneracao      (Data saída)     │
│  df_level_salarial     (Nível)          │
│  df_setor              (Depto/Setor)     │
│  df_supervisor_matr    (Mat. superior)   │
└──────────────────────────────────────────┘
```

### RN-FUN-001: Matrícula Única
- **Propriedade:** Identificador único do vínculo funcional
- **Formato:** Numérico, variável (5-8 dígitos conforme instituição)
- **Imutável:** Não deve ser alterada após criação
- **Vínculo:** Uma pessoa (CPF) pode ter múltiplas matrículas (histórico)

### RN-FUN-002: Vigência de Vínculo Funcional
- **Ativo:** `df_situacao` = 'A' E data ≥ `df_dt_admissao` E (data ≤ `df_dt_exoneracao` OU `df_dt_exoneracao` nulo)
- **Histórico:** Registros com exoneração aparecem em buscas "completas"
- **Padrão:** Relatórios mostram dados do último vínculo funcional ativo

### RN-FUN-003: Hierarquia Funcional
- **Campo:** `df_supervisor_matr` → referencia outra matrícula (superior hierárquico)
- **Auto-referência:** Nula para cargos de direção (sem superior)
- **Uso:** Validação de permissões e geração de organogramas

### RN-FUN-004: Dados de Remuneração
- **Nível Salarial:** Define faixa de remuneração
- **Rubricas Aplicáveis:** Determinadas pelo cargo + vínculo funcional
- **Vigência:** Rubricas podem variar conforme período (atos e eventos)

---

## RELATÓRIOS

### RN-REL-001: Estrutura Geral de Relatore
```
┌────────────────────────────────────────────────────┐
│                  RELATÓRIO PADRÃO                  │
├────────────────────────────────────────────────────┤
│  Cabeçalho (Identificação do beneficiário)        │
│  ├─ Matrícula, Nome, CPF                         │
│  ├─ Data de geração                              │
│  └─ Período consultado (se aplicável)             │
├────────────────────────────────────────────────────┤
│  Corpo do Relatório                               │
│  ├─ Dados estruturados em seções                 │
│  ├─ Tabelas, listas ou texto conforme tipo      │
│  └─ Totalizações e resumos                       │
├────────────────────────────────────────────────────┤
│  Rodapé                                           │
│  ├─ Numeração de páginas                         │
│  ├─ Data atual                                   │
│  └─ AssinaturaDigital (opcional)                 │
└────────────────────────────────────────────────────┘
```

### RN-REL-002: Filtros de Relatório
- **Obrigatórios:** CPF ou Matrícula + Período (datas)
- **Opcionais:** Tipo de ato/evento, rubrica, status
- **Validação:** 
  - CPF: numérico, 11 dígitos
  - Matrícula: numérico, 5-8 dígitos
  - Datas: DD/MM/YYYY e data inicial ≤ data final
- **Padrão:** Se não informado período, usa últimos 12 meses

### RN-REL-003: Relatório de Atos e Eventos
- **Visualização:** Dados estruturados em 11 itens numerados
- **Campos Condicionais:**
  - Itens 5-8: Cargos (original, acumulado, comissão, FG) - só se preenchidos
  - Item 10: Histórico - só se preenchido
  - Item 11: Artigos legais - só se preenchidos
- **Formato:** HTML com possibilidade de export para PDF
- **Classes CSS:** `.item-1` a `.item-11` controladas por visibilidade dinâmica

### RN-REL-004: Relatório de Dados Financeiros
- **Período:** Competências (mês/ano) entre datas informadas
- **Agrupamento:** Por competência ou por rubrica
- **Totalizações:**
  - Total por competência
  - Total por rubrica
  - Total geral (débito vs crédito)
- **Formato:** Tabela com colunas (Data, Rubrica, Descrição, Débito, Crédito, Saldo)

### RN-REL-005: Relatório de Dados Pessoais
- **Conteúdo:** Filiação, desligamento, contato, documentos
- **Campos Sensíveis:** CPF sempre mascarado ou ofuscado na visualização
- **Exportação:** Permitida apenas para usuário autenticado

### RN-REL-006: Relatório de Dados Funcionais
- **Conteúdo:** Matrícula, cargo, função, quadro, supervisor
- **Histórico:** Pode incluir devoluções funcionais anteriores (opcional)
- **Vínculo:** Mostra relacionamento person name → multiple matrícula

### RN-REL-007: Geração e Cache de PDF
- **Fluxo:**
  ```
  JavaScript (Filtros)
      ↓ Submete formulário
  Controller (Valida filtros)
      ↓ Chama RelHtmlPDF*
  RelHtmlPDF_* (Prepara HTML)
      ↓ Retorna string HTML
  Controller (Envia para NReco)
      ↓
  NReco.PdfGenerator (Converte HTML → PDF)
      ↓
  wkhtmltopdf (Renderiza browser)
      ↓ Download do PDF ou visualização
  Navegador (Plugin PDF)
  ```
- **Binário:** `App_Data/wkhtmltopdf` (executável)
- **Timeout:** ~10 segundos por PDF grande
- **Encoding:** UTF-8 do HTML respeitado

### RN-REL-008: Formatação de PDFs
- **Padrão Papel:** A4 (210mm × 297mm)
- **Orientação:** Retrato (padrão) ou Paisagem (financeiro)
- **Margens:** 10mm (superior/inferior/esquerda/direita)
- **Cabeçalho:** Referência de pessoa (matrícula, nome, CPF)
- **Rodapé:** "Página X de Y" + "Data: 01/09/2026"
- **Fontes:** Arial 10pt (corpo), Times 12pt (títulos)

---

## VALIDAÇÕES GLOBAIS

### RN-VAL-001: Validação de CPF
```csharp
// Formato: 11 dígitos
// Padrão: ###.###.###-##
// Validação: Algoritmo de dígito verificador (opcional)
public bool ValidarCPF(string cpf)
{
    // Remove máscara
    string apenasDigitos = Regex.Replace(cpf, @"\D", "");
    
    // Verifica comprimento
    return apenasDigitos.Length == 11 && apenasDigitos.All(char.IsDigit);
}
```

### RN-VAL-002: Validação de Data
```csharp
// Formato: DD/MM/YYYY
// Intervalo: 1900-01-01 até data atual + 1 ano
// Descarta: 1899-12-30, 1900-01-01
public bool ValidarData(string data)
{
    if (!DateTime.TryParseExact(data, "dd/MM/yyyy", null, 
        System.Globalization.DateTimeStyles.None, out var resultado))
        return false;
    
    return resultado > new DateTime(1900, 1, 2) && 
           resultado <= DateTime.Now.AddYears(1);
}
```

### RN-VAL-003: Validação de Período
- **Regra:** `dataInicial` ≤ `dataFinal`
- **Intervalo Máximo:** 24 meses (2 anos)
- **Padrão Sugerido:** Se não informado, últimos 12 meses

### RN-VAL-004: Validação de Matrícula
```csharp
// Formato: numérico, 5-8 dígitos
// Não pode: iniciar com '0'
public bool ValidarMatricula(string matricula)
{
    return matricula.Length >= 5 && matricula.Length <= 8 &&
           matricula.All(char.IsDigit) && matricula[0] != '0';
}
```

### RN-VAL-005: Valores Numéricos
- **Moeda:** Sempre em Real (R$), até 2 casas decimais
- **Máximo:** 999.999.999,99
- **Mínimo:** 0,00 (sem valores negativos no frontend)
- **Separador:** Vírgula (,) para decimais, ponto (.) para milhar (padrão PT-BR)

---

## TRATAMENTO DE ERROS

### RN-ERR-001: Exceções com Mensagem Amigável
- **Interna:** `BusinessValidationException` com mensagem técnica
- **Externa:** Convertida para mensagem amigável no JSON AJAX
- **Log:** Sempre registra stack trace completo (quando implementado)

### RN-ERR-002: Resposta de Erro Padrão
```json
{
  "success": false,
  "message": "Não foi possível processar a solicitação.",
  "errorCode": "VALIDATION_ERROR",
  "details": "CPF inválido: 123.456.789-00"
}
```

### RN-ERR-003: Erros Comuns por Módulo

| Módulo | Erro | Causa |
|--------|------|-------|
| Atos/Eventos | "Ato não encontrado" | CPF/período sem registros |
| Financeiro | "Sem movimentos no período" | Períodos sem transações |
| Dados Pessoais | "Pessoa não cadastrada" | CPF não existe no sistema |
| Dados Funcionais | "Matrícula inativa" | Vínculo encerrado |

### RN-ERR-004: Timeout de Relatório
- **Limite:** 60 segundos por requisição PDF
- **Ação:** Se exceder, retorna mensagem de timeout
- **Recomendação:** Estreitar período ou filtros

---

## 📝 QUADRO RESUMIDO DE RESPONSABILIDADES

| Camada | Componente | Responsabilidade |
|--------|------------|------------------|
| **Presentation** | Controller | Validação de requisição, chamada de Business, retorno AJAX |
| **Presentation** | View | Renderização HTML, scripts AJAX de filtro |
| **Business** | *Business | Orquestração de regras, composição de queries |
| **Business** | DTO | Transporte de dados entre camadas |
| **Persistence** | Repository | Execução de queries, retorno de entidades |
| **Data** | Entity | Mapeamento com banco Oracle, autosave EF |

---

## 🔗 REFERÊNCIAS CRUZADAS

- **Arquitetura Detalhada:** [Arquitetura.md](./Arquitetura.md)
- **Fluxos de Dados:** [FluxosDados.md](./FluxosDados.md)
- **Relatórios:** [Relatórios.md](./Relatórios.md)
- **Módulos:** [Módulos.md](./Módulos.md)
- **Análise Completa:** [../../ANALISE-ARQUITEURA-RHFP-LEGADO.md](../../ANALISE-ARQUITEURA-RHFP-LEGADO.md)

---

**Versão:** 1.0  
**Status:** Publicado  
**Código de referência:** RN-001 a RN-ERR-004  
