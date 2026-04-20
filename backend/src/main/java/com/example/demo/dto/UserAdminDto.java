package com.example.demo.dto;

import com.example.demo.model.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserAdminDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private Role role;
    private Long createdAt;
}
