import {test,expect} from '@playwright/test';
import {memories} from '../src/content/memories';
test('el arca cambia de foto y conserva el texto quieto; SISCO usa el retrato solicitado',async({page})=>{
  await page.clock.install();await page.goto('/');
  await page.getByRole('button',{name:'Iniciar sistema'}).click();
  // Entry is 33.55s; dragon is 5.6s. At 40.5s the first arca shot is readable.
  await page.clock.runFor(40500);
  await expect(page.locator('.memory-journey')).toHaveAttribute('data-memory','robotica');
  await expect(page.locator('.memory-main-image img')).toHaveAttribute('src',/interior.webp/);
  const heading=page.locator('.memory-copy');
  const original=await heading.evaluate(e=>({text:e.textContent,transform:getComputedStyle(e).transform}));
  await page.clock.runFor(1900);
  await expect(page.locator('.memory-main-image img')).toHaveAttribute('src',/completa.webp/);
  const after=await heading.evaluate(e=>({text:e.textContent,transform:getComputedStyle(e).transform}));
  expect(after).toEqual(original);
  await expect(page.locator('.memory-art img')).toHaveCount(1);
  expect(memories.find(m=>m.id==='sisco-edu')?.media[0]).toMatchObject({image:{src:'/media/recuerdos/extras/retrato.webp'}});
  await expect(page.getByRole('button',{name:/Saltar|Repetir|Siguiente capítulo/})).toHaveCount(0);
});
