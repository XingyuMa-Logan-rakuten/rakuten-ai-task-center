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
  // ── Notes to Action (custom composer) ──
  {
    id: 'notes-to-action',
    title: 'Notes to Action',
    category: 'office',
    description: 'Upload a whiteboard photo, meeting notes, or any document and instantly generate a polished PowerPoint deck, HTML article, or Word document — ready to share in minutes.',
    type: 'simple',
    typeTags: ['Documents', 'AI Writing', 'Productivity'],
    sampleQueries: [
      'Turn my whiteboard photo into a PowerPoint presentation.',
      'Convert my meeting notes into a formatted HTML article.',
    ],
    connectors: [],
    cover: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=640&h=360&fit=crop',
    userFlowUrl: '',
    featured: true,
    hot: true,
    featuredBadge: '✦ NEW',
  },

  // ── Office ──
  { id: 'case-email-todo', title: 'Email Todo Analysis & Calendar Scheduling', category: 'office', description: 'Scans your Outlook inbox, extracts actionable items, classifies them by urgency, builds a prioritized checklist, then finds a free calendar slot and books focused time to handle them — all in one automated flow.', type: 'multi-step', typeTags: ['Productivity', 'Schedulable'], sampleQueries: ['Find the email tasks I need to handle this week and schedule time on my calendar.', 'Extract all todo items from my Outlook emails and create a checklist.'], connectors: ['Outlook', 'MS Calendar'], cover: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=640&h=360&fit=crop', userFlowUrl: '', featured: true, hot: true },
  { id: 'case-receipt-bill', title: 'Receipt & Subscription Audit', category: 'office', description: 'Searches Outlook for receipts, invoices, and subscription emails. Extracts merchant names, amounts, and billing cycles, then identifies still-active services.', type: 'multi-step', typeTags: ['Email Analysis', 'Subscription Audit'], sampleQueries: ['Find all receipt and bill-related emails from the past 3 months.', 'Analyze which software services are still charging me.'], connectors: ['Outlook'], cover: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=640&h=360&fit=crop', userFlowUrl: '', hot: true },
  { id: 'case-weekly-report', title: 'Weekly Report Check & Reminder', category: 'office', description: 'Runs on a schedule to verify whether each team member has submitted their weekly report and sends reminders.', type: 'schedule', typeTags: ['Multi-step', 'Human-in-the-loop'], sampleQueries: ['Check every Friday whether my team submitted their weekly reports.'], connectors: ['Outlook', 'Line', 'MS Teams'], cover: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=640&h=360&fit=crop', userFlowUrl: '', hot: true },
  { id: 'daily-news-digest', title: 'Daily Hot News Auto-Digest', category: 'office', description: 'Runs every morning, aggregating trending topics from major news sources, generates a concise digest, and delivers it via email or Line.', type: 'schedule', typeTags: ['Scheduled', 'News'], sampleQueries: ['Send me a daily news summary at 8 AM covering tech and business.'], connectors: ['Gmail', 'Line'], cover: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=640&h=360&fit=crop', userFlowUrl: '' },
  { id: 'one-click-doc', title: 'One-Click Document Creation', category: 'office', description: 'Give it a topic and it generates a well-structured document with headings, bullet points, and formatting — ready to share.', type: 'simple', typeTags: ['Docs', 'AI Writing'], sampleQueries: ['Create a project proposal document about our Q3 marketing campaign.'], connectors: [], cover: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=640&h=360&fit=crop', userFlowUrl: '' },
  { id: 'auto-spreadsheet', title: 'Auto Data Spreadsheet Generator', category: 'office', description: 'Describe what data you need and the agent builds an Excel-style spreadsheet with formulas, charts, and pivot-ready layout.', type: 'simple', typeTags: ['Data', 'Spreadsheet'], sampleQueries: ['Create a sales tracking spreadsheet with monthly totals and a chart.'], connectors: [], cover: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=640&h=360&fit=crop', userFlowUrl: '' },
  { id: 'kpi-dashboard', title: 'Business KPI Visual Dashboard', category: 'office', description: 'Connects to your data sources, auto-generates visual dashboards for key business metrics, and refreshes on a schedule.', type: 'multi-step', typeTags: ['Analytics', 'Dashboard'], sampleQueries: ['Build a KPI dashboard for our e-commerce conversion funnel.'], connectors: [], cover: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?w=640&h=360&fit=crop', userFlowUrl: '' },

  // ── Research ──
  { id: 'study-planner', title: 'Lightweight Study Planner', category: 'research', description: 'Creates a personalized study schedule based on your exam date, available hours, and subject difficulty.', type: 'multi-step', typeTags: ['Education', 'Planning'], sampleQueries: ['Plan a 30-day study schedule for my JLPT N2 exam.'], connectors: ['Google Calendar'], cover: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=640&h=360&fit=crop', userFlowUrl: '' },
  { id: 'deep-explainer', title: 'Deep Content Explainer', category: 'research', description: 'Paste a tough concept and this agent breaks it down step by step, finds analogies, and suggests practice problems.', type: 'simple', typeTags: ['Tutoring', 'Explanation'], sampleQueries: ['Explain transformer attention mechanism in simple terms.'], connectors: [], cover: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=640&h=360&fit=crop', userFlowUrl: '' },
  { id: 'ai-paper-reader', title: 'AI Paper Speed Reader', category: 'research', description: 'Paste an arXiv URL or paper title and the agent reads the full text, extracts the core contribution, methodology, results.', type: 'simple', typeTags: ['Paper Review', 'AI'], sampleQueries: ["Summarize the key findings of 'Attention Is All You Need'."], connectors: [], cover: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=640&h=360&fit=crop', userFlowUrl: '' },
  { id: 'daily-research-brief', title: 'Daily Research Briefing', category: 'research', description: 'Monitors arXiv, PubMed, and industry blogs. Every morning it delivers a curated briefing with paper titles and key findings.', type: 'schedule', typeTags: ['Scheduled', 'Research'], sampleQueries: ['Send me daily updates on LLM research papers from arXiv.'], connectors: ['Gmail'], cover: 'https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?w=640&h=360&fit=crop', userFlowUrl: '' },

  // ── Entertainment ──
  { id: 'lazy-trip-planner', title: 'Lazy Weekend Trip Planner', category: 'entertainment', description: 'Tell it your location, budget, and vibe preferences and it generates a complete day-trip or weekend plan.', type: 'multi-step', typeTags: ['Travel', 'Lifestyle'], sampleQueries: ['Plan a chill weekend trip near Tokyo under ¥15,000.'], connectors: ['Google Calendar'], cover: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=640&h=360&fit=crop', userFlowUrl: '' },
  { id: 'movie-recommender', title: 'Movie & Show Recommender', category: 'entertainment', description: 'Describe your mood or genre preference and get curated recommendations with ratings, where to stream, and trailers.', type: 'simple', typeTags: ['Movies', 'Recommendation'], sampleQueries: ['Recommend a mind-bending sci-fi movie I can watch tonight.'], connectors: [], cover: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=640&h=360&fit=crop', userFlowUrl: '' },
  { id: 'daily-horoscope', title: 'Daily Horoscope Action Guide', category: 'entertainment', description: 'Every morning, generates a personalized horoscope with specific, actionable advice for the day.', type: 'schedule', typeTags: ['Scheduled', 'Fun'], sampleQueries: ['Send me my Scorpio horoscope every morning at 7 AM.'], connectors: ['Line'], cover: 'https://images.unsplash.com/photo-1505506874110-6a7a69069a08?w=640&h=360&fit=crop', userFlowUrl: '' },
  { id: 'mbti-match', title: 'MBTI Compatibility Analysis', category: 'entertainment', description: 'Input two MBTI types and get a detailed compatibility breakdown — communication style, friction points, and advice.', type: 'simple', typeTags: ['Personality', 'Fun'], sampleQueries: ['How compatible are INTJ and ENFP in a relationship?'], connectors: [], cover: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=640&h=360&fit=crop', userFlowUrl: '' },

  // ── Lifestyle ──
  { id: 'daily-workout', title: 'Daily Workout Planner', category: 'lifestyle', description: 'Generates tomorrow\'s exercise plan based on your fitness level, available equipment, and goals.', type: 'schedule', typeTags: ['Scheduled', 'Fitness'], sampleQueries: ["Plan my workout for tomorrow — I have dumbbells and 40 minutes."], connectors: ['Line', 'Google Calendar'], cover: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=640&h=360&fit=crop', userFlowUrl: '' },
  { id: 'meal-recommender', title: 'Daily Meal Recommender', category: 'lifestyle', description: 'Report your taste, dietary needs, and location. The agent recommends meals with nutrition info and nearby restaurants.', type: 'simple', typeTags: ['Food', 'Health'], sampleQueries: ['What should I eat for lunch? I want something healthy near Shibuya.'], connectors: [], cover: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=640&h=360&fit=crop', userFlowUrl: '' },
  { id: 'habit-tracker', title: '21-Day Habit Builder & Tracker', category: 'lifestyle', description: 'Pick a habit you want to build. The agent sets up a 21-day challenge with daily reminders and streak tracking.', type: 'schedule', typeTags: ['Scheduled', 'Habits'], sampleQueries: ['Start a 21-day meditation habit with daily reminders at 7 AM.'], connectors: ['Line'], cover: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=640&h=360&fit=crop', userFlowUrl: '' },
  { id: 'weather-outfit', title: 'Weather & Outfit Advisor', category: 'lifestyle', description: 'Real-time weather with temperature, humidity, wind, and AQI — plus outfit suggestions.', type: 'simple', typeTags: ['Weather', 'Daily Life'], sampleQueries: ['What should I wear today in Tokyo?'], connectors: [], cover: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=640&h=360&fit=crop', userFlowUrl: '' },

  // ── Social Media ──
  { id: 'auto-social-content', title: 'Auto Social Media Content Creator', category: 'social-media', description: 'Pick your niche and platform. Handles topic selection, copywriting, hashtag optimization, and image suggestions.', type: 'multi-step', typeTags: ['Content', 'Automation'], sampleQueries: ['Generate 5 Instagram posts about minimalist living for this week.'], connectors: ['Instagram', 'X'], cover: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=640&h=360&fit=crop', userFlowUrl: '' },
  { id: 'video-script', title: 'Video Script Generator', category: 'social-media', description: 'Describe your video topic and audience. Generates a hook-driven script with scene breakdowns and talking points.', type: 'simple', typeTags: ['Video', 'Scriptwriting'], sampleQueries: ['Write a 3-minute YouTube script about productivity tips for students.'], connectors: [], cover: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=640&h=360&fit=crop', userFlowUrl: '' },

  // ── Finance ──
  { id: 'personal-finance', title: 'Personal Finance Advisor', category: 'finance', description: 'Categorizes transactions, analyzes spending patterns, and delivers personalized savings tips and budget forecasts.', type: 'multi-step', typeTags: ['Budgeting', 'Savings'], sampleQueries: ['Analyze my spending this month and suggest where I can save.'], connectors: [], cover: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=640&h=360&fit=crop', userFlowUrl: '' },
  { id: 'economic-data', title: 'Economic Data Explorer', category: 'finance', description: 'Query GDP, interest rates, CPI, unemployment, and other macro indicators across countries.', type: 'simple', typeTags: ['Economics', 'Data'], sampleQueries: ["Show me Japan's CPI trend for the last 12 months."], connectors: [], cover: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=640&h=360&fit=crop', userFlowUrl: '' },

  // ── Rakuten ──
  { id: 'smart-spending', title: 'Smart Spending Optimizer', category: 'rakuten', description: 'Connects to Rakuten Pay/Card, categorizes transactions, recommends cheaper alternatives, and applies coupons.', type: 'multi-step', typeTags: ['Spending', 'Rakuten Pay'], sampleQueries: ['Analyze my Rakuten Card spending this month and find savings.'], connectors: ['Rakuten Pay', 'Rakuten Card'], cover: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=640&h=360&fit=crop', userFlowUrl: '' },
  { id: 'point-maximizing', title: 'Rakuten Point Maximizer', category: 'rakuten', description: 'Tracks your Rakuten points balance & expiry, detects active SPU campaigns, and recommends the best redemption options.', type: 'multi-step', typeTags: ['Points', 'SPU'], sampleQueries: ['How can I maximize my Rakuten points before they expire?'], connectors: ['Rakuten Points'], cover: 'https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?w=640&h=360&fit=crop', userFlowUrl: '', featured: true },
  { id: 'price-watch', title: 'Rakuten Product Price Watch', category: 'rakuten', description: 'Save products you\'re eyeing, track price changes, monitor campaign discounts, and get notified at the optimal price.', type: 'schedule', typeTags: ['Price Tracking', 'Alerts'], sampleQueries: ['Track the price of this laptop on Rakuten and alert me when it drops.'], connectors: ['Rakuten Ichiba'], cover: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=640&h=360&fit=crop', userFlowUrl: '' },
  { id: 'weekly-grocery', title: 'Weekly Grocery Auto-Refill', category: 'rakuten', description: 'Tracks your consumption history, predicts refill needs, generates a cart, and compares merchant prices.', type: 'schedule', typeTags: ['Grocery', 'Scheduled'], sampleQueries: ['Generate my weekly grocery list based on past orders.'], connectors: ['Rakuten Ichiba'], cover: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=640&h=360&fit=crop', userFlowUrl: '' },
  { id: 'fashion-trend', title: 'Fashion Styling Trend Report', category: 'rakuten', description: 'Analyzes your style preferences, generates seasonal trend reports, and recommends outfits with shoppable links.', type: 'multi-step', typeTags: ['Fashion', 'Trends'], sampleQueries: ['What are the trending styles for spring 2026 that match my taste?'], connectors: ['Rakuten Fashion'], cover: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=640&h=360&fit=crop', userFlowUrl: '' },

  // ── Japan (Life Services) — Kenji cases 01–06, then Aoi persona storyline (subset) ──
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
      'Book next week\'s client visit: trains, stay near the meeting venue, and omiyage ideas under ¥3,000.',
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
      'Meeting follow-up without the scramble: drop in notes, bullets, or a Teams recap and get owners and deadlines structured, focus time on the calendar, and a draft slide outline you can share—built for the "Friday deck" moment when raw input has to become something presentable fast.',
    type: 'multi-step',
    typeTags: ['Meetings', 'MS Teams', 'Slides'],
    sampleQueries: [
      'Turn these notes into an action list and a 5-slide outline for my Friday presentation.',
      'Summarize today\'s partner meeting from Teams and add my tasks to the calendar.',
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
      'Draft a thank-you email to the partner team after today\'s meeting — respectful but warm.',
      'Write a 依頼 mail to my manager asking for approval — keigo correct for internal hierarchy.',
    ],
    connectors: ['Gmail', 'Google Calendar'],
    cover: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=640&h=360&fit=crop',
    userFlowUrl: '',
    featured: true,
    hot: true,
  },

  // Aoi persona storyline (Rakuten AI · household / Life Services)
  {
    id: 'aoi-morning-crisis',
    title: 'Order & Planning Assistant',
    category: 'japan',
    japanSub: 'daily-life',
    description:
      'One message while breakfast is on the stove: reorder your usual diapers on Ichiba, resolve playgroup vs. checkup clashes on Google Calendar, and get a toddler-friendly dinner idea from Cooking Partner—without hopping between apps.',
    type: 'multi-step',
    typeTags: ['Life Services', 'Ichiba', 'Family'],
    sampleQueries: [
      'Diapers are out—order my usual Merries S, two packs. Thursday playgroup conflicts with Sora\'s 10 AM checkup—move playgroup to Friday and keep the checkup. Suggest something easy for dinner tonight.',
      'Morning rush: reorder diapers from my last Ichiba purchase, fix the calendar clash between nursery and dentist, and give me a 20-minute dinner I can make tonight.',
    ],
    connectors: ['Rakuten Ichiba', 'Rakuten Card', 'Google Calendar', 'Cooking Partner'],
    cover: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=640&h=360&fit=crop',
    userFlowUrl: '',
    hot: true,
  },
  {
    id: 'aoi-marathon-meal-split',
    title: 'Marathon Meals + Multi-Shop Checkout',
    category: 'japan',
    japanSub: 'daily-life',
    description:
      'During お買い物マラソン, AI plans toddler-safe weeknight dinners, splits ingredients across enough Ichiba shops to hit the next Points tier, and checks out with Rakuten Card—so the same grocery spend earns more Super Points without spreadsheet math.',
    type: 'multi-step',
    typeTags: ['Life Services', 'Marathon', 'Cooking Partner'],
    sampleQueries: [
      'Plan five dinners this week—toddler-friendly, under 30 minutes each. Order ingredients from Ichiba. It\'s Marathon—split across shops so we hit as many shops as possible for the multiplier.',
      'Marathon is on: build my weekly meal plan and split Ichiba carts so I reach the 5× shop tier without overspending.',
    ],
    connectors: ['Cooking Partner', 'Rakuten Ichiba', 'Rakuten Card', 'Rakuten Marathon'],
    cover: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=640&h=360&fit=crop',
    userFlowUrl: '',
    hot: true,
  },
  {
    id: 'aoi-kids-clothing-loop',
    title: 'Children\'s Outgrown Clothes Suggestions',
    category: 'japan',
    japanSub: 'daily-life',
    description:
      'Close the kids\' clothing loop in one flow: draft Rakuma listings from what your child outgrew, price with comps, then find the next size on Ichiba and offset with Super Points—sell the bag in the closet and stock the next season before sizes run out.',
    type: 'multi-step',
    typeTags: ['Life Services', 'Rakuma', 'Ichiba'],
    sampleQueries: [
      'Sora outgrew 90cm. I have a Familiar dress (like new), UNIQLO leggings 3-pack (good), Nike sneakers 14cm (worn twice)—list on Rakuma, then find 2–3 summer 100cm outfits on Ichiba under ¥3,000 using Points if possible.',
      'List these outgrown kids\' items on Rakuma with fair prices, then suggest Ichiba replacements one size up with Points-friendly checkout.',
    ],
    connectors: ['Rakuma', 'Rakuten Ichiba', 'Rakuten Card'],
    cover: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=640&h=360&fit=crop',
    userFlowUrl: '',
    hot: true,
  },
  {
    id: 'aoi-proactive-family-trip',
    title: 'Family Trip Planning',
    category: 'japan',
    japanSub: 'daily-life',
    description:
      'When a family-sized window opens (e.g. Golden Week), AI reads the shared calendar, filters Rakuten Travel for child-friendly resorts and cribs, quotes the stay, and drops the trip on the calendar—proactive trip planning before intent fades.',
    type: 'multi-step',
    typeTags: ['Life Services', 'Rakuten Travel', 'Family'],
    sampleQueries: [
      'Golden Week looks open on our family calendar—surface a child-friendly Okinawa resort with a crib, show total price, and draft the booking summary.',
      'We have a long weekend free—find a domestic family hotel on Rakuten Travel with breakfast and play area, and add the hold to Google Calendar.',
    ],
    connectors: ['Google Calendar', 'Rakuten Travel', 'Rakuten Card'],
    cover: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=640&h=360&fit=crop',
    userFlowUrl: '',
    hot: true,
  },
  {
    id: 'aoi-moms-line-reply',
    title: 'Line Message Assistant',
    category: 'japan',
    japanSub: 'communication',
    description:
      'For neighborhood or class LINE threads where tone matters, get a short, natural Japanese reply—warm 〜 endings and light emoji when it fits—then send in one tap so you do not overthink after a long day.',
    type: 'simple',
    typeTags: ['Life Services', 'LINE', 'Community'],
    sampleQueries: [
      'Reply to my moms\' LINE group—we\'re coming to the picnic; Sora and I will bring sandwiches. Warm, natural tone, not too formal.',
      'Someone asked who can bring drinks to the park meetup—volunteer us for juice boxes in a friendly, casual way.',
    ],
    connectors: ['Line'],
    cover: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=640&h=360&fit=crop',
    userFlowUrl: '',
    hot: true,
  },

  // ── Japan ──
  { id: 'jp-rirekisho', title: 'Rirekisho Format', category: 'japan', japanSub: 'job-hunting', description: 'Auto-fill and format a Japan-standard CV (履歴書). Input your details and get a perfectly formatted rirekisho ready for printing or PDF export.', type: 'simple', typeTags: ['就活', 'CV'], sampleQueries: ['Create a rirekisho from my LinkedIn profile.'], connectors: [], cover: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=640&h=360&fit=crop', userFlowUrl: '', featured: true, hot: true },
  { id: 'jp-mock-interview', title: 'Agent Mock Interview', category: 'japan', japanSub: 'job-hunting', description: 'Practice 自己PR and 志望動機 with AI feedback. Simulates real Japanese job interview scenarios and provides detailed improvement suggestions.', type: 'multi-step', typeTags: ['就活', '面接'], sampleQueries: ['Practice a mock interview for a marketing position at a Japanese company.'], connectors: [], cover: 'https://images.unsplash.com/photo-1565688534245-05d6b5be184a?w=640&h=360&fit=crop', userFlowUrl: '' },
  { id: 'jp-kakutei-shinkoku', title: '確定申告 Tax Filing', category: 'japan', japanSub: 'bureaucracy', description: 'Tax filing walkthrough for freelancers and employees in Japan. Guides you through 確定申告 forms, deductions, and e-Tax submission.', type: 'multi-step', typeTags: ['行政', '税金'], sampleQueries: ['Walk me through filing 確定申告 as a freelancer.'], connectors: [], cover: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=640&h=360&fit=crop', userFlowUrl: '' },
  { id: 'jp-trip-planner', title: 'Business Trip Companion', category: 'japan', japanSub: 'daily-life', description: 'The complete 出張 companion — covering packing checklists, Shinkansen booking, expense report filing, all in one automated flow.', type: 'multi-step', typeTags: ['出張', 'ビジネス'], sampleQueries: ['Plan my 2-day business trip to Osaka next week.'], connectors: ['Rakuten Travel', 'Google Calendar'], cover: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=640&h=360&fit=crop', userFlowUrl: '', featured: true, hot: true },
  { id: 'jp-train-delays', title: 'Train Delay Assistant', category: 'japan', japanSub: 'daily-life', description: 'Instant alternate route suggestions when trains are delayed, plus automatic delay certificate (遅延証明書) generation for your employer.', type: 'simple', typeTags: ['生活', '電車'], sampleQueries: ['My Chuo Line is delayed — find me an alternate route to Shinjuku.'], connectors: [], cover: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=640&h=360&fit=crop', userFlowUrl: '' },
  { id: 'jp-business-keigo', title: 'Business Keigo Writer', category: 'japan', japanSub: 'communication', description: 'Rewrites casual messages in appropriate 敬語 for business contexts. Supports emails, Slack messages, and formal documents.', type: 'simple', typeTags: ['日本語', '敬語'], sampleQueries: ['Rewrite this Slack message in proper business keigo.'], connectors: [], cover: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=640&h=360&fit=crop', userFlowUrl: '' },
]

export const MY_ACTIVE_TASKS: ActiveTask[] = [
  { id: 'case-weekly-report', status: 'running', schedule: 'Every Monday at 8:00 AM', lastRun: '2026-04-07 08:00', nextRun: '2026-04-14 08:00' },
  { id: 'case-email-todo', status: 'completed', lastRun: '2026-04-09 14:32' },
  { id: 'daily-news-digest', status: 'running', schedule: 'Every day at 7:30 AM', lastRun: '2026-04-10 07:30', nextRun: '2026-04-11 07:30' },
  { id: 'daily-workout', status: 'running', schedule: 'Every day at 6:00 AM', lastRun: '2026-04-10 06:00', nextRun: '2026-04-11 06:00' },
  { id: 'habit-tracker', status: 'running', schedule: 'Every day at 9:00 PM', lastRun: '2026-04-09 21:00', nextRun: '2026-04-10 21:00' },
]
