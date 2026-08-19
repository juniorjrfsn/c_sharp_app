using RHFP.DTO.DTOS;
using RHFP.ModelData.Database.Entity;
using RHFP.Repository.Implementations;
using System.Collections.Generic;
using System.Linq;

namespace RHFP.Business
{
    public class rhfp_statusBusiness
    {
        private readonly rhfp_statusRepository _repository;

        public rhfp_statusBusiness()
        {
            var context = new RHFPContext();
            _repository = new rhfp_statusRepository(context);
        }

        public rhfp_statusBusiness(rhfp_statusRepository repository)
        {
            _repository = repository;
        }

        public List<rhfp_statusDTO> GetAll() => _repository.GetAll().Select(c => new rhfp_statusDTO { st_cod = c.st_cod, st_status = c.st_status }).ToList();

        public rhfp_statusDTO GetById(int id)
        {
            var c = _repository.GetById(id);
            return c != null ? new rhfp_statusDTO { st_cod = c.st_cod, st_status = c.st_status } : null;
        }

        public void Create(rhfp_statusDTO dto) => _repository.Add(new rhfp_status { st_status = dto.st_status });

        public void Update(rhfp_statusDTO dto) => _repository.Update(new rhfp_status { st_cod = dto.st_cod, st_status = dto.st_status });

        public void Delete(int id) => _repository.Delete(id);
    }
}
