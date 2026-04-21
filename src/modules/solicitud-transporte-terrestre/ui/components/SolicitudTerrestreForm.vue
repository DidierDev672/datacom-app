<template>
  <div class="bg-white rounded-2xl shadow-2 border-grey-2 overflow-hidden">
    <!-- Stepper Header -->
    <div class="bg-grey-1 border-b-grey-2 q-px-lg q-py-lg">
      <div class="row items-center justify-between no-wrap overflow-hidden">
        <div 
          v-for="step in steps" 
          :key="step.id"
          class="row items-center cursor-pointer group no-wrap"
          @click="goToStep(step.id)"
        >
          <div 
            class="q-btn-round q-btn--dense flex flex-center transition-all duration-300 text-weight-bold"
            :style="stepCircleStyle(step.id)"
            style="width: 40px; height: 40px; border-radius: 50%;"
          >
            <span v-if="currentStep <= step.id">{{ step.id }}</span>
            <q-icon v-else name="check" size="20px" />
          </div>
          <div class="q-ml-md gt-xs">
            <p 
              class="text-caption text-weight-bolder text-uppercase q-mb-none" 
              style="letter-spacing: 0.1em; line-height: 1;"
              :class="currentStep === step.id ? 'text-blue-6' : 'text-grey-5'"
            >
              Paso {{ step.id }}
            </p>
            <p 
              class="text-sm text-weight-bold q-mb-none"
              :class="currentStep === step.id ? 'text-dark' : 'text-grey-6'"
            >
              {{ step.title }}
            </p>
          </div>
          <div v-if="step.id < steps.length" class="q-mx-lg bg-grey-3 gt-sm" style="height: 1px; width: 40px;"></div>
        </div>
      </div>
    </div>

    <!-- Form Content -->
    <div class="q-pa-xl full-width">
      <form @submit.prevent="handleSubmit">
        
        <!-- Step 1: Identificación y Servicio -->
        <div v-if="currentStep === 1" class="q-gutter-y-lg animate-in">
          <div class="row q-col-gutter-lg">
            <div class="col-12 col-md-6">
              <q-item-label class="text-caption text-weight-bold text-grey-8 q-mb-xs">Código de Solicitud</q-item-label>
              <q-input 
                v-model="form.codigo" 
                outlined 
                dense 
                placeholder="STT-000-2026"
                class="rounded-xl"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-item-label class="text-caption text-weight-bold text-grey-8 q-mb-xs">Fecha de Solicitud</q-item-label>
              <q-input 
                v-model="form.fecha" 
                type="date" 
                outlined 
                dense
              />
            </div>
            <div class="col-12 col-md-6">
              <q-item-label class="text-caption text-weight-bold text-grey-8 q-mb-xs">Proyecto</q-item-label>
              <q-input 
                v-model="form.proyecto" 
                outlined 
                dense 
                placeholder="Nombre del proyecto"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-item-label class="text-caption text-weight-bold text-grey-8 q-mb-xs">Área / Departamento</q-item-label>
              <q-input 
                v-model="form.area" 
                outlined 
                dense 
                placeholder="Ej: Operaciones, TI, Logística"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-item-label class="text-caption text-weight-bold text-grey-8 q-mb-xs">Solicitante</q-item-label>
              <q-input 
                v-model="form.solicitante" 
                outlined 
                dense 
                placeholder="Nombre completo"
              />
            </div>
          </div>
          
          <div class="q-pt-lg border-t-grey-2">
            <h3 class="text-h6 text-weight-bold text-dark q-mb-md">Información del Servicio</h3>
            <div class="row q-col-gutter-lg">
              <div class="col-12 col-md-6">
                <q-item-label class="text-caption text-weight-bold text-grey-8 q-mb-xs">Tipo de Servicio</q-item-label>
                <q-select 
                  v-model="form.servicio.tipoServicio"
                  :options="tipoServicioOptions"
                  outlined
                  dense
                  emit-value
                  map-options
                />
              </div>
              <div class="col-12 col-md-6">
                <q-item-label class="text-caption text-weight-bold text-grey-8 q-mb-xs">Tipo de Vehículo</q-item-label>
                <q-select 
                  v-model="form.servicio.tipoVehiculo"
                  :options="tipoVehiculoOptions"
                  outlined
                  dense
                  emit-value
                  map-options
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Step 2: Detalle del Transporte -->
        <div v-if="currentStep === 2" class="q-gutter-y-lg animate-in">
          <div class="row q-col-gutter-lg">
            <div class="col-12 col-md-6">
              <q-item-label class="text-caption text-weight-bold text-grey-8 q-mb-xs">Lugar de Origen</q-item-label>
              <q-input 
                v-model="form.transporte.origen" 
                outlined 
                dense 
                placeholder="Ciudad / Punto de partida"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-item-label class="text-caption text-weight-bold text-grey-8 q-mb-xs">Lugar de Destino</q-item-label>
              <q-input 
                v-model="form.transporte.destino" 
                outlined 
                dense 
                placeholder="Ciudad / Punto de llegada"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-item-label class="text-caption text-weight-bold text-grey-8 q-mb-xs">Fecha y Hora de Salida</q-item-label>
              <q-input 
                v-model="form.transporte.fechaHoraSalida" 
                type="datetime-local" 
                outlined 
                dense
              />
            </div>
            <div v-if="form.servicio.tipoServicio === 'IDA_Y_REGRESO'" class="col-12 col-md-6">
              <q-item-label class="text-caption text-weight-bold text-grey-8 q-mb-xs">Fecha y Hora de Regreso</q-item-label>
              <q-input 
                v-model="form.transporte.fechaHoraRegreso" 
                type="datetime-local" 
                outlined 
                dense
              />
            </div>
          </div>
        </div>

        <!-- Step 3: Pasajeros -->
        <div v-if="currentStep === 3" class="q-gutter-y-lg animate-in">
          <div class="row items-center justify-between q-mb-md">
            <h3 class="text-h6 text-weight-bold text-dark q-my-none">Listado de Pasajeros</h3>
            <q-btn 
              unelevated 
              color="dark" 
              class="text-weight-bold"
              no-caps
              @click="addPasajero"
            >
              <q-icon left name="group_add" />
              Nro. Personas: {{ form.pasajeros.length }}
            </q-btn>
          </div>

          <div class="q-gutter-y-md">
            <div 
              v-for="(pasajero, index) in form.pasajeros" 
              :key="index"
              class="q-pa-md rounded-xl border-grey-2 bg-grey-1 row q-col-gutter-md items-end relative-position"
            >
              <div class="col-12 col-md-3">
                <q-item-label class="text-[10px] text-weight-bold text-grey-6 text-uppercase">Nombre Completo</q-item-label>
                <q-input v-model="pasajero.nombre" outlined dense bg-color="white" />
              </div>
              <div class="col-12 col-md-3">
                <q-item-label class="text-[10px] text-weight-bold text-grey-6 text-uppercase">Documento</q-item-label>
                <q-input v-model="pasajero.documento" outlined dense bg-color="white" />
              </div>
              <div class="col-12 col-md-3">
                <q-item-label class="text-[10px] text-weight-bold text-grey-6 text-uppercase">Cargo</q-item-label>
                <q-input v-model="pasajero.cargo" outlined dense bg-color="white" />
              </div>
              <div class="col-12 col-md-2">
                <q-item-label class="text-[10px] text-weight-bold text-grey-6 text-uppercase">Teléfono</q-item-label>
                <q-input v-model="pasajero.telefono" outlined dense bg-color="white" />
              </div>
              <div class="col-12 col-md-1 text-right">
                <q-btn flat round dense icon="delete" color="grey-4" @click="removePasajero(index)" class="hover:text-red-5" />
              </div>
            </div>
            
            <q-btn 
              v-if="form.pasajeros.length === 0"
              outline 
              color="grey-4" 
              class="full-width q-py-xl text-grey-7 text-weight-bold" 
              style="border: 2px dashed #e2e8f0; border-radius: 16px;"
              @click="addPasajero"
            >
              <q-icon left name="add" />
              Agregar el primer pasajero
            </q-btn>
          </div>
        </div>

        <!-- Step 4: Justificación y Aprobación -->
        <div v-if="currentStep === 4" class="q-gutter-y-lg animate-in">
          <div class="q-gutter-y-md">
            <h3 class="text-h6 text-weight-bold text-dark q-my-none q-pl-md" style="border-left: 4px solid #2563eb;">Justificación Integral</h3>
            <div class="q-gutter-y-sm">
              <q-item-label class="text-caption text-weight-bold text-grey-8">Motivo del Traslado</q-item-label>
              <q-input 
                v-model="form.justificacion.motivoTraslado" 
                type="textarea" 
                rows="3"
                outlined 
                placeholder="Describa detalladamente el por qué del traslado operativo..."
              />
              <p class="text-[10px] text-grey-5 q-mt-xs">Min. 20 caracteres para asegurar la transparencia de la solicitud.</p>
            </div>
            <div class="q-gutter-y-sm">
              <q-item-label class="text-caption text-weight-bold text-grey-8">Relación con el Proyecto</q-item-label>
              <q-input 
                v-model="form.justificacion.relacionProyecto" 
                outlined 
                dense 
                placeholder="Componente o actividad del proyecto vinculada"
              />
            </div>
          </div>

          <div class="q-pt-lg border-t-grey-2">
            <h3 class="text-h6 text-weight-bold text-dark q-mb-md">Firmas de Aprobación</h3>
            <div class="row q-col-gutter-lg">
              <div class="col-12 col-md-6">
                <q-item-label class="text-caption text-weight-bold text-grey-8 q-mb-xs">Jefe Inmediato (Aprobador 1)</q-item-label>
                <q-input 
                  v-model="form.aprobaciones.jefeInmediato" 
                  outlined 
                  dense 
                  placeholder="Nombre del responsable"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-item-label class="text-caption text-weight-bold text-grey-8 q-mb-xs">Dirección Administrativa (Aprobador 2)</q-item-label>
                <q-input 
                  v-model="form.aprobaciones.areaAdministrativa" 
                  outlined 
                  dense 
                  placeholder="Dependencia administrativa"
                />
              </div>
            </div>
          </div>

          <!-- Ethical Checkbox -->
          <q-banner dense class="bg-blue-1 text-blue-9 rounded-xl border-blue-2 q-pa-md">
            <template v-slot:avatar>
              <q-checkbox v-model="ethicsAccepted" color="blue-6" />
            </template>
            <div>
              <p class="text-weight-bold q-mb-none">Declaración de Responsabilidad Ética</p>
              <p class="text-caption q-mb-none line-height-1-5">
                Confirmó que los datos suministrados son veraces y que el traslado cumple con las políticas de seguridad y uso eficiente de los recursos de la organización.
              </p>
            </div>
          </q-banner>
        </div>

        <!-- Alert Error -->
        <q-banner v-if="error" dense class="bg-red-1 text-red-9 q-mt-lg rounded-lg border-red-500 animate-bounce">
          <template v-slot:avatar>
            <q-icon name="error" color="red-6" />
          </template>
          {{ error }}
        </q-banner>

        <!-- Navigation Buttons -->
        <div class="q-mt-xl row items-center justify-between no-wrap">
          <q-btn 
            flat 
            no-caps 
            color="grey-7" 
            class="text-weight-bold q-px-lg"
            @click="prevStep"
            v-if="currentStep > 1"
          >
            <q-icon left name="arrow_back" />
            Volver
          </q-btn>
          <div v-else></div>
          
          <q-btn 
            v-if="currentStep < 4" 
            unelevated 
            color="dark" 
            class="text-weight-bold q-px-xl shadow-8"
            padding="16px 40px"
            style="border-radius: 16px;"
            @click="nextStep"
            no-caps
          >
            Continuar
            <q-icon right name="arrow_forward" />
          </q-btn>
          
          <q-btn 
            v-else
            unelevated
            color="blue-6"
            class="text-weight-bold q-px-xl shadow-8"
            padding="16px 48px"
            style="border-radius: 16px;"
            :disabled="!ethicsAccepted || isSubmitting"
            :loading="isSubmitting"
            type="submit"
            no-caps
          >
            {{ isEditMode ? 'Guardar Cambios' : 'Finalizar y Enviar' }}
          </q-btn>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { useSolicitudTerrestreStore } from '../../application/solicitudTerrestre.store.js';

