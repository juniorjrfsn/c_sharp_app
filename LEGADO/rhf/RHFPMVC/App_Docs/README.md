# RHFP Legado — documentação

Esta é a fonte oficial da documentação do sistema RHFP Legado. Documentos de projeto fora desta pasta devem apenas apontar para este índice.

| Documento | Conteúdo |
| --- | --- |
| [Arquitetura](Arquitetura.md) | Estrutura da solução, responsabilidades e fluxo da aplicação. |
| [Módulos](Módulos.md) | Funcionalidades e pontos de entrada de cada módulo. |
| [Relatórios](Relatórios.md) | Relatórios disponíveis e geração de PDF. |
| [Desenvolvimento](Desenvolvimento.md) | Pré-requisitos, restauração, compilação e execução local. |
| [Operação e segurança](Operacao-e-Seguranca.md) | Configuração por ambiente, publicação e cuidados operacionais. |

## Convenções

- Atualize esta documentação na mesma alteração que modificar comportamento, configuração, integração ou relatório.
- Não registre senhas, chaves, tokens, connection strings completas, dados pessoais ou endereços internos neste diretório.
- Use nomes de arquivos em Markdown e mantenha este índice atualizado quando incluir um documento novo.

## Escopo

O repositório contém a solução `RHFP/RHFP.sln`. A aplicação web é o projeto `RHFPMVC`; os demais projetos fornecem as camadas de domínio e dados que ela consome.
