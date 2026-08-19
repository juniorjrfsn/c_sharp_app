using Microsoft.Ajax.Utilities;
using SGI.Framework.MVC.Architecture.Controller;
using SIGEVENTOS.Business;
using SIGEVENTOS.DTO.DTOS;
using SIGEVENTOS.ModelData.Database.Entity;
 
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Runtime.Remoting.Contexts;
using System.Security.Cryptography;
using System.Security.Policy;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Helpers;
using System.Web.Mvc;


namespace SIGEVENTOSMVC.Controllers
{
    public class QuestionarioController : GSIController
    {
 
        private readonly QuestaoBusiness _questaoBussines;
        private readonly EventosBusiness _eventosBusiness;
        private readonly UsuarioBusiness _usuarioBusiness;
        
        public QuestionarioController() : base(false, false)
        {
            // Aqui você instancia o contexto e passa para o repository
            // var context = new SIGEVENTOS.ModelData.Database.Entity.SigEventosContext();
            // Instancia a camada de negócio, que internamente usa o repository

           _questaoBussines = new QuestaoBusiness();
           _eventosBusiness = new EventosBusiness();
           _usuarioBusiness = new UsuarioBusiness();
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
                decimal que_nota_minima = (parametros.ContainsKey("que_nota_minima") && parametros["que_nota_minima"] != null) ? decimal.Parse(parametros["que_nota_minima"].ToString(), CultureInfo.InvariantCulture) : 0m; // O sufixo 'm' já define o valor diretamente como decimal, sem precisar de Parse("0")


                ViewBag.eve_num_evento = eve_num_evento;
                ViewBag.que_num_questionario = que_num_questionario;
                ViewBag.que_nota_minima = que_nota_minima;


                return View("Index");
            }
            catch (Exception ex)
            {
                return View("Index");
            }
        }

        [HttpGet]
        public ActionResult SalvarUsuario()
        {
            return RedirectToAction("Index", "Home");
        }


        [HttpPost]
        public ActionResult SalvarUsuario(FormCollection form)
        {
            try
            {
                Dictionary<string, string> parametros = new Dictionary<string, string>();
                foreach (var texto in Request.Params.AllKeys)
                {
                    parametros.Add(texto, Request[texto]);
                }

                
                int usr_num_usuario = (String.IsNullOrEmpty(parametros["usr_num_usuario"])) ? 0 : Convert.ToInt32(parametros["usr_num_usuario"]);
                int eve_num_evento = (String.IsNullOrEmpty(parametros["eve_num_evento"])) ? 0 : Convert.ToInt32(parametros["eve_num_evento"]);
                int que_num_questionario = (String.IsNullOrEmpty(parametros["que_num_questionario"])) ? 0 : Convert.ToInt32(parametros["que_num_questionario"]);
                decimal que_nota_minima = (parametros.ContainsKey("que_nota_minima") && parametros["que_nota_minima"] != null) ? decimal.Parse(parametros["que_nota_minima"].ToString(), CultureInfo.InvariantCulture) : 0m; // O sufixo 'm' já define o valor diretamente como decimal, sem precisar de Parse("0")

                ViewBag.eve_num_evento = eve_num_evento;
                ViewBag.que_num_questionario = que_num_questionario;
                ViewBag.que_nota_minima = que_nota_minima;

                string usr_cpf = parametros["usr_cpf"];
                string usr_nome = parametros["usr_nome"];
                string usr_email = parametros["usr_email"];
                string usr_telefone = parametros["usr_telefone"];
                string usr_instituicao = parametros["usr_instituicao"];
                string usr_municipio = parametros["usr_municipio"];

                ViewBag.usr_cpf = usr_cpf;
                ViewBag.usr_nome = usr_nome;
                ViewBag.usr_email = usr_email;
                ViewBag.usr_telefone = usr_telefone;
                ViewBag.usr_instituicao = usr_instituicao;
                ViewBag.usr_municipio = usr_municipio;


                ViewBag.nome = usr_nome.Split(' ')[0]; // split para pegar o primeiro nome, caso queira apenas o primeiro nome


                return View("Index");
            }
            catch (Exception ex)
            {
                return View("Index");
            }
        }

