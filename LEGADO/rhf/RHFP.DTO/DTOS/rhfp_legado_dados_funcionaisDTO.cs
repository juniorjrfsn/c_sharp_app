using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Security.Policy;
using System.Text;
using System.Threading.Tasks;

namespace RHFP.DTO.DTOS
{
    public class rhfp_legado_dados_funcionaisDTO
    {
        public int fun_numero { get; set; }
        public Nullable<int> dpe_matricula { get; set; }
        public string dpe_nome_servidor { get; set; }
        public string dpe_cpf_servidor { get; set; }
        public string fun_dt_validade_inicial { get; set; }
        public short fun_tp_cargo { get; set; }
        public string fun_desc_tp_cargo { get; set; }
        public short fun_cod_simbolo { get; set; }
        public string fun_desc_simbolo { get; set; }
        public string fun_cargo { get; set; }
        public short fun_cod_provimento { get; set; }
        public string fun_desc_provimento { get; set; }
        public Nullable<short> fun_cod_ativo_desativo { get; set; }
        public string fun_desc_ativo_desativo { get; set; }
        public short fun_cod_orgao_superior { get; set; }
        public string fun_desc_orgao_superior { get; set; }
        public short fun_cod_unidade_orcamentaria { get; set; }
        public string fun_desc_unidade_orcamentaria { get; set; }
        public short fun_cod_reparticao { get; set; }
        public string fun_nome_reparticao { get; set; }
        public int fun_cod_municipio { get; set; }
        public string fun_nome_municipio { get; set; }
    }
}
