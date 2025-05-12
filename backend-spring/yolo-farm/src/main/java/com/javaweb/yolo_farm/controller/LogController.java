package com.javaweb.yolo_farm.controller;

import com.javaweb.yolo_farm.service.LogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/log")
public class LogController {

    @Autowired
    private LogService logService;

    private String getUserId() {
        return SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
    }

    @GetMapping("/log")
    public ResponseEntity<?> getLogs() {
        try {
            return ResponseEntity.ok(logService.getLogs(getUserId()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Internal server error"));
        }
    }

    @GetMapping("/notification")
    public ResponseEntity<?> getNotifications() {
        try {
            return ResponseEntity.ok(logService.getNotifications(getUserId()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Internal server error"));
        }
    }

    @PostMapping("/notification")
    public ResponseEntity<?> updateNotifications() {
        try {
            return ResponseEntity.ok(Map.of("message", logService.updateNotifications(getUserId())));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Internal server error"));
        }
    }
}