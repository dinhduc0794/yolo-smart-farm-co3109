package com.javaweb.yolo_farm.service;

import com.javaweb.yolo_farm.dto.request.SignInRequest;
import com.javaweb.yolo_farm.dto.request.SignUpRequest;
import com.javaweb.yolo_farm.dto.request.SignUpRequest;
import com.javaweb.yolo_farm.dto.response.UserResponse;
import com.javaweb.yolo_farm.model.User;
import com.javaweb.yolo_farm.repository.UserRepository;
import com.javaweb.yolo_farm.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public String signUp(SignUpRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("User already exists with that email");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setAddress(request.getAddress());
        user.setPhoneno(request.getPhoneno());

        userRepository.save(user);
        return "saved successfully";
    }

    public UserResponse signIn(SignInRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid Email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid Email or password");
        }

        String token = jwtUtil.generateToken(user.getId());
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setFollowers(user.getAddCart()); // followers không có trong model, dùng addCart thay thế
        response.setFollowing(user.getAddCart()); // following không có trong model, dùng addCart thay thế
        response.setPic(user.getPic());
        response.setPhoneno(user.getPhoneno());

        response.setId(token); // Lưu token vào id để trả về
        return response;
    }
}