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
@RequestMapping("/api/data")
public class DataController {

    @Autowired
    private DataService dataService;

    private String getUserId() {
        return SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
    }

    @GetMapping("/hello")
    public ResponseEntity<Map<String, String>> hello() {
        return ResponseEntity.ok(Map.of("message", "Hello"));
    }

    @GetMapping("/{factor}/mode")
    public ResponseEntity<Map<String, Object>> getMode(@PathVariable String factor) {
        return ResponseEntity.ok(dataService.getMode(getUserId(), factor));
    }

    @PutMapping("/{factor}/mode")
    public ResponseEntity<Map<String, Object>> putMode(@PathVariable String factor, @RequestBody Map<String, String> body) {
        String reqdevice = body.get("reqdevice");
        if (reqdevice == null) {
            return ResponseEntity.status(404).body(Map.of("error", "Device not found"));
        }
        return ResponseEntity.ok(dataService.putMode(getUserId(), reqdevice));
    }

    @PostMapping("/{factor}/mode")
    public ResponseEntity<Map<String, String>> postMode(@PathVariable String factor, @RequestBody ModeRequest request) {
        try {
            String message = dataService.postMode(getUserId(), request, factor);
            return ResponseEntity.ok(Map.of("message", message));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{factor}/current")
    public ResponseEntity<?> getCurrent(@PathVariable String factor) {
        try {
            double value = dataService.getCurrent(getUserId(), factor);
            return ResponseEntity.ok(Map.of("value", value));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{factor}/refresh")
    public ResponseEntity<?> refresh(@PathVariable String factor) {
        try {
            double value = dataService.refresh(getUserId(), factor);
            return ResponseEntity.ok(Map.of("value", value));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{factor}/threshold")
    public ResponseEntity<Map<String, Double>> getThreshold(@PathVariable String factor) {
        return ResponseEntity.ok(dataService.getThreshold(getUserId(), factor));
    }

    @PostMapping("/{factor}/threshold")
    public ResponseEntity<Map<String, String>> postThreshold(@PathVariable String factor, @RequestBody ThresholdRequest request) {
        try {
            String message = dataService.postThreshold(getUserId(), factor, request);
            return ResponseEntity.ok(Map.of("message", message));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/mode")
    public ResponseEntity<Map<String, String>> toggleMode(@RequestBody ModeRequest request) {
        if (request.getReqdevice() == null) {
            return ResponseEntity.status(404).body(Map.of("error", "Device not found"));
        }
        String message = dataService.toggleMode(getUserId(), request);
        return ResponseEntity.ok(Map.of("message", message));
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