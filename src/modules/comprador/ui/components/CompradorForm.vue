<template>
  <q-card flat bordered class="comprador-card">
    <q-card-section class="q-pa-lg">
      <q-form @submit.prevent="handleSubmit">
        <q-banner
          v-if="formError"
          dense
          inline-actions
          class="text-white bg-red q-mb-lg rounded-borders"
        >
          <template v-slot:avatar>
            <q-icon name="error" color="white" />
          </template>
          {{ formError }}
          <template v-slot:action>
            <q-btn flat color="white" icon="close" @click="formError = null" />
          </template>
        </q-banner>

        <div class="row q-col-gutter-md">
          <div
            v-for="(campo, index) in campos"
            :key="campo.name"
            class="col-12"
            :class="campo.colClass"
            :style="getFadeStyle(index)"
          >
            <label class="field-label">
              {{ campo.label }} <span v-if="campo.required" class="text-red">*</span>
            </label>
            <q-input
              v-model="form[campo.name]"
              :type="campo.type || 'text'"
              outlined
              dense
              :placeholder="campo.placeholder"
              :rules="campo.rules"
              lazy-rules
              :error="!!fieldErrors[campo.name]"
              :error-message="fieldErrors[campo.name]"
              :disable="isSaving"
            >
              <template v-slot:prepend>
                <q-icon :name="campo.icon" size="18px" color="grey-6" />
              </template>
            </q-input>
            <div class="field-helper">{{ campo.helper || '\u00A0' }}</div>
          </div>
        </div>

        <div class="row justify-end q-gutter-sm q-mt-xl">
          <q-btn
            flat
            color="grey-7"
            label="Limpiar"
            icon="refresh"
            :disable="isSaving"
            @click="resetForm"
          />
          <q-btn
            unelevated
            color="primary"
            label="Registrar Comprador"
            icon="person_add"
            type="submit"
            :loading="isSaving"
            :disable="isSaving"
            class="btn-registrar"
          />
        </div>
      </q-form>
    </q-card-section>

    <!-- Modal de carga con fade-in -->
    <q-dialog v-model="showLoadingModal" persistent backdrop-dismiss="false" class="fade-modal">
      <q-card class="loading-modal-card fade-in-animation">
        <q-card-section class="column items-center q-pa-xl">
          <q-spinner-dots size="48px" color="primary" class="q-mb-lg" />
          <div class="text-h6 text-weight-bold text-grey-8 text-center">
            Estamos registrando tu comprador
          </div>
          <div class="text-body2 text-grey-6 text-center q-mt-sm" style="max-width: 280px;">
            Un momento mientras guardamos la informacion. Esto solo tardara unos segundos.
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Modal de error con fade-in -->
    <q-dialog v-model="showErrorModal" class="fade-modal">
      <q-card class="error-modal-card fade-in-animation">
        <q-card-section class="column items-center q-pa-xl">
          <q-icon name="error_outline" size="56px" color="orange-6" class="q-mb-md" />
          <div class="text-h6 text-weight-bold text-grey-8 text-center">
            Algo no salio como esperabamos
          </div>
          <div class="text-body2 text-grey-6 text-center q-mt-sm" style="max-width: 300px;">
            {{ errorModalMessage }}
          </div>
          <q-btn
            unelevated
            color="primary"
            label="Entendido"
            icon="check"
            class="q-mt-lg"
            @click="closeErrorModal"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Modal de sesion expirada -->
    <q-dialog v-model="showSessionModal" persistent class="fade-modal">
      <q-card class="session-modal-card fade-in-animation">
        <q-card-section class="column items-center q-pa-xl">
          <q-icon name="lock" size="56px" color="primary" class="q-mb-md" />
          <div class="text-h6 text-weight-bold text-grey-8 text-center">
            Tu sesion ha expirado
          </div>
          <div class="text-body2 text-grey-6 text-center q-mt-sm" style="max-width: 300px;">
            Para continuar, necesitas iniciar sesion de nuevo. No te preocupes, es algo rapido.
          </div>
          <q-btn
            unelevated
            color="primary"
            label="Iniciar sesion"
            icon="login"
            class="q-mt-lg"
            @click="goToLogin"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script>
import { ref, reactive } from '@vue/composition-api';
import { Comprador } from '../../domain/Comprador';
import { useCompradorStore } from '../store/comprador.store';

