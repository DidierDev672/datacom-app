<template>
  <div
    class="app-input"
    :class="{
      'app-input--focused': isFocused,
      'app-input--filled': isFilled,
      'app-input--error': hasError,
    }"
  >
    <div class="app-input__field">
      <input
        :id="inputId"
        class="app-input__control"
        :type="type"
        :value="formattedValue"
        :placeholder="isLabelFloated ? placeholder : ''"
        :aria-invalid="hasError ? 'true' : 'false'"
        :aria-describedby="hasError ? `${inputId}-error` : null"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
      />
      <label :for="inputId" class="app-input__label">{{ label }}</label>
    </div>

    <p
      v-if="hasError"
      :id="`${inputId}-error`"
      class="app-input__error"
      role="alert"
    >
      {{ error }}
    </p>
  </div>
</template>

<script>
let inputCounter = 0;

export default {
  name: "AppInput",

  props: {
    value: {
      type: [String, Number],
      default: "",
    },
    label: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "text",
    },
    id: {
      type: String,
      default: "",
    },
    error: {
      type: String,
      default: "",
    },
  },

  data() {
    inputCounter += 1;
    return {
      isFocused: false,
      generatedId: `app-input-${inputCounter}`,
    };
  },

  computed: {
    inputId() {
      return this.id || this.generatedId;
    },

    formattedValue() {
      if (this.value === null || this.value === undefined) {
        return "";
      }
      return this.value;
    },

    isFilled() {
      return String(this.formattedValue).length > 0;
    },

    isLabelFloated() {
      return this.isFocused || this.isFilled;
    },

    hasError() {
      return Boolean(this.error);
    },
  },

  methods: {
    onInput(event) {
      this.$emit("input", event.target.value);
    },

    onFocus() {
      this.isFocused = true;
    },

    onBlur() {
      this.isFocused = false;
    },
  },
};
</script>

<style scoped>
.app-input {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  width: 100%;
}

.app-input__field {
  position: relative;
  width: 100%;
}

.app-input__control {
  width: 100%;
  min-height: var(--input-height, 2.75rem);
  padding: 1.25rem 0.875rem 0.5rem;
  border: 1px solid var(--color-border, #d1d5db);
  border-radius: var(--input-border-radius, 0.5rem);
  background-color: var(--color-bg, #ffffff);
  color: var(--color-text-primary, #111827);
  font-family: var(--font-family-sans, "Inter Tight", sans-serif);
  font-size: var(--text-input, 0.9375rem);
  font-weight: var(--weight-input, 400);
  line-height: 1.4;
  outline: none;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease;
}

.app-input__control::placeholder {
  color: var(--color-placeholder, #9ca3af);
}

.app-input__control:hover {
  border-color: #9ca3af;
  box-shadow: 0 1px 4px rgba(17, 24, 39, 0.06);
}

.app-input__label {
  position: absolute;
  left: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-label, #6b7280);
  font-size: var(--text-input, 0.9375rem);
  font-weight: var(--weight-label, 500);
  line-height: 1;
  pointer-events: none;
  transform-origin: left center;
  transition:
    top 0.2s ease,
    transform 0.2s ease,
    font-size 0.2s ease,
    color 0.2s ease;
}

.app-input--focused .app-input__control,
.app-input--filled .app-input__control {
  border-color: #4e9c4c;
  box-shadow: 0 0 0 3px rgba(78, 156, 76, 0.12);
}

.app-input--focused .app-input__label,
.app-input--filled .app-input__label {
  top: 0.55rem;
  transform: translateY(0) scale(0.82);
  color: #4e9c4c;
}

.app-input--error .app-input__control {
  border-color: #dc2626;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}

.app-input--error .app-input__label,
.app-input--error.app-input--focused .app-input__label,
.app-input--error.app-input--filled .app-input__label {
  color: #dc2626;
}

.app-input__error {
  margin: 0;
  padding-left: 0.25rem;
  color: #dc2626;
  font-size: var(--text-xs, 0.75rem);
  line-height: 1.4;
}

@media (max-width: 480px) {
  .app-input__control {
    min-height: 2.5rem;
    padding-top: 1.125rem;
    font-size: 0.875rem;
  }

  .app-input__label {
    font-size: 0.875rem;
  }
}
</style>
