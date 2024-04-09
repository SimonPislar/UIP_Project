package org.Server.Game;

import java.util.ArrayList;

public class Round {

    private final ArrayList<Drawing> drawings;
    private final int roundID;

    public Round(int roundID) {
        this.roundID = roundID;
        this.drawings = new ArrayList<Drawing>();
    }

    /*
        @Brief: This function is used to get the round ID.
        @Return: int - Returns the round ID.
    */
    public int getRoundID() {
        return this.roundID;
    }

    /*
        @Brief: This function is used to append a drawing to the drawings list.
        @Param: Drawing - The drawing to append.
    */
    public void appendDrawing(Drawing drawing) {
        this.drawings.add(drawing);
    }

    /*
        @Brief: This function is used to get the drawings for the round.
        @Return: ArrayList<Drawing> - Returns the drawings.
    */
    public ArrayList<Drawing> getDrawings() {
        return this.drawings;
    }
}
