<template>
  <q-page class="pt-page q-pa-md">
    <div class="pt-inner">
      <!-- Encabezado compacto: título + resumen -->
      <header class="pt-header">
        <h1 class="pt-title">
          {{ pageTitle }}
        </h1>
        <p class="pt-sub">
          Configura la información base del cargo para clasificación, búsqueda y contratación.
        </p>
        <div class="pt-progress" aria-label="Progreso mental del formulario">
          <span class="pt-progress-item pt-progress-item--active">Información básica</span>
          <span class="pt-progress-sep">•</span>
          <span class="pt-progress-item">Organización</span>
          <span class="pt-progress-sep">•</span>
          <span class="pt-progress-item">Responsabilidades</span>
          <span class="pt-progress-sep">•</span>
          <span class="pt-progress-item">Estado</span>
        </div>
      </header>

      <q-card flat bordered class="pt-card">
        <q-form ref="formRef" @submit.prevent="submitForm" class="pt-form">
          <!-- Barra de acciones (equivalente a “filtros + botón principal” en un CRUD simple) -->
          <div class="pt-toolbar row items-center wrap q-col-gutter-y-sm">
            <div class="col-12 col-sm-auto">
              <q-btn
                flat
                dense
                no-caps
                color="grey-7"
                icon="arrow_back"
                label="Volver"
                @click="$router.back()"
              />
            </div>
            <div class="col-12 col-sm-grow text-right row justify-end q-gutter-sm">
              <q-btn
                outline
                no-caps
                color="grey-7"
                label="Cancelar"
                class="pt-action-btn pt-action-btn--secondary"
                @click="$router.back()"
              />
              <q-btn
                unelevated
                no-caps
                color="primary"
                type="submit"
                :loading="loading"
                :label="submitLabel"
                class="pt-action-btn"
              >
                <template v-slot:loading>
                  <q-spinner-dots />
                </template>
              </q-btn>
            </div>
          </div>

          <q-separator class="q-my-md" />

          <!-- 1. Información básica -->
          <section class="pt-section pt-section-card">
            <h2 class="pt-section-title">1. Identificación del cargo</h2>
            <div class="row q-col-gutter-md">
              <div class="col-12 primary-field">
                <q-input
                  v-model="puesto.nombreCargo"
                  label="Nombre del cargo"
                  outlined
                  placeholder="Ej: Diseñador UX Senior"
                  :rules="[val => !!val || 'El nombre es obligatorio']"
                >
                  <template v-slot:prepend>
                    <q-icon name="work" size="18px" class="text-grey-6" />
                  </template>
                </q-input>
              </div>
              <div class="col-12 col-md-5">
                <q-input
                  v-model="puesto.codigoCargo"
                  label="Código del cargo"
                  outlined
                  dense
                  :rules="[val => !!val || 'El código es obligatorio']"
                >
                  <template v-slot:prepend>
                    <q-icon name="qr_code" size="18px" class="text-grey-6" />
                  </template>
                </q-input>
                <div class="field-help">
                  Se usa en reportes internos y búsquedas.
                </div>
              </div>
            </div>
          </section>

          <!-- 2. Clasificación -->
          <section class="pt-section pt-section-card">
            <h2 class="pt-section-title">2. Organización y estructura</h2>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-4">
                <q-select
                  v-model="puesto.area"
                  :options="areas"
                  label="Área / departamento"
                  outlined
                  dense
                  :rules="[val => !!val || 'Seleccione un área']"
                >
                  <template v-slot:prepend>
                    <q-icon name="domain" size="18px" class="text-grey-6" />
                  </template>
                </q-select>
              </div>
              <div class="col-12 col-md-4">
                <q-select
                  v-model="puesto.nivelJerarquico"
                  :options="niveles"
                  label="Nivel jerárquico"
                  outlined
                  dense
                  :rules="[val => !!val || 'Seleccione un nivel']"
                >
                  <template v-slot:prepend>
                    <q-icon name="account_tree" size="18px" class="text-grey-6" />
                  </template>
                </q-select>
              </div>
              <div class="col-12 col-md-4">
                <q-select
                  v-model="puesto.tipoContrato"
                  :options="contratos"
                  label="Tipo de contrato"
                  outlined
                  dense
                  :rules="[val => !!val || 'Seleccione el tipo de contrato']"
                >
                  <template v-slot:prepend>
                    <q-icon name="assignment" size="18px" class="text-grey-6" />
                  </template>
                </q-select>
              </div>
            </div>
          </section>

          <!-- 3. Descripción -->
          <section class="pt-section pt-section-card">
            <h2 class="pt-section-title">3. Responsabilidades</h2>
            <q-input
              v-model="puesto.descripcion"
              type="textarea"
              label="Descripción del puesto"
              outlined
              dense
              autogrow
              hint="Opcional · funciones principales y expectativas"
            >
              <template v-slot:prepend>
                <q-icon name="description" size="18px" class="text-grey-6" />
              </template>
            </q-input>
          </section>

          <!-- Estado -->
          <section class="pt-section pt-section-card pt-section--estado">
            <div class="row items-start items-sm-center justify-between">
              <div>
                <h2 class="pt-section-title q-mb-xs">4. Estado y publicación</h2>
                <q-chip
                  dense
                  outline
                  square
                  :color="puesto.estado === 'ACTIVO' ? 'positive' : 'grey-8'"
                  :text-color="puesto.estado === 'ACTIVO' ? 'positive' : 'grey-8'"
                  class="pt-estado-chip"
                >
                  {{ puesto.estado === 'ACTIVO' ? 'Activo' : 'Inactivo' }}
                </q-chip>
              </div>
              <q-toggle
                v-model="isActive"
                color="primary"
                dense
                :label="isActive ? 'Activo para contratación' : 'Inactivo / congelado'"
                left-label
                class="pt-toggle"
              />
            </div>
          </section>
        </q-form>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { ref, reactive, computed, onMounted } from '@vue/composition-api'
