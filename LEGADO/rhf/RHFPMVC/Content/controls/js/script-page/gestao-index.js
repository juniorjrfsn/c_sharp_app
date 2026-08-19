"use strict";
var GestIndex;
(function (GestIndex) {
    GestIndex.tempo = Date.now();
    GestIndex.msgValido = '';
    let municipiosList = [];
    let carregandoMunicipios = false;
    let selectedIndex = -1;
    GestIndex.eventosDtos = [];
    GestIndex.questionariosDtos = [];
    GestIndex.dataTableInstanceEventos = null;
    GestIndex.dataTableInstance = null;
    GestIndex.dataTableInstanceEveQuestion = null;
    GestIndex._ano = '0';
    GestIndex._mes = '0';
    GestIndex.eve_num_evento = 0;
    GestIndex.que_num_questionario = 0;
    GestIndex.eventos = [];
    GestIndex.listaEventos = [];
    GestIndex.dadosDaTabela = [];
    GestIndex.listaUsuariosPontos = [];
    function normalizarTexto(txt) {
        if (!txt)
            return "";
        return txt.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();
    }
    GestIndex.normalizarTexto = normalizarTexto;
    function selecionarMunicipio(valor) {
        $('input[name="eve_municipio"]').val(valor);
        $('#lista-municipios').empty().hide();
        selectedIndex = -1;
    }
    function renderizarSugestoes(itens, termoOriginal) {
        const container = $('#lista-municipios');
        container.empty();
        selectedIndex = -1;
        if (itens.length === 0) {
            container.hide();
            return;
        }
        const ul = $('<ul class="list-group position-absolute w-100 shadow-sm" style="z-index: 1050; max-height: 250px; overflow-y: auto; margin-top: 2px; padding: 0;"></ul>');
        itens.forEach((item, index) => {
            var _a, _b, _c, _d, _e, _f;
            const uf = ((_c = (_b = (_a = item.microrregiao) === null || _a === void 0 ? void 0 : _a.mesorregiao) === null || _b === void 0 ? void 0 : _b.UF) === null || _c === void 0 ? void 0 : _c.sigla) || ((_f = (_e = (_d = item["regiao-imediata"]) === null || _d === void 0 ? void 0 : _d["regiao-intermediaria"]) === null || _e === void 0 ? void 0 : _e.UF) === null || _f === void 0 ? void 0 : _f.sigla) || "";
            const textoCompleto = `${item.nome} - ${uf}`.toUpperCase();
            const regex = new RegExp(`(${termoOriginal.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
            const textoComDestaque = textoCompleto.replace(regex, '<strong>$1</strong>');
            const li = $(`<li class="list-group-item list-group-item-action municipio-item" data-index="${index}" style="cursor: pointer; padding: 8px 12px;">${textoComDestaque}</li>`);
            li.on('click', function () {
                selecionarMunicipio(textoCompleto);
            });
            ul.append(li);
        });
        container.append(ul).show();
    }
    function validateMunicipio(usr_municipio) {
        if (usr_municipio === null || usr_municipio === undefined || usr_municipio === '') {
            return false;
        }
        if (municipiosList.length === 0) {
            try {
                var jqxhr = $.getJSON("/Content/js/municipios.json", function (data) {
                    municipiosList = data;
                    console.log('Municípios carregados de forma síncrona com sucesso. Total:', municipiosList.length);
                }).done(function (data) { }).fail(function (_XMLHttpRequest_, textStatus, errorThrown) {
                    ScriptsConfig.consoleError(_XMLHttpRequest_, textStatus, errorThrown);
                    console.error("Erro ao buscar dados dos municípios de forma síncrona:", textStatus, errorThrown);
                }).always(function () { });
            }
            catch (erro) {
                console.error("Erro ao buscar dados dos municípios de forma síncrona:", erro);
            }
        }
        if (municipiosList.length === 0) {
            return true;
        }
        const inputNormalizado = normalizarTexto(usr_municipio);
        let inputNome = inputNormalizado;
        let inputUf = '';
        if (usr_municipio.indexOf(' - ') !== -1) {
            const partes = usr_municipio.split(' - ');
            inputNome = normalizarTexto(partes[0]);
            inputUf = normalizarTexto(partes[1] || '');
        }
        return municipiosList.some(item => {
            var _a, _b, _c, _d, _e, _f;
            const itemNome = normalizarTexto(item.nome || '');
            const itemUf = normalizarTexto(((_c = (_b = (_a = item.microrregiao) === null || _a === void 0 ? void 0 : _a.mesorregiao) === null || _b === void 0 ? void 0 : _b.UF) === null || _c === void 0 ? void 0 : _c.sigla) ||
                ((_f = (_e = (_d = item["regiao-imediata"]) === null || _d === void 0 ? void 0 : _d["regiao-intermediaria"]) === null || _e === void 0 ? void 0 : _e.UF) === null || _f === void 0 ? void 0 : _f.sigla) ||
                '');
            if (inputUf) {
                return itemNome === inputNome && itemUf === inputUf;
            }
            else {
                return itemNome === inputNome;
            }
        });
    }
    GestIndex.validateMunicipio = validateMunicipio;
    function carregarMunicipios() {
        if (municipiosList.length > 0 || carregandoMunicipios)
            return;
        carregandoMunicipios = true;
        try {
            var jqxhr = $.getJSON("/Content/js/municipios.json", function (data) {
                municipiosList = data;
                console.log('Municípios carregados com sucesso. Total:', municipiosList.length);
            }).done(function (data) { }).fail(function (_XMLHttpRequest_, textStatus, errorThrown) { ScriptsConfig.consoleError(_XMLHttpRequest_, textStatus, errorThrown); }).always(function () { });
        }
        catch (erro) {
            console.error("Erro ao buscar dados dos municípios:", erro);
        }
        finally {
            carregandoMunicipios = false;
        }
    }
    GestIndex.carregarMunicipios = carregarMunicipios;
    function initializeDataTableEventoQuestionario(data, mes, ano, pageLength) {
        if (!Array.isArray(data)) {
            console.error('Os dados recebidos não são válidos:', data);
            data = [];
        }
        if (GestIndex.dataTableInstanceEveQuestion) {
            GestIndex.dataTableInstanceEveQuestion.destroy();
        }
        $('#tb-itens-evento-questionario tbody').empty();
        GestIndex.dataTableInstanceEveQuestion = $('#table-lista-evento-questionario').DataTable({
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
                },
                {
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
                },
                {
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
                },
                {
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
                },
                {
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
                },
                {
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
                },
                {
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
                },
                {
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
                },
                {
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
                },
                {
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
                },
                {
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
                },
                {
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
                },
                {
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
                },
                {
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
                },
                {
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
                },
                {
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
                { targets: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], visible: true }, { targets: [0, 1], visible: false }
            ],
            order: [[1, 'asc']],
            autoFill: true
        }).draw();
    }
    GestIndex.initializeDataTableEventoQuestionario = initializeDataTableEventoQuestionario;
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
                GestIndex.dataTableInstanceEventos = null;
            }
        }
        catch (e) {
            console.warn('Erro ao verificar/destruir DataTable anterior:', e);
        }
        $('#table-lista-eventos tbody').empty();
        GestIndex.dataTableInstanceEventos = $('#table-lista-eventos').DataTable({
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
                                        
                                        <button type="button" class="btn btn-light btn-editar-evento" style="padding:1px 10px 1px 10px; "
                                            data-eve="${row.eve_num_evento}"  title="Editar Evento">
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
                        let accesskey = (rowData.eve_num_evento || Date.now());
                        $(td)
                            .attr('id', `linh[${accesskey}][cancelar]`)
                            .attr('row', row)
                            .attr('col', col)
                            .attr('campo', 'cancelar')
                            .attr('data-eve_num_evento', rowData.eve_num_evento || '0')
                            .attr('accesskey', accesskey);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            let accesskey = (row.eve_num_evento || Date.now());
                            return `
                                <td data-eve_num_evento="${row.eve_num_evento || 0}" accesskey="${accesskey}" 
                                    style="width:80px; max-width:80px; text-align: center; "
                                > 
                                    <div class="form-group" style="padding-bottom:0px;margin-bottom: 2px;text-align: center;">
                                        <button type="button" class="btn btn-light btn-cancelar-evento-questionario" style="padding:1px 10px 1px 10px; "
                                            data-eve="${row.eve_num_evento}" title="Cancelar Evento Questionário">
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
                { targets: [1, 2, 3, 4, 5, 6, 8, 9, 10], visible: true }, { targets: [0, 7], visible: false }
            ],
            order: [[1, 'asc']],
            autoFill: true
        }).draw();
    }
    GestIndex.initializeDataTableEventos = initializeDataTableEventos;
    function carregarIndices() { }
    GestIndex.carregarIndices = carregarIndices;
    function gerarHTML(lista) {
        GestIndex.listaUsuariosPontos = [];
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
            GestIndex.listaUsuariosPontos.push({
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
                GestIndex.listaUsuariosPontos.push({
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
                    GestIndex.listaUsuariosPontos.push({
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
        return GestIndex.listaUsuariosPontos;
    }
    ;
    function processDataForTable(data) {
        GestIndex.listaEventos = [];
        data.forEach(q => {
            GestIndex.listaEventos.push({
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
        return GestIndex.listaEventos;
    }
    function processDadosEventosForTable(data) {
        GestIndex.eventos = [];
        data.forEach(q => {
            GestIndex.eventos.push({
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
        return GestIndex.eventos;
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
    GestIndex.eventoDescricao = eventoDescricao;
    function gerarEventosQuestionarioHTML(lista) {
        var _a, _b, _c, _d;
        GestIndex.listaEventos = [];
        let tabela = '<table class="table table-striped">';
        GestIndex.eve_num_evento = Number((_b = (_a = $('input[name="eve_num_evento"]').val()) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : '0');
        GestIndex.que_num_questionario = Number((_d = (_c = $('input[name="que_num_questionario"]').val()) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : '0');
        lista.forEach(q => {
            GestIndex.listaEventos.push({
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
                       onclick="javascript:GestIndex.eventoQuestionarioPontosPorUsuario(${q.eve_num_evento || 0},${q.que_num_questionario || 0})"  style="text-align:center;cursor:pointer;" >
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
                                 onclick="javascript:GestIndex.eventoDescricao(${q.eve_num_evento || 0},${q.que_num_questionario || 0})" style="color:#033E66;">${descri || ''}</h5>
                                <h5 class="mb-4 que_contexto" id="eve[${q.eve_num_evento || 0}][${q.que_num_questionario || 0}][que_contexto]" style="color:#033E66;">Questionário: ${q.que_contexto || ''}</h5>
                    </td>
                </tr>`;
            GestIndex.eve_num_evento = (q.eve_num_evento !== null && q.eve_num_evento > 0) ? q.eve_num_evento : GestIndex.eve_num_evento;
            GestIndex.que_num_questionario = (q.que_num_questionario !== null && q.que_num_questionario > 0) ? q.que_num_questionario : GestIndex.que_num_questionario;
            $('input[name="eve_num_evento"]').val(GestIndex.eve_num_evento);
            $('input[name="que_num_questionario"]').val(GestIndex.que_num_questionario);
        });
        tabela += '</table>';
        $('#eventos-questionario').html(tabela);
        return GestIndex.listaEventos;
    }
    GestIndex.gerarEventosQuestionarioHTML = gerarEventosQuestionarioHTML;
    function carregarEventos() {
        var jqxhr = $.post("/Gestao/ObterEventos", {}, function (data) {
            console.log("success");
            if (data.sucesso) {
                if (data.eventos != null && data.eventos.length > 0) {
                    let lstEventos = processDadosEventosForTable(data.eventos);
                    gerarEventosQuestionarioHTML(lstEventos);
                    GestIndex.initializeDataTableEventos(lstEventos, GestIndex._mes, GestIndex._ano, 100);
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
    GestIndex.carregarEventos = carregarEventos;
    GestIndex.listaBusca = GestIndex.listaUsuariosPontos;
    function carregarCamposDeEvento(eventosDtos) {
        console.log('eventosDtos');
        console.log(eventosDtos);
        $('input[name="eve_num_evento"]').val(eventosDtos.eve_num_evento);
        $('input[name="eve_nome"]').val(eventosDtos.eve_nome);
        $('textarea[name="eve_descricao"]').val(eventosDtos.eve_descricao);
        $('input[name="eve_local"]').val(eventosDtos.eve_local);
        $('input[name="eve_municipio"]').val(eventosDtos.eve_municipio);
        $('input[name="eve_dt_inicio"]').val(((eventosDtos.eve_dt_inicio && eventosDtos.eve_dt_inicio.length >= 10) ? eventosDtos.eve_dt_inicio.substr(8, 2) + '/' + eventosDtos.eve_dt_inicio.substr(5, 2) + '/' + eventosDtos.eve_dt_inicio.substr(0, 4) : ''));
        $('input[name="eve_dt_fim"]').val(((eventosDtos.eve_dt_fim && eventosDtos.eve_dt_fim.length >= 10) ? eventosDtos.eve_dt_fim.substr(8, 2) + '/' + eventosDtos.eve_dt_fim.substr(5, 2) + '/' + eventosDtos.eve_dt_fim.substr(0, 4) : ''));
        $('input[name="eve_dt_inclusao"]').val(((eventosDtos.eve_dt_inclusao && eventosDtos.eve_dt_inclusao.length >= 10) ? eventosDtos.eve_dt_inclusao.substr(8, 2) + '/' + eventosDtos.eve_dt_inclusao.substr(5, 2) + '/' + eventosDtos.eve_dt_inclusao.substr(0, 4) : ''));
        $('select[name="eve_situacao"]').val(eventosDtos.eve_situacao);
    }
    GestIndex.carregarCamposDeEvento = carregarCamposDeEvento;
    function editarEvento(eve_num_evento) {
        var jqxhr = $.post("/Gestao/ObterEvento", { eve_num_evento: eve_num_evento }, function (data) {
            if (data.sucesso) {
                GestIndex.eventosDtos = [];
                let eventosDtos = processDadosEventosForTable(data.lista);
                GestIndex.carregarCamposDeEvento(eventosDtos[0]);
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
        if ($('#div-lista-evento-question').css('display') === 'block') {
            $('#div-lista-evento-question').css('display', 'none');
            $('#div-cad-evento-question').css('display', 'block');
        }
        else {
            $('#div-lista-evento-question').css('display', 'block');
            $('#div-cad-evento-question').css('display', 'none');
        }
    }
    GestIndex.editarEvento = editarEvento;
    function buscarUsuarioaNoRelatorio() {
        const normalizeStr = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        let busca = normalizeStr($('input[name="buscaLimpa"]').val() || '');
        $('input[name="busca"]').val($('input[name="buscaLimpa"]').val() || '');
        let lista = GestIndex.listaUsuariosPontos || [];
        GestIndex.listaBusca = lista;
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
            GestIndex.listaBusca = lista.filter(item => {
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
            console.table(GestIndex.listaBusca);
        }
    }
    GestIndex.buscarUsuarioaNoRelatorio = buscarUsuarioaNoRelatorio;
    function isValidarData(data) {
        const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        const match = data.match(regex);
        if (!match)
            return false;
        const dia = parseInt(match[1], 10);
        const mes = parseInt(match[2], 10);
        const ano = parseInt(match[3], 10);
        if (mes < 1 || mes > 12)
            return false;
        const diasPorMes = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if ((ano % 4 === 0 && ano % 100 !== 0) || (ano % 400 === 0)) {
            diasPorMes[1] = 29;
        }
        if (dia < 1 || dia > diasPorMes[mes - 1])
            return false;
        return true;
    }
    function parseData(data) {
        const [dia, mes, ano] = data.split('/').map(Number);
        return new Date(ano, mes - 1, dia);
    }
    function formValido() {
        let ret = true;
        GestIndex.msgValido = '';
        const eve_nome = String($('input[name="eve_nome"]').val() || '').trim();
        if (!eve_nome) {
            ret = false;
            GestIndex.msgValido += '</br>🔸O campo Nome do Evento deve ser preenchido';
        }
        const eve_descricao = String($('textarea[name="eve_descricao"]').val() || '').trim();
        if (!eve_descricao) {
            ret = false;
            GestIndex.msgValido += '</br>🔸O campo Descrição deve ser preenchido';
        }
        const eve_local = String($('input[name="eve_local"]').val() || '').trim();
        if (!eve_local) {
            ret = false;
            GestIndex.msgValido += '</br>🔸O campo Local deve ser preenchido';
        }
        const eve_municipio = String($('input[name="eve_municipio"]').val() || '').trim();
        if (!eve_municipio) {
            ret = false;
            GestIndex.msgValido += '</br>🔸O campo Município deve ser preenchido';
        }
        const eve_dt_inicio = String($('input[name="eve_dt_inicio"]').val() || '').trim();
        if (!eve_dt_inicio) {
            ret = false;
            GestIndex.msgValido += '</br>🔸O campo Data de Início deve ser preenchido';
        }
        else if (!isValidarData(eve_dt_inicio)) {
            ret = false;
            GestIndex.msgValido += '</br>🔸O campo Data de Início deve ser uma data válida (DD/MM/YYYY)';
        }
        const eve_dt_fim = String($('input[name="eve_dt_fim"]').val() || '').trim();
        if (!eve_dt_fim) {
            ret = false;
            GestIndex.msgValido += '</br>🔸O campo Data de Fim deve ser preenchido';
        }
        else if (!isValidarData(eve_dt_fim)) {
            ret = false;
            GestIndex.msgValido += '</br>🔸O campo Data de Fim deve ser uma data válida (DD/MM/YYYY)';
        }
        else if (eve_dt_inicio && isValidarData(eve_dt_inicio) && isValidarData(eve_dt_fim)) {
            const dataInicio = parseData(eve_dt_inicio);
            const dataFim = parseData(eve_dt_fim);
            if (dataFim < dataInicio) {
                ret = false;
                GestIndex.msgValido += '</br>🔸A Data de Fim deve ser maior ou igual à Data de Início';
            }
        }
        const eve_situacao = String($('select[name="eve_situacao"] option:selected').val() || '').trim();
        if (!eve_situacao) {
            ret = false;
            GestIndex.msgValido += '</br>🔸O campo Situação deve ser preenchido';
        }
        return ret;
    }
    GestIndex.formValido = formValido;
    function SalvarEvento() {
        var dadosForm = $('form[name="formCadEvento"]').serializeArray();
        var jqxhr = $.post('/Gestao/SalvarEvento', dadosForm, function (data) {
            let icone = ((data.sucesso) ? 'success' : "warning");
            let mensagem = ((data.sucesso)
                ? 'Cadastro de Evento Salvo com sucesso!'
                : 'Não foi possível efetuar o cadastro de Evento!');
            if (data.sucesso) {
                console.log('Evento salvo');
                console.table(data.lista);
                if (data.lista != null && data.lista.length > 0) {
                    ScriptsConfig.swalconfirmeActionAlertaWarning.fire({
                        icon: icone,
                        title: '<code style="color:#045C99;font-size:22px;">Olá</code><br>',
                        imageUrl: "/Content/img/logo-ageprev-ms-origin.png",
                        imageWidth: 300,
                        width: 1080,
                        height: 700,
                        html: '<span style="color:#045C99;font-size:20px;"><b> ' + mensagem + '</b></span>',
                        showCancelButton: false,
                        confirmButtonText: "Ok",
                        cancelButtonText: "Não responder o Questionário!",
                        reverseButtons: false,
                        footer: ScriptsConfig.footerAlert,
                        backdrop: true,
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.reload();
                        }
                        else {
                        }
                    });
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
    GestIndex.SalvarEvento = SalvarEvento;
    $(function () {
        GestIndex._ano = '2026';
        GestIndex._mes = '6';
        setTimeout(() => {
            console.log("This prints after 2 seconds!");
            GestIndex.carregarEventos();
            GestIndex.carregarMunicipios();
        }, 200);
        console.log('fetchDataAndInitializeTable()');
        $.when(GestIndex.carregarIndices()).then(function (data, textStatus, jqXHR) {
        });
        $('input[name="eve_municipio"]').on('input', function () {
            const inputVal = $(this).val();
            const query = normalizarTexto(inputVal);
            const container = $('#lista-municipios');
            if (query.length < 2) {
                container.empty().hide();
                selectedIndex = -1;
                return;
            }
            if (municipiosList.length === 0) {
                $.when(carregarMunicipios()).then(function (data, textStatus, jqXHR) {
                    $('input[name="eve_municipio"]').trigger('input');
                });
                return;
            }
            const filtrados = municipiosList.filter(item => {
                var _a, _b, _c, _d, _e, _f;
                const nomeNormalizado = normalizarTexto(item.nome || "");
                const uf = ((_c = (_b = (_a = item.microrregiao) === null || _a === void 0 ? void 0 : _a.mesorregiao) === null || _b === void 0 ? void 0 : _b.UF) === null || _c === void 0 ? void 0 : _c.sigla) || ((_f = (_e = (_d = item["regiao-imediata"]) === null || _d === void 0 ? void 0 : _d["regiao-intermediaria"]) === null || _e === void 0 ? void 0 : _e.UF) === null || _f === void 0 ? void 0 : _f.sigla) || "";
                const ufNormalizada = normalizarTexto(uf);
                return nomeNormalizado.indexOf(query) !== -1 || ufNormalizada.indexOf(query) !== -1;
            }).slice(0, 10);
            renderizarSugestoes(filtrados, inputVal);
        });
        $('input[name="buscaLimpa"]').on('input', function () {
            var cleanValue = $(this).val();
            $('input[name="busca"]').val(cleanValue);
            console.log("Cleaned:", cleanValue);
        });
        $('button[name="btnBuscar"]').on('click', function (e) {
            $.when(GestIndex.buscarUsuarioaNoRelatorio()).then(function (data, textStatus, jqXHR) {
                $.when(GestIndex.initializeDataTableEventoQuestionario(GestIndex.listaBusca, GestIndex._ano, GestIndex._mes, 100)).then(function (data, textStatus, jqXHR) {
                    $('input[name="buscaLimpa"]').val('');
                    console.log('Pontuação carregada com filtro');
                });
            });
        });
        $('button[name="btn-fechar-cadastro"]').on('click', function (e) {
            $('#div-lista-evento-question').css('display', 'block');
            $('#div-cad-evento-question').css('display', 'none');
        });
        $('button[name="btn-abrir-cadastro"]').on('click', function (e) {
            $('#div-lista-evento-question').css('display', 'none');
            $('#div-cad-evento-question').css('display', 'block');
        });
        $('button[name="btn-cad-evento"]').on('click', function (e) {
            ScriptsConfig.swalconfirmeActionAlerta.fire({
                title: '<span style="color:#045C99;font-size:22px;">Atenção!</span>',
                html: '<span style="color:#045C99;font-size:20px;">Deseja salvar o Evento?<span>',
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
                    if (GestIndex.formValido()) {
                        GestIndex.SalvarEvento();
                    }
                    else {
                        Swal.fire({
                            icon: "warning",
                            title: '<span style="color:#045C99;font-size:22px;">Atenção!</span>',
                            html: '<label style="color:#045C99;font-size:20px;text-align:left;">' + GestIndex.msgValido + '<label>',
                            footer: ScriptsConfig.footerAlert
                        });
                    }
                }
                else {
                }
            });
        });
        $('#table-lista-eventos tbody').on('click', 'button.btn-editar-evento', function () {
            const eve_num_evento = Number($(this).data('eve') || 0);
            const que_num_questionario = Number($(this).data('que') || 0);
            GestIndex.editarEvento(eve_num_evento);
        });
        $('#table-lista-evento-questionario tbody').on('click', 'button.btn-editar-evento-questionario', function () {
            const eve_num_evento = Number($(this).data('eve') || 0);
            const que_num_questionario = Number($(this).data('que') || 0);
        });
    });
})(GestIndex || (GestIndex = {}));
//# sourceMappingURL=gestao-index.js.map