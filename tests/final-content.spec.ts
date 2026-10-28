import { test, expect, type Page } from '@playwright/test';
import { memories, extraMemories } from '../src/content/memories';
import { students } from '../src/content/students';

async function enter(page: Page) {
  await page.clock.install();
  await page.goto('/');
  await page.getByRole('button', {name:'Iniciar sistema'}).click();
  await page.clock.runFor(30100);
  await expect(page.locator('main')).toHaveAttribute('data-state','memories');
  await page.getByRole('navigation',{name:'Capítulos de recuerdos'}).getByRole('button',{name:'Dragón',exact:true}).click();
}
async function chapter(page: Page, label: string) {
  await page.getByRole('navigation',{name:'Capítulos de recuerdos'}).getByRole('button',{name:label,exact:true}).click();
}
test('las dos etapas del dragón se aprecian y el arca se presenta en paralelo', async ({page}) => {
  await enter(page);
  await page.getByRole('button',{name:'Repetir capítulo',exact:true}).click();
  await expect(page.locator('.memory-main-image img')).toHaveAttribute('src',/esqueleto.webp/);
  await expect(page.locator('.memory-description')).toContainText('Nuestro dragón de robótica');
  await page.clock.runFor(500);
  await expect(page.locator('.memory-main-image img')).toHaveAttribute('src',/esqueleto.webp/);
  await page.clock.runFor(2300);
  await expect(page.locator('.memory-main-image img')).toHaveAttribute('src',/caja.webp/);
  await page.clock.runFor(500);
  await expect(page.locator('.memory-main-image img')).toHaveAttribute('src',/caja.webp/);
  await chapter(page,'Arca');
  await expect(page.locator('.memory-copy h1')).toHaveText('Y también estaba el arca.');
  await expect(page.locator('.memory-art img')).toHaveCount(1);
  for (const img of await page.locator('.memory-art img').all())
    expect(await img.evaluate((node: HTMLImageElement)=>node.complete&&node.naturalWidth>0)).toBe(true);
});

test('los cinco videos reales reproducen, empiezan sin sonido y esperan al usuario', async ({page}) => {
  const errors: string[]=[];
  page.on('pageerror',e=>errors.push(e.message));
  await enter(page);
  // Run timers in real time from here: a fake media event is not a playback test.
  await page.clock.resume();
  for (const label of ['Brasil','Competencias']) {
    await chapter(page,label);
    for(let i=1;i<(label==='Brasil'?3:2);i++) await page.getByRole('button',{name:'Recuerdo siguiente',exact:true}).click();
    const video=page.locator('.memory-art video');
    await expect(video).toHaveJSProperty('muted',true);
    await expect(video).toHaveAttribute('playsinline','');
    await page.getByRole('button',{name:'Reproducir video',exact:true}).click();
    await expect.poll(()=>video.evaluate((v:HTMLVideoElement)=>v.currentTime)).toBeGreaterThan(0.2);
    await expect(page.getByRole('button',{name:'Siguiente capítulo',exact:false})).toBeDisabled();
    await expect(page.getByRole('button',{name:'Pausar video',exact:true})).toBeVisible();
    await page.getByRole('button',{name:'Activar sonido del video'}).click();
    await expect(video).toHaveJSProperty('muted',false);
    await page.getByRole('button',{name:'Silenciar video',exact:true}).click();
    await expect(video).toHaveJSProperty('muted',true);
    await expect(page.locator('.chapter-video')).toHaveAttribute('data-video-state','ended',{timeout:12000});
    await page.waitForTimeout(500);
    await expect(page.locator('.memory-journey')).toHaveAttribute('data-memory',label==='Brasil'?'brasil':'competencias');
    await page.getByRole('button',{name:'Volver a ver el video'}).click();
    await expect.poll(()=>video.evaluate((v:HTMLVideoElement)=>!v.paused)).toBe(true);
    await page.getByRole('button',{name:'Pausar video',exact:true}).click();
  }
  await page.getByRole('button',{name:'Más recuerdos · fotos y videos'}).click();
  for (const item of extraMemories.filter(m=>m.type==='video')) {
    await page.getByRole('dialog').getByRole('button',{name:item.caption+' Video',exact:true}).click();
    const video=page.getByRole('dialog').locator('video');
    await expect(video).toHaveJSProperty('muted',true);
    await expect.poll(()=>video.evaluate((v:HTMLVideoElement)=>v.readyState),{timeout:15000}).toBeGreaterThanOrEqual(1);
    await page.getByRole('dialog').getByRole('button',{name:'Reproducir video',exact:true}).click();
    await expect.poll(()=>video.evaluate((v:HTMLVideoElement)=>v.currentTime),{timeout:15000}).toBeGreaterThan(0.1);
    await expect.poll(()=>video.evaluate((v:HTMLVideoElement)=>v.readyState)).toBeGreaterThanOrEqual(2);
    if(item.sound==='silent') await expect(page.getByText('Video sin audio',{exact:true})).toBeVisible();
    await expect(page.locator('dialog .chapter-video')).toHaveAttribute('data-video-state','ended',{timeout:22000});
  }
  await page.getByRole('button',{name:'Cerrar ×'}).click();
  expect(errors).toEqual([]);
});

