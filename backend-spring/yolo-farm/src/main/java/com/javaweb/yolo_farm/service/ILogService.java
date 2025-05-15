package com.javaweb.yolo_farm.service;

import com.javaweb.yolo_farm.dto.response.LogResponse;
import com.javaweb.yolo_farm.dto.response.NotificationResponse;

import java.util.List;

public interface ILogService {
    List<LogResponse> getLogs(String userId);
    List<NotificationResponse> getNotifications(String userId);
    String updateNotifications(String userId);
}
