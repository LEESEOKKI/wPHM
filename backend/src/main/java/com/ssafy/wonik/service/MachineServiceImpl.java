package com.ssafy.wonik.service;

import com.ssafy.wonik.domain.dto.*;
import com.ssafy.wonik.domain.entity.Machine;
import com.ssafy.wonik.repository.MachineRepository;
import lombok.RequiredArgsConstructor;

import org.bson.Document;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MachineServiceImpl implements MachineService{

    private final MachineRepository machineRepository;


    @Override
    public List<MachineToModuleDto> findRecentModuleData(String machineName) {
        return machineRepository.findRecentModuleData(machineName);
    }

    @Override
    public List<ResultDataDto> findGraphData(GraphInputDto graphInputDto) {
        List<ResultDataDto> resultDataDto = machineRepository.findGraphData(graphInputDto);
        return resultDataDto;
    }

    @Override
    public List<MachineToModuleDto> findRecentComponentData(ModuleToComponentInputDto moduleToComponentInputDto) {
        return machineRepository.findRecentComponentData(moduleToComponentInputDto);
    }

	@Override
	public List<Document> findGraphData2(GraphInputDto graphInputDto) {
		return machineRepository.findGraphData2(graphInputDto);
	}

    @Override
    public List<MachineToModuleDto> findNowGraph(NowGraphInputDto nowGraphInputDto) {
        return machineRepository.findNowGraphData(nowGraphInputDto);
    }

	@Override
	public List<Document> findParameter(GraphInputDto graphInputDto) {
		// TODO Auto-generated method stub
		return machineRepository.findParameter(graphInputDto);
	}
}
