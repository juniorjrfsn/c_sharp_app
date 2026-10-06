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
        /// Consulta a lista de segurados a partir dos dados funcionais.
        /// 
        /// Matrícula, CPF e nome são critérios de identificação combinados com OR.
        /// Retorna somente matrícula, nome e CPF, agrupados para eliminar
        /// registros funcionais duplicados do mesmo segurado.
        /// </summary>
        public List<rhfp_legado_dados_funcionaisDTO> GetListaSegurados(
            int matricula = 0,
            string cpf = null,
            string nome = null)
        {
            try
            {
                var cpfNormalizado = UtilitariosHelper.NormalizarCpf(cpf);
                var cpfInformado = cpf?.Trim();
                var nomeBusca = nome?.Trim() ?? string.Empty;

                bool temMatricula = matricula > 0;
                bool temCpf = !string.IsNullOrWhiteSpace(cpfNormalizado);
                bool temNome = !string.IsNullOrWhiteSpace(nomeBusca);

                // Não consulta a tabela inteira sem filtro
                if (!temMatricula && !temCpf && !temNome){
                    return new List<rhfp_legado_dados_funcionaisDTO>();
                }
                    

                // Critérios combinados com OR (igual ao SQL de referência)
                var funcionarios = _context.rhfp_legado_dados_funcionais
                    .AsNoTracking()
                    .Where(x =>
                        (temMatricula && x.dpe_matricula == matricula)
                        ||
                        (temNome && x.dpe_nome_servidor.StartsWith(nomeBusca))
                        ||
                        (temCpf && x.dpe_cpf_servidor != null && (
                            x.dpe_cpf_servidor == cpfNormalizado ||
                            x.dpe_cpf_servidor == cpfInformado ||
                            x.dpe_cpf_servidor.Replace(".", string.Empty)
                                .Replace("-", string.Empty)
                                .Replace("/", string.Empty) == cpfNormalizado
                        )))
                    // GROUP BY nos mesmos campos do SQL
                    .GroupBy(x => new
                    {
                        x.dpe_matricula,
                        x.dpe_nome_servidor,
                        x.dpe_cpf_servidor,
                        x.fun_desc_tp_cargo,
                        x.fun_desc_simbolo,
                        x.fun_dt_validade_inicial,
                        x.fun_desc_ativo_desativo
                    })
                    .Select(g => g.Key)
                    .OrderBy(x => x.dpe_nome_servidor)
                    .ThenBy(x => x.dpe_matricula)
                    .Take(20000)
                    .ToList();

                if (!funcionarios.Any())
                    return new List<rhfp_legado_dados_funcionaisDTO>();

                var matriculas = funcionarios
                    .Where(x => x.dpe_matricula.HasValue)
                    .Select(x => x.dpe_matricula.Value)
                    .Distinct()
                    .ToList();

                var situacoes = _context.rhfp_legado_dados_pessoais
                    .AsNoTracking()
                    .Where(x => matriculas.Contains(x.dpe_matricula))
                    .Select(x => new
                    {
                        x.dpe_matricula,
                        x.dpe_desc_situacao
                    })
                    .ToList();

                var resultado = funcionarios
                    .GroupJoin(
                        situacoes,
                        f => f.dpe_matricula,
                        p => p.dpe_matricula,
                        (f, pList) => new
                        {
                            Funcionario = f,
                            Situacao = pList
                                .Select(p => p.dpe_desc_situacao)
                                .FirstOrDefault()
                        })
                    .Select(x => new rhfp_legado_dados_funcionaisDTO
                    {
                        dpe_matricula = x.Funcionario.dpe_matricula,
                        dpe_nome_servidor = x.Funcionario.dpe_nome_servidor == null ? string.Empty : x.Funcionario.dpe_nome_servidor.Trim(),
                        dpe_cpf_servidor = x.Funcionario.dpe_cpf_servidor ?? string.Empty,
                        fun_desc_tp_cargo = x.Funcionario.fun_desc_tp_cargo,
                        fun_desc_simbolo = x.Funcionario.fun_desc_simbolo,
                        fun_dt_validade_inicial = x.Funcionario.fun_dt_validade_inicial,
                        fun_desc_ativo_desativo = x.Funcionario.fun_desc_ativo_desativo,
                        dpe_desc_situacao = string.IsNullOrWhiteSpace(x.Situacao) ? string.Empty : x.Situacao
                    })
                    .ToList();

                return resultado;
            }
            catch (Exception ex)
            {
                var detalhe = ex.InnerException?.Message ?? ex.Message;

                throw new Exception(
                    $"Erro ao consultar lista de segurados nos dados funcionais. Detalhe: {detalhe}",
                    ex);
            }
        }


        /// <summary>
        /// Consulta de Dados Funcionais com filtros opcionais.
        /// </summary>
        public List<rhfp_legado_dados_funcionaisDTO> GetDadosFuncionais(
            int matricula = 0,
            string cpf = null,
            string nome = null,
            int fun_numero = 0
        )
        {
            try
            {
                var cpfNormalizado = UtilitariosHelper.NormalizarCpf(cpf);
                var nomeTrim = nome?.Trim();
                var nomeUpper = string.IsNullOrWhiteSpace(nomeTrim) ? string.Empty : nomeTrim.ToUpperInvariant();

                var temMatricula = matricula > 0;
                var temCpf = !string.IsNullOrWhiteSpace(cpfNormalizado);
                var temNome = !string.IsNullOrWhiteSpace(nomeTrim);
                var temFunNumero = fun_numero > 0;

                if (!temMatricula && !temCpf && !temNome && !temFunNumero)
                    return new List<rhfp_legado_dados_funcionaisDTO>();

                IQueryable<rhfp_legado_dados_funcionais> query = _context.rhfp_legado_dados_funcionais.AsQueryable();

                if (temFunNumero)
                {
                    query = query.Where(x => x.fun_numero == fun_numero);
                }
                else
                {
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
                        query = query.Where(x =>
                            x.dpe_nome_servidor != null &&
                            x.dpe_nome_servidor.Trim().ToUpper().StartsWith(nomeUpper));
                    }
                }

                var resultado = query
                    .GroupJoin(
                        _context.rhfp_legado_dados_pessoais.AsNoTracking(),
                        f => f.dpe_matricula,
                        p => p.dpe_matricula,
                        (f, pList) => new
                        {
                            Funcionario = f,
                            PessoaisJoin = pList.FirstOrDefault()
                        })
                    .OrderBy(x => x.Funcionario.dpe_nome_servidor)
                    .Select(x => new rhfp_legado_dados_funcionaisDTO
                    {
                        fun_numero = x.Funcionario.fun_numero,
                        dpe_matricula = x.Funcionario.dpe_matricula,
                        dpe_nome_servidor = x.Funcionario.dpe_nome_servidor == null ? string.Empty : x.Funcionario.dpe_nome_servidor.Trim(),
                        dpe_cpf_servidor = x.Funcionario.dpe_cpf_servidor ?? string.Empty,
                        fun_dt_validade_inicial = x.Funcionario.fun_dt_validade_inicial,
                        fun_tp_cargo = x.Funcionario.fun_tp_cargo,
                        fun_desc_tp_cargo = x.Funcionario.fun_desc_tp_cargo,
                        fun_cod_simbolo = x.Funcionario.fun_cod_simbolo,
                        fun_desc_simbolo = x.Funcionario.fun_desc_simbolo,
                        fun_cargo = x.Funcionario.fun_cargo,
                        fun_cod_provimento = x.Funcionario.fun_cod_provimento,
                        fun_desc_provimento = x.Funcionario.fun_desc_provimento,
                        fun_cod_ativo_desativo = x.Funcionario.fun_cod_ativo_desativo,
                        fun_desc_ativo_desativo = x.Funcionario.fun_desc_ativo_desativo,
                        fun_cod_orgao_superior = x.Funcionario.fun_cod_orgao_superior,
                        fun_desc_orgao_superior = x.Funcionario.fun_desc_orgao_superior,
                        fun_cod_unidade_orcamentaria = x.Funcionario.fun_cod_unidade_orcamentaria,
                        fun_desc_unidade_orcamentaria = x.Funcionario.fun_desc_unidade_orcamentaria,
                        fun_cod_reparticao = x.Funcionario.fun_cod_reparticao,
                        fun_nome_reparticao = x.Funcionario.fun_nome_reparticao,
                        fun_cod_municipio = x.Funcionario.fun_cod_municipio,
                        fun_nome_municipio = x.Funcionario.fun_nome_municipio,
                        dpe_desc_situacao = x.PessoaisJoin != null ? (x.PessoaisJoin.dpe_desc_situacao ?? string.Empty) : string.Empty
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