import {exerciseMuscles, paintWorkoutRegions} from "./strength.js";

const countLabel = (count, single, plural) => count + " " + (count===1?single:plural);
const number = value => Number(value).toLocaleString("nl-NL",{maximumFractionDigits:2});
const loadBody = side => new Promise((resolve,reject)=>{
  const img = new Image();
  img.onload = ()=>resolve(img);
  img.onerror = reject;
  img.src = `body-${side}.jpg`;
});

function sessionCard(session, entries) {
  const exercises = new Set(entries.map(entry=>entry.x));
  const muscles = new Set([...exercises].flatMap(name=>exerciseMuscles(name).map(muscle=>muscle.id)));
  const records = entries.filter(entry=>entry.pr);
  const weighted = entries.filter(entry=>Number(entry.kg)>0);
  const highlight = [...records,...weighted].reduce((best,entry)=>{
    if (!best || (entry.pr&&!best.pr) || (Boolean(entry.pr)===Boolean(best.pr)&&Number(entry.kg)>Number(best.kg))) return entry;
    return best;
  },null);
  const bestSet = highlight ? `${number(highlight.kg)} kg ${highlight.rm?"· 1RM":"× "+number(highlight.r)}` : "";
  return {session, sets:entries.length, exercises:exercises.size, muscles, records:records.length, highlight, bestSet};
}

function workoutImage(summary, side, body) {
  const canvas = document.createElement("canvas");
  canvas.width=1080;
  canvas.height=1260;
  const ctx = canvas.getContext("2d");
  const background=ctx.createLinearGradient(0,0,1080,1260);
  background.addColorStop(0,"#202a1c");
  background.addColorStop(1,"#101410");
  ctx.fillStyle=background;
  ctx.fillRect(0,0,1080,1260);
  const write = (value,x,y,size,color="#f3f5ef",maxWidth=950) => {
    ctx.font=`700 ${size}px system-ui, sans-serif`;
    ctx.fillStyle=color;
    ctx.fillText(value,x,y,maxWidth);
  };
  write("GYM TRACKER",58,81,30,"#d5fa64");
  write("Training voltooid",58,162,76);
  const date = summary.session.d.split("-").reverse().join("-");
  write(date,60,212,28,"#b6c4ae");
  const metrics = [
    [summary.session.m,"MINUTEN"],[summary.sets,"SETS"],[summary.exercises,"OEFENINGEN"],[summary.records,"PR’S"]
  ];
  metrics.forEach(([value,label],i)=>{
    const x=58+i*245;
    ctx.fillStyle="#293626";
    ctx.fillRect(x,246,227,128);
    write(String(value),x+18,318,57,"#d5fa64");
    write(label,x+18,352,21,"#b6c4ae");
  });
  const width=315,height=589,x=(canvas.width-width)/2,y=400;
  ctx.drawImage(body,x,y,width,height);
  paintWorkoutRegions(ctx,side,summary.muscles,x,y,width,height);
  ctx.textAlign="center";
  write(side==="front"?"Voorkant":"Achterkant",canvas.width/2,1022,24,"#b6c4ae");
  ctx.textAlign="left";
  if(summary.highlight){
    write(summary.highlight.pr?"PR VAN DE TRAINING":"ZWAARSTE SET",58,1088,26,"#d5fa64");
    write(summary.highlight.x,58,1152,51);
    write(summary.bestSet,58,1214,46,"#d5fa64");
  }else{
    write(summary.sets?"Training afgerond":"Geen sets gekoppeld aan deze training",58,1136,40);
  }
  return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error("PNG maken mislukt")),"image/png"));
}

