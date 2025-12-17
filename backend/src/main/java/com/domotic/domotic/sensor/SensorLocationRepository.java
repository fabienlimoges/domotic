package com.domotic.domotic.sensor;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SensorLocationRepository extends JpaRepository<SensorLocation, Long> {

    Optional<SensorLocation> findBySensorName(String sensorName);

    Optional<SensorLocation> findByLocation(String location);
}
