"use strict";
var ItemControl;
(function (ItemControl) {
    ItemControl.tempo = Date.now();
    ItemControl.footerAlert = '<span> &nbsp; AGEPREV-MS / DIRGIN</span>';
    ItemControl.contador = 1;
    ItemControl.formOriginal = $('#formItensMovimento').serialize();
    ItemControl.namespace = "ItemControl";
    ItemControl.ItemControlCancelarItemMovimento = false;
    ItemControl.dadosDaTabela = [];
    ItemControl.BcCorrigida = $('input[name="BcCorrigida"]').val();
    ItemControl.mov_ano = '';
    ItemControl.mov_numero = 0;
    ItemControl.valido = false;
    ItemControl.valido_c = false;
    ItemControl.valido_para_calc_cota = false;
    ItemControl.validar = false;
    ItemControl.msg = '';
    ItemControl.itensSemRegistro = false;
    ItemControl.listaDeIndiceCorrecaoMonetaria = null;
    ItemControl.listaDeIndiceCorrecaoMonetariaOptions = '';
    ItemControl.swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-success",
            cancelButton: "btn btn-danger"
        }
    });
    ItemControl.swalconfirmeDel = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-primary",
            cancelButton: "btn btn-secondary"
        }
    });
    ItemControl.swalconfirmeActionExcluirCancelarSair = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-danger",
            denyButton: "btn btn-warning",
            cancelButton: "btn btn-secondary"
        }
    });
    ItemControl.swalconfirmeActionExcluirCancelar = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-danger",
            cancelButton: "btn btn-info"
        }
    });
    ItemControl.swalconfirmeAction = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-info",
            denyButton: "btn btn-danger",
            cancelButton: "btn btn-secondary"
        }
    });
    function cancelarItemMovimento(accesskey) {
        console.log('accesskey : ' + accesskey);
        ItemControl.ItemControlCancelarItemMovimento = true;
        console.log(ItemControl.ItemControlCancelarItemMovimento);
        ItemControl.swalconfirmeActionExcluirCancelar.fire({
            title: "Atenção",
            html: '<b>Deseja cancelar este registro?</b>',
            icon: "warning",
            showConfirmeButton: true,
            showDenyButton: false,
            showCancelButton: true,
            confirmButtonText: 'Sim',
            cancelButtonText: 'Não',
            footer: ItemControl.footerAlert
        }).then((result) => {
            if (result.isConfirmed) {
                $.when($('tbody#tb-itens tr[accesskey="' + accesskey + '"] td select[name="inpu[' + accesskey + '][pim_situacao]"] option[value="ativo"]').removeAttr('selected'), $('tbody#tb-itens tr[accesskey="' + accesskey + '"] td select[name="inpu[' + accesskey + '][pim_situacao]"] option[value="cancelado"]').attr('selected', 'selected'), $('tbody#tb-itens tr[accesskey="' + accesskey + '"] td select[name="inpu[' + accesskey + '][pim_situacao]"] option[value="cancelado"]').prop('selected', true)).then(function (data, textStatus, jqXHR) {
                    $('button[name="btnSalvarItemMovimento"]').click();
                });
            }
            else if (result.isDenied) {
            }
            else {
            }
        });
    }
    ItemControl.cancelarItemMovimento = cancelarItemMovimento;
    function cancelarItemMovimentoDetalhaBcPorEvento(accesskey) {
        console.log('accesskey : ' + accesskey);
        ItemControl.ItemControlCancelarItemMovimento = true;
        console.log(ItemControl.ItemControlCancelarItemMovimento);
        ItemControl.swalconfirmeActionExcluirCancelar.fire({
            title: "Atenção",
            html: '<b>Deseja cancelar este registro?</b>',
            icon: "warning",
            showConfirmeButton: true,
            showDenyButton: false,
            showCancelButton: true,
            confirmButtonText: 'Sim',
            cancelButtonText: 'Não',
            footer: ItemControl.footerAlert
        }).then((result) => {
            if (result.isConfirmed) {
                $.when($('tbody#tb-itens tr[accesskey="' + accesskey + '"] td select[name="inpu[' + accesskey + '][pim_situacao]"] option[value="ativo"]').removeAttr('selected'), $('tbody#tb-itens tr[accesskey="' + accesskey + '"] td select[name="inpu[' + accesskey + '][pim_situacao]"] option[value="cancelado"]').attr('selected', 'selected'), $('tbody#tb-itens tr[accesskey="' + accesskey + '"] td select[name="inpu[' + accesskey + '][pim_situacao]"] option[value="cancelado"]').prop('selected', true)).then(function (data, textStatus, jqXHR) {
                    ItemControl.swalWithBootstrapButtons.fire({
                        title: 'Registro',
                        html: 'Cancelando Registro',
                        icon: "success",
                        showCancelButton: false,
                        confirmButtonText: "Ok",
                        cancelButtonText: "No, cancel!",
                        reverseButtons: true
                    }).then((result) => {
                        if (result.isConfirmed) {
                            var dadosForm = $('form[name="formItensMovimento"]').serializeArray();
                            $.ajax({
                                url: '/PrecatorioItemMovimento/SalvarItemMovimento', data: dadosForm, type: 'post', dataType: 'json', cache: false, async: true,
                                statusCode: { 403: function () { console.log('forbidden'); }, 404: function () { console.log('page not found'); }, 415: function () { console.log('Unsupported Media Type'); }, 405: function () { console.log('method not allowed'); }, 500: function () { console.log('internal server error'); }, 502: function () { console.log('Bad Gateway'); } },
                                success: function (json, textStatus, jqXHR) {
                                    console.log(json);
                                    if (json.sucesso) {
                                        if (ItemControl.ItemControlCancelarItemMovimento) {
                                            ItemControl.swalWithBootstrapButtons.fire({
                                                title: "Cancelamento",
                                                icon: "warning",
                                                html: 'Item cancelado</br>' + json.msg,
                                                showCancelButton: false,
                                                confirmButtonText: "Ok",
                                                cancelButtonText: "No, cancel!",
                                                reverseButtons: true
                                            }).then((result) => {
                                                if (result.isConfirmed) {
                                                    $('button[name="btnReload"]').click();
                                                }
                                                else {
                                                    $('button[name="btnReload"]').click();
                                                }
                                            });
                                            $('button[name="btnGerarPlanilha"]').removeAttr('disabled');
                                        }
                                        else {
                                            ItemControl.swalWithBootstrapButtons.fire({
                                                title: 'Registro',
                                                html: json.msg,
                                                icon: "success",
                                                showCancelButton: false,
                                                confirmButtonText: "Ok",
                                                cancelButtonText: "No, cancel!",
                                                reverseButtons: true
                                            }).then((result) => {
                                                if (result.isConfirmed) {
                                                    $('button[name="btnReload"]').click();
                                                }
                                                else {
                                                    $('button[name="btnReload"]').click();
                                                }
                                            });
                                            $('button[name="btnGerarPlanilha"]').removeAttr('disabled');
                                        }
                                    }
                                    else {
                                        Swal.fire({
                                            icon: "warning", title: "Oops...", html: json.msg, footer: ItemControl.footerAlert
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
                        else {
                        }
                    });
                });
            }
            else if (result.isDenied) {
            }
            else {
            }
        });
    }
    ItemControl.cancelarItemMovimentoDetalhaBcPorEvento = cancelarItemMovimentoDetalhaBcPorEvento;
    function carregarAliquotas(accesskey, pim_mes_referencia, pim_ano_referencia) {
        var CivilMilitar = $('input[name="CivilMilitar"]').val();
        var BcCorrigida = $('input[name="BcCorrigida"]').val();
        var vinculo = $('input[name="vinculo"]').val();
        var dadosForm = $('form[name="formItensMovimento"]').serializeArray();
        $.ajax({
            url: '/PrecatorioItemMovimento/AliquotaVigente', data: { pim_mes_referencia: pim_mes_referencia, pim_ano_referencia: pim_ano_referencia, CivilMilitar: CivilMilitar, vinculo: vinculo }, type: 'post', dataType: 'json', cache: false, async: false,
            statusCode: { 403: function () { console.log('forbidden'); }, 404: function () { console.log('page not found'); }, 415: function () { console.log('Unsupported Media Type'); }, 405: function () { console.log('method not allowed'); }, 500: function () { console.log('internal server error'); }, 502: function () { console.log('Bad Gateway'); } },
            success: function (json, textStatus, jqXHR) {
                console.log(json);
                if (json.sucesso) {
                    var lista = json.lista;
                    for (let x in lista) {
                        var aliq = lista[x];
                        $('tbody#tb-itens tr[accesskey="' + accesskey + '"] td input[name="inpu[' + accesskey + '][tet_valor]"]').val(aliq.tet_valor);
                        $('tbody#tb-itens tr[accesskey="' + accesskey + '"] td input[name="inpu[' + accesskey + '][pim_aliquota_segurado_ate_teto_inss]"]').val(aliq.hal_aliquota_segurado_ate_teto.toFixed(2).toString().replace('.', ','));
                        $('tbody#tb-itens tr[accesskey="' + accesskey + '"] td label[id="inpu[' + accesskey + '][label_pim_aliquota_segurado_ate_teto_inss]"]').empty().html(aliq.hal_aliquota_segurado_ate_teto.toFixed(2).toString().replace('.', ','));
                        $('tbody#tb-itens tr[accesskey="' + accesskey + '"] td input[name="inpu[' + accesskey + '][pim_aliquota_segurado_acima_teto_inss]"]').val(aliq.hal_aliquota_segurado_acima_teto.toFixed(2).toString().replace('.', ','));
                        $('tbody#tb-itens tr[accesskey="' + accesskey + '"] td label[id="inpu[' + accesskey + '][label_pim_aliquota_segurado_acima_teto_inss]"]').empty().html(aliq.hal_aliquota_segurado_acima_teto.toFixed(2).toString().replace('.', ','));
                        $('tbody#tb-itens tr[accesskey="' + accesskey + '"] td input[name="inpu[' + accesskey + '][pim_aliquota_patronal_ate_teto_inss]"]').val(aliq.hal_aliquota_patronal_ate_teto.toFixed(2).toString().replace('.', ','));
                        $('tbody#tb-itens tr[accesskey="' + accesskey + '"] td label[id="inpu[' + accesskey + '][label_pim_aliquota_patronal_ate_teto_inss]"]').empty().html(aliq.hal_aliquota_patronal_ate_teto.toFixed(2).toString().replace('.', ','));
                        $('tbody#tb-itens tr[accesskey="' + accesskey + '"] td input[name="inpu[' + accesskey + '][pim_aliquota_patronal_acima_teto_inss]"]').val(aliq.hal_aliquota_patronal_acima_teto.toFixed(2).toString().replace('.', ','));
                        $('tbody#tb-itens tr[accesskey="' + accesskey + '"] td label[id="inpu[' + accesskey + '][label_pim_aliquota_patronal_acima_teto_inss]"]').empty().html(aliq.hal_aliquota_patronal_acima_teto.toFixed(2).toString().replace('.', ','));
                        $('tbody#tb-itens tr[accesskey="' + accesskey + '"] td input[name="inpu[' + accesskey + '][pim_aliquota_patronal_art_122]"]').val(aliq.hal_aliquota_patronal_art_122.toFixed(2).toString().replace('.', ','));
                        if (aliq.hal_aliquota_segurado_ate_teto == aliq.hal_aliquota_segurado_acima_teto) {
                            $('tbody#tb-itens tr[accesskey="' + accesskey + '"] td input[name="inpu[' + accesskey + '][pim_aliquota_segurado_acima_teto_inss]"]').css('display', 'none');
                            $('tbody#tb-itens tr[accesskey="' + accesskey + '"] td label[id="inpu[' + accesskey + '][label_pim_aliquota_segurado_acima_teto_inss]"]').css('display', 'none');
                        }
                        if (aliq.hal_aliquota_patronal_ate_teto == aliq.hal_aliquota_patronal_acima_teto) {
                            $('tbody#tb-itens tr[accesskey="' + accesskey + '"] td input[name="inpu[' + accesskey + '][pim_aliquota_patronal_acima_teto_inss]"]').css('display', 'none');
                            $('tbody#tb-itens tr[accesskey="' + accesskey + '"] td label[id="inpu[' + accesskey + '][label_pim_aliquota_patronal_acima_teto_inss]"]').css('display', 'none');
                        }
                    }
                    $('input.monet').maskMoney({ prefix: '', allowNegative: true, thousands: '.', decimal: ',', affixesStay: false });
                }
                else {
                    $('button[name="btnSalvarItemMovimento"]').attr('disabled', 'disabled');
                    Swal.fire({ icon: "warning", title: 'Aviso:', html: json.msg, footer: ItemControl.footerAlert });
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
    ItemControl.carregarAliquotas = carregarAliquotas;
    function salvarItens() {
        var dadosForm = $('form[name="formItensMovimento"]').serializeArray();
        console.log('valido');
        $.ajax({
            url: '/PrecatorioItemMovimento/SalvarItemMovimento', data: dadosForm, type: 'post', dataType: 'json', cache: false, async: true,
            statusCode: { 403: function () { console.log('forbidden'); }, 404: function () { console.log('page not found'); }, 415: function () { console.log('Unsupported Media Type'); }, 405: function () { console.log('method not allowed'); }, 500: function () { console.log('internal server error'); }, 502: function () { console.log('Bad Gateway'); } },
            success: function (json, textStatus, jqXHR) {
                console.log(json);
                if (json.sucesso) {
                    if (ItemControl.ItemControlCancelarItemMovimento) {
                        ItemControl.swalWithBootstrapButtons.fire({
                            title: "Cancelamento",
                            icon: "warning",
                            html: 'Item cancelado</br>' + json.msg,
                            showCancelButton: false,
                            confirmButtonText: "Ok",
                            cancelButtonText: "No, cancel!",
                            reverseButtons: true
                        }).then((result) => {
                            if (result.isConfirmed) {
                                $('button[name="btnReload"]').click();
                            }
                            else {
                                $('button[name="btnReload"]').click();
                            }
                        });
                        $('button[name="btnGerarPlanilha"]').removeAttr('disabled');
                    }
                    else {
                        ItemControl.swalWithBootstrapButtons.fire({
                            title: 'Registro',
                            html: json.msg,
                            icon: "success",
                            showCancelButton: false,
                            confirmButtonText: "Ok",
                            cancelButtonText: "No, cancel!",
                            reverseButtons: true
                        }).then((result) => {
                            if (result.isConfirmed) {
                                $('button[name="btnReload"]').click();
                            }
                            else {
                                $('button[name="btnReload"]').click();
                            }
                        });
                        $('button[name="btnGerarPlanilha"]').removeAttr('disabled');
                    }
                }
                else {
                    Swal.fire({
                        icon: "warning", title: "Oops...", html: json.msg, footer: ItemControl.footerAlert
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
    ItemControl.salvarItens = salvarItens;
    function validarCamposDetalhaBcPorEvento(accesskey, campo) {
        ItemControl.valido_c = true;
        ItemControl.msg = '';
        if (accesskey > 0) {
            var pim_situacao = $('tbody#tb-itens tr[accesskey="' + accesskey + '"] td select[name="inpu[' + accesskey + '][pim_situacao]"] option:selected').val();
            if (campo === 'pim_situacao') {
                if (pim_situacao === 'ativo') {
                    ItemControl.swalWithBootstrapButtons.fire({
                        title: "Situação",
                        html: 'Confirma reativação desse Mês/Ano Referência.\nConfirmar?',
                        icon: "warning",
                        showConfirmButton: true,
                        showCancelButton: true,
                        confirmButtonText: "Sim",
                        conCancelButtonText: "Não"
                    }).then((result) => {
                        if (result.isConfirmed) {
                            $('tbody#tb-itens tr[accesskey="' + accesskey + '"] td select[name="inpu[' + accesskey + '][pim_situacao]"] option').val('ativo');
                            ItemControl.salvarItens();
                        }
                        else {
                            $('tbody#tb-itens tr[accesskey="' + accesskey + '"] td select[name="inpu[' + accesskey + '][pim_situacao]"] option').val('cancelado');
                            ItemControl.salvarItens();
                        }
                    });
                }
                else {
                    ItemControl.swalWithBootstrapButtons.fire({
                        title: "Situação",
                        html: 'Confirma cancelamento desse Mês/Ano Referência.\nConfirmar?',
                        icon: "warning",
                        showConfirmButton: true,
                        showCancelButton: true,
                        confirmButtonText: "Sim",
                        conCancelButtonText: "Não"
                    }).then((result) => {
                        if (result.isConfirmed) {
                            $('tbody#tb-itens tr[accesskey="' + accesskey + '"] td select[name="inpu[' + accesskey + '][pim_situacao]"] option').val('cancelado');
                            ItemControl.ItemControlCancelarItemMovimento = true;
                            ItemControl.salvarItens();
                        }
                        else {
                            $('tbody#tb-itens tr[accesskey="' + accesskey + '"] td select[name="inpu[' + accesskey + '][pim_situacao]"] option').val('ativo');
                            ItemControl.salvarItens();
                        }
                    });
                }
            }
        }
        if (ItemControl.valido_c) {
            if ($('input[name="DetalhaBcPorEvento"]').val() === 'sim') {
                $('button[name="btnAtualizarResumo"]').removeAttr('disabled');
            }
            else {
                $('button[name="btnSalvarItemMovimento"]').removeAttr('disabled');
                $('button[name="btnAtualizarResumo"]').removeAttr('disabled');
            }
        }
        else {
            $('button[name="btnSalvarItemMovimento"]').attr('disabled', 'disabled');
            $('button[name="btnAtualizarResumo"]').attr('disabled', 'disabled');
            Swal.fire({ icon: 'warning', title: "Dados incorretos", html: ItemControl.msg, footer: ItemControl.footerAlert });
        }
        return ItemControl.valido_c;
    }
    ItemControl.validarCamposDetalhaBcPorEvento = validarCamposDetalhaBcPorEvento;
    function calculaBaseCorrigida(accesskey) {
    }
    ItemControl.calculaBaseCorrigida = calculaBaseCorrigida;
    function totValoresItens() {
        console.table(ItemControl.dadosDaTabela);
        const parseCurrency = (value) => {
            if (!value || value === '')
                return 0;
            return parseFloat(value.replace(',', '.'));
        };
        var BcCorrigida = $('input[name="BcCorrigida"]').val();
        var bcSegurado = 0;
        var bcPatronal = 0;
        var bcSeguradoCorrigida = 0;
        var bcPatronalCorrigida = 0;
        var cotaSegurado = 0;
        var cotaPatronal = 0;
        $.when(ItemControl.dadosDaTabela.forEach(rowData => {
            bcSegurado += rowData.pim_base_calculo_contribuicao_segurado;
            bcPatronal += rowData.pim_base_calculo_contribuicao_patronal;
            bcSeguradoCorrigida += rowData.pim_base_calculo_contribuicao_segurado_corrigida;
            bcPatronalCorrigida += rowData.pim_base_calculo_contribuicao_patronal_corrigida;
            cotaSegurado += rowData.pim_vlr_cota_segurado;
            cotaPatronal += rowData.pim_vlr_cota_patronal;
        })).then(function (data, textStatus, jqXHR) {
            const formatCurrency = (value) => Intl.NumberFormat('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                .format(value)
                .replace('R$ ', '');
            const updateLabel = (id, value) => $(`label[id="${id}"]`).empty().html(formatCurrency(value));
            if (BcCorrigida === 'sim') {
                updateLabel('tot-bc-segurado-corrigida-bcjc', bcSeguradoCorrigida);
                updateLabel('tot-bc-patronal-corrigida-bcjc', bcPatronalCorrigida);
            }
            else {
                updateLabel('tot-bc-segurado', bcSegurado);
                updateLabel('tot-bc-patronal', bcPatronal);
                updateLabel('tot-bc-segurado-corrigida', bcSeguradoCorrigida);
                updateLabel('tot-bc-patronal-corrigida', bcPatronalCorrigida);
            }
            updateLabel('tot-cota-segurado', cotaSegurado);
            updateLabel('tot-cota-patronal', cotaPatronal);
        });
    }
    ItemControl.totValoresItens = totValoresItens;
    function inputMascara() {
        $('input.monet').maskMoney({ prefix: '', allowNegative: true, thousands: '.', decimal: ',', affixesStay: true });
        $('input.monetIndice').inputmask({ mask: function () { return ["9,99999999", "99,99999999"]; } });
        $('input.mes_ano').mask("99/9999");
    }
    ItemControl.inputMascara = inputMascara;
    function calcularCota(accesskeyy, campo) {
        ItemControl.valido = true;
        ItemControl.valido_para_calc_cota = true;
        if (ItemControl.valido_c) {
            ItemControl.msg = '';
        }
        else {
            ItemControl.msg += '';
        }
        var matricula = $('input[name="matricula"]').val();
        var BcCorrigida = $('input[name="BcCorrigida"]').val();
        var vinculo = $('input[name="vinculo"]').val();
        var movCivilMilitar = $('input[name="movCivilMilitar"]').val();
        var bcs_1 = $('input[name="inpu[' + accesskeyy + '][pim_base_calculo_contribuicao_segurado_corrigida]"]').val();
        var bcs_2 = ((bcs_1 != null && bcs_1 != '') ? bcs_1.toString().replace('.', '').replace('.', '').replace('.', '') : '0');
        var bcs_3 = Number(bcs_2.replace(',', '.'));
        var bcp_1 = $('input[name="inpu[' + accesskeyy + '][pim_base_calculo_contribuicao_patronal_corrigida]"]').val();
        var bcp_2 = ((bcp_1 != null && bcp_1 != '') ? bcp_1.toString().replace('.', '').replace('.', '').replace('.', '') : '0');
        var bcp_3 = Number(bcp_2.replace(',', '.'));
        var pasati_1 = $('input[name="inpu[' + accesskeyy + '][pim_aliquota_segurado_ate_teto_inss]"]').val();
        var pasati_2 = ((pasati_1 != null && pasati_1 != '') ? pasati_1.toString().replace('.', '').replace('.', '').replace('.', '') : '0');
        var pim_aliquota_segurado_ate_teto_inss = Number(pasati_2.replace(',', '.'));
        var pasacti_1 = $('input[name="inpu[' + accesskeyy + '][pim_aliquota_segurado_acima_teto_inss]"]').val();
        var pasacti_2 = ((pasacti_1 != null && pasacti_1 != '') ? pasacti_1.toString().replace('.', '').replace('.', '').replace('.', '') : '0');
        var pim_aliquota_segurado_acima_teto_inss = Number(pasacti_2.replace(',', '.'));
        var papati_1 = $('input[name="inpu[' + accesskeyy + '][pim_aliquota_patronal_ate_teto_inss]"]').val();
        var papati_2 = ((papati_1 != null && papati_1 != '') ? papati_1.toString().replace('.', '').replace('.', '').replace('.', '') : '0');
        var pim_aliquota_patronal_ate_teto_inss = Number(papati_2.replace(',', '.'));
        var papacti_1 = $('input[name="inpu[' + accesskeyy + '][pim_aliquota_patronal_acima_teto_inss]"]').val();
        var papacti_2 = ((papacti_1 != null && papacti_1 != '') ? papacti_1.toString().replace('.', '').replace('.', '').replace('.', '') : '0');
        var pim_aliquota_patronal_acima_teto_inss = Number(papacti_2.replace(',', '.'));
        var tet_v = $('input[name="inpu[' + accesskeyy + '][tet_valor]"]').val();
        var tet_valor = Number((tet_v != null && tet_v != '' && tet_v != '0') ? tet_v : '0');
        var mes_ano = $('tbody#tb-itens tr td input[name="inpu[' + accesskeyy + '][mes_ano]"]').val();
        console.log('mes_ano 517: ' + mes_ano);
        let pim_mes_referencia = '';
        let pim_ano_referencia = '';
        if (mes_ano !== null && mes_ano !== '') {
            if (mes_ano && mes_ano.toString().length > 5) {
                var _mes_ano_ = typeof mes_ano === 'string' ? mes_ano.split('/') : [];
                pim_mes_referencia = _mes_ano_[0] !== undefined ? _mes_ano_[0] : '';
                pim_ano_referencia = _mes_ano_[1] !== undefined ? _mes_ano_[1] : '';
            }
            else {
                ItemControl.valido_para_calc_cota = false;
            }
        }
        else {
            ItemControl.valido_para_calc_cota = false;
        }
        if (bcs_3 > 0) {
            if ($('input[name="BcCorrigida"]').val() === 'sim' && campo === 'pim_base_calculo_contribuicao_segurado_corrigida') {
                $('tbody#tb-itens tr td input[name="inpu[' + accesskeyy + '][pim_base_calculo_contribuicao_patronal_corrigida]"]').val((bcs_1 !== null && bcs_1 !== void 0 ? bcs_1 : '').toString());
            }
        }
        else {
            if (campo === 'pim_base_calculo_contribuicao_segurado_corrigida') {
                ItemControl.valido = false;
                ItemControl.valido_para_calc_cota = false;
                ItemControl.msg += '</br>Valor da Base de Calculo do Segurado corrigida não pode ser igual a 0';
            }
        }
        if (bcp_3 > 0) {
        }
        else {
            if (campo === 'pim_base_calculo_contribuicao_patronal_corrigida') {
                ItemControl.valido = false;
                ItemControl.valido_para_calc_cota = false;
                ItemControl.msg += '</br>Valor da Base de Calculo do Patronal corrigida não pode ser igual a 0 --' + bcp_3;
            }
        }
        var pbccss1 = $('tbody#tb-itens tr td input[name="inpu[' + accesskeyy + '][pim_vlr_cota_segurado]"]').val();
        var pbccss2 = ((pbccss1 != null && pbccss1 != '') ? pbccss1.toString().replace('.', '').replace('.', '').replace('.', '') : '0');
        var pbccss3 = pbccss2.replace(',', '.');
        var pim_vlr_cota_segurado = pbccss3;
        if ((pim_vlr_cota_segurado === '0' || pim_vlr_cota_segurado === '0.00' || pim_vlr_cota_segurado === '') && campo === 'pim_vlr_cota_segurado') {
            ItemControl.valido = false;
            ItemControl.msg += '</br>Valor da Cota Segurado não pode ser igual a 0';
        }
        var pbccsp1 = $('tbody#tb-itens tr td input[name="inpu[' + accesskeyy + '][pim_vlr_cota_patronal]"]').val();
        var pbccsp2 = ((pbccsp1 != null && pbccsp1 != '') ? pbccsp1.toString().replace('.', '').replace('.', '').replace('.', '') : '0');
        var pbccsp3 = pbccsp2.replace(',', '.');
        var pim_vlr_cota_patronal = pbccsp3;
        if ((pim_vlr_cota_patronal === '0' || pim_vlr_cota_patronal === '0.00' || pim_vlr_cota_patronal === '') && campo === 'pim_vlr_cota_patronal') {
            ItemControl.valido = false;
            ItemControl.msg += '</br>Valor da Cota Patronal não pode ser igual a 0';
        }
        if (ItemControl.valido) {
            if ($('input[name="DetalhaBcPorEvento"]').val() === 'sim') {
            }
            else {
                if (ItemControl.valido_c) {
                    $('button[name="btnSalvarItemMovimento"]').removeAttr('disabled');
                }
                else {
                    $('button[name="btnSalvarItemMovimento"]').attr('disabled', 'disabled');
                }
            }
            console.log('pim_mes_referencia : ' + pim_mes_referencia);
            if (ItemControl.valido_c && ItemControl.valido_para_calc_cota) {
                $.ajax({
                    url: '/PrecatorioItemMovimento/CalcularCota', data: {
                        matricula: matricula,
                        vinculo: vinculo,
                        pim_mes_referencia: pim_mes_referencia,
                        pim_ano_referencia: pim_ano_referencia,
                        pim_base_calculo_contribuicao_segurado_corrigida: bcs_2,
                        pim_base_calculo_contribuicao_patronal_corrigida: bcp_2,
                        pim_aliquota_segurado_ate_teto_inss: pim_aliquota_segurado_ate_teto_inss,
                        pim_aliquota_segurado_acima_teto_inss: pim_aliquota_segurado_acima_teto_inss,
                        pim_aliquota_patronal_ate_teto_inss: pim_aliquota_patronal_ate_teto_inss,
                        pim_aliquota_patronal_acima_teto_inss: pim_aliquota_patronal_acima_teto_inss,
                        tet_valor: tet_valor,
                        movCivilMilitar: movCivilMilitar
                    },
                    type: 'post', dataType: 'json', cache: false, async: true,
                    statusCode: { 403: function () { console.log('forbidden'); }, 404: function () { console.log('page not found'); }, 415: function () { console.log('Unsupported Media Type'); }, 405: function () { console.log('method not allowed'); }, 500: function () { console.log('internal server error'); }, 502: function () { console.log('Bad Gateway'); } },
                    success: function (json, textStatus, jqXHR) {
                        console.log(json);
                        if (json.sucesso) {
                            console.log('pim_vlr_cota_patronal_art_122 : ' + Intl.NumberFormat('pt-br', { style: 'currency', currency: 'BRL' }).format(json.pct_item_movimento.pim_vlr_cota_patronal_art_122).replace('R$ ', ''));
                            if (BcCorrigida === 'sim') {
                                $('input[name="inpu[' + accesskeyy + '][pim_vlr_cota_segurado]"]').val(Intl.NumberFormat('pt-br', { style: 'currency', currency: 'BRL' }).format(json.pct_item_movimento.pim_vlr_cota_segurado).replace('R$ ', ''));
                                $('input[name="inpu[' + accesskeyy + '][pim_vlr_cota_patronal]"]').val(Intl.NumberFormat('pt-br', { style: 'currency', currency: 'BRL' }).format(json.pct_item_movimento.pim_vlr_cota_patronal).replace('R$ ', ''));
                                $('input[name="inpu[' + accesskeyy + '][pim_vlr_cota_patronal_art_122]"]').val(Intl.NumberFormat('pt-br', { style: 'currency', currency: 'BRL' }).format(json.pct_item_movimento.pim_vlr_cota_patronal_art_122).replace('R$ ', ''));
                                $('label[id="inpu[' + accesskeyy + '][label_pim_vlr_cota_segurado]"]').empty().html(Intl.NumberFormat('pt-br', { style: 'currency', currency: 'BRL' }).format(json.pct_item_movimento.pim_vlr_cota_segurado).replace('R$ ', ''));
                                $('label[id="inpu[' + accesskeyy + '][label_pim_vlr_cota_patronal]"]').empty().html(Intl.NumberFormat('pt-br', { style: 'currency', currency: 'BRL' }).format(json.pct_item_movimento.pim_vlr_cota_patronal).replace('R$ ', ''));
                            }
                            else {
                                $('input[name="inpu[' + accesskeyy + '][pim_vlr_cota_segurado]"]').val(Intl.NumberFormat('pt-br', { style: 'currency', currency: 'BRL' }).format(json.pct_item_movimento.pim_vlr_cota_segurado).replace('R$ ', ''));
                                $('input[name="inpu[' + accesskeyy + '][pim_vlr_cota_patronal]"]').val(Intl.NumberFormat('pt-br', { style: 'currency', currency: 'BRL' }).format(json.pct_item_movimento.pim_vlr_cota_patronal).replace('R$ ', ''));
                                $('input[name="inpu[' + accesskeyy + '][pim_vlr_cota_patronal_art_122]"]').val(Intl.NumberFormat('pt-br', { style: 'currency', currency: 'BRL' }).format(json.pct_item_movimento.pim_vlr_cota_patronal_art_122).replace('R$ ', ''));
                                $('label[id="inpu[' + accesskeyy + '][label_pim_vlr_cota_segurado]"]').empty().html(Intl.NumberFormat('pt-br', { style: 'currency', currency: 'BRL' }).format(json.pct_item_movimento.pim_vlr_cota_segurado).replace('R$ ', ''));
                                $('label[id="inpu[' + accesskeyy + '][label_pim_vlr_cota_patronal]"]').empty().html(Intl.NumberFormat('pt-br', { style: 'currency', currency: 'BRL' }).format(json.pct_item_movimento.pim_vlr_cota_patronal).replace('R$ ', ''));
                            }
                            ItemControl.totValoresItens();
                        }
                        else {
                            Swal.fire({
                                icon: "warning", title: "Oops...", text: json.msg, footer: ItemControl.footerAlert
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
            else {
            }
        }
        else {
            $('button[name="btnSalvarItemMovimento"]').attr('disabled', 'disabled');
            $('button[name="btnAtualizarResumo"]').attr('disabled', 'disabled');
            Swal.fire({ icon: 'warning', title: "Dados incorretos", html: ItemControl.msg, footer: ItemControl.footerAlert });
        }
    }
    ItemControl.calcularCota = calcularCota;
    function verificarItesSemRegistro() {
        if ($('tbody#tb-itens tr td input.pim_sequencial').length) {
            ItemControl.itensSemRegistro = true;
        }
        else {
            ItemControl.itensSemRegistro = false;
        }
    }
    ItemControl.verificarItesSemRegistro = verificarItesSemRegistro;
    function validarCampos(accesskey, campo) {
        ItemControl.valido_c = true;
        $.when(ItemControl.verificarItesSemRegistro()).then(function (data, textStatus, jqXHR) {
            if (ItemControl.itensSemRegistro) {
            }
            else {
            }
        });
        let msg = '';
        if (ItemControl.validar) {
            if (accesskey !== null && accesskey > 0) {
                let mes_ano_ = $('tbody#tb-itens tr[accesskey="' + accesskey + '"] td input[name="inpu[' + accesskey + '][mes_ano]"]').val();
                let mes_ano = (mes_ano_ !== undefined && mes_ano_ !== '') ? mes_ano_.toString() : '';
                console.log('mes_ano : ' + mes_ano);
                if (mes_ano !== null && mes_ano !== '') {
                    var cnt = 0;
                    $('input.mes_ano').each(function (index) {
                        var _mes_ano_ = $(this).val();
                        var accesskeyyyy = $(this).attr('accesskey');
                        if (mes_ano === _mes_ano_) {
                            cnt++;
                        }
                    });
                    if (cnt > 1) {
                        ItemControl.valido_c = false;
                        msg += '</br>' + mes_ano + ' Já informado!';
                        $('tbody#tb-itens tr[accesskey="' + accesskey + '"] td input[name="inpu[' + accesskey + '][mes_ano]"]').val('');
                    }
                    let pim_mes_referencia = '';
                    let pim_ano_referencia = '';
                    if (mes_ano.length == 7) {
                        var _mes_ano_ = mes_ano.split('/');
                        pim_mes_referencia = (_mes_ano_[0] !== null) ? _mes_ano_[0] : '';
                        pim_ano_referencia = (_mes_ano_[1] !== null) ? _mes_ano_[1] : '';
                        var validames = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
                        if (validames.indexOf(pim_mes_referencia) != -1) { }
                        else {
                            ItemControl.valido_c = false;
                            msg += '</br>Mês: ' + pim_mes_referencia + ' referência informado inválido';
                            $('tbody#tb-itens tr[accesskey="' + accesskey + '"] td input[name="inpu[' + accesskey + '][mes_ano]"]').val('');
                        }
                        var amri = $('input[name="anomes_referencia_inicial"]').val();
                        var mes_ano_ini = amri !== undefined && amri !== null ? amri.toString().substr(4, 2) + '/' + amri.toString().substr(0, 4) : '';
                        var anomes_referencia_inicial = Number(amri);
                        var pim_ano_mes = Number(pim_ano_referencia + '' + (pim_mes_referencia.length > 1 ? '' : '0') + pim_mes_referencia);
                        if (pim_ano_mes < anomes_referencia_inicial && (campo === 'mes_ano' || campo === 'todos')) {
                            ItemControl.valido_c = false;
                            msg += '</br>Mês:' + pim_mes_referencia + '/' + pim_ano_referencia + ' informado anterior ao ' + mes_ano_ini + ' Inicial do Processo';
                            $('tbody#tb-itens tr[accesskey="' + accesskey + '"] td input[name="inpu[' + accesskey + '][mes_ano]"]').val('');
                        }
                        var anomes_referencia_final = $('input[name="anomes_referencia_final"]').val();
                        var mes_ano_fim = ((anomes_referencia_final !== undefined && anomes_referencia_final != null)
                            ? anomes_referencia_final.toString().substr(4, 2) + '/' + anomes_referencia_final.toString().substr(0, 4) : '');
                        if (Number(pim_ano_referencia + '' + (pim_mes_referencia.length > 1 ? '' : '0') + pim_mes_referencia) > Number(anomes_referencia_final)
                            && (campo === 'mes_ano' || campo === 'todos')
                            && Number(pim_ano_referencia + '' + (pim_mes_referencia.length > 1 ? '' : '0') + pim_mes_referencia) !== Number(pim_ano_referencia + '13')) {
                            ItemControl.valido_c = false;
                            msg += '</br>Mês:' + pim_mes_referencia + '/' + pim_ano_referencia + ' informado posterior ao ' + mes_ano_fim + ' Final do Processo. ';
                            $('tbody#tb-itens tr[accesskey="' + accesskey + '"] td input[name="inpu[' + accesskey + '][mes_ano]"]').val('');
                        }
                        if (campo !== 'pim_mes_referencia' && ItemControl.valido_c === true) {
                            if ((Number(pim_ano_referencia) > 1980 || (Number(pim_ano_referencia) == 1980 && Number(pim_mes_referencia) >= 12))
                                && Number(pim_ano_referencia) <= Number(anomes_referencia_final !== undefined ? anomes_referencia_final.toString().substr(0, 4) : '0')) { }
                            else {
                                ItemControl.valido_c = false;
                                msg += '</br>Ano: ' + pim_ano_referencia + ' referência informado inválido';
                                $('tbody#tb-itens tr[accesskey="' + accesskey + '"] td input[name="inpu[' + accesskey + '][mes_ano]"]').val('');
                            }
                        }
                        if (ItemControl.valido_c && pim_mes_referencia !== null && pim_mes_referencia !== '' && pim_ano_referencia !== null && pim_ano_referencia !== '' && (campo === 'mes_ano' || campo === 'pim_indice_correcao')) {
                            $.when(carregarAliquotas(accesskey, pim_mes_referencia, pim_ano_referencia)).then(function (data, textStatus, jqXHR) {
                                ItemControl.calcularCota(accesskey, campo);
                            });
                        }
                        if (ItemControl.valido_c && campo === 'pim_base_calculo_contribuicao_segurado' || campo === 'pim_base_calculo_contribuicao_patronal' || campo === 'pim_indice_correcao' || campo === 'pim_base_calculo_contribuicao_segurado_corrigida' || campo === 'pim_base_calculo_contribuicao_patronal_corrigida') {
                            $.when(carregarAliquotas(accesskey, pim_mes_referencia, pim_ano_referencia)).then(function (data, textStatus, jqXHR) {
                                ItemControl.calcularCota(accesskey, campo);
                            });
                        }
                    }
                    else {
                        ItemControl.valido_c = false;
                        msg += '</br>' + mes_ano + ' informado inválido';
                        $('tbody#tb-itens tr[accesskey="' + accesskey + '"] td input[name="inpu[' + accesskey + '][mes_ano]"]').val('');
                    }
                }
                else {
                    ItemControl.valido_c = false;
                    msg += (campo === 'mes_ano') ? '\nCampo Mês/Ano não informado' : '';
                    $('tbody#tb-itens tr[accesskey="' + accesskey + '"] td input[name="inpu[' + accesskey + '][mes_ano]"]').val('');
                }
                var pbccs1 = $('tbody#tb-itens tr[accesskey="' + accesskey + '"] td input[name="inpu[' + accesskey + '][pim_base_calculo_contribuicao_segurado]"]').val();
                var pbccs2 = ((pbccs1 != undefined && pbccs1 != null && pbccs1 != '') ? pbccs1.toString().replace('.', '').replace('.', '').replace('.', '') : '0');
                var pbccs3 = pbccs2.replace(',', '.');
                var pim_base_calculo_contribuicao_segurado = pbccs3;
                if ((pim_base_calculo_contribuicao_segurado === '0' || pim_base_calculo_contribuicao_segurado === '0.00' || pim_base_calculo_contribuicao_segurado === '') && campo === 'pim_base_calculo_contribuicao_segurado') {
                    ItemControl.valido_c = false;
                    msg += '</br>Valor da Base de Cálculo do Segurado não pode ser igual a 0';
                }
                if ((pim_base_calculo_contribuicao_segurado === '0' || pim_base_calculo_contribuicao_segurado === '') && campo === 'todos') {
                    ItemControl.valido_c = false;
                    msg += '</br>Valor da Base de Cálculo do Segurado não pode ser igual a 0';
                }
                if (Number(pim_base_calculo_contribuicao_segurado) >= 100000 && campo === 'pim_base_calculo_contribuicao_segurado') {
                    ItemControl.swalWithBootstrapButtons.fire({
                        title: "Base de Cálculo do Segurado",
                        html: "Valor da Base de Cálculo do Segurado maior que R$ 100.000,00.\nConfirmar?",
                        icon: "warning",
                        showConfirmButton: true,
                        showCancelButton: true,
                        confirmButtonText: "Sim",
                        conCancelButtonText: "Não"
                    }).then((result) => {
                        if (result.isConfirmed) {
                        }
                        else {
                            $('tbody#tb-itens tr[accesskey="' + accesskey + '"] td input[name="inpu[' + accesskey + '][pim_base_calculo_contribuicao_segurado]"]').val('');
                        }
                    });
                }
                var pbccp1 = $('tbody#tb-itens tr[accesskey="' + accesskey + '"] td input[name="inpu[' + accesskey + '][pim_base_calculo_contribuicao_patronal]"]').val();
                var pbccp2 = ((pbccp1 != undefined && pbccp1 != null && pbccp1 != '') ? pbccp1.toString().replace('.', '').replace('.', '').replace('.', '') : '0');
                var pbccp3 = pbccp2.replace(',', '.');
                var pim_base_calculo_contribuicao_patronal = pbccp3;
                if ((pim_base_calculo_contribuicao_patronal === '0' || pim_base_calculo_contribuicao_patronal === '0.00' || pim_base_calculo_contribuicao_patronal === '') && campo === 'pim_base_calculo_contribuicao_patronal') {
                    ItemControl.valido_c = false;
                    msg += '</br>Valor da Base de Cálculo do Patronal não pode ser igual a 0';
                }
                if ((pim_base_calculo_contribuicao_patronal === '0' || pim_base_calculo_contribuicao_patronal === '') && campo === 'todos') {
                    ItemControl.valido_c = false;
                    msg += '</br>Valor da Base de Cálculo do Patronal não pode ser igual a 0';
                }
                if (Number(pim_base_calculo_contribuicao_patronal) >= 100000 && campo === 'pim_base_calculo_contribuicao_patronal') {
                    ItemControl.swalWithBootstrapButtons.fire({
                        title: "Base de Cálculo do Patronal",
                        html: "Valor da Base de Cálculo do Patronal maior que R$ 100.000,00.\nConfirmar?",
                        icon: "warning",
                        showConfirmButton: true,
                        showCancelButton: true,
                        confirmButtonText: "Sim",
                        conCancelButtonText: "Não"
                    }).then((result) => {
                        if (result.isConfirmed) {
                        }
                        else {
                            $('tbody#tb-itens tr[accesskey="' + accesskey + '"] td input[name="inpu[' + accesskey + '][pim_base_calculo_contribuicao_patronal]"]').val('');
                        }
                    });
                }
                var pic1 = $('tbody#tb-itens tr[accesskey="' + accesskey + '"] td input[name="inpu[' + accesskey + '][pim_indice_correcao]"]').val();
                var pic_2_1 = ((pic1 != undefined && pic1 != null && pic1 != '') ? pic1.toString().replace('.', '').replace('.', '').replace('.', '') : '0,00000000');
                var pic_2_2 = pic_2_1.split(',');
                var p1_ = pic_2_2[0];
                var p2_ = pic_2_2[1].replace(/[^0-9]/g, '');
                var pic_2_3 = ((p1_ !== null && p1_ !== '') ? p1_ : '0') + '.' + ((p2_ !== null && p2_ !== '') ? p2_ : '00000000');
                var pic3 = Number(pic_2_3);
                var pim_indice_correcao = pic3;
                $('tbody#tb-itens tr[accesskey="' + accesskey + '"] td input[name="inpu[' + accesskey + '][pim_indice_correcao]"]').val(Number(pim_indice_correcao).toFixed(8).toString().replace('.', ','));
                if ((pic_2_3 === '' || pic_2_3 === '0' || pic_2_3 === '0.00' || pic_2_3 === '0,00000000' || pic_2_3 === '0.00000000')
                    && campo === 'pim_indice_correcao') {
                    ItemControl.valido_c = false;
                    msg += '</br>Valor do Índice da Correção Monetária não pode ser igual a 0';
                }
                if ((pim_indice_correcao.toString() === '0' || pim_indice_correcao.toString() === '' || pim_indice_correcao === null) && campo === 'todos') {
                    ItemControl.valido_c = false;
                    msg += '</br>Valor do Índice da Correção Monetária não pode ser igual a 0';
                }
                if (pim_indice_correcao >= 15 && campo === 'pim_indice_correcao') {
                    ItemControl.swalWithBootstrapButtons.fire({
                        title: "Valor de índice",
                        html: "Índice de Correção Monetária maior que 15,00000000.\nConfirmar?",
                        icon: "warning",
                        showConfirmButton: true,
                        showCancelButton: true,
                        confirmButtonText: "Sim",
                        conCancelButtonText: "Não"
                    }).then((result) => {
                        if (result.isConfirmed) {
                        }
                        else {
                            $('tbody#tb-itens tr[accesskey="' + accesskey + '"] td input[name="inpu[' + accesskey + '][pim_indice_correcao]"]').val('');
                        }
                    });
                }
                var pbccsc1 = $('input[name="inpu[' + accesskey + '][pim_base_calculo_contribuicao_segurado_corrigida]"]').val();
                var pbccsc2 = ((pbccsc1 != undefined && pbccsc1 != null && pbccsc1 != '') ? pbccsc1.toString().replace('.', '').replace('.', '').replace('.', '') : '0');
                var pbccsc3 = pbccsc2.replace(',', '.');
                var pim_base_calculo_contribuicao_segurado_corrigida = pbccsc3;
                if ((pim_base_calculo_contribuicao_segurado_corrigida === '0' || pim_base_calculo_contribuicao_segurado_corrigida === '0.00' || pim_base_calculo_contribuicao_segurado_corrigida === '') && campo === 'pim_base_calculo_contribuicao_segurado_corrigida') {
                    ItemControl.valido_c = false;
                    msg += '</br>Valor da Base de Cálculo do Segurado Corrigida não pode ser igual a 0';
                }
                if ((pim_base_calculo_contribuicao_segurado_corrigida === '0' || pim_base_calculo_contribuicao_segurado_corrigida === '') && campo === 'todos') {
                    ItemControl.valido_c = false;
                    msg += '</br>Valor da Base de Cálculo do Segurado Corrigida não pode ser igual a 0';
                }
                if (Number(pim_base_calculo_contribuicao_segurado_corrigida) >= 100000 && campo === 'pim_base_calculo_contribuicao_segurado_corrigida') {
                    ItemControl.swalWithBootstrapButtons.fire({
                        title: "Base de Cálculo do Segurado",
                        html: "Valor da Base de Cálculo do Segurado Corrigida maior que R$100.000,00.\nConfirmar?",
                        icon: "warning",
                        showConfirmButton: true,
                        showCancelButton: true,
                        confirmButtonText: "Sim",
                        conCancelButtonText: "Não"
                    }).then((result) => {
                        if (result.isConfirmed) {
                        }
                        else {
                            $('tbody#tb-itens tr[accesskey="' + accesskey + '"] td input[name="inpu[' + accesskey + '][pim_base_calculo_contribuicao_segurado_corrigida]"]').val('');
                        }
                    });
                }
                if ($('input[name="BcCorrigida"]').val() === 'sim' && campo === 'pim_base_calculo_contribuicao_segurado_corrigida') {
                }
                var pbccpc1 = $('tbody#tb-itens tr[accesskey="' + accesskey + '"] td input[name="inpu[' + accesskey + '][pim_base_calculo_contribuicao_patronal_corrigida]"]').val();
                var pbccpc2 = ((pbccpc1 != undefined && pbccpc1 != null && pbccpc1 != '') ? pbccpc1.toString().replace('.', '').replace('.', '').replace('.', '') : '0');
                var pbccpc3 = pbccpc2.replace(',', '.');
                var pim_base_calculo_contribuicao_patronal_corrigida = pbccpc3;
                if ((pim_base_calculo_contribuicao_patronal_corrigida === '0' || pim_base_calculo_contribuicao_patronal_corrigida === '0.00' || pim_base_calculo_contribuicao_patronal_corrigida === '') && campo === 'pim_base_calculo_contribuicao_patronal_corrigida') {
                    ItemControl.valido_c = false;
                    msg += '</br>Valor da Base de Cálculo Patronal Corrigida não pode ser igual a 0';
                }
                if ((pim_base_calculo_contribuicao_patronal_corrigida === '0' || pim_base_calculo_contribuicao_patronal_corrigida === '') && campo === 'todos') {
                    ItemControl.valido_c = false;
                    msg += '</br>Valor da Base de Cálculo Patronal Corrigida não pode ser igual a 0';
                }
                if (Number(pim_base_calculo_contribuicao_patronal_corrigida) >= 100000 && campo === 'pim_base_calculo_contribuicao_patronal_corrigida') {
                    ItemControl.swalWithBootstrapButtons.fire({
                        title: "Base de Cálculo Patronal Corrigida",
                        html: "Valor da Base de Cálculo Patronal Corrigida maior que R$ 100.000,00.\nConfirmar?",
                        icon: "warning",
                        showConfirmButton: true,
                        showCancelButton: true,
                        confirmButtonText: "Sim",
                        conCancelButtonText: "Não"
                    }).then((result) => {
                        if (result.isConfirmed) {
                        }
                        else {
                            $('tbody#tb-itens tr[accesskey="' + accesskey + '"] td input[name="inpu[' + accesskey + '][pim_base_calculo_contribuicao_patronal_corrigida]"]').val('');
                        }
                    });
                }
                var pim_situacao = $('tbody#tb-itens tr[accesskey="' + accesskey + '"] td select[name="inpu[' + accesskey + '][pim_situacao]"] option:selected').val();
                if (campo === 'pim_situacao') {
                    if (pim_situacao === 'ativo') {
                        ItemControl.swalWithBootstrapButtons.fire({
                            title: "Situação",
                            html: 'Confirma reativação desse Mês/Ano Referência.\nConfirmar?',
                            icon: "warning",
                            showConfirmButton: true,
                            showCancelButton: true,
                            confirmButtonText: "Sim",
                            conCancelButtonText: "Não"
                        }).then((result) => {
                            if (result.isConfirmed) {
                                $('tbody#tb-itens tr[accesskey="' + accesskey + '"] td select[name="inpu[' + accesskey + '][pim_situacao]"] option').val('ativo');
                                $('button[name="btnSalvarItemMovimento"]').click();
                            }
                            else {
                                $('tbody#tb-itens tr[accesskey="' + accesskey + '"] td select[name="inpu[' + accesskey + '][pim_situacao]"] option').val('cancelado');
                                $('button[name="btnSalvarItemMovimento"]').click();
                            }
                        });
                    }
                    else {
                        ItemControl.swalWithBootstrapButtons.fire({
                            title: "Situação",
                            html: 'Confirma cancelamento desse Mês/Ano Referência.\nConfirmar?',
                            icon: "warning",
                            showConfirmButton: true,
                            showCancelButton: true,
                            confirmButtonText: "Sim",
                            conCancelButtonText: "Não"
                        }).then((result) => {
                            if (result.isConfirmed) {
                                $('tbody#tb-itens tr[accesskey="' + accesskey + '"] td select[name="inpu[' + accesskey + '][pim_situacao]"] option').val('cancelado');
                                ItemControl.ItemControlCancelarItemMovimento = true;
                                $('button[name="btnSalvarItemMovimento"]').click();
                            }
                            else {
                                $('tbody#tb-itens tr[accesskey="' + accesskey + '"] td select[name="inpu[' + accesskey + '][pim_situacao]"] option').val('ativo');
                                $('button[name="btnSalvarItemMovimento"]').click();
                            }
                        });
                    }
                }
                var pbccss1 = $('tbody#tb-itens tr[accesskey="' + accesskey + '"] td input[name="inpu[' + accesskey + '][pim_vlr_cota_segurado]"]').val();
                var pbccss2 = ((pbccss1 != undefined && pbccss1 != null && pbccss1 != '') ? pbccss1.toString().replace('.', '').replace('.', '').replace('.', '') : '0');
                var pbccss3 = pbccss2.replace(',', '.');
                var pim_vlr_cota_segurado = pbccss3;
                if ((pim_vlr_cota_segurado === '0' || pim_vlr_cota_segurado === '0.00' || pim_vlr_cota_segurado === '') && campo === 'pim_vlr_cota_segurado') {
                    ItemControl.valido_c = false;
                    msg += '</br>Valor da Cota Segurado não pode ser igual a 0';
                }
                var pbccsp1 = $('tbody#tb-itens tr[accesskey="' + accesskey + '"] td input[name="inpu[' + accesskey + '][pim_vlr_cota_patronal]"]').val();
                var pbccsp2 = ((pbccsp1 != undefined && pbccsp1 != null && pbccsp1 != '') ? pbccsp1.toString().replace('.', '').replace('.', '').replace('.', '') : '0');
                var pbccsp3 = pbccsp2.replace(',', '.');
                var pim_vlr_cota_patronal = pbccsp3;
                if ((pim_vlr_cota_patronal === '0' || pim_vlr_cota_patronal === '0.00' || pim_vlr_cota_patronal === '') && campo === 'pim_vlr_cota_patronal') {
                    ItemControl.valido_c = false;
                    msg += '</br>Valor da Cota Patronal não pode ser igual a 0';
                }
            }
        }
        $.when(calculaBaseCorrigida(accesskey)).then(function (data, textStatus, jqXHR) {
            inputMascara();
            if (campo === 'pim_base_calculo_contribuicao_segurado' || campo === 'pim_base_calculo_contribuicao_patronal' || campo === 'pim_indice_correcao' || campo === 'pim_base_calculo_contribuicao_segurado_corrigida' || campo === 'pim_base_calculo_contribuicao_patronal_corrigida') {
                calcularCota(accesskey, campo);
            }
        });
        if (ItemControl.valido_c) {
            if ($('input[name="DetalhaBcPorEvento"]').val() === 'sim') {
                $('button[name="btnAtualizarResumo"]').removeAttr('disabled');
            }
            else {
                $('button[name="btnSalvarItemMovimento"]').removeAttr('disabled');
                $('button[name="btnAtualizarResumo"]').removeAttr('disabled');
            }
            totValoresItens();
        }
        else {
            $('button[name="btnSalvarItemMovimento"]').attr('disabled', 'disabled');
            $('button[name="btnAtualizarResumo"]').attr('disabled', 'disabled');
            Swal.fire({ icon: 'warning', title: "Dados incorretos", html: msg, footer: ItemControl.footerAlert });
        }
        return ItemControl.valido_c;
    }
    ItemControl.validarCampos = validarCampos;
    function validarSitu(accesskey, campo) {
        totValoresItens();
    }
    ItemControl.validarSitu = validarSitu;
    function carregarIndices() {
        $.ajax({
            url: '/PrecatorioItemMovimento/IndicesCorrecaoMonetaia', data: { DEB_CRE: 'C' }, type: 'get', dataType: 'json', cache: false, async: false,
            statusCode: { 403: function () { console.log('forbidden'); }, 404: function () { console.log('page not found'); }, 415: function () { console.log('Unsupported Media Type'); }, 405: function () { console.log('method not allowed'); }, 500: function () { console.log('internal server error'); }, 502: function () { console.log('Bad Gateway'); } },
            success: function (json, textStatus, jqXHR) {
                if (json.sucesso) {
                    if (json.sucessoListaDeIndiceCorrecaoMonetaria) {
                        ItemControl.listaDeIndiceCorrecaoMonetaria = (Array.isArray(json.listaDeIndiceCorrecaoMonetaria)) ? json.listaDeIndiceCorrecaoMonetaria : [];
                        if (ItemControl.listaDeIndiceCorrecaoMonetaria !== null) {
                            for (let f = 0; f < ItemControl.listaDeIndiceCorrecaoMonetaria.length; f++) {
                                const indice = ItemControl.listaDeIndiceCorrecaoMonetaria[f];
                                ItemControl.listaDeIndiceCorrecaoMonetariaOptions += '<option value="' + indice.inc_codigo + '">' + indice.inc_descricao + '</option>';
                            }
                        }
                    }
                }
                else {
                    console.log('error : ' + json.erro);
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
    ItemControl.carregarIndices = carregarIndices;
    function getFieldTotal(accesskey, fieldName, isEditable) {
        try {
            const selector = isEditable
                ? `table#table-lista-itens tbody tr td[accesskey="${accesskey}"] input[name="inpu[${accesskey}][${fieldName}]"]`
                : `table#table-lista-itens tbody tr td[accesskey="${accesskey}"][campo="${fieldName}"]`;
            const value = isEditable
                ? (($(selector).val() !== undefined && $(selector).val() !== null) ? $(selector).val() : '')
                : $(selector).text();
            return (value && value.toString().trim() !== '')
                ? Number(value.toString().replace(/\./g, '').replace(',', '.'))
                : 0;
        }
        catch (error) {
            console.error(`Erro ao processar campo "${fieldName}" para accesskey "${accesskey}":`, error);
            return 0;
        }
    }
    ItemControl.getFieldTotal = getFieldTotal;
})(ItemControl || (ItemControl = {}));
$(function () {
    $('button#totData').on('click', function () {
        ItemControl.totValoresItens();
    });
});
$(function () {
});
//# sourceMappingURL=ItemControl.js.map