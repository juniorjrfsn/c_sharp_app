"use strict";
var ScriptsConfig;
(function (ScriptsConfig) {
    ScriptsConfig.footerAlert = '<span  style="color:#033E66;font-size:18px"> &nbsp; AGEPREV-MS / DIRGIN</span>';
    ScriptsConfig.contador = 1;
    ScriptsConfig.formOriginal = $('#formItensMovimento').serialize();
    ScriptsConfig.statusCodeHandlers = Object.fromEntries([200, 403, 404, 415, 405, 500, 502].map(code => [
        code,
        function (data, textStatus, jqXHR) {
            const messages = {
                200: '200: OK',
                403: '403: Forbidden',
                404: '404: Not Found',
                405: '405: Method Not Allowed',
                415: '415: Unsupported Media Type',
                500: '500: Internal Server Error',
                502: '502: Bad Gateway'
            };
            if (messages[code]) {
                if (code !== 200) {
                    console.log(messages[code]);
                }
            }
            else {
                console.error(`Unknown Status Code: ${code}`, textStatus, jqXHR, data);
            }
        }
    ]));
    function consoleError(_XMLHttpRequest_, textStatus, errorThrown) {
        console.log("error");
        console.log(_XMLHttpRequest_);
        console.log(textStatus);
        console.log(errorThrown);
    }
    ScriptsConfig.consoleError = consoleError;
    ScriptsConfig.listaDeIndiceCorrecaoMonetaria = null;
    ScriptsConfig.listaDeIndiceCorrecaoMonetariaOptions = null;
    ScriptsConfig.swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-success",
            cancelButton: "btn btn-danger"
        }
    });
    ScriptsConfig.swalconfirmeDel = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-primary",
            cancelButton: "btn btn-secondary"
        }
    });
    ScriptsConfig.swalconfirmeActionExcluirCancelarSair = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-danger",
            denyButton: "btn btn-warning",
            cancelButton: "btn btn-secondary"
        }
    });
    ScriptsConfig.swalconfirmeActionExcluirCancelar = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-danger",
            cancelButton: "btn btn-info"
        }
    });
    ScriptsConfig.swalconfirmeActionFinalizar = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-success",
            denyButton: "btn btn-info",
            cancelButton: "btn btn-warning"
        }
    });
    ScriptsConfig.swalconfirmeAction = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-info",
            denyButton: "btn btn-danger",
            cancelButton: "btn btn-secondary"
        }
    });
    ScriptsConfig.swalconfirmeActionAlerta = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-info",
            denyButton: "btn btn-warning",
            cancelButton: "btn btn-secondary"
        }
    });
    ScriptsConfig.swalconfirmeActionAlertaWarning = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-warning",
            denyButton: "btn btn-info",
            cancelButton: "btn btn-danger"
        }
    });
    ScriptsConfig.swalconfirmeActionWarning = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-info",
            denyButton: "btn btn-warning",
            cancelButton: "btn btn-secondary"
        }
    });
    function convertToAmericanFormat(value) {
        if (!value)
            return '0.00';
        return value.replace(/\./g, '').replace(',', '.');
    }
    ScriptsConfig.convertToAmericanFormat = convertToAmericanFormat;
    function tryParseData(dataStr, formato) {
        if (!dataStr || typeof dataStr !== 'string' || !formato) {
            return null;
        }
        dataStr = dataStr.trim();
        const formatosValidos = {
            'dd/MM/yyyy': /^(\d{2})\/(\d{2})\/(\d{4})$/,
            'yyyy-MM-dd': /^(\d{4})-(\d{2})-(\d{2})$/
        };
        const regex = formatosValidos[formato];
        if (!regex) {
            console.warn(`Formato "${formato}" não é suportado.`);
            return null;
        }
        const match = dataStr.match(regex);
        if (!match) {
            return null;
        }
        let ano, mes, dia;
        if (formato === 'dd/MM/yyyy') {
            dia = parseInt(match[1], 10);
            mes = parseInt(match[2], 10) - 1;
            ano = parseInt(match[3], 10);
        }
        else if (formato === 'yyyy-MM-dd') {
            ano = parseInt(match[1], 10);
            mes = parseInt(match[2], 10) - 1;
            dia = parseInt(match[3], 10);
        }
        const data = new Date(ano, mes, dia);
        if (isNaN(data.getTime()) ||
            data.getFullYear() !== ano ||
            data.getMonth() !== mes ||
            data.getDate() !== dia) {
            return null;
        }
        return data;
    }
    ScriptsConfig.tryParseData = tryParseData;
    ScriptsConfig.acessoNegado = false;
    function failFunctionAjax(_XMLHttpRequest_, textStatus, errorThrown) {
        ScriptsConfig.acessoNegado = false;
        if (_XMLHttpRequest_.status === 0 || _XMLHttpRequest_.statusText === 'abort') {
            ScriptsConfig.swalconfirmeAction.fire({
                title: "Acesso Negado",
                html: 'Falha ao requisitar a consulta<br/>Deseja ir para a tela de Login do GSI?',
                icon: "error",
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: 'Sim',
                denyButtonText: 'Não',
                footer: ScriptsConfig.footerAlert
            }).then((result) => {
                if (result.isConfirmed) {
                }
                else if (result.isDenied) {
                }
                else {
                }
            });
        }
        else if (_XMLHttpRequest_.status === 419) {
            console.error('Mixed Content Error: Your request is trying to access an insecure resource (http://) while your page is loaded over HTTPS. Update the target URL to use HTTPS.');
            Swal.fire({
                icon: "error",
                title: "Oops...",
                html: '<b>Mixed Content Error</b><br>Please ensure the target URL uses HTTPS.',
                footer: '<code>' + ScriptsConfig.footerAlert + '</code>'
            });
        }
        else if (_XMLHttpRequest_.responseText.toString().indexOf('<h2>AcessoNegado</h2>') > 0) {
            ScriptsConfig.acessoNegado = true;
            console.error('Unexpected error:', textStatus, errorThrown);
            ScriptsConfig.swalconfirmeAction.fire({
                title: "Acesso Negado",
                html: 'Ação negada pelas políticas de acesso ao sistema<br/>Deseja ir para a tela de Login do GSI?',
                icon: "warning",
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: '<i class="fa-solid fa-thumbs-up"></i> Sim',
                denyButtonText: 'Não <i class="fa-solid fa-sort-down"></i>',
                footer: ScriptsConfig.footerAlert
            }).then((result) => {
                if (result.isConfirmed) {
                }
                else if (result.isDenied) {
                }
                else {
                }
            });
        }
        else {
            console.error('Unexpected error:', textStatus, errorThrown);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                html: errorThrown,
                footer: '<code>' + ScriptsConfig.footerAlert + '</code>'
            });
        }
    }
    ScriptsConfig.failFunctionAjax = failFunctionAjax;
    function failFunctionAjaxConsole(_XMLHttpRequest_, textStatus, errorThrown) {
        ScriptsConfig.acessoNegado = false;
        if (_XMLHttpRequest_.status === 0 || _XMLHttpRequest_.statusText === 'abort') {
            console.error('Ação Negada');
            console.error('Falha ao requisitar a consulta,\n Veja a política de acesso ao GSI');
        }
        else if (_XMLHttpRequest_.status === 419) {
            console.error('Mixed Content Error: Your request is trying to access an insecure resource (http://) while your page is loaded over HTTPS. Update the target URL to use HTTPS.');
        }
        else if (_XMLHttpRequest_.responseText.toString().indexOf('<h2>AcessoNegado</h2>') > 0) {
            ScriptsConfig.acessoNegado = true;
            console.error('Unexpected error:', textStatus, errorThrown);
            console.error('Ação Negada');
            console.error('Ação negada pelas políticas de acesso ao sistema,\n  Veja a política de acesso ao GSI?');
        }
        else {
            console.error('Unexpected error:', textStatus, errorThrown);
        }
    }
    ScriptsConfig.failFunctionAjaxConsole = failFunctionAjaxConsole;
    function parseDotNetDate(dateString) {
        if (typeof dateString !== 'string') {
            return null;
        }
        const regex = /\/Date\((.*?)\)\//;
        const match = dateString.match(regex);
        if (match) {
            const timestamp = parseInt(match[1], 10);
            if (!isNaN(timestamp)) {
                const date = new Date(timestamp);
                const day = String(date.getUTCDate()).padStart(2, '0');
                const month = String(date.getUTCMonth() + 1).padStart(2, '0');
                const year = date.getUTCFullYear();
                return `${day}/${month}/${year}`;
            }
        }
        return null;
    }
    ScriptsConfig.parseDotNetDate = parseDotNetDate;
    function parseDotNetDateAnoMesDia(dateString) {
        if (typeof dateString !== 'string' || !dateString) {
            return '';
        }
        const regex = /\/Date\((.*?)\)\//;
        const match = dateString.match(regex);
        if (match) {
            const timestamp = parseInt(match[1], 10);
            if (!isNaN(timestamp)) {
                const date = new Date(timestamp);
                const day = String(date.getUTCDate()).padStart(2, '0');
                const month = String(date.getUTCMonth() + 1).padStart(2, '0');
                const year = date.getUTCFullYear();
                return `${year}${month}${day}`;
            }
        }
        return '';
    }
    ScriptsConfig.parseDotNetDateAnoMesDia = parseDotNetDateAnoMesDia;
})(ScriptsConfig || (ScriptsConfig = {}));
//# sourceMappingURL=ScriptsConfig.js.map