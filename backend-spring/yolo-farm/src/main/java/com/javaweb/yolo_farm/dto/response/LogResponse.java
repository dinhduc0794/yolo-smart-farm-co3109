package com.javaweb.yolo_farm.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class LogResponse {
    private String content;
    private String dtime;
}