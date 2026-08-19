using Microsoft.Ajax.Utilities;
using NReco.PdfGenerator;
using SGI.Framework.MVC.Architecture.Controller;
using RHFP.DTO.DTOS;
using RHFP.Business;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Runtime.Remoting.Contexts;
using System.Security.Cryptography;
using System.Text.RegularExpressions;
using System.Threading;
using System.Web;
using System.Web.Helpers;
using System.Web.Mvc;
using System.Web.UI.WebControls;

using RHFPMVC.Controllers;

namespace RHFPMVC.Controllers
{
    public static class RelatorioViewModel
    {
  
        public static int Versao { get; internal set; }
        public static string Relatorio { get; internal set; }
        public static byte[] plc_imagem { get; internal set; }
        public static byte[] plc_imagem_patr { get; internal set; }
        public static System.DateTime plc_dt_inclusao { get; internal set; }
        public static Nullable<System.DateTime> plc_dt_cancelamento { get; internal set; }
        public static Nullable<int> plc_cd_usuario_gsi_cancelamento { get; internal set; }
        public static string nome { get; internal set; }
    }

    public class RelatoriosController : Controller
    {
        // GET: Relatorios

 
        private readonly rhfp_financeiroBusiness _financeiroBusiness;

        public string _contentRootPath { get; set; }

        public CarregaLayoutBusiness carregaLayout;
        public RelatoriosController()
        {
            _financeiroBusiness = new rhfp_financeiroBusiness();
            _contentRootPath = AppDomain.CurrentDomain.BaseDirectory;
            carregaLayout = new CarregaLayoutBusiness(_contentRootPath);
        }

        public ActionResult Index()
        {
            return View();
        }


        public ActionResult AtoEventos()
        {
            try
            {
            
                return View("AtoEventos");
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.ToString());
                return View("AtoEventos");
            }
        }

