package com.Intern.casewise.dto.response;

import com.Intern.casewise.model.Case;
import java.time.LocalDateTime;

public class CaseResponse {
    
    private Long id;
    private String firstName;
    private String lastName;
    private String caseNumber;
    private String status;
    private String description;
    private String createdBy;
    private String courtName;
    private CourtResponse court;
    private CasePartyResponse coreParty;
    private java.util.List<CasePartyResponse> caseParties;
    private java.util.List<String> crimes;
    private java.util.List<AttachmentResponse> attachments;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public CaseResponse() {}
    
    public static CaseResponse fromEntity(Case caseEntity) {
        CaseResponse response = new CaseResponse();
        response.setId(caseEntity.getId());
        response.setFirstName(caseEntity.getFirstName());
        response.setLastName(caseEntity.getLastName());
        response.setCaseNumber(caseEntity.getCaseNumber());
        response.setStatus(caseEntity.getStatus());
        response.setDescription(caseEntity.getDescription());
        
        if (caseEntity.getCreatedBy() != null) {
            response.setCreatedBy(
                caseEntity.getCreatedBy().getFirstName() + " " + 
                caseEntity.getCreatedBy().getLastName()
            );
        }
        
        if (caseEntity.getCourtName() != null) {
            response.setCourtName(caseEntity.getCourtName());
        }
        
        // if (caseEntity.getCourt() != null) {
        //     response.setCourt(CourtResponse.fromEntity(caseEntity.getCourt()));
        // }
        
        // if (caseEntity.getCoreParty() != null) {
        //     response.setCoreParty(CasePartyResponse.fromEntity(caseEntity.getCoreParty()));
        // }
        
        if (caseEntity.getCaseParties() != null) {
            response.setCaseParties(caseEntity.getCaseParties().stream()
                    .map(CasePartyResponse::fromEntity)
                    .collect(java.util.stream.Collectors.toList()));
        }
        
        if (caseEntity.getCrimes() != null) {
            response.setCrimes(caseEntity.getCrimes().stream()
                    .map(crime -> crime.getCrimeType())
                    .collect(java.util.stream.Collectors.toList()));
        }
        
        if (caseEntity.getAttachments() != null) {
            response.setAttachments(caseEntity.getAttachments().stream()
                    .map(AttachmentResponse::fromEntity)
                    .collect(java.util.stream.Collectors.toList()));
        }
        
        response.setCreatedAt(caseEntity.getCreatedAt());
        response.setUpdatedAt(caseEntity.getUpdatedAt());
        
        return response;
    }
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getFirstName() {
        return firstName;
    }
    
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    
    public String getLastName() {
        return lastName;
    }
    
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    
    public String getCaseNumber() {
        return caseNumber;
    }
    
    public void setCaseNumber(String caseNumber) {
        this.caseNumber = caseNumber;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getCreatedBy() {
        return createdBy;
    }
    
    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }
    
    public String getCourtName() {
        return courtName;
    }
    
    public void setCourtName(String courtName) {
        this.courtName = courtName;
    }
    
    public CourtResponse getCourt() { return court; }
    public void setCourt(CourtResponse court) { this.court = court; }
    
    public CasePartyResponse getCoreParty() { return coreParty; }
    public void setCoreParty(CasePartyResponse coreParty) { this.coreParty = coreParty; }
    
    public java.util.List<CasePartyResponse> getCaseParties() { return caseParties; }
    public void setCaseParties(java.util.List<CasePartyResponse> caseParties) { this.caseParties = caseParties; }
    
    public java.util.List<String> getCrimes() { return crimes; }
    public void setCrimes(java.util.List<String> crimes) { this.crimes = crimes; }
    
    public java.util.List<AttachmentResponse> getAttachments() { return attachments; }
    public void setAttachments(java.util.List<AttachmentResponse> attachments) { this.attachments = attachments; }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
