using MailKit.Net.Pop3;
using MailKit.Security;
using MimeKit;
using OfficeOpenXml;
using SIGEVENTOS.Repository.Generic.Implementations;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Security.Authentication;
using System.Text;
using System.Text.RegularExpressions;

namespace AGEPREV.EmailService
{
    public class EmailRelatorioService
    {
       static string host = ConfigurationManager.AppSettings["SmtpPOP3"];
       static int porta = Convert.ToInt32(ConfigurationManager.AppSettings["PortaPOP3"]);
       static bool usarSsl = bool.Parse(ConfigurationManager.AppSettings["UtilizarSsl"]);
       static string usuario = ConfigurationManager.AppSettings["EMAIL_USUARIO"];
       static string senha = ConfigurationManager.AppSettings["EMAIL_SENHA"];

        //aso_log_emailsRepository leeRep = new aso_log_emailsRepository();
     

 
     
        public List<EmailModel> LerEmails()
        {
            var mensagens = new List<EmailModel>();

            using (var client = new Pop3Client())
            {
                if (usarSsl)
                {
                    // Ignorar erros de certificado SSL 
                    client.ServerCertificateValidationCallback = (sender, certificate, chain, sslPolicyErrors) => true;
                    // Configurar protocolos TLS 
                    client.SslProtocols = SslProtocols.Tls12 | SslProtocols.Tls11 | SslProtocols.Tls;
                }

                client.Connect(host, porta, usarSsl ? SecureSocketOptions.SslOnConnect : SecureSocketOptions.StartTls);
                client.Authenticate(usuario, senha);

                for (int i = 0; i < client.Count; i++)
                {
                    MimeMessage mensagem = client.GetMessage(i);

                    // Extrair TUDO como texto plano
                    string emailBruto;
                    using (var memoryStream = new MemoryStream())
                    {
                        mensagem.WriteTo(memoryStream);
                        emailBruto = Encoding.UTF8.GetString(memoryStream.ToArray());
                    }

                    // Extrair campos do corpo bruto
                    string xCustomGuid = ObterXCustomGuid(emailBruto);

                    var (smtpCode, extendedCode) = ExtrairCodigosSmtp(emailBruto);

                    // Fallback inteligente se não houver código explícito no corpo
                    if (string.IsNullOrWhiteSpace(smtpCode) && string.IsNullOrWhiteSpace(extendedCode))
                    {
                        (smtpCode, extendedCode) = InferirCodigosPorFrases(emailBruto);
                    }

                    mensagens.Add(new EmailModel
                    {
                        Remetente = mensagem.From.ToString(),
                        Assunto = mensagem.Subject,
                        Data = mensagem.Date.LocalDateTime,
                        CorpoTexto = emailBruto, //mensagem.TextBody, // mensagem.TextBody => atalho que retorna apenas o corpo da mensagem em texto simples (text/plain), se existir.
                        XCustomGuid = xCustomGuid,
                        CodigoSmtpPrimario = smtpCode,
                        CodigoSmtpExtendido = extendedCode
                    });

                    bool excluirEmail = DeveExcluirEmail(mensagem); // Função que define se o e-mail deve ser excluído

                    if (excluirEmail)
                    {
                        client.DeleteMessage(i); // Marca e-mail para exclusão
                        Console.WriteLine($"E-mail {i} marcado para exclusão.");
                    }
                }

                client.Disconnect(true);
            }

            return mensagens;
        }

        static bool DeveExcluirEmail(MimeMessage email)
        {
            DateTime dataEmail = email.Date.LocalDateTime;
            DateTime agora = DateTime.Now;

            // Calcula o mês e o ano anterior
            DateTime mesAnterior = agora.AddMonths(-1);

            return dataEmail.Month == mesAnterior.Month && dataEmail.Year == mesAnterior.Year;
        }