        public ActionResult Financeiro()
        {
            try
            {

                return View("Financeiro");
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.ToString());
                return View("Financeiro");
            }
        }
         
        public ActionResult DadosFuncionais()
        {
            try
            {
                return View("DadosFuncionais");
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.ToString());
                return View("DadosFuncionais");
            }
        }
        
        public ActionResult DadosPessoais()
        {
            try
            {
                return View("DadosPessoais");
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.ToString());
                return View("DadosPessoais");
            }
        }
        

        public ActionResult abrirPdfFinanceiroGerado()
        {
            string htmlContent = RelatorioViewModel.Relatorio.ToString();
            string nome = RelatorioViewModel.nome;
          

           // Cria um objeto de MemoryStream para armazenar o PDF gerado
           /*using (var memoryStream = new MemoryStream())
           {
               var converter = new HtmlToPdfConverter();
               //{
               //    PageOrientation = PageOrientation.Portrait,
               //    PageSize = PageSize.A4
               //};

               // Gera o PDF a partir do HTML
               var pdfBytes = converter.GeneratePdf(htmlContent, null);


               PctItemMovimentoPlanilhaCalculoRepository itemMovimentoPlanilhaCalculoRepository = new PctItemMovimentoPlanilhaCalculoRepository();

               pct_item_movimento_planilha_calculo pct_Item_Movimento_Planilha = itemMovimentoPlanilhaCalculoRepository.Salvar(
                   RelatorioViewModel.mov_ano,
                   RelatorioViewModel.mov_numero,
                   RelatorioViewModel.plc_sequencial = 0,
                   pdfBytes,
                   RelatorioViewModel.plc_dt_inclusao,
                   RelatorioViewModel.plc_dt_cancelamento,
                   RelatorioViewModel.plc_cd_usuario_gsi_cancelamento = 0,
                   RelatorioViewModel.sit_codigo,
                   RelatorioViewModel.pct_movimento,
                   RelatorioViewModel.pct_situacao
               );

               var bytess = pct_Item_Movimento_Planilha.plc_imagem;
               // Escreve o PDF no MemoryStream

               memoryStream.Write(bytess, 0, bytess.Length);
               memoryStream.Position = 0;

               // Define o tipo de conteúdo da resposta como PDF
               Response.ContentType = "application/pdf";

               // Define o cabeçalho Content-Disposition para exibir o PDF no navegador
               Response.AddHeader("Content-Disposition", "inline; filename=Planilha de Cálculo Previdenciario " + segurado + ".pdf");

               // Copia o conteúdo do MemoryStream para o fluxo de saída da resposta
               
               memoryStream.CopyTo(Response.OutputStream);
               Response.End();
           }*/

           // Converter HTML para PDF 
            var converter = new HtmlToPdfConverter
             {
                 Size = NReco.PdfGenerator.PageSize.A4,
                 Orientation = PageOrientation.Portrait,
                 Margins = new PageMargins
                 {
                     Top = 10f,
                     Bottom = 20f, // increase bottom margin for footer
                     Left = 10f,
                     Right = 10f
                 }
             };

            // Ensure relative resources (css/images) resolve by passing a base URL
            // Use file:// URI as baseUrl so wkhtmltopdf resolves relative resources correctly
            var baseUri = new Uri(_contentRootPath).AbsoluteUri;

             // Add custom footer with DIRGIN, page numbers and generation date
             string dataGeracao = DateTime.Now.ToString("dd/MM/yyyy");
             converter.CustomWkHtmlArgs = $"--footer-left \"DIRGIN\" --footer-center \"Página [page] de [toPage]\" --footer-right \"{dataGeracao}\" --footer-font-size 9 --footer-spacing 5";

            // Clean HTML: trim leading whitespace and remove any visible file:// URIs
            htmlContent = (htmlContent ?? string.Empty).TrimStart();
            try
            {
                if (!string.IsNullOrWhiteSpace(baseUri))
                    htmlContent = htmlContent.Replace(baseUri, string.Empty);
            }
            catch { }

            // Remove any remaining file:///C:/... occurrences that might be rendered as text or links
            htmlContent = System.Text.RegularExpressions.Regex.Replace(htmlContent, "file:///[A-Za-z]:[^\"'<>\\s]*", string.Empty);

            byte[] pdfBytes = converter.GeneratePdf(htmlContent, null);
            
            // Escreve o PDF no MemoryStream
            using (MemoryStream memoryStream = new MemoryStream(pdfBytes))
            {
                memoryStream.Position = 0;

                // Define o tipo de conteúdo da resposta como PDF
                Response.ContentType = "application/pdf";

                // Define o cabeçalho Content-Disposition para exibir o PDF no navegador
                // Response.AddHeader("Content-Disposition", "inline; filename=Planilha de Cálculo Previdenciario.pdf");
                Response.AddHeader("Content-Disposition", "inline; filename=RHFP Legado - " + nome + " - Financeiro.pdf");

                // Copia o conteúdo do MemoryStream para o fluxo de saída da resposta
                memoryStream.CopyTo(Response.OutputStream);
            }
            return new EmptyResult();
        }

        public JsonResult gerarPDFPorCpfMatriculaNomePeriodo()
        {
            bool sucesso = false;
            string msg = string.Empty;
            string dataGeracao = DateTime.Now.ToString("dd/MM/yyyy");
            try
            {
                Dictionary<string, string> parametros = new Dictionary<string, string>();
                foreach (var texto in Request.Params.AllKeys)
                {
                    parametros.Add(texto, Request[texto]);
                }
                string cpf = (parametros.ContainsKey("cpf") && parametros["cpf"] != null) ? parametros["cpf"].ToString() : "0";

                int matricula = (parametros.ContainsKey("matricula") && parametros["matricula"] != null) ? int.Parse(parametros["matricula"]) : int.Parse("0");
                string nome = (parametros.ContainsKey("nome") && parametros["nome"] != null) ? parametros["nome"].ToString() : string.Empty;
                string per_dt_ini = (parametros.ContainsKey("per_dt_ini") && parametros["per_dt_ini"] != null) ? parametros["per_dt_ini"].ToString() : string.Empty;
                string per_dt_fim = (parametros.ContainsKey("per_dt_fim") && parametros["per_dt_fim"] != null) ? parametros["per_dt_fim"].ToString() : string.Empty;

                short que_num_questionario = (parametros.ContainsKey("que_num_questionario") && parametros["que_num_questionario"] != null) ? short.Parse(parametros["que_num_questionario"]) : short.Parse("0");

                RelHtmlPDF_Financeiro relPDF = new RelHtmlPDF_Financeiro();
                object relatorioGerado = relPDF.geraHtmlPdfFinanceiro(cpf, matricula, nome, per_dt_ini, per_dt_fim, dataGeracao);
                if (relatorioGerado != null && relatorioGerado.GetType().GetProperty("sucesso").GetValue(relatorioGerado, null).ToString() == "true")
                {  
                    sucesso = true;
                    RelatorioViewModel.Relatorio =  relatorioGerado.GetType().GetProperty("htmlFinal").GetValue(relatorioGerado, null).ToString();
                }
                else
                {
                    sucesso = false;
                    msg = "Dados insuficientes para gerar o relatório financeiro.";
                }
                return Json(new
                {
                    sucesso = sucesso,
                    msg = msg,
                    caminhoPDF = ""
                });
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.ToString());
                return Json(new
                {
                    sucesso = false,
                    msg = "ERRO:" + ex.Message,
                    caminhoPDF = ""
                });
            }
        }

        [HttpPost]
        public JsonResult GerarPdfFinanceiro()
        {
            bool sucesso = false;
            string msg = string.Empty;
            string dataGeracao = DateTime.Now.ToString("dd/MM/yyyy");
            try
            {
                Dictionary<string, string> parametros = new Dictionary<string, string>();
                foreach (var texto in Request.Params.AllKeys)
                {
                    parametros.Add(texto, Request[texto]);
                }

                string cpf = (parametros.ContainsKey("cpf") && parametros["cpf"] != null) ? parametros["cpf"].ToString() : string.Empty;
                int matricula = (parametros.ContainsKey("matricula") && !string.IsNullOrEmpty(parametros["matricula"])) ? int.Parse(parametros["matricula"]) : 0;
                string nome = (parametros.ContainsKey("nome") && !string.IsNullOrEmpty(parametros["nome"])) ? parametros["nome"] : string.Empty;
                string dtIni = (parametros.ContainsKey("dt_ini") && parametros["dt_ini"] != null) ? parametros["dt_ini"].ToString() : string.Empty;
                string dtFim = (parametros.ContainsKey("dt_fim") && parametros["dt_fim"] != null) ? parametros["dt_fim"].ToString() : string.Empty;

                RelHtmlPDF_Financeiro relPDF = new RelHtmlPDF_Financeiro();
           
                object relatorioGerado = relPDF.geraHtmlPdfFinanceiro(cpf, matricula, nome, dtIni, dtFim, dataGeracao);

                bool sucessoRel = false;
                if (relatorioGerado != null)
                {
                    sucessoRel = bool.Parse(relatorioGerado.GetType().GetProperty("sucesso").GetValue(relatorioGerado, null).ToString());
                }

                if (relatorioGerado != null && sucessoRel)
                {  
                    sucesso = true;
                    RelatorioViewModel.Relatorio =  relatorioGerado.GetType().GetProperty("htmlFinal").GetValue(relatorioGerado, null).ToString();
                }
                else
                {
                    sucesso = false;
                    msg = "Dados insuficientes para gerar o relatório financeiro.";
                }
                return Json(new
                {
                    sucesso = sucesso,
                    msg = msg,
                    caminhoPDF = ""
                }); 
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.ToString());
                return Json(new
                {
                    sucesso = false,
                    msg = "ERRO:" + ex.Message,
                    caminhoPDF = ""
                });
            }
        }

        [HttpPost]
        public JsonResult GetFinanceiro()
        {
            bool sucesso = false;
            string msg = string.Empty;
            List <rhfp_financeiroDTO> financeiroDTOs = new List<rhfp_financeiroDTO>();
            List<object> lista = new List<object>();
            try
            {

                Dictionary<string, string> parametros = new Dictionary<string, string>();
                foreach (var texto in Request.Params.AllKeys)
                {
                    parametros.Add(texto, Request[texto]);
                }

                string cpf = (parametros.ContainsKey("cpf") && !string.IsNullOrEmpty(parametros["cpf"])) ? parametros["cpf"] : string.Empty;
                int matricula = (parametros.ContainsKey("matricula") && !string.IsNullOrEmpty(parametros["matricula"])) ? int.Parse(parametros["matricula"]) : 0;
                string nome = (parametros.ContainsKey("nome") && !string.IsNullOrEmpty(parametros["nome"])) ? parametros["nome"] : string.Empty;
                string competencia = (parametros.ContainsKey("competencia") && !string.IsNullOrEmpty(parametros["competencia"])) ? parametros["competencia"] : string.Empty;
                int cod_rubrica = (parametros.ContainsKey("cod_rubrica") && !string.IsNullOrEmpty(parametros["cod_rubrica"])) ? int.Parse(parametros["cod_rubrica"]) : 0;
                string dtIni = (parametros.ContainsKey("dt_ini") && !string.IsNullOrEmpty(parametros["dt_ini"])) ? parametros["dt_ini"] : ((parametros.ContainsKey("dtIni") && !string.IsNullOrEmpty(parametros["dtIni"])) ? parametros["dtIni"] : string.Empty);
                string dtFim = (parametros.ContainsKey("dt_fim") && !string.IsNullOrEmpty(parametros["dt_fim"])) ? parametros["dt_fim"] : ((parametros.ContainsKey("dtFim") && !string.IsNullOrEmpty(parametros["dtFim"])) ? parametros["dtFim"] : string.Empty);

                financeiroDTOs = _financeiroBusiness.GetFinanceiro(
                    matricula: matricula,
                    nome: nome,
                    cpf: cpf,
                    competencia: competencia,
                    cod_rubrica: cod_rubrica,
                    dtIni: dtIni,
                    dtFim: dtFim
                );

                if (financeiroDTOs != null && financeiroDTOs.Count > 0)
                {
                    sucesso = true;
                    foreach (var fin in financeiroDTOs)
                    {
                        lista.Add(new
                        {
                            ALA_DP_CPF_SERVIDOR         = fin.ALA_DP_CPF_SERVIDOR,
                            ALA_DP_NOME_SERVIDOR        = fin.ALA_DP_NOME_SERVIDOR,
                            ala_fi_MATRICULA            = fin.ala_fi_MATRICULA,
                            tipo_cargo_fi               = fin.tipo_cargo_fi,
                            COMPETENCIA_FI              = fin.COMPETENCIA_FI,
                            cod_rubrica_fi              = fin.cod_rubrica_fi,
                            pr_Rubrica                  = fin.pr_Rubrica,
                            data_inicio_fi              = fin.data_inicio_fi,
                            ala_fi_valor                = fin.ala_fi_valor,
                            ala_fi_perc_pont_dia_hora   = fin.ala_fi_perc_pont_dia_hora,
                            ala_fi_QTDE_URV             = fin.ala_fi_QTDE_URV,
                            PROVENTO                    = fin.PROVENTO,
                            DESCONTO                    = fin.DESCONTO,
                            TOTAL_PROVENTO              = fin.TOTAL_PROVENTO,
                            TOTAL_DESCONTO              = fin.TOTAL_DESCONTO,
                            LIQUIDO                     = fin.LIQUIDO
                        });
                    }
                }
                else
                {
                    msg = "Nenhum registro encontrado para os parâmetros informados.";
                }

                return Json(new
                {
                    sucesso     = sucesso,
                    msg         = msg,
                    lista       = lista,
                    qtd         = lista.Count
                });
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.ToString());
                return Json(new
                {
                    sucesso     = false,
                    msg         = "ERRO:" + ex.Message,
                    lista       = lista,
                    qtd         = 0
                });
            }

        }
    }
}