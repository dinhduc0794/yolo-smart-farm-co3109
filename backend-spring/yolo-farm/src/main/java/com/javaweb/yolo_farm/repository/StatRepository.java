package com.javaweb.yolo_farm.repository;

import com.javaweb.yolo_farm.model.Stat;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface StatRepository extends MongoRepository<Stat, String> {
    List<Stat> findByFactorID(String factorID);
    Optional<Stat> findTopByFactorIDOrderByDtimeDesc(String factorID);
}