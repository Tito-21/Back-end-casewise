package com.Intern.casewise.service.impl;

import com.Intern.casewise.dto.request.CourtRequest;
import com.Intern.casewise.dto.response.CourtResponse;
import com.Intern.casewise.model.Court;
import com.Intern.casewise.repository.CourtRepository;
import com.Intern.casewise.service.CourtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CourtServiceImplementation implements CourtService {
    
    private final CourtRepository courtRepository;
    
    @Autowired
    public CourtServiceImplementation(CourtRepository courtRepository) {
        this.courtRepository = courtRepository;
    }
    
    @Override
    public List<CourtResponse> getAllCourts() {
        return courtRepository.findAll().stream()
                .map(CourtResponse::fromEntity)
                .collect(Collectors.toList());
    }
    
    @Override
    public Optional<CourtResponse> getCourtById(Long id) {
        return courtRepository.findById(id)
                .map(CourtResponse::fromEntity);
    }
    
    @Override
    public CourtResponse createCourt(CourtRequest request) {
        Court court = new Court();
        court.setCourtName(request.getCourtName());
        
        Court savedCourt = courtRepository.save(court);
        return CourtResponse.fromEntity(savedCourt);
    }
    
    @Override
    public Optional<CourtResponse> updateCourt(Long id, CourtRequest request) {
        return courtRepository.findById(id)
                .map(court -> {
                    court.setCourtName(request.getCourtName());
                    Court updatedCourt = courtRepository.save(court);
                    return CourtResponse.fromEntity(updatedCourt);
                });
    }
    
    @Override
    public boolean deleteCourt(Long id) {
        if (courtRepository.existsById(id)) {
            courtRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
