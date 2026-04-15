import type { Task, TaskCategory, JapanSub, ActiveTask } from '../types'

export const TASK_CATEGORIES: TaskCategory[] = [
  { id: 'all', label: 'All Ideas', icon: '✨' },
  { id: 'japan', label: 'Life Services', icon: '🏠', special: true },
  { id: 'office', label: 'Work Productivity', icon: '💼' },
  { id: 'research', label: 'Research & Learning', icon: '📚' },
  { id: 'entertainment', label: 'Entertainment', icon: '🎮' },
  { id: 'lifestyle', label: 'Self-Discipline & Life', icon: '🌿' },
  { id: 'social-media', label: 'Social Media & Marketing', icon: '📱' },
  { id: 'finance', label: 'Personal Finance', icon: '💰' },
  { id: 'rakuten', label: 'Rakuten Ecosystem', icon: '🛒' },
]

export const JAPAN_SUBS: JapanSub[] = [
  { id: 'job-hunting', icon: '💼', titleJa: '就活', titleEn: 'Job Hunting' },
  { id: 'bureaucracy', icon: '🏛️', titleJa: '行政手続き', titleEn: 'Navigating Bureaucracy' },
  { id: 'daily-life', icon: '🗾', titleJa: '日常生活', titleEn: 'Daily Japanese Life' },
  { id: 'communication', icon: '✉️', titleJa: 'コミュニケーション', titleEn: 'Japanese Communication' },
]

