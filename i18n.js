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
    "cat.japan":                { ja: "ライフサービス",    en: "Life Services" },
    "cat.office":               { ja: "仕事の生産性",    en: "Work Productivity" },
    "cat.research":             { ja: "リサーチ & 学習",  en: "Research & Learning" },
    "cat.entertainment":        { ja: "エンターテインメント", en: "Entertainment" },
    "cat.lifestyle":            { ja: "自律 & ライフ",    en: "Self-Discipline & Life" },
    "cat.social-media":         { ja: "SNS & マーケティング", en: "Social Media & Marketing" },
    "cat.finance":              { ja: "個人の資産管理",   en: "Personal Finance" },
    "cat.rakuten":              { ja: "Rakuten エコシステム", en: "Rakuten Ecosystem" },

    /* ─── Life Services sub-sections ─── */
    "japan.banner.title":       { ja: "ライフサービス",    en: "Life Services" },
    "japan.banner.desc":        { ja: "日本での生活に役立つ厳選AIタスク — 就活から日常生活まで。", en: "Curated AI tasks for life in Japan — from job hunting to daily essentials." },

    /* ─── Connector modal ─── */
    "connModal.title":          { ja: "コネクター管理",   en: "Manage Connectors" },
    "connModal.desc":           { ja: "サービスを接続して、タスクの機能を拡張しましょう。", en: "Connect services to extend your task capabilities." },
    "connModal.authorize":      { ja: "認証する",        en: "Authorize" },
    "connModal.authorized":     { ja: "認証済み ✓",      en: "Authorized ✓" },
    "connModal.add":            { ja: "追加",            en: "Add" },
    "connModal.added":          { ja: "追加済み ✓",      en: "Added ✓" },

    /* ─── Task titles ─── */
    "task.case-email-todo":      { ja: "メールToDo分析＆カレンダー登録", en: "Email Todo Analysis & Calendar Scheduling" },
    "task.case-receipt-bill":    { ja: "レシート＆サブスク管理",         en: "Receipt & Subscription Audit" },
    "task.case-weekly-report":   { ja: "週報チェック＆リマインド",       en: "Weekly Report Check & Reminder" },
    "task.daily-news-digest":    { ja: "ホットニュース自動まとめ",       en: "Daily Hot News Auto-Digest" },
    "task.invoice-filing":       { ja: "請求書・レシートスマート整理",    en: "Invoice & Receipt Smart Filing" },
    "task.schedule-tracker":     { ja: "スケジュール管理＆リマインダー",  en: "Schedule Tracking & Smart Reminders" },
    "task.one-click-doc":        { ja: "ワンクリック文書作成",           en: "One-Click Document Creation" },
    "task.auto-spreadsheet":     { ja: "データ表自動生成",              en: "Auto Data Spreadsheet Generator" },
    "task.file-diff":            { ja: "重複ファイル比較＆整理",         en: "Duplicate File Diff & Cleanup" },
    "task.knowledge-base":       { ja: "ナレッジベース構築",            en: "Knowledge Base Quick Builder" },
    "task.startup-validation":   { ja: "起業アイデア実現性チェック",     en: "Startup Idea Feasibility Check" },
    "task.market-research":      { ja: "市場ペインポイント自動分析",     en: "Market Pain Point Auto-Analysis" },
    "task.kpi-dashboard":        { ja: "ビジネスKPIダッシュボード",     en: "Business KPI Visual Dashboard" },
    "task.study-planner":        { ja: "学習プランナー",               en: "Lightweight Study Planner" },
    "task.study-checkin":        { ja: "学習目標トラッカー＆チェックイン", en: "Study Goal Tracker & Check-in" },
    "task.knowledge-map":        { ja: "知識フレームワークマッピング",    en: "Knowledge Framework Mapping" },
    "task.deep-explainer":       { ja: "ディープコンテンツ解説",         en: "Deep Content Explainer" },
    "task.daily-research-brief": { ja: "デイリーリサーチブリーフィング",   en: "Daily Research Briefing" },
    "task.notes-to-docs":        { ja: "ノートから構造化ドキュメントへ",  en: "Notes to Structured Documents" },
    "task.tech-news-digest":     { ja: "テックニュース厳選まとめ",       en: "Daily Tech News Curated Digest" },
    "task.ai-paper-reader":      { ja: "AI論文スピードリーダー",         en: "AI Paper Speed Reader" },
    "task.reference-formatter":  { ja: "参考文献フォーマッター",         en: "Reference Citation Formatter" },
    "task.night-companion":      { ja: "深夜の感情サポート",            en: "Late-Night Emotional Companion" },
    "task.lazy-trip-planner":    { ja: "おまかせ週末旅行プラン",         en: "Lazy Weekend Trip Planner" },
    "task.daily-horoscope":      { ja: "毎日の星座占いガイド",           en: "Daily Horoscope Action Guide" },
    "task.tarot-reading":        { ja: "タロットカードリーディング",      en: "Fun Tarot Card Reading" },
    "task.birthday-fortune":     { ja: "誕生日運勢占い",               en: "Birthday Fortune Fun Reading" },
    "task.mbti-match":           { ja: "MBTI相性分析",                en: "MBTI Compatibility Analysis" },
    "task.movie-recommender":    { ja: "映画＆ドラマおすすめ",           en: "Movie & Show Recommender" },
    "task.daily-workout":        { ja: "毎日のワークアウトプラン",       en: "Daily Workout Planner" },
    "task.meal-recommender":     { ja: "毎日の食事おすすめ",            en: "Daily Meal Recommender" },
    "task.workout-adjust":       { ja: "トレーニングプラン調整",         en: "Workout Plan Adjuster" },
    "task.goal-checkin":         { ja: "目標分解＆デイリーチェックイン",   en: "Goal Breakdown & Daily Check-in" },
    "task.habit-tracker":        { ja: "21日間習慣トラッカー",           en: "21-Day Habit Builder & Tracker" },
    "task.weather-outfit":       { ja: "天気＆コーデアドバイス",          en: "Weather & Outfit Advisor" },
    "task.auto-social-content":  { ja: "SNSコンテンツ自動作成",          en: "Auto Social Media Content Creator" },
    "task.video-script":         { ja: "動画スクリプト生成",             en: "Video Script Generator" },
    "task.content-repurpose":    { ja: "マルチプラットフォーム変換",      en: "Cross-Platform Content Repurpose" },
    "task.economic-data":        { ja: "経済データエクスプローラー",      en: "Economic Data Explorer" },
    "task.personal-finance":     { ja: "パーソナルファイナンスアドバイザー", en: "Personal Finance Advisor" },
    "task.smart-spending":       { ja: "スマート支出オプティマイザー",    en: "Smart Spending Optimizer" },
    "task.point-maximizing":     { ja: "楽天ポイント最大化",            en: "Rakuten Point Maximizer" },
    "task.weekly-grocery":       { ja: "毎週の食料品自動補充",           en: "Weekly Grocery Auto-Refill" },
    "task.price-watch":          { ja: "楽天商品価格ウォッチ",           en: "Rakuten Product Price Watch" },
    "task.merchant-onboarding":  { ja: "楽天出店サポート",              en: "Rakuten Merchant Onboarding" },
    "task.product-image-editor": { ja: "商品画像AIエディター",           en: "Merchant Product Image Editor" },
    "task.affiliate-signup":     { ja: "楽天アフィリエイト登録",         en: "Rakuten Affiliate Sign-Up" },
    "task.refund-tracking":      { ja: "返金トラッキング",              en: "Customer Support Refund Tracker" },
    "task.golf-booking":         { ja: "ゴルフ学習＆予約",              en: "Golf Learning & Booking" },
    "task.wine-restaurant":      { ja: "ワイン＆レストラン予約",         en: "Wine Tasting & Restaurant Booking" },
    "task.horse-betting":        { ja: "競馬インサイト＆ベッティング",    en: "Horse Racing Insights & Betting" },
    "task.sport-fan-news":       { ja: "スポーツファンニュース",          en: "Sport Fan News Feed" },
    "task.oshikatsu-news":       { ja: "推し活ニュース",                en: "Oshikatsu Idol & Creator News" },
    "task.fashion-trend":        { ja: "ファッショントレンドレポート",     en: "Fashion Styling Trend Report" },
    "task.salon-planning":       { ja: "サロンビューティーデー予約",      en: "Salon Treat Day Planning" },
    "task.insurance-compare":    { ja: "保険プラン比較",                en: "Insurance Plan Comparison" },
    "task.jp-rirekisho":         { ja: "履歴書フォーマット",             en: "Rirekisho Format" },
    "task.jp-keigo-check":       { ja: "敬語チェック",                  en: "Keigo Tone Check" },
    "task.jp-mock-interview":    { ja: "模擬面接エージェント",           en: "Agent Mock Interview" },
    "task.jp-es-generator":      { ja: "エントリーシート作成",           en: "ES Generator" },
    "task.jp-juminhyo":          { ja: "住民票ガイド",                  en: "住民票 Guide" },
    "task.jp-kakutei-shinkoku":  { ja: "確定申告ガイド",                en: "確定申告 Tax Filing" },
    "task.jp-shiyakusho":        { ja: "市役所手続きヘルパー",           en: "市役所 Request Helper" },
    "task.jp-visa-residency":    { ja: "ビザ＆在留ガイド",              en: "Visa & Residency Guide" },
    "task.jp-train-delays":      { ja: "電車遅延アシスタント",           en: "Train Delay Assistant" },
    "task.jp-konbini-meals":     { ja: "コンビニ食事プラン",             en: "Konbini Meal Planning" },
    "task.jp-gift-etiquette":    { ja: "贈り物マナーガイド",             en: "Gift Etiquette (贈り物)" },
    "task.jp-seasonal-tasks":    { ja: "季節イベントガイド",             en: "Seasonal Tasks Guide" },
    "task.jp-business-keigo":    { ja: "ビジネス敬語ライター",           en: "Business Keigo Writer" },
    "task.jp-line-tone":         { ja: "LINEメッセージトーンチェック",    en: "LINE Message Tone Check" },
    "task.jp-apology-letter":    { ja: "お詫び状作成",                  en: "Apology Letter (お詫び状)" },
    "task.jp-nengajo":           { ja: "年賀状＆グリーティングカード",    en: "Nengajo / Greeting Cards" },

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
    var options = document.querySelectorAll(".lang-option");
    for (var j = 0; j < options.length; j++) {
      options[j].classList.toggle("active", options[j].dataset.lang === currentLang);
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
