using SIGEVENTOS.Business;
using SIGEVENTOS.DTO.DTOS;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web;

namespace SIGEVENTOSMVC.Controllers
{
    public class RelHtmlPDF
    {
        private readonly QuestaoBusiness _questaoBussines;
        private readonly EventosBusiness _eventosBusiness;
        private readonly UsuariosResultadosBusiness _usuariosResultadosBusiness;

        public string _contentRootPath { get; set; }

        public CarregaLayoutBusiness carregaLayout;
        public RelHtmlPDF()
        { 
            _questaoBussines = new QuestaoBusiness();
            _eventosBusiness = new EventosBusiness();
            _usuariosResultadosBusiness = new UsuariosResultadosBusiness();
            _contentRootPath = AppDomain.CurrentDomain.BaseDirectory;
            carregaLayout = new CarregaLayoutBusiness(_contentRootPath);
        }
   

        public string geraHtmlPdf(string usr_cpf, short eve_num_evento, short que_num_questionario, string dataGeracao)
        {
            string thead = "";
            string contentDadosHeigth = "";
            string footerStylePaddingTop = "";
            string tbdoyResumo = "";
            string pontuacao = "";
            int totalPagina = 0;
            string notaUsuario = "0";
            carregaLayout = new CarregaLayoutBusiness(_contentRootPath);

            UsuariosDto usuariosDto = _questaoBussines.VerificaUsuario(usr_cpf);
            RelatorioViewModel.usr_cpf = usuariosDto.CpfUsuario;
            RelatorioViewModel.usr_nome = usuariosDto.NomeUsuario;
            RelatorioViewModel.Versao = (RelatorioViewModel.Versao == 0) ? 1 : RelatorioViewModel.Versao;

              
            UsuariosDto usuarioResultado = _usuariosResultadosBusiness.VerificausuarioResultado(usuariosDto.NumeroUsuario, eve_num_evento, que_num_questionario);

            var qFirst = new QuestaoComRespostaDto();
            List<EventosDto> eventosDtos = new List<EventosDto>();
            Dictionary<string, string> evento = new Dictionary<string, string>();
            eventosDtos = _eventosBusiness.GetEventosQuestionarioGeralFinal(eve_num_evento, que_num_questionario);
            if (eventosDtos != null && eventosDtos.Count > 0)
            {
                evento = new Dictionary<string, string>();

                evento.Add("eve_num_evento", eventosDtos[0].eve_num_evento.ToString());
                evento.Add("eve_nome", eventosDtos[0].eve_nome);
                evento.Add("eve_descricao", eventosDtos[0].eve_descricao);
                evento.Add("eve_local", eventosDtos[0].eve_local);
                evento.Add("eve_municipio", eventosDtos[0].eve_municipio);
                evento.Add("eve_dt_inicio", eventosDtos[0].eve_dt_inicio.ToString());
                evento.Add("eve_dt_fim", eventosDtos[0].eve_dt_fim.ToString());
                evento.Add("eve_dt_inclusao", eventosDtos[0].eve_dt_inclusao.ToString());
                evento.Add("eve_situacao", eventosDtos[0].eve_situacao);
                evento.Add("que_num_questionario", eventosDtos[0].que_num_questionario.ToString());
                evento.Add("que_contexto", eventosDtos[0].que_contexto);
                evento.Add("que_publico_alvo", eventosDtos[0].que_publico_alvo);
                evento.Add("que_nota_minima", eventosDtos[0].que_nota_minima.ToString());
                evento.Add("que_dt_inclusao", eventosDtos[0].que_dt_inclusao.ToString());
                evento.Add("que_situacao", eventosDtos[0].que_situacao);
            }
            List<string> tbodyitensList = new List<string>();

            List<QuestaoComRespostaDto> questaoComRespostaDtos = _questaoBussines.GetUsuarioQuestionarioPontuacaoConferenciaPorCpf(eve_num_evento, que_num_questionario, usr_cpf);

            List<QuestaoComRespostaDto> questoes = questaoComRespostaDtos.GroupBy(x => x.qst_num_questao).Select(
                g => new QuestaoComRespostaDto
                {
                    usr_num_usuario = g.First().usr_num_usuario,
                    usr_nome = g.First().usr_nome,
                    eve_num_evento = g.First().eve_num_evento,
                    eve_nome = g.First().eve_nome,
                    que_num_questionario = g.First().que_num_questionario,
                    qst_num_questao = g.Key,
                    qst_enunciado = g.First().qst_enunciado,
                    nota_q = g.First().nota_q,
                    pontuacao = g.First().pontuacao
                }).OrderBy(x => x.qst_num_questao).ToList();

            // Prepend User card (name and grade) at the beginning of the list if there are questions

            if (questoes.Count > 0)
            {
                qFirst = questoes.First();
                notaUsuario = qFirst.pontuacao.ToString("N2", new CultureInfo("pt-BR"));
                pontuacao = notaUsuario;
                string userCard = $@"<tr class=""card border-light"" style=""width: 100%;padding: 0px 0px 0px 0px;""> 
                    <td colspan=""11"" style=""border: none; padding: 6px 8px;text-align:left;""><span class=""form-label"" id=""nomeUser"" style=""font-weight: 600; font-size: 13px;"">{qFirst.usr_nome}</span></td>
                    <td style=""border: none; padding: 6px 8px; text-align: right;""><span class=""form-label"" id=""notaUser"" style=""font-weight: 600; font-size: 13px;"">Nota : {notaUsuario}</span></td>
                </tr>";
                tbodyitensList.Add(userCard);
            }

            foreach (var q in questoes)
            {
                string check_notap = "";
                if (q.nota_q == 1)
                {
                    check_notap = @"<svg class=""svg-inline--fa text-success fa-lg"" viewBox=""0 0 448 512"" fill=""currentColor"" style=""width: 18px; height: 18px;""><path d=""M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z""/></svg> correta";
                }
                else
                {
                    check_notap = @"<svg class=""svg-inline--fa text-danger fa-lg"" viewBox=""0 0 320 512"" fill=""currentColor"" style=""width: 18px; height: 18px;""><path d=""M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z""/></svg> incorreta";
                }

                string tbodyitens = $@"<tr style=""width: 100%;padding: 0px 0px 0px 0px;"">
                        <td colspan=""12"" style=""border: none; padding: 0;"">
                    <div class=""card border-light"" style=""margin-bottom: 0px; page-break-inside: avoid;"">
                        <div style=""text-align: right;"">
                            {check_notap}
                        </div>
                        <div class=""card-header text-white"" style=""background-color: #337ab7; border-radius: 8px; font-family: sans-serif; font-weight: 800;"">
                            <h4><b>{q.qst_enunciado}</b></h4>
                        </div>
                        <div class=""card-body border-light"" style=""background-color: #fefefe; border-radius: 8px;"">
                            <ul class=""list-group list-group-flush"" style=""text-align-left;"">";

                List<QuestaoComRespostaDto> respostas = questaoComRespostaDtos.Where(x => x.qst_num_questao == q.qst_num_questao)
                    .GroupBy(x => x.qsr_num_resposta).Select(
                    g => new QuestaoComRespostaDto
                    {
                        usr_num_usuario = g.First().usr_num_usuario,
                        usr_nome = g.First().usr_nome,
                        eve_num_evento = g.First().eve_num_evento,
                        eve_nome = g.First().eve_nome,
                        que_num_questionario = g.First().que_num_questionario,
                        qst_num_questao = g.First().qst_num_questao,
                        qst_enunciado = g.First().qst_enunciado,
                        qsr_num_resposta = g.Key,
                        qsr_enunciado = g.First().qsr_enunciado,
                        qsr_e_correta = g.First().qsr_e_correta,
                        qsr_num_resposta_usuario = g.First().qsr_num_resposta_usuario,
                        ponto_q = g.First().ponto_q,
                        ponto_alvo_q = g.First().ponto_alvo_q,
                        qtde_q = g.First().qtde_q,
                        nota_q = g.First().nota_q,
                        nota = g.First().nota,
                        pontuacao = g.First().pontuacao
                    }).OrderBy(x => x.qsr_num_resposta).ToList();
                foreach (var qcru in respostas)
                {

                    string cbId = $"Quest[{q.qst_num_questao}][{qcru.qsr_num_resposta}][qsr_num_resposta]";
                    string check_correta = (
                        (qcru.qsr_e_correta == "S" && qcru.qsr_num_resposta == qcru.qsr_num_resposta_usuario)
                        ||
                        (qcru.qsr_e_correta == "N" && qcru.qsr_num_resposta != qcru.qsr_num_resposta_usuario)
                    )
                    ?
                        (
                            (qcru.qsr_e_correta == "S" && qcru.qsr_num_resposta == qcru.qsr_num_resposta_usuario)
                            ? @"<svg class=""svg-inline--fa text-primary fa-lg"" viewBox=""0 0 448 512"" fill=""#5ac146""><path d=""M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z""/></svg>"
                            : @"<svg class=""svg-inline--fa text-primary fa-lg"" viewBox=""0 0 448 512"" fill=""#ffffff""><path d=""M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z""/></svg>"
                        //: @"<svg class=""svg-inline--fa text-primary fa-lg"" viewBox=""0 0 448 512""><rect x=""32"" y=""32"" width=""384"" height=""448"" rx=""48"" ry=""48"" fill=""#eef0f3"" stroke=""#6c757d"" stroke-width=""24""/></svg>"
                        )
                    : (qcru.qsr_e_correta == "S" && qcru.qsr_num_resposta != qcru.qsr_num_resposta_usuario)

                    ? @"<svg class=""svg-inline--fa text-primary fa-lg"" viewBox=""0 0 448 512"" fill=""#5ac146""><path d=""M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z""/></svg>"
                    : @"<svg class=""svg-inline--fa text-primary fa-lg"" viewBox=""0 0 448 512"" fill=""#ffffff""><path d=""M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z""/></svg>";
                    //: $@"<input class=""form-check-input text-danger""  type=""checkbox"" value=""{qcru.qsr_num_resposta}"" name=""{cbId}"" id=""{cbId}"" onclick=""return false;"" />";

                    string check_usuario = "";
                    if (qcru.qsr_e_correta == "S" && qcru.qsr_num_resposta == qcru.qsr_num_resposta_usuario)
                    {
                        check_usuario = @"<svg class=""svg-inline--fa text-primary fa-lg"" viewBox=""0 0 448 512"" fill=""#0d6efd""><path d=""M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z""/></svg>";
                    }
                    else if (qcru.qsr_e_correta == "N" && qcru.qsr_num_resposta != qcru.qsr_num_resposta_usuario)
                    {
                        check_usuario = @"<svg class=""svg-inline--fa text-primary fa-lg"" viewBox=""0 0 448 512"" fill=""#0d6efd""><path d=""M384 32H64C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM400 96V416c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V96c0-8.8 7.2-16 16-16H384c8.8 0 16 7.2 16 16z""/></svg>";
                    }
                    else if (qcru.qsr_e_correta == "N" && qcru.qsr_num_resposta == qcru.qsr_num_resposta_usuario)
                    {
                        check_usuario = @"<svg class=""svg-inline--fa text-primary fa-lg"" viewBox=""0 0 448 512"" fill=""#0d6efd""><path d=""M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z""/></svg>";
                    }
                    else
                    {
                        check_usuario = @"<svg class=""svg-inline--fa text-primary fa-lg"" viewBox=""0 0 448 512"" fill=""#0d6efd""><path d=""M384 32H64C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM400 96V416c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V96c0-8.8 7.2-16 16-16H384c8.8 0 16 7.2 16 16z""/></svg>";
                    }

                    tbodyitens += $@"
                                <li class=""list-group-item"" style=""text-align:left;"">
                                    <div class=""form-check"" style=""text-align:left;"">
                                        {check_correta} 
                                        {check_usuario}
                                        <label class=""form-check-label"" for=""{cbId}"" id=""Quest[{q.qst_num_questao}][{qcru.qsr_num_resposta}][qsr_enunciado]"">
                                            {qcru.qsr_enunciado}
                                        </label>
                                    </div>
                                </li>";
                }
                tbodyitens += @"
                            </ul>
                        </div>
                    </div>
                </td></tr>";
                tbodyitensList.Add(tbodyitens);
            }

            decimal que_nota_minima = (evento.ContainsKey("que_nota_minima") ? Decimal.Parse(evento["que_nota_minima"]) : Decimal.Parse("0"));
            string msgCongrat = ""; string msgNota = "";
            if (qFirst.pontuacao >= que_nota_minima)
            {
                msgCongrat = $@"<span id=""nomeUser"" style=""font-weight: 600; font-size: 16px;color:#337ab7;"" >Obrigado pela sua Participação, você teve uma ótima pontuação acima da mínima : {que_nota_minima}!</span>";
                msgNota = $@"<span id=""nomeUser"" style=""font-weight: 600; font-size: 16px;color:#337ab7;"" >Nota : {notaUsuario}</span>";
            }
            else
            {
                msgCongrat = $@"<span id=""nomeUser"" style=""font-weight: 600; font-size: 16px;color:#fa5838;"" class=""text-danger"" >Obrigado pela sua Participação, você não atingiu a nota mínima : {que_nota_minima}!</span>";
                msgNota = $@"<span id=""nomeUser"" style=""font-weight: 600; font-size: 16px;color:#fa5838;"" class=""text-danger"" >Nota : {notaUsuario}</span>";
            }

            string userCongrat =
            $@"<tr class=""card border-light"" style=""width: 100%;padding: 0px 0px 0px 0px;""> 
                <td colspan=""11"" style=""border: none; padding: 6px 8px 8px 20px;text-align:left;"">
                    <section class=""form-label"" >{msgCongrat}</section>
                </td>
                <td style=""border: none; padding: 6px 8px 8px 20px; text-align: right;"">
                    <section class=""form-label"" >{msgNota}</section>
                </td>
            </tr>";
            tbodyitensList.Add(userCongrat);

            string PageHead = carregaLayout.PageHead;
            string cssComMarcaDagua = @"#content-dados{ }";

            int totReg = tbodyitensList.Count();

            if (totReg == 0)
            {
                totalPagina = 1;
            }
            else
            {
                int fullPages = totReg / 4;
                int remainder = totReg % 4;
                totalPagina = fullPages + (remainder > 0 ? 1 : 0);
            }

            string PageResumo = carregaLayout.RelatorioPageResumo
            .Replace("{tbdoyResumo}", tbdoyResumo)
            .Replace("{contentDadosHeigth}", contentDadosHeigth)
            .Replace("{footerStylePaddingTop}", footerStylePaddingTop);

            CarregaLayoutBusiness rpc = new CarregaLayoutBusiness(_contentRootPath); ;

            string PageHeader = carregaLayout.RelatorioPageHeader

            .Replace("{eve_nome}", evento.ContainsKey("eve_nome") ? evento["eve_nome"] : "")
            .Replace("{eve_descricao}", evento.ContainsKey("eve_descricao") ? evento["eve_descricao"] : "")
            .Replace("{que_contexto}", evento.ContainsKey("que_contexto") ? evento["que_contexto"] : "")
            .Replace("{que_nota_minima}", evento.ContainsKey("que_nota_minima") ? evento["que_nota_minima"] : "")
            .Replace("{mov_nome_completo}", usuariosDto.NomeUsuario)
            .Replace("{pontuacao}", pontuacao)
            .Replace("{tprel}", "")
            .Replace("{versao}", RelatorioViewModel.Versao.ToString());

            string PageContent = "";
            int cnt2 = 0;
            string trItem = "";
            int pagina = 0;
            int qtdPorPage = 0;
            foreach (var tbodyitem in tbodyitensList)
            {
                cnt2++;
                bool isLastItem = cnt2 == totReg;
                qtdPorPage++;
                trItem += tbodyitem;

                string cordepagina = ""; //(new int[] {1,3,5,7,9,11,13,15}.Contains(qtdPorPage) ) ? "background-color:bisque;" : "background-color:aliceblue;";

                if (pagina > 0)
                {
                    if (qtdPorPage == 4 || isLastItem)
                    {
                        pagina++;
                        PageContent += rpc.RelatorioPageContent
                            .Replace("{EstiloMarcaDagua}", cssComMarcaDagua)
                            .Replace("{PageHeader}", "")
                            .Replace("{corDePagina}", cordepagina)
                            .Replace("{alturaPage}", "")
                            .Replace("{thead}", "")
                            .Replace("{tbodyitens}", trItem)
                            //.Replace("{tableResumo}", (qtdPorPage < 24) ? PageResumo : "")
                            .Replace("{tableResumo}", "")
                            .Replace("{pagina}", pagina.ToString())
                            .Replace("{totalPagina}", totalPagina.ToString())
                            .Replace("{dataGeracao}", usuarioResultado.ure_dt_resultado.ToString("dd/MM/yyyy"));
                        trItem = "";
                        qtdPorPage = 0;
                    }
                }
                else
                {
                    if (qtdPorPage == 4)
                    {
                        pagina++;
                        //bool incluirResumo = isLastItem && (qtdPorPage < 24 || qtdPorPage == 29);
                        string _PageHeader = $@"<tr style=""max-height: 320px; height: 320px;""><td style=""max-height: 320px; height: 320px;"" valign=""top"">{PageHeader}</td></tr>";
                        PageContent += rpc.RelatorioPageContent
                          .Replace("{EstiloMarcaDagua}", cssComMarcaDagua)
                          .Replace("{PageHeader}", _PageHeader)
                          .Replace("{corDePagina}", "")
                          .Replace("{alturaPage}", "")
                          .Replace("{thead}", thead)
                          .Replace("{tbodyitens}", trItem)
                          //.Replace("{tableResumo}", incluirResumo ? PageResumo : "")
                          .Replace("{tableResumo}", "")
                          .Replace("{pagina}", pagina.ToString())
                          .Replace("{totalPagina}", totalPagina.ToString())
                          .Replace("{dataGeracao}", usuarioResultado.ure_dt_resultado.ToString("dd/MM/yyyy"));
                        trItem = "";
                        qtdPorPage = 0;
                    }
                }
            }

            //if (totReg == 0)
            //{
            //    string noDataRow = "<tr><td colspan=\"11\" style=\"padding: 20px; text-align: center; border: none;\">Nenhum registro encontrado.</td></tr>";
            //    PageContent += rpc.RelatorioPageContent
            //        .Replace("{EstiloMarcaDagua}", cssComMarcaDagua)
            //        .Replace("{PageHeader}", PageHeader)
            //        .Replace("{corDePagina}", corDePagina)
            //        .Replace("{alturaPage}", "max-height: 1035px; height: 1035px;")
            //        .Replace("{thead}", thead)
            //        .Replace("{tbodyitens}", noDataRow)
            //        .Replace("{tableResumo}", PageResumo)
            //        .Replace("{pagina}", "1")
            //        .Replace("{totalPagina}", totalPagina.ToString())
            //        .Replace("{dataGeracao}", dataGeracao);
            //}
            //if (qtdPorPage >= 24)
            //{
            //    pagina++;
            //    PageContent += rpc.RelatorioPageContent
            //        .Replace("{EstiloMarcaDagua}", cssComMarcaDagua)
            //        .Replace("{PageHeader}", PageHeader)
            //        .Replace("{corDePagina}", corDePagina)
            //        .Replace("{alturaPage}", "max-height: 1035px; height: 1035px;")
            //        .Replace("{thead}", "")
            //        .Replace("{tbodyitens}", "")
            //        .Replace("{tableResumo}", PageResumo)
            //        .Replace("{pagina}", pagina.ToString())
            //        .Replace("{totalPagina}", totalPagina.ToString())
            //        .Replace("{dataGeracao}", dataGeracao);
            //}

            string layoutComMarcaDagua = carregaLayout.layout_3
                .Replace("{PageTitle}", "Pontuação do Questionário")
                .Replace("{PageHead}", "<style type=\"text/css\">" + PageHead + "</style>")
                .Replace("{EstiloMarcaDagua}", cssComMarcaDagua);
            string RelatorioCompleto = layoutComMarcaDagua.Replace("{PageContent}", PageContent);
            return RelatorioCompleto;
        }

