<template>
  <div>
      <h6>Productos vivienda</h6>
    <div class="flex justify-center">
        <q-btn label="Anterior" no-caps color="primary" flat class="q-mr-sm" :to="{ name: 'servicios-vivienda'}" />
        <q-btn label="Siguiente" no-caps color="primary" :to="{ name: 'personas-vivienda' }"/>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>