// Ordered from the first ranked milestone to the highest in-app milestone.
export const ranks = [
  {name:"Bronze", color:"#e7a784"},
  {name:"Silver", color:"#d3e0ed"},
  {name:"Gold", color:"#ffd770"},
  {name:"Platinum", color:"#7ce8d9"},
  {name:"Diamond", color:"#8bbdff"},
  {name:"Master", color:"#c6a0ff"},
  {name:"Legend", color:"#d5fa64"}
];

const freeWeightMilestones = [1, 1.45, 1.95, 2.5, 3.15, 3.8, 4.5];
const machineMilestones = [1, 1.6, 2.2, 3.05, 4.1, 5.4, 7];
const exerciseName = name => {
  const normalized = String(name ?? "").trim().replace(/\s+/g," ").toLowerCase();
  return normalized === "cable wirst curl" ? "cable wrist curl" : normalized;
};
const reference = (exercise, bronze, equipment="machine") => ({exercise, bronze, equipment});

// Each position marks the visible muscle on its front or rear image.
export const muscles = [
  {id:"chest", name:"Borst", points:{front:[58,23]}, exercises:[reference("Flat Bench Press",.50,"barbell"),reference("Pec Fly",.27)]},
  {id:"shoulders", name:"Schouders", points:{front:[32,20],back:[68,21]}, exercises:[reference("Shoulder Press dumbbells",.15,"dumbbell"),reference("Rear Delt Fly",.19),reference("Lateral Raise dumbbell",.075,"dumbbell")]},
  {id:"biceps", name:"Biceps en elleboogbuigers", points:{front:[71,28]}, exercises:[reference("Preacher Curl dumbbell",.10,"dumbbell"),reference("Hammer Curl dumbbell",.105,"dumbbell")]},
  {id:"forearms", name:"Onderarmflexoren", points:{front:[21,36]}, exercises:[reference("Cable Wrist Curl",.26)]},
  {id:"abs", name:"Buik", points:{front:[49,31]}, exercises:[reference("Crunches",.20)]},
  {id:"obliques", name:"Schuine buik", points:{front:[60,38]}, exercises:[reference("Rotary Torso",.20)]},
  {id:"quads", name:"Quadriceps", points:{front:[60,60]}, exercises:[reference("Leg Press (plates)",.75)]},
  {id:"adductors", name:"Binnenkant benen", points:{front:[43,55]}, exercises:[reference("Adductor",.30)]},
  {id:"back", name:"Bovenrug en lats", points:{back:[44,26]}, exercises:[reference("Seated Row cable",.35),reference("Wide grip Lat Pulldown",.38)]},
  {id:"triceps", name:"Triceps", points:{back:[27,30]}, exercises:[reference("Cable Tricep Pushdown",.18)]},
  {id:"lowerBack", name:"Rugstrekkers", points:{back:[50,37]}, note:"Back Extension belast ook de billen en hamstrings. De verdeling hangt af van de uitvoering. De score gebruikt het gelogde extra gewicht.", exercises:[reference("Back Extension",.13,"extra")]},
  {id:"glutes", name:"Heupabductoren", points:{back:[37,44]}, note:"Deze score hoort bij de spieren aan de buitenkant van je heup, waaronder de middelste en kleine bilspier.", exercises:[reference("Abductor",.32)]},
  {id:"hamstrings", name:"Hamstrings", points:{back:[60,57]}, exercises:[reference("Leg Curl",.27)]},
  {id:"calves", name:"Kuiten", points:{back:[38,75]}, note:"Deze score komt van zittende calf raises, met nadruk op de diepe kuitspier (soleus).", exercises:[reference("Seated Calf Raises",.30)]}
];

