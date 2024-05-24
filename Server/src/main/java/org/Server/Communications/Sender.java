package org.Server.Communications;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.socket.TextMessage;

import java.io.IOException;

@RestController
@RequestMapping("/sender")
public class Sender {

    WebSocketHandler webSocketHandler;

    @Autowired
    public Sender(WebSocketHandler webSocketHandler) {
        this.webSocketHandler = webSocketHandler;
    }

    @PostMapping("/start-game")
    public void startGame(@RequestParam String email) throws Exception {
        webSocketHandler.handleTextMessage(null, new TextMessage("{\"message\":\"Start\", \"email\":\"" + email + "\"}"));
    }

}
