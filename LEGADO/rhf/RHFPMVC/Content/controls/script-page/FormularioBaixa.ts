// File: script-page/FormularioBaixa.ts
/// <reference path="../config-scripts/@types/jquery/index.d.ts" />
/// <reference path="../config-scripts/@types/jquery.form/index.d.ts" />
/// <reference path="../config-scripts/@types/datatables.net/types/types.d.ts" />
/// <reference path="../config-scripts/sweetalert2.d.ts" />
/// <reference path="../config-scripts/config.ts" />

namespace FormularioBaixa {
    export let temBaixa: boolean = false;
    export let camposModificados: boolean = false;
    export let dataTableInstance: any | null = null;
    export let datatable_lista = null;
    export let tempo: number = 0;

    const hoje = new Date();
    const dia = String(hoje.getDate()).padStart(2, '0');
    const mes = String(hoje.getMonth() + 1).padStart(2, '0'); // +1 porque getMonth() é base 0
    const ano = hoje.getFullYear();
    export const dataFormatadaHoje = `${dia}/${mes}/${ano}`;
    export const datadehoje: number = Number(`${ano}${mes}${dia}`);

    export let bai_xa_banco_compara: {
        mov_ano: string,
        mov_numero: number,
        mob_sequencial: number,
        par_numero: number,
        mob_tp_baixa: string,
        mob_base_calculo_contribuicao_segurado_corrigida: number,
        mob_base_calculo_contribuicao_patronal_corrigida: number,
        mob_vlr_cota_segurado: number,
        mob_vlr_cota_patronal: number,
        mob_vlr_cota_patronal_art_122: number,
        mob_vlr_contribuicao_total: number,
        uge_codigo: number,
        mob_vlr_pago: number,
        mob_dt_pgto: string,
        mob_dt_informacao_pgto: string,
        mob_situacao: string,
        pct_movimento: any,
        pct_parametro: any
    }
    export function verificarCamposModificados() {
        FormularioBaixa.camposModificados = false;
        console.log(FormularioBaixa.bai_xa_banco_compara);

        const uge_codigo = Number($('select[name="uge_codigo"] option:selected').val() || '0');

        let m_v_p_1: string = $('input[name="mob_vlr_pago"]').val()?.toString() || '0';
        let m_v_p_2 = ((m_v_p_1 != null && m_v_p_1 != '') ? m_v_p_1.replace('.', '').replace('.', '').replace('.', '').replace('.', '') : '0');
        var m_v_p_3 = m_v_p_2.replace(',', '.');
        var mob_vlr_pago = Number(m_v_p_3);

        const mob_dt_pgto = $('input[name="mob_dt_pgto"]').val() || ''; // Empty string as default
        const mob_dt_informacao_pgto = $('input[name="mob_dt_informacao_pgto"]').val() || '';
        console.log(uge_codigo, mob_vlr_pago, mob_dt_pgto, mob_dt_informacao_pgto);

        if (FormularioBaixa.bai_xa_banco_compara.uge_codigo !== uge_codigo) {
            FormularioBaixa.camposModificados = true;
        }
        if (FormularioBaixa.bai_xa_banco_compara.mob_vlr_pago !== mob_vlr_pago) {
            FormularioBaixa.camposModificados = true;
        }
        if (FormularioBaixa.bai_xa_banco_compara.mob_dt_pgto !== mob_dt_pgto && mob_dt_pgto) {
            FormularioBaixa.camposModificados = true;
        }
        if (FormularioBaixa.bai_xa_banco_compara.mob_dt_informacao_pgto !== mob_dt_informacao_pgto && mob_dt_informacao_pgto) {
            FormularioBaixa.camposModificados = true;
        }
    }

