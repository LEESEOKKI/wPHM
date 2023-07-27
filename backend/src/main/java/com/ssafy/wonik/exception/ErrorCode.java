package com.ssafy.wonik.exception;


import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@AllArgsConstructor
@Getter
public enum ErrorCode {
    USERNAME_DUPLICATE(HttpStatus.CONFLICT, ""),
    USERNAME_NOT_FOUND(HttpStatus.UNAUTHORIZED, ""),
    INVALID_PASSWORD(HttpStatus.UNAUTHORIZED,"");

    private HttpStatus httpStatus;
    private String message;
}

