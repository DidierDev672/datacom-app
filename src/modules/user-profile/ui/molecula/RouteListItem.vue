<script>
import RouteConnector from '../atomic/RouteConnector.vue';
import {
  collectAllDescendantKeys,
  getRouteKey,
} from '../utils/flatten-routes';

export default {
  name: 'RouteListItem',

  components: { RouteConnector },

  beforeCreate: function () {
    this.$options.components.RouteListItem = this.$options;
  },

  props: {
    route: {
      type: Object,
      required: true,
    },
    isLast: {
      type: Boolean,
      default: false,
    },
    depth: {
      type: Number,
      default: 0,
    },
    selectedKeys: {
      type: Object,
      default: function () {
        return {};
      },
    },
    expandedKeys: {
      type: Object,
      default: function () {
        return {};
      },
    },
    expandedRevision: {
      type: Number,
      default: 0,
    },
  },

  computed: {
    hasChildren() {
      return this.route.children && this.route.children.length > 0;
    },

    isExpanded() {
      var revision = this.expandedRevision;
      var keys = this.expandedKeys || {};
      return keys[this.routeKey] === true;
    },

    displayName() {
      if (this.route.name) {
        return this.route.name;
      }
      if (this.route.label) {
        return this.route.label;
      }
      return this.route.path;
    },

    meta() {
      return this.route.meta || {};
    },

    childCount() {
      return this.route.children ? this.route.children.length : 0;
    },

    routeKey() {
      return getRouteKey(this.route);
    },

    isSelected() {
      return Boolean(this.selectedKeys[this.routeKey]);
    },

    sectionKeys() {
      return collectAllDescendantKeys(this.route);
    },

    isSectionFullySelected() {
      if (!this.hasChildren || !this.sectionKeys.length) {
        return false;
      }

      var self = this;
      return this.sectionKeys.every(function (key) {
        return self.selectedKeys[key];
      });
    },

    isSectionPartiallySelected() {
      if (!this.hasChildren || !this.sectionKeys.length) {
        return false;
      }

      var self = this;
      var selectedCount = this.sectionKeys.filter(function (key) {
        return self.selectedKeys[key];
      }).length;

      return selectedCount > 0 && selectedCount < this.sectionKeys.length;
    },
  },

  methods: {
    toggleExpanded() {
      if (!this.hasChildren) {
        return;
      }
      this.$emit('toggle-expand', this.route);
    },

    onLeafCheckbox(value) {
      this.$emit('toggle-route', {
        route: this.route,
        selected: value,
      });
    },

    onSectionCheckbox(value) {
      this.$emit('toggle-section', {
        route: this.route,
        selected: value,
      });
    },

    relayToggleRoute(payload) {
      this.$emit('toggle-route', payload);
    },

    relayToggleSection(payload) {
      this.$emit('toggle-section', payload);
    },

    relayToggleExpand(route) {
      this.$emit('toggle-expand', route);
    },
  },
};
</script>

<template>
  <!--
    Molécula: combina el átomo RouteConnector con el contenido textual
    de una ruta. Las rutas con children se muestran como acordeón.
  -->
  <li
    class="route-list-item"
    :class="{
      'route-list-item--accordion': hasChildren,
      'route-list-item--expanded': hasChildren && isExpanded,
      'route-list-item--leaf': !hasChildren,
      'route-list-item--selected': isSelected,
    }"
    :style="{ marginLeft: hasChildren ? '0' : `${depth * 16}px` }"
  >
    <div v-if="hasChildren" class="route-list-item__accordion-panel">
      <div
        class="route-list-item__accordion-toolbar"
        :class="{ 'route-list-item__accordion-toolbar--expanded': isExpanded }"
      >
        <div
          class="route-list-item__accordion-header"
          role="button"
          tabindex="0"
          :aria-expanded="isExpanded ? 'true' : 'false'"
          @click="toggleExpanded"
          @keyup.enter="toggleExpanded"
          @keyup.space.prevent="toggleExpanded"
        >
          <span class="route-list-item__chevron" aria-hidden="true">
            <q-icon name="chevron_right" size="20px" />
          </span>

          <div class="route-list-item__accordion-body">
            <div class="route-list-item__header">
              <span class="route-list-item__name">{{ displayName }}</span>
              <span class="route-list-item__child-count">{{ childCount }} ruta(s)</span>
              <span v-if="meta.requiresRole" class="route-list-item__badge route-list-item__badge--rol">
                Rol: {{ meta.requiresRole.join(', ') }}
              </span>
              <span
                v-else-if="meta.requiresVisibilidad"
                class="route-list-item__badge route-list-item__badge--visibilidad"
              >
                {{ meta.requiresVisibilidad }}
              </span>
            </div>
            <span class="route-list-item__path">{{ route.path }}</span>
          </div>
        </div>

        <div class="route-list-item__checkbox-wrap" @click.stop>
          <q-checkbox
            :value="isSectionFullySelected"
            :indeterminate="isSectionPartiallySelected"
            color="positive"
            dense
            class="route-list-item__checkbox route-list-item__checkbox--right"
            @input="onSectionCheckbox"
          />
        </div>
      </div>

      <ul v-if="isExpanded" class="route-list-item__children">
        <RouteListItem
          v-for="(child, index) in route.children"
          :key="child.path + '|' + (child.name || child.label || index)"
          :route="child"
          :is-last="index === route.children.length - 1"
          :depth="(child.depth || 0)"
          :selected-keys="selectedKeys"
          :expanded-keys="expandedKeys"
          :expanded-revision="expandedRevision"
          @toggle-route="relayToggleRoute"
          @toggle-section="relayToggleSection"
          @toggle-expand="relayToggleExpand"
        />
      </ul>
    </div>

    <div v-else class="route-list-item__leaf-row">
      <RouteConnector :is-last="isLast" />
      <div class="route-list-item__connect">
        <div class="route-list-item__header">
          <span class="route-list-item__name">{{ displayName }}</span>
          <span v-if="meta.requiresRole" class="route-list-item__badge route-list-item__badge--rol">
            Rol: {{ meta.requiresRole.join(', ') }}
          </span>
          <span
            v-else-if="meta.requiresVisibilidad"
            class="route-list-item__badge route-list-item__badge--visibilidad"
          >
            {{ meta.requiresVisibilidad }}
          </span>
        </div>
        <span class="route-list-item__path">{{ route.path }}</span>
      </div>
      <div class="route-list-item__checkbox-wrap" @click.stop>
        <q-checkbox
          :value="isSelected"
          color="positive"
          dense
          class="route-list-item__checkbox route-list-item__checkbox--right"
          @input="onLeafCheckbox"
        />
      </div>
    </div>
  </li>
