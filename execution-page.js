(function () {
  const PARAM = "task";
  const DEFAULT_COVER = "https://images.unsplash.com/photo-1518770660439-4636190af475?w=640&h=360&fit=crop";
  function safeCover(url) { return url && url.startsWith("https://") ? url : DEFAULT_COVER; }
  var t = window.I18n ? window.I18n.t : function (k) { return k; };

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
    feed.scrollTo({ top: feed.scrollHeight, behavior: "smooth" });
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

  function addAgentBubbleStreaming(text, gen) {
    var alive = function () { return gen === replayGen; };
    var wrap = document.createElement("div");
    wrap.className = "exec-msg-agent";
    var body = document.createElement("div");
    body.className = "exec-bubble exec-bubble--agent";
    var lbl = document.createElement("div");
    lbl.className = "exec-bubble-label";
    lbl.textContent = "Rakuten AI";
    var inner = document.createElement("div");
    inner.className = "exec-bubble-body";
    var cursor = document.createElement("span");
    cursor.className = "exec-stream-cursor";
    inner.appendChild(cursor);
    body.appendChild(lbl);
    body.appendChild(inner);
    wrap.appendChild(body);
    document.getElementById("execFeedInner").appendChild(wrap);
    scrollFeed();

    return new Promise(function (resolve) {
      var chars = Array.from(text);
      var total = chars.length;
      var idx = 0;
      var textNode = document.createTextNode("");
      inner.insertBefore(textNode, cursor);

      var baseSpeed = 12;
      var batchMin = 1;
      var batchMax = 3;
      var scrollCounter = 0;

      function tick() {
        if (!alive()) { cursor.remove(); resolve(wrap); return; }
        if (idx >= total) {
          cursor.remove();
          scrollFeed();
          resolve(wrap);
          return;
        }

        var batch = batchMin + Math.floor(Math.random() * (batchMax - batchMin + 1));
        var chunk = "";
        for (var b = 0; b < batch && idx < total; b++, idx++) {
          chunk += chars[idx];
        }
        textNode.textContent += chunk;

        var delay = baseSpeed;
        var lastChar = chunk[chunk.length - 1];
        if (lastChar === "\n") delay = 60;
        else if (lastChar === "." || lastChar === "!" || lastChar === "?") delay = 80;
        else if (lastChar === "," || lastChar === ";" || lastChar === ":") delay = 40;
        else if (lastChar === "\u2022" || lastChar === "|") delay = 20;

        scrollCounter++;
        if (scrollCounter % 5 === 0 || lastChar === "\n") {
          scrollFeed();
        }

        var tid = setTimeout(tick, delay);
        timeoutIds.push(tid);
      }

      tick();
    });
  }

  /* ── Determine if task needs auth check ── */
  function needsAuthCheck(task, script) {
    if (task.connectors && task.connectors.length > 0) return true;
    var cat = task.category;
    if (cat === "rakuten") return true;
    return false;
  }

  function getAuthServices(task) {
    if (task.category === "rakuten") {
      return ["Rakuten Account"];
    }
    var services = [];
    if (task.connectors && task.connectors.length > 0) {
      task.connectors.forEach(function (c) { services.push(c); });
    }
    return services;
  }

  /* ── Mock auth page ── */
  function openAuthPage(serviceName) {
    var isRakuten = serviceName === "Rakuten Account";
    var logoHtml = isRakuten
      ? '<div class="exec-auth-logo" style="color:#bf0000;font-weight:700;font-size:28px;letter-spacing:-0.5px;">Rakuten</div>'
      : '<div class="exec-auth-logo"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#0066ff" stroke-width="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/><circle cx="12" cy="16" r="1"/></svg></div>';
    var titleText = isRakuten ? t("exec.authPageTitleRakuten") : t("exec.authPageTitle", [serviceName]);
    var descText = isRakuten ? t("exec.authPageDescRakuten") : t("exec.authPageDescGeneric", [serviceName]);
    var btnText = isRakuten ? t("exec.authPageSubmitRakuten") : t("exec.authPageSubmitGeneric");
    var submitColor = isRakuten ? "background:#bf0000;" : "";
    return new Promise(function (resolve) {
      var overlay = document.createElement("div");
      overlay.className = "exec-auth-overlay";
      overlay.innerHTML =
        '<div class="exec-auth-page">' +
          logoHtml +
          '<h2 class="exec-auth-title">' + titleText + '</h2>' +
          '<p class="exec-auth-desc">' + descText + '</p>' +
          '<div class="exec-auth-form">' +
            '<input type="text" class="exec-auth-input" placeholder="Rakuten ID or Email" value="user@rakuten.com" />' +
            '<input type="password" class="exec-auth-input" placeholder="Password" value="••••••••" />' +
            '<button type="button" class="exec-auth-submit" style="' + submitColor + '">' + btnText + '</button>' +
          '</div>' +
          '<p class="exec-auth-footer">' + t("exec.authPageFooter") + '</p>' +
        '</div>';
      document.body.appendChild(overlay);

      requestAnimationFrame(function () { overlay.classList.add("open"); });

      overlay.querySelector(".exec-auth-submit").addEventListener("click", function () {
        var btn = overlay.querySelector(".exec-auth-submit");
        btn.textContent = t("exec.authPageAuthorizing");
        btn.disabled = true;
        setTimeout(function () {
          overlay.classList.remove("open");
          setTimeout(function () {
            overlay.remove();
            resolve();
          }, 300);
        }, 1200);
      });
    });
  }

  /* ── Build the new step-by-step execution card ── */
  function buildExecutionCard(task, script) {
    var card = document.createElement("div");
    card.className = "exec-card";
    card.innerHTML =
      '<div class="exec-card-head" role="button" tabindex="0" aria-expanded="true">' +
        '<div class="exec-card-thumb" style="background-image:url(\'' + safeCover(task.cover) + '\')"></div>' +
        '<div class="exec-card-head-text">' +
          '<p class="exec-card-title"></p>' +
          '<p class="exec-card-sub"></p>' +
          '<div class="exec-card-tool"><span aria-hidden="true">\u270F\uFE0F</span><span class="exec-card-tool-label"></span></div>' +
        '</div>' +
        '<span class="exec-card-chevron" aria-hidden="true">\u25BC</span>' +
      '</div>' +
      '<div class="exec-card-body">' +
        '<div class="exec-steps-container" id="execStepsContainer"></div>' +
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
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); }
    });

    document.getElementById("execFeedInner").appendChild(card);
    scrollFeed();

    return {
      card: card,
      stepsContainer: card.querySelector("#execStepsContainer"),
      status: card.querySelector("#execCardStatus"),
    };
  }

  /* ── Create a single step row (collapsed by default until activated) ── */
  function createStepRow(index, totalSteps, step) {
    var row = document.createElement("div");
    row.className = "exec-step-row";
    row.dataset.stepIndex = String(index);

    row.innerHTML =
      '<div class="exec-step-header" role="button" tabindex="0">' +
        '<span class="exec-step-indicator">' +
          '<span class="exec-step-num">' + (index + 1) + '</span>' +
        '</span>' +
        '<span class="exec-step-label"></span>' +
        '<span class="exec-step-status-badge"></span>' +
        '<span class="exec-step-toggle" aria-hidden="true">' +
          '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>' +
        '</span>' +
      '</div>' +
      '<div class="exec-step-detail hidden">' +
        '<div class="exec-step-detail-inner">' +
          '<p class="exec-step-narrative"></p>' +
          '<div class="exec-step-sub-list"></div>' +
          '<div class="exec-step-intermediate hidden"></div>' +
        '</div>' +
      '</div>';

    row.querySelector(".exec-step-label").textContent = step.progressLabel || step.label || "";

    var header = row.querySelector(".exec-step-header");
    header.addEventListener("click", function () {
      if (!row.classList.contains("done") && !row.classList.contains("active")) return;
      row.classList.toggle("expanded");
    });

    return row;
  }

  /* ── Create the auth-check step row ── */
  function createAuthCheckRow(services) {
    var row = document.createElement("div");
    row.className = "exec-step-row";
    row.innerHTML =
      '<div class="exec-step-header" role="button" tabindex="0">' +
        '<span class="exec-step-indicator">' +
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>' +
        '</span>' +
        '<span class="exec-step-label">' + t("exec.authVerify") + '</span>' +
        '<span class="exec-step-status-badge"></span>' +
        '<span class="exec-step-toggle" aria-hidden="true">' +
          '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>' +
        '</span>' +
      '</div>' +
      '<div class="exec-step-detail hidden">' +
        '<div class="exec-step-detail-inner">' +
          '<p class="exec-step-narrative">' + t("exec.authChecking") + '</p>' +
          '<div class="exec-auth-check-list"></div>' +
        '</div>' +
      '</div>';

    var checkList = row.querySelector(".exec-auth-check-list");
    services.forEach(function (svc) {
      var isRakutenAcct = svc === "Rakuten Account";
      var item = document.createElement("div");
      item.className = "exec-auth-check-item";
      item.dataset.service = svc;
      item.innerHTML =
        '<span class="exec-auth-check-icon">\uD83D\uDD12</span>' +
        '<span class="exec-auth-check-name"></span>' +
        '<span class="exec-auth-check-status">Checking...</span>' +
        '<button type="button" class="exec-auth-btn hidden">' + (isRakutenAcct ? t("exec.authSignIn") : t("exec.authAuthorize")) + '</button>';
      item.querySelector(".exec-auth-check-name").textContent = svc;
      checkList.appendChild(item);
    });

    var header = row.querySelector(".exec-step-header");
    header.addEventListener("click", function () {
      if (!row.classList.contains("done") && !row.classList.contains("active")) return;
      row.classList.toggle("expanded");
    });

    return row;
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
    await addAgentBubbleStreaming(script.agentOpening, myGen);

    await wait(300);
    if (!alive()) return;
    var ui = buildExecutionCard(task, script);
    ui.status.textContent = t("exec.status.running");

    var hasAuth = needsAuthCheck(task, script);
    var authServices = hasAuth ? getAuthServices(task) : [];

    /* ── Auth check step ── */
    if (hasAuth) {
      var authRow = createAuthCheckRow(authServices);
      ui.stepsContainer.appendChild(authRow);
      scrollFeed();

      await wait(300);
      if (!alive()) return;

      authRow.classList.add("active", "expanded");
      authRow.querySelector(".exec-step-detail").classList.remove("hidden");
      authRow.querySelector(".exec-step-status-badge").textContent = t("exec.authCheckingBadge");
      authRow.querySelector(".exec-step-status-badge").className = "exec-step-status-badge badge-running";
      scrollFeed();

      var checkItems = authRow.querySelectorAll(".exec-auth-check-item");
      var needsAuth = [];

      for (var a = 0; a < checkItems.length; a++) {
        if (!alive()) return;
        await wait(500);
        var item = checkItems[a];
        var svcName = item.dataset.service;
        var statusEl = item.querySelector(".exec-auth-check-status");
        var authBtn = item.querySelector(".exec-auth-btn");

        var isAuthorized = Math.random() > 0.6;
        if (isAuthorized) {
          statusEl.textContent = t("exec.authAuthorized");
          statusEl.className = "exec-auth-check-status authed";
          item.querySelector(".exec-auth-check-icon").textContent = "\uD83D\uDD13";
        } else {
          statusEl.textContent = t("exec.authNotAuthorized");
          statusEl.className = "exec-auth-check-status not-authed";
          authBtn.classList.remove("hidden");
          needsAuth.push({ item: item, service: svcName });
        }
        scrollFeed();
      }

      if (needsAuth.length > 0) {
        var prompt = document.createElement("p");
        prompt.className = "exec-auth-prompt";
        var isRakutenTask = task.category === "rakuten";
        prompt.textContent = isRakutenTask
          ? t("exec.authPromptRakuten")
          : t("exec.authPromptGeneric");
        authRow.querySelector(".exec-step-detail-inner").appendChild(prompt);
        scrollFeed();

        for (var b = 0; b < needsAuth.length; b++) {
          if (!alive()) return;
          var entry = needsAuth[b];
          await new Promise(function (resolve) {
            entry.item.querySelector(".exec-auth-btn").addEventListener("click", function () {
              var svc = entry.service;
              var itm = entry.item;
              openAuthPage(svc).then(function () {
                itm.querySelector(".exec-auth-check-status").textContent = t("exec.authAuthorized");
                itm.querySelector(".exec-auth-check-status").className = "exec-auth-check-status authed";
                itm.querySelector(".exec-auth-check-icon").textContent = "\uD83D\uDD13";
                itm.querySelector(".exec-auth-btn").classList.add("hidden");
                resolve();
              });
            });
          });
          if (!alive()) return;
        }
      }

      authRow.classList.remove("active");
      authRow.classList.add("done");
      authRow.querySelector(".exec-step-status-badge").textContent = t("exec.authAllDone");
      authRow.querySelector(".exec-step-status-badge").className = "exec-step-status-badge badge-done";
      await wait(400);
      if (!alive()) return;
      authRow.classList.remove("expanded");
      scrollFeed();
    }

    /* ── Main workflow steps ── */
    var total = script.steps.length;

    for (var i = 0; i < total; i++) {
      if (!alive()) return;
      var step = script.steps[i];
      var stepRow = createStepRow(i, total, step);
      ui.stepsContainer.appendChild(stepRow);
      scrollFeed();

      await wait(200);
      if (!alive()) return;

      stepRow.classList.add("active", "expanded");
      stepRow.querySelector(".exec-step-detail").classList.remove("hidden");
      stepRow.querySelector(".exec-step-status-badge").textContent = t("exec.stepRunning");
      stepRow.querySelector(".exec-step-status-badge").className = "exec-step-status-badge badge-running";
      stepRow.querySelector(".exec-step-narrative").textContent = step.narrative || step.progressLabel || step.label || "";
      scrollFeed();

      var subList = stepRow.querySelector(".exec-step-sub-list");
      for (var k = 0; k < step.thinkingChain.length; k++) {
        if (!alive()) return;
        var chainItem = step.thinkingChain[k];
        var subEl = document.createElement("div");
        subEl.className = "exec-step-sub-item";
        subEl.innerHTML = '<span class="exec-step-sub-dot"></span><span class="exec-step-sub-text"></span>';
        subEl.querySelector(".exec-step-sub-text").textContent = typeof chainItem === "string" ? chainItem : chainItem.label;
        subList.appendChild(subEl);
        scrollFeed();
        await wait(250);
        if (!alive()) return;
        subEl.classList.add("visible");
        await wait(180);
      }

      if (step.intermediate) {
        var intEl = stepRow.querySelector(".exec-step-intermediate");
        intEl.textContent = step.intermediate;
        intEl.classList.remove("hidden");
        scrollFeed();
      }

      await wait(350);
      if (!alive()) return;

      stepRow.classList.remove("active");
      stepRow.classList.add("done");
      stepRow.querySelector(".exec-step-status-badge").textContent = t("exec.stepDone");
      stepRow.querySelector(".exec-step-status-badge").className = "exec-step-status-badge badge-done";
      stepRow.querySelector(".exec-step-indicator").innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';

      ui.status.textContent = t("exec.status.stepComplete", [i + 1, total]);

      await wait(300);
      if (!alive()) return;
      stepRow.classList.remove("expanded");
      scrollFeed();
    }

    if (!alive()) return;
    ui.status.textContent = "All steps complete \u2014 generating reply";
    await wait(350);
    if (!alive()) return;
    await addAgentBubbleStreaming(script.finalMessage, myGen);
    if (!alive()) return;
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

    if (window.ConnectorManager) {
      document.getElementById("execConnBtn").addEventListener("click", ConnectorManager.openModal);
      ConnectorManager.registerChipContainer(document.getElementById("execConnChips"));
    }

    runReplay(task, script);
  }

  init();
})();
