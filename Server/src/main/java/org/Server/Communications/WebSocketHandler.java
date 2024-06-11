package org.Server.Communications;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class WebSocketHandler extends TextWebSocketHandler {

    // This class is responsible for handling WebSocket connections.
    private final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

    // This method is called when a new connection is established.
    // The email is stored as an attribute of the session.
    // The session is stored in the sessions map.
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String email = (String) session.getAttributes().get("email");
        if (email != null) {
            sessions.put(email, session);
        }
    }

    // This method is called when a message is received.
    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        for (WebSocketSession webSocketSession : sessions.values()) {
            if (webSocketSession.isOpen()) {
                webSocketSession.sendMessage(message);
            }
        }
    }

    // This method is called when a connection is closed.
    // The email is retrieved from the session attributes.
    // The session is removed from the sessions map.
    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        String email = (String) session.getAttributes().get("email");
        if (email != null) {
            sessions.remove(email);
        }
        super.afterConnectionClosed(session, status);
    }

    // This method sends a message to a specific user.
    public void sendMessageToUser(String email, TextMessage message) throws IOException {
        WebSocketSession session = sessions.get(email);
        if (session != null && session.isOpen()) {
            session.sendMessage(message);
        }
    }
}
