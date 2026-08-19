!/**
 * Highstock JS v13.0.0 (2026-06-11)
 * @module highcharts/indicators/dpo
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
 */function(t,r){"object"==typeof exports&&"object"==typeof module?module.exports=r(t._Highcharts,t._Highcharts.SeriesRegistry):"function"==typeof define&&define.amd?define("highcharts/indicators/dpo",["highcharts/highcharts"],function(t){return r(t,t.SeriesRegistry)}):"object"==typeof exports?exports["highcharts/indicators/dpo"]=r(t._Highcharts,t._Highcharts.SeriesRegistry):t.Highcharts=r(t.Highcharts,t.Highcharts.SeriesRegistry)}("u"<typeof window?this:window,function(t,r){return function(){"use strict";var e,o={512:function(t){t.exports=r},944:function(r){r.exports=t}},n={};function i(t){var r=n[t];if(void 0!==r)return r.exports;var e=n[t]={exports:{}};return o[t](e,e.exports,i),e.exports}i.n=function(t){var r=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(r,{a:r}),r},i.d=function(t,r){for(var e in r)i.o(r,e)&&!i.o(t,e)&&Object.defineProperty(t,e,{enumerable:!0,get:r[e]})},i.o=function(t,r){return Object.prototype.hasOwnProperty.call(t,r)};var a={};i.d(a,{default:function(){return l}});var s=i(944),u=i.n(s),c=i(512),p=i.n(c),f=(e=function(t,r){return(e=Object.setPrototypeOf||({__proto__:[]})instanceof Array&&function(t,r){t.__proto__=r}||function(t,r){for(var e in r)r.hasOwnProperty(e)&&(t[e]=r[e])})(t,r)},function(t,r){function o(){this.constructor=t}e(t,r),t.prototype=null===r?Object.create(r):(o.prototype=r.prototype,new o)}),h=p().seriesTypes.sma;function d(t,r,e,o,n){var i=(0,s.pick)(r[e][o],r[e]);return n?(0,s.correctFloat)(t-i):(0,s.correctFloat)(t+i)}var y=function(t){function r(){return null!==t&&t.apply(this,arguments)||this}return f(r,t),r.prototype.getValues=function(t,r){var e,o,n,i,a,u=r.period,c=r.index,p=Math.floor(u/2+1),f=u+p,h=t.xData||[],y=t.yData||[],l=y.length,g=[],x=[],v=[],_=0;if(!(h.length<=f)){for(i=0;i<u-1;i++)_=d(_,y,i,c);for(a=0;a<=l-f;a++)o=a+u-1,n=a+f-1,_=d(_,y,o,c),e=(0,s.pick)(y[n][c],y[n])-_/u,_=d(_,y,a,c,!0),g.push([h[n],e]),x.push(h[n]),v.push(e);return{values:g,xData:x,yData:v}}},r.defaultOptions=(0,s.merge)(h.defaultOptions,{params:{index:0,period:21}}),r}(h);(0,s.extend)(y.prototype,{nameBase:"DPO"}),p().registerSeriesType("dpo",y);var l=u();return a.default}()});