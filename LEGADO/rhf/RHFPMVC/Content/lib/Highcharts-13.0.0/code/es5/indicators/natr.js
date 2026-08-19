!/**
 * Highstock JS v13.0.0 (2026-06-11)
 * @module highcharts/indicators/natr
 * @requires highcharts
 * @requires highcharts/modules/stock
 *
 * Indicator series type for Highcharts Stock
 *
 * (c) 2010-2026 Highsoft AS
 * Author: Paweł Dalek
 *
 * A commercial license may be required depending on use,
 * see www.highcharts.com/license
 */function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e(t._Highcharts,t._Highcharts.SeriesRegistry):"function"==typeof define&&define.amd?define("highcharts/indicators/natr",["highcharts/highcharts"],function(t){return e(t,t.SeriesRegistry)}):"object"==typeof exports?exports["highcharts/indicators/natr"]=e(t._Highcharts,t._Highcharts.SeriesRegistry):t.Highcharts=e(t.Highcharts,t.Highcharts.SeriesRegistry)}("u"<typeof window?this:window,function(t,e){return function(){"use strict";var r,n={512:function(t){t.exports=e},944:function(e){e.exports=t}},o={};function i(t){var e=o[t];if(void 0!==e)return e.exports;var r=o[t]={exports:{}};return n[t](r,r.exports,i),r.exports}i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,{a:e}),e},i.d=function(t,e){for(var r in e)i.o(e,r)&&!i.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:e[r]})},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)};var u={};i.d(u,{default:function(){return l}});var s=i(944),a=i.n(s),c=i(512),f=i.n(c),p=(r=function(t,e){return(r=Object.setPrototypeOf||({__proto__:[]})instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r])})(t,e)},function(t,e){function n(){this.constructor=t}r(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)}),h=f().seriesTypes.atr,y=function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return p(e,t),e.prototype.getValues=function(e,r){var n=t.prototype.getValues.apply(this,arguments),o=n.values.length,i=e.yData,u=0,s=r.period-1;if(n){for(;u<o;u++)n.yData[u]=n.values[u][1]/i[s][3]*100,n.values[u][1]=n.yData[u],s++;return n}},e.defaultOptions=(0,s.merge)(h.defaultOptions,{tooltip:{valueSuffix:"%"}}),e}(h);f().registerSeriesType("natr",y);var l=a();return u.default}()});