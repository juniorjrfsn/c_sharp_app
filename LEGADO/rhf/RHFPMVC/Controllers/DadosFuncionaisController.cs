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
    public static class DadosFuncionaisViewModel
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

    public class DadosFuncionaisController : GSIController
    {
        // GET: Relatorios



        private readonly rhfp_legado_dados_pessoaisBusiness _dadosPessoaisBusiness;
        private readonly rhfp_legado_dados_funcionaisBusiness _dadosFuncionaisBusiness;

        public string _contentRootPath { get; set; }

        public CarregaLayoutBusiness carregaLayout;

        public DadosFuncionaisController()
        {
            _dadosPessoaisBusiness = new rhfp_legado_dados_pessoaisBusiness();
            _dadosFuncionaisBusiness = new rhfp_legado_dados_funcionaisBusiness();
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

 

        #region Dados Pessoais
        public ActionResult abrirPdfDadosPessoaisGerado()
        {
            string htmlContent = DadosFuncionaisViewModel.RelatorioDadosPessoais ?? string.Empty;
            string nome = DadosFuncionaisViewModel.nome ?? "DadosPessoais";

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
                Response.AddHeader("Content-Disposition", "inline; filename=RHFP Legado - " + nome + " - Dados Pessoais.pdf");
                memoryStream.CopyTo(Response.OutputStream);
            }

            return new EmptyResult();
        }

        [HttpPost]
        public JsonResult gerarPDFPorCpfMatriculaNomePeriodoDadosPessoais()
        {
            return GerarPdfDadosPessoais();
        }

        [HttpPost]
        public JsonResult GerarPdfDadosPessoais()
        {
            try
            {
                Dictionary<string, string> parametros = new Dictionary<string, string>();
                foreach (var texto in Request.Params.AllKeys)
                {
                    if (texto != null && Request[texto] != null)
                        parametros[texto] = Request[texto];
                }

                int dpeNumero = (parametros.ContainsKey("dpe_numero") && !string.IsNullOrEmpty(parametros["dpe_numero"])) ? int.Parse(parametros["dpe_numero"]) : 0;
                string cpf = (parametros.ContainsKey("cpf") && !string.IsNullOrEmpty(parametros["cpf"])) ? parametros["cpf"] : string.Empty;
                cpf = cpf.Replace(".", "").Replace("-", "").Replace("/", "").Trim();
                int matricula = (parametros.ContainsKey("matricula") && !string.IsNullOrEmpty(parametros["matricula"])) ? int.Parse(parametros["matricula"]) : 0;
                string nome = (parametros.ContainsKey("nome") && !string.IsNullOrEmpty(parametros["nome"])) ? parametros["nome"] : string.Empty;

                List<rhfp_legado_dados_pessoaisDTO> dados = _dadosPessoaisBusiness.GetDadosPessoais(matricula: matricula, cpf: cpf, nome: nome);

                if (dpeNumero > 0)
                {
                    dados = dados.Where(x => x.dpe_numero == dpeNumero).ToList();
                }

                if (dados == null || dados.Count == 0)
                {
                    return Json(new { sucesso = false, msg = "Nenhum registro de dados pessoais encontrado para o filtro informado.", caminhoPDF = "" });
                }

                var pessoa = dados.First();
                var relatorio = new RelHtmlPDF_DadosPessoais();
                DadosFuncionaisViewModel.RelatorioDadosPessoais = relatorio.geraHtmlPdfDadosPessoais(pessoa, DateTime.Now.ToString("dd/MM/yyyy"));
                DadosFuncionaisViewModel.nome = pessoa.dpe_nome_servidor ?? pessoa.dpe_cpf_servidor ?? "DadosPessoais";

                return Json(new { sucesso = true, msg = string.Empty, caminhoPDF = "" });
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.ToString());
                return Json(new { sucesso = false, msg = "ERRO: " + ex.Message, caminhoPDF = "" });
            }
        }

        [HttpPost]
        public JsonResult ListaDadosPessoais()
        {
            return GetDadosPessoais();
        }

        [HttpPost]
        public JsonResult GetDadosPessoais()
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
                int dpeNumero = (parametros.ContainsKey("dpe_numero") && !string.IsNullOrEmpty(parametros["dpe_numero"])) ? int.Parse(parametros["dpe_numero"]) : 0;

                var pessoas = _dadosPessoaisBusiness.GetDadosPessoais(matricula: matricula, cpf: cpf, nome: nome);

                if (dpeNumero > 0)
                {
                    pessoas = pessoas.Where(x => x.dpe_numero == dpeNumero).ToList();
                }

                if (pessoas != null && pessoas.Count > 0)
                {
                    sucesso = true;
                    foreach (var pessoa in pessoas)
                    {
                        lista.Add(new
                        {
                            dpe_numero = pessoa.dpe_numero,
                            dpe_matricula = pessoa.dpe_matricula,
                            dpe_dt_atualizacao = pessoa.dpe_dt_atualizacao,
                            dpe_nome_servidor = pessoa.dpe_nome_servidor,
                            dpe_cpf_servidor = pessoa.dpe_cpf_servidor,
                            dpe_num_doc_identidade = pessoa.dpe_num_doc_identidade,
                            dpe_orgao_doc_identidade = pessoa.dpe_orgao_doc_identidade,
                            dpe_uf_doc_identidade = pessoa.dpe_uf_doc_identidade,
                            dpe_num_registro = pessoa.dpe_num_registro,
                            dpe_orgao_registro = pessoa.dpe_orgao_registro,
                            dpe_uf_registro = pessoa.dpe_uf_registro,
                            dpe_num_cntps = pessoa.dpe_num_cntps,
                            dpe_serie_cntps = pessoa.dpe_serie_cntps,
                            dpe_uf_cntps = pessoa.dpe_uf_cntps,
                            dpe_num_titulo_eleitor = pessoa.dpe_num_titulo_eleitor,
                            dpe_secao_eleitoral = pessoa.dpe_secao_eleitoral,
                            dpe_zona_eleitoral = pessoa.dpe_zona_eleitoral,
                            dpe_pis_pasep = pessoa.dpe_pis_pasep,
                            dpe_num_conta_bancaria_anterior = pessoa.dpe_num_conta_bancaria_anterior,
                            dpe_cod_banco_anterior = pessoa.dpe_cod_banco_anterior,
                            dpe_cod_agencia_bancaria_anterior = pessoa.dpe_cod_agencia_bancaria_anterior,
                            dpe_num_razao = pessoa.dpe_num_razao,
                            dpe_num_cbo = pessoa.dpe_num_cbo,
                            dpe_desc_cbo = pessoa.dpe_desc_cbo,
                            dpe_cod_estado_civil = pessoa.dpe_cod_estado_civil,
                            dpe_desc_estado_civil = pessoa.dpe_desc_estado_civil,
                            dpe_cod_grau_instrucao = pessoa.dpe_cod_grau_instrucao,
                            dpe_desc_grau_instrucao = pessoa.dpe_desc_grau_instrucao,
                            dpe_dt_admissao = pessoa.dpe_dt_admissao,
                            dpe_dt_nascimento = pessoa.dpe_dt_nascimento,
                            dpe_cod_municipio_nascimento = pessoa.dpe_cod_municipio_nascimento,
                            dpe_nome_municipio_nascimento = pessoa.dpe_nome_municipio_nascimento,
                            dpe_cod_salario_familia_especial = pessoa.dpe_cod_salario_familia_especial,
                            dpe_cod_imposto_renda = pessoa.dpe_cod_imposto_renda,
                            dpe_cod_salario_familia = pessoa.dpe_cod_salario_familia,
                            dpe_nome_pai = pessoa.dpe_nome_pai,
                            dpe_nome_mae = pessoa.dpe_nome_mae,
                            dpe_cod_servidor = pessoa.dpe_cod_servidor,
                            dpe_nome_conjuge = pessoa.dpe_nome_conjuge,
                            dpe_endereco = pessoa.dpe_endereco,
                            dpe_bairro = pessoa.dpe_bairro,
                            dpe_cod_municipio_endereco = pessoa.dpe_cod_municipio_endereco,
                            dpe_nome_municipio_endereco = pessoa.dpe_nome_municipio_endereco,
                            dpe_complemento_logradouro = pessoa.dpe_complemento_logradouro,
                            dpe_num_militar = pessoa.dpe_num_militar,
                            dpe_categoria_militar = pessoa.dpe_categoria_militar,
                            dpe_num_csm_militar = pessoa.dpe_num_csm_militar,
                            dpe_cod_origem = pessoa.dpe_cod_origem,
                            dpe_dt_chegada = pessoa.dpe_dt_chegada,
                            dpe_cod_previsul = pessoa.dpe_cod_previsul,
                            dpe_cod_situacao = pessoa.dpe_cod_situacao,
                            dpe_desc_situacao = pessoa.dpe_desc_situacao,
                            dpe_cep = pessoa.dpe_cep,
                            dpe_telefone = pessoa.dpe_telefone,
                            dpe_num_conta_bancaria = pessoa.dpe_num_conta_bancaria,
                            dpe_digito_conta_bancaria = pessoa.dpe_digito_conta_bancaria,
                            dpe_cod_agencia_bancaria = pessoa.dpe_cod_agencia_bancaria,
                            dpe_digito_agencia_bancaria = pessoa.dpe_digito_agencia_bancaria,
                            dpe_cod_banco = pessoa.dpe_cod_banco,
                            dpe_casa_propria = pessoa.dpe_casa_propria,
                            dpe_cpf_proprio = pessoa.dpe_cpf_proprio,
                            dpe_cod_operacao_bancaria = pessoa.dpe_cod_operacao_bancaria,
                            dpe_dt_expedicao_rg = pessoa.dpe_dt_expedicao_rg
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
            string htmlContent = DadosFuncionaisViewModel.RelatorioDadosFuncionais ?? string.Empty;
            string nome = DadosFuncionaisViewModel.nome ?? "DadosFuncionais";

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

                int funNumero = (parametros.ContainsKey("fun_numero") && !string.IsNullOrEmpty(parametros["fun_numero"])) ? int.Parse(parametros["fun_numero"]) : 0;
                if (funNumero == 0 && parametros.ContainsKey("dfu_numero") && !string.IsNullOrEmpty(parametros["dfu_numero"]))
                    funNumero = int.Parse(parametros["dfu_numero"]);

                string cpf = string.Empty;
                if (parametros.ContainsKey("cpf") && !string.IsNullOrEmpty(parametros["cpf"]))
                    cpf = parametros["cpf"];
                else if (parametros.ContainsKey("cpf_busca") && !string.IsNullOrEmpty(parametros["cpf_busca"]))
                    cpf = parametros["cpf_busca"];
                else if (parametros.ContainsKey("dpe_cpf_servidor") && !string.IsNullOrEmpty(parametros["dpe_cpf_servidor"]))
                    cpf = parametros["dpe_cpf_servidor"];

                cpf = cpf.Replace(".", "").Replace("-", "").Replace("/", "").Trim();

                int matricula = 0;
                if (parametros.ContainsKey("matricula") && !string.IsNullOrEmpty(parametros["matricula"]))
                    int.TryParse(parametros["matricula"], out matricula);
                else if (parametros.ContainsKey("dpe_matricula") && !string.IsNullOrEmpty(parametros["dpe_matricula"]))
                    int.TryParse(parametros["dpe_matricula"], out matricula);

                string nome = string.Empty;
                if (parametros.ContainsKey("nome") && !string.IsNullOrEmpty(parametros["nome"]))
                    nome = parametros["nome"];
                else if (parametros.ContainsKey("per_nome") && !string.IsNullOrEmpty(parametros["per_nome"]))
                    nome = parametros["per_nome"];
                else if (parametros.ContainsKey("dpe_nome_servidor") && !string.IsNullOrEmpty(parametros["dpe_nome_servidor"]))
                    nome = parametros["dpe_nome_servidor"];

                int funNumeroPdf = 0;
                if (parametros.ContainsKey("fun_numero") && !string.IsNullOrEmpty(parametros["fun_numero"]))
                    int.TryParse(parametros["fun_numero"], out funNumeroPdf);
                if (funNumeroPdf == 0 && parametros.ContainsKey("dfu_numero") && !string.IsNullOrEmpty(parametros["dfu_numero"]))
                    int.TryParse(parametros["dfu_numero"], out funNumeroPdf);

                // Otimização: se fun_numero foi fornecido, use APENAS esse filtro
                // Caso contrário, use os filtros antigos (cpf, matricula, nome)
                List<rhfp_legado_dados_funcionaisDTO> dados;
                if (funNumeroPdf > 0)
                {
                    // Busca por ID puro - retorna NO MÁXIMO 1 registro
                    dados = _dadosFuncionaisBusiness.GetDadosFuncionais(matricula: 0, cpf: "", nome: "", fun_numero: funNumeroPdf);
                }
                else
                {
                    // Busca genérica pelos filtros fornecidos
                    dados = _dadosFuncionaisBusiness.GetDadosFuncionais(matricula: matricula, cpf: cpf, nome: nome);
                }

                if (dados == null || dados.Count == 0)
                {
                    return Json(new { sucesso = false, msg = "Nenhum registro de dados funcionais encontrado para o filtro informado.", caminhoPDF = "" });
                }

                var funcionario = dados.First();
                var relatorio = new RelHtmlPDF_DadosFuncionais();
                DadosFuncionaisViewModel.RelatorioDadosFuncionais = relatorio.geraHtmlPdfDadosFuncionais(funcionario, DateTime.Now.ToString("dd/MM/yyyy"));
                DadosFuncionaisViewModel.nome = funcionario.dpe_nome_servidor ?? funcionario.dpe_cpf_servidor ?? "DadosFuncionais";

                return Json(new { sucesso = true, msg = string.Empty, caminhoPDF = "" });
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.ToString());
                return Json(new { sucesso = false, msg = "ERRO: " + ex.Message, caminhoPDF = "" });
            }
        }

        [HttpPost]
        public JsonResult GetListaSegurados()
        {
            bool sucesso = false;
            string msg = string.Empty;
            List<rhfp_legado_dados_funcionaisDTO> funcionaisDTOs = new List<rhfp_legado_dados_funcionaisDTO>();
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

                string cpf = string.Empty;
                if (parametros.ContainsKey("cpf_busca") && !string.IsNullOrEmpty(parametros["cpf_busca"]))
                    cpf = parametros["cpf_busca"];
                else if (parametros.ContainsKey("cpf") && !string.IsNullOrEmpty(parametros["cpf"]))
                    cpf = parametros["cpf"];
                else if (parametros.ContainsKey("dpe_cpf_servidor") && !string.IsNullOrEmpty(parametros["dpe_cpf_servidor"]))
                    cpf = parametros["dpe_cpf_servidor"];

                cpf = cpf.Replace(".", "").Replace("-", "").Replace("/", "").Trim();

                int matricula = 0;
                if (parametros.ContainsKey("matricula") && !string.IsNullOrEmpty(parametros["matricula"]))
                    int.TryParse(parametros["matricula"], out matricula);
                else if (parametros.ContainsKey("dpe_matricula") && !string.IsNullOrEmpty(parametros["dpe_matricula"]))
                    int.TryParse(parametros["dpe_matricula"], out matricula);

                string nome = string.Empty;
                if (parametros.ContainsKey("nome") && !string.IsNullOrEmpty(parametros["nome"]))
                    nome = parametros["nome"];
                else if (parametros.ContainsKey("per_nome") && !string.IsNullOrEmpty(parametros["per_nome"]))
                    nome = parametros["per_nome"];
                else if (parametros.ContainsKey("dpe_nome_servidor") && !string.IsNullOrEmpty(parametros["dpe_nome_servidor"]))
                    nome = parametros["dpe_nome_servidor"];

                funcionaisDTOs = _dadosFuncionaisBusiness.GetListaSegurados(matricula: matricula, cpf: cpf, nome: nome);

                if (funcionaisDTOs != null && funcionaisDTOs.Count > 0)
                {
                    sucesso = true;
                    foreach (var func in funcionaisDTOs)
                    {
   
                        lista.Add(new
                        {
                            // os campos abaixo são os que serão retornados para o front-end, caso queira retornar mais campos, basta adicioná-los aqui
                            // os campos devem ser os mesmos que estão no DTO rhfp_legado_dados_funcionaisDTO
                            // os campos null devem ser tratados para não gerar erro no front-end
                            fun_numero = func.fun_numero,
                            dpe_matricula = func.dpe_matricula.HasValue ? func.dpe_matricula.Value : 0,
                            dpe_nome_servidor = string.IsNullOrWhiteSpace(func.dpe_nome_servidor) ? string.Empty : func.dpe_nome_servidor,
                            dpe_cpf_servidor = string.IsNullOrWhiteSpace(func.dpe_cpf_servidor) ? string.Empty : func.dpe_cpf_servidor,
                            fun_desc_tp_cargo = string.IsNullOrWhiteSpace(func.fun_desc_tp_cargo) ? string.Empty : func.fun_desc_tp_cargo,
                            fun_cargo = string.IsNullOrWhiteSpace(func.fun_cargo) ? string.Empty : func.fun_cargo,
                            fun_desc_simbolo = string.IsNullOrWhiteSpace(func.fun_desc_simbolo) ? string.Empty : func.fun_desc_simbolo,
                            fun_dt_validade_inicial = string.IsNullOrWhiteSpace(func.fun_dt_validade_inicial) ? string.Empty : func.fun_dt_validade_inicial,
                            fun_desc_ativo_desativo = string.IsNullOrWhiteSpace(func.fun_desc_ativo_desativo) ? string.Empty : func.fun_desc_ativo_desativo,
                            dpe_desc_situacao = string.IsNullOrWhiteSpace(func.dpe_desc_situacao) ? string.Empty : func.dpe_desc_situacao
                        });
                    }
                }
                else
                {
                    msg = "Nenhum segurado encontrado para os parâmetros informados.";
                }

                return Json(new { sucesso = sucesso, msg = msg, lista = lista, qtd = lista.Count });
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.ToString());
                return Json(new { sucesso = false, msg = "ERRO: " + ex.Message, lista = lista, qtd = 0 });
            }
        }


        /// <summary>
        /// Retorna somente as linhas (&lt;tr&gt;) da tabela de segurados em HTML,
        /// evitando o limite de maxJsonLength do JavaScriptSerializer.
        /// </summary>
        [HttpPost]
        public ActionResult GetListaSeguradosTbody()
        {
            try
            {
                string cpf = PrimeiroParametro("cpf_busca", "cpf", "dpe_cpf_servidor")
                    .Replace(".", "").Replace("-", "").Replace("/", "").Trim();

                int matricula;
                int.TryParse(PrimeiroParametro("matricula", "dpe_matricula"), out matricula);

                string nome = PrimeiroParametro("nome", "per_nome", "dpe_nome_servidor");

                List<rhfp_legado_dados_funcionaisDTO> segurados =
                    _dadosFuncionaisBusiness.GetListaSegurados(matricula: matricula, cpf: cpf, nome: nome);

                var html = new System.Text.StringBuilder();

                if (segurados != null)
                {
                    int index = 0;
                    foreach (var s in segurados)
                    {
                        string matriculaTxt = (s.dpe_matricula.HasValue && s.dpe_matricula.Value > 0)
                            ? s.dpe_matricula.Value.ToString()
                            : string.Empty;

                        string situacao = !string.IsNullOrWhiteSpace(s.dpe_desc_situacao)
                            ? s.dpe_desc_situacao
                            : s.fun_desc_ativo_desativo;

                        // Atributos data-* guardam o que o front precisa para abrir o detalhe (etapa 2)
                        html.Append("<tr data-index=\"").Append(index).Append("\"")
                            .Append(" data-fun-numero=\"").Append(s.fun_numero).Append("\"")
                            .Append(" data-matricula=\"").Append(HtmlEnc(matriculaTxt)).Append("\"")
                            .Append(" data-cpf=\"").Append(HtmlEnc(s.dpe_cpf_servidor)).Append("\"")
                            .Append(" data-nome=\"").Append(HtmlEnc(s.dpe_nome_servidor)).Append("\"")
                            .Append(" style=\"cursor: pointer;\">");

                        html.Append("<td style=\"text-align:center;\">").Append(HtmlEnc(matriculaTxt)).Append("</td>");
                        html.Append("<td>").Append(HtmlEnc(s.dpe_nome_servidor)).Append("</td>");
                        html.Append("<td style=\"text-align:center;\">").Append(HtmlEnc(MascararCpfExibicao(s.dpe_cpf_servidor))).Append("</td>");
                        html.Append("<td style=\"text-align:center;\">").Append(HtmlEnc(s.fun_desc_tp_cargo)).Append("</td>");
                        html.Append("<td style=\"text-align:center;\">").Append(HtmlEnc(s.fun_desc_simbolo)).Append("</td>");
                        html.Append("<td style=\"text-align:center;\">").Append(HtmlEnc(FormatarDataAAAAMMDD(s.fun_dt_validade_inicial))).Append("</td>");
                        html.Append("<td style=\"text-align:center;\">").Append(HtmlEnc(situacao)).Append("</td>");

                        html.Append("<td style=\"text-align: center;\">")
                            .Append("<button type=\"button\" class=\"btn btn-sm btn-outline-light btn-ver-funcionario\" data-index=\"").Append(index).Append("\" title=\"Ver detalhes\">")
                            .Append("<i class=\"fa-solid fa-eye text-info fa-lg\"></i></button></td>");

                        html.Append("<td style=\"text-align: center;\">")
                            .Append("<button type=\"button\" class=\"btn btn-sm btn-outline-light btn-gerar-pdf-funcionario\" data-index=\"").Append(index).Append("\" title=\"Gerar PDF\">")
                            .Append("<i class=\"fa-regular fa-file-pdf text-danger fa-lg\"></i></button></td>");

                        html.Append("</tr>");
                        index++;
                    }
                }

                // Vazio = nenhum segurado encontrado (o front trata como "sem resultados")
                return Content(html.ToString(), "text/html", System.Text.Encoding.UTF8);
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.ToString());
                Response.StatusCode = 500;
                Response.TrySkipIisCustomErrors = true;
                return Content("ERRO: " + ex.Message, "text/plain", System.Text.Encoding.UTF8);
            }
        }

        private string PrimeiroParametro(params string[] chaves)
        {
            foreach (var chave in chaves)
            {
                var valor = Request[chave];
                if (!string.IsNullOrEmpty(valor))
                    return valor;
            }
            return string.Empty;
        }

        private static string HtmlEnc(string valor)
        {
            return HttpUtility.HtmlEncode(valor ?? string.Empty);
        }

        private static string MascararCpfExibicao(string cpf)
        {
            var digitos = new string((cpf ?? string.Empty).Where(char.IsDigit).ToArray());
            if (digitos.Length != 11) return digitos;
            return "***." + digitos.Substring(3, 3) + "." + digitos.Substring(6, 3) + "-**";
        }

        // yyyymmdd -> dd/MM/yyyy (devolve o valor original se não for uma data válida)
        private static string FormatarDataAAAAMMDD(string valor)
        {
            if (string.IsNullOrWhiteSpace(valor)) return string.Empty;
            var texto = valor.Trim();
            DateTime data;
            if (DateTime.TryParseExact(texto, "yyyyMMdd", CultureInfo.InvariantCulture, DateTimeStyles.None, out data))
                return data.ToString("dd/MM/yyyy", CultureInfo.InvariantCulture);
            return texto;
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

                string cpf = string.Empty;
                if (parametros.ContainsKey("cpf_busca") && !string.IsNullOrEmpty(parametros["cpf_busca"]))
                    cpf = parametros["cpf_busca"];
                else if (parametros.ContainsKey("cpf") && !string.IsNullOrEmpty(parametros["cpf"]))
                    cpf = parametros["cpf"];
                else if (parametros.ContainsKey("dpe_cpf_servidor") && !string.IsNullOrEmpty(parametros["dpe_cpf_servidor"]))
                    cpf = parametros["dpe_cpf_servidor"];

                cpf = cpf.Replace(".", "").Replace("-", "").Replace("/", "").Trim();

                int matricula = 0;
                if (parametros.ContainsKey("matricula") && !string.IsNullOrEmpty(parametros["matricula"]))
                    int.TryParse(parametros["matricula"], out matricula);
                else if (parametros.ContainsKey("dpe_matricula") && !string.IsNullOrEmpty(parametros["dpe_matricula"]))
                    int.TryParse(parametros["dpe_matricula"], out matricula);

                string nome = string.Empty;
                if (parametros.ContainsKey("nome") && !string.IsNullOrEmpty(parametros["nome"]))
                    nome = parametros["nome"];
                else if (parametros.ContainsKey("per_nome") && !string.IsNullOrEmpty(parametros["per_nome"]))
                    nome = parametros["per_nome"];
                else if (parametros.ContainsKey("dpe_nome_servidor") && !string.IsNullOrEmpty(parametros["dpe_nome_servidor"]))
                    nome = parametros["dpe_nome_servidor"];

                int funNumeroFiltro = 0;
                if (parametros.ContainsKey("fun_numero") && !string.IsNullOrEmpty(parametros["fun_numero"]))
                    int.TryParse(parametros["fun_numero"], out funNumeroFiltro);
                if (funNumeroFiltro == 0 && parametros.ContainsKey("dfu_numero") && !string.IsNullOrEmpty(parametros["dfu_numero"]))
                    int.TryParse(parametros["dfu_numero"], out funNumeroFiltro);

                Debug.WriteLine($"GetDadosFuncionais -> CPF='{cpf}', Matricula='{matricula}', Nome='{nome}', fun_numero='{funNumeroFiltro}'");

                // Se fun_numero foi fornecido, buscar apenas esse registro para otimizar tamanho JSON
                List<rhfp_legado_dados_funcionaisDTO> funcionarios;
                if (funNumeroFiltro > 0)
                {
                    funcionarios = _dadosFuncionaisBusiness.GetDadosFuncionais(matricula: 0, cpf: string.Empty, nome: string.Empty, fun_numero: funNumeroFiltro);
                }
                else
                {
                    funcionarios = _dadosFuncionaisBusiness.GetDadosFuncionais(matricula: matricula, cpf: cpf, nome: nome, fun_numero: funNumeroFiltro);
                }

                if (funcionarios != null && funcionarios.Count > 0)
                {
                    sucesso = true;
                    foreach (var func in funcionarios)
                    {
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
                            fun_nome_municipio = func.fun_nome_municipio,
                            dpe_desc_situacao = func.dpe_desc_situacao
                        });
                    }
                }
                else
                {
                    msg = $"Nenhum registro encontrado para os parâmetros informados CPF:  {cpf ?? ""} , Matrícula:  {matricula} , Nome:  {nome ?? ""}  ";
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