using RHFP.ModelData.Database.Entity;
using RHFP.Repository.Base;
using RHFP.Repository.Repository.Interfaces;
using System.Collections.Generic;

namespace RHFP.Repository.Implementations
{
    public class rhfp_situacao_funcionalRepository
        : GenericRepository<rhfp_situacao_funcional>, IRhfp_Situacao_FuncionalRepository
    {
        public rhfp_situacao_funcionalRepository(RHFPContext context) : base(context) { }
        public void SituacaoFuncionalAdd(rhfp_situacao_funcional entity) => base.Add(entity);
        public rhfp_situacao_funcional SituacaoFuncionalGetById(int id) => base.GetById(id);
        public IEnumerable<rhfp_situacao_funcional> SituacaoFuncionalGetAll() => base.GetAll();
        public void SituacaoFuncionalUpdate(rhfp_situacao_funcional entity) => base.Update(entity);
        public void SituacaoFuncionalDelete(int id) => base.Delete(id);
    }

}
