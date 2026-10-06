using RHFP.ModelData.Database.Entity;
using RHFP.DTO.DTOS;
using RHFP.Repository.Implementations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RHFP.Business
{
    public class rhfp_legado_atos_e_eventosBusiness
    {

        private readonly rhfp_legado_atos_e_eventosRepository _repository;

        public rhfp_legado_atos_e_eventosBusiness()
        {
            var context = new RHFPContext();
            _repository = new rhfp_legado_atos_e_eventosRepository(context);
        }

        public rhfp_legado_atos_e_eventosBusiness(rhfp_legado_atos_e_eventosRepository repository)
        {
            _repository = repository;
        }

        /// <summary>
        /// Ordenação fixa por: ate_numero, dep_matricula, ate_nome, ate_cpf_servidor,
        /// ate_cod_ato, ate_cod_texto, ate_atos_eventos. Sem subtabelas.
        /// </summary>
        public List<rhfp_legado_atos_e_eventosDTO> GetAtosEventos(
            int ate_numero = 0,
            int dep_matricula = 0,
            string ate_nome = null,
            string ate_cpf_servidor = null,
            int ate_cod_ato = 0,
            string ate_cod_texto = null,
            string ate_atos_eventos = null,
            int ate_num_diario_oficial = 0,
            string ate_dt_diario_oficial = null,
            short ate_tp_ato = 0,
            string ate_desc_tp_ato = null,
            string ate_dt_ato = null,
            string ate_dt_validade = null,
            string ate_dt_final = null,
            int ate_prazo = 0,
            short ate_original_cod_simbolo = 0,
            string ate_original_simbolo = null,
            string ate_original_cargo = null,
            short ate_acumulado_quadro = 0,
            short ate_acumulado_cod_simbolo = 0,
            string ate_acumulado_simbolo = null,
            string ate_acumulado_cargo = null,
            short ate_comissao_quadro = 0,
            short ate_comissao_cod_simbolo = 0,
            string ate_comissao_simbolo = null
        )
        {
            return _repository.GetAtosEventos(
                ate_numero: ate_numero,
                dep_matricula: dep_matricula,
                ate_nome: ate_nome,
                ate_cpf_servidor: ate_cpf_servidor,
                ate_cod_ato: ate_cod_ato,
                ate_cod_texto: ate_cod_texto,
                ate_atos_eventos: ate_atos_eventos,
                ate_num_diario_oficial: ate_num_diario_oficial,
                ate_dt_diario_oficial: ate_dt_diario_oficial,
                ate_tp_ato: ate_tp_ato,
                ate_desc_tp_ato: ate_desc_tp_ato,
                ate_dt_ato: ate_dt_ato,
                ate_dt_validade: ate_dt_validade,
                ate_dt_final: ate_dt_final,
                ate_prazo: ate_prazo,
                ate_original_cod_simbolo: ate_original_cod_simbolo,
                ate_original_simbolo: ate_original_simbolo,
                ate_original_cargo: ate_original_cargo,
                ate_acumulado_quadro: ate_acumulado_quadro,
                ate_acumulado_cod_simbolo: ate_acumulado_cod_simbolo,
                ate_acumulado_simbolo: ate_acumulado_simbolo,
                ate_acumulado_cargo: ate_acumulado_cargo,
                ate_comissao_quadro: ate_comissao_quadro,
                ate_comissao_cod_simbolo: ate_comissao_cod_simbolo,
                ate_comissao_simbolo: ate_comissao_simbolo
            );
        }

        /// <summary>
        /// Retorna dependentes agrupados por matricula, nome e CPF.
        /// </summary>
        public List<rhfp_legado_atos_e_eventosDTO> GetListaSegurados(int dep_matricula = 0, string ate_cpf_servidor = null, string ate_nome = null,
            string competencia = null,
            int ate_cod_ato = 0,
            string dtIni = null,
            string dtFim = null
        )
        {
            return _repository.GetListaSegurados(matricula: dep_matricula, cpf: ate_cpf_servidor, nome: ate_nome);
        }

       
    }
}
