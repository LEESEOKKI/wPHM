package com.ssafy.wonik.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.HashMap;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GraphResponseDto {
    private ArrayList<String> nameList;
    private HashMap<String, ArrayList> data;

}
