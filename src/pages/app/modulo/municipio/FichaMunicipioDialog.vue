<template>
  <div class="q-pa-md q-gutter-sm">

    <q-dialog
      v-model="medium"
    >
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6">Medium</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          {{ encuesta }}
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="OK" @click="close" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters} from 'vuex'
export default {
    props: {
        municipio: {
            type: Number,
            required: true
        }
    },
  data () {
    return {
      medium: true,
      encuesta: null
    }
  },
  mounted(){
      console.log('Mounted del dialog: ', this.municipio)
      this.buscarEncuestaAction(this.municipio).then(data => {
          this.encuesta = data
      })
  },
  methods: {
      ...mapActions('encuesta', ['buscarEncuestaAction']),
      close() {
      this.$emit("close");
    }
  }
}
</script>
