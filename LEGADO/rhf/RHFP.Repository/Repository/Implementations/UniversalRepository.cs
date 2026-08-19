using RHFP.ModelData.Database.Entity.OracleProvider;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RHFP.Repository.Implementations
{
    public class UniversalRepository
    {
        private readonly OracleHelper _oracleHelper;

        public UniversalRepository()
        {
            _oracleHelper = new OracleHelper(); // já lê do App.config do ModelData
        }

        public Dictionary<string, string> GetDadosUsuario(string cpf)
        {
            cpf = cpf.Replace(".", "").Replace("-", "").Replace("/", ""); // SOMENTE NUMERO
            var usuario = new Dictionary<string, string>();
            DataTable resultado = _oracleHelper.ExecuteQuery(@"SELECT 
                PF.NUMERO
                , PF.CPF 							AS usr_cpf
                , PF.NOME 							AS usr_nome
                , PF.FONE_CONTATO                   AS usr_telefone
                , PF.CID
                , PF.UF_SIGLA_RESIDEN
                , EMP.CHAPA
                , PJ.COD 							AS EMP_COD
                , PJ.NOME 							AS usr_instituicao
                , '' 							    AS usr_email
                , 0 							    AS usr_num_usuario
                FROM PESSOAS_FISICAS PF
                LEFT JOIN ADRH.REG_EMPREGOS EMP ON (PF.NUMERO = EMP.PFIS_NUMERO)
                LEFT JOIN ADRH.PESSOAS_JURIDICAS PJ ON (EMP.EMP_COD = PJ.COD)
                WHERE CPF = '" + cpf + @"'
                AND (EMP.DT_RESCISAO IS NULL 
					OR EXTRACT(YEAR FROM EMP.DT_RESCISAO) IN (1753, 1900, 1901, 9999)
					OR EXTRACT(YEAR FROM EMP.DT_RESCISAO) > EXTRACT(YEAR FROM SYSDATE)
					OR (
						EXTRACT(YEAR FROM EMP.DT_RESCISAO) = EXTRACT(YEAR FROM SYSDATE)
						AND 
						EXTRACT(MONTH FROM EMP.DT_RESCISAO) >= EXTRACT(MONTH FROM SYSDATE)
					)
				)
                ORDER BY EMP.CHAPA DESC  FETCH FIRST 1 ROWS ONLY"
            );

            if (resultado != null && resultado.Rows.Count > 0)
            {
                usuario.Add("usr_num_usuario", resultado.Rows[0]["usr_num_usuario"].ToString());
                usuario.Add("usr_cpf", resultado.Rows[0]["usr_cpf"].ToString());
                usuario.Add("usr_nome", resultado.Rows[0]["usr_nome"].ToString());
                usuario.Add("usr_telefone", resultado.Rows[0]["usr_telefone"].ToString());
                usuario.Add("CID", resultado.Rows[0]["CID"].ToString());
                usuario.Add("UF_SIGLA_RESIDEN", resultado.Rows[0]["UF_SIGLA_RESIDEN"].ToString());
                usuario.Add("CHAPA", resultado.Rows[0]["CHAPA"].ToString());
                usuario.Add("EMP_COD", resultado.Rows[0]["EMP_COD"].ToString());
                usuario.Add("usr_instituicao", resultado.Rows[0]["usr_instituicao"].ToString());
                usuario.Add("usr_email", resultado.Rows[0]["usr_email"].ToString());
            }
            else
            {
                usuario.Add("usr_num_usuario", "0");
                usuario.Add("usr_cpf", "");
                usuario.Add("usr_nome", "");
                usuario.Add("usr_telefone", "");
                usuario.Add("CID", "");
                usuario.Add("UF_SIGLA_RESIDEN", "");
                usuario.Add("CHAPA", "");
                usuario.Add("EMP_COD", "");
                usuario.Add("usr_instituicao", "");
                usuario.Add("usr_email", "");
            }
            return usuario;
        }
        public List<Dictionary<string, string>> GetInstituicoes()
        {
            var instituicoes = new List<Dictionary<string, string>>();
            DataTable resultado = _oracleHelper.ExecuteQuery(@"SELECT PJ.COD AS EMP_COD, PJ.NOME AS usr_instituicao FROM  ADRH.PESSOAS_JURIDICAS PJ"
            );

            if (resultado != null)
            {
                foreach (DataRow row in resultado.AsEnumerable())
                {
                    var instituicao = new Dictionary<string, string>();
                    instituicao.Add("EMP_COD", row["EMP_COD"].ToString());
                    instituicao.Add("usr_instituicao", row["usr_instituicao"].ToString());
                    instituicoes.Add(instituicao);
                }
            }
            return instituicoes;
        }

    }
}
