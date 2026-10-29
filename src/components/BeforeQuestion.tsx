import {useEffect,useLayoutEffect,useRef} from "react";
import gsap from "gsap";
export const questionLeadIn=[
  "Después de todo lo que vivimos…",
  "Gracias por la paciencia, profe.",
  "Y por estar siempre con nosotros.",
  "Ahora sí. La pregunta es…",
];
export function BeforeQuestion({paused,reduced,onComplete}:{paused:boolean;reduced:boolean;onComplete:()=>void}) {
  const root=useRef<HTMLDivElement>(null);
  const timeline=useRef<gsap.core.Timeline|null>(null);
  useLayoutEffect(()=>{
    const context=gsap.context(()=>{
      const tl=gsap.timeline({onComplete});timeline.current=tl;
      root.current!.querySelectorAll('.question-lead-line').forEach((line,i)=>{
        const at=i*2.9;
        tl.set(line,{visibility:'visible',attr:{'aria-hidden':'false'}},at)
          .fromTo(line,{opacity:0,y:reduced?0:32,scale:reduced?1:.97},{opacity:1,y:0,scale:1,duration:reduced?0:.55,ease:'power3.out'},at)
          .to(line,{opacity:0,y:reduced?0:-18,duration:reduced?0:.25},at+2.65)
          .set(line,{visibility:'hidden',attr:{'aria-hidden':'true'}},at+2.9);
      });
    },root);
    return()=>{context.revert();timeline.current=null;};
  },[reduced,onComplete]);
  useEffect(()=>{timeline.current?.paused(paused);},[paused,reduced]);
  return <div ref={root} className="question-lead-in">{questionLeadIn.map(line=><p key={line} className="question-lead-line" aria-hidden="true">{line}</p>)}</div>;
}
