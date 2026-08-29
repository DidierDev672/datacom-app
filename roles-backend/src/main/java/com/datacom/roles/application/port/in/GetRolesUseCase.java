package com.datacom.roles.application.port.in;

import java.util.List;
import com.datacom.roles.domain.model.Role;

/**
 * Puerto de entrada (Input Port) para consultar los roles del sistema.
 */
public interface GetRolesUseCase {

    /**
     * Consulta los roles del sistema con paginacion.
     *
     * @param page numero de pagina (base 0)
     * @param size tamano de la pagina
     * @return lista de roles
     */
    List<Role> getRoles(int page, int size);
}
