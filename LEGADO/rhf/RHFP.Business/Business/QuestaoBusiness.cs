using RHFP.DTO.DTOS;
using RHFP.ModelData.Database.Entity;
using RHFP.Repository.Generic.Implementations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Remoting.Contexts;

namespace RHFP.Business
{
    public class QuestaoBusiness
    {
        private readonly QuestoesRepository _QuestoesRepository;
        private readonly UsuariosRepository _usuariosRepository;
 
      

        // Construtor padrão: cria o contexto e instancia o repositório
        public QuestaoBusiness()
        {
            var context = new SigEventosContext(); // cria o contexto
            _QuestoesRepository = new QuestoesRepository(context);
            _usuariosRepository = new UsuariosRepository(context);
        }

        // Construtor opcional para uso interno ou testes
        internal QuestaoBusiness(QuestoesRepository QuestoesRepository)
        {
            _QuestoesRepository = QuestoesRepository; 
        }

        public List<QuestoesDto> GetQuestoes()
        {
            // Aqui você pode aplicar regras de negócio antes de chamar o repo
            return _QuestoesRepository.GetQuestoes();   
        }

        public List<QuestoesDto> GetQuestao(short qst_num_questao)
        {
            // Aqui você pode aplicar regras de negócio antes de chamar o repo
            return _QuestoesRepository.GetQuestao(qst_num_questao);
        }

        public int Salvar(QuestoesDto questaoDto)
        {
            // Aqui você pode aplicar regras de negócio antes de chamar o repo
            return _QuestoesRepository.Salvar(questaoDto);
        }



        public void GravarQuestionarioUsuario(List<eve_usuarios_respostas> eve_Usuarios_Resps)
        {
           _QuestoesRepository.GravarQuestionarioUsuario(eve_Usuarios_Resps);
        }

        public List<QuestaoComRespostaDto> ObterQuestoesComRespostas(string cpf, short eve_num_evento, short que_num_questionario)
        {
            // Aqui você pode aplicar regras de negócio antes de chamar o repo
            return _QuestoesRepository.GetQuestoesComRespostas(cpf,  eve_num_evento,  que_num_questionario);
        }

        public List<QuestaoComRespostaDto> GetUsuarioQuestionarioPonto()
        {
            // Aqui você pode aplicar regras de negócio antes de chamar o repo
            return _QuestoesRepository.GetUsuarioQuestionarioPonto();
        }

        public List<QuestaoComRespostaDto> GetUsuarioQuestionarioPontuacaoPorCpf(int eveNumEvento, int queNumQuestionario, string usr_cpf)
        {
            usr_cpf = usr_cpf.Replace(".", "").Replace("-", "").Replace("/", "");
            return _QuestoesRepository.GetUsuarioQuestionarioPontuacaoPorCpf(eveNumEvento, queNumQuestionario, usr_cpf);
        }
        public List<QuestaoComRespostaDto> GetUsuarioQuestionarioPontuacaoConferenciaPorCpf(int eve_num_evento, int que_num_questionario, string usr_cpf)
        {
            usr_cpf = usr_cpf.Replace(".", "").Replace("-", "").Replace("/", "");
            return _QuestoesRepository.GetUsuarioQuestionarioPontuacaoConferenciaPorCpf(eve_num_evento, que_num_questionario, usr_cpf);
        }

        public UsuariosDto VerificaUsuario(string cpf)
        {
            return _usuariosRepository.VerificaUsuario(cpf);
        }
         
        public decimal ObterQuestoesComRespostasPontos__deprecated(string cpf, short eve_num_evento, short que_num_questionario)
        { 
            List<QuestaoComRespostaDto> respostaDtos = _QuestoesRepository.GetQuestoesComRespostas(cpf, eve_num_evento, que_num_questionario);
            var questoesAgrupadas = respostaDtos
                .GroupBy(q => q.NumeroQuestao)
                .Select(g => new QuestaoComRespostaDto
                {
                    NumeroQuestao = g.Key,
                    NumeroResposta = g.Count(),
                    Ponto = g.Sum(q => q.Ponto)
                }).ToList();
             
            var questoesAgrupadas2 = questoesAgrupadas
            .GroupBy(q => q.NumeroQuestao)
            .Select(g => new QuestaoComRespostaDto
            {
                NumeroQuestao = g.Key,
                NumeroResposta = g.First().NumeroResposta,
                Ponto = g.First().Ponto,
                PontoQuestion = (g.First().NumeroResposta == g.First().Ponto) ? 1 : 0
            }).ToList();

            decimal pontuacao = 0;
            if (questoesAgrupadas2.Count == 0)
            {
            }
            else
            {
                decimal totalPontos = questoesAgrupadas2.Sum(q => q.PontoQuestion);
                pontuacao = (10m / questoesAgrupadas2.Count) * totalPontos;
            }

            // Aqui você pode aplicar regras de negócio antes de chamar o repo
            return pontuacao;
        }

      

        public List<UsuariosDto> VerificaUsuariorRespostas(string usr_cpf, short eve_num_evento, short que_num_questionario)
        { 
            return _usuariosRepository.VerificaUsuariorRespostas(usr_cpf, eve_num_evento, que_num_questionario);
        }


        public List<QuestaoComRespostaDto> GetUsuarioQuestionarioPontuacao(int eveNumEvento, int queNumQuestionario)
        {
            // Aqui você pode aplicar regras de negócio antes de chamar o repo
            return _QuestoesRepository.GetUsuarioQuestionarioPontuacao(eveNumEvento, queNumQuestionario);
        }
        public List<QuestaoComRespostaDto> GetUsuarioQuestionarioPontuacaoFinal(short eve_num_evento, short que_num_questionario)
        {
            return _QuestoesRepository.GetUsuarioQuestionarioPontuacaoFinal(eve_num_evento, que_num_questionario);
        }

   
    }


}
