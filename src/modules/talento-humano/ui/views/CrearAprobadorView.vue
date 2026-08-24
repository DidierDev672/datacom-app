<template>
  <q-page class="q-pa-md" style="max-width: 640px; margin: 0 auto;">
    <AprobadorCreateForm />
  </q-page>
</template>

<script>
import AprobadorCreateForm from '../components/AprobadorCreateForm.vue';

export default {
  name: 'CrearAprobadorView',

  components: {
    AprobadorCreateForm
  }
};
</script>
