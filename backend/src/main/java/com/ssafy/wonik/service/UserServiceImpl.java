package com.ssafy.wonik.service;

import com.ssafy.wonik.domain.dto.*;
import com.ssafy.wonik.domain.entity.User;
import com.ssafy.wonik.exception.AppException;
import com.ssafy.wonik.exception.ErrorCode;
import com.ssafy.wonik.repository.UserReposistory;
import com.ssafy.wonik.utils.JwtToken;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserReposistory userReposistory;

    private final MongoTemplate mongoTemplate;

    private final BCryptPasswordEncoder encoder;

    @Value("${jwt.token.secret")
    private String key;

    private Long expiredTimeMs = 1000 * 60 * 60l; //1시간
    private Long RefreshtokenExpiredTime = 48 * 30 * 60 * 1000L; //1일

    @Override
    public void signup(UserJoinDto userJoinDto) {
        // 중복 체크 (email)
        userReposistory.findByEmail(userJoinDto.getEmail())
                .ifPresent(user -> {
                    throw new AppException(ErrorCode.USERNAME_DUPLICATE, userJoinDto.getEmail() + "는 이미있습니다");
                });

//        User user = User.builder()
//                .email(userJoinDto.getEmail())
//                .password(encoder.encode(userJoinDto.getPassword()))
//                .name(userJoinDto.getName())
//                .phone(userJoinDto.getPhone())
//                .type(4)
//                .build();
        User user = new User();
        user.setEmail(userJoinDto.getEmail());
        user.setPassword(encoder.encode(userJoinDto.getPassword()));
        user.setName(userJoinDto.getName());
        user.setPhone(userJoinDto.getPhone());
        user.setType("UnKnown");

        userReposistory.save(user);
    }


    public UserResponseDto login(UserLoginDto userLoginDto) {
        // email 없음
        User user = userReposistory.findByEmail(userLoginDto.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.USERNAME_NOT_FOUND, "없는 email 입니다"));
        // password 틀림
        if (!encoder.matches(userLoginDto.getPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.INVALID_PASSWORD, "password 오류");
        }
        // Exception 안됐을시 토큰 발행
        String token = JwtToken.createToken(user.getEmail(), key, expiredTimeMs);

        UserResponseDto userResponseDto = new UserResponseDto(token, user.getType(), null);
        if (userResponseDto.getType().equals("Master")) {
            Set<String> collectionNames = mongoTemplate.getCollectionNames();
            try {
                collectionNames.remove("USER");
                collectionNames.remove("temproles");
                collectionNames.remove("tempusers");
                collectionNames.remove("system.version");
                collectionNames.remove("system.users");
                collectionNames.remove("system.profile");
                userResponseDto.setCollectionNames(collectionNames);
            } catch (Exception e) {
                System.out.println(e);
            }
        }else{
            Set<String> collectionNanme = new HashSet<>();
            collectionNanme.add(userResponseDto.getType());
            userResponseDto.setCollectionNames(collectionNanme);
        }


        return userResponseDto;
    }

    @Override
    public List<User> getAllUser() {
        return userReposistory.findAll();
    }

    @Override
    public void typeUpdate(UserTypeUpdateDto userTypeUpdateDto) {
        User user = userReposistory.findByEmail(userTypeUpdateDto.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.USERNAME_NOT_FOUND, "없는 email 입니다"));

        user.setType(userTypeUpdateDto.getType());
        userReposistory.save(user);
    }

    @Override
    public String findUserEmail(UserFindIdDto userFindIdDto) {
        User user = userReposistory.findByPhone(userFindIdDto.getPhone())
                .orElseThrow(() -> new AppException(ErrorCode.USERNAME_NOT_FOUND, " 없는 phone, name 입니다."));
        System.out.println("2");
        String email = user.getEmail();
        System.out.println(email);
        return email;
    }

    @Override
    public String findUserPassword(UserFindPwDto userFindPwDto) {
        User user = userReposistory.findByEmail(userFindPwDto.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.USERNAME_NOT_FOUND, " 없는 Email 입니다."));

        return null;
    }

    @Override
    public String changePassword(UserChangePwDto userChangePwDto) {
        User user = userReposistory.findByEmail(userChangePwDto.getEmail())
                .orElseThrow(()-> new AppException(ErrorCode.USERNAME_NOT_FOUND, "없는 Email 입니다"));

        user.setPassword(encoder.encode(userChangePwDto.getPassword()));
        userReposistory.save(user);
        return null;
    }


}