export const TASK_CATALOG: Task[] = [
  // ── Office ──
  { id: 'case-email-todo', title: 'Analyzing Email Tasks & Scheduling Focus Time', category: 'office', description: 'Turns a crowded inbox into a clear plan: it spots what actually needs doing, sorts it by urgency, and can block time on your calendar so follow-ups do not fall through the cracks.', type: 'multi-step', typeTags: ['Productivity', 'Schedulable'], sampleQueries: ['Find the email tasks I need to handle this week and schedule time on my calendar.', 'Extract all todo items from my Outlook emails and create a checklist.'], connectors: ['Outlook', 'MS Calendar'], cover: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=640&h=360&fit=crop', userFlowUrl: '', featured: true, hot: true },
  { id: 'case-receipt-bill', title: 'Auditing Receipts & Subscription Spending', category: 'office', description: 'A finance-minded assistant for your mailbox: it finds receipts and billing notices, extracts who charged you how much, and highlights subscriptions you may still be paying for.', type: 'multi-step', typeTags: ['Email Analysis', 'Subscription Audit'], sampleQueries: ['Find all receipt and bill-related emails from the past 3 months.', 'Analyze which software services are still charging me.'], connectors: ['Outlook'], cover: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=640&h=360&fit=crop', userFlowUrl: '', hot: true },
  { id: 'case-weekly-report', title: 'Checking Team Weekly Reports & Sending Reminders', category: 'office', description: 'Keeps reporting rituals on track: on the schedule you choose, it checks who has filed and nudges the rest so managers spend less time chasing status.', type: 'schedule', typeTags: ['Multi-step', 'Human-in-the-loop'], sampleQueries: ['Check every Friday whether my team submitted their weekly reports.'], connectors: ['Outlook', 'Line', 'MS Teams'], cover: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=640&h=360&fit=crop', userFlowUrl: '', hot: true },
  { id: 'daily-news-digest', title: 'Digesting Daily Hot News', category: 'office', description: 'Your morning briefing companion: it pulls together what is trending across major sources and delivers a tight summary to your inbox or Line before the day gets noisy.', type: 'schedule', typeTags: ['Scheduled', 'News'], sampleQueries: ['Send me a daily news summary at 8 AM covering tech and business.'], connectors: ['Gmail', 'Line'], cover: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=640&h=360&fit=crop', userFlowUrl: '' },
  { id: 'one-click-doc', title: 'Creating Structured Documents Instantly', category: 'office', description: 'Describe the outcome you need and get a polished draft with headings, bullets, and formatting you can share as-is or refine in your usual editor.', type: 'simple', typeTags: ['Docs', 'AI Writing'], sampleQueries: ['Create a project proposal document about our Q3 marketing campaign.'], connectors: [], cover: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=640&h=360&fit=crop', userFlowUrl: '' },
  { id: 'auto-spreadsheet', title: 'Building Data Spreadsheets from Descriptions', category: 'office', description: 'Skip the blank grid: explain the data story you want, and the agent proposes columns, formulas, and chart ideas in a spreadsheet-ready layout.', type: 'simple', typeTags: ['Data', 'Spreadsheet'], sampleQueries: ['Create a sales tracking spreadsheet with monthly totals and a chart.'], connectors: [], cover: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=640&h=360&fit=crop', userFlowUrl: '' },
  { id: 'kpi-dashboard', title: 'Visualizing Business KPIs', category: 'office', description: 'Connects the metrics that matter and keeps a living view of performance—so leadership reviews start from a shared picture instead of last-minute exports.', type: 'multi-step', typeTags: ['Analytics', 'Dashboard'], sampleQueries: ['Build a KPI dashboard for our e-commerce conversion funnel.'], connectors: [], cover: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?w=640&h=360&fit=crop', userFlowUrl: '' },

  // ── Research ──
  { id: 'study-planner', title: 'Planning Lightweight Study Schedules', category: 'research', description: 'Builds a realistic study plan around your exam date, free hours, and how hard each topic hits—without turning your calendar into a wall of guilt.', type: 'multi-step', typeTags: ['Education', 'Planning'], sampleQueries: ['Plan a 30-day study schedule for my JLPT N2 exam.'], connectors: ['Google Calendar'], cover: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=640&h=360&fit=crop', userFlowUrl: '' },
  { id: 'deep-explainer', title: 'Explaining Complex Content Deeply', category: 'research', description: 'When a concept feels opaque, this task breaks it into steps, adds intuition-friendly analogies, and suggests practice angles so you actually retain it.', type: 'simple', typeTags: ['Tutoring', 'Explanation'], sampleQueries: ['Explain transformer attention mechanism in simple terms.'], connectors: [], cover: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=640&h=360&fit=crop', userFlowUrl: '' },
  { id: 'ai-paper-reader', title: 'Reading Research Papers Quickly', category: 'research', description: 'Point it at a paper or arXiv link and get the contribution, methods, and results in human language—so you can decide what deserves a full deep read.', type: 'simple', typeTags: ['Paper Review', 'AI'], sampleQueries: ["Summarize the key findings of 'Attention Is All You Need'."], connectors: [], cover: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=640&h=360&fit=crop', userFlowUrl: '' },
  { id: 'daily-research-brief', title: 'Briefing Daily Research Updates', category: 'research', description: 'A standing scan of arXiv, PubMed, and trusted industry voices—each morning you get titles and takeaways tailored to the fields you care about.', type: 'schedule', typeTags: ['Scheduled', 'Research'], sampleQueries: ['Send me daily updates on LLM research papers from arXiv.'], connectors: ['Gmail'], cover: 'https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?w=640&h=360&fit=crop', userFlowUrl: '' },

  // ── Entertainment ──
  { id: 'lazy-trip-planner', title: 'Planning Lazy Weekend Trips', category: 'entertainment', description: 'Share your budget, mood, and how far you are willing to go—it returns a full day or weekend plan that feels doable, not a homework assignment.', type: 'multi-step', typeTags: ['Travel', 'Lifestyle'], sampleQueries: ['Plan a chill weekend trip near Tokyo under ¥15,000.'], connectors: ['Google Calendar'], cover: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=640&h=360&fit=crop', userFlowUrl: '' },
  { id: 'movie-recommender', title: 'Recommending Movies & Shows', category: 'entertainment', description: 'Tell it how you feel tonight and get a short list with vibe notes, where to watch, and enough context to pick without another forty-minute scroll.', type: 'simple', typeTags: ['Movies', 'Recommendation'], sampleQueries: ['Recommend a mind-bending sci-fi movie I can watch tonight.'], connectors: [], cover: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=640&h=360&fit=crop', userFlowUrl: '' },
  { id: 'daily-horoscope', title: 'Guiding Daily Horoscope Actions', category: 'entertainment', description: 'More than a fortune snippet: each day it pairs your sign with small, concrete suggestions you could actually try before lunch.', type: 'schedule', typeTags: ['Scheduled', 'Fun'], sampleQueries: ['Send me my Scorpio horoscope every morning at 7 AM.'], connectors: ['Line'], cover: 'https://images.unsplash.com/photo-1505506874110-6a7a69069a08?w=640&h=360&fit=crop', userFlowUrl: '' },
  { id: 'mbti-match', title: 'Analyzing MBTI Compatibility', category: 'entertainment', description: 'Compare two types and get a grounded read on communication habits, likely friction, and how to navigate both—conversation-starter depth, not a meme chart.', type: 'simple', typeTags: ['Personality', 'Fun'], sampleQueries: ['How compatible are INTJ and ENFP in a relationship?'], connectors: [], cover: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=640&h=360&fit=crop', userFlowUrl: '' },

  // ── Lifestyle ──
  { id: 'daily-workout', title: 'Planning Daily Workouts', category: 'lifestyle', description: 'Wakes up knowing your gear, time budget, and goal for the week—then proposes tomorrow’s session so you show up with a plan, not an excuse.', type: 'schedule', typeTags: ['Scheduled', 'Fitness'], sampleQueries: ["Plan my workout for tomorrow — I have dumbbells and 40 minutes."], connectors: ['Line', 'Google Calendar'], cover: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=640&h=360&fit=crop', userFlowUrl: '' },
  { id: 'meal-recommender', title: 'Recommending Daily Meals', category: 'lifestyle', description: 'Balances taste, dietary needs, and where you actually are—meal ideas with a bit of nutrition context and realistic nearby options when you want to eat out.', type: 'simple', typeTags: ['Food', 'Health'], sampleQueries: ['What should I eat for lunch? I want something healthy near Shibuya.'], connectors: [], cover: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=640&h=360&fit=crop', userFlowUrl: '' },
  { id: 'habit-tracker', title: 'Building & Tracking 21-Day Habits', category: 'lifestyle', description: 'Pick one habit worth sticking to; the agent shapes a three-week rhythm with reminders and streak visibility so the first slip does not become a quit.', type: 'schedule', typeTags: ['Scheduled', 'Habits'], sampleQueries: ['Start a 21-day meditation habit with daily reminders at 7 AM.'], connectors: ['Line'], cover: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=640&h=360&fit=crop', userFlowUrl: '' },
  { id: 'weather-outfit', title: 'Advising on Weather & Outfits', category: 'lifestyle', description: 'Checks the air outside and helps you dress for it—temperature, humidity, wind, and air quality in one glance, with outfit hints that match the day.', type: 'simple', typeTags: ['Weather', 'Daily Life'], sampleQueries: ['What should I wear today in Tokyo?'], connectors: [], cover: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=640&h=360&fit=crop', userFlowUrl: '' },

  // ── Social Media ──
  { id: 'auto-social-content', title: 'Creating Social Media Content Automatically', category: 'social-media', description: 'Define your niche and platform once; it rotates topics, captions, hashtags, and visual directions so your feed stays consistent without creative burnout.', type: 'multi-step', typeTags: ['Content', 'Automation'], sampleQueries: ['Generate 5 Instagram posts about minimalist living for this week.'], connectors: ['Instagram', 'X'], cover: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=640&h=360&fit=crop', userFlowUrl: '' },
  { id: 'video-script', title: 'Generating Video Scripts', category: 'social-media', description: 'Describe the audience and angle—get a hook-first script with beats and talking points you can record or hand to an editor.', type: 'simple', typeTags: ['Video', 'Scriptwriting'], sampleQueries: ['Write a 3-minute YouTube script about productivity tips for students.'], connectors: [], cover: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=640&h=360&fit=crop', userFlowUrl: '' },

  // ── Finance ──
  { id: 'personal-finance', title: 'Advising on Personal Finance', category: 'finance', description: 'Organizes where your money went, surfaces patterns you might miss, and suggests next steps for saving and forecasting—without drowning you in jargon.', type: 'multi-step', typeTags: ['Budgeting', 'Savings'], sampleQueries: ['Analyze my spending this month and suggest where I can save.'], connectors: [], cover: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=640&h=360&fit=crop', userFlowUrl: '' },
  { id: 'economic-data', title: 'Exploring Economic Data', category: 'finance', description: 'Ask in plain language about growth, prices, jobs, or rates across countries—get charts-minded answers backed by the indicators you need for context.', type: 'simple', typeTags: ['Economics', 'Data'], sampleQueries: ["Show me Japan's CPI trend for the last 12 months."], connectors: [], cover: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=640&h=360&fit=crop', userFlowUrl: '' },

  // ── Rakuten ──
  { id: 'smart-spending', title: 'Optimizing Smart Spending', category: 'rakuten', description: 'Works with your Rakuten Pay and Card activity to categorize spend, flag cheaper paths, and surface coupons you might have missed.', type: 'multi-step', typeTags: ['Spending', 'Rakuten Pay'], sampleQueries: ['Analyze my Rakuten Card spending this month and find savings.'], connectors: ['Rakuten Pay', 'Rakuten Card'], cover: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=640&h=360&fit=crop', userFlowUrl: '' },
  { id: 'point-maximizing', title: 'Maximizing Rakuten Points', category: 'rakuten', description: 'Keeps points and expiry in view, watches for campaigns like SPU, and suggests how to redeem before value quietly disappears.', type: 'multi-step', typeTags: ['Points', 'SPU'], sampleQueries: ['How can I maximize my Rakuten points before they expire?'], connectors: ['Rakuten Points'], cover: 'https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?w=640&h=360&fit=crop', userFlowUrl: '', featured: true },
  { id: 'price-watch', title: 'Watching Rakuten Product Prices', category: 'rakuten', description: 'Save what you are watching, track dips and campaign windows, and get nudged when buying finally makes sense.', type: 'schedule', typeTags: ['Price Tracking', 'Alerts'], sampleQueries: ['Track the price of this laptop on Rakuten and alert me when it drops.'], connectors: ['Rakuten Ichiba'], cover: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=640&h=360&fit=crop', userFlowUrl: '' },
  { id: 'weekly-grocery', title: 'Auto-Refilling Weekly Groceries', category: 'rakuten', description: 'Learns how fast you go through staples, drafts a sensible cart, and compares merchants so repeat shopping feels lighter than starting from zero.', type: 'schedule', typeTags: ['Grocery', 'Scheduled'], sampleQueries: ['Generate my weekly grocery list based on past orders.'], connectors: ['Rakuten Ichiba'], cover: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=640&h=360&fit=crop', userFlowUrl: '' },
  { id: 'fashion-trend', title: 'Reporting Fashion Styling Trends', category: 'rakuten', description: 'Starts from your taste, adds what is moving this season, and returns outfits with shoppable links—trend-aware without losing your lane.', type: 'multi-step', typeTags: ['Fashion', 'Trends'], sampleQueries: ['What are the trending styles for spring 2026 that match my taste?'], connectors: ['Rakuten Fashion'], cover: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=640&h=360&fit=crop', userFlowUrl: '' },

  // ── Japan (Life Services) — Kenji storyline cases 01–06 appear first, in order ──
  {
    id: 'kenji-family-email-schedule',
    title: 'Managing Family Email & Schedules',
    category: 'japan',
    japanSub: 'daily-life',
    description:
      'Built for parents juggling school mail, PTA threads, and family logistics across Gmail and Outlook. It surfaces deadlines and must-dos in plain language, syncs what matters to Google Calendar, and leaves you with one clear summary so the morning scan actually sticks.',
    type: 'multi-step',
    typeTags: ['Family', 'Calendar', 'Life Services'],
    sampleQueries: [
      'Pull school and PTA emails from this week and put deadlines on my calendar.',
      'Summarize family-related action items from Gmail and Outlook and email me a checklist.',
    ],
    connectors: ['Gmail', 'MS Outlook', 'Google Calendar'],
    cover: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=640&h=360&fit=crop',
    userFlowUrl: '',
    featured: true,
    hot: true,
  },
  {
    id: 'kenji-business-trip-shutcho',
    title: 'Planning Business Trips',
    category: 'japan',
    japanSub: 'daily-life',
    description:
      'Your domestic 出張 copilot: describe the trip once and get Shinkansen and hotel options via Rakuten Travel, omiyage ideas from Ichiba, a polished thank-you note for partners, and an expense-ready summary—less tab-switching, more time for the actual meeting.',
    type: 'multi-step',
    typeTags: ['出張', 'Rakuten Travel', 'Expense'],
    sampleQueries: [
      'Plan my Osaka business trip: Shinkansen, hotel, thank-you email, and expense draft.',
      'Book next week’s client visit: trains, stay near the meeting venue, and omiyage ideas under ¥3,000.',
    ],
    connectors: ['Gmail', 'Google Calendar', 'MS Outlook', 'Rakuten Travel', 'Rakuten Ichiba'],
    cover: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=640&h=360&fit=crop',
    userFlowUrl: '',
    featured: true,
    hot: true,
  },
  {
    id: 'kenji-meeting-action-slides',
    title: 'Following Up on Meetings',
    category: 'japan',
    japanSub: 'daily-life',
    description:
      'Meeting follow-up without the scramble: drop in notes, bullets, or a Teams recap and get owners and deadlines structured, focus time on the calendar, and a draft slide outline you can share—built for the “Friday deck” moment when raw input has to become something presentable fast.',
    type: 'multi-step',
    typeTags: ['Meetings', 'MS Teams', 'Slides'],
    sampleQueries: [
      'Turn these notes into an action list and a 5-slide outline for my Friday presentation.',
      'Summarize today’s partner meeting from Teams and add my tasks to the calendar.',
    ],
    connectors: ['MS Teams', 'Google Calendar'],
    cover: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=640&h=360&fit=crop',
    userFlowUrl: '',
    hot: true,
  },
  {
    id: 'kenji-furusato-household-finance',
    title: 'Advising on Hometown Tax & Household Finance',
    category: 'japan',
    japanSub: 'daily-life',
    description:
      'Makes household signals from mail and cards easier to read, estimates how much ふるさと納税 room you have left, and suggests Ichiba gifts that fit—optionally on a gentle schedule so you catch the season before it passes.',
    type: 'schedule',
    typeTags: ['ふるさと納税', 'Household', 'Rakuten Ichiba'],
    sampleQueries: [
      'How much ふるさと納税 capacity do I have left and what Rakuten Ichiba gifts fit?',
      'Weekly digest: remaining ふるさと cap and top regional picks under my budget.',
    ],
    connectors: ['Gmail', 'Rakuten Ichiba', 'Rakuten Card'],
    cover: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=640&h=360&fit=crop',
    userFlowUrl: '',
    hot: true,
  },
  {
    id: 'kenji-japanese-tone-reply',
    title: 'Assisting with Japanese Tone & Replies',
    category: 'japan',
    japanSub: 'communication',
    description:
      'Describe the situation or paste a rough line—get a reply that fits school parent LINE, client email, or casual chat. Tune politeness with simple controls and copy straight into LINE or Gmail: natural Japanese for the moment, not stiff translation.',
    type: 'simple',
    typeTags: ['敬語', 'LINE', 'Gmail'],
    sampleQueries: [
      'Write a polite reply to the school parent group — I can attend the June 20th committee and help with venue setup.',
      'Turn my rough Japanese into a polite email to a client about moving the meeting.',
    ],
    connectors: ['Line', 'Gmail'],
    cover: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=640&h=360&fit=crop&q=80',
    userFlowUrl: '',
    hot: true,
  },
  {
    id: 'kenji-business-email-thanks',
    title: 'Drafting Business Thank-You Emails',
    category: 'japan',
    japanSub: 'communication',
    description:
      'Walks you through audience and occasion with guided prompts, then delivers keigo-correct drafts you can send from Gmail—preview, tweak tone in one tap, and iterate without starting from a blank page.',
    type: 'multi-step',
    typeTags: ['Keigo', 'Guided', 'Gmail'],
    sampleQueries: [
      'Draft a thank-you email to the partner team after today’s meeting — respectful but warm.',
      'Write a 依頼 mail to my manager asking for approval — keigo correct for internal hierarchy.',
    ],
    connectors: ['Gmail', 'Google Calendar'],
    cover: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=640&h=360&fit=crop',
    userFlowUrl: '',
    featured: true,
    hot: true,
  },

  { id: 'jp-rirekisho', title: 'Formatting Rirekisho Resumes', category: 'japan', japanSub: 'job-hunting', description: 'Turns your experience into a clean Japan-standard rirekisho layout—ready to print or export as PDF when applications open.', type: 'simple', typeTags: ['就活', 'CV'], sampleQueries: ['Create a rirekisho from my LinkedIn profile.'], connectors: [], cover: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=640&h=360&fit=crop', userFlowUrl: '', featured: true, hot: true },
  { id: 'jp-mock-interview', title: 'Practicing Mock Job Interviews', category: 'japan', japanSub: 'job-hunting', description: 'Rehearses 自己PR and 志望動機 with realistic Japanese interview flow—detailed feedback so the next real session feels less like a first take.', type: 'multi-step', typeTags: ['就活', '面接'], sampleQueries: ['Practice a mock interview for a marketing position at a Japanese company.'], connectors: [], cover: 'https://images.unsplash.com/photo-1565688534245-05d6b5be184a?w=640&h=360&fit=crop', userFlowUrl: '' },
  { id: 'jp-kakutei-shinkoku', title: 'Filing Annual Tax Returns', category: 'japan', japanSub: 'bureaucracy', description: 'A calm guide through Japan’s income tax filing for freelancers and employees—forms, deductions, and e-Tax in order so filing season feels less overwhelming.', type: 'multi-step', typeTags: ['行政', '税金'], sampleQueries: ['Walk me through filing 確定申告 as a freelancer.'], connectors: [], cover: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=640&h=360&fit=crop', userFlowUrl: '' },
  { id: 'jp-trip-planner', title: 'Accompanying Business Trips End-to-End', category: 'japan', japanSub: 'daily-life', description: 'One place for the whole 出張 arc—packing sense-checks, train and hotel angles, and expense mindset—so business travel feels coordinated instead of fragmented.', type: 'multi-step', typeTags: ['出張', 'ビジネス'], sampleQueries: ['Plan my 2-day business trip to Osaka next week.'], connectors: ['Rakuten Travel', 'Google Calendar'], cover: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=640&h=360&fit=crop', userFlowUrl: '', featured: true, hot: true },
  { id: 'jp-train-delays', title: 'Handling Train Delays & Detours', category: 'japan', japanSub: 'daily-life', description: 'When the line stalls, get practical reroutes fast—and help turning delay proof into something you can hand to work without another app hunt.', type: 'simple', typeTags: ['生活', '電車'], sampleQueries: ['My Chuo Line is delayed — find me an alternate route to Shinjuku.'], connectors: [], cover: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=640&h=360&fit=crop', userFlowUrl: '' },
  { id: 'jp-business-keigo', title: 'Writing Business Keigo', category: 'japan', japanSub: 'communication', description: 'Turns casual phrasing into appropriate business 敬語 for email, chat, or docs—so the tone matches Japanese workplace expectations without over-editing.', type: 'simple', typeTags: ['日本語', '敬語'], sampleQueries: ['Rewrite this Slack message in proper business keigo.'], connectors: [], cover: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=640&h=360&fit=crop', userFlowUrl: '' },
]

export const MY_ACTIVE_TASKS: ActiveTask[] = [
  { id: 'case-weekly-report', status: 'running', schedule: 'Every Monday at 8:00 AM', lastRun: '2026-04-07 08:00', nextRun: '2026-04-14 08:00' },
  { id: 'case-email-todo', status: 'completed', lastRun: '2026-04-09 14:32' },
  { id: 'daily-news-digest', status: 'running', schedule: 'Every day at 7:30 AM', lastRun: '2026-04-10 07:30', nextRun: '2026-04-11 07:30' },
  { id: 'daily-workout', status: 'running', schedule: 'Every day at 6:00 AM', lastRun: '2026-04-10 06:00', nextRun: '2026-04-11 06:00' },
  { id: 'habit-tracker', status: 'running', schedule: 'Every day at 9:00 PM', lastRun: '2026-04-09 21:00', nextRun: '2026-04-10 21:00' },
]
