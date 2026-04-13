package com.Intern.casewise.service.impl;

import com.Intern.casewise.dto.request.CrimeCategoryRequest;
import com.Intern.casewise.dto.response.CrimeCategoryResponse;
import com.Intern.casewise.model.CrimeCategory;
import com.Intern.casewise.repository.CrimeCategoryRepository;
import com.Intern.casewise.service.CrimeCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CrimeCategoryServiceImplementation implements CrimeCategoryService {
    
    private final CrimeCategoryRepository crimeCategoryRepository;
    
    @Autowired
    public CrimeCategoryServiceImplementation(CrimeCategoryRepository crimeCategoryRepository) {
        this.crimeCategoryRepository = crimeCategoryRepository;
    }
    
    @Override
    public List<CrimeCategoryResponse> getAllCrimeCategories() {
        return crimeCategoryRepository.findAll().stream()
                .map(CrimeCategoryResponse::fromEntity)
                .collect(Collectors.toList());
    }
    
    @Override
    public Optional<CrimeCategoryResponse> getCrimeCategoryById(Long id) {
        return crimeCategoryRepository.findById(id)
                .map(CrimeCategoryResponse::fromEntity);
    }
    
    @Override
    public Optional<CrimeCategoryResponse> getCrimeCategoryByName(String categoryName) {
        CrimeCategory category = crimeCategoryRepository.findByCategoryName(categoryName);
        if (category != null) {
            return Optional.of(CrimeCategoryResponse.fromEntity(category));
        }
        return Optional.empty();
    }
    
    @Override
    public CrimeCategoryResponse createCrimeCategory(CrimeCategoryRequest request) {
        CrimeCategory category = new CrimeCategory();
        category.setCategoryName(request.getCategoryName());
        
        CrimeCategory savedCategory = crimeCategoryRepository.save(category);
        return CrimeCategoryResponse.fromEntity(savedCategory);
    }
    
    @Override
    public Optional<CrimeCategoryResponse> updateCrimeCategory(Long id, CrimeCategoryRequest request) {
        return crimeCategoryRepository.findById(id)
                .map(category -> {
                    category.setCategoryName(request.getCategoryName());
                    CrimeCategory updatedCategory = crimeCategoryRepository.save(category);
                    return CrimeCategoryResponse.fromEntity(updatedCategory);
                });
    }
    
    @Override
    public boolean deleteCrimeCategory(Long id) {
        if (crimeCategoryRepository.existsById(id)) {
            crimeCategoryRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
