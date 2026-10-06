// File: script-page/financeiro-relatorio.ts

/// <reference path="../config-scripts/@types/jquery/index.d.ts" />
/// <reference path="../config-scripts/@types/jquery.form/index.d.ts" />

/// <reference path="../config-scripts/@types/datatables.net/types/types.d.ts" />
/// <reference path="../config-scripts/sweetalert2.d.ts" />
/// <reference path="../config-scripts/config.ts" />
/// <reference path="../config-scripts/ScriptsConfig.d.ts" />
/// <reference path="../config-scripts/highcharts.d.ts" />
/// <reference path="../config-scripts/inputmask.d.ts" />

// Declare Inputmask globally (from CDN or local library)
declare var Inputmask: any;




namespace FinRel {
    export let tempo: number = Date.now();

    export let validoFiltro: boolean = true;
    export let msgFiltro: string = '';

    export let tiposCargo: Array<{ id: number; cargo: string; }> = [
        { id: 1, cargo: 'Cargo Efetivo' },
        { id: 2, cargo: 'Cargo Acumulado (2º efetivo)' },
        { id: 3, cargo: 'Cargo em Comissão' },
        { id: 4, cargo: 'Função Gratificada' }
    ];

    let municipiosList: any[] = [];
    let carregandoMunicipios = false;
    let selectedIndex = -1;



    export let container;

    export let eventosDtos: Array<{
        eve_num_evento: any;
        eve_nome: any;
        eve_descricao: any;
        eve_local: any;
        eve_municipio: any;
        eve_dt_inicio: any;
        eve_dt_fim: any;
        eve_dt_inclusao: any;
        eve_situacao: any;
        que_num_questionario: any;
        que_contexto: any;
        que_publico_alvo: any;
        que_nota_minima: any;
        que_dt_inclusao: any;
        que_situacao: any;
    }> = [];

    export let questionariosDtos: Array<{
        tempo: string;
        eve_num_evento: any;
        que_num_questionario: any;
        que_contexto: any;
        que_publico_alvo: any;
        que_nota_minima: any;
        que_dt_inclusao: any;
        que_situacao: any;
    }> = [];

    export let dataTableInstance: any | null = null;

    export let dataTableInstanceEveQuestion: any | null = null;

    export let _ano: string = '0';
    export let _mes: string = '0';

    export let eve_num_evento: number = 0;

    export let que_num_questionario: number = 0;

    export let veioDeResultadoUnico: boolean = false;


    export let listaFinanceiro: Array<{
        tempo: number;
        dpe_cpf_servidor: string;
        dpe_nome_servidor: string;
        dpe_matricula: number;
        dfu_tp_cargo: number;
        dfu_desc_tp_cargo: string;
        fin_competencia_ano_mes: string;
        rub_codigo: number;
        rub_descricao: string;
        fin_dt_inicio: string;
        fin_valor: number;
        fin_perc_pontos_dia_hora: number;
        fin_qtd_urv: number;
        PROVENTO: number;
        DESCONTO: number;
        TOTAL_PROVENTO: number;
        TOTAL_DESCONTO: number;
        LIQUIDO: number;
    }> = [];

    export function carregarIndices() { }

