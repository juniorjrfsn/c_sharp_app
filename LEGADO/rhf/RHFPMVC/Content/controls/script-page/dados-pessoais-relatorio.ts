// File: script-page/relatorios-dados-pessoais.ts

/// <reference path="../config-scripts/@types/jquery/index.d.ts" />
/// <reference path="../config-scripts/@types/jquery.form/index.d.ts" />

/// <reference path="../config-scripts/@types/datatables.net/types/types.d.ts" />
/// <reference path="../config-scripts/sweetalert2.d.ts" />
/// <reference path="../config-scripts/config.ts" />
/// <reference path="../config-scripts/ScriptsConfig.d.ts" />
/// <reference path="../config-scripts/highcharts.d.ts" />



namespace DadPessRel {
    export let tempo: number = Date.now();

    export let validoFiltro: boolean = true;
    export let msgFiltro: string = '';

    let municipiosList: any[] = [];
    let carregandoMunicipios = false;
    let selectedIndex = -1;


    export let container;
    
    export let dataTableInstanceEventos: any | null = null;
    export let dataTableInstance: any | null = null;
    export let dataTableInstanceEveQuestion: any | null = null;
    export let dataTableInstanceEventosQuestionarios: any | null = null;
    export let dataTableInstanceDadosPessoais: any | null = null;

    export let _ano: string = '0';
    export let _mes: string = '0';

    export let eve_num_evento: number = 0;

    export let que_num_questionario: number = 0;

    // Dados Pessoais
    export let listaDadosPessoais: any[] = [];
    export let selectedPessoa: any | null = null;

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

    export function mascararCpf(cpf: any): string {
        const str = String(cpf ?? '').replace(/\D/g, '');
        if (str.length !== 11) return str;
        return `***.${str.substring(3, 6)}.${str.substring(6, 9)}-**`;
    }

    export function carregarIndices() { }

    // ============== DADOS PESSOAIS - Datatable Functions ==============

