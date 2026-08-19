"use strict";
var Fin;
(function (Fin) {
    Fin.dataTableInstance = null;
    Fin.datatable_lista = null;
    Fin.tempo = 0;
    const hoje = new Date();
    const dia = String(hoje.getDate()).padStart(2, '0');
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const ano = hoje.getFullYear();
    const dataFormatadaHoje = `${dia}/${mes}/${ano}`;
    Fin.retorn = {
        sucesso: false,
        msg: '',
        confirmado: false,
        cancelado: false,
        finalizado: false,
        invalido: false
    };
    function verificarSituacao(mov_ano, mov_numero) {
        Fin.retorn = { sucesso: false, msg: '', confirmado: false, cancelado: false, finalizado: false, invalido: false };
        $.ajax({
            url: '/Finalizar/FinalizarPrecatorio', data: { mov_numero: mov_numero, mov_ano: mov_ano, usuarioConfirmou: false }, type: 'post', dataType: 'json', cache: false, async: false,
            statusCode: ScriptsConfig.statusCodeHandlers,
            success: function (json, textStatus, jqXHR) {
                Fin.retorn.sucesso = json.sucesso;
                Fin.retorn.msg = json.msg;
                Fin.retorn.confirmado = json.confirmado;
                Fin.retorn.cancelado = json.cancelado;
                Fin.retorn.finalizado = json.finalizado;
                Fin.retorn.invalido = json.invalido;
                if (json.sucesso) {
                }
                else {
                    if (json.confirmado) {
                    }
                    else {
                    }
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) { }, beforeSend: function (jqXHR) { },
            complete: function (XMLHttpRequest, textStatus) { }
        }).done(function () { }).fail(function (_XMLHttpRequest_, textStatus, errorThrown) {
            console.log(_XMLHttpRequest_);
            console.log(textStatus);
            console.log(errorThrown);
            ScriptsConfig.failFunctionAjax(_XMLHttpRequest_, textStatus, errorThrown);
        }).always(function () { });
    }
    Fin.verificarSituacao = verificarSituacao;
    function finalizarPrecatorio(mov_ano, mov_numero) {
        $.ajax({
            url: '/Finalizar/FinalizarPrecatorio', data: { mov_numero: mov_numero, mov_ano: mov_ano, usuarioConfirmou: true }, type: 'post', dataType: 'json', cache: false, async: false,
            statusCode: ScriptsConfig.statusCodeHandlers,
            success: function (json, textStatus, jqXHR) {
                if (json.sucesso) {
                    ScriptsConfig.swalWithBootstrapButtons.fire({
                        title: 'Precatório | Finalização',
                        html: json.msg,
                        icon: "success",
                        showCancelButton: false,
                        showDenyButton: false,
                        confirmButtonText: "Ok",
                        cancelButtonText: "No, cancel!",
                        reverseButtons: false
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.reload();
                        }
                        else { }
                    });
                }
                else {
                    ScriptsConfig.swalconfirmeActionAlerta.fire({
                        title: 'Erro',
                        html: json.msg,
                        icon: "warning",
                        showDenyButton: true,
                        showCancelButton: false,
                        confirmButtonText: "Atualizar Pággina",
                        denyButtonText: 'Fechar',
                        cancelButtonText: "No, cancel!",
                        reverseButtons: false, footer: ScriptsConfig.footerAlert
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.reload();
                        }
                        else if (result.isDenied) { }
                        else { }
                    });
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) { }, beforeSend: function (jqXHR) { },
            complete: function (XMLHttpRequest, textStatus) { }
        }).done(function () { }).fail(function (_XMLHttpRequest_, textStatus, errorThrown) {
            console.log(_XMLHttpRequest_);
            console.log(textStatus);
            console.log(errorThrown);
            ScriptsConfig.failFunctionAjax(_XMLHttpRequest_, textStatus, errorThrown);
        }).always(function () { });
    }
    Fin.finalizarPrecatorio = finalizarPrecatorio;
    function editarMovimentoFinalizar(i, sit_codigo) {
        var _a, _b, _c;
        $.when($('input[name="mov_ano"]').val(((_b = (_a = $('input[name="lab[' + i + '][mov_ano]"]').val()) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : "")), $('input[name="mov_numero"]').val(((_c = $('input[name="lab[' + i + '][mov_numero]"]').val()) === null || _c === void 0 ? void 0 : _c.toString()) || "0")).then(function (data, textStatus, jqXHR) {
            var _a, _b;
            let mov_ano = (_a = $('input[name="mov_ano"]').val()) === null || _a === void 0 ? void 0 : _a.toString();
            let mov_numero = (_b = $('input[name="mov_numero"]').val()) === null || _b === void 0 ? void 0 : _b.toString();
            $.when(Fin.verificarSituacao(mov_ano, mov_numero)).then(function (data, textStatus, jqXHR) {
                if (ScriptsConfig.acessoNegado) {
                }
                else {
                    console.log(Fin.retorn);
                    if (Fin.retorn.sucesso) {
                        ScriptsConfig.swalconfirmeActionFinalizar.fire({
                            title: "Precatório",
                            html: Fin.retorn.msg,
                            icon: "success",
                            showDenyButton: false,
                            showCancelButton: false,
                            confirmButtonText: '<i class="fa-solid fa-check"></i> Ok',
                            denyButtonText: 'Agora Não <i class="fa-solid fa-arrow-right-from-bracket"></i>',
                            footer: ScriptsConfig.footerAlert
                        }).then((result) => {
                            if (result.isConfirmed) { }
                            else if (result.isDenied) { }
                            else { }
                        });
                    }
                    else {
                        if (Fin.retorn.confirmado) {
                            ScriptsConfig.swalconfirmeActionAlerta.fire({
                                title: 'Atenção',
                                html: Fin.retorn.msg,
                                icon: "error",
                                showCancelButton: false,
                                showDenyButton: false,
                                confirmButtonText: '<i class="fa-solid fa-check"></i> Ok',
                                denyButtonText: 'Não <i class="fa-solid fa-arrow-right-from-bracket"></i>',
                                cancelButtonText: "",
                                reverseButtons: false
                            }).then((result) => {
                                if (result.isConfirmed) { }
                                else { }
                            });
                        }
                        else {
                            if (Fin.retorn.cancelado || Fin.retorn.invalido) {
                                ScriptsConfig.swalconfirmeActionAlerta.fire({
                                    title: 'Atenção',
                                    html: Fin.retorn.msg,
                                    icon: "warning",
                                    showCancelButton: false,
                                    showDenyButton: false,
                                    confirmButtonText: '<i class="fa-solid fa-check"></i> Ok',
                                    denyButtonText: 'Não <i class="fa-solid fa-arrow-right-from-bracket"></i>',
                                    cancelButtonText: "",
                                    reverseButtons: false
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                    }
                                    else {
                                    }
                                });
                            }
                            else {
                                ScriptsConfig.swalconfirmeActionFinalizar.fire({
                                    title: 'Atenção',
                                    html: Fin.retorn.msg,
                                    icon: "warning",
                                    showCancelButton: false,
                                    showDenyButton: true,
                                    confirmButtonText: '<i class="fa-solid fa-check"></i> Sim',
                                    denyButtonText: 'Não <i class="fa-solid fa-arrow-right-from-bracket"></i>',
                                    cancelButtonText: "",
                                    reverseButtons: false
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        Fin.finalizarPrecatorio(mov_ano, mov_numero);
                                    }
                                    else {
                                        ScriptsConfig.swalconfirmeActionAlerta.fire({
                                            title: 'Precatório',
                                            html: 'Finalização não efetuada!',
                                            icon: "warning",
                                            showCancelButton: false,
                                            showDenyButton: false,
                                            confirmButtonText: "Ok",
                                            denyButtonText: '',
                                            cancelButtonText: "",
                                            reverseButtons: false, footer: ScriptsConfig.footerAlert
                                        }).then((result) => {
                                            if (result.isConfirmed) { }
                                            else if (result.isDenied) { }
                                            else { }
                                        });
                                    }
                                });
                            }
                        }
                    }
                }
            });
        });
    }
    Fin.editarMovimentoFinalizar = editarMovimentoFinalizar;
})(Fin || (Fin = {}));
$(function () {
});
//# sourceMappingURL=Finalizar.js.map