using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using System.Xml.Linq;
using SGI.Framework.Architecture.Authentication;
using SGI.Framework.Architecture.Configuration;
using SGI.Framework.MVC.Architecture.Report;
using SGI.Framework.MVC.GsiWebService;
using SGI.Framework.MVC.SgeWebService;
using static System.Net.Mime.MediaTypeNames;

namespace SGI.Framework.MVC.Architecture.Controller
{
    public abstract class GSIController : System.Web.Mvc.Controller
    {
        public enum ETipoMensagem
        {
            Sucesso,
            Erro
        }

        protected List<string> mensagens = new List<string>();

        private bool deveLogar;

        private bool devePermissionar;

        public ReadOnlyCollection<string> Mensagens => mensagens.AsReadOnly();

        protected bool DeveLogar
        {
            get
            {
                return deveLogar;
            }
            set
            {
                deveLogar = value;
            }
        }

        protected bool DevePermissionar
        {
            get
            {
                return devePermissionar;
            }
            set
            {
                devePermissionar = value;
            }
        }

        protected bool EstaLogado => UsuarioLogado != null;

        protected Usuario UsuarioLogado
        {
            get
            {
                if (base.Session["USUARIOLOGADO"] != null)
                {
                    return base.Session["USUARIOLOGADO"] as Usuario;
                }

                return null;
            }
        }

        protected int UltimoMenuSelecionado
        {
            get
            {
                return Convert.ToInt32(base.Session["ULTIMOMENUSELECIONADO"]);
            }
            set
            {
                base.Session["ULTIMOMENUSELECIONADO"] = value;
            }
        }

        private bool EhPermissionado
        {
            get
            {
                string[] rota = base.Request.Url.AbsolutePath.Split('/');
                if (rota.Length <= 2)
                {
                    return UsuarioLogado.ObterPermissoes().Any((string li) => li.Equals($"/{rota[1]}"));
                }

                return UsuarioLogado.ObterPermissoes().Any((string li) => li.Equals($"/{rota[1]}/{rota[2]}"));
            }
        }

        protected GSIController()
            : this(deveLogar: true)
        {
        }

        protected GSIController(bool deveLogar)
            : this(deveLogar, deveLogar)
        {
        }

        protected GSIController(bool deveLogar, bool devePermissionar)
        {
            this.deveLogar = deveLogar;
            this.devePermissionar = devePermissionar;
        }

        protected void Login(int id, string nome, string matricula, int geoEstruturaID, int grupoID, List<No> arvoreMenu, List<string> permissoes, List<EstruturaOrganizacional> lotacao)
        {
            Usuario usuario = new Usuario();
            usuario.Id = id;
            usuario.Nome = nome;
            usuario.Matricula = matricula;
            usuario.RegistrarArvoreMenu(arvoreMenu);
            usuario.RegistrarPermissoes(permissoes);
            usuario.GeoEstruturaID = geoEstruturaID;
            usuario.Lotacao = lotacao;
            usuario.GrupoID = grupoID;
            base.Session["USUARIOLOGADO"] = usuario;
        }

        protected void Login(int id, string nome, string matricula, int geoEstruturaID, List<No> arvoreMenu, List<string> permissoes, List<EstruturaOrganizacional> lotacao)
        {
            Usuario usuario = new Usuario();
            usuario.Id = id;
            usuario.Nome = nome;
            usuario.Matricula = matricula;
            usuario.RegistrarArvoreMenu(arvoreMenu);
            usuario.RegistrarPermissoes(permissoes);
            usuario.GeoEstruturaID = geoEstruturaID;
            usuario.Lotacao = lotacao;
            base.Session["USUARIOLOGADO"] = usuario;
        }

        protected void Login(int id, string nome, string matricula, int geoEstruturaID, string nomeEstrutura, string CodigoHierarquia, int grupoID, string loginAD, string nomeDominio, string email, string telefoneResidencial, string telefoneCelular, string telefoneComercial, string cpf, DateTime dataNascimento, string endereco, string bairro, string cidade, List<No> arvoreMenu, List<string> permissoes, List<EstruturaOrganizacional> lotacao)
        {
            Usuario usuario = new Usuario();
            usuario.Id = id;
            usuario.Nome = nome;
            usuario.Matricula = matricula;
            usuario.RegistrarArvoreMenu(arvoreMenu);
            usuario.RegistrarPermissoes(permissoes);
            usuario.GeoEstruturaID = geoEstruturaID;
            usuario.NomeEstrutura = nomeEstrutura;
            usuario.CodigoHierarquia = CodigoHierarquia;
            usuario.Lotacao = lotacao;
            usuario.GrupoID = grupoID;
            usuario.LoginAD = loginAD;
            usuario.NomeDominio = nomeDominio;
            usuario.Email = email;
            usuario.TelefoneResidencial = telefoneResidencial;
            usuario.TelefoneCelular = telefoneCelular;
            usuario.TelefoneComercial = telefoneComercial;
            usuario.CPF = cpf;
            usuario.DataNascimento = dataNascimento;
            usuario.Endereco = endereco;
            usuario.Bairro = bairro;
            usuario.Cidade = cidade;
            base.Session["USUARIOLOGADO"] = usuario;
        }

