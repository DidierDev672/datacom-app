<template>
  <div>
    <q-form ref="formRef" @submit.prevent="onSubmit">
      <!-- Datos del solicitante -->
      <q-card flat bordered class="q-mb-md">
        <q-card-section class="bg-grey-2 text-grey-9 text-subtitle2 text-weight-medium">
          Datos del solicitante
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-4">
              <div class="text-caption text-weight-medium text-grey-8 q-mb-xs">Fecha de solicitud *</div>
              <q-input
                v-model="store.form.fechaSolicitud"
                outlined
                dense
                type="date"
                :rules="[rules.required]"
              />
            </div>
            <div class="col-12 col-md-8">
              <div class="text-caption text-weight-medium text-grey-8 q-mb-xs">Nombre del empleado / contratista *</div>
              <q-input
                v-model="store.form.nombreEmpleado"
                outlined
                dense
                :rules="[rules.required]"
                maxlength="200"
              />
            </div>
            <div class="col-12 col-md-4">
              <div class="text-caption text-weight-medium text-grey-8 q-mb-xs">Cédula *</div>
              <q-input
                v-model="store.form.cedula"
                outlined
                dense
                :rules="[rules.required]"
                maxlength="32"
              />
            </div>
            <div class="col-12 col-md-4">
              <div class="text-caption text-weight-medium text-grey-8 q-mb-xs">Correo electrónico *</div>
              <q-input
                v-model="store.form.correoElectronico"
                outlined
                dense
                type="email"
                :rules="[rules.required, rules.email]"
              />
            </div>
            <div class="col-12 col-md-4">
              <div class="text-caption text-weight-medium text-grey-8 q-mb-xs">Celular *</div>
              <q-input
                v-model="store.form.celular"
                outlined
                dense
                :rules="[rules.required]"
                maxlength="32"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- Motivo y fechas -->
      <q-card flat bordered class="q-mb-md">
        <q-card-section class="bg-grey-2 text-grey-9 text-subtitle2 text-weight-medium">
          Motivo y fechas del viaje
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <div class="text-caption text-weight-medium text-grey-8 q-mb-xs">Motivo del viaje *</div>
              <q-input
                v-model="store.form.motivoViaje"
                outlined
                dense
                type="textarea"
                autogrow
                :rules="[rules.required]"
                maxlength="500"
                hint="Describe el propósito del desplazamiento"
              />
            </div>
            <div class="col-12 col-md-4">
              <div class="text-caption text-weight-medium text-grey-8 q-mb-xs">Fecha de viaje (ida) *</div>
              <q-input
                v-model="store.form.fechaViajeIda"
                outlined
                dense
                type="date"
                :rules="[rules.required, rules.fechaIda]"
              />
            </div>
            <div class="col-12 col-md-4">
              <div class="text-caption text-weight-medium text-grey-8 q-mb-xs">Fecha de regreso *</div>
              <q-input
                v-model="store.form.fechaRegreso"
                outlined
                dense
                type="date"
                :rules="[rules.required, rules.fechaRegreso]"
              />
            </div>
            <div class="col-12 col-md-4">
              <div class="text-caption text-weight-medium text-grey-8 q-mb-xs">Tipo de transporte *</div>
              <q-select
                v-model="store.form.tipoTransporte"
                outlined
                dense
                emit-value
                map-options
                :options="tipoTransporteOptions"
                :rules="[rules.required]"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- Ida -->
      <q-card flat bordered class="q-mb-md">
        <q-card-section class="bg-grey-2 text-grey-9 text-subtitle2 text-weight-medium">
          Ida
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <div class="text-caption text-weight-medium text-grey-8 q-mb-xs">Lugar de recogida *</div>
              <q-input v-model="store.form.lugarRecogida" outlined dense :rules="[rules.required]" maxlength="300" />
            </div>
            <div class="col-12 col-md-6">
              <div class="text-caption text-weight-medium text-grey-8 q-mb-xs">Horario sugerido (ida) *</div>
              <q-input
                v-model="store.form.horarioSugeridoIda"
                outlined
                dense
                type="time"
                :rules="[rules.required]"
              />
            </div>
            <div class="col-12">
              <div class="text-caption text-weight-medium text-grey-8 q-mb-xs">Ruta de ida *</div>
              <q-input
                v-model="store.form.rutaIda"
                outlined
                dense
                type="textarea"
                autogrow
                :rules="[rules.required]"
                maxlength="500"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- Regreso y vuelta -->
      <q-card flat bordered class="q-mb-md">
        <q-card-section class="bg-grey-2 text-grey-9 text-subtitle2 text-weight-medium">
          Regreso
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <div class="text-caption text-weight-medium text-grey-8 q-mb-xs">Ruta de regreso *</div>
              <q-input
                v-model="store.form.rutaRegreso"
                outlined
                dense
                type="textarea"
                autogrow
                :rules="[rules.required]"
                maxlength="500"
              />
            </div>
            <div class="col-12 col-md-6">
              <div class="text-caption text-weight-medium text-grey-8 q-mb-xs">Ruta de vuelta *</div>
              <q-input
                v-model="store.form.rutaVuelta"
                outlined
                dense
                type="textarea"
                autogrow
                :rules="[rules.required]"
                maxlength="500"
              />
            </div>
            <div class="col-12 col-md-4">
              <div class="text-caption text-weight-medium text-grey-8 q-mb-xs">Pernoctan *</div>
              <div class="q-pt-xs">
                <q-toggle
                  v-model="store.form.pernoctan"
                  :label="store.form.pernoctan ? 'Sí' : 'No'"
                  color="primary"
                />
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- Regreso: recogida y horario -->
      <q-card flat bordered class="q-mb-md">
        <q-card-section class="bg-grey-2 text-grey-9 text-subtitle2 text-weight-medium">
          Regreso — recogida
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <div class="text-caption text-weight-medium text-grey-8 q-mb-xs">Lugar de recogida (regreso) *</div>
              <q-input v-model="store.form.lugarRecogidaRegreso" outlined dense :rules="[rules.required]" maxlength="300" />
            </div>
            <div class="col-12 col-md-6">
              <div class="text-caption text-weight-medium text-grey-8 q-mb-xs">Horario sugerido regreso *</div>
              <q-input
                v-model="store.form.horarioSugeridoRegreso"
                outlined
                dense
                type="time"
                :rules="[rules.required]"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- Centro de costo y observaciones -->
      <q-card flat bordered class="q-mb-md">
        <q-card-section class="bg-grey-2 text-grey-9 text-subtitle2 text-weight-medium">
          Proyecto y observaciones
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <div class="text-caption text-weight-medium text-grey-8 q-mb-xs">Proyecto o centro de costo al que pertenece *</div>
              <q-input v-model="store.form.proyectoCentroCosto" outlined dense :rules="[rules.required]" maxlength="300" />
            </div>
            <div class="col-12">
              <div class="text-caption text-weight-medium text-grey-8 q-mb-xs">Observaciones</div>
              <q-input v-model="store.form.observaciones" outlined dense type="textarea" autogrow maxlength="2000" />
            </div>
          </div>
        </q-card-section>
      </q-card>

      <div class="row q-gutter-sm justify-end">
        <q-btn
          flat
          no-caps
          color="grey-8"
          label="Limpiar"
          @click="onReset"
        />
        <q-btn
          unelevated
          no-caps
          color="primary"
          type="submit"
          icon="save"
          label="Guardar solicitud"
          :loading="store.isLoading"
        />
      </div>
    </q-form>

    <q-dialog v-model="dialogExito" persistent>
      <q-card style="min-width: 320px; max-width: 420px;">
        <q-card-section class="row items-center no-wrap">
          <q-icon name="check_circle" color="positive" size="32px" class="q-mr-md" />
          <div>
            <div class="text-h6">Solicitud registrada</div>
            <div class="text-body2 text-grey-7 q-mt-sm">
              Estado inicial del flujo:
              <q-badge outline color="amber" label="Revisión" class="q-ml-xs" />
            </div>
            <div class="text-caption text-grey-7 q-mt-sm">Código asignado automáticamente</div>
            <div class="text-h6 text-primary">{{ codigoGuardadoExito || '—' }}</div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat no-caps label="Cerrar" v-close-popup color="primary" @click="onCerrarExito" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { useSolicitudRequerimientoViajeStore } from '../store/useSolicitudRequerimientoViajeStore';

