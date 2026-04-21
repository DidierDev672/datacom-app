<template>
  <q-dialog v-model="show" persistent full-width :maximized="maximized">
    <q-card class="detail-card">
      <!-- HEADER -->
      <q-card-section class="row items-center header-section">
        <div class="row items-center title-group">
          <h2 class="main-title">Solicitud {{ solicitud.codigo }}</h2>
          <q-chip
            :color="getStatusColor(solicitud.status)"
            text-color="white"
            class="status-badge"
          >
            {{ solicitud.status }}
          </q-chip>
        </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup class="close-btn" />
      </q-card-section>

      <q-separator />

      <!-- CONTENT -->
      <q-card-section class="content-scroll shadow-custom">
        <!-- 1. INFORMACIÓN GENERAL -->
        <div class="section-container">
          <h3 class="section-subtitle">Información General</h3>
          <div class="row q-col-gutter-x-lg q-col-gutter-y-md block-container">
            <div class="col-12 col-sm-6 col-md-3">
              <div class="field-label">Fecha de Solicitud</div>
              <div class="field-value">{{ solicitud.fechaSolicitud }}</div>
            </div>
            <div class="col-12 col-sm-6 col-md-3">
              <div class="field-label">Solicitante</div>
              <div class="field-value highlight">{{ solicitud.solicitanteNombre }}</div>
            </div>
            <div class="col-12 col-sm-6 col-md-3">
              <div class="field-label">Proyecto</div>
              <div class="field-value">{{ solicitud.proyecto }}</div>
            </div>
            <div class="col-12 col-sm-6 col-md-3">
              <div class="field-label">Área / Dependencia</div>
              <div class="field-value">{{ solicitud.area }}</div>
            </div>
          </div>
        </div>

        <q-separator class="section-separator" />

        <!-- 2. TRANSPORTE Y ALOJAMIENTO -->
        <div class="row q-col-gutter-xl">
          <!-- TRANSPORTE -->
          <div class="col-12 col-md-6">
            <div class="section-container no-margin">
              <h3 class="section-subtitle">Transporte</h3>
              <div class="block-container grid-2-columns">
                <div class="field-item">
                  <div class="field-label">Origen</div>
                  <div class="field-value">{{ solicitud.transporte.origen }}</div>
                </div>
                <div class="field-item">
                  <div class="field-label">Destino</div>
                  <div class="field-value">{{ solicitud.transporte.destino }}</div>
                </div>
                <div class="field-item">
                  <div class="field-label">Fecha Salida</div>
                  <div class="field-value">{{ solicitud.transporte.fechaSalida }}</div>
                </div>
                <div class="field-item">
                  <div class="field-label">Fecha Regreso</div>
                  <div class="field-value">{{ solicitud.transporte.fechaRegreso }}</div>
                </div>
                <div class="field-item">
                  <div class="field-label">Tipo Transporte</div>
                  <div class="field-value">{{ solicitud.transporte.tipoTransporte }}</div>
                </div>
                <div class="field-item">
                  <div class="field-label">N° de Personas</div>
                  <div class="field-value">{{ solicitud.transporte.numeroPersonas }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- ALOJAMIENTO -->
          <div class="col-12 col-md-6">
            <div class="section-container no-margin">
              <h3 class="section-subtitle">Alojamiento</h3>
              <div class="block-container grid-2-columns">
                <div class="field-item">
                  <div class="field-label">Ciudad</div>
                  <div class="field-value">{{ solicitud.hospedaje.ciudad }}</div>
                </div>
                <div class="field-item">
                  <div class="field-label">Hotel Sugerido</div>
                  <div class="field-value">{{ solicitud.hospedaje.hotel || 'No especificado' }}</div>
                </div>
                <div class="field-item">
                  <div class="field-label">Fecha Ingreso</div>
                  <div class="field-value">{{ solicitud.hospedaje.fechaIngreso || 'Pendiente' }}</div>
                </div>
                <div class="field-item">
                  <div class="field-label">Fecha Salida</div>
                  <div class="field-value">{{ solicitud.hospedaje.fechaSalida || 'Pendiente' }}</div>
                </div>
                <div class="field-item">
                  <div class="field-label">N° Habitaciones</div>
                  <div class="field-value">{{ solicitud.hospedaje.numeroHabitaciones }}</div>
                </div>
                <div class="field-item">
                  <div class="field-label">N° de Personas</div>
                  <div class="field-value">{{ solicitud.hospedaje.numeroPersonas }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <q-separator class="section-separator" />

        <!-- 3. TABLA DE PERSONAS -->
        <div class="section-container">
          <h3 class="section-subtitle">Integrantes del Viaje</h3>
          <div class="block-container shadow-sm border-rounded overflow-hidden">
            <q-table
              :data="solicitud.personas"
              :columns="personColumns"
              row-key="documento"
              flat
              bordered
              dense
              hide-bottom
              class="compact-table"
            />
          </div>
        </div>

        <q-separator class="section-separator" />

        <!-- 4. JUSTIFICACIÓN -->
        <div class="section-container last-section">
          <h3 class="section-subtitle">Justificación y Motivo</h3>
          <div class="row q-col-gutter-lg">
            <div class="col-12 col-md-6">
              <div class="block-container">
                <div class="field-label">Motivo de Viaje</div>
                <div class="long-text-value">
                  {{ solicitud.motivoViaje }}
                </div>
              </div>
            </div>
            <div class="col-12 col-md-6">
              <div class="block-container">
                <div class="field-label">Relación con Proyecto</div>
                <div class="long-text-value">
                  {{ solicitud.relacionProyecto }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <!-- ACTIONS -->
      <q-card-actions align="right" class="q-pa-md footer-actions">
        <q-btn flat label="Cerrar" color="grey-7" v-close-popup class="btn-cancel" />
        <q-btn label="Aprobar Solicitud" color="primary" class="btn-approve" unelevated @click="$emit('approve', solicitud)" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'SolicitudViajeDetalleModal',
  props: {
    value: Boolean,
    solicitud: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      maximized: false,
      personColumns: [
        { name: 'nombre', label: 'Nombre Completo', field: 'nombre', align: 'left' },
        { name: 'documento', label: 'Documento', field: 'documento', align: 'left' },
        { name: 'cargo', label: 'Cargo', field: 'cargo', align: 'left' },
        { name: 'telefono', label: 'Teléfono', field: 'telefono', align: 'left' }
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
      const colors = {
        'BORRADOR': 'grey-7',
        'APROBADA': 'positive',
        'PENDIENTE': 'orange-7',
        'RECHAZADA': 'negative'
      };
      return colors[status] || 'primary';
    }
  }
}
</script>

<style scoped>
.detail-card {
  max-width: 960px !important;
  margin: 0 auto;
  border-radius: 16px;
  overflow: hidden;
}

.header-section {
  padding: 20px 24px;
}

.title-group {
  gap: 16px;
}

.main-title {
  font-size: 22px !important; /* 22px semibold */
  font-weight: 600 !important;
  color: #111827;
  margin: 0;
}

.status-badge {
  font-size: 12px !important; /* Badge 12px 600 */
  font-weight: 600 !important;
  padding: 4px 10px !important;
  border-radius: 999px !important;
  text-transform: uppercase;
}

.section-subtitle {
  font-size: 18px !important; /* Subtítulo 18px 500 */
  font-weight: 500 !important;
  color: #111827;
  margin: 0 0 24px 0;
}

/* --- ESPACIADO Y ESTRUCTURA --- */

.section-container {
  padding: 32px 0; /* Bloque a Bloque 32px */
}

.no-margin {
  padding-bottom: 0;
}

.last-section {
  padding-bottom: 40px;
}

.block-container {
  margin-top: 0; /* Se maneja con el grid de los campos */
}

.section-separator {
  background: #F3F4F6;
}

.grid-2-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px; /* Campo a campo 16px */
}

.field-item {
  margin-bottom: 8px;
}

/* --- TIPOGRAFÍA DE CAMPOS --- */

.field-label {
  font-size: 13px !important; /* Labels 13px 500 */
  font-weight: 500 !important;
  color: #6B7280 !important; /* Gris */
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.field-value {
  font-size: 14px !important; /* Valores 14px 400 */
  font-weight: 400 !important;
  color: #111827 !important; /* Oscuro */
}

.field-value.highlight {
  font-weight: 500 !important;
  color: #1D4ED8 !important;
}

.long-text-value {
  font-size: 14px !important; /* Texto largo 14px */
  line-height: 1.5 !important; /* line-height 1.5 */
  color: #374151 !important;
  background: #F9FAFB;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #F3F4F6;
}

/* --- TABLA --- */

.compact-table ::v-deep th {
  font-size: 13px !important; /* Header 13px 600 */
  font-weight: 600 !important;
  color: #6B7280 !important;
  padding: 12px 16px !important;
}

.compact-table ::v-deep td {
  font-size: 14px !important; /* Contenido 14px 400 */
  font-weight: 400 !important;
  color: #111827 !important;
}

.border-rounded {
  border-radius: 12px;
  border: 1px solid #E5E7EB;
}

/* --- FOOTER --- */

.footer-actions {
  background: #F9FAFB;
  padding: 16px 24px;
}

.btn-approve {
  height: 44px;
  padding: 0 24px;
  border-radius: 8px;
  font-weight: 600;
  background: #2563EB !important;
}

.btn-cancel {
  font-weight: 500;
  margin-right: 8px;
}

.content-scroll {
  max-height: 70vh;
  overflow-y: auto;
  padding: 0 32px;
}
</style>
