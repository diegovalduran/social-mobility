function w(){}const X=t=>t;function Nt(t,e){for(const n in e)t[n]=e[n];return t}function lt(t){return t()}function it(){return Object.create(null)}function S(t){t.forEach(lt)}function z(t){return typeof t=="function"}function Yt(t,e){return t!=t?e==e:t!==e||t&&typeof t=="object"||typeof t=="function"}function At(t){return Object.keys(t).length===0}function Ct(t,...e){if(t==null)return w;const n=t.subscribe(...e);return n.unsubscribe?()=>n.unsubscribe():n}function Zt(t,e,n){t.$$.on_destroy.push(Ct(e,n))}function te(t,e,n,i){if(t){const s=at(t,e,n,i);return t[0](s)}}function at(t,e,n,i){return t[1]&&i?Nt(n.ctx.slice(),t[1](i(e))):n.ctx}function ee(t,e,n,i){if(t[2]&&i){const s=t[2](i(n));if(e.dirty===void 0)return s;if(typeof s=="object"){const o=[],r=Math.max(e.dirty.length,s.length);for(let l=0;l<r;l+=1)o[l]=e.dirty[l]|s[l];return o}return e.dirty|s}return e.dirty}function ne(t,e,n,i,s,o){if(s){const r=at(e,n,i,o);t.p(r,s)}}function ie(t){if(t.ctx.length>32){const e=[],n=t.ctx.length/32;for(let i=0;i<n;i++)e[i]=-1;return e}return-1}function se(t){const e={};for(const n in t)n[0]!=="$"&&(e[n]=t[n]);return e}function re(t,e){const n={};e=new Set(e);for(const i in t)!e.has(i)&&i[0]!=="$"&&(n[i]=t[i]);return n}function oe(t){const e={};for(const n in t)e[n]=!0;return e}function ce(t){return t??""}function le(t,e,n){return t.set(n),e}function ae(t){return t&&z(t.destroy)?t.destroy:w}const ut=typeof window<"u";let Y=ut?()=>window.performance.now():()=>Date.now(),Z=ut?t=>requestAnimationFrame(t):w;const A=new Set;function ft(t){A.forEach(e=>{e.c(t)||(A.delete(e),e.f())}),A.size!==0&&Z(ft)}function tt(t){let e;return A.size===0&&Z(ft),{promise:new Promise(n=>{A.add(e={c:t,f:n})}),abort(){A.delete(e)}}}let I=!1;function St(){I=!0}function Tt(){I=!1}function Mt(t,e,n,i){for(;t<e;){const s=t+(e-t>>1);n(s)<=i?t=s+1:e=s}return t}function jt(t){if(t.hydrate_init)return;t.hydrate_init=!0;let e=t.childNodes;if(t.nodeName==="HEAD"){const c=[];for(let a=0;a<e.length;a++){const f=e[a];f.claim_order!==void 0&&c.push(f)}e=c}const n=new Int32Array(e.length+1),i=new Int32Array(e.length);n[0]=-1;let s=0;for(let c=0;c<e.length;c++){const a=e[c].claim_order,f=(s>0&&e[n[s]].claim_order<=a?s+1:Mt(1,s,_=>e[n[_]].claim_order,a))-1;i[c]=n[f]+1;const u=f+1;n[u]=c,s=Math.max(u,s)}const o=[],r=[];let l=e.length-1;for(let c=n[s]+1;c!=0;c=i[c-1]){for(o.push(e[c-1]);l>=c;l--)r.push(e[l]);l--}for(;l>=0;l--)r.push(e[l]);o.reverse(),r.sort((c,a)=>c.claim_order-a.claim_order);for(let c=0,a=0;c<r.length;c++){for(;a<o.length&&r[c].claim_order>=o[a].claim_order;)a++;const f=a<o.length?o[a]:null;t.insertBefore(r[c],f)}}function _t(t,e){t.appendChild(e)}function dt(t){if(!t)return document;const e=t.getRootNode?t.getRootNode():t.ownerDocument;return e&&e.host?e:t.ownerDocument}function Dt(t){const e=J("style");return Ht(dt(t),e),e.sheet}function Ht(t,e){return _t(t.head||t,e),e.sheet}function Rt(t,e){if(I){for(jt(t),(t.actual_end_child===void 0||t.actual_end_child!==null&&t.actual_end_child.parentNode!==t)&&(t.actual_end_child=t.firstChild);t.actual_end_child!==null&&t.actual_end_child.claim_order===void 0;)t.actual_end_child=t.actual_end_child.nextSibling;e!==t.actual_end_child?(e.claim_order!==void 0||e.parentNode!==t)&&t.insertBefore(e,t.actual_end_child):t.actual_end_child=e.nextSibling}else(e.parentNode!==t||e.nextSibling!==null)&&t.appendChild(e)}function zt(t,e,n){t.insertBefore(e,n||null)}function Bt(t,e,n){I&&!n?Rt(t,e):(e.parentNode!==t||e.nextSibling!=n)&&t.insertBefore(e,n||null)}function C(t){t.parentNode&&t.parentNode.removeChild(t)}function ue(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function J(t){return document.createElement(t)}function ht(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}function et(t){return document.createTextNode(t)}function fe(){return et(" ")}function _e(){return et("")}function st(t,e,n,i){return t.addEventListener(e,n,i),()=>t.removeEventListener(e,n,i)}function de(t){return function(e){return e.preventDefault(),t.call(this,e)}}function mt(t,e,n){n==null?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function he(t,e){const n=Object.getOwnPropertyDescriptors(t.__proto__);for(const i in e)e[i]==null?t.removeAttribute(i):i==="style"?t.style.cssText=e[i]:i==="__value"?t.value=t[i]=e[i]:n[i]&&n[i].set?t[i]=e[i]:mt(t,i,e[i])}function me(t,e){for(const n in e)mt(t,n,e[n])}function pe(t){return t===""?null:+t}function Lt(t){return Array.from(t.childNodes)}function pt(t){t.claim_info===void 0&&(t.claim_info={last_index:0,total_claimed:0})}function yt(t,e,n,i,s=!1){pt(t);const o=(()=>{for(let r=t.claim_info.last_index;r<t.length;r++){const l=t[r];if(e(l)){const c=n(l);return c===void 0?t.splice(r,1):t[r]=c,s||(t.claim_info.last_index=r),l}}for(let r=t.claim_info.last_index-1;r>=0;r--){const l=t[r];if(e(l)){const c=n(l);return c===void 0?t.splice(r,1):t[r]=c,s?c===void 0&&t.claim_info.last_index--:t.claim_info.last_index=r,l}}return i()})();return o.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1,o}function gt(t,e,n,i){return yt(t,s=>s.nodeName===e,s=>{const o=[];for(let r=0;r<s.attributes.length;r++){const l=s.attributes[r];n[l.name]||o.push(l.name)}o.forEach(r=>s.removeAttribute(r))},()=>i(e))}function ye(t,e,n){return gt(t,e,n,J)}function ge(t,e,n){return gt(t,e,n,ht)}function Ot(t,e){return yt(t,n=>n.nodeType===3,n=>{const i=""+e;if(n.data.startsWith(i)){if(n.data.length!==i.length)return n.splitText(i.length)}else n.data=i},()=>et(e),!0)}function we(t){return Ot(t," ")}function rt(t,e,n){for(let i=n;i<t.length;i+=1){const s=t[i];if(s.nodeType===8&&s.textContent.trim()===e)return i}return t.length}function $e(t,e){const n=rt(t,"HTML_TAG_START",0),i=rt(t,"HTML_TAG_END",n);if(n===i)return new ot(void 0,e);pt(t);const s=t.splice(n,i-n+1);C(s[0]),C(s[s.length-1]);const o=s.slice(1,s.length-1);for(const r of o)r.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1;return new ot(o,e)}function xe(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}function be(t,e){t.value=e??""}function ve(t,e,n,i){n===null?t.style.removeProperty(e):t.style.setProperty(e,n,i?"important":"")}function ke(t,e){for(let n=0;n<t.options.length;n+=1){const i=t.options[n];if(i.__value===e){i.selected=!0;return}}t.selectedIndex=-1}function Ee(t){const e=t.querySelector(":checked")||t.options[0];return e&&e.__value}let L;function Pt(){if(L===void 0){L=!1;try{typeof window<"u"&&window.parent&&window.parent.document}catch{L=!0}}return L}function Ne(t,e){getComputedStyle(t).position==="static"&&(t.style.position="relative");const i=J("iframe");i.setAttribute("style","display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: -1;"),i.setAttribute("aria-hidden","true"),i.tabIndex=-1;const s=Pt();let o;return s?(i.src="data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}<\/script>",o=st(window,"message",r=>{r.source===i.contentWindow&&e()})):(i.src="about:blank",i.onload=()=>{o=st(i.contentWindow,"resize",e)}),_t(t,i),()=>{(s||o&&i.contentWindow)&&o(),C(i)}}function Ae(t,e,n){t.classList[n?"add":"remove"](e)}function wt(t,e,{bubbles:n=!1,cancelable:i=!1}={}){const s=document.createEvent("CustomEvent");return s.initCustomEvent(t,n,i,e),s}function Ce(t,e){const n=[];let i=0;for(const s of e.childNodes)if(s.nodeType===8){const o=s.textContent.trim();o===`HEAD_${t}_END`?(i-=1,n.push(s)):o===`HEAD_${t}_START`&&(i+=1,n.push(s))}else i>0&&n.push(s);return n}class qt{constructor(e=!1){this.is_svg=!1,this.is_svg=e,this.e=this.n=null}c(e){this.h(e)}m(e,n,i=null){this.e||(this.is_svg?this.e=ht(n.nodeName):this.e=J(n.nodeName),this.t=n,this.c(e)),this.i(i)}h(e){this.e.innerHTML=e,this.n=Array.from(this.e.childNodes)}i(e){for(let n=0;n<this.n.length;n+=1)zt(this.t,this.n[n],e)}p(e){this.d(),this.h(e),this.i(this.a)}d(){this.n.forEach(C)}}class ot extends qt{constructor(e,n=!1){super(n),this.e=this.n=null,this.l=e}c(e){this.l?this.n=this.l:super.c(e)}i(e){for(let n=0;n<this.n.length;n+=1)Bt(this.t,this.n[n],e)}}function Se(t,e){return new t(e)}const q=new Map;let W=0;function Wt(t){let e=5381,n=t.length;for(;n--;)e=(e<<5)-e^t.charCodeAt(n);return e>>>0}function Ft(t,e){const n={stylesheet:Dt(e),rules:{}};return q.set(t,n),n}function nt(t,e,n,i,s,o,r,l=0){const c=16.666/i;let a=`{
`;for(let m=0;m<=1;m+=c){const y=e+(n-e)*o(m);a+=m*100+`%{${r(y,1-y)}}
`}const f=a+`100% {${r(n,1-n)}}
}`,u=`__svelte_${Wt(f)}_${l}`,_=dt(t),{stylesheet:d,rules:h}=q.get(_)||Ft(_,t);h[u]||(h[u]=!0,d.insertRule(`@keyframes ${u} ${f}`,d.cssRules.length));const g=t.style.animation||"";return t.style.animation=`${g?`${g}, `:""}${u} ${i}ms linear ${s}ms 1 both`,W+=1,u}function F(t,e){const n=(t.style.animation||"").split(", "),i=n.filter(e?o=>o.indexOf(e)<0:o=>o.indexOf("__svelte")===-1),s=n.length-i.length;s&&(t.style.animation=i.join(", "),W-=s,W||Gt())}function Gt(){Z(()=>{W||(q.forEach(t=>{const{ownerNode:e}=t.stylesheet;e&&C(e)}),q.clear())})}function Te(t,e,n,i){if(!e)return w;const s=t.getBoundingClientRect();if(e.left===s.left&&e.right===s.right&&e.top===s.top&&e.bottom===s.bottom)return w;const{delay:o=0,duration:r=300,easing:l=X,start:c=Y()+o,end:a=c+r,tick:f=w,css:u}=n(t,{from:e,to:s},i);let _=!0,d=!1,h;function g(){u&&(h=nt(t,0,1,r,o,l,u)),o||(d=!0)}function m(){u&&F(t,h),_=!1}return tt(y=>{if(!d&&y>=c&&(d=!0),d&&y>=a&&(f(1,0),m()),!_)return!1;if(d){const k=y-c,b=0+1*l(k/r);f(b,1-b)}return!0}),g(),f(0,1),m}function Me(t){const e=getComputedStyle(t);if(e.position!=="absolute"&&e.position!=="fixed"){const{width:n,height:i}=e,s=t.getBoundingClientRect();t.style.position="absolute",t.style.width=n,t.style.height=i,It(t,s)}}function It(t,e){const n=t.getBoundingClientRect();if(e.left!==n.left||e.top!==n.top){const i=getComputedStyle(t),s=i.transform==="none"?"":i.transform;t.style.transform=`${s} translate(${e.left-n.left}px, ${e.top-n.top}px)`}}let H;function D(t){H=t}function T(){if(!H)throw new Error("Function called outside component initialization");return H}function je(t){T().$$.on_mount.push(t)}function De(t){T().$$.after_update.push(t)}function He(t){T().$$.on_destroy.push(t)}function Re(){const t=T();return(e,n,{cancelable:i=!1}={})=>{const s=t.$$.callbacks[e];if(s){const o=wt(e,n,{cancelable:i});return s.slice().forEach(r=>{r.call(t,o)}),!o.defaultPrevented}return!0}}function ze(t,e){return T().$$.context.set(t,e),e}function Be(t){return T().$$.context.get(t)}function Le(t,e){const n=t.$$.callbacks[e.type];n&&n.slice().forEach(i=>i.call(this,e))}const N=[],ct=[],O=[],U=[],$t=Promise.resolve();let V=!1;function xt(){V||(V=!0,$t.then(bt))}function Oe(){return xt(),$t}function R(t){O.push(t)}function Pe(t){U.push(t)}const Q=new Set;let E=0;function bt(){if(E!==0)return;const t=H;do{try{for(;E<N.length;){const e=N[E];E++,D(e),Jt(e.$$)}}catch(e){throw N.length=0,E=0,e}for(D(null),N.length=0,E=0;ct.length;)ct.pop()();for(let e=0;e<O.length;e+=1){const n=O[e];Q.has(n)||(Q.add(n),n())}O.length=0}while(N.length);for(;U.length;)U.pop()();V=!1,Q.clear(),D(t)}function Jt(t){if(t.fragment!==null){t.update(),S(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(R)}}let j;function vt(){return j||(j=Promise.resolve(),j.then(()=>{j=null})),j}function G(t,e,n){t.dispatchEvent(wt(`${e?"intro":"outro"}${n}`))}const P=new Set;let v;function qe(){v={r:0,c:[],p:v}}function We(){v.r||S(v.c),v=v.p}function kt(t,e){t&&t.i&&(P.delete(t),t.i(e))}function Kt(t,e,n,i){if(t&&t.o){if(P.has(t))return;P.add(t),v.c.push(()=>{P.delete(t),i&&(n&&t.d(1),i())}),t.o(e)}else i&&i()}const Et={duration:0};function Fe(t,e,n){const i={direction:"in"};let s=e(t,n,i),o=!1,r,l,c=0;function a(){r&&F(t,r)}function f(){const{delay:_=0,duration:d=300,easing:h=X,tick:g=w,css:m}=s||Et;m&&(r=nt(t,0,1,d,_,h,m,c++)),g(0,1);const y=Y()+_,k=y+d;l&&l.abort(),o=!0,R(()=>G(t,!0,"start")),l=tt(b=>{if(o){if(b>=k)return g(1,0),G(t,!0,"end"),a(),o=!1;if(b>=y){const M=h((b-y)/d);g(M,1-M)}}return o})}let u=!1;return{start(){u||(u=!0,F(t),z(s)?(s=s(i),vt().then(f)):f())},invalidate(){u=!1},end(){o&&(a(),o=!1)}}}function Ge(t,e,n){const i={direction:"out"};let s=e(t,n,i),o=!0,r;const l=v;l.r+=1;function c(){const{delay:a=0,duration:f=300,easing:u=X,tick:_=w,css:d}=s||Et;d&&(r=nt(t,1,0,f,a,u,d));const h=Y()+a,g=h+f;R(()=>G(t,!1,"start")),tt(m=>{if(o){if(m>=g)return _(0,1),G(t,!1,"end"),--l.r||S(l.c),!1;if(m>=h){const y=u((m-h)/f);_(1-y,y)}}return o})}return z(s)?vt().then(()=>{s=s(i),c()}):c(),{end(a){a&&s.tick&&s.tick(1,0),o&&(r&&F(t,r),o=!1)}}}function Ie(t,e){t.d(1),e.delete(t.key)}function Qt(t,e){Kt(t,1,1,()=>{e.delete(t.key)})}function Je(t,e){t.f(),Qt(t,e)}function Ke(t,e,n,i,s,o,r,l,c,a,f,u){let _=t.length,d=o.length,h=_;const g={};for(;h--;)g[t[h].key]=h;const m=[],y=new Map,k=new Map;for(h=d;h--;){const p=u(s,o,h),$=n(p);let x=r.get($);x?i&&x.p(p,e):(x=a($,p),x.c()),y.set($,m[h]=x),$ in g&&k.set($,Math.abs(h-g[$]))}const b=new Set,M=new Set;function K(p){kt(p,1),p.m(l,f),r.set(p.key,p),f=p.first,d--}for(;_&&d;){const p=m[d-1],$=t[_-1],x=p.key,B=$.key;p===$?(f=p.first,_--,d--):y.has(B)?!r.has(x)||b.has(x)?K(p):M.has(B)?_--:k.get(x)>k.get(B)?(M.add(x),K(p)):(b.add(B),_--):(c($,r),_--)}for(;_--;){const p=t[_];y.has(p.key)||c(p,r)}for(;d;)K(m[d-1]);return m}function Qe(t,e){const n={},i={},s={$$scope:1};let o=t.length;for(;o--;){const r=t[o],l=e[o];if(l){for(const c in r)c in l||(i[c]=1);for(const c in l)s[c]||(n[c]=l[c],s[c]=1);t[o]=l}else for(const c in r)s[c]=1}for(const r in i)r in n||(n[r]=void 0);return n}function Ue(t){return typeof t=="object"&&t!==null?t:{}}function Ve(t,e,n){const i=t.$$.props[e];i!==void 0&&(t.$$.bound[i]=n,n(t.$$.ctx[i]))}function Xe(t){t&&t.c()}function Ye(t,e){t&&t.l(e)}function Ut(t,e,n,i){const{fragment:s,after_update:o}=t.$$;s&&s.m(e,n),i||R(()=>{const r=t.$$.on_mount.map(lt).filter(z);t.$$.on_destroy?t.$$.on_destroy.push(...r):S(r),t.$$.on_mount=[]}),o.forEach(R)}function Vt(t,e){const n=t.$$;n.fragment!==null&&(S(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function Xt(t,e){t.$$.dirty[0]===-1&&(N.push(t),xt(),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function Ze(t,e,n,i,s,o,r,l=[-1]){const c=H;D(t);const a=t.$$={fragment:null,ctx:[],props:o,update:w,not_equal:s,bound:it(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(e.context||(c?c.$$.context:[])),callbacks:it(),dirty:l,skip_bound:!1,root:e.target||c.$$.root};r&&r(a.root);let f=!1;if(a.ctx=n?n(t,e.props||{},(u,_,...d)=>{const h=d.length?d[0]:_;return a.ctx&&s(a.ctx[u],a.ctx[u]=h)&&(!a.skip_bound&&a.bound[u]&&a.bound[u](h),f&&Xt(t,u)),_}):[],a.update(),f=!0,S(a.before_update),a.fragment=i?i(a.ctx):!1,e.target){if(e.hydrate){St();const u=Lt(e.target);a.fragment&&a.fragment.l(u),u.forEach(C)}else a.fragment&&a.fragment.c();e.intro&&kt(t.$$.fragment),Ut(t,e.target,e.anchor,e.customElement),Tt(),bt()}D(c)}class tn{$destroy(){Vt(this,1),this.$destroy=w}$on(e,n){if(!z(n))return w;const i=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return i.push(n),()=>{const s=i.indexOf(n);s!==-1&&i.splice(s,1)}}$set(e){this.$$set&&!At(e)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}export{ot as $,Vt as A,Oe as B,w as C,Rt as D,te as E,ne as F,ie as G,ee as H,Zt as I,Nt as J,Ae as K,he as L,be as M,st as N,de as O,Qe as P,S as Q,re as R,tn as S,Re as T,se as U,Le as V,Ve as W,Ue as X,Pe as Y,oe as Z,ue as _,fe as a,$e as a0,X as a1,z as a2,Y as a3,tt as a4,He as a5,Ke as a6,ce as a7,Me as a8,It as a9,Te as aa,R as ab,Fe as ac,Ge as ad,Je as ae,ae as af,Be as ag,ze as ah,Ce as ai,pe as aj,ke as ak,Ee as al,Ne as am,le as an,ht as ao,ge as ap,Ie as aq,me as ar,Bt as b,we as c,We as d,_e as e,kt as f,qe as g,C as h,Ze as i,De as j,J as k,ye as l,Lt as m,mt as n,je as o,ve as p,et as q,Ot as r,Yt as s,Kt as t,xe as u,ct as v,Se as w,Xe as x,Ye as y,Ut as z};
