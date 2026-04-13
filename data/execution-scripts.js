/**
 * Demo execution scripts: chat transcript + per-step thinking chain aligned with each case’s agent workflow.
 * UI copy is English only.
 */
window.EXECUTION_SCRIPTS = {
  "case-email-todo": {
    supportedTaskTypes: ["Long", "On-demand"],
    primaryTaskType: "Long",
    modelLabel: "Rakuten AI (MultiModel)",
    demoUserInput:
      "Find the email tasks I need to handle this week and schedule time on my calendar. Please flag urgent vs. normal vs. low priority and create a focused block for replies.",
    agentOpening:
      "I’ll verify Outlook and Microsoft Calendar access, read this week’s mail, extract action items with deadlines, classify priority, build a checklist, then reserve a focus block that fits your free time.",
    computerTitle: "Rakuten AI workspace",
    computerSubtitle: "Outlook · MS Calendar",
    toolContextLabel: "Using Editor + connectors",
    steps: [
      {
        progressLabel: "Read emails from Outlook within the specified time range.",
        narrative:
          "Pulling messages for Mon–Sun and grouping by thread so nothing actionable is missed.",
        thinkingChain: [
          { kind: "knowledge", label: "Knowledge recalled (1): priority cues (ASAP, EOD, FYI)" },
          { kind: "connector", label: "Outlook: authorize and list messages in range" },
          { kind: "tool", label: "Normalize senders, subjects, and receipt timestamps" },
          { kind: "log", label: "Connector status: Microsoft 365 — active session resumed." },
        ],
        intermediate:
          "Intermediate result: 52 messages in scope; 23 threads look task-like after filtering newsletters.",
      },
      {
        progressLabel:
          "Extract action items, deadlines, and request types from the emails.",
        narrative: "Parsing sentences that imply an owner, due date, or expected reply.",
        thinkingChain: [
          { kind: "tool", label: "NER-style extraction for deadlines and owners" },
          { kind: "knowledge", label: "Knowledge recalled (1): reply-request vs. FYI-only" },
          { kind: "log", label: "Flagged 31 candidate todos across 18 threads." },
        ],
        intermediate:
          "Intermediate result: 14 items have explicit dates; 7 are implicit (\"by Friday\" → resolved to calendar week).",
      },
      {
        progressLabel: "Classify emails by priority.",
        narrative: "Mapping signals (sender tier, keywords, SLA hints) into urgent / normal / low.",
        thinkingChain: [
          { kind: "knowledge", label: "Policy: exec senders + \"urgent\" → Urgent lane" },
          { kind: "tool", label: "Score threads; break ties with last-activity age" },
        ],
        intermediate:
          "Intermediate result: 6 Urgent · 11 Normal · 6 Low (remaining FYI archived from checklist).",
      },
      {
        progressLabel: "Generate a checklist.",
        narrative: "Emitting a structured checklist your Agent UI can pin or export.",
        thinkingChain: [
          { kind: "tool", label: "Render checklist rows with links back to Outlook threads" },
          { kind: "log", label: "Form-based confirmation sheet generated (user can edit titles)." },
        ],
        intermediate: "Checklist v1 ready — 23 actionable rows with deep links.",
      },
      {
        progressLabel: "Check the user’s calendar availability.",
        narrative: "Finding contiguous focus time respecting working hours and existing meetings.",
        thinkingChain: [
          { kind: "connector", label: "MS Calendar: read busy/free for next 5 business days" },
          { kind: "tool", label: "Propose 45-minute block closest to urgency cluster" },
        ],
        intermediate:
          "Intermediate result: best slot Thu 15:30–16:15 (local); alt. Fri 09:00–09:45.",
      },
      {
        progressLabel: "Create a calendar event for focused handling time.",
        narrative: "Creating the focus block titled from your top urgent thread subject.",
        thinkingChain: [
          { kind: "connector", label: "MS Calendar: create event \"Email triage — urgent batch\"" },
          { kind: "log", label: "Invite set to private; no attendees; reminder 10 minutes." },
        ],
        intermediate: "Calendar event created and confirmed in your primary calendar.",
      },
      {
        progressLabel: "Return the summary and scheduling result.",
        narrative: "Packaging summary + checklist + calendar confirmation for the chat transcript.",
        thinkingChain: [
          { kind: "tool", label: "Assemble final structured response for Task Execution System" },
          { kind: "knowledge", label: "Offer \"Save as Task\" preset for weekly re-run (optional)" },
        ],
        intermediate: null,
      },
    ],
    finalMessage:
      "Here’s the outcome:\n\nPriority split: 6 urgent · 11 normal · 6 low.\nChecklist: 23 items with thread links are reflected in the execution panel above.\nCalendar: I reserved Thu 15:30–16:15 for focused replies.\n\nIf you want a different slot, say “move the focus block to Friday morning,” or use Try it yourself to adjust inputs. Interrupt / Retry for granular control is planned for v2.",
  },

  "case-receipt-bill": {
    supportedTaskTypes: ["Long", "On-demand"],
    primaryTaskType: "Long",
    modelLabel: "Rakuten AI (MultiModel)",
    demoUserInput:
      "Search all billing emails in my inbox from the last 90 days, identify which services are still active, and prepare cancellation emails where possible.",
    agentOpening:
      "I’ll authorize Outlook, search receipts / invoices / subscriptions in that window, extract structured fields, group renewals, summarize spend, surface cancellation entry points, and draft outreach where no portal exists.",
    computerTitle: "Rakuten AI workspace",
    computerSubtitle: "Outlook",
    toolContextLabel: "Using subscription audit tools",
    steps: [
      {
        progressLabel:
          "Search Outlook for receipt / invoice / bill / booking / subscription emails within the specified time range.",
        narrative: "Applying keyword + sender heuristics for billing-like threads.",
        thinkingChain: [
          { kind: "connector", label: "Outlook: scoped search last 90 days" },
          { kind: "tool", label: "Expand with known merchant domains (SaaS, travel, utilities)" },
          { kind: "log", label: "Raw hit set: 126 messages." },
        ],
        intermediate: "Intermediate result: 74 high-confidence billing threads after de-duplication.",
      },
      {
        progressLabel: "Extract structured fields.",
        narrative: "Pulling merchant, amounts, dates, plan names, and cadence hints.",
        thinkingChain: [
          { kind: "tool", label: "Parse PDF/HTML parts where needed" },
          { kind: "knowledge", label: "Normalize currencies to JPY display for summary" },
        ],
        intermediate: "Intermediate result: 61 rows with amount confidence ≥ medium.",
      },
      {
        progressLabel: "Group and identify recurring / active services.",
        narrative: "Clustering by merchant + billing descriptor to spot active renewals.",
        thinkingChain: [
          { kind: "tool", label: "Detect renewal keywords: annual, auto-renew, next charge" },
          { kind: "log", label: "Merged 12 duplicates into 9 logical subscriptions." },
        ],
        intermediate: "Intermediate result: **9 active** recurring services flagged.",
      },
      {
        progressLabel: "Summarize spending and currently active services.",
        narrative: "Rolling up totals per service and trend (up/down vs. prior period).",
        thinkingChain: [
          { kind: "knowledge", label: "Knowledge recalled (1): exclude one-off static e-receipts" },
          { kind: "tool", label: "Build spend table + export snippet" },
        ],
        intermediate: "Intermediate result: top spend drivers highlighted in the execution card.",
      },
      {
        progressLabel: "Extract subscription management or cancellation entry points.",
        narrative: "Mining help links, “manage subscription,” and billing portals from bodies.",
        thinkingChain: [
          { kind: "tool", label: "Resolve redirects; prefer HTTPS vendor pages" },
          { kind: "log", label: "7 direct manage URLs found; 2 require login-first." },
        ],
        intermediate: "Intermediate result: deep links attached per service row.",
      },
      {
        progressLabel:
          "If no direct entry point is available, generate cancellation suggestions or draft emails.",
        narrative: "For opaque billers, drafting concise cancel requests with account-safe placeholders.",
        thinkingChain: [
          { kind: "tool", label: "Template: cancellation email (EN) with [ACCOUNT_ID] slots" },
          { kind: "knowledge", label: "Compliance note: never fabricate account numbers" },
        ],
        intermediate: "2 draft emails prepared for merchants without self-serve pages.",
      },
      {
        progressLabel: "Return the final result.",
        narrative: "Delivering spreadsheet-style summary + drafts + link list.",
        thinkingChain: [
          { kind: "tool", label: "Package response for Task Center “Save as Task”" },
        ],
        intermediate: null,
      },
    ],
    finalMessage:
      "Audit summary (90 days): 9 active recurring services; 7 have manage/cancel URLs; 2 need email-based cancellation.\nDrafts are ready for the two portal-less vendors.\n\nUse Watch again to replay the chain, or Try it yourself to narrow to “SaaS only” or extend to 180 days. Interrupt / Retry is planned for v2.",
  },

  "daily-news-digest": {
    supportedTaskTypes: ["Scheduled"],
    primaryTaskType: "Scheduled",
    modelLabel: "Rakuten AI (MultiModel)",
    demoUserInput:
      "Set up a daily news digest at 7:30 AM. Cover tech, business, and AI topics. Send it to my Gmail.",
    agentOpening:
      "I'll configure a scheduled job for 7:30 AM daily, pull trending stories from news APIs and RSS feeds, classify them by topic, generate a concise digest, and deliver it to your Gmail inbox.",
    computerTitle: "Rakuten AI workspace",
    computerSubtitle: "News APIs · Gmail",
    toolContextLabel: "Scheduled news aggregation",
    steps: [
      {
        progressLabel: "Configure schedule and topic preferences.",
        narrative: "Saving cron `30 7 * * *` with topic filters: tech, business, AI.",
        thinkingChain: [
          { kind: "tool", label: "Parse schedule: daily at 07:30 (Asia/Tokyo)" },
          { kind: "knowledge", label: "Topic taxonomy: tech, business, AI, general" },
          { kind: "log", label: "Task saved as Scheduled with Gmail delivery." },
        ],
        intermediate: "Schedule configured: every day at 7:30 AM JST.",
      },
      {
        progressLabel: "Fetch trending stories from multiple sources.",
        narrative: "Querying RSS feeds, news APIs, and trending topic endpoints.",
        thinkingChain: [
          { kind: "connector", label: "News API: top headlines for tech, business" },
          { kind: "tool", label: "RSS: parse TechCrunch, HackerNews, Nikkei feeds" },
          { kind: "log", label: "Raw pool: 187 articles in scope." },
        ],
        intermediate: "187 candidate articles fetched from 12 sources.",
      },
      {
        progressLabel: "Classify, deduplicate, and rank stories.",
        narrative: "Removing duplicates, scoring by relevance and freshness.",
        thinkingChain: [
          { kind: "tool", label: "Semantic dedup: 187 → 94 unique stories" },
          { kind: "knowledge", label: "Boost score for AI + business intersection" },
          { kind: "tool", label: "Rank by composite score (recency × relevance)" },
        ],
        intermediate: "Top 15 stories selected across 3 categories.",
      },
      {
        progressLabel: "Generate concise digest with summaries.",
        narrative: "Writing 2-3 sentence summaries for each top story.",
        thinkingChain: [
          { kind: "tool", label: "Summarize each article: headline + key takeaway" },
          { kind: "tool", label: "Format into HTML email template" },
        ],
        intermediate: "Digest generated: 5 tech · 5 business · 5 AI stories.",
      },
      {
        progressLabel: "Deliver digest via Gmail.",
        narrative: "Sending formatted email to your inbox.",
        thinkingChain: [
          { kind: "connector", label: "Gmail: send digest email with subject line" },
          { kind: "log", label: "Email delivered successfully at 07:30 JST." },
        ],
        intermediate: null,
      },
    ],
    finalMessage:
      "Your Daily News Digest is set up and running!\n\nSchedule: Every day at 7:30 AM\nTopics: Tech (5) · Business (5) · AI (5)\nDelivery: Gmail inbox\n\nToday's highlights include OpenAI's latest model release, Japan's semiconductor investment update, and a major fintech acquisition. Check your inbox for the full digest!",
  },

  "lazy-trip-planner": {
    supportedTaskTypes: ["Long", "On-demand"],
    primaryTaskType: "Long",
    modelLabel: "Rakuten AI (MultiModel)",
    demoUserInput:
      "Plan a chill weekend trip near Tokyo for 2 people, budget under ¥20,000. We like nature, good food, and onsen.",
    agentOpening:
      "I'll search for destinations within 2 hours of Tokyo matching your vibe, find the best spots, plan a route with timing, pick restaurants, and optionally add it to your calendar.",
    computerTitle: "Rakuten AI workspace",
    computerSubtitle: "Travel · Google Calendar",
    toolContextLabel: "Trip planning engine",
    steps: [
      {
        progressLabel: "Analyze preferences and search destinations.",
        narrative: "Parsing: nature + food + onsen, budget ¥20K, 2 pax, near Tokyo.",
        thinkingChain: [
          { kind: "knowledge", label: "Preference tags: nature, food, onsen, budget-friendly" },
          { kind: "tool", label: "Search destinations: Hakone, Chichibu, Okutama, Kamakura" },
          { kind: "log", label: "4 candidate areas scored by match." },
        ],
        intermediate: "Top match: Hakone (nature ✓, onsen ✓, food ✓, within budget ✓).",
      },
      {
        progressLabel: "Build detailed itinerary with time slots.",
        narrative: "Creating a morning-to-evening schedule with travel times.",
        thinkingChain: [
          { kind: "tool", label: "Route optimizer: Shinjuku → Hakone-Yumoto → loop course" },
          { kind: "knowledge", label: "Factor in Romancecar schedule (85 min direct)" },
          { kind: "tool", label: "Slot: 9AM depart → 10:30 arrive → activities → 7PM return" },
        ],
        intermediate: "Itinerary: 6 stops across the day with transit details.",
      },
      {
        progressLabel: "Select restaurants and food spots.",
        narrative: "Finding highly-rated spots along the route within budget.",
        thinkingChain: [
          { kind: "tool", label: "Search: soba lunch near Hakone-Yumoto, avg ¥1,200/pax" },
          { kind: "tool", label: "Dinner: kaiseki at onsen ryokan, ¥3,500 set course" },
          { kind: "log", label: "3 food stops: morning café, soba lunch, kaiseki dinner." },
        ],
        intermediate: "Food plan: ¥6,400 total for 2 people across 3 meals.",
      },
      {
        progressLabel: "Estimate total cost and breakdown.",
        narrative: "Summing transport, food, activities, and onsen fees.",
        thinkingChain: [
          { kind: "tool", label: "Transport: ¥4,600 (Romancecar round-trip × 2)" },
          { kind: "tool", label: "Activities: ¥2,400 (onsen + Owakudani entry)" },
          { kind: "tool", label: "Food: ¥6,400 · Total: ¥13,400 — under ¥20K ✓" },
        ],
        intermediate: "Budget: ¥13,400 / ¥20,000 — ¥6,600 to spare.",
      },
      {
        progressLabel: "Generate final trip card and calendar option.",
        narrative: "Packaging everything into a shareable trip plan.",
        thinkingChain: [
          { kind: "connector", label: "Google Calendar: optionally add as all-day event" },
          { kind: "tool", label: "Render trip card with map pins and links" },
        ],
        intermediate: null,
      },
    ],
    finalMessage:
      "Your Hakone Day Trip is ready! 🗻\n\nRoute: Shinjuku → Hakone-Yumoto → Owakudani → Lake Ashi → Onsen → Return\nHighlights: Open-air onsen, volcanic valley, lake cruise, handmade soba\nBudget: ¥13,400 for 2 (¥6,600 under budget)\nTravel: Romancecar 85 min each way\n\nWant me to add this to your Google Calendar, or adjust the plan?",
  },

  "auto-social-content": {
    supportedTaskTypes: ["Long", "On-demand"],
    primaryTaskType: "Long",
    modelLabel: "Rakuten AI (MultiModel)",
    demoUserInput:
      "Generate 5 Instagram posts about minimalist living for this week. Include captions, hashtags, and image style suggestions.",
    agentOpening:
      "I'll research trending minimalism topics, generate 5 unique post concepts with captions, optimize hashtags for reach, and suggest matching visual styles — all ready to publish.",
    computerTitle: "Rakuten AI workspace",
    computerSubtitle: "Instagram · Content Engine",
    toolContextLabel: "Social media automation",
    steps: [
      {
        progressLabel: "Research trending topics in the niche.",
        narrative: "Scanning Instagram trends, Pinterest pins, and blog posts about minimalism.",
        thinkingChain: [
          { kind: "tool", label: "Trend analysis: top minimalism hashtags this week" },
          { kind: "knowledge", label: "Audience insight: 25-35 age group, lifestyle-oriented" },
          { kind: "log", label: "5 trending angles identified." },
        ],
        intermediate: "Trends: capsule wardrobe, digital declutter, one-in-one-out rule, white space design, mindful spending.",
      },
      {
        progressLabel: "Generate 5 post concepts with unique angles.",
        narrative: "Creating distinct post ideas that won't feel repetitive.",
        thinkingChain: [
          { kind: "tool", label: "Post #1: 'The 30-Day Declutter Challenge' — carousel" },
          { kind: "tool", label: "Post #2: 'Why I Own Only 33 Items' — story hook" },
          { kind: "tool", label: "Posts #3-5: tips, before/after, quote graphic" },
        ],
        intermediate: "5 post concepts drafted with content types (carousel, reel, static, story, quote).",
      },
      {
        progressLabel: "Write captions with engagement hooks.",
        narrative: "Crafting scroll-stopping first lines and clear CTAs.",
        thinkingChain: [
          { kind: "knowledge", label: "Hook pattern: question → pain point → solution → CTA" },
          { kind: "tool", label: "Write 5 captions, each 100-150 words with emoji" },
        ],
        intermediate: "All 5 captions written with hooks and call-to-actions.",
      },
      {
        progressLabel: "Optimize hashtags for maximum reach.",
        narrative: "Mixing high-volume and niche hashtags for each post.",
        thinkingChain: [
          { kind: "tool", label: "Hashtag research: 30 tags per post, mixed volume" },
          { kind: "log", label: "Avg predicted reach: 2.4K-8.7K per post." },
        ],
        intermediate: "Hashtag sets optimized: 5 broad + 15 niche + 10 micro per post.",
      },
      {
        progressLabel: "Suggest visual styles and post to drafts.",
        narrative: "Matching each concept to an aesthetic direction.",
        thinkingChain: [
          { kind: "tool", label: "Visual brief: warm tones, flat lay, clean backgrounds" },
          { kind: "connector", label: "Instagram: save as draft posts (demo)" },
        ],
        intermediate: null,
      },
    ],
    finalMessage:
      "Your 5 Instagram posts are ready!\n\nMon: 'The 30-Day Declutter Challenge' (carousel)\nTue: 'Why I Own Only 33 Items' (story-style reel)\nWed: '5 Spaces to Declutter This Weekend' (tips carousel)\nThu: Before/After Room Transformation (static)\nFri: Minimalist Quote of the Week (graphic)\n\nEach has captions, 30 optimized hashtags, and visual direction. Shall I schedule them or adjust the tone?",
  },

  "ai-paper-reader": {
    supportedTaskTypes: ["On-demand"],
    primaryTaskType: "On-demand",
    modelLabel: "Rakuten AI (MultiModel)",
    demoUserInput:
      "Summarize the key findings of 'Attention Is All You Need' and compare it with recent efficient attention methods.",
    agentOpening:
      "I'll read the full paper, extract the core contribution and architecture details, then compare with recent efficient attention variants like FlashAttention and linear attention approaches.",
    computerTitle: "Rakuten AI workspace",
    computerSubtitle: "Paper Analysis Engine",
    toolContextLabel: "Academic paper reader",
    steps: [
      {
        progressLabel: "Retrieve and parse the target paper.",
        narrative: "Fetching the full text from arXiv and parsing sections.",
        thinkingChain: [
          { kind: "tool", label: "arXiv fetch: 1706.03762 (Vaswani et al., 2017)" },
          { kind: "tool", label: "Parse: abstract, introduction, method, results, conclusion" },
          { kind: "log", label: "Paper loaded: 15 pages, 6 sections." },
        ],
        intermediate: "Paper parsed successfully with all figures and tables.",
      },
      {
        progressLabel: "Extract core contribution and methodology.",
        narrative: "Identifying the key innovation and technical approach.",
        thinkingChain: [
          { kind: "knowledge", label: "Core: self-attention replaces recurrence and convolution" },
          { kind: "tool", label: "Extract: multi-head attention, positional encoding, encoder-decoder" },
        ],
        intermediate: "Key innovation: pure attention mechanism with O(n²) complexity but massive parallelization advantage.",
      },
      {
        progressLabel: "Summarize results and impact.",
        narrative: "Pulling BLEU scores and downstream adoption evidence.",
        thinkingChain: [
          { kind: "tool", label: "Results: 28.4 BLEU on EN-DE, 41.0 on EN-FR (SOTA at time)" },
          { kind: "knowledge", label: "Impact: foundation for BERT, GPT, and all modern LLMs" },
        ],
        intermediate: "Results extracted with comparison to previous SOTA.",
      },
      {
        progressLabel: "Compare with recent efficient attention methods.",
        narrative: "Finding and analyzing FlashAttention, linear attention, and sparse variants.",
        thinkingChain: [
          { kind: "tool", label: "Search related: FlashAttention (Dao 2022), Linformer, Performer" },
          { kind: "tool", label: "Compare: complexity, memory, speed, quality trade-offs" },
          { kind: "knowledge", label: "FlashAttention: same O(n²) but IO-aware → 2-4× faster" },
        ],
        intermediate: "Comparison table built across 4 methods.",
      },
    ],
    finalMessage:
      "Paper Summary: 'Attention Is All You Need'\n\nCore Idea: Replace RNNs/CNNs with pure self-attention (Transformer). Multi-head attention allows parallel processing of all positions simultaneously.\n\nKey Results: 28.4 BLEU (EN-DE), trained in 3.5 days on 8 GPUs — 10× faster than previous SOTA.\n\nModern Comparison:\n• FlashAttention: Same math, 2-4× faster via IO-aware memory tiling\n• Linformer: O(n) approx, slight quality loss\n• Performer: O(n) via random features, good for long sequences\n\nThe original Transformer remains the backbone of GPT-4, Claude, and all major LLMs. Efficient variants improve speed but haven't replaced the core architecture.",
  },

  "daily-workout": {
    supportedTaskTypes: ["Scheduled"],
    primaryTaskType: "Scheduled",
    modelLabel: "Rakuten AI (MultiModel)",
    demoUserInput:
      "Plan my workout for tomorrow — I have dumbbells and 40 minutes. Send me a reminder at 6 AM on Line.",
    agentOpening:
      "I'll create a 40-minute dumbbell workout based on your fitness profile, schedule it for tomorrow, and set up a 6 AM Line reminder. I'll also adapt future sessions based on your feedback.",
    computerTitle: "Rakuten AI workspace",
    computerSubtitle: "Fitness · Line · Calendar",
    toolContextLabel: "Workout planning engine",
    steps: [
      {
        progressLabel: "Analyze available equipment and time constraint.",
        narrative: "Setting parameters: dumbbells only, 40 min, intermediate level.",
        thinkingChain: [
          { kind: "knowledge", label: "Profile: intermediate, no injuries noted" },
          { kind: "tool", label: "Filter exercises: dumbbell-compatible, compound + isolation" },
          { kind: "log", label: "Exercise pool: 24 movements available." },
        ],
        intermediate: "Equipment: dumbbells | Time: 40 min | Level: intermediate.",
      },
      {
        progressLabel: "Design balanced workout with warm-up and cool-down.",
        narrative: "Building a push/pull split with progressive overload tracking.",
        thinkingChain: [
          { kind: "tool", label: "Today: upper body push focus (chest, shoulders, triceps)" },
          { kind: "tool", label: "Structure: 5 min warm-up → 30 min main → 5 min stretch" },
          { kind: "knowledge", label: "Include: DB press, lateral raise, overhead press, skull crushers" },
        ],
        intermediate: "6 exercises × 3 sets each, rest 60s between sets.",
      },
      {
        progressLabel: "Generate detailed exercise plan with reps and rest.",
        narrative: "Specifying exact sets, reps, and tempo for each movement.",
        thinkingChain: [
          { kind: "tool", label: "Format: exercise name, sets × reps, weight suggestion, rest" },
          { kind: "log", label: "Total volume: ~4,800 reps·kg estimated." },
        ],
        intermediate: "Full plan: warm-up + 6 exercises + cool-down stretch sequence.",
      },
      {
        progressLabel: "Schedule reminder and calendar event.",
        narrative: "Setting up Line push notification and optional calendar block.",
        thinkingChain: [
          { kind: "connector", label: "Line: schedule push at 06:00 tomorrow" },
          { kind: "connector", label: "Google Calendar: add 'Workout — Upper Push' 06:00-06:40" },
          { kind: "log", label: "Reminder and event confirmed." },
        ],
        intermediate: null,
      },
    ],
    finalMessage:
      "Tomorrow's Workout is Ready! 💪\n\nType: Upper Body Push (Dumbbells Only)\nDuration: 40 minutes\nReminder: 6:00 AM via Line\n\nPlan:\n1. Dynamic warm-up (5 min)\n2. DB Bench Press — 3×12\n3. DB Overhead Press — 3×10\n4. Lateral Raises — 3×15\n5. Incline DB Fly — 3×12\n6. Tricep Kickbacks — 3×12\n7. Skull Crushers — 3×10\n8. Stretch & cool-down (5 min)\n\nI'll check in tomorrow evening to log how it went and plan the next session!",
  },

  "quant-backtest": {
    supportedTaskTypes: ["Long", "On-demand"],
    primaryTaskType: "Long",
    modelLabel: "Rakuten AI (MultiModel)",
    demoUserInput:
      "Backtest a simple moving average crossover strategy on Nikkei 225 for the last 5 years. Use 50-day and 200-day SMAs.",
    agentOpening:
      "I'll translate your SMA crossover strategy into rules, fetch 5 years of Nikkei 225 data, run the backtest, and report key performance metrics including Sharpe ratio, max drawdown, and equity curve.",
    computerTitle: "Rakuten AI workspace",
    computerSubtitle: "Quantitative Analysis Engine",
    toolContextLabel: "Strategy backtesting",
    steps: [
      {
        progressLabel: "Parse strategy rules from natural language.",
        narrative: "Converting 'SMA crossover 50/200' into formal trading rules.",
        thinkingChain: [
          { kind: "knowledge", label: "Strategy: buy when SMA50 crosses above SMA200 (golden cross)" },
          { kind: "tool", label: "Rules: long on golden cross, exit on death cross, no shorting" },
          { kind: "log", label: "Strategy compiled: 2 rules, long-only, no leverage." },
        ],
        intermediate: "Rules: BUY when SMA(50) > SMA(200), SELL when SMA(50) < SMA(200).",
      },
      {
        progressLabel: "Fetch historical price data.",
        narrative: "Loading Nikkei 225 daily OHLCV from April 2021 to April 2026.",
        thinkingChain: [
          { kind: "tool", label: "Data source: Yahoo Finance ^N225, daily bars" },
          { kind: "tool", label: "Data quality: 1,218 trading days, no gaps" },
          { kind: "log", label: "Price range: ¥26,100 – ¥42,800 in period." },
        ],
        intermediate: "1,218 daily bars loaded. Date range: 2021-04-11 to 2026-04-10.",
      },
      {
        progressLabel: "Run backtest simulation.",
        narrative: "Executing trades based on crossover signals with simulated fills.",
        thinkingChain: [
          { kind: "tool", label: "Simulate: ¥1,000,000 initial capital, 0.1% slippage" },
          { kind: "tool", label: "Signal count: 7 golden crosses, 6 death crosses in period" },
          { kind: "log", label: "Backtest complete: 13 total trades." },
        ],
        intermediate: "13 trades executed over 5 years. 8 winners, 5 losers.",
      },
      {
        progressLabel: "Calculate performance metrics.",
        narrative: "Computing returns, risk metrics, and benchmark comparison.",
        thinkingChain: [
          { kind: "tool", label: "Total return: +34.2% (strategy) vs +28.7% (buy & hold)" },
          { kind: "tool", label: "Sharpe: 0.72 · Max DD: -14.3% · Win rate: 61.5%" },
          { kind: "knowledge", label: "Note: SMA crossover lags in choppy markets" },
        ],
        intermediate: "Outperformed buy-and-hold by +5.5% with lower drawdown.",
      },
      {
        progressLabel: "Generate report with equity curve.",
        narrative: "Building visual report with charts and trade log.",
        thinkingChain: [
          { kind: "tool", label: "Render equity curve, drawdown chart, monthly returns heatmap" },
          { kind: "tool", label: "Export trade log with entry/exit prices and P&L" },
        ],
        intermediate: null,
      },
    ],
    finalMessage:
      "Backtest Complete: SMA 50/200 Crossover on Nikkei 225\n\nPeriod: Apr 2021 – Apr 2026 (5 years)\nInitial Capital: ¥1,000,000\n\nResults:\n• Total Return: +34.2% (vs +28.7% buy & hold)\n• Sharpe Ratio: 0.72\n• Max Drawdown: -14.3% (vs -22.1% buy & hold)\n• Win Rate: 61.5% (8/13 trades)\n• Avg Win: +8.1% | Avg Loss: -3.2%\n\nKey Insight: The strategy outperformed with lower risk, but lagged during the 2024 sideways market due to SMA whipsaws. Consider adding a volatility filter for better entry timing.\n\nWant me to test with different parameters or add a filter?",
  },

  "case-weekly-report": {
    supportedTaskTypes: ["Scheduled", "Long"],
    primaryTaskType: "Scheduled",
    modelLabel: "Rakuten AI (MultiModel)",
    demoUserInput:
      "Run this every Friday at 16:00. Check whether everyone on my fixed list submitted this week’s report in Outlook. Send me the summary on Line; I’ll confirm before you ping anyone on Teams.",
    agentOpening:
      "I’ll confirm Outlook, Line, and Teams connectors, load the fixed roster + schedule, look for weekly-report subjects in this week’s mail, post a Line summary, wait for your go-ahead, then DM stragglers on Teams.",
    computerTitle: "Rakuten AI workspace",
    computerSubtitle: "Outlook · Line · Teams",
    toolContextLabel: "Scheduled · human-in-the-loop",
    steps: [
      {
        progressLabel: "Read the fixed member list, weekly report rules, and schedule.",
        narrative: "Loading roster.json + subject patterns + cron expression (Friday 16:00).",
        thinkingChain: [
          { kind: "knowledge", label: "Knowledge recalled (1): subject must match /weekly report/i" },
          { kind: "tool", label: "Load schedule: `0 16 * * FRI` (tz: Asia/Tokyo)" },
          { kind: "log", label: "Form-based task saved as **Scheduled** with HITL gate on Line." },
        ],
        intermediate: "Intermediate result: 12 members on list; 1 alternate approver noted.",
      },
      {
        progressLabel: "Trigger the task on schedule or manually.",
        narrative: "This demo run is a **manual trigger** with the same code path as schedule.",
        thinkingChain: [
          { kind: "tool", label: "Task Execution System: enqueue worker run id #demo-weekly" },
        ],
        intermediate: null,
      },
      {
        progressLabel: "Search Outlook for this week’s weekly report emails.",
        narrative: "Matching From: against roster + subject heuristics.",
        thinkingChain: [
          { kind: "connector", label: "Outlook: query Mon 00:00–Fri 16:00 window" },
          { kind: "tool", label: "Thread dedupe; count one submission per person" },
        ],
        intermediate: "Intermediate result: **9 / 12** submissions detected so far.",
      },
      {
        progressLabel: "Match the results against the member list and determine submission status.",
        narrative: "Computing missing set for escalation path.",
        thinkingChain: [
          { kind: "log", label: "Missing: Hina, Marco, Leo (3)." },
        ],
        intermediate: "Roster reconciliation complete; escalation candidates locked.",
      },
      {
        progressLabel: "Generate the summary result.",
        narrative: "Building manager-facing digest with timestamps and message IDs.",
        thinkingChain: [
          { kind: "tool", label: "Render bilingual-friendly Markdown for Line push" },
        ],
        intermediate: null,
      },
      {
        progressLabel: "Send the review message through Line.",
        narrative: "Pushing compact status + tap-to-confirm instructions.",
        thinkingChain: [
          { kind: "connector", label: "Line: push flex message to Manager channel" },
          { kind: "log", label: "Message id LINE_MSG_4481 — delivered." },
        ],
        intermediate: "Intermediate result: you received: “9 submitted · 3 pending — reply YES to nudge.”",
      },
      {
        progressLabel: "Receive further instructions from the user on Line.",
        narrative: "Simulated: you replied **YES** after review (human-in-the-loop).",
        thinkingChain: [
          { kind: "knowledge", label: "HITL gate: require explicit YES before Teams DM" },
          { kind: "log", label: "Webhook received: confirmation token ok." },
        ],
        intermediate: "Confirmation captured; proceeding to Teams reminders only for missing 3.",
      },
      {
        progressLabel: "Send reminder messages through Teams.",
        narrative: "Direct chats with template referencing weekly report template doc.",
        thinkingChain: [
          { kind: "connector", label: "Teams: open 1:1 chats for Hina, Marco, Leo" },
          { kind: "tool", label: "Send polite reminder + deadline + upload link" },
        ],
        intermediate: "Intermediate result: 3 Teams messages sent; read receipts pending.",
      },
      {
        progressLabel: "Return the execution result.",
        narrative: "Closing run with audit log entry for Task Center history.",
        thinkingChain: [
          { kind: "tool", label: "Persist run record; enable **Save as Task** for reuse" },
        ],
        intermediate: null,
      },
    ],
    finalMessage:
      "Friday compliance run (demo): 9 submitted · 3 reminded on Teams after your Line YES.\nFull connector trace is in the execution panel. This preset is ideal for scheduled runs and human-in-the-loop confirmation; Interrupt / Retry will add per-step backoff in v2.\n\nUse Try it yourself to change roster IDs or wait-for-confirm behavior.",
  },
};
