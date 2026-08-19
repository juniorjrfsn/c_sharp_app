using RHFP.ModelData.Database.Entity;
using RHFP.Repository.Base;
using RHFP.Repository.Repository.Interfaces;
using System.Collections.Generic;

namespace RHFP.Repository.Implementations
{
    public class rhfp_provimentoRepository
        : GenericRepository<rhfp_provimento>, IRhfp_Provimento_Repository
    {
        public rhfp_provimentoRepository(RHFPContext context) : base(context) { }
        public void ProvimentoAdd(rhfp_provimento entity) => base.Add(entity);
        public rhfp_provimento ProvimentoGetById(int id) => base.GetById(id);
        public IEnumerable<rhfp_provimento> ProvimentoGetAll() => base.GetAll();
        public void ProvimentoUpdate(rhfp_provimento entity) => base.Update(entity);
        public void ProvimentoDelete(int id) => base.Delete(id);
    }

}
