"use strict";
var GestQ;
(function (GestQ) {
    GestQ.tempo = Date.now();
    GestQ.msgValido = '';
    GestQ.dataTableInstance = null;
    GestQ._ano = '0';
    GestQ._mes = '0';
    GestQ.eve_num_evento = 0;
    GestQ.que_num_questionario = 0;
    GestQ.questoesDtos = [];
    GestQ.respostasDtos = [];
    GestQ.listaEventos = [];
    GestQ.dadosDaTabela = [];
    GestQ.listaUsuariosPontos = [];
    function syncDataTableToArray() {
        if (!GestQ.dataTableInstanceRespostas)
            return;
        GestQ.respostasDtos = [];
        $('#table-lista-respostas tbody tr').each(function (index) {
            const $row = $(this);
            const accesskey = $row.find('[accesskey]').first().attr('accesskey');
            if (!accesskey)
                return;
            const qst_num_questao = parseInt($row.find('input.qst_num_questao').val()) || 0;
            const qsr_num_resposta = parseInt($row.find('input.qsr_num_resposta').val()) || 0;
            const qsr_enunciado = $row.find('input.qsr_enunciado').val() || '';
            const qsr_e_correta = $row.find('select.qsr_e_correta').val() || 'N';
            const qsr_situacao = $row.find('select.qsr_situacao').val() || 'A';
            let tempo = parseInt(accesskey);
            if (isNaN(tempo)) {
                tempo = Date.now();
            }
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
    GestQ.syncDataTableToArray = syncDataTableToArray;
    function addRegistroNoArray(rowData) {
        return new Promise((resolve, reject) => {
            try {
                GestQ.syncDataTableToArray();
                let tempo = Date.now();
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
            }
            catch (error) {
                reject(error);
            }
        });
    }
    GestQ.addRegistroNoArray = addRegistroNoArray;
    function initializeDataTable(data, mes, ano, pageLength) {
        if (!Array.isArray(data)) {
            console.error('Os dados recebidos não são válidos:', data);
            data = [];
        }
        console.table(data);
        if (GestQ.dataTableInstance) {
            GestQ.dataTableInstance.destroy();
        }
        $('#table-lista-itens tbody').empty();
        GestQ.dataTableInstance = $('#table-lista-itens').DataTable({
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
                var table = GestQ.dataTableInstance;
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
                            }
                            else {
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
                            .attr('accesskey', rowData.usr_num_usuario || GestQ.tempo);
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
                            }
                            else {
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
                            }
                            else {
                                let pontuacao = Number(data.toFixed(2));
                                let nota = pontuacao === null || pontuacao === void 0 ? void 0 : pontuacao.toString().replace('.', ',');
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
    GestQ.initializeDataTable = initializeDataTable;
    function carregarIndices() { }
    GestQ.carregarIndices = carregarIndices;
    function gerarHTML(lista) {
        GestQ.listaUsuariosPontos = [];
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
                        GestQ.dadosDaTabela = processDataForTable(json.lista);
                        console.table(GestQ.dadosDaTabela);
                        let listaUsuariosPontos = gerarHTML(json.lista);
                        console.table(listaUsuariosPontos);
                        $.when(initializeDataTable(listaUsuariosPontos, GestQ._ano, GestQ._mes, 100)).then(function (data, textStatus, jqXHR) {
                            console.log('Pontuação carregada');
                        });
                    }
                    else {
                        initializeDataTable([], GestQ._ano, GestQ._mes, 1);
                    }
                }
                else {
                    initializeDataTable([], GestQ._ano, GestQ._mes, 1);
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
    GestQ.fetchDataAndInitializeTable = fetchDataAndInitializeTable;
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
    GestQ.eventoDescricao = eventoDescricao;
    function eventoQuestionarioPontosPorUsuario(eve_num_evento, que_num_questionario) {
        $('input[name="eve_num_evento"]').val(eve_num_evento);
        $('input[name="que_num_questionario"]').val(que_num_questionario);
        GestQ.fetchDataAndInitializeTable();
    }
    GestQ.eventoQuestionarioPontosPorUsuario = eventoQuestionarioPontosPorUsuario;
    function gerarEventosQuestionarioHTML(lista) {
        var _a, _b, _c, _d;
        GestQ.listaEventos = [];
        let tabela = '<table class="table table-striped">';
        GestQ.eve_num_evento = Number((_b = (_a = $('input[name="eve_num_evento"]').val()) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : '0');
        GestQ.que_num_questionario = Number((_d = (_c = $('input[name="que_num_questionario"]').val()) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : '0');
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
            let cab_eve_descricao = q.eve_descricao.toString();
            let descri = ((cab_eve_descricao.length >= 100) ? cab_eve_descricao.substring(0, 100) + '<span class="text-danger" style="cursor:pointer;"> ... Saiba mais ... </span>' : cab_eve_descricao);
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
    GestQ.gerarEventosQuestionarioHTML = gerarEventosQuestionarioHTML;
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
    GestQ.carregarEventos = carregarEventos;
    GestQ.listaQuestoes = [];
    function processaDadosParaTable(data) {
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
    GestQ.processaDadosParaTable = processaDadosParaTable;
    function processDadosQuestoesForTable(data) {
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
    GestQ.processDadosQuestoesForTable = processDadosQuestoesForTable;
    function processDadosRespostasForTable(data) {
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
    GestQ.processDadosRespostasForTable = processDadosRespostasForTable;
    GestQ.dataTableInstanceEveQuestion = null;
    function initializeDataTableQuestoes(data, mes, ano, pageLength) {
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
                    $('#table-lista-questoes_wrapper').remove();
                }
                catch (e) { }
                GestQ.dataTableInstanceEveQuestion = null;
            }
        }
        catch (e) {
            console.warn('Erro ao verificar/destruir DataTable anterior:', e);
        }
        $('#table-lista-questoes tbody').empty();
        GestQ.dataTableInstanceEveQuestion = $('#table-lista-questoes').DataTable({
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
                },
                {
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
                },
                {
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
                },
                {
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
                { targets: [0, 1, 2, 3], visible: true }, { targets: [4], visible: false }
            ],
            order: [[0, 'asc']],
            autoFill: true
        }).draw();
    }
    GestQ.initializeDataTableQuestoes = initializeDataTableQuestoes;
    GestQ.dataTableInstanceRespostas = null;
    function initializeDataTableRespostas(data, mes, ano, pageLength) {
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
                GestQ.dataTableInstanceRespostas = null;
            }
        }
        catch (e) {
            console.warn('Erro ao verificar/destruir DataTable anterior:', e);
        }
        $('#table-lista-respostas tbody').empty();
        GestQ.dataTableInstanceRespostas = $('#table-lista-respostas').DataTable({
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
                },
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
                },
                {
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
                },
                {
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
                },
                {
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
                },
                {
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
                                    ((row.qsr_num_resposta != null && row.qsr_num_resposta > 0)
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
                                        </button> `)
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
    }
    GestQ.initializeDataTableRespostas = initializeDataTableRespostas;
    function carregarQuestoes() {
        var jqxhr = $.post("/Gestao/ObterQuestoes", {}, function (data) {
            console.log("success");
            console.log(data);
            if (data.sucesso) {
                if (data.lista != null && data.lista.length > 0) {
                    let listaQuestoes = processaDadosParaTable(data.lista);
                    console.table(listaQuestoes);
                    GestQ.initializeDataTableQuestoes(listaQuestoes, GestQ._mes, GestQ._ano, 100);
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
    GestQ.carregarQuestoes = carregarQuestoes;
    function carregarCamposDeQuestao(questoesDtos) {
        console.log('questoesDtos');
        console.log(questoesDtos);
        $('input[name="qst_num_questao"]').val(questoesDtos.qst_num_questao);
        $('textarea[name="qst_enunciado"]').val(questoesDtos.qst_enunciado);
        $('select[name="qst_situacao"]').val(questoesDtos.qst_situacao);
    }
    GestQ.carregarCamposDeQuestao = carregarCamposDeQuestao;
    function editarQuestao(qst_num_questao) {
        var jqxhr = $.post("/Gestao/ObterQuestao", { qst_num_questao: qst_num_questao }, function (data) {
            if (data.sucesso) {
                GestQ.questoesDtos = [];
                let questoesDtos = processDadosQuestoesForTable(data.lista);
                GestQ.carregarCamposDeQuestao(questoesDtos[0]);
            }
            else {
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
        var jqxhr = $.post("/Gestao/ObterRespostasPorQuestao", { qst_num_questao: qst_num_questao }, function (data) {
            if (data.sucesso) {
                GestQ.respostasDtos = [];
                let respostasDtos = processDadosRespostasForTable(data.lista);
                GestQ.initializeDataTableRespostas(respostasDtos, GestQ._mes, GestQ._ano, 100);
                console.table(respostasDtos);
            }
            else {
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
        if ($('#content-table-questoes').css('display') === 'block') {
            $('#content-table-questoes').css('display', 'none');
            $('#content-cad-questao').css('display', 'block');
        }
        else {
            $('#content-table-questoes').css('display', 'block');
            $('#content-cad-questao').css('display', 'none');
        }
    }
    GestQ.editarQuestao = editarQuestao;
    function editarResposta(qst_num_questao, qsr_num_resposta) {
        var jqxhr = $.post("/Gestao/ObterRespostaPorId", { qst_num_questao: qst_num_questao, qsr_num_resposta: qsr_num_resposta }, function (data) {
            if (data.sucesso) {
                GestQ.respostasDtos = [];
                let respostasDtos = processDadosRespostasForTable(data.lista);
                console.table(respostasDtos);
            }
            else {
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
    }
    GestQ.editarResposta = editarResposta;
    GestQ.listaBusca = GestQ.listaUsuariosPontos;
    function buscarUsuarioaNoRelatorio() {
        const normalizeStr = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        let busca = normalizeStr($('input[name="buscaLimpa"]').val() || '');
        $('input[name="busca"]').val($('input[name="buscaLimpa"]').val() || '');
        let lista = GestQ.listaUsuariosPontos || [];
        GestQ.listaBusca = lista;
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
                    matchingQueKeys.add(`${p.eve_num_evento}_${p.que_num_questionario} `);
                }
            });
            GestQ.listaBusca = lista.filter(item => {
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
            console.table(GestQ.listaBusca);
        }
    }
    GestQ.buscarUsuarioaNoRelatorio = buscarUsuarioaNoRelatorio;
    function formValido() {
        let ret = true;
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
        }
        else {
            respostaRows.each(function (index, row) {
                const $row = $(row);
                const accesskey = $row.attr('accesskey') || $row.find('[accesskey]').first().attr('accesskey') || '';
                const qsr_enunciado = String($row.find('input.qsr_enunciado').val() || '').trim();
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
    GestQ.formValido = formValido;
    function SalvarQuestao() {
        var dadosForm = $('form[name="formCadQuestao"]').serializeArray();
        var jqxhr = $.post('/Gestao/SalvarQuestao', dadosForm, function (data) {
            if (data.sucesso) {
                console.log('Questão e respostas salvas');
                console.table(data.lista);
                if (data.lista != null && data.lista.length > 0) {
                    window.location.reload();
                }
                else {
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
            console.log("error", '/Gerencia/SalvarQuestao');
            ScriptsConfig.failFunctionAjaxConsole(_XMLHttpRequest_, textStatus, errorThrown);
        })
            .always(function (data) {
            console.log("finished");
            console.log(data);
            $('#botoes').css('display', 'block');
        });
    }
    GestQ.SalvarQuestao = SalvarQuestao;
    $(function () {
        GestQ._ano = '2026';
        GestQ._mes = '6';
        setTimeout(() => {
            console.log("This prints after 2 seconds!");
            GestQ.carregarQuestoes();
        }, 200);
        console.log('fetchDataAndInitializeTable()');
        $.when(GestQ.carregarIndices()).then(function (data, textStatus, jqXHR) {
        });
        $('input[name="buscaLimpa"]').on('input', function () {
            var cleanValue = $(this).val();
            $('input[name="busca"]').val(cleanValue);
            console.log("Cleaned:", cleanValue);
        });
        $('button[name="btnBuscar"]').on('click', function (e) {
            $.when(GestQ.buscarUsuarioaNoRelatorio()).then(function (data, textStatus, jqXHR) {
                $.when(GestQ.initializeDataTable(GestQ.listaBusca, GestQ._ano, GestQ._mes, 100)).then(function (data, textStatus, jqXHR) {
                    $('input[name="buscaLimpa"]').val('');
                    console.log('Pontuação carregada com filtro');
                });
            });
        });
        $('#content-table-questoes tbody').on('click', 'button.btn-editar-questao', function () {
            const qst_num_questao = Number($(this).data('qst') || 0);
            GestQ.editarQuestao(qst_num_questao);
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
                    }
                    else {
                        Swal.fire({
                            icon: "warning",
                            title: '<span style="color:#045C99;font-size:22px;">Atenção!</span>',
                            html: '<label style="color:#045C99;font-size:20px;text-align:left;">' + GestQ.msgValido + '<label>',
                            footer: ScriptsConfig.footerAlert
                        });
                    }
                }
                else {
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
            let tempo = Date.now();
            let qst_num_questao = $('form[name="formCadQuestao"] input[name="qst_num_questao"]').val();
            GestQ.addRegistroNoArray({
                tempo: tempo,
                qst_num_questao: qst_num_questao || 0,
                qsr_num_resposta: 0,
                qsr_enunciado: '',
                qsr_e_correta: 'N',
                qsr_situacao: 'A'
            }).then(function (newData) {
                GestQ.initializeDataTableRespostas(GestQ.respostasDtos, GestQ._mes, GestQ._ano, 100);
            }).catch(function (error) {
                console.error('Erro ao adicionar registro:', error);
            });
        });
        $('#content-cad-questao-resposta').on('click', 'button.btn-remover-resposta', function () {
            const accesskey = $(this).attr('accesskey') || '0';
            const tempoKey = parseInt(accesskey, 10);
            if (typeof GestQ.syncDataTableToArray === 'function') {
                try {
                    GestQ.syncDataTableToArray();
                }
                catch (e) { }
            }
            if (!isNaN(tempoKey)) {
                GestQ.respostasDtos = GestQ.respostasDtos.filter(item => {
                    return Number(item.tempo) !== tempoKey;
                });
            }
            GestQ.initializeDataTableRespostas(GestQ.respostasDtos, GestQ._mes, GestQ._ano, 100);
        });
    });
})(GestQ || (GestQ = {}));
//# sourceMappingURL=gestao-questoes.js.map