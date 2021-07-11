<template>
  <q-dialog
    persistent
    transition-show="scale"
    transition-hide="scale"
    v-model="show">
      <q-card style="width: 700px;">
        <q-card-section>
          <div class="text-h6">{{ mensajeBoton }} Infraestructura de Salud</div>
        </q-card-section>

        <q-separator />

        <q-card-section style="max-height: 50vh" class="scroll">

          <q-form
            class="q-gutter-md"
          >

          <p>Datos de la Infraestructura</p>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-select
                outlined
                option-value="id"
                option-label="nombre"
                v-model="infrasalud.tipoInfraestructura"
                :options="tipoInfrasaludOptions"
                label="Seleccione el tipo de Infrasalud" />
            </div>
          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-input outlined v-model="infrasalud.areaConstruida" label="Área Construida" />
            </div>
          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-input outlined v-model="infrasalud.areaTotal" label="Área Total" />
            </div>
          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-input outlined v-model="infrasalud.telefono" label="Teléfono" />
            </div>
          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-input outlined v-model="infrasalud.celular" label="Celular" />
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
            :disable="getInfrasaludState.loading"
            @click="close" />
          <q-btn
            :label="mensajeBoton"
            color="primary"
            :loading="getInfrasaludState.loading"
            :disable="getInfrasaludState.loading"
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
import { mapGetters, mapActions } from 'vuex'
import { CATEGORIAS } from '../../utils/config'
export default {
  data(){
    return {
      show: true,
      infrasalud: {},
      encuestaID: 0,
      tipoInfrasaludOptions: []
    }
  },
  created(){
    let categorias = [CATEGORIAS.INFRASALUD]
    this.encuestaID = this.$route.params.id
    this.infrasalud = {
      id: 0,
      tipoInfraestructura: '',
      areaConstruida:'',
      areaTotal: '',
      telefono: '',
      celular: '',
      radioTelefono: ''
    }
    if(Object.keys(this.getInfrasaludState.objInfrasalud).length > 0){
      this.infrasalud.id = this.getInfrasaludState.objInfrasalud.id;
      this.infrasalud.tipoInfraestructura = this.getInfrasaludState.objInfrasalud.tipoInfraestructura;
      this.infrasalud.areaConstruida = this.getInfrasaludState.objInfrasalud.areaConstruida;
      this.infrasalud.areaTotal = this.getInfrasaludState.objInfrasalud.areaTotal;
      this.infrasalud.telefono = this.getInfrasaludState.objInfrasalud.telefono;
      this.infrasalud.radioTelefono = this.getInfrasaludState.objInfrasalud.radioTelefono;
      this.infrasalud.celular = this.getInfrasaludState.objInfrasalud.celular;
    }

    this.cargarListaParametroPorCategoriaAction(categorias).then(data => {
            this.tipoInfrasaludOptions = data
        })

  },
  methods: {
    ...mapActions('infrasalud', ['registrarInfrasaludAction', 'actualizarInfrasaludAction','unsetInfrasaludAction']),
    ...mapActions('parametros', ['cargarListaParametroPorCategoriaAction']),
    onSubmit(){

      let info = {
        ...this.infrasalud,
        encuesta: {
          id: this.encuestaID
        },
        usuarioCreacion: this.getUser,
        usuarioActualizacion: this.getUser

      }

      if(info.id > 0){
        //Actualizar
        info.usuarioCreacion = this.getInfrasaludState.usuarioCreacion
        this.actualizarInfrasaludAction(info).then(() => {
        })
      }else{
        //Guardar
        this.registrarInfrasaludAction(info).then( data => {
          this.infrasalud.id = data
        })
      }
    },
    close(){
      this.$emit("close");
    }
  },
  computed: {
    ...mapGetters('infrasalud', ['getInfrasaludState']),
    ...mapGetters('auth', ['getUser']),
    mensajeBoton(){
      return this.infrasalud.id > 0 ? 'Actualizar' : 'Guardar'
    }
  },
  beforeDestroy(){
    this.unsetInfrasaludAction()
  }


}
</script>

<style>

</style>
