<template>
  <!--
    RoleSecuritySidebar — Barra lateral de roles (Vue 2 Options API).

    Características funcionales:
      1. Estado colapsable: botón para contraer/expandir. Colapsado → solo iconos.
      2. Diseño responsivo: en móvil se oculta por defecto y aparece como menú
         flotante mediante un botón de hamburguesa.
      3. Ítems del sidebar: nombre del rol (name) y descripción (description).

    UX rationale:
      - Los iconos SVG mantienen consistencia visual con el resto del módulo.
      - En colapso, los items muestran solo el ícono; en desktop el más interno
        muestra la información (rol y descripción).
  -->
  <div class="rss-root">
    <!-- Botón hamburguesa (móvil) -->
    <button v-if="!collapsed" class="rss-hamburger" type="button"
      :aria-expanded="mobileOpen ? 'true' : 'false'" aria-label="Abrir menú de roles"
      @click="mobileOpen = true">
      <svg viewBox="0 0 24 24" class="rss-icon" aria-hidden="true">
        <path fill="currentColor" d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" />
      </svg>
      <span class="rss-hamburger-label">Roles</span>
    </button>

    <!-- Overlay para el menú flotante en móvil -->
    <transition name="rss-fade">
      <div v-if="mobileOpen" class="rss-mobile-overlay" @click="mobileOpen = false"></div>
    </transition>

    <!-- Sidebar principal -->
    <aside class="rss-sidebar" :class="{
      'rss-sidebar--collapsed': collapsed,
      'rss-sidebar--mobile-open': mobileOpen
    }">
      <!-- Cabecera: colapsar/expandir + título -->
      <div class="rss-head">
        <button v-if="collapsed" class="rss-head-toggle rss-head-toggle--expand" type="button"
          title="Expandir menú" aria-label="Expandir menú" @click="toggleCollapsed">
          <svg viewBox="0 0 24 24" class="rss-icon" aria-hidden="true">
            <path fill="currentColor" d="M16 18l6-6-6-6v4H0v4h16v4z" />
          </svg>
        </button>

        <template v-if="!collapsed">
          <div class="rss-head-info">
            <span class="rss-head-badge">
              <svg viewBox="0 0 24 24" class="rss-icon rss-icon--sm" aria-hidden="true">
                <path fill="currentColor"
                  d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1.41 16.59l-3.18-3.18 1.41-1.41 1.77 1.77 4.18-4.18 1.41 1.41-5.59 5.59z" />
              </svg>
            </span>
            <div>
              <h3 class="rss-head-title">Roles del sistema</h3>
              <p class="rss-head-subtitle">{{ items.length }} rol(es) disponibles</p>
            </div>
          </div>
          <button class="rss-head-toggle" type="button" title="Colapsar menú" aria-label="Colapsar menú"
            @click="toggleCollapsed">
            <svg viewBox="0 0 24 24" class="rss-icon" aria-hidden="true">
              <path fill="currentColor" d="M8 6l-6 6 6 6v-4h16v-4H8V6z" />
            </svg>
          </button>
        </template>
      </div>

      <!-- Lista de roles -->
      <ul v-if="!collapsed && items.length > 0" class="rss-list" role="listbox">
        <li v-for="role in items" :key="role.id" role="option"
          :aria-selected="isSelected(role) ? 'true' : 'false'">
          <div class="rss-item" :class="{ 'rss-item--active': isSelected(role) }" role="button" tabindex="0"
            :title="role.name" @click="selectRole(role)" @keyup.enter="selectRole(role)"
            @keyup.space="selectRole(role)">
            <span class="rss-item-avatar">
              <svg viewBox="0 0 24 24" class="rss-icon" aria-hidden="true">
                <path fill="currentColor" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
              </svg>
            </span>
            <span class="rss-item-body">
              <span class="rss-item-name">{{ role.name || '—' }}</span>
              <span class="rss-item-desc">{{ role.description || 'Sin descripción' }}</span>
            </span>
          </div>
        </li>
      </ul>

      <!-- Estado vacío -->
      <div v-if="!collapsed && items.length === 0" class="rss-empty">
        <svg viewBox="0 0 24 24" class="rss-icon rss-icon--lg" aria-hidden="true">
          <path fill="currentColor"
            d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
        </svg>
        <p>No hay roles disponibles.</p>
      </div>
    </aside>
  </div>
