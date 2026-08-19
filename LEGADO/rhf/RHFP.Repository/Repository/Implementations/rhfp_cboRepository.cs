using RHFP.ModelData.Database.Entity;
using RHFP.Repository.Base;
using RHFP.Repository.Repository.Interfaces;
using System.Collections.Generic;

namespace RHFP.Repository.Implementations
{
    public class rhfp_cboRepository
        : GenericRepository<rhfp_cbo>, IRhfp_CboRepository
    {
        public rhfp_cboRepository(RHFPContext context) : base(context) { }
        public void CboAdd(rhfp_cbo entity) => base.Add(entity);
        public rhfp_cbo CboGetById(int id) => base.GetById(id);
        public IEnumerable<rhfp_cbo> CboGetAll() => base.GetAll();
        public void CboUpdate(rhfp_cbo entity) => base.Update(entity);
        public void CboDelete(int id) => base.Delete(id);
    }

}
