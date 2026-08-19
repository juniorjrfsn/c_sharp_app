using RHFP.DTO.DTOS;
using RHFP.ModelData.Database.Entity;
using RHFP.Repository.Implementations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RHFP.Business
{
    // RhfpCargoSimboloBusiness.cs
    public class rhfp_cargo_simboloBusiness
    {
        private readonly rhfp_cargo_simboloRepository _rhfpCargoSimboloRepository;

        // Construtor padrão: cria o contexto e instancia o repositório
        public rhfp_cargo_simboloBusiness()
        {
            var context = new RHFPContext(); // cria o contexto
            _rhfpCargoSimboloRepository = new rhfp_cargo_simboloRepository(context);
        }

        // Construtor opcional para uso interno ou testes
        public rhfp_cargo_simboloBusiness(rhfp_cargo_simboloRepository rhfpCargoSimboloRepository)
        {
            _rhfpCargoSimboloRepository = rhfpCargoSimboloRepository;
        }

        public List<rhfp_cargo_simboloDTO> GetAll()
        {
            var cargos = _rhfpCargoSimboloRepository.GetAll();
            return cargos?.Select(c => new rhfp_cargo_simboloDTO
            {
                cs_cod = c.cs_cod,
                cs_cargo = c.cs_cargo,
                cs_simbolo = c.cs_simbolo
            }).ToList() ?? new List<rhfp_cargo_simboloDTO>();
        }

        public rhfp_cargo_simboloDTO GetById(int id)
        {
            var cargo = _rhfpCargoSimboloRepository.GetById(id);
            if (cargo == null) return null;
            
            return new rhfp_cargo_simboloDTO
            {
                cs_cod = cargo.cs_cod,
                cs_cargo = cargo.cs_cargo,
                cs_simbolo = cargo.cs_simbolo
            };
        }

        public void Create(rhfp_cargo_simboloDTO dto)
        {
            var cargo = new rhfp_cargo_simbolo
            {
                cs_cargo = dto.cs_cargo,
                cs_simbolo = dto.cs_simbolo
            };
            _rhfpCargoSimboloRepository.Add(cargo);
        }

        public void Update(rhfp_cargo_simboloDTO dto)
        {
            var cargo = new rhfp_cargo_simbolo
            {
                cs_cod = dto.cs_cod,
                cs_cargo = dto.cs_cargo,
                cs_simbolo = dto.cs_simbolo
            };
            _rhfpCargoSimboloRepository.Update(cargo);
        }

        public void Delete(int id)
        {
            _rhfpCargoSimboloRepository.Delete(id);
        }
    }
}
