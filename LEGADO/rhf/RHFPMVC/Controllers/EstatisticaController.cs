using Microsoft.Ajax.Utilities;
using NReco.PdfGenerator;
using SGI.Framework.MVC.Architecture.Controller;
using RHFP.Business;
using RHFP.DTO.DTOS;
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

namespace RHFPMVC.Controllers
{

    public static class EstatisticaViewModel
    {
        public static string mov_nome_completo { get; set; }
        public static int Versao { get; internal set; }
        public static string Relatorio { get; internal set; }
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


    public class EstatisticaController : GSIController
    {
        private readonly QuestaoBusiness _questaoBussines;
        private readonly EventosBusiness _eventosBusiness;
        private readonly QuestaoBusiness _questaoBusiness;
        private readonly RespostasBusiness _respostasBusiness;
        private readonly QuestionariosBusiness _questionariosBusiness;
        private readonly UsuariosResultadosBusiness _usuariosResultadosBusiness;

        public string _contentRootPath { get; set; }

        public CarregaLayoutBusiness carregaLayout;
        public EstatisticaController()
        {
            // Aqui você instancia o contexto e passa para o repository
            // var context = new SIGEVENTOS.ModelData.Database.Entity.SigEventosContext();

            // Instancia a camada de negócio, que internamente usa o repository
              

            _questaoBussines = new QuestaoBusiness();
            _eventosBusiness = new EventosBusiness();
            _questaoBusiness = new QuestaoBusiness();
            _respostasBusiness = new RespostasBusiness();
            _questionariosBusiness = new QuestionariosBusiness();
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


                eventosDtos = _eventosBusiness.GetEventosQuestionario(eve_num_evento, que_num_questionario);
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
        
        [HttpPost]
        public JsonResult ObterQuestoes()
        {
            List<QuestoesDto> questoesDtos = new List<QuestoesDto>();
            Dictionary<string, string> questoes = new Dictionary<string, string>();
            List<object> lista = new List<object>();
            try
            {
                Dictionary<string, string> parametros = new Dictionary<string, string>();
                foreach (var texto in Request.Params.AllKeys)
                {
                    parametros.Add(texto, Request[texto]);
                }
                short eve_num_evento = (parametros.ContainsKey("eve_num_evento") && !string.IsNullOrEmpty(parametros["eve_num_evento"])) ? short.Parse(parametros["eve_num_evento"]) : short.Parse("0");
                short que_num_questionario = (parametros.ContainsKey("que_num_questionario") && !string.IsNullOrEmpty(parametros["que_num_questionario"])) ? short.Parse(parametros["que_num_questionario"]) : short.Parse("0");

                questoesDtos = _questaoBusiness.GetQuestoes();

                if (questoesDtos != null && questoesDtos.Count > 0)
                {
                    foreach (var que in questoesDtos)
                    {
                        questoes = new Dictionary<string, string>();
                        questoes.Add("qst_num_questao", questoesDtos[0].qst_num_questao.ToString());
                        questoes.Add("qst_enunciado", questoesDtos[0].qst_enunciado);
                        questoes.Add("qst_situacao", questoesDtos[0].qst_situacao);

                        lista.Add(new
                        {
                            qst_num_questao = que.qst_num_questao,
                            qst_enunciado = que.qst_enunciado,
                            qst_situacao = que.qst_situacao
                        });
                    }
                }

                return Json(new
                {
                    sucesso = true,
                    msg = "",
                    questoes = questoes,
                    lista = lista,
                    qtd = lista.Count
                });
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    sucesso = false,
                    msg = "ERRO:" + ex.Message,
                    questoes = questoes,
                    lista = lista,
                    qtd = 0
                });
            }

        }

