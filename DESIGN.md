# 🎨 AURA AI Design System (`DESIGN.md`)

> **Source of Truth**: Google Stitch Project `Aura AI Command Center` (`projects/9637302430958561063`)

---

## 1. Design Philosophy & Aesthetics

The **AURA AI** design system embodies an ultra-premium, dark-mode "Autonomous AI Enterprise OS" aesthetic. It merges high-density data presentation with sleek glassmorphism, subtle neon glows, and fluid micro-animations.

- **Theme**: Obsidian / Dark Space (#0C1323)
- **Vibe**: Tech & Command Center, authoritative, precise, instantaneous
- **Depth**: Glassmorphism with `border-subtle` (`rgba(255, 255, 255, 0.08)`), multi-layered backdrop blurs, and localized glowing accents.

---

## 2. Typography Tokens

We use a tiered typography structure:
- **Headlines & Display**: `Hanken Grotesk` / `Plus Jakarta Sans`
- **Body Content**: `Inter`
- **Labels, Badges & Monospace**: `JetBrains Mono` / `Inter`

| Token Name | Font Family | Size | Weight | Line Height | Letter Spacing |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `display` | `Hanken Grotesk` | `56px` | `600` | `1.1` | `-0.04em` |
| `headline-lg` | `Hanken Grotesk` | `32px` | `600` | `1.2` | `-0.02em` |
| `headline-lg-mobile`| `Hanken Grotesk` | `24px` | `600` | `1.2` | `normal` |
| `headline-md` | `Hanken Grotesk` | `24px` | `500` / `700` | `1.3` | `-0.01em` |
| `body-lg` | `Inter` | `18px` | `400` | `1.6` | `normal` |
| `body-md` | `Inter` | `15px` / `16px` | `400` | `1.5` | `normal` |
| `label-md` | `Inter` / `JetBrains Mono` | `13px` | `600` | `1.0` | `0.02em` |
| `label-sm` | `Inter` / `JetBrains Mono` | `12px` | `500` | `1.0` | `0.05em` |

---

## 3. Color Tokens

### Dark Mode Base Surfaces
- `background`: `#0C1323` (Deep Obsidian Navy)
- `surface`: `#0C1323`
- `surface-container-lowest`: `#070E1D`
- `surface-container-low`: `#141B2B`
- `surface-container`: `#181F2F`
- `surface-container-high`: `#232A3A`
- `surface-container-highest`: `#2E3545`
- `surface-variant`: `#2E3545`
- `surface-bright`: `#32394A`
- `surface-dim`: `#0C1323`
- `surface-deep`: `#07070A`

### Typography Colors
- `on-surface`: `#DBE2F8` (Off-white / pale icy blue)
- `on-surface-variant`: `#C8C4D8` (Muted violet-gray)
- `text-muted`: `#666D80` (Deep muted gray)
- `inverse-surface`: `#DBE2F8`
- `inverse-on-surface`: `#293041`

### Accents & Brand
- `primary`: `#C5C0FF` (Light Violet / Tint)
- `on-primary`: `#2500A2`
- `primary-container`: `#6453F9` (Electric Violet Highlight / Active Button)
- `on-primary-container`: `#F5F1FF`
- `primary-fixed`: `#E3DFFF`
- `primary-fixed-dim`: `#C5C0FF`

- `secondary`: `#C8C5CD`
- `secondary-container`: `#49484E`
- `on-secondary-container`: `#BAB7BE`
- `secondary-fixed`: `#E4E1E9`

- `tertiary`: `#FFB68E` (Warm Peach Accent)
- `tertiary-container`: `#B55100`
- `on-tertiary-container`: `#FFEFE9`

### Status & Utility
- `success`: `#10B981` (Emerald Active Status)
- `error`: `#FFB4AB` (Warning / Failed State)
- `error-container`: `#93000A`
- `on-error`: `#690005`
- `border-subtle`: `rgba(255, 255, 255, 0.08)` (Signature Glass Border)

---

## 4. Spacing Tokens

Base grid scale: `4px` baseline unit

- `stack-sm`: `4px`
- `base`: `8px`
- `stack-md`: `12px`
- `margin-mobile`: `16px`
- `gutter`: `24px`
- `stack-lg`: `24px`
- `margin-desktop`: `48px`
- `container-max`: `1280px`

---

## 5. Border Radius Tokens

- `sm`: `0.25rem` (4px)
- `DEFAULT`: `0.125rem` (2px)
- `md`: `0.5rem` (8px)
- `lg`: `0.75rem` (12px)
- `xl`: `1rem` (16px) - Cards & Modals
- `full`: `9999px` - Badges & Status Pills

---

## 6. Elevation & Shadows

Depth is created via glassmorphic borders and layered container tints rather than heavy dark drop shadows:
- **Glass Border**: `1px solid rgba(255, 255, 255, 0.08)`
- **Hover Glow**: `hover:border-primary/50 transition-colors`
- **Node Drop Shadow**: `shadow-lg shadow-black/50`
- **Backdrop Blur**: `backdrop-blur-xl` (16px - 24px blur)

---

## 7. Button Styles

### Primary Action Button
```css
bg-primary-container text-on-primary-container font-label-md text-label-md px-4 py-2.5 rounded-lg hover:opacity-90 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2
```

### Primary Solid Light Button
```css
bg-primary text-background font-label-md text-label-md px-4 py-2.5 rounded-lg hover:opacity-90 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2
```

### Secondary / Ghost Button
```css
bg-surface-variant border border-border-subtle text-on-surface font-label-md text-label-md px-4 py-2 rounded-lg hover:bg-secondary-container transition-colors flex items-center gap-2
```

### Icon Utility Button
```css
w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-variant hover:text-on-surface transition-colors
```

---

## 8. Card Styles

### Standard Persona / Feature Card
- Background: `bg-surface` (`#0C1323`) or `bg-surface-container-low` (`#141B2B`)
- Border: `border border-border-subtle`
- Radius: `rounded-xl`
- Padding: `p-6`
- Interactive Hover: `hover:border-primary/50 transition-colors group`

### Dashed Action / Add Card
- Background: `bg-surface-container`
- Border: `border border-border-subtle border-dashed`
- Radius: `rounded-xl`
- Hover: `hover:bg-surface-variant hover:border-primary/50 transition-all cursor-pointer`

---

## 9. Responsive Breakpoints & Layout

- **Mobile (< 768px)**:
  - Top header sticky navigation with brand logo, status indicator, action buttons.
  - Single-column card grid.
  - Collapsible bottom console / log panel.
- **Desktop (≥ 768px)**:
  - Fixed left sidebar navigation (`w-64 fixed left-0 top-0 h-screen z-40`).
  - Main workspace offset by `md:ml-64`.
  - Grid structures: 2 to 4 columns (`md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`).
  - Max container width: `1280px` centered.

---

## 10. Component Guidelines & Component Mapping

1. **Navbar & Global Layout**: Left rail sidebar with active indicators (`smart_toy`, `dashboard_customize`, `account_tree`, `receipt_long`, `settings`) + Mobile Header.
2. **Hero Section**: Executive summary title, active agent selector, real-time pipeline status pulse badge, primary trigger button.
3. **Stats Section**: Live data counters (Throughput 12.4k/s, Latency 42ms, Quality Score 94%, Active Personas, Total Curated Posts).
4. **Projects (Curated News & Posts)**: Filterable story feed (All, HackerNews, RSS, AI Drafts) with 1-click Twitter Web Intent publish action & direct X posting.
5. **Services (Agent Personas)**: Interactive persona management grid (`Nexus-7`, `Aura-Scribe`, `Sentinel-X`), create persona dialog, active persona toggle connected to `/api/agent/personas`.
6. **Process (Logic Pipeline Flow)**: Interactive 4-stage visualizer with animated SVG connectors: Discovery ➔ Deduplication ➔ Gemini Quality Gate ➔ Publisher.
7. **Testimonials & Console (Execution Logs)**: Real-time terminal log viewer with color-coded severity tags ([INFO], [WARN], [SUCCESS]) and system event log streamer.
8. **CTA & Footer**: Deployment banner, API key status monitor (Gemini, Twitter, Turso Cloud DB), documentation link, system status footer.
