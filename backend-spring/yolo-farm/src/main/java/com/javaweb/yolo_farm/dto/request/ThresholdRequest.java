package com.javaweb.yolo_farm.dto.request;

import lombok.Data;

@Data
public class ThresholdRequest {
    private double upperbound;
    private double lowerbound;
}