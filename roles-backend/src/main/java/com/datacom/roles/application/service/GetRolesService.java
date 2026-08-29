package com.datacom.roles.application.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.datacom.roles.application.port.in.GetRolesUseCase;
import com.datacom.roles.application.port.out.RoleRepositoryPort;
import com.datacom.roles.domain.model.Role;

/**
 * Servicio de aplicacion que orquesta la logica de consulta de roles.
 *
 * <p>Depende unicamente de los puertos (interfaces), nunca de detalles de
 * infraestructura.
 */
@Service
public class GetRolesService implements GetRolesUseCase {

    private final RoleRepositoryPort roleRepositoryPort;

    public GetRolesService(RoleRepositoryPort roleRepositoryPort) {
        this.roleRepositoryPort = roleRepositoryPort;
    }

    @Override
    public List<Role> getRoles(int page, int size) {
        return roleRepositoryPort.findByPage(page, size);
    }
}
