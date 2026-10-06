# RHFP Legado — documentação

**Versão:** 2.0 (Atualizada - Outubro 2026)  
**Status:** ✅ Documentação Completa com Fluxos, Regras e Padrões

Esta é a fonte oficial da documentação do sistema RHFP Legado. Documentos de projeto fora desta pasta devem apenas apontar para este índice.

---

## 📚 DOCUMENTOS DISPONÍVEIS

### 🏗️ ARQUITETURA E DESIGN

| Documento | Conteúdo | Novo? |
| --- | --- | --- |
| [Arquitetura](Arquitetura.md) | 5 camadas, componentes, fluxo geral, segurança, padrões. | ✓ Expandido |
| [FluxosDados](FluxosDados.md) | **NOVO:** Dados em movimento entre camadas, exemplos práticos. | ✅ NOVO |
| [IntegracaoDeCamadas](IntegracaoDeCamadas.md) | **NOVO:** Como camadas se comunicam, padrões de integração. | ✅ NOVO |

### 💼 REGRAS DE NEGÓCIO

| Documento | Conteúdo | Novo? |
| --- | --- | --- |
| [RegrasDeNegocio](RegrasDeNegocio.md) | **NOVO:** 90+ regras por módulo, validações, formatos, relacionamentos. | ✅ NOVO |
| [Módulos](Módulos.md) | 11 módulos, responsabilidades, como adicionar novo. | ✓ Expandido |
| [Relatórios](Relatórios.md) | 4 tipos de relatório, geração de PDF, templates. | - |

### 👨‍💻 DESENVOLVIMENTO

| Documento | Conteúdo | Novo? |
| --- | --- | --- |
| [Desenvolvimento](Desenvolvimento.md) | Setup, padrões de código, boas práticas, troubleshooting. | ✓ Expandido |
| [Operação e segurança](Operacao-e-Seguranca.md) | Configuração por ambiente, produção, credenciais. | - |

---

## 🎯 GUIA RÁPIDO POR ROLE

### 👨‍💼 Product Owner / Business Analyst
**Comece por:** [Módulos.md](Módulos.md) → [RegrasDeNegocio.md](RegrasDeNegocio.md) → [Relatórios.md](Relatórios.md)

### 👨‍💻 Developer
**Comece por:** [Arquitetura.md](Arquitetura.md) → [Desenvolvimento.md](Desenvolvimento.md) → [FluxosDados.md](FluxosDados.md) → [IntegracaoDeCamadas.md](IntegracaoDeCamadas.md)

### 🏗️ Arquiteto / Tech Lead
**Leia tudo + análises:** Arquitetura.md | FluxosDados.md | IntegracaoDeCamadas.md | ../../ANALISE-ARQUITEURA-RHFP-LEGADO.md

