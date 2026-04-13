package com.Intern.casewise.repository;

import com.Intern.casewise.model.CrimeCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CrimeCategoryRepository extends JpaRepository<CrimeCategory, Long> {
    CrimeCategory findByCategoryName(String categoryName);
}
