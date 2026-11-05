import { mkdir, readFile, writeFile } from 'node:fs/promises';

const owner = 'lokmane101';
const assets = new URL('../assets/', import.meta.url);
const offline = process.argv.includes('--offline');
const escape = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
let snapshot;

if (offline) {
  snapshot = JSON.parse(await readFile(new URL('repositories.json', assets), 'utf8'));
} else {
  const headers = { Accept: 'application/vnd.github+json', 'User-Agent': `${owner}-profile`, 'X-GitHub-Api-Version': '2022-11-28' };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const repos = [];
  for (let page = 1; ; page++) {
    const response = await fetch(`https://api.github.com/users/${owner}/repos?type=owner&per_page=100&page=${page}`, { headers, signal: AbortSignal.timeout(30000) });
    if (!response.ok) throw new Error(`GitHub API returned ${response.status}; existing assets have been preserved.`);
    const batch = await response.json();
    if (!Array.isArray(batch)) throw new Error('Unexpected GitHub API response.');
    repos.push(...batch);
    if (batch.length < 100) break;
  }
  snapshot = {
    owner,
    collectedAt: new Date().toISOString().slice(0,10),
    source: `https://api.github.com/users/${owner}/repos`,
    method: 'Public non-fork repositories, excluding the profile repository; one count per repository, grouped by GitHub primary language. Not a skill rating.',
    repositories: repos.filter(repo => !repo.private && !repo.fork && repo.name !== owner)
      .map(repo => ({ name: repo.name, url: repo.html_url, primaryLanguage: repo.language ?? 'Unspecified' }))
      .sort((a,b) => a.name.localeCompare(b.name,'en'))
  };
}

if (!Array.isArray(snapshot.repositories) || snapshot.repositories.some(repo => typeof repo.primaryLanguage !== 'string')) throw new Error('Invalid repository data.');
const counts = new Map();
for (const repo of snapshot.repositories) counts.set(repo.primaryLanguage, (counts.get(repo.primaryLanguage) ?? 0) + 1);
const entries = [...counts].sort((a,b)=> b[1]-a[1] || a[0].localeCompare(b[0],'en'));
const colors = ['#173D36','#287363','#397CAB','#5868A8','#73778D','#A29E70','#766350','#3F858A'];

function render(lang, mobile) {
  const w=mobile?600:1200;
  const rows=entries.length;
  const h=mobile?232+Math.max(rows,1)*54:158+Math.max(Math.ceil(rows/2),1)*65;
  let body=`<rect width="${w}" height="${h}" rx="16" fill="#EDF5F2"/>`;
  const text=(x,y,value,size=22,color='#173D36',attrs='')=>`<text x="${x}" y="${y}" fill="${color}" font-size="${size}" ${attrs}>${escape(value)}</text>`;
  body+=text(36,48,lang==='fr'?'Le code, en un regard':'The code, at a glance',mobile?30:32,'#173D36','font-weight="650"');
  body+=text(36,80,lang==='fr'?'Dépôts regroupés par langage principal':'Repositories grouped by primary language',mobile?20:22,'#49675E');
  const total=snapshot.repositories.length;
  body+=text(mobile?36:1160,mobile?122:48,`${total} ${lang==='fr'?'dépôts publics':'public repositories'}`,mobile?24:24,'#173D36',mobile?'font-weight="650"':'text-anchor="end" font-weight="650"');
  const barY=mobile?148:110, barW=w-72;
  let offset=36;
  entries.forEach(([label,count],i)=>{
    const segment=total?barW*count/total:0;
    body+=`<rect x="${offset}" y="${barY}" width="${segment}" height="16" fill="${colors[i%colors.length]}"/>`;
    offset+=segment;
    const x=mobile?36:36+(i%2)*580, y=(mobile?213:180)+(mobile?i:Math.floor(i/2))*(mobile?54:65);
    body+=`<circle cx="${x+7}" cy="${y-8}" r="7" fill="${colors[i%colors.length]}"/>`;
    body+=text(x+26,y,label,mobile?24:24);
    body+=text(x+(mobile?528:510),y,String(count),24,'#173D36','text-anchor="end" font-weight="650"');
  });
  if(total===0)body+=text(36,185,lang==='fr'?'Aucun dépôt public éligible.':'No eligible public repositories.',22,'#49675E');
  body+=text(36,h-22,`${lang==='fr'?'Source : GitHub · relevé du':'Source: GitHub · captured'} ${snapshot.collectedAt}`,mobile?17:17,'#49675E');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img"><title>${escape(`${total} public repositories: ${entries.map(([k,v])=>`${k}: ${v}`).join(', ')}. Snapshot ${snapshot.collectedAt}.`)}</title><g font-family="Segoe UI, Arial, sans-serif">${body}</g></svg>\n`;
}

await mkdir(assets,{recursive:true});
for(const lang of ['en','fr'])for(const mobile of [false,true]) {
  const name=`repositories${lang==='fr'?'-fr':''}${mobile?'-mobile':''}.svg`;
  await writeFile(new URL(name,assets),render(lang,mobile));
}
await writeFile(new URL('repositories.json',assets),JSON.stringify(snapshot,null,2)+'\n');
console.log(`Updated ${snapshot.repositories.length} public repositories across ${entries.length} primary languages (${snapshot.collectedAt}).`);
