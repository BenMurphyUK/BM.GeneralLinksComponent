using System.Web.Mvc;

namespace BM.GeneralLinksComponent.Controllers.ModalDialogs
{
    public class GeneralLinkDialogController : Controller
    {
        public ActionResult Index()
        {
            return View("ModalDialogs/GeneralLinkModalDialog/_GeneralLinkModalDialog", new GeneralLink());
        }
    }
}