<template>
  <main>
    <h1>Solicitar plan de abastecimiento</h1>
    <p>Complete todos los campos requeridos.</p>

    <div v-if="error" class="error">{{ error }}</div>

    <form @submit.prevent="submit">
      <DatosSolicitud />
      <DatosFinancieros />
      <DatosEntrega />

      <footer>
        <button :disabled="loading">
          {{ loading ? '...' : 'Crear orden →' }}
        </button>
      </footer>
    </form>
  </main>
</template>

<script>
import DatosSolicitud from '../components/DatosSolicitud.vue';
import DatosFinancieros from '../components/DatosFinancieros.vue';
import DatosEntrega from '../components/DatosEntrega.vue';

import { useSolicitudStore } from '../store/useSolicitudStore';

export default {
  name: 'SolicitudAbastecimientoView',
  components: {
    DatosSolicitud,
    DatosFinancieros,
    DatosEntrega
  },
  computed: {
    store() {
      return useSolicitudStore();
    },
    loading() {
      return this.store.loading;
    },
    error() {
      return this.store.error;
    }
  },
  methods: {
    async submit() {
      await this.store.submit();
    }
  }
}
</script>

<style scoped>
main {
  max-width: 900px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
}

h1 {
  font-size: 1.75rem;
  font-weight: 600;
  margin: 0 0 0.25rem;
  color: #1a1a1a;
}

p {
  color: #666;
  margin: 0 0 2rem;
}

.error {
  background: #ffebee;
  color: #c62828;
  padding: 0.875rem 1rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  font-size: 0.9375rem;
}

form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

footer {
  padding-top: 1rem;
}

button {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #84B24D, #75AF7E, #4E9C4C);
  color: #ffffff;
  border: 2px solid #4E9C4C;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

button:hover:not(:disabled) {
  background: linear-gradient(135deg, #75AF7E, #4E9C4C, #3e813c);
  border-color: #3e813c;
}

button:disabled {
  opacity: 0.5;
}
</style>
