// File: script-page/relpontuacao-conferencia.ts

/// <reference path="../config-scripts/@types/jquery/index.d.ts" />
/// <reference path="../config-scripts/@types/jquery.form/index.d.ts" />

/// <reference path="../config-scripts/@types/datatables.net/types/types.d.ts" />
/// <reference path="../config-scripts/sweetalert2.d.ts" />
/// <reference path="../config-scripts/config.ts" />
/// <reference path="../config-scripts/ScriptsConfig.d.ts" />

namespace RelPontConferencia {
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

    export let listaBusca: Array<{
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

    export let participantsReais: Array<{
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

    export function initializeDataTableEventoQuestionario(data, mes, ano, pageLength) {

        // console.log('Inicializando DataTable...');
        if (!Array.isArray(data)) {
            console.error('Os dados recebidos não são válidos:', data);
            data = [];
        }

        if (RelPontConferencia.dataTableInstanceEveQuestion) {
            RelPontConferencia.dataTableInstanceEveQuestion.destroy();
        }
        $('#tb-itens-evento-questionario tbody').empty();

        // console.log('Inicializando DataTable com os dados recebidos...');
        RelPontConferencia.dataTableInstanceEveQuestion = $('#table-lista-evento-questionario').DataTable({
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
                var table = RelPontConferencia.dataTableInstanceEveQuestion;
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
                            .attr('id', `linh[${accesskey}][conferencia]`)
                            .attr('row', row)
                            .attr('col', col)
                            .attr('campo', 'conferencia')
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
                                        
                                        <button type="button" class="btn btn-light btn-conferencia-evento-questionario" style=""
                                            data-eve="${row.eve_num_evento}" data-que="${row.que_num_questionario}" title="Envio de e-Mails">
                                            <span accesskey="${accesskey}" id="inpu[${accesskey}][conferencia]" style="" />
                                                 <i class="fa-solid fa-clipboard-list text-info fa-lg"></i>
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
                { targets: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], visible: true }, { targets: [0, 1, 16, 17, 18], visible: false }
            ],
            order: [[1, 'asc']],
            autoFill: true
        }).draw();

        // console.log('DataTable inicializado com sucesso.');
    }


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
                RelPontConferencia.dataTableInstance = null;
            }
        } catch (e) {
            console.warn('Erro ao verificar/destruir DataTable anterior:', e);
        }

        $('#table-lista-itens tbody').empty();

        // console.log('Inicializando DataTable com os dados recebidos...');
        RelPontConferencia.dataTableInstance = $('#table-lista-itens').DataTable({
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
                var table = RelPontConferencia.dataTableInstance;

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
                            .attr('accesskey', rowData.usr_num_usuario || RelPontConferencia.tempo);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            var colorCancel = '';
                            let usr_cpf = data;

                            if (row.usr_num_usuario == 0 && row.que_num_questionario == 0) {
                                return `
                                    <td data-usr_num_usuario="${row.usr_num_usuario || RelPontConferencia.tempo}" data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}"
                                         accesskey="${row.usr_num_usuario || RelPontConferencia.tempo}" style="text-align:center; background-color:  #337ab7 ;">
                                         <div class="form-control text-white" style="text-align:center; background-color: #337ab7;" >Evento<div>     
                                    </td>

                            `;
                            }
                            else if (row.usr_num_usuario == 0 && row.que_num_questionario > 0) {
                                return `
                                    <td data-usr_num_usuario="${row.usr_num_usuario || RelPontConferencia.tempo}" data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}"
                                         accesskey="${row.usr_num_usuario || RelPontConferencia.tempo}" style="text-align:center; background-color:  #337ab7;">
                                         <div class="form-control text-white"  style="text-align:center; background-color:  #337ab7;" >Questionário<div>     
                                    </td>

                            `;
                            } else {
                                return `
                                    <td data-usr_num_usuario="${row.usr_num_usuario || RelPontConferencia.tempo}" data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}"
                                         accesskey="${row.usr_num_usuario || RelPontConferencia.tempo}">

                                        <input type="hidden" class="form-control usr_num_usuario"
                                            name="inpu[${row.usr_num_usuario || RelPontConferencia.tempo}][usr_num_usuario]"
                                            id="inpu[${row.usr_num_usuario || RelPontConferencia.tempo}][usr_num_usuario]"
                                            value="${row.usr_num_usuario || RelPontConferencia.tempo}"
                                            accesskey="${row.usr_num_usuario || RelPontConferencia.tempo}"  />

                                        <input type="hidden" class="form-control eve_num_evento"
                                            name="inpu[${row.usr_num_usuario || RelPontConferencia.tempo}][eve_num_evento]"
                                            id="inpu[${row.usr_num_usuario || RelPontConferencia.tempo}][eve_num_evento]"
                                            value="${row.eve_num_evento || 0}"
                                            accesskey="${row.usr_num_usuario || RelPontConferencia.tempo}"  />

                                        <input type="hidden" class="form-control que_num_questionario"
                                            name="inpu[${row.usr_num_usuario || RelPontConferencia.tempo}][que_num_questionario]"
                                            id="inpu[${row.usr_num_usuario || RelPontConferencia.tempo}][que_num_questionario]"
                                            value="${row.que_num_questionario || '0'}"
                                            accesskey="${row.usr_num_usuario || RelPontConferencia.tempo}"  />

                                        <input type="text" class="form-control usr_cpf"
                                            name="inpu[${row.usr_num_usuario || RelPontConferencia.tempo}][usr_cpf]"
                                            id="inpu[${row.usr_num_usuario || RelPontConferencia.tempo}][usr_cpf]"
                                            data-usr_num_usuario="${row.usr_num_usuario || RelPontConferencia.tempo}" 
                                            data-eve_num_evento="${row.eve_num_evento || 0}" 
                                            data-que_num_questionario="${row.que_num_questionario || 0}"
                                            value="${usr_cpf || ''}"
                                            onblur="javascript:RelPontConferencia.validarCampos(${row.usr_num_usuario || RelPontConferencia.tempo}, 'usr_cpf');"
                                            onclick="javascript:inputMascara();"
                                            maxlength="11"
                                            accesskey="${row.usr_num_usuario || RelPontConferencia.tempo}" style="max-width:130px; ${colorCancel || ''}"  readonly="readonly" />
                                             
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
                            .attr('accesskey', rowData.usr_num_usuario || RelPontConferencia.tempo);
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
                                    <td data-usr_num_usuario="${row.usr_num_usuario || RelPontConferencia.tempo}" data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}"
                                         accesskey="${row.usr_num_usuario || RelPontConferencia.tempo}" style="text-align:center; background-color:  #337ab7 ;">
                                         <div class="form-control text-white" style="text-align:center; background-color: #337ab7;" >${row.eve_nome || ''}<div>     
                                    </td>

                            `;
                            }
                            else if ((usr_nome == '' || usr_nome == null) && row.que_num_questionario > 0) {
                                return `
                                    <td data-usr_num_usuario="${row.usr_num_usuario || RelPontConferencia.tempo}" data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}"
                                         accesskey="${row.usr_num_usuario || RelPontConferencia.tempo}" style="text-align:center; background-color:  #337ab7;">
                                         <div class="form-control text-white"  style="text-align:center; background-color:  #337ab7;" >${row.que_contexto || ''}<div>     
                                    </td>

                            `;
                            } else {
                                return `
                                  <td
                                    data-usr_num_usuario="${row.usr_num_usuario || RelPontConferencia.tempo}" style="100%;padding-bottom:0px;vertical-align:bottom;"
                                    data-eve_num_evento="${row.eve_num_evento || 0}" 
                                    data-que_num_questionario="${row.que_num_questionario || 0}"
                                         accesskey="${row.usr_num_usuario || RelPontConferencia.tempo}" >
                                         <div class="form-group" style="100%;padding-bottom:0px;margin-bottom: 2px;">
                                            <input type="hidden" class="form-control usr_nome"
                                                name="inpu[${row.usr_num_usuario || RelPontConferencia.tempo}][usr_nome_hidden]"
                                                id="inpu[${row.usr_num_usuario || RelPontConferencia.tempo}][usr_nome_hidden]"
                                                value="${row.usr_nome || ''}"
                                                accesskey="${row.usr_num_usuario || RelPontConferencia.tempo}"  />
                                         
                                            <span  class="form-control usr_cpf" 
                                                    name="inpu[${row.usr_num_usuario || RelPontConferencia.tempo}][usr_cpf]"
                                                    id="inpu[${row.usr_num_usuario || RelPontConferencia.tempo}][usr_cpf]"
                                                    data-usr_num_usuario="${row.usr_num_usuario || RelPontConferencia.tempo}" 
                                                    data-eve_num_evento="${row.eve_num_evento || 0}" 
                                                    data-que_num_questionario="${row.que_num_questionario || 0}"
                                                    value="${row.usr_cpf || ''}"
                                                    onblur="javascript:RelPontConferencia.validarCampos(${row.usr_num_usuario || RelPontConferencia.tempo}, 'usr_cpf');"
                                                    onclick="javascript:inputMascara();"
                                                    maxlength="11"
                                                    accesskey="${row.usr_num_usuario || RelPontConferencia.tempo}" style="max-width:150px; float:left; ${colorCancel || ''}"  readonly="readonly" />${usr_cpf || ''}
                                            </span>
                                            <span  class="form-control" accesskey="${row.usr_num_usuario || RelPontConferencia.tempo}" 
                                                name="inpu[${row.usr_num_usuario || RelPontConferencia.tempo}][usr_nome]" id="inpu[${row.usr_num_usuario || RelPontConferencia.tempo}][usr_nome]"
                                                onblur="javascript:RelPontConferencia.validarCampos(${row.usr_num_usuario || RelPontConferencia.tempo},'usr_nome');"  readonly="readonly"
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
                            .attr('accesskey', rowData.usr_num_usuario || RelPontConferencia.tempo);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            // var colorCancel = ((row.pim_situacao === 'A') ? '' : 'color:red;');
                            // let valor = Number(data);
                            let eve_nome = data;
                            return `
                                  <td data-usr_num_usuario="${row.usr_num_usuario || RelPontConferencia.tempo}" data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}"
                                         accesskey="${row.usr_num_usuario || RelPontConferencia.tempo}">

                                    <input type="text" class="form-control" accesskey="${row.usr_num_usuario || RelPontConferencia.tempo}"  
                                        name="inpu[${row.usr_num_usuario || RelPontConferencia.tempo}][eve_nome]" id="inpu[${row.usr_num_usuario || RelPontConferencia.tempo}][eve_nome]"
                                        onblur="javascript:RelPontConferencia.validarCampos(${row.usr_num_usuario || RelPontConferencia.tempo},'eve_nome');"
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
                            .attr('accesskey', rowData.usr_num_usuario || RelPontConferencia.tempo);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            var colorCancel = ((row.pim_situacao === 'A') ? '' : 'color:red;');
                            let valor = Number(data);
                            if ((row.usr_cpf == '' || row.usr_cpf == null) && row.que_num_questionario == 0) {
                                return `
                                    <td data-usr_num_usuario="${row.usr_num_usuario || RelPontConferencia.tempo}" data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}"
                                         accesskey="${row.usr_num_usuario || RelPontConferencia.tempo}" style="text-align:center; background-color:  #337ab7 ;">
                                         <div><div>     
                                    </td>

                            `;
                            }
                            else if ((row.usr_cpf == '' || row.usr_cpf == null) && row.que_num_questionario > 0) {
                                return `
                                    <td data-usr_num_usuario="${row.usr_num_usuario || RelPontConferencia.tempo}" data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}"
                                         accesskey="${row.usr_num_usuario || RelPontConferencia.tempo}" style="text-align:center; background-color: #337ab7;padding-bottom:0px;">
                                         <span class="form-control text-white" style="text-align:center; background-color: #337ab7;" >Nota<span>
                                    </td>

                            `;
                            } else {
                                let pontuacao: number = Number(data.toFixed(2));
                                let nota = pontuacao?.toString().replace('.', ',',);

                                return `
                                    <td data-usr_num_usuario="${row.usr_num_usuario || RelPontConferencia.tempo}" data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}"
                                             accesskey="${row.usr_num_usuario || RelPontConferencia.tempo}" style="text-align: center;">

                                        <div class="form-group" style="100%;padding-bottom:0px;margin-bottom: 2px;">
                                            <span class="form-control" accesskey="${row.usr_num_usuario || RelPontConferencia.tempo}"  name="inpu[${row.usr_num_usuario || RelPontConferencia.tempo}][pontuacao]" id="inpu[${row.usr_num_usuario || RelPontConferencia.tempo}][pontuacao]"
                                            onblur="javascript:RelPontConferencia.validarCampos(${row.usr_num_usuario || RelPontConferencia.tempo},'pontuacao');"
                                   
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
                            .attr('accesskey', rowData.usr_num_usuario || RelPontConferencia.tempo);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            if ((row.usr_cpf == '' || row.usr_cpf == null) && row.que_num_questionario == 0) {
                                return `
                                    <td data-usr_num_usuario="${row.usr_num_usuario || RelPontConferencia.tempo}" data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}"
                                         accesskey="${row.usr_num_usuario || RelPontConferencia.tempo}" style="text-align:center; background-color:  #337ab7 ;">
                                         <div><div>     
                                    </td>

                            `;
                            }
                            else if ((row.usr_cpf == '' || row.usr_cpf == null) && row.que_num_questionario > 0) {
                                return `
                                    <td data-usr_num_usuario="${row.usr_num_usuario || RelPontConferencia.tempo}" data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}"
                                         accesskey="${row.usr_num_usuario || RelPontConferencia.tempo}" style="text-align:center; background-color: #337ab7;padding-bottom:0px;">
                                         <span class="form-control text-white" style="text-align:center; background-color: #337ab7;" >PDF<span>
                                    </td>

                            `;
                            } else {
                                return `
                                    <td data-usr_num_usuario="${row.usr_num_usuario || RelPontConferencia.tempo}" data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}"
                                             accesskey="${row.usr_num_usuario || RelPontConferencia.tempo}" style="text-align: center;">
                                        <div class="form-group" style="100%;padding-bottom:0px;margin-bottom: 2px;text-align: center;background-color: #e9ecef;">
                                            <span class="form-control" accesskey="${row.usr_num_usuario || RelPontConferencia.tempo}" id="inpu[${row.usr_num_usuario || RelPontConferencia.tempo}][pdf]" style="background-color: #e9ecef;"
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
        RelPontConferencia.listaEventos = [];
        data.forEach(q => {
            RelPontConferencia.listaEventos.push({
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
        return RelPontConferencia.listaEventos;
    }

    export function procesDadosUsuarioPonto(data) {
        // console.table(data);
        RelPontConferencia.listaUsuariosPontos = [];
        data.forEach(q => {
            RelPontConferencia.listaUsuariosPontos.push({
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
        return RelPontConferencia.listaUsuariosPontos;
    }


    export function agruparQuestoes(dados) {
        if (!Array.isArray(dados)) {
            console.warn('agruparQuestoes recebeu um valor inválido:', dados);
            return [];
        }

        const mapa: { [key: string]: any } = {};

        dados.forEach((item, index) => {
            const nu = item.usr_num_usuario;
            const ne = item.eve_num_evento;
            const nq = item.que_num_questionario;
            const q = item.qst_num_questao;
            const enunciado = String(item.qst_enunciado || '').trim();

            const questionKey = q !== undefined && q !== null && q !== '' && q !== 0
                ? String(q)
                : `missing-${index}`;

            const key = `${ne || 0}|${nq || 0}|${questionKey}|${enunciado}`;

            if (!mapa[key]) {
                mapa[key] = {
                    usr_num_usuario: nu,
                    eve_num_evento: ne,
                    que_num_questionario: nq,
                    enunciado: enunciado,
                    num: q !== undefined && q !== null ? q : index,
                    ponto_alvo_q: item.ponto_alvo_q,
                    ponto_q: item.ponto_q,
                    nota_q: item.nota_q,
                    usr_nome: item.usr_nome,
                    pontuacao: item.pontuacao,
                    respostas: []  // SEMPRE inicializar como array
                };
            }

            // Garantir que respostas existe e é um array
            if (!Array.isArray(mapa[key].respostas)) {
                mapa[key].respostas = [];
            }

            mapa[key].respostas.push({
                num: item.qsr_num_resposta,
                enunciado: item.qsr_enunciado,
                correta: item.qsr_e_correta === 'S',
                qsr_e_correta: item.qsr_e_correta,
                qsr_num_resposta_usuario: item.qsr_num_resposta_usuario
            });
        });

        return Object.values(mapa).sort((a, b) => {
            const aNum = Number(a.num);
            const bNum = Number(b.num);
            if (!Number.isFinite(aNum) || !Number.isFinite(bNum)) {
                return String(a.enunciado || '').localeCompare(String(b.enunciado || ''));
            }
            return aNum - bNum;
        });
    }

    export function gerarHTML(questoes) { 
        if (!Array.isArray(questoes)) {
            console.warn('gerarHTML recebeu questoes inválido:', questoes);
            return;
        }

        if (questoes.length === 0) {
            container = document.getElementById('questionario');
            if (container) {
                container.innerHTML = '<div class="alert alert-info">Nenhuma questão encontrada para exibição.</div>';
            }
            return;
        }

        // Garantir que todas as questões têm respostas como array
        const questoesValidas = questoes.map(q => ({
            ...q,
            respostas: Array.isArray(q.respostas) ? q.respostas : []
        })).filter(q => q.respostas.length > 0);

        if (questoesValidas.length === 0) {
            console.warn('gerarHTML: nenhuma questão com respostas válidas');
            container = document.getElementById('questionario');
            if (container) {
                container.innerHTML = '<div class="alert alert-info">Nenhuma questão com respostas encontrada.</div>';
            }
            return;
        }

        const questoesOrdenadas = [...questoesValidas].map((q, index) => ({
            ...q,
            num: q.num !== undefined && q.num !== null ? q.num : index
        })).sort((a, b) => {
            const aNum = Number(a.num);
            const bNum = Number(b.num);
            if (!Number.isFinite(aNum) || !Number.isFinite(bNum)) {
                return String(a.enunciado || '').localeCompare(String(b.enunciado || ''));
            }
            return aNum - bNum;
        });

        container = document.getElementById('questionario');
        if (!container) {
            console.warn('Elemento #questionario não encontrado.');
            return;
        }
        container.innerHTML = '';

        // nota do usuário no cabeçalho
        const cardUser = document.createElement('div');
        cardUser.className = 'card border-light';
        const bodyUser = document.createElement('div');
        bodyUser.className = 'card-body border-light';
        bodyUser.style = 'background-color: #fefefe;border-radius: 8px;';
        bodyUser.innerHTML = ` <table class="table table-striped-columns form-group"><tr>
                                <td><span class="form-label" id="nomeUser">${questoesOrdenadas[0]?.usr_nome || ''}</span></td>
                                <td><span class="form-label" id="notaUser">Nota : ${questoesOrdenadas[0]?.pontuacao || 0}</span></td>
                                </tr>
                             </table> `;
        cardUser.appendChild(bodyUser);
        container.appendChild(cardUser);

        questoesOrdenadas.forEach(q => {
            const card = document.createElement('div');
            card.className = 'card border-light';
            const notap = document.createElement('div');
            notap.style = 'text-align:left;';
            notap.innerHTML = (q.nota_q === 1)
                ? `<i class="fa-solid fa-check text-success fa-lg"></i> correta`
                : ` <i class="fa-solid fa-xmark text-danger fa-lg"></i> incorreta`

            const header = document.createElement('div');
            header.className = 'card-header text-white';
            header.style = 'background-color: #337ab7;border-radius: 8px;font-family: sans-serif; font-weight: 800;';
            header.innerHTML = `
            <h4><b id="Quest[${q.num}][qst_enunciado]">${q.enunciado}</b></h4>
            <input type="hidden" name="Quest[${q.num}][0][qst_num_questao]" id="Quest[${q.num}][qst_num_questao]" value="${q.num}">`;

            const body = document.createElement('div');
            body.className = 'card-body border-light';
            body.style = 'background-color: #fefefe;border-radius: 8px;';

            const ul = document.createElement('ul');
            ul.className = 'list-group list-group-flush';

            q.respostas.forEach(r => {
                const li = document.createElement('li');
                li.className = 'list-group-item';
                const cbId = `Quest[${q.num}][${r.num}][qsr_num_resposta]`;
                // let check_correta: string = (r.qsr_e_correta === 'S')
                //     ? ` <input class="form-check-input" type="checkbox" value="${r.num}" name="${cbId}" id="${cbId}" checked="checked" onclick="return false;" > `
                //     : ` <input class="form-check-input" type="checkbox" value="${r.num}" name="${cbId}" id="${cbId}" onclick="return false;" > `;

                let check_correta: string =  (
                    (r.qsr_e_correta == "S" && r.qsr_num_resposta == r.qsr_num_resposta_usuario)
                    ||
                    (r.qsr_e_correta == "N" && r.qsr_num_resposta != r.qsr_num_resposta_usuario)
                )
                    ?
                    (
                        (r.qsr_e_correta == "S" && r.qsr_num_resposta == r.qsr_num_resposta_usuario)
                            ? `<span class=""><i class="fa-solid fa-square-check text-success fa-lg" ></i></span>`
                            : `<span class="text-white"><i class="fa-solid fa-square"></i></span>`
                        //: @"<svg class=""svg-inline--fa text-primary fa-lg"" viewBox=""0 0 448 512""><rect x=""32"" y=""32"" width=""384"" height=""448"" rx=""48"" ry=""48"" fill=""#eef0f3"" stroke=""#6c757d"" stroke-width=""24""/></svg>"
                        )
                    : (r.qsr_e_correta == "S" && r.qsr_num_resposta != r.qsr_num_resposta_usuario)

                        ? `<span class=""><i class="fa-solid fa-square-check text-success fa-lg"></i></span>`
                        : `<span class="text-white"><i class="fa-solid fa-square"></i></span>`;
            //: $@"<input class=""form-check-input text-danger""  type=""checkbox"" value=""{qcru.qsr_num_resposta}"" name=""{cbId}"" id=""{cbId}"" onclick=""return false;"" />";


                let check_usuario: string = ``;

                if ((r.qsr_e_correta === 'S' && r.num === r.qsr_num_resposta_usuario) ) {
                    check_usuario = ` <i class="fa-solid fa-square-check text-info fa-lg" ></i> `
                } else if ((r.qsr_e_correta === 'N' && r.num !== r.qsr_num_resposta_usuario)) {
                    check_usuario = ` <i class="fa-regular fa-square text-info fa-lg" ></i> `
                } else if ((r.qsr_e_correta === 'N' && r.num === r.qsr_num_resposta_usuario)) {
                    check_usuario = ` <i class="fa-solid fa-square-check text-info fa-lg" ></i> `
                } else {  
                    check_usuario = ` <i class="fa-regular fa-square text-info fa-lg" ></i> `
                }

                  // check_usuario = (r.qsr_e_correta === 'S' && r.num === r.qsr_num_resposta_usuario)
                  //   ? ` <i class="fa-solid fa-square-check text-success fa-lg"></i> `
                  //   : (r.qsr_e_correta === 'N' && r.num === r.qsr_num_resposta_usuario)
                  //       ? ` <i class="fa-solid fa-square-xmark text-danger fa-lg"></i> `
                  //       : ` <i class="fa-regular fa-square text-success fa-lg"></i> `;
                console.log(q.qsr_e_correta);
                li.innerHTML = `
                <div class="form-check" style="text-align:left;" >
                    ${check_correta}
                    ${check_usuario} 
                    <label class=""form-check-label" for="${cbId}" id="Quest[${q.num}][${r.num}][qsr_enunciado]" style="text-align:left;width: auto;">
                        ${r.enunciado}
                    </label>
                </div>`;
                ul.appendChild(li);
            });

            body.appendChild(ul);
            card.appendChild(notap);
            card.appendChild(header);
            card.appendChild(body);
            container.appendChild(card);
        });
         
    }

    export function gerarListaListaUsuariosPontos(lista) {
        console.log('>>> gerarListaListaUsuariosPontos INICIADA');
        console.log('>>> Lista de entrada:');
        console.table(lista);
        console.log('>>> Lista.length:', lista?.length || 0);
        
        RelPontConferencia.listaUsuariosPontos = [];

        // Valida entrada
        if (!Array.isArray(lista) || lista.length === 0) {
            console.warn('>>> Lista de entrada vazia ou inválida!');
            return [];
        }

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
         

        Object.values(eventosMapa).forEach(ev => {
            // Header do Evento
   
            RelPontConferencia.listaUsuariosPontos.push({
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
           
                RelPontConferencia.listaUsuariosPontos.push({
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
                console.log(`>>> Adicionando ${que.participantes.length} participantes para evento ${ev.num}, questionário ${que.num}`);
                que.participantes.forEach((q, idx) => {
                    // Aceitar participante mesmo quando usr_num_usuario for 0,
                    // pois a API nem sempre preenche esse campo. Usar presença
                    // de CPF ou Nome como indicador de participante real.
                    const hasCpfOrName = (q && (String(q.usr_cpf || '').trim() !== '' || String(q.usr_nome || '').trim() !== ''));
                    if (q && ( (q.usr_num_usuario && Number(q.usr_num_usuario) > 0) || hasCpfOrName )) {
                        const participante = {
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
                        };
                        RelPontConferencia.listaUsuariosPontos.push(participante);
                        if (idx < 2) {
                            console.log(`>>> Participante ${idx + 1} adicionado:`, participante);
                        }
                    } else {
                        console.warn(`>>> Participante ignorado (sem dados identificáveis):`, q);
                    }
                });
            });
        }); 
        
        console.log('>>> gerarListaListaUsuariosPontos FINALIZADA');
        console.log('>>> Total de registros na listaUsuariosPontos:', RelPontConferencia.listaUsuariosPontos.length);
        console.log('>>> Registros de participantes (usr_num_usuario > 0):', RelPontConferencia.listaUsuariosPontos.filter(x => x.usr_num_usuario > 0).length);
        console.table(RelPontConferencia.listaUsuariosPontos);
        return RelPontConferencia.listaUsuariosPontos;
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

        $('input[name="busca"]').val('');
        $('input[name="buscaLimpa"]').val('');
        $('#content-table').css('display', 'block');
        $('#content-table').css('width', '100%');
        RelPontConferencia.fetchDataAndInitializeTable();
    }

    export function gerarEventosQuestionarioHTML(lista) {
        RelPontConferencia.listaEventos = [];

        let tabela: string = '<table class="table table-striped">';
        RelPontConferencia.eve_num_evento = Number($('input[name="eve_num_evento"]').val()?.toString() ?? '0');
        RelPontConferencia.que_num_questionario = Number($('input[name="que_num_questionario"]').val()?.toString() ?? '0');

        lista.forEach(q => {
            RelPontConferencia.listaEventos.push({
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
                       onclick="javascript:RelPontConferencia.eventoQuestionarioPontosPorUsuario(${q.eve_num_evento || 0},${q.que_num_questionario || 0})"  style="text-align:center;cursor:pointer;" >
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
                                 onclick="javascript:RelPontConferencia.eventoDescricao(${q.eve_num_evento || 0},${q.que_num_questionario || 0})" style="color:#033E66;">${descri || ''}</h5>
                                <h5 class="mb-4 que_contexto" id="eve[${q.eve_num_evento || 0}][${q.que_num_questionario || 0}][que_contexto]" style="color:#033E66;">Questionário: ${q.que_contexto || ''}</h5>
                    </td>
                </tr>`;

            RelPontConferencia.eve_num_evento = (q.eve_num_evento !== null && q.eve_num_evento > 0) ? q.eve_num_evento : RelPontConferencia.eve_num_evento;
            RelPontConferencia.que_num_questionario = (q.que_num_questionario !== null && q.que_num_questionario > 0) ? q.que_num_questionario : RelPontConferencia.que_num_questionario;
            $('input[name="eve_num_evento"]').val(RelPontConferencia.eve_num_evento);
            $('input[name="que_num_questionario"]').val(RelPontConferencia.que_num_questionario);
        });



        tabela += '</table>';
        $('#eventos-questionario').html(tabela);

        return RelPontConferencia.listaEventos;
    }

    export function carregarEventos() {
        var jqxhr = $.post("/Relpontuacao/ObterEventosGeralFinal", {}, function (data) {
            // console.log("success");


            if (data.sucesso) {

                if (data.lista != null && data.lista.length > 0) {

                    let listaEventos = processDataForTable(data.lista);
                    console.table(listaEventos);
                    RelPontConferencia.initializeDataTableEventoQuestionario(listaEventos, RelPontConferencia._mes, RelPontConferencia._ano, 100);

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

    export function buscarUsuarioaNoRelatorio() {
        const normalizeStr = (str: any) => String(str || '').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
        let buscaRaw: string = String($('input[name="buscaLimpaPorNomeOuCPF"]').val() || '').trim();
        if (!buscaRaw) {
            buscaRaw = String($('input[name="buscaLimpa"]').val() || '').trim();
        }

        $('input[name="busca"]').val(buscaRaw);

        const buscaText = normalizeStr(buscaRaw);
        const searchDigits = buscaRaw.replace(/\D/g, '');

        console.log('=== INICIANDO BUSCA ===', { buscaRaw, buscaText, searchDigits });
        console.log('listaUsuariosPontos disponível:', !!RelPontConferencia.listaUsuariosPontos);
        console.log('listaUsuariosPontos.length:', RelPontConferencia.listaUsuariosPontos?.length || 0);
        console.log('>>> CONTEÚDO completo de listaUsuariosPontos:');
        console.table(RelPontConferencia.listaUsuariosPontos);

        const lista = RelPontConferencia.listaUsuariosPontos || [];
        RelPontConferencia.listaBusca = [];

        if (!Array.isArray(lista) || lista.length === 0) {
            console.warn('Lista de usuários está vazia!');
            return [];
        }

        const participantesReais = lista.filter(x => x && (String(x.usr_cpf || '').trim() !== '' || String(x.usr_nome || '').trim() !== ''));
        console.log(`>>> Participantes reais encontrados: ${participantesReais.length} de ${lista.length}`);

        if (!buscaRaw) {
            RelPontConferencia.listaBusca = lista.slice();
            return RelPontConferencia.listaBusca;
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
            RelPontConferencia.listaBusca = [];
            return [];
        }

        const filteredList: Array<any> = [];
        const insertedHeaders = new Set<string>();

        const addHeader = (headerRow: any) => {
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

        RelPontConferencia.listaBusca = filteredList;
        console.log('=== RESULTADO FINAL: registros filtrados ===');
        console.table(RelPontConferencia.listaBusca);
        return RelPontConferencia.listaBusca;
    }

    export function carregarQuestionario() {
        let busca: string = $('input[name="busca"]').val() as string;

        console.log('Carregando o questionário');
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

        var jqxhr = $.post("/Relpontuacao/ObterQuestionarioPontuacaoConferenciaPorCpf", { usr_cpf: busca, eve_num_evento: eve_num_evento, que_num_questionario: que_num_questionario }, function (data) {
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
                            RelPontConferencia.gerarHTML(agruparQuestoes(dados));

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
        const busca = String($('input[name="busca"]').val() as string || '').replace(/\D/g, '');
        const eve_num_evento = Number($('input[name="eve_num_evento"]').val() as string || '0');
        const que_num_questionario = Number($('input[name="que_num_questionario"]').val() as string || '0');
        RelPontConferencia.gerarPDFPorCpf(busca, eve_num_evento, que_num_questionario);
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

        $.post('/Relpontuacao/GerarPdfPorCpfEventoQuestionario', { usr_cpf: busca, eve_num_evento: eve, que_num_questionario: que }, function (data) {
            console.log('success');
            console.log(data);

            if (data.sucesso) {
                window.open('/Relpontuacao/abrirPdfGerado', 'popup', 'height=1024,width=900,toolbar=no');
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
        RelPontConferencia.carregarQuestionario();
    }


    export function fetchDataAndInitializeTable() {
        //console.log('Iniciando busca de dados da API...');
        var dadosForm = $('form[name="formRelPontuacao"]').serializeArray();
        var jqxhr = $.post('/Relpontuacao/ListaPontoFinal', dadosForm, function (json) {
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

                        let listaUsuariosPontos = RelPontConferencia.procesDadosUsuarioPonto(json.lista);
                        // console.table(json.lista);
                        // console.table(RelPontConferencia.dadosDaTabela);
                        // console.log('Dados processados para o DataTable:', dadosDaTabela);
                        // let listaUsuariosPontos = gerarHTML(json.lista);
                        // console.table(listaUsuariosPontos);

                        $.when(RelPontConferencia.initializeDataTable(listaUsuariosPontos, _ano, _mes, 100)).then(function (data, textStatus, jqXHR) {
                            // console.log('Pontuação carregada');
                        });
                    } else {
                        RelPontConferencia.initializeDataTable([], _ano, _mes, 1);
                    }
                } else {
                    RelPontConferencia.initializeDataTable([], _ano, _mes, 1);
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

        return jqxhr;
    }


    $(function () {

        _ano = '2026';
        _mes = '6';

        setTimeout(() => {
            console.log("This prints after 2 seconds!");
            RelPontConferencia.carregarEventos();
        }, 200);

        $('input[name="buscaLimpa"]').on('input', function () {
            // Remove all non-numeric characters before saving
            var cleanValue = ($(this).val() as string);
            $('input[name="busca"]').val(cleanValue)
            console.log("Cleaned:", cleanValue);
        });

        $('button[name="btnGerarPDF"]').on('click', function (e) {
            RelPontConferencia.gerarPDF();
        });

        $('button[name="btnBuscarPorNomeOuCPF"]').on('click', function (e) {
            e.preventDefault();
            const filtered = RelPontConferencia.buscarUsuarioaNoRelatorio();

            if (Array.isArray(filtered) && filtered.length > 0) {
                RelPontConferencia.initializeDataTable(filtered, _ano, _mes, 100);
                return;
            }

            // Se não encontrou localmente, tentar recarregar do servidor (com o termo de busca já preenchido no form)
            console.log('Busca local vazia — tentando recarregar do servidor com o termo informado...');

            $.when(RelPontConferencia.fetchDataAndInitializeTable()).then(function (data, textStatus, jqXHR) {
                const filtered2 = RelPontConferencia.buscarUsuarioaNoRelatorio();
                if (Array.isArray(filtered2) && filtered2.length > 0) {
                    RelPontConferencia.initializeDataTable(filtered2, _ano, _mes, 100);
                } else {
                    // Se ainda vazio, mostrar tudo ou vazio conforme sua UX preferida
                    console.log('Nenhum usuário encontrado após recarregar do servidor.', filtered2);
                    RelPontConferencia.initializeDataTable(RelPontConferencia.listaUsuariosPontos || [], _ano, _mes, 100);
                }
            });

      
        });

        $('#table-lista-itens tbody').on('click', 'button.btn-gerar-pdf', function () {
            const cpf = String($(this).data('usrcpf') || '');
            const eve = Number($(this).data('eve') || 0);
            const que = Number($(this).data('que') || 0);
            if (cpf) {
                $('input[name="busca"]').val(cpf);
                RelPontConferencia.gerarPDFPorCpf(cpf, eve, que);
            }
            $('#content-table').css('display', 'none');
            $('#questionario-pontuacao').css('display', 'block');
        });

        $('#table-lista-evento-questionario tbody').on('click', 'button.btn-conferencia-evento-questionario', function () { 
            const eve_num_evento = Number($(this).data('eve') || 0);
            const que_num_questionario = Number($(this).data('que') || 0);
            RelPontConferencia.eventoQuestionarioPontosPorUsuario(eve_num_evento, que_num_questionario);
            $('#div-lista-evento-question').css('display','none');
        });
 

        $('#content-table').on('click', 'button.btn-voltar-to-lista-eventos', function () {
            $('#div-lista-evento-question').css('display', 'block');
            $('#content-table').css('display', 'none');
        });

        $('#questionario-pontuacao').on('click', 'button.btn-voltar-to-lista-participantes', function () {
            $('#content-table').css('display', 'block');
            $('#questionario-pontuacao').css('display', 'none');
        });

 

        $('button[name="btnBuscar"]').on('click', function (e) {
            RelPontConferencia.carregarQuestionario();
            // $.when(RelPontConferencia.buscarUsuarioaNoRelatorio()).then(function (data, textStatus, jqXHR) {
            //     $.when(RelPontConferencia.initializeDataTable(RelPontConferencia.listaBusca, _ano, _mes, 100)).then(function (data, textStatus, jqXHR) {
            //         $('input[name="buscaLimpa"]').val('');
            //         console.log('Pontuação carregada com filtro');
            //     });
            // });
        });

       /*
        setTimeout(() => {
            console.log("This prints after 2 seconds!");
            RelPontConferencia.fetchDataAndInitializeTable();
        }, 200);
        */

    });

}

declare module "RelPontConferencia" {
    export = RelPontConferencia;
}