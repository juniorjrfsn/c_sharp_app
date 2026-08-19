using RHFP.DTO.DTOS;
using RHFP.ModelData.Database.Entity;
using RHFP.Repository.Implementations;
using System.Collections.Generic;
using System.Linq;

namespace RHFP.Business
{
    public class rhfp_sexoBusiness
    {
        private readonly rhfp_sexoRepository _repository;

        public rhfp_sexoBusiness()
        {
            var context = new RHFPContext();
            _repository = new rhfp_sexoRepository(context);
        }

        public rhfp_sexoBusiness(rhfp_sexoRepository repository)
        {
            _repository = repository;
        }

        public List<rhfp_sexoDTO> GetAll() => _repository.GetAll().Select(c => new rhfp_sexoDTO { sx_cod = c.sx_cod, sx_sexo = c.sx_sexo }).ToList();

        public rhfp_sexoDTO GetById(int id)
        {
            var c = _repository.GetById(id);
            return c != null ? new rhfp_sexoDTO { sx_cod = c.sx_cod, sx_sexo = c.sx_sexo } : null;
        }

        public void Create(rhfp_sexoDTO dto) => _repository.Add(new rhfp_sexo { sx_sexo = dto.sx_sexo });

        public void Update(rhfp_sexoDTO dto) => _repository.Update(new rhfp_sexo { sx_cod = dto.sx_cod, sx_sexo = dto.sx_sexo });

        public void Delete(int id) => _repository.Delete(id);
    }
}
