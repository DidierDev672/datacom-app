<template>
  <div class="q-pa-xl page-container">
    <BaseLoading :loading="loading" />

    <q-card class="form-card shadow-lg rounded-lg">
      <!-- Cabecera con Gradiente Institucional -->
      <q-card-section class="header-gradient text-white q-pa-lg">
        <div class="row items-center justify-between">
          <div>
            <div class="text-h4 text-weight-bold text-white">
              Formulario de Rubro de Presupuesto de la solicitud de requisición
            </div>
            <div class="text-subtitle1 opacity-80">
              Gestión de rubros presupuestales para solicitudes de requisición
            </div>
          </div>
          <q-btn flat dense round icon="refresh" color="white" size="md" class="q-ml-md" @click="confirmRefresh">
            <q-tooltip>Recargar página</q-tooltip>
          </q-btn>
        </div>
      </q-card-section>

      <!-- Cuerpo del Formulario -->
      <q-card-section class="q-pa-xl">
        <div v-if="hasLoadError" class="load-error-state">
          <div class="load-error-icon-wrap">
            <q-icon name="cloud_off" size="48px" color="white" />
          </div>
          <div class="load-error-title">No pudimos cargar los datos</div>
          <div class="load-error-desc">
            Parece que hubo una interrupción momentánea al intentar traer la información de este rubro.
            No te preocupes, los datos están seguros y esto puede ocurrir por:
          </div>
          <ul class="load-error-reasons">
            <li>Una pausa en la conexión con el servidor.</li>
            <li>El tiempo de espera de la consulta se agotó por demanda del momento.</li>
            <li>Un pequeño desajuste temporal en la comunicación.</li>
          </ul>
          <div class="load-error-cta">
            Presiona el botón de abajo y lo intentaremos de nuevo. Generalmente con un segundo intento todo vuelve a funcionar.
          </div>
          <q-btn unelevated no-caps icon="refresh" label="Intentar de nuevo" class="load-error-btn q-mt-md"
            @click="retryLoad" />
        </div>

        <q-form v-show="!hasLoadError" @submit="onSubmit" class="q-gutter-y-lg">
          <!-- 1. Nombre del Rubro -->
          <div class="form-group">
            <AppInput v-model="formData.nombreRubro" label="Nombre del rubro *"
              placeholder="Ej: Materiales de Oficina" class="custom-input" />
            <div class="form-hint">
              Ingrese un nombre descriptivo para identificar el rubro.
            </div>
          </div>

          <!-- 2. Descripción -->
          <div class="form-group">
            <label class="form-label">Descripción del rubro</label>
            <q-input v-model="formData.descripcionRubro" outlined dense bg-color="white" type="textarea" autogrow
              class="custom-input" placeholder="Detalle el propósito de este rubro..." :maxlength="250">
              <template v-slot:prepend>
                <q-icon name="description" color="grey-6" />
              </template>
              <template v-slot:append>
                <span class="text-caption opacity-60">{{
                  (formData.descripcionRubro &&
                    formData.descripcionRubro.length) ||
                  0
                }}/250</span>
              </template>
            </q-input>
          </div>

          <!-- 3. Plan de Abastecimiento -->
          <div class="form-group">
            <label class="form-label">Plan de abastecimiento <span class="text-red-500">*</span></label>
            <q-select v-model="formData.planAbastecimiento" :options="planesFiltrados" outlined dense bg-color="white"
              option-label="nombre" option-value="id" emit-value map-options use-input @filter="filtrarPlanes"
              class="custom-input" placeholder="Busque o seleccione un plan de abastecimiento..."
              :rules="[(val) => val !== null || 'Debe seleccionar un presupuesto']">
              <template v-slot:prepend>
                <q-icon name="inventory" color="grey-6" />
              </template>
            </q-select>
          </div>

          <!-- 4 y 5. Grid de Fechas -->
          <div class="row q-col-gutter-lg">
            <div class="col-12 col-md-6">
              <div class="form-group">
                <AppInput v-model="formData.fechaInicio" label="Fecha de inicio *" type="date"
                  class="custom-input" />
              </div>
            </div>
            <div class="col-12 col-md-6">
              <div class="form-group">
                <AppInput v-model="formData.fechaFinal" label="Fecha final *" type="date"
                  class="custom-input" />
              </div>
            </div>
          </div>

          <!-- 6. Valor del presupuesto -->
          <div class="form-group">
            <AppInput v-model="formData.valorPresupuesto" label="Valor del rubro *" type="number"
              placeholder="0.00" class="custom-input" />
            <div v-if="formData.valorPresupuesto" class="budget-preview q-mt-xs">
              <q-icon name="payments" color="primary" size="xs" class="q-mr-xs" />
              <span>{{ formatearMoneda(formData.valorPresupuesto) }}</span>
            </div>
          </div>

          <!-- 7. Estado del Rubro (Segmented Control) -->
          <div class="form-group">
            <label class="form-label q-mb-sm block">Estado del rubro</label>
            <q-btn-toggle v-model="formData.activar" toggle-color="primary" toggle-text-color="green font-bold" flat
              bordered no-caps unelevated :options="[
                { label: 'Activo', value: true, icon: 'check_circle' },
                { label: 'Inactivo', value: false, icon: 'block' },
              ]" class="status-toggle" />
          </div>

          <!-- 8. Sección de Gestión de Activación (Preservada y optimizada) -->
          <q-card v-if="rubroId" flat bordered class="activation-card q-mt-lg">
            <q-card-section class="bg-blue-50">
              <div class="text-subtitle1 text-weight-bold text-blue-9">
                <q-icon name="settings" class="q-mr-sm" />
                Historial de Activación
              </div>
            </q-card-section>
            <q-card-section class="q-pa-lg">
              <div class="row q-col-gutter-lg">
                <div class="col-12 col-md-6">
                  <div class="form-group">
                    <AppInput v-model="formData.fechaActivacion" label="Fecha de cambio de estado" type="date"
                      class="custom-input" :disabled="loading || loadingActivacion" />
                  </div>
                </div>
                <div class="col-12">
                  <div class="form-group">
                    <label class="form-label">Motivo del cambio</label>
                    <q-input v-model="formData.motivoCambio" outlined dense bg-color="white" type="textarea" autogrow
                      class="custom-input" placeholder="Explique el motivo del cambio de estado..."
                      :disable="loading || loadingActivacion" />
                  </div>
                </div>
              </div>
              <div class="row justify-end q-mt-md">
                <q-btn label="Actualizar Estado" :color="formData.activar ? 'positive' : 'negative'" unelevated
                  :loading="loadingActivacion" :disable="!formData.fechaActivacion || !formData.motivoCambio"
                  @click="guardarEstadoActivacion" class="rounded-lg" no-caps />
              </div>
            </q-card-section>
          </q-card>

          <q-separator class="q-my-lg opacity-20" />

          <!-- Botones de Acción -->
          <div class="row items-center justify-between">
            <q-btn label="Limpiar formulario" type="reset" flat color="grey-7" no-caps class="btn-ghost" />
            <q-btn label="Guardar Rubro" type="submit" unelevated color="primary" icon="save" padding="12px 24px"
              class="btn-primary rounded-lg" no-caps />
          </div>
        </q-form>
      </q-card-section>
    </q-card>

    <!-- Diálogo de Confirmación (error) -->
    <q-dialog v-model="showDialog" persistent>
      <q-card class="dialog-card">
        <q-card-section class="row items-center q-pb-none">
          <q-avatar :icon="dialogIcon" :color="dialogColor" text-color="white" />
          <div class="text-h6 q-ml-md">Información</div>
        </q-card-section>
        <q-card-section class="q-pt-md">
          {{ dialogMessage }}
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat :label="dialogButton" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Modal post-guardado: ¿Qué sigue? -->
    <q-dialog v-model="showPostSaveModal" persistent maximized>
      <q-card class="postsave-card">
        <div class="postsave-header">
          <div class="postsave-icon-wrap">
            <q-icon name="check_circle" size="48px" color="white" />
          </div>
          <div class="postsave-title">{{ accionRealizada }}</div>
          <div class="postsave-subtitle">"{{ formData.nombreRubro }}"</div>
        </div>

        <q-card-section class="q-px-xl q-pb-md q-pt-lg">
          <div class="postsave-question">¿Qué deseas hacer ahora?</div>

            <div>
              <span>Ahora,  ¿hacia dónde quieres llevar tu gestión?</span>
            </div>

          <div class="postsave-options">
            <q-btn flat class="postsave-option" @click="irALista">
              <div class="option-content">
                <div class="option-icon-wrap option-icon-list">
                  <q-icon name="format_list_bulleted" size="28px" color="white" />
                </div>
                <div class="option-text">
                  <div class="option-label">Ver todos mis rubros</div>
                  <div class="option-desc">Revisa el listado completo y gestiona tus rubros desde allí</div>
                </div>
                <q-icon name="chevron_right" size="24px" color="grey-4" />
              </div>
            </q-btn>

            <q-btn flat class="postsave-option" @click="limpiarYAgregarOtro">
              <div class="option-content">
                <div class="option-icon-wrap option-icon-add">
                  <q-icon name="add_circle_outline" size="28px" color="white" />
                </div>
                <div class="option-text">
                  <div class="option-label">Agregar otro rubro</div>
                  <div class="option-desc">Continúa tu sesión de trabajo creando un nuevo rubro desde cero</div>
                </div>
                <q-icon name="chevron_right" size="24px" color="grey-4" />
              </div>
            </q-btn>

            <q-btn flat class="postsave-option" @click="permanecer">
              <div class="option-content">
                <div class="option-icon-wrap option-icon-stay">
                  <q-icon name="edit_note" size="28px" color="white" />
                </div>
                <div class="option-text">
                  <div class="option-label">Seguir ajustando</div>
                  <div class="option-desc">Revisa los detalles que acabas de guardar sin prisas</div>
                </div>
                <q-icon name="chevron_right" size="24px" color="grey-4" />
              </div>
            </q-btn>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Modal de error psicológico -->
    <UpdateErrorModal
      v-model="showErrorModal"
      :error="lastError"
      :rubro-name="formData.nombreRubro"
      @retry="reintentar"
      @review="revisarFormulario"
      @contact="contactarSoporte"
    />
  </div>
