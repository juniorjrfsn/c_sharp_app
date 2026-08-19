!/**
 * Highstock JS v13.0.0 (2026-06-11)
 * @module highcharts/indicators/williams-r
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
 */function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e(t._Highcharts,t._Highcharts.SeriesRegistry):"function"==typeof define&&define.amd?define("highcharts/indicators/williams-r",["highcharts/highcharts"],function(t){return e(t,t.SeriesRegistry)}):"object"==typeof exports?exports["highcharts/indicators/williams-r"]=e(t._Highcharts,t._Highcharts.SeriesRegistry):t.Highcharts=e(t.Highcharts,t.Highcharts.SeriesRegistry)}("u"<typeof window?this:window,function(t,e){return function(){"use strict";var r,n={512:function(t){t.exports=e},944:function(e){e.exports=t}},o={};function i(t){var e=o[t];if(void 0!==e)return e.exports;var r=o[t]={exports:{}};return n[t](r,r.exports,i),r.exports}i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,{a:e}),e},i.d=function(t,e){for(var r in e)i.o(e,r)&&!i.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:e[r]})},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)};var s={};i.d(s,{default:function(){return y}});var u=i(944),a=i.n(u),c=function(t,e,r){return t.reduce(function(t,n){return[Math.min(t[0],n[e]),Math.max(t[1],n[r])]},[Number.MAX_VALUE,-Number.MAX_VALUE])},f=i(512),p=i.n(f),h=(r=function(t,e){return(r=Object.setPrototypeOf||({__proto__:[]})instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r])})(t,e)},function(t,e){function n(){this.constructor=t}r(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)}),l=p().seriesTypes.sma,d=function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return h(e,t),e.prototype.getValues=function(t,e){var r,n,o,i,s,a=e.period,f=t.xData,p=t.yData,h=p?p.length:0,l=[],d=[],y=[];if(!(f.length<a)&&(0,u.isArray)(p[0])&&4===p[0].length){for(s=a-1;s<h;s++)i=(r=c(p.slice(s-a+1,s+1),2,1))[0],n=-(((o=r[1])-p[s][3])/(o-i)*100),f[s]&&(l.push([f[s],n]),d.push(f[s]),y.push(n));return{values:l,xData:d,yData:y}}},e.defaultOptions=(0,u.merge)(l.defaultOptions,{params:{index:void 0,period:14}}),e}(l);(0,u.extend)(d.prototype,{nameBase:"Williams %R"}),p().registerSeriesType("williamsr",d);var y=a();return s.default}()});