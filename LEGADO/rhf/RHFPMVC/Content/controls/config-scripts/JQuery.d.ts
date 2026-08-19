// tslint:disable:jsdoc-format
// tslint:disable:max-line-length
// tslint:disable:no-irregular-whitespace

// Interface para as opções do Inputmask
// Interface para as opções do Inputmask
// Interface para as opções do Inputmask

 
export interface InputmaskDefinition {
  mask?: string | string[] | (() => string[]);
  placeholder?: string;
  clearIncomplete?: boolean;
  numericInput?: boolean;
  definitions?: Record<string, {
      validator: string | RegExp;
      cardinality?: number;
  }>;
  onBeforePaste?: (pastedValue: string, opts: any) => string;
  oncomplete?: () => void;
  [key: string]: any;
}
// Definições personalizadas para Inputmask
export interface InputmaskDefinition {
  mask?: string | string[] | (() => string[]);
  placeholder?: string;
  clearIncomplete?: boolean;
  definitions?: {
      [key: string]: {
          validator: string | RegExp;
          cardinality?: number;
      };
  };
  oncomplete?: () => void;
  // Removed duplicate index signature to resolve the error
}

interface InputmaskOptions {
  mask?: string | string[] | (() => string[]);
  placeholder?: string;
  numericInput?: boolean;
  definitions?: {
      [key: string]: {
          validator: string | RegExp;
          cardinality?: number;
      };
  };
  greedy?: boolean;
  showMaskOnHover?: boolean;
  showMaskOnFocus?: boolean;
  removeMaskOnSubmit?: boolean;
  clearIncomplete?: boolean;
  autoUnmask?: boolean;
  onBeforePaste?: (pastedValue: string, opts: any) => string;
  onBeforeMask?: (value: string, opts: any) => string;
  onBeforeWrite?: (buffer: string[], opts: any) => void;
  [key: string]: any;
}

interface Inputmask {
  (mask: string, options?: InputmaskOptions): JQuery;
  (options: InputmaskOptions): JQuery;
}

