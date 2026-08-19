!/**
 * Highstock JS v13.0.0 (2026-06-11)
 * @module highcharts/indicators/roc
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
 */function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e(t._Highcharts,t._Highcharts.SeriesRegistry):"function"==typeof define&&define.amd?define("highcharts/indicators/roc",["highcharts/highcharts"],function(t){return e(t,t.SeriesRegistry)}):"object"==typeof exports?exports["highcharts/indicators/roc"]=e(t._Highcharts,t._Highcharts.SeriesRegistry):t.Highcharts=e(t.Highcharts,t.Highcharts.SeriesRegistry)}("u"<typeof window?this:window,function(t,e){return function(){"use strict";var r,n={512:function(t){t.exports=e},944:function(e){e.exports=t}},o={};function i(t){var e=o[t];if(void 0!==e)return e.exports;var r=o[t]={exports:{}};return n[t](r,r.exports,i),r.exports}i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,{a:e}),e},i.d=function(t,e){for(var r in e)i.o(e,r)&&!i.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:e[r]})},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)};var s={};i.d(s,{default:function(){return y}});var u=i(944),a=i.n(u),c=i(512),f=i.n(c),p=(r=function(t,e){return(r=Object.setPrototypeOf||({__proto__:[]})instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r])})(t,e)},function(t,e){function n(){this.constructor=t}r(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)}),h=f().seriesTypes.sma,d=function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return p(e,t),e.prototype.getValues=function(t,e){var r,n,o=e.period,i=t.xData,s=t.yData,a=s?s.length:0,c=[],f=[],p=[],h=-1;if(!(i.length<=o)){for((0,u.isArray)(s[0])&&(h=e.index),r=o;r<a;r++)n=function(t,e,r,n,o){var i,s;return s=o<0?(i=e[r-n])?(e[r]-i)/i*100:null:(i=e[r-n][o])?(e[r][o]-i)/i*100:null,[t[r],s]}(i,s,r,o,h),c.push(n),f.push(n[0]),p.push(n[1]);return{values:c,xData:f,yData:p}}},e.defaultOptions=(0,u.merge)(h.defaultOptions,{params:{index:3,period:9}}),e}(h);(0,u.extend)(d.prototype,{nameBase:"Rate of Change"}),f().registerSeriesType("roc",d);var y=a();return s.default}()});