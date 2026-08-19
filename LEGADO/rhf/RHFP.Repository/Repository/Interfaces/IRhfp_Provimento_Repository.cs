using RHFP.ModelData.Database.Entity;
using RHFP.Repository.Interfaces;
using System.Collections.Generic;

namespace RHFP.Repository.Repository.Interfaces
{
    public interface IRhfp_Provimento_Repository : IRepository<rhfp_provimento>
    {
        void ProvimentoAdd(rhfp_provimento entity);
        rhfp_provimento ProvimentoGetById(int id);
        IEnumerable<rhfp_provimento> ProvimentoGetAll();
        void ProvimentoUpdate(rhfp_provimento entity);
        void ProvimentoDelete(int id);
    }

}
