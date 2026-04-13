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
};
