<template>
  <q-dialog
    transition-show="scale"
    transition-hide="scale"
    @hide="close"
    v-model="show">
    <q-card style="width: 700px;">
      <q-card-section>
        <div class="text-h6">Personal del comite de emergencia</div>
      </q-card-section>

      <q-separator />

      <q-card-section style="max-height: 50vh" class="scroll">

        <q-btn v-if="showPersonalList" class="q-mb-sm" color="primary" label="Agregar persona" @click="showPersonalList = false" />
        <!-- <q-btn v-else class="q-mb-sm" color="primary" label="Volver a la lista" @click="showPersonalList = true" /> -->

        <div v-if="showPersonalList">
          <q-markup-table>
            <thead>
            <tr>
              <th class="text-center">Nombre</th>
              <th class="text-center">Cargo</th>
              <th class="text-center">Teléfono</th>
              <th class="text-center"></th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="personalComite in personalList" :key="personalComite.id">
              <td>{{ personalComite.nombre }}</td>
              <td>{{ personalComite.tipoCargo.nombre }}</td>
              <td>{{ personalComite.telefono }}</td>
              <td>
                <q-btn
                  flat
                  round
                  icon="delete"
                  @click="eliminar(personalComite.id)"
                  color="red" />
              </td>
            </tr>
            </tbody>
          </q-markup-table>
        </div>

        <div v-else>
          <personal-comite-emergencia-form
            @close="showPersonalList=true"
            @guardar="agregar" />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import PersonalComiteEmergenciaForm
  from "components/mod-comunidad/personal-comite-emergencia/PersonalComiteEmergenciaForm";
import {mapActions, mapGetters, mapMutations} from "vuex";
export default {
  name: "PersonalComiteEmergencia",
  components: {PersonalComiteEmergenciaForm},
  data(){
    return {
      show: true,
      showPersonalList: true,
      personalList: []
    }
  },
  created(){
    if(this.getComiteEmergenciaState.objComiteEmergencia.id > 0){
      //llamar al metodo que trae la lista de personal
      let institucionID = this.getComiteEmergenciaState.objComiteEmergencia.id
      this.cargarListaPersonalComiteEmergenciaPorComiteAction(institucionID).then( data => {
        this.personalList = [...data]
      })
    }
  },
  methods: {
    ...mapActions('personalComiteEmergencia', ['cargarListaPersonalComiteEmergenciaAction', 'unsetPersonalComiteEmergenciaAction','cargarListaPersonalComiteEmergenciaPorComiteAction',"eliminarPersonalComiteEmergenciaActions",]),
    ...mapActions('comiteEmergencia', ['cargarListaComiteEmergenciaAction', 'unsetComiteEmergenciaAction']),
    ...mapMutations("personalComiteEmergencia", [ "unsetPersonalComiteEmergencia"]),
    close(){ this.$emit("close"); },
    agregar(value){
      console.log('Value: ', value);
      this.personalList.unshift(value)
      this.showPersonalList = true
    },
    eliminar(personaID){
      this.eliminarPersonalComiteEmergenciaActions(personaID).then(data => {
        //Data = true / False
        if(data){
          this.personalList = this.personalList.filter(opt => opt.id != personaID)
        }else{
          console.log('No se pudo eliminar la persona');
        }
      })
    }

  },
  computed: {
    ...mapGetters('comiteEmergencia', ['getComiteEmergenciaState'])
  },
  beforeDestroy(){ this.unsetPersonalComiteEmergenciaAction() }

}
</script>

<style scoped>

</style>
