// File: script-page/Parametro.ts
/// <reference path="../config-scripts/@types/jquery/index.d.ts" />
/// <reference path="../config-scripts/@types/jquery.form/index.d.ts" />
/// <reference path="../config-scripts/@types/datatables.net/types/types.d.ts" />
/// <reference path="../config-scripts/sweetalert2.d.ts" />
/// <reference path="../config-scripts/config.ts" />
/// <reference path="../config-scripts/ScriptsConfig.d.ts" />
/// <reference path="../script-page/ItemControl.ts" />

namespace Fin {
    export let dataTableInstance: any | null = null;
    export let datatable_lista = null;
    export let tempo: number = 0;

    const hoje = new Date();
    const dia = String(hoje.getDate()).padStart(2, '0');
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const ano = hoje.getFullYear();
    const dataFormatadaHoje = `${dia}/${mes}/${ano}`;

    export let retorn: {
        sucesso: boolean,
        msg: string,
        confirmado: boolean,
        cancelado: boolean,
        finalizado: boolean,
        invalido: boolean
    } = {
        sucesso: false,
        msg: '',
        confirmado: false,
        cancelado: false,
        finalizado: false,
        invalido: false
    };

    export function verificarSituacao(mov_ano, mov_numero) {
        retorn = { sucesso: false, msg: '', confirmado: false, cancelado: false, finalizado: false, invalido: false };
        $.ajax({
            url: '/Finalizar/FinalizarPrecatorio', data: { mov_numero: mov_numero, mov_ano: mov_ano, usuarioConfirmou: false }, type: 'post', dataType: 'json', cache: false, async: false,
            statusCode: ScriptsConfig.statusCodeHandlers,
            success: function (json, textStatus, jqXHR) {
                retorn.sucesso      = json.sucesso;
                retorn.msg          = json.msg;
                retorn.confirmado   = json.confirmado;
                retorn.cancelado    = json.cancelado;
                retorn.finalizado   = json.finalizado;
                retorn.invalido     = json.invalido;
                if (json.sucesso) {
                } else {
                    if (json.confirmado) {
                    } else {
                    }
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) { }, beforeSend: function (jqXHR) { },
            complete: function (XMLHttpRequest, textStatus) { }
        }).done(function () { }).fail(function (_XMLHttpRequest_, textStatus, errorThrown) {
            console.log(_XMLHttpRequest_); console.log(textStatus); console.log(errorThrown);
            ScriptsConfig.failFunctionAjax(_XMLHttpRequest_, textStatus, errorThrown);
        }).always(function () { });
    }

    export function finalizarPrecatorio(mov_ano, mov_numero) {
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
                        } else { }
                    });
                } else {
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
                        } else if (result.isDenied) { } else { }
                    });
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) { }, beforeSend: function (jqXHR) { },
            complete: function (XMLHttpRequest, textStatus) { }
        }).done(function () { }).fail(function (_XMLHttpRequest_, textStatus, errorThrown) {
            console.log(_XMLHttpRequest_); console.log(textStatus); console.log(errorThrown);
            ScriptsConfig.failFunctionAjax(_XMLHttpRequest_, textStatus, errorThrown);
        }).always(function () { });
    }

    export function editarMovimentoFinalizar(i, sit_codigo) {
        $.when(
            $('input[name="mov_ano"]').val(($('input[name="lab[' + i + '][mov_ano]"]').val()?.toString() ?? "")),
            $('input[name="mov_numero"]').val($('input[name="lab[' + i + '][mov_numero]"]').val()?.toString() || "0")
        ).then(function (data, textStatus, jqXHR) {
            // setTimeout($('form[name="formLista"]').submit(), 1000);
            // Exibe uma caixa de confirmação
            let mov_ano = $('input[name="mov_ano"]').val()?.toString();
            let mov_numero = $('input[name="mov_numero"]').val()?.toString();
            $.when(Fin.verificarSituacao(mov_ano, mov_numero)).then(function (data, textStatus, jqXHR) {
                if (ScriptsConfig.acessoNegado) {
                } else {
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
                    } else {
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
                                if (result.isConfirmed) { } else { }
                            });
                        } else {
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
                                    } else {
                                    }
                                });
                            } else {
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
                                        /*
                                        $.ajax({
                                            url: '/PrecatorioMovimentoBaixa/Salvar', data: { dadosForm: dadosForm }, type: 'post', dataType: 'json', cache: false, async: true,
                                            statusCode: ScriptsConfig.statusCodeHandlers,
                                            success: function (json, textStatus, jqXHR) {
                                                console.log(json);
                                                if (json.sucesso) {
                                                    // Retorno após salvar a baixa
                                                    ScriptsConfig.swalWithBootstrapButtons.fire({
                                                        title: 'Registro',
                                                        html: json.msg,
                                                        icon: "success",
                                                        showCancelButton: false,
                                                        confirmButtonText: "Ok",
                                                        cancelButtonText: "No, cancel!",
                                                        reverseButtons: true
                                                    }).then((result) => {
                                                        if (result.isConfirmed) {
                                                            window.location.href = '/PrecatorioMovimentoBaixa/Index';
                                                        } else {
                                                            window.location.href = '/PrecatorioMovimentoBaixa/Index';
                                                        }
                                                    });
                                                } else {
                                                    // Retorno caso não seja possivel Salvar a Baixa
                                                    ScriptsConfig.swalconfirmeActionAlerta.fire({
                                                        title: 'Erro',
                                                        html: json.msg,
                                                        icon: "warning",
                                                        showCancelButton: false,
                                                        showDenyButton: true,
                                                        confirmButtonText: "Atualizar Pággina",
                                                        denyButtonText: 'Voltar para Página Anterior',
                                                        cancelButtonText: "No, cancel!",
                                                        reverseButtons: true, footer: ScriptsConfig.footerAlert
                                                    }).then((result) => {
                                                        if (result.isConfirmed) {
                                                            window.location.reload();
                                                        } else if (result.isDenied) {
                                                            window.location.href = '/PrecatorioMovimentoBaixa/Index';
                                                        } else {
                                                            window.location.href = '/PrecatorioMovimentoBaixa/Index';
                                                        }
                                                    });
                                                }
                                            },
                                            error: function (XMLHttpRequest, textStatus, errorThrown) { }, beforeSend: function (jqXHR) { },
                                            complete: function (XMLHttpRequest, textStatus) { }
                                        }).done(function () { }).fail(function (_XMLHttpRequest_, textStatus, errorThrown) {
                                            console.log(_XMLHttpRequest_); console.log(textStatus); console.log(errorThrown);
                                            ScriptsConfig.failFunctionAjax(_XMLHttpRequest_, textStatus, errorThrown);
                                        }).always(function () { });
                                        */
                                    } else {
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
                                            if (result.isConfirmed) { } else if (result.isDenied) { } else { }
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
}

declare module "Fin" {
    export = Fin;
}

$(function () {


});