    export function exibirLoadingConsulta(titulo: string, mensagem: string) {        
        Swal.fire({
            title: `<strong style="color:#045C99;">${titulo}</strong>`,
            html: `
                    <div style="text-align: left; font-size: 15px; color: #555; line-height: 1.6;">
                    <p>🔎 <b>Enviando consulta...</b></p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 10px 0;">
                    <small style="color: #888;"><i>⏳ ${mensagem}</i></small>
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
    }

    // ============== SEGURADOS - Datatable Functions ==============

    export function validarFiltroSegurado(): boolean {
        FinRel.validoFiltro = true;
        FinRel.msgFiltro = '';
        const matricula: string = (($('#matricula').val() as string) || '').trim();
        const nome: string = (($('#per_nome').val() as string) || '').trim();
        const cpfNumeros: string = (($('#cpf_busca').val() as string) || '').replace(/\D/g, '');

        const erros: string[] = [];

        // Matrícula: apenas números e maior que 0
        if (matricula.length > 0) {
            if (!/^\d+$/.test(matricula)) {
                erros.push('A matrícula deve conter apenas números.');
            } else if (parseInt(matricula, 10) <= 0) {
                erros.push('A matrícula deve ser maior que zero.');
            }
        }

        // Nome: mínimo de 3 caracteres
        if (nome.length > 0 && nome.length < 3) {
            erros.push(`Nome incompleto: faltam ${3 - nome.length} letra(s) para a busca (mínimo 3).`);
        }

        // CPF: exatamente 11 dígitos
        if (cpfNumeros.length > 0 && cpfNumeros.length < 11) {
            erros.push(`CPF incompleto: faltam ${11 - cpfNumeros.length} dígito(s).`);
        }

        const nenhumPreenchido = matricula.length === 0 && nome.length === 0 && cpfNumeros.length === 0;

        if (nenhumPreenchido) {
            FinRel.validoFiltro = false;
            FinRel.msgFiltro += 'Por favor, informe pelo menos um critério de busca (Matrícula, Nome ou CPF).';
        } else if (erros.length > 0) {
            FinRel.validoFiltro = false;
            FinRel.msgFiltro += erros.join('\n');
        } else {
            FinRel.validoFiltro = true;
            FinRel.msgFiltro = '';
        }

        return FinRel.validoFiltro; // mantive o retorno original: true = filtro inválido
    }

    /**
     * Realiza a consulta de segurados por matrícula, nome ou CPF
     */
    export function GetListaSegurados() {
        const matricula = $('#matricula').val() || '';
        const nome = $('#per_nome').val() || '';
        const cpf = $('#cpf_busca').val() || '';

        const dtIni = $('#per_dt_ini').val() || '';
        const dtFim = $('#per_dt_fim').val() || '';

        console.log(`Consultando : `, matricula, nome, cpf);
        if (validarFiltroSegurado()) { } else {
            Swal.fire({
                icon: 'warning',
                title: 'Atenção',
                text: FinRel.msgFiltro,
                footer: ScriptsConfig.footerAlert
            });
            return;
        }

        const url = '/Financeiro/GetListaSegurados';
        const dados = {
            matricula: matricula,
            nome: nome,
            cpf_busca: cpf,
            dt_ini: dtIni,
            dt_fim: dtFim
        };
        console.log("dados: ", dados);
        FinRel.exibirLoadingConsulta('Relatório Financeiro', 'Carregando resultado da busca. Por favor, não feche esta janela!');

        $.ajax({
            url: url,
            type: 'POST',
            data: dados,
            dataType: 'json',
            success: function (response) {
                console.log("response: ", response);
                Swal.close();
                if (response.sucesso && response.lista && response.lista.length > 0) {
                    FinRel.inicializarDataTableSegurados(response.lista);

                    // Mostrar resultado e esconder filtro
                    $('#div-filtro').css('display', 'none');
                    $('#div-resultado-segurados').css('display', 'block');
                    $('#div-resultado-financeiro').css('display', 'none');
                    $('#lista-financeiro').css('display', 'none');
                } else {
                    Swal.fire({
                        icon: 'info',
                        title: 'Sem resultados',
                        text: response.msg || 'Nenhum segurado encontrado para os parâmetros informados',
                        footer: ScriptsConfig.footerAlert
                    });
                }
            },
            error: function (xhr, status, error) {
                console.error('Erro na consulta:', xhr && xhr.status, error, xhr && xhr.responseText ? String(xhr.responseText).substring(0, 300) : '');
                Swal.close();
                Swal.fire({
                    icon: 'error',
                    title: 'Erro',
                    text: 'Erro ao buscar segurados: ' + extrairMensagemErro(xhr, error),
                    footer: ScriptsConfig.footerAlert
                });
            }
        });
    }

    /**
     * Gera PDF diretamente para o segurado selecionado na tabela
     */
    export function gerarPdfDoSegurado(segurado: any) {
        const mat = segurado.dpe_matricula || segurado.dep_matricula || '';
        const nm = segurado.dpe_nome_servidor || segurado.ate_nome || '';
        const cpf = segurado.dpe_cpf_servidor || segurado.ate_cpf_servidor || '';
        const dtIni = $('#per_dt_ini').val() || '';
        const dtFim = $('#per_dt_fim').val() || '';

        FinRel.exibirLoadingConsulta('Dados Financeiros', 'Carregando Relatório Financeiro em PDF...<br>Por favor, não feche esta janela!'); 
 
        $.ajax({
            url: '/Financeiro/GerarPdfFinanceiro',
            type: 'POST',
            data: {
                matricula: mat,
                nome: nm,
                cpf_busca: cpf,
                dt_ini: dtIni,
                dt_fim: dtFim
            },
            dataType: 'json',
            success: function (response) {
                Swal.close();
                if (response.sucesso) {
                    // window.open('/Financeiro/abrirPdfFinanceiroGerado', '_blank');
                    window.open('/Financeiro/abrirPdfFinanceiroGerado', 'popup', 'height=1080,width=1024,toolbar=no'); // '_blank' , 'popup', 'height=1080,width=1024,toolbar=no'
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Erro ao gerar PDF',
                        text: response.msg || 'Não foi possível gerar o arquivo PDF.',
                        footer: ScriptsConfig.footerAlert
                    });
                }
            },
            error: function (xhr, status, error) {
                Swal.close();
                Swal.fire({
                    icon: 'error',
                    title: 'Erro',
                    text: 'Erro ao gerar PDF: ' + error,
                    footer: ScriptsConfig.footerAlert
                });
            }
        });
    }

    /**
     * Inicializa o DataTable com os dados de segurados
     */
    export function inicializarDataTableSegurados(dados: any[]) {
        if (FinRel.dataTableInstance) {
            FinRel.dataTableInstance.destroy();
            FinRel.dataTableInstance = null;
        }

        // Se já existe uma instância anterior, destruir de forma segura
        try {
            if ($.fn && $.fn.dataTable && $.fn.dataTable.isDataTable && $.fn.dataTable.isDataTable('#table-lista-segurados')) {
                try {
                    const existing = $('#table-lista-segurados').DataTable();
                    existing.clear && existing.clear();
                    existing.destroy && existing.destroy();
                } catch (err) {
                    console.warn('Falha ao destruir DataTable via API:', err);
                }
                // Remover elementos remanescentes que o plugin pode ter criado
                try { $('.dt-buttons').remove(); } catch (e) { }
                try { $('.fixedHeader-floating').remove(); } catch (e) { }
                try { $('#table-lista-segurados_wrapper').remove(); } catch (e) { }
                AtEvenRel.dataTableInstance = null;
            }
        } catch (e) {
            console.warn('Erro ao verificar/destruir DataTable anterior:', e);
        }


        $('#table-lista-segurados tbody').empty();

        let html = '';
        dados.forEach((item: any, index: number) => {
            html += `<tr data-index="${index}">
                <td style="text-align:center;">${item.dpe_matricula || ''}</td>
                <td>${item.dpe_nome_servidor || ''}</td>
                <td style="text-align:center;">${mascararCpf(item.dpe_cpf_servidor) || ''}</td>
                <td style="text-align: center;">
                    <button type="button" class="btn btn-sm btn-outline-light btn-ver-segurado-html mr-1" data-index="${index}" data-matricula="${item.dpe_matricula || ''}" data-nome="${(item.dpe_nome_servidor || item.nome || '')}" data-cpf="${item.dpe_cpf_servidor || ''}" title="Visualizar HTML">
                        <i class="fa-solid fa-eye text-info fa-lg"></i>
                    </button>
                </td>
                <td style="text-align: center;">
                    <button type="button" class="btn btn-sm btn-outline-light btn-ver-segurado-pdf" data-index="${index}" data-matricula="${item.dpe_matricula || ''}" data-nome="${(item.dpe_nome_servidor || item.nome || '')}" data-cpf="${item.dpe_cpf_servidor || ''}" title="Gerar PDF">
                        <i class="fa-regular fa-file-pdf text-danger fa-lg"></i>
                    </button>
                </td>
            </tr>`;
        });

        $('#table-lista-segurados tbody').html(html);

        FinRel.dataTableInstance = $('#table-lista-segurados').DataTable({
            paging: true,
            pageLength: 10,
            lengthMenu: [10, 25, 50, 100],
            destroy: true,
            searching: true,
            ordering: true,
            language: {
                url: 'https://cdn.datatables.net/plug-ins/1.13.6/i18n/pt-BR.json'
            }
            , order: [[1, 'asc']] // Ordenar por nome do servidor (segunda coluna)
        });

        // ====== EVENT HANDLERS ======

        // Botão Ver HTML - usar data-attributes do próprio botão para evitar depender
        // do array 'dados' (problemas com reindexação/paging do DataTables podem
        // causar 'undefined' ao acessar dados[index]).
        $('#table-lista-segurados tbody').on('click', 'button.btn-ver-segurado-html', function (e) {
            e.stopPropagation();
            const mat = $(this).data('matricula') || '';
            const nome = $(this).data('nome') || '';
            const cpf = $(this).data('cpf') || '';
            FinRel.carregarFinanceirodoSeguradoClicado({ dpe_matricula: mat, dpe_nome_servidor: nome, dpe_cpf_servidor: cpf });
        });

        // Botão Gerar PDF - idem
        $('#table-lista-segurados tbody').on('click', 'button.btn-ver-segurado-pdf', function (e) {
            e.stopPropagation();
            const mat = $(this).data('matricula') || '';
            const nome = $(this).data('nome') || '';
            const cpf = $(this).data('cpf') || '';
            FinRel.gerarPdfDoSegurado({ dpe_matricula: mat, dpe_nome_servidor: nome, dpe_cpf_servidor: cpf });
        });
    }



    /**
     * Extrai uma mensagem útil de uma falha de $.ajax (o "error" do jQuery vem vazio em HTTP 500).
     */
    function extrairMensagemErro(xhr: any, error: any): string {
        const texto = String((xhr && xhr.responseText) || '');
        const titulo = texto.match(/<title>([\s\S]*?)<\/title>/i);
        if (titulo && titulo[1]) {
            const el = document.createElement('textarea');
            el.innerHTML = titulo[1];
            return el.value.trim();
        }
        if (texto.indexOf('ERRO:') === 0) return texto;
        if (error) return String(error);
        return (xhr && xhr.status) ? 'HTTP ' + xhr.status : 'erro desconhecido';
    }

    /**
     * Carrega todos os registros financeiros do segurado selecionado
     */
    export function carregarFinanceirodoSeguradoClicado(segurado: any) {
        const mat = segurado.dpe_matricula || segurado.dep_matricula || '';
        const nm = segurado.dpe_nome_servidor || segurado.ate_nome || '';
        const cpf = segurado.dpe_cpf_servidor || segurado.ate_cpf_servidor || '';

        FinRel.exibirLoadingConsulta('Dados Financeiros', 'Carregando financeiro...');   
        // Atualizar inputs do formulário com o segurado selecionado
        $('#matricula').val(mat);
        $('#per_nome').val(nm);
        $('#cpf_busca').val(cpf);

        const dtIni = $('#per_dt_ini').val() || '';
        const dtFim = $('#per_dt_fim').val() || '';

        const url = '/Financeiro/GetDadosFinanceiro';

        // No servidor matrícula, CPF e nome são combinados com OR. Enviar os três traria também
        // homônimos (nome começando igual) e outras matrículas do mesmo CPF; por isso vai só a
        // identificação mais específica do segurado clicado.
        const dados: any = { dt_ini: dtIni, dt_fim: dtFim };
        if (Number(mat) > 0) {
            dados.matricula = mat;
        } else if (String(cpf).replace(/\D/g, '').length > 0) {
            dados.cpf = cpf;
        } else {
            dados.nome = nm;
        }

        console.log(dados);

        $.ajax({
            url: url,
            type: 'POST',
            data: dados,
            dataType: 'json',
            success: function (response) {
                console.log(response);
                Swal.close();
                if (response.sucesso && response.lista && response.lista.length > 0) {
                    console.log('Financeiro do segurado carregado com sucesso:', response.lista);
                    // Processar dados e mostrar a lista de financeiro
                    FinRel.listaFinanceiro = response.lista;
                    gerarHTML(response.lista);

                    // Mostrar resultado e esconder outros
                    $('#div-filtro').css('display', 'none');
                    $('#div-resultado-segurados').css('display', 'none');
                    $('#div-resultado-financeiro').css('display', 'block');
                    $('#lista-financeiro').css('display', 'block');

                } else {
                    Swal.fire({
                        icon: 'info',
                        title: 'Sem registros',
                        text: 'Nenhum registro financeiro encontrado para este segurado',
                        footer: ScriptsConfig.footerAlert
                    });
                }
            },
            error: function (xhr, status, error) {
                console.error('Erro na consulta:', xhr && xhr.status, error, xhr && xhr.responseText ? String(xhr.responseText).substring(0, 300) : '');
                Swal.fire({
                    icon: 'error',
                    title: 'Erro',
                    text: 'Erro ao buscar financeiro: ' + extrairMensagemErro(xhr, error),
                    footer: ScriptsConfig.footerAlert
                });
            }
        });
    }

    // Formata número para o padrão brasileiro: 2 casas decimais e "," como separador decimal
    function mascararCpf(cpf: any): string {
        const str = String(cpf ?? '').replace(/\D/g, '');
        if (str.length !== 11) return str;
        return `***.${str.substring(3, 6)}.${str.substring(6, 9)}-**`;
    }

    function formatarNumero(valor: any): string {
        if (valor === null || valor === undefined || valor === '') return '';
        const numero = Number(valor);
        if (isNaN(numero)) return '';
        return numero.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    // Formata a competência pegando os 4 primeiros caracteres (ano) e os 2 seguintes (mês), separados por "/"
    function formatarCompetencia(competencia: any): string {
        if (competencia === null || competencia === undefined) return '';
        const str = String(competencia).trim();
        if (str.length < 6) return str;
        return `${str.substring(0, 4)}/${str.substring(4, 6)}`;
    }

    function formatarCompetenciaMesAno(competencia: any): string {
        if (competencia === null || competencia === undefined) return '';
        const str = String(competencia).trim();
        if (str.length < 6) return str;
        return `${str.substring(4, 6)}/${str.substring(0, 4)}`;
    }
    // Converte formato mm/aaaa para aaaamm (ex: 08/2026 para 202608)

    function converterDataFormularioParaCompetencia(dataFormulario: string): string {
        if (!dataFormulario || dataFormulario.trim().length < 7) return '';
        const trimmed = dataFormulario.trim();
        const partes = trimmed.split('/');
        if (partes.length !== 2) return '';
        const mes = partes[0];
        const ano = partes[1];
        return `${ano}${mes}`;
    }

    function formatarDateToBr(data_inicio_fi: any): string {
        if (data_inicio_fi === null || data_inicio_fi === undefined) return '';
        const str = String(data_inicio_fi).trim();
        if (str.length < 8) return str;
        const ano = str.substring(0, 4);
        const mes = str.substring(4, 6);
        const dia = str.substring(6, 8);
        return `${dia}/${mes}/${ano}`;
    } // transforma aaaammdd em dd/mm/aaaa

    export function processDataForTable(data) {


        FinRel.listaFinanceiro = [];
        data.forEach(q => {
            FinRel.listaFinanceiro.push({
                tempo: (q.fin_numero || 0),
                dpe_cpf_servidor: q.dpe_cpf_servidor || '',
                dpe_nome_servidor: q.dpe_nome_servidor || '',
                dpe_matricula: Number(q.dpe_matricula) || 0,
                dfu_tp_cargo: Number(q.dfu_tp_cargo) || 0,
                dfu_desc_tp_cargo: q.dfu_desc_tp_cargo || '',
                fin_competencia_ano_mes: q.fin_competencia_ano_mes || '',
                rub_codigo: Number(q.rub_codigo) || 0,
                rub_descricao: q.rub_descricao || '',
                fin_dt_inicio: q.fin_dt_inicio || '',
                fin_valor: Number(q.fin_valor) || 0,
                fin_perc_pontos_dia_hora: Number(q.fin_perc_pontos_dia_hora) || 0,
                fin_qtd_urv: Number(q.fin_qtd_urv) || 0,
                PROVENTO: Number(q.PROVENTO) || 0,
                DESCONTO: Number(q.DESCONTO) || 0,
                TOTAL_PROVENTO: Number(q.TOTAL_PROVENTO) || 0,
                TOTAL_DESCONTO: Number(q.TOTAL_DESCONTO) || 0,
                LIQUIDO: Number(q.LIQUIDO) || 0
            });
        });
        return FinRel.listaFinanceiro;
    }

    function getDescricaoTipoCargo(tipoCargo: any): string {
        const numeroTipoCargo = Number(tipoCargo ?? 0);
        if (!Number.isNaN(numeroTipoCargo) && numeroTipoCargo > 0) {
            return tiposCargo.find(t => t.id === numeroTipoCargo)?.cargo || String(tipoCargo || '');
        }

        return String(tipoCargo || '');
    }

    export function gerarHTML(financeiro) {
        if (!Array.isArray(financeiro)) {
            console.warn('gerarHTML recebeu financeiro inválido:', financeiro);
            return;
        }

        const containerElement = document.getElementById('lista-financeiro');
        if (!containerElement) {
            console.warn('Elemento #lista-financeiro não encontrado.');
            return;
        }

        if (financeiro.length === 0) {
            containerElement.innerHTML = '<div class="alert alert-info">Nenhum registro financeiro encontrado.</div>';
            return;
        }


        // ATENÇÃO: gerarHTML recebe a lista BRUTA (não agrupada) e faz o
        // agrupamento aqui dentro. Não chame agruparFinanceiro antes de
        // passar o valor para esta função, ou o agrupamento acontece 2x.
        const agrupadoPorServidor = agruparFinanceiro(financeiro);

        // Limpa o container e insere apenas o cabeçalho fixo do relatório.
        // Cada servidor é então adicionado (append) individualmente dentro
        // do loop, em vez de concatenar tudo numa única string gigante e
        // atribuir de uma vez via innerHTML no final.
        containerElement.innerHTML = '<div class="card mb-3"><div class="card-body"><h4 class="card-title">Relatório Financeiro</h4></div></div>';

        agrupadoPorServidor.forEach((servidor: any) => {
            let serv_cpf = "";
            if (servidor.cpf.length === 11) {
                serv_cpf = "***." + servidor.cpf.substring(3, 6) + "." + servidor.cpf.substring(6, 9) + "-**";
            } else {
                serv_cpf = servidor.cpf;
            }

            // html local, referente apenas a este servidor
            let htmlServidor = '<div class="card mb-4">';
            htmlServidor += '<div class="card-header text-white" style="background-color: #337ab7;">';
            htmlServidor += `<strong>CPF:</strong> ${serv_cpf || ''} &nbsp;|&nbsp; `;
            htmlServidor += `<strong>Nome:</strong> ${servidor.nome || ''} &nbsp;|&nbsp; `;
            htmlServidor += `<strong>Matrícula:</strong> ${servidor.matricula || ''}`;
            htmlServidor += '</div>';
            htmlServidor += '<div class="card-body">';


            servidor.grupos.forEach((grupo: any) => {
                htmlServidor += '<div class="card mb-3">';
                htmlServidor += '<div class="card-header bg-secondary text-white">';
                htmlServidor += `<strong>Competência:</strong> ${formatarCompetenciaMesAno(grupo.competencia)} &nbsp;|&nbsp; `;
                htmlServidor += `<strong>Tipo de Cargo:</strong> ${grupo.dfu_tp_cargo || null}. ${grupo.dfu_desc_tp_cargo || ''}`;
                htmlServidor += '</div>';
                htmlServidor += '<div class="card-body">';

                htmlServidor += '<div class="table-responsive"><table class="table table-sm table-bordered table-striped"><thead class="thead-light"><tr>' +
                    '<th style="text-align:center;">Cód. Rubrica</th><th style="text-align:center;">Rubrica</th><th style="text-align:center;">Data Início</th><th style="text-align:center;">Valor</th><th style="text-align:center;">% Pont./Dia/Hora</th><th style="text-align:center;">QTDE URV</th>' +
                    `<th style="text-align:center;">PROVENTO</th><th style="text-align:center;">DESCONTO</th><th style="text-align:center;">LIQUIDO</th>` +
                    '</tr></thead><tbody>';

                grupo.registros.forEach((item: any) => {
                    const codRubrica = item.rub_codigo ?? item.cod_rubrica_fi ?? '';
                    const descricaoRubrica = item.rub_descricao ?? item.pr_Rubrica ?? '';
                    const dtInicio = String(item.fin_dt_inicio ?? item.data_inicio_fi ?? '').trim();
                    const valor = item.fin_valor ?? item.ala_fi_valor;
                    const percPontos = item.fin_perc_pontos_dia_hora ?? item.ala_fi_perc_pont_dia_hora;
                    const qtdUrv = item.fin_qtd_urv ?? item.ala_fi_QTDE_URV;

                    htmlServidor += '<tr>' +
                        `<td style="text-align:center;">${codRubrica}</td>` +
                        `<td>${descricaoRubrica}</td>` +
                        `<td style="text-align:center;">${((dtInicio != '0' && dtInicio != '00/00/0000' && dtInicio != '30/12/1899' && dtInicio != '01/01/1900') ? formatarDateToBr(dtInicio) : '')}</td>` +
                        `<td style="text-align:right;">${formatarNumero(valor)}</td>` +
                        `<td style="text-align:right;">${formatarNumero(percPontos)}</td>` +
                        `<td style="text-align:right;">${qtdUrv != null ? qtdUrv : ''}</td>` +
                        `<td style="text-align:right;">${formatarNumero(item.PROVENTO)}</td>` +
                        `<td style="text-align:right;">${formatarNumero(item.DESCONTO)}</td>` +
                        `<td></td>` +
                        '</tr>';
                });
                htmlServidor += '<tr>' +
                    `<td style="text-align:center;"> -- </td>` +
                    `<td>Total</td>` +
                    `<td style="text-align:right;"> -- </td>` +
                    `<td style="text-align:right;"> -- </td>` +
                    `<td style="text-align:right;"> -- </td>` +
                    `<td style="text-align:right;"> -- </td>` +
                    `<td style="text-align:right;">${formatarNumero(grupo.registros[0].TOTAL_PROVENTO)}</td>` +
                    `<td style="text-align:right;">${formatarNumero(grupo.registros[0].TOTAL_DESCONTO)}</td>` +
                    `<td style="text-align:right;">${formatarNumero(grupo.registros[0].LIQUIDO)}</td>` +
                    '</tr>';
                htmlServidor += '</tbody></table></div>';
                htmlServidor += '</div>'; // card-body do grupo (competencia/tipo)
                htmlServidor += '</div>'; // card do grupo (competencia/tipo) 112607 200001
            });

            htmlServidor += '</div>'; // card-body do servidor
            htmlServidor += '</div>'; // card do servidor

            // Append incremental: insere o bloco deste servidor no DOM
            // imediatamente, sem esperar o loop terminar nem manter uma
            // string gigante acumulada em memória.
            containerElement.insertAdjacentHTML('beforeend', htmlServidor);
        });

    }

    export function agruparFinanceiro(dados: any[]) {
        if (!Array.isArray(dados)) {
            console.warn('agruparFinanceiro recebeu um valor inválido:', dados);
            return [];
        }

        // Agrupa primeiro por servidor (CPF + Matrícula) e, dentro de cada
        // servidor, por Competência + Tipo de Cargo.
        const mapaServidores: { [chave: string]: any } = {};

        dados.forEach(item => {
            const cpf = item.ALA_DP_CPF_SERVIDOR || item.cpf_ || item.dpe_cpf_servidor || '';
            const nome = item.ALA_DP_NOME_SERVIDOR || item.nome_ || item.dpe_nome_servidor || '';
            const matricula = item.dpe_matricula ?? item.ala_fi_MATRICULA ?? 0;
            const chaveServidor = `${cpf}|${matricula}`;

            if (!mapaServidores[chaveServidor]) {
                mapaServidores[chaveServidor] = {
                    cpf,
                    nome,
                    matricula,
                    grupos: {} as {
                        [chaveGrupo: string]: {
                            competencia: string; tipo_cargo_fi: string; dfu_tp_cargo: number; dfu_desc_tp_cargo: string; registros: any[]
                        }

                    }
                };
            }

            const servidor = mapaServidores[chaveServidor];

            const competencia = String(item.fin_competencia_ano_mes ?? item.COMPETENCIA_FI ?? 'Sem Competência');
            const tipoCargoRaw = item.dfu_tp_cargo ?? item.tipo_cargo_fi ?? 0;
            const tipoCargo = item.dfu_desc_tp_cargo ?? ''; // String(tipoCargoRaw || 'Sem Tipo Cargo');
            const desc_tp_cargo = item.dfu_desc_tp_cargo ?? ''; // String(tipoCargoRaw || 'Sem Tipo Cargo');
            const chaveGrupo = `${competencia}|${tipoCargo}`;

            if (!servidor.grupos[chaveGrupo]) {
                servidor.grupos[chaveGrupo] = {
                    competencia,
                    tipo_cargo_fi: tipoCargo,
                    dfu_tp_cargo: Number(tipoCargoRaw) || 0,
                    desc_tp_cargo: desc_tp_cargo,
                    dfu_desc_tp_cargo: desc_tp_cargo || '',
                    registros: []
                };
            }

            servidor.grupos[chaveGrupo].registros.push({
                dpe_cpf_servidor: cpf,
                dpe_nome_servidor: nome,
                ala_fi_MATRICULA: matricula,
                dpe_matricula: matricula,
                tipo_cargo_fi: tipoCargo,
                dfu_tp_cargo: Number(tipoCargoRaw) || 0,
                dfu_desc_tp_cargo: item.dfu_desc_tp_cargo ?? '',
                COMPETENCIA_FI: competencia,
                fin_competencia_ano_mes: competencia,
                cod_rubrica_fi: item.rub_codigo ?? item.cod_rubrica_fi ?? '',
                pr_Rubrica: item.rub_descricao ?? item.pr_Rubrica ?? '',
                data_inicio_fi: item.fin_dt_inicio ?? item.data_inicio_fi ?? '',
                fin_dt_inicio: item.fin_dt_inicio ?? item.data_inicio_fi ?? '',
                rub_codigo: item.rub_codigo ?? item.cod_rubrica_fi ?? '',
                rub_descricao: item.rub_descricao ?? item.pr_Rubrica ?? '',
                ala_fi_valor: item.fin_valor != null ? item.fin_valor : (item.ala_fi_valor != null ? item.ala_fi_valor : 0),
                fin_valor: item.fin_valor != null ? item.fin_valor : (item.ala_fi_valor != null ? item.ala_fi_valor : 0),
                ala_fi_perc_pont_dia_hora: item.fin_perc_pontos_dia_hora != null ? item.fin_perc_pontos_dia_hora : (item.ala_fi_perc_pont_dia_hora != null ? item.ala_fi_perc_pont_dia_hora : 0),
                fin_perc_pontos_dia_hora: item.fin_perc_pontos_dia_hora != null ? item.fin_perc_pontos_dia_hora : (item.ala_fi_perc_pont_dia_hora != null ? item.ala_fi_perc_pont_dia_hora : 0),
                ala_fi_QTDE_URV: item.fin_qtd_urv != null ? item.fin_qtd_urv : (item.ala_fi_QTDE_URV != null ? item.ala_fi_QTDE_URV : 0),
                fin_qtd_urv: item.fin_qtd_urv != null ? item.fin_qtd_urv : (item.ala_fi_QTDE_URV != null ? item.ala_fi_QTDE_URV : 0),
                PROVENTO: item.PROVENTO != null ? item.PROVENTO : 0,
                DESCONTO: item.DESCONTO != null ? item.DESCONTO : 0,
                TOTAL_PROVENTO: item.TOTAL_PROVENTO != null ? item.TOTAL_PROVENTO : 0,
                TOTAL_DESCONTO: item.TOTAL_DESCONTO != null ? item.TOTAL_DESCONTO : 0,
                LIQUIDO: item.LIQUIDO != null ? item.LIQUIDO : 0
            });
        });

        return Object.values(mapaServidores).map((servidor: any) => ({
            cpf: servidor.cpf,
            nome: servidor.nome,
            matricula: servidor.matricula,
            grupos: Object.values(servidor.grupos)
        }));
    }

    function isFinanceiroAgrupado(dados: any[]): dados is Array<{ competencia: string; tipos: any[] }> {
        return Array.isArray(dados) && dados.length > 0 && typeof dados[0].competencia === 'string' && Array.isArray(dados[0].tipos);
    }

    function gerarFinanceiroAgrupadoHTML(financeiro: Array<{ competencia: string; tipos: any[] }>) {
        container = document.getElementById('lista-financeiro');
        if (!container) {
            console.warn('Elemento #lista-financeiro não encontrado.');
            return;
        }

        let html = '<div class="card"><div class="card-body"><h3>Relatório Financeiro</h3></div></div>';

        financeiro.forEach(competencia => {
            html += `<div class="card mt-3"><div class="card-header"><strong>Competência:</strong> ${formatarCompetenciaMesAno(competencia.competencia)}</div><div class="card-body">`;
            competencia.tipos.forEach(tipo => {
                //const tipoCargoDesc = getDescricaoTipoCargo(tipo.dfu_tp_cargo ?? tipo.tipo_cargo_fi);
                const tipoCargoDesc = tipo.dfu_desc_tp_cargo ?? tipo.tipo_cargo_fi ?? '';
                html += `<div class="mb-3"><h5>Cargo: ${tipoCargoDesc}</h5>`;
                html += '<div class="table-responsive"><table class="table table-sm table-striped"><thead><tr>' +
                    '<th>CPF</th><th>Nome</th><th>Matrícula</th><th>Cód. Rubrica</th><th>Rubrica</th><th>Data Início</th><th>Valor</th><th>% Pont./Dia/Hora</th><th>QTDE URV</th>' +
                    '</tr></thead><tbody>';
                tipo.registros.forEach(item => {
                    const codRubrica = item.rub_codigo || item.cod_rubrica_fi || '';
                    const descricaoRubrica = item.rub_descricao || item.pr_Rubrica || '';
                    const dtInicio = String(item.fin_dt_inicio || item.data_inicio_fi || '').trim();
                    const valor = item.fin_valor ?? item.ala_fi_valor;
                    const percPontos = item.fin_perc_pontos_dia_hora ?? item.ala_fi_perc_pont_dia_hora;
                    const qtdUrv = item.fin_qtd_urv ?? item.ala_fi_QTDE_URV;

                    html += '<tr>' +
                        `<td>${item.cpf || ''}</td>` +
                        `<td>${item.nome || ''}</td>` +
                        `<td>${item.dpe_matricula || item.matricula || ''}</td>` +
                        `<td>${codRubrica}</td>` +
                        `<td>${descricaoRubrica}</td>` +
                        `<td>${((dtInicio != '0' && dtInicio != '00/00/0000' && dtInicio != '30/12/1899' && dtInicio != '01/01/1900') ? formatarDateToBr(dtInicio) : '')}</td>` +
                        `<td>${formatarNumero(valor)}</td>` +
                        `<td>${formatarNumero(percPontos)}</td>` +
                        `<td>${qtdUrv != null ? qtdUrv : ''}</td>` +
                        '</tr>';
                });
                html += '</tbody></table></div></div>';
            });
            html += '</div></div>';
        });

        container.innerHTML = html;
    }

    export function carregarFinanceiro(cpf, matricula, nome, per_dt_ini, per_dt_fim) {

        console.log('Carregando o Financeiro com os parâmetros:', { cpf, matricula, nome, per_dt_ini, per_dt_fim });
        $('#lista-financeiro').empty().html('');
        $('#div-filtro').css('display', 'none');
        $('#div-resultado-financeiro').css('display', 'block');
        var jqxhr = $.post("/Financeiro/GetFinanceiro", {
            cpf: cpf,
            matricula: matricula,
            nome: nome,
            dt_ini: per_dt_ini,
            dt_fim: per_dt_fim
        }, function (data) {

            if (data.sucesso) {
                var dados = data.lista;
                if (dados && dados.length > 0) {

                    if (data.qtd > 0) {

                        let processedData = processDataForTable(dados);
                        console.table(processedData);
                        // gerarHTML já faz o agrupamento internamente
                        FinRel.gerarHTML(processedData);

                        $('#botoes').css('display', 'block');
                        // Swal.close();
                    } else {
                        ScriptsConfig.swalconfirmeActionAlertaWarning.fire({
                            icon: 'info',
                            title: '<code style="color:#045C99;font-size:22px;">Olá</code><br>',
                            imageUrl: "/Content/img/logo-ageprev-ms-origin.png",
                            imageWidth: 300,
                            width: 1080,
                            html: '<span style="color:#045C99;font-size:20px;">Não há Financeiro disponível para a consulta</b></span>',
                            showCancelButton: false,
                            confirmButtonText: "Deseja voltar ao início?",
                            cancelButtonText: "Não, desejo permanecer aqui!",
                            reverseButtons: false,
                            footer: ScriptsConfig.footerAlert,
                            backdrop: true,
                        }).then((result) => {
                            if (result.isConfirmed) {
                                $('form[name="formRelFinanceiro"] input[name="cpf_busca"]').val('');
                                $('form[name="formRelFinanceiro"] input[name="matricula"]').val('');
                                $('form[name="formRelFinanceiro"] input[name="per_dt_ini"]').val('');
                                $('form[name="formRelFinanceiro"] input[name="per_dt_fim"]').val('');

                                $('#div-filtro').css('display', 'block');
                                $('#div-resultado-financeiro').css('display', 'none');
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
                        html: '<span style="color:#045C99;font-size:20px;">Não há Dados Financeiro disponíveis para esta consulta</b></span>',
                        showCancelButton: false,
                        confirmButtonText: "Ok",
                        cancelButtonText: "Não responder o Questionário!",
                        reverseButtons: false,
                        footer: ScriptsConfig.footerAlert,
                        backdrop: true,
                    }).then((result) => {
                        if (result.isConfirmed) {
                            $('form[name="formRelFinanceiro"] input[name="cpf_busca"]').val('');
                            $('form[name="formRelFinanceiro"] input[name="matricula"]').val('');
                            $('form[name="formRelFinanceiro"] input[name="per_dt_ini"]').val('');
                            $('form[name="formRelFinanceiro"] input[name="per_dt_fim"]').val('');

                            $('#div-filtro').css('display', 'block');
                            $('#div-resultado-financeiro').css('display', 'none');
                            // window.location.href = '/Home/Index';
                        } else {
                            // window.location.href = '/Home/Index';
                        }
                    });
                }
            } else {
                console.log('aqui');
                ScriptsConfig.swalconfirmeActionAlertaWarning.fire({
                    icon: 'info',
                    title: '<code style="color:#045C99;font-size:22px;">Olá</code><br>',
                    imageUrl: "/Content/img/logo-ageprev-ms-origin.png",
                    imageWidth: 300,
                    width: 1080,
                    html: '<span style="color:#045C99;font-size:20px;">Não há dados financeiro disponíveis para esta consulta</b></span>',
                    showCancelButton: false,
                    confirmButtonText: "Ok",
                    cancelButtonText: "Não responder o Questionário!",
                    reverseButtons: false,
                    footer: ScriptsConfig.footerAlert,
                    backdrop: true,
                }).then((result) => {
                    if (result.isConfirmed) {

                        $('form[name="formRelFinanceiro"] input[name="cpf_busca"]').val('');
                        $('form[name="formRelFinanceiro"] input[name="matricula"]').val('');
                        $('form[name="formRelFinanceiro"] input[name="per_dt_ini"]').val('');
                        $('form[name="formRelFinanceiro"] input[name="per_dt_fim"]').val('');

                        $('#div-filtro').css('display', 'block');
                        $('#div-resultado-financeiro').css('display', 'none');
                    } else {

                    }
                });

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

        return jqxhr;
    }

    export function validarBusca(cpf, matricula, per_nome, per_dt_ini, per_dt_fim) {
        const cpfLimpo = String(cpf ?? '').replace(/\D/g, '');
        const cpfInformado = cpfLimpo.length > 0;
        const possuiOutroFiltro = [matricula, per_nome, per_dt_ini, per_dt_fim]
            .some(valor => String(valor ?? '').trim().length > 0);

        FinRel.msgFiltro = '';

        if (!cpfInformado && !possuiOutroFiltro) {
            FinRel.validoFiltro = false;
            FinRel.msgFiltro = 'Informe pelo menos um filtro para realizar a busca.';
        } else if (cpfInformado && cpfLimpo.length !== 11) {
            FinRel.validoFiltro = false;
            FinRel.msgFiltro = '🔸 O campo CPF deve conter 11 dígitos.';
        } else {
            FinRel.validoFiltro = true;
        }

        return FinRel.validoFiltro;
    }

    export function gerarPDF() {
        const cpf = String($('input[name="cpf_busca"]').val() || '').replace(/\D/g, '');
        const matricula = String($('input[name="matricula"]').val() || '').trim();
        const nome = String($('input[name="per_nome"]').val() || '').trim();
        // Keep the same period format as the search (MM/YYYY) so the
        // server receives the expected values and filters correctly.
        const dtIni = String($('input[name="per_dt_ini"]').val() || '').trim();
        const dtFim = String($('input[name="per_dt_fim"]').val() || '').trim();

        if (FinRel.validarBusca(cpf, matricula, nome, dtIni, dtFim)) {
            const matriculaNumero = Number(matricula || '0');
            FinRel.gerarPDFPorCpfMatriculaNomePeriodo(cpf, matriculaNumero, nome, dtIni, dtFim);
        } else {
            Swal.fire({
                icon: 'warning',
                title: '<span style="color:#045C99;font-size:22px;">Atenção!</span>',
                html: '<label style="color:#045C99;font-size:20px;text-align:left;">' + FinRel.msgFiltro + '<label>',
                footer: ScriptsConfig.footerAlert
            });
        }
    }

    export function gerarPDFPorCpfMatriculaNomePeriodo(usr_cpf: string, matric?: number, nome?: string, dt_ini?: string, dt_fim?: string) {
        const cpf = String(usr_cpf || '').replace(/\D/g, '');
        const matricula = matric || Number($('input[name="matricula"]').val() as string || '0');
        const nomeBusca = String(nome || $('input[name="per_nome"]').val() as string || '').trim();
        // The PDF endpoint expects the same MM/YYYY period format used by the
        // regular search. Do not convert to YYYYMM here; send raw values.
        const per_dt_ini = dt_ini || String($('input[name="per_dt_ini"]').val() as string || '');
        const per_dt_fim = dt_fim || String($('input[name="per_dt_fim"]').val() as string || '');

        Swal.fire({
            title: '<strong style="color:#045C99;">Financeiro PDF</strong>',
            html: `
                    <div style="text-align: left; font-size: 15px; color: #555; line-height: 1.6;">
                    <p>🔎 <b>Enviando consulta...</b></p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 10px 0;">
                    <small style="color: #888;"><i>⏳ Gerando o relatório em PDF. Por favor, não feche esta janela!</i></small>
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

        $.post('/Financeiro/GerarPdfFinanceiro', { cpf: cpf, matricula: matricula, nome: nomeBusca, dt_ini: per_dt_ini, dt_fim: per_dt_fim }, function (data) {
            console.log('success');
            console.log(data);

            if (data.sucesso) {
                window.open('/Financeiro/abrirPdfFinanceiroGerado', 'popup', 'height=1080,width=1024,toolbar=no');
                console.log('dados encontrados');
                Swal.close();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...2',
                    html: data.msg,
                    footer: '<code>' + data.lista + '</code>'
                });
            }
        }, 'json')
            .done(function (data) {
                if (data !== null) {
                    console.log('second success');
                } else {
                    console.log('dados não encontrado');
                }
            })
            .fail(function (_XMLHttpRequest_, textStatus, errorThrown) {
                console.log('error');
                console.log(_XMLHttpRequest_); console.log(textStatus); console.log(errorThrown);
            })
            .always(function () {
                console.log('finished');
                Swal.close();
            });

    }


