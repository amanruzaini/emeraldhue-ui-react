# Emerald HUE (EH) Component Library — Project Handoff Summary

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

## Issues encountered and solutions

### Issue 1 — shadcn init overwrote input.css

When running `npx shadcn init`, it replaced `packages/components/src/input.css` with its own default CSS including oklch colour values, Geist font, `tw-animate-css`, and its own `@theme inline` block. This overrode all EH tokens.

**Solution:** Replace the file with just the three lines shown above. Never import `shadcn/tailwind.css` or `tw-animate-css`.

---

### Issue 2 — twMerge stripping custom utility classes

`tailwind-merge` only knows Tailwind's built-in class groups. Custom EH classes like `border-t-xs`, `border-b-sm`, `font-weight-medium` were being stripped when consumers passed `className` overrides.

**Solution:** Extended `twMerge` in `utils.ts` using `extendTailwindMerge`:

```ts
import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'border-w': [
        'border-none',
        'border-xs',
        'border-sm',
        'border-md',
        'border-lg',
        'border-xl',
      ],
      'border-w-t': [
        'border-t-none',
        'border-t-xs',
        'border-t-sm',
        'border-t-md',
        'border-t-lg',
        'border-t-xl',
      ],
      'border-w-r': [
        'border-r-none',
        'border-r-xs',
        'border-r-sm',
        'border-r-md',
        'border-r-lg',
        'border-r-xl',
      ],
      'border-w-b': [
        'border-b-none',
        'border-b-xs',
        'border-b-sm',
        'border-b-md',
        'border-b-lg',
        'border-b-xl',
      ],
      'border-w-l': [
        'border-l-none',
        'border-l-xs',
        'border-l-sm',
        'border-l-md',
        'border-l-lg',
        'border-l-xl',
      ],
      'border-color': [
        'border-brand',
        'border-brand-strong',
        'border-brand-disabled',
        'border-brand-hover',
        'border-error',
        'border-error-strong',
        'border-error-disabled',
        'border-neutral',
        'border-default',
        'border-weak',
        'border-strong',
        'border-transparent',
      ],
      'font-family': ['font-default'],
      'eh-font-weight': ['font-weight-medium'],
      'font-size': [
        'text-body-xs',
        'text-body-sm',
        'text-body-md',
        'text-body-lg',
      ],
      'text-color': [
        'text-all-white',
        'text-brand',
        'text-brand-disabled',
        'text-error',
        'text-default',
        'text-weak',
        'text-strong',
        'text-neutral',
        'text-disabled',
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

### Issue 3 — Tailwind v4 not generating custom utility classes

Classes like `border-t-xs` weren't appearing in the compiled CSS because Tailwind's content scanner wasn't reaching the component files.

**Solution:** Added `@source` directives in `packages/components/src/input.css`:

```css
@source "./components/**/*.{ts,tsx}";
@source "./dev/**/*.{ts,tsx}";
```

---

### Issue 4 — EH spacing scale vs Tailwind spacing scale mismatch

EH uses a 2px base scale (`--eh-spacing-4` = 8px). Tailwind uses 4px base (`p-4` = 16px). Even though spacing is mapped in `@theme inline`, the numbers are confusing — `p-6` in EH context = 12px, not 24px.

| Class | EH value at 100% | Standard Tailwind |
| ----- | ---------------- | ----------------- |
| p-4   | 8px              | 16px              |
| p-6   | 12px             | 24px              |
| p-8   | 16px             | 32px              |

**Solution:** Use named spacing utilities in component code (`p-6`, `px-6`, `py-4`) and document the scale difference for engineers. These resolve through EH tokens via `@theme inline`, not Tailwind's default scale.

---

### Issue 5 — Base UI introduced by Claude Code

When scaffolding Button, Claude Code imported `@base-ui/react/button` instead of using a plain `<button>` element. Base UI is a MUI product, unrelated to shadcn/Radix.

**Solution:** Removed Base UI entirely. Button uses plain `<button>` element with `React.forwardRef` — matching how shadcn actually implements Button.

---

### Issue 6 — Browser default outline alongside EH focus ring

Discovered during ButtonGroup build. Browsers show their native orange/blue `:focus` outline alongside the EH `focus-ring` box-shadow, creating a double ring effect.

**Solution:** Add `focus-visible:outline-none` to all interactive components. This is now a standard rule in `component-patterns.md`.

---

### Issue 7 — Focus ring clipped by container overflow

The `overflow-clip` on the ButtonGroup container was cutting off the `box-shadow` focus ring (5px spread) on child ButtonGroupItem elements.

**Solution:** Switched to `overflow-visible` and moved corner rounding to child selectors (`[&>*:first-child]:rounded-l-md`, `[&>*:last-child]:rounded-r-md`). See BACKLOG-001 for remaining visual refinement needed.

---

### Issue 8 — Missing hover/disabled pseudo-class variants in token file

Many colour utilities (e.g. `bg-brand-inverted-button`, `bg-error-inverted`) define only the plain class but lack the `.hover\:...:hover` or `.disabled\:...:disabled` selector pattern. This means Tailwind's `hover:bg-brand-inverted-button` prefix doesn't work.

**Solution (workaround):** Use arbitrary value syntax: `hover:bg-[var(--eh-colour-bg-brand-inverted-button)]`. These should be cleaned up when the token file is updated to include the missing pseudo-class variants.

---

### Issue 9 — `text-brand-textlink` token vs Figma `text-brand` discrepancy

The token file defines `text-brand-textlink` (likely intended for links with different values in dark/high-contrast modes), but Figma's Link component maps to `text-brand`. Currently using `text-brand` to match Figma. **Needs investigation** — Aman should check if `text-brand-textlink` should be used for links in dark/HC modes.

---

### Issue 10 — Docs site: Tailwind v4 in Next.js requires explicit PostCSS config and top-level directives

**Affects:** `packages/docs` (Next.js / Nextra) only. Does NOT affect `packages/components` (Vite has built-in Tailwind support) or future consumers using Vite-based bundlers.

The `@eh/components` package uses Vite, which processes Tailwind v4 automatically — no PostCSS config needed. But when the docs site (`packages/docs`, running on Next.js via Nextra) imports the same CSS pipeline, two things break:

1. **No PostCSS config** — Next.js requires an explicit `postcss.config.mjs` with `@tailwindcss/postcss` to run Tailwind's processor. Without it, Next.js treats the CSS as plain text and passes `@theme inline`, `@source`, and `@import "tailwindcss"` directives through literally without processing them.

2. **Nested `@import "tailwindcss"`** — The directive was buried 3 levels deep in an import chain (`globals.css` → `components/input.css` → `tokens/input.css` → `@import "tailwindcss"`). Tailwind v4's PostCSS plugin needs to see `@import "tailwindcss"` at the top level of the entry CSS file to trigger its processing pipeline.

The symptom was: custom EH utility classes (`.bg-brand`, `.text-all-white`) worked because they're plain CSS in `@layer utilities`, but Tailwind-generated utilities (`p-6`, `gap-2`, `text-body-sm`, `rounded-lg`) produced no CSS rules at all.

**Solution:**

1. Created `packages/docs/postcss.config.mjs`:

```js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

