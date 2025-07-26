package com.ziohelp.service;

import com.ziohelp.entity.Organization;
import com.ziohelp.repository.OrganizationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrganizationService {
    @Autowired
    private OrganizationRepository organizationRepository;

    public List<Organization> getAllOrganizations() {
        return organizationRepository.findAll();
    }

    public Page<Organization> getAllOrganizationsPaged(String search, Pageable pageable) {
        return organizationRepository.findAllPaged(search == null || search.isEmpty() ? null : search, pageable);
    }

    public Organization getOrganizationById(Long id) {
        return organizationRepository.findById(id).orElse(null);
    }

    public Organization getOrganizationByName(String name) {
        return organizationRepository.findByName(name);
    }

    public Organization createOrganization(Organization org) {
        return organizationRepository.save(org);
    }

    public void deleteOrganization(Long id) {
        organizationRepository.deleteById(id);
    }
} 