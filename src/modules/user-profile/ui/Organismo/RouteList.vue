<script>
import RouteListItem from '../molecula/RouteListItem.vue';
import {
  buildRouteTree,
  buildSelectedKeysFromRoutes,
  collectSelectedRoutesFromTree,
  countRouteTree,
  filterRouteTree,
  getRouteKey,
  collectAllDescendantKeys,
} from '../utils/flatten-routes';
import AppInput from 'src/utils/components/AppInput.vue';

export default {
  name: 'RouteList',

  components: {
    RouteListItem,
    AppInput,
  },

  props: {
    value: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },

  data() {
    return {
      consultaRutas: '',
      selectedKeys: {},
      expandedKeys: {},
      expandedRevision: 0,
    };
  },

  computed: {
    hayConsultaActiva() {
      return (this.consultaRutas || '').trim().length > 0;
    },

    consultaNormalizada() {
      return (this.consultaRutas || '').toLowerCase().trim();
    },

    rutasArbol() {
      var rutasDefinidas = this.$router.options.routes;
      return buildRouteTree(rutasDefinidas);
    },

    rutasFiltradas() {
      return filterRouteTree(this.rutasArbol, this.consultaNormalizada);
    },

    totalRutas() {
      return countRouteTree(this.rutasArbol);
    },

    totalRutasVisibles() {
      return countRouteTree(this.rutasFiltradas);
    },

    rutasSeleccionadas() {
      return collectSelectedRoutesFromTree(this.rutasArbol, this.selectedKeys);
    },

    totalSeleccionadas() {
      return this.rutasSeleccionadas.length;
    },
  },

  watch: {
    value: {
      immediate: true,
      handler: function (routes) {
        this.selectedKeys = buildSelectedKeysFromRoutes(routes);
      },
    },

    consultaRutas: function () {
      if (this.hayConsultaActiva) {
        this.autoExpandForSearch();
      }
    },
  },

  methods: {
    onConsultaInput(value) {
      this.consultaRutas = value || '';
    },

    onToggleExpand(route) {
      var key = getRouteKey(route);
      var next = Object.assign({}, this.expandedKeys);

      if (next[key]) {
        delete next[key];
      } else {
        next[key] = true;
      }

      this.expandedKeys = next;
      this.expandedRevision += 1;
    },

    autoExpandForSearch() {
      var self = this;
      var next = Object.assign({}, this.expandedKeys);

      function expandNodes(nodes) {
        (nodes || []).forEach(function (node) {
          if (node.children && node.children.length) {
            next[getRouteKey(node)] = true;
            expandNodes(node.children);
          }
        });
      }

      expandNodes(this.rutasFiltradas);
      this.expandedKeys = next;
      this.expandedRevision += 1;
    },

    emitSelection() {
      var selected = this.rutasSeleccionadas;
      this.$emit('input', selected);
      this.$emit('selection-change', selected);
    },

    onToggleRoute(payload) {
      var key = getRouteKey(payload.route);

      if (payload.selected) {
        this.$set(this.selectedKeys, key, true);
      } else {
        this.$delete(this.selectedKeys, key);
      }

      this.emitSelection();
    },

    onToggleSection(payload) {
      var keys = collectAllDescendantKeys(payload.route);

      keys.forEach(function (key) {
        if (payload.selected) {
          this.$set(this.selectedKeys, key, true);
        } else {
          this.$delete(this.selectedKeys, key);
        }
      }.bind(this));

      this.emitSelection();
    },
  },
};
</script>

<template>
  <!--
    Organismo: obtiene las rutas del router y compone RouteListItem
    en estructura de acordeón para nodos con children.
  -->
  <div class="route-list-wrapper">
    <AppInput
      :value="consultaRutas"
      label="Buscar rutas"
      placeholder="Nombre, path, rol o visibilidad..."
      @input="onConsultaInput"
    />

    <div class="route-list__meta">
      <p v-if="hayConsultaActiva" class="route-list__count">
        {{ totalRutasVisibles }} de {{ totalRutas }} ruta(s)
      </p>
      <p v-if="totalSeleccionadas" class="route-list__selected">
        {{ totalSeleccionadas }} seleccionada(s)
      </p>
    </div>

    <ul v-if="rutasFiltradas.length" class="route-list">
      <RouteListItem
        v-for="(route, index) in rutasFiltradas"
        :key="route.path + '|' + (route.name || route.label || index)"
        :route="route"
        :is-last="index === rutasFiltradas.length - 1"
        :depth="route.depth || 0"
        :selected-keys="selectedKeys"
        :expanded-keys="expandedKeys"
        :expanded-revision="expandedRevision"
        @toggle-route="onToggleRoute"
        @toggle-section="onToggleSection"
        @toggle-expand="onToggleExpand"
      />
    </ul>

    <p v-else-if="hayConsultaActiva" class="route-list__empty">
      No se encontraron rutas para «{{ consultaRutas.trim() }}».
    </p>
  </div>
</template>

<style scoped>
.route-list-wrapper {
  width: 100%;
}

.route-list {
  padding: 16px 0 0;
  margin: 0;
  width: 100%;
  max-width: none;
}

.route-list__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 8px;
}

.route-list__count,
.route-list__selected {
  margin: 0;
  padding-left: 2px;
  font-size: 0.75rem;
  color: #6b7280;
}

.route-list__selected {
  color: #166534;
  font-weight: 600;
}

.route-list__empty {
  margin: 12px 0 0;
  padding: 12px 14px;
  border-radius: 8px;
  background: #f9fafb;
  border: 1px dashed #d1d5db;
  font-size: 0.8125rem;
  color: #6b7280;
}
</style>
