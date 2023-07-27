package com.ssafy.wonik.service;

import com.ssafy.wonik.domain.dto.*;
import com.ssafy.wonik.domain.entity.Machine;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.bson.Document;

public interface MachineService {

    List<MachineToModuleDto> findRecentModuleData(String machineName);

    List<ResultDataDto> findGraphData(GraphInputDto graphInputDto);

    List<MachineToModuleDto> findRecentComponentData(ModuleToComponentInputDto moduleToComponentInputDto);

	List<Document> findGraphData2(GraphInputDto graphInputDto);


    List<MachineToModuleDto> findNowGraph(NowGraphInputDto nowGraphInputDto);

	List<Document> findParameter(GraphInputDto graphInputDto);
}
