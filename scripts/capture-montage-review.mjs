import {chromium} from '@playwright/test';
import sharp from 'sharp';
const browser=await chromium.launch({channel:'chrome'});
for(const width of [1440,390,360,768]){
 const page=await browser.newPage({viewport:{width,height:width<768?844:1000}});
 await page.clock.install({time:new Date('2026-10-28T10:00:00Z')});
 await page.clock.pauseAt(new Date('2026-10-28T10:00:01Z'));
 await page.goto('http://127.0.0.1:4173/');
 await page.getByRole('button',{name:'Iniciar sistema'}).click();await page.clock.runFor(13700);
 for(let i=0;i<4;i++){
  if(i)await page.clock.runFor(4400);
  await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(img=>img.decode().catch(()=>{})));});
  if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw new Error('Montage overflow '+width);
  await sharp(await page.screenshot({fullPage:true,animations:'disabled'})).webp({quality:85}).toFile(`docs/screenshots/curated/02-candidato-${i+1}-${width}.webp`);
 }
 console.log(width,'montage OK');await page.close();
}
await browser.close();
