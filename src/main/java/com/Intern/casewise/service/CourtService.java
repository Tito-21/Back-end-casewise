package com.Intern.casewise.service;

import com.Intern.casewise.dto.request.CourtRequest;
import com.Intern.casewise.dto.response.CourtResponse;
import java.util.List;
import java.util.Optional;

public interface CourtService {
    List<CourtResponse> getAllCourts();
    Optional<CourtResponse> getCourtById(Long id);
    CourtResponse createCourt(CourtRequest request);
    Optional<CourtResponse> updateCourt(Long id, CourtRequest request);
    boolean deleteCourt(Long id);
}
