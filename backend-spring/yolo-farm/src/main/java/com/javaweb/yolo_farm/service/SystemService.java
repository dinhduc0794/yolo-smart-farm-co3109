package com.javaweb.yolo_farm.service;

import com.javaweb.yolo_farm.model.Factor;
import com.javaweb.yolo_farm.model.Stat;
import com.javaweb.yolo_farm.repository.FactorRepository;
import com.javaweb.yolo_farm.repository.StatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class SystemService {

    @Autowired
    private FactorRepository factorRepository;

    @Autowired
    private StatRepository statRepository;

    public Map<String, List<Double>> getStats(String userId) {
        List<Factor> factors = factorRepository.findByUserID(userId);
        Map<String, List<Double>> statArrays = new HashMap<>();
        for (Factor factor : factors) {
            List<Stat> stats = statRepository.findByFactorID(factor.getId());
            statArrays.put(factor.getName().toLowerCase(), stats.stream().map(Stat::getValue).collect(Collectors.toList()));
        }
        return statArrays;
    }

    public Map<String, String> getSystemMode(String userId) {
        List<Factor> factors = factorRepository.findByUserID(userId);
        Map<String, String> factorModes = new HashMap<>();
        factors.forEach(factor -> factorModes.put(factor.getName().toLowerCase(), factor.getCurmode()));
        return factorModes;
    }

    public Map<String, String> setSystemMode(String userId) {
        List<Factor> factors = factorRepository.findByUserID(userId);
        factors.forEach(factor -> factor.setCurmode("Auto"));
        factorRepository.saveAll(factors);
        return Map.of("message", "All factors switched to Auto mode");
    }
}