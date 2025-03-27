package com.javaweb.yolo_farm.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "factor")
public class Factor {
    @Id
    private String id;

    private String userID;
    private String name;
    private String curmode = "Manual";
    private double lowbound;
    private double upbound;

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserID() {
        return userID;
    }

    public void setUserID(String userID) {
        this.userID = userID;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCurmode() {
        return curmode;
    }

    public void setCurmode(String curmode) {
        this.curmode = curmode;
    }

    public double getLowbound() {
        return lowbound;
    }

    public void setLowbound(double lowbound) {
        this.lowbound = lowbound;
    }

    public double getUpbound() {
        return upbound;
    }

    public void setUpbound(double upbound) {
        this.upbound = upbound;
    }
}