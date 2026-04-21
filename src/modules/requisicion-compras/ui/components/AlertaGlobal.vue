<template>
  <q-banner v-if="localError" inline-actions class="text-white bg-red-8 q-mb-md rounded-borders">
    <div class="text-weight-bold">{{ localError }}</div>
    <ul v-if="localFieldErrors && localFieldErrors.length > 0" class="q-pl-md q-mt-sm">
      <li v-for="(err, index) in localFieldErrors" :key="index">
        <b>{{ err.field }}:</b> {{ err.message }}
      </li>
    </ul>
    <template v-slot:action>
      <q-btn flat color="white" icon="close" @click="limpiar" />
    </template>
  </q-banner>
</template>

<script>
export default {
  name: 'AlertaGlobal',
  props: {
    error: {
      type: String,
      default: null
    },
    fieldErrors: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      localError: this.error,
      localFieldErrors: this.fieldErrors
    }
  },
  watch: {
    error(newVal) {
      this.localError = newVal;
    },
    fieldErrors(newVal) {
      this.localFieldErrors = newVal;
    }
  },
  methods: {
    limpiar() {
      this.localError = null;
      this.localFieldErrors = [];
      this.$emit('clear');
    }
  }
}
</script>
