# GLOARO Partnerships — Build Phases (handoff)

Read this file first, then `GLOARO_PARTNERSHIP_MASTER_PLAN.md` (the full brief) in the same folder.
This file records what was already decided in the planning session on 2026-10-11, so you do not redo it.

---

## 1. Goal in one line

Build two separate, highly animated, easy-to-understand partner journeys — **GLOARO Franchise** and **GLOARO Channel Partner** — that explain each business model step by step as the visitor scrolls, and convert visitors into real, saved applications.

## 2. What the user wants (non-negotiable)

- **Rich, step-by-step ("inch by inch") scroll animation.** The user rejected static mockups. Each page tells its business model as a pinned scroll story: one step per scroll, one short caption per step.
- **CodePen-quality micro-interactions** on cards, dropdowns, form fields, buttons, tabs, progress and success states (see section 6).
- **Very easy to understand.** Animation must explain the business, not just decorate it.
- **Conversion first.** An Apply call-to-action roughly every 1.5 screens, each one naming its path.
- Franchise and Channel Partner are **never merged**: separate pages, forms, API types and admin records.
- **No invented commercial claims** (investment, commission, territory exclusivity, review time, stats, testimonials). Use amber `[Pending management approval]` placeholders from one config file.

## 3. Repo audit (verified 2026-10-11)

| Area | Finding |
|---|---|
| Stack | React 19, Vite 8, Tailwind 4, React Router 7 (`src/App.jsx`). JavaScript, not TypeScript. |
| Already installed | `gsap` 3.15, `framer-motion` 12, `lenis`, `three` / `@react-three/fiber` / `drei`, `react-hook-form`, `axios`, `react-hot-toast`, `lucide-react`. **No new dependencies needed.** |
| Motion helpers | `src/hooks/useMotionEnv.js` (`useAmbient`, `usePointerEffects`, `useCanHover`, reduced motion, ambient budget), `src/lib/motion.js` (eases, springs, variants), `src/components/motion/*` (`SmoothScroll`, `Scroll`, `Text`, `Interactive` with `TiltCard` / `Magnetic`, `DrawIcon`). Reuse them. |
| SEO | `src/lib/seoConfig.js` + `scripts/prerender-seo.mjs` (runs in `npm run build`). New routes need entries in both. |
| API | `src/api/axios.js`, base URL `VITE_API_BASE_URL` (dev `http://localhost:5000/api/v1`, prod `https://api.gloaro.com/api/v1`). Pattern example: `src/api/membershipApplication.js`. |
| Backend | **🔴 Not present in `~/gloaro project`.** No local repo implements the existing `/membership-applications` API. Phase 6 is blocked until the user gives the backend repo. |
| Existing lead form | `src/components/marketing/page/EnquiryForm.jsx` only opens WhatsApp; nothing is saved. Do not copy that pattern for partner forms. |
| Contact | `src/lib/contact.js` (`WHATSAPP_PHONE`, `whatsappLink`). |
| Legal | `/privacy-policy` and `/terms-and-conditions` exist (`src/pages/public/LegalPage.jsx`). |
| Admin | Role-based admin area (`src/routes/ProtectedRoute.jsx`, `adminNav` in `src/constants/navigation.js`, existing application review pages in `src/pages/admin/`). |
| Conflict | `src/components/Navbar.jsx` line ~43: the Network menu has a "Franchise" group (Available Locations / Apply Franchise / Franchise Partners) pointing to `/network#…`. Needs a user decision (section 9). |
| Deploy | Vercel, SPA rewrite in `vercel.json`. |

## 4. Brand (decided)

Use the repo / UI-UX Foundation palette, not the brief's blue/orange:

- Navy deep `#061A3A`, navy `#0B2451`, raised navy `#0B2A5B`, royal `#1558B0`
- Gold `#F5A900` (navy text on gold; never white on gold)
- Orange `#F28C00` for highlights only
- Surface `#F7F9FC`, border `#D9E1EC`, ink `#14213D`, muted text `#4A5874`, muted on dark `#B8C5D9`
- Fonts: **Outfit** (headings) + **Work Sans** (body); both are already self-hosted in `src/index.css`.

Franchise mood: dark navy + gold, "build and operate". Channel Partner mood: lighter blue, "connect and refer". They must look clearly different.

## 5. Approved static layout reference

