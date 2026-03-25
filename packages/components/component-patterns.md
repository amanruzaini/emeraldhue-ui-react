# EH Component Patterns

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

| Situation | Approach |
|---|---|
| Complex behaviour (focus trapping, keyboard nav, portals) | `npx shadcn add` then override visuals |
| Simple behaviour, EH-specific anatomy | Write from scratch using CVA |

Components that use shadcn base: DropdownMenu, Dialog, Accordion, Select, Tooltip, Popover, NavigationMenu.

Components written from scratch: Button, Badge, Tag, Chip, and others with simple behaviour.

---

## CSS class rules

### Colours — use EH utility class names

Defined in `@layer utilities` in `packages/tokens/src/input.css`.

```tsx
// ✅ correct
'bg-brand'
'text-all-white'
'border-brand-strong'
'hover:bg-brand-hover'
'disabled:bg-brand-disabled'

// ❌ wrong — arbitrary value not needed for colours
'bg-[var(--eh-colour-bg-brand)]'
```

### Spacing — use EH token utilities with awareness

EH spacing is mapped into Tailwind's theme via `--spacing-*` in `@theme inline`, so `px-6`, `py-4` etc. resolve through EH tokens — not Tailwind defaults.

However EH uses a 2px base scale while standard Tailwind uses 4px. The numbers mean different sizes:

| Class | EH value at 100% | Standard Tailwind |
|---|---|---|
| p-4 | 8px | 16px |
| p-6 | 12px | 24px |
| p-8 | 16px | 32px |

Both forms are valid:

```tsx
'px-[var(--eh-spacing-6)]'  // ← explicit, self-documenting
'px-6'                       // ← concise, resolves via EH token
```

Spacing tokens respond to `data-text-resize` switching automatically. Hardcoded pixel values do not.

### Border widths — use EH utility class names

`.border-t`, `.border-r`, `.border-b`, `.border-l` are mapped to EH xs border width. The `-xs` suffix is an alias:

```tsx
'border-t-xs'   // = 'border-t' ← same output
'border-b-sm'   // ← bottom with sm width
'border-solid'
```

Prefer the explicit `-xs`/`-sm`/`-md` suffix form for clarity when mixing different widths on the same element.

Never use plain Tailwind `border-2`, `border-4` etc. — those are hardcoded pixel values, not EH tokens.

### Border radius — use Tailwind utility mapped to EH token

```tsx
// ✅ correct — mapped via @theme inline
'rounded-md'    // → var(--eh-border-radius-md)
'rounded-lg'    // → var(--eh-border-radius-lg)
```

### Typography — use EH utility class names

```tsx
// ✅ correct
'text-body-xs'
'text-body-sm'
'text-body-md'
'font-default'
'font-weight-medium'

// ❌ wrong
'text-sm'        // Tailwind default size, not EH
'text-base'
```

### Icon sizes — use EH token as CSS custom property

```tsx
// ✅ correct — responds to text-resize switching
'[--icon-size:var(--eh-icon-xs)]'
'[--icon-size:var(--eh-icon-sm)]'
'[--icon-size:var(--eh-icon-md)]'

// Then on the icon wrapper span:
const iconStyle = { width: 'var(--icon-size)', height: 'var(--icon-size)' }

// ❌ wrong — hardcoded, doesn't respond to text-resize
'[--icon-size:16px]'
```

### Letter spacing — use EH token arbitrary value

```tsx
// ✅ correct
'tracking-[var(--eh-font-letter-spacing-body-sm)]'
'tracking-[var(--eh-font-letter-spacing-body-md)]'
```

### States and rings — use EH utility class names

```tsx
// ✅ correct — defined in @layer utilities in input.css
'default-ring-bezel'
'focus-visible:focus-ring-bezel'
'hover:hover-ring-bezel'
'disabled:no-ring'
```

---

## Component anatomy

### Always use forwardRef

```tsx
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ ...props }, ref) => {
    return <button ref={ref} {...props} />
  }
)
Button.displayName = 'Button'
```

### Always add data-slot

The `data-slot` attribute identifies the component for styling hooks and testing:

```tsx
<button data-slot="button" />
```

### Prop names must mirror Figma exactly

If Figma calls it `Type`, the prop is `variant` only if it's a direct shadcn convention replacement. Otherwise keep the Figma name.

Document the mapping in JSDoc comments:

```tsx
/** Maps to Figma "Type" property */
variant?: ButtonVariant

/** Maps to Figma "Icon Leading" boolean */
iconLeading?: boolean
```

### State props are never React props

Figma states like Hover, Pressed, Focus are CSS concerns — handle them with pseudo-class utilities:

```tsx
'hover:bg-brand-hover'
'active:bg-brand-active'
'focus-visible:focus-ring-bezel'
'disabled:bg-brand-disabled'
```

Never create a `state` prop on a React component.

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
- Any new EH utility that gets stripped unexpectedly

Classes that do NOT need registration:
- `bg-brand`, `bg-error` etc. — twMerge handles `bg-*` natively
- `text-brand`, `text-default` etc. — twMerge handles `text-*` natively

```ts
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'border-w-t': ['border-t-xs', 'border-t-sm', ...],
      'font-weight': ['font-weight-medium', ...],
      // add new groups here only when twMerge strips a class
    },
  },
})
```

---

## Code Connect (Button.figma.tsx)

Every component needs a `.figma.tsx` file for Code Connect. This file is never bundled — only used by the Figma CLI.

```tsx
import figma from '@figma/code-connect'
import { Button } from './Button'

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
})
```

---

## index.ts barrel export

Always export the component, its variants, and all types:

```ts
export { Button, buttonVariants } from './Button'
export type { ButtonProps, ButtonVariant, ButtonSize, ButtonContent } from './Button'
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
- Never use plain Tailwind spacing utilities (`p-4`, `px-6`)
- Never hardcode pixel values (`[--icon-size:16px]`)
- Never create a `state` prop for hover/focus/pressed states
- Never put types or variants in separate files by default
- Never skip registering new classes in `extendTailwindMerge`
