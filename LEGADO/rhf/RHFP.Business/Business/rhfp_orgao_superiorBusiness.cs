using RHFP.DTO.DTOS;
using RHFP.ModelData.Database.Entity;
using RHFP.Repository.Implementations;
using System.Collections.Generic;
using System.Linq;

namespace RHFP.Business
{
    public class rhfp_orgao_superiorBusiness
    {
        private readonly rhfp_orgao_superiorRepository _repository;

        public rhfp_orgao_superiorBusiness()
        {
            var context = new RHFPContext();
            _repository = new rhfp_orgao_superiorRepository(context);
        }

        public rhfp_orgao_superiorBusiness(rhfp_orgao_superiorRepository repository)
        {
            _repository = repository;
        }

        public List<rhfp_orgao_superiorDTO> GetAll() => _repository.GetAll().Select(c => new rhfp_orgao_superiorDTO { os_cod = c.os_cod, os_orgao = c.os_orgao }).ToList();

        public rhfp_orgao_superiorDTO GetById(int id)
        {
            var c = _repository.GetById(id);
            return c != null ? new rhfp_orgao_superiorDTO { os_cod = c.os_cod, os_orgao = c.os_orgao } : null;
        }

        public void Create(rhfp_orgao_superiorDTO dto) => _repository.Add(new rhfp_orgao_superior { os_orgao = dto.os_orgao });

        public void Update(rhfp_orgao_superiorDTO dto) => _repository.Update(new rhfp_orgao_superior { os_cod = dto.os_cod, os_orgao = dto.os_orgao });

        public void Delete(int id) => _repository.Delete(id);
    }
}
