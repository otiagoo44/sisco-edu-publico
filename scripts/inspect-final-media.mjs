import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import sharp from 'sharp';

const out = 'artifacts/final-media';
await mkdir(out, { recursive: true });
async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map(e => e.isDirectory() ? walk(path.join(dir, e.name)) : path.join(dir, e.name)))).flat().sort();
}
const inventory = [];
async function sheet(items, name, columns = 4) {
  const width = 340, height = 300;
  const tiles = await Promise.all(items.map(async ({ file, label }, i) => {
    const thumb = await sharp(file).rotate().resize(328, 262, { fit: 'inside' }).toBuffer();
    const meta = await sharp(thumb).metadata();
    const escaped = label.replaceAll('&', '&amp;').replaceAll('<', '&lt;');
    const text = Buffer.from(`<svg width="340" height="30"><rect width="340" height="30" fill="#fff"/><text x="8" y="20" font-size="14" font-family="Arial">${escaped}</text></svg>`);
    return [{ input: thumb, left: (i % columns) * width + Math.round((width - meta.width)/2), top: Math.floor(i/columns)*height }, {input:text,left:(i%columns)*width,top:Math.floor(i/columns)*height+265}];
  }));
  await sharp({ create: { width: columns*width, height: Math.ceil(items.length/columns)*height, channels: 3, background: '#e9e9e9' } }).composite(tiles.flat()).png().toFile(`${out}/${name}.png`);
}
const photos = [], frames = [];
for (const file of await walk('material-final')) {
  const bytes = await readFile(file);
  const entry = { file: file.replaceAll('\\','/'), bytes:bytes.length, sha256:createHash('sha256').update(bytes).digest('hex') };
  try {
    if (/\.(jpg|png|webp|jpeg)$/i.test(file)) {
      const m = await sharp(file).metadata();
      Object.assign(entry, { type:'photo', width:m.width, height:m.height, orientation:m.orientation ?? 1 });
      photos.push({file, label:entry.file.replace('material-final/','')});
    } else if (/\.mp4$/i.test(file)) {
      const probe = JSON.parse(execFileSync('ffprobe', ['-v','error','-show_format','-show_streams','-of','json',file], {encoding:'utf8'}));
      const v = probe.streams.find(s=>s.codec_type==='video');
      const a = probe.streams.find(s=>s.codec_type==='audio');
      Object.assign(entry,{type:'video',duration:Number(probe.format.duration),width:v.width,height:v.height,codec:v.codec_name,fps:v.avg_frame_rate,audio:a?{codec:a.codec_name,channels:a.channels,sampleRate:a.sample_rate}:null,rotation:v.side_data_list?.find(s=>s.rotation)?.rotation??0});
      const base = path.basename(file,'.mp4');
      const times = [0.1,0.2,0.4,0.6,0.8,0.95].map(p=>Number((entry.duration*p).toFixed(2)));
      entry.frames = [];
      for (let i=0;i<times.length;i++) {
        const frame=`${out}/${base}-${i}.jpg`;
        execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-y','-ss',String(times[i]),'-i',file,'-frames:v','1','-vf','scale=640:640:force_original_aspect_ratio=decrease',frame]);
        frames.push({file:frame,label:`${base} / ${times[i]}s`}); entry.frames.push(frame);
      }
      // Decode every stream, not just sampled frames.
      execFileSync('ffmpeg',['-v','error','-i',file,'-f','null','-'],{stdio:['ignore','pipe','pipe']});
      entry.decoded=true;
    } else { entry.type='text'; }
  } catch(e) { entry.error=String(e.message); }
  inventory.push(entry);
}
await sheet(photos,'all-photos');
await sheet(frames,'all-video-frames',6);
await writeFile(`${out}/inventory.json`,JSON.stringify(inventory,null,2));
console.log(JSON.stringify(inventory.map(({frames,...e})=>e),null,2));
