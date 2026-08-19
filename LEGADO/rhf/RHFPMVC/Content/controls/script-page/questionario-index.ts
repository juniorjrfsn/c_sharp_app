// File: script-page/questionario-index.ts

/// <reference path="../config-scripts/@types/jquery/index.d.ts" />
/// <reference path="../config-scripts/@types/jquery.form/index.d.ts" />

/// <reference path="../config-scripts/@types/datatables.net/types/types.d.ts" />
/// <reference path="../config-scripts/sweetalert2.d.ts" />
/// <reference path="../config-scripts/config.ts" />
/// <reference path="../config-scripts/ScriptsConfig.d.ts" />

namespace QuestIndex {
    let container;

    function agruparQuestoes(dados) {
        const mapa = {};
        dados.forEach(item => {
            const nu = item.usr_num_usuario;
            const ne = item.eve_num_evento;
            const nq = item.que_num_questionario;
            const q = item.qst_num_questao;
            if (!mapa[q]) {
                mapa[q] = { usr_num_usuario: nu, eve_num_evento: ne, que_num_questionario: nq, enunciado: item.qst_enunciado, num: q, respostas: [] };
            }
            mapa[q].respostas.push({
                num: item.qsr_num_resposta,
                enunciado: item.qsr_enunciado,
                correta: item.qsr_e_correta === 'S'
            });
        });
        return Object.values(mapa);
    }

