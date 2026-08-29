<template>
  <!--
    RoleSecurityView — Seguridad y asignación de roles.

    UX rationale:
      - El header usa un gradiente cromático verde para transmitir confianza,
        seguridad y progreso, y comunica de forma clara en qué página está el usuario.
      - Mientras se consumen los endpoints (colaboradores + usuarios) se muestra
        un LoadingOverlay de pantalla completa con efecto fade.
      - Luego se lista en el sidebar los colaboradores que ya tienen acceso al
        sistema (unión por collaboratorId).
      - Si el endpoint de usuarios responde 400, se muestra un modal de error
        con un mensaje amigable para no saturar al usuario.
  -->
  <q-page class="rs-page">
    <!-- Header con gradiente cromático verde -->
    <header class="rs-header">
      <Transition name="slide-in" appear>
        <div class="rs-header-inner">
          <div class="rs-header-badge">
            <q-icon name="shield" size="26px" color="white" />
          </div>
          <div class="rs-header-text">
            <h1 class="rs-title">Seguridad y roles</h1>
            <p class="rs-subtitle">
              Conoce quién tiene acceso al sistema y gestiona sus roles, todo en
              un solo lugar y con la tranquilidad de mantener tu información segura.
            </p>
          </div>
        </div>
      </Transition>
    </header>

    <!-- Cuerpo: sidebar de usuarios (izquierda) + sidebar de roles (derecha) -->
    <div class="rs-body q-pa-md">
      <Transition name="slide-in" appear>
        <div class="rs-body-inner">
          <div class="rs-columns">
            <!-- Barra lateral de usuarios -->
            <div class="rs-column rs-column--users">
              <UserSecuritySidebar
                :items="store.usersForSidebar"
                :value="selectedUser"
                @input="onSelectUser"
                @select="onSelectUser"
              />
            </div>

            <!-- Barra lateral de roles -->
            <div class="rs-column rs-column--roles">
              <RoleSecuritySidebar
                :items="roleStore.roles"
                :value="selectedRole"
                @input="onSelectRole"
                @select="onSelectRole"
              />
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Modal de error amigable cuando el endpoint de usuarios responde 400 -->
    <q-dialog v-model="errorModalVisible" persistent>
      <q-card class="rs-error-card">
        <q-card-section class="row no-wrap items-center">
          <div class="rs-error-icon bg-green-5">
            <q-icon name="shield" size="30px" color="white" />
          </div>
          <div class="q-ml-sm rs-error-text">
            <h3 class="rs-error-title">Vaya, tuvimos un pequeño contratiempo</h3>
            <p class="rs-error-msg">
              No pudimos obtener la información de los usuarios del sistema en
              este momento. Por favor, intenta de nuevo en unos segundos. Si el
              problema continúa, avísale al administrador para ayudarte.
            </p>
          </div>
        </q-card-section>
        <q-card-actions align="right" class="q-pr-md q-pb-md">
          <q-btn unelevated rounded color="primary" label="Reintentar" no-caps
            @click="retryLoad" />
          <q-btn flat rounded color="grey-7" label="Cerrar" no-caps
            @click="errorModalVisible = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Modal de error amigable cuando el endpoint de roles responde 400 -->
    <q-dialog v-model="roleErrorModalVisible" persistent>
      <q-card class="rs-error-card">
        <q-card-section class="row no-wrap items-center">
          <div class="rs-error-icon bg-green-5">
            <q-icon name="admin_panel_settings" size="30px" color="white" />
          </div>
          <div class="q-ml-sm rs-error-text">
            <h3 class="rs-error-title">Tranquilo, no fue tu culpa</h3>
            <p class="rs-error-msg">
              Hubo un pequeño impase al intentar obtener la lista de roles del
              sistema. Respira hondo e inténtalo de nuevo en unos segundos; si
              el problema persiste, el administrador podrá ayudarte.
            </p>
          </div>
        </q-card-section>
        <q-card-actions align="right" class="q-pr-md q-pb-md">
          <q-btn unelevated rounded color="primary" label="Reintentar" no-caps
            @click="retryRolesLoad" />
          <q-btn flat rounded color="grey-7" label="Cerrar" no-caps
            @click="roleErrorModalVisible = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Loading de pantalla completa -->
    <LoadingOverlay :is-loading="store.isLoading || roleStore.isLoading"
      message="Cargando información de seguridad…" />
  </q-page>
</template>

<script>
import LoadingOverlay from "src/components/LoadingOverlay.vue";
import UserSecuritySidebar from "src/components/UserSecuritySidebar.vue";
import RoleSecuritySidebar from "src/components/RoleSecuritySidebar.vue";
import { useRoleUsersStore } from "src/stores/roleUsersStore";
import { useRoleStore } from "src/stores/roleStore";
import { pinia } from "src/stores/pinia";

