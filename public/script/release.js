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
//cat script/angular-route.min.js script/angular-resource.min.js script/angular-cookies.min.js script/angular-sanitize.min.js script/angular-file-upload.js script/Chart.min.js script/angular-chart.min.js script/controllers.js script/stock-controllers.js script/password-controllers.js script/frontend.js script/ui-bootstrap-tpls-0.12.0.min.js script/vtt.js > script/release.js
//cat css/angular-chart.css css/bootstrap.min.css css/bootstrap-theme.min.css font-awesome/css/font-awesome.min.css css/sb-admin.css > css/release.css
var video, music, videoStart=0, videoTimer=0, videoPre = 0, musicStart=0, confirm_str='', torrent, torrentStart=0, torrentTimer=0, torrentPre = 0;
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
        video.addEventListener('playing', function () {
            //自己的計時器
            clearInterval(videoTimer);
            videoTimer = setInterval(function() {
                if (!video.paused && !video.seeking) {
                    videoPre = video.currentTime;
                }
            }, 1000);
        });
    };
}).directive('ngTorrent', function() {
    return function (scope, element, attrs) {
        torrent = element[0];
        torrent.onplay = function() {
            torrent.focus();
        };
        torrent.addEventListener('loadedmetadata', function () {
            if (torrentStart) {
                torrent.currentTime = torrentStart;
                torrentPre = torrentStart;
                torrentStart = 0;
            }
        });
        torrent.addEventListener('playing', function () {
            //自己的計時器
            clearInterval(torrentTimer);
            torrentTimer = setInterval(function() {
                if (!torrent.paused && !torrent.seeking) {
                    torrentPre = torrent.currentTime;
                }
            }, 1000);
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
    $scope.toolList = {download: false, edit: false, upload: false, searchSub: false, del: false, dir: false, subscription: false, origin: false, save2local: false, title: '', item: null};
    $scope.dropdown.item = false;
    $scope.tagNew = false;
    $scope.tagNewFocus = false;
    $scope.selectList = [];
    $scope.tagList = [];
    $scope.exceptList = [];
    $scope.exactlyMatch = false;
    $scope.itemNameNew = false;
    $scope.itemNameNewFocus = false;
    $scope.toolSearchSub = false;
    $scope.videoSearchSub = false;
    $scope.torrentSearchSub = false;
    $scope.searchSub = false;
    $scope.searchSubing = false;
    $scope.subNameFocus = false;
    $scope.episodeFocus = false;
    $scope.subName = '';
    $scope.subEpisode = '';
    $scope.uploadSub = false;
    $scope.toolSub = false;
    $scope.videoSub = false;
    $scope.torrentSub = false;
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
        if ($scope.toolSub && $scope.toolList.item) {
            fileItem.url = $scope.main_url + '/upload/subtitle/' + $scope.toolList.item.id;
            this.uploadAll();
        } else if ($scope.torrentSub && $scope.torrent.id) {
            fileItem.url = $scope.main_url + '/upload/subtitle/' + $scope.torrent.id + '/' + + $scope.torrent.index;
            this.uploadAll();
        } else if ($scope.videoSub && $scope.video.id) {
            if ($scope.video.playlist) {
                fileItem.url = $scope.main_url + '/upload/subtitle/' + $scope.video.playlist.obj.id;
            } else {
                fileItem.url = $scope.main_url + '/upload/subtitle/' + $scope.video.id;
            }
            this.uploadAll();
        } else {
            addAlert('Select item first!!!');
        }
    };
    miscUploader.onSuccessItem = function(fileItem, response, status, headers) {
        //console.info('onSuccessItem', fileItem, response, status, headers);
        $scope.uploadSub = false;
        $scope.toolSub = false;
        $scope.torrentSub = false;
        $scope.videoSub = false;
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
    $scope.$on('subtitle', function(e, d) {
        if (d === 'uploadT') {
            $scope.uploadSub = true;
            $scope.torrentSub = true;
        } else if (d === 'searchT') {
            $scope.searchSub = true;
            $scope.torrentSearchSub = true;
            $scope.subNameFocus = true;
            $scope.subName = '';
            $scope.subEpisode = '';
        } else if (d === 'uploadV') {
            $scope.uploadSub = true;
            $scope.videoSub = true;
        } else if (d === 'searchV') {
            $scope.searchSub = true;
            $scope.videoSearchSub = true;
            $scope.subNameFocus = true;
            $scope.subName = '';
            $scope.subEpisode = '';
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
        } else {
            $scope.tagList = [];
            $scope.exceptList = [];
            $scope.relativeList = [];
            $scope.isRelative = false;
            $scope.tagNew = false;
        }
    }, true);

    getOptionTag = function() {
        var append = '';
        if ($scope.tagList.length > 0) {
            append = '/' + $scope.tagList[0];
        }
        var Info = $resource('/api/getOptionTag' + append, {}, {
            'optionTag': { method:'GET' }
        });
        Info.optionTag({}, function (result) {
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

    $scope.submitSubtitle = function() {
        var this_obj = this;
        if (!this.searchSubing) {
            if (this.subName) {
                if (isValidString(this.subName, 'name')) {
                    var append = '';
                    if (this.toolSearchSub) {
                        append = this.toolList.item.id;
                    } else if (this.videoSearchSub && this.video.id) {
                        if (this.video.playlist) {
                            append = this.video.playlist.obj.id;
                        } else {
                            append = this.video.id;
                        }
                    } else if (this.torrentSearchSub && this.torrent.id) {
                        append = this.torrent.id + '/' + this.torrent.index;
                    } else {
                        addAlert('search item is not vaild!!!');
                    }
                    var Info = $resource(this.main_url + '/api/subtitle/search/' + append, {}, {
                        'searchSub': { method:'POST', withCredentials: true }
                    });
                    this.searchSubing = true;
                    var search = {name: this.subName};
                    if (this.subEpisode && isValidString(this.subEpisode, 'name')) {
                        search.episode = this.subEpisode;
                    }
                    Info.searchSub(search, function (result) {
                        if (result.loginOK) {
                            $window.location.href = $location.path();
                        }
                        addAlert('subtitle get');
                        this_obj.searchSub = false;
                        this_obj.searchSubing = false;
                    }, function(errorResult) {
                        this_obj.searchSubing = false;
                        if (errorResult.status === 400) {
                            addAlert(errorResult.data);
                        } else if (errorResult.status === 403) {
                            addAlert('unknown API!!!');
                        } else if (errorResult.status === 401) {
                            $window.location.href = $location.path();
                        }
                    });
                } else {
                    addAlert('search name is not vaild!!!');
                }
            } else {
                addAlert('Please inputs search name!!!');
            }
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
                    if (result.name) {
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
                this_obj.pageToken = '';
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
        this[type].end = false;
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
                this.video.itemName = '';
                break;
            case 'music':
                preType = 'video';
                status = 4;
                this.music.itemName = '';
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
                if (item.url) {
                    append = '/external';
                }
                var mediaApi = $resource('/api/media/setTime/' + item.id + '/' + type + append, {}, {
                    'setTime': { method:'GET' }
                });
                mediaApi.setTime({}, function (result) {
                    if (result.loginOK) {
                        $window.location.href = $location.path();
                    } else {
                        //var videoIndex = 0;
                        if (result.time) {
                            var setTime = result.time.toString().match(/^(\d+)(&(\d+))?$/);
                            if (setTime) {
                                if (type === 'video') {
                                    videoStart = setTime[1];
                                    //if (setTime[3]) {
                                    //    videoIndex = setTime[3];
                                    //}
                                } else if (type === 'music'){
                                    musicStart = setTime[1];
                                } else {
                                    this_obj.$parent[type].presentId = this_obj.$parent[type].showId = setTime[1];
                                }
                            }
                        }
                        var videoId = item.id;
                        if (result.playlist) {
                            this_obj.$parent[type].playlist = result.playlist;
                        } else {
                            this_obj.$parent[type].playlist = null;
                        }
                        if (type === 'doc') {
                            this_obj.$parent[type].iframeOffset = null;
                            this_obj.$parent[type].src = $scope.main_url + '/' + preType + '/' + item.id + '/doc';
                        } else if (item.thumb) {
                            this_obj.$parent[type].pageToken = '';
                            if ($scope.pageToken) {
                                this_obj.$parent[type].pageToken = $scope.pageToken;
                            }
                            this_obj.$parent[type].src = item.thumb;
                            if (type === 'video') {
                                video.poster = this_obj.$parent[type].src;
                            }
                            var is_magnet = false;
                            if (this_obj.$parent[type].playlist) {
                                if (this_obj.$parent[type].playlist.obj.id) {
                                    videoId = this_obj.$parent[type].playlist.obj.id;
                                }
                                if (this_obj.$parent[type].playlist.obj.is_magnet) {
                                    is_magnet = true;
                                    this_obj.$parent[type].itemName = ':' + this_obj.$parent[type].playlist.obj.title;
                                    if (this_obj.$parent[type].playlist.obj.id) {
                                        this_obj.$parent[type].src = $scope.main_url + '/torrent/0/' + videoId;
                                    } else {
                                        if (isValidString(this_obj.$parent[type].playlist.obj.magnet, 'url')) {
                                            var uploadurl = $scope.main_url + '/api/upload/url';
                                            if (this_obj.$parent.adultonly) {
                                                uploadurl = $scope.main_url + '/api/upload/url/1';
                                            }
                                            var upApi = $resource(uploadurl, {}, {
                                                'uploadUrl': { method:'POST', withCredentials: true }
                                            });
                                            upApi.uploadUrl({url: this_obj.$parent[type].playlist.obj.magnet, hide: true}, function (result) {
                                                if (result.loginOK) {
                                                    $window.location.href = $location.path();
                                                } else {
                                                    videoId = this_obj.$parent[type].playlist.obj.id = result.id;
                                                    this_obj.$parent[type].src = $scope.main_url + '/torrent/0/' + videoId;
                                                    removeCue();
                                                    this_obj.$parent[type].sub = '/subtitle/' + videoId;
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
                                            addAlert('magnet not valid');
                                        }
                                    }
                                }
                            }
                            if (!is_magnet) {
                                var externalApi = $resource(this_obj.main_url + '/api/external/getSingle/' + videoId, {}, {
                                    'getSingle': { method:'GET', withCredentials: true }
                                });
                                externalApi.getSingle({}, function (result) {
                                    if (result.loginOK) {
                                        $window.location.href = $location.path();
                                    } else {
                                        if (videoId === this_obj.$parent[type].id || (this_obj.$parent[type].playlist && videoId === this_obj.$parent[type].playlist.obj.id)) {
                                            if (this_obj.$parent[type].playlist) {
                                                if (this_obj.$parent[type].playlist.obj.title) {
                                                    this_obj.$parent[type].itemName = ':' + this_obj.$parent[type].playlist.obj.title;
                                                } else {
                                                    this_obj.$parent[type].itemName = ':' + result.title;
                                                }
                                            }
                                            if (type === 'music') {
                                                if (result.audio) {
                                                    this_obj.$parent[type].src = result.audio;
                                                } else {
                                                    this_obj.$parent[type].src = result.video[0];
                                                }
                                            } else {
                                                this_obj.$parent[type].hd_list = result.video;
                                                if (result.sub) {
                                                    this_obj.$parent[type].playlist.obj.sub = result.sub;
                                                }
                                                var hd = 0;
                                                if (this_obj.$parent[type].hd < this_obj.$parent[type].hd_list.length) {
                                                    hd = this_obj.$parent[type].hd;
                                                } else {
                                                    hd = this_obj.$parent[type].hd_list.length - 1;
                                                }
                                                this_obj.$parent[type].src = this_obj.$parent[type].hd_list[hd];
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
                        } else {
                            this_obj.$parent[type].src = $scope.main_url + '/' + preType + '/' + item.id;
                        }
                        this_obj.$parent[type].maxId = item.present;
                        if (type === 'video') {
                            removeCue();
                            this_obj.$parent[type].sub = '/subtitle/' + videoId;
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
                        for (var i in this_obj.$parent[type].list) {
                            if (!this_obj.$parent[type].list[i].noDb) {
                                this_obj.$parent[type].frontPage++;
                            }
                        }
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

    $scope.showTorrent = function(item) {
        var this_obj = this;
        var torrentApi = $resource('/api/torrent/query/preview/' + item.id, {}, {
            'query': { method:'GET'}
        });
        //torrentApi.query({torrent: 'magnet:?xt=urn:btih:fc2d08cb56916db71959755c46774a33b8c91261'}, function (result) {
        //magnet:?xt=urn:btih:NYUTBHOPLRSEHADVYBS3UWSYDD2ATJFE
        //torrentApi.query({torrent: 'magnet:?xt=urn:btih:15d8402278b44bdd1286ac410c7c0bf76cb63653&dn=The.Walking.Dead.S06E04.PROPER.720p.HDTV.x264-KILLERS%5Bettv%5D&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80&tr=udp%3A%2F%2Fopen.demonii.com%3A1337&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Fexodus.desync.com%3A6969'}, function (result) {
        //torrentApi.query({torrent: 'magnet:?xt=urn:btih:76baf98e3797c103eb02f668075ad047f10df130&dn=The.Man.from.U.N.C.L.E.2015.1080p.WEB-DL.x264.AC3-JYK&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80&tr=udp%3A%2F%2Fopen.demonii.com%3A1337&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Fexodus.desync.com%3A6969'}, function (result) {
        torrentApi.query({}, function(result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            }
            console.log(result);
            if (result.list.length > 0) {
                this_obj['torrent'].id = result.id;
                this_obj['torrent'].list = result.list;
                this_obj['torrent'].index = 0;
                if (result.time) {
                    var setTime = result.time.toString().match(/^(\d+)(&(\d+))?$/);
                    if (setTime) {
                        torrentStart = setTime[1];
                        if (setTime[3]) {
                            this_obj['torrent'].index = Number(setTime[3]);
                        }
                    }
                }
                this_obj['torrent'].complete = false;
                this_obj['torrent'].name = this_obj['torrent'].list[this_obj['torrent'].index];
                this_obj['torrent'].src = $scope.main_url + '/torrent/' + this_obj['torrent'].index + '/' + this_obj['torrent'].id;
                removeCue('torrent');
                this_obj['torrent'].sub = '/subtitle/' + this_obj['torrent'].id + '/' + this_obj['torrent'].index;
                this_obj.mediaToggle('torrent', true);
            } else {
                addAlert('No preview file!!!');
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
            this.$parent.toolList.searchSub = false;
            this.$parent.toolList.delMedia = false;
            this.$parent.toolList.vlogMedia = false;
            this.$parent.toolList.subscription = false;
            this.$parent.toolList.origin = false;
            this.$parent.toolList.save2local = false;
            confirm_str = item;
        } else {
            if (item.status === 7 || item.status === 8 || item.status === 9 || item.thumb) {
                this.$parent.toolList.download = false;
            } else {
                this.$parent.toolList.download = true;
            }
            this.$parent.toolList.dir = false;
            if (item.isOwn) {
                this.$parent.toolList.del = true;
                if (!item.thumb) {
                    this.$parent.toolList.edit = true;
                } else {
                    this.$parent.toolList.edit = false;
                }
            } else {
                this.$parent.toolList.edit = false;
                this.$parent.toolList.del = false;
            }
            if (item.recycle === 1 || item.recycle === 2 || item.recycle === 3 || item.recycle === 4) {
                this.$parent.toolList.recover = true;
            } else {
                this.$parent.toolList.recover = false;
            }
            if (item.status === 3) {
                this.$parent.toolList.upload = true;
                this.$parent.toolList.searchSub = true;
            } else {
                this.$parent.toolList.upload = false;
                this.$parent.toolList.searchSub = false;
            }
            if (item.media) {
                this.$parent.toolList.delMedia = true;
                this.$parent.toolList.vlogMedia = true;
            } else {
                this.$parent.toolList.delMedia = false;
                this.$parent.toolList.vlogMedia = false;
            }
            if (item.thumb) {
                if (item.status === 3) {
                    this.$parent.toolList.origin = true;
                } else {
                    this.$parent.toolList.origin = false;
                }
            } else {
                this.$parent.toolList.origin = false;
            }
            if (item.cid) {
                this.$parent.toolList.subscription = true;
                this.$parent.toolList.title = item.ctitle;
            } else {
                this.$parent.toolList.subscription = false;
            }
            if (item.noDb) {
                this.$parent.toolList.save2local = true;
            } else {
                this.$parent.toolList.save2local = false;
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
            this.isRelative = true;
            getOptionTag();
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
                this_obj.$parent.pageToken = '';
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
            this.bookmarkNew = false;
            this.bookmarkName = '';
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
                        if (result.name) {
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
    $scope.navList = [{title: "homepage", hash: "/", css: "fa fa-fw fa-dashboard"}, {title: "Storage", hash: "/Storage", css: "fa fa-fw fa-desktop"}, {title: "Password", hash: "/Password", css: "fa fa-fw fa-key"}];
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
    $scope.moveDisabled = {video: false, music: false};
    $scope.isFull = false;
    $scope.isVisible = false;
    $scope.isExtend = false;
    $scope.adultonly = false;
    $scope.mediaShow = [];
    $scope.image = {id: "", src: "", name: "null", list: [], index: 0, front: 0, back: 0, frontPage: 0, backPage: 0, end: false, bookmarkID: '', presentId: 1, showId: 1, maxId: 1};
    $scope.video = {id: "", src: "", sub: "", name: "null", list: [], index: 0, front: 0, back: 0, frontPage: 0, backPage: 0, end: false, bookmarkID: '', option: 0, playlist: null, mode: 0, itemName: "", hd: 0, hd_list: []};
    $scope.music = {id: "", src: "", name: "null", list: [], index: 0, front: 0, back: 0, frontPage: 0, backPage: 0, end: false, bookmarkID: '', option: 0, playlist: null, mode: 0, itemName: ""};
    $scope.doc = {id: "", src: "", name: "null", list: [], index: 0, front: 0, back: 0, frontPage: 0, backPage: 0, end: false, bookmarkID: '', presentId: 1, showId: 1, maxId: 1, mode: false};
    $scope.present = {id: "", src: "", name: "null", list: [], index: 0, front: 0, back: 0, frontPage: 0, backPage: 0, end: false, bookmarkID: '', presentId: 1, showId: 1, maxId: 1};
    $scope.torrent = {id: "", src: "", complete: "", sub: "", name: "null", list: [], index: 0, bookmarkID: '', option: 0};
    $scope.inputUrl = '';
    $scope.disableUrlSave = false;
    $scope.isAdult = false;
    $scope.curTorrentSub = '';
    $scope.curTorrentSubTime = 0;
    $scope.fixTorrentSub = false;
    $scope.curVideoSub = '';
    $scope.curVideoSubTime = 0;
    $scope.fixVideoSub = false;
    $scope.videoSwitch = false;
    $scope.musicSwitch = false;
    $scope.torrentSwitch = false;
    $scope.noEnd = false;
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

    $scope.torrentToggle = function() {
        if (!is_firefox) {
            torrent.focus();
            if (torrent.paused) {
                torrent.play();
            } else {
                torrent.pause();
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

    $scope.fixSub = function(type) {
        if (type === 'torrent') {
            if (this.fixTorrentSub) {
                this.mediaToggle('torrent');
                var adjust = Math.ceil((torrent.currentTime - this.curTorrentSubTime) * 10)/10;
                openModal("確定校準此字幕到此時間軸？完畢後請刷新頁面，字幕才會更新").then(function () {
                    $scope.fixTorrentSub = false;
                    $scope.curTorrentSub = '';
                    fixSubtitle(adjust, 'torrent');
                }, function () {
                });
            } else {
                if (torrent && torrent.textTracks && torrent.textTracks[0].activeCues && torrent.textTracks[0].activeCues.length > 0) {
                    this.curTorrentSub = torrent.textTracks[0].activeCues[0].text;
                    this.curTorrentSubTime = torrent.textTracks[0].activeCues[0].startTime;
                    this.fixTorrentSub = true;
                    torrent.pause();
                }
            }
        } else {
            if (this.fixVideoSub) {
                this.mediaToggle('video');
                var adjust = Math.ceil((video.currentTime - this.curVideoSubTime) * 10)/10;
                openModal("確定校準此字幕到此時間軸？完畢後請刷新頁面，字幕才會更新").then(function () {
                    $scope.fixVideoSub = false;
                    $scope.curVideoSub = '';
                    fixSubtitle(adjust, 'video');
                }, function () {
                });
            } else {
                if (video && video.textTracks && video.textTracks[0].activeCues && video.textTracks[0].activeCues.length > 0) {
                    this.curVideoSub = video.textTracks[0].activeCues[0].text;
                    this.curVideoSubTime = video.textTracks[0].activeCues[0].startTime;
                    this.fixVideoSub = true;
                    video.pause();
                }
            }
        }
    }

    $scope.toggleSub = function(type) {
        var obj = video;
        if (type === 'torrent') {
            obj = torrent;
        }
        if (obj.textTracks[0].mode === 'showing') {
            obj.textTracks[0].mode = "hidden";
        } else {
            obj.textTracks[0].mode = "showing";
        }
    }

    document.getElementById('video-tag').onkeydown = function(evt) {
        evt = evt || window.event;
        if (is_firefox) {
            switch(evt.keyCode) {
                case 67:
                $scope.toggleSub();
                break;
                case 70:
                $scope.fixSub();
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
                if ($scope.fixVideoSub) {
                    if (video.currentTime >= 0.5) {
                        video.currentTime -= 0.5;
                    } else {
                        video.currentTime = 0;
                    }
                } else {
                    if (video.currentTime >= 15) {
                        video.currentTime -= 15;
                    } else {
                        video.currentTime = 0;
                    }
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
                if ($scope.fixVideoSub) {
                    video.currentTime += 0.5;
                } else {
                    video.currentTime += 15;
                }
                break;
                case 40:
                if (video.volume > 0.1) {
                    video.volume-= 0.1;
                } else {
                    video.volume = 0;
                }
                break;
                case 67:
                $scope.toggleSub();
                break;
                case 70:
                $scope.fixSub();
                break;
            }
        }
    };
    document.getElementById('torrent-tag').onkeydown = function(evt) {
        evt = evt || window.event;
        if (is_firefox) {
            switch(evt.keyCode) {
                case 67:
                $scope.toggleSub('torrent');
                break;
                case 70:
                $scope.fixSub('torrent');
                break;
            }
        } else {
            switch(evt.keyCode) {
                case 32:
                if (torrent.paused) {
                    torrent.play();
                } else {
                    torrent.pause();
                }
                break;
                case 37:
                if ($scope.fixTorrentSub) {
                    if (torrent.currentTime >= 0.5) {
                        torrent.currentTime -= 0.5;
                    } else {
                        torrent.currentTime = 0;
                    }
                } else {
                    if (torrent.currentTime >= 15) {
                        torrent.currentTime -= 15;
                    } else {
                        torrent.currentTime = 0;
                    }
                }
                break;
                case 38:
                if (torrent.volume < 0.9) {
                    torrent.volume+= 0.1;
                } else {
                    torrent.volume = 1;
                }
                break;
                case 39:
                if ($scope.fixTorrentSub) {
                    torrent.currentTime += 0.5;
                } else {
                    torrent.currentTime += 15;
                }
                break;
                case 40:
                if (torrent.volume > 0.1) {
                    torrent.volume-= 0.1;
                } else {
                    torrent.volume = 0;
                }
                break;
                case 67:
                $scope.toggleSub('torrent');
                break;
                case 70:
                $scope.fixSub('torrent');
                break;
            }
        }
    };
    function fixSubtitle(adjust, type) {
        var append = '';
        if (type === 'torrent') {
            append = $scope.torrent.id + '/' + adjust + '/' + $scope.torrent.index;
        } else {
            append = $scope.video.id + '/' + adjust;
        }
        var subtitleApi = $resource($scope.main_url + '/api/subtitle/fix/' + append, {}, {
            'fix': { method:'GET', withCredentials: true }
        });
        subtitleApi.fix({}, function (result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                addAlert('字幕校準成功');
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
        $scope.$watch("torrent.sub", function(newVal, oldVal) {
            if (newVal) {
                if (!torrent.textTracks.length){
                    torrent.addTextTrack("subtitles", "English", "en-US");
                    torrent.textTracks[0].mode = "showing";
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
                                torrent.textTracks[0].addCue(cue);
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

    removeCue = function(type) {
        var track = null;
        if (type === 'torrent') {
            track = torrent.textTracks[0];
        } else {
            track = video.textTracks[0];
        }
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
        if (vId && video.duration) {
            var vTime = 0;
            vTime = parseInt(video.currentTime);
            var vXmlhttp = new XMLHttpRequest();
            var append = '';
            if ($scope.video.playlist) {
                vId = $scope.video.playlist.obj.id;
            }
            vXmlhttp.open("GET", "/api/media/record/" + vId + '/' + vTime, false);//the false is for making the call synchronous
            vXmlhttp.setRequestHeader("Content-type", "application/json");
            vXmlhttp.send('');
        }
        var tId = $scope.torrent.id;
        if (tId && torrent && torrent.duration) {
            var tTime = parseInt(torrent.currentTime) + '&' + $scope.torrent.index;
            var vXmlhttp = new XMLHttpRequest();
            vXmlhttp.open("GET", "/api/media/record/" + tId + '/' + tTime, false);//the false is for making the call synchronous
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
        if (response.id) {
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
                this_obj.feedback.run = true;
                showFeedback(response);
            }
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
                    this.feedbackInput = '';
                    this.feedbackBlur = true;
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
        if (response.id) {
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
                        $scope.feedback.list.splice(0, 0, $scope.feedback.list.splice(index, 1)[0]);
                    }
                }
            }
        }
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
                            /*case 'torrent':
                                if (wsmsg.data.id === $scope.torrent.id && wsmsg.data.index === $scope.torrent.index) {
                                    $scope.torrentCheck();
                                }
                                break;*/
                            case $scope.id:
                                $scope.$apply(function() {
                                    addAlert(wsmsg.data);
                                });
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
                    if (result.stop) {
                        addAlert('torrent was stoped');
                    } else {
                        if (result.name) {
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

    $scope.save2local = function(music, id) {
        if (!id) {
            if (this.toolList.item.id.substr(0, 4) === 'you_') {
                url =  'https://www.youtube.com/watch?v=' + this.toolList.item.id.substr(4);
            } else if (this.toolList.item.id.substr(0, 4) === 'ypl_') {
                url =  'https://www.youtube.com/watch?list=' + this.toolList.item.id.substr(4);
            } else if (this.toolList.item.id.substr(0, 4) === 'kub_') {
                url =  'http://www.123kubo.com/vod-read-id-' + this.toolList.item.id.substr(4) + '.html';
            } else {
                addAlert('not external video');
                return false;
            }
            if (this.toolList.item.status === 4) {
                url = url + ':music';
            }
        } else {
            if (id.substr(0, 4) === 'you_') {
                url =  'https://www.youtube.com/watch?v=' + id.substr(4);
            } else if (id.substr(0, 4) === 'ypl_') {
                url =  'https://www.youtube.com/watch?list=' + id.substr(4);
            } else if (id.substr(0, 4) === 'kub_') {
                url =  'http://www.123kubo.com/vod-read-id-' + id.substr(4) + '.html';
            } else {
                addAlert('not external video');
                return false;
            }
            if (music) {
                url = url + ':music';
            }
        }
        var this_obj = this;
        if (isValidString(url, 'url')) {
            var uploadurl = this.main_url + '/api/upload/url';
            if (this.adultonly) {
                uploadurl = this.main_url + '/api/upload/url/1';
            }
            var api = $resource(uploadurl, {}, {
                'uploadUrl': { method:'POST', withCredentials: true }
            });
            api.uploadUrl({url: url}, function (result) {
                if (result.loginOK) {
                    $window.location.href = $location.path();
                } else {
                    if (result.name) {
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

    $scope.subscription = function(cid, ctitle, type) {
        if (!cid) {
            cid = this.toolList.item.cid;
            ctitle = this.toolList.title;
            if (this.toolList.item.status === 3) {
                type = 'video';
            } else if (this.toolList.item.status === 4) {
                type = 'music';
            }
        }
        if (type !== 'music' && type !== 'video') {
            addAlert('Type is not valid!!!');
        } else {
            if (isValidString(ctitle, 'name')) {
                var this_obj = this;
                var bookmarkapi = $resource('/api/bookmark/subscipt', {}, {
                    'subscipt': { method:'POST' }
                });
                bookmarkapi.subscipt({name: ctitle, path: ['ych_' + cid, 'no local', 'youtube playlist', 'youtube ' + type], exactly: [false, false]}, function(result) {
                    if (result.loginOK) {
                        $window.location.href = $location.path();
                    } else {
                        if (result.id) {
                            this_obj.bookmarkList.push({id: result.id, name: result.name});
                        }
                        if (result.bid) {
                            result.id = result.bid;
                            result.name = result.bname;
                            if (result.name) {
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
                addAlert('Bookmark name is not valid!!!');
            }
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
                    if (result.name) {
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

    $scope.torrentCheck = function(type) {
        var this_obj = null;
        var src_obj = null;
        var index = 0;
        if (type === 'video') {
            this_obj = this['video'].playlist.obj;
            src_obj = this['video'];
        } else {
            this_obj = src_obj = this['torrent'];
            index = this['torrent'].index;
        }
        if (!this_obj.id || this_obj.complete) {
            return;
        }
        var id = this_obj.id;
        var size = 0;
        if (this_obj.size) {
            size = parseInt(this_obj.size);
        }
        var torrentApi = $resource($scope.main_url + '/api/torrent/check/' + id + '/' + index + '/' + size, {}, {
            'check': { method:'GET', withCredentials: true }
        });
        torrentApi.check({}, function (result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            }
            console.log(result);
            if (result.start) {
                addAlert('video start buffering');
            } else {
                this_obj.size = result.ret_size;
                if (result.newBuffer) {
                    if (type === 'video') {
                        videoStart = video.currentTime;
                    } else {
                        torrentStart = torrent.currentTime;
                    }
                    var urlmatch = src_obj.src.match(/(.*)\/(\d+)$/);
                    if (urlmatch) {
                        var fresh = Number(urlmatch[2]) + 1;
                        src_obj.src = urlmatch[1] + '/' + fresh;
                    } else {
                        src_obj.src = src_obj.src + '/0';
                    }
                }
                this_obj.complete = result.complete;
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

    $scope.torrentMove = function(number, end) {
        if (end && torrentPre < torrent.duration - 3) {
            torrent.currentTime = torrentPre;
            torrent.pause();
        } else {
            if (this.torrent.id) {
                this.mediaRecord('torrent', 0, end);
            }
            var count = this.torrent.list.length;
            if (count === 1) {
                if (!end || this.torrent.complete) {
                    torrent.currentTime = 0;
                    torrent.pause();
                }
            } else {
                if (+this.torrent.index + number >= count) {
                    this.torrent.index = +this.torrent.index + number - count;
                } else if (+this.torrent.index + number < 0) {
                    this.torrent.index = +this.torrent.index + number + count;
                } else {
                    this.torrent.index = +this.torrent.index + number;
                }
                this.torrent.complete = false;
                this.torrent.name = this.torrent.list[this.torrent.index];
                this.torrent.src = $scope.main_url + '/torrent/' + this.torrent.index + '/' + this.torrent.id;
                removeCue('torrent');
                this.torrent.sub = '/subtitle/' + this.torrent.id + '/' + this.torrent.index;
            }
        }
    }

    $scope.mediaRecord = function(type, record, end, is_playlist, callback) {
        var id = this[type].id;
        var time = 0;
        var index = -1;
        var append = '';
        if (id) {
            if (type === 'video') {
                if (!video.duration) {
                    if (callback) {
                        setTimeout(function(){
                            callback(null);
                        }, 0);
                    }
                    return false;
                }
                if (!end) {
                    time = parseInt(video.currentTime);
                }
                if (is_playlist && this[type].playlist) {
                    append = '/' + id;
                }
                if (this[type].playlist) {
                    id = this[type].playlist.obj.id;
                }
            } else if (type === 'music') {
                if (callback) {
                    setTimeout(function(){
                        callback(null);
                    }, 0);
                }
                return false;
                //music不記錄
                //if (!end) {
                //    time = parseInt(music.currentTime);
                //}
            } else if (type === 'torrent') {
                if (!torrent || !torrent.duration) {
                    if (callback) {
                        setTimeout(function(){
                            callback(null);
                        }, 0);
                    }
                    return;
                }
                if (!end || !this.torrent.complete) {
                    time = parseInt(torrent.currentTime) + '&' + this.torrent.index;
                }
            } else if (this[type].iframeOffset) {
                if (record !== 1) {
                    time = record;
                }
            } else {
                if (callback) {
                    setTimeout(function(){
                        callback(null);
                    }, 0);
                }
                return;
            }
            var mediaApi = $resource('/api/media/record/' + id + '/' + time + append, {}, {
                'record': { method:'GET' }
            });
            mediaApi.record({}, function (result) {
                if (result.loginOK) {
                    $window.location.href = $location.path();
                }
                if (callback) {
                    setTimeout(function(){
                        callback(null);
                    }, 0);
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

    $scope.videoMove = function(type, direction, ended) {
        if (this[type].playlist) {
            if (this[type].playlist.obj.is_magnet) {
                if (ended && videoPre < video.duration - 3) {
                    video.currentTime = videoPre;
                    video.pause();
                    return ;
                }
            }
            this[type].itemName = '';
            var newIndex = 0;
            if (direction && direction.toString().match(/^\d+(\.\d+)?$/)) {
                direction = +direction;
                if (direction === +this[type].playlist.obj.index) {
                    return false;
                } else {
                    if (this[type].playlist.obj_arr) {
                        newIndex = Math.floor(+this[type].playlist.obj.index);
                        if (direction > this[type].playlist.obj.index) {
                            newIndex++;
                        } else {
                            newIndex--;
                        }
                    } else {
                        if (direction < 1) {
                            newIndex = 1;
                        } else if (direction > this[type].playlist.total+1) {
                            newIndex = this[type].playlist.total;
                        } else {
                            newIndex = direction;
                        }
                    }
                }
            } else {
                if (this[type].playlist.obj.sub) {
                    newIndex = (+this[type].playlist.obj.index)*10;
                    if (newIndex%10 === 0) {
                        newIndex++;
                    }
                    if (direction === 'previous') {
                        newIndex--;
                    } else {
                        newIndex++;
                    }
                    if (newIndex%10 === 0) {
                        newIndex = newIndex/10 - 1;
                    } else if (newIndex%10 > this[type].playlist.obj.sub) {
                        newIndex = Math.floor(newIndex/10) + 1;
                    } else {
                        newIndex = newIndex/10;
                    }
                } else {
                    newIndex = Math.floor(+this[type].playlist.obj.index);
                    if (direction === 'previous') {
                        newIndex--;
                    } else {
                        newIndex++;
                    }
                }
            }
            if (newIndex >= 1 && newIndex <= this[type].playlist.total && !this.moveDisabled[type]) {
                this.moveDisabled[type] = true;
                var append = '';
                this.mediaRecord('video', 0, ended);
                if (this[type].playlist.obj_arr) {
                    var realIndex = arrayObjectIndexOf(this[type].playlist.obj_arr, newIndex, 'index');
                    if (realIndex !== -1) {
                        this[type].playlist.obj = this[type].playlist.obj_arr[realIndex];
                        append = '/' + this[type].playlist.obj.id;
                        if (this[type].playlist.pageToken) {
                            append = append + '/' + this[type].playlist.pageToken;
                        }
                    } else {
                        append = '/' + this[type].playlist.obj.id;
                        if (direction === 'previous') {
                            if (this[type].playlist.pageP) {
                                append = append + '/' + this[type].playlist.pageP + '/back';
                            }
                        } else {
                            if (this[type].playlist.pageN) {
                                append = append + '/' + this[type].playlist.pageN;
                            }
                        }
                    }
                } else {
                    append = '/' + newIndex;
                }
                var this_obj = this;
                this[type].src = this[type].list[this[type].index + this[type].back].thumb;
                var mediaApi = $resource('/api/media/setTime/' + this[type].id + '/' + type + append, {}, {
                    'setTime': { method:'GET' }
                });
                mediaApi.setTime({}, function (result) {
                    if (result.loginOK) {
                        $window.location.href = $location.path();
                    } else {
                        //var videoIndex = 0;
                        if (result.time) {
                            var setTime = result.time.toString().match(/^(\d+)(&(\d+))?$/);
                            if (setTime) {
                                if (type === 'video') {
                                    videoStart = setTime[1];
                                    //if (setTime[3]) {
                                    //    videoIndex = setTime[3];
                                    //}
                                } else if (type === 'music'){
                                    musicStart = setTime[1];
                                }
                            }
                        }
                        if (result.playlist) {
                            this_obj[type].playlist = result.playlist;
                        } else {
                            this_obj[type].playlist = null;
                        }
                        this_obj.moveDisabled[type] = false;
                        var videoId = this_obj[type].id;
                        var is_magnet = false;
                        if (this_obj[type].playlist.obj.id) {
                            videoId = this_obj[type].playlist.obj.id;
                        }
                        if (this_obj[type].playlist.obj.is_magnet) {
                            is_magnet = true;
                            this_obj[type].itemName = ':' + this_obj[type].playlist.obj.title;
                            if (this_obj[type].playlist.obj.id) {
                                this_obj[type].src = $scope.main_url + '/torrent/0/' + videoId;
                            } else {
                                if (isValidString(this_obj[type].playlist.obj.magnet, 'url')) {
                                    var uploadurl = $scope.main_url + '/api/upload/url';
                                    if (this_obj.adultonly) {
                                        uploadurl = $scope.main_url + '/api/upload/url/1';
                                    }
                                    var upApi = $resource(uploadurl, {}, {
                                        'uploadUrl': { method:'POST', withCredentials: true }
                                    });
                                    upApi.uploadUrl({url: this_obj[type].playlist.obj.magnet, hide: true}, function (result) {
                                        if (result.loginOK) {
                                            $window.location.href = $location.path();
                                        } else {
                                            console.log(result);
                                            videoId = this_obj[type].playlist.obj.id = result.id;
                                            this_obj[type].src = $scope.main_url + '/torrent/0/' + videoId;
                                            removeCue();
                                            this_obj[type].sub = '/subtitle/' + videoId;
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
                                    addAlert('magnet not valid');
                                }
                            }
                        }
                        if (!is_magnet) {
                            var externalApi = $resource(this_obj.main_url + '/api/external/getSingle/' + videoId, {}, {
                                'getSingle': { method:'GET', withCredentials: true }
                            });
                            externalApi.getSingle({}, function (result) {
                                if (result.loginOK) {
                                    $window.location.href = $location.path();
                                } else {
                                    if (videoId === this_obj[type].playlist.obj.id) {
                                        if (this_obj[type].playlist) {
                                            this_obj[type].itemName = ':' + result.title;
                                        }
                                        if (type === 'music') {
                                            if (result.audio) {
                                                this_obj[type].src = result.audio;
                                            } else {
                                                this_obj[type].src = result.video[0];
                                            }
                                        } else {
                                            this_obj[type].hd_list = result.video;
                                            if (result.sub) {
                                                this_obj[type].playlist.obj.sub = result.sub;
                                            }
                                            var hd = 0;
                                            if (this_obj[type].hd < this_obj[type].hd_list.length) {
                                                hd = this_obj[type].hd;
                                            } else {
                                                hd = this_obj[type].hd_list.length - 1;
                                            }
                                            this_obj[type].src = this_obj[type].hd_list[hd];
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
                        if (type === 'video') {
                            removeCue();
                            this_obj[type].sub = '/subtitle/' + videoId;
                        }
                    }
                }, function(errorResult) {
                    this_obj.moveDisabled[type] = false;
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
    }

    $scope.nextVideo = function(type) {
        if (this[type].playlist && this[type].playlist.obj.index < this[type].playlist.total) {
            this.videoMove(type, 'next', true);
        } else {
            if (!this.noEnd && this[type].playlist) {
                return false;
            } else {
                if (type === 'music') {
                    this.musicShuffle();
                } else {
                    switch (this[type].mode) {
                        case 1:
                        this.mediaMove(-1, type, true);
                        break;
                        case 2:
                        this.mediaMove(0, type, true, true);
                        break;
                        case 0:
                        default:
                        this.mediaMove(1, type, true);
                        break;
                    }
                }
            }
        }
    }

    $scope.changeMode = function(type) {
        if (this[type].mode < 2) {
            this[type].mode++;
        } else {
            if (type === 'music' && this[type].mode < 3) {
                this[type].mode++;
            } else {
                this[type].mode = 0;
            }
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

    $scope.originSubtitle = function(type) {
        var id = null;
        if (type === 'video') {
            if (this.video.id) {
                id = this.video.id;
            } else {
                addAlert('select a video');
                return false;
            }
        } else {
            if (this.toolList.item) {
                id = this.toolList.item.id;
            } else {
                addAlert('select a item');
                return false;
            }
        }
        var externalApi = $resource(this.main_url + '/api/external/getSubtitle/' + id, {}, {
            'getSingle': { method:'GET', withCredentials: true }
        });
        externalApi.getSingle({}, function (result) {
            if (result.loginOK) {
                $window.location.href = $location.path();
            } else {
                addAlert('subtitle get');
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
                this.video.itemName = '';
                video.pause();
                break;
            case 'music':
                preType = 'video';
                status = 4;
                music.pause();
                this.music.itemName = '';
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
        var ori_index = +this[type].index;
        function isOri() {
            if (ori_index === this_obj[type].index) {
                if (type === 'video') {
                    video.currentTime = 0;
                    video.play();
                } else if (type === 'music') {
                    music.currentTime = 0;
                    music.play();
                }
            }
        }
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
                            if (length > 0) {
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
                            if (this_obj[type].index >= this_obj[type].front) {
                                this_obj[type].index = -this_obj[type].back;
                            }
                            $scope.mediaMoreDisabled = false;
                            if (this_obj[type].id) {
                                this_obj.mediaRecord(type, docRecord, ended, true);
                            }
                            var append = '';
                            if (this_obj[type].list[this_obj[type].index + this_obj[type].back].url) {
                                append = '/external';
                            }
                            var mediaApi = $resource('/api/media/setTime/' + this_obj[type].list[this_obj[type].index + this_obj[type].back].id + '/' + type + append, {}, {
                                'setTime': { method:'GET' }
                            });
                            mediaApi.setTime({}, function (result) {
                                if (result.loginOK) {
                                    $window.location.href = $location.path();
                                } else {
                                    //var videoIndex = 0;
                                    if (result.time) {
                                        var setTime = result.time.toString().match(/^(\d+)(&(\d+))?$/);
                                        if (setTime) {
                                            if (type === 'video') {
                                                videoStart = setTime[1];
                                                //if (setTime[3]) {
                                                //    videoIndex = setTime[3];
                                                //}
                                            } else if (type === 'music'){
                                                musicStart = setTime[1];
                                            } else {
                                                this_obj[type].presentId = this_obj[type].showId = setTime[1];
                                            }
                                        }
                                    }
                                    var videoId = this_obj[type].list[this_obj[type].index + this_obj[type].back].id;
                                    if (result.playlist) {
                                        this_obj[type].playlist = result.playlist;
                                    } else {
                                        this_obj[type].playlist = null;
                                    }
                                    this_obj[type].maxId = this_obj[type].list[this_obj[type].index + this_obj[type].back].present;
                                    if (type === 'doc') {
                                        this_obj[type].iframeOffset = null;
                                        this_obj[type].src = $scope.main_url + '/' + preType + '/' + this_obj[type].list[this_obj[type].index + this_obj[type].back].id + '/doc';
                                    } else if (this_obj[type].list[this_obj[type].index + this_obj[type].back].thumb) {
                                        this_obj[type].src = this_obj[type].list[this_obj[type].index + this_obj[type].back].thumb;
                                        if (type === 'video') {
                                            video.poster = this_obj[type].src;
                                        }
                                        var is_magnet = false;
                                        if (this_obj[type].playlist) {
                                            if (this_obj[type].playlist.obj.id) {
                                                videoId = this_obj[type].playlist.obj.id;
                                            }
                                            if (this_obj[type].playlist.obj.is_magnet) {
                                                is_magnet = true;
                                                this_obj[type].itemName = ':' + this_obj[type].playlist.obj.title;
                                                if (this_obj[type].playlist.obj.id) {
                                                    this_obj[type].src = $scope.main_url + '/torrent/0/' + videoId;
                                                    isOri();
                                                } else {
                                                    if (isValidString(this_obj[type].playlist.obj.magnet, 'url')) {
                                                        var uploadurl = $scope.main_url + '/api/upload/url';
                                                        if (this_obj.adultonly) {
                                                            uploadurl = $scope.main_url + '/api/upload/url/1';
                                                        }
                                                        var upApi = $resource(uploadurl, {}, {
                                                            'uploadUrl': { method:'POST', withCredentials: true }
                                                        });
                                                        upApi.uploadUrl({url: this_obj[type].playlist.obj.magnet, hide: true}, function (result) {
                                                            if (result.loginOK) {
                                                                $window.location.href = $location.path();
                                                            } else {
                                                                videoId = this_obj[type].playlist.obj.id = result.id;
                                                                this_obj[type].src = $scope.main_url + '/torrent/0/' + videoId;
                                                                isOri();
                                                                removeCue();
                                                                this_obj[type].sub = '/subtitle/' + videoId;
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
                                                        addAlert('magnet not valid');
                                                    }
                                                }
                                            }
                                        }
                                        if (!is_magnet) {
                                            var externalApi = $resource($scope.main_url + '/api/external/getSingle/' + videoId, {}, {
                                                'getSingle': { method:'GET', withCredentials: true }
                                            });
                                            externalApi.getSingle({}, function (result) {
                                                if (result.loginOK) {
                                                    $window.location.href = $location.path();
                                                } else {
                                                    if (videoId === this_obj[type].id || (this_obj[type].playlist && videoId === this_obj[type].playlist.obj.id)) {
                                                        if (this_obj[type].playlist) {
                                                            this_obj[type].itemName = ':' + result.title;
                                                        }
                                                        if (type === 'music') {
                                                            if (result.audio) {
                                                                this_obj[type].src = result.audio;
                                                            } else {
                                                                this_obj[type].src = result.video[0];
                                                            }
                                                        } else {
                                                            this_obj[type].hd_list = result.video;
                                                            if (result.sub) {
                                                                this_obj[type].playlist.obj.sub = result.sub;
                                                            }
                                                            var hd = 0;
                                                            if (this_obj[type].hd < this_obj[type].hd_list.length) {
                                                                hd = this_obj[type].hd;
                                                            } else {
                                                                hd = this_obj[type].hd_list.length - 1;
                                                            }
                                                            this_obj[type].src = this_obj[type].hd_list[hd];
                                                        }
                                                        isOri();
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
                                    } else {
                                        this_obj[type].src = $scope.main_url + '/' + preType + '/' + this_obj[type].list[this_obj[type].index + this_obj[type].back].id;
                                        isOri();
                                    }
                                    if (type === 'video') {
                                        removeCue();
                                        this_obj[type].sub = '/subtitle/' + videoId;
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
                        if (type === 'video' || type === 'music') {
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
                            if (length > 0) {
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
                                this_obj[type].index = this_obj[type].front - 1;
                            }
                            $scope.mediaMoreDisabled = false;
                            if (this_obj[type].id) {
                               this_obj.mediaRecord(type, docRecord, ended, true);
                            }
                            var append = '';
                            if (this_obj[type].list[this_obj[type].index + this_obj[type].back].url) {
                                append = '/external';
                            }
                            var mediaApi = $resource('/api/media/setTime/' + this_obj[type].list[this_obj[type].index + this_obj[type].back].id + '/' + type + append, {}, {
                                'setTime': { method:'GET' }
                            });
                            mediaApi.setTime({}, function (result) {
                                if (result.loginOK) {
                                    $window.location.href = $location.path();
                                } else {
                                    //var videoIndex = 0;
                                    if (result.time) {
                                        var setTime = result.time.toString().match(/^(\d+)(&(\d+))?$/);
                                        if (setTime) {
                                            if (type === 'video') {
                                                videoStart = setTime[1];
                                                //if (setTime[3]) {
                                                //    videoIndex = setTime[3];
                                                //}
                                            } else if (type === 'music'){
                                                musicStart = setTime[1];
                                            } else {
                                                this_obj[type].presentId = this_obj[type].showId = setTime[1];
                                            }
                                        }
                                    }
                                    var videoId = this_obj[type].list[this_obj[type].index + this_obj[type].back].id;
                                    if (result.playlist) {
                                        this_obj[type].playlist = result.playlist;
                                    } else {
                                        this_obj[type].playlist = null;
                                    }
                                    this_obj[type].maxId = this_obj[type].list[this_obj[type].index + this_obj[type].back].present;
                                    if (type === 'doc') {
                                        this_obj[type].iframeOffset = null;
                                        this_obj[type].src = $scope.main_url + '/' + preType + '/' + this_obj[type].list[this_obj[type].index + this_obj[type].back].id + '/doc';
                                    } else if (this_obj[type].list[this_obj[type].index + this_obj[type].back].thumb) {
                                        this_obj[type].src = this_obj[type].list[this_obj[type].index + this_obj[type].back].thumb;
                                        if (type === 'video') {
                                            video.poster = this_obj[type].src;
                                        }
                                        var is_magnet = false;
                                        if (this_obj[type].playlist) {
                                            if (this_obj[type].playlist.obj.id) {
                                                videoId = this_obj[type].playlist.obj.id;
                                            }
                                            if (this_obj[type].playlist.obj.is_magnet) {
                                                is_magnet = true;
                                                this_obj[type].itemName = ':' + this_obj[type].playlist.obj.title;
                                                if (this_obj[type].playlist.obj.id) {
                                                    this_obj[type].src = $scope.main_url + '/torrent/0/' + videoId;
                                                    isOri();
                                                } else {
                                                    if (isValidString(this_obj[type].playlist.obj.magnet, 'url')) {
                                                        var uploadurl = $scope.main_url + '/api/upload/url';
                                                        if (this_obj.adultonly) {
                                                            uploadurl = $scope.main_url + '/api/upload/url/1';
                                                        }
                                                        var upApi = $resource(uploadurl, {}, {
                                                            'uploadUrl': { method:'POST', withCredentials: true }
                                                        });
                                                        upApi.uploadUrl({url: this_obj[type].playlist.obj.magnet, hide: true}, function (result) {
                                                            if (result.loginOK) {
                                                                $window.location.href = $location.path();
                                                            } else {
                                                                videoId = this_obj[type].playlist.obj.id = result.id;
                                                                this_obj[type].src = $scope.main_url + '/torrent/0/' + videoId;
                                                                isOri();
                                                                removeCue();
                                                                this_obj[type].sub = '/subtitle/' + videoId;
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
                                                        addAlert('magnet not valid');
                                                    }
                                                }
                                            }
                                        }
                                        if (!is_magnet) {
                                            var externalApi = $resource($scope.main_url + '/api/external/getSingle/' + videoId, {}, {
                                                'getSingle': { method:'GET', withCredentials: true }
                                            });
                                            externalApi.getSingle({}, function (result) {
                                                if (result.loginOK) {
                                                    $window.location.href = $location.path();
                                                } else {
                                                    if (videoId === this_obj[type].id || (this_obj[type].playlist && videoId === this_obj[type].playlist.obj.id)) {
                                                        if (this_obj[type].playlist) {
                                                            this_obj[type].itemName = ':' + result.title;
                                                        }
                                                        if (type === 'music') {
                                                            if (result.audio) {
                                                                this_obj[type].src = result.audio;
                                                            } else {
                                                                this_obj[type].src = result.video[0];
                                                            }
                                                        } else {
                                                            this_obj[type].hd_list = result.video;
                                                            if (result.sub) {
                                                                this_obj[type].playlist.obj.sub = result.sub;
                                                            }
                                                            var hd = 0;
                                                            if (this_obj[type].hd < this_obj[type].hd_list.length) {
                                                                hd = this_obj[type].hd;
                                                            } else {
                                                                hd = this_obj[type].hd_list.length - 1;
                                                            }
                                                            this_obj[type].src = this_obj[type].hd_list[hd];
                                                        }
                                                        isOri();
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
                                    } else {
                                        this_obj[type].src = $scope.main_url + '/' + preType + '/' + this_obj[type].list[this_obj[type].index + this_obj[type].back].id;
                                        isOri();
                                    }
                                    if (type === 'video') {
                                        removeCue();
                                        this_obj[type].sub = '/subtitle/' + videoId;
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
                        if (type === 'video' || type === 'music') {
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
                this.mediaRecord(type, docRecord, ended, true, function() {
                    afterRecord();
                });
            }
            afterRecord();
            function afterRecord() {
                var append = '';
                if (this_obj[type].list[this_obj[type].index + this_obj[type].back].url) {
                    append = '/external';
                }
                var mediaApi = $resource('/api/media/setTime/' + this_obj[type].list[this_obj[type].index + this_obj[type].back].id + '/' + type + append, {}, {
                    'setTime': { method:'GET' }
                });
                mediaApi.setTime({}, function (result) {
                    if (result.loginOK) {
                        $window.location.href = $location.path();
                    } else {
                        //var videoIndex = 0;
                        if (result.time) {
                            var setTime = result.time.toString().match(/^(\d+)(&(\d+))?$/);
                            if (setTime) {
                                if (type === 'video') {
                                    videoStart = setTime[1];
                                    //if (setTime[3]) {
                                    //    videoIndex = setTime[3];
                                    //}
                                } else if (type === 'music'){
                                    musicStart = setTime[1];
                                } else {
                                    this_obj[type].presentId = this_obj[type].showId = setTime[1];
                                }
                            }
                        }
                        var videoId = this_obj[type].list[this_obj[type].index + this_obj[type].back].id;
                        if (result.playlist) {
                            this_obj[type].playlist = result.playlist;
                        } else {
                            this_obj[type].playlist = null;
                        }
                        this_obj[type].maxId = this_obj[type].list[this_obj[type].index + this_obj[type].back].present;
                        if (type === 'doc') {
                            this_obj[type].iframeOffset = null;
                            this_obj[type].src = $scope.main_url + '/' + preType + '/' + this_obj[type].list[this_obj[type].index + this_obj[type].back].id + '/doc';
                        } else if (this_obj[type].list[this_obj[type].index + this_obj[type].back].thumb) {
                            this_obj[type].src = this_obj[type].list[this_obj[type].index + this_obj[type].back].thumb;
                            if (type === 'video') {
                                video.poster = this_obj[type].src;
                            }
                            var is_magnet = false;
                            if (this_obj[type].playlist) {
                                if (this_obj[type].playlist.obj.id) {
                                    videoId = this_obj[type].playlist.obj.id;
                                }
                                if (this_obj[type].playlist.obj.is_magnet) {
                                    is_magnet = true;
                                    this_obj[type].itemName = ':' + this_obj[type].playlist.obj.title;
                                    if (this_obj[type].playlist.obj.id) {
                                        this_obj[type].src = $scope.main_url + '/torrent/0/' + videoId;
                                        isOri();
                                    } else {
                                        if (isValidString(this_obj[type].playlist.obj.magnet, 'url')) {
                                            var uploadurl = $scope.main_url + '/api/upload/url';
                                            if (this_obj.adultonly) {
                                                uploadurl = $scope.main_url + '/api/upload/url/1';
                                            }
                                            var upApi = $resource(uploadurl, {}, {
                                                'uploadUrl': { method:'POST', withCredentials: true }
                                            });
                                            upApi.uploadUrl({url: this_obj[type].playlist.obj.magnet, hide: true}, function (result) {
                                                if (result.loginOK) {
                                                    $window.location.href = $location.path();
                                                } else {
                                                    videoId = this_obj[type].playlist.obj.id = result.id;
                                                    this_obj[type].src = $scope.main_url + '/torrent/0/' + videoId;
                                                    isOri();
                                                    removeCue();
                                                    this_obj[type].sub = '/subtitle/' + videoId;
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
                                            addAlert('magnet not valid');
                                        }
                                    }
                                }
                            }
                            if (!is_magnet) {
                                var externalApi = $resource($scope.main_url + '/api/external/getSingle/' + videoId, {}, {
                                    'getSingle': { method:'GET', withCredentials: true }
                                });
                                externalApi.getSingle({}, function (result) {
                                    if (result.loginOK) {
                                        $window.location.href = $location.path();
                                    } else {
                                        if (videoId === this_obj[type].id || (this_obj[type].playlist && videoId === this_obj[type].playlist.obj.id)) {
                                            if (this_obj[type].playlist) {
                                                this_obj[type].itemName = ':' + result.title;
                                            }
                                            if (type === 'music') {
                                                if (result.audio) {
                                                    this_obj[type].src = result.audio;
                                                } else {
                                                    this_obj[type].src = result.video[0];
                                                }
                                            } else {
                                                this_obj[type].hd_list = result.video;
                                                if (result.sub) {
                                                    this_obj[type].playlist.obj.sub = result.sub;
                                                }
                                                var hd = 0;
                                                if (this_obj[type].hd < this_obj[type].hd_list.length) {
                                                    hd = this_obj[type].hd;
                                                } else {
                                                    hd = this_obj[type].hd_list.length - 1;
                                                }
                                                this_obj[type].src = this_obj[type].hd_list[hd];
                                            }
                                            isOri();
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
                        } else {
                            this_obj[type].src = $scope.main_url + '/' + preType + '/' + this_obj[type].list[this_obj[type].index + this_obj[type].back].id;
                            isOri();
                        }
                        if (type === 'video') {
                            removeCue();
                            this_obj[type].sub = '/subtitle/' + videoId;
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
    }
    $scope.musicShuffle = function() {
        var index = 0;
        switch (this.music.mode) {
            case 1:
            this.mediaMove(-1, 'music', true);
            break;
            case 2:
            this.mediaMove(0, 'music', true);
            break;
            case 3:
            if (this.music.end) {
                do {
                    index = randomFloor(-this.music.back, +this.music.front-1);
                } while(index === +this.music.index);
            } else {
                do {
                    index = randomFloor(-this.music.back - 20, +this.music.front + 19);
                } while(index === +this.music.index);
            }
            this.mediaMove(index - this.music.index, 'music', true, true);
            break;
            case 0:
            default:
            this.mediaMove(1, 'music', true);
            break;
        }
    }
    $scope.$watch("this.doc.mode", function(newVal, oldVal) {
        $scope.setDoc();
    }, true);
    $scope.$watch("this.torrent.option", function(newVal, oldVal) {
        newVal = parseInt(newVal);
        if (newVal) {
            if (newVal === 1) {
                $scope.mediaToggle('torrent');
                openModal("請在 Storage 下搜尋，並且只保留上一個版本的字幕，完成後請刷新頁面，才會更新字幕").then(function () {
                    $scope.$broadcast('subtitle', 'searchT');
                }, function () {
                });
            } else if (newVal === 2) {
                $scope.mediaToggle('torrent');
                openModal("請在 Storage 下上傳，並且只保留上一個版本的字幕，完成後請刷新頁面，才會更新字幕").then(function () {
                    $scope.$broadcast('subtitle', 'uploadT');
                }, function () {
                });
            }
            $scope.torrent.option = 0;
        }
    }, true);
    $scope.$watch("this.music.option", function(newVal, oldVal) {
        newVal = parseInt(newVal);
        if (newVal) {
            if (newVal === 1) {
                $scope.mediaToggle('music');
                openModal("確定要儲存到網站?").then(function () {
                    $scope.save2local(true, $scope.music.id);
                }, function () {
                });
            } else if (newVal === 2) {
                $scope.subscription($scope.music.list[$scope.music.index].cid, $scope.music.list[$scope.music.index].ctitle, 'music');
            }
            $scope.music.option = 0;
        }
    }, true);
    $scope.$watch("this.video.option", function(newVal, oldVal) {
        newVal = parseInt(newVal);
        if (newVal) {
            if (newVal === 1) {
                $scope.mediaToggle('video');
                openModal("請在 Storage 下搜尋，並且只保留上一個版本的字幕，完成後請刷新頁面，才會更新字幕").then(function () {
                    $scope.$broadcast('subtitle', 'searchV');
                }, function () {
                });
            } else if (newVal === 2) {
                $scope.mediaToggle('video');
                openModal("請在 Storage 下上傳，並且只保留上一個版本的字幕，完成後請刷新頁面，才會更新字幕").then(function () {
                    $scope.$broadcast('subtitle', 'uploadV');
                }, function () {
                });
            } else if (newVal === 3) {
                $scope.originSubtitle('video');
            } else if (newVal === 4) {
                $scope.mediaToggle('video');
                openModal("確定要儲存到網站?").then(function () {
                    $scope.save2local(false, $scope.video.id);
                }, function () {
                });
            } else if (newVal === 5) {
                $scope.subscription($scope.video.list[$scope.video.index].cid, $scope.video.list[$scope.video.index].ctitle, 'video');
            }
            $scope.video.option = 0;
        }
    }, true);
    $scope.$watch("this.video.hd", function(newVal, oldVal) {
        var hd = 0;
        if ($scope.video.hd < $scope.video.hd_list.length) {
            hd = $scope.video.hd;
        } else {
            hd = $scope.video.hd_list.length - 1;
        }
        if (hd >= 0) {
            videoStart = video.currentTime;
            $scope.video.src = $scope.video.hd_list[hd];
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
            case 'torrent':
                break;
            default:
                addAlert('unknown type');
                return false;
        }
        if (this.mediaShow[0] === type) {
            if (!open) {
                this.mediaShow.splice(0,1);
                if (type === 'video') {
                    video.pause();
                } else if (type === 'doc' && this.doc.iframeOffset) {
                    this.mediaRecord(type, this.doc.showId);
                } else if (type === 'torrent') {
                    torrent.pause();
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
    $scope.$parent.currentPage = 3;
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
    $scope.parsePoint = false;
    $scope.parsePointFocus = false;
    $scope.inputPoint = '';
    $scope.parsePoint2 = false;
    $scope.parsePoint2Focus = false;
    $scope.outputPoint = [];
    $scope.selectPoint = 0;
    $scope.toolList = {per: false, yield: false, pre: false, point: false, dir: false, item: null};
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
    $scope.filterStock = false;
    $scope.filterTag = '';
    $scope.filterTagFocus = false;
    $scope.filterCondition = '';
    $scope.filterConditionFocus = false;
    $scope.filterLimit = '';
    $scope.filterLimitFocus = false;
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
    $scope.parseManagementMode = [{name: 'Season', value: 1}, {name: 'Year', value: 2}, {name: 'SShare', value: 3}, {name: 'YShare', value: 4}];
    $scope.relative = {revenue: true, profit: true, cash: true, inventories: true, receivable: true, payable: true};
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
        } else {
            $scope.tagList = [];
            $scope.exceptList = [];
            $scope.relativeList = [];
            $scope.isRelative = false;
            $scope.tagNew = false;
        }
    }, true);

    getOptionTag = function() {
        var append = '';
        if ($scope.tagList.length > 0) {
            append = '/' + $scope.tagList[0];
        }
        var Info = $resource('/api/stock/getOptionTag' + append, {}, {
            'optionTag': { method:'GET' }
        });
        Info.optionTag({}, function (result) {
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

    $scope.selectItem = function($event, item) {
        if (typeof item === 'string') {
            this.$parent.toolList.dir = true;
            this.$parent.toolList.per = false;
            this.$parent.toolList.pre = false;
            this.$parent.toolList.yield = false;
            this.$parent.toolList.point = false;
            confirm_str = item;
        } else {
            this.$parent.toolList.dir = false;
            this.$parent.toolList.per = true;
            this.$parent.toolList.pre = true;
            this.$parent.toolList.yield = true;
            this.$parent.toolList.point = true;
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
            this.parsePoint = false;
            this.parsePoint2 = false;
            this.bookmarkNew = false;
            this.tagNew = true;
            this.tagNewFocus = true;
            this.isRelative = true;
            getOptionTag();
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

    $scope.submitFilter = function() {
        if (!isValidString(this.filterTag, 'name')) {
            addAlert('Filter tag is not vaild!!!');
            return false;
        }
        var condition = this.filterCondition.match(/^(per|yield)([<>]\d+)\s*((per|yield)([<>]\d+))?$/);
        if (!condition) {
            addAlert('Filter condition is not vaild!!!');
            return false;
        }
        var per = '';
        var yield = '';
        if (condition[1] === 'per') {
            per = condition[2];
        } else if (condition[1] === 'yield') {
            yield = condition[2];
        }
        if (condition[4] === 'per') {
            per = condition[5];
        } else if (condition[4] === 'yield') {
            yield = condition[5];
        }
        var filterLimit = 100;
        if (this.filterLimit && !this.filterLimit.match(/^\d+$/)) {
            addAlert('Filter limit is not vaild!!!');
            return false;
        }
        if (this.filterLimit) {
            filterLimit = Number(this.filterLimit);
        }
        this.filterStock = false;
        var stockApi = $resource('/api/stock/filter/' + this.filterTag, {}, {
            'filter': { method:'PUT' }
        });
        var filter = {limit: filterLimit};
        if (per) {
            filter['per'] = per;
        }
        if (yield) {
            filter['yield'] = yield;
        }
        stockApi.filter(filter, function (result) {
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
    $scope.drawManagement = function(mode, relative, startYear, startQuarter, endYear, endQuarter) {
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
        for (var i in relative) {
            if (relative[i]) {
                if (i !== 'revenue') {
                    this.managementSeries.push(i);
                    this.managementData.push([]);
                }
                this.managementNumberSeries.push(i);
                this.managementNumberData.push([]);
            }
        }
        var index = -1;
        var ry = 0, rs = 0;
        for(var i = managementStartDate.year; i<=managementEndDate.year; i++) {
            for (var j in this.parseResult.managementStatus[i]) {
                if (this.parseResult.managementStatus[i][j]) {
                    if ((i === managementStartDate.year && j < (managementStartDate.quarter-1)) || (i === managementEndDate.year && j > (managementEndDate.quarter-1))) {
                        continue;
                    }
                    this.managementLabels.push(i.toString() + (Number(j)+1));
                    if ((mode === 2 || mode === 4) && j === '0') {
                        this.managementNumberLabels.push(i.toString());
                    } else if (mode === 1 || mode === 3) {
                        this.managementNumberLabels.push(i.toString() + (Number(j)+1));
                    }
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
                            case 'cash':
                            index = this.managementNumberSeries.indexOf('cash');
                            if (index !== -1) {
                                if ((mode === 2 || mode === 4) && j === '0') {
                                    rs = 0;
                                    for (var l in this.parseResult.managementStatus[i]) {
                                        if (rs < l) {
                                            rs = l;
                                        }
                                    }
                                    if (mode === 2) {
                                        this.managementNumberData[index].push(Math.ceil(this.parseResult.managementStatus[i][rs][k]/1000000));
                                    } else if (mode === 4) {
                                        this.managementNumberData[index].push(Math.ceil(this.parseResult.managementStatus[i][rs][k]/this.parseResult.managementStatus[i][rs]['share']*10000)/1000);
                                    }
                                } else if (mode === 1) {
                                    this.managementNumberData[index].push(Math.ceil(this.parseResult.managementStatus[i][j][k]/1000000));
                                } else if (mode === 3) {
                                    this.managementNumberData[index].push(Math.ceil(this.parseResult.managementStatus[i][j][k]/this.parseResult.managementStatus[i][j]['share']*10000)/1000);
                                }
                            }
                            break;
                            case 'inventories':
                            index = this.managementNumberSeries.indexOf('inventories');
                            if (index !== -1) {
                                if ((mode === 2 || mode === 4) && j === '0') {
                                    rs = 0;
                                    for (var l in this.parseResult.managementStatus[i]) {
                                        if (rs < l) {
                                            rs = l;
                                        }
                                    }
                                    if (mode === 2) {
                                        this.managementNumberData[index].push(Math.ceil(this.parseResult.managementStatus[i][rs][k]/1000000));
                                    } else if (mode === 4) {
                                        this.managementNumberData[index].push(Math.ceil(this.parseResult.managementStatus[i][rs][k]/this.parseResult.managementStatus[i][rs]['share']*10000)/1000);
                                    }
                                } else if (mode === 1) {
                                    this.managementNumberData[index].push(Math.ceil(this.parseResult.managementStatus[i][j][k]/1000000));
                                } else if (mode === 3) {
                                    this.managementNumberData[index].push(Math.ceil(this.parseResult.managementStatus[i][j][k]/this.parseResult.managementStatus[i][j]['share']*10000)/1000);
                                }
                            }
                            break;
                            case 'receivable':
                            index = this.managementNumberSeries.indexOf('receivable');
                            if (index !== -1) {
                                if ((mode === 2 || mode === 4) && j === '0') {
                                    rs = 0;
                                    for (var l in this.parseResult.managementStatus[i]) {
                                        if (rs < l) {
                                            rs = l;
                                        }
                                    }
                                    if (mode === 2) {
                                        this.managementNumberData[index].push(Math.ceil(this.parseResult.managementStatus[i][rs][k]/1000000));
                                    } else if (mode === 4) {
                                        this.managementNumberData[index].push(Math.ceil(this.parseResult.managementStatus[i][rs][k]/this.parseResult.managementStatus[i][rs]['share']*10000)/1000);
                                    }
                                } else if (mode === 1) {
                                    this.managementNumberData[index].push(Math.ceil(this.parseResult.managementStatus[i][j][k]/1000000));
                                } else if (mode === 3) {
                                    this.managementNumberData[index].push(Math.ceil(this.parseResult.managementStatus[i][j][k]/this.parseResult.managementStatus[i][j]['share']*10000)/1000);
                                }
                            }
                            break;
                            case 'payable':
                            index = this.managementNumberSeries.indexOf('payable');
                            if (index !== -1) {
                                if ((mode === 2 || mode === 4) && j === '0') {
                                    rs = 0;
                                    for (var l in this.parseResult.managementStatus[i]) {
                                        if (rs < l) {
                                            rs = l;
                                        }
                                    }
                                    if (mode === 2) {
                                        this.managementNumberData[index].push(Math.ceil(this.parseResult.managementStatus[i][rs][k]/1000000));
                                    } else if (mode === 4) {
                                        this.managementNumberData[index].push(Math.ceil(this.parseResult.managementStatus[i][rs][k]/this.parseResult.managementStatus[i][rs]['share']*10000)/1000);
                                    }
                                } else if (mode === 1) {
                                    this.managementNumberData[index].push(Math.ceil(this.parseResult.managementStatus[i][j][k]/1000000));
                                } else if (mode === 3) {
                                    this.managementNumberData[index].push(Math.ceil(this.parseResult.managementStatus[i][j][k]/this.parseResult.managementStatus[i][j]['share']*10000)/1000);
                                }
                            }
                            break;
                            case 'profit':
                            index = this.managementNumberSeries.indexOf('profit');
                            if (index !== -1) {
                                if ((mode === 2 || mode === 4) && j === '0') {
                                    ry = 0;
                                    rs = 0;
                                    for (var l in this.parseResult.managementStatus[i]) {
                                        if (rs < l) {
                                            rs = l;
                                        }
                                        ry += this.parseResult.managementStatus[i][l][k];
                                    }
                                    if (mode === 2) {
                                        this.managementNumberData[index].push(Math.ceil(ry/1000000));
                                    } else if (mode === 4){
                                        this.managementNumberData[index].push(Math.ceil(ry/this.parseResult.managementStatus[i][rs]['share']*10000)/1000);
                                    }
                                } else if (mode === 1) {
                                    this.managementNumberData[index].push(Math.ceil(this.parseResult.managementStatus[i][j][k]/1000000));
                                } else if (mode === 3) {
                                    this.managementNumberData[index].push(Math.ceil(this.parseResult.managementStatus[i][j][k]/this.parseResult.managementStatus[i][j]['share']*10000)/1000);
                                }
                            }
                            break;
                            case 'revenue':
                            index = this.managementNumberSeries.indexOf('revenue');
                            if (index !== -1) {
                                if ((mode === 2 || mode === 4) && j === '0') {
                                    ry = 0;
                                    rs = 0;
                                    for (var l in this.parseResult.managementStatus[i]) {
                                        if (rs < l) {
                                            rs = l;
                                        }
                                        ry += this.parseResult.managementStatus[i][l][k];
                                    }
                                    if (mode === 2) {
                                        this.managementNumberData[index].push(Math.ceil(ry/1000000));
                                    } else if (mode === 4){
                                        this.managementNumberData[index].push(Math.ceil(ry/this.parseResult.managementStatus[i][rs]['share']*10000)/1000);
                                    }
                                } else if (mode === 1) {
                                    this.managementNumberData[index].push(Math.ceil(this.parseResult.managementStatus[i][j][k]/1000000));
                                } else if (mode === 3) {
                                    this.managementNumberData[index].push(Math.ceil(this.parseResult.managementStatus[i][j][k]/this.parseResult.managementStatus[i][j]['share']*10000)/1000);
                                }
                            }
                            break;
                        }
                    }
                }
            }
        }
        this.managementMode = mode;
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
                this_obj.relative = {revenue: true, profit: true, cash: true, inventories: true, receivable: true, payable: true};
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
                this_obj.drawManagement(2, this_obj.relative);
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
                    this_obj.parsePoint = false;
                    this_obj.parsePoint2 = false;
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
    $scope.stockPoint = function() {
        var this_obj = this;
        if (this.toolList.item) {
            var append = '';
            if (this.inputPoint) {
                append = '/' + this.inputPoint;
            }
            var stockApi = $resource('/api/stock/getPoint/' + this.toolList.item.id + append, {}, {
                'getPoint': { method:'get' }
            });
            stockApi.getPoint({}, function (result) {
                if (result.loginOK) {
                    $window.location.href = $location.path();
                } else {
                    this_obj.outputPoint = result.point;
                    this_obj.selectPoint = 0;
                    this_obj.parsePoint = false;
                    this_obj.parsePoint2 = true;
                    this_obj.parsePoint2Focus = true;
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
    $scope.toggleStockPoint = function() {
        if (this.selectPoint < 1) {
            this.selectPoint++;
        } else {
            this.selectPoint = 0;
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
                    this_obj.parsePoint = false;
                    this_obj.parsePoint2 = false;
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
                    this_obj.parsePoint = false;
                    this_obj.parsePoint2 = false;
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
    $scope.$parent.currentPage = 2;
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
        } else {
            $scope.tagList = [];
            $scope.exceptList = [];
            $scope.relativeList = [];
            $scope.isRelative = false;
            $scope.tagNew = false;
        }
    }, true);

    getOptionTag = function() {
        var append = '';
        if ($scope.tagList.length > 0) {
            append = '/' + $scope.tagList[0];
        }
        var Info = $resource('/api/password/getOptionTag' + append, {}, {
            'optionTag': { method:'GET' }
        });
        Info.optionTag({}, function (result) {
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
            this.isRelative = true;
            getOptionTag();
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
            $scope.$apply(function() {
               $scope.showPassword = false;
            });
            e.clipboardData.setData('text/plain', $scope.upPassword);
            e.preventDefault(); // We want our data, not data from any selection, to be written to the clipboard
        });
    }

    if (document.getElementById('user-password')) {
        document.getElementById('user-password').addEventListener('copy', function(e){
            $scope.$apply(function() {
               $scope.openPassword = false;
            });
            e.clipboardData.setData('text/plain', $scope.userPassword);
            e.preventDefault(); // We want our data, not data from any selection, to be written to the clipboard
        });
    }

    if (document.getElementById('user-pre-password')) {
        document.getElementById('user-pre-password').addEventListener('copy', function(e){
            $scope.$apply(function() {
               $scope.openPrePassword = false;
            });
            e.clipboardData.setData('text/plain', $scope.userPrePassword);
            e.preventDefault(); // We want our data, not data from any selection, to be written to the clipboard
        });
    }

    if (document.getElementById('s-user-password')) {
        document.getElementById('s-user-password').addEventListener('copy', function(e){
            $scope.$apply(function() {
               $scope.openPassword = false;
            });
            e.clipboardData.setData('text/plain', $scope.userPassword);
            e.preventDefault(); // We want our data, not data from any selection, to be written to the clipboard
        });
    }

    if (document.getElementById('s-user-pre-password')) {
        document.getElementById('s-user-pre-password').addEventListener('copy', function(e){
            $scope.$apply(function() {
               $scope.openPrePassword = false;
            });
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
        if (str.search(re_weburl) != -1 || str.search(/^magnet:(\?xt=urn:btih:[a-z0-9]{20,50}|stop)/i) != -1)
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
