"use strict";
var GeParam;
(function (GeParam) {
    GeParam.tempo = Date.now();
    GeParam.dataTableInstanceEventos = null;
    GeParam.dataTableInstanceParametros = null;
    GeParam._ano = '0';
    GeParam._mes = '0';
    GeParam.eve_num_evento = 0;
    GeParam.que_num_questionario = 0;
    GeParam.listaEventos = [];
    GeParam.listaParametros = [];
    GeParam.eventos = [];
    function addRegistroNoArray(rowData) {
        let tempo = Date.now();
        let rd = {
            tempo: ((rowData.tempo !== undefined && rowData.tempo !== null) ? rowData.tempo : parseInt(tempo.toString())),
            par_num_evento_vigente: ((rowData.par_num_evento_vigente !== undefined && rowData.par_num_evento_vigente !== null) ? rowData.par_num_evento_vigente : 0),
            par_descricao: ((rowData.par_descricao !== undefined && rowData.par_descricao !== null) ? rowData.par_descricao : ''),
            par_situacao: ((rowData.par_situacao !== undefined && rowData.par_situacao !== null) ? rowData.par_situacao : '')
        };
        GeParam.listaParametros.push(rd);
    }
    function carregarIndices() { }
    GeParam.carregarIndices = carregarIndices;
    function processaParametrosParaTable(data) {
        return data.map(item => {
            const mesAno = 0;
            return Object.assign(Object.assign({}, item), { mes_ano: mesAno, tempo: item.par_num_evento_vigente || Date.now() });
        });
    }
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
    GeParam.eventoDescricao = eventoDescricao;
    function initializeDataTableParametros(data, mes, ano, pageLength) {
        if (!Array.isArray(data)) {
            console.error('Os dados recebidos não são válidos:', data);
            data = [];
        }
        try {
            if ($.fn && $.fn.dataTable && $.fn.dataTable.isDataTable && $.fn.dataTable.isDataTable('#table-lista-parametros')) {
                try {
                    const existing = $('#table-lista-parametros').DataTable();
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
                    $('#table-lista-parametros_wrapper').remove();
                }
                catch (e) { }
                GeParam.dataTableInstanceParametros = null;
            }
        }
        catch (e) {
            console.warn('Erro ao verificar/destruir DataTable anterior:', e);
        }
        $('#table-lista-parametros tbody').empty();
        GeParam.dataTableInstanceParametros = $('#table-lista-parametros').DataTable({
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
                    sheetName: 'Parâmetros ' + mes + '-de-' + ano,
                    messageTop: 'Parâmetros: ' + mes + '/' + ano,
                    text: '<i class="far fa-file-excel text-success fa-lg"></i>',
                    title: null,
                    filename: function () {
                        return 'Parâmetros-mes-' + mes + '-de-' + ano;
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
                        return 'Parâmetros-mes-' + mes + '-de-' + ano;
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
                        columns: [0, 1, 2]
                    }
                }
            ],
            initComplete: function () {
                var table = GeParam.dataTableInstanceParametros;
                table.buttons([0, 1, 2]).remove();
            },
            lengthChange: true,
            searching: true,
            ordering: true,
            columns: [
                {
                    data: 'par_num_evento_vigente', className: 'editable par_num_evento_vigente',
                    createdCell: function (td, cellData, rowData, row, col) {
                        let accesskey = (rowData.par_num_evento_vigente || 0);
                        $(td)
                            .attr('id', `linh[${accesskey}][par_num_evento_vigente]`)
                            .attr('row', row)
                            .attr('col', col)
                            .attr('campo', 'par_num_evento_vigente')
                            .attr('data-par_num_evento_vigente', rowData.par_num_evento_vigente || '0')
                            .attr('accesskey', (accesskey));
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            var colorCancel = '';
                            let par_num_evento_vigente = data;
                            let accesskey = (row.par_num_evento_vigente || 0);
                            return `
                                    <td data-par_num_evento_vigente="${row.par_num_evento_vigente || 0}" accesskey="${accesskey}" style="  text-align: center; ">
                                        <div class="form-group" style="padding:0px 0px 0px 0px;margin: 0px 0px 0px 0px;   text-align: center;">
                                            <input type="text" class="form-control par_num_evento_vigente"
                                                name="inpu[${accesskey}][par_num_evento_vigente]"
                                                id="inpu[${accesskey}][par_num_evento_vigente]"
                                                data-par_num_evento_vigente="${row.par_num_evento_vigente || 0}"
                                                value="${par_num_evento_vigente || ''}"
                                                accesskey="${accesskey}" style="padding:1px 1px 1px 1px; text-align: center; ${colorCancel || ''}" readonly="readonly" />
                                         
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
                        let accesskey = (rowData.par_num_evento_vigente || 0);
                        $(td)
                            .attr('id', `linh[${accesskey}][editar]`)
                            .attr('row', row)
                            .attr('col', col)
                            .attr('campo', 'editar')
                            .attr('data-par_num_evento_vigente', rowData.par_num_evento_vigente || '0')
                            .attr('accesskey', accesskey);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            let accesskey = (row.par_num_evento_vigente || 0);
                            return `
                                <td data-par_num_evento_vigente="${row.par_num_evento_vigente || 0}" accesskey="${accesskey}"  style="width: 80px; text-align: center;">
                                    <div class="form-group" style="padding-bottom:0px;margin-bottom: 2px;text-align: center;">
                                        
                                        <button type="button" class="btn btn-light btn-editar-parametro" style=""
                                            data-param="${row.par_num_evento_vigente}" title="Editar Parâmetro">
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
                        let accesskey = (rowData.par_num_evento_vigente || 0);
                        $(td)
                            .attr('id', `linh[${accesskey}][cancelar]`)
                            .attr('row', row)
                            .attr('col', col)
                            .attr('campo', 'cancelar')
                            .attr('data-par_num_evento_vigente', rowData.par_num_evento_vigente || '0')
                            .attr('accesskey', accesskey);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            let accesskey = (row.par_num_evento_vigente || 0);
                            return `
                                <td data-par_num_evento_vigente="${row.par_num_evento_vigente || 0}" accesskey="${accesskey}" style="width: 80px; text-align: center;">
                                    <div class="form-group" style="padding-bottom:0px;margin-bottom: 2px;text-align: center;">
                                        <button type="button" class="btn btn-light btn-cancelar-parametro" style=""
                                            data-param="${row.par_num_evento_vigente}" title="Cancelar Parâmetro">
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
                { targets: [0], visible: true }, { targets: [1, 2], visible: false }
            ],
            order: [[0, 'asc']],
            autoFill: true
        }).draw();
    }
    GeParam.initializeDataTableParametros = initializeDataTableParametros;
    function carregarParametros() {
        var jqxhr = $.post('/Gerencia/ObterParametros', {}, function (data) {
            console.log(data);
            if (data.sucesso) {
                if (data.lista != null && data.lista.length > 0) {
                    let listaParametros = processaParametrosParaTable(data.lista);
                    console.table(listaParametros);
                    GeParam.initializeDataTableParametros(listaParametros, GeParam._mes, GeParam._ano, 100);
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
            console.log("error", '/Gerencia/ObterParametros');
            ScriptsConfig.failFunctionAjaxConsole(_XMLHttpRequest_, textStatus, errorThrown);
        })
            .always(function (data) {
            console.log("finished");
            console.log(data);
            $('#botoes').css('display', 'block');
        });
    }
    GeParam.carregarParametros = carregarParametros;
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
                GeParam.dataTableInstanceEventos = null;
            }
        }
        catch (e) {
            console.warn('Erro ao verificar/destruir DataTable anterior:', e);
        }
        $('#table-lista-eventos tbody').empty();
        GeParam.dataTableInstanceEventos = $('#table-lista-eventos').DataTable({
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
                                        <div class="form-group" style="padding:0px 0px 0px 0px;margin: 0px 0px 0px 0px; text-align: center;">
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
                                        <div class="form-group" style="padding:0px 0px 0px 0px;margin: 0px 0px 0px 0px; text-align: center;">
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
                    data: 'vigente', className: 'editable vigente',
                    createdCell: function (td, cellData, rowData, row, col) {
                        let accesskey = (rowData.eve_num_evento || Date.now());
                        $(td)
                            .attr('id', `linh[${accesskey}][vigente]`)
                            .attr('row', row)
                            .attr('col', col)
                            .attr('campo', 'vigente')
                            .attr('data-eve_num_evento', rowData.eve_num_evento || '0')
                            .attr('accesskey', accesskey);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            var colorText = (data == 'S') ? 'text-success' : 'text-danger';
                            let vigente = data;
                            let accesskey = (row.eve_num_evento || Date.now());
                            return `
                                    <td data-eve_num_evento="${row.eve_num_evento || 0}" accesskey="${accesskey}"
                                        style="width:80px; max-width:80px; text-align: center; "
                                    >
                                        <div class="form-group" style="padding:0px 0px 0px 0px;margin: 0px 0px 0px 0px; width:auto;text-align: center;">
                                            <input type="text" class="form-control vigente ${colorText}"
                                                name="inpu[${accesskey}][vigente]"
                                                id="inpu[${accesskey}][vigente]"
                                                data-eve_num_evento="${row.eve_num_evento || 0}" 
                                                value="${vigente || ''}"
                                                accesskey="${accesskey}" style="padding:1px 1px 1px 1px; text-align: center;"  readonly="readonly" />
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
                            .attr('id', `linh[${accesskey}][selec]`)
                            .attr('row', row)
                            .attr('col', col)
                            .attr('campo', 'selec')
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
                                        
                                        <button type="button" class="btn btn-light btn-definir-evento-vigente" style="padding:1px 10px 1px 10px; "
                                            data-eve="${row.eve_num_evento}"  title="Selecionar Evento">
                                            <span accesskey="${accesskey}" id="inpu[${accesskey}][selec]" style="" />
                                                <i class="fa-solid fa-hand-point-left text-info fa-lg"></i>
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
                { targets: [1, 5, 6, 8, 9], visible: true }, { targets: [0, 2, 3, 4, 7], visible: false }
            ],
            order: [[1, 'asc']],
            autoFill: true
        }).draw();
    }
    GeParam.initializeDataTableEventos = initializeDataTableEventos;
    function processDadosEventosForTable(data) {
        GeParam.eventos = [];
        data.forEach(q => {
            GeParam.eventos.push({
                tempo: (q.eve_num_evento || Date.now),
                eve_num_evento: Number(q.eve_num_evento) || 0,
                eve_nome: q.eve_nome || '',
                eve_descricao: q.eve_descricao || '',
                eve_local: q.eve_local || '',
                eve_municipio: q.eve_municipio || '',
                eve_dt_inicio: q.eve_dt_inicio || '',
                eve_dt_fim: q.eve_dt_fim || '',
                eve_dt_inclusao: q.eve_dt_inclusao || '',
                eve_situacao: q.eve_situacao || '',
                vigente: q.vigente || 'N'
            });
        });
        return GeParam.eventos;
    }
    GeParam.processDadosEventosForTable = processDadosEventosForTable;
    function carregarEventos() {
        var jqxhr = $.post("/Gerencia/ObterEventos", {}, function (data) {
            console.log("success");
            if (data.sucesso) {
                if (data.eventos != null && data.eventos.length > 0) {
                    let lstEventos = GeParam.processDadosEventosForTable(data.eventos);
                    GeParam.initializeDataTableEventos(lstEventos, GeParam._mes, GeParam._ano, 100);
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
            ScriptsConfig.failFunctionAjaxConsole(_XMLHttpRequest_, textStatus, errorThrown);
        })
            .always(function (data) {
            console.log("finished");
            console.log(data);
            $('#botoes').css('display', 'block');
        });
    }
    GeParam.carregarEventos = carregarEventos;
    function DefinirEventoVigente(eve_num_evento) {
        var jqxhr = $.post("/Gerencia/DefinirEventoVigente", { eve_num_evento: eve_num_evento }, function (data) {
            console.log("success");
            if (data.sucesso) {
                window.location.reload();
            }
            else {
                ScriptsConfig.swalconfirmeActionAlertaWarning.fire({
                    icon: 'warning',
                    title: '<code style="color:#045C99;font-size:22px;">Olá</code><br>',
                    imageUrl: "/Content/img/logo-ageprev-ms-origin.png",
                    imageWidth: 300,
                    width: 1080,
                    height: 700,
                    html: '<span style="color:#045C99;font-size:20px;">Não foi possível definir o evento vigente</b></span>',
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
            if (data !== null) {
                console.log("second success");
            }
            else {
                console.log("dados não encontrado");
            }
        })
            .fail(function (_XMLHttpRequest_, textStatus, errorThrown) {
            console.log("error");
            ScriptsConfig.failFunctionAjaxConsole(_XMLHttpRequest_, textStatus, errorThrown);
        })
            .always(function (data) {
            console.log("finished");
            console.log(data);
            $('#botoes').css('display', 'block');
        });
    }
    GeParam.DefinirEventoVigente = DefinirEventoVigente;
    $(function () {
        GeParam._ano = '2026';
        GeParam._mes = '6';
        setTimeout(() => {
            console.log("This prints after 2 seconds!");
            GeParam.carregarParametros();
            GeParam.carregarEventos();
        }, 200);
        $('button[name="btn-abrir-lista-eventos"]').on('click', function (e) {
            $('#div-table-lista-parametros').css('display', 'none');
            $('#div-table-lista-eventos').css('display', 'block');
        });
        $('button[name="btn-voltar-to-lista-parametros"]').on('click', function (e) {
            $('#div-table-lista-parametros').css('display', 'block');
            $('#div-table-lista-eventos').css('display', 'none');
        });
        $('#div-table-lista-eventos tbody').on('click', 'button.btn-definir-evento-vigente', function () {
            const eve_num_evento = Number($(this).data('eve') || 0);
            GeParam.DefinirEventoVigente(eve_num_evento);
        });
    });
})(GeParam || (GeParam = {}));
//# sourceMappingURL=gerencia-parametros.js.map