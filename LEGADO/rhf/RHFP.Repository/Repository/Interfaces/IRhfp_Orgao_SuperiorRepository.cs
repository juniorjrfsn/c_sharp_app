using RHFP.ModelData.Database.Entity;
using RHFP.Repository.Interfaces;
using System.Collections.Generic;

namespace RHFP.Repository.Repository.Interfaces
{
    public interface IRhfp_Orgao_SuperiorRepository : IRepository<rhfp_orgao_superior>
    {
        void OrgaoSuperiorAdd(rhfp_orgao_superior entity);
        rhfp_orgao_superior OrgaoSuperiorGetById(int id);
        IEnumerable<rhfp_orgao_superior> OrgaoSuperiorGetAll();
        void OrgaoSuperiorUpdate(rhfp_orgao_superior entity);
        void OrgaoSuperiorDelete(int id);
    }

}
