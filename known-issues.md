# EH Known Issues and Workarounds

> **Last updated:** 2026-03-30
>
> | Date       | Change                                                                                                                                                                                                              |
> | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
> | 2026-03-30 | Created. Consolidated Issues 1–10, token verification findings, and arbitrary fallback list from original `eh-project-handoff.md`. Added non-standard typography composite usage list from `component-patterns.md`. |

Issues encountered during development, token gaps, and temporary workarounds. This file is append-only — add new issues at the bottom. Remove entries only when the root cause is fixed.

---

## Issue 1 — shadcn init overwrites input.css

When running `npx shadcn init`, it replaces `packages/components/src/input.css` with its own default CSS including oklch colour values, Geist font, `tw-animate-css`, and its own `@theme inline` block. This overrides all EH tokens.

**Solution:** Replace the file with just the three-line import. Never import `shadcn/tailwind.css` or `tw-animate-css`. Always verify `input.css` after running any `shadcn` command.

---

## Issue 2 — twMerge stripping custom utility classes

`tailwind-merge` only knows Tailwind's built-in class groups. Custom EH classes like `border-t-xs`, `border-b-sm`, `font-weight-medium` were being stripped when consumers passed `className` overrides.

**Solution:** Extended `twMerge` in `utils.ts` using `extendTailwindMerge`. Full configuration is in `packages/components/src/lib/utils.ts`. See `component-patterns.md` for the registration rules.

---

## Issue 3 — Tailwind v4 not generating custom utility classes

Classes like `border-t-xs` weren't appearing in the compiled CSS because Tailwind's content scanner wasn't reaching the component files.

**Solution:** Added `@source` directives in `packages/components/src/input.css`:

```css
@source "./components/**/*.{ts,tsx}";
@source "./dev/**/*.{ts,tsx}";
```

---

## Issue 4 — EH spacing scale vs Tailwind spacing scale mismatch

EH uses a 2px base scale (`--eh-spacing-4` = 8px). Tailwind uses 4px base (`p-4` = 16px). Even though spacing is mapped in `@theme inline`, the numbers are confusing.

| Class | EH value at 100% | Standard Tailwind |
| ----- | ---------------- | ----------------- |
| p-4   | 8px              | 16px              |
| p-6   | 12px             | 24px              |
| p-8   | 16px             | 32px              |

**Solution:** Use named spacing utilities in component code. These resolve through EH tokens via `@theme inline`, not Tailwind's default scale. Document the difference for engineers.

---

## Issue 5 — Base UI introduced by Claude Code

When scaffolding Button, Claude Code imported `@base-ui/react/button` instead of using a plain `<button>` element. Base UI is a MUI product, unrelated to shadcn/Radix.

**Solution:** Removed Base UI entirely. Button uses plain `<button>` element with `React.forwardRef`.

---

## Issue 6 — Browser default outline alongside EH focus ring

Browsers show their native orange/blue `:focus` outline alongside the EH `focus-ring` box-shadow, creating a double ring effect.

**Solution:** Add `focus-visible:outline-none` to all interactive components. This is now a standard rule in `component-patterns.md`.

---

## Issue 7 — Focus ring clipped by container overflow

The `overflow-clip` on the ButtonGroup container was cutting off the `box-shadow` focus ring (5px spread) on child ButtonGroupItem elements.

**Solution:** Switched to `overflow-visible` and moved corner rounding to child selectors (`[&>*:first-child]:rounded-l-md`, `[&>*:last-child]:rounded-r-md`). See BACKLOG-001 for remaining visual refinement needed.

---

## Issue 8 — Missing hover/disabled pseudo-class variants in token file

Many colour utilities (e.g. `bg-brand-inverted-button`, `bg-error-inverted`) define only the plain class but lack the `.hover\:...:hover` or `.disabled\:...:disabled` selector pattern. This means Tailwind's `hover:bg-brand-inverted-button` prefix doesn't work.

**Workaround:** Use arbitrary value syntax: `hover:bg-[var(--eh-colour-bg-brand-inverted-button)]`.

**Root cause:** The hover utilities follow the pattern `.bg-brand-hover, .hover\:bg-brand-hover:hover { ... }` — defining both a plain class and a pseudo-class variant. But many other utilities only define the plain class. The fix is to add the missing pseudo-class variants in the token file.

**Status:** Waiting for token file update.

---

## Issue 9 — `text-brand-textlink` token vs Figma `text-brand` discrepancy

The token file defines `text-brand-textlink` (likely intended for links with different values in dark/high-contrast modes), but Figma's Link component maps to `text-brand`. Currently using `text-brand` to match Figma.

**Status:** Needs investigation — Aman should check if `text-brand-textlink` should be used for links in dark/HC modes.

---

## Issue 10 — Docs site: Tailwind v4 in Next.js requires explicit PostCSS config and top-level directives

**Affects:** `packages/docs` (Next.js / Nextra) only. Does NOT affect `packages/components` (Vite) or future consumers using Vite-based bundlers.

Two things break when the docs site imports the EH CSS pipeline:

1. **No PostCSS config** — Next.js requires an explicit `postcss.config.mjs` with `@tailwindcss/postcss`. Without it, directives like `@theme inline` pass through literally without being processed.

2. **Nested `@import "tailwindcss"`** — The directive was buried 3 levels deep in an import chain. Tailwind v4's PostCSS plugin needs to see `@import "tailwindcss"` at the top level of the entry CSS file.

