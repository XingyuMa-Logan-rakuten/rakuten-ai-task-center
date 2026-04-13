(function () {
  const PARAM = "task";

  let timeoutIds = [];
  let interactiveMode = false;
  let replayGen = 0;

  function clearTimers() {
    timeoutIds.forEach((id) => clearTimeout(id));
    timeoutIds = [];
  }

  function wait(ms) {
    return new Promise((resolve) => {
      const id = setTimeout(resolve, ms);
      timeoutIds.push(id);
    });
  }

  function getParamId() {
    return new URLSearchParams(window.location.search).get(PARAM);
  }

  function taskById(id) {
    return (window.TASK_CATALOG || []).find((t) => t.id === id);
  }

  function scriptById(id) {
    return window.EXECUTION_SCRIPTS && window.EXECUTION_SCRIPTS[id];
  }

  function iconForKind(kind) {
    if (kind === "knowledge") return "\uD83D\uDCA1";
    if (kind === "tool") return "\uD83D\uDD27";
    if (kind === "connector") return "\uD83D\uDD0C";
    return "\uD83D\uDCCB";
  }

  function setInputLocked(locked) {
    var ta = document.getElementById("execTextarea");
    var send = document.getElementById("execSend");
    var effectivelyLocked = locked || !interactiveMode;
    ta.disabled = effectivelyLocked;
    send.disabled = effectivelyLocked;
    send.classList.toggle("active", interactiveMode && !effectivelyLocked);
  }

  function scrollFeed() {
    var feed = document.getElementById("execFeed");
    feed.scrollTop = feed.scrollHeight;
  }

  function addUserBubble(text) {
    var wrap = document.createElement("div");
    wrap.className = "exec-msg-user";
    wrap.innerHTML =
      '<div class="exec-bubble exec-bubble--user"><div class="exec-bubble-body"></div></div>';
    wrap.querySelector(".exec-bubble-body").textContent = text;
    document.getElementById("execFeedInner").appendChild(wrap);
    scrollFeed();
    return wrap;
  }

  function addAgentBubble(text) {
    var wrap = document.createElement("div");
    wrap.className = "exec-msg-agent";
    var body = document.createElement("div");
    body.className = "exec-bubble exec-bubble--agent";
    var lbl = document.createElement("div");
    lbl.className = "exec-bubble-label";
    lbl.textContent = "Rakuten AI";
    var inner = document.createElement("div");
    inner.className = "exec-bubble-body";
    inner.textContent = text;
    body.appendChild(lbl);
    body.appendChild(inner);
    wrap.appendChild(body);
    document.getElementById("execFeedInner").appendChild(wrap);
    scrollFeed();
    return wrap;
  }

  function buildExecutionCard(task, script) {
    var card = document.createElement("div");
    card.className = "exec-card";
    card.innerHTML =
      '<div class="exec-card-head" role="button" tabindex="0" aria-expanded="true">' +
        '<div class="exec-card-thumb" style="background-image:url(\'' + task.cover + '\')"></div>' +
        '<div class="exec-card-head-text">' +
          '<p class="exec-card-title"></p>' +
          '<p class="exec-card-sub"></p>' +
          '<div class="exec-card-tool"><span aria-hidden="true">\u270F\uFE0F</span><span class="exec-card-tool-label"></span></div>' +
        '</div>' +
        '<span class="exec-card-chevron" aria-hidden="true">\u25BC</span>' +
      '</div>' +
      '<div class="exec-card-body">' +
        '<div class="exec-thinking-panel">' +
          '<p class="exec-thinking-title">Thinking process \u00B7 chain</p>' +
          '<p class="exec-step-narrative" id="execNarrative"></p>' +
          '<div class="exec-chain-list" id="execChainList"></div>' +
          '<div class="exec-intermediate" id="execIntermediate" hidden></div>' +
        '</div>' +
        '<div class="exec-progress-block">' +
          '<div class="exec-progress-header">' +
            '<span class="exec-progress-title">Task progress</span>' +
            '<span class="exec-progress-count" id="execProgCount">0 / 0</span>' +
          '</div>' +
          '<ul class="exec-progress-list" id="execProgList"></ul>' +
        '</div>' +
        '<div class="exec-card-footer">' +
          '<span>Agent status:</span>' +
          '<strong id="execCardStatus">Initializing\u2026</strong>' +
        '</div>' +
      '</div>';

    var head = card.querySelector(".exec-card-head");
    head.querySelector(".exec-card-title").textContent = script.computerTitle;
    head.querySelector(".exec-card-sub").textContent = script.computerSubtitle;
    head.querySelector(".exec-card-tool-label").textContent = script.toolContextLabel;

    var toggle = function () {
      card.classList.toggle("collapsed");
      head.setAttribute("aria-expanded", (!card.classList.contains("collapsed")).toString());
    };
    head.addEventListener("click", toggle);
    head.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle();
      }
    });

    var progList = card.querySelector("#execProgList");
    script.steps.forEach(function (step, i) {
      var li = document.createElement("li");
      li.className = "exec-progress-row";
      li.dataset.stepIndex = String(i);
      li.innerHTML =
        '<span class="exec-check" aria-hidden="true"></span><span class="exec-progress-text"></span>';
      li.querySelector(".exec-progress-text").textContent = step.progressLabel;
      progList.appendChild(li);
    });

    card.querySelector("#execProgCount").textContent = "0 / " + script.steps.length;

    document.getElementById("execFeedInner").appendChild(card);
    scrollFeed();

    return {
      card: card,
      narrative: card.querySelector("#execNarrative"),
      chainList: card.querySelector("#execChainList"),
      intermediate: card.querySelector("#execIntermediate"),
      progCount: card.querySelector("#execProgCount"),
      progRows: progList.querySelectorAll(".exec-progress-row"),
      status: card.querySelector("#execCardStatus"),
    };
  }

  function resetFeed() {
    document.getElementById("execFeedInner").innerHTML = "";
    document.getElementById("execDock").classList.remove("visible");
    interactiveMode = false;
    document.getElementById("execTextarea").value = "";
    setInputLocked(true);
  }

  async function runReplay(task, script) {
    replayGen++;
    var myGen = replayGen;
    var alive = function () { return myGen === replayGen; };

    interactiveMode = false;
    setInputLocked(true);
    clearTimers();
    resetFeed();

    await wait(200);
    if (!alive()) return;
    addUserBubble(script.demoUserInput);
    await wait(450);
    if (!alive()) return;
    addAgentBubble(script.agentOpening);

    await wait(400);
    if (!alive()) return;
    var ui = buildExecutionCard(task, script);
    ui.status.textContent = "Running multi-step workflow\u2026";

    var total = script.steps.length;

    for (var i = 0; i < total; i++) {
      if (!alive()) return;
      var step = script.steps[i];
      ui.narrative.textContent = step.narrative || step.progressLabel;
      ui.chainList.innerHTML = "";
      ui.intermediate.hidden = true;
      ui.intermediate.textContent = "";

      for (var k = 0; k < step.thinkingChain.length; k++) {
        if (!alive()) return;
        var item = step.thinkingChain[k];
        var row = document.createElement("div");
        row.className = "exec-chain-item exec-chain-item--" + item.kind;
        row.innerHTML = '<span class="exec-chain-icon">' + iconForKind(item.kind) + '</span><span class="exec-chain-label"></span>';
        row.querySelector(".exec-chain-label").textContent = item.label;
        ui.chainList.appendChild(row);
        await wait(90);
        if (!alive()) return;
        row.classList.add("visible");
        await wait(220);
      }

      if (step.intermediate) {
        ui.intermediate.textContent = step.intermediate;
        ui.intermediate.hidden = false;
      }

      var rowEl = ui.progRows[i];
      rowEl.classList.add("done");
      rowEl.querySelector(".exec-check").textContent = "\u2713";
      ui.progCount.textContent = (i + 1) + " / " + total;
      ui.status.textContent = "Step " + (i + 1) + " of " + total + " complete";

      await wait(step.intermediate ? 500 : 380);
    }

    if (!alive()) return;
    ui.status.textContent = "All steps complete \u2014 generating reply";
    await wait(350);
    if (!alive()) return;
    addAgentBubble(script.finalMessage);
    ui.status.textContent = "Idle \u00B7 ready for follow-up";

    if (!alive()) return;
    document.getElementById("execDock").classList.add("visible");
    setInputLocked(true);
    scrollFeed();
  }

  function enterInteractive(script) {
    replayGen++;
    interactiveMode = true;
    clearTimers();
    document.getElementById("execDock").classList.remove("visible");
    document.getElementById("execTextarea").value = script.demoUserInput;
    setInputLocked(false);
    addAgentBubble(
      "Go ahead \u2014 adjust the user request and press send. In production, this would start a live run with your connectors and reuse the same step template you just watched."
    );
    scrollFeed();
    document.getElementById("execTextarea").focus();
  }

  function init() {
    var id = getParamId();
    var task = id ? taskById(id) : null;
    var script = id ? scriptById(id) : null;

    if (!task || !script) {
      window.location.href = "index.html";
      return;
    }

    document.getElementById("execPageTitle").textContent = task.title;

    document.getElementById("execBackBtn").addEventListener("click", function () {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = "index.html";
      }
    });

    document.getElementById("execWatchAgain").addEventListener("click", function () {
      interactiveMode = false;
      runReplay(task, script);
    });

    document.getElementById("execTryYourself").addEventListener("click", function () {
      enterInteractive(script);
    });

    document.getElementById("execSend").addEventListener("click", function () {
      if (!interactiveMode) return;
      var ta = document.getElementById("execTextarea");
      var val = ta.value.trim();
      if (!val) return;
      addUserBubble(val);
      ta.value = "";
      setTimeout(function () {
        addAgentBubble(
          "Message received (demo). A full deployment would resume the Task Execution System with live connector calls, honor Interrupt / Retry, and stream intermediate results."
        );
        scrollFeed();
      }, 400);
    });

    document.getElementById("execSidebarHome").addEventListener("click", function () {
      window.location.href = "index.html";
    });

    document.getElementById("execSaveTask").addEventListener("click", function () {
      window.alert("Added to My Task (demo only).");
    });

    /* Connector integration */
    if (window.ConnectorManager) {
      document.getElementById("execConnBtn").addEventListener("click", ConnectorManager.openModal);
      ConnectorManager.registerChipContainer(document.getElementById("execConnChips"));
    }

    runReplay(task, script);
  }

  init();
})();
