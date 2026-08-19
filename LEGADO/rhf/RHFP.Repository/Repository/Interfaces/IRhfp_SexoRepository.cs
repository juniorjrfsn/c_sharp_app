using RHFP.ModelData.Database.Entity;
using RHFP.Repository.Interfaces;
using System.Collections.Generic;

namespace RHFP.Repository.Repository.Interfaces
{
    public interface IRhfp_SexoRepository : IRepository<rhfp_sexo>
    {
        void SexoAdd(rhfp_sexo entity);
        rhfp_sexo SexoGetById(int id);
        IEnumerable<rhfp_sexo> SexoGetAll();
        void SexoUpdate(rhfp_sexo entity);
        void SexoDelete(int id);
    }

}
