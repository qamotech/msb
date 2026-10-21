# Craigslist Gig Playbook: Baltimore

Swept Oct 17, 2026, at **baltimore.craigslist.org**, plus the "nearby areas" Craigslist adds automatically (DC, northern VA, Annapolis, Laurel, Rockville, Delaware). Categories: computer gigs, creative gigs, writing gigs, all-gigs keyword search, and web-design jobs.

> **Bottom line:** Baltimore looks like every other metro on Craigslist. Roughly 90% of computer and writing gigs are paid studies, "paid daily, enroll today" funnels, or mass-reposted "$100 per article" lead-gen ads. The web-design jobs board had **zero local Baltimore posts**. But the DMV spill-over produced **one genuinely strong build job** (a nonprofit website rebuild) and a well-paid on-site photo-editing gig. Answer those two now, then use Part 3 to post our own services ad.

---

## Part 1: Today's shortlist (vetted)

**Status: nothing has been answered.** Every reply needs your go-ahead, since it goes out under your name. Draft replies are in Part 5.

| # | Gig | Pay | Remote? | Our fit | Verdict |
|---|-----|-----|---------|---------|---------|
| 1 | [**Web designer, nonprofit site rebuild (DMV only)**](https://www.craigslist.org/view/d/washington-web-designer-dmv-only/3bpwtBZ2KWydCNtaaaxEHv): DC nonprofit *Independent Association of Ministers* is replacing independentministers.com. They provide all text and the blueprint; we do design, layout, imagery, Stripe/PayPal book sales, and the domain cutover. | "Standard DC rates" | Must **live** in DC/MD/VA (Baltimore qualifies); the work itself is remote | **Excellent.** Exactly what we build. | **Answer first. Posted 18 days ago, so speed matters.** They require 2–3 *live* portfolio links (see the note below), plus a resume, quote, timeline, and preferred platform. No agencies or teams; apply as yourself. Quote **$1,800–2,800**. |
| 2 | [**On-site photo editor, corporate conference, DC, Nov 9–10**](https://www.craigslist.org/view/d/washington-photo-editor-needed/enZKGW7AZMJGwn9KF3szTh): cull, light-edit and upload to Google Drive live, with the first images posted within 10 minutes of each session | $50/hr × ~17.5 h ≈ **$875** | No (downtown DC) | Good for you if you can run Lightroom-style culling and edits fast. | Answer if you're free those two days. Caveats: paid by check on-site and the venue is disclosed later. That's normal for event work, but confirm the agency name before Nov 9. |
| 3 | [Kit-home lead revival, Potomac MD](https://www.craigslist.org/view/d/dowell-sales-person-to-revive-old-leads/3PWddh5eYSryYZqrWaRniA): re-contact old leads for Caledonia Kit Homes by email, phone and text | $300 | Yes | Partial. We write the email and text sequence and track replies; **you** make the calls. | Optional. It's a real business with a named contact, but it's sales work. Ask whether $300 is flat or per conversion. |
| 4 | [Online live-selling host](https://www.craigslist.org/view/d/laurel-online-host-online-business/kmV5VvydJ9GaSZ7RKrfykc) and [eBay/Poshmark photo lister](https://www.craigslist.org/view/d/laurel-on-line-photo-lister-in-my-home/vcwu4LJyt1EVzG7Nv3MHSz), both in Laurel MD | $20/hr | No (in their home) | You only. Part-time steady work, not a build job. | Your call. Both look like real small resellers. |
| 5 | "Calling all IT Field Technicians" (Baltimore) | Per job | No | **Your personal fit**, given your telecom and IT background. | It's an app-recruitment ad; worth signing up as a side pipeline. |

**#1 update (Oct 17):** full application kit built in `IAM-Nonprofit-Gig/` (live portfolio at https://qamotech.github.io/web-portfolio/, a private redesign concept, proposal PDF, resume template, and a drafted reply). See its README. **Sent Oct 17**; follow up Oct 20 if there's no reply.

**Note on #1's portfolio requirement:** they reject applicants without 2–3 live websites. Before replying, we can publish 2–3 small showcase sites (for example a nonprofit template, a small-business site, and one Six-Pack app) on GitHub Pages in about an afternoon. Say the word and I'll build them.

**Rejected, with reasons (so they don't get re-checked):**
- *Remote Data Sorter, $3,450 ("Lake Movers LLC"):* a moving company paying $3,450 for vague, no-skill remote "data sorting" with "training provided". This is a classic check-fraud / reshipping template.
- *"► Freelance Writer Wanted, $100/article"* (dozens of reposts across Baltimore, DC and Philadelphia), *"Remote Writing Work Available…"*, *"Freelance Content Writers Wanted…"*, *"AI-Friendly Content Writers…"*: mass-reposted templates routing to off-site forms. The IAPWE one has been widely reported as a funnel for a paid writer "membership". Treat the whole family as lead-gen.
- *"Seeking Baltimore native for small writing assignment", $75 paid only if your op-ed or letter to the editor gets published:* ghost-written opinion pieces under a local name are astroturfing. Don't touch it.
- *"Hiring Expert for Google Business Listings (With Verification)", $30/hr (not opened):* "with verification" usually means verifying business listings you don't own, which violates Google's rules. Skip it unless the client proves they own the business.
- *Illustrators Needed / STEM Graduates Wanted, "AI-Powered Business" (Fairfax):* no company, no scope. Low signal.
- Everything marked "paid study", "focus group", "paid daily", "enroll today", "influencer posting", "Reddit post for $30", or commission-only funding/advisor "coaching".

---

## Part 2: The repeatable loop

### Daily sweep (20 minutes)
Open each search, wait a few seconds, and **scroll a little**: Craigslist renders results lazily. Check **"posted today"** and sort by **newest**.

```text
https://{area}.craigslist.org/search/cpg            computer gigs
https://{area}.craigslist.org/search/crg            creative gigs
https://{area}.craigslist.org/search/wrg            writing gigs
https://{area}.craigslist.org/search/ggg?query=website|wordpress|shopify|squarespace|excel|spreadsheet|resume|logo|kdp|automation|database
https://{area}.craigslist.org/search/web?is_telecommuting=1     web/html jobs, remote OK
https://{area}.craigslist.org/search/sof?is_telecommuting=1     software jobs, remote OK
```

`{area}` rotation: **baltimore** (daily), then **washingtondc, annapolis, frederick** (alternate days). Add **easternshore, smd, delaware** weekly. Baltimore's results already spill over into DC and northern VA, so the daily Baltimore sweep catches most DMV posts.

### Step 1: Triage (30 seconds per post)
Drop the post immediately if **any hard red flag** applies:

- [ ] Asks for SSN, bank or ID, or a "background check fee" before any contract
- [ ] Pay to start: training, kit, membership, "enrollment"
- [ ] Will mail you a check / "overpay and refund the difference"
- [ ] Contact only via WhatsApp, Telegram, or a text-only number
- [ ] Identical text reposted across many cities, or "apply at {offsite}.org"
- [ ] "Paid daily / enroll today / $X per day / residual income / be your own boss"
- [ ] Study, focus group, survey, mock jury (fine money for some, but not *work we deliver*)
- [ ] Pay is generous for a trivial task, no company is named, and it wants a resume and email first
- [ ] Asks you to publish, verify, or review something under a false identity (ghost op-eds, fake reviews, listing verification)

### Step 2: Score the survivors (0–10), act on 7+

| Factor | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| **Deliverable by us** (AI plus code, writing, data, design) | needs physical skill we lack | partial | mostly | fully |
| **Remote** | on-site only | 1 meeting | mostly remote | fully remote |
| **Pay clarity** | "negotiable" with no detail | range | clear rate or flat fee | — |
| **Legit signals** (named org, website or address, specific scope, recent) | none | some | strong | — |

Then add **+1** if it could become repeat work, and **−2** if it's more than 3 weeks old. *Today's #1 scores 3 + 2 + 1 + 3 + 1 − 0 = 10.*

### Step 3: Vet before replying (2 minutes)
1. Search the business name, website, address, or phone number. Is it a real organization with a real footprint?
2. Search the exact first sentence of the post in quotes. Mass reposts mean it's lead-gen.
3. Check for "AI not allowed". If present, skip it or deliver by hand only. Never pass off AI work as handmade.

### Step 4: Reply (needs your approval: it's sent under your name)
Use the Part 5 templates. Every reply should include **one concrete deliverable idea, a fixed quote or range, and a turnaround time**. Quote fixed prices for project work and hourly only for open-ended help.

### Step 5: Deliver: playbooks by task type

| Task type | How we deliver | Typical DMV quote |
|---|---|---|
| **Small-org or nonprofit website** | Their content and blueprint → our design → build (static or WordPress, per their platform) → Stripe or PayPal → domain/DNS cutover → 30-day fix window. | $1,500–3,500 |
| **Landing page** | Single page with copy, CSP, mobile layout and contact form → GitHub Pages or the client's host. | $300–900 |
| **Custom mini-tool** (calculator, tracker, dashboard) | Single-file HTML app like the Six-Pack ones: offline, no server, exports included. | $200–800 |
| **Data cleanup, reconciliation, spreadsheets** | Client sends files → we script the comparison → mismatch report plus cleaned sheet. | $100–300/project |
| **Photo culling and editing** | Culling pass (blur and duplicate detection) → natural edits → organized folders. On-site event work is you. | $50/hr on-site; $150–400 per remote project |
| **Lead-revival and outreach copy** | 3-touch email and SMS sequence plus a reply-tracking sheet; the client or you does the calls. | $150–400 |
| **Blog, article, web copy** | Outline → AI-assisted draft → your fact-check and voice edit → 1 revision. Disclose AI assistance if asked. | $50–150/post |
| **On-site IT, telecom** (you) | Field work: setup, network, cabling, POS. | $35–60/hr |

### Step 6: Get paid safely
- Projects: **30–50% deposit**, then a milestone payment, then the balance at launch. Use Stripe or PayPal invoices or Zelle. **Never accept a mailed check for more than the invoice.**
- Keep sites on a staging URL, and hand over DNS/hosting access only after final payment.
- Never ask clients for their passwords by message. Use their own invite or delegation features (registrar, Stripe team access, Google Drive sharing).
- On-site gigs paid by check: confirm the agency name in writing beforehand, and deposit promptly.

### Step 7: Log every lead
Keep one line per lead: `date | area | title | URL | score | status (seen/replied/quoted/won/lost/scam) | $`. Review it weekly to see which categories and areas convert, then prune the sweep list.

---

## Part 3: Flip the model (the highest-leverage move)

Gig posts are thin, but buyers browse **services**. Post our own ad weekly in **baltimore services → computer** (`/cps`) and **creative** (`/crs`), and alternate weeks in **washingtondc** too. Craigslist charges a small fee per services post.

> **Baltimore web designer: fast, fixed-price, local.** Small-business and nonprofit websites from $1,500, done in 2–3 weeks: mobile-friendly, donations and online payments, domain setup included. Landing pages in 48 h from $300. Spreadsheet cleanup from $100, custom calculators and dashboards from $200. Baltimore-based and meets in person anywhere in the DMV. Send your current site or idea for a same-day quote.

Attach screenshots of 2–3 live sites plus a Six-Pack app as a portfolio. The same portfolio is what gig #1 requires.

---

## Part 4: Running this with Claude
Paste this to start a session:

> "Run the Craigslist sweep from `Craigslist-Gig-Playbook.md` for baltimore (plus {extra areas}). Triage with the red-flag list, score survivors, vet the top 5, and update the shortlist table. Draft replies but **don't send anything**."

Claude can browse, triage, vet, draft replies, quote, and build the deliverables. **You** approve and send every reply, take payment, attend any in-person work, and own the client relationship.

---

## Part 5: Reply templates

**#1: Nonprofit site rebuild (I.A.M.)**
> Hello, I'm a Baltimore-based independent web designer (no agency, no team) and I'd like to rebuild independentministers.com from your blueprint.
>
> **Portfolio:** {live link 1}, {live link 2}, {live link 3}
> **Resume:** attached
> **Platform:** {WordPress, so your team can update pages and the Prisoner Prayer Handbook listing themselves | a fast static site with Stripe checkout, lowest upkeep}
> **Scope I'll deliver:** full replacement of the current site; clean, mobile-first layout; all project pages built to your blueprint; illustration and photo selection (licensed stock or public-domain, credited); Stripe or PayPal checkout for book sales; domain connection and launch; 30 days of post-launch fixes.
> **Quote:** ${fixed price}, with 40% to start, 40% at design approval, and 20% at launch.
> **Timeline:** design draft in {7} days, full site live in {3} weeks from receiving your content.
>
> Happy to meet in person anywhere in the DMV.

**#2: DC conference photo editor**
> Hi, I'm available Mon Nov 9 (7:30–6:30) and Tue Nov 10 (8:30–4:00) and can work to the 10-minute first-upload target. My workflow: ingest each card, cull hard for sharpness and expressions with no near-duplicates, natural exposure, color and crop corrections, then upload continuously into your Drive folders by track, day and session, with sessions and speakers first. I'll bring my own laptop and card readers. Could you confirm the agency or company name and how the check is issued? Thanks!

**#3: Kit-home lead revival**
> Hi Kevin, I can help revive your old leads. I'll write a short 3-touch sequence (an email, a follow-up text, and a final email with a call link), personalize it for A-frames, ADUs and barndominiums, and track every reply in a sheet you can see. Is the $300 a flat fee for working the list, or per qualified appointment? And roughly how many leads are there?

**General gig (fill in)**
> Hi, re: "{title}". Here's how I'd handle it: {one-line plan}. Deliverable: {what they get}. Price: {fixed $}. Turnaround: {days}. I can start {date}. Happy to answer questions first.
