package org.Server.Game;

import org.Server.Communications.Sender;
import org.Server.Game.JSON.SketchbookController;
import org.Server.ServerController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.Server.DBMS.User;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Component
public class GameController {

    private final ServerController serverController;
    private final ArrayList<GameSession> activeGameSessions;
    private final ArrayList<GameSession> inactiveGameSessions;
    private final Sender sender;

    // Auto-wired means that Spring will automatically create an instance of ServerController and Sender and pass it to the constructor.
    @Autowired
    public GameController(ServerController serverController, Sender sender) {
        this.activeGameSessions = new ArrayList<>();
        this.inactiveGameSessions = new ArrayList<>();
        this.serverController = serverController;
        this.sender = sender;
    }

    /*
        @Brief: This function is used to initialize the game.
        @Param: email - The email of the player.
        @Param: sessionName - The name of the session.
        @Param: playerCount - The number of players in the game.
        @Return: boolean - Returns true if the game was initialized, false otherwise.
    */
    public boolean initializeGame(String email, String sessionName, int playerCount) {
        User user = this.serverController.getUser(email);
        Player player = new Player(user.getUsername(), user.getId(), email);
        for (GameSession gameSession : this.activeGameSessions) {
            if (gameSession.getSessionName().equals(sessionName) || gameSession.getPlayers().get(0).getID() == user.getId()) {
                return false;
            }
        }
        GameSession gameSession = new GameSession(playerCount, player, sessionName);
        this.activeGameSessions.add(gameSession);
        System.out.println("Game session created: " + sessionName + " with " + playerCount + " players.");
        String messageContent = String.format("{\"message\":\"newgame\", \"lobby\":\"%s\"}", gameSession.getSessionName());
        Runnable informAboutNewGame = () -> serverController.messageAllUsers(messageContent);
        serverController.scheduleAsyncTask(informAboutNewGame, 1);
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
        User user = this.serverController.getUser(email);
        for (GameSession gameSession : this.activeGameSessions) {
            for (Player player : gameSession.getPlayers()) {
                if (player.getID() == user.getId()) {
                    return gameSession.getSessionName();
                }
            }
        }
        return null;
    }

