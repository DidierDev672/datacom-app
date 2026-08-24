<template>
  <q-card class="employee-card">
    <q-card-section class="header-gradient text-white q-pa-lg">
      <div class="text-h6 text-weight-bold text-white">
        {{
          editMode
            ? "Editar datos básicos del empleado"
            : "Datos básicos del empleado"
        }}
      </div>
      <div class="text-caption opacity-85">
        {{
          editMode
            ? "Modifique información personal, de contacto, ubicación y contratación."
            : "Registre información personal, de contacto, ubicación y contratación."
        }}
      </div>
    </q-card-section>

    <q-form ref="formRef" class="form-body" @submit.prevent="onSubmit">

      <!-- ═══════════ SECCIÓN 1: Datos básicos ═══════════ -->
      <div class="form-section">
        <div class="form-section__header">
          <q-icon name="person" size="20px" class="form-section__icon" />
          <span class="form-section__title">Datos básicos</span>
        </div>
        <div class="form-section__body">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-4">
              <label class="field-label">Código de empleado *</label>
              <q-input
                v-model="form.employeeCode"
                outlined dense readonly bg-color="grey-2"
                :rules="[onSubmit ? requiredRule('Obligatorio') : true]"
                :lazy-rules="false"
              >
                <template v-slot:prepend>
                  <q-icon name="badge" color="grey-6" />
                </template>
                <template v-if="!editMode" v-slot:append>
                  <q-btn flat dense round icon="refresh" @click="regenerateEmployeeCode" />
                </template>
              </q-input>
            </div>
            <div class="col-12 col-md-4">
              <label class="field-label">Tipo de documento *</label>
              <q-select
                v-model="form.documentType"
                :options="documentTypeOptions"
                emit-value map-options outlined dense bg-color="white"
                :rules="fieldRules('documentType', 'El tipo de documento es obligatorio')"
                @blur="touch('documentType')"
              />
            </div>
            <div class="col-12 col-md-4">
              <label class="field-label">Número de documento *</label>
              <q-input
                v-model="form.documentNumber"
                outlined dense bg-color="white"
                :rules="fieldRules('documentNumber', 'El número de documento es obligatorio')"
                @blur="touch('documentNumber')"
              />
            </div>
          </div>

          <div class="row q-col-gutter-md q-mt-xs">
            <div class="col-12 col-md-4">
              <label class="field-label">Nombre completo *</label>
              <q-input
                v-model="form.fullName"
                outlined dense bg-color="white"
                :rules="fieldRules('fullName', 'El nombre completo es obligatorio')"
                @blur="touch('fullName')"
              />
            </div>
            <div class="col-12 col-md-4">
              <label class="field-label">Fecha de nacimiento *</label>
              <q-input
                v-model="form.birthDate"
                outlined dense bg-color="white"
                mask="date" placeholder="AAAA-MM-DD"
                :rules="fieldRules('birthDate', 'La fecha de nacimiento es obligatoria')"
                @blur="touch('birthDate')"
              >
                <template v-slot:prepend>
                  <q-icon name="event" color="grey-6" />
                </template>
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="form.birthDate" mask="YYYY-MM-DD" />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-12 col-md-4">
              <label class="field-label">Género *</label>
              <q-select
                v-model="form.gender"
                :options="genderOptions"
                emit-value map-options outlined dense bg-color="white"
                :rules="fieldRules('gender', 'El género es obligatorio')"
                @blur="touch('gender')"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- ═══════════ SECCIÓN 2: Información de contacto ═══════════ -->
      <div class="form-section">
        <div class="form-section__header">
          <q-icon name="mail" size="20px" class="form-section__icon" />
          <span class="form-section__title">Información de contacto</span>
        </div>
        <div class="form-section__body">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-4">
              <label class="field-label">Correo corporativo *</label>
              <q-input
                v-model="form.corporateEmail"
                outlined dense bg-color="white" type="email"
                :rules="fieldRules('corporateEmail', 'El correo corporativo es obligatorio', emailRule)"
                @blur="touch('corporateEmail')"
              />
            </div>
            <div class="col-12 col-md-4">
              <label class="field-label">Correo personal</label>
              <q-input
                v-model="form.personalEmail"
                outlined dense bg-color="white" type="email"
              />
            </div>
            <div class="col-12 col-md-4">
              <label class="field-label">Teléfono móvil *</label>
              <q-input
                v-model="form.mobilePhone"
                outlined dense bg-color="white"
                :rules="fieldRules('mobilePhone', 'El teléfono móvil es obligatorio')"
                @blur="touch('mobilePhone')"
              />
            </div>
          </div>
          <div class="row q-col-gutter-md q-mt-xs">
            <div class="col-12 col-md-4">
              <label class="field-label">Teléfono alterno</label>
              <q-input
                v-model="form.alternatePhone"
                outlined dense bg-color="white"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- ═══════════ SECCIÓN 3: Dirección de residencia ═══════════ -->
      <div class="form-section">
        <div class="form-section__header">
          <q-icon name="location_on" size="20px" class="form-section__icon" />
          <span class="form-section__title">Dirección de residencia</span>
        </div>
        <div class="form-section__body">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-4">
              <label class="field-label">Dirección</label>
              <q-input
                v-model="form.address"
                outlined dense bg-color="white"
                placeholder="Calle, carrera, avenida..."
              />
            </div>
            <div class="col-12 col-md-4">
              <label class="field-label">Ciudad</label>
              <q-input
                v-model="form.city"
                outlined dense bg-color="white"
              />
            </div>
            <div class="col-12 col-md-4">
              <label class="field-label">País</label>
              <q-input
                v-model="form.country"
                outlined dense bg-color="white"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- ═══════════ SECCIÓN 4: Contrato ═══════════ -->
      <div class="form-section">
        <div class="form-section__header">
          <q-icon name="description" size="20px" class="form-section__icon" />
          <span class="form-section__title">Contrato</span>
        </div>
        <div class="form-section__body">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-4">
              <label class="field-label">Tipo de contrato *</label>
              <q-select
                v-model="form.contractType"
                :options="contractTypeOptions"
                emit-value map-options outlined dense bg-color="white"
                :rules="fieldRules('contractType', 'El tipo de contrato es obligatorio')"
                @blur="touch('contractType')"
              />
            </div>
            <div class="col-12 col-md-4">
              <label class="field-label">Fecha de inicio *</label>
              <q-input
                v-model="form.startDate"
                outlined dense bg-color="white"
                mask="date" placeholder="AAAA-MM-DD"
                :rules="fieldRules('startDate', 'La fecha de inicio es obligatoria')"
                @blur="touch('startDate')"
              >
                <template v-slot:prepend>
                  <q-icon name="event" color="grey-6" />
                </template>
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="form.startDate" mask="YYYY-MM-DD" />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-12 col-md-4">
              <label class="field-label">Fecha de finalización</label>
              <q-input
                v-model="form.endDate"
                outlined dense bg-color="white"
                mask="date" placeholder="AAAA-MM-DD"
              >
                <template v-slot:prepend>
                  <q-icon name="event" color="grey-6" />
                </template>
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="form.endDate" mask="YYYY-MM-DD" />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>
          <div class="row q-col-gutter-md q-mt-xs">
            <div class="col-12 col-md-4">
              <label class="field-label">Salario base *</label>
              <q-input
                v-model.number="form.baseSalary"
                outlined dense bg-color="white" type="number" min="0"
                :rules="fieldRules('baseSalary', 'El salario base es obligatorio', salaryRule)"
                @blur="touch('baseSalary')"
              >
                <template v-slot:prepend>
                  <q-icon name="attach_money" color="grey-6" />
                </template>
              </q-input>
            </div>
          </div>
        </div>
      </div>

      <!-- ═══════════ ACCIONES ═══════════ -->
      <div class="form-actions">
        <q-btn
          v-if="!editMode"
          flat no-caps color="grey-7"
          icon="cleaning_services" label="Limpiar"
          @click="resetForm"
        />
        <q-btn
          v-if="editMode"
          flat no-caps color="grey-7"
          label="Cancelar" @click="$emit('cancel')"
        />
        <q-btn
          unelevated no-caps color="primary"
          icon="save" type="submit"
          :loading="saving"
          :label="editMode ? 'Guardar cambios' : 'Guardar empleado'"
        />
      </div>

    </q-form>
  </q-card>
