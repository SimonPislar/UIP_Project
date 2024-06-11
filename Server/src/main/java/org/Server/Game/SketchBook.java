package org.Server.Game;

import java.util.ArrayList;

// This class represents a sketchbook in the game.
public class SketchBook {

    private final String ownersEmail;

    private final String originalWord;

    private final ArrayList<Drawing> drawings;

    public SketchBook(String owner, String originalWord) {
        this.ownersEmail = owner;
        this.originalWord = originalWord;
        this.drawings = new ArrayList<>();
    }

    public void addDrawing(Drawing drawing) {
        this.drawings.add(drawing);
    }

    public ArrayList<Drawing> getDrawings() {
        return this.drawings;
    }

    public String getOwnersEmail() {
        return this.ownersEmail;
    }

    public String getOriginalWord() {
        return this.originalWord;
    }

    public Drawing getLastDrawing() {
        return this.drawings.get(this.drawings.size() - 1);
    }

}
