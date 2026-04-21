export type SolicitudStatus  = 'BORRADOR' | 'ENVIADA' | 'APROBADA' | 'RECHAZADA';
export type TipoViaje        = 'IDA' | 'IDA_Y_VUELTA';
export type ClaseVuelo       = 'ECONOMICA' | 'EJECUTIVA';

export interface Pasajero {
  idPasajero?:      string;
  numeroPasajero?:  number;
  nombre:           string;
  documento:        string;
  fechaNacimiento:  string;    // YYYY-MM-DD
  cargo:            string;
  contacto:         string;
}

export interface SolicitudTransporteAereo {
  idSolicitud?:  string;
  codigo:        string;
  fecha:         string;
  proyecto:      string;
  area:          string;
  solicitante:   string;
  status?:       SolicitudStatus;

  viaje: {
    ciudadOrigen:   string;
    ciudadDestino:  string;
    fechaSalida:    string;
    fechaRegreso:   string | null;
    tipoViaje:      TipoViaje;
  };

  pasajeros: Pasajero[];

  preferencias: {
    aerolineaPreferida:  string | null;
    horariosPreferidos:  string | null;
    claseVuelo:          ClaseVuelo;
  };

  justificacion: {
    motivoViaje:       string;
    relacionProyecto:  string;
  };

  aprobaciones: {
    jefeInmediato:     string;
    areaAdministrativa: string;
  };

  createdAt?: string;
  updatedAt?: string;
}
