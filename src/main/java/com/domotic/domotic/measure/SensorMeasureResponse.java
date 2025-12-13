package com.domotic.domotic.measure;

import java.time.OffsetDateTime;

public class SensorMeasureResponse {

    private Long id;
    private String sensorName;
    private double temperature;
    private double pression;
    private double altitude;
    private Double humidity;
    private OffsetDateTime measureTime;

    public SensorMeasureResponse(Long id, String sensorName, double temperature, double pression, double altitude, Double humidity, OffsetDateTime measureTime) {
        this.id = id;
        this.sensorName = sensorName;
        this.temperature = temperature;
        this.pression = pression;
        this.altitude = altitude;
        this.humidity = humidity;
        this.measureTime = measureTime;
    }

    public Long getId() {
        return id;
    }

    public String getSensorName() {
        return sensorName;
    }

    public double getTemperature() {
        return temperature;
    }

    public double getPression() {
        return pression;
    }

    public double getAltitude() {
        return altitude;
    }

    public Double getHumidity() {
        return humidity;
    }

    public OffsetDateTime getMeasureTime() {
        return measureTime;
    }
}
