<template>
  <q-page class="q-pa-xl flex flex-center bg-grey-1">
    <q-card class="form-card shadow-24">
      <q-card-section class="header-section text-white bg-gradient">
        <h1 class="text-h3 q-ma-none text-weight-bold">Registro de Puesto de Trabajo</h1>
        <p class="q-mt-sm opacity-subtitle text-subtitle1">Define las características y requerimientos del cargo</p>
      </q-card-section>

      <q-card-section class="q-pa-lg">
        <q-form ref="formRef" @submit="submitForm" class="q-gutter-md">
          
          <!-- Sección: Información Básica -->
          <div class="form-section">
            <h2 class="section-title">1. Información Básica</h2>
            <div class="row q-col-gutter-lg">
              <div class="col-12 col-md-6">
                <q-input
                  v-model="puesto.nombreCargo"
                  label="Nombre del Cargo"
                  filled
                  :rules="[val => !!val || 'El nombre es obligatorio']"
                >
                  <template v-slot:prepend><q-icon name="work" class="gradient-text" /></template>
                </q-input>
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="puesto.codigoCargo"
                  label="Código del Cargo"
                  filled
                  hint="Útil para búsquedas rápidas"
                  :rules="[val => !!val || 'El código es obligatorio']"
                >
                  <template v-slot:prepend><q-icon name="qr_code" class="gradient-text" /></template>
                </q-input>
              </div>
            </div>
          </div>

          <!-- Sección: Clasificación -->
          <div class="form-section">
            <h2 class="section-title">2. Clasificación Organizacional</h2>
            <div class="row q-col-gutter-lg">
              <div class="col-12 col-md-4">
                <q-select
                  v-model="puesto.area"
                  :options="areas"
                  label="Área / Departamento"
                  filled
                  :rules="[val => !!val || 'Seleccione un área']"
                >
                  <template v-slot:prepend><q-icon name="domain" class="gradient-text" /></template>
                </q-select>
              </div>
              <div class="col-12 col-md-4">
                <q-select
                  v-model="puesto.nivelJerarquico"
                  :options="niveles"
                  label="Nivel Jerárquico"
                  filled
                  :rules="[val => !!val || 'Seleccione un nivel']"
                >
                  <template v-slot:prepend><q-icon name="account_tree" class="gradient-text" /></template>
                </q-select>
              </div>
              <div class="col-12 col-md-4">
                <q-select
                  v-model="puesto.tipoContrato"
                  :options="contratos"
                  label="Tipo de Contrato"
                  filled
                  :rules="[val => !!val || 'Seleccione el tipo de contrato']"
                >
                  <template v-slot:prepend><q-icon name="assignment" class="gradient-text" /></template>
                </q-select>
              </div>
            </div>
          </div>

          <!-- Sección: Descripción -->
          <div class="form-section">
            <h2 class="section-title">3. Detalle de Responsabilidades</h2>
            <q-input
              v-model="puesto.descripcion"
              type="textarea"
              label="Descripción del Puesto"
              filled
              autogrow
              class="q-mt-sm"
              hint="Describa brevemente las funciones principales"
            >
              <template v-slot:prepend><q-icon name="description" class="gradient-text" /></template>
            </q-input>
          </div>

          <!-- Sección: Estado -->
          <div class="form-section row items-center justify-between">
            <div>
              <h2 class="section-title inline-block q-mr-md">Estado del Cargo</h2>
              <q-chip 
                :color="puesto.estado === 'ACTIVO' ? 'positive' : 'negative'" 
                text-color="white" 
                dense
              >
                {{ puesto.estado }}
              </q-chip>
            </div>
            <q-toggle
              v-model="isActive"
              color="green"
              :label="isActive ? 'Activo para contratación' : 'Inactivo / Congelado'"
              left-label
            />
          </div>

          <div class="flex justify-end q-mt-xl gap-md">
            <q-btn label="Cancelar" flat color="grey-7" v-close-popup @click="$router.back()" />
            <q-btn 
              :loading="loading" 
              type="submit" 
              class="bg-gradient text-white btn-premium"
              padding="12px 32px"
            >
              Registrar Puesto
              <template v-slot:loading>
                <q-spinner-facebook />
              </template>
            </q-btn>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
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
      estado: 'ACTIVO'
    })

    const isActive = computed({
      get: () => puesto.estado === 'ACTIVO',
      set: (val) => puesto.estado = val ? 'ACTIVO' : 'INACTIVO'
    })

    const areas = ['Operaciones', 'Administración', 'Talento Humano', 'Tecnología', 'Mercadeo', 'Finanzas']
    const niveles = ['Operativo', 'Técnico', 'Profesional', 'Especialista', 'Coordinador', 'Gerencial', 'Directivo']
    const contratos = ['Término Indefinido', 'Término Fijo', 'Obra o Labor', 'Prestación de Servicios', 'Aprendizaje']

    onMounted(async () => {
      if (route.params.id) {
        // Modo Edición (si se implementa lista con link a edición)
        await store.fetchPuestoById(route.params.id)
        if (store.puesto) {
          Object.assign(puesto, store.puesto)
        }
      }
    })

    const submitForm = async () => {
      try {
        await store.savePuesto(puesto)
        $q.notify({
          type: 'positive',
          message: 'Puesto de trabajo registrado correctamente',
          position: 'top-right',
          icon: 'check_circle'
        })
        router.push('/talento-humano/puestos-trabajo')
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: 'Error al registrar el puesto',
          position: 'top-right'
        })
      }
    }

    return {
      puesto,
      areas,
      niveles,
      contratos,
      loading: computed(() => store.loading),
      isActive,
      submitForm,
      formRef
    }
  }
}
</script>

<style scoped>
.form-card {
  width: 100%;
  max-width: 900px;
  border-radius: 20px;
  overflow: hidden;
}

.bg-gradient {
  background: linear-gradient(135deg, #84B24D, #75AF7E, #4E9C4C);
}

.gradient-text {
  color: #4E9C4C;
}

.header-section {
  padding: 3rem 2rem;
}

h1 {
  font-size: 32px !important;
  line-height: 1.2;
  color: #ffffff;
}

.header-section p {
  color: #ffffff;
}

.section-title {
  font-size: 20px !important;
  font-weight: bold;
  color: #6B7C85;
  border-bottom: 2px solid #ecf0f1;
  padding-bottom: 8px;
  margin-bottom: 20px;
  margin-top: 32px;
}

.opacity-subtitle {
  opacity: 0.85;
  color: #A7B1B7;
}

.form-section {
  margin-bottom: 24px;
}

/* Typography Overrides for labels */
:deep(.q-field__label) {
  font-size: 15px;
  font-weight: bold;
  color: #6B7C85;
}

:deep(.q-field__native), :deep(.q-field__prefix), :deep(.q-field__suffix), :deep(.q-field__input) {
  color: #4A5A63;
}

.btn-premium {
  border-radius: 12px;
  text-transform: none;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.3s ease;
}

.btn-premium:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.gap-md {
  gap: 16px;
}
</style>