        private static string ObterXCustomGuid(string texto)
        {
            var match = Regex.Match(texto, @"X-Custom-GUID:\s*([\w\-]+)", RegexOptions.IgnoreCase);
            return match.Success ? match.Groups[1].Value : "N/A";
        }

        public static (string smtpCode, string extendedCode) ExtrairCodigosSmtp(string emailBruto)
        {
            if (string.IsNullOrWhiteSpace(emailBruto))
                return ("", "");

            var linhas = emailBruto.Split(new[] { "\r\n", "\n" }, StringSplitOptions.None);

            string smtpCode = "";
            string extendedCode = "";

            foreach (var linha in linhas)
            {
                // 🔍 Busca pelo campo Status para extrair código estendido
                if (linha.StartsWith("Status:", StringComparison.OrdinalIgnoreCase))
                {
                    var match = Regex.Match(linha, @"(\d\.\d\.\d)");
                    if (match.Success)
                    {
                        extendedCode = match.Groups[1].Value;

                        // 🧠 Mapeamento auxiliar para associar ao código SMTP principal
                        if (extendedCode.StartsWith("4.4.1"))
                            smtpCode = "451"; // erro de DNS ou timeout
                        else if (extendedCode.StartsWith("5.1.1"))
                            smtpCode = "550"; // destinatário inexistente
                        else if (extendedCode.StartsWith("5.7"))
                            smtpCode = "554"; // política ou spam
                    }
                }

                // 🛠️ Captura código primário via Diagnostic-Code, mesmo com "X-Postfix"
                if (linha.StartsWith("Diagnostic-Code:", StringComparison.OrdinalIgnoreCase))
                {
                    var match = Regex.Match(
                        linha,
                        @"(?:smtp|x-postfix);\s*(\d{3})(?:\s+(\d\.\d\.\d))?",
                        RegexOptions.IgnoreCase
                    );

                    if (match.Success)
                    {
                        smtpCode = match.Groups[1].Value;

                        if (string.IsNullOrWhiteSpace(extendedCode) && match.Groups[2].Success)
                            extendedCode = match.Groups[2].Value;
                    }
                }
            }

            // 🧪 Fallback: busca por códigos SMTP visíveis no corpo (evita IPs)
            if (string.IsNullOrWhiteSpace(smtpCode) && string.IsNullOrWhiteSpace(extendedCode))
            {
                foreach (var linha in linhas)
                {
                    // ❌ Ignora linhas com IP para evitar falsos positivos tipo “201”
                    if (Regex.IsMatch(linha, @"

                        \[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\]
                        
                        "))
                        continue;

                    var match = Regex.Match(linha, @"\b(2\d{2}|4\d{2}|5\d{2})\b");
                    if (match.Success)
                    {
                        smtpCode = match.Groups[1].Value;
                        break;
                    }
                }
            }

            return (smtpCode, extendedCode);
        }

        public static (string smtpCode, string extendedCode) InferirCodigosPorFrases(string textoEmail)
        {
            if (string.IsNullOrWhiteSpace(textoEmail)) return ("", "");

            var texto = textoEmail.ToLowerInvariant();

            var padroes = new List<(string padrao, string smtp, string estendido)>
            {
                (@"type=a:\s*host\s*not\s*found|name\s*service\s*error", "554", "5.4.4"),
                (@"no\s*mx\s*record\s*found|mx\s*record\s*missing", "454", "4.4.4"),
                (@"dns\s*timeout|name\s*server\s*timeout", "451", "4.4.1"),
                (@"ptr\s*record\s*mismatch|reverse\s*dns\s*failed", "550", "5.7.25"),
                (@"mailbox\s*unavailable|user\s*unknown", "550", "5.1.1"),
                (@"message\s*considered\s*spam|blacklist", "554", "5.7.1"),
            };

            foreach (var (padrao, smtp, estendido) in padroes)
            {
                if (Regex.IsMatch(texto, padrao, RegexOptions.IgnoreCase))
                {
                    return (smtp, estendido);
                }
            }

            return ("", "");
        }

 


    }
}