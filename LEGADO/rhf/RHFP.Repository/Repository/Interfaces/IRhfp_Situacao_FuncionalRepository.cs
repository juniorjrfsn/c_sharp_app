using RHFP.ModelData.Database.Entity;
using RHFP.Repository.Interfaces;
using System.Collections.Generic;

namespace RHFP.Repository.Repository.Interfaces
{
    public interface IRhfp_Situacao_FuncionalRepository : IRepository<rhfp_situacao_funcional>
    {
        void SituacaoFuncionalAdd(rhfp_situacao_funcional entity);
        rhfp_situacao_funcional SituacaoFuncionalGetById(int id);
        IEnumerable<rhfp_situacao_funcional> SituacaoFuncionalGetAll();
        void SituacaoFuncionalUpdate(rhfp_situacao_funcional entity);
        void SituacaoFuncionalDelete(int id);
    }

}
