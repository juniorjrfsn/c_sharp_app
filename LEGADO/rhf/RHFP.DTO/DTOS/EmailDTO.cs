using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RHFP.DTO.DTOS
{public class EmailDTO
    {
        public string Remetente { get; set; }
        public string Assunto { get; set; }
        public DateTime Data { get; set; }
        public string CorpoTexto { get; set; }
        public string XCustomGuid { get; set; }
        public string CodigoSmtpPrimario { get; set; }      // Ex: 550
        public string CodigoSmtpExtendido { get; set; }     // Ex: 5.5.0
    }
}
