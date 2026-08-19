using RHFP.ModelData.Database.Entity;
using RHFP.Repository.Base;
using RHFP.Repository.Repository.Interfaces;
using System.Collections.Generic;

namespace RHFP.Repository.Implementations
{
    public class rhfp_statusRepository
        : GenericRepository<rhfp_status>, IRhfp_Status_Repository
    {
        public rhfp_statusRepository(RHFPContext context) : base(context) { }
        public void StatusAdd(rhfp_status entity) => base.Add(entity);
        public rhfp_status StatusGetById(int id) => base.GetById(id);
        public IEnumerable<rhfp_status> StatusGetAll() => base.GetAll();
        public void StatusUpdate(rhfp_status entity) => base.Update(entity);
        public void StatusDelete(int id) => base.Delete(id);
    }

}
