package com.ssafy.wonik.service;

import com.ssafy.wonik.domain.dto.*;
import com.ssafy.wonik.domain.entity.User;

import java.util.List;

public interface UserService {

    void signup(UserJoinDto userJoinDto);

    UserResponseDto login(UserLoginDto userLoginDto);

    List<User> getAllUser();

    void typeUpdate(UserTypeUpdateDto userTypeUpdateDto);

    String findUserEmail(UserFindIdDto userFindIdDto);

    String findUserPassword(UserFindPwDto userFindPwDto);

    String changePassword(UserChangePwDto userChangePwDto);
}

