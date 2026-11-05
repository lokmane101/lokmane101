import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const assets = new URL('../assets/', import.meta.url);
const logo = `data:image/png;base64,${(await readFile(new URL('lokmane-akkouh-symbol.png', assets))).toString('base64')}`;
const portrait = `data:image/webp;base64,${(await readFile(new URL('portrait-cutout.webp', assets))).toString('base64')}`;
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

for (const lang of ['en','fr']) {
  for (const mobile of [false,true]) {
    const w=mobile?600:1200, h=mobile?740:480;
    let body=`<defs><clipPath id="frame"><rect width="${w}" height="${h}" rx="20"/></clipPath></defs>${motionStyle}<g clip-path="url(#frame)"><rect width="${w}" height="${h}" fill="#EDF5F2"/>`;
    body+=mobile?'<path d="M0 460Q280 290 600 436V740H0Z" fill="#D6E9E0"/>':'<path d="M785 0H1200V480H660Q745 295 785 0Z" fill="#D6E9E0"/>';
    const cx=mobile?312:976,cy=mobile?584:284,r=mobile?214:242;
    body+=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="#BDDCCD"/><circle cx="${cx}" cy="${cy}" r="${r+28}" fill="none" stroke="#82B39D" stroke-opacity="0.35"/>`;
    const paths=mobile?[
      'M-20 650C70 416 462 346 610 500',
      'M-20 546C102 740 518 690 620 432',
      'M82 385C-38 594 286 802 563 666'
    ]:[
      'M657 415C710 181 998 -46 1228 126',
      'M654 114C748 425 1069 521 1247 243',
      'M765 -45C620 181 843 490 1161 463'
    ];
    paths.forEach((d,i)=>{body+=`<path d="${d}" fill="none" stroke="${i===1?'#397CAB':'#4B8B73'}" stroke-opacity="${i===1?0.26:0.36}" stroke-width="1.5"/>${packet(d,9+i*2,-i*3,i===1?'#397CAB':'#2D6B54',4)}`;});
    const points=mobile?[[79,472],[533,461],[73,637],[550,657]]:[[730,126],[1120,53],[689,354],[1162,416]];
    points.forEach(([x,y])=>{body+=`<circle cx="${x}" cy="${y}" r="10" fill="#EDF5F2" stroke="#84B7A1"/><circle cx="${x}" cy="${y}" r="3" fill="#397CAB"/>`;});
    body+=`<image href="${portrait}" x="${mobile?112:722}" y="${mobile?330:28}" width="${mobile?390:480}" height="${mobile?458:564}" preserveAspectRatio="xMidYMin meet"/>`;
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
