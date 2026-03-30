# EH Component Patterns

> **Last updated:** 2026-03-30
>
> | Date | Change |
> | --- | --- |
> | 2026-03-30 | Restructured into stable rulebook only. Moved workarounds and token gap details to `known-issues.md`, per-component a11y checklists to `workflow.md`, component status notes to `eh-project-handoff.md`. |

A reference guide for building components in the Emerald HUE component library.
Follow these patterns consistently across all components.

---

## File structure

Every component lives in its own folder under `src/components/` with exactly 3 files:

```
src/components/
  button/
    Button.tsx          ← component + types + CVA variants
    Button.figma.tsx    ← Code Connect mapping only, never bundled
    index.ts            ← barrel export
```

Only split into more files if the component is genuinely large (e.g. DataTable, ComboBox). Default is always 3 files.

---

## When to use shadcn as a base

| Situation                                                 | Approach                               |
| --------------------------------------------------------- | -------------------------------------- |
| Complex behaviour (focus trapping, keyboard nav, portals) | `npx shadcn add` then override visuals |
| Simple behaviour, EH-specific anatomy                     | Write from scratch using CVA           |

Components that use shadcn base: DropdownMenu, Dialog, Accordion, Select, Tooltip, Popover, NavigationMenu.

Components written from scratch: Button, Badge, Tag, Chip, TextLink, KeyboardShortcut, Alert, and others with simple behaviour.

### shadcn override workflow (established with Accordion)

When using shadcn/Radix as the base:

1. Run `npx shadcn add <component>` to install the Radix dependency
2. **Do NOT use the generated file** — delete or ignore it. Write your own from scratch using EH tokens
3. **CRITICAL:** After running `npx shadcn add`, verify `packages/components/src/input.css` has NOT been overwritten. It must contain exactly:
   ```css
   @import '../../tokens/src/input.css';
   @source "./components/**/*.{ts,tsx}";
   @source "./dev/**/*.{ts,tsx}";
   ```
4. Wrap Radix primitives in EH-styled components. Use Radix's `data-[state=*]` attribute selectors for state styling:
   ```tsx
   // ✅ correct — use Radix data attributes for open/closed states
   'data-[state=open]:rotate-180'; // chevron rotation
   'data-[state=open]:bg-brand'; // background on open
   'data-[disabled]:opacity-50'; // Radix disabled attribute
   ```
5. Add animation keyframes to `packages/tokens/src/tokens.css` if needed (e.g. Accordion expand/collapse)

---

## CSS class rules

### Important mindset framing

Tailwind syntax is used in this repo, but values resolve from EH tokens, not Tailwind default docs.

### Colours — use EH utility class names

Defined in `@layer utilities` in `packages/tokens/src/input.css`.

```tsx
// ✅ correct
'bg-brand';
'text-all-white';
'border-brand-strong';
'hover:bg-brand-hover';
'disabled:bg-brand-disabled';

// ❌ wrong — arbitrary value not needed for colours
'bg-[var(--eh-colour-bg-brand)]';
```

**Exception — missing pseudo-class variants:** Some colour utilities lack a `hover:` or `disabled:` variant in the token file. In those cases, use the arbitrary value form: `hover:bg-[var(--eh-colour-bg-brand-inverted-button)]`. See `known-issues.md` for the full list of affected utilities.

### Spacing — use EH token utilities with awareness

EH spacing is mapped into Tailwind's theme via `--spacing-*` in `@theme inline`, so `px-6`, `py-4` etc. resolve through EH tokens — not Tailwind defaults.

However EH uses a 2px base scale while standard Tailwind uses 4px. The numbers mean different sizes:

| Class | EH value at 100% | Standard Tailwind |
| ----- | ---------------- | ----------------- |
| p-4   | 8px              | 16px              |
| p-6   | 12px             | 24px              |
| p-8   | 16px             | 32px              |

Prefer named spacing utilities in component code. Spacing tokens respond to `data-text-resize` switching automatically. Hardcoded pixel values do not.

### Border widths — use EH utility class names

