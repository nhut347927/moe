import{p as c,r as u,q as z,j as e,X as M,L as a,A as k,s as y,t as $,v as b,w as m,S as E}from"./index-BUxin4Fp.js";/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const L=c("CirclePlus",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M8 12h8",key:"1wcyev"}],["path",{d:"M12 8v8",key:"napkw2"}]]);/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C=c("House",[["path",{d:"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8",key:"5wwlr5"}],["path",{d:"M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",key:"1d0kgt"}]]);/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const H=c("Info",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]]);/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const A=c("Maximize",[["path",{d:"M8 3H5a2 2 0 0 0-2 2v3",key:"1dcmit"}],["path",{d:"M21 8V5a2 2 0 0 0-2-2h-3",key:"1e4gt3"}],["path",{d:"M3 16v3a2 2 0 0 0 2 2h3",key:"wsl5sc"}],["path",{d:"M16 21h3a2 2 0 0 0 2-2v-3",key:"18trek"}]]);/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const F=c("Menu",[["line",{x1:"4",x2:"20",y1:"12",y2:"12",key:"1e0a9i"}],["line",{x1:"4",x2:"20",y1:"6",y2:"6",key:"1owob3"}],["line",{x1:"4",x2:"20",y1:"18",y2:"18",key:"yk5zj1"}]]);/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const I=c("Minimize",[["path",{d:"M8 3v3a2 2 0 0 1-2 2H3",key:"hohbtr"}],["path",{d:"M21 8h-3a2 2 0 0 1-2-2V3",key:"5jw1f3"}],["path",{d:"M3 16h3a2 2 0 0 1 2 2v3",key:"198tvr"}],["path",{d:"M16 21v-3a2 2 0 0 1 2-2h3",key:"ph8mxp"}]]);function P(){const[s,o]=u.useState(!1),x=z().pathname,[p,v]=u.useState(!1);function w(t){var n;const r=`; ${document.cookie}`.split(`; ${t}=`);if(r.length===2)return(n=r.pop())==null?void 0:n.split(";").shift()}const j=w("avatar");u.useEffect(()=>{let t=0;const f=n=>{t=n.touches[0].clientX},r=n=>{const g=n.touches[0].clientX-t;g>230&&!s?o(!0):g<-60&&s&&o(!1)};return document.addEventListener("touchstart",f),document.addEventListener("touchmove",r),()=>{document.removeEventListener("touchstart",f),document.removeEventListener("touchmove",r)}},[s]);const h=t=>t==="/"?x==="/":x===t||x.startsWith(`${t}/`),l="w-10 h-10 rounded-xl text-zinc-700 dark:text-zinc-200 transition-colors",d="w-12 h-10 bg-zinc-300 dark:bg-zinc-700",i="w-12 h-10 hover:bg-zinc-200 dark:hover:bg-zinc-800",N=()=>{document.fullscreenElement?document.exitFullscreen().then(()=>{v(!1)}).catch(t=>{console.error("Error attempting to exit fullscreen",t)}):document.documentElement.requestFullscreen().then(()=>{v(!0)}).catch(t=>{console.error("Error attempting to enable fullscreen",t)})};return u.useEffect(()=>{const t=()=>{v(!!document.fullscreenElement)};return document.addEventListener("fullscreenchange",t),()=>{document.removeEventListener("fullscreenchange",t)}},[]),e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"fixed top-4 left-4 w-16 z-50",children:e.jsx("span",{onClick:()=>o(!s),children:s?e.jsx(M,{}):e.jsx(F,{})})}),e.jsx("aside",{className:`fixed top-0 left-0 z-50 h-screen w-full transition-transform duration-300 ease-in-out ${s?"translate-x-0":"-translate-x-full"} bg-black/30 backdrop-blur-md`,onClick:()=>o(!s),children:e.jsx("div",{className:"flex justify-start items-center h-full",children:e.jsxs("div",{className:"ms-3 w-16 p-3 bg-white dark:bg-zinc-950 shadow-xl rounded-2xl flex flex-col items-center gap-2 h-fit",children:[e.jsx(a,{to:"/",title:"Trang chủ",children:e.jsxs(k,{className:"w-10 h-10 mb-2 ring-2 ring-blue-500 ring-opacity-20",children:[e.jsx(y,{src:$}),e.jsx(b,{className:"bg-zinc-400 text-white",children:"CN"})]})}),e.jsxs("nav",{className:"flex flex-col items-center gap-1",children:[e.jsx(a,{to:"/client/home",title:"Home",children:e.jsx(m,{variant:"ghost",size:"icon",className:`${l} ${h("/client/home")?d:""} ${i}`,children:e.jsx(C,{className:"w-5 h-5"})})}),e.jsx(a,{to:"/client/search",title:"Search",children:e.jsx(m,{variant:"ghost",size:"icon",className:`${l} ${h("/client/search")?d:""} ${i}`,children:e.jsx(E,{className:"w-5 h-5"})})}),e.jsx(a,{to:"/client/upload",title:"Upload",children:e.jsx(m,{variant:"ghost",size:"icon",className:`${l} ${h("/client/upload")?d:""} ${i}`,children:e.jsx(L,{className:"w-5 h-5"})})}),e.jsx(a,{to:"/client/about",title:"About",children:e.jsx(m,{variant:"ghost",size:"icon",className:`${l} ${h("/client/about")?d:""} ${i}`,children:e.jsx(H,{className:"w-5 h-5"})})}),e.jsx("button",{onClick:t=>{t.stopPropagation(),N()},title:p?"Exit fullscreen":"Enter fullscreen",className:`${l} ${i} mt-auto mb-1 flex items-center justify-center`,children:p?e.jsx(I,{className:"w-5 h-5"}):e.jsx(A,{className:"w-5 h-5"})})]}),e.jsx("div",{className:"mt-0",children:e.jsx(a,{to:"/client/profile",title:"Tài khoản",children:e.jsxs(k,{className:"w-10 h-10 bg-zinc-400 text-white text-sm",children:[e.jsx(y,{src:j?`https://res.cloudinary.com/dwv76nhoy/image/upload/w_80,h_80/${j}`:void 0}),e.jsx(b,{className:"bg-blue-400 text-white",children:"CN"})]})})})]})})})]})}export{P as H};
