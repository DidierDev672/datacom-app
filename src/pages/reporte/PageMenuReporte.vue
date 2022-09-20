<template>
  <q-page>
    <div class="row">
      <div class="col-xs-12 col-sm-6 offset-sm-3">
        <div class="text-h6 q-px-xs q-py-md ">Reportes</div>

        <q-list padding bordered class="bg-white">
          <q-item
            v-for="reporte in lstReportes"
            :key="reporte.id"
            clickable
            :to="{ name: reporte.url }"
            v-ripple
            class="q-py-md"
          >
            <q-item-section avatar>
              <q-icon :name="reporte.categoriaReporte.icono" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{
                reporte.categoriaReporte.categoria
              }}</q-item-label>
              <q-item-label caption>{{ reporte.reporte }}</q-item-label>
            </q-item-section>
            <q-item-section avatar>
              <q-icon color="grey-6" name="ti-angle-right" />
            </q-item-section>
          </q-item>
        </q-list>

      </div>
    </div>
  </q-page>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "PageMenuReportes",
  data() {
    return {
      lstReportes: []
    };
  },
  created() {
    this.cargarListaReportesGeneralesAction().then(response => {
      this.lstReportes = response;
      console.log(response);
    });
  },
  methods: {
    ...mapActions("reportesGenerales", ["cargarListaReportesGeneralesAction"])
  }
};
</script>
