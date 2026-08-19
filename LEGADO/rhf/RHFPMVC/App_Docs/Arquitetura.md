# Arquitetura

## Visão geral

O RHFP Legado é uma aplicação web ASP.NET MVC 5 sobre .NET Framework 4.8. A solução está em `RHFP/RHFP.sln` e é composta por cinco projetos:

```text
RHFPMVC (interface MVC)
    ↓
RHFP.Business (regras e consultas de negócio)
    ↓
RHFP.Repository (acesso a dados por repositórios)
    ↓
RHFP.ModelData (entidades Entity Framework e acesso Oracle)

RHFP.DTO (objetos transferidos entre as camadas)
```

| Projeto | Responsabilidade principal |
| --- | --- |
| `RHFPMVC` | Controllers, views Razor, scripts da interface, autenticação de sessão e relatórios HTML/PDF. |
| `RHFP.Business` | Regras, composição de consultas e carregamento de layout. |
| `RHFP.Repository` | Abstrações e implementações de repositórios. |
| `RHFP.ModelData` | Modelo Entity Framework, entidades do banco RHFP e `OracleHelper`. |
| `RHFP.DTO` | DTOs usados no transporte de dados entre as camadas. |

## Aplicação MVC

O roteamento segue o padrão `{controller}/{action}/{id}`. A inicialização registra rotas, filtros globais e bundles em `Global.asax.cs`. O filtro global padrão é `HandleErrorAttribute`.

As telas ficam em `Views/<Controller>`, os controllers em `Controllers` e o JavaScript específico de páginas em `Content/controls/script-page`. Recursos visuais e bibliotecas de navegador ficam em `Content`.

## Sessão, autenticação e autorização

Os controllers funcionais herdam de `GSIController`, que mantém o usuário em `Session["USUARIOLOGADO"]`, define timeout de 90 minutos e verifica autenticação e permissões de rota. O fluxo suporta autenticação pelo GSI; em desenvolvimento, o controlador prevê login automático conforme a configuração do framework SGI.

`HomeController` e `RelatoriosController` herdam diretamente de `Controller`. Ao acrescentar uma nova área que exija proteção, use `GSIController` e valide o comportamento de autorização.

## Dados e relatórios

O projeto usa Entity Framework 6 e possui configurações para o banco RHFP e uma integração Oracle. As definições de conexão pertencem ao ambiente e não devem ser copiadas para documentos, código ou histórico de Git.

Relatórios são montados em HTML pelos controllers/classes `RelHtmlPDF*` e convertidos em PDF com `NReco.PdfGenerator`, que usa o executável `wkhtmltopdf` distribuído em `App_Data/wkhtmltopdf`.
