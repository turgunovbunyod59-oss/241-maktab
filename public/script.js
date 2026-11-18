/* Bu fayl — sayt ishlash mantig'i. Ma'lumotlar (o'qituvchilar, jadval, kitoblar) malumotlar.js faylida. */
/* Kitob kodlarini xavfsiz ko'rinishga keltirish: qanday yozilgan bo'lsa ham sayt ishlayveradi */
(function(){const slug=t=>String(t).toLowerCase().replace(/['’`ʻʼ]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,30).replace(/-+$/,"");
  for(const g in KITOBLAR)for(const l in KITOBLAR[g]){const seen={};
    KITOBLAR[g][l]=KITOBLAR[g][l].map((b,i)=>{const nom=typeof b[1]==="string"?b[1]:String(b[0]);let c=slug(typeof b[1]==="string"?b[0]:b[0])||"kitob-"+(i+1);
      if(seen[c]){let n=2;while(seen[c+"-"+n])n++;c=c+"-"+n}seen[c]=1;
      const u=typeof b[2]==="string"?b[2].trim():"";
      return[c,nom,u]})}})();
const $=(s,r=document)=>r.querySelector(s),app=$("#app"),modal=$("#modal"),mb=$("#mbody");
const esc=s=>s.replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const ph=(src,cls,e="")=>`<span class="ph ${cls}" data-e="${e}"><img src="${src}" alt="" loading="lazy" onerror="this.remove()"></span>`;
const slugify=t=>String(t).toLowerCase().replace(/['’`ʻʼ]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");
const joy=x=>typeof x==="string"?{nom:x,sarlavha:/^maktab/i.test(x)?x:"Maktab "+x.toLowerCase(),rasm1:`img/joylar/${slugify(x)}-1.jpg`,rasm2:`img/joylar/${slugify(x)}-2.jpg`}:x;
const kv=a=>a.map(([k,v])=>`<p><b>${k}:</b> ${esc(String(v??""))}</p>`).join("");
const back=`<button class="back" data-go="">← Ortga</button>`;
const api=async(u,o={})=>{const r=await fetch(u,o);let d={};try{d=await r.json()}catch(e){}if(!r.ok)throw Object.assign(new Error(d.error||"Serverda xatolik"),{status:r.status});return d};
const jpost=(u,b)=>api(u,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(b)});
const tokens=()=>{try{return JSON.parse(localStorage.tk||"{}")}catch(e){return{}}};
const setTok=(i,t)=>{const a=tokens();a[i]=t;try{localStorage.tk=JSON.stringify(a)}catch(e){}};
const MUTE=t=>`<p class="mute">${t}</p>`,OFF='<p class="err">Serverga ulanib bo\'lmadi.</p>';
const shrink=f=>new Promise(r=>{const i=new Image,u=URL.createObjectURL(f);i.onload=()=>{const k=Math.min(1,800/i.width),c=document.createElement("canvas");c.width=i.width*k;c.height=i.height*k;c.getContext("2d").drawImage(i,0,0,c.width,c.height);URL.revokeObjectURL(u);r(c.toDataURL("image/jpeg",.7))};i.src=u});

function open(h){mb.innerHTML=h;modal.hidden=false;const f=$("input,button:not(.x)",mb);f&&f.focus()}
function close(){modal.hidden=true}
function askPin(ok){
  open(`<h3>Parolni kiriting</h3><input id="pin" type="password" autocomplete="off" placeholder="Parol"><p id="perr" class="err"></p><button class="btn" id="pok">Tasdiqlash</button>`);
  const go=async()=>{const pin=$("#pin").value.trim(),er=$("#perr");er.textContent="";
    let rr;try{rr=await jpost("/api/pin",{pin})}catch(e){er.textContent=e.status?e.message:"Serverga ulanib bo'lmadi.";return}
    close();ok(pin);
    if(rr&&rr.doimiy===false&&!window.__ew){window.__ew=1;setTimeout(()=>alert("DIQQAT: bu saytda doimiy saqlash (Supabase) ulanmagan.\n\nSiz kiritgan o'zgarishlar (hisoblagich, kitoblar, xabarlar, jadval va boshqalar) sayt uxlab qolgach yoki qayta ishga tushgach YO'QOLADI.\n\nREADME dagi \"Doimiy bepul saqlash: Supabase\" bo'limidagi qadamlarni bajaring."),80)}};
  $("#pok").onclick=go;$("#pin").onkeydown=e=>{if(e.key==="Enter")go()};
}
const grades=k=>open(`<h3>Sinfni tanlang</h3><div class="chips sinf-chips">${[5,6,7,8,9,10,11].map(g=>`<button class="btn alt" data-g="${g}" data-k="${k}">${g}-sinf</button>`).join("")}</div>`);

const R={},INIT={},KUNLAR=["Dushanba","Seshanba","Chorshanba","Payshanba","Juma","Shanba"];
const MENU=[["haqida","Maktab haqida",'<path d="M3 21h18M5 21V10l7-5 7 5v11M9 21v-6h6v6"/><path d="M12 10h.01"/>',"Maktabimiz haqida batafsil ma'lumot"],
["oqituvchilar","O'qituvchilar",'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6M16 5a3.5 3.5 0 0 1 0 6.5M18 14c2.2.6 3.5 2.6 3.5 6"/>',"Bizning tajribali o'qituvchilar jamoasi"],
["jadval","Dars jadvali",'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',"Sinflar bo'yicha dars jadvali"],
["tadbirlar","Tadbirlar va yutuqlar",'<path d="M7 4h10v5a5 5 0 0 1-10 0zM7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3M12 14v4M8 21h8M10 18h4"/>',"Maktabimizdagi tadbirlar va yutuqlar"],
["kutubxona","Kutubxona",'<path d="M4 4h6a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H4zM20 4h-6a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h6z"/>',"Kitoblar va o'quv adabiyotlari"],
["yangiliklar","Yangiliklar va e'lonlar",'<path d="M4 10v4h3l7 4V6L7 10zM18 9a4 4 0 0 1 0 6"/>',"So'nggi yangiliklar va e'lonlar"]];
const ICON={
  fb:'<path d="M14 13.5h2.5l1-4H14v-2c0-1.03.7-1.5 1.5-1.5h2V2.14c-.6-.08-1.7-.14-3.08-.14-3.1 0-5.42 1.88-5.42 5.5v2H6v4h3v9h5v-9z" fill="currentColor"/>',
  tg:'<path d="m20.66 3.72-17.73 6.84c-1.21.49-1.2 1.16-.22 1.46l4.55 1.42 10.53-6.65c.5-.3.95-.14.58.19l-8.53 7.7-.31 4.69c.46 0 .66-.21.92-.46l2.21-2.15 4.6 3.4c.85.47 1.46.23 1.67-.78l3.02-14.23c.31-1.24-.47-1.8-1.28-1.43z" fill="currentColor"/>',
  ig:'<rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.2" cy="6.8" r="1.2" fill="currentColor"/>'
};
/* ===== O'quv choragi hisoblagichi ===== */
const CH={tugash:null,off:0,edit:false,init:"",err:false};
const CDK=[["d","kun",400],["h","soat",23],["m","daqiqa",59],["s","sekund",59]];
const p2=n=>String(n).padStart(2,"0");
const cdLeft=()=>CH.tugash?Math.max(0,CH.tugash-(Date.now()+CH.off)):0;
const cdParts=ms=>{const t=Math.floor(ms/1000);return[Math.floor(t/86400),Math.floor(t%86400/3600),Math.floor(t%3600/60),t%60]};
const cdView=()=>`<div class="cd">${CDK.map(([k,n])=>`<div class="cdb"><b id="cd-${k}">00</b><span>${n}</span></div>`).join("")}</div><p class="mute" id="cd-note"></p><div class="jbar cdbar"><button class="btn alt btn-cal" data-cd-edit><svg class="btn-cal-ic" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="2"/></svg> O'zgartirish</button></div>`;
function cdTick(){if(CH.edit||!$("#cd-d"))return;const p=cdParts(cdLeft());CDK.forEach(([k],i)=>{$("#cd-"+k).textContent=p2(p[i])});
  const n=$("#cd-note");if(n)n.textContent=CH.err?"Saqlangan vaqtni yuklab bo'lmadi (server yoki saqlash xizmati bilan muammo). Sahifani yangilab ko'ring.":!CH.tugash?"Vaqt hali belgilanmagan. «O'zgartirish» tugmasi orqali belgilang.":cdLeft()===0?"O'quv choragi tugadi.":""}
async function loadChorak(){try{const d=await api("/api/chorak");CH.tugash=d.tugash||null;CH.off=(d.hozir||Date.now())-Date.now();CH.err=false}catch(e){CH.err=true}
  if($("#cd")&&!CH.edit)$("#cd").innerHTML=cdView();cdTick()}
function cdEdit(){const v=cdParts(cdLeft());CH.edit=true;CH.init=JSON.stringify(v);
  $("#cd").innerHTML=`<div class="cd">${CDK.map(([k,n,max],i)=>`<label class="cdb"><input type="number" inputmode="numeric" min="0" max="${max}" step="1" data-cdi="${i}" id="cdi-${k}" value="${v[i]}"><span>${n}</span></label>`).join("")}</div><p class="err" id="cd-msg"></p><div class="jbar cdbar"><button class="btn" data-cd-save hidden>Saqlash</button><button class="btn alt" data-cd-cancel>Bekor qilish</button></div>`}
function cdSave(){const m=$("#cd-msg"),v=CDK.map(([k])=>{const t=$("#cdi-"+k).value.trim();return/^\d+$/.test(t)?+t:NaN});
  const bad=CDK.findIndex(([,,max],i)=>!(v[i]>=0&&v[i]<=max));
  if(bad>=0){m.textContent=`«${CDK[bad][1]}» 0 dan ${CDK[bad][2]} gacha butun son bo'lishi kerak.`;return}
  m.textContent="";
  askPin(async pin=>{try{const d=await api("/api/chorak",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({pin,kun:v[0],soat:v[1],daqiqa:v[2],sekund:v[3]})});
    CH.tugash=d.tugash;CH.off=d.hozir-Date.now();CH.edit=false;if($("#cd")){$("#cd").innerHTML=cdView();cdTick()}}catch(e){const mm=$("#cd-msg");if(mm)mm.textContent=e.message;else alert(e.message)}})}
document.addEventListener("input",e=>{const t=e.target;if(t.dataset&&t.dataset.cdi!==undefined){
  const v=CDK.map(([k])=>Number($("#cdi-"+k).value.trim()||0)),b=$("[data-cd-save]");if(b)b.hidden=JSON.stringify(v)===CH.init}});
setInterval(cdTick,1000);

/* ===== Maktab tarixi (ilon izi yo'l) ===== */
const TARIXLAR=(typeof TARIX!=="undefined"&&Array.isArray(TARIX)&&TARIX.length)?TARIX:[
  {yil:"1974",sarlavha:"Maktab ochildi",matn:"Shu yilda Mirzo Ulug'bek tumanida 241-umumiy o'rta ta'lim maktabi ochildi.",rasm:"img/tarix-1.jpg"},
  {yil:"2018",sarlavha:"Qayta tamirlandi",matn:"Shu yilda maktabimiz qayta ta'mirlandi va zamonaviy ko'rinishga ega bo'ldi.",rasm:"img/tarix-2.jpg"},
  ];
const tlPath=n=>{const h=36;let d="M50 -50";for(let i=-1;i<n;i++){const y0=50+100*i,y1=y0+100,c=(i+1)%2===0?-12:12;d+=` C${50+c} ${y0+h} ${50+c} ${y1-h} 50 ${y1}`}return d};
const tarixHtml=()=>{const T=TARIXLAR,n=T.length,d=tlPath(n);
  return `<section class="tarix">
<div class="tarix-hd"><h2>Maktab tarixi</h2><span class="tarix-line"></span><p>Yillar davomidagi o'zgarishlar</p></div>
<div class="tl" style="grid-template-rows:repeat(${n},1fr)">
<svg class="tsvg" viewBox="0 0 100 ${n*100}" preserveAspectRatio="none" aria-hidden="true"><path class="road" d="${d}"/><path class="dash" d="${d}"/></svg>
${T.map((t,i)=>`<span class="tyil" style="top:${(i*100+50)/(n*100)*100}%">${esc(String(t.yil))}</span>`).join("")}
${T.map((t,i)=>{const c=`<div class="tcell ci"><div class="tcircle-glow"><img src="${t.rasm}" alt="" class="tcircle-img" loading="lazy"></div></div>`,x=`<div class="tcell"><div class="ttext"><h3>${esc(String(t.sarlavha))}</h3><p>${esc(String(t.matn))}</p></div></div>`;return `<div class="trow">${i%2?x+c:c+x}</div>`}).join("")}
</div></section>`};

const GRAD='<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>';
R.home=()=>`<div class="home">
<section class="hero">${ph("img/maktab.jpg","hphoto","")}<div class="hin"><p class="kick"><svg viewBox="0 0 24 24" aria-hidden="true">${GRAD}</svg>${esc(S.kicker||"Bilim — kelajak kalitidir")}</p><h1>${esc(S.title1)}<span class="acc">${esc(S.title2)}</span></h1><p class="lead">“${S.quote[0]}<br>${S.quote[1]}”</p></div></section>
<section class="chorak" aria-label="O'quv choragi hisoblagichi"><div class="chorak-hd"><h2>O'quv choragi tugashiga qolgan vaqt</h2></div><div id="cd">${cdView()}</div></section>
<nav class="menu" aria-label="Bo'limlar">${MENU.map(m=>`<button class="mcard" data-m="${m[0]}"><span class="ic"><svg viewBox="0 0 24 24" aria-hidden="true">${m[2]}</svg></span><div class="mcard-txt"><b>${m[1]}</b><span class="d">${m[3]}</span></div><i class="ar"><svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg></i></button>`).join("")}</nav>
${tarixHtml()}</div>
<footer class="foot"><div class="foot-brand"><span class="lg"><img src="img/logo.png" alt="" onerror="this.remove()"></span><div class="foot-brand-txt"><b>Maktab rasmiy sayti</b><small>Bilim — kelajak kalitidir</small></div></div><span class="soc">${["ig","tg","fb"].map(k=>`<a class="${k}" href="${S[k]}" target="_blank" rel="noopener" aria-label="${k}"><svg viewBox="0 0 24 24">${ICON[k]}</svg></a>`).join("")}</span><span class="foot-copy">© 2025 241-sonli maktab. Barcha huquqlar himoyalangan.</span></footer>`;

R.haqida=()=>`<section class="page">${back}${ph("img/maktab.jpg","banner")}<h2>Maktab haqida</h2>
<p>${HAQIDA}</p>
<h3 class="sub">Umumiy ma'lumot</h3><div class="card">${kv(MALUMOT)}</div>
<h3 class="sub">Maktabdagi joylar</h3><ul class="tags">${JOYLAR.map((p,i)=>`<li><button class="tagbtn" data-go="joy/${i}">${joy(p).nom}</button></li>`).join("")}</ul>
<h3 class="sub">Imkoniyatlar</h3><ul class="cap">${IMKONIYATLAR.map(c=>`<li>${c}</li>`).join("")}</ul>
<p style="margin-top:24px"><button class="btn" data-map>Maktabni xaritada ko'rish</button></p></section>`;

R.joy=i=>{const p=JOYLAR[+i];if(!p)return R.home();const j=joy(p);
  const phj=src=>`<span class="ph jpic" data-p="${esc(String(src))}"><img src="${esc(String(src))}" alt="" loading="lazy" onload="this.parentNode.classList.add('ok')" onerror="this.remove()"></span>`;
  return `<section class="page"><button class="back" data-go="haqida">← Ortga</button><h2>${esc(String(j.sarlavha))}</h2><div class="jgrid">${phj(j.rasm1)}${phj(j.rasm2)}</div></section>`};

/* ===== O'qituvchilar sahifasi: sayt ichidan o'zgartirish va o'chirish (parol bilan) ===== */
const OG=["direktor","orinbosarlar","oqituvchilar"];
const OT={direktor:"Maktab direktori",orinbosarlar:"Direktor o'rinbosari",oqituvchilar:"O'qituvchilar"};
const OF={direktor:[["ism","Ism-familya"],["yosh","Yoshi"],["direktor","Ish staji (masalan: 2015-yildan beri)"],["qabulKunlari","Qabul kunlari"],["qabulVaqti","Qabul vaqti"]],
 orinbosarlar:[["ism","Ism-familya"],["vazifa","Vazifasi"],["malumot","Ma'lumoti"],["yosh","Yoshi"],["staj","Ish staji"]],
 oqituvchilar:[["ism","Ism-familya"],["fan","Fani"],["yosh","Yoshi"],["malumot","Ma'lumoti"],["staj","Ish staji"]]};
const OROWS={direktor:p=>[["Yoshi",p.yosh],["Direktor",p.direktor],["Qabul kunlari",p.qabulKunlari],["Qabul vaqti",p.qabulVaqti]],
 orinbosarlar:p=>[["Vazifasi",p.vazifa],["Ma'lumoti",p.malumot],["Yoshi",p.yosh],["O'rinbosar",p.staj]],
 oqituvchilar:p=>[["Fan",p.fan],["Yoshi",p.yosh],["Ma'lumoti",p.malumot],["Ish staji",p.staj]]};
const ODEF={direktor:()=>typeof DIREKTOR!=="undefined"&&DIREKTOR?[DIREKTOR]:[],orinbosarlar:()=>typeof ORINBOSARLAR!=="undefined"?ORINBOSARLAR:[],oqituvchilar:()=>typeof OQITUVCHILAR!=="undefined"?OQITUVCHILAR:[]};
let OD={};                                   // serverda saqlangan o'zgarishlar (bo'lmasa malumotlar.js dagi ma'lumot)
const PS={mode:"view",draft:null,orig:"",off:false,note:"",tg:""};
const eff=g=>OD[g]!==undefined?OD[g]:ODEF[g]();
const phs=(src,cls)=>src?ph(src,cls,""):`<span class="ph ${cls}"></span>`;
const odam=(p,rows,x="")=>`<div class="card${x?" cdel":""}">${x}${phs(p.rasm,"pic")}<h3>${esc(String(p.ism))}</h3>${kv(rows)}</div>`;
R.oqituvchilar=()=>`<section class="page">${back}<h2>O'qituvchilar</h2><input type="file" id="ofile" accept="image/*" hidden><div id="oroot">${MUTE("Yuklanmoqda…")}</div></section>`;
INIT.oqituvchilar=async()=>{PS.mode="view";PS.draft=null;PS.note="";
  try{const d=await api("/api/odamlar");OD=Array.isArray(d)?{}:d;PS.off=false}catch(e){OD={};PS.off=true}
  drawO()};
const odBlank=()=>({_new:true});
function odCollect(){const out={},errs=[];
  for(const g of OG){out[g]=[];(PS.draft[g]||[]).forEach(p=>{const empty=OF[g].every(([k])=>!String(p[k]??"").trim())&&!p.rasm;if(empty)return;
    const o={rasm:p.rasm||""};OF[g].forEach(([k])=>{o[k]=String(p[k]??"").trim()});
    if(!o.ism)errs.push(`${OT[g]}: ism-familyani yozing.`);out[g].push(o)})}
  return{out,errs}}
const odDirty=()=>PS.draft&&JSON.stringify(odCollect().out)!==PS.orig;
const ecard=(g,i,p)=>`<div class="card ecard">${p._new?`<button class="cx" data-orm="${g}:${i}" aria-label="Ramkani olib tashlash" title="Olib tashlash">×</button>`:""}${phs(p.rasm,"pic")}<button class="btn alt ephoto" data-oph="${g}:${i}">${p.rasm?"Rasmni almashtirish":"Rasm qo'yish"}</button>${OF[g].map(([k,l])=>`<label class="fl"><span>${l}</span><input data-og="${g}" data-oi="${i}" data-ok="${k}" value="${esc(String(p[k]??""))}" maxlength="${k==="ism"?80:100}"></label>`).join("")}${p._new?'<p class="mute">Yangi ramka</p>':""}</div>`;
function drawO(){const root=$("#oroot");if(!root)return;const y=scrollY,m=PS.mode,ed=m==="edit";
  const bar=m==="view"?`<div class="jbar"><button class="btn alt" data-oedit>O'zgartirish</button><button class="btn alt warn" data-odelmode>O'chirish</button></div>`
    :m==="del"?`<div class="jbar"><button class="btn" data-odone>Tayyor</button><span class="mute">O'chirmoqchi bo'lgan ramkaning yuqori o'ng burchagidagi × tugmasini bosing.</span></div>`
    :`<div class="jbar jsticky"><button class="btn" id="osave" data-osave${odDirty()?"":" hidden"}>Saqlash</button><button class="btn alt" data-ocancel>Bekor qilish</button>${Object.keys(OD).length?'<button class="btn alt warn" data-oreset>Boshlang\'ich holatga qaytarish</button>':""}<span class="err" id="omsg"></span></div>`;
  const head=(PS.off?MUTE("Saqlangan o'zgarishlarni yuklab bo'lmadi, standart ma'lumot ko'rsatilmoqda.")+"<br>":"")+(PS.note?`<p class="ok">${esc(PS.note)}</p>`:"");PS.note="";
  const cards=g=>ed?PS.draft[g].map((p,i)=>ecard(g,i,p)).join(""):eff(g).length?eff(g).map((p,i)=>odam(p,OROWS[g](p),m==="del"?`<button class="cx" data-ox="${g}:${i}" aria-label="O'chirish" title="O'chirish">×</button>`:"")).join(""):MUTE("Ma'lumot kiritilmagan.");
  const addb=g=>ed&&g!=="direktor"?`<p style="margin-top:14px"><button class="btn alt" data-oadd="${g}">+ Yana ramka qo'shish</button></p>`:"";
  root.innerHTML=head+bar
    +`<h3 class="sub">${OT.direktor}</h3><div class="one${ed?" edit":""}">${cards("direktor")}</div>`
    +`<h3 class="sub">${OT.orinbosarlar}</h3><div class="two${ed?" edit":""}">${cards("orinbosarlar")}</div>${addb("orinbosarlar")}`
    +`<h3 class="sub">${OT.oqituvchilar}</h3><p><b>Jami o'qituvchilar: ${eff("oqituvchilar").length}ta</b></p><br><div class="grid${ed?" edit":""}">${cards("oqituvchilar")}</div>${addb("oqituvchilar")}`;
  scrollTo(0,y)}
function startOEdit(){PS.draft={};
  for(const g of OG){PS.draft[g]=eff(g).map(p=>({...p}));if(g!=="direktor"||!PS.draft[g].length)PS.draft[g].push(odBlank())}
  PS.mode="edit";PS.orig=JSON.stringify(odCollect().out);drawO()}
function odSave(){const{out,errs}=odCollect(),m=$("#omsg");
  if(errs.length){m.textContent=errs[0];return}
  const o0=JSON.parse(PS.orig),ch=OG.filter(g=>JSON.stringify(out[g])!==JSON.stringify(o0[g]));
  if(!ch.length){m.textContent="";return}
  m.textContent="";
  askPin(async pin=>{try{for(const g of ch){const r=await api("/api/odamlar/"+g,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({pin,items:out[g]})});OD[g]=r.items}
    PS.mode="view";PS.draft=null;PS.note="O'zgarishlar saqlandi.";drawO()}catch(e){const mm=$("#omsg");if(mm)mm.textContent=e.message;else alert(e.message)}})}
function odDelete(spec){const[g,i]=spec.split(":");
  askPin(async pin=>{try{const items=eff(g).filter((_,j)=>j!==+i).map(p=>({...p}));
    const r=await api("/api/odamlar/"+g,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({pin,items})});
    OD[g]=r.items;PS.note="Ramka o'chirildi.";drawO()}catch(e){alert(e.message)}})}
