/* =========================================================
   Voice Journal — Full Feature JS
   State machine, all phases, mock data, reusable UI helpers
   ========================================================= */

// ─── Mock Data ───────────────────────────────────────────
const MOCK_SEGMENTS = [
  { speaker: "You", ts: "00:00", text: "So I've been thinking about the product launch timeline. I think we need to push it back by two weeks to make sure the quality is there." },
  { speaker: "Colleague", ts: "00:18", text: "I agree. The QA team flagged several issues in the last sprint review that we really need to address before going live." },
  { speaker: "You", ts: "00:34", text: "Exactly. Let's also make sure we have the marketing materials ready. I don't want a repeat of last time where we launched without proper documentation." },
  { speaker: "Colleague", ts: "00:52", text: "Good point. I'll coordinate with the marketing team today and get a revised timeline from them by end of week." },
  { speaker: "You", ts: "01:05", text: "Perfect. And one more thing — we should set up a daily standup specifically for the launch prep. Maybe fifteen minutes each morning?" },
  { speaker: "Colleague", ts: "01:18", text: "That works. I'll send out the calendar invite. Should we include the design team as well?" },
  { speaker: "You", ts: "01:28", text: "Yes, definitely. They need to be in the loop for any last-minute UI changes." }
];

const MOCK_SEGMENTS_2 = [
  { speaker: "You", ts: "01:45", text: "One more thing I forgot to mention — we need to finalize the pricing page. The current copy doesn't match the new tier structure." },
  { speaker: "Colleague", ts: "02:02", text: "Right, I noticed that too. I'll draft a v2 of the pricing copy and share it in the channel today." },
  { speaker: "You", ts: "02:15", text: "Great. Also loop in finance to double-check the numbers before we publish anything." }
];

const MOCK_SUMMARY = {
  body: "Discussion about pushing the product launch back by two weeks to address QA-flagged issues. Key decisions include coordinating with marketing for revised timelines, setting up daily 15-minute standup meetings for launch prep, and including the design team in communications for potential UI changes.",
  todos: [
    "Push product launch date back by two weeks",
    "Coordinate with marketing team for revised material timeline",
    "Set up daily 15-min launch prep standup",
    "Include design team in standup invites",
    "Address QA-flagged issues from last sprint review",
    "Prepare proper documentation before launch"
  ],
  topics: ["Product Launch", "QA Issues", "Marketing Materials", "Daily Standup", "Design Coordination", "Documentation"]
};

const MOCK_SUMMARY_SHORT = {
  body: "Launch delayed 2 weeks for QA fixes. Daily standups planned. Marketing and design teams to be looped in.",
  todos: MOCK_SUMMARY.todos,
  topics: MOCK_SUMMARY.topics
};

const MOCK_SUMMARY_GENTLE = {
  body: "We had a thoughtful conversation about giving ourselves a bit more breathing room for the product launch — pushing it back two weeks to make sure everything feels polished. We're going to stay connected through daily check-ins and make sure everyone from marketing to design is on the same page.",
  todos: MOCK_SUMMARY.todos,
  topics: MOCK_SUMMARY.topics
};

const MOCK_FOLLOWUP_RESULT = {
  body: "The team discussed extending the product launch timeline by two weeks, primarily driven by unresolved QA issues from the latest sprint. Three action streams were established: (1) QA remediation of flagged bugs, (2) Marketing alignment on updated collateral and documentation, (3) Daily 15-min standups including design for UI-change visibility. Finance review of pricing page was also flagged as a dependency.",
  todos: [
    ...MOCK_SUMMARY.todos,
    "Finalize pricing page copy (v2)",
    "Loop in finance for pricing verification"
  ],
  topics: [...MOCK_SUMMARY.topics, "Pricing Page", "Finance Review"]
};

const MOCK_UPLOAD_FILE = { name: "team-meeting-apr7.m4a", duration: "12:34", size: "18.2 MB" };

// ─── State ───────────────────────────────────────────────
let state = "idle";          // idle | recording | paused | endDialog | saved | processing | done | uploadPrecheck | uploading
let activeTab = "transcript";
let segmentCount = 1;
let currentVersion = 0;
let versions = [];           // {id, timestamp, summary, todos, topics}
let timerSec = 0;
let timerInterval = null;
let waveInterval = null;
let typewriterTimeouts = [];
let activeSummary = null;    // points to current summary variant
let sheetType = null;
let regenScope = "all";
let regenStyle = "standard";

// ─── DOM refs ────────────────────────────────────────────
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