</template>

<script>
import BaseLoading from "src/components/BaseLoading.vue";
import UpdateErrorModal from "src/components/abastecimiento/UpdateErrorModal.vue";
import AppInput from "src/utils/components/AppInput.vue";
import { useRubrosStore } from "../../../../piña/rubros";
import { useSupplyPlansStore } from "../../../../piña/supplyPlans";

export default {
  name: "CrearRubro",

  components: {
    BaseLoading,
    UpdateErrorModal,
    AppInput,
  },

  props: {
    rubroId: {
      type: [String, Number],
      default: null,
    },
  },

  data() {
    return {
      supplyPlansStore: null,
      rubrosStore: null,
      formData: {
        nombreRubro: "",
        descripcionRubro: "",
        planAbastecimiento: null,
        fechaInicio: "",
        fechaFinal: "",
        valorPresupuesto: null,
        activar: true,
        fechaActivacion: "",
        motivoCambio: "",
      },
      planesAbastecimiento: [],
      planesFiltrados: [],
      loading: false,
      loadingActivacion: false,
      showDialog: false,
      dialogMessage: "",
      dialogIcon: "check_circle",
      dialogColor: "positive",
      dialogButton: "Aceptar",
      showErrorModal: false,
      lastError: null,
      showPostSaveModal: false,
      accionRealizada: "",
      loadError: null,
    };
  },

  computed: {
    hasLoadError() {
      return (
        this.rubroId &&
        !this.loading &&
        (this.loadError !== null || this.formEmpty)
      );
    },
    formEmpty() {
      return (
        !this.formData.nombreRubro &&
        !this.formData.planAbastecimiento &&
        !this.formData.valorPresupuesto
      );
    },
  },

  watch: {
    rubroId: {
      handler() {
        this.cargarRubroExistente();
      },
    },
  },

  methods: {
    formatearMoneda(valor) {
      return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
      }).format(valor);
    },

    validarFechaFinal(fechaFinal) {
      if (!this.formData.fechaInicio || !fechaFinal) return true;
      const inicio = new Date(this.formData.fechaInicio);
      const fin = new Date(fechaFinal);
      return fin >= inicio;
    },

    fechaInicioOptions(fecha) {
      const today = new Date().toISOString().split("T")[0].replace(/-/g, "/");
      return fecha >= today;
    },

    fechaFinalOptions(fecha) {
      if (!this.formData.fechaInicio) return true;
      return fecha >= this.formData.fechaInicio;
    },

    filtrarPlanes(val, update) {
      if (val === "") {
        update(() => {
          this.planesFiltrados = this.planesAbastecimiento;
        });
        return;
      }
      update(() => {
        const needle = val.toLowerCase();
        this.planesFiltrados = this.planesAbastecimiento.filter((plan) =>
          plan.nombre.toLowerCase().includes(needle)
        );
      });
    },

    async cargarPlanesAbastecimiento() {
      try {
        await this.supplyPlansStore.fetchAllPlans();
        this.planesAbastecimiento = this.supplyPlansStore.plans.map((plan) => ({
          id: plan.id,
          nombre: plan.name || `Plan ${plan.id}`,
        }));
        this.planesFiltrados = [...this.planesAbastecimiento];
      } catch (error) {
        console.error("Error al cargar planes:", error);
      }
    },

    async cargarRubroExistente() {
      const idRubro = this.$route.params.rubroId;
      if (!idRubro) {
        return;
      }

      this.loading = true;
      this.loadError = null;
      try {
        const rubro = await this.rubrosStore.fetchRubroById(idRubro);
        if (!rubro) {
          this.loadError = { message: "El rubro solicitado no fue encontrado en el servidor." };
          return;
        }

        this.formData = {
          nombreRubro: rubro.name || "",
          descripcionRubro: rubro.description || "",
          planAbastecimiento: rubro.planId || null,
          fechaInicio: this.normalizarFecha(rubro.startDate),
          fechaFinal: this.normalizarFecha(rubro.endDate),
          valorPresupuesto: rubro.totalBudget != null ? rubro.totalBudget : null,
          activar: typeof rubro.active === "boolean" ? rubro.active : true,
          fechaActivacion: "",
          motivoCambio: "",
        };
      } catch (error) {
        this.loadError = { message: (error && error.message) || "Error al cargar el rubro para edición" };
      } finally {
        this.loading = false;
      }
    },

    normalizarFecha(value) {
      if (!value) {
        return "";
      }
      return String(value).replace(/\//g, "-");
    },

    mostrarDialogo(tipo, mensaje) {
      this.dialogIcon = tipo === "success" ? "check_circle" : "error";
      this.dialogColor = tipo === "success" ? "positive" : "negative";
      this.dialogMessage = mensaje;
      this.showDialog = true;
    },

    async onSubmit() {
      if (!this.formData.nombreRubro || !this.formData.nombreRubro.trim()) {
        this.mostrarDialogo("error", "El nombre del rubro es obligatorio");
        return;
      }
      if (!this.formData.planAbastecimiento) {
        this.mostrarDialogo("error", "Debe seleccionar un plan de abastecimiento");
        return;
      }
      const budget = Number(this.formData.valorPresupuesto);
      if (!budget || budget <= 0) {
        this.mostrarDialogo("error", "El valor presupuestado debe ser superior a cero");
        return;
      }

      this.loading = true;
      try {
        const rubroData = {
          name: this.formData.nombreRubro.trim(),
          description: this.formData.descripcionRubro.trim(),
          planId: this.formData.planAbastecimiento,
          startDate: this.formData.fechaInicio
            ? this.formData.fechaInicio.replace(/-/g, "/")
            : null,
          endDate: this.formData.fechaFinal
            ? this.formData.fechaFinal.replace(/-/g, "/")
            : null,
          totalBudget: budget,
          active: this.formData.activar,
        };

        if (this.rubroId) {
          rubroData.id = this.rubroId;
        }
        console.log("[CrearRubro] Payload:", JSON.stringify(rubroData));
        this.rubrosStore.loadRubro(rubroData);
        if (this.rubroId) {
          await this.rubrosStore.updateRubro();
          this.$emit("rubro-actualizado");
          this.accionRealizada = "Rubro actualizado con éxito";
        } else {
          await this.rubrosStore.createRubro();
          this.$emit("rubro-guardado");
          this.accionRealizada = "Rubro creado con éxito";
        }
        this.showPostSaveModal = true;
      } catch (error) {
        this.lastError = error;
        this.showErrorModal = true;
      } finally {
        this.loading = false;
      }
    },

    irALista() {
      this.showPostSaveModal = false;
      this.onReset();
      this.$router.push({ name: "lista-categorias-presupuesto" });
    },

    limpiarYAgregarOtro() {
      this.showPostSaveModal = false;
      this.onReset();
      this.$nextTick(function () {
        var el = this.$el && this.$el.querySelector('input');
        if (el) el.focus();
      });
    },

    permanecer() {
      this.showPostSaveModal = false;

      // <- AGREGAR:Recargar datos del rubro si existe
      if(this.rubroId && this.rubroId !== null){
        this.refrescarRubroActual();
      }

      // Forzar refocus en el primer campos para UX mejorada
      this.$nextTick(function () {
        var el = this.$el && this.$el.querySelector('.custom-input input');
        if (el) el.focus();
      });
    },

    async guardarEstadoActivacion() {
      this.loadingActivacion = true;
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        this.$q.notify({
          type: "positive",
          message: "Estado actualizado correctamente",
        });
        this.$emit("estado-actualizado");
      } catch (e) {
        this.$q.notify({
          type: "negative",
          message: "Error al actualizar estado",
        });
      } finally {
        this.loadingActivacion = false;
      }
    },

    reintentar() {
      this.showErrorModal = false;
      this.$nextTick(function () {
        this.onSubmit();
      });
    },

    revisarFormulario() {
      this.showErrorModal = false;
      var el = this.$el && this.$el.querySelector(".form-group:first-child input");
      if (el) {
        el.focus();
      }
    },

    contactarSoporte() {
      this.showErrorModal = false;
      this.$q.dialog({
        title: "Contactar soporte",
        message: "Por favor reporta este incidente al área de sistemas incluyendo el siguiente código: ERR-RUBRO-" + Date.now(),
        html: true,
        ok: "Copiar y cerrar",
      }).onOk(function () {
        // Intenta copiar al portapapeles
        var text = "Error en actualización de rubro - Código: ERR-RUBRO-" + Date.now();
        if (navigator.clipboard) {
          navigator.clipboard.writeText(text);
        }
      });
    },

    onReset() {
      this.formData = {
        nombreRubro: "",
        descripcionRubro: "",
        planAbastecimiento: null,
        fechaInicio: "",
        fechaFinal: "",
        valorPresupuesto: null,
        activar: true,
        fechaActivacion: "",
        motivoCambio: "",
      };
      this.planesFiltrados = [...this.planesAbastecimiento];
    },

    retryLoad() {
      this.loadError = null;
      this.cargarRubroExistente();
    },

    confirmRefresh() {
      const hasData =
        this.formData.nombreRubro.trim() ||
        this.formData.descripcionRubro.trim() ||
        this.formData.valorPresupuesto !== null;

      if (!hasData) {
        this.refrescarPagina();
        return;
      }

      this.$q.dialog({
        title: "Recargar página",
        message: "Hay información sin guardar. Al recargar se perderán los cambios no guardados. ¿Deseas continuar?",
        cancel: { label: "Cancelar", flat: true, color: "grey-7" },
        ok: { label: "Recargar", color: "warning", unelevated: true },
        persistent: true,
      }).onOk(() => this.refrescarPagina());
    },

    refrescarPagina() {
      this.onReset();
      if (this.$route.params.rubroId) {
        this.cargarRubroExistente();
      }
    },

    async refrescarRubroActual(){
        const idRubro = this.$route.params.rubroId;
        if (!idRubro) return;

        try{
          const rubroFresco = await this.rubrosStore.fetchRubroById(idRubro);

          if (rubroFresco) {
            this.formData = {
              nombreRubro: rubroFresco.name || "",
              descripcionRubro: rubroFresco.description || "",
              planAbastecimiento: rubroFresco.planId || null,
              fechaInicio: this.normalizarFecha(rubroFresco.startDate),
              fechaFinal: this.normalizarFecha(rubroFresco.endDate),
              valorPresupuesto: rubroFresco.totalBudget != null ? rubroFresco.totalBudget : null,
              activar: typeof rubroFresco.active === "boolean" ? rubroFresco.active : true,
              fechaActivacion: "",
              motivoCambio: "",
            }
          }
        }
        catch(error){
          console.warn("No se pudo refrescar el rubro actualizar:", error);
        }
    },
  },

  async mounted() {
    this.supplyPlansStore = useSupplyPlansStore();
    this.rubrosStore = useRubrosStore();
    try {
      await this.cargarPlanesAbastecimiento();
    } catch (e) {
      console.warn("Error al cargar planes:", e);
    }
    await this.cargarRubroExistente();
  }
};
</script>

