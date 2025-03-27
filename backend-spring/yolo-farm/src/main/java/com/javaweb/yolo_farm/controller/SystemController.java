package com.javaweb.yolo_farm.controller;

import com.javaweb.yolo_farm.service.SystemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/system")
public class SystemController {

    @Autowired
    private SystemService systemService;

    private String getUserId() {
        return SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
    }

    @GetMapping("/stat")
    public ResponseEntity<?> getStats() {
        try {
            return ResponseEntity.ok(systemService.getStats(getUserId()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/systemmode")
    public ResponseEntity<Map<String, String>> getSystemMode() {
        try {
            return ResponseEntity.ok(systemService.getSystemMode(getUserId()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/systemmode")
    public ResponseEntity<Map<String, String>> setSystemMode() {
        try {
            String message = systemService.setSystemMode(getUserId());
            return ResponseEntity.ok(Map.of("message", message));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}