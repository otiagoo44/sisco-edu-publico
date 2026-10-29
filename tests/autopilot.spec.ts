import {test,expect} from '@playwright/test';

for (const blocked of [false,true]) test(`montaje continuo sin tocar controles, bloqueo de sonido: ${blocked}`,async({page})=>{
  test.setTimeout(180000);
  if(blocked) await page.addInitScript(()=>{
    const original=HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play=function(){
      if(!this.muted) return Promise.reject(new DOMException('Browser policy','NotAllowedError'));
      return original.call(this);
    };
  });
  await page.clock.install();
  await page.goto('/');
  await page.evaluate(()=>{
    (window as unknown as {played:unknown[]}).played=[];
    const pictures=new WeakMap<HTMLImageElement,string>();
    const seen=new Set<string>();const duplicates:string[]=[];
    (window as unknown as {duplicates:string[]}).duplicates=duplicates;
    const inspect=()=>document.querySelectorAll('img').forEach(img=>{
      if(!img.currentSrc&&!img.src)return;
      const src=img.getAttribute('src')!;
      if(pictures.get(img)===src)return;
      pictures.set(img,src);
      if(seen.has(src)&&document.querySelector('main')?.dataset.state!=='accepted')duplicates.push(src);else seen.add(src);
    });
    new MutationObserver(inspect).observe(document.querySelector('main')!,{childList:true,subtree:true,attributes:true,attributeFilter:['src']});
    const times=new WeakMap<HTMLVideoElement,number>();
    const wraps:Record<string,number>={};
    (window as unknown as {wraps:typeof wraps}).wraps=wraps;
    document.addEventListener('timeupdate',event=>{
      const video=event.target as HTMLVideoElement;
      if(video.currentTime+.2<(times.get(video)??0))wraps[video.currentSrc]=(wraps[video.currentSrc]??0)+1;
      times.set(video,video.currentTime);
    },true);
    document.addEventListener('playing',event=>{
      const video=event.target as HTMLVideoElement;
      (window as unknown as {played:unknown[]}).played.push({src:video.currentSrc,muted:video.muted});
    },true);
  });
  await page.getByRole('button',{name:'Iniciar sistema'}).click();
  await page.clock.runFor(35000);
  await page.clock.resume();
  await expect(page.locator('main')).toHaveAttribute('data-state','students',{timeout:125000});
  const played=await page.evaluate(()=>(window as unknown as {played:{src:string,muted:boolean}[]}).played);
  expect(played.some(v=>v.src.includes('brasil-playa'))).toBe(true);
  expect(played.some(v=>v.src.includes('danilo-competencia'))).toBe(true);
  expect(new Set(played.map(v=>v.src)).size).toBe(5);
  expect(played.every(v=>v.muted===blocked)).toBe(true);
  await page.waitForTimeout(4000);
  await expect(page.locator('.student-name')).toHaveText('Ortega');
  const wraps=await page.evaluate(()=>(window as unknown as {wraps:Record<string,number>}).wraps);
  expect(Object.entries(wraps).find(([src])=>src.includes('gesto.mp4'))?.[1]).toBeGreaterThanOrEqual(3);
  expect(Object.entries(wraps).find(([src])=>src.includes('encuentro.mp4'))?.[1]??0).toBe(0);
  for(let i=0;i<7;i++)await page.getByRole('button',{name:'Siguiente compañero',exact:false}).click();
  await expect(page.locator('.student-name')).toHaveText('Arturo');
  await page.getByRole('button',{name:'Seguir viendo',exact:false}).click();
  await expect(page.locator('main')).toHaveAttribute('data-state','invitation',{timeout:16000});
  await page.getByRole('button',{name:'SÍ',exact:true}).click();
  await expect(page.locator('main')).toHaveAttribute('data-state','accepted');
  expect(await page.evaluate(()=>(window as unknown as {duplicates:string[]}).duplicates)).toEqual([]);
});
