<template>
  <div class="q-pa-md">
    <q-card class="my-card shadow-5 rounded-borders">
      <q-card-section class="bg-primary text-white row items-center q-pb-md">
        <q-icon name="group_add" size="md" class="q-mr-md" />
        <div>
          <div class="text-h5 text-white">Registro de Nuevo Colaborador</div>
          <div class="text-subtitle2">Formulario de vinculación de talento humano</div>
        </div>
      </q-card-section>

      <q-card-section class="q-pa-none">
        <q-stepper
          v-model="step"
          ref="stepper"
          color="primary"
          animated
          header-nav
          class="no-shadow"
        >
          <!-- 1. IDENTIFICACIÓN DEL CARGO -->
          <q-step
            :name="1"
            title="Cargo"
            icon="work"
            :done="step > 1"
          >
            <div class="row q-col-gutter-lg">
              <div class="col-12 col-md-6">
                <q-input 
                  filled 
                  v-model="store.colaborador.nombreCargo" 
                  label="Nombre del cargo *" 
                  placeholder="Ej: Desarrollador Backend"
                  class="q-mb-md"
                />
                <q-input 
                  filled 
                  v-model="store.colaborador.codigoCargo" 
                  label="Código o ID Cargo" 
                  class="q-mb-md"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input 
                  filled 
                  v-model="store.colaborador.areaDepartamento" 
                  label="Área o Departamento *" 
                  placeholder="Ej: Tecnología"
                  class="q-mb-md"
                />
                <q-select 
                  filled 
                  v-model="store.colaborador.nivelJerarquico" 
                  :options="['Operativo', 'Táctico', 'Estratégico']" 
                  label="Nivel Jerárquico *"
                  class="q-mb-md"
                />
              </div>
            </div>
          </q-step>

          <!-- 2. INFORMACIÓN PERSONAL -->
          <q-step
            :name="2"
            title="Personal"
            icon="person"
            :done="step > 2"
          >
            <div class="row q-col-gutter-lg">
              <div class="col-12 col-md-6">
                <q-input filled v-model="store.colaborador.nombreCompleto" label="Nombre completo *" class="q-mb-md" />
                <q-select 
                  filled 
                  v-model="store.colaborador.tipoDocumento" 
                  :options="['Cédula de ciudadanía', 'Tarjeta de extranjería', 'Pasaporte']" 
                  label="Tipo de documento *"
                  class="q-mb-md"
                />
                <q-input filled v-model="store.colaborador.numeroDocumento" label="Número de documento *" class="q-mb-md" />
              </div>
              <div class="col-12 col-md-6">
                <q-input filled v-model="store.colaborador.fechaNacimiento" label="Fecha de Nacimiento" mask="date" class="q-mb-md">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy transition-show="scale" transition-hide="scale">
                        <q-date v-model="store.colaborador.fechaNacimiento" />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
                <q-select 
                  filled 
                  v-model="store.colaborador.genero" 
                  :options="['Masculino', 'Femenino', 'Otros']" 
                  label="Género"
                  class="q-mb-md"
                />
                <q-input filled v-model="store.colaborador.nacionalidad" label="Nacionalidad" class="q-mb-md" />
              </div>
            </div>
          </q-step>

          <!-- 3. DATOS DE CONTACTO -->
          <q-step
            :name="3"
            title="Contacto"
            icon="contact_phone"
            :done="step > 3"
          >
            <div class="row q-col-gutter-lg">
              <div class="col-12 col-md-4">
                <q-input filled v-model="store.colaborador.telefono" label="Teléfono" icon="phone" class="q-mb-md" />
              </div>
              <div class="col-12 col-md-4">
                <q-input filled v-model="store.colaborador.correoElectronico" label="Correo electrónico *" icon="email" class="q-mb-md" />
              </div>
              <div class="col-12 col-md-4">
                <q-input filled v-model="store.colaborador.direccionResidencia" label="Dirección de residencia" icon="place" class="q-mb-md" />
              </div>
            </div>
          </q-step>

          <!-- 4. INFORMACIÓN LABORAL -->
          <q-step
            :name="4"
            title="Laboral"
            icon="badge"
            :done="step > 4"
          >
            <div class="row q-col-gutter-lg">
              <div class="col-12 col-md-6">
                <q-input filled v-model="store.colaborador.cargoAsignado" label="Cargo asignado *" class="q-mb-md" />
                <q-input filled v-model="store.colaborador.fechaIngreso" label="Fecha de ingreso" mask="date" class="q-mb-md">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy transition-show="scale" transition-hide="scale">
                        <q-date v-model="store.colaborador.fechaIngreso" />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col-12 col-md-6">
                <q-input filled v-model="store.colaborador.tipoContrato" label="Tipo de contrato" class="q-mb-md" />
                <q-select filled v-model="store.colaborador.estado" :options="['Activo', 'Inactivo']" label="Estado" class="q-mb-md" />
              </div>
            </div>
          </q-step>

          <!-- 5. FORMACIÓN Y EXPERIENCIA -->
          <q-step
            :name="5"
            title="Formación"
            icon="school"
            :done="step > 5"
          >
            <div class="row q-col-gutter-lg">
              <div class="col-12 col-md-6">
                <q-input filled v-model="store.colaborador.nivelEducativo" label="Nivel educativo" placeholder="Ej: Profesional" class="q-mb-md" />
                <q-input filled v-model="store.colaborador.profesion" label="Profesión" placeholder="Ej: Ingeniero de software" class="q-mb-md" />
              </div>
              <div class="col-12 col-md-6 text-center q-pt-lg">
                <q-input filled v-model="store.colaborador.experienciaLaboral" label="Experiencia laboral previa" type="textarea" autogrow class="q-mb-md" />
                <q-file
                  filled
                  v-model="certificadoFile"
                  label="Agregar Certificado PDF"
                  accept=".pdf"
                  class="full-width"
                  @input="handleFileUpload"
                >
                  <template v-slot:prepend>
                    <q-icon name="picture_as_pdf" />
                  </template>
                </q-file>
              </div>
            </div>
          </q-step>

          <!-- 6. INFORMACIÓN ADMINISTRATIVA -->
          <q-step
            :name="6"
            title="Administrativo"
            icon="admin_panel_settings"
          >
            <div class="row q-col-gutter-lg">
              <div class="col-12 col-md-4">
                <q-input filled v-model="store.colaborador.eps" label="EPS | Sistema de Salud" class="q-mb-md" />
              </div>
              <div class="col-12 col-md-4">
                <q-input filled v-model="store.colaborador.fondoPension" label="Fondo de pensión" class="q-mb-md" />
              </div>
              <div class="col-12 col-md-4">
                <q-input filled v-model="store.colaborador.arl" label="ARL (Riesgo laborales)" class="q-mb-md" />
              </div>
            </div>

            <q-banner v-if="error" class="bg-negative text-white q-my-md rounded-borders">
              {{ error }}
            </q-banner>
          </q-step>

          <!-- NAVEGACIÓN -->
          <template v-slot:navigation>
            <q-stepper-navigation class="row justify-end q-pa-md bg-grey-1">
              <q-btn 
                v-if="step > 1" 
                flat 
                color="primary" 
                @click="$refs.stepper.previous()" 
                label="Anterior" 
                class="q-mr-sm" 
              />
              <q-btn 
                @click="handleNext" 
                color="primary" 
                :label="step === 6 ? 'Finalizar Registro' : 'Siguiente'" 
                :loading="loading"
                :icon-right="step === 6 ? 'check' : 'arrow_forward'"
              />
            </q-stepper-navigation>
          </template>
        </q-stepper>
        
        <q-inner-loading :showing="loading">
          <q-spinner-gears size="50px" color="primary" />
          <div class="text-primary q-mt-md">Procesando registro...</div>
        </q-inner-loading>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { useTalentoHumanoStore } from '../store/useTalentoHumanoStore';

