package com.javaweb.yolo_farm.dto;

import lombok.Data;

@Data
public class UpdatePasswordRequest {
    private String curPassword;
    private String newPassword;
}