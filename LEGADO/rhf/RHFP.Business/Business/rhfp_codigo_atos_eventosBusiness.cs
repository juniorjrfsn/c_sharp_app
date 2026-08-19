using RHFP.DTO.DTOS;
using RHFP.ModelData.Database.Entity;
using RHFP.Repository.Implementations;
using System.Collections.Generic;
using System.Linq;

namespace RHFP.Business
{
    public class rhfp_codigo_atos_eventosBusiness
    {
        private readonly rhfp_codigo_atos_eventosRepository _repository;

        public rhfp_codigo_atos_eventosBusiness()
        {
            var context = new RHFPContext();
            _repository = new rhfp_codigo_atos_eventosRepository(context);
        }

        public rhfp_codigo_atos_eventosBusiness(rhfp_codigo_atos_eventosRepository repository)
        {
            _repository = repository;
        }

        public List<rhfp_codigo_atos_eventosDTO> GetAll() => _repository.GetAll().Select(c => new rhfp_codigo_atos_eventosDTO
        {
            ae_cod = c.ae_cod,
            ae_atos_eventos = c.ae_atos_eventos,
            ae_status = c.ae_status,
            ae_ato_texto = c.ae_ato_texto
        }).ToList();

        public rhfp_codigo_atos_eventosDTO GetById(int id)
        {
            var c = _repository.GetById(id);
            return c != null ? new rhfp_codigo_atos_eventosDTO
            {
                ae_cod = c.ae_cod,
                ae_atos_eventos = c.ae_atos_eventos,
                ae_status = c.ae_status,
                ae_ato_texto = c.ae_ato_texto
            } : null;
        }

        public void Create(rhfp_codigo_atos_eventosDTO dto) => _repository.Add(new rhfp_codigo_atos_eventos
        {
            ae_atos_eventos = dto.ae_atos_eventos,
            ae_status = dto.ae_status,
            ae_ato_texto = dto.ae_ato_texto
        });

        public void Update(rhfp_codigo_atos_eventosDTO dto) => _repository.Update(new rhfp_codigo_atos_eventos
        {
            ae_cod = dto.ae_cod,
            ae_atos_eventos = dto.ae_atos_eventos,
            ae_status = dto.ae_status,
            ae_ato_texto = dto.ae_ato_texto
        });

        public void Delete(int id) => _repository.Delete(id);
    }
}
