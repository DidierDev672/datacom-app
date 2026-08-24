# Solicitud de requerimiento de viaje — Vista `SolicitudRequerimientoViajeView`

**Propósito declarado.** Esta pantalla permite registrar una requisición de transporte y viaje administrativo. **Al guardar**, el sistema asigna un **código único** con prefijo `SRV-…` y deja el trámite en estado **Revisión** (`REVISION`).

| Resultado inmediato al guardar | Navegación lateral |
| --- | --- |
| Código automático (`SRV-…`) y estado **Revisión** | Acceso directo al **listado** de solicitudes (ruta con nombre `lista-solicitud-requerimiento-viaje`) |

---

## 1. Rol del componente en la interfaz

La vista actúa como **contenedor de página**: fija el ancho máximo de lectura, presenta el **encabezado contextual** y renderiza el formulario funcional `SolicitudRequerimientoViajeForm`. No contiene la lógica de validación ni el envío al servidor; delega el estado y las acciones al almacén Pinia `useSolicitudRequerimientoViajeStore`.

---

## 2. Estructura visible para el usuario

```
Título principal + descripción breve          [Botón: Ver listado]
────────────────────────────────────────────────────────────────────
Bloques del formulario (tarjetas): solicitante → motivo/fechas → ida → regreso → recogida regreso → proyecto/observaciones → acciones
```

**Lectura recomendada (patrón Z).** Inicie por el título superior izquierdo; continúe en horizontal hacia **Ver listado**; descienda por el margen izquierdo siguiendo el orden de las tarjetas del formulario, que replica la secuencia natural del desplazamiento (quién solicita → por qué y cuándo → trayecto → cierre administrativo).

---

## 3. Secciones del formulario asociado

Cada bloque agrupa campos obligatorios salvo donde se indique lo contrario.

### 3.1 Datos del solicitante

| Campo | Tipo | Obligatorio | Nota |
| --- | --- | --- | --- |
| Fecha de solicitud | Fecha (`YYYY-MM-DD`) | Sí | Valor inicial sugerido: fecha del día. |
| Nombre del empleado / contratista | Texto | Sí | Hasta 200 caracteres. |
| Cédula | Texto | Sí | Hasta 32 caracteres. |
| Correo electrónico | Correo | Sí | Validación de formato. |
| Celular | Texto | Sí | Hasta 32 caracteres. |

### 3.2 Motivo y fechas del viaje

| Campo | Tipo | Obligatorio | Nota |
| --- | --- | --- | --- |
| Motivo del viaje | Texto largo | Sí | Hasta 500 caracteres; propósito del desplazamiento. |
| Fecha de viaje (ida) | Fecha | Sí | No puede ser posterior a la fecha de regreso. |
| Fecha de regreso | Fecha | Sí | No puede ser anterior a la ida. |
| Tipo de transporte | Lista | Sí | Valores de interfaz: **Terrestre** (`TERRESTRE`), **Aéreo** (`AEREO`). |

### 3.3 Ida

| Campo | Tipo | Obligatorio |
| --- | --- | --- |
| Lugar de recogida | Texto (300) | Sí |
| Horario sugerido (ida) | Hora | Sí |
| Ruta de ida | Texto largo (500) | Sí |

### 3.4 Regreso (trayectos)

| Campo | Tipo | Obligatorio |
| --- | --- | --- |
| Ruta de regreso | Texto largo (500) | Sí |
| Ruta de vuelta | Texto largo (500) | Sí |
| Pernoctan | Sí / No | Sí (interruptor) |

### 3.5 Regreso — recogida

| Campo | Tipo | Obligatorio |
| --- | --- | --- |
| Lugar de recogida (regreso) | Texto (300) | Sí |
| Horario sugerido regreso | Hora | Sí |

### 3.6 Proyecto y observaciones