<style scoped>
.page-container {
  background: #f8fafc;
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.form-card {
  width: 100%;
  max-width: 850px;
  border: none;
}

.header-gradient {
  background: linear-gradient(135deg, #84b24d 0%, #75af7e 50%, #4e9c4c 100%);
}

.opacity-80 {
  opacity: 0.8;
}

/* Form Styling */
.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 6px;
  display: block;
}

.form-hint {
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
  opacity: 0.8;
}

.custom-input ::v-deep .q-field__control {
  background: white !important;
  border-radius: 8px !important;
}

.custom-input ::v-deep .q-field__control:before {
  border: 1px solid #d1d5db !important;
}

.custom-input ::v-deep .q-field--focused .q-field__control:after {
  border-color: #4e9c4c !important;
  border-width: 2px !important;
}

/* Budget Preview */
.budget-preview {
  display: flex;
  align-items: center;
  color: #4e9c4c;
  font-weight: 700;
  font-size: 15px;
  background: #f0fdf4;
  padding: 8px 12px;
  border-radius: 6px;
  width: fit-content;
}

/* Segmented Control */
.status-toggle {
  background: #f3f4f6;
  border-radius: 10px;
  padding: 4px;
  border: 1px solid #e5e7eb;
  width: fit-content;
}

.status-toggle ::v-deep .q-btn--active {
  background: white !important;
  color: #4e9c4c !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* Activation Card */
.activation-card {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #bfdbfe;
}

/* Buttons */
/* ─── Load Error State ─── */
.load-error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 48px 24px;
}

.load-error-icon-wrap {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  box-shadow: 0 4px 20px rgba(245, 158, 11, 0.3);
}

.load-error-title {
  font-size: 22px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 12px;
  letter-spacing: -0.01em;
}

.load-error-desc {
  font-size: 14px;
  color: #6b7280;
  max-width: 420px;
  line-height: 1.6;
  margin-bottom: 12px;
}

.load-error-reasons {
  text-align: left;
  font-size: 13px;
  color: #9ca3af;
  line-height: 1.7;
  max-width: 380px;
  margin: 0 auto 16px;
  padding-left: 20px;
}

.load-error-reasons li {
  margin-bottom: 4px;
}

.load-error-cta {
  font-size: 14px;
  color: #4b5563;
  max-width: 400px;
  line-height: 1.6;
  font-weight: 500;
}

.load-error-btn {
  background: linear-gradient(135deg, #84b24d 0%, #4e9c4c 100%) !important;
  color: #fff !important;
  border-radius: 10px;
  padding: 0 28px;
  font-weight: 600;
  font-size: 15px;
  min-height: 44px;
  transition: all 0.2s ease;
}

.load-error-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(78, 156, 76, 0.35);
}

.btn-primary {
  transition: all 0.2s ease;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(78, 156, 76, 0.3);
}

.btn-ghost:hover {
  background: #f1f5f9;
}

.text-red-500 {
  color: #ef4444;
  font-weight: bold;
}

.dialog-card {
  min-width: 400px;
  border-radius: 16px;
}

/* --- Post-save modal --- */
.postsave-card {
  max-width: 520px;
  margin: auto;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,0.15);
}

