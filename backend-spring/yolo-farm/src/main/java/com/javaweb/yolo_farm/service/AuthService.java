package com.javaweb.yolo_farm.service;

import com.javaweb.yolo_farm.dto.request.SignInRequest;
import com.javaweb.yolo_farm.dto.request.SignUpRequest;
import com.javaweb.yolo_farm.model.User;
import com.javaweb.yolo_farm.repository.UserRepository;
import com.javaweb.yolo_farm.config.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public Map<String, String> signUp(SignUpRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return Map.of("error", "User already exists with that email");
        }
        if (request.getEmail() == null || request.getPassword() == null || request.getName() == null ||
                request.getAddress() == null || request.getPhoneno() == null) {
            return Map.of("error", "Please add all the Credential");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setAddress(request.getAddress());
        user.setPhoneno(request.getPhoneno());
        userRepository.save(user);
        return Map.of("message", "saved successfully");
    }

    public Map<String, Object> signIn(SignInRequest request) {
        if (request.getEmail() == null || request.getPassword() == null) {
            return Map.of("error", "please add email or password");
        }
        User user = userRepository.findByEmail(request.getEmail())
                .orElse(null);
        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return Map.of("error", "Invalid Email or password");
        }

        String token = jwtUtil.generateToken(user.getId());
        Map<String, Object> userMap = new HashMap<>();
        userMap.put("id", user.getId());
        userMap.put("name", user.getName());
        userMap.put("email", user.getEmail());
        userMap.put("phoneno", user.getPhoneno());
        userMap.put("address", user.getAddress());
        userMap.put("pic", user.getPic());
        return Map.of("token", token, "user", userMap);
    }
}