package org.Server.Communications;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.Server.Game.JSON.SketchbookDTO;
import org.Server.Game.JSON.SketchbookMapper;
import org.Server.Game.SketchBook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.socket.TextMessage;

import java.io.IOException;
import java.util.stream.Collectors;
import java.util.List;

@RestController
@RequestMapping("/sender")
public class Sender {

    WebSocketHandler webSocketHandler;
    private final ObjectMapper objectMapper;

    @Autowired
    public Sender(WebSocketHandler webSocketHandler, ObjectMapper objectMapper) {
        this.webSocketHandler = webSocketHandler;
        this.objectMapper = objectMapper;
    }

    @PostMapping("/start-game")
    public void startGame(@RequestParam String email) throws Exception {
        webSocketHandler.handleTextMessage(null, new TextMessage("{\"message\":\"Start\", \"email\":\"" + email + "\"}"));
    }

    public void sendMessageToUser(String email, String messageContent) throws IOException {
        TextMessage message = new TextMessage(messageContent);
        webSocketHandler.sendMessageToUser(email, message);
        System.out.println("Message sent to " + email + ": " + messageContent);
    }

    public void sendSketchbookData(String email, List<SketchBook> sketchBooks) throws IOException {
        List<SketchbookDTO> sketchbookDTOs = sketchBooks.stream()
                .map(SketchbookMapper::toDTO)
                .collect(Collectors.toList());
        String messageContent = objectMapper.writeValueAsString(sketchbookDTOs);
        TextMessage message = new TextMessage(messageContent);
        webSocketHandler.sendMessageToUser(email, message);
        System.out.println("Sketchbook data sent to " + email + ": " + messageContent);
    }
}
