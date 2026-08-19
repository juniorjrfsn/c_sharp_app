using SGI.Framework.MVC.Architecture.Controller;
using System.Web.Mvc;

namespace SIGEVENTOSMVC.Controllers
{
    public class LoginController : GSIController
    {
        public LoginController() : base(deveLogar: false, devePermissionar: false)
        {
        }
    }
}
