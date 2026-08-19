// File: script-page/ItemMovimento.ts
/// <reference path="../config-scripts/@types/jquery/index.d.ts" />
/// <reference path="../config-scripts/@types/jquery.form/index.d.ts" />
/// <reference path="../config-scripts/@types/datatables.net/types/types.d.ts" />
/// <reference path="../config-scripts/sweetalert2.d.ts" />
/// <reference path="../config-scripts/config.ts" />
/// <reference path="../script-page/ItemControl.ts" />

namespace ItemMovimento {
    export let dataTableInstance: any | null = null;
    export let datatable_lista = null;
    var tabelai = 0;
    export let _ano:string = '0';
    export let _mes:string = '0';
    var validar = false;
    var novoItem = true;

    var valido = true
    var msg = '';
    var contador = 0;

    $("#btnAtualizarResumo").on('click',function () {
        var formAtual = $('#formItensMovimento').serialize();
        contador++;
        //// Verifica se houve altera��o no formul�rio
        //if (formOriginal !== formAtual) {
        //    contador++;
        //    formOriginal = formAtual; // Atualiza o estado original
        //}

        var formData = $('#formItensMovimento').serialize();
        // console.log(formData);

        $.ajax({
            type: 'POST',
            url: '/Relatorio/AtualizarResumoItemMovimento',
            data: {
                form: formData, // Inclui os dados do formul�rio
                segurado: $('#Segurado').val(), // Obt�m o valor do elemento com ID 'Segurado'
                processoJudicial: $('#ProcessoJudicial').val(), // Obt�m o valor do elemento com ID 'ProcessoJudicial'
                contador: contador
            },
            success: function (response) {
                window.open('/Relatorio/Rel_Calculo', '_blank');
            },
            error: function (xhr, status, error) {
                alert('Erro ao enviar dados: ' + xhr.responseText);
            }
        });
    });

    // validação de itens não salvos
    var itensSemRegistro = false;
    function verificarItesSemRegistro() {
        if ($('table#table-lista-itens tbody tr td input.pim_sequencial').length) {
            itensSemRegistro = true;
        } else {
            itensSemRegistro = false;
        }
    }
    // =======
    function inputMascara() {
        $('input.monet').maskMoney({ prefix: '', allowNegative: true, thousands: '.', decimal: ',', affixesStay: true });
        // $('input.monetIndice').maskMoney({ prefix: '', allowNegative: true, thousands: '', decimal: ',', precision: 8, affixesStay: false });
        // $('input.monetIndice').mask("99,99999999");
        $('input.monetIndice').inputmask({ mask: function () { return ["9,99999999", "99,99999999"]; } });
        $('input.mes_ano').mask("99/9999");
    }

    // scripts.js
    // Variável global para armazenar a instância do DataTable
    /*
        let ItemMovimento.dataTableInstance = null;
        let tempo = Date.now();
        let mov_ano = 0;
        let mov_numero = 0;
        let BcCorrigida = '';
        let dadosDaTabela = [];
    */
    /*
        $.fn.dataTable.ext.search.push(
            function (settings, data, dataIndex, rowData, counter) {
                // Obtém o termo de busca digitado no campo "Pesquisar"
                let searchTerm = $('#table-lista-itens_filter input').val();
                // Obtém a linha atual do DOM
                let row = ItemMovimento.dataTableInstance.row(dataIndex).node();
                // Busca todos os <input> e <select> na linha
                let inputs = $(row).find('input, select');

                // Verifica se algum valor de <input> ou <select> contém o termo de busca
                for (let i = 0; i < inputs.length; i++) {
                    let value = $(inputs[i]).val();
                    if (value.includes(searchTerm)) {
                        return true; // Mostra a linha se o valor contém o termo
                    }
                }
                return false; // Esconde a linha se nenhum valor corresponde
            }
        );
    */