### 🧪 QA / Tester
**Comece por:** [Módulos.md](Módulos.md) → [RegrasDeNegocio.md](RegrasDeNegocio.md) → [Desenvolvimento.md#validação-antes-de-entregar](Desenvolvimento.md#validação-antes-de-entregar)

### 🔒 DevOps / Infra
**Comece por:** [Operacao-e-Seguranca.md](Operacao-e-Seguranca.md) → [Arquitetura.md](Arquitetura.md)

---

## 💡 NOVO EM OUTUBRO/2026

### ✅ Três novos documentos criados:
1. **[RegrasDeNegocio.md](RegrasDeNegocio.md)** - Consolida todas as 90+ regras de negócio
2. **[FluxosDados.md](FluxosDados.md)** - Mostra como dados fluem entre camadas
3. **[IntegracaoDeCamadas.md](IntegracaoDeCamadas.md)** - Padrões de comunicação entre componentes

### ✓ Expandido:
- **[Arquitetura.md](Arquitetura.md)** - Agora com 5 camadas detalhadas, fluxos e padrões
- **[Módulos.md](Módulos.md)** - Agora com 11 módulos descritos, como adicionar novo
- **[Desenvolvimento.md](Desenvolvimento.md)** - Agora com troubleshooting, padrões, boas práticas

---

## 🔗 REFERÊNCIAS CRUZADAS

| Dúvida | Arquivo |
| --- | --- |
| "Como adiciono um novo módulo?" | [Módulos.md#adição-de-novo-módulo](Módulos.md#adição-de-novo-módulo) |
| "Qual a regra de X?" | [RegrasDeNegocio.md](RegrasDeNegocio.md) |
| "Como dados fluem?" | [FluxosDados.md](FluxosDados.md) |
| "Como integrar Controller→Business?" | [IntegracaoDeCamadas.md](IntegracaoDeCamadas.md) |
| "Erro de compilação?" | [Desenvolvimento.md#troubleshooting](Desenvolvimento.md#troubleshooting) |
| "BusinessValidationException?" | [RegrasDeNegocio.md#tratamento-de-erros](RegrasDeNegocio.md#tratamento-de-erros) |

---

## 📈 ANÁLISES PROFUNDAS

Documentos na raiz do projeto (para Arquitetos/Leads):

| Documento | Conteúdo |
| --- | --- |
| [../../ANALISE-ARQUITEURA-RHFP-LEGADO.md](../../ANALISE-ARQUITEURA-RHFP-LEGADO.md) | 80+ padrões, 20 dívidas técnicas, matriz de prioridade |
| [../../SUMARIO-EXECUTIVO.md](../../SUMARIO-EXECUTIVO.md) | 3 achados P0, roadmap trimestral, ROI |
| [../../DIAGRAMAS-ARQUITETURA.md](../../DIAGRAMAS-ARQUITETURA.md) | 10 diagramas ASCII profissionais |
| [../../GUIA-REFERENCIA-RAPIDA.md](../../GUIA-REFERENCIA-RAPIDA.md) | 16 controllers, queries LINQ, checklists |

---

## 🚀 COMO COMEÇAR

### Novo no projeto? (1.5 horas)
```
1. Leia Arquitetura.md (15 min)
2. Leia RegrasDeNegocio.md (20 min)
3. Clone e compile (30 min)
4. Execute em Debug (10 min)
5. Consulte Desenvolvimento.md conforme necessário
```

### Vai fazer uma feature?
```
1. Identifique module em Módulos.md
2. Leia regras relevantes em RegrasDeNegocio.md
3. Analise fluxo em FluxosDados.md
4. Siga padrão em Desenvolvimento.md
5. Teste conforme Desenvolvimento.md#validação-antes-de-entregar
```

### Questionário sobre arquitetura?
```
1. Leia Arquitetura.md (estrutura)
2. Estude FluxosDados.md (movimento)
3. Analise IntegracaoDeCamadas.md (comunicação)
4. Aprofunde em ../../análises
```

---

## 📋 CONVENÇÕES

- ✅ Atualize esta documentação na mesma alteração que modificar comportamento
- ✅ Use nomes em Markdown e mantenha este índice atualizado
- ✅ Adicione referências cruzadas aos novos documentos
- ❌ **Não registre:** senhas, tokens, connection strings, dados pessoais
- ❌ **Não duplicate:** regras já documentadas em outro arquivo

---

## 📊 ESCOPO DO PROJETO

O repositório contém:

```
RHFP/RHFP.sln
├── RHFPMVC           (interface MVC + Controllers)
├── RHFP.Business     (regras e orquestração)
├── RHFP.Repository   (acesso a dados)
├── RHFP.ModelData    (Entity Framework + mapeamento)
└── RHFP.DTO          (tipos de transferência)
     ↓
  Oracle Database (50+ tabelas)
```

**Responsabilidade desta pasta:** Documentar toda a lógica, arquitetura e padrões acima.

---

**Versão:** 2.0 | **Data:** Outubro 2026 | **Status:** ✅ Completa
