import {chromium} from '@playwright/test';
import sharp from 'sharp';
import {mkdir,writeFile} from 'node:fs/promises';
const folder='docs/screenshots/curated';await mkdir(folder,{recursive:true});
const browser=await chromium.launch({channel:'chrome'});
const report=[];
for(const width of [1440,390,360,768]){
 const page=await browser.newPage({viewport:{width,height:width<768?844:1000}});
 // Freeze each newly arriving native video for a stable composition capture.
 // Full natural playback/loop counts are tested separately by Playwright.
 await page.addInitScript(()=>{
  window.captureFreeze=true;
  document.addEventListener('play',e=>{if(window.captureFreeze&&e.target instanceof HTMLVideoElement)e.target.pause();},true);
  document.addEventListener('ended',()=>{window.captureFreeze=true;},true);
 });
 const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 await page.clock.install({time:new Date('2026-10-28T10:00:00Z')});
 await page.clock.pauseAt(new Date('2026-10-28T10:00:01Z'));
 await page.goto('http://127.0.0.1:4173/');
 async function save(name){
  await page.evaluate(async()=>{window.scrollTo(0,0);await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});
  await sharp(await page.screenshot({fullPage:true,animations:'disabled'})).webp({quality:85}).toFile(`${folder}/${name}-${width}.webp`);
  if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))errors.push('Overflow: '+name);
 }
 async function video(name){
  const node=page.locator('video');await node.waitFor();
  await node.evaluate(v=>v.pause());await page.clock.runFor(850);await save(name);
  const src=await node.getAttribute('src');
  for(let i=0;i<100;i++){if(await node.evaluate(v=>v.readyState>=1))break;await new Promise(r=>setTimeout(r,100));}
  await node.evaluate(async v=>{window.captureFreeze=false;v.loop=false;v.currentTime=Math.max(0,v.duration-.08);await v.play();});
  let changed=false;
  for(let i=0;i<100;i++){if(await page.evaluate(()=>document.querySelector('video')?.getAttribute('src')??null)!==src){changed=true;break;}await new Promise(r=>setTimeout(r,100));}
  if(!changed)throw new Error('Video did not advance: '+src);
 }
 await save('01-sisco-inicial');
 await page.getByRole('button',{name:'Iniciar sistema'}).click();
 await page.clock.runFor(13700);
 for(let i=0;i<4;i++){if(i)await page.clock.runFor(4400);await save('02-candidato-'+(i+1));}
 await page.clock.runFor(7500); // 34.4s: dragon first shot, readable.
 await save('03-dragon-esqueleto');
 await page.clock.runFor(2800);await save('04-dragon-caja');
 await page.clock.runFor(2800);await save('05-arca-interior');
 await page.clock.runFor(2800);await save('06-arca-completa');
 await page.clock.runFor(2800);await save('07-brasil-mar');
 await page.clock.runFor(2800);await save('08-brasil-collage');
 await page.clock.runFor(2800);await video('09-brasil-video');
 await page.clock.runFor(850);await save('10-competencias');
 await page.clock.runFor(2800);await video('11-danilo-bailando');
 await page.clock.runFor(850);await save('12-sisco-retrato');
 await page.clock.runFor(2800);await video('13-gesto-bucle');
 await video('14-sombrero');await video('15-encuentro-bucle');
 await page.clock.runFor(900);await save('16-ortega');
 for(const name of ['fio','flor','zarate','mati','thiago','nahuel','arturo']){
  await page.getByRole('button',{name:'Siguiente compañero',exact:false}).click();
  await page.clock.runFor(900);await save('17-'+name);
 }
 await page.getByRole('button',{name:'Seguir viendo',exact:false}).click();
 await page.clock.runFor(1000);await save('18-agradecimiento-1');
 for(let i=2;i<=4;i++){await page.clock.runFor(2900);await save('18-agradecimiento-'+i);}
 await page.clock.runFor(2900);await save('19-pregunta');
 await page.getByRole('button',{name:'SÍ',exact:true}).click();
 await page.clock.runFor(1000);await save('20-celebracion');
 report.push({width,errors});console.log(width,JSON.stringify(errors));await page.close();
}
await browser.close();await writeFile(`${folder}/review.json`,JSON.stringify(report,null,2));
