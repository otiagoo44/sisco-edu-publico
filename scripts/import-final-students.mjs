import { readFile, writeFile } from 'node:fs/promises';
const original = await readFile('material-final/mensajes.txt','utf8');
const entries = [...original.matchAll(/^(ortega|Fio|Flor|Zarate|Mati|Thiago|Nahuel|Arturo):([\s\S]*?)(?=^(?:ortega|Fio|Flor|Zarate|Mati|Thiago|Nahuel|Arturo):|$(?![\s\S]))/gm)];
const names = {ortega:'Ortega',Fio:'Fio',Flor:'Flor',Zarate:'Zarate',Mati:'Mati',Thiago:'Thiago',Nahuel:'Nahuel',Arturo:'Arturo'};
const photoNames = {Flor:'florencia'};
const students = entries.map(([_,key,text],i)=>({
  id:key.toLowerCase(),name:names[key],photo:{src:`/media/alumnos/${photoNames[key]??key.toLowerCase()}.webp`,alt:`Retrato de ${names[key]}`,fit:'contain'},
  message:text.trim().replace(/\r?\n/g,' ').replace(/\s*\(coolocar emoji de manos de corazon\)/,' 🫶').replace(/\s*\(colocar emoji de cabeza moviendose\s+de arriba para abajo\)/,''),
  order:i+1,status:text.trim()?'published':'draft',
}));
students[0].message = 'Profe Danilo, gracias por todos estos años de aprendizaje. Marcaste un antes y un después en mi vida. Ver cómo vivís tu fe, cómo te dedicás a tus proyectos y cómo buscás hacer las cosas con excelencia me inspira todos los días a mejorar y a hacer las cosas bien. Me enseñaste que para hacer cosas realmente excelentes hay que salir de la zona de confort y animarse a dar más. Gracias por tu dedicación y por la paciencia que tuviste y seguís teniendo con nosotros. Me ayudaste a formarme como persona y sos una de mis mayores inspiraciones. Gracias por todo, profe.';
if(students.length!==8) throw new Error('Revisar importación: se esperaban ocho nombres.');
await writeFile('src/content/students.ts','import type { Student } from "./types";\n\n// Fuente: material-final/mensajes.txt. Ortega ampliado por pedido expreso del autor.\n// Emojis editoriales aplicados con autorización. Arturo y Nahuel aún no enviaron mensaje.\nexport const students: Student[] = '+JSON.stringify(students,null,2)+';\n');
console.log(students.map(s=>`${s.name}: ${s.status} (${s.message.length} caracteres)`).join('\n'));