function odReset(){askPin(async pin=>{try{await api("/api/odamlar",{method:"DELETE",headers:{"X-Pin":pin}});OD={};PS.mode="view";PS.draft=null;PS.note="Boshlang'ich holatga qaytarildi.";drawO()}catch(e){alert(e.message)}})}
document.addEventListener("input",e=>{const t=e.target;if(PS.draft&&t.dataset&&t.dataset.og!==undefined){PS.draft[t.dataset.og][+t.dataset.oi][t.dataset.ok]=t.value;const b=$("#osave");if(b)b.hidden=!odDirty()}});
document.addEventListener("change",async e=>{if(e.target.id!=="ofile")return;const f=e.target.files[0];e.target.value="";
  if(!f||!PS.draft||!PS.tg)return;const[g,i]=PS.tg.split(":");PS.draft[g][+i].rasm=await shrink(f);drawO()});

/* ===== Dars jadvali: sayt ichidan o'zgartirish mumkin (parol bilan) ===== */
let JD={zanglar:null,sinflar:{},tartib:{}};            // serverda saqlangan o'zgarishlar
const JS={g:0,tab:0,edit:false,draft:null,orig:"",off:false,note:""};
const bells=()=>JD.zanglar||ZANGLAR;
const dayList=(k,d)=>{const a=(JD.sinflar[k]||JADVAL[k]||{})[d];return Array.isArray(a)?a:[]};
const sinflar=g=>(JD.tartib&&JD.tartib[g])||Object.keys(JADVAL).filter(k=>k.startsWith(g+"-"));
const gOver=g=>!!(JD.tartib&&JD.tartib[g])||Object.keys(JD.sinflar).some(k=>k.startsWith(g+"-"));
R.jadval=g=>{g=+g;if(!sinflar(g).length)return R.home();
  return `<section class="page">${back}<h2>${g}-sinf dars jadvali</h2><div id="jroot">${MUTE("Yuklanmoqda…")}</div></section>`};
