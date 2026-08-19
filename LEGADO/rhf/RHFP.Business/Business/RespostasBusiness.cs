using RHFP.DTO.DTOS;
using RHFP.ModelData.Database.Entity;
using RHFP.Repository.Generic.Implementations;
using RHFP.Repository.Generic.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Remoting.Contexts;

namespace RHFP.Business
{
    public class RespostasBusiness
    {
        private readonly QuestoesRepository _QuestoesRepository;
        private readonly RespostasRepository _RespostasRepository;
        

        // Construtor padrão: cria o contexto e instancia o repositório
        public RespostasBusiness()
        {
            var context = new SigEventosContext(); // cria o contexto
            _QuestoesRepository = new QuestoesRepository(context);
            _RespostasRepository = new RespostasRepository(context);
        }

        // Construtor opcional para uso interno ou testes
        internal RespostasBusiness(RespostasRepository respostasRepository)
        {
            _RespostasRepository = respostasRepository;
        }

        public List<RespostasDto> ObterRespostasPorQuestao(short qst_num_questao)
        {
            // Aqui você pode aplicar regras de negócio antes de chamar o repo
            return _RespostasRepository.ObterRespostasPorQuestao(qst_num_questao);
        }


        public short ObterProximoNumeroResposta(int qst_num_questao_salvo)
        {
            return _RespostasRepository.ObterProximoNumeroResposta(qst_num_questao_salvo);
        }

        public eve_questoes_respostas Salvar(RespostasDto respostaDto, int qst_num_questao)
        {
            // Aqui você pode aplicar regras de negócio antes de chamar o repo
            return _RespostasRepository.Salvar(respostaDto, qst_num_questao);
        }

        public List<RespostasDto> ObterRespostaPorId(short qst_num_questao, short qsr_num_resposta, string qsr_situacao = null)
        {
            return _RespostasRepository.ObterRespostaPorId(qst_num_questao, qsr_num_resposta, qsr_situacao);
        }
    }
}
