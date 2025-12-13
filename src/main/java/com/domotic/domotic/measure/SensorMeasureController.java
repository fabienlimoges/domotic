package com.domotic.domotic.measure;

import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.time.OffsetDateTime;
import java.util.List;

@RestController
@RequestMapping("/sensor/measure")
public class SensorMeasureController {

    private final SensorMeasureRepository repository;
    private final SensorMeasureService service;

    public SensorMeasureController(SensorMeasureRepository repository, SensorMeasureService service) {
        this.repository = repository;
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SensorMeasure create(@Validated @RequestBody SensorMeasureRequest request) {
        SensorMeasure measure = new SensorMeasure();
        measure.setSensorName(request.getSensorName());
        measure.setTemperature(request.getTemperature());
        measure.setPression(request.getPression());
        measure.setAltitude(request.getAltitude());
        measure.setHumidity(request.getHumidity());
        measure.setMeasureTime(request.getMeasureTime() != null ? request.getMeasureTime() : OffsetDateTime.now());
        return repository.save(measure);
    }

    @GetMapping("/latest")
    public List<SensorMeasureResponse> latestPerSensor() {
        return service.findLatestPerSensor();
    }

    @GetMapping("/history/{sensorName}")
    public List<SensorMeasureResponse> history(@PathVariable String sensorName, @RequestParam(defaultValue = "24") int hours) {
        return service.findHistoryForSensor(sensorName, hours);
    }
}
