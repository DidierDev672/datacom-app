import { pinia } from "src/stores/pinia";
import { useAccessStore } from "./Access.store";
import { ABASTECIMIENTO_VISIBILIDAD_POR_RUTA } from "./abastecimientoVisibilidad";

/**
 * Guard del módulo "abastecimiento" (usar en `beforeEnter` de la ruta padre
 * y en `router.beforeEach` para rutas hijas).
 * ---------------------------------------------------------------------------
 * Permisos de visibilidad alineados con AbastecimientoLayout.vue (visibilidadKey).
 * GET /api/v1/colaborador-asignaciones/visibilidad?usuarioId={username}
 */
export async function abastecimientoAccessGuard(to, from, next) {
  var accessStore = useAccessStore(pinia);

  accessStore.syncFromSession();

  if (!accessStore.isAuthenticated) {
    try {
      sessionStorage.setItem("redirectAfterLogin", to.fullPath);
      return next({ name: 'login', query: { redirect: to.fullPath } })
    } catch (e) {
      // sessionStorage no disponible
    }
    next({
      path: "/auth",
      query: { from: to.fullPath },
    });
    return;
  }

  if (!accessStore.permisosCargados) {
    await accessStore.cargarPermisos();
  }

  var result = accessStore.canAccessMatchedRoute(to);

  if (!result.allowed) {
    if (result.reason === "unauthenticated") {
      next({
        path: "/auth",
        query: { from: to.fullPath },
      });
      return;
    }

    next({ name: "abastecimiento-inicio" });
    return;
  }

  console.log("Permisos cargados:", accessStore.permisos);

  next();
}

export { ABASTECIMIENTO_VISIBILIDAD_POR_RUTA };
