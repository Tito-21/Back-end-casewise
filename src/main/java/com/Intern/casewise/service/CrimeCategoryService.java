package com.Intern.casewise.service;

import com.Intern.casewise.dto.request.CrimeCategoryRequest;
import com.Intern.casewise.dto.response.CrimeCategoryResponse;
import java.util.List;
import java.util.Optional;

public interface CrimeCategoryService {
    List<CrimeCategoryResponse> getAllCrimeCategories();
    Optional<CrimeCategoryResponse> getCrimeCategoryById(Long id);
    Optional<CrimeCategoryResponse> getCrimeCategoryByName(String categoryName);
    CrimeCategoryResponse createCrimeCategory(CrimeCategoryRequest request);
    Optional<CrimeCategoryResponse> updateCrimeCategory(Long id, CrimeCategoryRequest request);
    boolean deleteCrimeCategory(Long id);
}
