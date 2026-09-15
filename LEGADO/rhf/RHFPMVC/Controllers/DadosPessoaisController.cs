 
 
 
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
    public static class DadosPessoaisViewModel
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

    public class DadosPessoaisController : GSIController
    {
        // GET: Relatorios


        private readonly rhfp_financeiroBusiness _financeiroBusiness;
        private readonly rhfp_legado_financeiroBusiness _legadoFinanceiroBusiness;
        private readonly rhfp_legado_dados_pessoaisBusiness _dadosPessoaisBusiness;
        private readonly rhfp_legado_atos_e_eventosBusiness _atosEventosBusiness;
        private readonly rhfp_legado_dados_funcionaisBusiness _dadosFuncionaisBusiness;

        public string _contentRootPath { get; set; }

        public CarregaLayoutBusiness carregaLayout;

        public DadosPessoaisController()
        {
            _legadoFinanceiroBusiness = new rhfp_legado_financeiroBusiness();
            _dadosPessoaisBusiness = new rhfp_legado_dados_pessoaisBusiness();
            _atosEventosBusiness = new rhfp_legado_atos_e_eventosBusiness();
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
            string htmlContent = DadosPessoaisViewModel.RelatorioDadosPessoais ?? string.Empty;
            string nome = DadosPessoaisViewModel.nome ?? "DadosPessoais";

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
                DadosPessoaisViewModel.RelatorioDadosPessoais = relatorio.geraHtmlPdfDadosPessoais(pessoa, DateTime.Now.ToString("dd/MM/yyyy"));
                DadosPessoaisViewModel.nome = pessoa.dpe_nome_servidor ?? pessoa.dpe_cpf_servidor ?? "DadosPessoais";

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
                string nome = (parametros.ContainsKey("per_nome") && !string.IsNullOrEmpty(parametros["per_nome"])) ? parametros["per_nome"] : string.Empty;
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
 
    
    }
}