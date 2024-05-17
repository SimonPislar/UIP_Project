package org.Server.Communications;

import jakarta.servlet.http.HttpServletRequest;
import org.Server.ServerController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping(path="/receiver") // This means URLs start with /user-controller (after Application path)
public class Receiver {

    ServerController serverController;

    @Autowired
    public Receiver(ServerController serverController) {
        this.serverController = serverController;
    }

    /*
        @Brief: This function is used to log in a user
        @Param: email - The email of the user to be logged in.
        @Param: password - The password of the user to be logged in.
        @Return: Map<String, Object> - Returns a map with the success and message.
        @Note: Spring's jackson library will automatically convert the map to a JSON object.
               This is the standard way to return JSON objects in Spring.
     */
    @CrossOrigin(origins = "http://localhost:3000")
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
    @CrossOrigin(origins = "http://localhost:3000")
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
    @CrossOrigin(origins = "http://localhost:3000")
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
    @CrossOrigin(origins = "http://localhost:3000")
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
    @CrossOrigin(origins = "http://localhost:3000")
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
    @CrossOrigin(origins = "http://localhost:3000")
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
    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping(path = "create-lobby")
    public void createLobby(@RequestParam String email,
                            @RequestParam String lobbyName) {

    }

    /*
        @Brief: This function is used to join a lobby
        @Param: email - The email of the user to join the lobby.
        @Param: lobbyName - The name of the lobby to be joined.
        @Return: String - Returns nothing.
     */
    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping(path = "join-lobby")
    public String joinLobby(@RequestParam String email,
                          @RequestParam String lobbyName) {
        return "";
    }

    /*
        @Brief: This function is used to leave a lobby
        @Param: email - The email of the user to leave the lobby.
        @Param: lobbyName - The name of the lobby to be left.
        @Return: void - Returns nothing.
     */
    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping(path = "leave-lobby")
    public void leaveLobby(@RequestParam String email,
                           @RequestParam String lobbyName) {

    }

    /*
        @Brief: This function is used to start a game
        @Param: email - The email of the user to start the game.
        @Param: lobbyName - The name of the lobby to start the game.
        @Return: void - Returns nothing.
     */
    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping(path = "start-game")
    public void startGame(@RequestParam String email,
                          @RequestParam String lobbyName) {

    }

    /*
        @Brief: This function is used to end a game
        @Param: email - The email of the user to end the game.
        @Param: lobbyName - The name of the lobby to end the game.
        @Return: void - Returns nothing.
     */
    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping(path = "end-game")
    public void endGame(@RequestParam String email,
                        @RequestParam String lobbyName) {

    }

    /*
        @Brief: This function is used to check server status
        @Return: String - Returns "pong".
    */
    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping(path = "ping")
    public Map<String, Object> ping(HttpServletRequest request) {
        System.out.println("Ping received from client at " + System.currentTimeMillis() + " from " + request.getRemoteAddr() + ".");
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "pong");
        return response;
    }

}
