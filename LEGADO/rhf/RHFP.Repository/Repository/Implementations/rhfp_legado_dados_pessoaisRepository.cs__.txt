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


    public class rhfp_legado_dados_pessoaisRepository
    : GenericRepository<rhfp_legado_dados_pessoais>, IRhfp_legado_dados_pessoaisRepository
    {

        public rhfp_legado_dados_pessoaisDTO GetDados(int matricula = 0, string cpf = null)
        {
            cpf = cpf.Replace(".", "").Replace("-", "").Replace("/", "").Trim();
            var resultado = _context.rhfp_legado_dados_pessoais.Where(r => r.dpe_matricula == matricula)
                .Select(r => new rhfp_legado_dados_pessoaisDTO
                {
                    dpe_numero = r.dpe_numero,
                    dpe_matricula = r.dpe_matricula,
                    dpe_dt_atualizacao = r.dpe_dt_atualizacao,
                    dpe_nome_servidor = r.dpe_nome_servidor,
                    dpe_cpf_servidor = r.dpe_cpf_servidor,
                    dpe_num_doc_identidade = r.dpe_num_doc_identidade,
                    dpe_orgao_doc_identidade = r.dpe_orgao_doc_identidade,
                    dpe_uf_doc_identidade = r.dpe_uf_doc_identidade,
                    dpe_num_registro = r.dpe_num_registro,
                    dpe_orgao_registro = r.dpe_orgao_registro,
                    dpe_uf_registro = r.dpe_uf_registro,
                    dpe_num_cntps = r.dpe_num_cntps,
                    dpe_serie_cntps = r.dpe_serie_cntps,
                    dpe_uf_cntps = r.dpe_uf_cntps,
                    dpe_num_titulo_eleitor = r.dpe_num_titulo_eleitor,
                    dpe_secao_eleitoral = r.dpe_secao_eleitoral,
                    dpe_zona_eleitoral = r.dpe_zona_eleitoral,
                    dpe_pis_pasep = r.dpe_pis_pasep,
                    dpe_num_conta_bancaria_anterior = r.dpe_num_conta_bancaria_anterior,
                    dpe_cod_banco_anterior = r.dpe_cod_banco_anterior,
                    dpe_cod_agencia_bancaria_anterior = r.dpe_cod_agencia_bancaria_anterior,
                    dpe_num_razao = r.dpe_num_razao,
                    dpe_num_cbo = r.dpe_num_cbo,
                    dpe_desc_cbo = r.dpe_desc_cbo,
                    dpe_cod_estado_civil = r.dpe_cod_estado_civil,
                    dpe_desc_estado_civil = r.dpe_desc_estado_civil,
                    dpe_cod_grau_instrucao = r.dpe_cod_grau_instrucao,
                    dpe_desc_grau_instrucao = r.dpe_desc_grau_instrucao,
                    dpe_dt_admissao = r.dpe_dt_admissao,
                    dpe_dt_nascimento = r.dpe_dt_nascimento,
                    dpe_cod_municipio_nascimento = r.dpe_cod_municipio_nascimento,
                    dpe_nome_municipio_nascimento = r.dpe_nome_municipio_nascimento,
                    dpe_cod_salario_familia_especial = r.dpe_cod_salario_familia_especial,
                    dpe_cod_imposto_renda = r.dpe_cod_imposto_renda,
                    dpe_cod_salario_familia = r.dpe_cod_salario_familia,
                    dpe_nome_pai = r.dpe_nome_pai,
                    dpe_nome_mae = r.dpe_nome_mae,
                    dpe_cod_servidor = r.dpe_cod_servidor,
                    dpe_nome_conjuge = r.dpe_nome_conjuge,
                    dpe_endereco = r.dpe_endereco,
                    dpe_bairro = r.dpe_bairro,
                    dpe_cod_municipio_endereco = r.dpe_cod_municipio_endereco,
                    dpe_nome_municipio_endereco = r.dpe_nome_municipio_endereco,
                    dpe_complemento_logradouro = r.dpe_complemento_logradouro,
                    dpe_num_militar = r.dpe_num_militar,
                    dpe_categoria_militar = r.dpe_categoria_militar,
                    dpe_num_csm_militar = r.dpe_num_csm_militar,
                    dpe_cod_origem = r.dpe_cod_origem,
                    dpe_dt_chegada = r.dpe_dt_chegada,
                    dpe_cod_previsul = r.dpe_cod_previsul,
                    dpe_cod_situacao = r.dpe_cod_situacao,
                    dpe_desc_situacao = r.dpe_desc_situacao,
                    dpe_cep = r.dpe_cep,
                    dpe_telefone = r.dpe_telefone,
                    dpe_num_conta_bancaria = r.dpe_num_conta_bancaria,
                    dpe_digito_conta_bancaria = r.dpe_digito_conta_bancaria,
                    dpe_cod_agencia_bancaria = r.dpe_cod_agencia_bancaria,
                    dpe_digito_agencia_bancaria = r.dpe_digito_agencia_bancaria,
                    dpe_cod_banco = r.dpe_cod_banco,
                    dpe_casa_propria = r.dpe_casa_propria,
                    dpe_cpf_proprio = r.dpe_cpf_proprio,
                    dpe_cod_operacao_bancaria = r.dpe_cod_operacao_bancaria,
                    dpe_dt_expedicao_rg = r.dpe_dt_expedicao_rg
                })
                .FirstOrDefault();

            return resultado;
        }


        public List<rhfp_legado_dados_pessoaisDTO> GetDadosPessoais(
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
                    return new List<rhfp_legado_dados_pessoaisDTO>();

                IQueryable<rhfp_legado_dados_pessoais> query = _context.rhfp_legado_dados_pessoais.AsQueryable();
                if (temMatricula)
                    query = query.Where(r => r.dpe_matricula == matricula);

                if (temCpf)
                    query = query.Where(r => r.dpe_cpf_servidor == cpfNormalizado);

                if (temNome)
                    query = query.Where(r => r.dpe_nome_servidor != null && r.dpe_nome_servidor.Contains(nomeTrim));

                var resultado = query
                    .Select(r => new rhfp_legado_dados_pessoaisDTO
                    {
                        dpe_numero = r.dpe_numero,
                        dpe_matricula = r.dpe_matricula,
                        dpe_dt_atualizacao = r.dpe_dt_atualizacao,
                        dpe_nome_servidor = r.dpe_nome_servidor,
                        dpe_cpf_servidor = r.dpe_cpf_servidor,
                        dpe_num_doc_identidade = r.dpe_num_doc_identidade,
                        dpe_orgao_doc_identidade = r.dpe_orgao_doc_identidade,
                        dpe_uf_doc_identidade = r.dpe_uf_doc_identidade,
                        dpe_num_registro = r.dpe_num_registro,
                        dpe_orgao_registro = r.dpe_orgao_registro,
                        dpe_uf_registro = r.dpe_uf_registro,
                        dpe_num_cntps = r.dpe_num_cntps,
                        dpe_serie_cntps = r.dpe_serie_cntps,
                        dpe_uf_cntps = r.dpe_uf_cntps,
                        dpe_num_titulo_eleitor = r.dpe_num_titulo_eleitor,
                        dpe_secao_eleitoral = r.dpe_secao_eleitoral,
                        dpe_zona_eleitoral = r.dpe_zona_eleitoral,
                        dpe_pis_pasep = r.dpe_pis_pasep,
                        dpe_num_conta_bancaria_anterior = r.dpe_num_conta_bancaria_anterior,
                        dpe_cod_banco_anterior = r.dpe_cod_banco_anterior,
                        dpe_cod_agencia_bancaria_anterior = r.dpe_cod_agencia_bancaria_anterior,
                        dpe_num_razao = r.dpe_num_razao,
                        dpe_num_cbo = r.dpe_num_cbo,
                        dpe_desc_cbo = r.dpe_desc_cbo,
                        dpe_cod_estado_civil = r.dpe_cod_estado_civil,
                        dpe_desc_estado_civil = r.dpe_desc_estado_civil,
                        dpe_cod_grau_instrucao = r.dpe_cod_grau_instrucao,
                        dpe_desc_grau_instrucao = r.dpe_desc_grau_instrucao,
                        dpe_dt_admissao = r.dpe_dt_admissao,
                        dpe_dt_nascimento = r.dpe_dt_nascimento,
                        dpe_cod_municipio_nascimento = r.dpe_cod_municipio_nascimento,
                        dpe_nome_municipio_nascimento = r.dpe_nome_municipio_nascimento,
                        dpe_cod_salario_familia_especial = r.dpe_cod_salario_familia_especial,
                        dpe_cod_imposto_renda = r.dpe_cod_imposto_renda,
                        dpe_cod_salario_familia = r.dpe_cod_salario_familia,
                        dpe_nome_pai = r.dpe_nome_pai,
                        dpe_nome_mae = r.dpe_nome_mae,
                        dpe_cod_servidor = r.dpe_cod_servidor,
                        dpe_nome_conjuge = r.dpe_nome_conjuge,
                        dpe_endereco = r.dpe_endereco,
                        dpe_bairro = r.dpe_bairro,
                        dpe_cod_municipio_endereco = r.dpe_cod_municipio_endereco,
                        dpe_nome_municipio_endereco = r.dpe_nome_municipio_endereco,
                        dpe_complemento_logradouro = r.dpe_complemento_logradouro,
                        dpe_num_militar = r.dpe_num_militar,
                        dpe_categoria_militar = r.dpe_categoria_militar,
                        dpe_num_csm_militar = r.dpe_num_csm_militar,
                        dpe_cod_origem = r.dpe_cod_origem,
                        dpe_dt_chegada = r.dpe_dt_chegada,
                        dpe_cod_previsul = r.dpe_cod_previsul,
                        dpe_cod_situacao = r.dpe_cod_situacao,
                        dpe_desc_situacao = r.dpe_desc_situacao,
                        dpe_cep = r.dpe_cep,
                        dpe_telefone = r.dpe_telefone,
                        dpe_num_conta_bancaria = r.dpe_num_conta_bancaria,
                        dpe_digito_conta_bancaria = r.dpe_digito_conta_bancaria,
                        dpe_cod_agencia_bancaria = r.dpe_cod_agencia_bancaria,
                        dpe_digito_agencia_bancaria = r.dpe_digito_agencia_bancaria,
                        dpe_cod_banco = r.dpe_cod_banco,
                        dpe_casa_propria = r.dpe_casa_propria,
                        dpe_cpf_proprio = r.dpe_cpf_proprio,
                        dpe_cod_operacao_bancaria = r.dpe_cod_operacao_bancaria,
                        dpe_dt_expedicao_rg = r.dpe_dt_expedicao_rg
                    })
                    .OrderBy(r => r.dpe_nome_servidor)
                    .ToList();

                return resultado;
            }
            catch (Exception ex)
            {
                var detalhe = ex.InnerException?.Message ?? ex.Message;
                throw new Exception($"Erro ao consultar dados pessoais. Detalhe: {detalhe}", ex);
            }
        }

        public rhfp_legado_dados_pessoaisRepository(RHFPContext context) : base(context) { }
        public void DadospessoaisAdd(rhfp_legado_dados_pessoais entity) => base.Add(entity);
        public rhfp_legado_dados_pessoais DadospessoaisGetById(int id) => base.GetById(id);
        public IEnumerable<rhfp_legado_dados_pessoais> DadospessoaisGetAll() => base.GetAll();
        public void DadospessoaisUpdate(rhfp_legado_dados_pessoais entity) => base.Update(entity);
        public void DadospessoaisDelete(int id) => base.Delete(id);
    }
}