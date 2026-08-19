using RHFP.ModelData.Database.Entity;
using RHFP.Repository.Base;
using RHFP.Repository.Repository.Interfaces;
using System.Collections.Generic;

namespace RHFP.Repository.Implementations
{
    public class rhfp_estado_civilRepository
        : GenericRepository<rhfp_estado_civil>, IRhfp_Estado_CivilRepository
    {
        public rhfp_estado_civilRepository(RHFPContext context) : base(context) { }
        public void EstadoCivilAdd(rhfp_estado_civil entity) => base.Add(entity);
        public rhfp_estado_civil EstadoCivilGetById(int id) => base.GetById(id);
        public IEnumerable<rhfp_estado_civil> EstadoCivilGetAll() => base.GetAll();
        public void EstadoCivilUpdate(rhfp_estado_civil entity) => base.Update(entity);
        public void EstadoCivilDelete(int id) => base.Delete(id);
    }

}
