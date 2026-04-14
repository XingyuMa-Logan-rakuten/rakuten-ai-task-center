(function () {
  const DEFAULT_COVER = "https://images.unsplash.com/photo-1518770660439-4636190af475?w=640&h=360&fit=crop";

  function safeCover(url) {
    return url && url.startsWith("https://") ? url : DEFAULT_COVER;
  }

  (function preloadCovers() {
    if (!window.TASK_CATALOG) return;
    window.TASK_CATALOG.forEach(function (t) {
      if (!t.cover) { t.cover = DEFAULT_COVER; return; }
      var img = new Image();
      img.onerror = function () { t.cover = DEFAULT_COVER; };
      img.src = t.cover;
    });
  })();

  const TYPE_LABELS = {
    simple: "Simple Task",
    "multi-step": "Multi-step Task",
    schedule: "Schedule Task",
  };

  const TYPE_ORDER = ["simple", "multi-step", "schedule"];

  const SECTION_TITLES = {
    simple: "Simple Task",
    "multi-step": "Multi-step Task",
    schedule: "Schedule Task",
  };

  const STATUS_META = {
    running:   { label: "Running",   icon: "⏳", cls: "status--running"   },
    completed: { label: "Completed", icon: "✅", cls: "status--completed" },
    paused:    { label: "Paused",    icon: "⏸️",  cls: "status--paused"   },
    failed:    { label: "Failed",    icon: "❌", cls: "status--failed"    },
    scheduled: { label: "Scheduled", icon: "🕐", cls: "status--scheduled" },
  };

  function getActiveTaskMeta(taskId) {
    return (window.MY_ACTIVE_TASKS || []).find(function (t) { return t.id === taskId; });
  }

  function getCatalog() {
    return window.TASK_CATALOG || [];
  }

  function getFeaturedTasks() {
    const featured = getCatalog().filter((t) => t.featured);
    return featured.length ? featured.slice(0, 3) : getCatalog().slice(0, 3);
  }

  function taskById(id) {
    return getCatalog().find((t) => t.id === id);
  }

  function typeClass(t) {
    return t.type === "multi-step" ? "multi-step" : t.type;
  }

  function renderHomeCards() {
    const grid = document.getElementById("homeFeaturedGrid");
    grid.innerHTML = "";
    getFeaturedTasks().forEach((task) => {
      grid.appendChild(buildSquareCard(task));
    });
    var viewMore = document.createElement("article");
    viewMore.className = "task-card task-card--view-more";
    viewMore.setAttribute("role", "button");
    viewMore.tabIndex = 0;
    viewMore.innerHTML = '<div class="view-more-inner"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg><span>View More</span></div>';
    viewMore.addEventListener("click", function () { showView("gallery"); window.scrollTo(0, 0); });
    viewMore.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); showView("gallery"); window.scrollTo(0, 0); } });
    grid.appendChild(viewMore);
  }

  function buildSquareCard(task) {
    const el = document.createElement("article");
    el.className = "task-card";
    el.setAttribute("role", "button");
    el.tabIndex = 0;
    el.dataset.taskId = task.id;
    let badgeHtml = "";
    if (task.featuredBadge) {
      const isJapan = task.featuredBadge === "Japan Selection";
      badgeHtml = '<span class="featured-badge' + (isJapan ? ' featured-badge--japan' : '') + '"></span>';
    }
    const hotHtml = task.hot ? '<span class="hot-badge hot-badge--card">HOT</span>' : '';
    el.innerHTML = `
      <div class="task-card-cover" style="background-image:url('${safeCover(task.cover)}')">${badgeHtml}${hotHtml}</div>
      <div class="task-card-body">
        <div class="task-card-title"></div>
        <span class="type-pill ${typeClass(task)}"></span>
      </div>
    `;
    if (task.featuredBadge) {
      el.querySelector(".featured-badge").textContent = task.featuredBadge;
    }
    el.querySelector(".task-card-title").textContent = task.title;
    el.querySelector(".type-pill").textContent = TYPE_LABELS[task.type] || task.type;
    el.addEventListener("click", () => openModal(task.id));
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModal(task.id);
      }
    });
    return el;
  }

  function buildGalleryCard(task) {
    const el = document.createElement("article");
    el.className = "gallery-card";
    el.setAttribute("role", "button");
    el.tabIndex = 0;
    el.dataset.taskId = task.id;
    const hotHtml = task.hot ? '<span class="hot-badge hot-badge--card">HOT</span>' : '';
    el.innerHTML = `
      <div class="gallery-card-cover" style="background-image:url('${safeCover(task.cover)}')">${hotHtml}</div>
      <div class="gallery-card-body">
        <div class="gallery-card-title"></div>
        <span class="type-pill ${typeClass(task)}"></span>
      </div>
    `;
    el.querySelector(".gallery-card-title").textContent = task.title;
    el.querySelector(".type-pill").textContent = TYPE_LABELS[task.type] || task.type;
    el.addEventListener("click", () => openModal(task.id));
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModal(task.id);
      }
    });
    return el;
  }

  let galleryActiveCategory = "all";

  const JAPAN_SUBS = [
    { id: "job-hunting", icon: "💼", titleJa: "就活", titleEn: "Job Hunting" },
    { id: "bureaucracy", icon: "🏛️", titleJa: "行政手続き", titleEn: "Navigating Bureaucracy" },
    { id: "daily-life", icon: "🗾", titleJa: "日常生活", titleEn: "Daily Japanese Life" },
    { id: "communication", icon: "✉️", titleJa: "コミュニケーション", titleEn: "Japanese Communication" },
  ];

  function renderJapanSelection(host) {
    const catalog = getCatalog();
    const japanTasks = catalog.filter((t) => t.category === "japan");

    const wrapper = document.createElement("div");
    wrapper.className = "japan-selection";

    const banner = document.createElement("div");
    banner.className = "japan-banner";
    banner.innerHTML =
      '<span class="japan-banner-flag">🇯🇵</span>' +
      '<div class="japan-banner-text">' +
        '<h2 class="japan-banner-title">Japan Selection</h2>' +
        '<p class="japan-banner-desc">Curated AI tasks for life in Japan — from job hunting to daily essentials.</p>' +
      '</div>';
    wrapper.appendChild(banner);

    JAPAN_SUBS.forEach((sub) => {
      const tasks = japanTasks.filter((t) => t.japanSub === sub.id);
      if (!tasks.length) return;

      const section = document.createElement("div");
      section.className = "japan-sub-section";

      const header = document.createElement("div");
      header.className = "japan-sub-header";
      header.innerHTML =
        '<span class="japan-sub-icon">' + sub.icon + '</span>' +
        '<div class="japan-sub-titles">' +
          '<h3 class="japan-sub-title-ja">' + sub.titleJa + '</h3>' +
          '<span class="japan-sub-title-en">' + sub.titleEn + '</span>' +
        '</div>';
      section.appendChild(header);

      const grid = document.createElement("div");
      grid.className = "japan-sub-grid";
      tasks.forEach((t) => grid.appendChild(buildGalleryCard(t)));
      section.appendChild(grid);

      wrapper.appendChild(section);
    });

    host.appendChild(wrapper);
  }

  function renderGallery() {
    const host = document.getElementById("galleryByType");
    host.innerHTML = "";
    const catalog = getCatalog();
    const categories = window.TASK_CATEGORIES || [];

    const tabBar = document.createElement("div");
    tabBar.className = "gallery-tab-bar";
    categories.forEach((cat) => {
      const count = cat.id === "all"
        ? catalog.filter((t) => t.category !== "japan").length
        : cat.id === "japan"
          ? catalog.filter((t) => t.category === "japan").length
          : catalog.filter((t) => t.category === cat.id).length;
      if (cat.id !== "all" && cat.id !== "japan" && count === 0) return;
      const btn = document.createElement("button");
      btn.type = "button";
      let cls = "gallery-tab";
      if (galleryActiveCategory === cat.id) cls += " active";
      if (cat.special) cls += " gallery-tab--special";
      btn.className = cls;
      const icon = cat.icon || "";
      if (cat.id === "japan") {
        btn.innerHTML = '<span class="gallery-tab-icon">' + icon + '</span>' + cat.label + '<span class="hot-badge">HOT</span>';
      } else {
        btn.innerHTML = '<span class="gallery-tab-icon">' + icon + '</span>' + cat.label + ' <span class="gallery-tab-count">(' + count + ')</span>';
      }
      btn.addEventListener("click", () => {
        galleryActiveCategory = cat.id;
        renderGallery();
      });
      tabBar.appendChild(btn);
    });
    host.appendChild(tabBar);

    if (galleryActiveCategory === "japan") {
      renderJapanSelection(host);
      return;
    }

    const filtered = galleryActiveCategory === "all"
      ? catalog.filter((t) => t.category !== "japan")
      : catalog.filter((t) => t.category === galleryActiveCategory);

    const grid = document.createElement("div");
    grid.className = "category-grid";
    filtered.forEach((t) => grid.appendChild(buildGalleryCard(t)));
    host.appendChild(grid);
  }

  function renderMyTasks() {
    const host = document.getElementById("myTaskList");
    host.innerHTML = "";
    const activeTasks = window.MY_ACTIVE_TASKS || [];

    if (!activeTasks.length) {
      host.innerHTML =
        '<div class="empty-state">No active tasks yet. Open a task from Task Center to see it here.</div>';
      return;
    }

    const list = document.createElement("div");
    list.className = "my-task-list";
    activeTasks.forEach((meta) => {
      const task = taskById(meta.id);
      if (!task) return;
      const sm = STATUS_META[meta.status] || STATUS_META.running;

      const row = document.createElement("div");
      row.className = "my-task-row";
      row.setAttribute("role", "button");
      row.tabIndex = 0;
      row.dataset.taskId = task.id;

      let detailLines = "";
      if (meta.schedule) {
        detailLines += `<span class="my-task-schedule">🔁 ${meta.schedule}</span>`;
      }
      if (meta.nextRun) {
        detailLines += `<span class="my-task-run-info">Next run: ${meta.nextRun}</span>`;
      }
      if (meta.lastRun) {
        detailLines += `<span class="my-task-run-info">Last run: ${meta.lastRun}</span>`;
      }

      row.innerHTML = `
        <div class="my-task-thumb" style="background-image:url('${safeCover(task.cover)}')">
          <span class="my-task-status-badge ${sm.cls}">${sm.icon} ${sm.label}</span>
        </div>
        <div class="my-task-meta">
          <h3></h3>
          <p class="my-task-desc"></p>
          <div class="my-task-detail-row">${detailLines}</div>
        </div>
        <div class="my-task-right">
          <span class="type-pill ${typeClass(task)}"></span>
        </div>
      `;
      row.querySelector("h3").textContent = task.title;
      row.querySelector(".my-task-desc").textContent = task.description;
      row.querySelector(".type-pill").textContent = TYPE_LABELS[task.type] || task.type;
      row.addEventListener("click", () => openModal(task.id));
      row.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openModal(task.id);
        }
      });
      list.appendChild(row);
    });
    host.appendChild(list);
  }

  function showView(name) {
    const home = document.getElementById("viewHome");
    const gallery = document.getElementById("viewGallery");
    const my = document.getElementById("viewMyTasks");
    home.classList.toggle("hidden", name !== "home");
    gallery.classList.toggle("active", name === "gallery");
    my.classList.toggle("active", name === "my");

    if (name === "gallery") renderGallery();
    if (name === "my") renderMyTasks();
  }

  const CONNECTOR_COLORS = {
    Outlook: { bg: "#e8f0fe", color: "#0078D4" },
    "MS Calendar": { bg: "#e8f0fe", color: "#0078D4" },
    "MS Teams": { bg: "#eee8fb", color: "#6264A7" },
    Line: { bg: "#e8faf0", color: "#06C755" },
    Teams: { bg: "#eee8fb", color: "#6264A7" },
    Gmail: { bg: "#fde8e8", color: "#EA4335" },
    "Google Calendar": { bg: "#e8f0fe", color: "#4285F4" },
    Instagram: { bg: "#fce8f4", color: "#E4405F" },
    X: { bg: "#f0f0f0", color: "#171717" },
    Facebook: { bg: "#e8f0fe", color: "#1877F2" },
  };

  function openModal(taskId) {
    const task = taskById(taskId);
    if (!task) return;
    document.getElementById("modalTitle").textContent = task.title;

    const typeEl = document.getElementById("modalType");
    typeEl.textContent = TYPE_LABELS[task.type] || task.type;
    typeEl.className = "type-pill " + typeClass(task);

    const extra = document.getElementById("modalExtraTags");
    extra.innerHTML = "";
    (task.typeTags || []).forEach((tag) => {
      const span = document.createElement("span");
      span.className = "tag-chip";
      span.textContent = tag;
      extra.appendChild(span);
    });

    document.getElementById("modalDesc").textContent = task.description || "";

    const connEl = document.getElementById("modalConnectors");
    connEl.innerHTML = "";
    const isRakuten = task.category === "rakuten";
    const hasConn = !!(task.connectors && task.connectors.length);
    const headingConn = document.getElementById("headingConnectors");
    headingConn.style.display = hasConn ? "" : "none";
    connEl.style.display = hasConn ? "" : "none";
    if (isRakuten) {
      headingConn.textContent = "RAKUTEN SERVICES";
    } else {
      headingConn.textContent = "CONNECTORS";
    }
    if (hasConn) {
      if (isRakuten) {
        task.connectors.forEach((name) => {
          const chip = document.createElement("span");
          chip.className = "modal-conn-chip";
          chip.style.background = "#bf0000";
          chip.style.color = "#fff";
          chip.textContent = name;
          connEl.appendChild(chip);
        });
      } else {
        task.connectors.forEach((name) => {
          const chip = document.createElement("span");
          chip.className = "modal-conn-chip";
          const cc = CONNECTOR_COLORS[name] || { bg: "#f1f5f9", color: "#475569" };
          chip.style.background = cc.bg;
          chip.style.color = cc.color;
          chip.textContent = name;
          connEl.appendChild(chip);
        });
      }
    }

    document.getElementById("modalCover").style.backgroundImage = `url('${safeCover(task.cover)}')`;
    document.getElementById("modalFlow").href = task.userFlowUrl || "#";
    document.getElementById("taskModal").classList.add("open");
    document.getElementById("modalClose").focus();
  }

  function closeModal() {
    document.getElementById("taskModal").classList.remove("open");
  }

  var btnGoGallery = document.getElementById("btnGoGallery");
  if (btnGoGallery) {
    btnGoGallery.addEventListener("click", () => { showView("gallery"); window.scrollTo(0, 0); });
  }
  var btnGoMyTasks = document.getElementById("btnGoMyTasks");
  if (btnGoMyTasks) {
    btnGoMyTasks.addEventListener("click", () => { showView("my"); window.scrollTo(0, 0); });
  }

  document.querySelectorAll(".btn-back[data-nav]").forEach((btn) => {
    btn.addEventListener("click", () => {
      showView("home");
      window.scrollTo(0, 0);
    });
  });

  document.getElementById("modalClose").addEventListener("click", closeModal);
  document.getElementById("taskModal").addEventListener("click", (e) => {
    if (e.target.id === "taskModal") closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  document.getElementById("btnNewChatMock").addEventListener("click", () => {
    showView("home");
    window.scrollTo(0, 0);
  });

  var headerMyTask = document.getElementById("headerMyTask");
  if (headerMyTask) {
    headerMyTask.addEventListener("click", () => {
      showView("my");
      window.scrollTo(0, 0);
    });
  }

  if (window.location.hash === "#my-tasks") {
    showView("my");
  }
  if (window.location.hash === "#gallery") {
    showView("gallery");
  }

  renderHomeCards();

  /* ── Connector integration ── */
  if (window.ConnectorManager) {
    document.getElementById("homeConnBtn").addEventListener("click", ConnectorManager.openModal);
    ConnectorManager.registerChipContainer(document.getElementById("homeConnChips"));
  }

  /* ══════════════════════════════════════════════════════
     My Page Tabs (My Task / My Calendar)
     ══════════════════════════════════════════════════════ */
  document.querySelectorAll(".my-page-tab").forEach(function(tab){
    tab.addEventListener("click", function(){
      document.querySelectorAll(".my-page-tab").forEach(function(t){ t.classList.remove("active"); });
      tab.classList.add("active");
      var target = tab.dataset.mytab;
      document.getElementById("myTabTasks").classList.toggle("hidden", target !== "tasks");
      document.getElementById("myTabCalendar").classList.toggle("hidden", target !== "calendar");
      if(target === "calendar") renderCalendar();
    });
  });

  /* ══════════════════════════════════════════════════════
     My Calendar
     ══════════════════════════════════════════════════════ */
  (function initCalendar(){
    var MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    var now = new Date();
    var calYear = now.getFullYear();
    var calMonth = now.getMonth();

    var CALENDAR_EVENTS = [
      {id:"e1",title:"Weekly Report Check",summary:"Automated compliance check of weekly reports via Line and Teams.",time:"08:00",recurrence:"weekly",dayOfWeek:1,type:"scheduled",taskId:"case-weekly-report"},
      {id:"e2",title:"Daily News Digest",summary:"Auto-curated morning news briefing.",time:"07:30",recurrence:"weekly",dayOfWeek:3,type:"scheduled",taskId:"daily-news-digest"},
      {id:"e5",title:"Weekly Sprint Review",summary:"Sprint review summary sent to stakeholders.",time:"10:00",recurrence:"weekly",dayOfWeek:5,type:"scheduled",taskId:"kpi-dashboard"},
      {id:"e6",title:"Dinner reservation",summary:"Table for 4 at Osteria Francescana, 7:30 PM.",date:"2026-04-18",time:"19:30",type:"todo"},
      {id:"e7",title:"Proposal deadline",summary:"Submit final proposal to VP Engineering.",date:"2026-04-22",time:"17:00",type:"todo"},
      {id:"e9",title:"Mom's birthday gift",summary:"Pick up gift from store before 6 PM.",date:"2026-04-15",time:"18:00",type:"todo"},
      {id:"e10",title:"Tax filing deadline",summary:"Complete and submit annual tax return.",date:"2026-04-30",time:"23:59",type:"todo"}
    ];

    var cancelledIds = new Set();
    var rescheduledMap = {};
    var card = document.getElementById("calCard");
    var currentEvent = null;

    function getEventsForDate(y, m, d){
      var dateStr = y+"-"+String(m+1).padStart(2,"0")+"-"+String(d).padStart(2,"0");
      var dt = new Date(y, m, d);
      var dow = dt.getDay();
      var results = [];
      CALENDAR_EVENTS.forEach(function(ev){
        if(cancelledIds.has(ev.id)) return;
        if(ev.recurrence === "weekly" && dow === ev.dayOfWeek){
          results.push(ev);
        } else if(ev.date){
          var targetDate = rescheduledMap[ev.id] ? rescheduledMap[ev.id].split("T")[0] : ev.date;
          if(targetDate === dateStr) results.push(ev);
        }
      });
      return results;
    }

    window.renderCalendar = function renderCalendar(){
      var monthLabel = document.getElementById("calMonth");
      monthLabel.textContent = MONTHS[calMonth] + " " + calYear;

      closeCard();
      var container = document.getElementById("calCellsContainer");
      var oldGrid = container.querySelector(".my-cal-cells");
      if(oldGrid) oldGrid.remove();

      var grid = document.createElement("div");
      grid.className = "my-cal-cells";
      grid.style.display = "grid";
      grid.style.gridTemplateColumns = "repeat(7,minmax(0,1fr))";

      ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].forEach(function(d){
        var dow = document.createElement("div");
        dow.className = "my-cal-dow";
        dow.textContent = d;
        grid.appendChild(dow);
      });

      var firstDay = new Date(calYear, calMonth, 1).getDay();
      var daysInMonth = new Date(calYear, calMonth+1, 0).getDate();
      var today = new Date();

      for(var i=0;i<firstDay;i++){
        var empty = document.createElement("div");
        empty.className = "my-cal-cell empty";
        grid.appendChild(empty);
      }

      for(var d=1;d<=daysInMonth;d++){
        var cell = document.createElement("div");
        cell.className = "my-cal-cell";
        if(d===today.getDate() && calMonth===today.getMonth() && calYear===today.getFullYear()){
          cell.classList.add("today");
        }
        var dayLabel = document.createElement("div");
        dayLabel.className = "my-cal-day";
        dayLabel.textContent = d;
        cell.appendChild(dayLabel);

        var events = getEventsForDate(calYear, calMonth, d);
        events.forEach(function(ev){
          var tag = document.createElement("span");
          var isCancelled = cancelledIds.has(ev.id);
          tag.className = "my-cal-event" + (isCancelled ? " my-cal-event--cancelled" : (ev.type==="scheduled" ? " my-cal-event--scheduled" : " my-cal-event--todo"));
          tag.textContent = ev.title;
          tag.dataset.eventId = ev.id;
          if(!isCancelled){
            tag.addEventListener("click", function(e){
              e.stopPropagation();
              openCard(ev, e.target);
            });
          }
          cell.appendChild(tag);
        });
        grid.appendChild(cell);
      }

      var remaining = (firstDay + daysInMonth) % 7;
      if(remaining > 0){
        for(var j=0;j<7-remaining;j++){
          var empty2 = document.createElement("div");
          empty2.className = "my-cal-cell empty";
          grid.appendChild(empty2);
        }
      }

      container.insertBefore(grid, card);
    };

    function openCard(ev, anchorEl){
      currentEvent = ev;
      document.getElementById("calCardTitle").textContent = ev.title;
      document.getElementById("calCardSummary").textContent = ev.summary;
      var timeText = "";
      if(ev.recurrence === "weekly") timeText = "Every " + ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][ev.dayOfWeek] + " at " + ev.time;
      else if(ev.date) timeText = ev.date + " at " + ev.time;
      document.getElementById("calCardTime").textContent = timeText;
      document.getElementById("calCardRescheduleForm").classList.add("hidden");

      var viewBtn = document.getElementById("calCardViewTask");
      if(ev.taskId){
        viewBtn.classList.remove("hidden");
        viewBtn.onclick = function(){ window.location.href = "task-execution.html?task=" + ev.taskId; };
      } else {
        viewBtn.classList.add("hidden");
      }

      var container = document.getElementById("calCellsContainer");
      var containerRect = container.getBoundingClientRect();
      var anchorRect = anchorEl.getBoundingClientRect();
      var top = anchorRect.bottom - containerRect.top + 4;
      var left = anchorRect.left - containerRect.left;
      if(left + 280 > container.offsetWidth) left = container.offsetWidth - 290;
      if(left < 0) left = 4;
      card.style.top = top + "px";
      card.style.left = left + "px";
      card.classList.remove("hidden");
    }

    function closeCard(){
      card.classList.add("hidden");
      currentEvent = null;
    }

    document.getElementById("calCardClose").addEventListener("click", closeCard);

    document.getElementById("calCardReschedule").addEventListener("click", function(){
      document.getElementById("calCardRescheduleForm").classList.remove("hidden");
    });

    document.getElementById("calCardConfirm").addEventListener("click", function(){
      if(!currentEvent) return;
      var newVal = document.getElementById("calCardNewTime").value;
      if(!newVal) return;
      rescheduledMap[currentEvent.id] = newVal;
      if(currentEvent.date) currentEvent.date = newVal.split("T")[0];
      if(newVal.includes("T")) currentEvent.time = newVal.split("T")[1].slice(0,5);
      renderCalendar();
    });

    document.getElementById("calCardCancel").addEventListener("click", function(){
      if(!currentEvent) return;
      cancelledIds.add(currentEvent.id);
      renderCalendar();
    });

    document.addEventListener("click", function(e){
      if(!card.classList.contains("hidden") && !card.contains(e.target) && !e.target.closest(".my-cal-event")){
        closeCard();
      }
    });

    document.getElementById("calPrev").addEventListener("click", function(){
      calMonth--;
      if(calMonth < 0){ calMonth = 11; calYear--; }
      renderCalendar();
    });
    document.getElementById("calNext").addEventListener("click", function(){
      calMonth++;
      if(calMonth > 11){ calMonth = 0; calYear++; }
      renderCalendar();
    });

    var syncBtn = document.getElementById("calSyncBtn");
    var syncDrop = document.getElementById("calSyncDropdown");
    syncBtn.addEventListener("click", function(e){
      e.stopPropagation();
      syncDrop.classList.toggle("hidden");
    });
    document.addEventListener("click", function(){ syncDrop.classList.add("hidden"); });
    syncDrop.addEventListener("click", function(e){
      var opt = e.target.closest("[data-sync]");
      if(!opt) return;
      syncDrop.classList.add("hidden");
      var name = opt.dataset.sync === "google" ? "Google Calendar" : "MS Calendar";
      alert("Calendar synced to " + name + " successfully!");
    });

    renderCalendar();
  })();

})();
