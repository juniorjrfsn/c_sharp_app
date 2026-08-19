"use strict";
var HomeIndex;
(function (HomeIndex) {
    HomeIndex.listaEventos = [];
    function eventoDescricao(eve_num_evento, que_num_questionario) {
        var _a, _b, _c, _d;
        let cab_eve_nome = (_b = (_a = $('h3[id="eve[' + eve_num_evento + '][' + que_num_questionario + '][cab_eve_nome]"]').text()) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : '';
        let cab_eve_descricao_hidden = (_d = (_c = $('input[name="eve[' + eve_num_evento + '][' + que_num_questionario + '][cab_eve_descricao_hidden]"]').val()) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : '';
        ScriptsConfig.swalconfirmeActionAlerta.fire({
            title: '<span style="color:#045C99;font-size:22px;">Sobre o Evento</br>' + cab_eve_nome + '</span>',
            html: '<span style="color:#045C99;font-size:20px;text-align:justify;">' + cab_eve_descricao_hidden + '</span>',
            icon: "info",
            width: 800,
            showCancelButton: false,
            showDenyButton: false,
            confirmButtonText: '<i class="fa-solid fa-check"></i> Ok',
            denyButtonText: 'Não <i class="fa-solid fa-arrow-right-from-bracket"></i>',
            cancelButtonText: "",
            reverseButtons: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            backdrop: true,
            footer: ScriptsConfig.footerAlert
        }).then((result) => {
            if (result.isConfirmed) {
            }
            else {
            }
        });
    }
    HomeIndex.eventoDescricao = eventoDescricao;
    HomeIndex.eve_num_evento = 0;
    HomeIndex.que_num_questionario = 0;
    HomeIndex.que_nota_minima = 0;
    function gerarHTML(lista) {
        var _a, _b, _c, _d, _e, _f;
        HomeIndex.listaEventos = [];
        let tabela = '<table class="table table-striped">';
        HomeIndex.eve_num_evento = Number((_b = (_a = $('input[name="eve_num_evento"]').val()) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : '0');
        HomeIndex.que_num_questionario = Number((_d = (_c = $('input[name="que_num_questionario"]').val()) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : '0');
        HomeIndex.que_nota_minima = Number((_f = (_e = $('input[name="que_nota_minima"]').val()) === null || _e === void 0 ? void 0 : _e.toString()) !== null && _f !== void 0 ? _f : '0');
        lista.forEach(q => {
            HomeIndex.listaEventos.push({
                tempo: Number(q.tempo) || Date.now(),
                eve_num_evento: Number(q.eve_num_evento) || 0,
                eve_nome: q.eve_nome || '',
                eve_descricao: q.eve_descricao || '',
                eve_local: q.eve_local || '',
                eve_municipio: q.eve_municipio || '',
                eve_dt_inicio: q.eve_dt_inicio || '',
                eve_dt_fim: q.eve_dt_fim || '',
                eve_dt_inclusao: q.eve_dt_inclusao || '',
                eve_situacao: q.eve_situacao || '',
                que_num_questionario: Number(q.que_num_questionario) || 0,
                que_contexto: q.que_contexto || '',
                que_publico_alvo: q.que_publico_alvo || '',
                que_nota_minima: Number(q.que_nota_minima.replace(',', '.')) || 0,
                que_dt_inclusao: q.que_dt_inclusao || '',
                que_situacao: q.que_situacao || ''
            });
            let cab_eve_descricao = q.eve_descricao.toString();
            let descri = ((cab_eve_descricao.length >= 100) ? cab_eve_descricao.substring(0, 100) + '<span class="text-danger" style="cursor:pointer;"> ... Saiba mais ... </span>' : cab_eve_descricao);
            tabela += `
                <tr>
                    <td class="list-group-item" accesskey="${q.eve_num_evento || 0}_${q.que_num_questionario || 0}" 
                        onclick="javascript:HomeIndex.eventoDescricao(${q.eve_num_evento || 0},${q.que_num_questionario || 0})" style="text-align:center;" >
                        <h4 class="mb-4" id="eve[${q.eve_num_evento || 0}][${q.que_num_questionario || 0}][cab_eve_nome]" style="color:#033E66;" >${q.eve_nome || ''}</h4>
                                <input type="hidden"
                                    name="eve[${q.eve_num_evento || 0}][${q.que_num_questionario || 0}][eve_num_evento]" 
                                    id="eve[${q.eve_num_evento || 0}][${q.que_num_questionario || 0}][eve_num_evento]" value="${q.eve_num_evento || 0}" />
                                <input type="hidden"
                                    name="eve[${q.eve_num_evento || 0}][${q.que_num_questionario || 0}][que_num_questionario]" 
                                    id="eve[${q.eve_num_evento || 0}][${q.que_num_questionario || 0}][que_num_questionario]" value="${q.que_num_questionario || 0}" />
                                <input type="hidden"
                                    name="eve[${q.eve_num_evento || 0}][${q.que_num_questionario || 0}][cab_eve_descricao_hidden]" 
                                    id="eve[${q.eve_num_evento || 0}][${q.que_num_questionario || 0}][cab_eve_descricao_hidden]" value="${q.eve_descricao || ''}" />
                                <h5 class="mb-4 cab_eve_descricao" id="eve[${q.eve_num_evento || 0}][${q.que_num_questionario || 0}][cab_eve_descricao]" style="color:#033E66;">${descri || ''}</h5>
                                <h5 class="mb-4 que_contexto" id="eve[${q.eve_num_evento || 0}][${q.que_num_questionario || 0}][que_contexto]" style="color:#033E66;">Questionário: ${q.que_contexto || ''}</h5>
                    </td>
                </tr>`;
            HomeIndex.eve_num_evento = (q.eve_num_evento !== null && q.eve_num_evento > 0) ? q.eve_num_evento : HomeIndex.eve_num_evento;
            HomeIndex.que_num_questionario = (q.que_num_questionario !== null && q.que_num_questionario > 0) ? q.que_num_questionario : HomeIndex.que_num_questionario;
            HomeIndex.que_nota_minima = (q.que_nota_minima !== null && Number(q.que_nota_minima.replace(',', '.')) > 0) ? q.que_nota_minima.replace(',', '.') : HomeIndex.que_nota_minima;
            $('input[name="eve_num_evento"]').val(HomeIndex.eve_num_evento);
            $('input[name="que_num_questionario"]').val(HomeIndex.que_num_questionario);
            $('input[name="que_nota_minima"]').val(HomeIndex.que_nota_minima);
        });
        tabela += '</table>';
        $('#eventos-questionario').html(tabela);
        $('button[name="btnSubmitIniciarCadastro"]').removeAttr('disabled');
        return HomeIndex.listaEventos;
    }
    function carregarEventos() {
        var jqxhr = $.post("/Home/ObterEventos", {}, function (data) {
            console.log("success");
            console.log(data);
            if (data.sucesso) {
                if (data.lista != null) {
                    var lista = data.lista;
                    console.table(lista);
                    gerarHTML(lista);
                }
                else {
                    ScriptsConfig.swalconfirmeActionAlertaWarning.fire({
                        icon: 'info',
                        title: '<code style="color:#045C99;font-size:22px;">Olá</code><br>',
                        imageUrl: "/Content/img/logo-ageprev-ms-origin.png",
                        imageWidth: 300,
                        width: 1080,
                        height: 700,
                        html: '<span style="color:#045C99;font-size:20px;">Não há eventos vigentes </b></span>',
                        showCancelButton: true,
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
                console.log(data);
            }
        }, "json")
            .done(function (data) {
            if (data !== null) {
                console.log("second success");
            }
            else {
                console.log("dados não encontrado");
            }
            console.log(data);
        })
            .fail(function (_XMLHttpRequest_, textStatus, errorThrown) {
            console.log("error");
            console.log(_XMLHttpRequest_);
            console.log(textStatus);
            console.log(errorThrown);
        })
            .always(function (data) {
            console.log("finished");
            console.log(data);
            $('#botoes').css('display', 'block');
        });
    }
    HomeIndex.carregarEventos = carregarEventos;
    let mensagem = '';
    $(function () {
        setTimeout(() => {
            console.log("This prints after 2 seconds!");
            carregarEventos();
        }, 200);
        $('button[name="btnSubmitIniciarCadastro"]').on('click', function () {
            var _a, _b, _c, _d;
            let eve_num_evento = Number((_b = (_a = $('input[name="eve_num_evento"]').val()) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : '0');
            let que_num_questionario = Number((_d = (_c = $('input[name="que_num_questionario"]').val()) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : '0');
            if (eve_num_evento > 0 && que_num_questionario > 0) {
                $('form[name="formHomeIndex"]').trigger('submit');
            }
            else {
                ScriptsConfig.swalconfirmeActionAlertaWarning.fire({
                    icon: 'info',
                    title: '<code style="color:#045C99;font-size:20px;">Olá</code><br>'
                        + '<span style="color:#045C99;font-size:22px;">' + mensagem + '</span>',
                    imageUrl: "/Content/img/logo-ageprev-ms-origin.png",
                    imageWidth: 300,
                    width: 1080,
                    height: 700,
                    html: '<span style="color:#045C99;font-size:20px;">Não há eventos vigentes disponíveis</b></span>',
                    showCancelButton: false,
                    confirmButtonText: "Ok",
                    cancelButtonText: "Não responder o Questionário!",
                    reverseButtons: false,
                    footer: ScriptsConfig.footerAlert,
                    backdrop: true,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                }).then((result) => {
                    if (result.isConfirmed) {
                    }
                    else {
                    }
                });
            }
        });
        $('h4.cab_eve_descricao').on('click', function () {
            var _a, _b, _c, _d;
            let cab_eve_nome = (_b = (_a = $('h3[id="cab_eve_nome"]').text()) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : '';
            let cab_eve_descricao_hidden = (_d = (_c = $('input[name="cab_eve_descricao_hidden"]').text()) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : '';
            ScriptsConfig.swalconfirmeActionAlerta.fire({
                title: '<span style="color:#045C99;font-size:22px;">Sobre o Evento</br>' + cab_eve_nome + '</span>',
                html: '<span style="color:#045C99;font-size:20px;">' + cab_eve_descricao_hidden + '</span>',
                icon: "info",
                width: 800,
                showCancelButton: false,
                showDenyButton: false,
                confirmButtonText: '<i class="fa-solid fa-check"></i> Ok',
                denyButtonText: 'Não <i class="fa-solid fa-arrow-right-from-bracket"></i>',
                cancelButtonText: "",
                reverseButtons: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
                backdrop: true,
                footer: ScriptsConfig.footerAlert
            }).then((result) => {
                if (result.isConfirmed) {
                }
                else {
                }
            });
        });
    });
})(HomeIndex || (HomeIndex = {}));
//# sourceMappingURL=home-index.js.map