<template>
  <q-dialog v-model="show" persistent full-width>
    <q-card class="premium-detail-card reveal-animation">
      <!-- HEADER -->
      <q-card-section class="row items-center header-section">
        <div class="row items-center q-gutter-md">
          <div class="icon-box">
            <q-icon name="airplane_ticket" size="32px" class="text-primary-gradient" />
          </div>
          <div>
            <div class="text-caption text-grey-7 text-uppercase letter-spacing-1">Detalle de Solicitud</div>
            <h2 class="main-title q-my-none">{{ solicitud.codigo || 'S-0000' }}</h2>
          </div>
          <q-chip
            v-if="solicitud.status"
            :style="{ backgroundColor: getStatusColor(solicitud.status) + '20', color: getStatusColor(solicitud.status) }"
            class="status-badge text-weight-bold"
          >
            <q-badge rounded :style="{ backgroundColor: getStatusColor(solicitud.status) }" class="q-mr-xs" />
            {{ solicitud.status }}
          </q-chip>
        </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup class="close-btn" />
      </q-card-section>

      <q-separator />

      <!-- CONTENT -->
      <q-card-section class="content-scroll q-pa-xl">
        <div class="row q-col-gutter-xl">
          
          <!-- LEFT COLUMN: Info & Flight -->
          <div class="col-12 col-md-7">
            <!-- 1. Información de Identificación -->
            <div class="info-group q-mb-xl">
              <h3 class="group-title"><q-icon name="person_outline" size="24px" class="q-mr-sm" />Información del Solicitante</h3>
              <q-card flat class="bg-grey-1 border-radius-lg q-pa-lg">
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-sm-6">
                    <div class="field-label">Colaborador</div>
                    <div class="field-value text-weight-bold">{{ solicitud.solicitante }}</div>
                  </div>
                  <div class="col-12 col-sm-6">
                    <div class="field-label">Área / Dependencia</div>
                    <div class="field-value">{{ solicitud.area }}</div>
                  </div>
                  <div class="col-12 col-sm-6">
                    <div class="field-label">Proyecto / Centro de Costo</div>
                    <div class="field-value">{{ solicitud.proyecto }}</div>
                  </div>
                  <div class="col-12 col-sm-6">
                    <div class="field-label">Fecha Solicitud</div>
                    <div class="field-value">{{ solicitud.fecha }}</div>
                  </div>
                </div>
              </q-card>
            </div>

            <!-- 2. Detalles del Viaje -->
            <div class="info-group q-mb-xl" v-if="solicitud.viaje">
              <h3 class="group-title"><q-icon name="flight_takeoff" size="24px" class="q-mr-sm" />Itinerario de Vuelo</h3>
              <q-card flat bordered class="border-radius-lg q-pa-lg travel-itinerary">
                <div class="row items-center justify-between q-mb-lg">
                  <div class="text-center">
                    <div class="text-h4 text-weight-bolder text-primary q-mb-xs">
                      {{ solicitud.viaje.ciudadOrigen ? solicitud.viaje.ciudadOrigen.substring(0,3).toUpperCase() : '---' }}
                    </div>
                    <div class="text-caption text-grey-7">{{ solicitud.viaje.ciudadOrigen }}</div>
                  </div>
                  <div class="col text-center flight-path-container">
                    <div class="flight-type text-caption text-weight-bold text-grey-6">{{ solicitud.viaje.tipoViaje }}</div>
                    <div class="path-line">
                      <q-icon name="flight" class="plane-icon" />
                    </div>
                  </div>
                  <div class="text-center">
                    <div class="text-h4 text-weight-bolder text-primary q-mb-xs">
                      {{ solicitud.viaje.ciudadDestino ? solicitud.viaje.ciudadDestino.substring(0,3).toUpperCase() : '---' }}
                    </div>
                    <div class="text-caption text-grey-7">{{ solicitud.viaje.ciudadDestino }}</div>
                  </div>
                </div>
                <div class="row q-col-gutter-md border-top q-pt-md">
                  <div class="col-12 col-sm-6">
                    <div class="field-label">Salida Estimada</div>
                    <div class="field-value"><q-icon name="event" class="q-mr-xs" />{{ solicitud.viaje.fechaSalida }}</div>
                  </div>
                  <div class="col-12 col-sm-6" v-if="solicitud.viaje.tipoViaje !== 'SOLO_IDA'">
                    <div class="field-label">Regreso Estimado</div>
                    <div class="field-value"><q-icon name="event" class="q-mr-xs" />{{ solicitud.viaje.fechaRegreso }}</div>
                  </div>
                </div>
              </q-card>
            </div>

            <!-- 3. Pasajeros -->
            <div class="info-group">
              <h3 class="group-title"><q-icon name="group" size="24px" class="q-mr-sm" />Lista de Pasajeros</h3>
              <q-table
                :data="solicitud.pasajeros || []"
                :columns="passengerColumns"
                row-key="documento"
                flat
                bordered
                hide-bottom
                class="passenger-table shadow-sm border-radius-lg"
              >
                <template v-slot:body-cell-nombre="props">
                  <q-td :props="props">
                    <div class="text-weight-medium">{{ props.value }}</div>
                    <div class="text-caption text-grey-6">{{ props.row.cargo }}</div>
                  </q-td>
                </template>
              </q-table>
            </div>
          </div>

          <!-- RIGHT COLUMN: Preferences & Justification -->
          <div class="col-12 col-md-5">
            <!-- 4. Preferencias -->
            <div class="info-group q-mb-xl" v-if="solicitud.preferencias">
              <h3 class="group-title"><q-icon name="settings_suggest" size="24px" class="q-mr-sm" />Preferencias de Vuelo</h3>
              <q-card flat bordered class="border-radius-lg bg-indigo-1 border-indigo-2">
                <q-card-section>
                  <div class="row q-col-gutter-y-lg">
                    <div class="col-12">
                      <div class="field-label text-indigo-7">Clase de Vuelo</div>
                      <q-chip color="indigo" text-color="white" icon="airline_seat_recline_extra" class="q-ml-none">
                        {{ solicitud.preferencias.claseVuelo }}
                      </q-chip>
                    </div>
                    <div class="col-12">
                      <div class="field-label text-indigo-7">Aerolínea Preferida</div>
                      <div class="field-value text-indigo-9">{{ solicitud.preferencias.aerolineaPreferida || 'Sin preferencia específica' }}</div>
                    </div>
                    <div class="col-12" v-if="solicitud.preferencias.horariosPreferidos">
                      <div class="field-label text-indigo-7">Horarios de Interés</div>
                      <div class="field-value text-indigo-9">{{ solicitud.preferencias.horariosPreferidos }}</div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <!-- 5. Justificación -->
            <div class="info-group q-mb-xl" v-if="solicitud.justificacion">
              <h3 class="group-title"><q-icon name="format_align_left" size="24px" class="q-mr-sm" />Justificación Comercial</h3>
              <q-card flat bordered class="border-radius-lg q-pa-lg bg-grey-1 shadow-inner">
                <div class="field-label">Motivo del Viaje</div>
                <p class="justification-text q-mb-lg">{{ solicitud.justificacion.motivoViaje }}</p>
                
                <q-separator class="q-my-md" />
                
                <div class="field-label">Relación con el Proyecto</div>
                <p class="justification-text">{{ solicitud.justificacion.relacionProyecto }}</p>
              </q-card>
            </div>

            <!-- 6. Aprobaciones (Summary) -->
            <div class="info-group" v-if="solicitud.aprobaciones">
              <h3 class="group-title"><q-icon name="verified_user" size="24px" class="q-mr-sm" />Flujo de Aprobación</h3>
              <q-list bordered separator class="border-radius-lg bg-white shadow-sm">
                <q-item>
                  <q-item-section avatar>
                    <q-icon name="how_to_reg" color="blue" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-medium">Jefe Inmediato</q-item-label>
                    <q-item-label caption>{{ solicitud.aprobaciones.jefeInmediato || 'Pendiente por definir' }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section avatar>
                    <q-icon name="admin_panel_settings" color="blue" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-medium">Área Administrativa</q-item-label>
                    <q-item-label caption>{{ solicitud.aprobaciones.areaAdministrativa || 'Pendiente por definir' }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <!-- ACTIONS -->
      <q-card-actions align="right" class="q-pa-lg bg-grey-2">
        <q-btn flat label="Cerrar Panel" color="grey-8" v-close-popup class="btn-cancel" />
        <q-btn 
          v-if="solicitud.status === 'ENVIADA'"
          label="Gestionar Aprobación" 
          icon="check_circle" 
          color="primary" 
          unelevated 
          class="premium-btn-action" 
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'SolicitudTransporteDetalleModal',
  props: {
    value: Boolean,
    solicitud: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      passengerColumns: [
        { name: 'nombre', label: 'Pasajero', field: 'nombre', align: 'left' },
        { name: 'documento', label: 'Cédula / Pasaporte', field: 'documento', align: 'left' },
        { name: 'contacto', label: 'Contacto', field: 'contacto', align: 'center' }
      ]
    };
  },
  computed: {
    show: {
      get() { return this.value; },
      set(val) { this.$emit('input', val); }
    }
  },
  methods: {
    getStatusColor(status) {
      switch (status) {
        case 'BORRADOR': return '#64748b';
        case 'ENVIADA': return '#2563eb';
        case 'APROBADA': return '#10b981';
        case 'RECHAZADA': return '#ef4444';
        default: return '#94a3b8';
      }
    }
  }
}
</script>

