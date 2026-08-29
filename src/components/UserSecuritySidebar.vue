<template>
  <!--
    UserSecuritySidebar — Barra lateral de usuarios (Vue 2 Options API).

    Características funcionales:
      1. Estado colapsable: botón para contraer/expandir. Colapsado → solo iconos.
      2. Diseño responsivo: en móvil se oculta por defecto y aparece como menú
         flotante mediante un botón de hamburguesa.
      3. Usuario activo: clase CSS específica para resaltar el usuario seleccionado.

    UX rationale:
      - Los iconos SVG (no fuente de iconos) mantienen consistencia visual y no
        dependen de librerías externas.
      - En colapso, los items muestran solo el ícono; en desktop el más interno
        muestra la información (nombre, documento, username).
      - En móvil se usa un drawer flotante para no ocupar el ancho de la pantalla.
  -->
  <div class="uss-root">
    <!-- Botón hamburguesa (móvil) -->
    <button v-if="!collapsed" class="uss-hamburger" type="button" :aria-expanded="mobileOpen ? 'true' : 'false'"
      aria-label="Abrir menú de usuarios" @click="mobileOpen = true">
      <svg viewBox="0 0 24 24" class="uss-icon" aria-hidden="true">
        <path fill="currentColor" d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" />
      </svg>
      <span class="uss-hamburger-label">Usuarios</span>
    </button>

    <!-- Overlay para el menú flotante en móvil -->
    <transition name="uss-fade">
      <div v-if="mobileOpen" class="uss-mobile-overlay" @click="mobileOpen = false"></div>
    </transition>

    <!-- Sidebar principal -->
    <aside class="uss-sidebar" :class="{
      'uss-sidebar--collapsed': collapsed,
      'uss-sidebar--mobile-open': mobileOpen
    }">
      <!-- Cabecera: colapsar/expandir (desktop) + título -->
      <div class="uss-head">
        <button v-if="collapsed" class="uss-head-toggle uss-head-toggle--expand" type="button" title="Expandir menú"
          aria-label="Expandir menú" @click="toggleCollapsed">
          <svg viewBox="0 0 24 24" class="uss-icon" aria-hidden="true">
            <path fill="currentColor" d="M16 18l6-6-6-6v4H0v4h16v4z" />
          </svg>
        </button>

        <template v-if="!collapsed">
          <div class="uss-head-info">
            <span class="uss-head-badge">
              <svg viewBox="0 0 24 24" class="uss-icon uss-icon--sm" aria-hidden="true">
                <path fill="currentColor"
                  d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-3.3 0-8 1.7-8 5v2h16v-2c0-3.3-4.7-5-8-5z" />
              </svg>
            </span>
            <div>
              <h3 class="uss-head-title">Colaboradores con acceso</h3>
              <p class="uss-head-subtitle">{{ items.length }} usuario(s) del sistema</p>
            </div>
          </div>
          <button class="uss-head-toggle" type="button" title="Colapsar menú" aria-label="Colapsar menú"
            @click="toggleCollapsed">
            <svg viewBox="0 0 24 24" class="uss-icon" aria-hidden="true">
              <path fill="currentColor" d="M8 6l-6 6 6 6v-4h16v-4H8V6z" />
            </svg>
          </button>
        </template>
      </div>

      <!-- Lista de usuarios -->
      <ul v-if="!collapsed && items.length > 0" class="uss-list" role="listbox">
        <li v-for="user in items" :key="user.collaboratorId" role="option"
          :aria-selected="isSelected(user) ? 'true' : 'false'">
          <div class="uss-item" :class="{ 'uss-item--active': isSelected(user) }" role="button" tabindex="0"
            :title="user.nombreCompleto" @click="selectUser(user)" @keyup.enter="selectUser(user)"
            @keyup.space="selectUser(user)">
            <span class="uss-item-body">
              <span class="uss-item-name">{{ user.nombreCompleto }}</span>
              <span class="uss-item-doc">ID: {{ user.numeroDocumento || '—' }}</span>
              <span class="uss-item-user">@{{ user.username || '—' }}</span>
            </span>
            <span class="uss-item-checkbox" @click.stop>
              <input type="checkbox" class="uss-checkbox-native" :id="'uss-check-' + user.collaboratorId"
                v-model="isChecked[user.collaboratorId]" @change="onCheckChange(user, $event)" />
              <label class="uss-checkbox" :for="'uss-check-' + user.collaboratorId">
                <svg v-if="isChecked[user.collaboratorId]" viewBox="0 0 24 24" class="uss-check-svg" aria-hidden="true">
                  <path fill="none" stroke="currentColor" stroke-width="3" d="M5 13l4 4L19 7" fill-rule="evenodd" />
                </svg>
              </label>
            </span>
          </div>
        </li>
      </ul>

      <!-- Estado vacío -->
      <div v-if="!collapsed && items.length === 0" class="uss-empty">
        <svg viewBox="0 0 24 24" class="uss-icon uss-icon--lg" aria-hidden="true">
          <path fill="currentColor"
            d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-3.3 0-8 1.7-8 5v2h16v-2c0-3.3-4.7-5-8-5z" />
        </svg>
        <p>No hay usuarios con acceso.</p>
      </div>
    </aside>
  </div>
