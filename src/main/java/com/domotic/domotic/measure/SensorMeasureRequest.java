package com.domotic.domotic.measure;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.OffsetDateTime;

public class SensorMeasureRequest {

    @NotBlank
    private String sensorName;

    @NotNull
    private Double temperature;

    @NotNull
    private Double pression;

    @NotNull
    private Double altitude;

    private Double humidity;

    private OffsetDateTime measureTime;

    public String getSensorName() {
        return sensorName;
    }

    public void setSensorName(String sensorName) {
        this.sensorName = sensorName;
    }

    public Double getTemperature() {
        return temperature;
    }

    public void setTemperature(Double temperature) {
        this.temperature = temperature;
    }

    public Double getPression() {
        return pression;
    }

    public void setPression(Double pression) {
        this.pression = pression;
    }

    public Double getAltitude() {
        return altitude;
    }

    public void setAltitude(Double altitude) {
        this.altitude = altitude;
    }

    public Double getHumidity() {
        return humidity;
    }

    public void setHumidity(Double humidity) {
        this.humidity = humidity;
    }

    public OffsetDateTime getMeasureTime() {
        return measureTime;
    }

    public void setMeasureTime(OffsetDateTime measureTime) {
        this.measureTime = measureTime;
    }
}
