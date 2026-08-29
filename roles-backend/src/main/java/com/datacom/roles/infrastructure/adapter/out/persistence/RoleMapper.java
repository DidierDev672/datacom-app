package com.datacom.roles.infrastructure.adapter.out.persistence;

import java.util.Objects;
import com.datacom.roles.domain.model.Role;
import com.datacom.roles.domain.model.valueobject.RoleId;
import com.datacom.roles.domain.model.valueobject.RoleName;

/**
 * Mapea entre la entidad JPA y la entidad de dominio {@link Role}.
 */
public final class RoleMapper {

    private RoleMapper() {
    }

    public static Role toDomain(RoleJpaEntity entity) {
        if (entity == null) {
            return null;
        }
        return new Role(
                new RoleId(entity.getId()),
                new RoleName(Objects.requireNonNull(entity.getName(), "name")),
                entity.getDescription());
    }
}
