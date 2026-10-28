import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import sharp from 'sharp';

// Only derivatives are written; material-final is always read-only.
export const imageMap = {
  'dragon/1000164111.jpg': 'recuerdos/dragon/esqueleto.webp',
  'dragon/1000164110.jpg': 'recuerdos/dragon/caja.webp',
  'arca/1000164108.jpg': 'recuerdos/arca/interior.webp',
  'arca/1000164109.jpg': 'recuerdos/arca/completa.webp',
  'arca/1000164107.jpg': 'recuerdos/brasil/frente-al-mar.webp',
  'brasil/1000164106.jpg': 'recuerdos/brasil/playa.webp',
  'extras/1000164125.jpg': 'recuerdos/grupo-aula.webp',
  'extras/1000164122.jpg': 'recuerdos/extras/en-clase.webp',
  'extras/1000164123.jpg': 'recuerdos/extras/selfie.webp',
  'extras/1000164126.jpg': 'recuerdos/extras/colectivo.webp',
  'extras/1000164129.jpg': 'recuerdos/extras/mesa.webp',
  'extras/foto-danilo-gracioso.jpg': 'recuerdos/extras/retrato.webp',
  ...Object.fromEntries(['ortega','fio','florencia','zarate','mati','thiago','nahuel','arturo'].map(n=>[`alumnos/${n}.jpg`,`alumnos/${n}.webp`])),
};
export const videoMap = {
  'brasil/1000164097.mp4': ['brasil-playa', 2.3],
  'competencias/1000164120.mp4': ['danilo-competencia', 3.55],
  'videos/1000164121.mp4': ['sombrero', 2.3],
  'videos/1000164127.mp4': ['encuentro', 9.7],
  'videos/video-danilo-gracioso.mp4': ['gesto', 0.6],
};
const results = [];
for (const [source, dest] of Object.entries(imageMap)) {
  const target = `public/media/${dest}`;
  await mkdir(path.dirname(target), {recursive:true});
  await sharp(`material-final/${source}`).rotate().resize({width:source.startsWith('alumnos/')?960:1800,height:1800,fit:'inside',withoutEnlargement:true}).webp({quality:88,effort:6}).toFile(target);
  results.push({source,dest:target,bytes:(await readFile(target)).length});
}
await mkdir('public/media/videos',{recursive:true});
for (const [source, [name, posterTime]] of Object.entries(videoMap)) {
  const dest=`public/media/videos/${name}.mp4`;
  execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-y','-i',`material-final/${source}`,'-map','0:v:0','-map','0:a?','-c:v','libx264','-preset','slow','-crf','24','-vf','fps=30,scale=trunc(iw/2)*2:trunc(ih/2)*2','-pix_fmt','yuv420p','-c:a','aac','-b:a','96k','-movflags','+faststart',dest]);
  // Existing browser-compatible originals are remuxed losslessly if encoding grew them.
  if ((await readFile(dest)).length > (await readFile(`material-final/${source}`)).length)
    execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-y','-i',`material-final/${source}`,'-map','0:v:0','-map','0:a?','-c','copy','-movflags','+faststart',dest]);
  const frame=execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-ss',String(posterTime),'-i',`material-final/${source}`,'-frames:v','1','-f','image2pipe','-vcodec','png','-']);
  await sharp(frame).webp({quality:90}).toFile(`public/media/videos/${name}.webp`);
  results.push({source,dest,bytes:(await readFile(dest)).length});
}
const context=execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-ss','0.3','-i','material-final/competencias/1000164120.mp4','-frames:v','1','-f','image2pipe','-vcodec','png','-']);
await sharp(context).webp({quality:90}).toFile('public/media/videos/competencia-contexto.webp');
await mkdir('artifacts/final-media',{recursive:true});
await writeFile('artifacts/final-media/optimized.json',JSON.stringify(results,null,2));
console.log(`${results.length} derivados; ${(results.reduce((n,r)=>n+r.bytes,0)/1024/1024).toFixed(2)} MiB, sin posters.`);
