

## Plan: Animacion "scan/encendido" en la imagen del Hero

Entiendo perfectamente lo que describes: un efecto donde la imagen aparece progresivamente de arriba hacia abajo, como si los colores se fueran "encendiendo" o revelando con un barrido vertical luminoso.

### Enfoque tecnico

Usar un **clip-path animado con Framer Motion** combinado con un **resplandor de borde (glow line)** que baja mientras revela la imagen:

1. **Clip-path reveal**: La imagen inicia con `clipPath: inset(100% 0 0 0)` (completamente oculta) y anima hacia `inset(0% 0 0 0)` (completamente visible). Esto crea el efecto de revelado de arriba hacia abajo.

2. **Linea de escaneo luminosa**: Un `div` superpuesto con un gradiente horizontal brillante (usando los colores de marca: rosa, morado, azul) que se desplaza de arriba hacia abajo al mismo ritmo que el clip-path. Esto simula el efecto de "encendido" de colores.

3. **Glow post-reveal**: Una vez completada la animacion, un sutil resplandor de los colores de marca queda como halo alrededor de la imagen.

### Cambios en archivos

**`src/components/Hero.tsx`** (unico archivo a modificar):

- Reemplazar el `motion.div` actual que envuelve la imagen del hero (lineas 87-98)
- Agregar un contenedor con `overflow: hidden` y `position: relative`
- La imagen usa `motion.img` con animacion de `clipPath` via Framer Motion
- Superponer un `motion.div` como linea de escaneo con gradiente `linear-gradient(90deg, transparent, rgba(190,24,105,0.6), rgba(98,36,190,0.6), rgba(7,121,215,0.6), transparent)` que se mueve de `top: 0%` a `top: 100%`
- Duracion total: ~1.5s con delay de 0.5s (sincronizado con la aparicion del texto)
- La linea de escaneo desaparece con fade-out al llegar al final

```text
Estructura visual:

  ┌─────────────────┐
  │ ═══ glow line ══│  ← baja progresivamente
  │ ████ revealed ██│
  │                 │  ← parte aun oculta (clip-path)
  │                 │
  └─────────────────┘
```

No se necesitan dependencias adicionales; Framer Motion ya soporta `clipPath` como propiedad animable.

