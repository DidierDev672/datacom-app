<template>
  <q-dialog
    persistent
    transition-show="scale"
    transition-hide="scale"
    v-model="show">
    <q-card style="width: 700px;">
      <q-card-section>
        <div class="text-h6">{{ mensajeBoton }} Cotratos Jac </div>
      </q-card-section>

      <q-separator />
      <q-card-section style="max-height: 50vh" class="scroll">

        <q-form
          class="q-gutter-md"
        >
          <p>Datos de Contratos Jac </p>
          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-select
                outlined
                option-value="id"
                option-label="nombre"
                v-model="contratosDB.tipoContrato"
                :options="options"
                label="Seleccione el tipo de participacion"
              />
            </div>
          </div>
          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-input
                outlined
                v-model="contratosDB.descripcion"
                label="Observacion"
              />
            </div>
          </div>
          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-input
                outlined
                v-model="contratosDB.fechaEjecucion"
                label="Fecha Ejecucion"
              />
            </div>
          </div>
          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-input
                outlined
                v-model="contratosDB.valor"
                label="valor"
              />
            </div>
          </div>
          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-input
                outlined
                v-model="contratosDB.entidad"
                label="entidad"
              />
            </div>
          </div>
          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-input
                outlined
                v-model="contratosDB.montoExcedente"
                label="Monto Excedente"
              />
            </div>
          </div>
          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-input
                outlined
                v-model="contratosDB.montoInversion"
                label="Monto Inversion"
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
          :disable="getContratosState.loading"
          @click="close" />
        <q-btn
          :label="mensajeBoton"
          color="primary"
          :loading="getContratosState.loading"
          :disable="getContratosState.loading"
          @click="onSubmit">
          <template v-slot:loading>
            <q-spinner-facebook />
          </template>
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import {CATEGORIAS} from "src/utils/config";
import {mapActions, mapGetters} from "vuex";

export default {
  name: "ContratosForm",
  data(){
    return {
      show: true,
      contratosDB: {},
      jacID: 0,
      options: [],

    }},
  created(){
    let categorias = [CATEGORIAS.TIPO_CONTRATO]
    this.jacID = this.$route.params.id
    this.contratosDB = {
      id: 0,
      tipoContrato:'',
      descripcion: '',
      fechaEjecucion: '',
      valor: 0,
      entidad: '',
      montoExcedente: 0,
      montoInversion: 0

    }
    if(Object.keys(this.getContratosState.objContratos).length > 0){
      this.contratosDB.id = this.getContratosState.objContratos.id;
      this.contratosDB.tipoParticipacion = this.getContratosState.objContratos.tipoContrato;
      this.contratosDB.observacion = this.getContratosState.objContratos.descripcion;
    }
    this.cargarListaParametroPorCategoriaAction(categorias).then(data => {
      this.options = data
    })

  },methods:{
    ...mapActions('contratos', ['registrarContratosAction', 'actualizarContratosAction','unsetContratosAction']),
    ...mapActions('parametros',['cargarListaParametroPorCategoriaAction']),
    onSubmit(){

      let info = {
        ...this.contratosDB,
        jac: {
          id: this.jacID
        }
      }

      if(info.id > 0){
        this.actualizarContratosAction(info).then(() => {

        })
      }else{
        this.registrarContratosAction(info).then( data => {
          this.contratosDB.id = data
        })
      }
    },
    close(){
      this.$emit("close");
    }
  },
  computed: {
    ...mapGetters('contratos', ['getContratosState']),
    mensajeBoton(){
      return this.contratosDB.id > 0 ? 'Actualizar' : 'Guardar'
    }
  },
  beforeDestroy(){
    this.unsetContratosAction()
  }
}
</script>

<style scoped>

</style>
