<template>
 <div class="q-pa-md">
    <!-- Tarjeta contenedora del formulario -->
    <q-card class="my-card" style="max-width: 800px; margin: 0 auto;">
      <!-- Cabecera del formulario -->
      <q-card-section class="bg-primary text-white">
        <div class="text-h6 text-white">Formulario de Rubro</div>
        <div class="text-subtitle2">Complete la información del rubro</div>
      </q-card-section>

      <!-- Cuerpo del formulario -->
      <q-card-section>
        <q-form
          @submit="onSubmit"
          @reset="onReset"
          class="q-gutter-md"
        >
          <!-- 1. Nombre del rubro -->
          <q-input
            filled
            v-model="formData.nombreRubro"
            label="Nombre del rubro *"
            hint="Ingrese el nombre del rubro"
            lazy-rules
            :rules="[
              val => val && val.length > 0 || 'El nombre del rubro es requerido',
              val => val.length <= 100 || 'Máximo 100 caracteres'
            ]"
          >
            <template v-slot:prepend>
              <q-icon name="category" />
            </template>
          </q-input>

          <!-- 2. Descripción del rubro -->
          <q-input
            filled
            v-model="formData.descripcionRubro"
            label="Descripción del rubro"
            hint="Describa el propósito del rubro"
            type="textarea"
            autogrow
            :maxlength="250"
            :rules="[ val => !val || val.length <= 250 || 'Máximo 250 caracteres' ]"
          >
            <template v-slot:prepend>
              <q-icon name="description" />
            </template>
            <template v-slot:append>
              <span class="text-caption">{{ (formData.descripcionRubro && formData.descripcionRubro.length) || 0 }}/250</span>
            </template>
          </q-input>

          <!-- 3. Plan de abastecimiento - ComboBox -->
          <q-select
            filled
            v-model="formData.planAbastecimiento"
            :options="planesAbastecimiento"
            label="Plan de abastecimiento *"
            hint="Seleccione un plan"
            option-label="nombre"
            option-value="id"
            emit-value
            map-options
            lazy-rules
            :rules="[ val => val !== null || 'Debe seleccionar un plan de abastecimiento']"
            use-input
            input-debounce="0"
            @filter="filtrarPlanes"
            clearable
          >
            <template v-slot:prepend>
              <q-icon name="inventory" />
            </template>
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No hay resultados
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <!-- 4. Fecha inicio -->
          <q-input
            filled
            v-model="formData.fechaInicio"
            label="Fecha de inicio *"
            mask="date"
            :rules="['date', val => val !== '' || 'La fecha de inicio es requerida']"
          >
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date
                    v-model="formData.fechaInicio"
                    :options="fechaInicioOptions"
                    today-btn
                  />
                </q-popup-proxy>
              </q-icon>
            </template>
            <template v-slot:append>
              <q-icon
                name="close"
                @click="formData.fechaInicio = ''"
                class="cursor-pointer"
                v-if="formData.fechaInicio"
              />
            </template>
          </q-input>

          <!-- 5. Fecha final -->
          <q-input
            filled
            v-model="formData.fechaFinal"
            label="Fecha final *"
            mask="date"
            :rules="[
              'date',
              val => val !== '' || 'La fecha final es requerida',
              val => validarFechaFinal(val) || 'La fecha final debe ser posterior a la fecha de inicio'
            ]"
          >
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date
                    v-model="formData.fechaFinal"
                    :options="fechaFinalOptions"
                    today-btn
                  />
                </q-popup-proxy>
              </q-icon>
            </template>
            <template v-slot:append>
              <q-icon
                name="close"
                @click="formData.fechaFinal = ''"
                class="cursor-pointer"
              />
            </template>
          </q-input>

          <!-- 6. Valor del presupuesto -->
          <q-input
            filled
            v-model.number="formData.valorPresupuesto"
            label="Valor del presupuesto *"
            hint="Ingrese el monto del presupuesto"
            type="number"
            min="0"
            step="1000"
            :rules="[
              val => val !== null && val !== '' || 'El valor del presupuesto es requerido',
              val => val >= 0 || 'El valor debe ser mayor o igual a 0',
              val => !isNaN(parseFloat(val)) || 'Debe ingresar un número válido'
            ]"
          >
            <template v-slot:prepend>
              <q-icon name="attach_money" />
            </template>
            <template v-slot:append>
              <span class="text-caption">COP</span>
            </template>
          </q-input>

          <!-- Mostrar resumen del presupuesto formateado -->
          <q-item v-if="formData.valorPresupuesto" class="bg-grey-2 rounded-borders">
            <q-item-section>
              <q-item-label caption>Presupuesto formateado</q-item-label>
              <q-item-label class="text-h6 text-primary">
                {{ formatearMoneda(formData.valorPresupuesto) }}
              </q-item-label>
            </q-item-section>
          </q-item>

          <!-- 7. Activar rubro -->
          <q-toggle
            v-model="formData.activar"
            label="Activar rubro"
            color="primary"
            left-label
            hint="Marque esta opción para activar el rubro"
          />

          <!-- 8. Sección de activación (solo visible si el rubro está guardado) -->
          <q-card v-if="rubroId" flat bordered class="q-mt-md bg-blue-1">
            <q-card-section>
              <div class="text-subtitle2 q-mb-sm">
                <q-icon name="settings" class="q-mr-sm" />
                Gestión de Activación
              </div>

              <div class="row q-gutter-md">
                <!-- Estado actual -->
                <div class="col-12 col-md-6">
                  <q-item>
                    <q-item-section avatar>
                      <q-avatar
                        :color="formData.activar ? 'positive' : 'negative'"
                        text-color="white"
                        :icon="formData.activar ? 'check' : 'close'"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Estado Actual</q-item-label>
                      <q-item-label caption>
                        {{ formData.activar ? 'Activo' : 'Inactivo' }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </div>

                <!-- Fecha de activación -->
                <div class="col-12 col-md-6">
                  <q-input
                    filled
                    v-model="formData.fechaActivacion"
                    label="Fecha de activación"
                    hint="Fecha en que se activa/desactiva el rubro"
                    mask="date"
                    :rules="[
                      'date',
                      val => !val || val !== '' || 'La fecha de activación es requerida'
                    ]"
                    :disable="loading || loadingActivacion"
                  >
                    <template v-slot:prepend>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                          <q-date
                            v-model="formData.fechaActivacion"
                            :options="fechaActivacionOptions"
                            today-btn
                          />
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                    <template v-slot:append>
                      <q-icon
                        name="close"
                        @click="formData.fechaActivacion = ''"
                        class="cursor-pointer"
                        v-if="formData.fechaActivacion && !loading && !loadingActivacion"
                      />
                    </template>
                  </q-input>
                </div>

                <!-- Motivo del cambio -->
                <div class="col-12">
                  <q-input
                    filled
                    v-model="formData.motivoCambio"
                    label="Motivo del cambio"
                    hint="Explique el motivo para activar o desactivar el rubro"
                    type="textarea"
                    autogrow
                    :maxlength="300"
                    :rules="[
                      val => !val || val.length <= 300 || 'Máximo 300 caracteres'
                    ]"
                    :disable="loading || loadingActivacion"
                  >
                    <template v-slot:prepend>
                      <q-icon name="comment" />
                    </template>
                    <template v-slot:append>
                      <span class="text-caption">
                        {{ (formData.motivoCambio && formData.motivoCambio.length) || 0 }}/300
                      </span>
                    </template>
                  </q-input>
                </div>
              </div>

              <!-- Botones de acción para activación -->
              <div class="row justify-end q-gutter-sm q-mt-md">
                <q-btn
                  label="Guardar Estado"
                  :color="formData.activar ? 'positive' : 'negative'"
                  :icon="formData.activar ? 'check_circle' : 'block'"
                  :loading="loadingActivacion"
                  :disable="!formData.fechaActivacion || !formData.motivoCambio"
                  @click="guardarEstadoActivacion"
                >
                  <q-tooltip>
                    {{ formData.activar ? 'Activar rubro' : 'Desactivar rubro' }}
                  </q-tooltip>
                </q-btn>
              </div>
            </q-card-section>
          </q-card>

          <!-- Separador -->
          <q-separator />

          <!-- Botones de acción -->
          <div class="row justify-end q-gutter-sm">
            <q-btn
              label="Limpiar"
              type="reset"
              color="secondary"
              flat
              class="q-ml-sm"
            />
            <q-btn
              label="Guardar rubro"
              type="submit"
              color="primary"
              icon="save"
            />
          </div>
        </q-form>
      </q-card-section>

      <!-- Loading overlay -->
      <q-inner-loading :showing="loading" color="primary">
        <q-spinner-gears size="50px" color="primary" />
        <div class="q-mt-sm text-primary">Guardando rubro...</div>
      </q-inner-loading>
    </q-card>

    <!-- Diálogo de confirmación -->
    <q-dialog v-model="showDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar :icon="dialogIcon" :color="dialogColor" text-color="white" size="md" />
          <span class="q-ml-md text-body1">{{ dialogMessage }}</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat :label="dialogButton" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { useSupplyPlansStore } from '../../../../piña/supplyPlans'
