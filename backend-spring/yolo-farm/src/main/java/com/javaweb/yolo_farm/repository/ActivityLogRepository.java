package com.javaweb.yolo_farm.repository;

import com.javaweb.yolo_farm.model.ActivityLog;
import com.javaweb.yolo_farm.model.Factor;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ActivityLogRepository extends MongoRepository<ActivityLog, String> {
    List<ActivityLog> findByUserID(String userID);
}