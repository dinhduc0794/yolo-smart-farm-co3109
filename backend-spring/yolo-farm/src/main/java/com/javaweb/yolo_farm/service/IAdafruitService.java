package com.javaweb.yolo_farm.service;

public interface IAdafruitService {
    boolean controlDevice(String feedName, boolean value);
    double fetchData(String feedName);
}
