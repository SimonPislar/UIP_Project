package org.Server.Game;

import org.Server.Pair;

import java.util.ArrayList;
import java.util.Collections;

// This class represents a game session.
public class GameSession {

    private int playerCount;
    private final ArrayList<Player> players;
    private final ArrayList<Word> originalWords;
    private final String sessionName;
    private final ArrayList<Player> gameOrder;

    /*
        @Brief: This constructor is used to initialize the game session.
        @Param: playerCount - The player count for the game session.
        @Param: playerName - The name of the player.
    */
    public GameSession(int playerCount, Player player, String sessionName) {
        this.playerCount = playerCount;
        this.originalWords = new ArrayList<>();
        this.players = new ArrayList<>();
        this.sessionName = sessionName;
        this.players.add(player);
        this.gameOrder = new ArrayList<>();
    }

    // Gets the last player in the list of players
    public Player getLastPlayer() {
        return this.players.get(this.players.size() - 1);
    }

    /*
        @Brief: This function is used to rotate the sketch books of the players.
        @Return: void - Returns nothing.
     */
    public void rotateSketchBooks() {
        ArrayList<SketchBook> sketchBooks = new ArrayList<>();
        this.gameOrder.forEach(player -> {
            sketchBooks.add(player.getSketchBook());
        });

        for (int i = 0; i < this.gameOrder.size(); i++) {
            this.gameOrder.get(i).setSketchBook(sketchBooks.get((i + 1) % gameOrder.size()));
        }
    }


    // Sets the game order
    public void setGameOrder() {
        this.gameOrder.addAll(this.players);
        Collections.shuffle(this.gameOrder);
    }

    /*
        @Brief: This function is used to add a word to the game session along with its author.
        @Param: word - The word and author to be added.
        @Return: void - Returns nothing.
    */
    public void addOriginalWord(Word word) {
        this.originalWords.add(word);
    }

    public ArrayList<Word> getOriginalWords() {
        return this.originalWords;
    }

    public ArrayList<Player> getGameOrder() {
        return this.gameOrder;
    }

    /*
        @Brief: This function is used to get the session name for the game session.
        @Return: String - Returns the session name.
     */
    public String getSessionName() {
        return this.sessionName;
    }


    /*
        @Brief: This function is used to get the round count for the game session.
        @Return: int - Returns the round count.
        @Note: The round count is the player count + 1 if the player count is even according to the game rules.
    */
    public int getRoundCount(){
        if (this.playerCount % 2 == 0) {
            return this.playerCount + 1;
        } else {
            return this.playerCount;
        }
    }

    /*
        @Brief: This function is used to get the players for the game session.
        @Return: ArrayList<Player> - Returns the players.
    */
    public ArrayList<Player> getPlayers() {
        return this.players;
    }

    /*
        @Brief: This function is used to get the player count for the game session.
        @Return: int - Returns the player count.
    */
    public int getPlayerCount() {
        return this.playerCount;
    }

    /*
        @Brief: This function is used to set the player count for the game session.
        @Param: playerCount - The player count to be set.
        @Return: void - Returns nothing.
    */
    public void setPlayerCount(int playerCount) {
        this.playerCount = playerCount;
    }

    /*
        @Brief: This function is used to append a player to the game session.
        @Param: player - The player to be appended.
        @Return: void - Returns nothing.
    */
    public void appendPlayer(Player player) {
        this.players.add(player);
    }

    /*
        @Brief: This function is used to delete a player from the game session.
        @Param: player - The player to be deleted.
        @Return: void - Returns nothing.
    */
    public void deletePlayer(Player player) {
        this.players.removeIf(p -> p.getName().equals(player.getName()));
    }

    /*
        @Brief: This function is used to delete a player from the game session.
        @Param: email - The email of the player to be deleted.
        @Return: void - Returns nothing.
    */
    public void deletePlayer(String email) {
        this.players.removeIf(p -> p.getEmail().equals(email));
    }

    /*
        @Brief: This function is used to reset the game session.
        @Return: void - Returns nothing.
    */
    public void reset() {
        this.players.forEach(Player::resetPoints);
        this.originalWords.clear();
    }
}
