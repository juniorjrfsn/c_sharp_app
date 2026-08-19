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
        public static int Versao { get; internal set; }
        public static string Relatorio { get; internal set; }
        public static string RelatorioPatronal { get; internal set; }

        public static string mov_ano { get; internal set; }
        public static int mov_numero { get; internal set; }
        public static short plc_sequencial { get; internal set; }
        public static byte[] plc_imagem { get; internal set; }
        public static byte[] plc_imagem_patr { get; internal set; }
        public static System.DateTime plc_dt_inclusao { get; internal set; }
        public static Nullable<System.DateTime> plc_dt_cancelamento { get; internal set; }
        public static Nullable<int> plc_cd_usuario_gsi_cancelamento { get; internal set; }
        public static string plc_situacao { get; internal set; }
        public static string usr_nome { get; internal set; }
        public static string usr_cpf { get; internal set; }
    }
}
