

## Diagnóstico del salto visual al pasar a la agenda

**Causa raíz**: Cuando la conversación pasa de Screen 4 (chat) a Screen 5 (availability), `AnimatePresence mode="wait"` detecta un cambio de `key` (`"chat"` → `"s5-avail"`). Esto causa:

1. Screen 4 se anima hacia afuera (fade out + slide down)
2. Screen 5 se anima hacia adentro (fade in + slide up)
3. Screen 5 re-renderiza TODOS los mensajes desde el inicio del array `messages`
4. El scroll se reinicia al tope, mostrando los primeros mensajes antes de que el usuario pueda ver los horarios al final

El usuario percibe que "la conversación retrocede" porque literalmente ve los mensajes antiguos aparecer de nuevo desde arriba.

---

## Plan: Continuidad visual entre chat y agenda

### Cambio 1: Unificar screens 1-5 bajo el mismo key de AnimatePresence

En lugar de cambiar el `key` de `"chat"` a `"s5-avail"`, hacer que los screens 1-5 compartan el mismo `key` para que AnimatePresence NO haga exit/enter. La transición sería interna (solo se agrega contenido al final del scroll).

- Modificar el `switch` para que `case 5` (cuando es calificado) use el mismo `key="chat"` que los screens 1-4
- Así los mensajes anteriores permanecen en su lugar y los slots de horarios simplemente aparecen al final del scroll, como un mensaje más

### Cambio 2: Auto-scroll al contenido nuevo

- Después de que los slots de disponibilidad se cargan, hacer scroll automático al final para que el usuario vea los horarios sin tener que scrollear manualmente
- Usar el `messagesEndRef` existente con `scrollIntoView({ behavior: 'smooth' })`

### Cambio 3: Mostrar solo los últimos mensajes relevantes antes de los slots

- En lugar de re-renderizar todo el historial con animaciones, mostrar los mensajes sin animación de entrada (ya que el usuario ya los vio) y animar solo el contenido nuevo (los slots de disponibilidad)

### Resultado esperado

Cuando Lidia dice "¿Qué día y hora te acomoda?", los botones de días aparecen suavemente debajo de ese mensaje, como si fueran parte natural de la conversación. Sin fade out/in, sin salto de scroll, sin cambio de fondo.

---

### Detalle técnico

**Archivo**: `src/pages/AgenticLandingPage.tsx`

1. En el `renderScreen()`, fusionar el case 5 (calificado) dentro del case 1-4, extendiendo el chat existente con los slots al final
2. Mantener el case 5 separado solo para `nurturing` (no_calificado)
3. Cambiar el key del motion.div de screen 5 availability de `"s5-avail"` a `"chat"` para evitar la re-animación