`.border-t`, `.border-r`, `.border-b`, `.border-l` are mapped to EH xs border width. The `-xs` suffix is an alias:

```tsx
'border-t-xs'; // = 'border-t' ← same output
'border-b-sm'; // ← bottom with sm width
'border-solid';
```

Prefer the explicit `-xs`/`-sm`/`-md` suffix form for clarity when mixing different widths on the same element.

Never use plain Tailwind `border-2`, `border-4` etc. — those are hardcoded pixel values, not EH tokens.

### Border radius — use Tailwind utility mapped to EH token

```tsx
// ✅ correct — mapped via @theme inline
'rounded-md'; // → var(--eh-border-radius-md)
'rounded-lg'; // → var(--eh-border-radius-lg)
'rounded-full'; // → var(--eh-border-radius-rounded) — confirmed token-compliant
```

### Typography — use EH utility class names

```tsx
// ✅ correct
'text-body-xs';
'text-body-sm';
'text-body-md';
'font-default';
'font-weight-medium';

// ❌ wrong
'text-sm'; // Tailwind default size, not EH
'text-base';
```

`text-body-*` utilities already carry the EH line-height and letter-spacing from the theme. Do not add a second `tracking-*` class unless you are intentionally deviating from the text token.

**Non-standard typography composite:** When a component requires a font size from one token but a line height from another (e.g. body-sm font + body-xs line-height), use arbitrary values instead of the `text-body-*` utility:

```tsx
'text-[length:var(--eh-font-size-body-sm)]';
'leading-[var(--eh-font-line-height-body-xs)]';
'tracking-[var(--eh-font-letter-spacing-body-sm)]';
```

### Icon sizes — use EH utility class names

```tsx
// ✅ correct — responds to text-resize switching
'size-icon-xs';
'size-icon-sm';
'size-icon-md';
```

The existing `icon-xs` / `icon-sm` / `icon-md` utilities are for `font-size`. Use `size-icon-*` when the wrapper needs tokenized `width` and `height`.

For icon sizing inside components, use the CSS custom property pattern:

```tsx
// ✅ correct — icon size via CSS custom property, responds to text-resize
'[--icon-size:var(--eh-icon-md)]';
// Then on the icon wrapper:
'w-[var(--icon-size)] h-[var(--icon-size)]';
```

### States and rings — use EH utility class names

```tsx
// ✅ correct — defined in @layer utilities in input.css
'default-ring-bezel';
'focus-visible:focus-ring-bezel';
'hover:hover-ring-bezel';
'disabled:no-ring';

// ✅ always include — suppresses browser default outline
'focus-visible:outline-none';
```

**Always add `focus-visible:outline-none` on interactive components.** Browsers show a native outline alongside the EH focus-ring box-shadow.

---

## Component anatomy

### Always use forwardRef

```tsx
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ ...props }, ref) => {
    return <button ref={ref} {...props} />;
  },
);
Button.displayName = 'Button';
```

### Always add data-slot

The `data-slot` attribute identifies the component for styling hooks and testing:

```tsx
<button data-slot="button" />
```

### Prop API design — code-first, Figma-mapped

The public React API must be **code-first and ergonomic**. Engineers should not need to think about Figma configuration to use a component. Code Connect acts as the **translation layer** between Figma properties and React props.

#### Principle: separate concerns

| Concern                  | Owner           | Where it lives                       |
| ------------------------ | --------------- | ------------------------------------ |
| Developer-friendly props | React component | `Component.tsx`                      |
| Figma property names     | Design metadata | `Component.figma.tsx` (Code Connect) |
| Mapping between the two  | Code Connect    | `Component.figma.tsx`                |

#### Naming conventions

