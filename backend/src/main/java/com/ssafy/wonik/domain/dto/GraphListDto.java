package com.ssafy.wonik.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GraphListDto {
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date date;
    private Double value;
}
