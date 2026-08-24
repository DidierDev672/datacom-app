<template>
  <div class="q-pa-md">
    <div class="text-h6 q-mb-md text-weight-bold">Crear Departamento</div>

    <q-form @submit.prevent="onSubmit" class="q-gutter-y-md">
      <!-- ═══ Sección: Información del Departamento ═══ -->
      <q-card flat bordered class="form-section q-pa-md">
        <div class="row items-center q-mb-sm">
          <q-icon name="business" size="20px" color="green-6" class="q-mr-sm" />
          <div class="text-subtitle1 text-green-6 text-weight-bold">Información del Departamento</div>
        </div>
        <q-separator class="q-mb-md" />

        <div class="row q-col-gutter-md items-start">
          <!-- Nombre -->
          <div class="col-12 col-md-6">
            <label class="field-label">Nombre del departamento <span class="text-red">*</span></label>
            <q-input
              v-model="form.name"
              outlined dense placeholder="Ej: Recursos Humanos"
              :rules="[val => !!val || 'El nombre es requerido', val => val.length >= 3 || 'Mínimo 3 caracteres']"
              lazy-rules
              :error="!!errors.name" :error-message="errors.name"
            >
              <template v-slot:prepend>
                <q-icon name="title" size="18px" color="grey-6" />
              </template>
            </q-input>
            <div class="field-helper">&nbsp;</div>
          </div>

          <!-- Código -->
          <div class="col-12 col-md-3">
            <label class="field-label">Código</label>
            <q-input
              v-model="form.code"
              outlined dense placeholder="Ej: RRHH"
              mask="XXXXXXXXXX"
              counter maxlength="10"
              :rules="[val => !val || val.length <= 10 || 'Máximo 10 caracteres']"
              :error="!!errors.code" :error-message="errors.code"
              @blur="form.code = (form.code || '').toUpperCase()"
            >
              <template v-slot:prepend>
                <q-icon name="tag" size="18px" color="grey-6" />
              </template>
            </q-input>
            <div class="field-helper">Máximo 10 caracteres (solo mayúsculas)</div>
          </div>

          <!-- Estado -->
          <div class="col-12 col-md-3">
            <label class="field-label">Estado <span class="text-red">*</span></label>
            <q-select
              v-model="form.status"
              :options="statusOptions"
              outlined dense emit-value map-options
              :rules="[val => !!val || 'El estado es requerido']"
              :error="!!errors.status" :error-message="errors.status"
            >
              <template v-slot:prepend>
                <q-icon
                  :name="form.status === 'ACTIVO' ? 'check_circle' : 'cancel'"
                  :color="form.status === 'ACTIVO' ? 'green' : 'grey'"
                  size="18px"
                />
              </template>
            </q-select>
            <div class="field-helper">&nbsp;</div>
          </div>

          <!-- Descripción -->
          <div class="col-12">
            <label class="field-label">Descripción</label>
            <q-input
              v-model="form.description"
              type="textarea" outlined dense rows="2"
              placeholder="Describa el propósito del departamento..."
              counter maxlength="255"
              :error="!!errors.description" :error-message="errors.description"
            />
          </div>
        </div>
      </q-card>

      <!-- ═══ Sección: Áreas de Trabajo ═══ -->
      <q-card flat bordered class="form-section q-pa-md">
        <div class="row items-center justify-between q-mb-sm">
          <div class="row items-center">
            <q-icon name="groups" size="20px" color="green-6" class="q-mr-sm" />
            <div class="text-subtitle1 text-green-6 text-weight-bold">Áreas de Trabajo</div>
          </div>
          <q-btn color="green-6" icon="add" label="Agregar área" unelevated size="sm" @click="addArea" />
        </div>
        <q-separator class="q-mb-md" />

        <div v-if="form.areas.length === 0" class="empty-state text-center q-pa-lg text-grey-6">
          <q-icon name="domain" size="40px" class="q-mb-sm opacity-40" />
          <div class="text-body1">No hay áreas agregadas.</div>
          <div class="text-caption">Un departamento puede crearse sin áreas.</div>
        </div>

        <div v-else>
          <div v-for="(area, index) in form.areas" :key="index" class="q-mb-md">
            <!-- Mobile -->
            <q-card v-if="$q.screen.lt.md" flat bordered class="q-pa-sm bg-grey-1">
              <div class="row justify-between items-center q-mb-xs">
                <span class="text-weight-bold text-body2">Área #{{ index + 1 }}</span>
                <q-btn icon="delete" color="negative" flat round size="sm" @click="removeArea(index)" />
              </div>
              <label class="field-label">Nombre del área <span class="text-red">*</span></label>
              <q-input v-model="area.name" outlined dense placeholder="Ej: Desarrollo Frontend"
                :rules="[val => !!val || 'Requerido', val => val.length >= 3 || 'Mínimo 3']" class="q-mb-sm" />
              <label class="field-label">Responsable</label>
              <q-input v-model="area.manager" outlined dense placeholder="Nombre del encargado" class="q-mb-sm" />
              <label class="field-label">Estado <span class="text-red">*</span></label>
              <q-select v-model="area.status" :options="statusOptions" outlined dense emit-value map-options class="q-mb-sm" />
              <label class="field-label">Descripción del área</label>
              <q-input v-model="area.description" type="textarea" outlined dense rows="1" maxlength="255" />
            </q-card>

            <!-- Desktop -->
            <div v-else class="area-row q-pa-sm bg-grey-1 rounded-borders">
              <div class="row q-col-gutter-sm items-start">
                <div class="col-4">
                  <label class="field-label">Nombre del área <span class="text-red">*</span></label>
                  <q-input v-model="area.name" outlined dense placeholder="Ej: Desarrollo Frontend"
                    :rules="[val => !!val || 'Requerido', val => val.length >= 3 || 'Mínimo 3']" />
                </div>
                <div class="col-3">
                  <label class="field-label">Responsable</label>
                  <q-input v-model="area.manager" outlined dense placeholder="Nombre del encargado" />
                </div>
                <div class="col-3">
                  <label class="field-label">Estado <span class="text-red">*</span></label>
                  <q-select v-model="area.status" :options="statusOptions" outlined dense emit-value map-options />
                </div>
                <div class="col-2 flex items-center justify-end" style="padding-top: 24px;">
                  <q-btn icon="delete" color="negative" flat round size="sm" @click="removeArea(index)">
                    <q-tooltip>Eliminar área</q-tooltip>
                  </q-btn>
                </div>
                <div class="col-12">
                  <label class="field-label">Descripción del área</label>
                  <q-input v-model="area.description" type="textarea" outlined dense rows="1" maxlength="255"
                    placeholder="Breve descripción de las funciones del área" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </q-card>

      <!-- ═══ Acciones ═══ -->
      <div class="row justify-end q-gutter-x-sm">
        <q-btn label="Cancelar" flat color="grey-7" icon="close" @click="onCancel" :disable="store.isLoading" />
        <q-btn label="Guardar Departamento" color="green-6" unelevated icon="save" type="submit" :loading="store.isLoading" />
      </div>
    </q-form>
  </div>
