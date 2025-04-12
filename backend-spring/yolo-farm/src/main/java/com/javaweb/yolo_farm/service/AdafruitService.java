package com.javaweb.yolo_farm.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class AdafruitService {

    @Value("${aio.username}")
    private String AIO_USERNAME;

    @Value("${aio.key}")
    private String AIO_KEY;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public AdafruitService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    public boolean controlDevice(String feedName, boolean value) {
        String url = String.format("https://io.adafruit.com/api/v2/%s/feeds/%s/data", AIO_USERNAME, feedName);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("X-AIO-Key", AIO_KEY);

        String requestBody = String.format("{\"value\": \"%s\"}", value ? "1" : "0");
        HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

        try {
            String response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class).getBody();
            JsonNode jsonNode = objectMapper.readTree(response);
            return jsonNode.get("value").asText().equals("1") == value;
        } catch (Exception e) {
            throw new RuntimeException("Failed to control device on Adafruit API", e);
        }
    }

    public double fetchData(String feedName) {
        String url = String.format("https://io.adafruit.com/api/v2/%s/feeds/%s/data/last", AIO_USERNAME, feedName);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("X-AIO-Key", AIO_KEY);

        HttpEntity<String> entity = new HttpEntity<>(headers);
        try {
            String response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class).getBody();
            JsonNode jsonNode = objectMapper.readTree(response);
            return Double.parseDouble(jsonNode.get("value").asText());
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch data from Adafruit API", e);
        }
    }
}