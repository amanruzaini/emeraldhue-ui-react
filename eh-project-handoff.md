# Emerald HUE (EH) Component Library — Project Handoff Summary

> **Last updated:** 2026-03-30
>
> | Date       | Change                                                                                                                                                                                                                                     |
> | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
> | 2026-03-30 | Restructured from original monolithic handoff doc. Moved issues to `known-issues.md`, workflow/agent roles to `workflow.md`, removed duplicated rules (now in `component-patterns.md` only). Components section condensed to table format. |

---

## What we want to build

A React component library for Petronas' **Emerald HUE (EH)** design system, targeting industrial environments (oil rigs, control centres). Goals:

- shadcn/ui as the component base where behaviour is complex, scratch builds using CVA where behaviour is simple
- EH design tokens driving all visual decisions — no hardcoded values
- Full multi-mode theming: `theme-light`, `theme-dark`, `theme-light-high-contrast`, `theme-dark-high-contrast`, `theme-light-colour-blind`, `theme-dark-colour-blind`
- Text resize: `text-resize-75`, `text-resize-100`, `text-resize-125`, `text-resize-150`, `text-resize-200`
- Figma Code Connect integration — every component maps back to Figma dev mode
- Docs site built with Nextra 4 (Next.js) in `packages/docs` — live component previews, theme switching, EH-branded
- State management via context providers (`ThemeProvider`, `TextResizeProvider`) with a `PreferencesAdapter` interface designed to scale from localStorage → microservice

---

## Repository structure

```
emeraldhue-ui-react/
├── package.json              ← npm workspaces: ["packages/*"]
├── tsconfig.json             ← composite, strict, path aliases
├── .gitignore
└── packages/
    ├── tokens/
    │   ├── package.json      ← @eh/tokens
    │   ├── tsconfig.json
    │   └── src/
    │       ├── tokens.css    ← all EH design tokens (4959 lines)
    │       └── input.css     ← Tailwind v4 entry point
    ├── components/
    │   ├── package.json      ← @eh/components
    │   ├── tsconfig.json
    │   ├── vite.config.ts    ← library mode (ESM + CJS)
    │   └── src/
    │       ├── input.css     ← imports from tokens, @source directive
    │       ├── index.ts      ← barrel export
    │       ├── lib/
    │       │   └── utils.ts  ← cn() with extendTailwindMerge
    │       ├── components/
    │       │   └── button/
    │       │       ├── Button.tsx
    │       │       ├── Button.figma.tsx
    │       │       └── index.ts
    │       └── dev/          ← local visual test harness only
    └── docs/                 ← @eh/docs (Nextra 4 docs site)
        ├── package.json
        ├── tsconfig.json
        ├── next.config.mjs
        ├── postcss.config.mjs  ← required for Tailwind v4 in Next.js
        ├── mdx-components.tsx
        ├── components/         ← ComponentPreview, PropsTable
        └── app/
            ├── layout.tsx
            ├── globals.css     ← EH token pipeline + @theme inline
            ├── page.tsx        ← redirects to /docs
            └── docs/           ← MDX content pages
```

---

## Token architecture

**File:** `packages/tokens/src/tokens.css`

Three layers:

1. **Primitives** — raw colour ramps (`--eh-colour-blue-grey-500` etc.), spacing primitives, font size primitives. All in `:root`.
2. **Semantic tokens** — reference primitives. Also in `:root` as base (light mode defaults).
3. **Mode selectors** — override semantic tokens per mode:

```css
[data-theme="theme-dark"] { ... }
[data-theme="theme-light-high-contrast"] { ... }
[data-theme="theme-dark-high-contrast"] { ... }
[data-theme="theme-light-colour-blind"] { ... }
[data-theme="theme-dark-colour-blind"] { ... }

[data-text-resize="text-resize-75"] { ... }
[data-text-resize="text-resize-100"] { ... }
[data-text-resize="text-resize-125"] { ... }
[data-text-resize="text-resize-150"] { ... }
[data-text-resize="text-resize-200"] { ... }
```

