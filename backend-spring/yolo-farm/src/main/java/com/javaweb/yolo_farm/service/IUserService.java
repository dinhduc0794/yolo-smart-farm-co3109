package com.javaweb.yolo_farm.service;

import com.javaweb.yolo_farm.dto.request.UpdatePasswordRequest;
import com.javaweb.yolo_farm.dto.request.UpdateUserRequest;
import com.javaweb.yolo_farm.model.User;

import java.util.Map;

public interface IUserService {
    User getUser(String userId);
    Map<String, String> updateUser(String userId, UpdateUserRequest request);
    Map<String, String> updatePassword(String userId, UpdatePasswordRequest request);
}
