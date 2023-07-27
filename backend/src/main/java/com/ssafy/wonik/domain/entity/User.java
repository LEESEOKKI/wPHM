package com.ssafy.wonik.domain.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "USER")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class User {

    @Id
    private String email;

    private String password;

    private String name;

    private String phone;

    private String type;
}
