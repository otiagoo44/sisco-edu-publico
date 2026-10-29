import { useCallback, useEffect, useReducer, useState } from "react";
import { stageReducer, type Stage } from "./state";
import { useReducedMotion, useScene } from "./hooks";
import { usePhotos } from "./photos";
import { BootIntro } from "./components/BootIntro";
import { Diagnostic } from "./components/Diagnostic";
import { GlitchTransition } from "./components/GlitchTransition";
import { PhotoMontage } from "./components/PhotoMontage";
import { Invitation } from "./components/Invitation";
import { AcceptanceCelebration } from "./components/AcceptanceCelebration";
import { AudioControl } from "./components/AudioControl";
import { MemoryJourney } from "./components/memories/MemoryJourney";
import { StudentsChapter } from "./components/StudentsChapter";
import { BeforeQuestion } from "./components/BeforeQuestion";
const announcements: Record<Stage,string> = {
  boot:"SISCO-EDU. Sistema de gestión académica.", diagnostic:"Analizando candidatos.",
  glitch:"Cambio de escena.", montage:"Candidato encontrado.", memories:"Nuestros recuerdos.",
  students:"Los mensajes de la promoción.", "before-question":"Gracias por todo, profe. Tenemos una pregunta.",
  invitation:"Profe Danilo, ¿quiere ser nuestro padrino?", accepted:"¡Tenemos padrino!",
};
export default function App() {
  const reduced=useReducedMotion();
  const [stage,dispatch]=useReducer(stageReducer,"boot");
  const [running,setRunning]=useState(false);
  const [paused,setPaused]=useState(false);
  const photos=usePhotos(running);
  const advance=useCallback(()=>dispatch({type:"ADVANCE"}),[]);
  const root=useScene(stage,running,paused,reduced,advance);
  const idle=stage==="boot"&&!running;
  useEffect(()=>{
    const visibility=()=>setPaused(document.hidden);
    document.addEventListener("visibilitychange",visibility);
    return ()=>document.removeEventListener("visibilitychange",visibility);
  },[]);
  useEffect(()=>{
    document.title=["invitation","accepted"].includes(stage)?"Promo 2026 · OPERACIÓN PADRINO":"SISCO-EDU | Gestión académica";
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content",idle?"#f8fafc":stage==="accepted"?"#f5f2ea":"#182de0");
    window.scrollTo({top:0,behavior:"instant"});
  },[stage,idle]);
  return <div className={"app stage-"+stage+(idle?" is-idle":" has-started")+(paused?" is-paused":"")}>
    <a className="skip-link" href="#experience">Ir al contenido</a>
    {!idle&&<header className="film-header"><a href="#experience" className="film-brand">{["invitation","accepted"].includes(stage)?<>Promo <strong>2026</strong></>:"SISCO-EDU"}</a><AudioControl/></header>}
    <main ref={root} id="experience" className="experience" data-state={stage} data-running={running}>
      {stage==="boot"&&<BootIntro running={running} onStart={()=>setRunning(true)}/>}
      {stage==="diagnostic"&&<Diagnostic/>}
      {stage==="glitch"&&<GlitchTransition/>}
      {stage==="montage"&&<PhotoMontage photos={photos}/>}
      {stage==="memories"&&<MemoryJourney paused={paused} reduced={reduced} onComplete={advance}/>}
      {stage==="students"&&<StudentsChapter paused={paused} reduced={reduced} onContinue={advance}/>}
      {stage==="before-question"&&<BeforeQuestion paused={paused} reduced={reduced} onComplete={advance}/>}
      {stage==="invitation"&&<Invitation photos={photos} reduced={reduced} onAccept={()=>dispatch({type:"ACCEPT"})}/>}
      {stage==="accepted"&&<AcceptanceCelebration photos={photos} reduced={reduced}/>}
    </main>
    {!idle&&<footer className="film-footer"><span>Bachillerato Técnico en Informática</span></footer>}
    <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">{announcements[stage]}</div>
  </div>;
}
