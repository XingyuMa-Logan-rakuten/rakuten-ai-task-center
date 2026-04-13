/** Task / user-case catalog — organized by category */

window.TASK_CATEGORIES = [
  { id: "all", label: "All Ideas" },
  { id: "office", label: "Office Productivity" },
  { id: "research", label: "Research & Learning" },
  { id: "entertainment", label: "Entertainment" },
  { id: "lifestyle", label: "Self-Discipline & Life" },
  { id: "social-media", label: "Social Media & Marketing" },
  { id: "finance", label: "Finance" },
];

window.TASK_CATALOG = [
  /* ═══════════════════════ Office Productivity ═══════════════════════ */
  {
    id: "case-email-todo",
    title: "Email Todo Analysis & Calendar Scheduling",
    category: "office",
    description:
      "Scans your Outlook inbox, extracts actionable items, classifies them by urgency, builds a prioritized checklist, then finds a free calendar slot and books focused time to handle them — all in one automated flow.",
    type: "multi-step",
    typeTags: ["Productivity", "Schedulable"],
    sampleQueries: [
      "Find the email tasks I need to handle this week and schedule time on my calendar.",
      "Extract all todo items from my Outlook emails and create a checklist.",
    ],
    connectors: ["Outlook", "MS Calendar"],
    cover: "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=640&h=360&fit=crop",
    userFlowUrl: "task-execution.html?task=case-email-todo",
    featured: true,
  },
  {
    id: "case-receipt-bill",
    title: "Receipt & Subscription Audit",
    category: "office",
    description:
      "Searches Outlook for receipts, invoices, and subscription emails within a chosen period. Extracts merchant names, amounts, and billing cycles, then identifies still-active services and provides cancellation links or drafts opt-out emails on your behalf.",
    type: "multi-step",
    typeTags: ["Email Analysis", "Subscription Audit", "Schedulable"],
    sampleQueries: [
      "Find all receipt and bill-related emails from the past 3 months.",
      "Analyze which software services are still charging me.",
    ],
    connectors: ["Outlook"],
    cover: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=640&h=360&fit=crop",
    userFlowUrl: "task-execution.html?task=case-receipt-bill",
    featured: true,
  },
  {
    id: "case-weekly-report",
    title: "Weekly Report Check & Reminder",
    category: "office",
    description:
      "Runs on a schedule to verify whether each team member has submitted their weekly report in Outlook. Sends a submission summary to the manager via Line, waits for confirmation, then automatically nudges anyone who hasn't submitted through Teams direct messages.",
    type: "schedule",
    typeTags: ["Multi-step", "Human-in-the-loop"],
    sampleQueries: [
      "Check every Friday afternoon whether my team members have submitted their weekly reports.",
      "Run this check every week and remind stragglers on Teams after my Line confirmation.",
    ],
    connectors: ["Outlook", "Line", "MS Teams"],
    cover: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=640&h=360&fit=crop",
    userFlowUrl: "task-execution.html?task=case-weekly-report",
    featured: true,
  },
  {
    id: "daily-news-digest",
    title: "Daily Hot News Auto-Digest",
    category: "office",
    description:
      "Runs every morning on a schedule, aggregating trending topics from major news sources and RSS feeds. Classifies stories by category, generates a concise digest with key takeaways, and delivers it via email or Line so you start the day informed.",
    type: "schedule",
    typeTags: ["Scheduled", "News"],
    sampleQueries: [
      "Send me a daily news summary at 8 AM covering tech and business.",
      "Create an automated news digest that runs every weekday morning.",
    ],
    connectors: ["Gmail", "Line"],
    cover: "https://images.unsplash.com/photo-1504711434969-e33886168d6c?w=640&h=360&fit=crop",
    userFlowUrl: "task-execution.html?task=daily-news-digest",
    featured: true,
  },
  {
    id: "invoice-filing",
    title: "Invoice & Receipt Smart Filing",
    category: "office",
    description:
      "Collects scattered invoices and receipts from your inbox, extracts key fields (vendor, amount, date, tax), auto-categorizes expenses, and organizes them into a structured spreadsheet ready for month-end reimbursement.",
    type: "multi-step",
    typeTags: ["Finance", "Automation"],
    sampleQueries: [
      "Collect all my invoices from this month and organize them into a spreadsheet.",
      "Extract amounts and vendors from my receipt emails for reimbursement.",
    ],
    connectors: ["Outlook", "Google Calendar"],
    cover: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=640&h=360&fit=crop",
    userFlowUrl: "task-execution.html?task=invoice-filing",
  },
  {
    id: "schedule-tracker",
    title: "Schedule Tracking & Smart Reminders",
    category: "office",
    description:
      "Connects to your calendar and task list, monitors deadlines and progress, sends timely reminders before due dates, and alerts you when tasks fall behind schedule — keeping your day on track automatically.",
    type: "schedule",
    typeTags: ["Productivity", "Reminders"],
    sampleQueries: [
      "Track all my tasks this week and remind me 30 minutes before each deadline.",
      "Monitor my project milestones and alert me when anything falls behind.",
    ],
    connectors: ["Google Calendar", "MS Teams"],
    cover: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=640&h=360&fit=crop",
    userFlowUrl: "task-execution.html?task=schedule-tracker",
  },
  {
    id: "one-click-doc",
    title: "One-Click Document Creation",
    category: "office",
    description:
      "Give it a topic and it generates a well-structured document with headings, bullet points, and formatting — ready to share. Works with online doc platforms for instant collaboration.",
    type: "simple",
    typeTags: ["Docs", "AI Writing"],
    sampleQueries: [
      "Create a project proposal document about our Q3 marketing campaign.",
      "Generate a meeting minutes template from today's agenda.",
    ],
    connectors: [],
    cover: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=640&h=360&fit=crop",
    userFlowUrl: "task-execution.html?task=one-click-doc",
  },
  {
    id: "auto-spreadsheet",
    title: "Auto Data Spreadsheet Generator",
    category: "office",
    description:
      "Describe what data you need and the agent builds an Excel-style spreadsheet with formulas, charts, and pivot-ready layout. Great for quick reports and data visualization.",
    type: "simple",
    typeTags: ["Data", "Spreadsheet"],
    sampleQueries: [
      "Create a sales tracking spreadsheet with monthly totals and a chart.",
      "Build a budget comparison table for Q1 vs Q2.",
    ],
    connectors: [],
    cover: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=640&h=360&fit=crop",
    userFlowUrl: "task-execution.html?task=auto-spreadsheet",
  },
  {
    id: "file-diff",
    title: "Duplicate File Diff & Cleanup",
    category: "office",
    description:
      "Scans folders for duplicate or near-duplicate files, highlights differences side by side, auto-categorizes documents by topic, and suggests which copies to keep — building a clean knowledge map.",
    type: "multi-step",
    typeTags: ["File Management", "Dedup"],
    sampleQueries: [
      "Find duplicate files in my project folder and show me the differences.",
      "Compare these two contract versions and highlight what changed.",
    ],
    connectors: [],
    cover: "https://images.unsplash.com/photo-1618044619888-009e412ff12a?w=640&h=360&fit=crop",
    userFlowUrl: "task-execution.html?task=file-diff",
  },
  {
    id: "knowledge-base",
    title: "Knowledge Base Quick Builder",
    category: "office",
    description:
      "Aggregates web clippings, documents, and notes into a structured wiki-style knowledge base. Auto-generates categories, cross-links related topics, and makes everything searchable for your team.",
    type: "multi-step",
    typeTags: ["Wiki", "Knowledge Mgmt"],
    sampleQueries: [
      "Build a knowledge base from our product documentation folder.",
      "Organize these 20 bookmarked articles into a structured wiki.",
    ],
    connectors: [],
    cover: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=640&h=360&fit=crop",
    userFlowUrl: "task-execution.html?task=knowledge-base",
  },
  {
    id: "startup-validation",
    title: "Startup Idea Feasibility Check",
    category: "office",
    description:
      "Takes your business idea through a rapid validation framework — analyzing market size, competitor landscape, cost structure, and risk factors. Delivers a concise feasibility report so you can decide before investing.",
    type: "multi-step",
    typeTags: ["Strategy", "Research"],
    sampleQueries: [
      "Validate my idea for a pet subscription box service in Japan.",
      "Analyze the feasibility of launching an AI tutoring platform.",
    ],
    connectors: [],
    cover: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=640&h=360&fit=crop",
    userFlowUrl: "task-execution.html?task=startup-validation",
  },
  {
    id: "market-research",
    title: "Market Pain Point Auto-Analysis",
    category: "office",
    description:
      "Crawls forums, reviews, and social media to identify unmet needs and recurring complaints in your target market. Produces a structured pain-point report with evidence links to support your next product pitch.",
    type: "multi-step",
    typeTags: ["Research", "Market Intel"],
    sampleQueries: [
      "Find the top pain points for remote workers using project management tools.",
      "Analyze customer complaints about food delivery apps in Tokyo.",
    ],
    connectors: [],
    cover: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=640&h=360&fit=crop",
    userFlowUrl: "task-execution.html?task=market-research",
  },
  {
    id: "kpi-dashboard",
    title: "Business KPI Visual Dashboard",
    category: "office",
    description:
      "Connects to your data sources, auto-generates visual dashboards for key business metrics, and refreshes on a schedule. Highlights anomalies and trends so leadership can act on insights at a glance.",
    type: "multi-step",
    typeTags: ["Analytics", "Dashboard"],
    sampleQueries: [
      "Build a KPI dashboard for our e-commerce conversion funnel.",
      "Create a visual report of monthly active users and revenue trends.",
    ],
    connectors: [],
    cover: "https://images.unsplash.com/photo-1543286386-713bdd548da4?w=640&h=360&fit=crop",
    userFlowUrl: "task-execution.html?task=kpi-dashboard",
  },

  /* ═══════════════════════ Research & Learning ═══════════════════════ */
  {
    id: "study-planner",
    title: "Lightweight Study Planner",
    category: "research",
    description:
      "Creates a personalized study schedule based on your exam date, available hours, and subject difficulty. Breaks down topics into daily chunks and adjusts pacing if you fall behind.",
    type: "multi-step",
    typeTags: ["Education", "Planning"],
    sampleQueries: [
      "Plan a 30-day study schedule for my JLPT N2 exam.",
      "Create a weekly study plan for machine learning basics.",
    ],
    connectors: ["Google Calendar"],
    cover: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=640&h=360&fit=crop",
    userFlowUrl: "task-execution.html?task=study-planner",
  },
  {
    id: "study-checkin",
    title: "Study Goal Tracker & Check-in",
    category: "research",
    description:
      "Breaks your learning goal into daily micro-tasks, sends check-in reminders at your preferred time, tracks streak and completion rate, and adapts tomorrow's load based on today's performance.",
    type: "schedule",
    typeTags: ["Habit", "Daily Check-in"],
    sampleQueries: [
      "Remind me to review 50 vocabulary words every day at 7 PM.",
      "Track my coding practice streak and remind me if I miss a day.",
    ],
    connectors: ["Line", "Google Calendar"],
    cover: "https://images.unsplash.com/photo-1513258496099-48168024aec0?w=640&h=360&fit=crop",
    userFlowUrl: "task-execution.html?task=study-checkin",
  },
  {
    id: "knowledge-map",
    title: "Knowledge Framework Mapping",
    category: "research",
    description:
      "Reads your study material or textbook outline and produces a clear concept-relationship skeleton map — turning messy notes into a structured knowledge tree you can navigate.",
    type: "simple",
    typeTags: ["Mind Map", "Organization"],
    sampleQueries: [
      "Create a concept map for organic chemistry reactions.",
      "Turn my history notes into a structured framework diagram.",
    ],
    connectors: [],
    cover: "https://images.unsplash.com/photo-1456406644174-8ddd4cd52a06?w=640&h=360&fit=crop",
    userFlowUrl: "task-execution.html?task=knowledge-map",
  },
  {
    id: "deep-explainer",
    title: "Deep Content Explainer",
    category: "research",
    description:
      "Stuck on a tough concept? Paste the problem and this agent breaks it down step by step, finds analogies, suggests prerequisite knowledge, and offers practice problems to solidify understanding.",
    type: "simple",
    typeTags: ["Tutoring", "Explanation"],
    sampleQueries: [
      "Explain transformer attention mechanism in simple terms.",
      "Help me understand why quicksort's worst case is O(n²).",
    ],
    connectors: [],
    cover: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=640&h=360&fit=crop",
    userFlowUrl: "task-execution.html?task=deep-explainer",
  },
  {
    id: "daily-research-brief",
    title: "Daily Research Briefing",
    category: "research",
    description:
      "Monitors arXiv, PubMed, and industry blogs on your topics of interest. Every morning it delivers a curated briefing with paper titles, key findings, and relevance scores — so you never miss a breakthrough.",
    type: "schedule",
    typeTags: ["Scheduled", "Research"],
    sampleQueries: [
      "Send me daily updates on LLM research papers from arXiv.",
      "Monitor new publications about CRISPR gene therapy weekly.",
    ],
    connectors: ["Gmail"],
    cover: "https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?w=640&h=360&fit=crop",
    userFlowUrl: "task-execution.html?task=daily-research-brief",
  },
  {
    id: "notes-to-docs",
    title: "Notes to Structured Documents",
    category: "research",
    description:
      "Feed it a pile of bookmarks, raw notes, or article links and it reads, extracts key points, removes redundancy, and outputs a well-organized document with sections, summaries, and source citations.",
    type: "multi-step",
    typeTags: ["Summarization", "Docs"],
    sampleQueries: [
      "Turn these 15 bookmarked articles into a structured research summary.",
      "Organize my scattered meeting notes into a clean project document.",
    ],
    connectors: [],
    cover: "https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?w=640&h=360&fit=crop",
    userFlowUrl: "task-execution.html?task=notes-to-docs",
  },
  {
    id: "tech-news-digest",
    title: "Daily Tech News Curated Digest",
    category: "research",
    description:
      "Aggregates top stories from Hacker News, TechCrunch, The Verge, and curated RSS feeds. Filters by your interests, removes noise, and delivers a one-page digest every morning.",
    type: "schedule",
    typeTags: ["Scheduled", "Tech News"],
    sampleQueries: [
      "Send me a daily tech news summary focused on AI and startups.",
      "Curate the top 10 tech stories from today for me.",
    ],
    connectors: ["Gmail"],
    cover: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=640&h=360&fit=crop",
    userFlowUrl: "task-execution.html?task=tech-news-digest",
  },
  {
    id: "ai-paper-reader",
    title: "AI Paper Speed Reader",
    category: "research",
    description:
      "Paste an arXiv URL or paper title and the agent reads the full text, extracts the core contribution, methodology, results, and limitations, then compares with related work — giving you a 2-minute understanding of any paper.",
    type: "simple",
    typeTags: ["Paper Review", "AI"],
    sampleQueries: [
      "Summarize the key findings of 'Attention Is All You Need'.",
      "Compare the methods in these three NLP papers and highlight differences.",
    ],
    connectors: [],
    cover: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=640&h=360&fit=crop",
    userFlowUrl: "task-execution.html?task=ai-paper-reader",
    featured: true,
  },
  {
    id: "reference-formatter",
    title: "Reference Citation Formatter",
    category: "research",
    description:
      "Paste raw citations or DOI links and the agent normalizes them into your chosen format (APA, MLA, Chicago, IEEE). Detects duplicates, fixes ordering, and exports a clean bibliography section.",
    type: "simple",
    typeTags: ["Academic", "Formatting"],
    sampleQueries: [
      "Convert these 20 citations to APA 7th edition format.",
      "Fix the formatting of my bibliography and sort alphabetically.",
    ],
    connectors: [],
    cover: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=640&h=360&fit=crop",
    userFlowUrl: "task-execution.html?task=reference-formatter",
  },

  /* ═══════════════════════ Entertainment ═══════════════════════ */
  {
    id: "night-companion",
    title: "Late-Night Emotional Companion",
    category: "entertainment",
    description:
      "A gentle conversational companion for those quiet late-night moments. Listens to your thoughts, offers comforting words, suggests calming activities, and stays with you until you feel ready to rest.",
    type: "schedule",
    typeTags: ["Wellness", "Chat"],
    sampleQueries: [
      "I can't sleep and feel anxious — just want to talk.",
      "Help me wind down with a calming conversation.",
    ],
    connectors: ["Line"],
    cover: "https://images.unsplash.com/photo-1475274047050-1d0c55b25b00?w=640&h=360&fit=crop",
    userFlowUrl: "task-execution.html?task=night-companion",
  },
  {
    id: "lazy-trip-planner",
    title: "Lazy Weekend Trip Planner",
    category: "entertainment",
    description:
      "Tell it your location, budget, and vibe preferences and it generates a complete day-trip or weekend plan — including spots, routes, restaurant picks, and time estimates. Zero effort, maximum fun.",
    type: "multi-step",
    typeTags: ["Travel", "Lifestyle"],
    sampleQueries: [
      "Plan a chill weekend trip near Tokyo under ¥15,000.",
      "Suggest a day trip for foodies within 2 hours of Osaka.",
    ],
    connectors: ["Google Calendar"],
    cover: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=640&h=360&fit=crop",
    userFlowUrl: "task-execution.html?task=lazy-trip-planner",
    featured: true,
  },
  {
    id: "daily-horoscope",
    title: "Daily Horoscope Action Guide",
    category: "entertainment",
    description:
      "Every morning, generates a personalized horoscope based on your zodiac sign with specific, actionable advice for the day — covering work, relationships, and lucky moments.",
    type: "schedule",
    typeTags: ["Scheduled", "Fun"],
    sampleQueries: [
      "Send me my Scorpio horoscope every morning at 7 AM.",
      "What should I focus on today based on my star sign?",
    ],
    connectors: ["Line"],
    cover: "https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4f0?w=640&h=360&fit=crop",
    userFlowUrl: "task-execution.html?task=daily-horoscope",
  },
  {
    id: "tarot-reading",
    title: "Fun Tarot Card Reading",
    category: "entertainment",
    description:
      "Having a small dilemma? Draw a virtual tarot card spread and get a lighthearted interpretation with gentle advice. For fun and reflection, not fortune-telling.",
    type: "simple",
    typeTags: ["Fun", "Reflection"],
    sampleQueries: [
      "Draw a three-card tarot spread for my career question.",
      "I can't decide between two options — pull a card for me.",
    ],
    connectors: [],
    cover: "https://images.unsplash.com/photo-1600429991827-5c42d3b1ab14?w=640&h=360&fit=crop",
    userFlowUrl: "task-execution.html?task=tarot-reading",
  },
  {
    id: "birthday-fortune",
    title: "Birthday Fortune Fun Reading",
    category: "entertainment",
    description:
      "Enter your birth date and time to unlock a fun cultural reading blending Eastern and Western traditions — zodiac, element analysis, and personality traits presented in an engaging way.",
    type: "simple",
    typeTags: ["Fun", "Culture"],
    sampleQueries: [
      "What does my birth date March 15, 1995 say about me?",
      "Give me a fun personality reading based on my birthday.",
    ],
    connectors: [],
    cover: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=640&h=360&fit=crop",
    userFlowUrl: "task-execution.html?task=birthday-fortune",
  },
  {
    id: "mbti-match",
    title: "MBTI Compatibility Analysis",
    category: "entertainment",
    description:
      "Input two MBTI types and get a detailed compatibility breakdown — communication style match, potential friction points, relationship advice, and famous pair examples.",
    type: "simple",
    typeTags: ["Personality", "Fun"],
    sampleQueries: [
      "How compatible are INTJ and ENFP in a relationship?",
      "Analyze the work dynamics between an ISTJ and ENTP.",
    ],
    connectors: [],
    cover: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=640&h=360&fit=crop",
    userFlowUrl: "task-execution.html?task=mbti-match",
  },
  {
    id: "movie-recommender",
    title: "Movie & Show Recommender",
    category: "entertainment",
    description:
      "Describe your mood or genre preference and get curated recommendations with ratings, where to stream, trailers, and a brief spoiler-free pitch for each pick.",
    type: "simple",
    typeTags: ["Movies", "Recommendation"],
    sampleQueries: [
      "Recommend a mind-bending sci-fi movie I can watch tonight.",
      "What are the best K-dramas for someone who loved Crash Landing on You?",
    ],
    connectors: [],
    cover: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=640&h=360&fit=crop",
    userFlowUrl: "task-execution.html?task=movie-recommender",
  },

  /* ═══════════════════════ Self-Discipline & Life ═══════════════════════ */
  {
    id: "daily-workout",
    title: "Daily Workout Planner",
    category: "lifestyle",
    description:
      "Generates tomorrow's exercise plan based on your fitness level, available equipment, and goals. Sends a reminder at your chosen time and adjusts intensity based on your check-in feedback.",
    type: "schedule",
    typeTags: ["Scheduled", "Fitness"],
    sampleQueries: [
      "Plan my workout for tomorrow — I have dumbbells and 40 minutes.",
      "Create a running schedule for the next 2 weeks to prep for a 10K.",
    ],
    connectors: ["Line", "Google Calendar"],
    cover: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=640&h=360&fit=crop",
    userFlowUrl: "task-execution.html?task=daily-workout",
    featured: true,
  },
  {
    id: "meal-recommender",
    title: "Daily Meal Recommender",
    category: "lifestyle",
    description:
      "Report your taste, dietary needs, and location. The agent recommends meals with nutrition info, nearby restaurants, and even step-by-step recipes — healthy eating on autopilot.",
    type: "simple",
    typeTags: ["Food", "Health"],
    sampleQueries: [
      "What should I eat for lunch? I want something healthy near Shibuya.",
      "Suggest a high-protein dinner I can cook in 20 minutes.",
    ],
    connectors: [],
    cover: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=640&h=360&fit=crop",
    userFlowUrl: "task-execution.html?task=meal-recommender",
  },
  {
    id: "workout-adjust",
    title: "Workout Plan Adjuster",
    category: "lifestyle",
    description:
      "Fell off your training plan? Describe what happened and the agent reshuffles your remaining sessions, redistributes volume, and creates an updated schedule that still hits your goals.",
    type: "multi-step",
    typeTags: ["Fitness", "Replanning"],
    sampleQueries: [
      "I missed 3 gym days last week — adjust my plan for the remaining month.",
      "My knee is sore, switch my running days to swimming this week.",
    ],
    connectors: ["Google Calendar"],
    cover: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=640&h=360&fit=crop",
    userFlowUrl: "task-execution.html?task=workout-adjust",
  },
  {
    id: "goal-checkin",
    title: "Goal Breakdown & Daily Check-in",
    category: "lifestyle",
    description:
      "Turn a big goal into small daily steps. The agent creates a milestone roadmap, tracks your daily check-ins, visualizes progress, and sends motivational nudges when you're slipping.",
    type: "multi-step",
    typeTags: ["Goals", "Tracking"],
    sampleQueries: [
      "Break down 'learn to play guitar in 3 months' into daily tasks.",
      "I want to read 24 books this year — create a reading schedule.",
    ],
    connectors: ["Line", "Google Calendar"],
    cover: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=640&h=360&fit=crop",
    userFlowUrl: "task-execution.html?task=goal-checkin",
  },
  {
    id: "habit-tracker",
    title: "21-Day Habit Builder & Tracker",
    category: "lifestyle",
    description:
      "Pick a habit you want to build. The agent sets up a 21-day challenge with daily reminders, streak tracking, progress charts, and recovery tips if you miss a day — backed by behavioral science.",
    type: "schedule",
    typeTags: ["Scheduled", "Habits"],
    sampleQueries: [
      "Start a 21-day meditation habit with daily reminders at 7 AM.",
      "Help me build a journaling habit with evening check-ins.",
    ],
    connectors: ["Line"],
    cover: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=640&h=360&fit=crop",
    userFlowUrl: "task-execution.html?task=habit-tracker",
  },
  {
    id: "weather-outfit",
    title: "Weather & Outfit Advisor",
    category: "lifestyle",
    description:
      "Real-time weather with temperature, humidity, wind, and AQI — plus a 7-day forecast. Suggests what to wear based on conditions and alerts you to extreme weather before you leave.",
    type: "simple",
    typeTags: ["Weather", "Daily Life"],
    sampleQueries: [
      "What should I wear today in Tokyo?",
      "Will it rain this weekend? Should I bring an umbrella?",
    ],
    connectors: [],
    cover: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=640&h=360&fit=crop",
    userFlowUrl: "task-execution.html?task=weather-outfit",
  },

  /* ═══════════════════════ Social Media & Marketing ═══════════════════════ */
  {
    id: "auto-social-content",
    title: "Auto Social Media Content Creator",
    category: "social-media",
    description:
      "Pick your niche and platform. The agent handles everything from topic selection to copywriting, hashtag optimization, and image suggestions — producing publish-ready posts on autopilot daily.",
    type: "multi-step",
    typeTags: ["Content", "Automation"],
    sampleQueries: [
      "Generate 5 Instagram posts about minimalist living for this week.",
      "Write daily Twitter threads about AI trends for my tech account.",
    ],
    connectors: ["Instagram", "X"],
    cover: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=640&h=360&fit=crop",
    userFlowUrl: "task-execution.html?task=auto-social-content",
    featured: true,
  },
  {
    id: "video-script",
    title: "Video Script Generator",
    category: "social-media",
    description:
      "Describe your video topic and target audience. The agent generates a hook-driven script with scene breakdowns, talking points, B-roll suggestions, and CTA placement optimized for watch-time retention.",
    type: "simple",
    typeTags: ["Video", "Scriptwriting"],
    sampleQueries: [
      "Write a 3-minute YouTube script about productivity tips for students.",
      "Create a TikTok script series about Japanese convenience store hacks.",
    ],
    connectors: [],
    cover: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=640&h=360&fit=crop",
    userFlowUrl: "task-execution.html?task=video-script",
  },
  {
    id: "content-repurpose",
    title: "Cross-Platform Content Repurpose",
    category: "social-media",
    description:
      "Feed it a long article or video transcript and it automatically splits the content into platform-optimized snippets — tweet threads, Instagram carousels, LinkedIn posts, and short-form video hooks.",
    type: "multi-step",
    typeTags: ["Repurpose", "Multi-platform"],
    sampleQueries: [
      "Turn this 3000-word blog post into tweets, an IG carousel, and a LinkedIn post.",
      "Repurpose my YouTube video transcript into 5 short-form clips.",
    ],
    connectors: ["Instagram", "X", "Facebook"],
    cover: "https://images.unsplash.com/photo-1432888622747-4eb9a8f2c1b9?w=640&h=360&fit=crop",
    userFlowUrl: "task-execution.html?task=content-repurpose",
  },

  /* ═══════════════════════ Finance ═══════════════════════ */
  {
    id: "economic-data",
    title: "Economic Data Explorer",
    category: "finance",
    description:
      "Query GDP, interest rates, CPI, unemployment, and other macro indicators across countries. Returns clean charts, trend analysis, and plain-language summaries so you understand the numbers fast.",
    type: "simple",
    typeTags: ["Economics", "Data"],
    sampleQueries: [
      "Show me Japan's CPI trend for the last 12 months.",
      "Compare US and EU interest rate changes since 2023.",
    ],
    connectors: [],
    cover: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=640&h=360&fit=crop",
    userFlowUrl: "task-execution.html?task=economic-data",
  },
  {
    id: "quant-backtest",
    title: "Quant Strategy Backtester",
    category: "finance",
    description:
      "Describe a trading strategy in plain language. The agent converts it to rules, runs a historical backtest over your chosen period, and returns performance metrics — Sharpe ratio, max drawdown, win rate, and equity curve.",
    type: "multi-step",
    typeTags: ["Quant", "Backtesting"],
    sampleQueries: [
      "Backtest a simple moving average crossover strategy on Nikkei 225 for the last 5 years.",
      "Test a momentum strategy buying top-10 S&P 500 stocks monthly.",
    ],
    connectors: [],
    cover: "https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=640&h=360&fit=crop",
    userFlowUrl: "task-execution.html?task=quant-backtest",
    featured: true,
  },
];

