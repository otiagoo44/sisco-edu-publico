import {chromium} from '@playwright/test';
import sharp from 'sharp';
import {mkdir} from 'node:fs/promises';
const folder='docs/screenshots/restored-finale';await mkdir(folder,{recursive:true});
const browser=await chromium.launch({channel:'chrome'});
for(const width of [1440,390]){
 const page=await browser.newPage({viewport:{width,height:width<768?844:1000}});
 await page.clock.install({time:new Date('2026-10-29T10:00:00Z')});
 await page.clock.pauseAt(new Date('2026-10-29T10:00:01Z'));
 await page.goto('http://127.0.0.1:4173/');
 await page.getByRole('button',{name:'Iniciar sistema'}).click();await page.clock.runFor(13700);
 await page.locator('[data-photo-id="1000160923"] img').waitFor({state:'attached'});
 async function save(name){
  await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});
  await sharp(await page.screenshot({fullPage:true,animations:'disabled'})).webp({quality:85}).toFile(`${folder}/${name}-${width}.webp`);
 }
 await save('candidato');
 // This fixture accelerates navigation through unavailable videos for snapshots;
 // real complete playback is covered independently in autopilot.spec.ts.
 await page.route('**/media/videos/*.mp4',route=>route.abort());
 for(let i=0;i<24;i++){
  await page.clock.runFor(10000);await new Promise(r=>setTimeout(r,100));
  if(await page.locator('main').getAttribute('data-state')==='students')break;
 }
 await page.getByRole('button',{name:'Ver todos (8)'}).click();
 await page.getByRole('dialog').getByRole('button',{name:/08 Arturo/}).click();
 await page.getByRole('button',{name:'Seguir viendo',exact:false}).click();
 await page.clock.runFor(13000);
 await page.getByRole('button',{name:'SÍ',exact:true}).click();await page.clock.runFor(1000);
 await save('celebracion');console.log(width,'OK');await page.close();
}
await browser.close();
