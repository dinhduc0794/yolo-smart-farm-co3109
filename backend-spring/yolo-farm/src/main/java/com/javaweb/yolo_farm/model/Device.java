package com.javaweb.yolo_farm.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "device")
@Getter
@Setter
public class Device {
    @Id
    private String id;

    private String userID;
    private String name;
    private boolean state = false;

}