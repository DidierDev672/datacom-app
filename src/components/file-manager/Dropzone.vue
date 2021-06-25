<template class="full-width">
	<form class="add-blog-form justify-space-between">
		<dropzone
    id="myVueDropzone"
    ref="dropzoneFile"
    class="mb-2"
    :options="dropzoneOptions"
    v-on:vdropzone-sending="uploadFiles"
    v-on:vdropzone-success="uploadSuccess"
    v-on:vdropzone-file-added="add">
			<input type="hidden" name="token" value="xxx">
		</dropzone>
	</form>
</template>

<script>
import Dropzone from "vue2-dropzone";
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
import { URL_API } from 'src/utils/config'

const urlService = `${URL_API}/documento-adjunto/upload`

export default {
  components: {
    Dropzone
  },
  data() {
    return {
      access_token: '',
      filesUpload: [],
      dropzoneOptions: {
        url: urlService,
        methods: 'POST',
        paramName: 'file',
        // url: 'http://localhost:8000/api/files',
        thumbnailWidth: 150,
        maxFilesize: 20,
      }
    };
  },
  methods: {
    onSubmit(){
      console.log('Llama al onSubmit')
    },
    uploadFiles(file, xhr, formData){
      // let token = JSON.parse(localStorage.getItem('token'));
      // this.access_token = token.access_token;
      // xhr.setRequestHeader("Authorization", `Bearer ${this.access_token}`);

      xhr.setRequestHeader('Content-Type', 'multipart/form-data')

      // formData.append('archivo', file);
    },
    uploadSuccess(file, response){
      console.log('File', file);
      console.log('Response', response);
      setTimeout(() => {
        this.$refs.dropzoneFile.removeAllFiles();
      }, 1500)
    },
    add(file){
      this.filesUpload.push(file)
      console.log('Files to Upload',this.filesUpload)
    }
  }
};
</script>
