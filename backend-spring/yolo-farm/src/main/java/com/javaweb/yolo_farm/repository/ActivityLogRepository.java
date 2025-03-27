package com.javaweb.yolo_farm.repository;

import com.javaweb.yolo_farm.model.ActivityLog;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ActivityLogRepository extends MongoRepository<ActivityLog, String> {
}