package com.ssafy.wonik.domain.dto;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class UserJoinDto {

    private String email;

    private String password;

    private String name;

    private String phone;
}
