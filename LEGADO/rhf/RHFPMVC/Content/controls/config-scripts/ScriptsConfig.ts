// File: config-scripts/ScriptsConfig.ts
/// <reference path="../config-scripts/@types/jquery/index.d.ts" />
/// <reference path="../config-scripts/@types/jquery.form/index.d.ts" />
/// <reference path="../config-scripts/sweetalert2.d.ts" />
/// <reference path="../config-scripts/ScriptsConfig.d.ts" />
/// <reference path="../config-scripts/config.ts" />

namespace ScriptsConfig {

    export const footerAlert = '<span  style="color:#033E66;font-size:18px"> &nbsp; AGEPREV-MS / DIRGIN</span>';
    export let contador = 1;
    export let formOriginal = $('#formItensMovimento').serialize();

    export const statusCodeHandlers = Object.fromEntries(
        [200, 403, 404, 415, 405, 500, 502].map(code => [
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
                if(messages[code]) { if (code !== 200){ console.log(messages[code]); } } else { console.error(`Unknown Status Code: ${code}`, textStatus, jqXHR, data); }
            }
        ])
    );

    export function consoleError(_XMLHttpRequest_: any, textStatus: any, errorThrown: any) {
        console.log("error");
        console.log(_XMLHttpRequest_); console.log(textStatus); console.log(errorThrown);
    }


    export interface CancelarRegistro {
        (accesskey: string): void;
    }

    export let listaDeIndiceCorrecaoMonetaria = null;
    export let listaDeIndiceCorrecaoMonetariaOptions = null;

    export const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-success",
            cancelButton: "btn btn-danger"
        }
    });
    export const swalconfirmeDel = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-primary",
            cancelButton: "btn btn-secondary"
        }
        //, buttonsStyling: false
    });

    export const swalconfirmeActionExcluirCancelarSair = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-danger",
            denyButton: "btn btn-warning",
            cancelButton: "btn btn-secondary"
        }
    });

    export const swalconfirmeActionExcluirCancelar = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-danger",
            cancelButton: "btn btn-info"
        }
    });
    export const swalconfirmeActionFinalizar = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-success",
            denyButton: "btn btn-info",
            cancelButton: "btn btn-warning"
        }
    });
    export const swalconfirmeAction = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-info",
            denyButton: "btn btn-danger",
            cancelButton: "btn btn-secondary"
        }
    });
    export const swalconfirmeActionAlerta = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-info",
            denyButton: "btn btn-warning",
            cancelButton: "btn btn-secondary"
        }
    });

    export const swalconfirmeActionAlertaWarning = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-warning",
            denyButton: "btn btn-info",
            cancelButton: "btn btn-danger"
        }
    });

    export const swalconfirmeActionWarning = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-info",
            denyButton: "btn btn-warning",
            cancelButton: "btn btn-secondary"
        }
    });

    // Função auxiliar para converter valores numéricos para o formato americano
    export function convertToAmericanFormat(value) {
        if (!value) return '0.00'; // Retorna "0.00" se o valor for vazio
        return value.replace(/\./g, '').replace(',', '.'); // Remove pontos e substitui v�rgula por ponto
    }

    export function tryParseData(dataStr, formato) {
        if (!dataStr || typeof dataStr !== 'string' || !formato) {
            return null;
        }

        // Limpa a string
        dataStr = dataStr.trim();

        // Mapeia os formatos mais comuns
        const formatosValidos = {
            'dd/MM/yyyy': /^(\d{2})\/(\d{2})\/(\d{4})$/,
            'yyyy-MM-dd': /^(\d{4})-(\d{2})-(\d{2})$/
            // Adicione outros formatos conforme necessário
        };

        const regex = formatosValidos[formato];
        if (!regex) {
            console.warn(`Formato "${formato}" não é suportado.`);
            return null;
        }

        const match = dataStr.match(regex);
        if (!match) {
            return null; // Não corresponde ao formato esperado
        }

        let ano, mes, dia;

        if (formato === 'dd/MM/yyyy') {
            dia = parseInt(match[1], 10);
            mes = parseInt(match[2], 10) - 1; // meses em JS são 0-based
            ano = parseInt(match[3], 10);
        } else if (formato === 'yyyy-MM-dd') {
            ano = parseInt(match[1], 10);
            mes = parseInt(match[2], 10) - 1;
            dia = parseInt(match[3], 10);
        }

        // Cria a data e valida
        const data = new Date(ano, mes, dia);

        // Verifica se a data é válida e corresponde aos valores originais (para evitar coisas como 31 de fevereiro)
        if (
            isNaN(data.getTime()) ||
            data.getFullYear() !== ano ||
            data.getMonth() !== mes ||
            data.getDate() !== dia
        ) {
            return null;
        }

        return data;
    }

    export let acessoNegado: boolean = false; 


    export function failFunctionAjax(_XMLHttpRequest_: any, textStatus: any, errorThrown: any): void {
        ScriptsConfig.acessoNegado = false;
        // console.log(_XMLHttpRequest_.responseText);
        if (_XMLHttpRequest_.status === 0 || _XMLHttpRequest_.statusText === 'abort') {
            // console.log('Request aborted by the user.');
            // Swal.fire({ icon: "error", title: "Oops...", html: _XMLHttpRequest_, footer: '<code>' + textStatus + '</code>' });
            swalconfirmeAction.fire({
                title: "Acesso Negado",
                html: 'Falha ao requisitar a consulta<br/>Deseja ir para a tela de Login do GSI?',
                icon: "error",
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: 'Sim',
                denyButtonText: 'Não',
                footer: footerAlert
            }).then((result) => {
                if (result.isConfirmed) {
                    // window.location.href = 'https://www.gsi.ms.gov.br/';
                } else if (result.isDenied) {

                } else {
                    // window.location.href = 'https://www.gsi.ms.gov.br/';
                }
            });
        } else if (_XMLHttpRequest_.status === 419) { // Check for mixed content error
            console.error('Mixed Content Error: Your request is trying to access an insecure resource (http://) while your page is loaded over HTTPS. Update the target URL to use HTTPS.');
            Swal.fire({
                icon: "error",
                title: "Oops...",
                html: '<b>Mixed Content Error</b><br>Please ensure the target URL uses HTTPS.',
                footer: '<code>' + footerAlert + '</code>'
            });
        } else if (_XMLHttpRequest_.responseText.toString().indexOf('<h2>AcessoNegado</h2>') > 0) {
            ScriptsConfig.acessoNegado = true;
            console.error('Unexpected error:', textStatus, errorThrown);
            swalconfirmeAction.fire({
                title: "Acesso Negado",
                html: 'Ação negada pelas políticas de acesso ao sistema<br/>Deseja ir para a tela de Login do GSI?',
                icon: "warning",
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: '<i class="fa-solid fa-thumbs-up"></i> Sim',
                denyButtonText: 'Não <i class="fa-solid fa-sort-down"></i>',
                footer: footerAlert
            }).then((result) => {
                if (result.isConfirmed) {
                    // window.location.href = 'https://www.gsi.ms.gov.br/';
                } else if (result.isDenied) {

                } else {
                    // window.location.href = 'https://www.gsi.ms.gov.br/';
                }
            });
        } else {
            console.error('Unexpected error:', textStatus, errorThrown);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                html: errorThrown,
                footer: '<code>' + footerAlert + '</code>'
            });
        }
    }


    export function failFunctionAjaxConsole(_XMLHttpRequest_: any, textStatus: any, errorThrown: any): void {
        ScriptsConfig.acessoNegado = false; 
        if (_XMLHttpRequest_.status === 0 || _XMLHttpRequest_.statusText === 'abort') {
            console.error('Ação Negada');
            console.error('Falha ao requisitar a consulta,\n Veja a política de acesso ao GSI');
        } else if (_XMLHttpRequest_.status === 419) { // Check for mixed content error
            console.error('Mixed Content Error: Your request is trying to access an insecure resource (http://) while your page is loaded over HTTPS. Update the target URL to use HTTPS.');

        } else if (_XMLHttpRequest_.responseText.toString().indexOf('<h2>AcessoNegado</h2>') > 0) {
            ScriptsConfig.acessoNegado = true;
            console.error('Unexpected error:', textStatus, errorThrown);
            console.error('Ação Negada');
            console.error('Ação negada pelas políticas de acesso ao sistema,\n  Veja a política de acesso ao GSI?');
        } else {
            console.error('Unexpected error:', textStatus, errorThrown);
        }
    }
     

    export function parseDotNetDate(dateString) {
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
                const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Mês começa em 0
                const year = date.getUTCFullYear();

                return `${day}/${month}/${year}`;
            }
        }
        return null;
    }


    export function parseDotNetDateAnoMesDia(dateString: string | null): string {
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
                const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Mês começa em 0
                const year = date.getUTCFullYear();
                return `${year}${month}${day}`;
            }
        }
        return '';
    }
}

// Exporta o namespace como um módulo
declare module "ScriptsConfig" {
    export = ScriptsConfig; 
}
