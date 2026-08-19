using RHFP.ModelData.Database.Entity;
using RHFP.Repository.Base;
using RHFP.Repository.Repository.Interfaces;
using System.Collections.Generic;

namespace RHFP.Repository.Implementations
{
    public class rhfp_codigo_atos_eventosRepository
        : GenericRepository<rhfp_codigo_atos_eventos>, IRhfp_Codigo_Atos_EventosRepository
    {
        public rhfp_codigo_atos_eventosRepository(RHFPContext context) : base(context) { }
        public void CodigoAtosEventosAdd(rhfp_codigo_atos_eventos entity) => base.Add(entity);
        public rhfp_codigo_atos_eventos CodigoAtosEventosGetById(int id) => base.GetById(id);
        public IEnumerable<rhfp_codigo_atos_eventos> CodigoAtosEventosGetAll() => base.GetAll();
        public void CodigoAtosEventosUpdate(rhfp_codigo_atos_eventos entity) => base.Update(entity);
        public void CodigoAtosEventosDelete(int id) => base.Delete(id);
    }

}