    function gerarHTML(questoes) {
        console.log('TESTANDO ...');

        container = document.getElementById('questionario');
        container.innerHTML = '';

        questoes.forEach(q => {
            const card = document.createElement('div');
            card.className = 'card border-light';

            const header = document.createElement('div');
            header.className = 'card-header text-white';
            header.style = 'background-color: #337ab7;border-radius: 8px;font-family: sans-serif; font-weight: 800;';
            header.innerHTML = `
            <h4><b id="Quest[${q.num}][qst_enunciado]">${q.enunciado}</b></h4>
            <input type="hidden" name="Quest[${q.num}][0][qst_num_questao]"
                   id="Quest[${q.num}][qst_num_questao]" value="${q.num}">`;

            const body = document.createElement('div');
            body.className = 'card-body border-light';
            body.style = 'background-color: #fefefe;border-radius: 8px;';

            const ul = document.createElement('ul');
            ul.className = 'list-group list-group-flush';

            q.respostas.forEach(r => {
                const li = document.createElement('li');
                li.className = 'list-group-item';
                const cbId = `Quest[${q.num}][${r.num}][qsr_num_resposta]`;
                li.innerHTML = `
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" value="${r.num}"
                        name="${cbId}" id="${cbId}">
                    <label class="form-check-label" for="${cbId}"
                        id="Quest[${q.num}][${r.num}][qsr_enunciado]">
                        ${r.enunciado}
                    </label>
                </div>`;
                ul.appendChild(li);
            });

            body.appendChild(ul);
            card.appendChild(header);
            card.appendChild(body);
            container.appendChild(card);
        });

        // ============================================================
        // CAPTCHA COMO ÚLTIMA "PERGUNTA" - SEM BOTÃO VERIFICAR
        // ============================================================
        const cardCaptcha: any = document.createElement('div');
        cardCaptcha.className = 'card border-light';
        cardCaptcha.id = 'cardCaptcha';

        const headerCaptcha: any = document.createElement('div');
        headerCaptcha.className = 'card-header text-white';
        headerCaptcha.style = 'background-color: #337ab7;border-radius: 8px;';
        headerCaptcha.innerHTML = `
        <h4 style="font-family: sans-serif; font-weight: 800;"><b><i class="fa-solid fa-shield-halved"></i> Verificação de Segurança</b></h4>
        <input type="hidden" name="captcha_validado" id="captcha_validado" value="0">`;

        const bodyCaptcha: any = document.createElement('div');
        bodyCaptcha.className = 'card-body border-light';
        bodyCaptcha.style = 'background-color: #fefefe;border-radius: 8px; padding: 25px 20px;';

        // Texto explicativo
        const textoCaptcha: any = document.createElement('p');
        textoCaptcha.style = 'color: #6c757d; margin-bottom: 20px; text-align: center; font-size: 14px;';
        textoCaptcha.textContent = 'Resolva a conta abaixo para confirmar que você não é um robô:';
        bodyCaptcha.appendChild(textoCaptcha);

        // Container principal do CAPTCHA
        const containerCaptcha: any = document.createElement('div');
        containerCaptcha.style = `
        display: inline-flex;
        align-items: center;
        background-color: #f8f9fa;
        border: 1.5px solid #dee2e6;
        border-radius: 12px;
        padding: 12px 20px;
        gap: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    `;

        // Soma (texto)
        const caixaSoma: any = document.createElement('span');
        caixaSoma.id = 'captchaPergunta';
        caixaSoma.style = `
        font-size: 20px;
        font-weight: 600;
        color: #495057;
        letter-spacing: 1px;
    `;

        // Separador 1
        const separador1: any = document.createElement('div');
        separador1.style = 'width: 1px; height: 28px; background-color: #dee2e6;';

        // Input de resposta
        const inputResposta: any = document.createElement('input');
        inputResposta.type = 'number';
        inputResposta.id = 'captchaResposta';
        inputResposta.name = 'captchaResposta';
        inputResposta.style = `
        width: 60px;
        font-size: 18px;
        font-weight: 600;
        text-align: center;
        border: 1.5px solid #ced4da;
        border-radius: 6px;
        padding: 6px 8px;
        background-color: #ffffff;
        color: #212529;
        outline: none;
        transition: all 0.2s ease;
    `;
        inputResposta.placeholder = '?';
        inputResposta.autocomplete = 'off';
        inputResposta.onfocus = function () {
            this.style.borderColor = '#337ab7';
            this.style.boxShadow = '0 0 0 2px rgba(51, 122, 183, 0.15)';
        };
        inputResposta.onblur = function () {
            this.style.borderColor = '#ced4da';
            this.style.boxShadow = 'none';
        };

        // Separador 2
        const separador2: any = document.createElement('div');
        separador2.style = 'width: 1px; height: 28px; background-color: #dee2e6;';

        // Botão REFRESH (único botão)
        const btnRefresh: any = document.createElement('button');
        btnRefresh.type = 'button';
        btnRefresh.id = 'btnRefreshCaptcha';
        btnRefresh.title = 'Gerar nova conta';
        btnRefresh.style = `
        background: transparent;
        border: 1px solid #ced4da;
        font-size: 14px;
        color: #6c757d;
        cursor: pointer;
        padding: 6px 10px;
        border-radius: 6px;
        transition: all 0.2s ease;
    `;
        btnRefresh.innerHTML = '<i class="fa-solid fa-rotate"></i>';
        btnRefresh.onmouseover = function () {
            this.style.backgroundColor = '#e9ecef';
            this.style.color = '#337ab7';
        };
        btnRefresh.onmouseout = function () {
            this.style.backgroundColor = 'transparent';
            this.style.color = '#6c757d';
        };

        containerCaptcha.appendChild(caixaSoma);
        containerCaptcha.appendChild(separador1);
        containerCaptcha.appendChild(inputResposta);
        containerCaptcha.appendChild(separador2);
        containerCaptcha.appendChild(btnRefresh);

        // Wrapper para centralizar
        const wrapperCaptcha = document.createElement('div');
        wrapperCaptcha.style = 'text-align: center; margin-bottom: 18px;';
        wrapperCaptcha.appendChild(containerCaptcha);
        bodyCaptcha.appendChild(wrapperCaptcha);

        // Timer
        const divTimer = document.createElement('div');
        divTimer.style = 'text-align: center; margin-bottom: 15px;';
        const timerInterno = document.createElement('div');
        timerInterno.id = 'captchaTimerDisplay';
        timerInterno.style = 'display: inline-block; padding: 8px 16px; border-radius: 6px; font-weight: 500; font-size: 13px; background-color: #d4edda; color: #155724;';
        timerInterno.innerHTML = '<i class="fa-regular fa-clock"></i> Tempo restante: <span id="captchaTempo">30</span>s';
        divTimer.appendChild(timerInterno);
        bodyCaptcha.appendChild(divTimer);

        // Mensagem de erro/aviso
        const divMensagem = document.createElement('div');
        divMensagem.id = 'captchaMensagem';
        divMensagem.className = 'alert';
        divMensagem.style = 'margin-top: 12px; display: none; text-align: center; font-size: 14px; padding: 10px;';
        bodyCaptcha.appendChild(divMensagem);

        cardCaptcha.appendChild(headerCaptcha);
        cardCaptcha.appendChild(bodyCaptcha);
        container.appendChild(cardCaptcha);

        // Inicia o CAPTCHA
        iniciarCaptchaQuestionario();
    }

