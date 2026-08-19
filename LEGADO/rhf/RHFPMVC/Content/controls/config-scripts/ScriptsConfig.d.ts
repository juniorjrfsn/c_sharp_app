/// <reference path="../config-scripts/sweetalert2.d.ts" />
// interface DataTableOptions {
//     // Configurações básicas
//     paging?: boolean; // Ativa/desativa a paginação
//     ordering?: boolean; // Ativa/desativa a ordenação
//     searching?: boolean; // Ativa/desativa a busca
//     info?: boolean; // Exibe informações sobre a tabela
//     lengthChange?: boolean; // Permite alterar o número de registros por página
//     pageLength?: number; // Define o número de registros por página
//     destroy?: boolean; // Destroi a instância atual antes de criar uma nova
//     fixedHeader?: boolean; // Fixa o cabeçalho da tabela
//     autoFill?: boolean; // Ativa o preenchimento automático

//     // Configurações avançadas
//     data?: any[]; // Dados a serem exibidos na tabela
//     columns?: any[]; // Definição das colunas
//     columnDefs?: ColumnDefinition[]; // Configurações específicas para colunas
//     order?: number[][]; // Ordem inicial das colunas
//     lengthMenu?: any[]; // Opções de seleção para o número de registros por página
//     dom?: string; // Layout dos controles da tabela
//     buttons?: any[]; // Botões personalizados

//     // Internacionalização
//     language?: {
//       url: string; // URL para o arquivo de tradução
//     };
//   }

//   // Interface para definições de colunas (columnDefs)
//   interface ColumnDefinition {
//     targets: number[]; // Índices das colunas alvo
//     orderable?: boolean; // Define se a coluna é ordenável
//     visible?: boolean; // Define se a coluna é visível
//   }

interface ScriptsConfigStatic {
    swalconfirmeActionExcluirCancelar: Promise<any>;

    mixin(): any;
    mixin(arg0: { customClass: { confirmButton: string; denyButton: string; cancelButton: string; }; }, fire: any): unknown;
    mixin(arg0: { customClass: { confirmButton: string; denyButton: string; cancelButton: string; }; }): unknown;
    mixin(arg0: { customClass: { confirmButton: string; cancelButton: string; }; }): unknown;
    fire(): any;
    fire(arg0: { customClass: { confirmButton: string; cancelButton: string; }; }): unknown;
    fire(arg0: { icon: string, title: string, html: string, footer: string }): unknown;


    // Método mixin para configurar opções personalizadas
    mixin(options: {
        customClass?: {
            confirmButton?: string;
            denyButton?: string;
            cancelButton?: string;
            title?: string;
            htmlContainer?: string;
            popup?: string;
            footer?: string;
        };
        buttonsStyling?: boolean;
    }): SwalStatic;

    fire(arg0: {
        customClass: {
            title: string;
            html: string;
            icon: string;
            showDenyButton: boolean;
            showCancelButton: boolean;
            confirmButtonText: string;
            denyButtonText: string;
            footer: string;
        };
    }): unknown;

    // Nova sobrecarga adicionada
    fire(options: {
        title: string;
        html: string;
        icon: 'error' | 'success' | 'warning' | 'info' | 'question';
        showConfirmeButton: boolean;
        showDenyButton: boolean;
        showCancelButton: boolean;
        confirmButtonText: string;
        cancelButtonText: string;
        footer: string;
    }): Promise<any>;


    // Nova sobrecarga adicionada
    fire(options: {
        title: string;
        html: string;
        icon: 'error' | 'success' | 'warning' | 'info' | 'question';
        showCancelButton: boolean;
        confirmButtonText: string;
        cancelButtonText: string;
        reverseButtons: string;
    }): Promise<any>;

    // Nova sobrecarga adicionada
    fire(options: {
        title: string;
        html: string;
        icon: 'error' | 'success' | 'warning' | 'info' | 'question';
        showDenyButton: boolean;
        showCancelButton: boolean;
        confirmButtonText: string;
        denyButtonText: string;
        footer: string;
    }): Promise<any>;
    // Definição do método fire com retorno explícito como Promise
    fire(options: {
        title?: string;
        html?: string;
        icon?: 'error' | 'success' | 'warning' | 'info' | 'question';
        showDenyButton?: boolean;
        showCancelButton?: boolean;
        confirmButtonText?: string;
        denyButtonText?: string;
        cancelButtonText?: string;
        footer?: string;
    }): Promise<{
        isConfirmed: boolean;
        isDenied: boolean;
        isDismissed: boolean;
        value?: any;
    }>;
    // Definição do método fire com retorno explícito como Promise
    fire(options: {
        title?: string;
        html?: string;
        icon?: 'error' | 'success' | 'warning' | 'info' | 'question';
        showDenyButton?: boolean;
        showCancelButton?: boolean;
        confirmButtonText?: string;
        denyButtonText?: string;
        cancelButtonText?: string;
        footer?: string;
    }): Promise<{
        result: any
    }>;
}

interface ScriptsConfig {
    swalconfirmeActionExcluirCancelar(arg0: { customClass: { confirmButton: string; denyButton: string; cancelButton: string; }; }): unknown;
}

declare var scriptsconfig: ScriptsConfigStatic;

interface $ {
    mixin(arg0: { customClass: { prefix?: string; allowNegative?: boolean; thousands?: string; decimal?: string; affixesStay?: boolean }, fire: any; }): unknown;
    mixin(arg0: { customClass: { prefix?: string; allowNegative?: boolean; thousands?: string; decimal?: string; affixesStay?: boolean }; }): unknown;

    maskMoney(arg0: { customClass: { prefix?: string; allowNegative?: boolean; thousands?: string; decimal?: string; affixesStay?: boolean }, fire: any; }): unknown;
    maskMoney(arg0: { customClass: { prefix?: string; allowNegative?: boolean; thousands?: string; decimal?: string; affixesStay?: boolean }; }): unknown;
    maskMoney(arg0: { prefix?: string; allowNegative?: boolean; thousands?: string; decimal?: string; affixesStay?: boolean }): unknown;
    maskMoney(  prefix?: string, allowNegative?: boolean, thousands?: string, decimal?: string, affixesStay?: boolean  ): unknown;
    fire(arg0: { icon: string, title: string, html: string, footer: string }): unknown;


    mixin(options: {
        customClass?: {
            confirmButton?: string;
            denyButton?: string;
            cancelButton?: string;
            title?: string;
            htmlContainer?: string;
            popup?: string;
            footer?: string;
        };
        buttonsStyling?: boolean;
    }): SwalStatic;

}
