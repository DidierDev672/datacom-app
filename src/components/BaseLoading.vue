<template>
  <div
    v-if="loading"
    class="b-loading"
    :class="[
      `b-loading--${mode}`,
      `b-loading--${mode}--${skeletonType}`,
      { 'b-loading--absolute': absolute },
    ]"
    role="status"
    :aria-label="message || 'Cargando...'"
    aria-live="polite"
  >
    <!-- Overlay: pantalla completa -->
    <template v-if="mode === 'overlay'">
      <div class="b-loading__backdrop" :style="{ opacity: opacity }"></div>
      <div class="b-loading__content">
        <slot name="spinner">
          <q-spinner :size="sizeMap" :color="color" />
        </slot>
        <p v-if="message" class="b-loading__message">{{ message }}</p>
        <slot />
      </div>
    </template>

    <!-- Inline: dentro de un contenedor con overlay -->
    <template v-else-if="mode === 'inline'">
      <div class="b-loading__backdrop" :style="{ opacity: opacity }"></div>
      <div class="b-loading__content">
        <slot name="spinner">
          <q-spinner :size="sizeMap" :color="color" />
        </slot>
        <p v-if="message" class="b-loading__message">{{ message }}</p>
        <slot />
      </div>
    </template>

    <!-- Skeleton: shimmer placeholder -->
    <template v-else-if="mode === 'skeleton'">
      <div
        v-if="skeletonType === 'text'"
        class="b-loading__skeleton-text"
        :class="{ 'b-loading__skeleton-text--no-round': noRound }"
      >
        <div
          v-for="n in skeletonLines"
          :key="n"
          class="b-loading__skeleton-line"
          :style="{ width: getLineWidth(n) }"
        ></div>
      </div>

      <div v-else-if="skeletonType === 'card'" class="b-loading__skeleton-card">
        <div class="b-loading__skeleton-card-image"></div>
        <div class="b-loading__skeleton-card-body">
          <div class="b-loading__skeleton-line b-loading__skeleton-line--title"></div>
          <div
            v-for="n in skeletonLines"
            :key="n"
            class="b-loading__skeleton-line"
          ></div>
        </div>
      </div>

      <div v-else-if="skeletonType === 'table-row'" class="b-loading__skeleton-table-row">
        <div
          v-for="n in skeletonLines"
          :key="n"
          class="b-loading__skeleton-line b-loading__skeleton-line--short"
        ></div>
      </div>

      <div v-else class="b-loading__content">
        <slot name="spinner">
          <q-spinner :size="sizeMap" :color="color" />
        </slot>
        <slot />
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: "BaseLoading",

  props: {
    loading: {
      type: Boolean,
      required: true,
    },
    mode: {
      type: String,
      default: "inline",
      validator: (v) => ["overlay", "inline", "skeleton"].includes(v),
    },
    message: {
      type: String,
      default: "",
    },
    size: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      default: "primary",
    },
    absolute: {
      type: Boolean,
      default: false,
    },
    minHeight: {
      type: String,
      default: "200px",
    },
    opacity: {
      type: Number,
      default: 0.75,
      validator: (v) => v >= 0 && v <= 1,
    },
    skeletonLines: {
      type: Number,
      default: 4,
    },
    skeletonType: {
      type: String,
      default: "text",
      validator: (v) => ["text", "card", "table-row", "custom"].includes(v),
    },
    noRound: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    sizeMap() {
      if (this.size) return this.size;
      const sizes = { overlay: "64px", inline: "36px", skeleton: "24px" };
      return sizes[this.mode] || "36px";
    },
  },

  methods: {
    getLineWidth(n) {
      const widths = ["100%", "92%", "85%", "78%", "70%", "60%", "50%"];
      return widths[(n - 1) % widths.length];
    },
  },
};
</script>

<style scoped>
/* ═══════════════════════════════════════════
   BaseLoading — Componente de carga reusable
   ═══════════════════════════════════════════ */

/* ─── Overlay ─── */
.b-loading--overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.b-loading--overlay .b-loading__backdrop {
  position: absolute;
  inset: 0;
  background: var(--background-color, #fafafa);
}

.b-loading--overlay .b-loading__content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 32px;
}

/* ─── Inline ─── */
.b-loading--inline {
  position: relative;
  width: 100%;
}

.b-loading--inline .b-loading__backdrop {
  position: absolute;
  inset: 0;
  background: var(--background-color, #fafafa);
  z-index: 1;
  border-radius: inherit;
}

.b-loading--inline .b-loading__content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 24px 16px;
  min-height: inherit;
}

/* Inline absoluto: cubre todo el padre */
.b-loading--inline.b-loading--absolute {
  position: absolute;
  inset: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.b-loading--inline.b-loading--absolute .b-loading__backdrop {
  border-radius: inherit;
}

.b-loading--inline.b-loading--absolute .b-loading__content {
  min-height: auto;
}

/* ─── Mensaje ─── */
.b-loading__message {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  text-align: center;
  line-height: 1.5;
  max-width: 280px;
}

/* ═══════════════════════════════════════════
   Skeleton / Shimmer
   ═══════════════════════════════════════════ */
.b-loading--skeleton {
  width: 100%;
}

/* ─── Text skeleton ─── */
.b-loading__skeleton-text {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 4px 0;
}

.b-loading__skeleton-line {
  height: 14px;
  border-radius: 8px;
  background: linear-gradient(
    90deg,
    #e5e7eb 25%,
    #f3f4f6 50%,
    #e5e7eb 75%
  );
  background-size: 200% 100%;
  animation: b-loading-shimmer 1.6s ease-in-out infinite;
}

.b-loading__skeleton-text--no-round .b-loading__skeleton-line {
  border-radius: 0;
}

.b-loading__skeleton-line--title {
  height: 20px;
  width: 60%;
  margin-bottom: 4px;
}

.b-loading__skeleton-line--short {
  width: 40%;
}

/* ─── Card skeleton ─── */
.b-loading__skeleton-card {
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  background: #fff;
}

.b-loading__skeleton-card-image {
  height: 140px;
  background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
  background-size: 200% 100%;
  animation: b-loading-shimmer 1.6s ease-in-out infinite;
}

.b-loading__skeleton-card-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
}

.b-loading__skeleton-card-body .b-loading__skeleton-line {
  width: 100%;
}

/* ─── Table-row skeleton ─── */
.b-loading__skeleton-table-row {
  display: flex;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
}

.b-loading__skeleton-table-row .b-loading__skeleton-line {
  flex: 1;
}

/* ─── Shimmer animation ─── */
@keyframes b-loading-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ─── Reduced motion ─── */
@media (prefers-reduced-motion: reduce) {
  .b-loading__skeleton-line,
  .b-loading__skeleton-card-image {
    animation: none;
    background: #e5e7eb;
  }
}

/* ─── Responsive ─── */
@media (max-width: 599px) {
  .b-loading--overlay .b-loading__content {
    padding: 24px 16px;
  }

  .b-loading__message {
    font-size: 13px;
  }

  .b-loading--inline .b-loading__content {
    min-height: 120px;
    padding: 16px 12px;
  }
}
</style>
