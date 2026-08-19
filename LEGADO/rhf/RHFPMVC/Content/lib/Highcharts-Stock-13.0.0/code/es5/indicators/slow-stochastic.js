!/**
 * Highstock JS v13.0.0 (2026-06-11)
 * @module highcharts/indicators/indicators
 * @requires highcharts
 * @requires highcharts/modules/stock
 *
 * Slow Stochastic series type for Highcharts Stock
 *
 * (c) 2010-2026 Highsoft AS
 * Author: Paweł Fus
 *
 * A commercial license may be required depending on use,
 * see www.highcharts.com/license
 */function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e(t._Highcharts,t._Highcharts.SeriesRegistry):"function"==typeof define&&define.amd?define("highcharts/indicators/slow-stochastic",["highcharts/highcharts"],function(t){return e(t,t.SeriesRegistry)}):"object"==typeof exports?exports["highcharts/indicators/slow-stochastic"]=e(t._Highcharts,t._Highcharts.SeriesRegistry):t.Highcharts=e(t.Highcharts,t.Highcharts.SeriesRegistry)}("u"<typeof window?this:window,function(t,e){return function(){"use strict";var r,o={512:function(t){t.exports=e},944:function(e){e.exports=t}},n={};function a(t){var e=n[t];if(void 0!==e)return e.exports;var r=n[t]={exports:{}};return o[t](r,r.exports,a),r.exports}a.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return a.d(e,{a:e}),e},a.d=function(t,e){for(var r in e)a.o(e,r)&&!a.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:e[r]})},a.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)};var i={};a.d(i,{default:function(){return g}});var s=a(944),c=a.n(s),u=a(512),p=a.n(u),f=(r=function(t,e){return(r=Object.setPrototypeOf||({__proto__:[]})instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r])})(t,e)},function(t,e){function o(){this.constructor=t}r(t,e),t.prototype=null===e?Object.create(e):(o.prototype=e.prototype,new o)}),h=p().seriesTypes,l=h.sma,y=h.stochastic,d=function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return f(e,t),e.prototype.getValues=function(e,r){var o=r.periods,n=t.prototype.getValues.call(this,e,r),a={values:[],xData:[],yData:[]};if(n){a.xData=n.xData.slice(o[1]-1);var i=n.yData.slice(o[1]-1),s=l.prototype.getValues.call(this,{xData:a.xData,yData:i},{index:1,period:o[2]});if(s){for(var c=0,u=a.xData.length;c<u;c++)a.yData[c]=[i[c][1],s.yData[c-o[2]+1]||null],a.values[c]=[a.xData[c],i[c][1],s.yData[c-o[2]+1]||null];return a}}},e.defaultOptions=(0,s.merge)(y.defaultOptions,{params:{periods:[14,3,3]}}),e}(y);(0,s.extend)(d.prototype,{nameBase:"Slow Stochastic"}),p().registerSeriesType("slowstochastic",d);var g=c();return i.default}()});