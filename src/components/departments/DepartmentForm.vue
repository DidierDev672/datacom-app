<template>
  <q-card flat class="form-card">
    <q-card-section class="q-pa-lg">
      <q-form @submit.prevent="handleSubmit">
        <!-- Banner de Error Global -->
        <q-banner v-if="formError" dense inline-actions class="text-white bg-red q-mb-lg rounded-borders">
          <template v-slot:avatar>
            <q-icon name="error" color="white" />
          </template>
          {{ formError }}
          <template v-slot:action>
            <q-btn flat color="white" icon="close" @click="formError = null" />
          </template>
        </q-banner>

        <!-- Sección 1: Info Departamento -->
        <SectionDepartamento v-model="form" />

        <q-separator spaced class="q-my-lg" />

        <!-- Sección 2: Áreas -->
        <SectionAreas v-model="form" />

        <!-- Acciones del Formulario -->
        <div class="row justify-end q-gutter-sm q-mt-xl">
          <q-btn
            flat
            color="grey-7"
            label="Cancelar"
            icon="arrow_back"
            :disable="isSaving"
            @click="onCancel"
          />
          <q-btn
            unelevated
            color="green"
            type="submit"
            :label="isEditing ? 'Actualizar Departamento' : 'Guardar Departamento'"
            icon="save"
            :loading="isSaving"
            :disable="isSaving"
          />
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script>
import { ref, reactive } from '@vue/composition-api';
import { useDepartmentStore } from '../../stores/department.store';
import SectionDepartamento from './sections/SectionDepartamento.vue';
import SectionAreas from './sections/SectionAreas.vue';

export default {
  name: 'DepartmentForm',
  components: {
    SectionDepartamento,
    SectionAreas
  },
  props: {
    initialData: {
      type: Object,
      default: null
    },
    isEditing: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { root }) {
    const departmentStore = useDepartmentStore();
    const $q = root.$q;
    const router = root.$router;

    const isSaving = ref(false);
    const formError = ref(null);

    const form = reactive({
      name:        props.initialData ? props.initialData.name : '',
      code:        props.initialData ? props.initialData.code : '',
      description: props.initialData ? props.initialData.description : '',
      status:      props.initialData ? props.initialData.status : 'ACTIVO',
      areas:       props.initialData && props.initialData.areas 
                    ? props.initialData.areas.map(a => ({ ...a })) 
                    : []
    });

    function validateForm() {
      if (!form.name || form.name.length < 3) {
        formError.value = 'El nombre del departamento debe tener al menos 3 caracteres.';
        return false;
      }
      
      for (let i = 0; i < form.areas.length; i++) {
        const area = form.areas[i];
        if (!area.name || area.name.length < 2) {
          formError.value = `El nombre del área "${i + 1}" es requerido (mínimo 2 caracteres).`;
          return false;
        }
      }
      
      formError.value = null;
      return true;
    }

    async function handleSubmit() {
      if (!validateForm()) return;

      isSaving.value = true;
      try {
        if (props.isEditing && props.initialData && props.initialData.id) {
          await departmentStore.update(props.initialData.id, form);
          $q.notify({
            type: 'positive',
            message: 'Departamento actualizado correctamente.',
            icon: 'check_circle'
          });
        } else {
          const created = await departmentStore.create(form);
          $q.notify({
            type: 'positive',
            message: `Departamento "${created.name}" creado con éxito.`,
            icon: 'cloud_done'
          });
        }
        router.push('/departments');
      } catch (error) {
        console.error('Error in handleSubmit:', error);
        const backendMessage = error && error.message ? error.message : 'No se pudo guardar la información.';
        formError.value = backendMessage;
        
        $q.notify({
          type: 'negative',
          message: backendMessage,
          icon: 'report_problem'
        });
      } finally {
        isSaving.value = false;
      }
    }

    function onCancel() {
      router.back();
    }

    return {
      form,
      isSaving,
      formError,
      handleSubmit,
      onCancel
    };
  }
};
</script>

<style scoped>
.form-card {
  border-radius: 12px;
  background: white;
}
</style>
