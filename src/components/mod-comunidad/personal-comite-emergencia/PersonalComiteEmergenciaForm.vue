<template>
<q-card>

<q-card-section>
  <q-form class="q-gutter-md">
    <p>Datos de la persona</p>

    <div class="row q-col-gutter-sm">
      <div class="col-xs-12">
        <q-select
          outlined
          option-value="id"
          option-label="nombre"
          v-model="personalComiteEmergencia.tipoCargo"
          :options="cargosOptions"
          label="Seleccione el cargo"
        />
      </div>
    </div>

    <div class="row q-col-gutter-sm">
      <div class="col-xs-12">
        <q-input
          outlined
          v-model="personalComiteEmergencia.nombre"
          label="Nombre"
        />
      </div>
    </div>

    <div class="row q-col-gutter-sm">
      <div class="col-xs-12">
        <q-input
          outlined
          v-model="personalComiteEmergencia.primerApellido"
          label="Primer Apellido"
        />
      </div>
    </div>

    <div class="row q-col-gutter-sm">
      <div class="col-xs-12">
        <q-input
          outlined
          v-model="personalComiteEmergencia.segundoApellido"
          label="Segundo Apellido"
        />
      </div>
    </div>

    <!-- <div class="row q-col-gutter-sm">
      <div class="col-xs-12">
        <q-input
          outlined
          v-model="personalComiteEmergencia.direccion"
          label="Dirección"
        />
      </div>
    </div> -->

    <div class="row q-col-gutter-sm">
      <div class="col-xs-12">
        <q-input
          outlined
          v-model="personalComiteEmergencia.telefono"
          label="Teléfono"
        />
      </div>
    </div>

  </q-form>
</q-card-section>

<q-separator />

<q-card-actions align="right" class="action-buttons">
  <q-btn
    class="btn-secundario"
    unelevated
    label="Cancelar"
    :disable="loading"
    @click="close"
  />
  <q-btn
    class="btn-primario"
    unelevated
    label="Guardar"
    :loading="loading"
    :disable="loading"
    @click="onSubmit"
  >
    <template v-slot:loading>
      ⏳ Guardando...
    </template>
  </q-btn>
</q-card-actions>
</q-card>
  </template>
<script>
import {mapGetters, mapActions} from "vuex";
import { CATEGORIAS } from "../../../utils/config";


export default {
  name: "PersonalComiteEmergenciaForm",
  data() {
    return {
      show: true,
      personalComiteEmergencia: {},
      loading: false,
      cargosOptions: []
    };
  },
  created() {
    let categorias = [CATEGORIAS.CARGOS];
    this.personalComiteEmergencia = {
      id: 0,
      nombre: '',
      primerApellido: '',
      segundoApellido: '',
      direccion: '',
      telefono: '',
      cargo: ''
    };

    this.cargarListaParametroPorCategoriaAction(categorias).then(data => {
      this.cargosOptions = data;
    });
  },
  methods: {
    ...mapActions ("personalComiteEmergencia", ["registrarPersonalComiteEmergenciaAction"]),
    ...mapActions("parametros", ["cargarListaParametroPorCategoriaAction"]),

    onSubmit() {
      this.loading = true
      let comiteEmergenciaID = this.getComiteEmergenciaState.objComiteEmergencia.id

      if(comiteEmergenciaID > 0){
        let info = {
          ...this.personalComiteEmergencia,
          comiteEmergencia: {
            id: comiteEmergenciaID
          },
          usuarioCreacion: this.getUser,
          usuarioActualizacion: this.getUser
        };

        this.registrarPersonalComiteEmergenciaAction(info).then(data => {
          this.loading = false
          this.personalComiteEmergencia.id = data
          console.log(data)
          this.$emit('guardar', this.personalComiteEmergencia)
        })

      }else{
        this.loading = false
        console.log('No hay comite de emergencia');
      }

    },

    close() {
      this.$emit("close");
    }
  },
  computed: {
    ...mapGetters('comiteEmergencia', ['getComiteEmergenciaState']),
    ...mapGetters('auth', ['getUser']),
  }
}
</script>

<style scoped>
/* Espaciado entre botones */
.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

/* --- TAMAÑO IDEAL Y TIPOGRAFÍA DE BOTÓN --- */
::v-deep .btn-primario, 
::v-deep .btn-secundario {
  height: 48px !important;
  padding: 0 16px !important;
  border-radius: 8px !important;
  min-width: 120px !important;
  font-size: 16px !important;
  font-weight: 600 !important;
  text-transform: none !important; /* Texto claro sin mayúsculas forzadas */
}

::v-deep .btn-primario .q-btn__content,
::v-deep .btn-secundario .q-btn__content {
  letter-spacing: normal !important;
}

/* --- BOTÓN PRIMARIO --- */
::v-deep .btn-primario {
  background: #2563EB !important;
  color: white !important;
  transition: all 0.2s ease;
}

::v-deep .btn-primario:hover:not(.disabled) {
  background: #1D4ED8 !important;
}

::v-deep .btn-primario:focus-visible,
::v-deep .btn-primario:focus {
  box-shadow: 0 0 0 2px rgba(37,99,235,0.3) !important;
}

/* --- BOTÓN SECUNDARIO --- */
::v-deep .btn-secundario {
  background: transparent !important;
  border: 1px solid #D1D5DB !important;
  color: #374151 !important;
  transition: all 0.2s ease;
}

::v-deep .btn-secundario:hover:not(.disabled) {
  background: #F3F4F6 !important;
}

/* --- ESTADO DESHABILITADO / LOADING --- */
::v-deep .q-btn.disabled,
::v-deep .btn-primario.disabled,
::v-deep .btn-secundario.disabled {
  background: #E5E7EB !important;
  color: #9CA3AF !important;
  border: none !important;
  cursor: not-allowed !important;
  opacity: 1 !important; /* Quasar usa opacity por defecto, lo restablecemos a 1 para colores fijos exactos */
}
</style>
