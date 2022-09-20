<template>
  <div>
    <div class="bg-white q-ma-md q-pa-md">
      <q-form ref="actividadForm">
        <div class="row q-col-gutter-sm">
          <div class="col-xs-12">
            <p class="text-h6">Indicador *</p>
             <q-select
               v-model="actividad.indicador"
               :options="indicadores"
               outlined
               option-label="descripcion"
               option-value="id" />
          </div>
        </div>

        <div class="row q-col-gutter-sm">
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
          <q-btn @click="onSubmit" color="primary">Registrar</q-btn>
        </div>

      </q-form>
    </div>

  </div>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  data () {
    return {
      planID: 0,
      actividad: {},
      indicadores: []
    }
  },
  created () {
    this.planID = this.$route.params.id;
    this.actividad = {
      id: 0,
      indicador: '',
      calificacion: '',
      cargo: '',
      actividad: '',
      responsable: '',
      fecha_vencimiento: '',
      plan: {
        id: this.planID
      }
    },
    this.cargarListaIndicadoresAction().then( data => {
      this.indicadores = data
    });
  },
  methods: {
    ...mapActions('indicadores', ['cargarListaIndicadoresAction']),
    onSubmit() {
    console.log(this.actividad)
  }
  }
};
</script>

<style lang="scss" scoped></style>
