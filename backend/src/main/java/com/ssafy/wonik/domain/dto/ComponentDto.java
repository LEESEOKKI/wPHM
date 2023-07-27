package com.ssafy.wonik.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ComponentDto {
    private String name;
    private Double value;
    private List<ComponentChildDto> child;
}

