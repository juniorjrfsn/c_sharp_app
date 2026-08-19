!/**
 * Highstock JS v13.0.0 (2026-06-11)
 * @module highcharts/indicators/cci
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
 */function(t,r){"object"==typeof exports&&"object"==typeof module?module.exports=r(t._Highcharts,t._Highcharts.SeriesRegistry):"function"==typeof define&&define.amd?define("highcharts/indicators/cci",["highcharts/highcharts"],function(t){return r(t,t.SeriesRegistry)}):"object"==typeof exports?exports["highcharts/indicators/cci"]=r(t._Highcharts,t._Highcharts.SeriesRegistry):t.Highcharts=r(t.Highcharts,t.Highcharts.SeriesRegistry)}("u"<typeof window?this:window,function(t,r){return function(){"use strict";var e,n={512:function(t){t.exports=r},944:function(r){r.exports=t}},o={};function i(t){var r=o[t];if(void 0!==r)return r.exports;var e=o[t]={exports:{}};return n[t](e,e.exports,i),e.exports}i.n=function(t){var r=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(r,{a:r}),r},i.d=function(t,r){for(var e in r)i.o(r,e)&&!i.o(t,e)&&Object.defineProperty(t,e,{enumerable:!0,get:r[e]})},i.o=function(t,r){return Object.prototype.hasOwnProperty.call(t,r)};var s={};i.d(s,{default:function(){return y}});var u=i(944),c=i.n(u),a=i(512),f=i.n(a),p=(e=function(t,r){return(e=Object.setPrototypeOf||({__proto__:[]})instanceof Array&&function(t,r){t.__proto__=r}||function(t,r){for(var e in r)r.hasOwnProperty(e)&&(t[e]=r[e])})(t,r)},function(t,r){function n(){this.constructor=t}e(t,r),t.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n)}),h=f().seriesTypes.sma,d=function(t){function r(){return null!==t&&t.apply(this,arguments)||this}return p(r,t),r.prototype.getValues=function(t,r){var e,n,o,i,s,c,a,f=r.period,p=t.xData,h=t.yData,d=h?h.length:0,y=[],g=[],l=[],v=[],_=[],x=1;if(!(p.length<=f)&&(0,u.isArray)(h[0])&&4===h[0].length){for(;x<f;)n=h[x-1],y.push((n[1]+n[2]+n[3])/3),x++;for(a=f;a<=d;a++)s=((n=h[a-1])[1]+n[2]+n[3])/3,o=y.push(s),i=(_=y.slice(o-f)).reduce(function(t,r){return t+r},0)/f,c=function(t,r){var e,n=t.length,o=0;for(e=0;e<n;e++)o+=Math.abs(r-t[e]);return o}(_,i)/f,e=(s-i)/(.015*c),g.push([p[a-1],e]),l.push(p[a-1]),v.push(e);return{values:g,xData:l,yData:v}}},r.defaultOptions=(0,u.merge)(h.defaultOptions,{params:{index:void 0}}),r}(h);f().registerSeriesType("cci",d);var y=c();return s.default}()});