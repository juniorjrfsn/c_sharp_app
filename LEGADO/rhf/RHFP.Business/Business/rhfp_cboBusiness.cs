using RHFP.DTO.DTOS;
using RHFP.ModelData.Database.Entity;
using RHFP.Repository.Implementations;
using System.Collections.Generic;
using System.Linq;

namespace RHFP.Business
{
    public class rhfp_cboBusiness
    {
        private readonly rhfp_cboRepository _repository;

        public rhfp_cboBusiness()
        {
            var context = new RHFPContext();
            _repository = new rhfp_cboRepository(context);
        }

        public rhfp_cboBusiness(rhfp_cboRepository repository)
        {
            _repository = repository;
        }

        public List<rhfp_cboDTO> GetAll() => _repository.GetAll().Select(c => new rhfp_cboDTO { cb_cod = c.cb_cod, cb_cbo = c.cb_cbo }).ToList();

        public rhfp_cboDTO GetById(int id)
        {
            var c = _repository.GetById(id);
            return c != null ? new rhfp_cboDTO { cb_cod = c.cb_cod, cb_cbo = c.cb_cbo } : null;
        }

        public void Create(rhfp_cboDTO dto) => _repository.Add(new rhfp_cbo { cb_cbo = dto.cb_cbo });

        public void Update(rhfp_cboDTO dto) => _repository.Update(new rhfp_cbo { cb_cod = dto.cb_cod, cb_cbo = dto.cb_cbo });

        public void Delete(int id) => _repository.Delete(id);
    }
}
