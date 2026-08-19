!/**
 * Highstock JS v13.0.0 (2026-06-11)
 * @module highcharts/indicators/momentum
 * @requires highcharts
 * @requires highcharts/modules/stock
 *
 * Indicator series type for Highcharts Stock
 *
 * (c) 2010-2026 Highsoft AS
 * Author: Sebastian Bochan
 *
 * A commercial license may be required depending on use,
 * see www.highcharts.com/license
 */function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e(t._Highcharts,t._Highcharts.SeriesRegistry):"function"==typeof define&&define.amd?define("highcharts/indicators/momentum",["highcharts/highcharts"],function(t){return e(t,t.SeriesRegistry)}):"object"==typeof exports?exports["highcharts/indicators/momentum"]=e(t._Highcharts,t._Highcharts.SeriesRegistry):t.Highcharts=e(t.Highcharts,t.Highcharts.SeriesRegistry)}("u"<typeof window?this:window,function(t,e){return function(){"use strict";var r,n={512:function(t){t.exports=e},944:function(e){e.exports=t}},o={};function i(t){var e=o[t];if(void 0!==e)return e.exports;var r=o[t]={exports:{}};return n[t](r,r.exports,i),r.exports}i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,{a:e}),e},i.d=function(t,e){for(var r in e)i.o(e,r)&&!i.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:e[r]})},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)};var u={};i.d(u,{default:function(){return g}});var s=i(944),a=i.n(s),c=i(512),p=i.n(c),f=(r=function(t,e){return(r=Object.setPrototypeOf||({__proto__:[]})instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r])})(t,e)},function(t,e){function n(){this.constructor=t}r(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)}),h=p().seriesTypes.sma;function y(t,e,r,n,o){var i=e[r-1][o]-e[r-n-1][o];return[t[r-1],i]}var d=function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return f(e,t),e.prototype.getValues=function(t,e){var r,n,o=e.period,i=e.index,u=t.xData,a=t.yData,c=a?a.length:0,p=[],f=[],h=[];if(!(u.length<=o)&&(0,s.isArray)(a[0])){for(r=o+1;r<c;r++)n=y(u,a,r,o,i),p.push(n),f.push(n[0]),h.push(n[1]);return n=y(u,a,r,o,i),p.push(n),f.push(n[0]),h.push(n[1]),{values:p,xData:f,yData:h}}},e.defaultOptions=(0,s.merge)(h.defaultOptions,{params:{index:3}}),e}(h);(0,s.extend)(d.prototype,{nameBase:"Momentum"}),p().registerSeriesType("momentum",d);var g=a();return u.default}()});