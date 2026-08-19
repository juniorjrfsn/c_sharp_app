using RHFP.ModelData.Database.Entity;
using RHFP.Repository.Base;
using RHFP.Repository.Repository.Interfaces;
using System.Collections.Generic;

namespace RHFP.Repository.Implementations
{
    public class rhfp_sexoRepository
        : GenericRepository<rhfp_sexo>, IRhfp_SexoRepository
    {
        public rhfp_sexoRepository(RHFPContext context) : base(context) { }
        public void SexoAdd(rhfp_sexo entity) => base.Add(entity);
        public rhfp_sexo SexoGetById(int id) => base.GetById(id);
        public IEnumerable<rhfp_sexo> SexoGetAll() => base.GetAll();
        public void SexoUpdate(rhfp_sexo entity) => base.Update(entity);
        public void SexoDelete(int id) => base.Delete(id);
    }

}
