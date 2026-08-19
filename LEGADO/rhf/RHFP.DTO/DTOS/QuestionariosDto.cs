using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace RHFP.DTO.DTOS
{
    public class QuestionariosDto
    {
        public short eve_num_evento { get; set; }
        public short que_num_questionario { get; set; }
        public string que_contexto { get; set; }
        public string que_publico_alvo { get; set; }
        public decimal? que_nota_minima { get; set; }
        public DateTime que_dt_inclusao { get; set; }
        public string que_situacao { get; set; }
    }
}

