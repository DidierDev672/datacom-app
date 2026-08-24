<template>
  <q-dialog
    :value="value"
    @input="onDialogInput"
    persistent
  >
    <q-card class="erm-modal">
      <q-card-section class="erm-header">
        <div class="erm-header-left">
          <div class="erm-header-icon">
            <q-icon name="savings" size="20px" />
          </div>
          <div>
            <div class="erm-header-title">Editar Rubro</div>
            <div v-if="rubro.nombre" class="erm-header-sub">
              {{ rubro.nombre }}
            </div>
          </div>
        </div>
        <q-btn
          v-close-popup
          flat
          round
          dense
          icon="close"
          size="sm"
          class="erm-close-x"
          aria-label="Cerrar"
        />
      </q-card-section>

      <q-separator />

      <q-card-section class="erm-body">
        <div v-if="formError" class="erm-error-banner">
          <q-icon name="error_outline" size="16px" />
          {{ formError }}
        </div>

        <div class="section-label">Información general</div>

        <div class="erm-field">
          <label class="erm-field-label">Nombre del rubro <span class="erm-required">*</span></label>
          <q-input
            v-model="form.nombre"
            outlined
            dense
            bg-color="white"
            placeholder="Ej: Materiales de Oficina"
            maxlength="100"
            :rules="[(val) => (val && val.trim().length > 0) || 'El nombre es obligatorio']"
            class="erm-input"
          />
        </div>

        <div class="erm-field">
          <label class="erm-field-label">Descripción</label>
          <q-input
            v-model="form.descripcion"
            outlined
            dense
            bg-color="white"
            type="textarea"
            autogrow
            placeholder="Detalle el propósito de este rubro..."
            class="erm-input"
          />
        </div>

        <div class="erm-field">
          <label class="erm-field-label">Plan de abastecimiento</label>
          <q-input
            v-model="form.planAbastecimiento"
            outlined
            dense
            bg-color="white"
            placeholder="Nombre del plan asociado"
            class="erm-input"
          />
        </div>

        <div class="section-label">Período y valor</div>

        <div class="erm-row">
          <div class="erm-field erm-field--half">
            <label class="erm-field-label">Fecha de inicio <span class="erm-required">*</span></label>
            <q-input
              v-model="form.fechaInicio"
              outlined
              dense
              bg-color="white"
              mask="date"
              :rules="['date', (val) => val !== '' || 'Requerido']"
              class="erm-input"
            >
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer" color="grey-6">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="form.fechaInicio" mask="YYYY-MM-DD" />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="erm-field erm-field--half">
            <label class="erm-field-label">Fecha final <span class="erm-required">*</span></label>
            <q-input
              v-model="form.fechaFinal"
              outlined
              dense
              bg-color="white"
              mask="date"
              :rules="['date', (val) => !form.fechaInicio || val >= form.fechaInicio || 'Debe ser posterior a la fecha de inicio']"
              class="erm-input"
            >
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer" color="grey-6">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="form.fechaFinal" mask="YYYY-MM-DD" :options="fechaFinalOptions" />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
        </div>

        <div class="erm-field">
          <label class="erm-field-label">Valor del rubro <span class="erm-required">*</span></label>
          <q-input
            v-model.number="form.valor"
            outlined
            dense
            bg-color="white"
            type="number"
            placeholder="0"
            min="0"
            class="erm-input"
          >
            <template v-slot:prepend>
              <q-icon name="attach_money" color="grey-6" />
            </template>
            <template v-slot:append>
              <span class="erm-currency-label">COP</span>
            </template>
          </q-input>
        </div>

        <div class="section-label">Estado</div>

        <div class="erm-field">
          <label class="erm-field-label">Estado actual</label>
          <div class="estado-toggle">
            <button
              :class="['estado-pill', form.estado === 'Activo' ? 'active--green' : '']"
              @click="form.estado = 'Activo'"
              type="button"
            >
              Activo
            </button>
            <button
              :class="['estado-pill', form.estado === 'Inactivo' ? 'active--red' : '']"
              @click="form.estado = 'Inactivo'"
              type="button"
            >
              Inactivo
            </button>
          </div>
        </div>

        <div class="section-label">Historial de activación</div>

        <div class="historial">
          <div
            v-if="!rubro.historialActivacion || rubro.historialActivacion.length === 0"
            class="historial__empty"
          >
            Sin cambios de estado registrados.
          </div>
          <div
            v-for="(entry, i) in rubro.historialActivacion"
            :key="i"
            class="historial__entry"
          >
            <span class="historial__fecha">{{ formatDate(entry.fecha) }}</span>
            <span class="historial__motivacion">{{ entry.motivacion }}</span>
          </div>
        </div>

        <div v-if="statusError" class="erm-error-banner erm-error-banner--status">
          <q-icon name="error_outline" size="16px" />
          {{ statusError }}
        </div>

        <div class="erm-field">
          <label class="erm-field-label">
            Motivación del cambio
            <span v-if="form.estado !== rubro.estado" class="erm-required">*</span>
          </label>
          <q-input
            v-model="motivacionCambio"
            outlined
            dense
            bg-color="white"
            type="textarea"
            autogrow
            placeholder="Explique el motivo del cambio de estado..."
            class="erm-input"
          />
          <button
            class="erm-status-btn"
            type="button"
            :disabled="savingStatus || !motivacionCambio.trim() || form.estado === rubro.estado"
            @click="updateStatus"
          >
            <q-icon v-if="savingStatus" name="loop" size="14px" class="erm-spinner" />
            <q-icon v-else name="sync" size="14px" />
            Actualizar Estado
          </button>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right" class="erm-footer">
        <q-btn
          v-close-popup
          flat
          no-caps
          label="Cancelar"
          color="grey-7"
          class="erm-btn-cancel"
        />
        <q-btn
          unelevated
          no-caps
          label="Guardar cambios"
          color="primary"
          :loading="savingForm"
          :disable="savingForm"
          class="erm-btn-save"
          @click="saveForm"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { useRubrosStore } from "src/piña/rubros";