INIT.jadval=async g=>{JS.g=+g;JS.tab=0;JS.edit=false;JS.draft=null;JS.note="";
  try{const d=await api("/api/jadval");JD={zanglar:d.zanglar||null,sinflar:d.sinflar||{},tartib:d.tartib||{}};JS.off=false}catch(e){JD={zanglar:null,sinflar:{},tartib:{}};JS.off=true}
  drawJ()};
const viewPanel=k=>{const bl=bells();
  return `<div class="jbar"><button class="btn alt" data-edit="${k}">O'zgartirish</button>${JD.sinflar[k]?'<span class="mute">Saytda o\'zgartirilgan jadval</span>':""}</div><div class="days">${KUNLAR.map(d=>{const L=dayList(k,d);
    const r=L.map((x,j)=>`<tr><td>${j+1}</td><td>${esc(String(x[2]||bl[j]||""))}</td><td>${esc(String(x[0]))}</td><td>${esc(String(x[1]||""))}</td></tr>`).join("");
    return `<div class="card"><h3>${d}</h3>${L.length?`<div class="sc"><table><tr><th>#</th><th>Vaqt</th><th>Fan</th><th>Xona</th></tr>${r}</table></div>`:MUTE("Bu kuni dars yo'q")}</div>`}).join("")}</div>`};

