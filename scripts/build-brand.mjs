import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const assets = new URL('../assets/', import.meta.url);
const logo = `data:image/png;base64,${(await readFile(new URL('lokmane-akkouh-symbol.png', assets))).toString('base64')}`;
const esc = s => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
const text = (x,y,s,size=22,fill='#173D36',extra='') => `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" ${extra}>${esc(s)}</text>`;
const wrap = (w,h,title,body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(title)}"><title>${esc(title)}</title><g font-family="Segoe UI, Arial, sans-serif">${body}</g></svg>\n`;

for (const lang of ['en','fr']) {
  for (const mobile of [false,true]) {
    const w=mobile?600:1200, h=mobile?560:400;
    let body=`<rect width="${w}" height="${h}" rx="20" fill="#EDF5F2"/>`;
    body+=`<image href="${logo}" x="32" y="22" width="80" height="80"/>`;
    body+=text(128,60,'Lokmane Akkouh',24,'#173D36','font-weight="650"');
    body+=text(128,85,'Data & AI Engineer',16,'#49675E');
    body+=text(48,mobile?168:190,lang==='en'?'From raw data':'De la donnée',mobile?49:58,'#173D36','font-weight="700" letter-spacing="-2"');
    body+=text(48,mobile?227:258,lang==='en'?'to useful systems.':'aux solutions.',mobile?49:58,'#173D36','font-weight="700" letter-spacing="-2"');
    body+=text(50,mobile?272:310,lang==='en'?'Data engineering / Cloud / Applied AI':'Ingénierie data / Cloud / IA appliquée',mobile?21:20,'#49675E');
    const gx=mobile?48:790, gy=mobile?310:50, gw=mobile?504:360, gh=mobile?210:300;
    body+=`<rect x="${gx}" y="${gy}" width="${gw}" height="${gh}" rx="14" fill="#173D36"/>`;
    const points=mobile?[[gx+65,gy+67],[gx+250,gy+67],[gx+435,gy+67],[gx+250,gy+153]]:[[gx+63,gy+65],[gx+180,gy+145],[gx+295,gy+65],[gx+295,gy+230],[gx+63,gy+230]];
    const links=mobile?[[0,1],[1,2],[1,3]]:[[0,1],[2,1],[1,3],[1,4]];
    body+='<style>@media(prefers-reduced-motion:reduce){.signal{display:none}}</style>';
    for(const [a,b] of links){const p=points[a],q=points[b];const d=`M${p[0]} ${p[1]} C${p[0]} ${(p[1]+q[1])/2},${q[0]} ${(p[1]+q[1])/2},${q[0]} ${q[1]}`;body+=`<path d="${d}" fill="none" stroke="#73B9A7" stroke-width="2"/><circle class="signal" r="3" fill="#D5EDE4"><animateMotion path="${d}" dur="6s" repeatCount="2" fill="freeze"/></circle>`;}
    points.forEach(([x,y],i)=>{body+=`<circle cx="${x}" cy="${y}" r="${i===1?29:19}" fill="${i===1?'#BDEADB':'#264F46'}" stroke="#7DBEAB"/>`;body+=`<circle cx="${x}" cy="${y}" r="5" fill="${i===1?'#173D36':'#BDEADB'}"/>`;});
    const labels=lang==='fr'?(mobile?['Collecter','Transformer','Exposer','Apprendre']:['Collecter','Transformer','Connecter','Exposer','Apprendre']):(mobile?['Collect','Transform','Serve','Learn']:['Collect','Transform','Connect','Serve','Learn']);
    points.forEach(([x,y],i)=>{body+=text(x,y+(i===1?48:37),labels[i],15,'#E0F1EA','text-anchor="middle"');});
    await writeFile(new URL(`hero-${lang}${mobile?'-mobile':''}.svg`,assets),wrap(w,h,'Lokmane Akkouh — Data & AI Engineer',body));
  }
}

for (const lang of ['en','fr']) {
  for (const mobile of [false,true]) {
    const w=mobile?600:1200,h=mobile?700:340;
    let body=`<rect width="${w}" height="${h}" rx="16" fill="#173D36"/>`;
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
      body+=`<rect x="${x}" y="${y}" width="${cw}" height="${ch}" rx="8" fill="${i===2?'#D5EDE4':'#244F44'}" stroke="${i===2?'#D5EDE4':'#4B7669'}"/>`;
      const ink=i===2?'#173D36':'#F0F8F4',secondary=i===2?'#385F51':'#B8D5C9';
      body+=text(x+18,y+32,item[0],mobile?24:20,ink,'font-weight="650"');
      body+=text(x+18,y+(mobile?61:65),item[1],mobile?18:16,secondary);
      if(!mobile)body+=text(x+18,y+91,item[2],16,secondary);
      if(mobile&&i<4)body+=`<path d="m295 ${y+ch+13} 5 7 5-7" fill="none" stroke="#87C9B5" stroke-width="2"/>`;
    });
    body+=text(36,h-22,lang==='en'?'Architecture overview · based on the project README':'Vue d’ensemble · d’après la documentation du projet',mobile?17:16,'#ACCEC2');
    await writeFile(new URL(`pipeline-${lang}${mobile?'-mobile':''}.svg`,assets),wrap(w,h,'PatentAnalysis: sources, MongoDB, PySpark, PostgreSQL, Power BI and Flask',body));
  }
}
console.log(`Brand assets generated in ${fileURLToPath(assets)}`);