export default {
  name: 'SolicitudTerrestreForm',
  emits: ['success'],
  
  data() {
    const store = useSolicitudTerrestreStore();
    return {
      store,
      currentStep: 1,
      isSubmitting: false,
      ethicsAccepted: false,
      error: null,
      steps: [
        { id: 1, title: 'Servicio' },
        { id: 2, title: 'Transporte' },
        { id: 3, title: 'Pasajeros' },
        { id: 4, title: 'Aprobación' }
      ],
      tipoServicioOptions: [
        { label: 'Sólo Ida', value: 'IDA' },
        { label: 'Ida y Regreso', value: 'IDA_Y_REGRESO' }
      ],
      tipoVehiculoOptions: [
        { label: 'Automóvil (Sedán)', value: 'AUTOMOVIL' },
        { label: 'Camioneta (4x4)', value: 'CAMIONETA' },
        { label: 'Bus / Microbús', value: 'BUS' },
        { label: 'Camión de Carga', value: 'CAMION' }
      ],
      form: {
        ...store.solicitudActual,
        pasajeros: [...(store.solicitudActual.pasajeros || [])]
      }
    };
  },
  
  computed: {
    isEditMode() {
      return !!this.form.idSolicitud;
    }
  },
  
  methods: {
    nextStep() {
      if (this.currentStep < 4) this.currentStep++;
    },
    
    prevStep() {
      if (this.currentStep > 1) this.currentStep--;
    },
    
    goToStep(step) {
      if (step < this.currentStep) this.currentStep = step;
    },
    
    stepCircleStyle(stepId) {
      if (this.currentStep === stepId) {
        return 'background: #2563eb; color: white; box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.2); ring: 4px #dbeafe;';
      }
      if (this.currentStep > stepId) {
        return 'background: #10b981; color: white;';
      }
      return 'background: #e2e8f0; color: #64748b;';
    },

    addPasajero() {
      this.form.pasajeros.push({
        nombre: '',
        documento: '',
        cargo: '',
        telefono: ''
      });
    },
    
    removePasajero(index) {
      this.form.pasajeros.splice(index, 1);
    },
    
    async handleSubmit() {
      if (!this.ethicsAccepted) return;
      
      this.isSubmitting = true;
      this.error = null;
      
      try {
        let result;
        if (this.isEditMode) {
          result = await this.store.update(this.form.idSolicitud, this.form);
        } else {
          result = await this.store.create(this.form);
        }
        this.$emit('success', result);
      } catch (err) {
        this.error = this.store.error || 'Ocurrió un error inesperado. Por favor verifique los datos.';
        console.error(err);
      } finally {
        this.isSubmitting = false;
      }
    }
  }
};
</script>

<style scoped>
@keyframes in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-in {
  animation: in 0.5s ease-out forwards;
}
</style>
