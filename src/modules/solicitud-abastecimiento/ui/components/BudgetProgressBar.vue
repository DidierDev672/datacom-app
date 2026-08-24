<template>
  <div class="budget-bar" :aria-label="`${safeValue}% ${label}. ${rangeLabel}.`">
    <!-- Top row: context label + percentage -->
    <div class="budget-bar__meta">
      <span class="budget-bar__range-label">{{ rangeLabel }}</span>
      <span
        class="budget-bar__pct"
        :style="{ color: percentageColor }"
      >
        {{ safeValue }}% {{ label }}
      </span>
    </div>

    <!-- Track -->
    <div
      class="budget-bar__track"
      role="progressbar"
      :aria-valuenow="safeValue"
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <div
        class="budget-bar__fill"
        :style="{
          width: safeValue + '%',
          background: rangeGradient
        }"
      ></div>
    </div>

    <!-- Bottom row: sub-labels -->
    <div v-if="showSubLabel" class="budget-bar__sub">
      <span class="budget-bar__sub-text">0%</span>
      <span class="budget-bar__sub-text">100%</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BudgetProgressBar',
  props: {
    value: {
      type: Number,
      required: true,
      validator: v => v >= 0 && v <= 100
    },
    label: {
      type: String,
      default: 'Consumido'
    },
    showSubLabel: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    safeValue() {
      return Math.min(100, Math.max(0, this.value))
    },
    rangeGradient() {
      const v = this.safeValue
      if (v <= 25) {
        return 'linear-gradient(90deg, #16A34A, #84CC16)'
      } else if (v <= 80) {
        return 'linear-gradient(90deg, #2563EB, #38BDF8)'
      } else {
        return 'linear-gradient(90deg, #F97316, #FBBF24)'
      }
    },
    rangeLabel() {
      const v = this.safeValue
      if (v <= 25) return 'Consumo bajo'
      if (v <= 80) return 'Consumo normal'
      return 'Consumo crítico'
    },
    percentageColor() {
      const v = this.safeValue
      if (v <= 25) return '#15803D'
      if (v <= 80) return '#1D4ED8'
      return '#C2410C'
    }
  }
}
</script>

<style scoped>
.budget-bar {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.budget-bar__meta {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.budget-bar__range-label {
  font-size: 12px;
  font-weight: 400;
  color: #9CA3AF;
}

.budget-bar__pct {
  font-size: 13px;
  font-weight: 600;
  transition: color 0.4s ease;
}

.budget-bar__track {
  width: 100%;
  height: 10px;
  background: #F3F4F6;
  border-radius: 20px;
  overflow: hidden;
  border: 0.5px solid #E5E7EB;
  position: relative;
}

.budget-bar__fill {
  height: 100%;
  border-radius: 20px;
  transition:
    width 0.6s cubic-bezier(0.4, 0, 0.2, 1),
    background 0.4s ease;
}

.budget-bar__sub {
  display: flex;
  justify-content: space-between;
}

.budget-bar__sub-text {
  font-size: 11px;
  color: #D1D5DB;
}
</style>
