"use strict";
var GeU;
(function (GeU) {
    GeU.tempo = Date.now();
    GeU.dataTableInstance = null;
    GeU._ano = '0';
    GeU._mes = '0';
    GeU.eve_num_evento = 0;
    GeU.que_num_questionario = 0;
    GeU.listaEventos = [];
    GeU.listaUsuarios = [];
    GeU.dadosDaTabela = [];
    GeU.listaUsuariosPontos = [];
    GeU.msgValido = '';
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
        GeU.dadosDaTabela.push(rd);
    }
    function processDataForTable(data) {
        return data.map(item => {
            const mesAno = 0;
            return Object.assign(Object.assign({}, item), { mes_ano: mesAno, tempo: item.usr_num_usuario || Date.now() });
        });
    }
    GeU.listaBusca = GeU.listaUsuarios;
    function buscarUsuarioaNoRelatorio() {
        const normalizeStr = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        let busca = normalizeStr($('input[name="buscaLimpa"]').val() || '');
        $('input[name="busca"]').val($('input[name="buscaLimpa"]').val() || '');
        let lista = GeU.listaUsuarios || [];
        const matchItem = (item) => {
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
            const cleanBusca = busca.replace(/[.\-/]/g, '');
            const cpfMatches = rawCpf.includes(busca) || rawCpf.includes(cleanBusca) || maskedCpf.includes(busca);
            const nomeMatches = normalizeStr(item.usr_nome || '').includes(busca);
            const emailMatches = normalizeStr(item.usr_email || '').includes(busca);
            return cpfMatches || nomeMatches || emailMatches;
        };
        GeU.listaBusca = busca.length > 0 ? lista.filter(matchItem) : lista;
        console.table(GeU.listaBusca);
        GeU.initializeDataTableUsuarios(GeU.listaBusca, GeU._mes, GeU._ano, 100);
    }
    GeU.buscarUsuarioaNoRelatorio = buscarUsuarioaNoRelatorio;
    function processaUsuariosParaTable_(data) {
        return data.map(item => {
            const mesAno = 0;
            return Object.assign(Object.assign({}, item), { mes_ano: mesAno, tempo: item.par_num_evento_vigente || Date.now() });
        });
    }
    GeU.processaUsuariosParaTable_ = processaUsuariosParaTable_;
    function initializeDataTableUsuarios(data, mes, ano, pageLength) {
        if (!Array.isArray(data)) {
            console.error('Os dados recebidos não são válidos:', data);
            data = [];
        }
        try {
            if ($.fn && $.fn.dataTable && $.fn.dataTable.isDataTable && $.fn.dataTable.isDataTable('#table-lista-usuarios')) {
                try {
                    const existing = $('#table-lista-usuarios').DataTable();
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
                    $('#table-lista-usuarios_wrapper').remove();
                }
                catch (e) { }
                GeU.dataTableInstance = null;
            }
        }
        catch (e) {
            console.warn('Erro ao verificar/destruir DataTable anterior:', e);
        }
        $('#table-lista-usuarios tbody').empty();
        GeU.dataTableInstance = $('#table-lista-usuarios').DataTable({
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
                    sheetName: 'Usuários ' + mes + '-de-' + ano,
                    messageTop: 'Usuários: ' + mes + '/' + ano,
                    text: '<i class="far fa-file-excel text-success fa-lg"></i>',
                    title: null,
                    filename: function () {
                        return 'Usuarios-mes-' + mes + '-de-' + ano;
                    },
                    exportOptions: {
                        columns: [1, 2, 3, 4, 5, 6, 7]
                    }
                },
                {
                    extend: 'pdfHtml5',
                    title: null,
                    filename: function () {
                        return 'Usuarios-mes-' + mes + '-de-' + ano;
                    },
                    text: '<i class="fa-regular fa-file-pdf text-danger fa-lg"></i>',
                    exportOptions: {
                        columns: [1, 2, 3, 4, 5, 6, 7]
                    }
                },
                {
                    extend: 'colvis',
                    autoFilter: true,
                    sheetName: 'colvis',
                    text: '<i class="fas fa-columns text-primary fa-lg"></i>',
                    orientation: 'portrait',
                    exportOptions: {
                        columns: [1, 2, 3, 4, 5, 6, 7]
                    }
                }
            ],
            initComplete: function () {
                var table = GeU.dataTableInstance;
                table.buttons([0, 1, 2]).remove();
            },
            lengthChange: true,
            searching: true,
            ordering: true,
            columns: [
                {
                    data: 'usr_num_usuario',
                    className: 'usr_num_usuario',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td)
                            .attr('id', `linh[${rowData.usr_num_usuario || 0}][usr_num_usuario]`)
                            .attr('row', row)
                            .attr('col', col)
                            .attr('campo', 'usr_num_usuario')
                            .attr('data-usr_num_usuario', rowData.usr_num_usuario || '0');
                    }
                },
                {
                    data: 'usr_nome',
                    className: 'usr_nome',
                    render: function (data, type, row) {
                        if (type === 'display') {
                            return `<span title="${data || ''}">${data || ''}</span>`;
                        }
                        return data;
                    }
                },
                {
                    data: 'usr_cpf',
                    className: 'usr_cpf',
                    render: function (data, type, row) {
                        const cpf = String(data || '');
                        if (type === 'display') {
                            if (cpf.length === 11) {
                                return `***.${cpf.substring(3, 6)}.${cpf.substring(6, 9)}-**`;
                            }
                            return cpf;
                        }
                        return data;
                    }
                },
                { data: 'usr_email', className: 'usr_email' },
                { data: 'usr_telefone', className: 'usr_telefone' },
                { data: 'usr_instituicao', className: 'usr_instituicao' },
                { data: 'usr_municipio', className: 'usr_municipio' },
                {
                    data: 'usr_situacao',
                    className: 'usr_situacao',
                    render: function (data, type, row) {
                        if (type === 'display') {
                            const ativo = data === 'A';
                            const badgeClass = ativo ? 'badge bg-success' : 'badge bg-secondary';
                            const label = ativo ? 'Ativo' : 'Inativo';
                            return `<span class="${badgeClass}">${label}</span>`;
                        }
                        return data;
                    }
                },
                {
                    data: null,
                    orderable: false,
                    createdCell: function (td, cellData, rowData, row, col) {
                        let accesskey = (rowData.usr_num_usuario || 0);
                        $(td)
                            .attr('id', `linh[${accesskey}][editar]`)
                            .attr('row', row)
                            .attr('col', col)
                            .attr('campo', 'editar')
                            .attr('data-usr_num_usuario', rowData.usr_num_usuario || '0')
                            .attr('accesskey', accesskey);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            let accesskey = (row.usr_num_usuario || 0);
                            return `
                            <td data-usr_num_usuario="${row.usr_num_usuario || 0}" accesskey="${accesskey}" style="width: 80px; text-align: center;">
                                <div class="form-group" style="padding-bottom:0px;margin-bottom: 2px;text-align: center;">
                                    <button type="button" class="btn btn-light btn-editar-usuario" style=""
                                        data-usuario="${row.usr_num_usuario}" title="Editar Usuário">
                                        <span accesskey="${accesskey}" id="inpu[${accesskey}][editar]" style="">
                                            <i class="fa-regular fa-pen-to-square text-info fa-lg"></i>
                                        </span>
                                    </button>
                                </div>
                            </td>
                        `;
                        }
                        return data;
                    }
                },
                {
                    data: null,
                    orderable: false,
                    createdCell: function (td, cellData, rowData, row, col) {
                        let accesskey = (rowData.usr_num_usuario || 0);
                        $(td)
                            .attr('id', `linh[${accesskey}][cancelar]`)
                            .attr('row', row)
                            .attr('col', col)
                            .attr('campo', 'cancelar')
                            .attr('data-usr_num_usuario', rowData.usr_num_usuario || '0')
                            .attr('accesskey', accesskey);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            let accesskey = (row.usr_num_usuario || 0);
                            return `
                            <td data-usr_num_usuario="${row.usr_num_usuario || 0}" accesskey="${accesskey}" style="width: 80px; text-align: center;">
                                <div class="form-group" style="padding-bottom:0px;margin-bottom: 2px;text-align: center;">
                                    <button type="button" class="btn btn-light btn-cancelar-usuario" style=""
                                        data-usuario="${row.usr_num_usuario}" title="Cancelar Usuário">
                                        <span accesskey="${accesskey}" id="inpu[${accesskey}][cancelar]" style="">
                                            <i class="fa-regular fa-circle-xmark text-warning fa-lg"></i>
                                        </span>
                                    </button>
                                </div>
                            </td>
                        `;
                        }
                        return data;
                    }
                }
            ],
            language: {
                url: 'https://cdn.datatables.net/plug-ins/1.13.6/i18n/pt-BR.json'
            },
            columnDefs: [
                { targets: [0], visible: false }
            ],
            order: [[1, 'asc']],
            autoFill: true
        }).draw();
    }
    GeU.initializeDataTableUsuarios = initializeDataTableUsuarios;
    function processaUsuariosParaTable(data) {
        GeU.listaUsuarios = [];
        data.forEach(q => {
            GeU.listaUsuarios.push({
                tempo: (q.usr_num_usuario || Date.now),
                usr_num_usuario: (q.usr_num_usuario || 0),
                usr_nome: (q.usr_nome || ''),
                usr_cpf: (q.usr_cpf || ''),
                usr_email: (q.usr_email || ''),
                usr_telefone: (q.usr_telefone || ''),
                usr_instituicao: (q.usr_instituicao || ''),
                usr_municipio: (q.usr_municipio || ''),
                usr_situacao: (q.usr_situacao || 'A')
            });
        });
        return GeU.listaUsuarios;
    }
    GeU.processaUsuariosParaTable = processaUsuariosParaTable;
    function carregarUsuarios() {
        var jqxhr = $.post('/Gerencia/ObterUsuarios', {}, function (data) {
            console.log(data);
            if (data.sucesso) {
                if (data.lista != null && data.lista.length > 0) {
                    let listaUsuarios = GeU.processaUsuariosParaTable(data.lista);
                    console.table(listaUsuarios);
                    GeU.initializeDataTableUsuarios(listaUsuarios, GeU._mes, GeU._ano, 100);
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
    GeU.carregarUsuarios = carregarUsuarios;
    function validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
    GeU.validateEmail = validateEmail;
    function validatePhone(phone) {
        const cleaned = phone.replace(/\D/g, "");
        const regex = /^(?:55)?(?:[1-9]{2})(?:9[1-9]\d{3}|\d{4})\d{4}$/;
        return regex.test(cleaned);
    }
    GeU.validatePhone = validatePhone;
    function normalizarTexto(txt) {
        if (!txt)
            return "";
        return txt.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();
    }
    GeU.normalizarTexto = normalizarTexto;
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
                    consoleError(_XMLHttpRequest_, textStatus, errorThrown);
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
    GeU.validateMunicipio = validateMunicipio;
    function formValido() {
        let ret = true;
        GeU.msgValido = '';
        let usr_cpf = $('input[name="usr_cpf"]').val();
        if (usr_cpf !== null && usr_cpf !== '') {
        }
        else {
            ret = false;
            GeU.msgValido += '</br>🔸O campo de CPF deve ser preenchido';
        }
        let usr_nome = $('input[name="usr_nome"]').val();
        if (usr_nome !== null && usr_nome !== '') {
        }
        else {
            ret = false;
            GeU.msgValido += '</br>🔸O campo de Nome deve ser preenchido';
        }
        let usr_email = $('input[name="usr_email"]').val();
        if (usr_email !== null && usr_email !== '') {
            if (GeU.validateEmail(usr_email)) {
            }
            else {
                ret = false;
                GeU.msgValido += '</br>🔸O campo de e-Mail deve ser preenchido com um e-Mail válido';
            }
        }
        else {
            ret = false;
            GeU.msgValido += '</br>🔸O campo de e-Mail deve ser preenchido';
        }
        let usr_telefone = $('input[name="usr_telefone"]').val();
        if (usr_telefone !== null && usr_telefone !== '') {
            if (GeU.validatePhone(usr_telefone)) { }
            else {
                ret = false;
                GeU.msgValido += '</br>🔸O campo de Telefone deve ser preenchido com um telefone válido';
            }
        }
        else {
            ret = false;
            GeU.msgValido += '</br>🔸O campo de Telefone deve ser preenchido';
        }
        let usr_instituicao = $('input[name="usr_instituicao"]').val();
        if (usr_instituicao !== null && usr_instituicao !== '') {
        }
        else {
            ret = false;
            GeU.msgValido += '</br>🔸O campo de Instituição deve ser preenchido';
        }
        let usr_municipio = $('input[name="usr_municipio"]').val();
        if (usr_municipio !== null && usr_municipio !== '') {
            if (GeU.validateMunicipio(usr_municipio)) {
            }
            else {
                ret = false;
                GeU.msgValido += '</br>🔸O Município é inválido, digite o nome do município e selecione na lista';
            }
        }
        else {
            ret = false;
            GeU.msgValido += '</br>🔸O campo de Município deve ser preenchido';
        }
        return ret;
    }
    GeU.formValido = formValido;
    function limparForm() {
        $('input[name="usr_num_usuario"]').val('');
        $('input[name="usr_nome"]').val('');
        $('input[name="usr_email"]').val('');
        $('input[name="usr_telefone"]').val('');
        $('input[name="usr_instituicao"]').val('');
        $('input[name="usr_municipio"]').val('');
    }
    GeU.limparForm = limparForm;
    GeU.instituicoesList = [];
    let carregandoInstituicoes = false;
    let selectedIndexInstituicao = -1;
    function carregarInstituicoes() {
        if (GeU.instituicoesList.length > 0 || carregandoInstituicoes)
            return;
        carregandoInstituicoes = true;
        try {
            var jqxhr = $.post("/Gerencia/GetInstituicoes", {}, function (data) {
                let lista = data.instituicoes;
                lista.forEach(q => {
                    GeU.instituicoesList.push({
                        EMP_COD: Number(q.EMP_COD) || 0,
                        usr_instituicao: q.usr_instituicao || '',
                    });
                });
                console.log('Instituições carregadas com sucesso. Total:', GeU.instituicoesList.length);
            }, "json").done(function (data) { }).fail(function (_XMLHttpRequest_, textStatus, errorThrown) { consoleError(_XMLHttpRequest_, textStatus, errorThrown); }).always(function () { });
        }
        catch (erro) {
            console.error("Erro ao buscar dados das instituições:", erro);
        }
        finally {
            carregandoInstituicoes = false;
        }
    }
    GeU.carregarInstituicoes = carregarInstituicoes;
    let municipiosList = [];
    let carregandoMunicipios = false;
    let selectedIndex = -1;
    function consoleError(_XMLHttpRequest_, textStatus, errorThrown) {
        console.log("error");
        console.log(_XMLHttpRequest_);
        console.log(textStatus);
        console.log(errorThrown);
    }
    GeU.consoleError = consoleError;
    function carregarMunicipios() {
        if (municipiosList.length > 0 || carregandoMunicipios)
            return;
        carregandoMunicipios = true;
        try {
            var jqxhr = $.getJSON("/Content/js/municipios.json", function (data) {
                municipiosList = data;
                console.log('Municípios carregados com sucesso. Total:', municipiosList.length);
            }).done(function (data) { }).fail(function (_XMLHttpRequest_, textStatus, errorThrown) { consoleError(_XMLHttpRequest_, textStatus, errorThrown); }).always(function () { });
        }
        catch (erro) {
            console.error("Erro ao buscar dados dos municípios:", erro);
        }
        finally {
            carregandoMunicipios = false;
        }
    }
    GeU.carregarMunicipios = carregarMunicipios;
    function selecionarInstituicao(valor) {
        $('input[name="usr_instituicao"]').val(valor);
        $('#lista-instituicoes').empty().hide();
        selectedIndexInstituicao = -1;
    }
    function renderizarSugestoesInstituicoes(itens, termoOriginal) {
        const container = $('#lista-instituicoes');
        container.empty();
        selectedIndexInstituicao = -1;
        if (itens.length === 0) {
            container.hide();
            return;
        }
        const ul = $('<ul class="list-group position-absolute w-100 shadow-sm" style="z-index: 1050; max-height: 250px; overflow-y: auto; margin-top: 2px; padding: 0;"></ul>');
        itens.forEach((item, index) => {
            const textoCompleto = item.usr_instituicao.toUpperCase();
            const regex = new RegExp(`(${termoOriginal.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
            const textoComDestaque = textoCompleto.replace(regex, '<strong>$1</strong>');
            const li = $(`<li class="list-group-item list-group-item-action instituicao-item" data-index="${index}" style="cursor: pointer; padding: 8px 12px;">${textoComDestaque}</li>`);
            li.on('click', function () {
                selecionarInstituicao(textoCompleto);
            });
            ul.append(li);
        });
        container.append(ul).show();
    }
    GeU.renderizarSugestoesInstituicoes = renderizarSugestoesInstituicoes;
    function editarUsuario(usr_num_usuario) {
        GeU.listaUsuarios.forEach(usuario => {
            if (usuario.usr_num_usuario === usr_num_usuario) {
                $('input[name="usr_num_usuario"]').val(usuario.usr_num_usuario);
                $('input[name="usr_nome"]').val(usuario.usr_nome);
                $('input[name="usr_cpf"]').val(usuario.usr_cpf);
                $('input[name="usr_email"]').val(usuario.usr_email);
                $('input[name="usr_telefone"]').val(usuario.usr_telefone);
                $('input[name="usr_instituicao"]').val(usuario.usr_instituicao);
                $('input[name="usr_municipio"]').val(usuario.usr_municipio);
            }
        });
        $('#div-usuarios').css('display', 'none');
        $('#div-cad-usuarios').css('display', 'block');
    }
    GeU.editarUsuario = editarUsuario;
    $(function () {
        GeU._ano = '2026';
        GeU._mes = '6';
        setTimeout(() => {
            console.log("This prints after 2 seconds!");
            GeU.carregarInstituicoes();
            GeU.carregarMunicipios();
            GeU.carregarUsuarios();
        }, 200);
        $('input[name="buscaLimpa"]').on('input', function () {
            var cleanValue = $(this).val();
            $('input[name="busca"]').val(cleanValue);
            console.log("Cleaned:", cleanValue);
        });
        $('button[name="btn-abrir-cad-usuario"]').on('click', function (e) {
            $('#div-usuarios').css('display', 'none');
            $('#div-cad-usuarios').css('display', 'block');
        });
        $('#div-usuarios tbody').on('click', 'button.btn-editar-usuario', function () {
            const usr_num_usuario = Number($(this).data('usuario') || 0);
            GeU.editarUsuario(usr_num_usuario);
        });
        $('button.btn-voltar-to-lista-usuarios').on('click', function () {
            GeU.limparForm();
            $('#div-cad-usuarios').css('display', 'none');
            $('#div-usuarios').css('display', 'block');
        });
    });
})(GeU || (GeU = {}));
//# sourceMappingURL=gerencia-usuarios.js.map