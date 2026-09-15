using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Text;
using RHFP.Business;
using RHFP.DTO.DTOS;

namespace RHFPMVC.Controllers
{
    public class RelHtmlPDF_DadosPessoais
    {
        private readonly string _contentRootPath = AppDomain.CurrentDomain.BaseDirectory;
        public CarregaLayoutBusiness carregaLayout;

        public RelHtmlPDF_DadosPessoais()
        {
            _contentRootPath = AppDomain.CurrentDomain.BaseDirectory;
            carregaLayout = new CarregaLayoutBusiness(_contentRootPath);
        }

        public string geraHtmlPdfDadosPessoais(string cpf = null, int? matricula = null, string nome = null, string dtIni = null, string dtFim = null, string dataGeracao = null)
        {
            try
            {
                var business = new rhfp_legado_dados_pessoaisBusiness();
                var lista = business.GetDadosPessoais(matricula ?? 0, cpf, nome);

                if (lista == null || lista.Count == 0)
                {
                    return "<div class=\"alert alert-warning\">Nenhum dado pessoal encontrado para o filtro informado.</div>";
                }

                return geraHtmlPdfDadosPessoais(lista.First(), dataGeracao);
            }
            catch (Exception ex)
            {
                return "<div class=\"alert alert-danger\">Erro ao gerar relatório de dados pessoais: " + WebUtility.HtmlEncode(ex.Message) + "</div>";
            }
        }

