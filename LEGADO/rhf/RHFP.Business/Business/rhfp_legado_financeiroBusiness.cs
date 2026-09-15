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
    public class rhfp_legado_financeiroBusiness
    {
       

        private readonly rhfp_legado_dados_financeirosRepository _repository;

        public rhfp_legado_financeiroBusiness()
        {
            var context = new RHFPContext();
            _repository = new rhfp_legado_dados_financeirosRepository(context);
        }

        public rhfp_legado_financeiroBusiness(rhfp_legado_dados_financeirosRepository repository)
        {
            _repository = repository;
        }

        public List<rhfp_legado_dados_financeirosDTO> GetFinanceiro(int matricula = 0, string nome = null, string cpf = null, string competencia = null, int cod_rubrica = 0, string dtIni = null, string dtFim = null)
        {
            return _repository.GetFinanceiro(matricula, cpf, nome, competencia, cod_rubrica, dtIni, dtFim);
        }

    }
}