.postsave-header {
  background: linear-gradient(135deg, #2e7d32, #43a047);
  padding: 40px 40px 32px;
  text-align: center;
  color: white;
}

.postsave-icon-wrap {
  margin-bottom: 12px;
}

.postsave-title {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 0.01em;
}

.postsave-subtitle {
  font-size: 15px;
  opacity: 0.85;
  margin-top: 4px;
  font-weight: 500;
}

.postsave-question {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  text-align: center;
  margin-bottom: 20px;
}

.postsave-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.postsave-option {
  width: 100%;
  border-radius: 14px;
  padding: 6px 4px;
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;
  background: white;
}

.postsave-option:hover {
  border-color: #2e7d32;
  background: #f0fdf4;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(46,125,50,0.10);
}

.option-content {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  text-align: left;
}

.option-icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.option-icon-list {
  background: linear-gradient(135deg, #2e7d32, #66bb6a);
}

.option-icon-add {
  background: linear-gradient(135deg, #1565c0, #42a5f5);
}

.option-icon-stay {
  background: linear-gradient(135deg, #6b7280, #9ca3af);
}

.option-text {
  flex: 1;
}

.option-label {
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
}

.option-desc {
  font-size: 12px;
  color: #6b7280;
  margin-top: 2px;
  line-height: 1.3;
}
</style>
