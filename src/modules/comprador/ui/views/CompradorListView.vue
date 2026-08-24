<template>
  <q-page class="q-pa-lg bg-grey-1">
    <div class="row items-center q-mb-lg">
      <q-btn flat round icon="arrow_back" color="grey-7" @click="onBack" />
      <h1 class="text-h4 text-weight-bold q-my-none text-primary q-ml-sm">
        Lista de Compradores
      </h1>
    </div>

    <!-- Estado de error 400 -->
    <div v-if="hasError" class="row justify-center">
      <div class="col-12 col-md-8 col-lg-6">
        <q-card flat bordered class="error-card">
          <q-card-section class="column items-center q-pa-xl">
            <div class="error-code">{{ errorStatus }}</div>
            <q-icon name="error_outline" size="56px" color="orange-6" class="q-mb-md" />
            <div class="text-h6 text-weight-bold text-grey-8 text-center">
              Oops, algo salio mal
            </div>
            <div class="text-body2 text-grey-6 text-center q-mt-sm" style="max-width: 320px;">
              {{ errorMessage }}
            </div>
            <div class="row q-gutter-sm q-mt-lg">
              <q-btn
                unelevated
                color="primary"
                label="Reintentar"
                icon="refresh"
                @click="retryLoad"
              />
              <q-btn
                flat
                color="grey-7"
                label="Volver"
                icon="arrow_back"
                @click="onBack"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Contenido principal -->
    <div v-else class="row justify-center">
      <div class="col-12 col-xl-10">
        <q-card flat bordered class="content-card q-mb-lg">
          <q-card-section class="q-pa-lg">
            <CompradorListTable
              :compradores="compradores"
              :is-loading="isLoading"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref, onMounted } from '@vue/composition-api';
import { useCompradorListStore } from '../store/compradorList.store';
import CompradorListTable from '../components/CompradorListTable.vue';

export default {
  name: 'CompradorListView',
  components: {
    CompradorListTable
  },
  setup: function (props, context) {
    var root = context.root;
    var router = root.$router;

    var compradorListStore = useCompradorListStore();
    var compradores = ref([]);
    var isLoading = ref(false);
    var hasError = ref(false);
    var errorStatus = ref(0);
    var errorMessage = ref('');

    function onBack() {
      router.back();
    }

    async function loadCompradores() {
      isLoading.value = true;
      hasError.value = false;
      errorStatus.value = 0;
      errorMessage.value = '';

      try {
        await compradorListStore.cargarCompradores();
        compradores.value = compradorListStore.compradores;
      } catch (err) {
        hasError.value = true;
        var storeError = compradorListStore.error;
        if (storeError) {
          errorStatus.value = storeError.status;
          errorMessage.value = storeError.message;
        } else {
          errorStatus.value = 0;
          errorMessage.value = 'No se pudieron cargar los compradores. Verifica tu conexion e intenta de nuevo.';
        }
      } finally {
        isLoading.value = false;
      }
    }

    function retryLoad() {
      loadCompradores();
    }

    onMounted(function () {
      loadCompradores();
    });

    return {
      compradores: compradores,
      isLoading: isLoading,
      hasError: hasError,
      errorStatus: errorStatus,
      errorMessage: errorMessage,
      onBack: onBack,
      retryLoad: retryLoad
    };
  }
};
</script>

<style scoped>
.error-card {
  border-radius: 16px;
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  animation: fadeInUp 0.5s ease-out;
}

.error-code {
  font-size: 72px;
  font-weight: 800;
  color: #e2e8f0;
  line-height: 1;
  margin-bottom: 8px;
  letter-spacing: -2px;
}

.content-card {
  border-radius: 12px;
  background: white;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(16px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
