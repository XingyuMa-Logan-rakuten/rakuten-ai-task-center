(function () {
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
    el.innerHTML = `
      <div class="task-card-cover" style="background-image:url('${task.cover}')"></div>
      <div class="task-card-body">
        <div class="task-card-title"></div>
        <span class="type-pill ${typeClass(task)}"></span>
      </div>
    `;
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
    el.innerHTML = `
      <div class="gallery-card-cover" style="background-image:url('${task.cover}')"></div>
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

  function renderGallery() {
    const host = document.getElementById("galleryByType");
    host.innerHTML = "";
    const catalog = getCatalog();
    const categories = window.TASK_CATEGORIES || [];

    const tabBar = document.createElement("div");
    tabBar.className = "gallery-tab-bar";
    categories.forEach((cat) => {
      const count = cat.id === "all" ? catalog.length : catalog.filter((t) => t.category === cat.id).length;
      if (cat.id !== "all" && count === 0) return;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "gallery-tab" + (galleryActiveCategory === cat.id ? " active" : "");
      btn.textContent = cat.label + " (" + count + ")";
      btn.addEventListener("click", () => {
        galleryActiveCategory = cat.id;
        renderGallery();
      });
      tabBar.appendChild(btn);
    });
    host.appendChild(tabBar);

    const filtered = galleryActiveCategory === "all"
      ? catalog
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
        <div class="my-task-thumb" style="background-image:url('${task.cover}')">
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
    const hasConn = !!(task.connectors && task.connectors.length);
    document.getElementById("headingConnectors").style.display = hasConn ? "" : "none";
    connEl.style.display = hasConn ? "" : "none";
    if (hasConn) {
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

    document.getElementById("modalCover").style.backgroundImage = `url('${task.cover}')`;
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

  renderHomeCards();

  /* ── Connector integration ── */
  if (window.ConnectorManager) {
    document.getElementById("homeConnBtn").addEventListener("click", ConnectorManager.openModal);
    ConnectorManager.registerChipContainer(document.getElementById("homeConnChips"));
  }
})();
