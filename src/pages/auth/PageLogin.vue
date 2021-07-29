<template>
  <q-page class="">
    <q-card
      flat
      class="my-card q-mx-auto"
      style="min-width: 400px; max-width: 450px"
    >
      <q-card-section>
        <div>
          <q-img width="210px" src="/icons/logo.png" alt="datacom"></q-img>
        </div>
        <div class="q-pa-md">
          <div class="text-h5 q-mb-md text-primary text-weight-bold">
            Iniciar sesión
          </div>
          <q-form @submit="onSubmit" class="q-gutter-xs">
            <p class="text-subtitle2 text-weight-bold text-dark">
              Nombre de usuario
            </p>
            <q-input
              color="secondary"
              outlined
              dense
              v-model="username"
              lazy-rules
              :rules="[
                val =>
                  (val && val.length > 0) ||
                  'Por favor digite su nombre de usuario'
              ]"
            />

            <p class="text-subtitle2 text-weight-bold text-dark">Contraseña</p>

            <q-input
              v-model="password"
              outlined
              dense
              color="secondary"
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
                rounded
                label="Inicia sesión"
                type="submit"
                color="primary"
                no-caps
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
import { mapActions, mapGetters, mapMutations } from "vuex";
export default {
  data() {
    return {
      isPwd: true,
      loading: false,
      username: "", //enarvaez
      password: "", //edinson261282
      remember: false
    };
  },

  methods: {
    ...mapActions("auth", ["loginAction"]),
    ...mapMutations("auth", ["SET_USER_DATA"]),
    onSubmit() {
      // this.loading = true;
      this.loginAction({
        username: this.username,
        password: this.password,
        remember_me: this.remember
      }).then(data => {
        if (this.$jwt.hasToken()) {
          this.SET_USER_DATA(this.username);
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