        public ActionResult AcessoNegado()
        {
            return View();
        }

        public ActionResult SessaoExpirada()
        {
            return View();
        }

        public ActionResult Impressao()
        {
            ReportResult reportResult = new ReportResult();
            reportResult.Relatorio = (EmissorDeRelatorio)base.Session["RELATORIO"];
            return reportResult;
        }

        protected override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            base.OnActionExecuting(filterContext);

            // Define o tempo de expiração 
            Session.Timeout = 90;

            // Verifica e ajusta abaIdx na sessão
            if (filterContext.HttpContext.Request.QueryString["abaIdx"] != null)
            {
                base.Session["AbaCorrente"] = filterContext.HttpContext.Request.QueryString["abaIdx"];
            }

            // Realiza login automático em ambiente de desenvolvimento se não estiver logado
            if (!EstaLogado && DeveLogar && Configuracao.AppAmbiente.Equals("desenvolvimento"))
            {
                try
                {
                    EfetuarLoginDesenvolvimento();
                }
                catch (Exception ex)
                {
                    System.Diagnostics.Trace.WriteLine("Erro ao efetuar login de desenvolvimento automático: " + ex.Message);
                }
            }

            // Verificação de login e redirecionamento
            if (!EstaLogado && DeveLogar)
            {
                string ta = filterContext.HttpContext.Request.QueryString["ta"];
                string h = filterContext.HttpContext.Request.QueryString["h"];
                string currentAction = filterContext.RouteData.Values["action"]?.ToString();
                string currentController = filterContext.RouteData.Values["controller"]?.ToString();

                bool isLocalRequest = filterContext.HttpContext.Request.IsLocal;
                string requestedPath = filterContext.HttpContext.Request.Url?.AbsolutePath ?? string.Empty;
                bool isPublicIndex = (string.Equals(currentAction, "Index", StringComparison.OrdinalIgnoreCase)
                    && (string.Equals(currentController, "Home", StringComparison.OrdinalIgnoreCase)
                        || string.Equals(currentController, "Cadastro", StringComparison.OrdinalIgnoreCase)
                        || string.Equals(currentController, "Questionario", StringComparison.OrdinalIgnoreCase)))
                    || string.Equals(requestedPath, "/", StringComparison.OrdinalIgnoreCase)
                    || string.Equals(requestedPath, "/Home", StringComparison.OrdinalIgnoreCase)
                    || string.Equals(requestedPath, "/Cadastro", StringComparison.OrdinalIgnoreCase)
                    || string.Equals(requestedPath, "/Questionario", StringComparison.OrdinalIgnoreCase);

                if (isPublicIndex)
                {
                    return;
                }

                if ((!string.IsNullOrEmpty(ta) && !string.IsNullOrEmpty(h) &&
                     !string.Equals(currentAction, "AutenticarGSI", StringComparison.OrdinalIgnoreCase))
                    || (isLocalRequest && !string.Equals(currentAction, "AutenticarGSI", StringComparison.OrdinalIgnoreCase)))
                {
                    filterContext.Result = new RedirectToRouteResult(new RouteValueDictionary(new
                    {
                        controller = filterContext.RouteData.Values["controller"],
                        action = "AutenticarGSI",
                        ta,
                        h
                    }));
                }
                else
                {
                    filterContext.Result = new RedirectToRouteResult(new RouteValueDictionary(new
                    {
                        controller = "Login",
                        action = "SessaoExpirada"
                    }));
                }
            }
            else if (DevePermissionar && !EhPermissionado)
            {
                filterContext.Result = new RedirectToRouteResult(new RouteValueDictionary(new
                {
                    controller = "Login",
                    action = "AcessoNegado"
                }));
            }
            else
            {
                MontarMenuPrincipal();
            }
        }

