package com.Intern.casewise.service.impl;

import com.Intern.casewise.dto.request.PartyRegistrationRequest;
import com.Intern.casewise.dto.response.CasePartyResponse;
import com.Intern.casewise.model.CaseParty;
import com.Intern.casewise.model.Case;
import com.Intern.casewise.repository.CasePartyRepository;
import com.Intern.casewise.repository.CaseRepository;
import com.Intern.casewise.service.CasePartyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CasePartyServiceImplementation implements CasePartyService {
    
    private final CasePartyRepository casePartyRepository;
    private final CaseRepository caseRepository;
    
    @Autowired
    public CasePartyServiceImplementation(CasePartyRepository casePartyRepository, CaseRepository caseRepository) {
        this.casePartyRepository = casePartyRepository;
        this.caseRepository = caseRepository;
    }
    
    @Override
    public List<CasePartyResponse> getAllCaseParties() {
        return casePartyRepository.findAll().stream()
                .map(CasePartyResponse::fromEntity)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<CasePartyResponse> getPartiesByCaseId(Long caseId) {
        return casePartyRepository.findByCaseEntityId(caseId).stream()
                .map(CasePartyResponse::fromEntity)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<CasePartyResponse> getPartiesByPartyType(String partyType) {
        return casePartyRepository.findByPartyType(partyType).stream()
                .map(CasePartyResponse::fromEntity)
                .collect(Collectors.toList());
    }
    
    @Override
    public Optional<CasePartyResponse> getCasePartyById(Long id) {
        return casePartyRepository.findById(id)
                .map(CasePartyResponse::fromEntity);
    }
    
    @Override
    public CasePartyResponse registerParty(PartyRegistrationRequest request) {
        Case caseEntity = caseRepository.findById(request.getCaseId())
                .orElseThrow(() -> new RuntimeException("Case not found with id: " + request.getCaseId()));
        
        CaseParty caseParty = new CaseParty();
        caseParty.setPartyName(request.getPartyName());
        caseParty.setPartyType(request.getPartyType());
        caseParty.setAddress(request.getAddress());
        caseParty.setPhoneNumber(request.getPhoneNumber());
        caseParty.setEmail(request.getEmail());
        caseParty.setCaseEntity(caseEntity);
        
        CaseParty savedParty = casePartyRepository.save(caseParty);
        return CasePartyResponse.fromEntity(savedParty);
    }
    
    @Override
    public Optional<CasePartyResponse> updateCaseParty(Long id, PartyRegistrationRequest request) {
        return casePartyRepository.findById(id)
                .map(caseParty -> {
                    caseParty.setPartyName(request.getPartyName());
                    caseParty.setPartyType(request.getPartyType());
                    caseParty.setAddress(request.getAddress());
                    caseParty.setPhoneNumber(request.getPhoneNumber());
                    caseParty.setEmail(request.getEmail());
                    
                    if (request.getCaseId() != null && !request.getCaseId().equals(caseParty.getCaseEntity().getId())) {
                        Case caseEntity = caseRepository.findById(request.getCaseId())
                                .orElseThrow(() -> new RuntimeException("Case not found with id: " + request.getCaseId()));
                        caseParty.setCaseEntity(caseEntity);
                    }
                    
                    CaseParty updatedParty = casePartyRepository.save(caseParty);
                    return CasePartyResponse.fromEntity(updatedParty);
                });
    }
    
    @Override
    public boolean deleteCaseParty(Long id) {
        if (casePartyRepository.existsById(id)) {
            casePartyRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
