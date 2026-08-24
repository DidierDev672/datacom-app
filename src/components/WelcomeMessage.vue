<template>
  <div v-if="isAuthenticated" class="welcome-message">
    <q-banner rounded class="welcome-message__banner">
      <template v-slot:avatar>
        <q-avatar color="primary" text-color="white" icon="waving_hand" />
      </template>

      <div class="welcome-message__title">
        {{ greeting }}, {{ displayName }}
      </div>
      <div class="welcome-message__subtitle">
        !Bienvenido a DataCon! 🖖 Nos alegra tenerte aquí. Tu session esta lista preparada para que continue donde lo
        dejaste.
      </div>
    </q-banner>
  </div>
</template>

<script>
import { mapState } from "pinia";
import { useAuthStore } from "src/stores/authStore";

export default {
  name: "WelcomeMessage",

  computed: {
    ...mapState(useAuthStore, ["isAuthenticated", "user"]),

    displayName() {
      if (this.user && this.user.username) {
        return this.user.username;
      }
      if (this.user && this.user.fullName) {
        return this.user.fullName;
      }
      return "Usuario";
    },

    greeting() {
      const hour = new Date().getHours();

      if (hour < 12) {
        return "Buenos días";
      }
      if (hour < 19) {
        return "Buenas tardes";
      }
      return "Buenas noches";
    },
  },

  created() {
    const authStore = useAuthStore();
    if (!authStore.isAuthenticated) {
      authStore.restoreSession();
    }
  },
};
</script>

<style scoped>
.welcome-message {
  width: 100%;
}

.welcome-message__banner {
  background: linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%);
  border: 1px solid #dbeafe;
}

.welcome-message__title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #0f172a;
  line-height: 1.4;
}

.welcome-message__subtitle {
  margin-top: 4px;
  font-size: 0.875rem;
  color: #64748b;
  line-height: 1.5;
}
</style>
