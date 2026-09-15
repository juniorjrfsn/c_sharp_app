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
    public class rhfp_legado_dados_funcionaisBusiness
    {


        private readonly rhfp_legado_dados_funcionaisRepository _repository;

        public rhfp_legado_dados_funcionaisBusiness()
        {
            var context = new RHFPContext();
            _repository = new rhfp_legado_dados_funcionaisRepository(context);
        }

        public rhfp_legado_dados_funcionaisBusiness(rhfp_legado_dados_funcionaisRepository repository)
        {
            _repository = repository;
        }

        public List<rhfp_legado_dados_funcionaisDTO> GetDadosFuncionais(int matricula = 0, string cpf = null, string nome = null)
        {
            return _repository.GetDadosFuncionais(matricula: matricula, cpf: cpf, nome: nome);
        }

    }
}