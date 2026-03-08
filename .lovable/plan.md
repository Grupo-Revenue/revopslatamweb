

## Plan: Elevar visualmente todas las páginas de servicios — nivel ClickUp/Apple

### Diagnóstico actual

Tras revisar las 15 páginas de servicio, el problema principal es claro: **las secciones de fondo blanco y #F9FAFB son visualmente planas y repetitivas**. Los orbs y dot patterns ayudan, pero no rompen la monotonía. ClickUp y Apple logran profundidad con estas técnicas que aún no usamos:

1. **Fondos con gradientes suaves entre secciones** — no solo blanco/#F9FAFB, sino transiciones de color sutiles (blanco → lila muy claro → blanco)
2. **Secciones con fondo oscuro intercaladas** — ClickUp alterna dark/light agresivamente para romper monotonía
3. **Mesh gradients y ambient color** — fondos con manchas de color sutil (no solo orbs animados, sino gradientes estáticos en secciones claras)
4. **Cards con glassmorphism en secciones claras** — no solo en oscuras
5. **Iconos con fondo gradiente** — en lugar de emojis planos, círculos con gradiente + ícono blanco
6. **Separadores visuales más ricos** — curvas SVG en lugar de solo líneas de gradiente
7. **Animated gradient borders** en hover — no solo cambio de color
8. **Noise texture overlay** — textura muy sutil que añade profundidad táctil

---

### Cambios propuestos (solo diseño, no contenido)

#### 1. Nuevo componente: `GradientMesh` — fondos con vida para secciones claras
Mancha de color estático (no animado) posicionada estratégicamente. Mucho más sutil que los orbs, pero rompe el blanco plano.
```
Secciones blancas → mesh rosa/púrpura esquina superior derecha, opacity 0.03
Secciones #F9FAFB → mesh azul/teal esquina inferior izquierda, opacity 0.04
```

#### 2. Nuevo componente: `NoiseOverlay` — textura táctil premium
Un SVG inline con `<feTurbulence>` que aplica ruido sutil (opacity ~0.02-0.03) sobre secciones para dar sensación "material" tipo Apple.

#### 3. Nuevo componente: `WaveDivider` — separador curvo SVG
Reemplaza `SectionDivider` (línea gradiente) en puntos clave con una onda SVG suave que conecta secciones de diferente color de fondo. Genera la sensación de "flujo" tipo ClickUp.

#### 4. Nuevo componente: `GradientIcon` — iconos profesionales
Reemplaza los emojis (⚙️📣🔧🤝📊🧠) con Lucide icons dentro de un círculo con fondo gradiente marca. Mucho más premium y consistente.

#### 5. Actualizar `ServiceCard` — nuevas variantes
- Variante `elevated`: fondo blanco, shadow más dramático por defecto, hover con animated gradient border (pseudo-element con `conic-gradient` girando)
- Los cards en secciones claras pierden el borde gris plano → pasan a `box-shadow` sin border visible

#### 6. Secciones oscuras intercaladas
Varias secciones que hoy son blancas/#F9FAFB se convertirán en secciones con fondo `#1A1A2E` o gradiente oscuro, con texto blanco y glassmorphism cards. Esto rompe la monotonía drásticamente. Criterio: al menos 1 sección oscura entre el hero y el CTA final en cada página.

#### 7. Actualizar `SectionHeading` — más expresivo
- Opción de `highlight`: una palabra del título con `text-gradient-brand` 
- Subtítulos con `max-width` más generoso (620px)
- Línea decorativa sutil debajo del badge

#### 8. CTAs finales con mesh gradient background
En lugar del fondo blanco plano actual en muchos CTA finales, fondo oscuro con mesh + partículas (como ya tiene PotenciaConIA).

#### 9. Hover states más dramáticos en cards
- `translateY(-8px)` (hoy es -4/-6px)
- Shadow color tinted (rosa sutil, no gris)
- Border que transiciona a gradiente

---

### Archivos a crear

| Archivo | Propósito |
|---|---|
| `src/components/services/GradientMesh.tsx` | Mancha de color sutil para fondos claros |
| `src/components/services/NoiseOverlay.tsx` | Textura SVG noise premium |
| `src/components/services/WaveDivider.tsx` | Separador curvo SVG entre secciones |
| `src/components/services/GradientIcon.tsx` | Ícono Lucide en círculo gradiente |

### Archivos a modificar

| Archivo | Cambios |
|---|---|
| `ServiceCard.tsx` | Nueva variante `elevated`, hover más dramático, tinted shadows |
| `SectionHeading.tsx` | Soporte para `highlight` word, línea decorativa |
| `SectionDivider.tsx` | Mantener pero usar menos (reemplazar con WaveDivider en puntos clave) |
| **15 páginas de servicio** | Aplicar GradientMesh, NoiseOverlay, WaveDivider, GradientIcon, convertir secciones a dark donde aplique, actualizar emojis → GradientIcon |

### Páginas afectadas (15)
`RevOpsAsAService`, `MarketingOps`, `SoporteHubspot`, `PotenciaConIA`, `DisenoDeProcesos`, `OnboardingHubspot`, `ImplementacionHubspot`, `PersonalizacionCRM`, `IntegracionesDesarrollo`, `ConoceTuPista`, `DisenaYConstruye`, `OperaTuPista`, `RevOpsCheckup`, `DiagnosticoRevOps`, `MotorDeIngresos`

Dado el volumen, la implementación se hará en fases: primero crear los 4 componentes nuevos + actualizar los 2 existentes, luego aplicar página por página.

