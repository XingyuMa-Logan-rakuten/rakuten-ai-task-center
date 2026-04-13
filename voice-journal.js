(function () {
  /* ── Mock transcript data ── */
  var MOCK_SEGMENTS = [
    { speaker: "Speaker 1", text: "Hi.", delay: 800 },
    { speaker: "Speaker 1", text: "Today's.", delay: 2200 },
    { speaker: "Speaker 1", text: "2026, April the 13th.", delay: 3500 },
    { speaker: "Speaker 1", text: "So I'm logging here and I would like to.", delay: 5000 },
    { speaker: "Speaker 1", text: "Talk about today. What's going on here?", delay: 7500 },
    { speaker: "Speaker 1", text: "So during these days we have been working on the Super Agent project, which is really exciting.", delay: 10000 },
    { speaker: "Speaker 1", text: "We've been integrating Broccoli and AI technologies together to create something truly innovative.", delay: 14000 },
    { speaker: "Speaker 1", text: "The Aiden Center is now live. It's a central hub where the team can review all the project details.", delay: 18000 },
    { speaker: "Speaker 1", text: "I've been personally building and experimenting with the project, and I have to say I'm quite optimistic about the direction.", delay: 23000 },
    { speaker: "Speaker 1", text: "No major blockers right now. The tone is positive and we're looking forward to what's next.", delay: 28000 },
    { speaker: "Speaker 2", text: "That sounds great. I think the team should review the Aiden Center soon to stay aligned.", delay: 33000 },
    { speaker: "Speaker 1", text: "Absolutely. Let's make sure everyone checks the latest updates there. I'll send a reminder.", delay: 37000 },
  ];

  var MOCK_SUMMARY = {
    title: "Super Agent Project Progress and Aiden Center Update",
    body: '<strong>The meeting focused on the presenter\'s ongoing efforts with the Super Agent project, which integrates Broccoli and AI technologies.</strong> The presenter expressed enthusiasm about building and experimenting with the project personally, highlighting the recent development of the Aiden Center\u2014a hub where all project details can be reviewed by the team. No major decisions or challenges were discussed, but the tone was optimistic and forward-looking.',
    todos: [
      "Review the Aiden Center for detailed project updates",
      "Continue development and personal experimentation with the Super Agent",
      "Share further progress or findings with the team in future meetings",
      "Send team reminder to check Aiden Center updates",
    ],
    topics: [
      { label: "Super Agent Project", category: "Project" },
      { label: "AI Technologies", category: "Technology" },
      { label: "Broccoli Integration", category: "Technology" },
      { label: "Aiden Center", category: "Product" },
      { label: "Team Alignment", category: "Process" },
      { label: "Project Experimentation", category: "Process" },
    ],
  };

  /* ── State ── */
  var state = "idle";
  var timerInterval = null;
  var elapsedSec = 0;
  var segmentTimeouts = [];
  var waveInterval = null;
  var renderedSegments = 0;

  /* ── DOM refs ── */
  var idleView       = document.getElementById("vjIdleView");
  var recordingView  = document.getElementById("vjRecordingView");
  var transcriptView = document.getElementById("vjTranscriptView");
  var summaryView    = document.getElementById("vjSummaryView");
  var topicsView     = document.getElementById("vjTopicsView");
  var transcriptList = document.getElementById("vjTranscriptList");
  var summaryContent = document.getElementById("vjSummaryContent");
  var topicsContent  = document.getElementById("vjTopicsContent");
  var recorder       = document.getElementById("vjRecorder");
  var timerEl        = document.getElementById("vjTimer");
  var waveformEl     = document.getElementById("vjWaveform");
  var titleEl        = document.getElementById("vjTitle");
  var tabs           = document.querySelectorAll(".vj-tab");

  function formatTime(sec) {
    var m = String(Math.floor(sec / 60)).padStart(2, "0");
    var s = String(sec % 60).padStart(2, "0");
    return m + ":" + s;
  }

  function clearSegmentTimeouts() {
    segmentTimeouts.forEach(function (id) { clearTimeout(id); });
    segmentTimeouts = [];
  }

  /* ── Switch between idle and recording views ── */
  function enterRecordingView() {
    idleView.classList.add("hidden");
    recordingView.classList.remove("hidden");
  }

  function enterIdleView() {
    recordingView.classList.add("hidden");
    recorder.classList.add("hidden");
    idleView.classList.remove("hidden");
  }

  /* ── Tab switching within recording view ── */
  function showTab(name) {
    transcriptView.classList.toggle("hidden", name !== "transcript");
    summaryView.classList.toggle("hidden", name !== "summary");
    topicsView.classList.toggle("hidden", name !== "topics");
    tabs.forEach(function (t) {
      t.classList.toggle("active", t.dataset.tab === name);
    });
  }

  /* ── Waveform ── */
  function initWaveform() {
    waveformEl.innerHTML = "";
    for (var i = 0; i < 120; i++) {
      var bar = document.createElement("div");
      bar.className = "vj-wave-bar";
      waveformEl.appendChild(bar);
    }
  }

  function animateWaveform() {
    if (waveInterval) clearInterval(waveInterval);
    var bars = waveformEl.querySelectorAll(".vj-wave-bar");
    waveInterval = setInterval(function () {
      bars.forEach(function (b) {
        b.style.height = (3 + Math.random() * 26) + "px";
      });
    }, 120);
  }

  function freezeWaveform() {
    if (waveInterval) { clearInterval(waveInterval); waveInterval = null; }
    waveformEl.querySelectorAll(".vj-wave-bar").forEach(function (b) {
      b.style.height = "4px";
    });
  }

  /* ── Timer ── */
  function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(function () {
      elapsedSec++;
      timerEl.textContent = formatTime(elapsedSec);
    }, 1000);
  }

  function stopTimer() {
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
  }

  /* ── Add transcript segment with typewriter ── */
  function addSegment(seg, timestampSec) {
    var div = document.createElement("div");
    div.className = "vj-segment";

    var meta = document.createElement("div");
    meta.className = "vj-segment-meta";

    var spk = document.createElement("span");
    spk.className = "vj-speaker";
    spk.textContent = seg.speaker;
    meta.appendChild(spk);

    var ts = document.createElement("span");
    ts.className = "vj-timestamp";
    ts.textContent = formatTime(timestampSec);
    meta.appendChild(ts);

    div.appendChild(meta);

    var textEl = document.createElement("p");
    textEl.className = "vj-segment-text vj-typing";
    div.appendChild(textEl);

    transcriptList.appendChild(div);

    var chars = seg.text.split("");
    var idx = 0;
    var typeInterval = setInterval(function () {
      if (idx < chars.length) {
        textEl.textContent += chars[idx];
        idx++;
      } else {
        clearInterval(typeInterval);
        textEl.classList.remove("vj-typing");
      }
      var content = document.getElementById("vjContent");
      content.scrollTop = content.scrollHeight;
    }, 30);
  }

  /* ── Schedule segments ── */
  function scheduleSegments() {
    clearSegmentTimeouts();
    renderedSegments = 0;
    MOCK_SEGMENTS.forEach(function (seg, i) {
      var id = setTimeout(function () {
        if (state !== "recording") return;
        addSegment(seg, Math.floor(seg.delay / 1000));
        renderedSegments = i + 1;
      }, seg.delay);
      segmentTimeouts.push(id);
    });
  }

  /* ── Start recording ── */
  function startRecording() {
    state = "recording";
    elapsedSec = 0;
    transcriptList.innerHTML = "";
    timerEl.textContent = "00:00";

    enterRecordingView();
    recorder.classList.remove("hidden");
    showTab("transcript");

    tabs.forEach(function (t) {
      if (t.dataset.tab !== "transcript") t.disabled = true;
    });

    initWaveform();
    animateWaveform();
    startTimer();
    scheduleSegments();
  }

  /* ── Stop recording ── */
  function stopRecording() {
    state = "done";
    stopTimer();
    freezeWaveform();
    clearSegmentTimeouts();
    recorder.classList.add("hidden");

    document.getElementById("vjDownload").disabled = false;
    document.getElementById("vjCopy").disabled = false;
    tabs.forEach(function (t) { t.disabled = false; });

    titleEl.textContent = MOCK_SUMMARY.title;

    document.querySelectorAll(".vj-typing").forEach(function (el) {
      el.classList.remove("vj-typing");
    });

    generateSummary();
  }

  function generateSummary() {
    summaryContent.innerHTML = '<div class="vj-generating"><div class="vj-spinner"></div><span>Generating summary and to-dos...</span></div>';
    topicsContent.innerHTML = '<div class="vj-generating"><div class="vj-spinner"></div><span>Extracting topics...</span></div>';

    setTimeout(function () {
      summaryContent.innerHTML = "";
      var bodyP = document.createElement("div");
      bodyP.className = "vj-summary-body";
      bodyP.innerHTML = MOCK_SUMMARY.body;
      summaryContent.appendChild(bodyP);

      var todoH = document.createElement("p");
      todoH.className = "vj-todos-heading";
      todoH.textContent = "Suggested to do:";
      summaryContent.appendChild(todoH);

      var ul = document.createElement("ul");
      ul.className = "vj-todo-list";
      MOCK_SUMMARY.todos.forEach(function (todo) {
        var li = document.createElement("li");
        li.textContent = todo;
        ul.appendChild(li);
      });
      summaryContent.appendChild(ul);

      topicsContent.innerHTML = "";
      var catMap = {};
      MOCK_SUMMARY.topics.forEach(function (t) {
        if (!catMap[t.category]) catMap[t.category] = [];
        catMap[t.category].push(t.label);
      });
      Object.keys(catMap).forEach(function (cat) {
        var h = document.createElement("p");
        h.className = "vj-topics-section-title";
        h.textContent = cat;
        topicsContent.appendChild(h);
        catMap[cat].forEach(function (label) {
          var chip = document.createElement("span");
          chip.className = "vj-topic-chip";
          chip.textContent = label;
          topicsContent.appendChild(chip);
        });
      });
    }, 2000);
  }

  /* ── Pause / Resume ── */
  function togglePause() {
    if (state === "recording") {
      state = "paused";
      stopTimer();
      freezeWaveform();
      clearSegmentTimeouts();
      document.getElementById("vjPauseBtn").innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
      document.getElementById("vjPauseBtn").title = "Resume";
    } else if (state === "paused") {
      state = "recording";
      animateWaveform();
      startTimer();
      MOCK_SEGMENTS.forEach(function (seg, i) {
        if (i < renderedSegments) return;
        var remaining = seg.delay - elapsedSec * 1000;
        if (remaining < 500) remaining = 500 + i * 800;
        var id = setTimeout(function () {
          if (state !== "recording") return;
          addSegment(seg, Math.floor(elapsedSec));
          renderedSegments = i + 1;
        }, remaining);
        segmentTimeouts.push(id);
      });
      document.getElementById("vjPauseBtn").innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>';
      document.getElementById("vjPauseBtn").title = "Pause";
    }
  }

  /* ── Events ── */
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      if (tab.disabled) return;
      showTab(tab.dataset.tab);
    });
  });

  document.getElementById("vjStartBtn").addEventListener("click", startRecording);
  document.getElementById("vjStartClose").addEventListener("click", function () {
    window.location.href = "index.html";
  });
  document.getElementById("vjStopBtn").addEventListener("click", stopRecording);
  document.getElementById("vjPauseBtn").addEventListener("click", togglePause);
  document.getElementById("vjBackBtn").addEventListener("click", function () {
    if (state === "idle") {
      window.location.href = "index.html";
    } else {
      enterIdleView();
      state = "idle";
      stopTimer();
      freezeWaveform();
      clearSegmentTimeouts();
    }
  });

  document.getElementById("vjCopy").addEventListener("click", function () {
    var text = transcriptList.innerText || "";
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(function () { alert("Transcript copied!"); });
    }
  });
})();