</template>

<script>
export default {
  name: "RoleSecuritySidebar",

  props: {
    /** Lista de roles que se visualizará en el sidebar. */
    items: {
      type: Array,
      default: function () {
        return [];
      },
    },
    /** Rol seleccionado actualmente. */
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
    };
  },

  methods: {
    toggleCollapsed() {
      this.collapsed = !this.collapsed;
      if (this.collapsed) {
        this.mobileOpen = false;
      }
    },

    isSelected(role) {
      if (this.value == null) return false;
      if (typeof this.value === "object" && this.value !== null) {
        return this.value.id === role.id;
      }
      return this.value === role.id;
    },

    selectRole(role) {
      this.$emit("input", role);
      this.$emit("select", role);
      this.mobileOpen = false;
    },
  },
};
</script>

<style scoped>
.rss-root {
  position: relative;
  width: 100%;
}

/* ───────── Botón hamburguesa (móvil) ───────── */
.rss-hamburger {
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

.rss-hamburger .rss-icon {
  width: 20px;
  height: 20px;
}

.rss-hamburger:hover {
  background: #eaf6ef;
}

/* ───────── Overlay móvil ───────── */
.rss-mobile-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.4);
  z-index: 1040;
}

/* ───────── Sidebar ───────── */
.rss-sidebar {
  background: #ffffff;
  border: 1px solid #e5ede8;
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.rss-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  padding: 16px;
  background: linear-gradient(135deg, #0b6e4f 0%, #1b9e5c 100%);
  color: #ffffff;
}

.rss-head-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.rss-head-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.16);
}

.rss-head-title {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.25;
  color: #ffffff;
}

.rss-head-subtitle {
  margin: 2px 0 0;
  font-size: 12px;
  color: #d7efe1;
}

.rss-head-toggle {
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

.rss-head-toggle:hover {
  background: rgba(255, 255, 255, 0.28);
}

.rss-head-toggle .rss-icon {
  width: 22px;
  height: 22px;
}

/* ───────── Lista de roles ───────── */
.rss-list {
  list-style: none;
  margin: 0;
  padding: 8px;
  max-height: 60vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

.rss-item {
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

.rss-item:hover {
  background: #f2faf6;
}

/* Rol activo: resaltado */
.rss-item--active {
  background: #e0f3e8;
  border-color: #1b9e5c;
  box-shadow: 0 2px 10px rgba(27, 158, 92, 0.18);
  transform: translateX(2px);
}

.rss-item--active .rss-item-name {
  color: #0b6e4f;
  font-weight: 700;
}

.rss-item-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #eaf6ef;
  color: #0b6e4f;
  flex-shrink: 0;
}

.rss-item-avatar .rss-icon {
  width: 16px;
  height: 16px;
}

.rss-item-body {
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
}

.rss-item-name {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rss-item-desc {
  font-size: 12px;
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ───────── Estado vacío ───────── */
.rss-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 32px 16px;
  color: #6b7280;
  text-align: center;
  font-size: 14px;
}

.rss-icon--lg {
  width: 44px;
  height: 44px;
  opacity: 0.5;
}

.rss-icon--sm {
  width: 18px;
  height: 18px;
}

.rss-icon {
  width: 22px;
  height: 22px;
  display: block;
}

/* ───────── Responsive ───────── */
@media (min-width: 769px) {
  .rss-hamburger {
    display: none;
  }
}

@media (max-width: 768px) {
  .rss-sidebar {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: min(88vw, 320px);
    border-radius: 14px 0 0 14px;
    z-index: 1050;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  }

  .rss-sidebar--mobile-open {
    transform: translateX(0);
  }
}

/* Fade para el overlay móvil */
.rss-fade-enter-active,
.rss-fade-leave-active {
  transition: opacity 0.25s ease;
}

.rss-fade-enter,
.rss-fade-leave-to {
  opacity: 0;
}
</style>