| Figma property                        | React prop                                    | Reason                                  |
| ------------------------------------- | --------------------------------------------- | --------------------------------------- |
| `Type` (Primary, Secondary...)        | `variant`                                     | Standard React/shadcn convention        |
| `Size` (xs, sm, md...)                | `size`                                        | Already code-friendly                   |
| `Label`                               | `children`                                    | Standard React pattern for text content |
| `Icon Leading` (boolean) + icon slot  | `startIcon?: ReactNode`                       | Single prop, render when provided       |
| `Icon Trailing` (boolean) + icon slot | `endIcon?: ReactNode`                         | Single prop, render when provided       |
| `Content` (Label+icon / Icon only)    | `iconOnly?: boolean`                          | Or infer from children                  |
| `Disabled`                            | `disabled`                                    | Standard HTML attribute (via ...props)  |
| `Indicator` (boolean)                 | `indicator?: boolean`                         | Already code-friendly                   |
| `Online` (boolean)                    | `online?: boolean`                            | Already code-friendly                   |
| `Number` (boolean)                    | `count?: number`                              | Single prop — shown when provided       |
| `Badge` (boolean) + label             | `showBadge?: boolean` + `badgeLabel?: string` | Internal composition (see below)        |

#### Key rules

1. **Use `children` for text content** — not a `label` prop — unless the component genuinely needs a separate label (e.g. form fields with both label and input).

2. **Merge boolean + node pairs into a single optional prop** — instead of `iconLeading: boolean` + `leadIcon: ReactNode`, use `startIcon?: ReactNode`. The icon shows when the prop is provided.

3. **Use standard React/HTML naming** — `startIcon`/`endIcon` (not `leadIcon`/`trailIcon`), `disabled` (not `isDisabled`), `children` (not `label`).

4. **Keep Figma names where they're already code-friendly** — `size`, `variant`, `indicator`, `online`, `appearance`, `status`, `colour` are fine as-is.

5. **Document the Figma mapping in JSDoc** — every prop should have a JSDoc comment noting which Figma property it maps to:

```tsx
/** Maps to Figma "Type" property */
variant?: ButtonVariant

/** Maps to Figma "Icon Leading" — icon shown when provided */
startIcon?: React.ReactNode
```

6. **Code Connect handles the translation** — the `.figma.tsx` file maps Figma's property names/shapes to the React API:

```tsx
// In Component.figma.tsx
figma.connect(Button, FIGMA_URL, {
  props: {
    variant: figma.enum('Type', { Primary: 'Primary', ... }),
    label: figma.string('Label'),
    iconLeading: figma.boolean('Icon Leading'),
    leadIcon: figma.children('Icon Leading'),
  },
  example: ({ variant, label, iconLeading, leadIcon }) => (
    <Button variant={variant} startIcon={iconLeading ? leadIcon : undefined}>
      {label}
    </Button>
  ),
})
```

#### Internal composition pattern

When a component renders another EH component internally with fixed styling (e.g. Accordion renders BadgeNonSemantic), use a simple boolean + string prop pair rather than a flexible ReactNode slot:

```tsx
// ✅ Internal composition — fixed styling, simple API
showBadge?: boolean
badgeLabel?: string  // defaults to "New"

// Component renders internally:
{showBadge && <BadgeNonSemantic size="sm" appearance="Inverted" colour="Blue Grey">{badgeLabel ?? 'New'}</BadgeNonSemantic>}
```

Use the flexible `ReactNode` slot pattern instead when consumers need to pass different component types or styles.

### Polymorphic components

Some components need to render as different HTML elements depending on context. Use the "check for href" pattern:

```tsx
// TextLink renders as <a> when href is provided, <button> when not
type TextLinkAsAnchor = TextLinkBaseProps &
  Omit<React.ComponentPropsWithoutRef<'a'>, keyof TextLinkBaseProps> & {
    href: string;
  };

type TextLinkAsButton = TextLinkBaseProps &
  Omit<React.ComponentPropsWithoutRef<'button'>, keyof TextLinkBaseProps> & {
    href?: never;
  };

type TextLinkProps = TextLinkAsAnchor | TextLinkAsButton;

// In the component:
const Component = props.href ? 'a' : 'button';
return <Component ref={ref} {...props} />;
```

For `<a>` elements, disabled is not a native HTML attribute — handle disabled links by adding `aria-disabled="true"`, `tabIndex={-1}`, and `role="link"` and preventing click via `onClick={e => e.preventDefault()}`.

