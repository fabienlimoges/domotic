package com.domotic.domotic.measure;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@AutoConfigureTestDatabase
class SensorMeasureControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private SensorMeasureRepository repository;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void shouldCreateSensorMeasure() throws Exception {
        SensorMeasureRequest request = new SensorMeasureRequest();
        request.setSensorName("SENSOR_NAME");
        request.setTemperature(21.5);
        request.setPression(1000.0);
        request.setAltitude(120.0);
        request.setHumidity(null);
        request.setTimestamp("2024-05-05T10:00:00Z");

        mockMvc.perform(post("/sensor/measure")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());

        assertThat(repository.findAll()).hasSize(1);
        SensorMeasure saved = repository.findAll().get(0);
        assertThat(saved.getSensorName()).isEqualTo("SENSOR_NAME");
        assertThat(saved.getTimestamp()).isEqualTo("2024-05-05T10:00:00Z");
    }
}
