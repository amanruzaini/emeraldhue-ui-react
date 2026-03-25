export type ButtonType = 'Primary' | 'Secondary' | 'Tertiary' | 'Destructive'
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg'
export type ButtonContent = 'Label + icon' | 'Icon only'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Maps to Figma "Type" property */
  type?: ButtonType
  /** Maps to Figma "Size" property */
  size?: ButtonSize
  /** Maps to Figma "Content" property — controls label vs icon-only mode */
  content?: ButtonContent
  /** Maps to Figma "Icon Leading" boolean — only visible when content is "Label + icon" */
  iconLeading?: boolean
  /** Maps to Figma "Icon Trailing" boolean — only visible when content is "Label + icon" */
  iconTrailing?: boolean
  /** Icon node rendered in the leading position */
  leadIcon?: React.ReactNode
  /** Icon node rendered in the trailing position */
  trailIcon?: React.ReactNode
  /** Icon rendered in icon-only mode — only visible when content is "Icon only" */
  icon?: React.ReactNode
  /** Button label text — only visible when content is "Label + icon" */
  label?: string
}
