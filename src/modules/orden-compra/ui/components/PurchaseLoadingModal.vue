<template>
  <transition name="purchase-loading-fade">
    <div
      v-if="isVisible"
      class="purchase-loading-overlay"
      role="alertdialog"
      aria-modal="true"
      aria-live="assertive"
    >
      <div class="purchase-loading-card">
        <!-- Estado: cargando -->
        <template v-if="isLoading">
          <div class="purchase-loading-spinner" aria-hidden="true"></div>
          <p class="purchase-loading__title">Registrando compra…</p>
          <p class="purchase-loading__hint">
            Estamos procesando tu solicitud, espera un momento.
          </p>
        </template>

        <!-- Estado: éxito (200 OK o 201 Created) -->
        <template v-else-if="isSuccess">
          <div
            class="purchase-loading__icon purchase-loading__icon--success"
            aria-hidden="true"
          >
            <q-icon name="check_circle" size="46px" />
          </div>
          <p class="purchase-loading__title">¡Compra registrada!</p>
          <p class="purchase-loading__hint">
            La compra se creó correctamente en el sistema.
          </p>
          <q-btn
            unelevated
            no-caps
            color="primary"
            label="Aceptar"
            class="purchase-loading__action"
            @click="$emit('close')"
          />
        </template>

        <!-- Estado: error -->
        <template v-else>
          <div
            class="purchase-loading__icon purchase-loading__icon--error"
            aria-hidden="true"
          >
            <q-icon name="error" size="46px" />
          </div>
          <p class="purchase-loading__title">
            No se pudo registrar la compra
          </p>
          <p class="purchase-loading__hint">
            {{ errorMessage || "Se presentó un error al intentar registrar la compra. Inténtalo de nuevo." }}
          </p>
          <q-btn
            unelevated
            no-caps
            color="negative"
            label="Aceptar"
            class="purchase-loading__action"
            @click="$emit('close')"
          />
        </template>
      </div>
    </div>
  </transition>
</template>

<script>
/**
 * Modal de carga para el registro de compras.
 *
 * NOTA sobre <script setup>: este proyecto usa Vue 2.6 con webpack
 * (@quasar/app v2), que NO soporta la compilación de <script setup>.
 * Por eso se aplica Composition API vía @vue/composition-api
 * (defineComponent implícito + setup()), el patrón oficial del repo.
 */
import { computed } from "@vue/composition-api";

export default {
  name: "PurchaseLoadingModal",

  props: {
    /** Controla el spinner: true mientras la petición está en curso. */
    isLoading: {
      type: Boolean,
      default: false,
    },
    /** true cuando el backend respondió 200 OK o 201 Created. */
    isSuccess: {
      type: Boolean,
      default: false,
    },
    /** Mensaje devuelto cuando la respuesta no fue exitosa. */
    errorMessage: {
      type: String,
      default: "",
    },
  },

  setup(props) {
    const isVisible = computed(
      () => props.isLoading || props.isSuccess || Boolean(props.errorMessage)
    );

    return { isVisible };
  },
};
</script>

<style scoped>
/* Máscara oscura semi-transparente a pantalla completa */
.purchase-loading-overlay {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9900;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
}

.purchase-loading-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: min(92vw, 400px);
  padding: 30px 28px 26px;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 24px 64px rgba(2, 6, 23, 0.35);
  text-align: center;
}

/* Spinner moderno: anillo cónico giratorio */
.purchase-loading-spinner {
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
  animation: purchase-loading-spin 0.85s linear infinite;
}

@keyframes purchase-loading-spin {
  to {
    transform: rotate(360deg);
  }
}

.purchase-loading__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  border-radius: 50%;
}

.purchase-loading__icon--success {
  background: rgba(22, 163, 74, 0.12);
  color: #16a34a;
}

.purchase-loading__icon--error {
  background: rgba(220, 38, 38, 0.1);
  color: #dc2626;
}

.purchase-loading__title {
  margin: 4px 0 0;
  font-size: 1.08rem;
  font-weight: 800;
  color: #0f172a;
}

.purchase-loading__hint {
  margin: 0;
  font-size: 0.86rem;
  line-height: 1.5;
  color: #64748b;
  word-break: break-word;
}

.purchase-loading__action {
  margin-top: 8px;
  min-width: 120px;
}

.purchase-loading-fade-enter-active,
.purchase-loading-fade-leave-active {
  transition: opacity 0.18s ease;
}

.purchase-loading-fade-enter,
.purchase-loading-fade-leave-to {
  opacity: 0;
}
</style>
