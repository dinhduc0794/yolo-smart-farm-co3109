package com.javaweb.yolo_farm.controller;

import com.javaweb.yolo_farm.dto.request.ModeRequest;
import com.javaweb.yolo_farm.dto.request.ThresholdRequest;
import com.javaweb.yolo_farm.service.DataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class DataController {

    @Autowired
    private DataService dataService;

    private String getUserId() {
        return SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
    }

    @GetMapping("/hello")
    public ResponseEntity<?> hello() {
        return ResponseEntity.ok("Hello World");
    }

    @GetMapping("/{factor}/mode")
    public ResponseEntity<?> getMode(@PathVariable String factor) {
        try {
            return ResponseEntity.ok(dataService.getMode(getUserId(), factor));
        } catch (Exception e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{factor}/mode")
    public ResponseEntity<?> putMode(@PathVariable String factor) {
        try {
            return ResponseEntity.ok(dataService.putMode(getUserId(), factor));
        } catch (Exception e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{factor}/mode")
    public ResponseEntity<?> postMode(@PathVariable String factor, @RequestBody ModeRequest request) {
        try {
            return ResponseEntity.ok(dataService.postMode(getUserId(), request, factor));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{factor}/current")
    public ResponseEntity<?> getCurrent(@PathVariable String factor) {
        try {
            return ResponseEntity.ok(dataService.getCurrent(getUserId(), factor));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{factor}/refresh")
    public ResponseEntity<?> refresh(@PathVariable String factor) {
        try {
            return ResponseEntity.ok(dataService.refresh(getUserId(), factor));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{factor}/threshold")
    public ResponseEntity<?> getThreshold(@PathVariable String factor) {
        try {
            return ResponseEntity.ok(dataService.getThreshold(getUserId(), factor));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{factor}/threshold")
    public ResponseEntity<?> postThreshold(@PathVariable String factor, @RequestBody ThresholdRequest request) {
        try {
            return ResponseEntity.ok(dataService.postThreshold(getUserId(), factor, request));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/mode")
    public ResponseEntity<?> toggleMode(@RequestBody ModeRequest request) {
        try {
            return ResponseEntity.ok(dataService.toggleMode(getUserId(), request));
        } catch (Exception e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/mode")
    public ResponseEntity<?> getDeviceModes() {
        try {
            return ResponseEntity.ok(dataService.getDeviceModes(getUserId()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}