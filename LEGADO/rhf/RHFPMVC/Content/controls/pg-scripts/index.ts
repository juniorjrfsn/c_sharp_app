/// <reference path="../config-scripts/@types/jquery/index.d.ts" />
/// <reference path="../config-scripts/@types/jquery.form/index.d.ts" />
/// <reference path="../config-scripts/sweetalert2.d.ts" />
/// <reference path="../config-scripts/config.ts" />

namespace indx{

	let msgs:string = '';

	export function btnEnviarTexto(posi:any){
		console.log('posi : ' + posi);
	}
}

declare module "indx" {
	export = indx;
}
