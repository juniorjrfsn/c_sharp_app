using RHFP.DTO.DTOS;
using RHFP.ModelData.Database.Entity;
using RHFP.Repository.Generic.Implementations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RHFP.Business
{
    public class ParametrosBusiness
    {
        private readonly QuestoesRepository _QuestoesRepository;
        private readonly UsuariosRepository _usuariosRepository;
        private readonly ParametrosRepository _parametrosRepository;

        
        // Construtor padrão: cria o contexto e instancia o repositório
        public ParametrosBusiness()
        {
            var context = new SigEventosContext(); // cria o contexto
            _QuestoesRepository = new QuestoesRepository(context);
            _usuariosRepository = new UsuariosRepository(context);
            _parametrosRepository = new ParametrosRepository(context);
        }

        // Construtor opcional para uso interno ou testes
        internal ParametrosBusiness(ParametrosRepository ParametrosRepository)
        {
            _parametrosRepository = ParametrosRepository;
        }

        public List<ParametrosDto> ObterParametros()
        {
            // Aqui você pode aplicar regras de negócio antes de chamar o repo
            return _parametrosRepository.ObterParametros();
        }


        public ParametrosDto DefinirEventoVigente(short par_num_evento_vigente)
        {
            // Aqui você pode aplicar regras de negócio antes de chamar o repo
            return _parametrosRepository.DefinirEventoVigente(par_num_evento_vigente);
        }
    }
}
