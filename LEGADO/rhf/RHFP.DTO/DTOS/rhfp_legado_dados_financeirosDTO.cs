using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Security.Policy;
using System.Text;
using System.Threading.Tasks;

namespace RHFP.DTO.DTOS
{
    public class rhfp_legado_dados_financeirosDTO
    {
        // rhfp_legado_dados_financeirosDTO
        public int fin_numero { get; set; }
        public int dpe_matricula { get; set; }
        public short dfu_tp_cargo { get; set; }
        public string dpe_cpf_servidor { get; set; }
        public string dpe_nome_servidor { get; set; }
        public string fin_competencia_ano_mes { get; set; }
        public int rub_codigo { get; set; }
        public string rub_descricao { get; set; }
        public string fin_dt_inicio { get; set; }
        public decimal fin_valor { get; set; }
        public decimal? fin_perc_pontos_dia_hora { get; set; }
        public decimal? fin_qtd_urv { get; set; }
        public decimal PROVENTO { get; set; }
        public decimal DESCONTO { get; set; }
        public decimal TOTAL_PROVENTO { get; set; }
        public decimal TOTAL_DESCONTO { get; set; }
        public decimal LIQUIDO { get; set; }
        public object dfu_desc_tp_cargo { get; set; }
    }
}