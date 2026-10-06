using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Support.UI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace AGEPREV.EmailService
{
    public class TradutorService
    {
        public static List<EmailModel> TraduzirCorpoDosEmails(List<EmailModel> emails, string idiomaSaida = "pt")
        {
            // Web Scraping (com Selenium)

            string idiomaEntrada = "auto"; // Detecta automaticamente
            //string idiomaSaida = "pt";     // Traduz para português

            ChromeOptions options = new ChromeOptions();
            options.AddArgument("--headless"); // Executa sem abrir o navegador
            options.AddArgument("--no-sandbox"); // Pode ajudar em servidor
            options.AddArgument("--disable-gpu"); // Melhor rodar assim no headless

            using (IWebDriver driver = new ChromeDriver(options))
            {
                WebDriverWait wait = new WebDriverWait(driver, TimeSpan.FromSeconds(10));

                var rand = new Random(); // Coloque fora do loop para não reiniciar sempre

                foreach (var email in emails)
                {
                    string texto = email.CorpoTexto ?? "";
                    
                    string url = $"https://translate.google.com/?sl={idiomaEntrada}&tl={idiomaSaida}&text={Uri.EscapeDataString(texto)}&op=translate";
                    driver.Navigate().GoToUrl(url);

                    try
                    {
                        // Espera até que o elemento da tradução apareça
                        var traducaoNode = wait.Until(drv =>
                        {
                            var elemento = drv.FindElement(By.XPath("//div[contains(@class, 'QcsUad')]"));
                            return !string.IsNullOrEmpty(elemento.Text) && elemento.Text != texto ? elemento : null;
                        });

                        // Substitui o corpo original pelo traduzido
                        email.CorpoTexto = traducaoNode.Text;
                    }
                    catch (WebDriverTimeoutException)
                    {
                        email.CorpoTexto = $"Erro ao traduzir: {texto}";
                    }

                    // Adiciona pausa após cada tradução (ou tentativa) para evitar bloqueio do Google
                    Thread.Sleep(rand.Next(800, 1500));
                }
            }

            return emails;
        }

    }
}
