package com.javaweb.yolo_farm.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;
import java.util.List;

@Document(collection = "user")
@Getter
@Setter
public class User {
    @Id
    private String id;

    private String name;
    private String email;
    private String password;
    private String resetToken;
    private Date expireToken;
    private String pic = "https://hcmut.edu.vn/img/nhanDienThuongHieu/01_logobachkhoasang.png";
    private List<String> addCart;
    private String address;
    private String phoneno;
}