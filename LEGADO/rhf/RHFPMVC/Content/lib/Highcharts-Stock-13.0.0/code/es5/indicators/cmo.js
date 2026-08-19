!/**
 * Highstock JS v13.0.0 (2026-06-11)
 * @module highcharts/indicators/cmo
 * @requires highcharts
 * @requires highcharts/modules/stock
 *
 * Indicator series type for Highcharts Stock
 *
 * (c) 2010-2026 Highsoft AS
 * Author: Paweł Lysy
 *
 * A commercial license may be required depending on use,
 * see www.highcharts.com/license
 */function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e(t._Highcharts,t._Highcharts.SeriesRegistry):"function"==typeof define&&define.amd?define("highcharts/indicators/cmo",["highcharts/highcharts"],function(t){return e(t,t.SeriesRegistry)}):"object"==typeof exports?exports["highcharts/indicators/cmo"]=e(t._Highcharts,t._Highcharts.SeriesRegistry):t.Highcharts=e(t.Highcharts,t.Highcharts.SeriesRegistry)}("u"<typeof window?this:window,function(t,e){return function(){"use strict";var r,n={512:function(t){t.exports=e},944:function(e){e.exports=t}},o={};function i(t){var e=o[t];if(void 0!==e)return e.exports;var r=o[t]={exports:{}};return n[t](r,r.exports,i),r.exports}i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,{a:e}),e},i.d=function(t,e){for(var r in e)i.o(e,r)&&!i.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:e[r]})},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)};var s={};i.d(s,{default:function(){return y}});var u=i(944),a=i.n(u),c=i(512),p=i.n(c),f=(r=function(t,e){return(r=Object.setPrototypeOf||({__proto__:[]})instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r])})(t,e)},function(t,e){function n(){this.constructor=t}r(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)}),h=p().seriesTypes.sma,d=function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return f(e,t),e.prototype.getValues=function(t,e){var r,n,o=e.period,i=t.xData,s=t.yData,a=s?s.length:0,c=[],p=[],f=[],h=e.index;if(!(i.length<o)){(0,u.isNumber)(s[0])?n=s:(h=Math.min(h,s[0].length-1),n=s.map(function(t){return t[h]}));for(var d,y=0,g=0,l=0,x=o;x>0;x--)n[x]>n[x-1]?g+=n[x]-n[x-1]:n[x]<n[x-1]&&(l+=n[x-1]-n[x]);for(d=g+l>0?100*(g-l)/(g+l):0,p.push(i[o]),f.push(d),c.push([i[o],d]),r=o+1;r<a;r++)y=Math.abs(n[r-o-1]-n[r-o]),n[r]>n[r-1]?g+=n[r]-n[r-1]:n[r]<n[r-1]&&(l+=n[r-1]-n[r]),n[r-o]>n[r-o-1]?g-=y:l-=y,d=g+l>0?100*(g-l)/(g+l):0,p.push(i[r]),f.push(d),c.push([i[r],d]);return{values:c,xData:p,yData:f}}},e.defaultOptions=(0,u.merge)(h.defaultOptions,{params:{period:20,index:3}}),e}(h);p().registerSeriesType("cmo",d);var y=a();return s.default}()});