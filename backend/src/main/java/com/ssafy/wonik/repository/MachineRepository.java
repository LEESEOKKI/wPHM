package com.ssafy.wonik.repository;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import com.ssafy.wonik.domain.dto.*;
import com.ssafy.wonik.domain.entity.Machine;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Repository;

import javax.print.Doc;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;


import static org.springframework.data.mongodb.core.aggregation.Aggregation.*;

@Repository
public class MachineRepository {
    @Autowired
    private MongoTemplate mongoTemplate;

    public List<MachineToModuleDto> findRecentModuleData(String machineName) {
        MongoCollection<Document> collection = mongoTemplate.getCollection(machineName);

        Document latestDateDoc = collection.find().sort(new Document("date", -1)).first();
        Date latestDate = latestDateDoc.getDate("date");

        List<MachineToModuleDto> result = new ArrayList<>();
        try (MongoCursor<Document> cursor = collection.find(
            Filters.and(
                Filters.or(
                    Filters.eq("parent", machineName),
                    Filters.eq("parent", "first")
                    ),
                    Filters.eq("date", latestDate)
                )).iterator()) {
            while (cursor.hasNext()) {
                Document doc = cursor.next();
                MachineToModuleDto data = new MachineToModuleDto();
                data.setName(doc.getString("name"));
                data.setDate(doc.getDate("date"));
                data.setValue(doc.getDouble("value"));
                result.add(data);
            }
        }

        return result;
    }

    public List<MachineToModuleDto> findRecentComponentData(ModuleToComponentInputDto moduleToComponentInputDto) {
        MongoCollection<Document> collection = mongoTemplate.getCollection(moduleToComponentInputDto.getMachineName());

        Document latestDateDoc = collection.find().sort(new Document("date", -1)).first();
        Date latestDate = latestDateDoc.getDate("date");

        List<MachineToModuleDto> result = new ArrayList<>();
        try (MongoCursor<Document> cursor = collection.find(
                Filters.and(
                        Filters.eq("parent", moduleToComponentInputDto.getModuleName()),
                        Filters.eq("date", latestDate)
                )).iterator()) {
            while (cursor.hasNext()) {
                Document doc = cursor.next();
                MachineToModuleDto data = new MachineToModuleDto();
                data.setName(doc.getString("name"));
                data.setDate(doc.getDate("date"));
                data.setValue(doc.getDouble("value"));
                result.add(data);
            }
        }

        return result;
    }


    public List<ResultDataDto> findGraphData(GraphInputDto graphInputDto) {
        MatchOperation match = match(
        new Criteria().andOperator(
                        Criteria.where("date").gte(graphInputDto.getStartDate()),
                        Criteria.where("date").lt(graphInputDto.getEndDate())
                )
                .orOperator(
                        Criteria.where("parent").is(graphInputDto.getComponentName()),
                        new Criteria().andOperator(
                                Criteria.where("parent").is(graphInputDto.getModuleName()),
                                Criteria.where("name").is(graphInputDto.getComponentName())
                        )
                )
        );

        GroupOperation group = group("name")
                .first("name").as("name")
                .push(new Document("value", "$value").append("date", "$date")).as("data");

        Aggregation aggregation = newAggregation(match, group).withOptions(Aggregation.newAggregationOptions().allowDiskUse(true).build());
        AggregationResults<ResultDataDto> result =
                mongoTemplate.aggregate(aggregation, graphInputDto.getMachineName(), ResultDataDto.class);

        return result.getMappedResults();
    }

