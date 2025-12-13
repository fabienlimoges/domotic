package com.domotic.domotic.measure;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/sensor/measure")
public class SensorMeasureController {

    private final SensorMeasureRepository repository;

    public SensorMeasureController(SensorMeasureRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/last")
    public List<SensorMeasure> findLastMeasures() {
        return repository.findLatestMeasuresPerSensor();
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
        measure.setTimestamp(request.getTimestamp());
        return repository.save(measure);
    }
}
