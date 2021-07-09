<template>
  <q-page class="flex flex-center">
    <q-card class="my-card" style="min-width: 400px; max-width: 450px">
      <q-card-section class="flex flex-center">
        <q-img width="210px" src="/icons/logo.png" alt="datacom"></q-img>
      </q-card-section>
      <q-card-section v-if="getError">
        <q-banner inline-actions class="text-white bg-red">
          {{ getError }}
        </q-banner>
      </q-card-section>
      <q-card-section>
        <div class="q-pa-md">
          <q-form @submit="onSubmit" class="q-gutter-md">
            <q-input
              color="secondary"
              v-model="username"
              label="Nombre de usuario *"
              lazy-rules
              :rules="[
                val =>
                  (val && val.length > 0) ||
                  'Por favor digite su nombre de usuario'
              ]"
            />

            <q-input
              v-model="password"
              color="secondary"
              label="Contraseña *"
              :type="isPwd ? 'password' : 'text'"
              lazy-rules
              :rules="[
                val =>
                  (val !== null && val !== '') ||
                  'Por favor digite su contraseña'
              ]"
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>

            <q-toggle
              v-model="remember"
              color="secondary"
              label="Recordar mis datos"
            />

            <div>
              <q-btn
                class="full-width"
                label="Inicia Sesión"
                type="submit"
                color="secondary"
                icon="face"
                :disabled="getLoading"
                :loading="getLoading"
              >
                <template v-slot:loading>
                  <q-spinner-facebook />
                </template>
              </q-btn>
            </div>
          </q-form>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      isPwd: true,
      loading: false,
      username: "enarvaez",
      password: "edinson261282",
      remember: false
    };
  },

  methods: {
    ...mapActions("auth", ["loginAction"]),
    onSubmit() {
      // this.loading = true;
      this.loginAction({
        username: this.username,
        password: this.password,
        remember_me: this.remember
      }).then(data => {
        if (this.$jwt.hasToken()) {
          this.$router.push("/");
        } else {
          console.log("No existe el token");
        }
      });
    }
  },
  computed: {
    ...mapGetters("auth", ["getLoading", "getError"])
  }
};
</script>
