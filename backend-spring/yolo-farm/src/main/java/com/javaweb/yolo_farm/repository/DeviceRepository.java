package com.javaweb.yolo_farm.repository;

import com.javaweb.yolo_farm.model.Device;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface DeviceRepository extends MongoRepository<Device, String> {
    Optional<Device> findByUserIDAndName(String userID, String name);
    Optional<Device> findByUserID(String userID);
}