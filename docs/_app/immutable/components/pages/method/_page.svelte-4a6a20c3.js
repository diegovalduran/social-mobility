import{S as Ve,i as Ce,s as je,k as b,a as U,l as E,m as W,c as O,h as c,n as f,D as Ze,b as ve,E as a,C as Oe,G as il,q as L,r as N,u as We,F as ne,v as x,_ as ee,x as me,y as be,ae as ul,z as Ee,an as Je,T as ue,a0 as le,am as Se,f as fe,t as he,A as Pe,H as Ye,ao as ol,g as fl,d as hl,aj as $e,ak as vl}from"../../../chunks/index-8d31100a.js";import{o as Xe,j as _l,M as dl,m as pl,v as cl}from"../../../chunks/version-9c18684c.js";import{b as gl}from"../../../chunks/paths-eb28c9cb.js";import"../../../chunks/transform-96ff9c66.js";function xe(e,t,l){const o=e.slice();return o[12]=t[l],o}function el(e){let t,l;return{c(){t=b("div"),l=L(e[1]),this.h()},l(o){t=E(o,"DIV",{class:!0,id:!0});var n=W(t);l=N(n,e[1]),n.forEach(c),this.h()},h(){f(t,"class","legend svelte-13oh5yk"),f(t,"id","legend-"+e[6])},m(o,n){ve(o,t,n),a(t,l)},p(o,n){n&2&&We(l,o[1])},d(o){o&&c(t)}}}function ll(e){let t,l,o,n,s,i,h=(e[12].label||e[12].value)+"",v,m,r,P,d,z;return{c(){t=b("div"),l=b("input"),s=U(),i=b("label"),v=L(h),P=U(),this.h()},l(g){t=E(g,"DIV",{class:!0});var p=W(t);l=E(p,"INPUT",{type:!0,id:!0,name:!0,class:!0}),s=O(p),i=E(p,"LABEL",{class:!0,for:!0});var I=W(i);v=N(I,h),I.forEach(c),P=O(p),p.forEach(c),this.h()},h(){f(l,"type","radio"),f(l,"id",o=`${e[6]}-${e[12].slug}`),f(l,"name","name-"+e[6]),f(l,"class","sr-only svelte-13oh5yk"),l.__value=n=e[12].value,l.value=l.__value,l.disabled=e[3],e[10][0].push(l),f(i,"class",m="option "+e[2]+" svelte-13oh5yk"),f(i,"for",r=`${e[6]}-${e[12].slug}`),f(t,"class","option svelte-13oh5yk")},m(g,p){ve(g,t,p),a(t,l),l.checked=l.__value===e[0],a(t,s),a(t,i),a(i,v),a(t,P),d||(z=ne(l,"change",e[9]),d=!0)},p(g,p){p&32&&o!==(o=`${g[6]}-${g[12].slug}`)&&f(l,"id",o),p&32&&n!==(n=g[12].value)&&(l.__value=n,l.value=l.__value),p&8&&(l.disabled=g[3]),p&1&&(l.checked=l.__value===g[0]),p&32&&h!==(h=(g[12].label||g[12].value)+"")&&We(v,h),p&4&&m!==(m="option "+g[2]+" svelte-13oh5yk")&&f(i,"class",m),p&32&&r!==(r=`${g[6]}-${g[12].slug}`)&&f(i,"for",r)},d(g){g&&c(t),e[10][0].splice(e[10][0].indexOf(l),1),d=!1,z()}}}function ml(e){let t,l,o,n,s=e[1]&&el(e),i=e[5],h=[];for(let v=0;v<i.length;v+=1)h[v]=ll(xe(e,i,v));return{c(){t=b("div"),l=b("div"),s&&s.c(),o=U(),n=b("div");for(let v=0;v<h.length;v+=1)h[v].c();this.h()},l(v){t=E(v,"DIV",{class:!0});var m=W(t);l=E(m,"DIV",{id:!0,class:!0,role:!0,"aria-labelledby":!0});var r=W(l);s&&s.l(r),o=O(r),n=E(r,"DIV",{class:!0});var P=W(n);for(let d=0;d<h.length;d+=1)h[d].l(P);P.forEach(c),r.forEach(c),m.forEach(c),this.h()},h(){f(n,"class","options svelte-13oh5yk"),f(l,"id",`group-${e[6]}`),f(l,"class","group svelte-13oh5yk"),f(l,"role","radiogroup"),f(l,"aria-labelledby",`label-${e[6]}`),Ze(l,"is-top",e[4]),f(t,"class","button-set svelte-13oh5yk")},m(v,m){ve(v,t,m),a(t,l),s&&s.m(l,null),a(l,o),a(l,n);for(let r=0;r<h.length;r+=1)h[r].m(n,null)},p(v,[m]){if(v[1]?s?s.p(v,m):(s=el(v),s.c(),s.m(l,o)):s&&(s.d(1),s=null),m&109){i=v[5];let r;for(r=0;r<i.length;r+=1){const P=xe(v,i,r);h[r]?h[r].p(P,m):(h[r]=ll(P),h[r].c(),h[r].m(n,null))}for(;r<h.length;r+=1)h[r].d(1);h.length=i.length}m&16&&Ze(l,"is-top",v[4])},i:Oe,o:Oe,d(v){v&&c(t),s&&s.d(),il(h,v)}}}function bl(e,t,l){let o,n,{options:s=[]}=t,{legend:i=""}=t,{legendPosition:h="top"}=t,{labelClass:v=""}=t,{disabled:m=!1}=t,{value:r=s.length?s[0].value:""}=t;const P=`legend-${Math.floor(Math.random()*1e6)}`,d=(p="")=>`${p}`.toLowerCase().replace(/\W/g,""),z=[[]];function g(){r=this.__value,l(0,r)}return e.$$set=p=>{"options"in p&&l(7,s=p.options),"legend"in p&&l(1,i=p.legend),"legendPosition"in p&&l(8,h=p.legendPosition),"labelClass"in p&&l(2,v=p.labelClass),"disabled"in p&&l(3,m=p.disabled),"value"in p&&l(0,r=p.value)},e.$$.update=()=>{e.$$.dirty&128&&l(5,o=s.map(p=>({...p,val:p.value,slug:d(p.value)}))),e.$$.dirty&256&&l(4,n=h==="top")},[r,i,v,m,n,o,P,s,h,g,z]}class rl extends Ve{constructor(t){super(),Ce(this,t,bl,ml,je,{options:7,legend:1,legendPosition:8,labelClass:2,disabled:3,value:0})}}function El(e){let t,l,o,n,s,i,h,v,m,r,P,d,z,g,p,I,T,A,D,J,R,S,k,X,j,G,w,Y,ie,H,y,te,K,_e,Z,M,_,Q,pe,de,V,C,ce,ke;function Ke(q){e[4](q)}let Te={options:[{value:"scalePow"},{value:"scaleLog"}]};return e[0]!==void 0&&(Te.value=e[0]),h=new rl({props:Te}),x.push(()=>ee(h,"value",Ke)),{c(){t=b("div"),l=b("fieldset"),o=b("legend"),n=L(e[3]),s=U(),i=b("div"),me(h.$$.fragment),m=U(),r=b("div"),P=b("p"),d=L("Exponent"),z=U(),g=b("select"),p=b("option"),I=L("0.1"),T=b("option"),A=L("0.25"),D=b("option"),J=L("0.5"),R=b("option"),S=L("0.67"),k=b("option"),X=L("0.75"),j=b("option"),G=L("1"),w=b("option"),Y=L("2"),H=U(),y=b("div"),te=b("p"),K=L("Min"),_e=U(),Z=b("input"),M=U(),_=b("div"),Q=b("p"),pe=L("Max"),de=U(),V=b("input"),this.h()},l(q){t=E(q,"DIV",{class:!0});var oe=W(t);l=E(oe,"FIELDSET",{class:!0});var se=W(l);o=E(se,"LEGEND",{class:!0});var Be=W(o);n=N(Be,e[3]),Be.forEach(c),s=O(se),i=E(se,"DIV",{class:!0});var ze=W(i);be(h.$$.fragment,ze),ze.forEach(c),m=O(se),r=E(se,"DIV",{class:!0});var Le=W(r);P=E(Le,"P",{class:!0});var Ae=W(P);d=N(Ae,"Exponent"),Ae.forEach(c),z=O(Le),g=E(Le,"SELECT",{class:!0});var re=W(g);p=E(re,"OPTION",{});var ye=W(p);I=N(ye,"0.1"),ye.forEach(c),T=E(re,"OPTION",{});var Fe=W(T);A=N(Fe,"0.25"),Fe.forEach(c),D=E(re,"OPTION",{});var Ge=W(D);J=N(Ge,"0.5"),Ge.forEach(c),R=E(re,"OPTION",{});var He=W(R);S=N(He,"0.67"),He.forEach(c),k=E(re,"OPTION",{});var we=W(k);X=N(we,"0.75"),we.forEach(c),j=E(re,"OPTION",{});var qe=W(j);G=N(qe,"1"),qe.forEach(c),w=E(re,"OPTION",{});var Re=W(w);Y=N(Re,"2"),Re.forEach(c),re.forEach(c),Le.forEach(c),H=O(se),y=E(se,"DIV",{class:!0});var Ie=W(y);te=E(Ie,"P",{class:!0});var F=W(te);K=N(F,"Min"),F.forEach(c),_e=O(Ie),Z=E(Ie,"INPUT",{type:!0,class:!0}),Ie.forEach(c),M=O(se),_=E(se,"DIV",{class:!0});var u=W(_);Q=E(u,"P",{class:!0});var B=W(Q);pe=N(B,"Max"),B.forEach(c),de=O(u),V=E(u,"INPUT",{type:!0,class:!0}),u.forEach(c),se.forEach(c),oe.forEach(c),this.h()},h(){f(o,"class","svelte-fb5b91"),f(i,"class","scale svelte-fb5b91"),f(P,"class","svelte-fb5b91"),p.__value="0.1",p.value=p.__value,T.__value="0.25",T.value=T.__value,D.__value="0.5",D.value=D.__value,R.__value="0.67",R.value=R.__value,k.__value="0.75",k.value=k.__value,j.__value="1",j.value=j.__value,w.__value="2",w.value=w.__value,g.disabled=ie=e[0]==="scaleLog",f(g,"class","svelte-fb5b91"),e[1]===void 0&&ul(()=>e[5].call(g)),f(r,"class","exponent svelte-fb5b91"),f(te,"class","svelte-fb5b91"),f(Z,"type","number"),f(Z,"class","svelte-fb5b91"),f(y,"class","bound svelte-fb5b91"),f(Q,"class","svelte-fb5b91"),f(V,"type","number"),f(V,"class","svelte-fb5b91"),f(_,"class","bound svelte-fb5b91"),f(l,"class","svelte-fb5b91"),f(t,"class","method-scale svelte-fb5b91")},m(q,oe){ve(q,t,oe),a(t,l),a(l,o),a(o,n),a(l,s),a(l,i),Ee(h,i,null),a(l,m),a(l,r),a(r,P),a(P,d),a(r,z),a(r,g),a(g,p),a(p,I),a(g,T),a(T,A),a(g,D),a(D,J),a(g,R),a(R,S),a(g,k),a(k,X),a(g,j),a(j,G),a(g,w),a(w,Y),Je(g,e[1]),a(l,H),a(l,y),a(y,te),a(te,K),a(y,_e),a(y,Z),ue(Z,e[2][0]),a(l,M),a(l,_),a(_,Q),a(Q,pe),a(_,de),a(_,V),ue(V,e[2][1]),C=!0,ce||(ke=[ne(g,"change",e[5]),ne(Z,"input",e[6]),ne(V,"input",e[7])],ce=!0)},p(q,[oe]){(!C||oe&8)&&We(n,q[3]);const se={};!v&&oe&1&&(v=!0,se.value=q[0],le(()=>v=!1)),h.$set(se),(!C||oe&1&&ie!==(ie=q[0]==="scaleLog"))&&(g.disabled=ie),oe&2&&Je(g,q[1]),oe&4&&Se(Z.value)!==q[2][0]&&ue(Z,q[2][0]),oe&4&&Se(V.value)!==q[2][1]&&ue(V,q[2][1])},i(q){C||(fe(h.$$.fragment,q),C=!0)},o(q){he(h.$$.fragment,q),C=!1},d(q){q&&c(t),Pe(h),ce=!1,Ye(ke)}}}function Pl(e,t,l){let{legend:o}=t,{valueScale:n}=t,{valueExp:s}=t,{valueBounds:i}=t;function h(P){n=P,l(0,n)}function v(){s=ol(this),l(1,s)}function m(){i[0]=Se(this.value),l(2,i)}function r(){i[1]=Se(this.value),l(2,i)}return e.$$set=P=>{"legend"in P&&l(3,o=P.legend),"valueScale"in P&&l(0,n=P.valueScale),"valueExp"in P&&l(1,s=P.valueExp),"valueBounds"in P&&l(2,i=P.valueBounds)},e.$$.update=()=>{e.$$.dirty&3},[n,s,i,o,h,v,m,r]}class Qe extends Ve{constructor(t){super(),Ce(this,t,Pl,El,je,{legend:3,valueScale:0,valueExp:1,valueBounds:2})}}function Wl(e){let t,l,o,n,s,i,h,v,m,r,P,d,z,g,p,I,T,A,D,J,R,S,k,X,j,G,w,Y,ie,H,y,te,K;function _e(M){e[5](M)}let Z={options:[{value:"share"},{value:"score"}]};return e[0]!==void 0&&(Z.value=e[0]),h=new rl({props:Z}),x.push(()=>ee(h,"value",_e)),{c(){t=b("div"),l=b("fieldset"),o=b("legend"),n=L(e[4]),s=U(),i=b("div"),me(h.$$.fragment),m=U(),r=b("div"),P=b("p"),d=L("Distance (weight: "),z=L(e[1]),g=L(")"),p=U(),I=b("input"),T=U(),A=b("p"),D=L("Population (weight: "),J=L(e[2]),R=L(")"),S=U(),k=b("input"),X=U(),j=b("p"),G=L("Wiki Length (weight: "),w=L(e[3]),Y=L(")"),ie=U(),H=b("input"),this.h()},l(M){t=E(M,"DIV",{class:!0});var _=W(t);l=E(_,"FIELDSET",{class:!0});var Q=W(l);o=E(Q,"LEGEND",{class:!0});var pe=W(o);n=N(pe,e[4]),pe.forEach(c),s=O(Q),i=E(Q,"DIV",{class:!0});var de=W(i);be(h.$$.fragment,de),m=O(de),r=E(de,"DIV",{class:!0});var V=W(r);P=E(V,"P",{class:!0});var C=W(P);d=N(C,"Distance (weight: "),z=N(C,e[1]),g=N(C,")"),C.forEach(c),p=O(V),I=E(V,"INPUT",{type:!0,step:!0,min:!0,max:!0,class:!0}),T=O(V),A=E(V,"P",{class:!0});var ce=W(A);D=N(ce,"Population (weight: "),J=N(ce,e[2]),R=N(ce,")"),ce.forEach(c),S=O(V),k=E(V,"INPUT",{type:!0,step:!0,min:!0,max:!0,class:!0}),X=O(V),j=E(V,"P",{class:!0});var ke=W(j);G=N(ke,"Wiki Length (weight: "),w=N(ke,e[3]),Y=N(ke,")"),ke.forEach(c),ie=O(V),H=E(V,"INPUT",{type:!0,step:!0,min:!0,max:!0,class:!0}),V.forEach(c),de.forEach(c),Q.forEach(c),_.forEach(c),this.h()},h(){f(o,"class","svelte-1oczjam"),f(P,"class","svelte-1oczjam"),f(I,"type","range"),f(I,"step",.25),f(I,"min",0),f(I,"max",5),f(I,"class","svelte-1oczjam"),f(A,"class","svelte-1oczjam"),f(k,"type","range"),f(k,"step",.25),f(k,"min",0),f(k,"max",5),f(k,"class","svelte-1oczjam"),f(j,"class","svelte-1oczjam"),f(H,"type","range"),f(H,"step",.25),f(H,"min",0),f(H,"max",5),f(H,"class","svelte-1oczjam"),f(r,"class","weight svelte-1oczjam"),f(i,"class","prop svelte-1oczjam"),f(l,"class","svelte-1oczjam"),f(t,"class","method-value svelte-1oczjam")},m(M,_){ve(M,t,_),a(t,l),a(l,o),a(o,n),a(l,s),a(l,i),Ee(h,i,null),a(i,m),a(i,r),a(r,P),a(P,d),a(P,z),a(P,g),a(r,p),a(r,I),ue(I,e[1]),a(r,T),a(r,A),a(A,D),a(A,J),a(A,R),a(r,S),a(r,k),ue(k,e[2]),a(r,X),a(r,j),a(j,G),a(j,w),a(j,Y),a(r,ie),a(r,H),ue(H,e[3]),y=!0,te||(K=[ne(I,"change",e[6]),ne(I,"input",e[6]),ne(k,"change",e[7]),ne(k,"input",e[7]),ne(H,"change",e[8]),ne(H,"input",e[8])],te=!0)},p(M,[_]){(!y||_&16)&&We(n,M[4]);const Q={};!v&&_&1&&(v=!0,Q.value=M[0],le(()=>v=!1)),h.$set(Q),(!y||_&2)&&We(z,M[1]),_&2&&ue(I,M[1]),(!y||_&4)&&We(J,M[2]),_&4&&ue(k,M[2]),(!y||_&8)&&We(w,M[3]),_&8&&ue(H,M[3])},i(M){y||(fe(h.$$.fragment,M),y=!0)},o(M){he(h.$$.fragment,M),y=!1},d(M){M&&c(t),Pe(h),te=!1,Ye(K)}}}function kl(e,t,l){let{legend:o}=t,{valueProp:n}=t,{valueWeightDist:s}=t,{valueWeightPop:i}=t,{valueWeightWiki:h}=t;function v(d){n=d,l(0,n)}function m(){s=Se(this.value),l(1,s)}function r(){i=Se(this.value),l(2,i)}function P(){h=Se(this.value),l(3,h)}return e.$$set=d=>{"legend"in d&&l(4,o=d.legend),"valueProp"in d&&l(0,n=d.valueProp),"valueWeightDist"in d&&l(1,s=d.valueWeightDist),"valueWeightPop"in d&&l(2,i=d.valueWeightPop),"valueWeightWiki"in d&&l(3,h=d.valueWeightWiki)},[n,s,i,h,o,v,m,r,P]}class Dl extends Ve{constructor(t){super(),Ce(this,t,kl,Wl,je,{legend:4,valueProp:0,valueWeightDist:1,valueWeightPop:2,valueWeightWiki:3})}}function Sl(e){let t,l,o,n,s,i,h,v,m,r,P,d,z,g,p,I,T,A,D,J,R;return{c(){t=b("div"),l=b("fieldset"),o=b("legend"),n=L(e[2]),s=U(),i=b("div"),h=b("p"),v=L("Score > "),m=L(e[1]),r=L(" is 1"),P=U(),d=b("input"),z=U(),g=b("p"),p=L("Score > "),I=L(e[0]),T=L(" is 0.75"),A=U(),D=b("input"),this.h()},l(S){t=E(S,"DIV",{class:!0});var k=W(t);l=E(k,"FIELDSET",{class:!0});var X=W(l);o=E(X,"LEGEND",{class:!0});var j=W(o);n=N(j,e[2]),j.forEach(c),s=O(X),i=E(X,"DIV",{class:!0});var G=W(i);h=E(G,"P",{class:!0});var w=W(h);v=N(w,"Score > "),m=N(w,e[1]),r=N(w," is 1"),w.forEach(c),P=O(G),d=E(G,"INPUT",{type:!0,step:!0,min:!0,max:!0,class:!0}),z=O(G),g=E(G,"P",{class:!0});var Y=W(g);p=N(Y,"Score > "),I=N(Y,e[0]),T=N(Y," is 0.75"),Y.forEach(c),A=O(G),D=E(G,"INPUT",{type:!0,step:!0,min:!0,max:!0,class:!0}),G.forEach(c),X.forEach(c),k.forEach(c),this.h()},h(){f(o,"class","svelte-6cdf0g"),f(h,"class","svelte-6cdf0g"),f(d,"type","range"),f(d,"step",.01),f(d,"min",.01),f(d,"max",.99),f(d,"class","svelte-6cdf0g"),f(g,"class","svelte-6cdf0g"),f(D,"type","range"),f(D,"step",.01),f(D,"min",.01),f(D,"max",.99),f(D,"class","svelte-6cdf0g"),f(i,"class","threshold svelte-6cdf0g"),f(l,"class","svelte-6cdf0g"),f(t,"class","method-threshold svelte-6cdf0g")},m(S,k){ve(S,t,k),a(t,l),a(l,o),a(o,n),a(l,s),a(l,i),a(i,h),a(h,v),a(h,m),a(h,r),a(i,P),a(i,d),ue(d,e[1]),a(i,z),a(i,g),a(g,p),a(g,I),a(g,T),a(i,A),a(i,D),ue(D,e[0]),J||(R=[ne(d,"change",e[3]),ne(d,"input",e[3]),ne(D,"change",e[4]),ne(D,"input",e[4])],J=!0)},p(S,[k]){k&4&&We(n,S[2]),k&2&&We(m,S[1]),k&2&&ue(d,S[1]),k&1&&We(I,S[0]),k&1&&ue(D,S[0])},i:Oe,o:Oe,d(S){S&&c(t),J=!1,Ye(R)}}}function wl(e,t,l){let{legend:o}=t,{thresholdLower:n}=t,{thresholdUpper:s}=t;function i(){s=Se(this.value),l(1,s)}function h(){n=Se(this.value),l(0,n)}return e.$$set=v=>{"legend"in v&&l(2,o=v.legend),"thresholdLower"in v&&l(0,n=v.thresholdLower),"thresholdUpper"in v&&l(1,s=v.thresholdUpper)},[n,s,o,i,h]}class Il extends Ve{constructor(t){super(),Ce(this,t,wl,Sl,je,{legend:2,thresholdLower:0,thresholdUpper:1})}}function tl(e,t,l){const o=e.slice();return o[35]=t[l].name,o[36]=t[l].phoneme,o}function sl(e){let t,l=e[35]+"",o;return{c(){t=b("option"),o=L(l),this.h()},l(n){t=E(n,"OPTION",{});var s=W(t);o=N(s,l),s.forEach(c),this.h()},h(){t.__value=e[36],t.value=t.__value},m(n,s){ve(n,t,s),a(t,o)},p:Oe,d(n){n&&c(t)}}}function al(e){let t,l,o;return l=new dl({props:{placeData:e[16],scaleTypePop:e[1],scaleTypeWiki:e[2],scaleTypeDist:e[3],scaleExpPop:e[4],scaleExpWiki:e[5],scaleExpDist:e[6],scaleBoundsPop:e[7],scaleBoundsWiki:e[8],scaleBoundsDist:e[9],valueWeightDist:e[10],valueWeightPop:e[11],valueWeightWiki:e[12],thresholdLower:e[13],thresholdUpper:e[14],valueProp:e[15]}}),{c(){t=b("div"),me(l.$$.fragment),this.h()},l(n){t=E(n,"DIV",{class:!0});var s=W(t);be(l.$$.fragment,s),s.forEach(c),this.h()},h(){f(t,"class","top-score svelte-158ghm7")},m(n,s){ve(n,t,s),Ee(l,t,null),o=!0},p(n,s){const i={};s[0]&65536&&(i.placeData=n[16]),s[0]&2&&(i.scaleTypePop=n[1]),s[0]&4&&(i.scaleTypeWiki=n[2]),s[0]&8&&(i.scaleTypeDist=n[3]),s[0]&16&&(i.scaleExpPop=n[4]),s[0]&32&&(i.scaleExpWiki=n[5]),s[0]&64&&(i.scaleExpDist=n[6]),s[0]&128&&(i.scaleBoundsPop=n[7]),s[0]&256&&(i.scaleBoundsWiki=n[8]),s[0]&512&&(i.scaleBoundsDist=n[9]),s[0]&1024&&(i.valueWeightDist=n[10]),s[0]&2048&&(i.valueWeightPop=n[11]),s[0]&4096&&(i.valueWeightWiki=n[12]),s[0]&8192&&(i.thresholdLower=n[13]),s[0]&16384&&(i.thresholdUpper=n[14]),s[0]&32768&&(i.valueProp=n[15]),l.$set(i)},i(n){o||(fe(l.$$.fragment,n),o=!0)},o(n){he(l.$$.fragment,n),o=!1},d(n){n&&c(t),Pe(l)}}}function Tl(e){let t,l,o=e[17].hed+"",n,s,i=e[17].dek+"",h,v,m,r,P,d,z,g,p,I,T,A,D,J,R,S,k,X,j,G,w,Y,ie,H,y,te,K,_e,Z,M,_,Q,pe,de,V=Xe,C=[];for(let u=0;u<V.length;u+=1)C[u]=sl(tl(e,V,u));function ce(u){e[19](u)}function ke(u){e[20](u)}function Ke(u){e[21](u)}let Te={legend:"Distance Scale (mi)"};e[3]!==void 0&&(Te.valueScale=e[3]),e[6]!==void 0&&(Te.valueExp=e[6]),e[9]!==void 0&&(Te.valueBounds=e[9]),d=new Qe({props:Te}),x.push(()=>ee(d,"valueScale",ce)),x.push(()=>ee(d,"valueExp",ke)),x.push(()=>ee(d,"valueBounds",Ke));function q(u){e[22](u)}function oe(u){e[23](u)}function se(u){e[24](u)}let Be={legend:"Population Scale (people)"};e[1]!==void 0&&(Be.valueScale=e[1]),e[4]!==void 0&&(Be.valueExp=e[4]),e[7]!==void 0&&(Be.valueBounds=e[7]),T=new Qe({props:Be}),x.push(()=>ee(T,"valueScale",q)),x.push(()=>ee(T,"valueExp",oe)),x.push(()=>ee(T,"valueBounds",se));function ze(u){e[25](u)}function Le(u){e[26](u)}function Ae(u){e[27](u)}let re={legend:"Wiki Scale (article length)"};e[2]!==void 0&&(re.valueScale=e[2]),e[5]!==void 0&&(re.valueExp=e[5]),e[8]!==void 0&&(re.valueBounds=e[8]),S=new Qe({props:re}),x.push(()=>ee(S,"valueScale",ze)),x.push(()=>ee(S,"valueExp",Le)),x.push(()=>ee(S,"valueBounds",Ae));function ye(u){e[28](u)}function Fe(u){e[29](u)}function Ge(u){e[30](u)}function He(u){e[31](u)}let we={legend:"Value"};e[15]!==void 0&&(we.valueProp=e[15]),e[10]!==void 0&&(we.valueWeightDist=e[10]),e[11]!==void 0&&(we.valueWeightPop=e[11]),e[12]!==void 0&&(we.valueWeightWiki=e[12]),w=new Dl({props:we}),x.push(()=>ee(w,"valueProp",ye)),x.push(()=>ee(w,"valueWeightDist",Fe)),x.push(()=>ee(w,"valueWeightPop",Ge)),x.push(()=>ee(w,"valueWeightWiki",He));function qe(u){e[32](u)}function Re(u){e[33](u)}let Ie={legend:"Opacity threshold"};e[13]!==void 0&&(Ie.thresholdLower=e[13]),e[14]!==void 0&&(Ie.thresholdUpper=e[14]),K=new Il({props:Ie}),x.push(()=>ee(K,"thresholdLower",qe)),x.push(()=>ee(K,"thresholdUpper",Re));let F=e[16]&&al(e);return{c(){t=b("div"),l=b("h1"),n=U(),s=b("p"),h=U(),v=b("article"),m=b("section"),r=b("select");for(let u=0;u<C.length;u+=1)C[u].c();P=U(),me(d.$$.fragment),I=U(),me(T.$$.fragment),R=U(),me(S.$$.fragment),G=U(),me(w.$$.fragment),te=U(),me(K.$$.fragment),M=U(),_=b("section"),F&&F.c(),this.h()},l(u){t=E(u,"DIV",{id:!0,class:!0});var B=W(t);l=E(B,"H1",{});var ge=W(l);ge.forEach(c),n=O(B),s=E(B,"P",{});var Ne=W(s);Ne.forEach(c),B.forEach(c),h=O(u),v=E(u,"ARTICLE",{class:!0});var De=W(v);m=E(De,"SECTION",{id:!0,class:!0});var $=W(m);r=E($,"SELECT",{});var Me=W(r);for(let Ue=0;Ue<C.length;Ue+=1)C[Ue].l(Me);Me.forEach(c),P=O($),be(d.$$.fragment,$),I=O($),be(T.$$.fragment,$),R=O($),be(S.$$.fragment,$),G=O($),be(w.$$.fragment,$),te=O($),be(K.$$.fragment,$),$.forEach(c),M=O(De),_=E(De,"SECTION",{id:!0,class:!0});var ae=W(_);F&&F.l(ae),ae.forEach(c),De.forEach(c),this.h()},h(){f(t,"id","title"),f(t,"class","svelte-158ghm7"),e[0]===void 0&&ul(()=>e[18].call(r)),f(m,"id","ui"),f(m,"class","svelte-158ghm7"),f(_,"id","maps"),f(_,"class","svelte-158ghm7"),f(v,"class","svelte-158ghm7")},m(u,B){ve(u,t,B),a(t,l),l.innerHTML=o,a(t,n),a(t,s),s.innerHTML=i,ve(u,h,B),ve(u,v,B),a(v,m),a(m,r);for(let ge=0;ge<C.length;ge+=1)C[ge].m(r,null);Je(r,e[0]),a(m,P),Ee(d,m,null),a(m,I),Ee(T,m,null),a(m,R),Ee(S,m,null),a(m,G),Ee(w,m,null),a(m,te),Ee(K,m,null),a(v,M),a(v,_),F&&F.m(_,null),Q=!0,pe||(de=ne(r,"change",e[18]),pe=!0)},p(u,B){if(B&0){V=Xe;let ae;for(ae=0;ae<V.length;ae+=1){const Ue=tl(u,V,ae);C[ae]?C[ae].p(Ue,B):(C[ae]=sl(Ue),C[ae].c(),C[ae].m(r,null))}for(;ae<C.length;ae+=1)C[ae].d(1);C.length=V.length}B[0]&1&&Je(r,u[0]);const ge={};!z&&B[0]&8&&(z=!0,ge.valueScale=u[3],le(()=>z=!1)),!g&&B[0]&64&&(g=!0,ge.valueExp=u[6],le(()=>g=!1)),!p&&B[0]&512&&(p=!0,ge.valueBounds=u[9],le(()=>p=!1)),d.$set(ge);const Ne={};!A&&B[0]&2&&(A=!0,Ne.valueScale=u[1],le(()=>A=!1)),!D&&B[0]&16&&(D=!0,Ne.valueExp=u[4],le(()=>D=!1)),!J&&B[0]&128&&(J=!0,Ne.valueBounds=u[7],le(()=>J=!1)),T.$set(Ne);const De={};!k&&B[0]&4&&(k=!0,De.valueScale=u[2],le(()=>k=!1)),!X&&B[0]&32&&(X=!0,De.valueExp=u[5],le(()=>X=!1)),!j&&B[0]&256&&(j=!0,De.valueBounds=u[8],le(()=>j=!1)),S.$set(De);const $={};!Y&&B[0]&32768&&(Y=!0,$.valueProp=u[15],le(()=>Y=!1)),!ie&&B[0]&1024&&(ie=!0,$.valueWeightDist=u[10],le(()=>ie=!1)),!H&&B[0]&2048&&(H=!0,$.valueWeightPop=u[11],le(()=>H=!1)),!y&&B[0]&4096&&(y=!0,$.valueWeightWiki=u[12],le(()=>y=!1)),w.$set($);const Me={};!_e&&B[0]&8192&&(_e=!0,Me.thresholdLower=u[13],le(()=>_e=!1)),!Z&&B[0]&16384&&(Z=!0,Me.thresholdUpper=u[14],le(()=>Z=!1)),K.$set(Me),u[16]?F?(F.p(u,B),B[0]&65536&&fe(F,1)):(F=al(u),F.c(),fe(F,1),F.m(_,null)):F&&(fl(),he(F,1,1,()=>{F=null}),hl())},i(u){Q||(fe(d.$$.fragment,u),fe(T.$$.fragment,u),fe(S.$$.fragment,u),fe(w.$$.fragment,u),fe(K.$$.fragment,u),fe(F),Q=!0)},o(u){he(d.$$.fragment,u),he(T.$$.fragment,u),he(S.$$.fragment,u),he(w.$$.fragment,u),he(K.$$.fragment,u),he(F),Q=!1},d(u){u&&c(t),u&&c(h),u&&c(v),il(C,u),Pe(d),Pe(T),Pe(S),Pe(w),Pe(K),F&&F.d(),pe=!1,de()}}}function Bl(e,t,l){const o=$e("copy");$e("data");let n="scalePow",s="scalePow",i="scaleLog",h="0.67",v="0.67",m="1",r=[0,49e4],P=[0,87500],d=[50,200],z=2,g=1,p=1,I=.5,T=.75,A="share",D=Xe[0].phoneme,J;function R(){D=ol(this),l(0,D)}function S(_){i=_,l(3,i)}function k(_){m=_,l(6,m)}function X(_){d=_,l(9,d)}function j(_){n=_,l(1,n)}function G(_){h=_,l(4,h)}function w(_){r=_,l(7,r)}function Y(_){s=_,l(2,s)}function ie(_){v=_,l(5,v)}function H(_){P=_,l(8,P)}function y(_){A=_,l(15,A)}function te(_){z=_,l(10,z)}function K(_){g=_,l(11,g)}function _e(_){p=_,l(12,p)}function Z(_){I=_,l(13,I)}function M(_){T=_,l(14,T)}return e.$$.update=()=>{e.$$.dirty[0]&1&&(async()=>l(16,J=await _l(`${gl}/assets/places/${D}.csv?2023-03-09-14:25`)))()},[D,n,s,i,h,v,m,r,P,d,z,g,p,I,T,A,J,o,R,S,k,X,j,G,w,Y,ie,H,y,te,K,_e,Z,M]}class Ll extends Ve{constructor(t){super(),Ce(this,t,Bl,Tl,je,{},null,[-1,-1])}}const Nl="Data and Methods",Ml="An interactive explainer for how we made Same Name Places",Ul="Data &amp; Methods",Ol='An interactive explainer for how we made <a href="https://pudding.cool">Same Name Places</a>',nl={title:Nl,description:Ml,hed:Ul,dek:Ol};function Vl(e){let t,l,o,n;return t=new pl({props:{title:e[0],description:e[1],url:e[2],keywords:e[3]}}),o=new Ll({}),{c(){me(t.$$.fragment),l=U(),me(o.$$.fragment)},l(s){be(t.$$.fragment,s),l=O(s),be(o.$$.fragment,s)},m(s,i){Ee(t,s,i),ve(s,l,i),Ee(o,s,i),n=!0},p:Oe,i(s){n||(fe(t.$$.fragment,s),fe(o.$$.fragment,s),n=!0)},o(s){he(t.$$.fragment,s),he(o.$$.fragment,s),n=!1},d(s){Pe(t,s),s&&c(l),Pe(o,s)}}}function Cl(e){cl();const{title:t,description:l,url:o,keywords:n}=nl;return vl("copy",nl),[t,l,o,n]}class Fl extends Ve{constructor(t){super(),Ce(this,t,Cl,Vl,je,{})}}export{Fl as default};