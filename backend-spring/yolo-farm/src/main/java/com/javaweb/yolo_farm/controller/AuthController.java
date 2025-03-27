package com.javaweb.yolo_farm.controller;

import com.javaweb.yolo_farm.dto.request.SignInRequest;
import com.javaweb.yolo_farm.dto.request.SignUpRequest;
import com.javaweb.yolo_farm.dto.response.UserResponse;
import com.javaweb.yolo_farm.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<String> signUp(@RequestBody SignUpRequest request) {
        try {
            String message = authService.signUp(request);
            return ResponseEntity.ok(message);
        } catch (Exception e) {
            return ResponseEntity.status(422).body(e.getMessage());
        }
    }

    @PostMapping("/signin")
    public ResponseEntity<UserResponse> signIn(@RequestBody SignInRequest request) {
        try {
            UserResponse response = authService.signIn(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(null);
        }
    }
}