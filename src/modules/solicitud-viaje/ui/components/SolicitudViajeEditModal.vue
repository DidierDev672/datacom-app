<template>
  <q-dialog v-model="show" persistent full-width>
    <q-card class="edit-card shadow-24">
      <!-- HEADER -->
      <q-card-section class="header-section">
        <div class="row items-center justify-between">
          <h2 class="edit-title">Editar solicitud de viaje</h2>
          <q-btn icon="close" flat round dense v-close-popup class="text-grey-7" />
        </div>
      </q-card-section>

      <q-separator />

      <!-- FORM CONTENT -->
      <q-card-section class="content-container scroll">
        <q-form ref="editForm" class="q-gutter-y-lg">
          
          <!-- 1. INFORMACIÓN GENERAL -->
          <div class="section-container">
            <h3 class="section-subtitle">Información general</h3>
            <div class="row q-col-gutter-x-md q-col-gutter-y-lg">
              <div class="col-12 col-md-4">
                <div class="field-group">
                  <label class="edit-label">Código de la solicitud</label>
                  <q-input
                    v-model="editData.codigo"
                    outlined
                    dense
                    readonly
                    class="input-boxed readonly-bg"
                  />
                  <div class="helper-text">El código no es editable</div>
                </div>
              </div>
              <div class="col-12 col-md-4">
                <div class="field-group">
                  <label class="edit-label">Fecha de solicitud</label>
                  <q-input
                    v-model="editData.fechaSolicitud"
                    type="date"
                    outlined
                    dense
                    class="input-boxed editable-bg"
                  />
                </div>
              </div>
              <div class="col-12 col-md-4">
                <div class="field-group">
                  <label class="edit-label">Nombre del Solicitante</label>
                  <q-input
                    v-model="editData.solicitanteNombre"
                    outlined
                    dense
                    class="input-boxed editable-bg"
                    placeholder="Ingrese nombre completo"
                  />
                </div>
              </div>
              <div class="col-12 col-md-6">
                <div class="field-group">
                  <label class="edit-label">Proyecto Asociado</label>
                  <q-input
                    v-model="editData.proyecto"
                    outlined
                    dense
                    class="input-boxed editable-bg"
                  />
                  <div class="helper-text">Indique el nombre del proyecto ambiental</div>
                </div>
              </div>
              <div class="col-12 col-md-6">
                <div class="field-group">
                  <label class="edit-label">Área / Dependencia</label>
                  <q-input
                    v-model="editData.area"
                    outlined
                    dense
                    class="input-boxed editable-bg"
                  />
                </div>
              </div>
            </div>
          </div>

          <q-separator class="section-divider" />

          <!-- 2. TRANSPORTE -->
          <div class="section-container">
            <h3 class="section-subtitle">Transporte</h3>
            <div class="row q-col-gutter-x-md q-col-gutter-y-lg">
              <div class="col-12 col-md-6">
                <div class="field-group">
                  <label class="edit-label">Origen</label>
                  <q-input
                    v-model="editData.transporte.origen"
                    outlined
                    dense
                    class="input-boxed editable-bg"
                  />
                </div>
              </div>
              <div class="col-12 col-md-6">
                <div class="field-group">
                  <label class="edit-label">Destino</label>
                  <q-input
                    v-model="editData.transporte.destino"
                    outlined
                    dense
                    class="input-boxed editable-bg"
                  />
                  <div class="helper-text">Seleccione la ciudad destino</div>
                </div>
              </div>
              <div class="col-12 col-md-4">
                <div class="field-group">
                  <label class="edit-label">Fecha de Salida</label>
                  <q-input
                    v-model="editData.transporte.fechaSalida"
                    type="date"
                    outlined
                    dense
                    class="input-boxed editable-bg"
                  />
                </div>
              </div>
              <div class="col-12 col-md-4">
                <div class="field-group">
                  <label class="edit-label">Fecha de Regreso</label>
                  <q-input
                    v-model="editData.transporte.fechaRegreso"
                    type="date"
                    outlined
                    dense
                    class="input-boxed editable-bg"
                  />
                </div>
              </div>
              <div class="col-12 col-md-4">
                <div class="field-group">
                  <label class="edit-label">Tipo de Transporte</label>
                  <q-select
                    v-model="editData.transporte.tipoTransporte"
                    :options="['TERRESTRE', 'AEREO', 'MARITIMO']"
                    outlined
                    dense
                    class="input-boxed editable-bg"
                  />
                </div>
              </div>
            </div>
          </div>

          <q-separator class="section-divider" />

          <!-- 3. ALOJAMIENTO -->
          <div class="section-container">
            <h3 class="section-subtitle">Alojamiento</h3>
            <div class="row q-col-gutter-x-md q-col-gutter-y-lg">
              <div class="col-12 col-md-6">
                <div class="field-group">
                  <label class="edit-label">Ciudad de Hospedaje</label>
                  <q-input
                    v-model="editData.hospedaje.ciudad"
                    outlined
                    dense
                    class="input-boxed editable-bg"
                  />
                </div>
              </div>
              <div class="col-12 col-md-6">
                <div class="field-group">
                  <label class="edit-label">Hotel Sugerido</label>
                  <q-input
                    v-model="editData.hospedaje.hotel"
                    outlined
                    dense
                    class="input-boxed editable-bg"
                    placeholder="Ej: Hotel Las Gaviotas"
                  />
                </div>
              </div>
              <div class="col-12 col-md-4">
                <div class="field-group">
                  <label class="edit-label">N° de Habitaciones</label>
                  <q-input
                    v-model.number="editData.hospedaje.numeroHabitaciones"
                    type="number"
                    outlined
                    dense
                    class="input-boxed editable-bg"
                  />
                </div>
              </div>
              <div class="col-12 col-md-4">
                <div class="field-group">
                  <label class="edit-label">N° de Personas</label>
                  <q-input
                    v-model.number="editData.hospedaje.numeroPersonas"
                    type="number"
                    outlined
                    dense
                    class="input-boxed editable-bg"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- 4. MOTIVOS -->
          <div class="section-container last-section">
            <h3 class="section-subtitle">Motivos y Justificación</h3>
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <div class="field-group">
                  <label class="edit-label">Motivo de viaje</label>
                  <q-input
                    v-model="editData.motivoViaje"
                    type="textarea"
                    outlined
                    dense
                    rows="3"
                    class="input-boxed editable-bg"
                  />
                </div>
              </div>
            </div>
          </div>

        </q-form>
      </q-card-section>

      <q-separator />

      <!-- ACTIONS -->
      <q-card-actions align="right" class="q-pa-md footer-section">
        <q-btn
          flat
          label="Cancelar"
          class="btn-action btn-cancel"
          v-close-popup
        />
        <q-btn
          unelevated
          label="Guardar cambios"
          color="primary"
          class="btn-action btn-save"
          :loading="loading"
          @click="saveChanges"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'SolicitudViajeEditModal',
  props: {
    value: Boolean,
    solicitud: {
      type: Object,
      required: true
    },
    loading: Boolean
  },
  data() {
    return {
      editData: JSON.parse(JSON.stringify(this.solicitud))
    };
  },
  computed: {
    show: {
      get() { return this.value; },
      set(val) { this.$emit('input', val); }
    }
  },
  watch: {
    solicitud: {
      handler(val) {
        this.editData = JSON.parse(JSON.stringify(val));
      },
      deep: true
    }
  },
  methods: {
    saveChanges() {
      this.$emit('save', this.editData);
    }
  }
}
</script>

