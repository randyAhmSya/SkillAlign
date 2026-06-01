Design a web application called SkillAlign — an AI-powered career intelligence platform for job seekers. The product is B2C, desktop-first but fully responsive (mobile + tablet + desktop).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
APP PURPOSE & VIBE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SkillAlign solves the skill mismatch problem in the job market. It lets users upload their CV, get an AI matching score against job listings, see a radar chart of their skill gaps, and receive learning path recommendations. The vibe is: intelligent but approachable — like a personal career coach inside a dashboard. "Future-ready" tech energy without being cold or intimidating.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DESIGN SYSTEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Color Palette (light mode):
- Primary accent: Soft Pink — #F4C0D1 (light), #D4537E (default), #993556 (dark/hover)
- Secondary accent: Teal — #9FE1CB (light), #1D9E75 (default), #0F6E56 (dark/hover)
- Backgrounds: #FFFFFF (surface), #F8F6F4 (page bg), #F1EFE8 (subtle fill)
- Text: #1A1A1A (primary), #5F5E5A (secondary), #B4B2A9 (muted/placeholder)
- Border: rgba(0,0,0,0.12) default, rgba(0,0,0,0.25) hover/active
- Success: #1D9E75 (teal), Warning: #BA7517 (amber), Error: #E24B4A (red)

Dark mode (toggle):
- Backgrounds: #1C1C1A (page), #252522 (surface card), #2E2E2B (elevated)
- Text: #F1EFE8 (primary), #888780 (secondary), #5F5E5A (muted)
- Accent pink dark: #ED93B1 (lighter for dark bg visibility)
- Accent teal dark: #5DCAA5 (lighter for dark bg visibility)
- Borders: rgba(255,255,255,0.1)

Typography:
- Headings: Inter or Plus Jakarta Sans, weight 500–600
- Body: Inter, weight 400, line-height 1.7
- Code/mono: JetBrains Mono (for matching scores, percentages)
- Scale: 12 / 13 / 14 / 16 / 18 / 22 / 28 / 36px

Spacing system: 4px base grid. Use 4, 8, 12, 16, 24, 32, 48, 64px
Border radius: 6px (badge/pill), 8px (button/input), 12px (card), 16px (modal/panel), 24px (full-pill button)
Shadows: none for flat; 0 1px 3px rgba(0,0,0,0.08) for elevated cards (use sparingly)
Icons: Tabler Icons outline set (consistent stroke weight 1.5px)

