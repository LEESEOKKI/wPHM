package com.ssafy.wonik.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MachineToModuleDto {
    private String name;
    private Double value;
    private Date date;
}
