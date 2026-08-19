using RHFP.ModelData.Database.Entity;
using RHFP.Repository.Base;
using RHFP.Repository.Repository.Interfaces;
using System.Collections.Generic;

namespace RHFP.Repository.Implementations
{
    public class rhfp_orgao_superiorRepository
        : GenericRepository<rhfp_orgao_superior>, IRhfp_Orgao_SuperiorRepository
    {
        public rhfp_orgao_superiorRepository(RHFPContext context) : base(context) { }
        public void OrgaoSuperiorAdd(rhfp_orgao_superior entity) => base.Add(entity);
        public rhfp_orgao_superior OrgaoSuperiorGetById(int id) => base.GetById(id);
        public IEnumerable<rhfp_orgao_superior> OrgaoSuperiorGetAll() => base.GetAll();
        public void OrgaoSuperiorUpdate(rhfp_orgao_superior entity) => base.Update(entity);
        public void OrgaoSuperiorDelete(int id) => base.Delete(id);
    }

}
