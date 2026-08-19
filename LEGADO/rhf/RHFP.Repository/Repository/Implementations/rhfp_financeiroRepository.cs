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
 

    public class rhfp_financeiroRepository
    : GenericRepository<rhfp_financeiro>, IRhfp_FinanceiroRepository
    {

      /*  public List<rhfp_financeiroDTO> GetFinanceiro(int matricula = 0, string cpf = null, string competencia = null, int cod_rubrica = 0)
        {
            if (!string.IsNullOrEmpty(cpf))
                cpf = cpf.Replace(".", "").Replace("-", "").Replace("/", "").Trim();

            var sql = @"
        SELECT  
            [fin_id]
            ,[ala-fi-MATRICULA]      AS ala_fi_MATRICULA
            ,[tipo-cargo-fi]         AS tipo_cargo_fi
            ,[ALA-DP-NOME-SERVIDOR]  AS ALA_DP_NOME_SERVIDOR
            ,[ALA-DP-CPF-SERVIDOR]   AS ALA_DP_CPF_SERVIDOR
            ,[COMPETENCIA-FI]        AS COMPETENCIA_FI
            ,[cod-rubrica-fi]        AS cod_rubrica_fi
            ,[pr_Rubrica]            AS pr_Rubrica
            ,[data-inicio-fi]        AS data_inicio_fi
            ,[ala-fi-valor]          AS ala_fi_valor
            ,[ala-fi-perc-pont-dia-hora] AS ala_fi_perc_pont_dia_hora
            ,[ala-fi-QTDE-URV]       AS ala_fi_QTDE_URV
            ,CASE WHEN [cod-rubrica-fi] > 0    AND [cod-rubrica-fi] < 100  THEN [ala-fi-valor] ELSE 0 END AS PROVENTO
            ,CASE WHEN [cod-rubrica-fi] >= 100 AND [cod-rubrica-fi] <= 400 THEN [ala-fi-valor] ELSE 0 END AS DESCONTO
            ,SUM(CASE WHEN [cod-rubrica-fi] > 0    AND [cod-rubrica-fi] < 100  THEN [ala-fi-valor] ELSE 0 END)
                OVER(PARTITION BY [ALA-FI-MATRICULA], [COMPETENCIA-FI], [TIPO-CARGO-FI]) AS TOTAL_PROVENTO
            ,SUM(CASE WHEN [cod-rubrica-fi] >= 100 AND [cod-rubrica-fi] <= 400 THEN [ala-fi-valor] ELSE 0 END)
                OVER(PARTITION BY [ALA-FI-MATRICULA], [COMPETENCIA-FI], [TIPO-CARGO-FI]) AS TOTAL_DESCONTO
            ,SUM(CASE WHEN [cod-rubrica-fi] > 0    AND [cod-rubrica-fi] < 100  THEN [ala-fi-valor] ELSE 0 END)
                OVER(PARTITION BY [ALA-FI-MATRICULA], [COMPETENCIA-FI], [TIPO-CARGO-FI])
             - SUM(CASE WHEN [cod-rubrica-fi] >= 100 AND [cod-rubrica-fi] <= 400 THEN [ala-fi-valor] ELSE 0 END)
                OVER(PARTITION BY [ALA-FI-MATRICULA], [COMPETENCIA-FI], [TIPO-CARGO-FI]) AS LIQUIDO
        FROM [pms_rhfp_desenvolvimento].[dbo].[rhfp_financeiro]
        WHERE [ala-fi-MATRICULA] = {0}
          AND ({1} IS NULL OR [ALA-DP-CPF-SERVIDOR] = {1})
          AND ({2} IS NULL OR [COMPETENCIA-FI] = {2})
          AND ({3} = 0 OR [cod-rubrica-fi] = {3})";

            var resultado = _context.Database
                .SqlQueryRaw<rhfp_financeiroDTO>(sql, matricula, (object)cpf ?? DBNull.Value, (object)competencia ?? DBNull.Value, cod_rubrica)
                .ToList();

            return resultado;
        }*/

        public List<rhfp_financeiroDTO> GetFinanceiro_0(int matricula = 0, string cpf = null, string competencia = null, int cod_rubrica = 0)
        {
            cpf = cpf.Replace(".", "").Replace("-", "").Replace("/", "").Trim();
            var resultado = _context.rhfp_financeiro.Where( r => r.ala_fi_MATRICULA == matricula)

                .Select(r => new rhfp_financeiroDTO
                {
                    ala_fi_MATRICULA = r.ala_fi_MATRICULA,
                    tipo_cargo_fi = r.tipo_cargo_fi,
                    ALA_DP_NOME_SERVIDOR = r.ALA_DP_NOME_SERVIDOR,
                    ALA_DP_CPF_SERVIDOR = r.ALA_DP_CPF_SERVIDOR,
                    COMPETENCIA_FI = r.COMPETENCIA_FI,
                    cod_rubrica_fi = r.cod_rubrica_fi,
                    pr_Rubrica = r.pr_Rubrica,
                    data_inicio_fi = r.data_inicio_fi,
                    ala_fi_valor = r.ala_fi_valor ?? 0m,
                    ala_fi_perc_pont_dia_hora = r.ala_fi_perc_pont_dia_hora ?? 0m,
                    ala_fi_QTDE_URV = r.ala_fi_QTDE_URV ?? 0m
                })
                .ToList();

            return resultado;
        }


        public List<rhfp_financeiroDTO> GetFinanceiro(
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
                    return new List<rhfp_financeiroDTO>();

                var query = _context.rhfp_financeiro.AsQueryable();

                if (temMatricula){
                    query = query.Where(r => r.ala_fi_MATRICULA == matricula);
                }
                
                if (temCpf)
                {
                    query = query.Where(r => r.ALA_DP_CPF_SERVIDOR == cpfNormalizado);
                }

                if (temNome)
                    query = query.Where(r => r.ALA_DP_NOME_SERVIDOR != null && r.ALA_DP_NOME_SERVIDOR.Contains(nomeTrim));

                if (temCompetencia)
                    query = query.Where(r => r.COMPETENCIA_FI == competencia);

                if (temDtIni)
                    query = query.Where(r => r.COMPETENCIA_FI != null && string.Compare(r.COMPETENCIA_FI, dtIniFormatada) >= 0);

                if (temDtFim)
                    query = query.Where(r => r.COMPETENCIA_FI != null && string.Compare(r.COMPETENCIA_FI, dtFimFormatada) <= 0);

                if (cod_rubrica > 0)
                    query = query.Where(r => r.cod_rubrica_fi == cod_rubrica);

                var dados = query.Select(r => new
                {
                    r.ala_fi_MATRICULA,
                    r.tipo_cargo_fi,
                    r.ALA_DP_NOME_SERVIDOR,
                    r.ALA_DP_CPF_SERVIDOR,
                    r.COMPETENCIA_FI,
                    r.cod_rubrica_fi,
                    r.pr_Rubrica,
                    r.data_inicio_fi,
                    ala_fi_valor = r.ala_fi_valor ?? 0m,
                    ala_fi_perc_pont_dia_hora = r.ala_fi_perc_pont_dia_hora ?? 0m,
                    ala_fi_QTDE_URV = r.ala_fi_QTDE_URV ?? 0m
                }).ToList();

                if (dados == null || dados.Count == 0)
                    return new List<rhfp_financeiroDTO>();

                var calculado = dados.Select(r => new
                {
                    r,
                    PROVENTO = (r.cod_rubrica_fi > 0 && r.cod_rubrica_fi < 100) ? r.ala_fi_valor : 0m,
                    DESCONTO = (r.cod_rubrica_fi >= 100 && r.cod_rubrica_fi <= 400) ? r.ala_fi_valor : 0m
                }).ToList();

                var totaisPorParticao = calculado
                    .GroupBy(x => new { x.r.ala_fi_MATRICULA, x.r.COMPETENCIA_FI, x.r.tipo_cargo_fi })
                    .ToDictionary(g => g.Key, g => new
                    {
                        TOTAL_PROVENTO = g.Sum(x => x.PROVENTO),
                        TOTAL_DESCONTO = g.Sum(x => x.DESCONTO)
                    });

                var resultado = calculado.Select(x =>
                {
                    var chave = new { x.r.ala_fi_MATRICULA, x.r.COMPETENCIA_FI, x.r.tipo_cargo_fi };
                    var tot = totaisPorParticao[chave];

                    return new rhfp_financeiroDTO
                    {
                        ala_fi_MATRICULA = x.r.ala_fi_MATRICULA,
                        tipo_cargo_fi = x.r.tipo_cargo_fi,
                        ALA_DP_NOME_SERVIDOR = x.r.ALA_DP_NOME_SERVIDOR,
                        ALA_DP_CPF_SERVIDOR = x.r.ALA_DP_CPF_SERVIDOR,
                        COMPETENCIA_FI = x.r.COMPETENCIA_FI,
                        cod_rubrica_fi = x.r.cod_rubrica_fi,
                        pr_Rubrica = x.r.pr_Rubrica,
                        data_inicio_fi = x.r.data_inicio_fi,
                        ala_fi_valor = x.r.ala_fi_valor,
                        ala_fi_perc_pont_dia_hora = x.r.ala_fi_perc_pont_dia_hora,
                        ala_fi_QTDE_URV = x.r.ala_fi_QTDE_URV,
                        PROVENTO = x.PROVENTO,
                        DESCONTO = x.DESCONTO,
                        TOTAL_PROVENTO = tot.TOTAL_PROVENTO,
                        TOTAL_DESCONTO = tot.TOTAL_DESCONTO,
                        LIQUIDO = tot.TOTAL_PROVENTO - tot.TOTAL_DESCONTO
                    };
                })
                .OrderBy(x => x.ala_fi_MATRICULA)
                .ThenBy(x => x.COMPETENCIA_FI)
                .ThenBy(x => x.tipo_cargo_fi)
                .ToList();

                return resultado;
            }
            catch (Exception ex)
            {
                var detalhe = ex.InnerException?.Message ?? ex.Message;
                throw new Exception($"Erro ao consultar financeiro. Detalhe: {detalhe}", ex);
            }
        }

        public rhfp_financeiroRepository(RHFPContext context) : base(context) { }
        public void FinanceiroAdd(rhfp_financeiro entity) => base.Add(entity);
        public rhfp_financeiro FinanceiroGetById(int id) => base.GetById(id);
        public IEnumerable<rhfp_financeiro> FinanceiroGetAll() => base.GetAll();
        public void FinanceiroUpdate(rhfp_financeiro entity) => base.Update(entity);
        public void FinanceiroDelete(int id) => base.Delete(id);
    }
}