    // ============================================================
    // VARIÁVEIS GLOBAIS DO CAPTCHA
    // ============================================================
    var captchaNum1 = 0;
    var captchaNum2 = 0;
    var captchaTimerInterval: any = null;
    const TEMPO_CAPTCHA = 120;

    // ============================================================
    // GERA NOVA SOMA
    // ============================================================
    function gerarNovaSomaCaptcha() {
        captchaNum1 = Math.floor(Math.random() * 9) + 1;
        captchaNum2 = Math.floor(Math.random() * 9) + 1;

        const elPergunta: any = document.getElementById('captchaPergunta');
        if (elPergunta) {
            elPergunta.textContent = captchaNum1 + ' + ' + captchaNum2 + ' = ?';
        }

        const elResposta: any = document.getElementById('captchaResposta');
        if (elResposta) {
            elResposta.value = '';
            elResposta.disabled = false;
            elResposta.style.borderColor = '#ced4da';
            elResposta.style.backgroundColor = '#ffffff';
        }

        const elMensagem = document.getElementById('captchaMensagem');
        if (elMensagem) elMensagem.style.display = 'none';

        iniciarTimerCaptcha();
    }

    // ============================================================
    // INICIA TIMER
    // ============================================================
    function iniciarTimerCaptcha() {
        let tempo = TEMPO_CAPTCHA;
        const elTempo: any = document.getElementById('captchaTempo');
        const elTimer: any = document.getElementById('captchaTimerDisplay');

        if (elTempo) elTempo.textContent = tempo;
        if (elTimer) {
            elTimer.style.display = 'inline-block';
            elTimer.style.backgroundColor = '#d4edda';
            elTimer.style.color = '#155724';
        }

        clearInterval(captchaTimerInterval);

        captchaTimerInterval = setInterval(function () {
            tempo--;
            if (elTempo) elTempo.textContent = tempo;

            if (elTimer) {
                if (tempo <= 10) {
                    elTimer.style.backgroundColor = '#f8d7da';
                    elTimer.style.color = '#721c24';
                } else if (tempo <= 20) {
                    elTimer.style.backgroundColor = '#fff3cd';
                    elTimer.style.color = '#856404';
                } else {
                    elTimer.style.backgroundColor = '#d4edda';
                    elTimer.style.color = '#155724';
                }
            }

            if (tempo <= 0) {
                expirarCaptcha();
            }
        }, 1000);
    }

    // ============================================================
    // PARA TIMER
    // ============================================================
    function pararTimerCaptcha() {
        clearInterval(captchaTimerInterval);
        const elTimer = document.getElementById('captchaTimerDisplay');
        if (elTimer) elTimer.style.display = 'none';
    }

    // ============================================================
    // EXPIRA CAPTCHA
    // ============================================================
    function expirarCaptcha() {
        pararTimerCaptcha();

        const elMensagem: any = document.getElementById('captchaMensagem');
        const elResposta: any = document.getElementById('captchaResposta');

        if (elMensagem) {
            elMensagem.innerHTML = '<i class="fa-solid fa-clock"></i> ⏰ Tempo esgotado! Nova conta gerada.';
            elMensagem.style.display = 'block';
            elMensagem.style.backgroundColor = '#fff3cd';
            elMensagem.style.color = '#856404';
        }
        if (elResposta) elResposta.value = '';

        setTimeout(function () {
            gerarNovaSomaCaptcha();
        }, 1500);
    }

