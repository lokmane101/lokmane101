import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const assets = new URL('../assets/', import.meta.url);
const logo = `data:image/png;base64,${(await readFile(new URL('lokmane-akkouh-symbol.png', assets))).toString('base64')}`;
const esc = s => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
const text = (x,y,s,size=22,fill='#173D36',extra='') => `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" ${extra}>${esc(s)}</text>`;
const wrap = (w,h,title,body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(title)}"><title>${esc(title)}</title><g font-family="Segoe UI, Arial, sans-serif">${body}</g></svg>\n`;
const motionStyle = '<style>@media(prefers-reduced-motion:reduce){.signal{display:none}}</style>';
const packet = (path, duration=8, delay=0, color='#397CAB', radius=4) => `<circle class="signal" r="${radius}" fill="${color}" opacity="0"><animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.08;0.92;1" dur="${duration}s" begin="${delay}s" repeatCount="indefinite"/><animateMotion path="${path}" dur="${duration}s" begin="${delay}s" repeatCount="indefinite"/></circle>`;
async function saveVariants(name, w, h, title, body) {
  await writeFile(new URL(`${name}.svg`,assets),wrap(w,h,title,body));
  const still=body.replace(/<circle class="signal"[\s\S]*?<\/circle>/g,'');
  await writeFile(new URL(`${name}-static.svg`,assets),wrap(w,h,title,still));
}

function dataScene() {
  let scene='<path d="M250 226 447 326 250 426 53 326Z" fill="#ADCDBE" opacity="0.3"/>';
  const routes=[
    'M42 190V246Q42 276 75 276H112',
    'M66 92H88Q112 92 112 116V144',
    'M388 144H427Q452 144 452 119V87',
    'M388 276H438Q459 276 459 297V326'
  ];
  routes.forEach((d,i)=>{scene+=`<path d="${d}" fill="none" stroke="#568D79" stroke-width="2"/>${packet(d,6+i,-i*1.8,i>1?'#397CAB':'#28664F',4.5)}`;});
  scene+='<g fill="#EDF5F2" stroke="#8BB6A2" stroke-width="1.5"><rect x="17" y="138" width="50" height="52" rx="8"/><rect x="16" y="66" width="50" height="52" rx="8"/><rect x="419" y="25" width="67" height="62" rx="9"/><rect x="430" y="326" width="58" height="48" rx="9"/></g>';
  scene+='<g fill="none" stroke="#397CAB" stroke-width="2" stroke-linecap="round"><path d="M29 153H55M29 163H48M29 173H53"/><ellipse cx="41" cy="82" rx="13" ry="5"/><path d="M28 82V101C28 108 54 108 54 101V82M28 92C28 99 54 99 54 92"/><path d="m443 341-7 9 7 9m31-18 7 9-7 9m-11-20-7 22"/></g>';
  scene+='<g fill="#397CAB"><rect x="431" y="57" width="9" height="18" rx="2"/><rect x="447" y="43" width="9" height="32" rx="2"/><rect x="463" y="51" width="9" height="24" rx="2"/></g>';
  const planes=[{y:276,top:'#377D65',left:'#245E4B',right:'#2A6B55'},{y:210,top:'#83B8A0',left:'#508D73',right:'#65A186'},{y:144,top:'#D9F0E2',left:'#9DCCB3',right:'#B6DDC6'}];
  for(const [i,p] of planes.entries()) {
    scene+=`<path d="M112 ${p.y} 250 ${p.y+70} 250 ${p.y+88} 112 ${p.y+18}Z" fill="${p.left}"/><path d="M250 ${p.y+70} 388 ${p.y} 388 ${p.y+18} 250 ${p.y+88}Z" fill="${p.right}"/><path d="M250 ${p.y-70} 388 ${p.y} 250 ${p.y+70} 112 ${p.y}Z" fill="${p.top}" stroke="#EDF5F2" stroke-opacity="0.65" stroke-width="1.2"/>`;
    if(i<2)for(let j=0;j<3;j++){
      const x=170+j*32,y=p.y+30+j*16;
      scene+=`<path d="M${x} ${y}l18 9" stroke="${i===0?'#80B39B':'#CDE8D8'}" stroke-width="3" stroke-linecap="round"/>`;
    }
  }
  for(let row=0;row<3;row++)for(let col=0;col<3;col++){
    const x=250+(col-row)*38,y=103+(col+row)*19;
    scene+=`<path d="M${x} ${y-10}l27 14-27 14-27-14Z" fill="${(row+col)%2?'#B6DDC6':'#C5E6D2'}" stroke="#9AC7AE" stroke-width="0.8"/>`;
  }
  scene+='<path d="M220 119 250 134 250 166 220 151Z" fill="#245E86"/><path d="M250 134 280 119 280 151 250 166Z" fill="#397CAB"/><path d="M250 104 280 119 250 134 220 119Z" fill="#72B4CF" stroke="#D9F0E2" stroke-width="1.2"/>';
  scene+='<path d="M250 110 254 117 265 119 254 122 250 128 246 122 235 119 246 117Z" fill="#EDF5F2"/>';
  const edge='M112 144 250 214 388 144';
  scene+=`<path d="${edge}" fill="none" stroke="#639F83" stroke-opacity="0.5"/>${packet(edge,8,-2,'#397CAB',3.5)}`;
  return scene;
}