    export function converterDataJson(dataJson) {
        // Extrai o número de milissegundos (remove "/Date(" e ")/")
        const milissegundos = parseInt(dataJson.replace(/\/Date\((\d+)\)\//, '$1'));

        // Cria um objeto Date
        const data = new Date(milissegundos);

        // Formata como "dd/mm/aaaa"
        const dia = String(data.getDate()).padStart(2, '0'); // Adiciona zero à esquerda
        const mes = String(data.getMonth() + 1).padStart(2, '0'); // Meses são 0-11, então soma 1
        const ano = data.getFullYear();

        return `${dia}/${mes}/${ano}`;
    }
    export let mov_ano: string = '0';
    export let mov_numero: string = '0';
    export let retorno: any;

    export let rt: { temSegurado: boolean, temPatronal: boolean, temArt122: boolean } = {
        temSegurado: false,
        temPatronal: false,
        temArt122: false
    };

    export let tabSelec: string = '#nav-segurado-tab';
    export let tabId: string = 'nav-segurado-tab';
    export let tabName: string = 'S';

    export function inputMascara() {
        // console.log(`FormularioBaixa.temBaixa : ${FormularioBaixa.temBaixa}`);
        FormularioBaixa.baixado = false;
        if (FormularioBaixa.temBaixa) {
            
        } else {
            let mob_tp_baixa = $('input[name="mob_tp_baixa"]').val();
            if (mob_tp_baixa === 'S' && rt.temSegurado) {
                $('input.monet').attr('readonly', 'readonly');
                $('input.dia_mes_ano').attr('readonly', 'readonly');
            } else {
                $('input.monet').maskMoney({ prefix: '', allowNegative: true, thousands: '.', decimal: ',', affixesStay: true });
                $('input.dia_mes_ano').mask("99/99/9999");
            }
            if (mob_tp_baixa === 'P' && rt.temPatronal) {
                $('input.monet').attr('readonly', 'readonly');
                $('input.dia_mes_ano').attr('readonly', 'readonly');
            } else {
                $('input.monet').maskMoney({ prefix: '', allowNegative: true, thousands: '.', decimal: ',', affixesStay: true });
                $('input.dia_mes_ano').mask("99/99/9999");
            }
            if (mob_tp_baixa === 'A' && rt.temArt122) {
                $('input.monet').attr('readonly', 'readonly');
                $('input.dia_mes_ano').attr('readonly', 'readonly');
            } else {
                $('input.monet').maskMoney({ prefix: '', allowNegative: true, thousands: '.', decimal: ',', affixesStay: true });
                $('input.dia_mes_ano').mask("99/99/9999");
            }
        } 
    }
    export function selectForm(tabName) {
        console.log('tabName : ' + tabName);
        switch (tabName) {
            case 'S':
                //$('#situacao').empty().html('Pendente de Quitação');
                $('#cod-banco').empty().html('Banco onde foi feito o Repasse pelo TJMS');
                $('#valor-recolhido').empty().html('Valor recolhido pelo TJMS relativo à Cota Segurado');
                $('input[name="mob_tp_baixa"]').val('S');
                break;
            case 'P':
                //$('#situacao').empty().html('Quitado Cota Segurado');
                $('#cod-banco').empty().html('Banco onde foi feito o Repasse pela Unidade Gestora Origem');
                $('#valor-recolhido').empty().html('Valor recolhido pela UG Origem relativo à Cota Patronal');
                $('input[name="mob_tp_baixa"]').val('P');
                break;
            case 'A':
                //$('#situacao').empty().html('Quitado Cota Patronal');
                $('#cod-banco').empty().html('Banco onde foi feito o Repasse pela Unidade Gestora Origem');
                $('#valor-recolhido').empty().html('Valor recolhido pela UG Origem relativo ao Art. 122 da Lei 3.150/2005');
                $('input[name="mob_tp_baixa"]').val('A');
                break;
            default:
                //$('#situacao').empty().html('Pendente de Quitação');
                $('#cod-banco').empty().html('Banco onde foi feito o Repasse pelo TJMS');
                $('#valor-recolhido').empty().html('Valor recolhido pelo TJMS relativo à Cota Segurado');
                $('input[name="mob_tp_baixa"]').val('S');
                console.error(`Invalid buttonName: ${tabName}`);
                return;
        }
        window.location.href = '#sidebarnav';
    }
    export function verifTabBaixa(temSegurado: boolean, temPatronal: boolean, temArt122: boolean) {
        if (temSegurado && temPatronal && temArt122) {
            $('#situacao').empty().html('Quitado Cota Patronal Art.122');
            $('input[id="inlineRadio1"]').attr('checked', 'checked');
        } else if (temSegurado && temPatronal && !temArt122) {
            $('#situacao').empty().html('Quitado Cota Patronal');
        } else if (temSegurado && !temPatronal && !temArt122) {
            $('#situacao').empty().html('Quitado Cota Segurado');
            $('#nav-art122-tab').attr('disabled', 'disabled');
        } else {
            $('#situacao').empty().html('Pendente de Quitação');
            $('#nav-segurado-tab').attr('disabled', 'disabled');
            $('#nav-patronal-tab').attr('disabled', 'disabled');
            $('#nav-art122-tab').attr('disabled', 'disabled');
        }
    }

    export function fetchDataMovimentoBaixa(mob_tp_baixa: string) {
        FormularioBaixa.retorno = { sucesso: false };
        var dadosForm = $('form[name="formBaixa"]').serialize();
        $.ajax({
            url: '/PrecatorioMovimentoBaixa/Baixas', data: { dadosForm: dadosForm, mob_tp_baixa: mob_tp_baixa }, type: 'post', dataType: 'json', cache: false, async: false,
            statusCode: ScriptsConfig.statusCodeHandlers,
            success: function (json, textStatus, jqXHR) {
                console.log(json);
                FormularioBaixa.retorno = json;
                if (json.sucesso) {
                    if (mob_tp_baixa === 'T') {
                        if (FormularioBaixa.retorno.sucesso) {
                            let ret = FormularioBaixa.retorno;
                            let parame: { par_numero?: number } | null = null;
                            let baixa: {} | null = null;
                            FormularioBaixa.bai_xa_banco_compara = {
                                mov_ano: '',
                                mov_numero: 0,
                                mob_sequencial: 0,
                                par_numero: 0,
                                mob_tp_baixa: '',
                                mob_base_calculo_contribuicao_segurado_corrigida: 0,
                                mob_base_calculo_contribuicao_patronal_corrigida: 0,
                                mob_vlr_cota_segurado: 0,
                                mob_vlr_cota_patronal: 0,
                                mob_vlr_cota_patronal_art_122: 0,
                                mob_vlr_contribuicao_total: 0,
                                uge_codigo: 0,
                                mob_vlr_pago: 0,
                                mob_dt_pgto: '',
                                mob_dt_informacao_pgto: '',
                                mob_situacao: '',
                                pct_movimento: null,
                                pct_parametro: null
                            };
                            let baixaSegurado: {} | null = null;
                            let parameAtiv = ret.parametroAtivo;
                            FormularioBaixa.verifTabBaixa(ret.temSegurado, ret.temPatronal, ret.temArt122);
                            //console.log('mob_tp_baixa: ' + mob_tp_baixa);

                            $('input[name="dtBaixa[S][mob_dt_pgto]"]').val((ret.temSegurado && ret.baixaSegurado.mob_dt_pgto !== null) ? ScriptsConfig.parseDotNetDateAnoMesDia(ret.baixaSegurado.mob_dt_pgto) || '' : '0');
                            $('input[name="dtBaixa[S][mob_dt_informacao_pgto]"]').val((ret.temSegurado && ret.baixaSegurado.mob_dt_informacao_pgto !== null) ? ScriptsConfig.parseDotNetDateAnoMesDia(ret.baixaSegurado.mob_dt_informacao_pgto) || '' : '0');

                            $('input[name="dtBaixa[P][mob_dt_pgto]"]').val((ret.temPatronal && ret.baixaPatronal.mob_dt_pgto !== null) ? ScriptsConfig.parseDotNetDateAnoMesDia(ret.baixaPatronal.mob_dt_pgto) || '' : '0');
                            $('input[name="dtBaixa[P][mob_dt_informacao_pgto]"]').val((ret.temPatronal && ret.baixaPatronal.mob_dt_informacao_pgto !== null) ? ScriptsConfig.parseDotNetDateAnoMesDia(ret.baixaPatronal.mob_dt_informacao_pgto) || '' : '0');

                            $('input[name="dtBaixa[A][mob_dt_pgto]"]').val((ret.temArt122 && ret.baixaArt122.mob_dt_pgto !== null) ? ScriptsConfig.parseDotNetDateAnoMesDia(ret.baixaArt122.mob_dt_pgto) || '' : '0');
                            $('input[name="dtBaixa[A][mob_dt_informacao_pgto]"]').val((ret.temArt122 && ret.baixaArt122.mob_dt_informacao_pgto !== null) ? ScriptsConfig.parseDotNetDateAnoMesDia(ret.baixaArt122.mob_dt_informacao_pgto) || '' : '0');

                            if (ret.temSegurado && ret.temPatronal && ret.temArt122) {
                                baixa = ret.baixaArt122;
                                FormularioBaixa.bai_xa_banco_compara = ret.baixaArt122;
                                baixaSegurado = ret.baixaSegurado;
                                FormularioBaixa.popularBaixas(ret.temSegurado, baixaSegurado, baixa, ret.temArt122, 'T');

                                if (ret.temArt122) {
                                    parame = ret.parametroArt122;
                                    FormularioBaixa.popularParametros((parame !== null && parame.par_numero && parame.par_numero > 0) ? parame : parameAtiv);
                                } else {
                                    FormularioBaixa.popularParametros(parameAtiv);
                                }
                                FormularioBaixa.tabSelec = '#nav-art122-tab';
                                FormularioBaixa.tabId = 'nav-art122-tab';
                                FormularioBaixa.tabName = 'A';
                            } else if (ret.temSegurado && ret.temPatronal && !ret.temArt122) {
                                baixa = ret.baixaArt122;
                                FormularioBaixa.bai_xa_banco_compara = ret.baixaArt122;
                                baixaSegurado = ret.baixaSegurado;
                                FormularioBaixa.popularBaixas(ret.temSegurado, baixaSegurado, baixa, ret.temArt122, 'T');
                         
                                if (ret.temArt122) {
                                    parame = ret.parametroArt122;
                                    FormularioBaixa.popularParametros((parame !== null && parame.par_numero && parame.par_numero > 0) ? parame : parameAtiv);
                                } else {
                                    FormularioBaixa.popularParametros(parameAtiv);
                                }
                                FormularioBaixa.tabSelec = '#nav-art122-tab';
                                FormularioBaixa.tabId = 'nav-art122-tab';
                                FormularioBaixa.tabName = 'A';
                            } else if (ret.temSegurado && !ret.temPatronal && !ret.temArt122) {
                                baixa = ret.baixaPatronal;
                                FormularioBaixa.bai_xa_banco_compara = ret.baixaPatronal;
                                baixaSegurado = ret.baixaSegurado;
                                FormularioBaixa.popularBaixas(ret.temSegurado, baixaSegurado, baixa, ret.temPatronal, 'T');
              
                                if (ret.temPatronal) {
                                    parame = ret.parametroPatronal;
                                    FormularioBaixa.popularParametros((parame !== null && parame.par_numero && parame.par_numero > 0) ? parame : parameAtiv);
                                } else {
                                    FormularioBaixa.popularParametros(parameAtiv);
                                }
                                FormularioBaixa.tabSelec = '#nav-patronal-tab';
                                FormularioBaixa.tabId = 'nav-patronal-tab';
                                FormularioBaixa.tabName = 'P';
                            } else {
                                baixa = ret.baixaSegurado;
                                FormularioBaixa.bai_xa_banco_compara = ret.baixaSegurado;
                                baixaSegurado = ret.baixaSegurado;
                                FormularioBaixa.popularBaixas(ret.temSegurado, baixaSegurado, baixa, ret.temSegurado, 'T');
  
                                console.log(ret);
                                if (ret.temSegurado) {
                                    parame = ret.parametroSegurado;
                                    console.log(parame);
                                    console.log(parameAtiv);
                                    FormularioBaixa.popularParametros((parame !== null && parame.par_numero && parame.par_numero > 0) ? parame : parameAtiv);
                                } else {
                                    FormularioBaixa.popularParametros(parameAtiv);
                                }
                                FormularioBaixa.tabSelec = '#nav-segurado-tab';
                                FormularioBaixa.tabId = 'nav-segurado-tab';
                                FormularioBaixa.tabName = 'S';
                            }
                        }
                    } else {
                    }
                } else {
                    Swal.fire({ icon: "warning", title: "Oops...", html: json.msg, footer: ScriptsConfig.footerAlert });
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) { }, beforeSend: function (jqXHR) { },
            complete: function (XMLHttpRequest, textStatus) { }
        }).done(function () { }).fail(function (_XMLHttpRequest_, textStatus, errorThrown) {
            console.log(_XMLHttpRequest_); console.log(textStatus); console.log(errorThrown);
            ScriptsConfig.failFunctionAjax(_XMLHttpRequest_, textStatus, errorThrown);
        }).always(function () { });
    }


    export let baixado: boolean = false;
    export let valido: boolean = false;
    export let msg: string = '';
    export function finalizarMovimentoBaixa() {
        FormularioBaixa.retorno = { sucesso: false };
        var dadosForm = $('form[name="formBaixa"]').serialize();
        $.ajax({
            url: '/PrecatorioMovimentoBaixa/FinalizarMovimento', data: { dadosForm: dadosForm }, type: 'post', dataType: 'json', cache: false, async: false,
            statusCode: ScriptsConfig.statusCodeHandlers,
            success: function (json, textStatus, jqXHR) {
                console.log(json);
                FormularioBaixa.retorno = json;
                if (json.sucesso) {
                    if (FormularioBaixa.retorno.sucesso) {
                        ScriptsConfig.swalWithBootstrapButtons.fire({
                            title: 'Precatório',
                            html: json.msg,
                            icon: "success",
                            showCancelButton: false,
                            confirmButtonText: "Ok",
                            cancelButtonText: "No, cancel!",
                            reverseButtons: true,
                            footer: ScriptsConfig.footerAlert,
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            backdrop: true
                        }).then((result) => {
                            if (result.isConfirmed) {
                                window.location.href = '/PrecatorioMovimentoBaixa/Index';
                            } else {
                                window.location.href = '/PrecatorioMovimentoBaixa/Index';
                            }
                        });
                    } else {

                    }
                } else {
                    Swal.fire({ icon: "warning", title: "Oops...", html: json.msg, footer: ScriptsConfig.footerAlert });
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) { }, beforeSend: function (jqXHR) { },
            complete: function (XMLHttpRequest, textStatus) { }
        }).done(function () { }).fail(function (_XMLHttpRequest_, textStatus, errorThrown) {
            console.log(_XMLHttpRequest_); console.log(textStatus); console.log(errorThrown);
            ScriptsConfig.failFunctionAjax(_XMLHttpRequest_, textStatus, errorThrown);
        }).always(function () { });
    }
    export function verificaSit_codigo() {
        let sit_codigo: number = Number($('input[name="sit_codigo"]').val()?.toString() || '1');
        // console.log(`sit_codigo : ${sit_codigo}`);
        if (sit_codigo === 5) {

            ScriptsConfig.swalconfirmeActionFinalizar.fire({
                title: "Atenção",
                html: 'Precatório já totalmente quitado, <br /> necessário Finalizá-lo',
                icon: "warning",
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: '<i class="fa-solid fa-check"></i> Ok',
                denyButtonText: 'Agora Não <i class="fa-solid fa-arrow-right-from-bracket"></i>',
                footer: ScriptsConfig.footerAlert,
                allowOutsideClick: false,
                allowEscapeKey: false,
                backdrop: true
            }).then((result) => {
                if (result.isConfirmed) {
                    FormularioBaixa.finalizarMovimentoBaixa();
                } else if (result.isDenied) {
                    // window.location.reload();
                } else {
                    // window.location.reload();
                }
            });
        }
    }
    export function validarTodos() {
        FormularioBaixa.baixado = false;
        FormularioBaixa.valido = true;
        FormularioBaixa.msg = '';

        let mob_sequencial: number = Number($('input[name="mob_sequencial"]').val()?.toString() || '0');
        if (mob_sequencial > 0) {
            FormularioBaixa.baixado = true;
            FormularioBaixa.valido = false;
            FormularioBaixa.msg += "</br>Não é posível alterar os dados de Baixa!";
        }

        let inlineRadioOptions: string = $('input[name="inlineRadioOptions"]:checked').val()?.toString() || '';
        if (inlineRadioOptions !== undefined) {
            if (inlineRadioOptions === null || inlineRadioOptions === '' || inlineRadioOptions === '0') {
                FormularioBaixa.valido = false;
                FormularioBaixa.msg += "</br>Selecione a confirmação do Repasse se foi realizado na respectiva Conta Bancária!";
            } else {
                if (inlineRadioOptions === 'S') {

                } else if (inlineRadioOptions === 'N') {
                    FormularioBaixa.valido = false;
                    FormularioBaixa.msg += "</br>É necessário confirmar o Repasse se foi realizado na respectiva Conta Bancária!";

                } else {
                    FormularioBaixa.valido = false;
                    FormularioBaixa.msg += "</br>Selecione a confirmação do Repasse se foi realizado na respectiva Conta Bancária!";
                }
            }
        } else {
            FormularioBaixa.valido = false;
            FormularioBaixa.msg += "</br>Selecione a confirmação do Repasse se foi realizado na respectiva Conta Bancária!";
        }

        let mov_ano: string = $('input[name="mov_ano"]').val()?.toString() || '';
        if (mov_ano.length < 4) {
            FormularioBaixa.valido = false;
            FormularioBaixa.msg += "</br>Referência de movimento não encontrado!";
        }
        let mov_numero: string = $('input[name="mov_numero"]').val()?.toString() || '';
        if (mov_numero === null || mov_numero === '' || mov_numero === '0') {
            FormularioBaixa.valido = false;
            FormularioBaixa.msg += "</br>Referência de movimento não encontrado!";
        }
        let par_numero: string = $('input[name="par_numero"]').val()?.toString() || '';
        if (par_numero === null || par_numero === '' || par_numero === '0') {
            FormularioBaixa.valido = false;
            FormularioBaixa.msg += "</br>Parâmetro não encontrado!";
        }

        const tp_baixa = ['S', 'P', 'A'];
        let mob_tp_baixa: string = $('input[name="mob_tp_baixa"]').val()?.toString() || '';
        if (tp_baixa.indexOf(mob_tp_baixa) !== -1) {
        } else {
            FormularioBaixa.valido = false;
            FormularioBaixa.msg += "</br>O tipo de Baixa não foi informado!";
        }

        let m_b_c_c_s_c_1: string = $('input[name="mob_base_calculo_contribuicao_segurado_corrigida"]').val()?.toString() || '0';
        let m_b_c_c_s_c_2 = ((m_b_c_c_s_c_1 != null && m_b_c_c_s_c_1 != '') ? m_b_c_c_s_c_1.replace('.', '').replace('.', '').replace('.', '').replace('.', '') : '0');
        var m_b_c_c_s_c_3 = m_b_c_c_s_c_2.replace(',', '.');
        var mob_base_calculo_contribuicao_segurado_corrigida = m_b_c_c_s_c_3;
        if (m_b_c_c_s_c_3 === null || m_b_c_c_s_c_3 === '0' || m_b_c_c_s_c_3 === '0.0' || m_b_c_c_s_c_3 === '0.00' || m_b_c_c_s_c_3 === '') {
            FormularioBaixa.valido = false;
            FormularioBaixa.msg += '</br>O Valor da Base de Cálculo Segurado Corrigida não pode ser igual a 0 ou vazio';
        }
        let m_b_c_c_p_c_1: string = $('input[name="mob_base_calculo_contribuicao_patronal_corrigida"]').val()?.toString() || '0';
        let m_b_c_c_p_c_2 = ((m_b_c_c_p_c_1 != null && m_b_c_c_p_c_1 != '') ? m_b_c_c_p_c_1.replace('.', '').replace('.', '').replace('.', '').replace('.', '') : '0');
        var m_b_c_c_p_c_3 = m_b_c_c_p_c_2.replace(',', '.');
        var mob_base_calculo_contribuicao_patronal_corrigida = m_b_c_c_p_c_3;
        if (m_b_c_c_p_c_3 === null || m_b_c_c_p_c_3 === '0' || m_b_c_c_p_c_3 === '0.0' || m_b_c_c_p_c_3 === '0.00' || m_b_c_c_p_c_3 === '') {
            FormularioBaixa.valido = false;
            FormularioBaixa.msg += '</br>O Valor da Base de Cálculo Segurado Corrigida não pode ser igual a 0 ou vazio';
        }
        let m_v_c_s_1: string = $('input[name="mob_vlr_cota_segurado"]').val()?.toString() || '0';
        let m_v_c_s_2 = ((m_v_c_s_1 != null && m_v_c_s_1 != '') ? m_v_c_s_1.replace('.', '').replace('.', '').replace('.', '').replace('.', '') : '0');
        var m_v_c_s_3 = m_v_c_s_2.replace(',', '.');
        var mob_vlr_cota_segurado = m_v_c_s_3;
        if (m_v_c_s_3 === null || m_v_c_s_3 === '0' || m_v_c_s_3 === '0.0' || m_v_c_s_3 === '0.00' || m_v_c_s_3 === '') {
            FormularioBaixa.valido = false;
            FormularioBaixa.msg += "</br>A Cota do Segurado não foi informado!";
        }
        let m_v_c_p_1: string = $('input[name="mob_vlr_cota_patronal"]').val()?.toString() || '0';
        let m_v_c_p_2 = ((m_v_c_p_1 != null && m_v_c_p_1 != '') ? m_v_c_p_1.replace('.', '').replace('.', '').replace('.', '').replace('.', '') : '0');
        var m_v_c_p_3 = m_v_c_p_2.replace(',', '.');
        var mob_vlr_cota_patronal = m_v_c_p_3;
        if (m_v_c_p_3 === null || m_v_c_p_3 === '0' || m_v_c_p_3 === '0.0' || m_v_c_p_3 === '0.00' || m_v_c_p_3 === '') {
            FormularioBaixa.valido = false;
            FormularioBaixa.msg += "</br>A Cota do Patronal não foi informado!";
        }
        let m_v_c_p_a_1: string = $('input[name="mob_vlr_cota_patronal_art_122"]').val()?.toString() || '0';
        let m_v_c_p_a_2 = ((m_v_c_p_a_1 != null && m_v_c_p_a_1 != '') ? m_v_c_p_a_1.replace('.', '').replace('.', '').replace('.', '').replace('.', '') : '0');
        var m_v_c_p_a_3 = m_v_c_p_a_2.replace(',', '.');
        var mob_vlr_cota_patronal_art_122 = m_v_c_p_a_3;
        if (m_v_c_p_a_3 === null || m_v_c_p_a_3 === '0' || m_v_c_p_a_3 === '0.0' || m_v_c_p_a_3 === '0.00' || m_v_c_p_a_3 === '') {
            FormularioBaixa.valido = false;
            FormularioBaixa.msg += "</br>A Cota do Patronal do Art.122 não foi informado!";
        }
        let m_v_c_t_1: string = $('input[name="mob_vlr_contribuicao_total"]').val()?.toString() || '0';
        let m_v_c_t_2 = ((m_v_c_t_1 != null && m_v_c_t_1 != '') ? m_v_c_t_1.replace('.', '').replace('.', '').replace('.', '').replace('.', '') : '0');
        var m_v_c_t_3 = m_v_c_t_2.replace(',', '.');
        var mob_vlr_contribuicao_total = m_v_c_t_3;
        if (mob_sequencial > 0 && (m_v_c_t_3 === null || m_v_c_t_3 === '0' || m_v_c_t_3 === '0.0' || m_v_c_t_3 === '0.00' || m_v_c_t_3 === '')) {
            FormularioBaixa.valido = false;
            FormularioBaixa.msg += "</br>O valor total de contribuição do Segurado não foi informado!";
        }
        let uge_codigo: string = $('select[name="uge_codigo"] option:selected').val()?.toString() || '';
        if (uge_codigo === null || uge_codigo === '' || uge_codigo === '0') {
            FormularioBaixa.valido = false;
            FormularioBaixa.msg += "</br>A Unidade Gestora não foi informada!";
        }
        let m_v_p_1: string = $('input[name="mob_vlr_pago"]').val()?.toString() || '0';
        let m_v_p_2 = ((m_v_p_1 != null && m_v_p_1 != '') ? m_v_p_1.replace('.', '').replace('.', '').replace('.', '').replace('.', '') : '0');
        var m_v_p_3 = m_v_p_2.replace(',', '.');
        var mob_vlr_pago = m_v_p_3;
        if (m_v_p_3 === null || m_v_p_3 === '0' || m_v_p_3 === '0.0' || m_v_p_3 === '0.00' || m_v_p_3 === '') {
            FormularioBaixa.valido = false;
            FormularioBaixa.msg += "</br>O valor pago não foi informado!";
        }
        let mob_dt_pgto: string = $('input[name="mob_dt_pgto"]').val()?.toString() || '0';
        if (mob_dt_pgto === null || mob_dt_pgto === '0' || mob_dt_pgto === '') {
            FormularioBaixa.valido = false;
            FormularioBaixa.msg += "</br>A data de pagamento não foi informada!";
        }
        let mob_dt_informacao_pgto: string = $('input[name="mob_dt_informacao_pgto"]').val()?.toString() || '0';
        if (mob_dt_informacao_pgto === null || mob_dt_informacao_pgto === '0' || mob_dt_informacao_pgto === '') {
            FormularioBaixa.valido = false;
            FormularioBaixa.msg += "</br>A data de informação do pagamento não foi informada!";
        }
        let mob_situacao: string = $('input[name="mob_situacao"]').val()?.toString() || '0';
        if (mob_situacao === null || mob_situacao === '0' || mob_situacao === '') {
            FormularioBaixa.valido = false;
            FormularioBaixa.msg += "</br>A Situação não foi informada!";
        }
        console.log('valido : ' + FormularioBaixa.valido);
        console.log('msg : ' + FormularioBaixa.msg);
        if (FormularioBaixa.valido) {
            $('button[name="btnSalvarBaixa"]').removeAttr('disabled');
        } else {
            $('button[name="btnSalvarBaixa"]').attr('disabled', 'disabled');
        }
    }

    export let mob_vlr_pago_1: number = 0;
    export let mob_vlr_pago_2: number = 0;
    export let tentativaFalha: number = 0;

    export let zerado: boolean = false;

    export function validarUnidadeGestora(){
        FormularioBaixa.validarTodos();
    }
    export function validarValorPago() {
        let valorCorreto: boolean = true;
        let valorMsg: string = '';
        let m_v_c_s_1: string = $('input[name="mob_vlr_cota_segurado"]').val()?.toString() || '0';
        let m_v_c_s_2 = ((m_v_c_s_1 != null && m_v_c_s_1 != '') ? m_v_c_s_1.replace('.', '').replace('.', '').replace('.', '').replace('.', '') : '0');
        var m_v_c_s_3 = m_v_c_s_2.replace(',', '.');
        var mob_vlr_cota_segurado = m_v_c_s_3;
        if (m_v_c_s_3 === null || m_v_c_s_3 === '0' || m_v_c_s_3 === '0.0' || m_v_c_s_3 === '0.00' || m_v_c_s_3 === '') {
            FormularioBaixa.valido = false;
            FormularioBaixa.msg += "</br>A Cota do Segurado não foi informado!";
        }
        let mob_vlr_cota_segurado_1_2: number = Number(mob_vlr_cota_segurado) * 1.2;
        let m_v_c_p_1: string = $('input[name="mob_vlr_cota_patronal"]').val()?.toString() || '0';
        let m_v_c_p_2 = ((m_v_c_p_1 != null && m_v_c_p_1 != '') ? m_v_c_p_1.replace('.', '').replace('.', '').replace('.', '').replace('.', '') : '0');
        var m_v_c_p_3 = m_v_c_p_2.replace(',', '.');
        var mob_vlr_cota_patronal = m_v_c_p_3;
        if (m_v_c_p_3 === null || m_v_c_p_3 === '0' || m_v_c_p_3 === '0.0' || m_v_c_p_3 === '0.00' || m_v_c_p_3 === '') {
            FormularioBaixa.valido = false;
            FormularioBaixa.msg += "</br>A Cota do Patronal não foi informado!";
        }
        let mob_vlr_cota_patronal_1_2: number = Number(mob_vlr_cota_patronal) * 1.2;
        let m_v_c_p_a_1: string = $('input[name="mob_vlr_cota_patronal_art_122"]').val()?.toString() || '0';
        let m_v_c_p_a_2 = ((m_v_c_p_a_1 != null && m_v_c_p_a_1 != '') ? m_v_c_p_a_1.replace('.', '').replace('.', '').replace('.', '').replace('.', '') : '0');
        var m_v_c_p_a_3 = m_v_c_p_a_2.replace(',', '.');
        var mob_vlr_cota_patronal_art_122 = m_v_c_p_a_3;
        if (m_v_c_p_a_3 === null || m_v_c_p_a_3 === '0' || m_v_c_p_a_3 === '0.0' || m_v_c_p_a_3 === '0.00' || m_v_c_p_a_3 === '') {
            FormularioBaixa.valido = false;
            FormularioBaixa.msg += "</br>A Cota do Patronal do Art.122 não foi informado!";
        }
        let mob_vlr_cota_patronal_art_122_1_2: number = Number(mob_vlr_cota_patronal_art_122) * 1.2;
        let mob_tp_baixa: string = $('input[name="mob_tp_baixa"]').val()?.toString() || '';
        let m_v_p_1: string = $('input[name="mob_vlr_pago"]').val()?.toString() || '0';
        let m_v_p_2 = ((m_v_p_1 != null && m_v_p_1 != '') ? m_v_p_1.replace('.', '').replace('.', '').replace('.', '').replace('.', '') : '0');
        var m_v_p_3 = m_v_p_2.replace(',', '.');
        var mob_vlr_pago = m_v_p_3;
        if (m_v_p_3 === null || m_v_p_3 === '0' || m_v_p_3 === '0.0' || m_v_p_3 === '0.00' || m_v_p_3 === '') {
            if (FormularioBaixa.zerado) {

            } else {
                if (bai_xa_banco_compara.mob_vlr_pago == 0) {

                } else {
                    FormularioBaixa.valido = false;
                    valorCorreto = false;
                    valorMsg += "</br>O valor pago não foi informado!";
                    FormularioBaixa.msg += valorMsg;
                    FormularioBaixa.zerado = false;
                }
            }
        } else {
            if (mob_tp_baixa === 'S' && Number(mob_vlr_pago) < Number(mob_vlr_cota_segurado)) {
                FormularioBaixa.valido = false;
                valorCorreto = false;
                valorMsg += "</br>Valor informado não pode ser menor do que a Cota do Segurado do Precatório!";
                FormularioBaixa.msg += valorMsg;
            }
            if (mob_tp_baixa === 'P' && Number(mob_vlr_pago) < Number(mob_vlr_cota_patronal)) {
                FormularioBaixa.valido = false;
                valorCorreto = false;
                valorMsg += "</br>Valor informado não pode ser menor do que a Cota Patronal do Precatório!";
                FormularioBaixa.msg += valorMsg;
            }
            if (mob_tp_baixa === 'A' && Number(mob_vlr_pago) < Number(mob_vlr_cota_patronal_art_122)) {
                FormularioBaixa.valido = false;
                valorCorreto = false;
                valorMsg += "</br>Valor informado não pode ser menor do que o Art. 122 do Precatório!";
                FormularioBaixa.msg += valorMsg;
            }

            if (
                    (mob_tp_baixa === 'S'   && Number(mob_vlr_pago) <= mob_vlr_cota_segurado_1_2            )
                ||  (mob_tp_baixa === 'P'   && Number(mob_vlr_pago) <= mob_vlr_cota_patronal_1_2            )
                ||  (mob_tp_baixa === 'A'   && Number(mob_vlr_pago) <= mob_vlr_cota_patronal_art_122_1_2    )
            ) {

            } else {
                if (mob_vlr_pago_1 > 0 || tentativaFalha > 0) {
                    if (tentativaFalha > 0) {
                        if (mob_vlr_pago_1 > 0) {
                            if (mob_vlr_pago_1 !== Number(mob_vlr_pago)) {
                                FormularioBaixa.valido = false;
                                valorCorreto = false;
                                valorMsg += "</br>Valores digitados não conferem, favor digitar novamente!";

                                tentativaFalha = 1;
                                mob_vlr_pago_1 = 0;
                            } else {
                                valorCorreto = true;
                            }
                        } else {
                            FormularioBaixa.valido = false;
                            valorCorreto = false;
                            valorMsg += "</br>Digite novamente!";

                            mob_vlr_pago_1 = Number(mob_vlr_pago);
                        }
                    } else {
                        if (mob_vlr_pago_1 !== Number(mob_vlr_pago)) {
                            FormularioBaixa.valido = false;
                            valorCorreto = false;
                            valorMsg += "</br>Valores digitados não conferem, favor digitar novamente!";

                            tentativaFalha = 1;
                            mob_vlr_pago_1 = 0;
                        } else {
                            valorCorreto = true;
                        }
                    }
                } else {
                    if (mob_tp_baixa === 'S' && Number(mob_vlr_pago) > mob_vlr_cota_segurado_1_2) {
                        FormularioBaixa.valido = false;
                        valorCorreto = false;
                        valorMsg += "</br>Valor informado muito acima da Cota do Segurado do Precatório - Redigite Valor!";
                        FormularioBaixa.msg += valorMsg;
                        mob_vlr_pago_1 = Number(mob_vlr_pago);
                    }
                    if (mob_tp_baixa === 'P' && Number(mob_vlr_pago) > mob_vlr_cota_patronal_1_2) {
                        FormularioBaixa.valido = false;
                        valorCorreto = false;
                        valorMsg += "</br>Valor informado muito acima da Cota Patronal do Precatório - Redigite Valor!";
                        FormularioBaixa.msg += valorMsg;
                        mob_vlr_pago_1 = Number(mob_vlr_pago);
                    }
                    if (mob_tp_baixa === 'A' && Number(mob_vlr_pago) > mob_vlr_cota_patronal_art_122_1_2) {
                        FormularioBaixa.valido = false;
                        valorCorreto = false;
                        valorMsg += "</br>Valor informado muito acima do Art. 122 do Precatório - Redigite Valor!";
                        FormularioBaixa.msg += valorMsg;
                        mob_vlr_pago_1 = Number(mob_vlr_pago);
                    }
                }
            }
        }

        if (valorCorreto) {

        } else {
            $('input[name="mob_vlr_pago"]').val('0,00');
            FormularioBaixa.zerado = true;
            Swal.fire({ icon: 'warning', title: "Atenção", html: valorMsg, footer: ScriptsConfig.footerAlert });
            if ((tentativaFalha > 0 && mob_vlr_pago_1 > 0)) {
                ScriptsConfig.swalconfirmeAction.fire({
                    title: 'Confirmação',
                    html: valorMsg,
                    icon: "info",
                    showCancelButton: false,
                    showDenyButton: false,
                    confirmButtonText: "Ok",
                    cancelButtonText: "No, cancel!",
                    reverseButtons: false, footer: ScriptsConfig.footerAlert,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    backdrop: true
                }).then((result) => {
                    if (result.isConfirmed) {
                    } else {
                    }
                });
            } else {
                ScriptsConfig.swalconfirmeActionAlerta.fire({
                    title: 'Atenção',
                    html: valorMsg,
                    icon: "warning",
                    showCancelButton: false,
                    showDenyButton: false,
                    confirmButtonText: "Ok",
                    cancelButtonText: "No, cancel!",
                    reverseButtons: false, footer: ScriptsConfig.footerAlert,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    backdrop: true
                }).then((result) => {
                    if (result.isConfirmed) {
                    } else {
                    }
                });
            }
        }
        $('button[name="btnSalvarBaixa"]').removeAttr('disabled');
    }
    export function validarDtPagto() {
        let dtCorreto: boolean = true;
        let dtMsg: string = '';
        let mob_tp_baixa: string = $('input[name="mob_tp_baixa"]').val()?.toString() || '';
        let S_mob_dt_pgto: number = Number($('input[name="dtBaixa[S][mob_dt_pgto]"]').val() || 0);
        let P_mob_dt_pgto: number = Number($('input[name="dtBaixa[P][mob_dt_pgto]"]').val() || 0);
        let A_mob_dt_pgto: number = Number($('input[name="dtBaixa[A][mob_dt_pgto]"]').val() || 0);

        let anomes_referencia_inicial_int: number = Number(($('input[name="anomes_referencia_inicial"]').val()?.toString() || '01') + '01');
        let mdp: string = $('input[name="mob_dt_pgto"]').val()?.toString() || '0';
        let mob_dt_pgto_int: number = Number(mdp?.toString().substring(6, 10) + '' + mdp?.toString().substring(3, 5) + '' + mdp?.toString().substring(0, 2));
        let mdip: string  = $('input[name="mob_dt_informacao_pgto"]').val()?.toString() || '0';
        let mob_dt_informacao_pgto_int: number = Number(mdip?.toString().substring(6, 10) + '' + mdip?.toString().substring(3, 5) + '' + mdip?.toString().substring(0, 2));

        if(mob_tp_baixa === 'P' && S_mob_dt_pgto > mob_dt_pgto_int) {
            FormularioBaixa.valido = false;
            dtCorreto = false;
            dtMsg += "</br>A data de pagamento da Cota Patronal não pode ser menor do que a data de pagamento da Cota do Segurado!";
            FormularioBaixa.msg += dtMsg;
        }
        if(mob_tp_baixa === 'A' && S_mob_dt_pgto > mob_dt_pgto_int) {
            FormularioBaixa.valido = false;
            dtCorreto = false;
            dtMsg += "</br>A data de pagamento do Artigo 122 não pode ser menor do que a data de pagamento da Cota do Segurado!";
            FormularioBaixa.msg += dtMsg;
        }
        if(mob_tp_baixa === 'A' && mob_dt_pgto_int < P_mob_dt_pgto ) {
            FormularioBaixa.valido = false;
            dtCorreto = false;
            dtMsg += "</br>A data de pagamento do Artigo 122 não pode ser menor do que a data de pagamento da Cota Patronal!";
            FormularioBaixa.msg += dtMsg;
        }
        if (anomes_referencia_inicial_int > mob_dt_pgto_int) {
            FormularioBaixa.valido = false;
            dtCorreto = false;
            dtMsg += "</br>Data do Pagamento menor do que a do cadastro do Precatório!";
            FormularioBaixa.msg += dtMsg;
        }
        if (mob_dt_pgto_int > FormularioBaixa.datadehoje) {
            FormularioBaixa.valido = false;
            dtCorreto = false;
            dtMsg += "</br>Data do Pagamento não pode ser depois da data atual!";
            FormularioBaixa.msg += dtMsg;
        }
        if (mob_dt_pgto_int > mob_dt_informacao_pgto_int && mob_dt_informacao_pgto_int > 0) {
            FormularioBaixa.valido = false;
            dtCorreto = false;
            dtMsg += "</br>A data de Informação do pagamento não pode ser menor do que a data de pagamento!";
            FormularioBaixa.msg += dtMsg;
        }

        if (dtCorreto) {

        } else {
            $('input[name="mob_dt_pgto"]').val('');
            ScriptsConfig.swalconfirmeActionAlerta.fire({
                title: 'Atenção',
                html: dtMsg,
                icon: "warning",
                showCancelButton: false,
                showDenyButton: false,
                confirmButtonText: "Ok",
                cancelButtonText: "No, cancel!",
                reverseButtons: false, footer: ScriptsConfig.footerAlert,
                allowOutsideClick: false,
                allowEscapeKey: false,
                backdrop: true
            }).then((result) => {
                if (result.isConfirmed) {
                } else {
                }
            });
        }
        $('button[name="btnSalvarBaixa"]').removeAttr('disabled');
    }
    export function validarDtInfPagto() {
        let dtCorreto: boolean = true;
        let dtMsg: string = '';

        let mob_tp_baixa: string = $('input[name="mob_tp_baixa"]').val()?.toString() || '';
        let S_mob_dt_informacao_pgto: number = Number($('input[name="dtBaixa[S][mob_dt_informacao_pgto]"]').val() || 0);
        let P_mob_dt_informacao_pgto: number = Number($('input[name="dtBaixa[P][mob_dt_informacao_pgto]"]').val() || 0);
        let A_mob_dt_informacao_pgto: number = Number($('input[name="dtBaixa[A][mob_dt_informacao_pgto]"]').val() || 0);

        let anomes_referencia_inicial_int: number = Number(($('input[name="anomes_referencia_inicial"]').val()?.toString() || '01') + '01');
        let mdp: string = $('input[name="mob_dt_pgto"]').val()?.toString() || '0';
        let mob_dt_pgto_int: number = Number(mdp?.toString().substring(6, 10) + '' + mdp?.toString().substring(3, 5) + '' + mdp?.toString().substring(0, 2));
        let mdip: string  = $('input[name="mob_dt_informacao_pgto"]').val()?.toString() || '0';
        let mob_dt_informacao_pgto_int: number = Number(mdip?.toString().substring(6, 10) + '' + mdip?.toString().substring(3, 5) + '' + mdip?.toString().substring(0, 2));

        if(mob_tp_baixa === 'P' && S_mob_dt_informacao_pgto > mob_dt_informacao_pgto_int) {
            FormularioBaixa.valido = false;
            dtCorreto = false;
            dtMsg += "</br>A data de Informação do pagamento da Cota Patronal não pode ser menor do que a data de Informação do pagamento da Cota do Segurado!";
            FormularioBaixa.msg += dtMsg;
        }
        if(mob_tp_baixa === 'A' && S_mob_dt_informacao_pgto > mob_dt_informacao_pgto_int) {
            FormularioBaixa.valido = false;
            dtCorreto = false;
            dtMsg += "</br>A data de Informação do pagamento do Artigo 122 não pode ser menor do que a data de Informação do pagamento da Cota do Segurado!";
            FormularioBaixa.msg += dtMsg;
        }
        if(mob_tp_baixa === 'A' &&  mob_dt_informacao_pgto_int < P_mob_dt_informacao_pgto ) {
            FormularioBaixa.valido = false;
            dtCorreto = false;
            dtMsg += "</br>A data de Informação do pagamento do Artigo 122 não pode ser menor do que a data de Informação do pagamento da Cota Patronal!";
            FormularioBaixa.msg += dtMsg;
        }


        if (anomes_referencia_inicial_int > mob_dt_informacao_pgto_int) {
            FormularioBaixa.valido = false;
            dtCorreto = false;
            dtMsg += "</br>Data do Pagamento menor do que a do cadastro do Precatório!";
            FormularioBaixa.msg += dtMsg;
        }
        if (mob_dt_informacao_pgto_int > FormularioBaixa.datadehoje) {
            FormularioBaixa.valido = false;
            dtCorreto = false;
            dtMsg += "</br>Data da informação do Pagamento não pode ser depois da data atual!";
            FormularioBaixa.msg += dtMsg;
        }
        if(mob_dt_pgto_int > mob_dt_informacao_pgto_int) {
            FormularioBaixa.valido = false;
            dtCorreto = false;
            dtMsg += "</br>A data de Informação do pagamento não pode ser menor do que a data de pagamento!";
            FormularioBaixa.msg += dtMsg;
        }

        if (dtCorreto) {

        } else {
            $('input[name="mob_dt_informacao_pgto"]').val('');
            ScriptsConfig.swalconfirmeActionAlerta.fire({
                title: 'Atenção',
                html: dtMsg,
                icon: "warning",
                showCancelButton: false,
                showDenyButton: false,
                confirmButtonText: "Ok",
                cancelButtonText: "No, cancel!",
                reverseButtons: false, footer: ScriptsConfig.footerAlert,
                allowOutsideClick: false,
                allowEscapeKey: false,
                backdrop: true
            }).then((result) => {
                if (result.isConfirmed) {
                } else {
                }
            });
        }
        $('button[name="btnSalvarBaixa"]').removeAttr('disabled');
    }
    export function popularParametros(parame: any) {
        // console.log('parame.par_numero : ' + parame.par_numero);
        $('input[name="par_numero"]').val(parame.par_numero);
        $('input[name="par_ano_ultimo_precatorio"]').val(parame.par_ano_ultimo_precatorio);
        $('input[name="par_numero_ultimo_precatorio"]').val(parame.par_numero_ultimo_precatorio);
        $('input[name="par_numero_padrao_segmento_justica"]').val(parame.par_numero_padrao_segmento_justica);
        $('input[name="par_numero_padrao_tribunal"]').val(parame.par_numero_padrao_tribunal);
        $('input[name="par_dt_inclusao"]').val(parame.par_dt_inclusao);
        $('input[name="par_situacao"]').val(parame.par_situacao);
        $('input[name="par_cd_usuario_gsi"]').val(parame.par_cd_usuario_gsi);

        $('input[name="par_cd_banco"]').val(parame.par_cd_banco);
        $('input[name="par_cd_agencia"]').val(parame.par_cd_agencia);
        $('input[name="par_cd_conta"]').val(parame.par_cd_conta);
        $('input[name="par_tp_conta"]').val(parame.par_tp_conta);
    }

    export function bloquearCamposBaixasEfetuadas(temBaixa: boolean, baixa: any) {
        if (temBaixa) {
            $('input[id="inlineRadio1"]').attr('checked', 'checked');
            $('input[name="mob_vlr_pago"]').attr('readonly', 'readonly');
            $('input[name="mob_dt_pgto"]').attr('readonly', 'readonly');
            $('input[name="mob_dt_informacao_pgto"]').attr('readonly', 'readonly');
            $('button[name="btnSalvarBaixa"]').attr('disabled', 'disabled');
            $('input[id="inlineRadio2"]').attr('disabled', 'disabled');
            $('select[name="uge_codigo"] option').attr('disabled', 'disabled');
            $('select[name="uge_codigo"]').attr('disabled', 'disabled');
            $(`select[name="uge_codigo"] option[value="${baixa.uge_codigo}"]`).removeAttr('disabled');

            // $('select[name="uge_codigo"] option:selected').removeAttr('disabled');
            $('select[name="uge_codigo"]').val(baixa.uge_codigo);

            var uge_codigo = $('select[name="uge_codigo"] option:selected').val();
            var uge_codigo_text = $('select[name="uge_codigo"] option:selected').text();
            $('select[name="uge_codigo"]').empty().html(`<option value="${uge_codigo}">${uge_codigo_text}</option>`);
        } else {
            $('input[id="inlineRadio1"]').removeAttr('checked');
            $('input[id="mob_vlr_pago"]').removeAttr('readonly');
            $('input[id="mob_dt_pgto"]').removeAttr('readonly');
            $('input[id="mob_dt_informacao_pgto"]').removeAttr('readonly');
            $('button[id="btnSalvarBaixa"]').removeAttr('disabled');
            $('input[id="inlineRadio2"]').removeAttr('disabled');
            $('select[name="uge_codigo"]').removeAttr('disabled');
            $('select[name="uge_codigo"] option').removeAttr('disabled');
            FormularioBaixa.bai_xa_banco_compara = {
                mov_ano: '',
                mov_numero: 0,
                mob_sequencial: 0,
                par_numero: 0,
                mob_tp_baixa: '',
                mob_base_calculo_contribuicao_segurado_corrigida: 0,
                mob_base_calculo_contribuicao_patronal_corrigida: 0,
                mob_vlr_cota_segurado: 0,
                mob_vlr_cota_patronal: 0,
                mob_vlr_cota_patronal_art_122: 0,
                mob_vlr_contribuicao_total: 0,
                uge_codigo: 0,
                mob_vlr_pago: 0,
                mob_dt_pgto: '',
                mob_dt_informacao_pgto: '',
                mob_situacao: '',
                pct_movimento: null,
                pct_parametro: null
            };
        }
    }
    export function popularBaixas(temSegurado: boolean, baixaSegurado: any, baixa: any, temBaixa: boolean, mob_tp_baixa: string) {
        // console.log('temSegurado : ' + temSegurado);
        // console.log('baixaSegurado : ', baixaSegurado);
        // console.log('baixa : ', baixa);

        let mob_base_calculo_contribuicao_segurado_corrigida = Intl.NumberFormat('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(baixa.mob_base_calculo_contribuicao_segurado_corrigida).replace('R$ ', '');
        let mob_base_calculo_contribuicao_patronal_corrigida = Intl.NumberFormat('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(baixa.mob_base_calculo_contribuicao_patronal_corrigida).replace('R$ ', '');
        let mob_vlr_cota_segurado = Intl.NumberFormat('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(baixa.mob_vlr_cota_segurado).replace('R$ ', '');
        let mob_vlr_cota_patronal = Intl.NumberFormat('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(baixa.mob_vlr_cota_patronal).replace('R$ ', '');
        let mob_vlr_cota_patronal_art_122 = Intl.NumberFormat('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(baixa.mob_vlr_cota_patronal_art_122).replace('R$ ', '');
        let mob_vlr_contribuicao_total = (baixa.mob_vlr_contribuicao_total !== undefined && baixa.mob_vlr_contribuicao_total !== null && baixa.mob_vlr_contribuicao_total !== '')
            ? Intl.NumberFormat('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(baixa.mob_vlr_contribuicao_total).replace('R$ ', '') : '0';
        let mob_vlr_pago = Intl.NumberFormat('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(baixa.mob_vlr_pago).replace('R$ ', '');
        mob_vlr_pago = ((mob_vlr_pago !== '0,00' && mob_vlr_pago !== '0.00' && mob_vlr_pago !== '0' && mob_vlr_pago !== '0.0') ? mob_vlr_pago : '');
        // console.log('mob_vlr_pago : ', mob_vlr_pago);
        // $('input[name="mov_ano"]').val(baixa.mov_ano);
        // $('input[name="mov_numero"]').val(baixa.mov_numero);
        $('input[name="mob_sequencial"]').val(baixa.mob_sequencial);
        // $('input[name="par_numero"]').val(baixa.par_numero);
        const tp_baixa = ['S', 'P', 'A'];
        $('input[name="mob_tp_baixa"]').val((tp_baixa.indexOf(baixa.mob_tp_baixa) !== -1) ? baixa.mob_tp_baixa : (tp_baixa.indexOf(mob_tp_baixa) !== -1) ? mob_tp_baixa : 'S');
        $('input[name="mob_base_calculo_contribuicao_segurado_corrigida"]').val(mob_base_calculo_contribuicao_segurado_corrigida);
        $('input[name="mob_base_calculo_contribuicao_patronal_corrigida"]').val(mob_base_calculo_contribuicao_patronal_corrigida);
        $('input[name="mob_vlr_cota_segurado"]').val(mob_vlr_cota_segurado);
        $('input[name="mob_vlr_cota_patronal"]').val(mob_vlr_cota_patronal);
        $('input[name="mob_vlr_cota_patronal_art_122"]').val(mob_vlr_cota_patronal_art_122);
        $('input[name="mob_vlr_contribuicao_total"]').val(mob_vlr_contribuicao_total);
        $('input[name="mob_vlr_pago"]').val(mob_vlr_pago);
        $('input[name="mob_dt_pgto"]').val((temBaixa) ? converterDataJson(baixa.mob_dt_pgto) : '');
        $('input[name="mob_dt_informacao_pgto"]').val((temBaixa) ? converterDataJson(baixa.mob_dt_informacao_pgto) : '');
        const mob_sit_s = ['A', 'C'];
        $('input[name="mob_situacao"]').val((mob_sit_s.indexOf(baixa.mob_situacao) !== -1) ? baixa.mob_situacao : 'A');
        FormularioBaixa.temBaixa = temBaixa;
        FormularioBaixa.bloquearCamposBaixasEfetuadas(temBaixa, baixa);

        if (temSegurado) {
            $('select[name="uge_codigo"] option').attr('disabled', 'disabled');
            $(`select[name="uge_codigo"] option[value="${baixaSegurado.uge_codigo}"]`).removeAttr('disabled');
            $('select[name="uge_codigo"]').val(baixaSegurado.uge_codigo);
            FormularioBaixa.bai_xa_banco_compara.uge_codigo = baixaSegurado.uge_codigo;
            var uge_codigo = $('select[name="uge_codigo"] option:selected').val();
            var uge_codigo_text = $('select[name="uge_codigo"] option:selected').text();
            $('select[name="uge_codigo"]').empty().html(`<option value="${uge_codigo}">${uge_codigo_text}</option>`);
        }
    }

    export function carregarBaixa(mob_tp_baixa: string) {
        $.when(FormularioBaixa.carregaUGE()).then(function (data, textStatus, jqXHR) {
            $.when(FormularioBaixa.fetchDataMovimentoBaixa(mob_tp_baixa)).then(function (data, textStatus, jqXHR) {
                // console.log('FormularioBaixa.retorno.sucesso: ' + FormularioBaixa.retorno.sucesso);
                if (FormularioBaixa.retorno.sucesso) {
                    let ret = FormularioBaixa.retorno;
                    let parame: { par_numero?: number } | null = null;
                    let baixa: {} | null = null;
                    FormularioBaixa.bai_xa_banco_compara = {
                        mov_ano: '',
                        mov_numero: 0,
                        mob_sequencial: 0,
                        par_numero: 0,
                        mob_tp_baixa: '',
                        mob_base_calculo_contribuicao_segurado_corrigida: 0,
                        mob_base_calculo_contribuicao_patronal_corrigida: 0,
                        mob_vlr_cota_segurado: 0,
                        mob_vlr_cota_patronal: 0,
                        mob_vlr_cota_patronal_art_122: 0,
                        mob_vlr_contribuicao_total: 0,
                        uge_codigo: 0,
                        mob_vlr_pago: 0,
                        mob_dt_pgto: '',
                        mob_dt_informacao_pgto: '',
                        mob_situacao: '',
                        pct_movimento: null,
                        pct_parametro: null
                    };
                    let baixaSegurado: {} | null = null;
                    let parameAtiv = ret.parametroAtivo;
                    rt.temSegurado = ret.temSegurado;
                    rt.temPatronal = ret.temPatronal;
                    rt.temArt122 = ret.temArt122;
                    FormularioBaixa.verifTabBaixa(ret.temSegurado, ret.temPatronal, ret.temArt122);
                    console.log('mob_tp_baixa: ' + mob_tp_baixa);
                    // selectForm(mob_tp_baixa);
                    if (mob_tp_baixa === 'S') {
                        console.log(ret);
                        baixa = ret.baixaSegurado;
                        FormularioBaixa.tabName = 'S';
                        FormularioBaixa.bai_xa_banco_compara = ret.baixaSegurado;
                        FormularioBaixa.popularBaixas(ret.temSegurado, baixaSegurado, baixa, ret.temSegurado, mob_tp_baixa);
                     
                        if (ret.temSegurado) {
                            parame = ret.parametroSegurado;
                            console.log(parame);
                            console.log(parameAtiv);
                            FormularioBaixa.popularParametros((parame !== null && parame.par_numero && parame.par_numero > 0) ? parame : parameAtiv);
                        } else {
                            FormularioBaixa.popularParametros(parameAtiv);
                        }
                        
                        
                    } else if (mob_tp_baixa === 'P') {
                        FormularioBaixa.tabName = 'P';
                        baixa = ret.baixaPatronal;
                        FormularioBaixa.bai_xa_banco_compara = ret.baixaPatronal;
                        baixaSegurado = ret.baixaSegurado;
                        FormularioBaixa.popularBaixas(ret.temSegurado, baixaSegurado, baixa, ret.temPatronal, mob_tp_baixa);
               
                        if (ret.temPatronal) {
                            parame = ret.parametroPatronal;
                            FormularioBaixa.popularParametros((parame !== null && parame.par_numero && parame.par_numero > 0) ? parame : parameAtiv);
                        } else {
                            FormularioBaixa.popularParametros(parameAtiv);
                        }
                        
                    } else if (mob_tp_baixa === 'A') {
                        FormularioBaixa.tabName = 'A';
                        baixa = ret.baixaArt122;
                        FormularioBaixa.bai_xa_banco_compara = ret.baixaArt122;
                        baixaSegurado = ret.baixaSegurado;
                        FormularioBaixa.popularBaixas(ret.temSegurado, baixaSegurado, baixa, ret.temArt122, mob_tp_baixa);
             
                        if (ret.temArt122) {
                            parame = ret.parametroArt122;
                            FormularioBaixa.popularParametros((parame !== null && parame.par_numero && parame.par_numero > 0) ? parame : parameAtiv);
                        } else {
                            FormularioBaixa.popularParametros(parameAtiv);
                        }
                    } else {
                        FormularioBaixa.popularParametros(parameAtiv);
                    }
                }
            });
        });
    }

    let listaDeUGEsOptions: string = '<option value="0">Selecione a Unidade Gestora</option>';
    export function populaUGEs(lista) {
        lista.forEach(indice => {
            listaDeUGEsOptions += `<option value="${indice.uge_codigo}">${indice.uge_nome_orgao}</option>`;
        });
    }
    export function carregaUGE() {
        FormularioBaixa.retorno = { sucesso: false };
        var dadosForm = $('form[name="formBaixa"]').serialize();
        $.ajax({
            url: '/PrecatorioMovimentoBaixa/Uges', data: { dadosForm: dadosForm }, type: 'post', dataType: 'json', cache: false, async: false,
            statusCode: ScriptsConfig.statusCodeHandlers,
            success: function (json, textStatus, jqXHR) {
                // console.log(json);
                if (json.sucesso) {
                    $.when(FormularioBaixa.populaUGEs(json.lista)).then(function (data, textStatus, jqXHR) {
                        $('select[name="uge_codigo"]').empty().html(listaDeUGEsOptions);
                    });
                } else {
                    Swal.fire({ icon: "warning", title: "Oops...", html: json.msg, footer: ScriptsConfig.footerAlert });
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) { }, beforeSend: function (jqXHR) { },
            complete: function (XMLHttpRequest, textStatus) { }
        }).done(function () { }).fail(function (_XMLHttpRequest_, textStatus, errorThrown) {
            console.log(_XMLHttpRequest_); console.log(textStatus); console.log(errorThrown);
            ScriptsConfig.failFunctionAjax(_XMLHttpRequest_, textStatus, errorThrown);
        }).always(function () { });
    }

}

declare module "FormularioBaixa" {
    export = FormularioBaixa;
}

$(function () {

    $.when(FormularioBaixa.verificaSit_codigo()).then(function (data, textStatus, jqXHR) {

    });

    // Evento de clique no botão de salvar
    $('button[name="btnSalvarBaixa"]').on('click', function (e) {
        e.preventDefault();
        try {
            $.when(FormularioBaixa.validarTodos()).then(function (data, textStatus, jqXHR) {
                var dadosForm = $('form[name="formBaixa"]').serialize();
                if (!FormularioBaixa.valido) {
                    console.log('invalido');
                    if (FormularioBaixa.baixado) {
                        Swal.fire({ icon: 'warning', title: "Alteração", html: FormularioBaixa.msg, footer: ScriptsConfig.footerAlert });
                    } else {
                        Swal.fire({ icon: 'warning', title: "Atenção", html: FormularioBaixa.msg, footer: ScriptsConfig.footerAlert });
                    }

                } else {
                    console.log('valido');

                    ScriptsConfig.swalconfirmeActionFinalizar.fire({
                        title: 'Atenção',
                        html: 'Após efetuar a baixa não será possível alterar! <br /> Deseja continuar?',
                        icon: "warning",
                        showCancelButton: false,
                        showDenyButton: true,
                        confirmButtonText: '<i class="fa-solid fa-check"></i> Sim',
                        denyButtonText: 'Não <i class="fa-solid fa-arrow-right-from-bracket"></i>',
                        cancelButtonText: "",
                        reverseButtons: false,
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        backdrop: true
                    }).then((result) => {
                        if (result.isConfirmed) {
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
                        } else {

                        }
                    });

                }

            });
        } catch (error: any) {
            console.error('Falha salvando os dados: ', error.message);
            Swal.fire({ icon: 'error', title: "Erro", html: `Falha salvando os dados: ${error.message}`, footer: ScriptsConfig.footerAlert });
        } finally {
        }
    });

    $(document).on('change', 'form[name="formBaixa"] input.todos, form[name="formBaixa"] select.todos', function () {
        FormularioBaixa.validarTodos();
    });

    $(document).on('click', 'body input, body select', function () {
        $.when(FormularioBaixa.verificaSit_codigo()).then(function (data, textStatus, jqXHR) {
            if (FormularioBaixa.temBaixa) {
                $('input[id="inlineRadio1"]').attr('checked', 'checked');
                $('input[name="mob_vlr_pago"]').attr('readonly', 'readonly');
                $('input[name="mob_dt_pgto"]').attr('readonly', 'readonly');
                $('input[name="mob_dt_informacao_pgto"]').attr('readonly', 'readonly');
                $('button[name="btnSalvarBaixa"]').attr('disabled', 'disabled');
                $('input[id="inlineRadio2"]').attr('disabled', 'disabled');
                $('select[name="uge_codigo"] option').attr('disabled', 'disabled');
            }
        });
    });
    $('select[name="uge_codigo"]').on('change', function (e) {
        FormularioBaixa.validarUnidadeGestora();
    });
    $('input[name="mob_vlr_pago"]').on('change', function (e) {
        FormularioBaixa.validarValorPago();
    });

    $('input[name="mob_dt_pgto"]').on('change', function (e) {
        FormularioBaixa.validarDtPagto();
    });

    $('input[name="mob_dt_informacao_pgto"]').on('change', function (e) {
        FormularioBaixa.validarDtInfPagto();
    });

    $('input[name="inlineRadioOptions"]').on('click', function (e) {
        let inlineRadioOptions: string = $('input[name="inlineRadioOptions"]:checked').val()?.toString() || '';
        if (inlineRadioOptions !== undefined) {
            if (inlineRadioOptions === null || inlineRadioOptions === '' || inlineRadioOptions === '0') {
                FormularioBaixa.valido = false;
            } else {
                if (inlineRadioOptions === 'S') {

                } else if (inlineRadioOptions === 'N') {
                    FormularioBaixa.valido = false;
                    Swal.fire({ icon: 'warning', title: "Atenção", html: 'Informar o Gestor da Arrecadação sobre essa divergência', footer: ScriptsConfig.footerAlert });
                } else {
                    FormularioBaixa.valido = false;
                }
            }
        }
    });

    $('button[name="btnVoltar"]').on('click', function (e) {
        e.preventDefault();
        $.when(FormularioBaixa.verificarCamposModificados()).then(function (data, textStatus, jqXHR) {
            if (FormularioBaixa.camposModificados) {
                ScriptsConfig.swalWithBootstrapButtons.fire({
                    title: "Atenção",
                    icon: "warning",
                    html: 'Há campos que ainda não foram salvos<br/>Deseja continuar',
                    showCancelButton: true,
                    confirmButtonText: "Sim",
                    cancelButtonText: "Não",
                    reverseButtons: false
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = '/PrecatorioMovimentoBaixa/Index';
                    } else {
                    }
                });
            } else {
                window.location.href = '/PrecatorioMovimentoBaixa/Index';
            }
        });
    });

    $('button[name="btnSair"]').on('click', function (e) {
        e.preventDefault();
        $.when(FormularioBaixa.verificarCamposModificados()).then(function (data, textStatus, jqXHR) {
            if (FormularioBaixa.camposModificados) {
                ScriptsConfig.swalWithBootstrapButtons.fire({
                    title: "Atenção",
                    icon: "warning",
                    html: 'Há campos que ainda não foram salvos<br/>Deseja continuar',
                    showCancelButton: true,
                    confirmButtonText: "Sim",
                    cancelButtonText: "Não",
                    reverseButtons: false
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = '/Home/Index';
                    } else {
                    }
                });
            } else {
                window.location.href = '/Home/Index';
            }
        });
    });
});