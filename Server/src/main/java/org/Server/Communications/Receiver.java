package org.Server.Communications;

import jakarta.servlet.http.HttpServletRequest;
import org.Server.Game.GameController;
import org.Server.Game.GameSession;
import org.Server.ServerController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping(path="/receiver") // This means URLs start with /user-controller (after Application path)
public class Receiver {

    ServerController serverController;
    GameController gameController;

    @Autowired
    public Receiver(ServerController serverController, GameController gameController) {
        this.serverController = serverController;
        this.gameController = gameController;
    }

    /*
        @Brief: This function is used to log in a user
        @Param: email - The email of the user to be logged in.
        @Param: password - The password of the user to be logged in.
        @Return: Map<String, Object> - Returns a map with the success and message.
        @Note: Spring's jackson library will automatically convert the map to a JSON object.
               This is the standard way to return JSON objects in Spring.
     */
    @CrossOrigin(origins = "*")
    @PostMapping(path = "login")
    public Map<String, Object> login(@RequestParam (value = "email") String email,
                                     @RequestParam (value = "password") String password) {
        boolean result = serverController.login(email, password);
        Map<String, Object> response = new HashMap<>();

        if (result) {
            response.put("success", true);
            response.put("message", "true");
        } else {
            response.put("success", false);
            response.put("message", "Invalid credentials.");
        }

        return response;
    }

    /*
        @Brief: This function is used to log out a user
        @Param: email - The email of the user to be logged out.
        @Return: void - Returns nothing.
     */
    @CrossOrigin(origins = "*")
    @PostMapping(path = "logout")
    public void logout(@RequestParam String email) {

    }

    /*
        @Brief: This function is used to register a user
        @Param: email - The email of the user to be registered.
        @Param: username - The username of the user to be registered.
        @Param: password - The password of the user to be registered.
        @Return: void - Returns nothing.
     */
    @CrossOrigin(origins = "*")
    @PostMapping(path = "register-account")
    public Map<String, Object> accountRegister(@RequestParam (value = "email") String email,
                                               @RequestParam (value = "username") String username,
                                               @RequestParam (value = "password") String password) {
        boolean result = serverController.register(email, username, password);
        Map<String, Object> response = new HashMap<>();
        if (result) {
            response.put("success", true);
            response.put("message", "true");
        } else {
            response.put("success", false);
            response.put("message", "User already exists.");
        }
        return response;
    }

    /*
        @Brief: This function is used to delete a user account
        @Param: email - The email of the user to be deleted.
        @Param: password - The password of the user to be deleted.
        @Return: String - Returns "deleted" if the user is deleted.
     */
    @CrossOrigin(origins = "*")
    @DeleteMapping(path = "delete-account")
    public String deleteAccount(@RequestParam String email,
                                @RequestParam String password) {
        return "";
    }

    /*
        @Brief: This function is used to update a user account
        @Param: email - The email of the user to be updated.
        @Param: username - The username of the user to be updated.
        @Param: password - The password of the user to be updated.
        @Return: String - Returns "updated" if the user is updated.
     */
    @CrossOrigin(origins = "*")
    @PostMapping(path = "update-account")
    public String updateAccount(@RequestParam String email,
                                @RequestParam String username,
                                @RequestParam String password) {
        return "updated";
    }

    /*
        @Brief: This function is used to get a user account
        @Param: email - The email of the user to be retrieved.
        @Return: String - Returns the user account.
     */
    @CrossOrigin(origins = "*")
    @GetMapping(path = "get-account")
    public String getAccount(@RequestParam String email) {
        return "";
    }

    /*
        @Brief: This function is used to create a lobby
        @Param: email - The email of the user to create the lobby.
        @Param: lobbyName - The name of the lobby to be created.
        @Return: void - Returns nothing.
     */
    @CrossOrigin(origins = "*")
    @PostMapping(path = "create-lobby")
    public Map<String, Object> createLobby(HttpServletRequest request,
                            @RequestParam (value = "email") String email,
                            @RequestParam (value = "gameName") String lobbyName,
                            @RequestParam (value = "playerCount") int playerCount) {
        String ip = request.getRemoteAddr() + ":" + request.getRemotePort();
        boolean result = this.gameController.initializeGame(email, lobbyName, playerCount);
        Map<String, Object> response = new HashMap<>();
        if (result) {
            response.put("success", true);
            response.put("message", lobbyName);
        } else {
            response.put("success", false);
            response.put("message", "Lobby already exists or player already has active lobby.");
        }
        return response;
    }

