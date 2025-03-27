package com.javaweb.yolo_farm.service;

import com.javaweb.yolo_farm.dto.request.ModeRequest;
import com.javaweb.yolo_farm.dto.request.ThresholdRequest;
import com.javaweb.yolo_farm.model.Device;
import com.javaweb.yolo_farm.model.Factor;
import com.javaweb.yolo_farm.model.Stat;
import com.javaweb.yolo_farm.repository.DeviceRepository;
import com.javaweb.yolo_farm.repository.FactorRepository;
import com.javaweb.yolo_farm.repository.StatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class DataService {

    @Autowired
    private FactorRepository factorRepository;

    @Autowired
    private DeviceRepository deviceRepository;

    @Autowired
    private StatRepository statRepository;

    @Autowired
    private AdafruitService adafruitService;

    public Map<String, Object> getMode(String userId, String factorName) {
        Factor factor = factorRepository.findByUserIDAndName(userId, factorName)
                .orElseThrow(() -> new RuntimeException("Factor not found"));
        Map<String, Object> response = new HashMap<>();
        response.put("mode", factor.getCurmode());
        response.put("devicestt", null); // devicestt không có trong model, để null
        return response;
    }

    public Map<String, Object> putMode(String userId, String reqdevice) {
        Optional<Device> deviceOpt = deviceRepository.findByUserIDAndName(userId, reqdevice);
        Device device;
        if (deviceOpt.isEmpty()) {
            device = new Device();
            device.setUserID(userId);
            device.setName(reqdevice);
            device.setState(false);
            deviceRepository.save(device);
        } else {
            device = deviceOpt.get();
        }

        Factor factor = factorRepository.findByUserIDAndName(userId, reqdevice)
                .orElseThrow(() -> new RuntimeException("Factor not found"));

        Map<String, Object> response = new HashMap<>();
        response.put("mode", factor.getCurmode());
        response.put("state", device.isState());
        return response;
    }

    public String postMode(String userId, ModeRequest request, String factorName) {
        Factor factor = factorRepository.findByUserIDAndName(userId, factorName)
                .orElseThrow(() -> new RuntimeException("Factor not found"));

        String mode = request.getMode();
        String reqdevice = request.getReqdevice();
        boolean state = request.isState();
        int status = state ? 1 : 0;

        if ("Auto".equals(mode)) {
            if ("Auto".equals(factor.getCurmode())) {
                return "The same settings";
            } else {
                factor.setCurmode(mode);
                factorRepository.save(factor);
                return "Change manual to auto";
            }
        } else if ("Manual".equals(mode)) {
            if ("Manual".equals(factor.getCurmode())) {
                if (toggleDevice(userId, reqdevice, status)) {
                    return "Change manual to manual with " + status;
                } else {
                    return "The same setting";
                }
            } else {
                factor.setCurmode(mode);
                factorRepository.save(factor);
                if (toggleDevice(userId, reqdevice, status)) {
                    return "Change auto to manual with " + status;
                } else {
                    return "The same setting";
                }
            }
        }
        return "Invalid mode";
    }

    public double getCurrent(String userId, String factorName) {
        Factor factor = factorRepository.findByUserIDAndName(userId, factorName)
                .orElseThrow(() -> new RuntimeException("Factor not found"));
        List<Stat> stats = statRepository.findByFactorID(factor.getId());
        if (stats.isEmpty()) {
            throw new RuntimeException("No stats found");
        }
        stats.sort((s1, s2) -> s2.getDtime().compareTo(s1.getDtime()));
        return stats.get(0).getValue();
    }

    public double refresh(String userId, String factorName) {
        Factor factor = factorRepository.findByUserIDAndName(userId, factorName)
                .orElseThrow(() -> new RuntimeException("Factor not found"));
        String data = adafruitService.fetchData(factor.getId());
        if (data == null) {
            throw new RuntimeException("Internal Server Error");
        }
        return Double.parseDouble(data);
    }

    public Map<String, Double> getThreshold(String userId, String factorName) {
        Factor factor = factorRepository.findByUserIDAndName(userId, factorName)
                .orElseThrow(() -> new RuntimeException("Factor not found"));
        Map<String, Double> response = new HashMap<>();
        response.put("lowerbound", factor.getLowbound());
        response.put("upperbound", factor.getUpbound());
        return response;
    }

    public String postThreshold(String userId, String factorName, ThresholdRequest request) {
        double upperbound = request.getUpperbound();
        double lowerbound = request.getLowerbound();

        if (Double.isNaN(upperbound) || Double.isNaN(lowerbound)) {
            throw new RuntimeException("Invalid parameters");
        }

        if (upperbound < lowerbound) {
            throw new RuntimeException("Upperbound must be greater than Lowerbound");
        }

        Factor factor = factorRepository.findByUserIDAndName(userId, factorName)
                .orElseThrow(() -> new RuntimeException("Factor not found"));
        factor.setLowbound(lowerbound);
        factor.setUpbound(upperbound);
        factorRepository.save(factor);
        return "Threshold updated";
    }

    public String toggleMode(String userId, ModeRequest request) {
        String reqdevice = request.getReqdevice();
        int status = request.isState() ? 1 : 0;
        toggleDevice(userId, reqdevice, status);
        return "Device successfully updated";
    }

    public Map<String, Boolean> getDeviceModes(String userId) {
        List<Device> devices = deviceRepository.findByUserID(userId).stream().toList();
        if (devices.isEmpty()) {
            throw new RuntimeException("Device not found");
        }
        Map<String, Boolean> response = new HashMap<>();
        for (Device device : devices) {
            response.put(device.getName(), device.isState());
        }
        return response;
    }

    private boolean toggleDevice(String userId, String deviceName, int status) {
        Optional<Device> deviceOpt = deviceRepository.findByUserIDAndName(userId, deviceName);
        if (deviceOpt.isEmpty()) {
            return false;
        }
        Device device = deviceOpt.get();
        boolean newState = status == 1;
        if (device.isState() == newState) {
            return false;
        }
        device.setState(newState);
        deviceRepository.save(device);
        adafruitService.controlDevice(deviceName, newState ? "ON" : "OFF");
        return true;
    }
}