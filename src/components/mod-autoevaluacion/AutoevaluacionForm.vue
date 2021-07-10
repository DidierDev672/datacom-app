<template>
  <q-card flat bordered class="my-card q-mb-md">
    <q-card-section class="q-pb-none">
      <div class="text-h6 q-mb-none">
        {{ detalleAutoevaluacion.indicador.descripcion }}
      </div>
    </q-card-section>

    <q-card-section>
      <div class="row">
        <div class="col-xs-12 col-sm-6">
          <q-input
            outlined
            v-model.number="calificacion"
            label="Calificación"
            @input="actualizar"
          />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { date } from "quasar";
import { mapGetters, mapActions } from "vuex";
export default {
  props: {
    detalleAutoevaluacion: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      calificacion: ""
    };
  },
  methods: {
    ...mapActions("detalleAutoevaluacion", [
      "actualizarDetalleAutoevaluacionAction"
    ]),
    actualizar() {
      const fecha = date.formatDate(new Date(), "YYYY-MM-DDTHH:mm:ss.SSSZ");
      if (this.detalleAutoevaluacion.calificacion !== this.calificacion) {
        let detalle = {
          ...this.detalleAutoevaluacion,
          calificacion: this.calificacion,
          fechaActualizacion: fecha,
          usuarioActualizacion: this.getUser
        };
        this.actualizarDetalleAutoevaluacionAction(detalle).then(data => {
          this.$emit("actualizar", detalle);
        });
      }
    }
  },
  created() {
    this.calificacion = this.detalleAutoevaluacion.calificacion;
  },
  computed: {
    ...mapGetters("auth", ["getUser"])
  }
};
</script>

<style></style>