    /*
        @Brief: This function is used to get the player's lobby
        @Param: email - The email of the user to get the lobby.
        @Return: Map<String, Object> - Returns the player's lobby.
     */
    @CrossOrigin(origins = "*")
    @PostMapping(path = "get-player-lobby")
    public Map<String, Object> getPlayerLobby(@RequestParam (value = "email") String email) {
        String lobbyName = this.gameController.getGameSessionName(email);
        System.out.println("Lobby name for player with email " + email + ": " + lobbyName);
        Map<String, Object> response = new HashMap<>();
        if (lobbyName != null) {
            if (this.gameController.getGameSession(lobbyName).getPlayers().get(0).getID() == this.serverController.getUser(email).getId()) {
                response.put("isHost", true);
            } else {
                response.put("isHost", false);
            }
            response.put("success", true);
            response.put("message", lobbyName);
        } else {
            response.put("success", false);
            response.put("message", "No lobby found.");
            response.put("isHost", false);
        }
        return response;
    }

    @CrossOrigin(origins = "*")
    @PostMapping(path = "get-lobby-players")
    public Map<String, Object> getLobbyPlayers(@RequestParam (value = "gameName") String gameName) {
        ArrayList<String> players = this.gameController.getPlayersInGameSession(gameName);
        if (players == null) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lobby does not exist.");
            return response;
        }
        String[] playersArray = players.toArray(new String[0]);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", playersArray);
        return response;
    }

    /*
        @Brief: This function is used to get the lobbies
        @Return: Map<String, Object> - Returns the lobbies.
     */
    @CrossOrigin(origins = "*")
    @GetMapping(path = "get-lobbies")
    public Map<String, Object> getLobbies() {
        ArrayList<GameSession> lobbies = this.gameController.getActiveGameSessions();
        if (lobbies == null) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "No lobbies found.");
            return response;
        }
        ArrayList<String> lobbyNames = new ArrayList<>();

        for (GameSession lobby : lobbies) {
            lobbyNames.add(lobby.getSessionName());
        }
        System.out.println("Lobbies: " + lobbyNames.toString());
        String[] lobbyNamesArray = lobbyNames.toArray(new String[0]);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", lobbyNamesArray);
        return response;
    }

    /*
        @Brief: This function is used to join a lobby
        @Param: email - The email of the user to join the lobby.
        @Param: lobbyName - The name of the lobby to be joined.
        @Return: String - Returns nothing.
     */
    @CrossOrigin(origins = "*")
    @PostMapping(path = "join-lobby")
    public Map<String, Object> joinLobby(HttpServletRequest request,
                            @RequestParam (value = "email") String email,
                            @RequestParam (value = "gameName") String gameName) {
        String IP = request.getRemoteAddr() + ":" + request.getRemotePort();
        boolean result = gameController.addPlayerToGameSession(email, gameName);
        if (!result) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Lobby does not exist, player is already in a lobby or lobby full.");
            return response;
        }
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Joined lobby " + gameName + ".");
        return response;
    }

    /*
        @Brief: This function is used to leave a lobby
        @Param: email - The email of the user to leave the lobby.
        @Param: lobbyName - The name of the lobby to be left.
        @Return: void - Returns nothing.
     */
    @CrossOrigin(origins = "*")
    @PostMapping(path = "leave-lobby")
    public void leaveLobby(@RequestParam String email,
                           @RequestParam String lobbyName) {

    }

    @CrossOrigin(origins = "*")
    @PostMapping(path = "submit-word")
    public Map<String, Object> submitWord(@RequestParam (value = "email") String email,
                           @RequestParam (value = "word") String word) {
        String gameSessionName = this.gameController.getGameSessionName(email);
        boolean result = this.gameController.addWord(email, gameSessionName, word);
        Map<String, Object> response = new HashMap<>();
        if (result) {
            response.put("success", true);
            response.put("message", "Word submitted.");
        } else {
            response.put("success", false);
            response.put("message", "Word not submitted.");
        }
        return response;
    }

    /*
        @Brief: This function is used to check server status
        @Return: String - Returns "pong".
    */
    @CrossOrigin(origins = "*")
    @GetMapping(path = "ping")
    public Map<String, Object> ping(HttpServletRequest request) {
        System.out.println("Ping received from client at " + System.currentTimeMillis() + " from " + request.getRemoteAddr() + ".");
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "pong");
        return response;
    }

}
