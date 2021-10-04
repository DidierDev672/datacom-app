<template>
  <div class="q-ma-sm">
    <div class="text-h6 text-center q-px-xs q-py-md " v-if="evaluacion.jac">
      {{ evaluacion.jac.nombre }}
    </div>
    <div class="q-px-xs q-mb-md text-center">
      Evaluación realizada el {{ evaluacion.fechaCreacion }} y el puntaje
      obtenido fue: {{ evaluacion.calificacion }}
    </div>
    <q-card
      flat
      bordered
      class="my-card bg-grey-1 q-mb-sm"
      v-for="tema in temas"
      :key="tema.id"
    >
      <q-card-section class="q-pb-none">
        <div class="row items-center no-wrap">
          <div class="col">
            <div class="text-h6">{{ tema.tema }}</div>
          </div>
          <div class="col-auto">
            <q-btn color="grey-7" round :label="tema.calificacionTotal">
            </q-btn>
          </div>
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none" v-if="tema.indicadores.length > 0">
        <q-list>
          <q-item
            clickable
            v-ripple
            v-for="indicador in tema.indicadores"
            :key="indicador.id"
          >
            <q-item-section>{{
              indicador.indicador.descripcion
            }}</q-item-section>
            <q-item-section avatar>
              <q-item-label caption>{{ indicador.calificacion }}</q-item-label>
              <!-- <q-badge color="primary" :label="indicador.calificacion" /> -->
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { log } from "util";
export default {
  data() {
    return {
      evaluacionID: 0,
      evaluacion: [],
      areas: [],
      indicadores: [],
      countTemas: 0,
      calificacionTema: 0,
      tema: "",
      temas: [],
      registro: null,
      temasArray: []
    };
  },
  created() {
    this.evaluacionID = this.$route.params.id;
    this.buscarIcoAction(this.evaluacionID).then(data => {
      this.evaluacion = data;
      console.log("data: ", data);
      this.registro = data.indicadores["0"];

      this.tema = this.registro.indicador.tema;
      this.temasArray.push(this.tema);
      data.indicadores.forEach(indicador => {
        // this.temasArray.push(this.tema);
        if (indicador.indicador.tema.id !== this.tema.id) {
          this.temasArray.push(indicador.indicador.tema);
          this.tema = indicador.indicador.tema;
        }
      });

      this.temasArray.forEach(tema => {
        this.countTemas = 0;
        this.calificacionTema = 0;
        this.indicadores = data.indicadores.filter(indicador => {
          // console.log("Quien es indicador: ", indicador);
          if (indicador.indicador.tema.id === tema.id) {
            return { indi: indicador.id };
          }
        });
        this.calificacionTema = 0;
        this.indicadores.forEach(ind => {
          this.calificacionTema += ind.calificacion;
        });

        this.temas.push({
          tema: tema.descripcion,
          indicadores: this.indicadores,
          noIndicadores: this.indicadores.length,
          calificacionTotal: this.calificacionTema / this.indicadores.length
        });
      });
    });
  },
  methods: {
    ...mapActions("ico", ["buscarIcoAction"])
  },
  computed: {
    ...mapGetters("ico", ["getIcoState"])
  }
};
</script>

<style lang="scss" scoped></style>
