package com.javaweb.yolo_farm.dto.request;

import lombok.Data;

@Data
public class SignInRequest {
    private String email;
    private String password;
}