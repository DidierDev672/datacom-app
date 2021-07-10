<template>
  <div>
    
    <q-table
      title="Relación de proyectos productivos"
      :data="getProyectosProductivosState.lista"
      :columns="columns"
      row-key="name"
      @row-click="seleccionar"
      :loading="getProyectosProductivosState.loading"
      loading-label="Cargando información, por favor espere"
    >
      <template v-slot:top="props">
        <div class="col-8 q-table__title">Relación de proyectos productivos</div>

        <q-space />
        <q-btn
          flat
          round
          dense
          :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
          @click="props.toggleFullscreen"
          class="q-ml-md"
        />
      </template>

      <q-td slot="body-cell-acciones" slot-scope="props" :props="props">
        <q-btn flat round icon="edit" />
      </q-td>
    </q-table>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="primary" @click="showProyectoProductivoForm = true">
        <q-tooltip>
          Agregar nuevo registro
        </q-tooltip>
      </q-btn>
    </q-page-sticky>

    <proyectos-productivos-form v-if="showProyectoProductivoForm" @close="closeModal"></proyectos-productivos-form>

  </div>
</template>

<script>
// import ProyectosProductivosCard from "components/mod-jac/ProyectosProductivos/ProyectosProductivosCard";
import ProyectosProductivosForm from "components/mod-jac/ProyectosProductivos/ProyectosProductivosForm";
import {mapActions, mapGetters, mapMutations} from "vuex";
export default {
  name: "ProyectosProductivos",
  components: {ProyectosProductivosForm},
  data() {
    return {
      jacID: 0,
      showProyectoProductivoForm: false,
      columns: [
        { name: "linea", align: "left", label: "Línea", field: row => row.linea.nombre, sortable: true },
        { name: "descripcion", align: "left", label: "Nombre Proyecto/Contrato", field: 'descripcion', sortable: true },
        { name: "avaluo",  align: "left", label: "Avalúo", field: "avaluo" },       
        { name: "acciones", label: "", field: "acciones" }
      ]
    }
  }, created() {
    this.jacID = this.$route.params.id

    if(this.jacID > 0){
      this.cargarListaProyectosProductivosAction(this.jacID)
    }
  },methods: {
    ...mapActions('proyectosProductivos', ['cargarListaProyectosProductivosAction']),
    ...mapActions('parametros', ['cargarListaParametroPorCategoriaAction']),
    ...mapMutations('proyectosProductivos', ['setProyectosProductosSuccess']),
    closeModal(){
      this.showProyectoProductivoForm = false
    },
    seleccionar(evt, row, index){
      this.setProyectosProductosSuccess(row)
      this.showProyectoProductivoForm = true
    },
  },
  computed: {
    ...mapGetters('proyectosProductivos', ['getProyectosProductivosState']),
    showBtnContinuar(){
      return this.getProyectosProductivosState.lista.length > 0 ? true : false
    }
  }
}
</script>

<style scoped>

</style>
