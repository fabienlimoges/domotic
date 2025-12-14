package com.domotic.domotic.measure;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "sensor_measure")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SensorMeasure {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sensor_name", nullable = false)
    private String sensorName;

    @Column(nullable = false)
    private double temperature;

    @Column(nullable = false)
    private double pression;

    @Column(nullable = true)
    private Double altitude;

    private Double humidity;

    private String timestamp;
}
