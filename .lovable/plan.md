

## Rediseñar Hub Cards en mobile: checklist compacto

En mobile (< md), las cards actuales muestran badge + icono + título + tag "Ideal para…", ocupando demasiado espacio vertical. La propuesta es reemplazar el grid de cards en mobile por un **checklist compacto**: una lista vertical donde cada Hub es una fila con un check gradient, el nombre del Hub en bold, y una descripción breve de una línea.

### Cambios en `src/pages/HubspotPartnerChile.tsx`

**Mobile (< md):** Reemplazar el grid de cards por una lista tipo checklist:
```
✓ Marketing Hub — Genera demanda y demuestra impacto en pipeline
✓ Sales Hub — Pipeline claro, forecast confiable
✓ Service Hub — Retención, NPS y alertas de churn
✓ Operations Hub — Datos limpios, integraciones sincronizadas
✓ Content Hub — Sitio web y SEO integrado al CRM
```

Cada ítem usa el círculo gradient con check (mismo estilo que ForWhomSection), el título en bold con el color del badge, y una descripción corta (extraída/resumida del `desc` actual). Se elimina el tag "Ideal para…" en mobile.

**Desktop (md+):** Sin cambios, se mantienen las cards actuales.

### Implementación

1. Agregar un array `shortDesc` a cada hub en los datos (o derivarlo inline)
2. Envolver el grid actual con `hidden md:block` (ya parcialmente hecho)
3. Agregar un bloque `md:hidden` con la lista checklist: `ul` con `space-y-4`, cada `li` con flex, check icon gradient, título bold + dash + descripción corta

