package com.Intern.casewise.service.impl;

import com.Intern.casewise.dto.request.CasePartyRequest;
import com.Intern.casewise.dto.request.CaseRequest;
import com.Intern.casewise.dto.response.CaseResponse;
import com.Intern.casewise.dto.response.CasePartyResponse;
import java.time.Year;
import com.Intern.casewise.model.Case;
import com.Intern.casewise.model.Crime;
import com.Intern.casewise.model.CaseParty;
import com.Intern.casewise.model.Attachment;
import com.Intern.casewise.dto.request.AttachmentRequest;
import com.Intern.casewise.dto.response.AttachmentResponse;
import com.Intern.casewise.repository.CaseRepository;
import com.Intern.casewise.repository.CasePartyRepository;
import com.Intern.casewise.repository.CrimeRepository;
import com.Intern.casewise.repository.AttachmentRepository;
import com.Intern.casewise.service.CaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CaseServiceImplementation implements CaseService {
    
    private final CaseRepository caseRepository;
    private final CrimeRepository crimeRepository;
    private final CasePartyRepository casePartyRepository;
    private final AttachmentRepository attachmentRepository;

    @Autowired
    public CaseServiceImplementation(CaseRepository caseRepository,
                                    CrimeRepository crimeRepository,
                                    CasePartyRepository casePartyRepository,
                                    AttachmentRepository attachmentRepository) {
        this.caseRepository = caseRepository;
        this.crimeRepository = crimeRepository;
        this.casePartyRepository = casePartyRepository;
        this.attachmentRepository = attachmentRepository;
    }
    @Override
    public List<CaseResponse> getAllCases() {
        return caseRepository.findAll()
                .stream()
                .map(CaseResponse::fromEntity)
                .collect(Collectors.toList());
    }
    
    @Override
    public Optional<CaseResponse> getCaseById(Long id) {
        return caseRepository.findById(id)
                .map(CaseResponse::fromEntity);
    }
    
    @Override
    public Optional<CaseResponse> getCaseByCaseNumber(String caseNumber) {
        return Optional.ofNullable(caseRepository.findByCaseNumber(caseNumber))
                .map(CaseResponse::fromEntity);
    }
    
    @Override
    public List<CaseResponse> searchCases(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllCases();
        }
        return caseRepository.searchCases(query)
                .stream()
                .map(CaseResponse::fromEntity)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<CaseResponse> getCasesByStatus(String status) {
        return caseRepository.findByStatus(status)
                .stream()
                .map(CaseResponse::fromEntity)
                .collect(Collectors.toList());
    }
    
    @Override
@Transactional
public CaseResponse createCase(CaseRequest request) {

    // 1. Build the Case
    Case caseEntity = new Case();
    caseEntity.setFirstName(request.getFirstName());
    caseEntity.setLastName(request.getLastName());
    caseEntity.setCaseNumber(generateCaseNumber());
    caseEntity.setCaseTitle(request.getCaseTitle());
    caseEntity.setCourtName(request.getCourtName());
    caseEntity.setCaseSummary(request.getCaseSummary());
    caseEntity.setDescription(request.getCaseSummary());
    caseEntity.setStatus("Open");
    
    // Set default created by user (you can modify this to get the actual user)
    // For now, we'll leave it null as there's no user management in the current setup

    // 2. Save case first to get ID
    Case savedCase = caseRepository.save(caseEntity);

    // 3. Build and save Crime
    if (request.getCrimeType() != null && !request.getCrimeType().isEmpty()) {
        Crime crime = new Crime();
        crime.setCrimeType(request.getCrimeType());
        crime.setDescription(request.getCrimeDescription());
        crime.setSeverity("Unknown"); // default since JSON doesn't send it
        crime.setStatus("Pending");
        crime.setCaseEntity(savedCase);
        crimeRepository.save(crime);
    }

    // 4. Build and save CaseParties
    if (request.getCaseParties() != null) {
        for (CasePartyRequest partyRequest : request.getCaseParties()) {
            CaseParty party = new CaseParty();
            // CaseParty uses partyName, so combine first + last
            party.setPartyName(partyRequest.getFirstName() + " " + partyRequest.getLastName());
            party.setPartyType(partyRequest.getRole() != null ? partyRequest.getRole() : "Unknown");
            party.setPhoneNumber(partyRequest.getPhoneNumber());
            party.setEmail(partyRequest.getEmail());
            party.setCaseEntity(savedCase);
            casePartyRepository.save(party);
        }
    }

    // 5. Build and save Attachments
    if (request.getAttachments() != null) {
        for (AttachmentRequest attachmentRequest : request.getAttachments()) {
            Attachment attachment = new Attachment();
            attachment.setFileName(attachmentRequest.getFileName());
            attachment.setFileType(attachmentRequest.getFileType());
            attachment.setFileUrl(attachmentRequest.getFileUrl());
            attachment.setCaseEntity(savedCase);
            attachmentRepository.save(attachment);
        }
    }

    // Build the response manually to avoid lazy loading issues
        return buildCompleteCaseResponse(savedCase);
    }
    
    private CaseResponse buildCompleteCaseResponse(Case caseEntity) {
        CaseResponse response = new CaseResponse();
        response.setId(caseEntity.getId());
        response.setFirstName(caseEntity.getFirstName());
        response.setLastName(caseEntity.getLastName());
        response.setCaseNumber(caseEntity.getCaseNumber());
        response.setStatus(caseEntity.getStatus());
        response.setDescription(caseEntity.getDescription());
        response.setCourtName(caseEntity.getCourtName());
        response.setCreatedAt(caseEntity.getCreatedAt());
        response.setUpdatedAt(caseEntity.getUpdatedAt());
        
        // Load created by user
        if (caseEntity.getCreatedBy() != null) {
            response.setCreatedBy(caseEntity.getCreatedBy().getFirstName() + " " + caseEntity.getCreatedBy().getLastName());
        }
        
        // Load case parties manually
        List<CaseParty> parties = casePartyRepository.findByCaseEntityId(caseEntity.getId());
        if (parties != null && !parties.isEmpty()) {
            response.setCaseParties(parties.stream()
                .map(CasePartyResponse::fromEntity)
                .collect(Collectors.toList()));
        }
        
        // Load crimes manually
        List<Crime> crimes = crimeRepository.findByCaseEntityId(caseEntity.getId());
        if (crimes != null && !crimes.isEmpty()) {
            response.setCrimes(crimes.stream()
                .map(crime -> crime.getCrimeType())
                .collect(Collectors.toList()));
        }
        
        // Load attachments manually
        List<Attachment> attachments = attachmentRepository.findByCaseEntityId(caseEntity.getId());
        if (attachments != null && !attachments.isEmpty()) {
            response.setAttachments(attachments.stream()
                .map(AttachmentResponse::fromEntity)
                .collect(Collectors.toList()));
        }
        
        return response;
    }
    
    @Override
    public Optional<CaseResponse> updateCase(Long id, CaseRequest request) {
        return caseRepository.findById(id)
                .map(existingCase -> {
                    if (request.getFirstName() != null) {
                        existingCase.setFirstName(request.getFirstName());
                    }
                    if (request.getLastName() != null) {
                        existingCase.setLastName(request.getLastName());
                    }
                    if (request.getCaseSummary() != null) {
                        existingCase.setDescription(request.getCaseSummary());
                    }
                    
                    Case updatedCase = caseRepository.save(existingCase);
                    return CaseResponse.fromEntity(updatedCase);
                });
    }
    
    @Override
    public boolean deleteCase(Long id) {
        if (caseRepository.existsById(id)) {
            caseRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    private String generateCaseNumber() {
        long count = caseRepository.count() + 1;
        int year = Year.now().getValue();
        String paddedNumber = String.format("%03d", count);
        return String.format("CW-%d-%s", year, paddedNumber);
    }
    
    @Override
    @Transactional
    public Optional<CaseResponse> getCompleteCaseById(Long id) {
        Case caseEntity = caseRepository.findCaseWithRelations(id);
        if (caseEntity != null) {
            return Optional.of(CaseResponse.fromEntity(caseEntity));
        }
        return Optional.empty();
    }
    
    private CaseResponse convertToCompleteCaseResponse(Case caseEntity) {
        CaseResponse response = new CaseResponse();
        response.setId(caseEntity.getId());
        response.setFirstName(caseEntity.getFirstName());
        response.setLastName(caseEntity.getLastName());
        response.setCaseNumber(caseEntity.getCaseNumber());
        response.setStatus(caseEntity.getStatus());
        response.setDescription(caseEntity.getDescription());
        response.setCreatedAt(caseEntity.getCreatedAt());
        response.setUpdatedAt(caseEntity.getUpdatedAt());
        
        // Load and set created by user
        if (caseEntity.getCreatedBy() != null) {
            response.setCreatedBy(caseEntity.getCreatedBy().getFirstName() + " " + caseEntity.getCreatedBy().getLastName());
        }
        
        // Court stored as string now
        if (caseEntity.getCourtName() != null) {
            response.setCourtName(caseEntity.getCourtName());
        }
        // Load and set all case parties
        if (caseEntity.getCaseParties() != null && !caseEntity.getCaseParties().isEmpty()) {
            response.setCaseParties(caseEntity.getCaseParties().stream()
                .map(CasePartyResponse::fromEntity)
                .collect(java.util.stream.Collectors.toList()));
        }
        
        // Load and set all crimes
        if (caseEntity.getCrimes() != null && !caseEntity.getCrimes().isEmpty()) {
            // For now, just set a simple crime count - you can enhance this later
            response.setCrimes(caseEntity.getCrimes().stream()
                .map(crime -> crime.getCrimeType())
                .collect(java.util.stream.Collectors.toList()));
        }
        
        return response;
    }
}
