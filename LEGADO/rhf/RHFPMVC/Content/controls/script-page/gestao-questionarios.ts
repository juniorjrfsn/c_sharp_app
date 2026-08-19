// File: script-page/questionario-index.ts

/// <reference path="../config-scripts/@types/jquery/index.d.ts" />
/// <reference path="../config-scripts/@types/jquery.form/index.d.ts" />

/// <reference path="../config-scripts/@types/datatables.net/types/types.d.ts" />
/// <reference path="../config-scripts/sweetalert2.d.ts" />
/// <reference path="../config-scripts/config.ts" />
/// <reference path="../config-scripts/ScriptsConfig.d.ts" />

namespace GestQs {
    export let tempo: number = Date.now();

    let municipiosList: any[] = [];
    let carregandoMunicipios = false;
    let selectedIndex = -1;

    export let eventosDtos: Array<{
        eve_num_evento: any;
        eve_nome: any;
        eve_descricao: any;
        eve_local: any;
        eve_municipio: any;
        eve_dt_inicio: any;
        eve_dt_fim: any;
        eve_dt_inclusao: any;
        eve_situacao: any;
        que_num_questionario: any;
        que_contexto: any;
        que_publico_alvo: any;
        que_nota_minima: any;
        que_dt_inclusao: any;
        que_situacao: any;
    }> = [];

    export let questionariosDtos: Array<{
        tempo: string;
        eve_num_evento: any;
        que_num_questionario: any;
        que_contexto: any;
        que_publico_alvo: any;
        que_nota_minima: any;
        que_dt_inclusao: any;
        que_situacao: any;
    }> = [];

    export let dataTableInstanceEventos: any | null = null;
    export let dataTableInstance: any | null = null;
    export let dataTableInstanceEveQuestion: any | null = null;
    export let dataTableInstanceEventosQuestionarios: any | null = null;

    export let _ano: string = '0';
    export let _mes: string = '0';

    export let eve_num_evento: number = 0;

    export let que_num_questionario: number = 0;

    export let eventos: Array<{
        tempo: string;
        eve_num_evento: number;
        eve_nome: string;
        eve_descricao: string;
        eve_local: string;
        eve_municipio: string;
        eve_dt_inicio: string;
        eve_dt_fim: string;
        eve_dt_inclusao: string;
        eve_situacao: string;
    }> = [];

