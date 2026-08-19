using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIGEVENTOS.DTO.DTOS
{
    public class UsuariosDto
    {
 
        public int NumeroUsuario { get; set; }

        private string _NomeUsuario;
        public string NomeUsuario
        {
            get => _NomeUsuario;
            set => _NomeUsuario = value?.ToUpper();
        }

        public string CpfUsuario { get; set; }
        public string EmailUsuario { get; set; }
        public string TelefoneUsuario { get; set; }
        public string InstituicaoUsuario { get; set; }
        public string MunicipioUsuario { get; set; }
        public string SituacaoUsuario { get; set; }
        public int QtdeResp { get; set; }
        public short NumeroEvento { get; set; }
        public short NumeroQuestionario { get; set; }
        public int NumeroQuestao { get; set; }
        public short NumeroResposta { get; set; }
        public int usr_num_usuario { get; set; }
        public short eve_num_evento { get; set; }
        public short que_num_questionario { get; set; }
        public decimal ure_nota_minima { get; set; }
        public decimal ure_nota_resultado { get; set; }
        public DateTime ure_dt_resultado { get; set; }
        public string ure_situacao { get; set; }
        public string usr_nome { get; set; }
        
        public int QTDE { get; set; }
        public string usr_cpf { get; set; }
        public string usr_email { get; set; }
        public string usr_telefone { get; set; }
        public string usr_instituicao { get; set; }
        public string usr_municipio { get; set; }
        public string usr_situacao { get; set; }
    }
}