2. Restructured `packages/docs/app/globals.css` so that `@import "tailwindcss"` and `@theme inline` are at the top level — not nested inside cross-package imports. The `@theme inline` block was duplicated from `packages/tokens/src/input.css` to ensure Tailwind maps EH token values to its utility namespace in the docs context.

**Key rule for future packages consuming EH tokens via Next.js:** Always add a `postcss.config.mjs` with `@tailwindcss/postcss`, and ensure `@import "tailwindcss"` plus the `@theme inline` block appear at the top level of your CSS entry file.

---

## Token verification findings

During component development, all utility classes were verified against `packages/tokens/src/input.css`. Key findings:

### All colour utilities exist in `@layer utilities`

Background: `bg-brand`, `bg-brand-inverted`, `bg-accent`, `bg-accent-inverted`, `bg-neutral`, `bg-neutral-inverted`, `bg-error`, `bg-error-inverted`, `bg-success`, `bg-success-inverted`, `bg-info`, `bg-info-inverted`, `bg-warning`, `bg-warning-inverted`, `bg-avatar`, `bg-default`, `bg-disabled`, `bg-transparent`

Text: `text-all-white`, `text-strong`, `text-default`, `text-disabled`, `text-inverted-disabled`, `text-inverted-black-white`, `text-black-on-dark-hc`, `text-brand`, `text-brand-textlink`, `text-error`, `text-error-hover-focus`