</template>

<script>
export default {
  name: "UserSecuritySidebar",

  props: {
    /** Lista de usuarios que se visualizará en el sidebar. */
    items: {
      type: Array,
      default: function () {
        return [];
      },
    },
    /** Colaborador (por collaboratorId) seleccionado actualmente. */
    value: {
      type: [String, Number, Object],
      default: null,
    },
  },

  data() {
    return {
      /** Estado colapsado (solo iconos). */
      collapsed: false,
      /** Menú flotante abierto en móviles. */
      mobileOpen: false,
      /**
       * Fuente de la verdad del estado inicial de cada casilla.
       * Mapa clave=valor (collaboratorId → boolean) para que el checkbox de cada
       * usuario se conecte vía v-model.
       */
      isChecked: {},
    };
  },

  watch: {
    /**
     * Cuando cambian los items (p. ej. al cargar los usuarios), inicializamos
     * el estado de las casillas. Por defecto quedan deseleccionadas: la selección
     * se hace de forma manual por el usuario.
     */
    items: {
      handler(users) {
        var self = this;
        (users || []).forEach(function (user) {
          if (self.isChecked[user.collaboratorId] === undefined) {
            self.isChecked[user.collaboratorId] = false;
          }
        });
      },
      immediate: true,
    },
  },

  methods: {
    toggleCollapsed() {
      this.collapsed = !this.collapsed;
      // Al colapsar, también cerramos el menú móvil si estaba abierto.
      if (this.collapsed) {
        this.mobileOpen = false;
      }
    },

    onCheckChange(user) {
      this.$emit("check", {
        user: user,
        checked: !!this.isChecked[user.collaboratorId],
      });
    },

    isSelected(user) {
      if (this.value == null) return false;
      if (typeof this.value === "object" && this.value !== null) {
        return (
          this.value.collaboratorId === user.collaboratorId ||
          this.value.id === user.collaboratorId
        );
      }
      return this.value === user.collaboratorId;
    },

    selectUser(user) {
      this.$emit("input", user);
      this.$emit("select", user);
      // En móvil, al elegir un usuario se cierra el menú flotante.
      this.mobileOpen = false;
    },
  },
};
</script>

<style scoped>
.uss-root {
  position: relative;
  width: 100%;
}

/* ───────── Botón hamburguesa (móvil) ───────── */
.uss-hamburger {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border: 1px solid #dbe7de;
  border-radius: 10px;
  background: #ffffff;
  color: #0b6e4f;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(11, 110, 79, 0.08);
}

.uss-hamburger .uss-icon {
  width: 20px;
  height: 20px;
}

.uss-hamburger:hover {
  background: #eaf6ef;
}

/* ───────── Overlay móvil ───────── */
.uss-mobile-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.4);
  z-index: 1040;
}

