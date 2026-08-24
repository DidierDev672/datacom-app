<template>
  <div class="login-wrapper">
    <!-- Sección izquierda - Formulario -->
    <div class="login-form-section">
      <div class="login-form-container">
        <!-- Logo -->
        <div class="login-logo">
          <img src="/icons/logo.png" alt="Datacom" class="logo-img" />
        </div>

        <!-- Título -->
        <div class="login-header">
          <h1 class="login-title">Bienvenido</h1>
          <p class="login-subtitle">
            Ingresa tus credenciales para acceder al sistema
          </p>
        </div>

        <!-- Formulario -->
        <q-form @submit="onSubmit" class="login-form">
          <!-- Usuario -->
          <div class="form-field">
            <label class="field-label">Nombre de usuario</label>
            <q-input
              v-model="form.username"
              outlined
              dense
              placeholder="Ingresa tu usuario"
              :rules="[val => !!val || 'El usuario es requerido']"
              bg-color="white"
              class="login-input"
            >
              <template v-slot:prepend>
                <q-icon name="person" color="primary" />
              </template>
            </q-input>
          </div>

          <!-- Contraseña -->
          <div class="form-field">
            <label class="field-label">Contraseña</label>
            <q-input
              v-model="form.password"
              outlined
              dense
              :type="showPassword ? 'text' : 'password'"
              placeholder="Ingresa tu contraseña"
              :rules="[val => !!val || 'La contraseña es requerida']"
              bg-color="white"
              class="login-input"
              @keyup.enter="onSubmit"
            >
              <template v-slot:prepend>
                <q-icon name="lock" color="primary" />
              </template>
              <template v-slot:append>
                <q-icon
                  :name="showPassword ? 'visibility' : 'visibility_off'"
                  class="cursor-pointer"
                  color="grey-6"
                  @click="showPassword = !showPassword"
                />
              </template>
            </q-input>
          </div>

          <!-- Empresa/Tenant -->
          <div class="form-field">
            <label class="field-label">Organización</label>
            <q-select
              v-model="form.tenant"
              outlined
              dense
              :options="tenants"
              option-value="id"
              option-label="name"
              placeholder="Selecciona una organización"
              :rules="[val => !!val || 'Debes seleccionar una organización']"
              bg-color="white"
              class="login-input"
            >
              <template v-slot:prepend>
                <q-icon name="business" color="primary" />
              </template>
            </q-select>
          </div>

          <!-- Recordarme -->
          <div class="form-options">
            <q-checkbox
              v-model="form.remember"
              label="Recordarme"
              color="primary"
              dense
            />
          </div>

          <!-- Error -->
          <q-banner v-if="authStore.error" class="bg-red-1 text-red q-mb-md" dense>
            <template v-slot:avatar>
              <q-icon name="error" color="red" />
            </template>
            {{ authStore.error }}
          </q-banner>

          <!-- Botón de login -->
          <q-btn
            type="submit"
            color="primary"
            class="full-width login-btn"
            :loading="authStore.isLoading"
            :disable="authStore.isLoading"
            no-caps
            unelevated
          >
            <span class="btn-text">Iniciar sesión</span>
            <template v-slot:loading>
              <q-spinner-dots color="white" />
              <span class="q-ml-sm">Ingresando...</span>
            </template>
          </q-btn>
        </q-form>

        <!-- Footer -->
        <div class="login-footer">
          <p class="footer-text">
            © {{ currentYear }} Datacom - Fundación Oleoductos de Colombia
          </p>
        </div>
      </div>
    </div>

    <!-- Sección derecha - Imagen/Branding -->
    <div class="login-branding-section">
      <div class="branding-overlay"></div>
      <div class="branding-content">
        <h2 class="branding-title">Sistema de Gestión</h2>
        <p class="branding-description">
          Caracterización de Municipios y Comunidades
        </p>
        <div class="branding-features">
          <div class="feature-item">
            <q-icon name="check_circle" color="green" size="sm" />
            <span>Gestión de encuestas</span>
          </div>
          <div class="feature-item">
            <q-icon name="check_circle" color="green" size="sm" />
            <span>Análisis de datos</span>
          </div>
          <div class="feature-item">
            <q-icon name="check_circle" color="green" size="sm" />
            <span>Reportes en tiempo real</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed, useRouter, useRoute } from '@vue/composition-api';