Border: `border-brand`, `border-brand-weak`, `border-brand-disabled`, `border-accent-weak`, `border-weak`, `border-default`, `border-disabled`, `border-error`, `border-error-strong`, `border-error-disabled`, `border-success`, `border-success-weak`, `border-info`, `border-warning`, `border-focus-inner`, `border-neutral-avatargroup`

### Typography resolved via `@theme inline` (not `@layer utilities`)

`text-body-xs`, `text-body-sm`, `text-body-md`, `text-body-lg`, `text-heading-4`, `text-heading-5`, `text-heading-6` — all mapped with corresponding `--line-height` and `--letter-spacing` values.

`font-weight-medium`, `font-weight-semibold` — mapped via `--font-weight-*` in `@theme inline`.

### `rounded-full` is token-compliant

`--radius-full` maps to `var(--eh-border-radius-rounded)` in `@theme inline` (line 124). No need to use `rounded-[var(--eh-border-radius-rounded)]`.

### Missing utilities requiring arbitrary fallbacks

- `border-warning-weak` — does NOT exist. Use `border-[var(--eh-colour-border-warning-weak)]`
- `bg-brand-inverted-button` — no `.hover\:` variant. Use `hover:bg-[var(--eh-colour-bg-brand-inverted-button)]`
- `bg-error-inverted` — no `.hover\:` variant. Use `hover:bg-[var(--eh-colour-bg-error-inverted)]`
- `disabled:` pseudo-class variants — many disabled utilities (e.g. `bg-brand-disabled`) lack the `.disabled\:bg-brand-disabled:disabled` selector pattern that hover utilities have. Fix needed in the token file.

### Token file disabled state issue

The hover utilities follow the pattern: `.bg-brand-hover, .hover\:bg-brand-hover:hover { ... }` — defining both a plain class and a pseudo-class variant. But disabled utilities only define the plain class: `.bg-brand-disabled { ... }` — no `.disabled\:bg-brand-disabled:disabled` variant. This means Tailwind's `disabled:bg-brand-disabled` prefix doesn't properly override `bg-brand` due to equal specificity. The fix is to add disabled pseudo-class variants in the token file for all disabled utilities.

---

## Components completed

### Button (refactored to code-first API)

**File:** `packages/components/src/components/button/Button.tsx`

<!-- verified against source: 2026-03-29 -->

Key decisions:

