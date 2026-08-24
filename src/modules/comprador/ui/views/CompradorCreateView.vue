<template>
  <q-page class="q-pa-lg bg-grey-1">
    <div class="row items-center q-mb-lg">
      <q-btn flat round icon="arrow_back" color="grey-7" @click="onBack" />
      <h1 class="text-h4 text-weight-bold q-my-none text-primary q-ml-sm">
        Registro de Comprador
      </h1>
    </div>

    <div class="row justify-center">
      <div class="col-12 col-xl-8">
        <q-card flat bordered class="header-banner q-mb-lg">
          <q-card-section class="row items-center q-pa-md">
            <q-icon name="waving_hand" size="28px" color="primary" class="q-mr-md" />
            <div>
              <div class="text-h6 text-weight-bold text-grey-8">
                Bienvenido al formulario de registro
              </div>
              <div class="text-body2 text-grey-6 q-mt-xs">
                Solo necesitas unos minutos. Completa los campos y tu comprador quedara registrado en el sistema.
              </div>
            </div>
          </q-card-section>
        </q-card>

        <CompradorForm />
      </div>
    </div>
  </q-page>
</template>

<script>
import CompradorForm from '../components/CompradorForm.vue';

export default {
  name: 'CompradorCreateView',
  components: {
    CompradorForm
  },
  setup(props, { root }) {
    var router = root.$router;

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
.header-banner {
  border-radius: 12px;
  border-left: 4px solid #afca0b;
  background: linear-gradient(135deg, #f8faf7 0%, #ffffff 100%);
}
</style>
