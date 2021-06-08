<template>
  <div>
  <q-list bordered class="rounded-borders bg-white">
    <q-item>
      <q-item-section top>

      </q-item-section>
      <q-item-section side top>
        <div class="text-grey-8 ">
          <q-btn size="12px" flat dense round icon="more_vert" >
            <q-menu cover auto-close>
              <q-list>
                <q-item clickable @click="editar">
                  <q-item-section>Editar información</q-item-section>
                </q-item>
                <q-item clickable @click="agregarPersonal">
                  <q-item-section>Agregar Personal</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-item-section>
    </q-item>
    <q-item >
      <q-item-section top>
        <q-item-label caption lines="1">
          Nombre del Comite De Emergencia
        </q-item-label>
        <q-item-label lines="1">
          <span class="text-weight-medium">{{ comiteEmergencia.nombreComite }}</span>
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
  <personal-comite-emergencia @close="closedModal" v-if="showPersonalDialog"></personal-comite-emergencia>
  </div>
</template>

<script>
import PersonalComiteEmergencia from "src/components/mod-comunidad/personal-comite-emergencia/PersonalComiteEmergencia.vue"
import {mapActions, mapMutations} from "vuex";
export default {
  name: "ComiteEmergenciaCard",
  props: {
    comiteEmergencia: {
      type: Object,
      required: true
    }
  }, components: {PersonalComiteEmergencia},
  data(){
    return {
      showPersonalDialog: false
    }
  },
  methods: {
    ...mapMutations('comiteEmergencia', ['setComiteEmergenciaSuccess']),

    editar(){
      this.$emit("editar", this.comiteEmergencia)
    }, agregarPersonal(){
      this.setComiteEmergenciaSuccess(this.comiteEmergencia);
      this.showPersonalDialog = true
    },
    closedModal(){
      this.showPersonalDialog = false
    }
  }
}
</script>

<style scoped>

</style>
