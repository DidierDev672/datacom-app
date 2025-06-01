<template>
  <div id="q-app">
    <router-view />
  </div>
</template>
<script>
import { mapMutations } from "vuex";
import axios from "axios";
export default {
  name: "App",
  methods: {
    ...mapMutations("auth", ["SET_TOKEN_INFO", "SET_USER_DATA", "SET_TENANT_DATA"])
  },
  created() {
    const tokenString = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    const tenant = localStorage.getItem("tenant");
    if (tokenString) {
      console.log('tokenString: ', tokenString)
      const tokenData = JSON.parse(tokenString);
      this.SET_TOKEN_INFO(tokenData);
    }

    if (userData) {
      console.log('userData: ', userData)
      this.SET_USER_DATA(JSON.parse(userData));
    }

    if(tenant){
      console.log('tenant: ', tenant)
      this.SET_TENANT_DATA(JSON.parse(tenant))
    }

    axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response.status === 401) {
          this.$store.dispatch("auth/logoutAction");
        }
        return Promise.reject(error);
      }
    );
  }
};
</script>
