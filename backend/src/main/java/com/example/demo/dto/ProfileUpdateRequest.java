package com.example.demo.dto;

import lombok.Data;

@Data
public class ProfileUpdateRequest {
    private String firstName;
    private String lastName;
    private String studentId;
    private String academicProgram;
    private Integer degreeProgress;
    private String labCredits;
    private String avatarUrl;
}
