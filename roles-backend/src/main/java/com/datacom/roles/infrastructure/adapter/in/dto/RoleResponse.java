package com.datacom.roles.infrastructure.adapter.in.dto;

import com.datacom.roles.domain.model.Role;

/**
 * DTO de respuesta para un rol.
 */
public record RoleResponse(Long id, String name, String description) {

    public static RoleResponse fromDomain(Role role) {
        return new RoleResponse(
                role.id().value(),
                role.name().value(),
                role.description());
    }
}
