package com.javaweb.yolo_farm.service;

import com.javaweb.yolo_farm.dto.LogResponse;
import com.javaweb.yolo_farm.dto.NotificationResponse;
import com.javaweb.yolo_farm.model.ActivityLog;
import com.javaweb.yolo_farm.model.Notification;
import com.javaweb.yolo_farm.repository.ActivityLogRepository;
import com.javaweb.yolo_farm.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LogService {

    @Autowired
    private ActivityLogRepository activityLogRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    public List<LogResponse> getLogs(String userId) {
        Date dat = new Date();
        dat.setDate(dat.getDate() - 30);

        List<ActivityLog> logs = activityLogRepository.findAll()
                .stream()
                .filter(log -> log.getUserID().equals(userId) && log.getDtime().after(dat))
                .sorted((l1, l2) -> l2.getDtime().compareTo(l1.getDtime()))
                .limit(20)
                .collect(Collectors.toList());

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        return logs.stream().map(log -> {
            LogResponse response = new LogResponse();
            response.setContent(log.getContent());
            response.setDtime(sdf.format(log.getDtime()));
            return response;
        }).collect(Collectors.toList());
    }

    public List<NotificationResponse> getNotifications(String userId) {
        Date dat = new Date();
        dat.setDate(dat.getDate() - 30);

        List<Notification> notifications = notificationRepository.findByUserID(userId)
                .stream()
                .filter(noti -> noti.getDtime().after(dat))
                .sorted((n1, n2) -> n2.getDtime().compareTo(n1.getDtime()))
                .limit(20)
                .collect(Collectors.toList());

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        return notifications.stream().map(noti -> {
            NotificationResponse response = new NotificationResponse();
            response.setTitle(noti.getTitle());
            response.setContent(noti.getContent());
            response.setDtime(sdf.format(noti.getDtime()));
            response.setNewFlag(noti.isNewFlag());
            response.setDevice(noti.getDevice());
            return response;
        }).collect(Collectors.toList());
    }

    public String updateNotifications(String userId) {
        List<Notification> notifications = notificationRepository.findByUserID(userId)
                .stream()
                .filter(Notification::isNewFlag)
                .collect(Collectors.toList());
        notifications.forEach(noti -> noti.setNewFlag(false));
        notificationRepository.saveAll(notifications);
        return "Notifications updated successfully";
    }
}