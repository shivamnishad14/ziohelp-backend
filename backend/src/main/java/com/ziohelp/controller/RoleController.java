package com.ziohelp.controller;


import com.ziohelp.entity.Role;
import com.ziohelp.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/roles")
public class RoleController {
    @Autowired
    private RoleRepository roleRepository;

    @GetMapping
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRoleById(@PathVariable Long id) {
        Optional<Role> role = roleRepository.findById(id);
        return role.<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(404).body((Object)"Role not found"));
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<?> getRoleByName(@PathVariable String name) {
        Optional<Role> role = roleRepository.findAll().stream().filter(r -> r.getName().equalsIgnoreCase(name)).findFirst();
        return role.<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(404).body((Object)"Role not found"));
    }

    @PostMapping
    public ResponseEntity<?> createRole(@RequestBody Role role) {
        if (role.getName() == null || role.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Role name is required");
        }
        boolean exists = roleRepository.findAll().stream().anyMatch(r -> r.getName().equalsIgnoreCase(role.getName()));
        if (exists) {
            return ResponseEntity.badRequest().body("Role name already exists");
        }
        Role saved = roleRepository.save(role);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateRole(@PathVariable Long id, @RequestBody Role role) {
        Optional<Role> existing = roleRepository.findById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.status(404).body("Role not found");
        }
        if (role.getName() == null || role.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Role name is required");
        }
        boolean exists = roleRepository.findAll().stream().anyMatch(r -> r.getName().equalsIgnoreCase(role.getName()) && !r.getId().equals(id));
        if (exists) {
            return ResponseEntity.badRequest().body("Role name already exists");
        }
        Role toUpdate = existing.get();
        toUpdate.setName(role.getName());
        Role saved = roleRepository.save(toUpdate);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRole(@PathVariable Long id) {
        Optional<Role> existing = roleRepository.findById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.status(404).body("Role not found");
        }
        roleRepository.deleteById(id);
        return ResponseEntity.ok().body("Role deleted");
    }

    @GetMapping("/check-name/{name}")
    public ResponseEntity<?> checkRoleName(@PathVariable String name) {
        boolean exists = roleRepository.findAll().stream().anyMatch(r -> r.getName().equalsIgnoreCase(name));
        return ResponseEntity.ok(exists);
    }
}