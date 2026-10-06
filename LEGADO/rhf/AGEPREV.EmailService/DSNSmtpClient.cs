using MailKit;
using MailKit.Net.Smtp;
using MimeKit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AGEPREV.EmailService
{
    /// <summary>
    /// para usar DeliveryStatusNotification no Mailkit
    /// troque SmtpClient por DSNSmtpClient.
    /// </summary>
    public class DSNSmtpClient : SmtpClient
    {
        protected override DeliveryStatusNotification? GetDeliveryStatusNotifications(MimeMessage message, MailboxAddress mailbox)
        {
            // Solicita todos os tipos de notificação
            return DeliveryStatusNotification.Success |
                   DeliveryStatusNotification.Failure |
                   DeliveryStatusNotification.Delay;
        }

        protected override string GetEnvelopeId(MimeMessage message)
        {
            // ID único para rastrear a entrega
            return message.MessageId ?? Guid.NewGuid().ToString();
        }
    }
}
