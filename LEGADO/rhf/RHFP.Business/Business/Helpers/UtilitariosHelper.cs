using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RHFP.Business.Business.Helpers
{
    public static class UtilitariosHelper
    {
        public static string NormalizarCpf(string valor)
        {
            if (string.IsNullOrWhiteSpace(valor))
                return string.Empty;

            return valor.Replace(".", "").Replace("-", "").Replace("/", "").Trim();
        }

        public static string NormalizarData(string valor)
        {
            if (string.IsNullOrWhiteSpace(valor))
                return string.Empty;

            var texto = valor.Trim();
            if (texto.Length == 8 && texto.All(char.IsDigit))
                return texto;

            if (DateTime.TryParse(texto, out var data))
                return data.ToString("yyyyMMdd");

            string[] partes;
            if (texto.Contains('/'))
                partes = texto.Split('/');
            else if (texto.Contains('-'))
                partes = texto.Split('-');
            else
                return string.Empty;

            if (partes.Length != 3)
                return string.Empty;

            var dia = partes[0];
            var mes = partes[1];
            var ano = partes[2];

            if (dia.Length == 2 && mes.Length == 2 && ano.Length == 4 &&
                int.TryParse(dia, out _) && int.TryParse(mes, out _) && int.TryParse(ano, out _))
            {
                return ano + mes + dia;
            }

            return string.Empty;
        }

        public static string NormalizarCompetencia(string valor)
        {
            if (string.IsNullOrWhiteSpace(valor))
                return string.Empty;

            var texto = valor.Trim();

            // Se já está no formato YYYYMM (6 dígitos)
            if (texto.Length == 6 && texto.All(char.IsDigit))
                return texto;

            // Se está no formato MM/YYYY ou MM-YYYY (enviado pelo formulário)
            string[] partes;
            if (texto.Contains('/'))
                partes = texto.Split('/');
            else if (texto.Contains('-'))
                partes = texto.Split('-');
            else
                return string.Empty;

            if (partes.Length != 2)
                return string.Empty;

            var mes = partes[0];
            var ano = partes[1];

            if (mes.Length == 2 && ano.Length == 4 &&
                int.TryParse(mes, out var mesInt) && int.TryParse(ano, out var anoInt) &&
                mesInt >= 1 && mesInt <= 12)
            {
                return ano + mes;
            }

            return string.Empty;
        }
    }
}
