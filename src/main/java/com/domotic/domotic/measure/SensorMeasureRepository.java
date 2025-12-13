package com.domotic.domotic.measure;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.OffsetDateTime;
import java.util.List;

public interface SensorMeasureRepository extends JpaRepository<SensorMeasure, Long> {

    @Query("SELECT sm FROM SensorMeasure sm WHERE sm.measureTime = (SELECT MAX(m.measureTime) FROM SensorMeasure m WHERE m.sensorName = sm.sensorName)")
    List<SensorMeasure> findLatestBySensor();

    List<SensorMeasure> findBySensorNameAndMeasureTimeAfterOrderByMeasureTimeDesc(String sensorName, OffsetDateTime measureTime);

    @Query("SELECT DISTINCT sm.sensorName FROM SensorMeasure sm ORDER BY sm.sensorName ASC")
    List<String> findDistinctSensorNames();
}
