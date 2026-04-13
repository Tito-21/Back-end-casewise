package com.Intern.casewise.service.impl;

import com.Intern.casewise.constant.CaseConstants;
import com.Intern.casewise.exception.ResourceNotFoundException;
import com.Intern.casewise.model.Case;
import com.Intern.casewise.repository.CaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ExampleService {
    
    @Autowired
    private CaseRepository caseRepository;
    
    public Case updateCaseStatus(Long caseId, String newStatus) {
        // Using constants for validation
        if (!isValidStatus(newStatus)) {
            throw new IllegalArgumentException("Invalid status. Must be one of: " + 
                CaseConstants.CASE_STATUS_OPEN + ", " + 
                CaseConstants.CASE_STATUS_CLOSED + ", " + 
                CaseConstants.CASE_STATUS_PENDING);
        }
        
        // Using custom exception for not found
        Case caseEntity = caseRepository.findById(caseId)
            .orElseThrow(() -> new ResourceNotFoundException("Case", caseId));
        
        // Using constants for setting status
        caseEntity.setStatus(newStatus);
        return caseRepository.save(caseEntity);
    }
    
    private boolean isValidStatus(String status) {
        return status.equals(CaseConstants.CASE_STATUS_OPEN) ||
               status.equals(CaseConstants.CASE_STATUS_CLOSED) ||
               status.equals(CaseConstants.CASE_STATUS_PENDING) ||
               status.equals(CaseConstants.CASE_STATUS_IN_PROGRESS);
    }
}
