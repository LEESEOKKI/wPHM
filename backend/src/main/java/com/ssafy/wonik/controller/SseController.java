package com.ssafy.wonik.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.ssafy.wonik.utils.SseEmitters;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;


@RestController
@CrossOrigin(origins = {"http://localhost:3000","http://3.36.125.122:3000","https://k8s101.p.ssafy.io"}, allowCredentials = "true")
@RequestMapping("/sse")
public class SseController {

    private final SseEmitters sseEmitters;

    public SseController(SseEmitters sseEmitters) {
        this.sseEmitters = sseEmitters;
    }

    @GetMapping(value = "/connect", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public ResponseEntity<SseEmitter> connect() {
        SseEmitter emitter = new SseEmitter();
        sseEmitters.add(emitter);
        try {
            System.out.println("SSE connect");
            emitter.send(SseEmitter.event()
                    .name("connect")
                    .data("connected!"));
            System.out.println("SSE send");
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return ResponseEntity.ok(emitter);
    }

    @GetMapping("/test/{machine}")
    public HttpStatus Test(@PathVariable String machine) throws JsonProcessingException {
        System.out.println(machine);
        sseEmitters.send(machine);
        return HttpStatus.OK;
    }

    @PostMapping("/newerror/{machine}")
    public HttpStatus NewError(@PathVariable String machine) throws Exception {
        System.out.println("에러다"+machine);
        sseEmitters.sendError(machine);
        System.out.println(machine);
        return HttpStatus.OK;
    }

}
