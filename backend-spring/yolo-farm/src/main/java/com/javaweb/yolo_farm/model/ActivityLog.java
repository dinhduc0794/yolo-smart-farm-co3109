package com.javaweb.yolo_farm.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Document(collection = "activity_log")
@Getter
@Setter
public class ActivityLog {
    @Id
    private String id;

    private String userID;
    private String content;
    private Date dtime = new Date();
}