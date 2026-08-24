<template>
  <div class="q-pa-xl page-container">
    <q-card class="form-card shadow-lg rounded-lg">
      <!-- Cabecera con Gradiente Institucional -->
      <q-card-section class="header-gradient text-white q-pa-lg">
        <div class="text-h4 text-weight-bold text-white">
          Plan de abastecimiento
        </div>
        <div class="text-subtitle1 opacity-80">
          Complete los detalles para la planificación estratégica del plan de abastecimiento
        </div>
      </q-card-section>

      <!-- Cuerpo del Formulario -->
      <q-card-section class="q-pa-xl">
        <q-form ref="formRef" @submit="onSubmit" class="q-gutter-y-lg">
          <!-- Nombre del Plan -->
          <div class="form-group">
            <label class="form-label">Nombre del plan de abastecimiento <span class="text-red-500">*</span></label>
            <AppInput :value="formData.name" @input="formData.name = $event" label="Nombre del plan de abastecimiento"
              placeholder="Ej: Plan de abastecimiento 2026" />
            <div class="form-hint">
              Identifique el plan de abastecimiento con un nombre claro y descriptivo.
            </div>
          </div>

          <!-- Líder del Plan -->
          <div class="form-group">
            <label class="form-label">Líder del plan de abastecimiento <span class="text-red-500">*</span></label>
            <div class="leader-input-row">
              <AppInput :value="formData.ownerId" @input="formData.ownerId = $event"
                label="Nombre del responsable técnico" placeholder="Nombre del responsable técnico"
                class="leader-field" />
              <q-btn unelevated no-caps color="primary" icon="person_search" label="Seleccionar"
                class="btn-select-leader" @click="openCollaboratorDialog" />
            </div>
            <div class="form-hint">
              Elija un colaborador registrado o escriba el nombre manualmente.
            </div>
          </div>

          <!-- Grid de Fechas -->
          <div class="row q-col-gutter-lg">
            <div class="col-12 col-md-6">
              <div class="form-group">
                <label class="form-label">Fecha de inicio <span class="text-red-500">*</span></label>
                <q-input v-model="formData.startDate" outlined dense bg-color="white" mask="date" class="custom-input"
                  placeholder="AAAA/MM/DD" :rules="['date']">
                  <template v-slot:prepend>
                    <q-icon name="event" class="cursor-pointer" color="grey-6">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="formData.startDate" mask="YYYY-MM-DD" />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>
            <div class="col-12 col-md-6">
              <div class="form-group">
                <label class="form-label">Fecha final <span class="text-red-500">*</span></label>
                <q-input v-model="formData.endDate" outlined dense bg-color="white" mask="date" class="custom-input"
                  placeholder="AAAA/MM/DD" :rules="[
                    'date',
                    (val) =>
                      val >= formData.startDate ||
                      'Debe ser posterior al inicio',
                  ]">
                  <template v-slot:prepend>
                    <q-icon name="event" class="cursor-pointer" color="grey-6">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="formData.endDate" mask="YYYY-MM-DD" />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>
          </div>

          <!-- Estado del Plan (Segmented Control) -->
          <div class="form-group">
            <label class="form-label q-mb-sm block">Estado del plan de abastecimiento <span
                class="text-red-500">*</span></label>
            <q-btn-toggle v-model="formData.status" toggle-color="positive" toggle-text-color="green font-bold" flat
              bordered no-caps unelevated rounded :options="statusToggleOptions" class="status-toggle" />
          </div>

          <q-separator class="q-my-lg opacity-20" />

          <!-- Botones de Acción -->
          <div class="row items-center justify-between">
            <q-btn label="Limpiar formulario" type="button" flat color="grey-7" no-caps class="btn-ghost"
              @click="clearForm" />
            <q-btn label="Guardar Plan de Abastecimiento" type="submit" unelevated color="primary" icon="save"
              padding="12px 24px" class="btn-primary rounded-lg" no-caps />
          </div>
        </q-form>
      </q-card-section>

      <!-- Loading Overlay -->
      <q-inner-loading :showing="loading">
        <q-spinner-circles size="64px" color="primary" />
      </q-inner-loading>
    </q-card>

    <!-- Diálogo: seleccionar colaborador -->
    <q-dialog v-model="showCollaboratorDialog" transition-show="scale" transition-hide="scale">
      <q-card class="dialog-card collaborator-dialog">
        <q-card-section class="row items-center q-pb-sm">
          <q-avatar icon="groups" color="primary" text-color="white" />
          <div class="text-h6 q-ml-md">Seleccionar colaborador</div>
          <q-space />
          <q-btn v-close-popup flat round dense icon="close" />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <AppInput :value="collaboratorSearch" @input="collaboratorSearch = $event" label="Buscar colaborador"
            placeholder="Buscar por nombre, documento o cargo..." class="q-mb-md" />

          <q-inner-loading :showing="loadingCollaborators">
            <q-spinner-dots size="40px" color="primary" />
          </q-inner-loading>

          <q-list v-if="filteredCollaborators.length" bordered separator class="rounded-borders collaborator-list">
            <q-item v-for="colaborador in filteredCollaborators" :key="colaborador.id" clickable v-ripple
              @click="selectCollaborator(colaborador)">
              <q-item-section avatar>
                <q-avatar color="grey-3" text-color="grey-8" icon="person" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ colaborador.nombreCompleto }}</q-item-label>
                <q-item-label caption>
                  {{
                    colaborador.codigoCargo ||
                    colaborador.correoElectronico ||
                    "Sin cargo"
                  }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-icon name="chevron_right" color="grey-5" />
              </q-item-section>
            </q-item>
          </q-list>

          <div v-else-if="!loadingCollaborators" class="text-center text-grey-6 q-pa-lg">
            No hay colaboradores que coincidan con la búsqueda.
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="grey-7" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Diálogo de Confirmación Mejorado -->
    <q-dialog v-model="showDialog" persistent transition-show="scale" transition-hide="scale">
      <q-card class="dialog-card">
        <q-card-section class="row items-center q-pb-none">
          <q-avatar icon="check_circle" color="positive" text-color="white" size="48px" />
          <div class="text-h6 q-ml-md">Operación Exitosa</div>
        </q-card-section>

        <q-card-section class="q-pt-md">
          {{ dialogMessage }}
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Entendido" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { computed, nextTick, ref } from "@vue/composition-api";
import { colaboradoresApi } from "src/api/colaboradores.api";
import { useSupplyPlansStore } from "src/piña/supplyPlans";
import AppInput from "src/utils/components/AppInput.vue";

export default {
  name: "CrearPlanAbastecimiento",
  components: {
    AppInput,
  },
  setup() {
    const store = useSupplyPlansStore();
    const formRef = ref(null);
    const showDialog = ref(false);
    const dialogMessage = ref("");
    const showCollaboratorDialog = ref(false);
    const collaboratorSearch = ref("");
    const collaborators = ref([]);
    const loadingCollaborators = ref(false);

    const filteredCollaborators = computed(function () {
      const term = (collaboratorSearch.value || "").toLowerCase().trim();
      if (!term) {
        return collaborators.value;
      }
      return collaborators.value.filter(function (c) {
        const nombre = (c.nombreCompleto || "").toLowerCase();
        const documento = (c.numeroDocumento || "").toLowerCase();
        const cargo = (c.codigoCargo || "").toLowerCase();
        const correo = (c.correoElectronico || "").toLowerCase();
        return (
          nombre.indexOf(term) !== -1 ||
          documento.indexOf(term) !== -1 ||
          cargo.indexOf(term) !== -1 ||
          correo.indexOf(term) !== -1
        );
      });
    });

    const loadCollaborators = async function () {
      loadingCollaborators.value = true;
      try {
        const list = await colaboradoresApi.getAll();
        const arr = Array.isArray(list) ? list : [];
        collaborators.value = arr.filter(function (c) {
          if (!c || !c.estado) return true;
          return c.estado === "Activo" || c.estado === "ACTIVO";
        });
      } catch (error) {
        dialogMessage.value =
          "No se pudieron cargar los colaboradores: " +
          (error.message || "Error de conexión");
        showDialog.value = true;
      } finally {
        loadingCollaborators.value = false;
      }
    };

    const openCollaboratorDialog = function () {
      collaboratorSearch.value = "";
      showCollaboratorDialog.value = true;
      if (!collaborators.value.length) {
        loadCollaborators();
      }
    };

    const selectCollaborator = function (colaborador) {
      if (colaborador && colaborador.nombreCompleto) {
        store.form.ownerId = colaborador.nombreCompleto;
      }
      showCollaboratorDialog.value = false;
    };

    // Opciones para el Segmented Control
    const statusToggleOptions = [
      { label: "Planificación", value: "en_planificacion", icon: "edit" },
      { label: "Activo", value: "activo", icon: "play_arrow" },
      { label: "En Pausa", value: "en_pausa", icon: "pause" },
      { label: "Finalizado", value: "finalizado", icon: "done_all" },
    ];

    const clearForm = function () {
      store.resetForm();
      collaboratorSearch.value = "";
      nextTick(function () {
        if (formRef.value) {
          formRef.value.resetValidation();
        }
      });
    };

    const executeSave = async function () {
      const saved = await store.saveProject();

      if (!saved || (store.errors && Object.keys(store.errors).length > 0)) {
        throw new Error(
          store.errors.general || "Error al procesar la solicitud"
        );
      }

      let mensaje = "El plan de abastecimiento \"" + store.form.name +
        "\" ha sido creado y registrado correctamente en el sistema.";

      if (store.warnings && store.warnings.length > 0) {
        mensaje += "\n\n" + store.warnings.join("\n");
      }

      dialogMessage.value = mensaje;
      showDialog.value = true;
      clearForm();
    };

    const onSubmit = async function () {
      try {
        if (formRef.value) {
          const valid = await formRef.value.validate();
          if (!valid) {
            return;
          }
        }

        if (store.form.startDate && store.form.endDate) {
          const inicio = new Date(store.form.startDate);
          const fin = new Date(store.form.endDate);
          if (fin <= inicio) {
            throw new Error("La fecha final debe ser posterior al inicio");
          }
        }

        await executeSave();
      } catch (error) {
        dialogMessage.value = error.message;
        showDialog.value = true;
      }
    };

    return {
      formRef,
      formData: store.form,
      loading: store.isSubmitting,
      statusToggleOptions,
      showDialog,
      dialogMessage,
      showCollaboratorDialog,
      collaboratorSearch,
      loadingCollaborators,
      filteredCollaborators,
      openCollaboratorDialog,
      selectCollaborator,
      clearForm,
      onSubmit,
    };
  },
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

/* Tipografía y Etiquetas */
.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  /* Gray-700 */
  margin-bottom: 6px;
  display: block;
}

.form-hint {
  font-size: 12px;
  color: #6b7280;
  /* Gray-500 */
  margin-top: 4px;
  opacity: 0.8;
}

/* Custom Input Styling */
.custom-input ::v-deep .q-field__control {
  background: white !important;
  border-radius: 8px !important;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.custom-input ::v-deep .q-field__control:before {
  border: 1px solid #d1d5db !important;
  /* Gray-300 */
}

.custom-input ::v-deep .q-field__control:hover:before {
  border-color: #9ca3af !important;
  /* Gray-400 */
}

.custom-input ::v-deep .q-field--focused .q-field__control:after {
  border-width: 2px !important;
  border-color: #4e9c4c !important;
  /* Usando verde institucional para el focus */
}

/* Segmented Control (Toggle) */
.status-toggle {
  background: #f3f4f6;
  border-radius: 10px;
  padding: 4px;
  border: 1px solid #e5e7eb;
}

.status-toggle ::v-deep .q-btn {
  border-radius: 8px;
  margin: 0 2px;
  padding: 8px 16px;
  color: #6b7280;
}

.status-toggle ::v-deep .q-btn--active {
  background: white !important;
  color: #4e9c4c !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* Botones */
.btn-primary {
  transition: all 0.2s ease;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(78, 156, 76, 0.3);
}

.btn-ghost {
  font-weight: 500;
}

.btn-ghost:hover {
  background: #f1f5f9;
}

/* Diálogos */
.dialog-card {
  border-radius: 16px;
  padding: 8px;
  min-width: 400px;
}

.collaborator-dialog {
  width: 100%;
  max-width: 520px;
}

.collaborator-list {
  max-height: 360px;
  overflow-y: auto;
}

.leader-input-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  width: 100%;
}

.leader-input-row .leader-field {
  flex: 1 1 auto;
  min-width: 0;
}

.btn-select-leader {
  flex-shrink: 0;
  height: 40px;
  min-height: 40px;
  max-height: 40px;
  padding: 0 20px;
  margin: 0;
  margin-top: -15px;
  align-self: center;
}

.leader-input-row ::v-deep .q-field--dense .q-field__control {
  min-height: 40px;
  height: 40px;
}

.leader-input-row ::v-deep .q-field--dense .q-field__marginal {
  height: 40px;
}

.text-red-500 {
  color: #ef4444;
  font-weight: bold;
}
</style>
