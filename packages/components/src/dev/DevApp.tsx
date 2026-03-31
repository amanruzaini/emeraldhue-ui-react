import React from 'react'
import { AvatarGroup } from '../components/avatar-group'
import type { AvatarGroupSize } from '../components/avatar-group'
import { AvatarSingle } from '../components/avatar-single'
import type {
  AvatarSingleIndicatorType,
  AvatarSingleSize,
  AvatarSingleType,
} from '../components/avatar-single'
import { BadgeNonSemantic } from '../components/badge-non-semantic'
import type {
  BadgeNonSemanticAppearance,
  BadgeNonSemanticColour,
  BadgeNonSemanticSize,
} from '../components/badge-non-semantic'
import { BadgeNotificationNonSemantic } from '../components/badge-notification-non-semantic'
import type {
  BadgeNotificationNonSemanticColour,
  BadgeNotificationNonSemanticShape,
  BadgeNotificationNonSemanticSize,
} from '../components/badge-notification-non-semantic'
import { BadgeNotificationSemantic } from '../components/badge-notification-semantic'
import type {
  BadgeNotificationSemanticShape,
  BadgeNotificationSemanticSize,
  BadgeNotificationSemanticStatus,
} from '../components/badge-notification-semantic'
import { BadgeSemantic } from '../components/badge-semantic'
import type {
  BadgeSemanticAppearance,
  BadgeSemanticSize,
  BadgeSemanticStatus,
} from '../components/badge-semantic'
import { Button } from '../components/button'
import type { ButtonSize, ButtonVariant } from '../components/button'
import { CheckboxField } from '../components/checkbox-field'
import { CheckboxInput } from '../components/checkbox-input'
import type { CheckboxInputSize } from '../components/checkbox-input'
import { Accordion, AccordionItem } from '../components/accordion'
import { Alert } from '../components/alert'
import { RadioInput } from '../components/radio-input'
import type { RadioInputSize } from '../components/radio-input'
import { RadioField } from '../components/radio-field'

const themes = [
  'theme-light',
  'theme-dark',
  'theme-light-high-contrast',
  'theme-dark-high-contrast',
  'theme-light-colour-blind',
  'theme-dark-colour-blind',
] as const

const buttonVariants: ButtonVariant[] = ['Primary', 'Secondary', 'Tertiary', 'Destructive']
const buttonSizes: ButtonSize[] = ['xs', 'sm', 'md', 'lg']
const checkboxSizes: CheckboxInputSize[] = ['sm', 'md']
const avatarSingleSizes: AvatarSingleSize[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl']
const avatarGroupSizes: AvatarGroupSize[] = ['xs', 'sm', 'md']
const avatarTypes: AvatarSingleType[] = ['Image', 'Initial']
const avatarIndicatorTypes: AvatarSingleIndicatorType[] = ['Status', 'Logo']
const badgeSizes: Array<BadgeNonSemanticSize | BadgeSemanticSize> = ['sm', 'md', 'lg']
const badgeNonSemanticAppearances: BadgeNonSemanticAppearance[] = ['Inverted', 'Solid']
const badgeNonSemanticColours: BadgeNonSemanticColour[] = ['Brand', 'Accent', 'Blue Grey']
const badgeSemanticAppearances: BadgeSemanticAppearance[] = ['Inverted', 'Solid']
const badgeSemanticStatuses: BadgeSemanticStatus[] = ['Error', 'Success', 'Info', 'Warning']
const notificationSizes: Array<BadgeNotificationNonSemanticSize | BadgeNotificationSemanticSize> = [
  'xs',
  'sm',
  'md',
  'lg',
]
const notificationNonSemanticShapes: BadgeNotificationNonSemanticShape[] = ['Solid', 'Inverted']
const notificationNonSemanticColours: BadgeNotificationNonSemanticColour[] = ['Brand', 'Neutral']
const notificationSemanticShapes: BadgeNotificationSemanticShape[] = ['Solid', 'Inverted']
const notificationSemanticStatuses: BadgeNotificationSemanticStatus[] = ['Info', 'Alert']
const radioInputSizes: RadioInputSize[] = ['sm', 'md', 'lg']

const previewImageSrc = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0f766e" />
        <stop offset="100%" stop-color="#14b8a6" />
      </linearGradient>
    </defs>
    <rect width="120" height="120" fill="url(#bg)" rx="60" />
    <circle cx="60" cy="46" r="20" fill="#ecfeff" />
    <path d="M26 100c8-20 24-30 34-30s26 10 34 30" fill="#ecfeff" />
  </svg>`
)}`

const pageStyle: React.CSSProperties = {
  padding: '2rem',
  // fontFamily: 'sans-serif',
}

const themeSwitcherStyle: React.CSSProperties = {
  display: 'flex',
  gap: '0.5rem',
  marginBottom: '2rem',
  flexWrap: 'wrap',
}

const sectionStyle: React.CSSProperties = {
  marginBottom: '2.5rem',
  padding: '1.25rem',
  border: '1px solid rgba(128, 128, 128, 0.25)',
  borderRadius: '12px',
}

const flowStyle: React.CSSProperties = {
  display: 'flex',
  gap: '1rem',
  flexWrap: 'wrap',
  alignItems: 'center',
}

const cardGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
  gap: '1rem',
}

