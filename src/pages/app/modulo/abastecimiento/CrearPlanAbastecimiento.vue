<template>
  <div class="q-pa-md">
    <q-card class="my-card" style="max-width: 800px; margin: 0 auto;">
      <!-- Cabecera de formulario -->
       <q-card-section class="bg-success text-white">
        <div class="text-h3">Plan de Abastecimiento</div>
        <div class="text-h5">Complete la información del plan</div>
       </q-card-section>

       <!-- Cuerpo del formulario -->
        <q-card-section>
          <q-form @submit="onSubmit" @reset="onReset" class="g-gutter-md">
            <!-- Nombre del plan -->
              <q-input
                    filled
                    v-model="formData.name"
                    label="Nombre del plan *"
                    hint="Ingrese un nombre descriptivo"
                    lazy-rules
                    :rules="[ val => val && val.length > 0 || 'El nombre es requerido']"
              >
            <template v-slot:prepend>
              <q-icon name="assignment" />
            </template>
          </q-input>

          <!-- 2. Descripción del plan -->
            <q-input
            filled
            v-model="formData.description"
            label="Descripción del plan"
            hint="Describa el propósito del plan"
            type="textarea"
            autogrow
          >
            <template v-slot:prepend>
              <q-icon name="description" />
            </template>
          </q-input>
          <!-- 3. Líder del plan -->
             <q-input
            filled
            v-model="formData.ownerId"
            label="Líder del plan *"
            hint="Nombre del responsable"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'El líder es requerido']"
          >
            <template v-slot:prepend>
              <q-icon name="person" />
            </template>
          </q-input>
          <!-- 4. Fecha de inicio -->
             <q-input
            filled
            v-model="formData.startDate"
            label="Fecha de inicio *"
            mask="date"
            :rules="['date']"
          >
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="formData.startDate" mask="YYYY-MM-DD" />
                </q-popup-proxy>
              </q-icon>
            </template>
            <template v-slot:append>
              <q-icon name="close" @click="formData.startDate = ''" class="cursor-pointer" />
            </template>
          </q-input>

          <!-- 5. Fecha final -->
               <q-input
            filled
            v-model="formData.endDate"
            label="Fecha final *"
            mask="date"
            :rules="['date', val => val >= formData.startDate || 'La fecha final debe ser posterior a la fecha de inicio']"
          >
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="formData.endDate" mask="YYYY-MM-DD" />
                </q-popup-proxy>
              </q-icon>
            </template>
            <template v-slot:append>
              <q-icon name="close" @click="formData.endDate = ''" class="cursor-pointer" />
            </template>
          </q-input>
          <!-- 6. Estado del plan -->
             <q-select
            filled
            v-model="formData.status"
            :options="estadosOptions"
            label="Estado del plan *"
            hint="Seleccione el estado actual"
            emit-value
            map-options
            lazy-rules
            :rules="[ val => val && val !== null || 'El estado es requerido']"
          >
            <template v-slot:prepend>
              <q-icon name="flag" />
            </template>
          </q-select>

          <!-- Separador -->
           <q-separator />

           <!-- Botones de acción -->
            <div class="row justify-end 1-gutter-sm">
              <q-btn
              label="Limpiar"
              type="reset"
              color="secondary"
              flat
              class="q-ml-sm"
            />
            <q-btn
              label="Guardar plan"
              type="submit"
              color="primary"
              icon="save"
            />
            </div>
          </q-form>
        </q-card-section>

        <!-- Mensaje de éxito/error -->
         <q-inner-loading :showing="loading">
            <q-spinner-gears  size="50px" color="success" />
         </q-inner-loading>
    </q-card>

    <!-- Diálogo de confirmación -->
     <p-dialog v-model="showDialog"  v-if="showDialog">
      <q-card>
        <q-card-section>
          <q-avatar icon="check_circle" color="positive" text-white="white" />
          <span class="q-ml-sm">{{ dialogMessage }}</span>
        </q-card-section>
        <q-card-sections align="right">
          <q-btn flat label="Aceptar" color="primary" v-close-popup />
        </q-card-sections>
      </q-card>
     </p-dialog>
  </div>
</template>
<script>
import { ref } from '@vue/composition-api';
import { useSupplyPlansStore } from 'src/piña/supplyPlans';


export default {
  name: 'CrearPlanAbastecimiento',

  setup(){
    const store = useSupplyPlansStore();

     // Opciones para el campo estado
    const estadosOptions = [
        { label: 'Activo', value: 'activo' },
        { label: 'En pausa', value: 'en_pausa' },
        { label: 'Completado', value: 'completado' },
        { label: 'Cancelado', value: 'cancelado' },
        { label: 'En planificación', value: 'en_planificacion' }
    ];

    const showDialog = ref(false);
    const dialogMessage = ref('');

    // Método para manejar el envío del formulario
    const onSubmit = async () => {
  try {
    // Validar fechas
    if (store.form.startDate && store.form.endDate) {
      // Comparar fechas directamente (JavaScript puede comparar Date objects)
      const fechaInicio = new Date(store.form.startDate);
      const fechaFinal = new Date(store.form.endDate);

      if (fechaFinal <= fechaInicio) {
        throw new Error('La fecha final debe ser posterior a la fecha de inicio');
      }
    }

    // Guardar proyecto
    await store.saveProject();

    // Verificar errores después de guardar
    if (store.errors && Object.keys(store.errors).length > 0) {
      throw new Error(store.errors.general || 'Error al guardar');
    }

    // Éxito
    dialogMessage.value = '¡Plan guardado exitosamente!';
    showDialog.value = true;
    alert(dialogMessage.value);
    setTimeout(() => showDialog.value = !showDialog.value, 3000);
    onReset();

  } catch (error) {
    dialogMessage.value = `Error: ${error.message}`;
    showDialog.value = true;
  }
}

    // Método para resetear el formulario
    const onReset = () => {
      store.resetForm();
    }

    const formatearFechaDDMMYYYY = (fecha) => {
      if(!fecha) return '';

      const date = new Date(fecha);
      if(isNaN(date.getTime())) return 'Fecha invalida';

      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();


      return `${day}/${month}/${year}`
    }


    return {
      formData: store.form,
      loading: store.isSubmitting,
      errors: store.errors,
      estadosOptions,
      showDialog,
      dialogMessage,
      onSubmit,
      onReset
    }
  }
}
</script>
