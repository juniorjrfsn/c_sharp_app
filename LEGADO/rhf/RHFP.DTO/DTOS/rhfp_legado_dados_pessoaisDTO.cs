using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Security.Policy;
using System.Text;
using System.Threading.Tasks;

namespace RHFP.DTO.DTOS
{
    public class rhfp_legado_dados_pessoaisDTO
    {

        public int dpe_numero { get; set; }
        public int dpe_matricula { get; set; }
        public string dpe_dt_atualizacao { get; set; }
        public string dpe_nome_servidor { get; set; }
        public string dpe_cpf_servidor { get; set; }
        public string dpe_num_doc_identidade { get; set; }
        public string dpe_orgao_doc_identidade { get; set; }
        public string dpe_uf_doc_identidade { get; set; }
        public string dpe_num_registro { get; set; }
        public string dpe_orgao_registro { get; set; }
        public string dpe_uf_registro { get; set; }
        public string dpe_num_cntps { get; set; }
        public string dpe_serie_cntps { get; set; }
        public string dpe_uf_cntps { get; set; }
        public string dpe_num_titulo_eleitor { get; set; }
        public string dpe_secao_eleitoral { get; set; }
        public string dpe_zona_eleitoral { get; set; }
        public string dpe_pis_pasep { get; set; }
        public string dpe_num_conta_bancaria_anterior { get; set; }
        public string dpe_cod_banco_anterior { get; set; }
        public string dpe_cod_agencia_bancaria_anterior { get; set; }
        public string dpe_num_razao { get; set; }
        public Nullable<int> dpe_num_cbo { get; set; }
        public string dpe_desc_cbo { get; set; }
        public short dpe_cod_estado_civil { get; set; }
        public string dpe_desc_estado_civil { get; set; }
        public short dpe_cod_grau_instrucao { get; set; }
        public string dpe_desc_grau_instrucao { get; set; }
        public string dpe_dt_admissao { get; set; }
        public string dpe_dt_nascimento { get; set; }
        public Nullable<int> dpe_cod_municipio_nascimento { get; set; }
        public string dpe_nome_municipio_nascimento { get; set; }
        public short dpe_cod_salario_familia_especial { get; set; }
        public short dpe_cod_imposto_renda { get; set; }
        public short dpe_cod_salario_familia { get; set; }
        public string dpe_nome_pai { get; set; }
        public string dpe_nome_mae { get; set; }
        public string dpe_cod_servidor { get; set; }
        public string dpe_nome_conjuge { get; set; }
        public string dpe_endereco { get; set; }
        public string dpe_bairro { get; set; }
        public Nullable<int> dpe_cod_municipio_endereco { get; set; }
        public string dpe_nome_municipio_endereco { get; set; }
        public string dpe_complemento_logradouro { get; set; }
        public string dpe_num_militar { get; set; }
        public string dpe_categoria_militar { get; set; }
        public string dpe_num_csm_militar { get; set; }
        public Nullable<short> dpe_cod_origem { get; set; }
        public string dpe_dt_chegada { get; set; }
        public string dpe_cod_previsul { get; set; }
        public Nullable<short> dpe_cod_situacao { get; set; }
        public string dpe_desc_situacao { get; set; }
        public Nullable<int> dpe_cep { get; set; }
        public string dpe_telefone { get; set; }
        public string dpe_num_conta_bancaria { get; set; }
        public string dpe_digito_conta_bancaria { get; set; }
        public string dpe_cod_agencia_bancaria { get; set; }
        public string dpe_digito_agencia_bancaria { get; set; }
        public string dpe_cod_banco { get; set; }
        public string dpe_casa_propria { get; set; }
        public string dpe_cpf_proprio { get; set; }
        public string dpe_cod_operacao_bancaria { get; set; }
        public string dpe_dt_expedicao_rg { get; set; }


        /*
         SELECT TOP (1000) [dpe_numero]
      ,[dpe_matricula]
      ,[dpe_dt_atualizacao]
      ,[dpe_nome_servidor]
      ,[dpe_cpf_servidor]
      ,[dpe_num_doc_identidade]
      ,[dpe_orgao_doc_identidade]
      ,[dpe_uf_doc_identidade]
      ,[dpe_num_registro]
      ,[dpe_orgao_registro]
      ,[dpe_uf_registro]
      ,[dpe_num_cntps]
      ,[dpe_serie_cntps]
      ,[dpe_uf_cntps]
      ,[dpe_num_titulo_eleitor]
      ,[dpe_secao_eleitoral]
      ,[dpe_zona_eleitoral]
      ,[dpe_pis_pasep]
      ,[dpe_num_conta_bancaria_anterior]
      ,[dpe_cod_banco_anterior]
      ,[dpe_cod_agencia_bancaria_anterior]
      ,[dpe_num_razao]
      ,[dpe_num_cbo]
      ,[dpe_desc_cbo]
      ,[dpe_cod_estado_civil]
      ,[dpe_desc_estado_civil]
      ,[dpe_cod_grau_instrucao]
      ,[dpe_desc_grau_instrucao]
      ,[dpe_dt_admissao]
      ,[dpe_dt_nascimento]
      ,[dpe_cod_municipio_nascimento]
      ,[dpe_nome_municipio_nascimento]
      ,[dpe_cod_salario_familia_especial]
      ,[dpe_cod_imposto_renda]
      ,[dpe_cod_salario_familia]
      ,[dpe_nome_pai]
      ,[dpe_nome_mae]
      ,[dpe_cod_servidor]
      ,[dpe_nome_conjuge]
      ,[dpe_endereco]
      ,[dpe_bairro]
      ,[dpe_cod_municipio_endereco]
      ,[dpe_nome_municipio_endereco]
      ,[dpe_complemento_logradouro]
      ,[dpe_num_militar]
      ,[dpe_categoria_militar]
      ,[dpe_num_csm_militar]
      ,[dpe_cod_origem]
      ,[dpe_dt_chegada]
      ,[dpe_cod_previsul]
      ,[dpe_cod_situacao]
      ,[dpe_desc_situacao]
      ,[dpe_cep]
      ,[dpe_telefone]
      ,[dpe_num_conta_bancaria]
      ,[dpe_digito_conta_bancaria]
      ,[dpe_cod_agencia_bancaria]
      ,[dpe_digito_agencia_bancaria]
      ,[dpe_cod_banco]
      ,[dpe_casa_propria]
      ,[dpe_cpf_proprio]
      ,[dpe_cod_operacao_bancaria]
      ,[dpe_dt_expedicao_rg]
  FROM [pms_rhfp_desenvolvimento].[dbo].[rhfp_legado_dados_pessoais]

         
         */



    }
}