"use strict";
var ItemMovimento;
(function (ItemMovimento) {
    ItemMovimento.dataTableInstance = null;
    ItemMovimento.datatable_lista = null;
    var tabelai = 0;
    ItemMovimento._ano = '0';
    ItemMovimento._mes = '0';
    var validar = false;
    var novoItem = true;
    var valido = true;
    var msg = '';
    var contador = 0;
    $("#btnAtualizarResumo").on('click', function () {
        var formAtual = $('#formItensMovimento').serialize();
        contador++;
        var formData = $('#formItensMovimento').serialize();
        $.ajax({
            type: 'POST',
            url: '/Relatorio/AtualizarResumoItemMovimento',
            data: {
                form: formData,
                segurado: $('#Segurado').val(),
                processoJudicial: $('#ProcessoJudicial').val(),
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
    var itensSemRegistro = false;
    function verificarItesSemRegistro() {
        if ($('table#table-lista-itens tbody tr td input.pim_sequencial').length) {
            itensSemRegistro = true;
        }
        else {
            itensSemRegistro = false;
        }
    }
    function inputMascara() {
        $('input.monet').maskMoney({ prefix: '', allowNegative: true, thousands: '.', decimal: ',', affixesStay: true });
        $('input.monetIndice').inputmask({ mask: function () { return ["9,99999999", "99,99999999"]; } });
        $('input.mes_ano').mask("99/9999");
    }
    function initializeDataTable(data, ano, mes, pageLength) {
        let listaDeIndiceCorrecaoMonetariaOptions = `
            <option value="1" opsel1 >IPCA-E</option>
            <option value="2" opsel2 >IGP-M</option>
        `;
        if (!Array.isArray(data)) {
            console.error('Os dados recebidos não são válidos:', data);
            alert('Erro ao carregar os dados. Verifique o console para mais detalhes.');
            return;
        }
        ItemMovimento.dataTableInstance = $('#table-lista-itens').DataTable({
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
                    sheetName: 'Precatorio ' + mes + '-de-' + ano,
                    messageTop: 'Precatorios: ' + mes + '/' + ano,
                    text: '<i class="far fa-file-excel text-success fa-lg"></i>',
                    title: null,
                    filename: function () {
                        return 'Precatorio-mes-' + mes + '-de-' + ano;
                    },
                    exportOptions: {
                        columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                        format: {
                            body: function (data, row, column, node) {
                                var _a, _b, _c, _d, _e, _f, _g;
                                console.log(data);
                                const $vale = $(data);
                                console.log($vale.filter('.mes_ano').val());
                                switch (column) {
                                    case 0:
                                        return $(node).find('input[type="text"]').val();
                                        break;
                                    case 1:
                                        return (_a = $(node).find('input.monet').val()) === null || _a === void 0 ? void 0 : _a.toString().replace('.', '').replace('.', '').replace('.', '').replace(',', '.');
                                        break;
                                    case 2:
                                        return (_b = $(node).find('input.monet').val()) === null || _b === void 0 ? void 0 : _b.toString().replace('.', '').replace('.', '').replace('.', '').replace(',', '.');
                                        break;
                                    case 3:
                                        return $(node).find('select option:selected').text();
                                        break;
                                    case 4:
                                        return (_c = $(node).find('input.monetIndice').val()) === null || _c === void 0 ? void 0 : _c.toString().replace('.', '').replace('.', '').replace('.', '').replace(',', '.');
                                        break;
                                    case 5:
                                        return (_d = $(node).find('input.monet').val()) === null || _d === void 0 ? void 0 : _d.toString().replace('.', '').replace('.', '').replace('.', '').replace(',', '.');
                                        break;
                                    case 6:
                                        return (_e = $(node).find('input.monet').val()) === null || _e === void 0 ? void 0 : _e.toString().replace('.', '').replace('.', '').replace('.', '').replace(',', '.');
                                        break;
                                    case 7:
                                        return $(node).find('label.esquer').text() + ' / ' + $(node).find('label.direi').text();
                                        break;
                                    case 8:
                                        return $(node).find('label.esquer').text() + ' / ' + $(node).find('label.direi').text();
                                        break;
                                    case 9:
                                        return (_f = $(node).find('input.monet').val()) === null || _f === void 0 ? void 0 : _f.toString().replace('.', '').replace('.', '').replace('.', '').replace(',', '.');
                                        break;
                                    case 10:
                                        return (_g = $(node).find('input.monet').val()) === null || _g === void 0 ? void 0 : _g.toString().replace('.', '').replace('.', '').replace('.', '').replace(',', '.');
                                        break;
                                    case 11:
                                        return $(node).find('select option:selected').text();
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
                        return data;
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
                                        ${listaDeIndiceCorrecaoMonetariaOptions.replace('opsel' + data, 'selected="selected"')}
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
                },
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
                                : '0,00');
                            let pim_aliquota_segurado_acima_teto_inss = (row.pim_aliquota_segurado_acima_teto_inss !== undefined
                                ? Intl.NumberFormat('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(row.pim_aliquota_segurado_acima_teto_inss).replace('R$ ', '')
                                : '0,00');
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
                                : '0,00');
                            let pim_aliquota_patronal_acima_teto_inss = (row.pim_aliquota_patronal_acima_teto_inss !== undefined
                                ? Intl.NumberFormat('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(row.pim_aliquota_patronal_acima_teto_inss).replace('R$ ', '')
                                : '0,00');
                            let pim_aliquota_patronal_art_122 = (row.pim_aliquota_patronal_art_122 !== undefined
                                ? Intl.NumberFormat('pt-br', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(row.pim_aliquota_patronal_art_122).replace('R$ ', '')
                                : '0,00');
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
                                    (((row.pim_vlr_cota_segurado + row.pim_vlr_cota_patronal) > 0)
                                        ? '<label class="form-control" id="inpu[' + row.pim_sequencial + '][label_trash]"><i class="fa-solid fa-trash-can text-secondary"></i></label>'
                                        : '<i class="fa-solid fa-trash-can text-warning cancelarItemMovimento" accesskey="' + row.pim_sequencial + '" id="inpu[' + row.pim_sequencial + '][excluir]" onclick="javascript:ItemControl.cancelarItemMovimentoDetalhaBcPorEvento(' + row.pim_sequencial + ');" style="' + colorCancel + '"></i>')
                                +
                                    `</td>`;
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
                { targets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], visible: true }
            ],
            autoFill: true
        }).draw();
    }
    function formatMesAno(mesReferencia, anoReferencia) {
        const mes = mesReferencia < 10 ? `0${mesReferencia}` : `${mesReferencia}`;
        return `${mes}/${anoReferencia}`;
    }
    function processDataForTable(data) {
        return data.map(item => {
            if (!item.pim_mes_referencia || !item.pim_ano_referencia) {
                console.warn('Dados incompletos para criar "mes_ano":', item);
            }
            const mesAno = formatMesAno(item.pim_mes_referencia || 1, item.pim_ano_referencia || 1900);
            return Object.assign(Object.assign({}, item), { mes_ano: mesAno, tempo: item.pim_sequencial || Date.now(), aliquota_segurado: item.pim_aliquota_segurado_ate_teto_inss || '0,00', aliquota_patronal: item.pim_aliquota_patronal_ate_teto_inss || '0,00' });
        });
    }
    function fetchDataAndInitializeTable() {
        var dadosForm = $('form[name="formItensMovimento"]').serializeArray();
        $.ajax({
            url: '/PrecatorioItemMovimento/Lista', data: dadosForm,
            type: 'get', dataType: 'json', cache: false, async: true,
            statusCode: { 403: function () { console.log('forbidden'); }, 404: function () { console.log('page not found'); }, 415: function () { console.log('Unsupported Media Type'); }, 405: function () { console.log('method not allowed'); }, 500: function () { console.log('internal server error'); }, 502: function () { console.log('Bad Gateway'); } },
            success: function (json, textStatus, jqXHR) {
                console.log('Dados recebidos da API:', json.lista);
                if (!Array.isArray(json.lista)) {
                    console.error('Os dados retornados pela API não são válidos.');
                    alert('Erro ao carregar os dados. Verifique o console para mais detalhes.');
                    return;
                }
                ItemControl.dadosDaTabela = processDataForTable(json.lista);
                if (json.sucesso) {
                    console.table(ItemControl.dadosDaTabela);
                    $.when(initializeDataTable(ItemControl.dadosDaTabela, ItemMovimento._ano, ItemMovimento._mes, 8)).then(function (data, textStatus, jqXHR) {
                        $('input.monet').maskMoney({ prefix: '', allowNegative: true, thousands: '.', decimal: ',', affixesStay: false });
                        if ($('input[name="DetalhaBcPorEvento"]').val() === 'sim') {
                            $('button[name="gerar-novo-item"]').attr('disabled', 'disabled');
                            $('button[name="btnSalvarItemMovimento"]').attr('disabled', 'disabled');
                            $('input').attr('readonly', 'readonly');
                            $('input').prop('readonly', true);
                            $('#table-lista-itens').DataTable().rows().deselect();
                        }
                        console.log('Itens carregados');
                        ItemControl.totValoresItens();
                    });
                }
                else {
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error('Erro ao carregar os dados da API:', textStatus, errorThrown);
                alert(`Erro ao carregar os dados. Detalhes: ${textStatus}`);
            }
        });
    }
    function handleDeleteRow(button) {
        if (ItemMovimento.dataTableInstance !== null) {
            const table = ItemMovimento.dataTableInstance;
            const row = button.closest('tr');
            const rowData = table.row(row).data();
            console.log('Dados da linha:', rowData);
            if (rowData.mov_ano && rowData.mov_numero) {
                const mov_ano = rowData.mov_ano;
                const mov_numero = parseInt(rowData.mov_numero, 10);
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
            }
            else {
                table.row(row).remove().draw();
                console.log('Linha removida do DataTable.');
            }
        }
    }
    function validateData(data) {
        const errors = [];
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
            return false;
        }
        console.log('Dados validados com sucesso:', data);
        return true;
    }
    function convertToAmericanFormat(value) {
        if (!value)
            return '0.00';
        return value.replace(/\./g, '').replace(',', '.');
    }
    function extractValue(cell) {
        const input = cell.find('input');
        const select = cell.find('select');
        if (input.length > 0) {
            return input.val();
        }
        else if (select.length > 0) {
            return select.val();
        }
        else {
            return cell.text().trim();
        }
    }
    function processTableData() {
        const data = [];
        const tableData = ItemMovimento.dataTableInstance ? ItemMovimento.dataTableInstance.rows().data().toArray() : [];
        tableData.forEach((rowData, rowIndex) => {
            const processedRow = {};
            Object.keys(rowData).forEach(fieldName => {
                let fieldValue = rowData[fieldName];
                if (['pim_base_calculo_contribuicao_segurado', 'pim_base_calculo_contribuicao_patronal'].includes(fieldName)) {
                    fieldValue = convertToAmericanFormat(fieldValue);
                }
                processedRow[fieldName] = fieldValue;
            });
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
            data.push(processedRow);
        });
        console.log('Dados processados para envio ao backend:', data);
        return data;
    }
    function sendDataToBackend() {
        const data = processTableData();
        const requiredFields = ['mes_ano', 'pim_dt_inclusao'];
        const errors = [];
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
                }
                else {
                    alert('Erro ao salvar os dados: ' + response.message);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(`Erro ao salvar os dados: ${textStatus}. Verifique o console para mais detalhes.`);
            }
        });
    }
    function saveDataToBackendOld() {
        const data = ItemMovimento.dataTableInstance.rows().data().toArray();
        const processedData = data.map((item, rowIndex) => {
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
                }
                else if (response.status === 'error') {
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
    function addRegistroNoArray(rowData) {
        let tempo = Date.now();
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
    function parseFieldName(name) {
        const regex = /inpu\[(\d+)\]\[(\w+)\]/;
        const match = name.match(regex);
        if (match) {
            return {
                index: parseInt(match[1]),
                field: match[2]
            };
        }
        console.error('Formato inválido do atributo "name":', name);
        return null;
    }
    function updateDataArrayFromInput(inputElement) {
        const name = $(inputElement).attr('name');
        const accesskey = $(inputElement).attr('accesskey');
        console.log('Atributo name:', name);
        console.log('Atributo accesskey:', accesskey);
        const parsed = parseFieldName(name);
        if (!parsed) {
            console.error('Não foi possível analisar o atributo "name".');
            return;
        }
        const { field } = parsed;
        const newValue = $(inputElement).val();
        const record = ItemControl.dadosDaTabela.find(item => item.tempo === Number(accesskey));
        if (record) {
            const campos_numericos = [
                'pim_base_calculo_contribuicao_segurado', 'pim_base_calculo_contribuicao_patronal', 'pim_indice_correcao', 'pim_base_calculo_contribuicao_segurado_corrigida',
                'pim_base_calculo_contribuicao_patronal_corrigida', 'pim_aliquota_segurado_ate_teto_inss', 'pim_aliquota_segurado_acima_teto_inss', 'pim_aliquota_patronal_ate_teto_inss',
                'pim_aliquota_patronal_acima_teto_inss', 'pim_aliquota_patronal_art_122', 'pim_vlr_cota_segurado', 'pim_vlr_cota_patronal', 'pim_vlr_cota_patronal_art_122', 'pim_vlr_contribuicao_total'
            ];
            if (campos_numericos.includes(field)) {
                record[field] = newValue === null || newValue === void 0 ? void 0 : newValue.toString().replace('.', '').replace(',', '.');
            }
            else {
                record[field] = newValue;
            }
            if (field === 'mes_ano') {
                record['pim_mes_referencia'] = newValue === null || newValue === void 0 ? void 0 : newValue.toString().split('/')[0];
                record['pim_ano_referencia'] = newValue === null || newValue === void 0 ? void 0 : newValue.toString().split('/')[1];
            }
        }
        else {
            console.error(`Registro com tempo=${accesskey} não encontrado no array.`);
        }
    }
    $(document).on('blur', 'input[name^="inpu["], select[name^="inpu["]', function () {
        updateDataArrayFromInput(this);
        console.table(ItemControl.dadosDaTabela);
    });
    $(function () {
        var amri = $('input[name="anomes_referencia_inicial"]').val();
        var anomes_referencia_inicial = (amri !== undefined && amri !== null && amri !== '') ? amri : '190001';
        var ano = anomes_referencia_inicial.toString().substr(0, 4);
        var mes = anomes_referencia_inicial.toString().substr(4, 2);
        ItemMovimento._ano = ano.toString();
        ItemMovimento._mes = mes.toString();
        console.log('fetchDataAndInitializeTable()');
        $.when(ItemControl.carregarIndices()).then(function (data, textStatus, jqXHR) {
            fetchDataAndInitializeTable();
        });
        $('#addRow').on('click', function () {
            ItemControl.tempo = Date.now();
            let mvan = $('input[name="mov_ano"]').val();
            let mvnmro = $('input[name="mov_numero"]').val();
            ItemControl.mov_ano = (mvan !== undefined && mvan !== null && mvan !== '') ? mvan.toString() : '';
            ItemControl.mov_numero = Number((mvnmro !== undefined && mvnmro !== null && mvnmro !== '') ? mvnmro.toString() : '0');
            const BcCorrigida = $('input[name="BcCorrigida"]').val();
            if (!ItemControl.mov_ano || !ItemControl.mov_numero) {
                alert('Por favor, preencha os campos "mov_ano" e "mov_numero".');
                return;
            }
            if (!ItemMovimento.dataTableInstance) {
                alert('A tabela ainda não foi inicializada. Aguarde o carregamento dos dados.');
                return;
            }
            const newRowData = createNewRowData();
            try {
                if (ItemMovimento.dataTableInstance !== null && ItemMovimento.dataTableInstance !== undefined && ItemMovimento.dataTableInstance !== ''
                    && ItemMovimento.dataTableInstance !== 'undefined') {
                    ItemMovimento.dataTableInstance.row.add(newRowData).draw(false);
                    ItemMovimento.dataTableInstance.order([]).draw(false);
                    const newRow = ItemMovimento.dataTableInstance.row(':last').node();
                    $(newRow).attr('accesskey', ItemControl.tempo);
                    addRegistroNoArray({});
                    ItemControl.totValoresItens();
                }
            }
            catch (error) {
                console.error('Erro ao adicionar a nova linha:', error);
                alert('Ocorreu um erro ao adicionar a nova linha. Verifique o console para mais detalhes.');
            }
        });
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
        function showLoadingIndicator(show = true) {
            const loadingElement = document.getElementById('loading-indicator');
            if (loadingElement) {
                loadingElement.style.display = show ? 'block' : 'none';
            }
        }
        $('#saveData').on('click', function (e) {
            e.preventDefault();
            console.log('Salvando alterações...');
            showLoadingIndicator(true);
            try {
                if (!validateData(ItemControl.dadosDaTabela)) {
                    console.error('Validação falhou, envio ao backend interrompido');
                    return;
                }
                console.log('Dados a serem salvos:', ItemControl.dadosDaTabela);
                saveDataToBackend();
            }
            catch (error) {
                console.error('Erro ao salvar os dados:', error.message);
                alert(`Erro ao salvar os dados: ${error.message}`);
            }
            finally {
                showLoadingIndicator(false);
            }
        });
        $('#table-lista-itens tbody').on('click', '.delete-row', function () {
            const button = $(this);
            if (confirm('Tem certeza de que deseja excluir esta linha?')) {
                handleDeleteRow(button);
            }
        });
    });
})(ItemMovimento || (ItemMovimento = {}));
$(document).on('change', '#table-lista-itens tbody td.editable input, #table-lista-itens tbody td.editable select', function () {
    ItemControl.totValoresItens();
});
$(function () {
});
//# sourceMappingURL=ItemMovimento.js.map