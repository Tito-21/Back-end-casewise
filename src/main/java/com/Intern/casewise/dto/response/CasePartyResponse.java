package com.Intern.casewise.dto.response;

import java.time.LocalDateTime;

public class CasePartyResponse {
    
    private Long id;
    private String partyName;
    private String partyType;
    private String address;
    private String phoneNumber;
    private String email;
    private Long caseId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public CasePartyResponse() {}
    
    public static CasePartyResponse fromEntity(com.Intern.casewise.model.CaseParty caseParty) {
        CasePartyResponse response = new CasePartyResponse();
        response.setId(caseParty.getId());
        response.setPartyName(caseParty.getPartyName());
        response.setPartyType(caseParty.getPartyType());
        response.setAddress(caseParty.getAddress());
        response.setPhoneNumber(caseParty.getPhoneNumber());
        response.setEmail(caseParty.getEmail());
        response.setCaseId(caseParty.getCaseEntity() != null ? caseParty.getCaseEntity().getId() : null);
        response.setCreatedAt(caseParty.getCreatedAt());
        response.setUpdatedAt(caseParty.getUpdatedAt());
        return response;
    }
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getPartyName() { return partyName; }
    public void setPartyName(String partyName) { this.partyName = partyName; }
    
    public String getPartyType() { return partyType; }
    public void setPartyType(String partyType) { this.partyType = partyType; }
    
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public Long getCaseId() { return caseId; }
    public void setCaseId(Long caseId) { this.caseId = caseId; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
