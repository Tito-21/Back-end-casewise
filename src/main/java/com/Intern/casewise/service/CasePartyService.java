package com.Intern.casewise.service;

import com.Intern.casewise.dto.request.PartyRegistrationRequest;
import com.Intern.casewise.dto.response.CasePartyResponse;
import java.util.List;
import java.util.Optional;

public interface CasePartyService {
    List<CasePartyResponse> getAllCaseParties();
    List<CasePartyResponse> getPartiesByCaseId(Long caseId);
    List<CasePartyResponse> getPartiesByPartyType(String partyType);
    Optional<CasePartyResponse> getCasePartyById(Long id);
    CasePartyResponse registerParty(PartyRegistrationRequest request);
    Optional<CasePartyResponse> updateCaseParty(Long id, PartyRegistrationRequest request);
    boolean deleteCaseParty(Long id);
}