        [HttpPost]
        public JsonResult SalvarQuestionario()
        {
            decimal pontuacao = 0;
            int qtdRequestSaveButton = 1;
            try
            {
                Dictionary<string, string> parametros = new Dictionary<string, string>();
                foreach (var texto in Request.Params.AllKeys)
                {
                    parametros.Add(texto, Request[texto]);
                }

                string usr_cpf = (parametros["usr_cpf"] != null) ? parametros["usr_cpf"].ToString() : "0";
                short eve_num_evento = (String.IsNullOrEmpty(parametros["eve_num_evento"])) ? Convert.ToInt16(0) : Convert.ToInt16(parametros["eve_num_evento"]);
                short que_num_questionario = (String.IsNullOrEmpty(parametros["que_num_questionario"])) ? Convert.ToInt16(0) : Convert.ToInt16(parametros["que_num_questionario"]);
                decimal que_nota_minima = (parametros.ContainsKey("que_nota_minima") && parametros["que_nota_minima"] != null) ? decimal.Parse(parametros["que_nota_minima"].ToString(), CultureInfo.InvariantCulture) : 0m; // O sufixo 'm' já define o valor diretamente como decimal, sem precisar de Parse("0")


                // Regex para capturar chaves no formato: Quest[{qst_num_questao}][{qsr_num_resposta}][qsr_num_resposta]
                // Exemplo: Quest[2][1][qsr_num_resposta] -> qst_num_questao=2, qsr_num_resposta=1
                var regexQuestao = new Regex(@"^Quest\[(\d+)\]\[(\d+)\]\[qst_num_questao\]$");
                var regexResposta = new Regex(@"^Quest\[(\d+)\]\[(\d+)\]\[qsr_num_resposta\]$");
                List<object> listaQ = new List<object>();
                List<object> lista = new List<object>();

                List<eve_usuarios_respostas> eve_Usuarios_Resps = new List<eve_usuarios_respostas>();
                
                #region Cadastro de Usuário
                int usr_num_usuario = (String.IsNullOrEmpty(parametros["usr_num_usuario"])) ? 0 : Convert.ToInt32(parametros["usr_num_usuario"]);
                if (usr_num_usuario > 0)
                {
                }
                else
                {
                    UsuariosDto usuariosDto = _questaoBussines.VerificaUsuario(usr_cpf);
                    if(usuariosDto != null && usuariosDto.NumeroUsuario > 0)
                    {
                        usr_num_usuario = usuariosDto.NumeroUsuario;
                    }
                    else
                    {
                        // gravar
                        //string usr_cpf = parametros["usr_cpf"];
                        string usr_nome = parametros["usr_nome"];
                        string usr_email = parametros["usr_email"];
                        string usr_telefone = parametros["usr_telefone"];
                        string usr_instituicao = parametros["usr_instituicao"];
                        string usr_municipio = parametros["usr_municipio"];

                        usr_num_usuario = _usuarioBusiness.SalvarUsuario(usr_cpf, usr_nome, usr_email, usr_telefone, usr_instituicao, usr_municipio);
                    }  
                }
                #endregion


                List<UsuariosDto> listaUsuarios = _questaoBussines.VerificaUsuariorRespostas(usr_cpf, eve_num_evento, que_num_questionario);
                Boolean usuarioRespostaInexistente = true;
                if (listaUsuarios != null && listaUsuarios.Any())
                {
                    var contagemDeRespostas = listaUsuarios
                        .GroupBy(u => new
                        {
                            u.NumeroUsuario,
                            u.NomeUsuario,
                            u.CpfUsuario,
                            u.EmailUsuario,
                            u.TelefoneUsuario,
                            u.InstituicaoUsuario,
                            u.MunicipioUsuario,
                            u.SituacaoUsuario,
                            u.NumeroEvento,
                            u.NumeroQuestionario,
                            u.NumeroQuestao
                        })
                        .Where(g => g.Key.NumeroEvento == eve_num_evento && g.Key.NumeroQuestionario == que_num_questionario && g.Key.CpfUsuario == usr_cpf)
                        .Select(g => new
                        {
                            g.Key.NumeroUsuario,
                            g.Key.NomeUsuario,
                            g.Key.CpfUsuario,
                            g.Key.EmailUsuario,
                            g.Key.TelefoneUsuario,
                            g.Key.InstituicaoUsuario,
                            g.Key.MunicipioUsuario,
                            g.Key.SituacaoUsuario,
                            g.Key.NumeroEvento,
                            g.Key.NumeroQuestionario,
                            g.Key.NumeroQuestao,
                            NumeroRespostaQTDE = g.Count(x => x.NumeroResposta != null && x.NumeroResposta > 0)
                        })
                        .ToList();

                    // Verifica se algum grupo tem pelo menos 1 resposta
                    if (contagemDeRespostas.Any(c => c.NumeroRespostaQTDE > 0))
                    {
                        // sua lógica aqui
                        usuarioRespostaInexistente = false;
                        qtdRequestSaveButton++;
                    }
                }

                #region Cadastro das respostas
                if (usuarioRespostaInexistente)
                {
                    foreach (var texto in Request.Params.AllKeys)
                    {
                        var matchQ = regexQuestao.Match(texto);
                        if (matchQ.Success)
                        {
                            int qst_num_questao = int.Parse(matchQ.Groups[1].Value);
                            int qsr_num_resposta = int.Parse(matchQ.Groups[2].Value);

                            listaQ.Add(new
                            {
                                qst_num_questao = qst_num_questao,
                                qsr_num_resposta = qsr_num_resposta
                            });
                        }
                        
                        // grava as respostas
                        var match = regexResposta.Match(texto);
                        if (match.Success)
                        {
                            int qst_num_questao = Convert.ToInt16(match.Groups[1].Value);
                            short qsr_num_resposta = Convert.ToInt16(match.Groups[2].Value);

                            lista.Add(new
                            {
                                qst_num_questao = qst_num_questao,
                                qsr_num_resposta = qsr_num_resposta
                            });

                            eve_usuarios_respostas _Usuarios_Respostas = new eve_usuarios_respostas
                            {
                                usr_num_usuario = usr_num_usuario,
                                eve_num_evento = eve_num_evento,
                                que_num_questionario = que_num_questionario,
                                qst_num_questao = qst_num_questao,
                                qsr_num_resposta = qsr_num_resposta,
                                ure_situacao = "A"
                            };
                            eve_Usuarios_Resps.Add(_Usuarios_Respostas);

                        }
                    }
                    if (eve_Usuarios_Resps.Count > 0)
                    {
                        // gravar respostas
                        _questaoBussines.GravarQuestionarioUsuario(eve_Usuarios_Resps);
                    }
                }
                #endregion

                #region trazemos a pontuação individualmente para cada usuário, evento e questionário
                QuestaoComRespostaDto  usuarioPonto  = _questaoBussines.GetUsuarioQuestionarioPontuacaoPorCpf(eve_num_evento, que_num_questionario, usr_cpf).FirstOrDefault();
                pontuacao = (usuarioPonto != null) ? usuarioPonto.pontuacao : 0;
                // pontuacao = _questaoBussines.ObterQuestoesComRespostasPontos__deprecated(usr_cpf, eve_num_evento, que_num_questionario);
                #endregion

                List<EventosDto> eventosDtos = _eventosBusiness.GetEventosQuestionario(eve_num_evento, que_num_questionario);

                decimal ure_nota_minima = eventosDtos?.FirstOrDefault()?.que_nota_minima ?? 0;
                decimal ure_nota_resultado = pontuacao;

                List<UsuariosDto> usuariosDtos = _usuarioBusiness.VerificausuarioResultado(usr_num_usuario, eve_num_evento, que_num_questionario);

                if (usuariosDtos != null && usuariosDtos.Count > 0)
                {
                }
                else
                {
                    int usr_num_usuario_resp = _usuarioBusiness.SalvarUsuariosResultados(
                      usr_num_usuario, eve_num_evento, que_num_questionario, ure_nota_minima, ure_nota_resultado, DateTime.Now, "A"
                    );
                }
                
                var lstQ = listaQ;
                return Json(new
                {
                    sucesso = true,
                    msg = "",
                    lista = lista,
                    pontuacao = pontuacao,
                    qtdRequestSaveButton= qtdRequestSaveButton
                });
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    sucesso = false,
                    msg = "ERRO:" + ex.Message,
                    lista = new List<object>(),
                    pontuacao = pontuacao,
                    qtdRequestSaveButton = qtdRequestSaveButton
                });
            }
        }




        [HttpPost]
        public JsonResult ObterQuestionario()
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

                //#region Captura de dados de entrada do filtro
                //string mov_ano = "";   // parametros["filtro_mov_ano"].ToString();
                //Int32 mov_numero = 0;    // (String.IsNullOrEmpty(parametros["filtro_mov_numero"].ToString())) ? Convert.ToInt32("0") : Convert.ToInt32(parametros["filtro_mov_numero"].ToString());
                //string mov_cpf = parametros["filtro_mov_cpf"].ToString().Replace("-", "").Replace(".", "");
                //Int32 selectTake = (String.IsNullOrEmpty(parametros["selectTake"].ToString())) ? Convert.ToInt32("0", new CultureInfo("pt-BR")) : Convert.ToInt32(parametros["selectTake"].ToString().Replace("_", ""), new CultureInfo("pt-BR"));
                //string mov_nome_completo = parametros["filtro_mov_nome_completo"].ToString();
                //decimal mov_matricula = (String.IsNullOrEmpty(parametros["filtro_mov_matricula"].ToString())) ? Convert.ToDecimal("0", new CultureInfo("pt-BR")) : Convert.ToDecimal(parametros["filtro_mov_matricula"].ToString().Replace("_", ""), new CultureInfo("pt-BR"));
                //decimal mov_precatorio_num_processo_judicial = (String.IsNullOrEmpty(parametros["filtro_mov_precatorio_num_processo_judicial"].ToString())) ? Convert.ToDecimal("0", new CultureInfo("pt-BR")) : Convert.ToDecimal(parametros["filtro_mov_precatorio_num_processo_judicial"].ToString().Replace("-", "").Replace(".", ""), new CultureInfo("pt-BR"));
                //decimal mov_precatorio_nup = (String.IsNullOrEmpty(parametros["filtro_mov_precatorio_nup"].ToString())) ? Convert.ToDecimal("0", new CultureInfo("pt-BR")) : Convert.ToDecimal(parametros["filtro_mov_precatorio_nup"].ToString().Replace("-", "").Replace(".", ""), new CultureInfo("pt-BR"));
                //Int16 sit_codigo = Convert.ToInt16("0");
                //Int16 pod_codigo = Convert.ToInt16("0");
                //foreach (KeyValuePair<string, string> kvp in parametros)
                //{
                //    if (kvp.Key == "filtro_sit_codigo")
                //    {
                //        sit_codigo = ((String.IsNullOrEmpty(parametros["filtro_sit_codigo"].ToString()) || kvp.Value.ToString() == "") ? Convert.ToInt16("0") : Convert.ToInt16(kvp.Value.ToString()));
                //    }
                //    if (kvp.Key == "filtro_pod_codigo")
                //    {
                //        pod_codigo = ((String.IsNullOrEmpty(parametros["filtro_pod_codigo"].ToString()) || kvp.Value.ToString() == "") ? Convert.ToInt16("0") : Convert.ToInt16(kvp.Value.ToString()));
                //    }
                //}
                //#endregion

                //// Int16 mov_tp_vinculo     = (!String.IsNullOrEmpty(parametros["filtro_vinculo"].ToString()) && parametros["filtro_vinculo"].ToString() == "ativo")? Convert.ToInt16("1") : Convert.ToInt16("2");
                //string _vinculo_ = parametros["filtro_vinculo"].ToString();
                //Int16 mov_tp_vinculo = Convert.ToInt16("0");

                 
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


                List<QuestaoComRespostaDto> questaoComRespostaDtos = _questaoBussines.ObterQuestoesComRespostas(usr_cpf, eve_num_evento, que_num_questionario);

                #region Traz a pontuação mesmo que já tenha respondido
                QuestaoComRespostaDto usuarioPonto = _questaoBussines.GetUsuarioQuestionarioPontuacaoPorCpf(eve_num_evento, que_num_questionario, usr_cpf).FirstOrDefault();
                decimal pontuacao = (usuarioPonto != null) ? usuarioPonto.pontuacao : 0;
                #endregion

                //decimal pontuacao = _questaoBussines.ObterQuestoesComRespostasPontos__deprecated(usr_cpf, eve_num_evento, que_num_questionario);

                List<object> lista = new List<object>();

                if (questaoComRespostaDtos != null && questaoComRespostaDtos.Count > 0)
                {
                    foreach (var item in questaoComRespostaDtos)
                    {
                        lista.Add(new
                        {
                            usr_num_usuario = item.NumeroUsuario, // Numero do usuário caso tenha respondido alguma questão

                            resp_usr_num_usuario = item.RespNumeroUsuario, // Numero do usuário caso tenha respondido a questão
                            resp_qsr_num_resposta = item.RespNumeroRespostaUsuario, // Numero da resposta caso tenha respondido a questão

                            eve_num_evento = item.NumeroEvento,
                            que_num_questionario = item.NumeroQuestionario,

                            qst_num_questao = item.NumeroQuestao,
                            qst_enunciado = item.EnunciadoQuestao,
                            qst_situacao = item.SituacaoQuestao,
                            qsr_num_resposta = item.NumeroResposta,
                            qsr_enunciado = item.EnunciadoResposta,
                            qsr_e_correta = item.Correta,
                            qsr_situacao = item.SituacaoResposta,
                            Ponto = item.Ponto
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
    }
}