// Yangi sinf uchun tayyor (tasodifiy) 6 kunlik jadval: shu sinfdagi fanlardan olinadi, keyin hammasini o'zgartirish mumkin
function genDefault(g,li){const pool=((KITOBLAR[g]||{}).uz||[]).map(b=>b[1]).filter(n=>!/tarbiya/i.test(n));
  const names=pool.length>=6?pool:["Matematika","Ona tili","Adabiyot","Ingliz tili","Tarix","Geografiya","Biologiya","Fizika","Informatika","Jismoniy tarbiya"];
  const sh=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
  const room=`${Math.max(1,g-4)}${String(li+1).padStart(2,"0")}`,days={};
  KUNLAR.forEach((d,di)=>{days[d]=sh(names).slice(0,di<5?6:4).map(n=>[n,/jismoniy/i.test(n)?"Sport zal":/informatika/i.test(n)?"Kompyuter xona":room,""])});return days}
function jCollect(){const g=JS.g,errs=[],out=[],seen={};
  JS.draft.forEach((c,ci)=>{const suf=c.suf.trim(),nom=`${g}-${suf}`;
    if(!suf)errs.push(`${ci+1}-o'rindagi sinfning nomini yozing (masalan ${g}-A).`);
    else if(!/^[\p{L}\p{N}]{1,4}$/u.test(suf))errs.push(`«${nom}»: sinf nomi 1–4 ta harf yoki raqamdan iborat bo'lsin.`);
    else if(seen[suf.toLowerCase()])errs.push(`${nom} nomli sinf ikki marta yozilgan.`);
    seen[suf.toLowerCase()]=1;
    const kun={};for(const d of KUNLAR){kun[d]=[];for(const x of c.days[d]){const f=x[0].trim(),xo=x[1].trim(),v=x[2].trim();if(!f&&!xo&&!v)continue;
      if(!f){errs.push(`${nom}, ${d}: har bir darsga fan nomini yozing.`);continue}kun[d].push(v?[f,xo,v]:[f,xo])}}
    out.push({nom,kunlar:kun})});
  return{out,errs}}
