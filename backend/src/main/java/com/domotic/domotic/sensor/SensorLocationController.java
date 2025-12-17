package com.domotic.domotic.sensor;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/sensor/location")
public class SensorLocationController {

    private final SensorLocationRepository repository;

    public SensorLocationController(SensorLocationRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<SensorLocation> findAll() {
        return repository.findAll();
    }

    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SensorLocation upsert(@Valid @RequestBody SensorLocationRequest request) {
        SensorLocation location = repository.findBySensorName(request.getSensorName())
                .map(existing -> {
                    existing.setLocation(request.getLocation());
                    return existing;
                })
                .orElseGet(() -> SensorLocation.builder()
                        .sensorName(request.getSensorName())
                        .location(request.getLocation())
                        .build());

        return repository.save(location);
    }
}
