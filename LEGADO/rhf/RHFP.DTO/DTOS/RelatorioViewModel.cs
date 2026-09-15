using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RHFP.DTO.DTOS
{
    public static class RelatorioViewModel
    {
        public static string mov_nome_completo { get; set; }
        public static int Versao { get; set; }
        public static string Relatorio { get; set; }
        public static string RelatorioPatronal { get; set; }
        public static string RelatorioFinanceiro { get; set; }
        public static string RelatorioDadosFuncionais { get; set; }
        public static string RelatorioDadosPessoais { get; set; }
        public static string RelatorioAtosEventos { get; set; }

        public static string mov_ano { get; set; }
        public static int mov_numero { get; set; }
        public static short plc_sequencial { get; set; }
        public static byte[] plc_imagem { get; set; }
        public static byte[] plc_imagem_patr { get; set; }
        public static System.DateTime plc_dt_inclusao { get; set; }
        public static Nullable<System.DateTime> plc_dt_cancelamento { get; set; }
        public static Nullable<int> plc_cd_usuario_gsi_cancelamento { get; set; }
        public static string plc_situacao { get; set; }
        public static string usr_nome { get; set; }
        public static string usr_cpf { get; set; }
        public static string nome { get; set; }
        public static short sit_codigo { get; set; }
        public static string pct_movimento { get; set; }
        public static string pct_situacao { get; set; }
        public static string RelatorioPageHeader { get; set; }
        public static string RelatorioPageHeadContent { get; set; }
    }
}
