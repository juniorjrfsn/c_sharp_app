using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Security.Policy;
using System.Text;
using System.Threading.Tasks;

namespace RHFP.DTO.DTOS
{
    public class rhfp_legado_atos_e_eventosDTO
    {
        public int ate_numero { get; set; }
        public Nullable<int> dep_matricula { get; set; }
        public string ate_nome { get; set; }
        public string ate_cpf_servidor { get; set; }
        public int ate_cod_ato { get; set; }
        public string ate_cod_texto { get; set; }
        public string ate_atos_eventos { get; set; }
        public Nullable<int> ate_num_diario_oficial { get; set; }
        public string ate_dt_diario_oficial { get; set; }
        public short ate_tp_ato { get; set; }
        public string ate_desc_tp_ato { get; set; }
        public string ate_dt_ato { get; set; }
        public string ate_dt_validade { get; set; }
        public string ate_dt_final { get; set; }
        public Nullable<int> ate_prazo { get; set; }
        public short ate_original_quadro { get; set; }
        public short ate_original_cod_simbolo { get; set; }
        public string ate_original_simbolo { get; set; }
        public string ate_original_cargo { get; set; }
        public short ate_acumulado_quadro { get; set; }
        public short ate_acumulado_cod_simbolo { get; set; }
        public string ate_acumulado_simbolo { get; set; }
        public string ate_acumulado_cargo { get; set; }
        public short ate_comissao_quadro { get; set; }
        public short ate_comissao_cod_simbolo { get; set; }
        public string ate_comissao_simbolo { get; set; }
        public string ate_comissao_cargo { get; set; }
        public short ate_cod_validade_gratificada { get; set; }
        public short ate_cod_simbolo_funcao_gratificada { get; set; }
        public string ate_simbolo_funcao_gratificada { get; set; }
        public string ate_cargo_funcao_gratificada { get; set; }
        public string ate_instrumento_legal { get; set; }
        public string ate_historico { get; set; }
        public string ate_artigo_legal { get; set; }
        public string ate_inciso_legal { get; set; }
        public string ate_alinea_legal { get; set; }
        public string ate_paragrafo_legal { get; set; }
        public string ate_dt_inicio_aquisitivo { get; set; }
        public string ate_dt_final_aquisitivo { get; set; }
    }
}