</template>

<script>
import { computed, onMounted, reactive, ref } from "@vue/composition-api";
import { colaboradorToForm } from "../utils/colaboradorFormMapper";

export default {
  name: "EmployeeBasicDataForm",
  props: {
    editMode: { type: Boolean, default: false },
    seedColaborador: { type: Object, default: null },
    saving: { type: Boolean, default: false },
  },
  setup(props, { emit }) {
    const formRef = ref(null);
    const submitted = ref(false);
    const touched = reactive({});

    const touch = (field) => {
      touched[field] = true;
    };

    const fieldRules = function (field, requiredMsg, extraRule) {
      return function (val) {
        if (!submitted.value && !touched[field]) return true;
        var valStr = val != null ? String(val).trim() : "";
        if (field === "baseSalary") {
          valStr = val != null && val !== "" ? "x" : "";
        }
        if (!valStr) return requiredMsg;
        if (extraRule) {
          var extraResult = extraRule(val);
          if (extraResult !== true) return extraResult;
        }
        return true;
      };
    };

    const form = ref({
      employeeCode: "",
      documentType: "",
      documentNumber: "",
      fullName: "",
      birthDate: "",
      gender: "",
      corporateEmail: "",
      personalEmail: "",
      mobilePhone: "",
      alternatePhone: "",
      address: "",
      city: "",
      country: "Colombia",
      contractType: "",
      startDate: "",
      endDate: "",
      baseSalary: null,
    });

    const documentTypeOptions = [
      { label: "Cédula de ciudadanía", value: "NATIONAL_ID" },
      { label: "Cédula de extranjería", value: "FOREIGNER_ID" },
      { label: "Pasaporte", value: "PASSPORT" },
      { label: "Número de identificación tributaria (NIT)", value: "NIT" },
      { label: "Otro", value: "OTHER" },
    ];
    const genderOptions = [
      { label: "Masculino", value: "MALE" },
      { label: "Femenino", value: "FEMALE" },
      { label: "Otro", value: "OTHER" },
      { label: "Prefiero no responder", value: "PREFER_NOT_TO_ANSWER" },
    ];
    const contractTypeOptions = [
      { label: "Término indefinido", value: "INDEFINITE_TERM" },
      { label: "Término fijo", value: "FIXED_TERM" },
      { label: "Contrato de prestación de servicios", value: "SERVICE_CONTRACT" },
      { label: "Aprendizaje", value: "APPRENTICESHIP" },
      { label: "Temporal", value: "TEMPORARY" },
    ];

    const generateEmployeeCode = () => {
      const now = new Date();
      const year = now.getFullYear();
      const stamp = String(now.getTime()).slice(-5);
      form.value.employeeCode = `EMP-${year}-${stamp}`;
    };

    const requiredRule = (message) => (val) =>
      (val && String(val).trim().length > 0) || message;

    const emailRule = (val) =>
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
        String(val || "").trim()
      ) || "Ingrese un correo electrónico válido";

    const salaryRule = (val) =>
      (val != null && val !== "" && Number(val) >= 0) ||
      "Ingrese un salario base válido";

    const resetForm = () => {
      submitted.value = false;
      Object.keys(touched).forEach(function (k) { delete touched[k]; });
      form.value = {
        employeeCode: "",
        documentType: "",
        documentNumber: "",
        fullName: "",
        birthDate: "",
        gender: "",
        corporateEmail: "",
        personalEmail: "",
        mobilePhone: "",
        alternatePhone: "",
        address: "",
        city: "",
        country: "Colombia",
        contractType: "",
        startDate: "",
        endDate: "",
        baseSalary: null,
      };
      generateEmployeeCode();
      if (formRef.value) formRef.value.resetValidation();
      emit("reset");
    };

    const onSubmit = async () => {
      submitted.value = true;
      await new Promise(function (r) { setTimeout(r, 50); });
      if (!formRef.value) return;
      var valid = await formRef.value.validate();
      if (!valid) return;
      emit("save", { ...form.value });
    };

    const applySeedColaborador = (colaborador) => {
      const mapped = colaboradorToForm(colaborador);
      if (!mapped) return;
      Object.assign(form.value, mapped);
      if (formRef.value) formRef.value.resetValidation();
    };

    onMounted(function () {
      if (!props.editMode) {
        generateEmployeeCode();
      } else if (props.seedColaborador) {
        applySeedColaborador(props.seedColaborador);
      }
    });

    return {
      editMode: computed(() => props.editMode),
      saving: computed(() => props.saving),
      formRef,
      form,
      documentTypeOptions,
      genderOptions,
      contractTypeOptions,
      requiredRule,
      emailRule,
      salaryRule,
      fieldRules,
      touch,
      regenerateEmployeeCode: generateEmployeeCode,
      resetForm,
      onSubmit,
    };
  },
};
</script>

<style scoped>
.employee-card {
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.header-gradient {
  background: linear-gradient(135deg, #84b24d 0%, #75af7e 50%, #4e9c4c 100%);
}

.form-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ═══ Secciones ═══ */
.form-section {
  border: 1px solid #e8ecf1;
  border-radius: 10px;
  background: #fafbfc;
  overflow: hidden;
}

.form-section__header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  background: #f1f5f9;
  border-bottom: 1px solid #e8ecf1;
}

.form-section__icon {
  color: #84b24d;
}

.form-section__title {
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: #334155;
}

.form-section__body {
  padding: 20px;
}

/* ═══ Labels ═══ */
.field-label {
  display: block;
  margin-bottom: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #475569;
}

/* ═══ Acciones ═══ */
.form-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  padding-top: 8px;
}

.opacity-85 {
  opacity: 0.85;
}

/* ═══ Responsive ═══ */
@media (max-width: 768px) {
  .form-body {
    padding: 16px;
    gap: 16px;
  }
  .form-section__body {
    padding: 16px;
  }
}
</style>
