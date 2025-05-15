package com.javaweb.yolo_farm.controller;

import com.javaweb.yolo_farm.dto.request.SignInRequest;
import com.javaweb.yolo_farm.dto.request.SignUpRequest;
import com.javaweb.yolo_farm.service.IAuthService;
import com.javaweb.yolo_farm.service.IDataService;
import com.javaweb.yolo_farm.service.impl.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private IAuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@RequestBody SignUpRequest request) {
        return ResponseEntity.status(200).body(authService.signUp(request));
    }

    @PostMapping("/signin")
    public ResponseEntity<?> signIn(@RequestBody SignInRequest request) {
        Map<String, Object> a = authService.signIn(request);
        if(a.entrySet().iterator().next().getKey() == "error"){
            return ResponseEntity.status(400).body(a.entrySet().iterator().next().getValue());
        }
        return ResponseEntity.ok(authService.signIn(request));
    }
}