const jDirty=()=>!!JS.draft&&JSON.stringify(jCollect().out)!==JS.orig;
const editPanel=ci=>{const c=JS.draft[ci],bl=bells();
  return `<div class="jbar jsticky"><button class="btn" id="jsave" data-save${jDirty()?"":" hidden"}>Saqlash</button><button class="btn alt" data-cancel>Bekor qilish</button>${gOver(JS.g)?'<button class="btn alt warn" data-reset>Boshlang\'ich holatga qaytarish</button>':""}<span class="err" id="jmsg"></span></div>
<label class="snom"><span>Sinf nomi:</span><b>${JS.g}-</b><input data-suf maxlength="4" value="${esc(c.suf)}" placeholder="A"></label>
<div class="days edit">${KUNLAR.map(d=>`<div class="card"><h3>${d}</h3>${c.days[d].map((x,i)=>`<div class="erow"><input class="ef" data-d="${d}" data-i="${i}" data-f="0" value="${esc(x[0])}" placeholder="${i+1}-dars: fan nomi" maxlength="60"><button class="edel" data-edel="${d}:${i}" aria-label="Darsni o'chirish">×</button><input data-d="${d}" data-i="${i}" data-f="1" value="${esc(x[1])}" placeholder="Xona" maxlength="30"><input data-d="${d}" data-i="${i}" data-f="2" value="${esc(x[2])}" placeholder="${esc(bl[i]||"Vaqt")}" maxlength="30"></div>`).join("")}<button class="btn alt" data-eadd="${d}">+ Dars qo'shish</button></div>`).join("")}</div>`};
function drawJ(){const root=$("#jroot");if(!root)return;const y=scrollY,ed=JS.edit,g=JS.g;
  const ks=ed?JS.draft.map(c=>`${g}-${c.suf.trim()||"?"}`):sinflar(g);if(JS.tab>=ks.length)JS.tab=Math.max(0,ks.length-1);
  const note=JS.note?`<p class="ok">${esc(JS.note)}</p>`:"";JS.note="";
  const tabs=ed?ks.map((k,i)=>`<span class="tabw"><button class="tab${i===JS.tab?" on":""}" data-tab="${i}">${esc(k)}</button><button class="tx" data-tdel="${i}" aria-label="${esc(k)} sinfini o'chirish" title="Sinfni o'chirish">×</button></span>`).join("")+`<button class="tab tplus" data-tadd aria-label="Yangi sinf qo'shish" title="Yangi sinf qo'shish">+</button>`
    :ks.map((k,i)=>`<button class="tab${i===JS.tab?" on":""}" data-tab="${i}">${esc(k)}</button>`).join("");
  root.innerHTML=(JS.off?MUTE("Saqlangan o'zgarishlarni yuklab bo'lmadi, standart jadval ko'rsatilmoqda.")+"<br>":"")+note
    +`<div class="jbar"><button class="btn alt" data-bells${ed?" disabled":""}>Qo'ng'iroq vaqtlarini o'zgartirish</button></div><div class="tabs">${tabs}</div>`
    +(ed?(JS.draft.length?`<div class="tabp">${editPanel(JS.tab)}</div>`:""):ks.map((k,i)=>`<div class="tabp"${i===JS.tab?"":" hidden"}>${viewPanel(k)}</div>`).join(""));
  scrollTo(0,y)}
function startEdit(k){const g=JS.g,ks=sinflar(g);
  JS.draft=ks.map(n=>({suf:n.slice(String(g).length+1),days:Object.fromEntries(KUNLAR.map(d=>[d,dayList(n,d).map(l=>[String(l[0]||""),String(l[1]||""),String(l[2]||"")])]))}));
  JS.tab=Math.max(0,ks.indexOf(k));JS.edit=true;JS.orig=JSON.stringify(jCollect().out);drawJ()}
function tDel(i){const nm=`${JS.g}-${JS.draft[i].suf.trim()||"?"}`;
  if(JS.draft.length<=1){alert("Kamida bitta sinf qolishi kerak.");return}
  if(!confirm(`${nm} sinfi butunlay o'chiriladi (6 kunlik jadvali va hamma fanlari bilan). «Saqlash» bosilgach o'chadi. Davom etamizmi?`))return;
  JS.draft.splice(i,1);if(JS.tab>=JS.draft.length)JS.tab=JS.draft.length-1;else if(JS.tab>i)JS.tab--;drawJ()}
function jSave(){const{out,errs}=jCollect(),m=$("#jmsg");
  if(errs.length){m.textContent=errs[0];return}
  if(!out.length){m.textContent="Kamida bitta sinf qolishi kerak.";return}
  m.textContent="";const g=JS.g,cur=out[Math.min(JS.tab,out.length-1)].nom;
  askPin(async pin=>{try{await api("/api/jadval/daraja/"+g,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({pin,sinflar:out})});
    for(const k of Object.keys(JD.sinflar))if(k.startsWith(g+"-"))delete JD.sinflar[k];
    out.forEach(o=>{JD.sinflar[o.nom]=o.kunlar});JD.tartib[g]=out.map(o=>o.nom);
    JS.edit=false;JS.draft=null;JS.tab=Math.max(0,JD.tartib[g].indexOf(cur));JS.note=`${g}-sinf jadvallari saqlandi.`;drawJ()}
  catch(e){const mm=$("#jmsg");if(mm)mm.textContent=e.message;else alert(e.message)}})}
