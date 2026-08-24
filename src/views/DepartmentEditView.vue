<template>
  <q-page class="q-pa-lg bg-grey-1">
    <div class="row items-center q-mb-lg">
      <q-btn flat round icon="arrow_back" color="grey-7" @click="onBack" />
      <h1 class="text-h4 text-weight-bold q-my-none text-primary q-ml-sm">
        Editar Departamento
      </h1>
    </div>

    <div class="row justify-center">
      <div class="col-12 col-xl-10">
        <!-- Loader mientras se obtienen datos -->
        <q-card v-if="departmentStore.isLoading" flat class="q-pa-xl text-center">
          <q-spinner-cube color="green" size="40px" />
          <p class="q-mt-md text-grey-7">Cargando información del departamento...</p>
        </q-card>

        <!-- Formulario con datos cargados -->
        <DepartmentForm
          v-else-if="departmentStore.currentDepartment"
          :initial-data="departmentStore.currentDepartment"
          :is-editing="true"
        />

        <!-- Error si no se encuentra -->
        <q-banner v-else-if="!departmentStore.isLoading" class="bg-red-1 text-red-9 rounded-borders">
          <template v-slot:avatar>
            <q-icon name="error" />
          </template>
          No se pudo cargar la información del departamento. Es posible que el ID sea inválido o haya un problema de conexión.
          <template v-slot:action>
            <q-btn flat label="Regresar" @click="onBack" />
          </template>
        </q-banner>
      </div>
    </div>
  </q-page>
</template>

<script>
import { onMounted } from '@vue/composition-api';
import DepartmentForm from '../components/DepartmentForm.vue';
import { useDepartmentStore } from '../stores/department.store';

export default {
  name: 'DepartmentEditView',
  components: {
    DepartmentForm
  },
  setup(props, { root }) {
    const route = root.$route;
    const router = root.$router;
    const departmentStore = useDepartmentStore();

    onMounted(async () => {
      const id = Number(route.params.id);
      if (!isNaN(id)) {
        try {
          await departmentStore.fetchById(id);
        } catch (err) {
          console.error('Error fetching department:', err);
        }
      } else {
        router.push('/departments');
      }
    });

    function onBack() {
      router.back();
    }

    return {
      departmentStore,
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
