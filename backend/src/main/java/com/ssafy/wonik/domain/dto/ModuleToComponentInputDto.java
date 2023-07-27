package com.ssafy.wonik.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ModuleToComponentInputDto {
    private String MachineName;
    private String ModuleName;
}
