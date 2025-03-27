package com.javaweb.yolo_farm.repository;

import com.javaweb.yolo_farm.model.Factor;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface FactorRepository extends MongoRepository<Factor, String> {
    Optional<Factor> findByUserIDAndName(String userID, String name);
    List<Factor> findByUserID(String userID);
}