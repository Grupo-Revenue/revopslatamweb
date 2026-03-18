

## Mobile UX fixes for /hubspot-partner-chile

### Problems identified

1. **Timeline line in "Nuestra forma de implementar"** (line 504): A 3px gradient vertical line connects the numbered circles on mobile. It extends beyond the cards and looks like a visual artifact.
2. **Comparison table too cramped** (lines 386-447): The 3-column grid `[1.2fr_1fr_1fr]` squeezes "Aspecto", "Agencia HubSpot", and "Revops LATAM" into 390px, making text wrap excessively and feel unreadable.
3. **General mobile spacing**: Several sections use desktop-oriented padding and font sizes that don't adapt well.

### Plan

**1. Redesign comparison table for mobile**
- On mobile, switch from a 3-column table to a **stacked card layout**: each row becomes its own card showing the aspect label as a header, then two side-by-side values ("Agencia" vs "Revops LATAM").
- Keep the current 3-column table for `md:` and above.
- This eliminates the cramped text issue entirely.

**2. Fix timeline vertical line on mobile**
- Remove or hide the vertical connecting line on mobile (the `lg:hidden` line at line 504 that draws between steps).
- Instead, rely on spacing alone to show sequence — the numbered circles already communicate order.

**3. General mobile polish across all sections**
- Hero: show the dashboard image on mobile too (currently `hidden lg:flex`) at a smaller scale below the CTAs.
- Ecosistema hub cards: reduce padding on mobile.
- FAQ: ensure text doesn't overflow on small screens.
- CTA Final: reduce title font size on mobile.
- Posicionamiento title: remove `whitespace-pre-line` on mobile so text wraps naturally.

### Files to edit
- `src/pages/HubspotPartnerChile.tsx` — all changes in this single file

