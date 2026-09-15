// File: script-page/questionario-index.ts

/// <reference path="../config-scripts/@types/jquery/index.d.ts" />
/// <reference path="../config-scripts/@types/jquery.form/index.d.ts" />

/// <reference path="../config-scripts/@types/datatables.net/types/types.d.ts" />
/// <reference path="../config-scripts/sweetalert2.d.ts" />
/// <reference path="../config-scripts/config.ts" />
/// <reference path="../config-scripts/ScriptsConfig.d.ts" />

namespace CadIndex {

    export let msgValido: string = '';
 

    export function validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    export function validatePhone(phone) {
        const cleaned = phone.replace(/\D/g, "");
        const regex = /^(?:55)?(?:[1-9]{2})(?:9[1-9]\d{3}|\d{4})\d{4}$/;
        return regex.test(cleaned);
    }

    export function normalizarTexto(txt: string): string {
        if (!txt) return "";
        return txt.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();
    }

    export function validateMunicipio(usr_municipio: any): boolean {
        if (usr_municipio === null || usr_municipio === undefined || usr_municipio === '') {
            return false;
        }

        if (municipiosList.length === 0) {
            try {
                var jqxhr = $.getJSON("/Content/js/municipios.json", function (data) {
                    municipiosList = data;
                    console.log('Municípios carregados de forma síncrona com sucesso. Total:', municipiosList.length);
                }).done(function (data) { }).fail(function (_XMLHttpRequest_, textStatus, errorThrown) {
                    consoleError(_XMLHttpRequest_, textStatus, errorThrown)
                    console.error("Erro ao buscar dados dos municípios de forma síncrona:", textStatus, errorThrown);
                }).always(function () { });
            } catch (erro) {
                console.error("Erro ao buscar dados dos municípios de forma síncrona:", erro);
            }
        }

        if (municipiosList.length === 0) {
            // Se falhar o carregamento do arquivo, assumimos true para não travar o cadastro do usuário
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
            const itemNome = normalizarTexto(item.nome || '');
            const itemUf = normalizarTexto(
                item.microrregiao?.mesorregiao?.UF?.sigla ||
                item["regiao-imediata"]?.["regiao-intermediaria"]?.UF?.sigla ||
                ''
            );

            if (inputUf) {
                return itemNome === inputNome && itemUf === inputUf;
            } else {
                return itemNome === inputNome;
            }
        });
    }

    export function formValido() {
        let ret: boolean = true;
        CadIndex.msgValido = '';


        let usr_cpf = $('input[name="usr_cpf"]').val();
        if (usr_cpf !== null && usr_cpf !== '') {
        } else {
            ret = false;
            CadIndex.msgValido += '</br>🔸O campo de CPF deve ser preenchido';
        }

        let usr_nome = $('input[name="usr_nome"]').val();
        if (usr_nome !== null && usr_nome !== '') {
        } else {
            ret = false;
            CadIndex.msgValido += '</br>🔸O campo de Nome deve ser preenchido';
        }

        let usr_email = $('input[name="usr_email"]').val();
        if (usr_email !== null && usr_email !== '') {
            if (CadIndex.validateEmail(usr_email)) {

            } else {
                ret = false;
                CadIndex.msgValido += '</br>🔸O campo de e-Mail deve ser preenchido com um e-Mail válido';
            }
        } else {
            ret = false;
            CadIndex.msgValido += '</br>🔸O campo de e-Mail deve ser preenchido';
        }

        let usr_telefone = $('input[name="usr_telefone"]').val();
        if (usr_telefone !== null && usr_telefone !== '') {
            if (CadIndex.validatePhone(usr_telefone)) { } else {
                ret = false;
                CadIndex.msgValido += '</br>🔸O campo de Telefone deve ser preenchido com um telefone válido';
            }
        } else {
            ret = false;
            CadIndex.msgValido += '</br>🔸O campo de Telefone deve ser preenchido';
        }

        let usr_instituicao = $('input[name="usr_instituicao"]').val();
        if (usr_instituicao !== null && usr_instituicao !== '') {
        } else {
            ret = false;
            CadIndex.msgValido += '</br>🔸O campo de Instituição deve ser preenchido';
        }

        let usr_municipio = $('input[name="usr_municipio"]').val();
        if (usr_municipio !== null && usr_municipio !== '') {
            if (CadIndex.validateMunicipio(usr_municipio)) {
            } else {
                ret = false;
                CadIndex.msgValido += '</br>🔸O Município é inválido, digite o nome do município e selecione na lista';
            }
        } else {
            ret = false;
            CadIndex.msgValido += '</br>🔸O campo de Município deve ser preenchido';
        }

        return ret;
    }

    export function limparForm() {
        $('input[name="usr_num_usuario"]').val('');
        $('input[name="usr_nome"]').val('');
        $('input[name="usr_email"]').val('');
        $('input[name="usr_telefone"]').val('');
        $('input[name="usr_instituicao"]').val('');
        $('input[name="usr_municipio"]').val('');
    }

    export let instituicoesList: Array<{
        EMP_COD: number;
        usr_instituicao: string;
    }> = [];
    let carregandoInstituicoes = false;
    let selectedIndexInstituicao = -1;

    export function carregarInstituicoes() {
        if (instituicoesList.length > 0 || carregandoInstituicoes) return;
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
                console.log('Instituições carregadas com sucesso. Total:', instituicoesList.length);
            }, "json").done(function (data) { }).fail(function (_XMLHttpRequest_, textStatus, errorThrown) { consoleError(_XMLHttpRequest_, textStatus, errorThrown) }).always(function () { });

        } catch (erro) {
            console.error("Erro ao buscar dados das instituições:", erro);
        } finally {
            carregandoInstituicoes = false;
        }
    }


    let municipiosList: any[] = [];
    let carregandoMunicipios = false;
    let selectedIndex = -1;

    export function consoleError(_XMLHttpRequest_: any, textStatus: any, errorThrown: any) {
        console.log("error");
        console.log(_XMLHttpRequest_); console.log(textStatus); console.log(errorThrown);
    }

    export function carregarMunicipios() {
        if (municipiosList.length > 0 || carregandoMunicipios) return;
        carregandoMunicipios = true;
        try {
            var jqxhr = $.getJSON("/Content/js/municipios.json", function (data) {
                municipiosList = data;
                console.log('Municípios carregados com sucesso. Total:', municipiosList.length);
            }).done(function (data) { }).fail(function (_XMLHttpRequest_, textStatus, errorThrown) { consoleError(_XMLHttpRequest_, textStatus, errorThrown) }).always(function () { });

        } catch (erro) {
            console.error("Erro ao buscar dados dos municípios:", erro);
        } finally {
            carregandoMunicipios = false;
        }
    }
    function selecionarInstituicao(valor: string) {
        $('input[name="usr_instituicao"]').val(valor);
        $('#lista-instituicoes').empty().hide();
        selectedIndexInstituicao = -1;
    }
    export function renderizarSugestoesInstituicoes(itens: any[], termoOriginal: string) {
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

            // Destaca os termos correspondentes na sugestão
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
    $(function () {

        carregarInstituicoes();

        carregarMunicipios();

        $('input[name="usr_cpf_mask"]').on('input', function () {
            // Remove all non-numeric characters before saving
            var cleanValue = ($(this).val() as string);
            $('input[name="usr_cpf"]').val(cleanValue)
            console.log("Cleaned:", cleanValue);
        });

        $('input[name="usr_nome"]').on('input', function () {
            let inputElement = this as HTMLInputElement;
            let start = inputElement.selectionStart;
            let end = inputElement.selectionEnd;
            let val = $(inputElement).val() as string;
            $(inputElement).val(val.toUpperCase());
            inputElement.setSelectionRange(start, end);
        });

        $('input[name="usr_instituicao"]').on('input', function () {
            let inputElement = this as HTMLInputElement;
            let start = inputElement.selectionStart;
            let end = inputElement.selectionEnd;
            let val = $(inputElement).val() as string;
            $(inputElement).val(val.toUpperCase());
            inputElement.setSelectionRange(start, end);
            const container = $('#lista-instituicoes');

            const query = normalizarTexto(val.toUpperCase());
            if (query.length < 2) {
                container.empty().hide();
                selectedIndexInstituicao = -1;
                return;
            }

            if (instituicoesList.length === 0) {
                $.when(carregarInstituicoes()).then(function () {
                    $('input[name="usr_instituicao"]').trigger('input');
                });
                return;
            }

            // Filtrar instituições que contêm a query no nome
            const filtrados = instituicoesList.filter(item => {
                const nomeNormalizado = normalizarTexto(item.usr_instituicao || "");
                return nomeNormalizado.indexOf(query) !== -1;
            }).slice(0, 10); // Limita a 10 resultados para melhor performance e UI

            renderizarSugestoesInstituicoes(filtrados, val);
        });
        $('input[name="usr_cpf"]').on('change', function (e) {
            CadIndex.limparForm();
        });
        $('button[name="btnBuscarDadosPorCPF"]').on('click', function (e) {

            let usr_cpf: string = $('input[name="usr_cpf"]').val() as string;
            // substitui qualquer caractere que não seja número pela expressão regular "\D", 
            // que significa "não dígito". O "g" no final significa "global", ou seja, substituir todas as ocorrências.
            usr_cpf = usr_cpf.replace(/\D/g, "");
            var eve_num_evento = $('input[name="eve_num_evento"]').val();
            var que_num_questionario = $('input[name="que_num_questionario"]').val();

            if (usr_cpf.length > 10) {
                var jqxhr = $.post("/Cadastro/GetDadosUsuario", { usr_cpf: usr_cpf, eve_num_evento: eve_num_evento, que_num_questionario: que_num_questionario }, function (data) {
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
                        } else {
                            cpfMascarado = cpf;
                        }


                        // $('input[name="usr_cpf"]').val(usuario.usr_cpf);
                        let usr_municipio: string = '';

                        if (usuario.CID !== null && usuario.CID !== '' && usuario.UF_SIGLA_RESIDEN !== null && usuario.UF_SIGLA_RESIDEN !== '' && usuario.UF_SIGLA_RESIDEN.length > 0) {
                            let cidade = usuario.CID.split(' - ')[0]
                            usr_municipio = `${cidade} - ${usuario.UF_SIGLA_RESIDEN}`;
                        } else if (usuario.CID !== null && usuario.CID !== '') {
                            usr_municipio = usuario.CID;
                        } else if (usuario.UF_SIGLA_RESIDEN !== null && usuario.UF_SIGLA_RESIDEN !== '' && (usuario.CID === null || usuario.CID === ' - ' || usuario.CID === ' - ')) {
                            usr_municipio = '';
                        } else if (usuario.CID === ' - ') {
                            usr_municipio = '';
                        }
                        else if (usuario.UF_SIGLA_RESIDEN === ' - ') {
                            usr_municipio = '';
                        } else {
                            usr_municipio = '';
                        }


                        // Begin: Preenche o campo de CPF mascarado pelas normas da LGPD, mostrando apenas os 6 primeiros dígitos e ocultando os 5 últimos dígitos.
                        let uc: string = ($('input[name="usr_cpf"]').val() as string);
                        var uc2 = uc || "";
                        var cpfClean2 = uc2.replace(/\D/g, "");
                        if (cpfClean2 !== null && cpfClean2 !== '') {
                            let cpfMascarado2: string = "***." + cpfClean2.substring(3, 6) + "." + cpfClean2.substring(6, 9) + "-**";
                            $('input[name="usr_cpf_maskarado"]').val(cpfMascarado2);
                            $('input[name="usr_cpf_maskarado"]').css('display', 'block');
                            $('input[name="usr_cpf_mask"]').css('display', 'none');
                        } else {
                        }
                        // End: Preenche o campo de CPF mascarado pelas normas da LGPD, mostrando apenas os 6 primeiros dígitos e ocultando os 5 últimos dígitos.



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
                            let pontuacao: number = Number(data.pontuacao.toFixed(2));
                            let nota = pontuacao?.toString().replace('.', ',',);

                            // Swal.fire({
                            //     icon: "warning",
                            //     title: "Atenção",
                            //     html: "O Questionário para este evento já foi respondido! <br/> A sua nota é: <span><b>" + pontuacao + '</b></span>',
                            //     footer: '<code>' + primeiroNome + ' - ' + cpfMascarado + '</code>'
                            // });

                            // .. mensagem de nota mínima baseada no 'input[name="que_nota_minima"]' de origem da tabela de questionário
                            let que_nota_minima = Number($('input[name="que_nota_minima"]').val()?.toString().replace(',', '.') ?? '0');
                            let icone: string = ((pontuacao >= que_nota_minima) ? 'success' : "warning");
                            let mensagem: string = (
                                (pontuacao >= que_nota_minima)
                                    ? 'Obrigado pela sua Participação, você teve uma ótima pontuação!'
                                    : 'Obrigado pela sua Participação, você não atingiu a nota mínima!'
                            );
                            // ..

                            // Retorno após salvar a baixa
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
                                } else {
                                    // window.location.href = '/Home/Index';
                                }
                            });

                            $('.btn-eventos').attr('disabled', 'disabled');
                        } else {
                            $('.btn-eventos').removeAttr('disabled');
                        }

                        $('input[name="usr_cpf"]').attr('readonly', 'readonly');

                        // Retorno após salvar a baixa

                    }
                    else {

                        console.log('Nao Entrou no Sucess');

                        // fluxo de erro
                        if (data.tipoErro === "validacao") {
                            Swal.fire({
                                icon: "warning",
                                title: '<span style="color:#045C99;font-size:22px;">Validação</span>',
                                html: '<span style="color:#045C99;font-size:20px;">' + data.msg + '<span>',
                                footer: ScriptsConfig.footerAlert
                            });
                            CadIndex.limparForm();
                        } else if (data.tipoErro === "sistema") {
                            Swal.fire({
                                icon: "error",
                                title: '<span style="color:#045C99;font-size:22px;">Erro de Sistema</span>',
                                html: '<span style="color:#045C99;font-size:20px;">' + data.msg + '<span>',
                                footer: ScriptsConfig.footerAlert
                            });
                        } else {
                            Swal.fire({
                                icon: "info",
                                title: '<span style="color:#045C99;font-size:22px;">Aviso</span>',
                                html: '<span style="color:#045C99;font-size:20px;">' + data.msg + '<span>',
                                footer: ScriptsConfig.footerAlert
                            });
                        }

                        // $('#dados-usuario').css('display', 'block');
                        // $('#botoes').css('display', 'block');
                        // $('.btn-eventos').removeAttr('disabled');
                    }

                }, "json").done(function (data) {
                    console.log("done success");
                    // console.table(data);
                    // console.table(data.lista);
                }).fail(function (_XMLHttpRequest_, textStatus, errorThrown) {
                    console.log("error");
                    console.log(_XMLHttpRequest_); console.log(textStatus); console.log(errorThrown);
                    // ScriptsConfig.failFunctionAjax(_XMLHttpRequest_, textStatus, errorThrown);
                }).always(function () {
                    console.log("finished");
                });
            } else {
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
            } else {
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
                            // Retorno após salvar a baixa
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
                                } else {
                                    window.location.href = '/Home/Index';
                                }
                            });
                        } else {
                            // Retorno caso não seja possivel Salvar a Baixa
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
                                } else if (result.isDenied) {
                                    window.location.href = '/Home/Index';
                                } else {
                                    window.location.href = '/Home/Index';
                                }
                            });
                        }

                        // if (data.sucesso) {
                        //     var dados = data.lista;

                        // } else {
                        //     Swal.fire({
                        //         icon: "error",
                        //         title: "Oops...",
                        //         html: data.msg,
                        //         footer: '<code>' + data.lista + '</code>'
                        //     });
                        //     // $('tbody#tbodyListaMov').empty().html('');
                        // }
                    }, "json")
                        .done(function (data) {
                            console.log("second success");
                            console.table(data);
                            console.table(data.lista);
                        })
                        .fail(function (_XMLHttpRequest_, textStatus, errorThrown) {
                            console.log("error");
                            console.log(_XMLHttpRequest_); console.log(textStatus); console.log(errorThrown);
                            // ScriptsConfig.failFunctionAjax(_XMLHttpRequest_, textStatus, errorThrown);
                        })
                        .always(function () {
                            console.log("finished");
                            $('#botoes').css('display', 'block')
                            //$('.text-end').css('text-align','right !important')
                        });

                } else {

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
                } else {

                }
            });

        });

        // async function carregarMunicipios(): Promise<void> {
        //     if (municipiosList.length > 0 || carregandoMunicipios) return;
        //     carregandoMunicipios = true;
        //     try {
        //         const resposta = await fetch('/Content/js/municipios.json');
        //         if (resposta.ok) {
        //             municipiosList = await resposta.json();
        //             console.log('Municípios carregados com sucesso. Total:', municipiosList.length);
        //         } else {
        //             console.error('Erro HTTP ao buscar municípios:', resposta.statusText);
        //         }
        //     } catch (erro) {
        //         console.error("Erro ao buscar dados dos municípios:", erro);
        //     } finally {
        //         carregandoMunicipios = false;
        //     }
        // }

        // Pré-carrega ao focar no campo
        $('input[name="usr_municipio"]').on('focus', function () {
            carregarMunicipios();
        });

        // Evento de input com filtragem e renderização
        $('input[name="usr_municipio"]').on('input', function () {
            const inputVal = $(this).val() as string;
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

            // Filtrar municípios que contêm a query no nome ou UF
            const filtrados = municipiosList.filter(item => {
                const nomeNormalizado = normalizarTexto(item.nome || "");
                const uf = item.microrregiao?.mesorregiao?.UF?.sigla || item["regiao-imediata"]?.["regiao-intermediaria"]?.UF?.sigla || "";
                const ufNormalizada = normalizarTexto(uf);

                return nomeNormalizado.indexOf(query) !== -1 || ufNormalizada.indexOf(query) !== -1;
            }).slice(0, 10); // Limita a 10 resultados para melhor performance e UI

            renderizarSugestoes(filtrados, inputVal);
        });

        function renderizarSugestoes(itens: any[], termoOriginal: string) {
            const container = $('#lista-municipios');
            container.empty();
            selectedIndex = -1;

            if (itens.length === 0) {
                container.hide();
                return;
            }

            const ul = $('<ul class="list-group position-absolute w-100 shadow-sm" style="z-index: 1050; max-height: 250px; overflow-y: auto; margin-top: 2px; padding: 0;"></ul>');

            itens.forEach((item, index) => {
                const uf = item.microrregiao?.mesorregiao?.UF?.sigla || item["regiao-imediata"]?.["regiao-intermediaria"]?.UF?.sigla || "";
                const textoCompleto = `${item.nome} - ${uf}`.toUpperCase();

                // Destaca os termos correspondentes na sugestão
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

        function selecionarMunicipio(valor: string) {
            $('input[name="usr_municipio"]').val(valor);
            $('#lista-municipios').empty().hide();
            selectedIndex = -1;
        }

        // Navegação por teclado
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
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                selectedIndex = (selectedIndex - 1 + itens.length) % itens.length;
                destacarItem(itens);
            } else if (e.key === 'Enter') {
                if (selectedIndex >= 0 && selectedIndex < itens.length) {
                    e.preventDefault();
                    $(itens[selectedIndex]).trigger('click');
                }
            } else if (e.key === 'Escape') {
                container.empty().hide();
                selectedIndex = -1;
            }
        });

        function destacarItem(itens: any) {
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

                // Rola para o elemento ativo se houver overflow
                const containerUl = item.parent();
                const itemTop = item.position().top;
                const containerScrollTop = containerUl.scrollTop() || 0;
                const containerHeight = containerUl.height() || 0;

                if (itemTop < 0) {
                    containerUl.scrollTop(containerScrollTop + itemTop);
                } else if (itemTop + (item.outerHeight() || 0) > containerHeight) {
                    containerUl.scrollTop(containerScrollTop + itemTop - containerHeight + (item.outerHeight() || 0));
                }
            }
        }

        // Fecha a lista ao clicar fora
        $(document).on('click', function (e) {
            if (!$(e.target).closest('input[name="usr_municipio"], #lista-municipios').length) {
                $('#lista-municipios').empty().hide();
                selectedIndex = -1;
            }
        });

    });
}

declare module "CadIndex" {
    export = CadIndex;
}