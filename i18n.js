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
    "calendar.month.0":         { ja: "1月",  en: "January" },
    "calendar.month.1":         { ja: "2月",  en: "February" },
    "calendar.month.2":         { ja: "3月",  en: "March" },
    "calendar.month.3":         { ja: "4月",  en: "April" },
    "calendar.month.4":         { ja: "5月",  en: "May" },
    "calendar.month.5":         { ja: "6月",  en: "June" },
    "calendar.month.6":         { ja: "7月",  en: "July" },
    "calendar.month.7":         { ja: "8月",  en: "August" },
    "calendar.month.8":         { ja: "9月",  en: "September" },
    "calendar.month.9":         { ja: "10月", en: "October" },
    "calendar.month.10":        { ja: "11月", en: "November" },
    "calendar.month.11":        { ja: "12月", en: "December" },
    "calendar.everyWeek":       { ja: "毎週",            en: "Every " },
    "calendar.at":              { ja: " ",               en: " at " },

    /* ─── Calendar events ─── */
    "calEv.e1.title":           { ja: "週報チェック",            en: "Weekly Report Check" },
    "calEv.e1.summary":         { ja: "LineとTeamsによる週報の自動コンプライアンスチェック。", en: "Automated compliance check of weekly reports via Line and Teams." },
    "calEv.e2.title":           { ja: "デイリーニュースまとめ",    en: "Daily News Digest" },
    "calEv.e2.summary":         { ja: "毎朝の自動キュレーションニュースブリーフィング。", en: "Auto-curated morning news briefing." },
    "calEv.e5.title":           { ja: "週次スプリントレビュー",    en: "Weekly Sprint Review" },
    "calEv.e5.summary":         { ja: "ステークホルダーに送信されるスプリントレビューサマリー。", en: "Sprint review summary sent to stakeholders." },
    "calEv.e6.title":           { ja: "ディナー予約",            en: "Dinner reservation" },
    "calEv.e6.summary":         { ja: "Osteria Francescana、4名、19:30。", en: "Table for 4 at Osteria Francescana, 7:30 PM." },
    "calEv.e7.title":           { ja: "提案書締切",              en: "Proposal deadline" },
    "calEv.e7.summary":         { ja: "VPエンジニアリングへ最終提案書を提出。", en: "Submit final proposal to VP Engineering." },
    "calEv.e9.title":           { ja: "母の誕生日プレゼント",     en: "Mom's birthday gift" },
    "calEv.e9.summary":         { ja: "18時までにお店でプレゼントを受け取る。", en: "Pick up gift from store before 6 PM." },
    "calEv.e10.title":          { ja: "確定申告締切",            en: "Tax filing deadline" },
    "calEv.e10.summary":        { ja: "年次確定申告の提出を完了する。", en: "Complete and submit annual tax return." },

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
    "connModal.desc":           { ja: "外部サービスをチャットに接続します。まず認証し、次に現在の会話に追加してください。", en: "Connect external services to your chat. Authorize first, then add to the current conversation." },
    "connModal.authorize":      { ja: "認証する",        en: "Authorize" },
    "connModal.authorized":     { ja: "認証済み ✓",      en: "Authorized ✓" },
    "connModal.addToChat":      { ja: "チャットに追加",   en: "Add to chat" },
    "connModal.added":          { ja: "追加済み ✓",      en: "Added ✓" },
    "connModal.authSignIn":     { ja: "{0} にログイン",   en: "Sign in to {0}" },
    "connModal.authDesc":       { ja: "Rakuten AI が {0} アカウントにアクセスすることを許可します。いつでもアクセスを取り消せます。", en: "Authorize Rakuten AI to access your {0} account. You can revoke access at any time." },
    "connModal.authEmail":      { ja: "メールアドレスまたはユーザー名", en: "Email or username" },
    "connModal.authPassword":   { ja: "パスワード",       en: "Password" },
    "connModal.authSubmit":     { ja: "認証して続行",     en: "Authorize & Continue" },
    "connModal.authFooter":     { ja: "続行すると、Rakuten AI とアカウントデータを共有することに同意したことになります。", en: "By continuing, you agree to share account data with Rakuten AI." },
    "connModal.authorizing":    { ja: "認証中...",        en: "Authorizing..." },

    /* ─── Connector descriptions ─── */
    "conn.gmail.desc":          { ja: "Googleアカウントでメールの読み書きができます。", en: "Read and send email via your Google account." },
    "conn.google-calendar.desc":{ ja: "Googleカレンダーのイベントを作成・表示します。", en: "Create and read events from Google Calendar." },
    "conn.ms-teams.desc":       { ja: "MS Teamsでメッセージ送信やチャンネル管理ができます。", en: "Send messages and manage channels in MS Teams." },
    "conn.ms-outlook.desc":     { ja: "Outlookでメール、連絡先、カレンダーにアクセスします。", en: "Access mail, contacts and calendar via Outlook." },
    "conn.ms-calendar.desc":    { ja: "Microsoft Calendarのイベントをスケジュール・表示します。", en: "Schedule and read events from Microsoft Calendar." },
    "conn.line.desc":           { ja: "Line Messengerでメッセージの送受信ができます。", en: "Send and receive messages through Line Messenger." },
    "conn.viber.desc":          { ja: "Viberメッセージングプラットフォームで通信します。", en: "Communicate through Viber messaging platform." },
    "conn.instagram.desc":      { ja: "Instagramにコンテンツを投稿し、アカウントを管理します。", en: "Post content and manage your Instagram account." },
    "conn.facebook.desc":       { ja: "Facebookのページとメッセージを管理します。", en: "Manage pages and messages on Facebook." },
    "conn.x-twitter.desc":      { ja: "X（旧Twitter）に投稿・閲覧します。", en: "Post and read on X (formerly Twitter)." },
    "conn.canva.desc":          { ja: "Canvaでデザインを作成し、アセットをエクスポートします。", en: "Create designs and export assets from Canva." },
    "conn.figma.desc":          { ja: "Figmaのデザインにアクセスし、アセットをエクスポートします。", en: "Access Figma designs and export assets." },

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
    "task.jp-trip-planner":      { ja: "出張コンパニオン",              en: "Business Trip Companion" },
    "task.jp-nengajo":           { ja: "年賀状＆グリーティングカード",    en: "Nengajo / Greeting Cards" },

    /* ─── Task descriptions ─── */
    "desc.case-email-todo":      { ja: "Outlookの受信トレイをスキャンし、アクション項目を抽出・優先度分類。空き時間を見つけてカレンダーに集中ブロックを自動予約します。", en: "Scans your Outlook inbox, extracts actionable items, classifies them by urgency, builds a prioritized checklist, then finds a free calendar slot and books focused time to handle them." },
    "desc.case-receipt-bill":    { ja: "Outlookからレシート・請求書・サブスクメールを検索。金額や請求サイクルを抽出し、解約リンクや代行メールを提供します。", en: "Searches Outlook for receipts, invoices, and subscription emails. Extracts merchant names, amounts, and billing cycles, then identifies still-active services and provides cancellation links." },
    "desc.case-weekly-report":   { ja: "チームメンバーの週報提出状況を自動確認。Lineで上司に報告後、未提出者にTeamsでリマインドを送信します。", en: "Runs on a schedule to verify whether each team member has submitted their weekly report. Sends a summary to the manager via Line, then nudges anyone who hasn't submitted through Teams." },
    "desc.daily-news-digest":    { ja: "毎朝、主要ニュースやRSSフィードからトレンドトピックを収集・分類。要点をまとめたダイジェストをメールやLineで配信します。", en: "Aggregates trending topics from major news sources every morning, classifies stories by category, generates a concise digest with key takeaways, and delivers it via email or Line." },
    "desc.invoice-filing":       { ja: "受信トレイから請求書やレシートを収集し、主要項目を抽出。経費を自動分類し、月末精算用のスプレッドシートにまとめます。", en: "Collects scattered invoices and receipts from your inbox, extracts key fields, auto-categorizes expenses, and organizes them into a structured spreadsheet for reimbursement." },
    "desc.schedule-tracker":     { ja: "カレンダーとタスクリストに接続し、締切を監視。期限前にリマインダーを送信し、遅延タスクをアラートします。", en: "Connects to your calendar and task list, monitors deadlines and progress, sends timely reminders before due dates, and alerts you when tasks fall behind schedule." },
    "desc.one-click-doc":        { ja: "トピックを入力するだけで、見出し・箇条書き・書式付きの構造化ドキュメントを自動生成。即座に共有可能です。", en: "Give it a topic and it generates a well-structured document with headings, bullet points, and formatting — ready to share." },
    "desc.auto-spreadsheet":     { ja: "必要なデータを説明するだけで、数式・チャート・ピボット対応のExcelスタイルのスプレッドシートを自動作成します。", en: "Describe what data you need and the agent builds an Excel-style spreadsheet with formulas, charts, and pivot-ready layout." },
    "desc.file-diff":            { ja: "フォルダ内の重複・類似ファイルをスキャンし、差分を並べて表示。トピック別に分類し、残すべきファイルを提案します。", en: "Scans folders for duplicate or near-duplicate files, highlights differences side by side, auto-categorizes documents, and suggests which copies to keep." },
    "desc.knowledge-base":       { ja: "ウェブクリッピング、ドキュメント、メモをWiki形式のナレッジベースに集約。カテゴリを自動生成し、関連トピックをリンクします。", en: "Aggregates web clippings, documents, and notes into a structured wiki-style knowledge base with auto-generated categories and cross-links." },
    "desc.startup-validation":   { ja: "ビジネスアイデアを市場規模・競合・コスト構造・リスク分析のフレームワークで素早く検証。簡潔な実現性レポートを作成します。", en: "Takes your business idea through a rapid validation framework — analyzing market size, competitor landscape, cost structure, and risk factors." },
    "desc.market-research":      { ja: "フォーラム、レビュー、SNSをクロールし、ターゲット市場の未充足ニーズや不満を特定。根拠リンク付きのレポートを作成します。", en: "Crawls forums, reviews, and social media to identify unmet needs and recurring complaints in your target market." },
    "desc.kpi-dashboard":        { ja: "データソースに接続し、主要ビジネス指標のダッシュボードを自動生成。異常値やトレンドをハイライトします。", en: "Connects to your data sources, auto-generates visual dashboards for key business metrics, and highlights anomalies and trends." },
    "desc.study-planner":        { ja: "試験日、利用可能な時間、科目の難易度に基づいて個別の学習スケジュールを作成。遅れた場合はペースを自動調整します。", en: "Creates a personalized study schedule based on your exam date, available hours, and subject difficulty." },
    "desc.study-checkin":        { ja: "学習目標をデイリーマイクロタスクに分解し、リマインダーを送信。連続記録と達成率を追跡し、明日の負荷を自動調整します。", en: "Breaks your learning goal into daily micro-tasks, sends check-in reminders, tracks streak and completion rate, and adapts load." },
    "desc.knowledge-map":        { ja: "教材やテキストの概要を読み取り、概念と関係の骨格マップを生成。乱雑なメモを構造化された知識ツリーに変換します。", en: "Reads your study material and produces a clear concept-relationship skeleton map — turning messy notes into a structured knowledge tree." },
    "desc.deep-explainer":       { ja: "難しい概念をステップバイステップで分解。類似例を見つけ、前提知識を提案し、理解を深める練習問題を提供します。", en: "Breaks down tough concepts step by step, finds analogies, suggests prerequisite knowledge, and offers practice problems." },
    "desc.daily-research-brief": { ja: "arXiv、PubMed、業界ブログを毎日監視し、関心トピックの論文タイトル・主要発見・関連度スコア付きブリーフィングを配信します。", en: "Monitors arXiv, PubMed, and industry blogs daily, delivering a curated briefing with paper titles, key findings, and relevance scores." },
    "desc.notes-to-docs":        { ja: "ブックマーク、メモ、記事リンクを読み込み、要点を抽出。冗長性を排除し、セクション・要約・出典引用付きのドキュメントを出力します。", en: "Reads bookmarks, raw notes, or article links, extracts key points, removes redundancy, and outputs a well-organized document." },
    "desc.tech-news-digest":     { ja: "Hacker News、TechCrunch等からトップ記事を集約。関心トピックでフィルタリングし、毎朝1ページのダイジェストを配信します。", en: "Aggregates top stories from Hacker News, TechCrunch, The Verge, and curated RSS feeds. Filters by your interests and delivers a one-page digest." },
    "desc.ai-paper-reader":      { ja: "arXiv URLや論文タイトルを貼り付けると、全文を読み解き、コア貢献・手法・結果・限界を抽出。関連研究と比較します。", en: "Paste an arXiv URL or paper title and the agent reads the full text, extracts the core contribution, methodology, results, and compares with related work." },
    "desc.reference-formatter":  { ja: "未整理の引用やDOIリンクを、選択したフォーマット（APA、MLA等）に正規化。重複検出、並び替え、クリーンな参考文献リストを出力します。", en: "Paste raw citations or DOI links and the agent normalizes them into your chosen format (APA, MLA, Chicago, IEEE)." },
    "desc.night-companion":      { ja: "静かな深夜のひとときに寄り添う会話パートナー。あなたの思いに耳を傾け、心落ち着くアクティビティを提案します。", en: "A gentle conversational companion for quiet late-night moments. Listens to your thoughts, offers comforting words, and suggests calming activities." },
    "desc.lazy-trip-planner":    { ja: "場所、予算、好みの雰囲気を伝えるだけで、完全な日帰り・週末プランを作成。スポット、ルート、レストラン、所要時間を含みます。", en: "Tell it your location, budget, and vibe preferences and it generates a complete day-trip or weekend plan." },
    "desc.daily-horoscope":      { ja: "毎朝、星座に基づくパーソナライズされた運勢を生成。仕事、人間関係、ラッキーポイントについて具体的なアドバイスを提供します。", en: "Every morning, generates a personalized horoscope based on your zodiac sign with specific, actionable advice for the day." },
    "desc.tarot-reading":        { ja: "小さな悩みに。バーチャルタロットカードを引いて、軽やかな解釈と穏やかなアドバイスをお届けします。楽しみと内省のために。", en: "Having a small dilemma? Draw a virtual tarot card spread and get a lighthearted interpretation with gentle advice." },
    "desc.birthday-fortune":     { ja: "生年月日と時刻を入力すると、東洋と西洋の伝統を融合した文化的リーディングを提供。星座、五行分析、性格特性を楽しく解説します。", en: "Enter your birth date and time to unlock a fun cultural reading blending Eastern and Western traditions." },
    "desc.mbti-match":           { ja: "2つのMBTIタイプを入力すると、詳細な相性分析を提供。コミュニケーションスタイル、摩擦ポイント、関係アドバイスを含みます。", en: "Input two MBTI types and get a detailed compatibility breakdown — communication style match, potential friction points, and relationship advice." },
    "desc.movie-recommender":    { ja: "気分やジャンルの好みを伝えると、評価、ストリーミング先、予告編付きの厳選おすすめを提供します。", en: "Describe your mood or genre preference and get curated recommendations with ratings, where to stream, and trailers." },
    "desc.daily-workout":        { ja: "フィットネスレベル、器具、目標に基づいて明日の運動プランを生成。リマインダー送信とフィードバックに基づく強度調整も行います。", en: "Generates tomorrow's exercise plan based on your fitness level, available equipment, and goals." },
    "desc.meal-recommender":     { ja: "味覚、食事制限、現在地を入力。栄養情報付きの食事推薦、近くのレストラン、レシピを提供します。", en: "Report your taste, dietary needs, and location. The agent recommends meals with nutrition info, nearby restaurants, and recipes." },
    "desc.workout-adjust":       { ja: "トレーニングプランが乱れた時に、残りのセッションを再編成。ボリュームを再配分し、目標達成に向けた更新スケジュールを作成します。", en: "Fell off your training plan? The agent reshuffles your remaining sessions, redistributes volume, and creates an updated schedule." },
    "desc.goal-checkin":         { ja: "大きな目標を小さなデイリーステップに分解。マイルストーンロードマップを作成し、進捗を可視化。モチベーションアップのナッジも送信します。", en: "Turn a big goal into small daily steps. Creates a milestone roadmap, tracks daily check-ins, and visualizes progress." },
    "desc.habit-tracker":        { ja: "身につけたい習慣を選び、21日間チャレンジを開始。リマインダー、連続記録、進捗チャート、リカバリーティップス付き。", en: "Pick a habit to build. The agent sets up a 21-day challenge with daily reminders, streak tracking, and recovery tips." },
    "desc.weather-outfit":       { ja: "リアルタイム天気（気温、湿度、風、AQI）と7日間予報。天候に合わせた服装を提案し、悪天候前にアラートを送信します。", en: "Real-time weather with temperature, humidity, wind, and AQI — plus a 7-day forecast. Suggests what to wear and alerts you to extreme weather." },
    "desc.auto-social-content":  { ja: "ニッチとプラットフォームを選択。トピック選定からコピーライティング、ハッシュタグ最適化まで、投稿可能なコンテンツを自動生成します。", en: "Pick your niche and platform. The agent handles everything from topic selection to copywriting and hashtag optimization." },
    "desc.video-script":         { ja: "動画のトピックとターゲットを入力。フック、シーン構成、トークポイント、CTA配置を最適化したスクリプトを生成します。", en: "Describe your video topic and target audience. Generates a hook-driven script with scene breakdowns and talking points." },
    "desc.content-repurpose":    { ja: "長文記事や動画のトランスクリプトを入力。ツイート、Instagramカルーセル、LinkedInポスト、ショート動画用フックに自動変換します。", en: "Feed it a long article or video transcript and it splits the content into platform-optimized snippets for multiple platforms." },
    "desc.economic-data":        { ja: "GDP、金利、CPI、失業率など、各国のマクロ指標を照会。チャート、トレンド分析、わかりやすい要約を返します。", en: "Query GDP, interest rates, CPI, unemployment, and other macro indicators. Returns clean charts, trend analysis, and plain-language summaries." },
    "desc.personal-finance":     { ja: "銀行口座と支出データに接続し、取引を分類・分析。パーソナライズされた節約ティップス、予算予測、投資提案を提供します。", en: "Connects to your bank feeds and spending data, categorizes transactions, analyzes spending patterns, and delivers personalized savings tips." },
    "desc.smart-spending":       { ja: "楽天ペイ/カードに接続し、支出パターンを分析。より安い代替品の推薦、クーポン適用、週次支出サマリーを生成します。", en: "Connects to Rakuten Pay / Card, categorizes transactions, analyzes spending patterns, recommends cheaper alternatives, and applies coupons." },
    "desc.point-maximizing":     { ja: "楽天ポイント残高と有効期限を追跡。SPUキャンペーンを検出し、最適な購入タイミングとポイント活用方法を提案します。", en: "Tracks your Rakuten points balance & expiry, detects active SPU campaigns, suggests optimal purchase timing, and recommends the best redemption options." },
    "desc.weekly-grocery":       { ja: "消費履歴を追跡し、補充ニーズを予測。カートを生成し、価格比較・クーポン適用・配送スケジューリングまで自動化します。", en: "Tracks your consumption history, predicts refill needs, generates a cart, compares prices, applies coupons, and schedules delivery." },
    "desc.price-watch":          { ja: "気になる商品を保存し、価格変動を追跡。キャンペーン割引を検出し、最適な購入タイミングで通知します。", en: "Save products you're eyeing, track price changes over time, monitor campaign discounts, detect the best purchase window, and get notified." },
    "desc.merchant-onboarding":  { ja: "楽天市場への出店プロセスをガイド。フォーム提出、書類確認、カテゴリ設定、価格戦略、ストアフロント生成まで対応します。", en: "Guides merchants through the onboarding process — submit forms, verify documents, assign categories, suggest pricing strategy, and launch the store." },
    "desc.product-image-editor": { ja: "商品画像をAIで品質向上。バリエーション・ライフスタイルシーン生成、A/Bテスト、楽天リスティングへの直接公開をサポートします。", en: "Upload product images, enhance quality with AI, generate variations and lifestyle scenes, A/B test thumbnails, and publish to your Rakuten listing." },
    "desc.affiliate-signup":     { ja: "アフィリエイト申請をガイドし、最適なカテゴリを分析。スターターコンテンツテンプレート生成とパフォーマンス追跡を設定します。", en: "Walks you through affiliate application, analyzes your profile for best-fit categories, generates starter content templates, and sets up tracking." },
    "desc.refund-tracking":      { ja: "返金リクエストを提出し、適格性を検証。販売者と調整し、リアルタイムの状況更新を追跡。完了時に通知します。", en: "Submit a refund request, validate eligibility, coordinate with the merchant, track real-time status updates, and confirm completion." },
    "desc.golf-booking":         { ja: "スキルレベルを評価し、レッスンやドリルを推薦。楽天GORAでコース予約、ラウンド結果の記録も行います。", en: "Assesses your skill level, recommends lessons and drills, suggests courses, books tee times via Rakuten GORA, and logs round results." },
    "desc.wine-restaurant":      { ja: "味の好みを記録し、ワインイベントやダイニング会場を推薦。予約手配からレビュー収集、次の体験提案まで対応します。", en: "Captures your taste preferences, recommends wine events and dining venues, books reservations, and suggests the next experience." },
    "desc.horse-betting":        { ja: "楽天競馬のレース情報を表示。馬と騎手のデータ分析、賭け選択支援、ライブ結果追跡、残高更新を自動で行います。", en: "Shows upcoming Rakuten Keiba races, provides data-driven insights, helps select bets, tracks live results, and updates your balance." },
    "desc.sport-fan-news":       { ja: "お気に入りのチームや選手を選択し、スポーツニュースを集約。スコアや移籍のリアルタイム更新を配信します。", en: "Select your favorite teams, aggregate news, push real-time updates for scores and transfers, and link to Rakuten merch and tickets." },
    "desc.oshikatsu-news":       { ja: "推しのアイドルやクリエイターを選択し、SNSや公式チャンネルから更新を集約。イベントやリリースを通知します。", en: "Select your favorite idols and creators, aggregate updates across social media and official channels, and notify you of events and releases." },
    "desc.fashion-trend":        { ja: "スタイルの好みを分析し、シーズンのトレンドレポートを生成。購入リンク付きのコーディネート推薦やバーチャル試着プレビューを提供します。", en: "Analyzes your style preferences, generates seasonal trend reports, recommends outfits with shoppable links, and enables virtual try-on." },
    "desc.salon-planning":       { ja: "空き状況を検出し、楽天ビューティーでサロン・サービスを推薦。トリートメントをバンドルし、予約を最適化します。", en: "Detects your availability, recommends salons and services on Rakuten Beauty, bundles treatments, and books appointments." },
    "desc.insurance-compare":    { ja: "要件を入力すると、楽天保険からプランを取得。補償内容を並べて比較し、最適なプランを推薦。申込みフローまで案内します。", en: "Input your requirements, fetch policy options from Rakuten Insurance, compare coverage side-by-side, and recommend the best-fit plan." },
    "desc.jp-rirekisho":         { ja: "日本標準の履歴書を自動入力・フォーマット。詳細を入力するだけで、印刷・PDF出力対応の完璧な履歴書が完成します。", en: "Auto-fill and format a Japan-standard CV (履歴書). Input your details and get a perfectly formatted rirekisho." },
    "desc.jp-keigo-check":       { ja: "カバーレターやビジネスメールを完璧なビジネス日本語に仕上げます。カジュアルな表現を検出し、適切な敬語レベルに書き換えます。", en: "Polish cover letters and business emails to perfect business Japanese. Detects casual expressions and rewrites them with appropriate keigo." },
    "desc.jp-mock-interview":    { ja: "自己PRと志望動機をAIフィードバック付きで練習。日本の就活面接シナリオをシミュレートし、改善提案を提供します。", en: "Practice 自己PR and 志望動機 with AI feedback. Simulates real Japanese job interview scenarios." },
    "desc.jp-es-generator":      { ja: "エントリーシートの8つの一般的な質問タイプに対応したドラフトを自動生成。経験と志望企業に基づいてカスタマイズします。", en: "Draft entry sheets for the 8 most common question types. Generates tailored answers based on your experience and target company." },
    "desc.jp-juminhyo":          { ja: "住民票取得のステップバイステップガイド。必要書類、区役所の手続き、外国人居住者向けの注意点をカバーします。", en: "Step-by-step guide to getting your residence certificate. Covers required documents, ward office procedures, and common pitfalls." },
    "desc.jp-kakutei-shinkoku":  { ja: "フリーランスや会社員向けの確定申告ウォークスルー。フォーム、控除、e-Tax提出をステップバイステップでガイドします。", en: "Tax filing walkthrough for freelancers and employees in Japan. Guides you through forms, deductions, and e-Tax submission." },
    "desc.jp-shiyakusho":        { ja: "区役所の各フォームが何を求めているかを日本語と英語でわかりやすく翻訳。市町村の書類を正しく記入できるようサポートします。", en: "Translates what each ward office form requires in plain Japanese and English. Helps you fill out municipal paperwork correctly." },
    "desc.jp-visa-residency":    { ja: "外国人居住者向けのビザ・在留ガイド。ビザ更新、在留資格変更、在留カード手続き、入管ナビゲーションをカバーします。", en: "Step-by-step visa and residency guidance. Covers visa renewal, status changes, residence card procedures, and immigration office navigation." },
    "desc.jp-train-delays":      { ja: "電車遅延時の代替ルートを即座に提案。雇用主向けの遅延証明書（遅延証明書）の自動生成も行います。", en: "Instant alternate route suggestions when trains are delayed, plus automatic delay certificate generation for your employer." },
    "desc.jp-konbini-meals":     { ja: "コンビニ商品を活用した週間ミールプラン。セブン-イレブン、ローソン、ファミマの商品で栄養、予算、味のバランスを取ります。", en: "Weekly meal suggestions built from convenience store items. Balances nutrition, budget, and taste using products from major konbini chains." },
    "desc.jp-trip-planner":      { ja: "日本国内出張の完全コンパニオン — 荷造りチェックリストから新幹線予約、経費精算まで、8つの統合機能でサポートします。", en: "The complete business trip companion — 8 integrated features covering every stage of a Japanese domestic business trip, from packing to expense reports." },
    "desc.jp-gift-etiquette":    { ja: "場面や関係性に応じた適切な贈り物を推薦。お中元、お歳暮、結婚祝い、引越し祝い、ビジネスギフトの慣習をカバーします。", en: "Recommends appropriate gifts based on occasion and relationship. Covers お中元, お歳暮, wedding gifts, and business gift-giving customs." },
    "desc.jp-seasonal-tasks":    { ja: "花見スポット、祭りスケジュール、地域別おみやげ推薦など、日本の四季を通じた季節イベントガイド。", en: "Covers hanami spots, matsuri schedules, omiyage recommendations by region, and other seasonal activities throughout the Japanese calendar year." },
    "desc.jp-business-keigo":    { ja: "カジュアルなメッセージをビジネスシーンに適した敬語に書き換え。メール、Slack、公式文書に対応し、適切な丁寧さレベルをサポートします。", en: "Rewrites casual messages in appropriate keigo for business contexts. Supports emails, Slack messages, and formal documents." },
    "desc.jp-line-tone":         { ja: "LINEメッセージのトーンが冷たすぎないか、カジュアルすぎないかをチェック。上司、先輩、友人などの相手に合わせたトーン調整を提案します。", en: "Checks if a LINE message sounds too cold or too casual for the context. Suggests tone adjustments for different relationships." },
    "desc.jp-apology-letter":    { ja: "日本のビジネス慣習に従った正式なお詫び状を作成。納品遅延、サービス問題、会議キャンセルなどの状況に対応します。", en: "Drafts formal apologies for business situations following Japanese conventions. Covers delivery delays, service issues, and more." },
    "desc.jp-nengajo":           { ja: "連絡先ごとにパーソナライズされた季節の挨拶をAIで作成。年賀状、暑中見舞いなど、適切なフォーマリティレベルで生成します。", en: "AI-written seasonal greetings personalized for each contact. Generates nengajo, summer greetings, and other cards with appropriate formality." },

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
