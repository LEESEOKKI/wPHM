package com.ssafy.wonik.utils;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import java.util.Date;

public class JwtToken {

    public static String getUserEmail(String token, String secretKey){
        return Jwts.parser().setSigningKey(secretKey).parseClaimsJwt(token)
                .getBody().get("userEmail", String.class);
    }

    public static  boolean isExpired(String token, String secretKey){
        return Jwts.parser().setSigningKey(secretKey).parseClaimsJwt(token)
                .getBody().getExpiration().before(new Date());
    }

    public static String createToken(String userEmail, String key, Long expireTimeMs){
        Claims claims = Jwts.claims();
        claims.put("useremail", userEmail);
        System.out.println(claims);
        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expireTimeMs))
                .signWith(SignatureAlgorithm.HS256,key)
                .compact();
    }
}