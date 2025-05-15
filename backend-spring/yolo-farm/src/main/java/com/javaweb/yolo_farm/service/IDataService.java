package com.javaweb.yolo_farm.service;

import com.javaweb.yolo_farm.dto.request.ModeRequest;
import com.javaweb.yolo_farm.dto.request.ThresholdRequest;
import com.javaweb.yolo_farm.model.Factor;

import java.util.Map;

public interface IDataService {
    Map<String, Object> getMode(String userId, String factorName);

    Map<String, Object> putMode(String userId, String factorName);

    Map<String, String> postMode(String userId, ModeRequest request, String factorName);

    Map<String, Object> getCurrent(String userId, String factorName);

    Map<String, Object> refresh(String userId, String factorName);

    Map<String, Double> getThreshold(String userId, String factorName);

    Map<String, String> postThreshold(String userId, String factorName, ThresholdRequest request);

    Map<String, String> toggleMode(String userId, ModeRequest request);

    Map<String, Boolean> getDeviceModes(String userId);
}
