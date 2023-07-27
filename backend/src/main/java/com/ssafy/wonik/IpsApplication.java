package com.ssafy.wonik;

import java.io.Console;
import javax.annotation.PostConstruct;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@SpringBootApplication(exclude = SecurityAutoConfiguration.class)
public class IpsApplication {
	public static void main(String[] args) {
		SpringApplication.run(IpsApplication.class, args );
	}

}