<style scoped>
.edit-card {
  max-width: 900px !important;
  margin: 0 auto;
  border-radius: 12px !important;
}

.header-section {
  padding: 24px 32px;
}

.edit-title {
  font-size: 22px !important; /* 2. Título 22px semibold */
  font-weight: 600 !important;
  color: #111827;
  margin: 0;
}

.content-container {
  padding: 32px;
  max-height: 70vh;
}

/* --- SECCIONES --- */
.section-container {
  margin-bottom: 24px; /* 5. Sección -> Sección 24px */
}

.section-subtitle {
  font-size: 18px !important; /* 6. Tipografía Subtítulos 18px 500 */
  font-weight: 500 !important;
  color: #111827;
  margin: 0 0 16px 0;
}

.section-divider {
  margin: 32px 0;
  background: #E5E7EB;
}

/* --- CAMPOS Y LABELS --- */
.field-group {
  display: flex;
  flex-direction: column;
}

.edit-label {
  font-size: 13px !important; /* 3. Label -> 13px / gris */
  font-weight: 500 !important;
  color: #6B7280 !important;
  margin-bottom: 8px !important; /* 5. Label -> Input 8px */
}

/* --- INPUT STYLES --- */
::v-deep .input-boxed .q-field__control {
  border-radius: 8px !important;
  height: 48px !important;
}

.editable-bg ::v-deep .q-field__control {
  background: #F3F4F6 !important; /* 7. background: #F3F4F6 */
  border: 1px solid #E5E7EB !important;
}

.readonly-bg ::v-deep .q-field__control {
  background: #F9FAFB !important;
  border: 1px dotted #D1D5DB !important;
}

::v-deep .input-boxed .q-field__native,
::v-deep .input-boxed .q-field__input {
  font-size: 14px !important; /* 4. font-size: 14px / oscuro */
  font-weight: 400 !important;
  color: #111827 !important;
  padding: 0 8px !important;
}

/* Helper Text */
.helper-text {
  font-size: 13px !important; /* 8. Tipografía 13px */
  color: #9CA3AF !important; /* Color gris */
  margin-top: 4px;
}

/* --- BOTONES --- */
.footer-section {
  padding: 24px 32px;
  background: #F9FAFB;
}

.btn-action {
  font-size: 16px !important; /* 9. Estilo tamaño 16px */
  font-weight: 600 !important; /* Peso 600 */
  padding: 0 24px !important;
  height: 48px !important;
  border-radius: 8px !important;
  text-transform: none !important;
}

.btn-save {
  background: #2563EB !important;
}

.btn-cancel {
  color: #374151 !important;
  margin-right: 12px;
}

.last-section {
  padding-bottom: 20px;
}
</style>
