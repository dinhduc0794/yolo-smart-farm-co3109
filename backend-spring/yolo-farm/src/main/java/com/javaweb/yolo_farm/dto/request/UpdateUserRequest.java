package com.javaweb.yolo_farm.dto;

import lombok.Data;

@Data
public class UpdateUserRequest {
    private String name;
    private String email;
    private String address;
    private String phoneno;
    private String password;
}