<template>
  <q-page class="login-page">
    <!-- Sección izquierda: formulario -->
    <div class="login-form-section">
      <div class="login-form-wrapper w-60">
        <div class="login-logo">
          <q-img width="180px" src="/icons/logo.png" alt="datacom" />
        </div>

        <div class="login-header">
          <h1 class="login-title text-primary">
            {{ showWelcome ? "¡Sesión iniciada!" : "Iniciar sesión" }}
          </h1>
          <p v-if="!showWelcome" class="login-subtitle">
            Ingresa tus credenciales para acceder al sistema
          </p>
        </div>

        <WelcomeMessage v-if="showWelcome" class="q-mb-lg" />

        <q-btn
          v-if="showWelcome"
          class="full-width login-btn q-mb-md"
          rounded
          label="Continuar al inicio"
          color="primary"
          no-caps
          unelevated
          icon-right="arrow_forward"
          @click="goToApp"
        />

        <q-form v-if="!showWelcome" @submit="onSubmit" class="login-form">
          <div class="form-field">
            <label class="field-label">Nombre de usuario</label>
            <q-input v-model="username" outlined dense color="green-200" placeholder="Ingresa tu usuario" lazy-rules
              bg-color="white" class="login-input" :rules="[
                val =>
                  (val && val.length > 0) ||
                  'Por favor digite su nombre de usuario'
              ]">
              <template v-slot:prepend>
                <q-icon name="person" color="primary" />
              </template>
            </q-input>
          </div>

          <div class="form-field">
            <label class="field-label">Contraseña</label>
            <q-input v-model="password" outlined dense color="green-200" :type="isPwd ? 'password' : 'text'"
              placeholder="Ingresa tu contraseña" lazy-rules bg-color="white" class="login-input" :rules="[
                val =>
                  (val !== null && val !== '') ||
                  'Por favor digite su contraseña'
              ]">
              <template v-slot:prepend>
                <q-icon name="lock" color="primary" />
              </template>
              <template v-slot:append>
                <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" color="grey-6"
                  @click="isPwd = !isPwd" />
              </template>
            </q-input>
          </div>

          <div class="form-field">
            <label class="field-label">Empresa</label>
            <q-select v-model="tenant" outlined dense color="green-200" :options="tenantList" option-label="value"
              option-value="id" bg-color="white" class="login-input" :rules="[
                val => val != null || 'Debe elegir una organizacion'
              ]" required>
              <template v-slot:prepend>
                <q-icon name="business" color="primary" />
              </template>
            </q-select>
          </div>

          <div class="form-options">
            <q-toggle v-model="remember" color="secondary" label="Recordar mis datos" dense />
          </div>

          <q-btn class="full-width login-btn" rounded label="Inicia sesión" type="submit" color="primary" no-caps
            unelevated :disabled="getLoading" :loading="getLoading">
            <template v-slot:loading>
              <q-spinner-facebook />
            </template>
          </q-btn>
        </q-form>

        <div class="login-footer">
          <p class="footer-text">
            © {{ currentYear }} Datacom — Fundación Oleoductos de Colombia
          </p>
        </div>
      </div>
    </div>

    <!-- Sección derecha: imagen y branding -->
    <div class="login-branding-section">
      <img class="background" src="/icons/fondo-auth.png" alt="" />
      <div class="branding-overlay" />
      <div class="branding-content">
        <h2 class="branding-title text-white">Bienvenidos a Datacom</h2>
        <p class="branding-description text-white">
          El sistema de caracterización de Municipios y Comunidades de la
          Fundación Oleoductos de Colombia.
        </p>
        <div class="branding-features">
          <div class="feature-item text-white">
            <q-icon name="check_circle" color="white" size="sm" />
            <span class="text-white">Gestión de encuestas</span>
          </div>
          <div class="feature-item">
            <q-icon name="check_circle" color="white" size="sm" />
            <span>Análisis de datos</span>
          </div>
          <div class="feature-item">
            <q-icon name="check_circle" color="white" size="sm" />
            <span>Reportes en tiempo real</span>
          </div>
        </div>
      </div>
    </div>

    <div class="login-error-alert-wrapper">
      <transition name="fade-up">
        <div v-if="showLoginError" class="login-error-alert" role="alert" aria-live="polite">
          <div class="login-error-alert__icon">
            <q-icon name="lock_reset" size="22px" />
          </div>
          <div class="login-error-alert__content">
            <p class="login-error-alert__title">
              Estás muy cerca — revisa tus datos
            </p>
            <p class="login-error-alert__message">
              Los datos ingresados no coinciden con nuestros registros. Tómate
              un momento para verificar tu usuario, contraseña y la empresa
              seleccionada. Un pequeño ajuste suele ser todo lo que necesitas.
            </p>
            <p class="login-error-alert__reassurance">
              Tu cuenta permanece segura. Puedes intentarlo de nuevo cuando
              estés listo.
            </p>
          </div>
          <q-btn flat round dense icon="close" class="login-error-alert__close" aria-label="Cerrar alerta"
            @click="dismissLoginError" />
        </div>
      </transition>
    </div>
  </q-page>
