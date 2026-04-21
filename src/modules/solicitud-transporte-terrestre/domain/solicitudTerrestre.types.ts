export type SolicitudStatus = 'BORRADOR' | 'ENVIADA' | 'APROBADA' | 'RECHAZADA';
export type TipoServicio    = 'IDA' | 'IDA_Y_REGRESO';
export type TipoVehiculo    = 'AUTOMOVIL' | 'CAMIONETA' | 'BUS' | 'CAMION';

export interface PasajeroTerrestre {
  idPasajero?:     string;
  numeroPasajero?: number;
  nombre:          string;
  documento:       string;
  cargo:           string;
  telefono:        string;
}

export interface SolicitudTransporteTerrestre {
  idSolicitud?:       string;
  codigo:             string;
  fecha:              string;        // YYYY-MM-DD
  proyecto:           string;
  area:               string;
  solicitante:        string;
  status?:            SolicitudStatus;
  numeroDePPersonas?: number;        // Solo lectura, calculado por la API

  servicio: {
    tipoServicio:  TipoServicio;
    tipoVehiculo:  TipoVehiculo;
  };

  transporte: {
    origen:            string;
    destino:           string;
    fechaHoraSalida:   string;        // ISO 8601: YYYY-MM-DDTHH:mm
    fechaHoraRegreso:  string | null; // Null si tipoServicio == IDA
  };

  pasajeros: PasajeroTerrestre[];

  justificacion: {
    motivoTraslado:    string;
    relacionProyecto:  string;
  };

  aprobaciones: {
    jefeInmediato:     string;
    areaAdministrativa: string;
  };

  createdAt?: string;
  updatedAt?: string;
}
