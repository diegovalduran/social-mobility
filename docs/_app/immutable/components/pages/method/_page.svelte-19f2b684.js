import{S as Ne,i as Ue,s as Ve,k as m,a as M,l as b,m as W,c as B,h as p,n as o,D as Ke,b as Ee,E as a,C as Oe,G as sl,q as I,r as T,u as ke,F as re,v as x,af as ee,x as ce,y as ge,a4 as al,z as me,ag as Qe,ad as fe,ah as le,ae as we,f as oe,t as he,A as be,H as qe,ai as nl,g as il,d as ul,aa as Xe,o as ol,ab as rl}from"../../../chunks/index-9133467c.js";import{S as fl,o as ll,b as hl,M as vl,c as _l,d as dl,e as pl}from"../../../chunks/version-fd841704.js";import{b as cl}from"../../../chunks/paths-eb28c9cb.js";import"../../../chunks/transform-96ff9c66.js";function Ye(e,t,l){const f=e.slice();return f[12]=t[l],f}function Ze(e){let t,l;return{c(){t=m("div"),l=I(e[1]),this.h()},l(f){t=b(f,"DIV",{class:!0,id:!0});var i=W(t);l=T(i,e[1]),i.forEach(p),this.h()},h(){o(t,"class","legend svelte-13oh5yk"),o(t,"id","legend-"+e[6])},m(f,i){Ee(f,t,i),a(t,l)},p(f,i){i&2&&ke(l,f[1])},d(f){f&&p(t)}}}function $e(e){let t,l,f,i,s,n,h=(e[12].label||e[12].value)+"",_,P,u,g,c,z;return{c(){t=m("div"),l=m("input"),s=M(),n=m("label"),_=I(h),g=M(),this.h()},l(v){t=b(v,"DIV",{class:!0});var d=W(t);l=b(d,"INPUT",{type:!0,id:!0,name:!0,class:!0}),s=B(d),n=b(d,"LABEL",{class:!0,for:!0});var S=W(n);_=T(S,h),S.forEach(p),g=B(d),d.forEach(p),this.h()},h(){o(l,"type","radio"),o(l,"id",f=`${e[6]}-${e[12].slug}`),o(l,"name","name-"+e[6]),o(l,"class","sr-only svelte-13oh5yk"),l.__value=i=e[12].value,l.value=l.__value,l.disabled=e[3],e[10][0].push(l),o(n,"class",P="option "+e[2]+" svelte-13oh5yk"),o(n,"for",u=`${e[6]}-${e[12].slug}`),o(t,"class","option svelte-13oh5yk")},m(v,d){Ee(v,t,d),a(t,l),l.checked=l.__value===e[0],a(t,s),a(t,n),a(n,_),a(t,g),c||(z=re(l,"change",e[9]),c=!0)},p(v,d){d&32&&f!==(f=`${v[6]}-${v[12].slug}`)&&o(l,"id",f),d&32&&i!==(i=v[12].value)&&(l.__value=i,l.value=l.__value),d&8&&(l.disabled=v[3]),d&1&&(l.checked=l.__value===v[0]),d&32&&h!==(h=(v[12].label||v[12].value)+"")&&ke(_,h),d&4&&P!==(P="option "+v[2]+" svelte-13oh5yk")&&o(n,"class",P),d&32&&u!==(u=`${v[6]}-${v[12].slug}`)&&o(n,"for",u)},d(v){v&&p(t),e[10][0].splice(e[10][0].indexOf(l),1),c=!1,z()}}}function gl(e){let t,l,f,i,s=e[1]&&Ze(e),n=e[5],h=[];for(let _=0;_<n.length;_+=1)h[_]=$e(Ye(e,n,_));return{c(){t=m("div"),l=m("div"),s&&s.c(),f=M(),i=m("div");for(let _=0;_<h.length;_+=1)h[_].c();this.h()},l(_){t=b(_,"DIV",{class:!0});var P=W(t);l=b(P,"DIV",{id:!0,class:!0,role:!0,"aria-labelledby":!0});var u=W(l);s&&s.l(u),f=B(u),i=b(u,"DIV",{class:!0});var g=W(i);for(let c=0;c<h.length;c+=1)h[c].l(g);g.forEach(p),u.forEach(p),P.forEach(p),this.h()},h(){o(i,"class","options svelte-13oh5yk"),o(l,"id",`group-${e[6]}`),o(l,"class","group svelte-13oh5yk"),o(l,"role","radiogroup"),o(l,"aria-labelledby",`label-${e[6]}`),Ke(l,"is-top",e[4]),o(t,"class","button-set svelte-13oh5yk")},m(_,P){Ee(_,t,P),a(t,l),s&&s.m(l,null),a(l,f),a(l,i);for(let u=0;u<h.length;u+=1)h[u].m(i,null)},p(_,[P]){if(_[1]?s?s.p(_,P):(s=Ze(_),s.c(),s.m(l,f)):s&&(s.d(1),s=null),P&109){n=_[5];let u;for(u=0;u<n.length;u+=1){const g=Ye(_,n,u);h[u]?h[u].p(g,P):(h[u]=$e(g),h[u].c(),h[u].m(i,null))}for(;u<h.length;u+=1)h[u].d(1);h.length=n.length}P&16&&Ke(l,"is-top",_[4])},i:Oe,o:Oe,d(_){_&&p(t),s&&s.d(),sl(h,_)}}}function ml(e,t,l){let f,i,{options:s=[]}=t,{legend:n=""}=t,{legendPosition:h="top"}=t,{labelClass:_=""}=t,{disabled:P=!1}=t,{value:u=s.length?s[0].value:""}=t;const g=`legend-${Math.floor(Math.random()*1e6)}`,c=(d="")=>`${d}`.toLowerCase().replace(/\W/g,""),z=[[]];function v(){u=this.__value,l(0,u)}return e.$$set=d=>{"options"in d&&l(7,s=d.options),"legend"in d&&l(1,n=d.legend),"legendPosition"in d&&l(8,h=d.legendPosition),"labelClass"in d&&l(2,_=d.labelClass),"disabled"in d&&l(3,P=d.disabled),"value"in d&&l(0,u=d.value)},e.$$.update=()=>{e.$$.dirty&128&&l(5,f=s.map(d=>({...d,val:d.value,slug:c(d.value)}))),e.$$.dirty&256&&l(4,i=h==="top")},[u,n,_,P,i,f,g,s,h,v,z]}class tl extends Ne{constructor(t){super(),Ue(this,t,ml,gl,Ve,{options:7,legend:1,legendPosition:8,labelClass:2,disabled:3,value:0})}}function bl(e){let t,l,f,i,s,n,h,_,P,u,g,c,z,v,d,S,G,F,k,Y,J,O,D,V,L,H,j,Z,y,K,q,te,ve,pe,A,w,U,X,$,ne,C,ie,_e,E;function Te(Q){e[4](Q)}let Me={options:[{value:"scalePow"},{value:"scaleLog"}]};return e[0]!==void 0&&(Me.value=e[0]),h=new tl({props:Me}),x.push(()=>ee(h,"value",Te)),{c(){t=m("div"),l=m("fieldset"),f=m("legend"),i=I(e[3]),s=M(),n=m("div"),ce(h.$$.fragment),P=M(),u=m("div"),g=m("p"),c=I("Exponent"),z=M(),v=m("select"),d=m("option"),S=I("0.1"),G=m("option"),F=I("0.25"),k=m("option"),Y=I("0.5"),J=m("option"),O=I("0.67"),D=m("option"),V=I("0.75"),L=m("option"),H=I("1"),j=m("option"),Z=I("2"),K=M(),q=m("div"),te=m("p"),ve=I("Min"),pe=M(),A=m("input"),w=M(),U=m("div"),X=m("p"),$=I("Max"),ne=M(),C=m("input"),this.h()},l(Q){t=b(Q,"DIV",{class:!0});var se=W(t);l=b(se,"FIELDSET",{class:!0});var ue=W(l);f=b(ue,"LEGEND",{class:!0});var je=W(f);i=T(je,e[3]),je.forEach(p),s=B(ue),n=b(ue,"DIV",{class:!0});var Ce=W(n);ge(h.$$.fragment,Ce),Ce.forEach(p),P=B(ue),u=b(ue,"DIV",{class:!0});var De=W(u);g=b(De,"P",{class:!0});var ze=W(g);c=T(ze,"Exponent"),ze.forEach(p),z=B(De),v=b(De,"SELECT",{class:!0});var Pe=W(v);d=b(Pe,"OPTION",{});var Ae=W(d);S=T(Ae,"0.1"),Ae.forEach(p),G=b(Pe,"OPTION",{});var Ge=W(G);F=T(Ge,"0.25"),Ge.forEach(p),k=b(Pe,"OPTION",{});var Ie=W(k);Y=T(Ie,"0.5"),Ie.forEach(p),J=b(Pe,"OPTION",{});var Fe=W(J);O=T(Fe,"0.67"),Fe.forEach(p),D=b(Pe,"OPTION",{});var He=W(D);V=T(He,"0.75"),He.forEach(p),L=b(Pe,"OPTION",{});var Be=W(L);H=T(Be,"1"),Be.forEach(p),j=b(Pe,"OPTION",{});var R=W(j);Z=T(R,"2"),R.forEach(p),Pe.forEach(p),De.forEach(p),K=B(ue),q=b(ue,"DIV",{class:!0});var r=W(q);te=b(r,"P",{class:!0});var N=W(te);ve=T(N,"Min"),N.forEach(p),pe=B(r),A=b(r,"INPUT",{type:!0,class:!0}),r.forEach(p),w=B(ue),U=b(ue,"DIV",{class:!0});var de=W(U);X=b(de,"P",{class:!0});var Se=W(X);$=T(Se,"Max"),Se.forEach(p),ne=B(de),C=b(de,"INPUT",{type:!0,class:!0}),de.forEach(p),ue.forEach(p),se.forEach(p),this.h()},h(){o(f,"class","svelte-fb5b91"),o(n,"class","scale svelte-fb5b91"),o(g,"class","svelte-fb5b91"),d.__value="0.1",d.value=d.__value,G.__value="0.25",G.value=G.__value,k.__value="0.5",k.value=k.__value,J.__value="0.67",J.value=J.__value,D.__value="0.75",D.value=D.__value,L.__value="1",L.value=L.__value,j.__value="2",j.value=j.__value,v.disabled=y=e[0]==="scaleLog",o(v,"class","svelte-fb5b91"),e[1]===void 0&&al(()=>e[5].call(v)),o(u,"class","exponent svelte-fb5b91"),o(te,"class","svelte-fb5b91"),o(A,"type","number"),o(A,"class","svelte-fb5b91"),o(q,"class","bound svelte-fb5b91"),o(X,"class","svelte-fb5b91"),o(C,"type","number"),o(C,"class","svelte-fb5b91"),o(U,"class","bound svelte-fb5b91"),o(l,"class","svelte-fb5b91"),o(t,"class","method-scale svelte-fb5b91")},m(Q,se){Ee(Q,t,se),a(t,l),a(l,f),a(f,i),a(l,s),a(l,n),me(h,n,null),a(l,P),a(l,u),a(u,g),a(g,c),a(u,z),a(u,v),a(v,d),a(d,S),a(v,G),a(G,F),a(v,k),a(k,Y),a(v,J),a(J,O),a(v,D),a(D,V),a(v,L),a(L,H),a(v,j),a(j,Z),Qe(v,e[1]),a(l,K),a(l,q),a(q,te),a(te,ve),a(q,pe),a(q,A),fe(A,e[2][0]),a(l,w),a(l,U),a(U,X),a(X,$),a(U,ne),a(U,C),fe(C,e[2][1]),ie=!0,_e||(E=[re(v,"change",e[5]),re(A,"input",e[6]),re(C,"input",e[7])],_e=!0)},p(Q,[se]){(!ie||se&8)&&ke(i,Q[3]);const ue={};!_&&se&1&&(_=!0,ue.value=Q[0],le(()=>_=!1)),h.$set(ue),(!ie||se&1&&y!==(y=Q[0]==="scaleLog"))&&(v.disabled=y),se&2&&Qe(v,Q[1]),se&4&&we(A.value)!==Q[2][0]&&fe(A,Q[2][0]),se&4&&we(C.value)!==Q[2][1]&&fe(C,Q[2][1])},i(Q){ie||(oe(h.$$.fragment,Q),ie=!0)},o(Q){he(h.$$.fragment,Q),ie=!1},d(Q){Q&&p(t),be(h),_e=!1,qe(E)}}}function El(e,t,l){let{legend:f}=t,{valueScale:i}=t,{valueExp:s}=t,{valueBounds:n}=t;function h(g){i=g,l(0,i)}function _(){s=nl(this),l(1,s)}function P(){n[0]=we(this.value),l(2,n)}function u(){n[1]=we(this.value),l(2,n)}return e.$$set=g=>{"legend"in g&&l(3,f=g.legend),"valueScale"in g&&l(0,i=g.valueScale),"valueExp"in g&&l(1,s=g.valueExp),"valueBounds"in g&&l(2,n=g.valueBounds)},e.$$.update=()=>{e.$$.dirty&3},[i,s,n,f,h,_,P,u]}class ye extends Ne{constructor(t){super(),Ue(this,t,El,bl,Ve,{legend:3,valueScale:0,valueExp:1,valueBounds:2})}}function Pl(e){let t,l,f,i,s,n,h,_,P,u,g,c,z,v,d,S,G,F,k,Y,J,O,D,V,L,H,j,Z,y,K,q,te,ve;function pe(w){e[5](w)}let A={options:[{value:"share"},{value:"score"}]};return e[0]!==void 0&&(A.value=e[0]),h=new tl({props:A}),x.push(()=>ee(h,"value",pe)),{c(){t=m("div"),l=m("fieldset"),f=m("legend"),i=I(e[4]),s=M(),n=m("div"),ce(h.$$.fragment),P=M(),u=m("div"),g=m("p"),c=I("Distance (weight: "),z=I(e[1]),v=I(")"),d=M(),S=m("input"),G=M(),F=m("p"),k=I("Population (weight: "),Y=I(e[2]),J=I(")"),O=M(),D=m("input"),V=M(),L=m("p"),H=I("Wiki Length (weight: "),j=I(e[3]),Z=I(")"),y=M(),K=m("input"),this.h()},l(w){t=b(w,"DIV",{class:!0});var U=W(t);l=b(U,"FIELDSET",{class:!0});var X=W(l);f=b(X,"LEGEND",{class:!0});var $=W(f);i=T($,e[4]),$.forEach(p),s=B(X),n=b(X,"DIV",{class:!0});var ne=W(n);ge(h.$$.fragment,ne),P=B(ne),u=b(ne,"DIV",{class:!0});var C=W(u);g=b(C,"P",{class:!0});var ie=W(g);c=T(ie,"Distance (weight: "),z=T(ie,e[1]),v=T(ie,")"),ie.forEach(p),d=B(C),S=b(C,"INPUT",{type:!0,step:!0,min:!0,max:!0,class:!0}),G=B(C),F=b(C,"P",{class:!0});var _e=W(F);k=T(_e,"Population (weight: "),Y=T(_e,e[2]),J=T(_e,")"),_e.forEach(p),O=B(C),D=b(C,"INPUT",{type:!0,step:!0,min:!0,max:!0,class:!0}),V=B(C),L=b(C,"P",{class:!0});var E=W(L);H=T(E,"Wiki Length (weight: "),j=T(E,e[3]),Z=T(E,")"),E.forEach(p),y=B(C),K=b(C,"INPUT",{type:!0,step:!0,min:!0,max:!0,class:!0}),C.forEach(p),ne.forEach(p),X.forEach(p),U.forEach(p),this.h()},h(){o(f,"class","svelte-1oczjam"),o(g,"class","svelte-1oczjam"),o(S,"type","range"),o(S,"step",.25),o(S,"min",0),o(S,"max",5),o(S,"class","svelte-1oczjam"),o(F,"class","svelte-1oczjam"),o(D,"type","range"),o(D,"step",.25),o(D,"min",0),o(D,"max",5),o(D,"class","svelte-1oczjam"),o(L,"class","svelte-1oczjam"),o(K,"type","range"),o(K,"step",.25),o(K,"min",0),o(K,"max",5),o(K,"class","svelte-1oczjam"),o(u,"class","weight svelte-1oczjam"),o(n,"class","prop svelte-1oczjam"),o(l,"class","svelte-1oczjam"),o(t,"class","method-value svelte-1oczjam")},m(w,U){Ee(w,t,U),a(t,l),a(l,f),a(f,i),a(l,s),a(l,n),me(h,n,null),a(n,P),a(n,u),a(u,g),a(g,c),a(g,z),a(g,v),a(u,d),a(u,S),fe(S,e[1]),a(u,G),a(u,F),a(F,k),a(F,Y),a(F,J),a(u,O),a(u,D),fe(D,e[2]),a(u,V),a(u,L),a(L,H),a(L,j),a(L,Z),a(u,y),a(u,K),fe(K,e[3]),q=!0,te||(ve=[re(S,"change",e[6]),re(S,"input",e[6]),re(D,"change",e[7]),re(D,"input",e[7]),re(K,"change",e[8]),re(K,"input",e[8])],te=!0)},p(w,[U]){(!q||U&16)&&ke(i,w[4]);const X={};!_&&U&1&&(_=!0,X.value=w[0],le(()=>_=!1)),h.$set(X),(!q||U&2)&&ke(z,w[1]),U&2&&fe(S,w[1]),(!q||U&4)&&ke(Y,w[2]),U&4&&fe(D,w[2]),(!q||U&8)&&ke(j,w[3]),U&8&&fe(K,w[3])},i(w){q||(oe(h.$$.fragment,w),q=!0)},o(w){he(h.$$.fragment,w),q=!1},d(w){w&&p(t),be(h),te=!1,qe(ve)}}}function Wl(e,t,l){let{legend:f}=t,{valueProp:i}=t,{valueWeightDist:s}=t,{valueWeightPop:n}=t,{valueWeightWiki:h}=t;function _(c){i=c,l(0,i)}function P(){s=we(this.value),l(1,s)}function u(){n=we(this.value),l(2,n)}function g(){h=we(this.value),l(3,h)}return e.$$set=c=>{"legend"in c&&l(4,f=c.legend),"valueProp"in c&&l(0,i=c.valueProp),"valueWeightDist"in c&&l(1,s=c.valueWeightDist),"valueWeightPop"in c&&l(2,n=c.valueWeightPop),"valueWeightWiki"in c&&l(3,h=c.valueWeightWiki)},[i,s,n,h,f,_,P,u,g]}class kl extends Ne{constructor(t){super(),Ue(this,t,Wl,Pl,Ve,{legend:4,valueProp:0,valueWeightDist:1,valueWeightPop:2,valueWeightWiki:3})}}function Dl(e){let t,l,f,i,s,n,h,_,P,u,g,c,z,v,d,S,G,F,k,Y,J;return{c(){t=m("div"),l=m("fieldset"),f=m("legend"),i=I(e[2]),s=M(),n=m("div"),h=m("p"),_=I("Score > "),P=I(e[1]),u=I(" is 1"),g=M(),c=m("input"),z=M(),v=m("p"),d=I("Score > "),S=I(e[0]),G=I(" is 0.75"),F=M(),k=m("input"),this.h()},l(O){t=b(O,"DIV",{class:!0});var D=W(t);l=b(D,"FIELDSET",{class:!0});var V=W(l);f=b(V,"LEGEND",{class:!0});var L=W(f);i=T(L,e[2]),L.forEach(p),s=B(V),n=b(V,"DIV",{class:!0});var H=W(n);h=b(H,"P",{class:!0});var j=W(h);_=T(j,"Score > "),P=T(j,e[1]),u=T(j," is 1"),j.forEach(p),g=B(H),c=b(H,"INPUT",{type:!0,step:!0,min:!0,max:!0,class:!0}),z=B(H),v=b(H,"P",{class:!0});var Z=W(v);d=T(Z,"Score > "),S=T(Z,e[0]),G=T(Z," is 0.75"),Z.forEach(p),F=B(H),k=b(H,"INPUT",{type:!0,step:!0,min:!0,max:!0,class:!0}),H.forEach(p),V.forEach(p),D.forEach(p),this.h()},h(){o(f,"class","svelte-6cdf0g"),o(h,"class","svelte-6cdf0g"),o(c,"type","range"),o(c,"step",.01),o(c,"min",.01),o(c,"max",.99),o(c,"class","svelte-6cdf0g"),o(v,"class","svelte-6cdf0g"),o(k,"type","range"),o(k,"step",.01),o(k,"min",.01),o(k,"max",.99),o(k,"class","svelte-6cdf0g"),o(n,"class","threshold svelte-6cdf0g"),o(l,"class","svelte-6cdf0g"),o(t,"class","method-threshold svelte-6cdf0g")},m(O,D){Ee(O,t,D),a(t,l),a(l,f),a(f,i),a(l,s),a(l,n),a(n,h),a(h,_),a(h,P),a(h,u),a(n,g),a(n,c),fe(c,e[1]),a(n,z),a(n,v),a(v,d),a(v,S),a(v,G),a(n,F),a(n,k),fe(k,e[0]),Y||(J=[re(c,"change",e[3]),re(c,"input",e[3]),re(k,"change",e[4]),re(k,"input",e[4])],Y=!0)},p(O,[D]){D&4&&ke(i,O[2]),D&2&&ke(P,O[1]),D&2&&fe(c,O[1]),D&1&&ke(S,O[0]),D&1&&fe(k,O[0])},i:Oe,o:Oe,d(O){O&&p(t),Y=!1,qe(J)}}}function Sl(e,t,l){let{legend:f}=t,{thresholdLower:i}=t,{thresholdUpper:s}=t;function n(){s=we(this.value),l(1,s)}function h(){i=we(this.value),l(0,i)}return e.$$set=_=>{"legend"in _&&l(2,f=_.legend),"thresholdLower"in _&&l(0,i=_.thresholdLower),"thresholdUpper"in _&&l(1,s=_.thresholdUpper)},[i,s,f,n,h]}class wl extends Ne{constructor(t){super(),Ue(this,t,Sl,Dl,Ve,{legend:2,thresholdLower:0,thresholdUpper:1})}}function xe(e){let t,l,f;return l=new vl({props:{counties:e[16],states:e[17],countiesMesh:e[18],statesMesh:e[19],nationMesh:e[20],placeData:e[15],placeName:e[21],scaleTypePop:e[0],scaleTypeWiki:e[1],scaleTypeDist:e[2],scaleExpPop:e[3],scaleExpWiki:e[4],scaleExpDist:e[5],scaleBoundsPop:e[6],scaleBoundsWiki:e[7],scaleBoundsDist:e[8],valueWeightDist:e[9],valueWeightPop:e[10],valueWeightWiki:e[11],thresholdLower:e[12],thresholdUpper:e[13],valueProp:e[14]}}),{c(){t=m("div"),ce(l.$$.fragment),this.h()},l(i){t=b(i,"DIV",{class:!0});var s=W(t);ge(l.$$.fragment,s),s.forEach(p),this.h()},h(){o(t,"class","top-score svelte-1m48kjr")},m(i,s){Ee(i,t,s),me(l,t,null),f=!0},p(i,s){const n={};s[0]&65536&&(n.counties=i[16]),s[0]&131072&&(n.states=i[17]),s[0]&262144&&(n.countiesMesh=i[18]),s[0]&524288&&(n.statesMesh=i[19]),s[0]&1048576&&(n.nationMesh=i[20]),s[0]&32768&&(n.placeData=i[15]),s[0]&2097152&&(n.placeName=i[21]),s[0]&1&&(n.scaleTypePop=i[0]),s[0]&2&&(n.scaleTypeWiki=i[1]),s[0]&4&&(n.scaleTypeDist=i[2]),s[0]&8&&(n.scaleExpPop=i[3]),s[0]&16&&(n.scaleExpWiki=i[4]),s[0]&32&&(n.scaleExpDist=i[5]),s[0]&64&&(n.scaleBoundsPop=i[6]),s[0]&128&&(n.scaleBoundsWiki=i[7]),s[0]&256&&(n.scaleBoundsDist=i[8]),s[0]&512&&(n.valueWeightDist=i[9]),s[0]&1024&&(n.valueWeightPop=i[10]),s[0]&2048&&(n.valueWeightWiki=i[11]),s[0]&4096&&(n.thresholdLower=i[12]),s[0]&8192&&(n.thresholdUpper=i[13]),s[0]&16384&&(n.valueProp=i[14]),l.$set(n)},i(i){f||(oe(l.$$.fragment,i),f=!0)},o(i){he(l.$$.fragment,i),f=!1},d(i){i&&p(t),be(l)}}}function Il(e){let t,l,f,i=e[22].hed+"",s,n,h=e[22].dek+"",_,P,u,g,c,z,v,d,S,G,F,k,Y,J,O,D,V,L,H,j,Z,y,K,q,te,ve,pe,A,w,U,X,$,ne;c=new fl({props:{placeholder:"Search...",options:ll}}),c.$on("change",e[25]);function C(r){e[26](r)}function ie(r){e[27](r)}function _e(r){e[28](r)}let E={legend:"Distance Scale (mi)"};e[2]!==void 0&&(E.valueScale=e[2]),e[5]!==void 0&&(E.valueExp=e[5]),e[8]!==void 0&&(E.valueBounds=e[8]),v=new ye({props:E}),x.push(()=>ee(v,"valueScale",C)),x.push(()=>ee(v,"valueExp",ie)),x.push(()=>ee(v,"valueBounds",_e));function Te(r){e[29](r)}function Me(r){e[30](r)}function Q(r){e[31](r)}let se={legend:"Population Scale (people)"};e[0]!==void 0&&(se.valueScale=e[0]),e[3]!==void 0&&(se.valueExp=e[3]),e[6]!==void 0&&(se.valueBounds=e[6]),k=new ye({props:se}),x.push(()=>ee(k,"valueScale",Te)),x.push(()=>ee(k,"valueExp",Me)),x.push(()=>ee(k,"valueBounds",Q));function ue(r){e[32](r)}function je(r){e[33](r)}function Ce(r){e[34](r)}let De={legend:"Wiki Scale (article length)"};e[1]!==void 0&&(De.valueScale=e[1]),e[4]!==void 0&&(De.valueExp=e[4]),e[7]!==void 0&&(De.valueBounds=e[7]),V=new ye({props:De}),x.push(()=>ee(V,"valueScale",ue)),x.push(()=>ee(V,"valueExp",je)),x.push(()=>ee(V,"valueBounds",Ce));function ze(r){e[35](r)}function Pe(r){e[36](r)}function Ae(r){e[37](r)}function Ge(r){e[38](r)}let Ie={legend:"Value"};e[14]!==void 0&&(Ie.valueProp=e[14]),e[9]!==void 0&&(Ie.valueWeightDist=e[9]),e[10]!==void 0&&(Ie.valueWeightPop=e[10]),e[11]!==void 0&&(Ie.valueWeightWiki=e[11]),y=new kl({props:Ie}),x.push(()=>ee(y,"valueProp",ze)),x.push(()=>ee(y,"valueWeightDist",Pe)),x.push(()=>ee(y,"valueWeightPop",Ae)),x.push(()=>ee(y,"valueWeightWiki",Ge));function Fe(r){e[39](r)}function He(r){e[40](r)}let Be={legend:"Opacity threshold"};e[12]!==void 0&&(Be.thresholdLower=e[12]),e[13]!==void 0&&(Be.thresholdUpper=e[13]),A=new wl({props:Be}),x.push(()=>ee(A,"thresholdLower",Fe)),x.push(()=>ee(A,"thresholdUpper",He));let R=e[15]&&xe(e);return{c(){t=m("div"),l=m("h1"),f=m("strong"),s=M(),n=m("p"),_=M(),P=m("article"),u=m("section"),g=m("div"),ce(c.$$.fragment),z=M(),ce(v.$$.fragment),F=M(),ce(k.$$.fragment),D=M(),ce(V.$$.fragment),Z=M(),ce(y.$$.fragment),pe=M(),ce(A.$$.fragment),X=M(),$=m("section"),R&&R.c(),this.h()},l(r){t=b(r,"DIV",{id:!0,class:!0});var N=W(t);l=b(N,"H1",{});var de=W(l);f=b(de,"STRONG",{});var Se=W(f);Se.forEach(p),de.forEach(p),s=B(N),n=b(N,"P",{});var Le=W(n);Le.forEach(p),N.forEach(p),_=B(r),P=b(r,"ARTICLE",{class:!0});var We=W(P);u=b(We,"SECTION",{id:!0,class:!0});var ae=W(u);g=b(ae,"DIV",{class:!0});var Re=W(g);ge(c.$$.fragment,Re),Re.forEach(p),z=B(ae),ge(v.$$.fragment,ae),F=B(ae),ge(k.$$.fragment,ae),D=B(ae),ge(V.$$.fragment,ae),Z=B(ae),ge(y.$$.fragment,ae),pe=B(ae),ge(A.$$.fragment,ae),ae.forEach(p),X=B(We),$=b(We,"SECTION",{id:!0,class:!0});var Je=W($);R&&R.l(Je),Je.forEach(p),We.forEach(p),this.h()},h(){o(t,"id","title"),o(t,"class","svelte-1m48kjr"),o(g,"class","select"),o(u,"id","ui"),o(u,"class","svelte-1m48kjr"),o($,"id","maps"),o($,"class","svelte-1m48kjr"),o(P,"class","svelte-1m48kjr")},m(r,N){Ee(r,t,N),a(t,l),a(l,f),f.innerHTML=i,a(t,s),a(t,n),n.innerHTML=h,Ee(r,_,N),Ee(r,P,N),a(P,u),a(u,g),me(c,g,null),a(u,z),me(v,u,null),a(u,F),me(k,u,null),a(u,D),me(V,u,null),a(u,Z),me(y,u,null),a(u,pe),me(A,u,null),a(P,X),a(P,$),R&&R.m($,null),ne=!0},p(r,N){const de={};!d&&N[0]&4&&(d=!0,de.valueScale=r[2],le(()=>d=!1)),!S&&N[0]&32&&(S=!0,de.valueExp=r[5],le(()=>S=!1)),!G&&N[0]&256&&(G=!0,de.valueBounds=r[8],le(()=>G=!1)),v.$set(de);const Se={};!Y&&N[0]&1&&(Y=!0,Se.valueScale=r[0],le(()=>Y=!1)),!J&&N[0]&8&&(J=!0,Se.valueExp=r[3],le(()=>J=!1)),!O&&N[0]&64&&(O=!0,Se.valueBounds=r[6],le(()=>O=!1)),k.$set(Se);const Le={};!L&&N[0]&2&&(L=!0,Le.valueScale=r[1],le(()=>L=!1)),!H&&N[0]&16&&(H=!0,Le.valueExp=r[4],le(()=>H=!1)),!j&&N[0]&128&&(j=!0,Le.valueBounds=r[7],le(()=>j=!1)),V.$set(Le);const We={};!K&&N[0]&16384&&(K=!0,We.valueProp=r[14],le(()=>K=!1)),!q&&N[0]&512&&(q=!0,We.valueWeightDist=r[9],le(()=>q=!1)),!te&&N[0]&1024&&(te=!0,We.valueWeightPop=r[10],le(()=>te=!1)),!ve&&N[0]&2048&&(ve=!0,We.valueWeightWiki=r[11],le(()=>ve=!1)),y.$set(We);const ae={};!w&&N[0]&4096&&(w=!0,ae.thresholdLower=r[12],le(()=>w=!1)),!U&&N[0]&8192&&(U=!0,ae.thresholdUpper=r[13],le(()=>U=!1)),A.$set(ae),r[15]?R?(R.p(r,N),N[0]&32768&&oe(R,1)):(R=xe(r),R.c(),oe(R,1),R.m($,null)):R&&(il(),he(R,1,1,()=>{R=null}),ul())},i(r){ne||(oe(c.$$.fragment,r),oe(v.$$.fragment,r),oe(k.$$.fragment,r),oe(V.$$.fragment,r),oe(y.$$.fragment,r),oe(A.$$.fragment,r),oe(R),ne=!0)},o(r){he(c.$$.fragment,r),he(v.$$.fragment,r),he(k.$$.fragment,r),he(V.$$.fragment,r),he(y.$$.fragment,r),he(A.$$.fragment,r),he(R),ne=!1},d(r){r&&p(t),r&&p(_),r&&p(P),be(c),be(v),be(k),be(V),be(y),be(A),R&&R.d()}}}function Tl(e,t,l){const f=Xe("copy");Xe("data");let i="scalePow",s="scalePow",n="scaleLog",h="0.5",_="0.5",P="1",u=[0,19677151],g=[0,95406],c=[50,200],z=2,v=1,d=1,S=.5,G=.75,F="share",k,Y,J,O,D,V,L,H;function j({name:E,phoneme:Te}){l(24,L=Te),l(21,H=E)}ol(async()=>{try{const E=await hl();l(16,Y=E.counties),l(17,J=E.states),l(18,O=E.countiesMesh),l(19,D=E.statesMesh),l(20,V=E.nationMesh);const Te=ll.find(Me=>Me.name==="Georgia");j(Te)}catch(E){console.log(E)}});const Z=({detail:E})=>j(E);function y(E){n=E,l(2,n)}function K(E){P=E,l(5,P)}function q(E){c=E,l(8,c)}function te(E){i=E,l(0,i)}function ve(E){h=E,l(3,h)}function pe(E){u=E,l(6,u)}function A(E){s=E,l(1,s)}function w(E){_=E,l(4,_)}function U(E){g=E,l(7,g)}function X(E){F=E,l(14,F)}function $(E){z=E,l(9,z)}function ne(E){v=E,l(10,v)}function C(E){d=E,l(11,d)}function ie(E){S=E,l(12,S)}function _e(E){G=E,l(13,G)}return e.$$.update=()=>{e.$$.dirty[0]&16777216&&L&&(async()=>l(15,k=await _l(`${cl}/assets/places/${L}.csv?2023-03-15-15:09`)))()},[i,s,n,h,_,P,u,g,c,z,v,d,S,G,F,k,Y,J,O,D,V,H,f,j,L,Z,y,K,q,te,ve,pe,A,w,U,X,$,ne,C,ie,_e]}class Ml extends Ne{constructor(t){super(),Ue(this,t,Tl,Il,Ve,{},null,[-1,-1])}}const Bl="Data and Methods",Ll="An interactive explainer for how we made A Map of Places with the Same Name",Nl="Data &amp; Methods",Ul='An interactive explainer for how we made <a href="https://pudding.cool">A Map of Places with the Same Name</a>',el={title:Bl,description:Ll,hed:Nl,dek:Ul};function Vl(e){let t,l,f,i;return t=new dl({props:{title:e[0],description:e[1],url:e[2],keywords:e[3]}}),f=new Ml({}),{c(){ce(t.$$.fragment),l=M(),ce(f.$$.fragment)},l(s){ge(t.$$.fragment,s),l=B(s),ge(f.$$.fragment,s)},m(s,n){me(t,s,n),Ee(s,l,n),me(f,s,n),i=!0},p:Oe,i(s){i||(oe(t.$$.fragment,s),oe(f.$$.fragment,s),i=!0)},o(s){he(t.$$.fragment,s),he(f.$$.fragment,s),i=!1},d(s){be(t,s),s&&p(l),be(f,s)}}}function Ol(e){pl();const{title:t,description:l,url:f,keywords:i}=el;return rl("copy",el),[t,l,f,i]}class Gl extends Ne{constructor(t){super(),Ue(this,t,Ol,Vl,Ve,{})}}export{Gl as default};