**File:** `packages/tokens/src/input.css`

Tailwind v4 entry point. Key sections:

- `@import "tailwindcss"` and `@import "./tokens.css"`
- `@theme inline` block — maps EH tokens into Tailwind's namespace:
  - Font families, weights, sizes with line-height and letter-spacing
  - Spacing scale (`--spacing-*`)
  - Border radius (`--radius-*`)
  - shadcn semantic colour bridge (`--color-background`, `--color-primary` etc.)
- `@layer utilities` — custom EH utility classes:
  - Text colours: `.text-brand`, `.text-default`, `.text-weak` etc.
  - Border colours: `.border-brand`, `.border-brand-strong` etc.
  - Background colours: `.bg-brand`, `.bg-error`, `.bg-neutral` etc.
  - Border widths: `.border-t-xs`, `.border-b-sm`, `.border-t-md` etc.
  - State rings: `.default-ring-bezel`, `.focus-ring-bezel`, `.hover-ring-bezel`, `.no-ring`
  - Motion: `.duration-quick-1`, `.ease-in-out` etc.
  - Shadows: `.shadow-xs` through `.shadow-xl`
  - Icon sizes: `.icon-xs` through `.icon-3xl`

**File:** `packages/components/src/input.css`

```css
@import '../../tokens/src/input.css';
@source "./components/**/*.{ts,tsx}";
@source "./dev/**/*.{ts,tsx}";
```

Nothing else. Any shadcn CSS imports here caused breaking conflicts — keep this file minimal.

---

## Component conventions

See `component-patterns.md` for all coding rules, prop API patterns, CSS conventions, and accessibility requirements.

---

## Known issues and workarounds

See `known-issues.md` for token gaps, shadcn conflicts, pseudo-variant workarounds, and temporary fixes.

---

## Development workflow

See `workflow.md` for agent roles, dual-prompt process, branch hygiene, dev preview harness, and session startup instructions.

---

## Components completed

### Notable patterns across components

- **AvatarSingle** established the indicator architecture: a single wrapper div handles both Status (dot) and Logo (icon) types with separate size maps, using CSS group pattern for hover/focus instead of a state prop.
- **Badge components** introduced the non-standard typography composite pattern (body-sm font size + body-xs line height) and nested Record lookups for text colour mapping.
- **AvatarGroup** uses `React.Children.toArray` + `cloneElement` to force size/indicator/overlap on children, with negative margin overlap and container right-padding offset.
- **Accordion** was the first shadcn/Radix override — established the workflow of installing the Radix dependency but writing the component from scratch with EH tokens.
- **Pagination** established the dual-layout variant pattern: the same internal sub-components (`PaginationItem`, `Ellipsis`, `generatePageRange` algorithm) render inside two different container layouts via a single `variant` prop (`"card"` / `"bar"`). Card variant reuses EH `Button variant="Secondary" size="sm"` for prev/next; bar variant uses custom `BarNavButton` cell buttons to achieve seamless joined cells without fighting Button CVA. The component is controlled-only (`page` + `onPageChange` required) — the rationale is documented inline at the top of the file for engineering team discussion. Keyboard shortcut hints (Figma placeholder) and the remaining 3 simpler Figma variants are deferred.

### Status

