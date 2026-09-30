---
name: Serene Editorial Monolith
colors:
  surface: '#faf9f7'
  surface-dim: '#dadad8'
  surface-bright: '#faf9f7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f1'
  surface-container: '#efeeec'
  surface-container-high: '#e9e8e6'
  surface-container-highest: '#e3e2e0'
  on-surface: '#1a1c1b'
  on-surface-variant: '#444748'
  inverse-surface: '#2f3130'
  inverse-on-surface: '#f1f1ef'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c8c6c5'
  secondary: '#5d5e66'
  on-secondary: '#ffffff'
  secondary-container: '#e3e1ec'
  on-secondary-container: '#63646c'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1b1b1e'
  on-tertiary-container: '#848387'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474746'
  secondary-fixed: '#e3e1ec'
  secondary-fixed-dim: '#c6c5cf'
  on-secondary-fixed: '#1a1b22'
  on-secondary-fixed-variant: '#46464e'
  tertiary-fixed: '#e4e1e5'
  tertiary-fixed-dim: '#c8c6c9'
  on-tertiary-fixed: '#1b1b1e'
  on-tertiary-fixed-variant: '#47464a'
  background: '#faf9f7'
  on-background: '#1a1c1b'
  surface-variant: '#e3e2e0'
typography:
  display:
    fontFamily: Newsreader
    fontSize: 40px
    fontWeight: '400'
    lineHeight: 52px
    letterSpacing: -0.02em
  display-mobile:
    fontFamily: Newsreader
    fontSize: 30px
    fontWeight: '400'
    lineHeight: 38px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Newsreader
    fontSize: 28px
    fontWeight: '400'
    lineHeight: 38px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Newsreader
    fontSize: 22px
    fontWeight: '400'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Newsreader
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 26px
  body-lg:
    fontFamily: Newsreader
    fontSize: 19px
    fontWeight: '400'
    lineHeight: 32px
  body-md:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.06em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  margin: 3rem
  margin-sm: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

The design system embodies a contemplative, mindful sanctuary tailored for deliberate daily journaling, reflection, and habit pursuit. It fuses classical literary editorial restraint with the crisp utility of modern productivity software. The aesthetic relies on an uncompromising monochrome baseline—charcoal, pitch black, warm alabaster, and soft limestone neutrals—instilling focus, stillness, and intellectual weight.

Targeting thoughtful professionals, writers, and mindful achievers, the interface delivers quiet luxury through expansive whitespace, micro-hairlines, tactile cards, and an absence of chromatic clutter. The visual movement blends Minimalist purity with Editorial Typography and Tactile Micro-Interactions, allowing prose and habit consistency to stand out as primary artifacts of personal growth.

## Colors

The palette revolves around deep charcoal black (`#1A1A1A`) rooted against an ethereal warm off-white canvas (`#FDFCFA`). This eliminates the stark sterility of pure digital white and creates an organic, paper-like reading atmosphere.

- **Primary (`#1A1A1A`)**: Applied to primary headers, solid active pill indicators, filled calendar state dots, and high-emphasis controls.
- **Secondary (`#71717A`)**: A neutral stone gray used for muted meta text, secondary navigation, calendar day names, and sub-labels.
- **Tertiary (`#27272A`)**: A deep slate charcoal for secondary buttons, borders under active states, and emphasis hover targets.
- **Neutral (`#FDFCFA`)**: The foundation canvas tone, accompanied by warm stone tiering:
  - Surface subtle: `#F4F4F0`
  - Border hairline: `#E7E5E0`
  - Subtle accent tint (e.g. discreet success badges for active pursuits): muted sage wash `#F0FDF4` with `#166534` text.

## Typography

The type scale orchestrates a tension between `Newsreader` and `Inter`. 

- **Newsreader** handles date headings, reflective questions, journal entry text, pursuit titles, and narrative prose. Set with generous line heights, it invites slower reading, tactile rhythm, and editorial cadence.
- **Inter** anchors structural UI chrome: calendar weekday labels, navigational pills, metric trackers, metadata timestamps, and button copy. Its utilitarian geometry ensures operational clarity without competing with the journal entries.

## Layout & Spacing

The spatial model prioritizes deliberate breathing room to declutter cognitive overhead:

- **Desktop (1024px+)**: A split asymmetrical layout. Left column (340px to 380px fixed width) hosts calendar date selection and streak summaries; right column expands fluidly up to a readable maximum width of 720px for the writing canvas and pursuit streams.
- **Tablet (768px – 1023px)**: Single or two-column layout with 2rem margins and collapsible calendar panels.
- **Mobile (< 768px)**: Single column with edge-to-edge flow, 1.25rem side margins, and sticky sub-navigation pills.
- **Vertical Spacing Rhythm**: Micro-spaces (`space-xs`, `space-sm`) define pill badges and metadata pairings; macro-spaces (`space-lg`, `space-xl`) define entries, segment dividers, and view transitions.