Component Tokens:
- Primary button: bg #D4537E, text white, radius 24px (pill), hover bg #993556
- Secondary button: bg transparent, border 1.5px #D4537E, text #D4537E, radius 24px
- Ghost/text button: no border, text #1D9E75, underline on hover
- Input field: bg white (dark: #2E2E2B), border 1px rgba(0,0,0,0.15), radius 8px, height 44px, focus border #D4537E
- Card: bg white (dark: #252522), border 0.5px rgba(0,0,0,0.1), radius 12px, padding 20–24px
- Badge/tag: radius 6px, small variant 11px font, medium 12px
- Nav active state: left border 3px solid #D4537E, bg teal-50 tint
- Score ring: circular progress, stroke #D4537E on #F1EFE8 track, percentage in mono font center
- Radar chart: teal fill rgba(29,158,117,0.15), teal stroke #1D9E75, grid lines rgba(0,0,0,0.08)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAGE ARCHITECTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PAGE 1 — Landing / Hero (/)
Layout: Full-width marketing page, single scroll
Sections:
  [Navbar] Logo left | Links center (Features, How It Works, Dashboard) | "Get Started" pill-button right | Dark mode toggle
  [Hero] Large headline "Navigate Your Career with AI Precision" | Sub "Upload your CV. See your skill gaps. Get your path." | Two CTAs: "Try Free" (primary pink pill) + "See Live Demo" (ghost teal) | Hero illustration: abstract radar chart / CV-to-job flow graphic (SVG)
  [How It Works] 3-step horizontal strip: (1) Upload CV → (2) AI Matches Jobs → (3) Get Learning Path. Each step: icon circle (teal bg), bold number, short label, 2-line description.
  [Features Grid] 2×2 or 3-col card grid: CV Matching / Skill Gap Radar / Learning Path / Career Dashboard. Each card: icon top, title, 2-sentence desc. Cards with teal-left-border accent.
  [Social Proof] Minimal stats bar: "X CVs analyzed · X Skills mapped · X Careers accelerated" (placeholder)
  [Footer] Logo | nav links | "Powered by DBS Foundation Coding Camp 2026" | Dark mode toggle

PAGE 2 — Auth: Register & Login (/auth)
Layout: Split-screen, left panel = brand/illustration, right = form
Left panel: Gradient from pink-50 to teal-50 | SkillAlign logo + tagline | Animated/static skill radar illustration
Right panel (light card, 480px max-width centered):
  [Login tab] Email + Password inputs | "Forgot password?" link | Primary pill "Sign In" button | "or continue with Google" (gray outline) | Switch to register link
  [Register tab] Full name + Email + Password + Confirm password | Career preference selector (dropdown: Tech / Marketing / Finance / Design / Other) | Terms checkbox | Primary "Create Account" button
States to design: default, hover, focus (pink border), error (red border + message below), success, loading (button spinner)

PAGE 3 — CV Upload & Analysis (/upload)
Layout: Centered single-column, max-width 640px, generous vertical spacing
Sections:
  [Progress stepper] 3 steps top: "Upload CV" → "Analyzing" → "Results". Active = pink, done = teal, inactive = gray.
  [Step 1 — Upload] Large dashed dropzone area (full width, 200px tall, radius 12px, border 2px dashed pink-300). Icon ti-file-upload center + "Drag your CV here or browse". Below: "Supported: PDF only · Max 5MB". Secondary link "Don't have a PDF? Paste text instead".
  [Step 2 — Analyzing] Full-width progress animation. Three status rows with spinner/check icons: "Extracting text from CV..." → "Running AI matching..." → "Computing skill gaps...". Animated pulsing state. Teal accent for completed steps.
  [Step 3 — Select Job Target] Dropdown: search/select job title. OR paste a job description textarea (200px). "Match now" primary button.

PAGE 4 — Results Dashboard (/dashboard)
Layout: Sidebar left (240px fixed) + main content area right
[Sidebar] Logo top | User avatar + name + email | Navigation items with icons:
  - ti-home "Overview" | ti-file-cv "My CV" | ti-chart-radar "Skill Gap" | ti-briefcase "Job Matches" | ti-school "Learning Path" | ti-settings "Settings"
  Active state: pink left-border accent, teal-tinted bg

[Main Content — Overview tab]
  Top bar: "Good morning, [Name]" heading left | Date right | Notification bell icon
  [Summary Cards Row] 4 metric cards (horizontal): Overall Match Score (big % in mono pink), Skills Matched (count), Skill Gaps Found (count), Learning Resources (count). Cards: bg secondary, no border, radius 8px.
  [Two-column grid]:
    Left (60%): CV-Job Match Panel — job title at top, company name, match % circular ring (pink stroke), below: matched skills as teal pills, missing skills as pink/red pills (outline style).
    Right (40%): Quick Stats — top 3 recommended jobs list, each with match % bar.
  [Full-width]: Skill Gap Radar Chart section — title "Your Skill Profile vs Industry Demand". Radar: 6–8 axes (Communication, Python, Data Analysis, SQL, ML, Cloud, Leadership, Project Mgmt). Two layers: user fill (teal semi-transparent) + industry demand (pink dashed outline). Legend below chart.
  [Full-width]: Top 5 Job Matches — table/card list. Each row: Job title | Company | Match % bar | Missing skills count | "View Details" link.

[Skill Gap Tab — /dashboard/skills]
  Full-width radar chart (larger version, 480px)
  Below: Skill breakdown table: Skill name | Your level (bar) | Required level (bar) | Gap indicator (red/green dot)
  Filter by category: All / Technical / Soft Skills / Domain

[Learning Path Tab — /dashboard/learning]
  Timeline-style vertical layout. Each item: category badge (teal/pink), course title, platform (Coursera/Dicoding/etc.), duration, difficulty tag, "Start Learning →" link (opens external)
  Grouped by skill gap priority: Critical (red badge) → Important (amber) → Nice to have (gray)

[Job Matches Tab — /dashboard/jobs]
  Filter bar: Job title search | Location dropdown | Match % slider (min 60%) | Remote toggle
  Card grid (2 cols): each card: job title, company, location, salary range, match % ring (small, 48px), skill pills, "Analyze this job" button (primary small) + "Save" icon button

PAGE 5 — Public Analytics Dashboard (/insights)
Layout: Full-width, scrollable — this is the Streamlit-style public page
Sections:
  [Page Header] "Job Market Intelligence 2026" title | Subtitle "Explore in-demand skills and hiring trends"
  [Filter Row] Industry selector | Location selector | Date range picker | "Apply" button
  [KPI Row] 4 metric cards: Total Jobs Analyzed | Most In-Demand Skill | Avg Salary Range | Top Hiring Industry
  [Chart Row 1 — 2 cols]: Bar chart "Top 20 In-Demand Skills" left | Donut chart "Job Category Distribution" right
  [Chart Row 2 — full-width]: Line chart "Skill demand trends over time" (3–4 skills as lines, teal/pink/gray palette)
  [Chart Row 3 — 2 cols]: Heatmap "Skills by Industry" left | Scatter plot "Salary vs Experience Level" right
  [Data Table] Raw job posting preview table: filterable, sortable. Columns: Job Title | Company | Skills Required | Salary | Date

PAGE 6 — Settings (/settings)
Layout: Sidebar nav (same as dashboard) + settings panel
Tabs: Account | Notifications | Privacy | Appearance
  [Account tab] Avatar upload | Name | Email | Password change | Career preferences multiselect
  [Appearance tab] Light / Dark / System toggle (3 option pill selector) | Font size preference | Color accent selector (pink default, can adjust teal intensity)
  [Privacy tab] "Delete my CV data" danger zone card (red border), "Export my data" link, consent toggles

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REUSABLE COMPONENTS TO BUILD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Navbar (2 states: marketing / app)
Sidebar navigation (expanded + collapsed)
Score ring (circular progress, 3 sizes: sm/md/lg)
Radar chart frame (placeholder, labeled)
Skill pill (matched = teal, missing = pink, neutral = gray)
Match score bar (inline, with % label)
Progress stepper (3 steps)
Upload dropzone (default, drag-hover, uploading, success, error)
Job match card
Learning path item card
KPI metric card
Toast notification (success/error/info)
Modal (confirmation, details)
Avatar + initials fallback
Dark mode toggle (sun/moon icon swap)
Loading skeleton (for cards and chart placeholders)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DESIGN RULES & NOTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Soft, intelligent feel: avoid harsh contrasts. Use a lot of negative space.
- Pink is the primary attention color (CTAs, active states, scores). Teal is the success/positive color (matched skills, completed states, charts).
- Never use pure black (#000) or pure white (#FFF) — always off-tones.
- Rounded corners everywhere — no sharp rectangles except horizontal dividers.
- Mobile-first responsive: sidebar collapses to bottom tab bar on mobile, cards stack to 1-col.
- Data viz colors: radar chart → teal fill + pink outline. Bar charts → teal bars. Lines → alternate pink/teal/gray.
- The tone is calm-confident: large whitespace, mono font for numbers, subtle animations implied (chart draw-in, skeleton → content fade).
- Accessibility: all interactive elements have focus states. Color is never the only indicator (add icons/labels too).
- All screens should exist in: Light mode + Dark mode variants.