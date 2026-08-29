package com.datacom.roles.infrastructure.config.error;

import java.time.LocalDateTime;

/**
 * Estructura estandar de error en la API.
 */
public record ApiError(
        LocalDateTime timestamp,
        int status,
        String error,
        String message,
        String path) {
}
