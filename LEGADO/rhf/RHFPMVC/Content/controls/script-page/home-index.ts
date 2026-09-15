// File: script-page/questionario-index.ts

/// <reference path="../config-scripts/@types/jquery/index.d.ts" />
/// <reference path="../config-scripts/@types/jquery.form/index.d.ts" />

/// <reference path="../config-scripts/@types/datatables.net/types/types.d.ts" />
/// <reference path="../config-scripts/sweetalert2.d.ts" />
/// <reference path="../config-scripts/config.ts" />
/// <reference path="../config-scripts/ScriptsConfig.d.ts" />

namespace HomeIndex {

    export let listaEventos: Array<{
        tempo: number;
        eve_num_evento: number;
        eve_nome: string;
        eve_descricao: string;
        eve_local: string;
        eve_municipio: string;
        eve_dt_inicio: string;
        eve_dt_fim: string;
        eve_dt_inclusao: string;
        eve_situacao: string;
        que_num_questionario: number;
        que_contexto: string;
        que_publico_alvo: string;
        que_nota_minima: number;
        que_dt_inclusao: string;
        que_situacao: string;

    }> = [];


    export function eventoDescricao(eve_num_evento, que_num_questionario) {

        let cab_eve_nome: string = $('h3[id="eve[' + eve_num_evento + '][' + que_num_questionario + '][cab_eve_nome]"]').text()?.toString() ?? '';
        let cab_eve_descricao_hidden: string = $('input[name="eve[' + eve_num_evento + '][' + que_num_questionario + '][cab_eve_descricao_hidden]"]').val()?.toString() ?? '';
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


            } else {

            }
        });
    }

    export let eve_num_evento: number = 0;
    export let que_num_questionario: number = 0;
    export let que_nota_minima: number = 0;



    function gerarHTML(lista) {
        HomeIndex.listaEventos = [];

        let tabela: string = '<table class="table table-striped">';
        HomeIndex.eve_num_evento = Number($('input[name="eve_num_evento"]').val()?.toString() ?? '0');
        HomeIndex.que_num_questionario = Number($('input[name="que_num_questionario"]').val()?.toString() ?? '0');
        HomeIndex.que_nota_minima = Number($('input[name="que_nota_minima"]').val()?.toString() ?? '0');

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
                que_nota_minima: Number(q.que_nota_minima.replace(',','.')) || 0,
                que_dt_inclusao: q.que_dt_inclusao || '',
                que_situacao: q.que_situacao || ''
            });
            let cab_eve_descricao: string = q.eve_descricao.toString();
            let descri: string = ((cab_eve_descricao.length >= 100) ? cab_eve_descricao.substring(0, 100) + '<span class="text-danger" style="cursor:pointer;"> ... Saiba mais ... </span>' : cab_eve_descricao);
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


    
    let mensagem: string = '';

    $(function () {

        setTimeout(() => {
            console.log("This prints after 2 seconds!");
            // carregarLista();
        }, 200);

         
        $('button[name="btnSubmitIniciarCadastro"]').on('click', function () {

            let eve_num_evento: number = Number($('input[name="eve_num_evento"]').val()?.toString() ?? '0');
            let que_num_questionario: number = Number($('input[name="que_num_questionario"]').val()?.toString() ?? '0');

            if (eve_num_evento > 0 && que_num_questionario > 0) {
                $('form[name="formHomeIndex"]').trigger('submit');
            } else {

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
                        // window.location.href = '/Home/Index';
                    } else {
                        // window.location.href = '/Home/Index';
                    }
                });
            }



        });

        $('h4.cab_eve_descricao').on('click', function () {


            let cab_eve_nome: string = $('h3[id="cab_eve_nome"]').text()?.toString() ?? '';
            let cab_eve_descricao_hidden: string = $('input[name="cab_eve_descricao_hidden"]').text()?.toString() ?? '';
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


                } else {

                }
            });
        });


    });
}

declare module "HomeIndex" {
    export = HomeIndex;
}