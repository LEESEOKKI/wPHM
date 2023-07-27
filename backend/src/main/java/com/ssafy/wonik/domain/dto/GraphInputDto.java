package com.ssafy.wonik.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GraphInputDto {
    private String machineName;
    private String moduleName;
    private String ComponentName;
    private String parameterName;
//    private LocalDateTime startDate;
//    private LocalDateTime endDate;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date startDate;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date endDate;

}