        // Em algum ponto no código, geralmente na inicialização do aplicativo
        protected void Application_BeginRequest(Object source, EventArgs e)
        {
            // Se a sessão é nova e não existem cookies antigos, a sessão foi abandonada
            if (HttpContext.Session != null && HttpContext.Session.IsNewSession && HttpContext.Request.Cookies["ASP.NET_SessionId"] != null)
            {
                // Limpa e abandona a sessão
                Session.Clear();
                Session.Abandon();
            }
        }

        protected void EmitirMensagem(string mensagem)
        {
            EmitirMensagem(mensagem, ETipoMensagem.Sucesso);
        }

        protected void EmitirMensagem(string mensagem, ETipoMensagem tipo)
        {
            if (mensagem.Contains("span class"))
            {
                switch (tipo)
                {
                    case ETipoMensagem.Sucesso:
                        base.TempData["MensagemSucesso"] = mensagem;
                        break;
                    case ETipoMensagem.Erro:
                        base.TempData["MensagemErro"] = mensagem;
                        break;
                }

                return;
            }

            string empty = string.Empty;
            switch (tipo)
            {
                case ETipoMensagem.Sucesso:
                    empty += "<span class=\"ui-icon ui-icon-info\" style=\"float: left; margin-right: .3em;\"></span>";
                    empty = empty + "<strong>Sucesso: </strong>" + mensagem + "<br>";
                    base.TempData["MensagemSucesso"] = empty;
                    break;
                case ETipoMensagem.Erro:
                    empty += "<span class=\"ui-icon ui-icon-alert\" style=\"float: left; margin-right: .3em; \"></span>";
                    empty = empty + "<strong>Alerta: </strong>" + mensagem + "<br>";
                    base.TempData["MensagemErro"] = empty;
                    break;
            }
        }

        public void EmitirMensagem(ReadOnlyCollection<string> mensagens)
        {
            EmitirMensagem(mensagens, ETipoMensagem.Sucesso);
        }

        public void EmitirMensagem(ReadOnlyCollection<string> mensagens, ETipoMensagem tipo)
        {
            string text = string.Empty;
            int count = mensagens.Count;
            foreach (string mensagen in mensagens)
            {
                if (tipo.Equals(ETipoMensagem.Erro))
                {
                    text += "<span class=\"ui-icon ui-icon-alert\" style=\"float: left; margin-right: .3em; \"></span>";
                    text = text + "<strong>Alerta: </strong>" + mensagen + "<br>";
                }
                else if (tipo.Equals(ETipoMensagem.Sucesso))
                {
                    text += "<span class=\"ui-icon ui-icon-info\" style=\"float: left; margin-right: .3em;\"></span>";
                    text = text + "<strong>Sucesso: </strong>" + mensagen + "<br>";
                }
            }

            EmitirMensagem(text, tipo);
        }

        public virtual ActionResult Erro()
        {
            return View();
        }

