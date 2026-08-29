package com.datacom.roles.application.port.out;

import java.util.List;
import com.datacom.roles.domain.model.Role;

/**
 * Puerto de salida (Output Port) para la persistencia de roles.
 */
public interface RoleRepositoryPort {

    /**
     * Devuelve una pagina de roles.
     *
     * @param page numero de pagina (base 0)
     * @param size tamano de la pagina
     * @return lista de roles
     */
    List<Role> findByPage(int page, int size);
}