Design canvas (private, owner's claude.ai account): https://claude.ai/artifact/LstaUxBXWaR8KrNprnUNDM

Six screens: `/partners` landing (with a working "Find your fit in 3 taps" picker), Franchise page, Channel Partner page, Apply form step 3 of 5, mobile landing with sticky apply bar, and the mobile "Application received" screen. Use it for **layout and content**; the motion layer below is added on top.

## 6. CodePen reference map (rebuild in our stack — never paste raw pens)

Rebuild each effect with React + Tailwind + GSAP/framer-motion. Skip jQuery and GSAP 2 code. Check each pen's licence before reusing code (public pens are generally MIT). These were found from search results only; open and check each pen before relying on it.

| Section | Main reference | Backup |
|---|---|---|
| Pinned scroll story (core of both pages) | https://codepen.io/bekahmcdonald/pen/mdPpJKR | https://codepen.io/GreenSock/pen/YzyqVNe |
| Product screen scenes (School / Hospital / CRM) | https://codepen.io/GreenSock/pen/eYEyjgw | https://codepen.io/GreenSock/pen/vYJovOo |
| Timeline + HQ→customer lines drawing on scroll | https://codepen.io/GreenSock/pen/rNOBLBV | https://codepen.io/snorkltv/pen/KKmZYGy |
| Referral network nodes + lines | https://codepen.io/neilrussell6/pen/OmJdzP | https://codepen.io/alinek/pen/vKbRpd |
| Opportunity card flying to GLOARO (Flip) | https://codepen.io/AstroMash/pen/qBvJQBV | https://codepen.io/GreenSock/pen/eYdyVVe |
| Path / service cards: 3D tilt + glow (desktop only) | https://codepen.io/markmiro/pen/wbqMPa | https://codepen.io/roniee_1993/pen/VYvrgyd |
| Magnetic Apply buttons | https://codepen.io/gusevdigital/pen/QWoOZMV | https://codepen.io/GreenSock/pen/MWRPXMr |
| Franchise ⇄ Channel Partner switcher (sliding pill) | https://codepen.io/dsr/pen/ZEpgKym | https://codepen.io/woranov/pen/NRqLWK |
| "Partner with us" navbar dropdown | https://codepen.io/codypearce/pen/PdBXpj | https://codepen.io/CodeBoomer/pen/pbONgz |
| Form fields: floating labels, step slide, shake on error | https://codepen.io/arazzon/pen/GRoxGWx | https://codepen.io/dannibla/pen/amgRNR |
| Form stepper progress | https://codepen.io/abduraxmon007/pen/gOvLYKd | https://codepen.io/davidemoli/pen/WmYvVa |
| Success checkmark | https://codepen.io/Johannakv/pen/XWzQKpe | https://codepen.io/gbuddell/pen/KwoRLX |
| FAQ accordion (supports reduced motion) | https://codepen.io/ddZ6ii/pen/GRLZvoy | — |

Motion rules: do not animate one property with two libraries; GSAP for scroll stories, framer-motion for micro-interactions; animations only run while on screen (`useAmbient`); clean up ScrollTriggers on unmount; check Lenis + ScrollTrigger work together (`src/components/motion/SmoothScroll.jsx`); no layout shift.

## 7. Routes

```
/partners                         shared landing (choose your path)
/partners/franchise               Franchise journey
/partners/franchise/apply         5-step Franchise form
/partners/channel-partner         Channel Partner journey
/partners/channel-partner/apply   5-step Channel Partner form
/admin/partnership-applications   protected admin review
```

Suggested folder: `src/components/partners/` (shared pieces, stories, forms) and `src/pages/partners/` (pages). One config file: `src/components/partners/partnerConfig.js` for all unapproved business values.

---

## 8. Phases

Work in order. Run `npm run lint` and `npm run build` at the end of every phase and report real results. Preserve all existing routes and pages.

### Phase 0 — Animation storyboard (get user approval before coding)
Add storyboard frames to the design canvas (section 5): each story step as one frame with its caption and the CodePen effect it uses.

**Franchise story "Build your business"** (6 steps)
1. City map; a pin drops — "Your GLOARO office."
2. GLOARO HQ connects; School, Hospital and CRM screens fly into the office — "You get ready products."
3. Schools, clinics and shops nearby light up — "You find local customers."
4. Lines from HQ to each customer; their screens switch on — "GLOARO builds and delivers."
5. Training and updates loop back to the office — "We support you."
6. The 7-step journey timeline fills, ending at **Apply for Franchise**.

**Channel Partner story "Introduce and we deliver"** (6 steps)
1. You, a phone, your contacts as dots.
2. One contact glows, "needs school software"; you tap **Introduce**.
3. An opportunity card flies to GLOARO.
4. Status changes live: Under review → Discussion → Proposal.
5. GLOARO meets the customer; their software screen is built.
6. A notification lands on your phone, "Outcome shared with you", then **Apply as Channel Partner**.

**Landing story "Two roads"**: the road splits — an office is built on the left (Franchise), a network connects on the right (Channel Partner). Each "Find your fit" answer moves an arrow towards one road.

Gate: the user approves the storyboards.

### Phase 1 — Foundation and the `ScrollStory` component
- Add routes (lazy-loaded, same pattern as `App.jsx`), `seoConfig` + prerender entries, "Partner with us" in navbar and footer, `partnerConfig.js`.
- Build one reusable `ScrollStory`: pinned stage, steps, captions, step progress dots, a "Skip story" link, a mobile-light version, and a reduced-motion version that shows each step as a static frame with its caption.
- Shared pieces: section wrapper, path switcher (sliding pill), tilt card, magnetic button, timeline, FAQ accordion, "Demo Preview" badge, CTA band.
- Gate: a demo story scrolls smoothly on desktop and mobile; existing pages are unaffected.

### Phase 2 — `/partners` landing
"Two roads" hero, two path cards (tilt + glow), animated "Find your fit" picker, comparison table with rows revealing one by one, product demo cards labelled Demo Preview, how each path works, FAQs, final split CTA plus "Talk to us on WhatsApp".
Gate: a visitor can tell the two paths apart within 10 seconds.

### Phase 3 — Franchise page
Sticky path switcher with Apply button, the 6-step "Build your business" story, what a franchise is, who can apply, "GLOARO provides / You provide" with items sliding into their columns, eligibility self-check with a progress ring (nothing is sent), territory notice (no exclusivity claim), 7-step timeline drawing on scroll, investment placeholder, FAQs, CTA.
Gate: the whole story works; every commercial statement is approved or a placeholder.

### Phase 4 — Channel Partner page
The 6-step referral story, partner-type chips, services they can introduce, "Who does what" table (Refer / Qualify / Close × You / GLOARO / Customer) revealing column by column, commercial-terms notice, animated tracker preview labelled Demo Preview, FAQs, CTA.
Gate: it looks and feels clearly different from the Franchise page.

### Phase 5 — Two 5-step application forms
Fields as in the master plan §8. `react-hook-form`; floating labels; steps slide; progress stepper fills; errors shake gently and are announced via `aria-live`; step 1 asks only name, email, phone, city; draft saved to localStorage (wrapped in try/catch); review step with edit links; required privacy consent (link `/privacy-policy`) and separate optional marketing consent; submit disabled while sending, with an idempotency key; failures keep all answers and allow retry; success (checkmark draws itself, then the reference with a copy button) **only after the server confirms the save**. Until Phase 6 exists, the submit button stays clearly disabled with a message — never fake success.
Gate: correct application type is sent; errors never erase answers.

### Phase 6 — Backend and admin (🔴 blocked: needs the backend repo)
Endpoints (only if nothing equivalent exists): `POST /partnership-applications/franchise`, `POST /partnership-applications/channel-partner`, admin `GET` list / `GET :id` / `PATCH :id/status`. Server-generated references (`GF-YYYY-####`, `GC-YYYY-####`), type `FRANCHISE` / `CHANNEL_PARTNER`, statuses `SUBMITTED, UNDER_REVIEW, SHORTLISTED, DISCUSSION, APPROVED, REJECTED`, consent values and timestamps, notes, reviewer, audit history. Server validation, rate limiting, honeypot field, admin role checks. Admin screens inside the existing dashboard with type / status / date filters.
Gate: success only after real persistence; unauthorised users cannot read records.

### Phase 7 — Performance, accessibility, SEO, analytics
Lazy-load story scenes; lighter mobile stories; reduced-motion frames; keyboard and screen-reader checks; focus states; colour contrast; unique titles, meta descriptions and canonical URLs; FAQ schema only where accurate. Funnel events with **no personal data**: path card clicked, picker result, comparison viewed, form started, step completed, validation error, submitted.

### Phase 8 — Testing and launch
Test every route, both forms, API failure and retry, duplicate prevention, admin access, phone / tablet / desktop, reduced motion. Run lint and the production build. Report the actual commands and results, remaining defects and production blockers.

---

## 9. Open decisions (ask the user; do not guess)

1. **Backend repo location** for `api.gloaro.com` (blocks Phase 6).
2. **Old Network → Franchise menu** in `Navbar.jsx`: point it to `/partners/franchise`, or is it a separate network franchise programme?
3. **Approved business details:** franchise investment range, eligibility, territory rules, training/support scope, Channel Partner commission and payment terms, review timeframe, official contact email, notification recipients.

## 10. Prompt to start the new session

> Read `PARTNERSHIP_PHASES.md` and `GLOARO_PARTNERSHIP_MASTER_PLAN.md` in the project root. Phases are already planned and the repo is already audited — do not redo the audit. Start with Phase 0: add the animation storyboard frames to the design canvas at https://claude.ai/artifact/LstaUxBXWaR8KrNprnUNDM and wait for my approval. Then continue phase by phase, running lint and build after each, and ask me only the open decisions in section 9.

---

## 11. Build status (updated 2026-10-11)

| Phase | Status |
|---|---|
| 0 Storyboard | Done, approved (canvas rows "Storyboard · …") |
| 1 Foundation + `ScrollStory` | Done |
| 2 `/partners` landing | Done |
| 3 Franchise page | Done |
| 4 Channel Partner page | Done |
| 5 Application forms | Done; **submit stays locked** until the API exists |
| 6 Backend + admin | Admin **frontend done** (`/admin` and `/super-admin/partnership-applications`); backend still deferred |
| 7 Performance, a11y, SEO, analytics | Done (axe: 0 violations on all 5 routes) |
| 8 Testing | Done for the frontend; see the session report |

Decision (2026-10-11): the Gloaro Network district franchise on `/network` and the technology franchise on `/partners/franchise` are separate programmes. The Network menu stays as is; both pages cross-link.

Key files: `src/components/partners/` (config, UI, `ScrollStory`, `stories/`, `forms/`), `src/pages/partners/`, `src/api/partnershipApplication.js`, `src/lib/partnerAnalytics.js`.

All unapproved business values live in `src/components/partners/partnerConfig.js` (`approved` object, value `PENDING`). Replace a value there and every page updates; FAQ structured data only includes answered questions.

### Enabling submission (after Phase 6)
Set `VITE_PARTNERSHIP_API_ENABLED=true` in the deploy environment. Until then the Submit button is disabled with an explanation. No success screen can appear without a server reference.

### API contract the frontend expects
- `POST /partnership-applications/franchise` and `POST /partnership-applications/channel-partner` (relative to `VITE_API_BASE_URL`).
- Header `Idempotency-Key: <uuid>`. The same key is resent on retry, so the server must return the original result for a repeated key and never create a duplicate.
- Body: `{ applicationType: 'FRANCHISE' | 'CHANNEL_PARTNER', contact: { fullName, email, phoneCountryCode, phone, city }, answers: { …step fields }, consents: { privacy, privacyAcceptedAt, marketing, marketingAcceptedAt }, honeypot, source }`. Reject when `honeypot` is not empty. Check that `applicationType` matches the route.
- Success: `2xx` with `{ data: { reference: 'GF-YYYY-####' | 'GC-YYYY-####', status: 'SUBMITTED' } }`. A response without `reference` is shown as a failure.
- Errors: `400` with `{ message }` is shown to the user; `409` duplicate; `429` rate limit. Answers are always kept on failure.
- Admin endpoints (screen already built in `src/pages/admin/PartnershipApplicationsPage.jsx`; Admin and Super Admin only, permission `members.applications`):
  - `GET /admin/partnership-applications?page&limit&type=FRANCHISE|CHANNEL_PARTNER&status&from=YYYY-MM-DD&to=YYYY-MM-DD&search` returns `{ data: [record], pagination }`. `search` matches reference, name or email.
  - `GET /admin/partnership-applications/:id` returns `{ data: record }`.
  - `PATCH /admin/partnership-applications/:id/status` with body `{ status, note? }` returns `{ data: record }`. It should append to `history`.
  - Record: `{ _id, reference, applicationType, status, createdAt, contact, answers, consents, history: [{ status, note, at, by: { name } }] }`. Never return internal notes from public routes.
  - A 404 from the list endpoint shows "API not connected yet" in the dashboard instead of an error.
