import {useCallback,useEffect,useLayoutEffect,useRef,useState} from "react";
import gsap from "gsap";
import {memories} from "../../content/memories";
import {chapterComponents} from "./MemoryChapters";
const ordered=[...memories].sort((a,b)=>a.order-b.order);
const ignorePlayback=()=>{};
export function MemoryJourney({paused,reduced,onComplete}:{paused:boolean;reduced:boolean;onComplete:()=>void}) {
  const [index,setIndex]=useState(0);
  const [photoIndex,setPhotoIndex]=useState(0);
  const stage=useRef<HTMLDivElement>(null);
  const timeline=useRef<gsap.core.Timeline|null>(null);
  const textTimeline=useRef<gsap.core.Timeline|null>(null);
  const memory=ordered[index];
  const media=memory?.media[photoIndex];
  const next=useCallback(()=>{
    if(photoIndex<memory.media.length-1) setPhotoIndex(photoIndex+1);
    else if(index<ordered.length-1){setIndex(index+1);setPhotoIndex(0);}
    else onComplete();
  },[index,photoIndex,memory,onComplete]);
  // Chapter copy has its own lifecycle. Changing only the image cannot replay it.
  useLayoutEffect(()=>{
    if(!stage.current||reduced)return;
    const context=gsap.context(()=>{
      textTimeline.current=gsap.timeline()
        .from('.memory-word',{yPercent:110,rotation:3,duration:.45,stagger:.035,ease:'power4.out'},0)
        .from('.memory-copy',{y:24,duration:.55,ease:'power3.out'},0);
    },stage);
    return()=>{context.revert();textTimeline.current=null;};
  },[index,reduced]);
  useLayoutEffect(()=>{
    if(!media||!stage.current)return;
    const context=gsap.context(()=>{
      const tl=gsap.timeline();timeline.current=tl;
      if(!reduced){
        if(media.type==='video')tl.from('.chapter-video',{scale:.96,opacity:0,duration:.65,ease:'power3.out'},0);
        else {
          const transition=memory.composition==='travel'
            ?{y:photoIndex%2?-22:22,opacity:0,duration:.65,ease:'power3.out'}
            :memory.composition==='blueprint'?{y:24,opacity:0,duration:.7,ease:'power3.out'}
            :{clipPath:'inset(0 100% 0 0)',scale:1.03,duration:.65,ease:'power3.out'};
          tl.from('.memory-main-image',transition,0);
          if(stage.current!.querySelector('.memory-secondary-image'))tl.from('.memory-secondary-image',{y:40,opacity:0,duration:.5,ease:'power3.out'},.2);
        }
      }
      if(media.type==='image'){
        const finish=.75+(media.holdSeconds??1.8);
        tl.to({},{duration:finish},0);
        if(!reduced)tl.to('.memory-main-image',{opacity:0,x:memory.composition==='travel'?-45:0,scale:.96,duration:.25},finish);
        tl.call(next);
      }
    },stage);
    return()=>{context.revert();timeline.current=null;};
  },[index,photoIndex,reduced,memory,media,next]);
  useEffect(()=>{timeline.current?.paused(paused);textTimeline.current?.paused(paused);},[paused,index,photoIndex,reduced]);
  useEffect(()=>{if(!memory)onComplete();},[memory,onComplete]);
  if(!memory)return null;
  const Chapter=chapterComponents[memory.composition];
  return <div className="memory-journey" data-memory={memory.id} data-media-index={photoIndex}>
    <div ref={stage} className="memory-stage"><Chapter memory={memory} photoIndex={photoIndex} paused={paused} onPlayingChange={ignorePlayback} automatic onVideoComplete={next}/></div>
  </div>;
}
