<template>
  <q-dialog
    persistent
    transition-show="scale"
    transition-hide="scale"
    v-model="show">
      <q-card style="width: 700px;">
        <q-card-section>
          <div class="text-h6">{{ mensajeBoton }} Ecosistema</div>
        </q-card-section>

        <q-separator />

        <q-card-section style="max-height: 50vh" class="scroll">

          <q-form
            class="q-gutter-md"
          >

          <p>Datos del Ecosistema</p>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-select
                outlined
                option-value="id"
                option-label="nombre"
                v-model="ecosistema.tipoEcosistema"
                :options="tipoEcosistemaOptions"
                label="Seleccione el tipo de Ecosistema" />
            </div>
          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-input outlined v-model="ecosistema.nombre" label="Nombre del Ecosistema" />
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
            :disable="getEcosistemaState.loading"
            @click="close" />
          <q-btn
            :label="mensajeBoton"
            color="primary"
            :loading="getEcosistemaState.loading"
            :disable="getEcosistemaState.loading"
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
      ecosistema: {},
      encuestaID: 0,
      tipoEcosistemaOptions: []
    }
  },
  created(){
    let categorias = [CATEGORIAS.ECOSISTEMAS]
    this.encuestaID = this.$route.params.id
    this.ecosistema = {
      id: 0,
      tipoEcosistema: '',
      nombre:''
    }
    if(Object.keys(this.getEcosistemaState.objEcosistema).length > 0){
      this.ecosistema.id = this.getEcosistemaState.objEcosistema.id;
      this.ecosistema.tipoEcosistema = this.getEcosistemaState.objEcosistema.tipoEcosistema;
      this.ecosistema.nombre = this.getEcosistemaState.objEcosistema.nombre;
    }

    this.cargarListaParametroPorCategoriaAction(categorias).then(data => {
            this.tipoEcosistemaOptions = data
        })

  },
  methods: {
    ...mapActions('ecosistema', ['registrarEcosistemaAction', 'actualizarEcosistemaAction','unsetEcosistemaAction']),
    ...mapActions('parametros', ['cargarListaParametroPorCategoriaAction']),
    onSubmit(){

      let info = {
        ...this.ecosistema,
        encuesta: {
          id: this.encuestaID
        },
        usuarioCreacion: this.getUser,
        usuarioActualizacion: this.getUser
      }

      if(info.id > 0){
        //Actualizar
        info.usuarioCreacion = this.getEcosistemaState.objEcosistema.usuarioCreacion
        info.usuarioActualizacion= this.getUser
        console.log(info)
        this.actualizarEcosistemaAction(info).then(() => {
        })
      }else{
        //Guardar
        this.registrarEcosistemaAction(info).then( data => {
          this.ecosistema.id = data
        })
      }
    },
    close(){
      this.$emit("close");
    }
  },
  computed: {
    ...mapGetters('ecosistema', ['getEcosistemaState']),
    ...mapGetters('auth', ['getUser']),
    mensajeBoton(){
      return this.ecosistema.id > 0 ? 'Actualizar' : 'Guardar'
    }
  },
  beforeDestroy(){
    this.unsetEcosistemaAction()
  }


}
</script>

<style>

</style>
