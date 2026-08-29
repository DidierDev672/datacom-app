<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Header con Gradiente Institucional -->
    <q-header class="header-premium">
      <q-toolbar class="q-px-lg">
        <q-btn flat dense round icon="menu" class="menu-toggle-btn" aria-label="Menú"
          @click="leftDrawerOpen = !leftDrawerOpen" />
        <q-toolbar-title class="header-title">
          <span class="text-weight-light">Módulo</span>
          <span class="text-weight-bold"> Abastecimiento</span>
        </q-toolbar-title>
        <q-space />
        <q-btn flat round dense icon="power_settings_new" class="logout-btn" @click="logout" />
      </q-toolbar>
    </q-header>

    <!-- Sidebar Optimizado UX -->
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered :width="isCollapsed ? 72 : 270" class="sidebar-drawer">
      <div :class="['sidebar', { 'sidebar--collapsed': isCollapsed }]">
        <!-- Logo + Toggle -->
        <div class="sidebar__header">
          <img v-show="!isCollapsed" src="/icons/app-icon.png" class="sidebar__logo" alt="Logo" />
          <q-btn flat round dense :icon="isCollapsed ? 'menu_open' : 'keyboard_double_arrow_left'"
            class="sidebar__toggle-btn" @click="toggleSidebar"
            :aria-label="isCollapsed ? 'Expandir menú' : 'Colapsar menú'" />
        </div>

        <!-- Buscador -->
        <div class="sidebar__search" v-show="!isCollapsed">
          <q-input v-model="searchQuery" dense outlined placeholder="Buscar menú..." class="sidebar__search-input"
            clearable>
            <template v-slot:prepend>
              <q-icon name="search" size="18px" />
            </template>
          </q-input>
        </div>

        <q-separator class="sidebar__divider" />

        <!-- Navegación -->
        <nav class="sidebar__nav">
          <div v-for="group in sidebarMenu" :key="group.id" class="sidebar__group"
            :class="{ 'sidebar__group--active': isActiveGroup(group) }">
            <!-- Nivel 1: Categoría -->
            <button class="sidebar__group-btn" @click="toggleGroup(group.id)"
              :aria-expanded="group.expanded ? 'true' : 'false'">
              <div class="sidebar__icon-wrap">
                <q-icon :name="group.icon" />
              </div>
              <span v-show="!isCollapsed" class="sidebar__group-label">{{
                group.title
              }}</span>
              <q-icon v-show="!isCollapsed" :name="group.expanded ? 'expand_less' : 'chevron_right'"
                class="sidebar__arrow" :class="{ 'sidebar__arrow--open': group.expanded }" />
            </button>

            <!-- Nivel 2: Sub-ítems -->
            <transition name="slide-accordion">
              <ul v-show="group.expanded && !isCollapsed" class="sidebar__items" role="list">
                <li v-for="child in group.children" :key="child.id || child.routeName || child.path" role="listitem">
                  <router-link v-if="!isSubgroup(child) && isMenuItemNavegable(child)" :to="childRouteTo(child)"
                    class="sidebar__item" active-class="sidebar__item--active" @click.native.stop>
                    <q-icon :name="child.icon" class="sidebar__item-icon" />
                    <span>{{ child.title }}</span>
                  </router-link>
                  <span v-else-if="!isSubgroup(child)" class="sidebar__item sidebar__item--sin-permiso"
                    aria-disabled="true">
                    <q-icon :name="child.icon" class="sidebar__item-icon" />
                    <span>{{ child.title }}</span>
                  </span>

                  <div v-else class="sidebar__subgroup"
                    :class="{ 'sidebar__subgroup--active': isSubgroupActive(child) }">
                    <button class="sidebar__subgroup-btn" @click="toggleSubgroup(group.id, child.id)"
                      :aria-expanded="child.expanded ? 'true' : 'false'">
                      <q-icon :name="child.icon" class="sidebar__item-icon" />
                      <span class="sidebar__subgroup-label">{{ child.title }}</span>
                      <q-icon :name="child.expanded ? 'expand_less' : 'chevron_right'" class="sidebar__subgroup-arrow"
                        :class="{ 'sidebar__subgroup-arrow--open': child.expanded }" />
                    </button>

                    <transition name="slide-accordion">
                      <ul v-show="child.expanded" class="sidebar__subitems" role="list">
                        <li v-for="subchild in child.children" :key="subchild.routeName || subchild.path"
                          role="listitem">
                          <router-link v-if="isMenuItemNavegable(subchild)" :to="childRouteTo(subchild)"
                            class="sidebar__item sidebar__item--nested" active-class="sidebar__item--active"
                            @click.native.stop>
                            <q-icon :name="subchild.icon" class="sidebar__item-icon" />
                            <span>{{ subchild.title }}</span>
                          </router-link>
                          <span v-else class="sidebar__item sidebar__item--nested sidebar__item--sin-permiso"
                            aria-disabled="true">
                            <q-icon :name="subchild.icon" class="sidebar__item-icon" />
                            <span>{{ subchild.title }}</span>
                          </span>
                        </li>
                      </ul>
                    </transition>
                  </div>
                </li>
              </ul>
            </transition>
          </div>
        </nav>

        <!-- Solicitudes con permiso de ruta -->
        <template v-if="!isCollapsed">
          <q-separator class="sidebar__divider" />

          <div class="sidebar__group">
            <div class="sidebar__group-btn sidebar__group-btn--static">
              <div class="sidebar__icon-wrap">
                <q-icon name="auto_stories" />
              </div>
              <span class="sidebar__group-label">Solicitudes</span>
            </div>

            <div v-if="permisosStore.loading" class="permisos-loading">
              <div class="spinner-ring" aria-label="Cargando permisos..."></div>
              <span class="permisos-loading__text">Verificando permisos...</span>
            </div>

            <div v-else-if="permisosStore.error" class="permisos-error" role="alert">
              <span>{{ permisosStore.error }}</span>
            </div>

            <ul v-else class="sidebar__items" role="list">
              <li v-for="route in permisosStore.solicitudesRoutes" :key="route.path" role="listitem">
                <router-link v-if="route.permitted" :to="route.path" class="sidebar__item"
                  active-class="sidebar__item--active">
                  <q-icon name="chevron_right" class="sidebar__item-icon" />
                  <span>{{ route.label }}</span>
                </router-link>
                <span v-else class="sidebar__item sidebar__item--sin-permiso" aria-disabled="true"
                  :title="'No tienes permiso para acceder a ' + route.label">
                  <q-icon name="chevron_right" class="sidebar__item-icon" />
                  <span>{{ route.label }}</span>
                </span>
              </li>
            </ul>
          </div>
        </template>

        <!-- Footer -->
        <q-separator class="sidebar__divider" />
        <div class="sidebar__footer">
          <router-link to="/" class="sidebar__item sidebar__item--home">
            <q-icon name="home" class="sidebar__item-icon" />
            <span v-show="!isCollapsed">Inicio</span>
          </router-link>
          <button class="sidebar__item sidebar__item--logout" @click="logout">
            <q-icon name="logout" class="sidebar__item-icon" />
            <span v-show="!isCollapsed">Cerrar sesión</span>
          </button>
        </div>
      </div>
    </q-drawer>

    <q-page-container class="main-content">
      <keep-alive>
        <router-view />
      </keep-alive>
    </q-page-container>

  </q-layout>
