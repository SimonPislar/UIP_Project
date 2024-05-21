package org.Server.Game;

import org.Server.DBMS.DBController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.Server.DBMS.User;

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
    public boolean initializeGame(String email, String sessionName, int playerCount, String IP) {
        User user = this.dbController.getUser(email);
        Player player = new Player(user.getUsername(), user.getId(), IP);
        for (GameSession gameSession : this.activeGameSessions) {
            if (gameSession.getSessionName().equals(sessionName) || gameSession.getPlayers().get(0).getID() == user.getId()) {
                return false;
            }
        }
        GameSession gameSession = new GameSession(playerCount, player, sessionName);
        this.activeGameSessions.add(gameSession);
        System.out.println("Game session created: " + sessionName + " with " + playerCount + " players.");
        return true;
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
        @Brief: This function is used to get the game session that a player is a part of.
        @Param: email - The email of the player.
        @Return: String - Returns the name of the game session.
    */
    public String getGameSessionName(String email) {
        User user = this.dbController.getUser(email);
        for (GameSession gameSession : this.activeGameSessions) {
            for (Player player : gameSession.getPlayers()) {
                if (player.getID() == user.getId()) {
                    return gameSession.getSessionName();
                }
            }
        }
        return null;
    }

    public ArrayList<String> getPlayersInGameSession(String sessionName) {
        ArrayList<GameSession> activeGameSessions = getActiveGameSessions();
        for (GameSession gs : activeGameSessions) {
            if (gs.getSessionName().equals(sessionName)) {
                ArrayList<String> players = new ArrayList<>();
                for (Player p : gs.getPlayers()) {
                    players.add(p.getName());
                }
                return players;
            }
        }
        return null;
    }

    /*
        @Brief: This function is used to add a player to the game session.
        @Param: email - The email of the player.
        @Param: IP - The IP of the player.
        @Param: sessionName - The name of the session.
    */
    public boolean addPlayerToGameSession(String email, String sessionName, String IP) {
        User user = this.dbController.getUser(email);
        Player player = new Player(user.getUsername(), user.getId(), IP);
        ArrayList<GameSession> activeGameSessions = getActiveGameSessions();
        for (GameSession gs : activeGameSessions) {
            for (Player p : gs.getPlayers()) {
                if (p.getID() == player.getID()) {
                    return false;
                }
            }
        }
        GameSession gameSession = getGameSession(sessionName);
        if (gameSession == null) {
            return false;
        }
        if (gameSession.getPlayers().size() == gameSession.getPlayerCount()) {
            return false;
        }
        gameSession.appendPlayer(player);
        return true;
    }

    /*
        @Brief: This function is used to remove a player from the game session.
        @Param: email - The email of the player.
        @Param: sessionName - The name of the session.
    */
    public void removePlayerFromGameSession(String email, String sessionName) {
        User user = this.dbController.getUser(email);
        this.activeGameSessions.forEach(gameSession -> {
            if (gameSession.getSessionName().equals(sessionName)) {
                gameSession.getPlayers().removeIf(player -> player.getID() == user.getId());
            }
        });
    }

    /*
        @Brief: This function is used to change the player count of the game session.
        @Param: sessionName - The name of the session.
        @Param: playerCount - The new player count.
    */
    public void changePlayerCount(String sessionName, int playerCount) {
        this.activeGameSessions.forEach(gameSession -> {
            if (gameSession.getSessionName().equals(sessionName)) {
                gameSession.setPlayerCount(playerCount);
            }
        });
    }
}
