package com.datacom.roles.infrastructure.adapter.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repositorio Spring Data JPA para la entidad {@link RoleJpaEntity}.
 */
public interface RoleJpaRepository extends JpaRepository<RoleJpaEntity, Long> {
}
