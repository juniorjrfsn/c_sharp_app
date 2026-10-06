// File: script-page/dados-funcionais-relatorio.ts

/// <reference path="../config-scripts/@types/jquery/index.d.ts" />
/// <reference path="../config-scripts/@types/jquery.form/index.d.ts" />

/// <reference path="../config-scripts/@types/datatables.net/types/types.d.ts" />
/// <reference path="../config-scripts/sweetalert2.d.ts" />
/// <reference path="../config-scripts/config.ts" />
/// <reference path="../config-scripts/ScriptsConfig.d.ts" />
/// <reference path="../config-scripts/highcharts.d.ts" />



namespace DadFuncRel {
    export let tempo: number = Date.now();

    export let validoFiltro: boolean = true;
    export let msgFiltro: string = '';

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
 

    export let dataTableInstanceEventos: any | null = null;
    export let dataTableInstance: any | null = null;
    export let dataTableInstanceEveQuestion: any | null = null;
    export let dataTableInstanceEventosQuestionarios: any | null = null;
    export let dataTableInstanceDadosFuncionais: any | null = null;

    export let _ano: string = '0';
    export let _mes: string = '0';

    export let eve_num_evento: number = 0;

    export let que_num_questionario: number = 0;
    
    // Dados funcionais
    export let listaDadosFuncionais: any[] = [];
    export let selectedFuncionario: any | null = null;

    export let eventos: Array<{
        tempo: string;
        eve_num_evento: number;
        eve_nome: string;
        eve_descricao: string;
        eve_local: string;
        eve_municipio: string;
        eve_dt_inicio: string;
        eve_dt_fim: string;
        eve_dt_inclusao: string;
        eve_situacao: string;
    }> = [];

    export let listaQtdePorNota: Array<{
        ure_nota_resultado: string;
        QTDE: number;
    }> = [];

    export let listaEventos: Array<{
        tempo: string;
        eve_num_evento: number;
        eve_nome: string;
        eve_descricao: string;
        eve_local: string;
        eve_municipio: string;
        eve_dt_inicio: string;
        eve_dt_fim: string;
        eve_dt_inclusao: string;
        eve_situacao: string;
        que_num_questionario: number;
        que_contexto: string;
        que_publico_alvo: string;
        que_nota_minima: number;
        que_dt_inclusao: string;
        que_situacao: string;

    }> = [];

    export let dadosDaTabela: Array<{
        tempo: number;
        usr_num_usuario: number;
        eve_num_evento: number;
        que_num_questionario: number;
        que_contexto: string;
        que_situacao: string;
        usr_cpf: string;
        usr_nome: string;
        usr_email: string;
        usr_situacao: string;
        eve_nome: string;
        pontuacao: number;
        eve_situacao: string;
    }> = [];

    export let listaUsuariosPontos: Array<{
        tempo: number;
        usr_num_usuario: number;
        eve_num_evento: number;
        que_num_questionario: number;
        que_contexto: string;
        que_situacao: string;
        usr_cpf: string;
        usr_nome: string;
        usr_email: string;
        usr_situacao: string;
        eve_nome: string;
        pontuacao: number;
        eve_situacao: string;
    }> = [];

    export let listaFinanceiro: Array<{
        tempo: number;
        ALA_DP_CPF_SERVIDOR: string;
        ALA_DP_NOME_SERVIDOR: string;
        ala_fi_MATRICULA: number;
        tipo_cargo_fi: number;
        COMPETENCIA_FI: string;
        cod_rubrica_fi: number;
        pr_Rubrica: string;
        data_inicio_fi: string;
        ala_fi_valor: number;
        ala_fi_perc_pont_dia_hora: number;
        ala_fi_QTDE_URV: number;
        PROVENTO: number;
        DESCONTO: number;
        TOTAL_PROVENTO: number;
        TOTAL_DESCONTO: number;
        LIQUIDO: number;
    }> = [];


