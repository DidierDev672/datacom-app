<template>
    <q-card>

      <q-card-section>
        <q-form class="q-gutter-md">
          <p>Datos del Servicio</p>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-select
                outlined
                option-value="id"
                option-label="nombre"
                v-model="servicio.tipoServicio"
                :options="tipoServiciosOptions"
                label="Seleccione un servicio"
              />
            </div>
          </div>

          <!-- <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-select
                outlined
                option-value="id"
                option-label="nombre"
                v-model="servicio.frecuenciaServicio"
                :options="frecuenciaServiciosOptions"
                label="Seleccione la frecuencia"
              />
            </div>
          </div> -->

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
      servicio: {},
      loading: false,
      tipoServiciosOptions: [],
      frecuenciaServiciosOptions: []
    };
  },
  created() {
    let categorias = [CATEGORIAS.SERVICIOS_DE_SALUD, CATEGORIAS.FRECUENCIA_SERVICIOS_SALUD];
    this.servicio = {
      id: 0,
      tipoServicio: '',
      frecuenciaServicio: ''
    };

    this.cargarListaParametroPorCategoriaAction(categorias).then(data => {
      //this.tipoServiciosOptions = data;
      console.log(data);
      data.map(opt => {
        if(opt.categoria.codigo === CATEGORIAS.SERVICIOS_DE_SALUD){
          this.tipoServiciosOptions.push(opt)
        }else{
          this.frecuenciaServiciosOptions.push(opt)
        }
      })
    });
  },
  methods: {
    ...mapActions("servicioInfrasalud", ["registrarServicioInfrasaludAction"]),
    ...mapActions("parametros", ["cargarListaParametroPorCategoriaAction"]),

    onSubmit() {
        this.loading = true
        let institucionID = this.getInfrasaludState.objInfrasalud.id

        if(institucionID > 0){
            let info = {
              ...this.servicio,
              infraestructuraSalud: {
                id: institucionID
              },
              usuarioCreacion: this.getUser,
              usuarioActualizacion: this.getUser
            };

            this.registrarServicioInfrasaludAction(info).then(data => {
                this.loading = false
                this.servicio.id = data
                this.$emit('guardar', this.servicio)
            })

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
    ...mapGetters("infrasalud", ["getInfrasaludState"]),
    ...mapGetters('auth', ['getUser'])
  }
};
</script>

<style></style>
