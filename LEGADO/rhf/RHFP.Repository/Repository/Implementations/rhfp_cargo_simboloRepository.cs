using RHFP.ModelData.Database.Entity;
using RHFP.Repository.Base;
using RHFP.Repository.Interfaces;
using RHFP.Repository.Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RHFP.Repository.Implementations
{
    // RhfpCargoSimboloRepository.cs
    public class rhfp_cargo_simboloRepository
    : GenericRepository<rhfp_cargo_simbolo>, IRhfp_Cargo_SimboloRepository
    {
        public rhfp_cargo_simboloRepository(RHFPContext context) : base(context) { }
        public void CargoSimboloAdd(rhfp_cargo_simbolo entity) => base.Add(entity);
        public rhfp_cargo_simbolo CargoSimboloGetById(int id) => base.GetById(id);
        public IEnumerable<rhfp_cargo_simbolo> CargoSimboloGetAll() => base.GetAll();
        public void CargoSimboloUpdate(rhfp_cargo_simbolo entity) => base.Update(entity);
        public void CargoSimboloDelete(int id) => base.Delete(id);
    }

}
