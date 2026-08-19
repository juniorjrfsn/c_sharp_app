using SIGEVENTOS.Business.Exceptions;
using SIGEVENTOS.DTO.DTOS;
using SIGEVENTOS.ModelData.Database.Entity;
using SIGEVENTOS.Repository.Generic.Implementations;
using System;
using System.Collections.Generic;
using System.Linq;

namespace SIGEVENTOS.Business
{
    public class UsuarioBusiness
    {
        private readonly UsuariosRepository _usuariosRepository;

        // Construtor padrão: cria o contexto e instancia o repositório
        public UsuarioBusiness()
        {
            var context = new SigEventosContext(); // cria o contexto
            _usuariosRepository = new UsuariosRepository(context);
        }

        // Construtor opcional para uso interno ou testes
        internal UsuarioBusiness(UsuariosRepository usuariosRepository)
        {
            _usuariosRepository = usuariosRepository;
        }

        /// <summary>
        /// Obtém os usuários pelo CPF, evento e questionário.
        /// Aqui você pode aplicar regras de negócio antes de chamar o repositório.
        /// </summary>
        public List<UsuariosDto> ObterUsuarios(string cpf, short eve_num_evento, short que_num_questionario)
        {
            // Exemplo de regra de negócio: validar CPF antes de consultar
            if (string.IsNullOrWhiteSpace(cpf))
                throw new BusinessValidationException("CPF não pode ser vazio!");

            if (!ValidarCPF(cpf))
                throw new BusinessValidationException("CPF inválido!");

            // Chama o repositório
            var usuarios = _usuariosRepository.GetUsuario(cpf, eve_num_evento, que_num_questionario);

            // Exemplo de regra adicional: filtrar apenas usuários ativos
            usuarios = usuarios.FindAll(u => u.SituacaoUsuario == "A");

            return usuarios;
        }

        public static bool ValidarCPF(string cpf)
        {
            // Remove caracteres não numéricos
            cpf = new string(cpf.Where(char.IsDigit).ToArray());

            // Verifica se tem 11 dígitos
            if (cpf.Length != 11) return false;

            // Rejeita CPFs com todos os dígitos iguais
            if (cpf.All(c => c == cpf[0])) return false;

            // Calcula primeiro dígito verificador
            int soma = 0;
            for (int i = 0; i < 9; i++)
                soma += (cpf[i] - '0') * (10 - i);

            int resto = soma % 11;
            int digito1 = resto < 2 ? 0 : 11 - resto;

            if (digito1 != (cpf[9] - '0')) return false;

            // Calcula segundo dígito verificador
            soma = 0;
            for (int i = 0; i < 10; i++)
                soma += (cpf[i] - '0') * (11 - i);

            resto = soma % 11;
            int digito2 = resto < 2 ? 0 : 11 - resto;

            if (digito2 != (cpf[10] - '0')) return false;

            return true;
        }



        public List<UsuariosDto> ObterUsuarios()
        {
            return _usuariosRepository.ObterUsuarios();
        }


        public int SalvarUsuario(string usr_cpf, string usr_nome, string usr_email, string usr_telefone, string usr_instituicao, string usr_municipio)
        {
            return _usuariosRepository.SalvarUsuario(usr_cpf, usr_nome, usr_email, usr_telefone, usr_instituicao, usr_municipio);
        }


        public int SalvarUsuariosResultados(int usr_num_usuario, short eve_num_evento, short que_num_questionario, decimal ure_nota_minima, decimal ure_nota_resultado, DateTime ure_dt_resultado, string ure_situacao)
        {
            return _usuariosRepository.SalvarUsuariosResultados(usr_num_usuario, eve_num_evento, que_num_questionario, ure_nota_minima, ure_nota_resultado, ure_dt_resultado, ure_situacao);
        }

        public List<UsuariosDto> VerificausuarioResultado(int usr_num_usuario, short eve_num_evento, short que_num_questionario)
        {
            return _usuariosRepository.VerificausuarioResultado( usr_num_usuario,  eve_num_evento,  que_num_questionario);
        }

     
    }
}
