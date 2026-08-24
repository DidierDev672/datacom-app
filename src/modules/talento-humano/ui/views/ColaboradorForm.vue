<template>
  <q-page class="q-pa-md flex flex-center bg-grey-2">
    <q-card class="form-container shadow-10">
      <!-- Header con gradiente -->
      <q-card-section class="header-gradient text-white text-center q-pa-lg">
        <h1 class="form-title">Registro de Colaboradores</h1>
      </q-card-section>

      <q-card-section class="q-pa-xl">
        <q-form @submit="onSubmit" class="q-gutter-md">
          
          <!-- Sección: Información Básica -->
          <div class="form-section">
            <h2 class="section-subtitle">Información Básica</h2>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-select
                  v-model="form.informacionBasica.tipoDocumento"
                  :options="['CC', 'CE', 'PASAPORTE']"
                  label="Tipo de Documento *"
                  dense
                  outlined
                  :rules="[val => !!val || 'Campo requerido']"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="form.informacionBasica.numeroDocumento"
                  label="Número de Documento *"
                  dense
                  outlined
                  :rules="[val => !!val || 'Campo requerido']"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="form.informacionBasica.nombres"
                  label="Nombres *"
                  dense
                  outlined
                  :rules="[val => !!val || 'Campo requerido']"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="form.informacionBasica.apellidos"
                  label="Apellidos *"
                  dense
                  outlined
                  :rules="[val => !!val || 'Campo requerido']"
                />
              </div>
              <div class="col-12 col-md-4">
                <q-input
                  v-model="form.informacionBasica.fechaNacimiento"
                  label="Fecha de Nacimiento"
                  type="date"
                  dense
                  outlined
                  stack-label
                />
              </div>
              <div class="col-12 col-md-4">
                <q-select
                  v-model="form.informacionBasica.genero"
                  :options="['Masculino', 'Femenino', 'Otro']"
                  label="Género"
                  dense
                  outlined
                />
              </div>
              <div class="col-12 col-md-4">
                <q-input
                  v-model="form.informacionBasica.estadoCivil"
                  label="Estado Civil"
                  dense
                  outlined
                />
              </div>
            </div>
          </div>

          <!-- Sección: Contacto -->
          <div class="form-section">
            <h2 class="section-subtitle">Datos de Contacto</h2>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-input
                  v-model="form.contacto.telefono"
                  label="Teléfono"
                  dense
                  outlined
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="form.contacto.email"
                  label="Correo Electrónico *"
                  type="email"
                  dense
                  outlined
                  :rules="[val => !!val || 'Campo requerido', val => /.+@.+\..+/.test(val) || 'Email inválido']"
                />
              </div>
              <div class="col-12 col-md-8">
                <q-input
                  v-model="form.contacto.direccion"
                  label="Dirección"
                  dense
                  outlined
                />
              </div>
              <div class="col-12 col-md-4">
                <q-input
                  v-model="form.contacto.ciudad"
                  label="Ciudad"
                  dense
                  outlined
                />
              </div>
            </div>
          </div>

          <!-- Sección: Información Laboral -->
          <div class="form-section">
            <h2 class="section-subtitle">Información Laboral</h2>
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <q-select
                  v-model="form.idPuestoTrabajo"
                  :options="puestosOptions"
                  label="Puesto de Trabajo *"
                  emit-value
                  map-options
                  dense
                  outlined
                  :rules="[val => !!val || 'Seleccione un cargo']"
                />
              </div>
              <div class="col-12 col-md-4">
                <q-input
                  v-model="form.informacionLaboral.fechaIngreso"
                  label="Fecha de Ingreso"
                  type="date"
                  dense
                  outlined
                  stack-label
                />
              </div>
              <div class="col-12 col-md-4">
                <q-input
                  v-model="form.informacionLaboral.tipoContrato"
                  label="Tipo de Contrato"
                  dense
                  outlined
                />
              </div>
              <div class="col-12 col-md-4">
                <q-input
                  v-model="form.informacionLaboral.salario"
                  label="Salario"
                  type="number"
                  dense
                  outlined
                  prefix="$"
                />
              </div>
              <div class="col-12">
                <q-select
                  v-model="form.informacionLaboral.estado"
                  :options="['ACTIVO', 'INACTIVO']"
                  label="Estado *"
                  dense
                  outlined
                  :rules="[val => !!val || 'Campo requerido']"
                />
              </div>
            </div>
          </div>

          <div class="row justify-end q-mt-xl">
            <q-btn label="Cancelar" color="grey-7" flat class="q-mr-sm" @click="$router.back()" />
            <q-btn label="Guardar Colaborador" type="submit" color="primary" :loading="loading" class="q-px-lg" />
          </div>

        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { ref, reactive, onMounted, computed } from '@vue/composition-api'
