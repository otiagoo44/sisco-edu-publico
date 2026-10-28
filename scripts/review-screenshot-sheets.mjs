import { readdir } from 'node:fs/promises';
import sharp from 'sharp';
for (const width of [1440,390,360,768]) {
  const names=(await readdir('docs/screenshots/final')).filter(n=>n.endsWith(`-${width}.webp`)).sort();
  const cellW=300,cellH=460,cols=4;
  const layers=[];
  for (const [i,name] of names.entries()) {
    const buffer=await sharp(`docs/screenshots/final/${name}`).resize(cellW-8,cellH-30,{fit:'inside'}).png().toBuffer();
    const m=await sharp(buffer).metadata();
    layers.push({input:buffer,left:(i%cols)*cellW+Math.floor((cellW-m.width)/2),top:Math.floor(i/cols)*cellH});
    layers.push({input:Buffer.from(`<svg width="300" height="26"><rect width="300" height="26" fill="white"/><text x="6" y="18" font-family="Arial" font-size="13">${name}</text></svg>`),left:(i%cols)*cellW,top:Math.floor(i/cols)*cellH+cellH-26});
  }
  await sharp({create:{width:cols*cellW,height:Math.ceil(names.length/cols)*cellH,channels:3,background:'#aaa'}}).composite(layers).webp({quality:85}).toFile(`artifacts/final-media/screenshots-${width}.webp`);
}
