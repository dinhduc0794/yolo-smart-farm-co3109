package com.javaweb.yolo_farm.service.impl;

import com.javaweb.yolo_farm.model.ActivityLog;
import com.javaweb.yolo_farm.repository.ActivityLogRepository;
import com.javaweb.yolo_farm.service.IActivityLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class ActivityLogService implements IActivityLogService {

    @Autowired
    private ActivityLogRepository activityLogRepository;

    @Override
    public void createLog(String userId, String content) {
        ActivityLog log = new ActivityLog();
        log.setUserID(userId);
        log.setContent(content);
        log.setDtime(new Date());
        activityLogRepository.save(log);
    }
}