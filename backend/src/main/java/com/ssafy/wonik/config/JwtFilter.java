package com.ssafy.wonik.config;

import com.ssafy.wonik.service.UserService;
import com.ssafy.wonik.utils.JwtToken;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final UserService userService;
    private final String secretKey;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        final String authorization = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (authorization == null || !authorization.startsWith("Bearer ")) {
            logger.error("AUTHORIZATION을 잘못 보냄");
            filterChain.doFilter(request, response);
            return;
        }

        //token 꺼내기
        String token = authorization.split(" ")[1];

        //token Expired 되었는지 여부
        if (JwtToken.isExpired(token, secretKey)) {
            logger.error("Token이 만료 되었습니다.");
            filterChain.doFilter(request, response);
            return;
        }


        // UserEmail Token에서 꺼내기
        String userEmail = JwtToken.getUserEmail(token, secretKey);

        // 권한 부여
        UsernamePasswordAuthenticationToken authenticationToken =
                new UsernamePasswordAuthenticationToken(userEmail, null, List.of(new SimpleGrantedAuthority("USER")));
        // Detail을 넣어주기
        authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authenticationToken);
        filterChain.doFilter(request, response);
    }

}