<template>
  <q-dialog
    transition-show="scale"
    transition-hide="scale"
    full-height
    full-width
    @hide="close"
    v-model="show"
  >
    <q-card>

      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">File manager</div>
        <q-space />
        <q-btn outline v-if="!showUploadForm" label="upload" color="primary" @click="showUploadForm = true" />
        <q-btn outline v-else label="Galeria" color="primary" @click="showUploadForm = false" />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-separator />

      <q-card-section style="max-height: 80vh" class="scroll" v-if="!showUploadForm">
        <div class="q-pa-md row items-start q-gutter-xs">
          <div
            class="col-xs-12 col-sm-2"
            v-for="file in fileList"
            style="cursor:pointer"
            @click="seleccionar(file)"
            :key="file.id">
            <file-card
              :archivo="file"
               />
          </div>
        </div>
      </q-card-section>

      <!-- <q-card-section>
        <dropzone></dropzone>
      </q-card-section> -->

      <q-card-section v-else>
         <q-uploader
            :url="getUrl"
            class="full-width"
            @uploaded="archivosCargados"
            @failed="falloAlSubir"
            field-name="file"
          />
      </q-card-section>

    </q-card>
  </q-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import FileCard from 'src/components/file-manager/FileCard.vue'
import { URL_API } from 'src/utils/config'
// import Dropzone from 'src/components/file-manager/Dropzone.vue'
export default {
  name: "FileManagerComponent",
  components: { FileCard },
  props: {
        campo: {
            type: String,
            required: true
        }
    },
  data() {
    return {
      show: true,
      showUploadForm: false,
      fileList: []
    }
  },
  created(){
    this.cargarListaFileManagerAction().then(data => {
      this.fileList = [...data]
    })
  },
  methods: {
    ...mapActions('fileManager', ['cargarListaFileManagerAction', 'registrarFileManagerAction']),
    seleccionar(file){
      // console.log('File: ', file);
      // console.log('Campo: ', this.campo);
      this.$emit('seleccionar', this.campo, file)
    },
    getUrl () {
      return `${URL_API}/documento-adjunto/upload`
    },
    close(){
      this.$emit("close");
    },
    archivosCargados(info){
      console.log('Info: ', info);
      let archivoGuardado = JSON.parse(info.xhr.response)
      console.log('ArchivoGuardado: ', archivoGuardado);
      this.fileList.push(archivoGuardado)
      this.showUploadForm = false
      this.$q.notify({
          message: 'Archivo cargado correctamente',
          color: 'positive'
      })
    },
    falloAlSubir(info){
      this.$q.notify({
          message: 'Ocurrió un error al subir el archivo, favor valide el tamaño',
          color: 'red'
      })
    }
  },
  computed: {
    ...mapGetters('fileManager', ['getFileManagerState'])
  }
}
</script>

<style scoped></style>
