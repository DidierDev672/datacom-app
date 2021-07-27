<template>
  <div>
    <q-table
      title="Relación de contratos y/o proyectos"
      :data="getContratosState.lista"
      :columns="columns"
      row-key="name"
      @row-click="seleccionar"
      :loading="getContratosState.loading"
      loading-label="Cargando información, por favor espere"
    >
      <template v-slot:top="props">
        <div class="col-8 q-table__title">
          10. Relación de contratos y/o proyectos
        </div>

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
      <q-btn fab icon="add" color="primary" @click="showContratoForm = true">
        <q-tooltip>
          Agregar nuevo registro
        </q-tooltip>
      </q-btn>
    </q-page-sticky>

    <contratos-form
      v-if="showContratoForm"
      @close="closeModal"
    ></contratos-form>
  </div>
</template>

<script>
// import ContratosCard from "components/mod-jac/contratos/ContratosCard";
import ContratosForm from "components/mod-jac/contratos/ContratosForm";
import { mapActions, mapGetters, mapMutations } from "vuex";
export default {
  name: "Contratos",
  components: { ContratosForm },
  data() {
    return {
      jacID: 0,
      showContratoForm: false,
      columns: [
        {
          name: "tipoContrato",
          align: "left",
          label: "Tipo",
          field: row => row.tipoContrato.nombre,
          sortable: true
        },
        {
          name: "descripcion",
          align: "left",
          label: "Nombre Proyecto/Contrato",
          field: "descripcion",
          sortable: true
        },
        {
          name: "fechaEjecucion",
          align: "left",
          label: "Fecha",
          field: "fechaEjecucion"
        },
        { name: "valor", align: "left", label: "Valor", field: "valor" },
        { name: "entidad", align: "left", label: "Entidad", field: "entidad" },
        {
          name: "montoExcedente",
          align: "left",
          label: "Monto excedente",
          field: "montoExcedente"
        },
        {
          name: "montoInversion",
          align: "left",
          label: "Monto inversión",
          field: "montoInversion"
        },
        { name: "acciones", label: "", field: "acciones" }
      ]
    };
  },
  created() {
    this.jacID = this.$route.params.id;

    if (this.jacID > 0) {
      this.cargarListaContratosAction(this.jacID);
    }
  },
  methods: {
    ...mapActions("contratos", ["cargarListaContratosAction"]),
    ...mapActions("parametros", ["cargarListaParametroPorCategoriaAction"]),
    ...mapMutations("contratos", ["setContratosSuccess"]),
    closeModal() {
      this.showContratoForm = false;
    },
    seleccionar(evt, row, index) {
      this.setContratosSuccess(row);
      this.showContratoForm = true;
    },
    onSubmit() {
      this.$router.push({ name: "c-salud", params: { id: this.jacID } });
    }
  },
  computed: {
    ...mapGetters("contratos", ["getContratosState"]),
    showBtnContinuar() {
      return this.getContratosState.lista.length > 0 ? true : false;
    }
  }
};
</script>

<style scoped></style>
