import figma from '@figma/code-connect'
import { Accordion, AccordionItem } from './Accordion'

// ────────────────────────────────────────────────────────
// AccordionItem — Code Connect
// ────────────────────────────────────────────────────────

figma.connect(AccordionItem, 'https://www.figma.com/design/0qqUZvCf7MIcrRuJQla85o/Components-3.0?node-id=135099-16877', {
  props: {
    title: figma.string('Accordion Title'),
    subtitle: figma.string('Subtitle'),
    showSubtitle: figma.boolean('Show Subtitle'),
    startIcon: figma.boolean('Icon', {
      true: figma.children('Icon'),
      false: undefined,
    }),
    showBadge: figma.boolean('Badge'),
    disabled: figma.enum('State', {
      Disabled: true,
    }),
    expanded: figma.boolean('Expanded'),
  },
  example: ({ title, subtitle, showSubtitle, startIcon, showBadge, disabled }) => (
    <AccordionItem
      value="item-1"
      title={title}
      subtitle={showSubtitle ? subtitle : undefined}
      startIcon={startIcon}
      showBadge={showBadge}
      disabled={disabled}
    >
      Content goes here
    </AccordionItem>
  ),
})

// ────────────────────────────────────────────────────────
// Accordion (Group) — Code Connect
// ────────────────────────────────────────────────────────

figma.connect(Accordion, 'https://www.figma.com/design/0qqUZvCf7MIcrRuJQla85o/Components-3.0?node-id=136838-5639', {
  props: {},
  example: () => (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1" title="Accordion Title">
        Content goes here
      </AccordionItem>
      <AccordionItem value="item-2" title="Accordion Title">
        Content goes here
      </AccordionItem>
    </Accordion>
  ),
})
