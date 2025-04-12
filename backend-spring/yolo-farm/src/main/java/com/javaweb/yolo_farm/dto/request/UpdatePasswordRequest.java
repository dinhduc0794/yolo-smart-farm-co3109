package com.javaweb.yolo_farm.dto.request;

import lombok.Data;

@Data
public class UpdatePasswordRequest {
    private String curPassword;
    private String newPassword;
}