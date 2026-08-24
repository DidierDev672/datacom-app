import { defineStore } from "pinia";

export function getRoutePermissionKey(route) {
  if (route.meta && route.meta.permission) {
    return route.meta.permission;
  }
  if (route.name) {
    return route.name;
  }
  if (route.path) {
    return route.path;
  }
  return null;
}

export function buildPermissionsMapFromRoutes(routes) {
  var map = {};

  (routes || []).forEach(function (route) {
    var key = getRoutePermissionKey(route);
    if (key) {
      map[key] = true;
    }
  });

  return map;
}

export const usePermissionsStore = defineStore("permissions", {
  state: function () {
    return {
      permissions: {},
      availablePermissions: [],
      userPermissions: {},
    };
  },

  getters: {
    can: function (state) {
      return function (permissionKey) {
        if (!permissionKey) {
          return true;
        }
        return state.permissions[permissionKey] === true;
      };
    },

    activePermissions: function (state) {
      return Object.keys(state.permissions).filter(function (key) {
        return state.permissions[key] === true;
      });
    },
  },

  actions: {
    setUserPermissions: function (permissionObj) {
      this.permissions = Object.assign({}, permissionObj || {});
    },

    syncPermissionsFromRoutes: function (routes) {
      this.setUserPermissions(buildPermissionsMapFromRoutes(routes));
    },

    updatePermission: function (key, value) {
      if (!key) {
        return;
      }
      this.permissions = Object.assign({}, this.permissions, {
        [key]: !!value,
      });
    },

    resetPermissions: function () {
      this.permissions = {};
    },
  },
});
