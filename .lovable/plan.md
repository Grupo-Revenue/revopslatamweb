

## Diagnóstico del problema

Después de analizar el código y los múltiples intentos fallidos, el problema raíz en iOS Safari es una combinación de:

1. **`type="email"` + `checkValidity()`**: En iOS, cuando el teclado se cierra, el input puede quedar en estado inválido temporalmente, y `checkValidity()` retorna `false`, bloqueando silenciosamente el submit.
2. **`earlyEmailSubmittingRef.current` stuck**: Si un intento previo falló a medio camino, este ref puede quedar en `true` y bloquear todos los intentos siguientes.
3. **Exceso de handlers compitiendo**: `onBlur`, `onPointerDown`, `onClick`, `onSubmit` — se cancelan o interfieren entre sí en iOS.

## Plan: Reescribir el módulo de email con máxima robustez

### Cambios en `src/pages/AgenticLandingPage.tsx`

**1. Simplificar `handleEarlyEmailSave`:**
- Eliminar la lectura desde `earlyEmailInputRef.current?.value` (fuente de bugs en iOS)
- Eliminar `checkValidity()` — reemplazar con validación manual simple (contiene `@` y `.`)
- Resetear `earlyEmailSubmittingRef.current = false` al inicio si ya pasaron 3 segundos (anti-stuck)

**2. Reescribir el bloque de captura de email (líneas ~886-983):**
- Usar `<form>` nativo con botón `type="submit"` (no `type="button"`)
- Eliminar `onBlur` auto-submit (causa race conditions)
- Eliminar `onPointerDown` en el botón (no funciona en iOS)
- Usar solo dos mecanismos: `form.onSubmit` + `input.onKeyDown Enter`
- Cambiar input de `type="email"` a `type="text" inputMode="email"` para evitar que el browser bloquee por validación nativa
- Agregar un fallback: link de texto "Toca aquí si el botón no responde" que llama directamente a `handleEarlyEmailSave`

**3. Eliminar refs y timeouts innecesarios:**
- Eliminar `earlyEmailBlurTimeoutRef` y su cleanup
- Simplificar el flujo a: usuario escribe → toca submit o Enter → función se ejecuta

### Resultado esperado

El módulo de email funcionará con el mecanismo más básico y robusto del browser (native form submit), sin depender de eventos JavaScript que iOS Safari pueda interceptar.

