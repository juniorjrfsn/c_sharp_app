# Módulos do sistema

As rotas seguem o padrão `/Controlador/Ação`.

| Módulo | Tela inicial | Responsabilidades |
| --- | --- | --- |
| Início | `/Home/Index` | Entrada da aplicação e páginas institucionais. | 
| Gestão | `/Gestao/Index` | Administração de questões, questionários, eventos e associação questionário-evento. |
| Gerência | `/Gerencia/Index` | Consulta de usuários, parâmetros, instituições e definição do evento vigente. |
| Estatística | `/Estatistica/Index` | Consultas de questões, respostas, eventos e indicadores de pontuação. |
| Envio de relatório | `/Envioemailrelpont/Index` | Geração de relatórios de pontuação para envio. |
| Relatórios | `/Relatorios/Index` | Dados pessoais, funcionais, atos/eventos e financeiro. |

## Operações assíncronas

## Inclusão ou alteração de módulo

1. Crie ou ajuste controller, view e script correspondente.
2. Aplique o controle de acesso pelo `GSIController` quando necessário.
3. Registre as ações JSON e dependências usadas pela página.
4. Atualize esta página e, se houver saída em PDF, `Relatórios.md`.
