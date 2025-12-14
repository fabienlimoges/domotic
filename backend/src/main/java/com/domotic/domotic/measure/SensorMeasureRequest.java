package com.domotic.domotic.measure;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
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
}
