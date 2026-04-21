<template>
  <div>
    <AlertaGlobal 
      v-if="error" 
      :error="error" 
      :fieldErrors="fieldErrors" 
      @clear="store.error = null; store.fieldErrors = []" 
    />

    <q-stepper
      v-model="step"
      ref="stepper"
      color="primary"
      animated
      flat
      bordered
    >
      <q-step
        :name="1"
        title="Identificación"
        icon="info"
        :done="step > 1"
      >
        <StepIdentificacion ref="step1" v-model="formData" />
      </q-step>

      <q-step
        :name="2"
        title="Detalle de ítems"
        icon="list"
        :done="step > 2"
      >
        <StepDetalle ref="step2" v-model="formData.items" />
      </q-step>

      <q-step
        :name="3"
        title="Justificación"
        icon="edit"
      >
        <StepJustificacion ref="step3" v-model="formData" />
      </q-step>

      <template v-slot:navigation>
        <q-stepper-navigation>
          <q-btn
            @click="avanzarOEnviar()"
            color="primary"
            :loading="isLoading"
            :disable="isLoading"
            :label="step === 3 ? 'Enviar requisición' : 'Siguiente'" 
          />
          <q-btn
            v-if="step > 1"
            flat
            color="primary"
            @click="$refs.stepper.previous()"
            label="Atrás"
            class="q-ml-sm"
            :disable="isLoading"
          />
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </div>
</template>

<script>
import AlertaGlobal from './AlertaGlobal.vue';
import StepIdentificacion from './StepIdentificacion.vue';
import StepDetalle from './StepDetalle.vue';
import StepJustificacion from './StepJustificacion.vue';
import { useRequisicionStore } from '../store/useRequisicionStore';

export default {
  name: 'RequisicionStepper',
  components: {
    AlertaGlobal,
    StepIdentificacion,
    StepDetalle,
    StepJustificacion
  },
  data() {
    return {
      step: 1,
      formData: {
        codigo: '',
        proyecto: '',
        lineaAccion: '',
        mandato: '',
        municipio: '',
        fechaSolicitud: '',
        lugarEntrega: '',
        fechaEntrega: '',
        solicitante: '',
        items: [],
        justificacion: '',
        recomendaciones: ''
      }
    }
  },
  computed: {
    store() {
      return useRequisicionStore();
    },
    error() {
      return this.store.error;
    },
    fieldErrors() {
      return this.store.fieldErrors;
    },
    isLoading() {
      return this.store.isLoading;
    }
  },
  methods: {
    async avanzarOEnviar() {
      // Validate current step before advancing
      const currentStepComponent = this.$refs[`step${this.step}`];
      if (currentStepComponent && typeof currentStepComponent.validate === 'function') {
        const isValid = currentStepComponent.validate();
        if (!isValid) {
          this.store.error = 'Por favor, revise los errores en este paso antes de continuar.';
          return;
        }
      }
      this.store.error = null;

      if (this.step < 3) {
        this.$refs.stepper.next();
      } else {
        await this.enviar();
      }
    },
    async enviar() {
      try {
        await this.store.create(this.formData);
        
        this.$q.notify({
          color: 'positive',
          title: 'Éxito',
          message: 'Requisición creada exitosamente.',
          icon: 'check',
          timeout: 3000
        });

        // Redirigir a la lista
        this.$router.push('/compras/requisiciones');
      } catch (err) {
        // El error ya es manejado por el store y mostrado en AlertaGlobal
        console.error('Error al guardar requisición:', err);
      }
    }
  }
}
</script>

<style scoped>
::v-deep .q-stepper__title {
  font-size: 16px !important;
  font-weight: 500 !important;
}
/* Additionally check if there 'botones' are needed in stepper, but the prompt only said Secciones for stepper */
::v-deep .q-stepper__step-inner .q-btn {
  font-size: 16px !important;
  font-weight: 500 !important;
}
</style>