    export function mascararCpf(cpf: any): string {
        const str = String(cpf ?? '').replace(/\D/g, '');
        if (str.length !== 11) return str;
        return `***.${str.substring(3, 6)}.${str.substring(6, 9)}-**`;
    }

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
                const loader = Swal.getPopup().querySelector('.swal2-loader') as HTMLElement;
                if (loader) {
                    loader.style.color = '#045C99';
                    loader.style.borderRightColor = 'transparent';
                }
            }
        });
    }

    export function validarFiltroSegurado(): boolean {
        const matricula: string     = (($('#matricula').val() as string)    || '').trim();
        const nome: string          = (($('#nome').val() as string)         || '').trim();
        const cpfNumeros: string    = (($('#cpf_busca').val() as string)    || '').replace(/\D/g, '');

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
            DadFuncRel.validoFiltro = false;
            DadFuncRel.msgFiltro = 'Por favor, informe pelo menos um critério de busca (Matrícula, Nome ou CPF).';
        } else if (erros.length > 0) {
            DadFuncRel.validoFiltro = false;
            DadFuncRel.msgFiltro = erros.join('\n');
        } else {
            DadFuncRel.validoFiltro = true;
            DadFuncRel.msgFiltro = '';
        }

        return DadFuncRel.validoFiltro; // mantive o retorno original: true = filtro inválido
    }

    // ============== DADOS FUNCIONAIS - Datatable Functions ==============

    /**
     * Realiza a consulta de dados funcionais via AJAX (Etapa 1: Lista de Segurados).
     * O servidor devolve as linhas <tr> já prontas em HTML (evita o limite de maxJsonLength).
     */
    export function consultarDadosFuncionais() {
        const cpf = $('#cpf_busca').val() || '';
        const matricula = $('#matricula').val() || '';
        const nome = $('#nome').val() || '';

        if (validarFiltroSegurado()) { } else {
            Swal.fire({
                icon: 'warning',
                title: 'Atenção',
                text: DadFuncRel.msgFiltro,
                footer: ScriptsConfig.footerAlert
            });
            return;
        }

        DadFuncRel.exibirLoadingConsulta('Dados Funcionais', 'Carregando resultado da busca. Por favor, não feche esta janela!');

        const url = '/DadosFuncionais/GetListaSeguradosTbody';
        const dados = {
            cpf_busca: cpf,
            matricula: matricula,
            nome: nome
        };

        $.ajax({
            url: url,
            type: 'POST',
            data: dados,
            dataType: 'html',
            success: function (html: string) {
                Swal.close();
                const linhasHtml = (html || '').trim();

                if (linhasHtml.length > 0) {
                    inicializarDataTableDadosFuncionais(linhasHtml);

                    // Mostrar resultado e esconder filtro
                    $('#div-filtro').css('display', 'none');
                    $('#div-resultado-dados-funcionais').css('display', 'block');
                    $('#dados_funcionais').css('display', 'none');
                } else {
                    Swal.fire({
                        icon: 'info',
                        title: 'Sem resultados',
                        text: 'Nenhum registro encontrado para os parâmetros informados',
                        footer: ScriptsConfig.footerAlert
                    });
                }
            },
            error: function (xhr, status, error) {
                Swal.close();
                console.error('Erro na consulta:', xhr.status, status, error);

                // O controller devolve "ERRO: ..." em texto puro quando falha (HTTP 500)
                const texto = (xhr.responseText || '').trim();
                const detalhe = texto.indexOf('ERRO:') === 0 ? texto : error;

                Swal.fire({
                    icon: 'error',
                    title: 'Erro',
                    text: 'Erro ao buscar dados funcionais: ' + detalhe,
                    footer: ScriptsConfig.footerAlert
                });
            }
        });
    }

    /**
     * Carrega os detalhes completos do funcionário via AJAX (Etapa 2) e exibe o formulário
     */
    export function carregarEDetalharFuncionario(index: number, callback?: (funcionario: any) => void) {
        const item = DadFuncRel.listaDadosFuncionais[index];
        if (!item) return;

        DadFuncRel.exibirLoadingConsulta('Dados Funcionais', 'Carregando detalhes do funcionário...');

        $.ajax({
            url: '/DadosFuncionais/GetDadosFuncionais',
            type: 'POST',
            data: {
                fun_numero: item.fun_numero || 0,
                dfu_numero: item.fun_numero || 0,
                matricula: item.dpe_matricula || 0,
                cpf_busca: item.dpe_cpf_servidor || '',
                nome: item.dpe_nome_servidor || ''
            },
            dataType: 'json',
            success: function (response) {
                Swal.close();
                if (response.sucesso && response.lista && response.lista.length > 0) {
                    const funcionario = response.lista[0];
                    DadFuncRel.selectedFuncionario = funcionario;
                    preencherFormularioDadosFuncionaisObjeto(funcionario);
                    $('#div-filtro').css('display', 'none');
                    $('#div-resultado-dados-funcionais').css('display', 'none');
                    $('#dados_funcionais').css('display', 'block');
                    if (callback) callback(funcionario);
                } else {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Atenção',
                        text: response.msg || 'Não foi possível carregar os detalhes do funcionário.',
                        footer: ScriptsConfig.footerAlert
                    });
                }
            },
            error: function (xhr, status, error) {
                Swal.close();
                console.error('Erro ao carregar detalhes:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Erro',
                    text: 'Erro ao buscar detalhes dos dados funcionais: ' + error,
                    footer: ScriptsConfig.footerAlert
                });
            }
        });
    }
    
    function converterData(aaaammdd: any): string {
        if (aaaammdd === null || aaaammdd === undefined || aaaammdd === '') {
            return '';
        }

        const str = String(aaaammdd).trim();

        if (!/^\d{8}$/.test(str)) {
            return aaaammdd; // Retorna o valor original se não estiver no formato esperado
        }

        const ano = str.substring(0, 4);
        const mes = str.substring(4, 6);
        const dia = str.substring(6, 8);

        const anoNumero = Number(ano);
        const mesNumero = Number(mes);
        const diaNumero = Number(dia);

        const data = new Date(anoNumero, mesNumero - 1, diaNumero);

        if (
            data.getFullYear() !== anoNumero ||
            data.getMonth() !== mesNumero - 1 ||
            data.getDate() !== diaNumero
        ) {
            return aaaammdd; // Retorna o valor original se a data for inválida
        }

        return `${dia}/${mes}/${ano}`;
    }


    /**
     * Inicializa o DataTable a partir das linhas <tr> em HTML devolvidas pelo servidor
     */
    export function inicializarDataTableDadosFuncionais(linhasHtml: string) {
        // Destruir instância anterior se existir
        if (DadFuncRel.dataTableInstanceDadosFuncionais) {
            DadFuncRel.dataTableInstanceDadosFuncionais.destroy();
            DadFuncRel.dataTableInstanceDadosFuncionais = null;
        }

        // Se já existe uma instância anterior, destruir de forma segura
        try {
            if ($.fn && $.fn.dataTable && $.fn.dataTable.isDataTable && $.fn.dataTable.isDataTable('#table-lista-dados-funcionais')) {
                try {
                    const existing = $('#table-lista-dados-funcionais').DataTable();
                    existing.clear && existing.clear();
                    existing.destroy && existing.destroy();
                } catch (err) {
                    console.warn('Falha ao destruir DataTable via API:', err);
                }
                // Remover elementos remanescentes que o plugin pode ter criado
                try { $('.dt-buttons').remove(); } catch (e) { }
                try { $('.fixedHeader-floating').remove(); } catch (e) { }
                try { $('#table-lista-dados-funcionais_wrapper').remove(); } catch (e) { }
                DadFuncRel.dataTableInstanceDadosFuncionais = null;
            }
        } catch (e) {
            console.warn('Erro ao verificar/destruir DataTable anterior:', e);
        }

        const $tbody = $('#table-lista-dados-funcionais tbody');

        // Insere as linhas prontas vindas do servidor
        $tbody.empty().html(linhasHtml);

        // Reconstrói listaDadosFuncionais a partir dos data-* das linhas (a posição = data-index).
        // Deve ser feito ANTES de iniciar o DataTable, pois ele reordena as linhas no DOM.
        const lista: any[] = [];
        $tbody.find('tr').each(function () {
            const $tr = $(this);
            const idx = Number($tr.attr('data-index'));
            lista[idx] = {
                fun_numero: Number($tr.attr('data-fun-numero')) || 0,
                dpe_matricula: Number($tr.attr('data-matricula')) || 0,
                dpe_cpf_servidor: $tr.attr('data-cpf') || '',
                dpe_nome_servidor: $tr.attr('data-nome') || ''
            };
        });
        DadFuncRel.listaDadosFuncionais = lista;

        // Inicializar DataTable
        DadFuncRel.dataTableInstanceDadosFuncionais = $('#table-lista-dados-funcionais').DataTable({
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
        // .off('.dadfunc') evita empilhar handlers a cada nova consulta
        $tbody.off('.dadfunc');

        // Clique na linha da tabela
        $tbody.on('click.dadfunc', 'tr', function (e) {
            if ($(e.target).closest('button').length > 0) return; // Não fazer nada se clicou em botão

            const index = Number($(this).attr('data-index'));
            carregarEDetalharFuncionario(index);
        });

        // Botão Ver
        $tbody.on('click.dadfunc', 'button.btn-ver-funcionario', function (e) {
            e.stopPropagation();
            const index = Number($(this).attr('data-index'));
            carregarEDetalharFuncionario(index);
        });

        // Botão Gerar PDF
        $tbody.on('click.dadfunc', 'button.btn-gerar-pdf-funcionario', function (e) {
            e.stopPropagation();
            const index = Number($(this).attr('data-index'));
            carregarEDetalharFuncionario(index, function () {
                setTimeout(function () {
                    $('#btnGerarPDF').trigger('click');
                }, 100);
            });
        });
    }

    export function preencherFormularioDadosFuncionaisObjeto(funcionario: any) {
        if (!funcionario) return;

        DadFuncRel.selectedFuncionario = funcionario;

        $('#dpe_matricula').val(funcionario.dpe_matricula || '');
        $('#dpe_nome_servidor').val(funcionario.dpe_nome_servidor || '');
        $('#dpe_cpf_servidor').val(formatarCPF(funcionario.dpe_cpf_servidor) || '');
        $('#fun_desc_tp_cargo').val(funcionario.fun_desc_tp_cargo || '');
        $('#fun_desc_simbolo').val(funcionario.fun_desc_simbolo || '');
        $('#fun_cargo').val(funcionario.fun_cargo || '');
        $('#fun_desc_provimento').val(funcionario.fun_desc_provimento || '');
        $('#fun_desc_ativo_desativo').val(funcionario.fun_desc_ativo_desativo || funcionario.dpe_desc_situacao || '');
        $('#fun_desc_orgao_superior').val(funcionario.fun_desc_orgao_superior || '');
        $('#fun_desc_unidade_orcamentaria').val(funcionario.fun_desc_unidade_orcamentaria || '');
        $('#fun_nome_reparticao').val(funcionario.fun_nome_reparticao || '');
        $('#fun_nome_municipio').val(funcionario.fun_nome_municipio || '');
        $('#fun_dt_validade_inicial').val(formatarData(funcionario.fun_dt_validade_inicial) || '');
    }

    /**
     * Preenche o formulário com os dados do funcionário selecionado
     */
    export function preencherFormularioDadosFuncionais(index: number) {
        const funcionario = DadFuncRel.listaDadosFuncionais[index];
        preencherFormularioDadosFuncionaisObjeto(funcionario);
    }

    // Função auxiliar para formatar CPF
    function formatarCPF(cpf: string): string {
        if (!cpf || cpf.length !== 11) return cpf || '';
        return cpf.substring(0, 3) + '.' + cpf.substring(3, 6) + '.' + cpf.substring(6, 9) + '-' + cpf.substring(9, 11);
    }

    // Função auxiliar para formatar data (yyyymmdd para dd/mm/yyyy)
    function formatarData(data: string): string {
        if (!data || data.length < 8) return data || '';
        try {
            // Se for formato YYYYMMDD
            if (data.length === 8 && !isNaN(Number(data))) {
                const ano = data.substring(0, 4);
                const mes = data.substring(4, 6);
                const dia = data.substring(6, 8);
                if (dia !== '00' && mes !== '00') {
                    return dia + '/' + mes + '/' + ano;
                }
            }
        } catch (e) {
            console.error('Erro ao formatar data:', e);
        }
        return data || '';
    }

    // Formata número para o padrão brasileiro: 2 casas decimais e "," como separador decimal
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
        DadFuncRel.listaFinanceiro = [];
        data.forEach(q => {
            DadFuncRel.listaFinanceiro.push({
                tempo: (q.fin_id || 0),
                ALA_DP_CPF_SERVIDOR: q.ALA_DP_CPF_SERVIDOR || '',
                ALA_DP_NOME_SERVIDOR: q.ALA_DP_NOME_SERVIDOR || '',
                ala_fi_MATRICULA: Number(q.ala_fi_MATRICULA) || 0,
                tipo_cargo_fi: Number(q.tipo_cargo_fi) || 0,
                COMPETENCIA_FI: q.COMPETENCIA_FI || '',
                cod_rubrica_fi: Number(q.cod_rubrica_fi) || 0,
                pr_Rubrica: q.pr_Rubrica || '',
                data_inicio_fi: q.data_inicio_fi || '',
                ala_fi_valor: Number(q.ala_fi_valor) || 0,
                ala_fi_perc_pont_dia_hora: Number(q.ala_fi_perc_pont_dia_hora) || 0,
                ala_fi_QTDE_URV: Number(q.ala_fi_QTDE_URV) || 0,
                PROVENTO: Number(q.PROVENTO) || 0,
                DESCONTO: Number(q.DESCONTO) || 0,
                TOTAL_PROVENTO: Number(q.TOTAL_PROVENTO) || 0,
                TOTAL_DESCONTO: Number(q.TOTAL_DESCONTO) || 0,
                LIQUIDO: Number(q.LIQUIDO) || 0
            });
        });
        return DadFuncRel.listaFinanceiro;
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

        let html = '<div class="card mb-3"><div class="card-body"><h4 class="card-title">Relatório Financeiro</h4></div></div>';

        agrupadoPorServidor.forEach((servidor: any) => {
            let serv_cpf = "";
            if (servidor.cpf.length === 11) {
                serv_cpf = "***." + servidor.cpf.substring(3, 6) + "." + servidor.cpf.substring(6, 9) + "-**";
            } else {
                serv_cpf = servidor.cpf;
            }

            html += '<div class="card mb-4">';
            html += '<div class="card-header text-white" style="background-color: #337ab7;">';
            html += `<strong>CPF:</strong> ${serv_cpf || ''} &nbsp;|&nbsp; `;
            html += `<strong>Nome:</strong> ${servidor.nome || ''} &nbsp;|&nbsp; `;
            html += `<strong>Matrícula:</strong> ${servidor.matricula || ''}`;
            html += '</div>';
            html += '<div class="card-body">';

            servidor.grupos.forEach((grupo: any) => {
                html += '<div class="card mb-3">';
                html += '<div class="card-header bg-secondary text-white">';
                html += `<strong>Competência:</strong> ${formatarCompetencia(grupo.competencia)} &nbsp;|&nbsp; `;
                html += `<strong>Tipo de Cargo:</strong> ${grupo.tipo_cargo_fi}`;
                html += '</div>';
                html += '<div class="card-body">';

                html += '<div class="table-responsive"><table class="table table-sm table-bordered table-striped"><thead class="thead-light"><tr>' +
                    '<th style="text-align:center;">Cód. Rubrica</th><th style="text-align:center;">Rubrica</th><th style="text-align:center;">Data Início</th><th style="text-align:center;">Valor</th><th style="text-align:center;">% Pont./Dia/Hora</th><th style="text-align:center;">QTDE URV</th>' +
                    `<th style="text-align:center;">PROVENTO</th><th>DESCONTO</th><th style="text-align:center;">LIQUIDO</th>` +
                    '</tr></thead><tbody>';

                grupo.registros.forEach((item: any) => {
                    html += '<tr>' +
                        `<td style="text-align:center;">${item.cod_rubrica_fi || ''}</td>` +
                        `<td>${item.pr_Rubrica || ''}</td>` +
                        `<td style="text-align:center;">${((item.data_inicio_fi.trim() != '0' && item.data_inicio_fi.trim() != '00/00/0000' && item.data_inicio_fi.trim() != '30/12/1899' && item.data_inicio_fi.trim() != '01/01/1900') ? formatarDateToBr(item.data_inicio_fi.trim()) : '')}</td>` +
                        `<td style="text-align:right;">${formatarNumero(item.ala_fi_valor)}</td>` +
                        `<td style="text-align:right;">${formatarNumero(item.ala_fi_perc_pont_dia_hora)}</td>` +
                        `<td style="text-align:right;">${item.ala_fi_QTDE_URV != null ? item.ala_fi_QTDE_URV : ''}</td>` +
                        `<td style="text-align:right;">${formatarNumero(item.PROVENTO)}</td>` +
                        `<td style="text-align:right;">${formatarNumero(item.DESCONTO)}</td>` +
                        `<td></td>` +
                        '</tr>';
                });
                html += '<tr>' +
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
                html += '</tbody></table></div>';
                html += '</div>'; // card-body do grupo (competencia/tipo)
                html += '</div>'; // card do grupo (competencia/tipo) 112607 200001
            });

            html += '</div>'; // card-body do servidor
            html += '</div>'; // card do servidor
        });

        containerElement.innerHTML = html;
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
            const cpf = item.ALA_DP_CPF_SERVIDOR || '';
            const nome = item.ALA_DP_NOME_SERVIDOR || '';
            const matricula = item.ala_fi_MATRICULA || 0;
            const chaveServidor = `${cpf}|${matricula}`;

            if (!mapaServidores[chaveServidor]) {
                mapaServidores[chaveServidor] = {
                    cpf,
                    nome,
                    matricula,
                    grupos: {} as { [chaveGrupo: string]: { competencia: string; tipo_cargo_fi: string; registros: any[] } }
                };
            }

            const servidor = mapaServidores[chaveServidor];

            const competencia = String(item.COMPETENCIA_FI || 'Sem Competência');
            const tipoCargo = String(item.tipo_cargo_fi || 'Sem Tipo Cargo');
            const chaveGrupo = `${competencia}|${tipoCargo}`;

            if (!servidor.grupos[chaveGrupo]) {
                servidor.grupos[chaveGrupo] = { competencia, tipo_cargo_fi: tipoCargo, registros: [] };
            }

            servidor.grupos[chaveGrupo].registros.push({
                ALA_DP_CPF_SERVIDOR: cpf,
                ALA_DP_NOME_SERVIDOR: nome,
                ala_fi_MATRICULA: matricula,
                tipo_cargo_fi: tipoCargo,
                COMPETENCIA_FI: competencia,
                cod_rubrica_fi: item.cod_rubrica_fi || '',
                pr_Rubrica: item.pr_Rubrica || '',
                data_inicio_fi: item.data_inicio_fi || '',
                ala_fi_valor: item.ala_fi_valor != null ? item.ala_fi_valor : 0,
                ala_fi_perc_pont_dia_hora: item.ala_fi_perc_pont_dia_hora != null ? item.ala_fi_perc_pont_dia_hora : 0,
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
            html += `<div class="card mt-3"><div class="card-header"><strong>Competência:</strong> ${formatarCompetencia(competencia.competencia)}</div><div class="card-body">`;
            competencia.tipos.forEach(tipo => {
                html += `<div class="mb-3"><h5>Tipo de Cargo: ${tipo.tipo_cargo_fi}</h5>`;
                html += '<div class="table-responsive"><table class="table table-sm table-striped"><thead><tr>' +
                    '<th>CPF</th><th>Nome</th><th>Matrícula</th><th>Cód. Rubrica</th><th>Rubrica</th><th>Data Início</th><th>Valor</th><th>% Pont./Dia/Hora</th><th>QTDE URV</th>' +
                    '</tr></thead><tbody>';
                tipo.registros.forEach(item => {
                    html += '<tr>' +
                        `<td style="text-align:center;">${item.cpf || ''}</td>` +
                        `<td>${item.nome || ''}</td>` +
                        `<td style="text-align:center;">${item.matricula || ''}</td>` +
                        `<td style="text-align:center;">${item.cod_rubrica_fi || ''}</td>` +
                        `<td style="text-align:center;">${item.pr_Rubrica || ''}</td>` +
                        // a linha abaixo a seguir precisa verificar se tem espaço em branco no final da string e substituir por ''
                        `<td style="text-align:center;">${((item.data_inicio_fi.trim() != '0' && item.data_inicio_fi.trim() != '00/00/0000' && item.data_inicio_fi.trim() != '30/12/1899' && item.data_inicio_fi.trim() != '01/01/1900') ? formatarDateToBr(item.data_inicio_fi.trim()) : '')}</td>` +
                        `<td style="text-align:center;">${formatarNumero(item.ala_fi_valor)}</td>` +
                        `<td style="text-align:center;">${formatarNumero(item.ala_fi_perc_pont_dia_hora)}</td>` +
                        `<td style="text-align:center;">${item.ala_fi_QTDE_URV != null ? item.ala_fi_QTDE_URV : ''}</td>` +
                        '</tr>';
                });
                html += '</tbody></table></div></div>';
            });
            html += '</div></div>';
        });

        container.innerHTML = html;
    }

    export function DadosFuncionais(cpf, matricula, nome, per_dt_ini, per_dt_fim) {

        console.log('Carregando dados funcionais');
        // $('#div-resultado-dados-funcionais').empty().html('');
        $('#div-filtro').css('display', 'none');
        $('#div-resultado-dados-funcionais').css('display', 'none');
        $('#dados_funcionais').css('display', 'block');
        
        var jqxhr = $.post("/DadosFuncionais/GetDadosFuncionais", {
            cpf_busca: cpf,
            cpf: cpf,
            matricula: matricula,
            nome: nome
        }, function (data) {


            if (data.sucesso) {
                var dados = data.lista;
                if (dados && dados.length > 0) {
                    if (data.qtd > 0) {
                        // Pega o primeiro resultado
                        const primeiro = dados[0];

                        // Preenche os campos da exibição
                        $('#dpe_nome_servidor').val(primeiro.dpe_nome_servidor || primeiro.dfu_nome_servidor || '');
                        $('#dpe_cpf_servidor').val(primeiro.dpe_cpf_servidor || primeiro.dfu_cpf_servidor || '');
                        $('#dpe_matricula').val(primeiro.dpe_matricula ?? primeiro.dfu_matricula ?? '');
                        $('#dpe_desc_situacao').val(primeiro.fun_desc_ativo_desativo || primeiro.dfu_desc_situacao || '');

                        $('#botoes').css('display', 'block');
                        Swal.close();
                    } else {
                        ScriptsConfig.swalconfirmeActionAlertaWarning.fire({
                            icon: 'info',
                            title: '<code style="color:#045C99;font-size:22px;">Olá</code><br>',
                            imageUrl: "/Content/img/logo-ageprev-ms-origin.png",
                            imageWidth: 300,
                            width: 1080,
                            html: '<span style="color:#045C99;font-size:20px;">Não há dados funcionais disponíveis para a consulta</span>',
                            showCancelButton: false,
                            confirmButtonText: "Deseja voltar ao início?",
                            cancelButtonText: "Não, desejo permanecer aqui!",
                            reverseButtons: false,
                            footer: ScriptsConfig.footerAlert,
                            backdrop: true,
                        }).then((result) => {
                            if (result.isConfirmed) {
                                $('input[name="cpf_busca"]').val('');
                                $('input[name="matricula"]').val('');
                                $('input[name="nome"]').val('');

                                $('#div-filtro').css('display', 'block');
                                $('#dados_funcionais').css('display', 'none');
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
                        html: '<span style="color:#045C99;font-size:20px;">Não há dados funcionais disponíveis para esta consulta</span>',
                        showCancelButton: false,
                        confirmButtonText: "Ok",
                        cancelButtonText: "Não!",
                        reverseButtons: false,
                        footer: ScriptsConfig.footerAlert,
                        backdrop: true,
                    }).then((result) => {
                        if (result.isConfirmed) {
                            $('input[name="cpf_busca"]').val('');
                            $('input[name="matricula"]').val('');
                            $('input[name="nome"]').val('');

                            $('#div-filtro').css('display', 'block');
                            $('#dados_funcionais').css('display', 'none');
                        }
                    });
                }
            } else {
                ScriptsConfig.swalconfirmeActionAlertaWarning.fire({
                    icon: 'error',
                    title: '<code style="color:#045C99;font-size:22px;">Erro!</code><br>',
                    imageUrl: "/Content/img/logo-ageprev-ms-origin.png",
                    imageWidth: 300,
                    width: 1080,
                    html: '<span style="color:#045C99;font-size:20px;">Erro ao buscar dados: ' + (data.msg || 'Erro desconhecido') + '</span>',
                    showCancelButton: false,
                    confirmButtonText: "Ok",
                    reverseButtons: false,
                    footer: ScriptsConfig.footerAlert,
                    backdrop: true,
                }).then((result) => {
                    $('#div-filtro').css('display', 'block');
                    $('#dados_funcionais').css('display', 'none');
                });
            }
        }).fail(function(err) {
            console.error('Erro na requisição AJAX:', err);
            Swal.close();
            ScriptsConfig.swalconfirmeActionAlertaWarning.fire({
                icon: 'error',
                title: 'Erro de Conexão',
                html: 'Falha ao conectar com o servidor. Verifique sua conexão.',
                footer: ScriptsConfig.footerAlert
            });
            $('#div-filtro').css('display', 'block');
            $('#dados_funcionais').css('display', 'none');
        });

        return jqxhr;
    }

    /**
     * Versão otimizada de DadosFuncionais que carrega apenas 1 funcionário por fun_numero.
     * Evita buscar muitos registros quando já temos o fun_numero do funcionário selecionado.
     */
    export function DadosFuncionaisComFunNumero(funNumero: number) {
        console.log('Carregando detalhes do funcionário via fun_numero:', funNumero);
        $('#div-filtro').css('display', 'none');
        $('#div-resultado-dados-funcionais').css('display', 'none');
        $('#dados_funcionais').css('display', 'block');

        var jqxhr = $.post("/DadosFuncionais/GetDadosFuncionais", {
            fun_numero: funNumero,
            dfu_numero: funNumero
        }, function (data) {
            if (data.sucesso) {
                var dados = data.lista;
                if (dados && dados.length > 0) {
                    // Pega o primeiro resultado
                    const primeiro = dados[0];

                    // Preenche os campos da exibição
                    $('#dpe_nome_servidor').val(primeiro.dpe_nome_servidor || '');
                    $('#dpe_cpf_servidor').val(primeiro.dpe_cpf_servidor || '');
                    $('#dpe_matricula').val(primeiro.dpe_matricula ?? '');
                    $('#dpe_desc_situacao').val(primeiro.fun_desc_ativo_desativo || primeiro.dpe_desc_situacao || '');

                    $('#botoes').css('display', 'block');
                    Swal.close();
                } else {
                    Swal.fire({
                        icon: 'info',
                        title: 'Sem resultados',
                        text: 'Não foi possível carregar os dados do funcionário.',
                        footer: ScriptsConfig.footerAlert
                    });
                    $('#div-filtro').css('display', 'block');
                    $('#dados_funcionais').css('display', 'none');
                }
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Erro',
                    html: '<span style="color:#045C99;font-size:20px;">Erro ao buscar dados: ' + (data.msg || 'Erro desconhecido') + '</span>',
                    footer: ScriptsConfig.footerAlert
                });
                $('#div-filtro').css('display', 'block');
                $('#dados_funcionais').css('display', 'none');
            }
        }).fail(function(err) {
            console.error('Erro na requisição AJAX:', err);
            Swal.fire({
                icon: 'error',
                title: 'Erro de Conexão',
                html: 'Falha ao conectar com o servidor. Verifique sua conexão.',
                footer: ScriptsConfig.footerAlert
            });
            $('#div-filtro').css('display', 'block');
            $('#dados_funcionais').css('display', 'none');
        });

        return jqxhr;
    }

    export function validarBusca(cpf, matricula, per_nome, per_dt_ini, per_dt_fim) {
        const cpfLimpo = String(cpf ?? '').replace(/\D/g, '');
        const cpfInformado = cpfLimpo.length > 0;
        const possuiOutroFiltro = [matricula, per_nome, per_dt_ini, per_dt_fim]
            .some(valor => String(valor ?? '').trim().length > 0);

        DadFuncRel.msgFiltro = '';

        if (!cpfInformado && !possuiOutroFiltro) {
            DadFuncRel.validoFiltro = false;
            DadFuncRel.msgFiltro = 'Informe pelo menos um filtro para realizar a busca.';
        } else if (cpfInformado && cpfLimpo.length !== 11) {
            DadFuncRel.validoFiltro = false;
            DadFuncRel.msgFiltro = '🔸 O campo CPF deve conter 11 dígitos.';
        } else {
            DadFuncRel.validoFiltro = true;
        }

        return DadFuncRel.validoFiltro;
    }

    export function gerarPDF() {
        const cpf = String($('input[name="cpf_busca"]').val() || '').replace(/\D/g, '');
        const matricula = String($('input[name="matricula"]').val() || '').trim();
        const nome = String($('input[name="nome"]').val() || '').trim();
        // Keep the same period format as the search (MM/YYYY) so the
        // server receives the expected values and filters correctly.
        const dtIni = String($('input[name="per_dt_ini"]').val() || '').trim();
        const dtFim = String($('input[name="per_dt_fim"]').val() || '').trim();

        if (DadFuncRel.validarBusca(cpf, matricula, nome, dtIni, dtFim)) {
            const matriculaNumero = Number(matricula || '0');
            
            // Se temos um funcionário selecionado, usar seu fun_numero para gerar PDF
            // com exatamente o mesmo registro do formulário
            if (DadFuncRel.selectedFuncionario && DadFuncRel.selectedFuncionario.fun_numero) {
                DadFuncRel.gerarPDFComFunNumero(
                    DadFuncRel.selectedFuncionario.fun_numero,
                    dtIni,
                    dtFim
                );
                DadFuncRel.DadosFuncionaisComFunNumero(DadFuncRel.selectedFuncionario.fun_numero);
            } else {
                DadFuncRel.gerarPDFPorCpfMatriculaNomePeriodo(cpf, matriculaNumero, nome, dtIni, dtFim);
                DadFuncRel.DadosFuncionais(cpf, matriculaNumero, nome, dtIni, dtFim);
            }
        } else {
            Swal.fire({
                icon: 'warning',
                title: '<span style="color:#045C99;font-size:22px;">Atenção!</span>',
                html: '<label style="color:#045C99;font-size:20px;text-align:left;">' + DadFuncRel.msgFiltro + '<label>',
                footer: ScriptsConfig.footerAlert
            });
        }
    }

    export function gerarPDFPorCpfMatriculaNomePeriodo(usr_cpf: string, matric?: number, nome?: string, dt_ini?: string, dt_fim?: string) {
        const cpf = String(usr_cpf || '').replace(/\D/g, '');
        const matricula = matric || Number($('input[name="matricula"]').val() as string || '0');
        const nomeBusca = String(nome || $('input[name="nome"]').val() as string || '').trim();
        // The PDF endpoint expects the same MM/YYYY period format used by the
        // regular search. Do not convert to YYYYMM here; send raw values.
        const per_dt_ini = dt_ini || String($('input[name="per_dt_ini"]').val() as string || '');
        const per_dt_fim = dt_fim || String($('input[name="per_dt_fim"]').val() as string || '');

        Swal.fire({
            title: '<strong style="color:#045C99;">Dados Funcionais PDF</strong>',
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


        $.post('/DadosFuncionais/GerarPdfDadosFuncionais', { cpf: cpf, matricula: matricula, nome: nomeBusca, dt_ini: per_dt_ini, dt_fim: per_dt_fim }, function (data) {
            console.log('success');
            console.log(data);

            if (data.sucesso) {
                window.open('/DadosFuncionais/abrirPdfDadosFuncionaisGerado', 'popup', 'height=1080,width=1024,toolbar=no');
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

    /**
     * Versão otimizada para gerar PDF com apenas fun_numero.
     * Garante que o PDF será gerado com exatamente o mesmo funcionário
     * que está carregado no formulário.
     */
    export function gerarPDFComFunNumero(funNumero: number, dt_ini?: string, dt_fim?: string) {
        const per_dt_ini = dt_ini || String($('input[name="per_dt_ini"]').val() as string || '');
        const per_dt_fim = dt_fim || String($('input[name="per_dt_fim"]').val() as string || '');

        Swal.fire({
            title: '<strong style="color:#045C99;">Dados Funcionais PDF</strong>',
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
                const loader = Swal.getPopup().querySelector('.swal2-loader') as HTMLElement;
                if (loader) {
                    loader.style.color = '#045C99';
                    loader.style.borderRightColor = 'transparent';
                }
            }
        });

        $.post('/DadosFuncionais/GerarPdfDadosFuncionais', 
            { 
                fun_numero: funNumero, 
                dfu_numero: funNumero,
                dt_ini: per_dt_ini, 
                dt_fim: per_dt_fim 
            }, 
            function (data) {
                console.log('success');
                console.log(data);

                if (data.sucesso) {
                    window.open('/DadosFuncionais/abrirPdfDadosFuncionaisGerado', 'popup', 'height=1080,width=1024,toolbar=no');
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
            }, 
            'json'
        )
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
            DadFuncRel.gerarPDF();
        });

        $('#btn-voltar-dados_funcionais').on('click', function (e) {
            $('#div-filtro').css('display', 'none');
            $('#div-resultado-dados-funcionais').css('display', 'block');
            $('#dados_funcionais').css('display', 'none');
            //DadFuncRel.consultarDadosFuncionais();
        });

        $('input[name="cpf_busca"]').on('input', function () {
            var cpf_busca = ($(this).val() as string);
        });

        $('#div-lista-evento-question tbody').on('click', 'button.btn-editar-lista-questionarios', function () {
            const eve_num_evento = Number($(this).data('eve') || 0);
            // const que_num_questionario = Number($(this).data('que') || 0);
            $('input[name="eve_num_evento"]').val(eve_num_evento);
            $('input[name="que_num_questionario"]').val(0);
            // DadFuncRel.editarEventoQuestionrio(eve_num_evento)
        });

        // $('#div-lista-questionario tbody').on('click', 'button.btn-editar-questionario', function () {
        //     const eve_num_evento = Number($(this).data('eve') || 0);
        //     const que_num_questionario = Number($(this).data('que') || 0);
        //     $('input[name="eve_num_evento"]').val(eve_num_evento);
        //     $('input[name="que_num_questionario"]').val(que_num_questionario);
        //     console.log(DadFuncRel.questionariosDtos);
        //     let questionario = DadFuncRel.
        //         questionariosDtos.find(x => x.que_num_questionario === que_num_questionario);
        //     console.log(questionario);
        //     if (questionario) {
        //         // Estat.editarQuestionrio(questionario);
        //         // $('#div-lista-evento-question').css('display', 'none');
        //         // $('#div-lista-questionario').css('display', 'none');
        //         // $('#div-formulario-questionario').css('display', 'block');
        //         // DadFuncRel.carregarContagemPorNotaResultado()
        //     }
        // });


        $('button[name="btn-fechar-lista"]').on('click', function (e) {
            $('form[name="formRelFinanceiro"] input[name="cpf_busca"]').val('');
            $('form[name="formRelFinanceiro"] input[name="matricula"]').val('');
            $('form[name="formRelFinanceiro"] input[name="per_dt_ini"]').val('');
            $('form[name="formRelFinanceiro"] input[name="per_dt_fim"]').val('');

            $('#div-filtro').css('display', 'block');
            $('#dados_funcionais').css('display', 'none');
            $('#div-resultado-financeiro').css('display', 'none');
        });

        $('button[name="btn-salvar-questionario"]').on('click', function (e) {
            // Estat.salvarQuestionario();
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

        $('button[name="btnBuscar"]').on('click', function (e) {
            e.preventDefault();
            DadFuncRel.consultarDadosFuncionais();
        });


        // Botão para voltar da lista para o filtro
        $('#btn-fechar-lista').on('click', function (e) {
            e.preventDefault();
            $('input[name="cpf_busca"]').val('');
            $('input[name="matricula"]').val('');
            $('input[name="nome"]').val('');
            $('#div-filtro').css('display', 'block');
            $('#div-resultado-dados-funcionais').css('display', 'none');
            $('#dados_funcionais').css('display', 'none');
            if (DadFuncRel.dataTableInstanceDadosFuncionais) {
                DadFuncRel.dataTableInstanceDadosFuncionais.destroy();
                DadFuncRel.dataTableInstanceDadosFuncionais = null;
            }
        });

        // Botão para voltar do formulário para a lista
        $('#btn-voltar-dados_funcionais').on('click', function (e) {
            e.preventDefault();
            $('#div-filtro').css('display', 'none');
            $('#dados_funcionais').css('display', 'none');
            $('#div-resultado-dados-funcionais').css('display', 'block');
        });

        /*
        setTimeout(() => {
            console.log("This prints after 2 seconds!");
            fetchDataAndInitializeTable();
        }, 200);
        */

    });

}


declare module "DadFuncRel" {
    export = DadFuncRel;
}