        private void EfetuarLoginDesenvolvimento()
        {
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 |
                                                   SecurityProtocolType.Tls11 |
                                                   SecurityProtocolType.Tls;

            int codModuloGsi = Configuracao.CodModuloGsi;
            string usuarioGsi = Configuracao.UsuarioGsi;
            string senhaGsi = Configuracao.SenhaGsi;

            WSGSI wSGSI = new WSGSI();
            WSSGE wSSGE = new WSSGE();

            wSGSI.Url = wSGSI.Url.Replace("http://", "https://");
            wSSGE.Url = wSSGE.Url.Replace("http://", "https://");

            UsuarioAutenticacaoCompletoWS usuarioAutenticacaoCompletoWS = new UsuarioAutenticacaoCompletoWS();
            UsuarioWS usuarioWS = new UsuarioWS();

            usuarioAutenticacaoCompletoWS.UsuarioID = Configuracao.UsuarioIDDesenvolvimento;
            usuarioAutenticacaoCompletoWS.GrupoID = Configuracao.GrupoIDDesenvolvimento;
            usuarioAutenticacaoCompletoWS.EstruturaID = Configuracao.GeoEstruturaIDDesenvolvimento;
            usuarioWS = wSGSI.GSI_SelecionaUsuarioID_SO(usuarioAutenticacaoCompletoWS.UsuarioID, usuarioGsi, senhaGsi);
            EstruturaWS estruturaWS = wSSGE.SGE_SelecionaEstruturaID_SO(1, usuarioAutenticacaoCompletoWS.EstruturaID, usuarioGsi, senhaGsi);
            usuarioAutenticacaoCompletoWS.NomeEstrutura = estruturaWS.NomeEstrutura;
            EstruturaWS[] array = wSSGE.SGE_SelecionaEstruturaHierarquiaOrganogramaAcima_SO(1, estruturaWS.CodigoHierarquia, usuarioGsi, senhaGsi);
            usuarioAutenticacaoCompletoWS.CodigoHierarquia = estruturaWS.CodigoHierarquia;

            List<EstruturaOrganizacional> list = new List<EstruturaOrganizacional>();
            EstruturaWS[] array2 = array;
            foreach (EstruturaWS estruturaWS2 in array2)
            {
                EstruturaOrganizacional item = new EstruturaOrganizacional(estruturaWS2.EstruturaID, estruturaWS2.NomeEstrutura, estruturaWS2.Bairro, estruturaWS2.CEP, estruturaWS2.Cidade, estruturaWS2.Logradouro, estruturaWS2.RegistroEstruturaID, estruturaWS2.SiglaEstrutura, estruturaWS2.CodigoHierarquia);
                list.Add(item);
            }

            List<string> list2 = new List<string>();
            OperacaoWS[] source = wSGSI.GSI_SelecionaOperacoesGrupo_SO(usuarioAutenticacaoCompletoWS.UsuarioID, usuarioAutenticacaoCompletoWS.EstruturaID, usuarioAutenticacaoCompletoWS.GrupoID, usuarioGsi, senhaGsi);
            list2.AddRange(source.Select((OperacaoWS o) => o.NomeOperacao));
            MontarArvoreMenu(usuarioAutenticacaoCompletoWS.EstruturaID, wSGSI, usuarioWS, out var arvoreUsuario);
            Login(usuarioWS.UsuarioID, usuarioWS.NomeUsuario, usuarioWS.Matricula, usuarioAutenticacaoCompletoWS.EstruturaID, usuarioAutenticacaoCompletoWS.NomeEstrutura, usuarioAutenticacaoCompletoWS.CodigoHierarquia, usuarioAutenticacaoCompletoWS.GrupoID, usuarioWS.LoginAD, usuarioWS.NomeDominio, usuarioWS.Email, usuarioWS.TelefoneResidencial, usuarioWS.TelefoneCelular, usuarioWS.TelefoneComercial, usuarioWS.CPF, usuarioWS.DataNascimento, usuarioWS.Endereco, usuarioWS.Bairro, usuarioWS.Cidade, arvoreUsuario, list2, list);
        }