import { useRubrosStore } from '../../../../piña/rubros'

export default {
  name: 'CrearRubro',
  props:{
  rubroId: {
    type: [String, Number],
    default: null
  }
},

emits: ['rubro-guardado', 'rubro-actualizado'],

data() {
  return {
    supplyPlansStore: null,
    rubrosStore: null,
    formData: {
      nombreRubro: '',
      descripcionRubro: '',
      planAbastecimiento: null,
      fechaInicio: '',
      fechaFinal: '',
      valorPresupuesto: null,
      activar: false,
      fechaActivacion: '',
      motivoCambio: ''
    },
    planesAbastecimiento: [],
    planesFiltrados: [],
    loading: false,
    loadingActivacion: false,
    showDialog: false,
    dialogMessage: '',
    dialogIcon: 'check_circle',
    dialogColor: 'positive',
    dialogButton: 'Aceptar'
  }
},

computed: {
  formularioValido() {
    return this.formData.nombreRubro && this.formData.nombreRubro.trim() &&
            this.formData.planAbastecimiento &&
            this.formData.fechaInicio &&
            this.formData.fechaFinal &&
            this.formData.valorPresupuesto !== null &&
            this.formData.valorPresupuesto >= 0 &&
            this.validarFechaFinal(this.formData.fechaFinal)
  }
},

methods: {
  formatearMoneda(valor) {
    return new Intl.NumberFormat('es-Co', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(valor)
  },

  validarFechaFinal(fechaFinal) {
    if (!this.formData.fechaInicio || !fechaFinal) return true

    try {
      // Parsear fechas en formato YYYY/MM/DD (estándar de Quasar q-date)
      const [anioInicio, mesInicio, diaInicio] = this.formData.fechaInicio.split('/')
      const [anioFinal, mesFinal, diaFinal] = fechaFinal.split('/')

      const fechaInicioDate = new Date(anioInicio, mesInicio - 1, diaInicio)
      const fechaFinalDate = new Date(anioFinal, mesFinal - 1, diaFinal)

      // Validar que las fechas sean válidas
      if (isNaN(fechaInicioDate.getTime()) || isNaN(fechaFinalDate.getTime())) {
        return true // Dejar que Quasar maneje la validación de formato
      }

      // La fecha final debe ser mayor o igual a la fecha de inicio
      return fechaFinalDate >= fechaInicioDate
    } catch (error) {
      console.error('Error en validación de fecha:', error)
      return true // Dejar que Quasar maneje la validación
    }
  },

  fechaInicioOptions(fecha) {
    try {
      // Parsear fecha en formato YYYY/MM/DD
      const [anio, mes, dia] = fecha.split('/')
      const fechaComparar = new Date(anio, mes - 1, dia)

      // Validar que la fecha sea válida
      if (isNaN(fechaComparar.getTime())) {
        return true
      }

      const fechaActual = new Date()
      return fechaComparar >= fechaActual
    } catch (error) {
      console.error('Error en validación de fecha inicio options:', error)
      return true
    }
  },

  fechaFinalOptions(fecha) {
    if (!this.formData.fechaInicio) return true

    try {
      // Parsear fecha de inicio en formato YYYY/MM/DD
      const [anioInicio, mesInicio, diaInicio] = this.formData.fechaInicio.split('/')
      const fechaInicioDate = new Date(anioInicio, mesInicio - 1, diaInicio)

      // Parsear fecha a comparar (viene del q-date en formato YYYY/MM/DD)
      const fechaComparar = new Date(fecha)

      // Validar que las fechas sean válidas
      if (isNaN(fechaInicioDate.getTime()) || isNaN(fechaComparar.getTime())) {
        return true
      }

      // La fecha final debe ser mayor o igual a la fecha de inicio
      return fechaComparar >= fechaInicioDate
    } catch (error) {
      console.error('Error en validación de fecha final options:', error)
      return true
    }
  },

  fechaActivacionOptions(fecha) {
    const fechaActual = new Date()
    const fechaComparar = new Date(fecha)
    return fechaComparar >= fechaActual
  },

  filtrarPlanes(val, update) {
    if (val === '') {
      update(() => {
        this.planesFiltrados = this.planesAbastecimiento
      })
      return
    }

    update(() => {
      const needle = val.toLowerCase()
      this.planesFiltrados = this.planesAbastecimiento.filter(
        plan => plan.nombre.toLowerCase().includes(needle) ||
            plan.descripcion.toLowerCase().includes(needle)
      )
    })
  },

  async cargarPlanesAbastecimiento() {
    try {
      if (!this.supplyPlansStore) {
        console.error('Store de Pinia no inicializado');
        return;
      }

      // Usar el store de Pinia directamente
      await this.supplyPlansStore.fetchAllPlans();

      // Obtener los datos del store
      const plansData = this.supplyPlansStore.plans;
      console.log('Planes desde Pinia store:', plansData);

      // Mapear los datos para que coincidan con el formato esperado
      this.planesAbastecimiento = plansData.map(plan => ({
        id: plan.id,
        nombre: plan.name || plan.nombre || `Plan ${plan.id}`,
        descripcion: plan.description || plan.descripcion || 'Sin descripción'
      }));
      this.planesFiltrados = [...this.planesAbastecimiento];

      console.log('Planes cargados:', this.planesAbastecimiento);

    } catch (error) {
      console.error('Error al cargar planes de abastecimiento:', error);
      this.$q.notify({
        type: 'negative',
        message: 'Error al cargar los planes de abastecimiento',
        position: 'top',
        timeout: 3000
      });
    }
  },

  mostrarDialogo(tipo, mensaje) {
    this.dialogIcon = tipo === 'success' ? 'check_circle' : 'error'
    this.dialogColor = tipo === 'success' ? 'positive' : 'negative'
    this.dialogMessage = mensaje
    this.dialogButton = 'Aceptar'
    this.showDialog = true
  },

  obtenerUsuarioActual() {
    try {
      // Intentar obtener desde localStorage (común en muchas apps)
      const token = localStorage.getItem('token')
      if (token) {
        const tokenData = JSON.parse(token)
        return tokenData.usuario || tokenData.username || tokenData.user || tokenData.email || 'system'
      }

      // Intentar obtener desde sessionStorage
      const sessionUser = sessionStorage.getItem('usuario') || sessionStorage.getItem('user')
      if (sessionUser) {
        return sessionUser
      }

      // Intentar obtener desde datos de usuario en localStorage
      const userData = localStorage.getItem('userData') || localStorage.getItem('usuario')
      if (userData) {
        const parsed = JSON.parse(userData)
        return parsed.nombre || parsed.username || parsed.user || parsed.email || 'system'
      }

      return 'system'
    } catch (error) {
      console.error('Error al obtener usuario actual:', error)
      return 'system'
    }
  },

  async onSubmit() {
    this.loading = true

    try {
      // Validar fechas
      if (!this.validarFechaFinal(this.formData.fechaFinal)) {
        throw new Error('La fecha final debe ser posterior a la fecha de inicio')
      }

      // Preparar datos limpios para enviar al API
      const rubroData = {
        id: null,
        name: this.formData.nombreRubro ? this.formData.nombreRubro.trim() : '',
        description: this.formData.descripcionRubro ? this.formData.descripcionRubro.trim() : '',
        planId: this.formData.planAbastecimiento,
        startDate: this.formData.fechaInicio,
        endDate: this.formData.fechaFinal,
        totalBudget: Number(this.formData.valorPresupuesto) || 0,
        usedBudget: 0,
        active: Boolean(this.formData.activar),
        createdBy: this.obtenerUsuarioActual() || 'system',
        createdAt: new Date().toISOString().split('T')[0].replace(/-/g, '/') // Formato YYYY/MM/DD
      }

      console.log('Rubro data:', rubroData);

      // Cargar los datos en el store antes de llamar a createRubro
      this.rubrosStore.loadRubro(rubroData)

      let result
      if (this.rubroId) {
        // Actualizar rubro existente
        result = await this.rubrosStore.updateRubro()
        this.mostrarDialogo('success', 'Rubro actualizado exitosamente')
        this.$emit('rubro-actualizado', result)
      } else {
        // Crear nuevo rubro
        result = await this.rubrosStore.createRubro()
        this.mostrarDialogo('success', 'Rubro creado exitosamente')
        this.$emit('rubro-guardado', result)
      }

      // Resetear formulario después de guardar
      this.onReset()

    } catch (error) {
      console.error('Error al guardar rubro:', error)

      // Mostrar error más detallado
      let errorMessage = 'Error al guardar el rubro'
      if (error.response) {
        if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message
        } else if (error.response.data && error.response.data.error) {
          errorMessage = error.response.data.error
        } else if (error.response.status === 400) {
          errorMessage = 'Datos inválidos. Por favor verifique todos los campos.'
        }
      } else if (error.message) {
        errorMessage = error.message
      }

      this.mostrarDialogo('error', errorMessage)
    } finally {
      this.loading = false
    }
  },

  async guardarEstadoActivacion() {
    this.loadingActivacion = true;

    try {
      // Validar que se tengan los datos necesarios
      if (!this.formData.fechaActivacion || !this.formData.motivoCambio) {
        this.$q.notify({
          type: 'negative',
          message: 'Debe completar la fecha de activación y el motivo del cambio',
          position: 'top',
          timeout: 3000
        });
        return;
      }

      // Simular llamada a API para guardar el estado de activación
      console.log('Guardando estado de activación:', {
        id: this.rubroId,
        activar: this.formData.activar,
        fechaActivacion: this.formData.fechaActivacion,
        motivoCambio: this.formData.motivoCambio
      });

      // Aquí iría la llamada real a la API
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mostrar notificación de éxito
      this.$q.notify({
        type: 'positive',
        message: this.formData.activar ? 'Rubro activado exitosamente' : 'Rubro desactivado exitosamente',
        position: 'top',
        timeout: 3000
      });

      // Emitir evento si es necesario
      this.$emit('estado-actualizado', {
        id: this.rubroId,
        activar: this.formData.activar,
        fechaActivacion: this.formData.fechaActivacion,
        motivoCambio: this.formData.motivoCambio
      });

    } catch (error) {
      console.error('Error al guardar estado de activación:', error);
      this.$q.notify({
        type: 'negative',
        message: `Error: ${error.message || 'No se pudo guardar el estado del rubro'}`,
        position: 'top',
        timeout: 3000
      });
    } finally {
      this.loadingActivacion = false;
    }
  },

  onReset() {
    this.formData = {
      nombreRubro: '',
      descripcionRubro: '',
      planAbastecimiento: null,
      fechaInicio: '',
      fechaFinal: '',
      valorPresupuesto: null
    }

    this.planesFiltrados = [...this.planesAbastecimiento]
  }
},

mounted() {
  // Inicializar los stores de Pinia
  this.supplyPlansStore = useSupplyPlansStore()
  this.rubrosStore = useRubrosStore()

  // Cargar planes de abastecimiento al montar el componente
  this.cargarPlanesAbastecimiento()

  if(this.rubroId){
    this.cargarRubro()
  }
},

watch: {
  'formData.fechaInicio'(nuevaFecha) {
    if (nuevaFecha && this.formData.fechaFinal) {
      if (!this.validarFechaFinal(this.formData.fechaFinal)) {
        this.formData.fechaFinal = ''
      }
    }
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
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
