using RHFP.DTO.DTOS;
using RHFP.ModelData.Database.Entity;
using RHFP.Repository.Implementations;
using System.Collections.Generic;

namespace RHFP.Business
{
    public class rhfp_legado_atos_eventosBusiness
    {
        private readonly rhfp_legado_atos_e_eventosBusiness _inner;

        public rhfp_legado_atos_eventosBusiness()
        {
            _inner = new rhfp_legado_atos_e_eventosBusiness();
        }

        public rhfp_legado_atos_eventosBusiness(rhfp_legado_atos_e_eventosRepository repository)
        {
            _inner = new rhfp_legado_atos_e_eventosBusiness(repository);
        }

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
            return _inner.GetAtosEventos(
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
    }
}