// Region outlines are drawn in the artwork's 440 × 822 coordinate space.
// Paired outlines reference the left side and reflect across the center.
const bodyRegions = {
  front:{
    chest:{pair:true, outline:[[220,159],[201,155],[176,151],[163,157],[149,172],[148,192],[155,210],[172,222],[194,222],[211,216],[220,207]]},
    shoulders:{pair:true, outline:[[166,148],[145,146],[129,154],[118,169],[114,189],[115,208],[129,204],[143,195],[147,175],[157,160]]},
    biceps:{pair:true, outline:[[145,200],[131,207],[117,213],[105,236],[99,257],[101,270],[111,273],[124,258],[138,234],[146,214]]},
    forearms:{pair:true, outline:[[100,272],[88,289],[77,309],[67,335],[57,359],[47,375],[53,386],[66,367],[80,350],[94,329],[111,305],[120,279],[110,271]]},
    abs:{pair:false, outline:[[194,226],[209,222],[220,218],[232,222],[246,226],[254,245],[252,276],[249,312],[241,332],[220,338],[200,332],[191,312],[188,276],[186,245]]},
    obliques:{pair:true, outline:[[152,218],[170,227],[183,234],[184,270],[186,306],[196,331],[175,329],[158,324],[163,303],[161,282],[155,256]]},
    quads:{pair:true, outline:[[137,446],[159,450],[179,456],[184,482],[179,512],[170,546],[161,566],[150,568],[141,553],[138,533],[135,505],[135,475]]},
    adductors:{pair:true, outline:[[182,449],[213,452],[207,477],[199,504],[189,522],[176,533],[182,507],[187,482]]}
  },
  back:{
    shoulders:{pair:true, outline:[[160,146],[142,145],[128,153],[118,169],[114,187],[114,205],[129,196],[150,185],[165,169],[171,152]]},
    back:{pair:true, outline:[[218,136],[202,134],[179,139],[170,156],[170,176],[152,193],[148,211],[149,235],[158,259],[168,282],[180,293],[193,280],[204,253],[217,232]]},
    triceps:{pair:true, outline:[[147,192],[131,199],[115,208],[105,231],[100,251],[101,270],[114,274],[127,254],[140,230],[148,207]]},
    lowerBack:{pair:false, outline:[[182,291],[196,279],[208,251],[220,233],[232,251],[244,279],[258,291],[274,300],[282,322],[263,324],[242,322],[220,321],[198,322],[174,324],[158,322],[165,300]]},
    glutes:{pair:true, outline:[[159,339],[176,339],[191,343],[189,355],[181,370],[169,385],[153,387],[147,380],[151,361]]},
    hamstrings:{pair:true, outline:[[138,437],[164,440],[190,446],[213,449],[206,476],[197,501],[187,530],[174,551],[160,559],[146,546],[140,524],[137,495]]},
    calves:{pair:true, outline:[[147,563],[159,557],[175,561],[184,579],[186,604],[180,634],[169,662],[156,681],[142,672],[133,648],[129,626],[130,602],[136,580]]}
  }
};

function regionShapes(side, row) {
  const {outline, pair} = bodyRegions[side][row.id];
  const shapes = pair ? [outline, outline.map(([x,y])=>[440-x,y])] : [outline];
  return shapes.map(shape=>shape.map(([x,y])=>`${(x/4.4).toFixed(2)}% ${(y/8.22).toFixed(2)}%`).join(","));
}

export function strengthScores(entries, weight, exerciseKey) {
  const records = new Map();
  for (const entry of entries) {
    const load = Number(entry.kg);
    const reps = Number(entry.r);
    if (!Number.isFinite(load) || load <= 0 || entry.t) continue;
    if (!entry.rm && (!Number.isInteger(reps) || reps < 1)) continue;
    const measurement = entry.rm || reps === 1 ? "single" : reps <= 10 ? "estimate" : "minimum";
    const max = measurement === "estimate" ? load * (1 + reps / 30) : load;
    const name = exerciseName(exerciseKey(entry.x));
    const record = records.get(name) ?? {};
    if (load > (Number(record.heaviest?.kg) || 0)) record.heaviest = entry;
    if (max > (record.best?.max ?? 0) ||
        (max === record.best?.max && measurement === "single")) {
      record.best = {entry,max,measurement};
    }
    records.set(name, record);
  }

  return muscles.map(muscle => {
    const candidates = muscle.exercises.flatMap(referenceExercise => {
      const record = records.get(exerciseName(referenceExercise.exercise));
      if (!record || !Number.isFinite(weight) || weight <= 0) return [];
      const ratio = record.best.max / weight;
      const milestones = referenceExercise.equipment === "machine" ? machineMilestones : freeWeightMilestones;
      const thresholds = milestones.map(multiplier => Math.round(referenceExercise.bronze * multiplier * 1000) / 1000);
      const tier = thresholds.findLastIndex(target => ratio >= target);
      return [{...referenceExercise, ...record.best, heaviest:record.heaviest, ratio, thresholds, tier}];
    });
    // Compare exercises by their own milestones and keep the best result per area.
    candidates.sort((a, b) => b.tier - a.tier || b.ratio / b.bronze - a.ratio / a.bronze);
    return {...muscle, score:candidates[0]};
  });
}

