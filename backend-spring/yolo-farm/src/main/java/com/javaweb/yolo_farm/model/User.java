package com.javaweb.yolo_farm.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;
import java.util.List;

@Document(collection = "user")
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

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getResetToken() {
        return resetToken;
    }

    public void setResetToken(String resetToken) {
        this.resetToken = resetToken;
    }

    public Date getExpireToken() {
        return expireToken;
    }

    public void setExpireToken(Date expireToken) {
        this.expireToken = expireToken;
    }

    public String getPic() {
        return pic;
    }

    public void setPic(String pic) {
        this.pic = pic;
    }

    public List<String> getAddCart() {
        return addCart;
    }

    public void setAddCart(List<String> addCart) {
        this.addCart = addCart;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhoneno() {
        return phoneno;
    }

    public void setPhoneno(String phoneno) {
        this.phoneno = phoneno;
    }
}