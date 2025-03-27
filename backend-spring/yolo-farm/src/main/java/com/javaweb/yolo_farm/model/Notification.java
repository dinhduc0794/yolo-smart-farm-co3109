package com.javaweb.yolo_farm.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Document(collection = "notification")
@Getter
@Setter
public class Notification {
    @Id
    private String id;

    private String userID;
    private String title;
    private String content;
    private Date dtime = new Date();
    private boolean newFlag = true;
    private String device;

}