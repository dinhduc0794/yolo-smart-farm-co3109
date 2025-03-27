package com.javaweb.yolo_farm.dto;

import lombok.Data;

@Data
public class NotificationResponse {
    private String title;
    private String content;
    private String dtime;
    private boolean newFlag;
    private String device;
}