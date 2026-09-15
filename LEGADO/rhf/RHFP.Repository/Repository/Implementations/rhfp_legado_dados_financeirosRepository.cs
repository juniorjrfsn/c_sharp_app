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
    // rhfp_legado_dados_financeirosRepository
    // rhfp_legado_dados_financeirosRepository

    public class rhfp_legado_dados_financeirosRepository
    : GenericRepository<rhfp_legado_dados_financeiros>, IRhfp_legado_dados_FinanceirosRepository
    {

        /*  
            SELECT [fin_numero]
            ,[dpe_matricula]
            ,[dfu_tp_cargo]
            ,[fin_competencia_ano_mes]
            ,[rub_codigo]
            ,[rub_descricao]
            ,[fin_dt_inicio]
            ,[fin_valor]
            ,[fin_perc_pontos_dia_hora]
            ,[fin_qtd_urv]
            FROM [pms_rhfp_desenvolvimento].[dbo].[rhfp_legado_financeiro]
        */

        public List<rhfp_legado_dados_financeirosDTO> GetFinanceiro_0(int matricula = 0, string cpf = null, string competencia = null, int cod_rubrica = 0)
        {
            cpf = cpf.Replace(".", "").Replace("-", "").Replace("/", "").Trim();
            var resultado = _context.rhfp_legado_dados_financeiros.Where(r => r.dpe_matricula == matricula)
                .Select(r => new rhfp_legado_dados_financeirosDTO
                {
                    dpe_matricula = r.dpe_matricula,
                    dfu_tp_cargo = r.dfu_tp_cargo,
                    dfu_desc_tp_cargo = r.dfu_desc_tp_cargo,
                    fin_competencia_ano_mes = r.fin_competencia_ano_mes,
                    rub_codigo = r.rub_codigo,
                    rub_descricao = r.rub_descricao,
                    fin_dt_inicio = r.fin_dt_inicio,
                    fin_valor = r.fin_valor,
                    fin_perc_pontos_dia_hora = r.fin_perc_pontos_dia_hora ?? 0m,
                    fin_qtd_urv = r.fin_qtd_urv ?? 0m
                })
                .ToList();

            return resultado;
        }


        public List<rhfp_legado_dados_financeirosDTO> GetFinanceiro(
             int matricula = 0,
             string cpf = null,
             string nome = null,
             string competencia = null,
             int cod_rubrica = 0,
             string dtIni = null,
             string dtFim = null
        )
        {

            try
            {
                var cpfNormalizado = UtilitariosHelper.NormalizarCpf(cpf);
                var nomeTrim = nome?.Trim();
                var dtIniFormatada = UtilitariosHelper.NormalizarCompetencia(dtIni);
                var dtFimFormatada = UtilitariosHelper.NormalizarCompetencia(dtFim);

                var temMatricula = matricula > 0;
                var temCpf = !string.IsNullOrWhiteSpace(cpfNormalizado);
                var temNome = !string.IsNullOrWhiteSpace(nomeTrim);
                var temCompetencia = !string.IsNullOrWhiteSpace(competencia);
                var temDtIni = !string.IsNullOrWhiteSpace(dtIniFormatada);
                var temDtFim = !string.IsNullOrWhiteSpace(dtFimFormatada);

                if (!temMatricula && !temCpf && !temNome && !temCompetencia && !temDtIni && !temDtFim)
                    return new List<rhfp_legado_dados_financeirosDTO>();

                // dp NÃO é mais um join direto por matrícula: rhfp_financeiro tem várias linhas
                // por matrícula (uma por competência/rubrica), então um join só por matrícula
                // multiplicava cada linha de lf por todas as linhas de dp com a mesma matrícula
                // (fan-out), duplicando registros e inflando os totais.
                // Em vez disso, usamos uma subquery correlacionada (FirstOrDefault) que traz
                // no máximo 1 nome/cpf por matrícula.

                var query = from lf in _context.rhfp_legado_dados_financeiros
                            select new
                            {
                                lf,
                                dp = _context.rhfp_legado_dados_pessoais
                                    .Where(d => d.dpe_matricula == lf.dpe_matricula)
                                    .Select(d => new { d.dpe_nome_servidor, d.dpe_cpf_servidor })
                                    .FirstOrDefault()
                            };

                if (temMatricula)
                {
                    query = query.Where(x => x.lf.dpe_matricula == matricula);
                }

                if (temCpf)
                {
                    query = query.Where(x => x.dp != null && x.dp.dpe_cpf_servidor == cpfNormalizado);
                }

                if (temNome)
                    query = query.Where(x => x.dp != null && x.dp.dpe_nome_servidor != null && x.dp.dpe_nome_servidor.Contains(nomeTrim));

                if (temCompetencia)
                    query = query.Where(x => x.lf.fin_competencia_ano_mes == competencia);

                if (temDtIni)
                    query = query.Where(x => x.lf.fin_competencia_ano_mes != null && string.Compare(x.lf.fin_competencia_ano_mes, dtIniFormatada) >= 0);

                if (temDtFim)
                    query = query.Where(x => x.lf.fin_competencia_ano_mes != null && string.Compare(x.lf.fin_competencia_ano_mes, dtFimFormatada) <= 0);

                if (cod_rubrica > 0)
                    query = query.Where(x => x.lf.rub_codigo == cod_rubrica);

                var dados = query.Select(x => new
                {
                    x.lf.fin_numero,
                    x.lf.dpe_matricula,
                    nome_ = x.dp != null ? x.dp.dpe_nome_servidor : null,
                    cpf_ = x.dp != null ? x.dp.dpe_cpf_servidor : null,
                    x.lf.dfu_tp_cargo,
                    x.lf.dfu_desc_tp_cargo,
                    x.lf.fin_competencia_ano_mes,
                    x.lf.rub_codigo,
                    x.lf.rub_descricao,
                    x.lf.fin_dt_inicio,
                    x.lf.fin_valor,
                    x.lf.fin_perc_pontos_dia_hora,
                    x.lf.fin_qtd_urv
                }).ToList();

                if (dados == null || dados.Count == 0)
                    return new List<rhfp_legado_dados_financeirosDTO>();

                var calculado = dados.Select(r => new
                {
                    r,
                    PROVENTO = (r.rub_codigo > 0 && r.rub_codigo < 100) ? r.fin_valor : 0m,
                    DESCONTO = (r.rub_codigo >= 100 && r.rub_codigo <= 400) ? r.fin_valor : 0m
                }).ToList();

                var totaisPorParticao = calculado
                    .GroupBy(x => new { x.r.dpe_matricula, x.r.fin_competencia_ano_mes, x.r.dfu_tp_cargo })
                    .ToDictionary(g => g.Key, g => new
                    {
                        TOTAL_PROVENTO = g.Sum(x => x.PROVENTO),
                        TOTAL_DESCONTO = g.Sum(x => x.DESCONTO)
                    });

                var resultado = calculado.Select(x =>
                {
                    var chave = new { x.r.dpe_matricula, x.r.fin_competencia_ano_mes, x.r.dfu_tp_cargo };
                    var tot = totaisPorParticao[chave];

                    return new rhfp_legado_dados_financeirosDTO
                    {
                        fin_numero = x.r.fin_numero,
                        dpe_matricula = x.r.dpe_matricula,
                        dpe_cpf_servidor = x.r.cpf_,
                        dpe_nome_servidor = x.r.nome_,
                        dfu_tp_cargo = x.r.dfu_tp_cargo,
                        dfu_desc_tp_cargo = x.r.dfu_desc_tp_cargo, // Assuming dfu_desc_tp_cargo is the same as dfu_tp_cargo for now
                        fin_competencia_ano_mes = x.r.fin_competencia_ano_mes,
                        rub_codigo = x.r.rub_codigo,
                        rub_descricao = x.r.rub_descricao,
                        fin_dt_inicio = x.r.fin_dt_inicio,
                        fin_valor = x.r.fin_valor,
                        fin_perc_pontos_dia_hora = x.r.fin_perc_pontos_dia_hora,
                        fin_qtd_urv = x.r.fin_qtd_urv,
                        PROVENTO = x.PROVENTO,
                        DESCONTO = x.DESCONTO,
                        TOTAL_PROVENTO = tot.TOTAL_PROVENTO,
                        TOTAL_DESCONTO = tot.TOTAL_DESCONTO,
                        LIQUIDO = tot.TOTAL_PROVENTO - tot.TOTAL_DESCONTO
                    };
                })
                .OrderBy(x => x.dpe_matricula)
                .ThenBy(x => x.fin_competencia_ano_mes)
                .ThenBy(x => x.dfu_tp_cargo)
                .ToList();

                return resultado;
            }
            catch (Exception ex)
            {
                var detalhe = ex.InnerException?.Message ?? ex.Message;
                throw new Exception($"Erro ao consultar financeiro. Detalhe: {detalhe}", ex);
            }
        }

        public rhfp_legado_dados_financeirosRepository(RHFPContext context) : base(context) { }
   
        public void FinanceiroAdd(rhfp_legado_dados_financeiros entity) => base.Add(entity);
        public rhfp_legado_dados_financeiros FinanceiroGetById(int id) => base.GetById(id);
        public IEnumerable<rhfp_legado_dados_financeiros> FinanceiroGetAll() => base.GetAll();
        public void FinanceiroUpdate(rhfp_legado_dados_financeiros entity) => base.Update(entity);
        public void FinanceiroDelete(int id) => base.Delete(id);
    }
}