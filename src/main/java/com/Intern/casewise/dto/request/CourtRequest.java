package com.Intern.casewise.dto.request;

import jakarta.validation.constraints.NotBlank;

public class CourtRequest {
    
    @NotBlank(message = "Court name is required")
    private String courtName;
    
    public CourtRequest() {}
    
    public String getCourtName() { return courtName; }
    public void setCourtName(String courtName) { this.courtName = courtName; }
}