import { usePuestosTrabajoStore } from '../../../../piña/puestosTrabajo'

export default {
  name: 'PuestoTrabajoForm',
  setup(props, { root }) {
    const $q = root.$q
    const router = root.$router
    const route = root.$route
    const store = usePuestosTrabajoStore()
    const formRef = ref(null)

    const puesto = reactive({
      nombreCargo: '',
      codigoCargo: '',
      descripcion: '',
      area: '',
      nivelJerarquico: '',
      tipoContrato: '',
      estado: 'ACTIVO',
    })

    const isEditing = computed(function () {
      return !!(route.params && route.params.id)
    })

    const pageTitle = computed(function () {
      return isEditing.value ? 'Editar puesto de trabajo' : 'Crear nuevo puesto de trabajo'
    })

    const submitLabel = computed(function () {
      return isEditing.value ? 'Guardar cambios' : 'Registrar puesto'
    })

    const isActive = computed({
      get: function () {
        return puesto.estado === 'ACTIVO'
      },
      set: function (val) {
        puesto.estado = val ? 'ACTIVO' : 'INACTIVO'
      },
    })

    const areas = ['Operaciones', 'Administración', 'Talento Humano', 'Tecnología', 'Mercadeo', 'Finanzas']
    const niveles = ['Operativo', 'Técnico', 'Profesional', 'Especialista', 'Coordinador', 'Gerencial', 'Directivo']
    const contratos = ['Término Indefinido', 'Término Fijo', 'Obra o Labor', 'Prestación de Servicios', 'Aprendizaje']

    onMounted(async function () {
      if (route.params.id) {
        await store.fetchPuestoById(route.params.id)
        if (store.puesto) {
          Object.assign(puesto, store.puesto)
        }
      }
    })

    const submitForm = async function () {
      try {
        await store.savePuesto(puesto)
        $q.notify({
          type: 'positive',
          message: isEditing.value ? 'Puesto actualizado correctamente' : 'Puesto registrado correctamente',
          position: 'top-right',
          icon: 'check_circle',
        })
        router.push('/talento-humano/puestos-trabajo')
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: 'No se pudo guardar el puesto.',
          position: 'top-right',
        })
      }
    }

    return {
      puesto,
      areas,
      niveles,
      contratos,
      loading: computed(function () {
        return store.loading
      }),
      isActive,
      isEditing,
      pageTitle,
      submitLabel,
      submitForm,
      formRef,
    }
  },
}
</script>

<style scoped>
/* Paleta estilo slate (sin Tailwind) */
.pt-page {
  background-color: #f8fafc;
}

.pt-inner {
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}

.pt-header {
  background-color: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 24px 20px;
  margin-bottom: 16px;
}

.pt-title {
  margin: 0;
  padding: 0;
  font-size: 1.875rem;
  line-height: 1.25;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #0f172a;
}

.pt-sub {
  margin: 8px 0 0;
  padding: 0;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #64748b;
}

.pt-progress {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
}

.pt-progress-item {
  font-size: 0.75rem;
  font-weight: 500;
  color: #94a3b8;
}

.pt-progress-item--active {
  color: #0f172a;
}

.pt-progress-sep {
  color: #cbd5e1;
  font-size: 0.75rem;
}

.pt-card {
  border-radius: 8px;
  border-color: #e2e8f0;
  background-color: #ffffff;
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 4px 12px rgba(15, 23, 42, 0.04);
}

.pt-form {
  padding: 20px;
}

.pt-toolbar {
  padding-bottom: 4px;
}

.pt-action-btn {
  min-height: 44px;
  border-radius: 12px;
  padding-left: 16px;
  padding-right: 16px;
  font-weight: 500;
}

.pt-action-btn--secondary {
  background-color: #ffffff;
}

.pt-section {
  margin-bottom: 28px;
}

.pt-section-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  padding: 24px;
}

.pt-section:last-of-type {
  margin-bottom: 0;
}

.pt-section-title {
  margin: 0 0 14px;
  padding: 0;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #64748b;
}

.pt-section--estado .pt-section-title {
  margin-bottom: 10px;
}

.pt-estado-chip {
  font-weight: 500;
  border-radius: 6px !important;
}

.pt-toggle {
  margin-top: 8px;
}

.field-help {
  color: #64748b;
  font-size: 14px;
  margin-top: 6px;
}

:deep(.primary-field .q-field__control) {
  min-height: 64px;
}

:deep(.primary-field .q-field__native),
:deep(.primary-field .q-field__input) {
  font-size: 20px;
  font-weight: 600;
}

@media (min-width: 600px) {
  .pt-toggle {
    margin-top: 0;
  }
}

:deep(.q-field__marginal),
:deep(.q-field__label) {
  color: #64748b;
}

:deep(.q-field__native),
:deep(.q-field__input) {
  color: #334155;
}
</style>
