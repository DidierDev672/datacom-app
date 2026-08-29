<template>
  <!--
    LoadingOverlay — Pantalla de carga a pantalla completa.

    UX rationale:
      - Fondo semitransparente que no bloquea por completo la lectura, pero
        sí indica que algo está ocurriendo (evita sensación de pantalla "rota").
      - Icono animado al centro: un giro suave comunica progreso sin estridencia.
      - <transition> + clases fade para que aparezca y desaparezca de forma
        suave, sin cortes bruscos que generen parpadeo visual.

    Clases de la transición (Vue 2):
      - fade-enter        : estado inicial de la entrada (opacity 0).
      - fade-enter-active : duración/curva de la entrada.
      - fade-leave-active : duración/curva de la salida.
      - fade-leave-to     : estado final de la salida (opacity 0).
  -->
  <transition name="fade">
    <div v-if="isLoading" class="lo-overlay" role="status" aria-live="polite"
      :aria-label="message || 'Cargando'">
      <div class="lo-backdrop" :style="{ opacity: backdropOpacity }"></div>
      <div class="lo-content">
        <div class="lo-spinner" :style="{ borderTopColor: color, borderRightColor: color }"></div>
        <p v-if="message" class="lo-message" :style="{ color: color }">{{ message }}</p>
        <slot />
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "LoadingOverlay",

  props: {
    // Controla la visibilidad del loading.
    isLoading: {
      type: Boolean,
      default: false,
    },
    // Mensaje opcional que se muestra bajo el icono animado.
    message: {
      type: String,
      default: "Cargando información…",
    },
    // Color del spinner y del texto (usa esquema cromático del proyecto).
    color: {
      type: String,
      default: "#1B9E5C",
    },
    // Opacidad del fondo semitransparente (0 = transparente, 1 = sólido).
    backdropOpacity: {
      type: Number,
      default: 0.55,
      validator: function (v) {
        return v >= 0 && v <= 1;
      },
    },
  },
};
</script>

<style scoped>
/* Overlay en posición fija para cubrir toda la pantalla */
.lo-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
}

/* Fondo semitransparente */
.lo-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #ffffff;
}

.lo-content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  max-width: 320px;
  text-align: center;
  padding: 24px;
}

/* Icono animado (anillo giratorio) al centro */
.lo-spinner {
  width: 56px;
  height: 56px;
  border: 4px solid rgba(27, 158, 92, 0.2);
  border-top-color: #1b9e5c;
  border-right-color: #1b9e5c;
  border-radius: 50%;
  animation: lo-spin 0.9s linear infinite;
  box-shadow: 0 6px 18px rgba(11, 110, 79, 0.15);
}

.lo-message {
  margin: 0;
  font-size: 15px;
  font-weight: 500;
  line-height: 1.5;
}

@keyframes lo-spin {
  to {
    transform: rotate(360deg);
  }
}

/* ────────────────────────────────────────
   Transición "fade" (Vue 2)
   1. fade-enter        : estado inicial de entrada (invisible).
   2. fade-enter-active : curva y duración de la entrada.
   3. fade-leave-active : curva y duración de la salida.
   4. fade-leave-to     : estado final de salida (invisible).
──────────────────────────────────────── */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.35s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

/* Movimiento sutil: el contenido sube levemente al entrar */
.fade-enter-active .lo-content {
  transition: transform 0.35s ease, opacity 0.35s ease;
}

.fade-enter .lo-content {
  transform: translateY(12px);
  opacity: 0;
}

.fade-leave-to .lo-content {
  transform: translateY(12px);
  opacity: 0;
}

/* Accesibilidad: si el usuario prefiere menos movimiento */
@media (prefers-reduced-motion: reduce) {
  .lo-spinner {
    animation-duration: 1.8s;
  }
}
</style>
