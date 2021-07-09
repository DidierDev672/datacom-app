<template>
  <div id="q-app">
    <router-view />
  </div>
</template>
<script>
import { mapMutations } from "vuex";
export default {
  name: "App",
  methods: {
    ...mapMutations("auth", ["SET_TOKEN_INFO"])
  },
  created() {
    const tokenString = localStorage.getItem("token");
    if (tokenString) {
      const tokenData = JSON.parse(tokenString);
      //console.log(tokenData)
      this.SET_TOKEN_INFO(tokenData);
    }
  }
};
</script>