    // ============================================================
    // VALIDA CAPTCHA (chamado no botão Salvar)
    // ============================================================
    function validarCaptchaQuestionario() {
        const elResposta: any = document.getElementById('captchaResposta');
        const elMensagem: any = document.getElementById('captchaMensagem');
        const elValidado: any = document.getElementById('captcha_validado');

        const resposta = parseInt(elResposta.value);
        const resultadoCorreto = captchaNum1 + captchaNum2;

        if (isNaN(resposta) || elResposta.value.trim() === '') {
            if (elMensagem) {
                elMensagem.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> ⚠️ Por favor, resolva a conta de segurança antes de salvar.';
                elMensagem.style.display = 'block';
                elMensagem.style.backgroundColor = '#fff3cd';
                elMensagem.style.color = '#856404';
            }
            elResposta.focus();

            // Scroll até o CAPTCHA
            const cardCaptcha = document.getElementById('cardCaptcha');
            if (cardCaptcha) {
                cardCaptcha.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }

            return false;
        }

        if (resposta !== resultadoCorreto) {
            if (elMensagem) {
                elMensagem.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> ❌ Resposta incorreta! O resultado correto era ${resultadoCorreto}. Por favor, tente novamente.`;
                elMensagem.style.display = 'block';
                elMensagem.style.backgroundColor = '#f8d7da';
                elMensagem.style.color = '#721c24';
            }

            // Gera nova soma
            setTimeout(function () {
                gerarNovaSomaCaptcha();
                elResposta.focus();
            }, 1000);

            // Scroll até o CAPTCHA
            const cardCaptcha = document.getElementById('cardCaptcha');
            if (cardCaptcha) {
                cardCaptcha.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }

            return false;
        }

        // ACERTOU!
        pararTimerCaptcha();
        if (elMensagem) {
            elMensagem.innerHTML = '<i class="fa-solid fa-circle-check"></i> ✅ Verificação concluída com sucesso!';
            elMensagem.style.display = 'block';
            elMensagem.style.backgroundColor = '#d4edda';
            elMensagem.style.color = '#155724';
        }

        // Input fica verde
        elResposta.style.borderColor = '#28a745';
        elResposta.style.backgroundColor = '#d4edda';
        elResposta.disabled = true;

        if (elValidado) elValidado.value = '1';

        return true;
    }

    // ============================================================
    // INICIA CAPTCHA
    // ============================================================
    function iniciarCaptchaQuestionario() {
        gerarNovaSomaCaptcha();

        // Botão REFRESH
        const btnRefresh = document.getElementById('btnRefreshCaptcha');
        if (btnRefresh) {
            btnRefresh.addEventListener('click', function () {
                gerarNovaSomaCaptcha();
                const elMensagem = document.getElementById('captchaMensagem');
                if (elMensagem) elMensagem.style.display = 'none';
                const elResposta = document.getElementById('captchaResposta');
                if (elResposta) elResposta.focus();
            });
        }

        // Enter no input (opcional - pode remover se quiser)
        const elResposta = document.getElementById('captchaResposta');
        if (elResposta) {
            elResposta.addEventListener('keypress', function (e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    // Apenas move o foco, não valida
                    this.blur();
                }
            });
        }
    }


    function carregarQuestionario() {
        console.log('Carregando o questionário');
        let usr_cpf: string = $('input[name="usr_cpf"]').val() as string;

        usr_cpf = usr_cpf.replace(/\D/g, "");
        var eve_num_evento = $('input[name="eve_num_evento"]').val();
        var que_num_questionario = $('input[name="que_num_questionario"]').val();


        console.log('usr_cpf : ' + usr_cpf);
        console.log('eve_num_evento : ' + eve_num_evento);
        console.log('que_num_questionario : ' + que_num_questionario);

        if (usr_cpf !== undefined && usr_cpf !== null && usr_cpf.length > 6) {

        } else {
            ScriptsConfig.swalconfirmeActionAlerta.fire({
                title: 'Atenção',
                html: 'Você precisa Selecionar o Questionário?',
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
                    window.location.href = '/Home/Index';
                } else {
                    window.location.href = '/Home/Index';
                }
            });
        }

        var jqxhr = $.post("/Questionario/ObterQuestionario", { usr_cpf: usr_cpf, eve_num_evento: eve_num_evento, que_num_questionario: que_num_questionario }, function (data) {
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
                                html: '<span style="color:#045C99;font-size:20px;">Não há questionário disponível para ser respondido</b></span>'
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
                            gerarHTML(agruparQuestoes(dados));

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
                            html: '<span style="color:#045C99;font-size:20px;">Não há eventos nem questionários disponíveis para serem respondidos</b></span>',
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

        // $.ajax({
        //     url: '/Questionario/ObterQuestionario', data: {}, /*{ jsonInput: JSON.stringify(dadosForm) }*/ type: 'post', dataType: 'json', cache: true, async: true,
        //     statusCode: { 302: function () { console.log('302 Found'); }, 403: function () { console.log('forbidden'); }, 404: function () { console.log('page not found'); }, 415: function () { console.log('Unsupported Media Type'); }, 405: function () { console.log('method not allowed'); }, 500: function () { console.log('internal server error'); }, 502: function () { console.log('Bad Gateway'); } },
        //     success: function (json, textStatus, jqXHR) {
        //         console.table(json.lista);

        //         if (json.sucesso) {
        //             var dados = json.lista;
        //             gerarHTML(agruparQuestoes(dados));
        //         } else {
        //             // $('tbody#tbodyListaMov').empty().html('');
        //         }
        //     },
        //     error: function (_XMLHttpRequest_, textStatus, errorThrown) {
        //         // Handle errors, including mixed content
        //         if (_XMLHttpRequest_.status === 0 || _XMLHttpRequest_.statusText === 'abort') {
        //             console.log('Request aborted by the user.');
        //         } else if (_XMLHttpRequest_.status === 419) { // Check for mixed content error
        //             console.error('Mixed Content Error: Your request is trying to access an insecure resource (http://) while your page is loaded over HTTPS. Update the target URL to use HTTPS.');
        //             Swal.fire({
        //                 icon: "error",
        //                 title: "Oops...",
        //                 html: '<b>Mixed Content Error</b><br>Please ensure the target URL uses HTTPS.',
        //                 footer: '<code>' + textStatus + '</code>'
        //             });
        //         } else {
        //             console.error('Unexpected error:', textStatus, errorThrown);
        //             Swal.fire({
        //                 icon: "error",
        //                 title: "Oops...",
        //                 html: errorThrown,
        //                 footer: '<code>' + textStatus + '</code>'
        //             });
        //         }
        //     }, beforeSend: function (jqXHR) { },
        //     complete: function (XMLHttpRequest, textStatus) { $('button[name="btnBuscarMovimentos"]').removeAttr('disabled'); }
        // }).done(function () { }).fail(function (_XMLHttpRequest_, textStatus, errorThrown) {
        //     console.log(_XMLHttpRequest_); console.log(textStatus); console.log(errorThrown);
        //     // Swal.fire({ icon: "error", title: "Oops...", html: _XMLHttpRequest_, footer: '<code>' + textStatus + '</code>' });
        //     ScriptsConfig.failFunctionAjax(_XMLHttpRequest_, textStatus, errorThrown);
        // }).always(function () { });

    }

    function validarQuestionario() {
        // Seleciona todos os checkboxes dentro do container do questionário
        const checkboxes = document.querySelectorAll('#questionario input[type="checkbox"]') as NodeListOf<HTMLInputElement>;
        // Objeto para agrupar o status de marcação por número de questão
        // Estrutura esperada: { "1": false, "2": false, ... }
        const questoes = {};
        checkboxes.forEach(cb => {
            // Expressão regular para extrair o primeiro número do name (ex: Quest[4][2][...] -> 4)
            const match = cb.name.match(/Quest\[(\d+)\]/);
            if (match) {
                const qstNum = match[1];
                // Se a questão ainda não foi mapeada, inicializa como false
                if (!(qstNum in questoes)) {
                    questoes[qstNum] = false;
                }
                // Se este checkbox estiver marcado, define o grupo como verdadeiro
                if (cb.checked) {
                    questoes[qstNum] = true;
                }
            }
        });
        // Transforma os valores do objeto em uma lista (ex: [true, true, false])
        const statusQuestoes = Object.values(questoes);
        // Se não encontrou nenhuma questão mapeada no HTML, retorna false
        if (statusQuestoes.length === 0) {
            return false;
        }
        // Retorna true apenas se TODOS os grupos tiverem pelo menos um checkbox marcado (true)
        return statusQuestoes.every(respondida => respondida === true);
    }

    export function salvarQuestionario() {
        var dadosFormFiltro = $('form[name="formQuestionario"]').serialize();
        console.log(dadosFormFiltro);
        $('button[name="btnSalvar"]').attr('disabled', 'disabled');
        $.ajax({
            url: '/Questionario/SalvarQuestionario',
            data: dadosFormFiltro,
            type: 'post',
            dataType: 'json',
            cache: true,
            async: true,
            statusCode: {
                302: function () { console.log('302 Found'); },
                403: function () { console.log('forbidden'); },
                404: function () { console.log('page not found'); },
                415: function () { console.log('Unsupported Media Type'); },
                405: function () { console.log('method not allowed'); },
                500: function () { console.log('internal server error'); },
                502: function () { console.log('Bad Gateway'); }
            },
            beforeSend: function (jqXHR) {
                // --- ALERTA CRIATIVO DE CARREGAMENTO ---
                Swal.fire({
                    title: '<strong style="color:#045C99;">Salvando Questionário</strong>',
                    html: `
                    <div style="text-align: left; font-size: 15px; color: #555; line-height: 1.6;">
                    <p>📝 <b>Enviando suas respostas...</b></p>
                    <p>💾 Salvando dados na base.</p>
                    <p>🏆 <b>Calculando sua pontuação final.</b></p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 10px 0;">
                    <small style="color: #888;"><i>⏳ O tempo de processamento pode variar de acordo com a velocidade da sua conexão com a internet. Por favor, não feche esta janela!</i></small>
                    </div>
                `,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showConfirmButton: false,
                    didOpen: () => {
                        Swal.showLoading();
                        // Personaliza a cor do spinner para combinar com o seu sistema (#045C99)
                        const loader = Swal.getPopup().querySelector('.swal2-loader') as HTMLElement;
                        if (loader) {
                            loader.style.color = '#045C99';
                            loader.style.borderRightColor = 'transparent';
                        }
                    }
                });
            },
            success: function (json, textStatus, jqXHR) {
                Swal.close(); // Fecha o alerta de carregamento antes de abrir o próximo
                console.table(json.lista);

                if (json.sucesso) {
                    let pontuacao: number = Number(json.pontuacao.toFixed(2));
                    let nota = pontuacao?.toString().replace('.', ',',);



                    let usr_nome: string = $('input[name="usr_nome"]').val() as string;
                    var primeiroNome = (usr_nome || "").trim().split(" ")[0];

                    let usr_cpf: string = $('input[name="usr_cpf"]').val() as string;
                    usr_cpf = usr_cpf.replace(/\D/g, "");
                    var cpf = usr_cpf || "";
                    var cpfMascarado = "";
                    if (cpf.length === 11) {
                        cpfMascarado = "***." + cpf.substring(3, 6) + "." + cpf.substring(6, 9) + "-**";
                    } else {
                        cpfMascarado = cpf;
                    }

                    // .. mensagem de nota mínima baseada no 'input[name="que_nota_minima"]' de origem da tabela de questionário
                    let que_nota_minima = Number($('input[name="que_nota_minima"]').val()?.toString().replace(',', '.') ?? '0');
                    let icone: string = ((Number(json.pontuacao) >= que_nota_minima) ? 'success' : "warning");
                    let mensagem: string = (
                        (Number(json.pontuacao) >= que_nota_minima)
                            ? 'Obrigado pela sua Participação, você teve uma ótima pontuação!'
                            : 'Obrigado pela sua Participação, você não atingiu a nota mínima!'
                    );
                    // ..

                    ScriptsConfig.swalWithBootstrapButtons.fire({
                        icon: icone,
                        title: '<code style="color:#045C99;font-size:22px;">' + primeiroNome + ' - ' + cpfMascarado + '</code><br>'
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
                } else {
                    ScriptsConfig.swalconfirmeActionAlerta.fire({
                        title: 'Erro',
                        html: "Não foi possível efetuar o Cadastro!",
                        icon: "warning",
                        showCancelButton: false,
                        showDenyButton: true,
                        confirmButtonText: "Atualizar Pággina",
                        denyButtonText: 'Voltar para Página Anterior',
                        cancelButtonText: "No, cancel!",
                        reverseButtons: true,
                        footer: ScriptsConfig.footerAlert
                    }).then((result) => {
                        if (result.isConfirmed) {
                            // window.location.reload();
                        } else if (result.isDenied) {
                            // window.location.href = '/Home/Index';
                        } else {
                            //  window.location.href = '/Home/Index';
                        }
                    });
                }
            },
            error: function (_XMLHttpRequest_, textStatus, errorThrown) {
                Swal.close(); // Fecha o alerta de carregamento em caso de erro

                if (_XMLHttpRequest_.status === 0 || _XMLHttpRequest_.statusText === 'abort') {
                    console.log('Request aborted by the user.');
                } else if (_XMLHttpRequest_.status === 419) {
                    console.error('Mixed Content Error: Your request is trying to access an insecure resource (http://) while your page is loaded over HTTPS. Update the target URL to use HTTPS.');
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        html: '<b>Mixed Content Error</b><br>Please ensure the target URL uses HTTPS.',
                        footer: '<code>' + textStatus + '</code>'
                    });
                } else {
                    console.error('Unexpected error:', textStatus, errorThrown);
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        html: errorThrown,
                        footer: '<code>' + textStatus + '</code>'
                    });
                }
            },
            complete: function (XMLHttpRequest, textStatus) {
                // Dica: Você desabilitou o 'btnSalvar' no início, mas está habilitando o 'btnBuscarMovimentos' aqui.
                // Se a intenção era habilitar o botão de salvar de volta, altere para 'btnSalvar'.
                $('button[name="btnSalvar"]').removeAttr('disabled');
            }
        }).done(function () { }).fail(function (_XMLHttpRequest_, textStatus, errorThrown) {
            console.log(_XMLHttpRequest_); console.log(textStatus); console.log(errorThrown);
            ScriptsConfig.failFunctionAjax(_XMLHttpRequest_, textStatus, errorThrown);
        }).always(function () { });
    }

    $(function () {


        // var dadosFormFiltro = $('form[name="formQuestionario"]').serialize() + '&selectTake=' + $('select[name="selectTake"] option:selected').val();
        // console.log(dadosFormFiltro);

        // Chamada principal

        setTimeout(() => {
            console.log("This prints after 2 seconds!");
            carregarQuestionario();
        }, 200);

        $('h4[id="cab_eve_descricao"]').on('click', function () {

            let cab_eve_nome: string = $('h3[id="cab_eve_nome"]').text()?.toString() ?? '';
            let cab_eve_descricao_hidden: string = $('input[name="cab_eve_descricao_hidden"]').text()?.toString() ?? '';
            ScriptsConfig.swalconfirmeActionAlerta.fire({
                title: '<span style="color:#045C99;font-size:22px;">Sobre o Evento</br>' + cab_eve_nome + '</span>',
                html: '<span style="color:#045C99;font-size:20px;">' + cab_eve_descricao_hidden + '</span>',
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
        });

        $('button[name="btnSalvar"]').on('click', function () {

            // ============================================================
            // 1ª VALIDAÇÃO: CAPTCHA
            // ============================================================
            let captchaValido = validarCaptchaQuestionario();
            if (!captchaValido) {
                // Mostra SweetAlert reforçando que precisa resolver o CAPTCHA
                ScriptsConfig.swalconfirmeActionAlerta.fire({
                    title: '<span style="color:#045C99;font-size:22px;font-family: sans-serif; font-weight: 800;">Verificação de Segurança</span>',
                    html: '<span style="color:#045C99;font-size:18px;">Por favor, resolva a conta de segurança antes de salvar o questionário!</span>',
                    icon: "warning",
                    showConfirmButton: true,
                    showCancelButton: false,
                    showDenyButton: false,
                    confirmButtonText: '<i class="fa-solid fa-check"></i> Ok, entendi',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    backdrop: true,
                    footer: ScriptsConfig.footerAlert
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Rola até o CAPTCHA para o usuário ver
                        const cardCaptcha = document.getElementById('cardCaptcha');
                        if (cardCaptcha) {
                            cardCaptcha.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            // Foca no input do CAPTCHA
                            setTimeout(() => {
                                const inputCaptcha = document.getElementById('captchaResposta');
                                if (inputCaptcha) inputCaptcha.focus();
                            }, 500);
                        }
                    }
                });
                return false; // Para aqui, não continua
            }

            // ============================================================
            // 2ª VALIDAÇÃO: QUESTIONÁRIO (respostas das perguntas)
            // ============================================================
            let formularioValido = validarQuestionario();
            if (formularioValido) {
                ScriptsConfig.swalconfirmeActionAlerta.fire({
                    title: '<span style="color:#045C99;font-size:22px;">Atenção!</span>',
                    html: '<span style="color:#045C99;font-size:20px;">Deseja Salvar o Questionário?<span>',
                    icon: "warning",
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
                        $('button[name="btnSalvar"]').attr('disabled', 'disabled');
                        QuestIndex.salvarQuestionario();
                        // QuestIndex.salvarQuestionario();
                    } else {
                    }
                });

            } else {
                ScriptsConfig.swalconfirmeActionAlerta.fire({
                    title: '<span style="color:#045C99;font-size:22px;">Atenção!</span>',
                    html: '<span style="color:#045C99;font-size:20px;">O Questionário precisa de pelo menos uma resposta para cada questão!</span>',
                    icon: "warning",
                    showConfirmButton: true,
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

        });

        $('button[name="btnCancelar"]').on('click', function () {

            ScriptsConfig.swalconfirmeActionAlerta.fire({
                title: '<span style="color:#045C99;font-size:22px;">Atenção!</span>',
                html: '<span style="color:#045C99;font-size:20px;">Deseja cancelar o Questionário?</span>',
                icon: "warning",
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

                    window.location.href = '/Home/Index';

                } else {

                }
            });

        });
        
        $('button[name="finalizar"]').on('click', function () {

            let json = { "sucesso": true, "msg": "Salvo com sucesso!" };


            ScriptsConfig.swalconfirmeActionAlerta.fire({
                title: 'Atenção',
                html: 'Após efetuar o cadastroo não será possível alterar! <br /> Deseja continuar?',
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

                    if (json.sucesso) {
                        // Retorno após salvar a baixa
                        ScriptsConfig.swalWithBootstrapButtons.fire({
                            title: 'Registro',
                            html: json.msg,
                            icon: "success",
                            showCancelButton: false,
                            confirmButtonText: "Ok",
                            cancelButtonText: "No, cancel!",
                            reverseButtons: true
                        }).then((result) => {
                            if (result.isConfirmed) {
                                // window.location.href = '/PrecatorioMovimentoBaixa/Index';
                            } else {
                                // window.location.href = '/PrecatorioMovimentoBaixa/Index';
                            }
                        });
                    } else {
                        // Retorno caso não seja possivel Salvar a Baixa
                        ScriptsConfig.swalconfirmeActionAlerta.fire({
                            title: 'Erro',
                            html: json.msg,
                            icon: "warning",
                            showCancelButton: false,
                            showDenyButton: true,
                            confirmButtonText: "Atualizar Pággina",
                            denyButtonText: 'Voltar para Página Anterior',
                            cancelButtonText: "No, cancel!",
                            reverseButtons: true, footer: ScriptsConfig.footerAlert
                        }).then((result) => {
                            if (result.isConfirmed) {
                                // window.location.reload();
                            } else if (result.isDenied) {
                                // window.location.href = '/PrecatorioMovimentoBaixa/Index';
                            } else {
                                // window.location.href = '/PrecatorioMovimentoBaixa/Index';
                            }
                        });
                    }

                } else {

                }
            });




        });
    });
}

declare module "QuestIndex" {
    export = QuestIndex;
}