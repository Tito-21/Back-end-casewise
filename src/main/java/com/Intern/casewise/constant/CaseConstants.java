package com.Intern.casewise.constant;

public class CaseConstants {
    
    // Case Status
    public static final String CASE_STATUS_OPEN = "Open";
    public static final String CASE_STATUS_CLOSED = "Closed";
    public static final String CASE_STATUS_PENDING = "Pending";
    public static final String CASE_STATUS_IN_PROGRESS = "In Progress";
    
    // Party Types
    public static final String PARTY_TYPE_PLAINTIFF = "Plaintiff";
    public static final String PARTY_TYPE_DEFENDANT = "Defendant";
    public static final String PARTY_TYPE_WITNESS = "Witness";
    public static final String PARTY_TYPE_LAWYER = "Lawyer";
    public static final String PARTY_TYPE_JUDGE = "Judge";
    
    // Crime Status
    public static final String CRIME_STATUS_PENDING = "Pending";
    public static final String CRIME_STATUS_INVESTIGATING = "Investigating";
    public static final String CRIME_STATUS_RESOLVED = "Resolved";
    public static final String CRIME_STATUS_DISMISSED = "Dismissed";
    
    // Crime Severity
    public static final String SEVERITY_LOW = "Low";
    public static final String SEVERITY_MEDIUM = "Medium";
    public static final String SEVERITY_HIGH = "High";
    public static final String SEVERITY_CRITICAL = "Critical";
    
    // API Messages
    public static final String MESSAGE_SUCCESS = "Operation completed successfully";
    public static final String MESSAGE_NOT_FOUND = "Resource not found";
    public static final String MESSAGE_BAD_REQUEST = "Invalid request parameters";
    public static final String MESSAGE_UNAUTHORIZED = "Access denied";
    
    private CaseConstants() {
        // Private constructor to prevent instantiation
    }
}