        public ActionResult AutenticarGSI(int? ta, string h)
        {
            // Configurar protocolos TLS
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 |
                                                   SecurityProtocolType.Tls11 |
                                                   SecurityProtocolType.Tls;

            base.Session["USUARIOLOGADO"] = null;
            int codModuloGsi = Configuracao.CodModuloGsi;
            string usuarioGsi = Configuracao.UsuarioGsi;
            string senhaGsi = Configuracao.SenhaGsi;
            string appAmbiente = Configuracao.AppAmbiente;
            UltimoMenuSelecionado = 0;

            WSGSI wSGSI = new WSGSI();
            WSSGE wSSGE = new WSSGE();

            wSGSI.Url = wSGSI.Url.Replace("http://", "https://");
            wSSGE.Url = wSSGE.Url.Replace("http://", "https://");

            UsuarioAutenticacaoCompletoWS usuarioAutenticacaoCompletoWS = new UsuarioAutenticacaoCompletoWS();
            UsuarioWS usuarioWS = new UsuarioWS();
            string absoluteUri = base.Request.Url.AbsoluteUri;
            EstruturaWS[] array;

            if (ta.HasValue && !string.IsNullOrEmpty(h))
            {
                int value = ta.Value;
                usuarioAutenticacaoCompletoWS = wSGSI.GSI_SelecionarUsuarioAutenticacaoCompleto_SO(value, h, usuarioGsi, senhaGsi);
                usuarioWS = wSGSI.GSI_SelecionaUsuarioID_SO(usuarioAutenticacaoCompletoWS.UsuarioID, usuarioGsi, senhaGsi);
                array = wSSGE.SGE_SelecionaEstruturaHierarquiaOrganogramaAcima_SO(1, usuarioAutenticacaoCompletoWS.CodigoHierarquia, usuarioGsi, senhaGsi);
                if (!absoluteUri.StartsWith("http://localhost") && appAmbiente == "desenvolvimento")
                {
                    EmitirMensagem("<span style=\"color:red;\">Verifique a propriedade de AppAmbiente no Web.config<br />A mesma está com conexões de desenvolvimento.</span>");
                }
            }
            else
            {
                if (!appAmbiente.Equals("desenvolvimento") && !Request.IsLocal)
                {
                    string requestedPath = Request.Url?.AbsolutePath ?? string.Empty;
                    bool isPublicPage = string.Equals(requestedPath, "/", StringComparison.OrdinalIgnoreCase)
                        || requestedPath.StartsWith("/Home", StringComparison.OrdinalIgnoreCase)
                        || requestedPath.StartsWith("/Cadastro", StringComparison.OrdinalIgnoreCase)
                        || requestedPath.StartsWith("/Questionario", StringComparison.OrdinalIgnoreCase);

                    if (isPublicPage)
                    {
                        if (string.Equals(requestedPath, "/", StringComparison.OrdinalIgnoreCase) || requestedPath.StartsWith("/Home", StringComparison.OrdinalIgnoreCase))
                        {
                            return RedirectToAction("Index", "Home");
                        } else if (requestedPath.StartsWith("/Cadastro", StringComparison.OrdinalIgnoreCase))
                        {
                            return RedirectToAction("Index", "Cadastro");
                        }
                        else if (requestedPath.StartsWith("/Questionario", StringComparison.OrdinalIgnoreCase))
                        {
                            return RedirectToAction("Index", "Questionario");
                        }
                    }
                    else
                    {
                        return RedirectToAction("SessaoExpirada", "Login");
                    }
                }

                usuarioAutenticacaoCompletoWS.UsuarioID = Configuracao.UsuarioIDDesenvolvimento;
                usuarioAutenticacaoCompletoWS.GrupoID = Configuracao.GrupoIDDesenvolvimento;
                usuarioAutenticacaoCompletoWS.EstruturaID = Configuracao.GeoEstruturaIDDesenvolvimento;
                usuarioWS = wSGSI.GSI_SelecionaUsuarioID_SO(usuarioAutenticacaoCompletoWS.UsuarioID, usuarioGsi, senhaGsi);
                EstruturaWS estruturaWS = wSSGE.SGE_SelecionaEstruturaID_SO(1, usuarioAutenticacaoCompletoWS.EstruturaID, usuarioGsi, senhaGsi);
                usuarioAutenticacaoCompletoWS.NomeEstrutura = estruturaWS.NomeEstrutura;
                array = wSSGE.SGE_SelecionaEstruturaHierarquiaOrganogramaAcima_SO(1, estruturaWS.CodigoHierarquia, usuarioGsi, senhaGsi);
                usuarioAutenticacaoCompletoWS.CodigoHierarquia = estruturaWS.CodigoHierarquia;

                if (!appAmbiente.Equals("desenvolvimento") && Request.IsLocal)
                {
                    EmitirMensagem("<span style=\"color:orange;\">Ambiente local detectado: autenticação GSI usando credenciais de desenvolvimento do Web.config.</span>");
                }
            }

            List<EstruturaOrganizacional> list = new List<EstruturaOrganizacional>();
            EstruturaWS[] array2 = array;
            foreach (EstruturaWS estruturaWS2 in array2)
            {
                EstruturaOrganizacional item = new EstruturaOrganizacional(estruturaWS2.EstruturaID, estruturaWS2.NomeEstrutura, estruturaWS2.Bairro, estruturaWS2.CEP, estruturaWS2.Cidade, estruturaWS2.Logradouro, estruturaWS2.RegistroEstruturaID, estruturaWS2.SiglaEstrutura, estruturaWS2.CodigoHierarquia);
                list.Add(item);
            }

            List<string> list2 = new List<string>();
            OperacaoWS[] source = wSGSI.GSI_SelecionaOperacoesGrupo_SO(usuarioAutenticacaoCompletoWS.UsuarioID, usuarioAutenticacaoCompletoWS.EstruturaID, usuarioAutenticacaoCompletoWS.GrupoID, usuarioGsi, senhaGsi);
            list2.AddRange(source.Select((OperacaoWS o) => o.NomeOperacao));
            MontarArvoreMenu(usuarioAutenticacaoCompletoWS.EstruturaID, wSGSI, usuarioWS, out var arvoreUsuario);
            Login(usuarioWS.UsuarioID, usuarioWS.NomeUsuario, usuarioWS.Matricula, usuarioAutenticacaoCompletoWS.EstruturaID, usuarioAutenticacaoCompletoWS.NomeEstrutura, usuarioAutenticacaoCompletoWS.CodigoHierarquia, usuarioAutenticacaoCompletoWS.GrupoID, usuarioWS.LoginAD, usuarioWS.NomeDominio, usuarioWS.Email, usuarioWS.TelefoneResidencial, usuarioWS.TelefoneCelular, usuarioWS.TelefoneComercial, usuarioWS.CPF, usuarioWS.DataNascimento, usuarioWS.Endereco, usuarioWS.Bairro, usuarioWS.Cidade, arvoreUsuario, list2, list);
            return RedirectToAction("Index", "Home");
        }







