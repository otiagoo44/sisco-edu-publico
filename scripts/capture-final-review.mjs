import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
await mkdir('docs/screenshots/final',{recursive:true});
const browser=await chromium.launch({channel:'chrome'});
const findings=[];
for(const width of [1440,390,360,768]) {
  const page=await browser.newPage({viewport:{width,height:width<768?844:1000}});
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  await page.clock.install();
  await page.goto('http://127.0.0.1:4173');
  async function save(name) {
    await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
    await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});
    await sharp(await page.screenshot({fullPage:true,animations:'disabled'})).webp({quality:85}).toFile(`docs/screenshots/final/${name}-${width}.webp`);
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
    if(overflow) errors.push('Horizontal overflow: '+name);
  }
  await save('01-inicial');
  await page.getByRole('button',{name:'Iniciar sistema'}).click();
  await page.clock.runFor(30100);
  await page.getByRole('button',{name:'Pausar presentación'}).click();
  await save('02-dragon-esqueleto');
  await page.getByRole('button',{name:'Recuerdo siguiente',exact:true}).click();
  await save('03-dragon-caja');
  for(const [label,name] of [['Arca','04-arca'],['Brasil','05-brasil'],['Competencias','06-competencias'],['SISCO-EDU','08-sisco']]) {
    await page.getByRole('navigation',{name:'Capítulos de recuerdos'}).getByRole('button',{name:label,exact:true}).click();
    await save(name);
    if(label==='Arca') {
      await page.getByRole('button',{name:'Recuerdo siguiente',exact:true}).click();
      await save('04b-arca-completa');
    }
    if(label==='Competencias') {
      await page.getByRole('button',{name:'Recuerdo siguiente',exact:true}).click();
      await save('07-danilo-video');
    }
  }
  await page.getByRole('button',{name:'Más recuerdos · fotos y videos'}).click();
  await save('09-galeria');
  await page.getByRole('button',{name:'Cerrar ×'}).click();
  await page.getByRole('button',{name:'Ver mensajes',exact:false}).click();
  await save('10-ortega-largo');
  for(const student of ['fio','flor','zarate','mati','thiago']) {
    await page.getByRole('button',{name:'Siguiente compañero',exact:false}).click();
    await save('11-'+student);
  }
  await page.getByRole('button',{name:'Ir a la pregunta'}).click();
  await page.clock.runFor(1000);
  await save('12-pregunta');
  await page.getByRole('button',{name:'SÍ',exact:true}).click();
  await page.clock.runFor(1000);
  await save('13-celebracion');
  findings.push({width,errors});
  console.log(width,JSON.stringify(errors));
  await page.close();
}
await browser.close();
await writeFile('docs/screenshots/final/review.json',JSON.stringify(findings,null,2));
