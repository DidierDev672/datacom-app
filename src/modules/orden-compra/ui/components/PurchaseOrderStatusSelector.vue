<template>
  <div class="status-section">
    <label class="status-field-label">Estado de la orden de compra</label>
    <q-select
      :value="value"
      :options="orderStatusOptions"
      option-value="value"
      option-label="label"
      emit-value
      map-options
      outlined
      dense
      bg-color="white"
      class="status-dropdown"
      placeholder="Seleccione un estado"
      @input="onInput"
    >
      <template v-slot:prepend>
        <q-icon name="flag" color="grey-6" />
      </template>
    </q-select>

    <transition name="status-badge-fade" mode="out-in">
      <div
        v-if="value"
        :key="value"
        class="status-badge status-badge--hover"
        :style="activeStatusStyle"
      >
        <span
          class="status-badge__dot"
          :style="{ backgroundColor: activeStatusTheme.badge }"
        />
        <span class="status-badge__label">{{ activeStatusLabel }}</span>
      </div>
    </transition>
  </div>
</template>

<script>
import {
  ORDER_STATUS_THEMES,
  ORDER_STATUS_OPTIONS,
} from "../utils/purchaseOrderConstants";

export default {
  name: "PurchaseOrderStatusSelector",

  props: {
    value: {
      type: String,
      default: null,
    },
  },

  data() {
    return {
      orderStatusOptions: ORDER_STATUS_OPTIONS,
    };
  },

  computed: {
    activeStatusTheme() {
      return ORDER_STATUS_THEMES[this.value] || ORDER_STATUS_THEMES.borrador;
    },
    activeStatusLabel() {
      return this.activeStatusTheme.label;
    },
    activeStatusStyle() {
      const theme = this.activeStatusTheme;
      return {
        backgroundColor: theme.background,
        borderColor: theme.border,
        color: theme.text,
      };
    },
  },

  methods: {
    onInput(nextValue) {
      this.$emit("input", nextValue);
      this.$emit("change", {
        value: nextValue,
        label: ORDER_STATUS_THEMES[nextValue]
          ? ORDER_STATUS_THEMES[nextValue].label
          : "",
      });
    },
  },
};
</script>

<style scoped>
.status-section {
  width: 100%;
  max-width: none;
  margin-top: 1.25rem;
}

.status-field-label {
  display: block;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #475569;
  margin-bottom: 8px;
}

.status-dropdown {
  border-radius: 8px;
}

.status-dropdown ::v-deep .q-field__control {
  border-radius: 8px;
  min-height: 40px;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  height: 40px;
  min-height: 40px;
  padding: 0 16px;
  margin-top: 12px;
  border-radius: 8px;
  border: 1px solid;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1;
}

.status-badge__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-badge__label {
  letter-spacing: 0.01em;
}

.status-badge--hover {
  opacity: 0.92;
  transform: translateY(0);
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
  transition: opacity 0.55s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.55s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.55s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: opacity, transform, box-shadow;
}

.status-badge--hover:hover {
  opacity: 1;
  transform: translateY(-4px);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.12);
}

.status-badge-fade-enter-active,
.status-badge-fade-leave-active {
  transition: opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

.status-badge-fade-enter,
.status-badge-fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

@media (prefers-reduced-motion: reduce) {
  .status-badge--hover,
  .status-badge--hover:hover {
    transition: none;
    transform: none;
  }

  .status-badge-fade-enter-active,
  .status-badge-fade-leave-active {
    transition: none;
  }
}
</style>
