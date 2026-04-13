/**
 * Connector Manager — shared across all pages.
 * Renders a connector modal, handles authorize / add-to-chatbox / remove actions,
 * and maintains selected-connector chips in the input area.
 */
(function () {
  /* ── Connector catalog ── */
  const CONNECTORS = [
    {
      id: "gmail",
      name: "Gmail",
      icon: `<svg viewBox="0 0 24 24" width="28" height="28"><path fill="#4285F4" d="M2 6l10 7 10-7v12H2z" opacity=".12"/><path fill="#EA4335" d="M22 6l-10 7L2 6"/><rect x="2" y="4" width="20" height="16" rx="2" fill="none" stroke="#EA4335" stroke-width="1.5"/></svg>`,
      color: "#EA4335",
      desc: "Read and send email via your Google account.",
    },
    {
      id: "google-calendar",
      name: "Google Calendar",
      icon: `<svg viewBox="0 0 24 24" width="28" height="28"><rect x="3" y="4" width="18" height="18" rx="2" fill="none" stroke="#4285F4" stroke-width="1.5"/><line x1="3" y1="10" x2="21" y2="10" stroke="#4285F4" stroke-width="1.5"/><line x1="8" y1="2" x2="8" y2="6" stroke="#4285F4" stroke-width="1.5" stroke-linecap="round"/><line x1="16" y1="2" x2="16" y2="6" stroke="#4285F4" stroke-width="1.5" stroke-linecap="round"/><circle cx="12" cy="15" r="1.5" fill="#4285F4"/></svg>`,
      color: "#4285F4",
      desc: "Create and read events from Google Calendar.",
    },
    {
      id: "ms-teams",
      name: "MS Teams",
      icon: `<svg viewBox="0 0 24 24" width="28" height="28"><rect x="2" y="4" width="20" height="16" rx="3" fill="none" stroke="#6264A7" stroke-width="1.5"/><path d="M7 10h10M7 14h6" stroke="#6264A7" stroke-width="1.5" stroke-linecap="round"/></svg>`,
      color: "#6264A7",
      desc: "Send messages and manage channels in MS Teams.",
    },
    {
      id: "ms-outlook",
      name: "MS Outlook",
      icon: `<svg viewBox="0 0 24 24" width="28" height="28"><rect x="2" y="4" width="20" height="16" rx="2" fill="none" stroke="#0078D4" stroke-width="1.5"/><path d="M2 6l10 7 10-7" stroke="#0078D4" stroke-width="1.5" fill="none"/></svg>`,
      color: "#0078D4",
      desc: "Access mail, contacts and calendar via Outlook.",
    },
    {
      id: "ms-calendar",
      name: "MS Calendar",
      icon: `<svg viewBox="0 0 24 24" width="28" height="28"><rect x="3" y="4" width="18" height="18" rx="2" fill="none" stroke="#0078D4" stroke-width="1.5"/><line x1="3" y1="10" x2="21" y2="10" stroke="#0078D4" stroke-width="1.5"/><line x1="8" y1="2" x2="8" y2="6" stroke="#0078D4" stroke-width="1.5" stroke-linecap="round"/><line x1="16" y1="2" x2="16" y2="6" stroke="#0078D4" stroke-width="1.5" stroke-linecap="round"/><rect x="10" y="13" width="4" height="4" rx="0.5" fill="#0078D4"/></svg>`,
      color: "#0078D4",
      desc: "Schedule and read events from Microsoft Calendar.",
    },
    {
      id: "line",
      name: "Line",
      icon: `<svg viewBox="0 0 24 24" width="28" height="28"><rect x="2" y="3" width="20" height="18" rx="4" fill="none" stroke="#06C755" stroke-width="1.5"/><path d="M7 13l2-3 2 2 4-5" stroke="#06C755" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`,
      color: "#06C755",
      desc: "Send and receive messages through Line Messenger.",
    },
    {
      id: "viber",
      name: "Viber",
      icon: `<svg viewBox="0 0 24 24" width="28" height="28"><path d="M12 2C6.48 2 2 6.03 2 10.94c0 2.75 1.34 5.2 3.44 6.83L5 22l4-2.3c.97.18 1.97.3 3 .3 5.52 0 10-4.03 10-8.94S17.52 2 12 2z" fill="none" stroke="#7360F2" stroke-width="1.5"/><path d="M9 10v4M12 9v6M15 11v2" stroke="#7360F2" stroke-width="1.5" stroke-linecap="round"/></svg>`,
      color: "#7360F2",
      desc: "Communicate through Viber messaging platform.",
    },
    {
      id: "instagram",
      name: "Instagram",
      icon: `<svg viewBox="0 0 24 24" width="28" height="28"><rect x="2" y="2" width="20" height="20" rx="5" fill="none" stroke="#E4405F" stroke-width="1.5"/><circle cx="12" cy="12" r="5" fill="none" stroke="#E4405F" stroke-width="1.5"/><circle cx="17.5" cy="6.5" r="1" fill="#E4405F"/></svg>`,
      color: "#E4405F",
      desc: "Post content and manage your Instagram account.",
    },
    {
      id: "facebook",
      name: "Facebook",
      icon: `<svg viewBox="0 0 24 24" width="28" height="28"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" fill="none" stroke="#1877F2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
      color: "#1877F2",
      desc: "Manage pages and messages on Facebook.",
    },
    {
      id: "x-twitter",
      name: "X",
      icon: `<svg viewBox="0 0 24 24" width="28" height="28"><path d="M4 4l6.5 8L4 20h2l5.25-6.4L16 20h4l-7-8.5L19.5 4H18l-4.75 5.8L9 4H4z" fill="none" stroke="#171717" stroke-width="1.5" stroke-linejoin="round"/></svg>`,
      color: "#171717",
      desc: "Post and read on X (formerly Twitter).",
    },
    {
      id: "canva",
      name: "Canva",
      icon: `<svg viewBox="0 0 24 24" width="28" height="28"><circle cx="12" cy="12" r="10" fill="none" stroke="#00C4CC" stroke-width="1.5"/><path d="M9 15c0-3.3 2.7-6 6-6" stroke="#00C4CC" stroke-width="1.5" stroke-linecap="round" fill="none"/></svg>`,
      color: "#00C4CC",
      desc: "Create designs and export assets from Canva.",
    },
    {
      id: "figma",
      name: "Figma",
      icon: `<svg viewBox="0 0 24 24" width="28" height="28"><path d="M5 5.5A3.5 3.5 0 018.5 2H12v7H8.5A3.5 3.5 0 015 5.5z" fill="none" stroke="#F24E1E" stroke-width="1.3"/><path d="M12 2h3.5A3.5 3.5 0 0115.5 9H12V2z" fill="none" stroke="#FF7262" stroke-width="1.3"/><path d="M12 9h3.5a3.5 3.5 0 110 7H12V9z" fill="none" stroke="#1ABCFE" stroke-width="1.3"/><path d="M5 18.5A3.5 3.5 0 018.5 15H12v3.5a3.5 3.5 0 11-7 0z" fill="none" stroke="#0ACF83" stroke-width="1.3"/><path d="M5 12a3.5 3.5 0 013.5-3.5H12v7H8.5A3.5 3.5 0 015 12z" fill="none" stroke="#A259FF" stroke-width="1.3"/></svg>`,
      color: "#A259FF",
      desc: "Access Figma designs and export assets.",
    },
  ];

  const authorizedSet = new Set();
  const addedSet = new Set();

  /* ── SVG icon strings ── */
  const plugIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v6M8 2v6M16 2v6"/><rect x="4" y="8" width="16" height="8" rx="2"/><path d="M12 16v4"/><path d="M8 20h8"/></svg>`;

  const checkSmall = `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;

  const closeSmall = `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;

  /* ── Inject the modal HTML once ── */
  function ensureModal() {
    if (document.getElementById("connectorModal")) return;
    const overlay = document.createElement("div");
    overlay.className = "conn-modal-overlay";
    overlay.id = "connectorModal";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.innerHTML = `
      <div class="conn-modal">
        <div class="conn-modal-header">
          <h2>Manage Connectors</h2>
          <button type="button" class="conn-modal-close" id="connModalClose" aria-label="Close">&times;</button>
        </div>
        <p class="conn-modal-subtitle">Connect external services to your chat. Authorize first, then add to the current conversation.</p>
        <div class="conn-modal-list" id="connModalList"></div>
      </div>`;
    document.body.appendChild(overlay);

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeModal();
    });
    document.getElementById("connModalClose").addEventListener("click", closeModal);
  }

  function openModal() {
    ensureModal();
    renderList();
    document.getElementById("connectorModal").classList.add("open");
  }

  function closeModal() {
    const m = document.getElementById("connectorModal");
    if (m) m.classList.remove("open");
  }

  function renderList() {
    const list = document.getElementById("connModalList");
    list.innerHTML = "";
    CONNECTORS.forEach((c) => {
      const isAuth = authorizedSet.has(c.id);
      const isAdded = addedSet.has(c.id);
      const row = document.createElement("div");
      row.className = "conn-row";
      row.innerHTML = `
        <div class="conn-row-icon">${c.icon}</div>
        <div class="conn-row-info">
          <span class="conn-row-name">${c.name}</span>
          <span class="conn-row-desc">${c.desc}</span>
        </div>
        <div class="conn-row-actions">
          <button type="button" class="conn-btn-auth ${isAuth ? "authed" : ""}" data-id="${c.id}">
            ${isAuth ? "Authorized ✓" : "Authorize"}
          </button>
          <button type="button" class="conn-btn-add ${isAdded ? "added" : ""}" data-id="${c.id}" ${!isAuth ? "disabled" : ""}>
            ${isAdded ? "Added ✓" : "Add to chat"}
          </button>
        </div>`;
      list.appendChild(row);

      row.querySelector(".conn-btn-auth").addEventListener("click", () => {
        authorizedSet.add(c.id);
        renderList();
        refreshAllChips();
      });

      row.querySelector(".conn-btn-add").addEventListener("click", () => {
        if (!authorizedSet.has(c.id)) return;
        if (addedSet.has(c.id)) {
          addedSet.delete(c.id);
        } else {
          addedSet.add(c.id);
        }
        renderList();
        refreshAllChips();
      });
    });
  }

  /* ── Chip containers registered by each page ── */
  const chipContainers = [];

  function registerChipContainer(el) {
    if (!chipContainers.includes(el)) chipContainers.push(el);
    refreshAllChips();
  }

  function refreshAllChips() {
    chipContainers.forEach(renderChips);
  }

  function renderChips(container) {
    container.innerHTML = "";
    CONNECTORS.filter((c) => addedSet.has(c.id)).forEach((c) => {
      const chip = document.createElement("span");
      chip.className = "conn-chip";
      chip.setAttribute("data-id", c.id);
      chip.innerHTML = `
        <span class="conn-chip-icon">${c.icon}</span>
        <span class="conn-chip-check">${checkSmall}</span>
        <button type="button" class="conn-chip-close" aria-label="Remove ${c.name}">${closeSmall}</button>`;
      chip.querySelector(".conn-chip-close").addEventListener("click", (e) => {
        e.stopPropagation();
        addedSet.delete(c.id);
        renderList();
        refreshAllChips();
      });
      container.appendChild(chip);
    });
  }

  /* ── Public API ── */
  window.ConnectorManager = {
    plugIcon,
    openModal,
    closeModal,
    registerChipContainer,
  };
})();
