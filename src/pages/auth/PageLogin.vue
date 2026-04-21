<template>
  <q-page class="login-container">
    <div class="form-container">
      <q-card flat class="my-card q-mx-auto" style="min-width: 400px; max-width: 450px">
        <q-card-section>
          <div>
            <q-img width="210px" src="/icons/logo.png" alt="datacom"></q-img>
          </div>
          <div class="q-pa-md">
            <div class="text-h5 q-mb-md text-primary text-weight-bold">
              Iniciar sesión
            </div>
            <q-form @submit="onSubmit" class="q-gutter-xs">
              <q-input color="green-200" outlined dense v-model="username" label="Nombre de usuario" lazy-rules :rules="[
                val =>
                  (val && val.length > 0) ||
                  'Por favor digite su nombre de usuario'
              ]" />

              <q-input v-model="password" outlined dense label="Contraseña" color="green-200"
                :type="isPwd ? 'password' : 'text'" lazy-rules :rules="[
                  val =>
                    (val !== null && val !== '') ||
                    'Por favor digite su contraseña'
                ]">
                <template v-slot:append>
                  <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                    @click="isPwd = !isPwd" />
                </template>
              </q-input>

              <q-select v-model="tenant" outlined dense label="Empresa" color="green-200" :options="tenantList"
                option-label="value" option-value="id" :rules="[
                  val =>
                    (val != null) ||
                    'Debe elegir una organizacion'
                ]" required />

              <q-toggle v-model="remember" color="secondary" label="Recordar mis datos" />

              <div>
                <q-btn class="full-width" rounded label="Inicia sesión" type="submit" color="primary" no-caps
                  :disabled="getLoading" :loading="getLoading">
                  <template v-slot:loading>
                    <q-spinner-facebook />
                  </template>
                </q-btn>
              </div>
            </q-form>
          </div>
        </q-card-section>
      </q-card>
    </div>
    <div class="content-container">
      <img class="background" src="/icons/fondo-auth.png" alt="" />
      <div class="content">
        <div class="title">
          <span>Bienvenidos a Datacom</span>
        </div>
        <div class="description">
          El sistema de caracterización de Municipios y Comunidades de la
          Fundación Oleoductos de Colombia.
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
export default {
  data() {
    return {
      isPwd: true,
      loading: false,
      username: "enarvaez", //enarvaez
      password: "enarvaez", //edinson261282
      tenant: {
        id: 'tenant_fodc',
        value: 'Fodc'
      },
      remember: false,
      tenantList: [
        {
          id: 'tenant_fodc',
          value: 'Fodc'
        },
        {
          id: 'tenant_mineros',
          value: 'Mineros S.A'
        },
        {
          id: 'tenant_pruebas',
          value: 'Fodc pruebas'
        }
      ]
    };
  },

  methods: {
    ...mapActions("auth", ["loginAction"]),
    ...mapMutations("auth", ["SET_USER_DATA", "SET_TENANT_DATA"]),
    onSubmit() {
      this.SET_TENANT_DATA(this.tenant.id);
      this.loginAction({
        username: this.username,
        password: this.password,
        remember_me: this.remember
      }).then(data => {
        const stored = sessionStorage.getItem('redirectAfterLogin');
        const redirectPath = stored || this.$route.query.from || '/';
        if (this.$jwt.hasToken()) {
          this.SET_USER_DATA(this.username);
          //this.SET_TENANT_DATA(data.tenant);
          if (stored) {
            try { sessionStorage.removeItem('redirectAfterLogin'); } catch (e) { }
          }
          this.$router.replace(redirectPath);
        } else {
          console.log("No existe el token");
        }
      })
        .catch(error => {
          console.error("Error en el login:", error);
        });

    }
  },
  computed: {
    ...mapGetters("auth", ["getLoading", "getError"])
  }
};
</script>

<style lang="sass">
.login-container
  display: flex
  flex-direction: row
  align-items: center

.form-container
  width: 45%
  display: flex
  flex-direction: column
  valing: center
  padding: 48px

.content-container
  width: 55%
  color: white

.content
  position: absolute
  top: 42%
  left: 50%

.content-container
  .content
    .title
      span
        font-size: 40px
        font-weight: 700
        line-height: 1.2

.content-container
  .content
    .description
      opacity: 0.7
      font-size: 18px
      margin-top: 12px

.background
  width: 100%
  max-height: 100vh
</style>