test('fallo de video conserva poster, aviso y navegación',async({page})=>{
  await page.route('**/media/videos/danilo-competencia.mp4',route=>route.abort());
  await enter(page);
  await chapter(page,'Competencias');
  await page.getByRole('button',{name:'Recuerdo siguiente',exact:true}).click();
  await expect(page.locator('.chapter-video')).toHaveAttribute('data-video-state','error');
  await expect(page.locator('.video-fallback img')).toBeVisible();
  await expect(page.getByText('No se pudo reproducir el video.',{exact:false})).toBeVisible();
  await page.getByRole('button',{name:'Siguiente capítulo',exact:false}).click();
  await expect(page.locator('.memory-journey')).toHaveAttribute('data-memory','sisco-edu');
});

test('todos los mensajes y retratos reales permanecen completos sin autoplay',async({page})=>{
  await enter(page);
  await chapter(page,'SISCO-EDU');
  await page.getByRole('button',{name:'Ver mensajes',exact:false}).click();
  const published=students.filter(s=>s.status==='published');
  for(const [i,student] of published.entries()) {
    await expect(page.locator('.student-name')).toHaveText(student.name);
    await expect(page.locator('blockquote')).toHaveText(student.message);
    await expect(page.locator('.student-portrait img')).toHaveAttribute('src',student.photo!.src);
    await page.clock.runFor(90000);
    await expect(page.locator('.student-counter')).toHaveText(`${i+1} de ${published.length}`);
    const metrics=await page.locator('blockquote').evaluate(el=>({h:el.clientHeight,sh:el.scrollHeight,size:parseFloat(getComputedStyle(el).fontSize)}));
    expect(metrics.size).toBeGreaterThanOrEqual(22);
    expect(metrics.sh).toBeLessThanOrEqual(metrics.h+1);
    if (student.id === 'arturo') {
      await expect(page.locator('.is-course-message')).toBeVisible();
      expect(metrics.size).toBeGreaterThanOrEqual(32);
    }
    if (i < published.length - 1) await page.getByRole('button',{name:'Siguiente compañero',exact:false}).click();
  }
  await page.getByRole('button',{name:`Ver todos (${published.length})`}).click();
  await expect(page.getByRole('dialog').locator('li')).toHaveCount(published.length);
  await expect(page.getByRole('dialog')).toContainText('Nahuel');
  await page.keyboard.press('Escape');
  await page.getByRole('button',{name:'Seguir viendo',exact:false}).click();
  await expect(page.locator('main')).toHaveAttribute('data-state','invitation');
});

test('recorrido fotográfico y galería sin imágenes rotas ni desborde',async({page})=>{
  await enter(page);
  await page.getByRole('button',{name:'Pausar presentación'}).click();
  for(const memory of memories) {
    await chapter(page,memory.navLabel!);
    for(let i=0;i<memory.media.length;i++) {
      for(const img of await page.locator('.memory-art img').all()) {
        await expect.poll(()=>img.evaluate((n:HTMLImageElement)=>n.complete&&n.naturalWidth>0)).toBe(true);
      }
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
      if(i<memory.media.length-1) await page.getByRole('button',{name:'Recuerdo siguiente',exact:true}).click();
    }
  }
  await page.getByRole('button',{name:'Más recuerdos · fotos y videos'}).click();
  for(let i=0;i<5;i++) {
    await expect.poll(()=>page.locator('.extra-feature img').evaluate((n:HTMLImageElement)=>n.complete&&n.naturalWidth>0)).toBe(true);
    await page.getByRole('button',{name:'Siguiente recuerdo',exact:false}).click();
  }
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button',{name:'Más recuerdos · fotos y videos'})).toBeFocused();
});
