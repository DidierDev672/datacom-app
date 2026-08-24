import { pinia } from 'src/stores/pinia';
import { useOperativosPermisosStore } from 'src/stores/operativosPermisosStore';
import {
  resolveUsernameFromSession,
  resolveCollaboratorId
} from 'src/modules/talento-humano/ui/utils/sessionCollaborator';

export { resolveUsernameFromSession, resolveCollaboratorId };

/**
 * Evalúa si el usuario de sesión puede aceptar aprobaciones de solicitudes de abastecimiento.
 * Usa el store global de permisos operativos para evitar llamadas duplicadas.
 */
export async function evaluateSupplyRequestApprovalPermission(username) {
  const normalizedUsername = resolveUsernameFromSession(username);
  if (!normalizedUsername) {
    return {
      canApprove: false,
      canDelete: false,
      collaboratorId: '',
      collaboratorNombre: '',
      resolved: true,
    };
  }

  try {
    const operativosStore = useOperativosPermisosStore(pinia);
    await operativosStore.loadForUsername(normalizedUsername);

    return {
      canApprove: operativosStore.canApproveSupplyRequests,
      canDelete: operativosStore.canDeleteSupplyRequests,
      collaboratorId: operativosStore.collaboratorId,
      collaboratorNombre: operativosStore.collaboratorNombre,
      resolved: operativosStore.isResolved,
    };
  } catch (error) {
    return {
      canApprove: false,
      canDelete: false,
      collaboratorId: '',
      collaboratorNombre: '',
      resolved: true,
    };
  }
}

export const SUPPLY_REQUEST_APPROVAL_DENIED_MESSAGE =
  'No tiene permisos para aceptar esta aprobación. Su usuario debe estar registrado como aprobador o contar con el permiso operativo de aprobaciones.';

export const SUPPLY_REQUEST_DELETE_DENIED_MESSAGE =
  'No tiene permisos para eliminar solicitudes. Su usuario debe contar con el permiso operativo de eliminación de solicitudes.';
