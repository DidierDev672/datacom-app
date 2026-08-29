package com.datacom.roles.domain.model.valueobject;

import java.util.Objects;

/**
 * Value Object que representa el identificador de un rol.
 */
public class RoleId {

    private final Long value;

    public RoleId(Long value) {
        if (value == null) {
            throw new IllegalArgumentException("El id del rol no puede ser nulo");
        }
        this.value = value;
    }

    public Long value() {
        return value;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        RoleId roleId = (RoleId) o;
        return Objects.equals(value, roleId.value);
    }

    @Override
    public int hashCode() {
        return Objects.hash(value);
    }

    @Override
    public String toString() {
        return String.valueOf(value);
    }
}
