using RHFP.ModelData.Database.Entity;
using RHFP.Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RHFP.Repository.Repository.Interfaces
{
    public interface IRhfp_Cargo_SimboloRepository : IRepository<rhfp_cargo_simbolo>
    {
        void CargoSimboloAdd(rhfp_cargo_simbolo entity);
        rhfp_cargo_simbolo CargoSimboloGetById(int id);
        IEnumerable<rhfp_cargo_simbolo> CargoSimboloGetAll();
        void CargoSimboloUpdate(rhfp_cargo_simbolo entity);
        void CargoSimboloDelete(int id);
    }

}
