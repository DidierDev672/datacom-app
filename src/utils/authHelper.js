/**
 * Utilidad para manejar la extracción del token JWT desde el almacenamiento local.
 * Dado que la aplicación almacena a veces el objeto JSON entero y otras veces solo la cadena,
 * este ayudante normaliza la obtención del token puro.
 */
export const getRawToken = () => {
    const tokenStr = localStorage.getItem('token');
    
    if (!tokenStr) return null;
    
    // Si el string ya empieza como un JWT (header.payload.sig), devolverlo tal cual
    if (tokenStr.startsWith('eyJ')) {
        return tokenStr;
    }
    
    try {
        const parsed = JSON.parse(tokenStr);
        // Si es un objeto, intentar sacar la propiedad .token
        if (parsed && typeof parsed === 'object') {
            return parsed.token || null;
        }
        // Si era un string simple entrecomillado, JSON.parse lo devuelve ya limpio
        return parsed;
    } catch (e) {
        // Si no es JSON y no empieza por eyJ, podría ser un token de otro tipo o corrupto
        console.warn('Error al parsear el token almacenado:', tokenStr);
        return tokenStr;
    }
};

export const getAuthHeader = () => {
    const token = getRawToken();
    return token ? `Bearer ${token}` : null;
};
