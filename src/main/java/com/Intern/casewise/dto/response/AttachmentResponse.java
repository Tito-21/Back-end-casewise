package com.Intern.casewise.dto.response;

import com.Intern.casewise.model.Attachment;
import java.time.LocalDateTime;

public class AttachmentResponse {
    
    private Long id;
    private String fileName;
    private String fileType;
    private String fileUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public AttachmentResponse() {}
    
    public static AttachmentResponse fromEntity(Attachment attachment) {
        AttachmentResponse response = new AttachmentResponse();
        response.setId(attachment.getId());
        response.setFileName(attachment.getFileName());
        response.setFileType(attachment.getFileType());
        response.setFileUrl(attachment.getFileUrl());
        response.setCreatedAt(attachment.getCreatedAt());
        response.setUpdatedAt(attachment.getUpdatedAt());
        return response;
    }
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    
    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }
    
    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