const equipmentText = {
  dumbbell:"Gewicht per dumbbell",
  barbell:"Totaalgewicht inclusief stang",
  machine:"Gelogde machinewaarde. Vergelijk sets op hetzelfde apparaat en met dezelfde instelling",
  extra:"Extra gewicht bovenop je lichaamsgewicht"
};
const format = (value, digits=1) => new Intl.NumberFormat("nl-NL",{maximumFractionDigits:digits}).format(value);
const tone = score => ranks[score?.tier]?.color ?? (score?"#829aab":"#8e9a8c");
const rankName = score => ranks[score?.tier]?.name ?? (score?"Onder Bronze":"Geen score");
const setValue = entry => format(Number(entry.kg),3) + " kg " + (entry.rm ? "· 1RM" : "× " + format(Number(entry.r),0));
const viewName = side => side==="front"?"Voorkant":"Achterkant";

function bodyModel(side, rows, selected) {
  return `<figure class="body-model" data-side="${side}">
    <figcaption>${viewName(side)}</figcaption>
    <div class="body-image"><img src="body-${side}.jpg" alt="3D-anatomiemodel, ${viewName(side).toLowerCase()}" width="440" height="822">
    ${rows.filter(row=>row.points[side]).flatMap(row=>regionShapes(side,row).map(path=>`<div class="muscle-region" data-muscle="${row.id}" data-scored="${Boolean(row.score)}" data-selected="${row.id===selected}" style="--rank-color:${tone(row.score)};--region:polygon(${path})" aria-hidden="true"></div>`)).join("")}
    ${rows.filter(row=>row.points[side]).map(row=>{
      const [x,y]=row.points[side];
      return `<button class="muscle-point" type="button" data-muscle="${row.id}" style="--x:${x}%;--y:${y}%;--rank-color:${tone(row.score)}" aria-label="${row.name}: ${rankName(row.score)}" aria-pressed="${row.id===selected}" title="${row.name}"><span></span></button>`;
    }).join("")}</div></figure>`;
}

function scoreDetail(row, weight) {
  const score = row.score;
  if (!score) {
    const empty = weight > 0 ? "Log een gewogen set om een score te krijgen." : "Vul je lichaamsgewicht in om een rank te berekenen.";
    return `<div class="strength-empty"><strong>${empty}</strong><p>Meet met ${row.exercises.map(item=>item.exercise).join(" of ")}.</p></div>`;
  }
  const next = score.thresholds[score.tier + 1];
  const measurementLabel = {single:"Gelogde 1 rep",estimate:"Geschatte 1RM",minimum:"Ondergrens voor 1RM"};
  return `<div class="strength-value"><strong>${score.measurement==="minimum"?"≥ ":""}${format(score.ratio,2)}<small>×</small></strong><span>je lichaamsgewicht</span></div>
  <dl class="strength-facts"><div><dt>Gemeten met</dt><dd>${score.exercise}</dd></div><div><dt>Zwaarste gelogde set</dt><dd>${setValue(score.heaviest)}</dd></div>
  ${score.heaviest!==score.entry?`<div><dt>Gebruikte set voor je score</dt><dd>${setValue(score.entry)}</dd></div>`:""}
  <div><dt>${measurementLabel[score.measurement]}</dt><dd>${format(score.max,3)} kg</dd></div></dl>
  ${score.measurement==="minimum"?`<p class="last">Meer dan 10 reps. Het gelogde gewicht telt als ondergrens, zonder 1RM-schatting.</p>`:""}
  <p class="last">${equipmentText[score.equipment]}.</p>
  ${row.note?`<p class="last">${row.note}</p>`:""}
  ${next ? `<div class="strength-target"><strong>Volgende rank · ${ranks[score.tier+1].name}</strong><span>Vanaf ${format(next,3)}× lichaamsgewicht · ${format(next*weight)} kg 1RM</span></div>` : `<div class="strength-target"><strong>Legend bereikt</strong></div>`}`;
}

