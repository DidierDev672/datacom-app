<template>
  <div :class="[
    'stat-card',
    `stat-card--${accentColor}`,
    {
      'stat-card--highlight': highlight,
      'stat-card--clickable': clickable,
      'stat-card--compact': compact,
    },
  ]" @click="handleClick">
    <div class="stat-card__icon-wrap">
      <q-icon :name="icon" class="stat-card__icon" />
    </div>
    <div class="stat-card__content">
      <span class="stat-card__label">{{ label }}</span>
      <span class="stat-card__value">{{ formattedValue }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "StatCard",

  props: {
    icon: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    value: {
      type: [String, Number],
      default: 0,
    },
    accentColor: {
      type: String,
      default: "blue",
      validator: (v) => ["blue", "green", "amber", "red", "purple"].includes(v),
    },
    highlight: {
      type: Boolean,
      default: false,
    },
    compact: {
      type: Boolean,
      default: false,
    },
    clickable: {
      type: Boolean,
      default: false,
    },
    format: {
      type: String,
      default: "raw",
      validator: (v) => ["raw", "currency", "number"].includes(v),
    },
  },

  computed: {
    formattedValue() {
      if (this.format === "currency") {
        return this.formatCurrency(this.value);
      }
      if (this.format === "number") {
        return this.formatNumber(this.value);
      }
      return this.value;
    },
  },

  methods: {
    formatCurrency(value) {
      if (value === null || value === undefined || value === "") return "—";
      return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
      }).format(Number(value));
    },
    formatNumber(value) {
      if (value === null || value === undefined || value === "") return "—";
      return new Intl.NumberFormat("es-CO").format(Number(value));
    },
    handleClick() {
      if (this.clickable) {
        this.$emit("click");
      }
    },
  },
};
</script>

<style scoped>
.stat-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  border-radius: 10px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-top: 3px solid transparent;
  transition: box-shadow 200ms ease, border-color 200ms ease, transform 200ms ease;
  user-select: none;
}

.stat-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transform: translateY(-1px);
}

/* --- Accent colors (top border + icon tint) --- */

.stat-card--blue .stat-card__icon-wrap {
  background: #eff6ff;
  color: #3b82f6;
}


.stat-card--green .stat-card__icon-wrap {
  background: #f0fdf4;
  color: #22c55e;
}


.stat-card--amber .stat-card__icon-wrap {
  background: #fffbeb;
  color: #f59e0b;
}

.stat-card--red {
  border-top-color: #f87171;
}

.stat-card--red .stat-card__icon-wrap {
  background: #fef2f2;
  color: #ef4444;
}

.stat-card--purple {
  border-top-color: #a78bfa;
}

.stat-card--purple .stat-card__icon-wrap {
  background: #f5f3ff;
  color: #8b5cf6;
}

/* --- Highlight variant (Presupuesto total) --- */

.stat-card--highlight {
  background: #fff;
  border-color: #e2e8f0;
  border-top-width: 3px;
}

.stat-card--highlight .stat-card__value {
  font-size: 1.45rem;
  color: #0f172a;
}


.stat-card--highlight.stat-card--amber .stat-card__value {
  color: #b45309;
}

/* --- Clickable variant --- */

.stat-card--clickable {
  cursor: pointer;
}

.stat-card--clickable:hover {
  background: #f1f5f9;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* --- Compact variant (modals, inline summaries) --- */

.stat-card--compact {
  padding: 10px 12px;
  gap: 10px;
  flex-direction: column;
  text-align: center;
  border-top-width: 2px;
}

.stat-card--compact .stat-card__icon-wrap {
  width: 30px;
  height: 30px;
  min-width: 30px;
  border-radius: 8px;
}

.stat-card--compact .stat-card__icon {
  font-size: 16px;
}

.stat-card--compact .stat-card__label {
  font-size: 0.62rem;
}

.stat-card--compact .stat-card__value {
  font-size: 0.85rem;
  font-weight: 700;
}

.stat-card--compact.stat-card--highlight .stat-card__value {
  font-size: 0.95rem;
}

/* --- Inner elements --- */

.stat-card__icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  min-width: 40px;
  border-radius: 10px;
  flex-shrink: 0;
}

.stat-card__icon {
  font-size: 20px;
}

.stat-card__content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.stat-card__label {
  font-size: 0.72rem;
  font-weight: 500;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  line-height: 1.2;
}

.stat-card__value {
  font-size: 1.2rem;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.3;
}

/* --- Responsive --- */

@media (max-width: 639px) {
  .stat-card {
    padding: 12px 14px;
    gap: 10px;
  }

  .stat-card__icon-wrap {
    width: 34px;
    height: 34px;
    min-width: 34px;
  }

  .stat-card__icon {
    font-size: 17px;
  }

  .stat-card__value {
    font-size: 1.05rem;
  }

  .stat-card--highlight .stat-card__value {
    font-size: 1.2rem;
  }
}
</style>
