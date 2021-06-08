<template>
  <q-dialog 
    transition-show="scale" 
    transition-hide="scale"
    @hide="close"
    v-model="show">
      <q-card style="width: 700px;">
        <q-card-section>
          <div class="text-h6">Personal de la Entidad de Salud</div>
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
                <tr v-for="persona in personalList" :key="persona.id">
                  <td>{{ persona.nombre }}</td>
                  <td>{{ persona.cargo.nombre }}</td>
                  <td>{{ persona.telefono }}</td>
                  <td>
                    <q-btn
                      flat
                      round
                      icon="delete"
                      @click="eliminar(persona.id)"
                      color="red" />
                  </td>
                </tr>
              </tbody>
            </q-markup-table>
          </div>

          <div v-else>
            <persona-infrasalud-form
              @close="showPersonalList=true"
              @guardar="agregar" />
          </div>
           
          
        </q-card-section>        
      </q-card>
    </q-dialog>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
// import PersonasList from "src/components/mod-comunidad/personas-institucion-educativa/PersonasList.vue"
import PersonaInfrasaludForm from "src/components/mod-comunidad/persona-infrasalud/PersonaInfrasaludForm.vue"
export default {
  components: {PersonaInfrasaludForm},
  data(){
    return {
      show: true,
      showPersonalList: true,
      personalList: []
    }
  },
  created(){
    if(this.getInfrasaludState.objInfrasalud.id > 0){
        //llamar al metodo que trae la lista de personal
        let institucionID = this.getInfrasaludState.objInfrasalud.id
        this.cargarListaPersonalInfrasaludAction(institucionID).then( data => {
            console.log('Data: ', data);
            this.personalList = [...data]
        })
    }
  },
  methods: {
    ...mapActions('infrasalud', ['cargarListaPersonalInfrasaludAction', 'unsetInfrasaludAction']),
    ...mapActions("personalInfrasalud", ["eliminarPersonalInfrasaludAction"]),
    close(){ this.$emit("close"); },
    agregar(value){
      console.log('Value: ', value);
      this.personalList.unshift(value)
      this.showPersonalList = true
    },
    eliminar(personaID){
      this.eliminarPersonalInfrasaludAction(personaID).then(data => {
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
      ...mapGetters('infrasalud', ['getInfrasaludState'])
  },
  beforeDestroy(){ this.unsetInfrasaludAction() }

}
</script>

<style>

</style>