using SGI.Framework.MVC.Architecture.Controller;
using System;
using System.Diagnostics;
using System.Web.Mvc;

namespace RHFPMVC.Controllers
{
    public class LoginController : GSIController
    {
        public LoginController() : base(deveLogar: false, devePermissionar: false)
        {
        }

        [HttpGet]
        public override ActionResult AutenticarGSI(int? ta, string h)
        {
            try
            {
                Trace.WriteLine("[LoginController.AutenticarGSI] Iniciando autenticação com ta=" + ta + ", h=" + h);
                return base.AutenticarGSI(ta, h);
            }
            catch (Exception ex)
            {
                Trace.WriteLine("[LoginController.AutenticarGSI] Erro: " + ex.ToString());
                System.Diagnostics.Debug.WriteLine("Erro em AutenticarGSI: " + ex.ToString());
                EmitirMensagem("Erro ao conectar o sistema de autenticação. Tente novamente mais tarde. Detalhes: " + ex.Message, ETipoMensagem.Erro);
                return RedirectToAction("SessaoExpirada");
            }
        }

        [HttpGet]
        public override ActionResult SessaoExpirada()
        {
            Trace.WriteLine("[LoginController.SessaoExpirada] Renderizando página de sessão expirada.");
            try
            {
                return View("SessaoExpirada");
            }
            catch (Exception ex)
            {
                Trace.WriteLine("[LoginController.SessaoExpirada] Erro ao carregar view: " + ex.Message);
                return new ContentResult
                {
                    Content = @"<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8' />
    <title>Sessão Expirada</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 50px; }
        .container { max-width: 600px; margin: 0 auto; }
        .alert { background-color: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; padding: 15px; border-radius: 4px; }
        a { color: #007bff; text-decoration: none; }
        a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='alert'>
            <h2>Sessão Expirada</h2>
            <p>Sua sessão expirou ou não foi possível autenticar.</p>
            <p><a href='/'>Voltar para a página inicial</a></p>
        </div>
    </div>
</body>
</html>",
                    ContentType = "text/html"
                };
            }
        }

        [HttpGet]
        public override ActionResult AcessoNegado()
        {
            Trace.WriteLine("[LoginController.AcessoNegado] Renderizando página de acesso negado.");
            try
            {
                return View("AcessoNegado");
            }
            catch (Exception ex)
            {
                Trace.WriteLine("[LoginController.AcessoNegado] Erro ao carregar view: " + ex.Message);
                return new ContentResult
                {
                    Content = @"<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8' />
    <title>Acesso Negado</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 50px; }
        .container { max-width: 600px; margin: 0 auto; }
        .alert { background-color: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; padding: 15px; border-radius: 4px; }
        a { color: #007bff; text-decoration: none; }
        a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='alert'>
            <h2>Acesso Negado</h2>
            <p>Você não tem permissão para acessar este recurso.</p>
            <p><a href='/'>Voltar para a página inicial</a></p>
        </div>
    </div>
</body>
</html>",
                    ContentType = "text/html"
                };
            }
        }
    }
}