| Component                    | Path                                      | Base                   | Status   | Notes                                                                                                                                                                                                                                                              |
| ---------------------------- | ----------------------------------------- | ---------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Button                       | `button/Button.tsx`                       | Scratch, CVA           | Complete | Code-first API: `children`, `startIcon`/`endIcon`, `iconOnly`                                                                                                                                                                                                      |
| CheckboxInput                | `checkbox-input/CheckboxInput.tsx`        | Scratch, CVA           | Complete | Custom styled checkbox, sizes sm/md/lg                                                                                                                                                                                                                             |
| CheckboxField                | `checkbox-field/CheckboxField.tsx`        | Scratch                | Complete | Composes CheckboxInput, adds label + description                                                                                                                                                                                                                   |
| AvatarSingle                 | `avatar-single/AvatarSingle.tsx`          | Scratch, CVA           | Complete | 8 sizes, image/initial types, status/logo indicators                                                                                                                                                                                                               |
| AvatarGroup                  | `avatar-group/AvatarGroup.tsx`            | Scratch                | Complete | Composes AvatarSingle, `max` overflow, sizes xs/sm/md                                                                                                                                                                                                              |
| BadgeNonSemantic             | `badge-non-semantic/BadgeNonSemantic.tsx` | Scratch, CVA           | Complete | `<span>` root, appearance × colour, non-standard typography                                                                                                                                                                                                        |
| BadgeSemantic                | `badge-semantic/BadgeSemantic.tsx`        | Scratch, CVA           | Complete | Status axis replaces colour, arbitrary fallback for `border-warning-weak`                                                                                                                                                                                          |
| BadgeNotificationNonSemantic | `badge-notification-non-semantic/...`     | Scratch, CVA           | Complete | Dot/number modes, `count` replaces Figma `Number` boolean                                                                                                                                                                                                          |
| BadgeNotificationSemantic    | `badge-notification-semantic/...`         | Scratch, CVA           | Complete | Alert maps to error tokens, flat text colour Record                                                                                                                                                                                                                |
| Accordion                    | `accordion/Accordion.tsx`                 | Radix                  | Complete | Single/multiple modes, internal BadgeNonSemantic composition                                                                                                                                                                                                       |
| ButtonGroup                  | `button-group/ButtonGroup.tsx`            | Scratch                | Complete | `overflow-visible` for focus ring, child selector rounding                                                                                                                                                                                                         |
| TextLink                     | `text-link/TextLink.tsx`                  | Scratch, CVA           | Complete | Polymorphic `<a>`/`<button>`, code-first from start                                                                                                                                                                                                                |
| KeyboardShortcut             | `keyboard-shortcut/KeyboardShortcut.tsx`  | Scratch, CVA           | Complete | Display-only, 1 or 2 key slots                                                                                                                                                                                                                                     |
| Pagination                   | `pagination/Pagination.tsx`               | Scratch + Button reuse | Complete | Controlled only. Two variants: `card` (Card full combined), `bar` (Full combined). Card prev/next reuse EH Button `Secondary` `sm`. Bar prev/next are custom `BarNavButton` cells. `generatePageRange` algo with `siblingCount`. Keyboard shortcut hints deferred. |

All component paths are relative to `packages/components/src/components/`.

### Components still using Figma-shaped API (pending refactor)

- **Badge (NonSemantic / Semantic)** — still uses `label` prop, pending switch to `children` (low priority)

---

## Components in progress / planned

- **Alert** — planned as inline notification (CVA from scratch). Toast/notification variant (portal, animation, stacking) planned as separate component later
- **Tooltip / TooltipGuide** — two-component approach recommended: simple `Tooltip` (hover) + `TooltipGuide` (rich guided tour with steps, CTA buttons, image support)
- **Pagination (remaining variants)** — Card simple combined, Card simple separated, and Simple variants are straightforward reductions of existing sub-components. Will add `renderSummary?: (page: number, totalPages: number) => React.ReactNode` render prop for the "Page X of Y" text. Keyboard shortcut hints (`previousKeys`/`nextKeys` props composing `KeyboardShortcut`) deferred until state management is in place.
- Input / Text field
- Select (shadcn base)
- Dialog / Modal (shadcn base)
- Navigation / DropdownMenu (shadcn base)

---

## What's next

### Phase 4 continued — remaining components

Workflow per component: get Figma node URL → pull design context via MCP → generate prompts → feed agents → review → commit. See `workflow.md` for full process.

### Phase 4 final — Providers

```ts
type Theme =
  | 'theme-light'
  | 'theme-dark'
  | 'theme-light-high-contrast'
  | 'theme-dark-high-contrast'
  | 'theme-light-colour-blind'
  | 'theme-dark-colour-blind';

type TextResize =
  | 'text-resize-75'
  | 'text-resize-100'
  | 'text-resize-125'
  | 'text-resize-150'
  | 'text-resize-200';
```

