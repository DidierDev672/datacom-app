<template>
  <div class="q-pa-md">
    <div class="row q-col-gutter-md">
      <!-- Fila 1 -->
      <div class="col-12 col-md-6">
        <q-input 
          v-model="model.proyecto" 
          label="Proyecto *" 
          :error="v$.proyecto.$error" 
          error-message="El proyecto es requerido"
          @blur="v$.proyecto.$touch"
          dense 
          outlined 
          readonly
          hint="Heredado de la pestaña Identificación"
        />
      </div>
      <div class="col-12 col-md-6">
        <q-input 
          v-model="model.lineaAccion" 
          label="Línea de acción *" 
          :error="v$.lineaAccion.$error" 
          error-message="La línea de acción es requerida"
          @blur="v$.lineaAccion.$touch"
          dense 
          outlined 
          readonly
          hint="Heredado de la pestaña Identificación"
        />
      </div>

      <!-- Fila 2 -->
      <div class="col-12">
        <q-input 
          v-model="model.justificacion" 
          type="textarea"
          label="Justificación *" 
          placeholder="Incluye la necesidad, el problema que resuelve, el impacto en el proyecto y la urgencia si aplica."
          :error="v$.justificacion.$error" 
          error-message="La justificación debe tener al menos 20 caracteres"
          @blur="v$.justificacion.$touch"
          dense 
          outlined 
          rows="4"
        />
      </div>

      <div class="col-12">
        <q-input 
          v-model="model.recomendaciones" 
          type="textarea"
          label="Recomendaciones y observaciones (Opcional)" 
          dense 
          outlined 
          rows="3"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { required, minLength } from 'vuelidate/lib/validators';

export default {
  name: 'StepJustificacion',
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      model: this.value
    };
  },
  watch: {
    model: {
      deep: true,
      handler(val) {
        this.$emit('input', val);
      }
    }
  },
  computed: {
    v$() {
      return this.$v.model;
    }
  },
  validations: {
    model: {
      proyecto: { required },
      lineaAccion: { required },
      justificacion: { required, minLength: minLength(20) }
    }
  },
  methods: {
    validate() {
      this.$v.$touch();
      return !this.$v.$invalid;
    }
  }
}
</script>

<style scoped>
</style>
