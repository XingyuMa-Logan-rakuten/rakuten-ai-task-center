/**
 * i18n – Internationalisation helper for Rakuten AI Task Center.
 * Default language: Japanese (ja). Fallback: English (en).
 */
(function () {
  var MESSAGES = {
    /* ─── Page titles ─── */
    "page.title.home":          { ja: "Rakuten AI — タスクセンター", en: "Rakuten AI — Task Center" },
    "page.title.exec":          { ja: "タスク実行 — Rakuten AI",    en: "Task execution — Rakuten AI" },
    "page.title.vj":            { ja: "ボイスジャーナル — Rakuten AI", en: "Voice Journal — Rakuten AI" },
    "page.title.vjTasks":       { ja: "マイタスク — Rakuten AI",     en: "My Tasks — Rakuten AI" },

    /* ─── Sidebar ─── */
    "sidebar.newChat":          { ja: "新しいチャット",   en: "New Chat" },
    "sidebar.section.agents":   { ja: "Rakuten エージェント", en: "Rakuten Agents" },
    "nav.shopping":             { ja: "ショッピング",     en: "Shopping" },
    "nav.rakuma":               { ja: "ラクマ",          en: "Rakuma" },
    "nav.fashion":              { ja: "ファッション",     en: "Fashion" },
    "nav.music":                { ja: "ミュージック",     en: "Music" },
    "nav.mobile":               { ja: "モバイル",        en: "Mobile" },
    "sidebar.section.essentials":{ ja: "デイリーツール",   en: "Daily Essentials" },
    "nav.aiSearch":             { ja: "AI 検索",         en: "AI Search" },
    "nav.imageCreator":         { ja: "画像生成",        en: "Image Creator" },
    "nav.videoCreator":         { ja: "動画生成",        en: "Video Creator" },
    "nav.voiceJournal":         { ja: "ボイスジャーナル",  en: "Voice Journal" },
    "nav.aiTranslator":         { ja: "AI 翻訳",         en: "AI Translator" },
    "nav.problemSolver":        { ja: "問題解決",        en: "Problem Solver" },
    "sidebar.community":        { ja: "AI コミュニティ",  en: "AI Community" },
    "sidebar.enter":            { ja: "開く ›",          en: "Enter ›" },
    "sidebar.recentChat":       { ja: "最近のチャット",   en: "Recent chat" },
    "sidebar.seeAll":           { ja: "すべて見る ›",    en: "See all ›" },
    "sidebar.language":         { ja: "日本語",          en: "English" },

    /* ─── Header ─── */
    "header.myTask":            { ja: "マイタスク",      en: "My Task" },
    "header.signIn":            { ja: "ログイン",        en: "Sign in" },

    /* ─── Home ─── */
    "home.greeting":            { ja: "こんにちは、何かお手伝いしましょうか？", en: "Hi, how can I help you?" },
    "composer.placeholder":     { ja: "メッセージを入力してください",           en: "Input message here" },
    "composer.thinkDeeper":     { ja: "深く考える",      en: "Think deeper" },
    "composer.connectors":      { ja: "コネクター",      en: "Connectors" },

    /* ─── Quick pills ─── */
    "pill.aiSearch":            { ja: "AI 検索",         en: "AI Search" },
    "pill.imageCreator":        { ja: "画像生成",        en: "Image Creator" },
    "pill.videoCreator":        { ja: "動画生成",        en: "Video Creator" },
    "pill.voiceJournal":        { ja: "ボイスジャーナル",  en: "Voice Journal" },
    "pill.aiTranslator":        { ja: "AI 翻訳",         en: "AI Translator" },
    "pill.problemSolver":       { ja: "問題解決",        en: "Problem Solver" },
    "pill.aiSummarizer":        { ja: "AI 要約",         en: "AI Summarizer" },
    "pill.writingAssistant":    { ja: "文章アシスタント",  en: "Writing Assistant" },
    "pill.codingAssistant":     { ja: "コーディングアシスタント", en: "Coding Assistant" },

    /* ─── Task Center ─── */
    "taskCenter.heading":       { ja: "タスクセンター",   en: "Task Center" },
    "taskCenter.viewMore":      { ja: "もっと見る",      en: "View More" },
    "nav.backToChat":           { ja: "← チャットに戻る", en: "← Back to chat" },

    /* ─── Task types ─── */
    "type.simple":              { ja: "シンプルタスク",    en: "Simple Task" },
    "type.multi-step":          { ja: "マルチステップタスク", en: "Multi-step Task" },
    "type.schedule":            { ja: "スケジュールタスク", en: "Schedule Task" },

    /* ─── Modal ─── */
    "modal.description":        { ja: "説明",            en: "Description" },
    "modal.connectors":         { ja: "コネクター",      en: "Connectors" },
    "modal.rakutenServices":    { ja: "Rakuten サービス", en: "Rakuten Services" },
    "modal.haveATry":           { ja: "試してみる",      en: "Have a Try" },

    /* ─── My Task ─── */
    "myTask.tab.tasks":         { ja: "マイタスク",      en: "My Task" },
    "myTask.tab.calendar":      { ja: "マイカレンダー",   en: "My Calendar" },
    "myTask.empty":             { ja: "アクティブなタスクはまだありません。タスクセンターからタスクを開いてください。", en: "No active tasks yet. Open a task from Task Center to see it here." },
    "myTask.status.running":    { ja: "実行中",          en: "Running" },
    "myTask.status.completed":  { ja: "完了",            en: "Completed" },
    "myTask.status.paused":     { ja: "一時停止",        en: "Paused" },
    "myTask.status.failed":     { ja: "失敗",            en: "Failed" },

    /* ─── Calendar ─── */
    "calendar.sync":            { ja: "同期",            en: "Sync" },
    "calendar.viewTask":        { ja: "タスクを見る →",   en: "View Task →" },
    "calendar.reschedule":      { ja: "日程変更",        en: "Reschedule" },
    "calendar.cancel":          { ja: "キャンセル",      en: "Cancel" },
    "calendar.confirm":         { ja: "確定",            en: "Confirm" },
    "calendar.dow.sun":         { ja: "日", en: "Sun" },
    "calendar.dow.mon":         { ja: "月", en: "Mon" },
    "calendar.dow.tue":         { ja: "火", en: "Tue" },
    "calendar.dow.wed":         { ja: "水", en: "Wed" },
    "calendar.dow.thu":         { ja: "木", en: "Thu" },
    "calendar.dow.fri":         { ja: "金", en: "Fri" },
    "calendar.dow.sat":         { ja: "土", en: "Sat" },

    /* ─── Execution page ─── */
    "exec.addToMyTask":         { ja: "＋ マイタスクに追加", en: "+ Add to My Task" },
    "exec.status.running":      { ja: "マルチステップワークフロー実行中…", en: "Running multi-step workflow…" },
    "exec.status.stepComplete": { ja: "ステップ {0}/{1} 完了", en: "Step {0} of {1} complete" },
    "exec.status.complete":     { ja: "Rakuten AI タスクの再生が完了しました。", en: "Rakuten AI task replay completed." },
    "exec.watchAgain":          { ja: "もう一度見る",    en: "Watch again" },
    "exec.tryYourself":         { ja: "自分で試す 👋",   en: "Try it yourself 👋" },
    "exec.fastResponse":        { ja: "⚡ 高速応答 ▼",   en: "⚡ Fast Response ▼" },
    "exec.send":                { ja: "送信",            en: "Send" },
    "exec.authVerify":          { ja: "アカウント認証の確認", en: "Verify account authorization" },
    "exec.authChecking":        { ja: "認証状態を確認中…", en: "Checking authorization status..." },
    "exec.authCheckingBadge":   { ja: "確認中...",        en: "Checking..." },
    "exec.authAuthorized":      { ja: "認証済み ✓",      en: "Authorized ✓" },
    "exec.authNotAuthorized":   { ja: "未認証",          en: "Not authorized" },
    "exec.authSignIn":          { ja: "ログイン",        en: "Sign In" },
    "exec.authAuthorize":       { ja: "認証する",        en: "Authorize" },
    "exec.authPromptRakuten":   { ja: "続行するには、Rakuten アカウントにログインしてください。", en: "Please sign in to your Rakuten Account to continue." },
    "exec.authPromptGeneric":   { ja: "一部のサービスは認証が必要です。各サービスを認証して続行してください。", en: "Some services require authorization before the agent can proceed. Please authorize each service to continue." },
    "exec.authAllDone":         { ja: "すべて認証済み ✓", en: "All authorized ✓" },
    "exec.stepRunning":         { ja: "実行中...",        en: "Running..." },
    "exec.stepDone":            { ja: "完了 ✓",          en: "Done ✓" },
    "exec.authPageTitle":       { ja: "{0} にログイン",   en: "Sign in to {0}" },
    "exec.authPageTitleRakuten":{ ja: "Rakuten アカウントにログイン", en: "Sign in to your Rakuten Account" },
    "exec.authPageDescRakuten": { ja: "Rakuten ID でログインして、このタスクに必要な Rakuten サービスへのアクセスを許可します。", en: "Log in with your Rakuten ID to allow Rakuten AI to access the required Rakuten services for this task." },
    "exec.authPageDescGeneric": { ja: "Rakuten AI が {0} アカウントにアクセスすることを許可します。", en: "Authorize Rakuten AI to access your {0} account to complete this task." },
    "exec.authPageSubmitRakuten":{ ja: "ログインして続行", en: "Sign In & Continue" },
    "exec.authPageSubmitGeneric":{ ja: "認証して続行",    en: "Authorize & Continue" },
    "exec.authPageAuthorizing": { ja: "認証中...",        en: "Authorizing..." },
    "exec.authPageFooter":      { ja: "続行すると、Rakuten AI とアカウントデータを共有することに同意したことになります。", en: "By continuing, you agree to share account data with Rakuten AI." },

    /* ─── Voice Journal ─── */
    "vj.title":                 { ja: "ボイスジャーナル", en: "Voice Journal" },
    "vj.start.desc":            { ja: "ボタンをクリックしてボイスジャーナルを開始してください", en: "Please click button to start voice journal" },
    "vj.start.button":          { ja: "開始",            en: "Start" },
    "vj.upload.audio":          { ja: "音声をアップロード", en: "Upload audio" },
    "vj.tab.transcript":        { ja: "文字起こし",      en: "Transcript" },
    "vj.tab.summary":           { ja: "要約 & ToDo",     en: "Summary & To-dos" },
    "vj.tab.topics":            { ja: "トピック",        en: "Topics" },
    "vj.recorder.pause":        { ja: "一時停止",        en: "Pause" },
    "vj.recorder.stop":         { ja: "録音を停止",      en: "Stop recording" },
    "vj.continue.button":       { ja: "録音を続ける",    en: "Continue Recording" },
    "vj.endDialog.title":       { ja: "録音を終了しますか？", en: "End recording?" },
    "vj.endDialog.desc":        { ja: "このジャーナルエントリの保存方法を選択してください。", en: "Choose how to save this journal entry." },
    "vj.endDialog.endSummarize":{ ja: "終了して要約する",  en: "End and summarize" },
    "vj.endDialog.endOnly":     { ja: "終了のみ",        en: "End only" },
    "vj.version.back":          { ja: "最新版に戻る",    en: "Back to latest" },
    "vj.preview.title":         { ja: "プレビュー",      en: "Preview" },
    "vj.preview.share":         { ja: "共有",            en: "Share" },
    "vj.preview.open":          { ja: "開く",            en: "Open" },
    "vj.upload.pageTitle":      { ja: "音声をアップロード", en: "Upload Audio" },
    "vj.toolbar.generateFile":  { ja: "ファイル生成",    en: "Generate file" },
    "vj.toolbar.download":      { ja: "ダウンロード",    en: "Download" },
    "vj.toolbar.copy":          { ja: "コピー",          en: "Copy" },

    /* ─── VJ Tasks ─── */
    "vjTasks.title":            { ja: "マイタスク",      en: "My Tasks" },
    "vjTasks.completed":        { ja: "{0}/{1} 完了",    en: "{0}/{1} completed" },

    /* ─── Footer / legal ─── */
    "footer.beta":              { ja: "BETA",            en: "BETA" },
    "footer.disclaimer":        { ja: "ご利用にあたっては", en: "Please adhere to" },
    "footer.precautions":       { ja: "注意事項",        en: "the precautions" },
    "footer.disclaimerSuffix":  { ja: "をご確認ください。注意事項に同意いただける場合のみご利用いただけます。", en: " when using this feature. This feature can only be used if you agree to the precautions." },
    "footer.hide":              { ja: "非表示",          en: "Hide" },
    "footer.vjDisclaimer":      { ja: "生成AIの回答や説明は不正確な場合があります。回答は必ずご自身でご確認ください。利用規約は", en: "Generative AI responses and explanations may be inaccurate. Please be sure to check the answer by yourself. You can find the terms of service for this tool" },
    "footer.here":              { ja: "こちら",          en: "here" },

    /* ─── Common ─── */
    "common.cancel":            { ja: "キャンセル",      en: "Cancel" },
    "common.close":             { ja: "閉じる",          en: "Close" },

    /* ─── Gallery category labels ─── */
    "cat.all":                  { ja: "すべてのアイデア", en: "All Ideas" },
    "cat.japan":                { ja: "Japan Selection",  en: "Japan Selection" },
    "cat.office":               { ja: "仕事の生産性",    en: "Work Productivity" },
    "cat.research":             { ja: "リサーチ & 学習",  en: "Research & Learning" },
    "cat.entertainment":        { ja: "エンターテインメント", en: "Entertainment" },
    "cat.lifestyle":            { ja: "自律 & ライフ",    en: "Self-Discipline & Life" },
    "cat.social-media":         { ja: "SNS & マーケティング", en: "Social Media & Marketing" },
    "cat.finance":              { ja: "個人の資産管理",   en: "Personal Finance" },
    "cat.rakuten":              { ja: "Rakuten エコシステム", en: "Rakuten Ecosystem" },

    /* ─── Japan Selection sub-sections ─── */
    "japan.banner.title":       { ja: "Japan Selection",  en: "Japan Selection" },
    "japan.banner.desc":        { ja: "日本での生活に役立つ厳選AIタスク — 就活から日常生活まで。", en: "Curated AI tasks for life in Japan — from job hunting to daily essentials." },

    /* ─── Connector modal ─── */
    "connModal.title":          { ja: "コネクター管理",   en: "Manage Connectors" },
    "connModal.desc":           { ja: "サービスを接続して、タスクの機能を拡張しましょう。", en: "Connect services to extend your task capabilities." },
    "connModal.authorize":      { ja: "認証する",        en: "Authorize" },
    "connModal.authorized":     { ja: "認証済み ✓",      en: "Authorized ✓" },
    "connModal.add":            { ja: "追加",            en: "Add" },
    "connModal.added":          { ja: "追加済み ✓",      en: "Added ✓" },

    /* ─── Language names (for dropdown) ─── */
    "lang.ja":                  { ja: "日本語",          en: "日本語" },
    "lang.en":                  { ja: "English",         en: "English" },
  };

  var currentLang = localStorage.getItem("rakuten-ai-lang") || "ja";

  function t(key, params) {
    var entry = MESSAGES[key];
    if (!entry) return key;
    var str = entry[currentLang] || entry.en || key;
    if (params) {
      for (var i = 0; i < params.length; i++) {
        str = str.replace("{" + i + "}", params[i]);
      }
    }
    return str;
  }

  function getLang() { return currentLang; }

  function setLang(lang) {
    currentLang = lang;
    localStorage.setItem("rakuten-ai-lang", lang);
    applyStaticTranslations();
    document.documentElement.lang = lang;
    if (document.title) {
      var titleKey = document.body.dataset.i18nTitle;
      if (titleKey) document.title = t(titleKey);
    }
    window.dispatchEvent(new CustomEvent("langchange", { detail: { lang: lang } }));
  }

  function applyStaticTranslations() {
    var titleKey = document.body && document.body.dataset.i18nTitle;
    if (titleKey) document.title = t(titleKey);

    var els = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      var key = el.getAttribute("data-i18n");
      el.textContent = t(key);
    }
    var placeholders = document.querySelectorAll("[data-i18n-placeholder]");
    for (var j = 0; j < placeholders.length; j++) {
      var ph = placeholders[j];
      ph.placeholder = t(ph.getAttribute("data-i18n-placeholder"));
    }
    var titles = document.querySelectorAll("[data-i18n-title]");
    for (var k = 0; k < titles.length; k++) {
      var ti = titles[k];
      ti.title = t(ti.getAttribute("data-i18n-title"));
    }
    var ariaEls = document.querySelectorAll("[data-i18n-aria]");
    for (var a = 0; a < ariaEls.length; a++) {
      var ar = ariaEls[a];
      ar.setAttribute("aria-label", t(ar.getAttribute("data-i18n-aria")));
    }
    updateLangDropdowns();
  }

  function updateLangDropdowns() {
    var btns = document.querySelectorAll(".lang-current");
    for (var i = 0; i < btns.length; i++) {
      btns[i].textContent = currentLang === "ja" ? "日本語" : "English";
    }
  }

  function initLangDropdown() {
    var containers = document.querySelectorAll(".lang-switcher");
    for (var i = 0; i < containers.length; i++) {
      (function (container) {
        var btn = container.querySelector(".lang-toggle");
        var dropdown = container.querySelector(".lang-dropdown");
        if (!btn || !dropdown) return;

        btn.addEventListener("click", function (e) {
          e.stopPropagation();
          dropdown.classList.toggle("hidden");
        });

        var options = dropdown.querySelectorAll(".lang-option");
        for (var j = 0; j < options.length; j++) {
          options[j].addEventListener("click", function () {
            var lang = this.dataset.lang;
            setLang(lang);
            dropdown.classList.add("hidden");
          });
        }

        document.addEventListener("click", function () {
          dropdown.classList.add("hidden");
        });
      })(containers[i]);
    }
  }

  window.I18n = {
    t: t,
    getLang: getLang,
    setLang: setLang,
    apply: applyStaticTranslations,
    initDropdown: initLangDropdown,
    MESSAGES: MESSAGES,
  };
})();
