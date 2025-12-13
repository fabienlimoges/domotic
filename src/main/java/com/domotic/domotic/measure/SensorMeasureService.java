package com.domotic.domotic.measure;

import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.Comparator;
import java.util.List;

@Service
public class SensorMeasureService {

    private final SensorMeasureRepository repository;

    public SensorMeasureService(SensorMeasureRepository repository) {
        this.repository = repository;
    }

    public List<SensorMeasureResponse> findLatestPerSensor() {
        return repository.findLatestBySensor().stream()
                .sorted(Comparator.comparing(SensorMeasure::getSensorName))
                .map(this::toResponse)
                .toList();
    }

    public List<SensorMeasureResponse> findHistoryForSensor(String sensorName, int lastHours) {
        OffsetDateTime since = OffsetDateTime.now().minusHours(lastHours);
        return repository.findBySensorNameAndMeasureTimeAfterOrderByMeasureTimeDesc(sensorName, since)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<String> findSensorNames() {
        return repository.findDistinctSensorNames();
    }

    private SensorMeasureResponse toResponse(SensorMeasure measure) {
        return new SensorMeasureResponse(
                measure.getId(),
                measure.getSensorName(),
                measure.getTemperature(),
                measure.getPression(),
                measure.getAltitude(),
                measure.getHumidity(),
                measure.getMeasureTime()
        );
    }
}
