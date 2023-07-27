package com.ssafy.wonik.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class UserTypeUpdateDto {
    private String email;

    private String type;
}
