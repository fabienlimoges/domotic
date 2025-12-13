package com.domotic.domotic.measure;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class SensorMeasureRequest {

    @NotBlank
    private String sensorName;

    @NotNull
    private Double temperature;

    @NotNull
    private Double pression;

    private Double altitude;

    private Double humidity;

    private String timestamp;

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

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }
}
