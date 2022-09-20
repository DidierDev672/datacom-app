<template>
  <router-view />
</template>

<script>
import { mapActions } from "vuex";
export default {
  created() {
    // this.cargarListaPlanTrabajoAction();
  },
  methods: {
    // ...mapActions("planTrabajo", ["cargarListaPlanTrabajoAction"])
  }
};
</script>

<style lang="scss" scoped></style>
