using Newtonsoft.Json.Linq;
using SGI.Framework.MVC.Architecture.Controller;
using RHFP.Business;
using RHFP.Business.Exceptions;
using RHFP.DTO.DTOS;
using RHFP.ModelData.Database.OracleProvider;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Mvc;
using System.Xml.Linq;
 

namespace RHFPMVC.Controllers
{
    public class CadastroController : GSIController
    {
        private readonly OracleHelper _oracleHelper;
        private readonly OracleBusiness _oracleBusiness;
        private readonly UsuarioBusiness _usuarioBusiness;
        private readonly QuestaoBusiness _questaoBussines;
        public CadastroController() : base(false, false)
        {
            // Instancia o helper e a camada de negócio para Oracle
            _oracleHelper = new OracleHelper(); // já lê do App.config do ModelData
            _oracleBusiness = new OracleBusiness();

            // Instancia a camada de negócio para usuários
            _usuarioBusiness = new UsuarioBusiness();
            _questaoBussines = new QuestaoBusiness();
        }

        // GET: Cadastro
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

                if (eve_num_evento <= 0 || que_num_questionario <= 0)
                {
                    return RedirectToAction("Index", "Home");
                }

                return View("Index");
            }
            catch (Exception ex)
            {
                return View("Index");
            }
        }
        
        [HttpGet]
        public ActionResult IniciarCadastro()
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

                if (eve_num_evento <= 0 || que_num_questionario <= 0)
                {
                    return RedirectToAction("Index", "Home");
                }

                return View("Index");
            }
            catch (Exception ex)
            {
                return View("Index");
            } 
        }

        [HttpPost]
        public ActionResult IniciarCadastro(FormCollection form)
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
                
                if (eve_num_evento > 0 && que_num_questionario > 0)
                { 
                }
                else
                {
                    return RedirectToAction("Index", "Home");
                }

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

        [HttpPost]
        public JsonResult GetDadosUsuario()
        {
            try
            {
                decimal pontuacao = 0;
                Dictionary<string, string> parametros = new Dictionary<string, string>();
                foreach (var texto in Request.Params.AllKeys)
                {
                    parametros.Add(texto, Request[texto]);
                }
          
                string usr_cpf = (parametros["usr_cpf"] != null) ? parametros["usr_cpf"].ToString() : "0";
                short eve_num_evento = (parametros["eve_num_evento"] != null) ? short.Parse(parametros["eve_num_evento"]) : short.Parse("0");
                short que_num_questionario = (parametros["que_num_questionario"] != null) ? short.Parse(parametros["que_num_questionario"]) : short.Parse("0");
                decimal que_nota_minima = (parametros.ContainsKey("que_nota_minima") && parametros["que_nota_minima"] != null) ? decimal.Parse(parametros["que_nota_minima"].ToString(), CultureInfo.InvariantCulture) : 0m; // O sufixo 'm' já define o valor diretamente como decimal, sem precisar de Parse("0")
                
                List<object> listaQ = new List<object>();
                List<object> lista = new List<object>();

                if (!string.IsNullOrEmpty(usr_cpf))
                {
                    // Chama o método da Business (que internamente chama a Repository)
                    List<UsuariosDto> usuario1 = _usuarioBusiness.ObterUsuarios(usr_cpf, eve_num_evento, que_num_questionario);

                    if (usuario1 != null && usuario1.Count > 0)
                    {
                        var usuario = new Dictionary<string, string>();
                          
                        usuario.Add("usr_num_usuario", ((int?)usuario1[0].NumeroUsuario ?? 0).ToString());
                        usuario.Add("usr_cpf", usuario1[0].CpfUsuario ?? "");
                        usuario.Add("usr_nome", usuario1[0].NomeUsuario ?? "");
                        usuario.Add("usr_telefone", usuario1[0].TelefoneUsuario ?? "");
                        var municipio = usuario1[0].MunicipioUsuario ?? "";
                        var partesUF = (municipio.Contains(" - "))
                                ? municipio.Split(new[] { " - " }, StringSplitOptions.None) 
                                : ((municipio.Length == 2) ? new string[] { "", municipio } : new string[] { municipio, "" });
                        usuario.Add("CID", usuario1[0].MunicipioUsuario ?? "");
                        usuario.Add("UF_SIGLA_RESIDEN", partesUF.Length > 1 ? partesUF[1] : ""); // Formato esperado: "Cidade - UF"
                        usuario.Add("CHAPA","0");
                        usuario.Add("EMP_COD", "0");
                        usuario.Add("usr_instituicao", usuario1[0].InstituicaoUsuario ?? "");
                        usuario.Add("usr_email", usuario1[0].EmailUsuario ?? "");
                        usuario.Add("qtde_resp", ((int?)usuario1[0].QtdeResp ?? 0).ToString());
                        
                        #region Após o Cadastro trazemos a pontuação
                        QuestaoComRespostaDto usuarioPonto = _questaoBussines.GetUsuarioQuestionarioPontuacaoPorCpf(eve_num_evento, que_num_questionario, usr_cpf).FirstOrDefault();
                        pontuacao = (usuarioPonto != null) ? usuarioPonto.pontuacao : 0;
                        // pontuacao = _questaoBussines.ObterQuestoesComRespostasPontos__deprecated(usr_cpf, eve_num_evento, que_num_questionario);
                        #endregion

                        return Json(new
                        {
                            usuario = usuario,
                            sucesso = true,
                            msg = "Dados do usuário encontrados.",
                            lista = new List<object>(),
                            debug_eve = eve_num_evento,
                            debug_que = que_num_questionario,
                            pontuacao = pontuacao
                        });
                    }
                    else
                    {
                        Dictionary<string, string> usuarioOracle = _oracleBusiness.ObterDadosUsuario(usr_cpf);

                        if (usuarioOracle != null && usuarioOracle.Count > 0 && usuarioOracle.ContainsKey("usr_nome"))
                        {
                            return Json(new
                            {
                                usuario = usuarioOracle,
                                sucesso = true,
                                msg = "Dados do usuário encontrados.",
                                lista = new List<object>(),
                                pontuacao = pontuacao
                            });
                        }
                        else
                        {
                            return Json(new
                            {
                                usuario = usuarioOracle,
                                sucesso = false,
                                tipoErro = "validacao",
                                msg = "Dados do usuário não encontrados.",
                                lista = new List<object>(),
                                pontuacao = pontuacao
                            });
                        }
                    }

                
                }
                else
                {
                    var lstQ = listaQ;
                    return Json(new
                    {
                        usuario = new Dictionary<string, string>(),
                        sucesso = false,
                        tipoErro = "validacao",
                        msg = "CPF é obrigatório.",
                        lista = lista,
                    });
                }
                 
            }
            catch (BusinessValidationException vex)
            {
                // Erro de regra de negócio/validação
                return Json(new
                {
                    usuario = new Dictionary<string, string>(),
                    sucesso = false,
                    tipoErro = "validacao",
                    msg = vex.Message
                });
            }
            catch (Exception ex) // Erros inesperados
            {
                return Json(new
                {
                    usuario = new Dictionary<string, string>(),
                    sucesso = false,
                    tipoErro = "sistema",
                    msg = "ERRO: " + ex.Message,
                    lista = new List<object>(),
                });
            }
        }


        [HttpPost]
        public JsonResult GetInstituicoes()
        {
            try
            {
                decimal pontuacao = 0;
                Dictionary<string, string> parametros = new Dictionary<string, string>();
                foreach (var texto in Request.Params.AllKeys)
                {
                    parametros.Add(texto, Request[texto]);
                }

                string usr_cpf = (parametros.ContainsKey("usr_cpf") && parametros["usr_cpf"] != null) ? parametros["usr_cpf"].ToString() : "0";
                short eve_num_evento = (parametros.ContainsKey("eve_num_evento") && parametros["eve_num_evento"] != null) ? short.Parse(parametros["eve_num_evento"]) : short.Parse("0");
                short que_num_questionario = (parametros.ContainsKey("que_num_questionario") && parametros["que_num_questionario"] != null) ? short.Parse(parametros["que_num_questionario"]) : short.Parse("0");
                decimal que_nota_minima = (parametros.ContainsKey("que_nota_minima") && parametros["que_nota_minima"] != null) ? decimal.Parse(parametros["que_nota_minima"].ToString(), CultureInfo.InvariantCulture) : 0m; // O sufixo 'm' já define o valor diretamente como decimal, sem precisar de Parse("0")

                List<object> listaQ = new List<object>();
                List<object> lista = new List<object>();
                
                List<Dictionary<string, string>> instituicoes = _oracleBusiness.GetInstituicoes();

                if (instituicoes != null && instituicoes.Count > 0 )
                {
                    return Json(new
                    {
                        instituicoes = instituicoes,
                        sucesso = true,
                        msg = "Instituições encontradas.",
                        lista = new List<object>(),
                        pontuacao = pontuacao
                    });
                }
                else
                {
                    return Json(new
                    {
                        instituicoes = new List<Dictionary<string, string>>(),
                        sucesso = false,
                        tipoErro = "validacao",
                        msg = "Instituições não encontradas."
                    });
                }
            }
            catch (BusinessValidationException vex)
            {
                // Erro de regra de negócio/validação
                return Json(new
                {
                    instituicoes = new List<Dictionary<string, string>>(),
                    sucesso = false,
                    tipoErro = "validacao",
                    msg = vex.Message
                });
            }
            catch (Exception ex) // Erros inesperados
            {
                return Json(new
                {
                    instituicoes = new List<Dictionary<string, string>>(),
                    sucesso = false,
                    tipoErro = "sistema",
                    msg = "ERRO: " + ex.Message,
                    lista = new List<object>(),
                });
            }
        }



        [HttpPost]
        public JsonResult SalvarUsuario()
        {
            try
            {
                Dictionary<string, string> parametros = new Dictionary<string, string>();
                foreach (var texto in Request.Params.AllKeys)
                {
                    parametros.Add(texto, Request[texto]);
                }
                 
                List<object> listaQ = new List<object>();
                List<object> lista = new List<object>();
 

                var lstQ = listaQ;
                return Json(new
                {
                    sucesso = true,
                    msg = "",
                    lista = lista,
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    sucesso = false,
                    msg = "ERRO:" + ex.Message,
                    lista = new List<object>(),
                }, JsonRequestBehavior.AllowGet);
            }
        }

    }
}