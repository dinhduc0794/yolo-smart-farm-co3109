package com.javaweb.yolo_farm.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Document(collection = "stat")
@Getter
@Setter
public class Stat {
    @Id
    private String id;

    private Date dtime = new Date();
    private String factorID;
    private double value;
    private String unit;
}