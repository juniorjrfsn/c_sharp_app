using RHFP.ModelData.Database.Entity;
using RHFP.Repository.Interfaces;
using System.Collections.Generic;

namespace RHFP.Repository.Repository.Interfaces
{
    public interface IRhfp_Municipio_Repository : IRepository<rhfp_municipio>
    {
        void MunicipioAdd(rhfp_municipio entity);
        rhfp_municipio MunicipioGetById(int id);
        IEnumerable<rhfp_municipio> MunicipioGetAll();
        void MunicipioUpdate(rhfp_municipio entity);
        void MunicipioDelete(int id);
    }

}
