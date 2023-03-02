import{S as te,i as le,s as se,k as b,a as x,q as A,J as ve,l as z,h as m,c as I,m as S,r as M,n as g,p as Y,D as i,b as O,N as ge,O as Z,u as Q,P as Ee,C as ee,Q as ce,o as be,R as X,f as U,g as ue,d as de,t as G,K as pe,T as ze,x as he,y as me,z as ye,A as _e}from"../../../../chunks/index-6c479e7d.js";import{g as Ce,d as ke}from"../../../../chunks/transform-96ff9c66.js";import{b as Se}from"../../../../chunks/paths-eb28c9cb.js";const Te=async l=>{if("clipboard"in navigator)await navigator.clipboard.writeText(l);else{const e=document.createElement("input");e.type="text",e.disabled=!0,e.style.setProperty("position","fixed"),e.style.setProperty("z-index","-100"),e.style.setProperty("pointer-events","none"),e.style.setProperty("opacity","0"),e.value=l,document.body.appendChild(e),e.click(),e.select(),document.execCommand("copy"),document.body.removeChild(e)}},De=(l,e)=>{async function n(){if(c)try{await Te(c),l.dispatchEvent(new CustomEvent("svelte-copy",{detail:c}))}catch(o){l.dispatchEvent(new CustomEvent("svelte-copy:error",{detail:o}))}}let t=typeof e=="string"?["click"]:[e.events].flat(1),c=typeof e=="string"?e:e.text;return t.forEach(o=>{l.addEventListener(o,n,!0)}),{update:o=>{const v=typeof o=="string"?["click"]:[o.events].flat(1),E=typeof o=="string"?o:o.text,y=v.filter(d=>!t.includes(d)),s=t.filter(d=>!v.includes(d));y.forEach(d=>{l.addEventListener(d,n,!0)}),s.forEach(d=>{l.removeEventListener(d,n,!0)}),t=v,c=E},destroy:()=>{t.forEach(o=>{l.removeEventListener(o,n,!0)})}}};function Pe(l){let e,n,t,c,o,v,E,y,s,d,a,r,p,T,D,j,w,N,q,P,B,L,R,K;return{c(){e=b("link"),n=x(),t=b("div"),c=b("h3"),o=A(l[0]),v=x(),E=b("p"),y=A(l[1]),s=x(),d=b("details"),a=b("summary"),r=A("CSS Snippet"),p=x(),T=b("code"),D=A(l[2]),j=x(),w=b("p"),N=b("button"),q=A("Copy CSS to Clipboard"),B=b("span"),L=A(l[3]),this.h()},l(k){const C=ve("svelte-1uevrx3",document.head);e=z(C,"LINK",{rel:!0,href:!0}),C.forEach(m),n=I(k),t=z(k,"DIV",{style:!0,class:!0});var u=S(t);c=z(u,"H3",{class:!0});var W=S(c);o=M(W,l[0]),W.forEach(m),v=I(u),E=z(u,"P",{});var f=S(E);y=M(f,l[1]),f.forEach(m),s=I(u),d=z(u,"DETAILS",{class:!0});var h=S(d);a=z(h,"SUMMARY",{class:!0});var _=S(a);r=M(_,"CSS Snippet"),_.forEach(m),p=I(h),T=z(h,"CODE",{class:!0});var H=S(T);D=M(H,l[2]),H.forEach(m),h.forEach(m),j=I(u),w=z(u,"P",{});var V=S(w);N=z(V,"BUTTON",{class:!0});var F=S(N);q=M(F,"Copy CSS to Clipboard"),F.forEach(m),B=z(V,"SPAN",{class:!0});var J=S(B);L=M(J,l[3]),J.forEach(m),V.forEach(m),u.forEach(m),this.h()},h(){g(e,"rel","external stylesheet"),g(e,"href",l[5]),g(c,"class","svelte-19ry7n"),Y(E,"font-size",l[4]),g(a,"class","svelte-19ry7n"),g(T,"class","svelte-19ry7n"),g(d,"class","svelte-19ry7n"),g(N,"class","svelte-19ry7n"),g(B,"class","svelte-19ry7n"),Y(t,"font-family","'"+l[0]+"'"),g(t,"class","svelte-19ry7n")},m(k,C){i(document.head,e),O(k,n,C),O(k,t,C),i(t,c),i(c,o),i(t,v),i(t,E),i(E,y),i(t,s),i(t,d),i(d,a),i(a,r),i(d,p),i(d,T),i(T,D),i(t,j),i(t,w),i(w,N),i(N,q),i(w,B),i(B,L),R||(K=[ge(P=De.call(null,N,l[2])),Z(N,"svelte-copy",l[6])],R=!0)},p(k,[C]){C&1&&Q(o,k[0]),C&2&&Q(y,k[1]),C&16&&Y(E,"font-size",k[4]),C&4&&Q(D,k[2]),P&&Ee(P.update)&&C&4&&P.update.call(null,k[2]),C&8&&Q(L,k[3]),C&1&&Y(t,"font-family","'"+k[0]+"'")},i:ee,o:ee,d(k){m(e),k&&m(n),k&&m(t),R=!1,ce(K)}}}function we(l,e,n){let t,{id:c=""}=e,{family:o=""}=e,{size:v=16}=e,{text:E}=e,y="",s="";const d=`${Se}/assets/demo/fonts/${c}.css`,a=()=>{n(3,s="Copied!"),setTimeout(()=>{n(3,s="")},1e3)};return be(async()=>{const r=await fetch(d);n(2,y=await r.text())}),l.$$set=r=>{"id"in r&&n(7,c=r.id),"family"in r&&n(0,o=r.family),"size"in r&&n(8,v=r.size),"text"in r&&n(1,E=r.text)},l.$$.update=()=>{l.$$.dirty&256&&n(4,t=`${v}px`)},[o,E,y,s,t,d,a,c,v]}class Le extends te{constructor(e){super(),le(this,e,we,Pe,se,{id:7,family:0,size:8,text:1})}}const xe=[{id:"atkinson",family:"Atkinson",type:"sans-serif"},{id:"atlas",family:"Atlas Grotesk",type:"sans-serif"},{id:"baloo-bhai",family:"Baloo Bhai",type:"sans-serif"},{id:"canela",family:"Canela",type:"serif"},{id:"computer-modern",family:"Computer Modern",type:"serif"},{id:"cozette",family:"Cozette",type:"other"},{id:"inter",family:"Inter",type:"sans-serif"},{id:"jamboree",family:"Jamboree",type:"other"},{id:"jersey",family:"Jersey M54",type:"other"},{id:"lyon",family:"Lyon Display",type:"serif"},{id:"metropolis",family:"Metropolis",type:"sans-serif"},{id:"national",family:"National 2 Web",type:"sans-serif"},{id:"publico",family:"Publico Text",type:"serif"},{id:"recoleta",family:"Recoleta",type:"serif"},{id:"rubik",family:"Rubik",type:"sans-serif"},{id:"spacemono",family:"Space Mono",type:"mono"},{id:"tiempos",family:"Tiempos Text",type:"serif"}];function ae(l,e,n){const t=l.slice();return t[5]=e[n][0],t[6]=e[n][1],t}function ie(l,e,n){const t=l.slice();return t[9]=e[n].family,t[10]=e[n].id,t}function re(l){let e,n;return e=new Le({props:{id:l[10],family:l[9],size:l[0],text:l[1]}}),{c(){he(e.$$.fragment)},l(t){me(e.$$.fragment,t)},m(t,c){ye(e,t,c),n=!0},p(t,c){const o={};c&1&&(o.size=t[0]),c&2&&(o.text=t[1]),e.$set(o)},i(t){n||(U(e.$$.fragment,t),n=!0)},o(t){G(e.$$.fragment,t),n=!1},d(t){_e(e,t)}}}function fe(l){let e,n=l[5]+"",t,c,o,v,E,y=l[6],s=[];for(let a=0;a<y.length;a+=1)s[a]=re(ie(l,y,a));const d=a=>G(s[a],1,1,()=>{s[a]=null});return{c(){e=b("h2"),t=A(n),c=x(),o=b("section");for(let a=0;a<s.length;a+=1)s[a].c();v=x(),this.h()},l(a){e=z(a,"H2",{});var r=S(e);t=M(r,n),r.forEach(m),c=I(a),o=z(a,"SECTION",{class:!0});var p=S(o);for(let T=0;T<s.length;T+=1)s[T].l(p);v=I(p),p.forEach(m),this.h()},h(){g(o,"class","svelte-1lzc8ku")},m(a,r){O(a,e,r),i(e,t),O(a,c,r),O(a,o,r);for(let p=0;p<s.length;p+=1)s[p].m(o,null);i(o,v),E=!0},p(a,r){if(r&7){y=a[6];let p;for(p=0;p<y.length;p+=1){const T=ie(a,y,p);s[p]?(s[p].p(T,r),U(s[p],1)):(s[p]=re(T),s[p].c(),U(s[p],1),s[p].m(o,v))}for(ue(),p=y.length;p<s.length;p+=1)d(p);de()}},i(a){if(!E){for(let r=0;r<y.length;r+=1)U(s[r]);E=!0}},o(a){s=s.filter(Boolean);for(let r=0;r<s.length;r+=1)G(s[r]);E=!1},d(a){a&&m(e),a&&m(c),a&&m(o),pe(s,a)}}}function Ae(l){let e,n,t,c,o,v,E,y,s,d,a,r,p,T,D,j,w,N,q,P,B,L,R,K,k,C=l[2],u=[];for(let f=0;f<C.length;f+=1)u[f]=fe(ae(l,C,f));const W=f=>G(u[f],1,1,()=>{u[f]=null});return{c(){e=b("div"),n=b("h1"),t=A("Hosted Fonts on The Pudding"),c=x(),o=b("p"),v=b("em"),E=A("Do not use fonts hosted by The Pudding without written permission."),y=x(),s=b("form"),d=b("label"),a=A("font-size: "),r=A(l[0]),p=A("px"),T=x(),D=b("input"),j=x(),w=b("label"),N=A("text sample"),q=x(),P=b("input"),B=x(),L=b("article");for(let f=0;f<u.length;f+=1)u[f].c();this.h()},l(f){e=z(f,"DIV",{id:!0,class:!0});var h=S(e);n=z(h,"H1",{});var _=S(n);t=M(_,"Hosted Fonts on The Pudding"),_.forEach(m),c=I(h),o=z(h,"P",{});var H=S(o);v=z(H,"EM",{});var V=S(v);E=M(V,"Do not use fonts hosted by The Pudding without written permission."),V.forEach(m),H.forEach(m),y=I(h),s=z(h,"FORM",{});var F=S(s);d=z(F,"LABEL",{for:!0,class:!0});var J=S(d);a=M(J,"font-size: "),r=M(J,l[0]),p=M(J,"px"),J.forEach(m),T=I(F),D=z(F,"INPUT",{id:!0,type:!0,min:!0,max:!0}),j=I(F),w=z(F,"LABEL",{for:!0,class:!0});var ne=S(w);N=M(ne,"text sample"),ne.forEach(m),q=I(F),P=z(F,"INPUT",{id:!0,type:!0,maxlength:!0}),F.forEach(m),h.forEach(m),B=I(f),L=z(f,"ARTICLE",{class:!0});var oe=S(L);for(let $=0;$<u.length;$+=1)u[$].l(oe);oe.forEach(m),this.h()},h(){g(d,"for","size"),g(d,"class","svelte-1lzc8ku"),g(D,"id","size"),g(D,"type","range"),g(D,"min","12"),g(D,"max","48"),g(w,"for","text"),g(w,"class","svelte-1lzc8ku"),g(P,"id","text"),g(P,"type","text"),g(P,"maxlength","100"),g(e,"id","info"),g(e,"class","svelte-1lzc8ku"),g(L,"class","svelte-1lzc8ku")},m(f,h){O(f,e,h),i(e,n),i(n,t),i(e,c),i(e,o),i(o,v),i(v,E),i(e,y),i(e,s),i(s,d),i(d,a),i(d,r),i(d,p),i(s,T),i(s,D),X(D,l[0]),i(s,j),i(s,w),i(w,N),i(s,q),i(s,P),X(P,l[1]),O(f,B,h),O(f,L,h);for(let _=0;_<u.length;_+=1)u[_].m(L,null);R=!0,K||(k=[Z(D,"change",l[3]),Z(D,"input",l[3]),Z(P,"input",l[4])],K=!0)},p(f,[h]){if((!R||h&1)&&Q(r,f[0]),h&1&&X(D,f[0]),h&2&&P.value!==f[1]&&X(P,f[1]),h&7){C=f[2];let _;for(_=0;_<C.length;_+=1){const H=ae(f,C,_);u[_]?(u[_].p(H,h),U(u[_],1)):(u[_]=fe(H),u[_].c(),U(u[_],1),u[_].m(L,null))}for(ue(),_=C.length;_<u.length;_+=1)W(_);de()}},i(f){if(!R){for(let h=0;h<C.length;h+=1)U(u[h]);R=!0}},o(f){u=u.filter(Boolean);for(let h=0;h<u.length;h+=1)G(u[h]);R=!1},d(f){f&&m(e),f&&m(B),f&&m(L),pe(u,f),K=!1,ce(k)}}}function Ie(l,e,n){let t=18,c="The quick brown fox jumps over the lazy dog.";const o=Ce(xe,y=>y.type);o.sort((y,s)=>ke(y[1].length,s[1].length));function v(){t=ze(this.value),n(0,t)}function E(){c=this.value,n(1,c)}return[t,c,o,v,E]}class Me extends te{constructor(e){super(),le(this,e,Ie,Ae,se,{})}}function Ne(l){let e,n;return e=new Me({}),{c(){he(e.$$.fragment)},l(t){me(e.$$.fragment,t)},m(t,c){ye(e,t,c),n=!0},p:ee,i(t){n||(U(e.$$.fragment,t),n=!0)},o(t){G(e.$$.fragment,t),n=!1},d(t){_e(e,t)}}}class He extends te{constructor(e){super(),le(this,e,null,Ne,se,{})}}export{He as default};