export default {
  name: 'CompradorForm',
  setup(props, { root }) {
    var $q = root.$q;
    var compradorStore = useCompradorStore();

    var isSaving = ref(false);
    var formError = ref(null);
    var fieldErrors = reactive({});
    var visibleFields = ref([]);

    var showLoadingModal = ref(false);
    var showErrorModal = ref(false);
    var showSessionModal = ref(false);
    var errorModalMessage = ref('');

    var form = reactive({
      comprador: '',
      nit: '',
      ciudad: '',
      despacho: '',
      direccion: ''
    });

    var campos = [
      {
        name: 'comprador',
        label: 'Nombre del Comprador',
        placeholder: 'Ej: Juan Perez',
        icon: 'person',
        required: true,
        colClass: 'col-12 col-md-6',
        rules: [function (val) { return !!val || 'El nombre del comprador es requerido'; }]
      },
      {
        name: 'nit',
        label: 'NIT',
        placeholder: 'Ej: 900123456-7',
        icon: 'badge',
        required: true,
        colClass: 'col-12 col-md-6',
        rules: [function (val) { return !!val || 'El NIT es requerido'; }]
      },
      {
        name: 'ciudad',
        label: 'Ciudad',
        placeholder: 'Ej: Bogota',
        icon: 'location_city',
        required: true,
        colClass: 'col-12 col-md-6',
        rules: [function (val) { return !!val || 'La ciudad es requerida'; }]
      },
      {
        name: 'despacho',
        label: 'Despacho',
        placeholder: 'Ej: Despacho Central',
        icon: 'local_shipping',
        required: true,
        colClass: 'col-12 col-md-6',
        rules: [function (val) { return !!val || 'El despacho es requerido'; }]
      },
      {
        name: 'direccion',
        label: 'Direccion',
        placeholder: 'Ej: Carrera 7 # 45-12',
        icon: 'map',
        required: true,
        colClass: 'col-12',
        rules: [function (val) { return !!val || 'La direccion es requerida'; }]
      }
    ];

    function getFadeStyle(index) {
      if (visibleFields.value.includes(index)) {
        return {
          opacity: '1',
          transform: 'translateY(0)',
          transition: 'opacity 0.5s ease, transform 0.5s ease'
        };
      }
      return {
        opacity: '0',
        transform: 'translateY(12px)',
        transition: 'opacity 0.5s ease, transform 0.5s ease'
      };
    }

    function startStaggeredReveal() {
      campos.forEach(function (_, index) {
        setTimeout(function () {
          visibleFields.value = visibleFields.value.concat([index]);
        }, 300 + index * 400);
      });
    }

    function clearFieldErrors() {
      Object.keys(fieldErrors).forEach(function (key) {
        delete fieldErrors[key];
      });
    }

    function closeErrorModal() {
      showErrorModal.value = false;
      errorModalMessage.value = '';
      compradorStore.clearError();
    }

    function goToLogin() {
      showSessionModal.value = false;
      root.$router.push({ name: 'login' });
    }

    async function handleSubmit() {
      clearFieldErrors();
      formError.value = null;

      var comprador = new Comprador(form);

      try {
        comprador.validar();
      } catch (validationError) {
        formError.value = validationError.message;
        return;
      }

      isSaving.value = true;
      showLoadingModal.value = true;

      try {
        var payload = comprador.toJSON();
        await compradorStore.registrar(payload);

        showLoadingModal.value = false;

        $q.notify({
          type: 'positive',
          message: 'Comprador registrado con exito.',
          icon: 'cloud_done',
          position: 'top-right'
        });
        resetForm();
      } catch (error) {
        showLoadingModal.value = false;

        if (error && error.code === 'SESSION_EXPIRED') {
          showSessionModal.value = true;
          return;
        }

        var message = error && error.message
          ? error.message
          : 'No se pudo registrar el comprador. Por favor, intenta de nuevo.';

        formError.value = message;
        errorModalMessage.value = message;
        showErrorModal.value = true;
      } finally {
        isSaving.value = false;
      }
    }

    function resetForm() {
      form.comprador = '';
      form.nit = '';
      form.ciudad = '';
      form.despacho = '';
      form.direccion = '';
      clearFieldErrors();
      formError.value = null;
    }

    startStaggeredReveal();

    return {
      form: form,
      campos: campos,
      formError: formError,
      fieldErrors: fieldErrors,
      isSaving: isSaving,
      showLoadingModal: showLoadingModal,
      showErrorModal: showErrorModal,
      showSessionModal: showSessionModal,
      errorModalMessage: errorModalMessage,
      getFadeStyle: getFadeStyle,
      handleSubmit: handleSubmit,
      resetForm: resetForm,
      closeErrorModal: closeErrorModal,
      goToLogin: goToLogin
    };
  }
};
</script>

<style scoped>
.comprador-card {
  border-radius: 12px;
  background: white;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.field-label {
  display: block;
  margin-bottom: 4px;
  font-size: 12px;
  font-weight: 600;
  color: #475569;
  line-height: 1.4;
}

.field-helper {
  min-height: 18px;
  margin-top: 2px;
  font-size: 11px;
  color: #64748b;
  line-height: 1.4;
}

.btn-registrar {
  padding-left: 24px;
  padding-right: 24px;
  font-weight: 600;
  letter-spacing: 0.3px;
}

/* ---- Modal fade-in animation ---- */
.fade-in-animation {
  animation: fadeInUp 0.4s ease-out;
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(16px) scale(0.97);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.loading-modal-card {
  border-radius: 16px;
  min-width: 320px;
  max-width: 400px;
}

.error-modal-card {
  border-radius: 16px;
  min-width: 320px;
  max-width: 400px;
}

.session-modal-card {
  border-radius: 16px;
  min-width: 320px;
  max-width: 400px;
}
</style>
