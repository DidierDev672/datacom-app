<template>
  <q-dialog
    persistent 
    transition-show="scale" 
    transition-hide="scale"
    v-model="show">
      <q-card style="width: 700px;">
        <q-card-section>
          <div class="text-h6">Personal de la Institución Educativa</div>
        </q-card-section>

        <q-separator />

        <q-card-section style="max-height: 50vh" class="scroll">

          <personas-list></personas-list>
           
          
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn
            flat
            label="Cancelar"
            color="primary"
            @click="close" />
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<script>
import PersonasList from "src/components/mod-comunidad/personas-institucion-educativa/PersonasList.vue"
export default {
  components: {PersonasList},
  data(){
    return {
      show: true
    }
  },
  methods: {
    close(){ this.$emit("close"); }

  }

}
</script>

<style>

</style>