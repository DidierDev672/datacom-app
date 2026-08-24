<template>
  <div class="search-container relative-position">
    <q-input
      v-model="internalValue"
      :placeholder="placeholder"
      outlined
      flat
      dense
      class="search-input-modern"
      @input="handleInput"
    >
      <template v-slot:prepend>
        <q-icon name="search" class="search-icon" size="20px" />
      </template>
      <template v-slot:append>
        <q-icon 
          v-if="internalValue" 
          name="close" 
          class="cursor-pointer clear-icon" 
          size="18px"
          @click="clearSearch" 
        />
      </template>
    </q-input>
  </div>
</template>

<script>
export default {
  name: 'SearchInputComponent',
  props: {
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: 'Buscar...'
    },
    debounceTime: {
      type: Number,
      default: 300
    }
  },
  data() {
    return {
      internalValue: this.value,
      debounceTimer: null
    };
  },
  watch: {
    value(newVal) {
      if (newVal !== this.internalValue) {
        this.internalValue = newVal;
      }
    }
  },
  methods: {
    handleInput(val) {
      if (this.debounceTimer) clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.$emit('input', val);
      }, this.debounceTime);
    },
    clearSearch() {
      this.internalValue = '';
      this.$emit('input', '');
    }
  }
}
</script>

<style scoped>
.search-container {
  width: 100%;
}

/* Base styles matching the design system rules previously defined */
::v-deep .search-input-modern .q-field__control {
  height: 44px !important;
  border-radius: 8px !important;
  background: #FFFFFF !important;
  transition: all 0.2s ease;
  border: 1px solid #D1D5DB !important;
}

::v-deep .search-input-modern .q-field__control:hover {
  border-color: #9CA3AF !important;
}

::v-deep .search-input-modern.q-field--focused .q-field__control {
  border-color: #2563EB !important;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1) !important;
}

::v-deep .search-input-modern .q-field__native {
  font-size: 15px !important;
  font-weight: 400 !important;
  color: #111827 !important;
  padding: 0 8px !important;
}

::v-deep .search-input-modern .q-placeholder {
  color: #9CA3AF !important;
  font-size: 14px !important;
}

.search-icon {
  color: #9CA3AF;
  margin-left: 4px;
}

.clear-icon {
  color: #9CA3AF;
  transition: color 0.2s ease;
}

.clear-icon:hover {
  color: #374151;
}

::v-deep .search-input-modern .q-field__control:before,
::v-deep .search-input-modern .q-field__control:after {
  display: none !important;
}
</style>