## Elevation & Depth

Visual hierarchy is maintained primarily through surface contrast and hairline boundaries rather than dramatic physical drops:

- **Level 0 (Canvas)**: Base background `#FDFCFA`.
- **Level 1 (Cards & Modals)**: Lifted using `#FFFFFF` resting upon subtle hairline stone borders (`1px solid #E7E5E0`) combined with an ambient whisper shadow: `0 1px 3px rgba(0, 0, 0, 0.02), 0 4px 12px rgba(26, 26, 26, 0.03)`.
- **Floating Controls (Formatting Tooltip & Popovers)**: `#1A1A1A` deep charcoal surfaces with crisp inverted text, rendered with a tighter, deeper shadow: `0 8px 24px rgba(0, 0, 0, 0.12)`.
- **Dividers**: Vertical and horizontal rules are rendered as continuous `1px solid #EFECE6` strokes, establishing architectural lanes without visual weight.

## Shapes

The roundedness level is strictly tuned to **2** (0.5rem base radius). This produces balanced corners that soften digital sharp edges without appearing toy-like:

- **Standard Containers & Pursuit Cards**: `0.5rem` (`rounded-md`) to maintain structure and calm containment.
- **Floating Modals & Editor Panels**: `0.75rem` (`rounded-lg`).
- **Interactive Badges, Calendar Active Cells, & Top Navigation Tabs**: Specially rounded into full continuous pills (`9999px`) to create clear tactile affordances for selection states.
- **Status Heatmap Nodes**: Subtle `2px` to `4px` softly rounded squares or circular puncts (`rounded-full` for day entry dot indicators).

## Components

### Buttons
- **Primary**: Solid `#1A1A1A` fill, white `#FFFFFF` text, `rounded-md` (or pill for contextual tags), padding `0.5rem 1rem`, `font-Inter` weight 500. Gentle opacity transition on hover (`rgba(26, 26, 26, 0.88)`).
- **Secondary / Ghost**: Transparent fill, `#71717A` text, hover state transitions to `#F4F4F0` background with `#1A1A1A` text.
- **Action Links (Edit / Delete)**: Flat textual buttons with understated `#71717A` text, transitioning to `#1A1A1A` or subtle crimson on hover.

### Navigation Pills & Tabs
- Top level segment switchers (`Journal`, `Pursuits`, `Overview`) are housed in a shared horizontal row. Active tabs feature a solid `#1A1A1A` pill shape with crisp white typography. Inactive tabs are borderless text links in `#71717A` that transition smoothly on hover.

### Calendar & Heatmap Grid
- **Weekday Row**: Monospace-like tight `label-sm` uppercase Inter in `#A1A1AA`.
- **Day Cells**: Sized uniformly at `36px × 36px`.
  - Selected Day: Solid `#1A1A1A` circle with white text.
  - Today (Unselected): Crisp outline ring (`1px solid #1A1A1A`) with charcoal text.
  - Days with Entries: Understated solid dot (`3px` diameter) centered directly beneath the date number.
  - Out of Month: Light slate `#D4D4D8`.

### Rich-Text Writing Canvas & Toolbars
- **Editor Canvas**: Clean borderless area using `Newsreader` regular typography at 19px for prose. Placeholder set in `#A1A1AA` with an italicized prompt.
- **Formatting Bubble / Tooltip**: Floats cleanly above text selections. Rendered with a `#1A1A1A` dark enclosure, `0.375rem` radius, containing miniature icons for Bold, Italic, Heading, Quote, and Checklist.

### Pursuit & Habit Cards
- **Card Surface**: Pure `#FFFFFF` surface bordered by `1px solid #E7E5E0`, padding `1.25rem`.
- **Card Header**: `headline-sm` in `Newsreader` font.
- **Card Body**: Supporting description in `Inter` 14px `#71717A`.
- **Status Indicator**: Pill badge on the card bottom-right:
  - `ACTIVE`: Soft sage background (`#F0FDF4`), border `1px solid #DCFCE7`, text `#15803D`, uppercase tracking `0.06em`.
  - `PAUSED` / `ARCHIVED`: Light neutral stone background (`#F4F4F5`), text `#71717A`.

### Progress Bars
- Linear metric tracks: `4px` height, track background `#F4F4F0`, active fill `#1A1A1A` with subtle `2px` end caps.