export default {
  name: 'SolicitudRequerimientoViajeForm',

  data () {
    return {
      dialogExito: false,
      /** Copia local del código; el store se limpia tras guardar correctamente */
      codigoGuardadoExito: null,
      tipoTransporteOptions: [
        { label: 'Terrestre', value: 'TERRESTRE' },
        { label: 'Aéreo', value: 'AEREO' }
      ]
    };
  },

  computed: {
    store () {
      return useSolicitudRequerimientoViajeStore();
    },
    rules () {
      var vm = this;
      return {
        required: function (v) {
          return (v !== null && v !== undefined && String(v).trim().length > 0) || 'Campo obligatorio';
        },
        email: function (v) {
          if (!v) return true;
          var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return re.test(String(v).trim()) || 'Correo no válido';
        },
        fechaIda: function () {
          return vm._compareFechas(true);
        },
        fechaRegreso: function () {
          return vm._compareFechas(false);
        }
      };
    }
  },

  methods: {
    _compareFechas (isIdaField) {
      var ida = this.store.form.fechaViajeIda;
      var reg = this.store.form.fechaRegreso;
      if (!ida || !reg) return true;
      if (String(reg) < String(ida)) {
        return isIdaField
          ? 'La ida no puede ser posterior al regreso'
          : 'El regreso no puede ser anterior a la ida';
      }
      return true;
    },

    onReset () {
      this.store.resetForm();
      if (this.$refs.formRef && this.$refs.formRef.resetValidation) {
        this.$refs.formRef.resetValidation();
      }
    },

    onCerrarExito () {
      this.dialogExito = false;
      this.codigoGuardadoExito = null;
    },

    async onSubmit () {
      if (this.$refs.formRef && !this.$refs.formRef.validate()) {
        return;
      }
      try {
        await this.store.guardar();
        this.codigoGuardadoExito = this.store.ultimoCodigoGenerado || null;
        this.store.resetForm();
        if (this.$refs.formRef && this.$refs.formRef.resetValidation) {
          this.$refs.formRef.resetValidation();
        }
        this.dialogExito = true;
        this.$q.notify({
          type: 'positive',
          message: 'La solicitud se almacenó correctamente.',
          position: 'top-right',
          timeout: 2500
        });
      } catch (e) {
        var msgNoAlmacena =
          'No se pudo almacenar correctamente la información en el sistema.' +
          ' Verifique los datos obligatorios y su conexión; luego intente guardar nuevamente.' +
          ' Si la situación se repite, comuníquese con el área de sistemas.';
        this.$q.notify({
          type: 'negative',
          icon: 'error_outline',
          message: msgNoAlmacena,
          position: 'top-right',
          multiLine: true,
          timeout: 6500,
          actions: [{ label: 'Entendido', color: 'white' }]
        });
      }
    }
  }
};
</script>
