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

<q-card-actions align="right">
  <q-btn
    flat
    label="Cancelar"
    color="primary"
    :disable="loading"
    @click="close"
  />
  <q-btn
    label="Guardar"
    color="primary"
    :loading="loading"
    :disable="loading"
    @click="onSubmit"
  >
    <template v-slot:loading>
      <q-spinner-facebook />
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

</style>
