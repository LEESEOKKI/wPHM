package com.ssafy.wonik.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@Data
@NoArgsConstructor
public class GraphDataDto {
    private LocalDateTime date;
    private Double value;
}
