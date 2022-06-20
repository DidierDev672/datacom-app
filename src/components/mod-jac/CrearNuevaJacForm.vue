<template>
  <q-dialog
    v-model="prompt"
    transition-show="scale"
    transition-hide="scale"
    persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Nombre de la Junta</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense v-model="jac.nombre" autofocus />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancelar" @click="close()" />
          <q-btn flat label="Registrar Junta" @click="onSubmit()" />
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<script>
import { mapActions } from "vuex";
  export default {

    data(){
      return {
        prompt: true,
        jac: {}
      }
    },

    created(){

      this.jac = {
        id: 0,
        nombre: ''
      }

    },

    methods: {
      ...mapActions("jac", ["registrarJacAction"]),
      onSubmit(){
        console.log(`Nombre de la Junta`, this.jac)
        this.registrarJacAction(this.jac).then(response => {
          this.$q.notify({
                message: "Organización registrada correctamente",
                color: "positive"
              });
          this.$router.push({
                name: "jac-info",
                params: { id: response }
              });

          this.close();
        })
      },
      close() {
          this.$emit('close');
      },
    }

  }
</script>

<style lang="scss" scoped>

</style>
