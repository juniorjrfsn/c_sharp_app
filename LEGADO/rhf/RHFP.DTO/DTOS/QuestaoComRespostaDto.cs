namespace RHFP.DTO.DTOS
{
    public class QuestaoComRespostaDto
    {
     
        public int NumeroQuestao { get; set; }
        public string EnunciadoQuestao { get; set; }
        public string SituacaoQuestao { get; set; }
        public int NumeroResposta { get; set; }
        public string EnunciadoResposta { get; set; }
        public string Correta { get; set; } // ← muda para string
        public string SituacaoResposta { get; set; }
        public short NumeroEvento { get; set; }
        public short NumeroQuestionario { get; set; }
        public int NumeroUsuario { get; set; }
        public int NumeroRespostaUsuario { get; set; }
        public short RespNumeroRespostaUsuario { get; set; }
        public int RespNumeroUsuario { get; set; }
        public int Ponto { get; set; }
        public int PontoQuestion { get; set; }
        public int QtdeQuestion { get; set; }
        public short eve_num_evento { get; set; }

        private string _eve_nome;
        public string eve_nome
        {
            get => _eve_nome;
            set => _eve_nome = value?.ToUpper();
        }

        public string eve_situacao { get; set; }
        public short que_num_questionario { get; set; }
        public string que_situacao { get; set; }
        public int usr_num_usuario { get; set; }
        public string usr_cpf { get; set; }
        public decimal pontuacao { get; set; }
        public string usr_nome { get; set; }
        public string usr_situacao { get; set; }
        public string que_contexto { get; set; }
        public decimal? Percentual { get; set; }
        public int TotalQuestoesProva { get; set; }
        public string usr_email { get; set; }
        public int QtdeQ { get; set; }
        public int Pontos { get; set; }
        public string usr_municipio { get; set; }
        public string usr_instituicao { get; set; }
        public string usr_telefone { get; set; }
        public int qst_num_questao { get; set; }
        public object qst_enunciado { get; set; }
        public short qsr_num_resposta { get; set; }
        public string qsr_enunciado { get; set; }
        public string qsr_e_correta { get; set; }
        public short? qsr_num_resposta_usuario { get; set; }
        public int ponto_q { get; set; }
        public int ponto_alvo_q { get; set; }
        public int qtde_q { get; set; }
        public int nota_q { get; set; }
        public int nota { get; set; }
    }
}