export function showWorkoutSummary(session, entries) {
  const summary = sessionCard(session,entries);
  const dialog = document.createElement("dialog");
  dialog.id="workout-summary";
  dialog.setAttribute("aria-labelledby","workout-summary-title");
  dialog.innerHTML=`<section class="card workout-summary">
    <div class="top"><h2 id="workout-summary-title">Training voltooid</h2><button class="pr-close" type="button" data-workout-close aria-label="Sluiten">×</button></div>
    <p class="last">${session.m} min · ${countLabel(summary.sets,"set","sets")} · ${countLabel(summary.exercises,"oefening","oefeningen")} · ${countLabel(summary.records,"PR","PR’s")}</p>
    <div class="workout-model">
      <div class="row workout-views" role="group" aria-label="Aanzicht van het lichaam">
        <button type="button" data-workout-side="front" class="p" aria-pressed="true">Voorkant</button>
        <button type="button" data-workout-side="back" aria-pressed="false">Achterkant</button>
      </div>
      <canvas width="440" height="822" role="img" aria-label="Getrainde spieren, voorkant"></canvas>
    </div>
    <details class="workout-export"><summary>Bekijk de deelkaart</summary><div class="workout-preview" role="status">Trainingskaart maken…</div></details>
    <div class="row"><button class="p" data-share-workout disabled>Deel kaart</button><button data-download-workout disabled>Download afbeelding</button></div>
    <p class="last" data-workout-status aria-live="polite"></p>
  </section>`;
  const preview=dialog.querySelector(".workout-preview");
  const share=dialog.querySelector("[data-share-workout]");
  const download=dialog.querySelector("[data-download-workout]");
  const status=dialog.querySelector("[data-workout-status]");
  const portrait=dialog.querySelector(".workout-model canvas");
  const views=[...dialog.querySelectorAll("[data-workout-side]")];
  const bodies=new Map();
  let selection=0, url;
  dialog.querySelector("[data-workout-close]").onclick=()=>dialog.close();
  dialog.addEventListener("close",()=>{
    if(url)URL.revokeObjectURL(url);
    dialog.remove();
  },{once:true});
  document.body.appendChild(dialog);
  dialog.showModal();

  async function showSide(side){
    const request=++selection;
    const viewName=side==="front"?"voorkant":"achterkant";
    for(const button of views){
      const active=button.dataset.workoutSide===side;
      button.classList.toggle("p",active);
      button.setAttribute("aria-pressed",String(active));
    }
    portrait.setAttribute("aria-label","Getrainde spieren, "+viewName);
    portrait.setAttribute("aria-busy","true");
    const context=portrait.getContext("2d");
    context.clearRect(0,0,portrait.width,portrait.height);
    status.textContent="";
    preview.textContent="Trainingskaart maken…";
    share.disabled=download.disabled=true;
    if(url){URL.revokeObjectURL(url);url=undefined;}
    const isCurrent=()=>dialog.open&&request===selection;
    try{
      if(!bodies.has(side))bodies.set(side,loadBody(side));
      const body=await bodies.get(side);
      if(!isCurrent())return;
      context.drawImage(body,0,0,portrait.width,portrait.height);
      paintWorkoutRegions(context,side,summary.muscles,0,0,portrait.width,portrait.height);
      portrait.setAttribute("aria-busy","false");
      const blob=await workoutImage(summary,side,body);
      if(!isCurrent())return;
      const imageUrl=URL.createObjectURL(blob);
      url=imageUrl;
      const image=document.createElement("img");
      image.src=imageUrl;
      image.alt="Trainingskaart met gemarkeerde spieren, "+viewName;
      preview.replaceChildren(image);
      const filename=`gym-tracker-${session.d}-${viewName}.png`;
      const file=new File([blob],filename,{type:"image/png"});
      download.disabled=false;
      download.onclick=()=>{
        const link=document.createElement("a");
        link.href=imageUrl;
        link.download=filename;
        link.click();
      };
      share.hidden=!navigator.canShare?.({files:[file]});
      share.disabled=share.hidden;
      share.onclick=async()=>{
        try{await navigator.share({files:[file],title:"Mijn Gym Tracker-training"});}
        catch(error){if(isCurrent()&&error.name!=="AbortError")status.textContent="Delen is niet gelukt. Je kunt de afbeelding downloaden.";}
      };
    }catch{
      if(!isCurrent())return;
      portrait.setAttribute("aria-busy","false");
      status.textContent="Dit aanzicht kon niet worden geladen.";
      preview.textContent="De afbeelding kon niet worden gemaakt.";
    }
  }
  for(const button of views)button.onclick=()=>showSide(button.dataset.workoutSide);
  showSide("front");
}
