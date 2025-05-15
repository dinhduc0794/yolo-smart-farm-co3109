package com.javaweb.yolo_farm.service;

import com.javaweb.yolo_farm.dto.request.SignInRequest;
import com.javaweb.yolo_farm.dto.request.SignUpRequest;

import java.util.Map;

public interface IAuthService {
    Map<String, String> signUp(SignUpRequest request);
    Map<String, Object> signIn(SignInRequest request);
}
