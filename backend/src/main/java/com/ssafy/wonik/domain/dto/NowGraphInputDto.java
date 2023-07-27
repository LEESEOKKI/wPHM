package com.ssafy.wonik.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NowGraphInputDto {
    private String machineName;

    private String moduleName;

    private String ComponentName;

}
