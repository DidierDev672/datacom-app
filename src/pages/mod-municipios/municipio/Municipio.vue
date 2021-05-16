<template>
  <div class="q-ma-sm">
    <div class="row">
      <div class="col-xs-12 col-sm-8 offset-sm-2">
        <router-view :key="$route.path" />        
      </div>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>