const idleView       = $("#vjIdleView");
const recordingView  = $("#vjRecordingView");
const uploadView     = $("#vjUploadView");
const recorder       = $("#vjRecorder");
const continueBar    = $("#vjContinueBar");
const endDialog      = $("#vjEndDialog");
const sheetOverlay   = $("#vjSheetOverlay");
const sheet          = $("#vjSheet");
const sheetHeader    = $("#vjSheetHeader");
const sheetBody      = $("#vjSheetBody");
const toast          = $("#vjToast");
const versionBanner  = $("#vjVersionBanner");
const previewOverlay = $("#vjPreviewOverlay");
const timerEl        = $("#vjTimer");
const waveformEl     = $("#vjWaveform");
const transcriptList = $("#vjTranscriptList");
const summaryContent = $("#vjSummaryContent");
const topicsContent  = $("#vjTopicsContent");
const tabs           = $("#vjTabs");

// ─── Utility Helpers ─────────────────────────────────────
function fmtTime(s){ return String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0") }

function showToast(msg){
  toast.textContent = msg;
  toast.classList.add("visible");
  setTimeout(()=> toast.classList.remove("visible"), 3000);
}

function showSkeleton(container){
  container.innerHTML = `<div class="vj-skeleton"><div class="vj-skeleton-line"></div><div class="vj-skeleton-line"></div><div class="vj-skeleton-line"></div><div class="vj-skeleton-line"></div></div>`;
}

function clearTypewriters(){
  typewriterTimeouts.forEach(t => clearTimeout(t));
  typewriterTimeouts = [];
}

// ─── View Switching ──────────────────────────────────────
function showView(view){
  idleView.classList.toggle("hidden", view !== "idle");
  recordingView.classList.toggle("hidden", view !== "recording");
  uploadView.classList.toggle("hidden", view !== "upload");
}

function enterIdleView(){
  state = "idle";
  showView("idle");
  recorder.classList.add("hidden");
  continueBar.classList.add("hidden");
}

function enterRecordingView(){
  showView("recording");
  switchTab("transcript");
}

// ─── Tab Management ──────────────────────────────────────
function switchTab(tab){
  activeTab = tab;
  $$(".vj-tab").forEach(t => t.classList.toggle("active", t.dataset.tab === tab));
  $("#vjTranscriptView").classList.toggle("hidden", tab !== "transcript");
  $("#vjSummaryView").classList.toggle("hidden", tab !== "summary");
  $("#vjTopicsView").classList.toggle("hidden", tab !== "topics");
  updateCopyShareState();
}

function enableAllTabs(){
  $$(".vj-tab").forEach(t => t.disabled = false);
}
function enableTranscriptOnly(){
  $$(".vj-tab").forEach(t => { t.disabled = t.dataset.tab !== "transcript"; });
}

// ─── Copy/Share Gating ───────────────────────────────────
function updateCopyShareState(){
  const copy = $("#vjCopy");
  const dl = $("#vjDownload");
  const genFile = $("#vjGenFile");
  if(!copy) return;
  if(state === "recording" || state === "paused" || state === "processing"){
    copy.disabled = dl.disabled = genFile.disabled = true;
  } else if(state === "saved"){
    copy.disabled = activeTab !== "transcript";
    dl.disabled = activeTab !== "transcript";
    genFile.disabled = true;
  } else if(state === "done"){
    copy.disabled = dl.disabled = genFile.disabled = false;
  } else {
    copy.disabled = dl.disabled = genFile.disabled = true;
  }
}

// ─── Timer ───────────────────────────────────────────────
function startTimer(){
  timerInterval = setInterval(()=>{ timerSec++; timerEl.textContent = fmtTime(timerSec); }, 1000);
}
function stopTimer(){ clearInterval(timerInterval); timerInterval = null; }

// ─── Waveform ────────────────────────────────────────────
function initWaveform(){
  waveformEl.innerHTML = "";
  for(let i=0;i<50;i++){
    const b = document.createElement("div");
    b.className = "vj-wave-bar";
    b.style.height = "4px";
    waveformEl.appendChild(b);
  }
}
function startWave(){
  const bars = waveformEl.querySelectorAll(".vj-wave-bar");
  waveInterval = setInterval(()=>{
    bars.forEach(b=>{ b.style.height = (4+Math.random()*24)+"px"; });
  }, 120);
}
function stopWave(){
  clearInterval(waveInterval); waveInterval = null;
  waveformEl.querySelectorAll(".vj-wave-bar").forEach(b=>{ b.style.height="4px"; });
}

// ─── Transcript Rendering ────────────────────────────────
function addSegmentInstant(seg){
  const div = document.createElement("div");
  div.className = "vj-segment";
  div.innerHTML = `<div class="vj-segment-header"><span class="vj-speaker">${seg.speaker}</span><span class="vj-timestamp">${seg.ts}</span></div><p class="vj-segment-text">${seg.text}</p>`;
  transcriptList.appendChild(div);
  transcriptList.scrollTop = transcriptList.scrollHeight;
}

function addSegmentTypewriter(seg, delay){
  return new Promise(resolve=>{
    const div = document.createElement("div");
    div.className = "vj-segment";
    div.innerHTML = `<div class="vj-segment-header"><span class="vj-speaker">${seg.speaker}</span><span class="vj-timestamp">${seg.ts}</span></div><p class="vj-segment-text vj-typing"></p>`;
    transcriptList.appendChild(div);
    const p = div.querySelector(".vj-segment-text");
    let i = 0;
    function type(){
      if(state !== "recording" && state !== "paused"){ resolve(); return; }
      if(i < seg.text.length){
        p.textContent += seg.text[i++];
        transcriptList.scrollTop = transcriptList.scrollHeight;
        const tid = setTimeout(type, 18 + Math.random()*22);
        typewriterTimeouts.push(tid);
      } else {
        p.classList.remove("vj-typing");
        resolve();
      }
    }
    const tid = setTimeout(type, delay);
    typewriterTimeouts.push(tid);
  });
}

async function scheduleSegments(segments, startDelay){
  let delay = startDelay || 400;
  for(const seg of segments){
    if(state !== "recording" && state !== "paused") break;
    await addSegmentTypewriter(seg, delay);
    delay = 600 + Math.random()*800;
  }
}

function addSegmentSeparator(){
  segmentCount++;
  const sep = document.createElement("div");
  sep.className = "vj-segment-sep";
  sep.textContent = `Segment ${segmentCount} / Added just now`;
  transcriptList.appendChild(sep);
}

// ─── Recording Flow ──────────────────────────────────────
function startRecording(){
  state = "recording";
  enterRecordingView();
  enableTranscriptOnly();
  recorder.classList.remove("hidden");
  continueBar.classList.add("hidden");
  initWaveform();
  startWave();
  startTimer();
  updateCopyShareState();
  $("#vjPauseBtn").classList.remove("paused");
  scheduleSegments(MOCK_SEGMENTS, 600);
}

function continueRecording(){
  state = "recording";
  recorder.classList.remove("hidden");
  continueBar.classList.add("hidden");
  enableTranscriptOnly();
  switchTab("transcript");
  initWaveform();
  startWave();
  startTimer();
  updateCopyShareState();
  $("#vjPauseBtn").classList.remove("paused");
  addSegmentSeparator();
  scheduleSegments(MOCK_SEGMENTS_2, 600);
}

function togglePause(){
  const btn = $("#vjPauseBtn");
  if(state === "recording"){
    state = "paused";
    btn.classList.add("paused");
    stopWave();
    stopTimer();
  } else if(state === "paused"){
    state = "recording";
    btn.classList.remove("paused");
    startWave();
    startTimer();
  }
}

function openEndDialog(){
  stopWave();
  stopTimer();
  state = "endDialog";
  endDialog.classList.remove("hidden");
}

function endAndSummarize(){
  endDialog.classList.add("hidden");
  recorder.classList.add("hidden");
  state = "processing";
  clearTypewriters();
  enableAllTabs();
  switchTab("summary");
  showSkeleton(summaryContent);
  showSkeleton(topicsContent);
  updateCopyShareState();
  setTimeout(()=> finishProcessing(MOCK_SUMMARY), 2000);
}

function endOnly(){
  endDialog.classList.add("hidden");
  recorder.classList.add("hidden");
  state = "saved";
  clearTypewriters();
  enableAllTabs();
  renderEmptyState(summaryContent, "Summary not generated yet", "Generate");
  renderEmptyState(topicsContent, "Topics not generated yet", "Generate");
  continueBar.classList.remove("hidden");
  updateCopyShareState();
  showToast("Transcript saved");
}

function cancelEnd(){
  endDialog.classList.add("hidden");
  state = "paused";
  startWave();
  startTimer();
  state = "recording";
}

// ─── Processing / Done ───────────────────────────────────
function finishProcessing(summaryData){
  state = "done";
  activeSummary = summaryData;
  currentVersion++;
  versions.push({
    id: currentVersion,
    timestamp: new Date().toLocaleTimeString(),
    summary: summaryData.body,
    todos: [...summaryData.todos],
    topics: [...summaryData.topics]
  });
  renderSummary(summaryData);
  renderTopics(summaryData.topics);
  continueBar.classList.remove("hidden");
  updateCopyShareState();
}

function renderSummary(data){
  let html = "";
  if(versions.length > 0){
    html += `<div class="vj-version-row" id="vjVersionRow"><span class="vj-version-badge">v${currentVersion}</span><span class="vj-version-label">${versions.length > 1 ? "Latest" : "Current"}</span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-left:auto"><polyline points="6 9 12 15 18 9"/></svg></div>`;
  }
  html += `<div class="vj-summary-body">${data.body}</div>`;

  html += `<div class="vj-summary-actions"><button class="vj-summary-action-btn" id="vjRegenBtn"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg> Regenerate</button><button class="vj-summary-action-btn" id="vjAddTasksBtn"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg> Add to Tasks</button></div>`;

  html += `<h3 class="vj-todos-heading">To-dos</h3><ul class="vj-todo-list">`;
  data.todos.forEach((t,i) => {
    html += `<li class="vj-todo-item"><input type="checkbox" /><span class="vj-todo-item-text">${t}</span><button class="vj-todo-action-btn" data-todo-idx="${i}" title="Remind me">&#x22EF;</button></li>`;
  });
  html += `</ul>`;

  if(state === "done"){
    html += `<div class="vj-followup-card"><label class="vj-followup-label">Follow-up</label><textarea class="vj-followup-input" placeholder="Refine this summary..." id="vjFollowupInput"></textarea><div class="vj-followup-chips"><button class="vj-followup-chip" data-prompt="Make it shorter">Make it shorter</button><button class="vj-followup-chip" data-prompt="More gentle">More gentle</button><button class="vj-followup-chip" data-prompt="Focus on feelings">Focus on feelings</button><button class="vj-followup-chip" data-prompt="Extract next steps">Extract next steps</button></div><button class="vj-followup-cta" id="vjFollowupCta">Update</button></div>`;
  }

  summaryContent.innerHTML = html;
}

function renderTopics(topics){
  let html = `<div class="vj-topics-section-title">Key Topics</div><div>`;
  topics.forEach(t => { html += `<span class="vj-topic-chip">${t}</span>`; });
  html += `</div>`;
  topicsContent.innerHTML = html;
}

function renderEmptyState(container, msg, ctaLabel){
  container.innerHTML = `<div class="vj-empty-state"><div class="vj-empty-icon">&#x1F4DD;</div><p class="vj-empty-text">${msg}</p><button class="vj-empty-cta" data-action="generate">${ctaLabel}</button></div>`;
}

// ─── Regenerate ──────────────────────────────────────────
function openRegenerateSheet(){
  openSheet("regenerate");
}

function doRegenerate(){
  closeSheet();
  state = "processing";
  showSkeleton(summaryContent);
  showSkeleton(topicsContent);
  updateCopyShareState();
  let variant = MOCK_SUMMARY;
  if(regenStyle === "short") variant = MOCK_SUMMARY_SHORT;
  else if(regenStyle === "gentle") variant = MOCK_SUMMARY_GENTLE;
  setTimeout(()=> finishProcessing(variant), 1500);
}

// ─── Follow-up ───────────────────────────────────────────
function doFollowup(){
  state = "processing";
  showSkeleton(summaryContent);
  updateCopyShareState();
  setTimeout(()=>{
    state = "done";
    activeSummary = MOCK_FOLLOWUP_RESULT;
    currentVersion++;
    versions.push({
      id: currentVersion,
      timestamp: new Date().toLocaleTimeString(),
      summary: MOCK_FOLLOWUP_RESULT.body,
      todos: [...MOCK_FOLLOWUP_RESULT.todos],
      topics: [...MOCK_FOLLOWUP_RESULT.topics]
    });
    renderSummary(MOCK_FOLLOWUP_RESULT);
    renderTopics(MOCK_FOLLOWUP_RESULT.topics);
    updateCopyShareState();
    showToast("Summary updated (v" + currentVersion + ")");
  }, 1000);
}

// ─── Versioning ──────────────────────────────────────────
function openVersionsSheet(){
  openSheet("versions");
}

function viewVersion(ver){
  closeSheet();
  versionBanner.classList.remove("hidden");
  $("#vjVersionBannerText").textContent = `Viewing v${ver.id}`;
  summaryContent.querySelector(".vj-summary-body").textContent = ver.summary;
}

function restoreVersion(ver){
  closeSheet();
  activeSummary = { body: ver.summary, todos: ver.todos, topics: ver.topics };
  currentVersion = ver.id;
  renderSummary(activeSummary);
  renderTopics(ver.topics);
  showToast("Restored v" + ver.id);
}

function backToLatest(){
  versionBanner.classList.add("hidden");
  const latest = versions[versions.length - 1];
  activeSummary = { body: latest.summary, todos: latest.todos, topics: latest.topics };
  currentVersion = latest.id;
  renderSummary(activeSummary);
  renderTopics(latest.topics);
}

// ─── Upload Flow ─────────────────────────────────────────
function startUploadFlow(){
  openSheet("source-picker");
}

function showUploadPrecheck(){
  closeSheet();
  state = "uploadPrecheck";
  showView("upload");
  const body = $("#vjUploadBody");
  body.innerHTML = `
    <div class="vj-upload-card">
      <h3 class="vj-upload-card-title">Ready to process</h3>
      <div class="vj-upload-info">
        <div class="vj-upload-info-row"><span>File</span><span>${MOCK_UPLOAD_FILE.name}</span></div>
        <div class="vj-upload-info-row"><span>Duration</span><span>${MOCK_UPLOAD_FILE.duration}</span></div>
        <div class="vj-upload-info-row"><span>Size</span><span>${MOCK_UPLOAD_FILE.size}</span></div>
      </div>
      <p class="vj-upload-hint"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 1l22 22M16.72 11.06A10.94 10.94 0 0119 12.55"/><path d="M5 12.55a10.94 10.94 0 015.17-2.39"/><path d="M10.71 5.05A16 16 0 0122.56 9"/><path d="M1.42 9a15.91 15.91 0 014.7-2.88"/><path d="M8.53 16.11a6 6 0 016.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg> Wi-Fi recommended for large files</p>
      <button class="vj-sheet-cta" id="vjStartProcessing">Start Processing</button>
      <button class="vj-upload-cancel" id="vjUploadCancelPrecheck">Cancel</button>
    </div>`;
}

function startUploading(){
  state = "uploading";
  const body = $("#vjUploadBody");
  body.innerHTML = `
    <div class="vj-upload-card">
      <h3 class="vj-upload-card-title">Uploading...</h3>
      <div class="vj-progress-bar"><div class="vj-progress-fill" id="vjProgressFill" style="width:0%"></div></div>
      <p class="vj-upload-pct" id="vjUploadPct">0%</p>
      <div class="vj-upload-info-row"><span>0 MB / ${MOCK_UPLOAD_FILE.size}</span></div>
      <div class="vj-network-banner hidden" id="vjNetworkBanner"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> Network may be unstable</div>
      <button class="vj-upload-cancel" id="vjUploadCancelUploading">Cancel upload</button>
    </div>`;
  animateUpload();
}

function animateUpload(){
  let pct = 0;
  const fill = $("#vjProgressFill");
  const label = $("#vjUploadPct");
  const banner = $("#vjNetworkBanner");
  const iv = setInterval(()=>{
    if(state !== "uploading"){ clearInterval(iv); return; }
    pct += 2 + Math.random()*3;
    if(pct > 100) pct = 100;
    fill.style.width = pct + "%";
    label.textContent = Math.round(pct) + "%";
    if(pct >= 60 && banner) banner.classList.remove("hidden");
    if(pct >= 100){
      clearInterval(iv);
      setTimeout(()=>{
        showView("recording");
        state = "processing";
        transcriptList.innerHTML = "";
        MOCK_SEGMENTS.forEach(s => addSegmentInstant(s));
        enableAllTabs();
        switchTab("summary");
        showSkeleton(summaryContent);
        showSkeleton(topicsContent);
        updateCopyShareState();
        setTimeout(()=> finishProcessing(MOCK_SUMMARY), 2000);
      }, 500);
    }
  }, 100);
}

// ─── Bottom Sheet (Reusable) ─────────────────────────────
function openSheet(type){
  sheetType = type;
  sheetOverlay.classList.remove("hidden");
  let headerText = "";
  let bodyHtml = "";

  switch(type){
    case "regenerate":
      headerText = "Customize Generation";
      bodyHtml = `
        <div class="vj-sheet-section-title">Scope</div>
        <div class="vj-sheet-radio ${regenScope==='all'?'selected':''}" data-scope="all"><div class="vj-sheet-radio-dot"></div>Entire entry</div>
        <div class="vj-sheet-radio ${regenScope==='new'?'selected':''}" data-scope="new"><div class="vj-sheet-radio-dot"></div>New part only</div>
        <div class="vj-sheet-section-title">Style</div>
        <div class="vj-sheet-radio ${regenStyle==='standard'?'selected':''}" data-style="standard"><div class="vj-sheet-radio-dot"></div>Standard</div>
        <div class="vj-sheet-radio ${regenStyle==='short'?'selected':''}" data-style="short"><div class="vj-sheet-radio-dot"></div>Short</div>
        <div class="vj-sheet-radio ${regenStyle==='gentle'?'selected':''}" data-style="gentle"><div class="vj-sheet-radio-dot"></div>Gentle</div>
        <button class="vj-sheet-cta" id="vjSheetRegenCta">Generate</button>`;
      break;

    case "source-picker":
      headerText = "Upload Audio";
      bodyHtml = `
        <div class="vj-sheet-option" data-source="files"><div class="vj-sheet-option-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/><polyline points="13 2 13 9 20 9"/></svg></div><div class="vj-sheet-option-text"><div class="vj-sheet-option-title">Files</div><div class="vj-sheet-option-desc">Browse audio files on your device</div></div></div>
        <div class="vj-sheet-option" data-source="recent"><div class="vj-sheet-option-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div><div class="vj-sheet-option-text"><div class="vj-sheet-option-title">Recent recordings</div><div class="vj-sheet-option-desc">Choose from recent voice memos</div></div></div>`;
      break;

    case "versions":
      headerText = "Versions";
      bodyHtml = versions.map(v => `
        <div class="vj-sheet-option" data-ver-id="${v.id}">
          <div class="vj-sheet-option-text">
            <div class="vj-sheet-option-title">v${v.id} ${v.id === currentVersion ? '(Latest)' : ''}</div>
            <div class="vj-sheet-option-desc">${v.timestamp} — ${v.summary.slice(0,60)}...</div>
          </div>
          <div style="margin-left:auto;display:flex;gap:6px">
            <button class="vj-followup-chip" data-ver-action="view" data-ver-id="${v.id}">View</button>
            ${v.id !== currentVersion ? `<button class="vj-followup-chip" data-ver-action="restore" data-ver-id="${v.id}">Restore</button>` : ''}
          </div>
        </div>`).join("");
      break;

    case "reminder":
      headerText = "Set Reminder";
      bodyHtml = `
        <div class="vj-sheet-option" data-reminder="reminders"><div class="vj-sheet-option-icon">&#x1F514;</div><div class="vj-sheet-option-text"><div class="vj-sheet-option-title">Add to Reminders</div><div class="vj-sheet-option-desc">Get notified at a scheduled time</div></div></div>
        <div class="vj-sheet-option" data-reminder="calendar"><div class="vj-sheet-option-icon">&#x1F4C5;</div><div class="vj-sheet-option-text"><div class="vj-sheet-option-title">Add to Calendar</div><div class="vj-sheet-option-desc">Create a calendar event</div></div></div>`;
      break;

    case "add-tasks":
      headerText = "Add to Tasks";
      bodyHtml = `
        <div class="vj-sheet-toggle"><span>Create tasks from To-dos</span><div class="vj-sheet-toggle-switch on" data-toggle="create-todos"></div></div>
        <div class="vj-sheet-toggle"><span>Include summary as description</span><div class="vj-sheet-toggle-switch on" data-toggle="include-summary"></div></div>
        <button class="vj-sheet-cta" id="vjSheetAddTasksCta">Add to Tasks</button>`;
      break;

    case "generate-file":
      headerText = "Generate File";
      bodyHtml = `
        <div class="vj-sheet-section-title">Format</div>
        <div class="vj-sheet-format-grid">
          <div class="vj-sheet-format-card selected" data-format="ppt"><div class="vj-sheet-format-icon">&#x1F4CA;</div><div class="vj-sheet-format-label">PPT</div></div>
          <div class="vj-sheet-format-card" data-format="html"><div class="vj-sheet-format-icon">&#x1F310;</div><div class="vj-sheet-format-label">HTML</div></div>
          <div class="vj-sheet-format-card" data-format="doc"><div class="vj-sheet-format-icon">&#x1F4C4;</div><div class="vj-sheet-format-label">DOC</div></div>
          <div class="vj-sheet-format-card" data-format="email"><div class="vj-sheet-format-icon">&#x2709;&#xFE0F;</div><div class="vj-sheet-format-label">Email</div></div>
        </div>
        <div class="vj-sheet-section-title">Scope</div>
        <div class="vj-sheet-radio selected" data-file-scope="full"><div class="vj-sheet-radio-dot"></div>Full summary</div>
        <div class="vj-sheet-radio" data-file-scope="todos"><div class="vj-sheet-radio-dot"></div>To-dos only</div>
        <button class="vj-sheet-cta" id="vjSheetGenFileCta">Generate</button>`;
      break;
  }

  sheetHeader.textContent = headerText;
  sheetBody.innerHTML = bodyHtml;
}

function closeSheet(){
  sheetOverlay.classList.add("hidden");
  sheetType = null;
}

// ─── Sheet Event Delegation ──────────────────────────────
sheetOverlay.addEventListener("click", e => {
  if(e.target === sheetOverlay){ closeSheet(); return; }

  // Scope radios
  const scopeRadio = e.target.closest("[data-scope]");
  if(scopeRadio){
    regenScope = scopeRadio.dataset.scope;
    sheetBody.querySelectorAll("[data-scope]").forEach(r => r.classList.toggle("selected", r.dataset.scope === regenScope));
    return;
  }

  // Style radios
  const styleRadio = e.target.closest("[data-style]");
  if(styleRadio){
    regenStyle = styleRadio.dataset.style;
    sheetBody.querySelectorAll("[data-style]").forEach(r => r.classList.toggle("selected", r.dataset.style === regenStyle));
    return;
  }

  // Regenerate CTA
  if(e.target.id === "vjSheetRegenCta"){ doRegenerate(); return; }

  // Source picker
  const source = e.target.closest("[data-source]");
  if(source){ showUploadPrecheck(); return; }

  // Version actions
  const verAction = e.target.closest("[data-ver-action]");
  if(verAction){
    const ver = versions.find(v => v.id === Number(verAction.dataset.verId));
    if(ver){
      if(verAction.dataset.verAction === "view") viewVersion(ver);
      else restoreVersion(ver);
    }
    return;
  }

  // Reminder
  const reminder = e.target.closest("[data-reminder]");
  if(reminder){
    closeSheet();
    showToast(reminder.dataset.reminder === "calendar" ? "Added to Calendar" : "Reminder set");
    return;
  }

  // Toggle switch
  const toggle = e.target.closest(".vj-sheet-toggle-switch");
  if(toggle){ toggle.classList.toggle("on"); return; }

  // Add to Tasks CTA
  if(e.target.id === "vjSheetAddTasksCta"){
    closeSheet();
    showToast("Tasks created");
    setTimeout(()=>{
      const link = document.createElement("a");
      link.href = "vj-tasks.html";
      link.textContent = "View tasks →";
      link.style.cssText = "color:var(--accent);font-weight:600;font-size:.85rem;text-decoration:none;display:block;margin-top:8px;text-align:center";
      toast.appendChild(document.createElement("br"));
      toast.appendChild(link);
    }, 100);
    return;
  }

  // Format cards
  const formatCard = e.target.closest("[data-format]");
  if(formatCard){
    sheetBody.querySelectorAll("[data-format]").forEach(c => c.classList.toggle("selected", c === formatCard));
    return;
  }

  // File scope radios
  const fileScope = e.target.closest("[data-file-scope]");
  if(fileScope){
    sheetBody.querySelectorAll("[data-file-scope]").forEach(r => r.classList.toggle("selected", r === fileScope));
    return;
  }

  // Generate file CTA
  if(e.target.id === "vjSheetGenFileCta"){
    closeSheet();
    showToast("Generating file...");
    setTimeout(()=> showFilePreview(), 2000);
    return;
  }
});

// ─── File Preview ────────────────────────────────────────
function showFilePreview(){
  const selectedFormat = "PPT";
  $("#vjPreviewTitle").textContent = `${selectedFormat} Preview`;
  $("#vjPreviewBody").innerHTML = `<div class="vj-preview-thumb">Preview of generated ${selectedFormat} file<br><small>Based on your Voice Journal summary</small></div>`;
  previewOverlay.classList.remove("hidden");
}
$("#vjPreviewClose").addEventListener("click", ()=> previewOverlay.classList.add("hidden"));
$("#vjPreviewShare").addEventListener("click", ()=>{ previewOverlay.classList.add("hidden"); showToast("Shared!"); });
$("#vjPreviewOpen").addEventListener("click", ()=>{ previewOverlay.classList.add("hidden"); showToast("Opened in app"); });

// ─── Main Content Event Delegation ───────────────────────
document.querySelector(".vj-main").addEventListener("click", e => {
  // Start button
  if(e.target.closest("#vjStartBtn")){
    transcriptList.innerHTML = "";
    segmentCount = 1;
    timerSec = 0;
    timerEl.textContent = "00:00";
    versions = [];
    currentVersion = 0;
    startRecording();
    return;
  }

  // Upload button (idle)
  if(e.target.closest("#vjUploadBtn")){
    startUploadFlow();
    return;
  }


  // Back buttons
  if(e.target.closest("#vjBackBtn")){
    if(state === "recording" || state === "paused"){
      openEndDialog();
    } else {
      enterIdleView();
    }
    return;
  }
  if(e.target.closest("#vjUploadBackBtn")){
    if(state === "uploading"){ state = "idle"; }
    enterIdleView();
    return;
  }

  // Tab clicks
  const tab = e.target.closest(".vj-tab");
  if(tab && !tab.disabled){
    switchTab(tab.dataset.tab);
    return;
  }

  // Pause
  if(e.target.closest("#vjPauseBtn")){ togglePause(); return; }

  // Stop
  if(e.target.closest("#vjStopBtn")){ openEndDialog(); return; }

  // End dialog buttons
  if(e.target.closest("#vjEndSummarize")){ endAndSummarize(); return; }
  if(e.target.closest("#vjEndOnly")){ endOnly(); return; }
  if(e.target.closest("#vjEndCancel")){ cancelEnd(); return; }

  // Continue
  if(e.target.closest("#vjContinueBtn")){ continueRecording(); return; }

  // Generate from empty state
  if(e.target.closest("[data-action='generate']")){
    state = "processing";
    continueBar.classList.add("hidden");
    showSkeleton(summaryContent);
    showSkeleton(topicsContent);
    updateCopyShareState();
    setTimeout(()=> finishProcessing(MOCK_SUMMARY), 2000);
    return;
  }

  // Regenerate button
  if(e.target.closest("#vjRegenBtn")){ openRegenerateSheet(); return; }

  // Add to Tasks button
  if(e.target.closest("#vjAddTasksBtn")){ openSheet("add-tasks"); return; }

  // Version row
  if(e.target.closest("#vjVersionRow")){ openVersionsSheet(); return; }

  // Follow-up chip
  const chip = e.target.closest(".vj-followup-chip[data-prompt]");
  if(chip){
    const input = $("#vjFollowupInput");
    if(input) input.value = chip.dataset.prompt;
    return;
  }

  // Follow-up CTA
  if(e.target.closest("#vjFollowupCta")){ doFollowup(); return; }

  // Todo action (...)
  const todoBtn = e.target.closest(".vj-todo-action-btn");
  if(todoBtn){ openSheet("reminder"); return; }

  // Generate file (header icon)
  if(e.target.closest("#vjGenFile") && !e.target.closest("#vjGenFile").disabled){ openSheet("generate-file"); return; }

  // Copy (header icon)
  if(e.target.closest("#vjCopy") && !e.target.closest("#vjCopy").disabled){ showToast("Copied to clipboard"); return; }

  // Download (header icon)
  if(e.target.closest("#vjDownload") && !e.target.closest("#vjDownload").disabled){ showToast("Download started"); return; }

  // Upload precheck buttons
  if(e.target.closest("#vjStartProcessing")){ startUploading(); return; }
  if(e.target.closest("#vjUploadCancelPrecheck")){ enterIdleView(); return; }
  if(e.target.closest("#vjUploadCancelUploading")){
    state = "idle";
    enterIdleView();
    showToast("Upload cancelled");
    return;
  }
});

// Version banner back button
$("#vjVersionBack").addEventListener("click", backToLatest);

// ─── Task Center Cards ───────────────────────────────────
(function renderVjTaskCenter(){
  const grid = document.getElementById("vjFeaturedGrid");
  if(!grid || !window.TASK_CATALOG) return;
  const catalog = window.TASK_CATALOG;
  const DEFAULT_COVER = "https://images.unsplash.com/photo-1518770660439-4636190af475?w=640&h=360&fit=crop";
  function safeCover(u){ return u && u.startsWith("https://") ? u : DEFAULT_COVER; }
  var vt = window.I18n ? window.I18n.t : function(k){return k;};
  function typeLabel(type){ return vt("type."+type) || type; }
  function vjTaskTitle(task){ var key="task."+task.id; var loc=vt(key); return (loc && loc!==key)?loc:task.title; }
  const featured = catalog.filter(t => t.featured).slice(0,3);
  const tasks = featured.length ? featured : catalog.slice(0,3);

  tasks.forEach(task => {
    const el = document.createElement("article");
    el.className = "task-card";
    el.setAttribute("role","button");
    el.tabIndex = 0;
    el.innerHTML = `<div class="task-card-cover" style="background-image:url('${safeCover(task.cover)}')"></div><div class="task-card-body"><div class="task-card-title"></div><span class="type-pill ${task.type==='multi-step'?'multi-step':task.type}"></span></div>`;
    el.querySelector(".task-card-title").textContent = vjTaskTitle(task);
    el.querySelector(".type-pill").textContent = typeLabel(task.type);
    el.addEventListener("click", ()=>{ window.location.href = "task-execution.html?task=" + task.id; });
    grid.appendChild(el);
  });

  const viewMore = document.createElement("article");
  viewMore.className = "task-card task-card--view-more";
  viewMore.setAttribute("role","button");
  viewMore.tabIndex = 0;
  viewMore.innerHTML = '<div class="view-more-inner"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg><span>' + vt("taskCenter.viewMore") + '</span></div>';
  viewMore.addEventListener("click", ()=>{ window.location.href = "index.html#gallery"; });
  grid.appendChild(viewMore);
})();

// ─── Init ────────────────────────────────────────────────
enterIdleView();