</template>

<script>
import { filtrarMenu } from "src/mixins/mixinAbastecimiento";
import { useAccessStore } from "src/router/Access.store";
import { useAbastecimientoPermisosStore } from "src/stores/abastecimientoPermisosStore";
import { useAuthStore } from "src/stores/authStore";
import { pinia } from "src/stores/pinia";
import { mapActions } from "vuex";

export default {
  name: "AbastecimientoLayout",

  data() {
    return {
      leftDrawerOpen: false,
      searchQuery: "",
      isCollapsed: JSON.parse(
        localStorage.getItem("sidebar_collapsed") || "false"
      ),
      menuItems: [
        {
          id: "solicitudes",
          title: "Solicitudes",
          icon: "description",
          expanded: false,
          children: [
            /*{
              title: "Mis órdenes",
              routeName: "mis-ordenes-abastecimiento",
              icon: "format_list_bulleted",
            },*/
            {
              id: "presupuesto",
              title: "Presupuesto",
              icon: "account_balance_wallet",
              expanded: false,
              children: [
                {
                  title: "Crear planes",
                  routeName: "Crear-plan-abastecimiento",
                  icon: "add_task",
                },
                {
                  title: "Lista de planes",
                  routeName: "lista-planes-abastecimiento",
                  icon: "inventory",
                },
              ],
            },
            {
              id: "rubros",
              title: "Rubros",
              icon: "category",
              expanded: false,
              children: [
                {
                  title: "Crear rubros del presupuesto",
                  routeName: "crear-rubros",
                  icon: "add_box",
                },
                {
                  title: "Lista de categorías de presupuesto",
                  routeName: "lista-categorias-presupuesto",
                  icon: "table_view",
                },
              ],
            },
            {
              id: "abastecimiento-solicitudes",
              title: "Abastecimiento",
              icon: "local_shipping",
              expanded: false,
              children: [
                {
                  title: "Crear solicitud de abastecimiento",
                  routeName: "crear-solicitud-abastecimiento",
                  icon: "post_add",
                },
                {
                  title: "Lista Abastecimiento",
                  routeName: "lista-solicitudes-abastecimiento",
                  icon: "receipt",
                },
              ],
            },
            {
              id: "aprobaciones",
              title: "Aprobaciones",
              icon: "fact_check",
              expanded: false,
              children: [
                {
                  title: "Aprobaciones (Legacy)",
                  routeName: "aprobaciones-pendientes",
                  icon: "approval",
                },
                {
                  title: "Aprobación de Abastecimiento",
                  routeName: "aprobacion-solicitudes-abastecimiento",
                  icon: "fact_check",
                },
              ],
            },
          ],
        },
        // {
        //   id: "compras",
        //   title: "Compras",
        //   icon: "shopping_cart_checkout",
        //   expanded: false,
        //   children: [
        //     {
        //       id: "compras-gestion",
        //       title: "Compras",
        //       icon: "shopping_cart",
        //       expanded: false,
        //       children: [
        //         {
        //           title: "Gestión de órdenes de compra",
        //           routeName: "gestion-orden-compra",
        //           icon: "shopping_cart",
        //         },
        //         {
        //           title: "Lista de gestión de compras",
        //           routeName: "lista-transacciones-compra",
        //           icon: "format_list_bulleted",
        //         },
        //       ],
        //     },
        //     {
        //       id: "compras-cotizaciones",
        //       title: "Cotizaciones",
        //       icon: "request_quote",
        //       expanded: false,
        //       children: [
        //         {
        //           title: "Comparaciones de proveedores",
        //           routeName: "comparacion-proveedores-compra",
        //           icon: "compare_arrows",
        //         },
        //         {
        //           title: "Lista de comparaciones",
        //           routeName: "lista-comparaciones-proveedores-compra",
        //           icon: "format_list_bulleted",
        //         },
        //       ],
        //     },
        //     {
        //       id: "compras-por-cotizacion",
        //       title: "Compras por comparación",
        //       icon: "shopping_bag",
        //       expanded: false,
        //       children: [
        //         {
        //           title: "Lista de compras por comparación",
        //           routeName: "lista-compras-registradas",
        //           icon: "format_list_bulleted",
        //         },
        //       ],
        //     },
        //   ],
        // },
        // {
        //   id: "configuracion",
        //   title: "Configuración",
        //   icon: "tune",
        //   expanded: false,
        //   children: [
        //     {
        //       title: "Registrar proveedor",
        //       routeName: "registrar-proveedor-nuevo",
        //       icon: "person_add",
        //     },
        //     {
        //       title: "Lista proveedores",
        //       routeName: "lista-proveedores-terceros",
        //       icon: "groups",
        //     },
        //     {
        //       title: "Ver perfil de usuario",
        //       routeName: "perfil-usuario",
        //       icon: "account_circle",
        //     },
        //     {
        //       title: "Parámetros de tipos de identificación",
        //       routeName: "parametros-identificacion",
        //       icon: "badge",
        //     },
        //     {
        //       title: "Registrar comprador",
        //       routeName: "registrar-comprador",
        //       icon: "person_add",
        //     },
        //     {
        //       title: "Lista de compradores",
        //       routeName: "lista-compradores",
        //       icon: "list",
        //     },
        //   ],
        // },
        // {
        //   id: "viajes",
        //   title: "Gestión de Viajes",
        //   icon: "flight",
        //   expanded: false,
        //   children: [
        //     {
        //       title: "Solicitar viaje",
        //       routeName: "crear-solicitud-requerimiento-viaje",
        //       icon: "playlist_add",
        //     },
        //   ],
        // },

        {
          id: "empleados-colaboradores",
          title: "Gestión de empleados y colaboradores",
          icon: "groups",
          expanded: false,
          children: [
            {
              id: "empleados",
              title: "Empleados",
              icon: "people",
              expanded: false,
              children: [
                {
                  title: "Lista de empleados",
                  path: "/abastecimiento/talento-humano/empleados/lista",
                  routeName: "abastecimiento-lista-empleados",
                  icon: "format_list_bulleted",
                },
                {
                  title: "Crear empleados y registros de datos básicos",
                  path: "/abastecimiento/talento-humano/empleados/datos-basicos",
                  routeName: "abastecimiento-employee-basic-data",
                  icon: "person_add",
                },
                {
                  title: "Crear usuario",
                  routeName: "PageUsuarioCreate",
                  icon: "badge",
                },
              ],
            },
            // {
            //   id: "departamentos",
            //   title: "Áreas / Departamentos",
            //   icon: "corporate_fare",
            //   expanded: false,
            //   children: [
            //     {
            //       title: "Lista de departamentos",
            //       path: "/abastecimiento/talento-humano/departamentos",
            //       routeName: "abastecimiento-departamentos-lista",
            //       icon: "format_list_bulleted",
            //     },
            //     {
            //       title: "Crear área o departamento",
            //       path: "/abastecimiento/talento-humano/departamentos/nuevo",
            //       routeName: "abastecimiento-departamento-create",
            //       icon: "add_business",
            //     },
            //     {
            //       title: "Agregar colaborador a las áreas",
            //       path: "/abastecimiento/talento-humano/colaboradores/asignar-areas",
            //       routeName: "abastecimiento-colaborador-asignar-areas",
            //       icon: "group_add",
            //     },
            //   ],
            // },
            // {
            //   id: "permisos",
            //   title: "Permisos",
            //   icon: "admin_panel_settings",
            //   expanded: false,
            //   children: [
            //     {
            //       title: "Asignar permisos operativos",
            //       path: "/abastecimiento/talento-humano/permisos-operativos",
            //       routeName: "abastecimiento-colaborador-permisos-create",
            //       icon: "assignment_ind",
            //     },
            //   ],
            // },
            {
              id: "roles",
              title: "Roles",
              icon: "shield_person",
              expanded: false,
              children: [
                {
                  title: "Asignación de roles",
                  path: "/abastecimiento/talento-humano/asignacion-roles",
                  routeName: "abastecimiento-asignacion-roles",
                  icon: "manage_accounts",
                },
              ],
            },
            // {
            //   id: "usuario",
            //   title: "Usuario",
            //   icon: "person",
            //   expanded: false,
            //   children: [
            //     {
            //       title: "Crear usuarios del sistema",
            //       path: "/abastecimiento/talento-humano/usuarios/crear",
            //       routeName: "abastecimiento-crear-usuario-sistema",
            //       icon: "person_add",
            //     },
            //     {
            //       title: "Crear usuario",
            //       path: "/abastecimiento/usuario/registrar",
            //       routeName: "user-create",
            //       icon: "badge",
            //     },
            //   ],
            // },
          ],
        },
        // {
        //   id: "finanzas-contabilidad",
        //   title: "Gestion financiera/contable",
        //   icon: "account_balance",
        //   expanded: false,
        //   children: [
        //     {
        //       title: "Centro de costo",
        //       path: "contabilidad/centro-costo",
        //       routeName: "abastecimiento-centro-costo",
        //       icon: "account_tree",
        //     },
        //     {
        //       title: "Presupuestos",
        //       path: "contabilidad/lista-presupuestos",
        //       routeName: "abastecimiento-lista-presupuestos",
        //       icon: "receipt_long",
        //     },
        //     {
        //       title: "Permisos de usuario",
        //       path: "contabilidad/permisos-usuario",
        //       routeName: "abastecimiento-permisos-usuario-lista",
        //       icon: "manage_accounts",
        //     },
        //   ],
        // },
      ],
    };
  },

  computed: {
    accessStore: function () {
      return useAccessStore(pinia);
    },

    authStore: function () {
      return useAuthStore();
    },

    permisosStore: function () {
      return useAbastecimientoPermisosStore();
    },

    /**
     * Árbol del menú con estado visible/bloqueado según permisos de sesión.
     */
    menuVisible: function () {
      var store = this.accessStore;
      void store.permisosCargados;
      void store.permisos;
      void store.user;


      return filtrarMenu(this.menuItems, {
        router: this.$router,
        accessStore: store,
      });
    },

    /**
     * Menú final del sidebar: permisos + búsqueda + estado expandido.
     */
    sidebarMenu: function () {
      var merged = this.mergeMenuExpanded(this.menuVisible, this.menuItems);
      return this.filterMenuBySearch(merged, this.searchQuery);
    },
  },

  watch: {
    $route: {
      handler() {
        this.expandActiveGroup();
      },
      immediate: true,
    },
  },

  mounted() {
    var usuarioId = this.authStore.userId;
    var user = this.authStore.user;
    var userFullName = '';
    if (user) {
      var t = user.tercero;
      if (t) {
        userFullName = [t.primerNombre, t.segundoNombre]
          .filter(function (p) { return p && p.trim(); })
          .join(' ');
      }
      userFullName = userFullName || user.nombreCompleto || user.nombre || '';
    }
    if (usuarioId && userFullName) {
      this.permisosStore.loadPermisos(usuarioId, userFullName);
    }
  },

  methods: {
    ...mapActions("auth", ["logoutAction"]),

    mergeMenuExpanded: function (visibleItems, sourceItems) {
      var self = this;

      function findSourceItem(items, target) {
        if (!items || !items.length) return null;
        var i;
        for (i = 0; i < items.length; i++) {
          var item = items[i];
          if (
            (target.id && item.id === target.id) ||
            (target.routeName && item.routeName === target.routeName) ||
            (target.path && item.path === target.path)
          ) {
            return item;
          }
        }
        return null;
      }

      return visibleItems.map(function (item) {
        var source = findSourceItem(sourceItems, item);
        var expanded = source ? source.expanded : item.expanded;

        if (item.children && item.children.length) {
          var sourceChildren = source && source.children ? source.children : [];
          return Object.assign({}, item, {
            expanded: expanded,
            children: self.mergeMenuExpanded(item.children, sourceChildren),
          });
        }

        return Object.assign({}, item, { expanded: expanded });
      });
    },

    filterMenuBySearch: function (items, searchQuery) {
      var query = (searchQuery || "").toLowerCase().trim();
      var hayBusqueda = !!query;
      var self = this;

      if (!hayBusqueda) {
        return items;
      }

      return items
        .map(function (group) {
          var filteredChildren = group.children
            .map(function (child) {
              if (child.children && child.children.length) {
                var filteredSubChildren = child.children.filter(function (subchild) {
                  return subchild.title.toLowerCase().includes(query);
                });
                var matchesSubgroupTitle = child.title.toLowerCase().includes(query);
                var children = matchesSubgroupTitle ? child.children : filteredSubChildren;

                if (!matchesSubgroupTitle && children.length === 0) {
                  return null;
                }

                return Object.assign({}, child, {
                  expanded: true,
                  children: children,
                });
              }

              return child.title.toLowerCase().includes(query) ? child : null;
            })
            .filter(function (child) {
              return child !== null;
            });

          var matchesGroupTitle = group.title.toLowerCase().includes(query);
          var children = matchesGroupTitle ? group.children : filteredChildren;

          if (!matchesGroupTitle && children.length === 0) {
            return null;
          }

          return Object.assign({}, group, {
            expanded: true,
            children: children,
          });
        })
        .filter(function (group) {
          return group !== null;
        });
    },

    isMenuItemNavegable: function (item) {
      return !item || item.visible !== false;
    },

    logout() {
      this.logoutAction();
    },

    toggleSidebar() {
      this.isCollapsed = !this.isCollapsed;
      localStorage.setItem(
        "sidebar_collapsed",
        JSON.stringify(this.isCollapsed)
      );
    },

    toggleGroup(groupId) {
      if (this.isCollapsed) {
        this.isCollapsed = false;
        localStorage.setItem("sidebar_collapsed", "false");
      }
      this.menuItems = this.menuItems.map((item) => ({
        ...item,
        expanded: item.id === groupId ? !item.expanded : false,
      }));
    },

    toggleSubgroup(groupId, subgroupId) {
      if (this.isCollapsed) {
        this.isCollapsed = false;
        localStorage.setItem("sidebar_collapsed", "false");
      }
      this.menuItems = this.menuItems.map((group) => {
        if (group.id !== groupId) return group;

        return {
          ...group,
          expanded: true,
          children: group.children.map((child) => {
            if (!this.isSubgroup(child)) return child;

            return {
              ...child,
              expanded:
                child.id === subgroupId ? !child.expanded : false,
            };
          }),
        };
      });
    },

    isSubgroup(item) {
      return item.children && item.children.length > 0;
    },

    isSubgroupActive(subgroup) {
      if (!subgroup.children) return false;
      return subgroup.children.some((child) => this.isChildActive(child));
    },

    childRouteTo(child) {
      if (child.path) {
        if (child.path.startsWith("/abastecimiento/")) {
          return child.path;
        }
        if (!child.path.startsWith("/")) {
          return `/abastecimiento/${child.path}`;
        }
      }
      if (child.routeName) {
        return { name: child.routeName };
      }
      return child.path || "/abastecimiento";
    },

    isChildActive(child) {
      if (child.routeName && this.$route.name === child.routeName) {
        return true;
      }
      if (child.path) {
        return (
          this.$route.path === child.path ||
          this.$route.path.startsWith(`${child.path}/`)
        );
      }
      return false;
    },

    isActiveGroup(group) {
      return group.children.some((child) => {
        if (this.isSubgroup(child)) {
          return this.isSubgroupActive(child);
        }
        return this.isChildActive(child);
      });
    },

    expandActiveGroup() {
      this.menuItems = this.menuItems.map((group) => {
        const hasActiveChild = group.children.some((child) => {
          if (this.isSubgroup(child)) {
            return this.isSubgroupActive(child);
          }
          return this.isChildActive(child);
        });

        const children = group.children.map((child) => {
          if (!this.isSubgroup(child)) return child;

          return {
            ...child,
            expanded: this.isSubgroupActive(child),
          };
        });

        return {
          ...group,
          expanded: hasActiveChild,
          children,
        };
      });
    },


  },

  mounted: function () {
    var accessStore = useAccessStore(pinia);

    if (!accessStore.permisosCargados) {
      accessStore.syncFromSession();
      accessStore.cargarPermisos();
    }
  },

};
</script>