    /*
        @Brief: This function is used to get the players in a game session.
        @Param: sessionName - The name of the session.
        @Return: ArrayList<String> - Returns the players in the game session.
    */
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
    public boolean addPlayerToGameSession(String email, String sessionName) {
        User user = this.serverController.getUser(email);
        Player player = new Player(user.getUsername(), user.getId(), email);
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
        for (Player p : gameSession.getPlayers()) {
            try {
                sender.sendMessageToUser(p.getEmail(), "{\"message\":\"playerjoined\", \"player\":\"" + player.getName() + "\"}");
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        gameSession.appendPlayer(player);
        return true;
    }

    /*
        @Brief: This function is used to kick all players from the game session.
        @Param: players - The players to be kicked.
    */
    private void kickAllPlayers(ArrayList<Player> players) {
        for (Player player : players) {
            try {
                sender.sendMessageToUser(player.getEmail(), "{\"message\":\"kicked\"}");
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    /*
        @Brief: This function is used to remove a player from the game session without checking if the player is the last player.
        @Param: email - The email of the player.
    */
    public boolean removePlayerFromGameSessionWithoutCheck(String email) {
        GameSession gameSession = getGameSession(getGameSessionName(email));
        if (gameSession == null) {
            return false;
        }
        gameSession.deletePlayer(email);
        if (gameSession.getPlayers().isEmpty()) {
            this.activeGameSessions.remove(gameSession);
        }
        return true;
    }

    /*
        @Brief: This function is used to remove a player from the game session.
        @Param: email - The email of the player.
        @Param: sessionName - The name of the session.
    */
    public boolean removePlayerFromGameSession(String email) {
        GameSession gameSession = getGameSession(getGameSessionName(email));
        if (gameSession == null) {
            return false;
        }
        if (gameSession.getPlayers().get(0).getEmail().equals(email)) {
            ArrayList<Player> playersCopy = new ArrayList<>(gameSession.getPlayers());
            Runnable kickPlayers = () -> kickAllPlayers(playersCopy);
            serverController.scheduleAsyncTask(kickPlayers, 1);
            int playerCount = gameSession.getPlayers().size();
            for (int i = 0; i < playerCount; i++) {
                gameSession.deletePlayer(gameSession.getLastPlayer());
            }
            this.activeGameSessions.remove(gameSession);
        } else {
            gameSession.deletePlayer(email);
        }
        return true;
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

    /*
        @Brief: This function is used to prepare the game.
        @Param: gameSession - The game session to be prepared.
     */
    private void prepareGame(GameSession gameSession) {
        gameSession.setGameOrder();
        for (int i = 0; i < gameSession.getPlayerCount(); i++) {
            Word originalWord = gameSession.getOriginalWords().get(i);
            SketchBook sketchBook = new SketchBook(originalWord.getAuthorEmail(), originalWord.getWord());
            System.out.println("Sketchbook created for " + originalWord.getAuthorEmail() + " with word " + originalWord.getWord());
            gameSession.getGameOrder().forEach(player -> {
                if (player.getEmail().equals(originalWord.getAuthorEmail())) {
                    System.out.println("Setting sketchbook for " + player.getEmail());
                    player.setSketchBook(sketchBook);
                }
            });
        }
        // Account for different rules for odd/even player counts
        if (gameSession.getPlayers().size() % 2 != 0) {
            // Rotates the sketchbooks so that a player doesn't get their own sketchbook
            gameSession.rotateSketchBooks();
        }
        // Send the original words to the players
        for (Player player : gameSession.getPlayers()) {
            String playerEmail = player.getEmail();
            String originalWord = player.getSketchBook().getOriginalWord();
            String messageContent = String.format("{\"message\":\"word\", \"word\":\"%s\"}", originalWord);
            try {
                sender.sendMessageToUser(playerEmail, messageContent);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    /*
        @Brief: This function is used to add an original word to the game session.
        @Param: sessionName - The name of the session.
        @Param: word - The word to be added.
        @Param: email - The email of the player.
        @Return: boolean - Returns true if the word was added, false otherwise.
     */
    public boolean addWord(String wordToAdd, String gameSessionName, String email) {
        Word word = new Word(email, wordToAdd);
        GameSession gameSession = getGameSession(gameSessionName);
        if (gameSession.getPlayerCount() == gameSession.getOriginalWords().size()) {
            return false;
        }
        gameSession.addOriginalWord(word);
        if (gameSession.getPlayers().size() == gameSession.getOriginalWords().size()) { // All players have added their words
            Runnable gameStarter = () -> prepareGame(gameSession);
            serverController.scheduleAsyncTask(gameStarter, 2);
        }
        return true;
    }

    /*
        @Brief: This function is used to send the drawings to the players.
        @Param: gameSession - The game session.
     */
    private void sendDrawings(GameSession gameSession) {
        gameSession.getGameOrder().forEach(player -> {
            String email = player.getEmail();
            String rawDrawingData = player.getSketchBook().getLastDrawing().getDrawingData();
            String messageContent = String.format("{\"message\":\"drawing\", \"data\":\"%s\"}", rawDrawingData);
            try {
                sender.sendMessageToUser(email, messageContent);
            } catch (Exception e) {
                e.printStackTrace();
            }
        });
    }

    /*
        @Brief: This function is used to add a drawing to the game session.
        @Param: email - The email of the player.
        @Param: rawDrawingData - The raw drawing data.
        @Return: boolean - Returns true if the drawing was added, false otherwise.
     */
    public boolean addDrawing(String email, String rawDrawingData) {
        GameSession gameSession = getGameSession(getGameSessionName(email));
        if (gameSession == null) {
            return false;
        }
        Drawing drawing = new Drawing(email, rawDrawingData);
        gameSession.getGameOrder().forEach(player -> {
            if (player.getEmail().equals(email)) {
                player.getSketchBook().addDrawing(drawing);
            }
        });
        boolean allDrawingsReceived = false;
        ArrayList<Player> gameOrder = gameSession.getGameOrder();
        for (int i = 0; i < gameOrder.size(); i++) {
            if (gameOrder.get(i).getSketchBook().getDrawings().size() == gameOrder.get((i + 1) % gameOrder.size()).getSketchBook().getDrawings().size()) {
                allDrawingsReceived = true;
            } else {
                allDrawingsReceived = false;
                break;
            }
        }
        // If all drawings have been received, send the drawings to the players
        if (allDrawingsReceived) {
            gameSession.rotateSketchBooks();
            Runnable sendDrawings = () -> sendDrawings(gameSession);
            serverController.scheduleAsyncTask(sendDrawings, 2);
        }
        return true;
    }

    /*
        @Brief: This function is used to send the guesses to the players.
        @Param: gameSession - The game session.
     */
    private void sendGuesses(GameSession gameSession) {
        gameSession.getGameOrder().forEach(player -> {
            String email = player.getEmail();
            String guess = player.getSketchBook().getLastDrawing().getGuess();
            String messageContent = String.format("{\"message\":\"guess\", \"guess\":\"%s\"}", guess);
            try {
                sender.sendMessageToUser(email, messageContent);
            } catch (Exception e) {
                e.printStackTrace();
            }
        });
    }

    // This function is used to check if the game is finished.
    private boolean gameIsFinished(GameSession gameSession) {
        Player player = gameSession.getGameOrder().get(0);
        return player.getSketchBook().getOwnersEmail().equals(player.getEmail());
    }

    /*
        @Brief: This function is used to send the sketchbooks to the players.
        @Param: gameSession - The game session.
        @Param: sketchBooks - The sketchbooks to be sent.
     */
    private void sendSketchbooks(GameSession gameSession, ArrayList<SketchBook> sketchBooks) {
        for (Player player : gameSession.getPlayers()) {
            try {
                sender.sendSketchbookData(player.getEmail(), sketchBooks);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    /*
        @Brief: This function is used to send the end game message to the players.
        @Param: gameSession - The game session.
     */
    private void sendEndGame(GameSession gameSession) {
        gameSession.getGameOrder().forEach(player -> {
            String email = player.getEmail();
            String messageContent = "{\"message\":\"gameend\"}";
            try {
                sender.sendMessageToUser(email, messageContent);
            } catch (Exception e) {
                e.printStackTrace();
            }
        });
        ArrayList<SketchBook> sketchBooks = new ArrayList<>();
        gameSession.getGameOrder().forEach(player -> sketchBooks.add(player.getSketchBook()));
        Runnable sendSketchbooks = () -> sendSketchbooks(gameSession, sketchBooks);
        serverController.scheduleAsyncTask(sendSketchbooks, 2);
    }

    /*
        @Brief: This function is used to add a guess to the game session.
        @Param: email - The email of the player.
        @Param: guess - The guess to be added.
        @Return: boolean - Returns true if the guess was added, false otherwise.
     */
    public boolean addGuess(String email, String guess) {
        GameSession gameSession = getGameSession(getGameSessionName(email));
        if (gameSession == null) {
            return false;
        }
        Player player = gameSession.getPlayers().stream().filter(p ->
                p.getEmail().equals(email)).findFirst().orElse(null);
        if (player == null) {
            return false;
        }
        Drawing drawing = player.getSketchBook().getLastDrawing();
        drawing.setGuess(guess);
        drawing.setGuesserEmail(email);
        boolean allGuessesReceived = true;
        for (Player p : gameSession.getGameOrder()) {
            if (p.getSketchBook().getLastDrawing().getGuess() == null) {
                allGuessesReceived = false;
                break;
            }
        }
        // If all guesses have been received, rotate the sketchbooks and send the guesses to the players
        if (allGuessesReceived) {
            gameSession.rotateSketchBooks();
            // Check if the game is finished
            if (gameIsFinished(gameSession)) {
                System.out.println(gameSession.getSessionName() + " is finished!");
                // Send the end game message to the players
                Runnable gameEnder = () -> sendEndGame(gameSession);
                serverController.scheduleAsyncTask(gameEnder, 2);
            } else {
                Runnable sendGuesses = () -> sendGuesses(gameSession);
                serverController.scheduleAsyncTask(sendGuesses, 2);
            }
        }
        return true;
    }

    /*
        @Brief: This function is used to send the sketchbooks to the players.
        @Param: email - The email of the player.
        @Param: sketchBooks - The sketchbooks to be sent.
     */
    private void sendSketchbooks(String email, ArrayList<SketchBook> sketchBooks) {
        try {
            sender.sendSketchbookData(email, sketchBooks);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /*
        @Brief: This function is used to send the sketchbook data to the player.
        @Param: email - The email of the player.
        @Note: This method is only used for development purposes.
     */
    public void sendSketchbookData(String email) {
        GameSession gameSession = getGameSession(getGameSessionName(email));
        ArrayList<SketchBook> sketchBooks = new ArrayList<>();
        gameSession.getGameOrder().forEach(player -> sketchBooks.add(player.getSketchBook()));
        Runnable sendSketchbooks = () -> sendSketchbooks(email, sketchBooks);
        serverController.scheduleAsyncTask(sendSketchbooks, 2);
    }
}
