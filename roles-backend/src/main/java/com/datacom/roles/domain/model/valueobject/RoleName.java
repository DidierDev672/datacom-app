package com.datacom.roles.domain.model.valueobject;

import java.util.Objects;

/**
 * Value Object que representa el nombre de un rol.
 */
public class RoleName {

    private final String value;

    public RoleName(String value) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("El nombre del rol no puede ser nulo ni vacio");
        }
        this.value = value;
    }

    public String value() {
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
        RoleName roleName = (RoleName) o;
        return Objects.equals(value, roleName.value);
    }

    @Override
    public int hashCode() {
        return Objects.hash(value);
    }

    @Override
    public String toString() {
        return value;
    }
}
