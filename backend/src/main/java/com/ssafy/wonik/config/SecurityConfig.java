package com.ssafy.wonik.config;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.stereotype.Component;


@Component
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
	private final Logger logger = LoggerFactory.getLogger(SecurityConfig.class);
    
//    @Value("${url.front-url}")
//    private String frontUrl;
    


	@Override
	protected void configure(HttpSecurity httpSecurity) throws Exception {
		httpSecurity.httpBasic().disable() 
				.csrf().disable()
				.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS) 
				.and().authorizeRequests()
				.antMatchers("**","/").permitAll();
		
	}


	@Override
	public void configure(WebSecurity webSecurity) {
		webSecurity.ignoring().antMatchers("/v2/api-docs", "/swagger-resources/**", "/swagger-ui.html", "/webjars/**",
				"/swagger/**", "/sign-api/exception", "/v3/api-docs/**", "/swagger-ui/**","/**");
	}
}

