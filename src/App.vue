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
    ...mapMutations("auth", ["SET_TOKEN_INFO", "SET_USER_DATA"])
  },
  created() {
    const tokenString = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (tokenString) {
      const tokenData = JSON.parse(tokenString);
      //console.log(tokenData)
      this.SET_TOKEN_INFO(tokenData);
    }

    if (userData) {
      this.SET_USER_DATA(JSON.parse(userData));
    }
  }
};
</script>
