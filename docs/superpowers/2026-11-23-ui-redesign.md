# UI redesign (Nuxt UI) — design + plan

**Goal:** Redesign the public site with Nuxt UI (light + dark), a project carousel, a Pinterest-style gallery, and an ATS-friendly generated CV. Professional and straightforward.

**Decisions (approved):** Nuxt UI v4 (not DaisyUI: CSS-only, no carousel/lightbox logic). Top navbar replaces the sidebar. Gallery = admin-managed images (seeded with project screenshots). Visitor goal = contact you. Default theme follows the system; both themes first-class.

## Global constraints
- Keep admin, uploads, CV toggle, SQLite store, auth. Public pages SSR from `/api/content`.
- New content: `gallery[] {id,image,caption,tags[]}`, `education[] {id,school,degree,period,details}`; `profile.phone`, `profile.location` (default ""); `projects[].tags[]`, `projects[].gallery[]` (default []). Old DBs must keep working (normalize on open + insert missing sections).
- ATS CV: single column, real text only (no tables/icons/colour dependence), standard headings in this order — SUMMARY, EXPERIENCE, SKILLS, EDUCATION, PROJECTS (omit empty ones) — consistent dates, descriptions rendered as `- ` bullets (one per line; a single long paragraph is split into sentences), contact line plain text, PDF metadata (title, author, subject, language), filename `<Name>_Resume.pdf`.
- Icons via local Iconify collections (`@iconify-json/lucide`, `simple-icons`), no runtime icon API calls (CSP).
- No AI attribution in commits.

## Tasks
1. **Content model (TDD, bun test):** add sections/fields above with zod defaults; `openStore` re-parses every stored section through its schema on open (adds defaults) and inserts missing sections; update seed (gallery from project screenshots + `project-1..4.avif`, tags on projects, empty education/phone/location). *Verify:* `bun test server`.
2. **ATS CV (TDD):** rewrite `server/lib/cv.ts` (`buildCvPdf(content): Promise<Uint8Array>`, `toBullets(text): string[]`); tests extract text with `unpdf` and assert heading order, `- ` bullets, no `?` replacement of ordinary Latin text, empty sections omitted, metadata title/author, long-text pagination, non-Latin safe; update `/cv` filename + hero download name. *Verify:* `bun test server`, smoke-api.
3. **Nuxt UI shell:** install `@nuxt/ui`, icon collections; `app.vue` → `<UApp>`; new `layouts/default.vue` with `UHeader` (logo/name, nav Home/Work/Gallery/Services/Contact, `UColorModeButton`, mobile menu) and `UFooter`; `main.css` imports tailwind + `@nuxt/ui`, fonts (Space Grotesk), legacy admin variables aliased to `--ui-*` tokens; `app.config.ts` colors (primary blue, neutral zinc); remove old shell components, sidebar, splash, old theme code. *Verify:* typecheck, build, pages 200.
4. **Home:** `HeroSection`, `CounterStrip`, `ProjectCarousel` (`UCarousel`, autoplay, arrows, dots, project cards), `ExperienceTimeline`, `StackGrid`, `ServicesGrid`, `GalleryMasonry` preview, `ContactCta`. *Verify:* SSR HTML contains seeded content; typecheck/build.
5. **Pages:** `/work` (carousel + project grid with detail modal & extra images), `/gallery` (CSS-columns masonry, tag filter, lightbox `UModal` with prev/next/keyboard), `/services`, `/contact` (mailto CTA + `UAccordion` FAQ), 404. *Verify:* each route 200, `/nope` 404.
6. **Admin:** add gallery/education sections and new profile/project fields (new `tags` text and `imagelist` field types); restyle with Nuxt UI tokens; delete obsolete components and unused deps (`lucide-vue-next`, `motion-v` if unused). *Verify:* typecheck, smoke scripts, bun test.
7. **Wrap-up:** README update, full verification, final review, delete `docs/`.
