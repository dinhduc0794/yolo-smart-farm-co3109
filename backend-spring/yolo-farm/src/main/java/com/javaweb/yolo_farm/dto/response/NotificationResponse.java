package com.javaweb.yolo_farm.dto.response;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class NotificationResponse {
    private String title;
    private String content;
    private String dtime;
    private boolean newFlag;
    private String device;
}