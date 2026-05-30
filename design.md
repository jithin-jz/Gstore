# Google Play Store — Pixel-Perfect Design Specification

---

## 1. Overview

The Google Play Store follows Material Design 3 (Material You) principles, emphasizing dynamic color, expressive typography, rounded surfaces, and adaptive layouts. This document captures exact measurements, tokens, colors, typography, components, and interaction states for pixel-perfect implementation.

---

## 2. Color System

### 2.1 Brand & Surface Palette

| Token                    | Light Mode         | Dark Mode          |
|--------------------------|--------------------|--------------------|
| `--color-primary`        | `#01875F`          | `#00C58C`          |
| `--color-on-primary`     | `#FFFFFF`          | `#000000`          |
| `--color-secondary`      | `#0077FF`          | `#72B4FF`          |
| `--color-surface`        | `#FFFFFF`          | `#1C1B1F`          |
| `--color-surface-variant`| `#F2F2F2`          | `#2B2A30`          |
| `--color-on-surface`     | `#1C1B1F`          | `#E6E1E5`          |
| `--color-outline`        | `#CAC4D0`          | `#49454F`          |
| `--color-background`     | `#FAFAFA`          | `#141218`          |
| `--color-error`          | `#B3261E`          | `#F2B8B5`          |
| `--color-rating-star`    | `#F5A623`          | `#F5A623`          |
| `--color-badge-free`     | `#01875F`          | `#00C58C`          |
| `--color-badge-editors`  | `#0077FF`          | `#72B4FF`          |

### 2.2 Elevation Overlays (Dark Mode)

| Elevation Level | Overlay Opacity |
|-----------------|----------------|
| Level 0         | 0%             |
| Level 1         | 5%             |
| Level 2         | 8%             |
| Level 3         | 11%            |
| Level 4         | 12%            |
| Level 5         | 14%            |

---

## 3. Typography

Play Store uses **Google Sans** as the primary typeface.

### 3.1 Type Scale

| Role              | Font            | Weight | Size  | Line Height | Letter Spacing |
|-------------------|-----------------|--------|-------|-------------|----------------|
| Display Large     | Google Sans     | 400    | 57px  | 64px        | -0.25px        |
| Display Medium    | Google Sans     | 400    | 45px  | 52px        | 0px            |
| Headline Large    | Google Sans     | 400    | 32px  | 40px        | 0px            |
| Headline Medium   | Google Sans     | 400    | 28px  | 36px        | 0px            |
| Headline Small    | Google Sans     | 400    | 24px  | 32px        | 0px            |
| Title Large       | Google Sans     | 400    | 22px  | 28px        | 0px            |
| Title Medium      | Google Sans     | 500    | 16px  | 24px        | +0.15px        |
| Title Small       | Google Sans     | 500    | 14px  | 20px        | +0.1px         |
| Body Large        | Google Sans     | 400    | 16px  | 24px        | +0.5px         |
| Body Medium       | Google Sans     | 400    | 14px  | 20px        | +0.25px        |
| Body Small        | Google Sans     | 400    | 12px  | 16px        | +0.4px         |
| Label Large       | Google Sans     | 500    | 14px  | 20px        | +0.1px         |
| Label Medium      | Google Sans     | 500    | 12px  | 16px        | +0.5px         |
| Label Small       | Google Sans     | 500    | 11px  | 16px        | +0.5px         |

---

## 4. Spacing & Grid

### 4.1 Base Unit
- **Base unit**: `4px`
- All spacing, padding, margin, and radius values are multiples of 4px.

### 4.2 Layout Grid (Mobile — 360dp)

| Property        | Value  |
|-----------------|--------|
| Columns         | 4      |
| Margin          | 16px   |
| Gutter          | 8px    |
| Column width    | ~72px  |

### 4.3 Layout Grid (Tablet — 600dp+)

| Property        | Value  |
|-----------------|--------|
| Columns         | 8      |
| Margin          | 24px   |
| Gutter          | 16px   |

### 4.4 Common Spacing Tokens

