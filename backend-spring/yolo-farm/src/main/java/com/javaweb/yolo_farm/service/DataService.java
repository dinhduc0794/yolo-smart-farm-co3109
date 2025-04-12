package com.javaweb.yolo_farm.service;

import com.javaweb.yolo_farm.dto.request.ModeRequest;
import com.javaweb.yolo_farm.dto.request.ThresholdRequest;
import com.javaweb.yolo_farm.model.Device;
import com.javaweb.yolo_farm.model.Factor;
import com.javaweb.yolo_farm.model.Notification;
import com.javaweb.yolo_farm.model.Stat;
import com.javaweb.yolo_farm.repository.DeviceRepository;
import com.javaweb.yolo_farm.repository.FactorRepository;
import com.javaweb.yolo_farm.repository.NotificationRepository;
import com.javaweb.yolo_farm.repository.StatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class DataService {

    @Autowired
    private FactorRepository factorRepository;

    @Autowired
    private DeviceRepository deviceRepository;

    @Autowired
    private StatRepository statRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private AdafruitService adafruitService;

    @Autowired
    private ActivityLogService activityLogService;

    private static final Map<String, String> FACTOR_FEED_MAP = Map.of(
            "Humidity", "humidity-sensor",
            "Temperature", "temperature-sensor",
            "Moisture", "soil-moisture-sensor",
            "Light", "light-sensor"
    );

    private static final Map<String, String> FACTOR_DEVICE_MAP = Map.of(
            "Moisture", "pump",
            "Temperature", "fan",
            "Light", "light",
            "Humidity", "fan" // Thêm ánh xạ cho Humidity
    );

    private static final Map<String, String> FACTOR_UNIT_MAP = Map.of(
            "Humidity", "%",
            "Temperature", "°C",
            "Moisture", "%",
            "Light", "lux"
    );

    public Map<String, Object> getMode(String userId, String factorName) {
        Factor factor = factorRepository.findByUserIDAndName(userId, factorName)
                .orElseGet(() -> createFactor(userId, factorName));
        String deviceName = FACTOR_DEVICE_MAP.get(factorName);
        boolean deviceState = false;
        if (deviceName != null) {
            deviceState = deviceRepository.findByUserIDAndName(userId, deviceName)
                    .map(Device::isState)
                    .orElse(false);
        }
        return Map.of(
                "mode", factor.getCurmode(),
                "state", deviceState
        );
    }

    public Map<String, Object> putMode(String userId, String factorName) {
        String deviceName = FACTOR_DEVICE_MAP.get(factorName);
        if (deviceName == null) {
            return Map.of("error", "Device not found");
        }
        Device device = deviceRepository.findByUserIDAndName(userId, deviceName)
                .orElseGet(() -> {
                    Device newDevice = new Device();
                    newDevice.setUserID(userId);
                    newDevice.setName(deviceName);
                    newDevice.setState(false);
                    return deviceRepository.save(newDevice);
                });
        Factor factor = factorRepository.findByUserIDAndName(userId, factorName)
                .orElseGet(() -> createFactor(userId, factorName));
        return Map.of(
                "mode", factor.getCurmode(),
                "state", device.isState()
        );
    }

    public Map<String, String> postMode(String userId, ModeRequest request, String factorName) {
        String mode = request.getMode();
        if (!List.of("Auto", "Manual").contains(mode)) {
            return Map.of("error", "Invalid mode");
        }
        String deviceName = FACTOR_DEVICE_MAP.get(factorName);
        if (deviceName == null) {
            return Map.of("error", "No device associated with this factor");
        }
        Factor factor = factorRepository.findByUserIDAndName(userId, factorName)
                .orElseGet(() -> createFactor(userId, factorName));
        if (mode.equals(factor.getCurmode())) {
            if ("Manual".equals(mode)) {
                boolean state = request.isState();
                return toggleDevice(userId, deviceName, state ? 1 : 0, "user")
                        ? Map.of("message", "Changed manual to manual with " + (state ? "on" : "off"))
                        : Map.of("message", "The same setting");
            }
            return Map.of("message", "The same settings");
        }
        factor.setCurmode(mode);
        factorRepository.save(factor);
        if ("Manual".equals(mode)) {
            boolean state = request.isState();
            return toggleDevice(userId, deviceName, state ? 1 : 0, "user")
                    ? Map.of("message", "Changed auto to manual with " + (state ? "on" : "off"))
                    : Map.of("message", "Changed auto to manual");
        }
        return Map.of("message", "Changed manual to auto");
    }

    public Map<String, Object> getCurrent(String userId, String factorName) {
        Factor factor = factorRepository.findByUserIDAndName(userId, factorName)
                .orElseGet(() -> createFactor(userId, factorName));

        Stat stat = statRepository.findTopByFactorIDOrderByDtimeDesc(factor.getId())
                .orElseThrow(() -> new NoSuchElementException("No stats found for factor: " + factorName));

        return Map.of("value", stat.getValue());
    }


    public Map<String, Object> refresh(String userId, String factorName) {
        Factor factor = factorRepository.findByUserIDAndName(userId, factorName)
                .orElseGet(() -> createFactor(userId, factorName));
        double value = refreshDevice(factor);
        return Map.of("value", value);
    }

    public Map<String, Double> getThreshold(String userId, String factorName) {
        Factor factor = factorRepository.findByUserIDAndName(userId, factorName)
                .orElseGet(() -> createFactor(userId, factorName));
        return Map.of(
                "lowerbound", factor.getLowbound(),
                "upperbound", factor.getUpbound()
        );
    }

    public Map<String, String> postThreshold(String userId, String factorName, ThresholdRequest request) {
        double upperbound = request.getUpperbound();
        double lowerbound = request.getLowerbound();
        if (Double.isNaN(upperbound) || Double.isNaN(lowerbound) || upperbound <= lowerbound) {
            return Map.of("error", "Invalid threshold parameters");
        }
        Factor factor = factorRepository.findByUserIDAndName(userId, factorName)
                .orElseGet(() -> createFactor(userId, factorName));
        factor.setLowbound(lowerbound);
        factor.setUpbound(upperbound);
        factorRepository.save(factor);
        activityLogService.createLog(userId, "Updated threshold for " + factorName + ": [" + lowerbound + ", " + upperbound + "]");
        return Map.of("message", "Threshold updated");
    }

    public Map<String, String> toggleMode(String userId, ModeRequest request) {
        String deviceName = request.getReqdevice();
        if (!List.of("fan", "awning", "pump", "light").contains(deviceName)) {
            return Map.of("error", "Invalid device");
        }
        boolean state = request.isState();
        return toggleDevice(userId, deviceName, state ? 1 : 0, "user")
                ? Map.of("message", "Device " + deviceName + " turned " + (state ? "on" : "off"))
                : Map.of("message", "Device state unchanged");
    }

    public Map<String, Boolean> getDeviceModes(String userId) {
        List<Device> devices = deviceRepository.findByUserID(userId).stream().toList();
        Map<String, Boolean> response = new HashMap<>();
        List.of("fan", "pump", "light", "awning").forEach(deviceName ->
                response.put(deviceName, devices.stream()
                        .filter(d -> d.getName().equals(deviceName))
                        .findFirst()
                        .map(Device::isState)
                        .orElse(false)));
        return response;
    }

    private Factor createFactor(String userId, String factorName) {
        Factor factor = new Factor();
        factor.setUserID(userId);
        factor.setName(factorName);
        factor.setCurmode("Manual");
        factor.setLowbound(0);
        factor.setUpbound(100);
        return factorRepository.save(factor);
    }

    private boolean toggleDevice(String userId, String deviceName, int status, String by) {
        Device device = deviceRepository.findByUserIDAndName(userId, deviceName)
                .orElseGet(() -> {
                    Device newDevice = new Device();
                    newDevice.setUserID(userId);
                    newDevice.setName(deviceName);
                    newDevice.setState(false);
                    return deviceRepository.save(newDevice);
                });
        boolean newState = status == 1;
        if (device.isState() == newState) {
            return false;
        }
        device.setState(newState);
        deviceRepository.save(device);
        adafruitService.controlDevice(deviceName, newState);
        String content = String.format("%s turned %s the %s", by, newState ? "on" : "off", deviceName);
        activityLogService.createLog(userId, content);
        return true;
    }

    private void createNewNotification(String userId, String title, String content, String device) {
        Notification noti = new Notification();
        noti.setUserID(userId);
        noti.setTitle(title);
        noti.setContent(content);
        noti.setDevice(device);
        noti.setNewFlag(true);
        noti.setDtime(new Date());
        notificationRepository.save(noti);
    }

    private double refreshDevice(Factor factor) {
        String feedName = FACTOR_FEED_MAP.get(factor.getName());
        if (feedName == null) {
            throw new IllegalArgumentException("Invalid factor: " + factor.getName());
        }
        double value = adafruitService.fetchData(feedName);
        String unit = FACTOR_UNIT_MAP.getOrDefault(factor.getName(), "unknown");
        Stat stat = new Stat();
        stat.setFactorID(factor.getId());
        stat.setValue(value);
        stat.setUnit(unit);
        stat.setDtime(new Date());
        statRepository.save(stat);

        String deviceName = FACTOR_DEVICE_MAP.get(factor.getName());
        boolean isAuto = "Auto".equals(factor.getCurmode());
        if (value >= factor.getUpbound()) {
            String content = String.format("%s is too high at %.1f%s", factor.getName(), value, unit);
            createNewNotification(factor.getUserID(), factor.getName() + " High", content, deviceName);
            if (isAuto && deviceName != null) {
                if ("Moisture".equals(factor.getName())) {
                    toggleDevice(factor.getUserID(), "pump", 0, "automatic mode");
                } else if ("Temperature".equals(factor.getName())) {
                    toggleDevice(factor.getUserID(), "fan", 1, "automatic mode");
                } else if ("Light".equals(factor.getName())) {
                    toggleDevice(factor.getUserID(), "awning", 1, "automatic mode");
                }
            }
        } else if (value <= factor.getLowbound()) {
            String content = String.format("%s is too low at %.1f%s", factor.getName(), value, unit);
            createNewNotification(factor.getUserID(), factor.getName() + " Low", content, deviceName);
            if (isAuto && deviceName != null) {
                if ("Moisture".equals(factor.getName())) {
                    toggleDevice(factor.getUserID(), "pump", 1, "automatic mode");
                } else if ("Temperature".equals(factor.getName())) {
                    toggleDevice(factor.getUserID(), "fan", 0, "automatic mode");
                } else if ("Light".equals(factor.getName())) {
                    toggleDevice(factor.getUserID(), "light", 1, "automatic mode");
                }
            }
        }
        return value;
    }

    @Scheduled(fixedRate = 60000) // Tăng lên 60 giây để giảm tải
    public void refreshAllFactors() {
        // Nhóm factor theo userId để tối ưu
        Map<String, List<Factor>> factorsByUser = factorRepository.findAll()
                .stream()
                .collect(Collectors.groupingBy(Factor::getUserID));
        factorsByUser.values().forEach(factors ->
                factors.forEach(this::refreshDevice));
    }
}