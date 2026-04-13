package com.Intern.casewise.controller;

import com.Intern.casewise.dto.response.ApiResponse;
import com.Intern.casewise.dto.request.CourtRequest;
import com.Intern.casewise.dto.response.CourtResponse;
import com.Intern.casewise.service.CourtService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courts")
public class CourtController {
    
    private final CourtService courtService;
    
    @Autowired
    public CourtController(CourtService courtService) {
        this.courtService = courtService;
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<CourtResponse>>> getAllCourts() {
        List<CourtResponse> courts = courtService.getAllCourts();
        return ResponseEntity.ok(ApiResponse.success("Courts retrieved successfully", courts));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CourtResponse>> getCourtById(@PathVariable Long id) {
        return courtService.getCourtById(id)
                .map(court -> ResponseEntity.ok(ApiResponse.success("Court retrieved successfully", court)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Court not found")));
    }
    
    @PostMapping("/create")
    public ResponseEntity<ApiResponse<CourtResponse>> createCourt(
            @Valid @RequestBody CourtRequest request) {
        try {
            CourtResponse createdCourt = courtService.createCourt(request);
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Court created successfully", createdCourt));
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CourtResponse>> updateCourt(
            @PathVariable Long id,
            @Valid @RequestBody CourtRequest request) {
        return courtService.updateCourt(id, request)
                .map(updatedCourt -> ResponseEntity.ok(ApiResponse.success("Court updated successfully", updatedCourt)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Court not found")));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCourt(@PathVariable Long id) {
        if (courtService.deleteCourt(id)) {
            return ResponseEntity.ok(ApiResponse.success("Court deleted successfully", null));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Court not found"));
        }
    }
}
