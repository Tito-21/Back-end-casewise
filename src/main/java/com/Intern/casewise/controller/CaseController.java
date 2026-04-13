package com.Intern.casewise.controller;

import com.Intern.casewise.dto.response.ApiResponse;
import com.Intern.casewise.dto.request.CaseRequest;
import com.Intern.casewise.dto.response.CaseResponse;
import com.Intern.casewise.service.CaseService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/cases")
public class CaseController {
    
    private final CaseService caseService;
    
    @Autowired
    public CaseController(CaseService caseService) {
        this.caseService = caseService;
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<CaseResponse>>> getAllCases() {
        List<CaseResponse> cases = caseService.getAllCases();
        return ResponseEntity.ok(ApiResponse.success("Cases retrieved successfully", cases));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CaseResponse>> getCaseById(@PathVariable Long id) {
        return caseService.getCaseById(id)
                .map(caseResponse -> ResponseEntity.ok(ApiResponse.success("Case retrieved successfully", caseResponse)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Case not found")));
    }
    
    @GetMapping("/number/{caseNumber}")
    public ResponseEntity<ApiResponse<CaseResponse>> getCaseByCaseNumber(@PathVariable String caseNumber) {
        return caseService.getCaseByCaseNumber(caseNumber)
                .map(caseResponse -> ResponseEntity.ok(ApiResponse.success("Case retrieved successfully", caseResponse)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Case not found")));
    }
    
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<CaseResponse>>> searchCases(@RequestParam String query) {
        List<CaseResponse> cases = caseService.searchCases(query);
        return ResponseEntity.ok(ApiResponse.success("Cases retrieved successfully", cases));
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<CaseResponse>>> getCasesByStatus(@PathVariable String status) {
        List<CaseResponse> cases = caseService.getCasesByStatus(status);
        return ResponseEntity.ok(ApiResponse.success("Cases retrieved successfully", cases));
    }
    
    @PostMapping("/create")
    public ResponseEntity<ApiResponse<CaseResponse>> createCase(
            @Valid @RequestBody CaseRequest request) {
        try {
            CaseResponse createdCase = caseService.createCase(request);
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Case created successfully", createdCase));
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CaseResponse>> updateCase(
            @PathVariable Long id,
            @Valid @RequestBody CaseRequest request) {
        return caseService.updateCase(id, request)
                .map(updatedCase -> ResponseEntity.ok(ApiResponse.success("Case updated successfully", updatedCase)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Case not found")));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCase(@PathVariable Long id) {
        if (caseService.deleteCase(id)) {
            return ResponseEntity.ok(ApiResponse.success("Case deleted successfully", null));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Case not found"));
        }
    }
    
    @GetMapping("/{id}/complete")
    public ResponseEntity<ApiResponse<CaseResponse>> getCompleteCaseById(@PathVariable Long id) {
        Optional<CaseResponse> caseResponse = caseService.getCompleteCaseById(id);
        if (caseResponse.isPresent()) {
            return ResponseEntity.ok(ApiResponse.success("Complete case retrieved successfully", caseResponse.get()));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Case not found"));
        }
    }
}
