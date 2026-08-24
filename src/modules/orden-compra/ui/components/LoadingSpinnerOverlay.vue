<template>
  <transition name="loading-overlay-fade">
    <div
      v-if="isLoading"
      class="loading-spinner-overlay"
      role="status"
      aria-live="polite"
      :aria-busy="isLoading ? 'true' : 'false'"
    >
      <div class="loading-spinner-overlay__spinner" aria-hidden="true"></div>
      <p v-if="normalizedLabel" class="loading-spinner-overlay__label">
        {{ normalizedLabel }}
      </p>
    </div>
  </transition>
</template>

<script>
/**
 * Overlay de carga a pantalla completa con spinner animado en el centro.
 *
 * Soporta v-model: <LoadingSpinnerOverlay v-model="isLoading" />
 * (Vue 2 => opción `model` con la prop personalizada `isLoading`).
 *
 * NOTA sobre <script setup>: este proyecto usa Vue 2 con webpack
 * (@quasar/app v2), que NO soporta la compilación de <script setup>.
 * Por eso se aplica Composition API vía @vue/composition-api con
 * setup(), el patrón equivalente usado en todo el repositorio.
 */
import { computed } from "@vue/composition-api";

export default {
  name: "LoadingSpinnerOverlay",

  /** Permite usar v-model directamente sobre la prop `isLoading`. */
  model: {
    prop: "isLoading",
    event: "change",
  },

  props: {
    /** Controla la visibilidad del overlay de forma condicional. */
    isLoading: {
      type: Boolean,
      default: false,
    },
    /** Texto opcional que se muestra debajo del spinner. */
    label: {
      type: String,
      default: "",
    },
  },

  setup(props) {
    const normalizedLabel = computed(() =>
      typeof props.label === "string" ? props.label.trim() : ""
    );

    return { normalizedLabel };
  },
};
</script>

<style scoped>
/* Fondo semitransparente cubriendo toda la pantalla */
.loading-spinner-overlay {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9900;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
}

/* Spinner animado centrado (anillo cónico giratorio) */
.loading-spinner-overlay__spinner {
  width: 62px;
  height: 62px;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    rgba(78, 156, 76, 0) 0%,
    rgba(117, 175, 126, 0.55) 55%,
    #4e9c4c 100%
  );
  -webkit-mask: radial-gradient(
    farthest-side,
    transparent calc(100% - 7px),
    #000 calc(100% - 6px)
  );
  mask: radial-gradient(
    farthest-side,
    transparent calc(100% - 7px),
    #000 calc(100% - 6px)
  );
  animation: loading-spinner-spin 0.85s linear infinite;
}

@keyframes loading-spinner-spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-spinner-overlay__label {
  margin: 0;
  font-size: 0.92rem;
  font-weight: 700;
  color: #f8fafc;
  text-align: center;
  max-width: min(90vw, 420px);
  word-break: break-word;
}

.loading-overlay-fade-enter-active,
.loading-overlay-fade-leave-active {
  transition: opacity 0.18s ease;
}

.loading-overlay-fade-enter,
.loading-overlay-fade-leave-to {
  opacity: 0;
}
</style>
