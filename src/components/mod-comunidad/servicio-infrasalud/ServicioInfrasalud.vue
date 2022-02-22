<template>
  <q-dialog
    transition-show="scale"
    transition-hide="scale"
    @hide="close"
    v-model="show"
  >
    <q-card style="width: 700px;">
      <q-card-section>
        <div class="text-h6">Servicios de la Entidad de Salud</div>
      </q-card-section>

      <q-separator />

      <q-card-section style="max-height: 50vh" class="scroll">
        <q-btn
          v-if="showServiciosList"
          class="q-mb-sm"
          color="primary"
          label="Agregar servicio"
          @click="showServiciosList = false"
        />
        <!-- <q-btn v-else class="q-mb-sm" color="primary" label="Volver a la lista" @click="showPersonalList = true" /> -->

        <div v-if="showServiciosList">
          <q-markup-table>
            <thead>
              <tr>
                <th class="text-center">Servicio</th>
                <!-- <th class="text-center">Frecuencia</th> -->
                <th class="text-center"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="servicio in serviciosList" :key="servicio.id">
                <td>{{ servicio.tipoServicio.nombre }}</td>
                <!-- <td>{{ servicio.frecuenciaServicio.nombre }}</td> -->
                <td>
                  <q-btn
                    flat
                    round
                    icon="delete"
                    @click="eliminar(servicio.id)"
                    color="red"
                  />
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </div>

        <div v-else>
          <servicio-infrasalud-form
            @close="showServiciosList = true"
            @guardar="agregar"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
// import PersonasList from "src/components/mod-comunidad/personas-institucion-educativa/PersonasList.vue"
import ServicioInfrasaludForm from "src/components/mod-comunidad/servicio-infrasalud/ServicioInfrasaludForm.vue";
export default {
  components: { ServicioInfrasaludForm },
  data() {
    return {
      show: true,
      showServiciosList: true,
      serviciosList: []
    };
  },
  created() {
    if (this.getInfrasaludState.objInfrasalud.id > 0) {
      //llamar al metodo que trae la lista de personal
      let institucionID = this.getInfrasaludState.objInfrasalud.id;
      this.cargarListaServicioInfrasaludAction(institucionID).then(data => {
        this.serviciosList = [...data];
      });
    }
  },
  methods: {
    ...mapActions("infrasalud", [
      "cargarListaServicioInfrasaludAction",
      "unsetInfrasaludAction"
    ]),
    ...mapActions("servicioInfrasalud", ["eliminarServicioInfrasaludAction"]),
    close() {
      this.$emit("close");
    },
    agregar(value) {
      console.log("Value: ", value);
      this.serviciosList.unshift(value);
      this.showServiciosList = true;
    },
    eliminar(servicioID) {
      this.eliminarServicioInfrasaludAction(servicioID).then(data => {
        //Data = true / False
        if (data) {
          this.serviciosList = this.serviciosList.filter(
            opt => opt.id != servicioID
          );
        } else {
          console.log("No se pudo eliminar el servicio");
        }
      });
    }
  },
  computed: {
    ...mapGetters("infrasalud", ["getInfrasaludState"])
  },
  beforeDestroy() {
    this.unsetInfrasaludAction();
  }
};
</script>

<style></style>
