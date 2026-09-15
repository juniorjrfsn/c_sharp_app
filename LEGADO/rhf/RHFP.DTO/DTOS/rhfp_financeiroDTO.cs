using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Security.Policy;
using System.Text;
using System.Threading.Tasks;

namespace RHFP.DTO.DTOS
{
    public class rhfp_financeiroDTO
    {
        public int matricula { get; set; }
        public int tipo_cargo  { get; set; }

        public string nome { get; set; }
        public string cpf { get; set; }
        public string competencia { get; set; }
        public int cod_rubrica { get; set; }

        public string pr_Rubrica { get; set; }

        public string data_inicio { get; set; }

        public decimal valor { get; set; }
        public decimal perc_pont_dia_hora { get; set; }

        public decimal QTDE_URV { get; set; }
        public decimal ala_fi_QTDE_URV { get; set; }
        public decimal ala_fi_perc_pont_dia_hora { get; set; }
        public decimal ala_fi_valor { get; set; }
        public string data_inicio_fi { get; set; }
        public int cod_rubrica_fi { get; set; }
        public string COMPETENCIA_FI { get; set; }
 
        public int tipo_cargo_fi { get; set; }
        public int ala_fi_MATRICULA { get; set; }
        public decimal PROVENTO { get; set; }
        public decimal DESCONTO { get; set; }
        public decimal TOTAL_PROVENTO { get; set; }
        public decimal TOTAL_DESCONTO { get; set; }
        public decimal LIQUIDO { get; set; }
        public object dpe_cpf_servidor { get; set; }
        public object dpe_nome_servidor { get; set; }
    }
}