

## Plan: Elevar las páginas de servicios a nivel premium

### Diagnóstico

Después de revisar las 4 páginas de servicios y compararlas con el estilo ClickUp, identifico estos problemas de diseño:

1. **Tipografía inconsistente** — Los H2 varían entre `text-2xl`, `text-3xl`, `text-4xl` y valores `clamp()` diferentes en cada página. No hay escala unificada.

2. **Secciones planas y densas** — Las secciones son cajas de texto sin profundidad visual. Faltan orbs, gradientes de fondo, patrones sutiles. El Hero del homepage los tiene, pero las páginas de servicios no.

3. **Cards genéricas** — Todas son "caja blanca + border gris + texto". Sin variación de profundidad, sin gradientes sutiles de fondo, sin glow en hover.

4. **Sin transiciones entre secciones** — Las secciones se apilan sin ningún elemento visual que las separe (ClickUp usa gradientes suaves, curvas SVG, o cambios de profundidad).

5. **CTAs sin presencia** — Botones planos sin sombra ni glow. ClickUp usa sombras coloreadas y efectos hover más dramáticos.

6. **Código duplicado** — `ChipLink`, `useCounter`, `PlanCard`, `ForWhomSection` se repiten en cada archivo.

7. **Spacing conservador** — Padding de secciones y gaps entre elementos son más ajustados de lo que debería ser una página premium.

---

### Solución: 9 mejoras aplicadas a las 4 páginas

#### 1. Extraer componentes compartidos
Crear `src/components/services/` con:
- `ServiceHero` — Hero reutilizable con orbs, breadcrumb, badge, split layout
- `SectionHeading` — H2 + subtítulo con escala tipográfica consistente (`clamp(28px, 4vw, 42px)`)
- `ServiceCard` — Card con variantes (default, featured, glass-dark)
- `ForWhomSection` — Componente unificado para "Es para ti si / No es para ti si"
- `ChipLink` — Ya existe duplicado, extraerlo
- `useCounter` — Hook compartido
- `SectionDivider` — Gradiente sutil o curva SVG entre secciones
- `BackgroundOrbs` — Orbs reutilizables para secciones oscuras
- `DotPattern` — Patrón de puntos sutil para secciones claras

#### 2. Heroes con profundidad visual
- Agregar **orbs de gradiente con blur** (como el Hero del homepage) a todos los heroes de servicio
- Patrón sutil de puntos o grid en `opacity: 0.03` sobre fondos oscuros
- Glow detrás del componente visual derecho (timeline, funnel, feed)

#### 3. Escala tipográfica unificada
- H2 de sección: `clamp(28px, 4vw, 42px)` (actualmente varía entre 24px-40px)
- Subtítulos: `18px` consistente
- Body: `16px` con `leading-relaxed`
- Labels/badges: `12px uppercase tracking-wide`

#### 4. Cards premium
- **Secciones claras**: border sutil + `box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)` por defecto, hover con elevación y shadow más profundo
- **Secciones oscuras**: glassmorphism (`backdrop-blur`, `bg-white/[0.04]`, `border-white/[0.08]`)
- Cards de pricing: agregar un gradient glow sutil detrás de la card featured

#### 5. Transiciones entre secciones
- Agregar un componente `SectionDivider`: un `div` de `2px` con gradiente marca a `opacity: 0.1` entre secciones, o un fade de color entre backgrounds

#### 6. CTAs con presencia
- Botones primarios: agregar `box-shadow: 0 4px 20px rgba(190,24,105,0.35)` + hover con `shadow: 0 8px 32px rgba(190,24,105,0.5)` y `scale(1.03)`
- Botones outline: hover con border gradiente + text gradiente

#### 7. Spacing generoso
- Padding de secciones: subir de `80-100px` a `100-120px` vertical
- Gap entre cards: subir de `gap-6` a `gap-8`
- Max-width de contenido: unificar a `1100px` (algunas usan 800px, 900px, 1000px de forma inconsistente)

#### 8. Backgrounds con vida
- Secciones `#F9FAFB`: agregar patrón de puntos sutil (`radial-gradient` repetido) con `opacity: 0.4`
- Secciones oscuras: radial gradients de marca muy sutiles como ambient light
- "Para quién es": fondo con gradiente muy sutil diagonal

#### 9. Micro-interacciones mejoradas
- Cards de equipo/operación: hover con `translateY(-6px)` + border gradiente + shadow
- Tags/chips de cobertura: hover con background gradiente + text white (más dramático que solo border)
- Líneas de timeline/proceso: mayor grosor (3px), con glow sutil

---

### Archivos a crear/modificar

**Crear:**
- `src/components/services/ServiceHero.tsx`
- `src/components/services/SectionHeading.tsx`
- `src/components/services/ServiceCard.tsx`
- `src/components/services/ForWhomSection.tsx`
- `src/components/services/ChipLink.tsx`
- `src/components/services/SectionDivider.tsx`
- `src/components/services/BackgroundOrbs.tsx`
- `src/components/services/DotPattern.tsx`
- `src/hooks/useAnimatedCounter.ts`

**Modificar:**
- `src/pages/RevOpsAsAService.tsx` — Refactorizar usando componentes compartidos + mejoras visuales
- `src/pages/MarketingOps.tsx` — Idem
- `src/pages/SoporteHubspot.tsx` — Idem
- `src/pages/PotenciaConIA.tsx` — Idem

No se modifica: navbar, footer, diseño global, ni contenido de texto.

