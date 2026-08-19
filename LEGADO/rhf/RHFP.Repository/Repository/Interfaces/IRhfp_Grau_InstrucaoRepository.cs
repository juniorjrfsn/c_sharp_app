using RHFP.ModelData.Database.Entity;
using RHFP.Repository.Interfaces;
using System.Collections.Generic;

namespace RHFP.Repository.Repository.Interfaces
{
    public interface IRhfp_Grau_InstrucaoRepository : IRepository<rhfp_grau_instrucao>
    {
        void GrauInstrucaoAdd(rhfp_grau_instrucao entity);
        rhfp_grau_instrucao GrauInstrucaoGetById(int id);
        IEnumerable<rhfp_grau_instrucao> GrauInstrucaoGetAll();
        void GrauInstrucaoUpdate(rhfp_grau_instrucao entity);
        void GrauInstrucaoDelete(int id);
    }

}
