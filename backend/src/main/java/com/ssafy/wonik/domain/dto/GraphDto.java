package com.ssafy.wonik.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
@Data
@AllArgsConstructor
public class GraphDto {
//    private double division;
    private LocalDateTime date;
    private double value;
}
//{division: "Bethesda-Rockville-Frederick, MD Met Div", date: 2000-01-01, unemployment: 2.6}