    // Função para inicializar o DataTable com os dados recebidos
    function initializeDataTable(data, ano, mes, pageLength) {
        let listaDeIndiceCorrecaoMonetariaOptions = `
            <option value="1" opsel1 >IPCA-E</option>
            <option value="2" opsel2 >IGP-M</option>
        `;
        // console.log('Inicializando DataTable...');
        if (!Array.isArray(data)) {
            console.error('Os dados recebidos não são válidos:', data);
            alert('Erro ao carregar os dados. Verifique o console para mais detalhes.');
            return;
        }

        // if (ItemMovimento.dataTableInstance) {
        //     ItemMovimento.dataTableInstance.destroy();
        // }

        // console.log('Inicializando DataTable com os dados recebidos...');
        ItemMovimento.dataTableInstance = $('#table-lista-itens').DataTable({
            data: data,
            paging: true, // Ativa a paginação
            pageLength: pageLength,
            destroy: true,
            fixedHeader: true,
            info: true,
            lengthMenu: [ 100, 250, 500, 750, 1000 ],
            dom: 'Bfrtip',
            buttons: [
                {
                    extend: 'excelHtml5', // 'excelHtml5',
                    extension: '.xlsx',
                    header: true,
                    footer: false,
                    autoFilter: false,
                    bom: false,
                    sheetName: 'Precatorio ' + mes + '-de-' + ano,
                    messageTop: 'Precatorios: ' + mes + '/' + ano,
                    text: '<i class="far fa-file-excel text-success fa-lg"></i>'
                    , title: null
                    , filename: function () {
                        return 'Precatorio-mes-' + mes + '-de-' + ano; // + '-' + dt_gerado;
                    },
                    exportOptions: {
                        columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                        format: {
                            body: function (data, row, column, node:any) {
                                console.log(data);
                                const $vale = $(data);
                                console.log($vale.filter('.mes_ano').val());


                                switch (column) {
                                    case 0:
                                        return $(node).find('input[type="text"]').val();
                                        break;
                                    case 1:
                                        return $(node).find('input.monet').val()?.toString().replace('.', '').replace('.', '').replace('.', '').replace(',', '.');
                                        break;
                                    case 2:
                                        return $(node).find('input.monet').val()?.toString().replace('.', '').replace('.', '').replace('.', '').replace(',', '.');
                                        break;
                                    case 3:
                                        return $(node).find('select option:selected').text();
                                        break;
                                    case 4:
                                        return $(node).find('input.monetIndice').val()?.toString().replace('.', '').replace('.', '').replace('.', '').replace(',', '.');
                                        break;
                                    case 5:
                                        return $(node).find('input.monet').val()?.toString().replace('.', '').replace('.', '').replace('.', '').replace(',', '.');
                                        break;
                                    case 6:
                                        return $(node).find('input.monet').val()?.toString().replace('.', '').replace('.', '').replace('.', '').replace(',', '.');
                                        break;
                                    case 7:
                                        return $(node).find('label.esquer').text() + ' / ' + $(node).find('label.direi').text();
                                        break;
                                    case 8:
                                        return $(node).find('label.esquer').text() + ' / ' + $(node).find('label.direi').text();
                                        break;
                                    case 9:
                                        return $(node).find('input.monet').val()?.toString().replace('.', '').replace('.', '').replace('.', '').replace(',', '.');
                                        break;
                                    case 10:
                                        return $(node).find('input.monet').val()?.toString().replace('.', '').replace('.', '').replace('.', '').replace(',', '.');
                                        break;
                                    case 11:
                                        return $(node).find('select option:selected').text();
                                        break;
                                    default:
                                        return $(node).find('input[type="text"]').val();
                                }

                                /*if (column === 0) {
                                    return $(node).find('input[type="text"]').val();
                                }
                                if (column === 1) {
                                    return $(node).find('input[type="text"]').val();
                                }
                                if (column === 2) {
                                    return $(node).find('select option:selected').text();
                                }
                                if (column === 3) {
                                    return $vale.filter('input.monet').val().replace(',', '.');
                                }
                                if (column === 4) {
                                    return $(node).find('select option:selected').text();
                                }
                                if (column === 5) {
                                    return ' ' + $(node).find('input.monetIndice').val().replace(',', '.');
                                }*/

                                /*if (column === 7) {
                                    return $(node).find('select option:selected').text();
                                }
                                if (column === 7) {
                                    return $(node).find('svg');
                                }*/

                            }
                        }
                    }
                    //, orientation: 'portrait'
                    //, exportOptions: { columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]  }
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
                        columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
                    }
                }
            ],
            lengthChange: true,
            searching: true,
            ordering: true,
            columns: [
                {
                    data: 'mes_ano', className: 'editable mes_ano',
                    createdCell: function (td, cellData, rowData, row, col) {
                        // console.log(col + ' :: accesskey:' + tempo);
                        $(td)
                            .attr('id', `linh[${row}][mes_ano]`)
                            .attr('row', row)
                            .attr('col', col)
                            .attr('campo', 'mes_ano')
                            .attr('data-pim-sequencial', rowData.pim_sequencial || '')
                            .attr('data-mov-ano', rowData.mov_ano || '')
                            .attr('data-mov-numero', rowData.mov_numero || '')
                            .attr('data-pim-mes-referencia', rowData.pim_mes_referencia || '')
                            .attr('data-pim-ano-referencia', rowData.pim_ano_referencia || '')
                            .attr('accesskey', rowData.pim_sequencial || ItemControl.tempo);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            var colorCancel = ((row.pim_situacao === 'A') ? '' : 'color:red;');
                            return `
                                    <td data-pim-sequencial="${row.pim_sequencial || ItemControl.tempo}" data-mov-ano="${row.mov_ano || ''}" data-mov-numero="${row.mov_numero || ''}"
                                        data-pim-mes-referencia="${row.pim_mes_referencia || ''}" data-pim-ano-referencia="${row.pim_ano_referencia || ''}" accesskey="${row.pim_sequencial || ItemControl.tempo}">

                                        <input type="hidden" class="form-control mov_ano"
                                            name="inpu[${row.pim_sequencial || ItemControl.tempo}][mov_ano]"
                                            id="inpu[${row.pim_sequencial || ItemControl.tempo}][mov_ano]"
                                            value="${row.mov_ano || ItemControl.mov_ano}"
                                            accesskey="${row.pim_sequencial || ItemControl.tempo}"  />

                                        <input type="hidden" class="form-control mov_numero"
                                            name="inpu[${row.pim_sequencial || ItemControl.tempo}][mov_numero]"
                                            id="inpu[${row.pim_sequencial || ItemControl.tempo}][mov_numero]"
                                            value="${row.mov_numero || ItemControl.mov_numero}"
                                            accesskey="${row.pim_sequencial || ItemControl.tempo}"  />

                                        <input type="hidden" class="form-control pim_sequencial"
                                            name="inpu[${row.pim_sequencial || ItemControl.tempo}][pim_sequencial]"
                                            id="inpu[${row.pim_sequencial || ItemControl.tempo}][pim_sequencial]"
                                            value="${row.pim_sequencial || '0'}"
                                            accesskey="${row.pim_sequencial || ItemControl.tempo}"  />

                                        <input type="text" class="form-control mes_ano"
                                            name="inpu[${row.pim_sequencial || ItemControl.tempo}][mes_ano]"
                                            id="inpu[${row.pim_sequencial || ItemControl.tempo}][mes_ano]"
                                            value="${data || ''}"
                                            onblur="javascript:ItemControl.validarCampos(${row.pim_sequencial || ItemControl.tempo}, 'mes_ano');"
                                            onclick="javascript:inputMascara();"
                                            maxlength="7"
                                            data-pim-sequencial="${row.pim_sequencial || ItemControl.tempo}"
                                            data-mov-ano="${row.mov_ano || '0'}"
                                            data-mov-numero="${row.mov_numero || '0'}"
                                            data-pim-mes-referencia="${row.pim_mes_referencia || ''}"
                                            data-pim-ano-referencia="${row.pim_ano_referencia || ''}"
                                            accesskey="${row.pim_sequencial || ItemControl.tempo}" style="${colorCancel || ''}" />
                                    </td>

                            `;
                        }
                        return data; // Return raw data for other types (e.g., sorting, filtering)
                    }

                },
                {
                    data: 'pim_base_calculo_contribuicao_segurado', className: 'editable pim_base_calculo_contribuicao_segurado',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('id', 'linh[' + row + '][pim_base_calculo_contribuicao_segurado]').attr('row', row).attr('col', col).attr('campo', 'pim_base_calculo_contribuicao_segurado')
                            .attr('accesskey', rowData.pim_sequencial || ItemControl.tempo);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            var colorCancel = ((row.pim_situacao === 'A') ? '' : 'color:red;');
                            let pim_base_calculo_contribuicao_segurado = Intl.NumberFormat('pt-br').format(data).replace('R$ ', '');
                            return `
                                <td data-pim-sequencial="${row.pim_sequencial || ItemControl.tempo}" data-pim-base-calculo-contribuicao-segurado="${row.pim_base_calculo_contribuicao_segurado}" accesskey="${row.pim_sequencial || ItemControl.tempo}" >
                                    <input type="text" class="form-control monet pim_base_calculo_contribuicao_segurado"
                                        name="inpu[${row.pim_sequencial || ItemControl.tempo}][pim_base_calculo_contribuicao_segurado]"
                                        id="inpu[${row.pim_sequencial || ItemControl.tempo}][pim_base_calculo_contribuicao_segurado]"
                                        onblur="javascript:ItemControl.validarCampos(${row.pim_sequencial || ItemControl.tempo},'pim_base_calculo_contribuicao_segurado');" onfocus="javascript:inputMascara();"
                                        accesskey="${row.pim_sequencial || ItemControl.tempo}"
                                        value="${pim_base_calculo_contribuicao_segurado || '0,00'}"
                                        style="` + ((ItemControl.BcCorrigida === `sim`) ? `display:none;` : ``) + `${colorCancel || ''}"  />
                                </td>
                            `;
                        }
                        return data;
                    }
                },
                {
                    data: 'pim_base_calculo_contribuicao_patronal', className: 'editable pim_base_calculo_contribuicao_patronal',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('id', 'linh[' + row + '][pim_base_calculo_contribuicao_patronal]').attr('row', row).attr('col', col).attr('campo', 'pim_base_calculo_contribuicao_patronal')
                            .attr('accesskey', rowData.pim_sequencial || ItemControl.tempo);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            var colorCancel = ((row.pim_situacao === 'A') ? '' : 'color:red;');
                            let pim_base_calculo_contribuicao_patronal = Intl.NumberFormat('pt-br').format(data).replace('R$ ', '');
                            return `
                                <td data-pim-sequencial="${row.pim_sequencial || ItemControl.tempo}" data-pim-base-calculo-contribuicao-patronal="${row.pim_base_calculo_contribuicao_patronal}" accesskey="${row.pim_sequencial || ItemControl.tempo}" >
                                    <input type="text" class="form-control monet pim_base_calculo_contribuicao_patronal"
                                        name="inpu[${row.pim_sequencial || ItemControl.tempo}][pim_base_calculo_contribuicao_patronal]"
                                        id="inpu[${row.pim_sequencial || ItemControl.tempo}][pim_base_calculo_contribuicao_patronal]"
                                        onblur="javascript:ItemControl.validarCampos(${row.pim_sequencial || ItemControl.tempo},'pim_base_calculo_contribuicao_patronal');" onfocus="javascript:inputMascara();"
                                        accesskey="${row.pim_sequencial || ItemControl.tempo}"
                                        value="${pim_base_calculo_contribuicao_patronal || '0,00'}"
                                        style="` + ((ItemControl.BcCorrigida === `sim`) ? `display:none;` : ``) + `${colorCancel || ''}"  />
                                </td>
                            `;
                        }
                        return data;
                    }
                },
                {
                    data: 'inc_codigo', className: 'editable inc_codigo',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('id', 'linh[' + row + '][inc_codigo]').attr('row', row).attr('col', col).attr('campo', 'inc_codigo')
                            .attr('accesskey', rowData.pim_sequencial || ItemControl.tempo);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            var colorCancel = ((row.pim_situacao === 'A') ? '' : 'color:red;');
                            return `
                                <td data-pim-sequencial="${row.pim_sequencial || ItemControl.tempo}" data-inc-codigo="${row.inc_codigo || ''}" accesskey="${row.pim_sequencial || ItemControl.tempo}" >
                                    <select class="form-control" accesskey="${row.pim_sequencial || ItemControl.tempo}" name="inpu[${row.pim_sequencial || ItemControl.tempo}][inc_codigo]" id="inpu[${row.pim_sequencial || ItemControl.tempo}][inc_codigo]"
                                        onchange="javascript:ItemControl.validarCampos(${row.pim_sequencial || ItemControl.tempo},'inc_codigo');" style="padding:2px 2px 2px 2px;width:100px;${colorCancel || ''}"   >
                                        <option value="0">Selecione o índice</option>
                                        ${listaDeIndiceCorrecaoMonetariaOptions.replace('opsel'+data, 'selected="selected"')}
                                    </select>
                                </td>
                            `;
                        }
                        return data;
                    }
                },
                {
                    data: 'pim_indice_correcao', className: 'editable pim_indice_correcao',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('id', 'linh[' + row + '][pim_indice_correcao]').attr('row', row).attr('col', col).attr('campo', 'pim_indice_correcao')
                            .attr('accesskey', rowData.pim_sequencial || ItemControl.tempo);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            var colorCancel = ((row.pim_situacao === 'A') ? '' : 'color:red;');
                            let valor = Number(data);
                            let pim_indice_correcao = valor.toFixed(8).toString().replace('.', ',');
                            return `
                                <td data-pim-sequencial="${row.pim_sequencial || ItemControl.tempo}" data-pim-indice-correcao="${row.pim_indice_correcao}" accesskey="${row.pim_sequencial || ItemControl.tempo}" >
                                    <input type="text" class="form-control monetIndice" accesskey="${row.pim_sequencial || ItemControl.tempo}"  name="inpu[${row.pim_sequencial || ItemControl.tempo}][pim_indice_correcao]" id="inpu[${row.pim_sequencial || ItemControl.tempo}][pim_indice_correcao]"
                                    onblur="javascript:ItemControl.validarCampos(${row.pim_sequencial || ItemControl.tempo},'pim_indice_correcao');"
                                    value="${pim_indice_correcao || '0,00000000'}"
                                    style="` + ((ItemControl.BcCorrigida === `sim`) ? `display:none;` : ``) + ` width:110px;${colorCancel || ''}" />
                                </td>
                            `;
                        }
                        return data;
                    }
                }, // 9

                {
                    data: 'pim_base_calculo_contribuicao_segurado_corrigida', className: 'editable pim_base_calculo_contribuicao_segurado_corrigida',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('id', 'linh[' + row + '][pim_base_calculo_contribuicao_segurado_corrigida]').attr('row', row).attr('col', col).attr('campo', 'pim_base_calculo_contribuicao_segurado_corrigida')
                            .attr('accesskey', rowData.pim_sequencial || ItemControl.tempo);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            var colorCancel = ((row.pim_situacao === 'A') ? '' : 'color:red;');
                            let pim_base_calculo_contribuicao_segurado_corrigida = Intl.NumberFormat('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(data).replace('R$ ', '');
                            return `
                                <td data-pim-sequencial="${row.pim_sequencial || ItemControl.tempo}" data-pim-base-calculo-contribuicao-segurado-corrigida="${row.pim_base_calculo_contribuicao_segurado_corrigida}" accesskey="${row.pim_sequencial || ItemControl.tempo}" >
                                    <input type="text" class="form-control monet" accesskey="${row.pim_sequencial || ItemControl.tempo}"
                                        onblur="javascript:ItemControl.calcularCota(${row.pim_sequencial || ItemControl.tempo},'pim_base_calculo_contribuicao_segurado_corrigida');"
                                        name="inpu[${row.pim_sequencial || ItemControl.tempo}][pim_base_calculo_contribuicao_segurado_corrigida]" id="inpu[${row.pim_sequencial || ItemControl.tempo}][pim_base_calculo_contribuicao_segurado_corrigida]"
                                        value="${pim_base_calculo_contribuicao_segurado_corrigida || '0,00'}"
                                        style="` + ((ItemControl.BcCorrigida === `sim`) ? `` : `display:none;`) + `${colorCancel || ''}"  />
                                </td>
                            `;
                        }
                        return data;
                    }
                },
                {
                    data: 'pim_base_calculo_contribuicao_patronal_corrigida', className: 'editable pim_base_calculo_contribuicao_patronal_corrigida',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('id', 'linh[' + row + '][pim_base_calculo_contribuicao_patronal_corrigida]').attr('row', row).attr('col', col).attr('campo', 'pim_base_calculo_contribuicao_patronal_corrigida')
                            .attr('accesskey', rowData.pim_sequencial || ItemControl.tempo);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            var colorCancel = ((row.pim_situacao === 'A') ? '' : 'color:red;');
                            let pim_base_calculo_contribuicao_patronal_corrigida = Intl.NumberFormat('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(data).replace('R$ ', '');
                            return `
                                <td data-pim-sequencial="${row.pim_sequencial || ItemControl.tempo}" data-pim-base-calculo-contribuicao-patronal-corrigida="${row.pim_base_calculo_contribuicao_patronal_corrigida}" accesskey="${row.pim_sequencial || ItemControl.tempo}" >
                                    <input type="text" class="form-control monet" accesskey="${row.pim_sequencial || ItemControl.tempo}"
                                        onblur="javascript:ItemControl.calcularCota(${row.pim_sequencial || ItemControl.tempo},'pim_base_calculo_contribuicao_patronal_corrigida');"
                                        name="inpu[${row.pim_sequencial || ItemControl.tempo}][pim_base_calculo_contribuicao_patronal_corrigida]" id="inpu[${row.pim_sequencial || ItemControl.tempo}][pim_base_calculo_contribuicao_patronal_corrigida]"
                                        value="${pim_base_calculo_contribuicao_patronal_corrigida || '0,00'}"
                                        style="` + ((ItemControl.BcCorrigida === `sim`) ? `` : `display:none;`) + `${colorCancel || ''}"  />
                                </td>
                            `;
                        }
                        return data;
                    }
                },
                {
                    data: 'aliquota_segurado', className: 'editable aliquota_segurado',
                    createdCell: function (td, cellData, rowData, row, col) {
                        // Adiciona atributos para pim_sequencial, mov_ano e mov_numero
                        $(td)
                            .attr('id', `linh[${row}][aliquota_segurado]`)
                            .attr('row', row)
                            .attr('col', col)
                            .attr('campo', 'aliquota_segurado')
                            .attr('data-pim-aliquota-segurado-ate-teto-inss', rowData.pim_aliquota_segurado_ate_teto_inss || '0,00')
                            .attr('data-pim-aliquota-segurado-acima-teto-inss', rowData.pim_aliquota_segurado_acima_teto_inss || '0,00')
                            .attr('accesskey', rowData.pim_sequencial || ItemControl.tempo);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            var colorCancel = ((row.pim_situacao === 'A') ? '' : 'color:red;');
                            let pim_aliquota_segurado_ate_teto_inss = (row.pim_aliquota_segurado_ate_teto_inss !== undefined
                                ? Intl.NumberFormat('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(row.pim_aliquota_segurado_ate_teto_inss).replace('R$ ', '')
                                : '0,00'
                            );
                            let pim_aliquota_segurado_acima_teto_inss = (row.pim_aliquota_segurado_acima_teto_inss !== undefined
                                ? Intl.NumberFormat('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(row.pim_aliquota_segurado_acima_teto_inss).replace('R$ ', '')
                                : '0,00'
                            );

                            return `
                                <td data-pim-sequencial="${row.pim_sequencial || ItemControl.tempo}"
                                    data-pim-aliquota-segurado-ate-teto-inss="${row.pim_aliquota_segurado_ate_teto_inss}" data-pim-aliquota-segurado-acima-teto-inss="${row.pim_aliquota_segurado_acima_teto_inss}" accesskey="${row.pim_sequencial || ItemControl.tempo}" >
                                    <input type="text" class="form-control pim_aliquota_segurado_ate_teto_inss" accesskey="${row.pim_sequencial || ItemControl.tempo}"
                                        name="inpu[${row.pim_sequencial || ItemControl.tempo}][pim_aliquota_segurado_ate_teto_inss]" id="inpu[${row.pim_sequencial || ItemControl.tempo}][pim_aliquota_segurado_ate_teto_inss]"
                                        value="${pim_aliquota_segurado_ate_teto_inss || '0,00'}" readonly="readonly" style="float: left;width:35px;${colorCancel || ''}" >
                                    <input type="text" class="form-control pim_aliquota_segurado_acima_teto_inss" accesskey="${row.pim_sequencial || ItemControl.tempo}"
                                        name="inpu[${row.pim_sequencial || ItemControl.tempo}][pim_aliquota_segurado_acima_teto_inss]" id="inpu[${row.pim_sequencial || ItemControl.tempo}][pim_aliquota_segurado_acima_teto_inss]"
                                        value="${pim_aliquota_segurado_acima_teto_inss || '0,00'}" readonly="readonly" style="width: 35px;${colorCancel || ''}" >
                                </td>
                            `;
                        }
                        return data;
                    }
                },
                {
                    data: 'aliquota_patronal', className: 'editable aliquota_patronal',
                    createdCell: function (td, cellData, rowData, row, col) {
                        // Adiciona atributos para pim_sequencial, mov_ano e mov_numero
                        $(td)
                            .attr('id', `linh[${row}][aliquota_patronal]`)
                            .attr('row', row)
                            .attr('col', col)
                            .attr('campo', 'aliquota_patronal')
                            .attr('data-pim-aliquota-patronal-ate-teto-inss', rowData.pim_aliquota_patronal_ate_teto_inss || '0,00')
                            .attr('data-pim-aliquota-patronal-acima-teto-inss', rowData.pim_aliquota_patronal_acima_teto_inss || '0,00')
                            .attr('data-pim-aliquota-patronal-art-122', rowData.pim_aliquota_patronal_art_122 || '0,00')
                            .attr('accesskey', rowData.pim_sequencial || ItemControl.tempo);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            var colorCancel = ((row.pim_situacao === 'A') ? '' : 'color:red;');
                            let pim_aliquota_patronal_ate_teto_inss = (row.pim_aliquota_patronal_ate_teto_inss !== undefined
                                ? Intl.NumberFormat('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(row.pim_aliquota_patronal_ate_teto_inss).replace('R$ ', '')
                                : '0,00'
                            );
                            let pim_aliquota_patronal_acima_teto_inss = (row.pim_aliquota_patronal_acima_teto_inss !== undefined
                                ? Intl.NumberFormat('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(row.pim_aliquota_patronal_acima_teto_inss).replace('R$ ', '')
                                : '0,00'
                            );
                            let pim_aliquota_patronal_art_122 = (row.pim_aliquota_patronal_art_122 !== undefined
                                ? Intl.NumberFormat('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(row.pim_aliquota_patronal_art_122).replace('R$ ', '')
                                : '0,00'
                            );
                            return `
                                <td data-pim-sequencial="${row.pim_sequencial || ItemControl.tempo}" data-pim-aliquota-patronal-art-122="${row.pim_aliquota_patronal_art_122}"
                                    data-pim-aliquota-patronal-ate-teto-inss="${row.pim_aliquota_patronal_ate_teto_inss}" data-pim-aliquota-patronal-acima-teto-inss="${row.pim_aliquota_patronal_acima_teto_inss}" accesskey="${row.pim_sequencial || ItemControl.tempo}" >
                                    <input type="text" class="form-control pim_aliquota_patronal_ate_teto_inss" accesskey="${row.pim_sequencial || ItemControl.tempo}"
                                        name="inpu[${row.pim_sequencial || ItemControl.tempo}][pim_aliquota_patronal_ate_teto_inss]" id="inpu[${row.pim_sequencial || ItemControl.tempo}][pim_aliquota_patronal_ate_teto_inss]"
                                        value="${pim_aliquota_patronal_ate_teto_inss || '0,00'}" readonly="readonly" style="float: left;width:35px;${colorCancel || ''}" >
                                    <input type="text" class="form-control pim_aliquota_patronal_acima_teto_inss" accesskey="${row.pim_sequencial || ItemControl.tempo}"
                                        name="inpu[${row.pim_sequencial || ItemControl.tempo}][pim_aliquota_patronal_acima_teto_inss]" id="inpu[${row.pim_sequencial || ItemControl.tempo}][pim_aliquota_patronal_acima_teto_inss]"
                                        value="${pim_aliquota_patronal_acima_teto_inss || '0,00'}" readonly="readonly" style="width: 35px;${colorCancel || ''}" >
                                    <input type="hidden" class="form-control pim_aliquota_patronal_art_122" accesskey="${row.pim_sequencial || ItemControl.tempo}"
                                        name="inpu[${row.pim_sequencial || ItemControl.tempo}][pim_aliquota_patronal_art_122]" id="inpu[${row.pim_sequencial || ItemControl.tempo}][pim_aliquota_patronal_art_122]"
                                        value="${pim_aliquota_patronal_art_122 || '0,00'}" readonly="readonly" >
                                </td>
                            `;
                        }
                        return data;
                    }
                },
                {
                    data: 'pim_vlr_cota_segurado', className: 'editable pim_vlr_cota_segurado',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('id', 'linh[' + row + '][pim_vlr_cota_segurado]').attr('row', row).attr('col', col).attr('campo', 'data-pim-vlr-cota-segurado').attr('campo', rowData.pim_vlr_cota_segurado || '0,00')
                            .attr('accesskey', rowData.pim_sequencial || ItemControl.tempo);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            var colorCancel = ((row.pim_situacao === 'A') ? '' : 'color:red;');
                            let pim_vlr_cota_segurado = Intl.NumberFormat('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(data).replace('R$ ', '');
                            return `
                                <td data-pim-sequencial="${row.pim_sequencial || ItemControl.tempo}" data-pim-vlr-cota-segurado="${row.pim_vlr_cota_segurado}" accesskey="${row.pim_sequencial || ItemControl.tempo}" >
                                    <input type="text" class="form-control pim_vlr_cota_segurado" accesskey="${row.pim_sequencial || ItemControl.tempo}"
                                        name="inpu[${row.pim_sequencial || ItemControl.tempo}][pim_vlr_cota_segurado]" id="inpu[${row.pim_sequencial || ItemControl.tempo}][pim_vlr_cota_segurado]"
                                        value="${pim_vlr_cota_segurado || '0,00'}" readonly="readonly" style="width: 60px;${colorCancel || ''}" >
                                </td>
                            `;
                        }
                        return data;
                    }
                },
                {
                    data: 'pim_vlr_cota_patronal', className: 'editable pim_vlr_cota_patronal',
                    createdCell: function (td, cellData, rowData, row, col) {
                        // Adiciona atributos para pim_sequencial, mov_ano e mov_numero
                        $(td)
                            .attr('id', `linh[${row}][pim_vlr_cota_patronal]`)
                            .attr('row', row)
                            .attr('col', col)
                            .attr('campo', 'pim_vlr_cota_patronal')
                            .attr('data-pim-vlr-cota-patronal', rowData.pim_vlr_cota_patronal || '0,00')
                            .attr('data-pim-vlr-cota-patronal-art-122', rowData.pim_vlr_cota_patronal_art_122 || '0,00')
                            .attr('data-pim-vlr-contribuicao-total', rowData.pim_vlr_contribuicao_total || '0,00')
                            .attr('data-pim-dt-inclusao', rowData.pim_dt_inclusao || '')
                            .attr('accesskey', rowData.pim_sequencial || ItemControl.tempo);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            var colorCancel = ((row.pim_situacao === 'A') ? '' : 'color:red;');
                            let pim_vlr_cota_patronal = Intl.NumberFormat('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(data).replace('R$ ', '');
                            let pim_vlr_cota_patronal_art_122 = Intl.NumberFormat('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(row.pim_vlr_cota_patronal_art_122 || 0.0).replace('R$ ', '');
                            let pim_vlr_contribuicao_total = Intl.NumberFormat('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(row.pim_vlr_contribuicao_total || 0.0).replace('R$ ', '');

                            return `
                                <td data-pim-sequencial="${row.pim_sequencial || ItemControl.tempo}" data-pim-vlr-cota-patronal="${row.pim_vlr_cota_patronal}"
                                    data-pim-vlr-cota-patronal-art-122="${row.pim_vlr_cota_patronal_art_122}" data-pim-vlr-contribuicao-total="${row.pim_vlr_contribuicao_total}" accesskey="${row.pim_sequencial || ItemControl.tempo}" >

                                    <input type="text" class="form-control pim_vlr_cota_patronal" accesskey="${row.pim_sequencial || ItemControl.tempo}"
                                        name="inpu[${row.pim_sequencial || ItemControl.tempo}][pim_vlr_cota_patronal]" id="inpu[${row.pim_sequencial || ItemControl.tempo}][pim_vlr_cota_patronal]"
                                        value="${pim_vlr_cota_patronal || '0,00'}" readonly="readonly" style="width: 60px;${colorCancel || ''}" >

                                    <input type="hidden" class="form-control pim_vlr_cota_patronal_art_122" accesskey="${row.pim_sequencial || ItemControl.tempo}"
                                        name="inpu[${row.pim_sequencial || ItemControl.tempo}][pim_vlr_cota_patronal_art_122]" id="inpu[${row.pim_sequencial || ItemControl.tempo}][pim_vlr_cota_patronal_art_122]"
                                        value="${pim_vlr_cota_patronal_art_122 || '0,00'}" readonly="readonly" style="width: 35px;${colorCancel || ''}" >
                                    <input type="hidden" class="form-control pim_vlr_contribuicao_total" accesskey="${row.pim_sequencial || ItemControl.tempo}"
                                        name="inpu[${row.pim_sequencial || ItemControl.tempo}][pim_vlr_contribuicao_total]" id="inpu[${row.pim_sequencial || ItemControl.tempo}][pim_vlr_contribuicao_total]"
                                        value="${pim_vlr_contribuicao_total || '0,00'}" readonly="readonly" style="width: 35px;${colorCancel || ''}" >
                                </td>
                            `;
                        }
                        return data;
                    }
                },
                {
                    data: 'pim_situacao', className: 'editable pim_situacao',
                    createdCell: function (td, cellData, rowData, row, col) {
                        $(td).attr('id', 'linh[' + row + '][pim_situacao]').attr('row', row).attr('col', col).attr('campo', 'pim_situacao')
                            .attr('accesskey', rowData.pim_sequencial || ItemControl.tempo);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            var colorCancel = ((row.pim_situacao === 'A') ? '' : 'color:red;');
                            var pim_situacao_a = (row.pim_situacao === 'A' ? 'selected="selected"' : '');
                            var pim_situacao_c = (row.pim_situacao === 'C' ? 'selected="selected"' : '');
                            return `
                                <td data-pim-sequencial="${row.pim_sequencial || ItemControl.tempo}" data-pim-situacao="${row.pim_situacao}" accesskey="${row.pim_sequencial || ItemControl.tempo}" >
                                    <input type="hidden" class="form-control pim_dt_inclusao" name="inpu[${row.pim_sequencial || ItemControl.tempo}][pim_dt_inclusao]" id="inpu[${row.pim_sequencial || ItemControl.tempo}][pim_dt_inclusao]" accesskey="${row.pim_sequencial || ItemControl.tempo}" value="${data || ''}">
                                    <select class="form-control pim_situacao" accesskey="${row.pim_sequencial || ItemControl.tempo}" name="inpu[${row.pim_sequencial || ItemControl.tempo}][pim_situacao]" id="inpu[${row.pim_sequencial || ItemControl.tempo}][pim_situacao]"
                                        onblur="javascript:ItemControl.validarSitu(${row.pim_sequencial || ItemControl.tempo},'pim_situacao');"
                                        onchange="javascript:ItemControl.validarCampos(${row.pim_sequencial || ItemControl.tempo},'pim_situacao');"
                                        style="padding:0px 2px 2px 2px;height: 25px;font-size: 12px;${colorCancel || ''}" >
                                        <option value="ativo" ${pim_situacao_a} >Ativo</option>
                                        <option value="cancelado" ${pim_situacao_c}>Cancelado</option>
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
                        $(td).attr('id', 'linh[' + row + '][excluir]').attr('row', row).attr('col', col).attr('campo', 'excluir')
                            .attr('accesskey', rowData.pim_sequencial || ItemControl.tempo);
                    },
                    render: function (data, type, row) {
                        if (type === 'display') {
                            var colorCancel = ((row.pim_situacao === 'A') ? '' : 'color:red;');
                            return `<td style="max-width: 40px;">`
                                +
                                (
                                    ((row.pim_vlr_cota_segurado + row.pim_vlr_cota_patronal) > 0)
                                        ? '<label class="form-control" id="inpu[' + row.pim_sequencial + '][label_trash]"><i class="fa-solid fa-trash-can text-secondary"></i></label>'
                                        : '<i class="fa-solid fa-trash-can text-warning cancelarItemMovimento" accesskey="' + row.pim_sequencial + '" id="inpu[' + row.pim_sequencial + '][excluir]" onclick="javascript:ItemControl.cancelarItemMovimentoDetalhaBcPorEvento(' + row.pim_sequencial + ');" style="' + colorCancel + '"></i>'
                                )
                                +
                                `</td>`;
                        }
                        return data;
                    },
                    // defaultContent: '<button class="edit-row">Editar</button> <button class="delete-row">Excluir</button>',
                    //defaultContent: '<button class="delete-row">Excluir</button>',
                    orderable: false
                }
            ],
            language: {
                url: 'https://cdn.datatables.net/plug-ins/1.13.6/i18n/pt-BR.json'
            },
            columnDefs: [
                { targets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], visible: true }
            ],
            autoFill: true
        }).draw();

        // console.log('DataTable inicializado com sucesso.');
    }

    /*
    // Sincronizar alterações nos <input> e <select> para atualizar o filtro
    $('#table-lista-itens tbody').on('change', 'input, select', function () {
        ItemMovimento.dataTableInstance.draw(); // Redesenha a tabela para aplicar o filtro com os novos valores
    });
    */

    // Utility function to format "mes_ano"
    function formatMesAno(mesReferencia, anoReferencia) {
        const mes = mesReferencia < 10 ? `0${mesReferencia}` : `${mesReferencia}`;
        return `${mes}/${anoReferencia}`;
    }

    // Function to process data for the DataTable
    function processDataForTable(data) {
        return data.map(item => {
            // Validate required fields
            if (!item.pim_mes_referencia || !item.pim_ano_referencia) {
                console.warn('Dados incompletos para criar "mes_ano":', item);
            }

            // Format "mes_ano"
            const mesAno = formatMesAno(item.pim_mes_referencia || 1, item.pim_ano_referencia || 1900);

            // Return the transformed object
            return {
                ...item, // Keep all original fields
                mes_ano: mesAno, // Add the formatted "mes_ano" field
                tempo: item.pim_sequencial || Date.now(), // Default to '0,00' if missing
                aliquota_segurado: item.pim_aliquota_segurado_ate_teto_inss || '0,00', // Default to '0,00' if missing
                aliquota_patronal: item.pim_aliquota_patronal_ate_teto_inss || '0,00' // Default to '0,00' if missing
            };
        });
    }

    // Função para buscar os dados da API e inicializar o DataTable
    function fetchDataAndInitializeTable() {
        // console.log('Iniciando busca de dados da API...');
        var dadosForm = $('form[name="formItensMovimento"]').serializeArray();

        $.ajax({
            url: '/PrecatorioItemMovimento/Lista', data: dadosForm,
            type: 'get', dataType: 'json', cache: false, async: true,
            statusCode: { 403: function () { console.log('forbidden'); }, 404: function () { console.log('page not found'); }, 415: function () { console.log('Unsupported Media Type'); }, 405: function () { console.log('method not allowed'); }, 500: function () { console.log('internal server error'); }, 502: function () { console.log('Bad Gateway'); } },
            success: function (json, textStatus, jqXHR) {
                console.log('Dados recebidos da API:', json.lista);
                // Validate the data
                if (!Array.isArray(json.lista)) {
                    console.error('Os dados retornados pela API não são válidos.');
                    alert('Erro ao carregar os dados. Verifique o console para mais detalhes.');
                    return;
                }
                // Process the data
                ItemControl.dadosDaTabela = processDataForTable(json.lista);
                // console.log('Dados processados para o DataTable:', dadosDaTabela);
                if (json.sucesso) {
                    // Initialize the DataTable
                    console.table(ItemControl.dadosDaTabela);
                    //initializeDataTable(dadosDaTabela);

                    $.when(initializeDataTable(ItemControl.dadosDaTabela, _ano, _mes, 8)).then(function (data, textStatus, jqXHR) {
                        $('input.monet').maskMoney({ prefix: '', allowNegative: true, thousands: '.', decimal: ',', affixesStay: false });
                        if ($('input[name="DetalhaBcPorEvento"]').val() === 'sim') {
                            $('button[name="gerar-novo-item"]').attr('disabled', 'disabled');
                            $('button[name="btnSalvarItemMovimento"]').attr('disabled', 'disabled');
                            //$('button[name="btnAtualizarResumo"]').attr('disabled', 'disabled');
                            $('input').attr('readonly', 'readonly');
                            $('input').prop('readonly', true);
                            $('#table-lista-itens').DataTable().rows().deselect();
                        }
                        console.log('Itens carregados');
                        ItemControl.totValoresItens();
                        // $('.dt-search').append('<button type="button" name="gerar-novo-item" id="gerar-novo-item" class="btn btn-light"><i class="fa-solid fa-plus text-success"></i></button>');
                    });

                } else {
                    //$.when(geraTbodyItens()).then(function (data, textStatus, jqXHR) {
                    // datatable_lista.draw();
                    // datatable_lista.order([[0, 'asc']]).draw(false);
                    //});
                }

            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error('Erro ao carregar os dados da API:', textStatus, errorThrown);
                alert(`Erro ao carregar os dados. Detalhes: ${textStatus}`);
            }
        });
    }

    // Função para lidar com a exclusão de linhas
    function handleDeleteRow(button) {
        if(ItemMovimento.dataTableInstance !== null){
            const table = ItemMovimento.dataTableInstance;
            const row = button.closest('tr');
            const rowData = table.row(row).data();

            console.log('Dados da linha:', rowData);

            if (rowData.mov_ano && rowData.mov_numero) {
                const mov_ano = rowData.mov_ano;
                const mov_numero = parseInt(rowData.mov_numero, 10); // Mantenha como string
                const pim_sequencial = parseInt(rowData.pim_sequencial, 10);

                if (isNaN(mov_ano)) {
                    alert('O campo "ano" deve ser um número válido.');
                    return;
                }

                $.ajax({
                    url: '/precatorios/delete/',
                    type: 'DELETE',
                    headers: {
                        'X-CSRFToken': $('meta[name="csrf-token"]').attr('content')
                    },
                    contentType: 'application/json',
                    data: JSON.stringify({ mov_ano: mov_ano, mov_numero: mov_numero, pim_sequencial: pim_sequencial }),
                    success: function (response) {
                        console.log('Registro excluído do banco de dados:', response);
                        table.row(row).remove().draw();
                        alert('Registro excluído com sucesso!');
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.error('Erro ao excluir o registro:', textStatus, errorThrown);
                        alert(`Erro ao excluir o registro: ${textStatus}. Verifique o console para mais detalhes.`);
                    }
                });
            } else {
                table.row(row).remove().draw();
                console.log('Linha removida do DataTable.');
            }
        }
    }

    // Função para validar os dados
    function validateData(data) {
        const errors: { index: number; message: string }[] = [];
        data.forEach((item, index) => {
            const requiredFields = [
                'mes_ano',
                'pim_base_calculo_contribuicao_segurado', 'pim_base_calculo_contribuicao_patronal', 'inc_codigo',
                'pim_indice_correcao', 'pim_base_calculo_contribuicao_segurado_corrigida', 'pim_base_calculo_contribuicao_patronal_corrigida',
                'aliquota_segurado',
                'aliquota_patronal',
                'pim_vlr_cota_segurado',
                'pim_vlr_cota_patronal', 'pim_situacao'
            ];
            requiredFields.forEach(field => {
                if (!item[field] || !String(item[field]).trim()) {
                    errors.push({
                        index: index,
                        message: `Campo obrigatório ausente ou inválido: ${field}`
                    });
                }
            });
        });

        if (errors.length > 0) {
            console.error('Erros de validação encontrados:', errors);
            alert('Erro de validação: ' + errors.map(e => e.message).join('; '));
            return false; // Dados inválidos
        }

        console.log('Dados validados com sucesso:', data);
        return true; // Dados válidos
    }

    // Função auxiliar para converter valores numéricos para o formato americano
    function convertToAmericanFormat(value) {
        if (!value) return '0.00'; // Retorna "0.00" se o valor for vazio
        return value.replace(/\./g, '').replace(',', '.'); // Remove pontos e substitui v�rgula por ponto
    }

    function extractValue(cell) {
        const input = cell.find('input');
        const select = cell.find('select');

        if (input.length > 0) {
            return input.val(); // Valor de um campo de entrada
        } else if (select.length > 0) {
            return select.val(); // Valor de um campo de seleção
        } else {
            return cell.text().trim(); // Texto simples da célula
        }
    }

    function processTableData() {
        const data: Array<{
            mes_ano?: string;
            pim_sequencial?: string;
            mov_ano?: string;
            mov_numero?: string;
            pim_mes_referencia?: string;
            pim_ano_referencia?: string;
            pim_aliquota_segurado_ate_teto_inss?: string;
            pim_aliquota_segurado_acima_teto_inss?: string;
            pim_aliquota_patronal_ate_teto_inss?: string;
            pim_aliquota_patronal_acima_teto_inss?: string;
            pim_aliquota_patronal_art_122?: string;
            pim_vlr_cota_patronal_art_122?: string;
            pim_vlr_contribuicao_total?: string;
            pim_dt_inclusao?: string;
        }> = [];
        const tableData = ItemMovimento.dataTableInstance ? ItemMovimento.dataTableInstance.rows().data().toArray() : [];

        tableData.forEach((rowData, rowIndex) => {
            const processedRow = {};

            // Itera sobre os campos do modelo e extrai os valores
            Object.keys(rowData).forEach(fieldName => {
                let fieldValue = rowData[fieldName];

                // Converte valores numéricos para o formato americano
                if (['pim_base_calculo_contribuicao_segurado', 'pim_base_calculo_contribuicao_patronal'].includes(fieldName)) {
                    fieldValue = convertToAmericanFormat(fieldValue);
                }

                // Adiciona o valor ao objeto da linha
                processedRow[fieldName] = fieldValue;
            });

            // Extrai os atributos da coluna mes_ano
            const mesAnoCell = $(`#linh\\[${rowIndex}\\]\\[mes_ano\\]`);
            processedRow['pim_sequencial'] = mesAnoCell.data('pim-sequencial') || '';
            processedRow['mov_ano'] = mesAnoCell.data('mov-ano') || '';
            processedRow['mov_numero'] = mesAnoCell.data('mov-numero') || '';
            processedRow['pim_mes_referencia'] = mesAnoCell.data('pim-mes-referencia') || '';
            processedRow['pim_ano_referencia'] = mesAnoCell.data('pim-ano-referencia') || '';

            const aliquotaSeguradoCell = $(`#linh\\[${rowIndex}\\]\\[aliquota_segurado\\]`);
            processedRow['pim_aliquota_segurado_ate_teto_inss'] = aliquotaSeguradoCell.data('pim-aliquota-segurado-ate-teto-inss') || '0,00';
            processedRow['pim_aliquota_segurado_acima_teto_inss'] = aliquotaSeguradoCell.data('pim-aliquota-segurado-acima-teto-inss') || '0,00';

            const aliquotaPatronalCell = $(`#linh\\[${rowIndex}\\]\\[aliquota_patronal\\]`);
            processedRow['pim_aliquota_patronal_ate_teto_inss'] = aliquotaPatronalCell.data('pim-aliquota-patronal-ate-teto-inss') || '0,00';
            processedRow['pim_aliquota_patronal_acima_teto_inss'] = aliquotaPatronalCell.data('pim-aliquota-patronal-acima-teto-inss') || '0,00';
            processedRow['pim_aliquota_patronal_art_122'] = aliquotaPatronalCell.data('pim-aliquota-patronal-art-122') || '0,00';

            const cotaPatronalCell = $(`#linh\\[${rowIndex}\\]\\[pim_vlr_cota_patronal\\]`);
            processedRow['pim_vlr_cota_patronal_art_122'] = cotaPatronalCell.data('pim-vlr-cota-patronal-art-122') || '0,00';
            processedRow['pim_vlr_contribuicao_total'] = cotaPatronalCell.data('pim-vlr-contribuicao-total') || '0,00';
            processedRow['pim_dt_inclusao'] = cotaPatronalCell.data('pim-dt-inclusao') || new Date().toISOString().split('T')[0];
            // Adiciona a linha processada ao array de dados
            data.push(processedRow);
        });

        console.log('Dados processados para envio ao backend:', data);
        return data;
    }

    function sendDataToBackend() {
        const data = processTableData();

        // Validação básica
        const requiredFields = ['mes_ano', 'pim_dt_inclusao'];
        const errors:string[] = [];

        data.forEach((item, index) => {
            requiredFields.forEach(field => {
                if (!item[field]) {
                    errors.push(`Erro na linha ${(index + 1).toString()}: Campo obrigatório ausente ou inválido: ${field.toString()}`);
                }
            });
        });

        if (errors.length > 0) {
            alert(errors.join('\n'));
            return;
        }

        // Envia os dados ao backend
        $.ajax({
            url: '/precatorios/save-all/',
            type: 'POST',
            headers: {
                'X-CSRFToken': $('meta[name="csrf-token"]').attr('content')
            },
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function (response) {
                if (response.status === 'success') {
                    alert('Todos os dados foram salvos com sucesso!');
                } else {
                    alert('Erro ao salvar os dados: ' + response.message);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(`Erro ao salvar os dados: ${textStatus}. Verifique o console para mais detalhes.`);
            }
        });
    }

    // Função para salvar os dados no backend
    function saveDataToBackendOld() {
        const data = ItemMovimento.dataTableInstance.rows().data().toArray();
        const processedData = data.map((item, rowIndex) => {
            // Extrai os atributos da coluna mes_ano
            const mesAnoCell = $(`#linh\\[${rowIndex}\\]\\[mes_ano\\]`);
            const pimSequencial = mesAnoCell.data('pim-sequencial') || "0.00";
            const movAno = parseFloat(mesAnoCell.data('mov-ano')) || 0;
            const movNumero = parseFloat(mesAnoCell.data('mov-numero')) || 0;
            const pim_mes_referencia = parseFloat(mesAnoCell.data('pim-mes-referencia')) || 0;
            const pim_ano_referencia = parseFloat(mesAnoCell.data('pim-ano-referencia')) || 0;

            const aliquotaSeguradoCell = $(`#linh\\[${rowIndex}\\]\\[aliquota_segurado\\]`);
            const pim_aliquota_segurado_ate_teto_inss = aliquotaSeguradoCell.data('pim-aliquota-segurado-ate-teto-inss') || "0,00";
            const pim_aliquota_segurado_acima_teto_inss = aliquotaSeguradoCell.data('pim-aliquota-segurado-acima-teto-inss') || "0,00";

            const aliquotaPatronalCell = $(`#linh\\[${rowIndex}\\]\\[aliquota_patronal\\]`);
            const pim_aliquota_patronal_ate_teto_inss = aliquotaPatronalCell.data('pim-aliquota-patronal-ate-teto-inss') || "0,00";
            const pim_aliquota_patronal_acima_teto_inss = aliquotaPatronalCell.data('pim-aliquota-patronal-acima-teto-inss') || "0,00";
            const pim_aliquota_patronal_art_122 = aliquotaPatronalCell.data('pim-aliquota-patronal-art-122') || "0,00";

            const cotaPatronalCell = $(`#linh\\[${rowIndex}\\]\\[pim_vlr_cota_patronal\\]`);
            const pim_vlr_cota_patronal_art_122 = cotaPatronalCell.data('pim-vlr-cota-patronal-art-122') || "0,00";
            const pim_vlr_contribuicao_total = cotaPatronalCell.data('pim-vlr-contribuicao-total') || "0,00";
            const pim_dt_inclusao = cotaPatronalCell.data('pim-dt-inclusao') || new Date().toISOString().split('T')[0];

            return {
                pim_sequencial: pimSequencial,
                mov_ano: movAno,
                mov_numero: movNumero,
                mes_ano: item.mes_ano || "",
                pim_mes_referencia: pim_mes_referencia || 0,
                pim_ano_referencia: pim_ano_referencia || 0,
                pim_base_calculo_contribuicao_segurado: parseFloat(item.pim_base_calculo_contribuicao_segurado.replace(',', '.')) || 0,
                pim_base_calculo_contribuicao_patronal: parseFloat(item.pim_base_calculo_contribuicao_patronal.replace(',', '.')) || 0,
                inc_codigo: parseFloat(item.inc_codigo.replace(',', '.')) || 0,
                pim_indice_correcao: parseFloat(item.pim_indice_correcao.replace(',', '.')) || 0,
                pim_base_calculo_contribuicao_segurado_corrigida: parseFloat(item.pim_base_calculo_contribuicao_segurado_corrigida.replace(',', '.')) || 0,
                pim_base_calculo_contribuicao_patronal_corrigida: parseFloat(item.pim_base_calculo_contribuicao_patronal_corrigida.replace(',', '.')) || 0,

                pim_aliquota_segurado_ate_teto_inss: parseFloat(pim_aliquota_segurado_ate_teto_inss.replace(',', '.')) || 0,
                pim_aliquota_segurado_acima_teto_inss: parseFloat(pim_aliquota_segurado_acima_teto_inss.replace(',', '.')) || 0,
                pim_aliquota_patronal_ate_teto_inss: parseFloat(pim_aliquota_patronal_ate_teto_inss.replace(',', '.')) || 0,
                pim_aliquota_patronal_acima_teto_inss: parseFloat(pim_aliquota_patronal_acima_teto_inss.replace(',', '.')) || 0,
                pim_aliquota_patronal_art_122: parseFloat(pim_aliquota_patronal_art_122.replace(',', '.')) || 0,

                pim_vlr_cota_segurado: parseFloat(item.pim_vlr_cota_segurado.replace(',', '.')) || 0,
                pim_vlr_cota_patronal: parseFloat(item.pim_vlr_cota_patronal.replace(',', '.')) || 0,
                pim_vlr_cota_patronal_art_122: parseFloat(pim_vlr_cota_patronal_art_122.replace(',', '.')) || 0,
                pim_vlr_contribuicao_total: parseFloat(pim_vlr_contribuicao_total.replace(',', '.')) || 0,
                pim_dt_inclusao: extractValue($(pim_dt_inclusao)) || new Date().toISOString().split('T')[0],
                pim_situacao: extractValue($(item.pim_situacao)) || "ativo"
            };
        });

        console.log('Dados processados para envio ao backend:', processedData);

        $.ajax({
            url: '/precatorios/save-all/',
            type: 'POST',
            headers: {
                'X-CSRFToken': $('meta[name="csrf-token"]').attr('content')
            },
            contentType: 'application/json',
            data: JSON.stringify(processedData),
            success: function (response) {
                if (response.status === 'success') {
                    alert('Todos os dados foram salvos com sucesso!');
                } else if (response.status === 'error') {
                    let errorMessage = 'Erros encontrados ao salvar os dados:\n';
                    response.errors.forEach(error => {
                        errorMessage += `Item ${error.index}: ${error.message}\n`;
                    });
                    alert(errorMessage);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(`Erro ao salvar os dados: ${textStatus}. Verifique o console para mais detalhes.`);
            }
        });
    }

    // const getNumericValue = (selector, defaultValue = 0) => {
    //     const value = $row.find(selector).val();
    //     if (value === undefined || value === null || value === '') return defaultValue;
    //     const cleanedValue = String(value).replace(/\./g, '').replace(',', '.');
    //     const parsed = parseFloat(cleanedValue);
    //     return isNaN(parsed) ? defaultValue : parsed;
    // };
    // const getTextValue = (selector, defaultValue = '') => {
    //     const value = $row.find(selector).val();
    //     return (value === undefined || value === null) ? defaultValue : String(value).trim();
    // };

    function addRegistroNoArray(rowData) {
        let tempo:number = Date.now();
        // Obtém a última linha adicionada e obtém o atributo accesskey
        // const newRow = ItemMovimento.dataTableInstance.row(':last').node();
        // tempo = $(newRow).attr('accesskey');
        let rd = {
            tempo: ((rowData.tempo !== undefined && rowData.tempo !== null) ? rowData.tempo : parseInt(tempo.toString())),
            pim_sequencial: ((rowData.pim_sequencial !== undefined && rowData.pim_sequencial !== null) ? rowData.pim_sequencial : 0),
            mov_ano: ((rowData.mov_ano !== undefined && rowData.mov_ano !== null) ? rowData.mov_ano : ItemControl.mov_ano.toString()),
            mov_numero: ((rowData.mov_numero !== undefined && rowData.mov_numero !== null) ? rowData.mov_numero : parseInt(ItemControl.mov_numero.toString())),
            mes_ano: ((rowData.mes_ano !== undefined && rowData.mes_ano !== null) ? rowData.mes_ano : '01/1900'),
            pim_mes_referencia: ((rowData.pim_mes_referencia !== undefined && rowData.pim_mes_referencia !== null) ? rowData.pim_mes_referencia : 1),
            pim_ano_referencia: ((rowData.pim_ano_referencia !== undefined && rowData.pim_ano_referencia !== null) ? rowData.pim_ano_referencia : 1900),
            pim_base_calculo_contribuicao_segurado: ((rowData.pim_base_calculo_contribuicao_segurado !== undefined && rowData.pim_base_calculo_contribuicao_segurado !== null) ? rowData.pim_base_calculo_contribuicao_segurado : 0),
            pim_base_calculo_contribuicao_patronal: ((rowData.pim_base_calculo_contribuicao_patronal !== undefined && rowData.pim_base_calculo_contribuicao_patronal !== null) ? rowData.pim_base_calculo_contribuicao_patronal : 0),
            inc_codigo: ((rowData.inc_codigo !== undefined && rowData.inc_codigo !== null) ? rowData.inc_codigo : 0),
            pim_indice_correcao: ((rowData.pim_indice_correcao !== undefined && rowData.pim_indice_correcao !== null) ? rowData.pim_indice_correcao : 0),
            pim_base_calculo_contribuicao_segurado_corrigida: ((rowData.pim_base_calculo_contribuicao_segurado_corrigida !== undefined && rowData.pim_base_calculo_contribuicao_segurado_corrigida !== null) ? rowData.pim_base_calculo_contribuicao_segurado_corrigida : 0),
            pim_base_calculo_contribuicao_patronal_corrigida: ((rowData.pim_base_calculo_contribuicao_patronal_corrigida !== undefined && rowData.pim_base_calculo_contribuicao_patronal_corrigida !== null) ? rowData.pim_base_calculo_contribuicao_patronal_corrigida : 0),
            pim_aliquota_segurado_ate_teto_inss: ((rowData.pim_aliquota_segurado_ate_teto_inss !== undefined && rowData.pim_aliquota_segurado_ate_teto_inss !== null) ? rowData.pim_aliquota_segurado_ate_teto_inss : 0),
            pim_aliquota_segurado_acima_teto_inss: ((rowData.pim_aliquota_segurado_acima_teto_inss !== undefined && rowData.pim_aliquota_segurado_acima_teto_inss !== null) ? rowData.pim_aliquota_segurado_acima_teto_inss : 0),
            pim_aliquota_patronal_ate_teto_inss: ((rowData.pim_aliquota_patronal_ate_teto_inss !== undefined && rowData.pim_aliquota_patronal_ate_teto_inss !== null) ? rowData.pim_aliquota_patronal_ate_teto_inss : 0),
            pim_aliquota_patronal_acima_teto_inss: ((rowData.pim_aliquota_patronal_acima_teto_inss !== undefined && rowData.pim_aliquota_patronal_acima_teto_inss !== null) ? rowData.pim_aliquota_patronal_acima_teto_inss : 0),
            pim_aliquota_patronal_art_122: ((rowData.pim_aliquota_patronal_art_122 !== undefined && rowData.pim_aliquota_patronal_art_122 !== null) ? rowData.pim_aliquota_patronal_art_122 : 0),
            pim_vlr_cota_segurado: ((rowData.pim_vlr_cota_segurado !== undefined && rowData.pim_vlr_cota_segurado !== null) ? rowData.pim_vlr_cota_segurado : 0),
            pim_vlr_cota_patronal: ((rowData.pim_vlr_cota_patronal !== undefined && rowData.pim_vlr_cota_patronal !== null) ? rowData.pim_vlr_cota_patronal : 0),
            pim_vlr_cota_patronal_art_122: ((rowData.pim_vlr_cota_patronal_art_122 !== undefined && rowData.pim_vlr_cota_patronal_art_122 !== null) ? rowData.pim_vlr_cota_patronal_art_122 : 0),
            pim_vlr_contribuicao_total: ((rowData.pim_vlr_contribuicao_total !== undefined && rowData.pim_vlr_contribuicao_total !== null) ? rowData.pim_vlr_contribuicao_total : 0),
            pim_dt_inclusao: ((rowData.pim_dt_inclusao !== undefined && rowData.pim_dt_inclusao !== null) ? rowData.pim_dt_inclusao : '01'),
            pim_situacao: ((rowData.pim_situacao !== undefined && rowData.pim_situacao !== null) ? rowData.pim_situacao : 'A')
        };
        ItemControl.dadosDaTabela.push(rd);
    }

    // // Função para coletar os dados da tabela
    // function collectDataFromTable() {
    //     let $row = $(this);
    //     let rowData: { [key: string]: any } = {};
    //     const getAttributeValue = (selector, attr, defaultValue = '0') => {
    //         const value = $row.find(selector).attr(attr);
    //         return (value === undefined || value === null) ? defaultValue : value;
    //     };

    //     rowData.tempo = getAttributeValue('input.mes_ano', 'data-pim-sequencial', Date.now().toString());
    //     // Campos válidos para o modelo Precatorio (excluindo aliquota_patronal, aliquota_segurado, mes_ano)
    //     rowData.pim_sequencial = getAttributeValue('input.mes_ano', 'data-pim-sequencial', '0');
    //     rowData.mov_ano = parseInt(getAttributeValue('input.mes_ano', 'data-mov-ano', '0') as string) || '';
    //     rowData.mov_numero = parseInt(getAttributeValue('input.mes_ano', 'data-mov-numero', '0') as string) || 0;
    //     // Substituímos mes_ano por pim_mes_referencia e pim_ano_referencia, se aplicável
    //     let mesAno = $row.find('input.mes_ano').val(); // Ex.: "01/2000"
    //     console.log('mesAno', mesAno);
    //     if (mesAno) {
    //         let mesAno_ = mesAno.toString().split('/');
    //         rowData.pim_mes_referencia = mesAno_[0] ? parseInt(mesAno_[0]) : 0;
    //         rowData.pim_ano_referencia = mesAno_[1] ? parseInt(mesAno_[1]) : 0;
    //     } else {
    //         rowData.pim_mes_referencia = parseInt(getAttributeValue('input.mes_ano', 'data-pim-mes-referencia', '0') as string) || 0;
    //         rowData.pim_ano_referencia = parseInt(getAttributeValue('input.mes_ano', 'data-pim-ano-referencia', '0') as string) || 0;
    //     }
    //     rowData.pim_base_calculo_contribuicao_segurado = getNumericValue('input.pim_base_calculo_contribuicao_segurado');
    //     rowData.pim_base_calculo_contribuicao_patronal = getNumericValue('input.pim_base_calculo_contribuicao_patronal');
    //     rowData.inc_codigo = getNumericValue('select[name$="[inc_codigo]"]');
    //     rowData.pim_indice_correcao = getNumericValue('input.monetIndice');
    //     rowData.pim_base_calculo_contribuicao_segurado_corrigida = getNumericValue('input[name$="[pim_base_calculo_contribuicao_segurado_corrigida]"]');
    //     rowData.pim_base_calculo_contribuicao_patronal_corrigida = getNumericValue('input[name$="[pim_base_calculo_contribuicao_patronal_corrigida]"]');
    //     rowData.pim_aliquota_segurado_ate_teto_inss = getNumericValue('input.pim_aliquota_segurado_ate_teto_inss');
    //     rowData.pim_aliquota_segurado_acima_teto_inss = getNumericValue('input.pim_aliquota_segurado_acima_teto_inss');
    //     rowData.pim_aliquota_patronal_ate_teto_inss = getNumericValue('input.pim_aliquota_patronal_ate_teto_inss');
    //     rowData.pim_aliquota_patronal_acima_teto_inss = getNumericValue('input.pim_aliquota_patronal_acima_teto_inss');
    //     rowData.pim_aliquota_patronal_art_122 = getNumericValue('input.pim_aliquota_patronal_art_122');
    //     rowData.pim_vlr_cota_segurado = getNumericValue('input.pim_vlr_cota_segurado');
    //     rowData.pim_vlr_cota_patronal = getNumericValue('input.pim_vlr_cota_patronal');
    //     rowData.pim_vlr_cota_patronal_art_122 = getNumericValue('input.pim_vlr_cota_patronal_art_122');
    //     rowData.pim_vlr_contribuicao_total = getNumericValue('input.pim_vlr_contribuicao_total');
    //     rowData.pim_dt_inclusao = getTextValue('input[name$="[pim_dt_inclusao]"]', '');
    //     rowData.pim_situacao = getTextValue('select.pim_situacao', '');
    //     addRegistroNoArray(rowData);
    // }

    // Função para enviar os dados ao backend
    function saveDataToBackend() {

        if (!ItemControl.dadosDaTabela || ItemControl.dadosDaTabela.length === 0) {
            console.error('Nenhum dado válido para enviar');
            alert('Nenhum dado para salvar!');
            return;
        }

        let jsonData = JSON.stringify(ItemControl.dadosDaTabela);
        console.log('Dados serializados para JSON:', jsonData);

        $.ajax({
            url: '/precatorios/save-all/',
            type: 'POST',
            data: jsonData,
            contentType: 'application/json',
            processData: false,
            dataType: 'json',
            beforeSend: function (xhr) {
                console.log('Enviando requisição POST com corpo:', jsonData);
            },
            success: function (response) {
                console.log('Resposta do backend:', response);
                alert('Dados salvos com sucesso!');
            },
            error: function (xhr, status, error) {
                console.error('Erro ao salvar os dados:', xhr.responseText);
                alert('Erro ao salvar os dados: ' + xhr.responseText + '. Verifique o console para mais detalhes.');
            }
        });
    }
    // Função para criar uma nova linha com valores padr�o
    function createNewRowData() {
        return {
            mes_ano: '',
            pim_base_calculo_contribuicao_segurado: 0.00,
            pim_base_calculo_contribuicao_patronal: 0.00,
            inc_codigo: 0,
            pim_indice_correcao: 0.00000000,
            pim_base_calculo_contribuicao_segurado_corrigida: 0.00,
            pim_base_calculo_contribuicao_patronal_corrigida: 0.00,
            aliquota_segurado: 0.00,
            aliquota_patronal: 0.00,
            pim_vlr_cota_segurado: 0.00,
            pim_vlr_cota_patronal: 0.00,
            pim_dt_inclusao: new Date().toISOString().split('T')[0],
            pim_situacao: 'A'
        };
    }

    // Função para analisar o atributo "name" e extrair o índice e o campo
    function parseFieldName(name) {
        const regex = /inpu\[(\d+)\]\[(\w+)\]/;
        const match = name.match(regex);
        if (match) {
            return {
                index: parseInt(match[1]),    //    índice (pim_sequencial ou tempo)
                field: match[2]               //    Nome do campo (ex.: mes_ano)
            };
        }
        console.error('Formato inválido do atributo "name":', name);
        return null;
    }

    // Função para atualizar o array dadosDaTabela quando um campo é alterado
    function updateDataArrayFromInput(inputElement) {
        const name = $(inputElement).attr('name'); // Obtém o atributo "name"
        const accesskey = $(inputElement).attr('accesskey'); // Obtém o atributo "accesskey"

        console.log('Atributo name:', name); // Depuração: exibe o valor do atributo "name"
        console.log('Atributo accesskey:', accesskey); // Depuração: exibe o valor do atributo "accesskey"

        const parsed = parseFieldName(name); // Analisa o atributo "name"
        if (!parsed) {
            console.error('Não foi possível analisar o atributo "name".');
            return;
        }

        const { field } = parsed; // Extrai o nome do campo
        const newValue = $(inputElement).val(); // Obtém o novo valor do campo

        // Localiza o registro no array pelo atributo "accesskey"
        const record = ItemControl.dadosDaTabela.find(item => item.tempo === Number(accesskey));

        if (record) {
            // Atualiza o campo no registro
            const campos_numericos = [
                'pim_base_calculo_contribuicao_segurado', 'pim_base_calculo_contribuicao_patronal', 'pim_indice_correcao', 'pim_base_calculo_contribuicao_segurado_corrigida'
                , 'pim_base_calculo_contribuicao_patronal_corrigida', 'pim_aliquota_segurado_ate_teto_inss', 'pim_aliquota_segurado_acima_teto_inss', 'pim_aliquota_patronal_ate_teto_inss'
                , 'pim_aliquota_patronal_acima_teto_inss', 'pim_aliquota_patronal_art_122', 'pim_vlr_cota_segurado', 'pim_vlr_cota_patronal', 'pim_vlr_cota_patronal_art_122', 'pim_vlr_contribuicao_total'
            ];
            if (campos_numericos.includes(field)) {
                record[field] = newValue?.toString().replace('.', '').replace(',', '.');
            } else {
                record[field] = newValue;
            }

            // console.log(`Campo "${field}" atualizado para "${newValue}" no registro com tempo=${accesskey}`);
            if (field === 'mes_ano') {
                record['pim_mes_referencia'] = newValue?.toString().split('/')[0];
                record['pim_ano_referencia'] = newValue?.toString().split('/')[1];
            }
        } else {
            console.error(`Registro com tempo=${accesskey} não encontrado no array.`);
        }
    }

    // Exemplo de uso no evento onblur
    $(document).on('blur', 'input[name^="inpu["], select[name^="inpu["]', function () {
        updateDataArrayFromInput(this);
        console.table(ItemControl.dadosDaTabela);
    });

    // Document Ready
    $(function() {
        // console.log('Página carregada. Buscando dados da API...');
        var amri = $('input[name="anomes_referencia_inicial"]').val();
        var anomes_referencia_inicial = (amri !== undefined && amri !== null && amri !== '') ? amri : '190001';
        var ano = anomes_referencia_inicial.toString().substr(0, 4);
        var mes = anomes_referencia_inicial.toString().substr(4, 2);
        _ano = ano.toString();
        _mes = mes.toString();

        console.log('fetchDataAndInitializeTable()');
        $.when(ItemControl.carregarIndices()).then(function (data, textStatus, jqXHR) {
            fetchDataAndInitializeTable();
        });

        // Função para adicionar uma nova linha ao DataTable
        $('#addRow').on('click', function () {
            // Define variáveis globais
            ItemControl.tempo = Date.now();
            let mvan = $('input[name="mov_ano"]').val();
            let mvnmro = $('input[name="mov_numero"]').val();
            ItemControl.mov_ano =  (mvan !== undefined && mvan !== null && mvan !== '') ? mvan.toString() : '';
            ItemControl.mov_numero = Number((mvnmro !== undefined && mvnmro !== null && mvnmro !== '') ? mvnmro.toString() : '0');

            const BcCorrigida = $('input[name="BcCorrigida"]').val();

            // Validação básica
            if (!ItemControl.mov_ano || !ItemControl.mov_numero) {
                alert('Por favor, preencha os campos "mov_ano" e "mov_numero".');
                return;
            }

            if (!ItemMovimento.dataTableInstance) {
                alert('A tabela ainda não foi inicializada. Aguarde o carregamento dos dados.');
                return;
            }

            // Cria a nova linha com valores padr�o
            const newRowData = createNewRowData();

            try {
                // Adiciona a nova linha ao DataTable
                if(ItemMovimento.dataTableInstance !== null && ItemMovimento.dataTableInstance !== undefined && ItemMovimento.dataTableInstance !== ''
                    && ItemMovimento.dataTableInstance !== 'undefined'
                ) {
                    ItemMovimento.dataTableInstance.row.add(newRowData).draw(false);
                    ItemMovimento.dataTableInstance.order([]).draw(false); // Reordena a tabela

                    // Obtém a última linha adicionada e define o atributo accesskey
                    const newRow = ItemMovimento.dataTableInstance.row(':last').node();
                    $(newRow).attr('accesskey', ItemControl.tempo);

                    // Atualiza os totais e exibe os dados no console
                    addRegistroNoArray({});
                    ItemControl.totValoresItens();

                    // console.table(dadosDaTabela);
                }

            } catch (error) {
                console.error('Erro ao adicionar a nova linha:', error);
                alert('Ocorreu um erro ao adicionar a nova linha. Verifique o console para mais detalhes.');
            }
        });


        // Evento de clique no botão de salvar
        // $('#saveData').on('click', function (e) {
        //     e.preventDefault();
        //     // console.log('Dados a serem salvos:', dadosDaTabela);
        //     saveDataToBackend(dadosDaTabela);
        // });

        // Função para validar os dados antes de salvar
        function validateData(data) {
            for (const row of data) {
                if (!row.mes_ano || !row.pim_base_calculo_contribuicao_segurado || !row.pim_base_calculo_contribuicao_patronal) {
                    console.error('Dados inválidos encontrados:', row);
                    alert('Por favor, preencha todos os campos obrigat�rios.');
                    return false;
                }
            }
            return true;
        }
        // Função para mostrar/ocultar o indicador de carregamento
        function showLoadingIndicator(show = true) {
            const loadingElement = document.getElementById('loading-indicator');
            if (loadingElement) {
                loadingElement.style.display = show ? 'block' : 'none';
            }
        }
        // Evento de clique no botão de salvar
        $('#saveData').on('click', function (e) {
            e.preventDefault(); // Impede o comportamento padrão do formulário
            console.log('Salvando alterações...');
            // Mostra o indicador de carregamento
            showLoadingIndicator(true);
            try {
                // Valida os dados antes de enviar
                if (!validateData(ItemControl.dadosDaTabela)) {
                    console.error('Validação falhou, envio ao backend interrompido');
                    return;
                }
                // Exibe os dados que serão salvos no console
                console.log('Dados a serem salvos:', ItemControl.dadosDaTabela);

                // Envia os dados ao backend
                saveDataToBackend();
            } catch (error : any) {
                console.error('Erro ao salvar os dados:', error.message);
                alert(`Erro ao salvar os dados: ${error.message}`);
            } finally {
                // Oculta o indicador de carregamento
                showLoadingIndicator(false);
            }
        });

        // Event delegation para o botão "Excluir"
        $('#table-lista-itens tbody').on('click', '.delete-row', function () {
            const button = $(this);
            if (confirm('Tem certeza de que deseja excluir esta linha?')) {
                handleDeleteRow(button);
            }
        });
    });
}

declare module "ItemMovimento" {
	export = ItemMovimento;
}

$(document).on('change', '#table-lista-itens tbody td.editable input, #table-lista-itens tbody td.editable select', function () {
    ItemControl.totValoresItens();
});


$(function() {

});