for (const lang of ['en','fr']) {
  for (const mobile of [false,true]) {
    const w=mobile?600:1200, h=mobile?740:480;
    let body=`<defs><clipPath id="frame"><rect width="${w}" height="${h}" rx="20"/></clipPath></defs>${motionStyle}<g clip-path="url(#frame)"><rect width="${w}" height="${h}" fill="#EDF5F2"/>`;
    body+=mobile?'<path d="M0 460Q280 290 600 436V740H0Z" fill="#D6E9E0"/>':'<path d="M785 0H1200V480H660Q745 295 785 0Z" fill="#D6E9E0"/>';
    body+=`<g transform="translate(${mobile?50:700} ${mobile?318:35})">${dataScene()}</g>`;
    body+=`<image href="${logo}" x="${mobile?24:32}" y="20" width="76" height="76"/>`;
    body+=text(mobile?111:124,54,'Lokmane Akkouh',24,'#173D36','font-weight="650"');
    body+=text(mobile?111:124,80,'Data & AI Engineer',16,'#49675E');
    body+=text(mobile?36:48,mobile?157:201,lang==='en'?'From raw data':'De la donnée',mobile?49:61,'#173D36','font-weight="700" letter-spacing="-2"');
    body+=text(mobile?36:48,mobile?216:272,lang==='en'?'to useful systems.':'aux solutions.',mobile?49:61,'#173D36','font-weight="700" letter-spacing="-2"');
    body+=text(mobile?38:50,mobile?255:321,lang==='en'?'Data engineering / Cloud / Applied AI':'Ingénierie data / Cloud / IA appliquée',mobile?21:20,'#49675E');
    const railY=mobile?294:405,railX=mobile?36:48,step=mobile?180:184;
    const labels=lang==='fr'?['Collecter','Transformer','Exploiter']:['Ingest','Transform','Serve'];
    const railPath=`M${railX+78} ${railY}H${railX+step*2+78}`;
    body+=`<path d="${railPath}" stroke="#8DBBA8" fill="none" stroke-width="1.5"/>${packet(railPath,7,0,'#397CAB',4)}`;
    labels.forEach((label,i)=>{
      body+=`<rect x="${railX+i*step}" y="${railY-21}" width="156" height="42" rx="21" fill="${i===1?'#173D36':'#EDF5F2'}" stroke="${i===1?'#173D36':'#99C0AE'}"/>`;
      body+=text(railX+i*step+78,railY+7,label,19,i===1?'#F3FAF6':'#173D36','text-anchor="middle" font-weight="600"');
    });
    body+='</g>';
    await saveVariants(`hero-${lang}${mobile?'-mobile':''}`,w,h,'Lokmane Akkouh — Data & AI Engineer',body);
  }
}

for (const lang of ['en','fr']) {
  for (const mobile of [false,true]) {
    const w=mobile?600:1200,h=mobile?700:340;
    let body=`${motionStyle}<rect width="${w}" height="${h}" rx="16" fill="#173D36"/>`;
    body+=text(36,48,lang==='en'?'Inside PatentAnalysis':'Au cœur de PatentAnalysis',mobile?28:30,'#F0F8F4','font-weight="650"');
    body+=text(36,79,lang==='en'?'A collaborative data engineering project':'Un projet collectif d’ingénierie des données',mobile?19:20,'#ACCEC2');
    const items=lang==='en'?[
      ['Patent sources','USPTO / EPO / CIPO','Google Patents'],['MongoDB Atlas','Document storage','Raw patent data'],['PySpark','Clean & transform','Consistent datasets'],['PostgreSQL','Data warehouse','Structured data'],['Power BI + Flask','Explore & visualize','Web dashboards']
    ]:[
      ['Sources de brevets','USPTO / EPO / CIPO','Google Patents'],['MongoDB Atlas','Stockage documentaire','Données brutes'],['PySpark','Nettoyer et transformer','Données harmonisées'],['PostgreSQL','Entrepôt de données','Données structurées'],['Power BI + Flask','Explorer et visualiser','Tableaux de bord web']
    ];
    items.forEach((item,i)=>{
      const x=mobile?36:36+i*232, y=mobile?112+i*109:132, cw=mobile?528:200, ch=mobile?88:135;
      if(i<4)body+=mobile?`<path d="M300 ${y+ch}v21" stroke="#87C9B5" stroke-width="2"/>`:`<path d="M${x+cw} 198h32" stroke="#87C9B5" stroke-width="2"/><path d="m${x+cw+24} 193 7 5-7 5" fill="none" stroke="#87C9B5" stroke-width="2"/>`;
      if(i<4)body+=packet(mobile?`M300 ${y+ch}v21`:`M${x+cw} 198h32`,3,-i*0.65,'#E7FFF3',3.5);
      body+=`<rect x="${x}" y="${y}" width="${cw}" height="${ch}" rx="8" fill="${i===2?'#D5EDE4':'#244F44'}" stroke="${i===2?'#D5EDE4':'#4B7669'}"/>`;
      const ink=i===2?'#173D36':'#F0F8F4',secondary=i===2?'#385F51':'#B8D5C9';
      body+=text(x+18,y+32,item[0],mobile?24:20,ink,'font-weight="650"');
      body+=text(x+18,y+(mobile?61:65),item[1],mobile?18:16,secondary);
      if(!mobile)body+=text(x+18,y+91,item[2],16,secondary);
      if(mobile&&i<4)body+=`<path d="m295 ${y+ch+13} 5 7 5-7" fill="none" stroke="#87C9B5" stroke-width="2"/>`;
    });
    body+=text(36,h-22,lang==='en'?'Architecture overview · based on the project README':'Vue d’ensemble · d’après la documentation du projet',mobile?17:16,'#ACCEC2');
    await saveVariants(`pipeline-${lang}${mobile?'-mobile':''}`,w,h,'PatentAnalysis: sources, MongoDB, PySpark, PostgreSQL, Power BI and Flask',body);
  }
}
console.log(`Brand assets generated in ${fileURLToPath(assets)}`);
