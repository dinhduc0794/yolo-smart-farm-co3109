package com.javaweb.yolo_farm.service;

import java.util.List;
import java.util.Map;

public interface ISystemService {
    Map<String, List<Double>> getStats(String userId);
    Map<String, String> getSystemMode(String userId);
    Map<String, String> setSystemMode(String userId);
}
