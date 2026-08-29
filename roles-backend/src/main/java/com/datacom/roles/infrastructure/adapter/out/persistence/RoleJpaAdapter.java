package com.datacom.roles.infrastructure.adapter.out.persistence;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import com.datacom.roles.application.port.out.RoleRepositoryPort;
import com.datacom.roles.domain.model.Role;

/**
 * Adaptador de salida (Output Adapter) para persistencia de roles usando JPA.
 *
 * <p>Implementa el puerto de salida {@link RoleRepositoryPort} y mapea la
 * entidad JPA a la entidad de dominio.
 */
@Component
public class RoleJpaAdapter implements RoleRepositoryPort {

    private final RoleJpaRepository roleJpaRepository;

    public RoleJpaAdapter(RoleJpaRepository roleJpaRepository) {
        this.roleJpaRepository = roleJpaRepository;
    }

    @Override
    public List<Role> findByPage(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<RoleJpaEntity> result = roleJpaRepository.findAll(pageable);
        return result.getContent().stream()
                .map(RoleMapper::toDomain)
                .toList();
    }
}