/** User's enabled / active tasks with status & schedule metadata (demo) */
window.MY_ACTIVE_TASKS = [
  {
    id: "case-weekly-report",
    status: "running",
    schedule: "Every Monday at 8:00 AM",
    lastRun: "2026-04-07 08:00",
    nextRun: "2026-04-14 08:00",
  },
  {
    id: "case-email-todo",
    status: "completed",
    lastRun: "2026-04-09 14:32",
  },
  {
    id: "daily-news-digest",
    status: "running",
    schedule: "Every day at 7:30 AM",
    lastRun: "2026-04-10 07:30",
    nextRun: "2026-04-11 07:30",
  },
  {
    id: "daily-workout",
    status: "running",
    schedule: "Every day at 6:00 AM",
    lastRun: "2026-04-10 06:00",
    nextRun: "2026-04-11 06:00",
  },
  {
    id: "habit-tracker",
    status: "running",
    schedule: "Every day at 9:00 PM",
    lastRun: "2026-04-09 21:00",
    nextRun: "2026-04-10 21:00",
  },
  {
    id: "case-receipt-bill",
    status: "completed",
    lastRun: "2026-04-08 10:15",
  },
];

window.MY_ACTIVE_TASK_IDS = window.MY_ACTIVE_TASKS.map(function (t) { return t.id; });
