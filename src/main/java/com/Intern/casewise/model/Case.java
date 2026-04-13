package com.Intern.casewise.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "cases")
public class Case {
    
    public Case() {}
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String firstName;
    
    @Column(nullable = false)
    private String lastName;
    
    @Column(nullable = false, unique = true)
    private String caseNumber;
    
    @Column(nullable = false)
    private String status = "Open";
    
    @Column(length = 1000)
    private String description;
    
    @Column(length = 1000)
private String caseSummary;

@Column
private String caseTitle;

@Column
private String courtName;
    @OneToMany(mappedBy = "caseEntity", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Crime> crimes;
    
    @OneToMany(mappedBy = "caseEntity", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<CaseParty> caseParties;
    
    @OneToMany(mappedBy = "caseEntity", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Attachment> attachments;
    
    
    // @ManyToOne(fetch = FetchType.LAZY)
    // @JoinColumn(name = "court_id")
    // private Court court;
    
    // @ManyToOne(fetch = FetchType.LAZY)
    // @JoinColumn(name = "core_party_id")
    // private CaseParty coreParty;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    
    public String getCaseNumber() { return caseNumber; }
    public void setCaseNumber(String caseNumber) { this.caseNumber = caseNumber; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public List<Crime> getCrimes() { return crimes; }
    public void setCrimes(List<Crime> crimes) { this.crimes = crimes; }
    
    public List<CaseParty> getCaseParties() { return caseParties; }
    public void setCaseParties(List<CaseParty> caseParties) { this.caseParties = caseParties; }
    
    public List<Attachment> getAttachments() { return attachments; }
    public void setAttachments(List<Attachment> attachments) { this.attachments = attachments; }
    
    // public Court getCourt() { return court; }
    // public void setCourt(Court court) { this.court = court; }
    
    // public CaseParty getCoreParty() { return coreParty; }
    // public void setCoreParty(CaseParty coreParty) { this.coreParty = coreParty; }
    
    public User getCreatedBy() { return createdBy; }
    public void setCreatedBy(User createdBy) { this.createdBy = createdBy; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public String getCaseTitle() { return caseTitle; }
public void setCaseTitle(String caseTitle) { this.caseTitle = caseTitle; }

public String getCourtName() { return courtName; }
public void setCourtName(String courtName) { this.courtName = courtName; }

public String getCaseSummary() { return caseSummary; }
public void setCaseSummary(String caseSummary) { this.caseSummary = caseSummary; }
}
