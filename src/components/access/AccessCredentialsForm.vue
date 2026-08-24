<template>
  <!--
    PASO 2 — Credenciales de acceso (username + contraseña).

    UX aplicada:
      - Recognition over Recall: el username llega pre-poblado con la sugerencia
        del backend; el admin solo confirma.
      - Feedback inmediato: badge "✔ Disponible" o "✗ Ya en uso" debajo del input.
      - Progressive disclosure de los requisitos: lista granular de checks
        de contraseña, cada uno con su propio ícono y color.
      - Toggle show/hide password con aria-label dinámico (accesibilidad).
      - Las contraseñas se comparan solo si ambas tienen contenido (evita
        mostrar "no coinciden" antes de que el usuario haya empezado a escribir).
  -->
  <div class="ac-step">

    <q-banner
      v-if="store.isEditingExistingAccess"
      class="bg-blue-1 text-blue-9 q-mb-md"
      rounded
      dense
    >
      <template v-slot:avatar>
        <q-icon name="info" color="primary" />
      </template>
      Este colaborador ya tiene acceso al sistema. Puede actualizar su username y
      asignar una nueva contraseña para que pueda volver a ingresar.
    </q-banner>

    <!-- ================== USERNAME ================== -->
    <div class="ac-field-block">
      <div class="text-caption text-weight-medium text-grey-8 q-mb-xs">
        Username
      </div>
      <q-input :value="store.username" @input="onUsernameInput" outlined :hint="usernameHint"
        :loading="store.isCheckingUsername || store.isLoadingUsername" :error="store.usernameAvailable === false"
        :error-message="store.usernameAvailable === false ? 'Este username ya está en uso' : undefined" autofocus>
        <template v-slot:prepend>
          <q-icon name="person_outline" />
        </template>
        <template v-slot:append>
          <q-icon v-if="store.usernameAvailable === true" name="check_circle" color="positive" size="20px">
            <q-tooltip>Username disponible</q-tooltip>
          </q-icon>
          <q-icon v-else-if="store.usernameAvailable === false" name="cancel" color="negative" size="20px" />
        </template>
      </q-input>

      <!-- Texto estado: disponibilidad legible -->
      <div v-if="store.usernameAvailable !== null && !store.isCheckingUsername" class="q-mt-xs text-caption"
        :class="store.usernameAvailable ? 'text-positive' : 'text-negative'" aria-live="polite">
        <q-icon :name="store.usernameAvailable ? 'check' : 'close'" size="14px" class="q-mr-xs" />
        {{ store.usernameAvailable ? 'Disponible' : 'Este username ya está en uso' }}
      </div>

      <!-- Alternativa sugerida si la primaria está tomada -->
      <div
        v-if="store.usernameSuggestion && !store.usernameSuggestion.available && store.usernameSuggestion.alternative"
        class="q-mt-xs text-caption text-grey-6">
        Sugerencia alternativa:
        <a href="#" class="ac-suggestion-link"
          @click.prevent="useAlternative">{{ store.usernameSuggestion.alternative }}</a>
      </div>
    </div>

    <!-- ================== CONTRASEÑA ================== -->
    <div class="ac-field-block q-mt-md">
      <div class="text-caption text-weight-medium text-grey-8 q-mb-xs">
        Contraseña
      </div>
      <q-input :value="store.password" @input="onPasswordInput" :type="showPassword ? 'text' : 'password'" outlined
        hint="Debe tener al menos 8 caracteres, mayúscula, número y carácter especial">
        <template v-slot:prepend>
          <q-icon name="lock_outline" />
        </template>
        <template v-slot:append>
          <q-icon :name="showPassword ? 'visibility_off' : 'visibility'" class="cursor-pointer"
            :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'" @click="togglePassword" />
        </template>
      </q-input>

      <!-- Indicadores granulares (a11y: role="list") -->
      <ul class="ac-password-checks q-mt-sm q-pl-none" role="list">
        <li v-for="check in passwordChecksList" :key="check.key" class="ac-check-item"
          :class="check.ok ? 'text-positive' : 'text-grey-5'">
          <q-icon :name="check.ok ? 'check_circle' : 'radio_button_unchecked'" size="14px" class="q-mr-xs" />
          {{ check.label }}
        </li>
      </ul>
    </div>

    <!-- ================== CONFIRMAR CONTRASEÑA ================== -->
    <div class="ac-field-block q-mt-md">
      <div class="text-caption text-weight-medium text-grey-8 q-mb-xs">
        Confirmar contraseña
      </div>
      <q-input :value="store.passwordConfirm" @input="onPasswordConfirmInput"
        :type="showPasswordConfirm ? 'text' : 'password'" outlined :error="passwordsMatch === false"
        :error-message="passwordsMatch === false ? 'Las contraseñas no coinciden' : undefined">
        <template v-slot:prepend>
          <q-icon name="lock_outline" />
        </template>
        <template v-slot:append>
          <q-icon :name="showPasswordConfirm ? 'visibility_off' : 'visibility'" class="cursor-pointer"
            :aria-label="showPasswordConfirm ? 'Ocultar contraseña' : 'Mostrar contraseña'"
            @click="togglePasswordConfirm" />
        </template>
        <template v-slot:append-extra>
          <q-icon v-if="passwordsMatch === true" name="check_circle" color="positive" size="18px" />
        </template>
      </q-input>

      <div v-if="passwordsMatch === true" class="q-mt-xs text-caption text-positive">
        <q-icon name="check" size="14px" class="q-mr-xs" />
        Las contraseñas coinciden
      </div>
    </div>
  </div>
