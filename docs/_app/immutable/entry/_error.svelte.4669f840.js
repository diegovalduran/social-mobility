import{S as d,i as h,s as g,e as v,t as p,c as b,a as $,b as c,d as u,f as x,g as m,h as f,n as _,j as E}from"../chunks/index.de16b786.js";import{p as S}from"../chunks/stores.2bc56f38.js";function j(n){let e,s=n[0].status+"",r,o,i=n[0].error.message+"",l;return{c(){e=v("h1"),r=p(s),o=p(": "),l=p(i)},l(a){e=b(a,"H1",{});var t=$(e);r=c(t,s),o=c(t,": "),l=c(t,i),t.forEach(u)},m(a,t){x(a,e,t),m(e,r),m(e,o),m(e,l)},p(a,[t]){t&1&&s!==(s=a[0].status+"")&&f(r,s),t&1&&i!==(i=a[0].error.message+"")&&f(l,i)},i:_,o:_,d(a){a&&u(e)}}}function q(n,e,s){let r;return E(n,S,o=>s(0,r=o)),[r]}class H extends d{constructor(e){super(),h(this,e,q,j,g,{})}}export{H as default};
