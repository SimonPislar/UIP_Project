package org.Server.Game;

import org.Server.DBMS.DBController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.Server.DBMS.User;
import org.Server.Game.Drawing;
import org.Server.Game.Round;

import java.util.ArrayList;

@Component
public class GameController {

    private final DBController dbController;
    private final ArrayList<GameSession> activeGameSessions;
    private final ArrayList<GameSession> inactiveGameSessions;

    @Autowired
    public GameController(DBController dbController) {
        this.dbController = dbController;
        this.activeGameSessions = new ArrayList<>();
        this.inactiveGameSessions = new ArrayList<>();
    }

    /*
        @Brief: This function is used to initialize the game.
        @Param: email - The email of the player.
        @Param: sessionName - The name of the session.
    */
    public void initializeGame(String email, String sessionName, int playerCount) {
        User user = this.dbController.getUser(email);
        Player player = new Player(user.getUsername(), user.getId());
        GameSession gameSession = new GameSession(playerCount, player, sessionName);
        this.activeGameSessions.add(gameSession);
    }

    /*
        @Brief: This function is used to get the active game sessions.
        @Return: ArrayList<GameSession> - Returns the active game sessions.
    */
    public ArrayList<GameSession> getActiveGameSessions() {
        return this.activeGameSessions;
    }

    /*
        @Brief: This function is used to get the game session by the session name.
        @Param: sessionName - The name of the session.
        @Return: GameSession - Returns the game session.
    */
    public GameSession getGameSession(String sessionName) {
        for (GameSession gameSession : this.activeGameSessions) {
            if (gameSession.getSessionName().equals(sessionName)) {
                return gameSession;
            }
        }
        return null;
    }

    /*
        @Brief: This function is used to add a player to the game session.
        @Param: email - The email of the player.
        @Param: sessionName - The name of the session.
    */
    public void addPlayerToGameSession(String email, String sessionName) {
        User user = this.dbController.getUser(email);
        Player player = new Player(user.getUsername(), user.getId());
        GameSession gameSession = getGameSession(sessionName);
        gameSession.appendPlayer(player);
    }

    /*
        @Brief: This function is used to remove a player from the game session.
        @Param: email - The email of the player.
        @Param: sessionName - The name of the session.
    */
    public void removePlayerFromGameSession(String email, String sessionName) {
        User user = this.dbController.getUser(email);
        Player player = new Player(user.getUsername(), user.getId());
        GameSession gameSession = getGameSession(sessionName);
        gameSession.deletePlayer(player);
    }



}
