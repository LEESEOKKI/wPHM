package com.ssafy.wonik.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserFindPwDto {

    private String Email;

    private String name;
}