| Token        | Value |
|--------------|-------|
| `space-xs`   | 4px   |
| `space-sm`   | 8px   |
| `space-md`   | 12px  |
| `space-lg`   | 16px  |
| `space-xl`   | 24px  |
| `space-2xl`  | 32px  |
| `space-3xl`  | 48px  |

---

## 5. Corner Radius (Shape Scale)

| Token             | Value  | Usage                          |
|-------------------|--------|-------------------------------|
| `radius-none`     | 0px    | Banners, dividers              |
| `radius-xs`       | 4px    | Chips (small)                  |
| `radius-sm`       | 8px    | Cards (compact), Snackbars     |
| `radius-md`       | 12px   | App icon tiles                 |
| `radius-lg`       | 16px   | Cards, Bottom sheets           |
| `radius-xl`       | 28px   | FABs, Large chips              |
| `radius-full`     | 50px   | Buttons, Pills, Badges         |
| `radius-icon`     | 20%    | App icons (squircle ~22% rounded) |

---

## 6. Iconography

| Property          | Value              |
|-------------------|--------------------|
| Icon set          | Material Symbols   |
| Style             | Rounded            |
| Default size      | 24×24px            |
| Small size        | 18×18px            |
| Large size        | 36×36px            |
| Stroke weight     | 400                |
| Optical size      | 24                 |
| Fill              | 0 (unfilled) / 1 (filled for active states) |
| Color             | Inherits `--color-on-surface` or contextual |

---

## 7. Component Specifications

---

### 7.1 App Icon Tile

```
┌─────────────────────────┐
│  ┌──────────────────┐   │
│  │                  │   │  ← Container: 80×80px, radius-icon
│  │    [App Icon]    │   │
│  │                  │   │
│  └──────────────────┘   │
│  App Name               │  ← Title Small, 14px, weight 500
│  Category               │  ← Body Small, 12px, color-outline
│  ★★★★☆ 4.2             │  ← Label Small, star color #F5A623
└─────────────────────────┘
```

| Property          | Value              |
|-------------------|--------------------|
| Icon size         | 64×64px (standard) / 80×80px (featured) |
| Tile padding      | 8px                |
| App name lines    | 1, ellipsis        |
| Tile width        | 80–100px           |
| Spacing below icon| 8px                |
| Spacing between rows | 12px            |

---

### 7.2 Featured Banner (Hero Card)

```
┌──────────────────────────────────────────────────────┐
│                                                      │  ← height: 180px mobile / 240px tablet
│                [Promotional Image]                   │  ← object-fit: cover
│                                                      │
│  ┌─────────┐                                         │
│  │App Icon │  App Name                               │  ← icon: 40×40px, radius-md
│  └─────────┘  Subtitle / Tagline                     │
└──────────────────────────────────────────────────────┘
```

| Property          | Value              |
|-------------------|--------------------|
| Width             | Full bleed (16px margin each side) |
| Height            | 180px              |
| Border radius     | 16px               |
| Image overlay     | Linear gradient bottom 40%, rgba(0,0,0,0.5) |
| App icon size     | 40×40px            |
| App icon radius   | 10px               |
| Title font        | Title Large, 22px  |
| Padding inside    | 12px               |

---

### 7.3 Install / Get Button

**Primary "Install" Button:**

| Property          | Value              |
|-------------------|--------------------|
| Height            | 40px               |
| Padding H         | 24px               |
| Border radius     | 20px (full pill)   |
| Background        | `--color-primary` `#01875F` |
| Label color       | `#FFFFFF`          |
| Label style       | Label Large, 14px, weight 500 |
| Min width         | 88px               |
| Elevation         | Level 0 (flat)     |
| Pressed state     | Darken bg by 12%   |
| Disabled          | Opacity 38%        |

**"Open" Button (already installed):**

| Property          | Value              |
|-------------------|--------------------|
| Background        | `--color-surface-variant` |
| Label color       | `--color-on-surface` |
| Style             | Tonal filled       |

---

### 7.4 Rating Bar

```
  4.5  ★★★★½
  ─────────────────────
  ████████████░░░░  5 ★   (58%)
  ████░░░░░░░░░░░░  4 ★   (21%)
  ██░░░░░░░░░░░░░░  3 ★   (10%)
  █░░░░░░░░░░░░░░░  2 ★   (5%)
  █░░░░░░░░░░░░░░░  1 ★   (6%)
  ─────────────────────
  1.2M ratings
```

