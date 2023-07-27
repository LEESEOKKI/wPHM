package com.ssafy.wonik.domain.entity;

import com.ssafy.wonik.domain.dto.ComponentRootDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import nonapi.io.github.classgraph.json.Id;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class Machine {
        @Id
        private String id;

        private String name;

        private Double value;

        private ArrayList<ComponentRootDto> child;

        private LocalDateTime date;

//        private  String name;
}
