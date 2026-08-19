"use strict";
var GestQs;
(function (GestQs) {
    GestQs.tempo = Date.now();
    let municipiosList = [];
    let carregandoMunicipios = false;
    let selectedIndex = -1;
    GestQs.eventosDtos = [];
    GestQs.questionariosDtos = [];
    GestQs.dataTableInstanceEventos = null;
    GestQs.dataTableInstance = null;
    GestQs.dataTableInstanceEveQuestion = null;
    GestQs.dataTableInstanceEventosQuestionarios = null;
    GestQs._ano = '0';
    GestQs._mes = '0';
    GestQs.eve_num_evento = 0;
    GestQs.que_num_questionario = 0;
    GestQs.eventos = [];
    GestQs.listaEventos = [];
    GestQs.dadosDaTabela = [];
    GestQs.listaUsuariosPontos = [];
    function addRegistroNoArray(rowData) {
        let tempo = Date.now();
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
    function initializeDataTable(data, mes, ano, pageLength) {
        if (!Array.isArray(data)) {
            console.error('Os dados recebidos não são válidos:', data);
            data = [];
        }
        console.table(data);
        if (GestQs.dataTableInstance) {
            GestQs.dataTableInstance.destroy();
        }
        $('#table-lista-itens tbody').empty();
        GestQs.dataTableInstance = $('#table-lista-itens').DataTable({
            data: data,
            paging: true,
            pageLength: pageLength,
            destroy: true,
            fixedHeader: true,
            info: true,
            lengthMenu: [100, 250, 500, 750, 1000],
            dom: 'Bfrtip',
            buttons: [
                {
                    extend: 'excelHtml5',
                    extension: '.xlsx',
                    header: true,
                    footer: false,
                    autoFilter: false,
                    bom: false,
                    sheetName: 'SigEventos ' + mes + '-de-' + ano,
                    messageTop: 'SigEventos: ' + mes + '/' + ano,
                    text: '<i class="far fa-file-excel text-success fa-lg"></i>',
                    title: null,
                    filename: function () {
                        return 'SigEventos-mes-' + mes + '-de-' + ano;
                    },
                    exportOptions: {
                        columns: [0, 1, 3],
                        format: {
                            body: function (data, row, column, node) {
                                var _a;
                                console.log(data);
                                const $vale = $(data);
                                console.log($vale.filter('.mes_ano').val());
                                switch (column) {
                                    case 0:
                                        return (_a = $(node).find('input[type="text"]').val()) === null || _a === void 0 ? void 0 : _a.toString();
                                        break;
                                    case 1:
                                        return $(node).find('input[type="hidden"]').val();
                                        break;
                                    case 2:
                                        return $(node).find('div').text();
                                        break;
                                    case 3:
                                        return $(node).find('span').text();
                                        break;
                                    case 4:
                                        return $(node).find('button').text();
                                        break;
                                    default:
                                        return $(node).find('input[type="text"]').val();
                                }
                            }
                        }
                    }
                },
                {
                    extend: 'pdfHtml5',
                    title: null,
                    filename: function () {
                        return 'SigEventos-mes-' + mes + '-de-' + ano;
                    },
                    text: '<i class="fa-regular fa-file-pdf text-danger fa-lg"></i>',
                    exportOptions: {
                        columns: [0, 1, 3],
                        format: {
                            body: function (data, row, column, node) {
                                var _a;
                                console.log(data);
                                const $vale = $(data);
                                console.log($vale.filter('.usr_cpf').val());
                                switch (column) {
                                    case 0:
                                        return (_a = $(node).find('input[type="text"]').val()) === null || _a === void 0 ? void 0 : _a.toString();
                                        break;
                                    case 1:
                                        return $(node).find('input[type="hidden"]').val();
                                        break;
                                    case 2:
                                        return $(node).find('div').text();
                                        break;
                                    case 3:
                                        return $(node).find('span').text();
                                        break;
                                    case 4:
                                        return $(node).find('button').text();
                                        break;
                                    default:
                                        return $(node).find('input[type="text"]').val();
                                }
                            }
                        }
                    }
                },
                {
                    extend: 'colvis',
                    autoFilter: true,
                    sheetName: 'colvis',
                    text: '<i class="fas fa-columns text-primary fa-lg"></i>',
                    orientation: 'portrait',
                    customize: function (doc) {
                    },
                    exportOptions: {
                        columns: [0, 1, 2, 3, 4]
                    }
                }
            ],
            initComplete: function () {
                var table = GestQs.dataTableInstance;
                table.buttons([0, 1, 2]).remove();
            },
            lengthChange: true,
            searching: false,
            ordering: true,
            columns: [
                {
                    data: 'usr_cpf', className: 'editable usr_cpf',
                    createdCell: function (td, cellData, rowData, row, col) {
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
                            }
                            else {
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
                        return data;
                    }
                }, {
                    data: 'usr_nome', className: 'editable',
                    createdCell: function (td, cellData, rowData, row, col) {
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
                            let usr_nome = data;
                            let usr_cpf = "";
                            if (row.usr_cpf.length === 11) {
                                usr_cpf = "***." + row.usr_cpf.substring(3, 6) + "." + row.usr_cpf.substring(6, 9) + "-**";
                            }
                            else {
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
                            }
                            else {
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
                            }
                            else {
                                let pontuacao = Number(data.toFixed(2));
                                let nota = pontuacao === null || pontuacao === void 0 ? void 0 : pontuacao.toString().replace('.', ',');
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
    }
    GestQs.initializeDataTable = initializeDataTable;
    function carregarIndices() { }
    GestQs.carregarIndices = carregarIndices;
    function gerarHTML(lista) {
        GestQs.listaUsuariosPontos = [];
        const eventosMapa = {};
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
        let tabela = '<table class="table table-striped">';
        Object.values(eventosMapa).forEach(ev => {
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
    }
    ;
    function processDataForTable(data) {
        return data.map(item => {
            const mesAno = 0;
            return Object.assign(Object.assign({}, item), { mes_ano: mesAno, tempo: item.usr_num_usuario || Date.now() });
        });
    }
    function fetchDataAndInitializeTable() {
        console.log('Iniciando busca de dados da API...');
        var dadosForm = $('form[name="formRelPontuacao"]').serializeArray();
        var jqxhr = $.post('/Relpontuacao/ListaPonto', dadosForm, function (json) {
            console.log("success");
            console.table(json);
            console.log('Dados recebidos da API:', json.lista);
            if (json.qtd > 0) {
                if (json.sucesso) {
                    if (json.lista && json.lista.length > 0) {
                        $('input[name="busca"]').val('');
                        $('input[name="buscaLimpa"]').val('');
                        $('#content-table').css('display', 'block');
                        $('#content-table').css('width', '100%');
                        GestQs.dadosDaTabela = processDataForTable(json.lista);
                        console.table(GestQs.dadosDaTabela);
                        let listaUsuariosPontos = gerarHTML(json.lista);
                        console.table(listaUsuariosPontos);
                        $.when(initializeDataTable(listaUsuariosPontos, GestQs._ano, GestQs._mes, 100)).then(function (data, textStatus, jqXHR) {
                            console.log('Pontuação carregada');
                        });
                    }
                    else {
                        initializeDataTable([], GestQs._ano, GestQs._mes, 1);
                    }
                }
                else {
                    initializeDataTable([], GestQs._ano, GestQs._mes, 1);
                }
            }
            else {
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
                    }
                    else {
                    }
                });
            }
        }, "json").done(function (data) {
            console.log("done success");
            console.table(data);
        }).fail(function (_XMLHttpRequest_, textStatus, errorThrown) {
            console.log("error");
            console.log(_XMLHttpRequest_);
            console.log(textStatus);
            console.log(errorThrown);
        }).always(function (data) {
            console.log("finished");
            console.table(data);
        });
    }
    GestQs.fetchDataAndInitializeTable = fetchDataAndInitializeTable;
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
    GestQs.eventoDescricao = eventoDescricao;
    function eventoQuestionarioPontosPorUsuario(eve_num_evento, que_num_questionario) {
        $('input[name="eve_num_evento"]').val(eve_num_evento);
        $('input[name="que_num_questionario"]').val(que_num_questionario);
        GestQs.fetchDataAndInitializeTable();
    }
    GestQs.eventoQuestionarioPontosPorUsuario = eventoQuestionarioPontosPorUsuario;
    GestQs.listaBusca = GestQs.listaUsuariosPontos;
    function buscarUsuarioaNoRelatorio() {
        const normalizeStr = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        let busca = normalizeStr($('input[name="buscaLimpa"]').val() || '');
        $('input[name="busca"]').val($('input[name="buscaLimpa"]').val() || '');
        let lista = GestQs.listaUsuariosPontos || [];
        GestQs.listaBusca = lista;
        if (busca.length > 0) {
            const cleanBusca = busca.replace(/[.\-/]/g, '');
            const matchingParticipants = lista.filter(item => {
                if (!item || Number(item.usr_num_usuario) === 0)
                    return false;
                const rawCpf = String(item.usr_cpf || '').toLowerCase();
                let maskedCpf = '';
                if (rawCpf.length === 11) {
                    maskedCpf = "***." + rawCpf.substring(3, 6) + "." + rawCpf.substring(6, 9) + "-**";
                }
                else {
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
            const matchingEventIds = new Set();
            const matchingQueKeys = new Set();
            matchingParticipants.forEach(p => {
                if (p) {
                    matchingEventIds.add(p.eve_num_evento);
                    matchingQueKeys.add(`${p.eve_num_evento}_${p.que_num_questionario}`);
                }
            });
            GestQs.listaBusca = lista.filter(item => {
                if (!item)
                    return false;
                const rawCpf = String(item.usr_cpf || '').toLowerCase();
                let maskedCpf = '';
                if (rawCpf.length === 11) {
                    maskedCpf = "***." + rawCpf.substring(3, 6) + "." + rawCpf.substring(6, 9) + "-**";
                }
                else {
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
            console.table(GestQs.listaBusca);
        }
    }
    GestQs.buscarUsuarioaNoRelatorio = buscarUsuarioaNoRelatorio;
    function processDadosEventosForTable(data) {
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
    GestQs.processDadosEventosForTable = processDadosEventosForTable;
    function processDadosQuestionariosForTable(data) {
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
    GestQs.processDadosQuestionariosForTable = processDadosQuestionariosForTable;
    function initializeDataTableEventos(data, mes, ano, pageLength) {
        if (!Array.isArray(data)) {
            console.error('Os dados recebidos não são válidos:', data);
            data = [];
        }
        try {
            if ($.fn && $.fn.dataTable && $.fn.dataTable.isDataTable && $.fn.dataTable.isDataTable('#table-lista-eventos')) {
                try {
                    const existing = $('#table-lista-eventos').DataTable();
                    existing.clear && existing.clear();
                    existing.destroy && existing.destroy();
                }
                catch (err) {
                    console.warn('Falha ao destruir DataTable via API:', err);
                }
                try {
                    $('.dt-buttons').remove();
                }
                catch (e) { }
                try {
                    $('.fixedHeader-floating').remove();
                }
                catch (e) { }
                try {
                    $('#table-lista-eventos_wrapper').remove();
                }
                catch (e) { }
                GestQs.dataTableInstanceEventos = null;
            }
        }
        catch (e) {
            console.warn('Erro ao verificar/destruir DataTable anterior:', e);
        }
        $('#table-lista-eventos tbody').empty();
        GestQs.dataTableInstanceEventos = $('#table-lista-eventos').DataTable({
            data: data,
            paging: true,
            pageLength: pageLength,
            destroy: true,
            fixedHeader: true,
            info: true,
            lengthMenu: [100, 250, 500, 750, 1000],
            dom: 'Bfrtip',
            buttons: [
                {
                    extend: 'excelHtml5',
                    extension: '.xlsx',
                    header: true,
                    footer: false,
                    autoFilter: false,
                    bom: false,
                    sheetName: 'SigEventos ' + mes + '-de-' + ano,
                    messageTop: 'SigEventos: ' + mes + '/' + ano,
                    text: '<i class="far fa-file-excel text-success fa-lg"></i>',
                    title: null,
                    filename: function () {
                        return 'SigEventos-mes-' + mes + '-de-' + ano;
                    },
                    exportOptions: {
                        columns: [0, 1, 3],
                        format: {
                            body: function (data, row, column, node) {
                                var _a;
                                console.log(data);
                                const $vale = $(data);
                                console.log($vale.filter('.mes_ano').val());
                                switch (column) {
                                    case 0:
                                        return (_a = $(node).find('input[type="text"]').val()) === null || _a === void 0 ? void 0 : _a.toString();
                                        break;
                                    case 1:
                                        return $(node).find('input[type="hidden"]').val();
                                        break;
                                    case 2:
                                        return $(node).find('div').text();
                                        break;
                                    case 3:
                                        return $(node).find('span').text();
                                        break;
                                    case 4:
                                        return $(node).find('button').text();
                                        break;
                                    default:
                                        return $(node).find('input[type="text"]').val();
                                }
                            }
                        }
                    }
                },
                {
                    extend: 'pdfHtml5',
                    title: null,
                    filename: function () {
                        return 'SigEventos-mes-' + mes + '-de-' + ano;
                    },
                    text: '<i class="fa-regular fa-file-pdf text-danger fa-lg"></i>',
                    exportOptions: {
                        columns: [0, 1, 3],
                        format: {
                            body: function (data, row, column, node) {
                                var _a;
                                console.log(data);
                                const $vale = $(data);
                                console.log($vale.filter('.usr_cpf').val());
                                switch (column) {
                                    case 0:
                                        return (_a = $(node).find('input[type="text"]').val()) === null || _a === void 0 ? void 0 : _a.toString();
                                        break;
                                    case 1:
                                        return $(node).find('input[type="hidden"]').val();
                                        break;
                                    case 2:
                                        return $(node).find('div').text();
                                        break;
                                    case 3:
                                        return $(node).find('span').text();
                                        break;
                                    case 4:
                                        return $(node).find('button').text();
                                        break;
                                    default:
                                        return $(node).find('input[type="text"]').val();
                                }
                            }
                        }
                    }
                },
                {
                    extend: 'colvis',
                    autoFilter: true,
                    sheetName: 'colvis',
                    text: '<i class="fas fa-columns text-primary fa-lg"></i>',
                    orientation: 'portrait',
                    customize: function (doc) {
                    },
                    exportOptions: {
                        columns: [0, 1, 2, 3, 4]
                    }
                }
            ],
            initComplete: function () {
                var api = this.api();
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
                },
                {
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
                },
                {
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
                },
                {
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
                },
                {
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
                },
                {
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
                },
                {
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
                },
                {
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
                },
                {
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
                },
                {
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
    }
    GestQs.initializeDataTableEventos = initializeDataTableEventos;
    function gerarEventosQuestionarioHTML(lista) {
        var _a, _b, _c, _d;
        GestQs.listaEventos = [];
        let tabela = '<table class="table table-striped">';
        GestQs.eve_num_evento = Number((_b = (_a = $('input[name="eve_num_evento"]').val()) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : '0');
        GestQs.que_num_questionario = Number((_d = (_c = $('input[name="que_num_questionario"]').val()) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : '0');
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
            let cab_eve_descricao = q.eve_descricao.toString();
            let descri = ((cab_eve_descricao.length >= 100) ? cab_eve_descricao.substring(0, 100) + '<span class="text-danger" style="cursor:pointer;"> ... Saiba mais ... </span>' : cab_eve_descricao);
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
    GestQs.gerarEventosQuestionarioHTML = gerarEventosQuestionarioHTML;
    function carregarEventos() {
        var jqxhr = $.post("/Gestao/ObterEventos", {}, function (data) {
            console.log("success");
            if (data.sucesso) {
                if (data.eventos != null && data.eventos.length > 0) {
                    let lstEventos = processDadosEventosForTable(data.eventos);
                    gerarEventosQuestionarioHTML(lstEventos);
                    GestQs.initializeDataTableEventos(lstEventos, GestQs._mes, GestQs._ano, 100);
                }
                else {
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
    GestQs.carregarEventos = carregarEventos;
    function carregarCamposDeEvento(eventosDtos) {
        console.log('eventosDtos');
        console.log(eventosDtos);
    }
    GestQs.carregarCamposDeEvento = carregarCamposDeEvento;
    function initializeDataTableEventosQuestionarios(data, mes, ano, pageLength) {
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
                }
                catch (err) {
                    console.warn('Falha ao destruir DataTable via API:', err);
                }
                try {
                    $('.dt-buttons').remove();
                }
                catch (e) { }
                try {
                    $('.fixedHeader-floating').remove();
                }
                catch (e) { }
                try {
                    $('#table-lista-respostas_wrapper').remove();
                }
                catch (e) { }
                GestQs.dataTableInstanceEventosQuestionarios = null;
            }
        }
        catch (e) {
            console.warn('Erro ao verificar/destruir DataTable anterior:', e);
        }
        $('#table-lista-questionario tbody').empty();
        GestQs.dataTableInstanceEventosQuestionarios = $('#table-lista-questionario').DataTable({
            data: data,
            paging: false,
            pageLength: pageLength,
            destroy: true,
            fixedHeader: true,
            info: false,
            lengthMenu: [100, 250, 500, 750, 1000],
            dom: 'Bfrtip',
            buttons: [
                {
                    extend: 'excelHtml5',
                    extension: '.xlsx',
                    header: true,
                    footer: false,
                    autoFilter: false,
                    bom: false,
                    sheetName: 'SigEventos ' + mes + '-de-' + ano,
                    messageTop: 'SigEventos: ' + mes + '/' + ano,
                    text: '<i class="far fa-file-excel text-success fa-lg"></i>',
                    title: null,
                    filename: function () {
                        return 'SigEventos-mes-' + mes + '-de-' + ano;
                    },
                    exportOptions: {
                        columns: [0, 1, 3],
                        format: {
                            body: function (data, row, column, node) {
                                var _a;
                                console.log(data);
                                const $vale = $(data);
                                console.log($vale.filter('.mes_ano').val());
                                switch (column) {
                                    case 0:
                                        return (_a = $(node).find('input[type="text"]').val()) === null || _a === void 0 ? void 0 : _a.toString();
                                        break;
                                    case 1:
                                        return $(node).find('input[type="hidden"]').val();
                                        break;
                                    case 2:
                                        return $(node).find('div').text();
                                        break;
                                    case 3:
                                        return $(node).find('span').text();
                                        break;
                                    case 4:
                                        return $(node).find('button').text();
                                        break;
                                    default:
                                        return $(node).find('input[type="text"]').val();
                                }
                            }
                        }
                    }
                },
                {
                    extend: 'pdfHtml5',
                    title: null,
                    filename: function () {
                        return 'SigEventos-mes-' + mes + '-de-' + ano;
                    },
                    text: '<i class="fa-regular fa-file-pdf text-danger fa-lg"></i>',
                    exportOptions: {
                        columns: [0, 1, 3],
                        format: {
                            body: function (data, row, column, node) {
                                var _a;
                                console.log(data);
                                const $vale = $(data);
                                console.log($vale.filter('.usr_cpf').val());
                                switch (column) {
                                    case 0:
                                        return (_a = $(node).find('input[type="text"]').val()) === null || _a === void 0 ? void 0 : _a.toString();
                                        break;
                                    case 1:
                                        return $(node).find('input[type="hidden"]').val();
                                        break;
                                    case 2:
                                        return $(node).find('div').text();
                                        break;
                                    case 3:
                                        return $(node).find('span').text();
                                        break;
                                    case 4:
                                        return $(node).find('button').text();
                                        break;
                                    default:
                                        return $(node).find('input[type="text"]').val();
                                }
                            }
                        }
                    }
                },
                {
                    extend: 'colvis',
                    autoFilter: true,
                    sheetName: 'colvis',
                    text: '<i class="fas fa-columns text-primary fa-lg"></i>',
                    orientation: 'portrait',
                    customize: function (doc) {
                    },
                    exportOptions: {
                        columns: [0, 1, 2, 3, 4]
                    }
                }
            ],
            initComplete: function () {
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
                },
                {
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
                },
                {
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
                },
                {
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
                },
                {
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
                },
                {
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
                },
                {
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
                },
                {
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
    }
    GestQs.initializeDataTableEventosQuestionarios = initializeDataTableEventosQuestionarios;
    function editarEventoQuestionrio(questionariosDtos) {
        var dadosForm = $('form[name="formCadQuestionario"]').serializeArray();
        var jqxhr = $.post("/Gestao/ObterEventoQuestionarios", dadosForm, function (data) {
            if (data.sucesso) {
                GestQs.eventosDtos = [];
                let eventosDtos = processDadosEventosForTable(data.eventos);
                GestQs.carregarCamposDeEvento(eventosDtos[0]);
                GestQs.questionariosDtos = [];
                let questionariosDtos = processDadosQuestionariosForTable(data.questionarios);
                console.table(questionariosDtos);
                GestQs.initializeDataTableEventosQuestionarios(questionariosDtos, GestQs._mes, GestQs._ano, 100);
            }
            else {
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
                    }
                    else {
                    }
                });
            }
        }, "json")
            .done(function (data) {
        })
            .fail(function (_XMLHttpRequest_, textStatus, errorThrown) {
            console.log("error");
            console.log(_XMLHttpRequest_);
            console.log(textStatus);
            console.log(errorThrown);
        })
            .always(function (data) {
        });
        $('#div-lista-questionario').css('display', 'block');
        $('#div-lista-evento-question').css('display', 'none');
    }
    GestQs.editarEventoQuestionrio = editarEventoQuestionrio;
    function alertaDeCarregamento() {
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
                const loader = Swal.getPopup().querySelector('.swal2-loader');
                if (loader) {
                    loader.style.color = '#045C99';
                    loader.style.borderRightColor = 'transparent';
                }
            }
        });
    }
    GestQs.alertaDeCarregamento = alertaDeCarregamento;
    function salvarQuestionario() {
        var dadosFormFiltro = $('form[name="formQuestionario"]').serialize();
        console.log(dadosFormFiltro);
        GestQs.alertaDeCarregamento();
        $('button[name="btnSalvar"]').attr('disabled', 'disabled');
        var jqxhr = $.post("/Gestao/SalvarQuestionario", dadosFormFiltro, function (data) {
            if (data.sucesso) {
                if (data.lista != null && data.lista.length > 0) {
                    console.table(GestQs.listaEventos);
                }
                else {
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
            }
            else {
                console.log("dados não encontrado");
            }
        })
            .fail(function (_XMLHttpRequest_, textStatus, errorThrown) {
            console.log("error");
            console.log(_XMLHttpRequest_);
            console.log(textStatus);
            console.log(errorThrown);
        })
            .always(function (data) {
            $('#botoes').css('display', 'block');
        });
    }
    GestQs.salvarQuestionario = salvarQuestionario;
    function novoQuestionario(eventosDtos) {
        let eve_num_evento = Number($('input[name="eve_num_evento"]').val() || 0);
        let que_num_questionario = Number($('input[name="que_num_questionario"]').val() || 0);
        let url = '';
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
    GestQs.novoQuestionario = novoQuestionario;
    function editarQuestionrio(questionario) {
        let url = '';
        $('input[name="que_num_questionario"]').val(questionario.que_num_questionario);
        $('textarea[name="que_contexto"]').val(questionario.que_contexto);
        $('input[name="que_publico_alvo"]').val(questionario.que_publico_alvo);
        $('input[name="que_nota_minima"]').val(questionario.que_nota_minima);
        $('input[name="que_dt_inclusao"]').val(((questionario.que_dt_inclusao && questionario.que_dt_inclusao.length >= 10) ? questionario.que_dt_inclusao.substr(8, 2) + '/' + questionario.que_dt_inclusao.substr(5, 2) + '/' + questionario.que_dt_inclusao.substr(0, 4) : ''));
        $('select[name="que_situacao"]').val(questionario.que_situacao);
    }
    GestQs.editarQuestionrio = editarQuestionrio;
    $(function () {
        GestQs._ano = '2026';
        GestQs._mes = '6';
        setTimeout(() => {
            console.log("This prints after 2 seconds!");
            carregarEventos();
        }, 200);
        console.log('fetchDataAndInitializeTable()');
        $.when(GestQs.carregarIndices()).then(function (data, textStatus, jqXHR) {
        });
        $('#div-lista-evento-question tbody').on('click', 'button.btn-editar-lista-questionarios', function () {
            const eve_num_evento = Number($(this).data('eve') || 0);
            $('input[name="eve_num_evento"]').val(eve_num_evento);
            $('input[name="que_num_questionario"]').val(0);
            GestQs.editarEventoQuestionrio(eve_num_evento);
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
            var cleanValue = $(this).val();
            $('input[name="busca"]').val(cleanValue);
            console.log("Cleaned:", cleanValue);
        });
        $('button[name="btnBuscar"]').on('click', function (e) {
            $.when(GestQs.buscarUsuarioaNoRelatorio()).then(function (data, textStatus, jqXHR) {
                $.when(GestQs.initializeDataTable(GestQs.listaBusca, GestQs._ano, GestQs._mes, 100)).then(function (data, textStatus, jqXHR) {
                    $('input[name="buscaLimpa"]').val('');
                    console.log('Pontuação carregada com filtro');
                });
            });
        });
    });
})(GestQs || (GestQs = {}));
//# sourceMappingURL=gestao-questionarios.js.map