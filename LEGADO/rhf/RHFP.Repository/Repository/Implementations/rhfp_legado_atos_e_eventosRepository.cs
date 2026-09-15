using RHFP.DTO.Helpers;
using RHFP.DTO.DTOS;
using RHFP.ModelData.Database.Entity;
using RHFP.Repository.Base;
using RHFP.Repository.Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.ComponentModel.DataAnnotations;

namespace RHFP.Repository.Implementations
{


    public class rhfp_legado_atos_e_eventosRepository
    : GenericRepository<rhfp_legado_atos_e_eventos>, IRhfp_legado_atos_e_eventosRepository
    {

        public rhfp_legado_atos_e_eventosRepository(RHFPContext context) : base(context) { }
        public void AtosEEventosAdd(rhfp_legado_atos_e_eventos entity) => base.Add(entity);
        public rhfp_legado_atos_e_eventos AtosEEventosGetById(int id) => base.GetById(id);
        public IEnumerable<rhfp_legado_atos_e_eventos> AtosEEventosGetAll() => base.GetAll();
        public void AtosEEventosUpdate(rhfp_legado_atos_e_eventos entity) => base.Update(entity);
        public void AtosEEventosDelete(int id) => base.Delete(id);

        

        /// <summary>
        /// Consulta de Atos e Eventos com filtros opcionais.
        /// Diferente do Financeiro, este relatório não possui subtabelas (não há
        /// agrupamento por competência/tipo de cargo): o retorno é uma lista única,
        /// ordenada por ate_numero, dep_matricula, ate_nome, ate_cpf_servidor,
        /// ate_cod_ato, ate_cod_texto, ate_atos_eventos.
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
            try
            {
                var cpfNormalizado = UtilitariosHelper.NormalizarCpf(ate_cpf_servidor);
                var nomeTrim = ate_nome?.Trim();
                var codTextoTrim = ate_cod_texto?.Trim();
                var atosEventosTrim = ate_atos_eventos?.Trim();
                var descTpAtoTrim = ate_desc_tp_ato?.Trim();
                var originalSimboloTrim = ate_original_simbolo?.Trim();
                var originalCargoTrim = ate_original_cargo?.Trim();
                var acumuladoSimboloTrim = ate_acumulado_simbolo?.Trim();
                var acumuladoCargoTrim = ate_acumulado_cargo?.Trim();
                var comissaoSimboloTrim = ate_comissao_simbolo?.Trim();
                var dtDiarioOficialNormalizada = UtilitariosHelper.NormalizarDataAAAAMMDD(ate_dt_diario_oficial);
                var dtAtoNormalizada = UtilitariosHelper.NormalizarDataAAAAMMDD(ate_dt_ato);
                var dtValidadeNormalizada = UtilitariosHelper.NormalizarDataAAAAMMDD(ate_dt_validade);
                var dtFinalNormalizada = UtilitariosHelper.NormalizarDataAAAAMMDD(ate_dt_final);

                var temFiltro = ate_numero > 0
                    || dep_matricula > 0
                    || !string.IsNullOrWhiteSpace(nomeTrim)
                    || !string.IsNullOrWhiteSpace(cpfNormalizado)
                    || ate_cod_ato > 0
                    || !string.IsNullOrWhiteSpace(codTextoTrim)
                    || !string.IsNullOrWhiteSpace(atosEventosTrim)
                    || ate_num_diario_oficial > 0
                    || !string.IsNullOrWhiteSpace(dtDiarioOficialNormalizada)
                    || ate_tp_ato > 0
                    || !string.IsNullOrWhiteSpace(descTpAtoTrim)
                    || !string.IsNullOrWhiteSpace(dtAtoNormalizada)
                    || !string.IsNullOrWhiteSpace(dtValidadeNormalizada)
                    || !string.IsNullOrWhiteSpace(dtFinalNormalizada)
                    || ate_prazo > 0
                    || ate_original_cod_simbolo > 0
                    || !string.IsNullOrWhiteSpace(originalSimboloTrim)
                    || !string.IsNullOrWhiteSpace(originalCargoTrim)
                    || ate_acumulado_quadro > 0
                    || ate_acumulado_cod_simbolo > 0
                    || !string.IsNullOrWhiteSpace(acumuladoSimboloTrim)
                    || !string.IsNullOrWhiteSpace(acumuladoCargoTrim)
                    || ate_comissao_quadro > 0
                    || ate_comissao_cod_simbolo > 0
                    || !string.IsNullOrWhiteSpace(comissaoSimboloTrim);

                if (!temFiltro)
                    return new List<rhfp_legado_atos_e_eventosDTO>();

                IQueryable<rhfp_legado_atos_e_eventos> query = _context.rhfp_legado_atos_e_eventos.AsQueryable();

                if (ate_numero > 0)
                    query = query.Where(x => x.ate_numero == ate_numero);

                if (dep_matricula > 0)
                    query = query.Where(x => x.dep_matricula == dep_matricula);

                if (!string.IsNullOrWhiteSpace(nomeTrim))
                    query = query.Where(x => x.ate_nome != null && x.ate_nome.Contains(nomeTrim));

                if (!string.IsNullOrWhiteSpace(cpfNormalizado))
                    query = query.Where(x => x.ate_cpf_servidor == cpfNormalizado);

                if (ate_cod_ato > 0)
                    query = query.Where(x => x.ate_cod_ato == ate_cod_ato);

                if (!string.IsNullOrWhiteSpace(codTextoTrim))
                    query = query.Where(x => x.ate_cod_texto != null && x.ate_cod_texto.Contains(codTextoTrim));

                if (!string.IsNullOrWhiteSpace(atosEventosTrim))
                    query = query.Where(x => x.ate_atos_eventos != null && x.ate_atos_eventos.Contains(atosEventosTrim));

                if (ate_num_diario_oficial > 0)
                    query = query.Where(x => x.ate_num_diario_oficial == ate_num_diario_oficial);

                if (!string.IsNullOrWhiteSpace(dtDiarioOficialNormalizada))
                    query = query.Where(x => x.ate_dt_diario_oficial == dtDiarioOficialNormalizada);

                if (ate_tp_ato > 0)
                    query = query.Where(x => x.ate_tp_ato == ate_tp_ato);

                if (!string.IsNullOrWhiteSpace(descTpAtoTrim))
                    query = query.Where(x => x.ate_desc_tp_ato != null && x.ate_desc_tp_ato.Contains(descTpAtoTrim));

                if (!string.IsNullOrWhiteSpace(dtAtoNormalizada))
                    query = query.Where(x => x.ate_dt_ato == dtAtoNormalizada);

                if (!string.IsNullOrWhiteSpace(dtValidadeNormalizada))
                    query = query.Where(x => x.ate_dt_validade == dtValidadeNormalizada);

                if (!string.IsNullOrWhiteSpace(dtFinalNormalizada))
                    query = query.Where(x => x.ate_dt_final == dtFinalNormalizada);

                if (ate_prazo > 0)
                    query = query.Where(x => x.ate_prazo == ate_prazo);

                if (ate_original_cod_simbolo > 0)
                    query = query.Where(x => x.ate_original_cod_simbolo == ate_original_cod_simbolo);

                if (!string.IsNullOrWhiteSpace(originalSimboloTrim))
                    query = query.Where(x => x.ate_original_simbolo != null && x.ate_original_simbolo.Contains(originalSimboloTrim));

                if (!string.IsNullOrWhiteSpace(originalCargoTrim))
                    query = query.Where(x => x.ate_original_cargo != null && x.ate_original_cargo.Contains(originalCargoTrim));

                if (ate_acumulado_quadro > 0)
                    query = query.Where(x => x.ate_acumulado_quadro == ate_acumulado_quadro);

                if (ate_acumulado_cod_simbolo > 0)
                    query = query.Where(x => x.ate_acumulado_cod_simbolo == ate_acumulado_cod_simbolo);

                if (!string.IsNullOrWhiteSpace(acumuladoSimboloTrim))
                    query = query.Where(x => x.ate_acumulado_simbolo != null && x.ate_acumulado_simbolo.Contains(acumuladoSimboloTrim));

                if (!string.IsNullOrWhiteSpace(acumuladoCargoTrim))
                    query = query.Where(x => x.ate_acumulado_cargo != null && x.ate_acumulado_cargo.Contains(acumuladoCargoTrim));

                if (ate_comissao_quadro > 0)
                    query = query.Where(x => x.ate_comissao_quadro == ate_comissao_quadro);

                if (ate_comissao_cod_simbolo > 0)
                    query = query.Where(x => x.ate_comissao_cod_simbolo == ate_comissao_cod_simbolo);

                if (!string.IsNullOrWhiteSpace(comissaoSimboloTrim))
                    query = query.Where(x => x.ate_comissao_simbolo != null && x.ate_comissao_simbolo.Contains(comissaoSimboloTrim));

                // Sem subtabelas: apenas a ordenação fixa solicitada.
                var resultado = query
                    .OrderBy(x => x.dep_matricula)
                    .ThenBy(x => x.ate_nome)
                    .ThenBy(x => x.ate_cpf_servidor)

                    .ThenBy(x => x.ate_dt_validade)
                    .ThenBy(x => x.ate_tp_ato)
                    .ThenBy(x => x.ate_cod_ato)
                    .ThenBy(x => x.ate_cod_texto)
                    .ThenBy(x => x.ate_atos_eventos)
                    .Select(x => new rhfp_legado_atos_e_eventosDTO
                    {
                        ate_numero = x.ate_numero,
                        dep_matricula = x.dep_matricula,
                        ate_nome = x.ate_nome,
                        ate_cpf_servidor = x.ate_cpf_servidor,
                        ate_cod_ato = x.ate_cod_ato,
                        ate_cod_texto = x.ate_cod_texto,
                        ate_atos_eventos = x.ate_atos_eventos,
                        ate_num_diario_oficial = x.ate_num_diario_oficial,
                        ate_dt_diario_oficial = x.ate_dt_diario_oficial,
                        ate_tp_ato = x.ate_tp_ato,
                        ate_desc_tp_ato = x.ate_desc_tp_ato,
                        ate_dt_ato = x.ate_dt_ato,
                        ate_dt_validade = x.ate_dt_validade,
                        ate_dt_final = x.ate_dt_final,
                        ate_prazo = x.ate_prazo,
                        ate_original_quadro = x.ate_original_quadro,
                        ate_original_cod_simbolo = x.ate_original_cod_simbolo,
                        ate_original_simbolo = x.ate_original_simbolo,
                        ate_original_cargo = x.ate_original_cargo,
                        ate_acumulado_quadro = x.ate_acumulado_quadro,
                        ate_acumulado_cod_simbolo = x.ate_acumulado_cod_simbolo,
                        ate_acumulado_simbolo = x.ate_acumulado_simbolo,
                        ate_acumulado_cargo = x.ate_acumulado_cargo,
                        ate_comissao_quadro = x.ate_comissao_quadro,
                        ate_comissao_cod_simbolo = x.ate_comissao_cod_simbolo,
                        ate_comissao_simbolo = x.ate_comissao_simbolo,
                        ate_comissao_cargo = x.ate_comissao_cargo,
                        ate_cod_validade_gratificada = x.ate_cod_validade_gratificada,
                        ate_cod_simbolo_funcao_gratificada = x.ate_cod_simbolo_funcao_gratificada,
                        ate_simbolo_funcao_gratificada = x.ate_simbolo_funcao_gratificada,
                        ate_cargo_funcao_gratificada = x.ate_cargo_funcao_gratificada,
                        ate_instrumento_legal = x.ate_instrumento_legal,
                        ate_historico = x.ate_historico,
                        ate_artigo_legal = x.ate_artigo_legal,
                        ate_inciso_legal = x.ate_inciso_legal,
                        ate_alinea_legal = x.ate_alinea_legal,
                        ate_paragrafo_legal = x.ate_paragrafo_legal,
                        ate_dt_inicio_aquisitivo = x.ate_dt_inicio_aquisitivo,
                        ate_dt_final_aquisitivo = x.ate_dt_final_aquisitivo
                    })
                    .ToList();

                return resultado;
            }
            catch (Exception ex)
            {
                var detalhe = ex.InnerException?.Message ?? ex.Message;
                throw new Exception($"Erro ao consultar atos e eventos. Detalhe: {detalhe}", ex);
            }
        }
    }
}
