<template>
  <q-dialog v-model="show" persistent full-width>
    <q-card class="premium-detail-card reveal-animation">
      <!-- HEADER -->
      <q-card-section class="row items-center header-section">
        <div class="row items-center q-gutter-md">
          <div class="icon-box">
            <q-icon name="commute" size="32px" class="text-primary-gradient" />
          </div>
          <div>
            <div class="text-caption text-grey-7 text-uppercase letter-spacing-1">Detalle de Solicitud Terrestre</div>
            <h2 class="main-title q-my-none">{{ solicitud.codigo || 'STT-0000' }}</h2>
          </div>
          <q-badge 
            rounded 
            class="q-px-md q-py-xs text-weight-bolder text-uppercase shadow-1"
            :style="statusStyle(solicitud.status)"
            :label="solicitud.status"
          />
        </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup class="close-btn" />
      </q-card-section>

      <q-separator />

      <!-- CONTENT -->
      <q-card-section class="content-scroll q-pa-xl bg-grey-2">
        <div class="row q-col-gutter-xl">
          
          <!-- LEFT COLUMN: Info & Route -->
          <div class="col-12 col-md-7">
            <!-- 1. Información de Identificación -->
            <div class="info-group q-mb-xl">
              <h3 class="group-title"><q-icon name="person_outline" size="24px" class="q-mr-sm" />Información del Solicitante</h3>
              <q-card flat class="bg-white rounded-xl shadow-1 q-pa-lg">
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
                    <div class="field-label">Proyecto</div>
                    <div class="field-value">{{ solicitud.proyecto }}</div>
                  </div>
                  <div class="col-12 col-sm-6">
                    <div class="field-label">Fecha Solicitud</div>
                    <div class="field-value">{{ formatDate(solicitud.createdAt || solicitud.fecha) }}</div>
                  </div>
                </div>
              </q-card>
            </div>

            <!-- 2. Detalles del Transporte -->
            <div class="info-group q-mb-xl">
              <h3 class="group-title"><q-icon name="map" size="24px" class="q-mr-sm" />Itinerario y Ruta</h3>
              <q-card flat class="bg-white rounded-xl shadow-1 q-pa-lg">
                <div class="row items-center justify-between q-mb-lg q-px-md">
                  <div class="text-center">
                    <q-icon name="location_on" color="blue-6" size="24px" />
                    <div class="text-h6 text-weight-bolder text-dark q-mt-xs">{{ getTransporteOrigen }}</div>
                    <div class="text-caption text-grey-6">Origen</div>
                  </div>
                  <div class="col text-center flight-path-container">
                    <div class="text-caption text-weight-bold text-blue-6">{{ getTipoVehiculo }}</div>
                    <div class="path-line">
                      <q-icon name="directions_car" class="plane-icon" />
                    </div>
                  </div>
                  <div class="text-center">
                    <q-icon name="flag" color="emerald-6" size="24px" />
                    <div class="text-h6 text-weight-bolder text-dark q-mt-xs">{{ getTransporteDestino }}</div>
                    <div class="text-caption text-grey-6">Destino</div>
                  </div>
                </div>

                <q-separator class="q-my-lg" />

                <div class="row q-col-gutter-md">
                  <div class="col-12 col-sm-6">
                    <div class="field-label">Salida</div>
                    <div class="field-value text-weight-bold">{{ formatDateTime(getTransporteSalida) }}</div>
                  </div>
                  <div v-if="showRegreso" class="col-12 col-sm-6">
                    <div class="field-label">Regreso</div>
                    <div class="field-value text-weight-bold">{{ formatDateTime(getTransporteRegreso) }}</div>
                  </div>
                  <div class="col-12 col-sm-6">
                    <div class="field-label">Tipo de Servicio</div>
                    <div class="field-value">
                      <q-chip dense color="blue-1" text-color="blue-7" class="text-weight-bold">
                        {{ getTipoServicio === 'IDA' ? 'SÓLO IDA' : 'IDA Y REGRESO' }}
                      </q-chip>
                    </div>
                  </div>
                </div>
              </q-card>
            </div>

            <!-- 3. Pasajeros -->
            <div class="info-group">
              <h3 class="group-title"><q-icon name="groups" size="24px" class="q-mr-sm" />Pasajeros {{ passengerCount }}</h3>
              <q-table
                :data="solicitud.pasajeros || []"
                :columns="passengerColumns"
                row-key="documento"
                flat
                bordered
                hide-bottom
                dense
                class="passenger-table shadow-1 rounded-xl"
              >
                <template v-slot:body-cell-nombre="props">
                  <q-td :props="props">
                    <div class="text-weight-bold text-dark">{{ props.value }}</div>
                    <div class="text-xs text-grey-6 text-uppercase" style="font-size: 10px;">{{ props.row.cargo }}</div>
                  </q-td>
                </template>
                <template v-slot:no-data>
                  <div class="full-width row flex-center q-pa-md text-grey-5">
                    No se han registrado pasajeros
                  </div>
                </template>
              </q-table>
            </div>
          </div>

          <!-- RIGHT COLUMN: Justification & Approvals -->
          <div class="col-12 col-md-5">
            <!-- 4. Justificación -->
            <div class="info-group q-mb-xl">
              <h3 class="group-title"><q-icon name="description" size="24px" class="q-mr-sm" />Justificación</h3>
              <q-card flat class="bg-white rounded-xl shadow-1 q-pa-lg">
                <div class="q-mb-md">
                  <div class="field-label">Motivo del Traslado</div>
                  <p class="justification-text">{{ getJustificacionMotivo }}</p>
                </div>
                <q-separator class="q-my-md" />
                <div>
                  <div class="field-label">Relación con el Proyecto</div>
                  <p class="justification-text">{{ getJustificacionProyecto }}</p>
                </div>
              </q-card>
            </div>

            <!-- 5. Aprobaciones -->
            <div class="info-group">
              <h3 class="group-title"><q-icon name="verified_user" size="24px" class="q-mr-sm" />Firmas y Aprobación</h3>
              <q-list bordered separator class="rounded-xl bg-white shadow-1 overflow-hidden">
                <q-item v-if="getJefeInmediato">
                  <q-item-section avatar>
                    <q-avatar color="blue-1" text-color="blue-7" icon="person" size="32px" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-bold text-dark">{{ getJefeInmediato }}</q-item-label>
                    <q-item-label caption>Jefe Inmediato (Aprobador 1)</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item v-if="getAreaAdministrativa">
                  <q-item-section avatar>
                    <q-avatar color="emerald-1" text-color="emerald-7" icon="admin_panel_settings" size="32px" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-bold text-dark">{{ getAreaAdministrativa }}</q-item-label>
                    <q-item-label caption>Dirección Administrativa (Aprobador 2)</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
            
            <div class="q-mt-xl text-center">
              <q-icon name="info" color="grey-3" size="48px" />
              <p class="text-caption text-grey-5 q-mt-sm">Esta es una visualización de solo lectura.<br>Cualquier modificación requiere permisos de edición.</p>
            </div>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <!-- ACTIONS -->
      <q-card-actions align="right" class="q-pa-lg bg-white">
        <q-btn flat label="Cerrar" color="grey-8" v-close-popup class="text-weight-bold" no-caps />
        <q-btn 
          v-if="solicitud.status === 'BORRADOR'"
          label="Ir a Edición" 
          icon="edit" 
          color="blue-6" 
          unelevated 
          class="rounded-xl q-px-lg"
          no-caps
          @click="$emit('edit', solicitud)"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'SolicitudTerrestreDetalleModal',
  props: {
    value: Boolean,
    solicitud: {
      type: Object,
      required: true,
      default: () => ({})
    }
  },
  data() {
    return {
      passengerColumns: [
        { name: 'nombre', label: 'Pasajero', field: 'nombre', align: 'left' },
        { name: 'documento', label: 'Documento', field: 'documento', align: 'left' },
        { name: 'telefono', label: 'Teléfono', field: 'telefono', align: 'right' }
      ]
    };
  },
  computed: {
    show: {
      get() { return this.value; },
      set(val) { this.$emit('input', val); }
    },
    passengerCount() {
      const count = this.solicitud.pasajeros ? this.solicitud.pasajeros.length : 0;
      return count > 0 ? 'Pasajeros (' + count + ')' : 'Pasajeros';
    },
    getTransporteOrigen() { return this.solicitud.transporte ? this.solicitud.transporte.origen : ''; },
    getTransporteDestino() { return this.solicitud.transporte ? this.solicitud.transporte.destino : ''; },
    getTransporteSalida() { return this.solicitud.transporte ? this.solicitud.transporte.fechaHoraSalida : ''; },
    getTransporteRegreso() { return this.solicitud.transporte ? this.solicitud.transporte.fechaHoraRegreso : ''; },
    getTipoVehiculo() { return this.solicitud.servicio ? this.solicitud.servicio.tipoVehiculo : ''; },
    getTipoServicio() { return this.solicitud.servicio ? this.solicitud.servicio.tipoServicio : ''; },
    getJustificacionMotivo() { return this.solicitud.justificacion ? this.solicitud.justificacion.motivoTraslado : ''; },
    getJustificacionProyecto() { return this.solicitud.justificacion ? this.solicitud.justificacion.relacionProyecto : ''; },
    getJefeInmediato() { return this.solicitud.aprobaciones ? this.solicitud.aprobaciones.jefeInmediato : ''; },
    getAreaAdministrativa() { return this.solicitud.aprobaciones ? this.solicitud.aprobaciones.areaAdministrativa : ''; },
    showRegreso() { return this.solicitud.transporte && this.solicitud.transporte.fechaHoraRegreso; }
  },
  methods: {
    statusStyle(status) {
      switch (status) {
        case 'BORRADOR': return 'background: #f3f4f6; color: #4b5563; border: 1px solid #e5e7eb;';
        case 'ENVIADA': return 'background: #fef9c3; color: #854d0e; border: 1px solid #fef08a;';
        case 'APROBADA': return 'background: #dcfce7; color: #166534; border: 1px solid #bbf7d0;';
        case 'RECHAZADA': return 'background: #fee2e2; color: #991b1b; border: 1px solid #fecaca;';
        default: return 'background: #f3f4f6; color: #4b5563;';
      }
    },
    formatDate(dateString) {
      if (!dateString) return '---';
      return new Date(dateString).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
    },
    formatDateTime(dateString) {
      if (!dateString) return '---';
      return new Date(dateString).toLocaleString('es-ES', { 
        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' 
      });
    }
  }
}
</script>

