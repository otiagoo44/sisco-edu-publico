import {test,expect} from '@playwright/test';

for (const blocked of [false,true]) test(`montaje continuo sin tocar controles, bloqueo de sonido: ${blocked}`,async({page})=>{
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
    document.addEventListener('playing',event=>{
      const video=event.target as HTMLVideoElement;
      (window as unknown as {played:unknown[]}).played.push({src:video.currentSrc,muted:video.muted});
    },true);
  });
  await page.getByRole('button',{name:'Iniciar sistema'}).click();
  await page.clock.runFor(30100);
  await page.clock.resume();
  await expect(page.locator('main')).toHaveAttribute('data-state','students',{timeout:65000});
  const played=await page.evaluate(()=>(window as unknown as {played:{src:string,muted:boolean}[]}).played);
  expect(played.some(v=>v.src.includes('brasil-playa'))).toBe(true);
  expect(played.some(v=>v.src.includes('danilo-competencia'))).toBe(true);
  expect(played.every(v=>v.muted===blocked)).toBe(true);
  await page.waitForTimeout(4000);
  await expect(page.locator('.student-name')).toHaveText('Ortega');
});
