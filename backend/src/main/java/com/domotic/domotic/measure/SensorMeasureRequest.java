package com.domotic.domotic.measure;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.Instant;

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

    @JsonAlias({"timestamp"})
    private Instant measuredAt;
}