	public List<Document> findGraphData2(GraphInputDto graphInputDto) {
	    Aggregation aggregation = Aggregation.newAggregation(
//	            Aggregation.sort(Sort.by(Sort.Direction.DESC, "date")),
	            Aggregation.match(Criteria.where("date").gte(graphInputDto.getStartDate()).lt(graphInputDto.getEndDate())
	                        .and("parent").is(graphInputDto.getComponentName())
	                        .and("name").is(graphInputDto.getParameterName()))
	            ,Aggregation.project("_id", "parent","name").andExclude("_id", "parent","name")
	    );
//	    AggregateIterable<Document> result = collection.aggregate(Arrays.asList(new Document("$sort",
//	    	    new Document("date", -1L)), 
//	    	    new Document("$match", 
//	    	    new Document("$and", Arrays.asList(new Document("date", 
//	    	                new Document("$gte", 
//	    	                new java.util.Date(1641033117942L))
//	    	                        .append("$lt", 
//	    	                new java.util.Date(1672482717942L))), 
//	    	                new Document("parent", "root-006-000"), 
//	    	                new Document("name", "pump_pressure_022")))), 
//	    	    new Document("$project", 
//	    	    new Document("_id", 0L)
//	    	            .append("parent", 0L))));
	    AggregationResults<Document> rawResult =
	            mongoTemplate.aggregate(aggregation, graphInputDto.getMachineName(), Document.class);
	    return rawResult.getMappedResults();
        
	}
	public List<Document> findParameter(GraphInputDto graphInputDto) {

	    MongoCollection<Document> collection = mongoTemplate.getCollection(graphInputDto.getMachineName());
        List<MachineToModuleDto> result = new ArrayList<>();
        Document latestDateDoc = collection.find().sort(new Document("date",-1)).first();
        Date latestDate = latestDateDoc.getDate("date");
		
	    Aggregation aggregation = Aggregation.newAggregation(
        Aggregation.match(Criteria.where("date")
        		.is(latestDate)
                .and("parent")
                .is(graphInputDto.getComponentName())),
        Aggregation.group("name")
            .first("name").as("name"),
        Aggregation.project("_id").andExclude("_id")
); 
		
	    AggregationResults<Document> rawResult =
	    		mongoTemplate.aggregate(aggregation, graphInputDto.getMachineName(), Document.class);
		
	    return rawResult.getMappedResults();
	    
//	    public List<Document> aggregate(MongoTemplate mongoTemplate) {
//	        Aggregation aggregation = Aggregation.newAggregation(
//	                Aggregation.match(Criteria.where("date")
//	                            .gte(new Date(1641033117942L))
//	                            .lt(new Date(1672482717942L))
//	                            .and("parent")
//	                            .is("root-006-000")),
//	                Aggregation.group("name")
//	                            .first("name").as("name")
//	        );
//
//	        AggregationResults<Document> rawResult =
//	                mongoTemplate.aggregate(aggregation, "machine_A", Document.class);
//	        return rawResult.getMappedResults();
//	    }

	}

    public List<MachineToModuleDto> findNowGraphData(NowGraphInputDto nowGraphInputDto) {
        MongoCollection<Document> collection = mongoTemplate.getCollection(nowGraphInputDto.getMachineName());
        List<MachineToModuleDto> result = new ArrayList<>();
        Document latestDateDoc = collection.find().sort(new Document("date",-1)).first();
        Date latestDate = latestDateDoc.getDate("date");
        try (MongoCursor<Document> cursor = collection.find(
                Filters.and(
                        Filters.or(
                                Filters.eq("parent", nowGraphInputDto.getComponentName()),
                                Filters.and(
                                        Filters.eq("parent", nowGraphInputDto.getModuleName()),
                                        Filters.eq("name", nowGraphInputDto.getComponentName())
                                )

                        ),
                        Filters.eq("date", latestDate)
                )).iterator()) {
            while (cursor.hasNext()) {
                Document doc = cursor.next();
                MachineToModuleDto data = new MachineToModuleDto();
                data.setName(doc.getString("name"));
                data.setDate(doc.getDate("date"));
                data.setValue(doc.getDouble("value"));
                result.add(data);
            }
        }

        return result ;
    }




// --------------------------------------원래 사용법
//        MongoCollection<Document> collection = mongoTemplate.getCollection("TT_TEST");
//        GraphResponseDto graphResponseDto = new GraphResponseDto();
//
//        ArrayList<String> nameList = new ArrayList<>();
//        HashMap<String, ArrayList> mainMap = new HashMap<>();
//        HashMap<String,Object> valueMap = new HashMap<>();
//
//        try(MongoCursor<Document> cursor = collection.find(
//                Filters.and(
//                        Filters.or(
//                                Filters.eq("name", graphInputDto.getComponentName()),
//                                Filters.eq("parent", graphInputDto.getComponentName())
//                                ),
//                        Filters.gte("date", graphInputDto.getStartDate()),
//                        Filters.lt("date", graphInputDto.getEndDate())
//                        )).iterator()){
//
//            while (cursor.hasNext()){
//                Document doc = cursor.next();
//                String name = doc.getString("name");
//                Date date = doc.getDate("date");
//                Double value = doc.getDouble("value");
//                GraphListDto graphListDto = new GraphListDto(date, value);
//                if(mainMap.containsKey(name)){
//                    mainMap.get(name).add(graphListDto);
//                }
//                else {
//                    ArrayList<GraphListDto> inputValue = new ArrayList<>();
//                    nameList.add(name);
//                    inputValue.add(graphListDto);
//                    mainMap.put(name, inputValue);
//                }
//            }
//            graphResponseDto.setNameList(nameList);
//            graphResponseDto.setData(mainMap);
//        }
//        return graphResponseDto;
//    }
}
