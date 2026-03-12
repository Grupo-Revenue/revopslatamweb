

## Plan: Mobile UX fixes — Pista Story + Navigation Menu

### Problem 1: PistaStorySticky on Mobile

Currently on mobile, the 5 steps render as tall scrolling text blocks (same as desktop but without the sticky track). When you tap a card, the dark detail panel expands far below — invisible without scrolling. The scroll-based IntersectionObserver approach doesn't translate well to mobile.

**Proposed solution — Card carousel with tabbed detail panel:**

- On mobile (`lg:hidden`), replace the scrolling layout with a **vertical card selector** (compact cards showing just eyebrow + title)
- When a card is tapped, it expands inline showing the body text, highlight, and the corresponding track image — all visible immediately below the tapped card
- The detail content uses **internal tabs**: "Situación" (body) | "Señales" (highlight/signals) | "Enfoque" (solution approach) — keeping the dark panel compact
- Track image shown small inside the expanded card, not separate
- Desktop layout remains unchanged

```text
┌─────────────────────────┐
│ ▸ Las piezas            │  ← collapsed
├─────────────────────────┤
│ ▾ La realidad      ●    │  ← active
│ ┌─────────────────────┐ │
│ │ [track img small]   │ │
│ │                     │ │
│ │ Situación|Señales   │ │  ← tabs
│ │ ─────────────────── │ │
│ │ Tab content here... │ │
│ └─────────────────────┘ │
├─────────────────────────┤
│ ▸ Pista rota            │  ← collapsed
├─────────────────────────┤
│ ▸ Pista incompleta      │
├─────────────────────────┤
│ ▸ Pista bien armada     │
└─────────────────────────┘
```

**File:** `src/components/landing/PistaStorySticky.tsx`
- Add a mobile-only accordion component rendered inside the existing `lg:hidden` block
- Each step becomes a collapsible card with the accent color border
- Expanded card shows: small track image + 2-3 tab buttons + tab content
- Only one card open at a time

---

### Problem 2: Mobile Menu Missing Service Categories

Currently the mobile menu flattens all service items via `serviciosItemsFlat`, losing the category headers ("Conoce tu pista", "Diseña y construye", "Opera tu pista", "Potencia con IA").

**Proposed solution — Grouped accordion:**

- Replace the flat `MobileSection` for "Servicios" with a **grouped version** that renders each `serviciosGroups` entry as a sub-section with its colored header
- Each group header shows the category icon + label in its brand color
- Items are indented under each group
- Groups are all visible when "Servicios" is expanded (no nested accordion needed — just visual grouping)

```text
Servicios                    ▾
  ● CONOCE TU PISTA (pink)
      RevOps Checkup
      Diagnóstico RevOps
      Motor de Ingresos
  ● DISEÑA Y CONSTRUYE (purple)
      Diseño de Procesos
      Onboarding HubSpot
      ...
  ● OPERA TU PISTA (teal)
      RevOps as a Service
      ...
  ● POTENCIA CON IA (blue)
      IA para tu Motor de Ingresos
```

**File:** `src/components/Navbar.tsx`
- Create a `MobileSectionGrouped` component that receives `serviciosGroups` directly
- Renders category headers with icon + colored label
- Items listed under each group with slight indent
- Replace line 440's `MobileSection` call for Servicios with the new grouped version

---

### Files to modify
1. `src/components/landing/PistaStorySticky.tsx` — mobile accordion with tabs
2. `src/components/Navbar.tsx` — grouped mobile services menu

