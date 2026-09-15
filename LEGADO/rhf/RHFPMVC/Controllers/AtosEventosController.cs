using Microsoft.Ajax.Utilities;
using NReco.PdfGenerator;
using SGI.Framework.MVC.Architecture.Controller;


using RHFP.DTO.DTOS;
using RHFP.Business;
using RHFP.ModelData.Database.Entity;
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
    public static class AtosEventosViewModel
    {
        public static int Versao { get; set; }
        public static string Relatorio { get; set; }
        public static string RelatorioFinanceiro { get; set; }
        public static string RelatorioDadosFuncionais { get; set; }
        public static string RelatorioDadosPessoais { get; set; }
        public static string RelatorioAtosEventos { get; set; }
        public static byte[] plc_imagem { get; set; }
        public static byte[] plc_imagem_patr { get; set; }
        public static System.DateTime plc_dt_inclusao { get; set; }
        public static Nullable<System.DateTime> plc_dt_cancelamento { get; set; }
        public static Nullable<int> plc_cd_usuario_gsi_cancelamento { get; set; }
        public static string nome { get; set; }
        public static string mov_nome_completo { get; set; }
        public static string RelatorioPatronal { get; set; }
        public static string mov_ano { get; set; }
        public static int mov_numero { get; set; }
        public static short plc_sequencial { get; set; }
        public static string plc_situacao { get; set; }
        public static string usr_nome { get; set; }
        public static string usr_cpf { get; set; }
        public static short sit_codigo { get; set; }
        public static string pct_movimento { get; set; }
        public static string pct_situacao { get; set; }
        public static string RelatorioPageHeader { get; set; }
        public static string RelatorioPageHeadContent { get; set; }
    }

    public class AtosEventosController : GSIController
    {
        // GET: Relatorios


 
        private readonly rhfp_legado_financeiroBusiness _legadoFinanceiroBusiness;
        private readonly rhfp_legado_dados_pessoaisBusiness _dadosPessoaisBusiness;
        private readonly rhfp_legado_atos_e_eventosBusiness _atosEventosBusiness;
        private readonly rhfp_legado_dados_funcionaisBusiness _dadosFuncionaisBusiness;

        public string _contentRootPath { get; set; }

        public CarregaLayoutBusiness carregaLayout;

        public AtosEventosController()
        { 
            _atosEventosBusiness = new rhfp_legado_atos_e_eventosBusiness();
            _contentRootPath = AppDomain.CurrentDomain.BaseDirectory;
            carregaLayout = new CarregaLayoutBusiness(_contentRootPath);
        }

        public ActionResult Index()
        {
            return View();
        }
        
        public ActionResult Relatorio()
        {
            try
            {

                return View("Relatorio");
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.ToString());
                return View("Relatorio");
            }
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




 




 





        #region Atos e Eventos

        /// <summary>
        /// Cria um arquivo HTML para ser usado como header em cada página do PDF de Atos e Eventos.
        /// </summary>
        private string CriarHeaderHtmlParaAtosEventos(string nome)
        {
            string pageHeader = AtosEventosViewModel.RelatorioPageHeader;
            if (string.IsNullOrWhiteSpace(pageHeader))
            {
                pageHeader = RelatorioViewModel.RelatorioPageHeader;
            }
            if (string.IsNullOrWhiteSpace(pageHeader))
            {
                var carrega = new CarregaLayoutBusiness(_contentRootPath);
                pageHeader = carrega.RelatorioPageHeader ?? string.Empty;
            }
            if (!string.IsNullOrWhiteSpace(pageHeader))
            {
                pageHeader = pageHeader.Replace("{tprel}", "Atos e Eventos");
            }

            string pageHeadContent = AtosEventosViewModel.RelatorioPageHeadContent;
            if (string.IsNullOrWhiteSpace(pageHeadContent))
            {
                pageHeadContent = RelatorioViewModel.RelatorioPageHeadContent ?? string.Empty;
            }
            if (!string.IsNullOrWhiteSpace(pageHeadContent) && !pageHeadContent.TrimStart().StartsWith("<style", StringComparison.OrdinalIgnoreCase))
            {
                pageHeadContent = "<style type=\"text/css\">" + pageHeadContent + "</style>";
            }

            pageHeader = System.Text.RegularExpressions.Regex.Replace(pageHeader, @">\s+<", "><").Trim();

            return @"<!DOCTYPE html>
            <html>
            <head>
                <meta charset='utf-8'>
                " + pageHeadContent + @"
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { margin: 0; padding: 0; font-family: 'Segoe UI', 'Arial', sans-serif; width: 100%; background: transparent; }
                    #header { width: 100% !important; border-collapse: collapse; margin: 0; padding: 0; }
                    #header td:nth-child(1) { width: 280px !important; text-align: right !important; vertical-align: middle !important; }
                    #header td:nth-child(2) { width: 440px; text-align: center !important; vertical-align: middle !important; color: #002060 !important; font-weight: 600 !important; font-size: 20px !important; }
                    #header td:nth-child(3) { text-align: left !important; vertical-align: middle !important; }
                    .header-bottom-bar { background-color: #004F9F; color: white; padding: 5px 8px; font-size: 10px; width: 100%; box-sizing: border-box; margin-top: 2px; font-family: 'Segoe UI', 'Arial', sans-serif; }
                    .header-bottom-bar strong { margin-right: 5px; }
                </style>
            </head>
            <body>
                " + pageHeader + @"
                " + (!string.IsNullOrWhiteSpace(nome) ? "<div class='header-bottom-bar' style='padding: 10px 10px 2px 10px;border-radius:5px'><h2><strong>Segurado:</strong> " + nome + "</h2></div>" : "") + @"
            </body>
            </html>";
        }


        public ActionResult abrirPdfAtosEventosGerado()
        {
            string htmlContent = AtosEventosViewModel.RelatorioAtosEventos ?? RelatorioViewModel.RelatorioAtosEventos ?? string.Empty;
            string nome = AtosEventosViewModel.nome ?? RelatorioViewModel.nome ?? "AtosEventos";

            if (string.IsNullOrWhiteSpace(htmlContent))
            {
                htmlContent = "<html><body><h2>Não há conteúdo para exibir.</h2></body></html>";
            }

            var converter = new HtmlToPdfConverter
            {
                Size = NReco.PdfGenerator.PageSize.A4,
                Orientation = PageOrientation.Portrait,
                Margins = new PageMargins
                {
                    Top = 45f,
                    Bottom = 20f,
                    Left = 10f,
                    Right = 10f
                }
            };

            var baseUri = new Uri(_contentRootPath).AbsoluteUri;

            string headerHtml = CriarHeaderHtmlParaAtosEventos(nome);
            string headerFilePath = Path.Combine(Path.GetTempPath(), "header_" + Guid.NewGuid().ToString() + ".html");
            try
            {
                System.IO.File.WriteAllText(headerFilePath, headerHtml, System.Text.Encoding.UTF8);

                string headerUri = new Uri(headerFilePath).AbsoluteUri;
                string dataGeracao = DateTime.Now.ToString("dd/MM/yyyy");
                converter.CustomWkHtmlArgs = $"--header-html \"{headerUri}\" --header-spacing 5 --footer-left \"DIRGIN/AGEPREV-MS\" --footer-center \"Página [page] de [toPage]\" --footer-right \"{dataGeracao}\" --footer-font-size 9 --footer-spacing 5";
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Erro ao criar header HTML: {ex.Message}");
                string dataGeracao = DateTime.Now.ToString("dd/MM/yyyy");
                converter.CustomWkHtmlArgs = $"--footer-left \"DIRGIN/AGEPREV-MS\" --footer-center \"Página [page] de [toPage]\" --footer-right \"{dataGeracao}\" --footer-font-size 9 --footer-spacing 5";
            }

            htmlContent = (htmlContent ?? string.Empty).TrimStart();
            try
            {
                if (!string.IsNullOrWhiteSpace(baseUri))
                    htmlContent = htmlContent.Replace(baseUri, string.Empty);
            }
            catch { }

            htmlContent = System.Text.RegularExpressions.Regex.Replace(htmlContent, "file:///[A-Za-z]:[^\"'<>\\s]*", string.Empty);

            byte[] pdfBytes = converter.GeneratePdf(htmlContent, null);

            try
            {
                if (System.IO.File.Exists(headerFilePath))
                    System.IO.File.Delete(headerFilePath);
            }
            catch { }

            using (MemoryStream memoryStream = new MemoryStream(pdfBytes))
            {
                memoryStream.Position = 0;
                Response.ContentType = "application/pdf";
                Response.AddHeader("Content-Disposition", "inline; filename=RHFP Legado - " + nome + " - Atos e Eventos.pdf");
                memoryStream.CopyTo(Response.OutputStream);
            }

            return new EmptyResult();
        }

        /// <summary>
        /// Lê do Request todos os filtros da tela de Atos e Eventos.
        /// </summary>
        private Dictionary<string, string> LerParametrosAtosEventos()
        {
            var parametros = new Dictionary<string, string>();
            foreach (var texto in Request.Params.AllKeys)
            {
                if (texto != null && Request[texto] != null)
                    parametros[texto] = Request[texto];
            }
            return parametros;
        }

        private int ParametroInt(Dictionary<string, string> parametros, string chave)
        {
            return (parametros.ContainsKey(chave) && !string.IsNullOrWhiteSpace(parametros[chave]) && int.TryParse(parametros[chave], out var valor)) ? valor : 0;
        }

        private short ParametroShort(Dictionary<string, string> parametros, string chave)
        {
            return (parametros.ContainsKey(chave) && !string.IsNullOrWhiteSpace(parametros[chave]) && short.TryParse(parametros[chave], out var valor)) ? valor : (short)0;
        }

        private string ParametroString(Dictionary<string, string> parametros, string chave)
        {
            return (parametros.ContainsKey(chave) && !string.IsNullOrWhiteSpace(parametros[chave])) ? parametros[chave] : null;
        }

        [HttpPost]
        public JsonResult GerarPdfAtosEventos()
        {
            try
            {
                var parametros = LerParametrosAtosEventos();

                string cpf = ParametroString(parametros, "ate_cpf_servidor") ?? ParametroString(parametros, "cpf_busca") ?? string.Empty;
                cpf = cpf.Replace(".", "").Replace("-", "").Replace("/", "").Trim();

                List<rhfp_legado_atos_e_eventosDTO> eventos = _atosEventosBusiness.GetAtosEventos(
                    ate_numero: ParametroInt(parametros, "ate_numero"),
                    dep_matricula: ParametroInt(parametros, "dep_matricula"),
                    ate_nome: ParametroString(parametros, "ate_nome"),
                    ate_cpf_servidor: cpf,
                    ate_cod_ato: ParametroInt(parametros, "ate_cod_ato"),
                    ate_cod_texto: ParametroString(parametros, "ate_cod_texto"),
                    ate_atos_eventos: ParametroString(parametros, "ate_atos_eventos"),
                    ate_num_diario_oficial: ParametroInt(parametros, "ate_num_diario_oficial"),
                    ate_dt_diario_oficial: ParametroString(parametros, "ate_dt_diario_oficial"),
                    ate_tp_ato: ParametroShort(parametros, "ate_tp_ato"),
                    ate_desc_tp_ato: ParametroString(parametros, "ate_desc_tp_ato"),
                    ate_dt_ato: ParametroString(parametros, "ate_dt_ato"),
                    ate_dt_validade: ParametroString(parametros, "ate_dt_validade"),
                    ate_dt_final: ParametroString(parametros, "ate_dt_final"),
                    ate_prazo: ParametroInt(parametros, "ate_prazo"),
                    ate_original_cod_simbolo: ParametroShort(parametros, "ate_original_cod_simbolo"),
                    ate_original_simbolo: ParametroString(parametros, "ate_original_simbolo"),
                    ate_original_cargo: ParametroString(parametros, "ate_original_cargo"),
                    ate_acumulado_quadro: ParametroShort(parametros, "ate_acumulado_quadro"),
                    ate_acumulado_cod_simbolo: ParametroShort(parametros, "ate_acumulado_cod_simbolo"),
                    ate_acumulado_simbolo: ParametroString(parametros, "ate_acumulado_simbolo"),
                    ate_acumulado_cargo: ParametroString(parametros, "ate_acumulado_cargo"),
                    ate_comissao_quadro: ParametroShort(parametros, "ate_comissao_quadro"),
                    ate_comissao_cod_simbolo: ParametroShort(parametros, "ate_comissao_cod_simbolo"),
                    ate_comissao_simbolo: ParametroString(parametros, "ate_comissao_simbolo")
                );

                if (eventos == null || eventos.Count == 0)
                {
                    return Json(new { sucesso = false, msg = "Nenhum registro de atos e eventos encontrado para o filtro informado.", caminhoPDF = "" });
                }

                var relatorio = new RelHtmlPDF_AtosEventos();
                AtosEventosViewModel.RelatorioAtosEventos = relatorio.geraHtmlPdfAtosEventos(eventos, DateTime.Now.ToString("dd/MM/yyyy"));
                AtosEventosViewModel.nome = eventos.First().ate_nome ?? eventos.First().ate_cpf_servidor ?? "AtosEventos";

                return Json(new { sucesso = true, msg = string.Empty, caminhoPDF = "" });
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.ToString());
                return Json(new { sucesso = false, msg = "ERRO: " + ex.Message, caminhoPDF = "" });
            }
        }

        [HttpPost]
        public JsonResult gerarPDFPorCpfMatriculaNomePeriodoAtosEventos()
        {
            return GerarPdfAtosEventos();
        }

        [HttpPost]
        public JsonResult ListaAtosEventos()
        {
            return GetAtosEventos();
        }

        [HttpPost]
        public JsonResult GetAtosEventos()
        {
            bool sucesso = false;
            string msg = string.Empty;
            List<object> lista = new List<object>();

            try
            {
                var parametros = LerParametrosAtosEventos();

                string cpf = ParametroString(parametros, "ate_cpf_servidor") ?? ParametroString(parametros, "cpf_busca") ?? string.Empty;
                cpf = cpf.Replace(".", "").Replace("-", "").Replace("/", "").Trim();

                var eventos = _atosEventosBusiness.GetAtosEventos(
                    ate_numero: ParametroInt(parametros, "ate_numero"),
                    dep_matricula: ParametroInt(parametros, "dep_matricula"),
                    ate_nome: ParametroString(parametros, "ate_nome"),
                    ate_cpf_servidor: cpf,
                    ate_cod_ato: ParametroInt(parametros, "ate_cod_ato"),
                    ate_cod_texto: ParametroString(parametros, "ate_cod_texto"),
                    ate_atos_eventos: ParametroString(parametros, "ate_atos_eventos"),
                    ate_num_diario_oficial: ParametroInt(parametros, "ate_num_diario_oficial"),
                    ate_dt_diario_oficial: ParametroString(parametros, "ate_dt_diario_oficial"),
                    ate_tp_ato: ParametroShort(parametros, "ate_tp_ato"),
                    ate_desc_tp_ato: ParametroString(parametros, "ate_desc_tp_ato"),
                    ate_dt_ato: ParametroString(parametros, "ate_dt_ato"),
                    ate_dt_validade: ParametroString(parametros, "ate_dt_validade"),
                    ate_dt_final: ParametroString(parametros, "ate_dt_final"),
                    ate_prazo: ParametroInt(parametros, "ate_prazo"),
                    ate_original_cod_simbolo: ParametroShort(parametros, "ate_original_cod_simbolo"),
                    ate_original_simbolo: ParametroString(parametros, "ate_original_simbolo"),
                    ate_original_cargo: ParametroString(parametros, "ate_original_cargo"),
                    ate_acumulado_quadro: ParametroShort(parametros, "ate_acumulado_quadro"),
                    ate_acumulado_cod_simbolo: ParametroShort(parametros, "ate_acumulado_cod_simbolo"),
                    ate_acumulado_simbolo: ParametroString(parametros, "ate_acumulado_simbolo"),
                    ate_acumulado_cargo: ParametroString(parametros, "ate_acumulado_cargo"),
                    ate_comissao_quadro: ParametroShort(parametros, "ate_comissao_quadro"),
                    ate_comissao_cod_simbolo: ParametroShort(parametros, "ate_comissao_cod_simbolo"),
                    ate_comissao_simbolo: ParametroString(parametros, "ate_comissao_simbolo")
    );

                if (eventos != null && eventos.Count > 0)
                {
                    sucesso = true;
                    foreach (var evt in eventos)
                    {
                        lista.Add(new
                        {
                            ate_numero = evt.ate_numero,
                            dep_matricula = evt.dep_matricula,
                            ate_nome = evt.ate_nome,
                            ate_cpf_servidor = evt.ate_cpf_servidor,
                            ate_cod_ato = evt.ate_cod_ato,
                            ate_cod_texto = evt.ate_cod_texto,
                            ate_atos_eventos = evt.ate_atos_eventos,
                            ate_num_diario_oficial = evt.ate_num_diario_oficial,
                            ate_dt_diario_oficial = evt.ate_dt_diario_oficial,
                            ate_tp_ato = evt.ate_tp_ato,
                            ate_desc_tp_ato = evt.ate_desc_tp_ato,
                            ate_dt_ato = evt.ate_dt_ato,
                            ate_dt_validade = evt.ate_dt_validade,
                            ate_dt_final = evt.ate_dt_final,
                            ate_prazo = evt.ate_prazo,
                            ate_original_quadro = evt.ate_original_quadro,
                            ate_original_cod_simbolo = evt.ate_original_cod_simbolo,
                            ate_original_simbolo = evt.ate_original_simbolo,
                            ate_original_cargo = evt.ate_original_cargo,
                            ate_acumulado_quadro = evt.ate_acumulado_quadro,
                            ate_acumulado_cod_simbolo = evt.ate_acumulado_cod_simbolo,
                            ate_acumulado_simbolo = evt.ate_acumulado_simbolo,
                            ate_acumulado_cargo = evt.ate_acumulado_cargo,
                            ate_comissao_quadro = evt.ate_comissao_quadro,
                            ate_comissao_cod_simbolo = evt.ate_comissao_cod_simbolo,
                            ate_comissao_simbolo = evt.ate_comissao_simbolo,
                            ate_comissao_cargo = evt.ate_comissao_cargo,
                            ate_simbolo_funcao_gratificada = evt.ate_simbolo_funcao_gratificada,
                            ate_cargo_funcao_gratificada = evt.ate_cargo_funcao_gratificada,
                            ate_instrumento_legal = evt.ate_instrumento_legal,
                            ate_artigo_legal = evt.ate_artigo_legal,
                            ate_inciso_legal = evt.ate_inciso_legal,
                            ate_historico = evt.ate_historico
                        });
                    }
                }
                else
                {
                    msg = "Nenhum registro encontrado para os parâmetros informados.";
                }

                return Json(new { sucesso = sucesso, msg = msg, lista = lista, qtd = lista.Count });
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.ToString());
                return Json(new { sucesso = false, msg = "ERRO: " + ex.Message, lista = lista, qtd = 0 });
            }
        }

        #endregion




        #region Dados Funcionais
        public ActionResult abrirPdfDadosFuncionaisGerado()
        {
            string htmlContent = AtosEventosViewModel.RelatorioDadosFuncionais ?? string.Empty;
            string nome = AtosEventosViewModel.nome ?? "DadosFuncionais";

            if (string.IsNullOrWhiteSpace(htmlContent))
            {
                htmlContent = "<html><body><h2>Não há conteúdo para exibir.</h2></body></html>";
            }

            var converter = new HtmlToPdfConverter
            {
                Size = NReco.PdfGenerator.PageSize.A4,
                Orientation = PageOrientation.Portrait,
                Margins = new PageMargins
                {
                    Top = 10f,
                    Bottom = 20f,
                    Left = 10f,
                    Right = 10f
                }
            };

            var baseUri = new Uri(_contentRootPath).AbsoluteUri;
            string dataGeracao = DateTime.Now.ToString("dd/MM/yyyy");
            converter.CustomWkHtmlArgs = $"--footer-left \"DIRGIN/AGEPREV-MS\" --footer-center \"Página [page] de [toPage]\" --footer-right \"{dataGeracao}\" --footer-font-size 9 --footer-spacing 5";

            htmlContent = (htmlContent ?? string.Empty).TrimStart();
            try
            {
                if (!string.IsNullOrWhiteSpace(baseUri))
                    htmlContent = htmlContent.Replace(baseUri, string.Empty);
            }
            catch { }

            htmlContent = System.Text.RegularExpressions.Regex.Replace(htmlContent, "file:///[A-Za-z]:[^\"'<>\\s]*", string.Empty);

            byte[] pdfBytes = converter.GeneratePdf(htmlContent, null);

            using (MemoryStream memoryStream = new MemoryStream(pdfBytes))
            {
                memoryStream.Position = 0;
                Response.ContentType = "application/pdf";
                Response.AddHeader("Content-Disposition", "inline; filename=RHFP Legado - " + nome + " - Dados Funcionais.pdf");
                memoryStream.CopyTo(Response.OutputStream);
            }

            return new EmptyResult();
        }

        [HttpPost]
        public JsonResult gerarPDFPorCpfMatriculaNomePeriodoDadosFuncionais()
        {
            return GerarPdfDadosFuncionais();
        }

        [HttpPost]
        public JsonResult GerarPdfDadosFuncionais()
        {
            try
            {
                Dictionary<string, string> parametros = new Dictionary<string, string>();
                foreach (var texto in Request.Params.AllKeys)
                {
                    if (texto != null && Request[texto] != null)
                        parametros[texto] = Request[texto];
                }

                int dfuNumero = (parametros.ContainsKey("dfu_numero") && !string.IsNullOrEmpty(parametros["dfu_numero"])) ? int.Parse(parametros["dfu_numero"]) : 0;
                string cpf = (parametros.ContainsKey("cpf") && !string.IsNullOrEmpty(parametros["cpf"])) ? parametros["cpf"] : string.Empty;
                cpf = cpf.Replace(".", "").Replace("-", "").Replace("/", "").Trim();
                int matricula = (parametros.ContainsKey("matricula") && !string.IsNullOrEmpty(parametros["matricula"])) ? int.Parse(parametros["matricula"]) : 0;
                string nome = (parametros.ContainsKey("nome") && !string.IsNullOrEmpty(parametros["nome"])) ? parametros["nome"] : string.Empty;

                // TODO: conferir a assinatura real de GetDadosFuncionais no business
                List<rhfp_legado_dados_funcionaisDTO> dados = _dadosFuncionaisBusiness.GetDadosFuncionais(matricula: matricula, cpf: cpf, nome: nome);

                if (dfuNumero > 0)
                {
                    dados = dados.Where(x => { int v; return int.TryParse(x.fun_numero.ToString(), out v) && v == dfuNumero; }).ToList();
                }

                if (dados == null || dados.Count == 0)
                {
                    return Json(new { sucesso = false, msg = "Nenhum registro de dados funcionais encontrado para o filtro informado.", caminhoPDF = "" });
                }

                var funcionario = dados.First();
                // TODO: conferir a classe/método reais de geração do HTML do relatório
                var relatorio = new RelHtmlPDF_DadosFuncionais();
                AtosEventosViewModel.RelatorioDadosFuncionais = relatorio.geraHtmlPdfDadosFuncionais(funcionario, DateTime.Now.ToString("dd/MM/yyyy"));
                AtosEventosViewModel.nome = funcionario.dpe_nome_servidor ?? funcionario.dpe_cpf_servidor ?? "DadosFuncionais";

                return Json(new { sucesso = true, msg = string.Empty, caminhoPDF = "" });
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.ToString());
                return Json(new { sucesso = false, msg = "ERRO: " + ex.Message, caminhoPDF = "" });
            }
        }

        [HttpPost]
        public JsonResult ListaDadosFuncionais()
        {
            return GetDadosFuncionais();
        }

        [HttpPost]
        public JsonResult GetDadosFuncionais()
        {
            bool sucesso = false;
            string msg = string.Empty;
            List<object> lista = new List<object>();

            try
            {
                Dictionary<string, string> parametros = new Dictionary<string, string>();
                foreach (var texto in Request.Params.AllKeys)
                {
                    if (texto != null && Request[texto] != null)
                    {
                        parametros[texto] = Request[texto];
                    }
                }

                string cpf = (parametros.ContainsKey("cpf_busca") && !string.IsNullOrEmpty(parametros["cpf_busca"])) ? parametros["cpf_busca"] : string.Empty;
                cpf = cpf.Replace(".", "").Replace("-", "").Replace("/", "").Trim();
                int matricula = (parametros.ContainsKey("matricula") && !string.IsNullOrEmpty(parametros["matricula"])) ? int.Parse(parametros["matricula"]) : 0;
                string nome = (parametros.ContainsKey("nome") && !string.IsNullOrEmpty(parametros["nome"])) ? parametros["nome"] : string.Empty;
                int dfuNumero = (parametros.ContainsKey("dfu_numero") && !string.IsNullOrEmpty(parametros["dfu_numero"])) ? int.Parse(parametros["dfu_numero"]) : 0;

                // TODO: conferir a assinatura real de GetDadosFuncionais no business
                var funcionarios = _dadosFuncionaisBusiness.GetDadosFuncionais(matricula: matricula, cpf: cpf, nome: nome);

                if (dfuNumero > 0)
                {
                    funcionarios = funcionarios.Where(x => { int v; return int.TryParse(x.fun_numero.ToString(), out v) && v == dfuNumero; }).ToList();
                }

                if (funcionarios != null && funcionarios.Count > 0)
                {
                    sucesso = true;
                    foreach (var func in funcionarios)
                    {
                        // TODO: ajustar os campos abaixo para os nomes reais de rhfp_legado_dados_funcionaisDTO
                        lista.Add(new
                        {
                            fun_numero = func.fun_numero,
                            dpe_matricula = func.dpe_matricula,
                            dpe_nome_servidor = func.dpe_nome_servidor,
                            dpe_cpf_servidor = func.dpe_cpf_servidor,
                            fun_dt_validade_inicial = func.fun_dt_validade_inicial,
                            fun_tp_cargo = func.fun_tp_cargo,
                            fun_desc_tp_cargo = func.fun_desc_tp_cargo,
                            fun_cod_simbolo = func.fun_cod_simbolo,
                            fun_desc_simbolo = func.fun_desc_simbolo,
                            fun_cargo = func.fun_cargo,
                            fun_cod_provimento = func.fun_cod_provimento,
                            fun_desc_provimento = func.fun_desc_provimento,
                            fun_cod_ativo_desativo = func.fun_cod_ativo_desativo,
                            fun_desc_ativo_desativo = func.fun_desc_ativo_desativo,
                            fun_cod_orgao_superior = func.fun_cod_orgao_superior,
                            fun_desc_orgao_superior = func.fun_desc_orgao_superior,
                            fun_cod_unidade_orcamentaria = func.fun_cod_unidade_orcamentaria,
                            fun_desc_unidade_orcamentaria = func.fun_desc_unidade_orcamentaria,
                            fun_cod_reparticao = func.fun_cod_reparticao,
                            fun_nome_reparticao = func.fun_nome_reparticao,
                            fun_cod_municipio = func.fun_cod_municipio,
                            fun_nome_municipio = func.fun_nome_municipio
                        });
                    }
                }
                else
                {
                    msg = "Nenhum registro encontrado para os parâmetros informados.";
                }

                return Json(new { sucesso = sucesso, msg = msg, lista = lista, qtd = lista.Count });
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.ToString());
                return Json(new { sucesso = false, msg = "ERRO: " + ex.Message, lista = lista, qtd = 0 });
            }
        }
        #endregion
    }
}
