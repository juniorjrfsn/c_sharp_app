!/**
 * Highstock JS v13.0.0 (2026-06-11)
 * @module highcharts/indicators/wma
 * @requires highcharts
 * @requires highcharts/modules/stock
 *
 * Indicator series type for Highcharts Stock
 *
 * (c) 2010-2026 Highsoft AS
 * Author: Kacper Madej
 *
 * A commercial license may be required depending on use,
 * see www.highcharts.com/license
 */function(t,r){"object"==typeof exports&&"object"==typeof module?module.exports=r(t._Highcharts,t._Highcharts.SeriesRegistry):"function"==typeof define&&define.amd?define("highcharts/indicators/wma",["highcharts/highcharts"],function(t){return r(t,t.SeriesRegistry)}):"object"==typeof exports?exports["highcharts/indicators/wma"]=r(t._Highcharts,t._Highcharts.SeriesRegistry):t.Highcharts=r(t.Highcharts,t.Highcharts.SeriesRegistry)}("u"<typeof window?this:window,function(t,r){return function(){"use strict";var e,n={512:function(t){t.exports=r},944:function(r){r.exports=t}},o={};function i(t){var r=o[t];if(void 0!==r)return r.exports;var e=o[t]={exports:{}};return n[t](e,e.exports,i),e.exports}i.n=function(t){var r=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(r,{a:r}),r},i.d=function(t,r){for(var e in r)i.o(r,e)&&!i.o(t,e)&&Object.defineProperty(t,e,{enumerable:!0,get:r[e]})},i.o=function(t,r){return Object.prototype.hasOwnProperty.call(t,r)};var u={};i.d(u,{default:function(){return g}});var s=i(944),a=i.n(s),c=i(512),f=i.n(c),p=(e=function(t,r){return(e=Object.setPrototypeOf||({__proto__:[]})instanceof Array&&function(t,r){t.__proto__=r}||function(t,r){for(var e in r)r.hasOwnProperty(e)&&(t[e]=r[e])})(t,r)},function(t,r){function n(){this.constructor=t}e(t,r),t.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}),h=f().seriesTypes.sma;function d(t,r,e,n,o){var i=r[n],u=o<0?e[n]:e[n][o];t.push([i,u])}function y(t,r,e,n){var o=t.length,i=t.reduce(function(t,r,e){return[null,t[1]+r[1]*(e+1)]})[1]/((o+1)/2*o),u=r[n-1];return t.shift(),[u,i]}var l=function(t){function r(){return null!==t&&t.apply(this,arguments)||this}return p(r,t),r.prototype.getValues=function(t,r){var e,n,o=r.period,i=t.xData,u=t.yData,a=u?u.length:0,c=i[0],f=[],p=[],h=[],l=1,g=-1,v=u[0];if(!(i.length<o)){(0,s.isArray)(u[0])&&(g=r.index,v=u[0][g]);for(var x=[[c,v]];l!==o;)d(x,i,u,l,g),l++;for(e=l;e<a;e++)n=y(x,i,u,e),f.push(n),p.push(n[0]),h.push(n[1]),d(x,i,u,e,g);return n=y(x,i,u,e),f.push(n),p.push(n[0]),h.push(n[1]),{values:f,xData:p,yData:h}}},r.defaultOptions=(0,s.merge)(h.defaultOptions,{params:{index:3,period:9}}),r}(h);f().registerSeriesType("wma",l);var g=a();return u.default}()});