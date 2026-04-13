package com.Intern.casewise.dto.request;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public class CaseRequest {

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    private String caseNumber;
    private String caseTitle;
    private String courtName;
    private String caseSummary;
    private String crimeCategory;
    private String crimeType;
    private String crimeDescription;
    private String crimeCommittedDate;
    private String crimeCommittedTime;

    private List<CasePartyRequest> caseParties;
    private List<AttachmentRequest> attachments;

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getCaseNumber() { return caseNumber; }
    public void setCaseNumber(String caseNumber) { this.caseNumber = caseNumber; }

    public String getCaseTitle() { return caseTitle; }
    public void setCaseTitle(String caseTitle) { this.caseTitle = caseTitle; }

    public String getCourtName() { return courtName; }
    public void setCourtName(String courtName) { this.courtName = courtName; }

    public String getCaseSummary() { return caseSummary; }
    public void setCaseSummary(String caseSummary) { this.caseSummary = caseSummary; }

    public String getCrimeCategory() { return crimeCategory; }
    public void setCrimeCategory(String crimeCategory) { this.crimeCategory = crimeCategory; }

    public String getCrimeType() { return crimeType; }
    public void setCrimeType(String crimeType) { this.crimeType = crimeType; }

    public String getCrimeDescription() { return crimeDescription; }
    public void setCrimeDescription(String crimeDescription) { this.crimeDescription = crimeDescription; }

    public String getCrimeCommittedDate() { return crimeCommittedDate; }
    public void setCrimeCommittedDate(String crimeCommittedDate) { this.crimeCommittedDate = crimeCommittedDate; }

    public String getCrimeCommittedTime() { return crimeCommittedTime; }
    public void setCrimeCommittedTime(String crimeCommittedTime) { this.crimeCommittedTime = crimeCommittedTime; }

    public List<CasePartyRequest> getCaseParties() { return caseParties; }
    public void setCaseParties(List<CasePartyRequest> caseParties) { this.caseParties = caseParties; }

    public List<AttachmentRequest> getAttachments() { return attachments; }
    public void setAttachments(List<AttachmentRequest> attachments) { this.attachments = attachments; }
}