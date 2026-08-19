# Desenvolvimento local

## Pré-requisitos

- Visual Studio com suporte a ASP.NET e desenvolvimento .NET Framework.
- .NET Framework 4.8 Developer Pack.
- NuGet para restaurar os pacotes da solução.
- Acesso autorizado às dependências internas SGI e aos bancos/serviços necessários ao ambiente de desenvolvimento.

## Abrir e compilar

1. Abra `RHFP/RHFP.sln` no Visual Studio.
2. Restaure os pacotes NuGet da solução.
3. Verifique as DLLs `SGI.Framework` e `SGI.Framework.MVC`, referenciadas pelo projeto web.
4. Configure as conexões exclusivamente para o seu ambiente, conforme `Operacao-e-Seguranca.md`.
5. Selecione `RHFPMVC` como projeto de inicialização e execute com IIS Express.

As configurações disponíveis são `Debug|Any CPU` e `Release|Any CPU`. O projeto web tem como alvo .NET Framework 4.8.

## Dependências relevantes

- ASP.NET MVC 5.2.9 e Razor 3.2.9.
- Entity Framework 6.5.2.
- NReco.PdfGenerator 1.2.1 para PDF.
- jQuery 3.7, Bootstrap, DataTables, Chartist, Highcharts, SweetAlert2 e Inputmask no front-end.

As versões declaradas em `packages.config` são a referência para as dependências NuGet do projeto web.

## Validação antes de entregar

- Compile a solução na configuração afetada.
- Execute manualmente a tela e o fluxo alterados.
- Para relatórios, teste filtros, ausência de dados, PDF e caracteres acentuados.
- Para acesso, valide usuário não autenticado, sem permissão e sessão expirada.

Não há projeto de testes automatizados identificado na solução. Registre testes novos nesta documentação quando forem adicionados.
