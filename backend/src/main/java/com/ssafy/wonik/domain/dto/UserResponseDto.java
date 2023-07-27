package com.ssafy.wonik.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;


import java.util.Set;

@Data
@AllArgsConstructor
public class UserResponseDto {
    private String token;
    private String Type;

    private Set<String> collectionNames;
}
