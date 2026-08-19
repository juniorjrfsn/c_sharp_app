"use strict";
var CadIndex;
(function (CadIndex) {
    CadIndex.msgValido = '';
    function validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
    CadIndex.validateEmail = validateEmail;
    function validatePhone(phone) {
        const cleaned = phone.replace(/\D/g, "");
        const regex = /^(?:55)?(?:[1-9]{2})(?:9[1-9]\d{3}|\d{4})\d{4}$/;
        return regex.test(cleaned);
    }
    CadIndex.validatePhone = validatePhone;
    function normalizarTexto(txt) {
        if (!txt)
            return "";
        return txt.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();
    }
    CadIndex.normalizarTexto = normalizarTexto;
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
    CadIndex.validateMunicipio = validateMunicipio;
    function formValido() {
        let ret = true;
        CadIndex.msgValido = '';
        let usr_cpf = $('input[name="usr_cpf"]').val();
        if (usr_cpf !== null && usr_cpf !== '') {
        }
        else {
            ret = false;
            CadIndex.msgValido += '</br>🔸O campo de CPF deve ser preenchido';
        }
        let usr_nome = $('input[name="usr_nome"]').val();
        if (usr_nome !== null && usr_nome !== '') {
        }
        else {
            ret = false;
            CadIndex.msgValido += '</br>🔸O campo de Nome deve ser preenchido';
        }
        let usr_email = $('input[name="usr_email"]').val();
        if (usr_email !== null && usr_email !== '') {
            if (CadIndex.validateEmail(usr_email)) {
            }
            else {
                ret = false;
                CadIndex.msgValido += '</br>🔸O campo de e-Mail deve ser preenchido com um e-Mail válido';
            }
        }
        else {
            ret = false;
            CadIndex.msgValido += '</br>🔸O campo de e-Mail deve ser preenchido';
        }
        let usr_telefone = $('input[name="usr_telefone"]').val();
        if (usr_telefone !== null && usr_telefone !== '') {
            if (CadIndex.validatePhone(usr_telefone)) { }
            else {
                ret = false;
                CadIndex.msgValido += '</br>🔸O campo de Telefone deve ser preenchido com um telefone válido';
            }
        }
        else {
            ret = false;
            CadIndex.msgValido += '</br>🔸O campo de Telefone deve ser preenchido';
        }
        let usr_instituicao = $('input[name="usr_instituicao"]').val();
        if (usr_instituicao !== null && usr_instituicao !== '') {
        }
        else {
            ret = false;
            CadIndex.msgValido += '</br>🔸O campo de Instituição deve ser preenchido';
        }
        let usr_municipio = $('input[name="usr_municipio"]').val();
        if (usr_municipio !== null && usr_municipio !== '') {
            if (CadIndex.validateMunicipio(usr_municipio)) {
            }
            else {
                ret = false;
                CadIndex.msgValido += '</br>🔸O Município é inválido, digite o nome do município e selecione na lista';
            }
        }
        else {
            ret = false;
            CadIndex.msgValido += '</br>🔸O campo de Município deve ser preenchido';
        }
        return ret;
    }
    CadIndex.formValido = formValido;
    function limparForm() {
        $('input[name="usr_num_usuario"]').val('');
        $('input[name="usr_nome"]').val('');
        $('input[name="usr_email"]').val('');
        $('input[name="usr_telefone"]').val('');
        $('input[name="usr_instituicao"]').val('');
        $('input[name="usr_municipio"]').val('');
    }
    CadIndex.limparForm = limparForm;
    CadIndex.instituicoesList = [];
    let carregandoInstituicoes = false;
    let selectedIndexInstituicao = -1;
    function carregarInstituicoes() {
        if (CadIndex.instituicoesList.length > 0 || carregandoInstituicoes)
            return;
        carregandoInstituicoes = true;
        try {
            var jqxhr = $.post("/Cadastro/GetInstituicoes", {}, function (data) {
                let lista = data.instituicoes;
                lista.forEach(q => {
                    CadIndex.instituicoesList.push({
                        EMP_COD: Number(q.EMP_COD) || 0,
                        usr_instituicao: q.usr_instituicao || '',
                    });
                });
                console.log('Instituições carregadas com sucesso. Total:', CadIndex.instituicoesList.length);
            }, "json").done(function (data) { }).fail(function (_XMLHttpRequest_, textStatus, errorThrown) { consoleError(_XMLHttpRequest_, textStatus, errorThrown); }).always(function () { });
        }
        catch (erro) {
            console.error("Erro ao buscar dados das instituições:", erro);
        }
        finally {
            carregandoInstituicoes = false;
        }
    }
    CadIndex.carregarInstituicoes = carregarInstituicoes;
    let municipiosList = [];
    let carregandoMunicipios = false;
    let selectedIndex = -1;
    function consoleError(_XMLHttpRequest_, textStatus, errorThrown) {
        console.log("error");
        console.log(_XMLHttpRequest_);
        console.log(textStatus);
        console.log(errorThrown);
    }
    CadIndex.consoleError = consoleError;
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
    CadIndex.carregarMunicipios = carregarMunicipios;
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
    CadIndex.renderizarSugestoesInstituicoes = renderizarSugestoesInstituicoes;
    $(function () {
        carregarInstituicoes();
        carregarMunicipios();
        $('input[name="usr_cpf_mask"]').on('input', function () {
            var cleanValue = $(this).val();
            $('input[name="usr_cpf"]').val(cleanValue);
            console.log("Cleaned:", cleanValue);
        });
        $('input[name="usr_nome"]').on('input', function () {
            let inputElement = this;
            let start = inputElement.selectionStart;
            let end = inputElement.selectionEnd;
            let val = $(inputElement).val();
            $(inputElement).val(val.toUpperCase());
            inputElement.setSelectionRange(start, end);
        });
        $('input[name="usr_instituicao"]').on('input', function () {
            let inputElement = this;
            let start = inputElement.selectionStart;
            let end = inputElement.selectionEnd;
            let val = $(inputElement).val();
            $(inputElement).val(val.toUpperCase());
            inputElement.setSelectionRange(start, end);
            const container = $('#lista-instituicoes');
            const query = normalizarTexto(val.toUpperCase());
            if (query.length < 2) {
                container.empty().hide();
                selectedIndexInstituicao = -1;
                return;
            }
            if (CadIndex.instituicoesList.length === 0) {
                $.when(carregarInstituicoes()).then(function () {
                    $('input[name="usr_instituicao"]').trigger('input');
                });
                return;
            }
            const filtrados = CadIndex.instituicoesList.filter(item => {
                const nomeNormalizado = normalizarTexto(item.usr_instituicao || "");
                return nomeNormalizado.indexOf(query) !== -1;
            }).slice(0, 10);
            renderizarSugestoesInstituicoes(filtrados, val);
        });
        $('input[name="usr_cpf"]').on('change', function (e) {
            CadIndex.limparForm();
        });
        $('button[name="btnBuscarDadosPorCPF"]').on('click', function (e) {
            let usr_cpf = $('input[name="usr_cpf"]').val();
            usr_cpf = usr_cpf.replace(/\D/g, "");
            var eve_num_evento = $('input[name="eve_num_evento"]').val();
            var que_num_questionario = $('input[name="que_num_questionario"]').val();
            if (usr_cpf.length > 10) {
                var jqxhr = $.post("/Cadastro/GetDadosUsuario", { usr_cpf: usr_cpf, eve_num_evento: eve_num_evento, que_num_questionario: que_num_questionario }, function (data) {
                    var _a, _b;
                    console.log("success");
                    console.table(data);
                    if (data.sucesso) {
                        console.log('Entrou no Sucesso');
                        var usuario = data.usuario;
                        var primeiroNome = (usuario.usr_nome || "").trim().split(" ")[0];
                        var cpf = usuario.usr_cpf || "";
                        var cpfClean = cpf.replace(/\D/g, "");
                        var cpfMascarado = "";
                        if (cpfClean.length === 11) {
                            cpfMascarado = "***." + cpfClean.substring(3, 6) + "." + cpfClean.substring(6, 9) + "-**";
                        }
                        else {
                            cpfMascarado = cpf;
                        }
                        let usr_municipio = '';
                        if (usuario.CID !== null && usuario.CID !== '' && usuario.UF_SIGLA_RESIDEN !== null && usuario.UF_SIGLA_RESIDEN !== '' && usuario.UF_SIGLA_RESIDEN.length > 0) {
                            let cidade = usuario.CID.split(' - ')[0];
                            usr_municipio = `${cidade} - ${usuario.UF_SIGLA_RESIDEN}`;
                        }
                        else if (usuario.CID !== null && usuario.CID !== '') {
                            usr_municipio = usuario.CID;
                        }
                        else if (usuario.UF_SIGLA_RESIDEN !== null && usuario.UF_SIGLA_RESIDEN !== '' && (usuario.CID === null || usuario.CID === ' - ' || usuario.CID === ' - ')) {
                            usr_municipio = '';
                        }
                        else if (usuario.CID === ' - ') {
                            usr_municipio = '';
                        }
                        else if (usuario.UF_SIGLA_RESIDEN === ' - ') {
                            usr_municipio = '';
                        }
                        else {
                            usr_municipio = '';
                        }
                        let uc = $('input[name="usr_cpf"]').val();
                        var uc2 = uc || "";
                        var cpfClean2 = uc2.replace(/\D/g, "");
                        if (cpfClean2 !== null && cpfClean2 !== '') {
                            let cpfMascarado2 = "***." + cpfClean2.substring(3, 6) + "." + cpfClean2.substring(6, 9) + "-**";
                            $('input[name="usr_cpf_maskarado"]').val(cpfMascarado2);
                            $('input[name="usr_cpf_maskarado"]').css('display', 'block');
                            $('input[name="usr_cpf_mask"]').css('display', 'none');
                        }
                        else {
                        }
                        $('input[name="usr_num_usuario"]').val(usuario.usr_num_usuario);
                        $('input[name="usr_nome"]').val((usuario.usr_nome || "").toUpperCase());
                        $('input[name="usr_email"]').val(usuario.usr_email);
                        $('input[name="usr_telefone"]').val(usuario.usr_telefone);
                        $('input[name="usr_instituicao"]').val((usuario.usr_instituicao || "").toUpperCase());
                        $('input[name="usr_municipio"]').val(usr_municipio);
                        $('#dados-usuario').css('display', 'block');
                        $('#botoes').css('display', 'block');
                        console.log('usuario.qtde_resp : ' + usuario.qtde_resp);
                        if (parseInt(usuario.qtde_resp) > 0) {
                            let pontuacao = Number(data.pontuacao.toFixed(2));
                            let nota = pontuacao === null || pontuacao === void 0 ? void 0 : pontuacao.toString().replace('.', ',');
                            let que_nota_minima = Number((_b = (_a = $('input[name="que_nota_minima"]').val()) === null || _a === void 0 ? void 0 : _a.toString().replace(',', '.')) !== null && _b !== void 0 ? _b : '0');
                            let icone = ((pontuacao >= que_nota_minima) ? 'success' : "warning");
                            let mensagem = ((pontuacao >= que_nota_minima)
                                ? 'Obrigado pela sua Participação, você teve uma ótima pontuação!'
                                : 'Obrigado pela sua Participação, você não atingiu a nota mínima!');
                            ScriptsConfig.swalconfirmeActionAlertaWarning.fire({
                                icon: icone,
                                title: '<code style="color:#045C99;font-size:22px;">Olá ' + primeiroNome + ' - ' + cpfMascarado + '</code><br>'
                                    + '<code style="color:#045C99;font-size:20px;">O Questionário para este evento já foi respondido</code><br>'
                                    + '<span style="color:#045C99;font-size:22px;">' + mensagem + '</span>',
                                imageUrl: "/Content/img/logo-ageprev-ms-origin.png",
                                imageWidth: 300,
                                width: 1080,
                                height: 700,
                                html: '<span style="color:#045C99;font-size:20px;">A sua nota é: <b> ' + nota + '</b></span>',
                                showCancelButton: false,
                                confirmButtonText: "Ok",
                                cancelButtonText: "Não responder o Questionário!",
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
                            $('.btn-eventos').attr('disabled', 'disabled');
                        }
                        else {
                            $('.btn-eventos').removeAttr('disabled');
                        }
                        $('input[name="usr_cpf"]').attr('readonly', 'readonly');
                    }
                    else {
                        console.log('Nao Entrou no Sucess');
                        if (data.tipoErro === "validacao") {
                            Swal.fire({
                                icon: "warning",
                                title: '<span style="color:#045C99;font-size:22px;">Validação</span>',
                                html: '<span style="color:#045C99;font-size:20px;">' + data.msg + '<span>',
                                footer: ScriptsConfig.footerAlert
                            });
                            CadIndex.limparForm();
                        }
                        else if (data.tipoErro === "sistema") {
                            Swal.fire({
                                icon: "error",
                                title: '<span style="color:#045C99;font-size:22px;">Erro de Sistema</span>',
                                html: '<span style="color:#045C99;font-size:20px;">' + data.msg + '<span>',
                                footer: ScriptsConfig.footerAlert
                            });
                        }
                        else {
                            Swal.fire({
                                icon: "info",
                                title: '<span style="color:#045C99;font-size:22px;">Aviso</span>',
                                html: '<span style="color:#045C99;font-size:20px;">' + data.msg + '<span>',
                                footer: ScriptsConfig.footerAlert
                            });
                        }
                    }
                }, "json").done(function (data) {
                    console.log("done success");
                }).fail(function (_XMLHttpRequest_, textStatus, errorThrown) {
                    console.log("error");
                    console.log(_XMLHttpRequest_);
                    console.log(textStatus);
                    console.log(errorThrown);
                }).always(function () {
                    console.log("finished");
                });
            }
            else {
                Swal.fire({
                    icon: "warning",
                    title: '<span style="color:#045C99;font-size:22px;">Validação</span>',
                    html: '<span style="color:#045C99;font-size:20px;">O campo de CPF está incompleto<span>',
                    footer: ScriptsConfig.footerAlert
                });
            }
        });
        $('button[name="btnCadastrar"]').on('click', function () {
            if (CadIndex.formValido()) {
                $('form[name="formCad"]').trigger('submit');
            }
            else {
                Swal.fire({
                    icon: "warning",
                    title: '<span style="color:#045C99;font-size:22px;">Atenção!</span>',
                    html: '<label style="color:#045C99;font-size:20px;text-align:left;">' + CadIndex.msgValido + '<label>',
                    footer: ScriptsConfig.footerAlert
                });
            }
        });
        $('button[name="btnCadastrar__"]').on('click', function () {
            let json = { "sucesso": true, "msg": "Saindo!" };
            let jsonCad = { "sucesso": true, "msg": "Cadstro Salvo!" };
            ScriptsConfig.swalconfirmeActionAlerta.fire({
                title: 'Atenção',
                html: 'Deseja Salvar e Iniciar o Questionário?',
                icon: "warning",
                showCancelButton: false,
                showDenyButton: true,
                confirmButtonText: '<i class="fa-solid fa-check"></i> Sim',
                denyButtonText: 'Não <i class="fa-solid fa-arrow-right-from-bracket"></i>',
                cancelButtonText: "",
                reverseButtons: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
                backdrop: true
            }).then((result) => {
                if (result.isConfirmed) {
                    var jqxhr = $.post("/Cadastro/SalvarUsuario", function (data) {
                        console.log("success");
                        console.table(data);
                        if (data.sucesso) {
                            var dados = data.lista;
                            ScriptsConfig.swalWithBootstrapButtons.fire({
                                title: 'Registro',
                                html: jsonCad.msg,
                                icon: "success",
                                showCancelButton: true,
                                confirmButtonText: "Iniciar Questionário",
                                cancelButtonText: "Não responder o Questionário!",
                                reverseButtons: false
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    window.location.href = '/Questionario/Index';
                                }
                                else {
                                    window.location.href = '/Home/Index';
                                }
                            });
                        }
                        else {
                            ScriptsConfig.swalconfirmeActionAlerta.fire({
                                title: 'Erro',
                                html: "Não foi possível efetuar o Cadastro!",
                                icon: "warning",
                                showCancelButton: false,
                                showDenyButton: true,
                                confirmButtonText: "Atualizar Pággina",
                                denyButtonText: 'Voltar para Página Anterior',
                                cancelButtonText: "No, cancel!",
                                reverseButtons: true, footer: ScriptsConfig.footerAlert
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    window.location.reload();
                                }
                                else if (result.isDenied) {
                                    window.location.href = '/Home/Index';
                                }
                                else {
                                    window.location.href = '/Home/Index';
                                }
                            });
                        }
                    }, "json")
                        .done(function (data) {
                        console.log("second success");
                        console.table(data);
                        console.table(data.lista);
                    })
                        .fail(function (_XMLHttpRequest_, textStatus, errorThrown) {
                        console.log("error");
                        console.log(_XMLHttpRequest_);
                        console.log(textStatus);
                        console.log(errorThrown);
                    })
                        .always(function () {
                        console.log("finished");
                        $('#botoes').css('display', 'block');
                    });
                }
                else {
                }
            });
        });
        $('button[name="btnSairCadastro"]').on('click', function () {
            let json = { "sucesso": true, "msg": "Saindo!" };
            ScriptsConfig.swalconfirmeActionAlerta.fire({
                title: '<span style="color:#033E66;font-size:22px;">Atenção!</span>',
                html: '<span style="color:#033E66;font-size:20px;text-align:justify;">Deseja realmente sair?</span>',
                icon: "warning",
                showCancelButton: false,
                showDenyButton: true,
                confirmButtonText: '<i class="fa-solid fa-check"></i> Sim',
                denyButtonText: 'Não <i class="fa-solid fa-arrow-right-from-bracket"></i>',
                cancelButtonText: "",
                reverseButtons: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
                footer: ScriptsConfig.footerAlert,
                backdrop: true,
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = '/Home/Index';
                }
                else {
                }
            });
        });
        $('input[name="usr_municipio"]').on('focus', function () {
            carregarMunicipios();
        });
        $('input[name="usr_municipio"]').on('input', function () {
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
                    $('input[name="usr_municipio"]').trigger('input');
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
        function selecionarMunicipio(valor) {
            $('input[name="usr_municipio"]').val(valor);
            $('#lista-municipios').empty().hide();
            selectedIndex = -1;
        }
        $('input[name="usr_municipio"]').on('keydown', function (e) {
            const container = $('#lista-municipios');
            const itens = container.find('.municipio-item');
            if (!container.is(':visible') || itens.length === 0) {
                return;
            }
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                selectedIndex = (selectedIndex + 1) % itens.length;
                destacarItem(itens);
            }
            else if (e.key === 'ArrowUp') {
                e.preventDefault();
                selectedIndex = (selectedIndex - 1 + itens.length) % itens.length;
                destacarItem(itens);
            }
            else if (e.key === 'Enter') {
                if (selectedIndex >= 0 && selectedIndex < itens.length) {
                    e.preventDefault();
                    $(itens[selectedIndex]).trigger('click');
                }
            }
            else if (e.key === 'Escape') {
                container.empty().hide();
                selectedIndex = -1;
            }
        });
        function destacarItem(itens) {
            itens.removeClass('active').css({
                'background-color': '',
                'color': ''
            });
            if (selectedIndex >= 0 && selectedIndex < itens.length) {
                const item = $(itens[selectedIndex]);
                item.addClass('active').css({
                    'background-color': '#045C99',
                    'color': '#ffffff'
                });
                const containerUl = item.parent();
                const itemTop = item.position().top;
                const containerScrollTop = containerUl.scrollTop() || 0;
                const containerHeight = containerUl.height() || 0;
                if (itemTop < 0) {
                    containerUl.scrollTop(containerScrollTop + itemTop);
                }
                else if (itemTop + (item.outerHeight() || 0) > containerHeight) {
                    containerUl.scrollTop(containerScrollTop + itemTop - containerHeight + (item.outerHeight() || 0));
                }
            }
        }
        $(document).on('click', function (e) {
            if (!$(e.target).closest('input[name="usr_municipio"], #lista-municipios').length) {
                $('#lista-municipios').empty().hide();
                selectedIndex = -1;
            }
        });
    });
})(CadIndex || (CadIndex = {}));
//# sourceMappingURL=cadastro-index.js.map