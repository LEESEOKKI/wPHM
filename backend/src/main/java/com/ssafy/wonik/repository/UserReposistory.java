package com.ssafy.wonik.repository;

import com.ssafy.wonik.domain.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface UserReposistory extends MongoRepository<User, Integer> {
    Optional<User> findByEmail(String email);

    Optional<User> findByPhone(String phone);
}

