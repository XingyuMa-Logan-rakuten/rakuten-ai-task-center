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
          "52 messages scanned (Mon–Fri). Breakdown: 14 newsletters, 6 FYI-only, 9 internal threads, 23 actionable threads with task-like content from senders including VP Sales, Legal, CTO, HR, and 3 external clients.",
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
          "31 candidate action items found across 18 threads. 14 have explicit deadlines (e.g., \"sign-off by Wed EOD\", \"due Thu noon\"). 7 use relative dates (\"by Friday\" → resolved to Apr 11). Owners identified for all items.",
      },
      {
        progressLabel: "Classify emails by priority.",
        narrative: "Mapping signals (sender tier, keywords, SLA hints) into urgent / normal / low.",
        thinkingChain: [
          { kind: "knowledge", label: "Policy: exec senders + \"urgent\" → Urgent lane" },
          { kind: "tool", label: "Score threads; break ties with last-activity age" },
        ],
        intermediate:
          "Priority classification complete:\n• 6 Urgent: VP sign-off, Legal NDA, CTO post-mortem, HR headcount, client contract, finance reallocation\n• 11 Normal: sprint deck, campaign brief, API timeline, brand review, vendor renewals, +6 more\n• 6 Low: polls, supply requests, meeting summaries",
      },
      {
        progressLabel: "Generate a checklist.",
        narrative: "Emitting a structured checklist your Agent UI can pin or export.",
        thinkingChain: [
          { kind: "tool", label: "Render checklist rows with links back to Outlook threads" },
          { kind: "log", label: "Form-based confirmation sheet generated (user can edit titles)." },
        ],
        intermediate: "Checklist generated with 23 actionable rows. Each row includes: priority tag, subject line, sender, deadline, and a deep link back to the Outlook thread for one-click access.",
      },
      {
        progressLabel: "Check the user’s calendar availability.",
        narrative: "Finding contiguous focus time respecting working hours and existing meetings.",
        thinkingChain: [
          { kind: "connector", label: "MS Calendar: read busy/free for next 5 business days" },
          { kind: "tool", label: "Propose 45-minute block closest to urgency cluster" },
        ],
        intermediate:
          "Calendar scanned for next 5 business days. Best available slot: Thu 15:30–16:15 (no conflicts, adjacent to lunch break). Alternate: Fri 09:00–09:45 (clear morning block).",
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
      "Here’s your weekly email triage report:\n\n📬 Inbox Summary (Apr 7 – Apr 11)\nScanned 52 messages across 23 threads. Filtered out 14 newsletters and 6 FYI-only notifications, leaving 23 actionable items.\n\n🔴 Urgent (6 items)\n• [VP Sales — Yamamoto] Q3 revenue forecast review — needs your sign-off by Wed EOD. He attached the updated model with \u00A54.2B projection.\n• [Legal — Suzuki] NDA for Tanaka Corp partnership — requires your counter-signature. PDF attached, 3 clauses flagged for your review.\n• [CTO — Park] Production incident post-mortem — your infrastructure section due Thu noon. Template shared in thread.\n• [HR — Watanabe] Headcount approval for Design team (2 senior roles) — pending since Monday, blocking recruitment pipeline.\n• [Client: Nakamura Trading] Contract renewal terms — they proposed a 12% rate increase, response expected by Fri.\n• [Finance — Chen] Budget reallocation request for Q3 marketing — CFO Tanaka waiting on your input before board prep.\n\n🟡 Normal (11 items)\n• [Product] Sprint 24 review deck — add your OKR slides by Thu\n• [Marketing] Summer campaign brief — creative feedback requested\n• [Engineering] API v3 migration timeline — confirm milestone dates\n• [Design] Brand guidelines v2.1 — review new color palette\n• [Ops] Q2 vendor renewals — 3 contracts (AWS, Datadog, Figma) need approval\n• …and 6 more (team standup notes, onboarding checklist, etc.)\n\n🟢 Low (6 items)\n• Team lunch poll for next Friday, office supply restock request, 2 meeting summary FYIs, parking pass renewal, employee wellness survey\n\n📋 Actions Taken\n1. Built a prioritized checklist with all 23 items — each row links directly to its Outlook thread so you can open and reply in one click.\n2. Booked a 45-min focus block on your calendar: Thu 15:30–16:15 “Email triage — urgent batch” (private, 10-min reminder set).\n3. Alternate slot identified: Fri 09:00–09:45 if you prefer tackling these fresh in the morning.\n\nWould you like me to draft replies for any of the urgent items, reschedule the focus block, or save this as a recurring Friday task?",
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
        intermediate: "126 billing-related messages found using keyword + sender heuristics (receipt, invoice, subscription, payment, renewal). Sources include: Adobe, Notion, Spotify, GitHub, Dropbox, AWS, Grammarly, LinkedIn, Hulu, and 65+ one-time purchase receipts.",
      },
      {
        progressLabel: "Extract structured fields.",
        narrative: "Pulling merchant, amounts, dates, plan names, and cadence hints.",
        thinkingChain: [
          { kind: "tool", label: "Parse PDF/HTML parts where needed" },
          { kind: "knowledge", label: "Normalize currencies to JPY display for summary" },
        ],
        intermediate: "61 line items extracted with high confidence. Fields: merchant name, amount (normalized to JPY), billing date, plan tier, and cadence (monthly/annual/one-time). Amounts range from ¥870 (AWS) to ¥6,480 (Adobe CC).",
      },
      {
        progressLabel: "Group and identify recurring / active services.",
        narrative: "Clustering by merchant + billing descriptor to spot active renewals.",
        thinkingChain: [
          { kind: "tool", label: "Detect renewal keywords: annual, auto-renew, next charge" },
          { kind: "log", label: "Merged 12 duplicates into 9 logical subscriptions." },
        ],
        intermediate: "9 active recurring subscriptions identified after clustering by merchant + billing descriptor. 3 flagged as low-usage: Dropbox Plus (3.2 GB / 2 TB), Grammarly Premium (last used 47 days ago), LinkedIn Premium (2 profile views last month). Combined low-usage spend: ¥8,950/month.",
      },
      {
        progressLabel: "Summarize spending and currently active services.",
        narrative: "Rolling up totals per service and trend (up/down vs. prior period).",
        thinkingChain: [
          { kind: "knowledge", label: "Knowledge recalled (1): exclude one-off static e-receipts" },
          { kind: "tool", label: "Build spend table + export snippet" },
        ],
        intermediate: "Monthly subscription total: ~¥23,456. Compared to prior 90-day period: +¥980 (Spotify price increase in Feb). Top 3 by cost: Adobe CC ¥6,480, LinkedIn ¥5,800, Notion ¥3,200. Savings opportunity: ¥8,950/month if low-usage services cancelled.",
      },
      {
        progressLabel: "Extract subscription management or cancellation entry points.",
        narrative: "Mining help links, “manage subscription,” and billing portals from bodies.",
        thinkingChain: [
          { kind: "tool", label: "Resolve redirects; prefer HTTPS vendor pages" },
          { kind: "log", label: "7 direct manage URLs found; 2 require login-first." },
        ],
        intermediate: "7 services have direct self-serve cancel/manage URLs extracted from email footers and account pages. Dropbox, Grammarly, LinkedIn, Adobe, Notion, Spotify, GitHub all have portal links. Hulu and AWS require email-based cancellation.",
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
      "Here’s your 90-day subscription & billing audit:\n\n📨 Scan Summary\nSearched 126 billing-related emails, de-duplicated to 74 unique threads, and extracted 61 line items with merchant, amount, and billing cycle data.\n\n🔄 Active Recurring Services (9 found)\n\n| # | Service | Monthly Cost | Billing Cycle | Status |\n|---|---------|-------------|---------------|--------|\n| 1 | Adobe Creative Cloud | \u00A56,480 | Monthly (auto) | Active — used regularly |\n| 2 | Notion Team Plan | \u00A53,200 | Monthly (auto) | Active — used regularly |\n| 3 | Spotify Premium | \u00A5980 | Monthly (auto) | Active — used regularly |\n| 4 | GitHub Copilot | \u00A51,950 | Monthly (auto) | Active — used regularly |\n| 5 | Dropbox Plus | \u00A51,500 | Annual (renews Jun 12) | ⚠️ Low usage — only 3.2 GB of 2 TB used |\n| 6 | Grammarly Premium | \u00A51,650 | Monthly (auto) | ⚠️ Low usage — last opened 47 days ago |\n| 7 | LinkedIn Premium | \u00A55,800 | Monthly (auto) | ⚠️ Low usage — 2 profile views last month |\n| 8 | AWS Personal Account | \u00A5870 | Monthly (usage-based) | Active — side project hosting |\n| 9 | Hulu (Japan) | \u00A51,026 | Monthly (auto) | Active — last watched 5 days ago |\n\nTotal monthly spend: ~\u00A523,456\n\n⚠️ Savings Opportunity\nDropbox, Grammarly, and LinkedIn Premium show low or no recent usage. Cancelling all three would save \u00A58,950/month (\u00A5107,400/year).\n\n🔗 Cancellation Options\n• 7 services have direct manage/cancel portal links — attached to each row above\n• Dropbox: https://www.dropbox.com/account/plan (one-click downgrade to free)\n• Grammarly: Settings > Subscription > Cancel (self-serve)\n• LinkedIn Premium: linkedin.com/premium/cancel\n\n✉️ Draft Cancellation Emails (2 prepared)\nFor AWS and Hulu (no self-serve cancel page found), I’ve drafted polite cancellation request emails with your account details pre-filled (account IDs redacted for safety). Review and send when ready.\n\nWould you like me to proceed with cancelling the low-usage services, or would you prefer to review each one first?",
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

  "personal-finance": {
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
        intermediate: "Roster loaded: 12 team members across 8 departments (Product, Engineering, Sales, Marketing, Design, Data Science, DevOps, QA, Finance, Partnerships, Growth, Customer Success). Subject pattern: /weekly report|WR:/i. Schedule: Friday 16:00 JST.",
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
        intermediate: "9 of 12 submissions detected. Earliest: Sato (Mon 09:15, Product). Latest: Ito (Fri 10:00, QA). Average submission day: Wednesday. Most submitted by Thursday this week.",
      },
      {
        progressLabel: "Match the results against the member list and determine submission status.",
        narrative: "Computing missing set for escalation path.",
        thinkingChain: [
          { kind: "log", label: "Missing: Hina, Marco, Leo (3)." },
        ],
        intermediate: "Missing members identified:\n• Hina Kobayashi (Finance) — no email matching pattern found\n• Marco Rossi (Partnerships) — out-of-office auto-reply detected (vacation Apr 8–12), but no report submitted\n• Leo Chen (Growth) — no email found; was active in Teams chat today",
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
        intermediate: "Line message delivered to Manager channel at 16:02. Content: \"Weekly Report Status: 9/12 submitted · 3 pending (Hina, Marco, Leo) — Reply YES to send Teams reminders.\" Message ID: LINE_MSG_4481.",
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
        intermediate: "3 personalized Teams DMs sent at 16:06:\n• Hina: Standard reminder with template link\n• Marco: Acknowledged OOO, offered extension option\n• Leo: Standard reminder with template link\nAll messages delivered. Read receipts pending.",
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
      "Here’s the Friday compliance report for this week:\n\n📊 Weekly Report Submission Status (Week of Apr 7)\n\n✅ Submitted (9 of 12 members)\n\n| # | Name | Submitted | Time | Subject |\n|---|------|-----------|------|---------|\n| 1 | Sato, Yuki | ✓ | Mon 09:15 | Weekly Report — Product Team (Apr 7) |\n| 2 | Kim, Jiwon | ✓ | Mon 14:30 | WR: Engineering Backend — Sprint 24 |\n| 3 | Tanaka, Kenji | ✓ | Tue 10:02 | Weekly Report — Sales Q3 Pipeline |\n| 4 | Williams, Sarah | ✓ | Tue 11:45 | WR: Marketing — Campaign Status |\n| 5 | Nakamura, Rin | ✓ | Wed 08:50 | Weekly Report — Design Sprint Review |\n| 6 | Zhang, Wei | ✓ | Wed 16:20 | WR: Data Science — Model Training |\n| 7 | Patel, Arjun | ✓ | Thu 09:30 | Weekly Report — DevOps & Infra |\n| 8 | Suzuki, Mika | ✓ | Thu 14:15 | WR: Customer Success Metrics |\n| 9 | Ito, Daiki | ✓ | Fri 10:00 | Weekly Report — QA & Release Notes |\n\n❌ Not Submitted (3 members)\n• Hina Kobayashi (Finance) — no matching email found this week\n• Marco Rossi (Partnerships) — out-of-office reply detected, but no report\n• Leo Chen (Growth) — no matching email found this week\n\n📱 Line Notification Sent\nSummary message delivered to your Line at 16:02: “9 submitted · 3 pending — reply YES to send reminders.”\nYou replied YES at 16:05.\n\n💬 Teams Reminders Sent\n• Hina Kobayashi — DM sent at 16:06: “Hi Hina, friendly reminder that your weekly report for this week hasn’t been received yet. Please submit by EOD. Here’s the template link: [Weekly Report Template]”\n• Marco Rossi — DM sent at 16:06: “Hi Marco, I noticed your OOO but your weekly report is still pending. If you’re available, please submit by EOD or let me know if you need an extension.”\n• Leo Chen — DM sent at 16:06: “Hi Leo, your weekly report for this week hasn’t been submitted yet. Please send it by EOD. Template: [Weekly Report Template]”\n\nAll 3 messages delivered successfully (read receipts pending).\n\nWould you like me to follow up again on Monday if they still haven’t submitted, or adjust the reminder template?",
  },

  /* ═══════════════ Rakuten Ecosystem ═══════════════ */

  "smart-spending": {
    supportedTaskTypes: ["Long", "On-demand"],
    primaryTaskType: "Long",
    modelLabel: "Rakuten AI (MultiModel)",
    demoUserInput: "Analyze my Rakuten Card spending for March 2026, find savings, and apply any available coupons to my regular purchases.",
    agentOpening: "I'll connect to Rakuten Pay / Card, pull your March transactions, categorize them, analyze patterns, find cheaper alternatives, check active coupons & campaigns, and deliver a weekly summary.",
    computerTitle: "Rakuten AI workspace",
    computerSubtitle: "Rakuten Pay · Rakuten Card",
    toolContextLabel: "Spending analysis",
    steps: [
      { progressLabel: "Connect to Rakuten Pay / Card.", narrative: "Authenticating and pulling transaction feed.", thinkingChain: [{ kind: "connector", label: "Rakuten Pay: authorize OAuth token" }, { kind: "log", label: "Card ending ****-4821 linked. 142 transactions in March." }], intermediate: "142 transactions loaded for March 2026." },
      { progressLabel: "Categorize all transactions.", narrative: "Classifying each spend by merchant category.", thinkingChain: [{ kind: "tool", label: "NLP merchant name → category: Groceries 38%, Dining 22%, Transport 15%, Subscriptions 12%, Other 13%" }, { kind: "log", label: "142 items categorized into 8 groups." }], intermediate: "Top categories: Groceries ¥45,200 · Dining ¥26,400 · Transport ¥17,800." },
      { progressLabel: "Analyze spending patterns.", narrative: "Comparing to previous months and detecting anomalies.", thinkingChain: [{ kind: "tool", label: "Month-over-month: Dining +18% vs Feb, Subscriptions unchanged" }, { kind: "knowledge", label: "Pattern: weekend dining spikes, 3 unused subscriptions detected" }], intermediate: "Dining up 18% from February. 3 dormant subscriptions totaling ¥2,980/mo." },
      { progressLabel: "Recommend cheaper alternatives.", narrative: "Finding Rakuten merchants with better prices or point bonuses.", thinkingChain: [{ kind: "tool", label: "Match grocery items to Rakuten Ichiba bulk deals — potential ¥3,200/mo savings" }, { kind: "tool", label: "Suggest Rakuten Mobile plan vs current carrier — ¥1,500/mo savings" }], intermediate: "Identified ¥4,700/month in potential savings across 3 categories." },
      { progressLabel: "Apply coupons & active campaigns.", narrative: "Scanning for applicable Rakuten coupons and SPU bonuses.", thinkingChain: [{ kind: "connector", label: "Rakuten Coupon API: 8 coupons applicable to your regular merchants" }, { kind: "tool", label: "Auto-clip 5 coupons; 3 require minimum spend — flagged for next order" }], intermediate: "8 coupons found, 5 auto-applied. Estimated extra savings: ¥1,240." },
      { progressLabel: "Generate weekly spending summary.", narrative: "Building a visual summary report.", thinkingChain: [{ kind: "tool", label: "Render spending pie chart, trend line, and savings recommendations" }], intermediate: null },
    ],
    finalMessage: "March 2026 Spending Report:\n\nTotal Spend: ¥119,600 (across 142 transactions)\nTop 3: Groceries ¥45,200 · Dining ¥26,400 · Transport ¥17,800\n\nSavings Found:\n• Cancel 3 unused subscriptions: ¥2,980/mo\n• Switch to Rakuten bulk groceries: ¥3,200/mo\n• 8 coupons applied/queued: ¥1,240 this cycle\n\nTotal potential monthly savings: ¥7,420\n\nWant me to set this up as a weekly scheduled task?",
  },

  "point-maximizing": {
    supportedTaskTypes: ["Long", "On-demand"],
    primaryTaskType: "Long",
    modelLabel: "Rakuten AI (MultiModel)",
    demoUserInput: "How can I maximize my Rakuten points before they expire next month? Show me active campaigns.",
    agentOpening: "I'll check your points balance and expiry dates, scan active SPU campaigns and promos, find the optimal purchase timing, suggest bundling opportunities, and recommend the best redemption options.",
    computerTitle: "Rakuten AI workspace",
    computerSubtitle: "Rakuten Points · SPU Engine",
    toolContextLabel: "Points optimization",
    steps: [
      { progressLabel: "Track points balance & expiry.", narrative: "Pulling your Rakuten Points ledger.", thinkingChain: [{ kind: "connector", label: "Rakuten Points API: fetch balance and expiry schedule" }, { kind: "log", label: "Balance: 12,480 pts. 3,200 pts expire May 15." }], intermediate: "12,480 points total. 3,200 expiring May 15, 2026." },
      { progressLabel: "Detect active campaigns (SPU, promos).", narrative: "Scanning current Super Point Up and seasonal promotions.", thinkingChain: [{ kind: "tool", label: "Active SPU: Rakuten Mobile +1x, Rakuten Card +2x, Rakuten Books +0.5x" }, { kind: "tool", label: "Promo: Shop Marathon Apr 12-17 — up to +9x" }], intermediate: "Your SPU multiplier: 5.5x base. Shop Marathon can push to 14.5x." },
      { progressLabel: "Suggest optimal purchase timing.", narrative: "Calculating the best day to buy based on campaign overlap.", thinkingChain: [{ kind: "knowledge", label: "Marathon resets per-shop; maximize shops on day 1-2 for early bonus" }, { kind: "tool", label: "Best window: Apr 12 (Marathon start) + 0/5 Day bonus = peak multiplier" }], intermediate: "Optimal purchase date: April 12. Stack Marathon + 0/5 Day for max 16x." },
      { progressLabel: "Bundle purchases for multipliers.", narrative: "Grouping your wishlist items across different shops.", thinkingChain: [{ kind: "tool", label: "Spread ¥48,000 wishlist across 6 shops for Marathon bonus tiers" }, { kind: "tool", label: "Split: Shop A ¥12k, B ¥9k, C ¥8k, D ¥7k, E ¥6.5k, F ¥5.5k" }], intermediate: "6-shop spread unlocks +5x Marathon bonus on all purchases." },
      { progressLabel: "Recommend redemption options.", narrative: "Finding the best use for expiring points.", thinkingChain: [{ kind: "tool", label: "Options: Rakuten Pay (1:1), Rakuten Travel (1.2x value), Rakuten Kobo (bonus)" }, { kind: "knowledge", label: "Travel vouchers give best per-point value historically" }], intermediate: null },
    ],
    finalMessage: "Points Optimization Plan:\n\nCurrent Balance: 12,480 pts (3,200 expiring May 15)\nYour SPU Base: 5.5x\n\nAction Plan:\n1. Shop Marathon Apr 12-17: Spread ¥48,000 across 6 shops → earn ~6,960 bonus pts\n2. Use 3,200 expiring pts on Rakuten Travel voucher (1.2x value = ¥3,840 worth)\n3. Stack 0/5 Day on Apr 15 for additional multiplier\n\nProjected Points After: ~16,240 pts (+30% growth)\n\nShall I set up alerts for the Marathon start?",
  },

  "weekly-grocery": {
    supportedTaskTypes: ["Scheduled", "On-demand"],
    primaryTaskType: "Scheduled",
    modelLabel: "Rakuten AI (MultiModel)",
    demoUserInput: "Generate my weekly grocery list based on past orders and find the best prices on Rakuten.",
    agentOpening: "I'll analyze your order history, predict what you need to refill, build a cart, compare prices across Rakuten merchants, apply available coupons, and schedule delivery.",
    computerTitle: "Rakuten AI workspace",
    computerSubtitle: "Rakuten Ichiba · Grocery",
    toolContextLabel: "Grocery automation",
    steps: [
      { progressLabel: "Track consumption history.", narrative: "Analyzing your past 8 weeks of grocery orders.", thinkingChain: [{ kind: "connector", label: "Rakuten Ichiba: pull order history — grocery category" }, { kind: "tool", label: "Identified 34 recurring items across 8 orders" }], intermediate: "34 recurring grocery items identified. Weekly average: ¥8,400." },
      { progressLabel: "Predict refill needs.", narrative: "Estimating depletion based on purchase frequency and quantity.", thinkingChain: [{ kind: "tool", label: "Due this week: milk (3d cycle), eggs (5d), rice (14d), coffee (10d)" }, { kind: "tool", label: "18 items predicted as needing refill" }], intermediate: "18 items need refill this week. Estimated total: ¥7,200." },
      { progressLabel: "Generate cart.", narrative: "Creating optimized shopping cart.", thinkingChain: [{ kind: "tool", label: "Cart built with preferred brands and sizes" }, { kind: "log", label: "18 items added, total ¥7,200." }], intermediate: "Cart ready: 18 items, ¥7,200 before coupons." },
      { progressLabel: "Compare merchant prices.", narrative: "Finding the best deals across Rakuten grocery merchants.", thinkingChain: [{ kind: "tool", label: "Price comparison: 4 items cheaper at alt merchants — save ¥680" }, { kind: "tool", label: "Switched to bulk rice (5kg) — save ¥320 vs 2kg×3" }], intermediate: "Optimized cart total: ¥6,200 (saved ¥1,000)." },
      { progressLabel: "Apply coupons.", narrative: "Scanning for applicable grocery coupons.", thinkingChain: [{ kind: "connector", label: "Coupon API: 3 applicable — ¥200 off dairy, ¥150 off ¥5000+, free shipping" }, { kind: "log", label: "All 3 coupons applied." }], intermediate: "Final total: ¥5,850 with coupons. Free shipping applied." },
      { progressLabel: "Schedule delivery.", narrative: "Picking your preferred delivery slot.", thinkingChain: [{ kind: "tool", label: "Available: Sat 10-12, Sat 14-16, Sun 10-12" }, { kind: "log", label: "Scheduled: Saturday 10:00-12:00." }], intermediate: "Delivery scheduled for Saturday 10:00-12:00." },
      { progressLabel: "Confirm one-click reorder setup.", narrative: "Saving this cart as a recurring template.", thinkingChain: [{ kind: "tool", label: "Template saved. Next auto-cart generation: next Thursday." }], intermediate: null },
    ],
    finalMessage: "Weekly Grocery Order Ready!\n\n18 items · ¥5,850 (saved ¥2,350 vs individual buys)\nDelivery: Saturday 10:00-12:00\n\nSavings Breakdown:\n• Price optimization: ¥1,000\n• Coupons: ¥350\n• Free shipping: ¥1,000\n\nOne-click reorder template saved. I'll auto-generate next week's cart on Thursday.\n\nWant me to adjust any items or change the delivery slot?",
  },

  "price-watch": {
    supportedTaskTypes: ["Scheduled", "On-demand"],
    primaryTaskType: "Scheduled",
    modelLabel: "Rakuten AI (MultiModel)",
    demoUserInput: "Track the price of the Sony WH-1000XM5 headphones on Rakuten and alert me when it drops below ¥35,000.",
    agentOpening: "I'll save this product to your watchlist, set up price tracking, monitor campaign events, and notify you the moment the price hits your target.",
    computerTitle: "Rakuten AI workspace",
    computerSubtitle: "Rakuten Ichiba · Price Tracker",
    toolContextLabel: "Price monitoring",
    steps: [
      { progressLabel: "Save product to watchlist.", narrative: "Locating the product on Rakuten Ichiba.", thinkingChain: [{ kind: "connector", label: "Rakuten Ichiba: search Sony WH-1000XM5" }, { kind: "tool", label: "Found 23 listings. Selected top-rated seller: ¥38,800." }], intermediate: "Product saved. Current best price: ¥38,800 from AudioPro Store." },
      { progressLabel: "Track price changes.", narrative: "Building price history from cached data.", thinkingChain: [{ kind: "tool", label: "90-day history: high ¥42,000, low ¥34,500, avg ¥37,200" }, { kind: "knowledge", label: "Last sub-35k price: during Super Sale 6 weeks ago" }], intermediate: "90-day range: ¥34,500–¥42,000. Average: ¥37,200." },
      { progressLabel: "Monitor upcoming campaigns.", narrative: "Checking when the next big sale events are.", thinkingChain: [{ kind: "tool", label: "Next events: Shop Marathon Apr 12, Super Sale Jun 4" }, { kind: "knowledge", label: "This product historically drops 10-15% during Super Sale" }], intermediate: "High probability of target price during Super Sale (Jun 4)." },
      { progressLabel: "Detect best price window.", narrative: "Calculating the optimal purchase timing.", thinkingChain: [{ kind: "tool", label: "Prediction: 72% chance of ¥34,500 during Jun Super Sale" }, { kind: "tool", label: "With your SPU 5.5x: effective price ¥32,600 after points" }], intermediate: "Best window: Jun Super Sale. Effective price with points: ~¥32,600." },
      { progressLabel: "Set up notifications.", narrative: "Configuring price drop alerts.", thinkingChain: [{ kind: "tool", label: "Alert set: notify via Line when price ≤ ¥35,000" }, { kind: "log", label: "Monitoring 23 listings every 6 hours." }], intermediate: null },
    ],
    finalMessage: "Price Watch Active: Sony WH-1000XM5\n\nCurrent Price: ¥38,800\nYour Target: ¥35,000\n90-Day Low: ¥34,500\n\nForecast: 72% chance of hitting target during Super Sale (Jun 4)\nWith your SPU 5.5x, effective price could be as low as ¥32,600.\n\nI'll notify you instantly when the price drops. Want to add more products to your watchlist?",
  },

  "merchant-onboarding": {
    supportedTaskTypes: ["Long"],
    primaryTaskType: "Long",
    modelLabel: "Rakuten AI (MultiModel)",
    demoUserInput: "Help me set up my handmade ceramics shop on Rakuten Ichiba. I have my business registration ready.",
    agentOpening: "I'll guide you through the full onboarding — form submission, document verification, category assignment, pricing strategy, storefront generation, and launch.",
    computerTitle: "Rakuten AI workspace",
    computerSubtitle: "Rakuten Ichiba · Merchant Portal",
    toolContextLabel: "Merchant onboarding",
    steps: [
      { progressLabel: "Submit onboarding form.", narrative: "Pre-filling the application with your business details.", thinkingChain: [{ kind: "tool", label: "Form fields: business name, registration #, bank details, contact" }, { kind: "log", label: "Application form completed and submitted." }], intermediate: "Application submitted. Review typically takes 2-3 business days." },
      { progressLabel: "Verify documents.", narrative: "Checking uploaded documents against requirements.", thinkingChain: [{ kind: "tool", label: "Business registration: ✓ valid. Bank certificate: ✓ matches. ID: ✓ verified." }, { kind: "log", label: "All 3 required documents verified." }], intermediate: "Document verification complete. All 3 documents approved." },
      { progressLabel: "Assign category.", narrative: "Finding the best product category for your shop.", thinkingChain: [{ kind: "knowledge", label: "Handmade ceramics → Kitchen & Dining > Tableware > Handcrafted" }, { kind: "tool", label: "Also eligible for: Home Decor, Gifts" }], intermediate: "Primary category: Kitchen & Dining > Handcrafted Tableware." },
      { progressLabel: "Suggest pricing strategy.", narrative: "Analyzing competitor pricing in your category.", thinkingChain: [{ kind: "tool", label: "Market range: ¥1,500–¥8,000 for handmade cups/plates" }, { kind: "knowledge", label: "Recommend mid-premium positioning: 10% below artisan average" }], intermediate: "Recommended pricing: ¥2,800–¥6,500 range (mid-premium tier)." },
      { progressLabel: "Generate storefront.", narrative: "Creating your shop page with templates.", thinkingChain: [{ kind: "tool", label: "Selected template: Artisan Clean. Generated banner, about section, policies." }, { kind: "tool", label: "SEO-optimized shop description and meta tags created." }], intermediate: "Storefront generated with Artisan Clean template." },
      { progressLabel: "Launch store.", narrative: "Final checks before going live.", thinkingChain: [{ kind: "tool", label: "Checklist: payment setup ✓, shipping config ✓, return policy ✓, test order ✓" }, { kind: "log", label: "Store status: LIVE on Rakuten Ichiba." }], intermediate: null },
    ],
    finalMessage: "Your Rakuten Ichiba Store is Live!\n\nShop: Ceramic Studio Artisan\nCategory: Kitchen & Dining > Handcrafted Tableware\nPricing Tier: Mid-Premium (¥2,800–¥6,500)\n\nNext Steps:\n1. Upload your first 5 products\n2. Join the new merchant welcome campaign (bonus visibility for 30 days)\n3. Set up Shop Marathon participation for extra traffic\n\nWant me to help you create your first product listing?",
  },

  "product-image-editor": {
    supportedTaskTypes: ["On-demand"],
    primaryTaskType: "On-demand",
    modelLabel: "Rakuten AI (MultiModel)",
    demoUserInput: "Enhance my product photos for a ceramic mug and create lifestyle variations for the listing.",
    agentOpening: "I'll process your uploaded images, enhance quality, generate lifestyle scene variations, prepare A/B test thumbnails, and publish the best versions to your listing.",
    computerTitle: "Rakuten AI workspace",
    computerSubtitle: "Image Enhancement Engine",
    toolContextLabel: "Product image editing",
    steps: [
      { progressLabel: "Upload product images.", narrative: "Receiving and analyzing 4 product photos.", thinkingChain: [{ kind: "tool", label: "4 images received: front, side, top, detail views" }, { kind: "log", label: "Resolution: 3024×4032. Format: JPEG." }], intermediate: "4 product images uploaded and analyzed." },
      { progressLabel: "Enhance image quality.", narrative: "Applying AI enhancement — white balance, sharpness, background.", thinkingChain: [{ kind: "tool", label: "Auto white-balance corrected (was slightly warm)" }, { kind: "tool", label: "Background cleaned to pure white. Shadows softened." }], intermediate: "All 4 images enhanced: sharper, cleaner backgrounds, true colors." },
      { progressLabel: "Generate lifestyle variations.", narrative: "Creating scene compositions for the product.", thinkingChain: [{ kind: "tool", label: "Scene 1: Morning coffee table with natural light" }, { kind: "tool", label: "Scene 2: Kitchen shelf arrangement. Scene 3: Gift wrapping context." }], intermediate: "3 lifestyle variations generated per original image." },
      { progressLabel: "Create A/B test thumbnails.", narrative: "Designing thumbnail variants for click-through testing.", thinkingChain: [{ kind: "tool", label: "Variant A: clean product on white. Variant B: lifestyle morning scene." }, { kind: "tool", label: "Added subtle badge: 'Handmade' stamp on variant B." }], intermediate: "2 thumbnail variants ready for A/B testing." },
      { progressLabel: "Publish to listing.", narrative: "Uploading final images to your Rakuten product page.", thinkingChain: [{ kind: "connector", label: "Rakuten Ichiba: update product images for SKU CM-001" }, { kind: "log", label: "12 images published. Thumbnail A/B test activated." }], intermediate: null },
    ],
    finalMessage: "Product Images Updated!\n\n• 4 original photos enhanced (white balance, background, sharpness)\n• 12 lifestyle variations created (3 per original)\n• A/B thumbnail test live (clean vs lifestyle)\n\nThe test will run for 7 days. I'll report which thumbnail gets more clicks.\n\nWant me to process images for more products?",
  },

  "affiliate-signup": {
    supportedTaskTypes: ["Long"],
    primaryTaskType: "Long",
    modelLabel: "Rakuten AI (MultiModel)",
    demoUserInput: "Help me sign up as a Rakuten affiliate. I run a tech review blog with 15,000 monthly readers.",
    agentOpening: "I'll guide you through the affiliate application, analyze your blog for the best product categories, generate starter content, activate your account, and set up performance tracking.",
    computerTitle: "Rakuten AI workspace",
    computerSubtitle: "Rakuten Affiliate Network",
    toolContextLabel: "Affiliate onboarding",
    steps: [
      { progressLabel: "Submit application.", narrative: "Pre-filling your affiliate application.", thinkingChain: [{ kind: "tool", label: "Fields: site URL, niche, traffic stats, content type" }, { kind: "log", label: "Application submitted for review." }], intermediate: "Application submitted. Estimated approval: 1-2 business days." },
      { progressLabel: "Analyze profile.", narrative: "Assessing your blog's affiliate potential.", thinkingChain: [{ kind: "tool", label: "Blog analysis: tech reviews, 15k MAU, avg engagement 3.2min" }, { kind: "knowledge", label: "Tech review blogs convert 2-4% on electronics affiliate links" }], intermediate: "Strong fit: tech niche with engaged audience. Estimated 2.5% conversion rate." },
      { progressLabel: "Recommend categories.", narrative: "Matching high-commission Rakuten categories to your content.", thinkingChain: [{ kind: "tool", label: "Top matches: Electronics (4-8%), PC Peripherals (5-10%), Smart Home (6-12%)" }, { kind: "tool", label: "Seasonal opportunity: Back-to-school laptops in 2 months" }], intermediate: "Recommended: Electronics, PC Peripherals, Smart Home (avg 6.7% commission)." },
      { progressLabel: "Generate starter content.", narrative: "Creating affiliate-ready review templates.", thinkingChain: [{ kind: "tool", label: "Generated: 3 comparison article templates, 5 product card widgets" }, { kind: "tool", label: "SEO-optimized affiliate disclosure statement created" }], intermediate: "3 article templates and 5 product widgets ready to embed." },
      { progressLabel: "Activate affiliate account.", narrative: "Completing final setup steps.", thinkingChain: [{ kind: "connector", label: "Rakuten Affiliate: account activated, tracking pixel installed" }, { kind: "log", label: "Affiliate ID: RA-2026-78432 active." }], intermediate: "Account active! Affiliate ID: RA-2026-78432." },
      { progressLabel: "Set up performance tracking.", narrative: "Creating your earnings dashboard.", thinkingChain: [{ kind: "tool", label: "Dashboard configured: clicks, conversions, earnings, top products" }, { kind: "log", label: "Weekly performance email enabled." }], intermediate: null },
    ],
    finalMessage: "Rakuten Affiliate Account Active!\n\nAffiliate ID: RA-2026-78432\nRecommended Categories: Electronics, PC Peripherals, Smart Home\nAvg Commission: 6.7%\n\nStarter Kit Ready:\n• 3 comparison article templates\n• 5 embeddable product widgets\n• SEO disclosure statement\n• Weekly performance reports enabled\n\nEstimated monthly earnings at 15k MAU: ¥45,000–¥120,000\n\nWant me to generate your first affiliate review article?",
  },

  "refund-tracking": {
    supportedTaskTypes: ["Long", "On-demand"],
    primaryTaskType: "Long",
    modelLabel: "Rakuten AI (MultiModel)",
    demoUserInput: "I want to request a refund for a defective Bluetooth speaker I ordered last week. Order #RK-2026-445821.",
    agentOpening: "I'll look up your order, submit a refund request, coordinate with the merchant, and keep you updated on every milestone until the refund is complete.",
    computerTitle: "Rakuten AI workspace",
    computerSubtitle: "Rakuten Support · Refund",
    toolContextLabel: "Refund processing",
    steps: [
      { progressLabel: "Submit refund request.", narrative: "Filing the refund claim with order details.", thinkingChain: [{ kind: "connector", label: "Rakuten Order API: fetch order #RK-2026-445821" }, { kind: "tool", label: "Item: JBL Flip 6, ¥12,800. Delivered Apr 3. Defect: no audio from left speaker." }], intermediate: "Refund request submitted for JBL Flip 6, ¥12,800." },
      { progressLabel: "Validate request.", narrative: "Checking refund eligibility against policies.", thinkingChain: [{ kind: "knowledge", label: "Within 14-day return window. Defective item = full refund eligible." }, { kind: "log", label: "Eligibility: APPROVED. Category: defective product." }], intermediate: "Request validated. Full refund eligible (defective product, within window)." },
      { progressLabel: "Process with merchant.", narrative: "Coordinating return logistics with the seller.", thinkingChain: [{ kind: "connector", label: "Merchant notification sent. Return label generated." }, { kind: "tool", label: "Pickup scheduled: Apr 12, 10:00-18:00 at your address." }], intermediate: "Return pickup scheduled for Apr 12. Prepaid label provided." },
      { progressLabel: "Track status updates.", narrative: "Monitoring the return shipment.", thinkingChain: [{ kind: "tool", label: "Status: package picked up → in transit → received by merchant" }, { kind: "log", label: "Merchant confirmed receipt. Inspection in progress." }], intermediate: "Item received by merchant. Inspection underway." },
      { progressLabel: "Notify milestones.", narrative: "Sending you status updates.", thinkingChain: [{ kind: "tool", label: "Merchant approved refund. Processing payment reversal." }, { kind: "connector", label: "Line notification: refund approved, expect 3-5 business days." }], intermediate: "Refund approved! Payment reversal initiated." },
      { progressLabel: "Complete refund.", narrative: "Confirming the refund has been processed.", thinkingChain: [{ kind: "log", label: "¥12,800 refunded to Rakuten Card ending ****-4821." }], intermediate: null },
    ],
    finalMessage: "Refund Complete!\n\nOrder: #RK-2026-445821\nItem: JBL Flip 6 Bluetooth Speaker\nRefund Amount: ¥12,800\nRefunded To: Rakuten Card ****-4821\n\nTimeline:\n• Request submitted → Validated → Pickup → Received → Approved → Refunded\n• Total processing time: 5 business days\n\nThe refund will appear on your next card statement. Need anything else?",
  },

  "golf-booking": {
    supportedTaskTypes: ["Long", "On-demand"],
    primaryTaskType: "Long",
    modelLabel: "Rakuten AI (MultiModel)",
    demoUserInput: "I'm a beginner golfer. Find a good course near Tokyo for this weekend and book a tee time.",
    agentOpening: "I'll assess your level, recommend beginner-friendly courses, check availability, book a tee time on Rakuten GORA, and set up progress tracking for your game.",
    computerTitle: "Rakuten AI workspace",
    computerSubtitle: "Rakuten GORA · Golf",
    toolContextLabel: "Golf planning",
    steps: [
      { progressLabel: "Assess skill level.", narrative: "Understanding your golf experience.", thinkingChain: [{ kind: "knowledge", label: "Beginner profile: <10 rounds, no handicap registered" }, { kind: "tool", label: "Recommended course difficulty: easy-moderate, wide fairways, practice facilities" }], intermediate: "Skill level: Beginner. Looking for forgiving courses with practice areas." },
      { progressLabel: "Recommend lessons.", narrative: "Finding nearby golf lessons.", thinkingChain: [{ kind: "tool", label: "3 beginner lesson packages found near your area" }, { kind: "tool", label: "Top pick: Rakuten GORA Academy — 3-session intro course ¥15,000" }], intermediate: "Recommended: Rakuten GORA Academy beginner pack (3 lessons, ¥15,000)." },
      { progressLabel: "Suggest courses.", narrative: "Finding beginner-friendly courses near Tokyo.", thinkingChain: [{ kind: "connector", label: "Rakuten GORA: search courses within 60km of Tokyo, beginner-friendly" }, { kind: "tool", label: "Top 3: Akigase GC (35min), Musashino CC (45min), Tama Hills (50min)" }], intermediate: "Top pick: Akigase Golf Club — 35min drive, beginner-friendly, ¥8,500." },
      { progressLabel: "Book tee time.", narrative: "Reserving your slot.", thinkingChain: [{ kind: "connector", label: "Rakuten GORA: book Akigase GC, Sat Apr 12, 08:30 tee time" }, { kind: "log", label: "Booking confirmed. Reservation #GORA-88421." }], intermediate: "Tee time booked: Akigase GC, Saturday 08:30. Confirmation sent." },
      { progressLabel: "Set up progress tracking.", narrative: "Creating your golf tracking profile.", thinkingChain: [{ kind: "tool", label: "Profile created: track scores, stats, handicap progression" }, { kind: "log", label: "Post-round score logging enabled." }], intermediate: null },
    ],
    finalMessage: "Golf Day Booked!\n\nCourse: Akigase Golf Club\nDate: Saturday, April 12\nTee Time: 08:30\nGreen Fee: ¥8,500 (Rakuten GORA price)\nDrive: ~35 min from central Tokyo\n\nAlso Recommended:\n• Beginner lesson pack: 3 sessions for ¥15,000\n• Progress tracking profile created — log your scores after each round\n\nHave a great round! Want me to set up a recurring weekend booking?",
  },

  "wine-restaurant": {
    supportedTaskTypes: ["Long", "On-demand"],
    primaryTaskType: "Long",
    modelLabel: "Rakuten AI (MultiModel)",
    demoUserInput: "Find a wine tasting event in Tokyo this weekend and book a nice French restaurant for dinner afterwards.",
    agentOpening: "I'll analyze your preferences, find wine events, recommend restaurants, book both, and log your reviews for future personalized suggestions.",
    computerTitle: "Rakuten AI workspace",
    computerSubtitle: "Rakuten Travel · Dining",
    toolContextLabel: "Wine & dining",
    steps: [
      { progressLabel: "Capture preferences.", narrative: "Understanding your wine and dining preferences.", thinkingChain: [{ kind: "knowledge", label: "Preferences: red wine, French cuisine, central Tokyo, budget ¥15,000/person" }, { kind: "log", label: "Preference profile saved." }], intermediate: "Profile: Red wine lover, French cuisine, central Tokyo, ¥15K budget." },
      { progressLabel: "Recommend venues & events.", narrative: "Searching for wine tastings and restaurants.", thinkingChain: [{ kind: "tool", label: "Wine events: 3 tastings this weekend in Roppongi, Ginza, Ebisu" }, { kind: "tool", label: "Top restaurants: 5 French bistros with excellent wine lists" }], intermediate: "Found 3 wine tastings and 5 matching French restaurants." },
      { progressLabel: "Select experience.", narrative: "Curating the best pairing for your evening.", thinkingChain: [{ kind: "tool", label: "Best combo: Ginza Wine Fair (15:00-17:00) → Bistro Paul (19:00)" }, { kind: "knowledge", label: "Both in Ginza, 5-min walk. Wine fair features Burgundy focus." }], intermediate: "Recommended: Ginza Wine Fair → Bistro Paul (both in Ginza, walkable)." },
      { progressLabel: "Book reservation.", narrative: "Securing your spots.", thinkingChain: [{ kind: "connector", label: "Wine fair: 2 tickets booked ¥4,500/person" }, { kind: "connector", label: "Bistro Paul: table for 2 at 19:00 confirmed via Rakuten" }], intermediate: "Both booked! Wine fair 15:00 + Bistro Paul dinner 19:00." },
      { progressLabel: "Confirm itinerary.", narrative: "Generating your evening plan.", thinkingChain: [{ kind: "tool", label: "Calendar event created with address, directions, and booking refs" }], intermediate: null },
    ],
    finalMessage: "Your Wine & Dining Evening is Set!\n\n15:00 — Ginza Wine Fair (Burgundy Special)\n  Tickets: 2× ¥4,500 | Venue: Ginza Six B2F\n\n19:00 — Bistro Paul (French)\n  Table for 2 | Budget: ~¥12,000/person\n  Top picks: Côtes du Rhône, Duck Confit\n\nTotal estimate: ¥33,000 for two\nCalendar event created with directions.\n\nAfter your evening, I'll ask for your rating to improve future recommendations!",
  },

  "horse-betting": {
    supportedTaskTypes: ["On-demand"],
    primaryTaskType: "On-demand",
    modelLabel: "Rakuten AI (MultiModel)",
    demoUserInput: "Show me the upcoming races at Tokyo Racecourse this Sunday and give me your top picks.",
    agentOpening: "I'll pull this Sunday's race card, analyze horse and jockey stats, provide data-driven picks, and help you place bets through Rakuten Keiba.",
    computerTitle: "Rakuten AI workspace",
    computerSubtitle: "Rakuten Keiba · Racing",
    toolContextLabel: "Horse racing insights",
    steps: [
      { progressLabel: "Show upcoming races.", narrative: "Loading Sunday's race card.", thinkingChain: [{ kind: "connector", label: "Rakuten Keiba: fetch Tokyo Racecourse races for Apr 13" }, { kind: "tool", label: "12 races scheduled. Feature: Oka Sho (G1) in Race 11." }], intermediate: "12 races this Sunday. Feature race: Oka Sho (Japanese 1000 Guineas) — G1." },
      { progressLabel: "Provide data-driven insights.", narrative: "Analyzing form, track conditions, and jockey stats.", thinkingChain: [{ kind: "tool", label: "G1 Oka Sho: 18 runners. Track: good-to-firm. Distance: 1600m." }, { kind: "tool", label: "Form analysis: #3 Star Maiden (3 wins, jockey Lemaire), #7 Swift Rose (unbeaten)" }], intermediate: "Top contenders: #3 Star Maiden (consistent form) and #7 Swift Rose (unbeaten filly)." },
      { progressLabel: "Select bets.", narrative: "Building recommended bet slips.", thinkingChain: [{ kind: "knowledge", label: "Conservative: Win #7 at 3.2x. Value: Place #3 at 1.8x" }, { kind: "tool", label: "Combo: Exacta #7-#3 at 8.5x for higher return" }], intermediate: "Recommended: Win #7 (3.2x), Place #3 (1.8x), Exacta 7-3 (8.5x)." },
      { progressLabel: "Place bet.", narrative: "Submitting your selections.", thinkingChain: [{ kind: "connector", label: "Rakuten Keiba: place bets — total ¥3,000 across 3 tickets" }, { kind: "log", label: "Bet slip confirmed. Tickets: WIN-7, PLC-3, EXA-7-3." }], intermediate: "3 bets placed totaling ¥3,000. Tickets confirmed." },
      { progressLabel: "Track results.", narrative: "Setting up live result tracking.", thinkingChain: [{ kind: "tool", label: "Live tracking enabled. Push notification on race finish." }, { kind: "log", label: "Results will update your balance automatically." }], intermediate: null },
    ],
    finalMessage: "Bets Placed for Tokyo Racecourse — Sunday, Apr 13!\n\nFeature: Oka Sho (G1) — Race 11, 15:40\n\nYour Tickets:\n1. WIN #7 Swift Rose — ¥1,000 @ 3.2x (potential ¥3,200)\n2. PLACE #3 Star Maiden — ¥1,000 @ 1.8x (potential ¥1,800)\n3. EXACTA 7→3 — ¥1,000 @ 8.5x (potential ¥8,500)\n\nTotal wagered: ¥3,000 | Max potential: ¥13,500\n\nI'll send you a notification when the race finishes. Good luck!",
  },

  "sport-fan-news": {
    supportedTaskTypes: ["Scheduled", "On-demand"],
    primaryTaskType: "Scheduled",
    modelLabel: "Rakuten AI (MultiModel)",
    demoUserInput: "Set up daily updates about Vissel Kobe and the NBA. Alert me when match tickets go on sale.",
    agentOpening: "I'll configure your team preferences, aggregate news from sports sources, push updates for scores and transfers, and set up ticket sale alerts.",
    computerTitle: "Rakuten AI workspace",
    computerSubtitle: "Sports News Aggregator",
    toolContextLabel: "Sports news feed",
    steps: [
      { progressLabel: "Select teams & players.", narrative: "Setting up your sports profile.", thinkingChain: [{ kind: "tool", label: "Teams: Vissel Kobe (J-League), NBA (general + Lakers)" }, { kind: "log", label: "Sports profile created with 2 teams." }], intermediate: "Tracking: Vissel Kobe (J-League) and LA Lakers (NBA)." },
      { progressLabel: "Aggregate news.", narrative: "Pulling latest stories from sports sources.", thinkingChain: [{ kind: "tool", label: "Sources: J-League official, ESPN, NBA.com, Rakuten Sports" }, { kind: "tool", label: "Today: 8 Vissel Kobe articles, 12 NBA/Lakers articles" }], intermediate: "20 articles aggregated. Key: Vissel Kobe match preview + Lakers playoff update." },
      { progressLabel: "Push real-time updates.", narrative: "Configuring live score and news alerts.", thinkingChain: [{ kind: "connector", label: "Line: push notification channel configured" }, { kind: "tool", label: "Match-day alerts: 30min before kickoff, halftime, final score" }], intermediate: "Live alerts configured via Line. Match-day updates enabled." },
      { progressLabel: "Recommend related content.", narrative: "Finding related articles and highlights.", thinkingChain: [{ kind: "tool", label: "Video highlights, player interviews, tactical analysis linked" }], intermediate: "Daily digest with highlights, interviews, and analysis ready." },
      { progressLabel: "Link to merch & tickets.", narrative: "Setting up ticket sale monitoring.", thinkingChain: [{ kind: "connector", label: "Rakuten Tickets: monitoring Vissel Kobe home games" }, { kind: "tool", label: "Next home game: Apr 19 vs Urawa Reds. Tickets from ¥3,500." }], intermediate: null },
    ],
    finalMessage: "Sports Feed Active!\n\nTracking: Vissel Kobe · LA Lakers\n\nDaily Digest: Sent every morning at 8:00 AM\nLive Alerts: Match scores via Line\nTicket Monitoring: Active for Vissel Kobe home games\n\nUpcoming:\n• Vissel Kobe vs Urawa Reds — Apr 19 (tickets from ¥3,500)\n• Lakers Game 2 — Apr 14 (watch party info included)\n\nWant me to add more teams or adjust notification times?",
  },

  "oshikatsu-news": {
    supportedTaskTypes: ["Scheduled", "On-demand"],
    primaryTaskType: "Scheduled",
    modelLabel: "Rakuten AI (MultiModel)",
    demoUserInput: "Track all updates about Hololive VTubers and notify me about new merch drops and events.",
    agentOpening: "I'll set up tracking for your favorite creators, aggregate updates from all channels, notify you of events and releases, and link you to purchase opportunities.",
    computerTitle: "Rakuten AI workspace",
    computerSubtitle: "Oshikatsu Tracker",
    toolContextLabel: "Fan content aggregation",
    steps: [
      { progressLabel: "Select favorite idols/creators.", narrative: "Setting up your oshi profile.", thinkingChain: [{ kind: "tool", label: "Selected: Hololive (Pekora, Suisei, Marine)" }, { kind: "log", label: "Tracking 3 creators across 5 platforms." }], intermediate: "Tracking: Pekora, Suisei, Marine across YouTube, Twitter, and official sites." },
      { progressLabel: "Aggregate updates.", narrative: "Pulling latest content and announcements.", thinkingChain: [{ kind: "tool", label: "Sources: YouTube channels, Twitter/X, Hololive official, fan wikis" }, { kind: "tool", label: "Today: 3 new streams, 1 original song release, 2 merch announcements" }], intermediate: "6 updates found today. Highlight: Suisei new original song release!" },
      { progressLabel: "Notify events & releases.", narrative: "Setting up event and release alerts.", thinkingChain: [{ kind: "connector", label: "Line alerts configured for: concert tickets, birthday merch, collab events" }, { kind: "tool", label: "Upcoming: Hololive 6th Fes — ticket lottery opens Apr 20" }], intermediate: "Alert set: Hololive 6th Fes ticket lottery opens Apr 20." },
      { progressLabel: "Recommend merch & content.", narrative: "Finding relevant merchandise on Rakuten.", thinkingChain: [{ kind: "connector", label: "Rakuten Ichiba: 28 items matching your oshi list" }, { kind: "tool", label: "New: Pekora birthday merch set (limited, ¥6,800)" }], intermediate: "28 merch items found. Featured: Pekora birthday set (limited edition)." },
      { progressLabel: "Enable quick purchase.", narrative: "Setting up one-click buy for priority items.", thinkingChain: [{ kind: "tool", label: "Priority alerts: notify within 1 min of limited merch drops" }, { kind: "log", label: "Quick-buy enabled for Rakuten Ichiba items." }], intermediate: null },
    ],
    finalMessage: "Oshikatsu Tracker Active!\n\nTracking: Pekora · Suisei · Marine (Hololive)\n\nDaily Digest: Streams, songs, announcements\nInstant Alerts: Limited merch drops, concert tickets\n\nUpcoming:\n• Hololive 6th Fes ticket lottery — Apr 20\n• Pekora birthday merch (limited) — available now ¥6,800\n• Suisei new original song — premiered today\n\nWant me to add more creators or set up auto-purchase for limited drops?",
  },

  "fashion-trend": {
    supportedTaskTypes: ["Long", "On-demand"],
    primaryTaskType: "Long",
    modelLabel: "Rakuten AI (MultiModel)",
    demoUserInput: "What are the trending styles for spring 2026 that match my taste? I prefer minimalist casual.",
    agentOpening: "I'll analyze your style profile, generate a spring 2026 trend report, recommend outfits with shoppable links on Rakuten Fashion, and save your favorites.",
    computerTitle: "Rakuten AI workspace",
    computerSubtitle: "Rakuten Fashion · Trends",
    toolContextLabel: "Fashion styling",
    steps: [
      { progressLabel: "Analyze preferences.", narrative: "Building your style profile.", thinkingChain: [{ kind: "tool", label: "Style: minimalist casual, neutral palette, quality basics" }, { kind: "knowledge", label: "Past purchases suggest: Japanese brands, relaxed fit, earth tones" }], intermediate: "Style profile: Minimalist casual, neutral/earth tones, relaxed fit." },
      { progressLabel: "Generate trend report.", narrative: "Compiling Spring 2026 trend data for your style.", thinkingChain: [{ kind: "tool", label: "Spring 2026 trends: linen blends, oversized blazers, wide-leg trousers" }, { kind: "tool", label: "Color forecast: sage green, warm sand, soft clay, off-white" }], intermediate: "Spring 2026 for you: linen blends, oversized blazers, earth-tone palette." },
      { progressLabel: "Recommend outfits.", narrative: "Creating complete outfit suggestions with Rakuten links.", thinkingChain: [{ kind: "connector", label: "Rakuten Fashion: 24 items matching your profile and spring trends" }, { kind: "tool", label: "3 complete outfits assembled: casual brunch, smart casual office, weekend" }], intermediate: "3 outfit recommendations built with 24 shoppable items." },
      { progressLabel: "Enable try-on preview.", narrative: "Generating virtual styling previews.", thinkingChain: [{ kind: "tool", label: "AI try-on renders for top 3 outfit combinations" }, { kind: "log", label: "Preview images generated for review." }], intermediate: "Virtual try-on previews ready for 3 outfits." },
      { progressLabel: "Save looks to closet.", narrative: "Organizing your selections.", thinkingChain: [{ kind: "tool", label: "3 looks saved to digital closet. Purchase links bookmarked." }, { kind: "log", label: "Total outfit cost: ¥28,500–¥45,000 across 3 looks." }], intermediate: null },
    ],
    finalMessage: "Spring 2026 Style Report Ready!\n\nYour Trends: Linen blends · Oversized blazers · Wide-leg trousers\nPalette: Sage green, warm sand, soft clay, off-white\n\n3 Outfits Curated:\n1. Casual Brunch — ¥12,500 (linen shirt + wide pants + canvas sneakers)\n2. Smart Casual Office — ¥18,000 (blazer + knit tee + tailored trousers)\n3. Weekend Stroll — ¥14,500 (cardigan + relaxed jeans + loafers)\n\nAll items available on Rakuten Fashion with virtual try-on previews.\n\nWant to purchase any look or see more options?",
  },

  "salon-planning": {
    supportedTaskTypes: ["Long", "On-demand"],
    primaryTaskType: "Long",
    modelLabel: "Rakuten AI (MultiModel)",
    demoUserInput: "Plan a spa day for next Saturday with hair and nail appointments near Omotesando.",
    agentOpening: "I'll check your availability, find top-rated salons on Rakuten Beauty, bundle services for the best value, optimize your schedule, and book everything.",
    computerTitle: "Rakuten AI workspace",
    computerSubtitle: "Rakuten Beauty · Salon",
    toolContextLabel: "Beauty day planning",
    steps: [
      { progressLabel: "Detect availability.", narrative: "Checking your Saturday calendar.", thinkingChain: [{ kind: "connector", label: "Google Calendar: Saturday Apr 19 — free 10:00 to 18:00" }, { kind: "log", label: "Full day available for appointments." }], intermediate: "Saturday Apr 19: Free all day (10:00-18:00)." },
      { progressLabel: "Recommend salons & services.", narrative: "Searching Rakuten Beauty near Omotesando.", thinkingChain: [{ kind: "connector", label: "Rakuten Beauty: 45 salons within 10min of Omotesando station" }, { kind: "tool", label: "Top hair: Salon de Fleur (4.8★). Top nail: Nail Bar Omo (4.7★)." }], intermediate: "Top picks: Salon de Fleur (hair, 4.8★) + Nail Bar Omo (nails, 4.7★)." },
      { progressLabel: "Bundle services.", narrative: "Finding combination deals.", thinkingChain: [{ kind: "tool", label: "Salon de Fleur: cut + color + treatment package ¥15,000 (save ¥3,000)" }, { kind: "tool", label: "Nail Bar Omo: gel nail art ¥7,500 (Rakuten Beauty coupon -¥500)" }], intermediate: "Bundled total: ¥22,000 (saved ¥3,500 vs individual booking)." },
      { progressLabel: "Optimize schedule.", narrative: "Arranging appointments to minimize wait time.", thinkingChain: [{ kind: "tool", label: "Optimal flow: Hair 10:30-13:00 → Lunch → Nails 14:00-15:30" }, { kind: "knowledge", label: "3-min walk between venues. Lunch spot: nearby café recommended." }], intermediate: "Schedule: Hair 10:30 → Lunch 13:00 → Nails 14:00. Done by 15:30." },
      { progressLabel: "Book appointments.", narrative: "Confirming all reservations.", thinkingChain: [{ kind: "connector", label: "Rakuten Beauty: Salon de Fleur 10:30 ✓, Nail Bar Omo 14:00 ✓" }, { kind: "log", label: "Both bookings confirmed. Calendar events added." }], intermediate: "Both appointments confirmed and added to your calendar." },
      { progressLabel: "Confirm full itinerary.", narrative: "Generating your spa day plan.", thinkingChain: [{ kind: "tool", label: "Itinerary card created with addresses, booking refs, and directions" }], intermediate: null },
    ],
    finalMessage: "Spa Day Booked — Saturday, April 19!\n\n10:30 — Hair: Salon de Fleur (Omotesando)\n  Cut + Color + Treatment Package: ¥15,000\n  ⭐ 4.8 rating · 2-min walk from station\n\n13:00 — Lunch break (café recommendations included)\n\n14:00 — Nails: Nail Bar Omo\n  Gel Nail Art: ¥7,000 (after coupon)\n  ⭐ 4.7 rating · 3-min walk\n\nTotal: ¥22,000 (saved ¥3,500)\nCalendar events created with directions.\n\nEnjoy your treat day! Want to add a facial or massage?",
  },

  "insurance-compare": {
    supportedTaskTypes: ["Long", "On-demand"],
    primaryTaskType: "Long",
    modelLabel: "Rakuten AI (MultiModel)",
    demoUserInput: "Compare travel insurance plans for a 2-week trip to Europe. I want good medical coverage.",
    agentOpening: "I'll gather your trip details, fetch policy options from Rakuten Insurance, compare them side-by-side, explain the differences, and help you purchase the best plan.",
    computerTitle: "Rakuten AI workspace",
    computerSubtitle: "Rakuten Insurance",
    toolContextLabel: "Insurance comparison",
    steps: [
      { progressLabel: "Input requirements.", narrative: "Gathering your trip and coverage preferences.", thinkingChain: [{ kind: "tool", label: "Trip: Europe, 14 days, 1 adult, departure May 1" }, { kind: "knowledge", label: "Europe requires: medical ≥¥10M, emergency transport, baggage" }], intermediate: "Trip: Europe 14 days, 1 adult. Priority: medical coverage." },
      { progressLabel: "Fetch policy options.", narrative: "Querying Rakuten Insurance for matching plans.", thinkingChain: [{ kind: "connector", label: "Rakuten Insurance API: 6 plans matching criteria" }, { kind: "tool", label: "Price range: ¥2,800–¥8,500 for 14-day Europe coverage" }], intermediate: "6 plans found. Range: ¥2,800–¥8,500." },
      { progressLabel: "Compare coverage side-by-side.", narrative: "Building a comparison matrix.", thinkingChain: [{ kind: "tool", label: "Comparison: medical limit, emergency transport, baggage, trip cancel, dental" }, { kind: "tool", label: "Top 3 shortlisted based on your medical priority" }], intermediate: "Top 3 plans shortlisted with full coverage comparison." },
      { progressLabel: "Explain key differences.", narrative: "Highlighting what matters for your trip.", thinkingChain: [{ kind: "knowledge", label: "Plan A: cheapest but medical cap ¥10M. Plan B: ¥30M medical + dental. Plan C: unlimited medical." }, { kind: "tool", label: "Europe medical costs can be very high — recommend ≥¥30M coverage" }], intermediate: "Key diff: Plan A caps at ¥10M (risky for Europe). Plan B/C safer." },
      { progressLabel: "Recommend best plan.", narrative: "Making a data-driven recommendation.", thinkingChain: [{ kind: "tool", label: "Recommended: Plan B — ¥30M medical, ¥5M baggage, trip cancel, ¥4,200" }, { kind: "knowledge", label: "Best value: 3x the medical coverage of Plan A for only ¥1,400 more" }], intermediate: "Recommended: Plan B at ¥4,200 — best balance of coverage and cost." },
      { progressLabel: "Complete purchase.", narrative: "Finalizing your insurance purchase.", thinkingChain: [{ kind: "connector", label: "Rakuten Insurance: purchase Plan B, policy #RI-2026-55201" }, { kind: "log", label: "Policy active from May 1. Certificate emailed." }], intermediate: null },
    ],
    finalMessage: "Travel Insurance Purchased!\n\nPlan: Rakuten Travel Insurance — Premium\nPolicy #: RI-2026-55201\nCoverage Period: May 1–14, 2026\nPremium: ¥4,200\n\nCoverage Highlights:\n• Medical: ¥30,000,000\n• Emergency Transport: ¥10,000,000\n• Baggage Loss/Damage: ¥5,000,000\n• Trip Cancellation: ¥500,000\n• 24/7 English support line included\n\nPolicy certificate sent to your email. Have a safe trip!",
  },

  /* ═══════════════════════ Japan Selection ═══════════════════════ */

  "jp-rirekisho": {
    demoUserInput: "Create a rirekisho from my profile — I'm a software engineer with 3 years experience.",
    agentOpening: "I'll create a properly formatted 履歴書 (rirekisho) for you. Let me gather your details and generate a Japan-standard CV.",
    steps: [
      { label: "Collect profile data", thinkingChain: ["Parsing provided experience details", "Mapping to rirekisho fields", "Identifying required sections"], intermediate: "Profile data mapped to 15 standard rirekisho fields." },
      { label: "Format CV layout", thinkingChain: ["Applying JIS B5 standard layout", "Setting proper font and spacing", "Adding photo placeholder"], intermediate: "Layout formatted to JIS standard with correct margins." },
      { label: "Fill 学歴・職歴 section", thinkingChain: ["Ordering education chronologically", "Formatting work history in Japanese style", "Adding 以上 closing marker"], intermediate: "Education and work history filled with 5 entries." },
      { label: "Generate 志望動機 & 自己PR", thinkingChain: ["Analyzing target role requirements", "Crafting motivation statement", "Writing self-PR paragraph"], intermediate: "志望動機 and 自己PR drafted (200 characters each)." },
      { label: "Export PDF", thinkingChain: ["Rendering final layout", "Generating print-ready PDF", "Adding download link"], intermediate: "PDF exported at 300dpi, print-ready." },
    ],
    finalMessage: "Your 履歴書 is ready!\n\n📄 Format: JIS B5 standard\n👤 Name: [Your Name]\n🎓 Education: 2 entries\n💼 Work History: 2 entries (3 years total)\n📝 志望動機: 200 characters — focused on technical growth\n📝 自己PR: 200 characters — highlights problem-solving skills\n📷 Photo placeholder: included\n\nThe rirekisho PDF is ready for download. You can print it directly or submit digitally.",
  },

  "jp-keigo-check": {
    demoUserInput: "Check if this cover letter uses proper keigo: 「先日はお忙しい中、面接の機会をいただきありがとうございます。御社で働きたいと思っています。」",
    agentOpening: "I'll review your text for keigo accuracy and formality level. Let me analyze each sentence.",
    steps: [
      { label: "Parse input text", thinkingChain: ["Tokenizing Japanese text", "Identifying verb forms", "Detecting politeness markers"], intermediate: "2 sentences parsed, 3 keigo markers detected." },
      { label: "Check 尊敬語 usage", thinkingChain: ["Verifying honorific forms", "Checking subject-verb agreement for keigo", "Flagging missing 尊敬語"], intermediate: "1 instance of 尊敬語 found, 1 opportunity missed." },
      { label: "Check 謙譲語 usage", thinkingChain: ["Scanning for humble forms", "Verifying self-reference patterns", "Checking consistency"], intermediate: "謙譲語 correctly used with いただき. Suggestion: add 存じます." },
      { label: "Generate improved version", thinkingChain: ["Rewriting casual parts", "Elevating formality level", "Preserving original meaning"], intermediate: "Polished version generated with 3 improvements." },
    ],
    finalMessage: "Keigo Check Complete!\n\n📊 Formality Score: 7/10 → 9.5/10 after edits\n\n🔍 Issues Found:\n1. 「働きたいと思っています」→ 「ぜひ貴社にて貢献させていただきたく存じます」\n   Reason: More humble and formal expression\n2. Consider adding 「拝啓」opening and 「敬具」closing for a full cover letter\n\n✅ Good Usage:\n• 「お忙しい中」— correct honorific prefix\n• 「いただき」— proper 謙譲語\n\n📝 Polished Version:\n「拝啓　先日はお忙しい中、面接の機会を賜り誠にありがとうございました。ぜひ貴社にて貢献させていただきたく存じます。敬具」",
  },

  "jp-mock-interview": {
    demoUserInput: "Practice a mock interview for a marketing position at a Japanese company.",
    agentOpening: "Let's prepare for your interview! I'll simulate a real Japanese job interview with common questions and give you detailed feedback.",
    steps: [
      { label: "Prepare interview scenario", thinkingChain: ["Setting up marketing role context", "Selecting company profile (大手メーカー)", "Preparing 5 standard questions"], intermediate: "Interview scenario: Marketing position at a major Japanese manufacturer." },
      { label: "Conduct 自己紹介 round", thinkingChain: ["Prompting self-introduction", "Evaluating structure and timing", "Checking keigo accuracy"], intermediate: "自己紹介 evaluated: good structure, 90 seconds, minor keigo fix needed." },
      { label: "Practice 志望動機", thinkingChain: ["Asking motivation question", "Analyzing answer specificity", "Checking company research depth"], intermediate: "志望動機 feedback: add more company-specific details." },
      { label: "Practice 自己PR", thinkingChain: ["Prompting self-PR question", "Evaluating STAR method usage", "Checking impact statements"], intermediate: "自己PR: strong examples, suggest adding quantified results." },
      { label: "Generate feedback report", thinkingChain: ["Scoring each section", "Identifying improvement areas", "Creating practice plan"], intermediate: "Comprehensive feedback report generated." },
    ],
    finalMessage: "Mock Interview Complete! 🎯\n\n📊 Overall Score: 78/100\n\n| Section | Score | Feedback |\n|---------|-------|----------|\n| 自己紹介 | 82 | Good pace, fix 「させてもらう」→「させていただく」 |\n| 志望動機 | 72 | Add specific product/campaign references |\n| 自己PR | 80 | Strong STAR examples, quantify results |\n| 敬語 accuracy | 75 | 3 casual expressions detected |\n| Body language tips | — | Remember お辞儀 at start and end |\n\n🎯 Top 3 Improvements:\n1. Research the company's latest marketing campaigns\n2. Add numbers: 「売上20%向上」instead of「売上が上がった」\n3. Practice 45-second version of 自己PR for time pressure\n\nWould you like to practice again with harder questions?",
  },

  "jp-es-generator": {
    demoUserInput: "Draft an entry sheet for a consulting firm — help me with ガクチカ and 自己PR.",
    agentOpening: "I'll help you draft compelling エントリーシート answers. Let me work on the key sections for a consulting firm application.",
    steps: [
      { label: "Analyze target firm", thinkingChain: ["Identifying consulting firm values", "Reviewing past ES examples", "Mapping key competencies"], intermediate: "Target competencies: logical thinking, leadership, teamwork, resilience." },
      { label: "Draft ガクチカ (400字)", thinkingChain: ["Structuring with STAR method", "Focusing on challenge and growth", "Keeping within 400-character limit"], intermediate: "ガクチカ draft: 398 characters, university research project theme." },
      { label: "Draft 自己PR (400字)", thinkingChain: ["Highlighting unique strengths", "Adding concrete examples", "Connecting to consulting skills"], intermediate: "自己PR draft: 395 characters, analytical problem-solving theme." },
      { label: "Draft 志望動機 (300字)", thinkingChain: ["Connecting personal goals to firm", "Showing industry knowledge", "Expressing long-term vision"], intermediate: "志望動機 draft: 292 characters, strategic impact theme." },
      { label: "Review & polish", thinkingChain: ["Checking character counts", "Ensuring consistent tone", "Verifying no 話し言葉 leaks"], intermediate: "All sections polished, formal written Japanese confirmed." },
    ],
    finalMessage: "Entry Sheet Ready! 📝\n\n✅ ガクチカ (398/400字):\nTopic: Led a 5-person team in university market research\nHighlight: Overcame data collection challenges, presented to 200+ audience\n\n✅ 自己PR (395/400字):\nStrength: Analytical problem-solving\nExample: Reduced analysis time by 40% with a new framework\n\n✅ 志望動機 (292/300字):\nFocus: Desire to solve complex business problems at scale\n\n💡 Tips:\n• Each answer uses the PREP structure\n• All in proper 書き言葉 (written Japanese)\n• Zero casual expressions detected\n\nShall I adapt these for a different company?",
  },

  "jp-juminhyo": {
    demoUserInput: "How do I get a 住民票 at my local ward office? I'm a foreign resident in Tokyo.",
    agentOpening: "I'll guide you through getting your 住民票 (residence certificate) step by step. This is one of the most common ward office tasks for foreign residents.",
    steps: [
      { label: "Identify required documents", thinkingChain: ["Checking foreign resident requirements", "Listing ID documents needed", "Noting 在留カード requirement"], intermediate: "Required: 在留カード (residence card) + application form." },
      { label: "Locate nearest ward office", thinkingChain: ["Checking Tokyo ward offices", "Finding opening hours", "Noting counter numbers"], intermediate: "Ward office located. Hours: Mon–Fri 8:30–17:00, some Sat mornings." },
      { label: "Prepare application form", thinkingChain: ["Explaining 住民票の写し交付請求書", "Marking required fields", "Translating form sections"], intermediate: "Application form guide prepared with field-by-field instructions." },
      { label: "Generate step-by-step guide", thinkingChain: ["Ordering steps chronologically", "Adding useful Japanese phrases", "Including fee information"], intermediate: "Complete guide with 8 steps and useful phrases." },
    ],
    finalMessage: "住民票 Guide Ready! 🏛️\n\nStep-by-step:\n1. Go to your registered ward office (区役所/市役所)\n2. Take a number at the 住民票 counter (窓口)\n3. Fill out 住民票の写し交付請求書\n4. Submit with your 在留カード\n5. Wait ~10 minutes\n6. Pay the fee (¥300 per copy)\n7. Receive your 住民票\n\n📋 What to bring:\n• 在留カード (Residence Card) — required\n• ¥300 per copy (cash)\n• No hanko needed for basic requests\n\n🗣️ Useful phrases:\n• 「住民票をお願いします」(I'd like a residence certificate)\n• 「世帯全員分」(for all household members) or 「本人分のみ」(just mine)\n• 「マイナンバー記載なし」(without My Number) — recommended\n\n⏰ Best time: Tuesday–Thursday morning to avoid crowds.",
  },

  "jp-kakutei-shinkoku": {
    demoUserInput: "Walk me through filing 確定申告 as a freelancer in Japan.",
    agentOpening: "I'll guide you through the entire 確定申告 (tax filing) process for freelancers. Let me prepare a personalized walkthrough.",
    steps: [
      { label: "Determine filing requirements", thinkingChain: ["Checking freelancer tax obligations", "Identifying 青色申告 vs 白色申告", "Calculating filing deadline"], intermediate: "Recommended: 青色申告 (blue return) for ¥650,000 deduction benefit." },
      { label: "Gather required documents", thinkingChain: ["Listing income statements (支払調書)", "Identifying deductible expenses", "Checking receipt requirements"], intermediate: "12 document types identified, expense categorization guide prepared." },
      { label: "Walk through e-Tax setup", thinkingChain: ["Checking マイナンバーカード readiness", "Setting up e-Tax account", "Installing required software"], intermediate: "e-Tax setup guide: 5 steps with マイナンバーカード." },
      { label: "Calculate tax estimate", thinkingChain: ["Summing income sources", "Applying 青色申告 special deduction", "Calculating estimated tax"], intermediate: "Estimated tax calculation complete with deductions applied." },
      { label: "Generate filing checklist", thinkingChain: ["Creating pre-submission checklist", "Adding common mistake warnings", "Setting deadline reminder"], intermediate: "Filing checklist: 15 items, deadline March 15." },
    ],
    finalMessage: "確定申告 Guide Complete! 📊\n\n📅 Filing Period: Feb 16 – Mar 15, 2027\n📝 Recommended: 青色申告 (Blue Return) — saves up to ¥650,000 in deductions\n\n💰 Key Deductions for Freelancers:\n• Home office: up to 30% of rent/utilities\n• Equipment: full deduction under ¥100,000\n• Communication: phone/internet (business portion)\n• Transportation: client visit travel costs\n• 小規模企業共済: retirement savings deduction\n\n🖥️ e-Tax Filing Steps:\n1. Prepare マイナンバーカード + card reader\n2. Log in to e-Tax (www.e-tax.nta.go.jp)\n3. Select 確定申告書B\n4. Enter income (事業所得)\n5. Enter expenses by category\n6. Apply 青色申告特別控除\n7. Submit electronically\n\n⚠️ Common Mistakes:\n• Forgetting to claim 経費 (business expenses)\n• Not separating personal vs. business use\n• Missing the March 15 deadline (延滞税 penalty!)",
  },

  "jp-shiyakusho": {
    demoUserInput: "Help me understand this 転入届 form from the ward office.",
    agentOpening: "I'll translate and explain the 転入届 (move-in notification) form field by field so you can fill it out correctly.",
    steps: [
      { label: "Identify form type", thinkingChain: ["Recognizing 転入届 (move-in notification)", "Determining applicable fields for foreign residents", "Checking submission deadline"], intermediate: "Form: 転入届 — must be submitted within 14 days of moving in." },
      { label: "Translate each field", thinkingChain: ["Translating header fields", "Explaining address format (〒/都道府県/市区町村)", "Clarifying relationship fields"], intermediate: "All 12 fields translated with English explanations." },
      { label: "Provide filling instructions", thinkingChain: ["Explaining date format (令和)", "Noting pen color requirements (black)", "Highlighting common errors"], intermediate: "Filling guide ready with examples for each field." },
    ],
    finalMessage: "転入届 Form Guide Ready! 📋\n\nField-by-field translation:\n\n| Japanese | English | How to fill |\n|----------|---------|-------------|\n| 届出日 | Submission date | Today's date in 令和 format |\n| 届出人 | Applicant | Your full name |\n| 新住所 | New address | New address (〒 → prefecture → city → street) |\n| 旧住所 | Previous address | Where you moved from |\n| 世帯主 | Head of household | Your name (if living alone) |\n| 続柄 | Relationship | 本人 (self) |\n| 転入日 | Move-in date | Date you actually moved |\n\n⚠️ Important Notes:\n• Submit within 14 days of moving\n• Use black pen only\n• Bring 在留カード + old/new address proof\n• Free of charge\n\n🗣️ Say at the counter:\n「転入届を出したいです」(I'd like to submit a move-in notification)",
  },

  "jp-visa-residency": {
    demoUserInput: "How do I renew my work visa in Japan? It expires in 2 months.",
    agentOpening: "I'll guide you through the work visa renewal process. With 2 months left, you're right on time — let's prepare everything.",
    steps: [
      { label: "Check eligibility & timing", thinkingChain: ["Verifying renewal window (3 months before expiry)", "Checking visa category requirements", "Confirming Immigration Bureau jurisdiction"], intermediate: "Eligible to apply now. Recommended: apply 2–3 months before expiry." },
      { label: "Prepare document checklist", thinkingChain: ["Listing required documents by visa type", "Identifying employer-provided docs", "Adding tax certificate requirements"], intermediate: "12 documents required, 5 from employer, 3 self-prepared." },
      { label: "Fill application form guide", thinkingChain: ["Explaining 在留期間更新許可申請書", "Translating each section", "Noting photo requirements"], intermediate: "Application form guide complete (Form 更新 — 16 sections)." },
      { label: "Immigration Bureau guide", thinkingChain: ["Finding nearest Immigration Bureau", "Checking reservation system", "Estimating processing time"], intermediate: "Tokyo Regional Immigration Bureau, processing: 2–4 weeks." },
    ],
    finalMessage: "Visa Renewal Guide Ready! 🛂\n\n📅 Timeline: Apply NOW (2 months before expiry is ideal)\n📍 Where: Tokyo Regional Immigration Bureau (品川)\n\n📋 Required Documents:\n1. 在留期間更新許可申請書 (application form)\n2. パスポート + 在留カード\n3. 証明写真 (4×3cm, white background)\n4. 住民税の課税証明書 (tax certificate)\n5. 住民税の納税証明書 (tax payment certificate)\n6. From employer: 在職証明書, 会社登記簿謄本, 決算報告書\n\n⏳ Processing: 2–4 weeks\n💰 Fee: ¥4,000 (revenue stamp upon approval)\n\n💡 Tips:\n• Book online at Immigration Bureau website\n• Go early (before 9:00) to avoid long waits\n• Bring all originals + copies\n• If approved, you'll get a postcard — return to pick up new card",
  },

  "jp-train-delays": {
    demoUserInput: "My Chuo Line is delayed — find me an alternate route to Shinjuku from Kichijoji.",
    agentOpening: "I'll find you the fastest alternate route right away and prepare a delay certificate.",
    steps: [
      { label: "Check delay status", thinkingChain: ["Querying Chuo Line status", "Identifying delay cause and duration", "Checking adjacent lines"], intermediate: "Chuo Line: 15-min delay due to signal trouble at Mitaka." },
      { label: "Find alternate routes", thinkingChain: ["Calculating Keio Inokashira Line route", "Checking bus alternatives", "Comparing arrival times"], intermediate: "3 alternate routes found, fastest: Inokashira → Shimokitazawa → Shinjuku." },
      { label: "Generate delay certificate", thinkingChain: ["Formatting 遅延証明書", "Adding date, line, and delay duration", "Creating printable version"], intermediate: "Delay certificate generated for Chuo Line, April 2026." },
    ],
    finalMessage: "Route Found! 🚃\n\n⚠️ Chuo Line Status: 15-min delay (signal trouble at Mitaka)\n\n🔄 Best Alternate Route:\nKichijoji → (Keio Inokashira Line) → Shimokitazawa → (Odakyu Line) → Shinjuku\n⏱️ ~22 min | ¥220 | No delays on this route\n\n🔄 Other Options:\n• Kichijoji → (Bus 吉64) → Shinjuku: ~35 min, ¥220\n• Wait for Chuo Line: estimated +15 min from normal\n\n📄 遅延証明書 (Delay Certificate):\nLine: JR中央線\nDate: April 14, 2026\nDelay: Approx. 15 minutes\nCause: Signal equipment inspection\n\nCertificate ready for download — show to your employer!",
  },

  "jp-konbini-meals": {
    demoUserInput: "Plan a week of healthy konbini lunches under ¥500 each.",
    agentOpening: "I'll create a balanced weekly meal plan using items from 7-Eleven, Lawson, and FamilyMart — all under ¥500 per meal.",
    steps: [
      { label: "Set nutrition targets", thinkingChain: ["Calculating daily calorie needs", "Setting protein/carb/fat ratios", "Accounting for budget constraint"], intermediate: "Target: 500–700 kcal lunch, 20g+ protein, under ¥500." },
      { label: "Curate menu items", thinkingChain: ["Scanning konbini product databases", "Filtering by nutrition and price", "Selecting variety across the week"], intermediate: "35 items shortlisted across 3 konbini chains." },
      { label: "Build daily combos", thinkingChain: ["Pairing main + side + drink", "Balancing flavors (和/洋/中)", "Ensuring no repeats"], intermediate: "7 unique daily combos created." },
      { label: "Generate meal plan", thinkingChain: ["Formatting weekly calendar", "Adding nutrition breakdown", "Including konbini-specific tips"], intermediate: "Weekly plan with nutrition totals ready." },
    ],
    finalMessage: "Weekly Konbini Meal Plan! 🍱\n\n| Day | Combo | Store | Price | Kcal |\n|-----|-------|-------|-------|------|\n| Mon | サラダチキン + おにぎり(鮭) + 味噌汁 | 7-Eleven | ¥486 | 520 |\n| Tue | 幕の内弁当(小) + サラダ | Lawson | ¥498 | 580 |\n| Wed | 蕎麦 + ゆで卵 + 野菜ジュース | FamilyMart | ¥470 | 490 |\n| Thu | タンパク質サラダ + おにぎり(ツナマヨ) | 7-Eleven | ¥456 | 510 |\n| Fri | パスタサラダ + サラダチキンバー | Lawson | ¥478 | 540 |\n| Sat | 親子丼 + 味噌汁 | FamilyMart | ¥490 | 600 |\n| Sun | 冷やし中華 + ゆで卵 | 7-Eleven | ¥480 | 520 |\n\n📊 Weekly Avg: ¥480/meal | 537 kcal | 24g protein\n\n💡 Tips:\n• サラダチキン is your best protein-per-yen option\n• Check Lawson's 「からあげクン」for protein snack\n• Use konbini apps for ¥50–100 coupons",
  },

  "jp-gift-etiquette": {
    demoUserInput: "What's an appropriate お歳暮 gift for my boss?",
    agentOpening: "I'll help you choose the perfect お歳暮 gift for your boss, following Japanese gift-giving etiquette.",
    steps: [
      { label: "Assess relationship context", thinkingChain: ["Determining boss relationship level", "Checking 上司 gift customs", "Setting appropriate price range"], intermediate: "上司 (boss): ¥3,000–5,000 range, formal wrapping required." },
      { label: "Recommend gift options", thinkingChain: ["Selecting safe, popular choices", "Avoiding taboo items (刃物, 櫛)", "Checking seasonal appropriateness"], intermediate: "5 gift options selected, all department store quality." },
      { label: "Prepare wrapping & etiquette notes", thinkingChain: ["Specifying 熨斗 (noshi) type", "Writing greeting card template", "Noting delivery timing"], intermediate: "Etiquette guide prepared: のし紙, 表書き, and delivery window." },
    ],
    finalMessage: "お歳暮 Gift Guide Ready! 🎁\n\n💰 Budget: ¥3,000–5,000 (appropriate for 上司)\n📅 Send by: Dec 10–20\n\n🎯 Top Recommendations:\n1. 高級ハム詰め合わせ (Premium ham set) — ¥3,240 — Takashimaya\n2. 銘茶セット (Fine tea set) — ¥3,780 — Ippodo Tea\n3. フルーツゼリー (Fruit jelly assortment) — ¥4,320 — Sembikiya\n4. お菓子詰め合わせ (Confection set) — ¥3,500 — Yoku Moku\n5. 調味料セット (Premium condiment set) — ¥4,860 — Kubara\n\n📋 Etiquette Checklist:\n✅ のし紙: 紅白蝶結び (red-white butterfly bow)\n✅ 表書き: 「お歳暮」+ your full name\n✅ Delivery: department store direct shipping is perfectly fine\n✅ Greeting card: 「今年も大変お世話になりました」\n\n⚠️ Avoid: knives (切る=cutting ties), combs (苦+死), cash, clocks (終わり)",
  },

  "jp-seasonal-tasks": {
    demoUserInput: "Where are the best hanami spots near Osaka this spring?",
    agentOpening: "Spring in Osaka is beautiful for hanami! Let me compile the best cherry blossom viewing spots and timing for you.",
    steps: [
      { label: "Check bloom forecast", thinkingChain: ["Checking 2026 桜前線 (cherry blossom front)", "Estimating Osaka peak dates", "Comparing early vs. late bloomers"], intermediate: "Osaka peak bloom: ~March 28–April 5, 2026." },
      { label: "Curate top spots", thinkingChain: ["Ranking by beauty and accessibility", "Including both famous and hidden spots", "Adding nighttime illumination info"], intermediate: "8 spots selected across Osaka area." },
      { label: "Build hanami guide", thinkingChain: ["Adding access info and best times", "Including food and drink tips", "Noting reservation requirements"], intermediate: "Complete hanami guide with maps and tips." },
    ],
    finalMessage: "Osaka Hanami Guide 2026! 🌸\n\n📅 Expected Peak: March 28 – April 5\n\n🏆 Top Spots:\n\n1. 大阪城公園 (Osaka Castle Park)\n   🌸 3,000+ trees | 🌙 Night illumination until 21:00\n   🚃 Osakajokoen Station | Free entry\n\n2. 造幣局 桜の通り抜け (Mint Bureau)\n   🌸 340+ trees, 130 varieties | Open ~1 week only\n   🚃 Temmabashi Station | Free (check dates!)\n\n3. 万博記念公園 (Expo Park)\n   🌸 5,500 trees | Wide open spaces for picnics\n   🚃 Bampaku-kinen-koen Station | ¥260 entry\n\n4. 毛馬桜之宮公園 (Kema Sakuranomiya)\n   🌸 4,500 trees along the river | Perfect for walks\n   🚃 Sakuranomiya Station | Free\n\n🍱 Hanami Tips:\n• Bring a blue tarp (ブルーシート) from Daiso (¥110)\n• Convenience store おにぎり + から揚げ = classic hanami food\n• Arrive before 11:00 on weekends to secure a spot\n• 花見酒: Asahi Super Dry is the unofficial hanami beer 🍺",
  },

  "jp-business-keigo": {
    demoUserInput: "Rewrite this Slack message for my client in proper business keigo: 「明日の打ち合わせ、14時でいいですか？資料送っときます。」",
    agentOpening: "I'll elevate this message to proper business keigo suitable for a client. Let me analyze and rewrite it.",
    steps: [
      { label: "Analyze current formality", thinkingChain: ["Detecting casual expressions", "Identifying missing honorifics", "Rating current politeness level"], intermediate: "Current level: 丁寧語 (polite) — needs upgrade to 尊敬語/謙譲語 for clients." },
      { label: "Rewrite in business keigo", thinkingChain: ["Converting 「いいですか」to proper inquiry form", "Adding appropriate 尊敬語 for client actions", "Using 謙譲語 for own actions"], intermediate: "Rewritten with proper 尊敬語/謙譲語 balance." },
      { label: "Add business email framing", thinkingChain: ["Adding proper opening greeting", "Including closing pleasantries", "Formatting for professional context"], intermediate: "Full business message formatted with opening and closing." },
    ],
    finalMessage: "Keigo Rewrite Complete! ✍️\n\n❌ Original (casual):\n「明日の打ち合わせ、14時でいいですか？資料送っときます。」\n\n✅ Business Keigo Version:\n「お疲れ様でございます。\n明日のお打ち合わせにつきまして、14時のご都合はいかがでしょうか。\n資料は事前にお送りいたします。\nご確認のほど、よろしくお願いいたします。」\n\n📝 Changes Made:\n| Original | Rewritten | Why |\n|----------|-----------|-----|\n| 打ち合わせ | お打ち合わせ | Added 御 prefix for client's meeting |\n| いいですか | ご都合はいかがでしょうか | Proper inquiry using 尊敬語 |\n| 送っときます | お送りいたします | 謙譲語 for your own action |\n| (no closing) | ご確認のほど… | Standard business closing |\n\n💡 Tip: For Slack, you can omit 「お疲れ様でございます」if it's a quick reply in an ongoing thread.",
  },

  "jp-line-tone": {
    demoUserInput: "Does this LINE message to my manager sound too casual? 「了解です！明日持っていきますね〜」",
    agentOpening: "I'll check the tone of your LINE message and suggest adjustments appropriate for messaging your manager.",
    steps: [
      { label: "Analyze tone markers", thinkingChain: ["Detecting casual markers (〜, ！)", "Checking 了解 appropriateness for 上司", "Evaluating overall impression"], intermediate: "Tone: slightly too casual for a manager. 2 issues found." },
      { label: "Suggest adjustments", thinkingChain: ["Replacing 了解 with proper acknowledgment", "Adjusting sentence-ending particles", "Balancing warmth and respect"], intermediate: "Adjusted version ready — maintains friendliness with proper respect." },
    ],
    finalMessage: "LINE Tone Check ✅\n\n📊 Tone Rating: Slightly too casual for 上司\n\n❌ Original:\n「了解です！明日持っていきますね〜」\n\n⚠️ Issues:\n1. 「了解」→ Use 「承知しました」for managers (了解 is peer-level)\n2. 「〜」→ Remove wave dash for 上司 messages\n\n✅ Suggested:\n「承知いたしました！明日お持ちいたしますね。」\n\n🎯 Tone Scale for LINE:\n• 友達: 「了解〜持ってくね！」\n• 先輩: 「了解です！持っていきますね」\n• 上司: 「承知しました！明日お持ちいたします」✅\n• 取引先: 「承知いたしました。明日お届けいたします。」\n\n💡 LINE Tip: Emojis (😊) are OK with most Japanese managers — they soften the message. But avoid stickers in first messages!",
  },

  "jp-apology-letter": {
    demoUserInput: "Write a formal apology letter for a project delay to our client.",
    agentOpening: "I'll draft a formal お詫び状 following Japanese business apology conventions. This is critical for maintaining the business relationship.",
    steps: [
      { label: "Structure the apology", thinkingChain: ["Following お詫び状 standard structure", "Setting appropriate formality level", "Including all required elements"], intermediate: "Structure: 拝啓 → acknowledgment → apology → explanation → countermeasures → closing." },
      { label: "Draft the letter", thinkingChain: ["Writing opening acknowledgment", "Expressing sincere apology (deep bow in writing)", "Explaining cause without making excuses", "Stating concrete corrective actions"], intermediate: "Full draft completed, 400 characters, proper business format." },
      { label: "Review formality", thinkingChain: ["Checking all keigo usage", "Verifying お詫び expressions", "Ensuring no blame-shifting language"], intermediate: "Formality verified: appropriate for client-facing correspondence." },
    ],
    finalMessage: "お詫び状 Ready! 📄\n\n---\n拝啓　時下ますますご清祥のこととお慶び申し上げます。\n平素は格別のお引き立てを賜り、厚く御礼申し上げます。\n\nこのたびは、弊社担当プロジェクトの納期遅延により、\n貴社に多大なるご迷惑をおかけいたしましたこと、\n心より深くお詫び申し上げます。\n\n遅延の原因は、開発工程における技術的課題の発生によるものでございます。\n現在、以下の対策を講じております。\n\n1. 開発チームの増員による工程短縮\n2. 週次の進捗報告の実施\n3. 品質管理体制の強化\n\n改めて新たな納期を○月○日とさせていただきたく存じます。\n今後このようなことがないよう、再発防止に努めてまいります。\n\n重ねてお詫び申し上げますとともに、\n変わらぬお引き立てを賜りますようお願い申し上げます。\n\n敬具\n---\n\n💡 Notes:\n• Print on company letterhead\n• Include 部長 or above as signatory for serious delays\n• Hand-deliver if possible (shows sincerity)",
  },

  "jp-nengajo": {
    demoUserInput: "Write nengajo messages for my 5 closest business contacts with different formality levels.",
    agentOpening: "I'll create personalized 年賀状 messages for each contact, matching the appropriate formality level for your relationship.",
    steps: [
      { label: "Categorize contacts", thinkingChain: ["Grouping by relationship type", "Setting formality levels", "Choosing seasonal greetings per group"], intermediate: "5 contacts categorized: 取引先(2), 上司(1), 同僚(1), 元上司(1)." },
      { label: "Draft messages", thinkingChain: ["Writing formal versions for clients", "Creating warm-yet-respectful for boss", "Adding personal touches for colleague"], intermediate: "5 unique messages drafted with appropriate formality." },
      { label: "Add design suggestions", thinkingChain: ["Selecting 干支 (zodiac) motif for 2027", "Recommending card styles per formality", "Adding printing tips"], intermediate: "Design suggestions matched to each contact's formality level." },
    ],
    finalMessage: "年賀状 Messages Ready! 🎍\n\n1️⃣ Client (Most Formal):\n「謹賀新年\n旧年中は格別のお引き立てを賜り厚く御礼申し上げます\n本年も変わらぬご愛顧のほどよろしくお願い申し上げます\n令和九年 元旦」\n\n2️⃣ Client (Formal):\n「謹んで新年のお慶びを申し上げます\n旧年中は大変お世話になりました\n本年もどうぞよろしくお願いいたします」\n\n3️⃣ Boss:\n「あけましておめでとうございます\n昨年は温かいご指導をいただき誠にありがとうございました\n本年もご指導ご鞭撻のほどよろしくお願いいたします」\n\n4️⃣ Colleague:\n「あけましておめでとうございます！\n昨年は大変お世話になりました\n今年も一緒に頑張りましょう！よろしくお願いします」\n\n5️⃣ Former Boss:\n「謹んで年頭のご挨拶を申し上げます\nご無沙汰しておりますがお変わりございませんか\n本年もご健勝をお祈りいたします」\n\n📮 Posting Deadline: Dec 25 for Jan 1 delivery\n🐍 2027 Zodiac: 巳年 (Year of the Snake)",
  },
};
