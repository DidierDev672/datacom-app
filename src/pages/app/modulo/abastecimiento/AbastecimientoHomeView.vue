<template>
  <q-page class="abastecimiento-home">
    <AbastecimientoWelcome />
  </q-page>
</template>

<script>
import AbastecimientoWelcome from "src/components/abastecimiento/AbastecimientoWelcome.vue";

export default {
  name: "AbastecimientoHomeView",

  components: {
    AbastecimientoWelcome,
  },
};
</script>

<style scoped>
.abastecimiento-home {
  min-height: calc(100vh - 50px);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
