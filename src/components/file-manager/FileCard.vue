<template>
  <q-card class="text-center ">

      <q-avatar square>
        <img :src="archivo.contentType | imagePreview">
      </q-avatar>

      <q-card-section>
        <div class="text-subtitle2 ellipsis">{{ archivo.nombreOriginal }}</div>
      </q-card-section>

    </q-card>
</template>

<script>
export default {
  props: {
    archivo: {
      type: Object,
      required: true
    }
  },
  filters: {
    imagePreview(type){
      let img = ''
      if(type.includes('pdf')){
        img = '/icons/files-icon/pdf.png'
      }else if(type.includes('word') || type.includes('odt')){
        img = '/icons/files-icon/doc.png'
      }else if(type.includes('sheet')){
        img = '/icons/files-icon/xls.png'
      }else if(type.includes('ppt')){
        img = '/app/static/file-icons/ppt.png'
      }else if(type.includes('jpg')){
        img = '/app/static/file-icons/jpg.png'
      }else if(type.includes('png')){
        img = '/app/static/file-icons/png.png'
      }else if(type.includes('txt')){
        img = '/app/static/file-icons/txt.png'
      }else if(type.includes('zip')){
        img = '/app/static/file-icons/zip.png'
      }else{
        img = '/icons/files-icon/file.png'
      }
      return img;
    }
  }

}
</script>

<style>

</style>
