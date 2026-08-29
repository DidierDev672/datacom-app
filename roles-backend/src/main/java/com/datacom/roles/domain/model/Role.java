package com.datacom.roles.domain.model;

import com.datacom.roles.domain.model.valueobject.RoleId;
import com.datacom.roles.domain.model.valueobject.RoleName;

/**
 * Entidad de dominio pura que representa un rol del sistema.
 *
 * <p>No contiene anotaciones JPA ni depende de frameworks de infraestructura.
 */
public class Role {

    private final RoleId id;
    private final RoleName name;
    private final String description;

    public Role(RoleId id, RoleName name, String description) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    public RoleId id() {
        return id;
    }

    public RoleName name() {
        return name;
    }

    public String description() {
        return description;
    }
}
