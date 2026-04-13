package com.Intern.casewise.repository;

import com.Intern.casewise.model.Crime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CrimeRepository extends JpaRepository<Crime, Long> {
    
    java.util.List<Crime> findByCaseEntityId(Long caseId);
}
