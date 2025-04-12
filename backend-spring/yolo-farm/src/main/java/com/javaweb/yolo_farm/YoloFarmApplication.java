package com.javaweb.yolo_farm;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class YoloFarmApplication {
	public static void main(String[] args) {
		SpringApplication.run(YoloFarmApplication.class, args);
	}
}