    /**
     * Realiza a consulta de dados pessoais via AJAX
     */
    export function consultarDadosPessoais() {
        const cpf = $('#cpf_busca').val() || '';
        const matricula = $('#matricula').val() || '';
        const nome = $('#per_nome').val() || '';

        if (!cpf && !matricula && !nome) {
            Swal.fire({
                icon: 'warning',
                title: 'Aviso',
                text: 'Por favor, informe pelo menos um critério de busca (CPF, Matrícula ou Nome)',
                footer: ScriptsConfig.footerAlert
            });
            return;
        }

        const url = '/DadosFuncionais/GetDadosPessoais';
        const dados = {
            cpf_busca: cpf,
            matricula: matricula,
            nome: nome
        };

        $.ajax({
            url: url,
            type: 'POST',
            data: dados,
            dataType: 'json',
            success: function (response) {
                if (response.sucesso && response.lista && response.lista.length > 0) {
                    DadPessRel.listaDadosPessoais = response.lista;
                    inicializarDataTableDadosPessoais(response.lista);
                    
                    // Mostrar resultado e esconder filtro
                    $('#div-filtro').css('display', 'none');
                    $('#div-resultado-dados-pessoais').css('display', 'block');
                    $('#dados_pessoais').css('display', 'none');
                     
                } else {
                    Swal.fire({
                        icon: 'info',
                        title: 'Sem resultados',
                        text: response.msg || 'Nenhum registro encontrado para os parâmetros informados',
                        footer: ScriptsConfig.footerAlert
                    });
                }
            },
            error: function (xhr, status, error) {
                console.error('Erro na consulta:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Erro',
                    text: 'Erro ao buscar dados pessoais: ' + error,
                    footer: ScriptsConfig.footerAlert
                });
            }
        });
    }

    /**
     * Inicializa o DataTable com os dados de pessoas
     */
    export function inicializarDataTableDadosPessoais(dados: any[]) {
        // Destruir instância anterior se existir
        if (DadPessRel.dataTableInstanceDadosPessoais) {
            DadPessRel.dataTableInstanceDadosPessoais.destroy();
            DadPessRel.dataTableInstanceDadosPessoais = null;
        }

        // Limpar tbody
        $('#table-lista-dados-pessoais tbody').empty();

        // Gerar HTML das linhas
        let html = '';
        dados.forEach((item: any, index: number) => {
            html += `<tr data-index="${index}" style="cursor: pointer;">
                <td style="text-align:center;">${item.dpe_matricula || ''}</td>
                <td>${item.dpe_nome_servidor || ''}</td>
                <td style="text-align:center;">${mascararCpf(item.dpe_cpf_servidor) || ''}</td>
                <td style="text-align:center;">${item.dpe_desc_cbo || ''}</td>
                <td style="text-align:center;">${item.dpe_desc_situacao || ''}</td>
                <td style="text-align: center;">
                    <button type="button" class="btn btn-sm btn-outline-light btn-ver-pessoa" data-index="${index}" title="Ver detalhes">
                        <i class="fa-solid fa-eye text-info fa-lg"></i>
                    </button>
                </td>
                <td style="text-align: center;">
                    <button type="button" class="btn btn-sm btn-outline-light btn-gerar-pdf-pessoa" data-index="${index}" title="Gerar PDF">
                        <i class="fa-regular fa-file-pdf text-danger fa-lg"></i>
                    </button>
                </td>
            </tr>`;
        });

        $('#table-lista-dados-pessoais tbody').html(html);

        // Inicializar DataTable
        DadPessRel.dataTableInstanceDadosPessoais = $('#table-lista-dados-pessoais').DataTable({
            paging: true,
            pageLength: 10,
            lengthMenu: [10, 25, 50, 100],
            destroy: true,
            searching: true,
            ordering: true,
            language: {
                url: 'https://cdn.datatables.net/plug-ins/1.13.6/i18n/pt-BR.json'
            }
        });

        // ====== EVENT HANDLERS ======
        
        // Clique na linha da tabela
        $('#table-lista-dados-pessoais tbody').on('click', 'tr', function (e) {
            if ($(e.target).closest('button').length > 0) return; // Não fazer nada se clicou em botão

            const index = $(this).data('index');
            preencherFormularioDadosPessoais(index);
            $('#div-filtro').css('display', 'none');
            $('#div-resultado-dados-pessoais').css('display', 'none');
            $('#dados_pessoais').css('display', 'block');
        });

        // Botão Ver
        $('#table-lista-dados-pessoais tbody').on('click', 'button.btn-ver-pessoa', function (e) {
            e.stopPropagation();
            const index = $(this).data('index');
            preencherFormularioDadosPessoais(index);
            $('#div-filtro').css('display', 'none');
            $('#div-resultado-dados-pessoais').css('display', 'none');
            $('#dados_pessoais').css('display', 'block');
        });

        // Botão Gerar PDF
        $('#table-lista-dados-pessoais tbody').on('click', 'button.btn-gerar-pdf-pessoa', function (e) {
            e.stopPropagation();
            const index = $(this).data('index');
            const pessoa = DadPessRel.listaDadosPessoais[index];
            
            // Preencher o formulário
            preencherFormularioDadosPessoais(index);
            $('#div-filtro').css('display', 'none');
            $('#div-resultado-dados-pessoais').css('display', 'none');
            $('#dados_pessoais').css('display', 'block');
            // Simular o clique do botão PDF após um pequeno delay
            setTimeout(function () {
                // $('#btnGerarPDF').trigger('click');
                DadPessRel.gerarPDFDoFormulario();
            }, 100);
        });
    }

    /**
     * Preenche o formulário com os dados da pessoa selecionada
     */
    export function preencherFormularioDadosPessoais(index: number) {
        const pessoa = DadPessRel.listaDadosPessoais[index];
        if (!pessoa) return;

        DadPessRel.selectedPessoa = pessoa;

        // Preencher Filtro para gerar dados
        $('#cpf_busca').val(pessoa.dpe_cpf_servidor || '');
        $('#matricula').val(pessoa.dpe_matricula || '');
        $('#per_nome').val(pessoa.dpe_nome_servidor || '');

        // Preencher campos básicos
        $('#dpe_matricula').val(pessoa.dpe_matricula || '');
        $('#dpe_nome_servidor').val(pessoa.dpe_nome_servidor || '');
        $('#dpe_cpf_servidor').val(formatarCPF(pessoa.dpe_cpf_servidor) || '');
        $('#dpe_desc_situacao').val(pessoa.dpe_desc_situacao || '');
        $('#dpe_desc_grau_instrucao').val(pessoa.dpe_desc_grau_instrucao || '');
        $('#dpe_desc_estado_civil').val(pessoa.dpe_desc_estado_civil || '');
        $('#dpe_dt_nascimento').val(formatarData(pessoa.dpe_dt_nascimento) || '');
        $('#dpe_nome_municipio_nascimento').val(pessoa.dpe_nome_municipio_nascimento || '');
        $('#dpe_nome_mae').val(pessoa.dpe_nome_mae || '');
        $('#dpe_nome_pai').val(pessoa.dpe_nome_pai || '');
        $('#dpe_cep').val(pessoa.dpe_cep || '');
        $('#dpe_endereco').val(pessoa.dpe_endereco || '');
        $('#dpe_complemento_logradouro').val(pessoa.dpe_complemento_logradouro || '');
        $('#dpe_nome_municipio_endereco').val(pessoa.dpe_nome_municipio_endereco || '');
        $('#dpe_desc_cbo').val(pessoa.dpe_desc_cbo || '');
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

    export function processDataForTable(data: any[]) {
        const processed: any[] = [];

        if (!Array.isArray(data)) {
            return processed;
        }

        data.forEach(item => {
            processed.push({
                dpe_numero: Number(item.dpe_numero) || 0,
                dpe_matricula: Number(item.dpe_matricula) || 0,
                dpe_dt_atualizacao: item.dpe_dt_atualizacao || '',
                dpe_nome_servidor: item.dpe_nome_servidor || '',
                dpe_cpf_servidor: item.dpe_cpf_servidor || '',
                dpe_num_doc_identidade: item.dpe_num_doc_identidade || '',
                dpe_orgao_doc_identidade: item.dpe_orgao_doc_identidade || '',
                dpe_uf_doc_identidade: item.dpe_uf_doc_identidade || '',
                dpe_num_registro: item.dpe_num_registro || '',
                dpe_orgao_registro: item.dpe_orgao_registro || '',
                dpe_uf_registro: item.dpe_uf_registro || '',
                dpe_num_cntps: item.dpe_num_cntps || '',
                dpe_serie_cntps: item.dpe_serie_cntps || '',
                dpe_uf_cntps: item.dpe_uf_cntps || '',
                dpe_num_titulo_eleitor: item.dpe_num_titulo_eleitor || '',
                dpe_secao_eleitoral: item.dpe_secao_eleitoral || '',
                dpe_zona_eleitoral: item.dpe_zona_eleitoral || '',
                dpe_pis_pasep: item.dpe_pis_pasep || '',
                dpe_num_conta_bancaria_anterior: item.dpe_num_conta_bancaria_anterior || '',
                dpe_cod_banco_anterior: item.dpe_cod_banco_anterior || '',
                dpe_cod_agencia_bancaria_anterior: item.dpe_cod_agencia_bancaria_anterior || '',
                dpe_num_razao: item.dpe_num_razao || '',
                dpe_num_cbo: Number(item.dpe_num_cbo) || 0,
                dpe_desc_cbo: item.dpe_desc_cbo || '',
                dpe_cod_estado_civil: Number(item.dpe_cod_estado_civil) || 0,
                dpe_desc_estado_civil: item.dpe_desc_estado_civil || '',
                dpe_cod_grau_instrucao: Number(item.dpe_cod_grau_instrucao) || 0,
                dpe_desc_grau_instrucao: item.dpe_desc_grau_instrucao || '',
                dpe_dt_admissao: item.dpe_dt_admissao || '',
                dpe_dt_nascimento: item.dpe_dt_nascimento || '',
                dpe_cod_municipio_nascimento: Number(item.dpe_cod_municipio_nascimento) || 0,
                dpe_nome_municipio_nascimento: item.dpe_nome_municipio_nascimento || '',
                dpe_cod_salario_familia_especial: Number(item.dpe_cod_salario_familia_especial) || 0,
                dpe_cod_imposto_renda: Number(item.dpe_cod_imposto_renda) || 0,
                dpe_cod_salario_familia: Number(item.dpe_cod_salario_familia) || 0,
                dpe_nome_pai: item.dpe_nome_pai || '',
                dpe_nome_mae: item.dpe_nome_mae || '',
                dpe_cod_servidor: item.dpe_cod_servidor || '',
                dpe_nome_conjuge: item.dpe_nome_conjuge || '',
                dpe_endereco: item.dpe_endereco || '',
                dpe_bairro: item.dpe_bairro || '',
                dpe_cod_municipio_endereco: Number(item.dpe_cod_municipio_endereco) || 0,
                dpe_nome_municipio_endereco: item.dpe_nome_municipio_endereco || '',
                dpe_complemento_logradouro: item.dpe_complemento_logradouro || '',
                dpe_num_militar: item.dpe_num_militar || '',
                dpe_categoria_militar: item.dpe_categoria_militar || '',
                dpe_num_csm_militar: item.dpe_num_csm_militar || '',
                dpe_cod_origem: Number(item.dpe_cod_origem) || 0,
                dpe_dt_chegada: item.dpe_dt_chegada || '',
                dpe_cod_previsul: item.dpe_cod_previsul || '',
                dpe_cod_situacao: Number(item.dpe_cod_situacao) || 0,
                dpe_desc_situacao: item.dpe_desc_situacao || '',
                dpe_cep: Number(item.dpe_cep) || 0,
                dpe_telefone: item.dpe_telefone || '',
                dpe_num_conta_bancaria: item.dpe_num_conta_bancaria || '',
                dpe_digito_conta_bancaria: item.dpe_digito_conta_bancaria || '',
                dpe_cod_agencia_bancaria: item.dpe_cod_agencia_bancaria || '',
                dpe_digito_agencia_bancaria: item.dpe_digito_agencia_bancaria || '',
                dpe_cod_banco: item.dpe_cod_banco || '',
                dpe_casa_propria: item.dpe_casa_propria || '',
                dpe_cpf_proprio: item.dpe_cpf_proprio || '',
                dpe_cod_operacao_bancaria: item.dpe_cod_operacao_bancaria || '',
                dpe_dt_expedicao_rg: item.dpe_dt_expedicao_rg || ''
            });
        });

        return processed;
    }

    export function gerarHTML(financeiro) {
        if (!Array.isArray(financeiro)) {
            console.warn('gerarHTML recebeu financeiro inválido:', financeiro);
            return;
        }

        const containerElement = document.getElementById('lista-dados-pessoais');
        if (!containerElement) {
            console.warn('Elemento #lista-dados-pessoais não encontrado.');
            return;
        }

        if (financeiro.length === 0) {
            containerElement.innerHTML = '<div class="alert alert-info">Nenhum registro financeiro encontrado.</div>';
            return;
        }


        // ATENÇÃO: gerarHTML recebe a lista BRUTA (não agrupada) e faz o
        // agrupamento aqui dentro. Não chame agruparFinanceiro antes de
        // passar o valor para esta função, ou o agrupamento acontece 2x.
        const agrupadoPorServidor = agruparDadosPessoais(financeiro);

        let html = '<div class="card mb-3"><div class="card-body"><h4 class="card-title">Relatório Dados Pessoais</h4></div></div>';

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

    export function agruparDadosPessoais(dados: any[]) {
        if (!Array.isArray(dados)) {
            console.warn('agruparDadosPessoais recebeu um valor inválido:', dados);
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

    export function initializeDataTable(data, mes, ano, pageLength) {

        // console.log('Inicializando DataTable...');
        if (!Array.isArray(data)) {
            console.error('Os dados recebidos não são válidos:', data);
            data = [];
        }

        console.table(data);

        // Se já existe uma instância anterior, destruir de forma segura
        try {
            if ($.fn && $.fn.dataTable && $.fn.dataTable.isDataTable && $.fn.dataTable.isDataTable('#table-lista-dados-pessoais')) {
                try {
                    const existing = $('#table-lista-dados-pessoais').DataTable();
                    existing.clear && existing.clear();
                    existing.destroy && existing.destroy();
                } catch (err) {
                    console.warn('Falha ao destruir DataTable via API:', err);
                }
                // Remover elementos remanescentes que o plugin pode ter criado
                try { $('.dt-buttons').remove(); } catch (e) { }
                try { $('.fixedHeader-floating').remove(); } catch (e) { }
                try { $('#table-lista-dados-pessoais_wrapper').remove(); } catch (e) { }
                DadPessRel.dataTableInstance = null;
            }
        } catch (e) {
            console.warn('Erro ao verificar/destruir DataTable anterior:', e);
        }
        $('#table-lista-dados-pessoais tbody').empty();

        // console.log('Inicializando DataTable com os dados recebidos...');
        DadPessRel.dataTableInstance = $('#table-lista-dados-pessoais').DataTable({
            data: data,
            paging: true, // Ativa a paginação
            pageLength: pageLength,
            destroy: true,
            fixedHeader: true,
            info: true,
            lengthMenu: [100, 250, 500, 750, 1000],
            dom: 'Bfrtip',
            buttons: [
                {
                    extend: 'excelHtml5', // 'excelHtml5',
                    extension: '.xlsx',
                    header: true,
                    footer: false,
                    autoFilter: false,
                    bom: false,
                    sheetName: 'SigEventos ' + mes + '-de-' + ano,
                    messageTop: 'SigEventos: ' + mes + '/' + ano,
                    text: '<i class="far fa-file-excel text-success fa-lg"></i>'
                    , title: null
                    , filename: function () {
                        return 'SigEventos-mes-' + mes + '-de-' + ano; // + '-' + dt_gerado;
                    },
                    exportOptions: {
                        columns: [0, 1, 3],
                        format: {
                            body: function (data, row, column, node: any) {
                                console.log(data);
                                const $vale = $(data);
                                console.log($vale.filter('.mes_ano').val());

                                switch (column) {
                                    case 0:
                                        // return $(node).find('input').val();
                                        return $(node).find('input[type="text"]').val()?.toString();
                                        break;
                                    case 1:
                                        // return $(node).find('span').text();
                                        return $(node).find('input[type="hidden"]').val();
                                        break;
                                    case 2:
                                        return $(node).find('div').text();
                                        //return $(node).find('input.monet').val()?.toString().replace('.', '').replace('.', '').replace('.', '').replace(',', '.');
                                        break;
                                    case 3:
                                        return $(node).find('span').text();
                                        // return $(node).find('select option:selected').text();
                                        // return $(node).find('input.monetIndice').val()?.toString().replace('.', '').replace('.', '').replace('.', '').replace(',', '.');
                                        break;
                                    case 4:
                                        return $(node).find('button').text();
                                        // return $(node).find('input.monetIndice').val()?.toString().replace('.', '').replace('.', '').replace('.', '').replace(',', '.');
                                        break;
                                    // case 5:
                                    //     return $(node).find('input.monet').val()?.toString().replace('.', '').replace('.', '').replace('.', '').replace(',', '.');
                                    //     break;
                                    // case 6:
                                    //     return $(node).find('input.monet').val()?.toString().replace('.', '').replace('.', '').replace('.', '').replace(',', '.');
                                    //     break;
                                    // case 7:
                                    //     return $(node).find('label.esquer').text() + ' / ' + $(node).find('label.direi').text();
                                    //     break;
                                    // case 8:
                                    //     return $(node).find('label.esquer').text() + ' / ' + $(node).find('label.direi').text();
                                    //     break;
                                    // case 9:
                                    //     return $(node).find('input.monet').val()?.toString().replace('.', '').replace('.', '').replace('.', '').replace(',', '.');
                                    //     break;
                                    // case 10:
                                    //     return $(node).find('input.monet').val()?.toString().replace('.', '').replace('.', '').replace('.', '').replace(',', '.');
                                    //     break;
                                    // case 11:
                                    //     return $(node).find('select option:selected').text();
                                    //     break;
                                    default:
                                        return $(node).find('input[type="text"]').val();
                                }

                            }
                        }
                    }
                    //, orientation: 'portrait'
                    //, exportOptions: { columns: [0, 1, 2, 3, 4]  }
                },
                {
                    extend: 'pdfHtml5',
                    title: null,
                    filename: function () {
                        return 'SigEventos-mes-' + mes + '-de-' + ano; // + '-' + dt_gerado;
                    },
                    text: '<i class="fa-regular fa-file-pdf text-danger fa-lg"></i>',
                    exportOptions: {
                        columns: [0, 1, 3],
                        format: {
                            body: function (data, row, column, node: any) {
                                console.log(data);
                                const $vale = $(data);
                                console.log($vale.filter('.usr_cpf').val());

                                switch (column) {
                                    case 0:
                                        // return $(node).find('input').val();
                                        return $(node).find('input[type="text"]').val()?.toString();
                                        break;
                                    case 1:
                                        // return $(node).find('span').text();
                                        return $(node).find('input[type="hidden"]').val();
                                        break;
                                    case 2:
                                        return $(node).find('div').text();
                                        //return $(node).find('input.monet').val()?.toString().replace('.', '').replace('.', '').replace('.', '').replace(',', '.');
                                        break;
                                    case 3:
                                        return $(node).find('span').text();
                                        // return $(node).find('select option:selected').text();
                                        // return $(node).find('input.monetIndice').val()?.toString().replace('.', '').replace('.', '').replace('.', '').replace(',', '.');
                                        break;
                                    case 4:
                                        return $(node).find('button').text();
                                        // return $(node).find('input.monetIndice').val()?.toString().replace('.', '').replace('.', '').replace('.', '').replace(',', '.');
                                        break;
                                    default:
                                        return $(node).find('input[type="text"]').val();
                                }
                            }
                        }
                    }
                    //Columns to export
                    //exportOptions: {
                    //     columns: [0, 1, 2, 3, 4, 5, 6]
                    //  }
                },
                {
                    extend: 'colvis',
                    autoFilter: true,
                    sheetName: 'colvis',
                    text: '<i class="fas fa-columns text-primary fa-lg"></i>',
                    orientation: 'portrait',
                    customize: function (doc) {
                        /*
                            doc.content[1].table.widths = Array(doc.content[1].table.body[0].length + 1).join('*').split('');
                            var rowCount = doc.content[1].table.body.length;
                            for (i = 0; i < rowCount + 1; i++) {
                                doc.content[1].table.body[i][4].alignment = 'right';
                                doc.content[1].table.body[i][5].alignment = 'right';
                            }
                        */
                    },
                    exportOptions: {
                        columns: [0, 1, 2, 3, 4]
                    }
                }
            ],
            initComplete: function () {
                // usa a instância que você já guardou
                var table = DadPessRel.dataTableInstance;

                // remove todos os botões (Excel, PDF e ColVis)
                table.buttons([0, 1, 2]).remove();

                // ou, se preferir por classe:
                // table.buttons('.btn-excel').remove();
                // table.buttons('.btn-pdf').remove();
                // table.buttons('.btn-colvis').remove();
            },
            lengthChange: true,
            searching: false,
            ordering: true,
            columns: [
                {
                    data: 'dpe_matricula', className: 'editable',
                    createdCell: function (td, cellData, rowData, row, col) {
                        let accesskey = (rowData.dpe_matricula || 0) + '_' + (rowData.dpe_cpf_servidor || 0);
                        $(td)
                            .attr('id', `linh[${row}][dpe_matricula]`)
                            .attr('row', row)
                            .attr('col', col)
                            .attr('campo', 'dpe_matricula')
                            .attr('data-dpe_matricula', rowData.dpe_matricula || '0')
                            .attr('data-dpe_cpf_servidor', rowData.dpe_cpf_servidor || '0')
                            .attr('accesskey', accesskey);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            // var colorCancel = ((row.pim_situacao === 'A') ? '' : 'color:red;');
                            let dpe_matricula = data;
                            let accesskey = (row.dpe_matricula || 0) + '_' + (row.dpe_cpf_servidor || 0);
                            return `
                                  <td data-dpe_matricula="${row.dpe_matricula || 0}" data-dpe_cpf_servidor="${row.dpe_cpf_servidor || 0}" accesskey="${accesskey}">
                                    <input type="text" class="form-control" accesskey="${accesskey}"  
                                        name="inpu[${accesskey}][dpe_matricula]" id="inpu[${accesskey}][dpe_matricula]"
                                        data-dpe_matricula="${row.dpe_matricula || 0}" 
                                        data-dpe_cpf_servidor="${row.dpe_cpf_servidor || 0}"
                                        onblur="javascript:DadPessRel.validarCampos(${row.dpe_matricula || 0},'dpe_matricula');"
                                        value="${dpe_matricula || ''}"  readonly="readonly"
                                    style="width:100%;" />
                                </td>
                            `;
                        }
                        return data;
                    }
                }, {
                    data: 'dpe_nome_servidor', className: 'editable',
                    createdCell: function (td, cellData, rowData, row, col) {
                        // console.log(col + ' :: accesskey:' + tempo);
                        let accesskey = (rowData.dpe_matricula || 0) + '_' + (rowData.dpe_cpf_servidor || 0);
                        $(td)
                            .attr('id', `linh[${row}][dpe_nome_servidor]`)
                            .attr('row', row)
                            .attr('col', col)
                            .attr('campo', 'dpe_nome_servidor')
                            .attr('data-dpe_matricula', rowData.dpe_matricula || '0')
                            .attr('data-dpe_cpf_servidor', rowData.dpe_cpf_servidor || '0')
                            .attr('accesskey', accesskey);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            var colorCancel = '';
                            // let valor = Number(data); 
                            // var colorCancel = ((row.pim_situacao === 'A') ? '' : 'color:red;');
                            let dpe_nome_servidor = data;
                            let accesskey = (row.dpe_matricula || 0) + '_' + (row.dpe_cpf_servidor || 0);
                            return `
                                <td data-dpe_matricula="${row.dpe_matricula || 0}" data-dpe_cpf_servidor="${row.dpe_cpf_servidor || 0}" accesskey="${accesskey}">
                                    <input type="hidden" class="form-control dpe_matricula"
                                        name="inpu[${accesskey}][dpe_matricula]"
                                        id="inpu[${accesskey}][dpe_matricula]"
                                        value="${row.dpe_matricula || 0}"
                                        accesskey="${accesskey}"  />

                                    <input type="hidden" class="form-control dpe_cpf_servidor"
                                        name="inpu[${accesskey}][dpe_cpf_servidor]"
                                        id="inpu[${accesskey}][dpe_cpf_servidor]"
                                        value="${row.dpe_cpf_servidor || 0}"
                                        accesskey="${accesskey}"  />

                                    <input type="text" class="form-control" accesskey="${accesskey}"  
                                        name="inpu[${accesskey}][dpe_nome_servidor]" id="inpu[${accesskey}][dpe_nome_servidor]"
                                        data-dpe_matricula="${row.dpe_matricula || 0}" 
                                        data-dpe_cpf_servidor="${row.dpe_cpf_servidor || 0}"
                                        onblur="javascript:DadPessRel.validarCampos(${row.dpe_matricula || 0},'dpe_nome_servidor');"
                                        value="${dpe_nome_servidor || ''}"  readonly="readonly"
                                    style="width:100%;" />
                                </td>
                            `;
                        }
                        return data;
                    }
                },
                {
                    data: 'dpe_cpf_servidor', className: 'editable usr_cpf',
                    createdCell: function (td, cellData, rowData, row, col) {
                        // console.log(col + ' :: accesskey:' + tempo);
                        let accesskey = (rowData.dpe_matricula || 0) + '_' + (rowData.dpe_cpf_servidor || 0);
                        $(td)
                            .attr('id', `linh[${row}][dpe_cpf_servidor]`)
                            .attr('row', row)
                            .attr('col', col)
                            .attr('campo', 'dpe_nome_servidor')
                            .attr('data-dpe_matricula', rowData.dpe_matricula || '0')
                            .attr('data-dpe_cpf_servidor', rowData.dpe_cpf_servidor || '0')
                            .attr('accesskey', accesskey);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            var colorCancel = '';
                            let accesskey = (row.dpe_matricula || 0) + '_' + (row.dpe_cpf_servidor || 0);

                            let usr_cpf = "";
                            if (row.dpe_cpf_servidor.length === 11) {
                                usr_cpf = "***." + row.dpe_cpf_servidor.substring(3, 6) + "." + row.dpe_cpf_servidor.substring(6, 9) + "-**";
                            } else {
                                usr_cpf = row.dpe_cpf_servidor;
                            }

                            return `
                                <td data-dpe_matricula="${row.dpe_matricula || 0}" data-dpe_cpf_servidor="${row.dpe_cpf_servidor || 0}"  accesskey="${accesskey}">

                                    <input type="hidden" class="form-control dpe_matricula"
                                        name="inpu[${accesskey}][dpe_matricula]"
                                        id="inpu[${accesskey}][dpe_matricula]"
                                        value="${row.dpe_matricula || 0}"
                                        accesskey="${accesskey}"  />

                                    <input type="hidden" class="form-control dpe_cpf_servidor"
                                        name="inpu[${accesskey}][dpe_cpf_servidor]"
                                        id="inpu[${accesskey}][dpe_cpf_servidor]"
                                        value="${row.dpe_cpf_servidor || 0}"
                                        accesskey="${accesskey}"  />

                                    <input type="text" class="form-control dpe_cpf_servidor"
                                        name="inpu[${accesskey}][dpe_cpf_servidor]"
                                        id="inpu[${accesskey}][dpe_cpf_servidor]"
                                        data-dpe_matricula="${row.dpe_matricula || 0}" 
                                        data-dpe_cpf_servidor="${row.dpe_cpf_servidor || 0}"
                                        value="${usr_cpf || ''}"
                                        onblur="javascript:DadPessRel.validarCampos(${row.dpe_cpf_servidor || accesskey}, 'dpe_cpf_servidor');"
                                        onclick="javascript:inputMascara();"
                                        maxlength="11"
                                        accesskey="${accesskey}" style="max-width:130px; ${colorCancel || ''}"  readonly="readonly" />
                                            
                                </td>

                            `;
                        }
                        return data; // Return raw data for other types (e.g., sorting, filtering)
                    }

                }, {
                    data: 'dpe_desc_cbo', className: 'editable',
                    createdCell: function (td, cellData, rowData, row, col) {
                        // console.log(col + ' :: accesskey:' + tempo);
                        let accesskey = (rowData.dpe_matricula || 0) + '_' + (rowData.dpe_cpf_servidor || 0);
                        $(td)
                            .attr('id', `linh[${row}][dpe_desc_cbo]`)
                            .attr('row', row)
                            .attr('col', col)
                            .attr('campo', 'dpe_desc_cbo')
                            .attr('data-dpe_matricula', rowData.dpe_matricula || '0')
                            .attr('data-dpe_cpf_servidor', rowData.dpe_cpf_servidor || '0')
                            .attr('accesskey', accesskey);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            // var colorCancel = ((row.pim_situacao === 'A') ? '' : 'color:red;');
                            // let valor = Number(data);
                            let accesskey = (row.dpe_matricula || 0) + '_' + (row.dpe_cpf_servidor || 0);
                            let dpe_desc_cbo = data;
                            return `
                                <td data-dpe_matricula="${row.dpe_matricula || 0}" data-dpe_cpf_servidor="${row.dpe_cpf_servidor || 0}"  accesskey="${accesskey}">
                                    <input type="text" class="form-control" accesskey="${accesskey}"  
                                        name="inpu[${accesskey}][dpe_desc_cbo]" id="inpu[${accesskey}][dpe_desc_cbo]"
                                        data-dpe_matricula="${row.dpe_matricula || 0}" 
                                        data-dpe_cpf_servidor="${row.dpe_cpf_servidor || 0}"
                                        onblur="javascript:DadPessRel.validarCampos(${row.dpe_desc_cbo || ''},'dpe_desc_cbo');"
                                        value="${dpe_desc_cbo || ''}"  readonly="readonly"
                                    style="width:100%;" />
                                </td>
                            `;
                        }
                        return data;
                    }
                }, {
                    data: 'dpe_desc_situacao', className: 'editable',
                    createdCell: function (td, cellData, rowData, row, col) {
                        // console.log(col + ' :: accesskey:' + tempo);
                        let accesskey = (rowData.dpe_matricula || 0) + '_' + (rowData.dpe_cpf_servidor || 0);
                        $(td)
                            .attr('id', `linh[${row}][dpe_desc_situacao]`)
                            .attr('row', row)
                            .attr('col', col)
                            .attr('campo', 'dpe_desc_situacao')
                            .attr('data-dpe_matricula', rowData.dpe_matricula || '0')
                            .attr('data-dpe_cpf_servidor', rowData.dpe_cpf_servidor || '0')
                            .attr('accesskey', accesskey);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            // var colorCancel = ((row.pim_situacao === 'A') ? '' : 'color:red;');
                            // let valor = Number(data);
                            let accesskey = (row.dpe_matricula || 0) + '_' + (row.dpe_cpf_servidor || 0);
                            let dpe_desc_situacao = data;
                            return `
                                <td data-dpe_matricula="${row.dpe_matricula || 0}" data-dpe_cpf_servidor="${row.dpe_cpf_servidor || 0}"  accesskey="${accesskey}">
                                    <input type="text" class="form-control" accesskey="${accesskey}"  
                                        name="inpu[${accesskey}][dpe_desc_situacao]" id="inpu[${accesskey}][dpe_desc_situacao]"
                                        data-dpe_matricula="${row.dpe_matricula || 0}" 
                                        data-dpe_cpf_servidor="${row.dpe_cpf_servidor || 0}"
                                        onblur="javascript:DadPessRel.validarCampos(${row.dpe_desc_situacao || ''},'dpe_desc_situacao');"
                                        value="${dpe_desc_situacao || ''}"  readonly="readonly"
                                    style="width:100%;" />
                                </td>
                            `;
                        }
                        return data;
                    }
                },
                {
                    data: null,
                    createdCell: function (td, cellData, rowData, row, col) {
                        let accesskey = (rowData.dpe_matricula || 0) + '_' + (rowData.dpe_cpf_servidor || 0);
                        $(td)
                            .attr('id', `linh[${row}][dados]`)
                            .attr('row', row)
                            .attr('col', col)
                            .attr('campo', 'dados')
                            .attr('data-dpe_matricula', rowData.dpe_matricula || '0')
                            .attr('data-dpe_cpf_servidor', rowData.dpe_cpf_servidor || '0')
                            .attr('accesskey', accesskey);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            let accesskey = (row.dpe_matricula || 0) + '_' + (row.dpe_cpf_servidor || 0);
                            return `
                                <td data-dpe_matricula="${row.dpe_matricula || 0}" data-dpe_cpf_servidor="${row.dpe_cpf_servidor || 0}"  accesskey="${accesskey}">
                                    <div class="form-group" style="100%;padding-bottom:0px;margin-bottom: 2px;text-align: center;background-color: #e9ecef;">
                                        <span class="form-control" accesskey="${accesskey}" id="inpu[${accesskey}][dados]" style="background-color: #e9ecef;"
                                            readonly="readonly"/>
                                            <button type="button" class="btn btn-light btn-buscar-dados" style="border:none;padding:0 8px;background-color: #e9ecef;" 
                                                data-dpe_matricula="${row.dpe_matricula || 0}" 
                                                data-dpe_cpf_servidor="${row.dpe_cpf_servidor || 0}"
                                                title="Buscar Dados Pessoais">
                                                <i class="fas fa-edit  fa-lg text-info"></i>
                                            </button>
                                        </span>
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
                        let accesskey = (rowData.dpe_matricula || 0) + '_' + (rowData.dpe_cpf_servidor || 0);
                        $(td)
                            .attr('id', `linh[${row}][pdf]`)
                            .attr('row', row)
                            .attr('col', col)
                            .attr('campo', 'dados')
                            .attr('data-dpe_matricula', rowData.dpe_matricula || '0')
                            .attr('data-dpe_cpf_servidor', rowData.dpe_cpf_servidor || '0')
                            .attr('accesskey', accesskey);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            let accesskey = (row.dpe_matricula || 0) + '_' + (row.dpe_cpf_servidor || 0);
                            return `
                                <td data-dpe_matricula="${row.dpe_matricula || 0}" data-dpe_cpf_servidor="${row.dpe_cpf_servidor || 0}"  accesskey="${accesskey}">
                                    <div class="form-group" style="100%;padding-bottom:0px;margin-bottom: 2px;text-align: center;background-color: #e9ecef;">
                                        <span class="form-control" accesskey="${accesskey}" id="inpu[${accesskey}][pdf]" style="background-color: #e9ecef;"
                                            readonly="readonly"/>
                                            <button type="button" class="btn btn-light btn-buscar-dados-pdf" style="border:none;padding:0 8px;background-color: #e9ecef;" 
                                                data-dpe_matricula="${row.dpe_matricula || 0}" 
                                                data-dpe_cpf_servidor="${row.dpe_cpf_servidor || 0}"
                                                title="Gerar PDF Dados Pessoais">
                                                <i class="fa-regular fa-file-pdf fa-lg text-danger"></i>
                                            </button>
                                        </span>
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
                { targets: [0, 1, 2, 3, 4, 5, 6], visible: true }, { targets: [], visible: false }
            ],
            order: [[0, 'asc']],
            autoFill: true
        }).draw();

        // console.log('DataTable inicializado com sucesso.');
    }
    
    export function fetchDataAndInitializeTable() {
        // console.log('Iniciando busca de dados da API...');
        var dadosForm = $('form[name="formRelDadosPessoais"]').serializeArray();
        var jqxhr = $.post('/DadosPessoais/ListaDadosPessoais', dadosForm, function (json) {

            if (json.qtd > 0) {
                if (json.sucesso) {
                    if (json.lista && json.lista.length > 0) {
                        $('input[name="busca"]').val('');
                        $('input[name="buscaLimpa"]').val('');
                        $('#div-filtro').css('display', 'none');
                        $('#dados_pessoais').css('display', 'none');
                        $('#div-resultado-dados-pessoais').css('display', 'block');
                        $('#div-lista-dados-pessoais').css('display', 'block');
                        $('#content-table').css('display', 'block');
                        $('#content-table').css('width', '100%');

                        let listaDadosPessoais = DadPessRel.processDataForTable(json.lista);

                        $.when(DadPessRel.initializeDataTable(listaDadosPessoais, DadPessRel._ano, DadPessRel._mes, 100)).then(function (data, textStatus, jqXHR) {
                            Swal.close();
                        });
                    } else {
                        DadPessRel.initializeDataTable([], DadPessRel._ano, DadPessRel._mes, 1);
                        Swal.close();
                    }
                } else {
                    DadPessRel.initializeDataTable([], DadPessRel._ano, DadPessRel._mes, 1);
                    Swal.close();

                }
            } else {
                ScriptsConfig.swalconfirmeActionAlertaWarning.fire({
                    icon: 'info',
                    title: '<code style="color:#045C99;font-size:22px;">Olá</code><br>',
                    imageUrl: "/Content/img/logo-ageprev-ms-origin.png",
                    imageWidth: 300,
                    width: 1080,
                    html: '<span style="color:#045C99;font-size:20px;">Não foram encontrados registros </b></span>'
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
            }
        }, "json").done(function (data) {
            // console.log("done success");
            //console.table(data);
            // console.table(data.lista);
        }).fail(function (_XMLHttpRequest_, textStatus, errorThrown) {
            //console.log("error");
            console.log(_XMLHttpRequest_); console.log(textStatus); console.log(errorThrown);
            // ScriptsConfig.failFunctionAjax(_XMLHttpRequest_, textStatus, errorThrown);
        }).always(function (data) {
            //console.log("finished");
            //console.table(data);
        });
    }

    function isFinanceiroAgrupado(dados: any[]): dados is Array<{ competencia: string; tipos: any[] }> {
        return Array.isArray(dados) && dados.length > 0 && typeof dados[0].competencia === 'string' && Array.isArray(dados[0].tipos);
    }

    function gerarFinanceiroAgrupadoHTML(financeiro: Array<{ competencia: string; tipos: any[] }>) {
        container = document.getElementById('lista-dados-pessoais');
        if (!container) {
            console.warn('Elemento #lista-dados-pessoais não encontrado.');
            return;
        }

        let html = '<div class="card"><div class="card-body"><h3>Relatório Dados Pessoais</h3></div></div>';

        financeiro.forEach(competencia => {
            html += `<div class="card mt-3"><div class="card-header"><strong>Competência:</strong> ${formatarCompetencia(competencia.competencia)}</div><div class="card-body">`;
            competencia.tipos.forEach(tipo => {
                html += `<div class="mb-3"><h5>Cargo: ${tipo.tipo_cargo_fi}</h5>`;
                html += '<div class="table-responsive"><table class="table table-sm table-striped"><thead><tr>' +
                    '<th>CPF</th><th>Nome</th><th>Matrícula</th><th>Cód. Rubrica</th><th>Rubrica</th><th>Data Início</th><th>Valor</th><th>% Pont./Dia/Hora</th><th>QTDE URV</th>' +
                    '</tr></thead><tbody>';
                tipo.registros.forEach(item => {
                    html += '<tr>' +
                        `<td>${item.cpf || ''}</td>` +
                        `<td>${item.nome || ''}</td>` +
                        `<td>${item.matricula || ''}</td>` +
                        `<td>${item.cod_rubrica_fi || ''}</td>` +
                        `<td>${item.pr_Rubrica || ''}</td>` +
                        // a linha abaixo a seguir precisa verificar se tem espaço em branco no final da string e substituir por ''
                        `<td>${((item.data_inicio_fi.trim() != '0' && item.data_inicio_fi.trim() != '00/00/0000' && item.data_inicio_fi.trim() != '30/12/1899' && item.data_inicio_fi.trim() != '01/01/1900') ? formatarDateToBr(item.data_inicio_fi.trim()) : '')}</td>` +
                        `<td>${formatarNumero(item.ala_fi_valor)}</td>` +
                        `<td>${formatarNumero(item.ala_fi_perc_pont_dia_hora)}</td>` +
                        `<td>${item.ala_fi_QTDE_URV != null ? item.ala_fi_QTDE_URV : ''}</td>` +
                        '</tr>';
                });
                html += '</tbody></table></div></div>';
            });
            html += '</div></div>';
        });

        container.innerHTML = html;
    }

    export function preencherCamposDadosPessoais(dados: any[]) {
        const pessoa = Array.isArray(dados) && dados.length > 0 ? dados[0] : null;
        if (!pessoa) {
            return;
        }

        const campos: Array<{ campo: string; valor?: any }> = [
            { campo: 'dpe_nome_servidor', valor: pessoa.dpe_nome_servidor },
            { campo: 'dpe_cpf_servidor', valor: pessoa.dpe_cpf_servidor },
            { campo: 'dpe_matricula', valor: pessoa.dpe_matricula },
            { campo: 'dpe_desc_cbo', valor: pessoa.dpe_desc_cbo },
            { campo: 'dpe_desc_situacao', valor: pessoa.dpe_desc_situacao },
            { campo: 'dpe_desc_grau_instrucao', valor: pessoa.dpe_desc_grau_instrucao },
            { campo: 'dpe_dt_nascimento', valor: pessoa.dpe_dt_nascimento },
            { campo: 'dpe_nome_municipio_nascimento', valor: pessoa.dpe_nome_municipio_nascimento },
            { campo: 'dpe_desc_estado_civil', valor: pessoa.dpe_desc_estado_civil },
            { campo: 'dpe_nome_mae', valor: pessoa.dpe_nome_mae },
            { campo: 'dpe_nome_pai', valor: pessoa.dpe_nome_pai },
            { campo: 'dpe_cep', valor: pessoa.dpe_cep },
            { campo: 'dpe_endereco', valor: pessoa.dpe_endereco },
            { campo: 'dpe_complemento_logradouro', valor: pessoa.dpe_complemento_logradouro },
            { campo: 'dpe_nome_municipio_endereco', valor: pessoa.dpe_nome_municipio_endereco }
        ];

        campos.forEach(({ campo, valor }) => {
            const input = document.getElementById(campo) as HTMLInputElement | null;
            if (input) {
                input.value = valor ?? '';
            }
        });
    }

    export function carregarDadosPessoais(cpf, matricula, nome) {
        console.log('Carregando dados pessoais');
        $('#div-lista-dados-pessoais').css('display', 'none');
        $('#dados_pessoais').css('display', 'block');
        var jqxhr = $.post("/DadosPessoais/ListaDadosPessoais", {
            cpf: cpf,
            matricula: matricula,
            nome: nome,
        }, function (data) {

            if (data.sucesso) {
                var dados = data.lista;
                if (dados && dados.length > 0) {

                    if (data.qtd > 0) {

                        let processedData = processDataForTable(dados);
                        console.table(processedData);
                        DadPessRel.preencherCamposDadosPessoais(processedData);

                        Swal.close();
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
                        } else {
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
            });

        return jqxhr;
    }

    export function validarBusca(cpf, matricula, per_nome) {
        const cpfLimpo = String(cpf ?? '').replace(/\D/g, '');
        const cpfInformado = cpfLimpo.length > 0;
        const possuiOutroFiltro = [matricula, per_nome]
            .some(valor => String(valor ?? '').trim().length > 0);

        DadPessRel.msgFiltro = '';

        if (!cpfInformado && !possuiOutroFiltro) {
            DadPessRel.validoFiltro = false;
            DadPessRel.msgFiltro = 'Informe pelo menos um filtro para realizar a busca.';
        } else if (cpfInformado && cpfLimpo.length !== 11) {
            DadPessRel.validoFiltro = false;
            DadPessRel.msgFiltro = '🔸 O campo CPF deve conter 11 dígitos.';
        } else {
            DadPessRel.validoFiltro = true;
        }

        return DadPessRel.validoFiltro;
    }

    export function gerarPDFDoFormulario() {
        const cpf = String($('input[name="dpe_cpf_servidor"]').val() as string || '').replace(/\D/g, '');
        const matricula = Number(String($('input[name="dpe_matricula"]').val() as string || '0'));
        const nome = String($('input[name="dpe_nome_servidor"]').val() as string || '').trim();

        if (!cpf && !matricula && !nome) {
            Swal.fire({
                icon: 'warning',
                title: 'Atenção',
                html: '<span style="color:#045C99;">Nenhum dado do formulário disponível para gerar o PDF.</span>',
                footer: ScriptsConfig.footerAlert
            });
            return;
        }

        DadPessRel.gerarPDFPorCpfMatriculaNomePeriodo(cpf, matricula, nome, '', '');
        // DadPessRel.consultarDadosPessoais();
    }




    export function gerarPDFPorCpfMatriculaNomePeriodo(usr_cpf: string, matric?: number, nome?: string, dt_ini?: string, dt_fim?: string) {
        const cpf = String(usr_cpf || '').replace(/\D/g, '');
        const matricula = matric || Number(String($('input[name="matricula"]').val() as string || '0'));
        const nomeBusca = String(nome || $('input[name="per_nome"]').val() as string || '').trim();
        const per_dt_ini = dt_ini || String($('input[name="per_dt_ini"]').val() as string || '');
        const per_dt_fim = dt_fim || String($('input[name="per_dt_fim"]').val() as string || '');

        const dadosFormulario = {
            dpe_nome_servidor: $('input[name="dpe_nome_servidor"]').val(),
            dpe_cpf_servidor: $('input[name="dpe_cpf_servidor"]').val(),
            dpe_matricula: $('input[name="dpe_matricula"]').val(),
            dpe_desc_cbo: $('input[name="dpe_desc_cbo"]').val(),
            dpe_desc_situacao: $('input[name="dpe_desc_situacao"]').val(),
            dpe_desc_grau_instrucao: $('input[name="dpe_desc_grau_instrucao"]').val(),
            dpe_dt_nascimento: $('input[name="dpe_dt_nascimento"]').val(),
            dpe_nome_municipio_nascimento: $('input[name="dpe_nome_municipio_nascimento"]').val(),
            dpe_desc_estado_civil: $('input[name="dpe_desc_estado_civil"]').val(),
            dpe_nome_mae: $('input[name="dpe_nome_mae"]').val(),
            dpe_nome_pai: $('input[name="dpe_nome_pai"]').val(),
            dpe_cep: $('input[name="dpe_cep"]').val(),
            dpe_endereco: $('input[name="dpe_endereco"]').val(),
            dpe_complemento_logradouro: $('input[name="dpe_complemento_logradouro"]').val(),
            dpe_nome_municipio_endereco: $('input[name="dpe_nome_municipio_endereco"]').val()
        };

        Swal.fire({
            title: '<strong style="color:#045C99;">Dados Pessoais PDF</strong>',
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

        $.post('/DadosPessoais/GerarPdfDadosPessoais', { cpf: cpf, matricula: matricula, nome: nomeBusca, dt_ini: per_dt_ini, dt_fim: per_dt_fim, dados: JSON.stringify(dadosFormulario) }, function (data) {
            console.log('success');
            console.log(data);

            if (data.sucesso) {
                Swal.close();
                if (data.arquivo) {
                    window.open(data.arquivo, '_blank');
                } else {
                    window.open('/DadosPessoais/abrirPdfDadosPessoaisGerado', 'popup', 'height=1080,width=1024,toolbar=no');

 
                }
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Erro ao gerar PDF',
                    html: data.msg || 'Ocorreu um erro ao gerar o relatório em PDF.',
                    footer: ScriptsConfig.footerAlert
                });
            }
        }, 'json')
            .done(function (data) {
                console.log('PDF gerado com sucesso');
            })
            .fail(function (_XMLHttpRequest_, textStatus, errorThrown) {
                console.log('error');
                console.log(_XMLHttpRequest_); console.log(textStatus); console.log(errorThrown);
                Swal.fire({
                    icon: 'error',
                    title: 'Erro na requisição',
                    html: 'Falha ao processar a solicitação de PDF.',
                    footer: ScriptsConfig.footerAlert
                });
            })
            .always(function () {
                Swal.close();
            });
    }

    $(function () {

        _ano = '2026';
        _mes = '6';

        $('button[name="btnBuscar"]').on('click', function (e) {
            e.preventDefault();
            DadPessRel.consultarDadosPessoais();
        });

        // Botão para voltar da lista para o filtro
        $('#btn-fechar-lista').on('click', function (e) {
            e.preventDefault();
            $('input[name="cpf_busca"]').val('');
            $('input[name="matricula"]').val('');
            $('input[name="per_nome"]').val('');
            $('#div-filtro').css('display', 'block');
            $('#div-resultado-dados-pessoais').css('display', 'none');
            $('#dados_pessoais').css('display', 'none');
            if (DadPessRel.dataTableInstanceDadosPessoais) {
                DadPessRel.dataTableInstanceDadosPessoais.destroy();
                DadPessRel.dataTableInstanceDadosPessoais = null;
            }
        });

        // Botão para voltar do formulário para a lista
        $('#btn-voltar-dados-pessoais').on('click', function (e) {
            e.preventDefault();
            $('#dados_pessoais').css('display', 'none');
            $('#div-resultado-dados-pessoais').css('display', 'block');
        });

        $('input[name="cpf_busca"]').on('input', function () {
            var cpf_busca = ($(this).val() as string);
        });

        // Manipuladores de clique na lista de dados pessoais antigas - agora usando datatable
        // Estes foram substituídos pelos event handlers na inicialização do datatable

        // Botão de gerar PDF dentro do formulário de dados pessoais
        $('button[name="btnGerarPDF"]').on('click', function (e) {
            DadPessRel.gerarPDFDoFormulario();
        });

        $('button[name="btn-salvar-questionario"]').on('click', function (e) {
            // Estat.salvarQuestionario();
        });

        $('input[name="buscaLimpa"]').on('input', function () {
            // Remove all non-numeric characters before saving
            var cleanValue = ($(this).val() as string);
            $('input[name="busca"]').val(cleanValue)
            console.log("Cleaned:", cleanValue);
        });

    });

}

declare module "DadPessRel" {
    export = DadPessRel;
}