- Plain `<button>` element, not a Radix primitive (Button doesn't need Radix)
- CVA for variant management
- EH utility classes for all colours, borders, typography
- Spacing via Tailwind mapped tokens (`p-6`, `px-6`, `py-7`, etc.) — resolved through `@theme inline` spacing scale
- `size-icon-sm` / `size-icon-md` utility classes for icon sizing per button size
- Asymmetric bezel border: `border-t-xs border-x-xs` (top/sides) + size-dependent bottom (`border-b-xs` through `border-b-lg`)
- `default-ring-bezel` for the EH action ring + depth shadow
- Code-first API: `children` for label text, `startIcon`/`endIcon` for icon slots, `iconOnly` for icon-only mode

Current props (code-first):

```ts
variant?: 'Primary' | 'Secondary' | 'Tertiary' | 'Destructive'  // default: 'Primary'
size?: 'xs' | 'sm' | 'md' | 'lg'                                 // default: 'md'
iconOnly?: boolean                                               // default: false
startIcon?: React.ReactNode
endIcon?: React.ReactNode
children: React.ReactNode                                        // label text or icon content
```

Usage:

```tsx
// Label button
<Button variant="Primary" size="md">Submit</Button>

// With icons
<Button variant="Secondary" size="md" startIcon={<SearchIcon />}>Search</Button>

// Icon only
<Button variant="Primary" size="md" iconOnly><SearchIcon /></Button>

// Disabled
<Button variant="Primary" size="md" disabled>Disabled</Button>
```

Compound variants handle size-specific padding/typography overrides per variant (e.g. Primary sm gets `px-6 py-4 text-body-sm`, Secondary sm gets `p-4 text-body-xs`).

---

### CheckboxInput

**File:** `packages/components/src/components/checkbox-input/CheckboxInput.tsx`

- Scratch build using CVA — the checkbox input control without label/description
- Sizes: sm, md, lg
- States: unchecked, checked, indeterminate, disabled combinations
- Custom styled checkbox replacing native browser appearance

---

### CheckboxField

**File:** `packages/components/src/components/checkbox-field/CheckboxField.tsx`

- Composes CheckboxInput — adds label and optional description
- Wraps CheckboxInput with `<label>` for proper form semantics
- Description text below the label

---

### AvatarSingle (commits 30704d6, 1f711c6)

**File:** `packages/components/src/components/avatar-single/AvatarSingle.tsx`

- Scratch build using CVA — no shadcn base
- 4 CVA functions: `avatarWrapperVariants`, `avatarInnerVariants`, `avatarInitialsVariants` (removed `avatarIndicatorVariants` in fix pass)
- 8 sizes (xs → 4xl) with hardcoded pixel dimensions from Figma (not EH spacing tokens — avatar sizes don't map to the spacing scale)
- Two types: Image (with `src`/`alt` props) and Initial (with `initials` prop)
- Indicator system: single wrapper div handles both Status (online/offline dot) and Logo (company icon) types. No sub-components — the indicator div applies its own background/sizing directly based on `indicatorType`
- Status dot: `bg-success`/`bg-neutral` applied directly on indicator wrapper
- Logo indicator: `bg-brand` with `logoIcon` ReactNode centered inside
- Separate size maps for status indicators (6px–16px) and logo indicators (10px–24px)
- States: hover ring (`group-hover:shadow-[...]`) and focus ring (`group-focus-visible:shadow-[...]`) via CSS group pattern on wrapper — no state prop
- Typography for initials varies by size: `text-body-xs` through `text-heading-4` with corresponding font weights — all resolved via `@theme inline` mappings
- All colour utilities verified against `input.css`: `bg-avatar`, `bg-success`, `bg-neutral`, `bg-brand`, `text-default`, `border-focus-inner`, `border-neutral-avatargroup`
- `rounded-full` confirmed token-compliant via `--radius-full` → `--eh-border-radius-rounded` mapping in `@theme inline`

### AvatarGroup (commit b60080d)

**File:** `packages/components/src/components/avatar-group/AvatarGroup.tsx`

- Composes AvatarSingle via children — does not rebuild avatar rendering
- `React.Children.toArray` + `cloneElement` to force `size`, `indicator={false}`, and overlap margin on each child
- Limited size range: `AvatarGroupSize = 'xs' | 'sm' | 'md'` (narrower than AvatarSingle's 8-size range)
- `max` prop controls overflow — when `children > max`, shows `max - 1` avatars + one "+N" overflow indicator
- Overflow indicator visually matches AvatarSingle Initial type (same bg, border, radius, typography)
- Overlap via negative margins: xs=-4px, sm=-6px, md=-8px. Container right padding offsets the last avatar

### BadgeNonSemantic (commit 2b51fbc)

**File:** `packages/components/src/components/badge-non-semantic/BadgeNonSemantic.tsx`

- Root element: `<span>` (inline element for text flows)
- 3 variant axes: `size` (sm/md/lg), `appearance` (Inverted/Solid), `colour` (Brand/Accent/Blue Grey)
- 6 compoundVariants for appearance × colour combinations
- Non-standard typography composite: `text-[length:var(--eh-font-size-body-sm)]` with `leading-[var(--eh-font-line-height-body-xs)]` — body-sm font size but body-xs line height. Cannot use `text-body-sm` utility because it carries the wrong line height
- Optional leading icon with `size-icon-sm`

### BadgeSemantic (commit d7b79b4)

**File:** `packages/components/src/components/badge-semantic/BadgeSemantic.tsx`

- Structurally identical to BadgeNonSemantic
- Variant axis: `status` (Error/Success/Info/Warning) replaces `colour`
- 8 compoundVariants for status × appearance
- Edge cases: `border-success-weak` (verified utility), `border-[var(--eh-colour-border-warning-weak)]` (no utility exists — arbitrary fallback)

### BadgeNotificationNonSemantic (commit 88fb9cb)

**File:** `packages/components/src/components/badge-notification-non-semantic/BadgeNotificationNonSemantic.tsx`

- Circular notification badge — `rounded-full` not `rounded-md`
- Two modes: dot (8px, no content) when `count` is undefined, number pill when `count` is provided
- `count` prop (single number) replaces Figma's `Number` boolean — cleaner API
- xs size always renders as dot regardless of count
- Text colour via nested Record lookup (shape × colour) — different combinations produce different text colours
- Same non-standard typography composite as other badges

### BadgeNotificationSemantic (commit 5df66e3)

**File:** `packages/components/src/components/badge-notification-semantic/BadgeNotificationSemantic.tsx`

- Structurally identical to BadgeNotificationNonSemantic
- Variant axis: `status` (Info/Alert) replaces `colour` (Brand/Neutral)
- Alert maps to **error** tokens (`bg-error`, `border-error`) — not `bg-alert`
- Text colour: flat Record keyed by shape only (both statuses use same text per shape)
- Border in status variant directly (not compound) — cleaner since it's shape-independent
- All verified EH utilities — no arbitrary fallbacks needed

### Accordion (commit c0243e0)

**File:** `packages/components/src/components/accordion/Accordion.tsx`

- shadcn/Radix Accordion as base — `@radix-ui/react-accordion` dependency
- Two sub-components: `Accordion` (root) and `AccordionItem` (collapsible section)
- Supports both `type="single"` (with `collapsible` option) and `type="multiple"`
- Accordion root: flex column, gap, padding, rounded-lg with default-ring-bezel
- AccordionItem: Radix `Item` + `Trigger` + `Content` wrapped with EH styling
- Chevron trigger styled to look like EH Button — no nested `<Button>` component
- Leading icon via `startIcon?: React.ReactNode`
- Internal badge via `showBadge?: boolean` + `badgeLabel?: string` — renders fixed BadgeNonSemantic (sm, Inverted, Blue Grey)
- Radix `data-[state=open]` selectors for chevron rotation and content reveal
- Animation keyframes added to `packages/tokens/src/tokens.css` for expand/collapse
- Disabled items handled via Radix's `disabled` prop on `AccordionPrimitive.Item`

### ButtonGroup (commit f3db1a8)

**File:** `packages/components/src/components/button-group/ButtonGroup.tsx`

- Two sub-components: `ButtonGroup` (container) and `ButtonGroupItem` (individual button)
- Container uses `overflow-visible` (not `overflow-clip`) to prevent focus ring clipping
- Corner rounding via child selectors: `[&>*:first-child]:rounded-l-md`, `[&>*:last-child]:rounded-r-md`
- Known issue: focus ring visual refinement still needed — see BACKLOG-001

### TextLink (Link)

**File:** `packages/components/src/components/text-link/TextLink.tsx`

- Polymorphic component: renders as `<a>` when `href` provided, `<button>` when not
- CVA with `variant` (Primary/Destructive) and `size` (sm/md/lg)
- Underlined text with optional leading/trailing icons, no border/background in default state
- Minimal padding: `px-[var(--eh-spacing-1)]` (2px), `py-[var(--eh-spacing-0)]` (0px)
- Uses `text-brand` for Primary (not `text-brand-textlink` — see Issue 9)
- Hover background via arbitrary values due to missing pseudo-class variants in token file
- Focus ring: `focus-ring` (non-bezel) + `focus-visible:bg-default`
- `sm` size uses non-standard typography composite (body-sm font + body-xs line-height)
- Disabled `<a>`: `aria-disabled="true"` + `tabIndex={-1}` + click prevention

### KeyboardShortcut

**File:** `packages/components/src/components/keyboard-shortcut/KeyboardShortcut.tsx`

- Scratch build using CVA — display-only component
- Shows keyboard key(s) in styled containers
- Sizes: sm, md, lg. Colours: Neutral, Brand, Destructive
- `Key` prop controls number of key slots (1 or 2)

---

## Components in progress / planned

- **Alert** — planned as inline notification (CVA from scratch). Toast/notification variant (portal, animation, stacking) planned as separate component later
- **Tooltip / TooltipGuide** — two-component approach recommended: simple `Tooltip` (hover) + `TooltipGuide` (rich guided tour with steps, CTA buttons, image support)
- **Badge refactor** — `label` prop → `children` (low priority)
- Input / Text field
- Select (shadcn base)
- Dialog / Modal (shadcn base)
- Navigation / DropdownMenu (shadcn base)

---

## Component patterns established

Documented in `packages/components/component-patterns.md`. Key rules:

### File structure

3 files per component — `Component.tsx`, `Component.figma.tsx`, `index.ts`

### When to use shadcn

| Situation                                                 | Approach                               |
| --------------------------------------------------------- | -------------------------------------- |
| Complex behaviour (focus trapping, keyboard nav, portals) | `npx shadcn add` then override visuals |
| Simple behaviour, EH-specific anatomy                     | Write from scratch using CVA           |

Components that use shadcn base: DropdownMenu, Dialog, Accordion, Select, Tooltip, Popover, NavigationMenu.

Components written from scratch: Button, Badge, Tag, Chip, TextLink, KeyboardShortcut, Alert, and others with simple behaviour.

### CSS rules

| Concern       | Rule                         | Example                                  |
| ------------- | ---------------------------- | ---------------------------------------- |
| Colours       | EH utility class names       | `bg-brand`, `text-all-white`             |
| Spacing       | EH token utilities via `@theme inline` | `p-6`, `px-6`, `py-4`         |
| Border widths | EH utility class names       | `border-t-xs`, `border-b-sm`             |
| Border radius | Tailwind utilities (mapped)  | `rounded-md`                             |
| Typography    | EH utility class names       | `text-body-sm`, `font-weight-medium`     |
| Icon sizes    | EH token CSS custom property | `[--icon-size:var(--eh-icon-md)]`        |
| State rings   | EH utility class names       | `default-ring-bezel`, `focus-ring-bezel` |

### Never

- Import `shadcn/tailwind.css` or `tw-animate-css`
- Use plain Tailwind colour utilities (`bg-blue-500`)
- Hardcode pixel values (`[--icon-size:16px]`)
- Create a `state` prop for hover/focus/pressed
- Skip registering new EH classes in `extendTailwindMerge` if they get stripped
- Forget `focus-visible:outline-none` on interactive components

---

## API design principles (established during Phase 4)

A key decision was made during Phase 4 to separate the public React API from Figma property names.

### Problem

The first Button component mirrored Figma properties 1:1: `content`, `iconLeading`, `iconTrailing`, `leadIcon`, `trailIcon`, `label`. This made the React API awkward for engineers who had to think about Figma configuration rather than developer intent.

### Solution

- **Public React API** — code-first and ergonomic. Uses standard React patterns (`children`, `startIcon`, `endIcon`, `iconOnly`).
- **Figma properties** — remain as design metadata in the `.figma.tsx` file only.
- **Code Connect** — acts as the translation layer between Figma props and React props.

### Key rules

1. Use `children` for text content — not a `label` prop
2. Merge boolean + node pairs into single optional props (`startIcon?: ReactNode` replaces `iconLeading: boolean` + `leadIcon: ReactNode`)
3. Use standard React/HTML naming (`startIcon`/`endIcon`, not `leadIcon`/`trailIcon`)
4. Keep Figma names where already code-friendly (`size`, `variant`, `indicator`, `online`, `appearance`, `status`, `colour`)
5. Code Connect handles translation — `.figma.tsx` maps Figma property shapes to the React API

These rules are documented in `component-patterns.md` under "Prop API design — code-first, Figma-mapped".

### Components already refactored to code-first API

- **Button** — `children`, `startIcon`, `endIcon`, `iconOnly` (refactored, verified 2026-03-29)

### Components still using Figma-shaped API (pending refactor)

- **Badge (NonSemantic / Semantic)** — still uses `label` prop, pending switch to `children` (low priority)

---

## Accessibility requirements (WCAG 2.1 AA)

Accessibility compliance is mandatory for all EH components. The library targets industrial environments where accessibility failures can have safety implications. Full guidelines are documented in `component-patterns.md` under "Accessibility (WCAG 2.1 AA compliance)".

Key decisions:

- Semantic HTML elements required (no `<div>` buttons)
- `focus-visible:` for keyboard-only focus indicators (not `focus:`)
- `focus-visible:outline-none` to suppress browser default outlines (discovered during ButtonGroup build)
- ARIA only when HTML semantics are insufficient
- Colour meaning must never be conveyed by colour alone — always pair with icon/text/shape
- Icon-only buttons/links must have `aria-label` — enforced via dev-only `console.warn`
- Token system handles contrast across all 6 theme modes — components must use tokens, never hardcoded values
- Per-component accessibility checklists for interactive, display, and container components
- Focus trapping only for blocking overlays (Dialog, Modal) — NOT for inline components (Alert, Accordion)

---

## What's next

### Phase 4 continued — remaining components

Workflow per component:

1. Get Figma node URL
2. Pull design context via Figma MCP (`get_design_context` with `disableCodeConnect: true`)
3. Generate Claude Code prompt and Codex prompt based on design context
4. Feed both agents, compare outputs
5. Review here before committing
6. Commit

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
- `postcss.config.mjs` required — Next.js needs explicit PostCSS config for Tailwind v4 (Issue 10)
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

## Development workflow

This project uses a multi-agent workflow: a **planning agent** (Claude in claude.ai with Figma MCP connected), **execution agents** (Claude Code and/or OpenAI Codex in the terminal), and **Aman** (project lead).

### Roles

**Planning agent (claude.ai):**

- Reviews Figma design context via Figma MCP (`get_design_context` with `disableCodeConnect: true`)
- Extracts sizing, tokens, typography, colour mappings, and anatomy from the Figma data
- Verifies all utility classes against `packages/tokens/src/input.css` before writing any prompt
- Makes architectural decisions with Aman (component structure, prop API, CVA approach, sub-component needs)
- Pushes back on decisions that conflict with established patterns — e.g. rejected a `state` prop for Avatar hover/focus, flagged structural bugs in indicator nesting
- Writes detailed prompts for both Claude Code and Codex with exact specs, verified token lists, and code examples
- Reviews agent output against the Figma spec and patterns doc
- Identifies bugs and writes fix prompts when needed

**Execution agents (Claude Code / Codex):**

- Receive the prompt and generate component code
- Claude Code creates the full 3-file structure: `Component.tsx`, `Component.figma.tsx`, `index.ts`, plus barrel exports and dependency installs
- Codex generates `Component.tsx` only (for side-by-side comparison with Claude Code output)
- Commits the code

**Aman (project lead):**

- Provides Figma URLs and component property lists
- Makes product/design decisions when options are presented
- Feeds prompts to both agents
- Brings agent output back to the planning agent for review
- Commits approved code

### Dual-prompt workflow

Every component session produces **two prompts**:

1. **Claude Code prompt** — full integration engineer. Handles all files, barrel exports, dependency installs, twMerge updates
2. **Codex prompt** — scoped to `Component.tsx` only. Self-contained with inlined code blocks, explicit file paths to read, and a verification checklist

Key differences in Codex prompts: (1) explicit "Read these files first" paths, (2) separate "Files to create" vs "Files to modify" sections, (3) inline code for CVA/types/edge cases instead of descriptions, (4) workarounds spelled out with actual code, (5) verification checklist at end. Codex runs autonomously without back-and-forth so the prompt must be fully self-contained.

Over time, the outputs are compared to evaluate which agent to use as the primary execution agent.

### Workflow per component

1. Aman provides the Figma node URL and component property list
2. Planning agent pulls Figma design context via MCP
3. Planning agent extracts the full spec: sizes, tokens, colour matrix, typography, anatomy
4. Planning agent verifies all utility classes against `input.css`
5. Planning agent presents decisions to Aman for confirmation (composition approach, prop API, edge cases)
6. Planning agent writes comprehensive Claude Code prompt and Codex prompt
7. Create/switch to a task branch before any edits
8. Aman feeds the prompts to both agents
9. Agents generate the component files
10. Aman brings the generated code back to the planning agent
11. Planning agent reviews against the spec and patterns — flags any issues
12. If issues found: planning agent writes a fix prompt, repeat from step 9
13. If clean: component is done, move to the next one
14. Add a preview section to `packages/components/src/dev/DevApp.tsx` — every component gets a `<PreviewSection>` covering all variant/prop combinations for visual testing across themes

### Key principles

- **Decisions happen in the planning agent, not in execution agents.** Execution agents receive precise instructions — they don't make architectural choices.
- **Token verification happens before prompting.** Every utility class is checked against `input.css` before it appears in a prompt. This eliminates the "silent failure" problem where a non-existent class produces no CSS.
- **Review catches structural bugs.** The planning agent checks for issues like sizing conflicts, unnecessary nesting, and incorrect token usage that automated tools would miss.
- **Patterns compound.** Learnings from each component (e.g. the AvatarSingle indicator fix, the badge typography composite, the ButtonGroup focus ring fix) feed into subsequent prompts, making them more accurate over time.
- **Verify component APIs against source before writing usage examples.** The handoff doc may describe a "pending" refactor that has already shipped. Always check the actual component's `interface` and render function before writing MDX examples or prompts that reference component props. This was learned when the docs site scaffold used the old Button `label` prop instead of the already-refactored `children` API.

### Branch hygiene

Before any code changes, create or switch to a task branch.

Rules:

- One component/refactor per branch
- Branch before generating files or editing exports
- Do not commit component work directly to `master`

Suggested naming:

- `feat/button-api-refactor`
- `feat/accordion`
- `fix/token-disabled-variants`

### Starting a new chat window

Each new chat window with the planning agent should attach:

1. **`eh-project-handoff.md`** — full project context
2. **`component-patterns.md`** — latest version with all updates (API design, accessibility)
3. **`input.css`** — the token file from `packages/tokens/src/input.css` (for utility verification)

Quick start message:

> Attaching the EH project handoff doc, component patterns doc, and token input.css. We're building the Emerald HUE React component library. I'll give you a Figma URL and component props — help me plan the component and generate a Claude Code and Codex prompt. Same workflow as previous sessions: pull Figma design context → plan decisions → write prompt → review output.

For docs site work:

> Attaching the EH project handoff doc. We're continuing work on the docs site (`packages/docs`, Nextra 4). [Describe what you want to do — add a component page, fix styling, expand the shell branding, etc.]

---

## Dev preview harness

**Files:**

- `packages/components/src/dev/index.html` — entry point with `data-theme` and `data-text-resize` on `<html>`
- `packages/components/src/dev/main.tsx` — React mount, imports `input.css`
- `packages/components/src/dev/DevApp.tsx` — all component previews, theme switcher

### Structure

- `DevApp` renders a theme switcher (cycles all 6 theme modes) and one `<PreviewSection>` per component
- Each section uses `<PreviewCard>` for grouped sub-previews (e.g. "With Icon", "Disabled", "Kitchen Sink")
- Shared inline styles (`sectionStyle`, `flowStyle`, `cardGridStyle`, `cardStyle`, `tableStyle`, `cellStyle`) — not EH tokens, since this is a dev-only page
- `PlaceholderIcon` and `LogoIcon` are simple inline SVG/spans for filling icon slots

### Rules for adding new components

1. Import the component and any needed types at the top of `DevApp.tsx`
2. Add a `<PreviewSection title="Component Name">` block after the last existing section
3. Cover all variant/prop combinations: sizes, appearances, states (default, disabled), optional features (icons, badges, subtitles)
4. Include a "Kitchen Sink" card that shows every feature enabled at once
5. Include a disabled variant to verify disabled styling across themes
6. For components with multiple modes (e.g. Accordion single vs multiple), show each mode in its own `<PreviewCard>`

### What's currently previewed

- ✅ Button (variants × sizes, icons, icon-only, disabled)
- ✅ Checkbox Input (sizes × states)
- ✅ Checkbox Field (sizes × states with description)
- ✅ Avatar Single (types × sizes, indicator types)
- ✅ Avatar Group (sizes, max overflow)
- ✅ Badge Non Semantic (appearances × colours × sizes)
- ✅ Badge Semantic (appearances × statuses × sizes)
- ✅ Badge Notification Non Semantic (shapes × colours × sizes)
- ✅ Badge Notification Semantic (shapes × statuses × sizes)
- ✅ Accordion (single/multiple, subtitle, icon, badge, disabled, kitchen sink)

---

## Important notes for Claude

- This project is led by Aman, a UX/UI designer at PDSB — not a full-stack frontend engineer. Keep explanations clear, flag decisions before executing, and prefer familiar patterns over clever ones.
- Always review generated component files before committing — Claude Code has introduced issues like Base UI imports and incorrect class names that needed correction.
- The `component-patterns.md` file is the source of truth for coding conventions. Refer to it and update it when new patterns are established.
- Always pull Figma design context before writing component code — prop names, token usage, and sizing must match Figma exactly.
- When in doubt about a decision, ask first.
- Always verify utility classes against `packages/tokens/src/input.css` before using them in component code. Search for the exact class name in `@layer utilities` and `@theme inline`. If a class doesn't exist, use the arbitrary value fallback form.
- The public React API must be code-first and ergonomic. Code Connect (`.figma.tsx`) handles translation between Figma properties and React props. Never mirror Figma property names directly in the React API unless they're already developer-friendly.
- Every component must meet WCAG 2.1 Level AA. Use semantic HTML elements, visible focus indicators via `focus-visible:`, always include `focus-visible:outline-none`, and add runtime dev warnings for critical a11y gaps (e.g. icon-only buttons without `aria-label`).
- Use section divider comments (matching the AvatarSingle pattern) in every component file for scannability.
- Use `<span>` for inline/decorative components (badges, tags). Use `<div>` for block-level containers. Use `<button>` for interactive actions. Never use divs for interactive elements.
- Generate both a Claude Code prompt and a Codex prompt for each component — the dual-agent workflow is standard.
