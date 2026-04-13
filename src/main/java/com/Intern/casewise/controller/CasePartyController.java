package com.Intern.casewise.controller;

import com.Intern.casewise.dto.response.ApiResponse;
import com.Intern.casewise.dto.request.PartyRegistrationRequest;
import com.Intern.casewise.dto.response.CasePartyResponse;
import com.Intern.casewise.service.CasePartyService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/parties")
public class CasePartyController {
    
    private final CasePartyService casePartyService;
    
    @Autowired
    public CasePartyController(CasePartyService casePartyService) {
        this.casePartyService = casePartyService;
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<CasePartyResponse>>> getAllParties() {
        List<CasePartyResponse> parties = casePartyService.getAllCaseParties();
        return ResponseEntity.ok(ApiResponse.success("Parties retrieved successfully", parties));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CasePartyResponse>> getPartyById(@PathVariable Long id) {
        return casePartyService.getCasePartyById(id)
                .map(party -> ResponseEntity.ok(ApiResponse.success("Party retrieved successfully", party)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Party not found")));
    }
    
    @GetMapping("/case/{caseId}")
    public ResponseEntity<ApiResponse<List<CasePartyResponse>>> getPartiesByCaseId(@PathVariable Long caseId) {
        List<CasePartyResponse> parties = casePartyService.getPartiesByCaseId(caseId);
        return ResponseEntity.ok(ApiResponse.success("Parties retrieved successfully", parties));
    }
    
    @GetMapping("/type/{partyType}")
    public ResponseEntity<ApiResponse<List<CasePartyResponse>>> getPartiesByType(@PathVariable String partyType) {
        List<CasePartyResponse> parties = casePartyService.getPartiesByPartyType(partyType);
        return ResponseEntity.ok(ApiResponse.success("Parties retrieved successfully", parties));
    }
    
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<CasePartyResponse>> registerParty(
            @Valid @RequestBody PartyRegistrationRequest request) {
        try {
            CasePartyResponse registeredParty = casePartyService.registerParty(request);
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Party registered successfully", registeredParty));
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CasePartyResponse>> updateParty(
            @PathVariable Long id,
            @Valid @RequestBody PartyRegistrationRequest request) {
        return casePartyService.updateCaseParty(id, request)
                .map(updatedParty -> ResponseEntity.ok(ApiResponse.success("Party updated successfully", updatedParty)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Party not found")));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteParty(@PathVariable Long id) {
        if (casePartyService.deleteCaseParty(id)) {
            return ResponseEntity.ok(ApiResponse.success("Party deleted successfully", null));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Party not found"));
        }
    }
}
