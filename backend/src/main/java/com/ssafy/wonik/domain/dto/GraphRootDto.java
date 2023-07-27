package com.ssafy.wonik.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class GraphRootDto {
    private String componentName;
    private List<GraphDto> graphData;
}