</template>

<script>
import WelcomeMessage from "src/components/WelcomeMessage.vue";
import { useAuthStore } from "src/stores/authStore";
import { useOperativosPermisosStore } from "src/stores/operativosPermisosStore";
import { useAccessStore } from "src/router/Access.store";
import { pinia } from "src/stores/pinia";
import { mapActions, mapGetters, mapMutations } from "vuex";

export default {
  components: {
    WelcomeMessage,
  },

  data() {
    return {
      isPwd: true,
      loading: false,
      username: "",
      password: "",
      showWelcome: false,
      redirectPath: "/",
      tenant: {
        id: "tenant_fodc",
        value: "Fodc"
      },
      remember: false,
      showLoginError: false,
      tenantList: [
        {
          id: "tenant_fodc",
          value: "Fodc"
        },
        {
          id: "tenant_mineros",
          value: "Mineros S.A"
        },
        {
          id: "tenant_pruebas",
          value: "Fodc pruebas"
        }
      ]
    };
  },

  computed: {
    ...mapGetters("auth", ["getLoading", "getError"]),
    currentYear() {
      return new Date().getFullYear();
    }
  },

  watch: {
    username() {
      this.dismissLoginError();
    },
    password() {
      this.dismissLoginError();
    },
    tenant() {
      this.dismissLoginError();
    }
  },

  methods: {
    ...mapActions("auth", ["loginAction"]),
    ...mapMutations("auth", ["SET_USER_DATA", "SET_TENANT_DATA"]),
    showCredentialsError() {
      this.showLoginError = true;
    },
    dismissLoginError() {
      this.showLoginError = false;
    },
    syncAuthStore(data) {
      const authStore = useAuthStore(pinia);
      authStore.token = data && data.token ? data.token : null;
      authStore.user = { username: this.username };
      authStore.tenant = this.tenant.id;
      authStore.isAuthenticated = true;
    },
    goToApp() {
      this.$router.replace(this.redirectPath);
    },
    onSubmit() {
      this.dismissLoginError();
      this.SET_TENANT_DATA(this.tenant.id);
      this.loginAction({
        username: this.username,
        password: this.password,
        remember_me: this.remember
      })
        .then(data => {
          if (this.$jwt.hasToken()) {
            this.SET_USER_DATA(this.username);
            useOperativosPermisosStore(pinia).loadForUsername(this.username);
            this.syncAuthStore(data);
            useAccessStore(pinia).syncFromSession();

            const stored = sessionStorage.getItem("redirectAfterLogin");
            this.redirectPath = stored || this.$route.query.from || "/";
            if (stored) {
              try {
                sessionStorage.removeItem("redirectAfterLogin");
              } catch (e) { }
            }

            this.showWelcome = true;
          } else {
            this.showCredentialsError();
          }
        })
        .catch(() => {
          this.showCredentialsError();
        });
    }
  }
};
</script>

<style lang="sass" scoped>
.login-page
  display: flex
  min-height: 100vh
  padding: 0

.login-form-section
  flex: 0 0 45%
  display: flex
  align-items: center
  justify-content: center
  background: transparent
  padding: 48px 32px

.w-60
  width: 100%
  max-width: 600px

.login-form-wrapper
  width: 100%
  background: white
  border-radius: 16px
  padding: 40px
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08)

.login-logo
  text-align: center
  margin-bottom: 28px

.login-header
  text-align: center
  margin-bottom: 28px

.login-title
  font-size: 28px
  font-weight: 700
  margin: 0 0 8px 0
  line-height: 1.2

.login-subtitle
  font-size: 14px
  color: #64748b
  margin: 0

.login-error-alert-wrapper
  position: fixed
  top: 28px
  left: 0
  right: 0
  z-index: 2000
  display: flex
  justify-content: center
  padding: 0 24px
  pointer-events: none

