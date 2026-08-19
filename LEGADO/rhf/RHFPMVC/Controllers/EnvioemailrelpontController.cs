using Microsoft.Ajax.Utilities;
using NReco.PdfGenerator;
using SGI.Framework.Architecture.Authentication;
using SGI.Framework.MVC.Architecture.Controller;
using SGI.Framework.MVC.Architecture.Report;
using RHFP.Business;
using RHFP.Business.Util;
using RHFP.DTO.DTOS;
using RHFP.ModelData.Database.Entity;

using System;
using System.Collections.Generic;
using System.Configuration;
using System.Diagnostics;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net.Mail;
using System.Runtime.Remoting.Contexts;
using System.Security.Cryptography;
using System.Text.RegularExpressions;
using System.Threading;
using System.Web;
using System.Web.Helpers;
using System.Web.Mvc;
using System.Web.UI.WebControls;
using static SGI.Framework.Utility.Util;

namespace RHFPMVC.Controllers
{

    public class EnvMailRelatorioViewModel
    {
        public static string mov_nome_completo { get; set; }
        public static int Versao { get; internal set; }
        public  string Relatorio { get; internal set; }
        public static string RelatorioPatronal { get; internal set; }

        public static string mov_ano { get; internal set; }
        public static int mov_numero { get; internal set; }
        public static short plc_sequencial { get; internal set; }
        public static byte[] plc_imagem { get; internal set; }
        public static byte[] plc_imagem_patr { get; internal set; }
        public static System.DateTime plc_dt_inclusao { get; internal set; }
        public static Nullable<System.DateTime> plc_dt_cancelamento { get; internal set; }
        public static Nullable<int> plc_cd_usuario_gsi_cancelamento { get; internal set; }
        public static string plc_situacao { get; internal set; }
        public static string usr_nome { get; internal set; }
        public static string usr_cpf { get; internal set; }
    }

    public class EnvioemailrelpontController : GSIController
    {
        private readonly QuestaoBusiness _questaoBussines;
        private readonly EventosBusiness _eventosBusiness;
        private readonly UsuariosResultadosBusiness _usuariosResultadosBusiness;

        protected bool EstaLogado => UsuarioLogado != null;

        public Usuario UsuarioLogado
        {
            get; set;
        }

        public string _contentRootPath { get; set; }

        public CarregaLayoutBusiness carregaLayout;
        
        public EnvioemailrelpontController()
        {
            // Aqui você instancia o contexto e passa para o repository
            // var context = new SIGEVENTOS.ModelData.Database.Entity.SigEventosContext();

            // Instancia a camada de negócio, que internamente usa o repository
            _questaoBussines = new QuestaoBusiness();
            _eventosBusiness = new EventosBusiness();
            _usuariosResultadosBusiness = new UsuariosResultadosBusiness();
            _contentRootPath = AppDomain.CurrentDomain.BaseDirectory;
            carregaLayout = new CarregaLayoutBusiness(_contentRootPath);
        }

        // GET: Questionario
        public ActionResult Index()
        {

            try
            {
                Dictionary<string, string> parametros = new Dictionary<string, string>();
                foreach (var texto in Request.Params.AllKeys)
                {
                    parametros.Add(texto, Request[texto]);
                }

                short eve_num_evento = (parametros.ContainsKey("eve_num_evento") && !string.IsNullOrEmpty(parametros["eve_num_evento"])) ? short.Parse(parametros["eve_num_evento"]) : short.Parse("0");
                short que_num_questionario = (parametros.ContainsKey("que_num_questionario") && !string.IsNullOrEmpty(parametros["que_num_questionario"])) ? short.Parse(parametros["que_num_questionario"]) : short.Parse("0");


                ViewBag.eve_num_evento = eve_num_evento;
                ViewBag.que_num_questionario = que_num_questionario;

                return View("Index");
            }
            catch (Exception ex)
            {
                return View("Index");
            }
        }
        
