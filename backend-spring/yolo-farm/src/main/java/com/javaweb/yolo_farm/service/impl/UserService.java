package com.javaweb.yolo_farm.service.impl;

import com.javaweb.yolo_farm.dto.request.UpdatePasswordRequest;
import com.javaweb.yolo_farm.dto.request.UpdateUserRequest;
import com.javaweb.yolo_farm.model.User;
import com.javaweb.yolo_farm.repository.UserRepository;
import com.javaweb.yolo_farm.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class UserService implements IUserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public User getUser(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public Map<String, String> updateUser(String userId, UpdateUserRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setAddress(request.getAddress());
        user.setPhoneno(request.getPhoneno());
        userRepository.save(user);
        Map<String, String> response = new HashMap<>();
        response.put("name", user.getName());
        response.put("email", user.getEmail());
        response.put("address", user.getAddress());
        response.put("phoneno", user.getPhoneno());
        return response;
    }

    public Map<String, String> updatePassword(String userId, UpdatePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getCurPassword(), user.getPassword())) {
            throw new RuntimeException("Incorrect current password");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        return Map.of("message", "User info update successfully");
    }
}