<template>
  <q-dialog
    :value="value"
    persistent
    transition-show="scale"
    transition-hide="scale"
    @input="$emit('input', $event)"
  >
    <q-card class="order-name-dialog">
      <q-card-section class="row items-center q-pb-sm">
        <q-avatar icon="assignment" color="primary" text-color="white" />
        <div class="q-ml-md">
          <div class="text-h6">{{ dialogTitle }}</div>
          <div class="text-caption text-grey-7">
            {{ dialogSubtitle }}
          </div>
        </div>
        <q-space />
        <q-btn
          v-close-popup
          flat
          round
          dense
          icon="close"
          :disable="loading"
          @click="close"
        />
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-input
          v-model="orderName"
          outlined
          dense
          autofocus
          label="Nombre de la orden *"
          placeholder="Ej: Solicitud equipos oficina Q2 2026"
          :error="!!localError"
          :error-message="localError"
          :disable="loading"
          @keyup.enter="confirm"
        />
      </q-card-section>

      <q-card-actions align="right" class="q-pa-md">
        <q-btn
          flat
          no-caps
          label="Cancelar"
          color="grey-7"
          :disable="loading"
          @click="close"
        />
        <q-btn
          unelevated
          no-caps
          color="primary"
          icon="check"
          :label="confirmLabel"
          :loading="loading"
          @click="confirm"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "CreateOrderNameModal",

  props: {
    value: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    error: {
      type: String,
      default: "",
    },
    initialName: {
      type: String,
      default: "",
    },
    dialogTitle: {
      type: String,
      default: "Nombre de la orden",
    },
    dialogSubtitle: {
      type: String,
      default:
        "Asigne un nombre para identificar esta solicitud de abastecimiento.",
    },
    confirmLabel: {
      type: String,
      default: "Crear orden",
    },
  },

  data() {
    return {
      orderName: "",
      localError: "",
    };
  },

  watch: {
    value(isOpen) {
      if (isOpen) {
        this.orderName = this.initialName || "";
        this.localError = "";
      }
    },
    initialName(name) {
      if (this.value) {
        this.orderName = name || "";
      }
    },
    error(message) {
      if (message) {
        this.localError = message;
      }
    },
  },

  methods: {
    close() {
      this.$emit("input", false);
    },
    confirm() {
      const trimmed = (this.orderName || "").trim();
      this.localError = "";

      if (!trimmed) {
        this.localError = "Ingrese un nombre para la orden.";
        return;
      }

      if (trimmed.length < 3) {
        this.localError = "El nombre debe tener al menos 3 caracteres.";
        return;
      }

      this.$emit("confirm", trimmed);
    },
  },
};
</script>

<style scoped>
.order-name-dialog {
  width: min(520px, 95vw);
  border-radius: 12px;
}
</style>
