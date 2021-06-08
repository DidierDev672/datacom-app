<template>
  <q-page class="q-pa-md">
  <q-card >
    <q-card-section>
      <div class="text-h6">{{ mensajeBoton }} Parametro</div>
    </q-card-section>
    <q-card-section style="max-height: 50vh" class="scroll">
      <q-form class="q-gutter-md"  @submit="onSubmit"  ref="ParametroForm">
        <div class="row q-col-gutter-sm">
          <div class="col-xs-12">
            <q-select
              outlined
              option-value="id"
              option-label="descripcion"
              v-model="objParametro.categoria"
              :options="lstCategoria"
              label="Seleccione el tipo de categoria" />
          </div>
        </div>
        <div class="row q-col-gutter-sm">
          <div class="col-xs-12">
            <q-input
              outlined
              v-model="objParametro.codigo"
              label="Codigo"
            />
          </div>
        </div>
        <div class="row q-col-gutter-sm">
          <div class="col-xs-12">
            <q-input
              outlined
              v-model="objParametro.nombre"
              label="Nombre"
            />
          </div>
        </div>
        <div class="flex justify-end">
          <q-btn :to="{name: 'parametros'}" label="Cancelar" flat class="q-mr-sm" />
          <q-btn
            :label="mensajeBoton"
            type="submit"
            color="primary"
            :loading="getParametroState.loading"
            outline >
            <template v-slot:loading>
              <q-spinner-facebook />
            </template>
          </q-btn>
        </div>
      </q-form>
    </q-card-section>
    <q-separator />
  </q-card>
  </q-page>
</template>

<script>
import {mapGetters, mapActions, mapMutations} from 'vuex';
export default {

  name: "PageParametro",
  data(){
    return {
      lstCategoria: [],
      objParametro: {},
      mensajeBoton: 'Guardar'
    }

  },
  created() {
    this.cargarListaCategoriasAction().then( response =>{
      this.lstCategoria = [...response]
    })
   if(this.$route.params.id != null) {
     this.objParametro = {
       ...this.getParametroPorId(this.$route.params.id)
     },
       this.mensajeBoton = 'Actualizar'
   }else{
     this.objParametro= {
       codigo: '',
       nombre: '',
       categoria: {
         codigo: '',
         descripcion: '',
         estado: true
       },
       estado: true
     }
   }
  },
  methods:{
    ...mapActions('parametros', ['actualizarParametroAction','registrarParametroAction']),
    ...mapActions('categoria', ['cargarListaCategoriasAction']),
    ...mapMutations('parametros',['setParametroSuccess']),
    ...mapMutations('categoria', ['setCategoriaSuccess']),
    onSubmit () {
      if (this.objParametro.id > 0) {
        this.actualizarParametroAction(this.objParametro).then(data => {
          this.$q.notify({
            message: 'Registro actualizado correctamente.',
            icon: 'ti-check',
            textColor: 'white',
            color: 'positive',
            position: 'bottom-right'
          })
        })
      } else {
        this.registrarParametroAction(this.objParametro)
          .then(data => {
            this.$q.notify({
              message: 'Registro agregado correctamente.',
              icon: 'ti-check',
              textColor: 'white',
              color: 'positive',
              position: 'bottom-right'
            })
            this.$router.push({ name: 'parametros' })
          })
          .catch(error => {
            if (!navigator.onLine && this.backgroundSyncSupported) {
              //redirigir al listado de categorias
              this.$q.notify({
                message: 'Categoria registrada offLine.',
                icon: 'ti-check',
                textColor: 'white',
                color: 'dark',
                position: 'bottom-right'
              })
            }
            else {
              this.$q.dialog({
                title: 'Alert',
                message: 'Ha ocurrido un error al grabar el registro: ' + error
              })
            }
          })
      }
    },


  },
  computed: {
    ...mapGetters('parametros', ['getParametroState','getParametroPorId']),
    categoriaFormValid () {
      return this.$refs.parametroForm.validate()
    }
  },
  beforeDestroy() {

  }
}
</script>

<style scoped>

</style>
