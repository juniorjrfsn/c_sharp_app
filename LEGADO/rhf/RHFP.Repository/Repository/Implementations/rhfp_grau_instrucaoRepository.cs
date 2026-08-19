using RHFP.ModelData.Database.Entity;
using RHFP.Repository.Base;
using RHFP.Repository.Repository.Interfaces;
using System.Collections.Generic;

namespace RHFP.Repository.Implementations
{
    public class rhfp_grau_instrucaoRepository
        : GenericRepository<rhfp_grau_instrucao>, IRhfp_Grau_InstrucaoRepository
    {
        public rhfp_grau_instrucaoRepository(RHFPContext context) : base(context) { }
        public void GrauInstrucaoAdd(rhfp_grau_instrucao entity) => base.Add(entity);
        public rhfp_grau_instrucao GrauInstrucaoGetById(int id) => base.GetById(id);
        public IEnumerable<rhfp_grau_instrucao> GrauInstrucaoGetAll() => base.GetAll();
        public void GrauInstrucaoUpdate(rhfp_grau_instrucao entity) => base.Update(entity);
        public void GrauInstrucaoDelete(int id) => base.Delete(id);
    }

}
