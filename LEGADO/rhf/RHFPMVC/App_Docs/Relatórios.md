# Relatórios

## Relatórios disponíveis

O módulo `/Relatorios` disponibiliza quatro relatórios:

| Relatório | Tela | Gerador HTML |
| --- | --- | --- |
| Financeiro | `/Relatorios/Financeiro` | `RelHtmlPDF_Financeiro` |
| Dados pessoais | `/Relatorios/DadosPessoais` | `RelHtmlPDF_DadosPessoais` |
| Dados funcionais | `/Relatorios/DadosFuncionais` | `RelHtmlPDF_DadosFuncionais` |
| Atos e eventos | `/Relatorios/AtoEventos` | `RelHtmlPDF_AtosEventos` |

O relatório financeiro é consultado no `RelatoriosController` pela ação `GetFinanceiro` e pode ser gerado por `GerarPdfFinanceiro`. A página também possui o fluxo `gerarPDFPorCpfMatriculaNomePeriodo`, que prepara o conteúdo para visualização em `abrirPdfFinanceiroGerado`.

Os módulos de gestão, estatística, pontuação e envio de relatório também possuem rotinas de PDF relacionadas a questionários e eventos, normalmente expostas pela ação `GerarPdfPorCpfEventoQuestionario`.

## Fluxo de geração

```text
Tela e filtros → ação JSON do controller → HTML do RelHtmlPDF* → NReco.PdfGenerator/wkhtmltopdf → PDF no navegador
```

O PDF é configurado em formato A4, orientação retrato e recebe rodapé com paginação e data de geração. O binário necessário está em `App_Data/wkhtmltopdf`.

## Manutenção

1. Ajuste a view, o script de página e o controller que recebe os filtros.
2. Atualize a classe `RelHtmlPDF*` correspondente ou crie uma nova classe com responsabilidade equivalente.
3. Preserve UTF-8 e valide acentuação, quebras de página e cabeçalho/rodapé.
4. Teste filtros preenchidos, filtros vazios, retorno sem registros e abertura do PDF.
5. Atualize a tabela deste documento.