**Symptom:** Custom EH utility classes (`.bg-brand`, `.text-all-white`) worked because they're plain CSS in `@layer utilities`, but Tailwind-generated utilities (`p-6`, `gap-2`, `text-body-sm`, `rounded-lg`) produced no CSS rules.

**Solution:**

1. Created `packages/docs/postcss.config.mjs`:

```js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

2. Restructured `globals.css` so that `@import "tailwindcss"` and `@theme inline` are at the top level — not nested inside cross-package imports.

**Key rule for future consumers via Next.js:** Always add a `postcss.config.mjs` with `@tailwindcss/postcss`, and ensure `@import "tailwindcss"` plus the `@theme inline` block appear at the top level of your CSS entry file.

---

## Issue 11: Bar variant Pagination focus ring clipped

**Component:** Pagination (bar variant)
**Status:** Deferred

The bar variant `<nav>` container uses `overflow-clip` to keep child backgrounds (e.g. active page `bg-disabled`) within the rounded corners. This clips the outset `box-shadow` focus ring (5px spread) on all child elements — page items and prev/next buttons.

**Attempted fix:** Replaced `overflow-clip` with `overflow-visible` and added explicit `rounded-l-lg` / `rounded-r-lg` to first/last children (same pattern as ButtonGroup). Reverted — introduced visual regressions with background bleeding at corners.

**Impact:** Bar variant page items show a truncated focus ring. Bar variant prev/next buttons show no visible focus ring when tabbing. Card variant is not affected.

**Possible approaches for future:**

- Use `outline` instead of `box-shadow` for focus rings inside joined containers (outlines respect overflow differently)
- Use `clip-path` instead of `overflow-clip` (allows box-shadow to escape while still clipping backgrounds)
- Use `isolation: isolate` + `z-index` layering to let focus rings paint above the container

---

## Issue 12: Missing pseudo-class utility variants for brand-inverted and border-brand-hover

**Component:** Pagination (affects PaginationItem and BarNavButton)
**Status:** Workaround in place

The following tokens have no `hover:` or `active:` pseudo-class utility variants defined in `@layer utilities` in `input.css`:

- `bg-brand-inverted` — no `hover:bg-brand-inverted` or `active:bg-brand-inverted`
- `border-brand-hover` — no `hover:border-brand-hover`

**Workaround:** Using arbitrary value form:

- `hover:bg-[var(--eh-colour-bg-brand-inverted)]`
- `active:bg-[var(--eh-colour-bg-brand-inverted)]`
- `hover:border-[var(--eh-colour-border-brand-hover)]`

**Fix:** Add pseudo-class variants to `packages/tokens/src/input.css` in `@layer utilities`:

```css
.hover\:bg-brand-inverted:hover {
  background-color: var(--eh-colour-bg-brand-inverted);
}
.active\:bg-brand-inverted:active {
  background-color: var(--eh-colour-bg-brand-inverted);
}
.hover\:border-brand-hover:hover {
  border-color: var(--eh-colour-border-brand-hover);
}
```

This would let future components use the clean utility form instead of arbitrary values. Low priority — the arbitrary form works correctly.

---

## Token verification findings

During component development, all utility classes were verified against `packages/tokens/src/input.css`.

### Utilities confirmed working

**Background:** `bg-brand`, `bg-brand-inverted`, `bg-accent`, `bg-accent-inverted`, `bg-neutral`, `bg-neutral-inverted`, `bg-error`, `bg-error-inverted`, `bg-success`, `bg-success-inverted`, `bg-info`, `bg-info-inverted`, `bg-warning`, `bg-warning-inverted`, `bg-avatar`, `bg-default`, `bg-disabled`, `bg-transparent`

**Text:** `text-all-white`, `text-strong`, `text-default`, `text-disabled`, `text-inverted-disabled`, `text-inverted-black-white`, `text-black-on-dark-hc`, `text-brand`, `text-brand-textlink`, `text-error`, `text-error-hover-focus`

**Border:** `border-brand`, `border-brand-weak`, `border-brand-disabled`, `border-accent-weak`, `border-weak`, `border-default`, `border-disabled`, `border-error`, `border-error-strong`, `border-error-disabled`, `border-success`, `border-success-weak`, `border-info`, `border-warning`, `border-focus-inner`, `border-neutral-avatargroup`

**Typography (via `@theme inline`):** `text-body-xs`, `text-body-sm`, `text-body-md`, `text-body-lg`, `text-heading-4`, `text-heading-5`, `text-heading-6`, `font-weight-medium`, `font-weight-semibold`

**Border radius:** `rounded-full` → `--radius-full` → `var(--eh-border-radius-rounded)` in `@theme inline`. Token-compliant.

### Utilities requiring arbitrary fallbacks

- `border-warning-weak` — does NOT exist. Use `border-[var(--eh-colour-border-warning-weak)]`
- `bg-brand-inverted-button` — no `.hover\:` variant. Use `hover:bg-[var(--eh-colour-bg-brand-inverted-button)]`
- `bg-error-inverted` — no `.hover\:` variant. Use `hover:bg-[var(--eh-colour-bg-error-inverted)]`
- `disabled:` pseudo-class variants — many disabled utilities (e.g. `bg-brand-disabled`) lack the `.disabled\:bg-brand-disabled:disabled` selector pattern. Fix needed in the token file.

### Non-standard typography composite usage

These components use the body-sm font size + body-xs line-height composite pattern (cannot use `text-body-sm` utility because it carries the wrong line height):

- BadgeNonSemantic
- BadgeSemantic
- BadgeNotificationNonSemantic
- BadgeNotificationSemantic
- TextLink (sm size only)
