<template>
  <div class="q-pa-md">
    <!-- Tarjeta contenedora del formulario -->
    <q-card class="my-card" style="max-width: 600px; margin: 0 auto;">
      <!-- Cabecera del formulario -->
      <q-card-section class="bg-primary text-white">
        <div class="text-h6 text-white">Activar Rubro</div>
        <div class="text-subtitle2">Gestionar el estado de activación del rubro</div>
      </q-card-section>

      <!-- Cuerpo del formulario -->
      <q-card-section>
        <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
          <!-- 1. Información del rubro -->
          <q-card flat bordered class="q-mb-md">
            <q-card-section>
              <div class="text-subtitle2 q-mb-sm">Información del Rubro</div>

              <q-item>
                <q-item-section>
                  <q-item-label caption>Nombre del Rubro</q-item-label>
                  <q-item-label class="text-h6">{{ rubroData?.nombreRubro || 'No disponible' }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item v-if="rubroData?.descripcionRubro">
                <q-item-section>
                  <q-item-label caption>Descripción</q-item-label>
                  <q-item-label>{{ rubroData.descripcionRubro }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>Presupuesto</q-item-label>
                  <q-item-label class="text-h6 text-primary">
                    {{ formatearMoneda(rubroData?.valorPresupuesto || 0) }}
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item v-if="rubroData?.planAbastecimiento">
                <q-item-section>
                  <q-item-label caption>Plan de Abastecimiento</q-item-label>
                  <q-item-label>{{ getNombrePlan(rubroData.planAbastecimiento) }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-card-section>
          </q-card>

          <!-- 2. Estado de activación -->
          <q-card flat bordered class="q-mb-md">
            <q-card-section>
              <div class="text-subtitle2 q-mb-sm">Estado de Activación</div>

              <q-toggle v-model="formData.activar" label="Rubro Activo" color="primary" size="lg" left-label
                hint="Marque esta opción para activar el rubro y hacerlo disponible" :disable="loading">
                <template v-slot:append>
                  <q-chip :color="formData.activar ? 'positive' : 'negative'" text-color="white"
                    :icon="formData.activar ? 'check' : 'close'" size="sm">
                    {{ formData.activar ? 'Activo' : 'Inactivo' }}
                  </q-chip>
                </template>
              </q-toggle>

              <!-- 3. Fecha de activación -->
              <q-input filled v-model="formData.fechaActivacion" label="Fecha de activación"
                hint="Fecha en que se activa el rubro" mask="date" :rules="[
                  'date',
                  val => !val || val !== '' || 'La fecha de activación es requerida'
                ]" :disable="loading || !formData.activar">
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="formData.fechaActivacion" :options="fechaActivacionOptions" today-btn />
                    </q-popup-proxy>
                  </q-icon>
                </template>
                <template v-slot:append>
                  <q-icon name="close" @click="formData.fechaActivacion = ''" class="cursor-pointer"
                    v-if="formData.fechaActivacion && !loading" />
                </template>
              </q-input>

              <!-- 4. Motivo de activación/desactivación -->
              <q-input filled v-model="formData.motivo" label="Motivo del cambio"
                hint="Explique el motivo para activar o desactivar el rubro" type="textarea" autogrow :maxlength="300"
                :rules="[
                  val => !val || val.length <= 300 || 'Máximo 300 caracteres'
                ]" :disable="loading">
                <template v-slot:prepend>
                  <q-icon name="comment" />
                </template>
                <template v-slot:append>
                  <span class="text-caption">{{ (formData.motivo && formData.motivo.length) || 0 }}/300</span>
                </template>
              </q-input>

              <!-- 5. Notas adicionales -->
              <q-input filled v-model="formData.notas" label="Notas adicionales"
                hint="Información adicional relevante sobre el cambio de estado" type="textarea" autogrow
                :maxlength="500" :rules="[
                  val => !val || val.length <= 500 || 'Máximo 500 caracteres'
                ]" :disable="loading">
                <template v-slot:prepend>
                  <q-icon name="note" />
                </template>
                <template v-slot:append>
                  <span class="text-caption">{{ (formData.notas && formData.notas.length) || 0 }}/500</span>
                </template>
              </q-input>
            </q-card-section>
          </q-card>

          <!-- Separador -->
          <q-separator />

          <!-- Botones de acción -->
          <div class="row justify-end q-gutter-sm">
            <q-btn label="Cancelar" type="reset" color="secondary" flat :disable="loading" />
            <q-btn :label="formData.activar ? 'Activar Rubro' : 'Desactivar Rubro'" type="submit"
              :color="formData.activar ? 'positive' : 'negative'" :icon="formData.activar ? 'check_circle' : 'block'"
              :loading="loading" :disable="!formularioValido" />
          </div>
        </q-form>
      </q-card-section>

      <!-- Loading overlay -->
      <q-inner-loading :showing="loading" color="primary">
        <q-spinner-gears size="50px" color="primary" />
        <div class="q-mt-sm text-primary">
          {{ formData.activar ? 'Activando rubro...' : 'Desactivando rubro...' }}
        </div>
      </q-inner-loading>
    </q-card>

    <!-- Diálogo de confirmación -->
    <q-dialog v-model="showConfirmDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar :icon="formData.activar ? 'check_circle' : 'block'"
            :color="formData.activar ? 'positive' : 'negative'" text-color="white" size="md" />
          <span class="q-ml-md text-body1">
            ¿Está seguro de {{ formData.activar ? 'activar' : 'desactivar' }} el rubro "{{ rubroData?.nombreRubro }}"?
          </span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="grey" v-close-popup />
          <q-btn :label="formData.activar ? 'Activar' : 'Desactivar'"
            :color="formData.activar ? 'positive' : 'negative'" @click="confirmarAccion" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Diálogo de resultado -->
    <q-dialog v-model="showResultDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar :icon="resultIcon" :color="resultColor" text-color="white" size="md" />
          <span class="q-ml-md text-body1">{{ resultMessage }}</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat :label="resultButton" :color="resultColor" v-close-popup @click="resultadoConfirmado" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { computed, ref, watch } from 'vue';

