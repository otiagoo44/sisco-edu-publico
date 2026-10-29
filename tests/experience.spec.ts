import {test,expect,type Page} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {students} from '../src/content/students';

// Fast navigation/error-path fixture. Full native playback and finite loops are
// verified without this route interception in autopilot.spec.ts.
async function messages(page:Page){
  await page.clock.install();
  await page.route('**/media/videos/*.mp4',route=>route.abort());
  await page.goto('/');
  await page.getByRole('button',{name:'Iniciar sistema'}).click();
  for(let i=0;i<24;i++){
    await page.clock.runFor(10000);
    await page.waitForTimeout(100);
    if(await page.locator('main').getAttribute('data-state')==='students')break;
  }
  await expect(page.locator('main')).toHaveAttribute('data-state','students');
}
test('entrada auténtica, sin pistas ni saltos de reproducción',async({page,isMobile})=>{
  const requests:string[]=[];page.on('request',r=>requests.push(r.url()));
  await page.goto('/');
  await expect(page.getByRole('heading',{name:'Bienvenido a SISCO-EDU'})).toBeVisible();
  expect(await page.locator('body').innerText()).not.toMatch(/padrino|sorpresa|recuerdos|promo/i);
  expect(requests.some(s=>s.includes('/media/')||s.includes('/photos/profe/'))).toBe(false);
  expect(await page.title()).toBe('SISCO-EDU | Gestión académica');
  if(isMobile){await page.getByRole('button',{name:'Menú',exact:false}).click();await expect(page.getByRole('navigation',{name:'Módulos del sistema'})).toBeVisible();await page.getByRole('button',{name:'Cerrar menú',exact:false}).click();}
  await page.getByRole('button',{name:'Iniciar sistema'}).click();
  await expect(page.getByRole('button',{name:/Saltar|Repetir|Ver de nuevo/})).toHaveCount(0);
  await page.keyboard.press('Escape');
  await expect(page.locator('main')).toHaveAttribute('data-state','boot');
});
test('ocho textos completos, Fio corregida y Arturo último y destacado',async({page})=>{
  await messages(page);
  const ordered=students.filter(s=>s.status==='published').sort((a,b)=>a.order-b.order);
  expect(ordered.at(-1)?.id).toBe('arturo');
  for(const [i,item] of ordered.entries()){
    await expect(page.locator('.student-name')).toHaveText(item.name);
    await expect(page.locator('blockquote')).toHaveText(item.message);
    await expect(page.locator('.student-portrait img')).toHaveAttribute('src',item.photo!.src);
    await page.clock.runFor(90000);
    await expect(page.locator('.student-counter')).toHaveText(`${i+1} de 8`);
    const size=await page.locator('blockquote').evaluate(e=>({size:parseFloat(getComputedStyle(e).fontSize),height:e.clientHeight,scroll:e.scrollHeight}));
    expect(size.size).toBeGreaterThanOrEqual(item.id==='arturo'?32:22);
    expect(size.scroll).toBeLessThanOrEqual(size.height+1);
    if(item.id==='fio'){await expect(page.locator('blockquote')).toContainText('Sos mas pesado que mi ex.');await expect(page.locator('blockquote')).not.toContainText('Carlos');}
    if(i<ordered.length-1)await page.getByRole('button',{name:'Siguiente compañero',exact:false}).click();
  }
  await expect(page.locator('.is-course-message')).toBeVisible();
  await page.getByRole('button',{name:'Ver todos (8)'}).click();
  await expect(page.getByRole('dialog').locator('li')).toHaveCount(8);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button',{name:'Ver todos (8)'})).toBeFocused();
});
test('animación de agradecimiento antes de la pregunta y collage de celebración restaurado',async({page,isMobile})=>{
  await messages(page);
  await expect(page.getByRole('button',{name:'Ir a la pregunta'})).toHaveCount(0);
  await page.getByRole('button',{name:'Ver todos (8)'}).click();
  await page.getByRole('dialog').getByRole('button',{name:/08 Arturo/}).click();
  await page.getByRole('button',{name:'Seguir viendo',exact:false}).click();
  await expect(page.locator('main')).toHaveAttribute('data-state','before-question');
  await expect(page.locator('.invitation-layout')).toHaveCount(0);
  await page.clock.runFor(1000);
  await expect(page.getByText('Después de todo lo que vivimos…',{exact:true})).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('main')).toHaveAttribute('data-state','before-question');
  await page.clock.runFor(12000);
  await expect(page.locator('main')).toHaveAttribute('data-state','invitation');
  const no=page.getByRole('button',{name:'NO',exact:true});
  for(let i=0;i<3;i++){
    const bounds=(await no.boundingBox())!;const previous=Number(await no.getAttribute('data-escapes'));
    if(isMobile)await page.touchscreen.tap(bounds.x+bounds.width/2,bounds.y+bounds.height/2);
    else await page.mouse.move(bounds.x+bounds.width/2,bounds.y+bounds.height/2);
    await page.clock.runFor(250);
    expect(Number(await no.getAttribute('data-escapes'))).toBeGreaterThan(previous);
  }
  await page.getByRole('button',{name:'SÍ',exact:true}).click();
  await expect(page.locator('main')).toHaveAttribute('data-state','accepted');
  await expect(page.locator('.celebration-collage img')).toHaveCount(6);
  const closingSources=await page.locator('.celebration-collage img').evaluateAll(imgs=>imgs.map(img=>img.getAttribute('src')));
  expect(new Set(closingSources).size).toBe(6);
  await expect(page.getByRole('button',{name:/Ver de nuevo|Repetir|Ver las fotos|Saltar/})).toHaveCount(0);
});
test('teclado, contraste y responsive con los controles de testimonios',async({page})=>{
  await messages(page);
  await page.clock.runFor(1000);
  expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()).violations).toEqual([]);
  for(const width of [360,390,768,1440]){
    await page.setViewportSize({width,height:900});
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  }
});
test('sin JavaScript permanece la entrada neutral',async({browser,baseURL})=>{
  const context=await browser.newContext({javaScriptEnabled:false});
  const page=await context.newPage();await page.goto(baseURL!);
  await expect(page.getByRole('heading',{name:'SISCO-EDU',exact:true})).toBeVisible();
  expect(await page.locator('body').innerText()).not.toMatch(/padrino|sorpresa|promo/i);
  await context.close();
});
