<template>
  <q-card class="work-area-card">
    <q-card-section class="header-gradient text-white q-pa-lg">
      <div class="text-h6 text-weight-bold text-white">Workspace registration</div>
      <div class="text-caption opacity-85">
        Complete the workspace details and operational status.
      </div>
    </q-card-section>

    <q-form
      ref="formRef"
      class="q-pa-lg q-gutter-y-md"
      @submit.prevent="onSubmit"
    >
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6">
          <label class="field-label">Workspace code *</label>
          <q-input
            v-model="form.areaCode"
            outlined
            dense
            bg-color="white"
            maxlength="30"
            placeholder="Ex: AREA-COM-001"
            :rules="[
              requiredRule('Workspace code is required'),
              uniqueCodeRule,
            ]"
            @blur="normalizeAreaCode"
          >
            <template v-slot:prepend>
              <q-icon name="badge" color="grey-6" />
            </template>
          </q-input>
        </div>

        <div class="col-12 col-md-6">
          <label class="field-label">Workspace name *</label>
          <q-input
            v-model="form.areaName"
            outlined
            dense
            bg-color="white"
            maxlength="120"
            placeholder="Ex: Strategic Procurement"
            :rules="[requiredRule('Workspace name is required')]"
          >
            <template v-slot:prepend>
              <q-icon name="apartment" color="grey-6" />
            </template>
          </q-input>
        </div>
      </div>

      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-4">
          <label class="field-label">Status *</label>
          <q-select
            v-model="form.status"
            :options="statusOptions"
            emit-value
            map-options
            outlined
            dense
            bg-color="white"
            :rules="[requiredRule('You must select a status')]"
          >
            <template v-slot:prepend>
              <q-icon name="flag" color="grey-6" />
            </template>
          </q-select>
        </div>

        <div class="col-12 col-md-4">
          <label class="field-label">Creation date</label>
          <q-input
            v-model="form.creationDate"
            outlined
            dense
            bg-color="grey-2"
            readonly
            disable
          >
            <template v-slot:prepend>
              <q-icon name="event_available" color="grey-6" />
            </template>
          </q-input>
        </div>

        <div class="col-12 col-md-4">
          <label class="field-label">Closure date</label>
          <q-input
            v-model="form.closureDate"
            outlined
            dense
            bg-color="white"
            mask="date"
            placeholder="YYYY-MM-DD"
          >
            <template v-slot:prepend>
              <q-icon name="event_busy" color="grey-6" />
            </template>
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="form.closureDate" mask="YYYY-MM-DD">
                    <div class="row items-center justify-end q-pa-sm">
                      <q-btn
                        v-close-popup
                        flat
                        no-caps
                        color="primary"
                        label="Close"
                      />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
      </div>

      <q-card-actions align="right" class="q-pa-none q-pt-sm">
        <q-btn
          flat
          no-caps
          color="grey-7"
          icon="cleaning_services"
          label="Clear"
          @click="resetForm"
        />
        <q-btn
          unelevated
          no-caps
          color="primary"
          icon="save"
          type="submit"
          label="Register workspace"
        />
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script>
export default {
  name: "WorkAreaRegistrationForm",
  props: {
    existingAreas: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      form: this.createInitialForm(),
      statusOptions: [
        { label: "Active", value: "ACTIVO" },
        { label: "Inactive", value: "INACTIVO" },
        { label: "Suspended", value: "SUSPENDIDO" },
      ],
    };
  },
  methods: {
    createInitialForm() {
      return {
        areaCode: "",
        areaName: "",
        status: "ACTIVO",
        creationDate: this.currentDate(),
        closureDate: "",
      };
    },
    currentDate() {
      const now = new Date();
      const yyyy = now.getFullYear();
      const mm = String(now.getMonth() + 1).padStart(2, "0");
      const dd = String(now.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    },
    requiredRule(message) {
      return (val) => (val && String(val).trim().length > 0) || message;
    },
    normalizeAreaCode() {
      this.form.areaCode = (this.form.areaCode || "").trim().toUpperCase();
    },
    uniqueCodeRule(val) {
      const code = (val || "").trim().toUpperCase();
      if (!code) return true;
      const exists = this.existingAreas.some((area) => {
        const existingCode = String(area.areaCode || area.code || "")
          .trim()
          .toUpperCase();
        return existingCode === code;
      });
      return !exists || "Workspace code already exists. Use a different one.";
    },
    async onSubmit() {
      this.normalizeAreaCode();
      const valid = await this.$refs.formRef.validate();
      if (!valid) return;

      const payload = {
        areaCode: this.form.areaCode,
        areaName: this.form.areaName.trim(),
        status: this.form.status,
        creationDate: this.form.creationDate,
        closureDate: this.form.closureDate || null,
      };

      this.$emit("save", payload);
    },
    resetForm() {
      this.form = this.createInitialForm();
      this.$nextTick(() => {
        if (this.$refs.formRef) {
          this.$refs.formRef.resetValidation();
        }
      });
      this.$emit("reset");
    },
  },
};
</script>

<style scoped>
.work-area-card {
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.header-gradient {
  background: linear-gradient(135deg, #84b24d 0%, #75af7e 50%, #4e9c4c 100%);
}

.field-label {
  display: block;
  margin-bottom: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #475569;
}

.opacity-85 {
  opacity: 0.85;
}
</style>
