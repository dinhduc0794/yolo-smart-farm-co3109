package com.javaweb.yolo_farm.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "factor")
@Getter
@Setter
public class Factor {
    @Id
    private String id;

    private String userID;
    private String name;
    private String curmode = "Manual";
    private double lowbound;
    private double upbound;
}