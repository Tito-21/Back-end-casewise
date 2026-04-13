package com.Intern.casewise.repository;

import com.Intern.casewise.model.Case;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CaseRepository extends JpaRepository<Case, Long> {
    
    Case findByCaseNumber(String caseNumber);
    
    @Query("SELECT c FROM Case c WHERE " +
           "LOWER(c.firstName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.lastName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.caseNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.description) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Case> searchCases(@Param("query") String query);
    
    List<Case> findByStatus(String status);
    
    @Query("SELECT c FROM Case c " +
           "LEFT JOIN FETCH c.caseParties " +
           "LEFT JOIN FETCH c.crimes " +
           "LEFT JOIN FETCH c.attachments " +
           "WHERE c.id = :id")
    Case findCaseWithRelations(@Param("id") Long id);
    
    long count();
}
