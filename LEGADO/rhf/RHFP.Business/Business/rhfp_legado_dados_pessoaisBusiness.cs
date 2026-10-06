using RHFP.ModelData.Database.Entity;
using RHFP.DTO.DTOS;
using RHFP.Repository.Implementations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RHFP.Business
{
    public class rhfp_legado_dados_pessoaisBusiness 
    {


        private readonly rhfp_legado_dados_pessoaisRepository _repository;

        public rhfp_legado_dados_pessoaisBusiness()
        {
            var context = new RHFPContext();
            _repository = new rhfp_legado_dados_pessoaisRepository(context);
        }

        public rhfp_legado_dados_pessoaisBusiness(rhfp_legado_dados_pessoaisRepository repository)
        {
            _repository = repository;
        }

        public List<rhfp_legado_dados_pessoaisDTO> GetListaSegurados(int matricula = 0, string cpf = null, string nome = null)
        {
            return _repository.GetListaSegurados(matricula: matricula, cpf: cpf, nome: nome);
        }

        public List<rhfp_legado_dados_pessoaisDTO> GetDadosPessoais(int matricula = 0, string cpf = null, string nome = null, int dpe_numero = 0)
        {
            return _repository.GetDadosPessoais(matricula: matricula, cpf: cpf, nome: nome, dpe_numero: dpe_numero);
        }

        public rhfp_legado_dados_pessoaisDTO GetDados(int matricula = 0, string cpf = null)
        {
            return _repository.GetDados(matricula: matricula, cpf: cpf);
        }

    }
}
