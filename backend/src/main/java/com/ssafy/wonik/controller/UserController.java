package com.ssafy.wonik.controller;

import com.ssafy.wonik.domain.dto.*;
import com.ssafy.wonik.service.UserService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://k8s101.p.ssafy.io:3000","http://3.36.125.122:3000","https://k8s101.p.ssafy.io","https://k8s101.p.ssafy.io"}, allowCredentials = "true")
@RequestMapping("/account")
public class UserController {

    private final UserService userService;

    @PostMapping("/join")
    public ResponseEntity<?> join(@RequestBody UserJoinDto userJoinDto){
        userService.signup(userJoinDto);
        return ResponseEntity.ok().body("회원가입 성공");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserLoginDto userLoginDto){
        System.out.println(userLoginDto.getEmail());
        System.out.println(userLoginDto.getPassword());
        UserResponseDto userResponseDto = userService.login(userLoginDto);
        return ResponseEntity.ok().body(userResponseDto);
    }

    @GetMapping("/list")
    public ResponseEntity<?> getUser(){
        return ResponseEntity.ok().body(userService.getAllUser());
    }

    @PutMapping("/typeUpdate")
    public ResponseEntity<?> typeUpdate(@RequestBody UserTypeUpdateDto userTypeUpdateDto){
        userService.typeUpdate(userTypeUpdateDto);
        return ResponseEntity.ok().body("type 수정 완료");
    }

    @PostMapping("/findid")
    public ResponseEntity<?> findEmail(@RequestBody UserFindIdDto userFindIdDto){
        String email = userService.findUserEmail(userFindIdDto);
        System.out.println("1");
        return  ResponseEntity.ok().body(email);
    }

    @PostMapping("/findpw")
    public ResponseEntity<?> findPw(@RequestBody UserFindPwDto userFindPwDto){
        userService.findUserPassword(userFindPwDto);
        return ResponseEntity.ok().body("");
    }

    @PutMapping("/changepw")
    public ResponseEntity<?> changePw(@RequestBody UserChangePwDto userChangePwDto){
        userService.changePassword(userChangePwDto);
        return ResponseEntity.ok().body("비밀번호 변경 완료");
    }
}