function jReset(){const g=JS.g;
  askPin(async pin=>{try{await api("/api/jadval/daraja/"+g,{method:"DELETE",headers:{"X-Pin":pin}});
    for(const k of Object.keys(JD.sinflar))if(k.startsWith(g+"-"))delete JD.sinflar[k];delete JD.tartib[g];
    JS.edit=false;JS.draft=null;JS.tab=0;JS.note=`${g}-sinf jadvallari boshlang'ich holatga qaytarildi.`;drawJ()}catch(e){alert(e.message)}})}
function editBells(){let d=bells().map(String);
  const paint=()=>{open(`<h3>Qo'ng'iroq vaqtlari</h3><p class="mute" style="margin-bottom:10px">Bu vaqtlar hamma sinflarga qo'llanadi.</p>${d.map((v,i)=>`<div class="brow"><span>${i+1}-dars</span><input data-bi="${i}" value="${esc(v)}" maxlength="30" placeholder="08:30–09:15"><button class="edel" data-bdel="${i}" aria-label="O'chirish">×</button></div>`).join("")}<p><button class="btn alt" data-badd>+ Dars qo'shish</button></p><p class="err" id="bmsg"></p><div class="jbar"><button class="btn" data-bsave>Saqlash</button>${JD.zanglar?'<button class="btn alt warn" data-breset>Boshlang\'ich holatga qaytarish</button>':""}</div>`);
    mb.querySelectorAll("[data-bi]").forEach(i=>i.oninput=()=>{d[+i.dataset.bi]=i.value});
    mb.querySelectorAll("[data-bdel]").forEach(b=>b.onclick=()=>{d.splice(+b.dataset.bdel,1);paint()});
    $("[data-badd]",mb).onclick=()=>{d.push("");paint()};
    $("[data-bsave]",mb).onclick=()=>{const v=d.map(x=>x.trim());if(!v.length||v.some(x=>!x)){$("#bmsg").textContent="Bo'sh vaqt qoldirmang (kerak bo'lmasa × bilan o'chiring).";return}
      askPin(async pin=>{try{await api("/api/jadval/zanglar",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({pin,zanglar:v})});JD.zanglar=v;JS.note="Qo'ng'iroq vaqtlari saqlandi.";drawJ()}catch(e){alert(e.message)}})};
    const rs=$("[data-breset]",mb);if(rs)rs.onclick=()=>askPin(async pin=>{try{await api("/api/jadval/zanglar",{method:"DELETE",headers:{"X-Pin":pin}});JD.zanglar=null;JS.note="Qo'ng'iroq vaqtlari boshlang'ich holatga qaytarildi.";drawJ()}catch(e){alert(e.message)}})};
  paint()}
document.addEventListener("input",e=>{const t=e.target;if(!JS.draft||!t.dataset)return;
  if(t.dataset.f!==undefined)JS.draft[JS.tab].days[t.dataset.d][+t.dataset.i][+t.dataset.f]=t.value;
  else if(t.dataset.suf!==undefined){JS.draft[JS.tab].suf=t.value;const tb=$(`.tab[data-tab="${JS.tab}"]`);if(tb)tb.textContent=`${JS.g}-${t.value.trim()||"?"}`}
  else return;
  const b=$("#jsave");if(b)b.hidden=!jDirty()});

async function feedEv(){let a;try{a=await api("/api/events")}catch(e){a=null}const f=$("#feed");if(!f)return;
  f.innerHTML=a?a.map(p=>`<article class="card post">${p.img?`<img class="pimg" src="${p.img}" alt="">`:""}<p>${esc(p.text)}</p><button class="btn alt" data-evdel="${p.id}">Bekor qilish</button></article>`).join("")||MUTE("Hali hech narsa joylanmagan."):OFF}
R.tadbirlar=()=>`<section class="page">${back}<h2>Tadbirlar va yutuqlar</h2><div class="card form">
<button class="btn alt" id="pick">Rasm joylash</button><input type="file" id="file" accept="image/*" hidden><img id="prev" alt="" hidden>
<textarea id="txt" rows="4" placeholder="Matn yozing…"></textarea><p class="err" id="msg"></p><button class="btn" id="post">Joylash</button></div><div id="feed"></div></section>`;
INIT.tadbirlar=()=>{let img="";feedEv();
  $("#pick").onclick=()=>$("#file").click();
  $("#file").onchange=async e=>{const f=e.target.files[0];if(!f)return;img=await shrink(f);const p=$("#prev");p.src=img;p.hidden=false};
  $("#post").onclick=()=>{const t=$("#txt").value.trim(),m=$("#msg");if(!img&&!t){m.textContent="Rasm tanlang yoki matn yozing.";return}m.textContent="";
    askPin(async pin=>{try{await jpost("/api/events",{pin,text:t,img});img="";$("#txt").value="";$("#prev").hidden=true;$("#file").value="";await feedEv()}catch(e){m.textContent=e.message}})}};

