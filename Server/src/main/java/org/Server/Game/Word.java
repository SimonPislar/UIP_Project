package org.Server.Game;

// This class represents a word in the game.
public class Word {

    private final String word;
    private final String authorEmail;

    public Word(String word, String authorEmail) {
        this.word = word;
        this.authorEmail = authorEmail;
    }

    public String getWord() {
        return this.word;
    }

    public String getAuthorEmail() {
        return this.authorEmail;
    }

}