<style scoped>
.premium-detail-card {
  max-width: 1200px !important;
  margin: 0 auto;
  border-radius: 24px !important;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
}

.header-section {
  padding: 24px 40px;
  background: white;
}

.icon-box {
  background: #eff6ff;
  padding: 12px;
  border-radius: 16px;
}

.text-primary-gradient {
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.main-title {
  font-size: 24px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.01em;
}

.content-scroll {
  max-height: 75vh;
  overflow-y: auto;
}

.group-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
}

.field-label {
  font-size: 10px;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 2px;
}

.field-value {
  font-size: 14px;
  color: #1e293b;
}

.flight-path-container {
  position: relative;
  padding: 0 20px;
}

.path-line {
  height: 2px;
  background: #e2e8f0;
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
  transform: translate(-50%, -50%);
  background: white;
  padding: 2px;
  color: #2563eb;
}

.passenger-table :deep(thead tr th) {
  font-weight: 700;
  text-transform: uppercase;
  font-size: 10px;
  color: #64748b;
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.justification-text {
  font-size: 14px;
  line-height: 1.6;
  color: #334155;
  background: #f8fafc;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #f1f5f9;
}

.letter-spacing-1 {
  letter-spacing: 0.1em;
}

.reveal-animation {
  animation: modalReveal 0.5s cubic-bezier(0, 0, 0.2, 1) forwards;
}

@keyframes modalReveal {
  from { opacity: 0; transform: scale(0.95) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
</style>
