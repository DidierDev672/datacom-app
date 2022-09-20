<template>
  <div>
    <div class="text-h6 page-title-box" >Indicador: {{ actividad.indicador ? actividad.indicador.descripcion : '' }} - (Cal. {{ actividad.calificacion }})</div>
      <div class="bg-white q-ma-md q-pa-md">
        <q-form ref="actividadForm">
        <div class="row">
          <div class="col-xs-12">
            <p class="text-h6">Actividad *</p>
            <q-input
              outlined
              v-model="actividad.actividad"
              lazy-rules
              :rules="[val => !!val || 'Campo requerido']"
            />
          </div>
        </div>

        <div class="row q-col-gutter-sm">
          <div class="col-xs-4">
                  <p class="text-h6">Responsable *</p>
                  <q-input
                    outlined
                    v-model="actividad.responsable"
                    lazy-rules
                    :rules="[val => !!val || 'Campo requerido']"
                  />
          </div>
          <div class="col-xs-4">
                  <p class="text-h6">Cargo *</p>
                  <q-input
                    outlined
                    v-model="actividad.cargo"
                    lazy-rules
                    :rules="[val => !!val || 'Campo requerido']"
                  />
          </div>
          <div class="col-xs-4">
                  <p class="text-h6">Vencimiento *</p>
                  <q-input
                    outlined
                    v-model="actividad.fecha_vencimiento"
                    lazy-rules
                    :rules="[val => !!val || 'Campo requerido']"
                  />
          </div>
        </div>

        <div align="right">
            <q-btn @click="onSubmit" color="primary">Actualizar</q-btn>
          </div>

        </q-form>


      </div>
  </div>
</template>

<script>
import { mapActions, mapGetters} from 'vuex';
export default {
  data(){
    return {
      actividad: {},
      planId: 0
    }
  },

  created(){
    this.planId = this.$route.params.id;
    this.actividad = {
      id: this.$route.params.actividadId
    }

    this.buscarPlanTrabajoDetalleAction(this.actividad.id).then(response => {
      this.actividad = {
        ...this.actividad,
        indicador: response.indicador,
        calificacion: response.calificacion,
        cargo: response.cargo,
        actividad: response.actividad,
        responsable: response.responsable,
        fecha_vencimiento: response.fecha_vencimiento
      }
    })
  },

  methods: {
    ...mapActions('planTrabajoDetalle', ['buscarPlanTrabajoDetalleAction', 'actualizarPlanTrabajoDetalleAction']),
    onSubmit() {
      this.$refs.actividadForm.validate().then(success => {
        if (success) {
          console.log("Formulario: ", this.actividad);

          this.actualizarPlanTrabajoDetalleAction(this.actividad).then(data => {
            this.$q.notify({
              message: "Información actualizada correctamente",
              color: "positive"
            });
            this.$router.push({
              name: "PlanTrabajoActividadesIndex",
              params: { id: this.planId }
            });
          });
        } else {
          this.$q.notify({
            message: "Favor completar los campos correctamente",
            color: "red"
          });

        }

      });
    },
  }
};
</script>

<style lang="scss" scoped></style>
