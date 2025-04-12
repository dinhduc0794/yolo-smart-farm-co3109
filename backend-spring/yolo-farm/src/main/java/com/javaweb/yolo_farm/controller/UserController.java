package com.javaweb.yolo_farm.controller;

import com.javaweb.yolo_farm.dto.request.UpdatePasswordRequest;
import com.javaweb.yolo_farm.dto.request.UpdateUserRequest;
import com.javaweb.yolo_farm.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    private String getUserId() {
        return SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
    }

    @GetMapping("/")
    public ResponseEntity<?> getUser() {
        try {
            return ResponseEntity.ok(userService.getUser(getUserId()));
        } catch (Exception e) {
            return ResponseEntity.status(404).body(Map.of("error", "User not found"));
        }
    }

    @PostMapping("/")
    public ResponseEntity<?> updateUser(@RequestBody UpdateUserRequest request) {
        try {
            return ResponseEntity.ok(userService.updateUser(getUserId(), request));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/updatePassword")
    public ResponseEntity<?> updatePassword(@RequestBody UpdatePasswordRequest request) {
        try {
            return ResponseEntity.ok(userService.updatePassword(getUserId(), request));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }
}