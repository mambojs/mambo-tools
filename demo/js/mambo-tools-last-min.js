 (() => new EventSource("http://localhost:8008").onmessage = () => location.reload())();
(()=>{var P=(N,e)=>()=>(N&&(e=N(N=0)),e);var yt={};var _=P(()=>{window.dom=new function(){"use strict";let e=this;this.append=s,this.appendSelfToParentTag=u,this.appendSVG=g,this.addClass=d,this.computeTagHeight=gt,this.computeTagWidth=dt,this.createTag=a,this.createSVGTag=h,this.empty=p,this.getTag=S,this.getTags=D,this.hasClass=J,this.parse=W,this.prepend=o,this.remove=E,this.removeAll=k,this.removeAttrs=$,this.removeAttrsAll=F,this.removeClass=i,this.removeClassAll=A,this.setAttr=Y,this.setAttrAll=H,this.setProps=v,this.setPropsAll=y,this.supplantHTML=ft,this.toggleClass=l;function a(t,n){let r=w(t);if(!n||!O(n))return r;switch(t){case"input":case"textarea":case"select":case"option":case"output":r.value=n.text?n.text:"";break;default:r.innerText=n.text?n.text:"";break}return v(r,n.prop),Y(r,n.attr),c(r,n.event),n.class&&n.class!==""&&(r.className=n.class),r}function c(t,n){let r=S(t);if(r&&!T(r)&&n&&O(n))for(let f in n)r.addEventListener(f,n[f]);return e}function h(t,n){let r=w(t,"SVG");if(!(!n||!O(n)))return v(r,n.prop),Y(r,n.attr),c(r,n.event),n.children&&Array.isArray(n.children)&&n.children.forEach(f=>{let M=h(f.name,f.props,f.attrs,f.children);b(r,M)}),r}function w(t,n){switch(n){case"SVG":return document.createElementNS("http://www.w3.org/2000/svg",t);case"MathML":return document.createElementNS("http://www.w3.org/1998/Math/MathML",t);default:return document.createElementNS("http://www.w3.org/1999/xhtml",t)}}function s(t,n,r){if(!n||!t){console.error("DOM.addChild(): missing parameter 'selector', 'content' or both.");return}if(typeof n=="string"&&(n=W(n)),I(t))return t=t.replace("#",""),b(document.getElementById(t),n,r),e;if(R(t)){let f=document.getElementsByClassName(t);return f&&f.length>0&&m(f,n,r),e}if(T(t)){let f=document.querySelectorAll(t);return f&&f.length>0&&m(f,n,r),e}if(ot(t)||ut(t))return b(t,n,r),e;if(lt(t)||ct(t)||U(t))return m(t,n,r),e}function u(t,n,r){let f=S(t);return f?(s(f,n,r),f):`${n.localName}: parentTag element not found. DOM install failed.`}function g(t,n,r){if(!n||!t){console.error("DOM.addSVGChild(): missing parameter 'selector', 'content' or both.");return}if(typeof n=="string"){let f=document.createElement("div"),M="<svg>"+n+"</svg>";f.innerHTML=""+M,Array.prototype.slice.call(f.childNodes[0].childNodes).forEach(function(L){s(t,L,r)})}else s(t,el,r)}function o(t,n){s(t,n,!0)}function m(t,n,r){for(let f=0;f<t.length;f++)b(t[f],n,r)}function b(t,n,r){n&&t&&(r&&t.firstChild?t.insertBefore(n,t.firstChild):t.appendChild(n))}function S(t,n){if(typeof t!="string")return t;let r=n||document;return typeof r=="string"&&(r=st(r)),I(t)?r.getElementById(t.replace("#","")):R(t)?r.getElementsByClassName(t.replace(".",""))[0]:V(t)?r.getElementsByTagName(t)[0]:r.querySelector(t)}function D(t,n){if(typeof t!="string")return t;if(I(t))return"For a single #id selector use getTag() method instead (expects a single tag return, not a list).";let r=n||document;return R(t)?r.getElementsByClassName(t.replace(".","")):V(t)?r.getElementsByTagName(t):(console.log("DOM.getTags(): you have used document.querySelectorAll('') that returns DOM tags that are not 'LIVE' therefore won't automatically stay in sync with the browser therefore, it's not recommended. Try a direct String selector."),r.querySelectorAll(t))}function E(t){return typeof t=="string"?I(t)?n(S(t)):k(D(t)):n(t),e;function n(r){r.parentNode.removeChild&&r.parentNode.removeChild(r)}}function k(t){for(let n=0;n<t.length;n++)E(t[n])}function d(t,n){let r=S(t);return J(r,n)||r.classList.add(n),e}function i(t,n){return S(t).classList.remove(n),e}function A(t,n){if(U(t))for(let r=0;r<t.length;r++)i(t[r],n);else if(O(t))for(let r in t)i(t[r],n)}function l(t,n){return S(t).classList.toggle(n),e}function p(t){let n=S(t);return n.innerHTML="",e}function v(t,n){let r=S(t);if(r&&!T(r)&&n&&O(n))for(let f in n)r[f]=n[f];return e}function y(t,n){let r=D(t);if(r&&!T(r)&&n&&O(n))for(let f=0;f<r.length;f++)for(let M in n)r[f][M]=n[M];return e}function Y(t,n){let r=S(t);if(r&&!T(r)&&n&&O(n))for(let f in n)r.setAttribute(f,n[f]);return e}function H(t,n){let r=D(t);if(r&&!T(r)&&n&&O(n))for(let f=0;f<r.length;f++)for(let M in n)r[f].setAttribute(M,n[M]);return e}function $(t,n){let r=S(t);return r&&!T(r)&&n&&Array.isArray(n)&&n.forEach(f=>{r.removeAttribute(f)}),e}function F(t,n){let r=D(t);if(r&&!T(r)&&n&&Array.isArray(n))for(let f=0;f<r.length;f++)n.forEach(M=>{r[f].removeAttribute(M)});return e}function st(t){return typeof t!="string"?t:I(t)?document.getElementById(t.replace("#","")):R(t)?document.getElementsByClassName(t.replace(".",""))[0]:V(t)?document.getElementsByTagName(t)[0]:document.querySelector(t)}function I(t){if(T(t))return t.startsWith("#")&&at(t)&&!x(t)&&!t.includes(".")&&!t.includes(" ")}function R(t){if(T(t))return t.startsWith(".")&&it(t)&&!x(t)&&!t.includes("#")&&!t.includes(" ")}function V(t){if(T(t))return!t.includes("#")&&!t.includes(".")&&!t.includes(" ")&&!x(t)}function x(t){if(T(t))return t.includes(":")}function it(t){if(T(t))return(t.match(RegExp("\\.","g"))||[]).length===1}function at(t){if(T(t))return(t.match(RegExp("#","g"))||[]).length===1}function ot(t){return t instanceof Element}function ut(t){return t instanceof Node}function lt(t){return NodeList.prototype.isPrototypeOf(t)}function ct(t){return HTMLCollection.prototype.isPrototypeOf(t)}function U(t){return Array.isArray(t)}function T(t){return typeof t=="string"}function O(t){return typeof t=="object"}function J(t,n){return t.className.indexOf(n)!==-1}function W(t){var n=document.createElement("template");return t=t.trim(),n.innerHTML=t,n.content}function ft(t,n){return t.replace(/{([^{}]*)}/g,function(r,f){let M=ht(f,n);return typeof M=="string"||typeof M=="number"?M:r})}function ht(t,n){let r=t.split("."),f=n;for(let M=0,L=r.length;M<L;M++){if(!(r[M]in f))return"";f=f[r[M]]}return f}function Dt(t,n){}function dt(t,n){let r=window.getComputedStyle(t,null);if(!r)return;let f=r.getPropertyValue("padding-left"),M=r.getPropertyValue("padding-right"),L=r.getPropertyValue("margin-left"),q=r.getPropertyValue("margin-right"),B=C(f)+C(M),Z=C(L)+C(q),j=0;if(n){let G=window.getComputedStyle(n,null);if(G){let mt=G.getPropertyValue("padding-left"),pt=G.getPropertyValue("padding-right");j+=C(mt)+C(pt)+Z}}return j+=B+Z+t.clientWidth,j}function gt(t){let n=window.getComputedStyle(t,null);if(!n)return;let r=n.getPropertyValue("padding-top"),f=n.getPropertyValue("padding-bottom"),M=n.getPropertyValue("margin-top"),L=n.getPropertyValue("margin-bottom"),q=C(r)+C(f),B=C(M)+C(L);return q+B+t.clientHeight}function C(t){return parseInt(t.replace("px",""))}}});var bt={};var K=P(()=>{window.tools.api=new function(e){"use strict";let a;this.get=u,this.post=g,this.getFile=c,this.getJSON=s,this.getText=w,k();async function c(d){return await fetch(`http://localhost:8000/getFile?path=${d}`).then(i=>i.text())}function h(d){return o("GET","http://localhost:8000/getFile?",{data:{path:d}})}function w(d){return o("GET",d)}function s(d){return o("GET",d,{responseType:"json"})}function u(d,i){return o("GET",d,i)}function g(d,i){return o("POST",d,i)}function o(d,i,A){let l=mambo.utils.extend(!0,a,A);return new Promise((p,v)=>{let y=new XMLHttpRequest;D(y),y.onreadystatechange=function(Y){y.readyState===4&&(y.status===200?p(y.response):v(y))},y.open(d,i),m(y,l),y.send(b(l.data))})}function m(d,i){i.contentType&&d.setRequestHeader("Content-type",i.contentType),i.crossOrigin&&(d.withCredentials=!0),d.responseType=i.responseType}function b(d){return d===null?null:mambo.utils.isObject(d)?E(d):d}function S(d,i){let A=d.split("?"),l=A[0],p=A.length>1?"?"+A[1]:"",v=A.length>1?"&":"?",y=b(i);return y!==null&&(p+=v+y),l+p}function D(d){if(!e||!e.events)return;let i=e.events.loadstart;i&&typeof i=="function"&&d.addEventListener("loadstart",i),i=e.events.load,i&&typeof i=="function"&&d.addEventListener("load",i),i=e.events.loadend,i&&typeof i=="function"&&d.addEventListener("loadend",i),i=e.events.progress,i&&typeof i=="function"&&d.addEventListener("progress",i),i=e.events.error,i&&typeof i=="function"&&d.addEventListener("error",i),i=e.events.abort,i&&typeof i=="function"&&d.addEventListener("abort",i)}function E(d){let i="",A=Object.keys(d);for(let l of A){let p=encodeURIComponent(l)+"="+encodeURIComponent(d[l]);i===""?i+=p:i+="&"+p}return i===""?null:i}function k(){a={responseType:"",contentType:"application/x-www-form-urlencoded; charset=UTF-8",crossOrigin:!1,data:null},e&&(a=mambo.utils.extend(!0,a,e))}}});var wt={};var z=P(()=>{window.tools.date=new class{constructor(){this.m_formatTokens=/(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g,this.weekdays=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],this.monthNames=["January","February","March","April","May","June","July","August","September","October","November","December"]}getToday(){let e=new Date;return e.setHours(0,0,0,0),e}format(e,a){if(!this.isDate(e)||!this.isString(a))return"";let c=a.match(this.m_formatTokens),h="";return c.forEach(w=>{let s="";switch(w){case"H":s=this.getHours(e,!1);break;case"HH":s=this.addZero(this.getHours(e,!1),2);break;case"h":s=this.getHours(e,!0);break;case"hh":s=this.addZero(this.getHours(e,!0),2);break;case"m":s=e.getMinutes();break;case"mm":s=this.addZero(e.getMinutes(),2);break;case"a":s=this.getAMPM(e);break;case"A":s=this.getAMPM(e).toUpperCase();break;case"D":s=e.getDate();break;case"DD":s=this.addZero(e.getDate(),2);break;case"ddd":s=this.getDayName(e.getDay()).substring(0,3);break;case"dddd":s=this.getDayName(e.getDay());break;case"M":s=e.getMonth()+1;break;case"MM":s=this.addZero(e.getMonth()+1,2);break;case"MMM":s=this.getMonthName(e.getMonth()).substring(0,3);break;case"MMMM":s=this.getMonthName(e.getMonth());break;case"YY":s=e.getFullYear().toString().slice(-2);break;case"YYYY":s=e.getFullYear();break;default:s=w}h+=s}),h}createDate(e,a){if(!this.isString(e)||!this.isString(a))return null;let c=0,h={y:0,M:0,d:1,h:0,m:0,s:0,ms:0},w=a.match(this.m_formatTokens),s=0,u=e;for(let g=0,o=w.length;g<o;g++){let m=w[g];switch(m){case"H":if(/^(1\d|2[0-3])$/g.test(u.substring(0,2)))s=2;else if(/^(\d)$/g.test(u.substring(0,1)))s=1;else return null;h.h=parseInt(u.substring(0,s));break;case"HH":if(/^([0-1]\d|2[0-3])$/g.test(u.substring(0,2)))s=2;else return null;h.h=parseInt(u.substring(0,s));break;case"h":if(/^(1[0-2])$/g.test(u.substring(0,2)))s=2;else if(/^(\d)$/g.test(u.substring(0,1)))s=1;else return null;h.h=parseInt(u.substring(0,s));break;case"hh":if(/^([0]\d|1[0-2])$/g.test(u.substring(0,2)))s=2;else return null;h.h=parseInt(u.substring(0,s));break;case"m":if(/^([1-5]\d)$/g.test(u.substring(0,2)))s=2;else if(/^(\d)$/g.test(u.substring(0,1)))s=1;else return null;h.m=parseInt(u.substring(0,s));break;case"mm":if(/^([0-5]\d)$/g.test(u.substring(0,2)))s=2;else return null;h.m=parseInt(u.substring(0,s));break;case"a":case"A":/^(am)$/ig.test(u.substring(0,2))?(s=2,h.h=h.h===12?0:h.h):/^(pm)$/ig.test(u.substring(0,2))?(s=2,h.h=h.h<12?h.h+12:h.h):s=0;break;case"D":if(/^([1-2]\d|3[0-1])$/g.test(u.substring(0,2)))s=2;else if(/^([1-9])$/g.test(u.substring(0,1)))s=1;else return null;h.d=parseInt(u.substring(0,s));break;case"DD":if(/^(0[1-9]|[1-2]\d|3[0-1])$/g.test(u.substring(0,2)))s=2;else return null;h.d=parseInt(u.substring(0,s));break;case"M":if(/^(1[0-2])$/g.test(u.substring(0,2)))s=2;else if(/^([1-9])$/g.test(u.substring(0,1)))s=1;else return null;h.M=parseInt(u.substring(0,s))-1;break;case"MM":if(/^(0[1-9]|1[0-2])$/g.test(u.substring(0,2)))s=2;else return null;h.M=parseInt(u.substring(0,s))-1;break;case"MMM":if(c=this.monthNames.findIndex(b=>b.toUpperCase()===u.substring(0,3).toUpperCase()),c<0)return null;s=3,h.M=c;break;case"MMMM":if(c=this.monthNames.findIndex(b=>b.toUpperCase()===u.substring(0,b.length).toUpperCase()),c<0)return null;s=this.monthNames[c].length,h.M=c;break;case"YY":if(/^(\d{2})$/g.test(u.substring(0,2)))s=2;else return null;h.y=parseInt(u.substring(0,s));break;case"YYYY":if(/^(\d{4})$/g.test(u.substring(0,4)))s=4;else return null;h.y=parseInt(u.substring(0,s));break;default:s=m.length;break}u=u.slice(s)}return new Date(h.y,h.M,h.d,h.h,h.m,h.s,h.ms)}getHours(e,a){let c=e.getHours();return a&&(c=c%12,c=c||12),c}getAMPM(e){return e.getHours()>=12?"pm":"am"}getDayName(e){return this.weekdays[e]}getMonthName(e){return this.monthNames[e]}add(e,a,c){if(!this.isDate(e)||!this.isNumber(a)||!this.isString(c))return e;switch(c){case"minutes":case"m":e.setMinutes(e.getMinutes()+a);break;case"hours":case"h":e.setHours(e.getHours()+a);break;case"days":case"d":e.setDate(e.getDate()+a);break;case"months":case"M":e.setMonth(e.getMonth()+a);break;case"years":case"Y":e.setFullYear(e.getFullYear()+a);break}return this}createInterval(e,a,c,h,w){if(!this.isNumber(e)||!this.isString(a)||!this.isDate(c)||!this.isDate(h))return[];let s=w?o=>this.format(o,w):o=>o,u=[],g=c;for(;this.isBefore(g,h);)u.push(s(g)),this.add(g,e,a);return u}getDate(e,a){let c=this.isDate(e)?this.format(e,a):e;return this.createDate(c,a)}isBefore(e,a){return e<a}isSameOrBefore(e,a){return e<=a}isAfter(e,a){return e>a}isSameOrAfter(e,a){return e>=a}isSame(e,a){return e.getTime()===a.getTime()}startOf(e,a){if(!this.isDate(e)||!this.isString(a))return e;switch(a){case"week":case"w":this.add(e,-e.getDay(),"d");break;case"month":case"M":this.add(e,-e.getDate()+1,"d");break;case"year":case"Y":this.startOf(e,"M").add(e,-e.getMonth(),"M");break;case"decade":this.startOf(e,"Y").add(e,-(e.getFullYear()%10),"Y");break;case"century":this.startOf(e,"decade").add(e,-(e.getFullYear()%100),"Y");break}return this}endOf(e,a){if(!this.isDate(e)||!this.isString(a))return e;switch(a){case"month":case"M":this.startOf(e,"M").add(e,1,"M").add(e,-1,"d");break;case"year":case"Y":this.startOf(e,"Y").add(e,1,"Y").add(e,-1,"d");break;case"decade":this.startOf(e,"decade").add(e,10,"Y").add(e,-1,"d");break;case"century":this.startOf(e,"century").add(e,100,"Y").add(e,-1,"d");break}return this}cloneDate(e){return this.isDate(e)?new Date(e.getTime()):null}addZero(e,a){return("0"+e).slice(-a)}isDate(e){return e instanceof Date||Object.prototype.toString.call(e)==="[object Date]"}isString(e){return typeof e=="string"||e instanceof String||Object.prototype.toString.call(e)==="[object String]"}isNumber(e){return typeof e=="number"||Object.prototype.toString.call(e)==="[object Number]"}}});var St={};function Mt(){this.events={testEvent:"testEvent"}}var Q=P(()=>{window.tools.event=new function(){let a=new Mt().events,c={};this.addEventListener=h,this.fireEvent=w,this.removeEventListener=s,u();function h(g,o,m){o in c?typeof m=="function"?c[o][g]?alert(`ScEvents: event listener "${g}" already exists. Please provide a listener with a unique name.`):c[o][g]=m:alert(`ScEvents: event listener "${g}" didn't provide a valid function type as a call back.`):alert(`ScEvents: event "${o}" does not exist. Please check available events in component ScEventsLibrary.`)}function w(g,o){if(g&&o){let m=c[g];if(m)for(let b in m)b in m&&m[b](o)}}function s(g,o){g&&o&&delete c[o][g]}function u(){for(let g in a)g in a&&(c[g]={})}}});var vt={};var X=P(()=>{window.tools.history=function(e){"use strict";this.clearState=s,this.pushState=w,this.replaceState=u,this.go=g,this.back=o,this.forward=m;let a=new Event("popstate"),c=new Event("locationchange"),h=this;S(),D();function w(E,k,d){b(k),history.pushState(E,k,d),window.dispatchEvent(a)}function s(E,k){b(k),history.replaceState({path:"/"},k,"/"),window.dispatchEvent(a)}function u(E,k,d){b(k),history.replaceState(E,k,d),window.dispatchEvent(a)}function g(E){history.go(E)}function o(){history.back()}function m(){history.forward()}function b(E){let k=dom.getTag("title","head");E&&k&&(k.innerText=E)}function S(){window.addEventListener("popstate",E=>{window.dispatchEvent(c)})}function D(){history.state===null?u(e,"",e):window.dispatchEvent(c)}}});var kt={};var tt=P(()=>{window.tools.object=new function(){"use strict";let e={};this.get=c=>e[c],this.save=a,this.remove=c=>delete e[c],this.getLibrary=()=>e,this.clearLibrary=()=>e={};function a(c,h){let w=h||c.constructor.name;e[w]=c}}});var Et={};var et=P(()=>{window.tools.router=new class{constructor(){let e=this;window.addEventListener("locationchange",l=>{d()});let a,c=[],h={name:"",path:"",from:{name:"",path:""},to:{name:"",path:""},params:{},query:""};this.current=h,this.hash="",this.push=o,this.replace=m,this.go=b,this.back=S,this.next=D,this.routes=w;function w(l){if(!l)return c;if(Array.isArray(l)&&l.length){if(!s(l)||!u(l))return;c=l,g();return}mambo.develop&&alert("MamboRouter: .routes() expected an Array object")}function s(l){return l.every(v=>v.constructor.name==="Object"&&"path"in v&&typeof v.path=="string"&&v.path.trim()!=="")?!0:(mambo.develop&&alert("MamboRouter: .routes() expected an object with valid path"),!1)}function u(l){let p=[...new Map(l.map(y=>[y.name,y])).values()],v=[...new Map(l.map(y=>[y.path,y])).values()];return p.length<l.length||v.length<l.length?(mambo.develop&&alert("MamboRouter: .routes() no duplicate name or path parameter in route object"),!1):!0}function g(){let{matched:l,path:p}=k({path:location.pathname});l&&(a=new tools.history(p))}function o(l){if(E(l,"push")){let{matched:p,path:v}=k(l);p&&(i(l,!0),a.pushState(v,"",v))}}function m(l){a.replaceState(l,"",l.path)}function b(l){if(!Number.isInteger(l)){mambo.develop&&alert("MamboRouter: .go() expected a integer number");return}a.go(l)}function S(){a.back()}function D(){a.forward()}function E(l,p){if(!c.length)return mambo.develop&&alert("MamboRouter: .routes() is empty. Please, set a route"),!1;if(l&&l.constructor.name==="Object"){let v=[{name:"path",type:"String"},{name:"name",type:"String"},{name:"params",type:"Object"},{name:"query",type:"String"},{name:"hash",type:"String"}],y=[];return Object.entries(l).every(H=>{let $=v.filter(F=>F.name===H[0]&&F.type===H[1].constructor.name);return $.length||y.push(H),$.length>0})?!0:(mambo.develop&&alert(`MamboRouter: ${y} is not valid in ${p}(${JSON.stringify(l)})`),!1)}return mambo.develop&&alert(`MamboRouter: .${p}() expected a valid Object `),!1}function k(l){let p=c.find(y=>y.path===l.path||y.path===l.path+"/"||y.name===l.name);if(p)return{matched:!0,path:p.path};if(l.path){let y=c.find(Y=>Y.alias===l.path||Y.alias===l.path+"/");if(y)return{matched:!0,path:y.alias}}let v=c.find(y=>y.notfound);return v?{matched:!0,path:v.path}:(mambo.develop&&alert(`MamboRouter: ${JSON.stringify(l)} route do not exist`),{matched:!1})}function d(){let l=c.find(p=>p.path===history.state||p.alias===history.state);i(l),A()}function i(l,p){p&&(e.current=h),e.current=tools.utils.extend(!0,e.current,l)}function A(){e.current.hasOwnProperty("action")&&(e.current.action.constructor.name==="Function"?e.current.action():mambo.develop&&alert("MamboRouter: action should be a function "))}}}});var At={};var nt=P(()=>{window.tools.string=new function(){"use strict";let e=this;this.filterArray=a,this.findInArray=c,this.getSearchFunction=h;function a(u,g,o,m){let b=h(m);return u.filter(S=>b(o(S),g))}function c(u,g,o,m){let b=h(m);return u.find(S=>b(o(S),g))}function h(u){switch(u){case"contains":return w;case"equals":return s;default:return()=>!0}}function w(u,g){return u.toLowerCase().includes(g.toLowerCase())}function s(u,g){return u.toLowerCase()===g.toLowerCase()}}});var Tt={};var rt=P(()=>{window.tools.utils=new function(){"use strict";this.clone=c,this.extend=e,this.formatPercentage=g,this.getUniqueId=a,this.isArray=w,this.isNumber=u,this.isObject=h,this.isString=s;function e(){let o={},m=!1,b=0,S=arguments.length;Object.prototype.toString.call(arguments[0])==="[object Boolean]"&&(m=arguments[0],b++);function D(d){for(var i in d)Object.prototype.hasOwnProperty.call(d,i)&&(m&&h(d[i])?o[i]=e(!0,o[i],d[i]):m&&w(d[i])?E(d[i],o,i):o[i]=d[i])}function E(d,i,A){i[A]=[],d.forEach((l,p)=>{m&&h(l)?i[A][p]=e(!0,i[A][p],l):m&&w(l)?E(l,i[A],p):i[A][p]=l})}for(;b<S;b++){var k=arguments[b];D(k)}return o}function a(o){return o=o&&!isNaN(o)?o:1e5,Math.floor(Math.random()*o)}function c(o){return e(!0,{},o)}function h(o){return Object.prototype.toString.call(o)==="[object Object]"}function w(o){return Object.prototype.toString.call(o)==="[object Array]"}function s(o){return typeof o=="string"||o instanceof String||Object.prototype.toString.call(o)==="[object String]"}function u(o){return typeof o=="number"&&o===o&&o!==1/0&&o!==-1/0}function g(o,m=0){return u(o)?(o*100).toFixed(m)+"%":""}}});window.dom||Promise.resolve().then(()=>(_(),yt));window.mambo||(window.mambo={develop:!1});window.tools||(window.tools={},Promise.resolve().then(()=>K()),Promise.resolve().then(()=>z()),Promise.resolve().then(()=>Q()),Promise.resolve().then(()=>X()),Promise.resolve().then(()=>tt()),Promise.resolve().then(()=>et()),Promise.resolve().then(()=>nt()),Promise.resolve().then(()=>(rt(),Tt)));})();
//# sourceMappingURL=mambo-tools-last-min.js.map
