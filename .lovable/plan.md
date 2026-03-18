

## Rediseño Sección Posicionamiento — Premium & Tabla Protagonista

### Problema actual
La sección tiene 3 bloques compitiendo por atención (título largo, dos párrafos de copy, callout + tabla comparativa pequeña). La tabla — que es el asset más diferenciador — queda relegada y comprimida.

### Dirección del rediseño

**Invertir la jerarquía**: La tabla comparativa debe ser el elemento protagonista, no un complemento lateral.

### Estructura propuesta

```text
┌─────────────────────────────────────────────────────┐
│  EYEBROW (gradiente)                                │
│  "POR QUÉ SOMOS DIFERENTES"                        │
│                                                     │
│  H2 (centrado, max-width ~700px)                    │
│  "Ser partner de HubSpot no nos hace buenos.        │
│   Saber operar el negocio detrás de la              │
│   herramienta, sí."                                 │
│                                                     │
│  Subtítulo (1 párrafo corto, centrado)              │
│  Condensar los 2 párrafos actuales en 1-2 líneas    │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │  TABLA COMPARATIVA — FULL WIDTH             │    │
│  │  Grande, con padding generoso, filas altas  │    │
│  │  Agencia HubSpot  vs  RevOps LATAM          │    │
│  │  (6 filas con hover sutil por fila)         │    │
│  │  RevOps col: texto bold gradiente + ✓       │    │
│  │  Agency col: texto tenue                    │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  Callout (centrado, debajo de la tabla)             │
│  Borde izquierdo gradiente, max-width ~700px        │
└─────────────────────────────────────────────────────┘
```

### Cambios técnicos en `HubspotPartnerChile.tsx`

1. **Layout**: Cambiar de `grid 55%/45%` a layout centrado single-column (max-width 900px)
2. **Copy**: Reducir los 2 párrafos a 1 subtítulo corto debajo del H2
3. **Tabla**: Expandirla a ancho completo (~800px), con filas más altas (padding 20px), tipografía más grande (16px), hover por fila con highlight sutil
4. **Encabezados de tabla**: "Agencia HubSpot" y "RevOps LATAM" más prominentes, con el header de RevOps usando el gradiente de marca
5. **Callout**: Moverlo debajo de la tabla, centrado, como remate
6. **Eyebrow**: Agregar tag superior "POR QUÉ SOMOS DIFERENTES" en gradiente
7. **Animación**: Stagger las filas de la tabla con fade-in secuencial (delay 0.05s por fila)

### Estilo premium
- Fondo blanco limpio
- Tabla con bordes sutiles `#F3F4F6`, esquinas redondeadas `20px`
- Hover por fila: `background rgba(190,24,105,0.02)`
- Columna RevOps con check icons y texto en gradiente bold
- Columna Agency con texto `#9CA3AF` (tenue, segundo plano)
- Sombra suave en el contenedor de la tabla `0 20px 60px rgba(0,0,0,0.06)`