const cardStyle: React.CSSProperties = {
  border: '1px solid rgba(128, 128, 128, 0.2)',
  borderRadius: '10px',
  padding: '1rem',
}

const tableStyle: React.CSSProperties = {
  borderCollapse: 'collapse',
  width: '100%',
}

const cellStyle: React.CSSProperties = {
  padding: '0.75rem',
  textAlign: 'left',
  verticalAlign: 'top',
}

const PlaceholderIcon = () => (
  <span
    aria-hidden="true"
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
      fontSize: '0.9em',
      lineHeight: 1,
    }}
  >
    ●
  </span>
)

const LogoIcon = () => (
  <span
    aria-hidden="true"
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
      fontSize: '0.75em',
      fontWeight: 700,
      lineHeight: 1,
    }}
  >
    E
  </span>
)

function PreviewSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section style={sectionStyle}>
      <h2 style={{ marginTop: 0, marginBottom: '1rem' }}>{title}</h2>
      {children}
    </section>
  )
}

function PreviewCard({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div style={cardStyle}>
      <h3 style={{ marginTop: 0, marginBottom: '0.75rem', fontSize: '1rem' }}>{title}</h3>
      <div style={flowStyle}>{children}</div>
    </div>
  )
}

export function DevApp() {
  const [theme, setTheme] = React.useState<(typeof themes)[number]>('theme-light')

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <div style={pageStyle}>
      <h1 style={{ marginBottom: '1rem' }}>EH Components Dev</h1>

      <div style={themeSwitcherStyle}>
        {themes.map((themeName) => {
          const isActive = themeName === theme

          return (
            <button
              key={themeName}
              onClick={() => setTheme(themeName)}
              style={{
                padding: '0.5rem 1rem',
                border: `1px solid ${isActive ? '#111' : '#ccc'}`,
                borderRadius: '999px',
                cursor: 'pointer',
                background: isActive ? '#111' : '#f5f5f5',
                color: isActive ? '#fff' : '#111',
                fontWeight: isActive ? 700 : 500,
              }}
            >
              {themeName}
            </button>
          )
        })}
      </div>

      <PreviewSection title="Button">
        <h3 style={{ marginBottom: '0.75rem' }}>Variants x Sizes</h3>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={cellStyle}>Variant \\ Size</th>
              {buttonSizes.map((size) => (
                <th key={size} style={cellStyle}>
                  {size}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {buttonVariants.map((variant) => (
              <tr key={variant}>
                <td style={{ ...cellStyle, fontWeight: 700 }}>{variant}</td>
                {buttonSizes.map((size) => (
                  <td key={size} style={cellStyle}>
                    <Button variant={variant} size={size}>
                      {variant}
                    </Button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ height: '1.5rem' }} />

        <div style={cardGridStyle}>
          <PreviewCard title="Leading + Trailing Icons">
            {buttonVariants.map((variant) => (
              <Button
                key={variant}
                variant={variant}
                size="md"
                startIcon={<PlaceholderIcon />}
                endIcon={<PlaceholderIcon />}
              >
                {variant}
              </Button>
            ))}
          </PreviewCard>

          <PreviewCard title="Icon Only">
            {buttonVariants.flatMap((variant) =>
              buttonSizes.map((size) => (
                <Button key={`${variant}-${size}`} variant={variant} size={size} iconOnly>
                  <PlaceholderIcon />
                </Button>
              ))
            )}
          </PreviewCard>

          <PreviewCard title="Disabled">
            {buttonVariants.map((variant) => (
              <Button key={variant} variant={variant} size="md" disabled>
                {variant}
              </Button>
            ))}
          </PreviewCard>
        </div>
      </PreviewSection>

      <PreviewSection title="Checkbox Input">
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={cellStyle}>Size</th>
              <th style={cellStyle}>Unchecked</th>
              <th style={cellStyle}>Checked</th>
              <th style={cellStyle}>Indeterminate</th>
              <th style={cellStyle}>Disabled</th>
              <th style={cellStyle}>Disabled checked</th>
            </tr>
          </thead>
          <tbody>
            {checkboxSizes.map((size) => (
              <tr key={size}>
                <td style={{ ...cellStyle, fontWeight: 700 }}>{size}</td>
                <td style={cellStyle}>
                  <CheckboxInput aria-label={`${size} unchecked checkbox`} size={size} />
                </td>
                <td style={cellStyle}>
                  <CheckboxInput aria-label={`${size} checked checkbox`} size={size} defaultChecked />
                </td>
                <td style={cellStyle}>
                  <CheckboxInput aria-label={`${size} indeterminate checkbox`} size={size} indeterminate />
                </td>
                <td style={cellStyle}>
                  <CheckboxInput aria-label={`${size} disabled checkbox`} size={size} disabled />
                </td>
                <td style={cellStyle}>
                  <CheckboxInput
                    aria-label={`${size} disabled checked checkbox`}
                    size={size}
                    checked
                    disabled
                    readOnly
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </PreviewSection>

      <PreviewSection title="Checkbox Field">
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={cellStyle}>Size</th>
              <th style={cellStyle}>Unchecked</th>
              <th style={cellStyle}>Checked</th>
              <th style={cellStyle}>Indeterminate</th>
              <th style={cellStyle}>Disabled</th>
            </tr>
          </thead>
          <tbody>
            {checkboxSizes.map((size) => (
              <tr key={`field-${size}`}>
                <td style={{ ...cellStyle, fontWeight: 700 }}>{size}</td>
                <td style={cellStyle}>
                  <CheckboxField
                    aria-label={`${size} unchecked remember me checkbox`}
                    size={size}
                    description="Save my login details for next time."
                  >
                    Remember Me
                  </CheckboxField>
                </td>
                <td style={cellStyle}>
                  <CheckboxField
                    aria-label={`${size} checked remember me checkbox`}
                    size={size}
                    defaultChecked
                    description="Save my login details for next time."
                  >
                    Remember Me
                  </CheckboxField>
                </td>
                <td style={cellStyle}>
                  <CheckboxField
                    aria-label={`${size} indeterminate remember me checkbox`}
                    size={size}
                    indeterminate
                    description="Save my login details for next time."
                  >
                    Remember Me
                  </CheckboxField>
                </td>
                <td style={cellStyle}>
                  <CheckboxField
                    aria-label={`${size} disabled remember me checkbox`}
                    size={size}
                    disabled
                    description="Save my login details for next time."
                  >
                    Remember Me
                  </CheckboxField>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </PreviewSection>

      <PreviewSection title="Avatar Single">
        <div style={cardGridStyle}>
          {avatarTypes.map((type) => (
            <PreviewCard key={type} title={`${type} by Size`}>
              {avatarSingleSizes.map((size) => (
                <AvatarSingle
                  key={`${type}-${size}`}
                  size={size}
                  type={type}
                  src={previewImageSrc}
                  alt="Preview avatar"
                  initials="EH"
                />
              ))}
            </PreviewCard>
          ))}

          {avatarIndicatorTypes.map((indicatorType) => (
            <PreviewCard key={indicatorType} title={`${indicatorType} Indicator`}>
              {avatarSingleSizes.map((size) => (
                <AvatarSingle
                  key={`${indicatorType}-${size}`}
                  size={size}
                  type="Image"
                  src={previewImageSrc}
                  alt="Preview avatar"
                  indicator
                  indicatorType={indicatorType}
                  online={indicatorType === 'Status'}
                  logoIcon={indicatorType === 'Logo' ? <LogoIcon /> : undefined}
                />
              ))}
            </PreviewCard>
          ))}
        </div>
      </PreviewSection>

      <PreviewSection title="Avatar Group">
        <div style={cardGridStyle}>
          {avatarGroupSizes.map((size) => (
            <PreviewCard key={size} title={`Size ${size}`}>
              <AvatarGroup size={size}>
                <AvatarSingle type="Image" src={previewImageSrc} alt="Avatar 1" />
                <AvatarSingle type="Initial" initials="AM" />
                <AvatarSingle type="Image" src={previewImageSrc} alt="Avatar 3" />
                <AvatarSingle type="Initial" initials="EH" />
              </AvatarGroup>
              <AvatarGroup size={size} max={3}>
                <AvatarSingle type="Image" src={previewImageSrc} alt="Avatar 1" />
                <AvatarSingle type="Initial" initials="AM" />
                <AvatarSingle type="Image" src={previewImageSrc} alt="Avatar 3" />
                <AvatarSingle type="Initial" initials="EH" />
                <AvatarSingle type="Initial" initials="UI" />
              </AvatarGroup>
            </PreviewCard>
          ))}
        </div>
      </PreviewSection>

      <PreviewSection title="Badge Non Semantic">
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={cellStyle}>Appearance \\ Colour</th>
              {badgeNonSemanticColours.map((colour) => (
                <th key={colour} style={cellStyle}>
                  {colour}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {badgeNonSemanticAppearances.map((appearance) => (
              <tr key={appearance}>
                <td style={{ ...cellStyle, fontWeight: 700 }}>{appearance}</td>
                {badgeNonSemanticColours.map((colour) => (
                  <td key={`${appearance}-${colour}`} style={cellStyle}>
                    <div style={flowStyle}>
                      {badgeSizes.map((size) => (
                        <BadgeNonSemantic
                          key={`${appearance}-${colour}-${size}`}
                          size={size}
                          appearance={appearance}
                          colour={colour}
                          label={`${size.toUpperCase()} badge`}
                          iconLeading={size !== 'sm'}
                          icon={<PlaceholderIcon />}
                        />
                      ))}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </PreviewSection>

      <PreviewSection title="Badge Semantic">
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={cellStyle}>Appearance \\ Status</th>
              {badgeSemanticStatuses.map((status) => (
                <th key={status} style={cellStyle}>
                  {status}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {badgeSemanticAppearances.map((appearance) => (
              <tr key={appearance}>
                <td style={{ ...cellStyle, fontWeight: 700 }}>{appearance}</td>
                {badgeSemanticStatuses.map((status) => (
                  <td key={`${appearance}-${status}`} style={cellStyle}>
                    <div style={flowStyle}>
                      {badgeSizes.map((size) => (
                        <BadgeSemantic
                          key={`${appearance}-${status}-${size}`}
                          size={size}
                          appearance={appearance}
                          status={status}
                          label={`${size.toUpperCase()} ${status}`}
                          iconLeading={size !== 'sm'}
                          icon={<PlaceholderIcon />}
                        />
                      ))}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </PreviewSection>

      <PreviewSection title="Badge Notification Non Semantic">
        <div style={cardGridStyle}>
          {notificationNonSemanticShapes.map((shape) => (
            <PreviewCard key={shape} title={shape}>
              {notificationNonSemanticColours.flatMap((colour) =>
                notificationSizes.map((size) => (
                  <BadgeNotificationNonSemantic
                    key={`${shape}-${colour}-${size}`}
                    size={size}
                    shape={shape}
                    colour={colour}
                    count={size === 'xs' ? undefined : size === 'lg' ? 99 : 7}
                    title={`${shape} ${colour} ${size}`}
                  />
                ))
              )}
            </PreviewCard>
          ))}
        </div>
      </PreviewSection>

      <PreviewSection title="Badge Notification Semantic">
        <div style={cardGridStyle}>
          {notificationSemanticShapes.map((shape) => (
            <PreviewCard key={shape} title={shape}>
              {notificationSemanticStatuses.flatMap((status) =>
                notificationSizes.map((size) => (
                  <BadgeNotificationSemantic
                    key={`${shape}-${status}-${size}`}
                    size={size}
                    shape={shape}
                    status={status}
                    count={size === 'xs' ? undefined : status === 'Alert' ? 12 : 3}
                    title={`${shape} ${status} ${size}`}
                  />
                ))
              )}
            </PreviewCard>
          ))}
        </div>
      </PreviewSection>

      <PreviewSection title="Accordion">
        <div style={cardGridStyle}>
          <PreviewCard title="Single (collapsible)">
            <Accordion type="single" collapsible defaultValue="item-1">
              <AccordionItem value="item-1" title="What is Emerald HUE?">
                Emerald HUE is a React component library built with design tokens and CVA for
                consistent, themeable UI across products.
              </AccordionItem>
              <AccordionItem value="item-2" title="How do I install it?">
                Install via your package manager and import the components you need from the
                library entry point.
              </AccordionItem>
              <AccordionItem value="item-3" title="Can I customise the theme?">
                Yes — switch themes by changing the data-theme attribute on the root HTML element.
                All tokens update automatically.
              </AccordionItem>
            </Accordion>
          </PreviewCard>

          <PreviewCard title="Multiple">
            <Accordion type="multiple" defaultValue={['multi-1', 'multi-2']}>
              <AccordionItem value="multi-1" title="First Section">
                Content for the first section. Multiple items can be open at the same time.
              </AccordionItem>
              <AccordionItem value="multi-2" title="Second Section">
                Content for the second section, also open by default.
              </AccordionItem>
              <AccordionItem value="multi-3" title="Third Section">
                Content for the third section.
              </AccordionItem>
            </Accordion>
          </PreviewCard>
        </div>

        <div style={{ height: '1.5rem' }} />

        <div style={cardGridStyle}>
          <PreviewCard title="With Subtitle">
            <Accordion type="single" collapsible>
              <AccordionItem
                value="sub-1"
                title="Account Settings"
                subtitle="Manage your account preferences"
              >
                Update your email, password, and notification preferences here.
              </AccordionItem>
              <AccordionItem
                value="sub-2"
                title="Privacy & Security"
                subtitle="Control your data and access"
              >
                Configure two-factor authentication, manage sessions, and review data sharing.
              </AccordionItem>
            </Accordion>
          </PreviewCard>

          <PreviewCard title="With Icon">
            <Accordion type="single" collapsible>
              <AccordionItem
                value="icon-1"
                title="Getting Started"
                startIcon={<PlaceholderIcon />}
              >
                Follow the quickstart guide to set up your first project.
              </AccordionItem>
              <AccordionItem
                value="icon-2"
                title="Advanced Usage"
                startIcon={<PlaceholderIcon />}
                subtitle="For experienced developers"
              >
                Learn about custom hooks, compound components, and performance optimisation.
              </AccordionItem>
            </Accordion>
          </PreviewCard>
        </div>

        <div style={{ height: '1.5rem' }} />

        <div style={cardGridStyle}>
          <PreviewCard title="With Badge">
            <Accordion type="single" collapsible>
              <AccordionItem value="badge-1" title="Release Notes" showBadge badgeLabel="New">
                Version 3.2 introduces the Accordion and KeyboardShortcut components.
              </AccordionItem>
              <AccordionItem value="badge-2" title="Migration Guide" showBadge badgeLabel="Updated">
                Follow these steps to migrate from v2 to v3.
              </AccordionItem>
            </Accordion>
          </PreviewCard>

          <PreviewCard title="Disabled Items">
            <Accordion type="single" collapsible>
              <AccordionItem value="dis-1" title="Available Section">
                This section is interactive and can be expanded.
              </AccordionItem>
              <AccordionItem value="dis-2" title="Disabled Section" disabled>
                This content is not reachable because the item is disabled.
              </AccordionItem>
              <AccordionItem
                value="dis-3"
                title="Disabled with Icon"
                startIcon={<PlaceholderIcon />}
                subtitle="Locked feature"
                disabled
              >
                Upgrade your plan to access this feature.
              </AccordionItem>
            </Accordion>
          </PreviewCard>
        </div>

        <div style={{ height: '1.5rem' }} />

        <PreviewCard title="Kitchen Sink (all features)">
          <Accordion type="single" collapsible>
            <AccordionItem
              value="ks-1"
              title="Full Featured Item"
              subtitle="With every option enabled"
              startIcon={<PlaceholderIcon />}
              showBadge
              badgeLabel="New"
            >
              This item demonstrates all features: icon, subtitle, and badge together.
            </AccordionItem>
            <AccordionItem
              value="ks-2"
              title="Disabled Full Featured"
              subtitle="All features but disabled"
              startIcon={<PlaceholderIcon />}
              showBadge
              badgeLabel="Locked"
              disabled
            >
              Cannot expand this item.
            </AccordionItem>
            <AccordionItem value="ks-3" title="Plain Item">
              A simple item with no extras for contrast.
            </AccordionItem>
          </Accordion>
        </PreviewCard>
      </PreviewSection>

      <PreviewSection title="Alert">
        <h3 style={{ marginBottom: '0.75rem' }}>All Statuses — Title Only</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 500 }}>
          <Alert status="warning" title="Warning alert message" onClose={() => {}} onDetails={() => {}} />
          <Alert status="error" title="Error alert message" onClose={() => {}} onDetails={() => {}} />
          <Alert status="success" title="Success alert message" onClose={() => {}} onDetails={() => {}} />
          <Alert status="info" title="Notification alert message" onClose={() => {}} onDetails={() => {}} />
          <Alert status="neutral" title="Outline alert message" onClose={() => {}} onDetails={() => {}} />
        </div>

        <h3 style={{ marginTop: '2rem', marginBottom: '0.75rem' }}>With Description</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 500 }}>
          <Alert status="warning" title="Warning alert message" onClose={() => {}} onDetails={() => {}}>
            <ul className="list-disc ms-[21px]">
              <li>At least 10 characters (and up to 100 characters)</li>
              <li>At least one lowercase character</li>
              <li>Inclusion of at least one special character, e.g., ! @ #</li>
            </ul>
          </Alert>
          <Alert status="error" title="Error alert message" onClose={() => {}}>
            <p>Something went wrong. Please try again later.</p>
          </Alert>
        </div>

        <h3 style={{ marginTop: '2rem', marginBottom: '0.75rem' }}>Title Only — No Actions</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 500 }}>
          <Alert status="info" title="This is an info alert with no action buttons." />
        </div>
      </PreviewSection>

      <PreviewSection title="RadioInput">
        <h3 style={{ marginBottom: '0.75rem' }}>Sizes — Unselected</h3>
        <div style={flowStyle}>
          {radioInputSizes.map((size) => (
            <RadioInput key={size} size={size} name="demo-radio-size-unselected" aria-label={`${size} unselected radio`} />
          ))}
        </div>

        <h3 style={{ marginTop: '1.5rem', marginBottom: '0.75rem' }}>Sizes — Selected</h3>
        <div style={flowStyle}>
          {radioInputSizes.map((size) => (
            <RadioInput key={size} size={size} checked readOnly aria-label={`${size} selected radio`} />
          ))}
        </div>

        <h3 style={{ marginTop: '1.5rem', marginBottom: '0.75rem' }}>Disabled States</h3>
        <div style={flowStyle}>
          <RadioInput size="md" disabled aria-label="disabled unselected radio" />
          <RadioInput size="md" checked disabled readOnly aria-label="disabled selected radio" />
        </div>
      </PreviewSection>

      <PreviewSection title="RadioField">
        <div style={cardGridStyle}>
          <PreviewCard title="With Description">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <RadioField
                name="demo-radio-group"
                value="a"
                description="This is the first option with a description."
              >
                Option A
              </RadioField>
              <RadioField
                name="demo-radio-group"
                value="b"
                checked
                readOnly
                description="This is the second option with a description."
              >
                Option B
              </RadioField>
            </div>
          </PreviewCard>

          <PreviewCard title="Without Description">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <RadioField name="demo-radio-simple" value="yes">
                Yes
              </RadioField>
              <RadioField name="demo-radio-simple" value="no">
                No
              </RadioField>
            </div>
          </PreviewCard>

          <PreviewCard title="Disabled">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <RadioField name="demo-radio-disabled" disabled>
                Disabled unselected
              </RadioField>
              <RadioField name="demo-radio-disabled" checked disabled readOnly>
                Disabled selected
              </RadioField>
            </div>
          </PreviewCard>
        </div>
      </PreviewSection>
    </div>
  )
}
