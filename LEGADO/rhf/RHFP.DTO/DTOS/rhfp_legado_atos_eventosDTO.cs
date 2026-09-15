using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Security.Policy;
using System.Text;
using System.Threading.Tasks;

namespace RHFP.DTO.DTOS
{
    public class rhfp_legado_atos_eventosDTO
    {
        public string dpe_nome_servidor { get; set; }
        public string dpe_cpf_servidor { get; set; }
        public object ate_numero { get; set; }
        public object ate_matricula { get; set; }
        public object ate_tipo_ato { get; set; }
        public object ate_descricao { get; set; }
        public object ate_dt_ato { get; set; }
        public object ate_dt_publicacao { get; set; }
        public object ate_num_diario_oficial { get; set; }
        public object ate_situacao { get; set; }
    }
}
