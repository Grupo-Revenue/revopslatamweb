

## Simplificar Hub Cards en mobile

La imagen muestra las cards del ecosistema HubSpot ocupando mucho espacio vertical en mobile por las descripciones largas. Coincido en ocultarlas en mobile — el badge, icono, título y tag ya comunican suficiente.

### Cambio

**Archivo:** `src/pages/HubspotPartnerChile.tsx` (línea ~521)

Envolver el párrafo de descripción (`<p>...{card.desc}</p>`) con la clase `hidden md:block` para ocultarlo en pantallas < 768px. Las cards quedarán mucho más compactas: badge → icono → título → tag.

Opcionalmente reducir el `gap` del grid en mobile de `gap-6` a `gap-4` para aprovechar mejor el espacio.

