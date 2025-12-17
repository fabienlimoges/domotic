package com.domotic.domotic.sensor;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SensorLocationRequest {

    @NotBlank
    private String sensorName;

    @NotBlank
    private String location;
}