.login-error-alert
  display: flex
  align-items: flex-start
  gap: 14px
  width: 100%
  max-width: 560px
  padding: 18px 20px
  border-radius: 14px
  border: 1px solid rgba(251, 191, 36, 0.35)
  background: rgba(255, 251, 235, 0.96)
  backdrop-filter: blur(12px)
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.14), 0 6px 16px rgba(245, 158, 11, 0.12)
  pointer-events: auto

.login-error-alert__icon
  flex-shrink: 0
  display: flex
  align-items: center
  justify-content: center
  width: 40px
  height: 40px
  border-radius: 10px
  background: rgba(245, 158, 11, 0.14)
  color: #b45309

.login-error-alert__content
  flex: 1
  min-width: 0

.login-error-alert__title
  margin: 0 0 6px 0
  font-size: 15px
  font-weight: 700
  color: #92400e
  line-height: 1.35

.login-error-alert__message
  margin: 0 0 8px 0
  font-size: 13px
  line-height: 1.55
  color: #78350f

.login-error-alert__reassurance
  margin: 0
  font-size: 12px
  line-height: 1.45
  color: #a16207
  font-weight: 500

.login-error-alert__close
  flex-shrink: 0
  color: #a16207

.fade-up-enter-active
  transition: opacity 0.45s cubic-bezier(0.22, 1, 0.36, 1), transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)

.fade-up-leave-active
  transition: opacity 0.3s ease, transform 0.3s ease

.fade-up-enter,
.fade-up-leave-to
  opacity: 0
  transform: translateY(18px)

@media (prefers-reduced-motion: reduce)
  .fade-up-enter-active,
  .fade-up-leave-active
    transition: opacity 0.2s ease

  .fade-up-enter,
  .fade-up-leave-to
    transform: none

.login-form
  display: flex
  flex-direction: column
  gap: 18px

.form-field
  display: flex
  flex-direction: column
  gap: 6px

.field-label
  font-size: 13px
  font-weight: 600
  color: #374151
  text-transform: uppercase
  letter-spacing: 0.4px

.login-input
  :deep(.q-field__control)
    border-radius: 8px

.form-options
  display: flex
  align-items: center

.login-btn
  height: 48px
  font-size: 16px
  font-weight: 600
  margin-top: 4px
  transition: transform 0.2s ease, box-shadow 0.2s ease

  &:hover:not(.disabled)
    transform: translateY(-1px)
    box-shadow: 0 4px 12px rgba(175, 202, 11, 0.35)

.login-footer
  margin-top: 28px
  text-align: center

.footer-text
  font-size: 12px
  color: #94a3b8
  margin: 0

.login-branding-section
  flex: 0 20 55%
  position: relative
  display: flex
  align-items: center
  justify-content: center
  overflow: hidden
  color: white

.background
  position: absolute
  inset: 0
  width: 100%
  height: 100%
  object-fit: cover

.branding-overlay
  position: absolute
  inset: 0
  background: linear-gradient(135deg, rgba(44, 62, 80, 0.82) 0%, rgba(100, 194, 200, 0.55) 100%)
  opacity: 0.1
  filter: blur(10px)
  backdrop-filter: blur(10px)
  -webkit-backdrop-filter: blur(20px)
  -moz-backdrop-filter: blur(10px)
  -ms-backdrop-filter: blur(10px)
  -o-backdrop-filter: blur(10px)

.branding-content
  position: relative
  z-index: 1
  max-width: 480px
  padding: 40px
  text-align: left

.branding-title
  font-size: 40px
  font-weight: 700
  line-height: 1.2
  margin: 0 0 16px 0
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2)

.branding-description
  font-size: 18px
  line-height: 1.5
  opacity: 0.85
  margin: 0 0 36px 0

.branding-features
  display: flex
  flex-direction: column
  gap: 14px

.feature-item
  display: flex
  align-items: center
  gap: 12px
  font-size: 15px
  font-weight: 500
  background: rgba(255, 255, 255, 0.1)
  padding: 12px 20px
  border-radius: 30px
  backdrop-filter: blur(8px)

@media (max-width: 1024px)
  .login-branding-section
    display: none

  .login-form-section
    flex: 1
    padding: 24px 16px

  .login-form-wrapper
    padding: 32px 24px

@media (max-width: 480px)
  .login-title
    font-size: 24px

  .login-form-wrapper
    padding: 24px 20px
    box-shadow: none
    border-radius: 12px
</style>
