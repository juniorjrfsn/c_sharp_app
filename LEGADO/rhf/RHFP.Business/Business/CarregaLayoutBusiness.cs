using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RHFP.Business
{
    public class CarregaLayoutBusiness
    {
        public bool sucesso { get; set; }

        public string RelatorioPageHeader { get; set; }
        public string RelatorioPageResumo { get; set; }
        public string RelatorioPageContent { get; set; }
        
        public string layout { get; set; }
        public string layout_2 { get; set; }
        public string layout_3 { get; set; }


        public string msg { get; set; }
        public string PageHead { get; set; }

        public CarregaLayoutBusiness(string contentRootPath)
        {
            try
            {
                msg = string.Empty;
                sucesso = false;

                this.PageHead = string.Empty;
                this.RelatorioPageHeader = string.Empty;
                this.RelatorioPageResumo = string.Empty;
                this.RelatorioPageContent = string.Empty;

                this.layout = string.Empty;

                this.layout_2 = string.Empty;

                this.layout_3 = string.Empty;


                var webRootPath = contentRootPath;
 
                var filePathPageHeadBS = Path.Combine(webRootPath, "Content/html", "bootstrap.css");
                using (FileStream fsPhBS = new FileStream(filePathPageHeadBS.Replace("\\", "/"), FileMode.Open, FileAccess.Read))
                {
                    using (StreamReader readerPhBS = new StreamReader(fsPhBS))
                    {
                        string fileContentPhBS = readerPhBS.ReadToEnd();
                        this.PageHead = fileContentPhBS.ToString().Replace("\r\n", " ");
                    }
                }


                // obtém a string HTML como layout que posteriormente receberá os dados na tBody e outros dados como na Header e Footer do Relatório
          
                var filePathTcsr3 = Path.Combine(webRootPath, "Content/html", "LayoutPrincipal.html");
                using (FileStream tcsr3 = new FileStream(filePathTcsr3.Replace("\\", "/"), FileMode.Open, FileAccess.Read))
                {
                    using (StreamReader readercsr3 = new StreamReader(tcsr3))
                    {
                        string fileContentcsr3 = readercsr3.ReadToEnd();
                        this.layout_3 = fileContentcsr3.ToString().Replace("\r\n", " ");
                    }
                }

                var filePathTcsrPH = Path.Combine(webRootPath, "Content/html", "RelatorioPageHeader.html");
                using (FileStream tcsrPH = new FileStream(filePathTcsrPH.Replace("\\", "/"), FileMode.Open, FileAccess.Read))
                {
                    using (StreamReader readercsrPH = new StreamReader(tcsrPH))
                    {
                        string fileContentcsrPH = readercsrPH.ReadToEnd();
                        this.RelatorioPageHeader = fileContentcsrPH.ToString().Replace("\r\n", " ");
                    }
                }


                var filePathTcsrPR = Path.Combine(webRootPath, "Content/html", "RelatorioPageResumo.html");
                using (FileStream tcsrPR = new FileStream(filePathTcsrPR.Replace("\\", "/"), FileMode.Open, FileAccess.Read))
                {
                    using (StreamReader readercsrPR = new StreamReader(tcsrPR))
                    {
                        string fileContentcsrPR = readercsrPR.ReadToEnd();
                        this.RelatorioPageResumo = fileContentcsrPR.ToString().Replace("\r\n", " ");
                    }
                }

                var filePathTcsrPC = Path.Combine(webRootPath, "Content/html", "RelatorioPageContent.html");
                using (FileStream tcsrPC = new FileStream(filePathTcsrPC.Replace("\\", "/"), FileMode.Open, FileAccess.Read))
                {
                    using (StreamReader readercsrPC = new StreamReader(tcsrPC))
                    {
                        string fileContentcsrPC = readercsrPC.ReadToEnd();
                        this.RelatorioPageContent = fileContentcsrPC.ToString().Replace("\r\n", " ");
                    }
                }

                sucesso = true;
            }
            catch (FileNotFoundException ex)
            {
                msg += $"Error: File not found - {ex.Message}";
                Console.WriteLine(msg);
            }
            catch (UnauthorizedAccessException ex)
            {
                msg += $"Error: Access denied - {ex.Message}";
                Console.WriteLine(msg);
            }
            catch (Exception ex) // Catch all other exceptions
            {
                msg += $"Error: An unexpected error occurred - {ex.Message}";
                Console.WriteLine(msg);
            }
        }
    }
}