</template>

<script>
import { useDepartmentStore } from '../stores/department.store'

export default {
  name: 'DepartmentForm',
  props: {
    initialData: { type: Object, default: () => null },
    isEditing: { type: Boolean, default: false }
  },
  data() {
    return {
      statusOptions: [
        { label: 'Activo', value: 'ACTIVO' },
        { label: 'Inactivo', value: 'INACTIVO' }
      ],
      form: {
        name: this.initialData ? this.initialData.name : '',
        code: this.initialData ? this.initialData.code : '',
        description: this.initialData ? this.initialData.description : '',
        status: this.initialData ? this.initialData.status : 'ACTIVO',
        areas: this.initialData && this.initialData.areas
                ? JSON.parse(JSON.stringify(this.initialData.areas))
                : []
      }
    }
  },
  watch: {
    initialData: {
      handler(newVal) {
        if (newVal) {
          this.form = {
            name: newVal.name || '',
            code: newVal.code || '',
            description: newVal.description || '',
            status: newVal.status || 'ACTIVO',
            areas: newVal.areas ? JSON.parse(JSON.stringify(newVal.areas)) : []
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    store() { return useDepartmentStore() },
    errors() { return this.store.errors }
  },
  methods: {
    addArea() {
      this.form.areas.push({ name: '', manager: '', description: '', status: 'ACTIVO' })
    },
    removeArea(index) {
      this.form.areas.splice(index, 1)
    },
    async onSubmit() {
      try {
        if (this.isEditing && this.initialData && this.initialData.id) {
          await this.store.update(this.initialData.id, this.form)
        } else {
          await this.store.create(this.form)
        }
        this.$q.notify({
          type: 'positive',
          message: this.isEditing ? 'Departamento actualizado correctamente' : 'Departamento creado correctamente',
          position: 'top-right'
        })
        this.resetForm()
        if (this.isEditing) this.$router.push('/departments')
      } catch (error) {
        this.$q.notify({
          type: 'negative',
          message: 'Revisa los campos con errores o el servidor',
          position: 'top-right'
        })
      }
    },
    onCancel() {
      this.resetForm()
    },
    resetForm() {
      this.form = { name: '', code: '', description: '', status: 'ACTIVO', areas: [] }
      this.store.errors = {}
    }
  }
}
</script>

<style scoped>
.form-section {
  border-radius: 8px;
}

.field-label {
  display: block;
  margin-bottom: 4px;
  font-size: 12px;
  font-weight: 600;
  color: #475569;
  line-height: 1.4;
}

.field-helper {
  min-height: 18px;
  margin-top: 2px;
  font-size: 11px;
  color: #64748b;
  line-height: 1.4;
}

.empty-state {
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
  background: #fafafa;
}

.opacity-40 {
  opacity: 0.4;
}

.area-row {
  border-left: 3px solid #4E9C4C;
}
</style>
