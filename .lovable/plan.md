

## Reimaginando la sección "Según tu Rol" — Carrusel de cards grandes

### El problema actual
Las 5 cards en grid 3+2 comprimen demasiada información (título, dolor, síntomas, separador, opciones con chips) en espacios pequeños. Se siente saturado.

### Propuesta: Carrusel horizontal con cards amplias

Un carrusel con **una card visible a la vez** (o 1.2 para dar peek del siguiente), ocupando casi el ancho completo (~900px). Cada card usa un layout de **dos columnas internas**:

```text
┌─────────────────────────────────────────────────┐
│  [icono]                                        │
│  CEO / Gerente General          │  POR DÓNDE    │
│                                 │  ENTRAR:      │
│  "Pusiste piezas nuevas..."     │               │
│  (dolor en italic)              │  No sé qué    │
│                                 │  está mal →   │
│  — "Crecemos, pero..."         │  [Diagnóstico] │
│  — "No puedo predecir..."      │               │
│  — "Algo está trabado..."      │  Sé el probl.  │
│                                 │  → [RevOps]   │
│                                 │               │
│  ─── borde color del rol ───   │  Quiero esc.   │
│                                 │  → [IA Motor]  │
├─────────────────────────────────────────────────┤
│  ● ● ● ○ ○       ← →                           │
└─────────────────────────────────────────────────┘
```

**Ventajas:**
- Cada rol respira, no compite con los demás
- El layout 2 columnas separa el "problema" (izq) del "camino de entrada" (der)
- Navegación con flechas + dots + swipe en mobile
- Borde superior con el color del rol (como ya tienen)
- En mobile colapsa a 1 columna interna (dolor arriba, opciones abajo)

### Implementación técnica

1. **Usar el componente `Carousel` existente** (`src/components/ui/carousel.tsx` con Embla) — ya está en el proyecto
2. **Refactorear solo la sección de roles** en `QueHacemos.tsx` — reemplazar el grid por `Carousel > CarouselContent > CarouselItem` con flechas y dots
3. **Layout interno de cada slide**: `grid grid-cols-1 md:grid-cols-[1.2fr_1fr]` con separador vertical sutil
4. **Dots de navegación**: 5 dots con color activo = color del rol actual
5. **Autoplay opcional**: cada 6 segundos, pausa al hover
6. **La data sigue viniendo del CMS** (misma estructura `role_cards` en metadata) — no hay cambios en admin ni DB
7. **Mobile**: card full-width, 1 columna, swipe nativo de Embla

### Archivos a modificar
- `src/pages/QueHacemos.tsx` — solo la sección 4 (roles), reemplazar grid por carrusel

