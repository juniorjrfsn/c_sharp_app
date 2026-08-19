using RHFP.DTO.DTOS;
using RHFP.ModelData.Database.Entity;
using RHFP.Repository.Implementations;
using System.Collections.Generic;
using System.Linq;

namespace RHFP.Business
{
    public class rhfp_estado_civilBusiness
    {
        private readonly rhfp_estado_civilRepository _repository;

        public rhfp_estado_civilBusiness()
        {
            var context = new RHFPContext();
            _repository = new rhfp_estado_civilRepository(context);
        }

        public rhfp_estado_civilBusiness(rhfp_estado_civilRepository repository)
        {
            _repository = repository;
        }

        public List<rhfp_estado_civilDTO> GetAll() => _repository.GetAll().Select(c => new rhfp_estado_civilDTO { ec_cod = c.ec_cod, ec_estado_civil = c.ec_estado_civil }).ToList();

        public rhfp_estado_civilDTO GetById(int id)
        {
            var c = _repository.GetById(id);
            return c != null ? new rhfp_estado_civilDTO { ec_cod = c.ec_cod, ec_estado_civil = c.ec_estado_civil } : null;
        }

        public void Create(rhfp_estado_civilDTO dto) => _repository.Add(new rhfp_estado_civil { ec_estado_civil = dto.ec_estado_civil });

        public void Update(rhfp_estado_civilDTO dto) => _repository.Update(new rhfp_estado_civil { ec_cod = dto.ec_cod, ec_estado_civil = dto.ec_estado_civil });

        public void Delete(int id) => _repository.Delete(id);
    }
}