        [HttpPost]
        public JsonResult ObterQuestionarioPontuacaoConferenciaPorCpf()
        {
            List<EventosDto> eventosDtos = new List<EventosDto>();
            int qtde_eventos_vigentes = 0;
            Dictionary<string, string> evento = new Dictionary<string, string>();
            try
            {
                Dictionary<string, string> parametros = new Dictionary<string, string>();
                foreach (var texto in Request.Params.AllKeys)
                {
                    parametros.Add(texto, Request[texto]);
                }

                string usr_cpf = (parametros["usr_cpf"] != null) ? parametros["usr_cpf"].ToString() : "0";
                short eve_num_evento = (parametros["eve_num_evento"] != null) ? short.Parse(parametros["eve_num_evento"]) : short.Parse("0");
                short que_num_questionario = (parametros["que_num_questionario"] != null) ? short.Parse(parametros["que_num_questionario"]) : short.Parse("0");
                decimal que_nota_minima = (parametros.ContainsKey("que_nota_minima") && parametros["que_nota_minima"] != null) ? decimal.Parse(parametros["que_nota_minima"].ToString(), CultureInfo.InvariantCulture) : 0m; // O sufixo 'm' já define o valor diretamente como decimal, sem precisar de Parse("0")


                eventosDtos = _eventosBusiness.GetEventosQuestionarioGeralFinal(eve_num_evento, que_num_questionario);
                qtde_eventos_vigentes = eventosDtos.Count;
                if (eventosDtos != null && eventosDtos.Count > 0)
                {
                    evento = new Dictionary<string, string>();

                    evento.Add("eve_num_evento", eventosDtos[0].eve_num_evento.ToString());
                    evento.Add("eve_nome", eventosDtos[0].eve_nome);
                    evento.Add("eve_descricao", eventosDtos[0].eve_descricao);
                    evento.Add("eve_local", eventosDtos[0].eve_local);
                    evento.Add("eve_municipio", eventosDtos[0].eve_municipio);
                    evento.Add("eve_dt_inicio", eventosDtos[0].eve_dt_inicio.ToString());
                    evento.Add("eve_dt_fim", eventosDtos[0].eve_dt_fim.ToString());
                    evento.Add("eve_dt_inclusao", eventosDtos[0].eve_dt_inclusao.ToString());
                    evento.Add("eve_situacao", eventosDtos[0].eve_situacao);
                    evento.Add("que_num_questionario", eventosDtos[0].que_num_questionario.ToString());
                    evento.Add("que_contexto", eventosDtos[0].que_contexto);
                    evento.Add("que_publico_alvo", eventosDtos[0].que_publico_alvo);
                    evento.Add("que_nota_minima", eventosDtos[0].que_nota_minima.ToString());
                    evento.Add("que_dt_inclusao", eventosDtos[0].que_dt_inclusao.ToString());
                    evento.Add("que_situacao", eventosDtos[0].que_situacao);
                }


                List<QuestaoComRespostaDto> questaoComRespostaDtos = _questaoBussines.GetUsuarioQuestionarioPontuacaoConferenciaPorCpf(eve_num_evento, que_num_questionario, usr_cpf);

                #region Traz a pontuação mesmo que já tenha respondido
                decimal pontuacao = 0;
                #endregion

                //decimal pontuacao = _questaoBussines.ObterQuestoesComRespostasPontos__deprecated(usr_cpf, eve_num_evento, que_num_questionario);

                List<object> lista = new List<object>();

                if (questaoComRespostaDtos != null && questaoComRespostaDtos.Count > 0)
                {
                    foreach (var item in questaoComRespostaDtos)
                    {
                        pontuacao = item.pontuacao;
                        lista.Add(new
                        {

                            resp_usr_num_usuario = item.RespNumeroUsuario, // Numero do usuário caso tenha respondido a questão
                            resp_qsr_num_resposta = item.RespNumeroRespostaUsuario, // Numero da resposta caso tenha respondido a questão

                            qst_situacao = item.SituacaoQuestao,

                            qsr_situacao = item.SituacaoResposta,

                            usr_num_usuario = item.usr_num_usuario, // Numero do usuário caso tenha respondido alguma questão
                            usr_nome = item.usr_nome,
                            eve_num_evento = item.eve_num_evento,
                            eve_nome = item.eve_nome,
                            que_num_questionario = item.que_num_questionario,
                            qst_num_questao = item.qst_num_questao,
                            qst_enunciado = item.qst_enunciado,
                            qsr_num_resposta = item.qsr_num_resposta,
                            qsr_enunciado = item.qsr_enunciado,
                            qsr_e_correta = item.qsr_e_correta,
                            qsr_num_resposta_usuario = item.qsr_num_resposta_usuario,
                            ponto_q = item.ponto_q,
                            ponto_alvo_q = item.ponto_alvo_q,
                            qtde_q = item.qtde_q,
                            nota_q = item.nota_q,
                            nota = item.nota,
                            pontuacao = item.pontuacao

                        });
                    }
                }
                else
                {
                    lista.Add(new
                    {
                        usr_num_usuario = 0, // Numero do usuário caso tenha respondido alguma questão

                        resp_usr_num_usuario = 0, // Numero do usuário caso tenha respondido a questão
                        resp_qsr_num_resposta = 0, // Numero da resposta caso tenha respondido a questão

                        eve_num_evento = eve_num_evento,
                        que_num_questionario = que_num_questionario,

                        qst_num_questao = 0,
                        qst_enunciado = "",
                        qst_situacao = "",
                        qsr_num_resposta = 0,
                        qsr_enunciado = "",
                        qsr_e_correta = "",
                        qsr_situacao = "",
                        Ponto = 0
                    });
                }

                return Json(new
                {
                    sucesso = true,
                    msg = "",
                    lista = lista,
                    evento = evento,
                    pontuacao = pontuacao,
                    qtde_eventos_vigentes = qtde_eventos_vigentes
                });
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    sucesso = false,
                    msg = "ERRO:" + ex.Message,
                    lista = new List<object>(),
                    evento = evento,
                    pontuacao = 0m,
                    qtde_eventos_vigentes = qtde_eventos_vigentes
                });
            }
        }
 
        public ActionResult abrirPdfGerado()
        {
            string htmlContent = RelatorioViewModel.Relatorio.ToString();
            string usr_nome = RelatorioViewModel.usr_nome;


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
                    Top = 10f,     // Mudado de "20mm" para 20f
                    Bottom = 5f,  // Mudado de "20mm" para 20f
                    Left = 10f,    // Mudado de "10mm" para 10f
                    Right = 10f    // Mudado de "10mm" para 10f
                }
            };

            byte[] pdfBytes = converter.GeneratePdf(htmlContent, null);

            // Escreve o PDF no MemoryStream
            using (MemoryStream memoryStream = new MemoryStream(pdfBytes))
            {
                memoryStream.Position = 0;

                // Define o tipo de conteúdo da resposta como PDF
                Response.ContentType = "application/pdf";

                // Define o cabeçalho Content-Disposition para exibir o PDF no navegador
                // Response.AddHeader("Content-Disposition", "inline; filename=Planilha de Cálculo Previdenciario.pdf");
                Response.AddHeader("Content-Disposition", "inline; filename=SIGEVENTOS - " + RelatorioViewModel.usr_nome + " - Pontuação - Questionário.pdf");

                // Copia o conteúdo do MemoryStream para o fluxo de saída da resposta
                memoryStream.CopyTo(Response.OutputStream);
            }
            return new EmptyResult();
        }

        [HttpPost]
        public JsonResult GerarPdfPorCpfEventoQuestionario()
        {
            string dataGeracao = DateTime.Now.ToString("dd/MM/yyyy");
             
            try
            {
                Dictionary<string, string> parametros = new Dictionary<string, string>();
                foreach (var texto in Request.Params.AllKeys)
                {
                    parametros.Add(texto, Request[texto]);
                }
                string usr_cpf = (parametros.ContainsKey("usr_cpf") && parametros["usr_cpf"] != null) ? parametros["usr_cpf"].ToString() : "0";
                short eve_num_evento = (parametros.ContainsKey("eve_num_evento") && parametros["eve_num_evento"] != null) ? short.Parse(parametros["eve_num_evento"]) : short.Parse("0");
                short que_num_questionario = (parametros.ContainsKey("que_num_questionario") && parametros["que_num_questionario"] != null) ? short.Parse(parametros["que_num_questionario"]) : short.Parse("0");

               
                RelHtmlPDF relPDF = new RelHtmlPDF();
                RelatorioViewModel.Relatorio = relPDF.geraHtmlPdf(usr_cpf, eve_num_evento, que_num_questionario, dataGeracao);

                return Json(new
                {
                    sucesso = true,
                    msg = "",
                    caminhoPDF = ""
                });
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    sucesso = false,
                    msg = "ERRO:" + ex.Message,
                    caminhoPDF = ""
                });
            }
        }

        [HttpPost]
        public JsonResult ObterEventos()
        {
            List<EventosDto> eventosDtos = new List<EventosDto>();

            List<Dictionary<string, string>> lista = new List<Dictionary<string, string>>();
            try
            {
                Dictionary<string, string> parametros = new Dictionary<string, string>();
                foreach (var texto in Request.Params.AllKeys)
                {
                    parametros.Add(texto, Request[texto]);
                }

                string usr_cpf = (parametros.ContainsKey("usr_cpf") && parametros["usr_cpf"] != null) ? parametros["usr_cpf"].ToString() : "0";
                short eve_num_evento = (parametros.ContainsKey("eve_num_evento") && parametros["eve_num_evento"] != null) ? short.Parse(parametros["eve_num_evento"]) : short.Parse("0");
                short que_num_questionario = (parametros.ContainsKey("que_num_questionario") && parametros["que_num_questionario"] != null) ? short.Parse(parametros["que_num_questionario"]) : short.Parse("0");

                eventosDtos = _eventosBusiness.GetEventosQuestionariosGeral();
                if (eventosDtos != null)
                {
                    foreach (var eventoDto in eventosDtos)
                    {
                        Dictionary<string, string> evento = new Dictionary<string, string>();
                        evento.Add("eve_num_evento", eventoDto.eve_num_evento.ToString());
                        evento.Add("eve_nome", eventoDto.eve_nome);
                        evento.Add("eve_descricao", eventoDto.eve_descricao);
                        evento.Add("eve_local", eventoDto.eve_local);
                        evento.Add("eve_municipio", eventoDto.eve_municipio);
                        evento.Add("eve_dt_inicio", eventoDto.eve_dt_inicio.ToString());
                        evento.Add("eve_dt_fim", eventoDto.eve_dt_fim.ToString());
                        evento.Add("eve_dt_inclusao", eventoDto.eve_dt_inclusao.ToString());
                        evento.Add("eve_situacao", eventoDto.eve_situacao);
                        evento.Add("que_num_questionario", eventoDto.que_num_questionario.ToString());
                        evento.Add("que_contexto", eventoDto.que_contexto);
                        evento.Add("que_publico_alvo", eventoDto.que_publico_alvo);
                        evento.Add("que_nota_minima", eventoDto.que_nota_minima.ToString());
                        evento.Add("que_dt_inclusao", eventoDto.que_dt_inclusao.ToString());
                        evento.Add("que_situacao", eventoDto.que_situacao);
                        lista.Add(evento);
                    }

                    return Json(new
                    {
                        sucesso = true,
                        msg = "",
                        lista = lista
                    });
                }
                else
                {
                    return Json(new
                    {
                        sucesso = false,
                        msg = "Nenhum evento encontrado.",
                        lista = lista
                    });
                }
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    sucesso = false,
                    msg = "ERRO:" + ex.Message,
                    lista = lista
                });
            }
        }

        [HttpPost]
        public JsonResult ObterEventosGeralFinal()
        {
            List<EventosDto> eventosDtos = new List<EventosDto>();

            List<Dictionary<string, string>> lista = new List<Dictionary<string, string>>();
            try
            {
                Dictionary<string, string> parametros = new Dictionary<string, string>();
                foreach (var texto in Request.Params.AllKeys)
                {
                    parametros.Add(texto, Request[texto]);
                }

                string usr_cpf = (parametros.ContainsKey("usr_cpf") && parametros["usr_cpf"] != null) ? parametros["usr_cpf"].ToString() : "0";
                short eve_num_evento = (parametros.ContainsKey("eve_num_evento") && parametros["eve_num_evento"] != null) ? short.Parse(parametros["eve_num_evento"]) : short.Parse("0");
                short que_num_questionario = (parametros.ContainsKey("que_num_questionario") && parametros["que_num_questionario"] != null) ? short.Parse(parametros["que_num_questionario"]) : short.Parse("0");

                eventosDtos = _eventosBusiness.GetEventosQuestionariosGeralFinal();
                if (eventosDtos != null)
                {
                    foreach (var eventoDto in eventosDtos)
                    {
                        Dictionary<string, string> evento = new Dictionary<string, string>();
                        evento.Add("eve_num_evento", eventoDto.eve_num_evento.ToString());
                        evento.Add("eve_nome", eventoDto.eve_nome);
                        evento.Add("eve_descricao", eventoDto.eve_descricao);
                        evento.Add("eve_local", eventoDto.eve_local);
                        evento.Add("eve_municipio", eventoDto.eve_municipio);
                        evento.Add("eve_dt_inicio", eventoDto.eve_dt_inicio.ToString());
                        evento.Add("eve_dt_fim", eventoDto.eve_dt_fim.ToString());
                        evento.Add("eve_dt_inclusao", eventoDto.eve_dt_inclusao.ToString());
                        evento.Add("eve_situacao", eventoDto.eve_situacao);
                        evento.Add("que_num_questionario", eventoDto.que_num_questionario.ToString());
                        evento.Add("que_contexto", eventoDto.que_contexto);
                        evento.Add("que_publico_alvo", eventoDto.que_publico_alvo);
                        evento.Add("que_nota_minima", eventoDto.que_nota_minima.ToString());
                        evento.Add("que_dt_inclusao", eventoDto.que_dt_inclusao.ToString());
                        evento.Add("que_situacao", eventoDto.que_situacao);
                        lista.Add(evento);
                    }

                    return Json(new
                    {
                        sucesso = true,
                        msg = "",
                        lista = lista
                    });
                }
                else
                {
                    return Json(new
                    {
                        sucesso = false,
                        msg = "Nenhum evento encontrado.",
                        lista = lista
                    });
                }
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    sucesso = false,
                    msg = "ERRO:" + ex.Message,
                    lista = lista
                });
            }
        }

        [HttpPost]
        public JsonResult Lista()
        {
            List<QuestaoComRespostaDto> questaoComRespostaDtos = new List<QuestaoComRespostaDto>();
            Boolean sucesso = false;
            try
            {
                Dictionary<string, string> parametros = new Dictionary<string, string>();
                foreach (var texto in Request.Params.AllKeys)
                {
                    parametros.Add(texto, Request[texto]);
                }

                string usr_cpf = (parametros.ContainsKey("usr_cpf") && !string.IsNullOrEmpty(parametros["usr_cpf"])) ? parametros["usr_cpf"].ToString() : "";
                short eve_num_evento = (parametros.ContainsKey("eve_num_evento") && !string.IsNullOrEmpty(parametros["eve_num_evento"])) ? short.Parse(parametros["eve_num_evento"]) : short.Parse("0");
                short que_num_questionario = (parametros.ContainsKey("que_num_questionario") && !string.IsNullOrEmpty(parametros["que_num_questionario"])) ? short.Parse(parametros["que_num_questionario"]) : short.Parse("0");

                questaoComRespostaDtos = _questaoBussines.GetUsuarioQuestionarioPonto();


                //questaoComRespostaDtos.Add(
                //       new QuestaoComRespostaDto
                //       {
                //           eve_num_evento = 1,
                //           eve_nome = "Evento teste",
                //           eve_situacao = "A",
                //           que_num_questionario = 1,
                //           que_contexto = "Questionário Teste",
                //           que_situacao = "A",
                //           usr_num_usuario = 1,
                //           usr_cpf = "12345678900",
                //           usr_nome = "Usuário Teste",
                //           usr_situacao = "A",
                //           pontuacao = 0m
                //       } 
                //    );


                List<object> lista = new List<object>();

                if (questaoComRespostaDtos != null && questaoComRespostaDtos.Count > 0)
                {
                    sucesso = true;
                    foreach (var item in questaoComRespostaDtos)
                    {

                        #region trazemos a pontuação individualmente para cada usuário, evento e questionário
                        QuestaoComRespostaDto usuarioPonto = _questaoBussines.GetUsuarioQuestionarioPontuacaoPorCpf(eve_num_evento, que_num_questionario, usr_cpf).FirstOrDefault();
                        decimal pontuacao = (usuarioPonto != null) ? usuarioPonto.pontuacao : 0;
                        // decimal pontuacao = _questaoBussines.ObterQuestoesComRespostasPontos__deprecated(item.usr_cpf, item.eve_num_evento, item.que_num_questionario);
                        #endregion
                        lista.Add(new
                        {
                            eve_num_evento = item.eve_num_evento,
                            eve_nome = item.eve_nome,
                            eve_situacao = item.eve_situacao,
                            que_num_questionario = item.que_num_questionario,
                            que_contexto = item.que_contexto,
                            que_situacao = item.que_situacao,
                            usr_num_usuario = item.usr_num_usuario,
                            usr_cpf = item.usr_cpf,
                            usr_nome = item.usr_nome,
                            usr_situacao = item.usr_situacao,

                            pontuacao = (pontuacao != 0) ? pontuacao : 0
                        });
                    }

                }
                else
                {
                    sucesso = false;
                    lista.Add(new
                    {
                        eve_num_evento = 0,
                        eve_nome = "",
                        eve_situacao = "",
                        que_num_questionario = 0,
                        que_contexto = "",
                        que_situacao = "",
                        usr_num_usuario = 0,
                        usr_cpf = "",
                        usr_nome = "",
                        usr_situacao = "",
                        pontuacao = 0
                    });
                }

                return Json(new
                {
                    sucesso = sucesso,
                    msg = "",
                    lista = lista
                });
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    sucesso = false,
                    msg = "ERRO:" + ex.ToString(),
                    lista = new List<object>()
                });
            }
        }

        [HttpPost]
        public JsonResult ListaPonto()
        {
            List<QuestaoComRespostaDto> questaoComRespostaDtos = new List<QuestaoComRespostaDto>();
            Boolean sucesso = false;
            try
            {
                Dictionary<string, string> parametros = new Dictionary<string, string>();
                foreach (var texto in Request.Params.AllKeys)
                {
                    parametros.Add(texto, Request[texto]);
                }

                string usr_cpf = (parametros.ContainsKey("usr_cpf") && !string.IsNullOrEmpty(parametros["usr_cpf"])) ? parametros["usr_cpf"].ToString() : "";
                short eve_num_evento = (parametros.ContainsKey("eve_num_evento") && !string.IsNullOrEmpty(parametros["eve_num_evento"])) ? short.Parse(parametros["eve_num_evento"]) : short.Parse("0");
                short que_num_questionario = (parametros.ContainsKey("que_num_questionario") && !string.IsNullOrEmpty(parametros["que_num_questionario"])) ? short.Parse(parametros["que_num_questionario"]) : short.Parse("0");

                questaoComRespostaDtos = _questaoBussines.GetUsuarioQuestionarioPontuacao(eve_num_evento, que_num_questionario);

                List<object> lista = new List<object>();

                if (questaoComRespostaDtos != null && questaoComRespostaDtos.Count > 0)
                {
                    sucesso = true;
                    foreach (var item in questaoComRespostaDtos)
                    {
                        lista.Add(new
                        {
                            eve_num_evento = item.eve_num_evento,
                            eve_nome = item.eve_nome,
                            eve_situacao = item.eve_situacao,
                            que_num_questionario = item.que_num_questionario,
                            que_contexto = item.que_contexto,
                            que_situacao = item.que_situacao,
                            usr_num_usuario = item.usr_num_usuario,
                            usr_cpf = item.usr_cpf,
                            usr_nome = item.usr_nome,
                            usr_email = item.usr_email,
                            usr_situacao = item.usr_situacao,
                            pontuacao = item.pontuacao
                        });
                    }

                }
                else
                {
                    sucesso = false;
                    lista.Add(new
                    {
                        eve_num_evento = 0,
                        eve_nome = "",
                        eve_situacao = "",
                        que_num_questionario = 0,
                        que_contexto = "",
                        que_situacao = "",
                        usr_num_usuario = 0,
                        usr_cpf = "",
                        usr_nome = "",
                        usr_email = "",
                        usr_situacao = "",
                        pontuacao = 0
                    });
                }

                return Json(new
                {
                    sucesso = sucesso,
                    msg = "",
                    lista = lista,
                    qtd = questaoComRespostaDtos.Count
                });
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    sucesso = false,
                    msg = "ERRO:" + ex.ToString(),
                    lista = new List<object>(),
                    qtd = 0
                });
            }
        }

        [HttpPost]
        public JsonResult ListaPontoFinal()
        {
            List<QuestaoComRespostaDto> questaoComRespostaDtos = new List<QuestaoComRespostaDto>();
            Boolean sucesso = false;
            try
            {
                Dictionary<string, string> parametros = new Dictionary<string, string>();
                foreach (var texto in Request.Params.AllKeys)
                {
                    parametros.Add(texto, Request[texto]);
                }

                string usr_cpf = (parametros.ContainsKey("usr_cpf") && !string.IsNullOrEmpty(parametros["usr_cpf"])) ? parametros["usr_cpf"].ToString() : "";
                short eve_num_evento = (parametros.ContainsKey("eve_num_evento") && !string.IsNullOrEmpty(parametros["eve_num_evento"])) ? short.Parse(parametros["eve_num_evento"]) : short.Parse("0");
                short que_num_questionario = (parametros.ContainsKey("que_num_questionario") && !string.IsNullOrEmpty(parametros["que_num_questionario"])) ? short.Parse(parametros["que_num_questionario"]) : short.Parse("0");

                questaoComRespostaDtos = _questaoBussines.GetUsuarioQuestionarioPontuacaoFinal(eve_num_evento, que_num_questionario);

                List<object> lista = new List<object>();

                if (questaoComRespostaDtos != null && questaoComRespostaDtos.Count > 0)
                {
                    sucesso = true;
                    foreach (var item in questaoComRespostaDtos)
                    {
                        lista.Add(new
                        {
                            eve_num_evento = item.eve_num_evento,
                            eve_nome = item.eve_nome,
                            eve_situacao = item.eve_situacao,
                            que_num_questionario = item.que_num_questionario,
                            que_contexto = item.que_contexto,
                            que_situacao = item.que_situacao,
                            usr_num_usuario = item.usr_num_usuario,
                            usr_cpf = item.usr_cpf,
                            usr_nome = item.usr_nome,
                            usr_email = item.usr_email,
                            usr_situacao = item.usr_situacao,
                            pontuacao = item.pontuacao
                        });
                    }

                }
                else
                {
                    sucesso = false;
                    lista.Add(new
                    {
                        eve_num_evento = 0,
                        eve_nome = "",
                        eve_situacao = "",
                        que_num_questionario = 0,
                        que_contexto = "",
                        que_situacao = "",
                        usr_num_usuario = 0,
                        usr_cpf = "",
                        usr_nome = "",
                        usr_email = "",
                        usr_situacao = "",
                        pontuacao = 0
                    });
                }

                return Json(new
                {
                    sucesso = sucesso,
                    msg = "",
                    lista = lista,
                    qtd = questaoComRespostaDtos.Count
                });
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    sucesso = false,
                    msg = "ERRO:" + ex.ToString(),
                    lista = new List<object>(),
                    qtd = 0
                });
            }
        }
        
        [HttpPost]
        public JsonResult GerarPdfDeTodosEnvMail()
        {
            string dataGeracao = DateTime.Now.ToString("dd/MM/yyyy");
            List<QuestaoComRespostaDto> questaoComRespostaDtos = new List<QuestaoComRespostaDto>();
            List<EnvMailRelatorioViewModel> rels = new List<EnvMailRelatorioViewModel>();
            Boolean sucesso = false;

            string UsuarioIDDesenvolvimento = ConfigurationManager.AppSettings["UsuarioIDDesenvolvimento"];
            this.UsuarioLogado = new Usuario();
            this.UsuarioLogado.Email = "nfranca@ageprev.ms.gov.br";
            this.UsuarioLogado.Id = Convert.ToInt32(UsuarioIDDesenvolvimento);

            int mail_qtd_envio = 0;
            int mail_qtd_erros = 0;
            string mail_msg_erros = "";

            try
            {
                Dictionary<string, string> parametros = new Dictionary<string, string>();
                foreach (var texto in Request.Params.AllKeys)
                {
                    parametros.Add(texto, Request[texto]);
                }

                string usr_cpf = (parametros.ContainsKey("usr_cpf") && !string.IsNullOrEmpty(parametros["usr_cpf"])) ? parametros["usr_cpf"].ToString() : "";
                short eve_num_evento = (parametros.ContainsKey("eve_num_evento") && !string.IsNullOrEmpty(parametros["eve_num_evento"])) ? short.Parse(parametros["eve_num_evento"]) : short.Parse("0");
                short que_num_questionario = (parametros.ContainsKey("que_num_questionario") && !string.IsNullOrEmpty(parametros["que_num_questionario"])) ? short.Parse(parametros["que_num_questionario"]) : short.Parse("0");

                questaoComRespostaDtos = _questaoBussines.GetUsuarioQuestionarioPontuacaoFinal(eve_num_evento, que_num_questionario);

                List<object> lista = new List<object>();

                if (questaoComRespostaDtos != null && questaoComRespostaDtos.Count > 0)
                {
                    sucesso = true;
                    foreach (var item in questaoComRespostaDtos)
                    {
                        RelHtmlPDF relPDF = new RelHtmlPDF();
                        EnvMailRelatorioViewModel rlt = new EnvMailRelatorioViewModel();
                        try
                        {
                            if (SIGEVENTOS.Business.Util.Utils.EmailValido(item.usr_email))
                            {
                                string cpfParaRelatorio = !string.IsNullOrWhiteSpace(item.usr_cpf) ? item.usr_cpf : usr_cpf;
                                UsuariosDto usuarioResultado = _usuariosResultadosBusiness.VerificausuarioResultado(item.usr_num_usuario, item.eve_num_evento, item.que_num_questionario);
                                rlt.Relatorio = relPDF.geraHtmlPdf(cpfParaRelatorio, eve_num_evento, que_num_questionario, dataGeracao);
                                rels.Add(rlt);

                                #region Gera PDF com base no HTML gerado e salva na pasta App_Data
                                var converter = new HtmlToPdfConverter
                                {
                                    Size = NReco.PdfGenerator.PageSize.A4,
                                    Orientation = PageOrientation.Portrait,
                                    Margins = new PageMargins
                                    {
                                        Top = 10f,
                                        Bottom = 5f,
                                        Left = 10f,
                                        Right = 10f
                                    }
                                };
                                byte[] pdfBytes = converter.GeneratePdf(rlt.Relatorio.ToString(), null);

                                string appDataPath = Server.MapPath("~/App_Data/RelPDF");
                                if (!Directory.Exists(appDataPath))
                                {
                                    Directory.CreateDirectory(appDataPath);
                                }
                                string nomeDestinatario = string.IsNullOrWhiteSpace(item.usr_nome)
                                    ? item.usr_num_usuario.ToString() : Regex.Replace(item.usr_nome.Trim(), "[\\/:*?\"<>|]", "_");

                                string fileName = $"SIGEVENTOS - {nomeDestinatario} - Pontuação - Questionário.pdf";
                                string filePath = Path.Combine(appDataPath, fileName);
                                // System.IO.File.WriteAllBytes(filePath, pdfBytes);
                                #endregion


                                #region Envio de e-Mail aos usuários com o PDF do questionário
                                Stream mms = new MemoryStream(pdfBytes);
                                
                                string assunto = "Ageprev – Resultado do questionário respondido do Evento " + questaoComRespostaDtos[0].eve_nome;
                               // if( item.usr_email.Contains("junior.jrfsn@tutanota.com") )
                               // {
                                    SIGEVENTOS.Business.Util.Recursos.EnviarEmail(
                                        item.usr_email, nomeDestinatario, assunto,  "N", mms, fileName, UsuarioLogado.Email, this.UsuarioLogado.Id
                                    );
                               // }
                                mms.Close();
                                #endregion

                                lista.Add(new
                                {
                                    arquivoSalvo = fileName,
                                    caminhoSalvo = filePath,
                                    eve_num_evento = item.eve_num_evento,
                                    eve_nome = item.eve_nome,
                                    eve_situacao = item.eve_situacao,
                                    que_num_questionario = item.que_num_questionario,
                                    que_contexto = item.que_contexto,
                                    que_situacao = item.que_situacao,
                                    usr_num_usuario = item.usr_num_usuario,
                                    usr_cpf = item.usr_cpf,
                                    usr_nome = item.usr_nome,
                                    usr_email = item.usr_email,
                                    usr_situacao = item.usr_situacao,
                                    pontuacao = item.pontuacao
                                });
                                mail_qtd_envio++;
                            }
                            else
                            {

                            }
                        } 
                        catch (Exception ex)
                        {
                            mail_qtd_erros++;
                            mail_msg_erros = "<br/>" + ex.Message;
                        }
                        finally
                        {
                            //if (temErro)
                            //{
                            //    Recursos.GravarErroLogEmail(assunto, emailDestinatario, "N", mensagemError);
                            //}
                        }
                    }

                }
                else
                {
                    sucesso = false;
                    lista.Add(new
                    {
                        eve_num_evento = 0,
                        eve_nome = "",
                        eve_situacao = "",
                        que_num_questionario = 0,
                        que_contexto = "",
                        que_situacao = "",
                        usr_num_usuario = 0,
                        usr_cpf = "",
                        usr_nome = "",
                        usr_email = "",
                        usr_situacao = "",
                        pontuacao = 0,
                        arquivoSalvo = "",
                        caminhoSalvo = ""
                    });
                }

                return Json(new
                {
                    sucesso = sucesso,
                    msg = "",
                    lista = lista,
                    qtd = questaoComRespostaDtos.Count,
                    mail_qtd_envio = mail_qtd_envio,
                    mail_qtd_erros = mail_qtd_erros,
                    mail_msg_erros = mail_msg_erros
                });
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    sucesso = false,
                    msg = "ERRO:" + ex.ToString(),
                    lista = new List<object>(),
                    qtd = 0,
                    mail_qtd_envio = mail_qtd_envio,
                    mail_qtd_erros = mail_qtd_erros,
                    mail_msg_erros = mail_msg_erros
                });
            }
        }

    }
}