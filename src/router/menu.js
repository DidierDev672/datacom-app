import { defineStore } from "pinia";
import { usePermissionsStore } from "./permissions";
import { routes } from "./routes";

export const useMenuStore = defineStore("menu", {
  getters: {
    visibleRoutes() {
      const permStore = usePermissionsStore();

      const filterRoutes = (routeList) => {
        return routeList
          .filter((route) => {
            const requiredPerm = route.meta?.permission;
            // Si no requiere permiso → siempre visible
            if (!requiredPerm) return true;
            // Si requiere permiso → solo si está en true
            return permStore.can(requiredPerm);
          })
          .map((route) => {
            const filtered = { ...route };
            if (route.children?.length) {
              filtered.children = filterRoutes(route.children);
            }
            return filtered;
          })
          .filter((route) => !route.children || route.children.length > 0);
      };

      const mainLayout = routes.find((r) => r.path === "/" && r.children);
      return mainLayout ? filterRoutes(mainLayout.children) : [];
    },
  },
});
