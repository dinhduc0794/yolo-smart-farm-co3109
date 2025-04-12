package com.javaweb.yolo_farm.dto.request;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class ThresholdRequest {
    private double upperbound;
    private double lowerbound;
}