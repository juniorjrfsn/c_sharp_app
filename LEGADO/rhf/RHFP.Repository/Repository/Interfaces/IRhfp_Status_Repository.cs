using RHFP.ModelData.Database.Entity;
using RHFP.Repository.Interfaces;
using System.Collections.Generic;

namespace RHFP.Repository.Repository.Interfaces
{
    public interface IRhfp_Status_Repository : IRepository<rhfp_status>
    {
        void StatusAdd(rhfp_status entity);
        rhfp_status StatusGetById(int id);
        IEnumerable<rhfp_status> StatusGetAll();
        void StatusUpdate(rhfp_status entity);
        void StatusDelete(int id);
    }

}
