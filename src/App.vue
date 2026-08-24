<template>
  <div id="q-app">
    <router-view />
    <SessionExpiredModal ref="sessionExpiredModal" />
  </div>
</template>
<script>
import { mapMutations } from "vuex";
import axios from "axios";
import { pinia } from "src/stores/pinia";
import SessionExpiredModal from "src/components/SessionExpiredModal.vue";
import { useAccessStore } from "src/router/Access.store";
import {
  notifySessionExpired,
  registerSessionExpiredHandler,
} from "src/utils/sessionExpiredHandler";

export default {
  name: "App",

  components: {
    SessionExpiredModal,
  },

  methods: {
    ...mapMutations("auth", ["SET_TOKEN_INFO", "SET_USER_DATA", "SET_TENANT_DATA"]),
  },

  created() {
    const tokenString = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    const tenant = localStorage.getItem("tenant");
    if (tokenString) {
      console.log("tokenString: ", tokenString);
      const tokenData = JSON.parse(tokenString);
      this.SET_TOKEN_INFO(tokenData);
    }

    if (userData) {
      console.log("userData: ", userData);
      this.SET_USER_DATA(JSON.parse(userData));
    }

    if (tenant) {
      console.log("tenant: ", tenant);
      this.SET_TENANT_DATA(JSON.parse(tenant));
    }

    useAccessStore(pinia).syncFromSession();

    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          notifySessionExpired({ source: "axiosInterceptor" });
        }
        return Promise.reject(error);
      }
    );
  },

  mounted() {
    var self = this;
    registerSessionExpiredHandler(function () {
      if (self.$refs.sessionExpiredModal) {
        self.$refs.sessionExpiredModal.show();
      }
    });
  },
};
</script>

<style>
</style>
