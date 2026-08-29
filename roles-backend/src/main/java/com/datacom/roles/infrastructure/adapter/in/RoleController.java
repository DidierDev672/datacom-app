package com.datacom.roles.infrastructure.adapter.in;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.datacom.roles.application.port.in.GetRolesUseCase;
import com.datacom.roles.domain.model.Role;
import com.datacom.roles.infrastructure.adapter.in.dto.RoleResponse;

/**
 * Adaptador de entrada (Input Adapter) REST para consultar roles.
 *
 * <p>Expone el recurso y delega en el caso de uso, nunca accede directamente
 * al repositorio.
 */
@RestController
@RequestMapping("/api/v1/roles")
public class RoleController {

    private final GetRolesUseCase getRolesUseCase;

    public RoleController(GetRolesUseCase getRolesUseCase) {
        this.getRolesUseCase = getRolesUseCase;
    }

    @GetMapping
    public ResponseEntity<List<RoleResponse>> getRoles(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        List<Role> roles = getRolesUseCase.getRoles(page, size);

        List<RoleResponse> responses = roles.stream()
                .map(RoleResponse::fromDomain)
                .toList();

        return ResponseEntity.ok(responses);
    }
}
