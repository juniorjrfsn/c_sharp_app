"use strict";
var GeIndex;
(function (GeIndex) {
    GeIndex.tempo = Date.now();
    GeIndex.dataTableInstance = null;
    GeIndex._ano = '0';
    GeIndex._mes = '0';
    GeIndex.eve_num_evento = 0;
    GeIndex.que_num_questionario = 0;
    GeIndex.listaEventos = [];
    GeIndex.dadosDaTabela = [];
    GeIndex.listaUsuariosPontos = [];
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
        GeIndex.dadosDaTabela.push(rd);
    }
    function initializeDataTable(data, mes, ano, pageLength) {
        if (!Array.isArray(data)) {
            console.error('Os dados recebidos não são válidos:', data);
            data = [];
        }
        console.table(data);
        if (GeIndex.dataTableInstance) {
            GeIndex.dataTableInstance.destroy();
        }
        $('#table-lista-itens tbody').empty();
        GeIndex.dataTableInstance = $('#table-lista-itens').DataTable({
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
                var table = GeIndex.dataTableInstance;
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
                            .attr('accesskey', rowData.usr_num_usuario || GeIndex.tempo);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            var colorCancel = '';
                            let usr_cpf = data;
                            if (row.usr_num_usuario == 0 && row.que_num_questionario == 0) {
                                return `
                                    <td data-usr_num_usuario="${row.usr_num_usuario || GeIndex.tempo}" data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}"
                                         accesskey="${row.usr_num_usuario || GeIndex.tempo}" style="text-align:center; background-color:  #337ab7 ;">
                                         <div class="form-control text-white" style="text-align:center; background-color: #337ab7;" >Evento<div>     
                                    </td>

                            `;
                            }
                            else if (row.usr_num_usuario == 0 && row.que_num_questionario > 0) {
                                return `
                                    <td data-usr_num_usuario="${row.usr_num_usuario || GeIndex.tempo}" data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}"
                                         accesskey="${row.usr_num_usuario || GeIndex.tempo}" style="text-align:center; background-color:  #337ab7;">
                                         <div class="form-control text-white"  style="text-align:center; background-color:  #337ab7;" >Questionário<div>     
                                    </td>

                            `;
                            }
                            else {
                                return `
                                    <td data-usr_num_usuario="${row.usr_num_usuario || GeIndex.tempo}" data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}"
                                         accesskey="${row.usr_num_usuario || GeIndex.tempo}">

                                        <input type="hidden" class="form-control usr_num_usuario"
                                            name="inpu[${row.usr_num_usuario || GeIndex.tempo}][usr_num_usuario]"
                                            id="inpu[${row.usr_num_usuario || GeIndex.tempo}][usr_num_usuario]"
                                            value="${row.usr_num_usuario || GeIndex.tempo}"
                                            accesskey="${row.usr_num_usuario || GeIndex.tempo}"  />

                                        <input type="hidden" class="form-control eve_num_evento"
                                            name="inpu[${row.usr_num_usuario || GeIndex.tempo}][eve_num_evento]"
                                            id="inpu[${row.usr_num_usuario || GeIndex.tempo}][eve_num_evento]"
                                            value="${row.eve_num_evento || 0}"
                                            accesskey="${row.usr_num_usuario || GeIndex.tempo}"  />

                                        <input type="hidden" class="form-control que_num_questionario"
                                            name="inpu[${row.usr_num_usuario || GeIndex.tempo}][que_num_questionario]"
                                            id="inpu[${row.usr_num_usuario || GeIndex.tempo}][que_num_questionario]"
                                            value="${row.que_num_questionario || '0'}"
                                            accesskey="${row.usr_num_usuario || GeIndex.tempo}"  />

                                        <input type="text" class="form-control usr_cpf"
                                            name="inpu[${row.usr_num_usuario || GeIndex.tempo}][usr_cpf]"
                                            id="inpu[${row.usr_num_usuario || GeIndex.tempo}][usr_cpf]"
                                            data-usr_num_usuario="${row.usr_num_usuario || GeIndex.tempo}" 
                                            data-eve_num_evento="${row.eve_num_evento || 0}" 
                                            data-que_num_questionario="${row.que_num_questionario || 0}"
                                            value="${usr_cpf || ''}"
                                            onblur="javascript:GeIndex.validarCampos(${row.usr_num_usuario || GeIndex.tempo}, 'usr_cpf');"
                                            onclick="javascript:inputMascara();"
                                            maxlength="11"
                                            accesskey="${row.usr_num_usuario || GeIndex.tempo}" style="max-width:130px; ${colorCancel || ''}"  readonly="readonly" />
                                             
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
                            .attr('accesskey', rowData.usr_num_usuario || GeIndex.tempo);
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
                                    <td data-usr_num_usuario="${row.usr_num_usuario || GeIndex.tempo}" data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}"
                                         accesskey="${row.usr_num_usuario || GeIndex.tempo}" style="text-align:center; background-color:  #337ab7 ;">
                                         <div class="form-control text-white" style="text-align:center; background-color: #337ab7;" >${row.eve_nome || ''}<div>     
                                    </td>

                            `;
                            }
                            else if ((usr_nome == '' || usr_nome == null) && row.que_num_questionario > 0) {
                                return `
                                    <td data-usr_num_usuario="${row.usr_num_usuario || GeIndex.tempo}" data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}"
                                         accesskey="${row.usr_num_usuario || GeIndex.tempo}" style="text-align:center; background-color:  #337ab7;">
                                         <div class="form-control text-white"  style="text-align:center; background-color:  #337ab7;" >${row.que_contexto || ''}<div>     
                                    </td>

                            `;
                            }
                            else {
                                return `
                                  <td
                                    data-usr_num_usuario="${row.usr_num_usuario || GeIndex.tempo}" style="100%;padding-bottom:0px;vertical-align:bottom;"
                                    data-eve_num_evento="${row.eve_num_evento || 0}" 
                                    data-que_num_questionario="${row.que_num_questionario || 0}"
                                         accesskey="${row.usr_num_usuario || GeIndex.tempo}" >
                                         <div class="form-group" style="100%;padding-bottom:0px;margin-bottom: 2px;">
                                            <input type="hidden" class="form-control usr_nome"
                                                name="inpu[${row.usr_num_usuario || GeIndex.tempo}][usr_nome_hidden]"
                                                id="inpu[${row.usr_num_usuario || GeIndex.tempo}][usr_nome_hidden]"
                                                value="${row.usr_nome || ''}"
                                                accesskey="${row.usr_num_usuario || GeIndex.tempo}"  />
                                         
                                            <span  class="form-control usr_cpf" 
                                                    name="inpu[${row.usr_num_usuario || GeIndex.tempo}][usr_cpf]"
                                                    id="inpu[${row.usr_num_usuario || GeIndex.tempo}][usr_cpf]"
                                                    data-usr_num_usuario="${row.usr_num_usuario || GeIndex.tempo}" 
                                                    data-eve_num_evento="${row.eve_num_evento || 0}" 
                                                    data-que_num_questionario="${row.que_num_questionario || 0}"
                                                    value="${row.usr_cpf || ''}"
                                                    onblur="javascript:GeIndex.validarCampos(${row.usr_num_usuario || GeIndex.tempo}, 'usr_cpf');"
                                                    onclick="javascript:inputMascara();"
                                                    maxlength="11"
                                                    accesskey="${row.usr_num_usuario || GeIndex.tempo}" style="max-width:150px; float:left; ${colorCancel || ''}"  readonly="readonly" />${usr_cpf || ''}
                                            </span>
                                            <span  class="form-control" accesskey="${row.usr_num_usuario || GeIndex.tempo}" 
                                                name="inpu[${row.usr_num_usuario || GeIndex.tempo}][usr_nome]" id="inpu[${row.usr_num_usuario || GeIndex.tempo}][usr_nome]"
                                                onblur="javascript:GeIndex.validarCampos(${row.usr_num_usuario || GeIndex.tempo},'usr_nome');"  readonly="readonly"
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
                            .attr('accesskey', rowData.usr_num_usuario || GeIndex.tempo);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            let eve_nome = data;
                            return `
                                  <td data-usr_num_usuario="${row.usr_num_usuario || GeIndex.tempo}" data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}"
                                         accesskey="${row.usr_num_usuario || GeIndex.tempo}">

                                    <input type="text" class="form-control" accesskey="${row.usr_num_usuario || GeIndex.tempo}"  
                                        name="inpu[${row.usr_num_usuario || GeIndex.tempo}][eve_nome]" id="inpu[${row.usr_num_usuario || GeIndex.tempo}][eve_nome]"
                                        onblur="javascript:GeIndex.validarCampos(${row.usr_num_usuario || GeIndex.tempo},'eve_nome');"
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
                            .attr('accesskey', rowData.usr_num_usuario || GeIndex.tempo);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            var colorCancel = ((row.pim_situacao === 'A') ? '' : 'color:red;');
                            let valor = Number(data);
                            if ((row.usr_cpf == '' || row.usr_cpf == null) && row.que_num_questionario == 0) {
                                return `
                                    <td data-usr_num_usuario="${row.usr_num_usuario || GeIndex.tempo}" data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}"
                                         accesskey="${row.usr_num_usuario || GeIndex.tempo}" style="text-align:center; background-color:  #337ab7 ;">
                                         <div><div>     
                                    </td>

                            `;
                            }
                            else if ((row.usr_cpf == '' || row.usr_cpf == null) && row.que_num_questionario > 0) {
                                return `
                                    <td data-usr_num_usuario="${row.usr_num_usuario || GeIndex.tempo}" data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}"
                                         accesskey="${row.usr_num_usuario || GeIndex.tempo}" style="text-align:center; background-color: #337ab7;padding-bottom:0px;">
                                         <span class="form-control text-white" style="text-align:center; background-color: #337ab7;" >Nota<span>
                                    </td>

                            `;
                            }
                            else {
                                let pontuacao = Number(data.toFixed(2));
                                let nota = pontuacao === null || pontuacao === void 0 ? void 0 : pontuacao.toString().replace('.', ',');
                                return `
                                    <td data-usr_num_usuario="${row.usr_num_usuario || GeIndex.tempo}" data-eve_num_evento="${row.eve_num_evento || 0}" data-que_num_questionario="${row.que_num_questionario || 0}"
                                             accesskey="${row.usr_num_usuario || GeIndex.tempo}" style="text-align: center;">

                                        <div class="form-group" style="100%;padding-bottom:0px;margin-bottom: 2px;">
                                            <span class="form-control" accesskey="${row.usr_num_usuario || GeIndex.tempo}"  name="inpu[${row.usr_num_usuario || GeIndex.tempo}][pontuacao]" id="inpu[${row.usr_num_usuario || GeIndex.tempo}][pontuacao]"
                                            onblur="javascript:GeIndex.validarCampos(${row.usr_num_usuario || GeIndex.tempo},'pontuacao');"
                                   
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
                            .attr('accesskey', rowData.usr_num_usuario || GeIndex.tempo);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            var colorCancel = '';
                            return `<td style="max-width: 40px;">`
                                + `<button type="button" class="delete-row" style="border:none;background:none;color:red;width:50px;" accesskey="${row.usr_num_usuario || GeIndex.tempo}" title="Excluir"><i class="fas fa-trash-alt"></i></button>` +
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
    GeIndex.initializeDataTable = initializeDataTable;
    function carregarIndices() { }
    GeIndex.carregarIndices = carregarIndices;
    function gerarHTML(lista) {
        GeIndex.listaUsuariosPontos = [];
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
            GeIndex.listaUsuariosPontos.push({
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
                GeIndex.listaUsuariosPontos.push({
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
                    GeIndex.listaUsuariosPontos.push({
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
        return GeIndex.listaUsuariosPontos;
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
                        GeIndex.dadosDaTabela = processDataForTable(json.lista);
                        console.table(GeIndex.dadosDaTabela);
                        let listaUsuariosPontos = gerarHTML(json.lista);
                        console.table(listaUsuariosPontos);
                        $.when(initializeDataTable(listaUsuariosPontos, GeIndex._ano, GeIndex._mes, 100)).then(function (data, textStatus, jqXHR) {
                            console.log('Pontuação carregada');
                        });
                    }
                    else {
                        initializeDataTable([], GeIndex._ano, GeIndex._mes, 1);
                    }
                }
                else {
                    initializeDataTable([], GeIndex._ano, GeIndex._mes, 1);
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
    GeIndex.fetchDataAndInitializeTable = fetchDataAndInitializeTable;
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
    GeIndex.eventoDescricao = eventoDescricao;
    function eventoQuestionarioPontosPorUsuario(eve_num_evento, que_num_questionario) {
        $('input[name="eve_num_evento"]').val(eve_num_evento);
        $('input[name="que_num_questionario"]').val(que_num_questionario);
        GeIndex.fetchDataAndInitializeTable();
    }
    GeIndex.eventoQuestionarioPontosPorUsuario = eventoQuestionarioPontosPorUsuario;
    function gerarEventosQuestionarioHTML(lista) {
        var _a, _b, _c, _d;
        GeIndex.listaEventos = [];
        let tabela = '<table class="table table-striped">';
        GeIndex.eve_num_evento = Number((_b = (_a = $('input[name="eve_num_evento"]').val()) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : '0');
        GeIndex.que_num_questionario = Number((_d = (_c = $('input[name="que_num_questionario"]').val()) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : '0');
        lista.forEach(q => {
            GeIndex.listaEventos.push({
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
            let cab_eve_descricao = q.eve_descricao.toString();
            let descri = ((cab_eve_descricao.length >= 100) ? cab_eve_descricao.substring(0, 100) + '<span class="text-danger" style="cursor:pointer;"> ... Saiba mais ... </span>' : cab_eve_descricao);
            tabela += `
                <tr>
                    <td class="list-group-item" accesskey="${q.eve_num_evento || 0}_${q.que_num_questionario || 0}" 
                       onclick="javascript:GeIndex.eventoQuestionarioPontosPorUsuario(${q.eve_num_evento || 0},${q.que_num_questionario || 0})"  style="text-align:center;cursor:pointer;" >
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
                                 onclick="javascript:GeIndex.eventoDescricao(${q.eve_num_evento || 0},${q.que_num_questionario || 0})" style="color:#033E66;">${descri || ''}</h5>
                                <h5 class="mb-4 que_contexto" id="eve[${q.eve_num_evento || 0}][${q.que_num_questionario || 0}][que_contexto]" style="color:#033E66;">Questionário: ${q.que_contexto || ''}</h5>
                    </td>
                </tr>`;
            GeIndex.eve_num_evento = (q.eve_num_evento !== null && q.eve_num_evento > 0) ? q.eve_num_evento : GeIndex.eve_num_evento;
            GeIndex.que_num_questionario = (q.que_num_questionario !== null && q.que_num_questionario > 0) ? q.que_num_questionario : GeIndex.que_num_questionario;
            $('input[name="eve_num_evento"]').val(GeIndex.eve_num_evento);
            $('input[name="que_num_questionario"]').val(GeIndex.que_num_questionario);
        });
        tabela += '</table>';
        $('#eventos-questionario').html(tabela);
        return GeIndex.listaEventos;
    }
    GeIndex.gerarEventosQuestionarioHTML = gerarEventosQuestionarioHTML;
    function carregarEventos() {
        var jqxhr = $.post("/Relpontuacao/ObterEventos", {}, function (data) {
            console.log("success");
            console.log(data);
            if (data.sucesso) {
                if (data.lista != null && data.lista.length > 0) {
                    var lista = data.lista;
                    console.table(lista);
                    gerarEventosQuestionarioHTML(lista);
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
            console.log(data);
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
    GeIndex.carregarEventos = carregarEventos;
    GeIndex.listaBusca = GeIndex.listaUsuariosPontos;
    function buscarUsuarioaNoRelatorio() {
        const normalizeStr = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        let busca = normalizeStr($('input[name="buscaLimpa"]').val() || '');
        $('input[name="busca"]').val($('input[name="buscaLimpa"]').val() || '');
        let lista = GeIndex.listaUsuariosPontos || [];
        GeIndex.listaBusca = lista;
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
            GeIndex.listaBusca = lista.filter(item => {
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
            console.table(GeIndex.listaBusca);
        }
    }
    GeIndex.buscarUsuarioaNoRelatorio = buscarUsuarioaNoRelatorio;
    $(function () {
        GeIndex._ano = '2026';
        GeIndex._mes = '6';
        setTimeout(() => {
            console.log("This prints after 2 seconds!");
            carregarEventos();
        }, 200);
        console.log('fetchDataAndInitializeTable()');
        $.when(GeIndex.carregarIndices()).then(function (data, textStatus, jqXHR) {
        });
        $('input[name="buscaLimpa"]').on('input', function () {
            var cleanValue = $(this).val();
            $('input[name="busca"]').val(cleanValue);
            console.log("Cleaned:", cleanValue);
        });
        $('button[name="btnBuscar"]').on('click', function (e) {
            $.when(GeIndex.buscarUsuarioaNoRelatorio()).then(function (data, textStatus, jqXHR) {
                $.when(GeIndex.initializeDataTable(GeIndex.listaBusca, GeIndex._ano, GeIndex._mes, 100)).then(function (data, textStatus, jqXHR) {
                    $('input[name="buscaLimpa"]').val('');
                    console.log('Pontuação carregada com filtro');
                });
            });
        });
    });
})(GeIndex || (GeIndex = {}));
//# sourceMappingURL=gerencia-index.js.map