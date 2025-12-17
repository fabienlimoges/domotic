package com.domotic.domotic.measure;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SensorMeasureRepository extends JpaRepository<SensorMeasure, Long> {

    @Query(value = """
                SELECT DISTINCT ON (sensor_name) sm.*
                FROM sensor_measure sm
                ORDER BY sm.sensor_name, sm.measured_at DESC
            """, nativeQuery = true)
    List<SensorMeasure> findLatestMeasuresPerSensor();


    @Query(value = "SELECT sm.* FROM sensor_measure sm " +
            "WHERE sm.sensor_name = :sensorName " +
            "AND sm.measured_at >= NOW() - (:hours * INTERVAL '1 hour') " +
            "ORDER BY sm.measured_at ASC", nativeQuery = true)
    List<SensorMeasure> findMeasuresWithinLastHoursForSensor(@Param("hours") int hours, @Param("sensorName") String sensorName);
}
