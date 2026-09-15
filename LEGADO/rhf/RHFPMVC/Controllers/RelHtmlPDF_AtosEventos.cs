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
    public class RelHtmlPDF_AtosEventos
    {
        private readonly string _contentRootPath = AppDomain.CurrentDomain.BaseDirectory;

        public CarregaLayoutBusiness carregaLayout;

        public RelHtmlPDF_AtosEventos()
        {
            _contentRootPath = AppDomain.CurrentDomain.BaseDirectory;
            carregaLayout = new CarregaLayoutBusiness(_contentRootPath);
        }

        // Mesma regra de "data vazia/inválida" usada no relatório Financeiro (fin_dt_inicio).
        private static bool DataValida(string data)
        {
            if (string.IsNullOrWhiteSpace(data))
                return false;

            var trecho = data.Trim();
            return trecho != "0" && trecho != "00/00/0000" && trecho != "30/12/1899" && trecho != "01/01/1900";
        }

        private static string FormatarData(string data)
        {
            return DataValida(data) ? UtilitariosHelper.FormatarDateToBr(data) : string.Empty;
        }

        private static string HtmlEncode(string valor)
        {
            return string.IsNullOrEmpty(valor) ? string.Empty : System.Net.WebUtility.HtmlEncode(valor);
        }

        private string MontarRegistroMiniFormulario(rhfp_legado_atos_e_eventosDTO item)
        {
            // Use the MiniForm template loaded by CarregaLayoutBusiness and replace placeholders
            var template = carregaLayout?.MiniFormAtosEventos ?? string.Empty;

            if (string.IsNullOrWhiteSpace(template))
            {
                // Fallback to previous inline rendering if template missing
                return "<div class=\"card\"><div class=\"card-body\">" + HtmlEncode(item.ate_atos_eventos ?? string.Empty) + "</div></div>";
            }

            // Extract content inside #template-ato-eventos-registro wrapper safely
            var startTag = "<div id=\"template-ato-eventos-registro\"";
            var sIdx = template.IndexOf(startTag, StringComparison.OrdinalIgnoreCase);
            if (sIdx >= 0)
            {
                var closeAngle = template.IndexOf('>', sIdx);
                if (closeAngle >= 0)
                {
                    var eIdx = template.LastIndexOf("</div>", StringComparison.OrdinalIgnoreCase);
                    if (eIdx > closeAngle)
                    {
                        template = template.Substring(closeAngle + 1, eIdx - (closeAngle + 1)).Trim();
                    }
                }
            }

            // Prepare values
            var values = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
            {
                { "dep_matricula", item.dep_matricula.HasValue ? item.dep_matricula.Value.ToString() : string.Empty },
                { "ate_nome", item.ate_nome ?? string.Empty },
                { "ate_cpf_servidor", string.IsNullOrWhiteSpace(item.ate_cpf_servidor) ? string.Empty : UtilitariosHelper.MascararCpf(item.ate_cpf_servidor) },
                { "ate_cod_texto", item.ate_cod_texto ?? string.Empty },
                { "ate_atos_eventos", item.ate_atos_eventos ?? string.Empty },
                { "ate_desc_tp_ato", item.ate_desc_tp_ato ?? string.Empty },
                { "ate_dt_ato", FormatarData(item.ate_dt_ato) },
                { "ate_dt_validade", FormatarData(item.ate_dt_validade) },
                { "ate_dt_final", FormatarData(item.ate_dt_final) },
                { "ate_prazo", item.ate_prazo.HasValue ? item.ate_prazo.Value.ToString() : string.Empty },
                { "ate_num_diario_oficial", item.ate_num_diario_oficial.HasValue ? item.ate_num_diario_oficial.Value.ToString() : string.Empty },
                { "ate_dt_diario_oficial", FormatarData(item.ate_dt_diario_oficial) },
                { "ate_original_simbolo", item.ate_original_simbolo ?? string.Empty },
                { "ate_original_cargo", item.ate_original_cargo ?? string.Empty },
                { "ate_acumulado_simbolo", item.ate_acumulado_simbolo ?? string.Empty },
                { "ate_acumulado_cargo", item.ate_acumulado_cargo ?? string.Empty },
                { "ate_comissao_simbolo", item.ate_comissao_simbolo ?? string.Empty },
                { "ate_comissao_cargo", item.ate_comissao_cargo ?? string.Empty },
                { "ate_simbolo_funcao_gratificada", item.ate_simbolo_funcao_gratificada ?? string.Empty },
                { "ate_cargo_funcao_gratificada", item.ate_cargo_funcao_gratificada ?? string.Empty },
                { "ate_instrumento_legal", item.ate_instrumento_legal ?? string.Empty },
                { "ate_artigo_legal", item.ate_artigo_legal ?? string.Empty },
                { "ate_inciso_legal", item.ate_inciso_legal ?? string.Empty },
                { "ate_historico", item.ate_historico ?? string.Empty }
            };

            var result = template;

            // Replace data-field placeholders preserving existing attributes
            foreach (var kv in values)
            {
                var encodedValue = HtmlEncode(kv.Value);
                var fieldName = kv.Key;
                
                var pattern = @"(<span[^>]*data-field\s*=\s*[""']" + System.Text.RegularExpressions.Regex.Escape(fieldName) + @"[""'][^>]*>)(.*?)(</span>)";
                result = System.Text.RegularExpressions.Regex.Replace(
                    result,
                    pattern,
                    m => m.Groups[1].Value + encodedValue + m.Groups[3].Value,
                    System.Text.RegularExpressions.RegexOptions.IgnoreCase | System.Text.RegularExpressions.RegexOptions.Singleline
                );
            }

            return result;
        }

        /// <summary>
        /// Gera o HTML do relatório de Atos e Eventos a partir de uma lista já filtrada
        /// e ordenada (ate_numero, dep_matricula, ate_nome, ate_cpf_servidor, ate_cod_ato,
        /// ate_cod_texto, ate_atos_eventos). Diferente do Financeiro, não há agrupamento em
        /// subtabelas: todo o resultado é apresentado em uma única tabela.
        /// </summary>
        public string geraHtmlPdfAtosEventos(List<rhfp_legado_atos_e_eventosDTO> eventos, string dataGeracao = null)
        {
            try
            {
                if (eventos == null || eventos.Count == 0)
                {
                    return "<div class=\"alert alert-info\">Nenhum registro de Atos e Eventos encontrado.</div>";
                }

                var primeiro = eventos.First();
                RelatorioViewModel.nome = primeiro.ate_nome ?? primeiro.ate_cpf_servidor ?? string.Empty;

                var sb = new StringBuilder();
                sb.Append("<div style=\"width:100%; padding:0; margin-top:10px;\">");

                foreach (var item in eventos)
                {
                    sb.Append("<div style=\"margin-top:8px; margin-bottom:14px; page-break-inside:avoid; break-inside:avoid;\">");
                    sb.Append(MontarRegistroMiniFormulario(item));
                    sb.Append("</div>");
                }

                sb.Append("</div>");

                var template = carregaLayout.layout_3;
                if (string.IsNullOrWhiteSpace(template))
                {
                    template = "<!DOCTYPE html><html><head><meta charset='utf-8'><title>{PageTitle}</title>{PageHead}</head><body>{PageContent}</body></html>";
                }

                var pageHeadContent = carregaLayout.PageHead ?? string.Empty;
                if (!string.IsNullOrWhiteSpace(pageHeadContent) && !pageHeadContent.TrimStart().StartsWith("<style", StringComparison.OrdinalIgnoreCase))
                {
                    pageHeadContent = "<style type=\"text/css\">" + pageHeadContent + "</style>";
                }

                var customCss = @"<style>
                    @page { margin: 12mm 8mm 12mm 8mm; }
                    html, body { margin: 0; padding: 0; }
                    body { background: #fff; }
                    .card, .table, .table td, .table th { page-break-inside: avoid !important; break-inside: avoid !important; }
                    .container-fluid { padding-top: 12px !important; }
                    .card { margin-top: 10px !important; margin-bottom: 14px !important; }
                    .card-body { padding: 0 !important; }
                </style>";

                pageHeadContent = string.IsNullOrWhiteSpace(pageHeadContent) ? customCss : pageHeadContent + customCss;

                var pageHeader = carregaLayout.RelatorioPageHeader ?? string.Empty;
                pageHeader = pageHeader.Replace("{tprel}", "Atos e Eventos");

                RelatorioViewModel.RelatorioPageHeader = pageHeader;
                RelatorioViewModel.RelatorioPageHeadContent = pageHeadContent;
                AtosEventosViewModel.RelatorioPageHeader = pageHeader;
                AtosEventosViewModel.RelatorioPageHeadContent = pageHeadContent;

                var htmlFinal = template
                    .Replace("{PageTitle}", "Relatório de Atos e Eventos")
                    .Replace("{PageHead}", pageHeadContent)
                    .Replace("{PageContent}", sb.ToString().TrimEnd());

                htmlFinal = htmlFinal.TrimStart().TrimEnd();

                try
                {
                    var baseUri = new Uri(_contentRootPath).AbsoluteUri;
                    if (!string.IsNullOrWhiteSpace(baseUri))
                        htmlFinal = htmlFinal.Replace(baseUri, string.Empty);
                }
                catch { }

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
