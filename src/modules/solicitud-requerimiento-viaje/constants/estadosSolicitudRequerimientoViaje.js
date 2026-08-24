/**
 * Estados de solicitud de requerimiento (viaje administrativo).
 * Valores deben coincidir con el backend: EstadoSolicitudRequerimientoViaje.
 */
export var ESTADOS_SOL_REQU_VIAJE_OPTIONS = [
  { label: 'Revisión', value: 'REVISION', color: 'amber' },
  { label: 'Aprobación', value: 'APROBACION', color: 'positive' },
  { label: 'Rechazada', value: 'RECHAZADA', color: 'negative' }
];

export function labelEstadoSolRequiViaje (valor) {
  var v = ESTADOS_SOL_REQU_VIAJE_OPTIONS;
  var i;
  for (i = 0; i < v.length; i++) {
    if (v[i].value === valor) {
      return v[i].label;
    }
  }
  return valor || '—';
}

export function colorEstadoSolRequiViaje (valor) {
  var v = ESTADOS_SOL_REQU_VIAJE_OPTIONS;
  var i;
  for (i = 0; i < v.length; i++) {
    if (v[i].value === valor) {
      return v[i].color;
    }
  }
  return 'grey';
}
