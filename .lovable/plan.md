

## Navbar Flotante — Plan

El objetivo es transformar el navbar actual (barra negra de ancho completo pegada al top) en un diseño flotante como la imagen de referencia:

- **Logo** en un contenedor redondeado independiente a la izquierda
- **Links de navegación** en una "pastilla" central con fondo blanco/claro, bordes redondeados y sombra sutil
- **CTAs** (Pulso Comercial + Agendar) en otro contenedor redondeado a la derecha, con el botón "Agendar Reunión" usando el gradiente brand (rosa→violeta)
- Todo flotando sobre el hero sin fondo oscuro de ancho completo

### Cambios técnicos

**Archivo: `src/components/Navbar.tsx`**

1. **Eliminar** el fondo oscuro de ancho completo (`bg-dark-bg`, `bg-[rgba(13,13,26,0.85)]`, `border-b`)
2. **Reestructurar** el layout del nav en 3 contenedores separados con `flex` y `gap`:
   - **Logo container**: `bg-white rounded-2xl px-6 py-3 shadow-lg`
   - **Nav links container**: `bg-white rounded-full px-8 py-3 shadow-lg` — conteniendo Soluciones, Servicios, Recursos, Nosotros
   - **CTA container**: `bg-white rounded-full px-6 py-3 shadow-lg` — Pulso Comercial + botón Agendar con gradiente
3. **Colores de texto**: Cambiar de claro (blanco/muted) a oscuro (`text-gray-700`, `text-gray-900`) dentro de los contenedores blancos
4. **Dropdowns**: Mantener los dropdowns oscuros existentes (se abren debajo y ya tienen su propio fondo)
5. **Estado scroll**: Al hacer scroll, opcionalmente unificar los 3 contenedores en uno solo o agregar más opacidad/blur
6. **Botón CTA**: Cambiar texto a "AGENDAR REUNIÓN" con gradiente brand rosa→violeta y texto blanco, bordes redondeados
7. **Mobile**: Mantener el menú móvil actual sin cambios significativos, solo ajustar el botón hamburguesa

**Archivo: `src/components/Hero.tsx`**
- Reducir el `pt-[140px]` si es necesario, ya que el navbar flotante ocupa menos espacio visual

### Notas
- Los dropdowns de Soluciones y Servicios seguirán usando fondo oscuro (`dark-card`) ya que contrastan bien
- El `ChevronDown` y textos de los links pasan a color oscuro
- "Pulso Comercial" mantiene su color amarillo/dorado con el indicador pulsante