async function feedNw(){let a;try{a=await api("/api/news")}catch(e){a=null}const f=$("#feed");if(!f)return;
  f.innerHTML=a?a.map(p=>`<article class="card post"><p>${esc(p.text)}</p><small>— ${esc(p.name)}</small><button class="btn alt" data-del="${p.id}">Bekor qilish</button></article>`).join("")||MUTE("Hali xabarlar yo'q."):OFF}
R.yangiliklar=()=>`<section class="page">${back}<h2>Yangiliklar va e'lonlar</h2><div class="card form">
<input id="nm" placeholder="Ismingiz" autocomplete="name"><textarea id="txt" rows="4" placeholder="Xabaringizni yozing…"></textarea>
<p class="err" id="msg"></p><button class="btn" id="post">Saqlash</button></div><div id="feed"></div></section>`;
INIT.yangiliklar=()=>{feedNw();
  $("#post").onclick=()=>{const n=$("#nm").value.trim(),t=$("#txt").value.trim(),m=$("#msg");if(!n||!t){m.textContent="Ism va xabarni yozing.";return}m.textContent="";
    askPin(async pin=>{try{const r=await jpost("/api/news",{pin,name:n,text:t});$("#nm").value="";$("#txt").value="";await feedNw()}catch(e){m.textContent=e.message}})}};

const drivePreview=u=>{
  if(!u)return"";
  if(u.includes("drive.google.com")&&u.includes("/view"))return u.replace(/\/view(\?.*)?$/,"/preview");
  return u;
};

R.kutubxona=(g,l,s)=>{g=+g;const list=(KITOBLAR[g]||{})[l];if(!list)return R.home();
  const lang=l==="ru"?"Rus tili":"O'zbek tili";
  if(s){const b=list.find(x=>x[0]===s);
    if(!b)return `<section class="page"><button class="back" data-go="kutubxona/${g}/${l}">← Ortga</button><h2>Kitob topilmadi</h2><p class="mute">Bu fan ro'yxatda yo'q. Ortga qaytib, ro'yxatdan tanlang.</p></section>`;
    const silka=b[2]||"";
    const prev=drivePreview(silka);
    return `<section class="page"><button class="back" data-go="kutubxona/${g}/${l}">← Ortga</button><h2>${g}-sinf · ${b[1]}</h2><p class="mute">${lang} · Darslik kitobi</p><br>
    ${silka?`
      <div class="card" style="margin-bottom:18px">
        <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-bottom:16px">
          <a class="btn" href="${silka}" target="_blank" rel="noopener">📖 Kitobni ochish (yangi oynada)</a>
          <button class="btn alt" id="copy-link" data-url="${silka}">Silkani nusxalash</button>
        </div>
        ${prev?`<iframe class="pdf" src="${prev}" title="${b[1]}" allow="autoplay"></iframe>`:""}
      </div>
    `:""}
    <div id="view"></div>
    <div class="card form" style="margin-top:20px">
      <h3>Kitobni sozlash</h3>
      <p class="mute" style="font-size:0.88rem;margin-bottom:14px">Kitob PDF silkasini (Google Drive, Telegram va h.k.) <b>malumotlar.js</b> fayliga yozib qo'ysangiz, kitob doimiy saqlanadi va hech qachon o'chib ketmaydi. Yoki serverga to'g'ridan-to'g'ri PDF yuklashingiz mumkin:</p>
      <button class="btn alt" id="up">PDF kitob yuklash (serverga)</button>
      <input type="file" id="pdf" accept="application/pdf" hidden>
      <p class="err" id="msg"></p>
    </div>
    </section>`}
  return `<section class="page">${back}<h2>${g}-sinf kitoblari</h2><p>${lang} · 2025–2026 o'quv yili</p><br>
  <div class="book-grid">${list.map(b=>{
    const silka=b[2]||"";
    const key=`${g}-${l}-${b[0]}`;
    return `<div class="bcard card" data-k="${key}">
      <div class="bcard-top">
        <span class="bcard-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg></span>
        <div class="bcard-info">
          <b>${b[1]}</b>
          <span class="bcard-status ${silka?'ok':''}" id="st-${key}">${silka?'Kitob silkasi ulangan':'Silka hali ulanmagan'}</span>
        </div>
      </div>
      <div class="bcard-actions">
        ${silka?`<a class="btn bcard-btn" href="${silka}" target="_blank" rel="noopener">Kitobni ochish</a>`:`<button class="btn alt bcard-btn" id="btn-${key}" data-nosilka="${esc(b[1])}">Kitobni ochish</button>`}
      </div>
    </div>`
  }).join("")}</div></section>`};
INIT.kutubxona=(g,l,s)=>{
  api("/api/books").then(h=>{
    document.querySelectorAll(".bcard[data-k]").forEach(card=>{
      const k=card.dataset.k;
      if(h.includes(k)){
        const st=$("#st-"+k);if(st&&!st.classList.contains("ok")){st.textContent="Kitob bor (serverda)";st.classList.add("ok")}
        const btn=$("#btn-"+k);if(btn&&btn.tagName==="BUTTON"){
          const a=document.createElement("a");
          a.className="btn bcard-btn";
          a.href="/pdf/"+k;
          a.target="_blank";
          a.rel="noopener";
          a.textContent="Kitobni ochish";
          btn.replaceWith(a);
        }
      }
    });
  }).catch(()=>{});
  if(s){
    const key=`${g}-${l}-${s}`;
    const show=async()=>{
      let have;try{have=await api("/api/books")}catch(e){have=null}
      const v=$("#view");if(!v)return;
      if(have&&have.includes(key)){
        const u=`/pdf/${key}?t=${Date.now()}`;
        v.innerHTML=`<div class="card" style="margin-bottom:18px"><div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-bottom:16px"><a class="btn" href="${u}" target="_blank">Yangi oynada ochish</a><a class="btn alt" href="/pdf/${key}" download="${s}.pdf">Yuklab olish</a></div><iframe class="pdf" src="${u}" title="Kitob"></iframe></div>`;
      }
    };
    show();
    $("#up").onclick=()=>$("#pdf").click();
    $("#pdf").onchange=e=>{const f=e.target.files[0];e.target.value="";if(!f)return;const m=$("#msg");
      if(f.type!=="application/pdf"&&!/\.pdf$/i.test(f.name)){m.textContent="Faqat PDF fayl yuklang.";return}
      m.textContent="";
      askPin(async pin=>{
        m.className="";m.textContent="Yuklanmoqda…";
        try{await api("/api/books/"+key,{method:"PUT",headers:{"X-Pin":pin},body:f});m.textContent="";await show()}catch(x){m.className="err";m.textContent=x.message}
      });
    };
  }
};

