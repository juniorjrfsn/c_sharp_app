!/**
 * Highstock JS v13.0.0 (2026-06-11)
 * @module highcharts/indicators/rsi
 * @requires highcharts
 * @requires highcharts/modules/stock
 *
 * Indicator series type for Highcharts Stock
 *
 * (c) 2010-2026 Highsoft AS
 * Author: Paweł Fus
 *
 * A commercial license may be required depending on use,
 * see www.highcharts.com/license
 */function(t,r){"object"==typeof exports&&"object"==typeof module?module.exports=r(t._Highcharts,t._Highcharts.SeriesRegistry):"function"==typeof define&&define.amd?define("highcharts/indicators/rsi",["highcharts/highcharts"],function(t){return r(t,t.SeriesRegistry)}):"object"==typeof exports?exports["highcharts/indicators/rsi"]=r(t._Highcharts,t._Highcharts.SeriesRegistry):t.Highcharts=r(t.Highcharts,t.Highcharts.SeriesRegistry)}("u"<typeof window?this:window,function(t,r){return function(){"use strict";var e,n={512:function(t){t.exports=r},944:function(r){r.exports=t}},o={};function i(t){var r=o[t];if(void 0!==r)return r.exports;var e=o[t]={exports:{}};return n[t](e,e.exports,i),e.exports}i.n=function(t){var r=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(r,{a:r}),r},i.d=function(t,r){for(var e in r)i.o(r,e)&&!i.o(t,e)&&Object.defineProperty(t,e,{enumerable:!0,get:r[e]})},i.o=function(t,r){return Object.prototype.hasOwnProperty.call(t,r)};var s={};i.d(s,{default:function(){return y}});var a=i(944),u=i.n(a),c=i(512),f=i.n(c),p=(e=function(t,r){return(e=Object.setPrototypeOf||({__proto__:[]})instanceof Array&&function(t,r){t.__proto__=r}||function(t,r){for(var e in r)r.hasOwnProperty(e)&&(t[e]=r[e])})(t,r)},function(t,r){function n(){this.constructor=t}e(t,r),t.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}),h=f().seriesTypes.sma;function d(t,r){return parseFloat(t.toFixed(r))}var l=function(t){function r(){return null!==t&&t.apply(this,arguments)||this}return p(r,t),r.prototype.getValues=function(t,r){var e,n,o,i,s,u,c=r.period,f=t.xData,p=t.yData,h=p?p.length:0,l=r.decimals,y=[],g=[],x=[],_=0,v=0,m=r.index,b=1;if(!(f.length<c)){for((0,a.isNumber)(p[0])?u=p:(m=Math.min(m,p[0].length-1),u=p.map(function(t){return t[m]}));b<c;)(n=d(u[b]-u[b-1],l))>0?_+=n:v+=Math.abs(n),b++;for(o=d(_/(c-1),l),i=d(v/(c-1),l),s=b;s<h;s++)(n=d(u[s]-u[s-1],l))>0?(_=n,v=0):(_=0,v=Math.abs(n)),o=d((o*(c-1)+_)/c,l),e=0===(i=d((i*(c-1)+v)/c,l))?100:0===o?0:d(100-100/(1+o/i),l),y.push([f[s],e]),g.push(f[s]),x.push(e);return{values:y,xData:g,yData:x}}},r.defaultOptions=(0,a.merge)(h.defaultOptions,{params:{decimals:4,index:3}}),r}(h);f().registerSeriesType("rsi",l);var y=u();return s.default}()});