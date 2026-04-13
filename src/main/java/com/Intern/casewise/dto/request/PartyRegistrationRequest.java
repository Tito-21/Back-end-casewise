package com.Intern.casewise.dto.request;

import jakarta.validation.constraints.NotBlank;

public class PartyRegistrationRequest {
    
    @NotBlank(message = "Party name is required")
    private String partyName;
    
    @NotBlank(message = "Party type is required")
    private String partyType;
    
    private String address;
    private String phoneNumber;
    private String email;
    
    @NotBlank(message = "Case ID is required")
    private Long caseId;
    
    public PartyRegistrationRequest() {}
    
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
}
