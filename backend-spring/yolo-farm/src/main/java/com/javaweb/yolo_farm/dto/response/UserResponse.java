package com.javaweb.yolo_farm.dto.response;

import lombok.Data;

import java.util.List;

@Data
public class UserResponse {
    private String id;
    private String name;
    private String email;
    private List<String> followers;
    private List<String> following;
    private String pic;
    private String phoneno;
}