// File: script-page/questionario-index.ts

/// <reference path="../config-scripts/@types/jquery/index.d.ts" />
/// <reference path="../config-scripts/@types/jquery.form/index.d.ts" />

/// <reference path="../config-scripts/@types/datatables.net/types/types.d.ts" />
/// <reference path="../config-scripts/sweetalert2.d.ts" />
/// <reference path="../config-scripts/config.ts" />
/// <reference path="../config-scripts/ScriptsConfig.d.ts" />

namespace GestQ {
    export let tempo: number = Date.now();

    export let msgValido: string = '';

    export let dataTableInstance: any | null = null;

    export let _ano: string = '0';
    export let _mes: string = '0';

    export let eve_num_evento: number = 0;
    export let que_num_questionario: number = 0;

    export let questoesDtos: Array<{
        qst_num_questao: number;
        qst_enunciado: string;
        qst_situacao: string;
    }> = [];

    export let respostasDtos: Array<{
        tempo: number,
        qst_num_questao: number;
        qsr_num_resposta: number;
        qsr_enunciado: string;
        qsr_e_correta: string;
        qsr_situacao: string;
    }> = [];

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

    /**
     * Sincroniza os dados atuais do DataTable com o array respostasDtos
     * Captura as mudanças feitas no DataTable antes de re-renderizar
     * Lê os valores dos inputs/selects editados no DOM
     */
    export function syncDataTableToArray() {
        if (!GestQ.dataTableInstanceRespostas) return;

        // Limpa o array
        GestQ.respostasDtos = [];

        // Itera sobre cada linha do DataTable renderizado
        $('#table-lista-respostas tbody tr').each(function (index) {
            const $row = $(this);
            const accesskey = $row.find('[accesskey]').first().attr('accesskey');

            if (!accesskey) return;

            // Captura os valores dos elementos do DOM
            const qst_num_questao = parseInt($row.find('input.qst_num_questao').val() as string) || 0;
            const qsr_num_resposta = parseInt($row.find('input.qsr_num_resposta').val() as string) || 0;
            const qsr_enunciado = ($row.find('input.qsr_enunciado').val() as string) || '';
            const qsr_e_correta = ($row.find('select.qsr_e_correta').val() as string) || 'N';
            const qsr_situacao = ($row.find('select.qsr_situacao').val() as string) || 'A';

            // Cria/recupera o tempo (usar accesskey se for um número puro, senão parsear)
            let tempo = parseInt(accesskey);
            if (isNaN(tempo)) {
                tempo = Date.now();
            }

            // Constrói o objeto de resposta com os valores atualizados do DOM
            const rd = {
                tempo: tempo,
                qst_num_questao: qst_num_questao,
                qsr_num_resposta: qsr_num_resposta,
                qsr_enunciado: qsr_enunciado,
                qsr_e_correta: qsr_e_correta,
                qsr_situacao: qsr_situacao
            };

            GestQ.respostasDtos.push(rd);
        });
    }

    export function addRegistroNoArray(rowData): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                // Primeiro, sincroniza os dados atuais do DataTable com o array
                GestQ.syncDataTableToArray();