        private void MontarArvoreMenu(int codGeoEstrutura, WSGSI gsi, UsuarioWS usuario, out List<No> arvoreUsuario)
        {
            int codModuloGsi = Configuracao.CodModuloGsi;
            string usuarioGsi = Configuracao.UsuarioGsi;
            string senhaGsi = Configuracao.SenhaGsi;
            arvoreUsuario = new List<No>();
            XDocument doc = XDocument.Parse(gsi.GSI_SelecionaMenu(usuario.UsuarioID, codModuloGsi, codGeoEstrutura, usuarioGsi, senhaGsi));
            var list = (from mc in doc.Descendants(XName.Get("Menu"))
                        where mc.Attribute(XName.Get("MenuPai")).Value == "0"
                        select mc).ToList();
            foreach (XElement item in list)
            {
                No rootMenu = new No();
                string value = item.Attribute(XName.Get("MenuID")).Value;
                string value2 = item.Attribute(XName.Get("NomeMenu")).Value;
                string value3 = item.Attribute(XName.Get("NavigateURL")).Value;
                rootMenu.Nome = value2;
                rootMenu.Url = value3;
                rootMenu.MenuID = Convert.ToInt32(value);
                MontarArvoreSubMenu(value, doc, ref rootMenu);
                arvoreUsuario.Add(rootMenu);
            }
        }


        private void MontarArvoreSubMenu(string menuPai, XDocument menuCompleto, ref No rootMenu)
        {
            List<XElement> list = (from mc in ((XContainer)menuCompleto).Descendants(XName.Get("Menu"))
                                   where mc.Attribute(XName.Get("MenuPai")).Value.Equals(menuPai)
                                   select mc).ToList();
            foreach (XElement item in list)
            {
                No rootMenu2 = new No();
                string value = item.Attribute(XName.Get("MenuID")).Value;
                string value2 = item.Attribute(XName.Get("NomeMenu")).Value;
                string value3 = item.Attribute(XName.Get("NavigateURL")).Value;
                rootMenu2.Nome = value2;
                rootMenu2.Url = value3;
                rootMenu2.MenuID = Convert.ToInt32(value);
                rootMenu.AdicionarNo(rootMenu2);
                MontarArvoreSubMenu(value, menuCompleto, ref rootMenu2);
            }
        }