import { useColaboradoresStore } from '../../../../piña/colaboradores'
import { usePuestosTrabajoStore } from '../../../../piña/puestosTrabajo'

export default {
  name: 'ColaboradorForm',
  setup(props, { root }) {
    const colaboradoresStore = useColaboradoresStore()
    const puestosStore = usePuestosTrabajoStore()
    const loading = computed(() => colaboradoresStore.isLoading)

    const form = reactive({
      idPuestoTrabajo: null,
      informacionBasica: {
        tipoDocumento: 'CC',
        numeroDocumento: '',
        nombres: '',
        apellidos: '',
        fechaNacimiento: '',
        genero: '',
        estadoCivil: ''
      },
      contacto: {
        telefono: '',
        email: '',
        direccion: '',
        ciudad: ''
      },
      informacionLaboral: {
        fechaIngreso: new Date().toISOString().substr(0, 10),
        tipoContrato: '',
        salario: 0,
        estado: 'ACTIVO'
      },
      auditoria: {
        fechaCreacion: new Date().toISOString().substr(0, 10),
        usuarioCreacion: 'admin' // Placeholder
      }
    })

    const puestosOptions = computed(function () {
      return (puestosStore.puestos || []).map(function (p) {
        var area =
          p.area && String(p.area).trim()
            ? String(p.area).trim()
            : "Sin área";
        var cargo = p.nombreCargo || p.codigoCargo || "Cargo";
        return {
          label: area + " · " + cargo,
          value: p.id,
        };
      });
    })

    onMounted(async () => {
      await puestosStore.fetchPuestos()
    })

    const onSubmit = async () => {
      try {
        await colaboradoresStore.saveColaborador(form)
        root.$q.notify({
          type: 'positive',
          message: 'Colaborador registrado exitosamente',
          position: 'top-right'
        })
        root.$router.push('/talento-humano/lista')
      } catch (error) {
        root.$q.notify({
          type: 'negative',
          message: error.message || 'Error al guardar el colaborador',
          position: 'top-right'
        })
      }
    }

    return {
      form,
      loading,
      puestosOptions,
      onSubmit
    }
  }
}
</script>

<style scoped>
.form-container {
  width: 100%;
  max-width: 800px;
  background-color: #ffffff;
}

.header-gradient {
  background: linear-gradient(135deg, #84B24D, #75AF7E, #4E9C4C);
}

.form-title {
  font-size: 24px !important;
  font-weight: bold;
  text-transform: none; /* Mayúsculas y minúsculas */
  margin: 0;
  color: #ffffff;
}

.section-subtitle {
  font-size: 18px !important;
  font-weight: bold;
  text-align: left;
  margin-top: 0;
  margin-bottom: 20px;
  color: #6B7C85; /* Titulos solicitados */
}

/* Tamaño general 12px */
:deep(.q-field), :deep(.q-btn), :deep(p), :deep(span), :deep(div) {
  font-size: 12px;
}

/* Colores solicitados */
.section-subtitle {
  color: #6B7C85;
}

:deep(.q-field__label), :deep(.q-select__selection) {
  color: #A7B1B7; /* SubTitulos solicitados */
}

:deep(.q-field__native), :deep(.q-input__inner) {
  color: #4A5A63; /* Parrafos solicitados */
}

.form-section {
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
}

/* Accesibilidad y contraste */
.q-page {
  background-color: #f5f5f5;
}
</style>