| Campo | Tipo | Obligatorio |
| --- | --- | --- |
| Proyecto o centro de costo | Texto (300) | Sí |
| Observaciones | Texto largo (2000) | No |

**Acciones finales.** **Limpiar** restablece el formulario y la validación. **Guardar solicitud** envía el payload al servidor mediante `POST` a la colección de solicitudes de requerimiento de viaje.

---

## 4. Estados del flujo posterior al registro

El registro creado desde esta pantalla inicia en **Revisión**. Los estados previstos en la aplicación (coincidentes con el dominio del servicio) son:

| Etiqueta mostrada | Valor técnico |
| --- | --- |
| Revisión | `REVISION` |
| Aprobación | `APROBACION` |
| Rechazada | `RECHAZADA` |

La transición entre estados posteriores se gestiona fuera de este formulario de alta (por ejemplo, desde el listado u otras vistas de trabajo).

---

## 5. Persistencia técnica (referencia)

- **Creación:** `POST /api/v1/solicitudes-requerimiento-viaje`  
- El cuerpo del mensaje reproduce los nombres de propiedad del formulario normalizado en el almacén (`guardar`).  
- El servidor devuelve al menos `id` y `codigo` (el prefijo `SRV-` forma parte del código conforme a la regla de negocio implementada en servidor).

---

## 6. Ejemplo ilustrativo de una requisición

El siguiente objeto **no** constituye un registro real; sirve únicamente para comprender la forma del mensaje enviado al crear una solicitud.

```json
{
  "fechaSolicitud": "2026-05-14",
  "nombreEmpleado": "María Fernanda López Ruiz",
  "cedula": "52889123",
  "correoElectronico": "m.lopezruiz@empresa.com.co",
  "celular": "+57 320 555 0198",
  "motivoViaje": "Asistencia a reunión técnica de seguimiento del contrato de obra civil en instalación minera; se requiere coordinación presencial con interventoría y contratista.",
  "fechaViajeIda": "2026-05-20",
  "fechaRegreso": "2026-05-22",
  "lugarRecogida": "Sede principal — Módulo de recepción, portería norte",
  "horarioSugeridoIda": "07:00",
  "rutaIda": "Medellín → El Carmen de Viboral → Puerto exterior de carga. Salida consolidada con ruta interna conocida por seguridad industrial.",
  "rutaRegreso": "Misma ruta en sentido inverso; llegada estimada a sede previa confirmación por despacho.",
  "rutaVuelta": "Retorno programado vía intermunicipal con escala logística en punto de control; sin desvíos no autorizados.",
  "pernoctan": true,
  "tipoTransporte": "TERRESTRE",
  "lugarRecogidaRegreso": "Campamento temporal — Módulo H, frente a comedor central",
  "horarioSugeridoRegreso": "17:30",
  "proyectoCentroCosto": "PRY-INF-2024-08 — Infraestructura y mantenimiento de faenas",
  "observaciones": "Se solicita vehículo con capacidad para equipos de medición; confirmar disponibilidad de chaleco reflectivo y EPP para acompañantes."
}
```

**Respuesta esperada (ilustrativa).** Tras una creación satisfactoria, el cliente conserva en almacén `ultimoCodigoGenerado` y `ultimoIdCreado`; la interfaz muestra un diálogo con el código asignado y reitera el estado **Revisión**.

---

## 7. Relación entre archivos

| Elemento | Ubicación |
| --- | --- |
| Vista actual | `ui/views/SolicitudRequerimientoViajeView.vue` |
| Formulario embebido | `ui/components/SolicitudRequerimientoViajeForm.vue` |
| Estado y envío | `ui/store/useSolicitudRequerimientoViajeStore.js` |
| Cliente HTTP | `api/solicitudRequerimientoViaje.api.js` |
| Constantes de estado | `constants/estadosSolicitudRequerimientoViaje.js` |

*Documento generado para lectura declarativa y escaneo rápido; debe actualizarse si el formulario o el contrato de API cambian.*
