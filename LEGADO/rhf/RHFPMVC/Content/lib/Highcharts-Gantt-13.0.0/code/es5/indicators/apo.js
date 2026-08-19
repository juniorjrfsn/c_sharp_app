!/**
 * Highstock JS v13.0.0 (2026-06-11)
 * @module highcharts/indicators/apo
 * @requires highcharts
 * @requires highcharts/modules/stock
 *
 * Indicator series type for Highcharts Stock
 *
 * (c) 2010-2026 Highsoft AS
 * Author: Wojciech Chmiel
 *
 * A commercial license may be required depending on use,
 * see www.highcharts.com/license
 */function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e(t._Highcharts,t._Highcharts.SeriesRegistry):"function"==typeof define&&define.amd?define("highcharts/indicators/apo",["highcharts/highcharts"],function(t){return e(t,t.SeriesRegistry)}):"object"==typeof exports?exports["highcharts/indicators/apo"]=e(t._Highcharts,t._Highcharts.SeriesRegistry):t.Highcharts=e(t.Highcharts,t.Highcharts.SeriesRegistry)}("u"<typeof window?this:window,function(t,e){return function(){"use strict";var r,o={512:function(t){t.exports=e},944:function(e){e.exports=t}},n={};function i(t){var e=n[t];if(void 0!==e)return e.exports;var r=n[t]={exports:{}};return o[t](r,r.exports,i),r.exports}i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,{a:e}),e},i.d=function(t,e){for(var r in e)i.o(e,r)&&!i.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:e[r]})},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)};var a={};i.d(a,{default:function(){return y}});var s=i(944),u=i.n(s),p=i(512),c=i.n(p),f=(r=function(t,e){return(r=Object.setPrototypeOf||({__proto__:[]})instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r])})(t,e)},function(t,e){function o(){this.constructor=t}r(t,e),t.prototype=null===e?Object.create(e):(o.prototype=e.prototype,new o)}),h=c().seriesTypes.ema,d=function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return f(e,t),e.prototype.getValues=function(e,r){var o,n,i=r.periods,a=r.index,u=[],p=[],c=[];if(2!==i.length||i[1]<=i[0])return void(0,s.error)('Error: "APO requires two periods. Notice, first period should be lower than the second one."');var f=t.prototype.getValues.call(this,e,{index:a,period:i[0]}),h=t.prototype.getValues.call(this,e,{index:a,period:i[1]});if(f&&h){var d=i[1]-i[0];for(n=0;n<h.yData.length;n++)o=f.yData[n+d]-h.yData[n],u.push([h.xData[n],o]),p.push(h.xData[n]),c.push(o);return{values:u,xData:p,yData:c}}},e.defaultOptions=(0,s.merge)(h.defaultOptions,{params:{period:void 0,periods:[10,20]}}),e}(h);(0,s.extend)(d.prototype,{nameBase:"APO",nameComponents:["periods"]}),c().registerSeriesType("apo",d);var y=u();return a.default}()});