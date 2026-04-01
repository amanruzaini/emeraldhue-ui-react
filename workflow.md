# EH Development Workflow

> **Last updated:** 2026-03-30
>
> | Date       | Change                                                                                                                                                                                                                                                        |
> | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
> | 2026-03-30 | Created. Extracted agent roles, dual-prompt workflow, branch hygiene, and session startup from `eh-project-handoff.md`. Moved per-component a11y checklists here from `component-patterns.md`. Compressed 14-step process into before/during/after structure. |

How the team operates: agent roles, the build process, review gates, and session management.

---

## Roles

**Planning agent (Claude in claude.ai with Figma MCP):**

- Reviews Figma design context via Figma MCP (`get_design_context` with `disableCodeConnect: true`)
- Extracts sizing, tokens, typography, colour mappings, and anatomy from the Figma data
- Verifies all utility classes against `packages/tokens/src/input.css` before writing any prompt
- Makes architectural decisions with Aman (component structure, prop API, CVA approach, sub-component needs)
- Pushes back on decisions that conflict with established patterns
- Writes detailed prompts for both Claude Code and Codex
- Reviews agent output against the Figma spec and patterns doc
- Identifies bugs and writes fix prompts when needed

**Execution agents (Claude Code / Codex):**

- Receive the prompt and generate component code
- Claude Code creates the full 3-file structure plus barrel exports and dependency installs
- Codex generates `codex-Component.tsx` only (for side-by-side comparison)
- Commits the code

**Aman (project lead):**

- Provides Figma URLs and component property lists
- Makes product/design decisions when options are presented
- Feeds prompts to both agents
- Brings agent output back to the planning agent for review
- Commits approved code

---

## Key principles

These are non-negotiable rules that prevent recurring mistakes:

- **Decisions happen in the planning agent, not in execution agents.** Execution agents receive precise instructions — they don't make architectural choices.
- **Token verification happens before prompting.** Every utility class is checked against `input.css` before it appears in a prompt. This eliminates the "silent failure" problem where a non-existent class produces no CSS.
- **Review catches structural bugs.** The planning agent checks for issues like sizing conflicts, unnecessary nesting, and incorrect token usage that automated tools would miss.
- **Patterns compound.** Learnings from each component feed into subsequent prompts, making them more accurate over time.
- **Verify component APIs against source before writing usage examples.** The handoff doc may describe a "pending" refactor that has already shipped. Always check the actual component's `interface` and render function before writing MDX examples or prompts that reference component props.

---

## Before starting

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

### Gather inputs

1. Get the Figma node URL and component property list from Aman
2. Pull Figma design context via MCP (`get_design_context` with `disableCodeConnect: true`)
3. Extract the full spec: sizes, tokens, colour matrix, typography, anatomy

---

## When building

### Planning phase

1. Verify all utility classes against `input.css` — search for exact class names in `@layer utilities` and `@theme inline`
2. Present decisions to Aman for confirmation (composition approach, prop API, edge cases)
3. Write both prompts (see dual-prompt format below)

### Dual-prompt format

Every component session produces **two prompts**:

1. **Claude Code prompt** — full integration engineer. Handles all files, barrel exports, dependency installs, twMerge updates
2. **Codex prompt** — scoped to `Component.tsx` only. Self-contained with inlined code blocks, explicit file paths to read, and a verification checklist

Key differences in Codex prompts: (1) explicit "Read these files first" paths, (2) separate "Files to create" vs "Files to modify" sections, (3) inline code for CVA/types/edge cases instead of descriptions, (4) workarounds spelled out with actual code, (5) verification checklist at end. Codex runs autonomously without back-and-forth so the prompt must be fully self-contained.

Over time, the outputs are compared to evaluate which agent to use as the primary execution agent.

### Execution

1. Create/switch to the task branch
2. Feed both prompts to their respective agents
3. Agents generate the component files

---

## Before handing off

### Review against spec

Bring the generated code back to the planning agent. Review checks:

- Does the component match the Figma spec (sizes, tokens, anatomy)?
- Are all utility classes verified and correct?
- Does the prop API follow `component-patterns.md` conventions?
- Are there structural bugs (sizing conflicts, unnecessary nesting, incorrect token usage)?

If issues found: planning agent writes a fix prompt, repeat execution.

### Add to dev preview

Add a preview section to `packages/components/src/dev/DevApp.tsx` — every component gets a `<PreviewSection>` covering all variant/prop combinations for visual testing across themes.

### Accessibility review checklist

Use this checklist before committing. Not every item applies to every component — use judgement.

**Interactive components (Button, Link, Toggle, Input, Select, etc.):**

- [ ] Uses correct semantic HTML element
- [ ] Focusable via Tab key without `tabIndex` hack
- [ ] Visible focus indicator via `focus-visible:` styles
- [ ] `focus-visible:outline-none` added to suppress browser default outline
- [ ] Keyboard activation matches expected pattern (Enter/Space for buttons, Enter for links)
- [ ] `aria-label` required/documented for icon-only variants
- [ ] Disabled state uses `disabled` attribute (not just visual styling)
- [ ] Disabled state communicated to assistive technology
- [ ] For polymorphic components: `<a>` disabled via `aria-disabled` + click prevention

**Display components (Badge, Avatar, Tag, Chip, etc.):**

- [ ] Uses appropriate element (`<span>` for inline, `<div>` for block)
- [ ] Decorative images have `alt=""`
- [ ] Does not rely on colour alone for meaning (icon or text accompanies colour)
- [ ] Dynamic content (notification counts) uses `aria-live` or `role="status"` where appropriate

**Container components (Dialog, Dropdown, Accordion, Tooltip, etc.):**

- [ ] Focus trapped when open (handled by shadcn/Radix base) — only for blocking overlays
- [ ] Escape key closes the component
- [ ] Focus returns to trigger element on close
- [ ] `aria-expanded` on trigger element
- [ ] `role="dialog"` / `role="menu"` / `role="tooltip"` as appropriate
- [ ] `aria-labelledby` or `aria-label` on the container

---

## When opening a new session

### What to attach

Each new chat window with the planning agent should attach:

1. **`eh-project-handoff.md`** — full project context
2. **`component-patterns.md`** — coding conventions and rules
3. **`input.css`** — the token file from `packages/tokens/src/input.css` (for utility verification)

Optionally attach `known-issues.md` if working on a component that may hit token gaps.

### Quick-start messages

For component work:

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

- Button (variants × sizes, icons, icon-only, disabled, shortcut single/multi-key, disabled+shortcut, xs size)
- Checkbox Input (sizes × states)
- Checkbox Field (sizes × states with description)
- Avatar Single (types × sizes, indicator types)
- Avatar Group (sizes, max overflow)
- Badge Non Semantic (appearances × colours × sizes)
- Badge Semantic (appearances × statuses × sizes)
- Badge Notification Non Semantic (shapes × colours × sizes)
- Badge Notification Semantic (shapes × statuses × sizes)
- Accordion (single/multiple, subtitle, icon, badge, disabled, kitchen sink)