export default {
  name: 'ActivarRubroForm',
  props: {
    rubroId: {
      type: [String, Number],
      required: true
    },
    rubroData: {
      type: Object,
      default: () => ({})
    },
    planesAbastecimiento: {
      type: Array,
      default: () => []
    }
  },

  emits: ['rubro-activado', 'rubro-desactivado', 'cancelado'],

  setup(props, { emit }) {
    // Estado del formulario
    const formData = ref({
      activar: false,
      fechaActivacion: '',
      motivo: '',
      notas: ''
    })

    // Estados de UI
    const loading = ref(false)
    const showConfirmDialog = ref(false)
    const showResultDialog = ref(false)
    const resultMessage = ref('')
    const resultIcon = ref('check_circle')
    const resultColor = ref('positive')
    const resultButton = ref('Aceptar')

    // Computed properties
    const formularioValido = computed(() => {
      return formData.value.activar !== null &&
        formData.value.fechaActivacion !== '' &&
        (formData.value.motivo === '' || formData.value.motivo.length <= 300) &&
        (formData.value.notas === '' || formData.value.notas.length <= 500)
    })

    // Watch para actualizar el estado cuando cambia el rubroData
    watch(() => props.rubroData, (newData) => {
      if (newData) {
        formData.value.activar = newData.activar || false
        formData.value.fechaActivacion = newData.fechaActivacion || ''
        formData.value.motivo = newData.motivo || ''
        formData.value.notas = newData.notas || ''
      }
    }, { immediate: true })

    // Métodos
    const formatearMoneda = (valor) => {
      return new Intl.NumberFormat('es-Co', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(valor)
    }

    const getNombrePlan = (planId) => {
      const plan = props.planesAbastecimiento.find(p => p.id === planId)
      return plan ? plan.nombre : 'Plan no encontrado'
    }

    const fechaActivacionOptions = (fecha) => {
      const fechaActual = new Date()
      const fechaComparar = new Date(fecha)
      return fechaComparar >= fechaActual
    }

    const mostrarDialogo = (tipo, mensaje) => {
      resultIcon.value = tipo === 'success' ? 'check_circle' : 'error'
      resultColor.value = tipo === 'success' ? 'positive' : 'negative'
      resultMessage.value = mensaje
      resultButton.value = 'Aceptar'
      showResultDialog.value = true
    }

    const onSubmit = async () => {
      showConfirmDialog.value = true
    }

    const confirmarAccion = async () => {
      loading.value = true

      try {
        // Simular llamada a API
        await new Promise(resolve => setTimeout(resolve, 2000))

        // Preparar datos para enviar
        const accionData = {
          id: props.rubroId,
          ...formData.value,
          fechaModificacion: new Date().toISOString()
        }

        // Emitir evento según la acción
        if (formData.value.activar) {
          emit('rubro-activado', accionData)
          mostrarDialogo('success', `Rubro "${props.rubroData?.nombreRubro}" activado exitosamente`)
        } else {
          emit('rubro-desactivado', accionData)
          mostrarDialogo('success', `Rubro "${props.rubroData?.nombreRubro}" desactivado exitosamente`)
        }

      } catch (error) {
        console.error('Error al cambiar estado del rubro:', error)
        mostrarDialogo('error', `Error: ${error.message || 'No se pudo cambiar el estado del rubro'}`)
      } finally {
        loading.value = false
      }
    }

    const resultadoConfirmado = () => {
      showResultDialog.value = false
      // Resetear formulario
      onReset()
    }

    const onReset = () => {
      formData.value = {
        activar: props.rubroData?.activar || false,
        fechaActivacion: props.rubroData?.fechaActivacion || '',
        motivo: props.rubroData?.motivo || '',
        notas: props.rubroData?.notas || ''
      }
    }

    return {
      formData,
      loading,
      showConfirmDialog,
      showResultDialog,
      resultMessage,
      resultIcon,
      resultColor,
      resultButton,
      formularioValido,
      formatearMoneda,
      getNombrePlan,
      fechaActivacionOptions,
      onSubmit,
      confirmarAccion,
      resultadoConfirmado,
      onReset
    }
  }
}
</script>

<style scoped>
.my-card {
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.text-caption {
  font-size: 0.75rem;
  color: rgba(0, 0, 0, 0.6);
}

.q-spinner-gears {
  animation: spin 2s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
