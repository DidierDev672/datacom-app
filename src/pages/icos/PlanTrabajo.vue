<template>
  <div class="q-pa-md" id="tabla_indicadores">
    <q-card class="my-card">
      <q-card-section>
        <div class="row items-center no-wrap">
          <div class="col">
            <div class="text-h6">Plan de Trabajo</div>
            <div class="text-subtitle2">
              {{ planTrabajo.titulo }}
            </div>
          </div>

          <div class="col-auto">
            <q-btn color="grey-7" round flat icon="more_vert">
              <q-menu cover auto-close>
                <q-list>
                  <q-item clickable @click="imprimir">
                    <q-item-section>Imprimir</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>
        </div>
      </q-card-section>

      <q-markup-table wrap-cells>
        <thead>
          <tr>
            <th class="text-center">Tema</th>
            <th class="text-lef">Indicador</th>
            <th class="text-center">Calificación</th>
            <th class="text-center">Actividad</th>
            <th class="text-center">Responsable</th>
            <th class="text-center">Cargo</th>
            <th class="text-center">Plazo</th>
            <th class="text-center"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="registro in planTrabajo.detalle"
            :key="registro.id"
          >
            <td class="text-left">{{ registro.indicador.tema.descripcion }}</td>
            <td class="text-left">{{ registro.indicador.descripcion }}</td>
            <td class="text-center">{{ registro.calificacion }}</td>
            <td class="text-center">{{ registro.actividad }}</td>
            <td class="text-center">{{ registro.responsable }}</td>
            <td class="text-center">{{ registro.cargo != null ? registro.cargo.nombre : '' }}</td>
            <td class="text-center">{{ registro.fecha_vencimiento }}</td>
            <td class="text-center">
              <q-btn flat round icon="edit" @click="editar(registro)"/>
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </q-card>
    <editar-actividad
      v-if="showEditarActividadDialog"
      @editar="editarRegistro"
      @close="closeDialog" />
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import print from "print-js";
import EditarActividad from "src/components/ico-plan-trabajo/EditarActividad.vue";

export default {
	components: { EditarActividad },

  data() {
    return {
      planTrabajoID: 0,
      planTrabajo: {},
      showEditarActividadDialog: false
    };
  },
  created() {
    this.planTrabajoID = this.$route.params.id;

    this.buscarPlanTrabajoAction(this.planTrabajoID).then(data => {
      this.planTrabajo = {...data};
    });
  },

  methods: {
    ...mapActions("planTrabajo", ['buscarPlanTrabajoAction']),
    ...mapMutations("planTrabajoDetalle", ['setPlanTrabajoDetalleSuccess']),
    editar(registro){
      this.setPlanTrabajoDetalleSuccess(registro)
      this.showEditarActividadDialog = true
    },
    editarRegistro(value){
      this.planTrabajo.detalle = this.planTrabajo.detalle.map(opt => {
        if(opt.id === value.id) return value
        return opt
      })
      this.showEditarActividadDialog = false
    },
    closeDialog(){
      this.showEditarActividadDialog = false
    },
    imprimir() {
      print("tabla_indicadores", "html");
    }
  }
};
</script>

<style></style>