### State props are never React props

Figma states like Hover, Pressed, Focus are CSS concerns — handle them with pseudo-class utilities:

```tsx
'hover:bg-brand-hover';
'active:bg-brand-active';
'focus-visible:focus-ring-bezel';
'disabled:bg-brand-disabled';
```

Never create a `state` prop on a React component.

---

## Accessibility (WCAG 2.1 AA compliance)

Every EH component must meet WCAG 2.1 Level AA. This is not optional — the library targets industrial environments where accessibility failures can have safety implications.

### 1. Use semantic HTML elements

| Component type    | Element                             | Why                                                         |
| ----------------- | ----------------------------------- | ----------------------------------------------------------- |
| Buttons, actions  | `<button>`                          | Built-in keyboard activation (Enter/Space), focus, role     |
| Links, navigation | `<a>`                               | Built-in navigation semantics, keyboard activation          |
| Text badges, tags | `<span>`                            | Inline, non-interactive — correct for decorative indicators |
| Containers, cards | `<div>`                             | Generic container — add `role` if it has semantic meaning   |
| Form inputs       | `<input>`, `<select>`, `<textarea>` | Built-in form semantics, validation, labelling              |

Never use a `<div>` or `<span>` for interactive elements. Never use `<button>` for navigation.

### 2. Keyboard accessibility

- **Focusable:** Use native focusable elements (`<button>`, `<a>`, `<input>`) — avoid `tabIndex={0}` on divs unless absolutely necessary.
- **Activation:** Buttons activate on Enter and Space. Links activate on Enter.
- **Focus visible:** Use `focus-visible:` pseudo-class (not `focus:`). **Always pair with `focus-visible:outline-none`**.
- **Focus trapping:** Only for blocking overlays (Modal, Dialog) — NOT for inline components (Alert, Accordion). Use shadcn/Radix base for components that need trapping.

### 3. ARIA attributes

Use ARIA only when HTML semantics are insufficient.

| Pattern      | Use                                               | Example                                                    |
| ------------ | ------------------------------------------------- | ---------------------------------------------------------- |
| Labels       | `aria-label` when no visible text label exists    | `<button aria-label="Close dialog">` for icon-only buttons |
| Descriptions | `aria-describedby` for supplementary info         | Error messages linked to form fields                       |
| Live regions | `aria-live="polite"` for dynamic content updates  | Toast notifications, loading states                        |
| States       | `aria-disabled`, `aria-expanded`, `aria-selected` | Accordions, dropdowns, toggles                             |
| Roles        | `role="status"`, `role="alert"`                   | Notification badges, error messages                        |

Never add ARIA that contradicts native semantics.

### 4. Colour and contrast

- **Never hardcode colours** — use EH tokens which meet contrast ratios across all 6 theme modes.
- **Never rely on colour alone** to convey meaning — always pair with icon, text, or shape.
- **Trust the token system** — if a component uses tokens correctly, contrast is handled.

### 5. Screen reader considerations

- **Decorative images:** `alt=""` (empty string).
- **Meaningful images:** Require `alt` prop from the consumer.
- **Icon-only buttons/links:** Must have `aria-label`. Icon wrappers should have `aria-hidden="true"`.
- **Hidden text:** Use `sr-only` (Tailwind utility) when needed.

### 6. Runtime accessibility warnings (development only)

For critical a11y gaps (icon-only buttons without labels, images without alt text), add a development-only `console.warn`. Keep these lightweight — only for the most critical gaps.

```tsx
if (process.env.NODE_ENV === 'development') {
  if (iconOnly && !props['aria-label'] && !props['aria-labelledby']) {
    console.warn(
      'EH Button: icon-only buttons require an aria-label or aria-labelledby for accessibility.',
    );
  }
}
```

Document the a11y expectation in JSDoc. Do NOT enforce `aria-label` as a required TypeScript prop — it's inherited from `HTMLAttributes`. Use runtime warnings instead.

---

## CVA structure

