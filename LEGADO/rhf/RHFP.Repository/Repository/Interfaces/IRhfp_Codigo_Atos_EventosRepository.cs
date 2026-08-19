using RHFP.ModelData.Database.Entity;
using RHFP.Repository.Interfaces;
using System.Collections.Generic;

namespace RHFP.Repository.Repository.Interfaces
{
    public interface IRhfp_Codigo_Atos_EventosRepository : IRepository<rhfp_codigo_atos_eventos>
    {
        void CodigoAtosEventosAdd(rhfp_codigo_atos_eventos entity);
        rhfp_codigo_atos_eventos CodigoAtosEventosGetById(int id);
        IEnumerable<rhfp_codigo_atos_eventos> CodigoAtosEventosGetAll();
        void CodigoAtosEventosUpdate(rhfp_codigo_atos_eventos entity);
        void CodigoAtosEventosDelete(int id);
    }

}
