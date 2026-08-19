using System.Collections.Generic;
using RHFP.Repository.Implementations;

namespace RHFP.Business
{
    public class UniversalBusiness
    {
        private readonly UniversalRepository _oracleRepository;

        // Construtor padrão
        public UniversalBusiness()
        {
            _oracleRepository = new UniversalRepository();
        }

        // Construtor opcional para uso interno ou testes
        internal UniversalBusiness(UniversalRepository oracleRepository)
        {
            _oracleRepository = oracleRepository;
        }

        public Dictionary<string, string> ObterDadosUsuario(string cpf)
        {
            // Aqui você pode aplicar regras de negócio antes de chamar o repository
            return _oracleRepository.GetDadosUsuario(cpf);
        }
        public List<Dictionary<string, string>> GetInstituicoes()
        {
            // Aqui você pode aplicar regras de negócio antes de chamar o repository
            return _oracleRepository.GetInstituicoes();
        }

    }
}