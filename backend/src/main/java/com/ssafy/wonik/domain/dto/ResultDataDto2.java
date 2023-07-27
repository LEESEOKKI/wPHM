package com.ssafy.wonik.domain.dto;

import java.util.Date;

import org.springframework.format.annotation.DateTimeFormat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResultDataDto2 {
	private String name;
	private String value;
	@DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date date;
}
