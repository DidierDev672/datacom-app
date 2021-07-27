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
                v-model="persona.cargo"
                :options="cargosOptions"
                label="Seleccione el cargo"
              />
            </div>
          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-input
                outlined
                v-model="persona.nombre"
                label="Nombre"
              />
            </div>
          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-input
                outlined
                v-model="persona.primerApellido"
                label="Primer Apellido"
              />
            </div>
          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-input
                outlined
                v-model="persona.segundoApellido"
                label="Segundo Apellido"
              />
            </div>
          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-input
                outlined
                v-model="persona.direccion"
                label="Dirección"
              />
            </div>
          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-input
                outlined
                v-model="persona.telefono"
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
import { mapGetters, mapActions } from "vuex";
import { CATEGORIAS } from "../../../utils/config";
export default {
  data() {
    return {
      show: true,
      persona: {},
      loading: false,
      cargosOptions: []
    };
  },
  created() {
    let categorias = [CATEGORIAS.CARGOS];
    this.persona = {
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
    ...mapActions("personalInfrasalud", ["registrarPersonalInfrasaludAction"]),
    ...mapActions("parametros", ["cargarListaParametroPorCategoriaAction"]),

    onSubmit() {
        this.loading = true
        let institucionID = this.getInfrasaludState.objInfrasalud.id


        if(institucionID > 0){
          if(this.persona.cargo.id > 0){
            let info = {
              ...this.persona,
              infraestructuraSalud: {
                id: institucionID
              },
              usuarioCreacion: this.getUser,
              usuarioActualizacion: this.getUser

            };

            this.registrarPersonalInfrasaludAction(info).then(data => {
                this.loading = false
                this.persona.id = data
                this.$emit('guardar', this.persona)
            })
          }else{
            this.$q.notify({
              message: 'Debe seleccionar un cargo',
              color: 'red'
            })
            this.loading = false
          }

        }else{
            this.loading = false
            console.log('No hay institución educativa');
        }

    },

    close() {
      this.$emit("close");
    }
  },
  computed: {
      ...mapGetters('infrasalud', ['getInfrasaludState'])
  }
};
</script>

<style></style>
