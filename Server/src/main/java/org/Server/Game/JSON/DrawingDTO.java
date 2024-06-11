package org.Server.Game.JSON;


// This class is responsible for representing a drawing when it is sent to the client.
public class DrawingDTO {
    private String painterEmail;
    private String drawing;
    private String guesserEmail;
    private String guess;

    // Getters and Setters

    public String getPainterEmail() {
        return painterEmail;
    }

    public void setPainterEmail(String painterEmail) {
        this.painterEmail = painterEmail;
    }

    public String getDrawing() {
        return drawing;
    }

    public void setDrawing(String drawing) {
        this.drawing = drawing;
    }

    public String getGuesserEmail() {
        return guesserEmail;
    }

    public void setGuesserEmail(String guesserEmail) {
        this.guesserEmail = guesserEmail;
    }

    public String getGuess() {
        return guess;
    }

    public void setGuess(String guess) {
        this.guess = guess;
    }
}
