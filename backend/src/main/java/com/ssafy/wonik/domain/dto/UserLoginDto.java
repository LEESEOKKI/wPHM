package com.ssafy.wonik.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class UserLoginDto {

    private String email;

    private String password;
}