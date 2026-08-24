/**
 * Resuelve el usuario de sesión y su colaborador asociado en catálogos de HR.
 */

export function resolveUsernameFromSession (user) {
  if (typeof user === 'string' && user.trim()) {
    return user.trim();
  }
  if (user && typeof user === 'object' && user.username) {
    return String(user.username).trim();
  }
  return '';
}

export function resolveCollaboratorId (colaboradores, username) {
  if (!username || !Array.isArray(colaboradores) || colaboradores.length === 0) {
    return '';
  }

  const normalizedUsername = username.toLowerCase();

  for (let index = 0; index < colaboradores.length; index += 1) {
    const colaborador = colaboradores[index];
    const collaboratorId = String(colaborador.id != null ? colaborador.id : '').trim();
    const documentNumber = String(
      colaborador.numeroDocumento != null ? colaborador.numeroDocumento : ''
    ).trim();
    const email = String(
      colaborador.correoElectronico != null ? colaborador.correoElectronico : ''
    )
      .trim()
      .toLowerCase();

    if (documentNumber && documentNumber.toLowerCase() === normalizedUsername) {
      return collaboratorId;
    }
    if (collaboratorId && collaboratorId.toLowerCase() === normalizedUsername) {
      return collaboratorId;
    }
    if (email && email === normalizedUsername) {
      return collaboratorId;
    }

    const atIndex = email.indexOf('@');
    if (atIndex > 0 && email.substring(0, atIndex) === normalizedUsername) {
      return collaboratorId;
    }
  }

  return '';
}

export function findColaboradorById (colaboradores, collaboratorId) {
  if (!collaboratorId || !Array.isArray(colaboradores)) {
    return null;
  }
  const normalizedId = String(collaboratorId);
  return colaboradores.find(function (c) {
    return c && String(c.id) === normalizedId;
  }) || null;
}
