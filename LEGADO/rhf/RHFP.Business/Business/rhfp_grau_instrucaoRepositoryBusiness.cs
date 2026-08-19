using RHFP.DTO.DTOS;
using RHFP.ModelData.Database.Entity;
using RHFP.Repository.Implementations;
using System.Collections.Generic;
using System.Linq;

namespace RHFP.Business
{
    public class rhfp_grau_instrucaoRepositoryBusiness
    {
        private readonly rhfp_grau_instrucaoRepository _repository;

        public rhfp_grau_instrucaoRepositoryBusiness()
        {
            var context = new RHFPContext();
            _repository = new rhfp_grau_instrucaoRepository(context);
        }

        public rhfp_grau_instrucaoRepositoryBusiness(rhfp_grau_instrucaoRepository repository)
        {
            _repository = repository;
        }

        public List<rhfp_grau_instrucaoDTO> GetAll() => _repository.GetAll().Select(c => new rhfp_grau_instrucaoDTO { gi_cod = c.gi_cod, gi_grau_instrucao = c.gi_grau_instrucao }).ToList();

        public rhfp_grau_instrucaoDTO GetById(int id)
        {
            var c = _repository.GetById(id);
            return c != null ? new rhfp_grau_instrucaoDTO { gi_cod = c.gi_cod, gi_grau_instrucao = c.gi_grau_instrucao } : null;
        }

        public void Create(rhfp_grau_instrucaoDTO dto) => _repository.Add(new rhfp_grau_instrucao { gi_grau_instrucao = dto.gi_grau_instrucao });

        public void Update(rhfp_grau_instrucaoDTO dto) => _repository.Update(new rhfp_grau_instrucao { gi_cod = dto.gi_cod, gi_grau_instrucao = dto.gi_grau_instrucao });

        public void Delete(int id) => _repository.Delete(id);
    }
}
