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

### Spacing — always use EH token arbitrary values

EH spacing uses a 2px base scale. Tailwind uses a 4px base scale. They are incompatible — never use plain Tailwind spacing utilities for EH components.

```tsx
// ✅ correct — reads directly from EH token
'px-[var(--eh-spacing-6)]'   // → 12px at 100% scale
'py-[var(--eh-spacing-4)]'   // → 8px at 100% scale
'gap-[var(--eh-spacing-2)]'  // → 4px at 100% scale

// ❌ wrong — Tailwind p-6 = 24px, not 12px
'px-6'
'py-4'
'gap-2'
```

Spacing tokens also respond to `data-text-resize` switching automatically — hardcoded values do not.

### Border widths — use EH utility class names

```tsx
// ✅ correct
'border-t-xs'   // border-top-width: var(--eh-border-width-xs)
'border-b-sm'   // border-bottom-width: var(--eh-border-width-sm)
'border-solid'

// ❌ wrong
'border-t'       // Tailwind default, not EH
'border-2'       // hardcoded, not token-based
```

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
'font-medium'

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

## twMerge — registering new classes

Every custom EH utility class used in a component must be registered in `src/lib/utils.ts` via `extendTailwindMerge`. If a class isn't registered, `twMerge` may strip it when consumers pass `className` overrides.

Add to the relevant group or create a new group:

```ts
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'border-w-t': ['border-t-xs', 'border-t-sm', ...],
      'border-color': ['border-brand', 'border-brand-strong', ...],
      'bg-color': ['bg-brand', 'bg-brand-hover', ...],
      // add new groups here as components are added
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
