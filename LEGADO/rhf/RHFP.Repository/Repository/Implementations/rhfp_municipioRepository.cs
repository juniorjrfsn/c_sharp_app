using RHFP.ModelData.Database.Entity;
using RHFP.Repository.Base;
using RHFP.Repository.Repository.Interfaces;
using System.Collections.Generic;

namespace RHFP.Repository.Implementations
{
    public class rhfp_municipioRepository
        : GenericRepository<rhfp_municipio>, IRhfp_Municipio_Repository
    {
        public rhfp_municipioRepository(RHFPContext context) : base(context) { }
        public void MunicipioAdd(rhfp_municipio entity) => base.Add(entity);
        public rhfp_municipio MunicipioGetById(int id) => base.GetById(id);
        public IEnumerable<rhfp_municipio> MunicipioGetAll() => base.GetAll();
        public void MunicipioUpdate(rhfp_municipio entity) => base.Update(entity);
        public void MunicipioDelete(int id) => base.Delete(id);
    }

}