<style lang="sass">
/* ===== Header Institucional ===== */
.header-premium
  border-bottom: none

.header-title
  font-family: 'Inter', sans-serif
  letter-spacing: -0.02em

/* ===== Sidebar Drawer ===== */
.sidebar-drawer
  border-right: 1px solid #E8ECEF !important

.sidebar
  height: 100%
  display: flex
  flex-direction: column
  font-family: 'Inter', sans-serif

/* --- Header (Logo + Toggle) --- */
.sidebar__header
  display: flex
  align-items: center
  justify-content: space-between
  padding: 20px 16px

.sidebar__logo
  height: 36px

.sidebar__toggle-btn
  color: #A7B1B7 !important
  transition: all 0.25s ease

.sidebar__toggle-btn:hover
  color: #4A5A63 !important
  background: rgba(74, 90, 99, 0.06) !important

/* --- Buscador --- */
.sidebar__search
  padding: 0 16px 12px 16px

.sidebar__search-input
  .q-field__control
    height: 42px !important
    border-radius: 8px !important
    background: #ffffff !important
    border: 1px solid #E8ECEF !important
    transition: border-color 0.2s ease
  .q-field__control:before, .q-field__control:after
    display: none
  .q-field__control:hover
    border-color: #A7B1B7 !important
  .q-field--focused .q-field__control
    border-color: #4E9C4C !important
    box-shadow: 0 0 0 1px rgba(78, 156, 76, 0.1)
  .q-field__native
    font-size: 13px
    color: #4A5A63
  .q-icon
    color: #A7B1B7
  .q-field__append .q-icon
    font-size: 16px

