<template>
  <q-dialog v-model="visible" persistent>
    <q-card class="session-expired-card">
      <q-card-section class="text-center q-pt-xl q-px-lg">
        <div class="session-expired-icon">
          <q-icon name="lock_clock" size="36px" color="white" />
        </div>

        <div class="session-expired-title q-mt-md">
          Tu sesión ha expirado
        </div>

        <p class="session-expired-message q-mt-md">
          Por tu seguridad, el tiempo de acceso a la aplicación terminó.
          Esto es normal y nos ayuda a proteger tu información.
        </p>

        <p class="session-expired-message">
          No te preocupes: no cerramos tu sesión de golpe.
          Puedes leer este mensaje con calma y decidir cuándo volver a entrar.
        </p>

        <p class="session-expired-hint q-mt-sm">
          Para seguir trabajando, inicia sesión nuevamente con tu usuario y contraseña.
        </p>
      </q-card-section>

      <q-card-actions align="center" class="q-pb-xl q-px-lg q-gutter-sm">
        <q-btn flat no-caps label="Entendido" color="grey-7" class="session-expired-btn"
          @click="onDismiss" />
        <q-btn unelevated no-caps label="Iniciar sesión" color="primary" icon="login"
          class="session-expired-btn session-expired-btn--primary" @click="onGoToLogin" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapActions } from "vuex";
import { resetSessionExpiredDialog } from "src/utils/sessionExpiredHandler";

export default {
  name: "SessionExpiredModal",

  data() {
    return {
      visible: false,
    };
  },

  methods: {
    ...mapActions("auth", ["logoutAction"]),

    show() {
      this.visible = true;
    },

    onDismiss() {
      this.visible = false;
      resetSessionExpiredDialog();
    },

    onGoToLogin() {
      this.visible = false;
      resetSessionExpiredDialog();
      this.logoutAction();
    },
  },
};
</script>

<style scoped>
.session-expired-card {
  width: 100%;
  max-width: 440px;
  border-radius: 16px;
  overflow: hidden;
}

.session-expired-icon {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
  box-shadow: 0 4px 14px rgba(249, 115, 22, 0.3);
}

.session-expired-title {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  letter-spacing: -0.01em;
}

.session-expired-message {
  font-size: 15px;
  line-height: 1.6;
  color: #475569;
  margin: 0;
}

.session-expired-hint {
  font-size: 14px;
  line-height: 1.5;
  color: #64748b;
  margin: 0;
  font-weight: 500;
}

.session-expired-btn {
  min-width: 140px;
  border-radius: 8px;
  font-weight: 600;
}

.session-expired-btn--primary {
  padding: 0 20px;
}
</style>
