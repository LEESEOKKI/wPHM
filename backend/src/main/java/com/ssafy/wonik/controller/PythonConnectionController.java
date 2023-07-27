package com.ssafy.wonik.controller;

import java.io.IOException;                                                                                       import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
public class PythonConnectionController {

    @GetMapping("/test")
    public HttpStatus Test() {
    	System.out.println("연결됨");
    	return HttpStatus.OK;
    }
}
