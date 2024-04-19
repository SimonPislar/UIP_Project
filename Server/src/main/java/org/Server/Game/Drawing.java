package org.Server.Game;

import org.Server.Pair;
import java.util.ArrayList;

public class Drawing {

    private final ArrayList<Integer> points; // TODO: investigate if this is the correct data type for drawing
    private final String tool;
    private final ArrayList<Pair<Player, String>> guesses;
    private final int drawingId;
    private final int playerId;

    public Drawing(ArrayList<Integer> points, int drawingId, int playerId) {
        this.points = points;
        this.tool = ""; // TODO: Implement tool selection
        this.guesses = new ArrayList<Pair<Player, String>>();
        this.drawingId = drawingId;
        this.playerId = playerId;
    }

    /*
        @Brief: This function is used to get the data of the drawing.
        @Return: ArrayList<Integer> - Returns the points.
     */
    public ArrayList<Integer> getPoints() {
        return this.points;
    }

    /*
        @Brief: This function is used to get the tool of the drawing.
        @Return: String - Returns the tool.
     */
    public String getTool() {
        return this.tool;
    }

    /*
        @Brief: This function is used to get the guesses of the drawing.
        @Return: ArrayList<Pair<Player, String>> - Returns the guesses.
     */
    public ArrayList<Pair<Player, String>> getGuesses() {
        return this.guesses;
    }

    /*
        @Brief: This function is used to add a guess to the drawing.
        @Param: player - The player who made the guess.
        @Param: guess - The guess made by the player.
        @Return: void - Returns nothing.
     */
    public void addGuess(Player player, String guess) {
        this.guesses.add(new Pair<Player, String>(player, guess));
    }

    /*
        @Brief: This function is used to get the drawing id.
        @Return: int - Returns the drawing id.
     */
    public int getDrawingId() {
        return this.drawingId;
    }

}
