package com.javaweb.yolo_farm.dto.request;

import lombok.Data;

@Data
public class ModeRequest {
    private String mode;
    private String reqdevice;
    private boolean state;
}