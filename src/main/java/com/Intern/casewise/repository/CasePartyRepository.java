package com.Intern.casewise.repository;

import com.Intern.casewise.model.CaseParty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CasePartyRepository extends JpaRepository<CaseParty, Long> {
    
    List<CaseParty> findByCaseEntityId(Long caseId);
    
    List<CaseParty> findByPartyType(String partyType);
    
    List<CaseParty> findByCaseEntityIdAndPartyType(Long caseId, String partyType);
}