`ThemeProvider` and `TextResizeProvider` use a `PreferencesAdapter` interface designed to scale:

- **Stage 1:** `localAdapter` — localStorage only
- **Stage 2:** `syncedAdapter` — optimistic local write + async API sync
- **Stage 3:** Dedicated preferences microservice with DB persistence, audit log, real-time sync

The adapter is passed as a prop — consumers upgrade their adapter without changing any component code.

### Phase 5 — Docs site (slim demo complete)

Built with **Nextra 4** in `packages/docs` (`@eh/docs`). Branch: `feat/docs-site`.

**What's live:**

- 5 pages: Overview, Getting Started, Button, Accordion, Badge
- `ComponentPreview` — renders real EH components inside a themed container with theme mode dropdown (6 modes) and text-resize dropdown (5 levels)
- `PropsTable` — manually populated props documentation table
- EH-branded shell — Nextra CSS custom properties overridden with EH design tokens
- Inline `<head>` script to prevent theme flash on load
- Full EH CSS pipeline — `globals.css` imports the component CSS chain with `@import "tailwindcss"` and `@theme inline` at top level

**Key technical decisions:**

- Nextra 4 chosen over Astro (Starlight) and Fumadocs — same React/Tailwind stack as components, native imports, fastest path to demo
- `postcss.config.mjs` required — Next.js needs explicit PostCSS config for Tailwind v4 (see `known-issues.md` Issue 10)
- `@import "tailwindcss"` and `@theme inline` must be at the top level of `globals.css`, not nested in cross-package imports
- `@source` directives with explicit cross-workspace paths for Tailwind class scanning
- Navbar/Footer must be inside Nextra's `Layout` component (requires `ConfigContext`)
- No Turbopack — use `next dev` (Turbopack has MDX resolution issues with Nextra)

**What's next for the docs site:**

- Fix text-resize preview (token selectors may target `:root`/`html`, not ComponentPreview div)
- Refine EH branding on docs shell (inspect Nextra CSS variables, expand overrides)
- Add remaining component pages (Avatar, TextLink, Checkbox, KeyboardShortcut, ButtonGroup)
- Token reference pages (colours, spacing, typography)
- Theming deep-dive page
- Search (Pagefind — requires production build)
- Auto-generated props tables from TypeScript types (future)

---

## Figma

**Components 3.0 file:** `https://www.figma.com/design/0qqUZvCf7MIcrRuJQla85o/Components-3.0`

Figma MCP is connected. Use `get_design_context` with `disableCodeConnect: true` to pull raw design data before Code Connect is established. Code Connect is the end goal — every component gets a `.figma.tsx` file published via the Figma CLI once built.

---

## Important notes for Claude

- This project is led by Aman, a UX/UI designer at PDSB — not a full-stack frontend engineer. Keep explanations clear, flag decisions before executing, and prefer familiar patterns over clever ones.
- Always review generated component files before committing — Claude Code has introduced issues like Base UI imports and incorrect class names that needed correction.
- The `component-patterns.md` file is the source of truth for coding conventions. Refer to it and update it when new patterns are established.
- Always pull Figma design context before writing component code — prop names, token usage, and sizing must match Figma exactly.
- When in doubt about a decision, ask first.
- Always verify utility classes against `packages/tokens/src/input.css` before using them in component code. Search for the exact class name in `@layer utilities` and `@theme inline`. If a class doesn't exist, use the arbitrary value fallback form.
- The public React API must be code-first and ergonomic. Code Connect (`.figma.tsx`) handles translation between Figma properties and React props. Never mirror Figma property names directly in the React API unless they're already developer-friendly.
- Every component must meet WCAG 2.1 Level AA. See `component-patterns.md` for accessibility rules.
- Verify component APIs against source before writing usage examples. The handoff doc may describe a "pending" refactor that has already shipped. Always check the actual component's `interface` and render function before writing MDX examples.
- Generate both a Claude Code prompt and a Codex prompt for each component — the dual-agent workflow is standard. See `workflow.md` for details.
