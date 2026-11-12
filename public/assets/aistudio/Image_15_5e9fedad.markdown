---
name: WordRing
colors:
  surface: '#fef9ef'
  surface-dim: '#ded9d1'
  surface-bright: '#fef9ef'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f8f3ea'
  surface-container: '#f2ede4'
  surface-container-high: '#ede8df'
  surface-container-highest: '#e7e2d9'
  on-surface: '#1d1c16'
  on-surface-variant: '#43474b'
  inverse-surface: '#32302a'
  inverse-on-surface: '#f5f0e7'
  outline: '#74777c'
  outline-variant: '#c4c7cb'
  surface-tint: '#52606d'
  primary: '#52606d'
  on-primary: '#ffffff'
  primary-container: '#dcebfa'
  on-primary-container: '#5c6a77'
  inverse-primary: '#b9c8d7'
  secondary: '#6a5a5f'
  on-secondary: '#ffffff'
  secondary-container: '#f3dde3'
  on-secondary-container: '#706065'
  tertiary: '#4c6173'
  on-tertiary: '#ffffff'
  tertiary-container: '#d8ebff'
  on-tertiary-container: '#566b7d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d5e4f3'
  primary-fixed-dim: '#b9c8d7'
  on-primary-fixed: '#0f1d28'
  on-primary-fixed-variant: '#3a4854'
  secondary-fixed: '#f3dde3'
  secondary-fixed-dim: '#d6c1c7'
  on-secondary-fixed: '#24181d'
  on-secondary-fixed-variant: '#524348'
  tertiary-fixed: '#d0e5fb'
  tertiary-fixed-dim: '#b4c9de'
  on-tertiary-fixed: '#071d2d'
  on-tertiary-fixed-variant: '#35495a'
  background: '#fef9ef'
  on-background: '#1d1c16'
  surface-variant: '#e7e2d9'
typography:
  display-lg:
    fontFamily: Nunito Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Nunito Sans
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Nunito Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Nunito Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  title-md:
    fontFamily: Nunito Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Nunito Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Nunito Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Nunito Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Nunito Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Nunito Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Nunito Sans
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.03em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system translates the tactile nostalgia of handheld, ring-bound vocabulary flashcards into an intimate digital stationery experience. Designed for focused, stress-free language acquisition, the emotional tone is gentle, organized, and encouraging—reminiscent of quiet study desks, textured paper stock, and pastel tab dividers.

### Design Movement: Soft Stationery
The visual philosophy pairs tactile stationery affordances with contemporary minimalism:
- **Paper Realism & Binder Motifs:** Cards exhibit matte paper textures, delicate ruling, perforated top edges, and metallic binder loop cutouts without tipping into heavy skeuomorphism.
- **Calm Micro-Interactions:** Gestures emulate natural index card flips, gentle elastic pulls against metal ring binders, and tactile snap feedback upon mastery.
- **Friendly Companionship:** Mascots (a cream kitten with blushing cheeks and a powder-blue shaded cloud) provide non-intrusive emotional reinforcement and celebrate daily micro-streaks.
- **Bilingual Typographic Harmony:** Built specifically to balance Thai and Latin scripts with shared visual weight, open counters, and matched ascender metrics.

## Colors

