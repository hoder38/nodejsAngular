/*
 AngularJS v1.2.9
 (c) 2010-2014 Google, Inc. http://angularjs.org
 License: MIT
*/
(function(Z,Q,r){'use strict';function F(b){return function(){var a=arguments[0],c,a="["+(b?b+":":"")+a+"] http://errors.angularjs.org/1.2.9/"+(b?b+"/":"")+a;for(c=1;c<arguments.length;c++)a=a+(1==c?"?":"&")+"p"+(c-1)+"="+encodeURIComponent("function"==typeof arguments[c]?arguments[c].toString().replace(/ \{[\s\S]*$/,""):"undefined"==typeof arguments[c]?"undefined":"string"!=typeof arguments[c]?JSON.stringify(arguments[c]):arguments[c]);return Error(a)}}function rb(b){if(null==b||Aa(b))return!1;var a=
b.length;return 1===b.nodeType&&a?!0:D(b)||K(b)||0===a||"number"===typeof a&&0<a&&a-1 in b}function q(b,a,c){var d;if(b)if(L(b))for(d in b)"prototype"==d||("length"==d||"name"==d||b.hasOwnProperty&&!b.hasOwnProperty(d))||a.call(c,b[d],d);else if(b.forEach&&b.forEach!==q)b.forEach(a,c);else if(rb(b))for(d=0;d<b.length;d++)a.call(c,b[d],d);else for(d in b)b.hasOwnProperty(d)&&a.call(c,b[d],d);return b}function Pb(b){var a=[],c;for(c in b)b.hasOwnProperty(c)&&a.push(c);return a.sort()}function Pc(b,
a,c){for(var d=Pb(b),e=0;e<d.length;e++)a.call(c,b[d[e]],d[e]);return d}function Qb(b){return function(a,c){b(c,a)}}function Za(){for(var b=ka.length,a;b;){b--;a=ka[b].charCodeAt(0);if(57==a)return ka[b]="A",ka.join("");if(90==a)ka[b]="0";else return ka[b]=String.fromCharCode(a+1),ka.join("")}ka.unshift("0");return ka.join("")}function Rb(b,a){a?b.$$hashKey=a:delete b.$$hashKey}function t(b){var a=b.$$hashKey;q(arguments,function(a){a!==b&&q(a,function(a,c){b[c]=a})});Rb(b,a);return b}function S(b){return parseInt(b,
10)}function Sb(b,a){return t(new (t(function(){},{prototype:b})),a)}function w(){}function Ba(b){return b}function $(b){return function(){return b}}function z(b){return"undefined"===typeof b}function B(b){return"undefined"!==typeof b}function X(b){return null!=b&&"object"===typeof b}function D(b){return"string"===typeof b}function sb(b){return"number"===typeof b}function La(b){return"[object Date]"===$a.call(b)}function K(b){return"[object Array]"===$a.call(b)}function L(b){return"function"===typeof b}
function ab(b){return"[object RegExp]"===$a.call(b)}function Aa(b){return b&&b.document&&b.location&&b.alert&&b.setInterval}function Qc(b){return!(!b||!(b.nodeName||b.on&&b.find))}function Rc(b,a,c){var d=[];q(b,function(b,g,f){d.push(a.call(c,b,g,f))});return d}function bb(b,a){if(b.indexOf)return b.indexOf(a);for(var c=0;c<b.length;c++)if(a===b[c])return c;return-1}function Ma(b,a){var c=bb(b,a);0<=c&&b.splice(c,1);return a}function aa(b,a){if(Aa(b)||b&&b.$evalAsync&&b.$watch)throw Na("cpws");if(a){if(b===
a)throw Na("cpi");if(K(b))for(var c=a.length=0;c<b.length;c++)a.push(aa(b[c]));else{c=a.$$hashKey;q(a,function(b,c){delete a[c]});for(var d in b)a[d]=aa(b[d]);Rb(a,c)}}else(a=b)&&(K(b)?a=aa(b,[]):La(b)?a=new Date(b.getTime()):ab(b)?a=RegExp(b.source):X(b)&&(a=aa(b,{})));return a}function Tb(b,a){a=a||{};for(var c in b)b.hasOwnProperty(c)&&("$"!==c.charAt(0)&&"$"!==c.charAt(1))&&(a[c]=b[c]);return a}function ua(b,a){if(b===a)return!0;if(null===b||null===a)return!1;if(b!==b&&a!==a)return!0;var c=typeof b,
d;if(c==typeof a&&"object"==c)if(K(b)){if(!K(a))return!1;if((c=b.length)==a.length){for(d=0;d<c;d++)if(!ua(b[d],a[d]))return!1;return!0}}else{if(La(b))return La(a)&&b.getTime()==a.getTime();if(ab(b)&&ab(a))return b.toString()==a.toString();if(b&&b.$evalAsync&&b.$watch||a&&a.$evalAsync&&a.$watch||Aa(b)||Aa(a)||K(a))return!1;c={};for(d in b)if("$"!==d.charAt(0)&&!L(b[d])){if(!ua(b[d],a[d]))return!1;c[d]=!0}for(d in a)if(!c.hasOwnProperty(d)&&"$"!==d.charAt(0)&&a[d]!==r&&!L(a[d]))return!1;return!0}return!1}
function Ub(){return Q.securityPolicy&&Q.securityPolicy.isActive||Q.querySelector&&!(!Q.querySelector("[ng-csp]")&&!Q.querySelector("[data-ng-csp]"))}function cb(b,a){var c=2<arguments.length?va.call(arguments,2):[];return!L(a)||a instanceof RegExp?a:c.length?function(){return arguments.length?a.apply(b,c.concat(va.call(arguments,0))):a.apply(b,c)}:function(){return arguments.length?a.apply(b,arguments):a.call(b)}}function Sc(b,a){var c=a;"string"===typeof b&&"$"===b.charAt(0)?c=r:Aa(a)?c="$WINDOW":
a&&Q===a?c="$DOCUMENT":a&&(a.$evalAsync&&a.$watch)&&(c="$SCOPE");return c}function qa(b,a){return"undefined"===typeof b?r:JSON.stringify(b,Sc,a?"  ":null)}function Vb(b){return D(b)?JSON.parse(b):b}function Oa(b){"function"===typeof b?b=!0:b&&0!==b.length?(b=x(""+b),b=!("f"==b||"0"==b||"false"==b||"no"==b||"n"==b||"[]"==b)):b=!1;return b}function ga(b){b=A(b).clone();try{b.empty()}catch(a){}var c=A("<div>").append(b).html();try{return 3===b[0].nodeType?x(c):c.match(/^(<[^>]+>)/)[1].replace(/^<([\w\-]+)/,
function(a,b){return"<"+x(b)})}catch(d){return x(c)}}function Wb(b){try{return decodeURIComponent(b)}catch(a){}}function Xb(b){var a={},c,d;q((b||"").split("&"),function(b){b&&(c=b.split("="),d=Wb(c[0]),B(d)&&(b=B(c[1])?Wb(c[1]):!0,a[d]?K(a[d])?a[d].push(b):a[d]=[a[d],b]:a[d]=b))});return a}function Yb(b){var a=[];q(b,function(b,d){K(b)?q(b,function(b){a.push(wa(d,!0)+(!0===b?"":"="+wa(b,!0)))}):a.push(wa(d,!0)+(!0===b?"":"="+wa(b,!0)))});return a.length?a.join("&"):""}function tb(b){return wa(b,
!0).replace(/%26/gi,"&").replace(/%3D/gi,"=").replace(/%2B/gi,"+")}function wa(b,a){return encodeURIComponent(b).replace(/%40/gi,"@").replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,a?"%20":"+")}function Tc(b,a){function c(a){a&&d.push(a)}var d=[b],e,g,f=["ng:app","ng-app","x-ng-app","data-ng-app"],h=/\sng[:\-]app(:\s*([\w\d_]+);?)?\s/;q(f,function(a){f[a]=!0;c(Q.getElementById(a));a=a.replace(":","\\:");b.querySelectorAll&&(q(b.querySelectorAll("."+a),c),q(b.querySelectorAll("."+
a+"\\:"),c),q(b.querySelectorAll("["+a+"]"),c))});q(d,function(a){if(!e){var b=h.exec(" "+a.className+" ");b?(e=a,g=(b[2]||"").replace(/\s+/g,",")):q(a.attributes,function(b){!e&&f[b.name]&&(e=a,g=b.value)})}});e&&a(e,g?[g]:[])}function Zb(b,a){var c=function(){b=A(b);if(b.injector()){var c=b[0]===Q?"document":ga(b);throw Na("btstrpd",c);}a=a||[];a.unshift(["$provide",function(a){a.value("$rootElement",b)}]);a.unshift("ng");c=$b(a);c.invoke(["$rootScope","$rootElement","$compile","$injector","$animate",
function(a,b,c,d,e){a.$apply(function(){b.data("$injector",d);c(b)(a)})}]);return c},d=/^NG_DEFER_BOOTSTRAP!/;if(Z&&!d.test(Z.name))return c();Z.name=Z.name.replace(d,"");Ca.resumeBootstrap=function(b){q(b,function(b){a.push(b)});c()}}function db(b,a){a=a||"_";return b.replace(Uc,function(b,d){return(d?a:"")+b.toLowerCase()})}function ub(b,a,c){if(!b)throw Na("areq",a||"?",c||"required");return b}function Pa(b,a,c){c&&K(b)&&(b=b[b.length-1]);ub(L(b),a,"not a function, got "+(b&&"object"==typeof b?
b.constructor.name||"Object":typeof b));return b}function xa(b,a){if("hasOwnProperty"===b)throw Na("badname",a);}function vb(b,a,c){if(!a)return b;a=a.split(".");for(var d,e=b,g=a.length,f=0;f<g;f++)d=a[f],b&&(b=(e=b)[d]);return!c&&L(b)?cb(e,b):b}function wb(b){var a=b[0];b=b[b.length-1];if(a===b)return A(a);var c=[a];do{a=a.nextSibling;if(!a)break;c.push(a)}while(a!==b);return A(c)}function Vc(b){var a=F("$injector"),c=F("ng");b=b.angular||(b.angular={});b.$$minErr=b.$$minErr||F;return b.module||
(b.module=function(){var b={};return function(e,g,f){if("hasOwnProperty"===e)throw c("badname","module");g&&b.hasOwnProperty(e)&&(b[e]=null);return b[e]||(b[e]=function(){function b(a,d,e){return function(){c[e||"push"]([a,d,arguments]);return n}}if(!g)throw a("nomod",e);var c=[],d=[],l=b("$injector","invoke"),n={_invokeQueue:c,_runBlocks:d,requires:g,name:e,provider:b("$provide","provider"),factory:b("$provide","factory"),service:b("$provide","service"),value:b("$provide","value"),constant:b("$provide",
"constant","unshift"),animation:b("$animateProvider","register"),filter:b("$filterProvider","register"),controller:b("$controllerProvider","register"),directive:b("$compileProvider","directive"),config:l,run:function(a){d.push(a);return this}};f&&l(f);return n}())}}())}function Qa(b){return b.replace(Wc,function(a,b,d,e){return e?d.toUpperCase():d}).replace(Xc,"Moz$1")}function xb(b,a,c,d){function e(b){var e=c&&b?[this.filter(b)]:[this],m=a,k,l,n,p,s,C;if(!d||null!=b)for(;e.length;)for(k=e.shift(),
l=0,n=k.length;l<n;l++)for(p=A(k[l]),m?p.triggerHandler("$destroy"):m=!m,s=0,p=(C=p.children()).length;s<p;s++)e.push(Da(C[s]));return g.apply(this,arguments)}var g=Da.fn[b],g=g.$original||g;e.$original=g;Da.fn[b]=e}function O(b){if(b instanceof O)return b;if(!(this instanceof O)){if(D(b)&&"<"!=b.charAt(0))throw yb("nosel");return new O(b)}if(D(b)){var a=Q.createElement("div");a.innerHTML="<div>&#160;</div>"+b;a.removeChild(a.firstChild);zb(this,a.childNodes);A(Q.createDocumentFragment()).append(this)}else zb(this,
b)}function Ab(b){return b.cloneNode(!0)}function Ea(b){ac(b);var a=0;for(b=b.childNodes||[];a<b.length;a++)Ea(b[a])}function bc(b,a,c,d){if(B(d))throw yb("offargs");var e=la(b,"events");la(b,"handle")&&(z(a)?q(e,function(a,c){Bb(b,c,a);delete e[c]}):q(a.split(" "),function(a){z(c)?(Bb(b,a,e[a]),delete e[a]):Ma(e[a]||[],c)}))}function ac(b,a){var c=b[eb],d=Ra[c];d&&(a?delete Ra[c].data[a]:(d.handle&&(d.events.$destroy&&d.handle({},"$destroy"),bc(b)),delete Ra[c],b[eb]=r))}function la(b,a,c){var d=
b[eb],d=Ra[d||-1];if(B(c))d||(b[eb]=d=++Yc,d=Ra[d]={}),d[a]=c;else return d&&d[a]}function cc(b,a,c){var d=la(b,"data"),e=B(c),g=!e&&B(a),f=g&&!X(a);d||f||la(b,"data",d={});if(e)d[a]=c;else if(g){if(f)return d&&d[a];t(d,a)}else return d}function Cb(b,a){return b.getAttribute?-1<(" "+(b.getAttribute("class")||"")+" ").replace(/[\n\t]/g," ").indexOf(" "+a+" "):!1}function Db(b,a){a&&b.setAttribute&&q(a.split(" "),function(a){b.setAttribute("class",ba((" "+(b.getAttribute("class")||"")+" ").replace(/[\n\t]/g,
" ").replace(" "+ba(a)+" "," ")))})}function Eb(b,a){if(a&&b.setAttribute){var c=(" "+(b.getAttribute("class")||"")+" ").replace(/[\n\t]/g," ");q(a.split(" "),function(a){a=ba(a);-1===c.indexOf(" "+a+" ")&&(c+=a+" ")});b.setAttribute("class",ba(c))}}function zb(b,a){if(a){a=a.nodeName||!B(a.length)||Aa(a)?[a]:a;for(var c=0;c<a.length;c++)b.push(a[c])}}function dc(b,a){return fb(b,"$"+(a||"ngController")+"Controller")}function fb(b,a,c){b=A(b);9==b[0].nodeType&&(b=b.find("html"));for(a=K(a)?a:[a];b.length;){for(var d=
0,e=a.length;d<e;d++)if((c=b.data(a[d]))!==r)return c;b=b.parent()}}function ec(b){for(var a=0,c=b.childNodes;a<c.length;a++)Ea(c[a]);for(;b.firstChild;)b.removeChild(b.firstChild)}function fc(b,a){var c=gb[a.toLowerCase()];return c&&gc[b.nodeName]&&c}function Zc(b,a){var c=function(c,e){c.preventDefault||(c.preventDefault=function(){c.returnValue=!1});c.stopPropagation||(c.stopPropagation=function(){c.cancelBubble=!0});c.target||(c.target=c.srcElement||Q);if(z(c.defaultPrevented)){var g=c.preventDefault;
c.preventDefault=function(){c.defaultPrevented=!0;g.call(c)};c.defaultPrevented=!1}c.isDefaultPrevented=function(){return c.defaultPrevented||!1===c.returnValue};var f=Tb(a[e||c.type]||[]);q(f,function(a){a.call(b,c)});8>=M?(c.preventDefault=null,c.stopPropagation=null,c.isDefaultPrevented=null):(delete c.preventDefault,delete c.stopPropagation,delete c.isDefaultPrevented)};c.elem=b;return c}function Fa(b){var a=typeof b,c;"object"==a&&null!==b?"function"==typeof(c=b.$$hashKey)?c=b.$$hashKey():c===
r&&(c=b.$$hashKey=Za()):c=b;return a+":"+c}function Sa(b){q(b,this.put,this)}function hc(b){var a,c;"function"==typeof b?(a=b.$inject)||(a=[],b.length&&(c=b.toString().replace($c,""),c=c.match(ad),q(c[1].split(bd),function(b){b.replace(cd,function(b,c,d){a.push(d)})})),b.$inject=a):K(b)?(c=b.length-1,Pa(b[c],"fn"),a=b.slice(0,c)):Pa(b,"fn",!0);return a}function $b(b){function a(a){return function(b,c){if(X(b))q(b,Qb(a));else return a(b,c)}}function c(a,b){xa(a,"service");if(L(b)||K(b))b=n.instantiate(b);
if(!b.$get)throw Ta("pget",a);return l[a+h]=b}function d(a,b){return c(a,{$get:b})}function e(a){var b=[],c,d,g,h;q(a,function(a){if(!k.get(a)){k.put(a,!0);try{if(D(a))for(c=Ua(a),b=b.concat(e(c.requires)).concat(c._runBlocks),d=c._invokeQueue,g=0,h=d.length;g<h;g++){var f=d[g],m=n.get(f[0]);m[f[1]].apply(m,f[2])}else L(a)?b.push(n.invoke(a)):K(a)?b.push(n.invoke(a)):Pa(a,"module")}catch(s){throw K(a)&&(a=a[a.length-1]),s.message&&(s.stack&&-1==s.stack.indexOf(s.message))&&(s=s.message+"\n"+s.stack),
Ta("modulerr",a,s.stack||s.message||s);}}});return b}function g(a,b){function c(d){if(a.hasOwnProperty(d)){if(a[d]===f)throw Ta("cdep",m.join(" <- "));return a[d]}try{return m.unshift(d),a[d]=f,a[d]=b(d)}catch(e){throw a[d]===f&&delete a[d],e;}finally{m.shift()}}function d(a,b,e){var g=[],h=hc(a),f,k,m;k=0;for(f=h.length;k<f;k++){m=h[k];if("string"!==typeof m)throw Ta("itkn",m);g.push(e&&e.hasOwnProperty(m)?e[m]:c(m))}a.$inject||(a=a[f]);return a.apply(b,g)}return{invoke:d,instantiate:function(a,
b){var c=function(){},e;c.prototype=(K(a)?a[a.length-1]:a).prototype;c=new c;e=d(a,c,b);return X(e)||L(e)?e:c},get:c,annotate:hc,has:function(b){return l.hasOwnProperty(b+h)||a.hasOwnProperty(b)}}}var f={},h="Provider",m=[],k=new Sa,l={$provide:{provider:a(c),factory:a(d),service:a(function(a,b){return d(a,["$injector",function(a){return a.instantiate(b)}])}),value:a(function(a,b){return d(a,$(b))}),constant:a(function(a,b){xa(a,"constant");l[a]=b;p[a]=b}),decorator:function(a,b){var c=n.get(a+h),
d=c.$get;c.$get=function(){var a=s.invoke(d,c);return s.invoke(b,null,{$delegate:a})}}}},n=l.$injector=g(l,function(){throw Ta("unpr",m.join(" <- "));}),p={},s=p.$injector=g(p,function(a){a=n.get(a+h);return s.invoke(a.$get,a)});q(e(b),function(a){s.invoke(a||w)});return s}function dd(){var b=!0;this.disableAutoScrolling=function(){b=!1};this.$get=["$window","$location","$rootScope",function(a,c,d){function e(a){var b=null;q(a,function(a){b||"a"!==x(a.nodeName)||(b=a)});return b}function g(){var b=
c.hash(),d;b?(d=f.getElementById(b))?d.scrollIntoView():(d=e(f.getElementsByName(b)))?d.scrollIntoView():"top"===b&&a.scrollTo(0,0):a.scrollTo(0,0)}var f=a.document;b&&d.$watch(function(){return c.hash()},function(){d.$evalAsync(g)});return g}]}function ed(b,a,c,d){function e(a){try{a.apply(null,va.call(arguments,1))}finally{if(C--,0===C)for(;y.length;)try{y.pop()()}catch(b){c.error(b)}}}function g(a,b){(function T(){q(E,function(a){a()});u=b(T,a)})()}function f(){v=null;R!=h.url()&&(R=h.url(),q(ha,
function(a){a(h.url())}))}var h=this,m=a[0],k=b.location,l=b.history,n=b.setTimeout,p=b.clearTimeout,s={};h.isMock=!1;var C=0,y=[];h.$$completeOutstandingRequest=e;h.$$incOutstandingRequestCount=function(){C++};h.notifyWhenNoOutstandingRequests=function(a){q(E,function(a){a()});0===C?a():y.push(a)};var E=[],u;h.addPollFn=function(a){z(u)&&g(100,n);E.push(a);return a};var R=k.href,H=a.find("base"),v=null;h.url=function(a,c){k!==b.location&&(k=b.location);l!==b.history&&(l=b.history);if(a){if(R!=a)return R=
a,d.history?c?l.replaceState(null,"",a):(l.pushState(null,"",a),H.attr("href",H.attr("href"))):(v=a,c?k.replace(a):k.href=a),h}else return v||k.href.replace(/%27/g,"'")};var ha=[],N=!1;h.onUrlChange=function(a){if(!N){if(d.history)A(b).on("popstate",f);if(d.hashchange)A(b).on("hashchange",f);else h.addPollFn(f);N=!0}ha.push(a);return a};h.baseHref=function(){var a=H.attr("href");return a?a.replace(/^(https?\:)?\/\/[^\/]*/,""):""};var V={},J="",ca=h.baseHref();h.cookies=function(a,b){var d,e,g,h;if(a)b===
r?m.cookie=escape(a)+"=;path="+ca+";expires=Thu, 01 Jan 1970 00:00:00 GMT":D(b)&&(d=(m.cookie=escape(a)+"="+escape(b)+";path="+ca).length+1,4096<d&&c.warn("Cookie '"+a+"' possibly not set or overflowed because it was too large ("+d+" > 4096 bytes)!"));else{if(m.cookie!==J)for(J=m.cookie,d=J.split("; "),V={},g=0;g<d.length;g++)e=d[g],h=e.indexOf("="),0<h&&(a=unescape(e.substring(0,h)),V[a]===r&&(V[a]=unescape(e.substring(h+1))));return V}};h.defer=function(a,b){var c;C++;c=n(function(){delete s[c];
e(a)},b||0);s[c]=!0;return c};h.defer.cancel=function(a){return s[a]?(delete s[a],p(a),e(w),!0):!1}}function fd(){this.$get=["$window","$log","$sniffer","$document",function(b,a,c,d){return new ed(b,d,a,c)}]}function gd(){this.$get=function(){function b(b,d){function e(a){a!=n&&(p?p==a&&(p=a.n):p=a,g(a.n,a.p),g(a,n),n=a,n.n=null)}function g(a,b){a!=b&&(a&&(a.p=b),b&&(b.n=a))}if(b in a)throw F("$cacheFactory")("iid",b);var f=0,h=t({},d,{id:b}),m={},k=d&&d.capacity||Number.MAX_VALUE,l={},n=null,p=null;
return a[b]={put:function(a,b){var c=l[a]||(l[a]={key:a});e(c);if(!z(b))return a in m||f++,m[a]=b,f>k&&this.remove(p.key),b},get:function(a){var b=l[a];if(b)return e(b),m[a]},remove:function(a){var b=l[a];b&&(b==n&&(n=b.p),b==p&&(p=b.n),g(b.n,b.p),delete l[a],delete m[a],f--)},removeAll:function(){m={};f=0;l={};n=p=null},destroy:function(){l=h=m=null;delete a[b]},info:function(){return t({},h,{size:f})}}}var a={};b.info=function(){var b={};q(a,function(a,e){b[e]=a.info()});return b};b.get=function(b){return a[b]};
return b}}function hd(){this.$get=["$cacheFactory",function(b){return b("templates")}]}function jc(b,a){var c={},d="Directive",e=/^\s*directive\:\s*([\d\w\-_]+)\s+(.*)$/,g=/(([\d\w\-_]+)(?:\:([^;]+))?;?)/,f=/^(on[a-z]+|formaction)$/;this.directive=function m(a,e){xa(a,"directive");D(a)?(ub(e,"directiveFactory"),c.hasOwnProperty(a)||(c[a]=[],b.factory(a+d,["$injector","$exceptionHandler",function(b,d){var e=[];q(c[a],function(c,g){try{var f=b.invoke(c);L(f)?f={compile:$(f)}:!f.compile&&f.link&&(f.compile=
$(f.link));f.priority=f.priority||0;f.index=g;f.name=f.name||a;f.require=f.require||f.controller&&f.name;f.restrict=f.restrict||"A";e.push(f)}catch(m){d(m)}});return e}])),c[a].push(e)):q(a,Qb(m));return this};this.aHrefSanitizationWhitelist=function(b){return B(b)?(a.aHrefSanitizationWhitelist(b),this):a.aHrefSanitizationWhitelist()};this.imgSrcSanitizationWhitelist=function(b){return B(b)?(a.imgSrcSanitizationWhitelist(b),this):a.imgSrcSanitizationWhitelist()};this.$get=["$injector","$interpolate",
"$exceptionHandler","$http","$templateCache","$parse","$controller","$rootScope","$document","$sce","$animate","$$sanitizeUri",function(a,b,l,n,p,s,C,y,E,u,R,H){function v(a,b,c,d,e){a instanceof A||(a=A(a));q(a,function(b,c){3==b.nodeType&&b.nodeValue.match(/\S+/)&&(a[c]=A(b).wrap("<span></span>").parent()[0])});var g=N(a,b,a,c,d,e);ha(a,"ng-scope");return function(b,c,d){ub(b,"scope");var e=c?Ga.clone.call(a):a;q(d,function(a,b){e.data("$"+b+"Controller",a)});d=0;for(var f=e.length;d<f;d++){var m=
e[d].nodeType;1!==m&&9!==m||e.eq(d).data("$scope",b)}c&&c(e,b);g&&g(b,e,e);return e}}function ha(a,b){try{a.addClass(b)}catch(c){}}function N(a,b,c,d,e,g){function f(a,c,d,e){var g,k,s,l,n,p,I;g=c.length;var C=Array(g);for(n=0;n<g;n++)C[n]=c[n];I=n=0;for(p=m.length;n<p;I++)k=C[I],c=m[n++],g=m[n++],s=A(k),c?(c.scope?(l=a.$new(),s.data("$scope",l)):l=a,(s=c.transclude)||!e&&b?c(g,l,k,d,V(a,s||b)):c(g,l,k,d,e)):g&&g(a,k.childNodes,r,e)}for(var m=[],k,s,l,n,p=0;p<a.length;p++)k=new Fb,s=J(a[p],[],k,0===
p?d:r,e),(g=s.length?ia(s,a[p],k,b,c,null,[],[],g):null)&&g.scope&&ha(A(a[p]),"ng-scope"),k=g&&g.terminal||!(l=a[p].childNodes)||!l.length?null:N(l,g?g.transclude:b),m.push(g,k),n=n||g||k,g=null;return n?f:null}function V(a,b){return function(c,d,e){var g=!1;c||(c=a.$new(),g=c.$$transcluded=!0);d=b(c,d,e);if(g)d.on("$destroy",cb(c,c.$destroy));return d}}function J(a,b,c,d,f){var k=c.$attr,m;switch(a.nodeType){case 1:T(b,ma(Ha(a).toLowerCase()),"E",d,f);var s,l,n;m=a.attributes;for(var p=0,C=m&&m.length;p<
C;p++){var y=!1,R=!1;s=m[p];if(!M||8<=M||s.specified){l=s.name;n=ma(l);W.test(n)&&(l=db(n.substr(6),"-"));var v=n.replace(/(Start|End)$/,"");n===v+"Start"&&(y=l,R=l.substr(0,l.length-5)+"end",l=l.substr(0,l.length-6));n=ma(l.toLowerCase());k[n]=l;c[n]=s=ba(s.value);fc(a,n)&&(c[n]=!0);S(a,b,s,n);T(b,n,"A",d,f,y,R)}}a=a.className;if(D(a)&&""!==a)for(;m=g.exec(a);)n=ma(m[2]),T(b,n,"C",d,f)&&(c[n]=ba(m[3])),a=a.substr(m.index+m[0].length);break;case 3:F(b,a.nodeValue);break;case 8:try{if(m=e.exec(a.nodeValue))n=
ma(m[1]),T(b,n,"M",d,f)&&(c[n]=ba(m[2]))}catch(E){}}b.sort(z);return b}function ca(a,b,c){var d=[],e=0;if(b&&a.hasAttribute&&a.hasAttribute(b)){do{if(!a)throw ja("uterdir",b,c);1==a.nodeType&&(a.hasAttribute(b)&&e++,a.hasAttribute(c)&&e--);d.push(a);a=a.nextSibling}while(0<e)}else d.push(a);return A(d)}function P(a,b,c){return function(d,e,g,f,m){e=ca(e[0],b,c);return a(d,e,g,f,m)}}function ia(a,c,d,e,g,f,m,n,p){function y(a,b,c,d){if(a){c&&(a=P(a,c,d));a.require=G.require;if(H===G||G.$$isolateScope)a=
kc(a,{isolateScope:!0});m.push(a)}if(b){c&&(b=P(b,c,d));b.require=G.require;if(H===G||G.$$isolateScope)b=kc(b,{isolateScope:!0});n.push(b)}}function R(a,b,c){var d,e="data",g=!1;if(D(a)){for(;"^"==(d=a.charAt(0))||"?"==d;)a=a.substr(1),"^"==d&&(e="inheritedData"),g=g||"?"==d;d=null;c&&"data"===e&&(d=c[a]);d=d||b[e]("$"+a+"Controller");if(!d&&!g)throw ja("ctreq",a,da);}else K(a)&&(d=[],q(a,function(a){d.push(R(a,b,c))}));return d}function E(a,e,g,f,p){function y(a,b){var c;2>arguments.length&&(b=a,
a=r);z&&(c=ca);return p(a,b,c)}var I,v,N,u,P,J,ca={},hb;I=c===g?d:Tb(d,new Fb(A(g),d.$attr));v=I.$$element;if(H){var T=/^\s*([@=&])(\??)\s*(\w*)\s*$/;f=A(g);J=e.$new(!0);ia&&ia===H.$$originalDirective?f.data("$isolateScope",J):f.data("$isolateScopeNoTemplate",J);ha(f,"ng-isolate-scope");q(H.scope,function(a,c){var d=a.match(T)||[],g=d[3]||c,f="?"==d[2],d=d[1],m,l,n,p;J.$$isolateBindings[c]=d+g;switch(d){case "@":I.$observe(g,function(a){J[c]=a});I.$$observers[g].$$scope=e;I[g]&&(J[c]=b(I[g])(e));
break;case "=":if(f&&!I[g])break;l=s(I[g]);p=l.literal?ua:function(a,b){return a===b};n=l.assign||function(){m=J[c]=l(e);throw ja("nonassign",I[g],H.name);};m=J[c]=l(e);J.$watch(function(){var a=l(e);p(a,J[c])||(p(a,m)?n(e,a=J[c]):J[c]=a);return m=a},null,l.literal);break;case "&":l=s(I[g]);J[c]=function(a){return l(e,a)};break;default:throw ja("iscp",H.name,c,a);}})}hb=p&&y;V&&q(V,function(a){var b={$scope:a===H||a.$$isolateScope?J:e,$element:v,$attrs:I,$transclude:hb},c;P=a.controller;"@"==P&&(P=
I[a.name]);c=C(P,b);ca[a.name]=c;z||v.data("$"+a.name+"Controller",c);a.controllerAs&&(b.$scope[a.controllerAs]=c)});f=0;for(N=m.length;f<N;f++)try{u=m[f],u(u.isolateScope?J:e,v,I,u.require&&R(u.require,v,ca),hb)}catch(G){l(G,ga(v))}f=e;H&&(H.template||null===H.templateUrl)&&(f=J);a&&a(f,g.childNodes,r,p);for(f=n.length-1;0<=f;f--)try{u=n[f],u(u.isolateScope?J:e,v,I,u.require&&R(u.require,v,ca),hb)}catch(B){l(B,ga(v))}}p=p||{};var N=-Number.MAX_VALUE,u,V=p.controllerDirectives,H=p.newIsolateScopeDirective,
ia=p.templateDirective;p=p.nonTlbTranscludeDirective;for(var T=!1,z=!1,t=d.$$element=A(c),G,da,U,F=e,O,M=0,na=a.length;M<na;M++){G=a[M];var Va=G.$$start,S=G.$$end;Va&&(t=ca(c,Va,S));U=r;if(N>G.priority)break;if(U=G.scope)u=u||G,G.templateUrl||(x("new/isolated scope",H,G,t),X(U)&&(H=G));da=G.name;!G.templateUrl&&G.controller&&(U=G.controller,V=V||{},x("'"+da+"' controller",V[da],G,t),V[da]=G);if(U=G.transclude)T=!0,G.$$tlb||(x("transclusion",p,G,t),p=G),"element"==U?(z=!0,N=G.priority,U=ca(c,Va,S),
t=d.$$element=A(Q.createComment(" "+da+": "+d[da]+" ")),c=t[0],ib(g,A(va.call(U,0)),c),F=v(U,e,N,f&&f.name,{nonTlbTranscludeDirective:p})):(U=A(Ab(c)).contents(),t.empty(),F=v(U,e));if(G.template)if(x("template",ia,G,t),ia=G,U=L(G.template)?G.template(t,d):G.template,U=Y(U),G.replace){f=G;U=A("<div>"+ba(U)+"</div>").contents();c=U[0];if(1!=U.length||1!==c.nodeType)throw ja("tplrt",da,"");ib(g,t,c);na={$attr:{}};U=J(c,[],na);var W=a.splice(M+1,a.length-(M+1));H&&ic(U);a=a.concat(U).concat(W);B(d,na);
na=a.length}else t.html(U);if(G.templateUrl)x("template",ia,G,t),ia=G,G.replace&&(f=G),E=w(a.splice(M,a.length-M),t,d,g,F,m,n,{controllerDirectives:V,newIsolateScopeDirective:H,templateDirective:ia,nonTlbTranscludeDirective:p}),na=a.length;else if(G.compile)try{O=G.compile(t,d,F),L(O)?y(null,O,Va,S):O&&y(O.pre,O.post,Va,S)}catch(Z){l(Z,ga(t))}G.terminal&&(E.terminal=!0,N=Math.max(N,G.priority))}E.scope=u&&!0===u.scope;E.transclude=T&&F;return E}function ic(a){for(var b=0,c=a.length;b<c;b++)a[b]=Sb(a[b],
{$$isolateScope:!0})}function T(b,e,g,f,k,s,n){if(e===k)return null;k=null;if(c.hasOwnProperty(e)){var p;e=a.get(e+d);for(var C=0,y=e.length;C<y;C++)try{p=e[C],(f===r||f>p.priority)&&-1!=p.restrict.indexOf(g)&&(s&&(p=Sb(p,{$$start:s,$$end:n})),b.push(p),k=p)}catch(v){l(v)}}return k}function B(a,b){var c=b.$attr,d=a.$attr,e=a.$$element;q(a,function(d,e){"$"!=e.charAt(0)&&(b[e]&&(d+=("style"===e?";":" ")+b[e]),a.$set(e,d,!0,c[e]))});q(b,function(b,g){"class"==g?(ha(e,b),a["class"]=(a["class"]?a["class"]+
" ":"")+b):"style"==g?(e.attr("style",e.attr("style")+";"+b),a.style=(a.style?a.style+";":"")+b):"$"==g.charAt(0)||a.hasOwnProperty(g)||(a[g]=b,d[g]=c[g])})}function w(a,b,c,d,e,g,f,m){var k=[],s,l,C=b[0],y=a.shift(),v=t({},y,{templateUrl:null,transclude:null,replace:null,$$originalDirective:y}),R=L(y.templateUrl)?y.templateUrl(b,c):y.templateUrl;b.empty();n.get(u.getTrustedResourceUrl(R),{cache:p}).success(function(n){var p,E;n=Y(n);if(y.replace){n=A("<div>"+ba(n)+"</div>").contents();p=n[0];if(1!=
n.length||1!==p.nodeType)throw ja("tplrt",y.name,R);n={$attr:{}};ib(d,b,p);var u=J(p,[],n);X(y.scope)&&ic(u);a=u.concat(a);B(c,n)}else p=C,b.html(n);a.unshift(v);s=ia(a,p,c,e,b,y,g,f,m);q(d,function(a,c){a==p&&(d[c]=b[0])});for(l=N(b[0].childNodes,e);k.length;){n=k.shift();E=k.shift();var H=k.shift(),ha=k.shift(),u=b[0];E!==C&&(u=Ab(p),ib(H,A(E),u));E=s.transclude?V(n,s.transclude):ha;s(l,n,u,d,E)}k=null}).error(function(a,b,c,d){throw ja("tpload",d.url);});return function(a,b,c,d,e){k?(k.push(b),
k.push(c),k.push(d),k.push(e)):s(l,b,c,d,e)}}function z(a,b){var c=b.priority-a.priority;return 0!==c?c:a.name!==b.name?a.name<b.name?-1:1:a.index-b.index}function x(a,b,c,d){if(b)throw ja("multidir",b.name,c.name,a,ga(d));}function F(a,c){var d=b(c,!0);d&&a.push({priority:0,compile:$(function(a,b){var c=b.parent(),e=c.data("$binding")||[];e.push(d);ha(c.data("$binding",e),"ng-binding");a.$watch(d,function(a){b[0].nodeValue=a})})})}function O(a,b){if("srcdoc"==b)return u.HTML;var c=Ha(a);if("xlinkHref"==
b||"FORM"==c&&"action"==b||"IMG"!=c&&("src"==b||"ngSrc"==b))return u.RESOURCE_URL}function S(a,c,d,e){var g=b(d,!0);if(g){if("multiple"===e&&"SELECT"===Ha(a))throw ja("selmulti",ga(a));c.push({priority:100,compile:function(){return{pre:function(c,d,m){d=m.$$observers||(m.$$observers={});if(f.test(e))throw ja("nodomevents");if(g=b(m[e],!0,O(a,e)))m[e]=g(c),(d[e]||(d[e]=[])).$$inter=!0,(m.$$observers&&m.$$observers[e].$$scope||c).$watch(g,function(a,b){"class"===e&&a!=b?m.$updateClass(a,b):m.$set(e,
a)})}}}})}}function ib(a,b,c){var d=b[0],e=b.length,g=d.parentNode,f,m;if(a)for(f=0,m=a.length;f<m;f++)if(a[f]==d){a[f++]=c;m=f+e-1;for(var k=a.length;f<k;f++,m++)m<k?a[f]=a[m]:delete a[f];a.length-=e-1;break}g&&g.replaceChild(c,d);a=Q.createDocumentFragment();a.appendChild(d);c[A.expando]=d[A.expando];d=1;for(e=b.length;d<e;d++)g=b[d],A(g).remove(),a.appendChild(g),delete b[d];b[0]=c;b.length=1}function kc(a,b){return t(function(){return a.apply(null,arguments)},a,b)}var Fb=function(a,b){this.$$element=
a;this.$attr=b||{}};Fb.prototype={$normalize:ma,$addClass:function(a){a&&0<a.length&&R.addClass(this.$$element,a)},$removeClass:function(a){a&&0<a.length&&R.removeClass(this.$$element,a)},$updateClass:function(a,b){this.$removeClass(lc(b,a));this.$addClass(lc(a,b))},$set:function(a,b,c,d){var e=fc(this.$$element[0],a);e&&(this.$$element.prop(a,b),d=e);this[a]=b;d?this.$attr[a]=d:(d=this.$attr[a])||(this.$attr[a]=d=db(a,"-"));e=Ha(this.$$element);if("A"===e&&"href"===a||"IMG"===e&&"src"===a)this[a]=
b=H(b,"src"===a);!1!==c&&(null===b||b===r?this.$$element.removeAttr(d):this.$$element.attr(d,b));(c=this.$$observers)&&q(c[a],function(a){try{a(b)}catch(c){l(c)}})},$observe:function(a,b){var c=this,d=c.$$observers||(c.$$observers={}),e=d[a]||(d[a]=[]);e.push(b);y.$evalAsync(function(){e.$$inter||b(c[a])});return b}};var da=b.startSymbol(),na=b.endSymbol(),Y="{{"==da||"}}"==na?Ba:function(a){return a.replace(/\{\{/g,da).replace(/}}/g,na)},W=/^ngAttr[A-Z]/;return v}]}function ma(b){return Qa(b.replace(id,
""))}function lc(b,a){var c="",d=b.split(/\s+/),e=a.split(/\s+/),g=0;a:for(;g<d.length;g++){for(var f=d[g],h=0;h<e.length;h++)if(f==e[h])continue a;c+=(0<c.length?" ":"")+f}return c}function jd(){var b={},a=/^(\S+)(\s+as\s+(\w+))?$/;this.register=function(a,d){xa(a,"controller");X(a)?t(b,a):b[a]=d};this.$get=["$injector","$window",function(c,d){return function(e,g){var f,h,m;D(e)&&(f=e.match(a),h=f[1],m=f[3],e=b.hasOwnProperty(h)?b[h]:vb(g.$scope,h,!0)||vb(d,h,!0),Pa(e,h,!0));f=c.instantiate(e,g);
if(m){if(!g||"object"!=typeof g.$scope)throw F("$controller")("noscp",h||e.name,m);g.$scope[m]=f}return f}}]}function kd(){this.$get=["$window",function(b){return A(b.document)}]}function ld(){this.$get=["$log",function(b){return function(a,c){b.error.apply(b,arguments)}}]}function mc(b){var a={},c,d,e;if(!b)return a;q(b.split("\n"),function(b){e=b.indexOf(":");c=x(ba(b.substr(0,e)));d=ba(b.substr(e+1));c&&(a[c]=a[c]?a[c]+(", "+d):d)});return a}function nc(b){var a=X(b)?b:r;return function(c){a||
(a=mc(b));return c?a[x(c)]||null:a}}function oc(b,a,c){if(L(c))return c(b,a);q(c,function(c){b=c(b,a)});return b}function md(){var b=/^\s*(\[|\{[^\{])/,a=/[\}\]]\s*$/,c=/^\)\]\}',?\n/,d={"Content-Type":"application/json;charset=utf-8"},e=this.defaults={transformResponse:[function(d){D(d)&&(d=d.replace(c,""),b.test(d)&&a.test(d)&&(d=Vb(d)));return d}],transformRequest:[function(a){return X(a)&&"[object File]"!==$a.call(a)?qa(a):a}],headers:{common:{Accept:"application/json, text/plain, */*"},post:aa(d),
put:aa(d),patch:aa(d)},xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN"},g=this.interceptors=[],f=this.responseInterceptors=[];this.$get=["$httpBackend","$browser","$cacheFactory","$rootScope","$q","$injector",function(a,b,c,d,n,p){function s(a){function c(a){var b=t({},a,{data:oc(a.data,a.headers,d.transformResponse)});return 200<=a.status&&300>a.status?b:n.reject(b)}var d={transformRequest:e.transformRequest,transformResponse:e.transformResponse},g=function(a){function b(a){var c;q(a,function(b,
d){L(b)&&(c=b(),null!=c?a[d]=c:delete a[d])})}var c=e.headers,d=t({},a.headers),g,f,c=t({},c.common,c[x(a.method)]);b(c);b(d);a:for(g in c){a=x(g);for(f in d)if(x(f)===a)continue a;d[g]=c[g]}return d}(a);t(d,a);d.headers=g;d.method=Ia(d.method);(a=Gb(d.url)?b.cookies()[d.xsrfCookieName||e.xsrfCookieName]:r)&&(g[d.xsrfHeaderName||e.xsrfHeaderName]=a);var f=[function(a){g=a.headers;var b=oc(a.data,nc(g),a.transformRequest);z(a.data)&&q(g,function(a,b){"content-type"===x(b)&&delete g[b]});z(a.withCredentials)&&
!z(e.withCredentials)&&(a.withCredentials=e.withCredentials);return C(a,b,g).then(c,c)},r],h=n.when(d);for(q(u,function(a){(a.request||a.requestError)&&f.unshift(a.request,a.requestError);(a.response||a.responseError)&&f.push(a.response,a.responseError)});f.length;){a=f.shift();var k=f.shift(),h=h.then(a,k)}h.success=function(a){h.then(function(b){a(b.data,b.status,b.headers,d)});return h};h.error=function(a){h.then(null,function(b){a(b.data,b.status,b.headers,d)});return h};return h}function C(b,
c,g){function f(a,b,c){u&&(200<=a&&300>a?u.put(r,[a,b,mc(c)]):u.remove(r));m(b,a,c);d.$$phase||d.$apply()}function m(a,c,d){c=Math.max(c,0);(200<=c&&300>c?p.resolve:p.reject)({data:a,status:c,headers:nc(d),config:b})}function k(){var a=bb(s.pendingRequests,b);-1!==a&&s.pendingRequests.splice(a,1)}var p=n.defer(),C=p.promise,u,q,r=y(b.url,b.params);s.pendingRequests.push(b);C.then(k,k);(b.cache||e.cache)&&(!1!==b.cache&&"GET"==b.method)&&(u=X(b.cache)?b.cache:X(e.cache)?e.cache:E);if(u)if(q=u.get(r),
B(q)){if(q.then)return q.then(k,k),q;K(q)?m(q[1],q[0],aa(q[2])):m(q,200,{})}else u.put(r,C);z(q)&&a(b.method,r,c,f,g,b.timeout,b.withCredentials,b.responseType);return C}function y(a,b){if(!b)return a;var c=[];Pc(b,function(a,b){null===a||z(a)||(K(a)||(a=[a]),q(a,function(a){X(a)&&(a=qa(a));c.push(wa(b)+"="+wa(a))}))});return a+(-1==a.indexOf("?")?"?":"&")+c.join("&")}var E=c("$http"),u=[];q(g,function(a){u.unshift(D(a)?p.get(a):p.invoke(a))});q(f,function(a,b){var c=D(a)?p.get(a):p.invoke(a);u.splice(b,
0,{response:function(a){return c(n.when(a))},responseError:function(a){return c(n.reject(a))}})});s.pendingRequests=[];(function(a){q(arguments,function(a){s[a]=function(b,c){return s(t(c||{},{method:a,url:b}))}})})("get","delete","head","jsonp");(function(a){q(arguments,function(a){s[a]=function(b,c,d){return s(t(d||{},{method:a,url:b,data:c}))}})})("post","put");s.defaults=e;return s}]}function nd(b){return 8>=M&&"patch"===x(b)?new ActiveXObject("Microsoft.XMLHTTP"):new Z.XMLHttpRequest}function od(){this.$get=
["$browser","$window","$document",function(b,a,c){return pd(b,nd,b.defer,a.angular.callbacks,c[0])}]}function pd(b,a,c,d,e){function g(a,b){var c=e.createElement("script"),d=function(){c.onreadystatechange=c.onload=c.onerror=null;e.body.removeChild(c);b&&b()};c.type="text/javascript";c.src=a;M&&8>=M?c.onreadystatechange=function(){/loaded|complete/.test(c.readyState)&&d()}:c.onload=c.onerror=function(){d()};e.body.appendChild(c);return d}var f=-1;return function(e,m,k,l,n,p,s,C){function y(){u=f;
H&&H();v&&v.abort()}function E(a,d,e,g){r&&c.cancel(r);H=v=null;d=0===d?e?200:404:d;a(1223==d?204:d,e,g);b.$$completeOutstandingRequest(w)}var u;b.$$incOutstandingRequestCount();m=m||b.url();if("jsonp"==x(e)){var R="_"+(d.counter++).toString(36);d[R]=function(a){d[R].data=a};var H=g(m.replace("JSON_CALLBACK","angular.callbacks."+R),function(){d[R].data?E(l,200,d[R].data):E(l,u||-2);d[R]=Ca.noop})}else{var v=a(e);v.open(e,m,!0);q(n,function(a,b){B(a)&&v.setRequestHeader(b,a)});v.onreadystatechange=
function(){if(v&&4==v.readyState){var a=null,b=null;u!==f&&(a=v.getAllResponseHeaders(),b="response"in v?v.response:v.responseText);E(l,u||v.status,b,a)}};s&&(v.withCredentials=!0);C&&(v.responseType=C);v.send(k||null)}if(0<p)var r=c(y,p);else p&&p.then&&p.then(y)}}function qd(){var b="{{",a="}}";this.startSymbol=function(a){return a?(b=a,this):b};this.endSymbol=function(b){return b?(a=b,this):a};this.$get=["$parse","$exceptionHandler","$sce",function(c,d,e){function g(g,k,l){for(var n,p,s=0,C=[],
y=g.length,E=!1,u=[];s<y;)-1!=(n=g.indexOf(b,s))&&-1!=(p=g.indexOf(a,n+f))?(s!=n&&C.push(g.substring(s,n)),C.push(s=c(E=g.substring(n+f,p))),s.exp=E,s=p+h,E=!0):(s!=y&&C.push(g.substring(s)),s=y);(y=C.length)||(C.push(""),y=1);if(l&&1<C.length)throw pc("noconcat",g);if(!k||E)return u.length=y,s=function(a){try{for(var b=0,c=y,f;b<c;b++)"function"==typeof(f=C[b])&&(f=f(a),f=l?e.getTrusted(l,f):e.valueOf(f),null===f||z(f)?f="":"string"!=typeof f&&(f=qa(f))),u[b]=f;return u.join("")}catch(h){a=pc("interr",
g,h.toString()),d(a)}},s.exp=g,s.parts=C,s}var f=b.length,h=a.length;g.startSymbol=function(){return b};g.endSymbol=function(){return a};return g}]}function rd(){this.$get=["$rootScope","$window","$q",function(b,a,c){function d(d,f,h,m){var k=a.setInterval,l=a.clearInterval,n=c.defer(),p=n.promise,s=0,C=B(m)&&!m;h=B(h)?h:0;p.then(null,null,d);p.$$intervalId=k(function(){n.notify(s++);0<h&&s>=h&&(n.resolve(s),l(p.$$intervalId),delete e[p.$$intervalId]);C||b.$apply()},f);e[p.$$intervalId]=n;return p}
var e={};d.cancel=function(a){return a&&a.$$intervalId in e?(e[a.$$intervalId].reject("canceled"),clearInterval(a.$$intervalId),delete e[a.$$intervalId],!0):!1};return d}]}function sd(){this.$get=function(){return{id:"en-us",NUMBER_FORMATS:{DECIMAL_SEP:".",GROUP_SEP:",",PATTERNS:[{minInt:1,minFrac:0,maxFrac:3,posPre:"",posSuf:"",negPre:"-",negSuf:"",gSize:3,lgSize:3},{minInt:1,minFrac:2,maxFrac:2,posPre:"\u00a4",posSuf:"",negPre:"(\u00a4",negSuf:")",gSize:3,lgSize:3}],CURRENCY_SYM:"$"},DATETIME_FORMATS:{MONTH:"January February March April May June July August September October November December".split(" "),
SHORTMONTH:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),DAY:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),SHORTDAY:"Sun Mon Tue Wed Thu Fri Sat".split(" "),AMPMS:["AM","PM"],medium:"MMM d, y h:mm:ss a","short":"M/d/yy h:mm a",fullDate:"EEEE, MMMM d, y",longDate:"MMMM d, y",mediumDate:"MMM d, y",shortDate:"M/d/yy",mediumTime:"h:mm:ss a",shortTime:"h:mm a"},pluralCat:function(b){return 1===b?"one":"other"}}}}function qc(b){b=b.split("/");for(var a=b.length;a--;)b[a]=
tb(b[a]);return b.join("/")}function rc(b,a,c){b=ya(b,c);a.$$protocol=b.protocol;a.$$host=b.hostname;a.$$port=S(b.port)||td[b.protocol]||null}function sc(b,a,c){var d="/"!==b.charAt(0);d&&(b="/"+b);b=ya(b,c);a.$$path=decodeURIComponent(d&&"/"===b.pathname.charAt(0)?b.pathname.substring(1):b.pathname);a.$$search=Xb(b.search);a.$$hash=decodeURIComponent(b.hash);a.$$path&&"/"!=a.$$path.charAt(0)&&(a.$$path="/"+a.$$path)}function oa(b,a){if(0===a.indexOf(b))return a.substr(b.length)}function Wa(b){var a=
b.indexOf("#");return-1==a?b:b.substr(0,a)}function Hb(b){return b.substr(0,Wa(b).lastIndexOf("/")+1)}function tc(b,a){this.$$html5=!0;a=a||"";var c=Hb(b);rc(b,this,b);this.$$parse=function(a){var e=oa(c,a);if(!D(e))throw Ib("ipthprfx",a,c);sc(e,this,b);this.$$path||(this.$$path="/");this.$$compose()};this.$$compose=function(){var a=Yb(this.$$search),b=this.$$hash?"#"+tb(this.$$hash):"";this.$$url=qc(this.$$path)+(a?"?"+a:"")+b;this.$$absUrl=c+this.$$url.substr(1)};this.$$rewrite=function(d){var e;
if((e=oa(b,d))!==r)return d=e,(e=oa(a,e))!==r?c+(oa("/",e)||e):b+d;if((e=oa(c,d))!==r)return c+e;if(c==d+"/")return c}}function Jb(b,a){var c=Hb(b);rc(b,this,b);this.$$parse=function(d){var e=oa(b,d)||oa(c,d),e="#"==e.charAt(0)?oa(a,e):this.$$html5?e:"";if(!D(e))throw Ib("ihshprfx",d,a);sc(e,this,b);d=this.$$path;var g=/^\/?.*?:(\/.*)/;0===e.indexOf(b)&&(e=e.replace(b,""));g.exec(e)||(d=(e=g.exec(d))?e[1]:d);this.$$path=d;this.$$compose()};this.$$compose=function(){var c=Yb(this.$$search),e=this.$$hash?
"#"+tb(this.$$hash):"";this.$$url=qc(this.$$path)+(c?"?"+c:"")+e;this.$$absUrl=b+(this.$$url?a+this.$$url:"")};this.$$rewrite=function(a){if(Wa(b)==Wa(a))return a}}function uc(b,a){this.$$html5=!0;Jb.apply(this,arguments);var c=Hb(b);this.$$rewrite=function(d){var e;if(b==Wa(d))return d;if(e=oa(c,d))return b+a+e;if(c===d+"/")return c}}function jb(b){return function(){return this[b]}}function vc(b,a){return function(c){if(z(c))return this[b];this[b]=a(c);this.$$compose();return this}}function ud(){var b=
"",a=!1;this.hashPrefix=function(a){return B(a)?(b=a,this):b};this.html5Mode=function(b){return B(b)?(a=b,this):a};this.$get=["$rootScope","$browser","$sniffer","$rootElement",function(c,d,e,g){function f(a){c.$broadcast("$locationChangeSuccess",h.absUrl(),a)}var h,m=d.baseHref(),k=d.url();a?(m=k.substring(0,k.indexOf("/",k.indexOf("//")+2))+(m||"/"),e=e.history?tc:uc):(m=Wa(k),e=Jb);h=new e(m,"#"+b);h.$$parse(h.$$rewrite(k));g.on("click",function(a){if(!a.ctrlKey&&!a.metaKey&&2!=a.which){for(var b=
A(a.target);"a"!==x(b[0].nodeName);)if(b[0]===g[0]||!(b=b.parent())[0])return;var e=b.prop("href");X(e)&&"[object SVGAnimatedString]"===e.toString()&&(e=ya(e.animVal).href);var f=h.$$rewrite(e);e&&(!b.attr("target")&&f&&!a.isDefaultPrevented())&&(a.preventDefault(),f!=d.url()&&(h.$$parse(f),c.$apply(),Z.angular["ff-684208-preventDefault"]=!0))}});h.absUrl()!=k&&d.url(h.absUrl(),!0);d.onUrlChange(function(a){h.absUrl()!=a&&(c.$evalAsync(function(){var b=h.absUrl();h.$$parse(a);c.$broadcast("$locationChangeStart",
a,b).defaultPrevented?(h.$$parse(b),d.url(b)):f(b)}),c.$$phase||c.$digest())});var l=0;c.$watch(function(){var a=d.url(),b=h.$$replace;l&&a==h.absUrl()||(l++,c.$evalAsync(function(){c.$broadcast("$locationChangeStart",h.absUrl(),a).defaultPrevented?h.$$parse(a):(d.url(h.absUrl(),b),f(a))}));h.$$replace=!1;return l});return h}]}function vd(){var b=!0,a=this;this.debugEnabled=function(a){return B(a)?(b=a,this):b};this.$get=["$window",function(c){function d(a){a instanceof Error&&(a.stack?a=a.message&&
-1===a.stack.indexOf(a.message)?"Error: "+a.message+"\n"+a.stack:a.stack:a.sourceURL&&(a=a.message+"\n"+a.sourceURL+":"+a.line));return a}function e(a){var b=c.console||{},e=b[a]||b.log||w;a=!1;try{a=!!e.apply}catch(m){}return a?function(){var a=[];q(arguments,function(b){a.push(d(b))});return e.apply(b,a)}:function(a,b){e(a,null==b?"":b)}}return{log:e("log"),info:e("info"),warn:e("warn"),error:e("error"),debug:function(){var c=e("debug");return function(){b&&c.apply(a,arguments)}}()}}]}function ea(b,
a){if("constructor"===b)throw za("isecfld",a);return b}function Xa(b,a){if(b){if(b.constructor===b)throw za("isecfn",a);if(b.document&&b.location&&b.alert&&b.setInterval)throw za("isecwindow",a);if(b.children&&(b.nodeName||b.on&&b.find))throw za("isecdom",a);}return b}function kb(b,a,c,d,e){e=e||{};a=a.split(".");for(var g,f=0;1<a.length;f++){g=ea(a.shift(),d);var h=b[g];h||(h={},b[g]=h);b=h;b.then&&e.unwrapPromises&&(ra(d),"$$v"in b||function(a){a.then(function(b){a.$$v=b})}(b),b.$$v===r&&(b.$$v=
{}),b=b.$$v)}g=ea(a.shift(),d);return b[g]=c}function wc(b,a,c,d,e,g,f){ea(b,g);ea(a,g);ea(c,g);ea(d,g);ea(e,g);return f.unwrapPromises?function(f,m){var k=m&&m.hasOwnProperty(b)?m:f,l;if(null==k)return k;(k=k[b])&&k.then&&(ra(g),"$$v"in k||(l=k,l.$$v=r,l.then(function(a){l.$$v=a})),k=k.$$v);if(!a)return k;if(null==k)return r;(k=k[a])&&k.then&&(ra(g),"$$v"in k||(l=k,l.$$v=r,l.then(function(a){l.$$v=a})),k=k.$$v);if(!c)return k;if(null==k)return r;(k=k[c])&&k.then&&(ra(g),"$$v"in k||(l=k,l.$$v=r,l.then(function(a){l.$$v=
a})),k=k.$$v);if(!d)return k;if(null==k)return r;(k=k[d])&&k.then&&(ra(g),"$$v"in k||(l=k,l.$$v=r,l.then(function(a){l.$$v=a})),k=k.$$v);if(!e)return k;if(null==k)return r;(k=k[e])&&k.then&&(ra(g),"$$v"in k||(l=k,l.$$v=r,l.then(function(a){l.$$v=a})),k=k.$$v);return k}:function(g,f){var k=f&&f.hasOwnProperty(b)?f:g;if(null==k)return k;k=k[b];if(!a)return k;if(null==k)return r;k=k[a];if(!c)return k;if(null==k)return r;k=k[c];if(!d)return k;if(null==k)return r;k=k[d];return e?null==k?r:k=k[e]:k}}function wd(b,
a){ea(b,a);return function(a,d){return null==a?r:(d&&d.hasOwnProperty(b)?d:a)[b]}}function xd(b,a,c){ea(b,c);ea(a,c);return function(c,e){if(null==c)return r;c=(e&&e.hasOwnProperty(b)?e:c)[b];return null==c?r:c[a]}}function xc(b,a,c){if(Kb.hasOwnProperty(b))return Kb[b];var d=b.split("."),e=d.length,g;if(a.unwrapPromises||1!==e)if(a.unwrapPromises||2!==e)if(a.csp)g=6>e?wc(d[0],d[1],d[2],d[3],d[4],c,a):function(b,g){var f=0,h;do h=wc(d[f++],d[f++],d[f++],d[f++],d[f++],c,a)(b,g),g=r,b=h;while(f<e);
return h};else{var f="var p;\n";q(d,function(b,d){ea(b,c);f+="if(s == null) return undefined;\ns="+(d?"s":'((k&&k.hasOwnProperty("'+b+'"))?k:s)')+'["'+b+'"];\n'+(a.unwrapPromises?'if (s && s.then) {\n pw("'+c.replace(/(["\r\n])/g,"\\$1")+'");\n if (!("$$v" in s)) {\n p=s;\n p.$$v = undefined;\n p.then(function(v) {p.$$v=v;});\n}\n s=s.$$v\n}\n':"")});var f=f+"return s;",h=new Function("s","k","pw",f);h.toString=$(f);g=a.unwrapPromises?function(a,b){return h(a,b,ra)}:h}else g=xd(d[0],d[1],c);else g=
wd(d[0],c);"hasOwnProperty"!==b&&(Kb[b]=g);return g}function yd(){var b={},a={csp:!1,unwrapPromises:!1,logPromiseWarnings:!0};this.unwrapPromises=function(b){return B(b)?(a.unwrapPromises=!!b,this):a.unwrapPromises};this.logPromiseWarnings=function(b){return B(b)?(a.logPromiseWarnings=b,this):a.logPromiseWarnings};this.$get=["$filter","$sniffer","$log",function(c,d,e){a.csp=d.csp;ra=function(b){a.logPromiseWarnings&&!yc.hasOwnProperty(b)&&(yc[b]=!0,e.warn("[$parse] Promise found in the expression `"+
b+"`. Automatic unwrapping of promises in Angular expressions is deprecated."))};return function(d){var e;switch(typeof d){case "string":if(b.hasOwnProperty(d))return b[d];e=new Lb(a);e=(new Ya(e,c,a)).parse(d,!1);"hasOwnProperty"!==d&&(b[d]=e);return e;case "function":return d;default:return w}}}]}function zd(){this.$get=["$rootScope","$exceptionHandler",function(b,a){return Ad(function(a){b.$evalAsync(a)},a)}]}function Ad(b,a){function c(a){return a}function d(a){return f(a)}var e=function(){var h=
[],m,k;return k={resolve:function(a){if(h){var c=h;h=r;m=g(a);c.length&&b(function(){for(var a,b=0,d=c.length;b<d;b++)a=c[b],m.then(a[0],a[1],a[2])})}},reject:function(a){k.resolve(f(a))},notify:function(a){if(h){var c=h;h.length&&b(function(){for(var b,d=0,e=c.length;d<e;d++)b=c[d],b[2](a)})}},promise:{then:function(b,g,f){var k=e(),C=function(d){try{k.resolve((L(b)?b:c)(d))}catch(e){k.reject(e),a(e)}},y=function(b){try{k.resolve((L(g)?g:d)(b))}catch(c){k.reject(c),a(c)}},E=function(b){try{k.notify((L(f)?
f:c)(b))}catch(d){a(d)}};h?h.push([C,y,E]):m.then(C,y,E);return k.promise},"catch":function(a){return this.then(null,a)},"finally":function(a){function b(a,c){var d=e();c?d.resolve(a):d.reject(a);return d.promise}function d(e,g){var f=null;try{f=(a||c)()}catch(h){return b(h,!1)}return f&&L(f.then)?f.then(function(){return b(e,g)},function(a){return b(a,!1)}):b(e,g)}return this.then(function(a){return d(a,!0)},function(a){return d(a,!1)})}}}},g=function(a){return a&&L(a.then)?a:{then:function(c){var d=
e();b(function(){d.resolve(c(a))});return d.promise}}},f=function(c){return{then:function(g,f){var l=e();b(function(){try{l.resolve((L(f)?f:d)(c))}catch(b){l.reject(b),a(b)}});return l.promise}}};return{defer:e,reject:f,when:function(h,m,k,l){var n=e(),p,s=function(b){try{return(L(m)?m:c)(b)}catch(d){return a(d),f(d)}},C=function(b){try{return(L(k)?k:d)(b)}catch(c){return a(c),f(c)}},y=function(b){try{return(L(l)?l:c)(b)}catch(d){a(d)}};b(function(){g(h).then(function(a){p||(p=!0,n.resolve(g(a).then(s,
C,y)))},function(a){p||(p=!0,n.resolve(C(a)))},function(a){p||n.notify(y(a))})});return n.promise},all:function(a){var b=e(),c=0,d=K(a)?[]:{};q(a,function(a,e){c++;g(a).then(function(a){d.hasOwnProperty(e)||(d[e]=a,--c||b.resolve(d))},function(a){d.hasOwnProperty(e)||b.reject(a)})});0===c&&b.resolve(d);return b.promise}}}function Bd(){var b=10,a=F("$rootScope"),c=null;this.digestTtl=function(a){arguments.length&&(b=a);return b};this.$get=["$injector","$exceptionHandler","$parse","$browser",function(d,
e,g,f){function h(){this.$id=Za();this.$$phase=this.$parent=this.$$watchers=this.$$nextSibling=this.$$prevSibling=this.$$childHead=this.$$childTail=null;this["this"]=this.$root=this;this.$$destroyed=!1;this.$$asyncQueue=[];this.$$postDigestQueue=[];this.$$listeners={};this.$$listenerCount={};this.$$isolateBindings={}}function m(b){if(p.$$phase)throw a("inprog",p.$$phase);p.$$phase=b}function k(a,b){var c=g(a);Pa(c,b);return c}function l(a,b,c){do a.$$listenerCount[c]-=b,0===a.$$listenerCount[c]&&
delete a.$$listenerCount[c];while(a=a.$parent)}function n(){}h.prototype={constructor:h,$new:function(a){a?(a=new h,a.$root=this.$root,a.$$asyncQueue=this.$$asyncQueue,a.$$postDigestQueue=this.$$postDigestQueue):(a=function(){},a.prototype=this,a=new a,a.$id=Za());a["this"]=a;a.$$listeners={};a.$$listenerCount={};a.$parent=this;a.$$watchers=a.$$nextSibling=a.$$childHead=a.$$childTail=null;a.$$prevSibling=this.$$childTail;this.$$childHead?this.$$childTail=this.$$childTail.$$nextSibling=a:this.$$childHead=
this.$$childTail=a;return a},$watch:function(a,b,d){var e=k(a,"watch"),g=this.$$watchers,f={fn:b,last:n,get:e,exp:a,eq:!!d};c=null;if(!L(b)){var h=k(b||w,"listener");f.fn=function(a,b,c){h(c)}}if("string"==typeof a&&e.constant){var m=f.fn;f.fn=function(a,b,c){m.call(this,a,b,c);Ma(g,f)}}g||(g=this.$$watchers=[]);g.unshift(f);return function(){Ma(g,f);c=null}},$watchCollection:function(a,b){var c=this,d,e,f=0,h=g(a),m=[],k={},l=0;return this.$watch(function(){e=h(c);var a,b;if(X(e))if(rb(e))for(d!==
m&&(d=m,l=d.length=0,f++),a=e.length,l!==a&&(f++,d.length=l=a),b=0;b<a;b++)d[b]!==e[b]&&(f++,d[b]=e[b]);else{d!==k&&(d=k={},l=0,f++);a=0;for(b in e)e.hasOwnProperty(b)&&(a++,d.hasOwnProperty(b)?d[b]!==e[b]&&(f++,d[b]=e[b]):(l++,d[b]=e[b],f++));if(l>a)for(b in f++,d)d.hasOwnProperty(b)&&!e.hasOwnProperty(b)&&(l--,delete d[b])}else d!==e&&(d=e,f++);return f},function(){b(e,d,c)})},$digest:function(){var d,f,g,h,k=this.$$asyncQueue,l=this.$$postDigestQueue,q,v,r=b,N,V=[],J,A,P;m("$digest");c=null;do{v=
!1;for(N=this;k.length;){try{P=k.shift(),P.scope.$eval(P.expression)}catch(B){p.$$phase=null,e(B)}c=null}a:do{if(h=N.$$watchers)for(q=h.length;q--;)try{if(d=h[q])if((f=d.get(N))!==(g=d.last)&&!(d.eq?ua(f,g):"number"==typeof f&&"number"==typeof g&&isNaN(f)&&isNaN(g)))v=!0,c=d,d.last=d.eq?aa(f):f,d.fn(f,g===n?f:g,N),5>r&&(J=4-r,V[J]||(V[J]=[]),A=L(d.exp)?"fn: "+(d.exp.name||d.exp.toString()):d.exp,A+="; newVal: "+qa(f)+"; oldVal: "+qa(g),V[J].push(A));else if(d===c){v=!1;break a}}catch(t){p.$$phase=
null,e(t)}if(!(h=N.$$childHead||N!==this&&N.$$nextSibling))for(;N!==this&&!(h=N.$$nextSibling);)N=N.$parent}while(N=h);if((v||k.length)&&!r--)throw p.$$phase=null,a("infdig",b,qa(V));}while(v||k.length);for(p.$$phase=null;l.length;)try{l.shift()()}catch(z){e(z)}},$destroy:function(){if(!this.$$destroyed){var a=this.$parent;this.$broadcast("$destroy");this.$$destroyed=!0;this!==p&&(q(this.$$listenerCount,cb(null,l,this)),a.$$childHead==this&&(a.$$childHead=this.$$nextSibling),a.$$childTail==this&&
(a.$$childTail=this.$$prevSibling),this.$$prevSibling&&(this.$$prevSibling.$$nextSibling=this.$$nextSibling),this.$$nextSibling&&(this.$$nextSibling.$$prevSibling=this.$$prevSibling),this.$parent=this.$$nextSibling=this.$$prevSibling=this.$$childHead=this.$$childTail=null)}},$eval:function(a,b){return g(a)(this,b)},$evalAsync:function(a){p.$$phase||p.$$asyncQueue.length||f.defer(function(){p.$$asyncQueue.length&&p.$digest()});this.$$asyncQueue.push({scope:this,expression:a})},$$postDigest:function(a){this.$$postDigestQueue.push(a)},
$apply:function(a){try{return m("$apply"),this.$eval(a)}catch(b){e(b)}finally{p.$$phase=null;try{p.$digest()}catch(c){throw e(c),c;}}},$on:function(a,b){var c=this.$$listeners[a];c||(this.$$listeners[a]=c=[]);c.push(b);var d=this;do d.$$listenerCount[a]||(d.$$listenerCount[a]=0),d.$$listenerCount[a]++;while(d=d.$parent);var e=this;return function(){c[bb(c,b)]=null;l(e,1,a)}},$emit:function(a,b){var c=[],d,f=this,g=!1,h={name:a,targetScope:f,stopPropagation:function(){g=!0},preventDefault:function(){h.defaultPrevented=
!0},defaultPrevented:!1},m=[h].concat(va.call(arguments,1)),k,l;do{d=f.$$listeners[a]||c;h.currentScope=f;k=0;for(l=d.length;k<l;k++)if(d[k])try{d[k].apply(null,m)}catch(p){e(p)}else d.splice(k,1),k--,l--;if(g)break;f=f.$parent}while(f);return h},$broadcast:function(a,b){for(var c=this,d=this,f={name:a,targetScope:this,preventDefault:function(){f.defaultPrevented=!0},defaultPrevented:!1},g=[f].concat(va.call(arguments,1)),h,k;c=d;){f.currentScope=c;d=c.$$listeners[a]||[];h=0;for(k=d.length;h<k;h++)if(d[h])try{d[h].apply(null,
g)}catch(m){e(m)}else d.splice(h,1),h--,k--;if(!(d=c.$$listenerCount[a]&&c.$$childHead||c!==this&&c.$$nextSibling))for(;c!==this&&!(d=c.$$nextSibling);)c=c.$parent}return f}};var p=new h;return p}]}function Cd(){var b=/^\s*(https?|ftp|mailto|tel|file):/,a=/^\s*(https?|ftp|file):|data:image\//;this.aHrefSanitizationWhitelist=function(a){return B(a)?(b=a,this):b};this.imgSrcSanitizationWhitelist=function(b){return B(b)?(a=b,this):a};this.$get=function(){return function(c,d){var e=d?a:b,g;if(!M||8<=
M)if(g=ya(c).href,""!==g&&!g.match(e))return"unsafe:"+g;return c}}}function Dd(b){if("self"===b)return b;if(D(b)){if(-1<b.indexOf("***"))throw sa("iwcard",b);b=b.replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g,"\\$1").replace(/\x08/g,"\\x08").replace("\\*\\*",".*").replace("\\*","[^:/.?&;]*");return RegExp("^"+b+"$")}if(ab(b))return RegExp("^"+b.source+"$");throw sa("imatcher");}function zc(b){var a=[];B(b)&&q(b,function(b){a.push(Dd(b))});return a}function Ed(){this.SCE_CONTEXTS=fa;var b=["self"],a=[];this.resourceUrlWhitelist=
function(a){arguments.length&&(b=zc(a));return b};this.resourceUrlBlacklist=function(b){arguments.length&&(a=zc(b));return a};this.$get=["$injector",function(c){function d(a){var b=function(a){this.$$unwrapTrustedValue=function(){return a}};a&&(b.prototype=new a);b.prototype.valueOf=function(){return this.$$unwrapTrustedValue()};b.prototype.toString=function(){return this.$$unwrapTrustedValue().toString()};return b}var e=function(a){throw sa("unsafe");};c.has("$sanitize")&&(e=c.get("$sanitize"));
var g=d(),f={};f[fa.HTML]=d(g);f[fa.CSS]=d(g);f[fa.URL]=d(g);f[fa.JS]=d(g);f[fa.RESOURCE_URL]=d(f[fa.URL]);return{trustAs:function(a,b){var c=f.hasOwnProperty(a)?f[a]:null;if(!c)throw sa("icontext",a,b);if(null===b||b===r||""===b)return b;if("string"!==typeof b)throw sa("itype",a);return new c(b)},getTrusted:function(c,d){if(null===d||d===r||""===d)return d;var g=f.hasOwnProperty(c)?f[c]:null;if(g&&d instanceof g)return d.$$unwrapTrustedValue();if(c===fa.RESOURCE_URL){var g=ya(d.toString()),l,n,p=
!1;l=0;for(n=b.length;l<n;l++)if("self"===b[l]?Gb(g):b[l].exec(g.href)){p=!0;break}if(p)for(l=0,n=a.length;l<n;l++)if("self"===a[l]?Gb(g):a[l].exec(g.href)){p=!1;break}if(p)return d;throw sa("insecurl",d.toString());}if(c===fa.HTML)return e(d);throw sa("unsafe");},valueOf:function(a){return a instanceof g?a.$$unwrapTrustedValue():a}}}]}function Fd(){var b=!0;this.enabled=function(a){arguments.length&&(b=!!a);return b};this.$get=["$parse","$sniffer","$sceDelegate",function(a,c,d){if(b&&c.msie&&8>c.msieDocumentMode)throw sa("iequirks");
var e=aa(fa);e.isEnabled=function(){return b};e.trustAs=d.trustAs;e.getTrusted=d.getTrusted;e.valueOf=d.valueOf;b||(e.trustAs=e.getTrusted=function(a,b){return b},e.valueOf=Ba);e.parseAs=function(b,c){var d=a(c);return d.literal&&d.constant?d:function(a,c){return e.getTrusted(b,d(a,c))}};var g=e.parseAs,f=e.getTrusted,h=e.trustAs;q(fa,function(a,b){var c=x(b);e[Qa("parse_as_"+c)]=function(b){return g(a,b)};e[Qa("get_trusted_"+c)]=function(b){return f(a,b)};e[Qa("trust_as_"+c)]=function(b){return h(a,
b)}});return e}]}function Gd(){this.$get=["$window","$document",function(b,a){var c={},d=S((/android (\d+)/.exec(x((b.navigator||{}).userAgent))||[])[1]),e=/Boxee/i.test((b.navigator||{}).userAgent),g=a[0]||{},f=g.documentMode,h,m=/^(Moz|webkit|O|ms)(?=[A-Z])/,k=g.body&&g.body.style,l=!1,n=!1;if(k){for(var p in k)if(l=m.exec(p)){h=l[0];h=h.substr(0,1).toUpperCase()+h.substr(1);break}h||(h="WebkitOpacity"in k&&"webkit");l=!!("transition"in k||h+"Transition"in k);n=!!("animation"in k||h+"Animation"in
k);!d||l&&n||(l=D(g.body.style.webkitTransition),n=D(g.body.style.webkitAnimation))}return{history:!(!b.history||!b.history.pushState||4>d||e),hashchange:"onhashchange"in b&&(!f||7<f),hasEvent:function(a){if("input"==a&&9==M)return!1;if(z(c[a])){var b=g.createElement("div");c[a]="on"+a in b}return c[a]},csp:Ub(),vendorPrefix:h,transitions:l,animations:n,android:d,msie:M,msieDocumentMode:f}}]}function Hd(){this.$get=["$rootScope","$browser","$q","$exceptionHandler",function(b,a,c,d){function e(e,h,
m){var k=c.defer(),l=k.promise,n=B(m)&&!m;h=a.defer(function(){try{k.resolve(e())}catch(a){k.reject(a),d(a)}finally{delete g[l.$$timeoutId]}n||b.$apply()},h);l.$$timeoutId=h;g[h]=k;return l}var g={};e.cancel=function(b){return b&&b.$$timeoutId in g?(g[b.$$timeoutId].reject("canceled"),delete g[b.$$timeoutId],a.defer.cancel(b.$$timeoutId)):!1};return e}]}function ya(b,a){var c=b;M&&(Y.setAttribute("href",c),c=Y.href);Y.setAttribute("href",c);return{href:Y.href,protocol:Y.protocol?Y.protocol.replace(/:$/,
""):"",host:Y.host,search:Y.search?Y.search.replace(/^\?/,""):"",hash:Y.hash?Y.hash.replace(/^#/,""):"",hostname:Y.hostname,port:Y.port,pathname:"/"===Y.pathname.charAt(0)?Y.pathname:"/"+Y.pathname}}function Gb(b){b=D(b)?ya(b):b;return b.protocol===Ac.protocol&&b.host===Ac.host}function Id(){this.$get=$(Z)}function Bc(b){function a(d,e){if(X(d)){var g={};q(d,function(b,c){g[c]=a(c,b)});return g}return b.factory(d+c,e)}var c="Filter";this.register=a;this.$get=["$injector",function(a){return function(b){return a.get(b+
c)}}];a("currency",Cc);a("date",Dc);a("filter",Jd);a("json",Kd);a("limitTo",Ld);a("lowercase",Md);a("number",Ec);a("orderBy",Fc);a("uppercase",Nd)}function Jd(){return function(b,a,c){if(!K(b))return b;var d=typeof c,e=[];e.check=function(a){for(var b=0;b<e.length;b++)if(!e[b](a))return!1;return!0};"function"!==d&&(c="boolean"===d&&c?function(a,b){return Ca.equals(a,b)}:function(a,b){b=(""+b).toLowerCase();return-1<(""+a).toLowerCase().indexOf(b)});var g=function(a,b){if("string"==typeof b&&"!"===
b.charAt(0))return!g(a,b.substr(1));switch(typeof a){case "boolean":case "number":case "string":return c(a,b);case "object":switch(typeof b){case "object":return c(a,b);default:for(var d in a)if("$"!==d.charAt(0)&&g(a[d],b))return!0}return!1;case "array":for(d=0;d<a.length;d++)if(g(a[d],b))return!0;return!1;default:return!1}};switch(typeof a){case "boolean":case "number":case "string":a={$:a};case "object":for(var f in a)(function(b){"undefined"!=typeof a[b]&&e.push(function(c){return g("$"==b?c:
vb(c,b),a[b])})})(f);break;case "function":e.push(a);break;default:return b}d=[];for(f=0;f<b.length;f++){var h=b[f];e.check(h)&&d.push(h)}return d}}function Cc(b){var a=b.NUMBER_FORMATS;return function(b,d){z(d)&&(d=a.CURRENCY_SYM);return Gc(b,a.PATTERNS[1],a.GROUP_SEP,a.DECIMAL_SEP,2).replace(/\u00A4/g,d)}}function Ec(b){var a=b.NUMBER_FORMATS;return function(b,d){return Gc(b,a.PATTERNS[0],a.GROUP_SEP,a.DECIMAL_SEP,d)}}function Gc(b,a,c,d,e){if(isNaN(b)||!isFinite(b))return"";var g=0>b;b=Math.abs(b);
var f=b+"",h="",m=[],k=!1;if(-1!==f.indexOf("e")){var l=f.match(/([\d\.]+)e(-?)(\d+)/);l&&"-"==l[2]&&l[3]>e+1?f="0":(h=f,k=!0)}if(k)0<e&&(-1<b&&1>b)&&(h=b.toFixed(e));else{f=(f.split(Hc)[1]||"").length;z(e)&&(e=Math.min(Math.max(a.minFrac,f),a.maxFrac));f=Math.pow(10,e);b=Math.round(b*f)/f;b=(""+b).split(Hc);f=b[0];b=b[1]||"";var l=0,n=a.lgSize,p=a.gSize;if(f.length>=n+p)for(l=f.length-n,k=0;k<l;k++)0===(l-k)%p&&0!==k&&(h+=c),h+=f.charAt(k);for(k=l;k<f.length;k++)0===(f.length-k)%n&&0!==k&&(h+=c),
h+=f.charAt(k);for(;b.length<e;)b+="0";e&&"0"!==e&&(h+=d+b.substr(0,e))}m.push(g?a.negPre:a.posPre);m.push(h);m.push(g?a.negSuf:a.posSuf);return m.join("")}function Mb(b,a,c){var d="";0>b&&(d="-",b=-b);for(b=""+b;b.length<a;)b="0"+b;c&&(b=b.substr(b.length-a));return d+b}function W(b,a,c,d){c=c||0;return function(e){e=e["get"+b]();if(0<c||e>-c)e+=c;0===e&&-12==c&&(e=12);return Mb(e,a,d)}}function lb(b,a){return function(c,d){var e=c["get"+b](),g=Ia(a?"SHORT"+b:b);return d[g][e]}}function Dc(b){function a(a){var b;
if(b=a.match(c)){a=new Date(0);var g=0,f=0,h=b[8]?a.setUTCFullYear:a.setFullYear,m=b[8]?a.setUTCHours:a.setHours;b[9]&&(g=S(b[9]+b[10]),f=S(b[9]+b[11]));h.call(a,S(b[1]),S(b[2])-1,S(b[3]));g=S(b[4]||0)-g;f=S(b[5]||0)-f;h=S(b[6]||0);b=Math.round(1E3*parseFloat("0."+(b[7]||0)));m.call(a,g,f,h,b)}return a}var c=/^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;return function(c,e){var g="",f=[],h,m;e=e||"mediumDate";e=b.DATETIME_FORMATS[e]||e;D(c)&&
(c=Od.test(c)?S(c):a(c));sb(c)&&(c=new Date(c));if(!La(c))return c;for(;e;)(m=Pd.exec(e))?(f=f.concat(va.call(m,1)),e=f.pop()):(f.push(e),e=null);q(f,function(a){h=Qd[a];g+=h?h(c,b.DATETIME_FORMATS):a.replace(/(^'|'$)/g,"").replace(/''/g,"'")});return g}}function Kd(){return function(b){return qa(b,!0)}}function Ld(){return function(b,a){if(!K(b)&&!D(b))return b;a=S(a);if(D(b))return a?0<=a?b.slice(0,a):b.slice(a,b.length):"";var c=[],d,e;a>b.length?a=b.length:a<-b.length&&(a=-b.length);0<a?(d=0,
e=a):(d=b.length+a,e=b.length);for(;d<e;d++)c.push(b[d]);return c}}function Fc(b){return function(a,c,d){function e(a,b){return Oa(b)?function(b,c){return a(c,b)}:a}if(!K(a)||!c)return a;c=K(c)?c:[c];c=Rc(c,function(a){var c=!1,d=a||Ba;if(D(a)){if("+"==a.charAt(0)||"-"==a.charAt(0))c="-"==a.charAt(0),a=a.substring(1);d=b(a)}return e(function(a,b){var c;c=d(a);var e=d(b),g=typeof c,f=typeof e;g==f?("string"==g&&(c=c.toLowerCase(),e=e.toLowerCase()),c=c===e?0:c<e?-1:1):c=g<f?-1:1;return c},c)});for(var g=
[],f=0;f<a.length;f++)g.push(a[f]);return g.sort(e(function(a,b){for(var d=0;d<c.length;d++){var e=c[d](a,b);if(0!==e)return e}return 0},d))}}function ta(b){L(b)&&(b={link:b});b.restrict=b.restrict||"AC";return $(b)}function Ic(b,a){function c(a,c){c=c?"-"+db(c,"-"):"";b.removeClass((a?mb:nb)+c).addClass((a?nb:mb)+c)}var d=this,e=b.parent().controller("form")||ob,g=0,f=d.$error={},h=[];d.$name=a.name||a.ngForm;d.$dirty=!1;d.$pristine=!0;d.$valid=!0;d.$invalid=!1;e.$addControl(d);b.addClass(Ja);c(!0);
d.$addControl=function(a){xa(a.$name,"input");h.push(a);a.$name&&(d[a.$name]=a)};d.$removeControl=function(a){a.$name&&d[a.$name]===a&&delete d[a.$name];q(f,function(b,c){d.$setValidity(c,!0,a)});Ma(h,a)};d.$setValidity=function(a,b,h){var n=f[a];if(b)n&&(Ma(n,h),n.length||(g--,g||(c(b),d.$valid=!0,d.$invalid=!1),f[a]=!1,c(!0,a),e.$setValidity(a,!0,d)));else{g||c(b);if(n){if(-1!=bb(n,h))return}else f[a]=n=[],g++,c(!1,a),e.$setValidity(a,!1,d);n.push(h);d.$valid=!1;d.$invalid=!0}};d.$setDirty=function(){b.removeClass(Ja).addClass(pb);
d.$dirty=!0;d.$pristine=!1;e.$setDirty()};d.$setPristine=function(){b.removeClass(pb).addClass(Ja);d.$dirty=!1;d.$pristine=!0;q(h,function(a){a.$setPristine()})}}function pa(b,a,c,d){b.$setValidity(a,c);return c?d:r}function qb(b,a,c,d,e,g){if(!e.android){var f=!1;a.on("compositionstart",function(a){f=!0});a.on("compositionend",function(){f=!1})}var h=function(){if(!f){var e=a.val();Oa(c.ngTrim||"T")&&(e=ba(e));d.$viewValue!==e&&(b.$$phase?d.$setViewValue(e):b.$apply(function(){d.$setViewValue(e)}))}};
if(e.hasEvent("input"))a.on("input",h);else{var m,k=function(){m||(m=g.defer(function(){h();m=null}))};a.on("keydown",function(a){a=a.keyCode;91===a||(15<a&&19>a||37<=a&&40>=a)||k()});if(e.hasEvent("paste"))a.on("paste cut",k)}a.on("change",h);d.$render=function(){a.val(d.$isEmpty(d.$viewValue)?"":d.$viewValue)};var l=c.ngPattern;l&&((e=l.match(/^\/(.*)\/([gim]*)$/))?(l=RegExp(e[1],e[2]),e=function(a){return pa(d,"pattern",d.$isEmpty(a)||l.test(a),a)}):e=function(c){var e=b.$eval(l);if(!e||!e.test)throw F("ngPattern")("noregexp",
l,e,ga(a));return pa(d,"pattern",d.$isEmpty(c)||e.test(c),c)},d.$formatters.push(e),d.$parsers.push(e));if(c.ngMinlength){var n=S(c.ngMinlength);e=function(a){return pa(d,"minlength",d.$isEmpty(a)||a.length>=n,a)};d.$parsers.push(e);d.$formatters.push(e)}if(c.ngMaxlength){var p=S(c.ngMaxlength);e=function(a){return pa(d,"maxlength",d.$isEmpty(a)||a.length<=p,a)};d.$parsers.push(e);d.$formatters.push(e)}}function Nb(b,a){b="ngClass"+b;return function(){return{restrict:"AC",link:function(c,d,e){function g(b){if(!0===
a||c.$index%2===a){var d=f(b||"");h?ua(b,h)||e.$updateClass(d,f(h)):e.$addClass(d)}h=aa(b)}function f(a){if(K(a))return a.join(" ");if(X(a)){var b=[];q(a,function(a,c){a&&b.push(c)});return b.join(" ")}return a}var h;c.$watch(e[b],g,!0);e.$observe("class",function(a){g(c.$eval(e[b]))});"ngClass"!==b&&c.$watch("$index",function(d,g){var h=d&1;if(h!==g&1){var n=f(c.$eval(e[b]));h===a?e.$addClass(n):e.$removeClass(n)}})}}}}var x=function(b){return D(b)?b.toLowerCase():b},Ia=function(b){return D(b)?b.toUpperCase():
b},M,A,Da,va=[].slice,Rd=[].push,$a=Object.prototype.toString,Na=F("ng"),Ca=Z.angular||(Z.angular={}),Ua,Ha,ka=["0","0","0"];M=S((/msie (\d+)/.exec(x(navigator.userAgent))||[])[1]);isNaN(M)&&(M=S((/trident\/.*; rv:(\d+)/.exec(x(navigator.userAgent))||[])[1]));w.$inject=[];Ba.$inject=[];var ba=function(){return String.prototype.trim?function(b){return D(b)?b.trim():b}:function(b){return D(b)?b.replace(/^\s\s*/,"").replace(/\s\s*$/,""):b}}();Ha=9>M?function(b){b=b.nodeName?b:b[0];return b.scopeName&&
"HTML"!=b.scopeName?Ia(b.scopeName+":"+b.nodeName):b.nodeName}:function(b){return b.nodeName?b.nodeName:b[0].nodeName};var Uc=/[A-Z]/g,Sd={full:"1.2.9",major:1,minor:2,dot:9,codeName:"enchanted-articulacy"},Ra=O.cache={},eb=O.expando="ng-"+(new Date).getTime(),Yc=1,Jc=Z.document.addEventListener?function(b,a,c){b.addEventListener(a,c,!1)}:function(b,a,c){b.attachEvent("on"+a,c)},Bb=Z.document.removeEventListener?function(b,a,c){b.removeEventListener(a,c,!1)}:function(b,a,c){b.detachEvent("on"+a,c)},
Wc=/([\:\-\_]+(.))/g,Xc=/^moz([A-Z])/,yb=F("jqLite"),Ga=O.prototype={ready:function(b){function a(){c||(c=!0,b())}var c=!1;"complete"===Q.readyState?setTimeout(a):(this.on("DOMContentLoaded",a),O(Z).on("load",a))},toString:function(){var b=[];q(this,function(a){b.push(""+a)});return"["+b.join(", ")+"]"},eq:function(b){return 0<=b?A(this[b]):A(this[this.length+b])},length:0,push:Rd,sort:[].sort,splice:[].splice},gb={};q("multiple selected checked disabled readOnly required open".split(" "),function(b){gb[x(b)]=
b});var gc={};q("input select option textarea button form details".split(" "),function(b){gc[Ia(b)]=!0});q({data:cc,inheritedData:fb,scope:function(b){return A(b).data("$scope")||fb(b.parentNode||b,["$isolateScope","$scope"])},isolateScope:function(b){return A(b).data("$isolateScope")||A(b).data("$isolateScopeNoTemplate")},controller:dc,injector:function(b){return fb(b,"$injector")},removeAttr:function(b,a){b.removeAttribute(a)},hasClass:Cb,css:function(b,a,c){a=Qa(a);if(B(c))b.style[a]=c;else{var d;
8>=M&&(d=b.currentStyle&&b.currentStyle[a],""===d&&(d="auto"));d=d||b.style[a];8>=M&&(d=""===d?r:d);return d}},attr:function(b,a,c){var d=x(a);if(gb[d])if(B(c))c?(b[a]=!0,b.setAttribute(a,d)):(b[a]=!1,b.removeAttribute(d));else return b[a]||(b.attributes.getNamedItem(a)||w).specified?d:r;else if(B(c))b.setAttribute(a,c);else if(b.getAttribute)return b=b.getAttribute(a,2),null===b?r:b},prop:function(b,a,c){if(B(c))b[a]=c;else return b[a]},text:function(){function b(b,d){var e=a[b.nodeType];if(z(d))return e?
b[e]:"";b[e]=d}var a=[];9>M?(a[1]="innerText",a[3]="nodeValue"):a[1]=a[3]="textContent";b.$dv="";return b}(),val:function(b,a){if(z(a)){if("SELECT"===Ha(b)&&b.multiple){var c=[];q(b.options,function(a){a.selected&&c.push(a.value||a.text)});return 0===c.length?null:c}return b.value}b.value=a},html:function(b,a){if(z(a))return b.innerHTML;for(var c=0,d=b.childNodes;c<d.length;c++)Ea(d[c]);b.innerHTML=a},empty:ec},function(b,a){O.prototype[a]=function(a,d){var e,g;if(b!==ec&&(2==b.length&&b!==Cb&&b!==
dc?a:d)===r){if(X(a)){for(e=0;e<this.length;e++)if(b===cc)b(this[e],a);else for(g in a)b(this[e],g,a[g]);return this}e=b.$dv;g=e===r?Math.min(this.length,1):this.length;for(var f=0;f<g;f++){var h=b(this[f],a,d);e=e?e+h:h}return e}for(e=0;e<this.length;e++)b(this[e],a,d);return this}});q({removeData:ac,dealoc:Ea,on:function a(c,d,e,g){if(B(g))throw yb("onargs");var f=la(c,"events"),h=la(c,"handle");f||la(c,"events",f={});h||la(c,"handle",h=Zc(c,f));q(d.split(" "),function(d){var g=f[d];if(!g){if("mouseenter"==
d||"mouseleave"==d){var l=Q.body.contains||Q.body.compareDocumentPosition?function(a,c){var d=9===a.nodeType?a.documentElement:a,e=c&&c.parentNode;return a===e||!!(e&&1===e.nodeType&&(d.contains?d.contains(e):a.compareDocumentPosition&&a.compareDocumentPosition(e)&16))}:function(a,c){if(c)for(;c=c.parentNode;)if(c===a)return!0;return!1};f[d]=[];a(c,{mouseleave:"mouseout",mouseenter:"mouseover"}[d],function(a){var c=a.relatedTarget;c&&(c===this||l(this,c))||h(a,d)})}else Jc(c,d,h),f[d]=[];g=f[d]}g.push(e)})},
off:bc,one:function(a,c,d){a=A(a);a.on(c,function g(){a.off(c,d);a.off(c,g)});a.on(c,d)},replaceWith:function(a,c){var d,e=a.parentNode;Ea(a);q(new O(c),function(c){d?e.insertBefore(c,d.nextSibling):e.replaceChild(c,a);d=c})},children:function(a){var c=[];q(a.childNodes,function(a){1===a.nodeType&&c.push(a)});return c},contents:function(a){return a.childNodes||[]},append:function(a,c){q(new O(c),function(c){1!==a.nodeType&&11!==a.nodeType||a.appendChild(c)})},prepend:function(a,c){if(1===a.nodeType){var d=
a.firstChild;q(new O(c),function(c){a.insertBefore(c,d)})}},wrap:function(a,c){c=A(c)[0];var d=a.parentNode;d&&d.replaceChild(c,a);c.appendChild(a)},remove:function(a){Ea(a);var c=a.parentNode;c&&c.removeChild(a)},after:function(a,c){var d=a,e=a.parentNode;q(new O(c),function(a){e.insertBefore(a,d.nextSibling);d=a})},addClass:Eb,removeClass:Db,toggleClass:function(a,c,d){z(d)&&(d=!Cb(a,c));(d?Eb:Db)(a,c)},parent:function(a){return(a=a.parentNode)&&11!==a.nodeType?a:null},next:function(a){if(a.nextElementSibling)return a.nextElementSibling;
for(a=a.nextSibling;null!=a&&1!==a.nodeType;)a=a.nextSibling;return a},find:function(a,c){return a.getElementsByTagName?a.getElementsByTagName(c):[]},clone:Ab,triggerHandler:function(a,c,d){c=(la(a,"events")||{})[c];d=d||[];var e=[{preventDefault:w,stopPropagation:w}];q(c,function(c){c.apply(a,e.concat(d))})}},function(a,c){O.prototype[c]=function(c,e,g){for(var f,h=0;h<this.length;h++)z(f)?(f=a(this[h],c,e,g),B(f)&&(f=A(f))):zb(f,a(this[h],c,e,g));return B(f)?f:this};O.prototype.bind=O.prototype.on;
O.prototype.unbind=O.prototype.off});Sa.prototype={put:function(a,c){this[Fa(a)]=c},get:function(a){return this[Fa(a)]},remove:function(a){var c=this[a=Fa(a)];delete this[a];return c}};var ad=/^function\s*[^\(]*\(\s*([^\)]*)\)/m,bd=/,/,cd=/^\s*(_?)(\S+?)\1\s*$/,$c=/((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg,Ta=F("$injector"),Td=F("$animate"),Ud=["$provide",function(a){this.$$selectors={};this.register=function(c,d){var e=c+"-animation";if(c&&"."!=c.charAt(0))throw Td("notcsel",c);this.$$selectors[c.substr(1)]=
e;a.factory(e,d)};this.classNameFilter=function(a){1===arguments.length&&(this.$$classNameFilter=a instanceof RegExp?a:null);return this.$$classNameFilter};this.$get=["$timeout",function(a){return{enter:function(d,e,g,f){g?g.after(d):(e&&e[0]||(e=g.parent()),e.append(d));f&&a(f,0,!1)},leave:function(d,e){d.remove();e&&a(e,0,!1)},move:function(a,c,g,f){this.enter(a,c,g,f)},addClass:function(d,e,g){e=D(e)?e:K(e)?e.join(" "):"";q(d,function(a){Eb(a,e)});g&&a(g,0,!1)},removeClass:function(d,e,g){e=D(e)?
e:K(e)?e.join(" "):"";q(d,function(a){Db(a,e)});g&&a(g,0,!1)},enabled:w}}]}],ja=F("$compile");jc.$inject=["$provide","$$sanitizeUriProvider"];var id=/^(x[\:\-_]|data[\:\-_])/i,pc=F("$interpolate"),Vd=/^([^\?#]*)(\?([^#]*))?(#(.*))?$/,td={http:80,https:443,ftp:21},Ib=F("$location");uc.prototype=Jb.prototype=tc.prototype={$$html5:!1,$$replace:!1,absUrl:jb("$$absUrl"),url:function(a,c){if(z(a))return this.$$url;var d=Vd.exec(a);d[1]&&this.path(decodeURIComponent(d[1]));(d[2]||d[1])&&this.search(d[3]||
"");this.hash(d[5]||"",c);return this},protocol:jb("$$protocol"),host:jb("$$host"),port:jb("$$port"),path:vc("$$path",function(a){return"/"==a.charAt(0)?a:"/"+a}),search:function(a,c){switch(arguments.length){case 0:return this.$$search;case 1:if(D(a))this.$$search=Xb(a);else if(X(a))this.$$search=a;else throw Ib("isrcharg");break;default:z(c)||null===c?delete this.$$search[a]:this.$$search[a]=c}this.$$compose();return this},hash:vc("$$hash",Ba),replace:function(){this.$$replace=!0;return this}};
var za=F("$parse"),yc={},ra,Ka={"null":function(){return null},"true":function(){return!0},"false":function(){return!1},undefined:w,"+":function(a,c,d,e){d=d(a,c);e=e(a,c);return B(d)?B(e)?d+e:d:B(e)?e:r},"-":function(a,c,d,e){d=d(a,c);e=e(a,c);return(B(d)?d:0)-(B(e)?e:0)},"*":function(a,c,d,e){return d(a,c)*e(a,c)},"/":function(a,c,d,e){return d(a,c)/e(a,c)},"%":function(a,c,d,e){return d(a,c)%e(a,c)},"^":function(a,c,d,e){return d(a,c)^e(a,c)},"=":w,"===":function(a,c,d,e){return d(a,c)===e(a,c)},
"!==":function(a,c,d,e){return d(a,c)!==e(a,c)},"==":function(a,c,d,e){return d(a,c)==e(a,c)},"!=":function(a,c,d,e){return d(a,c)!=e(a,c)},"<":function(a,c,d,e){return d(a,c)<e(a,c)},">":function(a,c,d,e){return d(a,c)>e(a,c)},"<=":function(a,c,d,e){return d(a,c)<=e(a,c)},">=":function(a,c,d,e){return d(a,c)>=e(a,c)},"&&":function(a,c,d,e){return d(a,c)&&e(a,c)},"||":function(a,c,d,e){return d(a,c)||e(a,c)},"&":function(a,c,d,e){return d(a,c)&e(a,c)},"|":function(a,c,d,e){return e(a,c)(a,c,d(a,c))},
"!":function(a,c,d){return!d(a,c)}},Wd={n:"\n",f:"\f",r:"\r",t:"\t",v:"\v","'":"'",'"':'"'},Lb=function(a){this.options=a};Lb.prototype={constructor:Lb,lex:function(a){this.text=a;this.index=0;this.ch=r;this.lastCh=":";this.tokens=[];var c;for(a=[];this.index<this.text.length;){this.ch=this.text.charAt(this.index);if(this.is("\"'"))this.readString(this.ch);else if(this.isNumber(this.ch)||this.is(".")&&this.isNumber(this.peek()))this.readNumber();else if(this.isIdent(this.ch))this.readIdent(),this.was("{,")&&
("{"===a[0]&&(c=this.tokens[this.tokens.length-1]))&&(c.json=-1===c.text.indexOf("."));else if(this.is("(){}[].,;:?"))this.tokens.push({index:this.index,text:this.ch,json:this.was(":[,")&&this.is("{[")||this.is("}]:,")}),this.is("{[")&&a.unshift(this.ch),this.is("}]")&&a.shift(),this.index++;else if(this.isWhitespace(this.ch)){this.index++;continue}else{var d=this.ch+this.peek(),e=d+this.peek(2),g=Ka[this.ch],f=Ka[d],h=Ka[e];h?(this.tokens.push({index:this.index,text:e,fn:h}),this.index+=3):f?(this.tokens.push({index:this.index,
text:d,fn:f}),this.index+=2):g?(this.tokens.push({index:this.index,text:this.ch,fn:g,json:this.was("[,:")&&this.is("+-")}),this.index+=1):this.throwError("Unexpected next character ",this.index,this.index+1)}this.lastCh=this.ch}return this.tokens},is:function(a){return-1!==a.indexOf(this.ch)},was:function(a){return-1!==a.indexOf(this.lastCh)},peek:function(a){a=a||1;return this.index+a<this.text.length?this.text.charAt(this.index+a):!1},isNumber:function(a){return"0"<=a&&"9">=a},isWhitespace:function(a){return" "===
a||"\r"===a||"\t"===a||"\n"===a||"\v"===a||"\u00a0"===a},isIdent:function(a){return"a"<=a&&"z">=a||"A"<=a&&"Z">=a||"_"===a||"$"===a},isExpOperator:function(a){return"-"===a||"+"===a||this.isNumber(a)},throwError:function(a,c,d){d=d||this.index;c=B(c)?"s "+c+"-"+this.index+" ["+this.text.substring(c,d)+"]":" "+d;throw za("lexerr",a,c,this.text);},readNumber:function(){for(var a="",c=this.index;this.index<this.text.length;){var d=x(this.text.charAt(this.index));if("."==d||this.isNumber(d))a+=d;else{var e=
this.peek();if("e"==d&&this.isExpOperator(e))a+=d;else if(this.isExpOperator(d)&&e&&this.isNumber(e)&&"e"==a.charAt(a.length-1))a+=d;else if(!this.isExpOperator(d)||e&&this.isNumber(e)||"e"!=a.charAt(a.length-1))break;else this.throwError("Invalid exponent")}this.index++}a*=1;this.tokens.push({index:c,text:a,json:!0,fn:function(){return a}})},readIdent:function(){for(var a=this,c="",d=this.index,e,g,f,h;this.index<this.text.length;){h=this.text.charAt(this.index);if("."===h||this.isIdent(h)||this.isNumber(h))"."===
h&&(e=this.index),c+=h;else break;this.index++}if(e)for(g=this.index;g<this.text.length;){h=this.text.charAt(g);if("("===h){f=c.substr(e-d+1);c=c.substr(0,e-d);this.index=g;break}if(this.isWhitespace(h))g++;else break}d={index:d,text:c};if(Ka.hasOwnProperty(c))d.fn=Ka[c],d.json=Ka[c];else{var m=xc(c,this.options,this.text);d.fn=t(function(a,c){return m(a,c)},{assign:function(d,e){return kb(d,c,e,a.text,a.options)}})}this.tokens.push(d);f&&(this.tokens.push({index:e,text:".",json:!1}),this.tokens.push({index:e+
1,text:f,json:!1}))},readString:function(a){var c=this.index;this.index++;for(var d="",e=a,g=!1;this.index<this.text.length;){var f=this.text.charAt(this.index),e=e+f;if(g)"u"===f?(f=this.text.substring(this.index+1,this.index+5),f.match(/[\da-f]{4}/i)||this.throwError("Invalid unicode escape [\\u"+f+"]"),this.index+=4,d+=String.fromCharCode(parseInt(f,16))):d=(g=Wd[f])?d+g:d+f,g=!1;else if("\\"===f)g=!0;else{if(f===a){this.index++;this.tokens.push({index:c,text:e,string:d,json:!0,fn:function(){return d}});
return}d+=f}this.index++}this.throwError("Unterminated quote",c)}};var Ya=function(a,c,d){this.lexer=a;this.$filter=c;this.options=d};Ya.ZERO=function(){return 0};Ya.prototype={constructor:Ya,parse:function(a,c){this.text=a;this.json=c;this.tokens=this.lexer.lex(a);c&&(this.assignment=this.logicalOR,this.functionCall=this.fieldAccess=this.objectIndex=this.filterChain=function(){this.throwError("is not valid json",{text:a,index:0})});var d=c?this.primary():this.statements();0!==this.tokens.length&&
this.throwError("is an unexpected token",this.tokens[0]);d.literal=!!d.literal;d.constant=!!d.constant;return d},primary:function(){var a;if(this.expect("("))a=this.filterChain(),this.consume(")");else if(this.expect("["))a=this.arrayDeclaration();else if(this.expect("{"))a=this.object();else{var c=this.expect();(a=c.fn)||this.throwError("not a primary expression",c);c.json&&(a.constant=!0,a.literal=!0)}for(var d;c=this.expect("(","[",".");)"("===c.text?(a=this.functionCall(a,d),d=null):"["===c.text?
(d=a,a=this.objectIndex(a)):"."===c.text?(d=a,a=this.fieldAccess(a)):this.throwError("IMPOSSIBLE");return a},throwError:function(a,c){throw za("syntax",c.text,a,c.index+1,this.text,this.text.substring(c.index));},peekToken:function(){if(0===this.tokens.length)throw za("ueoe",this.text);return this.tokens[0]},peek:function(a,c,d,e){if(0<this.tokens.length){var g=this.tokens[0],f=g.text;if(f===a||f===c||f===d||f===e||!(a||c||d||e))return g}return!1},expect:function(a,c,d,e){return(a=this.peek(a,c,d,
e))?(this.json&&!a.json&&this.throwError("is not valid json",a),this.tokens.shift(),a):!1},consume:function(a){this.expect(a)||this.throwError("is unexpected, expecting ["+a+"]",this.peek())},unaryFn:function(a,c){return t(function(d,e){return a(d,e,c)},{constant:c.constant})},ternaryFn:function(a,c,d){return t(function(e,g){return a(e,g)?c(e,g):d(e,g)},{constant:a.constant&&c.constant&&d.constant})},binaryFn:function(a,c,d){return t(function(e,g){return c(e,g,a,d)},{constant:a.constant&&d.constant})},
statements:function(){for(var a=[];;)if(0<this.tokens.length&&!this.peek("}",")",";","]")&&a.push(this.filterChain()),!this.expect(";"))return 1===a.length?a[0]:function(c,d){for(var e,g=0;g<a.length;g++){var f=a[g];f&&(e=f(c,d))}return e}},filterChain:function(){for(var a=this.expression(),c;;)if(c=this.expect("|"))a=this.binaryFn(a,c.fn,this.filter());else return a},filter:function(){for(var a=this.expect(),c=this.$filter(a.text),d=[];;)if(a=this.expect(":"))d.push(this.expression());else{var e=
function(a,e,h){h=[h];for(var m=0;m<d.length;m++)h.push(d[m](a,e));return c.apply(a,h)};return function(){return e}}},expression:function(){return this.assignment()},assignment:function(){var a=this.ternary(),c,d;return(d=this.expect("="))?(a.assign||this.throwError("implies assignment but ["+this.text.substring(0,d.index)+"] can not be assigned to",d),c=this.ternary(),function(d,g){return a.assign(d,c(d,g),g)}):a},ternary:function(){var a=this.logicalOR(),c,d;if(this.expect("?")){c=this.ternary();
if(d=this.expect(":"))return this.ternaryFn(a,c,this.ternary());this.throwError("expected :",d)}else return a},logicalOR:function(){for(var a=this.logicalAND(),c;;)if(c=this.expect("||"))a=this.binaryFn(a,c.fn,this.logicalAND());else return a},logicalAND:function(){var a=this.equality(),c;if(c=this.expect("&&"))a=this.binaryFn(a,c.fn,this.logicalAND());return a},equality:function(){var a=this.relational(),c;if(c=this.expect("==","!=","===","!=="))a=this.binaryFn(a,c.fn,this.equality());return a},
relational:function(){var a=this.additive(),c;if(c=this.expect("<",">","<=",">="))a=this.binaryFn(a,c.fn,this.relational());return a},additive:function(){for(var a=this.multiplicative(),c;c=this.expect("+","-");)a=this.binaryFn(a,c.fn,this.multiplicative());return a},multiplicative:function(){for(var a=this.unary(),c;c=this.expect("*","/","%");)a=this.binaryFn(a,c.fn,this.unary());return a},unary:function(){var a;return this.expect("+")?this.primary():(a=this.expect("-"))?this.binaryFn(Ya.ZERO,a.fn,
this.unary()):(a=this.expect("!"))?this.unaryFn(a.fn,this.unary()):this.primary()},fieldAccess:function(a){var c=this,d=this.expect().text,e=xc(d,this.options,this.text);return t(function(c,d,h){return e(h||a(c,d),d)},{assign:function(e,f,h){return kb(a(e,h),d,f,c.text,c.options)}})},objectIndex:function(a){var c=this,d=this.expression();this.consume("]");return t(function(e,g){var f=a(e,g),h=d(e,g),m;if(!f)return r;(f=Xa(f[h],c.text))&&(f.then&&c.options.unwrapPromises)&&(m=f,"$$v"in f||(m.$$v=r,
m.then(function(a){m.$$v=a})),f=f.$$v);return f},{assign:function(e,g,f){var h=d(e,f);return Xa(a(e,f),c.text)[h]=g}})},functionCall:function(a,c){var d=[];if(")"!==this.peekToken().text){do d.push(this.expression());while(this.expect(","))}this.consume(")");var e=this;return function(g,f){for(var h=[],m=c?c(g,f):g,k=0;k<d.length;k++)h.push(d[k](g,f));k=a(g,f,m)||w;Xa(m,e.text);Xa(k,e.text);h=k.apply?k.apply(m,h):k(h[0],h[1],h[2],h[3],h[4]);return Xa(h,e.text)}},arrayDeclaration:function(){var a=
[],c=!0;if("]"!==this.peekToken().text){do{var d=this.expression();a.push(d);d.constant||(c=!1)}while(this.expect(","))}this.consume("]");return t(function(c,d){for(var f=[],h=0;h<a.length;h++)f.push(a[h](c,d));return f},{literal:!0,constant:c})},object:function(){var a=[],c=!0;if("}"!==this.peekToken().text){do{var d=this.expect(),d=d.string||d.text;this.consume(":");var e=this.expression();a.push({key:d,value:e});e.constant||(c=!1)}while(this.expect(","))}this.consume("}");return t(function(c,d){for(var e=
{},m=0;m<a.length;m++){var k=a[m];e[k.key]=k.value(c,d)}return e},{literal:!0,constant:c})}};var Kb={},sa=F("$sce"),fa={HTML:"html",CSS:"css",URL:"url",RESOURCE_URL:"resourceUrl",JS:"js"},Y=Q.createElement("a"),Ac=ya(Z.location.href,!0);Bc.$inject=["$provide"];Cc.$inject=["$locale"];Ec.$inject=["$locale"];var Hc=".",Qd={yyyy:W("FullYear",4),yy:W("FullYear",2,0,!0),y:W("FullYear",1),MMMM:lb("Month"),MMM:lb("Month",!0),MM:W("Month",2,1),M:W("Month",1,1),dd:W("Date",2),d:W("Date",1),HH:W("Hours",2),
H:W("Hours",1),hh:W("Hours",2,-12),h:W("Hours",1,-12),mm:W("Minutes",2),m:W("Minutes",1),ss:W("Seconds",2),s:W("Seconds",1),sss:W("Milliseconds",3),EEEE:lb("Day"),EEE:lb("Day",!0),a:function(a,c){return 12>a.getHours()?c.AMPMS[0]:c.AMPMS[1]},Z:function(a){a=-1*a.getTimezoneOffset();return a=(0<=a?"+":"")+(Mb(Math[0<a?"floor":"ceil"](a/60),2)+Mb(Math.abs(a%60),2))}},Pd=/((?:[^yMdHhmsaZE']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|d+|H+|h+|m+|s+|a|Z))(.*)/,Od=/^\-?\d+$/;Dc.$inject=["$locale"];var Md=$(x),Nd=
$(Ia);Fc.$inject=["$parse"];var Xd=$({restrict:"E",compile:function(a,c){8>=M&&(c.href||c.name||c.$set("href",""),a.append(Q.createComment("IE fix")));if(!c.href&&!c.name)return function(a,c){c.on("click",function(a){c.attr("href")||a.preventDefault()})}}}),Ob={};q(gb,function(a,c){if("multiple"!=a){var d=ma("ng-"+c);Ob[d]=function(){return{priority:100,link:function(a,g,f){a.$watch(f[d],function(a){f.$set(c,!!a)})}}}}});q(["src","srcset","href"],function(a){var c=ma("ng-"+a);Ob[c]=function(){return{priority:99,
link:function(d,e,g){g.$observe(c,function(c){c&&(g.$set(a,c),M&&e.prop(a,g[a]))})}}}});var ob={$addControl:w,$removeControl:w,$setValidity:w,$setDirty:w,$setPristine:w};Ic.$inject=["$element","$attrs","$scope"];var Kc=function(a){return["$timeout",function(c){return{name:"form",restrict:a?"EAC":"E",controller:Ic,compile:function(){return{pre:function(a,e,g,f){if(!g.action){var h=function(a){a.preventDefault?a.preventDefault():a.returnValue=!1};Jc(e[0],"submit",h);e.on("$destroy",function(){c(function(){Bb(e[0],
"submit",h)},0,!1)})}var m=e.parent().controller("form"),k=g.name||g.ngForm;k&&kb(a,k,f,k);if(m)e.on("$destroy",function(){m.$removeControl(f);k&&kb(a,k,r,k);t(f,ob)})}}}}}]},Yd=Kc(),Zd=Kc(!0),$d=/^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/,ae=/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/,be=/^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/,Lc={text:qb,number:function(a,c,d,e,g,f){qb(a,c,d,e,g,f);e.$parsers.push(function(a){var c=e.$isEmpty(a);if(c||be.test(a))return e.$setValidity("number",
!0),""===a?null:c?a:parseFloat(a);e.$setValidity("number",!1);return r});e.$formatters.push(function(a){return e.$isEmpty(a)?"":""+a});d.min&&(a=function(a){var c=parseFloat(d.min);return pa(e,"min",e.$isEmpty(a)||a>=c,a)},e.$parsers.push(a),e.$formatters.push(a));d.max&&(a=function(a){var c=parseFloat(d.max);return pa(e,"max",e.$isEmpty(a)||a<=c,a)},e.$parsers.push(a),e.$formatters.push(a));e.$formatters.push(function(a){return pa(e,"number",e.$isEmpty(a)||sb(a),a)})},url:function(a,c,d,e,g,f){qb(a,
c,d,e,g,f);a=function(a){return pa(e,"url",e.$isEmpty(a)||$d.test(a),a)};e.$formatters.push(a);e.$parsers.push(a)},email:function(a,c,d,e,g,f){qb(a,c,d,e,g,f);a=function(a){return pa(e,"email",e.$isEmpty(a)||ae.test(a),a)};e.$formatters.push(a);e.$parsers.push(a)},radio:function(a,c,d,e){z(d.name)&&c.attr("name",Za());c.on("click",function(){c[0].checked&&a.$apply(function(){e.$setViewValue(d.value)})});e.$render=function(){c[0].checked=d.value==e.$viewValue};d.$observe("value",e.$render)},checkbox:function(a,
c,d,e){var g=d.ngTrueValue,f=d.ngFalseValue;D(g)||(g=!0);D(f)||(f=!1);c.on("click",function(){a.$apply(function(){e.$setViewValue(c[0].checked)})});e.$render=function(){c[0].checked=e.$viewValue};e.$isEmpty=function(a){return a!==g};e.$formatters.push(function(a){return a===g});e.$parsers.push(function(a){return a?g:f})},hidden:w,button:w,submit:w,reset:w},Mc=["$browser","$sniffer",function(a,c){return{restrict:"E",require:"?ngModel",link:function(d,e,g,f){f&&(Lc[x(g.type)]||Lc.text)(d,e,g,f,c,a)}}}],
nb="ng-valid",mb="ng-invalid",Ja="ng-pristine",pb="ng-dirty",ce=["$scope","$exceptionHandler","$attrs","$element","$parse",function(a,c,d,e,g){function f(a,c){c=c?"-"+db(c,"-"):"";e.removeClass((a?mb:nb)+c).addClass((a?nb:mb)+c)}this.$modelValue=this.$viewValue=Number.NaN;this.$parsers=[];this.$formatters=[];this.$viewChangeListeners=[];this.$pristine=!0;this.$dirty=!1;this.$valid=!0;this.$invalid=!1;this.$name=d.name;var h=g(d.ngModel),m=h.assign;if(!m)throw F("ngModel")("nonassign",d.ngModel,ga(e));
this.$render=w;this.$isEmpty=function(a){return z(a)||""===a||null===a||a!==a};var k=e.inheritedData("$formController")||ob,l=0,n=this.$error={};e.addClass(Ja);f(!0);this.$setValidity=function(a,c){n[a]!==!c&&(c?(n[a]&&l--,l||(f(!0),this.$valid=!0,this.$invalid=!1)):(f(!1),this.$invalid=!0,this.$valid=!1,l++),n[a]=!c,f(c,a),k.$setValidity(a,c,this))};this.$setPristine=function(){this.$dirty=!1;this.$pristine=!0;e.removeClass(pb).addClass(Ja)};this.$setViewValue=function(d){this.$viewValue=d;this.$pristine&&
(this.$dirty=!0,this.$pristine=!1,e.removeClass(Ja).addClass(pb),k.$setDirty());q(this.$parsers,function(a){d=a(d)});this.$modelValue!==d&&(this.$modelValue=d,m(a,d),q(this.$viewChangeListeners,function(a){try{a()}catch(d){c(d)}}))};var p=this;a.$watch(function(){var c=h(a);if(p.$modelValue!==c){var d=p.$formatters,e=d.length;for(p.$modelValue=c;e--;)c=d[e](c);p.$viewValue!==c&&(p.$viewValue=c,p.$render())}return c})}],de=function(){return{require:["ngModel","^?form"],controller:ce,link:function(a,
c,d,e){var g=e[0],f=e[1]||ob;f.$addControl(g);a.$on("$destroy",function(){f.$removeControl(g)})}}},ee=$({require:"ngModel",link:function(a,c,d,e){e.$viewChangeListeners.push(function(){a.$eval(d.ngChange)})}}),Nc=function(){return{require:"?ngModel",link:function(a,c,d,e){if(e){d.required=!0;var g=function(a){if(d.required&&e.$isEmpty(a))e.$setValidity("required",!1);else return e.$setValidity("required",!0),a};e.$formatters.push(g);e.$parsers.unshift(g);d.$observe("required",function(){g(e.$viewValue)})}}}},
fe=function(){return{require:"ngModel",link:function(a,c,d,e){var g=(a=/\/(.*)\//.exec(d.ngList))&&RegExp(a[1])||d.ngList||",";e.$parsers.push(function(a){if(!z(a)){var c=[];a&&q(a.split(g),function(a){a&&c.push(ba(a))});return c}});e.$formatters.push(function(a){return K(a)?a.join(", "):r});e.$isEmpty=function(a){return!a||!a.length}}}},ge=/^(true|false|\d+)$/,he=function(){return{priority:100,compile:function(a,c){return ge.test(c.ngValue)?function(a,c,g){g.$set("value",a.$eval(g.ngValue))}:function(a,
c,g){a.$watch(g.ngValue,function(a){g.$set("value",a)})}}}},ie=ta(function(a,c,d){c.addClass("ng-binding").data("$binding",d.ngBind);a.$watch(d.ngBind,function(a){c.text(a==r?"":a)})}),je=["$interpolate",function(a){return function(c,d,e){c=a(d.attr(e.$attr.ngBindTemplate));d.addClass("ng-binding").data("$binding",c);e.$observe("ngBindTemplate",function(a){d.text(a)})}}],ke=["$sce","$parse",function(a,c){return function(d,e,g){e.addClass("ng-binding").data("$binding",g.ngBindHtml);var f=c(g.ngBindHtml);
d.$watch(function(){return(f(d)||"").toString()},function(c){e.html(a.getTrustedHtml(f(d))||"")})}}],le=Nb("",!0),me=Nb("Odd",0),ne=Nb("Even",1),oe=ta({compile:function(a,c){c.$set("ngCloak",r);a.removeClass("ng-cloak")}}),pe=[function(){return{scope:!0,controller:"@",priority:500}}],Oc={};q("click dblclick mousedown mouseup mouseover mouseout mousemove mouseenter mouseleave keydown keyup keypress submit focus blur copy cut paste".split(" "),function(a){var c=ma("ng-"+a);Oc[c]=["$parse",function(d){return{compile:function(e,
g){var f=d(g[c]);return function(c,d,e){d.on(x(a),function(a){c.$apply(function(){f(c,{$event:a})})})}}}}]});var qe=["$animate",function(a){return{transclude:"element",priority:600,terminal:!0,restrict:"A",$$tlb:!0,link:function(c,d,e,g,f){var h,m;c.$watch(e.ngIf,function(g){Oa(g)?m||(m=c.$new(),f(m,function(c){c[c.length++]=Q.createComment(" end ngIf: "+e.ngIf+" ");h={clone:c};a.enter(c,d.parent(),d)})):(m&&(m.$destroy(),m=null),h&&(a.leave(wb(h.clone)),h=null))})}}}],re=["$http","$templateCache",
"$anchorScroll","$animate","$sce",function(a,c,d,e,g){return{restrict:"ECA",priority:400,terminal:!0,transclude:"element",controller:Ca.noop,compile:function(f,h){var m=h.ngInclude||h.src,k=h.onload||"",l=h.autoscroll;return function(f,h,q,r,y){var A=0,u,t,H=function(){u&&(u.$destroy(),u=null);t&&(e.leave(t),t=null)};f.$watch(g.parseAsResourceUrl(m),function(g){var m=function(){!B(l)||l&&!f.$eval(l)||d()},q=++A;g?(a.get(g,{cache:c}).success(function(a){if(q===A){var c=f.$new();r.template=a;a=y(c,
function(a){H();e.enter(a,null,h,m)});u=c;t=a;u.$emit("$includeContentLoaded");f.$eval(k)}}).error(function(){q===A&&H()}),f.$emit("$includeContentRequested")):(H(),r.template=null)})}}}}],se=["$compile",function(a){return{restrict:"ECA",priority:-400,require:"ngInclude",link:function(c,d,e,g){d.html(g.template);a(d.contents())(c)}}}],te=ta({priority:450,compile:function(){return{pre:function(a,c,d){a.$eval(d.ngInit)}}}}),ue=ta({terminal:!0,priority:1E3}),ve=["$locale","$interpolate",function(a,c){var d=
/{}/g;return{restrict:"EA",link:function(e,g,f){var h=f.count,m=f.$attr.when&&g.attr(f.$attr.when),k=f.offset||0,l=e.$eval(m)||{},n={},p=c.startSymbol(),s=c.endSymbol(),r=/^when(Minus)?(.+)$/;q(f,function(a,c){r.test(c)&&(l[x(c.replace("when","").replace("Minus","-"))]=g.attr(f.$attr[c]))});q(l,function(a,e){n[e]=c(a.replace(d,p+h+"-"+k+s))});e.$watch(function(){var c=parseFloat(e.$eval(h));if(isNaN(c))return"";c in l||(c=a.pluralCat(c-k));return n[c](e,g,!0)},function(a){g.text(a)})}}}],we=["$parse",
"$animate",function(a,c){var d=F("ngRepeat");return{transclude:"element",priority:1E3,terminal:!0,$$tlb:!0,link:function(e,g,f,h,m){var k=f.ngRepeat,l=k.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?\s*$/),n,p,s,r,y,t,u={$id:Fa};if(!l)throw d("iexp",k);f=l[1];h=l[2];(l=l[3])?(n=a(l),p=function(a,c,d){t&&(u[t]=a);u[y]=c;u.$index=d;return n(e,u)}):(s=function(a,c){return Fa(c)},r=function(a){return a});l=f.match(/^(?:([\$\w]+)|\(([\$\w]+)\s*,\s*([\$\w]+)\))$/);if(!l)throw d("iidexp",
f);y=l[3]||l[1];t=l[2];var B={};e.$watchCollection(h,function(a){var f,h,l=g[0],n,u={},z,P,D,x,T,w,F=[];if(rb(a))T=a,n=p||s;else{n=p||r;T=[];for(D in a)a.hasOwnProperty(D)&&"$"!=D.charAt(0)&&T.push(D);T.sort()}z=T.length;h=F.length=T.length;for(f=0;f<h;f++)if(D=a===T?f:T[f],x=a[D],x=n(D,x,f),xa(x,"`track by` id"),B.hasOwnProperty(x))w=B[x],delete B[x],u[x]=w,F[f]=w;else{if(u.hasOwnProperty(x))throw q(F,function(a){a&&a.scope&&(B[a.id]=a)}),d("dupes",k,x);F[f]={id:x};u[x]=!1}for(D in B)B.hasOwnProperty(D)&&
(w=B[D],f=wb(w.clone),c.leave(f),q(f,function(a){a.$$NG_REMOVED=!0}),w.scope.$destroy());f=0;for(h=T.length;f<h;f++){D=a===T?f:T[f];x=a[D];w=F[f];F[f-1]&&(l=F[f-1].clone[F[f-1].clone.length-1]);if(w.scope){P=w.scope;n=l;do n=n.nextSibling;while(n&&n.$$NG_REMOVED);w.clone[0]!=n&&c.move(wb(w.clone),null,A(l));l=w.clone[w.clone.length-1]}else P=e.$new();P[y]=x;t&&(P[t]=D);P.$index=f;P.$first=0===f;P.$last=f===z-1;P.$middle=!(P.$first||P.$last);P.$odd=!(P.$even=0===(f&1));w.scope||m(P,function(a){a[a.length++]=
Q.createComment(" end ngRepeat: "+k+" ");c.enter(a,null,A(l));l=a;w.scope=P;w.clone=a;u[w.id]=w})}B=u})}}}],xe=["$animate",function(a){return function(c,d,e){c.$watch(e.ngShow,function(c){a[Oa(c)?"removeClass":"addClass"](d,"ng-hide")})}}],ye=["$animate",function(a){return function(c,d,e){c.$watch(e.ngHide,function(c){a[Oa(c)?"addClass":"removeClass"](d,"ng-hide")})}}],ze=ta(function(a,c,d){a.$watch(d.ngStyle,function(a,d){d&&a!==d&&q(d,function(a,d){c.css(d,"")});a&&c.css(a)},!0)}),Ae=["$animate",
function(a){return{restrict:"EA",require:"ngSwitch",controller:["$scope",function(){this.cases={}}],link:function(c,d,e,g){var f,h,m=[];c.$watch(e.ngSwitch||e.on,function(d){for(var l=0,n=m.length;l<n;l++)m[l].$destroy(),a.leave(h[l]);h=[];m=[];if(f=g.cases["!"+d]||g.cases["?"])c.$eval(e.change),q(f,function(d){var e=c.$new();m.push(e);d.transclude(e,function(c){var e=d.element;h.push(c);a.enter(c,e.parent(),e)})})})}}}],Be=ta({transclude:"element",priority:800,require:"^ngSwitch",link:function(a,
c,d,e,g){e.cases["!"+d.ngSwitchWhen]=e.cases["!"+d.ngSwitchWhen]||[];e.cases["!"+d.ngSwitchWhen].push({transclude:g,element:c})}}),Ce=ta({transclude:"element",priority:800,require:"^ngSwitch",link:function(a,c,d,e,g){e.cases["?"]=e.cases["?"]||[];e.cases["?"].push({transclude:g,element:c})}}),De=ta({controller:["$element","$transclude",function(a,c){if(!c)throw F("ngTransclude")("orphan",ga(a));this.$transclude=c}],link:function(a,c,d,e){e.$transclude(function(a){c.empty();c.append(a)})}}),Ee=["$templateCache",
function(a){return{restrict:"E",terminal:!0,compile:function(c,d){"text/ng-template"==d.type&&a.put(d.id,c[0].text)}}}],Fe=F("ngOptions"),Ge=$({terminal:!0}),He=["$compile","$parse",function(a,c){var d=/^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+group\s+by\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?$/,e={$setViewValue:w};return{restrict:"E",require:["select","?ngModel"],controller:["$element","$scope",
"$attrs",function(a,c,d){var m=this,k={},l=e,n;m.databound=d.ngModel;m.init=function(a,c,d){l=a;n=d};m.addOption=function(c){xa(c,'"option value"');k[c]=!0;l.$viewValue==c&&(a.val(c),n.parent()&&n.remove())};m.removeOption=function(a){this.hasOption(a)&&(delete k[a],l.$viewValue==a&&this.renderUnknownOption(a))};m.renderUnknownOption=function(c){c="? "+Fa(c)+" ?";n.val(c);a.prepend(n);a.val(c);n.prop("selected",!0)};m.hasOption=function(a){return k.hasOwnProperty(a)};c.$on("$destroy",function(){m.renderUnknownOption=
w})}],link:function(e,f,h,m){function k(a,c,d,e){d.$render=function(){var a=d.$viewValue;e.hasOption(a)?(x.parent()&&x.remove(),c.val(a),""===a&&w.prop("selected",!0)):z(a)&&w?c.val(""):e.renderUnknownOption(a)};c.on("change",function(){a.$apply(function(){x.parent()&&x.remove();d.$setViewValue(c.val())})})}function l(a,c,d){var e;d.$render=function(){var a=new Sa(d.$viewValue);q(c.find("option"),function(c){c.selected=B(a.get(c.value))})};a.$watch(function(){ua(e,d.$viewValue)||(e=aa(d.$viewValue),
d.$render())});c.on("change",function(){a.$apply(function(){var a=[];q(c.find("option"),function(c){c.selected&&a.push(c.value)});d.$setViewValue(a)})})}function n(e,f,g){function h(){var a={"":[]},c=[""],d,k,r,t,v;t=g.$modelValue;v=A(e)||[];var C=n?Pb(v):v,F,I,z;I={};r=!1;var E,H;if(s)if(w&&K(t))for(r=new Sa([]),z=0;z<t.length;z++)I[m]=t[z],r.put(w(e,I),t[z]);else r=new Sa(t);for(z=0;F=C.length,z<F;z++){k=z;if(n){k=C[z];if("$"===k.charAt(0))continue;I[n]=k}I[m]=v[k];d=p(e,I)||"";(k=a[d])||(k=a[d]=
[],c.push(d));s?d=B(r.remove(w?w(e,I):q(e,I))):(w?(d={},d[m]=t,d=w(e,d)===w(e,I)):d=t===q(e,I),r=r||d);E=l(e,I);E=B(E)?E:"";k.push({id:w?w(e,I):n?C[z]:z,label:E,selected:d})}s||(y||null===t?a[""].unshift({id:"",label:"",selected:!r}):r||a[""].unshift({id:"?",label:"",selected:!0}));I=0;for(C=c.length;I<C;I++){d=c[I];k=a[d];x.length<=I?(t={element:D.clone().attr("label",d),label:k.label},v=[t],x.push(v),f.append(t.element)):(v=x[I],t=v[0],t.label!=d&&t.element.attr("label",t.label=d));E=null;z=0;for(F=
k.length;z<F;z++)r=k[z],(d=v[z+1])?(E=d.element,d.label!==r.label&&E.text(d.label=r.label),d.id!==r.id&&E.val(d.id=r.id),E[0].selected!==r.selected&&E.prop("selected",d.selected=r.selected)):(""===r.id&&y?H=y:(H=u.clone()).val(r.id).attr("selected",r.selected).text(r.label),v.push({element:H,label:r.label,id:r.id,selected:r.selected}),E?E.after(H):t.element.append(H),E=H);for(z++;v.length>z;)v.pop().element.remove()}for(;x.length>I;)x.pop()[0].element.remove()}var k;if(!(k=t.match(d)))throw Fe("iexp",
t,ga(f));var l=c(k[2]||k[1]),m=k[4]||k[6],n=k[5],p=c(k[3]||""),q=c(k[2]?k[1]:m),A=c(k[7]),w=k[8]?c(k[8]):null,x=[[{element:f,label:""}]];y&&(a(y)(e),y.removeClass("ng-scope"),y.remove());f.empty();f.on("change",function(){e.$apply(function(){var a,c=A(e)||[],d={},h,k,l,p,t,u,v;if(s)for(k=[],p=0,u=x.length;p<u;p++)for(a=x[p],l=1,t=a.length;l<t;l++){if((h=a[l].element)[0].selected){h=h.val();n&&(d[n]=h);if(w)for(v=0;v<c.length&&(d[m]=c[v],w(e,d)!=h);v++);else d[m]=c[h];k.push(q(e,d))}}else if(h=f.val(),
"?"==h)k=r;else if(""===h)k=null;else if(w)for(v=0;v<c.length;v++){if(d[m]=c[v],w(e,d)==h){k=q(e,d);break}}else d[m]=c[h],n&&(d[n]=h),k=q(e,d);g.$setViewValue(k)})});g.$render=h;e.$watch(h)}if(m[1]){var p=m[0];m=m[1];var s=h.multiple,t=h.ngOptions,y=!1,w,u=A(Q.createElement("option")),D=A(Q.createElement("optgroup")),x=u.clone();h=0;for(var v=f.children(),F=v.length;h<F;h++)if(""===v[h].value){w=y=v.eq(h);break}p.init(m,y,x);s&&(m.$isEmpty=function(a){return!a||0===a.length});t?n(e,f,m):s?l(e,f,m):
k(e,f,m,p)}}}}],Ie=["$interpolate",function(a){var c={addOption:w,removeOption:w};return{restrict:"E",priority:100,compile:function(d,e){if(z(e.value)){var g=a(d.text(),!0);g||e.$set("value",d.text())}return function(a,d,e){var k=d.parent(),l=k.data("$selectController")||k.parent().data("$selectController");l&&l.databound?d.prop("selected",!1):l=c;g?a.$watch(g,function(a,c){e.$set("value",a);a!==c&&l.removeOption(c);l.addOption(a)}):l.addOption(e.value);d.on("$destroy",function(){l.removeOption(e.value)})}}}}],
Je=$({restrict:"E",terminal:!0});(Da=Z.jQuery)?(A=Da,t(Da.fn,{scope:Ga.scope,isolateScope:Ga.isolateScope,controller:Ga.controller,injector:Ga.injector,inheritedData:Ga.inheritedData}),xb("remove",!0,!0,!1),xb("empty",!1,!1,!1),xb("html",!1,!1,!0)):A=O;Ca.element=A;(function(a){t(a,{bootstrap:Zb,copy:aa,extend:t,equals:ua,element:A,forEach:q,injector:$b,noop:w,bind:cb,toJson:qa,fromJson:Vb,identity:Ba,isUndefined:z,isDefined:B,isString:D,isFunction:L,isObject:X,isNumber:sb,isElement:Qc,isArray:K,
version:Sd,isDate:La,lowercase:x,uppercase:Ia,callbacks:{counter:0},$$minErr:F,$$csp:Ub});Ua=Vc(Z);try{Ua("ngLocale")}catch(c){Ua("ngLocale",[]).provider("$locale",sd)}Ua("ng",["ngLocale"],["$provide",function(a){a.provider({$$sanitizeUri:Cd});a.provider("$compile",jc).directive({a:Xd,input:Mc,textarea:Mc,form:Yd,script:Ee,select:He,style:Je,option:Ie,ngBind:ie,ngBindHtml:ke,ngBindTemplate:je,ngClass:le,ngClassEven:ne,ngClassOdd:me,ngCloak:oe,ngController:pe,ngForm:Zd,ngHide:ye,ngIf:qe,ngInclude:re,
ngInit:te,ngNonBindable:ue,ngPluralize:ve,ngRepeat:we,ngShow:xe,ngStyle:ze,ngSwitch:Ae,ngSwitchWhen:Be,ngSwitchDefault:Ce,ngOptions:Ge,ngTransclude:De,ngModel:de,ngList:fe,ngChange:ee,required:Nc,ngRequired:Nc,ngValue:he}).directive({ngInclude:se}).directive(Ob).directive(Oc);a.provider({$anchorScroll:dd,$animate:Ud,$browser:fd,$cacheFactory:gd,$controller:jd,$document:kd,$exceptionHandler:ld,$filter:Bc,$interpolate:qd,$interval:rd,$http:md,$httpBackend:od,$location:ud,$log:vd,$parse:yd,$rootScope:Bd,
$q:zd,$sce:Fd,$sceDelegate:Ed,$sniffer:Gd,$templateCache:hd,$timeout:Hd,$window:Id})}])})(Ca);A(Q).ready(function(){Tc(Q,Zb)})})(window,document);!angular.$$csp()&&angular.element(document).find("head").prepend('<style type="text/css">@charset "UTF-8";[ng\\:cloak],[ng-cloak],[data-ng-cloak],[x-ng-cloak],.ng-cloak,.x-ng-cloak,.ng-hide{display:none !important;}ng\\:form{display:block;}</style>');
//# sourceMappingURL=angular.min.js.map
/*
 AngularJS v1.2.9
 (c) 2010-2014 Google, Inc. http://angularjs.org
 License: MIT
*/
(function(h,e,A){'use strict';function u(w,q,k){return{restrict:"ECA",terminal:!0,priority:400,transclude:"element",link:function(a,c,b,f,n){function y(){l&&(l.$destroy(),l=null);g&&(k.leave(g),g=null)}function v(){var b=w.current&&w.current.locals;if(e.isDefined(b&&b.$template)){var b=a.$new(),f=w.current;g=n(b,function(d){k.enter(d,null,g||c,function(){!e.isDefined(t)||t&&!a.$eval(t)||q()});y()});l=f.scope=b;l.$emit("$viewContentLoaded");l.$eval(h)}else y()}var l,g,t=b.autoscroll,h=b.onload||"";
a.$on("$routeChangeSuccess",v);v()}}}function z(e,h,k){return{restrict:"ECA",priority:-400,link:function(a,c){var b=k.current,f=b.locals;c.html(f.$template);var n=e(c.contents());b.controller&&(f.$scope=a,f=h(b.controller,f),b.controllerAs&&(a[b.controllerAs]=f),c.data("$ngControllerController",f),c.children().data("$ngControllerController",f));n(a)}}}h=e.module("ngRoute",["ng"]).provider("$route",function(){function h(a,c){return e.extend(new (e.extend(function(){},{prototype:a})),c)}function q(a,
e){var b=e.caseInsensitiveMatch,f={originalPath:a,regexp:a},h=f.keys=[];a=a.replace(/([().])/g,"\\$1").replace(/(\/)?:(\w+)([\?|\*])?/g,function(a,e,b,c){a="?"===c?c:null;c="*"===c?c:null;h.push({name:b,optional:!!a});e=e||"";return""+(a?"":e)+"(?:"+(a?e:"")+(c&&"(.+?)"||"([^/]+)")+(a||"")+")"+(a||"")}).replace(/([\/$\*])/g,"\\$1");f.regexp=RegExp("^"+a+"$",b?"i":"");return f}var k={};this.when=function(a,c){k[a]=e.extend({reloadOnSearch:!0},c,a&&q(a,c));if(a){var b="/"==a[a.length-1]?a.substr(0,
a.length-1):a+"/";k[b]=e.extend({redirectTo:a},q(b,c))}return this};this.otherwise=function(a){this.when(null,a);return this};this.$get=["$rootScope","$location","$routeParams","$q","$injector","$http","$templateCache","$sce",function(a,c,b,f,n,q,v,l){function g(){var d=t(),m=r.current;if(d&&m&&d.$$route===m.$$route&&e.equals(d.pathParams,m.pathParams)&&!d.reloadOnSearch&&!x)m.params=d.params,e.copy(m.params,b),a.$broadcast("$routeUpdate",m);else if(d||m)x=!1,a.$broadcast("$routeChangeStart",d,m),
(r.current=d)&&d.redirectTo&&(e.isString(d.redirectTo)?c.path(u(d.redirectTo,d.params)).search(d.params).replace():c.url(d.redirectTo(d.pathParams,c.path(),c.search())).replace()),f.when(d).then(function(){if(d){var a=e.extend({},d.resolve),c,b;e.forEach(a,function(d,c){a[c]=e.isString(d)?n.get(d):n.invoke(d)});e.isDefined(c=d.template)?e.isFunction(c)&&(c=c(d.params)):e.isDefined(b=d.templateUrl)&&(e.isFunction(b)&&(b=b(d.params)),b=l.getTrustedResourceUrl(b),e.isDefined(b)&&(d.loadedTemplateUrl=
b,c=q.get(b,{cache:v}).then(function(a){return a.data})));e.isDefined(c)&&(a.$template=c);return f.all(a)}}).then(function(c){d==r.current&&(d&&(d.locals=c,e.copy(d.params,b)),a.$broadcast("$routeChangeSuccess",d,m))},function(c){d==r.current&&a.$broadcast("$routeChangeError",d,m,c)})}function t(){var a,b;e.forEach(k,function(f,k){var p;if(p=!b){var s=c.path();p=f.keys;var l={};if(f.regexp)if(s=f.regexp.exec(s)){for(var g=1,q=s.length;g<q;++g){var n=p[g-1],r="string"==typeof s[g]?decodeURIComponent(s[g]):
s[g];n&&r&&(l[n.name]=r)}p=l}else p=null;else p=null;p=a=p}p&&(b=h(f,{params:e.extend({},c.search(),a),pathParams:a}),b.$$route=f)});return b||k[null]&&h(k[null],{params:{},pathParams:{}})}function u(a,c){var b=[];e.forEach((a||"").split(":"),function(a,d){if(0===d)b.push(a);else{var e=a.match(/(\w+)(.*)/),f=e[1];b.push(c[f]);b.push(e[2]||"");delete c[f]}});return b.join("")}var x=!1,r={routes:k,reload:function(){x=!0;a.$evalAsync(g)}};a.$on("$locationChangeSuccess",g);return r}]});h.provider("$routeParams",
function(){this.$get=function(){return{}}});h.directive("ngView",u);h.directive("ngView",z);u.$inject=["$route","$anchorScroll","$animate"];z.$inject=["$compile","$controller","$route"]})(window,window.angular);
//# sourceMappingURL=angular-route.min.js.map
/*
 AngularJS v1.2.9
 (c) 2010-2014 Google, Inc. http://angularjs.org
 License: MIT
*/
(function(H,a,A){'use strict';function D(p,g){g=g||{};a.forEach(g,function(a,c){delete g[c]});for(var c in p)p.hasOwnProperty(c)&&("$"!==c.charAt(0)&&"$"!==c.charAt(1))&&(g[c]=p[c]);return g}var v=a.$$minErr("$resource"),C=/^(\.[a-zA-Z_$][0-9a-zA-Z_$]*)+$/;a.module("ngResource",["ng"]).factory("$resource",["$http","$q",function(p,g){function c(a,c){this.template=a;this.defaults=c||{};this.urlParams={}}function t(n,w,l){function r(h,d){var e={};d=x({},w,d);s(d,function(b,d){u(b)&&(b=b());var k;if(b&&
b.charAt&&"@"==b.charAt(0)){k=h;var a=b.substr(1);if(null==a||""===a||"hasOwnProperty"===a||!C.test("."+a))throw v("badmember",a);for(var a=a.split("."),f=0,c=a.length;f<c&&k!==A;f++){var g=a[f];k=null!==k?k[g]:A}}else k=b;e[d]=k});return e}function e(a){return a.resource}function f(a){D(a||{},this)}var F=new c(n);l=x({},B,l);s(l,function(h,d){var c=/^(POST|PUT|PATCH)$/i.test(h.method);f[d]=function(b,d,k,w){var q={},n,l,y;switch(arguments.length){case 4:y=w,l=k;case 3:case 2:if(u(d)){if(u(b)){l=
b;y=d;break}l=d;y=k}else{q=b;n=d;l=k;break}case 1:u(b)?l=b:c?n=b:q=b;break;case 0:break;default:throw v("badargs",arguments.length);}var t=this instanceof f,m=t?n:h.isArray?[]:new f(n),z={},B=h.interceptor&&h.interceptor.response||e,C=h.interceptor&&h.interceptor.responseError||A;s(h,function(a,b){"params"!=b&&("isArray"!=b&&"interceptor"!=b)&&(z[b]=G(a))});c&&(z.data=n);F.setUrlParams(z,x({},r(n,h.params||{}),q),h.url);q=p(z).then(function(b){var d=b.data,k=m.$promise;if(d){if(a.isArray(d)!==!!h.isArray)throw v("badcfg",
h.isArray?"array":"object",a.isArray(d)?"array":"object");h.isArray?(m.length=0,s(d,function(b){m.push(new f(b))})):(D(d,m),m.$promise=k)}m.$resolved=!0;b.resource=m;return b},function(b){m.$resolved=!0;(y||E)(b);return g.reject(b)});q=q.then(function(b){var a=B(b);(l||E)(a,b.headers);return a},C);return t?q:(m.$promise=q,m.$resolved=!1,m)};f.prototype["$"+d]=function(b,a,k){u(b)&&(k=a,a=b,b={});b=f[d].call(this,b,this,a,k);return b.$promise||b}});f.bind=function(a){return t(n,x({},w,a),l)};return f}
var B={get:{method:"GET"},save:{method:"POST"},query:{method:"GET",isArray:!0},remove:{method:"DELETE"},"delete":{method:"DELETE"}},E=a.noop,s=a.forEach,x=a.extend,G=a.copy,u=a.isFunction;c.prototype={setUrlParams:function(c,g,l){var r=this,e=l||r.template,f,p,h=r.urlParams={};s(e.split(/\W/),function(a){if("hasOwnProperty"===a)throw v("badname");!/^\d+$/.test(a)&&(a&&RegExp("(^|[^\\\\]):"+a+"(\\W|$)").test(e))&&(h[a]=!0)});e=e.replace(/\\:/g,":");g=g||{};s(r.urlParams,function(d,c){f=g.hasOwnProperty(c)?
g[c]:r.defaults[c];a.isDefined(f)&&null!==f?(p=encodeURIComponent(f).replace(/%40/gi,"@").replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,"%20").replace(/%26/gi,"&").replace(/%3D/gi,"=").replace(/%2B/gi,"+"),e=e.replace(RegExp(":"+c+"(\\W|$)","g"),p+"$1")):e=e.replace(RegExp("(/?):"+c+"(\\W|$)","g"),function(a,c,d){return"/"==d.charAt(0)?d:c+d})});e=e.replace(/\/+$/,"")||"/";e=e.replace(/\/\.(?=\w+($|\?))/,".");c.url=e.replace(/\/\\\./,"/.");s(g,function(a,e){r.urlParams[e]||
(c.params=c.params||{},c.params[e]=a)})}};return t}])})(window,window.angular);
//# sourceMappingURL=angular-resource.min.js.map
/*
 AngularJS v1.2.9
 (c) 2010-2014 Google, Inc. http://angularjs.org
 License: MIT
*/
(function(p,f,n){'use strict';f.module("ngCookies",["ng"]).factory("$cookies",["$rootScope","$browser",function(d,b){var c={},g={},h,k=!1,l=f.copy,m=f.isUndefined;b.addPollFn(function(){var a=b.cookies();h!=a&&(h=a,l(a,g),l(a,c),k&&d.$apply())})();k=!0;d.$watch(function(){var a,e,d;for(a in g)m(c[a])&&b.cookies(a,n);for(a in c)(e=c[a],f.isString(e))?e!==g[a]&&(b.cookies(a,e),d=!0):f.isDefined(g[a])?c[a]=g[a]:delete c[a];if(d)for(a in e=b.cookies(),c)c[a]!==e[a]&&(m(e[a])?delete c[a]:c[a]=e[a])});
return c}]).factory("$cookieStore",["$cookies",function(d){return{get:function(b){return(b=d[b])?f.fromJson(b):b},put:function(b,c){d[b]=f.toJson(c)},remove:function(b){delete d[b]}}}])})(window,window.angular);
//# sourceMappingURL=angular-cookies.min.js.map
/*
 AngularJS v1.3.15
 (c) 2010-2014 Google, Inc. http://angularjs.org
 License: MIT
*/
(function(n,h,p){'use strict';function E(a){var e=[];r(e,h.noop).chars(a);return e.join("")}function g(a){var e={};a=a.split(",");var d;for(d=0;d<a.length;d++)e[a[d]]=!0;return e}function F(a,e){function d(a,b,d,l){b=h.lowercase(b);if(s[b])for(;f.last()&&t[f.last()];)c("",f.last());u[b]&&f.last()==b&&c("",b);(l=v[b]||!!l)||f.push(b);var m={};d.replace(G,function(a,b,e,c,d){m[b]=q(e||c||d||"")});e.start&&e.start(b,m,l)}function c(a,b){var c=0,d;if(b=h.lowercase(b))for(c=f.length-1;0<=c&&f[c]!=b;c--);
if(0<=c){for(d=f.length-1;d>=c;d--)e.end&&e.end(f[d]);f.length=c}}"string"!==typeof a&&(a=null===a||"undefined"===typeof a?"":""+a);var b,k,f=[],m=a,l;for(f.last=function(){return f[f.length-1]};a;){l="";k=!0;if(f.last()&&w[f.last()])a=a.replace(new RegExp("([\\W\\w]*)<\\s*\\/\\s*"+f.last()+"[^>]*>","i"),function(a,b){b=b.replace(H,"$1").replace(I,"$1");e.chars&&e.chars(q(b));return""}),c("",f.last());else{if(0===a.indexOf("\x3c!--"))b=a.indexOf("--",4),0<=b&&a.lastIndexOf("--\x3e",b)===b&&(e.comment&&
e.comment(a.substring(4,b)),a=a.substring(b+3),k=!1);else if(x.test(a)){if(b=a.match(x))a=a.replace(b[0],""),k=!1}else if(J.test(a)){if(b=a.match(y))a=a.substring(b[0].length),b[0].replace(y,c),k=!1}else K.test(a)&&((b=a.match(z))?(b[4]&&(a=a.substring(b[0].length),b[0].replace(z,d)),k=!1):(l+="<",a=a.substring(1)));k&&(b=a.indexOf("<"),l+=0>b?a:a.substring(0,b),a=0>b?"":a.substring(b),e.chars&&e.chars(q(l)))}if(a==m)throw L("badparse",a);m=a}c()}function q(a){if(!a)return"";A.innerHTML=a.replace(/</g,
"&lt;");return A.textContent}function B(a){return a.replace(/&/g,"&amp;").replace(M,function(a){var d=a.charCodeAt(0);a=a.charCodeAt(1);return"&#"+(1024*(d-55296)+(a-56320)+65536)+";"}).replace(N,function(a){return"&#"+a.charCodeAt(0)+";"}).replace(/</g,"&lt;").replace(/>/g,"&gt;")}function r(a,e){var d=!1,c=h.bind(a,a.push);return{start:function(a,k,f){a=h.lowercase(a);!d&&w[a]&&(d=a);d||!0!==C[a]||(c("<"),c(a),h.forEach(k,function(d,f){var k=h.lowercase(f),g="img"===a&&"src"===k||"background"===
k;!0!==O[k]||!0===D[k]&&!e(d,g)||(c(" "),c(f),c('="'),c(B(d)),c('"'))}),c(f?"/>":">"))},end:function(a){a=h.lowercase(a);d||!0!==C[a]||(c("</"),c(a),c(">"));a==d&&(d=!1)},chars:function(a){d||c(B(a))}}}var L=h.$$minErr("$sanitize"),z=/^<((?:[a-zA-Z])[\w:-]*)((?:\s+[\w:-]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)\s*(>?)/,y=/^<\/\s*([\w:-]+)[^>]*>/,G=/([\w:-]+)(?:\s*=\s*(?:(?:"((?:[^"])*)")|(?:'((?:[^'])*)')|([^>\s]+)))?/g,K=/^</,J=/^<\//,H=/\x3c!--(.*?)--\x3e/g,x=/<!DOCTYPE([^>]*?)>/i,
I=/<!\[CDATA\[(.*?)]]\x3e/g,M=/[\uD800-\uDBFF][\uDC00-\uDFFF]/g,N=/([^\#-~| |!])/g,v=g("area,br,col,hr,img,wbr");n=g("colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr");p=g("rp,rt");var u=h.extend({},p,n),s=h.extend({},n,g("address,article,aside,blockquote,caption,center,del,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5,h6,header,hgroup,hr,ins,map,menu,nav,ol,pre,script,section,table,ul")),t=h.extend({},p,g("a,abbr,acronym,b,bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,q,ruby,rp,rt,s,samp,small,span,strike,strong,sub,sup,time,tt,u,var"));
n=g("animate,animateColor,animateMotion,animateTransform,circle,defs,desc,ellipse,font-face,font-face-name,font-face-src,g,glyph,hkern,image,linearGradient,line,marker,metadata,missing-glyph,mpath,path,polygon,polyline,radialGradient,rect,set,stop,svg,switch,text,title,tspan,use");var w=g("script,style"),C=h.extend({},v,s,t,u,n),D=g("background,cite,href,longdesc,src,usemap,xlink:href");n=g("abbr,align,alt,axis,bgcolor,border,cellpadding,cellspacing,class,clear,color,cols,colspan,compact,coords,dir,face,headers,height,hreflang,hspace,ismap,lang,language,nohref,nowrap,rel,rev,rows,rowspan,rules,scope,scrolling,shape,size,span,start,summary,target,title,type,valign,value,vspace,width");
p=g("accent-height,accumulate,additive,alphabetic,arabic-form,ascent,attributeName,attributeType,baseProfile,bbox,begin,by,calcMode,cap-height,class,color,color-rendering,content,cx,cy,d,dx,dy,descent,display,dur,end,fill,fill-rule,font-family,font-size,font-stretch,font-style,font-variant,font-weight,from,fx,fy,g1,g2,glyph-name,gradientUnits,hanging,height,horiz-adv-x,horiz-origin-x,ideographic,k,keyPoints,keySplines,keyTimes,lang,marker-end,marker-mid,marker-start,markerHeight,markerUnits,markerWidth,mathematical,max,min,offset,opacity,orient,origin,overline-position,overline-thickness,panose-1,path,pathLength,points,preserveAspectRatio,r,refX,refY,repeatCount,repeatDur,requiredExtensions,requiredFeatures,restart,rotate,rx,ry,slope,stemh,stemv,stop-color,stop-opacity,strikethrough-position,strikethrough-thickness,stroke,stroke-dasharray,stroke-dashoffset,stroke-linecap,stroke-linejoin,stroke-miterlimit,stroke-opacity,stroke-width,systemLanguage,target,text-anchor,to,transform,type,u1,u2,underline-position,underline-thickness,unicode,unicode-range,units-per-em,values,version,viewBox,visibility,width,widths,x,x-height,x1,x2,xlink:actuate,xlink:arcrole,xlink:role,xlink:show,xlink:title,xlink:type,xml:base,xml:lang,xml:space,xmlns,xmlns:xlink,y,y1,y2,zoomAndPan");
var O=h.extend({},D,p,n),A=document.createElement("pre");h.module("ngSanitize",[]).provider("$sanitize",function(){this.$get=["$$sanitizeUri",function(a){return function(e){var d=[];F(e,r(d,function(c,b){return!/^unsafe/.test(a(c,b))}));return d.join("")}}]});h.module("ngSanitize").filter("linky",["$sanitize",function(a){var e=/((ftp|https?):\/\/|(www\.)|(mailto:)?[A-Za-z0-9._%+-]+@)\S*[^\s.;,(){}<>"\u201d\u2019]/,d=/^mailto:/;return function(c,b){function k(a){a&&g.push(E(a))}function f(a,c){g.push("<a ");
h.isDefined(b)&&g.push('target="',b,'" ');g.push('href="',a.replace(/"/g,"&quot;"),'">');k(c);g.push("</a>")}if(!c)return c;for(var m,l=c,g=[],n,p;m=l.match(e);)n=m[0],m[2]||m[4]||(n=(m[3]?"http://":"mailto:")+n),p=m.index,k(l.substr(0,p)),f(n,m[0].replace(d,"")),l=l.substring(p+m[0].length);k(l);return a(g.join(""))}}])})(window,window.angular);
//# sourceMappingURL=angular-sanitize.min.js.map
/*
 angular-file-upload v1.0.1
 https://github.com/nervgh/angular-file-upload
*/
(function(angular, factory) {
    if (typeof define === 'function' && define.amd) {
        define('angular-file-upload', ['angular'], function(angular) {
            return factory(angular);
        });
    } else {
        return factory(angular);
    }
}(typeof angular === 'undefined' ? null : angular || null, function(angular) {

var module = angular.module('angularFileUpload', []);
'use strict';

/**
 * Classes
 *
 * FileUploader
 * FileUploader.FileLikeObject
 * FileUploader.FileItem
 * FileUploader.FileDirective
 * FileUploader.FileSelect
 * FileUploader.FileDrop
 * FileUploader.FileOver
 */

module


    .value('fileUploaderOptions', {
        url: '/',
        alias: 'file',
        headers: {},
        queue: [],
        progress: 0,
        autoUpload: false,
        removeAfterUpload: false,
        method: 'POST',
        filters: [],
        formData: [],
        queueLimit: Number.MAX_VALUE,
        withCredentials: false
    })


    .factory('FileUploader', ['fileUploaderOptions', '$rootScope', '$http', '$window', '$compile',
        function(fileUploaderOptions, $rootScope, $http, $window, $compile) {
            /**
             * Creates an instance of FileUploader
             * @param {Object} [options]
             * @constructor
             */
            function FileUploader(options) {
                var settings = angular.copy(fileUploaderOptions);
                angular.extend(this, settings, options, {
                    isUploading: false,
                    _nextIndex: 0,
                    _failFilterIndex: -1,
                    _directives: {select: [], drop: [], over: []}
                });

                // add default filters
                this.filters.unshift({name: 'queueLimit', fn: this._queueLimitFilter});
                this.filters.unshift({name: 'folder', fn: this._folderFilter});
            }
            /**********************
             * PUBLIC
             **********************/
            /**
             * Checks a support the html5 uploader
             * @returns {Boolean}
             * @readonly
             */
            FileUploader.prototype.isHTML5 = !!($window.File && $window.FormData);
            /**
             * Adds items to the queue
             * @param {FileList|File|HTMLInputElement} files
             * @param {Object} [options]
             * @param {Array<Function>|String} filters
             */
            FileUploader.prototype.addToQueue = function(files, options, filters) {
                var list = angular.isElement(files) ? [files]: files;
                var arrayOfFilters = this._getFilters(filters);
                var count = this.queue.length;
                var addedFileItems = [];

                angular.forEach(list, function(file) {
                    var item = this._getFileOrFileLikeObject(file);

                    if (this._isValidFile(item, arrayOfFilters, options)) {
                        var input = this.isFile(item) ? null : file;
                        var fileItem = new FileUploader.FileItem(this, item, options, input);
                        addedFileItems.push(fileItem);
                        this.queue.push(fileItem);
                        this._onAfterAddingFile(fileItem);
                    } else {
                        var filter = this.filters[this._failFilterIndex];
                        this._onWhenAddingFileFailed(item, filter, options);
                    }
                }, this);

                if(this.queue.length !== count) {
                    this._onAfterAddingAll(addedFileItems);
                    this.progress = this._getTotalProgress();
                }

                this._render();
                if (this.autoUpload) this.uploadAll();
            };
            /**
             * Remove items from the queue. Remove last: index = -1
             * @param {FileItem|Number} value
             */
            FileUploader.prototype.removeFromQueue = function(value) {
                var index = this.getIndexOfItem(value);
                var item = this.queue[index];
                if (item.isUploading) item.cancel();
                this.queue.splice(index, 1);
                item._destroy();
                this.progress = this._getTotalProgress();
            };
            /**
             * Clears the queue
             */
            FileUploader.prototype.clearQueue = function() {
                while(this.queue.length) {
                    this.queue[0].remove();
                }
                this.progress = 0;
            };
            /**
             * Uploads a item from the queue
             * @param {FileItem|Number} value
             */
            FileUploader.prototype.uploadItem = function(value) {
                var index = this.getIndexOfItem(value);
                var item = this.queue[index];
                var transport = this.isHTML5 ? '_xhrTransport' : '_iframeTransport';

                item._prepareToUploading();
                if(this.isUploading) return;

                this.isUploading = true;
                this[transport](item);
            };
            /**
             * Cancels uploading of item from the queue
             * @param {FileItem|Number} value
             */
            FileUploader.prototype.cancelItem = function(value) {
                var index = this.getIndexOfItem(value);
                var item = this.queue[index];
                var prop = this.isHTML5 ? '_xhr' : '_form';
                if (item && item.isUploading) item[prop].abort();
            };
            /**
             * Uploads all not uploaded items of queue
             */
            FileUploader.prototype.uploadAll = function() {
                var items = this.getNotUploadedItems().filter(function(item) {
                    return !item.isUploading;
                });
                if (!items.length) return;

                angular.forEach(items, function(item) {
                    item._prepareToUploading();
                });
                items[0].upload();
            };
            /**
             * Cancels all uploads
             */
            FileUploader.prototype.cancelAll = function() {
                var items = this.getNotUploadedItems();
                angular.forEach(items, function(item) {
                    item.cancel();
                });
            };
            /**
             * Returns "true" if value an instance of File
             * @param {*} value
             * @returns {Boolean}
             * @private
             */
            FileUploader.prototype.isFile = function(value) {
                var fn = $window.File;
                return (fn && value instanceof fn);
            };
            /**
             * Returns "true" if value an instance of FileLikeObject
             * @param {*} value
             * @returns {Boolean}
             * @private
             */
            FileUploader.prototype.isFileLikeObject = function(value) {
                return value instanceof FileUploader.FileLikeObject;
            };
            /**
             * Returns a index of item from the queue
             * @param {Item|Number} value
             * @returns {Number}
             */
            FileUploader.prototype.getIndexOfItem = function(value) {
                return angular.isNumber(value) ? value : this.queue.indexOf(value);
            };
            /**
             * Returns not uploaded items
             * @returns {Array}
             */
            FileUploader.prototype.getNotUploadedItems = function() {
                return this.queue.filter(function(item) {
                    return !item.isUploaded;
                });
            };
            /**
             * Returns items ready for upload
             * @returns {Array}
             */
            FileUploader.prototype.getReadyItems = function() {
                return this.queue
                    .filter(function(item) {
                        return (item.isReady && !item.isUploading);
                    })
                    .sort(function(item1, item2) {
                        return item1.index - item2.index;
                    });
            };
            /**
             * Destroys instance of FileUploader
             */
            FileUploader.prototype.destroy = function() {
                angular.forEach(this._directives, function(key) {
                    angular.forEach(this._directives[key], function(object) {
                        object.destroy();
                    }, this);
                }, this);
            };
            /**
             * Callback
             * @param {Array} fileItems
             */
            FileUploader.prototype.onAfterAddingAll = function(fileItems) {};
            /**
             * Callback
             * @param {FileItem} fileItem
             */
            FileUploader.prototype.onAfterAddingFile = function(fileItem) {};
            /**
             * Callback
             * @param {File|Object} item
             * @param {Object} filter
             * @param {Object} options
             * @private
             */
            FileUploader.prototype.onWhenAddingFileFailed = function(item, filter, options) {};
            /**
             * Callback
             * @param {FileItem} fileItem
             */
            FileUploader.prototype.onBeforeUploadItem = function(fileItem) {};
            /**
             * Callback
             * @param {FileItem} fileItem
             * @param {Number} progress
             */
            FileUploader.prototype.onProgressItem = function(fileItem, progress) {};
            /**
             * Callback
             * @param {Number} progress
             */
            FileUploader.prototype.onProgressAll = function(progress) {};
            /**
             * Callback
             * @param {FileItem} item
             * @param {*} response
             * @param {Number} status
             * @param {Object} headers
             */
            FileUploader.prototype.onSuccessItem = function(item, response, status, headers) {};
            /**
             * Callback
             * @param {FileItem} item
             * @param {*} response
             * @param {Number} status
             * @param {Object} headers
             */
            FileUploader.prototype.onErrorItem = function(item, response, status, headers) {};
            /**
             * Callback
             * @param {FileItem} item
             * @param {*} response
             * @param {Number} status
             * @param {Object} headers
             */
            FileUploader.prototype.onCancelItem = function(item, response, status, headers) {};
            /**
             * Callback
             * @param {FileItem} item
             * @param {*} response
             * @param {Number} status
             * @param {Object} headers
             */
            FileUploader.prototype.onCompleteItem = function(item, response, status, headers) {};
            /**
             * Callback
             */
            FileUploader.prototype.onCompleteAll = function() {};
            /**********************
             * PRIVATE
             **********************/
            /**
             * Returns the total progress
             * @param {Number} [value]
             * @returns {Number}
             * @private
             */
            FileUploader.prototype._getTotalProgress = function(value) {
                if(this.removeAfterUpload) return value || 0;

                var notUploaded = this.getNotUploadedItems().length;
                var uploaded = notUploaded ? this.queue.length - notUploaded : this.queue.length;
                var ratio = 100 / this.queue.length;
                var current = (value || 0) * ratio / 100;

                return Math.round(uploaded * ratio + current);
            };
            /**
             * Returns array of filters
             * @param {Array<Function>|String} filters
             * @returns {Array<Function>}
             * @private
             */
            FileUploader.prototype._getFilters = function(filters) {
                if (angular.isUndefined(filters)) return this.filters;
                if (angular.isArray(filters)) return filters;
                var names = filters.split(/\s*,/);
                return this.filters.filter(function(filter) {
                    return names.indexOf(filter.name) !== -1;
                }, this);
            };
            /**
             * Updates html
             * @private
             */
            FileUploader.prototype._render = function() {
                if (!$rootScope.$$phase) $rootScope.$apply();
            };
            /**
             * Returns "true" if item is a file (not folder)
             * @param {File|FileLikeObject} item
             * @returns {Boolean}
             * @private
             */
            FileUploader.prototype._folderFilter = function(item) {
                return !!(item.size || item.type);
            };
            /**
             * Returns "true" if the limit has not been reached
             * @returns {Boolean}
             * @private
             */
            FileUploader.prototype._queueLimitFilter = function() {
                return this.queue.length < this.queueLimit;
            };
            /**
             * Returns "true" if file pass all filters
             * @param {File|Object} file
             * @param {Array<Function>} filters
             * @param {Object} options
             * @returns {Boolean}
             * @private
             */
            FileUploader.prototype._isValidFile = function(file, filters, options) {
                this._failFilterIndex = -1;
                return !filters.length ? true : filters.every(function(filter) {
                    this._failFilterIndex++;
                    return filter.fn.call(this, file, options);
                }, this);
            };
            /**
             * Returns a file or a file-like object
             * @param {File|HTMLInputElement} some
             * @returns {File|Object}
             * @private
             */
            FileUploader.prototype._getFileOrFileLikeObject = function(some) {
                if (this.isFile(some) || this.isFileLikeObject(some)) return some;
                return new FileUploader.FileLikeObject(some.value);
            };
            /**
             * Checks whether upload successful
             * @param {Number} status
             * @returns {Boolean}
             * @private
             */
            FileUploader.prototype._isSuccessCode = function(status) {
                return (status >= 200 && status < 300) || status === 304;
            };
            /**
             * Transforms the server response
             * @param {*} response
             * @returns {*}
             * @private
             */
            FileUploader.prototype._transformResponse = function(response) {
                angular.forEach($http.defaults.transformResponse, function(transformFn) {
                    response = transformFn(response);
                });
                return response;
            };
            /**
             * Parsed response headers
             * @param headers
             * @returns {Object}
             * @see https://github.com/angular/angular.js/blob/master/src/ng/http.js
             * @private
             */
            FileUploader.prototype._parseHeaders = function(headers) {
                var parsed = {}, key, val, i;

                if (!headers) return parsed;

                function trim(string) {
                    return string.replace(/^\s+/, '').replace(/\s+$/, '');
                }
                function lowercase(string) {
                    return string.toLowerCase();
                }

                angular.forEach(headers.split('\n'), function(line) {
                    i = line.indexOf(':');
                    key = lowercase(trim(line.substr(0, i)));
                    val = trim(line.substr(i + 1));

                    if (key) {
                        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
                    }
                });

                return parsed;
            };
            /**
             * The XMLHttpRequest transport
             * @param {FileItem} item
             * @private
             */
            FileUploader.prototype._xhrTransport = function(item) {
                var xhr = item._xhr = new XMLHttpRequest();
                var form = new FormData();
                var that = this;

                that._onBeforeUploadItem(item);

                angular.forEach(item.formData, function(obj) {
                    angular.forEach(obj, function(value, key) {
                        form.append(key, value);
                    });
                });

                form.append(item.alias, item._file);

                xhr.upload.onprogress = function(event) {
                    var progress = Math.round(event.lengthComputable ? event.loaded * 100 / event.total : 0);
                    that._onProgressItem(item, progress);
                };

                xhr.onload = function() {
                    var headers = that._parseHeaders(xhr.getAllResponseHeaders());
                    var response = that._transformResponse(xhr.response);
                    var gist = that._isSuccessCode(xhr.status) ? 'Success' : 'Error';
                    var method = '_on' + gist + 'Item';
                    that[method](item, response, xhr.status, headers);
                    that._onCompleteItem(item, response, xhr.status, headers);
                };

                xhr.onerror = function() {
                    var headers = that._parseHeaders(xhr.getAllResponseHeaders());
                    var response = that._transformResponse(xhr.response);
                    that._onErrorItem(item, response, xhr.status, headers);
                    that._onCompleteItem(item, response, xhr.status, headers);
                };

                xhr.onabort = function() {
                    var headers = that._parseHeaders(xhr.getAllResponseHeaders());
                    var response = that._transformResponse(xhr.response);
                    that._onCancelItem(item, response, xhr.status, headers);
                    that._onCompleteItem(item, response, xhr.status, headers);
                };

                xhr.open(item.method, item.url, true);

                xhr.withCredentials = item.withCredentials;

                angular.forEach(item.headers, function(value, name) {
                    xhr.setRequestHeader(name, value);
                });

                xhr.send(form);
                this._render();
            };
            /**
             * The IFrame transport
             * @param {FileItem} item
             * @private
             */
            FileUploader.prototype._iframeTransport = function(item) {
                var form = angular.element('<form style="display: none;" />');
                var iframe = angular.element('<iframe name="iframeTransport' + Date.now() + '">');
                var input = item._input;
                var that = this;

                if (item._form) item._form.replaceWith(input); // remove old form
                item._form = form; // save link to new form

                that._onBeforeUploadItem(item);

                input.prop('name', item.alias);

                angular.forEach(item.formData, function(obj) {
                    angular.forEach(obj, function(value, key) {
                        form.append(angular.element('<input type="hidden" name="' + key + '" value="' + value + '" />'));
                    });
                });

                form.prop({
                    action: item.url,
                    method: 'POST',
                    target: iframe.prop('name'),
                    enctype: 'multipart/form-data',
                    encoding: 'multipart/form-data' // old IE
                });

                iframe.bind('load', function() {
                    try {
                        // Fix for legacy IE browsers that loads internal error page
                        // when failed WS response received. In consequence iframe
                        // content access denied error is thrown becouse trying to
                        // access cross domain page. When such thing occurs notifying
                        // with empty response object. See more info at:
                        // http://stackoverflow.com/questions/151362/access-is-denied-error-on-accessing-iframe-document-object
                        // Note that if non standard 4xx or 5xx error code returned
                        // from WS then response content can be accessed without error
                        // but 'XHR' status becomes 200. In order to avoid confusion
                        // returning response via same 'success' event handler.

                        // fixed angular.contents() for iframes
                        var html = iframe[0].contentDocument.body.innerHTML;
                    } catch (e) {}

                    var xhr = {response: html, status: 200, dummy: true};
                    var response = that._transformResponse(xhr.response);
                    var headers = {};

                    that._onSuccessItem(item, response, xhr.status, headers);
                    that._onCompleteItem(item, response, xhr.status, headers);
                });

                form.abort = function() {
                    var xhr = {status: 0, dummy: true};
                    var headers = {};
                    var response;

                    iframe.unbind('load').prop('src', 'javascript:false;');
                    form.replaceWith(input);

                    that._onCancelItem(item, response, xhr.status, headers);
                    that._onCompleteItem(item, response, xhr.status, headers);
                };

                input.after(form);
                form.append(input).append(iframe);

                form[0].submit();
                this._render();
            };
            /**
             * Inner callback
             * @param {File|Object} item
             * @param {Object} filter
             * @param {Object} options
             * @private
             */
            FileUploader.prototype._onWhenAddingFileFailed = function(item, filter, options) {
                this.onWhenAddingFileFailed(item, filter, options);
            };
            /**
             * Inner callback
             * @param {FileItem} item
             */
            FileUploader.prototype._onAfterAddingFile = function(item) {
                this.onAfterAddingFile(item);
            };
            /**
             * Inner callback
             * @param {Array<FileItem>} items
             */
            FileUploader.prototype._onAfterAddingAll = function(items) {
                this.onAfterAddingAll(items);
            };
            /**
             *  Inner callback
             * @param {FileItem} item
             * @private
             */
            FileUploader.prototype._onBeforeUploadItem = function(item) {
                item._onBeforeUpload();
                this.onBeforeUploadItem(item);
            };
            /**
             * Inner callback
             * @param {FileItem} item
             * @param {Number} progress
             * @private
             */
            FileUploader.prototype._onProgressItem = function(item, progress) {
                var total = this._getTotalProgress(progress);
                this.progress = total;
                item._onProgress(progress);
                this.onProgressItem(item, progress);
                this.onProgressAll(total);
                this._render();
            };
            /**
             * Inner callback
             * @param {FileItem} item
             * @param {*} response
             * @param {Number} status
             * @param {Object} headers
             * @private
             */
            FileUploader.prototype._onSuccessItem = function(item, response, status, headers) {
                item._onSuccess(response, status, headers);
                this.onSuccessItem(item, response, status, headers);
            };
            /**
             * Inner callback
             * @param {FileItem} item
             * @param {*} response
             * @param {Number} status
             * @param {Object} headers
             * @private
             */
            FileUploader.prototype._onErrorItem = function(item, response, status, headers) {
                item._onError(response, status, headers);
                this.onErrorItem(item, response, status, headers);
            };
            /**
             * Inner callback
             * @param {FileItem} item
             * @param {*} response
             * @param {Number} status
             * @param {Object} headers
             * @private
             */
            FileUploader.prototype._onCancelItem = function(item, response, status, headers) {
                item._onCancel(response, status, headers);
                this.onCancelItem(item, response, status, headers);
            };
            /**
             * Inner callback
             * @param {FileItem} item
             * @param {*} response
             * @param {Number} status
             * @param {Object} headers
             * @private
             */
            FileUploader.prototype._onCompleteItem = function(item, response, status, headers) {
                item._onComplete(response, status, headers);
                this.onCompleteItem(item, response, status, headers);

                var nextItem = this.getReadyItems()[0];
                this.isUploading = false;

                if(angular.isDefined(nextItem)) {
                    nextItem.upload();
                    return;
                }

                this.onCompleteAll();
                this.progress = this._getTotalProgress();
                this._render();
            };
            /**********************
             * STATIC
             **********************/
            /**
             * @borrows FileUploader.prototype.isFile
             */
            FileUploader.isFile = FileUploader.prototype.isFile;
            /**
             * @borrows FileUploader.prototype.isFileLikeObject
             */
            FileUploader.isFileLikeObject = FileUploader.prototype.isFileLikeObject;
            /**
             * @borrows FileUploader.prototype.isHTML5
             */
            FileUploader.isHTML5 = FileUploader.prototype.isHTML5;
            /**
             * Inherits a target (Class_1) by a source (Class_2)
             * @param {Function} target
             * @param {Function} source
             */
            FileUploader.inherit = function(target, source) {
                target.prototype = Object.create(source.prototype);
                target.prototype.constructor = target;
                target.super_ = source;
            };
            FileUploader.FileLikeObject = FileLikeObject;
            FileUploader.FileItem = FileItem;
            FileUploader.FileDirective = FileDirective;
            FileUploader.FileSelect = FileSelect;
            FileUploader.FileDrop = FileDrop;
            FileUploader.FileOver = FileOver;

            // ---------------------------

            /**
             * Creates an instance of FileLikeObject
             * @param {String} fakePath
             * @constructor
             */
            function FileLikeObject(fakePath) {
                var path = fakePath;
                this.lastModifiedDate = null;
                this.size = null;
                this.type = 'like/' + path.slice(path.lastIndexOf('.') + 1).toLowerCase();
                this.name = path.slice(path.lastIndexOf('/') + path.lastIndexOf('\\') + 2);
            }

            // ---------------------------

            /**
             * Creates an instance of FileItem
             * @param {FileUploader} uploader
             * @param {File|FileLikeObject|HTMLInputElement} file
             * @param {File|Object} options
             * @param {HTMLInputElement} [input]
             * @constructor
             */
            function FileItem(uploader, file, options, input) {
                file = uploader._getFileOrFileLikeObject(file);

                angular.extend(this, {
                    url: uploader.url,
                    alias: uploader.alias,
                    headers: angular.copy(uploader.headers),
                    formData: angular.copy(uploader.formData),
                    removeAfterUpload: uploader.removeAfterUpload,
                    withCredentials: uploader.withCredentials,
                    method: uploader.method
                }, options, {
                    uploader: uploader,
                    file: angular.copy(file),
                    isReady: false,
                    isUploading: false,
                    isUploaded: false,
                    isSuccess: false,
                    isCancel: false,
                    isError: false,
                    progress: 0,
                    index: null,
                    _file: file
                });

                if (input) {
                    this._input = angular.element(input);
                    this._replaceNode(this._input);
                }
            }
            /**********************
             * PUBLIC
             **********************/
            /**
             * Uploads a FileItem
             */
            FileItem.prototype.upload = function() {
                this.uploader.uploadItem(this);
            };
            /**
             * Cancels uploading of FileItem
             */
            FileItem.prototype.cancel = function() {
                this.uploader.cancelItem(this);
            };
            /**
             * Removes a FileItem
             */
            FileItem.prototype.remove = function() {
                this.uploader.removeFromQueue(this);
            };
            /**
             * Callback
             * @private
             */
            FileItem.prototype.onBeforeUpload = function() {};
            /**
             * Callback
             * @param {Number} progress
             * @private
             */
            FileItem.prototype.onProgress = function(progress) {};
            /**
             * Callback
             * @param {*} response
             * @param {Number} status
             * @param {Object} headers
             */
            FileItem.prototype.onSuccess = function(response, status, headers) {};
            /**
             * Callback
             * @param {*} response
             * @param {Number} status
             * @param {Object} headers
             */
            FileItem.prototype.onError = function(response, status, headers) {};
            /**
             * Callback
             * @param {*} response
             * @param {Number} status
             * @param {Object} headers
             */
            FileItem.prototype.onCancel = function(response, status, headers) {};
            /**
             * Callback
             * @param {*} response
             * @param {Number} status
             * @param {Object} headers
             */
            FileItem.prototype.onComplete = function(response, status, headers) {};
            /**********************
             * PRIVATE
             **********************/
            /**
             * Inner callback
             */
            FileItem.prototype._onBeforeUpload = function() {
                this.isReady = true;
                this.isUploading = true;
                this.isUploaded = false;
                this.isSuccess = false;
                this.isCancel = false;
                this.isError = false;
                this.progress = 0;
                this.onBeforeUpload();
            };
            /**
             * Inner callback
             * @param {Number} progress
             * @private
             */
            FileItem.prototype._onProgress = function(progress) {
                this.progress = progress;
                this.onProgress(progress);
            };
            /**
             * Inner callback
             * @param {*} response
             * @param {Number} status
             * @param {Object} headers
             * @private
             */
            FileItem.prototype._onSuccess = function(response, status, headers) {
                this.isReady = false;
                this.isUploading = false;
                this.isUploaded = true;
                this.isSuccess = true;
                this.isCancel = false;
                this.isError = false;
                this.progress = 100;
                this.index = null;
                this.onSuccess(response, status, headers);
            };
            /**
             * Inner callback
             * @param {*} response
             * @param {Number} status
             * @param {Object} headers
             * @private
             */
            FileItem.prototype._onError = function(response, status, headers) {
                this.isReady = false;
                this.isUploading = false;
                this.isUploaded = true;
                this.isSuccess = false;
                this.isCancel = false;
                this.isError = true;
                this.progress = 0;
                this.index = null;
                this.onError(response, status, headers);
            };
            /**
             * Inner callback
             * @param {*} response
             * @param {Number} status
             * @param {Object} headers
             * @private
             */
            FileItem.prototype._onCancel = function(response, status, headers) {
                this.isReady = false;
                this.isUploading = false;
                this.isUploaded = false;
                this.isSuccess = false;
                this.isCancel = true;
                this.isError = false;
                this.progress = 0;
                this.index = null;
                this.onCancel(response, status, headers);
            };
            /**
             * Inner callback
             * @param {*} response
             * @param {Number} status
             * @param {Object} headers
             * @private
             */
            FileItem.prototype._onComplete = function(response, status, headers) {
                this.onComplete(response, status, headers);
                if (this.removeAfterUpload) this.remove();
            };
            /**
             * Destroys a FileItem
             */
            FileItem.prototype._destroy = function() {
                if (this._input) this._input.remove();
                if (this._form) this._form.remove();
                delete this._form;
                delete this._input;
            };
            /**
             * Prepares to uploading
             * @private
             */
            FileItem.prototype._prepareToUploading = function() {
                this.index = this.index || ++this.uploader._nextIndex;
                this.isReady = true;
            };
            /**
             * Replaces input element on his clone
             * @param {JQLite|jQuery} input
             * @private
             */
            FileItem.prototype._replaceNode = function(input) {
                var clone = $compile(input.clone())(input.scope());
                clone.prop('value', null); // FF fix
                input.css('display', 'none');
                input.after(clone); // remove jquery dependency
            };

            // ---------------------------

            /**
             * Creates instance of {FileDirective} object
             * @param {Object} options
             * @param {Object} options.uploader
             * @param {HTMLElement} options.element
             * @param {Object} options.events
             * @param {String} options.prop
             * @constructor
             */
            function FileDirective(options) {
                angular.extend(this, options);
                this.uploader._directives[this.prop].push(this);
                this._saveLinks();
                this.bind();
            }
            /**
             * Map of events
             * @type {Object}
             */
            FileDirective.prototype.events = {};
            /**
             * Binds events handles
             */
            FileDirective.prototype.bind = function() {
                for(var key in this.events) {
                    var prop = this.events[key];
                    this.element.bind(key, this[prop]);
                }
            };
            /**
             * Unbinds events handles
             */
            FileDirective.prototype.unbind = function() {
                for(var key in this.events) {
                    this.element.unbind(key, this.events[key]);
                }
            };
            /**
             * Destroys directive
             */
            FileDirective.prototype.destroy = function() {
                var index = this.uploader._directives[this.prop].indexOf(this);
                this.uploader._directives[this.prop].splice(index, 1);
                this.unbind();
                // this.element = null;
            };
            /**
             * Saves links to functions
             * @private
             */
            FileDirective.prototype._saveLinks = function() {
                for(var key in this.events) {
                    var prop = this.events[key];
                    this[prop] = this[prop].bind(this);
                }
            };

            // ---------------------------

            FileUploader.inherit(FileSelect, FileDirective);

            /**
             * Creates instance of {FileSelect} object
             * @param {Object} options
             * @constructor
             */
            function FileSelect(options) {
                FileSelect.super_.apply(this, arguments);

                if(!this.uploader.isHTML5) {
                    this.element.removeAttr('multiple');
                }
                this.element.prop('value', null); // FF fix
            }
            /**
             * Map of events
             * @type {Object}
             */
            FileSelect.prototype.events = {
                $destroy: 'destroy',
                change: 'onChange'
            };
            /**
             * Name of property inside uploader._directive object
             * @type {String}
             */
            FileSelect.prototype.prop = 'select';
            /**
             * Returns options
             * @return {Object|undefined}
             */
            FileSelect.prototype.getOptions = function() {};
            /**
             * Returns filters
             * @return {Array<Function>|String|undefined}
             */
            FileSelect.prototype.getFilters = function() {};
            /**
             * Event handler
             */
            FileSelect.prototype.onChange = function() {
                var files = this.uploader.isHTML5 ? this.element[0].files : this.element[0];
                var options = this.getOptions();
                var filters = this.getFilters();

                if (!this.uploader.isHTML5) this.destroy();
                this.uploader.addToQueue(files, options, filters);
                if (this.uploader.isHTML5) this.element.prop('value', null);
            };

            // ---------------------------

            FileUploader.inherit(FileDrop, FileDirective);

            /**
             * Creates instance of {FileDrop} object
             * @param {Object} options
             * @constructor
             */
            function FileDrop(options) {
                FileDrop.super_.apply(this, arguments);
            }
            /**
             * Map of events
             * @type {Object}
             */
            FileDrop.prototype.events = {
                $destroy: 'destroy',
                drop: 'onDrop',
                dragover: 'onDragOver',
                dragleave: 'onDragLeave'
            };
            /**
             * Name of property inside uploader._directive object
             * @type {String}
             */
            FileDrop.prototype.prop = 'drop';
            /**
             * Returns options
             * @return {Object|undefined}
             */
            FileDrop.prototype.getOptions = function() {};
            /**
             * Returns filters
             * @return {Array<Function>|String|undefined}
             */
            FileDrop.prototype.getFilters = function() {};
            /**
             * Event handler
             */
            FileDrop.prototype.onDrop = function(event) {
                var transfer = this._getTransfer(event);
                if (!transfer) return;
                var options = this.getOptions();
                var filters = this.getFilters();
                this._preventAndStop(event);
                angular.forEach(this.uploader._directives.over, this._removeOverClass, this);
                this.uploader.addToQueue(transfer.files, options, filters);
            };
            /**
             * Event handler
             */
            FileDrop.prototype.onDragOver = function(event) {
                var transfer = this._getTransfer(event);
                if(!this._haveFiles(transfer.types)) return;
                transfer.dropEffect = 'copy';
                this._preventAndStop(event);
                angular.forEach(this.uploader._directives.over, this._addOverClass, this);
            };
            /**
             * Event handler
             */
            FileDrop.prototype.onDragLeave = function(event) {
                if (event.target !== this.element[0]) return;
                this._preventAndStop(event);
                angular.forEach(this.uploader._directives.over, this._removeOverClass, this);
            };
            /**
             * Helper
             */
            FileDrop.prototype._getTransfer = function(event) {
                return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer; // jQuery fix;
            };
            /**
             * Helper
             */
            FileDrop.prototype._preventAndStop = function(event) {
                event.preventDefault();
                event.stopPropagation();
            };
            /**
             * Returns "true" if types contains files
             * @param {Object} types
             */
            FileDrop.prototype._haveFiles = function(types) {
                if (!types) return false;
                if (types.indexOf) {
                    return types.indexOf('Files') !== -1;
                } else if(types.contains) {
                    return types.contains('Files');
                } else {
                    return false;
                }
            };
            /**
             * Callback
             */
            FileDrop.prototype._addOverClass = function(item) {
                item.addOverClass();
            };
            /**
             * Callback
             */
            FileDrop.prototype._removeOverClass = function(item) {
                item.removeOverClass();
            };

            // ---------------------------

            FileUploader.inherit(FileOver, FileDirective);

            /**
             * Creates instance of {FileDrop} object
             * @param {Object} options
             * @constructor
             */
            function FileOver(options) {
                FileOver.super_.apply(this, arguments);
            }
            /**
             * Map of events
             * @type {Object}
             */
            FileOver.prototype.events = {
                $destroy: 'destroy'
            };
            /**
             * Name of property inside uploader._directive object
             * @type {String}
             */
            FileOver.prototype.prop = 'over';
            /**
             * Over class
             * @type {string}
             */
            FileOver.prototype.overClass = 'nv-file-over';
            /**
             * Adds over class
             */
            FileOver.prototype.addOverClass = function() {
                this.element.addClass(this.getOverClass());
            };
            /**
             * Removes over class
             */
            FileOver.prototype.removeOverClass = function() {
                this.element.removeClass(this.getOverClass());
            };
            /**
             * Returns over class
             * @returns {String}
             */
            FileOver.prototype.getOverClass = function() {
                return this.overClass;
            };

            return FileUploader;
        }])


    .directive('nvFileSelect', ['$parse', 'FileUploader', function($parse, FileUploader) {
        return {
            link: function(scope, element, attributes) {
                var uploader = scope.$eval(attributes.uploader);

                if (!(uploader instanceof FileUploader)) {
                    throw new TypeError('"Uploader" must be an instance of FileUploader');
                }

                var object = new FileUploader.FileSelect({
                    uploader: uploader,
                    element: element
                });

                object.getOptions = $parse(attributes.options).bind(object, scope);
                object.getFilters = function() {return attributes.filters;};
            }
        };
    }])


    .directive('nvFileDrop', ['$parse', 'FileUploader', function($parse, FileUploader) {
        return {
            link: function(scope, element, attributes) {
                var uploader = scope.$eval(attributes.uploader);

                if (!(uploader instanceof FileUploader)) {
                    throw new TypeError('"Uploader" must be an instance of FileUploader');
                }

                if (!uploader.isHTML5) return;

                var object = new FileUploader.FileDrop({
                    uploader: uploader,
                    element: element
                });

                object.getOptions = $parse(attributes.options).bind(object, scope);
                object.getFilters = function() {return attributes.filters;};
            }
        };
    }])


    .directive('nvFileOver', ['FileUploader', function(FileUploader) {
        return {
            link: function(scope, element, attributes) {
                var uploader = scope.$eval(attributes.uploader);

                if (!(uploader instanceof FileUploader)) {
                    throw new TypeError('"Uploader" must be an instance of FileUploader');
                }

                var object = new FileUploader.FileOver({
                    uploader: uploader,
                    element: element
                });

                object.getOverClass = function() {
                    return attributes.overClass || this.overClass;
                };
            }
        };
    }])
    return module;
}));/*!
 * Chart.js
 * http://chartjs.org/
 * Version: 1.0.2
 *
 * Copyright 2015 Nick Downie
 * Released under the MIT license
 * https://github.com/nnnick/Chart.js/blob/master/LICENSE.md
 */
(function(){"use strict";var t=this,i=t.Chart,e=function(t){this.canvas=t.canvas,this.ctx=t;var i=function(t,i){return t["offset"+i]?t["offset"+i]:document.defaultView.getComputedStyle(t).getPropertyValue(i)},e=this.width=i(t.canvas,"Width"),n=this.height=i(t.canvas,"Height");t.canvas.width=e,t.canvas.height=n;var e=this.width=t.canvas.width,n=this.height=t.canvas.height;return this.aspectRatio=this.width/this.height,s.retinaScale(this),this};e.defaults={global:{animation:!0,animationSteps:60,animationEasing:"easeOutQuart",showScale:!0,scaleOverride:!1,scaleSteps:null,scaleStepWidth:null,scaleStartValue:null,scaleLineColor:"rgba(0,0,0,.1)",scaleLineWidth:1,scaleShowLabels:!0,scaleLabel:"<%=value%>",scaleIntegersOnly:!0,scaleBeginAtZero:!1,scaleFontFamily:"'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",scaleFontSize:12,scaleFontStyle:"normal",scaleFontColor:"#666",responsive:!1,maintainAspectRatio:!0,showTooltips:!0,customTooltips:!1,tooltipEvents:["mousemove","touchstart","touchmove","mouseout"],tooltipFillColor:"rgba(0,0,0,0.8)",tooltipFontFamily:"'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",tooltipFontSize:14,tooltipFontStyle:"normal",tooltipFontColor:"#fff",tooltipTitleFontFamily:"'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",tooltipTitleFontSize:14,tooltipTitleFontStyle:"bold",tooltipTitleFontColor:"#fff",tooltipYPadding:6,tooltipXPadding:6,tooltipCaretSize:8,tooltipCornerRadius:6,tooltipXOffset:10,tooltipTemplate:"<%if (label){%><%=label%>: <%}%><%= value %>",multiTooltipTemplate:"<%= value %>",multiTooltipKeyBackground:"#fff",onAnimationProgress:function(){},onAnimationComplete:function(){}}},e.types={};var s=e.helpers={},n=s.each=function(t,i,e){var s=Array.prototype.slice.call(arguments,3);if(t)if(t.length===+t.length){var n;for(n=0;n<t.length;n++)i.apply(e,[t[n],n].concat(s))}else for(var o in t)i.apply(e,[t[o],o].concat(s))},o=s.clone=function(t){var i={};return n(t,function(e,s){t.hasOwnProperty(s)&&(i[s]=e)}),i},a=s.extend=function(t){return n(Array.prototype.slice.call(arguments,1),function(i){n(i,function(e,s){i.hasOwnProperty(s)&&(t[s]=e)})}),t},h=s.merge=function(){var t=Array.prototype.slice.call(arguments,0);return t.unshift({}),a.apply(null,t)},l=s.indexOf=function(t,i){if(Array.prototype.indexOf)return t.indexOf(i);for(var e=0;e<t.length;e++)if(t[e]===i)return e;return-1},r=(s.where=function(t,i){var e=[];return s.each(t,function(t){i(t)&&e.push(t)}),e},s.findNextWhere=function(t,i,e){e||(e=-1);for(var s=e+1;s<t.length;s++){var n=t[s];if(i(n))return n}},s.findPreviousWhere=function(t,i,e){e||(e=t.length);for(var s=e-1;s>=0;s--){var n=t[s];if(i(n))return n}},s.inherits=function(t){var i=this,e=t&&t.hasOwnProperty("constructor")?t.constructor:function(){return i.apply(this,arguments)},s=function(){this.constructor=e};return s.prototype=i.prototype,e.prototype=new s,e.extend=r,t&&a(e.prototype,t),e.__super__=i.prototype,e}),c=s.noop=function(){},u=s.uid=function(){var t=0;return function(){return"chart-"+t++}}(),d=s.warn=function(t){window.console&&"function"==typeof window.console.warn&&console.warn(t)},p=s.amd="function"==typeof define&&define.amd,f=s.isNumber=function(t){return!isNaN(parseFloat(t))&&isFinite(t)},g=s.max=function(t){return Math.max.apply(Math,t)},m=s.min=function(t){return Math.min.apply(Math,t)},v=(s.cap=function(t,i,e){if(f(i)){if(t>i)return i}else if(f(e)&&e>t)return e;return t},s.getDecimalPlaces=function(t){return t%1!==0&&f(t)?t.toString().split(".")[1].length:0}),S=s.radians=function(t){return t*(Math.PI/180)},x=(s.getAngleFromPoint=function(t,i){var e=i.x-t.x,s=i.y-t.y,n=Math.sqrt(e*e+s*s),o=2*Math.PI+Math.atan2(s,e);return 0>e&&0>s&&(o+=2*Math.PI),{angle:o,distance:n}},s.aliasPixel=function(t){return t%2===0?0:.5}),y=(s.splineCurve=function(t,i,e,s){var n=Math.sqrt(Math.pow(i.x-t.x,2)+Math.pow(i.y-t.y,2)),o=Math.sqrt(Math.pow(e.x-i.x,2)+Math.pow(e.y-i.y,2)),a=s*n/(n+o),h=s*o/(n+o);return{inner:{x:i.x-a*(e.x-t.x),y:i.y-a*(e.y-t.y)},outer:{x:i.x+h*(e.x-t.x),y:i.y+h*(e.y-t.y)}}},s.calculateOrderOfMagnitude=function(t){return Math.floor(Math.log(t)/Math.LN10)}),C=(s.calculateScaleRange=function(t,i,e,s,n){var o=2,a=Math.floor(i/(1.5*e)),h=o>=a,l=g(t),r=m(t);l===r&&(l+=.5,r>=.5&&!s?r-=.5:l+=.5);for(var c=Math.abs(l-r),u=y(c),d=Math.ceil(l/(1*Math.pow(10,u)))*Math.pow(10,u),p=s?0:Math.floor(r/(1*Math.pow(10,u)))*Math.pow(10,u),f=d-p,v=Math.pow(10,u),S=Math.round(f/v);(S>a||a>2*S)&&!h;)if(S>a)v*=2,S=Math.round(f/v),S%1!==0&&(h=!0);else if(n&&u>=0){if(v/2%1!==0)break;v/=2,S=Math.round(f/v)}else v/=2,S=Math.round(f/v);return h&&(S=o,v=f/S),{steps:S,stepValue:v,min:p,max:p+S*v}},s.template=function(t,i){function e(t,i){var e=/\W/.test(t)?new Function("obj","var p=[],print=function(){p.push.apply(p,arguments);};with(obj){p.push('"+t.replace(/[\r\t\n]/g," ").split("<%").join("	").replace(/((^|%>)[^\t]*)'/g,"$1\r").replace(/\t=(.*?)%>/g,"',$1,'").split("	").join("');").split("%>").join("p.push('").split("\r").join("\\'")+"');}return p.join('');"):s[t]=s[t];return i?e(i):e}if(t instanceof Function)return t(i);var s={};return e(t,i)}),w=(s.generateLabels=function(t,i,e,s){var o=new Array(i);return labelTemplateString&&n(o,function(i,n){o[n]=C(t,{value:e+s*(n+1)})}),o},s.easingEffects={linear:function(t){return t},easeInQuad:function(t){return t*t},easeOutQuad:function(t){return-1*t*(t-2)},easeInOutQuad:function(t){return(t/=.5)<1?.5*t*t:-0.5*(--t*(t-2)-1)},easeInCubic:function(t){return t*t*t},easeOutCubic:function(t){return 1*((t=t/1-1)*t*t+1)},easeInOutCubic:function(t){return(t/=.5)<1?.5*t*t*t:.5*((t-=2)*t*t+2)},easeInQuart:function(t){return t*t*t*t},easeOutQuart:function(t){return-1*((t=t/1-1)*t*t*t-1)},easeInOutQuart:function(t){return(t/=.5)<1?.5*t*t*t*t:-0.5*((t-=2)*t*t*t-2)},easeInQuint:function(t){return 1*(t/=1)*t*t*t*t},easeOutQuint:function(t){return 1*((t=t/1-1)*t*t*t*t+1)},easeInOutQuint:function(t){return(t/=.5)<1?.5*t*t*t*t*t:.5*((t-=2)*t*t*t*t+2)},easeInSine:function(t){return-1*Math.cos(t/1*(Math.PI/2))+1},easeOutSine:function(t){return 1*Math.sin(t/1*(Math.PI/2))},easeInOutSine:function(t){return-0.5*(Math.cos(Math.PI*t/1)-1)},easeInExpo:function(t){return 0===t?1:1*Math.pow(2,10*(t/1-1))},easeOutExpo:function(t){return 1===t?1:1*(-Math.pow(2,-10*t/1)+1)},easeInOutExpo:function(t){return 0===t?0:1===t?1:(t/=.5)<1?.5*Math.pow(2,10*(t-1)):.5*(-Math.pow(2,-10*--t)+2)},easeInCirc:function(t){return t>=1?t:-1*(Math.sqrt(1-(t/=1)*t)-1)},easeOutCirc:function(t){return 1*Math.sqrt(1-(t=t/1-1)*t)},easeInOutCirc:function(t){return(t/=.5)<1?-0.5*(Math.sqrt(1-t*t)-1):.5*(Math.sqrt(1-(t-=2)*t)+1)},easeInElastic:function(t){var i=1.70158,e=0,s=1;return 0===t?0:1==(t/=1)?1:(e||(e=.3),s<Math.abs(1)?(s=1,i=e/4):i=e/(2*Math.PI)*Math.asin(1/s),-(s*Math.pow(2,10*(t-=1))*Math.sin(2*(1*t-i)*Math.PI/e)))},easeOutElastic:function(t){var i=1.70158,e=0,s=1;return 0===t?0:1==(t/=1)?1:(e||(e=.3),s<Math.abs(1)?(s=1,i=e/4):i=e/(2*Math.PI)*Math.asin(1/s),s*Math.pow(2,-10*t)*Math.sin(2*(1*t-i)*Math.PI/e)+1)},easeInOutElastic:function(t){var i=1.70158,e=0,s=1;return 0===t?0:2==(t/=.5)?1:(e||(e=.3*1.5),s<Math.abs(1)?(s=1,i=e/4):i=e/(2*Math.PI)*Math.asin(1/s),1>t?-.5*s*Math.pow(2,10*(t-=1))*Math.sin(2*(1*t-i)*Math.PI/e):s*Math.pow(2,-10*(t-=1))*Math.sin(2*(1*t-i)*Math.PI/e)*.5+1)},easeInBack:function(t){var i=1.70158;return 1*(t/=1)*t*((i+1)*t-i)},easeOutBack:function(t){var i=1.70158;return 1*((t=t/1-1)*t*((i+1)*t+i)+1)},easeInOutBack:function(t){var i=1.70158;return(t/=.5)<1?.5*t*t*(((i*=1.525)+1)*t-i):.5*((t-=2)*t*(((i*=1.525)+1)*t+i)+2)},easeInBounce:function(t){return 1-w.easeOutBounce(1-t)},easeOutBounce:function(t){return(t/=1)<1/2.75?7.5625*t*t:2/2.75>t?1*(7.5625*(t-=1.5/2.75)*t+.75):2.5/2.75>t?1*(7.5625*(t-=2.25/2.75)*t+.9375):1*(7.5625*(t-=2.625/2.75)*t+.984375)},easeInOutBounce:function(t){return.5>t?.5*w.easeInBounce(2*t):.5*w.easeOutBounce(2*t-1)+.5}}),b=s.requestAnimFrame=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(t){return window.setTimeout(t,1e3/60)}}(),P=s.cancelAnimFrame=function(){return window.cancelAnimationFrame||window.webkitCancelAnimationFrame||window.mozCancelAnimationFrame||window.oCancelAnimationFrame||window.msCancelAnimationFrame||function(t){return window.clearTimeout(t,1e3/60)}}(),L=(s.animationLoop=function(t,i,e,s,n,o){var a=0,h=w[e]||w.linear,l=function(){a++;var e=a/i,r=h(e);t.call(o,r,e,a),s.call(o,r,e),i>a?o.animationFrame=b(l):n.apply(o)};b(l)},s.getRelativePosition=function(t){var i,e,s=t.originalEvent||t,n=t.currentTarget||t.srcElement,o=n.getBoundingClientRect();return s.touches?(i=s.touches[0].clientX-o.left,e=s.touches[0].clientY-o.top):(i=s.clientX-o.left,e=s.clientY-o.top),{x:i,y:e}},s.addEvent=function(t,i,e){t.addEventListener?t.addEventListener(i,e):t.attachEvent?t.attachEvent("on"+i,e):t["on"+i]=e}),k=s.removeEvent=function(t,i,e){t.removeEventListener?t.removeEventListener(i,e,!1):t.detachEvent?t.detachEvent("on"+i,e):t["on"+i]=c},F=(s.bindEvents=function(t,i,e){t.events||(t.events={}),n(i,function(i){t.events[i]=function(){e.apply(t,arguments)},L(t.chart.canvas,i,t.events[i])})},s.unbindEvents=function(t,i){n(i,function(i,e){k(t.chart.canvas,e,i)})}),R=s.getMaximumWidth=function(t){var i=t.parentNode;return i.clientWidth},T=s.getMaximumHeight=function(t){var i=t.parentNode;return i.clientHeight},A=(s.getMaximumSize=s.getMaximumWidth,s.retinaScale=function(t){var i=t.ctx,e=t.canvas.width,s=t.canvas.height;window.devicePixelRatio&&(i.canvas.style.width=e+"px",i.canvas.style.height=s+"px",i.canvas.height=s*window.devicePixelRatio,i.canvas.width=e*window.devicePixelRatio,i.scale(window.devicePixelRatio,window.devicePixelRatio))}),M=s.clear=function(t){t.ctx.clearRect(0,0,t.width,t.height)},W=s.fontString=function(t,i,e){return i+" "+t+"px "+e},z=s.longestText=function(t,i,e){t.font=i;var s=0;return n(e,function(i){var e=t.measureText(i).width;s=e>s?e:s}),s},B=s.drawRoundedRectangle=function(t,i,e,s,n,o){t.beginPath(),t.moveTo(i+o,e),t.lineTo(i+s-o,e),t.quadraticCurveTo(i+s,e,i+s,e+o),t.lineTo(i+s,e+n-o),t.quadraticCurveTo(i+s,e+n,i+s-o,e+n),t.lineTo(i+o,e+n),t.quadraticCurveTo(i,e+n,i,e+n-o),t.lineTo(i,e+o),t.quadraticCurveTo(i,e,i+o,e),t.closePath()};e.instances={},e.Type=function(t,i,s){this.options=i,this.chart=s,this.id=u(),e.instances[this.id]=this,i.responsive&&this.resize(),this.initialize.call(this,t)},a(e.Type.prototype,{initialize:function(){return this},clear:function(){return M(this.chart),this},stop:function(){return P(this.animationFrame),this},resize:function(t){this.stop();var i=this.chart.canvas,e=R(this.chart.canvas),s=this.options.maintainAspectRatio?e/this.chart.aspectRatio:T(this.chart.canvas);return i.width=this.chart.width=e,i.height=this.chart.height=s,A(this.chart),"function"==typeof t&&t.apply(this,Array.prototype.slice.call(arguments,1)),this},reflow:c,render:function(t){return t&&this.reflow(),this.options.animation&&!t?s.animationLoop(this.draw,this.options.animationSteps,this.options.animationEasing,this.options.onAnimationProgress,this.options.onAnimationComplete,this):(this.draw(),this.options.onAnimationComplete.call(this)),this},generateLegend:function(){return C(this.options.legendTemplate,this)},destroy:function(){this.clear(),F(this,this.events);var t=this.chart.canvas;t.width=this.chart.width,t.height=this.chart.height,t.style.removeProperty?(t.style.removeProperty("width"),t.style.removeProperty("height")):(t.style.removeAttribute("width"),t.style.removeAttribute("height")),delete e.instances[this.id]},showTooltip:function(t,i){"undefined"==typeof this.activeElements&&(this.activeElements=[]);var o=function(t){var i=!1;return t.length!==this.activeElements.length?i=!0:(n(t,function(t,e){t!==this.activeElements[e]&&(i=!0)},this),i)}.call(this,t);if(o||i){if(this.activeElements=t,this.draw(),this.options.customTooltips&&this.options.customTooltips(!1),t.length>0)if(this.datasets&&this.datasets.length>1){for(var a,h,r=this.datasets.length-1;r>=0&&(a=this.datasets[r].points||this.datasets[r].bars||this.datasets[r].segments,h=l(a,t[0]),-1===h);r--);var c=[],u=[],d=function(){var t,i,e,n,o,a=[],l=[],r=[];return s.each(this.datasets,function(i){t=i.points||i.bars||i.segments,t[h]&&t[h].hasValue()&&a.push(t[h])}),s.each(a,function(t){l.push(t.x),r.push(t.y),c.push(s.template(this.options.multiTooltipTemplate,t)),u.push({fill:t._saved.fillColor||t.fillColor,stroke:t._saved.strokeColor||t.strokeColor})},this),o=m(r),e=g(r),n=m(l),i=g(l),{x:n>this.chart.width/2?n:i,y:(o+e)/2}}.call(this,h);new e.MultiTooltip({x:d.x,y:d.y,xPadding:this.options.tooltipXPadding,yPadding:this.options.tooltipYPadding,xOffset:this.options.tooltipXOffset,fillColor:this.options.tooltipFillColor,textColor:this.options.tooltipFontColor,fontFamily:this.options.tooltipFontFamily,fontStyle:this.options.tooltipFontStyle,fontSize:this.options.tooltipFontSize,titleTextColor:this.options.tooltipTitleFontColor,titleFontFamily:this.options.tooltipTitleFontFamily,titleFontStyle:this.options.tooltipTitleFontStyle,titleFontSize:this.options.tooltipTitleFontSize,cornerRadius:this.options.tooltipCornerRadius,labels:c,legendColors:u,legendColorBackground:this.options.multiTooltipKeyBackground,title:t[0].label,chart:this.chart,ctx:this.chart.ctx,custom:this.options.customTooltips}).draw()}else n(t,function(t){var i=t.tooltipPosition();new e.Tooltip({x:Math.round(i.x),y:Math.round(i.y),xPadding:this.options.tooltipXPadding,yPadding:this.options.tooltipYPadding,fillColor:this.options.tooltipFillColor,textColor:this.options.tooltipFontColor,fontFamily:this.options.tooltipFontFamily,fontStyle:this.options.tooltipFontStyle,fontSize:this.options.tooltipFontSize,caretHeight:this.options.tooltipCaretSize,cornerRadius:this.options.tooltipCornerRadius,text:C(this.options.tooltipTemplate,t),chart:this.chart,custom:this.options.customTooltips}).draw()},this);return this}},toBase64Image:function(){return this.chart.canvas.toDataURL.apply(this.chart.canvas,arguments)}}),e.Type.extend=function(t){var i=this,s=function(){return i.apply(this,arguments)};if(s.prototype=o(i.prototype),a(s.prototype,t),s.extend=e.Type.extend,t.name||i.prototype.name){var n=t.name||i.prototype.name,l=e.defaults[i.prototype.name]?o(e.defaults[i.prototype.name]):{};e.defaults[n]=a(l,t.defaults),e.types[n]=s,e.prototype[n]=function(t,i){var o=h(e.defaults.global,e.defaults[n],i||{});return new s(t,o,this)}}else d("Name not provided for this chart, so it hasn't been registered");return i},e.Element=function(t){a(this,t),this.initialize.apply(this,arguments),this.save()},a(e.Element.prototype,{initialize:function(){},restore:function(t){return t?n(t,function(t){this[t]=this._saved[t]},this):a(this,this._saved),this},save:function(){return this._saved=o(this),delete this._saved._saved,this},update:function(t){return n(t,function(t,i){this._saved[i]=this[i],this[i]=t},this),this},transition:function(t,i){return n(t,function(t,e){this[e]=(t-this._saved[e])*i+this._saved[e]},this),this},tooltipPosition:function(){return{x:this.x,y:this.y}},hasValue:function(){return f(this.value)}}),e.Element.extend=r,e.Point=e.Element.extend({display:!0,inRange:function(t,i){var e=this.hitDetectionRadius+this.radius;return Math.pow(t-this.x,2)+Math.pow(i-this.y,2)<Math.pow(e,2)},draw:function(){if(this.display){var t=this.ctx;t.beginPath(),t.arc(this.x,this.y,this.radius,0,2*Math.PI),t.closePath(),t.strokeStyle=this.strokeColor,t.lineWidth=this.strokeWidth,t.fillStyle=this.fillColor,t.fill(),t.stroke()}}}),e.Arc=e.Element.extend({inRange:function(t,i){var e=s.getAngleFromPoint(this,{x:t,y:i}),n=e.angle>=this.startAngle&&e.angle<=this.endAngle,o=e.distance>=this.innerRadius&&e.distance<=this.outerRadius;return n&&o},tooltipPosition:function(){var t=this.startAngle+(this.endAngle-this.startAngle)/2,i=(this.outerRadius-this.innerRadius)/2+this.innerRadius;return{x:this.x+Math.cos(t)*i,y:this.y+Math.sin(t)*i}},draw:function(t){var i=this.ctx;i.beginPath(),i.arc(this.x,this.y,this.outerRadius,this.startAngle,this.endAngle),i.arc(this.x,this.y,this.innerRadius,this.endAngle,this.startAngle,!0),i.closePath(),i.strokeStyle=this.strokeColor,i.lineWidth=this.strokeWidth,i.fillStyle=this.fillColor,i.fill(),i.lineJoin="bevel",this.showStroke&&i.stroke()}}),e.Rectangle=e.Element.extend({draw:function(){var t=this.ctx,i=this.width/2,e=this.x-i,s=this.x+i,n=this.base-(this.base-this.y),o=this.strokeWidth/2;this.showStroke&&(e+=o,s-=o,n+=o),t.beginPath(),t.fillStyle=this.fillColor,t.strokeStyle=this.strokeColor,t.lineWidth=this.strokeWidth,t.moveTo(e,this.base),t.lineTo(e,n),t.lineTo(s,n),t.lineTo(s,this.base),t.fill(),this.showStroke&&t.stroke()},height:function(){return this.base-this.y},inRange:function(t,i){return t>=this.x-this.width/2&&t<=this.x+this.width/2&&i>=this.y&&i<=this.base}}),e.Tooltip=e.Element.extend({draw:function(){var t=this.chart.ctx;t.font=W(this.fontSize,this.fontStyle,this.fontFamily),this.xAlign="center",this.yAlign="above";var i=this.caretPadding=2,e=t.measureText(this.text).width+2*this.xPadding,s=this.fontSize+2*this.yPadding,n=s+this.caretHeight+i;this.x+e/2>this.chart.width?this.xAlign="left":this.x-e/2<0&&(this.xAlign="right"),this.y-n<0&&(this.yAlign="below");var o=this.x-e/2,a=this.y-n;if(t.fillStyle=this.fillColor,this.custom)this.custom(this);else{switch(this.yAlign){case"above":t.beginPath(),t.moveTo(this.x,this.y-i),t.lineTo(this.x+this.caretHeight,this.y-(i+this.caretHeight)),t.lineTo(this.x-this.caretHeight,this.y-(i+this.caretHeight)),t.closePath(),t.fill();break;case"below":a=this.y+i+this.caretHeight,t.beginPath(),t.moveTo(this.x,this.y+i),t.lineTo(this.x+this.caretHeight,this.y+i+this.caretHeight),t.lineTo(this.x-this.caretHeight,this.y+i+this.caretHeight),t.closePath(),t.fill()}switch(this.xAlign){case"left":o=this.x-e+(this.cornerRadius+this.caretHeight);break;case"right":o=this.x-(this.cornerRadius+this.caretHeight)}B(t,o,a,e,s,this.cornerRadius),t.fill(),t.fillStyle=this.textColor,t.textAlign="center",t.textBaseline="middle",t.fillText(this.text,o+e/2,a+s/2)}}}),e.MultiTooltip=e.Element.extend({initialize:function(){this.font=W(this.fontSize,this.fontStyle,this.fontFamily),this.titleFont=W(this.titleFontSize,this.titleFontStyle,this.titleFontFamily),this.height=this.labels.length*this.fontSize+(this.labels.length-1)*(this.fontSize/2)+2*this.yPadding+1.5*this.titleFontSize,this.ctx.font=this.titleFont;var t=this.ctx.measureText(this.title).width,i=z(this.ctx,this.font,this.labels)+this.fontSize+3,e=g([i,t]);this.width=e+2*this.xPadding;var s=this.height/2;this.y-s<0?this.y=s:this.y+s>this.chart.height&&(this.y=this.chart.height-s),this.x>this.chart.width/2?this.x-=this.xOffset+this.width:this.x+=this.xOffset},getLineHeight:function(t){var i=this.y-this.height/2+this.yPadding,e=t-1;return 0===t?i+this.titleFontSize/2:i+(1.5*this.fontSize*e+this.fontSize/2)+1.5*this.titleFontSize},draw:function(){if(this.custom)this.custom(this);else{B(this.ctx,this.x,this.y-this.height/2,this.width,this.height,this.cornerRadius);var t=this.ctx;t.fillStyle=this.fillColor,t.fill(),t.closePath(),t.textAlign="left",t.textBaseline="middle",t.fillStyle=this.titleTextColor,t.font=this.titleFont,t.fillText(this.title,this.x+this.xPadding,this.getLineHeight(0)),t.font=this.font,s.each(this.labels,function(i,e){t.fillStyle=this.textColor,t.fillText(i,this.x+this.xPadding+this.fontSize+3,this.getLineHeight(e+1)),t.fillStyle=this.legendColorBackground,t.fillRect(this.x+this.xPadding,this.getLineHeight(e+1)-this.fontSize/2,this.fontSize,this.fontSize),t.fillStyle=this.legendColors[e].fill,t.fillRect(this.x+this.xPadding,this.getLineHeight(e+1)-this.fontSize/2,this.fontSize,this.fontSize)},this)}}}),e.Scale=e.Element.extend({initialize:function(){this.fit()},buildYLabels:function(){this.yLabels=[];for(var t=v(this.stepValue),i=0;i<=this.steps;i++)this.yLabels.push(C(this.templateString,{value:(this.min+i*this.stepValue).toFixed(t)}));this.yLabelWidth=this.display&&this.showLabels?z(this.ctx,this.font,this.yLabels):0},addXLabel:function(t){this.xLabels.push(t),this.valuesCount++,this.fit()},removeXLabel:function(){this.xLabels.shift(),this.valuesCount--,this.fit()},fit:function(){this.startPoint=this.display?this.fontSize:0,this.endPoint=this.display?this.height-1.5*this.fontSize-5:this.height,this.startPoint+=this.padding,this.endPoint-=this.padding;var t,i=this.endPoint-this.startPoint;for(this.calculateYRange(i),this.buildYLabels(),this.calculateXLabelRotation();i>this.endPoint-this.startPoint;)i=this.endPoint-this.startPoint,t=this.yLabelWidth,this.calculateYRange(i),this.buildYLabels(),t<this.yLabelWidth&&this.calculateXLabelRotation()},calculateXLabelRotation:function(){this.ctx.font=this.font;var t,i,e=this.ctx.measureText(this.xLabels[0]).width,s=this.ctx.measureText(this.xLabels[this.xLabels.length-1]).width;if(this.xScalePaddingRight=s/2+3,this.xScalePaddingLeft=e/2>this.yLabelWidth+10?e/2:this.yLabelWidth+10,this.xLabelRotation=0,this.display){var n,o=z(this.ctx,this.font,this.xLabels);this.xLabelWidth=o;for(var a=Math.floor(this.calculateX(1)-this.calculateX(0))-6;this.xLabelWidth>a&&0===this.xLabelRotation||this.xLabelWidth>a&&this.xLabelRotation<=90&&this.xLabelRotation>0;)n=Math.cos(S(this.xLabelRotation)),t=n*e,i=n*s,t+this.fontSize/2>this.yLabelWidth+8&&(this.xScalePaddingLeft=t+this.fontSize/2),this.xScalePaddingRight=this.fontSize/2,this.xLabelRotation++,this.xLabelWidth=n*o;this.xLabelRotation>0&&(this.endPoint-=Math.sin(S(this.xLabelRotation))*o+3)}else this.xLabelWidth=0,this.xScalePaddingRight=this.padding,this.xScalePaddingLeft=this.padding},calculateYRange:c,drawingArea:function(){return this.startPoint-this.endPoint},calculateY:function(t){var i=this.drawingArea()/(this.min-this.max);return this.endPoint-i*(t-this.min)},calculateX:function(t){var i=(this.xLabelRotation>0,this.width-(this.xScalePaddingLeft+this.xScalePaddingRight)),e=i/Math.max(this.valuesCount-(this.offsetGridLines?0:1),1),s=e*t+this.xScalePaddingLeft;return this.offsetGridLines&&(s+=e/2),Math.round(s)},update:function(t){s.extend(this,t),this.fit()},draw:function(){var t=this.ctx,i=(this.endPoint-this.startPoint)/this.steps,e=Math.round(this.xScalePaddingLeft);this.display&&(t.fillStyle=this.textColor,t.font=this.font,n(this.yLabels,function(n,o){var a=this.endPoint-i*o,h=Math.round(a),l=this.showHorizontalLines;t.textAlign="right",t.textBaseline="middle",this.showLabels&&t.fillText(n,e-10,a),0!==o||l||(l=!0),l&&t.beginPath(),o>0?(t.lineWidth=this.gridLineWidth,t.strokeStyle=this.gridLineColor):(t.lineWidth=this.lineWidth,t.strokeStyle=this.lineColor),h+=s.aliasPixel(t.lineWidth),l&&(t.moveTo(e,h),t.lineTo(this.width,h),t.stroke(),t.closePath()),t.lineWidth=this.lineWidth,t.strokeStyle=this.lineColor,t.beginPath(),t.moveTo(e-5,h),t.lineTo(e,h),t.stroke(),t.closePath()},this),n(this.xLabels,function(i,e){var s=this.calculateX(e)+x(this.lineWidth),n=this.calculateX(e-(this.offsetGridLines?.5:0))+x(this.lineWidth),o=this.xLabelRotation>0,a=this.showVerticalLines;0!==e||a||(a=!0),a&&t.beginPath(),e>0?(t.lineWidth=this.gridLineWidth,t.strokeStyle=this.gridLineColor):(t.lineWidth=this.lineWidth,t.strokeStyle=this.lineColor),a&&(t.moveTo(n,this.endPoint),t.lineTo(n,this.startPoint-3),t.stroke(),t.closePath()),t.lineWidth=this.lineWidth,t.strokeStyle=this.lineColor,t.beginPath(),t.moveTo(n,this.endPoint),t.lineTo(n,this.endPoint+5),t.stroke(),t.closePath(),t.save(),t.translate(s,o?this.endPoint+12:this.endPoint+8),t.rotate(-1*S(this.xLabelRotation)),t.font=this.font,t.textAlign=o?"right":"center",t.textBaseline=o?"middle":"top",t.fillText(i,0,0),t.restore()},this))}}),e.RadialScale=e.Element.extend({initialize:function(){this.size=m([this.height,this.width]),this.drawingArea=this.display?this.size/2-(this.fontSize/2+this.backdropPaddingY):this.size/2},calculateCenterOffset:function(t){var i=this.drawingArea/(this.max-this.min);return(t-this.min)*i},update:function(){this.lineArc?this.drawingArea=this.display?this.size/2-(this.fontSize/2+this.backdropPaddingY):this.size/2:this.setScaleSize(),this.buildYLabels()},buildYLabels:function(){this.yLabels=[];for(var t=v(this.stepValue),i=0;i<=this.steps;i++)this.yLabels.push(C(this.templateString,{value:(this.min+i*this.stepValue).toFixed(t)}))},getCircumference:function(){return 2*Math.PI/this.valuesCount},setScaleSize:function(){var t,i,e,s,n,o,a,h,l,r,c,u,d=m([this.height/2-this.pointLabelFontSize-5,this.width/2]),p=this.width,g=0;for(this.ctx.font=W(this.pointLabelFontSize,this.pointLabelFontStyle,this.pointLabelFontFamily),i=0;i<this.valuesCount;i++)t=this.getPointPosition(i,d),e=this.ctx.measureText(C(this.templateString,{value:this.labels[i]})).width+5,0===i||i===this.valuesCount/2?(s=e/2,t.x+s>p&&(p=t.x+s,n=i),t.x-s<g&&(g=t.x-s,a=i)):i<this.valuesCount/2?t.x+e>p&&(p=t.x+e,n=i):i>this.valuesCount/2&&t.x-e<g&&(g=t.x-e,a=i);l=g,r=Math.ceil(p-this.width),o=this.getIndexAngle(n),h=this.getIndexAngle(a),c=r/Math.sin(o+Math.PI/2),u=l/Math.sin(h+Math.PI/2),c=f(c)?c:0,u=f(u)?u:0,this.drawingArea=d-(u+c)/2,this.setCenterPoint(u,c)},setCenterPoint:function(t,i){var e=this.width-i-this.drawingArea,s=t+this.drawingArea;this.xCenter=(s+e)/2,this.yCenter=this.height/2},getIndexAngle:function(t){var i=2*Math.PI/this.valuesCount;return t*i-Math.PI/2},getPointPosition:function(t,i){var e=this.getIndexAngle(t);return{x:Math.cos(e)*i+this.xCenter,y:Math.sin(e)*i+this.yCenter}},draw:function(){if(this.display){var t=this.ctx;if(n(this.yLabels,function(i,e){if(e>0){var s,n=e*(this.drawingArea/this.steps),o=this.yCenter-n;if(this.lineWidth>0)if(t.strokeStyle=this.lineColor,t.lineWidth=this.lineWidth,this.lineArc)t.beginPath(),t.arc(this.xCenter,this.yCenter,n,0,2*Math.PI),t.closePath(),t.stroke();else{t.beginPath();for(var a=0;a<this.valuesCount;a++)s=this.getPointPosition(a,this.calculateCenterOffset(this.min+e*this.stepValue)),0===a?t.moveTo(s.x,s.y):t.lineTo(s.x,s.y);t.closePath(),t.stroke()}if(this.showLabels){if(t.font=W(this.fontSize,this.fontStyle,this.fontFamily),this.showLabelBackdrop){var h=t.measureText(i).width;t.fillStyle=this.backdropColor,t.fillRect(this.xCenter-h/2-this.backdropPaddingX,o-this.fontSize/2-this.backdropPaddingY,h+2*this.backdropPaddingX,this.fontSize+2*this.backdropPaddingY)}t.textAlign="center",t.textBaseline="middle",t.fillStyle=this.fontColor,t.fillText(i,this.xCenter,o)}}},this),!this.lineArc){t.lineWidth=this.angleLineWidth,t.strokeStyle=this.angleLineColor;for(var i=this.valuesCount-1;i>=0;i--){if(this.angleLineWidth>0){var e=this.getPointPosition(i,this.calculateCenterOffset(this.max));t.beginPath(),t.moveTo(this.xCenter,this.yCenter),t.lineTo(e.x,e.y),t.stroke(),t.closePath()}var s=this.getPointPosition(i,this.calculateCenterOffset(this.max)+5);t.font=W(this.pointLabelFontSize,this.pointLabelFontStyle,this.pointLabelFontFamily),t.fillStyle=this.pointLabelFontColor;var o=this.labels.length,a=this.labels.length/2,h=a/2,l=h>i||i>o-h,r=i===h||i===o-h;t.textAlign=0===i?"center":i===a?"center":a>i?"left":"right",t.textBaseline=r?"middle":l?"bottom":"top",t.fillText(this.labels[i],s.x,s.y)}}}}}),s.addEvent(window,"resize",function(){var t;return function(){clearTimeout(t),t=setTimeout(function(){n(e.instances,function(t){t.options.responsive&&t.resize(t.render,!0)})},50)}}()),p?define(function(){return e}):"object"==typeof module&&module.exports&&(module.exports=e),t.Chart=e,e.noConflict=function(){return t.Chart=i,e}}).call(this),function(){"use strict";var t=this,i=t.Chart,e=i.helpers,s={scaleBeginAtZero:!0,scaleShowGridLines:!0,scaleGridLineColor:"rgba(0,0,0,.05)",scaleGridLineWidth:1,scaleShowHorizontalLines:!0,scaleShowVerticalLines:!0,barShowStroke:!0,barStrokeWidth:2,barValueSpacing:5,barDatasetSpacing:1,legendTemplate:'<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].fillColor%>"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>'};i.Type.extend({name:"Bar",defaults:s,initialize:function(t){var s=this.options;this.ScaleClass=i.Scale.extend({offsetGridLines:!0,calculateBarX:function(t,i,e){var n=this.calculateBaseWidth(),o=this.calculateX(e)-n/2,a=this.calculateBarWidth(t);return o+a*i+i*s.barDatasetSpacing+a/2},calculateBaseWidth:function(){return this.calculateX(1)-this.calculateX(0)-2*s.barValueSpacing},calculateBarWidth:function(t){var i=this.calculateBaseWidth()-(t-1)*s.barDatasetSpacing;return i/t}}),this.datasets=[],this.options.showTooltips&&e.bindEvents(this,this.options.tooltipEvents,function(t){var i="mouseout"!==t.type?this.getBarsAtEvent(t):[];this.eachBars(function(t){t.restore(["fillColor","strokeColor"])}),e.each(i,function(t){t.fillColor=t.highlightFill,t.strokeColor=t.highlightStroke}),this.showTooltip(i)}),this.BarClass=i.Rectangle.extend({strokeWidth:this.options.barStrokeWidth,showStroke:this.options.barShowStroke,ctx:this.chart.ctx}),e.each(t.datasets,function(i){var s={label:i.label||null,fillColor:i.fillColor,strokeColor:i.strokeColor,bars:[]};this.datasets.push(s),e.each(i.data,function(e,n){s.bars.push(new this.BarClass({value:e,label:t.labels[n],datasetLabel:i.label,strokeColor:i.strokeColor,fillColor:i.fillColor,highlightFill:i.highlightFill||i.fillColor,highlightStroke:i.highlightStroke||i.strokeColor}))},this)},this),this.buildScale(t.labels),this.BarClass.prototype.base=this.scale.endPoint,this.eachBars(function(t,i,s){e.extend(t,{width:this.scale.calculateBarWidth(this.datasets.length),x:this.scale.calculateBarX(this.datasets.length,s,i),y:this.scale.endPoint}),t.save()},this),this.render()},update:function(){this.scale.update(),e.each(this.activeElements,function(t){t.restore(["fillColor","strokeColor"])}),this.eachBars(function(t){t.save()}),this.render()},eachBars:function(t){e.each(this.datasets,function(i,s){e.each(i.bars,t,this,s)},this)},getBarsAtEvent:function(t){for(var i,s=[],n=e.getRelativePosition(t),o=function(t){s.push(t.bars[i])},a=0;a<this.datasets.length;a++)for(i=0;i<this.datasets[a].bars.length;i++)if(this.datasets[a].bars[i].inRange(n.x,n.y))return e.each(this.datasets,o),s;return s},buildScale:function(t){var i=this,s=function(){var t=[];return i.eachBars(function(i){t.push(i.value)}),t},n={templateString:this.options.scaleLabel,height:this.chart.height,width:this.chart.width,ctx:this.chart.ctx,textColor:this.options.scaleFontColor,fontSize:this.options.scaleFontSize,fontStyle:this.options.scaleFontStyle,fontFamily:this.options.scaleFontFamily,valuesCount:t.length,beginAtZero:this.options.scaleBeginAtZero,integersOnly:this.options.scaleIntegersOnly,calculateYRange:function(t){var i=e.calculateScaleRange(s(),t,this.fontSize,this.beginAtZero,this.integersOnly);e.extend(this,i)},xLabels:t,font:e.fontString(this.options.scaleFontSize,this.options.scaleFontStyle,this.options.scaleFontFamily),lineWidth:this.options.scaleLineWidth,lineColor:this.options.scaleLineColor,showHorizontalLines:this.options.scaleShowHorizontalLines,showVerticalLines:this.options.scaleShowVerticalLines,gridLineWidth:this.options.scaleShowGridLines?this.options.scaleGridLineWidth:0,gridLineColor:this.options.scaleShowGridLines?this.options.scaleGridLineColor:"rgba(0,0,0,0)",padding:this.options.showScale?0:this.options.barShowStroke?this.options.barStrokeWidth:0,showLabels:this.options.scaleShowLabels,display:this.options.showScale};this.options.scaleOverride&&e.extend(n,{calculateYRange:e.noop,steps:this.options.scaleSteps,stepValue:this.options.scaleStepWidth,min:this.options.scaleStartValue,max:this.options.scaleStartValue+this.options.scaleSteps*this.options.scaleStepWidth}),this.scale=new this.ScaleClass(n)},addData:function(t,i){e.each(t,function(t,e){this.datasets[e].bars.push(new this.BarClass({value:t,label:i,x:this.scale.calculateBarX(this.datasets.length,e,this.scale.valuesCount+1),y:this.scale.endPoint,width:this.scale.calculateBarWidth(this.datasets.length),base:this.scale.endPoint,strokeColor:this.datasets[e].strokeColor,fillColor:this.datasets[e].fillColor}))
},this),this.scale.addXLabel(i),this.update()},removeData:function(){this.scale.removeXLabel(),e.each(this.datasets,function(t){t.bars.shift()},this),this.update()},reflow:function(){e.extend(this.BarClass.prototype,{y:this.scale.endPoint,base:this.scale.endPoint});var t=e.extend({height:this.chart.height,width:this.chart.width});this.scale.update(t)},draw:function(t){var i=t||1;this.clear();this.chart.ctx;this.scale.draw(i),e.each(this.datasets,function(t,s){e.each(t.bars,function(t,e){t.hasValue()&&(t.base=this.scale.endPoint,t.transition({x:this.scale.calculateBarX(this.datasets.length,s,e),y:this.scale.calculateY(t.value),width:this.scale.calculateBarWidth(this.datasets.length)},i).draw())},this)},this)}})}.call(this),function(){"use strict";var t=this,i=t.Chart,e=i.helpers,s={segmentShowStroke:!0,segmentStrokeColor:"#fff",segmentStrokeWidth:2,percentageInnerCutout:50,animationSteps:100,animationEasing:"easeOutBounce",animateRotate:!0,animateScale:!1,legendTemplate:'<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<segments.length; i++){%><li><span style="background-color:<%=segments[i].fillColor%>"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>'};i.Type.extend({name:"Doughnut",defaults:s,initialize:function(t){this.segments=[],this.outerRadius=(e.min([this.chart.width,this.chart.height])-this.options.segmentStrokeWidth/2)/2,this.SegmentArc=i.Arc.extend({ctx:this.chart.ctx,x:this.chart.width/2,y:this.chart.height/2}),this.options.showTooltips&&e.bindEvents(this,this.options.tooltipEvents,function(t){var i="mouseout"!==t.type?this.getSegmentsAtEvent(t):[];e.each(this.segments,function(t){t.restore(["fillColor"])}),e.each(i,function(t){t.fillColor=t.highlightColor}),this.showTooltip(i)}),this.calculateTotal(t),e.each(t,function(t,i){this.addData(t,i,!0)},this),this.render()},getSegmentsAtEvent:function(t){var i=[],s=e.getRelativePosition(t);return e.each(this.segments,function(t){t.inRange(s.x,s.y)&&i.push(t)},this),i},addData:function(t,i,e){var s=i||this.segments.length;this.segments.splice(s,0,new this.SegmentArc({value:t.value,outerRadius:this.options.animateScale?0:this.outerRadius,innerRadius:this.options.animateScale?0:this.outerRadius/100*this.options.percentageInnerCutout,fillColor:t.color,highlightColor:t.highlight||t.color,showStroke:this.options.segmentShowStroke,strokeWidth:this.options.segmentStrokeWidth,strokeColor:this.options.segmentStrokeColor,startAngle:1.5*Math.PI,circumference:this.options.animateRotate?0:this.calculateCircumference(t.value),label:t.label})),e||(this.reflow(),this.update())},calculateCircumference:function(t){return 2*Math.PI*(Math.abs(t)/this.total)},calculateTotal:function(t){this.total=0,e.each(t,function(t){this.total+=Math.abs(t.value)},this)},update:function(){this.calculateTotal(this.segments),e.each(this.activeElements,function(t){t.restore(["fillColor"])}),e.each(this.segments,function(t){t.save()}),this.render()},removeData:function(t){var i=e.isNumber(t)?t:this.segments.length-1;this.segments.splice(i,1),this.reflow(),this.update()},reflow:function(){e.extend(this.SegmentArc.prototype,{x:this.chart.width/2,y:this.chart.height/2}),this.outerRadius=(e.min([this.chart.width,this.chart.height])-this.options.segmentStrokeWidth/2)/2,e.each(this.segments,function(t){t.update({outerRadius:this.outerRadius,innerRadius:this.outerRadius/100*this.options.percentageInnerCutout})},this)},draw:function(t){var i=t?t:1;this.clear(),e.each(this.segments,function(t,e){t.transition({circumference:this.calculateCircumference(t.value),outerRadius:this.outerRadius,innerRadius:this.outerRadius/100*this.options.percentageInnerCutout},i),t.endAngle=t.startAngle+t.circumference,t.draw(),0===e&&(t.startAngle=1.5*Math.PI),e<this.segments.length-1&&(this.segments[e+1].startAngle=t.endAngle)},this)}}),i.types.Doughnut.extend({name:"Pie",defaults:e.merge(s,{percentageInnerCutout:0})})}.call(this),function(){"use strict";var t=this,i=t.Chart,e=i.helpers,s={scaleShowGridLines:!0,scaleGridLineColor:"rgba(0,0,0,.05)",scaleGridLineWidth:1,scaleShowHorizontalLines:!0,scaleShowVerticalLines:!0,bezierCurve:!0,bezierCurveTension:.4,pointDot:!0,pointDotRadius:4,pointDotStrokeWidth:1,pointHitDetectionRadius:20,datasetStroke:!0,datasetStrokeWidth:2,datasetFill:!0,legendTemplate:'<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].strokeColor%>"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>'};i.Type.extend({name:"Line",defaults:s,initialize:function(t){this.PointClass=i.Point.extend({strokeWidth:this.options.pointDotStrokeWidth,radius:this.options.pointDotRadius,display:this.options.pointDot,hitDetectionRadius:this.options.pointHitDetectionRadius,ctx:this.chart.ctx,inRange:function(t){return Math.pow(t-this.x,2)<Math.pow(this.radius+this.hitDetectionRadius,2)}}),this.datasets=[],this.options.showTooltips&&e.bindEvents(this,this.options.tooltipEvents,function(t){var i="mouseout"!==t.type?this.getPointsAtEvent(t):[];this.eachPoints(function(t){t.restore(["fillColor","strokeColor"])}),e.each(i,function(t){t.fillColor=t.highlightFill,t.strokeColor=t.highlightStroke}),this.showTooltip(i)}),e.each(t.datasets,function(i){var s={label:i.label||null,fillColor:i.fillColor,strokeColor:i.strokeColor,pointColor:i.pointColor,pointStrokeColor:i.pointStrokeColor,points:[]};this.datasets.push(s),e.each(i.data,function(e,n){s.points.push(new this.PointClass({value:e,label:t.labels[n],datasetLabel:i.label,strokeColor:i.pointStrokeColor,fillColor:i.pointColor,highlightFill:i.pointHighlightFill||i.pointColor,highlightStroke:i.pointHighlightStroke||i.pointStrokeColor}))},this),this.buildScale(t.labels),this.eachPoints(function(t,i){e.extend(t,{x:this.scale.calculateX(i),y:this.scale.endPoint}),t.save()},this)},this),this.render()},update:function(){this.scale.update(),e.each(this.activeElements,function(t){t.restore(["fillColor","strokeColor"])}),this.eachPoints(function(t){t.save()}),this.render()},eachPoints:function(t){e.each(this.datasets,function(i){e.each(i.points,t,this)},this)},getPointsAtEvent:function(t){var i=[],s=e.getRelativePosition(t);return e.each(this.datasets,function(t){e.each(t.points,function(t){t.inRange(s.x,s.y)&&i.push(t)})},this),i},buildScale:function(t){var s=this,n=function(){var t=[];return s.eachPoints(function(i){t.push(i.value)}),t},o={templateString:this.options.scaleLabel,height:this.chart.height,width:this.chart.width,ctx:this.chart.ctx,textColor:this.options.scaleFontColor,fontSize:this.options.scaleFontSize,fontStyle:this.options.scaleFontStyle,fontFamily:this.options.scaleFontFamily,valuesCount:t.length,beginAtZero:this.options.scaleBeginAtZero,integersOnly:this.options.scaleIntegersOnly,calculateYRange:function(t){var i=e.calculateScaleRange(n(),t,this.fontSize,this.beginAtZero,this.integersOnly);e.extend(this,i)},xLabels:t,font:e.fontString(this.options.scaleFontSize,this.options.scaleFontStyle,this.options.scaleFontFamily),lineWidth:this.options.scaleLineWidth,lineColor:this.options.scaleLineColor,showHorizontalLines:this.options.scaleShowHorizontalLines,showVerticalLines:this.options.scaleShowVerticalLines,gridLineWidth:this.options.scaleShowGridLines?this.options.scaleGridLineWidth:0,gridLineColor:this.options.scaleShowGridLines?this.options.scaleGridLineColor:"rgba(0,0,0,0)",padding:this.options.showScale?0:this.options.pointDotRadius+this.options.pointDotStrokeWidth,showLabels:this.options.scaleShowLabels,display:this.options.showScale};this.options.scaleOverride&&e.extend(o,{calculateYRange:e.noop,steps:this.options.scaleSteps,stepValue:this.options.scaleStepWidth,min:this.options.scaleStartValue,max:this.options.scaleStartValue+this.options.scaleSteps*this.options.scaleStepWidth}),this.scale=new i.Scale(o)},addData:function(t,i){e.each(t,function(t,e){this.datasets[e].points.push(new this.PointClass({value:t,label:i,x:this.scale.calculateX(this.scale.valuesCount+1),y:this.scale.endPoint,strokeColor:this.datasets[e].pointStrokeColor,fillColor:this.datasets[e].pointColor}))},this),this.scale.addXLabel(i),this.update()},removeData:function(){this.scale.removeXLabel(),e.each(this.datasets,function(t){t.points.shift()},this),this.update()},reflow:function(){var t=e.extend({height:this.chart.height,width:this.chart.width});this.scale.update(t)},draw:function(t){var i=t||1;this.clear();var s=this.chart.ctx,n=function(t){return null!==t.value},o=function(t,i,s){return e.findNextWhere(i,n,s)||t},a=function(t,i,s){return e.findPreviousWhere(i,n,s)||t};this.scale.draw(i),e.each(this.datasets,function(t){var h=e.where(t.points,n);e.each(t.points,function(t,e){t.hasValue()&&t.transition({y:this.scale.calculateY(t.value),x:this.scale.calculateX(e)},i)},this),this.options.bezierCurve&&e.each(h,function(t,i){var s=i>0&&i<h.length-1?this.options.bezierCurveTension:0;t.controlPoints=e.splineCurve(a(t,h,i),t,o(t,h,i),s),t.controlPoints.outer.y>this.scale.endPoint?t.controlPoints.outer.y=this.scale.endPoint:t.controlPoints.outer.y<this.scale.startPoint&&(t.controlPoints.outer.y=this.scale.startPoint),t.controlPoints.inner.y>this.scale.endPoint?t.controlPoints.inner.y=this.scale.endPoint:t.controlPoints.inner.y<this.scale.startPoint&&(t.controlPoints.inner.y=this.scale.startPoint)},this),s.lineWidth=this.options.datasetStrokeWidth,s.strokeStyle=t.strokeColor,s.beginPath(),e.each(h,function(t,i){if(0===i)s.moveTo(t.x,t.y);else if(this.options.bezierCurve){var e=a(t,h,i);s.bezierCurveTo(e.controlPoints.outer.x,e.controlPoints.outer.y,t.controlPoints.inner.x,t.controlPoints.inner.y,t.x,t.y)}else s.lineTo(t.x,t.y)},this),s.stroke(),this.options.datasetFill&&h.length>0&&(s.lineTo(h[h.length-1].x,this.scale.endPoint),s.lineTo(h[0].x,this.scale.endPoint),s.fillStyle=t.fillColor,s.closePath(),s.fill()),e.each(h,function(t){t.draw()})},this)}})}.call(this),function(){"use strict";var t=this,i=t.Chart,e=i.helpers,s={scaleShowLabelBackdrop:!0,scaleBackdropColor:"rgba(255,255,255,0.75)",scaleBeginAtZero:!0,scaleBackdropPaddingY:2,scaleBackdropPaddingX:2,scaleShowLine:!0,segmentShowStroke:!0,segmentStrokeColor:"#fff",segmentStrokeWidth:2,animationSteps:100,animationEasing:"easeOutBounce",animateRotate:!0,animateScale:!1,legendTemplate:'<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<segments.length; i++){%><li><span style="background-color:<%=segments[i].fillColor%>"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>'};i.Type.extend({name:"PolarArea",defaults:s,initialize:function(t){this.segments=[],this.SegmentArc=i.Arc.extend({showStroke:this.options.segmentShowStroke,strokeWidth:this.options.segmentStrokeWidth,strokeColor:this.options.segmentStrokeColor,ctx:this.chart.ctx,innerRadius:0,x:this.chart.width/2,y:this.chart.height/2}),this.scale=new i.RadialScale({display:this.options.showScale,fontStyle:this.options.scaleFontStyle,fontSize:this.options.scaleFontSize,fontFamily:this.options.scaleFontFamily,fontColor:this.options.scaleFontColor,showLabels:this.options.scaleShowLabels,showLabelBackdrop:this.options.scaleShowLabelBackdrop,backdropColor:this.options.scaleBackdropColor,backdropPaddingY:this.options.scaleBackdropPaddingY,backdropPaddingX:this.options.scaleBackdropPaddingX,lineWidth:this.options.scaleShowLine?this.options.scaleLineWidth:0,lineColor:this.options.scaleLineColor,lineArc:!0,width:this.chart.width,height:this.chart.height,xCenter:this.chart.width/2,yCenter:this.chart.height/2,ctx:this.chart.ctx,templateString:this.options.scaleLabel,valuesCount:t.length}),this.updateScaleRange(t),this.scale.update(),e.each(t,function(t,i){this.addData(t,i,!0)},this),this.options.showTooltips&&e.bindEvents(this,this.options.tooltipEvents,function(t){var i="mouseout"!==t.type?this.getSegmentsAtEvent(t):[];e.each(this.segments,function(t){t.restore(["fillColor"])}),e.each(i,function(t){t.fillColor=t.highlightColor}),this.showTooltip(i)}),this.render()},getSegmentsAtEvent:function(t){var i=[],s=e.getRelativePosition(t);return e.each(this.segments,function(t){t.inRange(s.x,s.y)&&i.push(t)},this),i},addData:function(t,i,e){var s=i||this.segments.length;this.segments.splice(s,0,new this.SegmentArc({fillColor:t.color,highlightColor:t.highlight||t.color,label:t.label,value:t.value,outerRadius:this.options.animateScale?0:this.scale.calculateCenterOffset(t.value),circumference:this.options.animateRotate?0:this.scale.getCircumference(),startAngle:1.5*Math.PI})),e||(this.reflow(),this.update())},removeData:function(t){var i=e.isNumber(t)?t:this.segments.length-1;this.segments.splice(i,1),this.reflow(),this.update()},calculateTotal:function(t){this.total=0,e.each(t,function(t){this.total+=t.value},this),this.scale.valuesCount=this.segments.length},updateScaleRange:function(t){var i=[];e.each(t,function(t){i.push(t.value)});var s=this.options.scaleOverride?{steps:this.options.scaleSteps,stepValue:this.options.scaleStepWidth,min:this.options.scaleStartValue,max:this.options.scaleStartValue+this.options.scaleSteps*this.options.scaleStepWidth}:e.calculateScaleRange(i,e.min([this.chart.width,this.chart.height])/2,this.options.scaleFontSize,this.options.scaleBeginAtZero,this.options.scaleIntegersOnly);e.extend(this.scale,s,{size:e.min([this.chart.width,this.chart.height]),xCenter:this.chart.width/2,yCenter:this.chart.height/2})},update:function(){this.calculateTotal(this.segments),e.each(this.segments,function(t){t.save()}),this.reflow(),this.render()},reflow:function(){e.extend(this.SegmentArc.prototype,{x:this.chart.width/2,y:this.chart.height/2}),this.updateScaleRange(this.segments),this.scale.update(),e.extend(this.scale,{xCenter:this.chart.width/2,yCenter:this.chart.height/2}),e.each(this.segments,function(t){t.update({outerRadius:this.scale.calculateCenterOffset(t.value)})},this)},draw:function(t){var i=t||1;this.clear(),e.each(this.segments,function(t,e){t.transition({circumference:this.scale.getCircumference(),outerRadius:this.scale.calculateCenterOffset(t.value)},i),t.endAngle=t.startAngle+t.circumference,0===e&&(t.startAngle=1.5*Math.PI),e<this.segments.length-1&&(this.segments[e+1].startAngle=t.endAngle),t.draw()},this),this.scale.draw()}})}.call(this),function(){"use strict";var t=this,i=t.Chart,e=i.helpers;i.Type.extend({name:"Radar",defaults:{scaleShowLine:!0,angleShowLineOut:!0,scaleShowLabels:!1,scaleBeginAtZero:!0,angleLineColor:"rgba(0,0,0,.1)",angleLineWidth:1,pointLabelFontFamily:"'Arial'",pointLabelFontStyle:"normal",pointLabelFontSize:10,pointLabelFontColor:"#666",pointDot:!0,pointDotRadius:3,pointDotStrokeWidth:1,pointHitDetectionRadius:20,datasetStroke:!0,datasetStrokeWidth:2,datasetFill:!0,legendTemplate:'<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].strokeColor%>"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>'},initialize:function(t){this.PointClass=i.Point.extend({strokeWidth:this.options.pointDotStrokeWidth,radius:this.options.pointDotRadius,display:this.options.pointDot,hitDetectionRadius:this.options.pointHitDetectionRadius,ctx:this.chart.ctx}),this.datasets=[],this.buildScale(t),this.options.showTooltips&&e.bindEvents(this,this.options.tooltipEvents,function(t){var i="mouseout"!==t.type?this.getPointsAtEvent(t):[];this.eachPoints(function(t){t.restore(["fillColor","strokeColor"])}),e.each(i,function(t){t.fillColor=t.highlightFill,t.strokeColor=t.highlightStroke}),this.showTooltip(i)}),e.each(t.datasets,function(i){var s={label:i.label||null,fillColor:i.fillColor,strokeColor:i.strokeColor,pointColor:i.pointColor,pointStrokeColor:i.pointStrokeColor,points:[]};this.datasets.push(s),e.each(i.data,function(e,n){var o;this.scale.animation||(o=this.scale.getPointPosition(n,this.scale.calculateCenterOffset(e))),s.points.push(new this.PointClass({value:e,label:t.labels[n],datasetLabel:i.label,x:this.options.animation?this.scale.xCenter:o.x,y:this.options.animation?this.scale.yCenter:o.y,strokeColor:i.pointStrokeColor,fillColor:i.pointColor,highlightFill:i.pointHighlightFill||i.pointColor,highlightStroke:i.pointHighlightStroke||i.pointStrokeColor}))},this)},this),this.render()},eachPoints:function(t){e.each(this.datasets,function(i){e.each(i.points,t,this)},this)},getPointsAtEvent:function(t){var i=e.getRelativePosition(t),s=e.getAngleFromPoint({x:this.scale.xCenter,y:this.scale.yCenter},i),n=2*Math.PI/this.scale.valuesCount,o=Math.round((s.angle-1.5*Math.PI)/n),a=[];return(o>=this.scale.valuesCount||0>o)&&(o=0),s.distance<=this.scale.drawingArea&&e.each(this.datasets,function(t){a.push(t.points[o])}),a},buildScale:function(t){this.scale=new i.RadialScale({display:this.options.showScale,fontStyle:this.options.scaleFontStyle,fontSize:this.options.scaleFontSize,fontFamily:this.options.scaleFontFamily,fontColor:this.options.scaleFontColor,showLabels:this.options.scaleShowLabels,showLabelBackdrop:this.options.scaleShowLabelBackdrop,backdropColor:this.options.scaleBackdropColor,backdropPaddingY:this.options.scaleBackdropPaddingY,backdropPaddingX:this.options.scaleBackdropPaddingX,lineWidth:this.options.scaleShowLine?this.options.scaleLineWidth:0,lineColor:this.options.scaleLineColor,angleLineColor:this.options.angleLineColor,angleLineWidth:this.options.angleShowLineOut?this.options.angleLineWidth:0,pointLabelFontColor:this.options.pointLabelFontColor,pointLabelFontSize:this.options.pointLabelFontSize,pointLabelFontFamily:this.options.pointLabelFontFamily,pointLabelFontStyle:this.options.pointLabelFontStyle,height:this.chart.height,width:this.chart.width,xCenter:this.chart.width/2,yCenter:this.chart.height/2,ctx:this.chart.ctx,templateString:this.options.scaleLabel,labels:t.labels,valuesCount:t.datasets[0].data.length}),this.scale.setScaleSize(),this.updateScaleRange(t.datasets),this.scale.buildYLabels()},updateScaleRange:function(t){var i=function(){var i=[];return e.each(t,function(t){t.data?i=i.concat(t.data):e.each(t.points,function(t){i.push(t.value)})}),i}(),s=this.options.scaleOverride?{steps:this.options.scaleSteps,stepValue:this.options.scaleStepWidth,min:this.options.scaleStartValue,max:this.options.scaleStartValue+this.options.scaleSteps*this.options.scaleStepWidth}:e.calculateScaleRange(i,e.min([this.chart.width,this.chart.height])/2,this.options.scaleFontSize,this.options.scaleBeginAtZero,this.options.scaleIntegersOnly);e.extend(this.scale,s)},addData:function(t,i){this.scale.valuesCount++,e.each(t,function(t,e){var s=this.scale.getPointPosition(this.scale.valuesCount,this.scale.calculateCenterOffset(t));this.datasets[e].points.push(new this.PointClass({value:t,label:i,x:s.x,y:s.y,strokeColor:this.datasets[e].pointStrokeColor,fillColor:this.datasets[e].pointColor}))},this),this.scale.labels.push(i),this.reflow(),this.update()},removeData:function(){this.scale.valuesCount--,this.scale.labels.shift(),e.each(this.datasets,function(t){t.points.shift()},this),this.reflow(),this.update()},update:function(){this.eachPoints(function(t){t.save()}),this.reflow(),this.render()},reflow:function(){e.extend(this.scale,{width:this.chart.width,height:this.chart.height,size:e.min([this.chart.width,this.chart.height]),xCenter:this.chart.width/2,yCenter:this.chart.height/2}),this.updateScaleRange(this.datasets),this.scale.setScaleSize(),this.scale.buildYLabels()},draw:function(t){var i=t||1,s=this.chart.ctx;this.clear(),this.scale.draw(),e.each(this.datasets,function(t){e.each(t.points,function(t,e){t.hasValue()&&t.transition(this.scale.getPointPosition(e,this.scale.calculateCenterOffset(t.value)),i)},this),s.lineWidth=this.options.datasetStrokeWidth,s.strokeStyle=t.strokeColor,s.beginPath(),e.each(t.points,function(t,i){0===i?s.moveTo(t.x,t.y):s.lineTo(t.x,t.y)},this),s.closePath(),s.stroke(),s.fillStyle=t.fillColor,s.fill(),e.each(t.points,function(t){t.hasValue()&&t.draw()})},this)}})}.call(this);!function(t){"use strict";"function"==typeof define&&define.amd?define(["angular","chart.js"],t):"object"==typeof exports?module.exports=t(require("angular"),require("chart.js")):t(angular,Chart)}(function(t,e){"use strict";function n(){var n={},r={Chart:e,getOptions:function(e){var r=e&&n[e]||{};return t.extend({},n,r)}};this.setOptions=function(e,r){return r?(n[e]=t.extend(n[e]||{},r),void 0):(r=e,n=t.extend(n,r),void 0)},this.$get=function(){return r}}function r(n){function r(t,e){return t&&e&&t.length&&e.length?Array.isArray(t[0])?t.length===e.length&&t[0].length===e[0].length:e.reduce(a,0)>0?t.length===e.length:!1:!1}function a(t,e){return t+e}function o(e,r,a){if(r.data&&r.data.length){r.getColour="function"==typeof r.getColour?r.getColour:l,r.colours=c(e,r);var o=a[0],u=o.getContext("2d"),s=Array.isArray(r.data[0])?g(r.labels,r.data,r.series||[],r.colours):p(r.labels,r.data,r.colours),f=t.extend({},n.getOptions(e),r.options),h=new n.Chart(u)[e](s,f);return r.$emit("create",h),["hover","click"].forEach(function(t){r[t]&&(o["click"===t?"onclick":"onmousemove"]=i(r,h,t))}),r.legend&&"false"!==r.legend&&v(a,h),h}}function i(t,e,n){return function(r){var a=e.getPointsAtEvent||e.getBarsAtEvent||e.getSegmentsAtEvent;if(a){var o=a.call(e,r);t[n](o,r),t.$apply()}}}function c(r,a){for(var o=t.copy(a.colours||n.getOptions(r).colours||e.defaults.global.colours);o.length<a.data.length;)o.push(a.getColour());return o.map(u)}function u(t){return"object"==typeof t&&null!==t?t:"string"==typeof t&&"#"===t[0]?s(d(t.substr(1))):l()}function l(){var t=[f(0,255),f(0,255),f(0,255)];return s(t)}function s(t){return{fillColor:h(t,.2),strokeColor:h(t,1),pointColor:h(t,1),pointStrokeColor:"#fff",pointHighlightFill:"#fff",pointHighlightStroke:h(t,.8)}}function f(t,e){return Math.floor(Math.random()*(e-t+1))+t}function h(t,e){return"rgba("+t.concat(e).join(",")+")"}function d(t){var e=parseInt(t,16),n=e>>16&255,r=e>>8&255,a=255&e;return[n,r,a]}function g(e,n,r,a){return{labels:e,datasets:n.map(function(e,n){var o=t.copy(a[n]);return o.label=r[n],o.data=e,o})}}function p(t,e,n){return t.map(function(t,r){return{label:t,value:e[r],color:n[r].strokeColor,highlight:n[r].pointHighlightStroke}})}function v(t,e){var n=t.parent(),r=n.find("chart-legend"),a="<chart-legend>"+e.generateLegend()+"</chart-legend>";r.length?r.replaceWith(a):n.append(a)}function y(t,e,n){Array.isArray(n.data[0])?t.datasets.forEach(function(t,n){(t.points||t.bars).forEach(function(t,r){t.value=e[n][r]})}):t.segments.forEach(function(t,n){t.value=e[n]}),t.update(),n.$emit("update",t)}function C(t){return!t||Array.isArray(t)&&!t.length||"object"==typeof t&&!Object.keys(t).length}return function(e){return{restrict:"CA",scope:{data:"=",labels:"=",options:"=",series:"=",colours:"=?",getColour:"=?",chartType:"=",legend:"@",click:"=",hover:"="},link:function(n,a){function i(r,i){if(!C(r)&&!t.equals(r,i)){var u=e||n.chartType;u&&(c&&c.destroy(),c=o(u,n,a))}}var c,u=document.createElement("div");u.className="chart-container",a.replaceWith(u),u.appendChild(a[0]),"object"==typeof window.G_vmlCanvasManager&&null!==window.G_vmlCanvasManager&&"function"==typeof window.G_vmlCanvasManager.initElement&&window.G_vmlCanvasManager.initElement(a[0]),n.$watch("data",function(t,i){if(t&&t.length&&(!Array.isArray(t[0])||t[0].length)){var u=e||n.chartType;if(u){if(c){if(r(t,i))return y(c,t,n);c.destroy()}c=o(u,n,a)}}},!0),n.$watch("series",i,!0),n.$watch("labels",i,!0),n.$watch("options",i,!0),n.$watch("colours",i,!0),n.$watch("chartType",function(e,r){C(e)||t.equals(e,r)||(c&&c.destroy(),c=o(e,n,a))}),n.$on("$destroy",function(){c&&c.destroy()})}}}}e.defaults.global.responsive=!0,e.defaults.global.multiTooltipTemplate="<%if (datasetLabel){%><%=datasetLabel%>: <%}%><%= value %>",e.defaults.global.colours=["#97BBCD","#DCDCDC","#F7464A","#46BFBD","#FDB45C","#949FB1","#4D5360"],t.module("chart.js",[]).provider("ChartJs",n).factory("ChartJsFactory",["ChartJs",r]).directive("chartBase",["ChartJsFactory",function(t){return new t}]).directive("chartLine",["ChartJsFactory",function(t){return new t("Line")}]).directive("chartBar",["ChartJsFactory",function(t){return new t("Bar")}]).directive("chartRadar",["ChartJsFactory",function(t){return new t("Radar")}]).directive("chartDoughnut",["ChartJsFactory",function(t){return new t("Doughnut")}]).directive("chartPie",["ChartJsFactory",function(t){return new t("Pie")}]).directive("chartPolarArea",["ChartJsFactory",function(t){return new t("PolarArea")}])});
//# sourceMappingURL=angular-chart.min.js.map//壓縮 手動排序跟新增
//cat script/angular.min.js script/angular-route.min.js script/angular-resource.min.js script/angular-cookies.min.js script/angular-sanitize.min.js script/angular-file-upload.js script/Chart.min.js script/angular-chart.min.js script/controllers.js script/stock-controllers.js script/password-controllers.js script/frontend.js script/ui-bootstrap-tpls-0.12.0.min.js script/vtt.js > script/release.js
//cat css/angular-chart.css css/bootstrap.min.css css/bootstrap-theme.min.css font-awesome/css/font-awesome.min.css css/sb-admin.css > css/release.css
var video, music, subtitles, videoStart=0, videoIndex=0, musicStart=0, confirm_str='', yplayer = null;;
var app = angular.module('app', ['ngResource', 'ngRoute', 'ngCookies', 'ngSanitize', 'angularFileUpload', 'ui.bootstrap', 'chart.js'], function($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
        templateUrl: '/views/homepage',
        controller: LoginCntl//,
        //controllerAs: 'login'
    }).when('/UserInfo', {
        templateUrl: '/views/UserInfo',
        controller: UserInfoCntl
    }).when('/Storage', {
        templateUrl: '/views/Storage',
        controller: StorageInfoCntl
    }).when('/Stock', {
        templateUrl: '/views/Stock',
        controller: StockCntl
    }).when('/Password', {
        templateUrl: '/views/Password',
        controller: PasswordCntl
    }).otherwise({ redirectTo: '/' });
    // configure html5 to get links working on jsfiddle
    $locationProvider.html5Mode(true);
}).directive('focusMe', function() {
    return {
        scope: { trigger: '=focusMe' },
        link: function(scope, element) {
            scope.$watch('trigger', function(value) {
                if(value === true) {
                    element[0].focus();
                    scope.trigger = false;
                }
            });
        }
    };
}).directive('blurMe', function() {
    return {
        scope: { trigger: '=blurMe' },
        link: function(scope, element) {
            scope.$watch('trigger', function(value) {
                if(value === true) {
                    element[0].blur();
                    scope.trigger = false;
                }
            });
        }
    };
}).directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
                event.preventDefault();
            }
        });
    };
}).directive('ngConfirmClick', function() {
    return {
        link: function (scope, element, attr) {
            var msg = attr.ngConfirmClick || "Are you sure?";
            var clickAction = attr.confirmedClick;
            var msg2 = attr.ngSubMsg;
            if (msg2) {
                element.bind('click',function (event) {
                    openModal(msg+' '+confirm_str+' '+msg2).then(function () {
                        scope.$eval(clickAction);
                    }, function () {
                    });
                });
            } else {
                element.bind('click',function (event) {
                    openModal(msg).then(function () {
                        scope.$eval(clickAction);
                    }, function () {
                    });
                });
            }

        }
    };
}).directive('ngMusic', function() {
    return function (scope, element, attrs) {
        music = element[0];
        music.onplay = function() {
            music.focus();
        };
        music.addEventListener('loadedmetadata', function () {
            if (musicStart) {
                music.currentTime = musicStart;
                musicStart = 0;
            }
        });
    };
}).directive('ngVideo', function() {
    return function (scope, element, attrs) {
        video = element[0];
        video.onplay = function() {
            video.focus();
        };
        video.addEventListener('loadedmetadata', function () {
            if (videoStart) {
                video.currentTime = videoStart;
                videoStart = 0;
            }
        });
    };
}).directive('ngEnded', function() {
    return function (scope, element, attrs) {
        element.bind('ended',function (event) {
            //event.preventDefault();
            scope.$apply(function (){
                scope.$eval(attrs.ngEnded);
            });
        });
    };
}).directive('ngPause', function() {
    return function (scope, element, attrs) {
        element.bind('pause',function (event) {
            scope.$apply(function (){
                scope.$eval(attrs.ngPause);
            });
        });
    };
}).directive('ngPlay', function() {
    return function (scope, element, attrs) {
        element.bind('play',function (event) {
            scope.$apply(function (){
                scope.$eval(attrs.ngPlay);
            });
        });
    };
}).directive('ngRepeatValue', function() {
    return function (scope, element, attrs) {
        scope.$watch(attrs.ngModel, function(value) {
            scope.$parent[attrs.ngModel] = value;
        });
        var clickAction = attrs.ngRepeatValue;
        if (clickAction) {
            element.bind('click',function (event) {
                scope.$apply(function (){
                    scope.$eval(clickAction);
                });
            });
        }
    };
}).directive('ngIframeBigpic', function(){
    //for pdf
    //doc 850px
    return function(scope, element, attrs){
        element.on('load', function(){
            if (!scope.doc.maxId) {
                var iframeBody = element[0].contentWindow.document.getElementsByTagName('body')[0];
                var childnode = iframeBody.childNodes;
                var iframeOffset = [];
                var iframeWin = element[0].contentWindow.window;
                scope.isPdf = false;
                if (scope.doc.name.match(/\.pdf$/i)) {
                    scope.isPdf = true;
                    iframeBody.style.padding = '0px';
                    iframeBody.style["margin-left"] = 'auto';
                    iframeBody.style["margin-right"] = 'auto';
                    var imgNode = {offset: [], node: []};
                    var textNode = {offset: [], node: []};
                    var j = 0;
                    for (var i = 0; i< childnode.length; i++) {
                        var iframeSpan = childnode[i].getElementsByTagName('span')[0];
                        if (iframeSpan) {
                            var iframeImg = iframeSpan.getElementsByTagName('img')[0];
                            if (iframeImg) {
                                iframeImg.style.width = 'auto';
                                iframeImg.style.height = 'auto';
                                if (imgNode.offset.length === 0){
                                    imgNode.offset[0] = 0;
                                    textNode.offset[0] = 0;
                                    imgNode.offset.push(childnode[i].offsetTop + childnode[i].offsetHeight);
                                } else {
                                    j++;
                                    imgNode.offset.push(imgNode.offset[j] + childnode[i].offsetHeight);
                                    textNode.offset.push(childnode[i].offsetTop - imgNode.offset[j]);
                                }
                                imgNode.node.push(childnode[i]);
                            } else {
                                textNode.node.push(childnode[i]);
                            }
                        } else {
                            if (childnode[i].tagName === 'HR' && childnode[i].style.display === 'none') {
                            } else if (childnode[i].tagName === 'STYLE') {
                            } else {
                                textNode.node.push(childnode[i]);
                            }
                        }
                    }
                    textNode.offset.push(childnode[childnode.length-2].offsetTop + childnode[childnode.length-2].offsetHeight - imgNode.offset[imgNode.offset.length-1]);
                    scope.$apply(function (){
                        scope.setDoc(iframeWin, imgNode, textNode);
                    });
                } else {
                    var lastchild = childnode[childnode.length-2];
                    var iframelength = lastchild.offsetTop + lastchild.offsetHeight;
                    for (var i = 0; i < iframelength; i+=850) {
                        iframeOffset.push(i);
                    }
                    scope.$apply(function (){
                        scope.setDoc(iframeWin, iframeOffset);
                    });
                }
                element[0].contentWindow.document.onscroll = function() {
                    scope.$apply(function (){
                        scope.numberDoc();
                    });
                };
            }
        });
    }
}).directive('ngImageOnload', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('load', function() {
                var extend = document.getElementById('extend-image-screen');
                if (extend) {
                    extend.scrollTop = 0;
                    extend.scrollLeft = extend.scrollWidth;
                }
            });
        }
    };
}).filter('trusted', ['$sce', function ($sce) {
    return function(url) {
        return $sce.trustAsResourceUrl(url);
    };
}]).filter('clear', function () {
    return function(str) {
        var ret_str = '';
        for (var i in str) {
            if (str[i] === 'l') {
                ret_str += '<little L>';
            } else if (str[i] === 'I') {
                ret_str += '<big i>';
            } else if (str[i] === '1') {
                ret_str += '<number 1>';
            } else if (str[i] === 'O') {
                ret_str += '<big o>';
            } else if (str[i] === '0') {
                ret_str += '<number 0>';
            } else {
                ret_str += str[i];
            }
        }
        return ret_str;
    };
}).directive('selectOnClick', ['$window', function ($window) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.on('focus', function () {
                if (!$window.getSelection().toString()) {
                    // Required for mobile Safari
                    this.setSelectionRange(0, this.value.length)
                }
            });
        }
    };
}]);

function UserInfoCntl($route, $routeParams, $resource, $scope, $window, $timeout, $location) {
    $scope.$parent.currentPage = -1;
    $scope.$parent.isRight = false;
    $scope.uInfo = [];
    $scope.timer = false;
    $scope.init = function(){
        var Info = $resource('/api/userinfo', {}, {
            'userinfo': { method:'GET' }
        });
        var this_obj = this;
        Info.userinfo({}, function(result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                for (var i in result.user_info) {
                    if (result.user_info[i].hasOwnProperty('desc')) {
                        result.user_info[i].hasDesc = true;
                    }
                    if (result.user_info[i].hasOwnProperty('perm')) {
                        result.user_info[i].hasPerm = true;
                    }
                    if (result.user_info[i].hasOwnProperty('unDay')) {
                        result.user_info[i].hasUnDay = true;
                    }
                    if (result.user_info[i].hasOwnProperty('unHit')) {
                        result.user_info[i].hasUnHit = true;
                    }
                    result.user_info[i].isDel = false;
                    this_obj.uInfo.push(result.user_info[i]);
                }
            }
        }, function(errorResult) {
            if (errorResult.status === 400) {
                addAlert(errorResult.data);
            } else if (errorResult.status === 403) {
                addAlert('unknown API!!!');
            } else if (errorResult.status === 401) {
                $window.location.href = $location.path();
            }
        });
    }
    $scope.preAddUser = function(item) {
        if (item.newable) {
            if (!isValidString(item.name, 'name')) {
                addAlert('name not vaild!!!');
            } else if (!isValidString(item.desc, 'desc')) {
                addAlert('desc not vaild!!!');
            } else if (!isValidString(item.perm, 'perm')) {
                addAlert('perm not vaild!!!');
            } else if (!isValidString(item.newPwd, 'passwd') || !isValidString(item.conPwd, 'passwd')) {
                addAlert('new password is not valid!!!');
                item.newPwd = '';
                item.conPwd = '';
            } else if (item.newPwd !== item.conPwd) {
                addAlert('confirm password must equal!!!');
                item.newPwd = '';
                item.conPwd = '';
            } else {
                openBlockPW(this.addUser, this, item);
            }
        }
        return false;
    }
    $scope.addUser = function(item) {
        var addInfo = $resource('/api/adduser', {}, {
            'addinfo': { method:'POST' }
        });
        var this_obj = this;
        var this_uInfo = this.uInfo;
        addInfo.addinfo({name: item.name, desc: item.desc, perm: item.perm, newPwd: item.newPwd, conPwd: item.conPwd, userPW: this.$parent.userPW}, function (result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                if (result.item) {
                    for (var i in result.item) {
                        item[i] = result.item[i];
                    }
                    item.newPwd = '';
                    item.conPwd = '';
                }
                if (result.newItem) {
                    if (result.newItem.hasOwnProperty('desc')) {
                        result.newItem.hasDesc = true;
                    }
                    if (result.newItem.hasOwnProperty('perm')) {
                        result.newItem.hasPerm = true;
                    }
                    result.newItem.isDel = false;
                    this_uInfo.push(result.newItem);
                }
                this_obj.$parent.closeBlockPW(true);
            }
        }, function(errorResult) {
            if (errorResult.status === 400) {
                addAlert(errorResult.data);
            } else if (errorResult.status === 403) {
                addAlert('unknown API!!!');
            } else if (errorResult.status === 401) {
                $window.location.href = $location.path();
            }
        });
    }
    $scope.editAll = function(item) {
        if (item.edit) {
            item["name"] = item['nameOrig'];
            item["desc"] = item['descOrig'];
            item["perm"] = item['permOrig'];
            item["unDay"] = item['unDayOrig'];
            item["unHit"] = item['unHitOrig'];
            item["auto"] = item['autoOrig'];
            item["newPwd"] = '';
            item["conPwd"] = '';
            item.edit = false;
        } else {
            item["nameOrig"] = item['name'];
            item["descOrig"] = item['desc'];
            item["permOrig"] = item['perm'];
            item["unDayOrig"] = item['unDay'];
            item["unHitOrig"] = item['unHit'];
            item["autoOrig"] = item['auto'];
            item.edit = true;
            item.nameFocus = true;
        }
    }
    $scope.preSaveAll = function(item) {
        if (!isValidString(item.name, 'name') && item.edit) {
            addAlert('name not vaild!!!');
        } else if (!isValidString(item.desc, 'desc') && item.edit && item.hasDesc) {
            addAlert('desc not vaild!!!');
        } else if (!isValidString(item.perm, 'perm') && item.edit && item.hasPerm) {
            addAlert('perm not vaild!!!');
        } else if (!isValidString(item.unDay, 'int') && item.edit && item.hasUnDay) {
            addAlert('unactive day not vaild!!!');
        } else if (!isValidString(item.unHit, 'int') && item.edit && item.hasUnHit) {
            addAlert('unactive hit not vaild!!!');
        } else if (item.auto && !isValidString(item.auto, 'url') && item.edit && item.editAuto) {
            addAlert('auto upload not vaild!!!');
        } else if ((item.newPwd || item.conPwd) && (!isValidString(item.newPwd, 'passwd') || !isValidString(item.conPwd, 'passwd'))) {
            item.newPwd = '';
            item.conPwd = '';
            addAlert('new password is not vaild!!!');
        } else if (item.newPwd !== item.conPwd) {
            item.newPwd = '';
            item.conPwd = '';
            addAlert('confirm password is not vaild!!!');
        } else {
            var set_obj = {};
            var differ = false;
            if (item.name !== item.nameOrig && item.edit) {
                differ = true;
                set_obj['name'] = item.name;
            }
            if (item.perm !== item.permOrig && item.edit) {
                differ = true;
                set_obj['perm'] = item.perm;
            }
            if (item.desc !== item.descOrig && item.edit) {
                differ = true;
                set_obj['desc'] = item.desc;
            }
            if (item.unDay !== item.unDayOrig && item.edit) {
                differ = true;
                set_obj['unDay'] = item.unDay;
            }
            if (item.unHit !== item.unHitOrig && item.edit) {
                differ = true;
                set_obj['unHit'] = item.unHit;
            }
            if (item.auto !== item.autoOrig && item.edit) {
                differ = true;
                set_obj['auto'] = item.auto;
            }
            if (item.newPwd) {
                differ = true;
                set_obj['newPwd'] = item.newPwd;
            }
            if (item.conPwd) {
                differ = true;
                set_obj['conPwd'] = item.conPwd;
            }
            if (differ) {
                openBlockPW(this.saveAll, this, item, set_obj);
            } else {
                this.editAll(item);
            }
        }
        return false;
    }
    $scope.saveAll = function(item, data) {
        var editInfo = null;
        if (item.key) {
            editInfo = $resource('/api/edituser/' + item.key, {}, {
                'editinfo': { method:'PUT' }
            });
        } else {
            editInfo = $resource('/api/edituser', {}, {
                'editinfo': { method:'PUT' }
            });
        }
        var this_obj = this;
        data["userPW"] = this.$parent.userPW;
        editInfo.editinfo(data, function(result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                addAlert('edit complete');
                if (result.hasOwnProperty('name')) {
                    item.name = result.name;
                }
                if (result.hasOwnProperty('desc')) {
                    item.desc = result.desc;
                }
                if (result.hasOwnProperty('perm')) {
                    item.perm = result.perm;
                }
                if (result.hasOwnProperty('unDay')) {
                    item.unDay = result.unDay;
                }
                if (result.hasOwnProperty('unHit')) {
                    item.unHit = result.unHit;
                }
                if (result.hasOwnProperty('auto')) {
                    item.auto = result.auto;
                }
                if (result.hasOwnProperty('owner')) {
                    this_obj.$parent.$parent.id = result.owner;
                }
                item.edit = false;
                item["newPwd"] = '';
                item["conPwd"] = '';
                this_obj.$parent.closeBlockPW(true);
            }
        }, function(errorResult) {
            item.newPwd = '';
            item.conPwd = '';
            if (errorResult.status === 400) {
                addAlert(errorResult.data);
            } else if (errorResult.status === 403) {
                addAlert('unknown API!!!');
            } else if (errorResult.status === 401) {
                $window.location.href = $location.path();
            }
        });
    }

    $scope.preDelUser = function(item) {
        openBlockPW(this.delUser, this, item);
        return false;
    }

    $scope.delUser = function(item) {
        var delInfo = $resource('/api/deluser/' + item.key, {}, {
            'delinfo': { method:'PUT' }
        });
        var this_obj = this;
        delInfo.delinfo({userPW: this.$parent.userPW}, function(result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                addAlert("user deleted successfully!");
                item.isDel = true;
                this_obj.$parent.closeBlockPW(true);
            }
        }, function(errorResult) {
            if (errorResult.status === 400) {
                addAlert(errorResult.data);
            } else if (errorResult.status === 403) {
                addAlert('unknown API!!!');
            } else if (errorResult.status === 401) {
                $window.location.href = $location.path();
            }
        });
    }
}

function LoginCntl($route, $routeParams, $resource, $scope, $location) {
    $scope.$parent.currentPage = 0;
    $scope.$parent.isRight = false;
    $scope.$parent.collapse.nav = true;
}

function StorageInfoCntl($route, $routeParams, $resource, $scope, $window, $cookies, $filter, FileUploader, $location) {
    //left
    $scope.$parent.collapse.nav = true;
    $scope.$parent.currentPage = 1;
    //right
    $scope.bookmarkCollapse = false;
    $scope.bookmarkEdit = false;
    $scope.$parent.isRight = true;
    //list
    $scope.page = 0;
    $scope.more = true;
    $scope.moreDisabled = false;
    $scope.itemList = [];
    $scope.latest = '';
    $scope.bookmarkID = '';
    $scope.parentList = [];
    $scope.historyList = [];
    $scope.exactlyList = [];
    $scope.searchBlur = false;
    $scope.multiSearch = false;
    $scope.toolList = {download: false, edit: false, upload:false, del: false, dir: false, download2local: false, downloadMusic: false, fixYoutube: false, subscription: false, title: '', item: null};
    $scope.dropdown.item = false;
    $scope.tagNew = false;
    $scope.tagNewFocus = false;
    $scope.selectList = [];
    $scope.tagList = [];
    $scope.exceptList = [];
    $scope.exactlyMatch = false;
    $scope.itemNameNew = false;
    $scope.itemNameNewFocus = false;
    $scope.uploadSub = false;
    $scope.feedbackBlur = false;
    $scope.bookmarkNew = false;
    $scope.bookmarkNewFocus = false;
    $scope.bookmarkList = [];
    $scope.bookmarkName = '';
    $scope.dirLocation = 0;
    $scope.isRelative = false;
    $scope.tCD = false;
    $scope.relativeList = [];
    $scope.pageToken = '';
    //cookie
    $scope.fileSort = {name:'', mtime: '', count: '', sort: 'name/asc'};
    $scope.dirSort = {name:'', mtime: '', count: '', sort: 'name/asc'};
    $scope.bookmarkSort = {name:'', mtime: '', sort: 'name/asc'};
    var lastRoute = $route.current;
    $scope.$on('$locationChangeSuccess', function(event) {
        if ($window.location.pathname === '/Storage') {
            $route.current = lastRoute;
        }
    });
    //$scope.navList.splice(0,1);
    //console.log($routeParams);
    var miscUploader = $scope.miscUploader = new FileUploader({
        url: '/upload/subtitle',
        withCredentials : true
    });

    miscUploader.onAfterAddingFile = function(fileItem) {
        //console.info('onAfterAddingFile', fileItem);
        if ($scope.toolList.item) {
            fileItem.url = $scope.main_url + '/upload/subtitle/' + $scope.toolList.item.id;
            this.uploadAll();
        } else {
            addAlert('Select item first!!!');
        }
    };
    miscUploader.onSuccessItem = function(fileItem, response, status, headers) {
        //console.info('onSuccessItem', fileItem, response, status, headers);
        $scope.uploadSub = false;
        this.clearQueue();
    };
    miscUploader.onErrorItem = function(fileItem, response, status, headers) {
        //console.info('onErrorItem', fileItem, response, status, headers);
        addAlert(response);
        this.clearQueue();
    };

    $scope.$watch("isExtend", function(newVal, oldVal) {
        if (newVal) {
            var extend = document.getElementById('extend-image-screen');
            if (extend) {
                extend.scrollTop = 0;
                extend.scrollLeft = extend.scrollWidth;
            }
        }
    }, true);

    $scope.$on('dir', function(e, d) {
        var result = JSON.parse(d);
        for (var i in $scope.dirList) {
            if ($scope.dirList[i].name === result.parent) {
                $scope.dirList[i].list.push({name: result.name, id: result.id});
                break;
            }
        }
    });
    $scope.$on('latest', function(e, d) {
        var result = JSON.parse(d);
        if ($scope.bookmarkID && $scope.bookmarkID === result.id) {
            $scope.latest = result.latest;
        }
    });
    $scope.$on('file', function(e, d) {
        var id = JSON.parse(d);
        var date;
        var index = arrayObjectIndexOf($scope.itemList, id, 'id');
        var storageApi = $resource('/api/storage/single/' + id, {}, {
            'single': { method:'get' }
        });
        var this_obj = this;
        storageApi.single({}, function (result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                if (result.empty) {
                    if (index !== -1) {
                        $scope.itemList.splice(index, 1);
                        $scope.page--;
                    }
                } else {
                    //$scope.latest = result.latest;
                    //$scope.bookmarkID = result.bookmarkID;
                    if (index !== -1) {
                        result.item.select = $scope.itemList[index].select;
                        date = new Date(result.item.utime*1000);
                        result.item.utime = date.getFullYear() + '/' + (date.getMonth()+1)+'/'+date.getDate();
                        $scope.itemList.splice(index, 1, result.item);
                    } else {
                        result.item.select = false;
                        date = new Date(result.item.utime*1000);
                        result.item.utime = date.getFullYear() + '/' + (date.getMonth()+1)+'/'+date.getDate();
                        $scope.itemList.splice(0, 0, result.item);
                    }
                }
            }
        }, function(errorResult) {
            if (errorResult.status === 400) {
                addAlert(errorResult.data);
            } else if (errorResult.status === 403) {
                addAlert('unknown API!!!');
            } else if (errorResult.status === 401) {
                $window.location.href = $location.path();
            }
        });
    });

    $scope.init = function(){
        this.page = 0;
        this.pageToken = '';
        this.more = true;
        if ($cookies.fileSortName === 'mtime') {
            this.fileSort.sort = 'mtime/';
            if ($cookies.fileSortType === 'desc') {
                this.fileSort.sort = this.fileSort.sort + 'desc';
                this.fileSort.mtime = 'desc';
            } else {
                this.fileSort.sort = this.fileSort.sort + 'asc';
                this.fileSort.mtime = 'asc';
            }
        } else if ($cookies.fileSortName === 'count') {
            this.fileSort.sort = 'count/';
            if ($cookies.fileSortType === 'desc') {
                this.fileSort.sort = this.fileSort.sort + 'desc';
                this.fileSort.count = 'desc';
            } else {
                this.fileSort.sort = this.fileSort.sort + 'asc';
                this.fileSort.count = 'asc';
            }
        } else {
            this.fileSort.sort = 'name/';
            if ($cookies.fileSortType === 'desc') {
                this.fileSort.sort = this.fileSort.sort + 'desc';
                this.fileSort.name = 'desc';
            } else {
                this.fileSort.sort = this.fileSort.sort + 'asc';
                this.fileSort.name = 'asc';
            }
        }
        if ($cookies.bookmarkSortName === 'mtime') {
            this.bookmarkSort.sort = 'mtime/';
            if ($cookies.bookmarkSortType === 'desc') {
                this.bookmarkSort.sort = this.bookmarkSort.sort + 'desc';
                this.bookmarkSort.mtime = 'desc';
            } else {
                this.bookmarkSort.sort = this.bookmarkSort.sort + 'asc';
                this.bookmarkSort.mtime = 'asc';
            }
        } else {
            this.bookmarkSort.sort = 'name/';
            if ($cookies.bookmarkSortType === 'desc') {
                this.bookmarkSort.sort = this.bookmarkSort.sort + 'desc';
                this.bookmarkSort.name = 'desc';
            } else {
                this.bookmarkSort.sort = this.bookmarkSort.sort + 'asc';
                this.bookmarkSort.name = 'asc';
            }
        }
        getItemlist(this);
        getBookmarklist();
    }

    $scope.changeSort = function(sort, name) {
        if (this[sort]) {
            if (name === 'name') {
                this[sort].sort = 'name/';
                if (this[sort].name === 'asc') {
                    this[sort].name = 'desc';
                    this[sort].sort = this[sort].sort + 'desc';
                } else {
                    this[sort].name = 'asc';
                    this[sort].sort = this[sort].sort + 'asc';
                }
                this[sort].mtime = '';
                this[sort].count = '';
            } else if (name === 'mtime') {
                this[sort].sort = 'mtime/';
                if (this[sort].mtime === 'asc') {
                    this[sort].mtime = 'desc';
                    this[sort].sort = this[sort].sort + 'desc';
                } else {
                    this[sort].mtime = 'asc';
                    this[sort].sort = this[sort].sort + 'asc';
                }
                this[sort].name = '';
                this[sort].count = '';
            } else if (name === 'count') {
                this[sort].sort = 'count/';
                if (this[sort].count === 'asc') {
                    this[sort].count = 'desc';
                    this[sort].sort = this[sort].sort + 'desc';
                } else {
                    this[sort].count = 'asc';
                    this[sort].sort = this[sort].sort + 'asc';
                }
                this[sort].name = '';
                this[sort].mtime = '';
            }
            if (sort === 'fileSort') {
                this.page = 0;
                this.pageToken = '';
                this.image.end = false;
                this.video.end = false;
                this.music.end = false;
                this.doc.end = false;
                this.present.end = false;
                this.more = true;
                getItemlist(this);
            } else if (sort === 'bookmarkSort') {
                getBookmarklist();
            }
        }
    }

    $scope.changeDirSort = function(item, name) {
        if (name === 'name') {
            item.sort = 'name/';
            if (item.sortName === 'asc') {
                item.sortName = 'desc';
                item.sort = item.sort + 'desc';
            } else {
                item.sortName = 'asc';
                item.sort = item.sort + 'asc';
            }
            item.sortMtime = '';
        } else if (name === 'mtime') {
            item.sort = 'mtime/';
            if (item.sortMtime === 'asc') {
                item.sortMtime = 'desc';
                item.sort = item.sort + 'desc';
            } else {
                item.sortMtime = 'asc';
                item.sort = item.sort + 'asc';
            }
            item.sortName = '';
        }
        item.page = 0;
        item.more = true;
        getTaglist(this, item);
    }

    $scope.submitText = function() {
        if (!this.inputText) {
            return false;
        }
        var this_obj = this;
        this.page = 0;
        this.pageToken = '';
        this.more = true;
        this.image.end = false;
        this.video.end = false;
        this.music.end = false;
        this.doc.end = false;
        this.present.end = false;
        getItemlist(this_obj, this.inputText);
        this.inputText = '';
    }

    $scope.exactlyStorage = function(this_obj, item) {
        this_obj.page = 0;
        this_obj.pageToken = '';
        this_obj.more = true;
        this_obj.image.end = false;
        this_obj.video.end = false;
        this_obj.music.end = false;
        this_obj.doc.end = false;
        this_obj.present.end = false;
        getItemlist(this_obj, item, 0, true);
    }

    $scope.fixYoutube = function() {
        if (this.toolList.item.playlist) {
            this.exactlyStorage(this, 'ypl_' + this.toolList.item.id);
        } else {
            this.exactlyStorage(this, 'yid_' + this.toolList.item.id);
        }
    }

    $scope.subscription = function() {
        if (isValidString(this.toolList.title, 'name')) {
            var this_obj = this;
            var bookmarkapi = $resource('/api/bookmark/subscipt', {}, {
                'subscipt': { method:'POST' }
            });
            bookmarkapi.subscipt({name: this.toolList.title, path: ['ych_' + this.toolList.item.cid, 'no local'], exactly: [false, false]}, function(result) {
                if (result.loginOK) {
                    $window.location.href = $location.path();
                } else {
                    if (result.id) {
                        this_obj.bookmarkList.push({id: result.id, name: result.name});
                    }
                    if (result.bid) {
                        result.id = result.bid;
                        result.name = result.bname;
                        if (this_obj.feedback.run) {
                            if (this_obj.feedback.uid === result.id) {
                                showFeedback(result);
                            } else {
                                if (arrayObjectIndexOf(this_obj.feedback.queue, result.id, 'id') === -1) {
                                    this_obj.feedback.queue.push(result);
                                } else {
                                    this_obj.feedback.queue.splice(index, 1, result);
                                }
                            }
                        } else {
                            this_obj.feedback.run = true;
                            showFeedback(result);
                        }
                    }
                    this_obj.bookmarkNew = false;
                    this_obj.bookmarkName = '';
                }
            }, function(errorResult) {
                if (errorResult.status === 400) {
                    addAlert(errorResult.data);
                } else if (errorResult.status === 403) {
                    addAlert('unknown API!!!');
                } else if (errorResult.status === 401) {
                    $window.location.href = $location.path();
                }
            });
        } else {
            addAlert('Bookmark name is not valid!!!');
        }
    }

    $scope.gotoStorage = function(this_obj, item, index) {
        this_obj.page = 0;
        this_obj.pageToken = '';
        this_obj.more = true;
        this_obj.image.end = false;
        this_obj.video.end = false;
        this_obj.music.end = false;
        this_obj.doc.end = false;
        this_obj.present.end = false;
        getItemlist(this_obj, item, index+1);
    }

    $scope.moreStorage = function() {
        if (this.more) {
            getItemlist(this);
        }
    }

    $scope.dirItemlist = function(id) {
        var this_obj = this.$parent.$parent;
        if (this_obj.multiSearch) {
            var parentApi = $resource('/api/parent/query/' + id, {}, {
                'query': { method:'get' }
            });
        } else {
            var parentApi = $resource('/api/parent/query/' + id + '/single', {}, {
                'query': { method:'get' }
            });
        }
        var more = true;
        this_obj.page = 0;
        this_obj.pageToken = '';
        this_obj.more = true;
        this_obj.image.end = false;
        this_obj.video.end = false;
        this_obj.music.end = false;
        this_obj.doc.end = false;
        this_obj.present.end = false;
        this_obj.moreDisabled = true;
        parentApi.query({}, function (result) {
            this_obj.itemList = [];
            if (result.itemList.length > 0) {
                var date;
                for (var i in result.itemList) {
                    if (arrayObjectIndexOf(this_obj.itemList, result.itemList[i].id, 'id') === -1) {
                        result.itemList[i].select = false;
                        date = new Date(result.itemList[i].utime*1000);
                        result.itemList[i].utime = date.getFullYear() + '/' + (date.getMonth()+1)+'/'+date.getDate();
                        this_obj.itemList.push(result.itemList[i]);
                    }
                }
            } else {
                more = false;
            }
            this_obj.page = result.itemList.length;
            this_obj.parentList = result.parentList.cur;
            this_obj.historyList = result.parentList.his;
            this_obj.exactlyList = result.parentList.exactly;
            //this_obj.moreDisabled = false;
            this_obj.$parent.collapse.storage = true;
            var Info = null;
            if (this_obj.pageToken) {
                Info = $resource('/api/youtube/get/' + this_obj.pageToken, {}, {
                    'youtube': { method:'GET' }
                });
            } else {
                Info = $resource('/api/youtube/get', {}, {
                    'youtube': { method:'GET' }
                });
            }
            Info.youtube({}, function(result) {
                if (result.pageToken) {
                    this_obj.pageToken = result.pageToken;
                }
                if (result.itemList.length > 0) {
                    var date;
                    for (var i in result.itemList) {
                        if (arrayObjectIndexOf(this_obj.itemList, result.itemList[i].id, 'id') === -1) {
                            result.itemList[i].select = false;
                            date = new Date(result.itemList[i].utime*1000);
                            result.itemList[i].utime = date.getFullYear() + '/' + (date.getMonth()+1)+'/'+date.getDate();
                            this_obj.itemList.push(result.itemList[i]);
                        }
                    }
                    $scope.more = true;
                } else {
                    if (!more) {
                        $scope.more = false;
                    } else {
                        $scope.more = true;
                    }
                }
                this_obj.moreDisabled = false;
            }, function(errorResult) {
                this_obj.moreDisabled = false;
                if (errorResult.status === 400) {
                    addAlert(errorResult.data);
                } else if (errorResult.status === 403) {
                    addAlert('unknown API!!!');
                } else if (errorResult.status === 401) {
                    $window.location.href = $location.path();
                }
            });
        }, function(errorResult) {
            this_obj.moreDisabled = false;
            if (errorResult.status === 400) {
                addAlert(errorResult.data);
            } else if (errorResult.status === 403) {
                addAlert('unknown API!!!');
            } else if (errorResult.status === 401) {
                $window.location.href = $location.path();
            }
        });
    }

    getItemlist = function (this_obj, name, index, isExactly) {
        name = typeof name !== 'undefined' ? name : null;
        index = typeof index !== 'undefined' ? index : 0;
        var Info = null, exactly = 'false', more = true;
        if (isExactly) {
            exactly = 'true';
        } else if (index) {
            if (this_obj.exactlyList[index-1]) {
                exactly = 'true';
            }
        } else if (this_obj.exactlyMatch){
            exactly = 'true';
        }
        if (!name && !index) {
            Info = $resource('/api/storage/get/' + this_obj.fileSort.sort + '/' + this_obj.page, {}, {
                'storage': { method:'GET' }
            });
        } else if (name && !index) {
            if (!isValidString(name, 'name')) {
                addAlert('search tag is not vaild!!!');
                return false;
            }
            if (this_obj.multiSearch) {
                Info = $resource('/api/storage/get/' + this_obj.fileSort.sort + '/' + this_obj.page + '/' + name + '/' + exactly, {}, {
                    'storage': { method:'GET' }
                });
            } else {
                Info = $resource('/api/storage/getSingle/' + this_obj.fileSort.sort + '/' + this_obj.page + '/' + name + '/' + exactly, {}, {
                    'storage': { method:'GET' }
                });
            }
        } else if (!name && index) {
            addAlert("not enough parameter");
            return false;
        } else {
            if (!isValidString(name, 'name')) {
                addAlert('search tag is not vaild!!!');
                return false;
            }
            Info = $resource('/api/storage/get/' + this_obj.fileSort.sort + '/' + this_obj.page + '/' + name + '/' + exactly + '/' + index, {}, {
                'storage': { method:'GET' }
            });
        }
        this_obj.moreDisabled = true;
        Info.storage({}, function (result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                if (this_obj.page === 0 && !this_obj.pageToken) {
                    this_obj.itemList = [];
                }
                if (result.itemList.length > 0) {
                    var date;
                    for (var i in result.itemList) {
                        if (arrayObjectIndexOf(this_obj.itemList, result.itemList[i].id, 'id') === -1) {
                            result.itemList[i].select = false;
                            date = new Date(result.itemList[i].utime*1000);
                            result.itemList[i].utime = date.getFullYear() + '/' + (date.getMonth()+1)+'/'+date.getDate();
                            this_obj.itemList.push(result.itemList[i]);
                        }
                    }
                } else {
                    more = false;
                }
                this_obj.page = this_obj.page + result.itemList.length;
                this_obj.latest = result.latest;
                this_obj.bookmarkID = result.bookmarkID;
                this_obj.parentList = result.parentList.cur;
                this_obj.historyList = result.parentList.his;
                this_obj.exactlyList = result.parentList.exactly;
                if (this_obj.pageToken) {
                    Info = $resource('/api/youtube/get/' + this_obj.pageToken, {}, {
                        'youtube': { method:'GET' }
                    });
                } else {
                    Info = $resource('/api/youtube/get', {}, {
                        'youtube': { method:'GET' }
                    });
                }
                Info.youtube({}, function(result) {
                    if (result.pageToken) {
                        this_obj.pageToken = result.pageToken;
                    }
                    if (result.itemList.length > 0) {
                        var date;
                        for (var i in result.itemList) {
                            if (arrayObjectIndexOf(this_obj.itemList, result.itemList[i].id, 'id') === -1) {
                                result.itemList[i].select = false;
                                date = new Date(result.itemList[i].utime*1000);
                                result.itemList[i].utime = date.getFullYear() + '/' + (date.getMonth()+1)+'/'+date.getDate();
                                this_obj.itemList.push(result.itemList[i]);
                            }
                        }
                        $scope.more = true;
                    } else {
                        if (!more) {
                            $scope.more = false;
                        } else {
                            $scope.more = true;
                        }
                    }
                    this_obj.moreDisabled = false;
                    this_obj.searchBlur = true;
                }, function(errorResult) {
                    this_obj.moreDisabled = false;
                    if (errorResult.status === 400) {
                        addAlert(errorResult.data);
                    } else if (errorResult.status === 403) {
                        addAlert('unknown API!!!');
                    } else if (errorResult.status === 401) {
                        $window.location.href = $location.path();
                    }
                });
            }
        }, function(errorResult) {
            this_obj.moreDisabled = false;
            if (errorResult.status === 400) {
                addAlert(errorResult.data);
            } else if (errorResult.status === 403) {
                addAlert('unknown API!!!');
            } else if (errorResult.status === 401) {
                $window.location.href = $location.path();
            }
        });
    }

    $scope.resetStorage = function() {
        var this_obj = this;
        this.page = 0;
        this.pageToken = '';
        this.image.end = false;
        this.video.end = false;
        this.music.end = false;
        this.doc.end = false;
        this.present.end = false;
        $scope.more = true;
        $scope.moreDisabled = true;
        var Info = $resource('/api/storage/reset', {}, {
            'storage': { method:'GET' }
        });
        Info.storage({}, function (result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                this_obj.itemList = [];
                var date;
                for (var i in result.itemList) {
                    result.itemList[i].select = false;
                    date = new Date(result.itemList[i].utime*1000);
                    result.itemList[i].utime = date.getFullYear() + '/' + (date.getMonth()+1)+'/'+date.getDate();
                    this_obj.itemList.push(result.itemList[i]);
                }
                this_obj.latest = '';
                this_obj.bookmarkID = '';
                this_obj.page = result.itemList.length;
                this_obj.parentList = result.parentList.cur;
                this_obj.historyList = result.parentList.his;
                this_obj.exactlyList = result.parentList.exactly;
                //this_obj.moreDisabled = false;
                if (this_obj.pageToken) {
                    Info = $resource('/api/youtube/get/' + this_obj.pageToken, {}, {
                        'youtube': { method:'GET' }
                    });
                } else {
                    Info = $resource('/api/youtube/get', {}, {
                        'youtube': { method:'GET' }
                    });
                }
                Info.youtube({}, function(result) {
                    if (result.pageToken) {
                        this_obj.pageToken = result.pageToken;
                    }
                    if (result.itemList.length > 0) {
                        var date;
                        for (var i in result.itemList) {
                            if (arrayObjectIndexOf(this_obj.itemList, result.itemList[i].id, 'id') === -1) {
                                result.itemList[i].select = false;
                                date = new Date(result.itemList[i].utime*1000);
                                result.itemList[i].utime = date.getFullYear() + '/' + (date.getMonth()+1)+'/'+date.getDate();
                                this_obj.itemList.push(result.itemList[i]);
                            }
                        }
                    }
                    this_obj.moreDisabled = false;
                }, function(errorResult) {
                    this_obj.moreDisabled = false;
                    if (errorResult.status === 400) {
                        addAlert(errorResult.data);
                    } else if (errorResult.status === 403) {
                        addAlert('unknown API!!!');
                    } else if (errorResult.status === 401) {
                        $window.location.href = $location.path();
                    }
                });
            }
        }, function(errorResult) {
            this_obj.moreDisabled = false;
            if (errorResult.status === 400) {
                addAlert(errorResult.data);
            } else if (errorResult.status === 403) {
                addAlert('unknown API!!!');
            } else if (errorResult.status === 401) {
                $window.location.href = $location.path();
            }
        });
    }

    $scope.$watch("itemList", function(newVal, oldVal) {
        var new_location = false;
        if ($scope.selectList.length === 0) {
            new_location = true;
        }
        $scope.selectList = $filter("filter")(newVal, {select:true});
        if ($scope.selectList.length > 0) {
            var tempList = $scope.tagList;
            if (new_location) {
                for (var i = 0; i < newVal.length; i++) {
                    if (newVal[i].select) {
                        if (i === 0) {
                            $scope.dirLocation = -1;
                        } else if ((i+1) < newVal.length) {
                            $scope.dirLocation = i+1;
                        } else {
                            $scope.dirLocation = i;
                        }
                        break;
                    }
                }
            }
            $scope.tagList = $scope.selectList[0].tags;
            $scope.exceptList = [];
            for (var i = 1; i < $scope.selectList.length; i++) {
                $scope.tagList = intersect($scope.tagList, $scope.selectList[i].tags, $scope.exceptList);
            }
            getRelativeTag(tempList);
        } else {
            $scope.tagList = [];
            $scope.exceptList = [];
            $scope.relativeList = [];
            $scope.isRelative = false;
            $scope.tagNew = false;
        }
    }, true);

    getRelativeTag = function(oldList) {
        if (!$scope.tCD) {
            $scope.tCD = true;
            setTimeout(function() {
                $scope.tCD = false;
                if ($scope.isRelative) {
                    var tags = [];
                    for (var i in $scope.tagList) {
                        if (oldList.indexOf($scope.tagList[i]) === -1) {
                            tags.push($scope.tagList[i]);
                        }
                    }
                    if (tags.length > 0) {
                        var Info = $resource('/api/getRelativeTag', {}, {
                            'relativeTag': { method:'PUT' }
                        });
                        Info.relativeTag({tags: tags}, function (result) {
                            if (result.loginOK) {
                                $window.location.href = $location.path();
                            } else {
                                for (var i in result.relative) {
                                    if ($scope.relativeList.indexOf(result.relative[i]) === -1 && $scope.tagList.indexOf(result.relative[i]) === -1 && $scope.exceptList.indexOf(result.relative[i]) === -1 && $scope.isRelative) {
                                        $scope.relativeList.push(result.relative[i]);
                                    }
                                }
                            }
                        }, function(errorResult) {
                            if (errorResult.status === 400) {
                                addAlert(errorResult.data);
                            } else if (errorResult.status === 403) {
                                addAlert('unknown API!!!');
                            } else if (errorResult.status === 401) {
                                $window.location.href = $location.path();
                            }
                        });
                    }
                }
            }, 1000);
        }
    }

    $scope.submitTag = function() {
        if (this.newTagName) {
            if (isValidString(this.newTagName, 'name')) {
                if (this.selectList.length > 0) {
                    var uids = [];
                    var this_obj = this;
                    for (var i in this.selectList) {
                        uids.push(this.selectList[i].id);
                    }
                    var Info = $resource('/api/addTag/' + this.newTagName, {}, {
                        'addTag': { method:'PUT' }
                    });
                    Info.addTag({uids: uids}, function (result) {
                        if (result.loginOK) {
                            $window.location.href = $location.path();
                        }
                        this_obj.tagNew = false;
                    }, function(errorResult) {
                        if (errorResult.status === 400) {
                            addAlert(errorResult.data);
                        } else if (errorResult.status === 403) {
                            addAlert('unknown API!!!');
                        } else if (errorResult.status === 401) {
                            $window.location.href = $location.path();
                        }
                    });
                } else {
                    addAlert('Please selects item!!!');
                }
            } else {
                addAlert('New tag is not vaild!!!');
            }
        } else {
            addAlert('Please inputs new tag!!!');
        }
    }

    $scope.addTag = function(tag) {
        if (isValidString(tag, 'name')) {
            if (this.selectList.length > 0) {
                var uids = [];
                var this_obj = this;
                for (var i in this.selectList) {
                    uids.push(this.selectList[i].id);
                }
                var Info = $resource('/api/addTag/' + tag, {}, {
                    'addTag': { method:'PUT' }
                });
                Info.addTag({uids: uids}, function (result) {
                    if (result.loginOK) {
                        $window.location.href = $location.path();
                    }
                    if (Number(i) === this_obj.selectList.length -1) {
                        this_obj.tagNew = false;
                    }
                }, function(errorResult) {
                    if (errorResult.status === 400) {
                        addAlert(errorResult.data);
                    } else if (errorResult.status === 403) {
                        addAlert('unknown API!!!');
                    } else if (errorResult.status === 401) {
                        $window.location.href = $location.path();
                    }
                });
            } else {
                addAlert('Please selects item!!!');
            }
        } else {
            addAlert('Tag is not vaild!!!');
        }
    }

    $scope.delTag = function(tag) {
        if (isValidString(tag, 'name')) {
            if (this.selectList.length > 0) {
                var uids = [];
                for (var i in this.selectList) {
                    uids.push(this.selectList[i].id);
                }
                var Info = $resource('/api/delTag/' + tag, {}, {
                    'delTag': { method:'PUT' }
                });
                Info.delTag({uids: uids}, function (result) {
                    if (result.loginOK) {
                        $window.location.href = $location.path();
                    }
                }, function(errorResult) {
                    if (errorResult.status === 400) {
                        addAlert(errorResult.data);
                    } else if (errorResult.status === 403) {
                        addAlert('unknown API!!!');
                    } else if (errorResult.status === 401) {
                        $window.location.href = $location.path();
                    }
                });
            } else {
                addAlert('Please selects item!!!');
            }
        } else {
            addAlert('Tag is not vaild!!!');
        }
    }

    $scope.add2Parent = function(item) {
        if (typeof this.toolList.item === 'string') {
            var Info = $resource('/api/parent/add', {}, {
                'addDir': { method:'POST' }
            });
            var this_obj = this;
            Info.addDir({ name: item.name, tag: this.toolList.item}, function (result) {
                if (result.id) {
                    for (var i in this_obj.dirList) {
                        if (this_obj.dirList[i].name === item.name) {
                            this_obj.dirList[i].list.push({name: result.name, id: result.id});
                            break;
                        }
                    }
                }
            }, function(errorResult) {
                if (errorResult.status === 400) {
                    addAlert(errorResult.data);
                } else if (errorResult.status === 403) {
                    addAlert('unknown API!!!');
                } else if (errorResult.status === 401) {
                    $window.location.href = $location.path();
                }
            });
        } else {
            addAlert('select a tag!!!');
        }
    }

    $scope.del2Parent = function(id, dir) {
        var this_obj = this;
        var Info = $resource('/api/parent/del/' + id, {}, {
            'delDir': { method:'DELETE' }
        });
        Info.delDir({}, function (result) {
            if (result.id) {
                index = arrayObjectIndexOf(dir.list, result.id, "id");
                if (index !== -1) {
                    dir.list.splice(index, 1);
                    dir.page--;
                }
            }
        }, function(errorResult) {
            if (errorResult.status === 400) {
                addAlert(errorResult.data);
            } else if (errorResult.status === 403) {
                addAlert('unknown API!!!');
            } else if (errorResult.status === 401) {
                $window.location.href = $location.path();
            }
        });
    }

    getTaglist = function(this_obj, item) {
        if (isValidString(item.name, 'name')) {
            item.moreDisabled = true;
            var Info = $resource('/api/parent/taglist/' + item.name + '/' + item.sort + '/' + item.page, {}, {
                'getTaglist': { method:'GET' }
            });
            Info.getTaglist({}, function (result) {
                if (item.page === 0) {
                    item.list = [];
                }
                if (result.taglist.length > 0) {
                    for (var i in result.taglist) {
                        if (arrayObjectIndexOf(item.list, result.taglist[i].id, 'id') === -1) {
                            item.list.push(result.taglist[i]);
                        }
                    }
                    item.page = item.page + result.taglist.length;
                } else {
                    item.more = false;
                }
                item.moreDisabled = false;
            }, function(errorResult) {
                item.moreDisabled = false;
                if (errorResult.status === 400) {
                    addAlert(errorResult.data);
                } else if (errorResult.status === 403) {
                    addAlert('unknown API!!!');
                } else if (errorResult.status === 401) {
                    $window.location.href = $location.path();
                }
            });
        } else {
            addAlert('Parent name is not vaild!!!');
        }
    }

    $scope.showTaglist = function(item) {
        item.collapse = !item.collapse;
        if (item.list.length === 0) {
            if ($cookies['dir' + item.name + 'SortName'] === 'mtime') {
                item.sort = 'mtime/';
                if ($cookies['dir' + item.name + 'SortType'] === 'desc') {
                    item.sort = item.sort + 'desc';
                    item.sortMtime = 'desc';
                } else {
                    item.sort = item.sort + 'asc';
                    item.sortMtime = 'asc';
                }
            } else {
                item.sort = 'name/';
                if ($cookies['dir' + item.name + 'SortType'] === 'desc') {
                    item.sort = item.sort + 'desc';
                    item.sortName = 'desc';
                } else {
                    item.sort = item.sort + 'asc';
                    item.sortName = 'asc';
                }
            }
            getTaglist(this.$parent, item);
        }
    }

    $scope.moreDirtaglist = function(item) {
        getTaglist(this, item);
    }

    $scope.fileRecover = function(item) {
        if (!item) {
            item = this.toolList.item;
        }
        var this_itemList = this.itemList;
        var Info = $resource('/api/recoverFile/' + item.id, {}, {
            'recoverFile': { method:'PUT' }
        });
        Info.recoverFile({}, function (result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            }
        }, function(errorResult) {
            if (errorResult.status === 400) {
                addAlert(errorResult.data);
            } else if (errorResult.status === 403) {
                addAlert('unknown API!!!');
            } else if (errorResult.status === 401) {
                $window.location.href = $location.path();
            }
        });
        return false;
    }

    $scope.fileDel = function(item) {
        if (!item) {
            item = this.toolList.item;
        }
        var this_itemList = this.itemList;
        var Info = $resource(this.main_url + '/api/delFile/' + item.id + '/' + item.recycle, {}, {
            'delFile': { method:'DELETE', withCredentials: true }
        });
        Info.delFile({}, function (result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            }
        }, function(errorResult) {
            if (errorResult.status === 400) {
                addAlert(errorResult.data);
            } else if (errorResult.status === 403) {
                addAlert('unknown API!!!');
            } else if (errorResult.status === 401) {
                $window.location.href = $location.path();
            }
        });
        return false;
    }

    $scope.fileEdit = function(item) {
        if (!item) {
            item = this.toolList.item;
        }
        if (isValidString(this.newItemName, 'name')) {
            var editFile = $resource(this.main_url + '/api/editFile/' + item.id, {}, {
                'editfile': { method:'PUT', withCredentials: true }
            });
            var this_obj = this;
            editFile.editfile({name: this.newItemName}, function(result) {
                if (result.loginOK) {
                    $window.location.href = $location.path();
                } else {
                    item.name = result.name;
                    this_obj.itemNameNew = false;
                    if (this_obj.feedback.run) {
                        if (this_obj.feedback.uid === result.id) {
                            showFeedback(result);
                        } else {
                            var index = arrayObjectIndexOf(this_obj.feedback.queue, result.id, 'id');
                            if (index === -1) {
                                this_obj.feedback.queue.push(result);
                            } else {
                                this_obj.feedback.queue.splice(index, 1, result);
                            }
                        }
                    } else {
                        this_obj.feedback.run = true;
                        showFeedback(result);
                    }
                }
            }, function(errorResult) {
                if (errorResult.status === 400) {
                    addAlert(errorResult.data);
                } else if (errorResult.status === 403) {
                    addAlert('unknown API!!!');
                } else if (errorResult.status === 401) {
                    $window.location.href = $location.path();
                }
            });
        } else {
            addAlert('name not vaild!!!');
        }
        return false;
    }

    $scope.showUrl = function(item) {
        if (!item) {
            item = this.toolList.item;
        }
        $window.open(decodeURIComponent(item.url));
        var mediaApi = $resource('/api/media/setTime/' + item.id + '/url', {}, {
            'setTime': { method:'GET' }
        });
        mediaApi.setTime({}, function (result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                if ($scope.bookmarkID) {
                    $scope.latest = item.id;
                }
            }
        }, function(errorResult) {
            if (errorResult.status === 400) {
                addAlert(errorResult.data);
            } else if (errorResult.status === 403) {
                addAlert('unknown API!!!');
            } else if (errorResult.status === 401) {
                $window.location.href = $location.path();
            }
        });
    }

    $scope.setBookmark = function(item) {
        var this_obj = this.$parent.$parent.$parent;
        var bookmarkapi = $resource('/api/bookmark/set/' + item.id, {}, {
            'setbookmark': { method:'GET' }
        });
        var more = true;
        this_obj.moreDisabled = true;
        this_obj.more = true;
        bookmarkapi.setbookmark({}, function(result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                this_obj.itemList = [];
                if (result.itemList.length > 0) {
                    var date;
                    for (var i in result.itemList) {
                        result.itemList[i].select = false;
                        date = new Date(result.itemList[i].utime*1000);
                        result.itemList[i].utime = date.getFullYear() + '/' + (date.getMonth()+1)+'/'+date.getDate();
                        this_obj.itemList.push(result.itemList[i]);
                    }
                } else {
                    more = false;
                }
                this_obj.page = result.itemList.length;
                this_obj.latest = result.latest;
                this_obj.bookmarkID = result.bookmarkID;
                this_obj.parentList = result.parentList.cur;
                this_obj.historyList = result.parentList.his;
                this_obj.exactlyList = result.parentList.exactly;
                //this_obj.moreDisabled = false;
                this_obj.$parent.collapse.storage = true;
                var Info = null;
                if (this_obj.pageToken) {
                    Info = $resource('/api/youtube/get/' + this_obj.pageToken, {}, {
                        'youtube': { method:'GET' }
                    });
                } else {
                    Info = $resource('/api/youtube/get', {}, {
                        'youtube': { method:'GET' }
                    });
                }
                Info.youtube({}, function(result) {
                    if (result.pageToken) {
                        this_obj.pageToken = result.pageToken;
                    }
                    if (result.itemList.length > 0) {
                        var date;
                        for (var i in result.itemList) {
                            if (arrayObjectIndexOf(this_obj.itemList, result.itemList[i].id, 'id') === -1) {
                                result.itemList[i].select = false;
                                date = new Date(result.itemList[i].utime*1000);
                                result.itemList[i].utime = date.getFullYear() + '/' + (date.getMonth()+1)+'/'+date.getDate();
                                this_obj.itemList.push(result.itemList[i]);
                            }
                        }
                        $scope.more = true;
                    } else {
                        if (!more) {
                            $scope.more = false;
                        } else {
                            $scope.more = true;
                        }
                    }
                    this_obj.moreDisabled = false;
                }, function(errorResult) {
                    this_obj.moreDisabled = false;
                    if (errorResult.status === 400) {
                        addAlert(errorResult.data);
                    } else if (errorResult.status === 403) {
                        addAlert('unknown API!!!');
                    } else if (errorResult.status === 401) {
                        $window.location.href = $location.path();
                    }
                });
            }
        }, function(errorResult) {
            this_obj.moreDisabled = false;
            if (errorResult.status === 400) {
                addAlert(errorResult.data);
            } else if (errorResult.status === 403) {
                addAlert('unknown API!!!');
            } else if (errorResult.status === 401) {
                $window.location.href = $location.path();
            }
        });
    }

    $scope.showMedia = function(item, type) {
        if (this[type] && (this[type].id === item.id)) {
            this.mediaToggle(type, true);
            return false;
        }
        var preType = '', status = 0, docRecord = 0;
        switch (type) {
            case 'image':
                preType = 'image';
                this.image.showId = this.image.presentId = 1;
                status = 2;
                break;
            case 'video':
                preType = 'video';
                status = 3;
                break;
            case 'music':
                preType = 'video';
                status = 4;
                break;
            case 'doc':
                preType = 'preview';
                docRecord = this.doc.showId;
                this.doc.showId = this.doc.presentId = 1;
                status = 5;
                break;
            case 'present':
                this.present.showId = this.present.presentId = 1;
                preType = 'preview';
                status = 6;
                break;
            default:
                addAlert('unknown type');
                return false;
        }
        var this_obj = this;
        var apiMedia = $resource('/api/media/saveParent', {}, {
            'saveParent': { method:'POST' }
        });
        apiMedia.saveParent({name: type}, function(result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                if (this_obj[type].id) {
                    this_obj.mediaRecord(type, docRecord);
                }
                var append = '';
                if (item.thumb) {
                    append = '/youtube';
                }
                var mediaApi = $resource('/api/media/setTime/' + item.id + '/' + type + append, {}, {
                    'setTime': { method:'GET' }
                });
                mediaApi.setTime({}, function (result) {
                    if (result.loginOK) {
                        $window.location.href = $location.path();
                    } else {
                        if (result.time) {
                            var setTime = result.time.toString().match(/^(\d+)(&(\d+))?$/);
                            if (setTime) {
                                if (type === 'video') {
                                    videoStart = setTime[1];
                                    if (setTime[3]) {
                                        videoIndex = setTime[3];
                                    }
                                } else if (type === 'music'){
                                    musicStart = setTime[1];
                                } else {
                                    this_obj.$parent[type].presentId = this_obj.$parent[type].showId = setTime[1];
                                }
                            }
                        }
                        if (type === 'video') {
                            if (yplayer) {
                                yplayer.destroy();
                                yplayer = null;
                            }
                        }
                        if (type === 'doc') {
                            this_obj.$parent[type].iframeOffset = null;
                            this_obj.$parent[type].src = $scope.main_url + '/' + preType + '/' + item.id + '/doc';
                        } else if (type === 'video' && item.thumb) {
                            this_obj.$parent[type].src = null;
                            onYouTubeIframeAPIReady(item.id, item.playlist);
                            this_obj.$parent[type].playlist = item.playlist;
                            if ($scope.pageToken) {
                                this_obj.$parent[type].pageToken = $scope.pageToken;
                            }
                        } else {
                            this_obj.$parent[type].src = $scope.main_url + '/' + preType + '/' + item.id;
                        }
                        this_obj.$parent[type].maxId = item.present;
                        if (type === 'video' && !item.thumb) {
                            removeCue();
                            this_obj.$parent[type].sub = $scope.main_url + '/subtitle/' + item.id;
                        }
                        var tempList = $filter("filter")(this_obj.itemList, {status: status});
                        this_obj.$parent[type].name = item.name;
                        this_obj.$parent[type].bookmarkID = $scope.bookmarkID;
                        this_obj.$parent[type].id = item.id;
                        if ($scope.bookmarkID) {
                            $scope.latest = item.id;
                        }
                        this_obj.$parent.mediaToggle(type, true);
                        this_obj.$parent[type].list = clone(tempList);
                        this_obj.$parent[type].front = this_obj.$parent[type].list.length;
                        this_obj.$parent[type].frontPage = this_obj.$parent[type].front;
                        var index = arrayObjectIndexOf(this_obj.$parent[type].list, item.id, 'id');
                        if (index !== -1) {
                            this_obj.$parent[type].index = index;
                        }
                    }
                }, function(errorResult) {
                    if (errorResult.status === 400) {
                        addAlert(errorResult.data);
                    } else if (errorResult.status === 403) {
                        addAlert('unknown API!!!');
                    } else if (errorResult.status === 401) {
                        $window.location.href = $location.path();
                    }
                });
            }
        }, function(errorResult) {
            if (errorResult.status === 400) {
                addAlert(errorResult.data);
            } else if (errorResult.status === 403) {
                addAlert('unknown API!!!');
            } else if (errorResult.status === 401) {
                $window.location.href = $location.path();
            }
        });
    }

    $scope.downloadFile = function (id) {
        if (!id) {
            id = this.toolList.item.id;
        }
        if ($scope.bookmarkID) {
            $scope.latest = id;
        }
        $window.location.href = this.main_url + '/download/' + id;
    }

    $scope.handleMedia = function(action, item) {
        if (!item) {
            item = this.toolList.item;
        }
        if (action == 'act'|| action == 'vlog' || action == 'del') {
            var handleMedia = $resource(this.main_url + '/api/handleMedia/' + item.id + '/' + action, {}, {
                'handlemedia': { method:'GET', withCredentials: true }
            });
            handleMedia.handlemedia({}, function(result) {
                if (result.loginOK) {
                    $window.location.href = $location.path();
                } else {

                }
            }, function(errorResult) {
                if (errorResult.status === 400) {
                    addAlert(errorResult.data);
                } else if (errorResult.status === 403) {
                    addAlert('unknown API!!!');
                } else if (errorResult.status === 401) {
                    $window.location.href = $location.path();
                }
            });
        } else {
            addAlert('handle action not vaild!!!');
        }
        return false;
    }

    $scope.selectItem = function($event, item) {
        if (typeof item === 'string') {
            this.$parent.toolList.dir = true;
            this.$parent.toolList.download = false;
            this.$parent.toolList.edit = false;
            this.$parent.toolList.del = false;
            this.$parent.toolList.recover = false;
            this.$parent.toolList.upload = false;
            this.$parent.toolList.delMedia = false;
            this.$parent.toolList.vlogMedia = false;
            this.$parent.toolList.download2local = false;
            this.$parent.toolList.downloadMusic = false;
            this.$parent.toolList.fixYoutube = false;
            this.$parent.toolList.subscription = false;
            confirm_str = item;
        } else {
            if (item.status === 7 || item.status === 8 || item.thumb) {
                this.$parent.toolList.download = false;
            } else {
                this.$parent.toolList.download = true;
            }
            this.$parent.toolList.dir = false;
            if (item.isOwn) {
                this.$parent.toolList.edit = true;
                this.$parent.toolList.del = true;
            } else {
                this.$parent.toolList.edit = false;
                this.$parent.toolList.del = false;
            }
            if (item.recycle === 1 || item.recycle === 2 || item.recycle === 3 || item.recycle === 4) {
                this.$parent.toolList.recover = true;
            } else {
                this.$parent.toolList.recover = false;
            }
            if (item.status === 3 && !item.thumb) {
                this.$parent.toolList.upload = true;
            } else {
                this.$parent.toolList.upload = false;
            }
            if (item.media) {
                this.$parent.toolList.delMedia = true;
                this.$parent.toolList.vlogMedia = true;
            } else {
                this.$parent.toolList.delMedia = false;
                this.$parent.toolList.vlogMedia = false;
            }
            if (item.thumb) {
                if (item.playlist) {
                    this.$parent.toolList.download2local = false;
                    this.$parent.toolList.downloadMusic = false;
                } else {
                    this.$parent.toolList.download2local = true;
                    this.$parent.toolList.downloadMusic = true;
                }
                this.$parent.toolList.fixYoutube = true;
                if (item.cid) {
                    this.$parent.toolList.subscription = true;
                    this.$parent.toolList.title = item.ctitle;
                }
            } else {
                this.$parent.toolList.download2local = false;
                this.$parent.toolList.downloadMusic = false;
                this.$parent.toolList.downloadO2local = false;
                this.$parent.toolList.downloadOMusic = false;
                this.$parent.toolList.fixYoutube = false;
                this.$parent.toolList.subscription = false;
            }
        }
        this.toggleDropdown($event, 'item');
        this.$parent.toolList.item = item;
    }

    $scope.cancelSelect = function() {
        if (this.selectList.length) {
            for (var i in this.itemList) {
                this.itemList[i].select = false;
            }
        } else {
            for (var i in this.itemList) {
                this.itemList[i].select = true;
            }
        }
        return false;
    }

    $scope.openNewTag = function() {
        if (this.selectList.length) {
            this.newTagName = '';
            this.tagNew = true;
            this.tagNewFocus = true;
            var oldList = [];
            if (this.isRelative) {
                oldList = this.tagList;
            }
            this.isRelative = true;
            getRelativeTag(oldList);
        }
        return false;
    }

    $scope.getBookmarkItem = function(id) {
        var this_obj = this;
        var bookmarkapi = $resource('/api/bookmark/get/' + id, {}, {
            'getbookmark': { method:'GET' }
        });
        var more = true;
        this.$parent.moreDisabled = true;
        this.$parent.more = true;
        bookmarkapi.getbookmark({}, function(result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                this_obj.$parent.itemList = [];
                if (result.itemList.length > 0) {
                    var date;
                    for (var i in result.itemList) {
                        result.itemList[i].select = false;
                        date = new Date(result.itemList[i].utime*1000);
                        result.itemList[i].utime = date.getFullYear() + '/' + (date.getMonth()+1)+'/'+date.getDate();
                        this_obj.$parent.itemList.push(result.itemList[i]);
                    }
                } else {
                    more = false;
                }
                this_obj.$parent.page = result.itemList.length;
                this_obj.$parent.latest = result.latest;
                this_obj.$parent.bookmarkID = result.bookmarkID;
                this_obj.$parent.parentList = result.parentList.cur;
                this_obj.$parent.historyList = result.parentList.his;
                this_obj.$parent.exactlyList = result.parentList.exactly;
                //this_obj.$parent.moreDisabled = false;
                this_obj.$parent.$parent.collapse.storage = true;
                var Info = null;
                if (this_obj.$parent.pageToken) {
                    Info = $resource('/api/youtube/get/' + this_obj.$parent.pageToken, {}, {
                        'youtube': { method:'GET' }
                    });
                } else {
                    Info = $resource('/api/youtube/get', {}, {
                        'youtube': { method:'GET' }
                    });
                }
                Info.youtube({}, function(result) {
                    if (result.pageToken) {
                        this_obj.$parent.pageToken = result.pageToken;
                    }
                    if (result.itemList.length > 0) {
                        var date;
                        for (var i in result.itemList) {
                            if (arrayObjectIndexOf(this_obj.$parent.itemList, result.itemList[i].id, 'id') === -1) {
                                result.itemList[i].select = false;
                                date = new Date(result.itemList[i].utime*1000);
                                result.itemList[i].utime = date.getFullYear() + '/' + (date.getMonth()+1)+'/'+date.getDate();
                                this_obj.$parent.itemList.push(result.itemList[i]);
                            }
                        }
                        $scope.more = true;
                    } else {
                        if (!more) {
                            $scope.more = false;
                        } else {
                            $scope.more = true;
                        }
                    }
                    this_obj.$parent.moreDisabled = false;
                }, function(errorResult) {
                    this_obj.$parent.moreDisabled = false;
                    if (errorResult.status === 400) {
                        addAlert(errorResult.data);
                    } else if (errorResult.status === 403) {
                        addAlert('unknown API!!!');
                    } else if (errorResult.status === 401) {
                        $window.location.href = $location.path();
                    }
                });
            }
        }, function(errorResult) {
            this_obj.$parent.moreDisabled = false;
            if (errorResult.status === 400) {
                addAlert(errorResult.data);
            } else if (errorResult.status === 403) {
                addAlert('unknown API!!!');
            } else if (errorResult.status === 401) {
                $window.location.href = $location.path();
            }
        });
    }

    getBookmarklist = function() {
        var bookmarkapi = $resource('/api/bookmark/getlist/' + $scope.bookmarkSort.sort, {}, {
            'getbookmarklist': { method:'GET' }
        });
        bookmarkapi.getbookmarklist({}, function(result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                $scope.bookmarkList = result.bookmarkList;
            }
        }, function(errorResult) {
            if (errorResult.status === 400) {
                addAlert(errorResult.data);
            } else if (errorResult.status === 403) {
                addAlert('unknown API!!!');
            } else if (errorResult.status === 401) {
                $window.location.href = $location.path();
            }
        });
    }

    $scope.addBookmark = function(bookmarkName) {
        if (!bookmarkName) {
            bookmarkName = this.bookmarkName;
        }
        if (this.parentList.length <= 0) {
            addAlert('Empty parent list!!!');
            return false;
        }
        if (isValidString(bookmarkName, 'name')) {
            var this_obj = this;
            var bookmarkapi = $resource('/api/bookmark/add', {}, {
                'addbookmark': { method:'POST' }
            });
            bookmarkapi.addbookmark({name: bookmarkName}, function(result) {
                if (result.loginOK) {
                    $window.location.href = $location.path();
                } else {
                    if (result.id) {
                        this_obj.bookmarkList.push({id: result.id, name: result.name});
                    }
                    if (result.bid) {
                        result.id = result.bid;
                        result.name = result.bname;
                        if (this_obj.feedback.run) {
                            if (this_obj.feedback.uid === result.id) {
                                showFeedback(result);
                            } else {
                                if (arrayObjectIndexOf(this_obj.feedback.queue, result.id, 'id') === -1) {
                                    this_obj.feedback.queue.push(result);
                                } else {
                                    this_obj.feedback.queue.splice(index, 1, result);
                                }
                            }
                        } else {
                            this_obj.feedback.run = true;
                            showFeedback(result);
                        }
                    }
                    this_obj.bookmarkNew = false;
                    this_obj.bookmarkName = '';
                }
            }, function(errorResult) {
                if (errorResult.status === 400) {
                    addAlert(errorResult.data);
                } else if (errorResult.status === 403) {
                    addAlert('unknown API!!!');
                } else if (errorResult.status === 401) {
                    $window.location.href = $location.path();
                }
            });
        } else {
            addAlert('Bookmark name is not valid!!!');
        }
    }

    $scope.delBookmark = function(id) {
        var this_obj = this;
        var bookmarkapi = $resource('/api/bookmark/del/' + id, {}, {
            'delbookmark': { method:'DELETE' }
        });
        bookmarkapi.delbookmark({}, function(result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                var index = arrayObjectIndexOf(this_obj.$parent.bookmarkList, result.id, "id");
                if (index !== -1) {
                    this_obj.$parent.bookmarkList.splice(index, 1);
                }
            }
        }, function(errorResult) {
            if (errorResult.status === 400) {
                addAlert(errorResult.data);
            } else if (errorResult.status === 403) {
                addAlert('unknown API!!!');
            } else if (errorResult.status === 401) {
                $window.location.href = $location.path();
            }
        });
    }
}

app.controller('ModalInstanceCtrl', function ($scope, $modalInstance, msg) {
    $scope.msg = msg;
    $scope.ok = function () {
        $modalInstance.close();
    };
    $scope.cancel = function () {
        $modalInstance.dismiss();
    };
});

app.controller('mainCtrl', ['$scope', '$http', '$resource', '$location', '$route', '$window', '$cookies', '$timeout', '$filter', '$modal', 'FileUploader', function($scope, $http, $resource, $location, $route, $window, $cookies, $timeout, $filter, $modal, FileUploader) {
    //login
    $scope.username = '';
    $scope.password = '';
    $scope.id = 'guest';
    $scope.main_url = '';
    $scope.loginFocus = {user: true, pwd:false};
    $scope.isLogin = false;
    //left
    $scope.currentPage = 0;
    $scope.collapse= {};
    $scope.collapse.nav = true;
    $scope.collapse.storage = true;
    $scope.collapse.stock = true;
    $scope.collapse.password = true;
    $scope.navList = [{title: "homepage", hash: "/", css: "fa fa-fw fa-dashboard"}, {title: "Storage", hash: "/Storage", css: "fa fa-fw fa-desktop"}];
    //right
    $scope.dirList = [];
    $scope.dirEdit = false;
    $scope.isRight = false;
    //feedback
    $scope.dropdown = {};
    $scope.dropdown.feedback = false;
    $scope.feedbackDisabled = true;
    $scope.feedbackSelectTag = '';
    $scope.feedback = {uid: '', name: '', relative: 0, list: [], run: false, queue: [], history: [], other: []};
    //dialog
    $scope.widget = {};
    $scope.widget.uploader = false;
    $scope.widget.feedback = false;
    $scope.mediaMoreDisabled = false;
    $scope.isFull = false;
    $scope.isVisible = false;
    $scope.isExtend = false;
    $scope.adultonly = false;
    $scope.mediaShow = [];
    $scope.image = {id: "", src: "", name: "null", list: [], index: 0, front: 0, back: 0, frontPage: 0, backPage: 0, end: false, bookmarkID: '', presentId: 1, showId: 1, maxId: 1};
    $scope.video = {id: "", src: "", sub: "", name: "null", list: [], index: 0, front: 0, back: 0, frontPage: 0, backPage: 0, end: false, bookmarkID: '', download: 0};
    $scope.music = {id: "", src: "", name: "null", list: [], index: 0, front: 0, back: 0, frontPage: 0, backPage: 0, end: false, bookmarkID: '', shuffle: false};
    $scope.doc = {id: "", src: "", name: "null", list: [], index: 0, front: 0, back: 0, frontPage: 0, backPage: 0, end: false, bookmarkID: '', presentId: 1, showId: 1, maxId: 1, mode: false};
    $scope.present = {id: "", src: "", name: "null", list: [], index: 0, front: 0, back: 0, frontPage: 0, backPage: 0, end: false, bookmarkID: '', presentId: 1, showId: 1, maxId: 1};
    $scope.inputUrl = '';
    $scope.disableUrlSave = false;
    $scope.isAdult = false;
    //alert
    $scope.alerts = [];
    var alertTime;

    //block
    $scope.pwBlock = false;
    $scope.userPW = '';
    $scope.userPWFocus = false;
    $scope.pwObj = null;
    $scope.pwArgs = [];
    $scope.pwCallback = null;
    var need_auth = true;

    indexInit();

    var is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

    $scope.videoToggle = function() {
        if (!is_firefox) {
            video.focus();
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        }
    }

    if (!is_firefox) {
        document.getElementById('music-tag').onkeydown = function(evt) {
            evt = evt || window.event;
            switch(evt.keyCode) {
                case 32:
                if (music.paused) {
                    music.play();
                } else {
                    music.pause();
                }
                break;
                case 37:
                if (music.currentTime >= 15) {
                    music.currentTime -= 15;
                } else {
                    music.currentTime = 0;
                }
                break;
                case 38:
                if (music.volume < 0.9) {
                    music.volume+= 0.1;
                } else {
                    music.volume = 1;
                }
                break;
                case 39:
                music.currentTime += 15;
                break;
                case 40:
                if (music.volume > 0.1) {
                    music.volume-= 0.1;
                } else {
                    music.volume = 0;
                }
                break;
            }
        };
    }

    document.getElementById('video-tag').onkeydown = function(evt) {
        evt = evt || window.event;
        if (is_firefox) {
            switch(evt.keyCode) {
                case 67:
                if (video.textTracks[0].mode === 'showing') {
                    video.textTracks[0].mode = "hidden";
                } else {
                    video.textTracks[0].mode = "showing";
                }
                break;
            }
        } else {
            switch(evt.keyCode) {
                case 32:
                if (video.paused) {
                    video.play();
                } else {
                    video.pause();
                }
                break;
                case 37:
                if (video.currentTime >= 15) {
                    video.currentTime -= 15;
                } else {
                    video.currentTime = 0;
                }
                break;
                case 38:
                if (video.volume < 0.9) {
                    video.volume+= 0.1;
                } else {
                    video.volume = 1;
                }
                break;
                case 39:
                video.currentTime += 15;
                break;
                case 40:
                if (video.volume > 0.1) {
                    video.volume-= 0.1;
                } else {
                    video.volume = 0;
                }
                break;
                case 67:
                if (video.textTracks[0].mode === 'showing') {
                    video.textTracks[0].mode = "hidden";
                } else {
                    video.textTracks[0].mode = "showing";
                }
                break;
            }
        }
    };
    if (is_firefox) {
        $scope.$watch("video.sub", function(newVal, oldVal) {
            if (newVal) {
                if (!video.textTracks.length){
                    video.addTextTrack("subtitles", "English", "en-US");
                    video.textTracks[0].mode = "showing";
                }
                // Create XMLHttpRequest object
                var xhr;
                if (window.XMLHttpRequest) {
                    xhr = new XMLHttpRequest();
                } else if (window.ActiveXObject) { // IE8
                    xhr = new ActiveXObject("Microsoft.XMLHTTP");
                }
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            var parser = new WebVTT.Parser(window, WebVTT.StringDecoder());
                            parser.oncue = function(cue) {
                                video.textTracks[0].addCue(cue);
                            };
                            parser.parse(xhr.responseText);
                            parser.flush();
                        }
                    }
                }
                xhr.open("get", newVal, true);
                xhr.send();
            }
        }, true);
    }

    removeCue = function() {
        var track = video.textTracks[0];
        if (track) {
            var cues = track.cues;
            if (cues && cues.length > 0) {
                for (var i=cues.length-1;i>=0;i--) {
                    track.removeCue(cues[i]);
                }
            }
        }
    }

    openBlockPW = function(callback, obj) {
        if (need_auth) {
            $scope.pwBlock = true;
            $scope.userPW = '';
            $scope.userPWFocus = true;
            $scope.pwArgs = Array.prototype.slice.call(arguments, 2);
            $scope.pwObj = obj;
            $scope.pwCallback = callback;
        } else {
            callback.apply(obj, Array.prototype.slice.call(arguments, 2));
        }
    }

    $scope.closeBlockPW = function(is_auth) {
        if ($scope.userPW && is_auth) {
            need_auth = false;
            setTimeout(function() {
                need_auth = true;
            }, 60000);
        }
        $scope.pwBlock = false;
        $scope.userPW = '';
        $scope.userPWFocus = false;
        $scope.pwObj = null;
        $scope.pwCallback = null;
        $scope.pwArgs = [];
    }

    $scope.sendPW = function() {
        if (this.userPW && !isValidString(this.userPW, 'passwd')) {
            addAlert('user password is not vaild!!!');
        } else {
            this.pwCallback.apply(this.pwObj, this.pwArgs);
        }
    }

    addAlert = function(msg) {
        $scope.alerts.splice(0,0,{type: 'danger', msg: msg});
        $timeout.cancel(alertTime);
        alertTime = $timeout(function() {
            $scope.alerts = [];
        }, 5000);
    };

    window.onbeforeunload = function (event) {
        var vId = $scope.video.id;
        if (vId) {
            var append = '';
            var vTime = 0;
            if ($scope.video.src) {
                vTime = parseInt(video.currentTime);
            } else {
                append = '/youtube';
                vTime = parseInt(yplayer.getCurrentTime());
                var index = -1;
                index = yplayer.getPlaylistIndex();
                if (index !== -1) {
                    vTime = vTime + '&' + index;
                }
            }
            var vXmlhttp = new XMLHttpRequest();
            vXmlhttp.open("GET", "/api/media/record/" + vId + '/' + vTime + append, false);//the false is for making the call synchronous
            vXmlhttp.setRequestHeader("Content-type", "application/json");
            vXmlhttp.send('');
        }
        /*var mId = $scope.music.id;
        if (mId) {
            var mTime = parseInt(music.currentTime);
            var mXmlhttp = new XMLHttpRequest();
            mXmlhttp.open("GET", "/api/media/record/" + mId + '/' + mTime, false);//the false is for making the call synchronous
            mXmlhttp.setRequestHeader("Content-type", "application/json");
            mXmlhttp.send('');
        }*/
        var dId = $scope.doc.id;
        if (dId && $scope.doc.iframeOffset) {
            var dTime = $scope.doc.showId;
            var mXmlhttp = new XMLHttpRequest();
            mXmlhttp.open("GET", "/api/media/record/" + dId + '/' + dTime, false);//the false is for making the call synchronous
            mXmlhttp.setRequestHeader("Content-type", "application/json");
            mXmlhttp.send('');
        }
        if (uploader.isUploading) {
            return "You have uploaded files. Are you sure you want to navigate away from this page?";
        }
    };

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };
    openModal = function (msg) {
        var modalInstance = $modal.open({
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl',
            resolve: {
                msg: function () {
                    return msg;
                }
            }
        });
        return modalInstance.result;
    };

    $scope.selectFeedbackTag = function($event, tag) {
        var pre = $scope.feedbackSelectTag;
        $scope.feedbackSelectTag = tag;
        confirm_str = tag;
        this.toggleDropdown($event, 'feedback');
    }
    $scope.toggleWidget = function (type) {
        if (!this.widget[type]) {
            this.widget[type] = true;
        } else {
            this.widget[type] = false;
        }
    }
    $scope.toggleDropdown = function($event, type) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.dropdown[type] = true;
    };
    var uploader = $scope.uploader = new FileUploader({
        url: 'upload/file',
        withCredentials : true
    });
    uploader.onAfterAddingFile = function(fileItem) {
        $scope.widget.uploader = true;
        //console.info('onAfterAddingFile', fileItem);
    };
    uploader.onBeforeUploadItem = function(item) {
        if ($scope.adultonly) {
            item.url = $scope.main_url + '/upload/file/1';
        } else {
            item.url = $scope.main_url + '/upload/file';
        }
        //console.info('onBeforeUploadItem', item);
    };
    uploader.onSuccessItem = function(fileItem, response, status, headers) {
        //console.info('onSuccessItem', fileItem, response, status, headers);
        if ($scope.feedback.run) {
            if ($scope.feedback.uid === response.id) {
                showFeedback(response);
            } else {
                if (arrayObjectIndexOf($scope.feedback.queue, response.id, 'id') === -1) {
                    $scope.feedback.queue.push(response);
                } else {
                    $scope.feedback.queue.splice(index, 1, response);
                }
            }
        } else {
            $scope.feedback.run = true;
            showFeedback(response);
        }
    };

    $scope.doLogout = function(login_url){
        login_url = typeof login_url !== 'undefined' ? login_url : '';
        var Users = $resource(login_url + '/api/logout', {}, {
            'logout': { method:'GET', withCredentials: true }
        });
        var this_obj = this;
        Users.logout({}, function (user) {
            if (user.loginOK) {
                if (user.url) {
                    this_obj.doLogin(user.url);
                } else {
                    $window.location.href = $location.path();
                }
            } else {
                if (user.url) {
                    this_obj.doLogout(user.url);
                } else {
                    $window.location.href = $location.path();
                }
            }
        }, function(errorResult) {
            if (errorResult.status === 400) {
                addAlert(errorResult.data);
            } else if (errorResult.status === 403) {
                addAlert('unknown API!!!');
            } else if (errorResult.status === 401) {
                $window.location.href = $location.path();
            }
        });
    }
    $scope.doLogin = function(login_url) {
        login_url = typeof login_url !== 'undefined' ? login_url : '';
        if (isValidString(this.username, 'name') && isValidString(this.password, 'passwd')) {
            var Users = $resource(login_url + '/api', {}, {
                'login': { method:'POST', withCredentials: true }
            });
            var this_obj = this;
            Users.login({ username: this.username, password: this.password}, function (user) {
                if (user.loginOK) {
                    if (user.url) {
                        this_obj.doLogin(user.url);
                    } else {
                        $window.location.href = $location.path();
                    }
                }
            }, function (errorResult) {
                if (errorResult.status === 400) {
                    addAlert(errorResult.data);
                } else if (errorResult.status === 403) {
                    addAlert('unknown API!!!');
                } else if (errorResult.status === 401) {
                    $window.location.href = $location.path();
                }
            });
        } else {
            addAlert('user name or password is not vaild!!!');
            this.username = '';
            this.password = '';
        }
    }
    $scope.addFeedback = function() {
        if (this.feedbackInput) {
            if (!isValidString(this.feedbackInput, 'name')) {
                addAlert('feedback name is not valid!!!');
                this.feedbackInput = '';
                this.feedbackBlur = true;
            } else {
                var this_obj = this;
                var index = arrayObjectIndexOf(this.feedback.list, this.feedbackInput, 'tag');
                if (index === -1) {
                    this.feedback.list.splice(0, 0, {tag: this.feedbackInput, select: true});
                    var Info = $resource('/api/getRelativeTag', {}, {
                        'relativeTag': { method:'PUT' }
                    });
                    Info.relativeTag({tags: [this.feedbackInput]}, function (result) {
                        if (result.loginOK) {
                            $window.location.href = $location.path();
                        } else {
                            for (var i in result.relative) {
                                index = arrayObjectIndexOf(this_obj.feedback.list, result.relative[i], 'tag');
                                if (index === -1) {
                                    this_obj.feedback.list.push({tag: result.relative[i], select: false});
                                }
                            }
                            this_obj.feedbackInput = '';
                            this_obj.feedbackBlur = true;
                        }
                    }, function(errorResult) {
                        if (errorResult.status === 400) {
                            addAlert(errorResult.data);
                        } else if (errorResult.status === 403) {
                            addAlert('unknown API!!!');
                        } else if (errorResult.status === 401) {
                            $window.location.href = $location.path();
                        }
                        this_obj.feedbackInput = '';
                        this_obj.feedbackBlur = true;
                    });
                } else {
                    this.feedback.list[index].select = true;
                    this.feedbackInput = '';
                    this.feedbackBlur = true;
                }
            }
        }
        return false;
    }
    $scope.delayFeedback = function() {
        if (this.feedback.queue.length > 0) {
            var response = this.feedback.queue.splice(0, 1);
            showFeedback(response[0]);
        } else {
            this.feedback.run = false;
            getFeedbacks(0);
        }
    }
    $scope.sendFeedback = function() {
        this.feedbackDisabled = true;
        var this_obj = this;
        var sendList = [];
        for (var i in this.feedback.list) {
            if (isValidString(this.feedback.list[i].tag, 'name')) {
                sendList.push(this.feedback.list[i]);
            }
        }
        if (isValidString(this.feedback.name, 'name')) {
            var Info = $resource('/api/sendTag/' + this.feedback.uid, {}, {
                'sendTag': { method:'PUT' }
            });
            Info.sendTag({tags: sendList, name: this.feedback.name}, function (result) {
                if (result.loginOK) {
                    $window.location.href = $location.path();
                } else {
                    this_obj.feedback.history = result.history;
                    if (this_obj.feedback.queue.length > 0) {
                        var response = this_obj.feedback.queue.splice(0, 1);
                        showFeedback(response[0]);
                    } else {
                        this_obj.feedback.run = false;
                        getFeedbacks(0);
                    }
                }
            }, function(errorResult) {
                if (errorResult.status === 400) {
                    addAlert(errorResult.data);
                } else if (errorResult.status === 403) {
                    addAlert('unknown API!!!');
                } else if (errorResult.status === 401) {
                    $window.location.href = $location.path();
                }
            });
        } else {
            addAlert('feed back name is not valid!!!');
        }
        return false;
    }

    showFeedback = function (response) {
        $scope.feedback.name = response.name;
        $scope.feedback.uid = response.id;
        $scope.feedback.list = [];
        for (var i in response.select) {
            $scope.feedback.list.push({tag: response.select[i], select: true});
        }
        for (var i in response.option) {
            $scope.feedback.list.push({tag: response.option[i], select: false});
        }
        $scope.feedback.other = response.other;
        var index = 0, searchTag='';
        var historyRelative = [];
        for (var i in $scope.feedback.history) {
            searchTag = $scope.feedback.history[i].tag;
            index = arrayObjectIndexOf($scope.feedback.list, searchTag, "tag");
            if (index === -1) {
                $scope.feedback.history[i].history = true;
                if ($scope.feedback.history[i].select) {
                    $scope.feedback.list.splice(0, 0, $scope.feedback.history[i]);
                    historyRelative.push($scope.feedback.history[i].tag);
                }
            } else {
                if ($scope.feedback.list[index].select !== $scope.feedback.history[i].select) {
                    $scope.feedback.list[index].history = true;
                    $scope.feedback.list[index].select = $scope.feedback.history[i].select;
                }
            }
        }
        clearTimeout($scope.feedback.relative);
        $scope.feedback.relative = setTimeout(function() {
            if (historyRelative.length > 0) {
                var Info = $resource('/api/getRelativeTag', {}, {
                    'relativeTag': { method:'PUT' }
                });
                Info.relativeTag({tags: historyRelative}, function (result) {
                    if (result.loginOK) {
                        $window.location.href = $location.path();
                    } else {
                        for (var i in result.relative) {
                            if (arrayObjectIndexOf($scope.feedback.list, result.relative[i], 'tag') === -1) {
                                $scope.feedback.list.push({tag: result.relative[i], select: false});
                            }
                        }
                    }
                }, function(errorResult) {
                    if (errorResult.status === 400) {
                        addAlert(errorResult.data);
                    } else if (errorResult.status === 403) {
                        addAlert('unknown API!!!');
                    } else if (errorResult.status === 401) {
                        $window.location.href = $location.path();
                    }
                });
            }
        }, 1000);
        $scope.feedbackDisabled = false;
    };

    function indexInit() {
        var Info = $resource('/api/getUser', {}, {
            'getUser': { method:'GET' }
        });
        Info.getUser({}, function (result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                getParentlist();
                for (var i in result.nav) {
                    $scope.navList.push(result.nav[i]);
                }
                $scope.isLogin = true;
                $scope.id = result.id;
                $scope.main_url = result.main_url;
                document.domain = document.domain;
                $scope.level = result.level;
                getFeedbacks(1);
                if (window.MozWebSocket) {
                    window.WebSocket = window.MozWebSocket;
                }
                var ws = new WebSocket(result.ws_url);
                ws.onopen = function(){
                    console.log(result.ws_url + ": Socket has been opened!");
                    //var obj = {type:'test', data: '12345'};
                    //ws.send(JSON.stringify(obj));
                };

                ws.onmessage = function(message) {
                    var wsmsg = JSON.parse(message.data);
                    if ($scope.level >= wsmsg.level) {
                        switch (wsmsg.type) {
                            case 'file':
                                $scope.$broadcast('file', JSON.stringify(wsmsg.data));
                                break;
                            case 'stock':
                                $scope.$broadcast('stock', JSON.stringify(wsmsg.data));
                                break;
                            case 'password':
                                $scope.$broadcast('password', JSON.stringify(wsmsg.data));
                                break;
                            case $scope.id:
                                var msg = JSON.stringify(wsmsg.data);
                                addAlert(msg);
                                break;
                            default:
                                console.log(wsmsg);
                        }
                    }
                };
                $scope.testLogin();
            }
        }, function(errorResult) {
            if (errorResult.status === 400) {
                //addAlert(errorResult.data);
            } else if (errorResult.status === 403) {
                addAlert('unknown API!!!');
            }
        });
    }

    $scope.urlUpload = function() {
        var url = this.inputUrl;
        var this_obj = this;
        this.inputUrl = '';
        if (isValidString(url, 'url')) {
            var uploadurl = this.main_url + '/api/upload/url';
            if (this.adultonly) {
                uploadurl = this.main_url + '/api/upload/url/1';
            }
            var api = $resource(uploadurl, {}, {
                'uploadUrl': { method:'POST', withCredentials: true }
            });
            api.uploadUrl({url: url}, function (result) {
                this_obj.inputUrl = '';
                if (result.loginOK) {
                    $window.location.href = $location.path();
                } else {
                    if (this_obj.feedback.run) {
                        if (this_obj.feedback.uid === result.id) {
                            showFeedback(result);
                        } else {
                            if (arrayObjectIndexOf(this_obj.feedback.queue, result.id, 'id') === -1) {
                                this_obj.feedback.queue.push(result);
                            } else {
                                this_obj.feedback.queue.splice(index, 1, result);
                            }
                        }
                    } else {
                        this_obj.feedback.run = true;
                        showFeedback(result);
                    }
                }
            }, function(errorResult) {
                if (errorResult.status === 400) {
                    addAlert(errorResult.data);
                } else if (errorResult.status === 403) {
                    addAlert('unknown API!!!');
                } else if (errorResult.status === 401) {
                    $window.location.href = $location.path();
                }
            });
        } else {
            addAlert("invalid url!!!");
        }
    }

    $scope.download2local = function(music, playlist, url) {
        if (!url) {
            if (playlist) {
                url =  'https://www.youtube.com/watch?list=' + this.toolList.item.id;
            } else {
                url =  'https://www.youtube.com/watch?v=' + this.toolList.item.id;
            }
        } else if (playlist) {
            url = url.replace(/&v=([^&]+)/, '');
        }
        if (music) {
            url = url + ':music';
        }
        var this_obj = this;
        this.inputUrl = '';
        if (isValidString(url, 'url')) {
            var uploadurl = this.main_url + '/api/upload/url';
            if (this.adultonly) {
                uploadurl = this.main_url + '/api/upload/url/1';
            }
            var api = $resource(uploadurl, {}, {
                'uploadUrl': { method:'POST', withCredentials: true }
            });
            api.uploadUrl({url: url}, function (result) {
                this_obj.inputUrl = '';
                if (result.loginOK) {
                    $window.location.href = $location.path();
                } else {
                    if (this_obj.feedback.run) {
                        if (this_obj.feedback.uid === result.id) {
                            showFeedback(result);
                        } else {
                            if (arrayObjectIndexOf(this_obj.feedback.queue, result.id, 'id') === -1) {
                                this_obj.feedback.queue.push(result);
                            } else {
                                this_obj.feedback.queue.splice(index, 1, result);
                            }
                        }
                    } else {
                        this_obj.feedback.run = true;
                        showFeedback(result);
                    }
                }
            }, function(errorResult) {
                if (errorResult.status === 400) {
                    addAlert(errorResult.data);
                } else if (errorResult.status === 403) {
                    addAlert('unknown API!!!');
                } else if (errorResult.status === 401) {
                    $window.location.href = $location.path();
                }
            });
        } else {
            addAlert("invalid url!!!");
        }
    }

    $scope.urlSave = function() {
        var url = this.inputUrl;
        this.inputUrl = '';
        var this_obj = this;
        if (isValidString(url, 'url') && !this.disableUrlSave) {
            this.disableUrlSave = true;
            var addurl = this.main_url + '/api/addurl';
            if (this.adultonly) {
                addurl = this.main_url + '/api/addurl/1';
            }
            var api = $resource(addurl, {}, {
                'addurl': { method:'POST', withCredentials: true }
            });
            api.addurl({url: url}, function (result) {
                this_obj.disableUrlSave = false;
                if (result.loginOK) {
                    $window.location.href = $location.path();
                } else {
                    if (this_obj.feedback.run) {
                        if (this_obj.feedback.uid === result.id) {
                            showFeedback(result);
                        } else {
                            if (arrayObjectIndexOf(this_obj.feedback.queue, result.id, 'id') === -1) {
                                this_obj.feedback.queue.push(result);
                            } else {
                                this_obj.feedback.queue.splice(index, 1, result);
                            }
                        }
                    } else {
                        this_obj.feedback.run = true;
                        showFeedback(result);
                    }
                }
            }, function(errorResult) {
                this_obj.disableUrlSave = false;
                if (errorResult.status === 400) {
                    addAlert(errorResult.data);
                } else if (errorResult.status === 403) {
                    addAlert('unknown API!!!');
                } else if (errorResult.status === 401) {
                    $window.location.href = $location.path();
                }
            });
        } else {
            addAlert("invalid url!!!");
        }
    }

    function getFeedbacks(init) {
        init = typeof init !== 'undefined' ? init : 0;
        var Info = $resource($scope.main_url + '/api/feedback', {}, {
            'getFeedback': { method:'GET', withCredentials: true }
        });
        Info.getFeedback({}, function (result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                $scope.feedback.queue = $scope.feedback.queue.concat(result.feedbacks);
                if ($scope.feedback.queue.length > 0 && !$scope.feedback.run) {
                    $scope.feedback.run = true;
                    var response = $scope.feedback.queue.splice(0, 1);
                    showFeedback(response[0]);
                }
            }
        }, function(errorResult) {
            if (errorResult.status === 400) {
                //addAlert(errorResult.data);
            } else if (errorResult.status === 403) {
                addAlert('unknown API!!!');
            } else if (errorResult.status === 401 && !init) {
                $window.location.href = $location.path();
            }
        });
    }

    $scope.mediaRecord = function(type, record, end) {
        var id = this[type].id;
        var time = 0;
        var append = '';
        var index = -1;
        if (id) {
            if (type === 'video') {
                if (this[type].src) {
                    if (!end) {
                        time = parseInt(video.currentTime);
                    }
                } else {
                    if (!end) {
                        if (yplayer) {
                            time = parseInt(yplayer.getCurrentTime());
                            index = yplayer.getPlaylistIndex();
                            if (index !== -1) {
                                time = time + '&' + index;
                            }
                        }
                    }
                    append = '/youtube';
                }
            } else if (type === 'music') {
                return false;
                //music不記錄
                //if (!end) {
                //    time = parseInt(music.currentTime);
                //}
            } else if (this[type].iframeOffset) {
                if (record !== 1) {
                    time = record;
                }
            } else {
                return;
            }
            var mediaApi = $resource('/api/media/record/' + id + '/' + time + append, {}, {
                'record': { method:'GET' }
            });
            mediaApi.record({}, function (result) {
                if (result.loginOK) {
                    $window.location.href = $location.path();
                }
            }, function(errorResult) {
                if (errorResult.status === 400) {
                    addAlert(errorResult.data);
                } else if (errorResult.status === 403) {
                    addAlert('unknown API!!!');
                } else if (errorResult.status === 401) {
                    $window.location.href = $location.path();
                }
            });
        }
    }

    $scope.testLogin = function() {
        var testApi = $resource(this.main_url + '/api/testLogin', {}, {
            'testLogin': { method:'GET', withCredentials: true }
        });
        var this_obj = this;
        testApi.testLogin({}, function (result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            }
        }, function(errorResult) {
            if (errorResult.status === 400) {
                addAlert(errorResult.data);
            } else if (errorResult.status === 403) {
                addAlert('unknown API!!!');
            } else if (errorResult.status === 401) {
                //$window.location.href = $location.path();
                this_obj.doLogout();
            }
        });
    }

    $scope.presentMove = function(number) {
        if (number === 0) {
            if (this.present.showId >= 1 && this.present.showId <= this.present.maxId) {
                this.present.presentId = this.present.showId;
            } else {
                this.present.showId = this.present.presentId;
                return false;
            }
        } else {
            var newIndex = +this.present.presentId + number;
            if (newIndex >= 1 && newIndex <= this.present.maxId) {
                this.present.presentId = newIndex;
                this.present.showId = this.present.presentId;
            } else {
                this.present.showId = this.present.presentId;
                return false;
            }
        }
        this.present.src = this.main_url + '/preview/' + this.present.list[this.present.index + this.present.back].id + '/' + this.present.presentId;
    }

    $scope.docMove = function(number) {
        if (number === 0) {
            if (this.doc.showId >= 1 && this.doc.showId <= this.doc.maxId) {
                this.doc.presentId = this.doc.showId;
            } else {
                this.doc.showId = this.doc.presentId;
                return false;
            }
        } else {
            var newIndex = +this.doc.presentId + number;
            if (newIndex >= 1 && newIndex <= this.doc.maxId) {
                this.doc.presentId = newIndex;
                this.doc.showId = this.doc.presentId;
            } else {
                this.doc.showId = this.doc.presentId;
                return false;
            }
        }
        if (this.doc.iframeOffset) {
            this.doc.win.scrollTo(0, this.doc.iframeOffset[this.doc.presentId-1]);
        } else {
            this.doc.src = this.main_url + '/preview/' + this.doc.list[this.doc.index + this.doc.back].id + '/' + this.doc.presentId;
        }
    }

    $scope.imgMove = function(number) {
        if (number === 0) {
            if (this.image.showId >= 1 && this.image.showId <= this.image.maxId) {
                this.image.presentId = this.image.showId;
            } else {
                this.image.showId = this.image.presentId;
                return false;
            }
        } else {
            var newIndex = +this.image.presentId + number;
            if (newIndex >= 1 && newIndex <= this.image.maxId) {
                this.image.presentId = newIndex;
                this.image.showId = this.image.presentId;
            } else {
                this.image.showId = this.image.presentId;
                return false;
            }
        }
        this.image.src = this.main_url + '/image/' + this.image.list[this.image.index + this.image.back].id + '/' + this.image.presentId;
    }

    $scope.nextImage = function() {
        if (this.image.presentId === this.image.maxId) {
            this.mediaMove(1, 'image');
        } else {
            this.imgMove(1);
        }
    }

    $scope.prevImage = function() {
        if (this.image.presentId === 1) {
            this.mediaMove(-1, 'image');
        } else {
            this.imgMove(-1);
        }
    }

    $scope.mediaMove = function(number, type, ended) {
        var preType = '', status = 0, isLoad = false, docRecord = 0;
        switch (type) {
            case 'image':
                preType = 'image';
                status = 2;
                this.image.showId = this.image.presentId = 1;
                break;
            case 'video':
                preType = 'video';
                status = 3;
                if (document.webkitFullScreen) {
                    document.webkitFullScreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else {
                    video.webkitExitFullScreen();
                }
                break;
            case 'music':
                preType = 'video';
                status = 4;
                break;
            case 'doc':
                preType = 'preview';
                status = 5;
                docRecord = this.doc.showId;
                this.doc.showId = this.doc.presentId = 1;
                break;
            case 'present':
                preType = 'preview';
                status = 6;
                this.present.showId = this.present.presentId = 1;
                break;
            default:
                addAlert('unknown type');
                return false;
        }
        var this_obj = this;
        var end = false;
        this[type].index = +this[type].index + number;
        if (this[type].index >= this[type].front) {
            if (!this[type].end) {
                isLoad = true;
                if ($scope.mediaMoreDisabled) {
                    this[type].index = +this[type].index - number;
                    return false;
                }
                $scope.mediaMoreDisabled = true;
                var mediaApi = $resource('/api/media/more/' + status + '/' + this[type].frontPage, {}, {
                    'more': { method:'GET' }
                });
                mediaApi.more({}, function (result) {
                    if (result.loginOK) {
                        $window.location.href = $location.path();
                    } else {
                        if (result.itemList.length > 0) {
                            var length = this_obj[type].list.length;
                            if (this_obj[type].back) {
                                for (var i in result.itemList) {
                                    if (arrayObjectIndexOf(this_obj[type].list, result.itemList[i].id, 'id') === -1) {
                                        this_obj[type].list.push(result.itemList[i]);
                                    }
                                }
                            } else {
                                this_obj[type].list = this_obj[type].list.concat(result.itemList);
                            }
                            if (length === this_obj[type].list.length) {
                                //this_obj[type].index = -this_obj[type].back;
                            } else {
                                this_obj[type].front = this_obj[type].front + this_obj[type].list.length - length;
                            }
                            this_obj[type].frontPage = this_obj[type].frontPage + result.itemList.length;
                        } else {
                            end = true;
                            //this_obj[type].index = -this_obj[type].back;
                        }
                        function front(yend) {
                            if (end && yend) {
                                $scope[type].end = true;
                            } else {
                                $scope[type].end = false;
                            }
                            $scope.mediaMoreDisabled = false;
                            if (this_obj[type].index >= this_obj[type].front) {
                                this_obj[type].index = this_obj[type].index - this_obj[type].front - this_obj[type].back;
                            }
                            $scope.mediaMoreDisabled = false;
                            if (this_obj[type].id) {
                               this_obj.mediaRecord(type, docRecord, ended);
                            }
                            var append = '';
                            if (this_obj[type].list[this_obj[type].index + this_obj[type].back].thumb) {
                                append = '/youtube';
                            }
                            var mediaApi = $resource('/api/media/setTime/' + this_obj[type].list[this_obj[type].index + this_obj[type].back].id + '/' + type + append, {}, {
                                'setTime': { method:'GET' }
                            });
                            mediaApi.setTime({}, function (result) {
                                if (result.loginOK) {
                                    $window.location.href = $location.path();
                                } else {
                                    if (result.time) {
                                        var setTime = result.time.toString().match(/^(\d+)(&(\d+))?$/);
                                        if (setTime) {
                                            if (type === 'video') {
                                                videoStart = setTime[1];
                                                if (setTime[3]) {
                                                    videoIndex = setTime[3];
                                                }
                                            } else if (type === 'music'){
                                                musicStart = setTime[1];
                                            } else {
                                                this_obj[type].presentId = this_obj[type].showId = setTime[1];
                                            }
                                        }
                                    }
                                    if (type === 'video') {
                                        if (yplayer) {
                                            yplayer.destroy();
                                            yplayer = null;
                                        }
                                    }
                                    if (this_obj[type].list.length === 1 && type === 'video') {
                                        if (video) {
                                            video.currentTime = 0;
                                            video.pause();
                                        }
                                        if (yplayer) {
                                            yplayer.seekTo(0, true);
                                            yplayer.pauseVideo();
                                        }
                                        //video.play();
                                    } else if (this_obj[type].list.length === 1 && type === 'music') {
                                        music.currentTime = 0;
                                        music.play();
                                    } else {
                                        this_obj[type].maxId = this_obj[type].list[this_obj[type].index + this_obj[type].back].present;
                                        if (type === 'doc') {
                                            this_obj[type].iframeOffset = null;
                                            this_obj[type].src = $scope.main_url + '/' + preType + '/' + this_obj[type].list[this_obj[type].index + this_obj[type].back].id + '/doc';
                                        } else if (type === 'video' && this_obj[type].list[this_obj[type].index + this_obj[type].back].thumb) {
                                            this_obj[type].src = null;
                                            onYouTubeIframeAPIReady(this_obj[type].list[this_obj[type].index + this_obj[type].back].id, this_obj[type].list[this_obj[type].index + this_obj[type].back].playlist);
                                            this_obj[type].playlist = this_obj[type].list[this_obj[type].index + this_obj[type].back].playlist;
                                        } else {
                                            this_obj[type].src = $scope.main_url + '/' + preType + '/' + this_obj[type].list[this_obj[type].index + this_obj[type].back].id;
                                        }
                                        if (type === 'video' && !this_obj[type].list[this_obj[type].index + this_obj[type].back].thumb) {
                                            removeCue();
                                            this_obj[type].sub = $scope.main_url + '/subtitle/' + this_obj[type].list[this_obj[type].index + this_obj[type].back].id;
                                        }
                                    }
                                    this_obj[type].id = this_obj[type].list[this_obj[type].index + this_obj[type].back].id;
                                    this_obj.$broadcast('latest', JSON.stringify({id: this_obj[type].bookmarkID, latest: this_obj[type].id}));
                                    this_obj[type].name = this_obj[type].list[this_obj[type].index + this_obj[type].back].name;
                                }
                            }, function(errorResult) {
                                if (errorResult.status === 400) {
                                    addAlert(errorResult.data);
                                } else if (errorResult.status === 403) {
                                    addAlert('unknown API!!!');
                                } else if (errorResult.status === 401) {
                                    $window.location.href = $location.path();
                                }
                            });
                        }
                        if (type === 'video') {
                            var Info = null;
                            if (this_obj[type].pageToken) {
                                Info = $resource('/api/youtube/get/' + this_obj[type].pageToken, {}, {
                                    'youtube': { method:'GET' }
                                });
                            } else {
                                Info = $resource('/api/youtube/get', {}, {
                                    'youtube': { method:'GET' }
                                });
                            }
                            Info.youtube({}, function(result) {
                                if (result.pageToken) {
                                    this_obj[type].pageToken = result.pageToken;
                                }
                                if (result.itemList.length > 0) {
                                    var length = this_obj[type].list.length;
                                    if (this_obj[type].back) {
                                        for (var i in result.itemList) {
                                            if (arrayObjectIndexOf(this_obj[type].list, result.itemList[i].id, 'id') === -1) {
                                                this_obj[type].list.push(result.itemList[i]);
                                            }
                                        }
                                    } else {
                                        this_obj[type].list = this_obj[type].list.concat(result.itemList);
                                    }
                                    if (length === this_obj[type].list.length) {
                                        //this_obj[type].index = -this_obj[type].back;
                                    } else {
                                        this_obj[type].front = this_obj[type].front + this_obj[type].list.length - length;
                                    }
                                    this_obj[type].frontPage = this_obj[type].frontPage + result.itemList.length;
                                    front(false);
                                } else {
                                    front(true);
                                }
                            }, function(errorResult) {
                                this_obj.mediaMoreDisabled = false;
                                if (errorResult.status === 400) {
                                    addAlert(errorResult.data);
                                } else if (errorResult.status === 403) {
                                    addAlert('unknown API!!!');
                                } else if (errorResult.status === 401) {
                                    $window.location.href = $location.path();
                                }
                            });
                        } else {
                            front(true);
                        }
                    }
                }, function(errorResult) {
                    $scope.mediaMoreDisabled = false;
                    if (errorResult.status === 400) {
                        addAlert(errorResult.data);
                    } else if (errorResult.status === 403) {
                        addAlert('unknown API!!!');
                    } else if (errorResult.status === 401) {
                        $window.location.href = $location.path();
                    }
                });
            } else {
                this[type].index = -this[type].back;
            }
        } else if (this[type].index < -this[type].back) {
            if (!this[type].end) {
                isLoad = true;
                var mediaApi = $resource('/api/media/more/' + status + '/' + this[type].backPage + '/back', {}, {
                    'more': { method:'GET' }
                });
                var this_obj = this;
                if ($scope.mediaMoreDisabled) {
                    this[type].index = +this[type].index - number;
                    return false;
                }
                $scope.mediaMoreDisabled = true;
                mediaApi.more({}, function (result) {
                    if (result.loginOK) {
                        $window.location.href = $location.path();
                    } else {
                        if (result.itemList.length > 0) {
                            var length = this_obj[type].list.length;
                            if (this_obj[type].front) {
                                for (var i in result.itemList) {
                                    if (arrayObjectIndexOf(this_obj[type].list, result.itemList[i].id, 'id') === -1) {
                                        this_obj[type].list.splice(0, 0, result.itemList[i]);
                                    }
                                }
                            } else {
                                this_obj[type].list = result.itemList.reverse().concat(this_obj[type].list);
                            }
                            if (length === this_obj[type].list.length) {
                                //this_obj[type].index = this_obj[type].front - 1;
                            } else {
                                this_obj[type].back = this_obj[type].back + this_obj[type].list.length - length;
                            }
                            this_obj[type].backPage = this_obj[type].backPage + result.itemList.length;
                        } else {
                            //this_obj[type].index = this_obj[type].front - 1;
                            end = true;
                        }
                        function backend(yend) {
                            if (end && yend) {
                                $scope[type].end = true;
                            } else {
                                $scope[type].end = false;
                            }
                            if (this_obj[type].index < -this_obj[type].back) {
                                this_obj[type].index = this_obj[type].index - this_obj[type].back - this_obj[type].front - 1;
                            }
                            $scope.mediaMoreDisabled = false;
                            if (this_obj[type].id) {
                               this_obj.mediaRecord(type, docRecord, ended);
                            }
                            var append = '';
                            if (this_obj[type].list[this_obj[type].index + this_obj[type].back].thumb) {
                                append = '/youtube';
                            }
                            var mediaApi = $resource('/api/media/setTime/' + this_obj[type].list[this_obj[type].index + this_obj[type].back].id + '/' + type + append, {}, {
                                'setTime': { method:'GET' }
                            });
                            mediaApi.setTime({}, function (result) {
                                if (result.loginOK) {
                                    $window.location.href = $location.path();
                                } else {
                                    if (result.time) {
                                        var setTime = result.time.toString().match(/^(\d+)(&(\d+))?$/);
                                        if (setTime) {
                                            if (type === 'video') {
                                                videoStart = setTime[1];
                                                if (setTime[3]) {
                                                    videoIndex = setTime[3];
                                                }
                                            } else if (type === 'music'){
                                                musicStart = setTime[1];
                                            } else {
                                                this_obj[type].presentId = this_obj[type].showId = setTime[1];
                                            }
                                        }
                                    }
                                    if (type === 'video') {
                                        if (yplayer) {
                                            yplayer.destroy();
                                            yplayer = null;
                                        }
                                    }
                                    if (this_obj[type].list.length === 1 && type === 'video') {
                                        if (video) {
                                            video.currentTime = 0;
                                            video.pause();
                                        }
                                        if (yplayer) {
                                            yplayer.seekTo(0, true);
                                            yplayer.pauseVideo();
                                        }
                                        //video.play();
                                    } else if (this_obj[type].list.length === 1 && type === 'music') {
                                        music.currentTime = 0;
                                        music.play();
                                    } else {
                                        this_obj[type].maxId = this_obj[type].list[this_obj[type].index + this_obj[type].back].present;
                                        if (type === 'doc') {
                                            this_obj[type].iframeOffset = null;
                                            this_obj[type].src = $scope.main_url + '/' + preType + '/' + this_obj[type].list[this_obj[type].index + this_obj[type].back].id + '/doc';
                                        } else if (type === 'video' && this_obj[type].list[this_obj[type].index + this_obj[type].back].thumb) {
                                            this_obj[type].src = null;
                                            onYouTubeIframeAPIReady(this_obj[type].list[this_obj[type].index + this_obj[type].back].id, this_obj[type].list[this_obj[type].index + this_obj[type].back].playlist);
                                            this_obj[type].playlist = this_obj[type].list[this_obj[type].index + this_obj[type].back].playlist;
                                        } else {
                                            this_obj[type].src = $scope.main_url + '/' + preType + '/' + this_obj[type].list[this_obj[type].index + this_obj[type].back].id;
                                        }
                                        if (type === 'video' && !this_obj[type].list[this_obj[type].index + this_obj[type].back].thumb) {
                                            removeCue();
                                            this_obj[type].sub = $scope.main_url + '/subtitle/' + this_obj[type].list[this_obj[type].index + this_obj[type].back].id;
                                        }
                                    }
                                    this_obj[type].id = this_obj[type].list[this_obj[type].index + this_obj[type].back].id;
                                    this_obj.$broadcast('latest', JSON.stringify({id: this_obj[type].bookmarkID, latest: this_obj[type].id}));
                                    this_obj[type].name = this_obj[type].list[this_obj[type].index + this_obj[type].back].name;
                                }
                            }, function(errorResult) {
                                if (errorResult.status === 400) {
                                    addAlert(errorResult.data);
                                } else if (errorResult.status === 403) {
                                    addAlert('unknown API!!!');
                                } else if (errorResult.status === 401) {
                                    $window.location.href = $location.path();
                                }
                            });
                        }
                        var Info = null;
                        if (this_obj[type].pageToken) {
                            Info = $resource('/api/youtube/get/' + this_obj[type].pageToken, {}, {
                                'youtube': { method:'GET' }
                            });
                        } else {
                            Info = $resource('/api/youtube/get', {}, {
                                'youtube': { method:'GET' }
                            });
                        }
                        if (type === 'video') {
                            Info.youtube({}, function(result) {
                                if (result.pageToken) {
                                    this_obj[type].pageToken = result.pageToken;
                                }
                                if (result.itemList.length > 0) {
                                    var length = this_obj[type].list.length;
                                    if (this_obj[type].front) {
                                        for (var i in result.itemList) {
                                            if (arrayObjectIndexOf(this_obj[type].list, result.itemList[i].id, 'id') === -1) {
                                                this_obj[type].list.splice(0, 0, result.itemList[i]);
                                            }
                                        }
                                    } else {
                                        this_obj[type].list = result.itemList.reverse().concat(this_obj[type].list);
                                    }
                                    if (length === this_obj[type].list.length) {
                                        //this_obj[type].index = this_obj[type].front - 1;
                                    } else {
                                        this_obj[type].back = this_obj[type].back + this_obj[type].list.length - length;
                                    }
                                    this_obj[type].backPage = this_obj[type].backPage + result.itemList.length;
                                    backend(false);
                                } else {
                                    backend(true);
                                }
                            }, function(errorResult) {
                                if (errorResult.status === 400) {
                                    addAlert(errorResult.data);
                                } else if (errorResult.status === 403) {
                                    addAlert('unknown API!!!');
                                } else if (errorResult.status === 401) {
                                    $window.location.href = $location.path();
                                }
                            });
                        } else {
                            backend(true);
                        }
                    }
                }, function(errorResult) {
                    $scope.mediaMoreDisabled = false;
                    if (errorResult.status === 400) {
                        addAlert(errorResult.data);
                    } else if (errorResult.status === 403) {
                        addAlert('unknown API!!!');
                    } else if (errorResult.status === 401) {
                        $window.location.href = $location.path();
                    }
                });
            } else {
                this[type].index = this[type].front - 1;
            }
        }
        if (!isLoad) {
            if (this[type].id) {
                this.mediaRecord(type, docRecord, ended);
            }
            var append = '';
            if (this[type].list[this[type].index + this[type].back].thumb) {
                append = '/youtube';
            }
            var mediaApi = $resource('/api/media/setTime/' + this[type].list[this[type].index + this[type].back].id + '/' + type + append, {}, {
                'setTime': { method:'GET' }
            });
            mediaApi.setTime({}, function (result) {
                if (result.loginOK) {
                    $window.location.href = $location.path();
                } else {
                    if (result.time) {
                        var setTime = result.time.toString().match(/^(\d+)(&(\d+))?$/);
                        if (setTime) {
                            if (type === 'video') {
                                videoStart = setTime[1];
                                if (setTime[3]) {
                                    videoIndex = setTime[3];
                                }
                            } else if (type === 'music'){
                                musicStart = setTime[1];
                            } else {
                                this_obj[type].presentId = this_obj[type].showId = setTime[1];
                            }
                        }
                    }
                    if (type === 'video') {
                        if (yplayer) {
                            yplayer.destroy();
                            yplayer = null;
                        }
                    }
                    if (this_obj[type].list.length === 1 && type === 'video') {
                        if (video) {
                            video.currentTime = 0;
                            video.pause();
                        }
                        if (yplayer) {
                            yplayer.seekTo(0, true);
                            yplayer.pauseVideo();
                        }
                        //video.play();
                    } else if (this_obj[type].list.length === 1 && type === 'music') {
                        music.currentTime = 0;
                        music.play();
                    } else {
                        this_obj[type].maxId = this_obj[type].list[this_obj[type].index + this_obj[type].back].present;
                        if (type === 'doc') {
                            this_obj[type].iframeOffset = null;
                            this_obj[type].src = $scope.main_url + '/' + preType + '/' + this_obj[type].list[this_obj[type].index + this_obj[type].back].id + '/doc';
                        } else if (type === 'video' && this_obj[type].list[this_obj[type].index + this_obj[type].back].thumb) {
                            this_obj[type].src = null;
                            onYouTubeIframeAPIReady(this_obj[type].list[this_obj[type].index + this_obj[type].back].id, this_obj[type].list[this_obj[type].index + this_obj[type].back].playlist);
                            this_obj[type].playlist = this_obj[type].list[this_obj[type].index + this_obj[type].back].playlist;
                        } else {
                            this_obj[type].src = $scope.main_url + '/' + preType + '/' + this_obj[type].list[this_obj[type].index + this_obj[type].back].id;
                        }
                        if (type === 'video' && !this_obj[type].list[this_obj[type].index + this_obj[type].back].thumb) {
                            removeCue();
                            this_obj[type].sub = $scope.main_url + '/subtitle/' + this_obj[type].list[this_obj[type].index + this_obj[type].back].id;
                        }
                    }
                    this_obj[type].id = this_obj[type].list[this_obj[type].index + this_obj[type].back].id;
                    this_obj.$broadcast('latest', JSON.stringify({id: this_obj[type].bookmarkID, latest: this_obj[type].id}));
                    this_obj[type].name = this_obj[type].list[this_obj[type].index + this_obj[type].back].name;
                }
            }, function(errorResult) {
                if (errorResult.status === 400) {
                    addAlert(errorResult.data);
                } else if (errorResult.status === 403) {
                    addAlert('unknown API!!!');
                } else if (errorResult.status === 401) {
                    $window.location.href = $location.path();
                }
            });
        }
    }
    $scope.musicShuffle = function() {
        var index = 0, isLoad = false;
        var this_obj = this;
        if (this.music.shuffle) {
            if (this.music.end) {
                do {
                    index = randomFloor(-this.music.back, +this.music.front);
                } while(index === +this.music.index);
            } else {
                do {
                    index = randomFloor(-this.music.back - 20, +this.music.front + 20);
                } while(index === +this.music.index);
            }
            this.mediaMove(index - this.music.index, 'music', true);
        } else {
            this.mediaMove(1, 'music', true);
        }
    }
    $scope.$watch("this.doc.mode", function(newVal, oldVal) {
        $scope.setDoc();
    }, true);
    $scope.$watch("this.video.download", function(newVal, oldVal) {
        newVal = parseInt(newVal);
        if (newVal) {
            if (newVal === 1) {
                openModal("確定要下載影片到網站上?").then(function () {
                    $scope.download2local(false, false, yplayer.getVideoUrl());
                }, function () {
                });
            } else if (newVal === 2) {
                openModal("確定要把影片轉檔成音樂並下載到網站上?").then(function () {
                    $scope.download2local(true, false, yplayer.getVideoUrl());
                }, function () {
                });
            }
            $scope.video.download = 0;
        }
    }, true);
    $scope.numberDoc = function() {
        if (this.doc.iframeOffset) {
            for (var i in this.doc.iframeOffset) {
                if (this.doc.win.pageYOffset < this.doc.iframeOffset[i]) {
                    this.doc.showId = this.doc.presentId = i;
                    break;
                }
            }
        }
    }
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    onYouTubeIframeAPIReady = function (id, isPlaylist) {
        if (isPlaylist) {
            yplayer = new YT.Player('youtube-player', {
                height: '100%',
                width: '100%',
                videoId: 'videoseries',
                events: {
                    'onReady': loadPlaylist,
                    'onStateChange': onPlayerStateChange
                }
            });
            function loadPlaylist() {
                if (videoStart || videoIndex) {
                    yplayer.loadPlaylist({
                        list: id,
                        listType: "playlist",
                        index: videoIndex,
                        startSeconds: parseInt(videoStart)
                    });
                    videoStart = 0;
                    videoIndex = 0;
                } else {
                    yplayer.loadPlaylist({
                        list: id,
                        listType: "playlist"
                    });
                }
            }
        } else {
            yplayer = new YT.Player('youtube-player', {
                height: '100%',
                width: '100%',
                videoId: id,
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                }
            });
        }
    }

    // 4. The API will call this function when the video player is ready.
    function onPlayerReady(event) {
        if (videoStart) {
            event.target.seekTo(parseInt(videoStart), true);
            videoStart = 0;
        }
        event.target.playVideo();
    }
    function onPlayerStateChange(event) {
        if (event.data === YT.PlayerState.PLAYING) {
            $scope.testLogin();
        } else if (event.data === YT.PlayerState.PAUSED) {
            $scope.mediaRecord("video");
        } else if (event.data === YT.PlayerState.ENDED) {
            $scope.mediaMove(1, 'video', true);
        }
    }
    /*function stopVideo() {
        yplayer.stopVideo();
    }*/
    $scope.setDoc = function(iframeWindow, iframeOffset, textNode) {
        this.doc.win = typeof iframeWindow !== 'undefined' ? iframeWindow : this.doc.win;
        if (this.isPdf) {
            this.doc.imgNode = typeof iframeOffset !== 'undefined' ? iframeOffset : this.doc.imgNode;
            this.doc.textNode = typeof textNode !== 'undefined' ? textNode : this.doc.textNode;
            if (!this.doc.mode) {
                for (var i in this.doc.imgNode.node) {
                    this.doc.imgNode.node[i].style.display = 'block';
                }
                for (var i in this.doc.textNode.node) {
                    this.doc.textNode.node[i].style.display = 'none';
                }
                this.doc.iframeOffset = this.doc.imgNode.offset;
            } else {
                for (var i in this.doc.imgNode.node) {
                    this.doc.imgNode.node[i].style.display = 'none';
                }
                for (var i in this.doc.textNode.node) {
                    this.doc.textNode.node[i].style.display = 'block';
                }
                this.doc.iframeOffset = this.doc.textNode.offset;
            }
            this.doc.win.scrollTo(0, this.doc.iframeOffset[this.doc.presentId-1]);
        } else {
            this.doc.iframeOffset = typeof iframeOffset !== 'undefined' ? iframeOffset : this.doc.iframeOffset;
            if (this.doc.win) {
                this.doc.win.scrollTo(0, this.doc.iframeOffset[this.doc.presentId-1]);
            }
        }
        if (this.doc.iframeOffset) {
            this.doc.maxId = this.doc.iframeOffset.length-1;
        }
    }
    $scope.mediaToggle = function(type, open) {
        switch (type) {
            case 'image':
            case 'video':
            case 'music':
            case 'doc':
            case 'present':
                break;
            default:
                addAlert('unknown type');
                return false;
        }
        if (this.mediaShow[0] === type) {
            if (!open) {
                this.mediaShow.splice(0,1);
                if (type === 'video') {
                    if (video) {
                        video.pause();
                    }
                    if (yplayer){
                        yplayer.pauseVideo();
                    }
                } else if (type === 'doc' && this.doc.iframeOffset) {
                    this.mediaRecord(type, this.doc.showId);
                }
            }
        } else {
            var index = this.mediaShow.indexOf(type);
            if (index === -1) {
                this.mediaShow.splice(0,0, type);
            } else {
                this.mediaShow.splice(index, 1);
                this.mediaShow.splice(0,0, type);
            }
        }
    }
    getParentlist = function() {
        var Info = $resource('/api/parent/list', {}, {
            'parentlist': { method:'GET' }
        });
        Info.parentlist({}, function (result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                $scope.dirEdit = result.isEdit;
                $scope.dirList = [];
                for (var i in result.parentList) {
                    $scope.dirList.push({name: result.parentList[i].name, show: result.parentList[i].show, collapse: true, edit: false, list: [], page: 0, more: true, moreDisabled: false, sortName: '', sortMtime: '', sort: 'name/asc'});
                }
            }
        }, function(errorResult) {
            if (errorResult.status === 400) {
                addAlert(errorResult.data);
            } else if (errorResult.status === 403) {
                addAlert('unknown API!!!');
            } else if (errorResult.status === 401) {
                $window.location.href = $location.path();
            }
        });
    }
    $scope.feedbackAdd2Parent = function(name) {
        if (isValidString(name, 'name') && isValidString($scope.feedbackSelectTag, 'name')) {
            var Info = $resource('/api/parent/add', {}, {
                'addDir': { method:'POST' }
            });
            var this_obj = this.$parent;
            Info.addDir({ name: name, tag: $scope.feedbackSelectTag}, function (result) {
                if (result.id) {
                    this_obj.$broadcast('dir', JSON.stringify({id: result.id, name: result.name, parent: name}));
                }
            }, function(errorResult) {
                if (errorResult.status === 400) {
                    addAlert(errorResult.data);
                } else if (errorResult.status === 403) {
                    addAlert('unknown API!!!');
                } else if (errorResult.status === 401) {
                    $window.location.href = $location.path();
                }
            });
        } else {
            addAlert('add parent is not valid!!');
        }
        return false;
    }
}]);
function addCommas(nStr) {
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}
function StockCntl($route, $routeParams, $resource, $window, $cookies, $filter, $scope, $location) {
    //left
    $scope.$parent.currentPage = 2;
    $scope.$parent.collapse.nav = true;
    //right
    $scope.$parent.isRight = true;
    $scope.bookmarkCollapse = false;
    $scope.bookmarkEdit = false;
    $scope.stockDirList = [];
    //list
    $scope.page = 0;
    $scope.more = true;
    $scope.moreDisabled = false;
    $scope.itemList = [];
    $scope.latest = '';
    $scope.bookmarkID = '';
    $scope.parentList = [];
    $scope.historyList = [];
    $scope.exactlyList = [];
    $scope.searchBlur = false;
    $scope.multiSearch = false;
    $scope.parseIndex = false;
    $scope.parseIndexFocus = false;
    $scope.toolList = {per: false, yield: false,dir: false, item: null};
    $scope.dropdown.item = false;
    $scope.tagNew = false;
    $scope.tagNewFocus = false;
    $scope.selectList = [];
    $scope.tagList = [];
    $scope.exceptList = [];
    $scope.exactlyMatch = false;
    $scope.bookmarkNew = false;
    $scope.bookmarkNewFocus = false;
    $scope.bookmarkList = [];
    $scope.bookmarkName = '';
    $scope.dirLocation = 0;
    $scope.isRelative = false;
    $scope.tCD = false;
    $scope.relativeList = [];
    //cookie initial
    $scope.fileSort = {name:'', mtime: '', count: '', sort: 'name/desc'};
    $scope.dirSort = {name:'', mtime: '', count: '', sort: 'name/asc'};
    $scope.bookmarkSort = {name:'', mtime: '', sort: 'name/asc'};

    //stock
    Chart.defaults.global.tooltipTemplate = "<%if (label){%><%=label%>: <%}%><%= addCommas(value) %>";
    Chart.defaults.global.animation = false;
    $scope.stockName = '';
    $scope.assetLabels = [];
    $scope.assetData = [];
    $scope.assetCompareLabels = [];
    $scope.assetCompareData = [];
    $scope.assetCompare = false;
    $scope.assetTotalCommas = '0';
    $scope.salesLabels = [];
    $scope.salesData = [];
    $scope.salesTotal = 0;
    $scope.salesTotalCommas = '0';
    $scope.eps = 0;
    $scope.cashSumLabels = [];
    $scope.cashSumData = [];
    $scope.cashSumSeries = [];
    $scope.cashLabels = [];
    $scope.cashData = [];
    $scope.cashSeries = [];
    $scope.cashRatioLabels = [];
    $scope.cashRatioData = [];
    $scope.cashRatioSeries = [['investPerProperty'], ['financePerLiabilities']];
    $scope.isParse = false;
    $scope.parseYear = [];
    $scope.parseQuarter = [{name: 'One', value: 1}, {name: 'Two', value: 2}, {name: 'Three', value: 3}, {name: 'Four', value: 4}];
    $scope.parseCashMode = [{name: 'R,D,O,I', value: 1}, {name: 'R+D,O,I', value: 2}, {name: 'R,D,O+I', value: 3}, {name: 'R+D,O+I', value: 4}];
    $scope.parseResult = {};
    $scope.accumulate = false;
    $scope.comprehensive = true;
    $scope.safetyLabels = [];
    $scope.safetyData = [[], [], []];
    $scope.safetySeries = ['prMinusProfit', 'prRatio', 'shortCash'];
    $scope.parseSafetyMode = [{name: 'CL&Invest', value: 1}, {name: 'Invest', value: 2}, {name: 'CL', value: 3}];
    $scope.profitLabels = [];
    $scope.profitData = [[], [], []];
    $scope.profitSeries = ['Gross', 'Operating', 'Profit'];
    $scope.profitTrioLabels = [];
    $scope.profitTrioData = [[], [], []];
    $scope.profitTrioSeries = ['debt', 'turnover', 'Profit'];
    $scope.profitROELabels = [];
    $scope.profitROEData = [[], [], []];
    $scope.profitROESeries = ['ROE', 'Asset Growth', 'Profit'];
    $scope.profitSalesLabels = [];
    $scope.profitSalesData = [[], []];
    $scope.profitSalesSeries = ['salesPerShare', 'sales'];
    $scope.parseProfitMode = [{name: 'Profit', value: 1}, {name: 'Operating', value: 2}, {name: 'O+I', value: 3}, {name: 'Real', value: 4}, {name: 'R+D', value: 5}];
    $scope.managementLabels = [];
    $scope.managementData = [];
    $scope.managementSeries = [];
    $scope.managementNumberLabels = [];
    $scope.managementNumberData = [];
    $scope.managementNumberSeries = [];
    $scope.relative = {profit: true, cash: true, inventories: true, receivable: true, payable: true};
    $scope.profitIndex = 0;
    $scope.safetyIndex = 0;
    $scope.managementIndex = 0;

    //websocket
    $scope.$on('stock', function(e, d) {
        var id = JSON.parse(d);
        var index = arrayObjectIndexOf($scope.itemList, id, 'id');
        var storageApi = $resource('/api/stock/single/' + id, {}, {
            'single': { method:'get' }
        });
        var this_obj = this;
        storageApi.single({}, function (result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                if (result.empty) {
                    if (index !== -1) {
                        $scope.itemList.splice(index, 1);
                        $scope.page--;
                    }
                } else {
                    $scope.latest = result.latest;
                    $scope.bookmarkID = result.bookmarkID;
                    if (index !== -1) {
                        result.item.select = $scope.itemList[index].select;
                        $scope.itemList.splice(index, 1, result.item);
                    } else {
                        result.item.select = false;
                        $scope.itemList.splice(0, 0, result.item);
                    }
                }
            }
        }, function(errorResult) {
            if (errorResult.status === 400) {
                addAlert(errorResult.data);
            } else if (errorResult.status === 403) {
                addAlert('unknown API!!!');
            } else if (errorResult.status === 401) {
                $window.location.href = $location.path();
            }
        });
    });

    //taglist
    $scope.init = function(){
        getStockParentlist();
        this.page = 0;
        this.more = true;
        if ($cookies.stockSortName === 'mtime') {
            this.fileSort.sort = 'mtime/';
            if ($cookies.stockSortType === 'asc') {
                this.fileSort.sort = this.fileSort.sort + 'asc';
                this.fileSort.mtime = 'asc';
            } else {
                this.fileSort.sort = this.fileSort.sort + 'desc';
                this.fileSort.mtime = 'desc';
            }
        } else if ($cookies.stockSortName === 'count') {
            this.fileSort.sort = 'count/';
            if ($cookies.stockSortType === 'asc') {
                this.fileSort.sort = this.fileSort.sort + 'asc';
                this.fileSort.count = 'asc';
            } else {
                this.fileSort.sort = this.fileSort.sort + 'desc';
                this.fileSort.count = 'desc';
            }
        } else {
            this.fileSort.sort = 'name/';
            if ($cookies.stockSortType === 'asc') {
                this.fileSort.sort = this.fileSort.sort + 'asc';
                this.fileSort.name = 'asc';
            } else {
                this.fileSort.sort = this.fileSort.sort + 'desc';
                this.fileSort.name = 'desc';
            }
        }
        if ($cookies.bookmarkStockSortName === 'mtime') {
            this.bookmarkSort.sort = 'mtime/';
            if ($cookies.bookmarkStockSortType === 'desc') {
                this.bookmarkSort.sort = this.bookmarkSort.sort + 'desc';
                this.bookmarkSort.mtime = 'desc';
            } else {
                this.bookmarkSort.sort = this.bookmarkSort.sort + 'asc';
                this.bookmarkSort.mtime = 'asc';
            }
        } else {
            this.bookmarkSort.sort = 'name/';
            if ($cookies.bookmarkStockSortType === 'desc') {
                this.bookmarkSort.sort = this.bookmarkSort.sort + 'desc';
                this.bookmarkSort.name = 'desc';
            } else {
                this.bookmarkSort.sort = this.bookmarkSort.sort + 'asc';
                this.bookmarkSort.name = 'asc';
            }
        }
        getItemlist(this);
        getBookmarklist();
    }

    getItemlist = function (this_obj, name, index, isExactly) {
        name = typeof name !== 'undefined' ? name : null;
        index = typeof index !== 'undefined' ? index : 0;
        var Info = null, exactly = 'false';
        if (isExactly) {
            exactly = 'true';
        } else if (index) {
            if (this_obj.exactlyList[index-1]) {
                exactly = 'true';
            }
        } else if (this_obj.exactlyMatch){
            exactly = 'true';
        }
        if (!name && !index) {
            Info = $resource('/api/stock/get/' + this_obj.fileSort.sort + '/' + this_obj.page, {}, {
                'stock': { method:'GET' }
            });
        } else if (name && !index) {
            if (name.match(/^>\d+$/) || name.match(/^profit>\d+$/) || name.match(/^safety>-?\d+$/) || name.match(/^manag>\d+$/) || isValidString(name, 'name')) {
                if (this_obj.multiSearch) {
                    Info = $resource('/api/stock/get/' + this_obj.fileSort.sort + '/' + this_obj.page + '/' + name + '/' + exactly, {}, {
                        'stock': { method:'GET' }
                    });
                } else {
                    Info = $resource('/api/stock/getSingle/' + this_obj.fileSort.sort + '/' + this_obj.page + '/' + name + '/' + exactly, {}, {
                        'stock': { method:'GET' }
                    });
                }
            } else {
                addAlert('search tag is not vaild!!!');
                return false;
            }
        } else if (!name && index) {
            addAlert("not enough parameter");
            return false;
        } else {
            if ((name.match(/^>\d+$/) || name.match(/^profit>\d+$/) || name.match(/^safety>-?\d+$/) || name.match(/^manag>\d+$/) || isValidString(name, 'name')) && isValidString(index, 'parentIndex')) {
                Info = $resource('/api/stock/get/' + this_obj.fileSort.sort + '/' + this_obj.page + '/' + name + '/' + exactly + '/' + index, {}, {
                    'stock': { method:'GET' }
                });
            } else {
                addAlert('search tag is not vaild!!!');
                return false;
            }
        }
        this_obj.moreDisabled = true;
        Info.stock({}, function (result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                if (this_obj.page === 0) {
                    this_obj.itemList = [];
                }
                if (result.itemList.length > 0) {
                    for (var i in result.itemList) {
                        if (arrayObjectIndexOf(this_obj.itemList, result.itemList[i].id, 'id') === -1) {
                            result.itemList[i].select = false;
                            this_obj.itemList.push(result.itemList[i]);
                        }
                    }
                } else {
                    $scope.more = false;
                }
                this_obj.page = this_obj.page + result.itemList.length;
                this_obj.latest = result.latest;
                this_obj.bookmarkID = result.bookmarkID;
                this_obj.parentList = result.parentList.cur;
                this_obj.historyList = result.parentList.his;
                this_obj.exactlyList = result.parentList.exactly;
                this_obj.moreDisabled = false;
                this_obj.searchBlur = true;
            }
        }, function(errorResult) {
            this_obj.moreDisabled = false;
            if (errorResult.status === 400) {
                addAlert(errorResult.data);
            } else if (errorResult.status === 403) {
                addAlert('unknown API!!!');
            } else if (errorResult.status === 401) {
                $window.location.href = $location.path();
            }
        });
    }

    getBookmarklist = function() {
        var bookmarkapi = $resource('/api/bookmark/stock/getlist/' + $scope.bookmarkSort.sort, {}, {
            'getbookmarklist': { method:'GET' }
        });
        bookmarkapi.getbookmarklist({}, function(result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                $scope.bookmarkList = result.bookmarkList;
            }
        }, function(errorResult) {
            if (errorResult.status === 400) {
                addAlert(errorResult.data);
            } else if (errorResult.status === 403) {
                addAlert('unknown API!!!');
            } else if (errorResult.status === 401) {
                $window.location.href = $location.path();
            }
        });
    }

    getStockParentlist = function() {
        var Info = $resource('/api/parent/stock/list', {}, {
            'parentlist': { method:'GET' }
        });
        Info.parentlist({}, function (result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                $scope.stockDirList = [];
                for (var i in result.parentList) {
                    $scope.stockDirList.push({name: result.parentList[i].name, show: result.parentList[i].show, collapse: true, edit: false, list: [], page: 0, more: true, moreDisabled: false, sortName: '', sortMtime: '', sort: 'name/asc'});
                }
            }
        }, function(errorResult) {
            if (errorResult.status === 400) {
                addAlert(errorResult.data);
            } else if (errorResult.status === 403) {
                addAlert('unknown API!!!');
            } else if (errorResult.status === 401) {
                $window.location.href = $location.path();
            }
        });
    }

    $scope.submitText = function() {
        if (!this.inputText) {
            return false;
        }
        var this_obj = this;
        this.page = 0;
        this.more = true;
        getItemlist(this_obj, this.inputText);
        this.inputText = '';
    }

    $scope.resetStorage = function() {
        var this_obj = this;
        this.page = 0;
        $scope.more = true;
        $scope.moreDisabled = true;
        var Info = $resource('/api/stock/reset', {}, {
            'stock': { method:'GET' }
        });
        Info.stock({}, function (result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                this_obj.itemList = [];
                if (result.itemList.length > 0) {
                    for (var i in result.itemList) {
                        if (arrayObjectIndexOf(this_obj.itemList, result.itemList[i].id, 'id') === -1) {
                            result.itemList[i].select = false;
                            this_obj.itemList.push(result.itemList[i]);
                        }
                    }
                } else {
                    $scope.more = false;
                }
                this_obj.latest = '';
                this_obj.bookmarkID = '';
                this_obj.page = result.itemList.length;
                this_obj.parentList = result.parentList.cur;
                this_obj.historyList = result.parentList.his;
                this_obj.exactlyList = result.parentList.exactly;
                this_obj.moreDisabled = false;
            }
        }, function(errorResult) {
            this_obj.moreDisabled = false;
            if (errorResult.status === 400) {
                addAlert(errorResult.data);
            } else if (errorResult.status === 403) {
                addAlert('unknown API!!!');
            } else if (errorResult.status === 401) {
                $window.location.href = $location.path();
            }
        });
    }

    $scope.openChart = function() {
        if (this.isParse) {
            this.$parent.isRight = !this.$parent.isRight;
        } else {
            if (this.$parent.isRight) {
                addAlert('select stock index first!!!');
            } else {
                this.$parent.isRight = true;
            }
        }
    }

    /*$scope.openParseIndex = function() {
        this.inputIndex = '';
        this.parseIndex = true;
        this.parseIndexFocus = true;
        return false;
    }*/

    $scope.moreStorage = function() {
        if (this.more) {
            getItemlist(this);
        }
    }

    $scope.$watch("itemList", function(newVal, oldVal) {
        var new_location = false;
        if ($scope.selectList.length === 0) {
            new_location = true;
        }
        $scope.selectList = $filter("filter")(newVal, {select:true});
        if ($scope.selectList.length > 0) {
            var tempList = $scope.tagList;
            if (new_location) {
                for (var i = 0; i < newVal.length; i++) {
                    if (newVal[i].select) {
                        if (i === 0) {
                            $scope.dirLocation = -1;
                        } else if ((i+1) < newVal.length) {
                            $scope.dirLocation = i+1;
                        } else {
                            $scope.dirLocation = i;
                        }
                        break;
                    }
                }
            }
            $scope.tagList = $scope.selectList[0].tags;
            $scope.exceptList = [];
            for (var i = 1; i < $scope.selectList.length; i++) {
                $scope.tagList = intersect($scope.tagList, $scope.selectList[i].tags, $scope.exceptList);
            }
            getRelativeTag(tempList);
        } else {
            $scope.tagList = [];
            $scope.exceptList = [];
            $scope.relativeList = [];
            $scope.isRelative = false;
            $scope.tagNew = false;
        }
    }, true);

    getRelativeTag = function(oldList) {
        if (!$scope.tCD) {
            $scope.tCD = true;
            setTimeout(function() {
                $scope.tCD = false;
                if ($scope.isRelative) {
                    var tags = [];
                    for (var i in $scope.tagList) {
                        if (oldList.indexOf($scope.tagList[i]) === -1) {
                            tags.push($scope.tagList[i]);
                        }
                    }
                    if (tags.length > 0) {
                        var Info = $resource('/api/stock/getRelativeTag', {}, {
                            'relativeTag': { method:'PUT' }
                        });
                        Info.relativeTag({tags: tags}, function (result) {
                            if (result.loginOK) {
                                $window.location.href = $location.path();
                            } else {
                                for (var j in result.relative) {
                                    if ($scope.relativeList.indexOf(result.relative[j]) === -1 && $scope.tagList.indexOf(result.relative[j]) === -1 && $scope.exceptList.indexOf(result.relative[j]) === -1 && $scope.isRelative) {
                                        $scope.relativeList.push(result.relative[j]);
                                    }
                                }
                            }
                        }, function(errorResult) {
                            if (errorResult.status === 400) {
                                addAlert(errorResult.data);
                            } else if (errorResult.status === 403) {
                                addAlert('unknown API!!!');
                            } else if (errorResult.status === 401) {
                                $window.location.href = $location.path();
                            }
                        });
                    }
                }
            }, 1000);
        }
    }

    $scope.selectItem = function($event, item) {
        if (typeof item === 'string') {
            this.$parent.toolList.dir = true;
            this.$parent.toolList.per = false;
            this.$parent.toolList.pre = false;
            this.$parent.toolList.yield = false;
            confirm_str = item;
        } else {
            this.$parent.toolList.dir = false;
            this.$parent.toolList.per = true;
            this.$parent.toolList.pre = true;
            this.$parent.toolList.yield = true;
        }
        this.toggleDropdown($event, 'item');
        this.$parent.toolList.item = item;
    }

    $scope.toggleDropdown = function($event, type) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.dropdown[type] = true;
    };

    $scope.openNewTag = function() {
        if (this.selectList.length) {
            this.newTagName = '';
            this.parseIndex = false;
            this.bookmarkNew = false;
            this.tagNew = true;
            this.tagNewFocus = true;
            var oldList = [];
            if (this.isRelative) {
                oldList = this.tagList;
            }
            this.isRelative = true;
            getRelativeTag(oldList);
        }
        return false;
    }

    $scope.cancelSelect = function() {
        if (this.selectList.length) {
            for (var i in this.itemList) {
                this.itemList[i].select = false;
            }
        } else {
            for (var i in this.itemList) {
                this.itemList[i].select = true;
            }
        }
        return false;
    }

    $scope.submitTag = function() {
        if (this.newTagName) {
            if (isValidString(this.newTagName, 'name')) {
                if (this.selectList.length > 0) {
                    var uids = [];
                    var this_obj = this;
                    for (var i in this.selectList) {
                        uids.push(this.selectList[i].id);
                    }
                    var Info = $resource('/api/stock/addTag/' + this.newTagName, {}, {
                        'addTag': { method:'PUT' }
                    });
                    Info.addTag({uids: uids}, function (result) {
                        if (result.loginOK) {
                            $window.location.href = $location.path();
                        }
                        this_obj.tagNew = false;
                    }, function(errorResult) {
                        if (errorResult.status === 400) {
                            addAlert(errorResult.data);
                        } else if (errorResult.status === 403) {
                            addAlert('unknown API!!!');
                        } else if (errorResult.status === 401) {
                            $window.location.href = $location.path();
                        }
                    });
                } else {
                    addAlert('Please selects item!!!');
                }
            } else {
                addAlert('New tag is not vaild!!!');
            }
        } else {
            addAlert('Please inputs new tag!!!');
        }
    }

    $scope.addTag = function(tag) {
        if (isValidString(tag, 'name')) {
            if (this.selectList.length > 0) {
                var uids = [];
                var this_obj = this;
                for (var i in this.selectList) {
                    uids.push(this.selectList[i].id);
                }
                var Info = $resource('/api/stock/addTag/' + tag, {}, {
                    'addTag': { method:'PUT' }
                });
                Info.addTag({uids: uids}, function (result) {
                    if (result.loginOK) {
                        $window.location.href = $location.path();
                    }
                    if (Number(i) === this_obj.selectList.length -1) {
                        this_obj.tagNew = false;
                    }
                }, function(errorResult) {
                    if (errorResult.status === 400) {
                        addAlert(errorResult.data);
                    } else if (errorResult.status === 403) {
                        addAlert('unknown API!!!');
                    } else if (errorResult.status === 401) {
                        $window.location.href = $location.path();
                    }
                });
            } else {
                addAlert('Please selects item!!!');
            }
        } else {
            addAlert('Tag is not vaild!!!');
        }
    }

    $scope.exactlyStorage = function(this_obj, item) {
        this_obj.page = 0;
        this_obj.more = true;
        getItemlist(this_obj, item, 0, true);
    }

    $scope.delTag = function(tag) {
        if (isValidString(tag, 'name')) {
            if (this.selectList.length > 0) {
                var uids = [];
                for (var i in this.selectList) {
                    uids.push(this.selectList[i].id);
                }
                var Info = $resource('/api/stock/delTag/' + tag, {}, {
                    'delTag': { method:'PUT' }
                });
                Info.delTag({uids: uids}, function (result) {
                    if (result.loginOK) {
                        $window.location.href = $location.path();
                    }
                }, function(errorResult) {
                    if (errorResult.status === 400) {
                        addAlert(errorResult.data);
                    } else if (errorResult.status === 403) {
                        addAlert('unknown API!!!');
                    } else if (errorResult.status === 401) {
                        $window.location.href = $location.path();
                    }
                });
            } else {
                addAlert('Please selects item!!!');
            }
        } else {
            addAlert('Tag is not vaild!!!');
        }
    }

    $scope.gotoStorage = function(this_obj, item, index) {
        this_obj.page = 0;
        this_obj.more = true;
        getItemlist(this_obj, item, index+1);
    }

    $scope.add2Parent = function(item) {
        if (typeof this.toolList.item === 'string') {
            var Info = $resource('/api/parent/stock/add', {}, {
                'addDir': { method:'POST' }
            });
            var this_obj = this;
            Info.addDir({ name: item.name, tag: this.toolList.item}, function (result) {
                if (result.id) {
                    for (var i in this_obj.stockDirList) {
                        if (this_obj.stockDirList[i].name === item.name) {
                            this_obj.stockDirList[i].list.push({name: result.name, id: result.id});
                            break;
                        }
                    }
                }
            }, function(errorResult) {
                if (errorResult.status === 400) {
                    addAlert(errorResult.data);
                } else if (errorResult.status === 403) {
                    addAlert('unknown API!!!');
                } else if (errorResult.status === 401) {
                    $window.location.href = $location.path();
                }
            });
        } else {
            addAlert('select a tag!!!');
        }
    }

    $scope.showTaglist = function(item) {
        item.collapse = !item.collapse;
        if (item.list.length === 0) {
            if ($cookies['dirStock' + item.name + 'SortName'] === 'mtime') {
                item.sort = 'mtime/';
                if ($cookies['dirStock' + item.name + 'SortType'] === 'desc') {
                    item.sort = item.sort + 'desc';
                    item.sortMtime = 'desc';
                } else {
                    item.sort = item.sort + 'asc';
                    item.sortMtime = 'asc';
                }
            } else {
                item.sort = 'name/';
                if ($cookies['dirStock' + item.name + 'SortType'] === 'desc') {
                    item.sort = item.sort + 'desc';
                    item.sortName = 'desc';
                } else {
                    item.sort = item.sort + 'asc';
                    item.sortName = 'asc';
                }
            }
            getTaglist(this.$parent, item);
        }
    }

    getTaglist = function(this_obj, item) {
        if (isValidString(item.name, 'name')) {
            item.moreDisabled = true;
            var Info = $resource('/api/parent/stock/taglist/' + item.name + '/' + item.sort + '/' + item.page, {}, {
                'getTaglist': { method:'GET' }
            });
            Info.getTaglist({}, function (result) {
                if (item.page === 0) {
                    item.list = [];
                }
                if (result.taglist.length > 0) {
                    for (var i in result.taglist) {
                        if (arrayObjectIndexOf(item.list, result.taglist[i].id, 'id') === -1) {
                            item.list.push(result.taglist[i]);
                        }
                    }
                    item.page = item.page + result.taglist.length;
                } else {
                    item.more = false;
                }
                item.moreDisabled = false;
            }, function(errorResult) {
                item.moreDisabled = false;
                if (errorResult.status === 400) {
                    addAlert(errorResult.data);
                } else if (errorResult.status === 403) {
                    addAlert('unknown API!!!');
                } else if (errorResult.status === 401) {
                    $window.location.href = $location.path();
                }
            });
        } else {
            addAlert('Parent name is not vaild!!!');
        }
    }

    $scope.dirItemlist = function(id) {
        var this_obj = this.$parent.$parent;
        if (this_obj.multiSearch) {
            var parentApi = $resource('/api/parent/stock/query/' + id, {}, {
                'query': { method:'get' }
            });
        } else {
            var parentApi = $resource('/api/parent/stock/query/' + id + '/single', {}, {
                'query': { method:'get' }
            });
        }
        this_obj.page = 0;
        this_obj.more = true;
        this_obj.moreDisabled = true;
        parentApi.query({}, function (result) {
            this_obj.itemList = [];
            if (result.itemList.length > 0) {
                for (var i in result.itemList) {
                    if (arrayObjectIndexOf(this_obj.itemList, result.itemList[i].id, 'id') === -1) {
                        result.itemList[i].select = false;
                        this_obj.itemList.push(result.itemList[i]);
                    }
                }
            } else {
                this_obj.more = false;
            }
            this_obj.page = result.itemList.length;
            this_obj.parentList = result.parentList.cur;
            this_obj.historyList = result.parentList.his;
            this_obj.exactlyList = result.parentList.exactly;
            this_obj.moreDisabled = false;
            this_obj.$parent.collapse.stock = true;
        }, function(errorResult) {
            this_obj.moreDisabled = false;
            if (errorResult.status === 400) {
                addAlert(errorResult.data);
            } else if (errorResult.status === 403) {
                addAlert('unknown API!!!');
            } else if (errorResult.status === 401) {
                $window.location.href = $location.path();
            }
        });
    }

    $scope.moreDirtaglist = function(item) {
        getTaglist(this, item);
    }

    $scope.del2Parent = function(id, dir) {
        var this_obj = this;
        var Info = $resource('/api/parent/stock/del/' + id, {}, {
            'delDir': { method:'DELETE' }
        });
        Info.delDir({}, function (result) {
            if (result.id) {
                index = arrayObjectIndexOf(dir.list, result.id, "id");
                if (index !== -1) {
                    dir.list.splice(index, 1);
                    dir.page--;
                }
            }
        }, function(errorResult) {
            if (errorResult.status === 400) {
                addAlert(errorResult.data);
            } else if (errorResult.status === 403) {
                addAlert('unknown API!!!');
            } else if (errorResult.status === 401) {
                $window.location.href = $location.path();
            }
        });
    }

    $scope.addBookmark = function(bookmarkName) {
        if (!bookmarkName) {
            bookmarkName = this.bookmarkName;
        }
        if (this.parentList.length <= 0) {
            addAlert('Empty parent list!!!');
            return false;
        }
        if (isValidString(bookmarkName, 'name')) {
            var this_obj = this;
            var bookmarkapi = $resource('/api/bookmark/stock/add', {}, {
                'addbookmark': { method:'POST' }
            });
            bookmarkapi.addbookmark({name: bookmarkName}, function(result) {
                if (result.loginOK) {
                    $window.location.href = $location.path();
                } else {
                    if (result.id) {
                        this_obj.bookmarkList.push(result);
                    }
                    this_obj.bookmarkNew = false;
                    this_obj.bookmarkName = '';
                }
            }, function(errorResult) {
                if (errorResult.status === 400) {
                    addAlert(errorResult.data);
                } else if (errorResult.status === 403) {
                    addAlert('unknown API!!!');
                } else if (errorResult.status === 401) {
                    $window.location.href = $location.path();
                }
            });
        } else {
            addAlert('Bookmark name is not valid!!!');
        }
    }

    $scope.getBookmarkItem = function(id) {
        var this_obj = this;
        var bookmarkapi = $resource('/api/bookmark/stock/get/' + id, {}, {
            'getbookmark': { method:'GET' }
        });
        this.$parent.moreDisabled = true;
        this.$parent.more = true;
        bookmarkapi.getbookmark({}, function(result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                this_obj.$parent.itemList = [];
                if (result.itemList.length > 0) {
                    for (var i in result.itemList) {
                        result.itemList[i].select = false;
                        this_obj.$parent.itemList.push(result.itemList[i]);
                    }
                } else {
                    this_obj.$parent.more = false;
                }
                this_obj.$parent.page = result.itemList.length;
                this_obj.$parent.latest = result.latest;
                this_obj.$parent.bookmarkID = result.bookmarkID;
                this_obj.$parent.parentList = result.parentList.cur;
                this_obj.$parent.historyList = result.parentList.his;
                this_obj.$parent.exactlyList = result.parentList.exactly;
                this_obj.$parent.moreDisabled = false;
                this_obj.$parent.$parent.collapse.stock = true;
            }
        }, function(errorResult) {
            this_obj.$parent.moreDisabled = false;
            if (errorResult.status === 400) {
                addAlert(errorResult.data);
            } else if (errorResult.status === 403) {
                addAlert('unknown API!!!');
            } else if (errorResult.status === 401) {
                $window.location.href = $location.path();
            }
        });
    }

    $scope.delBookmark = function(id) {
        var this_obj = this;
        var bookmarkapi = $resource('/api/bookmark/stock/del/' + id, {}, {
            'delbookmark': { method:'DELETE' }
        });
        bookmarkapi.delbookmark({}, function(result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                var index = arrayObjectIndexOf(this_obj.$parent.bookmarkList, result.id, "id");
                if (index !== -1) {
                    this_obj.$parent.bookmarkList.splice(index, 1);
                }
            }
        }, function(errorResult) {
            if (errorResult.status === 400) {
                addAlert(errorResult.data);
            } else if (errorResult.status === 403) {
                addAlert('unknown API!!!');
            } else if (errorResult.status === 401) {
                $window.location.href = $location.path();
            }
        });
    }

    $scope.changeDirSort = function(item, name) {
        if (name === 'name') {
            item.sort = 'name/';
            if (item.sortName === 'asc') {
                item.sortName = 'desc';
                item.sort = item.sort + 'desc';
            } else {
                item.sortName = 'asc';
                item.sort = item.sort + 'asc';
            }
            item.sortMtime = '';
        } else if (name === 'mtime') {
            item.sort = 'mtime/';
            if (item.sortMtime === 'asc') {
                item.sortMtime = 'desc';
                item.sort = item.sort + 'desc';
            } else {
                item.sortMtime = 'asc';
                item.sort = item.sort + 'asc';
            }
            item.sortName = '';
        }
        item.page = 0;
        item.more = true;
        getTaglist(this, item);
    }

    $scope.changeSort = function(sort, name) {
        if (this[sort]) {
            if (name === 'name') {
                this[sort].sort = 'name/';
                if (this[sort].name === 'desc') {
                    this[sort].name = 'asc';
                    this[sort].sort = this[sort].sort + 'asc';
                } else {
                    this[sort].name = 'desc';
                    this[sort].sort = this[sort].sort + 'desc';
                }
                this[sort].mtime = '';
                this[sort].count = '';
            } else if (name === 'mtime') {
                this[sort].sort = 'mtime/';
                if (this[sort].mtime === 'desc') {
                    this[sort].mtime = 'asc';
                    this[sort].sort = this[sort].sort + 'asc';
                } else {
                    this[sort].mtime = 'desc';
                    this[sort].sort = this[sort].sort + 'desc';
                }
                this[sort].name = '';
                this[sort].count = '';
            } else if (name === 'count') {
                this[sort].sort = 'count/';
                if (this[sort].count === 'desc') {
                    this[sort].count = 'asc';
                    this[sort].sort = this[sort].sort + 'asc';
                } else {
                    this[sort].count = 'desc';
                    this[sort].sort = this[sort].sort + 'desc';
                }
                this[sort].name = '';
                this[sort].mtime = '';
            }
            if (sort === 'fileSort') {
                this.page = 0;
                this.more = true;
                getItemlist(this);
            } else if (sort === 'bookmarkSort') {
                getBookmarklist();
            }
        }
    }

    //stock
    caculateDate = function(data, year, quarter, is_start) {
        if (!quarter) {
            if (is_start) {
                quarter = data.earliestQuarter;
            } else {
                quarter = data.latestQuarter;
            }
        }
        if (!year) {
            if (is_start) {
                year = data.earliestYear;
            } else {
                year = data.latestYear;
            }
        }
        if (year > data.latestYear) {
            year = data.latestYear;
        } else if (year < data.earliestYear) {
            year = data.earliestYear;
        }
        if (quarter > 4) {
            quarter = 4;
        } else if (quarter < 1) {
            quarter = 1;
        }
        if (year === data.latestYear && quarter > data.latestQuarter) {
            quarter = data.latestQuarter;
        } else if (year === data.earliestYear && quarter < data.earliestQuarter) {
            quarter = data.earliestQuarter;
        }
        return {year: year, quarter: quarter};
    }
    $scope.drawAsset = function(startYear, startQuarter, endYear, endQuarter) {
        var assetStartDate = caculateDate(this.parseResult, startYear, startQuarter);
        var assetEndDate = caculateDate(this.parseResult, endYear, endQuarter);
        if (assetStartDate.year > assetEndDate.year) {
            assetStartDate.year = assetEndDate.year;
        }
        assetStartDate = caculateDate(this.parseResult, assetStartDate.year, assetStartDate.quarter);
        if (assetStartDate.year === assetEndDate.year && assetStartDate.quarter > assetEndDate.quarter) {
            assetStartDate.quarter = assetEndDate.quarter;
        }
        if (!this.parseResult.assetStatus[assetEndDate.year][assetEndDate.quarter-1] || !this.parseResult.assetStatus[assetStartDate.year][assetStartDate.quarter-1] ) {
            addAlert('no this date data!!!');
            return false;
        }
        this.assetLabels = [];
        this.assetData = [];
        this.assetCompareLabels = [];
        this.assetCompareData = [];
        this.assetCompare = false;
        this.assetTotalCommas = '0';
        var diff = 0;
        var diff_percent = 0;
        var total_diff = 0;
        if (assetStartDate.year !== assetEndDate.year || assetStartDate.quarter !== assetEndDate.quarter) {
            this.assetCompare = true;
        }
        if (!this.assetCompare) {
            for(var i in this.parseResult.assetStatus[assetEndDate.year][assetEndDate.quarter-1]) {
                if (i !== 'total') {
                    this.assetLabels.push(i + ':' + this.parseResult.assetStatus[assetEndDate.year][assetEndDate.quarter-1][i] + '%');
                    this.assetData.push(Math.ceil(this.parseResult.assetStatus[assetEndDate.year][assetEndDate.quarter-1][i] * this.parseResult.assetStatus[assetEndDate.year][assetEndDate.quarter-1].total / 100));
                }
            }
        } else {
            total_diff = this.parseResult.assetStatus[assetEndDate.year][assetEndDate.quarter-1].total - this.parseResult.assetStatus[assetStartDate.year][assetStartDate.quarter-1].total;
            if (total_diff < 0) {
                this.assetLabels.push('total_diff');
                this.assetData.push(total_diff);
                this.assetCompareLabels.push('total_diff');
                this.assetCompareData.push(total_diff);
            }
            for(var i in this.parseResult.assetStatus[assetStartDate.year][assetStartDate.quarter-1]) {
                if (i !== 'total') {
                    diff = Math.ceil(this.parseResult.assetStatus[assetEndDate.year][assetEndDate.quarter-1][i] * this.parseResult.assetStatus[assetEndDate.year][assetEndDate.quarter-1].total / 100 - this.parseResult.assetStatus[assetStartDate.year][assetStartDate.quarter-1][i] * this.parseResult.assetStatus[assetStartDate.year][assetStartDate.quarter-1].total / 100);
                    if (diff > 0) {
                        diff_percent = Math.ceil(diff / Math.abs(total_diff) * 1000) / 10;
                        if (i === 'receivable' || i === 'cash' || i === 'OCFA' || i === 'inventories' || i === 'property' || i === 'longterm' || i === 'other') {
                            this.assetLabels.push(i + ':+' + diff_percent + '%');
                            this.assetData.push(diff);
                        } else {
                            this.assetCompareLabels.push(i + ':+' + diff_percent + '%');
                            this.assetCompareData.push(diff);
                        }
                    }
                }
            }
            for(var i in this.parseResult.assetStatus[assetStartDate.year][assetStartDate.quarter-1]) {
                if (i !== 'total') {
                    diff = Math.ceil(this.parseResult.assetStatus[assetEndDate.year][assetEndDate.quarter-1][i] * this.parseResult.assetStatus[assetEndDate.year][assetEndDate.quarter-1].total / 100 - this.parseResult.assetStatus[assetStartDate.year][assetStartDate.quarter-1][i] * this.parseResult.assetStatus[assetStartDate.year][assetStartDate.quarter-1].total / 100);
                    if (diff < 0) {
                        diff_percent = Math.ceil(diff / Math.abs(total_diff) * 1000) / 10;
                        if (i === 'receivable' || i === 'cash' || i === 'OCFA' || i === 'inventories' || i === 'property' || i === 'longterm' || i === 'other') {
                            this.assetLabels.push(i + ':' + diff_percent + '%');
                            this.assetData.push(diff);
                        } else {
                            this.assetCompareLabels.push(i + ':' + diff_percent + '%');
                            this.assetCompareData.push(diff);
                        }
                    }
                }
            }
            if (total_diff > 0) {
                this.assetLabels.push('total_diff');
                this.assetData.push(total_diff);
                this.assetCompareLabels.push('total_diff');
                this.assetCompareData.push(total_diff);
            }
        }

        if (this.assetCompare) {
            var total_diff_percent = Math.ceil(total_diff/this.parseResult.assetStatus[assetStartDate.year][assetStartDate.quarter-1].total * 1000) / 10;
            this.assetTotalCommas = addCommas(this.parseResult.assetStatus[assetStartDate.year][assetStartDate.quarter-1].total);
            if (total_diff > 0) {
                this.assetTotalCommas = this.assetTotalCommas + ':+' + total_diff_percent + '%:+' + addCommas(total_diff);
            } else {
                this.assetTotalCommas = this.assetTotalCommas + ':' + total_diff_percent + '%:' + addCommas(total_diff);
            }
        } else {
            this.assetTotalCommas = addCommas(this.parseResult.assetStatus[assetEndDate.year][assetEndDate.quarter-1].total);
        }
        this.assetStartYear = assetStartDate.year;
        this.assetStartQuarter = assetStartDate.quarter;
        this.assetEndYear = assetEndDate.year;
        this.assetEndQuarter = assetEndDate.quarter;
    }
    $scope.drawSales = function(comprehensive, year, quarter) {
        var salesDate = caculateDate(this.parseResult, year, quarter);
        if (!this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1]) {
            addAlert('no this date data!!!');
            return false;
        }
        this.salesLabels = [];
        this.salesData = [];
        this.salesTotal = 0;
        this.salesTotalCommas = '0';
        this.eps = 0;
        for(var i in this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1]) {
            if (i === 'cost' || i === 'expenses') {
                this.salesLabels.push(i + ':' + this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1][i] + '%');
                this.salesData.push(Math.ceil(this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1][i] * this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1].revenue / 100));
            } else if (i === 'nonoperating_without_FC' || (i === 'comprehensive' && comprehensive)) {
                if (this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1][i] < 0) {
                    this.salesLabels.push(i + ':' + this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1][i] + '%');
                    this.salesData.push(-Math.ceil(this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1][i] * this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1].revenue / 100));
                }
            } else if (i === 'tax' || i === 'finance_cost') {
                if (this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1][i] > 0) {
                    this.salesLabels.push(i + ':' + this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1][i] + '%');
                    this.salesData.push(Math.ceil(this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1][i] * this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1].revenue / 100));
                }
            } else if ((i === 'profit_comprehensive' && comprehensive) || (i === 'profit' && !comprehensive)) {
                this.salesLabels.push(i + ':' + this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1][i] + '%');
                if (this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1][i] > 0) {
                    this.salesData.push(Math.ceil(this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1][i] * this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1].revenue / 100));
                } else if (this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1][i] < 0) {
                    this.salesData.push(-Math.ceil(this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1][i] * this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1].revenue / 100));
                }
            }
        }
        this.salesLabels.push('revenue');
        this.salesData.push(this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1].revenue);
        for(var i in this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1]) {
            if (i === 'nonoperating_without_FC' || (i === 'comprehensive' && comprehensive)) {
                if (this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1][i] > 0) {
                    this.salesTotal += Math.ceil(this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1][i] * this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1].revenue / 100);
                    this.salesLabels.push(i + ':' + this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1][i] + '%');
                    this.salesData.push(Math.ceil(this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1][i] * this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1].revenue / 100));
                }
            } else if (i === 'tax' || i === 'finance_cost') {
                if (this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1][i] < 0) {
                    this.salesTotal -= Math.ceil(this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1][i] * this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1].revenue / 100);
                    this.salesLabels.push(i + ':' + this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1][i] + '%');
                    this.salesData.push(-Math.ceil(this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1][i] * this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1].revenue / 100));
                }
            }
        }
        this.salesYear = salesDate.year;
        this.salesQuarter = salesDate.quarter;
        this.salesTotal += this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1].revenue;
        this.salesTotalCommas = addCommas(this.salesTotal);
        this.eps = this.parseResult.salesStatus[salesDate.year][salesDate.quarter-1].quarterEPS;
    }
    $scope.drawCash = function(mode, accumulate, startYear, startQuarter, endYear, endQuarter) {
        var cashStartDate = caculateDate(this.parseResult, startYear, startQuarter, true);
        var cashEndDate = caculateDate(this.parseResult, endYear, endQuarter);
        if (cashStartDate.year > cashEndDate.year) {
            cashEndDate.year = cashStartDate.year;
        }
        if (cashStartDate.year === cashEndDate.year && cashStartDate.quarter > cashEndDate.quarter) {
            cashEndDate.quarter = cashStartDate.quarter;
        }
        this.cashLabels = [];
        this.cashSumLabels = [];
        this.cashRatioLabels = [];
        this.cashRatioData = [[], []];
        switch(mode) {
            case 2:
            this.cashSumData = [[], []];
            this.cashSumSeries = [['profitBT'], ['real+dividends']];
            this.cashData = [[], [], [], []];
            this.cashSeries = [['without_dividends'], ['minor'], ['operation'], ['invest']];
            break;
            case 3:
            this.cashSumData = [[], [], []];
            this.cashSumSeries = [['profitBT'], ['real'], ['dividends']];
            this.cashData = [[], [], []];
            this.cashSeries = [['without_dividends'], ['minor'], ['operation+invest']];
            break;
            case 4:
            this.cashSumData = [[], []];
            this.cashSumSeries = [['profitBT'], ['real+dividends']];
            this.cashData = [[], [], []];
            this.cashSeries = [['without_dividends'], ['minor'], ['operation+invest']];
            break;
            case 1:
            default:
            mode = 1;
            this.cashSumData = [[], [], []];
            this.cashSumSeries = [['profitBT'], ['real'], ['dividends']];
            this.cashData = [[], [], [], []];
            this.cashSeries = [['without_dividends'], ['minor'], ['operation'], ['invest']];
        }
        for(var i = cashStartDate.year; i<=cashEndDate.year; i++) {
            for (var j in this.parseResult.cashStatus[i]) {
                if (this.parseResult.cashStatus[i][j]) {
                    if ((i === cashStartDate.year && j < (cashStartDate.quarter-1)) || (i === cashEndDate.year && j > (cashEndDate.quarter-1))) {
                        continue;
                    }
                    this.cashLabels.push(i.toString() + (Number(j)+1));
                    this.cashSumLabels.push(i.toString() + (Number(j)+1));
                    this.cashRatioLabels.push(i.toString() + (Number(j)+1));
                    for (var k in this.parseResult.cashStatus[i][j]) {
                        switch(k) {
                            case 'profitBT':
                            if (accumulate && this.cashSumData[0].length > 0) {
                                this.cashSumData[0].push(this.cashSumData[0][this.cashSumData[0].length -1] + Math.ceil(this.parseResult.cashStatus[i][j][k] * this.parseResult.cashStatus[i][j].end/100000000));
                            } else {
                                this.cashSumData[0].push(Math.ceil(this.parseResult.cashStatus[i][j][k] * this.parseResult.cashStatus[i][j].end/100000000));
                            }
                            break;
                            case 'without_dividends':
                            if (accumulate && this.cashData[0].length > 0) {
                                this.cashData[0].push(this.cashData[0][this.cashData[0].length -1] + Math.ceil(this.parseResult.cashStatus[i][j][k] * this.parseResult.cashStatus[i][j].end/100000000));
                            } else {
                                this.cashData[0].push(Math.ceil(this.parseResult.cashStatus[i][j][k] * this.parseResult.cashStatus[i][j].end/100000000));
                            }
                            break;
                            case 'minor':
                            if (accumulate && this.cashData[1].length > 0) {
                                this.cashData[1].push(this.cashData[1][this.cashData[1].length -1] + Math.ceil(this.parseResult.cashStatus[i][j][k] * this.parseResult.cashStatus[i][j].end/100000000));
                            } else {
                                this.cashData[1].push(Math.ceil(this.parseResult.cashStatus[i][j][k] * this.parseResult.cashStatus[i][j].end/100000000));
                            }
                            break;
                            case 'real':
                            if (mode === 1 || mode === 3) {
                                if (accumulate && this.cashSumData[1].length > 0) {
                                    this.cashSumData[1].push(this.cashSumData[1][this.cashSumData[1].length -1] + Math.ceil(this.parseResult.cashStatus[i][j][k] * this.parseResult.cashStatus[i][j].end/100000000));
                                } else {
                                    this.cashSumData[1].push(Math.ceil(this.parseResult.cashStatus[i][j][k] * this.parseResult.cashStatus[i][j].end/100000000));
                                }
                            }
                            break;
                            case 'dividends':
                            if (mode === 1 || mode === 3) {
                                if (accumulate && this.cashSumData[2].length > 0) {
                                    this.cashSumData[2].push(this.cashSumData[2][this.cashSumData[2].length -1] - Math.ceil(this.parseResult.cashStatus[i][j][k] * this.parseResult.cashStatus[i][j].end/100000000));
                                } else {
                                    this.cashSumData[2].push(-Math.ceil(this.parseResult.cashStatus[i][j][k] * this.parseResult.cashStatus[i][j].end/100000000));
                                }
                            }
                            break;
                            case 'operation':
                            if (mode === 1 || mode === 2) {
                                if (accumulate && this.cashData[2].length > 0) {
                                    this.cashData[2].push(this.cashData[2][this.cashData[2].length -1] + Math.ceil(this.parseResult.cashStatus[i][j][k] * this.parseResult.cashStatus[i][j].end/100000000));
                                } else {
                                    this.cashData[2].push(Math.ceil(this.parseResult.cashStatus[i][j][k] * this.parseResult.cashStatus[i][j].end/100000000));
                                }
                            }
                            break;
                            case 'invest':
                            if (mode === 1 || mode === 2) {
                                if (accumulate && this.cashData[3].length > 0) {
                                    this.cashData[3].push(this.cashData[3][this.cashData[3].length -1] - Math.ceil(this.parseResult.cashStatus[i][j][k] * this.parseResult.cashStatus[i][j].end/100000000));
                                } else {
                                    this.cashData[3].push(-Math.ceil(this.parseResult.cashStatus[i][j][k] * this.parseResult.cashStatus[i][j].end/100000000));
                                }
                            }
                            break;
                            case 'investPerProperty':
                            this.cashRatioData[0].push(this.parseResult.cashStatus[i][j][k]);
                            break;
                            case 'financePerLiabilities':
                            this.cashRatioData[1].push(this.parseResult.cashStatus[i][j][k]);
                            break;
                        }
                    }
                    if (mode === 2 || mode === 4) {
                        if (accumulate && this.cashSumData[1].length > 0) {
                            this.cashSumData[1].push(this.cashSumData[1][this.cashSumData[1].length -1] + Math.ceil((this.parseResult.cashStatus[i][j].real - this.parseResult.cashStatus[i][j].dividends) * this.parseResult.cashStatus[i][j].end/100000000));
                        } else {
                            this.cashSumData[1].push(Math.ceil((this.parseResult.cashStatus[i][j].real - this.parseResult.cashStatus[i][j].dividends) * this.parseResult.cashStatus[i][j].end/100000000));
                        }
                    }
                    if (mode === 3 || mode === 4) {
                        if (accumulate && this.cashData[2].length > 0) {
                            this.cashData[2].push(this.cashData[2][this.cashData[2].length -1] + Math.ceil((this.parseResult.cashStatus[i][j].operation + this.parseResult.cashStatus[i][j].invest) * this.parseResult.cashStatus[i][j].end/100000000));
                        } else {
                            this.cashData[2].push(Math.ceil((this.parseResult.cashStatus[i][j].operation + this.parseResult.cashStatus[i][j].invest) * this.parseResult.cashStatus[i][j].end/100000000));
                        }
                    }
                }
            }
        }
        this.cashStartYear = cashStartDate.year;
        this.cashStartQuarter = cashStartDate.quarter;
        this.cashEndYear = cashEndDate.year;
        this.cashEndQuarter = cashEndDate.quarter;
        this.cashMode = mode;
    }
    $scope.drawSafety = function(mode, startYear, startQuarter, endYear, endQuarter) {
        var safetyStartDate = caculateDate(this.parseResult, startYear, startQuarter, true);
        var safetyEndDate = caculateDate(this.parseResult, endYear, endQuarter);
        if (safetyStartDate.year > safetyEndDate.year) {
            safetyEndDate.year = safetyStartDate.year;
        }
        if (safetyStartDate.year === safetyEndDate.year && safetyStartDate.quarter > safetyEndDate.quarter) {
            safetyEndDate.quarter = safetyStartDate.quarter;
        }
        this.safetyLabels = [];
        this.safetyData = [[], [], []];
        for(var i = safetyStartDate.year; i<=safetyEndDate.year; i++) {
            for (var j in this.parseResult.safetyStatus[i]) {
                if (this.parseResult.safetyStatus[i][j]) {
                    if ((i === safetyStartDate.year && j < (safetyStartDate.quarter-1)) || (i === safetyEndDate.year && j > (safetyEndDate.quarter-1))) {
                        continue;
                    }
                    this.safetyLabels.push(i.toString() + (Number(j)+1));
                    for (var k in this.parseResult.safetyStatus[i][j]) {
                        switch(k) {
                            case 'prMinusProfit':
                            this.safetyData[0].push(this.parseResult.safetyStatus[i][j][k]);
                            break;
                            case 'prRatio':
                            this.safetyData[1].push(this.parseResult.safetyStatus[i][j][k]);
                            break;
                            case 'shortCash':
                            if (mode === 1) {
                                this.safetyData[2].push(this.parseResult.safetyStatus[i][j][k]);
                            }
                            break;
                            case 'shortCashWithoutCL':
                            if (mode === 2) {
                                this.safetyData[2].push(this.parseResult.safetyStatus[i][j][k]);
                            }
                            break;
                            case 'shortCashWithoutInvest':
                            if (mode === 3) {
                                this.safetyData[2].push(this.parseResult.safetyStatus[i][j][k]);
                            }
                            break;
                        }
                    }
                }
            }
        }
        this.safetyStartYear = safetyStartDate.year;
        this.safetyStartQuarter = safetyStartDate.quarter;
        this.safetyEndYear = safetyEndDate.year;
        this.safetyEndQuarter = safetyEndDate.quarter;
        this.safetyMode = mode;
    }
    $scope.drawProfit = function(mode, startYear, startQuarter, endYear, endQuarter) {
        var profitStartDate = caculateDate(this.parseResult, startYear, startQuarter, true);
        var profitEndDate = caculateDate(this.parseResult, endYear, endQuarter);
        if (profitStartDate.year > profitEndDate.year) {
            profitEndDate.year = profitStartDate.year;
        }
        if (profitStartDate.year === profitEndDate.year && profitStartDate.quarter > profitEndDate.quarter) {
            profitEndDate.quarter = profitStartDate.quarter;
        }
        this.profitLabels = [];
        this.profitData = [[], [], []];
        this.profitTrioLabels = [];
        this.profitTrioData = [[], [], []];
        this.profitROELabels = [];
        this.profitROEData = [[], [], []];
        this.profitSalesLabels = [];
        this.profitSalesData = [[], []];
        for(var i = profitStartDate.year; i<=profitEndDate.year; i++) {
            for (var j in this.parseResult.profitStatus[i]) {
                if (this.parseResult.profitStatus[i][j]) {
                    if ((i === profitStartDate.year && j < (profitStartDate.quarter-1)) || (i === profitEndDate.year && j > (profitEndDate.quarter-1))) {
                        continue;
                    }
                    this.profitLabels.push(i.toString() + (Number(j)+1));
                    this.profitTrioLabels.push(i.toString() + (Number(j)+1));
                    this.profitROELabels.push(i.toString() + (Number(j)+1));
                    this.profitSalesLabels.push(i.toString() + (Number(j)+1));
                    for (var k in this.parseResult.profitStatus[i][j]) {
                        switch(k) {
                            case 'gross_profit':
                            this.profitData[0].push(this.parseResult.profitStatus[i][j][k]);
                            break;
                            case 'operating_profit':
                            this.profitData[1].push(this.parseResult.profitStatus[i][j][k]);
                            break;
                            case 'profit':
                            if (mode === 1) {
                                this.profitData[2].push(this.parseResult.profitStatus[i][j][k]);
                                this.profitTrioData[2].push(this.parseResult.profitStatus[i][j][k]);
                                this.profitROEData[2].push(this.parseResult.profitStatus[i][j][k]);
                            }
                            break;
                            case 'leverage':
                            this.profitTrioData[0].push(Math.ceil(1000 - this.parseResult.profitStatus[i][j][k]*1000)/10);
                            break;
                            case 'turnover':
                            this.profitTrioData[1].push(Math.ceil(this.parseResult.profitStatus[i][j][k]*1000)/10);
                            break;
                            case 'roe':
                            if (mode === 1) {
                                this.profitROEData[0].push(this.parseResult.profitStatus[i][j][k]);
                            }
                            break;
                            case 'asset_growth':
                            if (mode === 1) {
                                this.profitROEData[1].push(this.parseResult.profitStatus[i][j][k]);
                            }
                            break;
                            case 'salesPerShare':
                            this.profitSalesData[0].push(Math.ceil(this.parseResult.profitStatus[i][j][k]/1000000));
                            break;
                            case 'quarterSales':
                            this.profitSalesData[1].push(Math.ceil(this.parseResult.profitStatus[i][j][k]/1000000));
                            break;
                            case 'operationRoe':
                            if (mode === 2) {
                                this.profitROEData[0].push(this.parseResult.profitStatus[i][j][k]);
                            }
                            break;
                            case 'operationAG':
                            if (mode === 2) {
                                this.profitROEData[1].push(this.parseResult.profitStatus[i][j][k]);
                            }
                            break;
                            case 'operatingP':
                            if (mode === 2) {
                                this.profitData[2].push(this.parseResult.profitStatus[i][j][k]);
                                this.profitTrioData[2].push(this.parseResult.profitStatus[i][j][k]);
                                this.profitROEData[2].push(this.parseResult.profitStatus[i][j][k]);
                            }
                            break;
                            case 'oiRoe':
                            if (mode === 3) {
                                this.profitROEData[0].push(this.parseResult.profitStatus[i][j][k]);
                            }
                            break;
                            case 'oiAG':
                            if (mode === 3) {
                                this.profitROEData[1].push(this.parseResult.profitStatus[i][j][k]);
                            }
                            break;
                            case 'oiP':
                            if (mode === 3) {
                                this.profitData[2].push(this.parseResult.profitStatus[i][j][k]);
                                this.profitTrioData[2].push(this.parseResult.profitStatus[i][j][k]);
                                this.profitROEData[2].push(this.parseResult.profitStatus[i][j][k]);
                            }
                            break;
                            case 'realRoe':
                            if (mode === 4) {
                                this.profitROEData[0].push(this.parseResult.profitStatus[i][j][k]);
                            }
                            break;
                            case 'realAG':
                            if (mode === 4) {
                                this.profitROEData[1].push(this.parseResult.profitStatus[i][j][k]);
                            }
                            break;
                            case 'realP':
                            if (mode === 4) {
                                this.profitData[2].push(this.parseResult.profitStatus[i][j][k]);
                                this.profitTrioData[2].push(this.parseResult.profitStatus[i][j][k]);
                                this.profitROEData[2].push(this.parseResult.profitStatus[i][j][k]);
                            }
                            break;
                            case 'realRoe_dividends':
                            if (mode === 5) {
                                this.profitROEData[0].push(this.parseResult.profitStatus[i][j][k]);
                            }
                            break;
                            case 'realAG_dividends':
                            if (mode === 5) {
                                this.profitROEData[1].push(this.parseResult.profitStatus[i][j][k]);
                            }
                            break;
                            case 'realP_dividends':
                            if (mode === 5) {
                                this.profitData[2].push(this.parseResult.profitStatus[i][j][k]);
                                this.profitTrioData[2].push(this.parseResult.profitStatus[i][j][k]);
                                this.profitROEData[2].push(this.parseResult.profitStatus[i][j][k]);
                            }
                            break;
                        }
                    }
                }
            }
        }
        this.profitStartYear = profitStartDate.year;
        this.profitStartQuarter = profitStartDate.quarter;
        this.profitEndYear = profitEndDate.year;
        this.profitEndQuarter = profitEndDate.quarter;
        this.profitMode = mode;
    }
    $scope.drawManagement = function(mode, startYear, startQuarter, endYear, endQuarter) {
        var managementStartDate = caculateDate(this.parseResult, startYear, startQuarter, true);
        var managementEndDate = caculateDate(this.parseResult, endYear, endQuarter);
        if (managementStartDate.year > managementEndDate.year) {
            managementEndDate.year = managementStartDate.year;
        }
        if (managementStartDate.year === managementEndDate.year && managementStartDate.quarter > managementEndDate.quarter) {
            managementEndDate.quarter = managementStartDate.quarter;
        }
        this.managementLabels = [];
        this.managementData = [];
        this.managementSeries = [];
        this.managementNumberLabels = [];
        this.managementNumberData = [];
        this.managementNumberSeries = [];
        for (var i in mode) {
            if (mode[i]) {
                this.managementSeries.push(i);
                this.managementData.push([]);
                this.managementNumberSeries.push(i);
                this.managementNumberData.push([]);
            }
        }
        this.managementNumberSeries.push('revenue');
        this.managementNumberData.push([]);
        var index = -1;
        for(var i = managementStartDate.year; i<=managementEndDate.year; i++) {
            for (var j in this.parseResult.managementStatus[i]) {
                if (this.parseResult.managementStatus[i][j]) {
                    if ((i === managementStartDate.year && j < (managementStartDate.quarter-1)) || (i === managementEndDate.year && j > (managementEndDate.quarter-1))) {
                        continue;
                    }
                    this.managementLabels.push(i.toString() + (Number(j)+1));
                    this.managementNumberLabels.push(i.toString() + (Number(j)+1));
                    for (var k in this.parseResult.managementStatus[i][j]) {
                        switch(k) {
                            case 'profitRelative':
                            index = this.managementSeries.indexOf('profit');
                            if (index !== -1) {
                                this.managementData[index].push(this.parseResult.managementStatus[i][j][k]);
                            }
                            break;
                            case 'cashRelative':
                            index = this.managementSeries.indexOf('cash');
                            if (index !== -1) {
                                this.managementData[index].push(this.parseResult.managementStatus[i][j][k]);
                            }
                            break;
                            case 'inventoriesRelative':
                            index = this.managementSeries.indexOf('inventories');
                            if (index !== -1) {
                                this.managementData[index].push(this.parseResult.managementStatus[i][j][k]);
                            }
                            break;
                            case 'receivableRelative':
                            index = this.managementSeries.indexOf('receivable');
                            if (index !== -1) {
                                this.managementData[index].push(this.parseResult.managementStatus[i][j][k]);
                            }
                            break;
                            case 'payableRelative':
                            index = this.managementSeries.indexOf('payable');
                            if (index !== -1) {
                                this.managementData[index].push(this.parseResult.managementStatus[i][j][k]);
                            }
                            break;
                            case 'profit':
                            index = this.managementNumberSeries.indexOf('profit');
                            if (index !== -1) {
                                this.managementNumberData[index].push(Math.ceil(this.parseResult.managementStatus[i][j][k]/1000000));
                            }
                            break;
                            case 'cash':
                            index = this.managementNumberSeries.indexOf('cash');
                            if (index !== -1) {
                                this.managementNumberData[index].push(Math.ceil(this.parseResult.managementStatus[i][j][k]/1000000));
                            }
                            break;
                            case 'inventories':
                            index = this.managementNumberSeries.indexOf('inventories');
                            if (index !== -1) {
                                this.managementNumberData[index].push(Math.ceil(this.parseResult.managementStatus[i][j][k]/1000000));
                            }
                            break;
                            case 'receivable':
                            index = this.managementNumberSeries.indexOf('receivable');
                            if (index !== -1) {
                                this.managementNumberData[index].push(Math.ceil(this.parseResult.managementStatus[i][j][k]/1000000));
                            }
                            break;
                            case 'payable':
                            index = this.managementNumberSeries.indexOf('payable');
                            if (index !== -1) {
                                this.managementNumberData[index].push(Math.ceil(this.parseResult.managementStatus[i][j][k]/1000000));
                            }
                            break;
                            case 'revenue':
                            index = this.managementNumberSeries.indexOf('revenue');
                            if (index !== -1) {
                                this.managementNumberData[index].push(Math.ceil(this.parseResult.managementStatus[i][j][k]/1000000));
                            }
                            break;
                        }
                    }
                }
            }
        }

        this.managementStartYear = managementStartDate.year;
        this.managementStartQuarter = managementStartDate.quarter;
        this.managementEndYear = managementEndDate.year;
        this.managementEndQuarter = managementEndDate.quarter;
    }
    $scope.submitIndex = function(item) {
        item = typeof item !== 'undefined' ? item : null;
        var this_obj = this;
        if (!item && !this.inputIndex) {
            addAlert('Please input index or select item!!!');
            return false;
        } else {
            if (item) {
                this_obj = this.$parent.$parent;
            }
        }
        var stockApi = null;
        if (item) {
            stockApi = $resource('/api/stock/querySimple/' + item.id, {}, {
                'query': { method:'get' }
            });
        } else {
            if (isNaN(this_obj.inputIndex)) {
                addAlert('Please input index!!!');
                return false;
            }
            stockApi = $resource('/api/stock/query/' + Number(this_obj.inputIndex), {}, {
                'query': { method:'get' }
            });
            this_obj.parseIndex = false;
        }
        stockApi.query({}, function (result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                if (!result) {
                    addAlert('empty stock parse!!!');
                    return false;
                }
                this_obj.parseResult = {};
                this_obj.parseYear = [];
                this_obj.accumulate = false;
                this_obj.comprehensive = true;
                this_obj.relative = {profit: true, cash: true, inventories: true, receivable: true, payable: true};
                console.log(result);
                if ($scope.bookmarkID) {
                    $scope.latest = item.id;
                }
                this_obj.parseResult.assetStatus = result.assetStatus;
                this_obj.parseResult.salesStatus = result.salesStatus;
                this_obj.parseResult.cashStatus = result.cashStatus;
                this_obj.parseResult.safetyStatus = result.safetyStatus;
                this_obj.parseResult.profitStatus = result.profitStatus;
                this_obj.parseResult.managementStatus = result.managementStatus;
                this_obj.parseResult.latestYear = result.latestYear;
                this_obj.parseResult.latestQuarter = result.latestQuarter;
                this_obj.parseResult.earliestYear = result.earliestYear;
                this_obj.parseResult.earliestQuarter = result.earliestQuarter;
                this_obj.profitIndex = result.profitIndex;
                this_obj.safetyIndex = result.safetyIndex;
                this_obj.managementIndex = result.managementIndex;
                this_obj.stockName = result.stockName;
                for (var i = this_obj.parseResult.earliestYear; i <= this_obj.parseResult.latestYear; i++) {
                    this_obj.parseYear.push({name: i, value: i});
                }
                this_obj.isParse = true;
                this_obj.$parent.isRight = false;
                //assetStatus
                this_obj.drawAsset();
                //salesStatus
                this_obj.drawSales(this_obj.comprehensive);
                //cashStatus
                this_obj.drawCash(4, this_obj.accumulate);
                this_obj.drawSafety(1);
                this_obj.drawProfit(1);
                this_obj.drawManagement(this_obj.relative);
            }
        }, function(errorResult) {
            if (errorResult.status === 400) {
                addAlert(errorResult.data);
            } else if (errorResult.status === 403) {
                addAlert('unknown API!!!');
            } else if (errorResult.status === 401) {
                $window.location.href = $location.path();
            }
        });
    }
    $scope.stockPer = function() {
        var this_obj = this;
        if (this.toolList.item) {
            var stockApi = $resource('/api/stock/getPER/' + this.toolList.item.id, {}, {
                'getPER': { method:'get' }
            });
            stockApi.getPER({}, function (result) {
                if (result.loginOK) {
                    $window.location.href = $location.path();
                } else {
                    this_obj.inputIndex = result.per;
                    this_obj.tagNew = false;
                    this_obj.bookmarkNew = false;
                    this_obj.parseIndex = true;
                    this_obj.parseIndexFocus = true;
                }
            }, function(errorResult) {
                if (errorResult.status === 400) {
                    addAlert(errorResult.data);
                } else if (errorResult.status === 403) {
                    addAlert('unknown API!!!');
                } else if (errorResult.status === 401) {
                    $window.location.href = $location.path();
                }
            });
        } else {
            addAlert('select a stock!!!');
        }
    }
    $scope.stockPre = function() {
        var this_obj = this;
        if (this.toolList.item) {
            var stockApi = $resource('/api/stock/getPredictPER/' + this.toolList.item.id, {}, {
                'getPER': { method:'get' }
            });
            stockApi.getPER({}, function (result) {
                if (result.loginOK) {
                    $window.location.href = $location.path();
                } else {
                    this_obj.inputIndex = result.per;
                    this_obj.tagNew = false;
                    this_obj.bookmarkNew = false;
                    this_obj.parseIndex = true;
                    this_obj.parseIndexFocus = true;
                }
            }, function(errorResult) {
                if (errorResult.status === 400) {
                    addAlert(errorResult.data);
                } else if (errorResult.status === 403) {
                    addAlert('unknown API!!!');
                } else if (errorResult.status === 401) {
                    $window.location.href = $location.path();
                }
            });
        } else {
            addAlert('select a stock!!!');
        }
    }
    $scope.stockYield = function() {
        var this_obj = this;
        if (this.toolList.item) {
            var stockApi = $resource('/api/stock/getYield/' + this.toolList.item.id, {}, {
                'getYield': { method:'get' }
            });
            stockApi.getYield({}, function (result) {
                if (result.loginOK) {
                    $window.location.href = $location.path();
                } else {
                    this_obj.inputIndex = result.yield;
                    this_obj.tagNew = false;
                    this_obj.bookmarkNew = false;
                    this_obj.parseIndex = true;
                    this_obj.parseIndexFocus = true;
                }
            }, function(errorResult) {
                if (errorResult.status === 400) {
                    addAlert(errorResult.data);
                } else if (errorResult.status === 403) {
                    addAlert('unknown API!!!');
                } else if (errorResult.status === 401) {
                    $window.location.href = $location.path();
                }
            });
        } else {
            addAlert('select a stock!!!');
        }
    }
}function PasswordCntl($route, $routeParams, $location, $resource, $window, $cookies, $filter, $scope) {
    //left
    $scope.$parent.currentPage = 3;
    $scope.$parent.collapse.nav = true;
    //right
    $scope.$parent.isRight = true;
    $scope.bookmarkCollapse = false;
    $scope.bookmarkEdit = false;
    $scope.passwordDirList = [];
    //list
    $scope.page = 0;
    $scope.more = true;
    $scope.moreDisabled = false;
    $scope.itemList = [];
    $scope.latest = '';
    $scope.bookmarkID = '';
    $scope.parentList = [];
    $scope.historyList = [];
    $scope.exactlyList = [];
    $scope.relativeList = [];
    $scope.searchBlur = false;
    $scope.multiSearch = false;
    $scope.upPasswordFocus = false;
    $scope.showPassword = false;
    $scope.showClearPassword = false;

    $scope.toolList = {details: false, pw: false, url: false, email: false, del: false, dir: false, item: null};
    $scope.dropdown.item = false;
    $scope.tagNew = false;
    $scope.tagNewFocus = false;
    $scope.selectList = [];
    $scope.tagList = [];
    $scope.exceptList = [];
    $scope.exactlyMatch = false;
    $scope.bookmarkNew = false;
    $scope.bookmarkNewFocus = false;
    $scope.bookmarkList = [];
    $scope.bookmarkName = '';
    $scope.dirLocation = 0;
    $scope.isRelative = false;
    $scope.tCD = false;
    //cookie initial
    $scope.fileSort = {name:'', mtime: '', count: '', sort: 'name/desc'};
    $scope.dirSort = {name:'', mtime: '', count: '', sort: 'name/asc'};
    $scope.bookmarkSort = {name:'', mtime: '', sort: 'name/asc'};
    $scope.orig = {};

    //password details
    $scope.userName = '';
    $scope.userNameFocus = false;
    $scope.userUsername = '';
    $scope.userUsernameFocus = false;

    //存password要注意
    $scope.userPassword = '';
    $scope.userPrePassword = '';
    $scope.newPassword = '';
    $scope.userConPassword = '';
    $scope.upPassword = '';

    $scope.newPasswordFocus = false;
    $scope.userConPasswordFocus = false;
    $scope.userUrl = '';
    $scope.userUrlFocus = false;
    $scope.userEmail = '';
    $scope.userEmailFocus = false;
    $scope.userImportant = false;
    $scope.edit = false;
    $scope.copyUsernameFocus = false;
    $scope.copyPasswordFocus = false;
    $scope.copyPrePasswordFocus = false;
    $scope.copyUrlFocus = false;
    $scope.copyEmailFocus = false;
    $scope.openPassword = false;
    $scope.showUserPassword = false;
    $scope.openPrePassword = false;
    $scope.showUserPrePassword = false;
    $scope.dbImportant = false;
    $scope.isNew = false;
    $scope.details = false;
    $scope.detailsId = false;
    $scope.showUsername = false;

    //websocket
    $scope.$on('password', function(e, d) {
        var id = JSON.parse(d);
        var index = arrayObjectIndexOf($scope.itemList, id, 'id');
        var storageApi = $resource('/api/password/single/' + id, {}, {
            'single': { method:'get' }
        });
        var this_obj = this;
        storageApi.single({}, function (result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                if (result.empty) {
                    if (index !== -1) {
                        $scope.itemList.splice(index, 1);
                        $scope.page--;
                    }
                } else {
                    $scope.latest = result.latest;
                    $scope.bookmarkID = result.bookmarkID;
                    if (index !== -1) {
                        result.item.select = $scope.itemList[index].select;
                        date = new Date(result.item.utime*1000);
                        result.item.utime = date.getFullYear() + '/' + (date.getMonth()+1)+'/'+date.getDate();
                        $scope.itemList.splice(index, 1, result.item);
                    } else {
                        result.item.select = false;
                        date = new Date(result.item.utime*1000);
                        result.item.utime = date.getFullYear() + '/' + (date.getMonth()+1)+'/'+date.getDate();
                        $scope.itemList.splice(0, 0, result.item);
                    }
                }
            }
        }, function(errorResult) {
            if (errorResult.status === 400) {
                addAlert(errorResult.data);
            } else if (errorResult.status === 403) {
                addAlert('unknown API!!!');
            } else if (errorResult.status === 401) {
                $window.location.href = $location.path();
            }
        });
    });

    //taglist
    $scope.init = function(){
        getPasswordParentlist();
        this.page = 0;
        this.more = true;
        if ($cookies.passwordSortName === 'mtime') {
            this.fileSort.sort = 'mtime/';
            if ($cookies.passwordSortType === 'asc') {
                this.fileSort.sort = this.fileSort.sort + 'asc';
                this.fileSort.mtime = 'asc';
            } else {
                this.fileSort.sort = this.fileSort.sort + 'desc';
                this.fileSort.mtime = 'desc';
            }
        } else if ($cookies.passwordSortName === 'count') {
            this.fileSort.sort = 'count/';
            if ($cookies.passwordSortType === 'asc') {
                this.fileSort.sort = this.fileSort.sort + 'asc';
                this.fileSort.count = 'asc';
            } else {
                this.fileSort.sort = this.fileSort.sort + 'desc';
                this.fileSort.count = 'desc';
            }
        } else {
            this.fileSort.sort = 'name/';
            if ($cookies.passwordSortType === 'asc') {
                this.fileSort.sort = this.fileSort.sort + 'asc';
                this.fileSort.name = 'asc';
            } else {
                this.fileSort.sort = this.fileSort.sort + 'desc';
                this.fileSort.name = 'desc';
            }
        }
        if ($cookies.bookmarkPasswordSortName === 'mtime') {
            this.bookmarkSort.sort = 'mtime/';
            if ($cookies.bookmarkPasswordSortType === 'desc') {
                this.bookmarkSort.sort = this.bookmarkSort.sort + 'desc';
                this.bookmarkSort.mtime = 'desc';
            } else {
                this.bookmarkSort.sort = this.bookmarkSort.sort + 'asc';
                this.bookmarkSort.mtime = 'asc';
            }
        } else {
            this.bookmarkSort.sort = 'name/';
            if ($cookies.bookmarkPasswordSortType === 'desc') {
                this.bookmarkSort.sort = this.bookmarkSort.sort + 'desc';
                this.bookmarkSort.name = 'desc';
            } else {
                this.bookmarkSort.sort = this.bookmarkSort.sort + 'asc';
                this.bookmarkSort.name = 'asc';
            }
        }
        getItemlist(this);
        getBookmarklist();
    }

    getItemlist = function (this_obj, name, index, isExactly) {
        name = typeof name !== 'undefined' ? name : null;
        index = typeof index !== 'undefined' ? index : 0;
        var Info = null, exactly = 'false';
        if (isExactly) {
            exactly = 'true';
        } else if (index) {
            if (this_obj.exactlyList[index-1]) {
                exactly = 'true';
            }
        } else if (this_obj.exactlyMatch){
            exactly = 'true';
        }
        if (!name && !index) {
            Info = $resource('/api/password/get/' + this_obj.fileSort.sort + '/' + this_obj.page, {}, {
                'password': { method:'GET' }
            });
        } else if (name && !index) {
            if (isValidString(name, 'name')) {
                if (this_obj.multiSearch) {
                    Info = $resource('/api/password/get/' + this_obj.fileSort.sort + '/' + this_obj.page + '/' + name + '/' + exactly, {}, {
                        'password': { method:'GET' }
                    });
                } else {
                    Info = $resource('/api/password/getSingle/' + this_obj.fileSort.sort + '/' + this_obj.page + '/' + name + '/' + exactly, {}, {
                        'password': { method:'GET' }
                    });
                }
            } else {
                addAlert('search tag is not vaild!!!');
                return false;
            }
        } else if (!name && index) {
            addAlert("not enough parameter");
            return false;
        } else {
            if (isValidString(name, 'name') && isValidString(index, 'parentIndex')) {
                Info = $resource('/api/password/get/' + this_obj.fileSort.sort + '/' + this_obj.page + '/' + name + '/' + exactly + '/' + index, {}, {
                    'password': { method:'GET' }
                });
            } else {
                addAlert('search tag is not vaild!!!');
                return false;
            }
        }
        this_obj.moreDisabled = true;
        Info.password({}, function (result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                if (this_obj.page === 0) {
                    this_obj.itemList = [];
                }
                if (result.itemList.length > 0) {
                    for (var i in result.itemList) {
                        if (arrayObjectIndexOf(this_obj.itemList, result.itemList[i].id, 'id') === -1) {
                            result.itemList[i].select = false;
                            date = new Date(result.itemList[i].utime*1000);
                            result.itemList[i].utime = date.getFullYear() + '/' + (date.getMonth()+1)+'/'+date.getDate();
                            this_obj.itemList.push(result.itemList[i]);
                        }
                    }
                } else {
                    $scope.more = false;
                }
                this_obj.page = this_obj.page + result.itemList.length;
                this_obj.latest = result.latest;
                this_obj.bookmarkID = result.bookmarkID;
                this_obj.parentList = result.parentList.cur;
                this_obj.historyList = result.parentList.his;
                this_obj.exactlyList = result.parentList.exactly;
                this_obj.moreDisabled = false;
                this_obj.searchBlur = true;
            }
        }, function(errorResult) {
            this_obj.moreDisabled = false;
            if (errorResult.status === 400) {
                addAlert(errorResult.data);
            } else if (errorResult.status === 403) {
                addAlert('unknown API!!!');
            } else if (errorResult.status === 401) {
                $window.location.href = $location.path();
            }
        });
    }

    getBookmarklist = function() {
        var bookmarkapi = $resource('/api/bookmark/password/getlist/' + $scope.bookmarkSort.sort, {}, {
            'getbookmarklist': { method:'GET' }
        });
        bookmarkapi.getbookmarklist({}, function(result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                $scope.bookmarkList = result.bookmarkList;
            }
        }, function(errorResult) {
            if (errorResult.status === 400) {
                addAlert(errorResult.data);
            } else if (errorResult.status === 403) {
                addAlert('unknown API!!!');
            } else if (errorResult.status === 401) {
                $window.location.href = $location.path();
            }
        });
    }

    getPasswordParentlist = function() {
        var Info = $resource('/api/parent/password/list', {}, {
            'parentlist': { method:'GET' }
        });
        Info.parentlist({}, function (result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                $scope.stockDirList = [];
                for (var i in result.parentList) {
                    $scope.passwordDirList.push({name: result.parentList[i].name, show: result.parentList[i].show, collapse: true, edit: false, list: [], page: 0, more: true, moreDisabled: false, sortName: '', sortMtime: '', sort: 'name/asc'});
                }
            }
        }, function(errorResult) {
            if (errorResult.status === 400) {
                addAlert(errorResult.data);
            } else if (errorResult.status === 403) {
                addAlert('unknown API!!!');
            } else if (errorResult.status === 401) {
                $window.location.href = $location.path();
            }
        });
    }

    $scope.submitText = function() {
        if (!this.inputText) {
            return false;
        }
        var this_obj = this;
        this.page = 0;
        this.more = true;
        getItemlist(this_obj, this.inputText);
        this.inputText = '';
    }

    $scope.resetStorage = function() {
        var this_obj = this;
        this.page = 0;
        $scope.more = true;
        $scope.moreDisabled = true;
        var Info = $resource('/api/password/reset', {}, {
            'password': { method:'GET' }
        });
        Info.password({}, function (result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                this_obj.itemList = [];
                if (result.itemList.length > 0) {
                    for (var i in result.itemList) {
                        if (arrayObjectIndexOf(this_obj.itemList, result.itemList[i].id, 'id') === -1) {
                            result.itemList[i].select = false;
                            date = new Date(result.itemList[i].utime*1000);
                            result.itemList[i].utime = date.getFullYear() + '/' + (date.getMonth()+1)+'/'+date.getDate();
                            this_obj.itemList.push(result.itemList[i]);
                        }
                    }
                } else {
                    $scope.more = false;
                }
                this_obj.latest = '';
                this_obj.bookmarkID = '';
                this_obj.page = result.itemList.length;
                this_obj.parentList = result.parentList.cur;
                this_obj.historyList = result.parentList.his;
                this_obj.exactlyList = result.parentList.exactly;
                this_obj.moreDisabled = false;
            }
        }, function(errorResult) {
            this_obj.moreDisabled = false;
            if (errorResult.status === 400) {
                addAlert(errorResult.data);
            } else if (errorResult.status === 403) {
                addAlert('unknown API!!!');
            } else if (errorResult.status === 401) {
                $window.location.href = $location.path();
            }
        });
    }

    $scope.moreStorage = function() {
        if (this.more) {
            getItemlist(this);
        }
    }

    $scope.$watch("itemList", function(newVal, oldVal) {
        var new_location = false;
        if ($scope.selectList.length === 0) {
            new_location = true;
        }
        $scope.selectList = $filter("filter")(newVal, {select:true});
        if ($scope.selectList.length > 0) {
            var tempList = $scope.tagList;
            if (new_location) {
                for (var i = 0; i < newVal.length; i++) {
                    if (newVal[i].select) {
                        if (i === 0) {
                            $scope.dirLocation = -1;
                        } else if ((i+1) < newVal.length) {
                            $scope.dirLocation = i+1;
                        } else {
                            $scope.dirLocation = i;
                        }
                        break;
                    }
                }
            }
            $scope.tagList = $scope.selectList[0].tags;
            $scope.exceptList = [];
            for (var i = 1; i < $scope.selectList.length; i++) {
                $scope.tagList = intersect($scope.tagList, $scope.selectList[i].tags, $scope.exceptList);
            }
            getRelativeTag(tempList);
        } else {
            $scope.tagList = [];
            $scope.exceptList = [];
            $scope.relativeList = [];
            $scope.isRelative = false;
            $scope.tagNew = false;
        }
    }, true);

    getRelativeTag = function(oldList) {
        if (!$scope.tCD) {
            $scope.tCD = true;
            setTimeout(function() {
                $scope.tCD = false;
                if ($scope.isRelative) {
                    var tags = [];
                    for (var i in $scope.tagList) {
                        if (oldList.indexOf($scope.tagList[i]) === -1) {
                            tags.push($scope.tagList[i]);
                        }
                    }
                    if (tags.length > 0) {
                        var Info = $resource('/api/password/getRelativeTag', {}, {
                            'relativeTag': { method:'PUT' }
                        });
                        Info.relativeTag({tags: tags}, function (result) {
                            if (result.loginOK) {
                                $window.location.href = $location.path();
                            } else {
                                for (var i in result.relative) {
                                    if ($scope.relativeList.indexOf(result.relative[i]) === -1 && $scope.tagList.indexOf(result.relative[i]) === -1 && $scope.exceptList.indexOf(result.relative[i]) === -1 && $scope.isRelative) {
                                        $scope.relativeList.push(result.relative[i]);
                                    }
                                }
                            }
                        }, function(errorResult) {
                            if (errorResult.status === 400) {
                                addAlert(errorResult.data);
                            } else if (errorResult.status === 403) {
                                addAlert('unknown API!!!');
                            } else if (errorResult.status === 401) {
                                $window.location.href = $location.path();
                            }
                        });
                    }
                }
            }, 1000);
        }
    }

    $scope.selectItem = function($event, item) {
        if (typeof item === 'string') {
            this.$parent.toolList.dir = true;
            this.$parent.toolList.details = false;
            this.$parent.toolList.pw = false;
            this.$parent.toolList.url = false;
            this.$parent.toolList.email = false;
            this.$parent.toolList.del = false;
            confirm_str = item;
        } else {
            this.$parent.toolList.dir = false;
            this.$parent.toolList.details = true;
            this.$parent.toolList.pw = true;
            this.$parent.toolList.del = true;
            if (item.url) {
                this.$parent.toolList.url = true;
            } else {
                this.$parent.toolList.url = false;
            }
            if (item.email) {
                this.$parent.toolList.email = true;
            } else {
                this.$parent.toolList.email = false;
            }
        }
        this.toggleDropdown($event, 'item');
        this.$parent.toolList.item = item;
    }

    $scope.toggleDropdown = function($event, type) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.dropdown[type] = true;
    };

    $scope.openNewTag = function() {
        if (this.selectList.length) {
            this.newTagName = '';
            this.showPassword = false;
            this.upPassword = '';
            this.showUsername = false;
            this.tagNew = true;
            this.tagNewFocus = true;
            var oldList = [];
            if (this.isRelative) {
                oldList = this.tagList;
            }
            this.isRelative = true;
            getRelativeTag(oldList);
        }
        return false;
    }

    $scope.cancelSelect = function() {
        if (this.selectList.length) {
            for (var i in this.itemList) {
                this.itemList[i].select = false;
            }
        } else {
            for (var i in this.itemList) {
                this.itemList[i].select = true;
            }
        }
        return false;
    }

    $scope.submitTag = function() {
        if (this.newTagName) {
            if (isValidString(this.newTagName, 'name')) {
                if (this.selectList.length > 0) {
                    var uids = [];
                    var this_obj = this;
                    for (var i in this.selectList) {
                        uids.push(this.selectList[i].id);
                    }
                    var Info = $resource('/api/password/addTag/' + this.newTagName, {}, {
                        'addTag': { method:'PUT' }
                    });
                    Info.addTag({uids: uids}, function (result) {
                        if (result.loginOK) {
                            $window.location.href = $location.path();
                        }
                        this_obj.tagNew = false;
                    }, function(errorResult) {
                        if (errorResult.status === 400) {
                            addAlert(errorResult.data);
                        } else if (errorResult.status === 403) {
                            addAlert('unknown API!!!');
                        } else if (errorResult.status === 401) {
                            $window.location.href = $location.path();
                        }
                    });
                } else {
                    addAlert('Please selects item!!!');
                }
            } else {
                addAlert('New tag is not vaild!!!');
            }
        } else {
            addAlert('Please inputs new tag!!!');
        }
    }

    $scope.exactlyStorage = function(this_obj, item) {
        this_obj.page = 0;
        this_obj.more = true;
        getItemlist(this_obj, item, 0, true);
    }

    $scope.addTag = function(tag) {
        if (isValidString(tag, 'name')) {
            if (this.selectList.length > 0) {
                var uids = [];
                var this_obj = this;
                for (var i in this.selectList) {
                    uids.push(this.selectList[i].id);
                }
                var Info = $resource('/api/password/addTag/' + tag, {}, {
                    'addTag': { method:'PUT' }
                });
                Info.addTag({uids: uids}, function (result) {
                    if (result.loginOK) {
                        $window.location.href = $location.path();
                    }
                    if (Number(i) === this_obj.selectList.length -1) {
                        this_obj.tagNew = false;
                    }
                }, function(errorResult) {
                    if (errorResult.status === 400) {
                        addAlert(errorResult.data);
                    } else if (errorResult.status === 403) {
                        addAlert('unknown API!!!');
                    } else if (errorResult.status === 401) {
                        $window.location.href = $location.path();
                    }
                });
            } else {
                addAlert('Please selects item!!!');
            }
        } else {
            addAlert('Tag is not vaild!!!');
        }
    }

    $scope.delTag = function(tag) {
        if (isValidString(tag, 'name')) {
            if (this.selectList.length > 0) {
                var uids = [];
                for (var i in this.selectList) {
                    uids.push(this.selectList[i].id);
                }
                var Info = $resource('/api/password/delTag/' + tag, {}, {
                    'delTag': { method:'PUT' }
                });
                Info.delTag({uids: uids}, function (result) {
                    if (result.loginOK) {
                        $window.location.href = $location.path();
                    }
                }, function(errorResult) {
                    if (errorResult.status === 400) {
                        addAlert(errorResult.data);
                    } else if (errorResult.status === 403) {
                        addAlert('unknown API!!!');
                    } else if (errorResult.status === 401) {
                        $window.location.href = $location.path();
                    }
                });
            } else {
                addAlert('Please selects item!!!');
            }
        } else {
            addAlert('Tag is not vaild!!!');
        }
    }

    $scope.gotoStorage = function(this_obj, item, index) {
        this_obj.page = 0;
        this_obj.more = true;
        getItemlist(this_obj, item, index+1);
    }

    $scope.add2Parent = function(item) {
        if (typeof this.toolList.item === 'string') {
            var Info = $resource('/api/parent/password/add', {}, {
                'addDir': { method:'POST' }
            });
            var this_obj = this;
            Info.addDir({ name: item.name, tag: this.toolList.item}, function (result) {
                if (result.id) {
                    for (var i in this_obj.passwordDirList) {
                        if (this_obj.passwordDirList[i].name === item.name) {
                            this_obj.passwordDirList[i].list.push({name: result.name, id: result.id});
                            break;
                        }
                    }
                }
            }, function(errorResult) {
                if (errorResult.status === 400) {
                    addAlert(errorResult.data);
                } else if (errorResult.status === 403) {
                    addAlert('unknown API!!!');
                } else if (errorResult.status === 401) {
                    $window.location.href = $location.path();
                }
            });
        } else {
            addAlert('select a tag!!!');
        }
    }

    $scope.showTaglist = function(item) {
        item.collapse = !item.collapse;
        if (item.list.length === 0) {
            if ($cookies['dirPassword' + item.name + 'SortName'] === 'mtime') {
                item.sort = 'mtime/';
                if ($cookies['dirPassword' + item.name + 'SortType'] === 'desc') {
                    item.sort = item.sort + 'desc';
                    item.sortMtime = 'desc';
                } else {
                    item.sort = item.sort + 'asc';
                    item.sortMtime = 'asc';
                }
            } else {
                item.sort = 'name/';
                if ($cookies['dirPassword' + item.name + 'SortType'] === 'desc') {
                    item.sort = item.sort + 'desc';
                    item.sortName = 'desc';
                } else {
                    item.sort = item.sort + 'asc';
                    item.sortName = 'asc';
                }
            }
            getTaglist(this.$parent, item);
        }
    }

    getTaglist = function(this_obj, item) {
        if (isValidString(item.name, 'name')) {
            item.moreDisabled = true;
            var Info = $resource('/api/parent/password/taglist/' + item.name + '/' + item.sort + '/' + item.page, {}, {
                'getTaglist': { method:'GET' }
            });
            Info.getTaglist({}, function (result) {
                if (item.page === 0) {
                    item.list = [];
                }
                if (result.taglist.length > 0) {
                    for (var i in result.taglist) {
                        if (arrayObjectIndexOf(item.list, result.taglist[i].id, 'id') === -1) {
                            item.list.push(result.taglist[i]);
                        }
                    }
                    item.page = item.page + result.taglist.length;
                } else {
                    item.more = false;
                }
                item.moreDisabled = false;
            }, function(errorResult) {
                item.moreDisabled = false;
                if (errorResult.status === 400) {
                    addAlert(errorResult.data);
                } else if (errorResult.status === 403) {
                    addAlert('unknown API!!!');
                } else if (errorResult.status === 401) {
                    $window.location.href = $location.path();
                }
            });
        } else {
            addAlert('Parent name is not vaild!!!');
        }
    }

    $scope.dirItemlist = function(id) {
        var this_obj = this.$parent.$parent;
        if (this_obj.multiSearch) {
            var parentApi = $resource('/api/parent/password/query/' + id, {}, {
                'query': { method:'get' }
            });
        } else {
            var parentApi = $resource('/api/parent/password/query/' + id + '/single', {}, {
                'query': { method:'get' }
            });
        }
        this_obj.page = 0;
        this_obj.more = true;
        this_obj.moreDisabled = true;
        parentApi.query({}, function (result) {
            this_obj.itemList = [];
            if (result.itemList.length > 0) {
                for (var i in result.itemList) {
                    if (arrayObjectIndexOf(this_obj.itemList, result.itemList[i].id, 'id') === -1) {
                        result.itemList[i].select = false;
                        date = new Date(result.itemList[i].utime*1000);
                        result.itemList[i].utime = date.getFullYear() + '/' + (date.getMonth()+1)+'/'+date.getDate();
                        this_obj.itemList.push(result.itemList[i]);
                    }
                }
            } else {
                this_obj.more = false;
            }
            this_obj.page = result.itemList.length;
            this_obj.parentList = result.parentList.cur;
            this_obj.historyList = result.parentList.his;
            this_obj.exactlyList = result.parentList.exactly;
            this_obj.moreDisabled = false;
            this_obj.$parent.collapse.password = true;
        }, function(errorResult) {
            this_obj.moreDisabled = false;
            if (errorResult.status === 400) {
                addAlert(errorResult.data);
            } else if (errorResult.status === 403) {
                addAlert('unknown API!!!');
            } else if (errorResult.status === 401) {
                $window.location.href = $location.path();
            }
        });
    }

    $scope.moreDirtaglist = function(item) {
        getTaglist(this, item);
    }

    $scope.del2Parent = function(id, dir) {
        var this_obj = this;
        var Info = $resource('/api/parent/password/del/' + id, {}, {
            'delDir': { method:'DELETE' }
        });
        Info.delDir({}, function (result) {
            if (result.id) {
                index = arrayObjectIndexOf(dir.list, result.id, "id");
                if (index !== -1) {
                    dir.list.splice(index, 1);
                    dir.page--;
                }
            }
        }, function(errorResult) {
            if (errorResult.status === 400) {
                addAlert(errorResult.data);
            } else if (errorResult.status === 403) {
                addAlert('unknown API!!!');
            } else if (errorResult.status === 401) {
                $window.location.href = $location.path();
            }
        });
    }

    $scope.addBookmark = function(bookmarkName) {
        if (!bookmarkName) {
            bookmarkName = this.bookmarkName;
        }
        if (this.parentList.length <= 0) {
            addAlert('Empty parent list!!!');
            return false;
        }
        if (isValidString(bookmarkName, 'name')) {
            var this_obj = this;
            var bookmarkapi = $resource('/api/bookmark/password/add', {}, {
                'addbookmark': { method:'POST' }
            });
            bookmarkapi.addbookmark({name: bookmarkName}, function(result) {
                if (result.loginOK) {
                    $window.location.href = $location.path();
                } else {
                    if (result.id) {
                        this_obj.bookmarkList.push(result);
                    }
                    this_obj.bookmarkNew = false;
                    this_obj.bookmarkName = '';
                }
            }, function(errorResult) {
                if (errorResult.status === 400) {
                    addAlert(errorResult.data);
                } else if (errorResult.status === 403) {
                    addAlert('unknown API!!!');
                } else if (errorResult.status === 401) {
                    $window.location.href = $location.path();
                }
            });
        } else {
            addAlert('Bookmark name is not valid!!!');
        }
    }

    $scope.getBookmarkItem = function(id) {
        var this_obj = this;
        var bookmarkapi = $resource('/api/bookmark/password/get/' + id, {}, {
            'getbookmark': { method:'GET' }
        });
        this.$parent.moreDisabled = true;
        this.$parent.more = true;
        bookmarkapi.getbookmark({}, function(result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                this_obj.$parent.itemList = [];
                if (result.itemList.length > 0) {
                    for (var i in result.itemList) {
                        result.itemList[i].select = false;
                        date = new Date(result.itemList[i].utime*1000);
                        result.itemList[i].utime = date.getFullYear() + '/' + (date.getMonth()+1)+'/'+date.getDate();
                        this_obj.$parent.itemList.push(result.itemList[i]);
                    }
                } else {
                    this_obj.$parent.more = false;
                }
                this_obj.$parent.page = result.itemList.length;
                this_obj.$parent.latest = result.latest;
                this_obj.$parent.bookmarkID = result.bookmarkID;
                this_obj.$parent.parentList = result.parentList.cur;
                this_obj.$parent.historyList = result.parentList.his;
                this_obj.$parent.exactlyList = result.parentList.exactly;
                this_obj.$parent.moreDisabled = false;
                this_obj.$parent.$parent.collapse.storage = true;
            }
        }, function(errorResult) {
            this_obj.$parent.moreDisabled = false;
            if (errorResult.status === 400) {
                addAlert(errorResult.data);
            } else if (errorResult.status === 403) {
                addAlert('unknown API!!!');
            } else if (errorResult.status === 401) {
                $window.location.href = $location.path();
            }
        });
    }

    $scope.delBookmark = function(id) {
        var this_obj = this;
        var bookmarkapi = $resource('/api/bookmark/password/del/' + id, {}, {
            'delbookmark': { method:'DELETE' }
        });
        bookmarkapi.delbookmark({}, function(result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                var index = arrayObjectIndexOf(this_obj.$parent.bookmarkList, result.id, "id");
                if (index !== -1) {
                    this_obj.$parent.bookmarkList.splice(index, 1);
                }
            }
        }, function(errorResult) {
            if (errorResult.status === 400) {
                addAlert(errorResult.data);
            } else if (errorResult.status === 403) {
                addAlert('unknown API!!!');
            } else if (errorResult.status === 401) {
                $window.location.href = $location.path();
            }
        });
    }

    $scope.changeDirSort = function(item, name) {
        if (name === 'name') {
            item.sort = 'name/';
            if (item.sortName === 'asc') {
                item.sortName = 'desc';
                item.sort = item.sort + 'desc';
            } else {
                item.sortName = 'asc';
                item.sort = item.sort + 'asc';
            }
            item.sortMtime = '';
        } else if (name === 'mtime') {
            item.sort = 'mtime/';
            if (item.sortMtime === 'asc') {
                item.sortMtime = 'desc';
                item.sort = item.sort + 'desc';
            } else {
                item.sortMtime = 'asc';
                item.sort = item.sort + 'asc';
            }
            item.sortName = '';
        }
        item.page = 0;
        item.more = true;
        getTaglist(this, item);
    }

    $scope.changeSort = function(sort, name) {
        if (this[sort]) {
            if (name === 'name') {
                this[sort].sort = 'name/';
                if (this[sort].name === 'desc') {
                    this[sort].name = 'asc';
                    this[sort].sort = this[sort].sort + 'asc';
                } else {
                    this[sort].name = 'desc';
                    this[sort].sort = this[sort].sort + 'desc';
                }
                this[sort].mtime = '';
                this[sort].count = '';
            } else if (name === 'mtime') {
                this[sort].sort = 'mtime/';
                if (this[sort].mtime === 'desc') {
                    this[sort].mtime = 'asc';
                    this[sort].sort = this[sort].sort + 'asc';
                } else {
                    this[sort].mtime = 'desc';
                    this[sort].sort = this[sort].sort + 'desc';
                }
                this[sort].name = '';
                this[sort].count = '';
            } else if (name === 'count') {
                this[sort].sort = 'count/';
                if (this[sort].count === 'desc') {
                    this[sort].count = 'asc';
                    this[sort].sort = this[sort].sort + 'asc';
                } else {
                    this[sort].count = 'desc';
                    this[sort].sort = this[sort].sort + 'desc';
                }
                this[sort].name = '';
                this[sort].mtime = '';
            }
            if (sort === 'fileSort') {
                this.page = 0;
                this.more = true;
                getItemlist(this);
            } else if (sort === 'bookmarkSort') {
                getBookmarklist();
            }
        }
    }

    //password
    $scope.sendForm = function() {
        if (this.isNew || this.edit) {
            if (!isValidString(this.userName, 'name')) {
                addAlert('name not vaild!!!');
            } else if (!isValidString(this.userUsername, 'name')) {
                addAlert('username not vaild!!!');
            } else if (this.userUrl && !isValidString(this.userUrl, 'url')) {
                addAlert('url is not vaild!!!');
            } else if (this.userEmail && !isValidString(this.userEmail, 'email')) {
                addAlert('email is not vaild!!!');
            }
            if (this.isNew) {
                if (!isValidString(this.newPassword, 'altpwd') || !isValidString(this.userConPassword, 'altpwd')) {
                    addAlert('password not vaild!!!');
                } else if (this.newPassword !== this.userConPassword) {
                    addAlert('password is not equal!!!');
                } else if (this.userImportant) {
                    openBlockPW(this.newRow, this);
                } else {
                    this.newRow();
                }
            } else {
                if (this.newPassword && (!isValidString(this.newPassword, 'altpwd') || !isValidString(this.userConPassword, 'altpwd'))) {
                    addAlert('password not vaild!!!');
                } else if (this.newPassword && (this.newPassword !== this.userConPassword)) {
                    addAlert('password is not equal!!!');
                } else if (!this.detailsId) {
                    addAlert('select row first!!!');
                } else {
                    var data = {};
                    var differ = false;
                    if (this.userName !== this.orig.name) {
                        data.name = this.userName;
                        differ = true;
                    }
                    if (this.userUsername !== this.orig.username) {
                        data.username = this.userUsername;
                        differ = true;
                    }
                    if (this.userUrl !== this.orig.url) {
                        data.url = this.userUrl;
                        differ = true;
                    }
                    if (this.userEmail !== this.orig.email) {
                        data.email = this.userEmail;
                        differ = true;
                    }
                    if (this.userImportant !== this.orig.important) {
                        data.important = this.userImportant;
                        differ = true;
                    }
                    if (this.newPassword) {
                        data.password = this.newPassword;
                        data.conpassword = this.userConPassword;
                        differ = true;
                    }
                    if (differ) {
                        if (this.userImportant || this.dbImportant) {
                            openBlockPW(this.editRow, this, data);
                        } else {
                            this.editRow(data);
                        }
                    } else {
                        this.isNew = false;
                        this.edit = false;
                    }
                }
            }
        } else {
            this.isNew = false;
            this.edit = false;
            this.details = false;
        }
    }

    $scope.editRow = function(data) {
        var this_obj = this;
        if (this.$parent.userPW) {
            data.userPW = this.$parent.userPW;
        }
        var passwordapi = $resource('/api/password/editRow/' + this.detailsId, {}, {
            'editRow': { method:'PUT' }
        });
        passwordapi.editRow(data, function(result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                this_obj.isNew = false;
                this_obj.edit = false;
                this_obj.newPassword = '';
                this_obj.userConPassword = '';
                this_obj.dbImportant = this_obj.userImportant;
                this_obj.$parent.closeBlockPW(true);
            }
        }, function(errorResult) {
            if (errorResult.status === 400) {
                addAlert(errorResult.data);
            } else if (errorResult.status === 403) {
                addAlert('unknown API!!!');
            } else if (errorResult.status === 401) {
                $window.location.href = $location.path();
            }
        });
    }

    $scope.newRow = function() {
        var this_obj = this;
        var passwordapi = $resource('/api/password/newRow', {}, {
            'newRow': { method:'POST' }
        });
        var data = {name: this.userName, username: this.userUsername, password: this.newPassword, conpassword: this.userConPassword, url: this.userUrl, email: this.userEmail, important: this.userImportant};
        if (this.$parent.userPW) {
            data['userPW'] = this.$parent.userPW;
        }
        passwordapi.newRow(data, function(result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                this_obj.isNew = false;
                this_obj.edit = false;
                this_obj.details = false;
                this_obj.newPassword = '';
                this_obj.userConPassword = '';
                this_obj.$parent.closeBlockPW(true);
            }
        }, function(errorResult) {
            if (errorResult.status === 400) {
                addAlert(errorResult.data);
            } else if (errorResult.status === 403) {
                addAlert('unknown API!!!');
            } else if (errorResult.status === 401) {
                $window.location.href = $location.path();
            }
        });
    }

    $scope.preGetPassword = function(type, item) {
        if (type === 'list') {
            var this_obj = this.$parent.$parent;
            if (!item) {
                item = this.toolList.item;
                this_obj = this;
            }
            if (item.important) {
                openBlockPW(this_obj.getPassword, this_obj, item.id);
            } else {
                this_obj.getPassword(item.id);
            }
        } else {
            if (this.dbImportant) {
                openBlockPW(this.handleUserPassword, this, type, item);
            } else {
                this.handleUserPassword(type, item);
            }
        }
    }

    $scope.getPassword = function(id) {
        var this_obj = this;
        var passwordapi = $resource('/api/password/getPW/' + id, {}, {
            'getPW': { method:'PUT' }
        });
        var data = {};
        if (this.$parent.userPW) {
            data['userPW'] = this.$parent.userPW;
        }
        passwordapi.getPW(data, function(result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                this_obj.upPassword = result.password;
                this_obj.showUsername = false;
                this_obj.showPassword = true;
                this_obj.upPasswordFocus = true;
                this_obj.showClearPassword = false;
                this_obj.$parent.closeBlockPW(true);
                this_obj.latest = id;
                delete result;
            }
        }, function(errorResult) {
            if (errorResult.status === 400) {
                addAlert(errorResult.data);
            } else if (errorResult.status === 403) {
                addAlert('unknown API!!!');
            } else if (errorResult.status === 401) {
                $window.location.href = $location.path();
            }
        });
    }

    $scope.handleUserPassword = function(type, is_pre) {
        if (type === 'close') {
            if (is_pre) {
                this.openPrePassword = false;
                this.userPrePassword = '';
            } else {
                this.openPassword = false;
                this.userPassword = '';
            }
        } else {
            var this_obj = this;
            var passwordapi = null;
            var id = this.detailsId;
            if (is_pre) {
                passwordapi = $resource('/api/password/getPW/' + id + '/pre', {}, {
                    'getPW': { method:'PUT' }
                });
            } else {
                passwordapi = $resource('/api/password/getPW/' + id, {}, {
                    'getPW': { method:'PUT' }
                });
            }
            var data = {};
            if (this.$parent.userPW) {
                data['userPW'] = this.$parent.userPW;
            }
            passwordapi.getPW(data, function(result) {
                if (result.loginOK) {
                    $window.location.href = $location.path();
                } else {
                    if (type === 'open') {
                        if (is_pre) {
                            this_obj.userPrePassword = result.password;
                            this_obj.showUserPrePassword = true;
                            this_obj.copyPrePasswordFocus = true;
                            this_obj.openPrePassword = true;
                        } else {
                            this_obj.userPassword = result.password;
                            this_obj.showUserPassword = true;
                            this_obj.copyPasswordFocus = true;
                            this_obj.openPassword = true;
                        }
                    } else if (type === 'copy') {
                        if (is_pre) {
                            this_obj.userPrePassword = result.password;
                            this_obj.showUserPrePassword = false;
                            this_obj.copyPrePasswordFocus = true;
                            this_obj.openPrePassword = true;
                        } else {
                            this_obj.userPassword = result.password;
                            this_obj.showUserPassword = false;
                            this_obj.copyPasswordFocus = true;
                            this_obj.openPassword = true;
                        }
                    }
                    this_obj.$parent.closeBlockPW(true);
                    this_obj.latest = id;
                    delete result;
                }
            }, function(errorResult) {
                if (errorResult.status === 400) {
                    addAlert(errorResult.data);
                } else if (errorResult.status === 403) {
                    addAlert('unknown API!!!');
                } else if (errorResult.status === 401) {
                    $window.location.href = $location.path();
                }
            });
        }
    }

    $scope.getUsername = function(item) {
        this.$parent.$parent.userUsername = item.username;
        this.$parent.$parent.showPassword = false;
        this.$parent.$parent.upPassword = '';
        this.$parent.$parent.showUsername = true;
        this.$parent.$parent.showUsernameFocus = true;
    }

    $scope.getDetails = function() {
        this.detailsId = this.toolList.item.id;
        this.userName = this.toolList.item.name;
        this.userUsername = this.toolList.item.username;
        this.userEmail = this.toolList.item.email;
        if (this.toolList.item.important) {
            this.userImportant = true;
            this.dbImportant = true;
        } else {
            this.userImportant = false;
            this.dbImportant = false;
        }
        this.userUrl = decodeURIComponent(this.toolList.item.url);
        this.details = true;
        this.edit = false;
        this.isNew = false;
    }

    $scope.openNewrow = function() {
        this.detailsId = '';
        this.userName = '';
        this.userUsername = '';
        this.userEmail = '';
        this.userUrl = '';
        this.isNew = true;
        this.edit = true;
        this.details = true;
        this.userImportant = false;
        this.userNameFocus = true;
    }

    $scope.gotoUrl = function(type) {
        var url = this.userUrl;
        if (type === 1) {
            url = decodeURIComponent(this.toolList.item.url);
        }
        if (!isValidString(url, 'url')) {
            addAlert('url is not vaild!!!');
        } else {
            $window.open(decodeURIComponent(url));
        }
    }

    $scope.gotoEmail = function(type) {
        var email = this.userEmail;
        if (type === 1) {
            email = this.toolList.item.email;
        }
        if (!isValidString(email, 'email')) {
            addAlert('email is not vaild!!!');
        } else {
            if (email.match(/@gmail\.com(\.[a-zA-Z][a-zA-Z][a-zA-Z]?)?$/)) {
                $window.open('https://mail.google.com/');
            } else if (email.match(/@yahoo\.com(\.[a-zA-Z][a-zA-Z][a-zA-Z]?)?$/)) {
                $window.open('https://login.yahoo.com/config/mail?');
            } else if (email.match(/@(hotmail|msn|live)\.com(\.[a-zA-Z][a-zA-Z][a-zA-Z]?)?$/)) {
                $window.open('https://www.live.com/');
            } else {
                addAlert('目前沒有此email類型請自行前往');
            }
        }
    }

    $scope.preDelPassword = function(id) {
        var important = true;
        if (!id) {
            id = this.toolList.item.id;
            important = this.toolList.item.important;
        } else {
            important = this.dbImportant;
        }
        if (important) {
            openBlockPW(this.delPassword, this, id);
        } else {
            this.delPassword(id);
        }
    }

    $scope.delPassword = function(id) {
        var this_obj = this;
        var passwordapi = $resource('/api/password/delRow/' + id, {}, {
            'delRow': { method:'PUT' }
        });
        passwordapi.delRow({userPW: this.$parent.userPW}, function(result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                this_obj.isNew = false;
                this_obj.edit = false;
                this_obj.details = false;
                this_obj.$parent.closeBlockPW(true);
            }
        }, function(errorResult) {
            if (errorResult.status === 400) {
                addAlert(errorResult.data);
            } else if (errorResult.status === 403) {
                addAlert('unknown API!!!');
            } else if (errorResult.status === 401) {
                $window.location.href = $location.path();
            }
        });
    }

    $scope.editTrigger = function() {
        if (this.edit) {
            this.userName = this.orig.name;
            this.userUsername = this.orig.username;
            this.userEmail = this.orig.email;
            this.userUrl = this.orig.url;
            this.userImportant = this.orig.important;
            this.newPassword = '';
            this.userConPassword = '';
        } else {
            this.orig = {name: this.userName, username: this.userUsername, email: this.userEmail, url: this.userUrl, important: this.userImportant};
        }
        this.edit = !this.edit;
        this.userNameFocus = true;
    }

    $scope.generatePW = function() {
        var passwordapi = $resource('/api/password/generate', {}, {
            'generate': { method:'GET' }
        });
        var this_obj = this;
        passwordapi.generate({}, function(result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                this_obj.newPassword = result.password;
                this_obj.userConPassword = result.password;
            }
        }, function(errorResult) {
            if (errorResult.status === 400) {
                addAlert(errorResult.data);
            } else if (errorResult.status === 403) {
                addAlert('unknown API!!!');
            } else if (errorResult.status === 401) {
                $window.location.href = $location.path();
            }
        });
    }

    if (document.getElementById('up-password')) {
        document.getElementById('up-password').addEventListener('copy', function(e){
            e.clipboardData.setData('text/plain', $scope.upPassword);
            e.preventDefault(); // We want our data, not data from any selection, to be written to the clipboard
        });
    }

    if (document.getElementById('user-password')) {
        document.getElementById('user-password').addEventListener('copy', function(e){
            e.clipboardData.setData('text/plain', $scope.userPassword);
            e.preventDefault(); // We want our data, not data from any selection, to be written to the clipboard
        });
    }

    if (document.getElementById('user-pre-password')) {
        document.getElementById('user-pre-password').addEventListener('copy', function(e){
            e.clipboardData.setData('text/plain', $scope.userPrePassword);
            e.preventDefault(); // We want our data, not data from any selection, to be written to the clipboard
        });
    }

    if (document.getElementById('s-user-password')) {
        document.getElementById('s-user-password').addEventListener('copy', function(e){
            e.clipboardData.setData('text/plain', $scope.userPassword);
            e.preventDefault(); // We want our data, not data from any selection, to be written to the clipboard
        });
    }

    if (document.getElementById('s-user-pre-password')) {
        document.getElementById('s-user-pre-password').addEventListener('copy', function(e){
            e.clipboardData.setData('text/plain', $scope.userPrePassword);
            e.preventDefault(); // We want our data, not data from any selection, to be written to the clipboard
        });
    }
}function isValidString(str, type)
{
    if (typeof str !== 'string' && typeof str !== 'number'){
        return false;
    }
    if (type === 'name')
    {
        if (str !== '.' && str !== '..') {
            //if (str.search(/^[^\\\/\|\*\?"<>:]{1,255}$/) != -1)
            //為了方便開放 < ，但是後端只接受default的
            if (str.search(/^[^\\\/\|\*\?"<:]{1,255}$/) != -1)
            {
                if (str.replace(/[\s　]+/g, '') !== '')
                {
                    return true;
                }
            }
        }
    }

    if (type === 'desc')
    {
        if (str.search(/^[^\\\/\|\*\?\'"<>`:&]{0,250}$/) !== -1)
        {
            return true;
        }
    }

    if (type === 'perm')
    {
        if ((Number(str) || Number(str) === 0) && Number(str) < 32 && Number(str) >=0) {
            return true;
        }
    }

    if (type === 'int')
    {
        if (Number(str) && Number(str) > 0) {
            return true;
        }
    }

    if (type === 'parentIndex')
    {
        if (Number(str) && Number(str) <= 10 && Number(str) > 0) {
            return true;
        }
    }

    if (type === 'passwd')
    {
        //if (str.search(/^(?=.*\d)(?=.*[a-zA-Z]).{6,20}$/) != -1)
        if (str.search(/^[0-9a-zA-Z!@#$%]{6,20}$/) != -1)
        {
            return true;
        }
    }

    if (type === 'altpwd')
    {
        //if (str.search(/^(?=.*\d)(?=.*[a-zA-Z]).{6,20}$/) != -1)
        if (str.search(/^[0-9a-zA-Z!@#$%]{4,20}$/) != -1)
        {
            return true;
        }
    }

    if (type === 'email')
    {
        //if (str.search(/^(?=.*\d)(?=.*[a-zA-Z]).{6,20}$/) != -1)
        if (str.search(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,6})+$/) != -1)
        {
            return true;
        }
    }

    var re_weburl = new RegExp(
        "^" +
        // protocol identifier
        "(?:(?:https?|ftp)://)" +
        // user:pass authentication
        "(?:\\S+(?::\\S*)?@)?" +
        "(?:" +
        // IP address exclusion
        // private & local networks
        "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
        "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
        "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
        // IP address dotted notation octets
        // excludes loopback network 0.0.0.0
        // excludes reserved space >= 224.0.0.0
        // excludes network & broacast addresses
        // (first & last IP address of each class)
        "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
        "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
        "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
        "|" +
        // host name
        "(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)" +
        // domain name
        "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" +
        // TLD identifier
        "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" +
        ")" +
        // port number
        "(?::\\d{2,5})?" +
        // resource path
        "(?:/\\S*)?" +
        "$", "i"
    );

    if (type === 'url')
    {
        if (str.search(re_weburl) != -1)
        {
            return true;
        }
    }
    return false;
}

//不能有重複的物件
function intersect(a, b, c) {
    /*var t;
    if (b.length > a.length) {
        t = b;
        b = a;
        a = t;
    }*/
    var temp = clone(b);
    var intersect = a.filter(function (e) {
        var index = temp.indexOf(e);
        if (index !== -1) {
            temp.splice(index, 1);
            return true;
        } else {
            if (c.indexOf(e) === -1) {
                c.push(e);
            }
        }
    });
    temp.forEach(function (e) {
        if (c.indexOf(e) === -1) {
            c.push(e);
        }
    });
    return intersect;
}

function arrayObjectIndexOf(myArray, searchTerm, property) {
    for(var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) {
            return i;
        }
    }
    return -1;
}

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function randomFloor(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}/*
 * angular-ui-bootstrap
 * http://angular-ui.github.io/bootstrap/

 * Version: 0.12.0 - 2014-11-16
 * License: MIT
 */
angular.module("ui.bootstrap",["ui.bootstrap.tpls","ui.bootstrap.transition","ui.bootstrap.collapse","ui.bootstrap.accordion","ui.bootstrap.alert","ui.bootstrap.bindHtml","ui.bootstrap.buttons","ui.bootstrap.carousel","ui.bootstrap.dateparser","ui.bootstrap.position","ui.bootstrap.datepicker","ui.bootstrap.dropdown","ui.bootstrap.modal","ui.bootstrap.pagination","ui.bootstrap.tooltip","ui.bootstrap.popover","ui.bootstrap.progressbar","ui.bootstrap.rating","ui.bootstrap.tabs","ui.bootstrap.timepicker","ui.bootstrap.typeahead"]),angular.module("ui.bootstrap.tpls",["template/accordion/accordion-group.html","template/accordion/accordion.html","template/alert/alert.html","template/carousel/carousel.html","template/carousel/slide.html","template/datepicker/datepicker.html","template/datepicker/day.html","template/datepicker/month.html","template/datepicker/popup.html","template/datepicker/year.html","template/modal/backdrop.html","template/modal/window.html","template/pagination/pager.html","template/pagination/pagination.html","template/tooltip/tooltip-html-unsafe-popup.html","template/tooltip/tooltip-popup.html","template/popover/popover.html","template/progressbar/bar.html","template/progressbar/progress.html","template/progressbar/progressbar.html","template/rating/rating.html","template/tabs/tab.html","template/tabs/tabset.html","template/timepicker/timepicker.html","template/typeahead/typeahead-match.html","template/typeahead/typeahead-popup.html"]),angular.module("ui.bootstrap.transition",[]).factory("$transition",["$q","$timeout","$rootScope",function(a,b,c){function d(a){for(var b in a)if(void 0!==f.style[b])return a[b]}var e=function(d,f,g){g=g||{};var h=a.defer(),i=e[g.animation?"animationEndEventName":"transitionEndEventName"],j=function(){c.$apply(function(){d.unbind(i,j),h.resolve(d)})};return i&&d.bind(i,j),b(function(){angular.isString(f)?d.addClass(f):angular.isFunction(f)?f(d):angular.isObject(f)&&d.css(f),i||h.resolve(d)}),h.promise.cancel=function(){i&&d.unbind(i,j),h.reject("Transition cancelled")},h.promise},f=document.createElement("trans"),g={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd",transition:"transitionend"},h={WebkitTransition:"webkitAnimationEnd",MozTransition:"animationend",OTransition:"oAnimationEnd",transition:"animationend"};return e.transitionEndEventName=d(g),e.animationEndEventName=d(h),e}]),angular.module("ui.bootstrap.collapse",["ui.bootstrap.transition"]).directive("collapse",["$transition",function(a){return{link:function(b,c,d){function e(b){function d(){j===e&&(j=void 0)}var e=a(c,b);return j&&j.cancel(),j=e,e.then(d,d),e}function f(){k?(k=!1,g()):(c.removeClass("collapse").addClass("collapsing"),e({height:c[0].scrollHeight+"px"}).then(g))}function g(){c.removeClass("collapsing"),c.addClass("collapse in"),c.css({height:"auto"})}function h(){if(k)k=!1,i(),c.css({height:0});else{c.css({height:c[0].scrollHeight+"px"});{c[0].offsetWidth}c.removeClass("collapse in").addClass("collapsing"),e({height:0}).then(i)}}function i(){c.removeClass("collapsing"),c.addClass("collapse")}var j,k=!0;b.$watch(d.collapse,function(a){a?h():f()})}}}]),angular.module("ui.bootstrap.accordion",["ui.bootstrap.collapse"]).constant("accordionConfig",{closeOthers:!0}).controller("AccordionController",["$scope","$attrs","accordionConfig",function(a,b,c){this.groups=[],this.closeOthers=function(d){var e=angular.isDefined(b.closeOthers)?a.$eval(b.closeOthers):c.closeOthers;e&&angular.forEach(this.groups,function(a){a!==d&&(a.isOpen=!1)})},this.addGroup=function(a){var b=this;this.groups.push(a),a.$on("$destroy",function(){b.removeGroup(a)})},this.removeGroup=function(a){var b=this.groups.indexOf(a);-1!==b&&this.groups.splice(b,1)}}]).directive("accordion",function(){return{restrict:"EA",controller:"AccordionController",transclude:!0,replace:!1,templateUrl:"template/accordion/accordion.html"}}).directive("accordionGroup",function(){return{require:"^accordion",restrict:"EA",transclude:!0,replace:!0,templateUrl:"template/accordion/accordion-group.html",scope:{heading:"@",isOpen:"=?",isDisabled:"=?"},controller:function(){this.setHeading=function(a){this.heading=a}},link:function(a,b,c,d){d.addGroup(a),a.$watch("isOpen",function(b){b&&d.closeOthers(a)}),a.toggleOpen=function(){a.isDisabled||(a.isOpen=!a.isOpen)}}}}).directive("accordionHeading",function(){return{restrict:"EA",transclude:!0,template:"",replace:!0,require:"^accordionGroup",link:function(a,b,c,d,e){d.setHeading(e(a,function(){}))}}}).directive("accordionTransclude",function(){return{require:"^accordionGroup",link:function(a,b,c,d){a.$watch(function(){return d[c.accordionTransclude]},function(a){a&&(b.html(""),b.append(a))})}}}),angular.module("ui.bootstrap.alert",[]).controller("AlertController",["$scope","$attrs",function(a,b){a.closeable="close"in b,this.close=a.close}]).directive("alert",function(){return{restrict:"EA",controller:"AlertController",templateUrl:"template/alert/alert.html",transclude:!0,replace:!0,scope:{type:"@",close:"&"}}}).directive("dismissOnTimeout",["$timeout",function(a){return{require:"alert",link:function(b,c,d,e){a(function(){e.close()},parseInt(d.dismissOnTimeout,10))}}}]),angular.module("ui.bootstrap.bindHtml",[]).directive("bindHtmlUnsafe",function(){return function(a,b,c){b.addClass("ng-binding").data("$binding",c.bindHtmlUnsafe),a.$watch(c.bindHtmlUnsafe,function(a){b.html(a||"")})}}),angular.module("ui.bootstrap.buttons",[]).constant("buttonConfig",{activeClass:"active",toggleEvent:"click"}).controller("ButtonsController",["buttonConfig",function(a){this.activeClass=a.activeClass||"active",this.toggleEvent=a.toggleEvent||"click"}]).directive("btnRadio",function(){return{require:["btnRadio","ngModel"],controller:"ButtonsController",link:function(a,b,c,d){var e=d[0],f=d[1];f.$render=function(){b.toggleClass(e.activeClass,angular.equals(f.$modelValue,a.$eval(c.btnRadio)))},b.bind(e.toggleEvent,function(){var d=b.hasClass(e.activeClass);(!d||angular.isDefined(c.uncheckable))&&a.$apply(function(){f.$setViewValue(d?null:a.$eval(c.btnRadio)),f.$render()})})}}}).directive("btnCheckbox",function(){return{require:["btnCheckbox","ngModel"],controller:"ButtonsController",link:function(a,b,c,d){function e(){return g(c.btnCheckboxTrue,!0)}function f(){return g(c.btnCheckboxFalse,!1)}function g(b,c){var d=a.$eval(b);return angular.isDefined(d)?d:c}var h=d[0],i=d[1];i.$render=function(){b.toggleClass(h.activeClass,angular.equals(i.$modelValue,e()))},b.bind(h.toggleEvent,function(){a.$apply(function(){i.$setViewValue(b.hasClass(h.activeClass)?f():e()),i.$render()})})}}}),angular.module("ui.bootstrap.carousel",["ui.bootstrap.transition"]).controller("CarouselController",["$scope","$timeout","$interval","$transition",function(a,b,c,d){function e(){f();var b=+a.interval;!isNaN(b)&&b>0&&(h=c(g,b))}function f(){h&&(c.cancel(h),h=null)}function g(){var b=+a.interval;i&&!isNaN(b)&&b>0?a.next():a.pause()}var h,i,j=this,k=j.slides=a.slides=[],l=-1;j.currentSlide=null;var m=!1;j.select=a.select=function(c,f){function g(){if(!m){if(j.currentSlide&&angular.isString(f)&&!a.noTransition&&c.$element){c.$element.addClass(f);{c.$element[0].offsetWidth}angular.forEach(k,function(a){angular.extend(a,{direction:"",entering:!1,leaving:!1,active:!1})}),angular.extend(c,{direction:f,active:!0,entering:!0}),angular.extend(j.currentSlide||{},{direction:f,leaving:!0}),a.$currentTransition=d(c.$element,{}),function(b,c){a.$currentTransition.then(function(){h(b,c)},function(){h(b,c)})}(c,j.currentSlide)}else h(c,j.currentSlide);j.currentSlide=c,l=i,e()}}function h(b,c){angular.extend(b,{direction:"",active:!0,leaving:!1,entering:!1}),angular.extend(c||{},{direction:"",active:!1,leaving:!1,entering:!1}),a.$currentTransition=null}var i=k.indexOf(c);void 0===f&&(f=i>l?"next":"prev"),c&&c!==j.currentSlide&&(a.$currentTransition?(a.$currentTransition.cancel(),b(g)):g())},a.$on("$destroy",function(){m=!0}),j.indexOfSlide=function(a){return k.indexOf(a)},a.next=function(){var b=(l+1)%k.length;return a.$currentTransition?void 0:j.select(k[b],"next")},a.prev=function(){var b=0>l-1?k.length-1:l-1;return a.$currentTransition?void 0:j.select(k[b],"prev")},a.isActive=function(a){return j.currentSlide===a},a.$watch("interval",e),a.$on("$destroy",f),a.play=function(){i||(i=!0,e())},a.pause=function(){a.noPause||(i=!1,f())},j.addSlide=function(b,c){b.$element=c,k.push(b),1===k.length||b.active?(j.select(k[k.length-1]),1==k.length&&a.play()):b.active=!1},j.removeSlide=function(a){var b=k.indexOf(a);k.splice(b,1),k.length>0&&a.active?j.select(b>=k.length?k[b-1]:k[b]):l>b&&l--}}]).directive("carousel",[function(){return{restrict:"EA",transclude:!0,replace:!0,controller:"CarouselController",require:"carousel",templateUrl:"template/carousel/carousel.html",scope:{interval:"=",noTransition:"=",noPause:"="}}}]).directive("slide",function(){return{require:"^carousel",restrict:"EA",transclude:!0,replace:!0,templateUrl:"template/carousel/slide.html",scope:{active:"=?"},link:function(a,b,c,d){d.addSlide(a,b),a.$on("$destroy",function(){d.removeSlide(a)}),a.$watch("active",function(b){b&&d.select(a)})}}}),angular.module("ui.bootstrap.dateparser",[]).service("dateParser",["$locale","orderByFilter",function(a,b){function c(a){var c=[],d=a.split("");return angular.forEach(e,function(b,e){var f=a.indexOf(e);if(f>-1){a=a.split(""),d[f]="("+b.regex+")",a[f]="$";for(var g=f+1,h=f+e.length;h>g;g++)d[g]="",a[g]="$";a=a.join(""),c.push({index:f,apply:b.apply})}}),{regex:new RegExp("^"+d.join("")+"$"),map:b(c,"index")}}function d(a,b,c){return 1===b&&c>28?29===c&&(a%4===0&&a%100!==0||a%400===0):3===b||5===b||8===b||10===b?31>c:!0}this.parsers={};var e={yyyy:{regex:"\\d{4}",apply:function(a){this.year=+a}},yy:{regex:"\\d{2}",apply:function(a){this.year=+a+2e3}},y:{regex:"\\d{1,4}",apply:function(a){this.year=+a}},MMMM:{regex:a.DATETIME_FORMATS.MONTH.join("|"),apply:function(b){this.month=a.DATETIME_FORMATS.MONTH.indexOf(b)}},MMM:{regex:a.DATETIME_FORMATS.SHORTMONTH.join("|"),apply:function(b){this.month=a.DATETIME_FORMATS.SHORTMONTH.indexOf(b)}},MM:{regex:"0[1-9]|1[0-2]",apply:function(a){this.month=a-1}},M:{regex:"[1-9]|1[0-2]",apply:function(a){this.month=a-1}},dd:{regex:"[0-2][0-9]{1}|3[0-1]{1}",apply:function(a){this.date=+a}},d:{regex:"[1-2]?[0-9]{1}|3[0-1]{1}",apply:function(a){this.date=+a}},EEEE:{regex:a.DATETIME_FORMATS.DAY.join("|")},EEE:{regex:a.DATETIME_FORMATS.SHORTDAY.join("|")}};this.parse=function(b,e){if(!angular.isString(b)||!e)return b;e=a.DATETIME_FORMATS[e]||e,this.parsers[e]||(this.parsers[e]=c(e));var f=this.parsers[e],g=f.regex,h=f.map,i=b.match(g);if(i&&i.length){for(var j,k={year:1900,month:0,date:1,hours:0},l=1,m=i.length;m>l;l++){var n=h[l-1];n.apply&&n.apply.call(k,i[l])}return d(k.year,k.month,k.date)&&(j=new Date(k.year,k.month,k.date,k.hours)),j}}}]),angular.module("ui.bootstrap.position",[]).factory("$position",["$document","$window",function(a,b){function c(a,c){return a.currentStyle?a.currentStyle[c]:b.getComputedStyle?b.getComputedStyle(a)[c]:a.style[c]}function d(a){return"static"===(c(a,"position")||"static")}var e=function(b){for(var c=a[0],e=b.offsetParent||c;e&&e!==c&&d(e);)e=e.offsetParent;return e||c};return{position:function(b){var c=this.offset(b),d={top:0,left:0},f=e(b[0]);f!=a[0]&&(d=this.offset(angular.element(f)),d.top+=f.clientTop-f.scrollTop,d.left+=f.clientLeft-f.scrollLeft);var g=b[0].getBoundingClientRect();return{width:g.width||b.prop("offsetWidth"),height:g.height||b.prop("offsetHeight"),top:c.top-d.top,left:c.left-d.left}},offset:function(c){var d=c[0].getBoundingClientRect();return{width:d.width||c.prop("offsetWidth"),height:d.height||c.prop("offsetHeight"),top:d.top+(b.pageYOffset||a[0].documentElement.scrollTop),left:d.left+(b.pageXOffset||a[0].documentElement.scrollLeft)}},positionElements:function(a,b,c,d){var e,f,g,h,i=c.split("-"),j=i[0],k=i[1]||"center";e=d?this.offset(a):this.position(a),f=b.prop("offsetWidth"),g=b.prop("offsetHeight");var l={center:function(){return e.left+e.width/2-f/2},left:function(){return e.left},right:function(){return e.left+e.width}},m={center:function(){return e.top+e.height/2-g/2},top:function(){return e.top},bottom:function(){return e.top+e.height}};switch(j){case"right":h={top:m[k](),left:l[j]()};break;case"left":h={top:m[k](),left:e.left-f};break;case"bottom":h={top:m[j](),left:l[k]()};break;default:h={top:e.top-g,left:l[k]()}}return h}}}]),angular.module("ui.bootstrap.datepicker",["ui.bootstrap.dateparser","ui.bootstrap.position"]).constant("datepickerConfig",{formatDay:"dd",formatMonth:"MMMM",formatYear:"yyyy",formatDayHeader:"EEE",formatDayTitle:"MMMM yyyy",formatMonthTitle:"yyyy",datepickerMode:"day",minMode:"day",maxMode:"year",showWeeks:!0,startingDay:0,yearRange:20,minDate:null,maxDate:null}).controller("DatepickerController",["$scope","$attrs","$parse","$interpolate","$timeout","$log","dateFilter","datepickerConfig",function(a,b,c,d,e,f,g,h){var i=this,j={$setViewValue:angular.noop};this.modes=["day","month","year"],angular.forEach(["formatDay","formatMonth","formatYear","formatDayHeader","formatDayTitle","formatMonthTitle","minMode","maxMode","showWeeks","startingDay","yearRange"],function(c,e){i[c]=angular.isDefined(b[c])?8>e?d(b[c])(a.$parent):a.$parent.$eval(b[c]):h[c]}),angular.forEach(["minDate","maxDate"],function(d){b[d]?a.$parent.$watch(c(b[d]),function(a){i[d]=a?new Date(a):null,i.refreshView()}):i[d]=h[d]?new Date(h[d]):null}),a.datepickerMode=a.datepickerMode||h.datepickerMode,a.uniqueId="datepicker-"+a.$id+"-"+Math.floor(1e4*Math.random()),this.activeDate=angular.isDefined(b.initDate)?a.$parent.$eval(b.initDate):new Date,a.isActive=function(b){return 0===i.compare(b.date,i.activeDate)?(a.activeDateId=b.uid,!0):!1},this.init=function(a){j=a,j.$render=function(){i.render()}},this.render=function(){if(j.$modelValue){var a=new Date(j.$modelValue),b=!isNaN(a);b?this.activeDate=a:f.error('Datepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.'),j.$setValidity("date",b)}this.refreshView()},this.refreshView=function(){if(this.element){this._refreshView();var a=j.$modelValue?new Date(j.$modelValue):null;j.$setValidity("date-disabled",!a||this.element&&!this.isDisabled(a))}},this.createDateObject=function(a,b){var c=j.$modelValue?new Date(j.$modelValue):null;return{date:a,label:g(a,b),selected:c&&0===this.compare(a,c),disabled:this.isDisabled(a),current:0===this.compare(a,new Date)}},this.isDisabled=function(c){return this.minDate&&this.compare(c,this.minDate)<0||this.maxDate&&this.compare(c,this.maxDate)>0||b.dateDisabled&&a.dateDisabled({date:c,mode:a.datepickerMode})},this.split=function(a,b){for(var c=[];a.length>0;)c.push(a.splice(0,b));return c},a.select=function(b){if(a.datepickerMode===i.minMode){var c=j.$modelValue?new Date(j.$modelValue):new Date(0,0,0,0,0,0,0);c.setFullYear(b.getFullYear(),b.getMonth(),b.getDate()),j.$setViewValue(c),j.$render()}else i.activeDate=b,a.datepickerMode=i.modes[i.modes.indexOf(a.datepickerMode)-1]},a.move=function(a){var b=i.activeDate.getFullYear()+a*(i.step.years||0),c=i.activeDate.getMonth()+a*(i.step.months||0);i.activeDate.setFullYear(b,c,1),i.refreshView()},a.toggleMode=function(b){b=b||1,a.datepickerMode===i.maxMode&&1===b||a.datepickerMode===i.minMode&&-1===b||(a.datepickerMode=i.modes[i.modes.indexOf(a.datepickerMode)+b])},a.keys={13:"enter",32:"space",33:"pageup",34:"pagedown",35:"end",36:"home",37:"left",38:"up",39:"right",40:"down"};var k=function(){e(function(){i.element[0].focus()},0,!1)};a.$on("datepicker.focus",k),a.keydown=function(b){var c=a.keys[b.which];if(c&&!b.shiftKey&&!b.altKey)if(b.preventDefault(),b.stopPropagation(),"enter"===c||"space"===c){if(i.isDisabled(i.activeDate))return;a.select(i.activeDate),k()}else!b.ctrlKey||"up"!==c&&"down"!==c?(i.handleKeyDown(c,b),i.refreshView()):(a.toggleMode("up"===c?1:-1),k())}}]).directive("datepicker",function(){return{restrict:"EA",replace:!0,templateUrl:"template/datepicker/datepicker.html",scope:{datepickerMode:"=?",dateDisabled:"&"},require:["datepicker","?^ngModel"],controller:"DatepickerController",link:function(a,b,c,d){var e=d[0],f=d[1];f&&e.init(f)}}}).directive("daypicker",["dateFilter",function(a){return{restrict:"EA",replace:!0,templateUrl:"template/datepicker/day.html",require:"^datepicker",link:function(b,c,d,e){function f(a,b){return 1!==b||a%4!==0||a%100===0&&a%400!==0?i[b]:29}function g(a,b){var c=new Array(b),d=new Date(a),e=0;for(d.setHours(12);b>e;)c[e++]=new Date(d),d.setDate(d.getDate()+1);return c}function h(a){var b=new Date(a);b.setDate(b.getDate()+4-(b.getDay()||7));var c=b.getTime();return b.setMonth(0),b.setDate(1),Math.floor(Math.round((c-b)/864e5)/7)+1}b.showWeeks=e.showWeeks,e.step={months:1},e.element=c;var i=[31,28,31,30,31,30,31,31,30,31,30,31];e._refreshView=function(){var c=e.activeDate.getFullYear(),d=e.activeDate.getMonth(),f=new Date(c,d,1),i=e.startingDay-f.getDay(),j=i>0?7-i:-i,k=new Date(f);j>0&&k.setDate(-j+1);for(var l=g(k,42),m=0;42>m;m++)l[m]=angular.extend(e.createDateObject(l[m],e.formatDay),{secondary:l[m].getMonth()!==d,uid:b.uniqueId+"-"+m});b.labels=new Array(7);for(var n=0;7>n;n++)b.labels[n]={abbr:a(l[n].date,e.formatDayHeader),full:a(l[n].date,"EEEE")};if(b.title=a(e.activeDate,e.formatDayTitle),b.rows=e.split(l,7),b.showWeeks){b.weekNumbers=[];for(var o=h(b.rows[0][0].date),p=b.rows.length;b.weekNumbers.push(o++)<p;);}},e.compare=function(a,b){return new Date(a.getFullYear(),a.getMonth(),a.getDate())-new Date(b.getFullYear(),b.getMonth(),b.getDate())},e.handleKeyDown=function(a){var b=e.activeDate.getDate();if("left"===a)b-=1;else if("up"===a)b-=7;else if("right"===a)b+=1;else if("down"===a)b+=7;else if("pageup"===a||"pagedown"===a){var c=e.activeDate.getMonth()+("pageup"===a?-1:1);e.activeDate.setMonth(c,1),b=Math.min(f(e.activeDate.getFullYear(),e.activeDate.getMonth()),b)}else"home"===a?b=1:"end"===a&&(b=f(e.activeDate.getFullYear(),e.activeDate.getMonth()));e.activeDate.setDate(b)},e.refreshView()}}}]).directive("monthpicker",["dateFilter",function(a){return{restrict:"EA",replace:!0,templateUrl:"template/datepicker/month.html",require:"^datepicker",link:function(b,c,d,e){e.step={years:1},e.element=c,e._refreshView=function(){for(var c=new Array(12),d=e.activeDate.getFullYear(),f=0;12>f;f++)c[f]=angular.extend(e.createDateObject(new Date(d,f,1),e.formatMonth),{uid:b.uniqueId+"-"+f});b.title=a(e.activeDate,e.formatMonthTitle),b.rows=e.split(c,3)},e.compare=function(a,b){return new Date(a.getFullYear(),a.getMonth())-new Date(b.getFullYear(),b.getMonth())},e.handleKeyDown=function(a){var b=e.activeDate.getMonth();if("left"===a)b-=1;else if("up"===a)b-=3;else if("right"===a)b+=1;else if("down"===a)b+=3;else if("pageup"===a||"pagedown"===a){var c=e.activeDate.getFullYear()+("pageup"===a?-1:1);e.activeDate.setFullYear(c)}else"home"===a?b=0:"end"===a&&(b=11);e.activeDate.setMonth(b)},e.refreshView()}}}]).directive("yearpicker",["dateFilter",function(){return{restrict:"EA",replace:!0,templateUrl:"template/datepicker/year.html",require:"^datepicker",link:function(a,b,c,d){function e(a){return parseInt((a-1)/f,10)*f+1}var f=d.yearRange;d.step={years:f},d.element=b,d._refreshView=function(){for(var b=new Array(f),c=0,g=e(d.activeDate.getFullYear());f>c;c++)b[c]=angular.extend(d.createDateObject(new Date(g+c,0,1),d.formatYear),{uid:a.uniqueId+"-"+c});a.title=[b[0].label,b[f-1].label].join(" - "),a.rows=d.split(b,5)},d.compare=function(a,b){return a.getFullYear()-b.getFullYear()},d.handleKeyDown=function(a){var b=d.activeDate.getFullYear();"left"===a?b-=1:"up"===a?b-=5:"right"===a?b+=1:"down"===a?b+=5:"pageup"===a||"pagedown"===a?b+=("pageup"===a?-1:1)*d.step.years:"home"===a?b=e(d.activeDate.getFullYear()):"end"===a&&(b=e(d.activeDate.getFullYear())+f-1),d.activeDate.setFullYear(b)},d.refreshView()}}}]).constant("datepickerPopupConfig",{datepickerPopup:"yyyy-MM-dd",currentText:"Today",clearText:"Clear",closeText:"Done",closeOnDateSelection:!0,appendToBody:!1,showButtonBar:!0}).directive("datepickerPopup",["$compile","$parse","$document","$position","dateFilter","dateParser","datepickerPopupConfig",function(a,b,c,d,e,f,g){return{restrict:"EA",require:"ngModel",scope:{isOpen:"=?",currentText:"@",clearText:"@",closeText:"@",dateDisabled:"&"},link:function(h,i,j,k){function l(a){return a.replace(/([A-Z])/g,function(a){return"-"+a.toLowerCase()})}function m(a){if(a){if(angular.isDate(a)&&!isNaN(a))return k.$setValidity("date",!0),a;if(angular.isString(a)){var b=f.parse(a,n)||new Date(a);return isNaN(b)?void k.$setValidity("date",!1):(k.$setValidity("date",!0),b)}return void k.$setValidity("date",!1)}return k.$setValidity("date",!0),null}var n,o=angular.isDefined(j.closeOnDateSelection)?h.$parent.$eval(j.closeOnDateSelection):g.closeOnDateSelection,p=angular.isDefined(j.datepickerAppendToBody)?h.$parent.$eval(j.datepickerAppendToBody):g.appendToBody;h.showButtonBar=angular.isDefined(j.showButtonBar)?h.$parent.$eval(j.showButtonBar):g.showButtonBar,h.getText=function(a){return h[a+"Text"]||g[a+"Text"]},j.$observe("datepickerPopup",function(a){n=a||g.datepickerPopup,k.$render()});var q=angular.element("<div datepicker-popup-wrap><div datepicker></div></div>");q.attr({"ng-model":"date","ng-change":"dateSelection()"});var r=angular.element(q.children()[0]);j.datepickerOptions&&angular.forEach(h.$parent.$eval(j.datepickerOptions),function(a,b){r.attr(l(b),a)}),h.watchData={},angular.forEach(["minDate","maxDate","datepickerMode"],function(a){if(j[a]){var c=b(j[a]);if(h.$parent.$watch(c,function(b){h.watchData[a]=b}),r.attr(l(a),"watchData."+a),"datepickerMode"===a){var d=c.assign;h.$watch("watchData."+a,function(a,b){a!==b&&d(h.$parent,a)})}}}),j.dateDisabled&&r.attr("date-disabled","dateDisabled({ date: date, mode: mode })"),k.$parsers.unshift(m),h.dateSelection=function(a){angular.isDefined(a)&&(h.date=a),k.$setViewValue(h.date),k.$render(),o&&(h.isOpen=!1,i[0].focus())},i.bind("input change keyup",function(){h.$apply(function(){h.date=k.$modelValue})}),k.$render=function(){var a=k.$viewValue?e(k.$viewValue,n):"";i.val(a),h.date=m(k.$modelValue)};var s=function(a){h.isOpen&&a.target!==i[0]&&h.$apply(function(){h.isOpen=!1})},t=function(a){h.keydown(a)};i.bind("keydown",t),h.keydown=function(a){27===a.which?(a.preventDefault(),a.stopPropagation(),h.close()):40!==a.which||h.isOpen||(h.isOpen=!0)},h.$watch("isOpen",function(a){a?(h.$broadcast("datepicker.focus"),h.position=p?d.offset(i):d.position(i),h.position.top=h.position.top+i.prop("offsetHeight"),c.bind("click",s)):c.unbind("click",s)}),h.select=function(a){if("today"===a){var b=new Date;angular.isDate(k.$modelValue)?(a=new Date(k.$modelValue),a.setFullYear(b.getFullYear(),b.getMonth(),b.getDate())):a=new Date(b.setHours(0,0,0,0))}h.dateSelection(a)},h.close=function(){h.isOpen=!1,i[0].focus()};var u=a(q)(h);q.remove(),p?c.find("body").append(u):i.after(u),h.$on("$destroy",function(){u.remove(),i.unbind("keydown",t),c.unbind("click",s)})}}}]).directive("datepickerPopupWrap",function(){return{restrict:"EA",replace:!0,transclude:!0,templateUrl:"template/datepicker/popup.html",link:function(a,b){b.bind("click",function(a){a.preventDefault(),a.stopPropagation()})}}}),angular.module("ui.bootstrap.dropdown",[]).constant("dropdownConfig",{openClass:"open"}).service("dropdownService",["$document",function(a){var b=null;this.open=function(e){b||(a.bind("click",c),a.bind("keydown",d)),b&&b!==e&&(b.isOpen=!1),b=e},this.close=function(e){b===e&&(b=null,a.unbind("click",c),a.unbind("keydown",d))};var c=function(a){if(b){var c=b.getToggleElement();a&&c&&c[0].contains(a.target)||b.$apply(function(){b.isOpen=!1})}},d=function(a){27===a.which&&(b.focusToggleElement(),c())}}]).controller("DropdownController",["$scope","$attrs","$parse","dropdownConfig","dropdownService","$animate",function(a,b,c,d,e,f){var g,h=this,i=a.$new(),j=d.openClass,k=angular.noop,l=b.onToggle?c(b.onToggle):angular.noop;this.init=function(d){h.$element=d,b.isOpen&&(g=c(b.isOpen),k=g.assign,a.$watch(g,function(a){i.isOpen=!!a}))},this.toggle=function(a){return i.isOpen=arguments.length?!!a:!i.isOpen},this.isOpen=function(){return i.isOpen},i.getToggleElement=function(){return h.toggleElement},i.focusToggleElement=function(){h.toggleElement&&h.toggleElement[0].focus()},i.$watch("isOpen",function(b,c){f[b?"addClass":"removeClass"](h.$element,j),b?(i.focusToggleElement(),e.open(i)):e.close(i),k(a,b),angular.isDefined(b)&&b!==c&&l(a,{open:!!b})}),a.$on("$locationChangeSuccess",function(){i.isOpen=!1}),a.$on("$destroy",function(){i.$destroy()})}]).directive("dropdown",function(){return{controller:"DropdownController",link:function(a,b,c,d){d.init(b)}}}).directive("dropdownToggle",function(){return{require:"?^dropdown",link:function(a,b,c,d){if(d){d.toggleElement=b;var e=function(e){e.preventDefault(),b.hasClass("disabled")||c.disabled||a.$apply(function(){d.toggle()})};b.bind("click",e),b.attr({"aria-haspopup":!0,"aria-expanded":!1}),a.$watch(d.isOpen,function(a){b.attr("aria-expanded",!!a)}),a.$on("$destroy",function(){b.unbind("click",e)})}}}}),angular.module("ui.bootstrap.modal",["ui.bootstrap.transition"]).factory("$$stackedMap",function(){return{createNew:function(){var a=[];return{add:function(b,c){a.push({key:b,value:c})},get:function(b){for(var c=0;c<a.length;c++)if(b==a[c].key)return a[c]},keys:function(){for(var b=[],c=0;c<a.length;c++)b.push(a[c].key);return b},top:function(){return a[a.length-1]},remove:function(b){for(var c=-1,d=0;d<a.length;d++)if(b==a[d].key){c=d;break}return a.splice(c,1)[0]},removeTop:function(){return a.splice(a.length-1,1)[0]},length:function(){return a.length}}}}}).directive("modalBackdrop",["$timeout",function(a){return{restrict:"EA",replace:!0,templateUrl:"template/modal/backdrop.html",link:function(b,c,d){b.backdropClass=d.backdropClass||"",b.animate=!1,a(function(){b.animate=!0})}}}]).directive("modalWindow",["$modalStack","$timeout",function(a,b){return{restrict:"EA",scope:{index:"@",animate:"="},replace:!0,transclude:!0,templateUrl:function(a,b){return b.templateUrl||"template/modal/window.html"},link:function(c,d,e){d.addClass(e.windowClass||""),c.size=e.size,b(function(){c.animate=!0,d[0].querySelectorAll("[autofocus]").length||d[0].focus()}),c.close=function(b){var c=a.getTop();c&&c.value.backdrop&&"static"!=c.value.backdrop&&b.target===b.currentTarget&&(b.preventDefault(),b.stopPropagation(),a.dismiss(c.key,"backdrop click"))}}}}]).directive("modalTransclude",function(){return{link:function(a,b,c,d,e){e(a.$parent,function(a){b.empty(),b.append(a)})}}}).factory("$modalStack",["$transition","$timeout","$document","$compile","$rootScope","$$stackedMap",function(a,b,c,d,e,f){function g(){for(var a=-1,b=n.keys(),c=0;c<b.length;c++)n.get(b[c]).value.backdrop&&(a=c);return a}function h(a){var b=c.find("body").eq(0),d=n.get(a).value;n.remove(a),j(d.modalDomEl,d.modalScope,300,function(){d.modalScope.$destroy(),b.toggleClass(m,n.length()>0),i()})}function i(){if(k&&-1==g()){var a=l;j(k,l,150,function(){a.$destroy(),a=null}),k=void 0,l=void 0}}function j(c,d,e,f){function g(){g.done||(g.done=!0,c.remove(),f&&f())}d.animate=!1;var h=a.transitionEndEventName;if(h){var i=b(g,e);c.bind(h,function(){b.cancel(i),g(),d.$apply()})}else b(g)}var k,l,m="modal-open",n=f.createNew(),o={};return e.$watch(g,function(a){l&&(l.index=a)}),c.bind("keydown",function(a){var b;27===a.which&&(b=n.top(),b&&b.value.keyboard&&(a.preventDefault(),e.$apply(function(){o.dismiss(b.key,"escape key press")})))}),o.open=function(a,b){n.add(a,{deferred:b.deferred,modalScope:b.scope,backdrop:b.backdrop,keyboard:b.keyboard});var f=c.find("body").eq(0),h=g();if(h>=0&&!k){l=e.$new(!0),l.index=h;var i=angular.element("<div modal-backdrop></div>");i.attr("backdrop-class",b.backdropClass),k=d(i)(l),f.append(k)}var j=angular.element("<div modal-window></div>");j.attr({"template-url":b.windowTemplateUrl,"window-class":b.windowClass,size:b.size,index:n.length()-1,animate:"animate"}).html(b.content);var o=d(j)(b.scope);n.top().value.modalDomEl=o,f.append(o),f.addClass(m)},o.close=function(a,b){var c=n.get(a);c&&(c.value.deferred.resolve(b),h(a))},o.dismiss=function(a,b){var c=n.get(a);c&&(c.value.deferred.reject(b),h(a))},o.dismissAll=function(a){for(var b=this.getTop();b;)this.dismiss(b.key,a),b=this.getTop()},o.getTop=function(){return n.top()},o}]).provider("$modal",function(){var a={options:{backdrop:!0,keyboard:!0},$get:["$injector","$rootScope","$q","$http","$templateCache","$controller","$modalStack",function(b,c,d,e,f,g,h){function i(a){return a.template?d.when(a.template):e.get(angular.isFunction(a.templateUrl)?a.templateUrl():a.templateUrl,{cache:f}).then(function(a){return a.data})}function j(a){var c=[];return angular.forEach(a,function(a){(angular.isFunction(a)||angular.isArray(a))&&c.push(d.when(b.invoke(a)))}),c}var k={};return k.open=function(b){var e=d.defer(),f=d.defer(),k={result:e.promise,opened:f.promise,close:function(a){h.close(k,a)},dismiss:function(a){h.dismiss(k,a)}};if(b=angular.extend({},a.options,b),b.resolve=b.resolve||{},!b.template&&!b.templateUrl)throw new Error("One of template or templateUrl options is required.");var l=d.all([i(b)].concat(j(b.resolve)));return l.then(function(a){var d=(b.scope||c).$new();d.$close=k.close,d.$dismiss=k.dismiss;var f,i={},j=1;b.controller&&(i.$scope=d,i.$modalInstance=k,angular.forEach(b.resolve,function(b,c){i[c]=a[j++]}),f=g(b.controller,i),b.controllerAs&&(d[b.controllerAs]=f)),h.open(k,{scope:d,deferred:e,content:a[0],backdrop:b.backdrop,keyboard:b.keyboard,backdropClass:b.backdropClass,windowClass:b.windowClass,windowTemplateUrl:b.windowTemplateUrl,size:b.size})},function(a){e.reject(a)}),l.then(function(){f.resolve(!0)},function(){f.reject(!1)}),k},k}]};return a}),angular.module("ui.bootstrap.pagination",[]).controller("PaginationController",["$scope","$attrs","$parse",function(a,b,c){var d=this,e={$setViewValue:angular.noop},f=b.numPages?c(b.numPages).assign:angular.noop;this.init=function(f,g){e=f,this.config=g,e.$render=function(){d.render()},b.itemsPerPage?a.$parent.$watch(c(b.itemsPerPage),function(b){d.itemsPerPage=parseInt(b,10),a.totalPages=d.calculateTotalPages()}):this.itemsPerPage=g.itemsPerPage},this.calculateTotalPages=function(){var b=this.itemsPerPage<1?1:Math.ceil(a.totalItems/this.itemsPerPage);return Math.max(b||0,1)},this.render=function(){a.page=parseInt(e.$viewValue,10)||1},a.selectPage=function(b){a.page!==b&&b>0&&b<=a.totalPages&&(e.$setViewValue(b),e.$render())},a.getText=function(b){return a[b+"Text"]||d.config[b+"Text"]},a.noPrevious=function(){return 1===a.page},a.noNext=function(){return a.page===a.totalPages},a.$watch("totalItems",function(){a.totalPages=d.calculateTotalPages()}),a.$watch("totalPages",function(b){f(a.$parent,b),a.page>b?a.selectPage(b):e.$render()})}]).constant("paginationConfig",{itemsPerPage:10,boundaryLinks:!1,directionLinks:!0,firstText:"First",previousText:"Previous",nextText:"Next",lastText:"Last",rotate:!0}).directive("pagination",["$parse","paginationConfig",function(a,b){return{restrict:"EA",scope:{totalItems:"=",firstText:"@",previousText:"@",nextText:"@",lastText:"@"},require:["pagination","?ngModel"],controller:"PaginationController",templateUrl:"template/pagination/pagination.html",replace:!0,link:function(c,d,e,f){function g(a,b,c){return{number:a,text:b,active:c}}function h(a,b){var c=[],d=1,e=b,f=angular.isDefined(k)&&b>k;f&&(l?(d=Math.max(a-Math.floor(k/2),1),e=d+k-1,e>b&&(e=b,d=e-k+1)):(d=(Math.ceil(a/k)-1)*k+1,e=Math.min(d+k-1,b)));for(var h=d;e>=h;h++){var i=g(h,h,h===a);c.push(i)}if(f&&!l){if(d>1){var j=g(d-1,"...",!1);c.unshift(j)}if(b>e){var m=g(e+1,"...",!1);c.push(m)}}return c}var i=f[0],j=f[1];if(j){var k=angular.isDefined(e.maxSize)?c.$parent.$eval(e.maxSize):b.maxSize,l=angular.isDefined(e.rotate)?c.$parent.$eval(e.rotate):b.rotate;c.boundaryLinks=angular.isDefined(e.boundaryLinks)?c.$parent.$eval(e.boundaryLinks):b.boundaryLinks,c.directionLinks=angular.isDefined(e.directionLinks)?c.$parent.$eval(e.directionLinks):b.directionLinks,i.init(j,b),e.maxSize&&c.$parent.$watch(a(e.maxSize),function(a){k=parseInt(a,10),i.render()
});var m=i.render;i.render=function(){m(),c.page>0&&c.page<=c.totalPages&&(c.pages=h(c.page,c.totalPages))}}}}}]).constant("pagerConfig",{itemsPerPage:10,previousText:"« Previous",nextText:"Next »",align:!0}).directive("pager",["pagerConfig",function(a){return{restrict:"EA",scope:{totalItems:"=",previousText:"@",nextText:"@"},require:["pager","?ngModel"],controller:"PaginationController",templateUrl:"template/pagination/pager.html",replace:!0,link:function(b,c,d,e){var f=e[0],g=e[1];g&&(b.align=angular.isDefined(d.align)?b.$parent.$eval(d.align):a.align,f.init(g,a))}}}]),angular.module("ui.bootstrap.tooltip",["ui.bootstrap.position","ui.bootstrap.bindHtml"]).provider("$tooltip",function(){function a(a){var b=/[A-Z]/g,c="-";return a.replace(b,function(a,b){return(b?c:"")+a.toLowerCase()})}var b={placement:"top",animation:!0,popupDelay:0},c={mouseenter:"mouseleave",click:"click",focus:"blur"},d={};this.options=function(a){angular.extend(d,a)},this.setTriggers=function(a){angular.extend(c,a)},this.$get=["$window","$compile","$timeout","$document","$position","$interpolate",function(e,f,g,h,i,j){return function(e,k,l){function m(a){var b=a||n.trigger||l,d=c[b]||b;return{show:b,hide:d}}var n=angular.extend({},b,d),o=a(e),p=j.startSymbol(),q=j.endSymbol(),r="<div "+o+'-popup title="'+p+"title"+q+'" content="'+p+"content"+q+'" placement="'+p+"placement"+q+'" animation="animation" is-open="isOpen"></div>';return{restrict:"EA",compile:function(){var a=f(r);return function(b,c,d){function f(){D.isOpen?l():j()}function j(){(!C||b.$eval(d[k+"Enable"]))&&(s(),D.popupDelay?z||(z=g(o,D.popupDelay,!1),z.then(function(a){a()})):o()())}function l(){b.$apply(function(){p()})}function o(){return z=null,y&&(g.cancel(y),y=null),D.content?(q(),w.css({top:0,left:0,display:"block"}),A?h.find("body").append(w):c.after(w),E(),D.isOpen=!0,D.$digest(),E):angular.noop}function p(){D.isOpen=!1,g.cancel(z),z=null,D.animation?y||(y=g(r,500)):r()}function q(){w&&r(),x=D.$new(),w=a(x,angular.noop)}function r(){y=null,w&&(w.remove(),w=null),x&&(x.$destroy(),x=null)}function s(){t(),u()}function t(){var a=d[k+"Placement"];D.placement=angular.isDefined(a)?a:n.placement}function u(){var a=d[k+"PopupDelay"],b=parseInt(a,10);D.popupDelay=isNaN(b)?n.popupDelay:b}function v(){var a=d[k+"Trigger"];F(),B=m(a),B.show===B.hide?c.bind(B.show,f):(c.bind(B.show,j),c.bind(B.hide,l))}var w,x,y,z,A=angular.isDefined(n.appendToBody)?n.appendToBody:!1,B=m(void 0),C=angular.isDefined(d[k+"Enable"]),D=b.$new(!0),E=function(){var a=i.positionElements(c,w,D.placement,A);a.top+="px",a.left+="px",w.css(a)};D.isOpen=!1,d.$observe(e,function(a){D.content=a,!a&&D.isOpen&&p()}),d.$observe(k+"Title",function(a){D.title=a});var F=function(){c.unbind(B.show,j),c.unbind(B.hide,l)};v();var G=b.$eval(d[k+"Animation"]);D.animation=angular.isDefined(G)?!!G:n.animation;var H=b.$eval(d[k+"AppendToBody"]);A=angular.isDefined(H)?H:A,A&&b.$on("$locationChangeSuccess",function(){D.isOpen&&p()}),b.$on("$destroy",function(){g.cancel(y),g.cancel(z),F(),r(),D=null})}}}}}]}).directive("tooltipPopup",function(){return{restrict:"EA",replace:!0,scope:{content:"@",placement:"@",animation:"&",isOpen:"&"},templateUrl:"template/tooltip/tooltip-popup.html"}}).directive("tooltip",["$tooltip",function(a){return a("tooltip","tooltip","mouseenter")}]).directive("tooltipHtmlUnsafePopup",function(){return{restrict:"EA",replace:!0,scope:{content:"@",placement:"@",animation:"&",isOpen:"&"},templateUrl:"template/tooltip/tooltip-html-unsafe-popup.html"}}).directive("tooltipHtmlUnsafe",["$tooltip",function(a){return a("tooltipHtmlUnsafe","tooltip","mouseenter")}]),angular.module("ui.bootstrap.popover",["ui.bootstrap.tooltip"]).directive("popoverPopup",function(){return{restrict:"EA",replace:!0,scope:{title:"@",content:"@",placement:"@",animation:"&",isOpen:"&"},templateUrl:"template/popover/popover.html"}}).directive("popover",["$tooltip",function(a){return a("popover","popover","click")}]),angular.module("ui.bootstrap.progressbar",[]).constant("progressConfig",{animate:!0,max:100}).controller("ProgressController",["$scope","$attrs","progressConfig",function(a,b,c){var d=this,e=angular.isDefined(b.animate)?a.$parent.$eval(b.animate):c.animate;this.bars=[],a.max=angular.isDefined(b.max)?a.$parent.$eval(b.max):c.max,this.addBar=function(b,c){e||c.css({transition:"none"}),this.bars.push(b),b.$watch("value",function(c){b.percent=+(100*c/a.max).toFixed(2)}),b.$on("$destroy",function(){c=null,d.removeBar(b)})},this.removeBar=function(a){this.bars.splice(this.bars.indexOf(a),1)}}]).directive("progress",function(){return{restrict:"EA",replace:!0,transclude:!0,controller:"ProgressController",require:"progress",scope:{},templateUrl:"template/progressbar/progress.html"}}).directive("bar",function(){return{restrict:"EA",replace:!0,transclude:!0,require:"^progress",scope:{value:"=",type:"@"},templateUrl:"template/progressbar/bar.html",link:function(a,b,c,d){d.addBar(a,b)}}}).directive("progressbar",function(){return{restrict:"EA",replace:!0,transclude:!0,controller:"ProgressController",scope:{value:"=",type:"@"},templateUrl:"template/progressbar/progressbar.html",link:function(a,b,c,d){d.addBar(a,angular.element(b.children()[0]))}}}),angular.module("ui.bootstrap.rating",[]).constant("ratingConfig",{max:5,stateOn:null,stateOff:null}).controller("RatingController",["$scope","$attrs","ratingConfig",function(a,b,c){var d={$setViewValue:angular.noop};this.init=function(e){d=e,d.$render=this.render,this.stateOn=angular.isDefined(b.stateOn)?a.$parent.$eval(b.stateOn):c.stateOn,this.stateOff=angular.isDefined(b.stateOff)?a.$parent.$eval(b.stateOff):c.stateOff;var f=angular.isDefined(b.ratingStates)?a.$parent.$eval(b.ratingStates):new Array(angular.isDefined(b.max)?a.$parent.$eval(b.max):c.max);a.range=this.buildTemplateObjects(f)},this.buildTemplateObjects=function(a){for(var b=0,c=a.length;c>b;b++)a[b]=angular.extend({index:b},{stateOn:this.stateOn,stateOff:this.stateOff},a[b]);return a},a.rate=function(b){!a.readonly&&b>=0&&b<=a.range.length&&(d.$setViewValue(b),d.$render())},a.enter=function(b){a.readonly||(a.value=b),a.onHover({value:b})},a.reset=function(){a.value=d.$viewValue,a.onLeave()},a.onKeydown=function(b){/(37|38|39|40)/.test(b.which)&&(b.preventDefault(),b.stopPropagation(),a.rate(a.value+(38===b.which||39===b.which?1:-1)))},this.render=function(){a.value=d.$viewValue}}]).directive("rating",function(){return{restrict:"EA",require:["rating","ngModel"],scope:{readonly:"=?",onHover:"&",onLeave:"&"},controller:"RatingController",templateUrl:"template/rating/rating.html",replace:!0,link:function(a,b,c,d){var e=d[0],f=d[1];f&&e.init(f)}}}),angular.module("ui.bootstrap.tabs",[]).controller("TabsetController",["$scope",function(a){var b=this,c=b.tabs=a.tabs=[];b.select=function(a){angular.forEach(c,function(b){b.active&&b!==a&&(b.active=!1,b.onDeselect())}),a.active=!0,a.onSelect()},b.addTab=function(a){c.push(a),1===c.length?a.active=!0:a.active&&b.select(a)},b.removeTab=function(a){var e=c.indexOf(a);if(a.active&&c.length>1&&!d){var f=e==c.length-1?e-1:e+1;b.select(c[f])}c.splice(e,1)};var d;a.$on("$destroy",function(){d=!0})}]).directive("tabset",function(){return{restrict:"EA",transclude:!0,replace:!0,scope:{type:"@"},controller:"TabsetController",templateUrl:"template/tabs/tabset.html",link:function(a,b,c){a.vertical=angular.isDefined(c.vertical)?a.$parent.$eval(c.vertical):!1,a.justified=angular.isDefined(c.justified)?a.$parent.$eval(c.justified):!1}}}).directive("tab",["$parse",function(a){return{require:"^tabset",restrict:"EA",replace:!0,templateUrl:"template/tabs/tab.html",transclude:!0,scope:{active:"=?",heading:"@",onSelect:"&select",onDeselect:"&deselect"},controller:function(){},compile:function(b,c,d){return function(b,c,e,f){b.$watch("active",function(a){a&&f.select(b)}),b.disabled=!1,e.disabled&&b.$parent.$watch(a(e.disabled),function(a){b.disabled=!!a}),b.select=function(){b.disabled||(b.active=!0)},f.addTab(b),b.$on("$destroy",function(){f.removeTab(b)}),b.$transcludeFn=d}}}}]).directive("tabHeadingTransclude",[function(){return{restrict:"A",require:"^tab",link:function(a,b){a.$watch("headingElement",function(a){a&&(b.html(""),b.append(a))})}}}]).directive("tabContentTransclude",function(){function a(a){return a.tagName&&(a.hasAttribute("tab-heading")||a.hasAttribute("data-tab-heading")||"tab-heading"===a.tagName.toLowerCase()||"data-tab-heading"===a.tagName.toLowerCase())}return{restrict:"A",require:"^tabset",link:function(b,c,d){var e=b.$eval(d.tabContentTransclude);e.$transcludeFn(e.$parent,function(b){angular.forEach(b,function(b){a(b)?e.headingElement=b:c.append(b)})})}}}),angular.module("ui.bootstrap.timepicker",[]).constant("timepickerConfig",{hourStep:1,minuteStep:1,showMeridian:!0,meridians:null,readonlyInput:!1,mousewheel:!0}).controller("TimepickerController",["$scope","$attrs","$parse","$log","$locale","timepickerConfig",function(a,b,c,d,e,f){function g(){var b=parseInt(a.hours,10),c=a.showMeridian?b>0&&13>b:b>=0&&24>b;return c?(a.showMeridian&&(12===b&&(b=0),a.meridian===p[1]&&(b+=12)),b):void 0}function h(){var b=parseInt(a.minutes,10);return b>=0&&60>b?b:void 0}function i(a){return angular.isDefined(a)&&a.toString().length<2?"0"+a:a}function j(a){k(),o.$setViewValue(new Date(n)),l(a)}function k(){o.$setValidity("time",!0),a.invalidHours=!1,a.invalidMinutes=!1}function l(b){var c=n.getHours(),d=n.getMinutes();a.showMeridian&&(c=0===c||12===c?12:c%12),a.hours="h"===b?c:i(c),a.minutes="m"===b?d:i(d),a.meridian=n.getHours()<12?p[0]:p[1]}function m(a){var b=new Date(n.getTime()+6e4*a);n.setHours(b.getHours(),b.getMinutes()),j()}var n=new Date,o={$setViewValue:angular.noop},p=angular.isDefined(b.meridians)?a.$parent.$eval(b.meridians):f.meridians||e.DATETIME_FORMATS.AMPMS;this.init=function(c,d){o=c,o.$render=this.render;var e=d.eq(0),g=d.eq(1),h=angular.isDefined(b.mousewheel)?a.$parent.$eval(b.mousewheel):f.mousewheel;h&&this.setupMousewheelEvents(e,g),a.readonlyInput=angular.isDefined(b.readonlyInput)?a.$parent.$eval(b.readonlyInput):f.readonlyInput,this.setupInputEvents(e,g)};var q=f.hourStep;b.hourStep&&a.$parent.$watch(c(b.hourStep),function(a){q=parseInt(a,10)});var r=f.minuteStep;b.minuteStep&&a.$parent.$watch(c(b.minuteStep),function(a){r=parseInt(a,10)}),a.showMeridian=f.showMeridian,b.showMeridian&&a.$parent.$watch(c(b.showMeridian),function(b){if(a.showMeridian=!!b,o.$error.time){var c=g(),d=h();angular.isDefined(c)&&angular.isDefined(d)&&(n.setHours(c),j())}else l()}),this.setupMousewheelEvents=function(b,c){var d=function(a){a.originalEvent&&(a=a.originalEvent);var b=a.wheelDelta?a.wheelDelta:-a.deltaY;return a.detail||b>0};b.bind("mousewheel wheel",function(b){a.$apply(d(b)?a.incrementHours():a.decrementHours()),b.preventDefault()}),c.bind("mousewheel wheel",function(b){a.$apply(d(b)?a.incrementMinutes():a.decrementMinutes()),b.preventDefault()})},this.setupInputEvents=function(b,c){if(a.readonlyInput)return a.updateHours=angular.noop,void(a.updateMinutes=angular.noop);var d=function(b,c){o.$setViewValue(null),o.$setValidity("time",!1),angular.isDefined(b)&&(a.invalidHours=b),angular.isDefined(c)&&(a.invalidMinutes=c)};a.updateHours=function(){var a=g();angular.isDefined(a)?(n.setHours(a),j("h")):d(!0)},b.bind("blur",function(){!a.invalidHours&&a.hours<10&&a.$apply(function(){a.hours=i(a.hours)})}),a.updateMinutes=function(){var a=h();angular.isDefined(a)?(n.setMinutes(a),j("m")):d(void 0,!0)},c.bind("blur",function(){!a.invalidMinutes&&a.minutes<10&&a.$apply(function(){a.minutes=i(a.minutes)})})},this.render=function(){var a=o.$modelValue?new Date(o.$modelValue):null;isNaN(a)?(o.$setValidity("time",!1),d.error('Timepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.')):(a&&(n=a),k(),l())},a.incrementHours=function(){m(60*q)},a.decrementHours=function(){m(60*-q)},a.incrementMinutes=function(){m(r)},a.decrementMinutes=function(){m(-r)},a.toggleMeridian=function(){m(720*(n.getHours()<12?1:-1))}}]).directive("timepicker",function(){return{restrict:"EA",require:["timepicker","?^ngModel"],controller:"TimepickerController",replace:!0,scope:{},templateUrl:"template/timepicker/timepicker.html",link:function(a,b,c,d){var e=d[0],f=d[1];f&&e.init(f,b.find("input"))}}}),angular.module("ui.bootstrap.typeahead",["ui.bootstrap.position","ui.bootstrap.bindHtml"]).factory("typeaheadParser",["$parse",function(a){var b=/^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w\d]*))\s+in\s+([\s\S]+?)$/;return{parse:function(c){var d=c.match(b);if(!d)throw new Error('Expected typeahead specification in form of "_modelValue_ (as _label_)? for _item_ in _collection_" but got "'+c+'".');return{itemName:d[3],source:a(d[4]),viewMapper:a(d[2]||d[1]),modelMapper:a(d[1])}}}}]).directive("typeahead",["$compile","$parse","$q","$timeout","$document","$position","typeaheadParser",function(a,b,c,d,e,f,g){var h=[9,13,27,38,40];return{require:"ngModel",link:function(i,j,k,l){var m,n=i.$eval(k.typeaheadMinLength)||1,o=i.$eval(k.typeaheadWaitMs)||0,p=i.$eval(k.typeaheadEditable)!==!1,q=b(k.typeaheadLoading).assign||angular.noop,r=b(k.typeaheadOnSelect),s=k.typeaheadInputFormatter?b(k.typeaheadInputFormatter):void 0,t=k.typeaheadAppendToBody?i.$eval(k.typeaheadAppendToBody):!1,u=i.$eval(k.typeaheadFocusFirst)!==!1,v=b(k.ngModel).assign,w=g.parse(k.typeahead),x=i.$new();i.$on("$destroy",function(){x.$destroy()});var y="typeahead-"+x.$id+"-"+Math.floor(1e4*Math.random());j.attr({"aria-autocomplete":"list","aria-expanded":!1,"aria-owns":y});var z=angular.element("<div typeahead-popup></div>");z.attr({id:y,matches:"matches",active:"activeIdx",select:"select(activeIdx)",query:"query",position:"position"}),angular.isDefined(k.typeaheadTemplateUrl)&&z.attr("template-url",k.typeaheadTemplateUrl);var A=function(){x.matches=[],x.activeIdx=-1,j.attr("aria-expanded",!1)},B=function(a){return y+"-option-"+a};x.$watch("activeIdx",function(a){0>a?j.removeAttr("aria-activedescendant"):j.attr("aria-activedescendant",B(a))});var C=function(a){var b={$viewValue:a};q(i,!0),c.when(w.source(i,b)).then(function(c){var d=a===l.$viewValue;if(d&&m)if(c.length>0){x.activeIdx=u?0:-1,x.matches.length=0;for(var e=0;e<c.length;e++)b[w.itemName]=c[e],x.matches.push({id:B(e),label:w.viewMapper(x,b),model:c[e]});x.query=a,x.position=t?f.offset(j):f.position(j),x.position.top=x.position.top+j.prop("offsetHeight"),j.attr("aria-expanded",!0)}else A();d&&q(i,!1)},function(){A(),q(i,!1)})};A(),x.query=void 0;var D,E=function(a){D=d(function(){C(a)},o)},F=function(){D&&d.cancel(D)};l.$parsers.unshift(function(a){return m=!0,a&&a.length>=n?o>0?(F(),E(a)):C(a):(q(i,!1),F(),A()),p?a:a?void l.$setValidity("editable",!1):(l.$setValidity("editable",!0),a)}),l.$formatters.push(function(a){var b,c,d={};return s?(d.$model=a,s(i,d)):(d[w.itemName]=a,b=w.viewMapper(i,d),d[w.itemName]=void 0,c=w.viewMapper(i,d),b!==c?b:a)}),x.select=function(a){var b,c,e={};e[w.itemName]=c=x.matches[a].model,b=w.modelMapper(i,e),v(i,b),l.$setValidity("editable",!0),r(i,{$item:c,$model:b,$label:w.viewMapper(i,e)}),A(),d(function(){j[0].focus()},0,!1)},j.bind("keydown",function(a){0!==x.matches.length&&-1!==h.indexOf(a.which)&&(-1!=x.activeIdx||13!==a.which&&9!==a.which)&&(a.preventDefault(),40===a.which?(x.activeIdx=(x.activeIdx+1)%x.matches.length,x.$digest()):38===a.which?(x.activeIdx=(x.activeIdx>0?x.activeIdx:x.matches.length)-1,x.$digest()):13===a.which||9===a.which?x.$apply(function(){x.select(x.activeIdx)}):27===a.which&&(a.stopPropagation(),A(),x.$digest()))}),j.bind("blur",function(){m=!1});var G=function(a){j[0]!==a.target&&(A(),x.$digest())};e.bind("click",G),i.$on("$destroy",function(){e.unbind("click",G),t&&H.remove()});var H=a(z)(x);t?e.find("body").append(H):j.after(H)}}}]).directive("typeaheadPopup",function(){return{restrict:"EA",scope:{matches:"=",query:"=",active:"=",position:"=",select:"&"},replace:!0,templateUrl:"template/typeahead/typeahead-popup.html",link:function(a,b,c){a.templateUrl=c.templateUrl,a.isOpen=function(){return a.matches.length>0},a.isActive=function(b){return a.active==b},a.selectActive=function(b){a.active=b},a.selectMatch=function(b){a.select({activeIdx:b})}}}}).directive("typeaheadMatch",["$http","$templateCache","$compile","$parse",function(a,b,c,d){return{restrict:"EA",scope:{index:"=",match:"=",query:"="},link:function(e,f,g){var h=d(g.templateUrl)(e.$parent)||"template/typeahead/typeahead-match.html";a.get(h,{cache:b}).success(function(a){f.replaceWith(c(a.trim())(e))})}}}]).filter("typeaheadHighlight",function(){function a(a){return a.replace(/([.?*+^$[\]\\(){}|-])/g,"\\$1")}return function(b,c){return c?(""+b).replace(new RegExp(a(c),"gi"),"<strong>$&</strong>"):b}}),angular.module("template/accordion/accordion-group.html",[]).run(["$templateCache",function(a){a.put("template/accordion/accordion-group.html",'<div class="panel panel-default">\n  <div class="panel-heading">\n    <h4 class="panel-title">\n      <a href class="accordion-toggle" ng-click="toggleOpen()" accordion-transclude="heading"><span ng-class="{\'text-muted\': isDisabled}">{{heading}}</span></a>\n    </h4>\n  </div>\n  <div class="panel-collapse" collapse="!isOpen">\n	  <div class="panel-body" ng-transclude></div>\n  </div>\n</div>\n')}]),angular.module("template/accordion/accordion.html",[]).run(["$templateCache",function(a){a.put("template/accordion/accordion.html",'<div class="panel-group" ng-transclude></div>')}]),angular.module("template/alert/alert.html",[]).run(["$templateCache",function(a){a.put("template/alert/alert.html",'<div class="alert" ng-class="[\'alert-\' + (type || \'warning\'), closeable ? \'alert-dismissable\' : null]" role="alert">\n    <button ng-show="closeable" type="button" class="close" ng-click="close()">\n        <span aria-hidden="true">&times;</span>\n        <span class="sr-only">Close</span>\n    </button>\n    <div ng-transclude></div>\n</div>\n')}]),angular.module("template/carousel/carousel.html",[]).run(["$templateCache",function(a){a.put("template/carousel/carousel.html",'<div ng-mouseenter="pause()" ng-mouseleave="play()" class="carousel" ng-swipe-right="prev()" ng-swipe-left="next()">\n    <ol class="carousel-indicators" ng-show="slides.length > 1">\n        <li ng-repeat="slide in slides track by $index" ng-class="{active: isActive(slide)}" ng-click="select(slide)"></li>\n    </ol>\n    <div class="carousel-inner" ng-transclude></div>\n    <a class="left carousel-control" ng-click="prev()" ng-show="slides.length > 1"><span class="glyphicon glyphicon-chevron-left"></span></a>\n    <a class="right carousel-control" ng-click="next()" ng-show="slides.length > 1"><span class="glyphicon glyphicon-chevron-right"></span></a>\n</div>\n')}]),angular.module("template/carousel/slide.html",[]).run(["$templateCache",function(a){a.put("template/carousel/slide.html","<div ng-class=\"{\n    'active': leaving || (active && !entering),\n    'prev': (next || active) && direction=='prev',\n    'next': (next || active) && direction=='next',\n    'right': direction=='prev',\n    'left': direction=='next'\n  }\" class=\"item text-center\" ng-transclude></div>\n")}]),angular.module("template/datepicker/datepicker.html",[]).run(["$templateCache",function(a){a.put("template/datepicker/datepicker.html",'<div ng-switch="datepickerMode" role="application" ng-keydown="keydown($event)">\n  <daypicker ng-switch-when="day" tabindex="0"></daypicker>\n  <monthpicker ng-switch-when="month" tabindex="0"></monthpicker>\n  <yearpicker ng-switch-when="year" tabindex="0"></yearpicker>\n</div>')}]),angular.module("template/datepicker/day.html",[]).run(["$templateCache",function(a){a.put("template/datepicker/day.html",'<table role="grid" aria-labelledby="{{uniqueId}}-title" aria-activedescendant="{{activeDateId}}">\n  <thead>\n    <tr>\n      <th><button type="button" class="btn btn-default btn-sm pull-left" ng-click="move(-1)" tabindex="-1"><i class="glyphicon glyphicon-chevron-left"></i></button></th>\n      <th colspan="{{5 + showWeeks}}"><button id="{{uniqueId}}-title" role="heading" aria-live="assertive" aria-atomic="true" type="button" class="btn btn-default btn-sm" ng-click="toggleMode()" tabindex="-1" style="width:100%;"><strong>{{title}}</strong></button></th>\n      <th><button type="button" class="btn btn-default btn-sm pull-right" ng-click="move(1)" tabindex="-1"><i class="glyphicon glyphicon-chevron-right"></i></button></th>\n    </tr>\n    <tr>\n      <th ng-show="showWeeks" class="text-center"></th>\n      <th ng-repeat="label in labels track by $index" class="text-center"><small aria-label="{{label.full}}">{{label.abbr}}</small></th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr ng-repeat="row in rows track by $index">\n      <td ng-show="showWeeks" class="text-center h6"><em>{{ weekNumbers[$index] }}</em></td>\n      <td ng-repeat="dt in row track by dt.date" class="text-center" role="gridcell" id="{{dt.uid}}" aria-disabled="{{!!dt.disabled}}">\n        <button type="button" style="width:100%;" class="btn btn-default btn-sm" ng-class="{\'btn-info\': dt.selected, active: isActive(dt)}" ng-click="select(dt.date)" ng-disabled="dt.disabled" tabindex="-1"><span ng-class="{\'text-muted\': dt.secondary, \'text-info\': dt.current}">{{dt.label}}</span></button>\n      </td>\n    </tr>\n  </tbody>\n</table>\n')}]),angular.module("template/datepicker/month.html",[]).run(["$templateCache",function(a){a.put("template/datepicker/month.html",'<table role="grid" aria-labelledby="{{uniqueId}}-title" aria-activedescendant="{{activeDateId}}">\n  <thead>\n    <tr>\n      <th><button type="button" class="btn btn-default btn-sm pull-left" ng-click="move(-1)" tabindex="-1"><i class="glyphicon glyphicon-chevron-left"></i></button></th>\n      <th><button id="{{uniqueId}}-title" role="heading" aria-live="assertive" aria-atomic="true" type="button" class="btn btn-default btn-sm" ng-click="toggleMode()" tabindex="-1" style="width:100%;"><strong>{{title}}</strong></button></th>\n      <th><button type="button" class="btn btn-default btn-sm pull-right" ng-click="move(1)" tabindex="-1"><i class="glyphicon glyphicon-chevron-right"></i></button></th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr ng-repeat="row in rows track by $index">\n      <td ng-repeat="dt in row track by dt.date" class="text-center" role="gridcell" id="{{dt.uid}}" aria-disabled="{{!!dt.disabled}}">\n        <button type="button" style="width:100%;" class="btn btn-default" ng-class="{\'btn-info\': dt.selected, active: isActive(dt)}" ng-click="select(dt.date)" ng-disabled="dt.disabled" tabindex="-1"><span ng-class="{\'text-info\': dt.current}">{{dt.label}}</span></button>\n      </td>\n    </tr>\n  </tbody>\n</table>\n')}]),angular.module("template/datepicker/popup.html",[]).run(["$templateCache",function(a){a.put("template/datepicker/popup.html",'<ul class="dropdown-menu" ng-style="{display: (isOpen && \'block\') || \'none\', top: position.top+\'px\', left: position.left+\'px\'}" ng-keydown="keydown($event)">\n	<li ng-transclude></li>\n	<li ng-if="showButtonBar" style="padding:10px 9px 2px">\n		<span class="btn-group pull-left">\n			<button type="button" class="btn btn-sm btn-info" ng-click="select(\'today\')">{{ getText(\'current\') }}</button>\n			<button type="button" class="btn btn-sm btn-danger" ng-click="select(null)">{{ getText(\'clear\') }}</button>\n		</span>\n		<button type="button" class="btn btn-sm btn-success pull-right" ng-click="close()">{{ getText(\'close\') }}</button>\n	</li>\n</ul>\n')}]),angular.module("template/datepicker/year.html",[]).run(["$templateCache",function(a){a.put("template/datepicker/year.html",'<table role="grid" aria-labelledby="{{uniqueId}}-title" aria-activedescendant="{{activeDateId}}">\n  <thead>\n    <tr>\n      <th><button type="button" class="btn btn-default btn-sm pull-left" ng-click="move(-1)" tabindex="-1"><i class="glyphicon glyphicon-chevron-left"></i></button></th>\n      <th colspan="3"><button id="{{uniqueId}}-title" role="heading" aria-live="assertive" aria-atomic="true" type="button" class="btn btn-default btn-sm" ng-click="toggleMode()" tabindex="-1" style="width:100%;"><strong>{{title}}</strong></button></th>\n      <th><button type="button" class="btn btn-default btn-sm pull-right" ng-click="move(1)" tabindex="-1"><i class="glyphicon glyphicon-chevron-right"></i></button></th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr ng-repeat="row in rows track by $index">\n      <td ng-repeat="dt in row track by dt.date" class="text-center" role="gridcell" id="{{dt.uid}}" aria-disabled="{{!!dt.disabled}}">\n        <button type="button" style="width:100%;" class="btn btn-default" ng-class="{\'btn-info\': dt.selected, active: isActive(dt)}" ng-click="select(dt.date)" ng-disabled="dt.disabled" tabindex="-1"><span ng-class="{\'text-info\': dt.current}">{{dt.label}}</span></button>\n      </td>\n    </tr>\n  </tbody>\n</table>\n')}]),angular.module("template/modal/backdrop.html",[]).run(["$templateCache",function(a){a.put("template/modal/backdrop.html",'<div class="modal-backdrop fade {{ backdropClass }}"\n     ng-class="{in: animate}"\n     ng-style="{\'z-index\': 1040 + (index && 1 || 0) + index*10}"\n></div>\n')}]),angular.module("template/modal/window.html",[]).run(["$templateCache",function(a){a.put("template/modal/window.html",'<div tabindex="-1" role="dialog" class="modal fade" ng-class="{in: animate}" ng-style="{\'z-index\': 1050 + index*10, display: \'block\'}" ng-click="close($event)">\n    <div class="modal-dialog" ng-class="{\'modal-sm\': size == \'sm\', \'modal-lg\': size == \'lg\'}"><div class="modal-content" modal-transclude></div></div>\n</div>')}]),angular.module("template/pagination/pager.html",[]).run(["$templateCache",function(a){a.put("template/pagination/pager.html",'<ul class="pager">\n  <li ng-class="{disabled: noPrevious(), previous: align}"><a href ng-click="selectPage(page - 1)">{{getText(\'previous\')}}</a></li>\n  <li ng-class="{disabled: noNext(), next: align}"><a href ng-click="selectPage(page + 1)">{{getText(\'next\')}}</a></li>\n</ul>')}]),angular.module("template/pagination/pagination.html",[]).run(["$templateCache",function(a){a.put("template/pagination/pagination.html",'<ul class="pagination">\n  <li ng-if="boundaryLinks" ng-class="{disabled: noPrevious()}"><a href ng-click="selectPage(1)">{{getText(\'first\')}}</a></li>\n  <li ng-if="directionLinks" ng-class="{disabled: noPrevious()}"><a href ng-click="selectPage(page - 1)">{{getText(\'previous\')}}</a></li>\n  <li ng-repeat="page in pages track by $index" ng-class="{active: page.active}"><a href ng-click="selectPage(page.number)">{{page.text}}</a></li>\n  <li ng-if="directionLinks" ng-class="{disabled: noNext()}"><a href ng-click="selectPage(page + 1)">{{getText(\'next\')}}</a></li>\n  <li ng-if="boundaryLinks" ng-class="{disabled: noNext()}"><a href ng-click="selectPage(totalPages)">{{getText(\'last\')}}</a></li>\n</ul>')}]),angular.module("template/tooltip/tooltip-html-unsafe-popup.html",[]).run(["$templateCache",function(a){a.put("template/tooltip/tooltip-html-unsafe-popup.html",'<div class="tooltip {{placement}}" ng-class="{ in: isOpen(), fade: animation() }">\n  <div class="tooltip-arrow"></div>\n  <div class="tooltip-inner" bind-html-unsafe="content"></div>\n</div>\n')}]),angular.module("template/tooltip/tooltip-popup.html",[]).run(["$templateCache",function(a){a.put("template/tooltip/tooltip-popup.html",'<div class="tooltip {{placement}}" ng-class="{ in: isOpen(), fade: animation() }">\n  <div class="tooltip-arrow"></div>\n  <div class="tooltip-inner" ng-bind="content"></div>\n</div>\n')}]),angular.module("template/popover/popover.html",[]).run(["$templateCache",function(a){a.put("template/popover/popover.html",'<div class="popover {{placement}}" ng-class="{ in: isOpen(), fade: animation() }">\n  <div class="arrow"></div>\n\n  <div class="popover-inner">\n      <h3 class="popover-title" ng-bind="title" ng-show="title"></h3>\n      <div class="popover-content" ng-bind="content"></div>\n  </div>\n</div>\n')}]),angular.module("template/progressbar/bar.html",[]).run(["$templateCache",function(a){a.put("template/progressbar/bar.html",'<div class="progress-bar" ng-class="type && \'progress-bar-\' + type" role="progressbar" aria-valuenow="{{value}}" aria-valuemin="0" aria-valuemax="{{max}}" ng-style="{width: percent + \'%\'}" aria-valuetext="{{percent | number:0}}%" ng-transclude></div>')}]),angular.module("template/progressbar/progress.html",[]).run(["$templateCache",function(a){a.put("template/progressbar/progress.html",'<div class="progress" ng-transclude></div>')}]),angular.module("template/progressbar/progressbar.html",[]).run(["$templateCache",function(a){a.put("template/progressbar/progressbar.html",'<div class="progress">\n  <div class="progress-bar" ng-class="type && \'progress-bar-\' + type" role="progressbar" aria-valuenow="{{value}}" aria-valuemin="0" aria-valuemax="{{max}}" ng-style="{width: percent + \'%\'}" aria-valuetext="{{percent | number:0}}%" ng-transclude></div>\n</div>')}]),angular.module("template/rating/rating.html",[]).run(["$templateCache",function(a){a.put("template/rating/rating.html",'<span ng-mouseleave="reset()" ng-keydown="onKeydown($event)" tabindex="0" role="slider" aria-valuemin="0" aria-valuemax="{{range.length}}" aria-valuenow="{{value}}">\n    <i ng-repeat="r in range track by $index" ng-mouseenter="enter($index + 1)" ng-click="rate($index + 1)" class="glyphicon" ng-class="$index < value && (r.stateOn || \'glyphicon-star\') || (r.stateOff || \'glyphicon-star-empty\')">\n        <span class="sr-only">({{ $index < value ? \'*\' : \' \' }})</span>\n    </i>\n</span>')}]),angular.module("template/tabs/tab.html",[]).run(["$templateCache",function(a){a.put("template/tabs/tab.html",'<li ng-class="{active: active, disabled: disabled}">\n  <a href ng-click="select()" tab-heading-transclude>{{heading}}</a>\n</li>\n')}]),angular.module("template/tabs/tabset.html",[]).run(["$templateCache",function(a){a.put("template/tabs/tabset.html",'<div>\n  <ul class="nav nav-{{type || \'tabs\'}}" ng-class="{\'nav-stacked\': vertical, \'nav-justified\': justified}" ng-transclude></ul>\n  <div class="tab-content">\n    <div class="tab-pane" \n         ng-repeat="tab in tabs" \n         ng-class="{active: tab.active}"\n         tab-content-transclude="tab">\n    </div>\n  </div>\n</div>\n')}]),angular.module("template/timepicker/timepicker.html",[]).run(["$templateCache",function(a){a.put("template/timepicker/timepicker.html",'<table>\n	<tbody>\n		<tr class="text-center">\n			<td><a ng-click="incrementHours()" class="btn btn-link"><span class="glyphicon glyphicon-chevron-up"></span></a></td>\n			<td>&nbsp;</td>\n			<td><a ng-click="incrementMinutes()" class="btn btn-link"><span class="glyphicon glyphicon-chevron-up"></span></a></td>\n			<td ng-show="showMeridian"></td>\n		</tr>\n		<tr>\n			<td style="width:50px;" class="form-group" ng-class="{\'has-error\': invalidHours}">\n				<input type="text" ng-model="hours" ng-change="updateHours()" class="form-control text-center" ng-mousewheel="incrementHours()" ng-readonly="readonlyInput" maxlength="2">\n			</td>\n			<td>:</td>\n			<td style="width:50px;" class="form-group" ng-class="{\'has-error\': invalidMinutes}">\n				<input type="text" ng-model="minutes" ng-change="updateMinutes()" class="form-control text-center" ng-readonly="readonlyInput" maxlength="2">\n			</td>\n			<td ng-show="showMeridian"><button type="button" class="btn btn-default text-center" ng-click="toggleMeridian()">{{meridian}}</button></td>\n		</tr>\n		<tr class="text-center">\n			<td><a ng-click="decrementHours()" class="btn btn-link"><span class="glyphicon glyphicon-chevron-down"></span></a></td>\n			<td>&nbsp;</td>\n			<td><a ng-click="decrementMinutes()" class="btn btn-link"><span class="glyphicon glyphicon-chevron-down"></span></a></td>\n			<td ng-show="showMeridian"></td>\n		</tr>\n	</tbody>\n</table>\n')}]),angular.module("template/typeahead/typeahead-match.html",[]).run(["$templateCache",function(a){a.put("template/typeahead/typeahead-match.html",'<a tabindex="-1" bind-html-unsafe="match.label | typeaheadHighlight:query"></a>')
}]),angular.module("template/typeahead/typeahead-popup.html",[]).run(["$templateCache",function(a){a.put("template/typeahead/typeahead-popup.html",'<ul class="dropdown-menu" ng-show="isOpen()" ng-style="{top: position.top+\'px\', left: position.left+\'px\'}" style="display: block;" role="listbox" aria-hidden="{{!isOpen()}}">\n    <li ng-repeat="match in matches track by $index" ng-class="{active: isActive($index) }" ng-mouseenter="selectActive($index)" ng-click="selectMatch($index)" role="option" id="{{match.id}}">\n        <div typeahead-match index="$index" match="match" query="query" template-url="templateUrl"></div>\n    </li>\n</ul>\n')}]);/* vtt.js - v0.12.1 (https://github.com/mozilla/vtt.js) built on 21-03-2015 */

/**
 * Copyright 2013 vtt.js Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root) {

  var autoKeyword = "auto";
  var directionSetting = {
    "": true,
    "lr": true,
    "rl": true
  };
  var alignSetting = {
    "start": true,
    "middle": true,
    "end": true,
    "left": true,
    "right": true
  };

  function findDirectionSetting(value) {
    if (typeof value !== "string") {
      return false;
    }
    var dir = directionSetting[value.toLowerCase()];
    return dir ? value.toLowerCase() : false;
  }

  function findAlignSetting(value) {
    if (typeof value !== "string") {
      return false;
    }
    var align = alignSetting[value.toLowerCase()];
    return align ? value.toLowerCase() : false;
  }

  function extend(obj) {
    var i = 1;
    for (; i < arguments.length; i++) {
      var cobj = arguments[i];
      for (var p in cobj) {
        obj[p] = cobj[p];
      }
    }

    return obj;
  }
}(this));

/**
 * Copyright 2013 vtt.js Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root) {

  var scrollSetting = {
    "": true,
    "up": true
  };

  function findScrollSetting(value) {
    if (typeof value !== "string") {
      return false;
    }
    var scroll = scrollSetting[value.toLowerCase()];
    return scroll ? value.toLowerCase() : false;
  }

  function isValidPercentValue(value) {
    return typeof value === "number" && (value >= 0 && value <= 100);
  }

  // VTTRegion shim http://dev.w3.org/html5/webvtt/#vttregion-interface
  function VTTRegion() {
    var _width = 100;
    var _lines = 3;
    var _regionAnchorX = 0;
    var _regionAnchorY = 100;
    var _viewportAnchorX = 0;
    var _viewportAnchorY = 100;
    var _scroll = "";

    Object.defineProperties(this, {
      "width": {
        enumerable: true,
        get: function() {
          return _width;
        },
        set: function(value) {
          if (!isValidPercentValue(value)) {
            throw new Error("Width must be between 0 and 100.");
          }
          _width = value;
        }
      },
      "lines": {
        enumerable: true,
        get: function() {
          return _lines;
        },
        set: function(value) {
          if (typeof value !== "number") {
            throw new TypeError("Lines must be set to a number.");
          }
          _lines = value;
        }
      },
      "regionAnchorY": {
        enumerable: true,
        get: function() {
          return _regionAnchorY;
        },
        set: function(value) {
          if (!isValidPercentValue(value)) {
            throw new Error("RegionAnchorX must be between 0 and 100.");
          }
          _regionAnchorY = value;
        }
      },
      "regionAnchorX": {
        enumerable: true,
        get: function() {
          return _regionAnchorX;
        },
        set: function(value) {
          if(!isValidPercentValue(value)) {
            throw new Error("RegionAnchorY must be between 0 and 100.");
          }
          _regionAnchorX = value;
        }
      },
      "viewportAnchorY": {
        enumerable: true,
        get: function() {
          return _viewportAnchorY;
        },
        set: function(value) {
          if (!isValidPercentValue(value)) {
            throw new Error("ViewportAnchorY must be between 0 and 100.");
          }
          _viewportAnchorY = value;
        }
      },
      "viewportAnchorX": {
        enumerable: true,
        get: function() {
          return _viewportAnchorX;
        },
        set: function(value) {
          if (!isValidPercentValue(value)) {
            throw new Error("ViewportAnchorX must be between 0 and 100.");
          }
          _viewportAnchorX = value;
        }
      },
      "scroll": {
        enumerable: true,
        get: function() {
          return _scroll;
        },
        set: function(value) {
          var setting = findScrollSetting(value);
          // Have to check for false as an empty string is a legal value.
          if (setting === false) {
            throw new SyntaxError("An invalid or illegal string was specified.");
          }
          _scroll = setting;
        }
      }
    });
  }

  root.VTTRegion = root.VTTRegion || VTTRegion;
}(this));

/**
 * Copyright 2013 vtt.js Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* -*- Mode: Java; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */

(function(global) {

  var _objCreate = Object.create || (function() {
    function F() {}
    return function(o) {
      if (arguments.length !== 1) {
        throw new Error('Object.create shim only accepts one parameter.');
      }
      F.prototype = o;
      return new F();
    };
  })();

  // Creates a new ParserError object from an errorData object. The errorData
  // object should have default code and message properties. The default message
  // property can be overriden by passing in a message parameter.
  // See ParsingError.Errors below for acceptable errors.
  function ParsingError(errorData, message) {
    this.name = "ParsingError";
    this.code = errorData.code;
    this.message = message || errorData.message;
  }
  ParsingError.prototype = _objCreate(Error.prototype);
  ParsingError.prototype.constructor = ParsingError;

  // ParsingError metadata for acceptable ParsingErrors.
  ParsingError.Errors = {
    BadSignature: {
      code: 0,
      message: "Malformed WebVTT signature."
    },
    BadTimeStamp: {
      code: 1,
      message: "Malformed time stamp."
    }
  };

  // Try to parse input as a time stamp.
  function parseTimeStamp(input) {

    function computeSeconds(h, m, s, f) {
      return (h | 0) * 3600 + (m | 0) * 60 + (s | 0) + (f | 0) / 1000;
    }

    var m = input.match(/^(\d+):(\d{2})(:\d{2})?\.(\d{3})/);
    if (!m) {
      return null;
    }

    if (m[3]) {
      // Timestamp takes the form of [hours]:[minutes]:[seconds].[milliseconds]
      return computeSeconds(m[1], m[2], m[3].replace(":", ""), m[4]);
    } else if (m[1] > 59) {
      // Timestamp takes the form of [hours]:[minutes].[milliseconds]
      // First position is hours as it's over 59.
      return computeSeconds(m[1], m[2], 0,  m[4]);
    } else {
      // Timestamp takes the form of [minutes]:[seconds].[milliseconds]
      return computeSeconds(0, m[1], m[2], m[4]);
    }
  }

  // A settings object holds key/value pairs and will ignore anything but the first
  // assignment to a specific key.
  function Settings() {
    this.values = _objCreate(null);
  }

  Settings.prototype = {
    // Only accept the first assignment to any key.
    set: function(k, v) {
      if (!this.get(k) && v !== "") {
        this.values[k] = v;
      }
    },
    // Return the value for a key, or a default value.
    // If 'defaultKey' is passed then 'dflt' is assumed to be an object with
    // a number of possible default values as properties where 'defaultKey' is
    // the key of the property that will be chosen; otherwise it's assumed to be
    // a single value.
    get: function(k, dflt, defaultKey) {
      if (defaultKey) {
        return this.has(k) ? this.values[k] : dflt[defaultKey];
      }
      return this.has(k) ? this.values[k] : dflt;
    },
    // Check whether we have a value for a key.
    has: function(k) {
      return k in this.values;
    },
    // Accept a setting if its one of the given alternatives.
    alt: function(k, v, a) {
      for (var n = 0; n < a.length; ++n) {
        if (v === a[n]) {
          this.set(k, v);
          break;
        }
      }
    },
    // Accept a setting if its a valid (signed) integer.
    integer: function(k, v) {
      if (/^-?\d+$/.test(v)) { // integer
        this.set(k, parseInt(v, 10));
      }
    },
    // Accept a setting if its a valid percentage.
    percent: function(k, v) {
      var m;
      if ((m = v.match(/^([\d]{1,3})(\.[\d]*)?%$/))) {
        v = parseFloat(v);
        if (v >= 0 && v <= 100) {
          this.set(k, v);
          return true;
        }
      }
      return false;
    }
  };

  // Helper function to parse input into groups separated by 'groupDelim', and
  // interprete each group as a key/value pair separated by 'keyValueDelim'.
  function parseOptions(input, callback, keyValueDelim, groupDelim) {
    var groups = groupDelim ? input.split(groupDelim) : [input];
    for (var i in groups) {
      if (typeof groups[i] !== "string") {
        continue;
      }
      var kv = groups[i].split(keyValueDelim);
      if (kv.length !== 2) {
        continue;
      }
      var k = kv[0];
      var v = kv[1];
      callback(k, v);
    }
  }

  function parseCue(input, cue, regionList) {
    // Remember the original input if we need to throw an error.
    var oInput = input;
    // 4.1 WebVTT timestamp
    function consumeTimeStamp() {
      var ts = parseTimeStamp(input);
      if (ts === null) {
        throw new ParsingError(ParsingError.Errors.BadTimeStamp,
                              "Malformed timestamp: " + oInput);
      }
      // Remove time stamp from input.
      input = input.replace(/^[^\sa-zA-Z-]+/, "");
      return ts;
    }

    // 4.4.2 WebVTT cue settings
    function consumeCueSettings(input, cue) {
      var settings = new Settings();

      parseOptions(input, function (k, v) {
        switch (k) {
        case "region":
          // Find the last region we parsed with the same region id.
          for (var i = regionList.length - 1; i >= 0; i--) {
            if (regionList[i].id === v) {
              settings.set(k, regionList[i].region);
              break;
            }
          }
          break;
        case "vertical":
          settings.alt(k, v, ["rl", "lr"]);
          break;
        case "line":
          var vals = v.split(","),
              vals0 = vals[0];
          settings.integer(k, vals0);
          settings.percent(k, vals0) ? settings.set("snapToLines", false) : null;
          settings.alt(k, vals0, ["auto"]);
          if (vals.length === 2) {
            settings.alt("lineAlign", vals[1], ["start", "middle", "end"]);
          }
          break;
        case "position":
          vals = v.split(",");
          settings.percent(k, vals[0]);
          if (vals.length === 2) {
            settings.alt("positionAlign", vals[1], ["start", "middle", "end"]);
          }
          break;
        case "size":
          settings.percent(k, v);
          break;
        case "align":
          settings.alt(k, v, ["start", "middle", "end", "left", "right"]);
          break;
        }
      }, /:/, /\s/);

      // Apply default values for any missing fields.
      cue.region = settings.get("region", null);
      cue.vertical = settings.get("vertical", "");
      cue.line = settings.get("line", "auto");
      cue.lineAlign = settings.get("lineAlign", "start");
      cue.snapToLines = settings.get("snapToLines", true);
      cue.size = settings.get("size", 100);
      cue.align = settings.get("align", "middle");
      cue.position = settings.get("position", {
        start: 0,
        left: 0,
        middle: 50,
        end: 100,
        right: 100
      }, cue.align);
      cue.positionAlign = settings.get("positionAlign", {
        start: "start",
        left: "start",
        middle: "middle",
        end: "end",
        right: "end"
      }, cue.align);
    }

    function skipWhitespace() {
      input = input.replace(/^\s+/, "");
    }

    // 4.1 WebVTT cue timings.
    skipWhitespace();
    cue.startTime = consumeTimeStamp();   // (1) collect cue start time
    skipWhitespace();
    if (input.substr(0, 3) !== "-->") {     // (3) next characters must match "-->"
      throw new ParsingError(ParsingError.Errors.BadTimeStamp,
                             "Malformed time stamp (time stamps must be separated by '-->'): " +
                             oInput);
    }
    input = input.substr(3);
    skipWhitespace();
    cue.endTime = consumeTimeStamp();     // (5) collect cue end time

    // 4.1 WebVTT cue settings list.
    skipWhitespace();
    consumeCueSettings(input, cue);
  }

  var ESCAPE = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&lrm;": "\u200e",
    "&rlm;": "\u200f",
    "&nbsp;": "\u00a0"
  };

  var TAG_NAME = {
    c: "span",
    i: "i",
    b: "b",
    u: "u",
    ruby: "ruby",
    rt: "rt",
    v: "span",
    lang: "span"
  };

  var TAG_ANNOTATION = {
    v: "title",
    lang: "lang"
  };

  var NEEDS_PARENT = {
    rt: "ruby"
  };

  // Parse content into a document fragment.
  function parseContent(window, input) {
    function nextToken() {
      // Check for end-of-string.
      if (!input) {
        return null;
      }

      // Consume 'n' characters from the input.
      function consume(result) {
        input = input.substr(result.length);
        return result;
      }

      var m = input.match(/^([^<]*)(<[^>]+>?)?/);
      // If there is some text before the next tag, return it, otherwise return
      // the tag.
      return consume(m[1] ? m[1] : m[2]);
    }

    // Unescape a string 's'.
    function unescape1(e) {
      return ESCAPE[e];
    }
    function unescape(s) {
      while ((m = s.match(/&(amp|lt|gt|lrm|rlm|nbsp);/))) {
        s = s.replace(m[0], unescape1);
      }
      return s;
    }

    function shouldAdd(current, element) {
      return !NEEDS_PARENT[element.localName] ||
             NEEDS_PARENT[element.localName] === current.localName;
    }

    // Create an element for this tag.
    function createElement(type, annotation) {
      var tagName = TAG_NAME[type];
      if (!tagName) {
        return null;
      }
      var element = window.document.createElement(tagName);
      element.localName = tagName;
      var name = TAG_ANNOTATION[type];
      if (name && annotation) {
        element[name] = annotation.trim();
      }
      return element;
    }

    var rootDiv = window.document.createElement("div"),
        current = rootDiv,
        t,
        tagStack = [];

    while ((t = nextToken()) !== null) {
      if (t[0] === '<') {
        if (t[1] === "/") {
          // If the closing tag matches, move back up to the parent node.
          if (tagStack.length &&
              tagStack[tagStack.length - 1] === t.substr(2).replace(">", "")) {
            tagStack.pop();
            current = current.parentNode;
          }
          // Otherwise just ignore the end tag.
          continue;
        }
        var ts = parseTimeStamp(t.substr(1, t.length - 2));
        var node;
        if (ts) {
          // Timestamps are lead nodes as well.
          node = window.document.createProcessingInstruction("timestamp", ts);
          current.appendChild(node);
          continue;
        }
        var m = t.match(/^<([^.\s/0-9>]+)(\.[^\s\\>]+)?([^>\\]+)?(\\?)>?$/);
        // If we can't parse the tag, skip to the next tag.
        if (!m) {
          continue;
        }
        // Try to construct an element, and ignore the tag if we couldn't.
        node = createElement(m[1], m[3]);
        if (!node) {
          continue;
        }
        // Determine if the tag should be added based on the context of where it
        // is placed in the cuetext.
        if (!shouldAdd(current, node)) {
          continue;
        }
        // Set the class list (as a list of classes, separated by space).
        if (m[2]) {
          node.className = m[2].substr(1).replace('.', ' ');
        }
        // Append the node to the current node, and enter the scope of the new
        // node.
        tagStack.push(m[1]);
        current.appendChild(node);
        current = node;
        continue;
      }

      // Text nodes are leaf nodes.
      current.appendChild(window.document.createTextNode(unescape(t)));
    }

    return rootDiv;
  }

  // This is a list of all the Unicode characters that have a strong
  // right-to-left category. What this means is that these characters are
  // written right-to-left for sure. It was generated by pulling all the strong
  // right-to-left characters out of the Unicode data table. That table can
  // found at: http://www.unicode.org/Public/UNIDATA/UnicodeData.txt
  var strongRTLChars = [0x05BE, 0x05C0, 0x05C3, 0x05C6, 0x05D0, 0x05D1,
      0x05D2, 0x05D3, 0x05D4, 0x05D5, 0x05D6, 0x05D7, 0x05D8, 0x05D9, 0x05DA,
      0x05DB, 0x05DC, 0x05DD, 0x05DE, 0x05DF, 0x05E0, 0x05E1, 0x05E2, 0x05E3,
      0x05E4, 0x05E5, 0x05E6, 0x05E7, 0x05E8, 0x05E9, 0x05EA, 0x05F0, 0x05F1,
      0x05F2, 0x05F3, 0x05F4, 0x0608, 0x060B, 0x060D, 0x061B, 0x061E, 0x061F,
      0x0620, 0x0621, 0x0622, 0x0623, 0x0624, 0x0625, 0x0626, 0x0627, 0x0628,
      0x0629, 0x062A, 0x062B, 0x062C, 0x062D, 0x062E, 0x062F, 0x0630, 0x0631,
      0x0632, 0x0633, 0x0634, 0x0635, 0x0636, 0x0637, 0x0638, 0x0639, 0x063A,
      0x063B, 0x063C, 0x063D, 0x063E, 0x063F, 0x0640, 0x0641, 0x0642, 0x0643,
      0x0644, 0x0645, 0x0646, 0x0647, 0x0648, 0x0649, 0x064A, 0x066D, 0x066E,
      0x066F, 0x0671, 0x0672, 0x0673, 0x0674, 0x0675, 0x0676, 0x0677, 0x0678,
      0x0679, 0x067A, 0x067B, 0x067C, 0x067D, 0x067E, 0x067F, 0x0680, 0x0681,
      0x0682, 0x0683, 0x0684, 0x0685, 0x0686, 0x0687, 0x0688, 0x0689, 0x068A,
      0x068B, 0x068C, 0x068D, 0x068E, 0x068F, 0x0690, 0x0691, 0x0692, 0x0693,
      0x0694, 0x0695, 0x0696, 0x0697, 0x0698, 0x0699, 0x069A, 0x069B, 0x069C,
      0x069D, 0x069E, 0x069F, 0x06A0, 0x06A1, 0x06A2, 0x06A3, 0x06A4, 0x06A5,
      0x06A6, 0x06A7, 0x06A8, 0x06A9, 0x06AA, 0x06AB, 0x06AC, 0x06AD, 0x06AE,
      0x06AF, 0x06B0, 0x06B1, 0x06B2, 0x06B3, 0x06B4, 0x06B5, 0x06B6, 0x06B7,
      0x06B8, 0x06B9, 0x06BA, 0x06BB, 0x06BC, 0x06BD, 0x06BE, 0x06BF, 0x06C0,
      0x06C1, 0x06C2, 0x06C3, 0x06C4, 0x06C5, 0x06C6, 0x06C7, 0x06C8, 0x06C9,
      0x06CA, 0x06CB, 0x06CC, 0x06CD, 0x06CE, 0x06CF, 0x06D0, 0x06D1, 0x06D2,
      0x06D3, 0x06D4, 0x06D5, 0x06E5, 0x06E6, 0x06EE, 0x06EF, 0x06FA, 0x06FB,
      0x06FC, 0x06FD, 0x06FE, 0x06FF, 0x0700, 0x0701, 0x0702, 0x0703, 0x0704,
      0x0705, 0x0706, 0x0707, 0x0708, 0x0709, 0x070A, 0x070B, 0x070C, 0x070D,
      0x070F, 0x0710, 0x0712, 0x0713, 0x0714, 0x0715, 0x0716, 0x0717, 0x0718,
      0x0719, 0x071A, 0x071B, 0x071C, 0x071D, 0x071E, 0x071F, 0x0720, 0x0721,
      0x0722, 0x0723, 0x0724, 0x0725, 0x0726, 0x0727, 0x0728, 0x0729, 0x072A,
      0x072B, 0x072C, 0x072D, 0x072E, 0x072F, 0x074D, 0x074E, 0x074F, 0x0750,
      0x0751, 0x0752, 0x0753, 0x0754, 0x0755, 0x0756, 0x0757, 0x0758, 0x0759,
      0x075A, 0x075B, 0x075C, 0x075D, 0x075E, 0x075F, 0x0760, 0x0761, 0x0762,
      0x0763, 0x0764, 0x0765, 0x0766, 0x0767, 0x0768, 0x0769, 0x076A, 0x076B,
      0x076C, 0x076D, 0x076E, 0x076F, 0x0770, 0x0771, 0x0772, 0x0773, 0x0774,
      0x0775, 0x0776, 0x0777, 0x0778, 0x0779, 0x077A, 0x077B, 0x077C, 0x077D,
      0x077E, 0x077F, 0x0780, 0x0781, 0x0782, 0x0783, 0x0784, 0x0785, 0x0786,
      0x0787, 0x0788, 0x0789, 0x078A, 0x078B, 0x078C, 0x078D, 0x078E, 0x078F,
      0x0790, 0x0791, 0x0792, 0x0793, 0x0794, 0x0795, 0x0796, 0x0797, 0x0798,
      0x0799, 0x079A, 0x079B, 0x079C, 0x079D, 0x079E, 0x079F, 0x07A0, 0x07A1,
      0x07A2, 0x07A3, 0x07A4, 0x07A5, 0x07B1, 0x07C0, 0x07C1, 0x07C2, 0x07C3,
      0x07C4, 0x07C5, 0x07C6, 0x07C7, 0x07C8, 0x07C9, 0x07CA, 0x07CB, 0x07CC,
      0x07CD, 0x07CE, 0x07CF, 0x07D0, 0x07D1, 0x07D2, 0x07D3, 0x07D4, 0x07D5,
      0x07D6, 0x07D7, 0x07D8, 0x07D9, 0x07DA, 0x07DB, 0x07DC, 0x07DD, 0x07DE,
      0x07DF, 0x07E0, 0x07E1, 0x07E2, 0x07E3, 0x07E4, 0x07E5, 0x07E6, 0x07E7,
      0x07E8, 0x07E9, 0x07EA, 0x07F4, 0x07F5, 0x07FA, 0x0800, 0x0801, 0x0802,
      0x0803, 0x0804, 0x0805, 0x0806, 0x0807, 0x0808, 0x0809, 0x080A, 0x080B,
      0x080C, 0x080D, 0x080E, 0x080F, 0x0810, 0x0811, 0x0812, 0x0813, 0x0814,
      0x0815, 0x081A, 0x0824, 0x0828, 0x0830, 0x0831, 0x0832, 0x0833, 0x0834,
      0x0835, 0x0836, 0x0837, 0x0838, 0x0839, 0x083A, 0x083B, 0x083C, 0x083D,
      0x083E, 0x0840, 0x0841, 0x0842, 0x0843, 0x0844, 0x0845, 0x0846, 0x0847,
      0x0848, 0x0849, 0x084A, 0x084B, 0x084C, 0x084D, 0x084E, 0x084F, 0x0850,
      0x0851, 0x0852, 0x0853, 0x0854, 0x0855, 0x0856, 0x0857, 0x0858, 0x085E,
      0x08A0, 0x08A2, 0x08A3, 0x08A4, 0x08A5, 0x08A6, 0x08A7, 0x08A8, 0x08A9,
      0x08AA, 0x08AB, 0x08AC, 0x200F, 0xFB1D, 0xFB1F, 0xFB20, 0xFB21, 0xFB22,
      0xFB23, 0xFB24, 0xFB25, 0xFB26, 0xFB27, 0xFB28, 0xFB2A, 0xFB2B, 0xFB2C,
      0xFB2D, 0xFB2E, 0xFB2F, 0xFB30, 0xFB31, 0xFB32, 0xFB33, 0xFB34, 0xFB35,
      0xFB36, 0xFB38, 0xFB39, 0xFB3A, 0xFB3B, 0xFB3C, 0xFB3E, 0xFB40, 0xFB41,
      0xFB43, 0xFB44, 0xFB46, 0xFB47, 0xFB48, 0xFB49, 0xFB4A, 0xFB4B, 0xFB4C,
      0xFB4D, 0xFB4E, 0xFB4F, 0xFB50, 0xFB51, 0xFB52, 0xFB53, 0xFB54, 0xFB55,
      0xFB56, 0xFB57, 0xFB58, 0xFB59, 0xFB5A, 0xFB5B, 0xFB5C, 0xFB5D, 0xFB5E,
      0xFB5F, 0xFB60, 0xFB61, 0xFB62, 0xFB63, 0xFB64, 0xFB65, 0xFB66, 0xFB67,
      0xFB68, 0xFB69, 0xFB6A, 0xFB6B, 0xFB6C, 0xFB6D, 0xFB6E, 0xFB6F, 0xFB70,
      0xFB71, 0xFB72, 0xFB73, 0xFB74, 0xFB75, 0xFB76, 0xFB77, 0xFB78, 0xFB79,
      0xFB7A, 0xFB7B, 0xFB7C, 0xFB7D, 0xFB7E, 0xFB7F, 0xFB80, 0xFB81, 0xFB82,
      0xFB83, 0xFB84, 0xFB85, 0xFB86, 0xFB87, 0xFB88, 0xFB89, 0xFB8A, 0xFB8B,
      0xFB8C, 0xFB8D, 0xFB8E, 0xFB8F, 0xFB90, 0xFB91, 0xFB92, 0xFB93, 0xFB94,
      0xFB95, 0xFB96, 0xFB97, 0xFB98, 0xFB99, 0xFB9A, 0xFB9B, 0xFB9C, 0xFB9D,
      0xFB9E, 0xFB9F, 0xFBA0, 0xFBA1, 0xFBA2, 0xFBA3, 0xFBA4, 0xFBA5, 0xFBA6,
      0xFBA7, 0xFBA8, 0xFBA9, 0xFBAA, 0xFBAB, 0xFBAC, 0xFBAD, 0xFBAE, 0xFBAF,
      0xFBB0, 0xFBB1, 0xFBB2, 0xFBB3, 0xFBB4, 0xFBB5, 0xFBB6, 0xFBB7, 0xFBB8,
      0xFBB9, 0xFBBA, 0xFBBB, 0xFBBC, 0xFBBD, 0xFBBE, 0xFBBF, 0xFBC0, 0xFBC1,
      0xFBD3, 0xFBD4, 0xFBD5, 0xFBD6, 0xFBD7, 0xFBD8, 0xFBD9, 0xFBDA, 0xFBDB,
      0xFBDC, 0xFBDD, 0xFBDE, 0xFBDF, 0xFBE0, 0xFBE1, 0xFBE2, 0xFBE3, 0xFBE4,
      0xFBE5, 0xFBE6, 0xFBE7, 0xFBE8, 0xFBE9, 0xFBEA, 0xFBEB, 0xFBEC, 0xFBED,
      0xFBEE, 0xFBEF, 0xFBF0, 0xFBF1, 0xFBF2, 0xFBF3, 0xFBF4, 0xFBF5, 0xFBF6,
      0xFBF7, 0xFBF8, 0xFBF9, 0xFBFA, 0xFBFB, 0xFBFC, 0xFBFD, 0xFBFE, 0xFBFF,
      0xFC00, 0xFC01, 0xFC02, 0xFC03, 0xFC04, 0xFC05, 0xFC06, 0xFC07, 0xFC08,
      0xFC09, 0xFC0A, 0xFC0B, 0xFC0C, 0xFC0D, 0xFC0E, 0xFC0F, 0xFC10, 0xFC11,
      0xFC12, 0xFC13, 0xFC14, 0xFC15, 0xFC16, 0xFC17, 0xFC18, 0xFC19, 0xFC1A,
      0xFC1B, 0xFC1C, 0xFC1D, 0xFC1E, 0xFC1F, 0xFC20, 0xFC21, 0xFC22, 0xFC23,
      0xFC24, 0xFC25, 0xFC26, 0xFC27, 0xFC28, 0xFC29, 0xFC2A, 0xFC2B, 0xFC2C,
      0xFC2D, 0xFC2E, 0xFC2F, 0xFC30, 0xFC31, 0xFC32, 0xFC33, 0xFC34, 0xFC35,
      0xFC36, 0xFC37, 0xFC38, 0xFC39, 0xFC3A, 0xFC3B, 0xFC3C, 0xFC3D, 0xFC3E,
      0xFC3F, 0xFC40, 0xFC41, 0xFC42, 0xFC43, 0xFC44, 0xFC45, 0xFC46, 0xFC47,
      0xFC48, 0xFC49, 0xFC4A, 0xFC4B, 0xFC4C, 0xFC4D, 0xFC4E, 0xFC4F, 0xFC50,
      0xFC51, 0xFC52, 0xFC53, 0xFC54, 0xFC55, 0xFC56, 0xFC57, 0xFC58, 0xFC59,
      0xFC5A, 0xFC5B, 0xFC5C, 0xFC5D, 0xFC5E, 0xFC5F, 0xFC60, 0xFC61, 0xFC62,
      0xFC63, 0xFC64, 0xFC65, 0xFC66, 0xFC67, 0xFC68, 0xFC69, 0xFC6A, 0xFC6B,
      0xFC6C, 0xFC6D, 0xFC6E, 0xFC6F, 0xFC70, 0xFC71, 0xFC72, 0xFC73, 0xFC74,
      0xFC75, 0xFC76, 0xFC77, 0xFC78, 0xFC79, 0xFC7A, 0xFC7B, 0xFC7C, 0xFC7D,
      0xFC7E, 0xFC7F, 0xFC80, 0xFC81, 0xFC82, 0xFC83, 0xFC84, 0xFC85, 0xFC86,
      0xFC87, 0xFC88, 0xFC89, 0xFC8A, 0xFC8B, 0xFC8C, 0xFC8D, 0xFC8E, 0xFC8F,
      0xFC90, 0xFC91, 0xFC92, 0xFC93, 0xFC94, 0xFC95, 0xFC96, 0xFC97, 0xFC98,
      0xFC99, 0xFC9A, 0xFC9B, 0xFC9C, 0xFC9D, 0xFC9E, 0xFC9F, 0xFCA0, 0xFCA1,
      0xFCA2, 0xFCA3, 0xFCA4, 0xFCA5, 0xFCA6, 0xFCA7, 0xFCA8, 0xFCA9, 0xFCAA,
      0xFCAB, 0xFCAC, 0xFCAD, 0xFCAE, 0xFCAF, 0xFCB0, 0xFCB1, 0xFCB2, 0xFCB3,
      0xFCB4, 0xFCB5, 0xFCB6, 0xFCB7, 0xFCB8, 0xFCB9, 0xFCBA, 0xFCBB, 0xFCBC,
      0xFCBD, 0xFCBE, 0xFCBF, 0xFCC0, 0xFCC1, 0xFCC2, 0xFCC3, 0xFCC4, 0xFCC5,
      0xFCC6, 0xFCC7, 0xFCC8, 0xFCC9, 0xFCCA, 0xFCCB, 0xFCCC, 0xFCCD, 0xFCCE,
      0xFCCF, 0xFCD0, 0xFCD1, 0xFCD2, 0xFCD3, 0xFCD4, 0xFCD5, 0xFCD6, 0xFCD7,
      0xFCD8, 0xFCD9, 0xFCDA, 0xFCDB, 0xFCDC, 0xFCDD, 0xFCDE, 0xFCDF, 0xFCE0,
      0xFCE1, 0xFCE2, 0xFCE3, 0xFCE4, 0xFCE5, 0xFCE6, 0xFCE7, 0xFCE8, 0xFCE9,
      0xFCEA, 0xFCEB, 0xFCEC, 0xFCED, 0xFCEE, 0xFCEF, 0xFCF0, 0xFCF1, 0xFCF2,
      0xFCF3, 0xFCF4, 0xFCF5, 0xFCF6, 0xFCF7, 0xFCF8, 0xFCF9, 0xFCFA, 0xFCFB,
      0xFCFC, 0xFCFD, 0xFCFE, 0xFCFF, 0xFD00, 0xFD01, 0xFD02, 0xFD03, 0xFD04,
      0xFD05, 0xFD06, 0xFD07, 0xFD08, 0xFD09, 0xFD0A, 0xFD0B, 0xFD0C, 0xFD0D,
      0xFD0E, 0xFD0F, 0xFD10, 0xFD11, 0xFD12, 0xFD13, 0xFD14, 0xFD15, 0xFD16,
      0xFD17, 0xFD18, 0xFD19, 0xFD1A, 0xFD1B, 0xFD1C, 0xFD1D, 0xFD1E, 0xFD1F,
      0xFD20, 0xFD21, 0xFD22, 0xFD23, 0xFD24, 0xFD25, 0xFD26, 0xFD27, 0xFD28,
      0xFD29, 0xFD2A, 0xFD2B, 0xFD2C, 0xFD2D, 0xFD2E, 0xFD2F, 0xFD30, 0xFD31,
      0xFD32, 0xFD33, 0xFD34, 0xFD35, 0xFD36, 0xFD37, 0xFD38, 0xFD39, 0xFD3A,
      0xFD3B, 0xFD3C, 0xFD3D, 0xFD50, 0xFD51, 0xFD52, 0xFD53, 0xFD54, 0xFD55,
      0xFD56, 0xFD57, 0xFD58, 0xFD59, 0xFD5A, 0xFD5B, 0xFD5C, 0xFD5D, 0xFD5E,
      0xFD5F, 0xFD60, 0xFD61, 0xFD62, 0xFD63, 0xFD64, 0xFD65, 0xFD66, 0xFD67,
      0xFD68, 0xFD69, 0xFD6A, 0xFD6B, 0xFD6C, 0xFD6D, 0xFD6E, 0xFD6F, 0xFD70,
      0xFD71, 0xFD72, 0xFD73, 0xFD74, 0xFD75, 0xFD76, 0xFD77, 0xFD78, 0xFD79,
      0xFD7A, 0xFD7B, 0xFD7C, 0xFD7D, 0xFD7E, 0xFD7F, 0xFD80, 0xFD81, 0xFD82,
      0xFD83, 0xFD84, 0xFD85, 0xFD86, 0xFD87, 0xFD88, 0xFD89, 0xFD8A, 0xFD8B,
      0xFD8C, 0xFD8D, 0xFD8E, 0xFD8F, 0xFD92, 0xFD93, 0xFD94, 0xFD95, 0xFD96,
      0xFD97, 0xFD98, 0xFD99, 0xFD9A, 0xFD9B, 0xFD9C, 0xFD9D, 0xFD9E, 0xFD9F,
      0xFDA0, 0xFDA1, 0xFDA2, 0xFDA3, 0xFDA4, 0xFDA5, 0xFDA6, 0xFDA7, 0xFDA8,
      0xFDA9, 0xFDAA, 0xFDAB, 0xFDAC, 0xFDAD, 0xFDAE, 0xFDAF, 0xFDB0, 0xFDB1,
      0xFDB2, 0xFDB3, 0xFDB4, 0xFDB5, 0xFDB6, 0xFDB7, 0xFDB8, 0xFDB9, 0xFDBA,
      0xFDBB, 0xFDBC, 0xFDBD, 0xFDBE, 0xFDBF, 0xFDC0, 0xFDC1, 0xFDC2, 0xFDC3,
      0xFDC4, 0xFDC5, 0xFDC6, 0xFDC7, 0xFDF0, 0xFDF1, 0xFDF2, 0xFDF3, 0xFDF4,
      0xFDF5, 0xFDF6, 0xFDF7, 0xFDF8, 0xFDF9, 0xFDFA, 0xFDFB, 0xFDFC, 0xFE70,
      0xFE71, 0xFE72, 0xFE73, 0xFE74, 0xFE76, 0xFE77, 0xFE78, 0xFE79, 0xFE7A,
      0xFE7B, 0xFE7C, 0xFE7D, 0xFE7E, 0xFE7F, 0xFE80, 0xFE81, 0xFE82, 0xFE83,
      0xFE84, 0xFE85, 0xFE86, 0xFE87, 0xFE88, 0xFE89, 0xFE8A, 0xFE8B, 0xFE8C,
      0xFE8D, 0xFE8E, 0xFE8F, 0xFE90, 0xFE91, 0xFE92, 0xFE93, 0xFE94, 0xFE95,
      0xFE96, 0xFE97, 0xFE98, 0xFE99, 0xFE9A, 0xFE9B, 0xFE9C, 0xFE9D, 0xFE9E,
      0xFE9F, 0xFEA0, 0xFEA1, 0xFEA2, 0xFEA3, 0xFEA4, 0xFEA5, 0xFEA6, 0xFEA7,
      0xFEA8, 0xFEA9, 0xFEAA, 0xFEAB, 0xFEAC, 0xFEAD, 0xFEAE, 0xFEAF, 0xFEB0,
      0xFEB1, 0xFEB2, 0xFEB3, 0xFEB4, 0xFEB5, 0xFEB6, 0xFEB7, 0xFEB8, 0xFEB9,
      0xFEBA, 0xFEBB, 0xFEBC, 0xFEBD, 0xFEBE, 0xFEBF, 0xFEC0, 0xFEC1, 0xFEC2,
      0xFEC3, 0xFEC4, 0xFEC5, 0xFEC6, 0xFEC7, 0xFEC8, 0xFEC9, 0xFECA, 0xFECB,
      0xFECC, 0xFECD, 0xFECE, 0xFECF, 0xFED0, 0xFED1, 0xFED2, 0xFED3, 0xFED4,
      0xFED5, 0xFED6, 0xFED7, 0xFED8, 0xFED9, 0xFEDA, 0xFEDB, 0xFEDC, 0xFEDD,
      0xFEDE, 0xFEDF, 0xFEE0, 0xFEE1, 0xFEE2, 0xFEE3, 0xFEE4, 0xFEE5, 0xFEE6,
      0xFEE7, 0xFEE8, 0xFEE9, 0xFEEA, 0xFEEB, 0xFEEC, 0xFEED, 0xFEEE, 0xFEEF,
      0xFEF0, 0xFEF1, 0xFEF2, 0xFEF3, 0xFEF4, 0xFEF5, 0xFEF6, 0xFEF7, 0xFEF8,
      0xFEF9, 0xFEFA, 0xFEFB, 0xFEFC, 0x10800, 0x10801, 0x10802, 0x10803,
      0x10804, 0x10805, 0x10808, 0x1080A, 0x1080B, 0x1080C, 0x1080D, 0x1080E,
      0x1080F, 0x10810, 0x10811, 0x10812, 0x10813, 0x10814, 0x10815, 0x10816,
      0x10817, 0x10818, 0x10819, 0x1081A, 0x1081B, 0x1081C, 0x1081D, 0x1081E,
      0x1081F, 0x10820, 0x10821, 0x10822, 0x10823, 0x10824, 0x10825, 0x10826,
      0x10827, 0x10828, 0x10829, 0x1082A, 0x1082B, 0x1082C, 0x1082D, 0x1082E,
      0x1082F, 0x10830, 0x10831, 0x10832, 0x10833, 0x10834, 0x10835, 0x10837,
      0x10838, 0x1083C, 0x1083F, 0x10840, 0x10841, 0x10842, 0x10843, 0x10844,
      0x10845, 0x10846, 0x10847, 0x10848, 0x10849, 0x1084A, 0x1084B, 0x1084C,
      0x1084D, 0x1084E, 0x1084F, 0x10850, 0x10851, 0x10852, 0x10853, 0x10854,
      0x10855, 0x10857, 0x10858, 0x10859, 0x1085A, 0x1085B, 0x1085C, 0x1085D,
      0x1085E, 0x1085F, 0x10900, 0x10901, 0x10902, 0x10903, 0x10904, 0x10905,
      0x10906, 0x10907, 0x10908, 0x10909, 0x1090A, 0x1090B, 0x1090C, 0x1090D,
      0x1090E, 0x1090F, 0x10910, 0x10911, 0x10912, 0x10913, 0x10914, 0x10915,
      0x10916, 0x10917, 0x10918, 0x10919, 0x1091A, 0x1091B, 0x10920, 0x10921,
      0x10922, 0x10923, 0x10924, 0x10925, 0x10926, 0x10927, 0x10928, 0x10929,
      0x1092A, 0x1092B, 0x1092C, 0x1092D, 0x1092E, 0x1092F, 0x10930, 0x10931,
      0x10932, 0x10933, 0x10934, 0x10935, 0x10936, 0x10937, 0x10938, 0x10939,
      0x1093F, 0x10980, 0x10981, 0x10982, 0x10983, 0x10984, 0x10985, 0x10986,
      0x10987, 0x10988, 0x10989, 0x1098A, 0x1098B, 0x1098C, 0x1098D, 0x1098E,
      0x1098F, 0x10990, 0x10991, 0x10992, 0x10993, 0x10994, 0x10995, 0x10996,
      0x10997, 0x10998, 0x10999, 0x1099A, 0x1099B, 0x1099C, 0x1099D, 0x1099E,
      0x1099F, 0x109A0, 0x109A1, 0x109A2, 0x109A3, 0x109A4, 0x109A5, 0x109A6,
      0x109A7, 0x109A8, 0x109A9, 0x109AA, 0x109AB, 0x109AC, 0x109AD, 0x109AE,
      0x109AF, 0x109B0, 0x109B1, 0x109B2, 0x109B3, 0x109B4, 0x109B5, 0x109B6,
      0x109B7, 0x109BE, 0x109BF, 0x10A00, 0x10A10, 0x10A11, 0x10A12, 0x10A13,
      0x10A15, 0x10A16, 0x10A17, 0x10A19, 0x10A1A, 0x10A1B, 0x10A1C, 0x10A1D,
      0x10A1E, 0x10A1F, 0x10A20, 0x10A21, 0x10A22, 0x10A23, 0x10A24, 0x10A25,
      0x10A26, 0x10A27, 0x10A28, 0x10A29, 0x10A2A, 0x10A2B, 0x10A2C, 0x10A2D,
      0x10A2E, 0x10A2F, 0x10A30, 0x10A31, 0x10A32, 0x10A33, 0x10A40, 0x10A41,
      0x10A42, 0x10A43, 0x10A44, 0x10A45, 0x10A46, 0x10A47, 0x10A50, 0x10A51,
      0x10A52, 0x10A53, 0x10A54, 0x10A55, 0x10A56, 0x10A57, 0x10A58, 0x10A60,
      0x10A61, 0x10A62, 0x10A63, 0x10A64, 0x10A65, 0x10A66, 0x10A67, 0x10A68,
      0x10A69, 0x10A6A, 0x10A6B, 0x10A6C, 0x10A6D, 0x10A6E, 0x10A6F, 0x10A70,
      0x10A71, 0x10A72, 0x10A73, 0x10A74, 0x10A75, 0x10A76, 0x10A77, 0x10A78,
      0x10A79, 0x10A7A, 0x10A7B, 0x10A7C, 0x10A7D, 0x10A7E, 0x10A7F, 0x10B00,
      0x10B01, 0x10B02, 0x10B03, 0x10B04, 0x10B05, 0x10B06, 0x10B07, 0x10B08,
      0x10B09, 0x10B0A, 0x10B0B, 0x10B0C, 0x10B0D, 0x10B0E, 0x10B0F, 0x10B10,
      0x10B11, 0x10B12, 0x10B13, 0x10B14, 0x10B15, 0x10B16, 0x10B17, 0x10B18,
      0x10B19, 0x10B1A, 0x10B1B, 0x10B1C, 0x10B1D, 0x10B1E, 0x10B1F, 0x10B20,
      0x10B21, 0x10B22, 0x10B23, 0x10B24, 0x10B25, 0x10B26, 0x10B27, 0x10B28,
      0x10B29, 0x10B2A, 0x10B2B, 0x10B2C, 0x10B2D, 0x10B2E, 0x10B2F, 0x10B30,
      0x10B31, 0x10B32, 0x10B33, 0x10B34, 0x10B35, 0x10B40, 0x10B41, 0x10B42,
      0x10B43, 0x10B44, 0x10B45, 0x10B46, 0x10B47, 0x10B48, 0x10B49, 0x10B4A,
      0x10B4B, 0x10B4C, 0x10B4D, 0x10B4E, 0x10B4F, 0x10B50, 0x10B51, 0x10B52,
      0x10B53, 0x10B54, 0x10B55, 0x10B58, 0x10B59, 0x10B5A, 0x10B5B, 0x10B5C,
      0x10B5D, 0x10B5E, 0x10B5F, 0x10B60, 0x10B61, 0x10B62, 0x10B63, 0x10B64,
      0x10B65, 0x10B66, 0x10B67, 0x10B68, 0x10B69, 0x10B6A, 0x10B6B, 0x10B6C,
      0x10B6D, 0x10B6E, 0x10B6F, 0x10B70, 0x10B71, 0x10B72, 0x10B78, 0x10B79,
      0x10B7A, 0x10B7B, 0x10B7C, 0x10B7D, 0x10B7E, 0x10B7F, 0x10C00, 0x10C01,
      0x10C02, 0x10C03, 0x10C04, 0x10C05, 0x10C06, 0x10C07, 0x10C08, 0x10C09,
      0x10C0A, 0x10C0B, 0x10C0C, 0x10C0D, 0x10C0E, 0x10C0F, 0x10C10, 0x10C11,
      0x10C12, 0x10C13, 0x10C14, 0x10C15, 0x10C16, 0x10C17, 0x10C18, 0x10C19,
      0x10C1A, 0x10C1B, 0x10C1C, 0x10C1D, 0x10C1E, 0x10C1F, 0x10C20, 0x10C21,
      0x10C22, 0x10C23, 0x10C24, 0x10C25, 0x10C26, 0x10C27, 0x10C28, 0x10C29,
      0x10C2A, 0x10C2B, 0x10C2C, 0x10C2D, 0x10C2E, 0x10C2F, 0x10C30, 0x10C31,
      0x10C32, 0x10C33, 0x10C34, 0x10C35, 0x10C36, 0x10C37, 0x10C38, 0x10C39,
      0x10C3A, 0x10C3B, 0x10C3C, 0x10C3D, 0x10C3E, 0x10C3F, 0x10C40, 0x10C41,
      0x10C42, 0x10C43, 0x10C44, 0x10C45, 0x10C46, 0x10C47, 0x10C48, 0x1EE00,
      0x1EE01, 0x1EE02, 0x1EE03, 0x1EE05, 0x1EE06, 0x1EE07, 0x1EE08, 0x1EE09,
      0x1EE0A, 0x1EE0B, 0x1EE0C, 0x1EE0D, 0x1EE0E, 0x1EE0F, 0x1EE10, 0x1EE11,
      0x1EE12, 0x1EE13, 0x1EE14, 0x1EE15, 0x1EE16, 0x1EE17, 0x1EE18, 0x1EE19,
      0x1EE1A, 0x1EE1B, 0x1EE1C, 0x1EE1D, 0x1EE1E, 0x1EE1F, 0x1EE21, 0x1EE22,
      0x1EE24, 0x1EE27, 0x1EE29, 0x1EE2A, 0x1EE2B, 0x1EE2C, 0x1EE2D, 0x1EE2E,
      0x1EE2F, 0x1EE30, 0x1EE31, 0x1EE32, 0x1EE34, 0x1EE35, 0x1EE36, 0x1EE37,
      0x1EE39, 0x1EE3B, 0x1EE42, 0x1EE47, 0x1EE49, 0x1EE4B, 0x1EE4D, 0x1EE4E,
      0x1EE4F, 0x1EE51, 0x1EE52, 0x1EE54, 0x1EE57, 0x1EE59, 0x1EE5B, 0x1EE5D,
      0x1EE5F, 0x1EE61, 0x1EE62, 0x1EE64, 0x1EE67, 0x1EE68, 0x1EE69, 0x1EE6A,
      0x1EE6C, 0x1EE6D, 0x1EE6E, 0x1EE6F, 0x1EE70, 0x1EE71, 0x1EE72, 0x1EE74,
      0x1EE75, 0x1EE76, 0x1EE77, 0x1EE79, 0x1EE7A, 0x1EE7B, 0x1EE7C, 0x1EE7E,
      0x1EE80, 0x1EE81, 0x1EE82, 0x1EE83, 0x1EE84, 0x1EE85, 0x1EE86, 0x1EE87,
      0x1EE88, 0x1EE89, 0x1EE8B, 0x1EE8C, 0x1EE8D, 0x1EE8E, 0x1EE8F, 0x1EE90,
      0x1EE91, 0x1EE92, 0x1EE93, 0x1EE94, 0x1EE95, 0x1EE96, 0x1EE97, 0x1EE98,
      0x1EE99, 0x1EE9A, 0x1EE9B, 0x1EEA1, 0x1EEA2, 0x1EEA3, 0x1EEA5, 0x1EEA6,
      0x1EEA7, 0x1EEA8, 0x1EEA9, 0x1EEAB, 0x1EEAC, 0x1EEAD, 0x1EEAE, 0x1EEAF,
      0x1EEB0, 0x1EEB1, 0x1EEB2, 0x1EEB3, 0x1EEB4, 0x1EEB5, 0x1EEB6, 0x1EEB7,
      0x1EEB8, 0x1EEB9, 0x1EEBA, 0x1EEBB, 0x10FFFD];

  function determineBidi(cueDiv) {
    var nodeStack = [],
        text = "",
        charCode;

    if (!cueDiv || !cueDiv.childNodes) {
      return "ltr";
    }

    function pushNodes(nodeStack, node) {
      for (var i = node.childNodes.length - 1; i >= 0; i--) {
        nodeStack.push(node.childNodes[i]);
      }
    }

    function nextTextNode(nodeStack) {
      if (!nodeStack || !nodeStack.length) {
        return null;
      }

      var node = nodeStack.pop(),
          text = node.textContent || node.innerText;
      if (text) {
        // TODO: This should match all unicode type B characters (paragraph
        // separator characters). See issue #115.
        var m = text.match(/^.*(\n|\r)/);
        if (m) {
          nodeStack.length = 0;
          return m[0];
        }
        return text;
      }
      if (node.tagName === "ruby") {
        return nextTextNode(nodeStack);
      }
      if (node.childNodes) {
        pushNodes(nodeStack, node);
        return nextTextNode(nodeStack);
      }
    }

    pushNodes(nodeStack, cueDiv);
    while ((text = nextTextNode(nodeStack))) {
      for (var i = 0; i < text.length; i++) {
        charCode = text.charCodeAt(i);
        for (var j = 0; j < strongRTLChars.length; j++) {
          if (strongRTLChars[j] === charCode) {
            return "rtl";
          }
        }
      }
    }
    return "ltr";
  }

  function computeLinePos(cue) {
    if (typeof cue.line === "number" &&
        (cue.snapToLines || (cue.line >= 0 && cue.line <= 100))) {
      return cue.line;
    }
    if (!cue.track || !cue.track.textTrackList ||
        !cue.track.textTrackList.mediaElement) {
      return -1;
    }
    var track = cue.track,
        trackList = track.textTrackList,
        count = 0;
    for (var i = 0; i < trackList.length && trackList[i] !== track; i++) {
      if (trackList[i].mode === "showing") {
        count++;
      }
    }
    return ++count * -1;
  }

  function StyleBox() {
  }

  // Apply styles to a div. If there is no div passed then it defaults to the
  // div on 'this'.
  StyleBox.prototype.applyStyles = function(styles, div) {
    div = div || this.div;
    for (var prop in styles) {
      if (styles.hasOwnProperty(prop)) {
        div.style[prop] = styles[prop];
      }
    }
  };

  StyleBox.prototype.formatStyle = function(val, unit) {
    return val === 0 ? 0 : val + unit;
  };

  // Constructs the computed display state of the cue (a div). Places the div
  // into the overlay which should be a block level element (usually a div).
  function CueStyleBox(window, cue, styleOptions) {
    var isIE8 = (/MSIE\s8\.0/).test(navigator.userAgent);
    var color = "rgba(255, 255, 255, 1)";
    var backgroundColor = "rgba(0, 0, 0, 0.8)";

    if (isIE8) {
      color = "rgb(255, 255, 255)";
      backgroundColor = "rgb(0, 0, 0)";
    }

    StyleBox.call(this);
    this.cue = cue;

    // Parse our cue's text into a DOM tree rooted at 'cueDiv'. This div will
    // have inline positioning and will function as the cue background box.
    this.cueDiv = parseContent(window, cue.text);
    var styles = {
      color: color,
      backgroundColor: backgroundColor,
      position: "relative",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      display: "inline"
    };

    if (!isIE8) {
      styles.writingMode = cue.vertical === "" ? "horizontal-tb"
                                               : cue.vertical === "lr" ? "vertical-lr"
                                                                       : "vertical-rl";
      styles.unicodeBidi = "plaintext";
    }
    this.applyStyles(styles, this.cueDiv);

    // Create an absolutely positioned div that will be used to position the cue
    // div. Note, all WebVTT cue-setting alignments are equivalent to the CSS
    // mirrors of them except "middle" which is "center" in CSS.
    this.div = window.document.createElement("div");
    styles = {
      textAlign: cue.align === "middle" ? "center" : cue.align,
      font: styleOptions.font,
      whiteSpace: "pre-line",
      position: "absolute"
    };

    if (!isIE8) {
      styles.direction = determineBidi(this.cueDiv);
      styles.writingMode = cue.vertical === "" ? "horizontal-tb"
                                               : cue.vertical === "lr" ? "vertical-lr"
                                                                       : "vertical-rl".
      stylesunicodeBidi =  "plaintext";
    }

    this.applyStyles(styles);

    this.div.appendChild(this.cueDiv);

    // Calculate the distance from the reference edge of the viewport to the text
    // position of the cue box. The reference edge will be resolved later when
    // the box orientation styles are applied.
    var textPos = 0;
    switch (cue.positionAlign) {
    case "start":
      textPos = cue.position;
      break;
    case "middle":
      textPos = cue.position - (cue.size / 2);
      break;
    case "end":
      textPos = cue.position - cue.size;
      break;
    }

    // Horizontal box orientation; textPos is the distance from the left edge of the
    // area to the left edge of the box and cue.size is the distance extending to
    // the right from there.
    if (cue.vertical === "") {
      this.applyStyles({
        left:  this.formatStyle(textPos, "%"),
        width: this.formatStyle(cue.size, "%")
      });
    // Vertical box orientation; textPos is the distance from the top edge of the
    // area to the top edge of the box and cue.size is the height extending
    // downwards from there.
    } else {
      this.applyStyles({
        top: this.formatStyle(textPos, "%"),
        height: this.formatStyle(cue.size, "%")
      });
    }

    this.move = function(box) {
      this.applyStyles({
        top: this.formatStyle(box.top, "px"),
        bottom: this.formatStyle(box.bottom, "px"),
        left: this.formatStyle(box.left, "px"),
        right: this.formatStyle(box.right, "px"),
        height: this.formatStyle(box.height, "px"),
        width: this.formatStyle(box.width, "px")
      });
    };
  }
  CueStyleBox.prototype = _objCreate(StyleBox.prototype);
  CueStyleBox.prototype.constructor = CueStyleBox;

  // Represents the co-ordinates of an Element in a way that we can easily
  // compute things with such as if it overlaps or intersects with another Element.
  // Can initialize it with either a StyleBox or another BoxPosition.
  function BoxPosition(obj) {
    var isIE8 = (/MSIE\s8\.0/).test(navigator.userAgent);

    // Either a BoxPosition was passed in and we need to copy it, or a StyleBox
    // was passed in and we need to copy the results of 'getBoundingClientRect'
    // as the object returned is readonly. All co-ordinate values are in reference
    // to the viewport origin (top left).
    var lh, height, width, top;
    if (obj.div) {
      height = obj.div.offsetHeight;
      width = obj.div.offsetWidth;
      top = obj.div.offsetTop;

      var rects = (rects = obj.div.childNodes) && (rects = rects[0]) &&
                  rects.getClientRects && rects.getClientRects();
      obj = obj.div.getBoundingClientRect();
      // In certain cases the outter div will be slightly larger then the sum of
      // the inner div's lines. This could be due to bold text, etc, on some platforms.
      // In this case we should get the average line height and use that. This will
      // result in the desired behaviour.
      lh = rects ? Math.max((rects[0] && rects[0].height) || 0, obj.height / rects.length)
                 : 0;

    }
    this.left = obj.left;
    this.right = obj.right;
    this.top = obj.top || top;
    this.height = obj.height || height;
    this.bottom = obj.bottom || (top + (obj.height || height));
    this.width = obj.width || width;
    this.lineHeight = lh !== undefined ? lh : obj.lineHeight;

    if (isIE8 && !this.lineHeight) {
      this.lineHeight = 13;
    }
  }

  // Move the box along a particular axis. Optionally pass in an amount to move
  // the box. If no amount is passed then the default is the line height of the
  // box.
  BoxPosition.prototype.move = function(axis, toMove) {
    toMove = toMove !== undefined ? toMove : this.lineHeight;
    switch (axis) {
    case "+x":
      this.left += toMove;
      this.right += toMove;
      break;
    case "-x":
      this.left -= toMove;
      this.right -= toMove;
      break;
    case "+y":
      this.top += toMove;
      this.bottom += toMove;
      break;
    case "-y":
      this.top -= toMove;
      this.bottom -= toMove;
      break;
    }
  };

  // Check if this box overlaps another box, b2.
  BoxPosition.prototype.overlaps = function(b2) {
    return this.left < b2.right &&
           this.right > b2.left &&
           this.top < b2.bottom &&
           this.bottom > b2.top;
  };

  // Check if this box overlaps any other boxes in boxes.
  BoxPosition.prototype.overlapsAny = function(boxes) {
    for (var i = 0; i < boxes.length; i++) {
      if (this.overlaps(boxes[i])) {
        return true;
      }
    }
    return false;
  };

  // Check if this box is within another box.
  BoxPosition.prototype.within = function(container) {
    return this.top >= container.top &&
           this.bottom <= container.bottom &&
           this.left >= container.left &&
           this.right <= container.right;
  };

  // Check if this box is entirely within the container or it is overlapping
  // on the edge opposite of the axis direction passed. For example, if "+x" is
  // passed and the box is overlapping on the left edge of the container, then
  // return true.
  BoxPosition.prototype.overlapsOppositeAxis = function(container, axis) {
    switch (axis) {
    case "+x":
      return this.left < container.left;
    case "-x":
      return this.right > container.right;
    case "+y":
      return this.top < container.top;
    case "-y":
      return this.bottom > container.bottom;
    }
  };

  // Find the percentage of the area that this box is overlapping with another
  // box.
  BoxPosition.prototype.intersectPercentage = function(b2) {
    var x = Math.max(0, Math.min(this.right, b2.right) - Math.max(this.left, b2.left)),
        y = Math.max(0, Math.min(this.bottom, b2.bottom) - Math.max(this.top, b2.top)),
        intersectArea = x * y;
    return intersectArea / (this.height * this.width);
  };

  // Convert the positions from this box to CSS compatible positions using
  // the reference container's positions. This has to be done because this
  // box's positions are in reference to the viewport origin, whereas, CSS
  // values are in referecne to their respective edges.
  BoxPosition.prototype.toCSSCompatValues = function(reference) {
    return {
      top: this.top - reference.top,
      bottom: reference.bottom - this.bottom,
      left: this.left - reference.left,
      right: reference.right - this.right,
      height: this.height,
      width: this.width
    };
  };

  // Get an object that represents the box's position without anything extra.
  // Can pass a StyleBox, HTMLElement, or another BoxPositon.
  BoxPosition.getSimpleBoxPosition = function(obj) {
    var height = obj.div ? obj.div.offsetHeight : obj.tagName ? obj.offsetHeight : 0;
    var width = obj.div ? obj.div.offsetWidth : obj.tagName ? obj.offsetWidth : 0;
    var top = obj.div ? obj.div.offsetTop : obj.tagName ? obj.offsetTop : 0;

    obj = obj.div ? obj.div.getBoundingClientRect() :
                  obj.tagName ? obj.getBoundingClientRect() : obj;
    var ret = {
      left: obj.left,
      right: obj.right,
      top: obj.top || top,
      height: obj.height || height,
      bottom: obj.bottom || (top + (obj.height || height)),
      width: obj.width || width
    };
    return ret;
  };

  // Move a StyleBox to its specified, or next best, position. The containerBox
  // is the box that contains the StyleBox, such as a div. boxPositions are
  // a list of other boxes that the styleBox can't overlap with.
  function moveBoxToLinePosition(window, styleBox, containerBox, boxPositions) {

    // Find the best position for a cue box, b, on the video. The axis parameter
    // is a list of axis, the order of which, it will move the box along. For example:
    // Passing ["+x", "-x"] will move the box first along the x axis in the positive
    // direction. If it doesn't find a good position for it there it will then move
    // it along the x axis in the negative direction.
    function findBestPosition(b, axis) {
      var bestPosition,
          specifiedPosition = new BoxPosition(b),
          percentage = 1; // Highest possible so the first thing we get is better.

      for (var i = 0; i < axis.length; i++) {
        while (b.overlapsOppositeAxis(containerBox, axis[i]) ||
               (b.within(containerBox) && b.overlapsAny(boxPositions))) {
          b.move(axis[i]);
        }
        // We found a spot where we aren't overlapping anything. This is our
        // best position.
        if (b.within(containerBox)) {
          return b;
        }
        var p = b.intersectPercentage(containerBox);
        // If we're outside the container box less then we were on our last try
        // then remember this position as the best position.
        if (percentage > p) {
          bestPosition = new BoxPosition(b);
          percentage = p;
        }
        // Reset the box position to the specified position.
        b = new BoxPosition(specifiedPosition);
      }
      return bestPosition || specifiedPosition;
    }

    var boxPosition = new BoxPosition(styleBox),
        cue = styleBox.cue,
        linePos = computeLinePos(cue),
        axis = [];

    // If we have a line number to align the cue to.
    if (cue.snapToLines) {
      var size;
      switch (cue.vertical) {
      case "":
        axis = [ "+y", "-y" ];
        size = "height";
        break;
      case "rl":
        axis = [ "+x", "-x" ];
        size = "width";
        break;
      case "lr":
        axis = [ "-x", "+x" ];
        size = "width";
        break;
      }

      var step = boxPosition.lineHeight,
          position = step * Math.round(linePos),
          maxPosition = containerBox[size] + step,
          initialAxis = axis[0];

      // If the specified intial position is greater then the max position then
      // clamp the box to the amount of steps it would take for the box to
      // reach the max position.
      if (Math.abs(position) > maxPosition) {
        position = position < 0 ? -1 : 1;
        position *= Math.ceil(maxPosition / step) * step;
      }

      // If computed line position returns negative then line numbers are
      // relative to the bottom of the video instead of the top. Therefore, we
      // need to increase our initial position by the length or width of the
      // video, depending on the writing direction, and reverse our axis directions.
      if (linePos < 0) {
        position += cue.vertical === "" ? containerBox.height : containerBox.width;
        axis = axis.reverse();
      }

      // Move the box to the specified position. This may not be its best
      // position.
      boxPosition.move(initialAxis, position);

    } else {
      // If we have a percentage line value for the cue.
      var calculatedPercentage = (boxPosition.lineHeight / containerBox.height) * 100;

      switch (cue.lineAlign) {
      case "middle":
        linePos -= (calculatedPercentage / 2);
        break;
      case "end":
        linePos -= calculatedPercentage;
        break;
      }

      // Apply initial line position to the cue box.
      switch (cue.vertical) {
      case "":
        styleBox.applyStyles({
          top: styleBox.formatStyle(linePos, "%")
        });
        break;
      case "rl":
        styleBox.applyStyles({
          left: styleBox.formatStyle(linePos, "%")
        });
        break;
      case "lr":
        styleBox.applyStyles({
          right: styleBox.formatStyle(linePos, "%")
        });
        break;
      }

      axis = [ "+y", "-x", "+x", "-y" ];

      // Get the box position again after we've applied the specified positioning
      // to it.
      boxPosition = new BoxPosition(styleBox);
    }

    var bestPosition = findBestPosition(boxPosition, axis);
    styleBox.move(bestPosition.toCSSCompatValues(containerBox));
  }

  function WebVTT() {
    // Nothing
  }

  // Helper to allow strings to be decoded instead of the default binary utf8 data.
  WebVTT.StringDecoder = function() {
    return {
      decode: function(data) {
        if (!data) {
          return "";
        }
        if (typeof data !== "string") {
          throw new Error("Error - expected string data.");
        }
        return decodeURIComponent(encodeURIComponent(data));
      }
    };
  };

  WebVTT.convertCueToDOMTree = function(window, cuetext) {
    if (!window || !cuetext) {
      return null;
    }
    return parseContent(window, cuetext);
  };

  var FONT_SIZE_PERCENT = 0.05;
  var FONT_STYLE = "sans-serif";
  var CUE_BACKGROUND_PADDING = "1.5%";

  // Runs the processing model over the cues and regions passed to it.
  // @param overlay A block level element (usually a div) that the computed cues
  //                and regions will be placed into.
  WebVTT.processCues = function(window, cues, overlay) {
    if (!window || !cues || !overlay) {
      return null;
    }

    // Remove all previous children.
    while (overlay.firstChild) {
      overlay.removeChild(overlay.firstChild);
    }

    var paddedOverlay = window.document.createElement("div");
    paddedOverlay.style.position = "absolute";
    paddedOverlay.style.left = "0";
    paddedOverlay.style.right = "0";
    paddedOverlay.style.top = "0";
    paddedOverlay.style.bottom = "0";
    paddedOverlay.style.margin = CUE_BACKGROUND_PADDING;
    overlay.appendChild(paddedOverlay);

    // Determine if we need to compute the display states of the cues. This could
    // be the case if a cue's state has been changed since the last computation or
    // if it has not been computed yet.
    function shouldCompute(cues) {
      for (var i = 0; i < cues.length; i++) {
        if (cues[i].hasBeenReset || !cues[i].displayState) {
          return true;
        }
      }
      return false;
    }

    // We don't need to recompute the cues' display states. Just reuse them.
    if (!shouldCompute(cues)) {
      for (var i = 0; i < cues.length; i++) {
        paddedOverlay.appendChild(cues[i].displayState);
      }
      return;
    }

    var boxPositions = [],
        containerBox = BoxPosition.getSimpleBoxPosition(paddedOverlay),
        fontSize = Math.round(containerBox.height * FONT_SIZE_PERCENT * 100) / 100;
    var styleOptions = {
      font: fontSize + "px " + FONT_STYLE
    };

    (function() {
      var styleBox, cue;

      for (var i = 0; i < cues.length; i++) {
        cue = cues[i];

        // Compute the intial position and styles of the cue div.
        styleBox = new CueStyleBox(window, cue, styleOptions);
        paddedOverlay.appendChild(styleBox.div);

        // Move the cue div to it's correct line position.
        moveBoxToLinePosition(window, styleBox, containerBox, boxPositions);

        // Remember the computed div so that we don't have to recompute it later
        // if we don't have too.
        cue.displayState = styleBox.div;

        boxPositions.push(BoxPosition.getSimpleBoxPosition(styleBox));
      }
    })();
  };

  WebVTT.Parser = function(window, decoder) {
    this.window = window;
    this.state = "INITIAL";
    this.buffer = "";
    this.decoder = decoder || new TextDecoder("utf8");
    this.regionList = [];
  };

  WebVTT.Parser.prototype = {
    // If the error is a ParsingError then report it to the consumer if
    // possible. If it's not a ParsingError then throw it like normal.
    reportOrThrowError: function(e) {
      if (e instanceof ParsingError) {
        this.onparsingerror && this.onparsingerror(e);
      } else {
        throw e;
      }
    },
    parse: function (data) {
      var self = this;

      // If there is no data then we won't decode it, but will just try to parse
      // whatever is in buffer already. This may occur in circumstances, for
      // example when flush() is called.
      if (data) {
        // Try to decode the data that we received.
        self.buffer += self.decoder.decode(data, {stream: true});
      }

      function collectNextLine() {
        var buffer = self.buffer;
        var pos = 0;
        while (pos < buffer.length && buffer[pos] !== '\r' && buffer[pos] !== '\n') {
          ++pos;
        }
        var line = buffer.substr(0, pos);
        // Advance the buffer early in case we fail below.
        if (buffer[pos] === '\r') {
          ++pos;
        }
        if (buffer[pos] === '\n') {
          ++pos;
        }
        self.buffer = buffer.substr(pos);
        return line;
      }

      // 3.4 WebVTT region and WebVTT region settings syntax
      function parseRegion(input) {
        var settings = new Settings();

        parseOptions(input, function (k, v) {
          switch (k) {
          case "id":
            settings.set(k, v);
            break;
          case "width":
            settings.percent(k, v);
            break;
          case "lines":
            settings.integer(k, v);
            break;
          case "regionanchor":
          case "viewportanchor":
            var xy = v.split(',');
            if (xy.length !== 2) {
              break;
            }
            // We have to make sure both x and y parse, so use a temporary
            // settings object here.
            var anchor = new Settings();
            anchor.percent("x", xy[0]);
            anchor.percent("y", xy[1]);
            if (!anchor.has("x") || !anchor.has("y")) {
              break;
            }
            settings.set(k + "X", anchor.get("x"));
            settings.set(k + "Y", anchor.get("y"));
            break;
          case "scroll":
            settings.alt(k, v, ["up"]);
            break;
          }
        }, /=/, /\s/);

        // Create the region, using default values for any values that were not
        // specified.
        if (settings.has("id")) {
          var region = new self.window.VTTRegion();
          region.width = settings.get("width", 100);
          region.lines = settings.get("lines", 3);
          region.regionAnchorX = settings.get("regionanchorX", 0);
          region.regionAnchorY = settings.get("regionanchorY", 100);
          region.viewportAnchorX = settings.get("viewportanchorX", 0);
          region.viewportAnchorY = settings.get("viewportanchorY", 100);
          region.scroll = settings.get("scroll", "");
          // Register the region.
          self.onregion && self.onregion(region);
          // Remember the VTTRegion for later in case we parse any VTTCues that
          // reference it.
          self.regionList.push({
            id: settings.get("id"),
            region: region
          });
        }
      }

      // 3.2 WebVTT metadata header syntax
      function parseHeader(input) {
        parseOptions(input, function (k, v) {
          switch (k) {
          case "Region":
            // 3.3 WebVTT region metadata header syntax
            parseRegion(v);
            break;
          }
        }, /:/);
      }

      // 5.1 WebVTT file parsing.
      try {
        var line;
        if (self.state === "INITIAL") {
          // We can't start parsing until we have the first line.
          if (!/\r\n|\n/.test(self.buffer)) {
            return this;
          }

          line = collectNextLine();

          var m = line.match(/^WEBVTT([ \t].*)?$/);
          if (!m || !m[0]) {
            throw new ParsingError(ParsingError.Errors.BadSignature);
          }

          self.state = "HEADER";
        }

        var alreadyCollectedLine = false;
        while (self.buffer) {
          // We can't parse a line until we have the full line.
          if (!/\r\n|\n/.test(self.buffer)) {
            return this;
          }

          if (!alreadyCollectedLine) {
            line = collectNextLine();
          } else {
            alreadyCollectedLine = false;
          }

          switch (self.state) {
          case "HEADER":
            // 13-18 - Allow a header (metadata) under the WEBVTT line.
            if (/:/.test(line)) {
              parseHeader(line);
            } else if (!line) {
              // An empty line terminates the header and starts the body (cues).
              self.state = "ID";
            }
            continue;
          case "NOTE":
            // Ignore NOTE blocks.
            if (!line) {
              self.state = "ID";
            }
            continue;
          case "ID":
            // Check for the start of NOTE blocks.
            if (/^NOTE($|[ \t])/.test(line)) {
              self.state = "NOTE";
              break;
            }
            // 19-29 - Allow any number of line terminators, then initialize new cue values.
            if (!line) {
              continue;
            }
            self.cue = new self.window.VTTCue(0, 0, "");
            self.state = "CUE";
            // 30-39 - Check if self line contains an optional identifier or timing data.
            if (line.indexOf("-->") === -1) {
              self.cue.id = line;
              continue;
            }
            // Process line as start of a cue.
            /*falls through*/
          case "CUE":
            // 40 - Collect cue timings and settings.
            try {
              parseCue(line, self.cue, self.regionList);
            } catch (e) {
              self.reportOrThrowError(e);
              // In case of an error ignore rest of the cue.
              self.cue = null;
              self.state = "BADCUE";
              continue;
            }
            self.state = "CUETEXT";
            continue;
          case "CUETEXT":
            var hasSubstring = line.indexOf("-->") !== -1;
            // 34 - If we have an empty line then report the cue.
            // 35 - If we have the special substring '-->' then report the cue,
            // but do not collect the line as we need to process the current
            // one as a new cue.
            if (!line || hasSubstring && (alreadyCollectedLine = true)) {
              // We are done parsing self cue.
              self.oncue && self.oncue(self.cue);
              self.cue = null;
              self.state = "ID";
              continue;
            }
            if (self.cue.text) {
              self.cue.text += "\n";
            }
            self.cue.text += line;
            continue;
          case "BADCUE": // BADCUE
            // 54-62 - Collect and discard the remaining cue.
            if (!line) {
              self.state = "ID";
            }
            continue;
          }
        }
      } catch (e) {
        self.reportOrThrowError(e);

        // If we are currently parsing a cue, report what we have.
        if (self.state === "CUETEXT" && self.cue && self.oncue) {
          self.oncue(self.cue);
        }
        self.cue = null;
        // Enter BADWEBVTT state if header was not parsed correctly otherwise
        // another exception occurred so enter BADCUE state.
        self.state = self.state === "INITIAL" ? "BADWEBVTT" : "BADCUE";
      }
      return this;
    },
    flush: function () {
      var self = this;
      try {
        // Finish decoding the stream.
        self.buffer += self.decoder.decode();
        // Synthesize the end of the current cue or region.
        if (self.cue || self.state === "HEADER") {
          self.buffer += "\n\n";
          self.parse();
        }
        // If we've flushed, parsed, and we're still on the INITIAL state then
        // that means we don't have enough of the stream to parse the first
        // line.
        if (self.state === "INITIAL") {
          throw new ParsingError(ParsingError.Errors.BadSignature);
        }
      } catch(e) {
        self.reportOrThrowError(e);
      }
      self.onflush && self.onflush();
      return this;
    }
  };

  global.WebVTT = WebVTT;

}(this));

// If we're in node require encoding-indexes and attach it to the global.
if (typeof module !== "undefined" && module.exports) {
  this["encoding-indexes"] = require("./encoding-indexes.js")["encoding-indexes"];
}

(function(global) {
  'use strict';

  //
  // Utilities
  //

  /**
   * @param {number} a The number to test.
   * @param {number} min The minimum value in the range, inclusive.
   * @param {number} max The maximum value in the range, inclusive.
   * @return {boolean} True if a >= min and a <= max.
   */
  function inRange(a, min, max) {
    return min <= a && a <= max;
  }

  /**
   * @param {number} n The numerator.
   * @param {number} d The denominator.
   * @return {number} The result of the integer division of n by d.
   */
  function div(n, d) {
    return Math.floor(n / d);
  }


  //
  // Implementation of Encoding specification
  // http://dvcs.w3.org/hg/encoding/raw-file/tip/Overview.html
  //

  //
  // 3. Terminology
  //

  //
  // 4. Encodings
  //

  /** @const */ var EOF_byte = -1;
  /** @const */ var EOF_code_point = -1;

  /**
   * @constructor
   * @param {Uint8Array} bytes Array of bytes that provide the stream.
   */
  function ByteInputStream(bytes) {
    /** @type {number} */
    var pos = 0;

    /**
     * @this {ByteInputStream}
     * @return {number} Get the next byte from the stream.
     */
    this.get = function() {
      return (pos >= bytes.length) ? EOF_byte : Number(bytes[pos]);
    };

    /** @param {number} n Number (positive or negative) by which to
     *      offset the byte pointer. */
    this.offset = function(n) {
      pos += n;
      if (pos < 0) {
        throw new Error('Seeking past start of the buffer');
      }
      if (pos > bytes.length) {
        throw new Error('Seeking past EOF');
      }
    };

    /**
     * @param {Array.<number>} test Array of bytes to compare against.
     * @return {boolean} True if the start of the stream matches the test
     *     bytes.
     */
    this.match = function(test) {
      if (test.length > pos + bytes.length) {
        return false;
      }
      var i;
      for (i = 0; i < test.length; i += 1) {
        if (Number(bytes[pos + i]) !== test[i]) {
          return false;
        }
      }
      return true;
    };
  }

  /**
   * @constructor
   * @param {Array.<number>} bytes The array to write bytes into.
   */
  function ByteOutputStream(bytes) {
    /** @type {number} */
    var pos = 0;

    /**
     * @param {...number} var_args The byte or bytes to emit into the stream.
     * @return {number} The last byte emitted.
     */
    this.emit = function(var_args) {
      /** @type {number} */
      var last = EOF_byte;
      var i;
      for (i = 0; i < arguments.length; ++i) {
        last = Number(arguments[i]);
        bytes[pos++] = last;
      }
      return last;
    };
  }

  /**
   * @constructor
   * @param {string} string The source of code units for the stream.
   */
  function CodePointInputStream(string) {
    /**
     * @param {string} string Input string of UTF-16 code units.
     * @return {Array.<number>} Code points.
     */
    function stringToCodePoints(string) {
      /** @type {Array.<number>} */
      var cps = [];
      // Based on http://www.w3.org/TR/WebIDL/#idl-DOMString
      var i = 0, n = string.length;
      while (i < string.length) {
        var c = string.charCodeAt(i);
        if (!inRange(c, 0xD800, 0xDFFF)) {
          cps.push(c);
        } else if (inRange(c, 0xDC00, 0xDFFF)) {
          cps.push(0xFFFD);
        } else { // (inRange(cu, 0xD800, 0xDBFF))
          if (i === n - 1) {
            cps.push(0xFFFD);
          } else {
            var d = string.charCodeAt(i + 1);
            if (inRange(d, 0xDC00, 0xDFFF)) {
              var a = c & 0x3FF;
              var b = d & 0x3FF;
              i += 1;
              cps.push(0x10000 + (a << 10) + b);
            } else {
              cps.push(0xFFFD);
            }
          }
        }
        i += 1;
      }
      return cps;
    }

    /** @type {number} */
    var pos = 0;
    /** @type {Array.<number>} */
    var cps = stringToCodePoints(string);

    /** @param {number} n The number of bytes (positive or negative)
     *      to advance the code point pointer by.*/
    this.offset = function(n) {
      pos += n;
      if (pos < 0) {
        throw new Error('Seeking past start of the buffer');
      }
      if (pos > cps.length) {
        throw new Error('Seeking past EOF');
      }
    };


    /** @return {number} Get the next code point from the stream. */
    this.get = function() {
      if (pos >= cps.length) {
        return EOF_code_point;
      }
      return cps[pos];
    };
  }

  /**
   * @constructor
   */
  function CodePointOutputStream() {
    /** @type {string} */
    var string = '';

    /** @return {string} The accumulated string. */
    this.string = function() {
      return string;
    };

    /** @param {number} c The code point to encode into the stream. */
    this.emit = function(c) {
      if (c <= 0xFFFF) {
        string += String.fromCharCode(c);
      } else {
        c -= 0x10000;
        string += String.fromCharCode(0xD800 + ((c >> 10) & 0x3ff));
        string += String.fromCharCode(0xDC00 + (c & 0x3ff));
      }
    };
  }

  /**
   * @constructor
   * @param {string} message Description of the error.
   */
  function EncodingError(message) {
    this.name = 'EncodingError';
    this.message = message;
    this.code = 0;
  }
  EncodingError.prototype = Error.prototype;

  /**
   * @param {boolean} fatal If true, decoding errors raise an exception.
   * @param {number=} opt_code_point Override the standard fallback code point.
   * @return {number} The code point to insert on a decoding error.
   */
  function decoderError(fatal, opt_code_point) {
    if (fatal) {
      throw new EncodingError('Decoder error');
    }
    return opt_code_point || 0xFFFD;
  }

  /**
   * @param {number} code_point The code point that could not be encoded.
   * @return {number} Always throws, no value is actually returned.
   */
  function encoderError(code_point) {
    throw new EncodingError('The code point ' + code_point +
                            ' could not be encoded.');
  }

  /**
   * @param {string} label The encoding label.
   * @return {?{name:string,labels:Array.<string>}}
   */
  function getEncoding(label) {
    label = String(label).trim().toLowerCase();
    if (Object.prototype.hasOwnProperty.call(label_to_encoding, label)) {
      return label_to_encoding[label];
    }
    return null;
  }

  /** @type {Array.<{encodings: Array.<{name:string,labels:Array.<string>}>,
   *      heading: string}>} */
  var encodings = [
    {
      "encodings": [
        {
          "labels": [
            "unicode-1-1-utf-8",
            "utf-8",
            "utf8"
          ],
          "name": "utf-8"
        }
      ],
      "heading": "The Encoding"
    },
    {
      "encodings": [
        {
          "labels": [
            "866",
            "cp866",
            "csibm866",
            "ibm866"
          ],
          "name": "ibm866"
        },
        {
          "labels": [
            "csisolatin2",
            "iso-8859-2",
            "iso-ir-101",
            "iso8859-2",
            "iso88592",
            "iso_8859-2",
            "iso_8859-2:1987",
            "l2",
            "latin2"
          ],
          "name": "iso-8859-2"
        },
        {
          "labels": [
            "csisolatin3",
            "iso-8859-3",
            "iso-ir-109",
            "iso8859-3",
            "iso88593",
            "iso_8859-3",
            "iso_8859-3:1988",
            "l3",
            "latin3"
          ],
          "name": "iso-8859-3"
        },
        {
          "labels": [
            "csisolatin4",
            "iso-8859-4",
            "iso-ir-110",
            "iso8859-4",
            "iso88594",
            "iso_8859-4",
            "iso_8859-4:1988",
            "l4",
            "latin4"
          ],
          "name": "iso-8859-4"
        },
        {
          "labels": [
            "csisolatincyrillic",
            "cyrillic",
            "iso-8859-5",
            "iso-ir-144",
            "iso8859-5",
            "iso88595",
            "iso_8859-5",
            "iso_8859-5:1988"
          ],
          "name": "iso-8859-5"
        },
        {
          "labels": [
            "arabic",
            "asmo-708",
            "csiso88596e",
            "csiso88596i",
            "csisolatinarabic",
            "ecma-114",
            "iso-8859-6",
            "iso-8859-6-e",
            "iso-8859-6-i",
            "iso-ir-127",
            "iso8859-6",
            "iso88596",
            "iso_8859-6",
            "iso_8859-6:1987"
          ],
          "name": "iso-8859-6"
        },
        {
          "labels": [
            "csisolatingreek",
            "ecma-118",
            "elot_928",
            "greek",
            "greek8",
            "iso-8859-7",
            "iso-ir-126",
            "iso8859-7",
            "iso88597",
            "iso_8859-7",
            "iso_8859-7:1987",
            "sun_eu_greek"
          ],
          "name": "iso-8859-7"
        },
        {
          "labels": [
            "csiso88598e",
            "csisolatinhebrew",
            "hebrew",
            "iso-8859-8",
            "iso-8859-8-e",
            "iso-ir-138",
            "iso8859-8",
            "iso88598",
            "iso_8859-8",
            "iso_8859-8:1988",
            "visual"
          ],
          "name": "iso-8859-8"
        },
        {
          "labels": [
            "csiso88598i",
            "iso-8859-8-i",
            "logical"
          ],
          "name": "iso-8859-8-i"
        },
        {
          "labels": [
            "csisolatin6",
            "iso-8859-10",
            "iso-ir-157",
            "iso8859-10",
            "iso885910",
            "l6",
            "latin6"
          ],
          "name": "iso-8859-10"
        },
        {
          "labels": [
            "iso-8859-13",
            "iso8859-13",
            "iso885913"
          ],
          "name": "iso-8859-13"
        },
        {
          "labels": [
            "iso-8859-14",
            "iso8859-14",
            "iso885914"
          ],
          "name": "iso-8859-14"
        },
        {
          "labels": [
            "csisolatin9",
            "iso-8859-15",
            "iso8859-15",
            "iso885915",
            "iso_8859-15",
            "l9"
          ],
          "name": "iso-8859-15"
        },
        {
          "labels": [
            "iso-8859-16"
          ],
          "name": "iso-8859-16"
        },
        {
          "labels": [
            "cskoi8r",
            "koi",
            "koi8",
            "koi8-r",
            "koi8_r"
          ],
          "name": "koi8-r"
        },
        {
          "labels": [
            "koi8-u"
          ],
          "name": "koi8-u"
        },
        {
          "labels": [
            "csmacintosh",
            "mac",
            "macintosh",
            "x-mac-roman"
          ],
          "name": "macintosh"
        },
        {
          "labels": [
            "dos-874",
            "iso-8859-11",
            "iso8859-11",
            "iso885911",
            "tis-620",
            "windows-874"
          ],
          "name": "windows-874"
        },
        {
          "labels": [
            "cp1250",
            "windows-1250",
            "x-cp1250"
          ],
          "name": "windows-1250"
        },
        {
          "labels": [
            "cp1251",
            "windows-1251",
            "x-cp1251"
          ],
          "name": "windows-1251"
        },
        {
          "labels": [
            "ansi_x3.4-1968",
            "ascii",
            "cp1252",
            "cp819",
            "csisolatin1",
            "ibm819",
            "iso-8859-1",
            "iso-ir-100",
            "iso8859-1",
            "iso88591",
            "iso_8859-1",
            "iso_8859-1:1987",
            "l1",
            "latin1",
            "us-ascii",
            "windows-1252",
            "x-cp1252"
          ],
          "name": "windows-1252"
        },
        {
          "labels": [
            "cp1253",
            "windows-1253",
            "x-cp1253"
          ],
          "name": "windows-1253"
        },
        {
          "labels": [
            "cp1254",
            "csisolatin5",
            "iso-8859-9",
            "iso-ir-148",
            "iso8859-9",
            "iso88599",
            "iso_8859-9",
            "iso_8859-9:1989",
            "l5",
            "latin5",
            "windows-1254",
            "x-cp1254"
          ],
          "name": "windows-1254"
        },
        {
          "labels": [
            "cp1255",
            "windows-1255",
            "x-cp1255"
          ],
          "name": "windows-1255"
        },
        {
          "labels": [
            "cp1256",
            "windows-1256",
            "x-cp1256"
          ],
          "name": "windows-1256"
        },
        {
          "labels": [
            "cp1257",
            "windows-1257",
            "x-cp1257"
          ],
          "name": "windows-1257"
        },
        {
          "labels": [
            "cp1258",
            "windows-1258",
            "x-cp1258"
          ],
          "name": "windows-1258"
        },
        {
          "labels": [
            "x-mac-cyrillic",
            "x-mac-ukrainian"
          ],
          "name": "x-mac-cyrillic"
        }
      ],
      "heading": "Legacy single-byte encodings"
    },
    {
      "encodings": [
        {
          "labels": [
            "chinese",
            "csgb2312",
            "csiso58gb231280",
            "gb18030",
            "gb2312",
            "gb_2312",
            "gb_2312-80",
            "gbk",
            "iso-ir-58",
            "x-gbk"
          ],
          "name": "gb18030"
        },
        {
          "labels": [
            "hz-gb-2312"
          ],
          "name": "hz-gb-2312"
        }
      ],
      "heading": "Legacy multi-byte Chinese (simplified) encodings"
    },
    {
      "encodings": [
        {
          "labels": [
            "big5",
            "big5-hkscs",
            "cn-big5",
            "csbig5",
            "x-x-big5"
          ],
          "name": "big5"
        }
      ],
      "heading": "Legacy multi-byte Chinese (traditional) encodings"
    },
    {
      "encodings": [
        {
          "labels": [
            "cseucpkdfmtjapanese",
            "euc-jp",
            "x-euc-jp"
          ],
          "name": "euc-jp"
        },
        {
          "labels": [
            "csiso2022jp",
            "iso-2022-jp"
          ],
          "name": "iso-2022-jp"
        },
        {
          "labels": [
            "csshiftjis",
            "ms_kanji",
            "shift-jis",
            "shift_jis",
            "sjis",
            "windows-31j",
            "x-sjis"
          ],
          "name": "shift_jis"
        }
      ],
      "heading": "Legacy multi-byte Japanese encodings"
    },
    {
      "encodings": [
        {
          "labels": [
            "cseuckr",
            "csksc56011987",
            "euc-kr",
            "iso-ir-149",
            "korean",
            "ks_c_5601-1987",
            "ks_c_5601-1989",
            "ksc5601",
            "ksc_5601",
            "windows-949"
          ],
          "name": "euc-kr"
        }
      ],
      "heading": "Legacy multi-byte Korean encodings"
    },
    {
      "encodings": [
        {
          "labels": [
            "csiso2022kr",
            "iso-2022-cn",
            "iso-2022-cn-ext",
            "iso-2022-kr"
          ],
          "name": "replacement"
        },
        {
          "labels": [
            "utf-16be"
          ],
          "name": "utf-16be"
        },
        {
          "labels": [
            "utf-16",
            "utf-16le"
          ],
          "name": "utf-16le"
        },
        {
          "labels": [
            "x-user-defined"
          ],
          "name": "x-user-defined"
        }
      ],
      "heading": "Legacy miscellaneous encodings"
    }
  ];

  var name_to_encoding = {};
  var label_to_encoding = {};
  encodings.forEach(function(category) {
    category['encodings'].forEach(function(encoding) {
      name_to_encoding[encoding['name']] = encoding;
      encoding['labels'].forEach(function(label) {
        label_to_encoding[label] = encoding;
      });
    });
  });

  //
  // 5. Indexes
  //

  /**
   * @param {number} pointer The |pointer| to search for.
   * @param {Array.<?number>|undefined} index The |index| to search within.
   * @return {?number} The code point corresponding to |pointer| in |index|,
   *     or null if |code point| is not in |index|.
   */
  function indexCodePointFor(pointer, index) {
    if (!index) return null;
    return index[pointer] || null;
  }

  /**
   * @param {number} code_point The |code point| to search for.
   * @param {Array.<?number>} index The |index| to search within.
   * @return {?number} The first pointer corresponding to |code point| in
   *     |index|, or null if |code point| is not in |index|.
   */
  function indexPointerFor(code_point, index) {
    var pointer = index.indexOf(code_point);
    return pointer === -1 ? null : pointer;
  }

  /**
   * @param {string} name Name of the index.
   * @return {(Array.<number>|Array.<Array.<number>>)}
   *  */
  function index(name) {
    if (!('encoding-indexes' in global))
      throw new Error("Indexes missing. Did you forget to include encoding-indexes.js?");
    return global['encoding-indexes'][name];
  }

  /**
   * @param {number} pointer The |pointer| to search for in the gb18030 index.
   * @return {?number} The code point corresponding to |pointer| in |index|,
   *     or null if |code point| is not in the gb18030 index.
   */
  function indexGB18030CodePointFor(pointer) {
    if ((pointer > 39419 && pointer < 189000) || (pointer > 1237575)) {
      return null;
    }
    var /** @type {number} */ offset = 0,
        /** @type {number} */ code_point_offset = 0,
        /** @type {Array.<Array.<number>>} */ idx = index('gb18030');
    var i;
    for (i = 0; i < idx.length; ++i) {
      var entry = idx[i];
      if (entry[0] <= pointer) {
        offset = entry[0];
        code_point_offset = entry[1];
      } else {
        break;
      }
    }
    return code_point_offset + pointer - offset;
  }

  /**
   * @param {number} code_point The |code point| to locate in the gb18030 index.
   * @return {number} The first pointer corresponding to |code point| in the
   *     gb18030 index.
   */
  function indexGB18030PointerFor(code_point) {
    var /** @type {number} */ offset = 0,
        /** @type {number} */ pointer_offset = 0,
        /** @type {Array.<Array.<number>>} */ idx = index('gb18030');
    var i;
    for (i = 0; i < idx.length; ++i) {
      var entry = idx[i];
      if (entry[1] <= code_point) {
        offset = entry[1];
        pointer_offset = entry[0];
      } else {
        break;
      }
    }
    return pointer_offset + code_point - offset;
  }


  //
  // 7. API
  //

  /** @const */ var DEFAULT_ENCODING = 'utf-8';

  // 7.1 Interface TextDecoder

  /**
   * @constructor
   * @param {string=} opt_encoding The label of the encoding;
   *     defaults to 'utf-8'.
   * @param {{fatal: boolean}=} options
   */
  function TextDecoder(opt_encoding, options) {
    if (!(this instanceof TextDecoder)) {
      return new TextDecoder(opt_encoding, options);
    }
    opt_encoding = opt_encoding ? String(opt_encoding) : DEFAULT_ENCODING;
    options = Object(options);
    /** @private */
    this._encoding = getEncoding(opt_encoding);
    if (this._encoding === null || this._encoding.name === 'replacement')
      throw new TypeError('Unknown encoding: ' + opt_encoding);

    if (!this._encoding.getDecoder)
      throw new Error('Decoder not present. Did you forget to include encoding-indexes.js?');

    /** @private @type {boolean} */
    this._streaming = false;
    /** @private @type {boolean} */
    this._BOMseen = false;
    /** @private */
    this._decoder = null;
    /** @private @type {{fatal: boolean}=} */
    this._options = { fatal: Boolean(options.fatal) };

    if (Object.defineProperty) {
      Object.defineProperty(
          this, 'encoding',
          { get: function() { return this._encoding.name; } });
    } else {
      this.encoding = this._encoding.name;
    }

    return this;
  }

  // TODO: Issue if input byte stream is offset by decoder
  // TODO: BOM detection will not work if stream header spans multiple calls
  // (last N bytes of previous stream may need to be retained?)
  TextDecoder.prototype = {
    /**
     * @param {ArrayBufferView=} opt_view The buffer of bytes to decode.
     * @param {{stream: boolean}=} options
     */
    decode: function decode(opt_view, options) {
      if (opt_view && !('buffer' in opt_view && 'byteOffset' in opt_view &&
                        'byteLength' in opt_view)) {
        throw new TypeError('Expected ArrayBufferView');
      } else if (!opt_view) {
        opt_view = new Uint8Array(0);
      }
      options = Object(options);

      if (!this._streaming) {
        this._decoder = this._encoding.getDecoder(this._options);
        this._BOMseen = false;
      }
      this._streaming = Boolean(options.stream);

      var bytes = new Uint8Array(opt_view.buffer,
                                 opt_view.byteOffset,
                                 opt_view.byteLength);
      var input_stream = new ByteInputStream(bytes);

      var output_stream = new CodePointOutputStream();

      /** @type {number} */
      var code_point;

      while (input_stream.get() !== EOF_byte) {
        code_point = this._decoder.decode(input_stream);
        if (code_point !== null && code_point !== EOF_code_point) {
          output_stream.emit(code_point);
        }
      }
      if (!this._streaming) {
        do {
          code_point = this._decoder.decode(input_stream);
          if (code_point !== null && code_point !== EOF_code_point) {
            output_stream.emit(code_point);
          }
        } while (code_point !== EOF_code_point &&
                 input_stream.get() != EOF_byte);
        this._decoder = null;
      }

      var result = output_stream.string();
      if (!this._BOMseen && result.length) {
        this._BOMseen = true;
        if (['utf-8', 'utf-16le', 'utf-16be'].indexOf(this.encoding) !== -1 &&
           result.charCodeAt(0) === 0xFEFF) {
          result = result.substring(1);
        }
      }

      return result;
    }
  };

  // 7.2 Interface TextEncoder

  /**
   * @constructor
   * @param {string=} opt_encoding The label of the encoding;
   *     defaults to 'utf-8'.
   * @param {{fatal: boolean}=} options
   */
  function TextEncoder(opt_encoding, options) {
    if (!(this instanceof TextEncoder)) {
      return new TextEncoder(opt_encoding, options);
    }
    opt_encoding = opt_encoding ? String(opt_encoding) : DEFAULT_ENCODING;
    options = Object(options);
    /** @private */
    this._encoding = getEncoding(opt_encoding);

    var allowLegacyEncoding = options.NONSTANDARD_allowLegacyEncoding;
    var isLegacyEncoding = (this._encoding.name !== 'utf-8' &&
                            this._encoding.name !== 'utf-16le' &&
                            this._encoding.name !== 'utf-16be');
    if (this._encoding === null || (isLegacyEncoding && !allowLegacyEncoding))
      throw new TypeError('Unknown encoding: ' + opt_encoding);

    if (!this._encoding.getEncoder)
      throw new Error('Encoder not present. Did you forget to include encoding-indexes.js?');

    /** @private @type {boolean} */
    this._streaming = false;
    /** @private */
    this._encoder = null;
    /** @private @type {{fatal: boolean}=} */
    this._options = { fatal: Boolean(options.fatal) };

    if (Object.defineProperty) {
      Object.defineProperty(
          this, 'encoding',
          { get: function() { return this._encoding.name; } });
    } else {
      this.encoding = this._encoding.name;
    }

    return this;
  }

  TextEncoder.prototype = {
    /**
     * @param {string=} opt_string The string to encode.
     * @param {{stream: boolean}=} options
     */
    encode: function encode(opt_string, options) {
      opt_string = opt_string ? String(opt_string) : '';
      options = Object(options);
      // TODO: any options?
      if (!this._streaming) {
        this._encoder = this._encoding.getEncoder(this._options);
      }
      this._streaming = Boolean(options.stream);

      var bytes = [];
      var output_stream = new ByteOutputStream(bytes);
      var input_stream = new CodePointInputStream(opt_string);
      while (input_stream.get() !== EOF_code_point) {
        this._encoder.encode(output_stream, input_stream);
      }
      if (!this._streaming) {
        /** @type {number} */
        var last_byte;
        do {
          last_byte = this._encoder.encode(output_stream, input_stream);
        } while (last_byte !== EOF_byte);
        this._encoder = null;
      }
      return new Uint8Array(bytes);
    }
  };


  //
  // 8. The encoding
  //

  // 8.1 utf-8

  /**
   * @constructor
    * @param {{fatal: boolean}} options
   */
  function UTF8Decoder(options) {
    var fatal = options.fatal;
    var /** @type {number} */ utf8_code_point = 0,
        /** @type {number} */ utf8_bytes_needed = 0,
        /** @type {number} */ utf8_bytes_seen = 0,
        /** @type {number} */ utf8_lower_boundary = 0;

    /**
     * @param {ByteInputStream} byte_pointer The byte stream to decode.
     * @return {?number} The next code point decoded, or null if not enough
     *     data exists in the input stream to decode a complete code point.
     */
    this.decode = function(byte_pointer) {
      var bite = byte_pointer.get();
      if (bite === EOF_byte) {
        if (utf8_bytes_needed !== 0) {
          return decoderError(fatal);
        }
        return EOF_code_point;
      }
      byte_pointer.offset(1);

      if (utf8_bytes_needed === 0) {
        if (inRange(bite, 0x00, 0x7F)) {
          return bite;
        }
        if (inRange(bite, 0xC2, 0xDF)) {
          utf8_bytes_needed = 1;
          utf8_lower_boundary = 0x80;
          utf8_code_point = bite - 0xC0;
        } else if (inRange(bite, 0xE0, 0xEF)) {
          utf8_bytes_needed = 2;
          utf8_lower_boundary = 0x800;
          utf8_code_point = bite - 0xE0;
        } else if (inRange(bite, 0xF0, 0xF4)) {
          utf8_bytes_needed = 3;
          utf8_lower_boundary = 0x10000;
          utf8_code_point = bite - 0xF0;
        } else {
          return decoderError(fatal);
        }
        utf8_code_point = utf8_code_point * Math.pow(64, utf8_bytes_needed);
        return null;
      }
      if (!inRange(bite, 0x80, 0xBF)) {
        utf8_code_point = 0;
        utf8_bytes_needed = 0;
        utf8_bytes_seen = 0;
        utf8_lower_boundary = 0;
        byte_pointer.offset(-1);
        return decoderError(fatal);
      }
      utf8_bytes_seen += 1;
      utf8_code_point = utf8_code_point + (bite - 0x80) *
          Math.pow(64, utf8_bytes_needed - utf8_bytes_seen);
      if (utf8_bytes_seen !== utf8_bytes_needed) {
        return null;
      }
      var code_point = utf8_code_point;
      var lower_boundary = utf8_lower_boundary;
      utf8_code_point = 0;
      utf8_bytes_needed = 0;
      utf8_bytes_seen = 0;
      utf8_lower_boundary = 0;
      if (inRange(code_point, lower_boundary, 0x10FFFF) &&
          !inRange(code_point, 0xD800, 0xDFFF)) {
        return code_point;
      }
      return decoderError(fatal);
    };
  }

  /**
   * @constructor
   * @param {{fatal: boolean}} options
   */
  function UTF8Encoder(options) {
    var fatal = options.fatal;
    /**
     * @param {ByteOutputStream} output_byte_stream Output byte stream.
     * @param {CodePointInputStream} code_point_pointer Input stream.
     * @return {number} The last byte emitted.
     */
    this.encode = function(output_byte_stream, code_point_pointer) {
      /** @type {number} */
      var code_point = code_point_pointer.get();
      if (code_point === EOF_code_point) {
        return EOF_byte;
      }
      code_point_pointer.offset(1);
      if (inRange(code_point, 0xD800, 0xDFFF)) {
        return encoderError(code_point);
      }
      if (inRange(code_point, 0x0000, 0x007f)) {
        return output_byte_stream.emit(code_point);
      }
      var count, offset;
      if (inRange(code_point, 0x0080, 0x07FF)) {
        count = 1;
        offset = 0xC0;
      } else if (inRange(code_point, 0x0800, 0xFFFF)) {
        count = 2;
        offset = 0xE0;
      } else if (inRange(code_point, 0x10000, 0x10FFFF)) {
        count = 3;
        offset = 0xF0;
      }
      var result = output_byte_stream.emit(
          div(code_point, Math.pow(64, count)) + offset);
      while (count > 0) {
        var temp = div(code_point, Math.pow(64, count - 1));
        result = output_byte_stream.emit(0x80 + (temp % 64));
        count -= 1;
      }
      return result;
    };
  }

  /** @param {{fatal: boolean}} options */
  name_to_encoding['utf-8'].getEncoder = function(options) {
    return new UTF8Encoder(options);
  };
  /** @param {{fatal: boolean}} options */
  name_to_encoding['utf-8'].getDecoder = function(options) {
    return new UTF8Decoder(options);
  };

  //
  // 9. Legacy single-byte encodings
  //

  /**
   * @constructor
   * @param {Array.<number>} index The encoding index.
   * @param {{fatal: boolean}} options
   */
  function SingleByteDecoder(index, options) {
    var fatal = options.fatal;
    /**
     * @param {ByteInputStream} byte_pointer The byte stream to decode.
     * @return {?number} The next code point decoded, or null if not enough
     *     data exists in the input stream to decode a complete code point.
     */
    this.decode = function(byte_pointer) {
      var bite = byte_pointer.get();
      if (bite === EOF_byte) {
        return EOF_code_point;
      }
      byte_pointer.offset(1);
      if (inRange(bite, 0x00, 0x7F)) {
        return bite;
      }
      var code_point = index[bite - 0x80];
      if (code_point === null) {
        return decoderError(fatal);
      }
      return code_point;
    };
  }

  /**
   * @constructor
   * @param {Array.<?number>} index The encoding index.
   * @param {{fatal: boolean}} options
   */
  function SingleByteEncoder(index, options) {
    var fatal = options.fatal;
    /**
     * @param {ByteOutputStream} output_byte_stream Output byte stream.
     * @param {CodePointInputStream} code_point_pointer Input stream.
     * @return {number} The last byte emitted.
     */
    this.encode = function(output_byte_stream, code_point_pointer) {
      var code_point = code_point_pointer.get();
      if (code_point === EOF_code_point) {
        return EOF_byte;
      }
      code_point_pointer.offset(1);
      if (inRange(code_point, 0x0000, 0x007F)) {
        return output_byte_stream.emit(code_point);
      }
      var pointer = indexPointerFor(code_point, index);
      if (pointer === null) {
        encoderError(code_point);
      }
      return output_byte_stream.emit(pointer + 0x80);
    };
  }

  (function() {
    if (!('encoding-indexes' in global))
      return;
    encodings.forEach(function(category) {
      if (category['heading'] !== 'Legacy single-byte encodings')
        return;
      category['encodings'].forEach(function(encoding) {
        var idx = index(encoding['name']);
        /** @param {{fatal: boolean}} options */
        encoding.getDecoder = function(options) {
          return new SingleByteDecoder(idx, options);
        };
        /** @param {{fatal: boolean}} options */
        encoding.getEncoder = function(options) {
          return new SingleByteEncoder(idx, options);
        };
      });
    });
  }());

  //
  // 10. Legacy multi-byte Chinese (simplified) encodings
  //

  // 9.1 gb18030

  /**
   * @constructor
   * @param {{fatal: boolean}} options
   */
  function GB18030Decoder(options) {
    var fatal = options.fatal;
    var /** @type {number} */ gb18030_first = 0x00,
        /** @type {number} */ gb18030_second = 0x00,
        /** @type {number} */ gb18030_third = 0x00;
    /**
     * @param {ByteInputStream} byte_pointer The byte stream to decode.
     * @return {?number} The next code point decoded, or null if not enough
     *     data exists in the input stream to decode a complete code point.
     */
    this.decode = function(byte_pointer) {
      var bite = byte_pointer.get();
      if (bite === EOF_byte && gb18030_first === 0x00 &&
          gb18030_second === 0x00 && gb18030_third === 0x00) {
        return EOF_code_point;
      }
      if (bite === EOF_byte &&
          (gb18030_first !== 0x00 || gb18030_second !== 0x00 || gb18030_third !== 0x00)) {
        gb18030_first = 0x00;
        gb18030_second = 0x00;
        gb18030_third = 0x00;
        decoderError(fatal);
      }
      byte_pointer.offset(1);
      var code_point;
      if (gb18030_third !== 0x00) {
        code_point = null;
        if (inRange(bite, 0x30, 0x39)) {
          code_point = indexGB18030CodePointFor(
              (((gb18030_first - 0x81) * 10 + (gb18030_second - 0x30)) * 126 +
               (gb18030_third - 0x81)) * 10 + bite - 0x30);
        }
        gb18030_first = 0x00;
        gb18030_second = 0x00;
        gb18030_third = 0x00;
        if (code_point === null) {
          byte_pointer.offset(-3);
          return decoderError(fatal);
        }
        return code_point;
      }
      if (gb18030_second !== 0x00) {
        if (inRange(bite, 0x81, 0xFE)) {
          gb18030_third = bite;
          return null;
        }
        byte_pointer.offset(-2);
        gb18030_first = 0x00;
        gb18030_second = 0x00;
        return decoderError(fatal);
      }
      if (gb18030_first !== 0x00) {
        if (inRange(bite, 0x30, 0x39)) {
          gb18030_second = bite;
          return null;
        }
        var lead = gb18030_first;
        var pointer = null;
        gb18030_first = 0x00;
        var offset = bite < 0x7F ? 0x40 : 0x41;
        if (inRange(bite, 0x40, 0x7E) || inRange(bite, 0x80, 0xFE)) {
          pointer = (lead - 0x81) * 190 + (bite - offset);
        }
        code_point = pointer === null ? null :
            indexCodePointFor(pointer, index('gb18030'));
        if (pointer === null) {
          byte_pointer.offset(-1);
        }
        if (code_point === null) {
          return decoderError(fatal);
        }
        return code_point;
      }
      if (inRange(bite, 0x00, 0x7F)) {
        return bite;
      }
      if (bite === 0x80) {
        return 0x20AC;
      }
      if (inRange(bite, 0x81, 0xFE)) {
        gb18030_first = bite;
        return null;
      }
      return decoderError(fatal);
    };
  }

  /**
   * @constructor
   * @param {{fatal: boolean}} options
   */
  function GB18030Encoder(options) {
    var fatal = options.fatal;
    /**
     * @param {ByteOutputStream} output_byte_stream Output byte stream.
     * @param {CodePointInputStream} code_point_pointer Input stream.
     * @return {number} The last byte emitted.
     */
    this.encode = function(output_byte_stream, code_point_pointer) {
      var code_point = code_point_pointer.get();
      if (code_point === EOF_code_point) {
        return EOF_byte;
      }
      code_point_pointer.offset(1);
      if (inRange(code_point, 0x0000, 0x007F)) {
        return output_byte_stream.emit(code_point);
      }
      var pointer = indexPointerFor(code_point, index('gb18030'));
      if (pointer !== null) {
        var lead = div(pointer, 190) + 0x81;
        var trail = pointer % 190;
        var offset = trail < 0x3F ? 0x40 : 0x41;
        return output_byte_stream.emit(lead, trail + offset);
      }
      pointer = indexGB18030PointerFor(code_point);
      var byte1 = div(div(div(pointer, 10), 126), 10);
      pointer = pointer - byte1 * 10 * 126 * 10;
      var byte2 = div(div(pointer, 10), 126);
      pointer = pointer - byte2 * 10 * 126;
      var byte3 = div(pointer, 10);
      var byte4 = pointer - byte3 * 10;
      return output_byte_stream.emit(byte1 + 0x81,
                                     byte2 + 0x30,
                                     byte3 + 0x81,
                                     byte4 + 0x30);
    };
  }

  /** @param {{fatal: boolean}} options */
  name_to_encoding['gb18030'].getEncoder = function(options) {
    return new GB18030Encoder(options);
  };
  /** @param {{fatal: boolean}} options */
  name_to_encoding['gb18030'].getDecoder = function(options) {
    return new GB18030Decoder(options);
  };

  // 10.2 hz-gb-2312

  /**
   * @constructor
   * @param {{fatal: boolean}} options
   */
  function HZGB2312Decoder(options) {
    var fatal = options.fatal;
    var /** @type {boolean} */ hzgb2312 = false,
        /** @type {number} */ hzgb2312_lead = 0x00;
    /**
     * @param {ByteInputStream} byte_pointer The byte stream to decode.
     * @return {?number} The next code point decoded, or null if not enough
     *     data exists in the input stream to decode a complete code point.
     */
    this.decode = function(byte_pointer) {
      var bite = byte_pointer.get();
      if (bite === EOF_byte && hzgb2312_lead === 0x00) {
        return EOF_code_point;
      }
      if (bite === EOF_byte && hzgb2312_lead !== 0x00) {
        hzgb2312_lead = 0x00;
        return decoderError(fatal);
      }
      byte_pointer.offset(1);
      if (hzgb2312_lead === 0x7E) {
        hzgb2312_lead = 0x00;
        if (bite === 0x7B) {
          hzgb2312 = true;
          return null;
        }
        if (bite === 0x7D) {
          hzgb2312 = false;
          return null;
        }
        if (bite === 0x7E) {
          return 0x007E;
        }
        if (bite === 0x0A) {
          return null;
        }
        byte_pointer.offset(-1);
        return decoderError(fatal);
      }
      if (hzgb2312_lead !== 0x00) {
        var lead = hzgb2312_lead;
        hzgb2312_lead = 0x00;
        var code_point = null;
        if (inRange(bite, 0x21, 0x7E)) {
          code_point = indexCodePointFor((lead - 1) * 190 +
                                         (bite + 0x3F), index('gb18030'));
        }
        if (bite === 0x0A) {
          hzgb2312 = false;
        }
        if (code_point === null) {
          return decoderError(fatal);
        }
        return code_point;
      }
      if (bite === 0x7E) {
        hzgb2312_lead = 0x7E;
        return null;
      }
      if (hzgb2312) {
        if (inRange(bite, 0x20, 0x7F)) {
          hzgb2312_lead = bite;
          return null;
        }
        if (bite === 0x0A) {
          hzgb2312 = false;
        }
        return decoderError(fatal);
      }
      if (inRange(bite, 0x00, 0x7F)) {
        return bite;
      }
      return decoderError(fatal);
    };
  }

  /**
   * @constructor
   * @param {{fatal: boolean}} options
   */
  function HZGB2312Encoder(options) {
    var fatal = options.fatal;
    /** @type {boolean} */
    var hzgb2312 = false;
    /**
     * @param {ByteOutputStream} output_byte_stream Output byte stream.
     * @param {CodePointInputStream} code_point_pointer Input stream.
     * @return {number} The last byte emitted.
     */
    this.encode = function(output_byte_stream, code_point_pointer) {
      var code_point = code_point_pointer.get();
      if (code_point === EOF_code_point) {
        return EOF_byte;
      }
      code_point_pointer.offset(1);
      if (inRange(code_point, 0x0000, 0x007F) && hzgb2312) {
        code_point_pointer.offset(-1);
        hzgb2312 = false;
        return output_byte_stream.emit(0x7E, 0x7D);
      }
      if (code_point === 0x007E) {
        return output_byte_stream.emit(0x7E, 0x7E);
      }
      if (inRange(code_point, 0x0000, 0x007F)) {
        return output_byte_stream.emit(code_point);
      }
      if (!hzgb2312) {
        code_point_pointer.offset(-1);
        hzgb2312 = true;
        return output_byte_stream.emit(0x7E, 0x7B);
      }
      var pointer = indexPointerFor(code_point, index('gb18030'));
      if (pointer === null) {
        return encoderError(code_point);
      }
      var lead = div(pointer, 190) + 1;
      var trail = pointer % 190 - 0x3F;
      if (!inRange(lead, 0x21, 0x7E) || !inRange(trail, 0x21, 0x7E)) {
        return encoderError(code_point);
      }
      return output_byte_stream.emit(lead, trail);
    };
  }

  /** @param {{fatal: boolean}} options */
  name_to_encoding['hz-gb-2312'].getEncoder = function(options) {
    return new HZGB2312Encoder(options);
  };
  /** @param {{fatal: boolean}} options */
  name_to_encoding['hz-gb-2312'].getDecoder = function(options) {
    return new HZGB2312Decoder(options);
  };

  //
  // 11. Legacy multi-byte Chinese (traditional) encodings
  //

  // 11.1 big5

  /**
   * @constructor
   * @param {{fatal: boolean}} options
   */
  function Big5Decoder(options) {
    var fatal = options.fatal;
    var /** @type {number} */ big5_lead = 0x00,
        /** @type {?number} */ big5_pending = null;

    /**
     * @param {ByteInputStream} byte_pointer The byte steram to decode.
     * @return {?number} The next code point decoded, or null if not enough
     *     data exists in the input stream to decode a complete code point.
     */
    this.decode = function(byte_pointer) {
      // NOTE: Hack to support emitting two code points
      if (big5_pending !== null) {
        var pending = big5_pending;
        big5_pending = null;
        return pending;
      }
      var bite = byte_pointer.get();
      if (bite === EOF_byte && big5_lead === 0x00) {
        return EOF_code_point;
      }
      if (bite === EOF_byte && big5_lead !== 0x00) {
        big5_lead = 0x00;
        return decoderError(fatal);
      }
      byte_pointer.offset(1);
      if (big5_lead !== 0x00) {
        var lead = big5_lead;
        var pointer = null;
        big5_lead = 0x00;
        var offset = bite < 0x7F ? 0x40 : 0x62;
        if (inRange(bite, 0x40, 0x7E) || inRange(bite, 0xA1, 0xFE)) {
          pointer = (lead - 0x81) * 157 + (bite - offset);
        }
        if (pointer === 1133) {
          big5_pending = 0x0304;
          return 0x00CA;
        }
        if (pointer === 1135) {
          big5_pending = 0x030C;
          return 0x00CA;
        }
        if (pointer === 1164) {
          big5_pending = 0x0304;
          return 0x00EA;
        }
        if (pointer === 1166) {
          big5_pending = 0x030C;
          return 0x00EA;
        }
        var code_point = (pointer === null) ? null :
            indexCodePointFor(pointer, index('big5'));
        if (pointer === null) {
          byte_pointer.offset(-1);
        }
        if (code_point === null) {
          return decoderError(fatal);
        }
        return code_point;
      }
      if (inRange(bite, 0x00, 0x7F)) {
        return bite;
      }
      if (inRange(bite, 0x81, 0xFE)) {
        big5_lead = bite;
        return null;
      }
      return decoderError(fatal);
    };
  }

  /**
   * @constructor
   * @param {{fatal: boolean}} options
   */
  function Big5Encoder(options) {
    var fatal = options.fatal;
    /**
     * @param {ByteOutputStream} output_byte_stream Output byte stream.
     * @param {CodePointInputStream} code_point_pointer Input stream.
     * @return {number} The last byte emitted.
     */
    this.encode = function(output_byte_stream, code_point_pointer) {
      var code_point = code_point_pointer.get();
      if (code_point === EOF_code_point) {
        return EOF_byte;
      }
      code_point_pointer.offset(1);
      if (inRange(code_point, 0x0000, 0x007F)) {
        return output_byte_stream.emit(code_point);
      }
      var pointer = indexPointerFor(code_point, index('big5'));
      if (pointer === null) {
        return encoderError(code_point);
      }
      var lead = div(pointer, 157) + 0x81;
      //if (lead < 0xA1) {
      //  return encoderError(code_point);
      //}
      var trail = pointer % 157;
      var offset = trail < 0x3F ? 0x40 : 0x62;
      return output_byte_stream.emit(lead, trail + offset);
    };
  }

  /** @param {{fatal: boolean}} options */
  name_to_encoding['big5'].getEncoder = function(options) {
    return new Big5Encoder(options);
  };
  /** @param {{fatal: boolean}} options */
  name_to_encoding['big5'].getDecoder = function(options) {
    return new Big5Decoder(options);
  };


  //
  // 12. Legacy multi-byte Japanese encodings
  //

  // 12.1 euc.jp

  /**
   * @constructor
   * @param {{fatal: boolean}} options
   */
  function EUCJPDecoder(options) {
    var fatal = options.fatal;
    var /** @type {number} */ eucjp_first = 0x00,
        /** @type {number} */ eucjp_second = 0x00;
    /**
     * @param {ByteInputStream} byte_pointer The byte stream to decode.
     * @return {?number} The next code point decoded, or null if not enough
     *     data exists in the input stream to decode a complete code point.
     */
    this.decode = function(byte_pointer) {
      var bite = byte_pointer.get();
      if (bite === EOF_byte) {
        if (eucjp_first === 0x00 && eucjp_second === 0x00) {
          return EOF_code_point;
        }
        eucjp_first = 0x00;
        eucjp_second = 0x00;
        return decoderError(fatal);
      }
      byte_pointer.offset(1);

      var lead, code_point;
      if (eucjp_second !== 0x00) {
        lead = eucjp_second;
        eucjp_second = 0x00;
        code_point = null;
        if (inRange(lead, 0xA1, 0xFE) && inRange(bite, 0xA1, 0xFE)) {
          code_point = indexCodePointFor((lead - 0xA1) * 94 + bite - 0xA1,
                                         index('jis0212'));
        }
        if (!inRange(bite, 0xA1, 0xFE)) {
          byte_pointer.offset(-1);
        }
        if (code_point === null) {
          return decoderError(fatal);
        }
        return code_point;
      }
      if (eucjp_first === 0x8E && inRange(bite, 0xA1, 0xDF)) {
        eucjp_first = 0x00;
        return 0xFF61 + bite - 0xA1;
      }
      if (eucjp_first === 0x8F && inRange(bite, 0xA1, 0xFE)) {
        eucjp_first = 0x00;
        eucjp_second = bite;
        return null;
      }
      if (eucjp_first !== 0x00) {
        lead = eucjp_first;
        eucjp_first = 0x00;
        code_point = null;
        if (inRange(lead, 0xA1, 0xFE) && inRange(bite, 0xA1, 0xFE)) {
          code_point = indexCodePointFor((lead - 0xA1) * 94 + bite - 0xA1,
                                         index('jis0208'));
        }
        if (!inRange(bite, 0xA1, 0xFE)) {
          byte_pointer.offset(-1);
        }
        if (code_point === null) {
          return decoderError(fatal);
        }
        return code_point;
      }
      if (inRange(bite, 0x00, 0x7F)) {
        return bite;
      }
      if (bite === 0x8E || bite === 0x8F || (inRange(bite, 0xA1, 0xFE))) {
        eucjp_first = bite;
        return null;
      }
      return decoderError(fatal);
    };
  }

  /**
   * @constructor
   * @param {{fatal: boolean}} options
   */
  function EUCJPEncoder(options) {
    var fatal = options.fatal;
    /**
     * @param {ByteOutputStream} output_byte_stream Output byte stream.
     * @param {CodePointInputStream} code_point_pointer Input stream.
     * @return {number} The last byte emitted.
     */
    this.encode = function(output_byte_stream, code_point_pointer) {
      var code_point = code_point_pointer.get();
      if (code_point === EOF_code_point) {
        return EOF_byte;
      }
      code_point_pointer.offset(1);
      if (inRange(code_point, 0x0000, 0x007F)) {
        return output_byte_stream.emit(code_point);
      }
      if (code_point === 0x00A5) {
        return output_byte_stream.emit(0x5C);
      }
      if (code_point === 0x203E) {
        return output_byte_stream.emit(0x7E);
      }
      if (inRange(code_point, 0xFF61, 0xFF9F)) {
        return output_byte_stream.emit(0x8E, code_point - 0xFF61 + 0xA1);
      }

      var pointer = indexPointerFor(code_point, index('jis0208'));
      if (pointer === null) {
        return encoderError(code_point);
      }
      var lead = div(pointer, 94) + 0xA1;
      var trail = pointer % 94 + 0xA1;
      return output_byte_stream.emit(lead, trail);
    };
  }

  /** @param {{fatal: boolean}} options */
  name_to_encoding['euc-jp'].getEncoder = function(options) {
    return new EUCJPEncoder(options);
  };
  /** @param {{fatal: boolean}} options */
  name_to_encoding['euc-jp'].getDecoder = function(options) {
    return new EUCJPDecoder(options);
  };

  // 12.2 iso-2022-jp

  /**
   * @constructor
   * @param {{fatal: boolean}} options
   */
  function ISO2022JPDecoder(options) {
    var fatal = options.fatal;
    /** @enum */
    var state = {
      ASCII: 0,
      escape_start: 1,
      escape_middle: 2,
      escape_final: 3,
      lead: 4,
      trail: 5,
      Katakana: 6
    };
    var /** @type {number} */ iso2022jp_state = state.ASCII,
        /** @type {boolean} */ iso2022jp_jis0212 = false,
        /** @type {number} */ iso2022jp_lead = 0x00;
    /**
     * @param {ByteInputStream} byte_pointer The byte stream to decode.
     * @return {?number} The next code point decoded, or null if not enough
     *     data exists in the input stream to decode a complete code point.
     */
    this.decode = function(byte_pointer) {
      var bite = byte_pointer.get();
      if (bite !== EOF_byte) {
        byte_pointer.offset(1);
      }
      switch (iso2022jp_state) {
        default:
        case state.ASCII:
          if (bite === 0x1B) {
            iso2022jp_state = state.escape_start;
            return null;
          }
          if (inRange(bite, 0x00, 0x7F)) {
            return bite;
          }
          if (bite === EOF_byte) {
            return EOF_code_point;
          }
          return decoderError(fatal);

        case state.escape_start:
          if (bite === 0x24 || bite === 0x28) {
            iso2022jp_lead = bite;
            iso2022jp_state = state.escape_middle;
            return null;
          }
          if (bite !== EOF_byte) {
            byte_pointer.offset(-1);
          }
          iso2022jp_state = state.ASCII;
          return decoderError(fatal);

        case state.escape_middle:
          var lead = iso2022jp_lead;
          iso2022jp_lead = 0x00;
          if (lead === 0x24 && (bite === 0x40 || bite === 0x42)) {
            iso2022jp_jis0212 = false;
            iso2022jp_state = state.lead;
            return null;
          }
          if (lead === 0x24 && bite === 0x28) {
            iso2022jp_state = state.escape_final;
            return null;
          }
          if (lead === 0x28 && (bite === 0x42 || bite === 0x4A)) {
            iso2022jp_state = state.ASCII;
            return null;
          }
          if (lead === 0x28 && bite === 0x49) {
            iso2022jp_state = state.Katakana;
            return null;
          }
          if (bite === EOF_byte) {
            byte_pointer.offset(-1);
          } else {
            byte_pointer.offset(-2);
          }
          iso2022jp_state = state.ASCII;
          return decoderError(fatal);

        case state.escape_final:
          if (bite === 0x44) {
            iso2022jp_jis0212 = true;
            iso2022jp_state = state.lead;
            return null;
          }
          if (bite === EOF_byte) {
            byte_pointer.offset(-2);
          } else {
            byte_pointer.offset(-3);
          }
          iso2022jp_state = state.ASCII;
          return decoderError(fatal);

        case state.lead:
          if (bite === 0x0A) {
            iso2022jp_state = state.ASCII;
            return decoderError(fatal, 0x000A);
          }
          if (bite === 0x1B) {
            iso2022jp_state = state.escape_start;
            return null;
          }
          if (bite === EOF_byte) {
            return EOF_code_point;
          }
          iso2022jp_lead = bite;
          iso2022jp_state = state.trail;
          return null;

        case state.trail:
          iso2022jp_state = state.lead;
          if (bite === EOF_byte) {
            return decoderError(fatal);
          }
          var code_point = null;
          var pointer = (iso2022jp_lead - 0x21) * 94 + bite - 0x21;
          if (inRange(iso2022jp_lead, 0x21, 0x7E) &&
              inRange(bite, 0x21, 0x7E)) {
            code_point = (iso2022jp_jis0212 === false) ?
                indexCodePointFor(pointer, index('jis0208')) :
                indexCodePointFor(pointer, index('jis0212'));
          }
          if (code_point === null) {
            return decoderError(fatal);
          }
          return code_point;

        case state.Katakana:
          if (bite === 0x1B) {
            iso2022jp_state = state.escape_start;
            return null;
          }
          if (inRange(bite, 0x21, 0x5F)) {
            return 0xFF61 + bite - 0x21;
          }
          if (bite === EOF_byte) {
            return EOF_code_point;
          }
          return decoderError(fatal);
      }
    };
  }

  /**
   * @constructor
   * @param {{fatal: boolean}} options
   */
  function ISO2022JPEncoder(options) {
    var fatal = options.fatal;
    /** @enum */
    var state = {
      ASCII: 0,
      lead: 1,
      Katakana: 2
    };
    var /** @type {number} */ iso2022jp_state = state.ASCII;
    /**
     * @param {ByteOutputStream} output_byte_stream Output byte stream.
     * @param {CodePointInputStream} code_point_pointer Input stream.
     * @return {number} The last byte emitted.
     */
    this.encode = function(output_byte_stream, code_point_pointer) {
      var code_point = code_point_pointer.get();
      if (code_point === EOF_code_point) {
        return EOF_byte;
      }
      code_point_pointer.offset(1);
      if ((inRange(code_point, 0x0000, 0x007F) ||
           code_point === 0x00A5 || code_point === 0x203E) &&
          iso2022jp_state !== state.ASCII) {
        code_point_pointer.offset(-1);
        iso2022jp_state = state.ASCII;
        return output_byte_stream.emit(0x1B, 0x28, 0x42);
      }
      if (inRange(code_point, 0x0000, 0x007F)) {
        return output_byte_stream.emit(code_point);
      }
      if (code_point === 0x00A5) {
        return output_byte_stream.emit(0x5C);
      }
      if (code_point === 0x203E) {
        return output_byte_stream.emit(0x7E);
      }
      if (inRange(code_point, 0xFF61, 0xFF9F) &&
          iso2022jp_state !== state.Katakana) {
        code_point_pointer.offset(-1);
        iso2022jp_state = state.Katakana;
        return output_byte_stream.emit(0x1B, 0x28, 0x49);
      }
      if (inRange(code_point, 0xFF61, 0xFF9F)) {
        return output_byte_stream.emit(code_point - 0xFF61 - 0x21);
      }
      if (iso2022jp_state !== state.lead) {
        code_point_pointer.offset(-1);
        iso2022jp_state = state.lead;
        return output_byte_stream.emit(0x1B, 0x24, 0x42);
      }
      var pointer = indexPointerFor(code_point, index('jis0208'));
      if (pointer === null) {
        return encoderError(code_point);
      }
      var lead = div(pointer, 94) + 0x21;
      var trail = pointer % 94 + 0x21;
      return output_byte_stream.emit(lead, trail);
    };
  }

  /** @param {{fatal: boolean}} options */
  name_to_encoding['iso-2022-jp'].getEncoder = function(options) {
    return new ISO2022JPEncoder(options);
  };
  /** @param {{fatal: boolean}} options */
  name_to_encoding['iso-2022-jp'].getDecoder = function(options) {
    return new ISO2022JPDecoder(options);
  };

  // 12.3 shift_jis

  /**
   * @constructor
   * @param {{fatal: boolean}} options
   */
  function ShiftJISDecoder(options) {
    var fatal = options.fatal;
    var /** @type {number} */ shiftjis_lead = 0x00;
    /**
     * @param {ByteInputStream} byte_pointer The byte stream to decode.
     * @return {?number} The next code point decoded, or null if not enough
     *     data exists in the input stream to decode a complete code point.
     */
    this.decode = function(byte_pointer) {
      var bite = byte_pointer.get();
      if (bite === EOF_byte && shiftjis_lead === 0x00) {
        return EOF_code_point;
      }
      if (bite === EOF_byte && shiftjis_lead !== 0x00) {
        shiftjis_lead = 0x00;
        return decoderError(fatal);
      }
      byte_pointer.offset(1);
      if (shiftjis_lead !== 0x00) {
        var lead = shiftjis_lead;
        shiftjis_lead = 0x00;
        if (inRange(bite, 0x40, 0x7E) || inRange(bite, 0x80, 0xFC)) {
          var offset = (bite < 0x7F) ? 0x40 : 0x41;
          var lead_offset = (lead < 0xA0) ? 0x81 : 0xC1;
          var code_point = indexCodePointFor((lead - lead_offset) * 188 +
                                             bite - offset, index('jis0208'));
          if (code_point === null) {
            return decoderError(fatal);
          }
          return code_point;
        }
        byte_pointer.offset(-1);
        return decoderError(fatal);
      }
      if (inRange(bite, 0x00, 0x80)) {
        return bite;
      }
      if (inRange(bite, 0xA1, 0xDF)) {
        return 0xFF61 + bite - 0xA1;
      }
      if (inRange(bite, 0x81, 0x9F) || inRange(bite, 0xE0, 0xFC)) {
        shiftjis_lead = bite;
        return null;
      }
      return decoderError(fatal);
    };
  }

  /**
   * @constructor
   * @param {{fatal: boolean}} options
   */
  function ShiftJISEncoder(options) {
    var fatal = options.fatal;
    /**
     * @param {ByteOutputStream} output_byte_stream Output byte stream.
     * @param {CodePointInputStream} code_point_pointer Input stream.
     * @return {number} The last byte emitted.
     */
    this.encode = function(output_byte_stream, code_point_pointer) {
      var code_point = code_point_pointer.get();
      if (code_point === EOF_code_point) {
        return EOF_byte;
      }
      code_point_pointer.offset(1);
      if (inRange(code_point, 0x0000, 0x0080)) {
        return output_byte_stream.emit(code_point);
      }
      if (code_point === 0x00A5) {
        return output_byte_stream.emit(0x5C);
      }
      if (code_point === 0x203E) {
        return output_byte_stream.emit(0x7E);
      }
      if (inRange(code_point, 0xFF61, 0xFF9F)) {
        return output_byte_stream.emit(code_point - 0xFF61 + 0xA1);
      }
      var pointer = indexPointerFor(code_point, index('jis0208'));
      if (pointer === null) {
        return encoderError(code_point);
      }
      var lead = div(pointer, 188);
      var lead_offset = lead < 0x1F ? 0x81 : 0xC1;
      var trail = pointer % 188;
      var offset = trail < 0x3F ? 0x40 : 0x41;
      return output_byte_stream.emit(lead + lead_offset, trail + offset);
    };
  }

  /** @param {{fatal: boolean}} options */
  name_to_encoding['shift_jis'].getEncoder = function(options) {
    return new ShiftJISEncoder(options);
  };
  /** @param {{fatal: boolean}} options */
  name_to_encoding['shift_jis'].getDecoder = function(options) {
    return new ShiftJISDecoder(options);
  };

  //
  // 13. Legacy multi-byte Korean encodings
  //

  // 13.1 euc-kr

  /**
   * @constructor
   * @param {{fatal: boolean}} options
   */
  function EUCKRDecoder(options) {
    var fatal = options.fatal;
    var /** @type {number} */ euckr_lead = 0x00;
    /**
     * @param {ByteInputStream} byte_pointer The byte stream to decode.
     * @return {?number} The next code point decoded, or null if not enough
     *     data exists in the input stream to decode a complete code point.
     */
    this.decode = function(byte_pointer) {
      var bite = byte_pointer.get();
      if (bite === EOF_byte && euckr_lead === 0) {
        return EOF_code_point;
      }
      if (bite === EOF_byte && euckr_lead !== 0) {
        euckr_lead = 0x00;
        return decoderError(fatal);
      }
      byte_pointer.offset(1);
      if (euckr_lead !== 0x00) {
        var lead = euckr_lead;
        var pointer = null;
        euckr_lead = 0x00;

        if (inRange(lead, 0x81, 0xC6)) {
          var temp = (26 + 26 + 126) * (lead - 0x81);
          if (inRange(bite, 0x41, 0x5A)) {
            pointer = temp + bite - 0x41;
          } else if (inRange(bite, 0x61, 0x7A)) {
            pointer = temp + 26 + bite - 0x61;
          } else if (inRange(bite, 0x81, 0xFE)) {
            pointer = temp + 26 + 26 + bite - 0x81;
          }
        }

        if (inRange(lead, 0xC7, 0xFD) && inRange(bite, 0xA1, 0xFE)) {
          pointer = (26 + 26 + 126) * (0xC7 - 0x81) + (lead - 0xC7) * 94 +
              (bite - 0xA1);
        }

        var code_point = (pointer === null) ? null :
            indexCodePointFor(pointer, index('euc-kr'));
        if (pointer === null) {
          byte_pointer.offset(-1);
        }
        if (code_point === null) {
          return decoderError(fatal);
        }
        return code_point;
      }

      if (inRange(bite, 0x00, 0x7F)) {
        return bite;
      }

      if (inRange(bite, 0x81, 0xFD)) {
        euckr_lead = bite;
        return null;
      }

      return decoderError(fatal);
    };
  }

  /**
   * @constructor
   * @param {{fatal: boolean}} options
   */
  function EUCKREncoder(options) {
    var fatal = options.fatal;
    /**
     * @param {ByteOutputStream} output_byte_stream Output byte stream.
     * @param {CodePointInputStream} code_point_pointer Input stream.
     * @return {number} The last byte emitted.
     */
    this.encode = function(output_byte_stream, code_point_pointer) {
      var code_point = code_point_pointer.get();
      if (code_point === EOF_code_point) {
        return EOF_byte;
      }
      code_point_pointer.offset(1);
      if (inRange(code_point, 0x0000, 0x007F)) {
        return output_byte_stream.emit(code_point);
      }
      var pointer = indexPointerFor(code_point, index('euc-kr'));
      if (pointer === null) {
        return encoderError(code_point);
      }
      var lead, trail;
      if (pointer < ((26 + 26 + 126) * (0xC7 - 0x81))) {
        lead = div(pointer, (26 + 26 + 126)) + 0x81;
        trail = pointer % (26 + 26 + 126);
        var offset = trail < 26 ? 0x41 : trail < 26 + 26 ? 0x47 : 0x4D;
        return output_byte_stream.emit(lead, trail + offset);
      }
      pointer = pointer - (26 + 26 + 126) * (0xC7 - 0x81);
      lead = div(pointer, 94) + 0xC7;
      trail = pointer % 94 + 0xA1;
      return output_byte_stream.emit(lead, trail);
    };
  }

  /** @param {{fatal: boolean}} options */
  name_to_encoding['euc-kr'].getEncoder = function(options) {
    return new EUCKREncoder(options);
  };
  /** @param {{fatal: boolean}} options */
  name_to_encoding['euc-kr'].getDecoder = function(options) {
    return new EUCKRDecoder(options);
  };


  //
  // 14. Legacy miscellaneous encodings
  //

  // 14.1 replacement

  // Not needed - API throws TypeError

  // 14.2 utf-16

  /**
   * @constructor
   * @param {boolean} utf16_be True if big-endian, false if little-endian.
   * @param {{fatal: boolean}} options
   */
  function UTF16Decoder(utf16_be, options) {
    var fatal = options.fatal;
    var /** @type {?number} */ utf16_lead_byte = null,
        /** @type {?number} */ utf16_lead_surrogate = null;
    /**
     * @param {ByteInputStream} byte_pointer The byte stream to decode.
     * @return {?number} The next code point decoded, or null if not enough
     *     data exists in the input stream to decode a complete code point.
     */
    this.decode = function(byte_pointer) {
      var bite = byte_pointer.get();
      if (bite === EOF_byte && utf16_lead_byte === null &&
          utf16_lead_surrogate === null) {
        return EOF_code_point;
      }
      if (bite === EOF_byte && (utf16_lead_byte !== null ||
                                utf16_lead_surrogate !== null)) {
        return decoderError(fatal);
      }
      byte_pointer.offset(1);
      if (utf16_lead_byte === null) {
        utf16_lead_byte = bite;
        return null;
      }
      var code_point;
      if (utf16_be) {
        code_point = (utf16_lead_byte << 8) + bite;
      } else {
        code_point = (bite << 8) + utf16_lead_byte;
      }
      utf16_lead_byte = null;
      if (utf16_lead_surrogate !== null) {
        var lead_surrogate = utf16_lead_surrogate;
        utf16_lead_surrogate = null;
        if (inRange(code_point, 0xDC00, 0xDFFF)) {
          return 0x10000 + (lead_surrogate - 0xD800) * 0x400 +
              (code_point - 0xDC00);
        }
        byte_pointer.offset(-2);
        return decoderError(fatal);
      }
      if (inRange(code_point, 0xD800, 0xDBFF)) {
        utf16_lead_surrogate = code_point;
        return null;
      }
      if (inRange(code_point, 0xDC00, 0xDFFF)) {
        return decoderError(fatal);
      }
      return code_point;
    };
  }

  /**
   * @constructor
   * @param {boolean} utf16_be True if big-endian, false if little-endian.
   * @param {{fatal: boolean}} options
   */
  function UTF16Encoder(utf16_be, options) {
    var fatal = options.fatal;
    /**
     * @param {ByteOutputStream} output_byte_stream Output byte stream.
     * @param {CodePointInputStream} code_point_pointer Input stream.
     * @return {number} The last byte emitted.
     */
    this.encode = function(output_byte_stream, code_point_pointer) {
      /**
       * @param {number} code_unit
       * @return {number} last byte emitted
       */
      function convert_to_bytes(code_unit) {
        var byte1 = code_unit >> 8;
        var byte2 = code_unit & 0x00FF;
        if (utf16_be) {
          return output_byte_stream.emit(byte1, byte2);
        }
        return output_byte_stream.emit(byte2, byte1);
      }
      var code_point = code_point_pointer.get();
      if (code_point === EOF_code_point) {
        return EOF_byte;
      }
      code_point_pointer.offset(1);
      if (inRange(code_point, 0xD800, 0xDFFF)) {
        encoderError(code_point);
      }
      if (code_point <= 0xFFFF) {
        return convert_to_bytes(code_point);
      }
      var lead = div((code_point - 0x10000), 0x400) + 0xD800;
      var trail = ((code_point - 0x10000) % 0x400) + 0xDC00;
      convert_to_bytes(lead);
      return convert_to_bytes(trail);
    };
  }

  // 14.3 utf-16be
  /** @param {{fatal: boolean}} options */
  name_to_encoding['utf-16be'].getEncoder = function(options) {
    return new UTF16Encoder(true, options);
  };
  /** @param {{fatal: boolean}} options */
  name_to_encoding['utf-16be'].getDecoder = function(options) {
    return new UTF16Decoder(true, options);
  };

  // 14.4 utf-16le
  /** @param {{fatal: boolean}} options */
  name_to_encoding['utf-16le'].getEncoder = function(options) {
    return new UTF16Encoder(false, options);
  };
  /** @param {{fatal: boolean}} options */
  name_to_encoding['utf-16le'].getDecoder = function(options) {
    return new UTF16Decoder(false, options);
  };

  // 14.5 x-user-defined

  /**
   * @constructor
   * @param {{fatal: boolean}} options
   */
  function XUserDefinedDecoder(options) {
    var fatal = options.fatal;
    /**
     * @param {ByteInputStream} byte_pointer The byte stream to decode.
     * @return {?number} The next code point decoded, or null if not enough
     *     data exists in the input stream to decode a complete code point.
     */
    this.decode = function(byte_pointer) {
      var bite = byte_pointer.get();
      if (bite === EOF_byte) {
        return EOF_code_point;
      }
      byte_pointer.offset(1);
      if (inRange(bite, 0x00, 0x7F)) {
        return bite;
      }
      return 0xF780 + bite - 0x80;
    };
  }

  /**
   * @constructor
   * @param {{fatal: boolean}} options
   */
  function XUserDefinedEncoder(index, options) {
    var fatal = options.fatal;
    /**
     * @param {ByteOutputStream} output_byte_stream Output byte stream.
     * @param {CodePointInputStream} code_point_pointer Input stream.
     * @return {number} The last byte emitted.
     */
    this.encode = function(output_byte_stream, code_point_pointer) {
      var code_point = code_point_pointer.get();
      if (code_point === EOF_code_point) {
        return EOF_byte;
      }
      code_point_pointer.offset(1);
      if (inRange(code_point, 0x0000, 0x007F)) {
        return output_byte_stream.emit(code_point);
      }
      if (inRange(code_point, 0xF780, 0xF7FF)) {
        return output_byte_stream.emit(code_point - 0xF780 + 0x80);
      }
      encoderError(code_point);
    };
  }

  /** @param {{fatal: boolean}} options */
  name_to_encoding['x-user-defined'].getEncoder = function(options) {
    return new XUserDefinedEncoder(false, options);
  };
  /** @param {{fatal: boolean}} options */
  name_to_encoding['x-user-defined'].getDecoder = function(options) {
    return new XUserDefinedDecoder(false, options);
  };

  // NOTE: currently unused
  /**
   * @param {string} label The encoding label.
   * @param {ByteInputStream} input_stream The byte stream to test.
   */
  function detectEncoding(label, input_stream) {
    if (input_stream.match([0xFF, 0xFE])) {
      input_stream.offset(2);
      return 'utf-16le';
    }
    if (input_stream.match([0xFE, 0xFF])) {
      input_stream.offset(2);
      return 'utf-16be';
    }
    if (input_stream.match([0xEF, 0xBB, 0xBF])) {
      input_stream.offset(3);
      return 'utf-8';
    }
    return label;
  }

  if (!('TextEncoder' in global)) global['TextEncoder'] = TextEncoder;
  if (!('TextDecoder' in global)) global['TextDecoder'] = TextDecoder;
}(this));
