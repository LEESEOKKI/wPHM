package com.ssafy.wonik.utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.JsonToken;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.wonik.domain.dto.ComponentRootDto;
import com.ssafy.wonik.service.MachineService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.StopWatch;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Component
@Slf4j
@RequiredArgsConstructor
public class SseEmitters {
    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    private final MachineService machineService;

    public SseEmitter add(SseEmitter emitter) {
        this.emitters.add(emitter);
        log.info("new emitter added: {}", emitter);
        log.info("emitter list size: {}", emitters.size());
        emitter.onCompletion(() -> {
            log.info("onCompletion callback");
            this.emitters.remove(emitter);    // 만료되면 리스트에서 삭제
        });
        emitter.onTimeout(() -> {
            log.info("onTimeout callback");
            emitter.complete();
        });

        return emitter;
    }

    public void send(String machine) throws JsonProcessingException {
        StopWatch sw = new StopWatch();
        sw.start();
        System.out.println("접속자 수 : " + emitters.size());
        emitters.forEach(sseEmitter -> {
            try {
                sseEmitter.send(SseEmitter.event()
                        .name("machine")
                        .data(machine));
        } catch (IOException e) {
                throw new RuntimeException(e);
            }
        });
        sw.stop();
        System.out.println("status 최신 sse 보내는 속도 : " + sw.getTotalTimeSeconds());
    }

    public void sendError(String machine) throws Exception{
        StopWatch sw = new StopWatch();
        sw.start();
        System.out.println("접속자 수 : " + emitters.size());
        emitters.forEach(sseEmitter -> {
            try {
                sseEmitter.send(SseEmitter.event()
                        .name("errorMachine")
                        .data(machine));
            }catch (IOException e){
                throw new RuntimeException(e);
            }
        });
        sw.stop();
        System.out.println("error sse 보내는 속도 : " + sw.getTotalTimeSeconds());
    }
}