    $(function () {

        _ano = '2026';
        _mes = '6';

        $('button[name="btnGerarPDF"]').on('click', function (e) {


            $.when(FinRel.gerarPDF()).then(function (data, textStatus, jqXHR) {
                const cpf = String($('input[name="cpf_busca"]').val() as string || '').replace(/\D/g, '');
                const matricula = String($('input[name="matricula"]').val() as string || '').trim();
                const nome = String($('input[name="per_nome"]').val() as string || '').trim();
                const per_dt_ini = ($('input[name="per_dt_ini"]').val() as string || '').trim();
                const per_dt_fim = ($('input[name="per_dt_fim"]').val() as string || '').trim();
                if (FinRel.validarBusca(cpf, matricula, nome, per_dt_ini, per_dt_fim)) {
                    Swal.fire({
                        title: '<strong style="color:#045C99;">Financeiro</strong>',
                        html: `
                            <div style="text-align: left; font-size: 15px; color: #555; line-height: 1.6;">
                            <p>🔎 <b>Enviando consulta...</b></p>
                            <hr style="border: 0; border-top: 1px solid #eee; margin: 10px 0;">
                            <small style="color: #888;"><i>⏳ Gerando o relatório. Por favor, não feche esta janela!</i></small>
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

                    // Property 'always' does not exist on type 'void'.
                    FinRel.carregarFinanceiro(cpf, matricula, nome, per_dt_ini, per_dt_fim).always(function () {

                    });
                } else {
                    Swal.fire({
                        icon: 'warning',
                        title: '<span style="color:#045C99;font-size:22px;">Atenção!</span>',
                        html: '<label style="color:#045C99;font-size:20px;text-align:left;">' + FinRel.msgFiltro + '<label>',
                        footer: ScriptsConfig.footerAlert
                    });
                }
            });


        });

        $('button[name="btnGerarPDF2"]').on('click', function (e) {
            FinRel.gerarPDF();
        });

        $('button[name="btnBuscar"]').on('click', function (e) {
            // Chamar GetListaSegurados() para exibir lista de segurados
            FinRel.GetListaSegurados();
        });

        $('input[name="cpf_busca"]').on('input', function () {
            var cpf_busca = ($(this).val() as string);
        });

        $('#div-lista-evento-question tbody').on('click', 'button.btn-editar-lista-questionarios', function () {
            const eve_num_evento = Number($(this).data('eve') || 0);
            // const que_num_questionario = Number($(this).data('que') || 0);
            $('input[name="eve_num_evento"]').val(eve_num_evento);
            $('input[name="que_num_questionario"]').val(0);
            // FinRel.editarEventoQuestionrio(eve_num_evento)
        });


        $('button[name="btnVoltarFiltro"]').on('click', function (e) {
            // Voltar para tela de filtros

            $('input[name="matricula"]').val('');
            $('input[name="per_nome"]').val('');
            $('input[name="cpf_busca"]').val('');
            $('input[name="per_dt_ini"]').val('');
            $('input[name="per_dt_fim"]').val('');


            $('#div-filtro').css('display', 'block');
            $('#div-resultado-segurados').css('display', 'none');
            $('#div-resultado-financeiro').css('display', 'none');
            $('#lista-financeiro').css('display', 'none');

        });

        $('button[name="btn-fechar-lista"]').on('click', function (e) {
            if (FinRel.veioDeResultadoUnico) {
                $('#div-filtro').css('display', 'block');
                $('#div-resultado-segurados').css('display', 'none');
                $('#div-resultado-financeiro').css('display', 'none');
                $('#lista-financeiro').css('display', 'none');
            } else {
                $('#div-filtro').css('display', 'none');
                $('#div-resultado-segurados').css('display', 'block');
                $('#div-resultado-financeiro').css('display', 'none');
                $('#lista-financeiro').css('display', 'none');
            }
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
            // Remove all non-numeric characters before saving
            var cleanValue = ($(this).val() as string);
            $('input[name="busca"]').val(cleanValue)
            console.log("Cleaned:", cleanValue);
        });

        /*
        setTimeout(() => {
            console.log("This prints after 2 seconds!");
            fetchDataAndInitializeTable();
        }, 200);
        */

    });

}

declare module "FinRel" {
    export = FinRel;
}