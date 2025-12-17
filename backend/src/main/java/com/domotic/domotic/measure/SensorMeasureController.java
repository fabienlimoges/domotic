package com.domotic.domotic.measure;

import com.domotic.domotic.sensor.SensorLocation;
import com.domotic.domotic.sensor.SensorLocationRepository;
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

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/sensor/measure")
public class SensorMeasureController {

    private final SensorMeasureRepository repository;
    private final SensorLocationRepository locationRepository;

    public SensorMeasureController(SensorMeasureRepository repository, SensorLocationRepository locationRepository) {
        this.repository = repository;
        this.locationRepository = locationRepository;
    }

    @GetMapping("/last")
    public List<SensorMeasure> findLastMeasures() {
        List<SensorMeasure> measures = repository.findLatestMeasuresPerSensor();

        measures.forEach(this::applyLocation);
        return measures;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SensorMeasure create(@Validated @RequestBody SensorMeasureRequest request) {
        Instant measuredAt = request.getMeasuredAt() != null ? request.getMeasuredAt() : Instant.now();

        SensorMeasure measure = SensorMeasure.builder()
                .sensorName(request.getSensorName())
                .temperature(request.getTemperature())
                .humidity(request.getHumidity())
                .pression(request.getPression())
                .altitude(request.getAltitude())
                .measuredAt(measuredAt)
                .build();

        return repository.save(measure);
    }

    @GetMapping("/history/{sensorName}")
    public List<SensorMeasure> findHistory(
            @PathVariable(name = "sensorName") String location,
            @RequestParam(name = "hours", defaultValue = "24") int hours
    ) {
        int validatedHours = Math.max(hours, 1);
        String resolvedSensorName = locationRepository.findByLocation(location)
                .map(SensorLocation::getSensorName)
                .orElse(location);

        List<SensorMeasure> measures = repository.findMeasuresWithinLastHoursForSensor(validatedHours, resolvedSensorName);
        measures.forEach(this::applyLocation);
        return measures;
    }

    private void applyLocation(SensorMeasure measure) {
        Optional<SensorLocation> location = locationRepository.findBySensorName(measure.getSensorName());
        location.ifPresent(sensorLocation -> measure.setLocation(sensorLocation.getLocation()));
    }
}