                let tempo: number = Date.now();
                let rd = {
                    tempo: ((rowData.tempo !== undefined && rowData.tempo !== null) ? rowData.tempo : parseInt(tempo.toString())),
                    qst_num_questao: ((rowData.qst_num_questao !== undefined && rowData.qst_num_questao !== null) ? rowData.qst_num_questao : 0),
                    qsr_num_resposta: ((rowData.qsr_num_resposta !== undefined && rowData.qsr_num_resposta !== null) ? rowData.qsr_num_resposta : 0),
                    qsr_enunciado: ((rowData.qsr_enunciado !== undefined && rowData.qsr_enunciado !== null) ? rowData.qsr_enunciado : ''),
                    qsr_e_correta: ((rowData.qsr_e_correta !== undefined && rowData.qsr_e_correta !== null) ? rowData.qsr_e_correta : 'N'),
                    qsr_situacao: ((rowData.qsr_situacao !== undefined && rowData.qsr_situacao !== null) ? rowData.qsr_situacao : 'A')
                };
                GestQ.respostasDtos.push(rd);
                resolve(rd);
            } catch (error) {
                reject(error);
            }
        });
    }

    export function initializeDataTable(data, mes, ano, pageLength) {

        // console.log('Inicializando DataTable...');
        if (!Array.isArray(data)) {
            console.error('Os dados recebidos não são válidos:', data);
            data = [];
        }

        console.table(data);

        if (GestQ.dataTableInstance) {
            GestQ.dataTableInstance.destroy();
        }
        $('#table-lista-itens tbody').empty();

        // console.log('Inicializando DataTable com os dados recebidos...');
        GestQ.dataTableInstance = $('#table-lista-itens').DataTable({
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
                var table = GestQ.dataTableInstance;

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
                            .attr('accesskey', rowData.usr_num_usuario || GestQ.tempo);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            var colorCancel = '';
                            let usr_cpf = data;

                            if (row.usr_num_usuario == 0 && row.que_num_questionario == 0) {
                                return `
                                    <td data-usr_num_usuario="${row.usr_num_usuario || GestQ.tempo}" data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}"
                                         accesskey="${row.usr_num_usuario || GestQ.tempo}" style="text-align:center; background-color:  #337ab7 ;">
                                         <div class="form-control text-white" style="text-align:center; background-color: #337ab7;" >Evento<div>     
                                    </td>

                            `;
                            }
                            else if (row.usr_num_usuario == 0 && row.que_num_questionario > 0) {
                                return `
                                    <td data-usr_num_usuario="${row.usr_num_usuario || GestQ.tempo}" data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}"
                                         accesskey="${row.usr_num_usuario || GestQ.tempo}" style="text-align:center; background-color:  #337ab7;">
                                         <div class="form-control text-white"  style="text-align:center; background-color:  #337ab7;" >Questionário<div>     
                                    </td>

                            `;
                            } else {
                                return `
                                    <td data-usr_num_usuario="${row.usr_num_usuario || GestQ.tempo}" data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}"
                                         accesskey="${row.usr_num_usuario || GestQ.tempo}">

                                        <input type="hidden" class="form-control usr_num_usuario"
                                            name="inpu[${row.usr_num_usuario || GestQ.tempo}][usr_num_usuario]"
                                            id="inpu[${row.usr_num_usuario || GestQ.tempo}][usr_num_usuario]"
                                            value="${row.usr_num_usuario || GestQ.tempo}"
                                            accesskey="${row.usr_num_usuario || GestQ.tempo}"  />

                                        <input type="hidden" class="form-control eve_num_evento"
                                            name="inpu[${row.usr_num_usuario || GestQ.tempo}][eve_num_evento]"
                                            id="inpu[${row.usr_num_usuario || GestQ.tempo}][eve_num_evento]"
                                            value="${row.eve_num_evento || 0}"
                                            accesskey="${row.usr_num_usuario || GestQ.tempo}"  />

                                        <input type="hidden" class="form-control que_num_questionario"
                                            name="inpu[${row.usr_num_usuario || GestQ.tempo}][que_num_questionario]"
                                            id="inpu[${row.usr_num_usuario || GestQ.tempo}][que_num_questionario]"
                                            value="${row.que_num_questionario || '0'}"
                                            accesskey="${row.usr_num_usuario || GestQ.tempo}"  />

                                        <input type="text" class="form-control usr_cpf"
                                            name="inpu[${row.usr_num_usuario || GestQ.tempo}][usr_cpf]"
                                            id="inpu[${row.usr_num_usuario || GestQ.tempo}][usr_cpf]"
                                            data-usr_num_usuario="${row.usr_num_usuario || GestQ.tempo}" 
                                            data-eve_num_evento="${row.eve_num_evento || 0}" 
                                            data-que_num_questionario="${row.que_num_questionario || 0}"
                                            value="${usr_cpf || ''}"
                                            onblur="javascript:GestQ.validarCampos(${row.usr_num_usuario || GestQ.tempo}, 'usr_cpf');"
                                            onclick="javascript:inputMascara();"
                                            maxlength="11"
                                            accesskey="${row.usr_num_usuario || GestQ.tempo}" style="max-width:130px; ${colorCancel || ''}"  readonly="readonly" />

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
                            .attr('accesskey', rowData.usr_num_usuario || GestQ.tempo);
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
                                    <td data-usr_num_usuario="${row.usr_num_usuario || GestQ.tempo}" data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}"
                                         accesskey="${row.usr_num_usuario || GestQ.tempo}" style="text-align:center; background-color:  #337ab7 ;">
                                         <div class="form-control text-white" style="text-align:center; background-color: #337ab7;" >${row.eve_nome || ''}<div>     
                                    </td>

                            `;
                            }
                            else if ((usr_nome == '' || usr_nome == null) && row.que_num_questionario > 0) {
                                return `
                                    <td data-usr_num_usuario="${row.usr_num_usuario || GestQ.tempo}" data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}"
                                         accesskey="${row.usr_num_usuario || GestQ.tempo}" style="text-align:center; background-color:  #337ab7;">
                                         <div class="form-control text-white"  style="text-align:center; background-color:  #337ab7;" >${row.que_contexto || ''}<div>     
                                    </td>

                            `;
                            } else {
                                return `
                                  <td
                                    data-usr_num_usuario="${row.usr_num_usuario || GestQ.tempo}" style="100%;padding-bottom:0px;vertical-align:bottom;"
                                    data-eve_num_evento="${row.eve_num_evento || 0}"
                                    data-que_num_questionario="${row.que_num_questionario || 0}"
                                         accesskey="${row.usr_num_usuario || GestQ.tempo}" >
                                         <div class="form-group" style="100%;padding-bottom:0px;margin-bottom: 2px;">
                                            <input type="hidden" class="form-control usr_nome"
                                                name="inpu[${row.usr_num_usuario || GestQ.tempo}][usr_nome_hidden]"
                                                id="inpu[${row.usr_num_usuario || GestQ.tempo}][usr_nome_hidden]"
                                                value="${row.usr_nome || ''}"
                                                accesskey="${row.usr_num_usuario || GestQ.tempo}"  />

                                            <span  class="form-control usr_cpf"
                                                    name="inpu[${row.usr_num_usuario || GestQ.tempo}][usr_cpf]"
                                                    id="inpu[${row.usr_num_usuario || GestQ.tempo}][usr_cpf]"
                                                    data-usr_num_usuario="${row.usr_num_usuario || GestQ.tempo}"
                                                    data-eve_num_evento="${row.eve_num_evento || 0}"
                                                    data-que_num_questionario="${row.que_num_questionario || 0}"
                                                    value="${row.usr_cpf || ''}"
                                                    onblur="javascript:GestQ.validarCampos(${row.usr_num_usuario || GestQ.tempo}, 'usr_cpf');"
                                                    onclick="javascript:inputMascara();"
                                                    maxlength="11"
                                                    accesskey="${row.usr_num_usuario || GestQ.tempo}" style="max-width:150px; float:left; ${colorCancel || ''}"  readonly="readonly" />${usr_cpf || ''}
                                            </span>
                                            <span  class="form-control" accesskey="${row.usr_num_usuario || GestQ.tempo}"
                                                name="inpu[${row.usr_num_usuario || GestQ.tempo}][usr_nome]" id="inpu[${row.usr_num_usuario || GestQ.tempo}][usr_nome]"
                                                onblur="javascript:GestQ.validarCampos(${row.usr_num_usuario || GestQ.tempo},'usr_nome');"  readonly="readonly"
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
                            .attr('accesskey', rowData.usr_num_usuario || GestQ.tempo);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            // var colorCancel = ((row.pim_situacao === 'A') ? '' : 'color:red;');
                            // let valor = Number(data);
                            let eve_nome = data;
                            return `
                                  <td data-usr_num_usuario="${row.usr_num_usuario || GestQ.tempo}" data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}"
                                         accesskey="${row.usr_num_usuario || GestQ.tempo}">

                                    <input type="text" class="form-control" accesskey="${row.usr_num_usuario || GestQ.tempo}"  
                                        name="inpu[${row.usr_num_usuario || GestQ.tempo}][eve_nome]" id="inpu[${row.usr_num_usuario || GestQ.tempo}][eve_nome]"
                                        onblur="javascript:GestQ.validarCampos(${row.usr_num_usuario || GestQ.tempo},'eve_nome');"
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
                            .attr('accesskey', rowData.usr_num_usuario || GestQ.tempo);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            var colorCancel = ((row.pim_situacao === 'A') ? '' : 'color:red;');
                            let valor = Number(data);
                            if ((row.usr_cpf == '' || row.usr_cpf == null) && row.que_num_questionario == 0) {
                                return `
                                    <td data-usr_num_usuario="${row.usr_num_usuario || GestQ.tempo}" data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}"
                                         accesskey="${row.usr_num_usuario || GestQ.tempo}" style="text-align:center; background-color:  #337ab7 ;">
                                         <div><div>
                                    </td>

                            `;
                            }
                            else if ((row.usr_cpf == '' || row.usr_cpf == null) && row.que_num_questionario > 0) {
                                return `
                                    <td data-usr_num_usuario="${row.usr_num_usuario || GestQ.tempo}" data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}"
                                         accesskey="${row.usr_num_usuario || GestQ.tempo}" style="text-align:center; background-color: #337ab7;padding-bottom:0px;">
                                         <span class="form-control text-white" style="text-align:center; background-color: #337ab7;" >Nota<span>
                                    </td>

                            `;
                            } else {
                                let pontuacao: number = Number(data.toFixed(2));
                                let nota = pontuacao?.toString().replace('.', ',',);

                                return `
                                    <td data-usr_num_usuario="${row.usr_num_usuario || GestQ.tempo}" data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}"
                                             accesskey="${row.usr_num_usuario || GestQ.tempo}" style="text-align: center;">

                                        <div class="form-group" style="100%;padding-bottom:0px;margin-bottom: 2px;">
                                            <span class="form-control" accesskey="${row.usr_num_usuario || GestQ.tempo}"  name="inpu[${row.usr_num_usuario || GestQ.tempo}][pontuacao]" id="inpu[${row.usr_num_usuario || GestQ.tempo}][pontuacao]"
                                            onblur="javascript:GestQ.validarCampos(${row.usr_num_usuario || GestQ.tempo},'pontuacao');"

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
                            .attr('accesskey', rowData.usr_num_usuario || GestQ.tempo);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            var colorCancel = '';
                            return `<td style="max-width: 40px;">`
                                + `<button type="button" class="delete-row" style="border:none;background:none;color:red;width:50px;" accesskey="${row.usr_num_usuario || GestQ.tempo}" title="Excluir"><i class="fas fa-trash-alt"></i></button>` +
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
        GestQ.listaUsuariosPontos = [];

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
            GestQ.listaUsuariosPontos.push({
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
                GestQ.listaUsuariosPontos.push({
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
                    GestQ.listaUsuariosPontos.push({
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
        return GestQ.listaUsuariosPontos;
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
                        GestQ.dadosDaTabela = processDataForTable(json.lista);
                        console.table(GestQ.dadosDaTabela);
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
                            // GestQ.totValoresItens();
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
        //             GestQ.dadosDaTabela = processDataForTable(json.lista);
        //             console.table(GestQ.dadosDaTabela);
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
        //                 // GestQ.totValoresItens();
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
        GestQ.fetchDataAndInitializeTable();
    }

    export function gerarEventosQuestionarioHTML(lista) {
        GestQ.listaEventos = [];

        let tabela: string = '<table class="table table-striped">';
        GestQ.eve_num_evento = Number($('input[name="eve_num_evento"]').val()?.toString() ?? '0');
        GestQ.que_num_questionario = Number($('input[name="que_num_questionario"]').val()?.toString() ?? '0');

        lista.forEach(q => {
            GestQ.listaEventos.push({
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
                que_nota_minima: Number(q.que_nota_minima) || 0,
                que_dt_inclusao: q.que_dt_inclusao || '',
                que_situacao: q.que_situacao || ''
            });
            let cab_eve_descricao: string = q.eve_descricao.toString();
            let descri: string = ((cab_eve_descricao.length >= 100) ? cab_eve_descricao.substring(0, 100) + '<span class="text-danger" style="cursor:pointer;"> ... Saiba mais ... </span>' : cab_eve_descricao);
            tabela += `
                <tr>
                    <td class="list-group-item" accesskey="${q.eve_num_evento || 0}_${q.que_num_questionario || 0}" 
                       onclick="javascript:GestQ.eventoQuestionarioPontosPorUsuario(${q.eve_num_evento || 0},${q.que_num_questionario || 0})"  style="text-align:center;cursor:pointer;" >
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
                                 onclick="javascript:GestQ.eventoDescricao(${q.eve_num_evento || 0},${q.que_num_questionario || 0})" style="color:#033E66;">${descri || ''}</h5>
                                <h5 class="mb-4 que_contexto" id="eve[${q.eve_num_evento || 0}][${q.que_num_questionario || 0}][que_contexto]" style="color:#033E66;">Questionário: ${q.que_contexto || ''}</h5>
                    </td>
                </tr>`;

            GestQ.eve_num_evento = (q.eve_num_evento !== null && q.eve_num_evento > 0) ? q.eve_num_evento : GestQ.eve_num_evento;
            GestQ.que_num_questionario = (q.que_num_questionario !== null && q.que_num_questionario > 0) ? q.que_num_questionario : GestQ.que_num_questionario;
            $('input[name="eve_num_evento"]').val(GestQ.eve_num_evento);
            $('input[name="que_num_questionario"]').val(GestQ.que_num_questionario);
        });



        tabela += '</table>';
        $('#eventos-questionario').html(tabela);

        return GestQ.listaEventos;
    }

    export function carregarEventos() {
        var jqxhr = $.post("/Relpontuacao/ObterEventos", {}, function (data) {
            console.log("success");
            console.log(data);

            if (data.sucesso) {


                if (data.lista != null && data.lista.length > 0) {

                    var lista = data.lista;
                    console.table(lista);
                    gerarEventosQuestionarioHTML(lista);

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

                console.log(data);
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

    export let listaQuestoes: Array<{
        tempo: number;
        qst_num_questao: number;
        qst_enunciado: string;
        qst_situacao: string;
    }> = [];

    export function processaDadosParaTable(data) {
        GestQ.listaQuestoes = [];
        data.forEach(q => {
            GestQ.listaQuestoes.push({
                tempo: Number(q.qst_num_questao) || Date.now(),
                qst_num_questao: Number(q.qst_num_questao) || 0,
                qst_enunciado: q.qst_enunciado || '',
                qst_situacao: q.qst_situacao || '',
            });
        });
        return GestQ.listaQuestoes;
    }

    export function processDadosQuestoesForTable(data) {
        GestQ.questoesDtos = [];
        data.forEach(q => {
            GestQ.questoesDtos.push({
                qst_num_questao: Number(q.qst_num_questao) || 0,
                qst_enunciado: q.qst_enunciado || '',
                qst_situacao: q.qst_situacao || '',
            });
        });
        return GestQ.questoesDtos;
    }

    export function processDadosRespostasForTable(data) {
        GestQ.respostasDtos = [];
        data.forEach(q => {
            GestQ.respostasDtos.push({
                tempo: 0,
                qst_num_questao: Number(q.qst_num_questao) || 0,
                qsr_num_resposta: Number(q.qsr_num_resposta) || 0,
                qsr_enunciado: q.qsr_enunciado || '',
                qsr_e_correta: q.qsr_e_correta || '',
                qsr_situacao: q.qsr_situacao || '',
            });
        });
        return GestQ.respostasDtos;
    }

    export let dataTableInstanceEveQuestion: any | null = null;

    export function initializeDataTableQuestoes(data, mes, ano, pageLength) {

        // console.log('Inicializando DataTable...');
        if (!Array.isArray(data)) {
            console.error('Os dados recebidos não são válidos:', data);
            data = [];
        }

        try {
            if ($.fn && $.fn.dataTable && $.fn.dataTable.isDataTable && $.fn.dataTable.isDataTable('#table-lista-questoes')) {
                try {
                    const existing = $('#table-lista-questoes').DataTable();
                    existing.clear && existing.clear();
                    existing.destroy && existing.destroy();
                } catch (err) {
                    console.warn('Falha ao destruir DataTable via API:', err);
                }
                // Remover elementos remanescentes que o plugin pode ter criado
                try { $('.dt-buttons').remove(); } catch (e) { }
                try { $('.fixedHeader-floating').remove(); } catch (e) { }
                try { $('#table-lista-questoes_wrapper').remove(); } catch (e) { }
                GestQ.dataTableInstanceEveQuestion = null;
            }
        } catch (e) {
            console.warn('Erro ao verificar/destruir DataTable anterior:', e);
        }

        $('#table-lista-questoes tbody').empty();

        // console.log('Inicializando DataTable com os dados recebidos...');
        GestQ.dataTableInstanceEveQuestion = $('#table-lista-questoes').DataTable({
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
                var table = GestQ.dataTableInstanceEveQuestion;
                table.buttons([0, 1, 2]).remove();
            },
            lengthChange: true,
            searching: true,
            ordering: true,
            columns: [
                {
                    data: 'qst_num_questao', className: 'editable qst_num_questao',
                    createdCell: function (td, cellData, rowData, row, col) {
                        let accesskey = (rowData.qst_num_questao || 0);
                        $(td)
                            .attr('id', `linh[${accesskey}][qst_num_questao]`)
                            .attr('row', row)
                            .attr('col', col)
                            .attr('campo', 'qst_num_questao')
                            .attr('data-qst_num_questao', rowData.qst_num_questao || '0')
                            .attr('accesskey', (accesskey));
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            var colorCancel = '';
                            let qst_num_questao = data;
                            let accesskey = (row.qst_num_questao || 0);
                            return `
                                    <td data-qst_num_questao="${row.qst_num_questao || 0}" accesskey="${accesskey}" style="width:80px; max-width:80px; text-align: center; ">
                                        <div class="form-group" style="padding:0px 0px 0px 0px;margin: 0px 0px 0px 0px; width:80px; max-width:80px; text-align: center;">
                                            <input type="text" class="form-control qst_num_questao"
                                                name="inpu[${accesskey}][qst_num_questao]"
                                                id="inpu[${accesskey}][qst_num_questao]"
                                                data-qst_num_questao="${row.qst_num_questao || 0}"
                                                value="${qst_num_questao || ''}"
                                                accesskey="${accesskey}" style="padding:1px 1px 1px 1px; text-align: center; ${colorCancel || ''}" readonly="readonly" />

                                        </div>
                                    </td>
                            `;

                        }
                        return data;
                    }

                }
                , {
                    data: 'qst_enunciado', className: 'editable qst_enunciado',
                    createdCell: function (td, cellData, rowData, row, col) {
                        let accesskey = (rowData.qst_num_questao || 0);
                        $(td)
                            .attr('id', `linh[${accesskey}][qst_enunciado]`)
                            .attr('row', row)
                            .attr('col', col)
                            .attr('campo', 'qst_enunciado')
                            .attr('data-qst_num_questao', rowData.qst_num_questao || '0')
                            .attr('accesskey', accesskey);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            var colorCancel = '';
                            let qst_enunciado = data;
                            let accesskey = (row.qst_num_questao || 0);
                            return `
                                    <td  data-qst_num_questao="${row.qst_num_questao || 0}" accesskey="${accesskey}" style="width: 55%; text-align: left;">
                                        <input type="text" class="form-control qst_enunciado"
                                            name="inpu[${accesskey}][qst_enunciado]"
                                            id="inpu[${accesskey}][qst_enunciado]"
                                            data-qst_num_questao="${row.qst_num_questao || 0}"
                                            value="${qst_enunciado || ''}"
                                            accesskey="${accesskey}" style="text-align: left; ${colorCancel || ''}"  readonly="readonly" />

                                    </td>
                            `;
                        }
                        return data;
                    }
                }
                , {
                    data: 'qst_situacao', className: 'editable qst_situacao',
                    createdCell: function (td, cellData, rowData, row, col) {
                        let accesskey = (rowData.qst_num_questao || 0);
                        $(td)
                            .attr('id', `linh[${accesskey}][qst_situacao]`)
                            .attr('row', row)
                            .attr('col', col)
                            .attr('campo', 'qst_situacao')
                            .attr('data-qst_num_questao', rowData.qst_num_questao || '0')
                            .attr('accesskey', accesskey);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            var colorCancel = '';
                            let qst_situacao = data;
                            let accesskey = (row.qst_num_questao || 0);
                            return `
                                    <td  data-qst_num_questao="${row.qst_num_questao || 0}" accesskey="${accesskey}"  style="width: 80px; text-align: center;">
                                        <input type="text" class="form-control qst_situacao"
                                            name="inpu[${accesskey}][qst_situacao]"
                                            id="inpu[${accesskey}][qst_situacao]"
                                            data-qst_num_questao="${row.qst_num_questao || 0}"
                                            value="${qst_situacao || ''}"
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
                        let accesskey = (rowData.qst_num_questao || 0);
                        $(td)
                            .attr('id', `linh[${accesskey}][editar]`)
                            .attr('row', row)
                            .attr('col', col)
                            .attr('campo', 'editar')
                            .attr('data-qst_num_questao', rowData.qst_num_questao || '0')
                            .attr('accesskey', accesskey);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            let accesskey = (row.qst_num_questao || 0);

                            return `
                                <td data-qst_num_questao="${row.qst_num_questao || 0}" accesskey="${accesskey}"  style="width: 80px; text-align: center;">
                                    <div class="form-group" style="padding-bottom:0px;margin-bottom: 2px;text-align: center;">

                                        <button type="button" class="btn btn-light btn-editar-questao" style=""
                                            data-qst="${row.qst_num_questao}" title="Editar Questão">
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
                        let accesskey = (rowData.qst_num_questao || 0);
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
                            let accesskey = (row.qst_num_questao || 0);
                            return `
                                <td data-qst_num_questao="${row.qst_num_questao || 0}" accesskey="${accesskey}" style="width: 80px; text-align: center;">
                                    <div class="form-group" style="padding-bottom:0px;margin-bottom: 2px;text-align: center;">
                                        <button type="button" class="btn btn-light btn-cancelar-questao" style=""
                                            data-qst="${row.qst_num_questao}" title="Cancelar Questão">
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
                { targets: [0, 1, 2, 3], visible: true }, { targets: [ 4], visible: false }
            ],
            order: [[0, 'asc']],
            autoFill: true
        }).draw();

        // console.log('DataTable inicializado com sucesso.');
    }

    export let dataTableInstanceRespostas: any | null = null;

    export function initializeDataTableRespostas(data, mes, ano, pageLength) {

        // console.log('Inicializando DataTable...');
        if (!Array.isArray(data)) {
            console.error('Os dados recebidos não são válidos:', data);
            data = [];
        }

        try {
            if ($.fn && $.fn.dataTable && $.fn.dataTable.isDataTable && $.fn.dataTable.isDataTable('#table-lista-respostas')) {
                try {
                    const existing = $('#table-lista-respostas').DataTable();
                    existing.clear && existing.clear();
                    existing.destroy && existing.destroy();
                } catch (err) {
                    console.warn('Falha ao destruir DataTable via API:', err);
                }
                // Remover elementos remanescentes que o plugin pode ter criado
                try { $('.dt-buttons').remove(); } catch (e) { }
                try { $('.fixedHeader-floating').remove(); } catch (e) { }
                try { $('#table-lista-respostas_wrapper').remove(); } catch (e) { }
                GestQ.dataTableInstanceRespostas = null;
            }
        } catch (e) {
            console.warn('Erro ao verificar/destruir DataTable anterior:', e);
        }

        $('#table-lista-respostas tbody').empty();

        // console.log('Inicializando DataTable com os dados recebidos...');
        GestQ.dataTableInstanceRespostas = $('#table-lista-respostas').DataTable({
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
                var table = GestQ.dataTableInstanceRespostas;
                table.buttons([0, 1, 2]).remove();
            },
            lengthChange: true,
            searching: false,
            ordering: true,
            columns: [
                {
                    data: 'qst_num_questao', className: 'editable qst_num_questao',
                    createdCell: function (td, cellData, rowData, row, col) {
                        let accesskey = (rowData.qst_num_questao != null && rowData.qst_num_questao > 0 && rowData.qsr_num_resposta != null && rowData.qsr_num_resposta > 0)
                            ? (rowData.qst_num_questao || 0) + '_' + (rowData.qsr_num_resposta || 0) : rowData.tempo.toString();
                        $(td)
                            .attr('id', `linh[${accesskey}][qst_num_questao]`)
                            .attr('row', row)
                            .attr('col', col)
                            .attr('campo', 'qst_num_questao')
                            .attr('data-qst_num_questao', rowData.qst_num_questao || '0')
                            .attr('data-qsr_num_resposta', rowData.qsr_num_resposta || '0')
                            .attr('accesskey', (accesskey));
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            var colorCancel = '';
                            let qst_num_questao = data;
                            let accesskey = (row.qst_num_questao != null && row.qst_num_questao > 0 && row.qsr_num_resposta != null && row.qsr_num_resposta > 0)
                                ? (row.qst_num_questao || 0) + '_' + (row.qsr_num_resposta || 0) : row.tempo.toString();
                            return `
                                    <td data-qst_num_questao="${row.qst_num_questao || 0}" data-qsr_num_resposta="${row.qsr_num_resposta || 0}" 
                                        accesskey="${accesskey}" style="width:80px; max-width:80px; text-align: center; ">
                                        <div class="form-group" style="padding:0px 0px 0px 0px;margin: 0px 0px 0px 0px; width:80px; max-width:80px; text-align: center;">
                                            <span class="form-control qst_num_questao"
                                                data-qst_num_questao="${row.qst_num_questao || 0}"
                                                data-qsr_num_resposta="${row.qsr_num_resposta || 0}"
                                                accesskey="${accesskey}" style="padding:1px 1px 1px 1px; text-align: center; ${colorCancel || ''}">
                                                ${qst_num_questao || ''}
                                            </span>
                                        </div>
                                    </td>
                            `;

                        }
                        return data;
                    }

                }
                ,
                {
                    data: 'qsr_num_resposta', className: 'editable qsr_num_resposta',
                    createdCell: function (td, cellData, rowData, row, col) {
                        let accesskey = (rowData.qst_num_questao != null && rowData.qst_num_questao > 0 && rowData.qsr_num_resposta != null && rowData.qsr_num_resposta > 0)
                            ? (rowData.qst_num_questao || 0) + '_' + (rowData.qsr_num_resposta || 0) : rowData.tempo.toString();
                        $(td)
                            .attr('id', `linh[${accesskey}][qsr_num_resposta]`)
                            .attr('row', row)
                            .attr('col', col)
                            .attr('campo', 'qsr_num_resposta')
                            .attr('data-qst_num_questao', rowData.qst_num_questao || '0')
                            .attr('data-qsr_num_resposta', rowData.qsr_num_resposta || '0')
                            .attr('accesskey', (accesskey));
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            var colorCancel = '';
                            let qsr_num_resposta = data;
                            let accesskey = (row.qst_num_questao != null && row.qst_num_questao > 0 && row.qsr_num_resposta != null && row.qsr_num_resposta > 0)
                                ? (row.qst_num_questao || 0) + '_' + (row.qsr_num_resposta || 0) : row.tempo.toString();
                            return `
                                    <td data-qst_num_questao="${row.qst_num_questao || 0}" data-qsr_num_resposta="${row.qsr_num_resposta || 0}" 
                                        accesskey="${accesskey}" style="width:80px; max-width:80px; text-align: center; ">
                                        <div class="form-group" style="padding:0px 0px 0px 0px;margin: 0px 0px 0px 0px; width:80px; max-width:80px; text-align: center;">
                                            <span class="form-control qsr_num_resposta"
                                                data-qst_num_questao="${row.qst_num_questao || 0}"
                                                data-qsr_num_resposta="${row.qsr_num_resposta || 0}"
                                                accesskey="${accesskey}" style="padding:1px 1px 1px 1px; text-align: center; ${colorCancel || ''}">
                                                ${qsr_num_resposta || 0}
                                            </span>
                                        </div>
                                    </td>
                            `;

                        }
                        return data;
                    }

                }
                , {
                    data: 'qsr_enunciado', className: 'editable qsr_enunciado',
                    createdCell: function (td, cellData, rowData, row, col) {
                        let accesskey = (rowData.qst_num_questao != null && rowData.qst_num_questao > 0 && rowData.qsr_num_resposta != null && rowData.qsr_num_resposta > 0)
                            ? (rowData.qst_num_questao || 0) + '_' + (rowData.qsr_num_resposta || 0) : rowData.tempo.toString();
                        $(td)
                            .attr('id', `linh[${accesskey}][qsr_enunciado]`)
                            .attr('row', row)
                            .attr('col', col)
                            .attr('campo', 'qsr_enunciado')
                            .attr('data-qst_num_questao', rowData.qst_num_questao || '0')
                            .attr('data-qsr_num_resposta', rowData.qsr_num_resposta || '0')
                            .attr('accesskey', accesskey);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            var colorCancel = '';
                            let qsr_enunciado = data;
                            let accesskey = (row.qst_num_questao != null && row.qst_num_questao > 0 && row.qsr_num_resposta != null && row.qsr_num_resposta > 0)
                                ? (row.qst_num_questao || 0) + '_' + (row.qsr_num_resposta || 0) : row.tempo.toString();
                            return `
                                    <td  data-qst_num_questao="${row.qst_num_questao || 0}"  data-qsr_num_resposta="${row.qsr_num_resposta || 0}"
                                        accesskey="${accesskey}" style="width: 55%; min-width: 55%; text-align: left;">

                                        <input type="hidden" class="form-control qst_num_questao"
                                                name="inpu[${accesskey}][qst_num_questao]"
                                                id="inpu[${accesskey}][qst_num_questao]"
                                                data-qst_num_questao="${row.qst_num_questao || 0}"
                                                data-qsr_num_resposta="${row.qsr_num_resposta || 0}"
                                                value="${row.qst_num_questao || 0}"
                                                accesskey="${accesskey}" style="padding:1px 1px 1px 1px; text-align: center; ${colorCancel || ''}" readonly="readonly" />

                                        <input type="hidden" class="form-control qsr_num_resposta"
                                                name="inpu[${accesskey}][qsr_num_resposta]"
                                                id="inpu[${accesskey}][qsr_num_resposta]"
                                                data-qst_num_questao="${row.qst_num_questao || 0}"
                                                data-qsr_num_resposta="${row.qsr_num_resposta || 0}"
                                                value="${row.qsr_num_resposta || 0}"
                                                accesskey="${accesskey}" style="padding:1px 1px 1px 1px; text-align: center; ${colorCancel || ''}" readonly="readonly" />

                                        <input type="text" class="form-control qsr_enunciado"
                                            name="inpu[${accesskey}][qsr_enunciado]"
                                            id="inpu[${accesskey}][qsr_enunciado]"
                                            data-qst_num_questao="${row.qst_num_questao || 0}"
                                            data-qsr_num_resposta="${row.qsr_num_resposta || 0}"
                                            value="${qsr_enunciado || ''}"
                                            accesskey="${accesskey}" style="text-align: left; ${colorCancel || ''}" />

                                    </td>
                            `;

                        }
                        return data;
                    }
                }
                , {
                    data: 'qsr_e_correta', className: 'editable qsr_e_correta',
                    createdCell: function (td, cellData, rowData, row, col) {
                        let accesskey = (rowData.qst_num_questao != null && rowData.qst_num_questao > 0 && rowData.qsr_num_resposta != null && rowData.qsr_num_resposta > 0)
                            ? (rowData.qst_num_questao || 0) + '_' + (rowData.qsr_num_resposta || 0) : rowData.tempo.toString();
                        $(td)
                            .attr('id', `linh[${accesskey}][qsr_e_correta]`)
                            .attr('row', row)
                            .attr('col', col)
                            .attr('campo', 'qsr_e_correta')
                            .attr('data-qst_num_questao', rowData.qst_num_questao || '0')
                            .attr('data-qsr_num_resposta', rowData.qsr_num_resposta || '0')
                            .attr('accesskey', accesskey);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            var colorCancel = '';
                            let qsr_e_correta = data;
                            let accesskey = (row.qst_num_questao != null && row.qst_num_questao > 0 && row.qsr_num_resposta != null && row.qsr_num_resposta > 0)
                                ? (row.qst_num_questao || 0) + '_' + (row.qsr_num_resposta || 0) : row.tempo.toString();
                            return `
                                    <td  data-qst_num_questao="${row.qst_num_questao || 0}" data-qsr_num_resposta="${row.qsr_num_resposta || 0}"
                                        accesskey="${accesskey}"  style="width: 80px; text-align: center;">
                                        <select class="form-control qsr_e_correta"
                                            name="inpu[${accesskey}][qsr_e_correta]"
                                            id="inpu[${accesskey}][qsr_e_correta]"
                                            data-qst_num_questao="${row.qst_num_questao || 0}"
                                            data-qsr_num_resposta="${row.qsr_num_resposta || 0}"

                                            accesskey="${accesskey}" style="text-align:center; ${colorCancel || ''}" />
                                            <option value="S" ${qsr_e_correta === 'S' || qsr_e_correta === null || qsr_e_correta === undefined ? 'selected' : ''}>Sim</option>
                                            <option value="N" ${qsr_e_correta === 'N' ? 'selected' : ''}>Não</option>
                                        </select>

                                    </td>
                            `;

                        }
                        return data;
                    }
                }
                , {
                    data: 'qsr_situacao', className: 'editable qsr_situacao',
                    createdCell: function (td, cellData, rowData, row, col) {
                        let accesskey = (rowData.qst_num_questao != null && rowData.qst_num_questao > 0 && rowData.qsr_num_resposta != null && rowData.qsr_num_resposta > 0)
                            ? (rowData.qst_num_questao || 0) + '_' + (rowData.qsr_num_resposta || 0) : rowData.tempo.toString();
                        $(td)
                            .attr('id', `linh[${accesskey}][qsr_situacao]`)
                            .attr('row', row)
                            .attr('col', col)
                            .attr('campo', 'qsr_situacao')
                            .attr('data-qst_num_questao', rowData.qst_num_questao || '0')
                            .attr('data-qsr_num_resposta', rowData.qsr_num_resposta || '0')
                            .attr('accesskey', accesskey);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            var colorCancel = '';
                            let qsr_situacao = data;
                            let accesskey = (row.qst_num_questao != null && row.qst_num_questao > 0 && row.qsr_num_resposta != null && row.qsr_num_resposta > 0)
                                ? (row.qst_num_questao || 0) + '_' + (row.qsr_num_resposta || 0) : row.tempo.toString();
                            return `
                                    <td  data-qst_num_questao="${row.qst_num_questao || 0}" data-qsr_num_resposta="${row.qsr_num_resposta || 0}"
                                        accesskey="${accesskey}"  style="width: 80px; text-align: center;">
                                        <select class="form-control qsr_situacao"
                                            name="inpu[${accesskey}][qsr_situacao]"
                                            id="inpu[${accesskey}][qsr_situacao]"
                                            data-qst_num_questao="${row.qst_num_questao || 0}"
                                            data-qsr_num_resposta="${row.qsr_num_resposta || 0}"
                                            accesskey="${accesskey}" style="text-align:center; ${colorCancel || ''}"  >
                                             <option value="A" ${qsr_situacao === 'A' || qsr_situacao === null || qsr_situacao === undefined ? 'selected' : ''}>ATIVO</option>
                                             <option value="I" ${qsr_situacao === 'I' ? 'selected' : ''}>INATIVO</option>
                                             <option value="C" ${qsr_situacao === 'C' ? 'selected' : ''}>CORRIGIR</option>
                                        </select> 
                                    </td>
                            `;

                        }
                        return data;
                    }
                }
                , {
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        let accesskey = (rowData.qst_num_questao != null && rowData.qst_num_questao > 0 && rowData.qsr_num_resposta != null && rowData.qsr_num_resposta > 0)
                            ? (rowData.qst_num_questao || 0) + '_' + (rowData.qsr_num_resposta || 0) : rowData.tempo.toString();
                        $(td)
                            .attr('id', `linh[${accesskey}][editar]`)
                            .attr('row', row)
                            .attr('col', col)
                            .attr('campo', 'editar')
                            .attr('data-qst_num_questao', rowData.qst_num_questao || '0')
                            .attr('data-qsr_num_resposta', rowData.qsr_num_resposta || '0')
                            .attr('accesskey', accesskey);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            let accesskey = (row.qst_num_questao != null && row.qst_num_questao > 0 && row.qsr_num_resposta != null && row.qsr_num_resposta > 0)
                                ? (row.qst_num_questao || 0) + '_' + (row.qsr_num_resposta || 0) : row.tempo.toString();

                            return `
                                <td data-qst_num_questao="${row.qst_num_questao || 0}" data-qsr_num_resposta="${row.qsr_num_resposta || 0}"
                                    accesskey="${accesskey}"  style="width: 80px; text-align: center;">
                                    <div class="form-group" style="padding-bottom:0px;margin-bottom: 2px;text-align: center;">

                                        <button type="button" class="btn btn-light btn-editar-resposta" style=""
                                            data-qst_num_questao="${row.qst_num_questao}" data-qsr_num_resposta="${row.qsr_num_resposta}"  title="Editar Resposta">
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
                        let accesskey = (rowData.qst_num_questao != null && rowData.qst_num_questao > 0 && rowData.qsr_num_resposta != null && rowData.qsr_num_resposta > 0)
                            ? (rowData.qst_num_questao || 0) + '_' + (rowData.qsr_num_resposta || 0) : rowData.tempo.toString();
                        $(td)
                            .attr('id', `linh[${accesskey}][cancelar]`)
                            .attr('row', row)
                            .attr('col', col)
                            .attr('campo', 'cancelar')
                            .attr('data-eve_num_evento', rowData.eve_num_evento || '0')
                            .attr('data-qsr_num_resposta', rowData.qsr_num_resposta || '0')
                            .attr('accesskey', accesskey);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            let accesskey = (row.qst_num_questao != null && row.qst_num_questao > 0 && row.qsr_num_resposta != null && row.qsr_num_resposta > 0)
                                ? (row.qst_num_questao || 0) + '_' + (row.qsr_num_resposta || 0) : row.tempo.toString();
                            return `
                                <td data-qst_num_questao="${row.qst_num_questao || 0}" data-qsr_num_resposta="${row.qsr_num_resposta || 0}"
                                    accesskey="${accesskey}" style="width: 80px; text-align: center;">
                                    <div class="form-group" style="padding-bottom:0px;margin-bottom: 2px;text-align: center;">
                                        <button type="button" class="btn btn-light btn-cancelar-questao" style=""
                                            data-qst="${row.qst_num_questao}"  data-qsr_num_resposta="${row.qsr_num_resposta || 0}" title="Cancelar Questão">
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
                },
                {
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        let accesskey = (rowData.qst_num_questao != null && rowData.qst_num_questao > 0 && rowData.qsr_num_resposta != null && rowData.qsr_num_resposta > 0)
                            ? (rowData.qst_num_questao || 0) + '_' + (rowData.qsr_num_resposta || 0) : rowData.tempo.toString();
                        $(td)
                            .attr('id', `linh[${accesskey}][remover]`)
                            .attr('row', row)
                            .attr('col', col)
                            .attr('campo', 'remover')
                            .attr('data-eve_num_evento', rowData.eve_num_evento || '0')
                            .attr('data-qsr_num_resposta', rowData.qsr_num_resposta || '0')
                            .attr('accesskey', accesskey);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            let accesskey = (row.qst_num_questao != null && row.qst_num_questao > 0 && row.qsr_num_resposta != null && row.qsr_num_resposta > 0)
                                ? (row.qst_num_questao || 0) + '_' + (row.qsr_num_resposta || 0) : row.tempo.toString();
                            return `
                                <td data-qst_num_questao="${row.qst_num_questao || 0}" data-qsr_num_resposta="${row.qsr_num_resposta || 0}"
                                    accesskey="${accesskey}" style="width: 80px; text-align: center;">
                                    <div class="form-group" style="padding-bottom:0px;margin-bottom: 2px;text-align: center;">`
                                    +
                                    (
                                        (row.qsr_num_resposta != null && row.qsr_num_resposta > 0)
                                        ?
                                        `<button type="button" class="btn btn-light" style=""
                                            data-qst="${row.qst_num_questao}"  data-qsr_num_resposta="${row.qsr_num_resposta || 0}"
                                            accesskey="${accesskey}"
                                        >
                                                <span accesskey="${accesskey}" id="inpu[${accesskey}][remover]" style="" />
                                                    <i class="fa-regular fa-trash-can text-secondary fa-lg"></i>
                                                </span>
                                        </button> `
                                        :
                                        `<button type="button" class="btn btn-light btn-remover-resposta" style=""
                                            data-qst="${row.qst_num_questao}"  data-qsr_num_resposta="${row.qsr_num_resposta || 0}"
                                            accesskey="${accesskey}" title="Remover Resposta"
                                        >
                                                <span accesskey="${accesskey}" id="inpu[${accesskey}][remover]" style="" />
                                                    <i class="fa-regular fa-trash-can text-danger fa-lg"></i>
                                                </span>
                                        </button> `
                                    )
                                    +
                                ` </div>
                                </td> `;
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
                { targets: [2, 3, 4], visible: true }, { targets: [0, 1, 5, 6], visible: false }
            ],
            order: [[0, 'asc']],
            autoFill: true
        }).draw();

        // console.log('DataTable inicializado com sucesso.');
    }

    export function carregarQuestoes() {
        var jqxhr = $.post("/Gestao/ObterQuestoes", {}, function (data) {
            console.log("success");
            console.log(data);

            if (data.sucesso) {

                if (data.lista != null && data.lista.length > 0) {

                    let listaQuestoes = processaDadosParaTable(data.lista);
                    console.table(listaQuestoes);
                    GestQ.initializeDataTableQuestoes(listaQuestoes, GestQ._mes, GestQ._ano, 100);

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

                console.log(data);
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

    export function carregarCamposDeQuestao(questoesDtos: any) {
        console.log('questoesDtos');
        console.log(questoesDtos);
        $('input[name="qst_num_questao"]').val(questoesDtos.qst_num_questao);
        $('textarea[name="qst_enunciado"]').val(questoesDtos.qst_enunciado);
        $('select[name="qst_situacao"]').val(questoesDtos.qst_situacao);
    }

    export function editarQuestao(qst_num_questao: number) {
        var jqxhr = $.post("/Gestao/ObterQuestao", { qst_num_questao: qst_num_questao }, function (data) {

            if (data.sucesso) {
                // console.log("data.lista");
                // console.table(data.lista);
                GestQ.questoesDtos = [];
                let questoesDtos = processDadosQuestoesForTable(data.lista);
                GestQ.carregarCamposDeQuestao(questoesDtos[0]);
            } else {
                ScriptsConfig.swalconfirmeActionAlertaWarning.fire({
                    icon: 'info',
                    title: '<code style="color:#045C99;font-size:22px;">Olá</code><br>',
                    imageUrl: "/Content/img/logo-ageprev-ms-origin.png",
                    imageWidth: 300,
                    width: 1080,
                    height: 700,
                    html: '<span style="color:#045C99;font-size:20px;">Não há questão disponivel para Edição</b></span>',
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


        var jqxhr = $.post("/Gestao/ObterRespostasPorQuestao", { qst_num_questao: qst_num_questao }, function (data) {

            if (data.sucesso) {
                // console.log("data.lista");
                // console.table(data.lista);
                GestQ.respostasDtos = [];

                let respostasDtos = processDadosRespostasForTable(data.lista);

                GestQ.initializeDataTableRespostas(respostasDtos, GestQ._mes, GestQ._ano, 100);

                console.table(respostasDtos);
                // GestQ.carregarCamposDeQuestao(respostasDtos[0]);
            } else {
                ScriptsConfig.swalconfirmeActionAlertaWarning.fire({
                    icon: 'info',
                    title: '<code style="color:#045C99;font-size:22px;">Olá</code><br>',
                    imageUrl: "/Content/img/logo-ageprev-ms-origin.png",
                    imageWidth: 300,
                    width: 1080,
                    height: 700,
                    html: '<span style="color:#045C99;font-size:20px;">Não há questão disponivel para Edição</b></span>',
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

        if ($('#content-table-questoes').css('display') === 'block') {
            $('#content-table-questoes').css('display', 'none');
            $('#content-cad-questao').css('display', 'block');
        } else {
            $('#content-table-questoes').css('display', 'block');
            $('#content-cad-questao').css('display', 'none');
        }
    }

    export function editarResposta(qst_num_questao: number, qsr_num_resposta: number) {
        var jqxhr = $.post("/Gestao/ObterRespostaPorId", { qst_num_questao: qst_num_questao, qsr_num_resposta: qsr_num_resposta }, function (data) {

            if (data.sucesso) {
                // console.log("data.lista");

                GestQ.respostasDtos = [];
                let respostasDtos = processDadosRespostasForTable(data.lista);
                console.table(respostasDtos);
                //GestQ.initializeDataTableRespostas(respostasDtos, GestQ._mes, GestQ._ano, 100);

                // GestQ.carregarCamposDeQuestao(respostasDtos[0]);
            } else {
                ScriptsConfig.swalconfirmeActionAlertaWarning.fire({
                    icon: 'info',
                    title: '<code style="color:#045C99;font-size:22px;">Olá</code><br>',
                    imageUrl: "/Content/img/logo-ageprev-ms-origin.png",
                    imageWidth: 300,
                    width: 1080,
                    height: 700,
                    html: '<span style="color:#045C99;font-size:20px;">Não há resposta disponivel para Edição</b></span>',
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





        // if ($('#content-table-questoes').css('display') === 'block') {
        //     $('#content-table-questoes').css('display', 'none');
        //     $('#content-cad-questao').css('display', 'block');
        // } else {
        //     $('#content-table-questoes').css('display', 'block');
        //     $('#content-cad-questao').css('display', 'none');
        // }
    }

    export let listaBusca = GestQ.listaUsuariosPontos;

    export function buscarUsuarioaNoRelatorio() {
        const normalizeStr = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        let busca: string = normalizeStr($('input[name="buscaLimpa"]').val() as string || '');

        // Keep hidden busca input in sync
        $('input[name="busca"]').val($('input[name="buscaLimpa"]').val() as string || '');

        let lista = GestQ.listaUsuariosPontos || [];
        GestQ.listaBusca = lista;

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
                    matchingQueKeys.add(`${p.eve_num_evento}_${p.que_num_questionario} `);
                }
            });

            GestQ.listaBusca = lista.filter(item => {
                if (!item) return false;
                // if (Number(item.usr_num_usuario) === 0) {
                //     if (item.que_num_questionario === 0) {
                //         return matchingEventIds.has(item.eve_num_evento);
                //     } else {
                //         return matchingQueKeys.has(`${ item.eve_num_evento }_${ item.que_num_questionario } `);
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
            console.table(GestQ.listaBusca);
        }
    }

    export function formValido() {
        let ret: boolean = true;
        GestQ.msgValido = '';

        const qst_enunciado = String($('textarea[name="qst_enunciado"]').val() || '').trim();
        if (!qst_enunciado) {
            ret = false;
            GestQ.msgValido += '</br>🔸O campo de Enunciado deve ser preenchido';
        }

        const qst_situacao = String($('select[name="qst_situacao"] option:selected').val() || '').trim();
        if (!qst_situacao) {
            ret = false;
            GestQ.msgValido += '</br>🔸O campo de Situação deve ser preenchido';
        }

        const respostaRows = $('#table-lista-respostas tbody tr');
        let respostasValidas = 0;
        let respostaCorreta = 0;

        if (respostaRows.length === 0) {
            ret = false;
            GestQ.msgValido += '</br>🔸Pelo menos uma resposta deve ser adicionada';
        } else {
            respostaRows.each(function (index, row) {
                const $row = $(row);
                const accesskey = $row.attr('accesskey') || $row.find('[accesskey]').first().attr('accesskey') || '';
                const qsr_enunciado = String($row.find('input.qsr_enunciado').val() || '').trim();
                // Use selectors by class within the row to avoid building invalid attribute selectors
                const qsr_e_correta = String($row.find('select.qsr_e_correta').val() || '').trim();
                const qsr_situacao = String($row.find('select.qsr_situacao').val() || '').trim();

                if (qsr_enunciado) {
                    respostasValidas += 1;
                }

                if (!qsr_enunciado) {
                    ret = false;
                    GestQ.msgValido += `</br>🔸O campo Enunciado da resposta ${index + 1} deve ser preenchido`;
                }
                if (qsr_e_correta === 'S' && qsr_situacao === 'A') {
                    respostaCorreta += 1;
                }
                if (!qsr_e_correta) {
                    ret = false;
                    GestQ.msgValido += `</br>🔸O campo Correta da resposta ${index + 1} deve ser preenchido`;
                }
                if (!qsr_situacao) {
                    ret = false;
                    GestQ.msgValido += `</br>🔸O campo Situação da resposta ${index + 1} deve ser preenchido`;
                }
            });

            if (respostasValidas === 0) {
                ret = false;
                GestQ.msgValido += '</br>🔸Pelo menos uma resposta com enunciado deve ser adicionada';
            }
            if (respostaCorreta === 0) {
                ret = false;
                GestQ.msgValido += '</br>🔸Pelo menos uma resposta deve ser marcada como correta';
            }
        }

        return ret;
    }

    export function SalvarQuestao() {

        var dadosForm = $('form[name="formCadQuestao"]').serializeArray();

        var jqxhr = $.post('/Gestao/SalvarQuestao', dadosForm, function (data) {

            if (data.sucesso) {
                console.log('Questão e respostas salvas');
                console.table(data.lista);
                if (data.lista != null && data.lista.length > 0) {
                    window.location.reload();
                } else {
                    ScriptsConfig.swalconfirmeActionAlertaWarning.fire({
                        icon: 'info',
                        title: '<code style="color:#045C99;font-size:22px;">Olá</code><br>',
                        imageUrl: "/Content/img/logo-ageprev-ms-origin.png",
                        imageWidth: 300,
                        width: 1080,
                        height: 700,
                        html: '<span style="color:#045C99;font-size:20px;">Não foi possível registrar</b></span>',
                        showCancelButton: false,
                        confirmButtonText: "Ok",
                        cancelButtonText: "Não",
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
                    console.log("second success");
                } else { console.log("dados não encontrado"); }
                console.log(data);
            })
            .fail(function (_XMLHttpRequest_, textStatus, errorThrown) {
                console.log("error", '/Gerencia/SalvarQuestao');
                ScriptsConfig.failFunctionAjaxConsole(_XMLHttpRequest_, textStatus, errorThrown);
            })
            .always(function (data) {
                console.log("finished");
                console.log(data);
                $('#botoes').css('display', 'block');
            });

        // throw new Error("Function not implemented.");
    }
    

    $(function () {

        _ano = '2026';
        _mes = '6';

        setTimeout(() => {
            console.log("This prints after 2 seconds!");
            // carregarEventos();
            GestQ.carregarQuestoes();
        }, 200);

        console.log('fetchDataAndInitializeTable()');
        $.when(GestQ.carregarIndices()).then(function (data, textStatus, jqXHR) {

        });

        $('input[name="buscaLimpa"]').on('input', function () {
            // Remove all non-numeric characters before saving
            var cleanValue = ($(this).val() as string);
            $('input[name="busca"]').val(cleanValue)
            console.log("Cleaned:", cleanValue);
        });

        $('button[name="btnBuscar"]').on('click', function (e) {

            $.when(GestQ.buscarUsuarioaNoRelatorio()).then(function (data, textStatus, jqXHR) {
                $.when(GestQ.initializeDataTable(GestQ.listaBusca, _ano, _mes, 100)).then(function (data, textStatus, jqXHR) {
                    $('input[name="buscaLimpa"]').val('');
                    console.log('Pontuação carregada com filtro');
                });
            });
        });

        $('#content-table-questoes tbody').on('click', 'button.btn-editar-questao', function () {
            const qst_num_questao = Number($(this).data('qst') || 0);
            GestQ.editarQuestao(qst_num_questao)
        });

        $('#content-cad-questao-resposta').on('click', 'button.btn-editar-resposta', function () {
            const qst_num_questao = Number($(this).data('qst_num_questao') || 0);
            const qsr_num_resposta = Number($(this).data('qsr_num_resposta') || 0);
            GestQ.editarResposta(qst_num_questao, qsr_num_resposta);
        });
        
        $('button[name="btn-salvar-questao"]').on('click', function (e) {
             ScriptsConfig.swalconfirmeActionAlerta.fire({
                title: '<span style="color:#045C99;font-size:22px;">Atenção!</span>',
                html: '<span style="color:#045C99;font-size:20px;">Deseja salvar a questão <br /> juntamente com suas respectivas respostas?<span>',
                icon: "info",
                showCancelButton: false,
                showDenyButton: true,
                confirmButtonText: '<i class="fa-solid fa-check"></i> Sim',
                denyButtonText: 'Não <i class="fa-solid fa-arrow-right-from-bracket"></i>',
                cancelButtonText: "",
                reverseButtons: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
                backdrop: true,
                footer: ScriptsConfig.footerAlert
            }).then((result) => {
                if (result.isConfirmed) {
                    if (GestQ.formValido()) {
                        GestQ.SalvarQuestao();
                    } else {
                        Swal.fire({
                            icon: "warning",
                            title: '<span style="color:#045C99;font-size:22px;">Atenção!</span>',
                            html: '<label style="color:#045C99;font-size:20px;text-align:left;">' + GestQ.msgValido + '<label>',
                            footer: ScriptsConfig.footerAlert
                        });
                    }
                } else {

                }
            });
        });

        $('button[name="btn-abrir-cadastro"]').on('click', function (e) {
            $('#content-table-questoes').css('display', 'none');
            $('#content-cad-questao').css('display', 'block');
            let questaoDtos = {
                qst_num_questao: 0,
                qst_enunciado: '',
                qst_situacao: 'A'
            };
            GestQ.carregarCamposDeQuestao(questaoDtos);
            GestQ.respostasDtos = [];
            GestQ.initializeDataTableRespostas(GestQ.respostasDtos, GestQ._mes, GestQ._ano, 100);
        });

        $('button[name="btn-fechar-cadastro"]').on('click', function (e) {
            $('#content-table-questoes').css('display', 'block');
            $('#content-cad-questao').css('display', 'none');
        });

        $('button[name="btn-adicionar-resposta-registro"]').on('click', function (e) {
            let tempo: number = Date.now();
            let qst_num_questao = $('form[name="formCadQuestao"] input[name="qst_num_questao"]').val();

            GestQ.addRegistroNoArray({
                tempo: tempo,
                qst_num_questao: qst_num_questao || 0,
                qsr_num_resposta: 0,
                qsr_enunciado: '',
                qsr_e_correta: 'N',
                qsr_situacao: 'A'
            }).then(function (newData) {
                // Agora todos os dados do DataTable estão em respostasDtos
                // e o novo registro foi adicionado
                GestQ.initializeDataTableRespostas(GestQ.respostasDtos, GestQ._mes, GestQ._ano, 100);
            }).catch(function (error) {
                console.error('Erro ao adicionar registro:', error);
            });

        });

        $('#content-cad-questao-resposta').on('click', 'button.btn-remover-resposta', function () {
            
            const accesskey = $(this).attr('accesskey') || '0';
            const tempoKey = parseInt(accesskey, 10);
            
            if (typeof GestQ.syncDataTableToArray === 'function') {
                try { GestQ.syncDataTableToArray(); } catch (e) { /* ignore */ }
            }
            
            if (!isNaN(tempoKey)) {
                GestQ.respostasDtos = GestQ.respostasDtos.filter(item => {
                    return Number(item.tempo) !== tempoKey;
                });
            }
            
            GestQ.initializeDataTableRespostas(GestQ.respostasDtos, GestQ._mes, GestQ._ano, 100);
        });


        /*
        setTimeout(() => {
            console.log("This prints after 2 seconds!");
            fetchDataAndInitializeTable();
        }, 200);
        */

    });



}

declare module "GestQ" {
    export = GestQ;
}