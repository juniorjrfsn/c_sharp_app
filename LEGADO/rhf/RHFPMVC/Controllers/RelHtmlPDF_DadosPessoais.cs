using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using RHFP.Business;
using RHFP.DTO.DTOS;
using RHFP.DTO.Helpers;

namespace RHFPMVC.Controllers
{
    public class RelHtmlPDF_DadosPessoais
    {
        private readonly string _contentRootPath = AppDomain.CurrentDomain.BaseDirectory;
        private readonly rhfp_financeiroBusiness _rhfp_FinanceiroBusiness;

        public CarregaLayoutBusiness carregaLayout;
        public RelHtmlPDF_DadosPessoais()
        {
            _rhfp_FinanceiroBusiness = new rhfp_financeiroBusiness();
            _contentRootPath = AppDomain.CurrentDomain.BaseDirectory;
            carregaLayout = new CarregaLayoutBusiness(_contentRootPath);
            // DadosPessoaisDTO dadosPessoais    
        }

        public string geraHtmlPdfDadosPessoais(string cpf = null, int? matricula = null, string nome = null, string dtIni = null, string dtFim = null, string dataGeracao = null)
        {
            try
            {
                var carregaLayout = new CarregaLayoutBusiness(_contentRootPath);
                var financeiroBusiness = new rhfp_financeiroBusiness();
                var cpfFiltro = string.IsNullOrWhiteSpace(cpf) ? string.Empty : cpf.Trim();
                var nomeFiltro = string.IsNullOrWhiteSpace(nome) ? string.Empty : nome.Trim();
                var matriculaFiltro = matricula ?? 0;
                var lista = financeiroBusiness.GetFinanceiro(
                    matricula: matriculaFiltro,
                    nome: nomeFiltro,
                    cpf: cpfFiltro,
                    competencia: null,
                    cod_rubrica: 0,
                    dtIni: dtIni,
                    dtFim: dtFim) ?? new List<rhfp_financeiroDTO>();

                var agrupadoPorServidor = lista
                    .GroupBy(f => new { CPF = f.ALA_DP_CPF_SERVIDOR, Matricula = f.ala_fi_MATRICULA, Nome = f.ALA_DP_NOME_SERVIDOR })
                    .OrderBy(x => x.Key.CPF)
                    .ThenBy(x => x.Key.Matricula)
                    .ToList();

                var sb = new StringBuilder();
                // sb.Append("<div class=\"card mb-3\"><div class=\"card-body\" style=\"text-align:center;\"><h4 class=\"card-title\">Relatório Financeiro</h4></div></div>");


                foreach (var servidor in agrupadoPorServidor)
                {
                    RelatorioViewModel.nome = servidor.Key.Nome;
                    sb.Append("<div class=\"card mb-4\">");
                    sb.Append("<div class=\"card-header bg-primary text-white\">");
                    sb.Append("<strong>CPF:</strong> " + UtilitariosHelper.MascararCpf(servidor.Key.CPF) + " &nbsp;|&nbsp; ");
                    sb.Append("<strong>Nome:</strong> " + (string.IsNullOrWhiteSpace(servidor.Key.Nome) ? "" : servidor.Key.Nome) + " &nbsp;|&nbsp; ");
                    sb.Append("<strong>Matrícula:</strong> " + servidor.Key.Matricula);
                    sb.Append("</div>");
                    sb.Append("</div>");
                    sb.Append("</br>");

                    var grupos = servidor
                        .GroupBy(g => new { Competencia = g.COMPETENCIA_FI, TipoCargo = g.tipo_cargo_fi })
                        .OrderBy(x => x.Key.Competencia)
                        .ThenBy(x => x.Key.TipoCargo)
                        .ToList();

                    foreach (var grupo in grupos)
                    {
                        sb.Append("<div class=\"card mb-4\">");
                        sb.Append("<div class=\"card-header bg-secondary text-white\">");
                        sb.Append("<strong>Competência:</strong> " + UtilitariosHelper.FormatarCompetencia(grupo.Key.Competencia) + " &nbsp;|&nbsp; ");
                        sb.Append("<strong>Tipo de Cargo:</strong> " + Convert.ToString(grupo.Key.TipoCargo));
                        sb.Append("</div>");
                        sb.Append("<div class=\"card-body\">");

                        sb.Append("<div class=\"table-responsive\"><table class=\"table table-sm table-bordered table-striped\"><thead class=\"thead-light\"><tr>");
                        sb.Append("<th style=\"text-align:center;\">Cód. Rubrica</th><th style=\"text-align:center;\">Rubrica</th><th style=\"text-align:center;\">Data Início</th><th style=\"text-align:center;\">Valor</th><th style=\"text-align:center;\">% Pont./Dia/Hora</th><th style=\"text-align:center;\">QTDE URV</th><th style=\"text-align:center;\">PROVENTO</th><th>DESCONTO</th><th style=\"text-align:center;\">LIQUIDO</th>");
                        sb.Append("</tr></thead><tbody>");

                        foreach (var item in grupo.OrderBy(x => x.cod_rubrica_fi))
                        {
                            sb.Append("<tr>");
                            sb.Append("<td style=\"text-align:center;\">" + item.cod_rubrica_fi + "</td>");
                            sb.Append("<td>" + (item.pr_Rubrica ?? "") + "</td>");
                            sb.Append("<td style=\"text-align:center;\">" + (item.data_inicio_fi != null && item.data_inicio_fi.Trim() != "0" && item.data_inicio_fi.Trim() != "00/00/0000" && item.data_inicio_fi.Trim() != "30/12/1899" && item.data_inicio_fi.Trim() != "01/01/1900" ? UtilitariosHelper.FormatarDateToBr(item.data_inicio_fi) : "") + "</td>");
                            sb.Append("<td style=\"text-align:right;\">" + UtilitariosHelper.FormatarNumero(item.ala_fi_valor) + "</td>");
                            sb.Append("<td style=\"text-align:right;\">" + UtilitariosHelper.FormatarNumero(item.ala_fi_perc_pont_dia_hora) + "</td>");
                            sb.Append("<td style=\"text-align:right;\">" + (item.ala_fi_QTDE_URV != null ? item.ala_fi_QTDE_URV.ToString() : "") + "</td>");
                            sb.Append("<td style=\"text-align:right;\">" + UtilitariosHelper.FormatarNumero(item.PROVENTO) + "</td>");
                            sb.Append("<td style=\"text-align:right;\">" + UtilitariosHelper.FormatarNumero(item.DESCONTO) + "</td>");
                            sb.Append("<td></td>");
                            sb.Append("</tr>");
                        }

                        var total = grupo.FirstOrDefault();
                        sb.Append("<tr>");
                        sb.Append("<td style=\"text-align:center;\"> -- </td>");
                        sb.Append("<td><b>Total</b></td>");
                        sb.Append("<td style=\"text-align:right;\"> -- </td>");
                        sb.Append("<td style=\"text-align:right;\"> -- </td>");
                        sb.Append("<td style=\"text-align:right;\"> -- </td>");
                        sb.Append("<td style=\"text-align:right;\"> -- </td>");
                        sb.Append("<td style=\"text-align:right;\"><b>" + (total != null ? UtilitariosHelper.FormatarNumero(total.TOTAL_PROVENTO) : "0,00") + "</b></td>");
                        sb.Append("<td style=\"text-align:right;\"><b>" + (total != null ? UtilitariosHelper.FormatarNumero(total.TOTAL_DESCONTO) : "0,00") + "</b></td>");
                        sb.Append("<td style=\"text-align:right;\"><b>" + (total != null ? UtilitariosHelper.FormatarNumero(total.LIQUIDO) : "0,00") + "</b></td>");
                        sb.Append("</tr>");

                        sb.Append("</tbody></table></div>");
                        sb.Append("</div>");
                        sb.Append("</div>");
                    }

                    sb.Append("</div>");
                    sb.Append("</div>");
                }

                var template = carregaLayout.layout_3;
                if (string.IsNullOrWhiteSpace(template))
                {
                    template = "<!DOCTYPE html><html><head><meta charset='utf-8'><title>{PageTitle}</title>{PageHead}</head><body>{PageContent}</body></html>";
                }

                var pageHeadContent = carregaLayout.PageHead ?? string.Empty;
                // If PageHead contains raw CSS, wrap it in <style> so it is applied, not rendered as text
                if (!string.IsNullOrWhiteSpace(pageHeadContent) && !pageHeadContent.TrimStart().StartsWith("<style", StringComparison.OrdinalIgnoreCase))
                {
                    pageHeadContent = "<style type=\"text/css\">" + pageHeadContent + "</style>";
                }

                // Prepend the report header (logos/title) if available
                var pageHeader = carregaLayout.RelatorioPageHeader ?? string.Empty;
                pageHeader = pageHeader.Replace("{tprel}", "Relatório de Atos e Eventos");

                var htmlFinal = template
                    .Replace("{PageTitle}", "Relatório de Atos e Eventos")
                    .Replace("{PageHead}", pageHeadContent)
                    .Replace("{PageContent}", pageHeader + sb.ToString());

                // Remove leading whitespace which can produce a blank first page
                htmlFinal = htmlFinal.TrimStart();

                // Remove any absolute file:// base URI that might be injected/printed by the PDF engine
                try
                {
                    var baseUri = new Uri(_contentRootPath).AbsoluteUri;
                    if (!string.IsNullOrWhiteSpace(baseUri))
                        htmlFinal = htmlFinal.Replace(baseUri, string.Empty);
                }
                catch { }

                // The layout contains a static <link href="bootstrap.css" ... /> which may be resolved
                // to a file:// URL by the converter — remove it because CSS is already inlined in PageHead
                htmlFinal = htmlFinal.Replace("<link href=\"bootstrap.css\" rel=\"stylesheet\" />", string.Empty);

                return htmlFinal;
            }
            catch (Exception ex)
            {
                return "<div class=\"alert alert-danger\">Erro ao gerar relatório de Atos e Eventos: " + ex.Message + "</div>";
            }
        }

    }
}