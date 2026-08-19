using RHFP.ModelData.Database.Entity;
using RHFP.Repository.Interfaces;
using System.Collections.Generic;

namespace RHFP.Repository.Repository.Interfaces
{
    public interface IRhfp_CboRepository : IRepository<rhfp_cbo>
    {
        void CboAdd(rhfp_cbo entity);
        rhfp_cbo CboGetById(int id);
        IEnumerable<rhfp_cbo> CboGetAll();
        void CboUpdate(rhfp_cbo entity);
        void CboDelete(int id);
    }

}