        public string geraHtmlPdfFinanceiro(string cpf, int matricula, string dtIni, string dtFim, string dataGeracao)
        {
            carregaLayout = new CarregaLayoutBusiness(_contentRootPath);
            var sb = new System.Text.StringBuilder();

            // Busca os dados financeiros
            try
            {
                var financeiroBusiness = new RHFP.Business.FinanceiroBusiness();
                var lista = financeiroBusiness.GetFinanceiro(
                    matricula: matricula,
                    nome: null,
                    cpf: cpf,
                    competencia: null,
                    cod_rubrica: 0,
                    dtIni: dtIni,
                    dtFim: dtFim);

                sb.Append("<div class=\"card mb-3\"><div class=\"card-body\"><h4 class=\"card-title\">Relatório Financeiro</h4></div></div>");

                var agrupadoPorServidor = lista
                    .GroupBy(f => new { CPF = f.ALA_DP_CPF_SERVIDOR, f.ala_fi_MATRICULA, Nome = f.ALA_DP_NOME_SERVIDOR })
                    .ToList();

                foreach (var servidor in agrupadoPorServidor)
                {
                    sb.Append("<div class=\"card mb-4\">");
                    sb.Append("<div class=\"card-header bg-primary text-white\">");
                    sb.Append($"<strong>CPF:</strong> {servidor.Key.CPF ?? ""} &nbsp;|&nbsp; <strong>Nome:</strong> {servidor.Key.Nome ?? ""} &nbsp;|&nbsp; <strong>Matrícula:</strong> {servidor.Key.ala_fi_MATRICULA}");
                    sb.Append("</div>");
                    sb.Append("<div class=\"card-body\">");

                    var grupos = servidor.GroupBy(g => new { g.COMPETENCIA_FI, g.tipo_cargo_fi }).ToList();
                    foreach (var grupo in grupos)
                    {
                        sb.Append("<div class=\"card mb-3\">");
                        sb.Append("<div class=\"card-header bg-secondary text-white\">");
                        sb.Append($"<strong>Competência:</strong> {grupo.Key.COMPETENCIA_FI ?? ""} &nbsp;|&nbsp; <strong>Tipo de Cargo:</strong> {grupo.Key.tipo_cargo_fi ?? ""}");
                        sb.Append("</div>");
                        sb.Append("<div class=\"card-body\">");

                        sb.Append("<div class=\"table-responsive\"><table class=\"table table-sm table-bordered table-striped\"><thead class=\"thead-light\"><tr>");
                        sb.Append("<th style=\"text-align:center;\">Cód. Rubrica</th><th style=\"text-align:center;\">Rubrica</th><th style=\"text-align:center;\">Data Início</th><th style=\"text-align:center;\">Valor</th><th style=\"text-align:center;\">% Pont./Dia/Hora</th><th style=\"text-align:center;\">QTDE URV</th><th style=\"text-align:center;\">PROVENTO</th><th>DESCONTO</th><th style=\"text-align:center;\">LIQUIDO</th>");
                        sb.Append("</tr></thead><tbody>");

                        foreach (var item in grupo.OrderBy(x => x.cod_rubrica_fi))
                        {
                            sb.Append("<tr>");
                            sb.Append($"<td style=\"text-align:center;\">{item.cod_rubrica_fi}</td>");
                            sb.Append($"<td>{item.pr_Rubrica}</td>");
                            sb.Append($"<td style=\"text-align:center;\">{(item.data_inicio_fi.HasValue ? item.data_inicio_fi.Value.ToString("dd/MM/yyyy") : "")}</td>");
                            sb.Append($"<td style=\"text-align:right;\">{(item.ala_fi_valor.HasValue ? item.ala_fi_valor.Value.ToString("N2") : "0,00")}</td>");
                            sb.Append($"<td style=\"text-align:right;\">{(item.ala_fi_perc_pont_dia_hora.HasValue ? item.ala_fi_perc_pont_dia_hora.Value.ToString("N2") : "0,00")}</td>");
                            sb.Append($"<td style=\"text-align:right;\">{(item.ala_fi_QTDE_URV.HasValue ? item.ala_fi_QTDE_URV.Value.ToString() : "")}</td>");
                            var prov = (item.PROVENTO.HasValue ? item.PROVENTO.Value : 0m);
                            var desc = (item.DESCONTO.HasValue ? item.DESCONTO.Value : 0m);
                            var liq = (item.LIQUIDO.HasValue ? item.LIQUIDO.Value : 0m);
                            sb.Append($"<td style=\"text-align:right;\">{prov.ToString("N2")}</td>");
                            sb.Append($"<td style=\"text-align:right;\">{desc.ToString("N2")}</td>");
                            sb.Append($"<td style=\"text-align:right;\">{liq.ToString("N2")}</td>");
                            sb.Append("</tr>");
                        }

                        // Totais
                        var primeiro = grupo.FirstOrDefault();
                        if (primeiro != null)
                        {
                            sb.Append("<tr>");
                            sb.Append("<td style=\"text-align:center;\"> -- </td>");
                            sb.Append("<td>Total</td>");
                            sb.Append("<td style=\"text-align:right;\"> -- </td>");
                            sb.Append("<td style=\"text-align:right;\"> -- </td>");
                            sb.Append("<td style=\"text-align:right;\"> -- </td>");
                            sb.Append("<td style=\"text-align:right;\"> -- </td>");
                            sb.Append($"<td style=\"text-align:right;\">{(primeiro.TOTAL_PROVENTO.HasValue ? primeiro.TOTAL_PROVENTO.Value.ToString("N2") : "0,00")}</td>");
                            sb.Append($"<td style=\"text-align:right;\">{(primeiro.TOTAL_DESCONTO.HasValue ? primeiro.TOTAL_DESCONTO.Value.ToString("N2") : "0,00")}</td>");
                            sb.Append($"<td style=\"text-align:right;\">{(primeiro.LIQUIDO.HasValue ? primeiro.LIQUIDO.Value.ToString("N2") : "0,00")}</td>");
                            sb.Append("</tr>");
                        }

                        sb.Append("</tbody></table></div>");
                        sb.Append("</div>");
                        sb.Append("</div>");
                    }

                    sb.Append("</div>");
                    sb.Append("</div>");
                }

                // Envolver no layout padrão
                var pageContent = sb.ToString();
                var pageHead = carregaLayout.PageHead ?? string.Empty;
                if (!string.IsNullOrWhiteSpace(pageHead) && !pageHead.TrimStart().StartsWith("<style", StringComparison.OrdinalIgnoreCase))
                {
                    pageHead = "<style type=\"text/css\">" + pageHead + "</style>";
                }

                var htmlFinal = carregaLayout.layout_3
                    .Replace("{PageTitle}", "Relatório Financeiro")
                    .Replace("{PageHead}", pageHead)
                    .Replace("{PageContent}", pageContent.TrimStart());

                // Remove any path or file:/// URI that may be printed by the PDF engine
                htmlFinal = htmlFinal.TrimStart();
                htmlFinal = System.Text.RegularExpressions.Regex.Replace(htmlFinal, "file:///[A-Za-z]:[^\"'<>\\s]*", string.Empty);
                htmlFinal = htmlFinal.Replace("<link href=\"bootstrap.css\" rel=\"stylesheet\" />", string.Empty);

                return htmlFinal;
            }
            catch (Exception ex)
            {
                return $"<div class=\"alert alert-danger\">Erro ao gerar relatório: {ex.Message}</div>";
            }
        }
        public string geraHtmlPdfAtosEventos(string usr_cpf, short eve_num_evento, short que_num_questionario, string dataGeracao)
        {
            
        } 

    }
}