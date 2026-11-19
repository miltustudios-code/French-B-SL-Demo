"use strict";

const SKILLS = {
  reading: { label:"Lecture", icon:"▤", verb:"Lire" },
  listening: { label:"Écoute", icon:"♫", verb:"Écouter" },
  writing: { label:"Écriture", icon:"✎", verb:"Écrire" },
  speaking: { label:"Oral", icon:"◉", verb:"Parler" }
};
const LEARNERS = [
  { id:"alex", name:"Alex Martin", group:"DP1", initials:"AM" },
  { id:"nora", name:"Nora Diallo", group:"DP1", initials:"ND" },
  { id:"mila", name:"Mila Roy", group:"DP2", initials:"MR" },
  { id:"louis", name:"Louis Bernard", group:"DP2", initials:"LB" }
];
const STUDENT_NAV = [
  ["accueil","Mon apprentissage","⌂"],["cours","Mes cours","▤"],["simulation","Examen blanc","◷"],
  ["plan","Plan de travail","▦"],["devoirs","Mes devoirs","✓"],["progres","Mes progrès","▥"]
];
const TEACHER_NAV = [
  ["apercu","Vue d’ensemble","▥"],["eleves","Élèves","♧"],["devoirs","Devoirs assignés","▦"],["corrections","Corrections","✎"]
];
const STORAGE = "arka-french-b-v2";
const app = document.querySelector(".main");
const dialog = document.querySelector("#dialog");
const h = value => String(value ?? "").replace(/[&<>"']/g,x=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[x]));
const words = text => text.trim().split(/\s+/).filter(Boolean).length;
const now = () => new Date().toISOString();
const offsetDate = days => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};
const ymd = date => [date.getFullYear(), ("0"+(date.getMonth()+1)).slice(-2), ("0"+date.getDate()).slice(-2)].join("-");
function fmtDate(value) {
  if (!value) return "Sans date";
  const date = new Date(value.length===10 ? value+"T12:00:00" : value);
  return Number.isNaN(+date) ? "—" : date.toLocaleDateString("fr-FR",{day:"numeric",month:"short",year:"numeric"});
}
function seed() {
  const at = offsetDate(-2).toISOString();
  const assignment = {id:"example-assignment",student:"alex",unit:"bien-etre",skill:"listening",at,due:ymd(offsetDate(6)),note:"Repère le changement annoncé et explique pourquoi les cartes sont conservées."};
  const submission = {id:"example-writing",student:"nora",unit:"identites",at,demo:true,text:"Titre : Mes dessins en ligne\n\nSalut à tous,\n\nJ’aime partager mes dessins parce que mes amis me donnent des idées. La semaine dernière, j’ai publié le dessin de ma rue, mais j’ai enlevé mon adresse. Pour moi, c’est important. Et vous, que gardez-vous pour vous ?",status:"pending",comment:"",rubric:{}};
  return {
    student:"alex", results:{
      alex:{}, nora:{"identites:reading":{at,score:3,total:4,demo:true},"identites:writing":{at,demo:true}},
      mila:{"identites:reading":{at,score:4,total:4,demo:true},"identites:listening":{at,score:3,total:4,demo:true},"identites:speaking":{at,demo:true}},
      louis:{"identites:listening":{at,score:2,total:4,demo:true}}
    },
    drafts:{}, grammar:{}, evidence:{}, oralNotes:{}, assignments:[assignment], submissions:[submission], exam:{}, activeExam:{}
  };
}
let state;
try { state = JSON.parse(localStorage.getItem(STORAGE)) || seed(); } catch { state = seed(); }
let storageOK = true;
function save() {
  try { localStorage.setItem(STORAGE,JSON.stringify(state)); } catch { storageOK = false; }
}
const student = () => LEARNERS.find(p=>p.id===state.student) || LEARNERS[0];
const person = id => LEARNERS.find(p=>p.id===id);
const findUnit = id => COURSE.find(u=>u.id===id);
const route = (unit,skill) => "#pratique/"+unit.id+"/"+skill;
const taskKey = (unit,skill) => unit.id+":"+skill;
const ownKey = (unit,skill) => student().id+":"+taskKey(unit,skill);
const assignmentDone = a => {
  const entry = (state.results[a.student]||{})[a.unit+":"+a.skill];
  return !!entry && !entry.demo && entry.at>=a.at;
};
const result = (unit,skill,id=student().id) => state.results[id]?.[taskKey(unit,skill)];
function mark(unit,skill,values={}) {
  (state.results[student().id] ||= {})[taskKey(unit,skill)] = {at:now(),...values};
  save();
}
const counted = id => Object.keys(state.results[id]||{}).length;
const total = COURSE.length * Object.keys(SKILLS).length;
const percent = id => Math.round(counted(id)/total*100);
function skillAvg(id,skill) {
  const attempts = COURSE.map(u=>result(u,skill,id)).filter(v=>v?.total);
  return attempts.length?Math.round(100*attempts.reduce((s,t)=>s+t.score,0)/attempts.reduce((s,t)=>s+t.total,0)):null;
}
const pct = n => n===null ? "—" : n+" %";
const writingStatus = {pending:"À corriger",reviewed:"Corrigée",revise:"À reprendre"};
const pendingFor = id => state.submissions.filter(s=>s.student===id&&s.status==="pending").length;
const needsSupport = id => {
  const listening = skillAvg(id,"listening");
  return (listening!==null&&listening<60)||state.submissions.some(s=>s.student===id&&s.status==="revise");
};
const pill = (text,style="") => '<span class="pill '+style+'">'+h(text)+'</span>';
const rail = (value,label) => '<div class="rail" role="progressbar" aria-label="'+h(label)+'" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+value+'"><span style="width:'+value+'%"></span></div>';
const action = (label,hash,kind="primary") => '<a class="'+kind+'" href="'+h(hash)+'">'+h(label)+'</a>';
const list = items => '<ul class="bullet-list">'+items.map(x=>'<li>'+h(x)+'</li>').join("")+'</ul>';
const paragraphs = lines => lines.map(line=>'<p>'+h(line)+'</p>').join("");
const metric = (label,value,note) => '<section class="card metric"><small>'+h(label)+'</small><strong>'+h(value)+'</strong><p class="small-note">'+h(note)+'</p></section>';
function page(title,desc,body,kicker="FRENCH B SL · 2027–2028") {
  return '<header class="page-head"><p class="kicker">'+h(kicker)+'</p><h1>'+h(title)+'</h1><p>'+h(desc)+'</p></header>'+body;
}
function table(headers,rows) {
  return '<div class="table-wrap"><table class="table"><thead><tr>'+headers.map(x=>'<th scope="col">'+h(x)+'</th>').join("")+'</tr></thead><tbody>'+rows.map(row=>'<tr>'+row.map(c=>'<td>'+c+'</td>').join("")+'</tr>').join("")+'</tbody></table></div>';
}
function sectionTitle(title,badge="") {
  return '<div class="card-title"><h2>'+h(title)+'</h2>'+badge+'</div>';
}
function lessonLinks(unit) {
  return '<div class="lesson-links">'+Object.entries(SKILLS).map(([id,info])=>action(info.verb+(result(unit,id)?" ✓":""),route(unit,id),"quiet")).join("")+'</div>';
}
function nextTask() {
  for (const unit of COURSE) for (const skill of Object.keys(SKILLS)) if (!result(unit,skill)) return [unit,skill];
  return [COURSE[0],"reading"];
}
function assignmentsMarkup(entries,teacher=false) {
  if (!entries.length) return '<p class="muted">Aucun devoir dans cette liste.</p>';
  if (teacher) return table(["Élève","Activité","Échéance","Statut"],
    entries.map(a=>[h(person(a.student).name),
      '<strong>'+h(findUnit(a.unit).title)+'</strong><small>'+h(SKILLS[a.skill].label)+'</small><small>'+h(a.note)+'</small>',
      h(fmtDate(a.due)),pill(assignmentDone(a)?"Terminé":"À faire",assignmentDone(a)?"good":"pending")]));
  return entries.map(a=>'<article class="list-row"><div class="between"><strong>'+h(findUnit(a.unit).title)+' · '+h(SKILLS[a.skill].label)+'</strong>'+pill(assignmentDone(a)?"Terminé":"À faire",assignmentDone(a)?"good":"pending")+'</div><p>'+h(a.note)+'</p><p class="small-note">Échéance · '+h(fmtDate(a.due))+'</p>'+action(assignmentDone(a)?"Revoir l’activité":"Ouvrir l’activité",route(findUnit(a.unit),a.skill),"quiet")+'</article>').join("");
}
function progressCard(id) {
  return '<section class="card">'+sectionTitle("Ma progression",pill(percent(id)+" %","good"))+
    '<p class="small-note">'+counted(id)+' sur '+total+' activités réalisées</p>'+rail(percent(id),"Progression totale")+
    Object.entries(SKILLS).map(([skill,data])=>{const n=COURSE.filter(u=>result(u,skill,id)).length;return '<div class="between small-note"><span>'+h(data.label)+'</span><span>'+n+'/'+COURSE.length+'</span></div>'+rail(n*100/COURSE.length,data.label);}).join("")+
    action("Voir mes résultats","#progres","quiet")+'</section>';
}
function home() {
  const id = student().id;
  const [lesson,skill] = nextTask();
  const due = state.assignments.filter(a=>a.student===id&&!assignmentDone(a)).slice(0,2);
  return page("Mon atelier de français","Reprenez vos activités ou ouvrez un devoir assigné.",'<div class="home-grid"><div class="stack"><article class="hero"><div><p class="kicker">Identités · '+(lesson.id==="identites"?"Unité 1":"Unité 2")+'</p><h2>'+h(lesson.title)+'</h2><p>'+h(lesson.description)+'</p>'+action("Reprendre l’activité →",route(lesson,skill))+'</div><img src="'+h(lesson.image)+'" alt="'+h(lesson.alt)+'" width="600" height="400"></article>'+
    '<div class="tiles">'+Object.entries(SKILLS).map(([key,value])=>'<a class="card tile" href="'+route(lesson,key)+'"><span class="tile-icon" aria-hidden="true">'+value.icon+'</span><strong>'+value.label+'</strong><small>'+h(lesson[key].title)+'</small></a>').join("")+'</div>'+
    '<section class="card note">'+sectionTitle("Les notes de grammaire d’Arka")+'<p>Reformulez une idée, vérifiez la tournure et réutilisez votre phrase dans votre rédaction.</p>'+action("Ouvrir les fiches et l’atelier","#grammaire","quiet")+'</section></div><div class="stack">'+progressCard(id)+'<section class="card">'+sectionTitle("Devoirs à faire",pill(due.length,"pending"))+assignmentsMarkup(due)+
    '<div class="actions">'+action("Tous mes devoirs","#devoirs","quiet")+'</div></section></div></div>');
}
const themeItems = [["Identités","Portraits personnels, vie numérique et bien-être"],["Expériences","Récits, loisirs et voyages"],["Ingéniosité humaine","Médias et technologie"],["Organisation sociale","Éducation et communauté"],["Partage de la planète","Environnement et responsabilité"]];
function courses(tab) {
  const assessment = tab==="evaluation";
  return page("Mes cours","Deux unités de pratique accompagnent votre parcours French B SL.",
    '<nav class="route-tabs" aria-label="Parcours"><a href="#cours" '+(!assessment?'aria-current="page"':'')+'>Parcours de classe</a><a href="#cours/evaluation" '+(assessment?'aria-current="page"':'')+'>Préparation à l’évaluation</a></nav>'+
    (assessment?'<section class="card soft"><h2>Préparer les épreuves</h2>'+list(["Paper 1 · Une tâche d’écriture de 250 à 400 mots.","Paper 2 · Compréhension orale et écrite.","Oral individuel SL · Présentation à partir d’une image et deux discussions."])+'<div class="actions">'+action("Commencer l’examen blanc","#simulation")+action("Pratiquer l’oral",route(COURSE[0],"speaking"),"quiet")+'</div></section>':'<div class="course-grid">'+COURSE.map((u,i)=>{
      const n=Object.keys(SKILLS).filter(s=>result(u,s)).length;
      return '<article class="card"><p class="kicker">Unité '+(i+1)+' · '+h(u.theme)+'</p><h2>'+h(u.title)+'</h2><p>'+h(u.description)+'</p><p class="small-note">'+h(u.reference)+' · '+n+'/4 activités</p>'+rail(n*25,u.title)+lessonLinks(u)+'</article>';
    }).join("")+'</div>')+
    '<section class="card" style="margin-top:15px"><h2>Les cinq thèmes du cours</h2>'+themeItems.map(([name,desc],i)=>'<div class="doc-row"><strong>'+h(name)+'</strong><p>'+h(desc)+' '+pill(i===0?"Activités disponibles":"À venir",i===0?"good":"")+'</p></div>').join("")+'</section>');
}
function plan() {
  return page("Mon plan de travail","Répartissez les activités sur la semaine et reprenez les devoirs de la classe.",'<div class="course-grid">'+COURSE.map((u,i)=>'<section class="card"><p class="kicker">Semaine '+(i+1)+'</p><h2>'+h(u.title)+'</h2><p>'+h(u.goal)+'</p>'+list(["Jour 1 · Lire et relever un indice dans le texte.","Jour 2 · Écouter puis vérifier vos réponses.","Jour 3 · Rédiger, relire et remettre le texte.","Jour 4 · S’entraîner à voix haute."])+lessonLinks(u)+'</section>').join("")+'</div><div class="actions">'+action("Voir les échéances de mes devoirs","#devoirs","quiet")+'</div>');
}
function homework() {
  const due = state.assignments.filter(a=>a.student===student().id).sort((a,b)=>(a.due||"9999").localeCompare(b.due||"9999"));
  return page("Mes devoirs","Retrouvez les consignes d’Arka, les échéances et vos activités terminées.",'<div class="split"><section class="card">'+sectionTitle("Assignés à "+student().name,pill(due.filter(a=>!assignmentDone(a)).length+" à faire","pending"))+assignmentsMarkup(due)+'</section>'+progressCard(student().id)+'</div>');
}
function progress() {
  const id=student().id;
  const rows = COURSE.flatMap(u=>Object.entries(SKILLS).map(([key,s])=>{
    const r=result(u,key);
    return [h(u.title),h(s.label),r?.total?h(r.score+" / "+r.total):r?"Terminé":"—",h(r?fmtDate(r.at)+(r.demo?" · exemple":""):"À faire"),action(r?"Revoir":"Pratiquer",route(u,key),"quiet")];
  }));
  const reports=state.submissions.filter(s=>s.student===id).slice().reverse();
  const exams=state.exam[id]||[];
  return page("Mes progrès","Consultez vos résultats et les commentaires de l’enseignant.",'<div class="metrics">'+metric("Progression",percent(id)+" %","Parcours de démonstration")+metric("Activités",counted(id)+" / "+total,"Activités réalisées")+metric("Lecture",pct(skillAvg(id,"reading")),"Résultats des activités")+metric("Écoute",pct(skillAvg(id,"listening")),"Résultats des activités")+'</div>'+
    '<div class="stack"><section class="card"><h2>Résultats par activité</h2>'+table(["Unité","Compétence","Résultat","Date","Activité"],rows)+'</section><section class="card"><h2>Rédactions et retours</h2>'+
    (reports.length?reports.map(s=>'<article class="list-row"><strong>'+h(findUnit(s.unit).writing.title)+'</strong> '+pill(writingStatus[s.status])+'<p class="small-note">'+h(fmtDate(s.at))+' · '+words(s.text)+' mots</p>'+(s.comment?'<p><strong>Retour d’Arka</strong> · '+h(s.comment)+'</p>':'')+
    '<div class="actions"><button class="quiet" data-action="see-submission" data-id="'+h(s.id)+'">Voir mon texte</button>'+(s.status==="revise"?action("Reprendre la rédaction",route(findUnit(s.unit),"writing"),"quiet"):'')+'</div></article>').join(""):'<p class="muted">Vos rédactions remises apparaîtront ici.</p>')+'</section>'+
    '<section class="card"><h2>Entraînements chronométrés</h2>'+(exams.length?exams.slice().reverse().map(e=>'<p><strong>'+e.score+'/'+e.total+'</strong> · '+h(fmtDate(e.at))+'</p>').join(""):'<p class="muted">Les résultats de vos simulations apparaîtront ici.</p>')+'</section></div>');
}

let cohortFilter="all";
let attentionFilter="all";
let searchTerm="";
let reviewFilter="pending";
let reviewId="";
const reviewRubric = [["language","Langue"],["message","Message"],["conventions","Compréhension conceptuelle et conventions"]];
const mean = values => values.length?Math.round(values.reduce((a,b)=>a+b,0)/values.length):null;
const cohort = () => LEARNERS.filter(x=>cohortFilter==="all"||x.group===cohortFilter);
function personCell(p) {
  return '<div class="person"><span class="avatar" aria-hidden="true">'+p.initials+'</span><div><strong>'+h(p.name)+'</strong><small>'+p.group+' · Profil fictif</small></div></div>';
}
function teacherFilters(full) {
  return '<div class="toolbar"><label class="field">Groupe<select id="cohort"><option value="all">Tous les groupes</option>'+["DP1","DP2"].map(x=>'<option '+(cohortFilter===x?"selected":"")+'>'+x+'</option>').join("")+'</select></label>'+
    (full?'<label class="field">Rechercher un élève<input id="studentSearch" type="search" value="'+h(searchTerm)+'" placeholder="Nom ou prénom"></label><label class="field">Suivi<select id="attention"><option value="all">Tous les élèves</option><option value="support" '+(attentionFilter==="support"?"selected":"")+'>À accompagner</option><option value="pending" '+(attentionFilter==="pending"?"selected":"")+'>Rédaction à corriger</option></select></label>':"")+'</div>';
}
function learnerTable(learners) {
  if(!learners.length)return '<p class="muted" role="status">Aucun élève ne correspond à ces filtres.</p>';
  return table(["Élève","Progression","Lecture","Écoute","Rédaction","Suivi"],learners.map(p=>{
    const previous = state.submissions.filter(s=>s.student===p.id).at(-1);
    return [personCell(p),rail(percent(p.id),"Progression de "+p.name)+pct(percent(p.id)),pct(skillAvg(p.id,"reading")),pct(skillAvg(p.id,"listening")),previous?pill(writingStatus[previous.status],previous.status==="reviewed"?"good":"pending"):"—",'<button class="quiet" data-action="student-details" data-id="'+p.id+'">Voir le profil</button>'];
  }));
}
function dashboard() {
  const learners = cohort();
  const chart = ["reading","listening"].map(s=>{
    const val=mean(learners.map(p=>skillAvg(p.id,s)).filter(x=>x!==null));
    return '<div class="between"><span>'+SKILLS[s].label+'</span><strong>'+pct(val)+'</strong></div>'+rail(val??0,SKILLS[s].label);
  }).join("");
  const support=learners.filter(p=>needsSupport(p.id));
  const pending=state.submissions.filter(s=>s.status==="pending"&&learners.some(p=>p.id===s.student));
  const enrolments=learners.length;
  return page("Vue d’ensemble","Suivez les progrès de la classe et choisissez les exercices à retravailler.",'<div class="between">'+teacherFilters(false)+'<button class="primary" data-action="assign">Assigner un devoir</button></div>'+
    '<div class="metrics">'+metric("Élèves",enrolments,"Profils de démonstration")+metric("Progression moyenne",pct(mean(learners.map(p=>percent(p.id)))),"Activités des deux unités")+metric("Élèves à accompagner",support.length,"Écoute sous 60 % ou rédaction à reprendre")+metric("Rédactions à corriger",pending.length,"Remises du groupe sélectionné")+'</div>'+
    '<div class="split"><div class="stack"><section class="card">'+sectionTitle("Progression de la classe",pill("Données fictives"))+learnerTable(learners)+'</section><section class="card"><h2>Résultats moyens</h2>'+chart+'</section></div><div class="stack"><section class="card note"><h2>À accompagner</h2>'+
    (support.length?support.map(p=>'<div class="list-row">'+personCell(p)+'<p class="small-note">Écoute '+pct(skillAvg(p.id,"listening"))+'</p><button class="quiet" data-action="assign" data-id="'+p.id+'">Assigner un renfort</button></div>').join(""):'<p>Aucun renfort signalé.</p>')+
    '</section><section class="card"><h2>Rédactions en attente</h2>'+
    (pending.length?pending.map(s=>'<div class="list-row"><strong>'+h(person(s.student).name)+'</strong><p>'+h(findUnit(s.unit).writing.title)+'</p>'+action("Corriger","#professeur/corrections/"+s.id,"quiet")+'</div>').join(""):'<p>Aucune rédaction à corriger.</p>')+'</section></div></div>',"CLASSE D’ARKA BHATTACHARYA · ESPACE ENSEIGNANT");
}
function filteredList() {
  const normal = s=>s.normalize("NFD").replace(/\p{Diacritic}/gu,"").toLowerCase();
  return cohort().filter(x=>(!searchTerm||normal(x.name).includes(normal(searchTerm)))&&(attentionFilter==="all"||(attentionFilter==="support"?needsSupport(x.id):pendingFor(x.id)>0)));
}
function learnersPage() {
  return page("Élèves","Filtrez les groupes, repérez les élèves à accompagner et ouvrez leur profil.",'<section class="card">'+teacherFilters(true)+'<div id="learnersResults">'+learnerTable(filteredList())+'</div></section>',"ESPACE ENSEIGNANT");
}
function assignedPage() {
  return page("Devoirs assignés","Choisissez un élève ou un groupe, une activité et une échéance.",'<div class="actions" style="margin-bottom:13px"><button class="primary" data-action="assign">Nouveau devoir</button></div><section class="card"><h2>Suivi des devoirs</h2>'+assignmentsMarkup(state.assignments.slice().reverse(),true)+'</section>',"ESPACE ENSEIGNANT");
}
function reviews() {
  const entries = state.submissions.filter(s=>reviewFilter==="all"||s.status==="pending").slice().reverse();
  const current = entries.find(s=>s.id===reviewId)||entries[0];
  if(current)reviewId=current.id;
  const chooser='<label class="field">Afficher<select id="reviewFilter"><option value="pending" '+(reviewFilter==="pending"?"selected":"")+'>À corriger</option><option value="all" '+(reviewFilter==="all"?"selected":"")+'>Toutes les rédactions</option></select></label>';
  return page("Corrections","Lisez les rédactions, précisez vos critères et renvoyez un commentaire à l’élève.",'<div class="review-grid"><section class="card">'+chooser+
    (entries.length?entries.map(s=>'<button class="review-row" data-action="choose-review" data-id="'+h(s.id)+'" '+(s.id===reviewId?'aria-current="true"':'')+'><strong>'+h(person(s.student).name)+'</strong><small style="display:block">'+h(findUnit(s.unit).writing.title)+'</small>'+pill(writingStatus[s.status],s.status==="reviewed"?"good":"pending")+'</button>').join(""):'<p>Aucune rédaction dans cette liste.</p>')+'</section>'+
    (current?reviewEditor(current):'<section class="card"><h2>Aucune rédaction à afficher</h2><p>Les nouvelles remises apparaîtront dans la liste.</p></section>')+'</div>',"ESPACE ENSEIGNANT");
}
function reviewEditor(s) {
  const task = findUnit(s.unit).writing;
  return '<section class="card"><h2>'+h(task.title)+'</h2><p class="small-note">'+h(person(s.student).name)+' · '+words(s.text)+' mots · '+h(fmtDate(s.at))+(s.demo?" · Exemple fictif":"")+'</p>'+
    '<details><summary>Consigne et format attendu</summary><p>'+h(task.prompt)+'</p>'+list(task.points)+'</details><div class="quote">'+h(s.text)+'</div>'+
    '<form id="reviewForm" data-id="'+h(s.id)+'">'+reviewRubric.map(([id,label])=>'<label class="field">'+h(label)+'<select name="'+id+'"><option value="">Choisir une appréciation</option><option value="covered" '+(s.rubric[id]==="covered"?"selected":"")+'>Bien développé</option><option value="develop" '+(s.rubric[id]==="develop"?"selected":"")+'>À approfondir</option></select></label>').join("")+
    '<label class="field">Retour à l’élève<textarea name="comment" required maxlength="3000" placeholder="Un point réussi et une piste précise pour réviser…">'+h(s.comment)+'</textarea></label>'+
    '<div class="actions"><button class="primary" name="status" value="reviewed">Enregistrer la correction</button><button class="quiet" name="status" value="revise">Demander une révision</button></div><div class="feedback" id="reviewFeedback" role="status"></div></form></section>';
}
function openDialog(title,body) {
  dialog.innerHTML='<form method="dialog"><button class="close" aria-label="Fermer">×</button></form><h2 id="dialogTitle">'+h(title)+'</h2>'+body;
  dialog.showModal();
}
function openAssignment(id) {
  openDialog("Assigner un devoir",'<form id="assignmentForm"><label class="field">Destinataire<select name="student" required>'+
    LEARNERS.map(p=>'<option value="'+p.id+'" '+(p.id===id?"selected":"")+'>'+h(p.name)+' · '+p.group+'</option>').join("")+
    '<option value="group-DP1">Tout le groupe DP1</option><option value="group-DP2">Tout le groupe DP2</option></select></label>'+
    '<label class="field">Activité<select name="activity" required>'+COURSE.flatMap(u=>Object.entries(SKILLS).map(([s,info])=>'<option value="'+u.id+':'+s+'">'+h(u.title)+' · '+info.label+'</option>')).join("")+'</select></label>'+
    '<label class="field">Échéance<input name="due" type="date" value="'+ymd(offsetDate(7))+'" required></label>'+
    '<label class="field">Consigne<textarea name="note" maxlength="1000" required placeholder="Indiquez ce que l’élève doit travailler."></textarea></label><button class="primary">Assigner</button></form>');
}
function openProfile(id) {
  const p=person(id);
  if(!p)return;
  const sub=state.submissions.filter(s=>s.student===p.id).slice().reverse();
  openDialog(p.name,'<p class="small-note">'+p.group+' · Profil fictif</p>'+rail(percent(id),"Progression de "+p.name)+
    '<p>'+counted(id)+'/'+total+' activités terminées · Lecture '+pct(skillAvg(id,"reading"))+' · Écoute '+pct(skillAvg(id,"listening"))+'</p>'+
    '<h3>Devoirs</h3>'+assignmentsMarkup(state.assignments.filter(a=>a.student===id),true)+
    '<h3 style="margin-top:13px">Rédactions</h3>'+(sub.length?sub.map(s=>'<p>'+pill(writingStatus[s.status])+' '+h(findUnit(s.unit).title)+'</p>').join(""):'<p>Aucune rédaction remise.</p>')+
    '<div class="actions"><button class="primary" data-action="assign" data-id="'+id+'">Assigner un exercice</button></div>');
}
function showSubmission(id) {
  const s=state.submissions.find(r=>r.id===id&&r.student===student().id);
  if(!s)return;
  openDialog(findUnit(s.unit).writing.title,'<p>'+pill(writingStatus[s.status])+' '+words(s.text)+' mots</p><div class="quote">'+h(s.text)+'</div>'+
    (s.comment?'<h3>Retour d’Arka</h3><p>'+h(s.comment)+'</p>':"")+
    reviewRubric.filter(([key])=>s.rubric[key]).map(([key,label])=>'<p><strong>'+label+'</strong> · '+(s.rubric[key]==="covered"?"Bien développé":"À approfondir")+'</p>').join(""));
}

const noteBy = id => GRAMMAR.find(n=>n.id===id);
const noteDraft = id => state.grammar[student().id+":"+id]||"";
function grammarPage(id,unitId) {
  const current = noteBy(id)||GRAMMAR[0];
  const unit = findUnit(unitId)||COURSE[0];
  return page("Les notes de grammaire d’Arka","Choisissez l’intention de votre phrase, observez la tournure et appliquez-la à votre rédaction.",
    '<nav class="route-tabs" aria-label="Fiches de grammaire">'+GRAMMAR.map(n=>'<a href="#grammaire/'+n.id+'/'+unit.id+'" '+(n.id===current.id?'aria-current="page"':'')+'>'+h(n.title)+'</a>').join("")+'</nav><div class="coach-grid"><section class="card note"><p class="kicker">FICHE D’ARKA · '+h(current.intent)+'</p><h2>'+h(current.title)+'</h2>'+list(current.forms)+'<p>'+h(current.rule)+'</p><div class="rule">'+h(current.line)+'</div></section>'+
    '<section class="card"><h2>Appliquer la tournure</h2><p>'+h(current.task)+'</p><label class="field">Votre reformulation<textarea id="grammarDraft" data-id="'+current.id+'" maxlength="2000">'+h(noteDraft(current.id))+'</textarea></label><p class="small-note"><strong>À vérifier</strong> · '+h(current.check)+'</p>'+
    '<details><summary>Voir une réponse possible</summary><div class="quote">'+h(current.model)+'</div></details><div class="actions"><button class="primary" data-action="grammar-transfer" data-note="'+current.id+'" data-unit="'+unit.id+'">Ajouter ma phrase à la rédaction</button>'+action("Ouvrir la rédaction",route(unit,"writing"),"quiet")+'</div><div class="feedback" id="grammarFeedback" role="status"></div></section></div>',"GRAMMAIRE APPROFONDIE · NOTES DE CLASSE");
}
function assignmentContext(u,skill) {
  const due=state.assignments.filter(a=>a.student===student().id&&a.unit===u.id&&a.skill===skill&&!assignmentDone(a)).at(-1);
  return due?'<div class="warning-strip"><strong>Devoir assigné · '+h(fmtDate(due.due))+'</strong> · '+h(due.note)+'</div>':"";
}
function quizFields(items,prefix,selected=[],required=true) {
  return items.map(([q,options],i)=>'<fieldset><legend>'+(i+1)+'. '+h(q)+'</legend>'+
    options.map((opt,j)=>'<label class="option"><input type="radio" name="'+prefix+i+'" value="'+j+'" '+(required?"required ":"")+(selected[i]===j?"checked":"")+'><span>'+h(opt)+'</span></label>').join("")+'</fieldset>').join("");
}
function audioCard(activity,transcript=true) {
  return '<section class="card"><h2>'+h(activity.title)+'</h2><audio class="audio" controls preload="metadata" src="'+h(activity.audio)+'" aria-label="'+h(activity.title)+'"></audio>'+
    '<p class="small-note">Voix de synthèse · La vitesse est réglable dans le lecteur.</p>'+
    (transcript?'<details><summary>Afficher la transcription</summary><p lang="fr">'+h(activity.transcript)+'</p></details>':"")+'</section>';
}
function vocabulary(unit) {
  return '<aside class="card soft"><h2>Vocabulaire</h2>'+unit.vocab.map(([fr,en])=>'<div class="doc-row"><strong>'+h(fr)+'</strong><small style="display:block" lang="en">'+h(en)+'</small></div>').join("")+'</aside>';
}
function objectiveTask(unit,skill) {
  const t=unit[skill];
  const passage=skill==="reading"?'<article class="card passage"><h2>'+h(t.title)+'</h2>'+paragraphs(t.text)+'</article>':audioCard(t);
  const evidence=skill==="reading"?'<section class="card"><h2>Justifiez votre lecture</h2><p>'+h(t.evidence)+'</p><label class="field">Votre réponse et un indice du texte<textarea id="evidenceText" data-unit="'+unit.id+'" maxlength="1500">'+h(state.evidence[ownKey(unit,skill)])+'</textarea></label><details><summary>Comparer avec une réponse possible</summary><p>'+h(t.modelEvidence)+'</p></details></section>':"";
  return '<div class="split"><div class="stack">'+passage+'<section class="card"><h2>Vérifiez votre compréhension</h2><form id="quizForm" data-unit="'+unit.id+'" data-skill="'+skill+'">'+quizFields(t.questions,"q",result(unit,skill)?.answers)+'<button class="primary">Vérifier mes réponses</button><div class="feedback" id="quizFeedback" role="status"></div></form></section>'+evidence+'</div>'+vocabulary(unit)+'</div>';
}
function writingDraft(u) {
  return state.drafts[ownKey(u,"writing")] ||= {text:"",format:"",checks:[]};
}
function writingTask(unit) {
  const t=unit.writing;
  const draft=writingDraft(unit);
  const previous=state.submissions.filter(s=>s.unit===unit.id&&s.student===student().id).at(-1);
  const options=[t.alternatives[0],t.format,t.alternatives[1]];
  return '<div class="split"><section class="card"><h2>'+h(t.title)+'</h2><p>'+h(t.prompt)+'</p>'+list(t.points)+
    '<p class="small-note">Pratique guidée · Si vous simulez Paper 1, développez votre réponse en 250 à 400 mots.</p>'+
    (previous?'<p>'+pill(writingStatus[previous.status],previous.status==="reviewed"?"good":"pending")+(previous.comment?' <strong>Retour d’Arka</strong> · '+h(previous.comment):"")+'</p>':"")+
    '<form id="writingForm" data-unit="'+unit.id+'"><div class="format-layout"><label class="field">Type de texte<select name="format" required><option value="">Choisir un type de texte</option>'+options.map(s=>'<option '+(draft.format===s?"selected":"")+'>'+h(s)+'</option>').join("")+'</select></label><button class="quiet" type="button" data-action="check-format" data-unit="'+unit.id+'">Vérifier le format</button></div><div class="feedback" id="formatFeedback" role="status"></div>'+
    '<div class="actions"><button class="quiet" type="button" data-action="starter" data-unit="'+unit.id+'">Insérer la trame</button></div><label class="field">Mon brouillon<textarea class="composition" name="text" required maxlength="12000" placeholder="Commencez votre texte…">'+h(draft.text)+'</textarea></label><p class="small-note"><span id="wordCount">'+words(draft.text)+'</span> mots · Sauvegarde dans ce navigateur</p>'+
    '<fieldset><legend>Avant de remettre mon texte</legend>'+t.points.map((p,i)=>'<label class="check"><input name="check" type="checkbox" value="'+i+'" '+(draft.checks.includes(i)?"checked":"")+'><span>'+h(p)+'</span></label>').join("")+'</fieldset><button class="primary">Remettre à l’enseignant · Démo</button><div class="feedback" id="writingFeedback" role="status"></div></form></section>'+
    '<div class="stack"><aside class="card soft"><h2>Construire le texte</h2><p>'+h(t.register)+'</p>'+list(t.structure)+'<details><summary>Afficher un modèle commenté</summary><div class="quote">'+h(t.model)+'</div><p>'+h(t.register)+'</p></details></aside>'+
    '<aside class="card note"><p class="kicker">LES NOTES D’ARKA</p><h2>Grammaire pour ce texte</h2>'+t.notes.map(id=>{
      const n=noteBy(id);
      return '<div class="doc-row"><strong>'+h(n.title)+'</strong><p>'+h(n.line)+'</p><div class="tag-list">'+n.patterns.map(p=>'<button class="quiet" data-action="insert-pattern" data-unit="'+unit.id+'" data-pattern="'+h(p)+'" type="button">'+h(p)+'</button>').join("")+'</div><div class="actions">'+action("Travailler ma phrase","#grammaire/"+id+"/"+unit.id,"quiet")+'</div></div>';
    }).join("")+'</aside></div></div>';
}
const recordings = new Map();
let sessionRecorder;
let recordingStream;
let oralRun;
function speakingTask(unit) {
  const t=unit.speaking;
  const recording=recordings.get(ownKey(unit,"speaking"));
  return '<div class="split"><div class="stack"><section class="card"><img class="illustration" src="'+unit.image+'" alt="'+h(unit.alt)+'" width="600" height="400"><h2>'+h(t.title)+'</h2>'+list(t.prompts)+
    '<label class="field">Mes mots-clés<textarea id="oralNotes" data-unit="'+unit.id+'" maxlength="1200" placeholder="Lieu, indice précis, interprétation, lien culturel…">'+h(state.oralNotes[ownKey(unit,"speaking")])+'</textarea></label>'+
    '<details><summary>Relances · Thème de l’image</summary>'+list(t.follow)+'</details><details><summary>Discussion · Un autre thème</summary>'+list(t.extra)+'</details>'+
    '<div class="actions"><button class="primary" data-action="oral-complete" data-unit="'+unit.id+'">Terminer l’entraînement</button></div><div class="feedback" id="oralFeedback" role="status"></div></section></div>'+
    '<div class="stack"><aside class="card note"><h2>Minuteur oral SL</h2><label class="field">Étape<select id="oralDuration"><option value="240">Présentation · 4 min</option><option value="150">Présentation guidée · 2 min 30</option><option value="300">Relances · 5 min</option><option value="360">Autre thème · 6 min</option><option value="900">Préparation · 15 min</option></select></label><output class="clock" id="oralClock" aria-label="Temps restant">04:00</output><div class="actions"><button class="primary" data-action="timer">Démarrer</button><button class="quiet" data-action="timer-reset">Réinitialiser</button></div></aside>'+
    '<aside class="card"><h2>M’enregistrer</h2><p class="small-note">Facultatif · Le navigateur demande la permission d’utiliser le micro. L’audio reste disponible sur cette page.</p><button class="quiet" data-action="record" data-unit="'+unit.id+'">Démarrer l’enregistrement</button><div class="feedback" id="recordFeedback" role="status"></div><div id="oralPlayback">'+(recording?'<audio class="audio" controls src="'+recording+'" aria-label="Votre enregistrement"></audio>':"")+'</div></aside></div></div>';
}
function practice(unit,skill) {
  if(!unit||!Object.hasOwn(SKILLS,skill))return courses();
  const content=skill==="writing"?writingTask(unit):skill==="speaking"?speakingTask(unit):objectiveTask(unit,skill);
  const instructions={reading:"Repérez les informations, puis justifiez une réponse avec un indice du texte.",listening:"Écoutez pour comprendre l’essentiel, puis repérez les détails lors d’une seconde écoute.",writing:unit.goal,speaking:"Décrivez l’image, développez une interprétation et répondez aux relances à voix haute."};
  return page(SKILLS[skill].verb+" · "+unit.title,instructions[skill],
    '<nav class="route-tabs" aria-label="Activités de l’unité">'+Object.entries(SKILLS).map(([s,x])=>'<a href="'+route(unit,s)+'" '+(s===skill?'aria-current="page"':'')+'>'+x.label+(result(unit,s)?" ✓":"")+'</a>').join("")+'</nav>'+assignmentContext(unit,skill)+content,
    unit.theme+" · "+unit.reference);
}

let tickId;
function displayTime(seconds) {
  return String(Math.floor(seconds/60)).padStart(2,"0")+":"+String(seconds%60).padStart(2,"0");
}
function examPage() {
  const id=student().id;
  const active=state.activeExam[id];
  const recent=(state.exam[id]||[]).at(-1);
  if(!active) {
    const resultBlock=recent?'<section class="card"><h2>Dernier résultat</h2><p><strong>'+recent.score+'/'+recent.total+'</strong> · '+h(fmtDate(recent.at))+'</p>'+
      (recent.timedOut?'<p class="small-note">Temps écoulé. Les réponses saisies ont été évaluées.</p>':'')+
      ['reading','listening'].map(s=>'<details><summary>'+SKILLS[s].label+' · '+recent[s].score+'/'+recent[s].total+'</summary>'+list(MOCK[s].questions.map((q,i)=>(recent[s].answers[i]===q[2]?"✓ ":"À revoir · ")+q[3]))+'</details>').join("")+
      '<details><summary>Transcription de l’audio</summary><p>'+h(MOCK.listening.transcript)+'</p></details></section>':"";
    return page("Examen blanc","Préparez vos épreuves de French B SL avec des activités originales et un temps limité.",
      '<div class="course-grid"><section class="card soft"><h2>Paper 2 · Écoute et lecture</h2><p>Une simulation de 12 minutes avec deux documents et six questions. Vous recevrez les corrections à la fin.</p><button data-action="exam-start" class="primary">'+(recent?"Recommencer la simulation":"Démarrer la simulation")+'</button></section>'+
      '<section class="card"><h2>Écriture et oral</h2><p>Appliquez les conventions de Paper 1 à une tâche d’écriture. Entraînez-vous avec une image et des relances pour l’oral SL.</p><div class="actions">'+action("Paper 1 · Écriture",route(COURSE[1],"writing"),"quiet")+action("Oral individuel",route(COURSE[1],"speaking"),"quiet")+'</div></section></div>'+
      (resultBlock?'<div class="mock-block">'+resultBlock+'</div>':""));
  }
  return page("Simulation Paper 2","Répondez aux questions de lecture et d’écoute. Les réponses sont enregistrées pendant l’exercice.",
    '<div class="statusbar"><strong>Temps restant</strong><output id="examClock" class="clock" aria-label="Temps restant">'+displayTime(Math.max(0,Math.ceil((active.deadline-Date.now())/1000)))+'</output></div>'+
    '<form id="examForm" class="stack mock-block"><section class="card passage"><h2>'+h(MOCK.reading.title)+'</h2>'+paragraphs(MOCK.reading.text)+quizFields(MOCK.reading.questions,"mr",active.reading,false)+'</section>'+
    audioCard(MOCK.listening,false)+'<section class="card"><h2>Questions d’écoute</h2>'+quizFields(MOCK.listening.questions,"ml",active.listening,false)+'<button class="primary">Terminer et voir le résultat</button></section></form>');
}
const answersAt = (data,length,prefix) => Array.from({length},(_,i)=>data.has(prefix+i)?Number(data.get(prefix+i)):-1);
function score(questions,answers) {
  return {score:questions.filter((q,i)=>q[2]===answers[i]).length,total:questions.length,answers};
}
function finishExam(timedOut=false) {
  const id=student().id;
  const active=state.activeExam[id];
  if(!active)return;
  const form=document.querySelector("#examForm");
  if(form) syncExam(form);
  const reading=score(MOCK.reading.questions,active.reading||[]);
  const listening=score(MOCK.listening.questions,active.listening||[]);
  (state.exam[id] ||= []).push({reading,listening,score:reading.score+listening.score,total:reading.total+listening.total,at:now(),timedOut});
  delete state.activeExam[id];
  save();
  render();
}
function syncExam(form) {
  const active=state.activeExam[student().id];
  if(!active)return;
  const data=new FormData(form);
  active.reading=answersAt(data,MOCK.reading.questions.length,"mr");
  active.listening=answersAt(data,MOCK.listening.questions.length,"ml");
  save();
}
function getPage() {
  let [part,a,b]=location.hash.slice(1).split("/");
  const legacy={ecouter:"listening",lire:"reading",ecrire:"writing",parler:"speaking"};
  if(Object.hasOwn(legacy,part))return {part:"pratique",a:COURSE[0].id,b:legacy[part],teacher:false};
  if(part==="grammaire"&&a==="liens")a="logique";
  if(["docente","enseignant"].includes(part))part="professeur";
  if(a==="resumen")a="apercu";
  const teacher=part==="professeur";
  const primary=["accueil","cours","simulation","plan","devoirs","progres","grammaire","pratique"];
  return {part:teacher||primary.includes(part)?part:"accueil",a,b,teacher};
}
function render() {
  clearInterval(tickId);
  if (sessionRecorder?.state==="recording") sessionRecorder.stop();
  recordingStream?.getTracks().forEach(track=>track.stop());
  recordingStream=null;
  oralRun=null;
  const {part,a,b,teacher}=getPage();
  const teacherView = TEACHER_NAV.some(([id])=>id===a)?a:"apercu";
  const select = document.querySelector("#learnerSelect");
  const current=teacher?teacherView:part;
  const nav=teacher?TEACHER_NAV:STUDENT_NAV;
  document.querySelector("#nav").innerHTML=nav.map(([id,label,icon])=>'<a class="nav-link" href="#'+(teacher?"professeur/":"")+id+'" '+(id===current?'aria-current="page"':'')+'><span class="nav-icon" aria-hidden="true">'+icon+'</span><span>'+label+'</span></a>').join("");
  document.querySelector("#breadcrumb").textContent=nav.find(([id])=>id===current)?.[1]||(part==="grammaire"?"Notes d’Arka":"Activité de français");
  document.querySelector("#studentRole").toggleAttribute("aria-current",!teacher);
  document.querySelector("#teacherRole").toggleAttribute("aria-current",teacher);
  document.querySelector("#headerAvatar").textContent=teacher?"AB":student().initials;
  select.hidden=teacher;
  select.innerHTML=LEARNERS.map(p=>'<option value="'+p.id+'" '+(p.id===student().id?"selected":"")+'>'+h(p.name)+' · '+p.group+'</option>').join("");
  if(teacher) {
    if(teacherView==="corrections"&&b) {
      reviewId=b;
      if(state.submissions.some(s=>s.id===b&&s.status!=="pending"))reviewFilter="all";
    }
    app.innerHTML={apercu:dashboard,eleves:learnersPage,devoirs:assignedPage,corrections:reviews}[teacherView]();
  } else {
    const pages={accueil:home,cours:()=>courses(a),simulation:examPage,plan,devoirs:homework,progres:progress,grammaire:()=>grammarPage(a,b),pratique:()=>practice(findUnit(a),b)};
    app.innerHTML=pages[part]();
    const examClock=document.querySelector("#examClock");
    if(examClock)tickId=setInterval(()=>{
      const active=state.activeExam[student().id];
      if(!active)return;
      const left=Math.max(0,Math.ceil((active.deadline-Date.now())/1000));
      examClock.value=displayTime(left);
      if(!left)finishExam(true);
    },250);
  }
  if(!storageOK) app.insertAdjacentHTML("afterbegin",'<p class="warning-strip" role="status">Le navigateur ne permet pas la sauvegarde locale. Gardez cet onglet ouvert pendant la session.</p>');
}
function notice(id,message,warning=false) {
  const box=document.getElementById(id);
  if(!box)return;
  box.textContent=message;
  box.classList.toggle("warn",warning);
}
function syncWriting(form,unit) {
  const draft=writingDraft(unit);
  const data=new FormData(form);
  draft.text=String(data.get("text")||"");
  draft.format=String(data.get("format")||"");
  draft.checks=data.getAll("check").map(Number);
  document.querySelector("#wordCount").textContent=words(draft.text);
  save();
}
function putText(field,text,useCursor) {
  if(useCursor) {
    const cursor=field===document.activeElement?field.selectionStart:field.value.length;
    const tail=field===document.activeElement?field.selectionEnd:cursor;
    const before=field.value.slice(0,cursor);
    const after=field.value.slice(tail);
    const lead=before&&!/\s$/.test(before)?"\n\n":"";
    const end=after&&!/^\s/.test(after)?" ":"";
    field.setRangeText(lead+text+end,cursor,tail,"end");
  } else field.value=text;
  field.focus();
}
async function toggleRecording(unit,button) {
  if(sessionRecorder?.state==="recording"){sessionRecorder.stop();return;}
  if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder){notice("recordFeedback","Le micro est indisponible ici. Vous pouvez vous entraîner sans enregistrement.",true);return;}
  const k=ownKey(unit,"speaking");
  button.disabled=true;
  let stream;
  try {
    stream=await navigator.mediaDevices.getUserMedia({audio:true});
    if(!button.isConnected){stream.getTracks().forEach(t=>t.stop());return;}
    const recorder=new MediaRecorder(stream);
    const chunks=[];
    sessionRecorder=recorder;
    recordingStream=stream;
    recorder.addEventListener("dataavailable",event=>{if(event.data.size)chunks.push(event.data);});
    recorder.addEventListener("stop",()=>{
      stream.getTracks().forEach(t=>t.stop());
      if(recordingStream===stream)recordingStream=null;
      if(sessionRecorder===recorder)sessionRecorder=null;
      if(!chunks.length)return;
      const old=recordings.get(k);
      if(old) URL.revokeObjectURL(old);
      const url=URL.createObjectURL(new Blob(chunks,{type:recorder.mimeType}));
      recordings.set(k,url);
      if(!button.isConnected)return;
      button.textContent="Démarrer l’enregistrement";
      document.querySelector("#oralPlayback").innerHTML='<audio class="audio" controls src="'+url+'" aria-label="Votre enregistrement"></audio>';
      notice("recordFeedback","Écoutez votre enregistrement et notez une amélioration.");
    });
    recorder.start();
    button.textContent="Arrêter l’enregistrement";
    notice("recordFeedback","Enregistrement en cours…");
  } catch {
    stream?.getTracks().forEach(t=>t.stop());
    notice("recordFeedback","Le navigateur n’a pas donné accès au micro. Utilisez le minuteur pour continuer.",true);
  } finally {button.disabled=false;}
}
function oralReset() {
  clearInterval(tickId);
  const seconds=Number(document.querySelector("#oralDuration").value);
  oralRun={remaining:seconds,end:0};
  document.querySelector("#oralClock").value=displayTime(seconds);
  document.querySelector('[data-action="timer"]').textContent="Démarrer";
}
function oralTimer(button) {
  if(!oralRun)oralReset();
  if(oralRun.end) {
    oralRun.remaining=Math.max(0,Math.ceil((oralRun.end-Date.now())/1000));
    oralRun.end=0;
    clearInterval(tickId);
    button.textContent="Reprendre";
    return;
  }
  if(!oralRun.remaining)oralReset();
  oralRun.end=Date.now()+oralRun.remaining*1000;
  button.textContent="Mettre en pause";
  tickId=setInterval(()=>{
    oralRun.remaining=Math.max(0,Math.ceil((oralRun.end-Date.now())/1000));
    document.querySelector("#oralClock").value=displayTime(oralRun.remaining);
    if(!oralRun.remaining) {
      clearInterval(tickId);
      oralRun.end=0;
      button.textContent="Démarrer";
      notice("oralFeedback","Temps écoulé. Vous pouvez travailler les questions de relance.");
    }
  },200);
}
document.addEventListener("input",event=>{
  const el=event.target;
  if(el.id==="studentSearch"){
    searchTerm=el.value;
    document.querySelector("#learnersResults").innerHTML=learnerTable(filteredList());
  } else if(el.id==="grammarDraft") {
    state.grammar[student().id+":"+el.dataset.id]=el.value;
    save();
  } else if(el.id==="oralNotes"||el.id==="evidenceText") {
    const unit=findUnit(el.dataset.unit);
    if(el.id==="oralNotes")state.oralNotes[ownKey(unit,"speaking")]=el.value;
    else state.evidence[ownKey(unit,"reading")]=el.value;
    save();
  }
  if(el.form?.id==="writingForm")syncWriting(el.form,findUnit(el.form.dataset.unit));
  if(el.form?.id==="examForm")syncExam(el.form);
});
document.addEventListener("change",event=>{
  const el=event.target;
  if(el.id==="learnerSelect") {state.student=el.value;save();render();}
  else if(el.id==="cohort") {cohortFilter=el.value;render();}
  else if(el.id==="attention") {attentionFilter=el.value;render();}
  else if(el.id==="reviewFilter") {
    reviewFilter=el.value;
    if(location.hash!== "#professeur/corrections")location.hash="professeur/corrections";else render();
  } else if(el.id==="oralDuration")oralReset();
});
document.addEventListener("submit",event=>{
  const form=event.target;
  if(form.method==="dialog")return;
  event.preventDefault();
  const data=new FormData(form);
  const unit=findUnit(form.dataset.unit);
  if(form.id==="quizForm") {
    const skill=form.dataset.skill,qs=unit[skill].questions;
    const grade=score(qs,answersAt(data,qs.length,"q"));
    mark(unit,skill,grade);
    const out=document.querySelector("#quizFeedback");
    out.classList.toggle("warn",grade.score<grade.total);
    out.innerHTML="<strong>"+grade.score+" / "+grade.total+" bonnes réponses</strong>"+list(qs.map((q,i)=>(grade.answers[i]===q[2]?"✓ ":"À revoir · ")+q[3]));
  } else if(form.id==="writingForm") {
    syncWriting(form,unit);
    const draft=writingDraft(unit);
    if(draft.format!==unit.writing.format||words(draft.text)<35||draft.checks.length!==3||/\[[^\]]+\]/.test(draft.text)){
      notice("writingFeedback","Choisissez le bon type de texte, écrivez un brouillon d’au moins 35 mots sans les crochets de la trame et vérifiez les trois points.",true);
      return;
    }
    const last=state.submissions.filter(s=>s.student===student().id&&s.unit===unit.id).at(-1);
    if(last?.status==="pending"&&last.text===draft.text.trim()){
      notice("writingFeedback","Ce texte est déjà en attente de correction.");
      return;
    }
    state.submissions.push({id:crypto.randomUUID(),student:student().id,unit:unit.id,at:now(),text:draft.text.trim(),status:"pending",comment:"",rubric:{}});
    mark(unit,"writing");
    notice("writingFeedback","Rédaction remise dans la démo. Elle apparaît dans l’espace enseignant.");
  } else if(form.id==="assignmentForm") {
    const [id,skill]=String(data.get("activity")).split(":");
    const dest=String(data.get("student"));
    const ids=dest.startsWith("group-")?LEARNERS.filter(p=>p.group===dest.slice(6)).map(p=>p.id):[dest];
    const note=String(data.get("note")||"").trim();
    if(!note||!findUnit(id)||!Object.hasOwn(SKILLS,skill)||!ids.every(person))return;
    const at=now();
    state.assignments.push(...ids.map(student=>({id:crypto.randomUUID(),student,unit:id,skill,due:String(data.get("due")),note,at})));
    save();
    dialog.close();
    if(location.hash==="#professeur/devoirs")render();else location.hash="professeur/devoirs";
  } else if(form.id==="reviewForm") {
    const entry=state.submissions.find(s=>s.id===form.dataset.id);
    const comment=String(data.get("comment")||"").trim();
    if(!entry||!comment){notice("reviewFeedback","Rédigez un retour avant d’enregistrer.",true);return;}
    entry.comment=comment;
    entry.status=event.submitter?.value==="revise"?"revise":"reviewed";
    entry.rubric=Object.fromEntries(reviewRubric.map(([key])=>[key,String(data.get(key)||"")]));
    entry.reviewedAt=now();
    reviewFilter="all";
    save();
    render();
    notice("reviewFeedback","Retour enregistré. L’élève le voit dans Mes progrès.");
  } else if(form.id==="examForm") finishExam();
});
document.addEventListener("click",event=>{
  const button=event.target.closest("[data-action]");
  if(!button)return;
  const {action:name,id,note,unit:unitId,pattern}=button.dataset;
  const unit=findUnit(unitId);
  if(name==="assign"){if(dialog.open)dialog.close();openAssignment(id);}
  else if(name==="student-details")openProfile(id);
  else if(name==="see-submission")showSubmission(id);
  else if(name==="choose-review"){reviewId=id;if(location.hash==="#professeur/corrections")render();else location.hash="professeur/corrections";}
  else if(name==="grammar-transfer"){
    const text=noteDraft(note).trim();
    if(!text){notice("grammarFeedback","Écrivez votre propre phrase avant de l’ajouter au brouillon.",true);return;}
    const draft=writingDraft(unit);
    const merged=[draft.text.trimEnd(),text].filter(Boolean).join("\n\n");
    if(merged.length>12000){notice("grammarFeedback","Votre brouillon a atteint la limite de longueur.",true);return;}
    draft.text=merged;
    button.disabled=true;
    save();
    location.hash=route(unit,"writing");
  } else if(name==="check-format"){
    const form=document.querySelector("#writingForm");
    const valid=form.elements.format.value===unit.writing.format;
    notice("formatFeedback",valid?"Oui. "+unit.writing.register:"Relisez le destinataire et le but de la consigne avant de choisir.",!valid);
  } else if(name==="starter"||name==="insert-pattern") {
    const form=document.querySelector("#writingForm");
    if(name==="starter"&&form.elements.text.value.trim()){notice("writingFeedback","Votre brouillon contient déjà du texte. La structure reste visible dans le panneau d’aide.",true);return;}
    const inserted=name==="starter"?unit.writing.starter:pattern+" ";
    if(form.elements.text.value.length+inserted.length+2>12000){notice("writingFeedback","Votre brouillon a atteint la limite de longueur.",true);return;}
    putText(form.elements.text,inserted,name==="insert-pattern");
    syncWriting(form,unit);
  } else if(name==="oral-complete") {
    mark(unit,"speaking");
    notice("oralFeedback","Entraînement marqué terminé.");
  } else if(name==="timer")oralTimer(button);
  else if(name==="timer-reset")oralReset();
  else if(name==="record")toggleRecording(unit,button);
  else if(name==="exam-start"){
    state.activeExam[student().id]={deadline:Date.now()+12*60*1000,reading:[],listening:[]};
    save();
    render();
  } else if(name==="reset-confirm"){
    dialog.close();
    recordings.forEach(url=>URL.revokeObjectURL(url));
    recordings.clear();
    state=seed();
    save();
    render();
  }
});
document.querySelector(".skip").addEventListener("click",event=>{event.preventDefault();app.focus();});
const menu=document.querySelector("#menu");
const sidebar=document.querySelector("#sidebar");
function menuState(open){
  sidebar.classList.toggle("open",open);
  menu.setAttribute("aria-expanded",String(open));
  if(open)sidebar.querySelector(".nav-link")?.focus();
}
menu.addEventListener("click",()=>menuState(!sidebar.classList.contains("open")));
sidebar.addEventListener("click",event=>{if(event.target.closest("a"))menuState(false);});
document.addEventListener("keydown",event=>{if(event.key==="Escape"&&sidebar.classList.contains("open")){menuState(false);menu.focus();}});
document.querySelector("#sourcesLink").addEventListener("click",()=>document.querySelector("#sources").showModal());
document.querySelector("#resetDemo").addEventListener("click",()=>{
  document.querySelector("#sources").close();
  openDialog("Réinitialiser les données ?",'<p>Les brouillons, devoirs et résultats de ce navigateur seront remplacés par les données fictives de départ.</p><button class="primary" data-action="reset-confirm">Réinitialiser</button>');
});
window.addEventListener("hashchange",()=>{
  render();
  window.scrollTo({top:0,behavior:"instant"});
  app.focus({preventScroll:true});
});
render();
