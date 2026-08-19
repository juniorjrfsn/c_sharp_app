"use strict";
var RelAtEven;
(function (RelAtEven) {
    RelAtEven.tempo = Date.now();
    let municipiosList = [];
    let carregandoMunicipios = false;
    let selectedIndex = -1;
    RelAtEven.eventosDtos = [];
    RelAtEven.questionariosDtos = [];
    RelAtEven.dataTableInstanceEventos = null;
    RelAtEven.dataTableInstance = null;
    RelAtEven.dataTableInstanceEveQuestion = null;
    RelAtEven.dataTableInstanceEventosQuestionarios = null;
    RelAtEven._ano = '0';
    RelAtEven._mes = '0';
    RelAtEven.eve_num_evento = 0;
    RelAtEven.que_num_questionario = 0;
    RelAtEven.eventos = [];
    RelAtEven.listaQtdePorNota = [];
    RelAtEven.listaEventos = [];
    RelAtEven.dadosDaTabela = [];
    RelAtEven.listaUsuariosPontos = [];
    RelAtEven.listaFinanceiro = [];
    function carregarIndices() { }
    RelAtEven.carregarIndices = carregarIndices;
    function formatarNumero(valor) {
        if (valor === null || valor === undefined || valor === '')
            return '';
        const numero = Number(valor);
        if (isNaN(numero))
            return '';
        return numero.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    function formatarCompetencia(competencia) {
        if (competencia === null || competencia === undefined)
            return '';
        const str = String(competencia).trim();
        if (str.length < 6)
            return str;
        return `${str.substring(0, 4)}/${str.substring(4, 6)}`;
    }
    function converterDataFormularioParaCompetencia(dataFormulario) {
        if (!dataFormulario || dataFormulario.trim().length < 7)
            return '';
        const trimmed = dataFormulario.trim();
        const partes = trimmed.split('/');
        if (partes.length !== 2)
            return '';
        const mes = partes[0];
        const ano = partes[1];
        return `${ano}${mes}`;
    }
    function formatarDateToBr(data_inicio_fi) {
        if (data_inicio_fi === null || data_inicio_fi === undefined)
            return '';
        const str = String(data_inicio_fi).trim();
        if (str.length < 8)
            return str;
        const ano = str.substring(0, 4);
        const mes = str.substring(4, 6);
        const dia = str.substring(6, 8);
        return `${dia}/${mes}/${ano}`;
    }
    function processDataForTable(data) {
        RelAtEven.listaFinanceiro = [];
        data.forEach(q => {
            RelAtEven.listaFinanceiro.push({
                tempo: (q.fin_id || 0),
                ALA_DP_CPF_SERVIDOR: q.ALA_DP_CPF_SERVIDOR || '',
                ALA_DP_NOME_SERVIDOR: q.ALA_DP_NOME_SERVIDOR || '',
                ala_fi_MATRICULA: Number(q.ala_fi_MATRICULA) || 0,
                tipo_cargo_fi: Number(q.tipo_cargo_fi) || 0,
                COMPETENCIA_FI: q.COMPETENCIA_FI || '',
                cod_rubrica_fi: Number(q.cod_rubrica_fi) || 0,
                pr_Rubrica: q.pr_Rubrica || '',
                data_inicio_fi: q.data_inicio_fi || '',
                ala_fi_valor: Number(q.ala_fi_valor) || 0,
                ala_fi_perc_pont_dia_hora: Number(q.ala_fi_perc_pont_dia_hora) || 0,
                ala_fi_QTDE_URV: Number(q.ala_fi_QTDE_URV) || 0,
                PROVENTO: Number(q.PROVENTO) || 0,
                DESCONTO: Number(q.DESCONTO) || 0,
                TOTAL_PROVENTO: Number(q.TOTAL_PROVENTO) || 0,
                TOTAL_DESCONTO: Number(q.TOTAL_DESCONTO) || 0,
                LIQUIDO: Number(q.LIQUIDO) || 0
            });
        });
        return RelAtEven.listaFinanceiro;
    }
    RelAtEven.processDataForTable = processDataForTable;
    function gerarHTML(financeiro) {
        if (!Array.isArray(financeiro)) {
            console.warn('gerarHTML recebeu financeiro inválido:', financeiro);
            return;
        }
        const containerElement = document.getElementById('lista-financeiro');
        if (!containerElement) {
            console.warn('Elemento #lista-financeiro não encontrado.');
            return;
        }
        if (financeiro.length === 0) {
            containerElement.innerHTML = '<div class="alert alert-info">Nenhum registro financeiro encontrado.</div>';
            return;
        }
        const agrupadoPorServidor = agruparFinanceiro(financeiro);
        let html = '<div class="card mb-3"><div class="card-body"><h4 class="card-title">Relatório Financeiro</h4></div></div>';
        agrupadoPorServidor.forEach((servidor) => {
            let serv_cpf = "";
            if (servidor.cpf.length === 11) {
                serv_cpf = "***." + servidor.cpf.substring(3, 6) + "." + servidor.cpf.substring(6, 9) + "-**";
            }
            else {
                serv_cpf = servidor.cpf;
            }
            html += '<div class="card mb-4">';
            html += '<div class="card-header bg-primary text-white">';
            html += `<strong>CPF:</strong> ${serv_cpf || ''} &nbsp;|&nbsp; `;
            html += `<strong>Nome:</strong> ${servidor.nome || ''} &nbsp;|&nbsp; `;
            html += `<strong>Matrícula:</strong> ${servidor.matricula || ''}`;
            html += '</div>';
            html += '<div class="card-body">';
            servidor.grupos.forEach((grupo) => {
                html += '<div class="card mb-3">';
                html += '<div class="card-header bg-secondary text-white">';
                html += `<strong>Competência:</strong> ${formatarCompetencia(grupo.competencia)} &nbsp;|&nbsp; `;
                html += `<strong>Tipo de Cargo:</strong> ${grupo.tipo_cargo_fi}`;
                html += '</div>';
                html += '<div class="card-body">';
                html += '<div class="table-responsive"><table class="table table-sm table-bordered table-striped"><thead class="thead-light"><tr>' +
                    '<th style="text-align:center;">Cód. Rubrica</th><th style="text-align:center;">Rubrica</th><th style="text-align:center;">Data Início</th><th style="text-align:center;">Valor</th><th style="text-align:center;">% Pont./Dia/Hora</th><th style="text-align:center;">QTDE URV</th>' +
                    `<th style="text-align:center;">PROVENTO</th><th>DESCONTO</th><th style="text-align:center;">LIQUIDO</th>` +
                    '</tr></thead><tbody>';
                grupo.registros.forEach((item) => {
                    html += '<tr>' +
                        `<td style="text-align:center;">${item.cod_rubrica_fi || ''}</td>` +
                        `<td>${item.pr_Rubrica || ''}</td>` +
                        `<td style="text-align:center;">${((item.data_inicio_fi.trim() != '0' && item.data_inicio_fi.trim() != '00/00/0000' && item.data_inicio_fi.trim() != '30/12/1899' && item.data_inicio_fi.trim() != '01/01/1900') ? formatarDateToBr(item.data_inicio_fi).trim() || '' : '')}</td>` +
                        `<td style="text-align:right;">${formatarNumero(item.ala_fi_valor)}</td>` +
                        `<td style="text-align:right;">${formatarNumero(item.ala_fi_perc_pont_dia_hora)}</td>` +
                        `<td style="text-align:right;">${item.ala_fi_QTDE_URV != null ? item.ala_fi_QTDE_URV : ''}</td>` +
                        `<td style="text-align:right;">${formatarNumero(item.PROVENTO)}</td>` +
                        `<td style="text-align:right;">${formatarNumero(item.DESCONTO)}</td>` +
                        `<td></td>` +
                        '</tr>';
                });
                html += '<tr>' +
                    `<td style="text-align:center;"> -- </td>` +
                    `<td>Total</td>` +
                    `<td style="text-align:right;"> -- </td>` +
                    `<td style="text-align:right;"> -- </td>` +
                    `<td style="text-align:right;"> -- </td>` +
                    `<td style="text-align:right;"> -- </td>` +
                    `<td style="text-align:right;">${formatarNumero(grupo.registros[0].TOTAL_PROVENTO)}</td>` +
                    `<td style="text-align:right;">${formatarNumero(grupo.registros[0].TOTAL_DESCONTO)}</td>` +
                    `<td style="text-align:right;">${formatarNumero(grupo.registros[0].LIQUIDO)}</td>` +
                    '</tr>';
                html += '</tbody></table></div>';
                html += '</div>';
                html += '</div>';
            });
            html += '</div>';
            html += '</div>';
        });
        containerElement.innerHTML = html;
    }
    RelAtEven.gerarHTML = gerarHTML;
    function agruparFinanceiro(dados) {
        if (!Array.isArray(dados)) {
            console.warn('agruparFinanceiro recebeu um valor inválido:', dados);
            return [];
        }
        const mapaServidores = {};
        dados.forEach(item => {
            const cpf = item.ALA_DP_CPF_SERVIDOR || '';
            const nome = item.ALA_DP_NOME_SERVIDOR || '';
            const matricula = item.ala_fi_MATRICULA || 0;
            const chaveServidor = `${cpf}|${matricula}`;
            if (!mapaServidores[chaveServidor]) {
                mapaServidores[chaveServidor] = {
                    cpf,
                    nome,
                    matricula,
                    grupos: {}
                };
            }
            const servidor = mapaServidores[chaveServidor];
            const competencia = String(item.COMPETENCIA_FI || 'Sem Competência');
            const tipoCargo = String(item.tipo_cargo_fi || 'Sem Tipo Cargo');
            const chaveGrupo = `${competencia}|${tipoCargo}`;
            if (!servidor.grupos[chaveGrupo]) {
                servidor.grupos[chaveGrupo] = { competencia, tipo_cargo_fi: tipoCargo, registros: [] };
            }
            servidor.grupos[chaveGrupo].registros.push({
                ALA_DP_CPF_SERVIDOR: cpf,
                ALA_DP_NOME_SERVIDOR: nome,
                ala_fi_MATRICULA: matricula,
                tipo_cargo_fi: tipoCargo,
                COMPETENCIA_FI: competencia,
                cod_rubrica_fi: item.cod_rubrica_fi || '',
                pr_Rubrica: item.pr_Rubrica || '',
                data_inicio_fi: item.data_inicio_fi || '',
                ala_fi_valor: item.ala_fi_valor != null ? item.ala_fi_valor : 0,
                ala_fi_perc_pont_dia_hora: item.ala_fi_perc_pont_dia_hora != null ? item.ala_fi_perc_pont_dia_hora : 0,
                PROVENTO: item.PROVENTO != null ? item.PROVENTO : 0,
                DESCONTO: item.DESCONTO != null ? item.DESCONTO : 0,
                TOTAL_PROVENTO: item.TOTAL_PROVENTO != null ? item.TOTAL_PROVENTO : 0,
                TOTAL_DESCONTO: item.TOTAL_DESCONTO != null ? item.TOTAL_DESCONTO : 0,
                LIQUIDO: item.LIQUIDO != null ? item.LIQUIDO : 0
            });
        });
        return Object.values(mapaServidores).map((servidor) => ({
            cpf: servidor.cpf,
            nome: servidor.nome,
            matricula: servidor.matricula,
            grupos: Object.values(servidor.grupos)
        }));
    }
    RelAtEven.agruparFinanceiro = agruparFinanceiro;
    function isFinanceiroAgrupado(dados) {
        return Array.isArray(dados) && dados.length > 0 && typeof dados[0].competencia === 'string' && Array.isArray(dados[0].tipos);
    }
    function gerarFinanceiroAgrupadoHTML(financeiro) {
        RelAtEven.container = document.getElementById('lista-financeiro');
        if (!RelAtEven.container) {
            console.warn('Elemento #lista-financeiro não encontrado.');
            return;
        }
        let html = '<div class="card"><div class="card-body"><h3>Relatório Financeiro</h3></div></div>';
        financeiro.forEach(competencia => {
            html += `<div class="card mt-3"><div class="card-header"><strong>Competência:</strong> ${formatarCompetencia(competencia.competencia)}</div><div class="card-body">`;
            competencia.tipos.forEach(tipo => {
                html += `<div class="mb-3"><h5>Tipo de Cargo: ${tipo.tipo_cargo_fi}</h5>`;
                html += '<div class="table-responsive"><table class="table table-sm table-striped"><thead><tr>' +
                    '<th>CPF</th><th>Nome</th><th>Matrícula</th><th>Cód. Rubrica</th><th>Rubrica</th><th>Data Início</th><th>Valor</th><th>% Pont./Dia/Hora</th><th>QTDE URV</th>' +
                    '</tr></thead><tbody>';
                tipo.registros.forEach(item => {
                    html += '<tr>' +
                        `<td>${item.cpf || ''}</td>` +
                        `<td>${item.nome || ''}</td>` +
                        `<td>${item.matricula || ''}</td>` +
                        `<td>${item.cod_rubrica_fi || ''}</td>` +
                        `<td>${item.pr_Rubrica || ''}</td>` +
                        `<td>${((item.data_inicio_fi.trim() != '0' && item.data_inicio_fi.trim() != '00/00/0000' && item.data_inicio_fi.trim() != '30/12/1899' && item.data_inicio_fi.trim() != '01/01/1900') ? formatarDateToBr(item.data_inicio_fi).trim() : '')}</td>` +
                        `<td>${formatarNumero(item.ala_fi_valor)}</td>` +
                        `<td>${formatarNumero(item.ala_fi_perc_pont_dia_hora)}</td>` +
                        `<td>${item.ala_fi_QTDE_URV != null ? item.ala_fi_QTDE_URV : ''}</td>` +
                        '</tr>';
                });
                html += '</tbody></table></div></div>';
            });
            html += '</div></div>';
        });
        RelAtEven.container.innerHTML = html;
    }
    function carregarFinanceiro() {
        let cpf = ($('input[name="cpf"]').val() || '').trim();
        let matricula = ($('input[name="matricula"]').val() || '').trim();
        let nome = ($('input[name="per_nome"]').val() || '').trim();
        let dtIni = converterDataFormularioParaCompetencia($('input[name="per_dt_ini"]').val() || '');
        let dtFim = converterDataFormularioParaCompetencia($('input[name="per_dt_fim"]').val() || '');
        console.log('Carregando o questionário');
        $('#lista-financeiro').empty().html('');
        $('#div-filtro').css('display', 'none');
        $('#div-resultado-financeiro').css('display', 'block');
        var jqxhr = $.post("/Relatorios/GetFinanceiro", {
            cpf: cpf,
            matricula: matricula,
            nome: nome,
            dt_ini: dtIni,
            dt_fim: dtFim
        }, function (data) {
            if (data.sucesso) {
                var dados = data.lista;
                console.log("dados encontrados");
                if (dados && dados.length > 0) {
                    if (data.qtd > 0) {
                        if (dados.length == 1) {
                            $('button[name="btnSalvar"]').attr('disabled', 'disabled');
                            $('#botoes').css('botoes', 'none');
                            ScriptsConfig.swalconfirmeActionAlertaWarning.fire({
                                icon: 'info',
                                title: '<code style="color:#045C99;font-size:22px;">Olá</code><br>',
                                imageUrl: "/Content/img/logo-ageprev-ms-origin.png",
                                imageWidth: 300,
                                width: 1080,
                                height: 700,
                                html: '<span style="color:#045C99;font-size:20px;">Não há questionário respondido pelo usuário informado</b></span>'
                                    + '</br></br><span style="color:#045C99;font-size:22px;font-weight:500;">Deseja voltar ao início?</span>',
                                showCancelButton: true,
                                confirmButtonText: "Sim",
                                cancelButtonText: "Não, desejo permanecer aqui!",
                                reverseButtons: false,
                                footer: ScriptsConfig.footerAlert,
                                backdrop: true,
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    window.location.href = '/Home/Index';
                                }
                                else {
                                }
                            });
                        }
                        else {
                            let processedData = processDataForTable(dados);
                            console.table(processedData);
                            RelAtEven.gerarHTML(processedData);
                            $('#botoes').css('display', 'block');
                        }
                    }
                    else {
                        ScriptsConfig.swalconfirmeActionAlertaWarning.fire({
                            icon: 'info',
                            title: '<code style="color:#045C99;font-size:22px;">Olá</code><br>',
                            imageUrl: "/Content/img/logo-ageprev-ms-origin.png",
                            imageWidth: 300,
                            width: 1080,
                            height: 700,
                            html: '<span style="color:#045C99;font-size:20px;">Não há Financeiro disponível para a consulta</b></span>',
                            showCancelButton: false,
                            confirmButtonText: "Deseja voltar ao início?",
                            cancelButtonText: "Não, desejo permanecer aqui!",
                            reverseButtons: false,
                            footer: ScriptsConfig.footerAlert,
                            backdrop: true,
                        }).then((result) => {
                            if (result.isConfirmed) {
                                window.location.href = '/Home/Index';
                            }
                            else {
                            }
                        });
                    }
                }
                else {
                    ScriptsConfig.swalconfirmeActionAlertaWarning.fire({
                        icon: 'info',
                        title: '<code style="color:#045C99;font-size:22px;">Olá</code><br>',
                        imageUrl: "/Content/img/logo-ageprev-ms-origin.png",
                        imageWidth: 300,
                        width: 1080,
                        height: 700,
                        html: '<span style="color:#045C99;font-size:20px;">Não há quqestionário disponível para ser respondido</b></span>',
                        showCancelButton: false,
                        confirmButtonText: "Ok",
                        cancelButtonText: "Não responder o Questionário!",
                        reverseButtons: false,
                        footer: ScriptsConfig.footerAlert,
                        backdrop: true,
                    }).then((result) => {
                        if (result.isConfirmed) {
                        }
                        else {
                        }
                    });
                }
            }
            else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...2",
                    html: data.msg,
                    footer: '<code>' + data.lista + '</code>'
                });
            }
        }, "json")
            .done(function (data) {
            if (data !== null) {
                console.log("second success");
            }
            else {
                console.log("dados não encontrado");
            }
        })
            .fail(function (_XMLHttpRequest_, textStatus, errorThrown) {
            console.log("error");
            console.log(_XMLHttpRequest_);
            console.log(textStatus);
            console.log(errorThrown);
        })
            .always(function () {
            console.log("finished");
        });
        return jqxhr;
    }
    RelAtEven.carregarFinanceiro = carregarFinanceiro;
    function validarBusca(cpf, matricula, per_nome, per_dt_ini, per_dt_fim) {
        let ret = false;
        if (!cpf && !matricula && !per_nome && !per_dt_ini && !per_dt_fim) {
            ret = false;
        }
        else {
            ret = true;
        }
        return ret;
    }
    RelAtEven.validarBusca = validarBusca;
    function gerarPDF() {
        const cpf = String($('input[name="cpf"]').val() || '').replace(/\D/g, '');
        const matricula = Number($('input[name="matricula"]').val() || '0');
        const nome = String($('input[name="per_nome"]').val() || '').trim();
        const per_dt_ini = ($('input[name="per_dt_ini"]').val() || '').trim();
        const per_dt_fim = ($('input[name="per_dt_fim"]').val() || '').trim();
        RelAtEven.gerarPDFPorCpfMatriculaNomePeriodo(cpf, matricula, nome, per_dt_ini, per_dt_fim);
    }
    RelAtEven.gerarPDF = gerarPDF;
    function gerarPDFPorCpfMatriculaNomePeriodo(usr_cpf, matric, nome, dt_ini, dt_fim) {
        const cpf = String(usr_cpf || '').replace(/\D/g, '');
        const matricula = matric || Number($('input[name="matricula"]').val() || '0');
        const nomeBusca = String(nome || $('input[name="per_nome"]').val() || '').trim();
        const per_dt_ini = converterDataFormularioParaCompetencia(dt_ini || String($('input[name="per_dt_ini"]').val() || ''));
        const per_dt_fim = converterDataFormularioParaCompetencia(dt_fim || String($('input[name="per_dt_fim"]').val() || ''));
        Swal.fire({
            title: '<strong style="color:#045C99;">Financeiro PDF</strong>',
            html: `
                    <div style="text-align: left; font-size: 15px; color: #555; line-height: 1.6;">
                    <p>🏆 <b>Enviando consulta...</b></p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 10px 0;">
                    <small style="color: #888;"><i>⏳ Gerando o relatório em PDF. Por favor, não feche esta janela!</i></small>
                    </div>
                `,
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
                const loader = Swal.getPopup().querySelector('.swal2-loader');
                if (loader) {
                    loader.style.color = '#045C99';
                    loader.style.borderRightColor = 'transparent';
                }
            }
        });
        $.post('/Relatorios/GerarPdfFinanceiro', { cpf: cpf, matricula: matricula, nome: nomeBusca, dt_ini: per_dt_ini, dt_fim: per_dt_fim }, function (data) {
            console.log('success');
            console.log(data);
            if (data.sucesso) {
                window.open('/Relatorios/abrirPdfFinanceiroGerado', 'popup', 'height=1024,width=900,toolbar=no');
                console.log('dados encontrados');
                Swal.close();
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...2',
                    html: data.msg,
                    footer: '<code>' + data.lista + '</code>'
                });
            }
        }, 'json')
            .done(function (data) {
            if (data !== null) {
                console.log('second success');
            }
            else {
                console.log('dados não encontrado');
            }
        })
            .fail(function (_XMLHttpRequest_, textStatus, errorThrown) {
            console.log('error');
            console.log(_XMLHttpRequest_);
            console.log(textStatus);
            console.log(errorThrown);
        })
            .always(function () {
            console.log('finished');
            Swal.close();
        });
        RelAtEven.carregarFinanceiro();
    }
    RelAtEven.gerarPDFPorCpfMatriculaNomePeriodo = gerarPDFPorCpfMatriculaNomePeriodo;
    $(function () {
        RelAtEven._ano = '2026';
        RelAtEven._mes = '6';
        $('button[name="btnGerarPDF"]').on('click', function (e) {
            RelAtEven.gerarPDF();
        });
        $('button[name="btnBuscar"]').on('click', function (e) {
            Swal.fire({
                title: '<strong style="color:#045C99;">Financeiro PDF</strong>',
                html: `
                    <div style="text-align: left; font-size: 15px; color: #555; line-height: 1.6;">
                    <p>🏆 <b>Enviando consulta...</b></p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 10px 0;">
                    <small style="color: #888;"><i>⏳ Gerando o relatório. Por favor, não feche esta janela!</i></small>
                    </div>
                `,
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading();
                    const loader = Swal.getPopup().querySelector('.swal2-loader');
                    if (loader) {
                        loader.style.color = '#045C99';
                        loader.style.borderRightColor = 'transparent';
                    }
                }
            });
            RelAtEven.carregarFinanceiro().always(function () {
                Swal.close();
            });
        });
        $('input[name="cpf_busca"]').on('input', function () {
            var cpf_busca = $(this).val();
            $('input[name="cpf"]').val(cpf_busca);
        });
        $('#div-lista-evento-question tbody').on('click', 'button.btn-editar-lista-questionarios', function () {
            const eve_num_evento = Number($(this).data('eve') || 0);
            $('input[name="eve_num_evento"]').val(eve_num_evento);
            $('input[name="que_num_questionario"]').val(0);
        });
        $('#div-lista-questionario tbody').on('click', 'button.btn-editar-questionario', function () {
            const eve_num_evento = Number($(this).data('eve') || 0);
            const que_num_questionario = Number($(this).data('que') || 0);
            $('input[name="eve_num_evento"]').val(eve_num_evento);
            $('input[name="que_num_questionario"]').val(que_num_questionario);
            console.log(RelAtEven.questionariosDtos);
            let questionario = RelAtEven.questionariosDtos.find(x => x.que_num_questionario === que_num_questionario);
            console.log(questionario);
            if (questionario) {
            }
        });
        $('button[name="btn-fechar-lista"]').on('click', function (e) {
            $('form[name="formRelFinanceiro"] input[name="cpf"]').val('');
            $('form[name="formRelFinanceiro"] input[name="cpf_busca"]').val('');
            $('form[name="formRelFinanceiro"] input[name="matricula"]').val('');
            $('form[name="formRelFinanceiro"] input[name="per_dt_ini"]').val('');
            $('form[name="formRelFinanceiro"] input[name="per_dt_fim"]').val('');
            $('#div-filtro').css('display', 'block');
            $('#div-resultado-financeiro').css('display', 'none');
        });
        $('button[name="btn-salvar-questionario"]').on('click', function (e) {
        });
        $('button[name="btn-abrir-cadastro"]').on('click', function (e) {
            $('input[name="que_num_questionario"]').val('0');
            $('textarea[name="que_contexto"]').val('');
            $('input[name="que_publico_alvo"]').val('');
            $('input[name="que_nota_minima"]').val('');
            $('input[name="que_dt_inclusao"]').val('');
            $('select[name="que_situacao"]').val('A');
            $('#div-lista-evento-question').css('display', 'none');
            $('#div-lista-questionario').css('display', 'none');
            $('#div-formulario-questionario').css('display', 'block');
        });
        $('input[name="buscaLimpa"]').on('input', function () {
            var cleanValue = $(this).val();
            $('input[name="busca"]').val(cleanValue);
            console.log("Cleaned:", cleanValue);
        });
        $('button[name="btnBuscar"]').on('click', function (e) {
        });
    });
})(RelAtEven || (RelAtEven = {}));
//# sourceMappingURL=relatorios-ato-eventos.js.map