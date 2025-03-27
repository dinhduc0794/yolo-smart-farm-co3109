package com.javaweb.yolo_farm.repository;

import com.javaweb.yolo_farm.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<Notification> findByUserID(String userID);
}