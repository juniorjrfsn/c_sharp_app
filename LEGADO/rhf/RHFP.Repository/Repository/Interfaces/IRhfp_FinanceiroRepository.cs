using RHFP.ModelData.Database.Entity;
using RHFP.Repository.Interfaces;
using System.Collections.Generic;

namespace RHFP.Repository.Repository.Interfaces
{
   


    public interface IRhfp_FinanceiroRepository : IRepository<rhfp_financeiro>
    {
        void FinanceiroAdd(rhfp_financeiro entity);
        rhfp_financeiro FinanceiroGetById(int id);
        IEnumerable<rhfp_financeiro> FinanceiroGetAll();
        void FinanceiroUpdate(rhfp_financeiro entity);
        void FinanceiroDelete(int id);
    }
}