        public string geraHtmlPdfDadosPessoais(rhfp_legado_dados_pessoaisDTO pessoa, string dataGeracao = null)
        {
            if (pessoa == null)
            {
                return "<div class=\"alert alert-warning\">Nenhum dado pessoal para gerar o PDF.</div>";
            }

            var sb = new StringBuilder();
            sb.Append("<div style=\"padding: 25px 15px 25px 15px; border-radius: 8px; font-family: 'Segoe UI', 'Arial', sans-serif; color: #333; font-size: 13px; background: linear-gradient(to bottom, #ffffff 0%, #f9f9f9 100%); box-shadow: 0 1px 3px rgba(0,0,0,0.1);\">\n");
            sb.Append("<h2 style='text-align:center; margin: 0 0 25px 0; padding: 15px 20px; color: #fff; font-weight: 600; background-color: #337ab7; border-radius: 4px; font-size: 18px; letter-spacing: 0.5px;'>Dados Pessoais</h2>\n");

            // Linha 1: Nome, CPF, Matrícula
            sb.Append("<table style='width: 100%; border-collapse: collapse; margin-bottom: 18px; background: #fff;'>");
            sb.Append("<tr>");

            sb.Append("<td style='width: 33.33%; padding: 12px 10px 12px 0; vertical-align: top; border-bottom: 1px solid #e8e8e8;'>");
            sb.Append("<label style='display: block; font-weight: 600; margin-bottom: 6px; color: #222; font-size: 11px; text-transform: uppercase; letter-spacing: 0.3px;'>Nome</label>");
            sb.Append("<input class='form-control' type='text' style='width: 100%; padding: 8px 10px; border: 1px solid #ddd; font-size: 13px; box-sizing: border-box; font-weight: 500; background-color: #f8f9fa; border-radius: 3px; transition: border-color 0.3s;' value='").Append(WebUtility.HtmlEncode(pessoa.dpe_nome_servidor ?? "")).Append("' readonly />");
            sb.Append("</td>");

            sb.Append("<td style='width: 33.33%; padding: 12px 10px; vertical-align: top; border-bottom: 1px solid #e8e8e8;'>");
            sb.Append("<label style='display: block; font-weight: 600; margin-bottom: 6px; color: #222; font-size: 11px; text-transform: uppercase; letter-spacing: 0.3px;'>CPF</label>");
            sb.Append("<input class='form-control' type='text' style='width: 100%; padding: 8px 10px; border: 1px solid #ddd; font-size: 13px; box-sizing: border-box; font-weight: 500; background-color: #f8f9fa; border-radius: 3px; transition: border-color 0.3s;' value='").Append(FormatarCPF(pessoa.dpe_cpf_servidor)).Append("' readonly />");
            sb.Append("</td>");

            sb.Append("<td style='width: 33.33%; padding: 12px 0 12px 10px; vertical-align: top; border-bottom: 1px solid #e8e8e8;'>");
            sb.Append("<label style='display: block; font-weight: 600; margin-bottom: 6px; color: #222; font-size: 11px; text-transform: uppercase; letter-spacing: 0.3px;'>Matrícula</label>");
            sb.Append("<input class='form-control' type='text' style='width: 100%; padding: 8px 10px; border: 1px solid #ddd; font-size: 13px; box-sizing: border-box; font-weight: 500; background-color: #f8f9fa; border-radius: 3px; transition: border-color 0.3s;' value='").Append(WebUtility.HtmlEncode(pessoa.dpe_matricula.ToString())).Append("' readonly />");
            sb.Append("</td>");

            sb.Append("</tr>\n");
            sb.Append("</table>\n");
            sb.Append("<br />");

            // Linha 2: Situação, Grau de Instrução, Estado Civil
            sb.Append("<table style='width: 100%; border-collapse: collapse; margin-bottom: 18px; background: #fff;'>");
            sb.Append("<tr>");

            sb.Append("<td style='width: 33.33%; padding: 12px 10px 12px 0; vertical-align: top; border-bottom: 1px solid #e8e8e8;'>");
            sb.Append("<label style='display: block; font-weight: 600; margin-bottom: 6px; color: #222; font-size: 11px; text-transform: uppercase; letter-spacing: 0.3px;'>Situação</label>");
            sb.Append("<input class='form-control' type='text' style='width: 100%; padding: 8px 10px; border: 1px solid #ddd; font-size: 13px; box-sizing: border-box; font-weight: 500; background-color: #f8f9fa; border-radius: 3px; transition: border-color 0.3s;' value='").Append(WebUtility.HtmlEncode(pessoa.dpe_desc_situacao ?? "")).Append("' readonly />");
            sb.Append("</td>");

            sb.Append("<td style='width: 33.33%; padding: 12px 10px; vertical-align: top; border-bottom: 1px solid #e8e8e8;'>");
            sb.Append("<label style='display: block; font-weight: 600; margin-bottom: 6px; color: #222; font-size: 11px; text-transform: uppercase; letter-spacing: 0.3px;'>Grau de Instrução</label>");
            sb.Append("<input class='form-control' type='text' style='width: 100%; padding: 8px 10px; border: 1px solid #ddd; font-size: 13px; box-sizing: border-box; font-weight: 500; background-color: #f8f9fa; border-radius: 3px; transition: border-color 0.3s;' value='").Append(WebUtility.HtmlEncode(pessoa.dpe_desc_grau_instrucao ?? "")).Append("' readonly />");
            sb.Append("</td>");

            sb.Append("<td style='width: 33.33%; padding: 12px 0 12px 10px; vertical-align: top; border-bottom: 1px solid #e8e8e8;'>");
            sb.Append("<label style='display: block; font-weight: 600; margin-bottom: 6px; color: #222; font-size: 11px; text-transform: uppercase; letter-spacing: 0.3px;'>Estado Civil</label>");
            sb.Append("<input class='form-control' type='text' style='width: 100%; padding: 8px 10px; border: 1px solid #ddd; font-size: 13px; box-sizing: border-box; font-weight: 500; background-color: #f8f9fa; border-radius: 3px; transition: border-color 0.3s;' value='").Append(WebUtility.HtmlEncode(pessoa.dpe_desc_estado_civil ?? "")).Append("' readonly />");
            sb.Append("</td>");



            sb.Append("</tr>\n");
            sb.Append("</table>\n");
            sb.Append("<br />");

            // Linha 3: Data Nascimento, Município, Espaço
            sb.Append("<table style='width: 100%; border-collapse: collapse; margin-bottom: 18px; background: #fff;'>");
            sb.Append("<tr>");

            sb.Append("<td style='width: 33.33%; padding: 12px 10px 12px 0; vertical-align: top; border-bottom: 1px solid #e8e8e8;'>");
            sb.Append("<label style='display: block; font-weight: 600; margin-bottom: 6px; color: #222; font-size: 11px; text-transform: uppercase; letter-spacing: 0.3px;'>Data de Nascimento</label>");
            sb.Append("<input class='form-control' type='text' style='width: 100%; padding: 8px 10px; border: 1px solid #ddd; font-size: 13px; box-sizing: border-box; font-weight: 500; background-color: #f8f9fa; border-radius: 3px; transition: border-color 0.3s;' value='").Append(FormatarData(pessoa.dpe_dt_nascimento)).Append("' readonly />");
            sb.Append("</td>");

            sb.Append("<td style='width: 33.33%; padding: 12px 10px; vertical-align: top; border-bottom: 1px solid #e8e8e8;'>");
            sb.Append("<label style='display: block; font-weight: 600; margin-bottom: 6px; color: #222; font-size: 11px; text-transform: uppercase; letter-spacing: 0.3px;'>Município de Nascimento</label>");
            sb.Append("<input class='form-control' type='text' style='width: 100%; padding: 8px 10px; border: 1px solid #ddd; font-size: 13px; box-sizing: border-box; font-weight: 500; background-color: #f8f9fa; border-radius: 3px; transition: border-color 0.3s;' value='").Append(WebUtility.HtmlEncode(pessoa.dpe_nome_municipio_nascimento ?? "")).Append("' readonly />");
            sb.Append("</td>");

            sb.Append("<td style='width: 33.33%; padding: 12px 0 12px 10px; vertical-align: top; border-bottom: 1px solid #e8e8e8;'></td>");
            sb.Append("</tr>\n");
            sb.Append("</table>\n");

            sb.Append("<br />");

            // Linha 4: Pais
            sb.Append("<table style='width: 100%; border-collapse: collapse; margin-bottom: 18px; background: #fff;'>");
            sb.Append("<tr>");

            sb.Append("<td style='width: 50%; padding: 12px 10px 12px 0; vertical-align: top; border-bottom: 1px solid #e8e8e8;'>");
            sb.Append("<label style='display: block; font-weight: 600; margin-bottom: 6px; color: #222; font-size: 11px; text-transform: uppercase; letter-spacing: 0.3px;'>Nome da Mãe</label>");
            sb.Append("<input class='form-control' type='text' style='width: 100%; padding: 8px 10px; border: 1px solid #ddd; font-size: 13px; box-sizing: border-box; font-weight: 500; background-color: #f8f9fa; border-radius: 3px; transition: border-color 0.3s;' value='").Append(WebUtility.HtmlEncode(pessoa.dpe_nome_mae ?? "")).Append("' readonly />");
            sb.Append("</td>");

            sb.Append("<td style='width: 50%; padding: 12px 0 12px 10px; vertical-align: top; border-bottom: 1px solid #e8e8e8;'>");
            sb.Append("<label style='display: block; font-weight: 600; margin-bottom: 6px; color: #222; font-size: 11px; text-transform: uppercase; letter-spacing: 0.3px;'>Nome do Pai</label>");
            sb.Append("<input class='form-control' type='text' style='width: 100%; padding: 8px 10px; border: 1px solid #ddd; font-size: 13px; box-sizing: border-box; font-weight: 500; background-color: #f8f9fa; border-radius: 3px; transition: border-color 0.3s;' value='").Append(WebUtility.HtmlEncode(pessoa.dpe_nome_pai ?? "")).Append("' readonly />");
            sb.Append("</td>");

            sb.Append("</tr>\n");
            sb.Append("</table>\n");
            sb.Append("<br />");

            // Linha 5: Endereço
            sb.Append("<table style='width: 100%; border-collapse: collapse; margin-bottom: 18px; background: #fff;'>");
            sb.Append("<tr>");

            sb.Append("<td style='width: 12%; padding: 12px 10px 12px 0; vertical-align: top; border-bottom: 1px solid #e8e8e8;'>");
            sb.Append("<label style='display: block; font-weight: 600; margin-bottom: 6px; color: #222; font-size: 11px; text-transform: uppercase; letter-spacing: 0.3px;'>CEP</label>");
            sb.Append("<input class='form-control' type='text' style='width: 100%; padding: 8px 10px; border: 1px solid #ddd; font-size: 13px; box-sizing: border-box; font-weight: 500; background-color: #f8f9fa; border-radius: 3px; transition: border-color 0.3s;' value='").Append(WebUtility.HtmlEncode(pessoa.dpe_cep.ToString())).Append("' readonly />");
            sb.Append("</td>");

            sb.Append("<td style='width: 35%; padding: 12px 10px; vertical-align: top; border-bottom: 1px solid #e8e8e8;'>");
            sb.Append("<label style='display: block; font-weight: 600; margin-bottom: 6px; color: #222; font-size: 11px; text-transform: uppercase; letter-spacing: 0.3px;'>Endereço</label>");
            sb.Append("<input class='form-control' type='text' style='width: 100%; padding: 8px 10px; border: 1px solid #ddd; font-size: 13px; box-sizing: border-box; font-weight: 500; background-color: #f8f9fa; border-radius: 3px; transition: border-color 0.3s;' value='").Append(WebUtility.HtmlEncode(pessoa.dpe_endereco ?? "")).Append("' readonly />");
            sb.Append("</td>");

            sb.Append("<td style='width: 30%; padding: 12px 10px; vertical-align: top; border-bottom: 1px solid #e8e8e8;'>");
            sb.Append("<label style='display: block; font-weight: 600; margin-bottom: 6px; color: #222; font-size: 11px; text-transform: uppercase; letter-spacing: 0.3px;'>Complemento</label>");
            sb.Append("<input class='form-control' type='text' style='width: 100%; padding: 8px 10px; border: 1px solid #ddd; font-size: 13px; box-sizing: border-box; font-weight: 500; background-color: #f8f9fa; border-radius: 3px; transition: border-color 0.3s;' value='").Append(WebUtility.HtmlEncode(pessoa.dpe_complemento_logradouro ?? "")).Append("' readonly />");
            sb.Append("</td>");

            sb.Append("<td style='width: 23%; padding: 12px 0 12px 10px; vertical-align: top; border-bottom: 1px solid #e8e8e8;'>");
            sb.Append("<label style='display: block; font-weight: 600; margin-bottom: 6px; color: #222; font-size: 11px; text-transform: uppercase; letter-spacing: 0.3px;'>Município</label>");
            sb.Append("<input class='form-control' type='text' style='width: 100%; padding: 8px 10px; border: 1px solid #ddd; font-size: 13px; box-sizing: border-box; font-weight: 500; background-color: #f8f9fa; border-radius: 3px; transition: border-color 0.3s;' value='").Append(WebUtility.HtmlEncode(pessoa.dpe_nome_municipio_endereco ?? "")).Append("' readonly />");
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
            pageHeader = pageHeader.Replace("{tprel}", "Dados Pessoais");

            var htmlFinal = template
                .Replace("{PageTitle}", "Relatório de Dados Pessoais")
                .Replace("{PageHead}", pageHeadContent)
                .Replace("{PageContent}", pageHeader + sb.ToString());

            return htmlFinal.TrimStart();
        }

        private static string FormataCampo(string nomeCampo)
        {
            if (string.IsNullOrWhiteSpace(nomeCampo))
                return string.Empty;

            return nomeCampo
                .Replace("dpe_", string.Empty)
                .Replace("_", " ")
                .Trim();
        }

        private static string FormatarCPF(string cpf)
        {
            if (string.IsNullOrWhiteSpace(cpf) || cpf.Length < 11)
                return cpf ?? "";
            
            // Formata como CPF com máscara ***. .*** .*** -**
            return "***." + cpf.Substring(3, 3) + "." + cpf.Substring(6, 3) + "-**";
        }

        private static string FormatarData(string data)
        {
            if (string.IsNullOrWhiteSpace(data) || data.Length < 8)
                return "";
            
            // Formata de aaaammdd para dd/mm/aaaa
            if (data.Length == 8 && data != "00000000" && data != "0")
            {
                try
                {
                    var ano = data.Substring(0, 4);
                    var mes = data.Substring(4, 2);
                    var dia = data.Substring(6, 2);
                    return $"{dia}/{mes}/{ano}";
                }
                catch
                {
                    return data;
                }
            }
            
            return data;
        }
    }
}