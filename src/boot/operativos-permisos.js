import { pinia } from 'src/stores/pinia';
import { useOperativosPermisosStore } from 'src/stores/operativosPermisosStore';
import { resolveUsernameFromSession } from 'src/modules/talento-humano/ui/utils/sessionCollaborator';

/**
 * Carga permisos operativos del usuario autenticado al iniciar la aplicación.
 */
export default function ({ store }) {
  const username = resolveUsernameFromSession(
    store.getters['auth/getUser']
  );

  if (!username) {
    return;
  }

  const operativosStore = useOperativosPermisosStore(pinia);
  operativosStore.loadForUsername(username);
}
