function w(){}const Y=t=>t;function At(t,e){for(const n in e)t[n]=e[n];return t}function at(t){return t()}function st(){return Object.create(null)}function S(t){t.forEach(at)}function z(t){return typeof t=="function"}function Zt(t,e){return t!=t?e==e:t!==e||t&&typeof t=="object"||typeof t=="function"}let L;function te(t,e){return L||(L=document.createElement("a")),L.href=e,t===L.href}function Ct(t){return Object.keys(t).length===0}function St(t,...e){if(t==null)return w;const n=t.subscribe(...e);return n.unsubscribe?()=>n.unsubscribe():n}function ee(t,e,n){t.$$.on_destroy.push(St(e,n))}function ne(t,e,n,i){if(t){const s=ut(t,e,n,i);return t[0](s)}}function ut(t,e,n,i){return t[1]&&i?At(n.ctx.slice(),t[1](i(e))):n.ctx}function ie(t,e,n,i){if(t[2]&&i){const s=t[2](i(n));if(e.dirty===void 0)return s;if(typeof s=="object"){const o=[],r=Math.max(e.dirty.length,s.length);for(let l=0;l<r;l+=1)o[l]=e.dirty[l]|s[l];return o}return e.dirty|s}return e.dirty}function se(t,e,n,i,s,o){if(s){const r=ut(e,n,i,o);t.p(r,s)}}function re(t){if(t.ctx.length>32){const e=[],n=t.ctx.length/32;for(let i=0;i<n;i++)e[i]=-1;return e}return-1}function oe(t){const e={};for(const n in t)n[0]!=="$"&&(e[n]=t[n]);return e}function ce(t,e){const n={};e=new Set(e);for(const i in t)!e.has(i)&&i[0]!=="$"&&(n[i]=t[i]);return n}function le(t){const e={};for(const n in t)e[n]=!0;return e}function ae(t){return t??""}function ue(t,e,n){return t.set(n),e}function fe(t){return t&&z(t.destroy)?t.destroy:w}const ft=typeof window<"u";let Z=ft?()=>window.performance.now():()=>Date.now(),tt=ft?t=>requestAnimationFrame(t):w;const A=new Set;function _t(t){A.forEach(e=>{e.c(t)||(A.delete(e),e.f())}),A.size!==0&&tt(_t)}function et(t){let e;return A.size===0&&tt(_t),{promise:new Promise(n=>{A.add(e={c:t,f:n})}),abort(){A.delete(e)}}}let J=!1;function Tt(){J=!0}function Mt(){J=!1}function jt(t,e,n,i){for(;t<e;){const s=t+(e-t>>1);n(s)<=i?t=s+1:e=s}return t}function Dt(t){if(t.hydrate_init)return;t.hydrate_init=!0;let e=t.childNodes;if(t.nodeName==="HEAD"){const c=[];for(let a=0;a<e.length;a++){const f=e[a];f.claim_order!==void 0&&c.push(f)}e=c}const n=new Int32Array(e.length+1),i=new Int32Array(e.length);n[0]=-1;let s=0;for(let c=0;c<e.length;c++){const a=e[c].claim_order,f=(s>0&&e[n[s]].claim_order<=a?s+1:jt(1,s,_=>e[n[_]].claim_order,a))-1;i[c]=n[f]+1;const u=f+1;n[u]=c,s=Math.max(u,s)}const o=[],r=[];let l=e.length-1;for(let c=n[s]+1;c!=0;c=i[c-1]){for(o.push(e[c-1]);l>=c;l--)r.push(e[l]);l--}for(;l>=0;l--)r.push(e[l]);o.reverse(),r.sort((c,a)=>c.claim_order-a.claim_order);for(let c=0,a=0;c<r.length;c++){for(;a<o.length&&r[c].claim_order>=o[a].claim_order;)a++;const f=a<o.length?o[a]:null;t.insertBefore(r[c],f)}}function dt(t,e){t.appendChild(e)}function ht(t){if(!t)return document;const e=t.getRootNode?t.getRootNode():t.ownerDocument;return e&&e.host?e:t.ownerDocument}function Ht(t){const e=K("style");return Rt(ht(t),e),e.sheet}function Rt(t,e){return dt(t.head||t,e),e.sheet}function zt(t,e){if(J){for(Dt(t),(t.actual_end_child===void 0||t.actual_end_child!==null&&t.actual_end_child.parentNode!==t)&&(t.actual_end_child=t.firstChild);t.actual_end_child!==null&&t.actual_end_child.claim_order===void 0;)t.actual_end_child=t.actual_end_child.nextSibling;e!==t.actual_end_child?(e.claim_order!==void 0||e.parentNode!==t)&&t.insertBefore(e,t.actual_end_child):t.actual_end_child=e.nextSibling}else(e.parentNode!==t||e.nextSibling!==null)&&t.appendChild(e)}function Bt(t,e,n){t.insertBefore(e,n||null)}function Lt(t,e,n){J&&!n?zt(t,e):(e.parentNode!==t||e.nextSibling!=n)&&t.insertBefore(e,n||null)}function C(t){t.parentNode&&t.parentNode.removeChild(t)}function _e(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function K(t){return document.createElement(t)}function mt(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}function nt(t){return document.createTextNode(t)}function de(){return nt(" ")}function he(){return nt("")}function rt(t,e,n,i){return t.addEventListener(e,n,i),()=>t.removeEventListener(e,n,i)}function me(t){return function(e){return e.preventDefault(),t.call(this,e)}}function pt(t,e,n){n==null?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function pe(t,e){const n=Object.getOwnPropertyDescriptors(t.__proto__);for(const i in e)e[i]==null?t.removeAttribute(i):i==="style"?t.style.cssText=e[i]:i==="__value"?t.value=t[i]=e[i]:n[i]&&n[i].set?t[i]=e[i]:pt(t,i,e[i])}function ye(t,e){for(const n in e)pt(t,n,e[n])}function ge(t){return t===""?null:+t}function Ot(t){return Array.from(t.childNodes)}function yt(t){t.claim_info===void 0&&(t.claim_info={last_index:0,total_claimed:0})}function gt(t,e,n,i,s=!1){yt(t);const o=(()=>{for(let r=t.claim_info.last_index;r<t.length;r++){const l=t[r];if(e(l)){const c=n(l);return c===void 0?t.splice(r,1):t[r]=c,s||(t.claim_info.last_index=r),l}}for(let r=t.claim_info.last_index-1;r>=0;r--){const l=t[r];if(e(l)){const c=n(l);return c===void 0?t.splice(r,1):t[r]=c,s?c===void 0&&t.claim_info.last_index--:t.claim_info.last_index=r,l}}return i()})();return o.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1,o}function wt(t,e,n,i){return gt(t,s=>s.nodeName===e,s=>{const o=[];for(let r=0;r<s.attributes.length;r++){const l=s.attributes[r];n[l.name]||o.push(l.name)}o.forEach(r=>s.removeAttribute(r))},()=>i(e))}function we(t,e,n){return wt(t,e,n,K)}function $e(t,e,n){return wt(t,e,n,mt)}function Pt(t,e){return gt(t,n=>n.nodeType===3,n=>{const i=""+e;if(n.data.startsWith(i)){if(n.data.length!==i.length)return n.splitText(i.length)}else n.data=i},()=>nt(e),!0)}function xe(t){return Pt(t," ")}function ot(t,e,n){for(let i=n;i<t.length;i+=1){const s=t[i];if(s.nodeType===8&&s.textContent.trim()===e)return i}return t.length}function be(t,e){const n=ot(t,"HTML_TAG_START",0),i=ot(t,"HTML_TAG_END",n);if(n===i)return new ct(void 0,e);yt(t);const s=t.splice(n,i-n+1);C(s[0]),C(s[s.length-1]);const o=s.slice(1,s.length-1);for(const r of o)r.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1;return new ct(o,e)}function ve(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}function ke(t,e){t.value=e??""}function Ee(t,e,n,i){n===null?t.style.removeProperty(e):t.style.setProperty(e,n,i?"important":"")}function Ne(t,e){for(let n=0;n<t.options.length;n+=1){const i=t.options[n];if(i.__value===e){i.selected=!0;return}}t.selectedIndex=-1}function Ae(t){const e=t.querySelector(":checked")||t.options[0];return e&&e.__value}let O;function qt(){if(O===void 0){O=!1;try{typeof window<"u"&&window.parent&&window.parent.document}catch{O=!0}}return O}function Ce(t,e){getComputedStyle(t).position==="static"&&(t.style.position="relative");const i=K("iframe");i.setAttribute("style","display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: -1;"),i.setAttribute("aria-hidden","true"),i.tabIndex=-1;const s=qt();let o;return s?(i.src="data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}<\/script>",o=rt(window,"message",r=>{r.source===i.contentWindow&&e()})):(i.src="about:blank",i.onload=()=>{o=rt(i.contentWindow,"resize",e)}),dt(t,i),()=>{(s||o&&i.contentWindow)&&o(),C(i)}}function Se(t,e,n){t.classList[n?"add":"remove"](e)}function $t(t,e,{bubbles:n=!1,cancelable:i=!1}={}){const s=document.createEvent("CustomEvent");return s.initCustomEvent(t,n,i,e),s}function Te(t,e){const n=[];let i=0;for(const s of e.childNodes)if(s.nodeType===8){const o=s.textContent.trim();o===`HEAD_${t}_END`?(i-=1,n.push(s)):o===`HEAD_${t}_START`&&(i+=1,n.push(s))}else i>0&&n.push(s);return n}class Wt{constructor(e=!1){this.is_svg=!1,this.is_svg=e,this.e=this.n=null}c(e){this.h(e)}m(e,n,i=null){this.e||(this.is_svg?this.e=mt(n.nodeName):this.e=K(n.nodeName),this.t=n,this.c(e)),this.i(i)}h(e){this.e.innerHTML=e,this.n=Array.from(this.e.childNodes)}i(e){for(let n=0;n<this.n.length;n+=1)Bt(this.t,this.n[n],e)}p(e){this.d(),this.h(e),this.i(this.a)}d(){this.n.forEach(C)}}class ct extends Wt{constructor(e,n=!1){super(n),this.e=this.n=null,this.l=e}c(e){this.l?this.n=this.l:super.c(e)}i(e){for(let n=0;n<this.n.length;n+=1)Lt(this.t,this.n[n],e)}}function Me(t,e){return new t(e)}const W=new Map;let F=0;function Ft(t){let e=5381,n=t.length;for(;n--;)e=(e<<5)-e^t.charCodeAt(n);return e>>>0}function Gt(t,e){const n={stylesheet:Ht(e),rules:{}};return W.set(t,n),n}function it(t,e,n,i,s,o,r,l=0){const c=16.666/i;let a=`{
`;for(let m=0;m<=1;m+=c){const y=e+(n-e)*o(m);a+=m*100+`%{${r(y,1-y)}}
`}const f=a+`100% {${r(n,1-n)}}
}`,u=`__svelte_${Ft(f)}_${l}`,_=ht(t),{stylesheet:d,rules:h}=W.get(_)||Gt(_,t);h[u]||(h[u]=!0,d.insertRule(`@keyframes ${u} ${f}`,d.cssRules.length));const g=t.style.animation||"";return t.style.animation=`${g?`${g}, `:""}${u} ${i}ms linear ${s}ms 1 both`,F+=1,u}function G(t,e){const n=(t.style.animation||"").split(", "),i=n.filter(e?o=>o.indexOf(e)<0:o=>o.indexOf("__svelte")===-1),s=n.length-i.length;s&&(t.style.animation=i.join(", "),F-=s,F||It())}function It(){tt(()=>{F||(W.forEach(t=>{const{ownerNode:e}=t.stylesheet;e&&C(e)}),W.clear())})}function je(t,e,n,i){if(!e)return w;const s=t.getBoundingClientRect();if(e.left===s.left&&e.right===s.right&&e.top===s.top&&e.bottom===s.bottom)return w;const{delay:o=0,duration:r=300,easing:l=Y,start:c=Z()+o,end:a=c+r,tick:f=w,css:u}=n(t,{from:e,to:s},i);let _=!0,d=!1,h;function g(){u&&(h=it(t,0,1,r,o,l,u)),o||(d=!0)}function m(){u&&G(t,h),_=!1}return et(y=>{if(!d&&y>=c&&(d=!0),d&&y>=a&&(f(1,0),m()),!_)return!1;if(d){const k=y-c,b=0+1*l(k/r);f(b,1-b)}return!0}),g(),f(0,1),m}function De(t){const e=getComputedStyle(t);if(e.position!=="absolute"&&e.position!=="fixed"){const{width:n,height:i}=e,s=t.getBoundingClientRect();t.style.position="absolute",t.style.width=n,t.style.height=i,Jt(t,s)}}function Jt(t,e){const n=t.getBoundingClientRect();if(e.left!==n.left||e.top!==n.top){const i=getComputedStyle(t),s=i.transform==="none"?"":i.transform;t.style.transform=`${s} translate(${e.left-n.left}px, ${e.top-n.top}px)`}}let H;function D(t){H=t}function T(){if(!H)throw new Error("Function called outside component initialization");return H}function He(t){T().$$.on_mount.push(t)}function Re(t){T().$$.after_update.push(t)}function ze(t){T().$$.on_destroy.push(t)}function Be(){const t=T();return(e,n,{cancelable:i=!1}={})=>{const s=t.$$.callbacks[e];if(s){const o=$t(e,n,{cancelable:i});return s.slice().forEach(r=>{r.call(t,o)}),!o.defaultPrevented}return!0}}function Le(t,e){return T().$$.context.set(t,e),e}function Oe(t){return T().$$.context.get(t)}function Pe(t,e){const n=t.$$.callbacks[e.type];n&&n.slice().forEach(i=>i.call(this,e))}const N=[],lt=[],P=[],V=[],xt=Promise.resolve();let X=!1;function bt(){X||(X=!0,xt.then(vt))}function qe(){return bt(),xt}function R(t){P.push(t)}function We(t){V.push(t)}const U=new Set;let E=0;function vt(){if(E!==0)return;const t=H;do{try{for(;E<N.length;){const e=N[E];E++,D(e),Kt(e.$$)}}catch(e){throw N.length=0,E=0,e}for(D(null),N.length=0,E=0;lt.length;)lt.pop()();for(let e=0;e<P.length;e+=1){const n=P[e];U.has(n)||(U.add(n),n())}P.length=0}while(N.length);for(;V.length;)V.pop()();X=!1,U.clear(),D(t)}function Kt(t){if(t.fragment!==null){t.update(),S(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(R)}}let j;function kt(){return j||(j=Promise.resolve(),j.then(()=>{j=null})),j}function I(t,e,n){t.dispatchEvent($t(`${e?"intro":"outro"}${n}`))}const q=new Set;let v;function Fe(){v={r:0,c:[],p:v}}function Ge(){v.r||S(v.c),v=v.p}function Et(t,e){t&&t.i&&(q.delete(t),t.i(e))}function Qt(t,e,n,i){if(t&&t.o){if(q.has(t))return;q.add(t),v.c.push(()=>{q.delete(t),i&&(n&&t.d(1),i())}),t.o(e)}else i&&i()}const Nt={duration:0};function Ie(t,e,n){const i={direction:"in"};let s=e(t,n,i),o=!1,r,l,c=0;function a(){r&&G(t,r)}function f(){const{delay:_=0,duration:d=300,easing:h=Y,tick:g=w,css:m}=s||Nt;m&&(r=it(t,0,1,d,_,h,m,c++)),g(0,1);const y=Z()+_,k=y+d;l&&l.abort(),o=!0,R(()=>I(t,!0,"start")),l=et(b=>{if(o){if(b>=k)return g(1,0),I(t,!0,"end"),a(),o=!1;if(b>=y){const M=h((b-y)/d);g(M,1-M)}}return o})}let u=!1;return{start(){u||(u=!0,G(t),z(s)?(s=s(i),kt().then(f)):f())},invalidate(){u=!1},end(){o&&(a(),o=!1)}}}function Je(t,e,n){const i={direction:"out"};let s=e(t,n,i),o=!0,r;const l=v;l.r+=1;function c(){const{delay:a=0,duration:f=300,easing:u=Y,tick:_=w,css:d}=s||Nt;d&&(r=it(t,1,0,f,a,u,d));const h=Z()+a,g=h+f;R(()=>I(t,!1,"start")),et(m=>{if(o){if(m>=g)return _(0,1),I(t,!1,"end"),--l.r||S(l.c),!1;if(m>=h){const y=u((m-h)/f);_(1-y,y)}}return o})}return z(s)?kt().then(()=>{s=s(i),c()}):c(),{end(a){a&&s.tick&&s.tick(1,0),o&&(r&&G(t,r),o=!1)}}}function Ke(t,e){t.d(1),e.delete(t.key)}function Ut(t,e){Qt(t,1,1,()=>{e.delete(t.key)})}function Qe(t,e){t.f(),Ut(t,e)}function Ue(t,e,n,i,s,o,r,l,c,a,f,u){let _=t.length,d=o.length,h=_;const g={};for(;h--;)g[t[h].key]=h;const m=[],y=new Map,k=new Map;for(h=d;h--;){const p=u(s,o,h),$=n(p);let x=r.get($);x?i&&x.p(p,e):(x=a($,p),x.c()),y.set($,m[h]=x),$ in g&&k.set($,Math.abs(h-g[$]))}const b=new Set,M=new Set;function Q(p){Et(p,1),p.m(l,f),r.set(p.key,p),f=p.first,d--}for(;_&&d;){const p=m[d-1],$=t[_-1],x=p.key,B=$.key;p===$?(f=p.first,_--,d--):y.has(B)?!r.has(x)||b.has(x)?Q(p):M.has(B)?_--:k.get(x)>k.get(B)?(M.add(x),Q(p)):(b.add(B),_--):(c($,r),_--)}for(;_--;){const p=t[_];y.has(p.key)||c(p,r)}for(;d;)Q(m[d-1]);return m}function Ve(t,e){const n={},i={},s={$$scope:1};let o=t.length;for(;o--;){const r=t[o],l=e[o];if(l){for(const c in r)c in l||(i[c]=1);for(const c in l)s[c]||(n[c]=l[c],s[c]=1);t[o]=l}else for(const c in r)s[c]=1}for(const r in i)r in n||(n[r]=void 0);return n}function Xe(t){return typeof t=="object"&&t!==null?t:{}}function Ye(t,e,n){const i=t.$$.props[e];i!==void 0&&(t.$$.bound[i]=n,n(t.$$.ctx[i]))}function Ze(t){t&&t.c()}function tn(t,e){t&&t.l(e)}function Vt(t,e,n,i){const{fragment:s,after_update:o}=t.$$;s&&s.m(e,n),i||R(()=>{const r=t.$$.on_mount.map(at).filter(z);t.$$.on_destroy?t.$$.on_destroy.push(...r):S(r),t.$$.on_mount=[]}),o.forEach(R)}function Xt(t,e){const n=t.$$;n.fragment!==null&&(S(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function Yt(t,e){t.$$.dirty[0]===-1&&(N.push(t),bt(),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function en(t,e,n,i,s,o,r,l=[-1]){const c=H;D(t);const a=t.$$={fragment:null,ctx:[],props:o,update:w,not_equal:s,bound:st(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(e.context||(c?c.$$.context:[])),callbacks:st(),dirty:l,skip_bound:!1,root:e.target||c.$$.root};r&&r(a.root);let f=!1;if(a.ctx=n?n(t,e.props||{},(u,_,...d)=>{const h=d.length?d[0]:_;return a.ctx&&s(a.ctx[u],a.ctx[u]=h)&&(!a.skip_bound&&a.bound[u]&&a.bound[u](h),f&&Yt(t,u)),_}):[],a.update(),f=!0,S(a.before_update),a.fragment=i?i(a.ctx):!1,e.target){if(e.hydrate){Tt();const u=Ot(e.target);a.fragment&&a.fragment.l(u),u.forEach(C)}else a.fragment&&a.fragment.c();e.intro&&Et(t.$$.fragment),Vt(t,e.target,e.anchor,e.customElement),Mt(),vt()}D(c)}class nn{$destroy(){Xt(this,1),this.$destroy=w}$on(e,n){if(!z(n))return w;const i=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return i.push(n),()=>{const s=i.indexOf(n);s!==-1&&i.splice(s,1)}}$set(e){this.$$set&&!Ct(e)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}export{We as $,Xt as A,qe as B,w as C,Se as D,zt as E,rt as F,_e as G,S as H,ee as I,ue as J,ne as K,se as L,re as M,ie as N,te as O,At as P,pe as Q,ke as R,nn as S,me as T,Ve as U,ce as V,Be as W,oe as X,Pe as Y,Ye as Z,Xe as _,de as a,le as a0,ct as a1,be as a2,Y as a3,z as a4,Z as a5,et as a6,ze as a7,Ue as a8,ae as a9,De as aa,Jt as ab,je as ac,R as ad,Ie as ae,Je as af,Qe as ag,fe as ah,Oe as ai,Le as aj,Te as ak,ge as al,Ne as am,Ae as an,Ce as ao,mt as ap,$e as aq,Ke as ar,ye as as,Lt as b,xe as c,Ge as d,he as e,Et as f,Fe as g,C as h,en as i,Re as j,K as k,we as l,Ot as m,pt as n,He as o,Ee as p,nt as q,Pt as r,Zt as s,Qt as t,ve as u,lt as v,Me as w,Ze as x,tn as y,Vt as z};
