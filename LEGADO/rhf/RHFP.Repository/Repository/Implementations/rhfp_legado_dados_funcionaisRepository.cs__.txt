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


    public class rhfp_legado_dados_funcionaisRepository
    : GenericRepository<rhfp_legado_dados_funcionais>, IRhfp_legado_dados_funcionaisRepository
    {

        public rhfp_legado_dados_funcionaisRepository(RHFPContext context) : base(context) { }
        public void DadosFuncionaisAdd(rhfp_legado_dados_funcionais entity) => base.Add(entity);
        public rhfp_legado_dados_funcionais DadosFuncionaisGetById(int id) => base.GetById(id);
        public IEnumerable<rhfp_legado_dados_funcionais> DadosFuncionaisGetAll() => base.GetAll();
        public void DadosFuncionaisUpdate(rhfp_legado_dados_funcionais entity) => base.Update(entity);
        public void DadosFuncionaisDelete(int id) => base.Delete(id);

        /// <summary>
        /// Consulta de Dados Funcionais com filtros opcionais.
        /// </summary>
        public List<rhfp_legado_dados_funcionaisDTO> GetDadosFuncionais(
            int matricula = 0,
            string cpf = null,
            string nome = null
        )
        {
            try
            {
                var cpfNormalizado = UtilitariosHelper.NormalizarCpf(cpf);
                var nomeTrim = nome?.Trim();

                var temMatricula = matricula > 0;
                var temCpf = !string.IsNullOrWhiteSpace(cpfNormalizado);
                var temNome = !string.IsNullOrWhiteSpace(nomeTrim);

                if (!temMatricula && !temCpf && !temNome)
                    return new List<rhfp_legado_dados_funcionaisDTO>();

                IQueryable<rhfp_legado_dados_funcionais> query = _context.rhfp_legado_dados_funcionais.AsQueryable();

                if (temMatricula)
                    query = query.Where(x => x.dpe_matricula == matricula);

                if (temCpf)
                {
                    var cpfRaw = cpfNormalizado;
                    var cpfComMascara = cpf?.Trim() ?? string.Empty;

                    query = query.Where(x =>
                        x.dpe_cpf_servidor != null && (
                            x.dpe_cpf_servidor == cpfRaw ||
                            x.dpe_cpf_servidor == cpfComMascara ||
                            x.dpe_cpf_servidor.Replace(".", string.Empty).Replace("-", string.Empty).Replace("/", string.Empty) == cpfRaw
                        )
                    );
                }

                if (temNome)
                {
                    var nomeBusca = nomeTrim.ToLower();
                    query = query.Where(x => x.dpe_nome_servidor != null && x.dpe_nome_servidor.ToLower().Contains(nomeBusca));
                }

                var resultado = query
                    .OrderBy(x => x.dpe_nome_servidor)
                    .Select(x => new rhfp_legado_dados_funcionaisDTO
                    {
                        fun_numero = x.fun_numero,
                        dpe_matricula = x.dpe_matricula,
                        dpe_nome_servidor = x.dpe_nome_servidor,
                        dpe_cpf_servidor = x.dpe_cpf_servidor,
                        fun_dt_validade_inicial = x.fun_dt_validade_inicial,
                        fun_tp_cargo = x.fun_tp_cargo,
                        fun_desc_tp_cargo = x.fun_desc_tp_cargo,
                        fun_cod_simbolo = x.fun_cod_simbolo,
                        fun_desc_simbolo = x.fun_desc_simbolo,
                        fun_cargo = x.fun_cargo,
                        fun_cod_provimento = x.fun_cod_provimento,
                        fun_desc_provimento = x.fun_desc_provimento,
                        fun_cod_ativo_desativo = x.fun_cod_ativo_desativo,
                        fun_desc_ativo_desativo = x.fun_desc_ativo_desativo,
                        fun_cod_orgao_superior = x.fun_cod_orgao_superior,
                        fun_desc_orgao_superior = x.fun_desc_orgao_superior,
                        fun_cod_unidade_orcamentaria = x.fun_cod_unidade_orcamentaria,
                        fun_desc_unidade_orcamentaria = x.fun_desc_unidade_orcamentaria,
                        fun_cod_reparticao = x.fun_cod_reparticao,
                        fun_nome_reparticao = x.fun_nome_reparticao,
                        fun_cod_municipio = x.fun_cod_municipio,
                        fun_nome_municipio = x.fun_nome_municipio
                    })
                    .ToList();

                return resultado;
            }
            catch (Exception ex)
            {
                var detalhe = ex.InnerException?.Message ?? ex.Message;
                throw new Exception($"Erro ao consultar dados funcionais. Detalhe: {detalhe}", ex);
            }
        }
    }
}