import axios from "axios";
import { URL_API } from "src/utils/config";
import { getRawToken } from "src/utils/authHelper";

export default {
  name: "EditRubroModal",

  props: {
    value: {
      type: Boolean,
      required: true,
    },
    rubro: {
      type: Object,
      required: true,
    },
  },

  emits: ["input", "saved", "status-updated"],

  data() {
    return {
      form: {
        nombre: "",
        descripcion: "",
        planAbastecimiento: "",
        fechaInicio: "",
        fechaFinal: "",
        valor: 0,
        estado: "Activo",
      },
      motivacionCambio: "",
      savingForm: false,
      savingStatus: false,
      formError: null,
      statusError: null,
      rubrosStore: null,
    };
  },

  watch: {
    value(open) {
      if (open) {
        this.initForm();
      }
    },
  },

  methods: {
    initForm() {
      this.form = {
        nombre: this.rubro.nombre || "",
        descripcion: this.rubro.descripcion || "",
        planAbastecimiento: this.rubro.planAbastecimiento || "",
        fechaInicio: this.rubro.fechaInicio
          ? String(this.rubro.fechaInicio).slice(0, 10)
          : "",
        fechaFinal: this.rubro.fechaFinal
          ? String(this.rubro.fechaFinal).slice(0, 10)
          : "",
        valor: this.rubro.valor != null ? this.rubro.valor : 0,
        estado: this.rubro.estado || "Activo",
      };
      this.motivacionCambio = "";
      this.formError = null;
      this.statusError = null;
    },

    fechaFinalOptions(fecha) {
      if (!this.form.fechaInicio) {
        return true;
      }
      return fecha >= this.form.fechaInicio;
    },

    validateForm() {
      if (!this.form.nombre.trim()) {
        this.formError = "El nombre del rubro es obligatorio.";
        return false;
      }
      if (!this.form.fechaInicio) {
        this.formError = "La fecha de inicio es obligatoria.";
        return false;
      }
      if (!this.form.fechaFinal) {
        this.formError = "La fecha final es obligatoria.";
        return false;
      }
      if (this.form.fechaFinal < this.form.fechaInicio) {
        this.formError = "La fecha final no puede ser anterior a la fecha de inicio.";
        return false;
      }
      if (this.form.valor < 0) {
        this.formError = "El valor del rubro no puede ser negativo.";
        return false;
      }
      this.formError = null;
      return true;
    },

    validateStatus() {
      if (!this.motivacionCambio.trim()) {
        this.statusError = "Debes ingresar una motivación para cambiar el estado.";
        return false;
      }
      this.statusError = null;
      return true;
    },

    async saveForm() {
      if (!this.validateForm()) {
        return;
      }

      this.savingForm = true;

      try {
        const rubroData = {
          id: this.rubro.id,
          name: this.form.nombre.trim(),
          description: this.form.descripcion.trim(),
          planId: this.rubro.planId || this.form.planAbastecimiento || null,
          startDate: this.form.fechaInicio,
          endDate: this.form.fechaFinal,
          totalBudget: Number(this.form.valor),
          active: this.form.estado === "Activo",
        };

        this.rubrosStore.loadRubro(rubroData);
        await this.rubrosStore.updateRubro();
        this.$emit("saved");
        this.$emit("input", false);
      } catch (e) {
        const msg =
          (e && e.response && e.response.data && e.response.data.message) ||
          (e && e.errors && e.errors.general) ||
          "Ocurrió un error al guardar. Intenta de nuevo.";
        this.formError = msg;
      } finally {
        this.savingForm = false;
      }
    },

    async updateStatus() {
      if (!this.validateStatus()) {
        return;
      }

      this.savingStatus = true;

      try {
        const payload = {
          active: this.form.estado === "Activo",
          activacionMotivo: this.motivacionCambio.trim(),
          activacionFecha: new Date().toISOString(),
        };

        await axios.put(
          `${URL_API}/api/v1/rubros/${this.rubro.id}/status`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${getRawToken()}`,
              "Content-Type": "application/json",
            },
          }
        );

        this.motivacionCambio = "";
        this.$emit("status-updated");
      } catch (e) {
        const msg =
          (e && e.response && e.response.data && e.response.data.message) ||
          "No se pudo actualizar el estado. Intenta de nuevo.";
        this.statusError = msg;
      } finally {
        this.savingStatus = false;
      }
    },

    formatDate(iso) {
      if (!iso) {
        return "—";
      }
      try {
        return new Intl.DateTimeFormat("es-CO", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }).format(new Date(iso));
      } catch (e) {
        return iso;
      }
    },

    onDialogInput(val) {
      this.$emit("input", val);
    },
  },

  mounted() {
    this.rubrosStore = useRubrosStore();
  },
};
</script>

<style scoped>
.erm-modal {
  max-width: 580px;
  width: 100%;
  border-radius: 16px;
  overflow: hidden;
}

.erm-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 20px 24px 12px;
}

.erm-header-left {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex: 1;
  min-width: 0;
  padding-right: 12px;
}

.erm-header-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #EFF6FF;
  color: #2563EB;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.erm-header-title {
  font-size: 17px;
  font-weight: 700;
  color: #111827;
  line-height: 1.3;
  margin-bottom: 2px;
}

.erm-header-sub {
  font-size: 13px;
  color: #6B7280;
  line-height: 1.3;
}

.erm-close-x {
  color: #6B7280;
  margin-top: 2px;
}

.erm-body {
  padding: 16px 24px 8px;
  max-height: 60vh;
  overflow-y: auto;
}

.erm-error-banner {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 10px 14px;
  background: #FEF2F2;
  border: 1px solid #FEE2E2;
  border-radius: 8px;
  color: #B91C1C;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 16px;
  line-height: 1.4;
}

.erm-error-banner--status {
  margin-top: 12px;
  margin-bottom: 8px;
}

.section-label {
  font-size: 11px;
  font-weight: 500;
  color: #9CA3AF;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin: 20px 0 12px;
  padding-bottom: 6px;
  border-bottom: 0.5px solid #F3F4F6;
}

.erm-field {
  margin-bottom: 16px;
}

.erm-field-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 4px;
}

.erm-required {
  color: #EF4444;
  font-weight: 700;
}

.erm-input ::v-deep .q-field__control {
  background: white !important;
  border-radius: 8px !important;
}

.erm-input ::v-deep .q-field__control:before {
  border: 1px solid #D1D5DB !important;
}

.erm-input ::v-deep .q-field--focused .q-field__control:after {
  border-color: #2563EB !important;
  border-width: 2px !important;
}

.erm-row {
  display: flex;
  gap: 16px;
}

.erm-field--half {
  flex: 1;
  min-width: 0;
}

.erm-currency-label {
  font-size: 12px;
  font-weight: 600;
  color: #9CA3AF;
}

.estado-toggle {
  display: flex;
  gap: 8px;
}

.estado-pill {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  border: 1.5px solid #E5E7EB;
  background: transparent;
  color: #6B7280;
  cursor: pointer;
  transition: all 0.15s ease;
}

.estado-pill:hover {
  border-color: #D1D5DB;
  color: #374151;
}

.active--green {
  background: #DCFCE7;
  border-color: #86EFAC;
  color: #15803D;
}

.active--red {
  background: #FEE2E2;
  border-color: #FCA5A5;
  color: #B91C1C;
}

.historial {
  margin-bottom: 8px;
}

.historial__empty {
  font-size: 13px;
  color: #9CA3AF;
  padding: 8px 0;
  font-style: italic;
}

.historial__entry {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 8px 0;
  border-bottom: 0.5px solid #F3F4F6;
  font-size: 13px;
}

.historial__entry:last-child {
  border-bottom: none;
}

.historial__fecha {
  color: #9CA3AF;
  min-width: 100px;
  font-size: 12px;
  white-space: nowrap;
}

.historial__motivacion {
  color: #374151;
  line-height: 1.5;
}

.erm-status-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  padding: 6px 16px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  border: 1.5px solid #E5E7EB;
  background: #F9FAFB;
  color: #6B7280;
  cursor: pointer;
  transition: all 0.15s ease;
}

.erm-status-btn:hover:not(:disabled) {
  border-color: #2563EB;
  color: #2563EB;
  background: #EFF6FF;
}

.erm-status-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.erm-spinner {
  animation: erm-spin 0.8s linear infinite;
}

@keyframes erm-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.erm-footer {
  padding: 12px 24px 16px;
  gap: 8px;
}

.erm-btn-cancel {
  font-size: 13px;
  font-weight: 500;
}

.erm-btn-save {
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  padding: 0 20px;
  min-height: 36px;
}
</style>
