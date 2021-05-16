<template>
  <div>
      <h6>Estado vivienda</h6>
    <div class="flex justify-center">
        <q-btn label="Anterior" no-caps color="primary" flat class="q-mr-sm" :to="{ name: 'localizacion-vivienda'}" />
        <q-btn label="Siguiente" no-caps color="primary" :to="{ name: 'servicios-vivienda' }"/>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>