/* --- Separadores --- */
.sidebar__divider
  background: #E8ECEF !important
  margin: 0 16px

/* --- Navegación --- */
.sidebar__nav
  flex: 1
  padding: 12px 10px
  overflow-y: auto
  scrollbar-width: thin
  scrollbar-color: #E8ECEF transparent

.sidebar__group
  margin-bottom: 4px

/* Nivel 1: Botón de categoría */
.sidebar__group-btn
  display: flex
  align-items: center
  width: 100%
  padding: 10px 12px
  background: transparent
  border: none
  border-radius: 10px
  cursor: pointer
  color: #6B7C85
  font-family: 'Inter', sans-serif
  font-size: 15px
  font-weight: 500
  transition: all 0.2s ease

.sidebar__group-btn:hover
  background: rgba(74, 90, 99, 0.06)
  color: #4A5A63

.sidebar__group--active .sidebar__group-btn
  color: #4A5A63
  font-weight: 600

/* Contenedor de ícono */
.sidebar__icon-wrap
  width: 36px
  height: 36px
  display: flex
  align-items: center
  justify-content: center
  border-radius: 8px
  margin-right: 12px
  color: #A7B1B7
  font-size: 22px
  transition: all 0.25s ease

.sidebar--collapsed .sidebar__icon-wrap
  margin-right: 0