function route(){close();const[p,...a]=location.hash.slice(1).split("/").map(x=>{try{return decodeURIComponent(x)}catch(e){return x}});app.innerHTML=(R[p]||R.home)(...a);INIT[p]&&INIT[p](...a);scrollTo(0,0);if($("#cd")){CH.edit=false;loadChorak()}}
addEventListener("hashchange",route);

document.addEventListener("click",e=>{const t=e.target,c=s=>t.closest(s);let x;
  const mn=$("#mnav");if(mn&&!mn.hidden&&!c("[data-burger]")){mn.hidden=true;$("[data-burger]").setAttribute("aria-expanded","false")}
  if(c("[data-theme-toggle]"))return setTheme(document.documentElement.dataset.theme==="dark"?"light":"dark");
  if(c("[data-burger]")){const o=mn.hidden;mn.hidden=!o;$("[data-burger]").setAttribute("aria-expanded",String(o));return}
  if(c("[data-cd-edit]"))return cdEdit();
  if(c("[data-cd-cancel]")){CH.edit=false;$("#cd").innerHTML=cdView();return cdTick()}
  if(c("[data-cd-save]"))return cdSave();
  if(c("[data-oedit]"))return startOEdit();
  if(c("[data-odelmode]")){PS.mode="del";return drawO()}
  if(c("[data-odone]")){PS.mode="view";return drawO()}
  if(c("[data-ocancel]")){if(odDirty()&&!confirm("O'zgarishlar saqlanmaydi. Chiqaymi?"))return;PS.mode="view";PS.draft=null;return drawO()}
  if(x=c("[data-oadd]")){PS.draft[x.dataset.oadd].push(odBlank());return drawO()}
  if(x=c("[data-orm]")){const[g,i]=x.dataset.orm.split(":");PS.draft[g].splice(+i,1);return drawO()}
  if(x=c("[data-oph]")){PS.tg=x.dataset.oph;return $("#ofile").click()}
  if(c("[data-osave]"))return odSave();
  if(x=c("[data-ox]"))return odDelete(x.dataset.ox);
  if(c("[data-oreset]"))return odReset();
  if(t===modal||c(".x"))return close();
  if(x=c("[data-th]"))return setTheme(x.dataset.th);
  if(x=c("[data-evdel]")){const i=x.dataset.evdel;askPin(pin=>api("/api/events/"+i,{method:"DELETE",headers:{"X-Pin":pin}}).then(feedEv).catch(e=>alert(e.message)));return}
  if(x=c("[data-del]")){const i=x.dataset.del;askPin(pin=>api("/api/news/"+i,{method:"DELETE",headers:{"X-Pin":pin}}).then(feedNw).catch(e=>alert(e.message)));return}
  if(x=c("[data-edit]"))return startEdit(x.dataset.edit);
  if(c("[data-cancel]")){if(JS.draft&&jDirty()&&!confirm("O'zgarishlar saqlanmaydi. Chiqaymi?"))return;JS.edit=false;JS.draft=null;return drawJ()}
  if(x=c("[data-eadd]")){JS.draft[JS.tab].days[x.dataset.eadd].push(["","",""]);return drawJ()}
  if(x=c("[data-edel]")){const[d,i]=x.dataset.edel.split(":");JS.draft[JS.tab].days[d].splice(+i,1);return drawJ()}
  if(c("[data-tadd]")){const ci=JS.draft.length;JS.draft.push({suf:"",days:genDefault(JS.g,ci)});JS.tab=ci;drawJ();const sf=$("[data-suf]");if(sf)sf.focus();return}
  if(x=c("[data-tdel]"))return tDel(+x.dataset.tdel);
  if(c("[data-save]"))return jSave();
  if(c("[data-reset]"))return jReset();
  if(c("[data-bells]"))return editBells();
  if(x=c("[data-tab]")){JS.tab=+x.dataset.tab;if(JS.edit)return drawJ();document.querySelectorAll(".tab").forEach((b,i)=>b.classList.toggle("on",i==x.dataset.tab));document.querySelectorAll(".tabp").forEach((b,i)=>b.hidden=i!=x.dataset.tab);return}
  if(c("[data-map]"))return open(`<h3>Maktab xaritada</h3><iframe src="https://maps.google.com/maps?q=${S.map}&z=17&output=embed" title="Xarita" loading="lazy"></iframe><p style="margin-top:12px"><a class="btn" href="https://www.google.com/maps?q=${S.map}" target="_blank" rel="noopener">Google Maps'da ochish</a></p>`);
  if(x=c("[data-nosilka]"))return alert(`«${x.dataset.nosilka}» fani uchun kitob silkasi hali ulanmagan.\n\nSilka ulash uchun public/malumotlar.js faylini ochib, «${x.dataset.nosilka}» qatoriga kitob PDF silkasini yozib qo'ying.`);
  if(x=c("[data-g]")){const g=x.dataset.g;return x.dataset.k==="jadval"?(close(),location.hash="jadval/"+g):open(`<h3>${g}-sinf: tilni tanlang</h3><div class="chips til-chips"><button class="btn alt" data-go="kutubxona/${g}/uz">O'zbek tili</button><button class="btn alt" data-go="kutubxona/${g}/ru">Rus tili</button></div>`)}
  if(x=c("[data-m]")){const m=x.dataset.m;return m==="jadval"||m==="kutubxona"?grades(m):location.hash=m}
  if(x=c("[data-go]")){close();location.hash=x.dataset.go}});

function setTheme(v){document.documentElement.dataset.theme=v;const sw=$(".sw");if(sw)sw.setAttribute("aria-checked",String(v==="dark"));try{localStorage.th=v}catch(e){}}
setTheme((()=>{try{return localStorage.th}catch(e){}})()||(matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light"));
$("#mnav").innerHTML=MENU.map(m=>`<button data-m="${m[0]}"><span class="ic"><svg viewBox="0 0 24 24" aria-hidden="true">${m[2]}</svg></span>${m[1]}</button>`).join("");
document.title=S.name;$("#b1").textContent=S.short1;$("#b2").textContent=S.short2;route();
