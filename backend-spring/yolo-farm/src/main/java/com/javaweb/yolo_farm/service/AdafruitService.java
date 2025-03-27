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

    private final String[] FEED_NAMES = {"handmade", "light", "pump", "awning", "fan"};
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public AdafruitService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    public String controlDevice(String feedName, String value) {
        System.out.println("Turn " + feedName + " : " + value);

        String url = String.format("https://io.adafruit.com/api/v2/%s/feeds/%s/data", AIO_USERNAME, feedName);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("X-AIO-Key", AIO_KEY);

        String requestBody = String.format("{\"value\": \"%s\"}", value);
        HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

        String response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class).getBody();

        try {
            JsonNode jsonNode = objectMapper.readTree(response);
            return jsonNode.get("value").asText();
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse response from Adafruit API", e);
        }
    }

    public String fetchData(String feedName) {
        // System.out.println("Fetch data from : " + feedName); // Comment giống code gốc

        String url = String.format("https://io.adafruit.com/api/v2/%s/feeds/%s/data/last", AIO_USERNAME, feedName);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("X-AIO-Key", AIO_KEY);

        HttpEntity<String> entity = new HttpEntity<>(headers);
        String response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class).getBody();

        try {
            JsonNode jsonNode = objectMapper.readTree(response);
            return jsonNode.get("value").asText();
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse response from Adafruit API", e);
        }
    }
}