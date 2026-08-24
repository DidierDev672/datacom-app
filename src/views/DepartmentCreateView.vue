<template>
  <q-page class="q-pa-lg bg-grey-1">
    <div class="row items-center q-mb-lg">
      <q-btn flat round icon="arrow_back" color="grey-7" @click="onBack" />
      <h1 class="text-h4 text-weight-bold q-my-none text-primary q-ml-sm">
        Nuevo Departamento
      </h1>
    </div>

    <div class="row justify-center">
      <div class="col-12 col-xl-10">
        <DepartmentForm />
      </div>
    </div>
  </q-page>
</template>

<script>
import DepartmentForm from '../components/DepartmentForm.vue';

export default {
  name: 'DepartmentCreateView',
  components: {
    DepartmentForm
  },
  setup(props, { root }) {
    const router = root.$router;

    function onBack() {
      router.back();
    }

    return {
      onBack
    };
  }
};
</script>

<style scoped>
.text-primary {
  color: #4E9C4C !important;
}
</style>