<style scoped>
.premium-detail-card {
  max-width: 1200px !important;
  margin: 0 auto;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
}

.header-section {
  padding: 24px 40px;
  background: white;
}

.icon-box {
  background: #f1f5f9;
  padding: 12px;
  border-radius: 16px;
}

.text-primary-gradient {
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.main-title {
  font-size: 24px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.01em;
}

.status-badge {
  border-radius: 8px;
  height: 28px;
  padding: 0 12px;
}

.content-scroll {
  max-height: 75vh;
  overflow-y: auto;
  background: white;
}

.group-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
}

.border-radius-lg {
  border-radius: 16px;
}

.field-label {
  font-size: 11px;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 4px;
}

.field-value {
  font-size: 15px;
  color: #1e293b;
}

/* Flight Itinerary Design */
.travel-itinerary {
  background: linear-gradient(to right, #ffffff, #f8fafc);
}

.flight-path-container {
  position: relative;
  padding: 0 20px;
}

.path-line {
  height: 2px;
  background: dashed #e2e8f0;
  background-image: linear-gradient(to right, #cbd5e1 50%, rgba(255, 255, 255, 0) 0%);
  background-position: bottom;
  background-size: 10px 2px;
  background-repeat: repeat-x;
  width: 100%;
  position: relative;
}

.plane-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(90deg);
  background: white;
  padding: 2px;
  color: #3b82f6;
}

.border-top {
  border-top: 1px solid #f1f5f9;
}

/* Tables */
.passenger-table :deep(thead tr th) {
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.7rem;
  color: #64748b;
  background-color: #f8fafc;
}

.justification-text {
  font-size: 14px;
  line-height: 1.6;
  color: #334155;
}

.shadow-inner {
  box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.05);
}

.btn-cancel {
  font-weight: 600;
  text-transform: none;
  padding: 0 20px;
}

.premium-btn-action {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  border-radius: 12px;
  padding: 10px 24px;
  font-weight: 700;
  text-transform: none;
}

.reveal-animation {
  animation: modalReveal 0.5s cubic-bezier(0, 0, 0.2, 1) forwards;
}

@keyframes modalReveal {
  from { opacity: 0; transform: scale(0.95) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.letter-spacing-1 {
  letter-spacing: 0.1em;
}
</style>
