(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[405],{7314:function(e,t,r){(window.__NEXT_P=window.__NEXT_P||[]).push(["/",function(){return r(3768)}])},6792:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"Image",{enumerable:!0,get:function(){return v}});let i=r(3219),n=r(6794),o=r(2322),s=n._(r(2784)),a=i._(r(8316)),l=i._(r(44)),c=r(9694),d=r(4671),u=r(5411);r(8485);let f=r(7942),p=i._(r(2889)),m={deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[16,32,48,64,96,128,256,384],path:"/_next/image",loader:"default",dangerouslyAllowSVG:!1,unoptimized:!1};function g(e,t,r,i,n,o,s){let a=null==e?void 0:e.src;e&&e["data-loaded-src"]!==a&&(e["data-loaded-src"]=a,("decode"in e?e.decode():Promise.resolve()).catch(()=>{}).then(()=>{if(e.parentElement&&e.isConnected){if("empty"!==t&&n(!0),null==r?void 0:r.current){let t=new Event("load");Object.defineProperty(t,"target",{writable:!1,value:e});let i=!1,n=!1;r.current({...t,nativeEvent:t,currentTarget:e,target:e,isDefaultPrevented:()=>i,isPropagationStopped:()=>n,persist:()=>{},preventDefault:()=>{i=!0,t.preventDefault()},stopPropagation:()=>{n=!0,t.stopPropagation()}})}(null==i?void 0:i.current)&&i.current(e)}}))}function h(e){let[t,r]=s.version.split(".",2),i=parseInt(t,10),n=parseInt(r,10);return i>18||18===i&&n>=3?{fetchPriority:e}:{fetchpriority:e}}let _=(0,s.forwardRef)((e,t)=>{let{src:r,srcSet:i,sizes:n,height:a,width:l,decoding:c,className:d,style:u,fetchPriority:f,placeholder:p,loading:m,unoptimized:_,fill:x,onLoadRef:v,onLoadingCompleteRef:j,setBlurComplete:b,setShowAltText:w,sizesInput:y,onLoad:S,onError:N,...z}=e;return(0,o.jsx)("img",{...z,...h(f),loading:m,width:l,height:a,decoding:c,"data-nimg":x?"fill":"1",className:d,style:u,sizes:n,srcSet:i,src:r,ref:(0,s.useCallback)(e=>{t&&("function"==typeof t?t(e):"object"==typeof t&&(t.current=e)),e&&(N&&(e.src=e.src),e.complete&&g(e,p,v,j,b,_,y))},[r,p,v,j,b,N,_,y,t]),onLoad:e=>{g(e.currentTarget,p,v,j,b,_,y)},onError:e=>{w(!0),"empty"!==p&&b(!0),N&&N(e)}})});function x(e){let{isAppRouter:t,imgAttributes:r}=e,i={as:"image",imageSrcSet:r.srcSet,imageSizes:r.sizes,crossOrigin:r.crossOrigin,referrerPolicy:r.referrerPolicy,...h(r.fetchPriority)};return t&&a.default.preload?(a.default.preload(r.src,i),null):(0,o.jsx)(l.default,{children:(0,o.jsx)("link",{rel:"preload",href:r.srcSet?void 0:r.src,...i},"__nimg-"+r.src+r.srcSet+r.sizes)})}let v=(0,s.forwardRef)((e,t)=>{let r=(0,s.useContext)(f.RouterContext),i=(0,s.useContext)(u.ImageConfigContext),n=(0,s.useMemo)(()=>{let e=m||i||d.imageConfigDefault,t=[...e.deviceSizes,...e.imageSizes].sort((e,t)=>e-t),r=e.deviceSizes.sort((e,t)=>e-t);return{...e,allSizes:t,deviceSizes:r}},[i]),{onLoad:a,onLoadingComplete:l}=e,g=(0,s.useRef)(a);(0,s.useEffect)(()=>{g.current=a},[a]);let h=(0,s.useRef)(l);(0,s.useEffect)(()=>{h.current=l},[l]);let[v,j]=(0,s.useState)(!1),[b,w]=(0,s.useState)(!1),{props:y,meta:S}=(0,c.getImgProps)(e,{defaultLoader:p.default,imgConf:n,blurComplete:v,showAltText:b});return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(_,{...y,unoptimized:S.unoptimized,placeholder:S.placeholder,fill:S.fill,onLoadRef:g,onLoadingCompleteRef:h,setBlurComplete:j,setShowAltText:w,sizesInput:e.sizes,ref:t}),S.priority?(0,o.jsx)(x,{isAppRouter:!r,imgAttributes:y}):null]})});("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},9694:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"getImgProps",{enumerable:!0,get:function(){return a}}),r(8485);let i=r(2552),n=r(4671);function o(e){return void 0!==e.default}function s(e){return void 0===e?e:"number"==typeof e?Number.isFinite(e)?e:NaN:"string"==typeof e&&/^[0-9]+$/.test(e)?parseInt(e,10):NaN}function a(e,t){var r;let a,l,c,{src:d,sizes:u,unoptimized:f=!1,priority:p=!1,loading:m,className:g,quality:h,width:_,height:x,fill:v=!1,style:j,overrideSrc:b,onLoad:w,onLoadingComplete:y,placeholder:S="empty",blurDataURL:N,fetchPriority:z,layout:C,objectFit:P,objectPosition:E,lazyBoundary:I,lazyRoot:O,...k}=e,{imgConf:R,showAltText:L,blurComplete:M,defaultLoader:A}=t,D=R||n.imageConfigDefault;if("allSizes"in D)a=D;else{let e=[...D.deviceSizes,...D.imageSizes].sort((e,t)=>e-t),t=D.deviceSizes.sort((e,t)=>e-t);a={...D,allSizes:e,deviceSizes:t}}if(void 0===A)throw Error("images.loaderFile detected but the file is missing default export.\nRead more: https://nextjs.org/docs/messages/invalid-images-config");let F=k.loader||A;delete k.loader,delete k.srcSet;let H="__next_img_default"in F;if(H){if("custom"===a.loader)throw Error('Image with src "'+d+'" is missing "loader" prop.\nRead more: https://nextjs.org/docs/messages/next-image-missing-loader')}else{let e=F;F=t=>{let{config:r,...i}=t;return e(i)}}if(C){"fill"===C&&(v=!0);let e={intrinsic:{maxWidth:"100%",height:"auto"},responsive:{width:"100%",height:"auto"}}[C];e&&(j={...j,...e});let t={responsive:"100vw",fill:"100vw"}[C];t&&!u&&(u=t)}let V="",B=s(_),G=s(x);if("object"==typeof(r=d)&&(o(r)||void 0!==r.src)){let e=o(d)?d.default:d;if(!e.src)throw Error("An object should only be passed to the image component src parameter if it comes from a static image import. It must include src. Received "+JSON.stringify(e));if(!e.height||!e.width)throw Error("An object should only be passed to the image component src parameter if it comes from a static image import. It must include height and width. Received "+JSON.stringify(e));if(l=e.blurWidth,c=e.blurHeight,N=N||e.blurDataURL,V=e.src,!v){if(B||G){if(B&&!G){let t=B/e.width;G=Math.round(e.height*t)}else if(!B&&G){let t=G/e.height;B=Math.round(e.width*t)}}else B=e.width,G=e.height}}let T=!p&&("lazy"===m||void 0===m);(!(d="string"==typeof d?d:V)||d.startsWith("data:")||d.startsWith("blob:"))&&(f=!0,T=!1),a.unoptimized&&(f=!0),H&&d.endsWith(".svg")&&!a.dangerouslyAllowSVG&&(f=!0),p&&(z="high");let U=s(h),W=Object.assign(v?{position:"absolute",height:"100%",width:"100%",left:0,top:0,right:0,bottom:0,objectFit:P,objectPosition:E}:{},L?{}:{color:"transparent"},j),X=M||"empty"===S?null:"blur"===S?'url("data:image/svg+xml;charset=utf-8,'+(0,i.getImageBlurSvg)({widthInt:B,heightInt:G,blurWidth:l,blurHeight:c,blurDataURL:N||"",objectFit:W.objectFit})+'")':'url("'+S+'")',q=X?{backgroundSize:W.objectFit||"cover",backgroundPosition:W.objectPosition||"50% 50%",backgroundRepeat:"no-repeat",backgroundImage:X}:{},J=function(e){let{config:t,src:r,unoptimized:i,width:n,quality:o,sizes:s,loader:a}=e;if(i)return{src:r,srcSet:void 0,sizes:void 0};let{widths:l,kind:c}=function(e,t,r){let{deviceSizes:i,allSizes:n}=e;if(r){let e=/(^|\s)(1?\d?\d)vw/g,t=[];for(let i;i=e.exec(r);i)t.push(parseInt(i[2]));if(t.length){let e=.01*Math.min(...t);return{widths:n.filter(t=>t>=i[0]*e),kind:"w"}}return{widths:n,kind:"w"}}return"number"!=typeof t?{widths:i,kind:"w"}:{widths:[...new Set([t,2*t].map(e=>n.find(t=>t>=e)||n[n.length-1]))],kind:"x"}}(t,n,s),d=l.length-1;return{sizes:s||"w"!==c?s:"100vw",srcSet:l.map((e,i)=>a({config:t,src:r,quality:o,width:e})+" "+("w"===c?e:i+1)+c).join(", "),src:a({config:t,src:r,quality:o,width:l[d]})}}({config:a,src:d,unoptimized:f,width:B,quality:U,sizes:u,loader:F});return{props:{...k,loading:T?"lazy":m,fetchPriority:z,width:B,height:G,decoding:"async",className:g,style:{...W,...q},sizes:J.sizes,srcSet:J.srcSet,src:b||J.src},meta:{unoptimized:f,priority:p,placeholder:S,fill:v}}}},2552:function(e,t){"use strict";function r(e){let{widthInt:t,heightInt:r,blurWidth:i,blurHeight:n,blurDataURL:o,objectFit:s}=e,a=i?40*i:t,l=n?40*n:r,c=a&&l?"viewBox='0 0 "+a+" "+l+"'":"";return"%3Csvg xmlns='http://www.w3.org/2000/svg' "+c+"%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3CfeColorMatrix values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 100 -1' result='s'/%3E%3CfeFlood x='0' y='0' width='100%25' height='100%25'/%3E%3CfeComposite operator='out' in='s'/%3E%3CfeComposite in2='SourceGraphic'/%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3C/filter%3E%3Cimage width='100%25' height='100%25' x='0' y='0' preserveAspectRatio='"+(c?"none":"contain"===s?"xMidYMid":"cover"===s?"xMidYMid slice":"none")+"' style='filter: url(%23b);' href='"+o+"'/%3E%3C/svg%3E"}Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"getImageBlurSvg",{enumerable:!0,get:function(){return r}})},7794:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),function(e,t){for(var r in t)Object.defineProperty(e,r,{enumerable:!0,get:t[r]})}(t,{default:function(){return l},getImageProps:function(){return a}});let i=r(3219),n=r(9694),o=r(6792),s=i._(r(2889));function a(e){let{props:t}=(0,n.getImgProps)(e,{defaultLoader:s.default,imgConf:{deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[16,32,48,64,96,128,256,384],path:"/_next/image",loader:"default",dangerouslyAllowSVG:!1,unoptimized:!1}});for(let[e,r]of Object.entries(t))void 0===r&&delete t[e];return{props:t}}let l=o.Image},2889:function(e,t){"use strict";function r(e){let{config:t,src:r,width:i,quality:n}=e;return t.path+"?url="+encodeURIComponent(r)+"&w="+i+"&q="+(n||75)}Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"default",{enumerable:!0,get:function(){return i}}),r.__next_img_default=!0;let i=r},3768:function(e,t,r){"use strict";r.r(t),r.d(t,{default:function(){return f}});var i=r(2322),n=r(9912),o=r.n(n),s=r(7729),a=r.n(s),l=r(6577),c=r.n(l),d=r(5228),u=r.n(d);function f(){return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsxs)(a(),{children:[(0,i.jsx)("title",{children:"Create Next App"}),(0,i.jsx)("meta",{name:"description",content:"Generated by create next app"}),(0,i.jsx)("meta",{name:"viewport",content:"width=device-width, initial-scale=1"}),(0,i.jsx)("link",{rel:"icon",href:"/favicon.ico"})]}),(0,i.jsxs)("main",{className:"".concat(u().main," ").concat(o().className),children:[(0,i.jsxs)("div",{className:u().description,children:[(0,i.jsxs)("p",{children:["Get started by editing\xa0",(0,i.jsx)("code",{className:u().code,children:"pages/index.tsx"})]}),(0,i.jsx)("div",{children:(0,i.jsxs)("a",{href:"https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app",target:"_blank",rel:"noopener noreferrer",children:["By"," ",(0,i.jsx)(c(),{src:"/vercel.svg",alt:"Vercel Logo",className:u().vercelLogo,width:100,height:24,priority:!0})]})})]}),(0,i.jsx)("div",{className:u().center,children:(0,i.jsx)(c(),{className:u().logo,src:"/next.svg",alt:"Next.js Logo",width:180,height:37,priority:!0})}),(0,i.jsxs)("div",{className:u().grid,children:[(0,i.jsxs)("a",{href:"https://nextjs.org/docs?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app",className:u().card,target:"_blank",rel:"noopener noreferrer",children:[(0,i.jsxs)("h2",{children:["Docs ",(0,i.jsx)("span",{children:"->"})]}),(0,i.jsx)("p",{children:"Find in-depth information about Next.js features and\xa0API."})]}),(0,i.jsxs)("a",{href:"https://nextjs.org/learn?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app",className:u().card,target:"_blank",rel:"noopener noreferrer",children:[(0,i.jsxs)("h2",{children:["Learn ",(0,i.jsx)("span",{children:"->"})]}),(0,i.jsx)("p",{children:"Learn about Next.js in an interactive course with\xa0quizzes!"})]}),(0,i.jsxs)("a",{href:"https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app",className:u().card,target:"_blank",rel:"noopener noreferrer",children:[(0,i.jsxs)("h2",{children:["Templates ",(0,i.jsx)("span",{children:"->"})]}),(0,i.jsx)("p",{children:"Discover and deploy boilerplate example Next.js\xa0projects."})]}),(0,i.jsxs)("a",{href:"https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app",className:u().card,target:"_blank",rel:"noopener noreferrer",children:[(0,i.jsxs)("h2",{children:["Deploy ",(0,i.jsx)("span",{children:"->"})]}),(0,i.jsx)("p",{children:"Instantly deploy your Next.js site to a shareable URL with\xa0Vercel."})]})]})]})]})}},9912:function(e){e.exports={style:{fontFamily:"'__Inter_aaf875', '__Inter_Fallback_aaf875'",fontStyle:"normal"},className:"__className_aaf875"}},5228:function(e){e.exports={main:"Home_main__VkIEL",description:"Home_description__uXNdx",code:"Home_code__VVrIr",grid:"Home_grid__AVljO",card:"Home_card__E5spL",center:"Home_center__O_TIN",logo:"Home_logo__IOQAX",content:"Home_content__tkQPU",vercelLogo:"Home_vercelLogo___BVuc",rotate:"Home_rotate__c5eru"}},7729:function(e,t,r){e.exports=r(44)},6577:function(e,t,r){e.exports=r(7794)}},function(e){e.O(0,[888,774,179],function(){return e(e.s=7314)}),_N_E=e.O()}]);