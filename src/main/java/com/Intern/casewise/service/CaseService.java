package com.Intern.casewise.service;

import com.Intern.casewise.dto.request.CaseRequest;
import com.Intern.casewise.dto.response.CaseResponse;
import java.util.List;
import java.util.Optional;

public interface CaseService {
    
    List<CaseResponse> getAllCases();
    
    Optional<CaseResponse> getCaseById(Long id);
    
    Optional<CaseResponse> getCaseByCaseNumber(String caseNumber);
    
    List<CaseResponse> searchCases(String query);
    
    List<CaseResponse> getCasesByStatus(String status);
    
    CaseResponse createCase(CaseRequest request);
    
    Optional<CaseResponse> updateCase(Long id, CaseRequest request);
    
    boolean deleteCase(Long id);
    
    Optional<CaseResponse> getCompleteCaseById(Long id);
}
