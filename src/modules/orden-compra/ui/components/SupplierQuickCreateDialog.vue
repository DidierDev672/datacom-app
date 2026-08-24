<template>
  <q-dialog
    :value="value"
    persistent
    transition-show="scale"
    transition-hide="scale"
    @input="$emit('input', $event)"
  >
    <q-card class="create-supplier-dialog">
      <q-card-section class="row items-center q-pb-sm">
        <q-avatar icon="person_add" color="primary" text-color="white" />
        <div class="q-ml-md">
          <div class="text-h6">Registrar nuevo proveedor</div>
          <div class="text-caption text-grey-7">
            El proveedor quedará disponible en el sistema para futuras comparaciones.
          </div>
        </div>
        <q-space />
        <q-btn v-close-popup flat round dense icon="close" :disable="saving" />
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-form @submit.prevent="saveSupplier">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.nit"
                outlined
                dense
                label="NIT / Documento *"
                :rules="[(val) => !!(val && val.trim()) || 'Requerido']"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.name"
                outlined
                dense
                label="Nombre o razón social *"
                :rules="[(val) => !!(val && val.trim()) || 'Requerido']"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.contactName"
                outlined
                dense
                label="Nombre de contacto"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.phone"
                outlined
                dense
                label="Teléfono"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.email"
                outlined
                dense
                type="email"
                label="Correo electrónico"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.address"
                outlined
                dense
                label="Dirección"
              />
            </div>
          </div>
        </q-form>
      </q-card-section>

      <q-card-actions align="right" class="q-pa-md">
        <q-btn flat no-caps label="Cancelar" color="grey-7" v-close-popup :disable="saving" />
        <q-btn
          unelevated
          no-caps
          color="primary"
          icon="save"
          label="Registrar y agregar"
          :loading="saving"
          @click="saveSupplier"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { supplierApi } from "../../infrastructure/supplierApi";

function createEmptyForm() {
  return {
    nit: "",
    name: "",
    contactName: "",
    phone: "",
    email: "",
    address: "",
  };
}

export default {
  name: "SupplierQuickCreateDialog",

  props: {
    value: {
      type: Boolean,
      default: false,
    },
    initialNit: {
      type: String,
      default: "",
    },
    initialName: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      saving: false,
      form: createEmptyForm(),
    };
  },

  watch: {
    value(isOpen) {
      if (isOpen) {
        this.form = {
          ...createEmptyForm(),
          nit: this.initialNit || "",
          name: this.initialName || "",
        };
      }
    },
  },

  methods: {
    async saveSupplier() {
      if (!this.form.nit || !this.form.nit.trim()) {
        this.$q.notify({
          type: "warning",
          message: "El NIT o documento es obligatorio.",
        });
        return;
      }

      if (!this.form.name || !this.form.name.trim()) {
        this.$q.notify({
          type: "warning",
          message: "El nombre del proveedor es obligatorio.",
        });
        return;
      }

      this.saving = true;
      try {
        const created = await supplierApi.createSupplier({
          nit: this.form.nit.trim(),
          name: this.form.name.trim(),
          contactName: this.form.contactName || "",
          phone: this.form.phone || "",
          email: this.form.email || "",
          address: this.form.address || "",
        });

        this.$q.notify({
          type: "positive",
          message: "Proveedor registrado correctamente en el sistema.",
        });

        this.$emit("created", created);
        this.$emit("input", false);
      } catch (error) {
        this.$q.notify({
          type: "negative",
          message:
            (error && error.message) ||
            "No fue posible registrar el proveedor.",
        });
      } finally {
        this.saving = false;
      }
    },
  },
};
</script>

<style scoped>
.create-supplier-dialog {
  width: min(720px, 95vw);
  border-radius: 12px;
}
</style>