</template>

<style scoped>
.route-list-item {
  list-style: none;
  width: 100%;
}

.route-list-item--leaf {
  padding-bottom: 10px;
}

.route-list-item--selected .route-list-item__connect {
  background: rgba(220, 252, 231, 0.35);
  border-radius: 8px;
  padding: 4px 8px;
}

.route-list-item--accordion {
  margin-bottom: 10px;
}

.route-list-item__leaf-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  width: 100%;
}

.route-list-item__checkbox-wrap {
  flex-shrink: 0;
  margin-left: auto;
  margin-top: 2px;
  padding-right: 4px;
  position: relative;
  z-index: 2;
}

.route-list-item__checkbox {
  flex-shrink: 0;
}

.route-list-item__accordion-panel {
  width: 100%;
  border: 1px solid #bbf7d0;
  border-radius: 12px;
  background: linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%);
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(16, 185, 129, 0.08);
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
}

.route-list-item--expanded .route-list-item__accordion-panel {
  border-color: #86efac;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.12);
}

.route-list-item__accordion-toolbar {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  width: 100%;
  padding: 10px 12px;
}

.route-list-item__accordion-header {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  flex: 1;
  min-width: 0;
  padding: 2px 4px 2px 0;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
  position: relative;
  z-index: 1;
  user-select: none;
}

.route-list-item__accordion-header:hover {
  background: rgba(220, 252, 231, 0.65);
  border-radius: 8px;
}

.route-list-item__accordion-header:focus {
  outline: 2px solid rgba(22, 163, 74, 0.35);
  outline-offset: 2px;
  border-radius: 8px;
}

.route-list-item__chevron {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  margin-top: 2px;
  color: #059669;
  transition: transform 0.2s ease;
  flex-shrink: 0;
}

.route-list-item--expanded .route-list-item__chevron {
  transform: rotate(90deg);
}

.route-list-item__accordion-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.route-list-item__connect {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-bottom: 4px;
  min-width: 0;
  flex: 1;
}

.route-list-item__header {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.route-list-item__name {
  font-weight: 600;
  color: #064e3b;
  font-size: 0.95rem;
}

.route-list-item__path {
  font-size: 0.8rem;
  color: #6b7280;
  font-family: 'Courier New', monospace;
  word-break: break-all;
}

.route-list-item__child-count {
  font-size: 0.68rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 999px;
  background: #dcfce7;
  color: #166534;
  white-space: nowrap;
}

.route-list-item__badge {
  font-size: 0.7rem;
  padding: 2px 10px;
  border-radius: 999px;
  white-space: nowrap;
}

.route-list-item__badge--rol {
  background: #d1fae5;
  color: #065f46;
}

.route-list-item__badge--visibilidad {
  background: #ecfccb;
  color: #3f6212;
}

.route-list-item__children {
  margin: 0;
  padding: 8px 12px 12px 20px;
  border-top: 1px solid #dcfce7;
  background: #ffffff;
  list-style: none;
}
</style>
