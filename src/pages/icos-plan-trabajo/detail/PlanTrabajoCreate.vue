<template>
  <div class="q-ma-sm">
    <div class="row">
      <div class="col-xs-12 col-sm-6 offset-sm-3">
        <div v-if="step == 1">
          <q-form ref="planTrabajoForm">
            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Junta de Acción Comunal *</div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12">
                    <q-select
                      use-input
                      v-model="planTrabajo.jac"
                      option-label="jac"
                      option-value="id"
                      hint="Seleccione la organización"
                      :options="jacOptions"
                      @filter="filtrarJac"
                      @input="changeOrganizacion"
                      lazy-rules
                      :rules="[
                        val =>
                          (val != null && val.id > 0) ||
                          'Debe elegir una organizacion'
                      ]"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>
            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">
                  Descripción del plan de trabajo *
                </div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12">
                    <q-input
                      dense
                      v-model="planTrabajo.titulo"
                      lazy-rules
                      :rules="[val => !!val || 'Información requerida']"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">
                  Evaluaciones de la organización seleccionada
                </div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12">
                    <q-select
                      ref="evaluacionInput"
                      use-input
                      v-model="evaluacionSeleccionada"
                      option-label="descripcion"
                      option-value="id"
                      hint="Seleccione una evaluación"
                      :options="evaluacionesOptions"
                      lazy-rules
                      :rules="[
                        val =>
                          (val != null && val.id > 0) ||
                          'Debe elegir una evaluación'
                      ]"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </q-form>
        </div>

        <div class="flex justify-center">
          <q-btn
            label="Crear plan de trabajo"
            class="full-width"
            no-caps
            color="positive"
            @click="onSubmit"
          >
            <template v-slot:loading>
              <q-spinner-facebook />
            </template>
          </q-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      step: 1,
      planTrabajo: null,
      jacOptions: [],
      jacOptionsList: [],
      evaluacionSeleccionada: null,
      evaluacionesOptions: [],
      page: 0,
      rowsPerPage: 50,
      filter: ''
    };
  },
  created() {
    this.cargarListaJacInfoAction({
      page: this.page,
      rowsPerPage: this.rowsPerPage,
      filter: this.filter
    }).then(response => {
      this.jacOptionsList = response.data.content;
    });
    this.planTrabajo = {
      id: 0,
      jac: null,
      titulo: "",
      observacion: "",
      detalle: [],
      usuarioCreacion: this.getUser,
      usuarioActualizacion: this.getUser
    };
  },
  methods: {
    ...mapActions("jacInfo", ["cargarListaJacAction", "cargarListaJacInfoAction"]),
    ...mapActions("ico", ["buscarEvaluacionesPorJacAction"]),
    ...mapActions("planTrabajo", ["registrarPlanTrabajoAction"]),
    filtrarJac(val, update, abort) {

      console.log(val)
      if (val.length < 3) {
        abort()
        return
      }

      update(() => {
        const needle = val.toLowerCase();

        this.cargarListaJacInfoAction({
            page: this.page,
            rowsPerPage: this.rowsPerPage,
            filter: needle
          }).then(response => {

            this.jacOptions.splice(
              0,
              this.jacOptions.length,
              ...response.data.content
            );
        });


      });


    },
    changeOrganizacion(value) {
      // console.log(value.nombre);
      this.evaluacionSeleccionada = null;
      this.$refs.evaluacionInput.resetValidation();
      this.buscarEvaluacionesPorJacAction(value.id).then(data => {
        if (data.length <= 0) {
          this.evaluacionesOptions.push({
            id: 0,
            descripcion: "La organización no tiene evaluaciones"
          });
        } else {
          this.evaluacionesOptions = data;
        }
      });
    },
    onSubmit() {
      this.$refs.planTrabajoForm.validate().then(success => {
        if (success) {
          let indicadoreParaElPlanDeTrabajo = this.evaluacionSeleccionada.indicadores.filter(indicador => indicador.calificacion < 4);
          this.planTrabajo.detalle = indicadoreParaElPlanDeTrabajo.map(
            indi => {
              return {
                id: 0,
                plan: null,
                indicador: indi.indicador,
                cargo: null,
                calificacion: indi.calificacion,
                actividad: "",
                responsable: "",
                fecha_vencimiento: null
              };
            }
          );
          this.registrarPlanTrabajoAction(this.planTrabajo).then(response => {
            this.$q.notify({
            message: "Plan de trabajo registrado",
            position: "bottom-right",
            color: "green"
          });
            this.$router.push({ name: "PlanTrabajoActividadesIndex", params: { id: response }});
          });
        } else {
          this.$q.notify({
            message: "Favor completar los campos correctamente",
            position: "bottom-right",
            color: "red"
          });
        }
      });
    }
  },
  computed: {
    ...mapGetters("auth", ["getUser"]),
  }
};
</script>

<style lang="scss" scoped></style>