| Property              | Value              |
|-----------------------|--------------------|
| Rating number font    | Display Medium, 45px |
| Star size             | 16×16px, color `#F5A623` |
| Bar height            | 4px                |
| Bar radius            | 2px                |
| Bar fill color        | `#01875F`          |
| Bar track color       | `--color-surface-variant` |
| Bar max width         | 140px (mobile)     |
| Row spacing           | 4px                |
| Label font            | Body Small, 12px   |

---

### 7.5 Screenshot Gallery

| Property          | Value              |
|-------------------|--------------------|
| Scroll            | Horizontal, snap   |
| Thumbnail height  | 320px (portrait) / 180px (landscape) |
| Thumbnail width   | Auto (aspect ratio) |
| Thumbnail radius  | 12px               |
| Gap between items | 8px                |
| Padding leading   | 16px               |
| Shadow            | 0 2px 8px rgba(0,0,0,0.12) |

---

### 7.6 Tab Bar (Apps / Games / Books)

| Property          | Value              |
|-------------------|--------------------|
| Height            | 48px               |
| Indicator         | Full-width bottom border, 3px, `--color-primary` |
| Active label      | Title Small, 14px, weight 700, primary color |
| Inactive label    | Title Small, 14px, weight 400, on-surface-variant |
| Background        | `--color-surface`  |
| Elevation         | Level 2 (scrolled) |
| Padding H         | 16px               |

---

### 7.7 Bottom Navigation Bar

| Property          | Value              |
|-------------------|--------------------|
| Height            | 56px + safe-area-inset-bottom |
| Icon size         | 24×24px            |
| Active indicator  | Pill: 64×32px, color `--color-secondary-container` |
| Active icon fill  | 1 (filled)         |
| Inactive icon fill| 0 (outlined)       |
| Label font        | Label Medium, 12px |
| Active label color| `--color-on-secondary-container` |
| Background        | `--color-surface`  |
| Elevation         | Level 2            |
| Items             | Games, Apps, Movies, Books |

---

### 7.8 Search Bar

| Property          | Value              |
|-------------------|--------------------|
| Height            | 52px               |
| Border radius     | 26px (full pill)   |
| Background        | `--color-surface-variant` |
| Leading icon      | Search, 24×24px    |
| Trailing icon     | Mic / Avatar, 24×24px |
| Placeholder       | Body Large, 16px, `--color-outline` |
| Horizontal margin | 16px               |
| Vertical margin   | 8px                |

---

### 7.9 Chips (Filter / Category)

| Property              | Value              |
|-----------------------|--------------------|
| Height                | 32px               |
| Padding H             | 12px               |
| Border radius         | 8px                |
| Font                  | Label Large, 14px  |
| **Unselected**        |                    |
| — Border              | 1px solid `--color-outline` |
| — Background          | Transparent        |
| — Text color          | `--color-on-surface` |
| **Selected**          |                    |
| — Border              | None               |
| — Background          | `--color-secondary-container` |
| — Text color          | `--color-on-secondary-container` |
| Gap between chips     | 8px                |
| Horizontal scroll     | Yes, no wrap       |

---

### 7.10 Review Card

| Property          | Value              |
|-------------------|--------------------|
| Avatar size       | 40×40px, radius-full |
| Reviewer name     | Title Small, 14px, weight 500 |
| Date              | Body Small, 12px, outline color |
| Star row          | 12×12px stars, `#F5A623` |
| Body text         | Body Medium, 14px, 3 lines collapsed |
| "More" toggle     | Label Medium, primary color |
| Card padding      | 16px               |
| Card radius       | 12px               |
| Divider           | 1px, `--color-outline`, opacity 50% |
| Helpful row       | "Was this helpful? 👍 Yes (N)" |

---

## 8. Motion & Animation