The palette utilizes paper-derived tints, muted pastels, and softened ink values to prevent optical fatigue during prolonged study sessions. High-contrast pure black (#000000) and blinding white (#FFFFFF) are strictly avoided in favor of textured, natural pigments.

### Core Swatches & Roles
- **Canvas Base (`#F7F7F4`):** Soft ivory background that mimics uncoated Japanese cotton paper.
- **Primary Accent (`#DCEBFA`):** Powder blue; applied to primary card tags, active ring anchors, and focused study progress tracks.
- **Secondary Accent (`#F5DFE5`):** Blush pink; signifies saved items, memory milestones, and warmth cues.
- **Tertiary Accent (`#A8BDD2`):** Dusty blue; provides tonal contrast for active tab bars, strokes, borders, and tactile ring highlights.
- **Neutral Surface (`#EAE5DC`):** Warm oatmeal beige; used for recessed card decks, binder header trays, and inactive pill tracks.
- **Text Ink (`#484A50`):** Soft charcoal; delivers accessible contrast against pale backgrounds while maintaining a graphite pencil aesthetic.
- **Card Highlight (`#FFFFFF`):** Reserved exclusively for active study card surfaces to pop subtly from the ivory backdrop.

## Typography

The typographic hierarchy prioritizes fluid bilingual typesetting between Thai and English. Nunito Sans provides rounded, welcoming terminals for Latin characters, mirroring the smooth geometric loops of Thai sans-serif typefaces (such as IBM Plex Sans Thai and Anuphan).

### Bilingual Rules
- **Font Stack Pairing:** Primary English font is set to `Nunito Sans`, with fallback and bilingual mapping to `IBM Plex Sans Thai, Anuphan, sans-serif`.
- **Thai Vertical Metrics:** Thai diacritics (tone marks and vowel signs) require adequate vertical clearance. Never set line-height below `1.4` for mixed Thai-English body copy to prevent mark clipping.
- **Visual Weight Balancing:** Thai script naturally appears slightly denser than Latin script at identical weights. In dual-display headings, set Thai text at weight `500` if paired alongside Latin text at weight `600` to maintain optical parity.

## Layout & Spacing

Layouts adhere to an 8pt spatial grid configured around a centered mobile viewport and a structured tablet/desktop study binder desk.

### Grid Architecture
- **Mobile (< 768px):** Single-column stacked deck. Fixed 16px lateral canvas margins ensure full finger reach while anchoring cards within natural thumb swipe corridors.
- **Tablet & Desktop (≥ 768px):** A maximum content boundary of 960px. Flashcards sit in an anchored dual-pane arrangement (Left: Ring binder shelf & deck selector; Right: Active study card flip area) floating centrally over the `#F7F7F4` ivory backdrop.
- **Deck Container Hierarchy:** Vertical card decks utilize `space-md` (16px) separation, creating the cadence of fanned-out stationery packs.

## Elevation & Depth

This system avoids aggressive drop shadows and dark vignettes. Depth is established through subtle paper layering, warm ambient feathering, and fine hairline borders.

### Surface Tiers
- **Tier 0 (Desk Canvas):** Flat `#F7F7F4`. Zero elevation.
- **Tier 1 (Recessed Organizers & Shelves):** `#EAE5DC` background with an inset hairline border (`1px solid rgba(72, 74, 80, 0.06)`).
- **Tier 2 (Inactive & Stacked Cards):** `#FAF9F6` background resting behind active cards with an offset of 4px vertically and a soft ambient shadow: `0 2px 8px -2px rgba(72, 74, 80, 0.05)`.
- **Tier 3 (Active Focus Card):** Pure `#FFFFFF` paper card, framed by a `1.5px solid #EAE5DC` border and an ambient dual-layer shadow: `0 4px 14px 0 rgba(72, 74, 80, 0.06), 0 1px 3px 0 rgba(72, 74, 80, 0.04)`.
- **The Metal Ring Binder Element:** Dual ring loops are positioned along the top or left card edge. Rendered with a linear gradient spanning `#FFFFFF` to `#A8BDD2` with a 1px cast shadow (`0 2px 4px rgba(72, 74, 80, 0.12)`), simulating real metallic silver-blue binder coils.

## Shapes

The design embraces rounded, pocket-notebook geometry. Radii replicate rounded die-cut index cards that soften interaction and protect corners from visual harshness.

### Radius Scale
- **Flashcards & Major Panels:** Set to 16px-20px (`rounded-lg` to `rounded-xl`).
- **Interactive Controls & Inputs:** 12px-16px corner radius for input fields and dialog sheets.
- **Ring Punch Hole:** Perfectly circular (`border-radius: 9999px`), 14px diameter, punch-stamped into the upper margin of each card.
- **Pills, Badges, & Filter Chips:** Fully rounded capsule/pill shape (`9999px`) for a soft, pebble-like aesthetic.

## Components

### Vocabulary Flashcards
- **Structure:** Clean white rect card with rounded 18px corners. The top center features a die-cut hole punch flanked by a metallic loop (`#A8BDD2`).
- **Styling:** Faint horizontal ruling lines at 28px increments using `rgba(72, 74, 80, 0.05)` mimicking lined notebook sheets.
- **States:** Resting has subtle warmth; interactive flip rotates along the Y-axis using a gentle spring timing curve (`cubic-bezier(0.34, 1.56, 0.64, 1)`).

### Buttons & Action Tabs
- **Primary Button:** Powder blue (`#DCEBFA`) container with Soft Charcoal (`#484A50`) text, `1.5px solid #A8BDD2` border, and 12px pill radius. Resting state has an indented paper appearance; active press yields a 1px downward translation.
- **Secondary Button:** Warm Beige (`#EAE5DC`) background, borderless, charcoal text.
- **Icon Actions:** 1.5px minimal line icons (speaker audio pronunciation, bookmark, edit) rendered in `#484A50`.

### Chips & Filter Tags
- **Appearance:** Capsule pills with 6px vertical and 12px horizontal padding.
- **Inactive:** `#EAE5DC` background with `#484A50` text.
- **Active:** Powder Blue (`#DCEBFA`) or Blush Pink (`#F5DFE5`) fill with a `1px solid rgba(72, 74, 80, 0.12)` contour.

### Input Fields
- **Appearance:** Flat `#FFFFFF` surface embedded inside an `#EAE5DC` well.
- **Border:** 1.5px border colored `#EAE5DC` transitioning smoothly to Dusty Blue (`#A8BDD2`) upon focus.
- **Placeholder:** Charcoal tinted to 45% opacity (`rgba(72, 74, 80, 0.45)`).

### Progress & Mastery Trackers
- **Ring-Stack Indicator:** Displayed as miniaturized horizontal card tabs showing current batch size (e.g., "12 / 20 words").
- **Mascot Milestone Callouts:** Mascot illustrations (blushing cream kitten and powder cloud) framed in soft blush circles (`#F5DFE5`) appearing after successful recall runs, offering brief praise in Thai and English.