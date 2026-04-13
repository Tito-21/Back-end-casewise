package com.Intern.casewise.controller;

import com.Intern.casewise.dto.response.ApiResponse;
import com.Intern.casewise.dto.request.CrimeCategoryRequest;
import com.Intern.casewise.dto.response.CrimeCategoryResponse;
import com.Intern.casewise.service.CrimeCategoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/crime-categories")
public class CrimeCategoryController {
    
    private final CrimeCategoryService crimeCategoryService;
    
    @Autowired
    public CrimeCategoryController(CrimeCategoryService crimeCategoryService) {
        this.crimeCategoryService = crimeCategoryService;
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<CrimeCategoryResponse>>> getAllCrimeCategories() {
        List<CrimeCategoryResponse> categories = crimeCategoryService.getAllCrimeCategories();
        return ResponseEntity.ok(ApiResponse.success("Crime categories retrieved successfully", categories));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CrimeCategoryResponse>> getCrimeCategoryById(@PathVariable Long id) {
        return crimeCategoryService.getCrimeCategoryById(id)
                .map(category -> ResponseEntity.ok(ApiResponse.success("Crime category retrieved successfully", category)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Crime category not found")));
    }
    
    @GetMapping("/name/{categoryName}")
    public ResponseEntity<ApiResponse<CrimeCategoryResponse>> getCrimeCategoryByName(@PathVariable String categoryName) {
        return crimeCategoryService.getCrimeCategoryByName(categoryName)
                .map(category -> ResponseEntity.ok(ApiResponse.success("Crime category retrieved successfully", category)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Crime category not found")));
    }
    
    @PostMapping("/create")
    public ResponseEntity<ApiResponse<CrimeCategoryResponse>> createCrimeCategory(
            @Valid @RequestBody CrimeCategoryRequest request) {
        try {
            CrimeCategoryResponse createdCategory = crimeCategoryService.createCrimeCategory(request);
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Crime category created successfully", createdCategory));
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CrimeCategoryResponse>> updateCrimeCategory(
            @PathVariable Long id,
            @Valid @RequestBody CrimeCategoryRequest request) {
        return crimeCategoryService.updateCrimeCategory(id, request)
                .map(updatedCategory -> ResponseEntity.ok(ApiResponse.success("Crime category updated successfully", updatedCategory)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Crime category not found")));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCrimeCategory(@PathVariable Long id) {
        if (crimeCategoryService.deleteCrimeCategory(id)) {
            return ResponseEntity.ok(ApiResponse.success("Crime category deleted successfully", null));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Crime category not found"));
        }
    }
}