        public void MontarMenuPrincipal()
        {
            base.TempData["_SUBMENU_TB"] = null;
            base.TempData["_SUBMENU_TG"] = null;
            base.TempData["_SUBMENU_RELAT"] = null;
            base.TempData["CABECALHOPRINCIPAL"] = null;
            base.TempData["MENUPRINCIPAL"] = null;
            base.TempData["USUARIOPRINCIPAL"] = null;

            if (!EstaLogado)
            {
                return;
            }

            string[] array = base.Request.Url.AbsolutePath.Split('/');
            if (array.Length == 4 && array[1].Equals("Home") && array[2].Equals("Menu"))
            {
                int.TryParse(array[3], out var result);
                UltimoMenuSelecionado = result;
            }

            StringBuilder stringBuilder = new StringBuilder();
            stringBuilder.Append("<script type=\"text/javascript\">");
            stringBuilder.Append("function CarregarSubMenus(id, btnSelecionado) {");
            stringBuilder.Append("$.get(\"/Home/SubMenu\", { idMenu: id }, function (data) { $(\"#subMenu\").html(data); });}");
            stringBuilder.Append("</script>");
            int num = 1;

            StringBuilder _submenu_home = new StringBuilder();
            StringBuilder _submenu_cad = new StringBuilder();
            StringBuilder _submenu_quest= new StringBuilder();
            
            StringBuilder _submenu_tb = new StringBuilder();
            StringBuilder _submenu_tos = new StringBuilder();
            StringBuilder _submenu_precat = new StringBuilder();

            foreach (No item in UsuarioLogado.ObterArvoreMenu())
            {
                StringBuilder stringBuilder2 = new StringBuilder();
                stringBuilder2.Append("<div class=\"ui-button ui-widget ui-button-text-only ui-button-text\">");
                stringBuilder2.Append("<input id=\"btn" + num + "\"");
                stringBuilder2.Append(" type=\"button\"");
                stringBuilder2.Append(" onclick=\"javascript:CarregarSubMenus(" + item.MenuID + ", this);\" value=\"" + item.Nome + "\" />");
                stringBuilder2.Append("</div>");
                stringBuilder.Append(stringBuilder2.ToString());
                foreach (No item2 in item.ArvoreDeMenu)
                {

                    if (item.Nome == "Início")
                    {
                        string icone = (item2.Url == "/Home/Index") ? "<i class=\"fa-regular fa-house\"></i>" : "<i class=\"fa-solid fa-house-chimney\"></i>";
                        _submenu_home.Append("<li class=\"sidebar-item\" style=\"background:#ffffff;\">");
                        _submenu_home.Append("<a class=\"sidebar-link waves-effect waves-dark sidebar-link\" href=\"" + item2.Url + "\" >" + icone + "<span class=\"hide-menu\">" + item2.Nome + "</span></a>");
                        _submenu_home.Append("</li>");
                    }
                    
                    if (item.Nome == "Tabelas Básicas")
                    {
                        _submenu_tb.Append("<li class=\"sidebar-item\" style=\"background:#ffffff;\">");
                        _submenu_tb.Append("<a class=\"sidebar-link waves-effect waves-dark sidebar-link\" href=\"" + item2.Url + "\" ><i class=\"mdi mdi-table-edit\"></i><span class=\"hide-menu\">" + item2.Nome + "</span></a>");
                        _submenu_tb.Append("</li>");
                    }

                    if (item.Nome == "Tabelas de Gestão")
                    {
                        _submenu_tos.Append("<li class=\"sidebar-item\" style=\"background:#ffffff;\">");
                        _submenu_tos.Append("<a class=\"sidebar-link waves-effect waves-dark sidebar-link\" href=\"" + item2.Url + "\" ><i class=\"mdi mdi-table-large\"></i><span class=\"hide-menu\">" + item2.Nome + "</span></a>");
                        _submenu_tos.Append("</li>");
                    }

                    if (item.Nome == "Relatórios")
                    {
                        string icone = (item2.Url == "/Estatistica/Index") ? "<i class=\"mdi mdi-chart-areaspline\"></i>" : "<i class=\"mdi mdi-clipboard-text\"></i>";
                        _submenu_precat.Append("<li class=\"sidebar-item\" style=\"background:#ffffff;\">");
                        _submenu_precat.Append("<a class=\"sidebar-link waves-effect waves-dark sidebar-link\" href=\"" + item2.Url + "\" >" + icone + "<span class=\"hide-menu\">" + item2.Nome + "</span></a>");
                        _submenu_precat.Append("</li>");
                    }

                }
                num++;
            }
            base.TempData["_SUBMENU_TB"] = _submenu_tb.ToString();
            base.TempData["_SUBMENU_TG"] = _submenu_tos.ToString();
            base.TempData["_SUBMENU_RELAT"] = _submenu_precat.ToString();

            base.TempData["CABECALHOPRINCIPAL"] = UsuarioLogado.Lotacao.Select((EstruturaOrganizacional lo) => lo.Nome).ToList();
            base.TempData["MENUPRINCIPAL"] = stringBuilder.ToString();
            base.TempData["USUARIOPRINCIPAL"] = new string[4]
            {
            UsuarioLogado.Nome,
            UsuarioLogado.Nome.Split(' ')[0],
            UsuarioLogado.Matricula,
            UsuarioLogado.NomeEstrutura
            };
            if (Configuracao.AppAmbiente.Equals("desenvolvimento"))
            {
                base.TempData["AMBIENTEDEV"] = "Ambiente de Desenvolvimento";
            }
        }

        public string SubMenu(int idMenu)
        {
            if (Configuracao.TipoMenu == 3)
            {
                return MontarMenuParcial3Niveis(idMenu);
            }

            if (Configuracao.TipoMenu == 4)
            {
                return MontarMenuParcial4Niveis(idMenu);
            }

            return "<span style=\"color:red;\">Verifique a propriedade de TipoMenu no Web.config<br />A mesma deve estar configurada para 3 ou 4 níveis de menu.</span>";
        }

