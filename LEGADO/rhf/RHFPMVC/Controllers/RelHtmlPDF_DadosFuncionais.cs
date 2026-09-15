using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Text;
using RHFP.Business;
using RHFP.DTO.DTOS;
using RHFP.DTO.Helpers;

namespace RHFPMVC.Controllers
{
    public class RelHtmlPDF_DadosFuncionais
    {
        private readonly string _contentRootPath = AppDomain.CurrentDomain.BaseDirectory;

        public CarregaLayoutBusiness carregaLayout;

        public RelHtmlPDF_DadosFuncionais()
        {
            _contentRootPath = AppDomain.CurrentDomain.BaseDirectory;
            carregaLayout = new CarregaLayoutBusiness(_contentRootPath);
        }

        public string geraHtmlPdfDadosFuncionais(rhfp_legado_dados_funcionaisDTO funcionario, string dataGeracao = null)
        {
            try
            {
                if (funcionario == null)
                {
                    return "<div class=\"alert alert-warning\">Nenhum dado funcional para gerar o PDF.</div>";
                }

                return geraHtmlTabelaDadosFuncionais(funcionario, dataGeracao);
            }
            catch (Exception ex)
            {
                return "<div class=\"alert alert-danger\">Erro ao gerar relatório de dados funcionais: " + WebUtility.HtmlEncode(ex.Message) + "</div>";
            }
        }

