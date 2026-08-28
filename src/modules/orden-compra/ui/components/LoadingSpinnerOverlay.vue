<template>
  <div
    v-if="isLoading"
    class="loading-spinner-overlay"
    role="status"
    aria-live="polite"
    aria-busy="true"
  >
    <div class="loading-spinner-overlay__panel">
      <div class="loading-spinner-overlay__spinner" aria-hidden="true"></div>
      <p v-if="normalizedLabel" class="loading-spinner-overlay__label">
        {{ normalizedLabel }}
      </p>
    </div>
  </div>
</template>

<script>
/**
 * Overlay de carga con fondo semitransparente.
 *
 * Props:
 * - isLoading (Boolean): muestra u oculta el overlay.
 * - label (String): texto opcional debajo del spinner.
 *
 * Uso:
 * <LoadingSpinnerOverlay :is-loading="pageLoading" label="Cargando…" />
 *
 * NOTA: este proyecto usa Vue 2 (@quasar/app v2); no se usa <script setup>.
 */
import { computed } from "@vue/composition-api";

export default {
  name: "LoadingSpinnerOverlay",

  model: {
    prop: "isLoading",
    event: "change",
  },

  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: "",
    },
  },

  setup: function (props) {
    var normalizedLabel = computed(function () {
      return typeof props.label === "string" ? props.label.trim() : "";
    });

    return { normalizedLabel: normalizedLabel };
  },
};
</script>

<style scoped>
/* Fondo semitransparente que cubre la pantalla */
.loading-spinner-overlay {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9900;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
  opacity: 0;
  animation: loading-overlay-fade-in 0.35s ease-out forwards;
}

.loading-spinner-overlay__panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 28px 32px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
  opacity: 0;
  animation: loading-panel-fade-in 0.45s ease-out 0.08s forwards;
}

/* Spinner fluido (anillo cromático verde) */
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

.loading-spinner-overlay__label {
  margin: 0;
  font-size: 0.92rem;
  font-weight: 700;
  color: #f8fafc;
  text-align: center;
  max-width: min(90vw, 420px);
  word-break: break-word;
}

/* Aparición con opacity + @keyframes */
@keyframes loading-overlay-fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes loading-panel-fade-in {
  from {
    opacity: 0;
    transform: translateY(6px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes loading-spinner-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