```tsx
const componentVariants = cva(
  [
    // Base classes — applied to all variants
    // Order: layout → typography → border → effects → states
  ],
  {
    variants: {
      variant: { ... },    // maps to Figma "Type"
      size: { ... },       // maps to Figma "Size"
    },
    defaultVariants: {
      variant: 'Primary',
      size: 'md',
    },
  }
)
```

---

## twMerge — register classes that merge incorrectly

`tailwind-merge` handles standard Tailwind class groups natively. Only register EH custom utility classes that `twMerge` doesn't recognise and merges incorrectly. Test first — register only if a class gets stripped.

Classes that need registration:

- Border width side groups (`border-t-xs`, `border-b-sm` etc.) because EH uses non-standard suffix names
- `font-weight-medium` because it doesn't match twMerge's expected font-weight pattern
- Font size group (`text-body-xs`, `text-body-sm`, `text-body-md`, `text-body-lg`) — custom EH size names
- Text colour group (`text-brand`, `text-error`, `text-disabled`, `text-all-white` etc.) — may conflict with font-size group
- Any new EH utility that gets stripped unexpectedly

Classes that do NOT need registration:

- `bg-brand`, `bg-error` etc. — twMerge handles `bg-*` natively
- `rounded-*` — mapped through `@theme inline`, twMerge handles natively

```ts
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'border-w-t': ['border-t-xs', 'border-t-sm', ...],
      'font-weight': ['font-weight-medium', ...],
      'font-size': ['text-body-xs', 'text-body-sm', 'text-body-md', 'text-body-lg'],
      'text-color': ['text-brand', 'text-error', 'text-disabled', 'text-all-white', ...],
      // add new groups here only when twMerge strips a class
    },
  },
})
```

---

## Code Connect (Component.figma.tsx)

Every component needs a `.figma.tsx` file for Code Connect. This file is never bundled — only used by the Figma CLI.

```tsx
import figma from '@figma/code-connect';
import { Button } from './Button';

figma.connect(Button, 'FIGMA_NODE_URL', {
  props: {
    variant: figma.enum('Type', {
      Primary: 'Primary',
      Secondary: 'Secondary',
    }),
    size: figma.enum('Size', {
      xs: 'xs',
      sm: 'sm',
      md: 'md',
      lg: 'lg',
    }),
    label: figma.string('Label'),
    disabled: figma.boolean('Disabled'),
  },
  example: ({ variant, size, label, disabled }) => (
    <Button variant={variant} size={size} disabled={disabled}>
      {label}
    </Button>
  ),
});
```

---

## index.ts barrel export

Always export the component, its variants, and all types:

```ts
export { Button, buttonVariants } from './Button';
export type {
  ButtonProps,
  ButtonVariant,
  ButtonSize,
} from './Button';
```

---

## Theme and text resize

- `data-theme` on `<html>` switches colour tokens
- `data-text-resize` on `<html>` switches typography + spacing
- Components never read or react to these attributes directly
- Tokens handle all switching at the CSS level automatically

---

## What NOT to do

- Never import shadcn's CSS (`shadcn/tailwind.css`, `tw-animate-css`) — use EH tokens only
- Never use plain Tailwind colour utilities (`bg-blue-500`)
- Never hardcode pixel values (`[--icon-size:16px]`)
- Never create a `state` prop for hover/focus/pressed states
- Never put types or variants in separate files by default
- Never skip registering new classes in `extendTailwindMerge`
- Never expose Figma-shaped prop pairs (boolean + node) — merge into a single optional prop
- Never use a `label` prop when `children` is the standard React pattern
- Never use `<div>` or `<span>` for interactive elements — use semantic HTML (`<button>`, `<a>`, `<input>`)
- Never rely on colour alone to convey meaning — always pair with text, icon, or shape
- Never skip focus-visible styling on interactive components
- Never forget `focus-visible:outline-none` — browser default outlines show alongside EH focus rings
- Never use `tabIndex={0}` on non-interactive elements unless building a custom widget with full keyboard support
- Never add ARIA roles that duplicate native element semantics
- Never use the generated shadcn file directly after `npx shadcn add` — write your own with EH tokens