</template>

<script>
import { useAccessForm } from 'src/composables/useAccessForm';

export default {
  name: 'AccessCredentialsForm',

  // Como el proyecto usa @vue/composition-api, podemos integrar el composable
  // dentro de setup() y exponer todo a Options API.
  setup() {
    const {
      store,
      passwordChecksList,
      passwordIsValid,
      passwordsMatch,
      showPassword,
      showPasswordConfirm,
      togglePassword,
      togglePasswordConfirm
    } = useAccessForm();

    return {
      store,
      passwordChecksList,
      passwordIsValid,
      passwordsMatch,
      showPassword,
      showPasswordConfirm,
      togglePassword,
      togglePasswordConfirm
    };
  },

  computed: {
    usernameHint() {
      if (this.store.usernameAvailable === true) return 'Será usado para iniciar sesión';
      if (this.store.usernameAvailable === false) return 'Elige otro o usa la sugerencia alternativa';
      return 'Será usado para iniciar sesión en el sistema';
    }
  },

  mounted() {
    var self = this;
    this.$nextTick(function () {
      if (self.store.username && String(self.store.username).trim().length >= 3) {
        self.store.checkUsernameAvailability();
      }
    });
  },

  methods: {
    onUsernameInput(value) {
      // Normalizamos a minúsculas y filtramos caracteres no permitidos en tiempo real.
      const clean = (value || '').toLowerCase().replace(/[^a-z0-9._]/g, '');
      this.store.username = clean;
    },
    onPasswordInput(value) {
      this.store.password = value || '';
    },
    onPasswordConfirmInput(value) {
      this.store.passwordConfirm = value || '';
    },
    useAlternative() {
      if (this.store.usernameSuggestion && this.store.usernameSuggestion.alternative) {
        this.store.username = this.store.usernameSuggestion.alternative;
      }
    }
  }
};
</script>

<style scoped>
.ac-field-block {
  position: relative;
}

.ac-password-checks {
  list-style: none;
  margin: 0;
}

.ac-check-item {
  font-size: 12px;
  line-height: 1.6;
  display: flex;
  align-items: center;
}

.ac-suggestion-link {
  color: #2563EB;
  font-weight: 500;
  text-decoration: none;
  border-bottom: 1px dashed #93C5FD;
}

.ac-suggestion-link:hover {
  border-bottom-color: #2563EB;
}
</style>
