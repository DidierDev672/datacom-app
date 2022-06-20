<template>
  <router-view />
</template>

<script>
import { mapActions } from "vuex";
export default {
  created() {
    //Traer los indicadores también
    //this.cargarListaIcoAction();
    //this.cargarListaJacAction();
    this.cargarListaIndicadoresAction();
  },
  methods: {
    ...mapActions("ico", ["cargarListaIcoAction"]),
    ...mapActions("jac", ["cargarListaJacAction"]),
    ...mapActions("indicadores", ["cargarListaIndicadoresAction"])
  }
};
</script>

<style lang="scss" scoped></style>