export default {
  name: "RoleSecurityView",

  components: {
    LoadingOverlay,
    UserSecuritySidebar,
    RoleSecuritySidebar,
  },

  data() {
    return {
      selectedUser: null,
      selectedRole: null,
      errorModalVisible: false,
      roleErrorModalVisible: false,
    };
  },

  computed: {
    store() {
      return useRoleUsersStore(pinia);
    },
    roleStore() {
      return useRoleStore(pinia);
    },
  },

  watch: {
    "store.usersErrorStatus": {
      handler(status) {
        if (status != null && status >= 400 && status < 500) {
          this.errorModalVisible = true;
        }
      },
      immediate: true,
    },
    "roleStore.rolesErrorStatus": {
      handler(status) {
        if (status != null && status >= 400 && status < 500) {
          this.roleErrorModalVisible = true;
        }
      },
      immediate: true,
    },
  },

  mounted() {
    this.store.loadData();
    this.roleStore.loadRoles();
  },

  methods: {
    onSelectUser(user) {
      this.selectedUser = user;
    },

    onSelectRole(role) {
      this.selectedRole = role;
    },

    retryLoad() {
      this.errorModalVisible = false;
      this.store.reset();
      this.store.loadData();
    },

    retryRolesLoad() {
      this.roleErrorModalVisible = false;
      this.roleStore.reset();
      this.roleStore.loadRoles();
    },
  },
};
</script>

<style scoped>
.rs-page {
  background-color: #f4f7f5;
  min-height: 100%;
}

/* Header: gradiente cromático verde */
.rs-header {
  background: linear-gradient(135deg, #0b6e4f 0%, #1b9e5c 45%, #4cd964 100%);
  padding: 28px 24px 32px;
  color: #fff;
}

.rs-header-inner {
  display: flex;
  align-items: center;
  gap: 16px;
  max-width: 1400px;
  margin: 0 auto;
}

.rs-header-badge {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  backdrop-filter: blur(4px);
}

.rs-header-text {
  flex: 1;
  min-width: 0;
}

.rs-title {
  font-size: 26px;
  font-weight: 700;
  margin: 0 0 4px 0;
  color: #fff;
}

.rs-subtitle {
  font-size: 14px;
  margin: 0;
  color: #e8f5ee;
  max-width: 640px;
  line-height: 1.45;
}

.rs-body {
  max-width: 1400px;
  margin: 0 auto;
}

.rs-body-inner {
  width: 100%;
}

/* Disposición de dos columnas: usuarios (izquierda) + roles (derecha) */
.rs-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  align-items: start;
}

.rs-column {
  min-width: 0;
}

@media (max-width: 1024px) {
  .rs-columns {
    grid-template-columns: 1fr;
  }
}

/* Modal de error amigable */
.rs-error-card {
  border-radius: 16px !important;
  max-width: 460px;
  width: 100%;
}

.rs-error-icon {
  width: 54px;
  height: 54px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.rs-error-text {
  min-width: 0;
}

.rs-error-title {
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
}

.rs-error-msg {
  margin: 0;
  font-size: 14px;
  line-height: 1.55;
  color: #6b7280;
}

/* -------------------------------
   Transición "slide-in" nativa de Vue
   -------------------------------
   1. <Transition name="slide-in"> enlaza automáticamente las clases con
      prefijo "slide-in".
   2. transform: translateX(100%) mueve el elemento fuera a la derecha
      antes de empezar; cambia a -100% si prefieres que entre desde la
      izquierda.
   3. opacity añade un desvanecimiento suave junto al movimiento.
-------------------------------- */

/* Estado inicial (entrada): fuera de pantalla a la derecha + transparente */
.slide-in-enter-active {
  transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.6s ease;
}

.slide-in-enter {
  transform: translateX(100%);
  opacity: 0;
}

/* Estado final: en su lugar y totalmente visible */
.slide-in-enter-to {
  transform: translateX(0);
  opacity: 1;
}

/* Salida (opcional): animación inversa para cuando el nodo se destruye */
.slide-in-leave-active {
  transition: transform 0.5s ease, opacity 0.5s ease;
}

.slide-in-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

@media (max-width: 768px) {
  .rs-header {
    padding: 22px 16px 26px;
  }

  .rs-title {
    font-size: 22px;
  }

  .rs-subtitle {
    font-size: 13px;
  }

  .rs-header-badge {
    width: 46px;
    height: 46px;
  }

  .rs-body {
    padding: 16px !important;
  }
}
</style>
