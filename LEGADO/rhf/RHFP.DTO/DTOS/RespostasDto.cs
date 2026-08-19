using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RHFP.DTO.DTOS
{
    public class RespostasDto
    {
        public int qst_num_questao { get; set; }
        public short qsr_num_resposta { get; set; }
        public string qsr_enunciado { get; set; }
        public string qsr_e_correta { get; set; }
        public string qsr_situacao { get; set; }
 
    }
}
