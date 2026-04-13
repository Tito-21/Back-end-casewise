package com.Intern.casewise.dto.request;

import jakarta.validation.constraints.NotBlank;

public class CrimeCategoryRequest {
    
    @NotBlank(message = "Category name is required")
    private String categoryName;
    
    public CrimeCategoryRequest() {}
    
    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
}
