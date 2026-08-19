using RHFP.ModelData.Database.Entity;
using RHFP.Repository.Interfaces;
using System.Collections.Generic;

namespace RHFP.Repository.Repository.Interfaces
{
    public interface IRhfp_Estado_CivilRepository : IRepository<rhfp_estado_civil>
    {
        void EstadoCivilAdd(rhfp_estado_civil entity);
        rhfp_estado_civil EstadoCivilGetById(int id);
        IEnumerable<rhfp_estado_civil> EstadoCivilGetAll();
        void EstadoCivilUpdate(rhfp_estado_civil entity);
        void EstadoCivilDelete(int id);
    }

}
