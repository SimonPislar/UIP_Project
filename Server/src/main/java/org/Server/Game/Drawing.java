package org.Server.Game;

// This class represents a drawing in the game.
public class Drawing {

    private final String painterEmail;

    private final String drawing;

    private String guesserEmail;

    private String guess;

    public Drawing(String painterEmail, String drawing) {
        this.painterEmail = painterEmail;
        this.drawing = drawing;
    }

    public String getPainterEmail() {
        return this.painterEmail;
    }

    public void setGuess(String guess) {
        this.guess = guess;
    }

    public String getGuess() {
        return this.guess;
    }

    public String getDrawingData() {
        return this.drawing;
    }

    public void setGuesserEmail(String guesserEmail) {
        this.guesserEmail = guesserEmail;
    }

    public String getGuesserEmail() {
        return this.guesserEmail;
    }
}