export default {
  name: 'RegistroColaboradorView',
  data() {
    return {
      store: useTalentoHumanoStore(),
      certificadoFile: null
    };
  },
  computed: {
    form() {
      return this.store.colaborador;
    },
    step: {
      get() { return this.store.step; },
      set(val) { this.store.step = val; }
    },
    loading() {
      return this.store.loading;
    },
    error() {
      return this.store.error;
    }
  },
  methods: {
    async handleNext() {
      if (this.step < 6) {
        // Validación básica por paso (UX)
        if (this.validateCurrentStep()) {
          this.$refs.stepper.next();
        } else {
          this.$q.notify({
            color: 'warning',
            message: 'Por favor complete todos los campos obligatorios del paso actual.',
            icon: 'warning'
          });
        }
      } else {
        // Enviar al servidor
        try {
          await this.store.registrarColaborador();
          this.$q.notify({
            color: 'positive',
            message: '¡Colaborador registrado exitosamente!',
            icon: 'check_circle'
          });
          this.$router.push({ name: 'lista-colaboradores' });
        } catch (e) {
          // El error ya se maneja en el store y se muestra en el banner
        }
      }
    },
    validateCurrentStep() {
      const s = this.step;
      const f = this.form;
      if (s === 1) return f.nombreCargo && f.areaDepartamento && f.nivelJerarquico;
      if (s === 2) return f.nombreCompleto && f.tipoDocumento && f.numeroDocumento;
      if (s === 3) return f.correoElectronico;
      if (s === 4) return f.cargoAsignado;
      return true; // Otros pasos son opcionales por simplicidad en demo
    },
    handleFileUpload(file) {
      if (file) {
        // Por ahora simulamos guardando el nombre del archivo
        this.form.urlCertificadoPdf = file.name;
        this.$q.notify({
          color: 'info',
          message: `Archivo seleccionado: ${file.name}`,
          icon: 'attach_file'
        });
      }
    }
  }
};
</script>

<style scoped>
.my-card {
  max-width: 1000px;
  margin: 0 auto;
}
.bg-light {
  background: #fdfdfd;
}
</style>
