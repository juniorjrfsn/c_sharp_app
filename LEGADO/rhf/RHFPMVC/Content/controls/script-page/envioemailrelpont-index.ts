// File: script-page/envioemailrelpont-index.ts

/// <reference path="../config-scripts/@types/jquery/index.d.ts" />
/// <reference path="../config-scripts/@types/jquery.form/index.d.ts" />

/// <reference path="../config-scripts/@types/datatables.net/types/types.d.ts" />
/// <reference path="../config-scripts/sweetalert2.d.ts" />
/// <reference path="../config-scripts/config.ts" />
/// <reference path="../config-scripts/ScriptsConfig.d.ts" />

namespace EnvMailRelPontIndex {
    export let container;
    export let tempo: number = Date.now();
    export let dataTableInstance: any | null = null;
    export let dataTableInstanceEveQuestion: any | null = null;
    export let _ano: string = '0';
    export let _mes: string = '0';

    export let eve_num_evento: number = 0;
    export let que_num_questionario: number = 0;

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

    export function initializeDataTable(data, mes, ano, pageLength) {

        // console.log('Inicializando DataTable...');
        if (!Array.isArray(data)) {
            console.error('Os dados recebidos não são válidos:', data);
            data = [];
        }

        console.table(data);

        // Se já existe uma instância anterior, destruir de forma segura
        try {
            if ($.fn && $.fn.dataTable && $.fn.dataTable.isDataTable && $.fn.dataTable.isDataTable('#table-lista-itens')) {
                try {
                    const existing = $('#table-lista-itens').DataTable();
                    existing.clear && existing.clear();
                    existing.destroy && existing.destroy();
                } catch (err) {
                    console.warn('Falha ao destruir DataTable via API:', err);
                }
                // Remover elementos remanescentes que o plugin pode ter criado
                try { $('.dt-buttons').remove(); } catch (e) { }
                try { $('.fixedHeader-floating').remove(); } catch (e) { }
                try { $('#table-lista-itens_wrapper').remove(); } catch (e) { }
                EnvMailRelPontIndex.dataTableInstance = null;
            }
        } catch (e) {
            console.warn('Erro ao verificar/destruir DataTable anterior:', e);
        }
        $('#table-lista-itens tbody').empty();

        // console.log('Inicializando DataTable com os dados recebidos...');
        EnvMailRelPontIndex.dataTableInstance = $('#table-lista-itens').DataTable({
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
                var table = EnvMailRelPontIndex.dataTableInstance;

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
                            .attr('accesskey', rowData.usr_num_usuario || EnvMailRelPontIndex.tempo);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            var colorCancel = '';
                            let usr_cpf = data;

                            if (row.usr_num_usuario == 0 && row.que_num_questionario == 0) {
                                return `
                                    <td data-usr_num_usuario="${row.usr_num_usuario || EnvMailRelPontIndex.tempo}" data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}"
                                         accesskey="${row.usr_num_usuario || EnvMailRelPontIndex.tempo}" style="text-align:center; background-color:  #337ab7 ;">
                                         <div class="form-control text-white" style="text-align:center; background-color: #337ab7;" >Evento<div>     
                                    </td>

                            `;
                            }
                            else if (row.usr_num_usuario == 0 && row.que_num_questionario > 0) {
                                return `
                                    <td data-usr_num_usuario="${row.usr_num_usuario || EnvMailRelPontIndex.tempo}" data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}"
                                         accesskey="${row.usr_num_usuario || EnvMailRelPontIndex.tempo}" style="text-align:center; background-color:  #337ab7;">
                                         <div class="form-control text-white"  style="text-align:center; background-color:  #337ab7;" >Questionário<div>     
                                    </td>

                            `;
                            } else {
                                return `
                                    <td data-usr_num_usuario="${row.usr_num_usuario || EnvMailRelPontIndex.tempo}" data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}"
                                         accesskey="${row.usr_num_usuario || EnvMailRelPontIndex.tempo}">

                                        <input type="hidden" class="form-control usr_num_usuario"
                                            name="inpu[${row.usr_num_usuario || EnvMailRelPontIndex.tempo}][usr_num_usuario]"
                                            id="inpu[${row.usr_num_usuario || EnvMailRelPontIndex.tempo}][usr_num_usuario]"
                                            value="${row.usr_num_usuario || EnvMailRelPontIndex.tempo}"
                                            accesskey="${row.usr_num_usuario || EnvMailRelPontIndex.tempo}"  />

                                        <input type="hidden" class="form-control eve_num_evento"
                                            name="inpu[${row.usr_num_usuario || EnvMailRelPontIndex.tempo}][eve_num_evento]"
                                            id="inpu[${row.usr_num_usuario || EnvMailRelPontIndex.tempo}][eve_num_evento]"
                                            value="${row.eve_num_evento || 0}"
                                            accesskey="${row.usr_num_usuario || EnvMailRelPontIndex.tempo}"  />

                                        <input type="hidden" class="form-control que_num_questionario"
                                            name="inpu[${row.usr_num_usuario || EnvMailRelPontIndex.tempo}][que_num_questionario]"
                                            id="inpu[${row.usr_num_usuario || EnvMailRelPontIndex.tempo}][que_num_questionario]"
                                            value="${row.que_num_questionario || '0'}"
                                            accesskey="${row.usr_num_usuario || EnvMailRelPontIndex.tempo}"  />

                                        <input type="text" class="form-control usr_cpf"
                                            name="inpu[${row.usr_num_usuario || EnvMailRelPontIndex.tempo}][usr_cpf]"
                                            id="inpu[${row.usr_num_usuario || EnvMailRelPontIndex.tempo}][usr_cpf]"
                                            data-usr_num_usuario="${row.usr_num_usuario || EnvMailRelPontIndex.tempo}" 
                                            data-eve_num_evento="${row.eve_num_evento || 0}" 
                                            data-que_num_questionario="${row.que_num_questionario || 0}"
                                            value="${usr_cpf || ''}"
                                            onblur="javascript:EnvMailRelPontIndex.validarCampos(${row.usr_num_usuario || EnvMailRelPontIndex.tempo}, 'usr_cpf');"
                                            onclick="javascript:inputMascara();"
                                            maxlength="11"
                                            accesskey="${row.usr_num_usuario || EnvMailRelPontIndex.tempo}" style="max-width:130px; ${colorCancel || ''}"  readonly="readonly" />
                                             
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
                            .attr('accesskey', rowData.usr_num_usuario || EnvMailRelPontIndex.tempo);
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
                                    <td data-usr_num_usuario="${row.usr_num_usuario || EnvMailRelPontIndex.tempo}" data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}"
                                         accesskey="${row.usr_num_usuario || EnvMailRelPontIndex.tempo}" style="text-align:center; background-color:  #337ab7 ;">
                                         <div class="form-control text-white" style="text-align:center; background-color: #337ab7;" >${row.eve_nome || ''}<div>     
                                    </td>

                            `;
                            }
                            else if ((usr_nome == '' || usr_nome == null) && row.que_num_questionario > 0) {
                                return `
                                    <td data-usr_num_usuario="${row.usr_num_usuario || EnvMailRelPontIndex.tempo}" data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}"
                                         accesskey="${row.usr_num_usuario || EnvMailRelPontIndex.tempo}" style="text-align:center; background-color:  #337ab7;">
                                         <div class="form-control text-white"  style="text-align:center; background-color:  #337ab7;" >${row.que_contexto || ''}<div>     
                                    </td>

                            `;
                            } else {
                                return `
                                  <td
                                    data-usr_num_usuario="${row.usr_num_usuario || EnvMailRelPontIndex.tempo}" style="100%;padding-bottom:0px;vertical-align:bottom;"
                                    data-eve_num_evento="${row.eve_num_evento || 0}" 
                                    data-que_num_questionario="${row.que_num_questionario || 0}"
                                         accesskey="${row.usr_num_usuario || EnvMailRelPontIndex.tempo}" >
                                         <div class="form-group" style="100%;padding-bottom:0px;margin-bottom: 2px;">
                                            <input type="hidden" class="form-control usr_nome"
                                                name="inpu[${row.usr_num_usuario || EnvMailRelPontIndex.tempo}][usr_nome_hidden]"
                                                id="inpu[${row.usr_num_usuario || EnvMailRelPontIndex.tempo}][usr_nome_hidden]"
                                                value="${row.usr_nome || ''}"
                                                accesskey="${row.usr_num_usuario || EnvMailRelPontIndex.tempo}"  />
                                         
                                            <span  class="form-control usr_cpf" 
                                                    name="inpu[${row.usr_num_usuario || EnvMailRelPontIndex.tempo}][usr_cpf]"
                                                    id="inpu[${row.usr_num_usuario || EnvMailRelPontIndex.tempo}][usr_cpf]"
                                                    data-usr_num_usuario="${row.usr_num_usuario || EnvMailRelPontIndex.tempo}" 
                                                    data-eve_num_evento="${row.eve_num_evento || 0}" 
                                                    data-que_num_questionario="${row.que_num_questionario || 0}"
                                                    value="${row.usr_cpf || ''}"
                                                    onblur="javascript:EnvMailRelPontIndex.validarCampos(${row.usr_num_usuario || EnvMailRelPontIndex.tempo}, 'usr_cpf');"
                                                    onclick="javascript:inputMascara();"
                                                    maxlength="11"
                                                    accesskey="${row.usr_num_usuario || EnvMailRelPontIndex.tempo}" style="max-width:150px; float:left; ${colorCancel || ''}"  readonly="readonly" />${usr_cpf || ''}
                                            </span>
                                            <span  class="form-control" accesskey="${row.usr_num_usuario || EnvMailRelPontIndex.tempo}" 
                                                name="inpu[${row.usr_num_usuario || EnvMailRelPontIndex.tempo}][usr_nome]" id="inpu[${row.usr_num_usuario || EnvMailRelPontIndex.tempo}][usr_nome]"
                                                onblur="javascript:EnvMailRelPontIndex.validarCampos(${row.usr_num_usuario || EnvMailRelPontIndex.tempo},'usr_nome');"  readonly="readonly"
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
                            .attr('accesskey', rowData.usr_num_usuario || EnvMailRelPontIndex.tempo);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            // var colorCancel = ((row.pim_situacao === 'A') ? '' : 'color:red;');
                            // let valor = Number(data);
                            let eve_nome = data;
                            return `
                                  <td data-usr_num_usuario="${row.usr_num_usuario || EnvMailRelPontIndex.tempo}" data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}"
                                         accesskey="${row.usr_num_usuario || EnvMailRelPontIndex.tempo}">

                                    <input type="text" class="form-control" accesskey="${row.usr_num_usuario || EnvMailRelPontIndex.tempo}"  
                                        name="inpu[${row.usr_num_usuario || EnvMailRelPontIndex.tempo}][eve_nome]" id="inpu[${row.usr_num_usuario || EnvMailRelPontIndex.tempo}][eve_nome]"
                                        onblur="javascript:EnvMailRelPontIndex.validarCampos(${row.usr_num_usuario || EnvMailRelPontIndex.tempo},'eve_nome');"
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
                            .attr('accesskey', rowData.usr_num_usuario || EnvMailRelPontIndex.tempo);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            var colorCancel = ((row.pim_situacao === 'A') ? '' : 'color:red;');
                            let valor = Number(data);
                            if ((row.usr_cpf == '' || row.usr_cpf == null) && row.que_num_questionario == 0) {
                                return `
                                    <td data-usr_num_usuario="${row.usr_num_usuario || EnvMailRelPontIndex.tempo}" data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}"
                                         accesskey="${row.usr_num_usuario || EnvMailRelPontIndex.tempo}" style="text-align:center; background-color:  #337ab7 ;">
                                         <div><div>     
                                    </td>

                            `;
                            }
                            else if ((row.usr_cpf == '' || row.usr_cpf == null) && row.que_num_questionario > 0) {
                                return `
                                    <td data-usr_num_usuario="${row.usr_num_usuario || EnvMailRelPontIndex.tempo}" data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}"
                                         accesskey="${row.usr_num_usuario || EnvMailRelPontIndex.tempo}" style="text-align:center; background-color: #337ab7;padding-bottom:0px;">
                                         <span class="form-control text-white" style="text-align:center; background-color: #337ab7;" >Nota<span>
                                    </td>

                            `;
                            } else {
                                let pontuacao: number = Number(data.toFixed(2));
                                let nota = pontuacao?.toString().replace('.', ',',);

                                return `
                                    <td data-usr_num_usuario="${row.usr_num_usuario || EnvMailRelPontIndex.tempo}" data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}"
                                             accesskey="${row.usr_num_usuario || EnvMailRelPontIndex.tempo}" style="text-align: center;">

                                        <div class="form-group" style="100%;padding-bottom:0px;margin-bottom: 2px;">
                                            <span class="form-control" accesskey="${row.usr_num_usuario || EnvMailRelPontIndex.tempo}"  name="inpu[${row.usr_num_usuario || EnvMailRelPontIndex.tempo}][pontuacao]" id="inpu[${row.usr_num_usuario || EnvMailRelPontIndex.tempo}][pontuacao]"
                                            onblur="javascript:EnvMailRelPontIndex.validarCampos(${row.usr_num_usuario || EnvMailRelPontIndex.tempo},'pontuacao');"
                                   
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
                        $(td).attr('id', 'linh[' + row + '][pdf]').attr('row', row).attr('col', col).attr('campo', 'pdf')
                            .attr('accesskey', rowData.usr_num_usuario || EnvMailRelPontIndex.tempo);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            if ((row.usr_cpf == '' || row.usr_cpf == null) && row.que_num_questionario == 0) {
                                return `
                                    <td data-usr_num_usuario="${row.usr_num_usuario || EnvMailRelPontIndex.tempo}" data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}"
                                         accesskey="${row.usr_num_usuario || EnvMailRelPontIndex.tempo}" style="text-align:center; background-color:  #337ab7 ;">
                                         <div><div>     
                                    </td>

                            `;
                            }
                            else if ((row.usr_cpf == '' || row.usr_cpf == null) && row.que_num_questionario > 0) {
                                return `
                                    <td data-usr_num_usuario="${row.usr_num_usuario || EnvMailRelPontIndex.tempo}" data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}"
                                         accesskey="${row.usr_num_usuario || EnvMailRelPontIndex.tempo}" style="text-align:center; background-color: #337ab7;padding-bottom:0px;">
                                         <span class="form-control text-white" style="text-align:center; background-color: #337ab7;" >PDF<span>
                                    </td>

                            `;
                            } else {
                                return `
                                    <td data-usr_num_usuario="${row.usr_num_usuario || EnvMailRelPontIndex.tempo}" data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}"
                                             accesskey="${row.usr_num_usuario || EnvMailRelPontIndex.tempo}" style="text-align: center;">
                                        <div class="form-group" style="100%;padding-bottom:0px;margin-bottom: 2px;text-align: center;background-color: #e9ecef;">
                                            <span class="form-control" accesskey="${row.usr_num_usuario || EnvMailRelPontIndex.tempo}" id="inpu[${row.usr_num_usuario || EnvMailRelPontIndex.tempo}][pdf]" style="background-color: #e9ecef;"
                                                readonly="readonly"/>
                                                <button type="button" class="btn btn-light btn-gerar-pdf" style="border:none;padding:0 8px;background-color: #e9ecef;" data-usrcpf="${row.usr_cpf}" data-eve="${row.eve_num_evento}" data-que="${row.que_num_questionario}" title="Gerar PDF"><i class="fas fa-file-pdf text-danger"></i></button>
                                            </span>
                                        </div>
                                    </td>
                                `;

                            }
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
                { targets: [1, 3, 4], visible: true }, { targets: [0, 2], visible: false }
            ],
            order: [[1, 'asc']],
            autoFill: true
        }).draw();

        // console.log('DataTable inicializado com sucesso.');
    }

    export function carregarIndices() { }

    export function processDataForTable(data) {
        EnvMailRelPontIndex.listaEventos = [];
        data.forEach(q => {
            EnvMailRelPontIndex.listaEventos.push({
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
                que_nota_minima: q.que_nota_minima || '0',
                que_dt_inclusao: q.que_dt_inclusao || '',
                que_situacao: q.que_situacao || ''
            });
        });
        return EnvMailRelPontIndex.listaEventos;
    }

    export function procesDadosUsuarioPonto(data) {
        // console.table(data);
        EnvMailRelPontIndex.listaUsuariosPontos = [];
        data.forEach(q => {
            EnvMailRelPontIndex.listaUsuariosPontos.push({
                tempo: q.usr_num_usuario || Date.now(),
                usr_num_usuario: Number(q.usr_num_usuario) || 0,
                eve_num_evento: Number(q.eve_num_evento) || 0,
                que_num_questionario: Number(q.que_num_questionario) || 0,
                que_contexto: q.que_contexto || '',
                que_situacao: q.que_situacao || '',
                usr_cpf: q.usr_cpf || '',
                usr_nome: q.usr_nome || '',
                usr_email: q.usr_email || '',
                usr_situacao: q.usr_situacao || '',
                eve_nome: q.eve_nome || '',
                pontuacao: q.pontuacao || '',
                eve_situacao: q.eve_situacao
            });
        });
        return EnvMailRelPontIndex.listaUsuariosPontos;
    }


    export function agruparQuestoes(dados) {
        const mapa = {};
        dados.forEach(item => {
            const nu = item.usr_num_usuario;
            const ne = item.eve_num_evento;
            const nq = item.que_num_questionario;
            const q = item.qst_num_questao;
            if (!mapa[q]) {
                mapa[q] = {
                    usr_num_usuario: nu, eve_num_evento: ne, que_num_questionario: nq, enunciado: item.qst_enunciado
                    , num: q
                    , ponto_alvo_q: item.ponto_alvo_q
                    , ponto_q: item.ponto_q
                    , nota_q: item.nota_q
                    , usr_nome: item.usr_nome
                    , pontuacao: item.pontuacao
                    , respostas: []
                };
            }
            // console.log('item.qsr_e_correta : ', item.qsr_e_correta)
            mapa[q].respostas.push({
                num: item.qsr_num_resposta,
                enunciado: item.qsr_enunciado,
                correta: item.qsr_e_correta === 'S',
                qsr_e_correta: item.qsr_e_correta,
                qsr_num_resposta_usuario: item.qsr_num_resposta_usuario
            });
        });
        return Object.values(mapa);
    }

    export function gerarHTML(lista) {
        EnvMailRelPontIndex.listaUsuariosPontos = [];

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
            EnvMailRelPontIndex.listaUsuariosPontos.push({
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
                EnvMailRelPontIndex.listaUsuariosPontos.push({
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
                    EnvMailRelPontIndex.listaUsuariosPontos.push({
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
        return EnvMailRelPontIndex.listaUsuariosPontos;
    };

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

    export function fetchDataAndInitializeTable() {
        //console.log('Iniciando busca de dados da API...');
        var dadosForm = $('form[name="formFinEnvMail"]').serializeArray();
        var jqxhr = $.post('/Envioemailrelpont/ListaPonto', dadosForm, function (json) {
            // console.log("success");
            // console.table(json);
            // console.log("fetchDataAndInitializeTable");
          
            if (json.qtd > 0) {
                if (json.sucesso) {
                    // Initialize the DataTable
                    // Process the data
                    if (json.lista && json.lista.length > 0) {
                        $('input[name="busca"]').val('');
                        $('input[name="buscaLimpa"]').val('');
                        $('#content-table').css('display', 'block');
                        $('#content-table').css('width', '100%');
                      
                        let listaUsuariosPontos = EnvMailRelPontIndex.procesDadosUsuarioPonto(json.lista);
                        // console.table(json.lista);
                        // console.table(EnvMailRelPontIndex.dadosDaTabela);
                        // console.log('Dados processados para o DataTable:', dadosDaTabela);
                        // let listaUsuariosPontos = gerarHTML(json.lista);
                        // console.table(listaUsuariosPontos);

                        $.when(EnvMailRelPontIndex.initializeDataTable(listaUsuariosPontos, _ano, _mes, 100)).then(function (data, textStatus, jqXHR) {
                            // console.log('Pontuação carregada');
                        });
                    } else {
                        EnvMailRelPontIndex.initializeDataTable([], _ano, _mes, 1);
                    }
                } else {
                    EnvMailRelPontIndex.initializeDataTable([], _ano, _mes, 1);
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
            // console.log("done success");
            //console.table(data);
            // console.table(data.lista);
        }).fail(function (_XMLHttpRequest_, textStatus, errorThrown) {
            //console.log("error");
            console.log(_XMLHttpRequest_); console.log(textStatus); console.log(errorThrown);
            // ScriptsConfig.failFunctionAjax(_XMLHttpRequest_, textStatus, errorThrown);
        }).always(function (data) {
            //console.log("finished");
            //console.table(data);
        });
    }

    export function eventoQuestionarioPontosPorUsuario(eve_num_evento, que_num_questionario) {
        $('input[name="eve_num_evento"]').val(eve_num_evento);
        $('input[name="que_num_questionario"]').val(que_num_questionario);

        $('input[name="busca"]').val('');
        $('input[name="buscaLimpa"]').val('');
        $('#content-table').css('display', 'block');
        $('#content-table').css('width', '100%');
        EnvMailRelPontIndex.fetchDataAndInitializeTable();
        $('#div-lista-evento-question').css('display', 'none');
 
    }
    
    export function initializeDataTableEventoQuestionario(data, mes, ano, pageLength) {

        // console.log('Inicializando DataTable...');
        if (!Array.isArray(data)) {
            console.error('Os dados recebidos não são válidos:', data);
            data = [];
        }

        if (EnvMailRelPontIndex.dataTableInstanceEveQuestion) {
            EnvMailRelPontIndex.dataTableInstanceEveQuestion.destroy();
        }
        $('#tb-itens-evento-questionario tbody').empty();

        // console.log('Inicializando DataTable com os dados recebidos...');
        EnvMailRelPontIndex.dataTableInstanceEveQuestion = $('#table-lista-evento-questionario').DataTable({
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
                var table = EnvMailRelPontIndex.dataTableInstanceEveQuestion;
                table.buttons([0, 1, 2]).remove();
            },
            lengthChange: true,
            searching: true,
            ordering: true,
            columns: [
                {
                    data: 'eve_num_evento', className: 'editable eve_num_evento',
                    createdCell: function (td, cellData, rowData, row, col) {
                        let accesskey = (rowData.eve_num_evento || 0) + '_' + (rowData.que_num_questionario || 0);
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
                            let accesskey = (row.eve_num_evento || 0) + '_' + (row.que_num_questionario || 0);
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
                    data: 'que_num_questionario', className: 'editable que_num_questionario',
                    createdCell: function (td, cellData, rowData, row, col) {
                        let accesskey = (rowData.eve_num_evento || 0) + '_' + (rowData.que_num_questionario || 0);
                        $(td)
                            .attr('id', `linh[${accesskey}][que_num_questionario]`)
                            .attr('row', row)
                            .attr('col', col)
                            .attr('campo', 'que_num_questionario')
                            .attr('data-eve_num_evento', rowData.eve_num_evento || '0')
                            .attr('data-que_num_questionario', rowData.que_num_questionario || '0')
                            .attr('accesskey', accesskey);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            var colorCancel = '';
                            let que_num_questionario = data;
                            let accesskey = (row.eve_num_evento || 0) + '_' + (row.que_num_questionario || 0);
                            return `
                                    <td  data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}" accesskey="${accesskey}">
                                        <input type="text" class="form-control que_num_questionario"
                                            name="inpu[${accesskey}][que_num_questionario]"
                                            id="inpu[${accesskey}][que_num_questionario]"
                                            data-eve_num_evento="${row.eve_num_evento || 0}" 
                                            data-que_num_questionario="${row.que_num_questionario || 0}"
                                            value="${que_num_questionario || ''}"
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
                        let accesskey = (rowData.eve_num_evento || 0) + '_' + (rowData.que_num_questionario || 0);
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
                            let accesskey = (row.eve_num_evento || 0) + '_' + (row.que_num_questionario || 0);
                            return `
                                    <td  data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}" accesskey="${accesskey}">
                                        <input type="text" class="form-control eve_nome"
                                            name="inpu[${accesskey}][eve_nome]"
                                            id="inpu[${accesskey}][eve_nome]"
                                            data-eve_num_evento="${row.eve_num_evento || 0}" 
                                            data-que_num_questionario="${row.que_num_questionario || 0}"
                                            value="${eve_nome || ''}"
                                            accesskey="${accesskey}" style="${colorCancel || ''}"  readonly="readonly" />
                                             
                                    </td>
                            `;

                        }
                        return data;
                    }
                }
                , {
                    data: 'eve_descricao', className: 'editable eve_descricao',
                    createdCell: function (td, cellData, rowData, row, col) {
                        let accesskey = (rowData.eve_num_evento || 0) + '_' + (rowData.que_num_questionario || 0);
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
                            let accesskey = (row.eve_num_evento || 0) + '_' + (row.que_num_questionario || 0);
                            return `
                                    <td  data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}" accesskey="${accesskey}">
                                        <input type="text" class="form-control eve_descricao"
                                            name="inpu[${accesskey}][eve_descricao]"
                                            id="inpu[${accesskey}][eve_descricao]"
                                            data-eve_num_evento="${row.eve_num_evento || 0}" 
                                            data-que_num_questionario="${row.que_num_questionario || 0}"
                                            value="${eve_descricao || ''}"
                                            accesskey="${accesskey}" style="${colorCancel || ''}"  readonly="readonly" />
                                             
                                    </td>
                            `;

                        }
                        return data;
                    }
                }
                , {
                    data: 'eve_local', className: 'editable eve_local',
                    createdCell: function (td, cellData, rowData, row, col) {
                        let accesskey = (rowData.eve_num_evento || 0) + '_' + (rowData.que_num_questionario || 0);
                        $(td)
                            .attr('id', `linh[${accesskey}][eve_local]`)
                            .attr('row', row)
                            .attr('col', col)
                            .attr('campo', 'eve_local')
                            .attr('data-eve_num_evento', rowData.eve_num_evento || '0')
                            .attr('data-que_num_questionario', rowData.que_num_questionario || '0')
                            .attr('accesskey', accesskey);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            var colorCancel = '';
                            let eve_local = data;
                            let accesskey = (row.eve_num_evento || 0) + '_' + (row.que_num_questionario || 0);
                            return `
                                    <td  data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}" accesskey="${accesskey}">
                                        <input type="text" class="form-control eve_local"
                                            name="inpu[${accesskey}][eve_local]"
                                            id="inpu[${accesskey}][eve_local]"
                                            data-eve_num_evento="${row.eve_num_evento || 0}" 
                                            data-que_num_questionario="${row.que_num_questionario || 0}"
                                            value="${eve_local || ''}"
                                            accesskey="${accesskey}" style="${colorCancel || ''}"  readonly="readonly" />
                                             
                                    </td>
                            `;

                        }
                        return data;
                    }
                }
                , {
                    data: 'eve_municipio', className: 'editable eve_municipio',
                    createdCell: function (td, cellData, rowData, row, col) {
                        let accesskey = (rowData.eve_num_evento || 0) + '_' + (rowData.que_num_questionario || 0);
                        $(td)
                            .attr('id', `linh[${accesskey}][eve_municipio]`)
                            .attr('row', row)
                            .attr('col', col)
                            .attr('campo', 'eve_municipio')
                            .attr('data-eve_num_evento', rowData.eve_num_evento || '0')
                            .attr('data-que_num_questionario', rowData.que_num_questionario || '0')
                            .attr('accesskey', accesskey);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            var colorCancel = '';
                            let eve_municipio = data;
                            let accesskey = (row.eve_num_evento || 0) + '_' + (row.que_num_questionario || 0);
                            return `
                                    <td  data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}" accesskey="${accesskey}">
                                        <input type="text" class="form-control eve_municipio"
                                            name="inpu[${accesskey}][eve_municipio]"
                                            id="inpu[${accesskey}][eve_municipio]"
                                            data-eve_num_evento="${row.eve_num_evento || 0}" 
                                            data-que_num_questionario="${row.que_num_questionario || 0}"
                                            value="${eve_municipio || ''}"
                                            accesskey="${accesskey}" style="${colorCancel || ''}"  readonly="readonly" />
                                             
                                    </td>
                            `;

                        }
                        return data;
                    }
                }
                , {
                    data: 'eve_dt_inicio', className: 'editable eve_dt_inicio',
                    createdCell: function (td, cellData, rowData, row, col) {
                        let accesskey = (rowData.eve_num_evento || 0) + '_' + (rowData.que_num_questionario || 0);
                        $(td)
                            .attr('id', `linh[${accesskey}][eve_dt_inicio]`)
                            .attr('row', row)
                            .attr('col', col)
                            .attr('campo', 'eve_dt_inicio')
                            .attr('data-eve_num_evento', rowData.eve_num_evento || '0')
                            .attr('data-que_num_questionario', rowData.que_num_questionario || '0')
                            .attr('accesskey', accesskey);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            var colorCancel = '';
                            let eve_dt_inicio = data;
                            let accesskey = (row.eve_num_evento || 0) + '_' + (row.que_num_questionario || 0);
                            return `
                                    <td  data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}" accesskey="${accesskey}">
                                        <input type="text" class="form-control eve_dt_inicio"
                                            name="inpu[${accesskey}][eve_dt_inicio]"
                                            id="inpu[${accesskey}][eve_dt_inicio]"
                                            data-eve_num_evento="${row.eve_num_evento || 0}" 
                                            data-que_num_questionario="${row.que_num_questionario || 0}"
                                            value="${eve_dt_inicio || ''}"
                                            accesskey="${accesskey}" style="${colorCancel || ''}"  readonly="readonly" />
                                             
                                    </td>
                            `;

                        }
                        return data;
                    }
                }
                , {
                    data: 'eve_dt_fim', className: 'editable eve_dt_fim',
                    createdCell: function (td, cellData, rowData, row, col) {
                        let accesskey = (rowData.eve_num_evento || 0) + '_' + (rowData.que_num_questionario || 0);
                        $(td)
                            .attr('id', `linh[${accesskey}][eve_dt_fim]`)
                            .attr('row', row)
                            .attr('col', col)
                            .attr('campo', 'eve_dt_fim')
                            .attr('data-eve_num_evento', rowData.eve_num_evento || '0')
                            .attr('data-que_num_questionario', rowData.que_num_questionario || '0')
                            .attr('accesskey', accesskey);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            var colorCancel = '';
                            let eve_dt_fim = data;
                            let accesskey = (row.eve_num_evento || 0) + '_' + (row.que_num_questionario || 0);
                            return `
                                    <td  data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}" accesskey="${accesskey}">
                                        <input type="text" class="form-control eve_dt_fim"
                                            name="inpu[${accesskey}][eve_dt_fim]"
                                            id="inpu[${accesskey}][eve_dt_fim]"
                                            data-eve_num_evento="${row.eve_num_evento || 0}" 
                                            data-que_num_questionario="${row.que_num_questionario || 0}"
                                            value="${eve_dt_fim || ''}"
                                            accesskey="${accesskey}" style="${colorCancel || ''}"  readonly="readonly" />
                                             
                                    </td>
                            `;

                        }
                        return data;
                    }
                }
                , {
                    data: 'eve_dt_inclusao', className: 'editable eve_dt_inclusao',
                    createdCell: function (td, cellData, rowData, row, col) {
                        let accesskey = (rowData.eve_num_evento || 0) + '_' + (rowData.que_num_questionario || 0);
                        $(td)
                            .attr('id', `linh[${accesskey}][eve_dt_inclusao]`)
                            .attr('row', row)
                            .attr('col', col)
                            .attr('campo', 'eve_dt_inclusao')
                            .attr('data-eve_num_evento', rowData.eve_num_evento || '0')
                            .attr('data-que_num_questionario', rowData.que_num_questionario || '0')
                            .attr('accesskey', accesskey);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            var colorCancel = '';
                            let eve_dt_inclusao = data;
                            let accesskey = (row.eve_num_evento || 0) + '_' + (row.que_num_questionario || 0);
                            return `
                                    <td  data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}" accesskey="${accesskey}">
                                        <input type="text" class="form-control eve_dt_inclusao"
                                            name="inpu[${accesskey}][eve_dt_inclusao]"
                                            id="inpu[${accesskey}][eve_dt_inclusao]"
                                            data-eve_num_evento="${row.eve_num_evento || 0}" 
                                            data-que_num_questionario="${row.que_num_questionario || 0}"
                                            value="${eve_dt_inclusao || ''}"
                                            accesskey="${accesskey}" style="${colorCancel || ''}"  readonly="readonly" />
                                             
                                    </td>
                            `;

                        }
                        return data;
                    }
                }
                , {
                    data: 'eve_situacao', className: 'editable eve_situacao',
                    createdCell: function (td, cellData, rowData, row, col) {
                        let accesskey = (rowData.eve_num_evento || 0) + '_' + (rowData.que_num_questionario || 0);
                        $(td)
                            .attr('id', `linh[${accesskey}][eve_situacao]`)
                            .attr('row', row)
                            .attr('col', col)
                            .attr('campo', 'eve_situacao')
                            .attr('data-eve_num_evento', rowData.eve_num_evento || '0')
                            .attr('data-que_num_questionario', rowData.que_num_questionario || '0')
                            .attr('accesskey', accesskey);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            var colorCancel = '';
                            let eve_situacao = data;
                            let accesskey = (row.eve_num_evento || 0) + '_' + (row.que_num_questionario || 0);
                            return `
                                    <td  data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}" accesskey="${accesskey}">
                                        <input type="text" class="form-control eve_situacao"
                                            name="inpu[${accesskey}][eve_situacao]"
                                            id="inpu[${accesskey}][eve_situacao]"
                                            data-eve_num_evento="${row.eve_num_evento || 0}" 
                                            data-que_num_questionario="${row.que_num_questionario || 0}"
                                            value="${eve_situacao || ''}"
                                            accesskey="${accesskey}" style="${colorCancel || ''}"  readonly="readonly" />
                                             
                                    </td>
                            `;

                        }
                        return data;
                    }
                }
                , {
                    data: 'que_contexto', className: 'editable que_contexto',
                    createdCell: function (td, cellData, rowData, row, col) {
                        let accesskey = (rowData.eve_num_evento || 0) + '_' + (rowData.que_num_questionario || 0);
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
                            let accesskey = (row.eve_num_evento || 0) + '_' + (row.que_num_questionario || 0);
                            return `
                                    <td  data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}" accesskey="${accesskey}">
                                        <input type="text" class="form-control que_contexto"
                                            name="inpu[${accesskey}][que_contexto]"
                                            id="inpu[${accesskey}][que_contexto]"
                                            data-eve_num_evento="${row.eve_num_evento || 0}" 
                                            data-que_num_questionario="${row.que_num_questionario || 0}"
                                            value="${que_contexto || ''}"
                                            accesskey="${accesskey}" style="${colorCancel || ''}"  readonly="readonly" />
                                             
                                    </td>
                            `;

                        }
                        return data;
                    }
                }
                , {
                    data: 'que_publico_alvo', className: 'editable que_publico_alvo',
                    createdCell: function (td, cellData, rowData, row, col) {
                        let accesskey = (rowData.eve_num_evento || 0) + '_' + (rowData.que_num_questionario || 0);
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
                            let accesskey = (row.eve_num_evento || 0) + '_' + (row.que_num_questionario || 0);
                            return `
                                    <td  data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}" accesskey="${accesskey}">
                                        <input type="text" class="form-control que_publico_alvo"
                                            name="inpu[${accesskey}][que_publico_alvo]"
                                            id="inpu[${accesskey}][que_publico_alvo]"
                                            data-eve_num_evento="${row.eve_num_evento || 0}" 
                                            data-que_num_questionario="${row.que_num_questionario || 0}"
                                            value="${que_publico_alvo || ''}"
                                            accesskey="${accesskey}" style="${colorCancel || ''}"  readonly="readonly" />
                                             
                                    </td>
                            `;

                        }
                        return data;
                    }
                }
                , {
                    data: 'que_nota_minima', className: 'editable que_nota_minima',
                    createdCell: function (td, cellData, rowData, row, col) {
                        let accesskey = (rowData.eve_num_evento || 0) + '_' + (rowData.que_num_questionario || 0);
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
                            let accesskey = (row.eve_num_evento || 0) + '_' + (row.que_num_questionario || 0);
                            return `
                                    <td  data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}" accesskey="${accesskey}">
                                        <input type="text" class="form-control que_nota_minima"
                                            name="inpu[${accesskey}][que_nota_minima]"
                                            id="inpu[${accesskey}][que_nota_minima]"
                                            data-eve_num_evento="${row.eve_num_evento || 0}" 
                                            data-que_num_questionario="${row.que_num_questionario || 0}"
                                            value="${que_nota_minima || ''}"
                                            accesskey="${accesskey}" style="${colorCancel || ''}"  readonly="readonly" />
                                             
                                    </td>
                            `;

                        }
                        return data;
                    }
                }
                , {
                    data: 'que_dt_inclusao', className: 'editable que_dt_inclusao',
                    createdCell: function (td, cellData, rowData, row, col) {
                        let accesskey = (rowData.eve_num_evento || 0) + '_' + (rowData.que_num_questionario || 0);
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
                            let que_dt_inclusao = data;
                            let accesskey = (row.eve_num_evento || 0) + '_' + (row.que_num_questionario || 0);
                            return `
                                    <td  data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}" accesskey="${accesskey}">
                                        <input type="text" class="form-control que_dt_inclusao"
                                            name="inpu[${accesskey}][que_dt_inclusao]"
                                            id="inpu[${accesskey}][que_dt_inclusao]"
                                            data-eve_num_evento="${row.eve_num_evento || 0}" 
                                            data-que_num_questionario="${row.que_num_questionario || 0}"
                                            value="${que_dt_inclusao || ''}"
                                            accesskey="${accesskey}" style="${colorCancel || ''}"  readonly="readonly" />
                                             
                                    </td>
                            `;

                        }
                        return data;
                    }
                }
                , {
                    data: 'que_situacao', className: 'editable que_situacao',
                    createdCell: function (td, cellData, rowData, row, col) {
                        let accesskey = (rowData.eve_num_evento || 0) + '_' + (rowData.que_num_questionario || 0);
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
                            let accesskey = (row.eve_num_evento || 0) + '_' + (row.que_num_questionario || 0);
                            return `
                                    <td  data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}" accesskey="${accesskey}">
                                        <input type="text" class="form-control que_situacao"
                                            name="inpu[${accesskey}][que_situacao]"
                                            id="inpu[${accesskey}][que_situacao]"
                                            data-eve_num_evento="${row.eve_num_evento || 0}" 
                                            data-que_num_questionario="${row.que_num_questionario || 0}"
                                            value="${que_situacao || ''}"
                                            accesskey="${accesskey}" style="${colorCancel || ''}"  readonly="readonly" />
                                             
                                    </td>
                            `;

                        }
                        return data;
                    }
                }
                , {
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        let accesskey = (rowData.eve_num_evento || 0) + '_' + (rowData.que_num_questionario || 0);
                        $(td)
                            .attr('id', `linh[${accesskey}][email]`)
                            .attr('row', row)
                            .attr('col', col)
                            .attr('campo', 'email')
                            .attr('data-eve_num_evento', rowData.eve_num_evento || '0')
                            .attr('data-que_num_questionario', rowData.que_num_questionario || '0')
                            .attr('accesskey', accesskey);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            let accesskey = (row.eve_num_evento || 0) + '_' + (row.que_num_questionario || 0);

                            return `
                                <td data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}" accesskey="${accesskey}" style="text-align: center;">
                                    <div class="form-group" style="padding-bottom:0px;margin-bottom: 2px;text-align: center;">
                                        
                                        <button type="button" class="btn btn-light btn-email-evento-questionario" style=""
                                            data-eve="${row.eve_num_evento}" data-que="${row.que_num_questionario}" title="Envio de e-Mails">
                                            <span accesskey="${accesskey}" id="inpu[${accesskey}][email]" style="" />
                                                 <i class="fa-regular fa-envelope text-info fa-lg"></i>
                                            </span>
                                        </button>
                                     
                                    </div>
                                </td>
                            `;

                        }
                        return data;
                    },
                    orderable: false
                }, {
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        let accesskey = (rowData.eve_num_evento || 0) + '_' + (rowData.que_num_questionario || 0);
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
                            let accesskey = (row.eve_num_evento || 0) + '_' + (row.que_num_questionario || 0);

                            return `
                                <td data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}" accesskey="${accesskey}" style="text-align: center;">
                                    <div class="form-group" style="padding-bottom:0px;margin-bottom: 2px;text-align: center;">
                                        
                                        <button type="button" class="btn btn-light btn-editar-evento-questionario" style=""
                                            data-eve="${row.eve_num_evento}" data-que="${row.que_num_questionario}" title="Editar Evento Questionário">
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
                        let accesskey = (rowData.eve_num_evento || 0) + '_' + (rowData.que_num_questionario || 0);
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
                            let accesskey = (row.eve_num_evento || 0) + '_' + (row.que_num_questionario || 0);
                            return `
                                <td data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}" accesskey="${accesskey}" style="text-align: center;">
                                    <div class="form-group" style="padding-bottom:0px;margin-bottom: 2px;text-align: center;">
                                        <button type="button" class="btn btn-light btn-cancelar-evento-questionario" style=""
                                            data-eve="${row.eve_num_evento}" data-que="${row.que_num_questionario}" title="Cancelar Evento Questionário">
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
                { targets: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], visible: true }, { targets: [0, 1, 16, 17], visible: false }
            ],
            order: [[1, 'asc']],
            autoFill: true
        }).draw();

        // console.log('DataTable inicializado com sucesso.');
    }
 
    export function carregarEventos() {
        var jqxhr = $.post("/Envioemailrelpont/ObterEventosGeralFinal", {}, function (data) {
            // console.log("success");
        

            if (data.sucesso) {

                if (data.lista != null && data.lista.length > 0) {
                  
                    let listaEventos = processDataForTable(data.lista);
                    console.table(listaEventos);
                    EnvMailRelPontIndex.initializeDataTableEventoQuestionario(listaEventos, EnvMailRelPontIndex._mes, EnvMailRelPontIndex._ano,100);

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
                    // console.log("second success");
                } else { console.log("dados não encontrado"); }

                // console.log(data);
            })
            .fail(function (_XMLHttpRequest_, textStatus, errorThrown) {
                console.log("error");
                console.log(_XMLHttpRequest_); console.log(textStatus); console.log(errorThrown);
                // ScriptsConfig.failFunctionAjax(_XMLHttpRequest_, textStatus, errorThrown);
            })
            .always(function (data) {
                // console.log("finished");
                // console.log(data);
                $('#botoes').css('display', 'block')
                //$('.text-end').css('text-align','right !important')
            });
    }

    export let listaBusca = EnvMailRelPontIndex.listaUsuariosPontos;

    export function buscarUsuarioaNoRelatorio() {
        const normalizeStr = (str: string) => String(str || '').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        let buscaRaw: string = String($('input[name="buscaLimpaPorNomeOuCPF"]').val() || '').trim();
        if (!buscaRaw) {
            buscaRaw = String($('input[name="buscaLimpa"]').val() || '').trim();
        }

        $('input[name="busca"]').val(buscaRaw);

        const buscaText = normalizeStr(buscaRaw);
        const searchDigits = buscaRaw.replace(/\D/g, '');

        console.log('=== INICIANDO BUSCA ===', { buscaRaw, buscaText, searchDigits });
        console.log('listaUsuariosPontos disponível:', !!EnvMailRelPontIndex.listaUsuariosPontos);
        console.log('listaUsuariosPontos.length:', EnvMailRelPontIndex.listaUsuariosPontos?.length || 0);
        console.log('>>> CONTEÚDO completo de listaUsuariosPontos:');
        console.table(EnvMailRelPontIndex.listaUsuariosPontos);

        const lista = EnvMailRelPontIndex.listaUsuariosPontos || [];
        EnvMailRelPontIndex.listaBusca = [];

        if (!Array.isArray(lista) || lista.length === 0) {
            console.warn('Lista de usuários está vazia!');
            return [];
        }

        const participantesReais = lista.filter(x => x && (String(x.usr_cpf || '').trim() !== '' || String(x.usr_nome || '').trim() !== ''));
        console.log(`>>> Participantes reais encontrados: ${participantesReais.length} de ${lista.length}`);

        if (!buscaRaw) {
            EnvMailRelPontIndex.listaBusca = lista.slice();
            return EnvMailRelPontIndex.listaBusca;
        }

        const matchedParticipants = participantesReais.filter(row => {
            const cpfClean = String(row.usr_cpf || '').replace(/\D/g, '');
            const nomeNormalized = normalizeStr(String(row.usr_nome || ''));

            const cpfMatches = searchDigits.length > 0 && cpfClean.includes(searchDigits);
            const nomeMatches = buscaText.length > 0 && nomeNormalized.includes(buscaText);
            return cpfMatches || nomeMatches;
        });

        console.log(`>>> Participantes que batem com a busca: ${matchedParticipants.length}`);

        if (matchedParticipants.length === 0) {
            EnvMailRelPontIndex.listaBusca = [];
            return [];
        }

        const filteredList: typeof lista = [];
        const insertedHeaders = new Set<string>();

        const addHeader = (headerRow) => {
            if (!headerRow) {
                return;
            }
            const key = `${headerRow.eve_num_evento}|${headerRow.que_num_questionario}`;
            if (!insertedHeaders.has(key)) {
                filteredList.push(headerRow);
                insertedHeaders.add(key);
            }
        };

        matchedParticipants.forEach(row => {
            addHeader(lista.find(x => x.usr_num_usuario === 0 && x.eve_num_evento === row.eve_num_evento && x.que_num_questionario === 0 && String(x.usr_cpf || '').trim() === '' && String(x.usr_nome || '').trim() === ''));
            addHeader(lista.find(x => x.usr_num_usuario === 0 && x.eve_num_evento === row.eve_num_evento && x.que_num_questionario === row.que_num_questionario && String(x.usr_cpf || '').trim() === '' && String(x.usr_nome || '').trim() === ''));
            filteredList.push(row);
        });

        EnvMailRelPontIndex.listaBusca = filteredList;
        console.log('=== RESULTADO FINAL: registros filtrados ===');
        console.table(EnvMailRelPontIndex.listaBusca);
        return EnvMailRelPontIndex.listaBusca;
    }

    export function carregarQuestionario() {
        console.log('Carregando o questionário');
        let busca: string = $('input[name="busca"]').val() as string;

        busca = busca.replace(/\D/g, "");
        var eve_num_evento = $('input[name="eve_num_evento"]').val();
        var que_num_questionario = $('input[name="que_num_questionario"]').val();


        console.log('busca : ' + busca);
        console.log('eve_num_evento : ' + eve_num_evento);
        console.log('que_num_questionario : ' + que_num_questionario);

        if (busca !== undefined && busca !== null && busca.length > 6) {

        } else {
            ScriptsConfig.swalconfirmeActionAlerta.fire({
                title: 'Atenção',
                html: 'Você precisa inserir o CPF do usuário',
                icon: "warning",
                showCancelButton: false,
                showDenyButton: false,
                confirmButtonText: '<i class="fa-solid fa-turn-up"></i> Ok',
                denyButtonText: 'Não <i class="fa-solid fa-arrow-right-from-bracket"></i>',
                cancelButtonText: "",
                reverseButtons: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
                backdrop: true
            }).then((result) => {
                if (result.isConfirmed) {
                    // window.location.href = '/Home/Index';
                } else {
                    // window.location.href = '/Home/Index';
                }
            });
        }

        var jqxhr = $.post("/Envioemailrelpont/ObterQuestionarioPontuacaoConferenciaPorCpf", { usr_cpf: busca, eve_num_evento: eve_num_evento, que_num_questionario: que_num_questionario }, function (data) {
            console.log("success");
            console.log(data);
            if (data.evento != undefined && data.evento != null && data.evento.eve_num_evento !== undefined) {
                let cab_eve_descricao: string = data.evento.eve_descricao || '';
                $('#cab_eve_nome').text(data.evento.eve_nome || '');
                $('#cab_eve_descricao').empty().html(
                    (cab_eve_descricao.length >= 100)
                        ? cab_eve_descricao.substring(0, 100) + '<span class="text-danger" style="cursor:pointer;"> ... Saiba mais ... </span>'
                        : cab_eve_descricao
                );
                $('#cab_eve_descricao_hidden').text(cab_eve_descricao);
                $('#cab_que_contexto').text('Questionário : ' + (data.evento.que_contexto || ''));
                $('#cab_que_publico_alvo').text('Público destinado : ' + (data.evento.que_publico_alvo || ''));
                $('#cab_que_nota_minima').text('Nota mínima : ' + (data.evento.que_nota_minima ? data.evento.que_nota_minima.replace('.', ',') : '0,00'));
            }

            if (data.sucesso) {
                var dados = data.lista;
                console.log("dados encontrados")
                if (dados && dados.length > 0) {

                    if (data.qtde_eventos_vigentes > 0) {

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
                                } else {
                                }
                            });
                        } else {
                            console.table(dados);
                            // fazz o foreach para obter o campo recrrente na lista
                            $('input[name="usr_num_usuario"]').val(dados[0].usr_num_usuario);
                            // $('input[name="usr_num_usuario"]').val(dados[0].qsr_num_resposta);
                            // $('input[name="eve_num_evento"]').val(dados[0].eve_num_evento);
                            // $('input[name="que_num_questionario"]').val(dados[0].que_num_questionario);
                            // var eve_num_evento = dados['eve_num_evento'];
                            EnvMailRelPontIndex.gerarHTML(agruparQuestoes(dados));

                            $('#botoes').css('display', 'block');
                        }
                    } else {
                        ScriptsConfig.swalconfirmeActionAlertaWarning.fire({
                            icon: 'info',
                            title: '<code style="color:#045C99;font-size:22px;">Olá</code><br>',
                            imageUrl: "/Content/img/logo-ageprev-ms-origin.png",
                            imageWidth: 300,
                            width: 1080,
                            height: 700,
                            html: '<span style="color:#045C99;font-size:20px;">Não há eventos nem questionários disponíveis para a consulta</b></span>',
                            showCancelButton: false,
                            confirmButtonText: "Deseja voltar ao início?",
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
                } else {
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
                            // window.location.href = '/Home/Index';
                        } else {
                            // window.location.href = '/Home/Index';
                        }
                    });
                }
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...2",
                    html: data.msg,
                    footer: '<code>' + data.lista + '</code>'
                });
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
            .always(function () {
                console.log("finished");
                // $('.text-end').css('text-align','right !important')
            });


    }

    export function gerarPDF() {
        let busca: string = $('input[name="busca"]').val() as string;

        busca = busca.replace(/\D/g, "");
        var eve_num_evento = $('input[name="eve_num_evento"]').val();
        var que_num_questionario = $('input[name="que_num_questionario"]').val();
        
        var jqxhr = $.post("/Envioemailrelpont/GerarPdfPorCpfEventoQuestionario", { usr_cpf: busca, eve_num_evento: eve_num_evento, que_num_questionario: que_num_questionario }, function (data) {
            console.log("success");
            console.log(data);

            if (data.sucesso) {
                window.open('/Envioemailrelpont/abrirPdfGerado', 'popup', 'height=1024,width=900,toolbar=no'); //'_blank'
                var dados = data.lista;
                console.log("dados encontrados")

            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...2",
                    html: data.msg,
                    footer: '<code>' + data.lista + '</code>'
                });
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
            .always(function () {
                console.log("finished");
                // $('.text-end').css('text-align','right !important')
            });
  
    }

    export function GerarPdfDeTodosEnvMail() {
        let busca: string = $('input[name="busca"]').val() as string;

        busca = busca.replace(/\D/g, "");
        var eve_num_evento = $('input[name="eve_num_evento"]').val();
        var que_num_questionario = $('input[name="que_num_questionario"]').val();

        ScriptsConfig.swalWithBootstrapButtons.fire({
            icon: 'info',
            title: '<span style="color:#045C99;font-size:22px;">Envio de e-Mails</span>',
            imageUrl: "/Content/img/load-gif.gif",
            imageWidth: 300,
            width: 1080,
            height: 700,
            html: '<span style="color:#045C99;font-size:20px;"><b>por favor, aguarde...</b></span>',
            showCancelButton: false,
            confirmButtonText: "Ok",
            cancelButtonText: "Não",
            reverseButtons: false,
            backdrop: `
                rgba(100,100,153,0.3)
                url("/Content/img/loading-w.webp")
                left top
                no-repeat
            `,
            footer: ScriptsConfig.footerAlert
            // backdrop: true,
        }).then((result) => {
            if (result.isConfirmed) {

            } else {
                // window.location.href = '/Home/Index';
            }
        });

        var jqxhr = $.post("/Envioemailrelpont/GerarPdfDeTodosEnvMail", { usr_cpf: busca, eve_num_evento: eve_num_evento, que_num_questionario: que_num_questionario }, function (data) {
            console.log("success");
            console.log(data);
            let icone: string = ((data.sucesso) ? 'success' : "warning");
            let mensagem: string = (
                (data.sucesso)
                    ? 'Envio de e-Mails realizado com sucesso!'
                    : 'Envio de e-Mails falhou!'
            );
            let msg_erros: string = ``;
            let mail_qtd_envio: number = data.mail_qtd_envio;
            let mail_qtd_erros: number = data.mail_qtd_erros;
            if (data.mail_qtd_erros > 0) {
                console.log(`Quantidade de e-Mail enviado : ${mail_qtd_envio}`);
                console.log(`Quantidade de erros de e-Mail enviado : ${mail_qtd_erros}`);
                console.log(data.mail_msg_erros);
                msg_erros = `<span class="text-success">Quantidade de e-Mail enviado : ${mail_qtd_envio}</span>`
                    + `<span class="text-danger">Quantidade de erros de e-Mail enviado : ${mail_qtd_erros}</span>`;
            } else {
                msg_erros = `</br><span class="text-success" style="font-size:20px;"><b>Quantidade de e-Mail enviado : ${mail_qtd_envio}</b></span>`
            }
            
            ScriptsConfig.swalWithBootstrapButtons.fire({
                icon: icone,
                title: '<span style="color:#045C99;font-size:22px;">Envio de e-Mails</span><br>'
                    + '<code style="color:#045C99;font-size:22px;">Notas do Questionário</code>',
                imageUrl: "/Content/img/logo-ageprev-ms-origin.png",
                imageWidth: 300,
                width: 1080,
                height: 700,
                html: '<span style="color:#045C99;font-size:20px;"><b> ' + mensagem + '</b></span>' + msg_erros,
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
            
        }, "json")
            .done(function (data) {
                if (data !== null) { console.log("second success"); } else { console.log("dados não encontrado"); }   
            })
            .fail(function (_XMLHttpRequest_, textStatus, errorThrown) {
                console.log("error");
                console.log(_XMLHttpRequest_); console.log(textStatus); console.log(errorThrown);
                // ScriptsConfig.failFunctionAjax(_XMLHttpRequest_, textStatus, errorThrown);
                ScriptsConfig.swalconfirmeActionAlerta.fire({
                    title: 'Erro',
                    html: "Não foi possível enviar os e-Mails!",
                    icon: "warning",
                    showCancelButton: true,
                    showDenyButton: false,
                    confirmButtonText: "Atualizar Pággina",
                    denyButtonText: 'Voltar para Página Anterior',
                    cancelButtonText: "Fechar",
                    reverseButtons: false,
                    backdrop: true,
                    footer: ScriptsConfig.footerAlert
                }).then((result) => {
                    if (result.isConfirmed) {
                        // window.location.reload();
                    } else if (result.isDenied) {
                        // window.location.href = '/Home/Index';
                    } else {
                        //  window.location.href = '/Home/Index';
                    }
                });
            })
            .always(function () {
                console.log("finished");
                // $('.text-end').css('text-align','right !important')
            });
    }

    export function gerarPDFPorCpf(usr_cpf: string, eve_num_evento?: number, que_num_questionario?: number) {
        const busca = String(usr_cpf || '').replace(/\D/g, '');
        const eve = eve_num_evento || Number($('input[name="eve_num_evento"]').val() as string || '0');
        const que = que_num_questionario || Number($('input[name="que_num_questionario"]').val() as string || '0');

        if (!busca) {
            Swal.fire({
                icon: 'warning',
                title: 'CPF inválido',
                html: 'CPF não informado para gerar o PDF.',
                footer: '',
            });
            return;
        }

        $.post('/Envioemailrelpont/GerarPdfPorCpfEventoQuestionario', { usr_cpf: busca, eve_num_evento: eve, que_num_questionario: que }, function (data) {
            console.log('success');
            console.log(data);

            if (data.sucesso) {
                window.open('/Envioemailrelpont/abrirPdfGerado', 'popup', 'height=1024,width=900,toolbar=no');
                console.log('dados encontrados');
            } else {
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
                } else {
                    console.log('dados não encontrado');
                }
            })
            .fail(function (_XMLHttpRequest_, textStatus, errorThrown) {
                console.log('error');
                console.log(_XMLHttpRequest_); console.log(textStatus); console.log(errorThrown);
            })
            .always(function () {
                console.log('finished');
            });
        EnvMailRelPontIndex.carregarQuestionario();
    }
    
    $(function () {

        _ano = '2026';
        _mes = '6';

        setTimeout(() => {
            console.log("This prints after 2 seconds!");
            EnvMailRelPontIndex.carregarEventos();
        }, 200);
        
        $('#table-lista-itens tbody').on('click', 'button.btn-gerar-pdf', function () {
            const cpf = String($(this).data('usrcpf') || '');
            const eve = Number($(this).data('eve') || 0);
            const que = Number($(this).data('que') || 0);
            if (cpf) {
                $('input[name="busca"]').val(cpf);
                EnvMailRelPontIndex.gerarPDFPorCpf(cpf, eve, que);
            }
        });

        $('#table-lista-evento-questionario tbody').on('click', 'button.btn-email-evento-questionario', function () {
            const eve_num_evento        = Number($(this).data('eve') || 0);
            const que_num_questionario  = Number($(this).data('que') || 0);
            eventoQuestionarioPontosPorUsuario(eve_num_evento, que_num_questionario)
        });

        $('input[name="buscaLimpa"]').on('input', function () {
            // Remove all non-numeric characters before saving
            var cleanValue = ($(this).val() as string);
            $('input[name="busca"]').val(cleanValue)
            console.log("Cleaned:", cleanValue);
        });

        $('button[name="btnGerarPDF"]').on('click', function (e) {
            EnvMailRelPontIndex.gerarPDF();
        });

        $('button[name="GerarPdfDeTodosEnvMail"]').on('click', function (e) {
            ScriptsConfig.swalWithBootstrapButtons.fire({
                icon: 'warning',
                title: '<span style="color:#045C99;font-size:22px;">Envio de e-Mails</span>',
                imageUrl: "/Content/img/logo-ageprev-ms-origin.png",
                imageWidth: 300,
                width: 1080,
                height: 700,
                html: '<span style="color:#045C99;font-size:20px;"><b> Deseja enviar os e-mails com os resultados dos questionários?</b></span>',
                showCancelButton: true,
                confirmButtonText: "Sim",
                cancelButtonText: "Não",
                reverseButtons: false,
                footer: ScriptsConfig.footerAlert,
                backdrop: true,
            }).then((result) => {
                if (result.isConfirmed) {
                    $.when(EnvMailRelPontIndex.GerarPdfDeTodosEnvMail()).then(function (data, textStatus, jqXHR) {

                    });
                } else {
                    // window.location.href = '/Home/Index';
                }
            });
        });

        
        $('button[name="btnBuscar"]').on('click', function (e) {
            // EnvMailRelPontIndex.carregarQuestionario();
            $.when(EnvMailRelPontIndex.buscarUsuarioaNoRelatorio()).then(function (data, textStatus, jqXHR) {
                $.when(EnvMailRelPontIndex.initializeDataTable(EnvMailRelPontIndex.listaBusca, _ano, _mes, 100)).then(function (data, textStatus, jqXHR) {
                    $('input[name="buscaLimpa"]').val('');
                    console.log('Pontuação carregada com filtro');
                });
            });
        });

        $('#content-table').on('click', 'button.btn-voltar-to-lista-eventos', function () {
            $('#div-lista-evento-question').css('display', 'block');
            $('#content-table').css('display', 'none');
        });

        $('#questionario-pontuacao').on('click', 'button.btn-voltar-to-lista-participantes', function () {
            $('#content-table').css('display', 'block');
            $('#questionario-pontuacao').css('display', 'none');
        });


        /*
        setTimeout(() => {
            console.log("This prints after 2 seconds!");
            fetchDataAndInitializeTable();
        }, 200);
        */

    });

}

declare module "EnvMailRelPontIndex" {
    export = EnvMailRelPontIndex;
}