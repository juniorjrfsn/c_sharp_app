using SIGEVENTOS.DTO.DTOS;
using SIGEVENTOS.ModelData.Database.Entity;
using SIGEVENTOS.Repository.Generic.Implementations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIGEVENTOS.Business
{
    public class UsuariosResultadosBusiness
    {
        private readonly UsuariosResultadosRepository _usuariosResultadosRepository;

        // Construtor padrão: cria o contexto e instancia o repositório
        public UsuariosResultadosBusiness()
        {
            var context = new SigEventosContext(); // cria o contexto
            _usuariosResultadosRepository = new UsuariosResultadosRepository(context);
        }

        // Construtor opcional para uso interno ou testes
        internal UsuariosResultadosBusiness(UsuariosResultadosRepository usuariosRepository)
        {
            _usuariosResultadosRepository = usuariosRepository;
        }
        public UsuariosDto VerificausuarioResultado(int usr_num_usuario, short eve_num_evento, short que_num_questionario)
        {
            return  _usuariosResultadosRepository.GetUsuarioResultado(usr_num_usuario, eve_num_evento, que_num_questionario);
        }

        public List<UsuariosDto> GetContagemPorNotaResultado(short eve_num_evento, short que_num_questionario)
        {
            return _usuariosResultadosRepository.GetContagemPorNotaResultado(eve_num_evento, que_num_questionario);
        }
    }
}
