package com.example.demo.service;

import com.example.demo.model.Resource;
import com.example.demo.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ResourceService {

    @Autowired
    private ResourceRepository resourceRepository;

    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    public Optional<Resource> getResourceById(Long id) {
        return resourceRepository.findById(id);
    }

    public Resource createResource(Resource resource) {
        return resourceRepository.save(resource);
    }

    public Resource updateResource(Long id, Resource resourceDetails) {
        return resourceRepository.findById(id).map(resource -> {
            resource.setResourceName(resourceDetails.getResourceName());
            resource.setType(resourceDetails.getType());
            resource.setCapacity(resourceDetails.getCapacity());
            resource.setLocation(resourceDetails.getLocation());
            resource.setStatus(resourceDetails.getStatus());
            resource.setAvailabilityWindow(resourceDetails.getAvailabilityWindow());
            resource.setImageUrl(resourceDetails.getImageUrl());
            return resourceRepository.save(resource);
        }).orElseThrow(() -> new RuntimeException("Resource not found with id " + id));
    }

    public void deleteResource(Long id) {
        resourceRepository.deleteById(id);
    }
}
