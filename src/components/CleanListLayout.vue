<template>
  <section
    class="clean-list"
    :class="{
      'clean-list--compact': compact,
      'clean-list--flat': flat,
    }"
    :aria-labelledby="titleId"
  >
    <q-card class="clean-list__card" :flat="flat">
      <header class="clean-list__header">
        <div class="clean-list__heading">
          <h1 :id="titleId" class="clean-list__title">
            {{ title }}
          </h1>
          <p v-if="hasDescription" class="clean-list__description">
            {{ description }}
          </p>
        </div>

        <div v-if="hasActions" class="clean-list__actions">
          <slot name="actions" />
        </div>
      </header>

      <div v-if="hasDefaultSlot" class="clean-list__body">
        <slot />
      </div>
    </q-card>
  </section>
</template>

<script>
let cleanListInstanceCounter = 0;

export default {
  name: "CleanListLayout",

  props: {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    compact: {
      type: Boolean,
      default: false,
    },
    flat: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    cleanListInstanceCounter += 1;
    return {
      titleId: "clean-list-title-" + cleanListInstanceCounter,
    };
  },

  computed: {
    hasDescription() {
      return Boolean(this.description && this.description.trim());
    },
    hasActions() {
      return Boolean(this.$slots.actions);
    },
    hasDefaultSlot() {
      return Boolean(this.$slots.default);
    },
  },
};
</script>

<style scoped>
.clean-list {
  width: 100%;
  max-width: 100%;
  color-scheme: light;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

.clean-list__card {
  width: 100%;
  border-radius: clamp(10px, 2vw, 14px);
  overflow: hidden;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background-color: var(--surface, #ffffff);
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 4px 16px rgba(15, 23, 42, 0.06);
}

.clean-list--flat .clean-list__card {
  box-shadow: none;
  border-color: var(--color-border, #e2e8f0);
}

.clean-list__header {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 12px;
  padding: clamp(14px, 3vw, 24px);
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 1) 0%,
    rgba(248, 250, 252, 0.96) 100%
  );
  border-bottom: 1px solid rgba(15, 23, 42, 0.06);
}

.clean-list__heading {
  min-width: 0;
  flex: 1 1 auto;
}

.clean-list__title {
  margin: 0;
  font-family: var(--font-family-heading, "Poppins", sans-serif);
  font-size: clamp(1.125rem, 1rem + 0.75vw, 1.5rem);
  font-weight: var(--weight-titulo, 600);
  line-height: var(--leading-tight, 1.25);
  letter-spacing: -0.02em;
  color: var(--color-text-primary, #111827);
  word-break: break-word;
  overflow-wrap: anywhere;
}

.clean-list__description {
  margin: clamp(4px, 1vw, 8px) 0 0;
  font-size: clamp(0.8125rem, 0.78rem + 0.25vw, 0.9375rem);
  font-weight: 400;
  line-height: var(--leading-relaxed, 1.625);
  color: var(--color-label, #6b7280);
  max-width: 72ch;
  word-break: break-word;
  overflow-wrap: anywhere;
}

.clean-list__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  width: 100%;
}

.clean-list__actions ::v-deep .q-btn {
  min-height: 40px;
}

.clean-list__body {
  padding: clamp(12px, 2.5vw, 24px);
  background-color: var(--surface, #ffffff);
}

.clean-list--compact .clean-list__header {
  padding: 12px 16px;
  gap: 10px;
}

.clean-list--compact .clean-list__body {
  padding: 12px 16px;
}

.clean-list--compact .clean-list__title {
  font-size: clamp(1rem, 0.95rem + 0.4vw, 1.25rem);
}

/* Tablet */
@media (min-width: 600px) {
  .clean-list__header {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  .clean-list__actions {
    width: auto;
    flex-shrink: 0;
    justify-content: flex-end;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .clean-list__header {
    gap: 24px;
  }

  .clean-list__actions {
    gap: 10px;
  }
}

/* Pantallas pequeñas (mobile) */
@media (max-width: 599px) {
  .clean-list__actions {
    flex-direction: column;
    align-items: stretch;
  }

  .clean-list__actions ::v-deep .q-btn {
    width: 100%;
    min-height: 44px;
  }
}

/* Safe area para dispositivos con notch */
@supports (padding: max(0px)) {
  .clean-list__header,
  .clean-list__body {
    padding-left: max(clamp(12px, 2.5vw, 24px), env(safe-area-inset-left));
    padding-right: max(clamp(12px, 2.5vw, 24px), env(safe-area-inset-right));
  }
}

/* Alto contraste (IPS/OLED con accesibilidad activada) */
@media (prefers-contrast: more) {
  .clean-list__card {
    border-color: var(--color-text-primary, #111827);
    box-shadow: none;
  }

  .clean-list__title {
    color: #0a0a0a;
  }

  .clean-list__description {
    color: var(--color-text-secondary, #374151);
  }
}

/* Reducir animaciones si el usuario lo prefiere */
@media (prefers-reduced-motion: reduce) {
  .clean-list__card,
  .clean-list__actions ::v-deep .q-btn {
    transition: none !important;
  }
}
</style>
