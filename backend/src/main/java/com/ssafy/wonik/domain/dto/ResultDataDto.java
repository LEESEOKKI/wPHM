package com.ssafy.wonik.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class ResultDataDto {
    private String name;
    private List<Map<String, Object>> data;
}