        [HttpPost]
        public JsonResult ObterQuestao()
        {
            List<QuestoesDto> questoesDtos = new List<QuestoesDto>();
            Dictionary<string, string> questoes = new Dictionary<string, string>();
            List<object> lista = new List<object>();
            try
            {
                Dictionary<string, string> parametros = new Dictionary<string, string>();
                foreach (var texto in Request.Params.AllKeys)
                {
                    parametros.Add(texto, Request[texto]);
                }
                short eve_num_evento = (parametros.ContainsKey("eve_num_evento") && !string.IsNullOrEmpty(parametros["eve_num_evento"])) ? short.Parse(parametros["eve_num_evento"]) : short.Parse("0");
                short que_num_questionario = (parametros.ContainsKey("que_num_questionario") && !string.IsNullOrEmpty(parametros["que_num_questionario"])) ? short.Parse(parametros["que_num_questionario"]) : short.Parse("0");


                short qst_num_questao = (parametros.ContainsKey("qst_num_questao") && !string.IsNullOrEmpty(parametros["qst_num_questao"])) ? short.Parse(parametros["qst_num_questao"]) : short.Parse("0");
                questoesDtos = _questaoBusiness.GetQuestao(qst_num_questao);

                if (questoesDtos != null && questoesDtos.Count > 0)
                {
                    foreach (var que in questoesDtos)
                    {
                        questoes = new Dictionary<string, string>();
                        questoes.Add("qst_num_questao", questoesDtos[0].qst_num_questao.ToString());
                        questoes.Add("qst_enunciado", questoesDtos[0].qst_enunciado);
                        questoes.Add("qst_situacao", questoesDtos[0].qst_situacao);

                        lista.Add(new
                        {
                            qst_num_questao = que.qst_num_questao,
                            qst_enunciado = que.qst_enunciado,
                            qst_situacao = que.qst_situacao
                        });
                    }
                }

                return Json(new
                {
                    sucesso = true,
                    msg = "",
                    questoes = questoes,
                    lista = lista,
                    qtd = lista.Count
                });
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    sucesso = false,
                    msg = "ERRO:" + ex.Message,
                    questoes = questoes,
                    lista = lista,
                    qtd = 0
                });
            }

        }

        [HttpPost]
        public JsonResult ObterRespostasPorQuestao()
        {
            List<RespostasDto> respostasDtos = new List<RespostasDto>();
            Dictionary<string, string> respostas = new Dictionary<string, string>();
            List<object> lista = new List<object>();
            try
            {
                Dictionary<string, string> parametros = new Dictionary<string, string>();
                foreach (var texto in Request.Params.AllKeys)
                {
                    parametros.Add(texto, Request[texto]);
                }
                short eve_num_evento = (parametros.ContainsKey("eve_num_evento") && !string.IsNullOrEmpty(parametros["eve_num_evento"])) ? short.Parse(parametros["eve_num_evento"]) : short.Parse("0");
                short que_num_questionario = (parametros.ContainsKey("que_num_questionario") && !string.IsNullOrEmpty(parametros["que_num_questionario"])) ? short.Parse(parametros["que_num_questionario"]) : short.Parse("0");


                short qst_num_questao = (parametros.ContainsKey("qst_num_questao") && !string.IsNullOrEmpty(parametros["qst_num_questao"])) ? short.Parse(parametros["qst_num_questao"]) : short.Parse("0");
                respostasDtos = _respostasBusiness.ObterRespostasPorQuestao(qst_num_questao);

                if (respostasDtos != null && respostasDtos.Count > 0)
                {
                    foreach (var que in respostasDtos)
                    {
                        respostas = new Dictionary<string, string>();
                        respostas.Add("qst_num_questao", respostasDtos[0].qst_num_questao.ToString());
                        respostas.Add("qsr_num_resposta", respostasDtos[0].qsr_num_resposta.ToString());
                        respostas.Add("qsr_enunciado", respostasDtos[0].qsr_enunciado);
                        respostas.Add("qsr_e_correta", respostasDtos[0].qsr_e_correta);
                        respostas.Add("qsr_situacao", respostasDtos[0].qsr_situacao);

                        lista.Add(new
                        {
                            qst_num_questao = que.qst_num_questao,
                            qsr_num_resposta = que.qsr_num_resposta,
                            qsr_enunciado = que.qsr_enunciado,
                            qsr_e_correta = que.qsr_e_correta,
                            qsr_situacao = que.qsr_situacao
                        });
                    }
                }

                return Json(new
                {
                    sucesso = true,
                    msg = "",
                    questoes = respostas,
                    lista = lista,
                    qtd = lista.Count
                });
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    sucesso = false,
                    msg = "ERRO:" + ex.Message,
                    questoes = respostas,
                    lista = lista,
                    qtd = 0
                });
            }

        }
        
        [HttpPost]
        public JsonResult ObterRespostaPorId()
        {
            List<RespostasDto> respostasDtos = new List<RespostasDto>();
            Dictionary<string, string> respostas = new Dictionary<string, string>();
            List<object> lista = new List<object>();
            try
            {
                Dictionary<string, string> parametros = new Dictionary<string, string>();
                foreach (var texto in Request.Params.AllKeys)
                {
                    parametros.Add(texto, Request[texto]);
                }
                short eve_num_evento = (parametros.ContainsKey("eve_num_evento") && !string.IsNullOrEmpty(parametros["eve_num_evento"])) ? short.Parse(parametros["eve_num_evento"]) : short.Parse("0");
                short que_num_questionario = (parametros.ContainsKey("que_num_questionario") && !string.IsNullOrEmpty(parametros["que_num_questionario"])) ? short.Parse(parametros["que_num_questionario"]) : short.Parse("0");

                short qst_num_questao = (parametros.ContainsKey("qst_num_questao") && !string.IsNullOrEmpty(parametros["qst_num_questao"])) ? short.Parse(parametros["qst_num_questao"]) : short.Parse("0");
                short qsr_num_resposta = (parametros.ContainsKey("qsr_num_resposta") && !string.IsNullOrEmpty(parametros["qsr_num_resposta"])) ? short.Parse(parametros["qsr_num_resposta"]) : short.Parse("0");

                respostasDtos = _respostasBusiness.ObterRespostaPorId(qst_num_questao, qsr_num_resposta);

                if (respostasDtos != null && respostasDtos.Count > 0)
                {
                    foreach (var que in respostasDtos)
                    {
                        respostas = new Dictionary<string, string>();
                        respostas.Add("qst_num_questao", respostasDtos[0].qst_num_questao.ToString());
                        respostas.Add("qsr_num_resposta", respostasDtos[0].qsr_num_resposta.ToString());
                        respostas.Add("qsr_enunciado", respostasDtos[0].qsr_enunciado);
                        respostas.Add("qsr_e_correta", respostasDtos[0].qsr_e_correta);
                        respostas.Add("qsr_situacao", respostasDtos[0].qsr_situacao);

                        lista.Add(new
                        {
                            qst_num_questao = que.qst_num_questao,
                            qsr_num_resposta = que.qsr_num_resposta,
                            qsr_enunciado = que.qsr_enunciado,
                            qsr_e_correta = que.qsr_e_correta,
                            qsr_situacao = que.qsr_situacao
                        });
                    }
                }

                return Json(new
                {
                    sucesso = true,
                    msg = "",
                    questoes = respostas,
                    lista = lista,
                    qtd = lista.Count
                });
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    sucesso = false,
                    msg = "ERRO:" + ex.Message,
                    questoes = respostas,
                    lista = lista,
                    qtd = 0
                });
            }

        }
        
        [HttpPost]
        public JsonResult ObterEvento()
        {
            List<EventosDto> eventosDtos = new List<EventosDto>();
            Dictionary<string, string> evento = new Dictionary<string, string>();
            List<object> lista = new List<object>();
            try
            {
                Dictionary<string, string> parametros = new Dictionary<string, string>();
                foreach (var texto in Request.Params.AllKeys)
                {
                    parametros.Add(texto, Request[texto]);
                }

                short eve_num_evento = (parametros.ContainsKey("eve_num_evento") && !string.IsNullOrEmpty(parametros["eve_num_evento"])) ? short.Parse(parametros["eve_num_evento"]) : short.Parse("0");
                short que_num_questionario = (parametros.ContainsKey("que_num_questionario") && !string.IsNullOrEmpty(parametros["que_num_questionario"])) ? short.Parse(parametros["que_num_questionario"]) : short.Parse("0");

                eventosDtos = _eventosBusiness.GetEvento(eve_num_evento);

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

                    lista.Add(new
                    {
                        eve_num_evento = eventosDtos[0].eve_num_evento,
                        eve_nome = eventosDtos[0].eve_nome,
                        eve_descricao = eventosDtos[0].eve_descricao,
                        eve_local = eventosDtos[0].eve_local,
                        eve_municipio = eventosDtos[0].eve_municipio,

                        eve_dt_inicio = eventosDtos[0].eve_dt_inicio.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture) ?? string.Empty,
                        eve_dt_fim = eventosDtos[0].eve_dt_fim?.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture) ?? string.Empty,
                        eve_dt_inclusao = eventosDtos[0].eve_dt_inclusao.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture) ?? string.Empty,

                        eve_situacao = eventosDtos[0].eve_situacao
                    });
                }

                return Json(new
                {
                    sucesso = true,
                    msg = "",
                    evento = evento,
                    lista = lista,
                    qtd = lista.Count
                });
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    sucesso = false,
                    msg = "ERRO:" + ex.Message,
                    evento = evento,
                    lista = lista,
                    qtd = 0
                });
            }

        }

        [HttpPost]
        public JsonResult SalvarQuestionario()
        {
            List<EventosDto> eventosDtos = new List<EventosDto>();
            Dictionary<string, string> evento = new Dictionary<string, string>();
            List<object> lista = new List<object>();
            try
            {
                Dictionary<string, string> parametros = new Dictionary<string, string>();
                foreach (var texto in Request.Params.AllKeys)
                {
                    parametros.Add(texto, Request[texto]);
                }

                short eve_num_evento = (parametros.ContainsKey("eve_num_evento") && !string.IsNullOrEmpty(parametros["eve_num_evento"])) ? short.Parse(parametros["eve_num_evento"]) : short.Parse("0");
                short que_num_questionario = (parametros.ContainsKey("que_num_questionario") && !string.IsNullOrEmpty(parametros["que_num_questionario"])) ? short.Parse(parametros["que_num_questionario"]) : short.Parse("0");

                eventosDtos = _eventosBusiness.GetEvento(eve_num_evento);

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

                    lista.Add(new
                    {
                        eve_num_evento = eventosDtos[0].eve_num_evento,
                        eve_nome = eventosDtos[0].eve_nome,
                        eve_descricao = eventosDtos[0].eve_descricao,
                        eve_local = eventosDtos[0].eve_local,
                        eve_municipio = eventosDtos[0].eve_municipio,

                        eve_dt_inicio = eventosDtos[0].eve_dt_inicio.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture) ?? string.Empty,
                        eve_dt_fim = eventosDtos[0].eve_dt_fim?.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture) ?? string.Empty,
                        eve_dt_inclusao = eventosDtos[0].eve_dt_inclusao.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture) ?? string.Empty,

                        eve_situacao = eventosDtos[0].eve_situacao
                    });
                }

                return Json(new
                {
                    sucesso = true,
                    msg = "",
                    evento = evento,
                    lista = lista,
                    qtd = lista.Count
                });
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    sucesso = false,
                    msg = "ERRO:" + ex.Message,
                    evento = evento,
                    lista = lista,
                    qtd = 0
                });
            }

        }

        [HttpPost]
        public JsonResult GetContagemPorNotaQuestionarios()
        {
            
            List<EventosDto> eventosDtos = new List<EventosDto>();
            List<object> lista = new List<object>();
            try
            {
                Dictionary<string, string> parametros = new Dictionary<string, string>();
                foreach (var texto in Request.Params.AllKeys)
                {
                    parametros.Add(texto, Request[texto]);
                }

                short eve_num_evento = (parametros.ContainsKey("eve_num_evento") && !string.IsNullOrEmpty(parametros["eve_num_evento"])) ? short.Parse(parametros["eve_num_evento"]) : short.Parse("0");
                short que_num_questionario = (parametros.ContainsKey("que_num_questionario") && !string.IsNullOrEmpty(parametros["que_num_questionario"])) ? short.Parse(parametros["que_num_questionario"]) : short.Parse("0");

                eventosDtos = _eventosBusiness.GetEventosQuestionariosGeralFinal();
                if (eventosDtos != null)
                {
                    foreach (var eventoDto in eventosDtos)
                    {

                        List<UsuariosDto> usuariosDtos = new List<UsuariosDto>();
                        List<object> estatContNota = new List<object>();
                        usuariosDtos = _usuariosResultadosBusiness.GetContagemPorNotaResultado(eventoDto.eve_num_evento, eventoDto.que_num_questionario);
                        if (usuariosDtos != null && usuariosDtos.Count > 0)
                        {
                            foreach (var item in usuariosDtos)
                            {
                                estatContNota.Add(new
                                {
                                    eve_num_evento = item.eve_num_evento,
                                    que_num_questionario = item.que_num_questionario,
                                    ure_nota_resultado = item.ure_nota_resultado,
                                    QTDE = item.QTDE
                                });
                            }
                        }

                        List<object> eventoQuestionario = new List<object>();
                        eventoQuestionario.Add(new {
                            eve_num_evento = eventoDto.eve_num_evento,
                            eve_nome = eventoDto.eve_nome,
                            eve_descricao = eventoDto.eve_descricao,
                            eve_local = eventoDto.eve_local,
                            eve_municipio = eventoDto.eve_municipio,
                            eve_dt_inicio = eventoDto.eve_dt_inicio.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture) ?? string.Empty,
                            eve_dt_fim = eventoDto.eve_dt_fim?.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture) ?? string.Empty,
                            eve_dt_inclusao = eventoDto.eve_dt_inclusao.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture) ?? string.Empty,
                            eve_situacao = eventoDto.eve_situacao,
                            que_num_questionario = eventoDto.que_num_questionario,
                            que_contexto = eventoDto.que_contexto,
                            que_publico_alvo = eventoDto.que_publico_alvo,
                            que_nota_minima = eventoDto.que_nota_minima,
                            que_dt_inclusao = eventoDto.que_dt_inclusao.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture) ?? string.Empty,
                            que_situacao = eventoDto.que_situacao,
                            estatContNota = estatContNota
                        });
                        if (estatContNota.Count > 0)
                        {
                            lista.Add(eventoQuestionario);
                        }
                        
                    }

                    return Json(new
                    {
                        sucesso = (lista.Count > 0)?true:false,
                        msg = "",
                        lista = lista,
                        qtd = lista.Count
                    });
                }
                else
                {
                    return Json(new
                    {
                        sucesso = false,
                        msg = "Nenhum evento encontrado.",
                        lista = lista,
                        qtd = 0
                    });
                }
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    sucesso = false,
                    msg = "ERRO:" + ex.Message,
                    lista = lista, 
                    qtd = 0
                });
            }
        }

        [HttpPost]
        public JsonResult GetContagemPorNotaResultado()
        {
            List<UsuariosDto> usuariosDtos = new List<UsuariosDto>();
            List<object> estatContNota = new List<object>();
  
            try
            {
                Dictionary<string, string> parametros = new Dictionary<string, string>();
                foreach (var texto in Request.Params.AllKeys)
                {
                    parametros.Add(texto, Request[texto]);
                }

                short eve_num_evento = (parametros.ContainsKey("eve_num_evento") && !string.IsNullOrEmpty(parametros["eve_num_evento"])) ? short.Parse(parametros["eve_num_evento"]) : short.Parse("0");
                short que_num_questionario = (parametros.ContainsKey("que_num_questionario") && !string.IsNullOrEmpty(parametros["que_num_questionario"])) ? short.Parse(parametros["que_num_questionario"]) : short.Parse("0");

                usuariosDtos = _usuariosResultadosBusiness.GetContagemPorNotaResultado(eve_num_evento, que_num_questionario);
                if (usuariosDtos != null && usuariosDtos.Count > 0)
                {
                    foreach (var item in usuariosDtos)
                    {
                        estatContNota.Add(new
                        {
                            eve_num_evento = item.eve_num_evento,
                            que_num_questionario = item.que_num_questionario,
                            ure_nota_resultado = item.ure_nota_resultado,
                            QTDE = item.QTDE
                        });
                    }
                }

                return Json(new
                {
                    sucesso = true,
                    msg = "",
                    estatContNota = estatContNota, 
                    qtd = estatContNota.Count
                });
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    sucesso = false,
                    msg = "ERRO:" + ex.Message,
                    estatContNota = estatContNota, 
                    qtd = 0
                });
            }

        }
        
        [HttpPost]
        public JsonResult SalvarListaDeQuestionario()
        {
            List<EventosDto> eventosDtos = new List<EventosDto>();
            Dictionary<string, string> evento = new Dictionary<string, string>();
            List<object> lista = new List<object>();
            try
            {
                Dictionary<string, string> parametros = new Dictionary<string, string>();
                foreach (var texto in Request.Params.AllKeys)
                {
                    parametros.Add(texto, Request[texto]);
                }

                short eve_num_evento = (parametros.ContainsKey("eve_num_evento") && !string.IsNullOrEmpty(parametros["eve_num_evento"])) ? short.Parse(parametros["eve_num_evento"]) : short.Parse("0");
                short que_num_questionario = (parametros.ContainsKey("que_num_questionario") && !string.IsNullOrEmpty(parametros["que_num_questionario"])) ? short.Parse(parametros["que_num_questionario"]) : short.Parse("0");

                eventosDtos = _eventosBusiness.GetEvento(eve_num_evento);

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

                    lista.Add(new
                    {
                        eve_num_evento = eventosDtos[0].eve_num_evento,
                        eve_nome = eventosDtos[0].eve_nome,
                        eve_descricao = eventosDtos[0].eve_descricao,
                        eve_local = eventosDtos[0].eve_local,
                        eve_municipio = eventosDtos[0].eve_municipio,

                        eve_dt_inicio = eventosDtos[0].eve_dt_inicio.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture) ?? string.Empty,
                        eve_dt_fim = eventosDtos[0].eve_dt_fim?.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture) ?? string.Empty,
                        eve_dt_inclusao = eventosDtos[0].eve_dt_inclusao.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture) ?? string.Empty,

                        eve_situacao = eventosDtos[0].eve_situacao
                    });
                }

                return Json(new
                {
                    sucesso = true,
                    msg = "",
                    evento = evento,
                    lista = lista,
                    qtd = lista.Count
                });
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    sucesso = false,
                    msg = "ERRO:" + ex.Message,
                    evento = evento,
                    lista = lista,
                    qtd = 0
                });
            }

        }

        [HttpPost]
        public JsonResult ObterEventoQuestionarios()
        {
            List<EventosDto> eventosDtos = new List<EventosDto>();
            List<object> eventos = new List<object>();
            List<object> questionarios = new List<object>();
            try
            {
                Dictionary<string, string> parametros = new Dictionary<string, string>();
                foreach (var texto in Request.Params.AllKeys)
                {
                    parametros.Add(texto, Request[texto]);
                }

                short eve_num_evento = (parametros.ContainsKey("eve_num_evento") && !string.IsNullOrEmpty(parametros["eve_num_evento"])) ? short.Parse(parametros["eve_num_evento"]) : short.Parse("0");
                short que_num_questionario = (parametros.ContainsKey("que_num_questionario") && !string.IsNullOrEmpty(parametros["que_num_questionario"])) ? short.Parse(parametros["que_num_questionario"]) : short.Parse("0");

                eventosDtos = _eventosBusiness.GetEvento(eve_num_evento);
                if (eventosDtos != null && eventosDtos.Count > 0)
                {
                    eventos.Add(new
                    {
                        eve_num_evento = eventosDtos[0].eve_num_evento,
                        eve_nome = eventosDtos[0].eve_nome,
                        eve_descricao = eventosDtos[0].eve_descricao,
                        eve_local = eventosDtos[0].eve_local,
                        eve_municipio = eventosDtos[0].eve_municipio,

                        eve_dt_inicio = eventosDtos[0].eve_dt_inicio.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture) ?? string.Empty,
                        eve_dt_fim = eventosDtos[0].eve_dt_fim?.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture) ?? string.Empty,
                        eve_dt_inclusao = eventosDtos[0].eve_dt_inclusao.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture) ?? string.Empty,

                        eve_situacao = eventosDtos[0].eve_situacao
                    });
                }
                List<QuestionariosDto> questionariosDto = _questionariosBusiness.ObterEventoQuestionario(eve_num_evento);
                questionarios = new List<object>();
                foreach (var questionario in questionariosDto)
                {
                    questionarios.Add(new
                    { 
                        eve_num_evento = questionario.eve_num_evento,
                        eve_nome = questionario.eve_nome,
                        que_num_questionario = questionario.que_num_questionario,
                        que_contexto = questionario.que_contexto,
                        que_publico_alvo = questionario.que_publico_alvo,
                        que_nota_minima = questionario.que_nota_minima,
                        que_dt_inclusao = questionario.que_dt_inclusao.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture),
                        que_situacao = questionario.que_situacao
                    });
                }

                return Json(new
                {
                    sucesso = true,
                    msg = "",
                    eventos = eventos,
                    questionarios = questionarios,
                    qtd = questionarios.Count
                });
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    sucesso = false,
                    msg = "ERRO:" + ex.Message,
                    eventos = eventos,
                    questionarios = questionarios,
                    qtd = 0
                });
            }

        }

        public string geraHtmlPdf(string usr_cpf, short eve_num_evento, short que_num_questionario, string dataGeracao)
        {
            string thead = "";
            string contentDadosHeigth = "";
            string footerStylePaddingTop = "";
            string tbdoyResumo = "";
            string pontuacao = "";
            int totalPagina = 0;
            string notaUsuario = "0";
            carregaLayout = new CarregaLayoutBusiness(_contentRootPath);

            UsuariosDto usuariosDto = _questaoBussines.VerificaUsuario(usr_cpf);
            GestaoViewModel.usr_cpf = usuariosDto.CpfUsuario;
            GestaoViewModel.usr_nome = usuariosDto.NomeUsuario;
            GestaoViewModel.Versao = (GestaoViewModel.Versao == 0) ? 1 : GestaoViewModel.Versao;

            var qFirst = new QuestaoComRespostaDto();
            List<EventosDto> eventosDtos = new List<EventosDto>();
            Dictionary<string, string> evento = new Dictionary<string, string>();
            eventosDtos = _eventosBusiness.GetEventosQuestionario(eve_num_evento, que_num_questionario);
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
            List<string> tbodyitensList = new List<string>();

            List<QuestaoComRespostaDto> questaoComRespostaDtos = _questaoBussines.GetUsuarioQuestionarioPontuacaoConferenciaPorCpf(eve_num_evento, que_num_questionario, usr_cpf);

            List<QuestaoComRespostaDto> questoes = questaoComRespostaDtos.GroupBy(x => x.qst_num_questao).Select(
                g => new QuestaoComRespostaDto
                {
                    usr_num_usuario = g.First().usr_num_usuario,
                    usr_nome = g.First().usr_nome,
                    eve_num_evento = g.First().eve_num_evento,
                    eve_nome = g.First().eve_nome,
                    que_num_questionario = g.First().que_num_questionario,
                    qst_num_questao = g.Key,
                    qst_enunciado = g.First().qst_enunciado,
                    nota_q = g.First().nota_q,
                    pontuacao = g.First().pontuacao
                }).OrderBy(x => x.qst_num_questao).ToList();

            // Prepend User card (name and grade) at the beginning of the list if there are questions

            if (questoes.Count > 0)
            {
                qFirst = questoes.First();
                notaUsuario = qFirst.pontuacao.ToString("N2", new CultureInfo("pt-BR"));
                pontuacao = notaUsuario;
                string userCard = $@"<tr class=""card border-light"" style=""width: 100%;padding: 0px 0px 0px 0px;""> 
                    <td colspan=""11"" style=""border: none; padding: 6px 8px;text-align:left;""><span class=""form-label"" id=""nomeUser"" style=""font-weight: 600; font-size: 13px;"">{qFirst.usr_nome}</span></td>
                    <td style=""border: none; padding: 6px 8px; text-align: right;""><span class=""form-label"" id=""notaUser"" style=""font-weight: 600; font-size: 13px;"">Nota : {notaUsuario}</span></td>
                </tr>";
                tbodyitensList.Add(userCard);
            }

            foreach (var q in questoes)
            {
                string check_notap = "";
                if (q.nota_q == 1)
                {
                    check_notap = @"<svg class=""svg-inline--fa text-success fa-lg"" viewBox=""0 0 448 512"" fill=""currentColor"" style=""width: 18px; height: 18px;""><path d=""M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z""/></svg> correta";
                }
                else
                {
                    check_notap = @"<svg class=""svg-inline--fa text-danger fa-lg"" viewBox=""0 0 320 512"" fill=""currentColor"" style=""width: 18px; height: 18px;""><path d=""M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z""/></svg> incorreta";
                }

                string tbodyitens = $@"<tr style=""width: 100%;padding: 0px 0px 0px 0px;"">
                        <td colspan=""12"" style=""border: none; padding: 0;"">
                    <div class=""card border-light"" style=""margin-bottom: 0px; page-break-inside: avoid;"">
                        <div style=""text-align: right;"">
                            {check_notap}
                        </div>
                        <div class=""card-header text-white"" style=""background-color: #337ab7; border-radius: 8px; font-family: sans-serif; font-weight: 800;"">
                            <h4><b>{q.qst_enunciado}</b></h4>
                        </div>
                        <div class=""card-body border-light"" style=""background-color: #fefefe; border-radius: 8px;"">
                            <ul class=""list-group list-group-flush"" style=""text-align-left;"">";

                List<QuestaoComRespostaDto> respostas = questaoComRespostaDtos.Where(x => x.qst_num_questao == q.qst_num_questao)
                    .GroupBy(x => x.qsr_num_resposta).Select(
                    g => new QuestaoComRespostaDto
                    {
                        usr_num_usuario = g.First().usr_num_usuario,
                        usr_nome = g.First().usr_nome,
                        eve_num_evento = g.First().eve_num_evento,
                        eve_nome = g.First().eve_nome,
                        que_num_questionario = g.First().que_num_questionario,
                        qst_num_questao = g.First().qst_num_questao,
                        qst_enunciado = g.First().qst_enunciado,
                        qsr_num_resposta = g.Key,
                        qsr_enunciado = g.First().qsr_enunciado,
                        qsr_e_correta = g.First().qsr_e_correta,
                        qsr_num_resposta_usuario = g.First().qsr_num_resposta_usuario,
                        ponto_q = g.First().ponto_q,
                        ponto_alvo_q = g.First().ponto_alvo_q,
                        qtde_q = g.First().qtde_q,
                        nota_q = g.First().nota_q,
                        nota = g.First().nota,
                        pontuacao = g.First().pontuacao
                    }).OrderBy(x => x.qsr_num_resposta).ToList();
                foreach (var qcru in respostas)
                {

                    string cbId = $"Quest[{q.qst_num_questao}][{qcru.qsr_num_resposta}][qsr_num_resposta]";
                    string check_correta = (
                        (qcru.qsr_e_correta == "S" && qcru.qsr_num_resposta == qcru.qsr_num_resposta_usuario)
                        ||
                        (qcru.qsr_e_correta == "N" && qcru.qsr_num_resposta != qcru.qsr_num_resposta_usuario)
                    )
                    ?
                        (
                            (qcru.qsr_e_correta == "S" && qcru.qsr_num_resposta == qcru.qsr_num_resposta_usuario)
                            ? @"<svg class=""svg-inline--fa text-primary fa-lg"" viewBox=""0 0 448 512"" fill=""#5ac146""><path d=""M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z""/></svg>"
                            : @"<svg class=""svg-inline--fa text-primary fa-lg"" viewBox=""0 0 448 512"" fill=""#ffffff""><path d=""M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z""/></svg>"
                        //: @"<svg class=""svg-inline--fa text-primary fa-lg"" viewBox=""0 0 448 512""><rect x=""32"" y=""32"" width=""384"" height=""448"" rx=""48"" ry=""48"" fill=""#eef0f3"" stroke=""#6c757d"" stroke-width=""24""/></svg>"
                        )
                    : (qcru.qsr_e_correta == "S" && qcru.qsr_num_resposta != qcru.qsr_num_resposta_usuario)

                    ? @"<svg class=""svg-inline--fa text-primary fa-lg"" viewBox=""0 0 448 512"" fill=""#5ac146""><path d=""M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z""/></svg>"
                    : @"<svg class=""svg-inline--fa text-primary fa-lg"" viewBox=""0 0 448 512"" fill=""#ffffff""><path d=""M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z""/></svg>";
                    //: $@"<input class=""form-check-input text-danger""  type=""checkbox"" value=""{qcru.qsr_num_resposta}"" name=""{cbId}"" id=""{cbId}"" onclick=""return false;"" />";

                    string check_usuario = "";
                    if (qcru.qsr_e_correta == "S" && qcru.qsr_num_resposta == qcru.qsr_num_resposta_usuario)
                    {
                        check_usuario = @"<svg class=""svg-inline--fa text-primary fa-lg"" viewBox=""0 0 448 512"" fill=""#0d6efd""><path d=""M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z""/></svg>";
                    }
                    else if (qcru.qsr_e_correta == "N" && qcru.qsr_num_resposta != qcru.qsr_num_resposta_usuario)
                    {
                        check_usuario = @"<svg class=""svg-inline--fa text-primary fa-lg"" viewBox=""0 0 448 512"" fill=""#0d6efd""><path d=""M384 32H64C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64zM400 96V416c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V96c0-8.8 7.2-16 16-16H384c8.8 0 16 7.2 16 16z""/></svg>";
                    }
                    else if (qcru.qsr_e_correta == "N" && qcru.qsr_num_resposta == qcru.qsr_num_resposta_usuario)
                    {
                        check_usuario = @"<svg class=""svg-inline--fa text-primary fa-lg"" viewBox=""0 0 448 512"" fill=""#0d6efd""><path d=""M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z""/></svg>";
                    }
                    else
                    {
                        check_usuario = @"<svg class=""svg-inline--fa text-primary fa-lg"" viewBox=""0 0 448 512"" fill=""#0d6efd""><path d=""M384 32H64C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64zM400 96V416c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V96c0-8.8 7.2-16 16-16H384c8.8 0 16 7.2 16 16z""/></svg>";
                    }

                    tbodyitens += $@"
                                <li class=""list-group-item"" style=""text-align:left;"">
                                    <div class=""form-check"" style=""text-align:left;"">
                                        {check_correta} 
                                        {check_usuario}
                                        <label class=""form-check-label"" for=""{cbId}"" id=""Quest[{q.qst_num_questao}][{qcru.qsr_num_resposta}][qsr_enunciado]"">
                                            {qcru.qsr_enunciado}
                                        </label>
                                    </div>
                                </li>";
                }
                tbodyitens += @"
                            </ul>
                        </div>
                    </div>
                </td></tr>";
                tbodyitensList.Add(tbodyitens);
            }

            decimal que_nota_minima = (evento.ContainsKey("que_nota_minima") ? Decimal.Parse(evento["que_nota_minima"]) : Decimal.Parse("0"));
            string msgCongrat = ""; string msgNota = "";
            if (qFirst.pontuacao >= que_nota_minima)
            {
                msgCongrat = $@"<span id=""nomeUser"" style=""font-weight: 600; font-size: 16px;color:#337ab7;"" >Obrigado pela sua Participação, você teve uma ótima pontuação acima da mínima : {que_nota_minima}!</span>";
                msgNota = $@"<span id=""nomeUser"" style=""font-weight: 600; font-size: 16px;color:#337ab7;"" >Nota : {notaUsuario}</span>";
            }
            else
            {
                msgCongrat = $@"<span id=""nomeUser"" style=""font-weight: 600; font-size: 16px;color:#fa5838;"" class=""text-danger"" >Obrigado pela sua Participação, você não atingiu a nota mínima : {que_nota_minima}!</span>";
                msgNota = $@"<span id=""nomeUser"" style=""font-weight: 600; font-size: 16px;color:#fa5838;"" class=""text-danger"" >Nota : {notaUsuario}</span>";
            }

            string userCongrat =
            $@"<tr class=""card border-light"" style=""width: 100%;padding: 0px 0px 0px 0px;""> 
                <td colspan=""11"" style=""border: none; padding: 6px 8px 8px 20px;text-align:left;"">
                    <section class=""form-label"" >{msgCongrat}</section>
                </td>
                <td style=""border: none; padding: 6px 8px 8px 20px; text-align: right;"">
                    <section class=""form-label"" >{msgNota}</section>
                </td>
            </tr>";
            tbodyitensList.Add(userCongrat);

            string PageHead = carregaLayout.PageHead;
            string cssComMarcaDagua = @"#content-dados{ }";

            int totReg = tbodyitensList.Count();

            if (totReg == 0)
            {
                totalPagina = 1;
            }
            else
            {
                int fullPages = totReg / 4;
                int remainder = totReg % 4;
                totalPagina = fullPages + (remainder > 0 ? 1 : 0);

            }

            string PageResumo = carregaLayout.RelatorioPageResumo
            .Replace("{tbdoyResumo}", tbdoyResumo)
            .Replace("{contentDadosHeigth}", contentDadosHeigth)
            .Replace("{footerStylePaddingTop}", footerStylePaddingTop);

            CarregaLayoutBusiness rpc = new CarregaLayoutBusiness(_contentRootPath); ;

            string PageHeader = carregaLayout.RelatorioPageHeader

            .Replace("{eve_nome}", evento.ContainsKey("eve_nome") ? evento["eve_nome"] : "")
            .Replace("{eve_descricao}", evento.ContainsKey("eve_descricao") ? evento["eve_descricao"] : "")
            .Replace("{que_contexto}", evento.ContainsKey("que_contexto") ? evento["que_contexto"] : "")
            .Replace("{que_nota_minima}", evento.ContainsKey("que_nota_minima") ? evento["que_nota_minima"] : "")
            .Replace("{mov_nome_completo}", usuariosDto.NomeUsuario)
            .Replace("{pontuacao}", pontuacao)
            .Replace("{tprel}", "")
            .Replace("{versao}", GestaoViewModel.Versao.ToString());

            string PageContent = "";
            int cnt2 = 0;
            string trItem = "";
            int pagina = 0;
            int qtdPorPage = 0;
            foreach (var tbodyitem in tbodyitensList)
            {
                cnt2++;
                bool isLastItem = cnt2 == totReg;
                qtdPorPage++;
                trItem += tbodyitem;

                string cordepagina = ""; //(new int[] {1,3,5,7,9,11,13,15}.Contains(qtdPorPage) ) ? "background-color:bisque;" : "background-color:aliceblue;";

                if (pagina > 0)
                {
                    if (qtdPorPage == 4 || isLastItem)
                    {
                        pagina++;
                        PageContent += rpc.RelatorioPageContent
                            .Replace("{EstiloMarcaDagua}", cssComMarcaDagua)
                            .Replace("{PageHeader}", "")
                            .Replace("{corDePagina}", cordepagina)
                            .Replace("{alturaPage}", "")
                            .Replace("{thead}", "")
                            .Replace("{tbodyitens}", trItem)
                            //.Replace("{tableResumo}", (qtdPorPage < 24) ? PageResumo : "")
                            .Replace("{tableResumo}", "")
                            .Replace("{pagina}", pagina.ToString())
                            .Replace("{totalPagina}", totalPagina.ToString())
                            .Replace("{dataGeracao}", dataGeracao);
                        trItem = "";
                        qtdPorPage = 0;
                    }
                }
                else
                {
                    if (qtdPorPage == 4)
                    {
                        pagina++;
                        //bool incluirResumo = isLastItem && (qtdPorPage < 24 || qtdPorPage == 29);
                        string _PageHeader = $@"<tr style=""max-height: 320px; height: 320px;""><td style=""max-height: 320px; height: 320px;"" valign=""top"">{PageHeader}</td></tr>";
                        PageContent += rpc.RelatorioPageContent
                          .Replace("{EstiloMarcaDagua}", cssComMarcaDagua)
                          .Replace("{PageHeader}", _PageHeader)
                          .Replace("{corDePagina}", "")
                          .Replace("{alturaPage}", "")
                          .Replace("{thead}", thead)
                          .Replace("{tbodyitens}", trItem)
                          //.Replace("{tableResumo}", incluirResumo ? PageResumo : "")
                          .Replace("{tableResumo}", "")
                          .Replace("{pagina}", pagina.ToString())
                          .Replace("{totalPagina}", totalPagina.ToString())
                          .Replace("{dataGeracao}", dataGeracao);
                        trItem = "";
                        qtdPorPage = 0;
                    }
                }
            }

            //if (totReg == 0)
            //{
            //    string noDataRow = "<tr><td colspan=\"11\" style=\"padding: 20px; text-align: center; border: none;\">Nenhum registro encontrado.</td></tr>";
            //    PageContent += rpc.RelatorioPageContent
            //        .Replace("{EstiloMarcaDagua}", cssComMarcaDagua)
            //        .Replace("{PageHeader}", PageHeader)
            //        .Replace("{corDePagina}", corDePagina)
            //        .Replace("{alturaPage}", "max-height: 1035px; height: 1035px;")
            //        .Replace("{thead}", thead)
            //        .Replace("{tbodyitens}", noDataRow)
            //        .Replace("{tableResumo}", PageResumo)
            //        .Replace("{pagina}", "1")
            //        .Replace("{totalPagina}", totalPagina.ToString())
            //        .Replace("{dataGeracao}", dataGeracao);
            //}
            //if (qtdPorPage >= 24)
            //{
            //    pagina++;
            //    PageContent += rpc.RelatorioPageContent
            //        .Replace("{EstiloMarcaDagua}", cssComMarcaDagua)
            //        .Replace("{PageHeader}", PageHeader)
            //        .Replace("{corDePagina}", corDePagina)
            //        .Replace("{alturaPage}", "max-height: 1035px; height: 1035px;")
            //        .Replace("{thead}", "")
            //        .Replace("{tbodyitens}", "")
            //        .Replace("{tableResumo}", PageResumo)
            //        .Replace("{pagina}", pagina.ToString())
            //        .Replace("{totalPagina}", totalPagina.ToString())
            //        .Replace("{dataGeracao}", dataGeracao);
            //}

            string layoutComMarcaDagua = carregaLayout.layout_3
                .Replace("{PageTitle}", "Pontuação do Questionário")
                .Replace("{PageHead}", "<style type=\"text/css\">" + PageHead + "</style>")
                .Replace("{EstiloMarcaDagua}", cssComMarcaDagua);
            string RelatorioCompleto = layoutComMarcaDagua.Replace("{PageContent}", PageContent);
            return RelatorioCompleto;
        }

        public ActionResult abrirPdfGerado()
        {
            string htmlContent = GestaoViewModel.Relatorio.ToString();
            string usr_nome = GestaoViewModel.usr_nome;


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
                    GestaoViewModel.mov_ano,
                    GestaoViewModel.mov_numero,
                    GestaoViewModel.plc_sequencial = 0,
                    pdfBytes,
                    GestaoViewModel.plc_dt_inclusao,
                    GestaoViewModel.plc_dt_cancelamento,
                    GestaoViewModel.plc_cd_usuario_gsi_cancelamento = 0,
                    GestaoViewModel.sit_codigo,
                    GestaoViewModel.pct_movimento,
                    GestaoViewModel.pct_situacao
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
                Response.AddHeader("Content-Disposition", "inline; filename=SIGEVENTOS - " + GestaoViewModel.usr_nome + " - Pontuação - Questionário.pdf");

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

                GestaoViewModel.Relatorio = geraHtmlPdf(usr_cpf, eve_num_evento, que_num_questionario, dataGeracao);

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
            List<object> eventos = new List<object>();
            bool sucesso = false;
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

                eventosDtos = _eventosBusiness.GetEventos();
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

                    if (eventosDtos != null && eventosDtos.Count > 0)
                    {

                        foreach (var item in eventosDtos)
                        {

                            #region trazemos a pontuação individualmente para cada usuário, evento e questionário
                            QuestaoComRespostaDto usuarioPonto = _questaoBussines.GetUsuarioQuestionarioPontuacaoPorCpf(eve_num_evento, que_num_questionario, usr_cpf).FirstOrDefault();
                            decimal pontuacao = (usuarioPonto != null) ? usuarioPonto.pontuacao : 0;
                            // decimal pontuacao = _questaoBussines.ObterQuestoesComRespostasPontos__deprecated(item.usr_cpf, item.eve_num_evento, item.que_num_questionario);
                            #endregion
                            eventos.Add(new
                            {
                                eve_num_evento = item.eve_num_evento,
                                eve_nome = item.eve_nome,
                                eve_descricao = item.eve_descricao,
                                eve_local = item.eve_local,
                                eve_municipio = item.eve_municipio,
                                eve_dt_inicio = item.eve_dt_inicio.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture) ?? string.Empty,
                                eve_dt_fim = item.eve_dt_fim?.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture) ?? string.Empty,
                                eve_dt_inclusao = item.eve_dt_inclusao.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture) ?? string.Empty,
                                eve_situacao = item.eve_situacao
                            });
                        }
                        sucesso = true;

                    }
                    else
                    {

                    }
                    return Json(new
                    {
                        sucesso = sucesso,
                        msg = "",
                        lista = lista,
                        eventos = eventos
                    });
                }
                else
                {
                    return Json(new
                    {
                        sucesso = sucesso,
                        msg = "Nenhum evento encontrado.",
                        lista = lista,
                        eventos = eventos
                    });
                }
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    sucesso = sucesso,
                    msg = "ERRO:" + ex.Message,
                    lista = lista,
                    eventos = eventos
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


    }
}