.sidebar__group-btn:hover .sidebar__icon-wrap
  color: #6B7C85

.sidebar__group--active .sidebar__icon-wrap
  background: linear-gradient(135deg, #84B24D 0%, #75AF7E 50%, #4E9C4C 100%)
  color: #ffffff
  box-shadow: 0 4px 12px rgba(78, 156, 76, 0.25)

/* Título de grupo */
.sidebar__group-label
  flex: 1
  text-align: left

/* Flecha chevron */
.sidebar__arrow
  margin-left: auto
  font-size: 18px
  color: #A7B1B7
  opacity: 0.6
  transition: opacity 0.2s ease

.sidebar__arrow--open
  opacity: 1
  color: #6B7C85

/* === Nivel 2: Sub-ítems === */
.sidebar__items
  list-style: none
  margin: 4px 0 8px 18px
  padding: 0 0 0 20px
  border-left: 1px solid #E8ECEF
  display: flex
  flex-direction: column
  gap: 2px

.sidebar__item
  display: flex
  align-items: center
  gap: 10px
  padding: 8px 12px
  color: #6B7C85
  font-size: 14px
  font-weight: 500
  text-decoration: none
  border-radius: 8px
  transition: all 0.2s ease
  border: none
  background: none
  width: 100%
  cursor: pointer
  font-family: 'Inter', sans-serif

.sidebar__item-icon
  font-size: 18px
  color: #A7B1B7
  opacity: 0.7

.sidebar__item:hover
  color: #4A5A63
  background: rgba(74, 90, 99, 0.06)

.sidebar__item:hover .sidebar__item-icon
  color: #6B7C85
  opacity: 1

/* Ítem activo */
.sidebar__item--active
  color: #4E9C4C !important
  background: rgba(78, 156, 76, 0.08) !important
  font-weight: 600

.sidebar__item--active .sidebar__item-icon
  color: #4E9C4C !important
  opacity: 1

.sidebar__item--nested
  font-size: 13px
  padding: 7px 10px

.sidebar__item--sin-permiso
  cursor: not-allowed
  opacity: 0.85
  pointer-events: none

.sidebar__item--sin-permiso span
  text-decoration: underline
  text-decoration-color: #FFC107
  text-decoration-thickness: 2px
  text-underline-offset: 3px

.sidebar__item--sin-permiso:hover
  background: transparent !important

/* === Nivel 3: Subgrupos (dropdowns) === */
.sidebar__subgroup
  margin-bottom: 2px

.sidebar__subgroup-btn
  display: flex
  align-items: center
  gap: 10px
  width: 100%
  padding: 8px 12px
  background: transparent
  border: none
  border-radius: 8px
  cursor: pointer
  color: #6B7C85
  font-size: 14px
  font-weight: 500
  font-family: 'Inter', sans-serif
  transition: all 0.2s ease

.sidebar__subgroup-btn:hover
  color: #4A5A63
  background: rgba(74, 90, 99, 0.06)

.sidebar__subgroup--active .sidebar__subgroup-btn
  color: #4A5A63
  font-weight: 600

.sidebar__subgroup-label
  flex: 1
  text-align: left

.sidebar__subgroup-arrow
  margin-left: auto
  font-size: 16px
  color: #A7B1B7
  opacity: 0.6
  transition: opacity 0.2s ease

.sidebar__subgroup-arrow--open
  opacity: 1
  color: #6B7C85

.sidebar__subitems
  list-style: none
  margin: 2px 0 4px 8px
  padding: 0 0 0 16px
  border-left: 1px solid #E8ECEF
  display: flex
  flex-direction: column
  gap: 2px

.sidebar__subgroup-btn:focus-visible
  outline: 2px solid #4E9C4C
  outline-offset: -2px

/* --- Footer --- */
.sidebar__footer
  padding: 12px 10px 16px

.sidebar__item--home
  color: #6B7C85

.sidebar__item--logout
  color: #6B7C85
  margin-top: 4px

.sidebar__item--logout:hover
  color: #D32F2F
  background: rgba(211, 47, 47, 0.06)

.sidebar__item--logout:hover .sidebar__item-icon
  color: #D32F2F

/* === Animación Acordeón === */
.slide-accordion-enter-active,
.slide-accordion-leave-active
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)
  max-height: 500px
  overflow: hidden

