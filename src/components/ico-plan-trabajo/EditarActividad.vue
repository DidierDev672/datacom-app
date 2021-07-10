<template>
  <q-dialog
    persistent
    transition-show="scale"
    transition-hide="scale"
    v-model="show"
  >
    <q-card style="width: 700px;">
      <q-card-section>
        <div class="text-h6">Editar Actividad</div>
        <div class="text-subtitle2">{{ actividad.indicador.descripcion }}</div>
      </q-card-section>

      <q-separator />
      <q-card-section style="max-height: 50vh" class="scroll">
        <q-form class="q-gutter-md">
          <p>Datos de la Actividad</p>
          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-input
                outlined
                type="textarea"
                v-model="actividad.actividad"
                label="Describa la Actividad"
              />
            </div>
          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12 col-sm-6">
              <q-input
                outlined
                v-model="actividad.responsable"
                label="Responsable de ejecutar la actividad"
              />
            </div>
            <div class="col-xs-12 col-sm-6">
              <!-- <q-input
                outlined
                v-model="actividad.cargo"
                label="Cargo del responsable"
              /> -->
              <q-select
                outlined
                option-value="id"
                option-label="nombre"
                v-model="actividad.cargo"
                :options="cargosOptions"
                label="Seleccione el cargo"
              />
            </div>
          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-input
                outlined
                v-model="actividad.fecha_vencimiento"
                label="Fecha de vencimiento"
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
          :disable="getPlanTrabajoDetalleState.loading"
          @click="close"
        />
        <q-btn
          label="Editar"
          color="primary"
          :loading="getPlanTrabajoDetalleState.loading"
          :disable="getPlanTrabajoDetalleState.loading"
          @click="onSubmit"
        >
          <template v-slot:loading>
            <q-spinner-facebook />
          </template>
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { date } from "quasar";
import { mapGetters, mapActions } from "vuex";
import { CATEGORIAS } from "src/utils/config";
export default {
  name: "EditarActividad",
  data() {
    return {
      show: true,
      actividad: {},
      actividadID: 0,
      cargosOptions: []
    };
  },
  created() {
    this.actividadID = this.$route.params.id;
    let categorias = [CATEGORIAS.CARGOS];
    this.cargarListaParametroPorCategoriaAction(categorias).then(data => {
      this.cargosOptions = data;
    });
    this.actividad = {
      id: 0,
      calificacion: "",
      indicador: "",
      plan: "",
      actividad: "",
      responsable: "",
      cargo: "",
      fecha_vencimiento: ""
    };

    if (
      Object.keys(this.getPlanTrabajoDetalleState.objPlanTrabajoDetalle)
        .length > 0
    ) {
      this.actividad.id = this.getPlanTrabajoDetalleState.objPlanTrabajoDetalle.id;
      this.actividad.calificacion = this.getPlanTrabajoDetalleState.objPlanTrabajoDetalle.calificacion;
      this.actividad.indicador = this.getPlanTrabajoDetalleState.objPlanTrabajoDetalle.indicador;
      this.actividad.plan = this.getPlanTrabajoDetalleState.objPlanTrabajoDetalle.plan;
      this.actividad.actividad = this.getPlanTrabajoDetalleState.objPlanTrabajoDetalle.actividad;
      this.actividad.responsable = this.getPlanTrabajoDetalleState.objPlanTrabajoDetalle.responsable;
      this.actividad.cargo = this.getPlanTrabajoDetalleState.objPlanTrabajoDetalle.cargo;
      this.actividad.fecha_vencimiento = this.getPlanTrabajoDetalleState.objPlanTrabajoDetalle.fecha_vencimiento;
    }
  },
  methods: {
    ...mapActions("planTrabajoDetalle", [
      "buscarPlanTrabajoDetalleAction",
      "actualizarPlanTrabajoDetalleAction",
      "unsetPlanTrabajoDetalleAction"
    ]),
    ...mapActions("parametros", ["cargarListaParametroPorCategoriaAction"]),
    onSubmit() {
      const fecha = date.formatDate(new Date(), "YYYY-MM-DDTHH:mm:ss.SSSZ");
      this.actualizarPlanTrabajoDetalleAction({
        ...this.actividad,
        fechaActualizacion: fecha,
        usuarioActualizacion: this.getUser
      }).then(data => {
        this.$emit("editar", this.actividad);
      });
    },
    close() {
      this.$emit("close");
    }
  },
  computed: {
    ...mapGetters("planTrabajoDetalle", ["getPlanTrabajoDetalleState"]),
    ...mapGetters("auth", ["getUser"])
  },
  beforeDestroy() {
    this.unsetPlanTrabajoDetalleAction();
  }
};
</script>

<style scoped></style>
