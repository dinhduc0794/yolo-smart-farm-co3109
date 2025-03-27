package com.javaweb.yolo_farm.dto.request;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class SignUpRequest {
    private String name;
    private String email;
    private String password;
    private String address;
    private String phoneno;
}