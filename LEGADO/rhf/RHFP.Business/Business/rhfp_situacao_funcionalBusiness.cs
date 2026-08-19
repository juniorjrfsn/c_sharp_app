using RHFP.DTO.DTOS;
using RHFP.ModelData.Database.Entity;
using RHFP.Repository.Implementations;
using System.Collections.Generic;
using System.Linq;

namespace RHFP.Business
{
    public class rhfp_situacao_funcionalBusiness
    {
        private readonly rhfp_situacao_funcionalRepository _repository;

        public rhfp_situacao_funcionalBusiness()
        {
            var context = new RHFPContext();
            _repository = new rhfp_situacao_funcionalRepository(context);
        }

        public rhfp_situacao_funcionalBusiness(rhfp_situacao_funcionalRepository repository)
        {
            _repository = repository;
        }

        public List<rhfp_situacao_funcionalDTO> GetAll() => _repository.GetAll().Select(c => new rhfp_situacao_funcionalDTO
        {
            sf_cod = c.sf_cod,
            sf_situacao_funcional = c.sf_situacao_funcional
        }).ToList();

        public rhfp_situacao_funcionalDTO GetById(int id)
        {
            var c = _repository.GetById(id);
            return c != null ? new rhfp_situacao_funcionalDTO
            {
                sf_cod = c.sf_cod,
                sf_situacao_funcional = c.sf_situacao_funcional
            } : null;
        }

        public void Create(rhfp_situacao_funcionalDTO dto) => _repository.Add(new rhfp_situacao_funcional
        {
            sf_situacao_funcional = dto.sf_situacao_funcional
        });

        public void Update(rhfp_situacao_funcionalDTO dto) => _repository.Update(new rhfp_situacao_funcional
        {
            sf_cod = dto.sf_cod,
            sf_situacao_funcional = dto.sf_situacao_funcional
        });

        public void Delete(int id) => _repository.Delete(id);
    }
}