        private string geraHtmlTabelaDadosFuncionais(rhfp_legado_dados_funcionaisDTO funcionario, string dataGeracao = null)
        {
            if (funcionario == null)
            {
                return "<div class=\"alert alert-warning\">Nenhum dado funcional para gerar o PDF.</div>";
            }

            var sb = new StringBuilder();
            sb.Append("<div style=\"padding: 25px 15px 25px 15px; border-radius: 8px; font-family: 'Segoe UI', 'Arial', sans-serif; color: #333; font-size: 13px; background: linear-gradient(to bottom, #ffffff 0%, #f9f9f9 100%); box-shadow: 0 1px 3px rgba(0,0,0,0.1);\">\n");
            sb.Append("<h2 style='text-align:center; margin: 0 0 25px 0; padding: 15px 20px; color: #fff; font-weight: 600; background-color:   #337ab7; border-radius: 4px; font-size: 18px; letter-spacing: 0.5px;'>Dados Funcionais</h2>\n");

            // Linha 1: Nome, CPF, Matrícula
            sb.Append("<table style='width: 100%; border-collapse: collapse; margin-bottom: 18px; background: #fff;'>");
            sb.Append("<tr>");

            sb.Append("<td style='width: 33.33%; padding: 12px 10px 12px 0; vertical-align: top; border-bottom: 1px solid #e8e8e8;'>");
            sb.Append("<label style='display: block; font-weight: 600; margin-bottom: 6px; color: #222; font-size: 11px; text-transform: uppercase; letter-spacing: 0.3px;'>Nome</label>");
            sb.Append("<input class='form-control' type='text' style='width: 100%; padding: 8px 10px; border: 1px solid #ddd; font-size: 13px; box-sizing: border-box; font-weight: 500; background-color: #f8f9fa; border-radius: 3px; transition: border-color 0.3s;' value='").Append(WebUtility.HtmlEncode(funcionario.dpe_nome_servidor ?? "")).Append("' readonly />");
            sb.Append("</td>");

            sb.Append("<td style='width: 33.33%; padding: 12px 10px; vertical-align: top; border-bottom: 1px solid #e8e8e8;'>");
            sb.Append("<label style='display: block; font-weight: 600; margin-bottom: 6px; color: #222; font-size: 11px; text-transform: uppercase; letter-spacing: 0.3px;'>CPF</label>");
            sb.Append("<input class='form-control' type='text' style='width: 100%; padding: 8px 10px; border: 1px solid #ddd; font-size: 13px; box-sizing: border-box; font-weight: 500; background-color: #f8f9fa; border-radius: 3px; transition: border-color 0.3s;' value='").Append(FormatarCPF(funcionario.dpe_cpf_servidor ?? "")).Append("' readonly />");
            sb.Append("</td>");

            sb.Append("<td style='width: 33.33%; padding: 12px 0 12px 10px; vertical-align: top; border-bottom: 1px solid #e8e8e8;'>");
            sb.Append("<label style='display: block; font-weight: 600; margin-bottom: 6px; color: #222; font-size: 11px; text-transform: uppercase; letter-spacing: 0.3px;'>Matrícula</label>");
            sb.Append("<input class='form-control' type='text' style='width: 100%; padding: 8px 10px; border: 1px solid #ddd; font-size: 13px; box-sizing: border-box; font-weight: 500; background-color: #f8f9fa; border-radius: 3px; transition: border-color 0.3s;' value='").Append(WebUtility.HtmlEncode((funcionario.dpe_matricula ?? 0).ToString())).Append("' readonly />");
            sb.Append("</td>");

            sb.Append("</tr>\n");
            sb.Append("</table>\n");
            sb.Append("<br />");

            // Linha 2: Tipo de Cargo, Símbolo, Provimento
            sb.Append("<table style='width: 100%; border-collapse: collapse; margin-bottom: 18px; background: #fff;'>");
            sb.Append("<tr>");

            sb.Append("<td style='width: 33.33%; padding: 12px 10px 12px 0; vertical-align: top; border-bottom: 1px solid #e8e8e8;'>");
            sb.Append("<label style='display: block; font-weight: 600; margin-bottom: 6px; color: #222; font-size: 11px; text-transform: uppercase; letter-spacing: 0.3px;'>Tipo de Cargo</label>");
            sb.Append("<input class='form-control' type='text' style='width: 100%; padding: 8px 10px; border: 1px solid #ddd; font-size: 13px; box-sizing: border-box; font-weight: 500; background-color: #f8f9fa; border-radius: 3px; transition: border-color 0.3s;' value='").Append(WebUtility.HtmlEncode(funcionario.fun_tp_cargo.ToString() ?? "")).Append("' readonly />");
            sb.Append("</td>");

            sb.Append("<td style='width: 33.33%; padding: 12px 10px; vertical-align: top; border-bottom: 1px solid #e8e8e8;'>");
            sb.Append("<label style='display: block; font-weight: 600; margin-bottom: 6px; color: #222; font-size: 11px; text-transform: uppercase; letter-spacing: 0.3px;'>Símbolo</label>");
            sb.Append("<input class='form-control' type='text' style='width: 100%; padding: 8px 10px; border: 1px solid #ddd; font-size: 13px; box-sizing: border-box; font-weight: 500; background-color: #f8f9fa; border-radius: 3px; transition: border-color 0.3s;' value='").Append(WebUtility.HtmlEncode(funcionario.fun_desc_simbolo ?? "")).Append("' readonly />");
            sb.Append("</td>");

            sb.Append("<td style='width: 33.33%; padding: 12px 0 12px 10px; vertical-align: top; border-bottom: 1px solid #e8e8e8;'>");
            sb.Append("<label style='display: block; font-weight: 600; margin-bottom: 6px; color: #222; font-size: 11px; text-transform: uppercase; letter-spacing: 0.3px;'>Provimento</label>");
            sb.Append("<input class='form-control' type='text' style='width: 100%; padding: 8px 10px; border: 1px solid #ddd; font-size: 13px; box-sizing: border-box; font-weight: 500; background-color: #f8f9fa; border-radius: 3px; transition: border-color 0.3s;' value='").Append(WebUtility.HtmlEncode(funcionario.fun_desc_provimento ?? "")).Append("' readonly />");
            sb.Append("</td>");

            sb.Append("</tr>\n");
            sb.Append("</table>\n");
            sb.Append("<br />");

            // Linha 3: Cargo, Situação, Órgão Superior
            sb.Append("<table style='width: 100%; border-collapse: collapse; margin-bottom: 18px; background: #fff;'>");
            sb.Append("<tr>");

            sb.Append("<td style='width: 33.33%; padding: 12px 10px 12px 0; vertical-align: top; border-bottom: 1px solid #e8e8e8;'>");
            sb.Append("<label style='display: block; font-weight: 600; margin-bottom: 6px; color: #222; font-size: 11px; text-transform: uppercase; letter-spacing: 0.3px;'>Cargo</label>");
            sb.Append("<input class='form-control' type='text' style='width: 100%; padding: 8px 10px; border: 1px solid #ddd; font-size: 13px; box-sizing: border-box; font-weight: 500; background-color: #f8f9fa; border-radius: 3px; transition: border-color 0.3s;' value='").Append(WebUtility.HtmlEncode(funcionario.fun_cargo ?? "")).Append("' readonly />");
            sb.Append("</td>");

            sb.Append("<td style='width: 33.33%; padding: 12px 10px; vertical-align: top; border-bottom: 1px solid #e8e8e8;'>");
            sb.Append("<label style='display: block; font-weight: 600; margin-bottom: 6px; color: #222; font-size: 11px; text-transform: uppercase; letter-spacing: 0.3px;'>Situação</label>");
            sb.Append("<input class='form-control' type='text' style='width: 100%; padding: 8px 10px; border: 1px solid #ddd; font-size: 13px; box-sizing: border-box; font-weight: 500; background-color: #f8f9fa; border-radius: 3px; transition: border-color 0.3s;' value='").Append(WebUtility.HtmlEncode(funcionario.fun_desc_ativo_desativo ?? "")).Append("' readonly />");
            sb.Append("</td>");

            sb.Append("<td style='width: 33.33%; padding: 12px 0 12px 10px; vertical-align: top; border-bottom: 1px solid #e8e8e8;'>");
            sb.Append("<label style='display: block; font-weight: 600; margin-bottom: 6px; color: #222; font-size: 11px; text-transform: uppercase; letter-spacing: 0.3px;'>Órgão Superior</label>");
            sb.Append("<input class='form-control' type='text' style='width: 100%; padding: 8px 10px; border: 1px solid #ddd; font-size: 13px; box-sizing: border-box; font-weight: 500; background-color: #f8f9fa; border-radius: 3px; transition: border-color 0.3s;' value='").Append(WebUtility.HtmlEncode(funcionario.fun_desc_orgao_superior ?? "")).Append("' readonly />");
            sb.Append("</td>");

            sb.Append("</tr>\n");
            sb.Append("</table>\n");
            sb.Append("<br />");

            // Linha 4: Unidade Orçamentária, Repartição, Município
            sb.Append("<table style='width: 100%; border-collapse: collapse; margin-bottom: 18px; background: #fff;'>");
            sb.Append("<tr>");

            sb.Append("<td style='width: 33.33%; padding: 12px 10px 12px 0; vertical-align: top; border-bottom: 1px solid #e8e8e8;'>");
            sb.Append("<label style='display: block; font-weight: 600; margin-bottom: 6px; color: #222; font-size: 11px; text-transform: uppercase; letter-spacing: 0.3px;'>Unidade Orçamentária</label>");
            sb.Append("<input class='form-control' type='text' style='width: 100%; padding: 8px 10px; border: 1px solid #ddd; font-size: 13px; box-sizing: border-box; font-weight: 500; background-color: #f8f9fa; border-radius: 3px; transition: border-color 0.3s;' value='").Append(WebUtility.HtmlEncode(funcionario.fun_desc_unidade_orcamentaria ?? "")).Append("' readonly />");
            sb.Append("</td>");

            sb.Append("<td style='width: 33.33%; padding: 12px 10px; vertical-align: top; border-bottom: 1px solid #e8e8e8;'>");
            sb.Append("<label style='display: block; font-weight: 600; margin-bottom: 6px; color: #222; font-size: 11px; text-transform: uppercase; letter-spacing: 0.3px;'>Repartição</label>");
            sb.Append("<input class='form-control' type='text' style='width: 100%; padding: 8px 10px; border: 1px solid #ddd; font-size: 13px; box-sizing: border-box; font-weight: 500; background-color: #f8f9fa; border-radius: 3px; transition: border-color 0.3s;' value='").Append(WebUtility.HtmlEncode(funcionario.fun_nome_reparticao ?? "")).Append("' readonly />");
            sb.Append("</td>");

            sb.Append("<td style='width: 33.33%; padding: 12px 0 12px 10px; vertical-align: top; border-bottom: 1px solid #e8e8e8;'>");
            sb.Append("<label style='display: block; font-weight: 600; margin-bottom: 6px; color: #222; font-size: 11px; text-transform: uppercase; letter-spacing: 0.3px;'>Município</label>");
            sb.Append("<input class='form-control' type='text' style='width: 100%; padding: 8px 10px; border: 1px solid #ddd; font-size: 13px; box-sizing: border-box; font-weight: 500; background-color: #f8f9fa; border-radius: 3px; transition: border-color 0.3s;' value='").Append(WebUtility.HtmlEncode(funcionario.fun_nome_municipio ?? "")).Append("' readonly />");
            sb.Append("</td>");

            sb.Append("</tr>\n");
            sb.Append("</table>\n");
            sb.Append("<br />");

            // Data de Validade
            sb.Append("<table style='width: 100%; border-collapse: collapse; margin-bottom: 18px; background: #fff;'>");
            sb.Append("<tr>");

            sb.Append("<td style='width: 100%; padding: 12px 10px; vertical-align: top; border-bottom: 1px solid #e8e8e8;'>");
            sb.Append("<label style='display: block; font-weight: 600; margin-bottom: 6px; color: #222; font-size: 11px; text-transform: uppercase; letter-spacing: 0.3px;'>Data de Validade</label>");
            sb.Append("<input class='form-control' type='text' style='width: 100%; padding: 8px 10px; border: 1px solid #ddd; font-size: 13px; box-sizing: border-box; font-weight: 500; background-color: #f8f9fa; border-radius: 3px; transition: border-color 0.3s;' value='").Append(FormatarData(funcionario.fun_dt_validade_inicial ?? "")).Append("' readonly />");
            sb.Append("</td>");

            sb.Append("</tr>\n");
            sb.Append("</table>\n");

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

            var pageHeader = carregaLayout.RelatorioPageHeader ?? string.Empty;
            pageHeader = pageHeader.Replace("{tprel}", "Dados Funcionais");

            var htmlFinal = template
                .Replace("{PageTitle}", "Relatório de Dados Funcionais")
                .Replace("{PageHead}", pageHeadContent)
                .Replace("{PageContent}", pageHeader + sb.ToString());

            htmlFinal = htmlFinal.TrimStart();

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

        private string FormatarCPF(string cpf)
        {
            if (string.IsNullOrWhiteSpace(cpf)) return "";
            cpf = cpf.Replace(".", "").Replace("-", "").Replace("/", "").Trim();
            if (cpf.Length == 11)
                return $"{cpf.Substring(0, 3)}.{cpf.Substring(3, 3)}.{cpf.Substring(6, 3)}-{cpf.Substring(9, 2)}";
            return cpf;
        }

        private string FormatarData(string data)
        {
            if (string.IsNullOrWhiteSpace(data)) return "";
            try
            {
                return UtilitariosHelper.FormatarDateToBr(data);
            }
            catch
            {
                return data;
            }
        }
    }
}