.slide-accordion-enter,
.slide-accordion-leave-to
  max-height: 0
  opacity: 0

/* === Accesibilidad === */
.sidebar__group-btn:focus-visible,
.sidebar__item:focus-visible
  outline: 2px solid #4E9C4C
  outline-offset: -2px

/* === Main Content === */

@keyframes pulse-teal
  0%
    box-shadow: 0 0 0 0 rgba(20, 184, 166, 0.4)
  70%
    box-shadow: 0 0 0 15px rgba(20, 184, 166, 0)
  100%
    box-shadow: 0 0 0 0 rgba(20, 184, 166, 0)

/* === Permisos de ruta — Solicitudes === */
.permisos-loading
  display: flex
  align-items: center
  gap: 8px
  padding: 10px 16px

.spinner-ring
  width: 14px
  height: 14px
  border: 2px solid #E5E7EB
  border-top-color: #2563EB
  border-radius: 50%
  animation: spin 0.7s linear infinite
  flex-shrink: 0

@keyframes spin
  to
    transform: rotate(360deg)

.permisos-loading__text
  font-size: 12px
  color: #9CA3AF

.permisos-error
  padding: 8px 16px
  font-size: 11px
  color: #B91C1C
  background: #FEE2E2
  border-radius: 6px
  margin: 6px 10px

.sidebar__group-btn--static
  cursor: default

.sidebar__group-btn--static:hover
  background: transparent
</style>