    export let listaEventos: Array<{
        tempo: string;
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

    export let dadosDaTabela: Array<{
        tempo: number;
        usr_num_usuario: number;
        eve_num_evento: number;
        que_num_questionario: number;
        que_contexto: string;
        que_situacao: string;
        usr_cpf: string;
        usr_nome: string;
        usr_email: string;
        usr_situacao: string;
        eve_nome: string;
        pontuacao: number;
        eve_situacao: string;
    }> = [];

    export let listaUsuariosPontos: Array<{
        tempo: number;
        usr_num_usuario: number;
        eve_num_evento: number;
        que_num_questionario: number;
        que_contexto: string;
        que_situacao: string;
        usr_cpf: string;
        usr_nome: string;
        usr_email: string;
        usr_situacao: string;
        eve_nome: string;
        pontuacao: number;
        eve_situacao: string;
    }> = [];

    function addRegistroNoArray(rowData) {
        let tempo: number = Date.now();
        // Obtém a última linha adicionada e obtém o atributo accesskey
        // const newRow = ItemMovimento.dataTableInstance.row(':last').node();
        // tempo = $(newRow).attr('accesskey');
        let rd = {
            tempo: ((rowData.tempo !== undefined && rowData.tempo !== null) ? rowData.tempo : parseInt(tempo.toString())),
            usr_num_usuario: ((rowData.usr_num_usuario !== undefined && rowData.usr_num_usuario !== null) ? rowData.usr_num_usuario : 0),
            eve_num_evento: ((rowData.eve_num_evento !== undefined && rowData.eve_num_evento !== null) ? rowData.eve_num_evento : 0),
            que_num_questionario: ((rowData.que_num_questionario !== undefined && rowData.que_num_questionario !== null) ? rowData.que_num_questionario : 0),
            que_contexto: ((rowData.que_contexto !== undefined && rowData.que_contexto !== null) ? rowData.que_contexto : ''),
            que_situacao: ((rowData.que_situacao !== undefined && rowData.que_situacao !== null) ? rowData.que_situacao : 'A'),

            usr_cpf: ((rowData.usr_cpf !== undefined && rowData.usr_cpf !== null) ? rowData.usr_cpf : ''),
            usr_nome: ((rowData.usr_nome !== undefined && rowData.usr_nome !== null) ? rowData.usr_nome : ''),
            usr_email: ((rowData.usr_email !== undefined && rowData.usr_email !== null) ? rowData.usr_email : ''),

            usr_situacao: ((rowData.usr_situacao !== undefined && rowData.usr_situacao !== null) ? rowData.usr_situacao : 'A'),
            eve_nome: ((rowData.eve_nome !== undefined && rowData.eve_nome !== null) ? rowData.eve_nome : ''),
            pontuacao: ((rowData.pontuacao !== undefined && rowData.pontuacao !== null) ? rowData.pontuacao : 0),

            eve_situacao: ((rowData.eve_situacao !== undefined && rowData.eve_situacao !== null) ? rowData.eve_situacao : 'A')
        };
        GestQs.dadosDaTabela.push(rd);
    }

    export function initializeDataTable(data, mes, ano, pageLength) {

        // console.log('Inicializando DataTable...');
        if (!Array.isArray(data)) {
            console.error('Os dados recebidos não são válidos:', data);
            data = [];
        }

        console.table(data);

        if (GestQs.dataTableInstance) {
            GestQs.dataTableInstance.destroy();
        }
        $('#table-lista-itens tbody').empty();

        // console.log('Inicializando DataTable com os dados recebidos...');
        GestQs.dataTableInstance = $('#table-lista-itens').DataTable({
            data: data,
            paging: true, // Ativa a paginação
            pageLength: pageLength,
            destroy: true,
            fixedHeader: true,
            info: true,
            lengthMenu: [100, 250, 500, 750, 1000],
            dom: 'Bfrtip',
            buttons: [
                {
                    extend: 'excelHtml5', // 'excelHtml5',
                    extension: '.xlsx',
                    header: true,
                    footer: false,
                    autoFilter: false,
                    bom: false,
                    sheetName: 'SigEventos ' + mes + '-de-' + ano,
                    messageTop: 'SigEventos: ' + mes + '/' + ano,
                    text: '<i class="far fa-file-excel text-success fa-lg"></i>'
                    , title: null
                    , filename: function () {
                        return 'SigEventos-mes-' + mes + '-de-' + ano; // + '-' + dt_gerado;
                    },
                    exportOptions: {
                        columns: [0, 1, 3],
                        format: {
                            body: function (data, row, column, node: any) {
                                console.log(data);
                                const $vale = $(data);
                                console.log($vale.filter('.mes_ano').val());

                                switch (column) {
                                    case 0:
                                        // return $(node).find('input').val();
                                        return $(node).find('input[type="text"]').val()?.toString();
                                        break;
                                    case 1:
                                        // return $(node).find('span').text();
                                        return $(node).find('input[type="hidden"]').val();
                                        break;
                                    case 2:
                                        return $(node).find('div').text();
                                        //return $(node).find('input.monet').val()?.toString().replace('.', '').replace('.', '').replace('.', '').replace(',', '.');
                                        break;
                                    case 3:
                                        return $(node).find('span').text();
                                        // return $(node).find('select option:selected').text();
                                        // return $(node).find('input.monetIndice').val()?.toString().replace('.', '').replace('.', '').replace('.', '').replace(',', '.');
                                        break;
                                    case 4:
                                        return $(node).find('button').text();
                                        // return $(node).find('input.monetIndice').val()?.toString().replace('.', '').replace('.', '').replace('.', '').replace(',', '.');
                                        break;
                                    // case 5:
                                    //     return $(node).find('input.monet').val()?.toString().replace('.', '').replace('.', '').replace('.', '').replace(',', '.');
                                    //     break;
                                    // case 6:
                                    //     return $(node).find('input.monet').val()?.toString().replace('.', '').replace('.', '').replace('.', '').replace(',', '.');
                                    //     break;
                                    // case 7:
                                    //     return $(node).find('label.esquer').text() + ' / ' + $(node).find('label.direi').text();
                                    //     break;
                                    // case 8:
                                    //     return $(node).find('label.esquer').text() + ' / ' + $(node).find('label.direi').text();
                                    //     break;
                                    // case 9:
                                    //     return $(node).find('input.monet').val()?.toString().replace('.', '').replace('.', '').replace('.', '').replace(',', '.');
                                    //     break;
                                    // case 10:
                                    //     return $(node).find('input.monet').val()?.toString().replace('.', '').replace('.', '').replace('.', '').replace(',', '.');
                                    //     break;
                                    // case 11:
                                    //     return $(node).find('select option:selected').text();
                                    //     break;
                                    default:
                                        return $(node).find('input[type="text"]').val();
                                }

                            }
                        }
                    }
                    //, orientation: 'portrait'
                    //, exportOptions: { columns: [0, 1, 2, 3, 4]  }
                },
                {
                    extend: 'pdfHtml5',
                    title: null,
                    filename: function () {
                        return 'SigEventos-mes-' + mes + '-de-' + ano; // + '-' + dt_gerado;
                    },
                    text: '<i class="fa-regular fa-file-pdf text-danger fa-lg"></i>',
                    exportOptions: {
                        columns: [0, 1, 3],
                        format: {
                            body: function (data, row, column, node: any) {
                                console.log(data);
                                const $vale = $(data);
                                console.log($vale.filter('.usr_cpf').val());

                                switch (column) {
                                    case 0:
                                        // return $(node).find('input').val();
                                        return $(node).find('input[type="text"]').val()?.toString();
                                        break;
                                    case 1:
                                        // return $(node).find('span').text();
                                        return $(node).find('input[type="hidden"]').val();
                                        break;
                                    case 2:
                                        return $(node).find('div').text();
                                        //return $(node).find('input.monet').val()?.toString().replace('.', '').replace('.', '').replace('.', '').replace(',', '.');
                                        break;
                                    case 3:
                                        return $(node).find('span').text();
                                        // return $(node).find('select option:selected').text();
                                        // return $(node).find('input.monetIndice').val()?.toString().replace('.', '').replace('.', '').replace('.', '').replace(',', '.');
                                        break;
                                    case 4:
                                        return $(node).find('button').text();
                                        // return $(node).find('input.monetIndice').val()?.toString().replace('.', '').replace('.', '').replace('.', '').replace(',', '.');
                                        break;
                                    default:
                                        return $(node).find('input[type="text"]').val();
                                }
                            }
                        }
                    }
                    //Columns to export
                    //exportOptions: {
                    //     columns: [0, 1, 2, 3, 4, 5, 6]
                    //  }
                },
                {
                    extend: 'colvis',
                    autoFilter: true,
                    sheetName: 'colvis',
                    text: '<i class="fas fa-columns text-primary fa-lg"></i>',
                    orientation: 'portrait',
                    customize: function (doc) {
                        /*
                            doc.content[1].table.widths = Array(doc.content[1].table.body[0].length + 1).join('*').split('');
                            var rowCount = doc.content[1].table.body.length;
                            for (i = 0; i < rowCount + 1; i++) {
                                doc.content[1].table.body[i][4].alignment = 'right';
                                doc.content[1].table.body[i][5].alignment = 'right';
                            }
                        */
                    },
                    exportOptions: {
                        columns: [0, 1, 2, 3, 4]
                    }
                }
            ],
            initComplete: function () {
                // usa a instância que você já guardou
                var table = GestQs.dataTableInstance;

                // remove todos os botões (Excel, PDF e ColVis)
                table.buttons([0, 1, 2]).remove();

                // ou, se preferir por classe:
                // table.buttons('.btn-excel').remove();
                // table.buttons('.btn-pdf').remove();
                // table.buttons('.btn-colvis').remove();
            },
            lengthChange: true,
            searching: false,
            ordering: true,
            columns: [
                {
                    data: 'usr_cpf', className: 'editable usr_cpf',
                    createdCell: function (td, cellData, rowData, row, col) {
                        // console.log(col + ' :: accesskey:' + tempo);
                        $(td)
                            .attr('id', `linh[${row}][usr_cpf]`)
                            .attr('row', row)
                            .attr('col', col)
                            .attr('campo', 'usr_cpf')
                            .attr('data-usr_num_usuario', rowData.usr_num_usuario || '0')
                            .attr('data-eve_num_evento', rowData.eve_num_evento || '0')
                            .attr('data-que_num_questionario', rowData.que_num_questionario || '0')
                            .attr('accesskey', rowData.usr_num_usuario || GestQs.tempo);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            var colorCancel = '';
                            let usr_cpf = data;

                            if (row.usr_num_usuario == 0 && row.que_num_questionario == 0) {
                                return `
                                    <td data-usr_num_usuario="${row.usr_num_usuario || GestQs.tempo}" data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}"
                                         accesskey="${row.usr_num_usuario || GestQs.tempo}" style="text-align:center; background-color:  #337ab7 ;">
                                         <div class="form-control text-white" style="text-align:center; background-color: #337ab7;" >Evento<div>     
                                    </td>

                            `;
                            }
                            else if (row.usr_num_usuario == 0 && row.que_num_questionario > 0) {
                                return `
                                    <td data-usr_num_usuario="${row.usr_num_usuario || GestQs.tempo}" data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}"
                                         accesskey="${row.usr_num_usuario || GestQs.tempo}" style="text-align:center; background-color:  #337ab7;">
                                         <div class="form-control text-white"  style="text-align:center; background-color:  #337ab7;" >Questionário<div>     
                                    </td>

                            `;
                            } else {
                                return `
                                    <td data-usr_num_usuario="${row.usr_num_usuario || GestQs.tempo}" data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}"
                                         accesskey="${row.usr_num_usuario || GestQs.tempo}">

                                        <input type="hidden" class="form-control usr_num_usuario"
                                            name="inpu[${row.usr_num_usuario || GestQs.tempo}][usr_num_usuario]"
                                            id="inpu[${row.usr_num_usuario || GestQs.tempo}][usr_num_usuario]"
                                            value="${row.usr_num_usuario || GestQs.tempo}"
                                            accesskey="${row.usr_num_usuario || GestQs.tempo}"  />

                                        <input type="hidden" class="form-control eve_num_evento"
                                            name="inpu[${row.usr_num_usuario || GestQs.tempo}][eve_num_evento]"
                                            id="inpu[${row.usr_num_usuario || GestQs.tempo}][eve_num_evento]"
                                            value="${row.eve_num_evento || 0}"
                                            accesskey="${row.usr_num_usuario || GestQs.tempo}"  />

                                        <input type="hidden" class="form-control que_num_questionario"
                                            name="inpu[${row.usr_num_usuario || GestQs.tempo}][que_num_questionario]"
                                            id="inpu[${row.usr_num_usuario || GestQs.tempo}][que_num_questionario]"
                                            value="${row.que_num_questionario || '0'}"
                                            accesskey="${row.usr_num_usuario || GestQs.tempo}"  />

                                        <input type="text" class="form-control usr_cpf"
                                            name="inpu[${row.usr_num_usuario || GestQs.tempo}][usr_cpf]"
                                            id="inpu[${row.usr_num_usuario || GestQs.tempo}][usr_cpf]"
                                            data-usr_num_usuario="${row.usr_num_usuario || GestQs.tempo}" 
                                            data-eve_num_evento="${row.eve_num_evento || 0}" 
                                            data-que_num_questionario="${row.que_num_questionario || 0}"
                                            value="${usr_cpf || ''}"
                                            onblur="javascript:GestQs.validarCampos(${row.usr_num_usuario || GestQs.tempo}, 'usr_cpf');"
                                            onclick="javascript:inputMascara();"
                                            maxlength="11"
                                            accesskey="${row.usr_num_usuario || GestQs.tempo}" style="max-width:130px; ${colorCancel || ''}"  readonly="readonly" />
                                             
                                    </td>

                            `;
                            }
                        }
                        return data; // Return raw data for other types (e.g., sorting, filtering)
                    }

                }, {
                    data: 'usr_nome', className: 'editable',
                    createdCell: function (td, cellData, rowData, row, col) {
                        // console.log(col + ' :: accesskey:' + tempo);
                        $(td)
                            .attr('id', `linh[${row}][usr_nome]`)
                            .attr('row', row)
                            .attr('col', col)
                            .attr('campo', 'usr_nome')
                            .attr('data-usr_num_usuario', rowData.usr_num_usuario || '0')
                            .attr('data-eve_num_evento', rowData.eve_num_evento || '0')
                            .attr('data-que_num_questionario', rowData.que_num_questionario || '0')
                            .attr('accesskey', rowData.usr_num_usuario || GestQs.tempo);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            var colorCancel = '';
                            // let valor = Number(data);
                            let usr_nome = data;

                            let usr_cpf = "";
                            if (row.usr_cpf.length === 11) {
                                usr_cpf = "***." + row.usr_cpf.substring(3, 6) + "." + row.usr_cpf.substring(6, 9) + "-**";
                            } else {
                                usr_cpf = row.usr_cpf;
                            }

                            if ((usr_nome == '' || usr_nome == null) && row.que_num_questionario == 0) {
                                return `
                                    <td data-usr_num_usuario="${row.usr_num_usuario || GestQs.tempo}" data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}"
                                         accesskey="${row.usr_num_usuario || GestQs.tempo}" style="text-align:center; background-color:  #337ab7 ;">
                                         <div class="form-control text-white" style="text-align:center; background-color: #337ab7;" >${row.eve_nome || ''}<div>     
                                    </td>

                            `;
                            }
                            else if ((usr_nome == '' || usr_nome == null) && row.que_num_questionario > 0) {
                                return `
                                    <td data-usr_num_usuario="${row.usr_num_usuario || GestQs.tempo}" data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}"
                                         accesskey="${row.usr_num_usuario || GestQs.tempo}" style="text-align:center; background-color:  #337ab7;">
                                         <div class="form-control text-white"  style="text-align:center; background-color:  #337ab7;" >${row.que_contexto || ''}<div>     
                                    </td>

                            `;
                            } else {
                                return `
                                  <td
                                    data-usr_num_usuario="${row.usr_num_usuario || GestQs.tempo}" style="100%;padding-bottom:0px;vertical-align:bottom;"
                                    data-eve_num_evento="${row.eve_num_evento || 0}" 
                                    data-que_num_questionario="${row.que_num_questionario || 0}"
                                         accesskey="${row.usr_num_usuario || GestQs.tempo}" >
                                         <div class="form-group" style="100%;padding-bottom:0px;margin-bottom: 2px;">
                                            <input type="hidden" class="form-control usr_nome"
                                                name="inpu[${row.usr_num_usuario || GestQs.tempo}][usr_nome_hidden]"
                                                id="inpu[${row.usr_num_usuario || GestQs.tempo}][usr_nome_hidden]"
                                                value="${row.usr_nome || ''}"
                                                accesskey="${row.usr_num_usuario || GestQs.tempo}"  />
                                         
                                            <span  class="form-control usr_cpf" 
                                                    name="inpu[${row.usr_num_usuario || GestQs.tempo}][usr_cpf]"
                                                    id="inpu[${row.usr_num_usuario || GestQs.tempo}][usr_cpf]"
                                                    data-usr_num_usuario="${row.usr_num_usuario || GestQs.tempo}" 
                                                    data-eve_num_evento="${row.eve_num_evento || 0}" 
                                                    data-que_num_questionario="${row.que_num_questionario || 0}"
                                                    value="${row.usr_cpf || ''}"
                                                    onblur="javascript:GestQs.validarCampos(${row.usr_num_usuario || GestQs.tempo}, 'usr_cpf');"
                                                    onclick="javascript:inputMascara();"
                                                    maxlength="11"
                                                    accesskey="${row.usr_num_usuario || GestQs.tempo}" style="max-width:150px; float:left; ${colorCancel || ''}"  readonly="readonly" />${usr_cpf || ''}
                                            </span>
                                            <span  class="form-control" accesskey="${row.usr_num_usuario || GestQs.tempo}" 
                                                name="inpu[${row.usr_num_usuario || GestQs.tempo}][usr_nome]" id="inpu[${row.usr_num_usuario || GestQs.tempo}][usr_nome]"
                                                onblur="javascript:GestQs.validarCampos(${row.usr_num_usuario || GestQs.tempo},'usr_nome');"  readonly="readonly"
                                                value="${usr_nome || ''}" style="width:auto;" 
                                              />${usr_nome.toUpperCase() || ''}</span>
                                      </div>
                                </td>
                            `;
                            }

                        }
                        return data;
                    }
                }, {
                    data: 'eve_nome', className: 'editable',
                    createdCell: function (td, cellData, rowData, row, col) {
                        // console.log(col + ' :: accesskey:' + tempo);
                        $(td)
                            .attr('id', `linh[${row}][eve_nome]`)
                            .attr('row', row)
                            .attr('col', col)
                            .attr('campo', 'eve_nome')
                            .attr('data-usr_num_usuario', rowData.usr_num_usuario || '0')
                            .attr('data-eve_num_evento', rowData.eve_num_evento || '0')
                            .attr('data-que_num_questionario', rowData.que_num_questionario || '0')
                            .attr('accesskey', rowData.usr_num_usuario || GestQs.tempo);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            // var colorCancel = ((row.pim_situacao === 'A') ? '' : 'color:red;');
                            // let valor = Number(data);
                            let eve_nome = data;
                            return `
                                  <td data-usr_num_usuario="${row.usr_num_usuario || GestQs.tempo}" data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}"
                                         accesskey="${row.usr_num_usuario || GestQs.tempo}">

                                    <input type="text" class="form-control" accesskey="${row.usr_num_usuario || GestQs.tempo}"  
                                        name="inpu[${row.usr_num_usuario || GestQs.tempo}][eve_nome]" id="inpu[${row.usr_num_usuario || GestQs.tempo}][eve_nome]"
                                        onblur="javascript:GestQs.validarCampos(${row.usr_num_usuario || GestQs.tempo},'eve_nome');"
                                        value="${eve_nome || ''}"  readonly="readonly"
                                    style="width:100%;" />
                                </td>
                            `;
                        }
                        return data;
                    }
                }, {
                    data: 'pontuacao', className: 'editable',
                    createdCell: function (td, cellData, rowData, row, col) {
                        // console.log(col + ' :: accesskey:' + tempo);
                        $(td)
                            .attr('id', `linh[${row}][pontuacao]`)
                            .attr('row', row)
                            .attr('col', col)
                            .attr('campo', 'pontuacao')
                            .attr('data-usr_num_usuario', rowData.usr_num_usuario || '0')
                            .attr('data-eve_num_evento', rowData.eve_num_evento || '0')
                            .attr('data-que_num_questionario', rowData.que_num_questionario || '0')
                            .attr('accesskey', rowData.usr_num_usuario || GestQs.tempo);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            var colorCancel = ((row.pim_situacao === 'A') ? '' : 'color:red;');
                            let valor = Number(data);
                            if ((row.usr_cpf == '' || row.usr_cpf == null) && row.que_num_questionario == 0) {
                                return `
                                    <td data-usr_num_usuario="${row.usr_num_usuario || GestQs.tempo}" data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}"
                                         accesskey="${row.usr_num_usuario || GestQs.tempo}" style="text-align:center; background-color:  #337ab7 ;">
                                         <div><div>     
                                    </td>

                            `;
                            }
                            else if ((row.usr_cpf == '' || row.usr_cpf == null) && row.que_num_questionario > 0) {
                                return `
                                    <td data-usr_num_usuario="${row.usr_num_usuario || GestQs.tempo}" data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}"
                                         accesskey="${row.usr_num_usuario || GestQs.tempo}" style="text-align:center; background-color: #337ab7;padding-bottom:0px;">
                                         <span class="form-control text-white" style="text-align:center; background-color: #337ab7;" >Nota<span>
                                    </td>

                            `;
                            } else {
                                let pontuacao: number = Number(data.toFixed(2));
                                let nota = pontuacao?.toString().replace('.', ',',);

                                return `
                                    <td data-usr_num_usuario="${row.usr_num_usuario || GestQs.tempo}" data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}"
                                             accesskey="${row.usr_num_usuario || GestQs.tempo}" style="text-align: center;">

                                        <div class="form-group" style="100%;padding-bottom:0px;margin-bottom: 2px;">
                                            <span class="form-control" accesskey="${row.usr_num_usuario || GestQs.tempo}"  name="inpu[${row.usr_num_usuario || GestQs.tempo}][pontuacao]" id="inpu[${row.usr_num_usuario || GestQs.tempo}][pontuacao]"
                                            onblur="javascript:GestQs.validarCampos(${row.usr_num_usuario || GestQs.tempo},'pontuacao');"
                                   
                                            readonly="readonly"/>${nota || ''}</span>
                                        </div>
                                    </td>
                            `;
                            }
                        }
                        return data;
                    }
                },
                {
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('id', 'linh[' + row + '][excluir]').attr('row', row).attr('col', col).attr('campo', 'excluir')
                            .attr('accesskey', rowData.usr_num_usuario || GestQs.tempo);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            var colorCancel = '';
                            return `<td style="max-width: 40px;">`
                                + `<button type="button" class="delete-row" style="border:none;background:none;color:red;width:50px;" accesskey="${row.usr_num_usuario || GestQs.tempo}" title="Excluir"><i class="fas fa-trash-alt"></i></button>` +
                                `</td>`;
                        }
                        return data;
                    },
                    // defaultContent: '<button class="edit-row">Editar</button> <button class="delete-row">Excluir</button>',
                    //defaultContent: '<button class="delete-row">Excluir</button>',
                    orderable: false
                }
            ],
            language: {
                url: 'https://cdn.datatables.net/plug-ins/1.13.6/i18n/pt-BR.json'
            },
            columnDefs: [
                { targets: [1, 3], visible: true }, { targets: [0, 2, 4], visible: false }
            ],
            order: [[1, 'asc']],
            autoFill: true
        }).draw();

        // console.log('DataTable inicializado com sucesso.');
    }
    export function carregarIndices() { }

    function gerarHTML(lista) {
        GestQs.listaUsuariosPontos = [];

        // Agrupa os itens por evento e depois por questionário
        const eventosMapa: {
            [key: number]: {
                nome: string;
                situacao: string;
                num: number;
                questionarios: {
                    [key: number]: {
                        num: number;
                        que_contexto: string;
                        situacao: string;
                        participantes: any[];
                    }
                }
            }
        } = {};

        lista.forEach(q => {
            const evId = q.eve_num_evento || 0;
            const qId = q.que_num_questionario || 0;

            if (!eventosMapa[evId]) {
                eventosMapa[evId] = {
                    nome: q.eve_nome || 'Sem Evento',
                    situacao: q.eve_situacao || '',
                    num: evId,
                    questionarios: {}
                };
            }

            if (!eventosMapa[evId].questionarios[qId]) {
                eventosMapa[evId].questionarios[qId] = {
                    num: qId,
                    que_contexto: q.que_contexto,
                    situacao: q.que_situacao || '',
                    participantes: []
                };
            }

            eventosMapa[evId].questionarios[qId].participantes.push(q);
        });

        let tabela: string = '<table class="table table-striped">';

        Object.values(eventosMapa).forEach(ev => {
            // Header do Evento
            tabela += `
                <tr>
                    <td class="list-group-item font-weight-bold text-white" style="background-color: #337ab7;" data-eve_num_evento="${ev.num}" data-eve_situacao="${ev.situacao}"> 
                        <strong>Evento: ${ev.nome}</strong>
                    </td>
                </tr>`;
            GestQs.listaUsuariosPontos.push({
                tempo: Date.now(),
                usr_num_usuario: 0,
                eve_num_evento: ev.num,
                eve_situacao: ev.situacao,
                que_num_questionario: 0,
                que_contexto: "",
                que_situacao: "",
                usr_cpf: "",
                usr_nome: "",
                usr_email: "",
                usr_situacao: "",
                eve_nome: ev.nome,
                pontuacao: 0
            });

            Object.values(ev.questionarios).forEach(que => {
                // Header do Questionário
                tabela += `
                    <tr>
                        <td class="list-group-item font-weight-bold" style="background-color: #e9ecef; padding-left: 25px;" data-que_num_questionario="${que.num}" data-que_situacao="${que.situacao}"> 
                            <strong>Questionário : ${que.que_contexto}</strong>
                        </td>
                    </tr>`;
                GestQs.listaUsuariosPontos.push({
                    tempo: Date.now(),
                    usr_num_usuario: 0,
                    eve_num_evento: ev.num,
                    eve_situacao: ev.situacao,
                    que_num_questionario: que.num,
                    que_contexto: que.que_contexto,
                    que_situacao: que.situacao,
                    usr_cpf: "",
                    usr_nome: "",
                    usr_email: "",
                    usr_situacao: "",
                    eve_nome: ev.nome,
                    pontuacao: 0
                });

                // Participantes do Questionário
                que.participantes.forEach(q => {
                    tabela += `
                        <tr>
                            <td class="list-group-item" style="padding-left: 40px;"
                                data-eve_num_evento="${q.eve_num_evento}"
                                data-eve_situacao="${q.eve_situacao}"
                                data-que_num_questionario="${q.que_num_questionario}"
                                data-que_situacao="${q.que_situacao}"
                                data-usr_num_usuario="${q.usr_num_usuario}"
                                data-usr_cpf="${q.usr_cpf}"
                                data-usr_nome="${q.usr_nome}"
                                data-usr_situacao="${q.usr_situacao}"
                            >
                                ${q.usr_cpf} - ${q.usr_nome}<br>Pontuação: ${q.pontuacao}
                            </td>
                        </tr>`;
                    GestQs.listaUsuariosPontos.push({
                        tempo: q.usr_num_usuario || Date.now(),
                        usr_num_usuario: q.usr_num_usuario || 0,
                        eve_num_evento: ev.num,
                        eve_situacao: ev.situacao,
                        que_num_questionario: que.num,
                        que_contexto: que.que_contexto,
                        que_situacao: que.situacao,
                        usr_cpf: q.usr_cpf || "",
                        usr_nome: q.usr_nome || "",
                        usr_email: q.usr_email || "",
                        usr_situacao: q.usr_situacao || "",
                        eve_nome: ev.nome || "",
                        pontuacao: q.pontuacao || 0
                    });
                });
            });
        });

        tabela += '</table>';
        $('#usuarios-pontos').html(tabela);
        return GestQs.listaUsuariosPontos;
    };

    function processDataForTable(data) {
        return data.map(item => {
            // Validate required fields
            // if (!item.pim_mes_referencia || !item.pim_ano_referencia) {
            //     console.warn('Dados incompletos para criar "mes_ano":', item);
            // }
            // Format "mes_ano"
            const mesAno = 0;

            // Return the transformed object
            return {
                ...item, // Keep all original fields
                mes_ano: mesAno, // Add the formatted "mes_ano" field
                tempo: item.usr_num_usuario || Date.now(), // Default to '0,00' if missing 
            };
        });
    }

    export function fetchDataAndInitializeTable() {
        console.log('Iniciando busca de dados da API...');
        var dadosForm = $('form[name="formRelPontuacao"]').serializeArray();

        var jqxhr = $.post('/Relpontuacao/ListaPonto', dadosForm, function (json) {
            console.log("success");
            console.table(json);
            console.log('Dados recebidos da API:', json.lista);
            // Validate the data
            // if (!Array.isArray(json.lista)) {
            //     console.error('Os dados retornados pela API não são válidos.');
            //     alert('Erro ao carregar os dados. Verifique o console para mais detalhes.');
            //     return;
            // }
            if (json.qtd > 0) {
                if (json.sucesso) {
                    // Initialize the DataTable
                    // Process the data
                    if (json.lista && json.lista.length > 0) {
                        $('input[name="busca"]').val('');
                        $('input[name="buscaLimpa"]').val('');
                        $('#content-table').css('display', 'block');
                        $('#content-table').css('width', '100%');
                        GestQs.dadosDaTabela = processDataForTable(json.lista);
                        console.table(GestQs.dadosDaTabela);
                        // console.log('Dados processados para o DataTable:', dadosDaTabela);
                        let listaUsuariosPontos = gerarHTML(json.lista);
                        console.table(listaUsuariosPontos);

                        // initializeDataTable(dadosDaTabela);

                        $.when(initializeDataTable(listaUsuariosPontos, _ano, _mes, 100)).then(function (data, textStatus, jqXHR) {
                            // $('input.monet').maskMoney({ prefix: '', allowNegative: true, thousands: '.', decimal: ',', affixesStay: false });
                            // if ($('input[name="DetalhaBcPorEvento"]').val() === 'sim') {
                            //     $('button[name="gerar-novo-item"]').attr('disabled', 'disabled');
                            //     $('button[name="btnSalvarItemMovimento"]').attr('disabled', 'disabled');
                            //     //$('button[name="btnAtualizarResumo"]').attr('disabled', 'disabled');
                            //     $('input').attr('readonly', 'readonly');
                            //     $('input').prop('readonly', true);
                            //     $('#table-lista-itens').DataTable().rows().deselect();
                            // }
                            console.log('Pontuação carregada');
                            // GestQs.totValoresItens();
                            // $('.dt-search').append('<button type="button" name="gerar-novo-item" id="gerar-novo-item" class="btn btn-light"><i class="fa-solid fa-plus text-success"></i></button>');
                        });
                    } else {
                        initializeDataTable([], _ano, _mes, 1);
                    }

                } else {
                    initializeDataTable([], _ano, _mes, 1);
                }
            } else {
                ScriptsConfig.swalconfirmeActionAlertaWarning.fire({
                    icon: 'info',
                    title: '<code style="color:#045C99;font-size:22px;">Olá</code><br>',
                    imageUrl: "/Content/img/logo-ageprev-ms-origin.png",
                    imageWidth: 300,
                    width: 1080,
                    height: 700,
                    html: '<span style="color:#045C99;font-size:20px;">Não há pontuações de usuários para este questionário! </b></span>'
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
                    } else {
                    }
                });
            }


        }, "json").done(function (data) {
            console.log("done success");
            console.table(data);
            // console.table(data.lista);
        }).fail(function (_XMLHttpRequest_, textStatus, errorThrown) {
            console.log("error");
            console.log(_XMLHttpRequest_); console.log(textStatus); console.log(errorThrown);
            // ScriptsConfig.failFunctionAjax(_XMLHttpRequest_, textStatus, errorThrown);
        }).always(function (data) {
            console.log("finished");
            console.table(data);
        });

        // $.ajax({
        //     url: '/Relpontuacao/Lista', data: dadosForm,
        //     type: 'post', dataType: 'json', cache: false, async: true,
        //     statusCode: { 403: function () { console.log('forbidden'); }, 404: function () { console.log('page not found'); }, 415: function () { console.log('Unsupported Media Type'); }, 405: function () { console.log('method not allowed'); }, 500: function () { console.log('internal server error'); }, 502: function () { console.log('Bad Gateway'); } },
        //     success: function (json, textStatus, jqXHR) {
        //         console.log(json);
        //         console.log('Dados recebidos da API:', json.lista);
        //         // Validate the data
        //         if (!Array.isArray(json.lista)) {
        //             console.error('Os dados retornados pela API não são válidos.');
        //             alert('Erro ao carregar os dados. Verifique o console para mais detalhes.');
        //             return;
        //         }

        //         if (json.sucesso) {
        //             // Initialize the DataTable
        //             // Process the data
        //             GestQs.dadosDaTabela = processDataForTable(json.lista);
        //             console.table(GestQs.dadosDaTabela);
        //             // console.log('Dados processados para o DataTable:', dadosDaTabela);
        //             let listaUsuariosPontos = gerarHTML(json.lista);
        //             console.table(listaUsuariosPontos);

        //             //initializeDataTable(dadosDaTabela);

        //             $.when(initializeDataTable(listaUsuariosPontos, _ano, _mes, 100)).then(function (data, textStatus, jqXHR) {
        //                 // $('input.monet').maskMoney({ prefix: '', allowNegative: true, thousands: '.', decimal: ',', affixesStay: false });
        //                 // if ($('input[name="DetalhaBcPorEvento"]').val() === 'sim') {
        //                 //     $('button[name="gerar-novo-item"]').attr('disabled', 'disabled');
        //                 //     $('button[name="btnSalvarItemMovimento"]').attr('disabled', 'disabled');
        //                 //     //$('button[name="btnAtualizarResumo"]').attr('disabled', 'disabled');
        //                 //     $('input').attr('readonly', 'readonly');
        //                 //     $('input').prop('readonly', true);
        //                 //     $('#table-lista-itens').DataTable().rows().deselect();
        //                 // }
        //                 console.log('Pontuação carregada');
        //                 // GestQs.totValoresItens();
        //                 // $('.dt-search').append('<button type="button" name="gerar-novo-item" id="gerar-novo-item" class="btn btn-light"><i class="fa-solid fa-plus text-success"></i></button>');
        //             });

        //         } else {
        //             // $.when(geraTbodyItens()).then(function (data, textStatus, jqXHR) {
        //             //  datatable_lista.draw();
        //             //  datatable_lista.order([[0, 'asc']]).draw(false);
        //             // });
        //         }

        //     },
        //     error: function (jqXHR, textStatus, errorThrown) {
        //         console.log(jqXHR);
        //         console.error('Erro ao carregar os dados da API:', textStatus, errorThrown);
        //         alert(`Erro ao carregar os dados. Detalhes: ${textStatus}`);
        //     }
        // });
    }

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

    export function eventoQuestionarioPontosPorUsuario(eve_num_evento, que_num_questionario) {
        $('input[name="eve_num_evento"]').val(eve_num_evento);
        $('input[name="que_num_questionario"]').val(que_num_questionario);
        GestQs.fetchDataAndInitializeTable();
    }

    export let listaBusca = GestQs.listaUsuariosPontos;

    export function buscarUsuarioaNoRelatorio() {
        const normalizeStr = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        let busca: string = normalizeStr($('input[name="buscaLimpa"]').val() as string || '');

        // Keep hidden busca input in sync
        $('input[name="busca"]').val($('input[name="buscaLimpa"]').val() as string || '');

        let lista = GestQs.listaUsuariosPontos || [];
        GestQs.listaBusca = lista;

        if (busca.length > 0) {
            const cleanBusca = busca.replace(/[.\-/]/g, '');
            const matchingParticipants = lista.filter(item => {
                if (!item || Number(item.usr_num_usuario) === 0) return false;

                const rawCpf = String(item.usr_cpf || '').toLowerCase();
                let maskedCpf = '';
                if (rawCpf.length === 11) {
                    maskedCpf = "***." + rawCpf.substring(3, 6) + "." + rawCpf.substring(6, 9) + "-**";
                } else {
                    maskedCpf = rawCpf;
                }

                const cpfMatches = rawCpf.includes(busca) || rawCpf.includes(cleanBusca) || maskedCpf.includes(busca);
                const nomeMatches = normalizeStr(item.usr_nome || '').includes(busca);
                const emailMatches = normalizeStr(item.usr_email || '').includes(busca);

                const rawPontuacao = (item.pontuacao !== undefined && item.pontuacao !== null) ? item.pontuacao.toString() : '';
                const formattedPontuacao = rawPontuacao.replace('.', ',');
                const pontuacaoMatches = rawPontuacao.includes(busca) || formattedPontuacao.includes(busca);

                return cpfMatches || nomeMatches || emailMatches || pontuacaoMatches;
            });

            const matchingEventIds = new Set<number>();
            const matchingQueKeys = new Set<string>();

            matchingParticipants.forEach(p => {
                if (p) {
                    matchingEventIds.add(p.eve_num_evento);
                    matchingQueKeys.add(`${p.eve_num_evento}_${p.que_num_questionario}`);
                }
            });

            GestQs.listaBusca = lista.filter(item => {
                if (!item) return false;
                // if (Number(item.usr_num_usuario) === 0) {
                //     if (item.que_num_questionario === 0) {
                //         return matchingEventIds.has(item.eve_num_evento);
                //     } else {
                //         return matchingQueKeys.has(`${item.eve_num_evento}_${item.que_num_questionario}`);
                //     }
                // } else {
                const rawCpf = String(item.usr_cpf || '').toLowerCase();
                let maskedCpf = '';
                if (rawCpf.length === 11) {
                    maskedCpf = "***." + rawCpf.substring(3, 6) + "." + rawCpf.substring(6, 9) + "-**";
                } else {
                    maskedCpf = rawCpf;
                }

                const cpfMatches = rawCpf.includes(busca) || rawCpf.includes(cleanBusca) || maskedCpf.includes(busca);
                const nomeMatches = normalizeStr(item.usr_nome || '').includes(busca);
                const emailMatches = normalizeStr(item.usr_email || '').includes(busca);

                const rawPontuacao = (item.pontuacao !== undefined && item.pontuacao !== null) ? item.pontuacao.toString() : '';
                const formattedPontuacao = rawPontuacao.replace('.', ',');
                const pontuacaoMatches = rawPontuacao.includes(busca) || formattedPontuacao.includes(busca);

                return cpfMatches || nomeMatches || emailMatches || pontuacaoMatches;
                //}
            });
            console.table(GestQs.listaBusca);
        }
    }

    export function processDadosEventosForTable(data) {
        GestQs.eventos = [];
        data.forEach(q => {
            GestQs.eventos.push({
                tempo: (q.eve_num_evento || Date.now),
                eve_num_evento: Number(q.eve_num_evento) || 0,
                eve_nome: q.eve_nome || '',
                eve_descricao: q.eve_descricao || '',
                eve_local: q.eve_local || '',
                eve_municipio: q.eve_municipio || '',
                eve_dt_inicio: q.eve_dt_inicio || '',
                eve_dt_fim: q.eve_dt_fim || '',
                eve_dt_inclusao: q.eve_dt_inclusao || '',
                eve_situacao: q.eve_situacao || ''
            });
        });
        return GestQs.eventos;
    }


    export function processDadosQuestionariosForTable(data) {
        GestQs.questionariosDtos = [];
        data.forEach(q => {
            GestQs.questionariosDtos.push({
                tempo: (q.que_num_questionario || Date.now),
                eve_num_evento: Number(q.eve_num_evento) || 0,
                que_num_questionario: Number(q.que_num_questionario) || 0,
                que_contexto: q.que_contexto || '',
                que_publico_alvo: q.que_publico_alvo || '',
                que_nota_minima: Number(q.que_nota_minima) || 0,
                que_dt_inclusao: q.que_dt_inclusao || '',
                que_situacao: q.que_situacao || ''
            });
        });
        return GestQs.questionariosDtos;
    }

    export function initializeDataTableEventos(data, mes, ano, pageLength) {

        // console.log('Inicializando DataTable...');
        if (!Array.isArray(data)) {
            console.error('Os dados recebidos não são válidos:', data);
            data = [];
        }

        // Se já existe uma instância anterior, destruir de forma segura
        try {
            if ($.fn && $.fn.dataTable && $.fn.dataTable.isDataTable && $.fn.dataTable.isDataTable('#table-lista-eventos')) {
                try {
                    const existing = $('#table-lista-eventos').DataTable();
                    existing.clear && existing.clear();
                    existing.destroy && existing.destroy();
                } catch (err) {
                    console.warn('Falha ao destruir DataTable via API:', err);
                }
                // Remover elementos remanescentes que o plugin pode ter criado
                try { $('.dt-buttons').remove(); } catch (e) { }
                try { $('.fixedHeader-floating').remove(); } catch (e) { }
                try { $('#table-lista-eventos_wrapper').remove(); } catch (e) { }
                GestQs.dataTableInstanceEventos = null;
            }
        } catch (e) {
            console.warn('Erro ao verificar/destruir DataTable anterior:', e);
        }

        $('#table-lista-eventos tbody').empty();

        // console.log('Inicializando DataTable com os dados recebidos...');
        GestQs.dataTableInstanceEventos = $('#table-lista-eventos').DataTable({
            data: data,
            paging: true, // Ativa a paginação
            pageLength: pageLength,
            destroy: true,
            fixedHeader: true,
            info: true,
            lengthMenu: [100, 250, 500, 750, 1000],
            dom: 'Bfrtip',
            buttons: [
                {
                    extend: 'excelHtml5', // 'excelHtml5',
                    extension: '.xlsx',
                    header: true,
                    footer: false,
                    autoFilter: false,
                    bom: false,
                    sheetName: 'SigEventos ' + mes + '-de-' + ano,
                    messageTop: 'SigEventos: ' + mes + '/' + ano,
                    text: '<i class="far fa-file-excel text-success fa-lg"></i>'
                    , title: null
                    , filename: function () {
                        return 'SigEventos-mes-' + mes + '-de-' + ano; // + '-' + dt_gerado;
                    },
                    exportOptions: {
                        columns: [0, 1, 3],
                        format: {
                            body: function (data, row, column, node: any) {
                                console.log(data);
                                const $vale = $(data);
                                console.log($vale.filter('.mes_ano').val());

                                switch (column) {
                                    case 0:
                                        // return $(node).find('input').val();
                                        return $(node).find('input[type="text"]').val()?.toString();
                                        break;
                                    case 1:
                                        // return $(node).find('span').text();
                                        return $(node).find('input[type="hidden"]').val();
                                        break;
                                    case 2:
                                        return $(node).find('div').text();
                                        //return $(node).find('input.monet').val()?.toString().replace('.', '').replace('.', '').replace('.', '').replace(',', '.');
                                        break;
                                    case 3:
                                        return $(node).find('span').text();
                                        // return $(node).find('select option:selected').text();
                                        // return $(node).find('input.monetIndice').val()?.toString().replace('.', '').replace('.', '').replace('.', '').replace(',', '.');
                                        break;
                                    case 4:
                                        return $(node).find('button').text();
                                        // return $(node).find('input.monetIndice').val()?.toString().replace('.', '').replace('.', '').replace('.', '').replace(',', '.');
                                        break;
                                    // case 5:
                                    //     return $(node).find('input.monet').val()?.toString().replace('.', '').replace('.', '').replace('.', '').replace(',', '.');
                                    //     break;
                                    // case 6:
                                    //     return $(node).find('input.monet').val()?.toString().replace('.', '').replace('.', '').replace('.', '').replace(',', '.');
                                    //     break;
                                    // case 7:
                                    //     return $(node).find('label.esquer').text() + ' / ' + $(node).find('label.direi').text();
                                    //     break;
                                    // case 8:
                                    //     return $(node).find('label.esquer').text() + ' / ' + $(node).find('label.direi').text();
                                    //     break;
                                    // case 9:
                                    //     return $(node).find('input.monet').val()?.toString().replace('.', '').replace('.', '').replace('.', '').replace(',', '.');
                                    //     break;
                                    // case 10:
                                    //     return $(node).find('input.monet').val()?.toString().replace('.', '').replace('.', '').replace('.', '').replace(',', '.');
                                    //     break;
                                    // case 11:
                                    //     return $(node).find('select option:selected').text();
                                    //     break;
                                    default:
                                        return $(node).find('input[type="text"]').val();
                                }

                            }
                        }
                    }
                    //, orientation: 'portrait'
                    //, exportOptions: { columns: [0, 1, 2, 3, 4]  }
                },
                {
                    extend: 'pdfHtml5',
                    title: null,
                    filename: function () {
                        return 'SigEventos-mes-' + mes + '-de-' + ano; // + '-' + dt_gerado;
                    },
                    text: '<i class="fa-regular fa-file-pdf text-danger fa-lg"></i>',
                    exportOptions: {
                        columns: [0, 1, 3],
                        format: {
                            body: function (data, row, column, node: any) {
                                console.log(data);
                                const $vale = $(data);
                                console.log($vale.filter('.usr_cpf').val());

                                switch (column) {
                                    case 0:
                                        // return $(node).find('input').val();
                                        return $(node).find('input[type="text"]').val()?.toString();
                                        break;
                                    case 1:
                                        // return $(node).find('span').text();
                                        return $(node).find('input[type="hidden"]').val();
                                        break;
                                    case 2:
                                        return $(node).find('div').text();
                                        //return $(node).find('input.monet').val()?.toString().replace('.', '').replace('.', '').replace('.', '').replace(',', '.');
                                        break;
                                    case 3:
                                        return $(node).find('span').text();
                                        // return $(node).find('select option:selected').text();
                                        // return $(node).find('input.monetIndice').val()?.toString().replace('.', '').replace('.', '').replace('.', '').replace(',', '.');
                                        break;
                                    case 4:
                                        return $(node).find('button').text();
                                        // return $(node).find('input.monetIndice').val()?.toString().replace('.', '').replace('.', '').replace('.', '').replace(',', '.');
                                        break;
                                    default:
                                        return $(node).find('input[type="text"]').val();
                                }
                            }
                        }
                    }
                    //Columns to export
                    //exportOptions: {
                    //     columns: [0, 1, 2, 3, 4, 5, 6]
                    //  }
                },
                {
                    extend: 'colvis',
                    autoFilter: true,
                    sheetName: 'colvis',
                    text: '<i class="fas fa-columns text-primary fa-lg"></i>',
                    orientation: 'portrait',
                    customize: function (doc) {
                        /*
                            doc.content[1].table.widths = Array(doc.content[1].table.body[0].length + 1).join('*').split('');
                            var rowCount = doc.content[1].table.body.length;
                            for (i = 0; i < rowCount + 1; i++) {
                                doc.content[1].table.body[i][4].alignment = 'right';
                                doc.content[1].table.body[i][5].alignment = 'right';
                            }
                        */
                    },
                    exportOptions: {
                        columns: [0, 1, 2, 3, 4]
                    }
                }
            ],
            initComplete: function () {
                var api = (this as any).api();
                if (api && api.buttons) {
                    api.buttons([0, 1, 2]).remove();
                }
            },
            lengthChange: true,
            searching: true,
            ordering: true,
            columns: [
                {
                    data: 'eve_num_evento', className: 'editable eve_num_evento',
                    createdCell: function (td, cellData, rowData, row, col) {
                        let accesskey = (rowData.eve_num_evento || Date.now());
                        $(td)
                            .attr('id', `linh[${accesskey}][eve_num_evento]`)
                            .attr('row', row)
                            .attr('col', col)
                            .attr('campo', 'eve_num_evento')
                            .attr('data-eve_num_evento', rowData.eve_num_evento || '0')
                            .attr('data-que_num_questionario', rowData.que_num_questionario || '0')
                            .attr('accesskey', (accesskey));
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            var colorCancel = '';
                            let eve_num_evento = data;
                            let accesskey = (row.eve_num_evento || Date.now());
                            return `
                                    <td  data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}" accesskey="${accesskey}">
                                        <input type="text" class="form-control eve_num_evento"
                                            name="inpu[${accesskey}][eve_num_evento]"
                                            id="inpu[${accesskey}][eve_num_evento]"
                                            data-eve_num_evento="${row.eve_num_evento || 0}" 
                                            data-que_num_questionario="${row.que_num_questionario || 0}"
                                            value="${eve_num_evento || ''}"
                                            accesskey="${accesskey}" style="${colorCancel || ''}"  readonly="readonly" />
                                             
                                    </td>
                            `;

                        }
                        return data;
                    }
                }
                , {
                    data: 'eve_nome', className: 'editable eve_nome',
                    createdCell: function (td, cellData, rowData, row, col) {
                        let accesskey = (rowData.eve_num_evento || Date.now());
                        $(td)
                            .attr('id', `linh[${accesskey}][eve_nome]`)
                            .attr('row', row)
                            .attr('col', col)
                            .attr('campo', 'eve_nome')
                            .attr('data-eve_num_evento', rowData.eve_num_evento || '0')
                            .attr('data-que_num_questionario', rowData.que_num_questionario || '0')
                            .attr('accesskey', accesskey);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            var colorCancel = '';
                            let eve_nome = data;
                            let accesskey = (row.eve_num_evento || Date.now());
                            return `
                                    <td  data-eve_num_evento="${row.eve_num_evento || 0}" accesskey="${accesskey}"
                                        style="width:30%; text-align: left; "
                                    >
                                        <div class="form-group" style="padding:0px 0px 0px 0px;margin: 0px 0px 0px 0px; width:100%; text-align: left;">
                                          
                                            <input type="text" class="form-control eve_nome"
                                                name="inpu[${accesskey}][eve_nome]"
                                                id="inpu[${accesskey}][eve_nome]"
                                                data-eve_num_evento="${row.eve_num_evento || 0}" 
                                                value="${eve_nome || ''}"
                                                accesskey="${accesskey}" style="padding:1px 1px 1px 1px; ${colorCancel || ''}"  readonly="readonly" />
                                        </div>        
                                    </td>
                            `;

                        }
                        return data;
                    }
                }
                , {
                    data: 'eve_descricao', className: 'editable eve_descricao',
                    createdCell: function (td, cellData, rowData, row, col) {
                        let accesskey = (rowData.eve_num_evento || Date.now());
                        $(td)
                            .attr('id', `linh[${accesskey}][eve_descricao]`)
                            .attr('row', row)
                            .attr('col', col)
                            .attr('campo', 'eve_descricao')
                            .attr('data-eve_num_evento', rowData.eve_num_evento || '0')
                            .attr('data-que_num_questionario', rowData.que_num_questionario || '0')
                            .attr('accesskey', accesskey);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            var colorCancel = '';
                            let eve_descricao = data;
                            let accesskey = (row.eve_num_evento || Date.now());
                            return `
                                    <td  data-eve_num_evento="${row.eve_num_evento || 0}" accesskey="${accesskey}">
                                        <input type="text" class="form-control eve_descricao"
                                            name="inpu[${accesskey}][eve_descricao]"
                                            id="inpu[${accesskey}][eve_descricao]"
                                            data-eve_num_evento="${row.eve_num_evento || 0}"
                                            value="${eve_descricao || ''}"
                                            accesskey="${accesskey}" style="padding:1px 1px 1px 1px; ${colorCancel || ''}"  readonly="readonly" />
                                             
                                    </td>
                            `;

                        }
                        return data;
                    }
                }
                , {
                    data: 'eve_local', className: 'editable eve_local',
                    createdCell: function (td, cellData, rowData, row, col) {
                        let accesskey = (rowData.eve_num_evento || Date.now());
                        $(td)
                            .attr('id', `linh[${accesskey}][eve_local]`)
                            .attr('row', row)
                            .attr('col', col)
                            .attr('campo', 'eve_local')
                            .attr('data-eve_num_evento', rowData.eve_num_evento || '0')
                            .attr('accesskey', accesskey);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            var colorCancel = '';
                            let eve_local = data;
                            let accesskey = (row.eve_num_evento || Date.now());
                            return `
                                    <td  data-eve_num_evento="${row.eve_num_evento || 0}" accesskey="${accesskey}">
                                        <input type="text" class="form-control eve_local"
                                            name="inpu[${accesskey}][eve_local]"
                                            id="inpu[${accesskey}][eve_local]"
                                            data-eve_num_evento="${row.eve_num_evento || 0}"
                                            value="${eve_local || ''}"
                                            accesskey="${accesskey}" style="padding:1px 1px 1px 1px; ${colorCancel || ''}"  readonly="readonly" />
                                             
                                    </td>
                            `;

                        }
                        return data;
                    }
                }
                , {
                    data: 'eve_municipio', className: 'editable eve_municipio',
                    createdCell: function (td, cellData, rowData, row, col) {
                        let accesskey = (rowData.eve_num_evento || Date.now());
                        $(td)
                            .attr('id', `linh[${accesskey}][eve_municipio]`)
                            .attr('row', row)
                            .attr('col', col)
                            .attr('campo', 'eve_municipio')
                            .attr('data-eve_num_evento', rowData.eve_num_evento || '0')
                            .attr('accesskey', accesskey);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            var colorCancel = '';
                            let eve_municipio = data;
                            let accesskey = (row.eve_num_evento || Date.now());
                            return `
                                    <td  data-eve_num_evento="${row.eve_num_evento || 0}" accesskey="${accesskey}">
                                        <input type="text" class="form-control eve_municipio"
                                            name="inpu[${accesskey}][eve_municipio]"
                                            id="inpu[${accesskey}][eve_municipio]"
                                            data-eve_num_evento="${row.eve_num_evento || 0}"
                                            value="${eve_municipio || ''}"
                                            accesskey="${accesskey}" style="padding:1px 1px 1px 1px; ${colorCancel || ''}"  readonly="readonly" />
                                             
                                    </td>
                            `;

                        }
                        return data;
                    }
                }
                , {
                    data: 'eve_dt_inicio', className: 'editable eve_dt_inicio',
                    createdCell: function (td, cellData, rowData, row, col) {
                        let accesskey = (rowData.eve_num_evento || Date.now());
                        $(td)
                            .attr('id', `linh[${accesskey}][eve_dt_inicio]`)
                            .attr('row', row)
                            .attr('col', col)
                            .attr('campo', 'eve_dt_inicio')
                            .attr('data-eve_num_evento', rowData.eve_num_evento || '0')
                            .attr('accesskey', accesskey);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            var colorCancel = '';
                            let eve_dt_inicio = data && data.length >= 10 ? data.substr(8, 2) + '/' + data.substr(5, 2) + '/' + data.substr(0, 4) : '';
                            let accesskey = (row.eve_num_evento || Date.now());
                            return `
                                    <td  data-eve_num_evento="${row.eve_num_evento || 0}" accesskey="${accesskey}"
                                        style="width:135px; max-width:135px; text-align: center; "
                                    >
                                        <div class="form-group" style="padding:0px 0px 0px 0px;margin: 0px 0px 0px 0px; width:130px; max-width:130px; text-align: center;">
                                            <input type="text" class="form-control eve_dt_inicio"
                                                name="inpu[${accesskey}][eve_dt_inicio]"
                                                id="inpu[${accesskey}][eve_dt_inicio]"
                                                data-eve_num_evento="${row.eve_num_evento || 0}"
                                                value="${eve_dt_inicio || ''}"
                                                accesskey="${accesskey}" style="padding:1px 1px 1px 1px; text-align: center; ${colorCancel || ''}"  readonly="readonly" />
                                        </div>     
                                    </td>
                            `;

                        }
                        return data;
                    }
                }
                , {
                    data: 'eve_dt_fim', className: 'editable eve_dt_fim',
                    createdCell: function (td, cellData, rowData, row, col) {
                        let accesskey = (rowData.eve_num_evento || Date.now());
                        $(td)
                            .attr('id', `linh[${accesskey}][eve_dt_fim]`)
                            .attr('row', row)
                            .attr('col', col)
                            .attr('campo', 'eve_dt_fim')
                            .attr('data-eve_num_evento', rowData.eve_num_evento || '0')
                            .attr('accesskey', accesskey);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            var colorCancel = '';
                            let eve_dt_fim = data && data.length >= 10 ? data.substr(8, 2) + '/' + data.substr(5, 2) + '/' + data.substr(0, 4) : '';
                            let accesskey = (row.eve_num_evento || Date.now());
                            return `
                                    <td  data-eve_num_evento="${row.eve_num_evento || 0}" accesskey="${accesskey}"
                                        style="width:135px; max-width:135px; text-align: center; "
                                    >
                                        <div class="form-group" style="padding:0px 0px 0px 0px;margin: 0px 0px 0px 0px; width:130px; max-width:130px; text-align: center;">
                                            <input type="text" class="form-control eve_dt_fim"
                                                name="inpu[${accesskey}][eve_dt_fim]"
                                                id="inpu[${accesskey}][eve_dt_fim]"
                                                data-eve_num_evento="${row.eve_num_evento || 0}"
                                                value="${eve_dt_fim || ''}"
                                                accesskey="${accesskey}" style="padding:1px 1px 1px 1px; text-align: center; ${colorCancel || ''}"  readonly="readonly" />
                                        </div>      
                                    </td>
                            `;

                        }
                        return data;
                    }
                }
                , {
                    data: 'eve_dt_inclusao', className: 'editable eve_dt_inclusao',
                    createdCell: function (td, cellData, rowData, row, col) {
                        let accesskey = (rowData.eve_num_evento || Date.now());
                        $(td)
                            .attr('id', `linh[${accesskey}][eve_dt_inclusao]`)
                            .attr('row', row)
                            .attr('col', col)
                            .attr('campo', 'eve_dt_inclusao')
                            .attr('data-eve_num_evento', rowData.eve_num_evento || '0')
                            .attr('accesskey', accesskey);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            var colorCancel = '';
                            let eve_dt_inclusao = data && data.length >= 10 ? data.substr(8, 2) + '/' + data.substr(5, 2) + '/' + data.substr(0, 4) : '';
                            let accesskey = (row.eve_num_evento || Date.now());
                            return `
                                    <td  data-eve_num_evento="${row.eve_num_evento || 0}" accesskey="${accesskey}"
                                        style="width:140px; max-width:140px; text-align: center; "
                                    >
                                        <div class="form-group" style="padding:0px 0px 0px 0px;margin: 0px 0px 0px 0px; width:80px; max-width:80px;text-align: center;">
                                            <input type="text" class="form-control eve_dt_inclusao"
                                                name="inpu[${accesskey}][eve_dt_inclusao]"
                                                id="inpu[${accesskey}][eve_dt_inclusao]"
                                                data-eve_num_evento="${row.eve_num_evento || 0}"
                                                value="${eve_dt_inclusao || ''}"
                                                accesskey="${accesskey}" style="padding:1px 1px 1px 1px; text-align: center; ${colorCancel || ''}"  readonly="readonly" />
                                        </div>         
                                    </td>
                            `;

                        }
                        return data;
                    }
                }
                , {
                    data: 'eve_situacao', className: 'editable eve_situacao',
                    createdCell: function (td, cellData, rowData, row, col) {
                        let accesskey = (rowData.eve_num_evento || Date.now());
                        $(td)
                            .attr('id', `linh[${accesskey}][eve_situacao]`)
                            .attr('row', row)
                            .attr('col', col)
                            .attr('campo', 'eve_situacao')
                            .attr('data-eve_num_evento', rowData.eve_num_evento || '0')
                            .attr('accesskey', accesskey);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            var colorCancel = '';
                            let eve_situacao = data;
                            let accesskey = (row.eve_num_evento || Date.now());
                            return `
                                    <td  data-eve_num_evento="${row.eve_num_evento || 0}" accesskey="${accesskey}"
                                        style="width:80px; max-width:80px; text-align: center; "
                                    >
                                        <div class="form-group" style="padding:0px 0px 0px 0px;margin: 0px 0px 0px 0px; width:auto;text-align: center;">
                                            <input type="text" class="form-control eve_situacao"
                                                name="inpu[${accesskey}][eve_situacao]"
                                                id="inpu[${accesskey}][eve_situacao]"
                                                data-eve_num_evento="${row.eve_num_evento || 0}" 
                                                value="${eve_situacao || ''}"
                                                accesskey="${accesskey}" style="padding:1px 1px 1px 1px; text-align: center;${colorCancel || ''}"  readonly="readonly" />
                                        </div>
                                    </td>
                            `;

                        }
                        return data;
                    }
                }
                , {
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        let accesskey = (rowData.eve_num_evento || Date.now());
                        $(td)
                            .attr('id', `linh[${accesskey}][editar]`)
                            .attr('row', row)
                            .attr('col', col)
                            .attr('campo', 'editar')
                            .attr('data-eve_num_evento', rowData.eve_num_evento || '0')
                            .attr('accesskey', accesskey);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            let accesskey = (row.eve_num_evento || Date.now());

                            return `
                                <td data-eve_num_evento="${row.eve_num_evento || 0}"  accesskey="${accesskey}" 
                                    style="width:80px; max-width:80px; text-align: center; "
                                > 
                                    <div class="form-group" style="padding-bottom:0px;margin-bottom: 2px;text-align: center;">
                                        
                                        <button type="button" class="btn btn-light btn-editar-lista-questionarios" style="padding:1px 10px 1px 10px; "
                                            data-eve="${row.eve_num_evento}"  title="Editar Questionários">
                                            <span accesskey="${accesskey}" id="inpu[${accesskey}][editar]" style="" />
                                                <i class="fa-regular fa-rectangle-list text-info fa-lg"></i>
                                            </span>
                                        </button>
                                     
                                    </div>
                                </td>
                            `;


                        }
                        return data;
                    },
                    orderable: false
                }
            ],
            language: {
                url: 'https://cdn.datatables.net/plug-ins/1.13.6/i18n/pt-BR.json'
            },
            columnDefs: [
                { targets: [1, 2, 3, 4, 5, 6, 8, 9], visible: true }, { targets: [0, 7], visible: false }
            ],
            order: [[1, 'asc']],
            autoFill: true
        }).draw();

        // console.log('DataTable inicializado com sucesso.');
    }


    export function gerarEventosQuestionarioHTML(lista) {
        GestQs.listaEventos = [];

        let tabela: string = '<table class="table table-striped">';
        GestQs.eve_num_evento = Number($('input[name="eve_num_evento"]').val()?.toString() ?? '0');
        GestQs.que_num_questionario = Number($('input[name="que_num_questionario"]').val()?.toString() ?? '0');

        lista.forEach(q => {
            GestQs.listaEventos.push({
                tempo: (q.eve_num_evento || 0) + '_' + (q.que_num_questionario || 0),
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
                que_nota_minima: Number(q.que_nota_minima) || 0,
                que_dt_inclusao: q.que_dt_inclusao || '',
                que_situacao: q.que_situacao || ''
            });
            let cab_eve_descricao: string = q.eve_descricao.toString();
            let descri: string = ((cab_eve_descricao.length >= 100) ? cab_eve_descricao.substring(0, 100) + '<span class="text-danger" style="cursor:pointer;"> ... Saiba mais ... </span>' : cab_eve_descricao);
            tabela += `
                <tr>
                    <td class="list-group-item" accesskey="${q.eve_num_evento || 0}_${q.que_num_questionario || 0}"
                       onclick="javascript:GestQs.eventoQuestionarioPontosPorUsuario(${q.eve_num_evento || 0},${q.que_num_questionario || 0})"  style="text-align:center;cursor:pointer;" >
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
                                <h5 class="mb-4 cab_eve_descricao" id="eve[${q.eve_num_evento || 0}][${q.que_num_questionario || 0}][cab_eve_descricao]"
                                 onclick="javascript:GestQs.eventoDescricao(${q.eve_num_evento || 0},${q.que_num_questionario || 0})" style="color:#033E66;">${descri || ''}</h5>
                                <h5 class="mb-4 que_contexto" id="eve[${q.eve_num_evento || 0}][${q.que_num_questionario || 0}][que_contexto]" style="color:#033E66;">Questionário: ${q.que_contexto || ''}</h5>
                    </td>
                </tr>`;

            GestQs.eve_num_evento = (q.eve_num_evento !== null && q.eve_num_evento > 0) ? q.eve_num_evento : GestQs.eve_num_evento;
            GestQs.que_num_questionario = (q.que_num_questionario !== null && q.que_num_questionario > 0) ? q.que_num_questionario : GestQs.que_num_questionario;
            $('input[name="eve_num_evento"]').val(GestQs.eve_num_evento);
            $('input[name="que_num_questionario"]').val(GestQs.que_num_questionario);
        });



        tabela += '</table>';
        $('#eventos-questionario').html(tabela);

        return GestQs.listaEventos;
    }

    export function carregarEventos() {
        var jqxhr = $.post("/Gestao/ObterEventos", {}, function (data) {
            console.log("success");
            if (data.sucesso) {
                if (data.eventos != null && data.eventos.length > 0) {

                    let lstEventos = processDadosEventosForTable(data.eventos);

                    gerarEventosQuestionarioHTML(lstEventos);

                    GestQs.initializeDataTableEventos(lstEventos, GestQs._mes, GestQs._ano, 100);

                    // let evento: any = data.lista[0];
                    // let cab_eve_descricao: string = evento.eve_descricao.toString();
                    // $('#cab_eve_nome').text(evento.eve_nome);
                    // $('#cab_eve_descricao').empty().html((cab_eve_descricao.length >= 100) ? cab_eve_descricao.substring(0, 100) + '<span class="text-danger" style="cursor:pointer;"> ... Saiba mais ... </span>' : cab_eve_descricao);
                    // $('#cab_eve_descricao_hidden').text(cab_eve_descricao);

                } else {
                    ScriptsConfig.swalconfirmeActionAlertaWarning.fire({
                        icon: 'info',
                        title: '<code style="color:#045C99;font-size:22px;">Olá</code><br>',
                        imageUrl: "/Content/img/logo-ageprev-ms-origin.png",
                        imageWidth: 300,
                        width: 1080,
                        height: 700,
                        html: '<span style="color:#045C99;font-size:20px;">Não há eventos vigentes disponíveis para a emissão de relatórios</b></span>',
                        showCancelButton: false,
                        confirmButtonText: "Ok",
                        cancelButtonText: "Não responder o Questionário!",
                        reverseButtons: false,
                        footer: ScriptsConfig.footerAlert,
                        backdrop: true,
                    }).then((result) => {
                        if (result.isConfirmed) {
                            // window.location.href = '/Home/Index';
                        } else {
                            // window.location.href = '/Home/Index';
                        }
                    });
                }

            } else {
                console.log(data);



                // Swal.fire({
                //     icon: "error",
                //     title: "Oops...",
                //     html: data.msg,
                //     footer: '<code>' + data.lista + '</code>'
                // });
                // $('tbody#tbodyListaMov').empty().html('');
            }
        }, "json")
            .done(function (data) {
                if (data !== null) {
                    console.log("second success");
                } else { console.log("dados não encontrado"); }

            })
            .fail(function (_XMLHttpRequest_, textStatus, errorThrown) {
                console.log("error");
                console.log(_XMLHttpRequest_); console.log(textStatus); console.log(errorThrown);
                // ScriptsConfig.failFunctionAjax(_XMLHttpRequest_, textStatus, errorThrown);
            })
            .always(function (data) {
                console.log("finished");
                console.log(data);
                $('#botoes').css('display', 'block')
                //$('.text-end').css('text-align','right !important')
            });
    }

    export function carregarCamposDeEvento(eventosDtos: any) {
        console.log('eventosDtos');
        console.log(eventosDtos);
        // $('input[name="eve_num_evento"]').val(eventosDtos.eve_num_evento);
        // $('input[name="eve_nome"]').val(eventosDtos.eve_nome);
        // $('textarea[name="eve_descricao"]').val(eventosDtos.eve_descricao);
        // $('input[name="eve_local"]').val(eventosDtos.eve_local);
        // $('input[name="eve_municipio"]').val(eventosDtos.eve_municipio);

        // $('input[name="eve_dt_inicio"]').val(((eventosDtos.eve_dt_inicio && eventosDtos.eve_dt_inicio.length >= 10) ? eventosDtos.eve_dt_inicio.substr(8, 2) + '/' + eventosDtos.eve_dt_inicio.substr(5, 2) + '/' + eventosDtos.eve_dt_inicio.substr(0, 4) : ''));
        // $('input[name="eve_dt_fim"]').val(((eventosDtos.eve_dt_fim && eventosDtos.eve_dt_fim.length >= 10) ? eventosDtos.eve_dt_fim.substr(8, 2) + '/' + eventosDtos.eve_dt_fim.substr(5, 2) + '/' + eventosDtos.eve_dt_fim.substr(0, 4) : ''));
        // $('input[name="eve_dt_inclusao"]').val(((eventosDtos.eve_dt_inclusao && eventosDtos.eve_dt_inclusao.length >= 10) ? eventosDtos.eve_dt_inclusao.substr(8, 2) + '/' + eventosDtos.eve_dt_inclusao.substr(5, 2) + '/' + eventosDtos.eve_dt_inclusao.substr(0, 4) : ''));

        // $('select[name="eve_situacao"]').val(eventosDtos.eve_situacao);
    }

    export function initializeDataTableEventosQuestionarios(data: any, mes: string, ano: string, pageLength: number) {

        // console.log('Inicializando DataTable...');
        if (!Array.isArray(data)) {
            console.error('Os dados recebidos não são válidos:', data);
            data = [];
        }

        try {
            if ($.fn && $.fn.dataTable && $.fn.dataTable.isDataTable && $.fn.dataTable.isDataTable('#table-lista-questionario')) {
                try {
                    const existing = $('#table-lista-questionario').DataTable();
                    existing.clear && existing.clear();
                    existing.destroy && existing.destroy();
                } catch (err) {
                    console.warn('Falha ao destruir DataTable via API:', err);
                }
                // Remover elementos remanescentes que o plugin pode ter criado
                try { $('.dt-buttons').remove(); } catch (e) { }
                try { $('.fixedHeader-floating').remove(); } catch (e) { }
                try { $('#table-lista-respostas_wrapper').remove(); } catch (e) { }
                GestQs.dataTableInstanceEventosQuestionarios = null;
            }
        } catch (e) {
            console.warn('Erro ao verificar/destruir DataTable anterior:', e);
        }

        $('#table-lista-questionario tbody').empty();

        // console.log('Inicializando DataTable com os dados recebidos...');
        GestQs.dataTableInstanceEventosQuestionarios = $('#table-lista-questionario').DataTable({
            data: data,
            paging: false, // Ativa a paginação
            pageLength: pageLength,
            destroy: true,
            fixedHeader: true,
            info: false,
            lengthMenu: [100, 250, 500, 750, 1000],
            dom: 'Bfrtip',
            buttons: [
                {
                    extend: 'excelHtml5', // 'excelHtml5',
                    extension: '.xlsx',
                    header: true,
                    footer: false,
                    autoFilter: false,
                    bom: false,
                    sheetName: 'SigEventos ' + mes + '-de-' + ano,
                    messageTop: 'SigEventos: ' + mes + '/' + ano,
                    text: '<i class="far fa-file-excel text-success fa-lg"></i>'
                    , title: null
                    , filename: function () {
                        return 'SigEventos-mes-' + mes + '-de-' + ano; // + '-' + dt_gerado;
                    },
                    exportOptions: {
                        columns: [0, 1, 3],
                        format: {
                            body: function (data, row, column, node: any) {
                                console.log(data);
                                const $vale = $(data);
                                console.log($vale.filter('.mes_ano').val());

                                switch (column) {
                                    case 0:
                                        // return $(node).find('input').val();
                                        return $(node).find('input[type="text"]').val()?.toString();
                                        break;
                                    case 1:
                                        // return $(node).find('span').text();
                                        return $(node).find('input[type="hidden"]').val();
                                        break;
                                    case 2:
                                        return $(node).find('div').text();
                                        //return $(node).find('input.monet').val()?.toString().replace('.', '').replace('.', '').replace('.', '').replace(',', '.');
                                        break;
                                    case 3:
                                        return $(node).find('span').text();
                                        // return $(node).find('select option:selected').text();
                                        // return $(node).find('input.monetIndice').val()?.toString().replace('.', '').replace('.', '').replace('.', '').replace(',', '.');
                                        break;
                                    case 4:
                                        return $(node).find('button').text();
                                        // return $(node).find('input.monetIndice').val()?.toString().replace('.', '').replace('.', '').replace('.', '').replace(',', '.');
                                        break;
                                    // case 5:
                                    //     return $(node).find('input.monet').val()?.toString().replace('.', '').replace('.', '').replace('.', '').replace(',', '.');
                                    //     break;
                                    // case 6:
                                    //     return $(node).find('input.monet').val()?.toString().replace('.', '').replace('.', '').replace('.', '').replace(',', '.');
                                    //     break;
                                    // case 7:
                                    //     return $(node).find('label.esquer').text() + ' / ' + $(node).find('label.direi').text();
                                    //     break;
                                    // case 8:
                                    //     return $(node).find('label.esquer').text() + ' / ' + $(node).find('label.direi').text();
                                    //     break;
                                    // case 9:
                                    //     return $(node).find('input.monet').val()?.toString().replace('.', '').replace('.', '').replace('.', '').replace(',', '.');
                                    //     break;
                                    // case 10:
                                    //     return $(node).find('input.monet').val()?.toString().replace('.', '').replace('.', '').replace('.', '').replace(',', '.');
                                    //     break;
                                    // case 11:
                                    //     return $(node).find('select option:selected').text();
                                    //     break;
                                    default:
                                        return $(node).find('input[type="text"]').val();
                                }

                            }
                        }
                    }
                    //, orientation: 'portrait'
                    //, exportOptions: { columns: [0, 1, 2, 3, 4]  }
                },
                {
                    extend: 'pdfHtml5',
                    title: null,
                    filename: function () {
                        return 'SigEventos-mes-' + mes + '-de-' + ano; // + '-' + dt_gerado;
                    },
                    text: '<i class="fa-regular fa-file-pdf text-danger fa-lg"></i>',
                    exportOptions: {
                        columns: [0, 1, 3],
                        format: {
                            body: function (data, row, column, node: any) {
                                console.log(data);
                                const $vale = $(data);
                                console.log($vale.filter('.usr_cpf').val());

                                switch (column) {
                                    case 0:
                                        // return $(node).find('input').val();
                                        return $(node).find('input[type="text"]').val()?.toString();
                                        break;
                                    case 1:
                                        // return $(node).find('span').text();
                                        return $(node).find('input[type="hidden"]').val();
                                        break;
                                    case 2:
                                        return $(node).find('div').text();
                                        //return $(node).find('input.monet').val()?.toString().replace('.', '').replace('.', '').replace('.', '').replace(',', '.');
                                        break;
                                    case 3:
                                        return $(node).find('span').text();
                                        // return $(node).find('select option:selected').text();
                                        // return $(node).find('input.monetIndice').val()?.toString().replace('.', '').replace('.', '').replace('.', '').replace(',', '.');
                                        break;
                                    case 4:
                                        return $(node).find('button').text();
                                        // return $(node).find('input.monetIndice').val()?.toString().replace('.', '').replace('.', '').replace('.', '').replace(',', '.');
                                        break;
                                    default:
                                        return $(node).find('input[type="text"]').val();
                                }
                            }
                        }
                    }
                    //Columns to export
                    //exportOptions: {
                    //     columns: [0, 1, 2, 3, 4, 5, 6]
                    //  }
                },
                {
                    extend: 'colvis',
                    autoFilter: true,
                    sheetName: 'colvis',
                    text: '<i class="fas fa-columns text-primary fa-lg"></i>',
                    orientation: 'portrait',
                    customize: function (doc) {
                        /*
                            doc.content[1].table.widths = Array(doc.content[1].table.body[0].length + 1).join('*').split('');
                            var rowCount = doc.content[1].table.body.length;
                            for (i = 0; i < rowCount + 1; i++) {
                                doc.content[1].table.body[i][4].alignment = 'right';
                                doc.content[1].table.body[i][5].alignment = 'right';
                            }
                        */
                    },
                    exportOptions: {
                        columns: [0, 1, 2, 3, 4]
                    }
                }
            ],
            initComplete: function () {
                // usa a instância que você já guardou
                var table = GestQs.dataTableInstanceEventosQuestionarios;
                table.buttons([0, 1, 2]).remove();
            },
            lengthChange: true,
            searching: false,
            ordering: true,
            columns: [
                {
                    data: 'eve_num_evento', className: 'editable eve_num_evento',
                    createdCell: function (td, cellData, rowData, row, col) {
                        let accesskey = (rowData.que_num_questionario != null && rowData.que_num_questionario > 0) ? rowData.que_num_questionario : rowData.tempo.toString();
                        $(td)
                            .attr('id', `linh[${accesskey}][eve_num_evento]`)
                            .attr('row', row)
                            .attr('col', col)
                            .attr('campo', 'eve_num_evento')
                            .attr('data-eve_num_evento', rowData.eve_num_evento || '0')
                            .attr('data-que_num_questionario', rowData.que_num_questionario || '0')
                            .attr('accesskey', (accesskey));
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            var colorCancel = '';
                            let eve_num_evento = data;
                            let accesskey = (row.que_num_questionario != null && row.que_num_questionario > 0) ? row.que_num_questionario : row.tempo.toString();
                            return `
                                    <td data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}" 
                                        accesskey="${accesskey}" style="width:80px; max-width:80px; text-align: center; ">
                                        <div class="form-group" style="padding:0px 0px 0px 0px;margin: 0px 0px 0px 0px; width:80px; max-width:80px; text-align: center;">
                                            <input type="text" class="form-control eve_num_evento"
                                                name="inpu[${accesskey}][eve_num_evento]"
                                                id="inpu[${accesskey}][eve_num_evento]"
                                                data-eve_num_evento="${row.eve_num_evento || 0}"
                                                data-que_num_questionario="${row.que_num_questionario || 0}"
                                                value="${eve_num_evento || ''}"
                                                accesskey="${accesskey}" style="padding:1px 1px 1px 1px; text-align: center; ${colorCancel || ''}" readonly="readonly" />
                                         
                                        </div>
                                    </td>
                            `;

                        }
                        return data;
                    }
                }
                , {
                    data: 'que_num_questionario', className: 'editable que_num_questionario',
                    createdCell: function (td, cellData, rowData, row, col) {
                        let accesskey = (rowData.que_num_questionario != null && rowData.que_num_questionario > 0) ? rowData.que_num_questionario : rowData.tempo.toString();
                        $(td)
                            .attr('id', `linh[${accesskey}][que_num_questionario]`)
                            .attr('row', row)
                            .attr('col', col)
                            .attr('campo', 'que_num_questionario')
                            .attr('data-eve_num_evento', rowData.eve_num_evento || '0')
                            .attr('data-que_num_questionario', rowData.que_num_questionario || '0')
                            .attr('accesskey', (accesskey));
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            var colorCancel = '';
                            let que_num_questionario = data;
                            let accesskey = (row.que_num_questionario != null && row.que_num_questionario > 0) ? row.que_num_questionario : row.tempo.toString();
                            return `
                                    <td data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}"
                                        accesskey="${accesskey}" style="width:80px; max-width:80px; text-align: center; ">
                                        <div class="form-group" style="padding:0px 0px 0px 0px;margin: 0px 0px 0px 0px; width:80px; max-width:80px; text-align: center;">
                                            <input type="text" class="form-control que_num_questionario"
                                                name="inpu[${accesskey}][que_num_questionario]"
                                                id="inpu[${accesskey}][que_num_questionario]"
                                                data-eve_num_evento="${row.eve_num_evento || 0}"
                                                data-que_num_questionario="${row.que_num_questionario || 0}"
                                                value="${que_num_questionario || ''}"
                                                accesskey="${accesskey}" style="padding:1px 1px 1px 1px; text-align: center; ${colorCancel || ''}" readonly="readonly" />
                                         
                                        </div>
                                    </td>
                            `;

                        }
                        return data;
                    }
                }
                , {
                    data: 'que_contexto', className: 'editable que_contexto',
                    createdCell: function (td, cellData, rowData, row, col) {
                        let accesskey = (rowData.que_num_questionario != null && rowData.que_num_questionario > 0) ? rowData.que_num_questionario : rowData.tempo.toString();
                        $(td)
                            .attr('id', `linh[${accesskey}][que_contexto]`)
                            .attr('row', row)
                            .attr('col', col)
                            .attr('campo', 'que_contexto')
                            .attr('data-eve_num_evento', rowData.eve_num_evento || '0')
                            .attr('data-que_num_questionario', rowData.que_num_questionario || '0')
                            .attr('accesskey', accesskey);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            var colorCancel = '';
                            let que_contexto = data;
                            let accesskey = (row.que_num_questionario != null && row.que_num_questionario > 0) ? row.que_num_questionario : row.tempo.toString();
                            return `
                                    <td  data-eve_num_evento="${row.eve_num_evento || 0}"  data-que_num_questionario="${row.que_num_questionario || 0}"
                                        accesskey="${accesskey}" style="width: 55%; text-align: left;">
                                        <input type="text" class="form-control que_contexto"
                                            name="inpu[${accesskey}][que_contexto]"
                                            id="inpu[${accesskey}][que_contexto]"
                                            data-eve_num_evento="${row.eve_num_evento || 0}"
                                            data-que_num_questionario="${row.que_num_questionario || 0}"
                                            value="${que_contexto || ''}"
                                            accesskey="${accesskey}" style="text-align: left; ${colorCancel || ''}"  readonly="readonly" />
                                             
                                    </td>
                            `;

                        }
                        return data;
                    }
                }
                , {
                    data: 'que_publico_alvo', className: 'editable que_publico_alvo',
                    createdCell: function (td, cellData, rowData, row, col) {
                        let accesskey = (rowData.que_num_questionario != null && rowData.que_num_questionario > 0) ? rowData.que_num_questionario : rowData.tempo.toString();
                        $(td)
                            .attr('id', `linh[${accesskey}][que_publico_alvo]`)
                            .attr('row', row)
                            .attr('col', col)
                            .attr('campo', 'que_publico_alvo')
                            .attr('data-eve_num_evento', rowData.eve_num_evento || '0')
                            .attr('data-que_num_questionario', rowData.que_num_questionario || '0')
                            .attr('accesskey', accesskey);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            var colorCancel = '';
                            let que_publico_alvo = data;
                            let accesskey = (row.que_num_questionario != null && row.que_num_questionario > 0) ? row.que_num_questionario : row.tempo.toString();
                            return `
                                    <td  data-eve_num_evento="${row.eve_num_evento || 0}"  data-que_num_questionario="${row.que_num_questionario || 0}"
                                        accesskey="${accesskey}" style="width: 55%; text-align: left;">
                                        <input type="text" class="form-control que_publico_alvo"
                                            name="inpu[${accesskey}][que_publico_alvo]"
                                            id="inpu[${accesskey}][que_publico_alvo]"
                                            data-eve_num_evento="${row.eve_num_evento || 0}"
                                            data-que_num_questionario="${row.que_num_questionario || 0}"
                                            value="${que_publico_alvo || ''}"
                                            accesskey="${accesskey}" style="text-align: left; ${colorCancel || ''}"  readonly="readonly" />
                                             
                                    </td>
                            `;

                        }
                        return data;
                    }
                }
                , {
                    data: 'que_nota_minima', className: 'editable que_nota_minima',
                    createdCell: function (td, cellData, rowData, row, col) {
                        let accesskey = (rowData.que_num_questionario != null && rowData.que_num_questionario > 0) ? rowData.que_num_questionario : rowData.tempo.toString();
                        $(td)
                            .attr('id', `linh[${accesskey}][que_nota_minima]`)
                            .attr('row', row)
                            .attr('col', col)
                            .attr('campo', 'que_nota_minima')
                            .attr('data-eve_num_evento', rowData.eve_num_evento || '0')
                            .attr('data-que_num_questionario', rowData.que_num_questionario || '0')
                            .attr('accesskey', accesskey);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            var colorCancel = '';
                            let que_nota_minima = data;
                            let accesskey = (row.que_num_questionario != null && row.que_num_questionario > 0) ? row.que_num_questionario : row.tempo.toString();
                            return `
                                    <td  data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}"
                                        accesskey="${accesskey}"  style="width: 80px; text-align: center;">
                                        <input type="text" class="form-control que_nota_minima"
                                            name="inpu[${accesskey}][que_nota_minima]"
                                            id="inpu[${accesskey}][que_nota_minima]"
                                            data-eve_num_evento="${row.eve_num_evento || 0}"
                                            data-que_num_questionario="${row.que_num_questionario || 0}"
                                            value="${que_nota_minima || ''}"
                                            accesskey="${accesskey}" style="text-align:center; ${colorCancel || ''}"  readonly="readonly" />
                                             
                                    </td>
                            `;

                        }
                        return data;
                    }
                }
                , {
                    data: 'que_dt_inclusao', className: 'editable que_dt_inclusao',
                    createdCell: function (td, cellData, rowData, row, col) {
                        let accesskey = (rowData.que_num_questionario != null && rowData.que_num_questionario > 0) ? rowData.que_num_questionario : rowData.tempo.toString();
                        $(td)
                            .attr('id', `linh[${accesskey}][que_dt_inclusao]`)
                            .attr('row', row)
                            .attr('col', col)
                            .attr('campo', 'que_dt_inclusao')
                            .attr('data-eve_num_evento', rowData.eve_num_evento || '0')
                            .attr('data-que_num_questionario', rowData.que_num_questionario || '0')
                            .attr('accesskey', accesskey);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            var colorCancel = '';
                            let dt_incl = data;
                            let que_dt_inclusao = (dt_incl && dt_incl.length >= 10) ? dt_incl.substr(8, 2) + '/' + dt_incl.substr(5, 2) + '/' + dt_incl.substr(0, 4) : '';
                            let accesskey = (row.que_num_questionario != null && row.que_num_questionario > 0) ? row.que_num_questionario : row.tempo.toString();
                            return `
                                <td  data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}"
                                    accesskey="${accesskey}"  style="width: 80px; text-align: center;">
                                    <input type="text" class="form-control que_dt_inclusao"
                                        name="inpu[${accesskey}][que_dt_inclusao]"
                                        id="inpu[${accesskey}][que_dt_inclusao]"
                                        data-eve_num_evento="${row.eve_num_evento || 0}"
                                        data-que_num_questionario="${row.que_num_questionario || 0}"
                                        value="${que_dt_inclusao || ''}"
                                        accesskey="${accesskey}" style="text-align:center; ${colorCancel || ''}"  readonly="readonly" />
                                </td>
                            `;
                        }
                        return data;
                    }
                }
                , {
                    data: 'que_situacao', className: 'editable que_situacao',
                    createdCell: function (td, cellData, rowData, row, col) {
                        let accesskey = (rowData.que_num_questionario != null && rowData.que_num_questionario > 0) ? rowData.que_num_questionario : rowData.tempo.toString();
                        $(td)
                            .attr('id', `linh[${accesskey}][que_situacao]`)
                            .attr('row', row)
                            .attr('col', col)
                            .attr('campo', 'que_situacao')
                            .attr('data-eve_num_evento', rowData.eve_num_evento || '0')
                            .attr('data-que_num_questionario', rowData.que_num_questionario || '0')
                            .attr('accesskey', accesskey);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            var colorCancel = '';
                            let que_situacao = data;
                            let accesskey = (row.que_num_questionario != null && row.que_num_questionario > 0) ? row.que_num_questionario : row.tempo.toString();
                            return `
                                    <td  data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}"
                                        accesskey="${accesskey}"  style="width: 80px; text-align: center;">
                                        <input type="text" class="form-control que_situacao"
                                            name="inpu[${accesskey}][que_situacao]"
                                            id="inpu[${accesskey}][que_situacao]"
                                            data-eve_num_evento="${row.eve_num_evento || 0}"
                                            data-que_num_questionario="${row.que_num_questionario || 0}"
                                            value="${que_situacao || ''}"
                                            accesskey="${accesskey}" style="text-align:center; ${colorCancel || ''}"  readonly="readonly" />
                                             
                                    </td>
                            `;

                        }
                        return data;
                    }
                }
                , {
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        let accesskey = (rowData.que_num_questionario != null && rowData.que_num_questionario > 0)
                            ? rowData.que_num_questionario.toString() : rowData.tempo.toString();
                        $(td)
                            .attr('id', `linh[${accesskey}][editar]`)
                            .attr('row', row)
                            .attr('col', col)
                            .attr('campo', 'editar')
                            .attr('data-eve_num_evento', rowData.eve_num_evento || '0')
                            .attr('data-que_num_questionario', rowData.que_num_questionario || '0')
                            .attr('accesskey', accesskey);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            let accesskey = (row.que_num_questionario != null && row.que_num_questionario > 0)
                                ? row.que_num_questionario.toString() : row.tempo.toString();

                            return `
                                <td data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}"
                                    accesskey="${accesskey}"  style="width: 80px; text-align: center;">
                                    <div class="form-group" style="padding-bottom:0px;margin-bottom: 2px;text-align: center;">
                                        
                                        <button type="button" class="btn btn-light btn-editar-questionario" style=""
                                            data-eve="${row.eve_num_evento}" data-que="${row.que_num_questionario}"  title="Editar Questionário">
                                            <span accesskey="${accesskey}" id="inpu[${accesskey}][editar]" style="" />
                                                <i class="fa-regular fa-pen-to-square text-info fa-lg"></i>
                                            </span>
                                        </button>
                                     
                                    </div>
                                </td>
                            `;


                        }
                        return data;
                    },
                    orderable: false
                },
                {
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        let accesskey = (rowData.que_num_questionario != null && rowData.que_num_questionario > 0)
                            ? rowData.que_num_questionario.toString() : rowData.tempo.toString();
                        $(td)
                            .attr('id', `linh[${accesskey}][cancelar]`)
                            .attr('row', row)
                            .attr('col', col)
                            .attr('campo', 'cancelar')
                            .attr('data-eve_num_evento', rowData.eve_num_evento || '0')
                            .attr('data-que_num_questionario', rowData.que_num_questionario || '0')
                            .attr('accesskey', accesskey);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            let accesskey = (row.que_num_questionario != null && row.que_num_questionario > 0)
                                ? row.que_num_questionario.toString() : row.tempo.toString();
                            return `
                                <td data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}"
                                    accesskey="${accesskey}" style="width: 80px; text-align: center;">
                                    <div class="form-group" style="padding-bottom:0px;margin-bottom: 2px;text-align: center;">
                                        <button type="button" class="btn btn-light btn-cancelar-questionario" style=""
                                            data-eve="${row.eve_num_evento}"  data-que="${row.que_num_questionario}" title="Cancelar Questionário">
                                            <span accesskey="${accesskey}" id="inpu[${accesskey}][cancelar]" style="" />
                                                <i class="fa-regular fa-circle-xmark text-warning fa-lg"></i> 
                                            </span>
                                        </button>
                                    </div>
                                </td>
                            `;

                        }
                        return data;
                    },
                    orderable: false
                }
            ],
            language: {
                url: 'https://cdn.datatables.net/plug-ins/1.13.6/i18n/pt-BR.json'
            },
            columnDefs: [
                { targets: [0, 1, 2, 3, 4, 5, 6, 7, 8], visible: true }, { targets: [], visible: false }
            ],
            order: [[0, 'asc']],
            autoFill: true
        }).draw();

        // console.log('DataTable inicializado com sucesso.');
    }

    export function editarEventoQuestionrio(questionariosDtos: any) {
        var dadosForm = $('form[name="formCadQuestionario"]').serializeArray();
        var jqxhr = $.post("/Gestao/ObterEventoQuestionarios", dadosForm, function (data) {
            if (data.sucesso) {
                // console.log("data.lista");
                // console.table(data.lista);
                GestQs.eventosDtos = [];
                let eventosDtos = processDadosEventosForTable(data.eventos);
                GestQs.carregarCamposDeEvento(eventosDtos[0]);

                GestQs.questionariosDtos = [];
                let questionariosDtos = processDadosQuestionariosForTable(data.questionarios);
                console.table(questionariosDtos);

                GestQs.initializeDataTableEventosQuestionarios(questionariosDtos, GestQs._mes, GestQs._ano, 100);
            } else {
                ScriptsConfig.swalconfirmeActionAlertaWarning.fire({
                    icon: 'info',
                    title: '<code style="color:#045C99;font-size:22px;">Olá</code><br>',
                    imageUrl: "/Content/img/logo-ageprev-ms-origin.png",
                    imageWidth: 300,
                    width: 1080,
                    height: 700,
                    html: '<span style="color:#045C99;font-size:20px;">Não há evento disponivel para Edição</b></span>',
                    showCancelButton: false,
                    confirmButtonText: "Ok",
                    cancelButtonText: "Não responder o Questionário!",
                    reverseButtons: false,
                    footer: ScriptsConfig.footerAlert,
                    backdrop: true,
                }).then((result) => {
                    if (result.isConfirmed) {
                        // window.location.href = '/Home/Index';
                    } else {
                        // window.location.href = '/Home/Index';
                    }
                });
            }
        }, "json")
            .done(function (data) {

            })
            .fail(function (_XMLHttpRequest_, textStatus, errorThrown) {
                console.log("error");
                console.log(_XMLHttpRequest_); console.log(textStatus); console.log(errorThrown);
                // ScriptsConfig.failFunctionAjax(_XMLHttpRequest_, textStatus, errorThrown);
            })
            .always(function (data) {

            });

        // if ($('#div-lista-evento-question').css('display') === 'block') {
        //     $('#div-lista-evento-question').css('display', 'none');
        //     $('#div-lista-questionario').css('display', 'block');
        // } else {
        //     $('#div-lista-evento-question').css('display', 'block');
        //     $('#div-lista-questionario').css('display', 'none');
        // }
        $('#div-lista-questionario').css('display', 'block');
        $('#div-lista-evento-question').css('display', 'none');
    }

    export function alertaDeCarregamento() {
        Swal.fire({
            title: '<strong style="color:#045C99;">Salvando Questionário</strong>',
            html: `
                    <div style="text-align: left; font-size: 15px; color: #555; line-height: 1.6;">
                    <p>📝 <b>Enviando suas Questões.</b></p> 
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 10px 0;">
                    <small style="color: #888;"><i>⏳ O tempo de processamento pode variar de acordo com a velocidade da sua conexão com a internet. Por favor, não feche esta janela!</i></small>
                    </div>
                `,
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
                // Personaliza a cor do spinner para combinar com o seu sistema (#045C99)
                const loader = Swal.getPopup().querySelector('.swal2-loader') as HTMLElement;
                if (loader) {
                    loader.style.color = '#045C99';
                    loader.style.borderRightColor = 'transparent';
                }
            }
        });
    }


    export function salvarQuestionario() {
        var dadosFormFiltro = $('form[name="formQuestionario"]').serialize();
        console.log(dadosFormFiltro);

        GestQs.alertaDeCarregamento();

        $('button[name="btnSalvar"]').attr('disabled', 'disabled');
        var jqxhr = $.post("/Gestao/SalvarQuestionario", dadosFormFiltro, function (data) {
            // console.log("success");
            if (data.sucesso) {
                if (data.lista != null && data.lista.length > 0) {

                    //let listaEventos = processDataForTable(data.lista);
                    console.table(listaEventos);
                    // GestQs.initializeDataTableEventoQuestionario(listaEventos, GestQs._mes, GestQs._ano, 100);

                } else {
                    ScriptsConfig.swalconfirmeActionAlertaWarning.fire({
                        icon: 'info',
                        title: '<code style="color:#045C99;font-size:22px;">Olá</code><br>',
                        imageUrl: "/Content/img/logo-ageprev-ms-origin.png",
                        imageWidth: 300,
                        width: 1080,
                        height: 700,
                        html: '<span style="color:#045C99;font-size:20px;">Não há eventos vigentes disponíveis para a emissão de relatórios</b></span>',
                        showCancelButton: false,
                        confirmButtonText: "Ok",
                        cancelButtonText: "Não responder o Questionário!",
                        reverseButtons: false,
                        footer: ScriptsConfig.footerAlert,
                        backdrop: true,
                    }).then((result) => {
                        if (result.isConfirmed) {
                            // window.location.href = '/Home/Index';
                        } else {
                            // window.location.href = '/Home/Index';
                        }
                    });
                }

            } else {
                console.log(data);
            }
        }, "json")
            .done(function (data) {
                if (data !== null) {
                    // console.log("second success");
                } else { console.log("dados não encontrado"); }
            })
            .fail(function (_XMLHttpRequest_, textStatus, errorThrown) {
                console.log("error");
                console.log(_XMLHttpRequest_); console.log(textStatus); console.log(errorThrown);
                // ScriptsConfig.failFunctionAjax(_XMLHttpRequest_, textStatus, errorThrown);
            })
            .always(function (data) {
                $('#botoes').css('display', 'block');
            });


        // $.ajax({
        //     url: '/Gestao/SalvarQuestionario',
        //     data: dadosFormFiltro,
        //     type: 'post',
        //     dataType: 'json',
        //     cache: true,
        //     async: true,
        //     statusCode: {
        //         302: function () { console.log('302 Found'); },
        //         403: function () { console.log('forbidden'); },
        //         404: function () { console.log('page not found'); },
        //         415: function () { console.log('Unsupported Media Type'); },
        //         405: function () { console.log('method not allowed'); },
        //         500: function () { console.log('internal server error'); },
        //         502: function () { console.log('Bad Gateway'); }
        //     },
        //     beforeSend: function (jqXHR) {
        //         // --- ALERTA CRIATIVO DE CARREGAMENTO ---
        //         Swal.fire({
        //             title: '<strong style="color:#045C99;">Salvando Questionário</strong>',
        //             html: `
        //             <div style="text-align: left; font-size: 15px; color: #555; line-height: 1.6;">
        //             <p>📝 <b>Enviando suas respostas...</b></p>
        //             <p>💾 Salvando dados na base.</p>
        //             <p>🏆 <b>Calculando sua pontuação final.</b></p>
        //             <hr style="border: 0; border-top: 1px solid #eee; margin: 10px 0;">
        //             <small style="color: #888;"><i>⏳ O tempo de processamento pode variar de acordo com a velocidade da sua conexão com a internet. Por favor, não feche esta janela!</i></small>
        //             </div>
        //         `,
        //             allowOutsideClick: false,
        //             allowEscapeKey: false,
        //             showConfirmButton: false,
        //             didOpen: () => {
        //                 Swal.showLoading();
        //                 // Personaliza a cor do spinner para combinar com o seu sistema (#045C99)
        //                 const loader = Swal.getPopup().querySelector('.swal2-loader') as HTMLElement;
        //                 if (loader) {
        //                     loader.style.color = '#045C99';
        //                     loader.style.borderRightColor = 'transparent';
        //                 }
        //             }
        //         });
        //     },
        //     success: function (json, textStatus, jqXHR) {
        //         Swal.close(); // Fecha o alerta de carregamento antes de abrir o próximo
        //         console.table(json.lista);

        //         if (json.sucesso) {
        //             let pontuacao: number = Number(json.pontuacao.toFixed(2));
        //             let nota = pontuacao?.toString().replace('.', ',',);



        //             let usr_nome: string = $('input[name="usr_nome"]').val() as string;
        //             var primeiroNome = (usr_nome || "").trim().split(" ")[0];

        //             let usr_cpf: string = $('input[name="usr_cpf"]').val() as string;
        //             usr_cpf = usr_cpf.replace(/\D/g, "");
        //             var cpf = usr_cpf || "";
        //             var cpfMascarado = "";
        //             if (cpf.length === 11) {
        //                 cpfMascarado = "***." + cpf.substring(3, 6) + "." + cpf.substring(6, 9) + "-**";
        //             } else {
        //                 cpfMascarado = cpf;
        //             }

        //             // .. mensagem de nota mínima baseada no 'input[name="que_nota_minima"]' de origem da tabela de questionário
        //             let que_nota_minima = Number($('input[name="que_nota_minima"]').val()?.toString().replace(',', '.') ?? '0');
        //             let icone: string = ((Number(json.pontuacao) >= que_nota_minima) ? 'success' : "warning");
        //             let mensagem: string = (
        //                 (Number(json.pontuacao) >= que_nota_minima)
        //                     ? 'Obrigado pela sua Participação, você teve uma ótima pontuação!'
        //                     : 'Obrigado pela sua Participação, você não atingiu a nota mínima!'
        //             );
        //             // ..

        //             ScriptsConfig.swalWithBootstrapButtons.fire({
        //                 icon: icone,
        //                 title: '<code style="color:#045C99;font-size:22px;">' + primeiroNome + ' - ' + cpfMascarado + '</code><br>'
        //                     + '<span style="color:#045C99;font-size:22px;">' + mensagem + '</span>',
        //                 imageUrl: "/Content/img/logo-ageprev-ms-origin.png",
        //                 imageWidth: 300,
        //                 width: 1080,
        //                 height: 700,
        //                 html: '<span style="color:#045C99;font-size:20px;">A sua nota é: <b> ' + nota + '</b></span>',
        //                 showCancelButton: false,
        //                 confirmButtonText: "Ok",
        //                 cancelButtonText: "Não responder o Questionário!",
        //                 reverseButtons: false,
        //                 footer: ScriptsConfig.footerAlert,
        //                 backdrop: true,
        //             }).then((result) => {
        //                 if (result.isConfirmed) {
        //                     window.location.href = '/Home/Index';
        //                 } else {
        //                     // window.location.href = '/Home/Index';
        //                 }
        //             });
        //         } else {
        //             ScriptsConfig.swalconfirmeActionAlerta.fire({
        //                 title: 'Erro',
        //                 html: "Não foi possível efetuar o Cadastro!",
        //                 icon: "warning",
        //                 showCancelButton: false,
        //                 showDenyButton: true,
        //                 confirmButtonText: "Atualizar Pággina",
        //                 denyButtonText: 'Voltar para Página Anterior',
        //                 cancelButtonText: "No, cancel!",
        //                 reverseButtons: true,
        //                 footer: ScriptsConfig.footerAlert
        //             }).then((result) => {
        //                 if (result.isConfirmed) {
        //                     // window.location.reload();
        //                 } else if (result.isDenied) {
        //                     // window.location.href = '/Home/Index';
        //                 } else {
        //                     //  window.location.href = '/Home/Index';
        //                 }
        //             });
        //         }
        //     },
        //     error: function (_XMLHttpRequest_, textStatus, errorThrown) {
        //         Swal.close(); // Fecha o alerta de carregamento em caso de erro

        //         if (_XMLHttpRequest_.status === 0 || _XMLHttpRequest_.statusText === 'abort') {
        //             console.log('Request aborted by the user.');
        //         } else if (_XMLHttpRequest_.status === 419) {
        //             console.error('Mixed Content Error: Your request is trying to access an insecure resource (http://) while your page is loaded over HTTPS. Update the target URL to use HTTPS.');
        //             Swal.fire({
        //                 icon: "error",
        //                 title: "Oops...",
        //                 html: '<b>Mixed Content Error</b><br>Please ensure the target URL uses HTTPS.',
        //                 footer: '<code>' + textStatus + '</code>'
        //             });
        //         } else {
        //             console.error('Unexpected error:', textStatus, errorThrown);
        //             Swal.fire({
        //                 icon: "error",
        //                 title: "Oops...",
        //                 html: errorThrown,
        //                 footer: '<code>' + textStatus + '</code>'
        //             });
        //         }
        //     },
        //     complete: function (XMLHttpRequest, textStatus) {
        //         // Dica: Você desabilitou o 'btnSalvar' no início, mas está habilitando o 'btnBuscarMovimentos' aqui.
        //         // Se a intenção era habilitar o botão de salvar de volta, altere para 'btnSalvar'.
        //         $('button[name="btnSalvar"]').removeAttr('disabled');
        //     }
        // }).done(function () { }).fail(function (_XMLHttpRequest_, textStatus, errorThrown) {
        //     console.log(_XMLHttpRequest_); console.log(textStatus); console.log(errorThrown);
        //     ScriptsConfig.failFunctionAjax(_XMLHttpRequest_, textStatus, errorThrown);
        // }).always(function () { });
    }

    export function novoQuestionario(eventosDtos) {
        let eve_num_evento: number = Number($('input[name="eve_num_evento"]').val() || 0);
        let que_num_questionario: number = Number($('input[name="que_num_questionario"]').val() || 0);
        let url: string = ''
        url = url.replace('0', eve_num_evento.toString()).replace('0', que_num_questionario.toString());

        $('input[name="que_num_questionario"]').val(eventosDtos.eve_nome);
        $('textarea[name="que_contexto"]').val(eventosDtos.que_contexto);
        $('input[name="eve_local"]').val(eventosDtos.eve_local);
        $('input[name="eve_municipio"]').val(eventosDtos.eve_municipio);

        $('input[name="eve_dt_inicio"]').val(((eventosDtos.eve_dt_inicio && eventosDtos.eve_dt_inicio.length >= 10) ? eventosDtos.eve_dt_inicio.substr(8, 2) + '/' + eventosDtos.eve_dt_inicio.substr(5, 2) + '/' + eventosDtos.eve_dt_inicio.substr(0, 4) : ''));
        $('input[name="eve_dt_fim"]').val(((eventosDtos.eve_dt_fim && eventosDtos.eve_dt_fim.length >= 10) ? eventosDtos.eve_dt_fim.substr(8, 2) + '/' + eventosDtos.eve_dt_fim.substr(5, 2) + '/' + eventosDtos.eve_dt_fim.substr(0, 4) : ''));
        $('input[name="eve_dt_inclusao"]').val(((eventosDtos.eve_dt_inclusao && eventosDtos.eve_dt_inclusao.length >= 10) ? eventosDtos.eve_dt_inclusao.substr(8, 2) + '/' + eventosDtos.eve_dt_inclusao.substr(5, 2) + '/' + eventosDtos.eve_dt_inclusao.substr(0, 4) : ''));

        $('select[name="eve_situacao"]').val(eventosDtos.eve_situacao);

    }

    export function editarQuestionrio(questionario) {
        let url: string = ''
        $('input[name="que_num_questionario"]').val(questionario.que_num_questionario);
        $('textarea[name="que_contexto"]').val(questionario.que_contexto);
        $('input[name="que_publico_alvo"]').val(questionario.que_publico_alvo);
        $('input[name="que_nota_minima"]').val(questionario.que_nota_minima);
        $('input[name="que_dt_inclusao"]').val(((questionario.que_dt_inclusao && questionario.que_dt_inclusao.length >= 10) ? questionario.que_dt_inclusao.substr(8, 2) + '/' + questionario.que_dt_inclusao.substr(5, 2) + '/' + questionario.que_dt_inclusao.substr(0, 4) : ''));
        $('select[name="que_situacao"]').val(questionario.que_situacao);
    }

    $(function () {

        _ano = '2026';
        _mes = '6';

        setTimeout(() => {
            console.log("This prints after 2 seconds!");
            carregarEventos();
        }, 200);

        console.log('fetchDataAndInitializeTable()');
        $.when(GestQs.carregarIndices()).then(function (data, textStatus, jqXHR) {

        });

        $('#div-lista-evento-question tbody').on('click', 'button.btn-editar-lista-questionarios', function () {
            const eve_num_evento = Number($(this).data('eve') || 0);
            //const que_num_questionario = Number($(this).data('que') || 0);
            $('input[name="eve_num_evento"]').val(eve_num_evento);
            $('input[name="que_num_questionario"]').val(0);
            GestQs.editarEventoQuestionrio(eve_num_evento)
        });


        $('#div-lista-questionario tbody').on('click', 'button.btn-editar-questionario', function () {
            const eve_num_evento = Number($(this).data('eve') || 0);
            const que_num_questionario = Number($(this).data('que') || 0);
            $('input[name="eve_num_evento"]').val(eve_num_evento);
            $('input[name="que_num_questionario"]').val(que_num_questionario);
            console.log(GestQs.questionariosDtos);
            let questionario = GestQs.questionariosDtos.find(x => x.que_num_questionario === que_num_questionario);
            console.log(questionario);
            if (questionario) {
                GestQs.editarQuestionrio(questionario);
                $('#div-lista-evento-question').css('display', 'none');
                $('#div-lista-questionario').css('display', 'none');
                $('#div-formulario-questionario').css('display', 'block');
            }
        });


        $('button[name="btn-fechar-lista-questionario"]').on('click', function (e) {
            $('#div-lista-evento-question').css('display', 'block');
            $('#div-lista-questionario').css('display', 'none');
            $('#div-formulario-questionario').css('display', 'none');
        });

        $('button[name="btn-fechar-cadastro-questionario"]').on('click', function (e) {
            $('#div-lista-evento-question').css('display', 'none');
            $('#div-lista-questionario').css('display', 'block');
            $('#div-formulario-questionario').css('display', 'none');
        });


        $('button[name="btn-salvar-questionario"]').on('click', function (e) {
            GestQs.salvarQuestionario();
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
            // Remove all non-numeric characters before saving
            var cleanValue = ($(this).val() as string);
            $('input[name="busca"]').val(cleanValue)
            console.log("Cleaned:", cleanValue);
        });

        $('button[name="btnBuscar"]').on('click', function (e) {

            $.when(GestQs.buscarUsuarioaNoRelatorio()).then(function (data, textStatus, jqXHR) {
                $.when(GestQs.initializeDataTable(GestQs.listaBusca, _ano, _mes, 100)).then(function (data, textStatus, jqXHR) {
                    $('input[name="buscaLimpa"]').val('');
                    console.log('Pontuação carregada com filtro');
                });
            });
        });




        /*
        setTimeout(() => {
            console.log("This prints after 2 seconds!");
            fetchDataAndInitializeTable();
        }, 200);
        */

    });

}

declare module "GestQs" {
    export = GestQs;
}