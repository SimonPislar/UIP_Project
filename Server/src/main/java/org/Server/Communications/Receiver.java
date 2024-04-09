package org.Server.Communications;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
public class Receiver {

    @Autowired
    public Receiver() {

    }

    /*
        @Brief: This function is used to login a user
        @Param: email - The email of the user to be logged in.
        @Param: password - The password of the user to be logged in.
        @Return: String - Returns "true" if the user is logged in.
     */
    @GetMapping("/receiver/login")
    public String login(@RequestParam (value = "email") String email,
                        @RequestParam (value = "password") String password) {
        return "true";
    }

    /*
        @Brief: This function is used to logout a user
        @Param: email - The email of the user to be logged out.
        @Return: void - Returns nothing.
     */
    @PostMapping("/receiver/logout")
    public void logout(@RequestParam String email) {

    }

    /*
        @Brief: This function is used to register a user
        @Param: email - The email of the user to be registered.
        @Param: username - The username of the user to be registered.
        @Param: password - The password of the user to be registered.
        @Return: void - Returns nothing.
     */
    @PostMapping("/receiver/register-account")
    public void accountRegister(@RequestParam String email,
                                @RequestParam String username,
                                @RequestParam String password) {

    }

    /*
        @Brief: This function is used to delete a user account
        @Param: email - The email of the user to be deleted.
        @Param: password - The password of the user to be deleted.
        @Return: String - Returns "deleted" if the user is deleted.
     */
    @DeleteMapping("/receiver/delete-account")
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
    @PostMapping("/receiver/update-account")
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
    @GetMapping("/receiver/get-account")
    public String getAccount(@RequestParam String email) {
        return "";
    }

    /*
        @Brief: This function is used to create a lobby
        @Param: email - The email of the user to create the lobby.
        @Param: lobbyName - The name of the lobby to be created.
        @Return: void - Returns nothing.
     */
    @PostMapping("/receiver/create-lobby")
    public void createLobby(@RequestParam String email,
                            @RequestParam String lobbyName) {

    }

    /*
        @Brief: This function is used to join a lobby
        @Param: email - The email of the user to join the lobby.
        @Param: lobbyName - The name of the lobby to be joined.
        @Return: String - Returns nothing.
     */
    @PostMapping("/receiver/join-lobby")
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
    @PostMapping("/receiver/leave-lobby")
    public void leaveLobby(@RequestParam String email,
                           @RequestParam String lobbyName) {

    }

    /*
        @Brief: This function is used to start a game
        @Param: email - The email of the user to start the game.
        @Param: lobbyName - The name of the lobby to start the game.
        @Return: void - Returns nothing.
     */
    @PostMapping("/receiver/start-game")
    public void startGame(@RequestParam String email,
                          @RequestParam String lobbyName) {

    }

    /*
        @Brief: This function is used to end a game
        @Param: email - The email of the user to end the game.
        @Param: lobbyName - The name of the lobby to end the game.
        @Return: void - Returns nothing.
     */
    @PostMapping("/receiver/end-game")
    public void endGame(@RequestParam String email,
                        @RequestParam String lobbyName) {

    }

    /*
        @Brief: This function is used to check server status
        @Return: String - Returns "pong".
    */
    @GetMapping("/receiver/ping")
    public String ping() {
        return "pong";
    }

}
