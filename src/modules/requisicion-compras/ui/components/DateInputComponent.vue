<template>
  <div class="date-container width-100">
    <q-input
      v-model="formattedDate"
      :label="label"
      outlined
      flat
      dense
      readonly
      class="date-input-modern cursor-pointer"
      @click="$refs.qDateProxy.show()"
    >
      <template v-slot:prepend>
        <q-icon name="event" class="date-icon" size="20px" />
      </template>
      
      <template v-slot:append>
        <q-icon 
          v-if="value" 
          name="close" 
          class="cursor-pointer clear-icon" 
          size="18px"
          @click.stop="clearDate" 
        />
        <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
          <q-date 
            v-model="internalDate" 
            mask="YYYY-MM-DD"
            @input="handleDateChange"
            color="primary"
          />
        </q-popup-proxy>
      </template>
    </q-input>
  </div>
</template>

<script>
export default {
  name: 'DateInputComponent',
  props: {
    value: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: 'Fecha'
    }
  },
  data() {
    return {
      internalDate: this.value
    };
  },
  computed: {
    formattedDate() {
      if (!this.value) return '';
      // Format YYYY-MM-DD to DD/MM/YYYY for display
      const [year, month, day] = this.value.split('-');
      return `${day}/${month}/${year}`;
    }
  },
  watch: {
    value(newVal) {
      this.internalDate = newVal;
    }
  },
  methods: {
    handleDateChange(val) {
      if (val) {
        this.$emit('input', val);
        this.$refs.qDateProxy.hide();
      }
    },
    clearDate() {
      this.$emit('input', '');
      this.internalDate = '';
    }
  }
}
</script>

<style scoped>
.date-container {
  min-width: 180px;
}

::v-deep .date-input-modern .q-field__control {
  height: 44px !important;
  border-radius: 8px !important;
  background: #FFFFFF !important;
  transition: all 0.2s ease;
  border: 1px solid #D1D5DB !important;
}

::v-deep .date-input-modern .q-field__control:hover {
  border-color: #9CA3AF !important;
}

::v-deep .date-input-modern.q-field--focused .q-field__control {
  border-color: #2563EB !important;
}

::v-deep .date-input-modern .q-field__native {
  font-size: 14px !important;
  font-weight: 500 !important;
  color: #111827 !important;
  padding: 0 8px !important;
  cursor: pointer;
}

::v-deep .date-input-modern .q-field__label {
  font-size: 13px !important;
  color: #6B7280 !important;
  top: 12px !important;
}

.date-icon {
  color: #6B7280;
  margin-left: 4px;
}

.clear-icon {
  color: #9CA3AF;
}

/* Hide Quasar's default border effects to use our custom one */
::v-deep .date-input-modern .q-field__control:before,
::v-deep .date-input-modern .q-field__control:after {
  display: none !important;
}
</style>