/* ───────── Sidebar ───────── */
.uss-sidebar {
  background: #ffffff;
  border: 1px solid #e5ede8;
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.uss-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  padding: 16px;
  background: linear-gradient(135deg, #0b6e4f 0%, #1b9e5c 100%);
  color: #ffffff;
}

.uss-head-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.uss-head-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.16);
}

.uss-head-title {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.25;
  color: #ffffff;
}

.uss-head-subtitle {
  margin: 2px 0 0;
  font-size: 12px;
  color: #d7efe1;
}

.uss-head-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.16);
  color: #ffffff;
  cursor: pointer;
  flex-shrink: 0;
}

.uss-head-toggle:hover {
  background: rgba(255, 255, 255, 0.28);
}

.uss-head-toggle .uss-icon {
  width: 22px;
  height: 22px;
}

/* ───────── Lista de usuarios ───────── */
.uss-list {
  list-style: none;
  margin: 0;
  padding: 8px;
  max-height: 60vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.uss-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px;
  border: 1px solid transparent;
  border-radius: 10px;
  background: transparent;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s ease, border-color 0.15s ease,
    transform 0.15s ease;
}

.uss-item:hover {
  background: #f2faf6;
}

/* Usuario activo: clase específica de resaltado */
.uss-item--active {
  background: #e0f3e8;
  border-color: #1b9e5c;
  box-shadow: 0 2px 10px rgba(27, 158, 92, 0.18);
  transform: translateX(2px);
}

.uss-item--active .uss-item-name {
  color: #0b6e4f;
  font-weight: 700;
}

.uss-item-body {
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
}

.uss-item-name {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.uss-item-doc,
.uss-item-user {
  font-size: 12px;
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ───────── Checkbox personalizado (a la derecha del item) ───────── */
.uss-item-checkbox {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-left: 10px;
}

/* Ocultamos el input nativo y usamos el label como la casilla visible */
.uss-checkbox-native {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  pointer-events: none;
}

.uss-checkbox {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border: 2px solid #b6cfc0;
  border-radius: 6px;
  background: #ffffff;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;
}

.uss-check-svg {
  width: 15px;
  height: 15px;
  color: #ffffff;
  opacity: 0;
  transform: scale(0.6);
  transition: opacity 0.15s ease, transform 0.15s ease;
}

/* Estado marcado: v-model conecta el input con isChecked[collaboratorId] */
.uss-checkbox-native:checked+.uss-checkbox {
  background: #1b9e5c;
  border-color: #1b9e5c;
}

.uss-checkbox-native:checked+.uss-checkbox .uss-check-svg {
  opacity: 1;
  transform: scale(1);
}

.uss-checkbox-native:focus-visible+.uss-checkbox {
  outline: 2px solid #0b6e4f;
  outline-offset: 2px;
}

/* ───────── Estado vacío ───────── */
.uss-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 32px 16px;
  color: #6b7280;
  text-align: center;
  font-size: 14px;
}

.uss-icon--lg {
  width: 44px;
  height: 44px;
  opacity: 0.5;
}

.uss-icon--sm {
  width: 18px;
  height: 18px;
}

.uss-icon {
  width: 22px;
  height: 22px;
  display: block;
}

/* ───────── Responsive ───────── */
@media (min-width: 769px) {

  /* En desktop el sidebar siempre es visible; ocultamos el hamburguesa. */
  .uss-hamburger {
    display: none;
  }
}

@media (max-width: 768px) {

  /* En móvil, el sidebar queda oculto y se muestra como menú flotante. */
  .uss-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: min(88vw, 320px);
    border-radius: 0 14px 14px 0;
    z-index: 1050;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  }

  .uss-sidebar--mobile-open {
    transform: translateX(0);
  }
}

/* Fade para el overlay móvil */
.uss-fade-enter-active,
.uss-fade-leave-active {
  transition: opacity 0.25s ease;
}

.uss-fade-enter,
.uss-fade-leave-to {
  opacity: 0;
}
</style>
