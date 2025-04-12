package com.javaweb.yolo_farm.config;

import com.javaweb.yolo_farm.model.Factor;
import com.javaweb.yolo_farm.repository.FactorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Arrays;
import java.util.Map;

@Component
public class FactorFilter extends OncePerRequestFilter {

    @Autowired
    private FactorRepository factorRepository;

    private static final String[] FACTOR_PATHS = {"/humid/", "/temp/", "/soil/", "/light/"};

    private static final Map<String, String> PATH_TO_FACTOR = Map.of(
            "/humid/", "Humidity",
            "/temp/", "Temperature",
            "/soil/", "Moisture",
            "/light/", "Light"
    );

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String path = request.getServletPath();
        String factorName = PATH_TO_FACTOR.entrySet().stream()
                .filter(entry -> path.contains(entry.getKey()))
                .map(Map.Entry::getValue)
                .findFirst()
                .orElse(null);

        if (factorName != null) {
            String userId = getUserId();
            if (userId != null) {
                try {
                    Factor factor = factorRepository.findByUserIDAndName(userId, factorName)
                            .orElseGet(() -> {
                                Factor newFactor = new Factor();
                                newFactor.setUserID(userId);
                                newFactor.setName(factorName);
                                newFactor.setCurmode("Manual");
                                newFactor.setLowbound(0);
                                newFactor.setUpbound(100);
                                return factorRepository.save(newFactor);
                            });
                    request.setAttribute("factor", factor);
                } catch (Exception e) {
                    response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                    response.getWriter().write("{\"error\": \"Internal Server Error\"}");
                    return;
                }
            } else {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("{\"error\": \"Unauthorized\"}");
                return;
            }
        }
        chain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getServletPath();
        return Arrays.stream(FACTOR_PATHS).noneMatch(path::contains);
    }

    private String getUserId() {
        try {
            return SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
        } catch (Exception e) {
            return null;
        }
    }
}