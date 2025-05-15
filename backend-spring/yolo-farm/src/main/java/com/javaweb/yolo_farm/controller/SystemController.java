package com.javaweb.yolo_farm.controller;

import com.javaweb.yolo_farm.service.ISystemService;
import com.javaweb.yolo_farm.service.impl.SystemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/system")
public class SystemController {

    @Autowired
    private ISystemService systemService;

    private String getUserId() {
        return SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
    }

    @GetMapping("/stat")
    public ResponseEntity<?> getStats() {
        try {
            return ResponseEntity.ok(systemService.getStats(getUserId()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Internal server error"));
        }
    }

    @GetMapping("/systemmode")
    public ResponseEntity<?> getSystemMode() {
        try {
            return ResponseEntity.ok(systemService.getSystemMode(getUserId()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Internal server error"));
        }
    }

    @PostMapping("/systemmode")
    public ResponseEntity<?> setSystemMode() {
        try {
            return ResponseEntity.ok(systemService.setSystemMode(getUserId()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Internal server error"));
        }
    }
}