| Interaction              | Duration | Easing                     |
|--------------------------|----------|-----------------------------|
| Page transition          | 300ms    | `cubic-bezier(0.2, 0, 0, 1)` |
| Tab switch               | 200ms    | `cubic-bezier(0.4, 0, 0.2, 1)` |
| Button press ripple      | 200ms    | `linear`                   |
| Expand/collapse          | 250ms    | `cubic-bezier(0.4, 0, 0.2, 1)` |
| Snackbar enter           | 150ms    | `ease-out`                 |
| Bottom sheet slide-up    | 350ms    | `cubic-bezier(0.05, 0.7, 0.1, 1)` |
| Hero image load fade     | 300ms    | `ease-in-out`              |
| Skeleton shimmer loop    | 1500ms   | `ease-in-out`, infinite    |

---

## 9. States & Overlays

| State      | Overlay Color                | Opacity |
|------------|------------------------------|---------|
| Hover      | `--color-on-surface`         | 8%      |
| Pressed    | `--color-on-surface`         | 12%     |
| Focused    | `--color-on-surface`         | 12%     |
| Dragged    | `--color-on-surface`         | 16%     |
| Disabled   | `--color-on-surface`         | 38% (on content), 12% (on container) |

---

## 10. Elevation & Shadow

| Level | dp  | Shadow (Light Mode)                                            |
|-------|-----|----------------------------------------------------------------|
| 0     | 0   | None                                                           |
| 1     | 1   | `0 1px 2px rgba(0,0,0,0.3), 0 1px 3px 1px rgba(0,0,0,0.15)` |
| 2     | 3   | `0 1px 2px rgba(0,0,0,0.3), 0 2px 6px 2px rgba(0,0,0,0.15)` |
| 3     | 6   | `0 4px 8px 3px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.3)` |
| 4     | 8   | `0 6px 10px 4px rgba(0,0,0,0.15), 0 2px 3px rgba(0,0,0,0.3)` |
| 5     | 12  | `0 8px 12px 6px rgba(0,0,0,0.15), 0 4px 4px rgba(0,0,0,0.3)` |

---

## 11. Breakpoints

| Breakpoint  | Width     | Layout         |
|-------------|-----------|----------------|
| Compact     | < 600px   | 4-col, single pane |
| Medium      | 600–840px | 8-col, split possible |
| Expanded    | > 840px   | 12-col, multi-pane |

---

## 12. App Detail Page Layout (Mobile)

```
┌──────────────────────────────┐
│  ← Back     ⋮ Share          │  48px header
├──────────────────────────────┤
│  [App Icon 80px]             │
│  App Name (Headline Small)   │
│  Developer (Body Med, green) │
│  ★ 4.5  •  1B+  •  T (rated)│
│                              │
│  [Install]  [Wishlist ♡]     │  40px buttons
├──────────────────────────────┤
│  ← Screenshot Gallery →      │  320px height
├──────────────────────────────┤
│  About this app              │  section header
│  Description (3 lines + More)│
├──────────────────────────────┤
│  Ratings & Reviews           │
│  4.5 ★  ██████              │
│  [Review Cards]              │
├──────────────────────────────┤
│  Similar Apps                │
│  [Horizontal scroll row]     │
└──────────────────────────────┘
```

---

## 13. Assets & Resources

| Asset             | Format  | Notes                              |
|-------------------|---------|------------------------------------|
| App icon          | PNG     | 512×512px, no transparency         |
| Feature graphic   | PNG/JPG | 1024×500px                         |
| Phone screenshots | PNG/JPG | Min 320px wide, max 3840px         |
| Tablet screenshots| PNG/JPG | Min 1080px wide                    |
| Promo video       | YouTube | 30–120s, 16:9                      |

---

## 14. Accessibility

| Requirement                     | Spec                              |
|---------------------------------|-----------------------------------|
| Minimum touch target            | 48×48px                           |
| Color contrast (normal text)    | ≥ 4.5:1 (WCAG AA)                 |
| Color contrast (large text)     | ≥ 3:1                             |
| Focus indicator                 | 3px solid `--color-primary`       |
| Screen reader labels            | All interactive elements labeled  |
| Reduced motion                  | Respect `prefers-reduced-motion`  |
| Font scaling                    | Support up to 200% system font size |

---

*Specification version: Material Design 3 (2024). Measurements in dp/px (1dp = 1px at 1× density).*
