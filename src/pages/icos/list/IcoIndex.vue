<template>
  <div>
    <q-table
      title="Evaluaciones Ico"
      :data="getIcoState.lista"
      :columns="columns"
      row-key="name"
      @row-click="seleccionar"
      wrap-cells
      :loading="getIcoState.loading"
      loading-label="Cargando información, por favor espere"
    >
      <template v-slot:top="props">
        <div class="col-8 q-table__title">Evaluaciones Ico</div>

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

      <q-td slot="body-cell-descripcion" slot-scope="props" :props="props">
        {{ props.row.descripcion }}
        <q-badge v-if="props.row.offline" color="orange" label="OffLine" />
      </q-td>
    </q-table>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="primary" :to="{ name: 'IcoCreate' }">
        <q-tooltip>
          Agregar Organización
        </q-tooltip>
      </q-btn>
    </q-page-sticky>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import { TIPO_ENCUESTA } from "src/utils/config";
import { openDB } from "idb";
export default {
  name: "IcoList",
  data() {
    return {
      columns: [
        {
          name: "descripcion",
          align: "left",
          label: "Evaluación",
          field: "descripcion"
        },
        {
          name: "organizacion",
          align: "left",
          label: "Organización",
          field: "organizacion"
        },
        {
          name: "calificacion",
          align: "left",
          label: "Puntaje",
          field: "calificacion"
        }
      ]
    };
  },
  created() {},
  methods: {
    seleccionar(evt, row, index) {
      console.log("jacInfo: ", row);
      // let jacID = row.id;
      this.$router.push({ name: "IcoView", params: { id: row.id } });
    }
  },
  computed: {
    ...mapGetters("ico", ["getIcoState"])
  }
};
</script>

<style scoped lang="sass">
.jac-creada-offline
  tbody tr
    background-color: #c1f4cd
</style>