export function strengthView(entries, weight, exerciseKey, selection, side) {
  const rows = strengthScores(entries, weight, exerciseKey);
  const row = rows.find(item=>item.id===selection) ?? rows[0];
  return `<section class="strength-layout ${weight>0?"":"strength-needs-weight"}" aria-label="Kracht per spiergroep">
  <div class="card strength-stage" data-body-side="${side}">
    <div class="strength-toolbar"><h2>Spierkaart</h2><div class="row strength-switch" aria-label="Aanzicht">${["front","back"].map(view=>`<button type="button" class="${view===side?"p":""}" data-body-view="${view}" aria-pressed="${view===side}">${viewName(view)}</button>`).join("")}</div></div>
    <div class="body-selection" style="--rank-color:${tone(row.score)}" aria-live="polite"><strong>${row.name}</strong><span class="rank-pill">${rankName(row.score)}</span>${row.score?`<span>${row.score.measurement==="minimum"?"≥ ":""}${format(row.score.ratio,2)}× lichaamsgewicht</span>`:""}</div>
    <div class="strength-bodies">${["front","back"].map(view=>bodyModel(view,rows,row.id)).join("")}</div>
    <div class="strength-rank-key" aria-label="Kleuren per rank">
      ${[ {name:"Geen score",color:tone()}, {name:"Onder Bronze",color:tone({})}, ...ranks ].map(rank=>`<span style="--rank-color:${rank.color}">${rank.name}</span>`).join("")}
    </div>
  </div>
  <div class="strength-info">
    <section class="card strength-detail" style="--rank-color:${tone(row.score)}" aria-labelledby="muscle-title">
      <form class="strength-weight" id="strength-weight"><label for="bw">Lichaamsgewicht <span><input id="bw" name="weight" type="number" step="any" min="1" inputmode="decimal" value="${weight>0?weight:""}" required> kg</span></label><button type="submit">Opslaan</button></form>
      <div class="strength-heading"><h2 id="muscle-title">${row.name}</h2><span class="rank-pill">${rankName(row.score)}</span></div>
      ${scoreDetail(row, weight)}
    </section>
    <section class="card strength-list"><h2>Alle spiergroepen</h2><div class="muscle-list">${rows.map(item=>`<button type="button" data-muscle="${item.id}" aria-pressed="${item.id===row.id}" style="--rank-color:${tone(item.score)}"><span>${item.name}</span><span class="rank-pill">${rankName(item.score)}</span></button>`).join("")}</div></section>
  </div>
  <details class="card strength-method"><summary>Hoe worden de ranks berekend?</summary>
    <p>De score is je beste gelogde 1RM, geschatte 1RM of ondergrens gedeeld door je huidige lichaamsgewicht. Voor 2–10 reps gebruiken we de Epley-formule (gewicht × (1 + herhalingen / 30)). Bij meer dan 10 reps telt het gelogde gewicht als ondergrens. Tijdssets en sets zonder extra gewicht tellen niet mee. De hoogste relatieve mijlpaal per spiergroep bepaalt welke oefening je ziet.</p>
    <p>De drempels verschillen per oefening. Dit zijn app-mijlpalen op basis van oefeningen, geen geïsoleerde meting van een spier of officiële krachtstandaard. Bench Press telt bijvoorbeeld voor borst, terwijl triceps en schouders meehelpen. Plank en Captains Chair blijven in je trainingslog en hebben hier geen eigen krachtrank. Machine- en kabeldrempels lopen sneller op. Vergelijk die sets op hetzelfde apparaat met dezelfde instelling.</p>
    <ul class="strength-exercise-guide">${muscles.map(muscle=>`<li><strong>${muscle.name}</strong> · ${muscle.exercises.map(item=>item.exercise).join(", ")}</li>`).join("")}</ul>
  </details>
  </section>`;
}
