using RHFP.DTO.DTOS;
using RHFP.ModelData.Database.Entity;
using RHFP.Repository.Implementations;
using System.Collections.Generic;
using System.Linq;

namespace RHFP.Business
{
    public class rhfp_municipioBusiness
    {
        private readonly rhfp_municipioRepository _repository;

        public rhfp_municipioBusiness()
        {
            var context = new RHFPContext();
            _repository = new rhfp_municipioRepository(context);
        }

        public rhfp_municipioBusiness(rhfp_municipioRepository repository)
        {
            _repository = repository;
        }

        public List<rhfp_municipioDTO> GetAll() => _repository.GetAll().Select(c => new rhfp_municipioDTO { mc_cod = c.mc_cod, mc_municipio = c.mc_municipio }).ToList();

        public rhfp_municipioDTO GetById(int id)
        {
            var c = _repository.GetById(id);
            return c != null ? new rhfp_municipioDTO { mc_cod = c.mc_cod, mc_municipio = c.mc_municipio } : null;
        }

        public void Create(rhfp_municipioDTO dto) => _repository.Add(new rhfp_municipio { mc_municipio = dto.mc_municipio });

        public void Update(rhfp_municipioDTO dto) => _repository.Update(new rhfp_municipio { mc_cod = dto.mc_cod, mc_municipio = dto.mc_municipio });

        public void Delete(int id) => _repository.Delete(id);
    }
}