        private string MontarMenuParcial3Niveis(int MenuId)
        {
            if (EstaLogado)
            {
                int qtdeColuna = Configuracao.QtdeColuna;
                string text = "grid_" + Convert.ToString(Configuracao.TamanhoColuna) + " alpha";
                StringBuilder stringBuilder = new StringBuilder();
                foreach (No item in UsuarioLogado.ObterArvoreMenu())
                {
                    if (item.MenuID != MenuId)
                    {
                        continue;
                    }

                    stringBuilder.Append("<div class=\"grid_12 ui-widget ui-widget-content ui-corner-all unico\" style=\"width:923px;\">");
                    int num = 0;
                    foreach (No item2 in item.ArvoreDeMenu)
                    {
                        num++;
                        stringBuilder.Append("<div class=\"" + text + "\">");
                        stringBuilder.Append("<span class=\"submenu1\">" + item2.Nome + "</span>");
                        stringBuilder.Append("<ul>");
                        foreach (No item3 in item2.ArvoreDeMenu)
                        {
                            stringBuilder.Append("<li class=\"linknavigacao\">");
                            stringBuilder.Append("<div class=\"bullet\"></div>");
                            stringBuilder.Append("<a href=\"" + item3.Url + "\">" + item3.Nome + "</a>");
                            stringBuilder.Append("</li>");
                        }

                        stringBuilder.Append("</ul>");
                        stringBuilder.Append("</div>");
                        if (num == qtdeColuna)
                        {
                            stringBuilder.Append("<div class=\"clear\">");
                            stringBuilder.Append("</div>");
                        }
                    }

                    stringBuilder.Append("</div>");
                }

                return stringBuilder.ToString();
            }

            return string.Empty;
        }

        public string MontarMenuParcial4Niveis(int MenuId)
        {
            if (EstaLogado)
            {
                int qtdeColuna = Configuracao.QtdeColuna;
                string text = "grid_" + Convert.ToString(Configuracao.TamanhoColuna) + " alpha";
                StringBuilder stringBuilder = new StringBuilder();
                foreach (No item in UsuarioLogado.ObterArvoreMenu())
                {
                    if (item.MenuID != MenuId)
                    {
                        continue;
                    }

                    stringBuilder.Append("<div id=\"tabs\" class=\"grid_12\">");
                    int num = 0;
                    stringBuilder.Append("<ul>");
                    foreach (No item2 in item.ArvoreDeMenu)
                    {
                        num++;
                        stringBuilder.Append("<li><a href=\"#tabs-" + num + "\">" + item2.Nome + "</a></li>");
                    }

                    stringBuilder.Append("</ul>");
                    int num2 = 0;
                    foreach (No item3 in item.ArvoreDeMenu)
                    {
                        num2++;
                        stringBuilder.Append("<div id=\"tabs-" + num2 + "\">");
                        int num3 = 0;
                        foreach (No item4 in item3.ArvoreDeMenu)
                        {
                            if (num3 == qtdeColuna)
                            {
                                stringBuilder.Append("<div class=\"clear\">");
                                stringBuilder.Append("</div>");
                            }

                            stringBuilder.Append("<div class=\"" + text + "\">");
                            stringBuilder.Append("<span class=\"submenu1\">" + item4.Nome + "</span>");
                            stringBuilder.Append("<ul>");
                            num3++;
                            foreach (No item5 in item4.ArvoreDeMenu)
                            {
                                stringBuilder.Append("<li class=\"linknavigacao\">");
                                stringBuilder.Append("<div class=\"bullet\">");
                                stringBuilder.Append("</div>");
                                stringBuilder.Append("<a href=" + item5.Url + ">" + item5.Nome + "</a></li>");
                            }

                            stringBuilder.Append("</ul>");
                            stringBuilder.Append("</div>");
                        }

                        stringBuilder.Append("</div>");
                    }

                    stringBuilder.Append("</div>");
                }

                stringBuilder.Append("<script type=\"text/javascript\">");
                stringBuilder.Append("$('#tabs').tabs();");
                stringBuilder.Append("</script>");
                return stringBuilder.ToString();
            }

            return string.Empty;
        }

        public ActionResult Logout(string url)
        {
            base.Session.Remove("USUARIOLOGADO");
            base.Session.Remove("ULTIMOMENUSELECIONADO");
            base.Response.Cache.SetExpires(DateTime.UtcNow.AddMinutes(-1.0));
            base.Response.Cache.SetCacheability(HttpCacheability.NoCache);
            base.Response.Cache.SetNoStore();
            if (!string.IsNullOrEmpty(url))
            {
                if (!url.StartsWith("http://"))
                {
                    return Redirect("http://" + url);
                }

                return Redirect(url);
            }

            if (Configuracao.CodModuloGsi != 0)
            {
                return Redirect("https://www.gsi.ms.gov.br/");
            }

            return View();
        }
    }
}