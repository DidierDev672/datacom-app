<template>
  <q-btn
    dense
    class="v-step-4"
    flat
    icon-right="logout"
    @click="logout"
    :label="getUserAuthenticated"
  />
</template>

<script>
import { mapActions } from "vuex";
export default {
  methods: {
    ...mapActions("auth", ["logoutAction"]),
    logout() {
      this.logoutAction();
    }
  },
  computed: {
    getUserAuthenticated() {
      let username = "";
      if (this.$jwt.hasToken()) {
        let token = JSON.parse(this.$jwt.getToken());
        let decodeToken = this.$jwt.decode(token.access_token);
        username = decodeToken.user_name;
      } else {
        console.log("No existe el token");
      }
      return username;
    }
  }
};
</script>

<style lang="scss" scoped></style>
