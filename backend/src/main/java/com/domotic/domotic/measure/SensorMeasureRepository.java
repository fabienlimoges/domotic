package com.domotic.domotic.measure;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SensorMeasureRepository extends JpaRepository<SensorMeasure, Long> {

    @Query(value = "SELECT sm.* FROM sensor_measure sm " +
            "JOIN (SELECT sensor_name, MAX(id) AS max_id FROM sensor_measure GROUP BY sensor_name) latest " +
            "ON sm.id = latest.max_id", nativeQuery = true)
    List<SensorMeasure> findLatestMeasuresPerSensor();

    @Query(value = "SELECT sm.* FROM sensor_measure sm " +
            "WHERE sm.measured_at >= NOW() - (:hours * INTERVAL '1 hour') " +
            "AND (:sensorName IS NULL OR sm.sensor_name = :sensorName) " +
            "ORDER BY sm.measured_at ASC", nativeQuery = true)
    List<SensorMeasure> findMeasuresWithinLastHours(@Param("hours") int hours, @Param("sensorName") String sensorName);
}
