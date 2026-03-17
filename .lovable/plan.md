

## Rediseño mobile: Separar narrativa de estados

### Problema
Los 5 pasos se presentan como accordion numerado (01-05) lo que sugiere una secuencia lineal. En realidad, los pasos 1-2 son **contexto narrativo** ("Las piezas" + "La realidad") y los pasos 3-5 son **3 estados posibles** donde te puedes encontrar. No se distingue esa estructura.

### Propuesta: Dos bloques visuales diferenciados

**Bloque A — La narrativa (pasos 1 y 2)**
- Se muestran como **contenido inline siempre visible**, no como accordion
- Paso 1: texto + imagen de pista inicio, fluye naturalmente
- Paso 2: texto + imagen, con el highlight como callout
- Sin numeración, sin botones de expandir — es storytelling puro que se lee de corrido
- Separados por un sutil divider o espaciado generoso
- Estilo: texto directo con accent color en el borde izquierdo, imagen pequeña integrada

**Bloque B — Los 3 estados (pasos 3, 4, 5)**
- Precedidos por un mini-header: "¿Dónde estás hoy?" o similar
- Se presentan como **3 cards seleccionables** (tipo toggle/accordion pero sin numeración secuencial)
- Cada card tiene un badge de estado ("Pista rota", "Pista incompleta", "Pista armada") con su color
- Solo una abierta a la vez, con imagen + body + highlight
- Progress bar solo para estos 3 (no 5)

```text
Mobile layout:

[Narrativa — siempre visible]
  ┌─ accent border ─────────────┐
  │ "Cada pieza importa."       │
  │ body text...                │
  │ [imagen pista inicio]       │
  └─────────────────────────────┘
  
  ┌─ accent border ─────────────┐
  │ "Si una pieza falla..."     │
  │ body text...                │
  │ [imagen pista marketing]    │
  │ 💬 highlight callout        │
  └─────────────────────────────┘

[Divider: "¿Dónde estás hoy?"]

[3 Estados — accordion]
  ● ● ○  (3 dots, not 5)
  
  [🔴 Pista rota        ▼]
  [🟡 Pista incompleta  ▼]  
  [🟢 Pista armada      ▼]
```

### Cambios técnicos
- **Archivo**: `src/components/landing/PistaStorySticky.tsx` — solo el bloque `lg:hidden`
- Separar `STEPS.slice(0,2)` como narrativa inline (no interactive)
- Renderizar `STEPS.slice(2)` como accordion de 3 estados
- Reemplazar progress bar de 5 segmentos por 3
- Quitar numeración "01", "02" etc. de ambos bloques
- Agregar mini-header de transición entre bloques
- Desktop (`hidden lg:grid`) queda intacto

