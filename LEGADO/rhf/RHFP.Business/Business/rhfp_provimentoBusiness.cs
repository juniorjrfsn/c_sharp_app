using RHFP.DTO.DTOS;
using RHFP.ModelData.Database.Entity;
using RHFP.Repository.Implementations;
using System.Collections.Generic;
using System.Linq;

namespace RHFP.Business
{
    public class rhfp_provimentoBusiness
    {
        private readonly rhfp_provimentoRepository _repository;

        public rhfp_provimentoBusiness()
        {
            var context = new RHFPContext();
            _repository = new rhfp_provimentoRepository(context);
        }

        public rhfp_provimentoBusiness(rhfp_provimentoRepository repository)
        {
            _repository = repository;
        }

        public List<rhfp_provimentoDTO> GetAll() => _repository.GetAll().Select(c => new rhfp_provimentoDTO { pr_cod = c.pr_cod, pr_provimento = c.pr_provimento }).ToList();

        public rhfp_provimentoDTO GetById(int id)
        {
            var c = _repository.GetById(id);
            return c != null ? new rhfp_provimentoDTO { pr_cod = c.pr_cod, pr_provimento = c.pr_provimento } : null;
        }

        public void Create(rhfp_provimentoDTO dto) => _repository.Add(new rhfp_provimento { pr_provimento = dto.pr_provimento });

        public void Update(rhfp_provimentoDTO dto) => _repository.Update(new rhfp_provimento { pr_cod = dto.pr_cod, pr_provimento = dto.pr_provimento });

        public void Delete(int id) => _repository.Delete(id);
    }
}
