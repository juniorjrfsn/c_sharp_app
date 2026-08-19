using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RHFP.DTO.DTOS
{
    public class EventosDto
    {
        public short eve_num_evento { get; set; }

        private string _eve_nome;
        public string eve_nome
        {
            get => _eve_nome;
            set => _eve_nome = value?.ToUpper();
        }

        public string eve_descricao { get; set; }
        public string eve_local { get; set; }
        public string eve_municipio { get; set; }
        public DateTime eve_dt_inicio { get; set; }
        public DateTime? eve_dt_fim { get; set; }
        public DateTime eve_dt_inclusao { get; set; }
        public string eve_situacao { get; set; }
        public short que_num_questionario { get; set; }
        public string que_contexto { get; set; }
        public string que_publico_alvo { get; set; }
        public decimal? que_nota_minima { get; set; }
        public DateTime que_dt_inclusao { get; set; }
        public string que_situacao { get; set; }
    }
}
