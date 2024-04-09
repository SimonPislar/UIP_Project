package org.Server.Game;

import java.util.ArrayList;

public class GameSession {

    private int playerCount;
    private ArrayList<Player> players;
    private String[] words;
    private ArrayList<Round> rounds;

    public GameSession(int playerCount) {
        this.playerCount = playerCount;
        this.words = new String[playerCount];
        this.players = new ArrayList<Player>();
        this.rounds = new ArrayList<Round>();
    }

    /*
        @Brief: This function is used to get the rounds for the game session.
        @Return: ArrayList<Round> - Returns the rounds.
    */
    public ArrayList<Round> getRounds() {
        return this.rounds;
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
        @Brief: This function is used to get the starting words for the game session.
        @Return: String[] - Returns the words.
    */
    public String[] getWords() {
        return this.words;
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
        @Brief: This function is used to set the words for the game session.
        @Param: words - The words to be set.
        @Return: void - Returns nothing.
    */
    public void setWords(String[] words) {
        if (words.length > this.playerCount) {
            String[] shortenedWords = new String[this.playerCount];
            System.arraycopy(words, 0, shortenedWords, 0, this.playerCount);
            this.words = shortenedWords;
        } else {
            this.words = words;
        }
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
        @Brief: This function is used to append a round to the game session.
        @Param: round - The round to be appended.
        @Return: void - Returns nothing.
    */
    public void appendRound(Round round) {
        this.rounds.add(round);
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
        @Brief: This function is used to reset the game session.
        @Return: void - Returns nothing.
    */
    public void reset() {
        this.rounds.clear();
        this.words = new String[this.playerCount];
        this.players.forEach(Player::resetPoints);
    }
}
