package com.domotic.domotic.measure;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
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

import java.time.Instant;

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

    @Column(name = "measured_at", nullable = false)
    @JsonProperty("measuredAt")
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private Instant measuredAt;
}
