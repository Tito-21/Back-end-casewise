package com.Intern.casewise.dto.response;

import java.time.LocalDateTime;

public class CourtResponse {
    
    private Long courtId;
    private String courtName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public CourtResponse() {}
    
    public static CourtResponse fromEntity(com.Intern.casewise.model.Court court) {
        CourtResponse response = new CourtResponse();
        response.setCourtId(court.getCourtId());
        response.setCourtName(court.getCourtName());
        response.setCreatedAt(court.getCreatedAt());
        response.setUpdatedAt(court.getUpdatedAt());
        return response;
    }
    
    public Long getCourtId() { return courtId; }
    public void setCourtId(Long courtId) { this.courtId = courtId; }
    
    public String getCourtName() { return courtName; }
    public void setCourtName(String courtName) { this.courtName = courtName; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
