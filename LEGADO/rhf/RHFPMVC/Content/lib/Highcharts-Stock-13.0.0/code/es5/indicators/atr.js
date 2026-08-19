!/**
 * Highstock JS v13.0.0 (2026-06-11)
 * @module highcharts/indicators/atr
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
 */function(t,r){"object"==typeof exports&&"object"==typeof module?module.exports=r(t._Highcharts,t._Highcharts.SeriesRegistry):"function"==typeof define&&define.amd?define("highcharts/indicators/atr",["highcharts/highcharts"],function(t){return r(t,t.SeriesRegistry)}):"object"==typeof exports?exports["highcharts/indicators/atr"]=r(t._Highcharts,t._Highcharts.SeriesRegistry):t.Highcharts=r(t.Highcharts,t.Highcharts.SeriesRegistry)}("u"<typeof window?this:window,function(t,r){return function(){"use strict";var e,n={512:function(t){t.exports=r},944:function(r){r.exports=t}},o={};function i(t){var r=o[t];if(void 0!==r)return r.exports;var e=o[t]={exports:{}};return n[t](e,e.exports,i),e.exports}i.n=function(t){var r=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(r,{a:r}),r},i.d=function(t,r){for(var e in r)i.o(r,e)&&!i.o(t,e)&&Object.defineProperty(t,e,{enumerable:!0,get:r[e]})},i.o=function(t,r){return Object.prototype.hasOwnProperty.call(t,r)};var s={};i.d(s,{default:function(){return g}});var a=i(944),u=i.n(a),c=i(512),p=i.n(c),f=(e=function(t,r){return(e=Object.setPrototypeOf||({__proto__:[]})instanceof Array&&function(t,r){t.__proto__=r}||function(t,r){for(var e in r)r.hasOwnProperty(e)&&(t[e]=r[e])})(t,r)},function(t,r){function n(){this.constructor=t}e(t,r),t.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}),h=p().seriesTypes.sma;function d(t,r){return Math.max(t[1]-t[2],void 0===r?0:Math.abs(t[1]-r[3]),void 0===r?0:Math.abs(t[2]-r[3]))}var y=function(t){function r(){return null!==t&&t.apply(this,arguments)||this}return f(r,t),r.prototype.getValues=function(t,r){var e,n,o,i,s=r.period,u=t.xData,c=t.yData,p=c?c.length:0,f=[[u[0],c[0]]],h=[],y=[],g=[],l=0,v=1,x=0;if(!(u.length<=s)&&(0,a.isArray)(c[0])&&4===c[0].length){for(i=1;i<=p;i++)(!function(t,r,e,n){var o=r[n],i=e[n];t.push([o,i])}(f,u,c,i),s<v)?(e=i,n=l,l=(o=[u[e-1],(n*(s-1)+d(c[e-1],c[e-2]))/s])[1],h.push(o),y.push(o[0]),g.push(o[1])):(s===v?(l=x/(i-1),h.push([u[i-1],l]),y.push(u[i-1]),g.push(l)):x+=d(c[i-1],c[i-2]),v++);return{values:h,xData:y,yData:g}}},r.defaultOptions=(0,a.merge)(h.defaultOptions,{params:{index:void 0}}),r}(h);p().registerSeriesType("atr",y);var g=u();return s.default}()});