import { useAuthStore } from 'src/stores/authStore';

export default defineComponent({
  name: 'NewLoginPage',

  setup() {
    const router = useRouter();
    const route = useRoute();
    const authStore = useAuthStore();

    const showPassword = ref(false);

    const form = ref({
      username: '',
      password: '',
      tenant: { id: 'tenant_fodc', name: 'Fodc' },
      remember: false
    });

    const tenants = [
      { id: 'tenant_fodc', name: 'Fodc' },
      { id: 'tenant_mineros', name: 'Mineros S.A' },
      { id: 'tenant_pruebas', name: 'Fodc pruebas' }
    ];

    const currentYear = computed(() => new Date().getFullYear());

    const onSubmit = async () => {
      try {
        authStore.clearError();

        await authStore.login({
          username: form.value.username,
          password: form.value.password,
          tenant: form.value.tenant.id,
          remember: form.value.remember
        });

        // Redireccionar después del login exitoso
        var redirectPath = route.query.from || '/';
        if (redirectPath === '/home') {
          redirectPath = '/';
        }
        router.replace(redirectPath);
      } catch (err) {
        console.error('Error de login:', err);
      }
    };

    return {
      form,
      showPassword,
      tenants,
      authStore,
      currentYear,
      onSubmit
    };
  }
});
</script>

<style scoped>
.login-wrapper {
  display: flex;
  min-height: 100vh;
  width: 100%;
}

/* Sección del formulario */
.login-form-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
  padding: 40px 20px;
}

.login-form-container {
  width: 100%;
  max-width: 420px;
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.login-logo {
  text-align: center;
  margin-bottom: 32px;
}

.logo-img {
  max-width: 180px;
  height: auto;
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 8px 0;
}

.login-subtitle {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.login-input {
  border-radius: 8px;
}

.login-input :deep(.q-field__control) {
  border-radius: 8px;
}

.form-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.login-btn {
  height: 48px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.5px;
  background: linear-gradient(135deg, #0066cc 0%, #004499 100%);
  transition: all 0.3s ease;
}

.login-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3);
}

.btn-text {
  font-weight: 600;
}

.login-footer {
  margin-top: 32px;
  text-align: center;
}

.footer-text {
  font-size: 12px;
  color: #9ca3af;
  margin: 0;
}

/* Sección de branding */
.login-branding-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url('/icons/fondo-auth.png');
  background-size: cover;
  background-position: center;
  position: relative;
  padding: 40px;
}

.branding-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(0, 51, 102, 0.85) 0%,
    rgba(0, 102, 153, 0.75) 100%
  );
}

.branding-content {
  position: relative;
  z-index: 1;
  color: white;
  max-width: 480px;
  text-align: center;
}

.branding-title {
  font-size: 42px;
  font-weight: 700;
  margin: 0 0 16px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.branding-description {
  font-size: 20px;
  font-weight: 300;
  opacity: 0.95;
  margin: 0 0 40px 0;
}

.branding-features {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.1);
  padding: 12px 24px;
  border-radius: 30px;
  backdrop-filter: blur(10px);
}

/* Responsive */
@media (max-width: 1024px) {
  .login-branding-section {
    display: none;
  }

  .login-form-section {
    padding: 20px;
  }

  .login-form-container {
    padding: 32px 24px;
  }
}

@media (max-width: 480px) {
  .login-title {
    font-size: 24px;
  }

  .login-form-container {
    padding: 24px 20px;
  }
}
</style>
